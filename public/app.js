import {inSearchRegion} from './regions.js';
import {loadState,persist,toggleSaved,scheduleFor,calendarText,validSports,moduleDefinitions,modulesFor,setModules} from './state.js';
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
document.addEventListener('click',e=>{const b=e.target.closest('[data-save]');if(!b)return;const p=active();if(!p){notify('Create an athlete profile to save programs and opportunities.');location.href='/build';return;}if(updateProfile(p=>toggleSaved(p,b.dataset.save))){refreshSaveButtons();if(document.body.dataset.page==='my-pathway')renderWorkspace();notify(active().saved.includes(b.dataset.save)?'Saved to this profile.':'Removed from this profile.');}});
refreshSaveButtons();
async function catalog(){if(!data){const r=await fetch('/api/catalog');if(!r.ok)throw Error('Catalog unavailable');data=await r.json();}return data;}
const athleteForm=$('#athlete-form');
if(athleteForm){
 const p=new URLSearchParams(location.search).has('new')?null:active();
 if(p){$('#nickname').value=p.nickname;$('#sport').value=p.sport;$('#club-team').value=p.clubTeam||'';$('#position').value=p.position||'';$('#guardian').checked=p.guardian;$('#athlete-level').value=p.participationLevel||'any';$('#athlete-designation').value=p.participationDesignation||'youth';}
 if(!p&&active()?.guardian)$('#guardian').checked=true;
 const sport=new URLSearchParams(location.search).get('sport');if(validSports.includes(sport))$('#sport').value=sport;
 const positions={lacrosse:['Attack','Midfield','Defense','Goalie'],volleyball:['Setter','Outside hitter','Opposite','Middle blocker','Libero','Defensive specialist'],basketball:['Point guard','Shooting guard','Small forward','Power forward','Center'],swimming:['Freestyle','Backstroke','Breaststroke','Butterfly','Individual medley','Distance','Sprint']};
 const suggest=()=>{$('#sport-positions').replaceChildren(...positions[$('#sport').value].map(v=>{const o=element('option');o.value=v;return o;}));$('#position').placeholder=$('#sport').value==='swimming'?'e.g. 100m freestyle':'Choose or type a position';};$('#sport').addEventListener('change',suggest);suggest();
 athleteForm.addEventListener('submit',e=>{e.preventDefault();if(!$('#nickname').value.trim()){$('#form-status').textContent='Enter an athlete name.';$('#nickname').focus();return;}const next=clone();let profile=next.profiles.find(x=>x.id===p?.id);if(!profile){profile={id:crypto.randomUUID(),saved:[],plans:[],recruiting:{checks:[],notes:''},modules:['teams','saved','schedules','camps','community'],moduleVersion:2,region:'all',goal:'teams',interests:[],participationLevel:'any',participationDesignation:'youth',mediaEnabled:false,mediaSources:[],mediaSourcePreferences:[]};next.profiles.push(profile);}
 Object.assign(profile,{nickname:$('#nickname').value.trim(),sport:$('#sport').value,clubTeam:$('#club-team').value.trim(),position:$('#position').value.trim(),participationLevel:$('#athlete-level').value,participationDesignation:$('#athlete-designation').value,guardian:$('#guardian').checked,role:$('#guardian').checked?'parent':'athlete'});next.active=profile.id;if(store(next))location.href='/my-pathway';});
 $('#athlete-basics').disabled=false;$('#athlete-basics').removeAttribute('aria-busy');
}
const form=$('#pathway-form');
if(form){
 const params=new URLSearchParams(location.search),p=params.has('new')?null:active();
 let selectedModules=p?modulesFor(p):[];
 if(!p&&params.has('new')&&active()?.role==='parent'&&active().guardian){$('#role').value='parent';$('#guardian').checked=true;}
 if(p){for(const key of ['nickname','role','sport','region','goal'])$('#'+key).value=p[key];$('#guardian').checked=p.guardian;$('#participation-level').value=p.participationLevel||'any';$('#participation-designation').value=p.participationDesignation||'youth';for(const b of $$('[name=interests]'))b.checked=p.interests.includes(b.value);for(const b of $$('[name=workspace-module]'))b.checked=selectedModules.includes(b.value);for(const b of $$('[name=media-source]'))b.checked=(p.mediaSourcePreferences||p.mediaSources).includes(b.value);}
 const chosen=params.get('sport')?.toLowerCase();if(validSports.includes(chosen))$('#sport').value=chosen;
 function controls(){const parent=$('#role').value==='parent';$('#parent-controls').hidden=!parent;$('#guardian').required=parent;const media=$('#media-enabled').checked;$('#media-options').hidden=!media;for(const b of $$('[name=media-source]')){b.disabled=!media;}}
 for(const b of $$('[name=workspace-module]'))b.addEventListener('change',()=>{selectedModules=b.checked?[...selectedModules.filter(id=>id!==b.value),b.value]:selectedModules.filter(id=>id!==b.value);});
 $('#role').addEventListener('change',controls);$('#media-enabled').addEventListener('change',controls);controls();
 form.addEventListener('submit',e=>{e.preventDefault();const mediaEnabled=$('#media-enabled').checked,mediaSources=$$('[name=media-source]:checked').map(x=>x.value);if(mediaEnabled&&!mediaSources.length){$('#form-status').textContent='Choose at least one media source, or turn media off.';return;}
 const next=clone();let profile=next.profiles.find(x=>x.id===p?.id);if(!profile){profile={id:crypto.randomUUID(),saved:[],plans:[],recruiting:{checks:[],notes:''}};next.profiles.push(profile);}
 Object.assign(profile,{nickname:$('#nickname').value.trim(),role:$('#role').value,guardian:$('#role').value==='parent'&&$('#guardian').checked,sport:$('#sport').value,region:$('#region').value,participationLevel:$('#participation-level').value,participationDesignation:$('#participation-designation').value,goal:$('#goal').value,interests:$$('[name=interests]:checked').map(x=>x.value),mediaEnabled,mediaSources:mediaEnabled?mediaSources:[],mediaSourcePreferences:mediaSources});setModules(profile,selectedModules);next.active=profile.id;
 if(store(next)){// A migrated legacy profile is now stored in v2; remove the stale legacy copy.
 try{storage.removeItem('arenaPathway');}catch{}
 location.href='/my-pathway';}
 });
}
function findRecord(id){return [...data.organizations,...data.teams,...data.schools,...data.opportunities,...data.communities,...data.leagues,...data.divisions,...(data.locations||[]),...(data.programs||[]),...(data.savedRecordArchive||[]),...(data.registrationOpportunities||[])].find(r=>r.id===id);}
function source(record){return data.sources.find(s=>s.id===record.sourceIds?.[0])||{url:'/data/classification',reviewedAt:'unconfirmed'};}
function recordCard(r){const node=element('article',undefined,'record');node.append(element('span',(r.kind||'team').replace('-',' '),'badge'),element('h3',r.name));let text=r.summary;if(!text&&r.organizationId){const parent=[...data.organizations,...data.schools,...data.leagues].find(o=>o.id===r.organizationId);text=(parent?.name||'Colorado program')+' · '+r.division+' · '+(r.season||'Season unconfirmed');}node.append(element('p',text||'Colorado program'));if(data.participation?.exceptions.some(e=>e.entityId===r.id))node.append(element('p','Participation or parent classification needs review. Saved identity retained.','small'));const owner=data.participation?.organizationIds.includes(r.id)?r.id:r.organizationId;if(owner&&data.participation?.organizationIds.includes(owner))node.append(anchor('Arena Pathway profile →','/organizations/'+encodeURIComponent(owner)+'?sport='+active().sport,'text-link'));if(['club','swim-team','school'].includes(r.kind)){const linked=new Set((data.participation?.teamAssignments||[]).map(a=>a.teamId));const associated=data.teams.filter(t=>t.organizationId===r.id&&linked.has(t.id));if(r.city)node.append(element('p',r.city+', CO','small'));if(associated.length){const details=element('details',undefined,'associated-teams');details.append(element('summary',associated.length+' associated team'+(associated.length===1?'':'s')));const list=element('ul');for(const t of associated)list.append(element('li',t.name+(t.division?' · '+t.division:'')+' · '+(t.season||'Season unconfirmed')));details.append(list);node.append(details);}}const row=element('div',undefined,'record-actions'),s=source(r);row.append(anchor('Official source ↗',s.url));const b=element('button','Save','secondary');b.dataset.save=r.id;b.setAttribute('aria-pressed','false');row.append(b);node.append(row,element('p','Source reviewed '+s.reviewedAt,'small'));return node;}
function parentCity(r){if(r.kind==='program')return r.city||'';if(r.city)return r.city;return [...data.organizations,...data.schools,...data.leagues].find(o=>o.id===r.organizationId)?.city||'';}
function regionMatch(r,region){return inSearchRegion({...r,city:parentCity(r)},({metro:'denver-metro',north:'northern-colorado',west:'western-slope'})[region]||region);}
function renderModuleChoices(p){
 const selected=modulesFor(p),choices=$('#module-choices');choices.replaceChildren();
 const order=[...selected,...moduleDefinitions.map(m=>m.id).filter(id=>!selected.includes(id))];
 for(const id of order){const definition=moduleDefinitions.find(m=>m.id===id),index=selected.indexOf(id),row=element('div',undefined,'module-choice-row');
  const label=element('label',undefined,'check'),box=element('input');box.type='checkbox';box.value=id;box.id='choose-'+id;box.checked=index>=0;
  const copy=element('span',definition.label);copy.append(element('small',definition.description));label.append(box,copy);row.append(label);
  box.addEventListener('change',()=>changeModules(box.checked?[...selected,id]:selected.filter(m=>m!==id),box.id));
  if(index>=0){const controls=element('div',undefined,'module-order-controls');for(const [direction,delta] of [['up',-1],['down',1]]){const button=element('button',direction==='up'?'↑ Up':'↓ Down','secondary');button.type='button';button.id='move-'+id+'-'+direction;button.setAttribute('aria-label','Move '+definition.label+' '+direction);button.disabled=index+delta<0||index+delta>=selected.length;button.addEventListener('click',()=>{const next=[...selected];[next[index],next[index+delta]]=[next[index+delta],next[index]];changeModules(next,button.id,box.id);});controls.append(button);}row.append(controls);}
  choices.append(row);
 }
}
function changeModules(modules,focusId,fallbackId=focusId){
 if(updateProfile(p=>setModules(p,modules))){renderWorkspace();$('#module-customizer').open=true;$('#module-status').textContent='Workspace choices saved for this profile. Hidden module data is kept.';const focus=document.getElementById(focusId);(focus&&!focus.disabled?focus:document.getElementById(fallbackId))?.focus();}else renderWorkspace();
}
function fillRecords(selector,records,message){const target=$(selector);target.replaceChildren(...records.map(recordCard));if(!records.length)target.append(element('p',message,'empty'));}
function renderSchedule(p){
 const schedule=scheduleFor(p,data),list=$('#schedule-list');list.replaceChildren();for(const event of schedule){const item=element('article',undefined,'schedule-entry');item.append(element('h3',event.name),element('p',event.start+(event.end&&event.end!==event.start?' – '+event.end:'')+' · '+(event.imported?'Official published date':'Personal plan')),element('p',event.note||event.summary));if(event.start<new Date().toISOString().slice(0,10))item.append(element('p','Past date · retained for your records','small'));if(event.imported)item.append(anchor('Confirm with organizer ↗',source(event).url));else{const remove=element('button','Remove plan','secondary');remove.addEventListener('click',()=>{if(updateProfile(p=>p.plans=p.plans.filter(x=>x.id!==event.id)))renderWorkspace();});item.append(remove);}list.append(item);}if(!schedule.length)list.append(element('p','Save a dated opportunity or add your own plan.','empty'));
 $('#export-calendar').disabled=!schedule.length;
 $('#schedule-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#plan-title').value.trim(),start=$('#plan-start').value;if(!name||!start)return;if(updateProfile(p=>p.plans.push({id:crypto.randomUUID(),name,start,note:$('#plan-note').value.trim()}))){renderWorkspace();notify('Personal plan added.');}});
 $('#export-calendar').addEventListener('click',()=>{const blob=new Blob([calendarText(scheduleFor(active(),data))],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob);const a=anchor('Download',url);a.download='arena-pathway.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
function renderRecruiting(p){
 const collegePrograms=new Set((data.participation?.programs||[]).filter(r=>r.designation==='college').map(r=>r.id)),collegeTeams=new Set((data.participation?.teamAssignments||[]).filter(a=>collegePrograms.has(a.programId)).map(a=>a.teamId));const colleges=data.teams.filter(t=>t.sport===p.sport&&collegeTeams.has(t.id));fillRecords('#college-list',colleges,'No verified college programs for this sport yet.');
 for(const box of $$('[name=recruiting]'))box.checked=p.recruiting.checks.includes(box.value);$('#recruiting-notes').value=p.recruiting.notes;
 $('#recruiting-form').addEventListener('submit',e=>{e.preventDefault();if(updateProfile(p=>p.recruiting={...p.recruiting,checks:$$('[name=recruiting]:checked').map(b=>b.value),notes:$('#recruiting-notes').value}))$('#recruiting-status').textContent='Research plan saved on this device.';});
}
function renderMedia(p){
 const media=$('#media-list');media.replaceChildren();const selected=data.mediaSources.filter(s=>p.mediaEnabled&&p.mediaSources.includes(s.id));
 if(!selected.length)media.append(element('p','Choose your media sources in optional preferences. Only the sources you select will appear here.'));
 for(const s of selected){const item=element('article',undefined,'panel');item.append(element('h3',s.name),element('p',s.description));if(s.url)item.append(anchor('Visit publisher ↗',s.url));else for(const o of data.organizations.filter(o=>(o.sport===p.sport||o.sports?.includes(p.sport))&&!o.id.startsWith('wsl-')&&!o.id.startsWith('mhsl-'))){const para=element('p');para.append(anchor(o.name+' ↗',source(o).url));item.append(para);}media.append(item);}
}
function renderWorkspace(){
 const p=active();$('#workspace-empty').hidden=!!p;$('#workspace').hidden=!p;if(!p)return;
 const selector=$('#profile-select');selector.replaceChildren();for(const pr of state.profiles){const option=element('option',pr.nickname||cap(pr.sport)+' pathway');option.value=pr.id;selector.append(option);}selector.value=p.id;
 $('#add-profile').hidden=false;
 $('#profile-summary').replaceChildren(element('h2',p.nickname||'My '+cap(p.sport)+' pathway'),element('p',`${cap(p.sport)} · ${p.role==='parent'?'Parent-managed family profile':'Athlete profile'} · ${p.region==='all'?'All Colorado':p.region+' region'}`),element('p','Interests: '+([p.goal,...p.interests].filter((x,i,a)=>a.indexOf(x)===i).map(cap).join(', '))));
 const recruitingPage=$('#main').dataset.workspaceView==='recruiting';
 const initials=element('span',(p.nickname||cap(p.sport)).trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase(),'athlete-initials');initials.setAttribute('aria-hidden','true');$('#profile-summary').prepend(initials);
 const profileNav=$('#profile-nav'),sections=$('#profile-sections');profileNav.replaceChildren();sections.replaceChildren();
 $('#profile-summary').append(element('p',[p.clubTeam,p.position].filter(Boolean).join(' · ')),anchor('Back to My Family →','/my-ap?section=family','secondary'));
 for(const [id,label,copy] of [['overview','Profile overview',''],['schedules','Schedule',''],['stats','Stats','No performance statistics added. No results are inferred.'],['profile-media','Media','Publisher links are optional. No uploads or live media accounts are connected.'],['camps','Development',''],['community','Community',''],['network','Network','No network connections yet. No invitations or contacts are sent.']]){profileNav.append(anchor(label,'#'+id));if(copy){const section=element('section',undefined,'workspace-section');section.id=id;section.append(element('h2',label),element('p',copy));sections.append(section);}}
 const overview=element('section',undefined,'workspace-section');overview.id='overview';overview.append(element('h2','Profile overview'),element('p',[cap(p.sport),p.clubTeam||'Club / team not added',p.position||'Position / event not added'].join(' · ')),element('p','Participation: '+(p.participationDesignation||'youth').replaceAll('-',' ')+' · '+(p.participationLevel==='any'?'Exploring':p.participationLevel||'Exploring')));
 const nextPlan=scheduleFor(p,data).find(e=>e.start>=new Date().toISOString().slice(0,10));overview.append(element('h3','Next step'),element('p',nextPlan?nextPlan.name+' · '+nextPlan.start:'Add your next commitment when you’re ready.'));
 const manage=anchor('View schedule →','#schedules','button');manage.addEventListener('click',e=>{e.preventDefault();profileNav.querySelector('[href="#schedules"]').click();});overview.append(manage,element('p',p.saved.length+' saved organizations and opportunities · retained on this browser.','small'));sections.prepend(overview);
 const open=$('#module-customizer').open;renderModuleChoices(p);$('#module-customizer').open=open;
 const modules=[...new Set(['schedules','camps','community',...modulesFor(p)])],nav=$('#workspace-nav'),container=$('#workspace-modules');nav.replaceChildren();container.replaceChildren();nav.hidden=true;$('#modules-empty').hidden=!!modules.length;
 for(const id of modules){const definition=moduleDefinitions.find(m=>m.id===id);nav.append(anchor(definition.label,'#'+id));container.append(document.getElementById('template-'+id).content.cloneNode(true));}
 for(const link of $$('[data-explore]'))link.href='/sports/'+p.sport+'/'+link.dataset.explore;
 const saved=p.saved.map(findRecord).filter(Boolean),scope=(data.participation?.programs||[]).filter(r=>r.sport===p.sport&&(r.designation===(p.participationDesignation||'youth')||r.designation==='community'&&(p.participationDesignation||'youth')==='community')&&(p.participationLevel==='any'||!p.participationLevel||r.levels.includes(p.participationLevel))&&regionMatch(r,p.region));
 const directOrganizations=(data.participation?.verifiedOrganizations||[]).filter(r=>r.sports.includes(p.sport)&&r.youthParticipationVerified&&(r.designation===(p.participationDesignation||'youth')||r.communityBased&&(p.participationDesignation||'youth')==='youth')&&(p.participationLevel==='any'||!p.participationLevel||r.levels.includes(p.participationLevel))&&regionMatch(r,p.region));
 const ownerIds=new Set([...scope.filter(r=>r.programKind!=='league').map(r=>r.organizationId),...directOrganizations.map(r=>r.id)]);
 const allowedTeams=new Set((data.participation?.teamAssignments||[]).filter(a=>scope.some(p=>p.id===a.programId)).map(a=>a.teamId));
 const opportunities=new Set(scope.flatMap(r=>r.relatedRecordIds));
 const candidates=[...data.organizations,...data.teams,...data.opportunities,...data.communities,...(data.locations||[])].filter(r=>ownerIds.has(r.id)||allowedTeams.has(r.id)||opportunities.has(r.id));
 if(modules.includes('saved'))fillRecords('#opportunity-saved',saved,'Save a program, camp, tryout or other opportunity to keep it here.');
 if(modules.includes('teams')){fillRecords('#saved-list',saved.filter(r=>[...data.organizations,...data.schools,...data.teams,...(data.programs||[])].some(t=>t.id===r.id)),'Save a club, team or opportunity to keep it with this profile.');const wantsTryouts=p.goal==='tryouts'||p.interests.includes('tryouts');fillRecords('#recommendations',[...(wantsTryouts?candidates.filter(r=>r.kind==='tryout'):[]),...candidates.filter(r=>['club','swim-team','team'].includes(r.kind||'team'))].slice(0,6),'No sourced team matches for these choices yet. Explore all teams or adjust your location.');}
 if(modules.includes('camps')){fillRecords('#camp-saved',saved.filter(r=>r.kind==='camp'),'Your saved camps will appear here.');fillRecords('#camp-recommendations',candidates.filter(r=>r.kind==='camp').slice(0,6),'No sourced camps for these choices yet.');}
 if(modules.includes('community')){const communityRecords=new Set((data.participation?.programs||[]).filter(r=>r.sport===p.sport&&(r.designation==='community'||r.communityBased)&&regionMatch(r,p.region)).flatMap(r=>r.relatedRecordIds));const communityCandidates=data.communities.filter(r=>communityRecords.has(r.id));fillRecords('#community-saved',saved.filter(r=>['community','location'].includes(r.kind)),'Your saved community resources will appear here.');fillRecords('#community-recommendations',communityCandidates.slice(0,6),'No sourced community matches for these choices yet.');}
 if(modules.includes('schedules'))renderSchedule(p);
 if(modules.includes('recruiting'))renderRecruiting(p);
 if(modules.includes('media'))renderMedia(p);
 const recruiting=element('details',undefined,'workspace-section');recruiting.id='optional-recruiting';recruiting.append(element('summary','Recruiting · optional and separate'),anchor('Open recruiting →','/recruiting','text-link'),element('p','Sharing is off. Nothing leaves this browser. Live sharing requires verified parent authorization, which is not connected.'));
 if(!modules.includes('recruiting')){const enable=element('button','Open local recruiting planner','secondary');enable.addEventListener('click',()=>{if(updateProfile(p=>setModules(p,[...modulesFor(p),'recruiting'])))renderWorkspace();});recruiting.append(enable);}const planner=$('#workspace-modules > #recruiting');if(planner)recruiting.append(planner);$('#workspace-modules').append(recruiting);
 const selectSection=id=>{const groups={overview:['overview'],schedules:['schedules'],stats:['stats'],'profile-media':['profile-media','media'],camps:['camps'],community:['community'],network:['network','teams','saved']};
  if(!groups[id])id='overview';for(const section of [...sections.children,...container.children]){if(section.tagName==='SECTION')section.hidden=!groups[id].includes(section.id);}
  for(const a of profileNav.children){if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
 };
 for(const a of profileNav.children)a.addEventListener('click',e=>{e.preventDefault();history.replaceState(null,'',a.hash);selectSection(a.hash.slice(1));});selectSection(location.hash.slice(1));
 if(recruitingPage){profileNav.hidden=true;$('#module-customizer').hidden=true;for(const section of [...sections.children,...container.children])if(section.tagName==='SECTION')section.hidden=true;recruiting.open=true;}
 refreshSaveButtons();
}
if(document.body.dataset.page==='my-pathway'){
 catalog().then(()=>renderWorkspace()).catch(()=>{$('#workspace-empty').hidden=false;$('#workspace-empty').textContent='The catalog could not load. Reload to try again; your saved profile has not been changed.';});
 $('#profile-select').addEventListener('change',e=>{const next=clone();next.active=e.target.value;if(store(next))renderWorkspace();});
 $('#delete-profile').addEventListener('click',()=>{if(!confirm('Delete this profile, its saved programs, schedule and research notes from this browser?'))return;const next=clone();next.profiles=next.profiles.filter(p=>p.id!==next.active);next.active=next.profiles[0]?.id||null;if(store(next)){try{storage.removeItem('arenaPathway');}catch{}renderWorkspace();notify('Profile deleted from this browser.');}});
}
