import {loadState,persist,toggleSaved,scheduleFor,calendarText,validSports} from './state.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let storage;try{storage=localStorage;}catch{storage={getItem(){return null},setItem(){throw Error('Storage unavailable')}};}
let state=loadState(storage), data;
const active=()=>state.profiles.find(p=>p.id===state.active);
function notify(message){$('#toast').textContent=message;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').textContent='',5500);}
function store(next){try{persist(storage,next);state=next;return true;}catch{notify('Saving is unavailable in this browser. Enable local storage to keep your pathway.');return false;}}
const clone=()=>structuredClone(state);
function updateProfile(fn){const next=clone(),p=next.profiles.find(p=>p.id===next.active);if(!p)return false;fn(p);return store(next);}
function element(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function anchor(text,href,className){const a=element('a',text,className);a.href=href;return a;}
const cap=s=>s[0].toUpperCase()+s.slice(1);
const menu=$('#sports-menu');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
document.addEventListener('click',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
function refreshSaveButtons(){for(const b of $$('[data-save]')){const saved=active()?.saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(!!saved));b.textContent=saved?'Saved ✓':b.dataset.label||'Save';}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-save]');if(!b)return;const p=active();if(!p){notify('Build your pathway first to save programs and opportunities.');location.href='/build';return;}if(updateProfile(p=>toggleSaved(p,b.dataset.save))){refreshSaveButtons();if(document.body.dataset.page==='my-pathway')renderWorkspace();notify(active().saved.includes(b.dataset.save)?'Saved to this profile.':'Removed from this profile.');}});
refreshSaveButtons();
async function catalog(){if(!data){const r=await fetch('/api/catalog');if(!r.ok)throw Error('Catalog unavailable');data=await r.json();}return data;}
const form=$('#pathway-form');
if(form){
 const params=new URLSearchParams(location.search),p=params.has('new')?null:active();
 if(p){for(const key of ['nickname','role','sport','region','goal'])$('#'+key).value=p[key];$('#guardian').checked=p.guardian;for(const b of $$('[name=interests]'))b.checked=p.interests.includes(b.value);$('#media-enabled').checked=p.mediaEnabled;for(const b of $$('[name=media-source]'))b.checked=p.mediaSources.includes(b.value);}
 const chosen=params.get('sport')?.toLowerCase();if(validSports.includes(chosen))$('#sport').value=chosen;
 function controls(){const parent=$('#role').value==='parent';$('#parent-controls').hidden=!parent;$('#guardian').required=parent;const media=$('#media-enabled').checked;$('#media-options').hidden=!media;for(const b of $$('[name=media-source]')){b.disabled=!media;if(!media)b.checked=false;}}
 $('#role').addEventListener('change',controls);$('#media-enabled').addEventListener('change',controls);controls();
 form.addEventListener('submit',e=>{e.preventDefault();const mediaEnabled=$('#media-enabled').checked,mediaSources=$$('[name=media-source]:checked').map(x=>x.value);if(mediaEnabled&&!mediaSources.length){$('#form-status').textContent='Choose at least one media source, or turn media off.';return;}
 const next=clone();let profile=next.profiles.find(x=>x.id===p?.id);if(!profile){profile={id:crypto.randomUUID(),saved:[],plans:[],recruiting:{checks:[],notes:''}};next.profiles.push(profile);}
 Object.assign(profile,{nickname:$('#nickname').value.trim(),role:$('#role').value,guardian:$('#role').value==='parent'&&$('#guardian').checked,sport:$('#sport').value,region:$('#region').value,goal:$('#goal').value,interests:$$('[name=interests]:checked').map(x=>x.value),mediaEnabled,mediaSources:mediaEnabled?mediaSources:[]});next.active=profile.id;
 if(store(next)){// A migrated legacy profile is now stored in v2; remove the stale legacy copy.
 try{storage.removeItem('arenaPathway');}catch{}
 location.href='/my-pathway';}
 });
}
function findRecord(id){return [...data.organizations,...data.teams,...data.schools,...data.opportunities,...data.communities,...data.leagues].find(r=>r.id===id);}
function source(record){return data.sources.find(s=>s.id===record.sourceIds[0]);}
function recordCard(r){const node=element('article',undefined,'record');node.append(element('span',(r.kind||'team').replace('-',' '),'badge'),element('h3',r.name));let text=r.summary;if(!text&&r.organizationId){const parent=[...data.organizations,...data.schools,...data.leagues].find(o=>o.id===r.organizationId);text=parent.name+' · '+r.division+' · '+(r.season||'Season unconfirmed');}node.append(element('p',text||'Colorado program'));const row=element('div',undefined,'record-actions'),s=source(r);row.append(anchor('Official source ↗',s.url));const b=element('button','Save','secondary');b.dataset.save=r.id;b.setAttribute('aria-pressed','false');row.append(b);node.append(row,element('p','Source reviewed '+s.reviewedAt,'small'));return node;}
function parentCity(r){if(r.city)return r.city;return [...data.organizations,...data.schools,...data.leagues].find(o=>o.id===r.organizationId)?.city||'';}
function regionMatch(r,region){const city=parentCity(r);if(region==='all')return true;if(region==='north')return /Loveland|Windsor|Fort Collins/.test(city);if(region==='metro')return /Denver|Centennial|Englewood|Castle Rock|Front Range/.test(city);return /Aspen|Avon|Cortez|Delta|Durango|Gunnison|Meeker|Montrose|Ouray|Pagosa|Rangely|Silverthorne|Steamboat|Telluride/.test(city);}
function renderWorkspace(){
 const p=active();$('#workspace-empty').hidden=!!p;$('#workspace').hidden=!p;if(!p)return;
 const selector=$('#profile-select');selector.replaceChildren();for(const pr of state.profiles){const option=element('option',pr.nickname||cap(pr.sport)+' pathway');option.value=pr.id;selector.append(option);}selector.value=p.id;
 $('#add-profile').hidden=p.role!=='parent'||!p.guardian;
 const summary=$('#profile-summary');summary.replaceChildren(element('h2',p.nickname||'My '+cap(p.sport)+' pathway'),element('p',`${cap(p.sport)} · ${p.role==='parent'?'Parent-managed family profile':'Athlete profile'} · Goal: ${p.goal} · ${p.region==='all'?'All Colorado':p.region+' region'}`),element('p','Interests: '+(p.interests.map(cap).join(', ')||'Explore my sport')));
 let candidates=[...data.organizations,...data.teams,...data.opportunities,...data.communities].filter(r=>r.sport===p.sport&&r.audience!=='adult');
 const desired=new Set([p.goal,...p.interests]);candidates=candidates.filter(r=>desired.has('teams')&&['club','swim-team','team'].includes(r.kind||'team')||desired.has('tryouts')&&r.kind==='tryout'||desired.has('camps')&&r.kind==='camp'||desired.has('community')&&r.kind==='community'||desired.has('recruiting')&&r.organizationId&&data.schools.some(s=>s.id===r.organizationId));
 candidates=candidates.filter(r=>regionMatch(r,p.region));
 $('#recommendations').replaceChildren(...candidates.slice(0,6).map(recordCard));if(!candidates.length)$('#recommendations').append(element('p','No sourced matches for these choices yet. Try all Colorado regions or explore another interest.','empty'));
 const saved=p.saved.map(findRecord).filter(Boolean);$('#saved-list').replaceChildren(...saved.map(recordCard));if(!saved.length)$('#saved-list').append(element('p','No saved programs yet. Explore your next steps and select Save.','empty'));
 const schedule=scheduleFor(p,data);const list=$('#schedule-list');list.replaceChildren();for(const event of schedule){const item=element('article',undefined,'schedule-entry');item.append(element('h3',event.name),element('p',event.start+(event.end&&event.end!==event.start?' – '+event.end:'')+' · '+(event.imported?'Official published date':'Personal plan')),element('p',event.note||event.summary));if(event.start<new Date().toISOString().slice(0,10))item.append(element('p','Past date · retained for your records','small'));if(event.imported)item.append(anchor('Confirm with organizer ↗',source(event).url));else{const remove=element('button','Remove plan','secondary');remove.addEventListener('click',()=>{if(updateProfile(p=>p.plans=p.plans.filter(x=>x.id!==event.id)))renderWorkspace();});item.append(remove);}list.append(item);}if(!schedule.length)list.append(element('p','Save a dated opportunity or add your own plan.','empty'));
 $('#export-calendar').disabled=!schedule.length;
 const colleges=data.teams.filter(t=>t.sport===p.sport&&data.schools.some(s=>s.id===t.organizationId));$('#college-list').replaceChildren(...colleges.map(recordCard));
 for(const box of $$('[name=recruiting]'))box.checked=p.recruiting.checks.includes(box.value);$('#recruiting-notes').value=p.recruiting.notes;
 const media=$('#media-list');media.replaceChildren();if(!p.mediaEnabled||!p.mediaSources.length)media.append(element('p','Media is off. No media sources have been added to your pathway.'));else for(const s of data.mediaSources.filter(s=>p.mediaSources.includes(s.id))){const item=element('article',undefined,'panel');item.append(element('h3',s.name),element('p',s.description));if(s.url)item.append(anchor('Visit publisher ↗',s.url));else for(const o of data.organizations.filter(o=>o.sport===p.sport&&!o.id.startsWith('wsl-')&&!o.id.startsWith('mhsl-'))){const para=element('p');para.append(anchor(o.name+' ↗',source(o).url));item.append(para);}media.append(item);}
 refreshSaveButtons();
}
if(document.body.dataset.page==='my-pathway'){
 catalog().then(()=>renderWorkspace()).catch(()=>{$('#workspace-empty').hidden=false;$('#workspace-empty').textContent='The catalog could not load. Reload to try again; your saved profile has not been changed.';});
 $('#profile-select').addEventListener('change',e=>{const next=clone();next.active=e.target.value;if(store(next))renderWorkspace();});
 $('#delete-profile').addEventListener('click',()=>{if(!confirm('Delete this profile, its saved programs, schedule and research notes from this browser?'))return;const next=clone();next.profiles=next.profiles.filter(p=>p.id!==next.active);next.active=next.profiles[0]?.id||null;if(store(next)){try{storage.removeItem('arenaPathway');}catch{}renderWorkspace();notify('Profile deleted from this browser.');}});
 $('#schedule-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#plan-title').value.trim(),start=$('#plan-start').value;if(!name||!start)return;if(updateProfile(p=>p.plans.push({id:crypto.randomUUID(),name,start,note:$('#plan-note').value.trim()}))){e.target.reset();renderWorkspace();notify('Personal plan added.');}});
 $('#recruiting-form').addEventListener('submit',e=>{e.preventDefault();if(updateProfile(p=>p.recruiting={checks:$$('[name=recruiting]:checked').map(b=>b.value),notes:$('#recruiting-notes').value}))$('#recruiting-status').textContent='Research plan saved on this device.';});
 $('#export-calendar').addEventListener('click',()=>{const blob=new Blob([calendarText(scheduleFor(active(),data))],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob);const a=anchor('Download',url);a.download='arena-pathway.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
