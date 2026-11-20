import {localFamilyCalendar} from './local-family-calendar.js';
// PlayRcmd-only presentation/provider adapter. No shared engine or live API is modified.
import {loadRole,readWorkspace,roleKey,roleLabels,makeActivity,notificationFixtures,savePlan} from './playrcmd-roles.js';
import {activityContract,activityKey,canRead} from './siem-platform-model.js';
import {parseICS,expandWeekly} from './siem-model.js';
import {denverInstant,expandPlans} from './recurring-plans.js';
export const providers={'soccer-center':'Soccer Center','arena-pathway':'Arena Pathway'};
export const fields=['displayName','sport','teamName','position','parentDisplayName','schedules'];
export const fieldLabels={displayName:'Display name',sport:'Sport',teamName:'Team name',position:'Playing position',parentDisplayName:'Parent display name',schedules:'Selected schedule snapshot'};
const copy=x=>JSON.parse(JSON.stringify(x));
const text=(v,max=100)=>typeof v==='string'?v.trim().slice(0,max):'';
const validKind=k=>{if(!Object.hasOwn(roleLabels,k))throw Error('Unknown role');};
const sports=['soccer','volleyball','basketball','lacrosse','swimming','other'];
const uid=()=>globalThis.crypto.randomUUID();
const fingerprint=s=>{const value=copy(s);delete value.revision;if(value.exchange){delete value.exchange.pending;delete value.exchange.undo;if(!Object.keys(value.exchange).length)delete value.exchange;}return JSON.stringify(value);};
const defaults=()=>({version:1,status:'new',step:0,useBuilder:false,people:[],extraTeams:[],preferences:{notifications:[],opportunities:[]},profiles:{}});
function state(storage,kind){validKind(kind);return readWorkspace(storage,kind);}
export function readSetup(storage,kind){
 const raw=state(storage,kind).setup;if(!raw||raw.version!==1)return defaults();
 return {version:1,useBuilder:raw.useBuilder===true,status:['new','draft','saved','skipped'].includes(raw.status)?raw.status:'new',step:Number.isInteger(raw.step)?Math.max(0,Math.min(4,raw.step)):0,
 people:(Array.isArray(raw.people)?raw.people:[]).slice(0,20).filter(p=>p&&typeof p.id==='string'&&p.id.startsWith('setup-'+kind+'-')&&text(p.name)&&sports.includes(p.sport)).map(p=>({id:p.id,name:text(p.name,60),sport:p.sport,teamName:text(p.teamName),minor:p.minor!==false})),
 extraTeams:(Array.isArray(raw.extraTeams)?raw.extraTeams:[]).slice(0,40).filter(t=>t&&typeof t.id==='string'&&t.id.startsWith('setup-'+kind+'-team-')&&text(t.name)&&sports.includes(t.sport)).map(t=>({id:t.id,name:text(t.name),sport:t.sport,participantId:text(t.participantId)})),
 preferences:{notifications:(Array.isArray(raw.preferences?.notifications)?raw.preferences.notifications:[]).filter(x=>['changes','reminders'].includes(x)),opportunities:(Array.isArray(raw.preferences?.opportunities)?raw.preferences.opportunities:[]).filter(x=>['clubs','camps','education','jobs'].includes(x))},
 profiles:raw.profiles&&typeof raw.profiles==='object'&&!Array.isArray(raw.profiles)?copy(raw.profiles):{}};
}
function write(storage,kind,s){s.revision=(state(storage,kind).revision||0)+1;storage.setItem(roleKey(kind),JSON.stringify(s));return s;}
export function saveSetup(storage,kind,patch){
 const s=state(storage,kind),current=readSetup(storage,kind);s.setup={...current,...copy(patch),version:1};
 // Sanitize through the same reader before persisting. Never use supplied organization/permission IDs.
 const shadow={getItem:key=>key===roleKey(kind)?JSON.stringify(s):null};s.setup=readSetup(shadow,kind);write(storage,kind,s);return s.setup;
}
export function addSetupPerson(storage,kind,{name,sport,teamName,minor=true}){
 const setup=readSetup(storage,kind);if(setup.people.length>=20)throw Error('Demo limit: 20 local associations');
 if(!text(name)||!sports.includes(sport)||!text(teamName))throw Error('Fictional name, sport and team are required');
 if(setup.people.some(p=>p.name.toLowerCase()===text(name,60).toLowerCase()&&p.sport===sport&&p.teamName.toLowerCase()===text(teamName).toLowerCase()))throw Error('This local association already exists; edit it instead');
 if(kind==='college'&&setup.people.length)throw Error('Athlete setup has one self association; use Parent for multiple athletes');
 const p={id:'setup-'+kind+'-'+uid(),name:text(name,60),sport,teamName:text(teamName),minor:minor!==false};
 saveSetup(storage,kind,{people:[...setup.people,p]});return p;
}
export function loadConfiguredRole(kind,storage){
 const d=loadRole(kind,storage),setup=readSetup(storage,kind),orgId='setup-'+kind;
 if(setup.people.length||setup.extraTeams.length){
  d.organizations.push({id:orgId,name:'My local fictional associations'});
  const teams=[];
  for(const p of setup.people){
   const teamId=p.id+'-team';teams.push(teamId);d.participants.push({id:p.id,name:p.name,label:p.sport,sports:[p.sport]});
   d.teams.push({id:teamId,name:p.teamName,organizationId:orgId,sport:p.sport,participantId:p.id});d.ctx.participantIds.push(p.id);
  }
  for(const t of setup.extraTeams){const p=d.participants.find(p=>p.id===t.participantId);if(!p||!d.ctx.participantIds.includes(p.id))continue;d.teams.push({...t,organizationId:orgId});teams.push(t.id);p.sports=[...new Set([...(p.sports||[]),t.sport])];}
  d.ctx.memberships.push({organizationId:orgId,role:d.ctx.role,teamIds:teams});
  for(const source of ['manual','ics'])d.sources.push({id:source+'-'+orgId,name:source==='manual'?'Local fictional planning':'Imported snapshot',tenantId:d.ctx.tenantId,organizationId:orgId,role:d.ctx.role,status:'local',lastSynchronizedAt:null,staleAfterMinutes:1440});
 }
 // Read the established family builder's validated projection in-place; never migrate its store.
 if(kind==='family'&&setup.useBuilder){
  const local=localFamilyCalendar(storage),org='setup-builder-family',teamIds=[];
  d.organizations.push({id:org,name:'Existing fictional setup builder'});
  for(const p of local.participants){const id='builder-'+p.id,team=id+'-team';if(d.ctx.participantIds.includes(id))continue;d.participants.push({id,name:p.name,label:p.label||'Local builder'});d.ctx.participantIds.push(id);d.teams.push({id:team,participantId:id,organizationId:org,name:p.name+' · Existing builder'});teamIds.push(team);}
  d.ctx.memberships.push({organizationId:org,role:d.ctx.role,teamIds});
  d.sources.push({id:'manual-'+org,name:'Existing builder · local projection',tenantId:d.ctx.tenantId,organizationId:org,role:d.ctx.role,status:'local',lastSynchronizedAt:null});
  for(const e of local.activities){if(!canRead(e,local.ctx))continue;try{d.activities.push(makeActivity(d,{eventId:'builder-'+e.eventId,title:e.title,teamId:'builder-'+e.participantId+'-team',participantId:'builder-'+e.participantId,start:e.start,end:e.end,status:e.status,eventType:e.eventType,location:e.location,evidence:{url:'',summary:'Read-only projection of the existing fictional setup builder; no account connection'}}));}catch{/* Unsupported legacy record remains untouched in its source store. */}}
 }
 // Only presentation fields on known participants/authorized teams can be projected.
 for(const [id,p] of Object.entries(setup.profiles)){
  if(!p||typeof p!=='object'||!d.ctx.participantIds.includes(id))continue;
  const person=d.participants.find(x=>x.id===id);if(kind!=='coach'&&person&&text(p.displayName))person.name=text(p.displayName,60);
  if(kind!=='coach'&&person&&sports.includes(p.sport)){person.sports=[p.sport];person.label=p.sport;}
  if(text(p.teamName)){const team=d.teams.find(t=>t.id===p.teamId&&authorizedTeam(d,t.id));if(team&&(team.participantId||(kind==='coach'?team.id:d.participants[0].id))===id)team.name=text(p.teamName);}
 }
 for(const raw of state(storage,kind).entries){
  try{const e=activityContract(raw);if(!authorizedTeam(d,e.teamId)||!d.ctx.participantIds.includes(e.participantId)||!canRead(e,d.ctx))continue;
   const i=d.activities.findIndex(a=>activityKey(a)===activityKey(e));if(i<0)d.activities.push(e);else d.activities[i]=e;
  }catch{/* An untrusted local record never widens the current role scope. */}
 }
 if(setup.status==='saved')d.activities=d.activities.filter(e=>(e.eventType!=='communication'||setup.preferences.notifications.length>0)&&(e.eventType!=='opportunity'||setup.preferences.opportunities.length>0));
 return d;
}
function authorizedTeam(d,id){return d.teams.some(t=>t.id===id&&d.ctx.memberships.some(m=>m.role===d.ctx.role&&m.organizationId===t.organizationId&&m.teamIds.includes(id)));}
function target(storage,kind,subjectId,teamId){
 const d=loadConfiguredRole(kind,storage),p=d.participants.find(p=>p.id===subjectId);
 if(!p||!d.ctx.participantIds.includes(subjectId)||!authorizedTeam(d,teamId))throw Error('Subject or team outside this role');
 const team=d.teams.find(t=>t.id===teamId);
 if(kind==='family'&&team.participantId!==subjectId)throw Error('Athlete does not match team');
 if(kind==='coach'&&(team.participantId||team.id)!==subjectId)throw Error('Coaching association does not match team');
 if(kind==='college'&&subjectId!==(team.participantId||d.participants[0].id))throw Error('Self association does not match');
 return {d,p,team};
}
function saveEntries(storage,kind,entries){
 const s=state(storage,kind),map=new Map(s.entries.map(e=>[activityKey(e),e]));for(const e of entries)map.set(activityKey(e),e);
 if(map.size>600)throw Error('Demo limit reached');s.entries=[...map.values()];write(storage,kind,s);return entries;
}
export function addConfiguredCommitment(storage,kind,raw){
 const d=loadConfiguredRole(kind,storage);const team=d.teams.find(t=>t.id===raw.teamId);target(storage,kind,raw.participantId||team?.participantId||(kind==='coach'?team?.id:d.participants[0].id),raw.teamId);
 if(!text(raw.ref)||raw.ref.length>100||!text(raw.title))throw Error('Title and stable reference are required');
 const entries=expandWeekly({ref:raw.ref,start:denverInstant(raw.day,raw.startTime),end:denverInstant(raw.day,raw.endTime)},Number(raw.count||1)).map(e=>makeActivity(d,{eventId:'manual-'+e.ref,title:text(raw.title),teamId:raw.teamId,participantId:raw.participantId,start:e.start,end:e.end,eventType:raw.eventType,location:text(raw.location,180)}));
 return saveEntries(storage,kind,entries);
}
export function importConfiguredCalendar(storage,kind,ics,teamId,participantId){
 const d=loadConfiguredRole(kind,storage),team=d.teams.find(t=>t.id===teamId);target(storage,kind,participantId||team?.participantId||(kind==='coach'?team?.id:d.participants[0].id),teamId);
 const entries=parseICS(ics,participantId||d.participants[0].id).map(e=>{if(!e.ref||!e.title)throw Error('UID and summary required');return makeActivity(d,{eventId:'ics-'+e.ref,sourceId:'ics-'+team.organizationId,title:e.title,teamId,participantId,start:e.start,end:e.end,location:e.location,status:e.status,evidence:{url:'',summary:'Imported ICS snapshot. No live synchronization.'}});});return saveEntries(storage,kind,entries);
}
// Separate adapters, derived from inspected SC and AP field names. Unknown/private fields are dropped.
export const providerAdapters={
 'soccer-center':raw=>({displayName:text(raw.actor?.displayName||raw.player.label),sport:'soccer',teamName:text(raw.affiliation.orgName),position:text(raw.player.primaryPosition),parentDisplayName:text(raw.parent?.displayName),schedules:raw.events.map(e=>({uid:text(e.uid),title:text(e.title),start:e.startAt,end:e.endAt,eventType:['practice','game','class','travel','meeting','personal'].includes(e.eventType)?e.eventType:'practice',status:e.status==='cancelled'?'canceled':'scheduled',location:text(e.location,180)}))}),
 'arena-pathway':raw=>({displayName:text(raw.profile.nickname),sport:raw.profile.sport,teamName:text(raw.profile.clubTeam),position:text(raw.profile.position),parentDisplayName:text(raw.family?.nickname),schedules:expandPlans(raw.profile.plans||[],{maxOccurrences:100}).filter(e=>e.startAt&&e.endAt).map(e=>({uid:text(e.occurrenceId),title:text(e.name),start:e.startAt,end:e.endAt,eventType:['practice','game','travel','meeting','personal'].includes(e.kind)?e.kind:'practice',status:'scheduled',location:text(e.note,180)}))})
};
export function sampleProfile(provider,kind){
 validKind(kind);if(!Object.hasOwn(providers,provider))throw Error('Unknown provider');
 const name=kind==='family'?'Alex Rivera':kind==='college'?'Sam Taylor':'Morgan Lee';
 const event={uid:'portfolio-practice-1',title:'Fictional portfolio training',startAt:'2030-05-06T22:00:00.000Z',endAt:'2030-05-06T23:00:00.000Z'};
 const raw=provider==='soccer-center'?{player:{label:name,primaryPosition:'Midfield'},parent:{displayName:kind==='family'?'Casey Rivera':''},affiliation:{orgName:'Fictional Soccer Association'},events:[event]}:{profile:{nickname:name,sport:kind==='coach'?'lacrosse':'basketball',clubTeam:'Fictional Portfolio Team',position:'Guard',plans:[{id:event.uid,name:event.title,start:'2030-05-06',end:'2030-05-06',startTime:'16:00',endTime:'17:00',repeat:'none',kind:'practice',note:'Fictional training venue'}]},family:{nickname:kind==='family'?'Casey Rivera':''}};
 if(kind==='coach')raw.actor={displayName:'Morgan Lee · Coach'};
 const data=providerAdapters[provider](raw);if(kind==='coach'){data.displayName='Morgan Lee · Coach';data.position='';}
 return {schemaVersion:1,provider,externalId:provider+'-sample-'+kind,mode:'fictional-demonstration',profileType:kind==='coach'?'coach-association':kind==='family'?'athlete-with-parent':'adult-athlete',data};
}
function ownFields(storage,kind,subjectId,teamId){
 const {d,p,team}=target(storage,kind,subjectId,teamId);const meta=readSetup(storage,kind).profiles[subjectId]||{};
 return {displayName:kind==='coach'?'Morgan Lee · Coach':p.name,sport:meta.sport||p.sports?.[0]||team.sport||'other',teamName:team.name,position:text(meta.position),parentDisplayName:kind==='family'?text(meta.parentDisplayName)||'Casey Rivera':'',schedules:d.activities.filter(e=>e.teamId===teamId&&e.participantId===subjectId&&['practice','game','class','personal','travel','meeting'].includes(e.eventType)&&canRead(e,d.ctx)).slice(0,20).map(e=>({uid:e.eventId,title:e.title,start:e.start,end:e.end,eventType:e.eventType,status:e.status,location:e.location}))};
}
function destination(storage,kind,provider){
 const s=state(storage,kind);return copy(s.exchange?.destinations?.[provider]||[{id:provider+'-existing-'+kind,subjectId:null,fields:{...sampleProfile(provider,kind).data,displayName:'Fictional destination example'},version:1}]);
}
export function exchangeStatus(storage,kind){const s=state(storage,kind);return {links:copy(s.exchange?.links||[]),receipts:copy(s.exchange?.receipts||[]),canUndo:!!s.exchange?.undo&&s.exchange.undo.appliedRevision===s.revision};}
export function destinationExamples(storage,kind,provider){if(!Object.hasOwn(providers,provider))throw Error('Unknown provider');return destination(storage,kind,provider);}
export function previewTransfer(storage,kind,request){
 const {direction,provider,subjectId,teamId,operation='update',destinationId,selected=[],resolutions={}}=request;
 const targetContext=target(storage,kind,subjectId,teamId),identityKey=kind==='coach'?targetContext.d.ctx.personId:subjectId;if(!['pull','push'].includes(direction)||!Object.hasOwn(providers,provider))throw Error('Choose a valid transfer and provider');
 if(!['create','link','update'].includes(operation)||!Array.isArray(selected)||selected.some(f=>!fields.includes(f)))throw Error('Unsupported operation or field');
 if(kind==='coach'&&selected.includes('position'))throw Error('Athlete playing positions cannot be exchanged by a coaching association');
 if(kind!=='family'&&selected.includes('parentDisplayName'))throw Error('Parent fields are not available in this role');
 const s=state(storage,kind),own=ownFields(storage,kind,subjectId,teamId),example=sampleProfile(provider,kind),destinations=destination(storage,kind,provider);
 const existing=direction==='push'&&operation==='create'?undefined:destinations.find(x=>x.id===destinationId);
 if(direction==='push'&&operation!=='create'&&!existing)throw Error('Select the existing destination profile explicitly');
 if(direction==='push'&&operation!=='create'&&destinations.some(x=>(x.identityKey||x.subjectId)===identityKey&&x.id!==destinationId))throw Error('Subject already mapped to another destination profile; use that mapping or undo the earlier simulation');
 if(direction==='push'&&(existing?.identityKey||existing?.subjectId)&&(existing.identityKey||existing.subjectId)!==identityKey)throw Error('Destination already linked to another subject');
 if(direction==='push'&&operation==='create'&&destinations.some(x=>(x.identityKey||x.subjectId)===identityKey))throw Error('Duplicate prevented: this subject already has a destination profile; link or update it');
 if(direction==='push'&&operation==='update'&&(existing.identityKey||existing.subjectId)!==identityKey)throw Error('Link this existing profile before updating selected fields');
 const before=direction==='pull'?own:existing?.fields||{},after=direction==='pull'?example.data:own;
 const rows=(direction==='push'&&operation==='link'?[]:[...new Set(selected)]).map(field=>({field,before:copy(before[field]??''),after:copy(after[field]??''),conflict:JSON.stringify(before[field]??'')!==JSON.stringify(after[field]??'')&&JSON.stringify(before[field]??'')!=='""',resolution:resolutions[field]==='replace'?'replace':'keep'}));
 if(operation!=='link'&&rows.length===0)throw Error('Select at least one field');
 const plan={id:uid(),identityKey,direction,provider,subjectId,teamId,operation,destinationId:existing?.id||provider+'-created-'+identityKey,externalId:example.externalId,rows,fingerprint:fingerprint(s),revision:(s.revision||0)+1};
 s.exchange={...(s.exchange||{}),pending:plan};write(storage,kind,s);return copy(plan);
}
export function approveTransfer(storage,kind,planId,{authorized=false,parentApproved=false}={}){
 const s=state(storage,kind),plan=s.exchange?.pending;if(!plan||plan.id!==planId||plan.revision!==s.revision||plan.fingerprint!==fingerprint(s))throw Error('Preview is stale; review changes again');
 if(!Object.hasOwn(providers,plan.provider)||!['pull','push'].includes(plan.direction)||!['create','link','update'].includes(plan.operation)||!Array.isArray(plan.rows)||plan.rows.some(r=>!fields.includes(r.field)))throw Error('Invalid transfer plan');
 const canonical=plan.direction==='pull'?sampleProfile(plan.provider,kind).data:ownFields(storage,kind,plan.subjectId,plan.teamId);
 if(plan.rows.some(r=>JSON.stringify(r.after)!==JSON.stringify(canonical[r.field]??''))||(kind!=='family'&&plan.rows.some(r=>r.field==='parentDisplayName')))throw Error('Transfer payload changed; preview again');
 const {d}=target(storage,kind,plan.subjectId,plan.teamId);
 if(plan.identityKey!==(kind==='coach'?d.ctx.personId:plan.subjectId))throw Error('Profile owner changed; preview again');
 const manual=readSetup(storage,kind).people.find(p=>p.id===plan.subjectId);
 if(!authorized)throw Error('Explicit transfer approval is required');
 if(kind==='family'&&(!parentApproved||d.ctx.role!=='parent'))throw Error('Parent approval is required');
 if(kind==='college'&&manual?.minor!==false&&manual)throw Error('A minor requires a parent-managed workspace; self transfer is blocked');
 const before=copy(s);if(before.exchange){delete before.exchange.undo;delete before.exchange.pending;}
 const selected=Object.fromEntries(plan.rows.filter(r=>!r.conflict||r.resolution==='replace').map(r=>[r.field,r.after]));
 if(plan.direction==='pull'){
  const setup=readSetup(storage,kind),prior=setup.profiles[plan.subjectId]||{};
  setup.profiles[plan.subjectId]={...prior,...selected,teamId:plan.teamId,provenance:{...(prior.provenance||{}),...Object.fromEntries(Object.keys(selected).map(f=>[f,{provider:plan.provider,externalId:plan.externalId,mode:'imported-snapshot',fictional:true}]))}};s.setup=setup;
  if(selected.schedules){const team=d.teams.find(t=>t.id===plan.teamId);const map=new Map(s.entries.map(e=>[activityKey(e),e]));for(const raw of selected.schedules){const e=makeActivity(d,{eventId:'portfolio-'+plan.provider+'-'+raw.uid,title:raw.title,teamId:plan.teamId,participantId:plan.subjectId,sourceId:'manual-'+team.organizationId,start:raw.start,end:raw.end,eventType:raw.eventType,status:raw.status,location:raw.location,evidence:{url:'',summary:'Imported snapshot from '+providers[plan.provider]+' · FICTIONAL · no synchronization'}});map.set(activityKey(e),e);}if(map.size>600)throw Error('Demo limit reached');s.entries=[...map.values()];}
 }else{
  const destinations=destination(storage,kind,plan.provider);let dest=destinations.find(x=>x.id===plan.destinationId);
  if(!dest){dest={id:plan.destinationId,identityKey:plan.identityKey,subjectId:plan.subjectId,fields:{},version:0};destinations.push(dest);}
  if((dest.identityKey||dest.subjectId)&&(dest.identityKey||dest.subjectId)!==plan.identityKey)throw Error('Destination identity conflict');
  if(plan.operation==='create'&&dest.version)throw Error('Duplicate create prevented');
  dest.subjectId=plan.subjectId;dest.identityKey=plan.identityKey;if(plan.operation!=='link')dest.fields={...dest.fields,...selected};dest.version++;
  s.exchange.destinations={...(s.exchange.destinations||{}),[plan.provider]:destinations};
 }
 const links=(s.exchange.links||[]).filter(l=>!(l.provider===plan.provider&&l.subjectId===plan.subjectId));links.push({provider:plan.provider,subjectId:plan.subjectId,externalId:plan.direction==='pull'?plan.externalId:plan.destinationId,status:plan.direction==='pull'&&Object.keys(selected).length?'imported-snapshot':'linked-external-demo',fictional:true});s.exchange.links=links;
 const receipt={id:uid(),direction:plan.direction,provider:plan.provider,operation:plan.operation,fields:Object.keys(selected),status:'SIMULATED · No external system changed',subjectId:plan.subjectId};
 s.exchange.receipts=[...(s.exchange.receipts||[]),receipt].slice(-10);delete s.exchange.pending;
 s.exchange.undo={appliedRevision:(s.revision||0)+1,afterFingerprint:fingerprint(s),state:before};write(storage,kind,s);return receipt;
}
export function rollbackTransfer(storage,kind){const s=state(storage,kind),undo=s.exchange?.undo;if(!undo||undo.appliedRevision!==s.revision||undo.afterFingerprint!==fingerprint(s))throw Error('Rollback blocked: local data changed; review before undoing');const restored=copy(undo.state);restored.exchange={...(restored.exchange||{}),receipts:[...(restored.exchange?.receipts||[]),{status:'SIMULATED transfer rolled back locally'}].slice(-10)};write(storage,kind,restored);return restored;}
export function resetGuidedSetup(storage,kind){const s=state(storage,kind);delete s.setup;delete s.exchange;s.entries=s.entries.filter(e=>e?.organizationId!=='setup-'+kind&&!String(e?.eventId||'').startsWith('portfolio-'));write(storage,kind,s);}
export {ownFields as currentProfile};

export function configuredNotifications(kind,storage){const setup=readSetup(storage,kind);return notificationFixtures(kind,storage).filter(n=>setup.status!=='saved'||setup.preferences.notifications.includes(n.id.startsWith('playmetrics')?'changes':'reminders'));}
export function saveConfiguredPlan(storage,kind,teamId,title,notes){
 const base=loadRole(kind,storage);if(base.teams.some(t=>t.id===teamId))return savePlan(storage,kind,teamId,title,notes);
 const d=loadConfiguredRole(kind,storage);if(kind!=='coach'||!authorizedTeam(d,teamId))throw Error('Team not authorized for coaching');
 if(!text(title)||title.length>100||notes.length>2000)throw Error('Use a title and notes up to 2,000 characters');
 const s=state(storage,kind);if(s.plans.length>=30)throw Error('Demo plan limit reached');const plan={id:uid(),teamId,title:text(title),notes,createdAt:new Date().toISOString()};s.plans.push(plan);write(storage,kind,s);return plan;
}

export function updateSetupPerson(storage,kind,id,patch){
 const setup=readSetup(storage,kind),p=setup.people.find(p=>p.id===id);if(!p)throw Error('Unknown local association');
 if(!text(patch.name)||!text(patch.teamName)||!sports.includes(patch.sport))throw Error('Fictional name, sport and team are required');
 Object.assign(p,{name:text(patch.name,60),teamName:text(patch.teamName),sport:patch.sport,minor:patch.minor!==false});
 setup.profiles[id]={...(setup.profiles[id]||{}),displayName:p.name,sport:p.sport,teamName:p.teamName,teamId:id+'-team',provenance:{...(setup.profiles[id]?.provenance||{}),...Object.fromEntries(['displayName','sport','teamName'].map(f=>[f,{provider:'local',mode:'manual',fictional:true}]))}};
 saveSetup(storage,kind,setup);return p;
}
export function removeSetupPerson(storage,kind,id){
 const s=state(storage,kind),setup=readSetup(storage,kind);if(!setup.people.some(p=>p.id===id))throw Error('Unknown local association');
 const removedTeams=setup.extraTeams.filter(t=>t.participantId===id).map(t=>t.id);setup.extraTeams=setup.extraTeams.filter(t=>t.participantId!==id);setup.people=setup.people.filter(p=>p.id!==id);delete setup.profiles[id];s.setup=setup;s.entries=s.entries.filter(e=>e.participantId!==id);s.plans=s.plans.filter(p=>p.teamId!==id+'-team'&&!removedTeams.includes(p.teamId));
 if(s.exchange){s.exchange.links=(s.exchange.links||[]).filter(l=>l.subjectId!==id);delete s.exchange.pending;delete s.exchange.undo;}write(storage,kind,s);
}

export function addSetupTeam(storage,kind,{participantId,name,sport}){
 if(kind==='coach')return addSetupPerson(storage,kind,{name,teamName:name,sport,minor:false});
 const setup=readSetup(storage,kind),d=loadConfiguredRole(kind,storage);if(!d.ctx.participantIds.includes(participantId)||participantId.startsWith('builder-'))throw Error('Choose an owned local athlete; edit original builder records in their builder');
 if(!text(name)||!sports.includes(sport))throw Error('Team name and sport required');if(setup.extraTeams.length>=40)throw Error('Local team limit reached');
 if(setup.extraTeams.some(t=>t.participantId===participantId&&t.name.toLowerCase()===text(name).toLowerCase()&&t.sport===sport))throw Error('This athlete/team association already exists');
 const team={id:'setup-'+kind+'-team-'+uid(),participantId,name:text(name),sport};saveSetup(storage,kind,{extraTeams:[...setup.extraTeams,team]});return team;
}
