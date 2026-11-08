export const STORAGE_KEY='arenaPathway.v2';
export const validSports=['lacrosse','volleyball','basketball','swimming'];
export const validGoals=['teams','tryouts','camps','recruiting','community'];
const text=(v,n=100)=>typeof v==='string'?v.slice(0,n):'';
export function cleanProfile(p) {
 if(!p||typeof p!=='object'||!validSports.includes(p.sport))return null;
 return {id:text(p.id)||crypto.randomUUID(),nickname:text(p.nickname,40),role:p.role==='parent'?'parent':'athlete',guardian:p.role==='parent'&&p.guardian===true,sport:p.sport,region:['all','metro','north','west'].includes(p.region)?p.region:'all',goal:validGoals.includes(p.goal)?p.goal:'teams',interests:Array.isArray(p.interests)?p.interests.filter(x=>validGoals.includes(x)):[],mediaEnabled:p.mediaEnabled===true,mediaSources:p.mediaEnabled&&Array.isArray(p.mediaSources)?p.mediaSources.filter(x=>['du-news','club-updates'].includes(x)):[],saved:Array.isArray(p.saved)?[...new Set(p.saved.filter(x=>typeof x==='string'))]:[],plans:Array.isArray(p.plans)?p.plans.filter(x=>x&&typeof x.id==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.start)&&Number.isFinite(Date.parse(x.start))).map(x=>({id:text(x.id),name:text(x.name),start:x.start,note:text(x.note,180)})):[],recruiting:{checks:Array.isArray(p.recruiting?.checks)?p.recruiting.checks.filter(x=>['research','requirements','questions','review'].includes(x)):[],notes:text(p.recruiting?.notes,2000)}};
}
export function loadState(storage) {
 try {const raw=JSON.parse(storage.getItem(STORAGE_KEY)||'null');if(raw?.version===2){const profiles=(Array.isArray(raw.profiles)?raw.profiles:[]).map(cleanProfile).filter(Boolean);return {version:2,profiles,active:profiles.some(p=>p.id===raw.active)?raw.active:profiles[0]?.id||null};}
 } catch {}
 try {
 const old=JSON.parse(storage.getItem('arenaPathway')||'null');
 if(old?.sport){const sport=old.sport.toLowerCase();const p=cleanProfile({id:'migrated',sport,role:old.role==='Parent / Family'?'parent':'athlete',goal:({'Find Teams':'teams','Tryouts & Camps':'tryouts','Development':'camps','Recruiting':'recruiting','Community':'community'})[old.goal]});if(p)return {version:2,profiles:[p],active:p.id};}
 } catch {}return {version:2,profiles:[],active:null};
}
export function persist(storage,state){storage.setItem(STORAGE_KEY,JSON.stringify(state));}
export function toggleSaved(profile,id){profile.saved=profile.saved.includes(id)?profile.saved.filter(x=>x!==id):[...profile.saved,id];}
export function scheduleFor(profile,catalog){return [...catalog.opportunities.filter(o=>profile.saved.includes(o.id)&&o.start).map(o=>({...o,imported:true})),...profile.plans].sort((a,b)=>a.start.localeCompare(b.start));}
export function calendarText(events) {
 const escape=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const stamp=new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Arena Pathway//Local Planner//EN','CALSCALE:GREGORIAN'];
 for(const e of events){const end=new Date((e.end||e.start)+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);lines.push('BEGIN:VEVENT','UID:'+escape(e.id)+'@arena-pathway.local','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+e.start.replaceAll('-',''),'DTEND;VALUE=DATE:'+end.toISOString().slice(0,10).replaceAll('-',''),'SUMMARY:'+escape(e.name),'DESCRIPTION:'+escape(e.note||e.summary),'END:VEVENT');}
 lines.push('END:VCALENDAR');return lines.map(line=>{let chunks=[],part='';for(const c of line){if(new TextEncoder().encode(part+c).length>73){chunks.push(part);part=' '+c;}else part+=c;}return [...chunks,part].join('\r\n');}).join('\r\n')+'\r\n';
}
