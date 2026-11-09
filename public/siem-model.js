// Pure SIEM domain functions. Local guards are not a production authorization boundary.
export const providers = [
 ['gym','Gym / wellness schedule','planned'],['manual','Manual family events','local'],['ics','ICS calendar import','local'],['arena','Arena Pathway catalog','snapshot'],
 ...['TeamSnap','PlayMetrics','SportsEngine','Teamworks','Google Calendar','Outlook','Authorized email'].map(name=>[name,name,'planned'])
].map(([id,name,support])=>({id,name,support,status:support==='planned'?'unconnected':support==='snapshot'?'snapshot':'local only',lastSuccess:null,error:null}));
export const empty=()=>({version:1,familyId:'local-family',athletes:[],events:[],actions:{},audit:[],permissions:{recruiting:false,lockedIn:false},wellness:{enabled:false}});
const clean=(x,n=180)=>String(x??'').slice(0,n);
export function authorize(state,ctx,athleteId){
 if(ctx.familyId!==state.familyId||ctx.role!=='parent'||!ctx.athleteIds.includes(athleteId)||!state.athletes.some(a=>a.id===athleteId))throw Error('Access denied');
}
export function safeURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
export function normalize(raw,state,ctx){
 authorize(state,ctx,raw.athleteId);
 if(!providers.some(p=>p.id===raw.source))throw Error('Unknown provider');
 if(providers.find(p=>p.id===raw.source).support==='planned')throw Error('Provider is unconnected; use an approved local import or manual entry');
 const athlete=state.athletes.find(a=>a.id===raw.athleteId);
 if(!raw.ref||!raw.title||!Number.isFinite(Date.parse(raw.start))||!Number.isFinite(Date.parse(raw.end))||Date.parse(raw.end)<=Date.parse(raw.start))throw Error('Title, stable reference and valid start/end required');
 if(raw.sport&&raw.sport!==athlete.sport)throw Error('Sport scope mismatch');
 return {participantType:athlete.type==='parent'?'parent':'athlete',bookingState:['available','interest','confirmed'].includes(raw.bookingState)?raw.bookingState:'confirmed',activity:clean(raw.activity,50),familyId:state.familyId,athleteId:athlete.id,sport:athlete.sport,organization:clean(raw.organization,80),team:clean(raw.team,80),source:raw.source,ref:clean(raw.ref),title:clean(raw.title,100),type:['game','practice','deadline','communication','opportunity','recruiting','lockedIn'].includes(raw.type)?raw.type:'practice',start:new Date(raw.start).toISOString(),end:new Date(raw.end).toISOString(),location:clean(raw.location),status:raw.status==='canceled'?'canceled':'scheduled',verified:false,sourceURL:safeURL(raw.sourceURL),evidence:clean(raw.evidence),requirements:(raw.requirements||[]).slice(0,10).map(r=>({id:clean(r.id,50),label:clean(r.label,80),complete:r.complete===true})),receivedAt:new Date().toISOString()};
}
const tracked=e=>JSON.stringify(Object.fromEntries(['title','type','start','end','location','status','requirements','verified','evidence','sourceURL','organization','team','bookingState','activity'].map(k=>[k,e[k]])));
export function upsert(state,ctx,raw){
 const e=normalize(raw,state,ctx);
 if(['recruiting','lockedIn'].includes(e.type)&&!state.permissions[e.type])throw Error('Product status consent required');
 const id=[e.familyId,e.athleteId,e.source,e.ref].map(encodeURIComponent).join(':');
 const old=state.events.find(x=>x.id===id);
 if(old&&tracked(old)===tracked(e))return old;
 const next={...e,id,version:(old?.version||0)+1,history:[...(old?.history||[]),...(old?[{...Object.fromEntries(Object.entries(old).filter(([k])=>k!=='history')),changedAt:e.receivedAt}]:[])]};
 state.events=state.events.filter(x=>x.id!==id).concat(next);state.audit.push({at:e.receivedAt,actor:ctx.id,action:old?'event.updated':'event.created',athleteId:e.athleteId,eventId:id});return next;
}
export function scoped(state,ctx,filters={}){
 return state.events.filter(e=>{try{authorize(state,ctx,e.athleteId);}catch{return false;}if(['recruiting','lockedIn'].includes(e.type)&&!state.permissions[e.type])return false;return (!filters.athlete||e.athleteId===filters.athlete)&&(!filters.sport||e.sport===filters.sport)&&(!filters.organization||e.organization===filters.organization)&&(!filters.source||e.source===filters.source);});
}
export function detect(state,ctx,now=Date.now()){
 const events=scoped(state,ctx),out=[];
 const add=(type,priority,es,title)=>{const id=type+':'+es.map(e=>e.id+'@'+e.version).sort().join('|');out.push({id,type,priority,eventIds:es.map(e=>e.id),athleteIds:[...new Set(es.map(e=>e.athleteId))],title,evidence:es.map(e=>({source:e.source,ref:e.ref,url:e.sourceURL,text:e.evidence,verified:e.verified})),...(state.actions[id]||{status:'open'})});};
 for(const e of events){
 if(e.status==='canceled')add('canceled',1,[e],e.title+' was canceled');
 else if(e.version>1)add('changed',2,[e],e.title+' changed — review history');
 if(e.status!=='canceled'&&Date.parse(e.end)>=now){
 if(e.type==='deadline'&&Date.parse(e.start)-now<=7*864e5)add('deadline',Date.parse(e.start)-now<48*36e5?1:2,[e],e.title+' deadline');
 if(e.requirements.some(r=>!r.complete))add('incomplete',2,[e],e.title+' has incomplete requirements');
 if(e.type==='opportunity')add('opportunity',3,[e],e.title+' may fit your pathway');
 }
 }
 for(let i=0;i<events.length;i++)for(let j=i+1;j<events.length;j++){
 const a=events[i],b=events[j];if(a.bookingState!=='confirmed'||b.bookingState!=='confirmed')continue;if(a.status==='canceled'||b.status==='canceled'||Math.max(Date.parse(a.end),Date.parse(b.end))<now)continue;
 const duplicate=a.athleteId===b.athleteId&&a.source!==b.source&&a.title.toLowerCase().trim()===b.title.toLowerCase().trim()&&a.start===b.start&&a.end===b.end;
 if(duplicate)add('duplicate',3,[a,b],'Possible duplicate: '+a.title);
 else if(!['deadline','communication','opportunity','recruiting','lockedIn'].includes(a.type)&&!['deadline','communication','opportunity','recruiting','lockedIn'].includes(b.type)&&a.start<b.end&&b.start<a.end)add('conflict',1,[a,b],a.athleteId===b.athleteId?'Athlete schedule conflict':'Family logistics overlap');
 }
 return out.sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
}
export function act(state,ctx,id,operation,remindAt=null,now=Date.now()){
 const alert=detect(state,ctx,now).find(a=>a.id===id);if(!alert)throw Error('Alert unavailable');for(const athlete of alert.athleteIds)authorize(state,ctx,athlete);
 if(!['acknowledged','resolved','open','reminder'].includes(operation))throw Error('Invalid action');
 if(operation==='reminder'&&(!Number.isFinite(Date.parse(remindAt))||Date.parse(remindAt)<=Date.now()))throw Error('Future reminder required');
 state.actions[id]={status:operation==='reminder'?(state.actions[id]?.status||'open'):operation,remindAt:operation==='reminder'?new Date(remindAt).toISOString():null,updatedAt:new Date().toISOString()};
 state.audit.push({at:new Date().toISOString(),actor:ctx.id,action:operation,alertId:id});
}
export function syncResult(provider,{error=null,now=new Date().toISOString()}={}){
 if(provider.support==='planned')return {...provider,status:'unconnected',error:'Approved interface and credentials required'};
 return {...provider,status:error?'failed':'local only',error:error?clean(error):null,lastSuccess:error?provider.lastSuccess:now};
}
export const stale=(provider,now=Date.now())=>!Number.isFinite(Date.parse(provider.lastSuccess))||now-Date.parse(provider.lastSuccess)>864e5;
// Deliberately bounded ICS support: explicit UTC times, no recurrence, timezone or all-day inference.
export function parseICS(text,athleteId){
 if(text.length>500000)throw Error('ICS exceeds 500 KB');
 const blocks=text.replace(/\r?\n[ \t]/g,'').match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g)||[];
 if(!blocks.length||blocks.length>500)throw Error('Expected 1–500 VEVENT records');
 return blocks.map(block=>{
 const lines=block.split(/\r?\n/),get=key=>lines.find(l=>l.startsWith(key+':'))?.slice(key.length+1)||'';
 if(lines.some(l=>/^(RRULE|RDATE|EXDATE|RECURRENCE-ID|DTSTART;|DTEND;)/.test(l)))throw Error('Only non-recurring UTC DTSTART/DTEND supported; import rejected without changes');
 const date=v=>{if(!/^\d{8}T\d{6}Z$/.test(v))throw Error('Explicit UTC start and end required');const iso=v.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,'$1-$2-$3T$4:$5:$6Z');if(!Number.isFinite(Date.parse(iso))||new Date(iso).toISOString()!==iso.replace('Z','.000Z'))throw Error('Invalid ICS date');return iso;};
 const decode=v=>v.replace(/\\n/gi,' ').replace(/\\([,;\\])/g,'$1');
 return {athleteId,source:'ics',ref:get('UID'),title:decode(get('SUMMARY')),start:date(get('DTSTART')),end:date(get('DTEND')),location:decode(get('LOCATION')),sourceURL:get('URL'),status:get('STATUS')==='CANCELLED'?'canceled':'scheduled',verified:false,evidence:'User-imported ICS; organizer confirmation required'};
 });
}
export function productStatus(state,ctx,{product,athleteId,ref,status,start,end,url}){
 if(!['recruiting','lockedIn'].includes(product)||!['needs-attention','complete','pending'].includes(status))throw Error('Invalid minimal status');
 return upsert(state,ctx,{athleteId,source:'arena',ref:product+':'+ref,type:product,title:product+' · '+status,start,end,sourceURL:url,evidence:'Permissioned product status only; open originating product for details',verified:false});
}
export const gymConnector={id:'gym',name:'Gym / wellness schedule',support:'planned',interfaces:['official-api','ics','approved-export','manual'],status:'unconnected',lastSuccess:null,error:null};
export function wellnessSuggestions(state,ctx,{enabled=false,windows=[],preferredTypes=[],travelMinutes=0,pickupMinutes=0}={}){
 if(!enabled)return [];
 if(!Number.isFinite(travelMinutes)||travelMinutes<0||!Number.isFinite(pickupMinutes)||pickupMinutes<0)throw Error('Nonnegative travel and pickup minutes required');
 const es=scoped(state,ctx),buffer=(travelMinutes+pickupMinutes)*60000;
 return es.filter(e=>e.participantType==='parent'&&e.bookingState!=='confirmed'&&e.status!=='canceled'&&Date.parse(e.start)>Date.now()&&(!preferredTypes.length||preferredTypes.includes(e.activity))&&windows.some(w=>Date.parse(w.start)<=Date.parse(e.start)-buffer&&Date.parse(w.end)>=Date.parse(e.end)+buffer)&&!es.some(b=>b.id!==e.id&&b.status!=='canceled'&&b.bookingState==='confirmed'&&Date.parse(b.start)<Date.parse(e.end)+buffer&&Date.parse(b.end)>Date.parse(e.start)-buffer));
}

// Local recurrence expands bounded occurrences, never claims a recurring provider booking.
export function expandWeekly(raw,count=1){
 if(!Number.isInteger(count)||count<1||count>12)throw Error('Choose 1–12 weekly occurrences');
 const start=new Date(raw.start),end=new Date(raw.end);
 if(!Number.isFinite(+start)||!Number.isFinite(+end))throw Error('Valid dates required');
 return Array.from({length:count},(_,i)=>{const a=new Date(start),b=new Date(end);a.setDate(a.getDate()+7*i);b.setDate(b.getDate()+7*i);return {...raw,ref:count===1?raw.ref:raw.ref+':week:'+i,start:a.toISOString(),end:b.toISOString()};});
}
// Approved normalized exports only: callers supply records, not credentials or raw inboxes.
export function synchronize(state,ctx,provider,records){
 if(!['manual','ics','arena'].includes(provider.id))return {state,provider:syncResult(provider,{error:'Approved interface unavailable'}),imported:0};
 try{if(!Array.isArray(records)||records.length>500)throw Error('Invalid sync batch');const next=structuredClone(state);for(const raw of records){if(raw.source!==provider.id)throw Error('Source mismatch');upsert(next,ctx,raw);}return {state:next,provider:syncResult(provider),imported:records.length};}
 catch(error){return {state,provider:syncResult(provider,{error:error.message}),imported:0};}
}
