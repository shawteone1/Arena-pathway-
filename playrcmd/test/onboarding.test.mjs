import test from 'node:test';
import assert from 'node:assert/strict';
import {readSetup,saveSetup,addSetupPerson,loadConfiguredRole,addConfiguredCommitment,importConfiguredCalendar,sampleProfile,providerAdapters,previewTransfer,approveTransfer,exchangeStatus,destinationExamples,rollbackTransfer,resetGuidedSetup,configuredNotifications} from '../../public/playrcmd-onboarding.js';
import {loadRole,readWorkspace,roleKey,applyNotification} from '../../public/playrcmd-roles.js';
import {activityKey,canRead} from '../../public/siem-platform-model.js';
import {createPlayRcmdServer} from '../server.mjs';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const pair=(s,k)=>{const d=loadConfiguredRole(k,s),t=d.teams.find(t=>d.ctx.memberships.some(m=>m.teamIds.includes(t.id)));return {teamId:t.id,subjectId:t.participantId||(k==='coach'?t.id:d.participants[0].id)};};
const preview=(s,k,extra={})=>previewTransfer(s,k,{direction:'pull',provider:'soccer-center',...pair(s,k),selected:['displayName'],resolutions:{displayName:'replace'},...extra});
const approved={authorized:true,parentApproved:true};
const manual=(teamId,participantId)=>({teamId,participantId,title:'Fictional new team training',ref:'stable-guided',day:'2030-05-06',startTime:'15:00',endTime:'16:00',eventType:'practice',count:3});

test('unconfigured and skipped role projections preserve all original fixtures and saved records',()=>{
 for(const k of ['family','college','coach']){const s=memory();assert.equal(readSetup(s,k).status,'new');assert.deepEqual(loadConfiguredRole(k,s),loadRole(k,s));saveSetup(s,k,{status:'skipped'});assert.deepEqual(loadConfiguredRole(k,s),loadRole(k,s));}
});
test('setup progress persists, sanitizes foreign scope, is independently editable and resets only its role',()=>{
 const s=memory();saveSetup(s,'family',{step:3,status:'draft',preferences:{notifications:['changes','evil'],opportunities:['camps']}});
 assert.equal(readSetup(s,'family').step,3);assert.deepEqual(readSetup(s,'family').preferences.notifications,['changes']);assert.equal(readSetup(s,'coach').status,'new');
 saveSetup(s,'family',{status:'saved'});assert.equal(readSetup(s,'family').status,'saved');resetGuidedSetup(s,'family');assert.equal(readSetup(s,'family').status,'new');
 assert.throws(()=>readSetup(s,'foreign'),/Unknown role/);
});
test('manual teams extend only the local fictional organization; original validators schedule recurrence and de-duplicate',()=>{
 for(const kind of ['family','college','coach']){
  const s=memory(),p=addSetupPerson(s,kind,{name:'Fictional new association',teamName:'Fictional local team',sport:'swimming',minor:false}),teamId=p.id+'-team';
  const d=loadConfiguredRole(kind,s);assert.equal(d.teams.find(t=>t.id===teamId).organizationId,'setup-'+kind);assert.ok(d.ctx.memberships.some(m=>m.organizationId==='setup-'+kind));
  addConfiguredCommitment(s,kind,manual(teamId,p.id));addConfiguredCommitment(s,kind,manual(teamId,p.id));assert.equal(readWorkspace(s,kind).entries.length,3);assert.ok(loadConfiguredRole(kind,s).activities.filter(e=>e.teamId===teamId).every(e=>canRead(e,loadConfiguredRole(kind,s).ctx)));
  assert.throws(()=>addConfiguredCommitment(s,kind,manual('foreign',p.id)),/outside/);
  resetGuidedSetup(s,kind);assert.equal(readWorkspace(s,kind).entries.length,0);
 }
});
test('ICS snapshots reuse bounded parser, stable UIDs and atomic rejection',()=>{
 const s=memory(),t=pair(s,'family');const ics='BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:onboarding-test\r\nDTSTART:20300506T220000Z\r\nDTEND:20300506T230000Z\r\nSUMMARY:Fictional imported session\r\nEND:VEVENT\r\nEND:VCALENDAR';
 importConfiguredCalendar(s,'family',ics,t.teamId,t.subjectId);importConfiguredCalendar(s,'family',ics,t.teamId,t.subjectId);assert.equal(readWorkspace(s,'family').entries.length,1);
 const before=s.getItem(roleKey('family'));assert.throws(()=>importConfiguredCalendar(s,'family',ics.replace('DTSTART:','DTSTART;TZID=UTC:'),t.teamId,t.subjectId),/UTC/);assert.equal(s.getItem(roleKey('family')),before);
});
test('provider mappings drop private information and never import role, guardian or recruiting privileges',()=>{
 const raw={player:{label:'Fictional',primaryPosition:'Wing',birthYear:2016,contactEmail:'private',recruiting:true},affiliation:{orgName:'Sample'},parent:{displayName:'Sample parent',guardian:true},events:[]};
 const out=providerAdapters['soccer-center'](raw);assert.deepEqual(Object.keys(out).sort(),['displayName','sport','teamName','position','parentDisplayName','schedules'].sort());assert.ok(!JSON.stringify(out).includes('private'));assert.ok(!('guardian' in out));assert.throws(()=>sampleProfile('foreign','family'));
});
test('pull previews are selective, require explicit parent approval and preserve unselected fields',()=>{
 const s=memory(),before=loadConfiguredRole('family',s),p=preview(s,'family',{selected:['position']});assert.equal(readWorkspace(s,'family').entries.length,0);
 assert.throws(()=>approveTransfer(s,'family',p.id,{authorized:true}),/Parent approval/);approveTransfer(s,'family',p.id,approved);
 const after=loadConfiguredRole('family',s);assert.deepEqual(after.participants,before.participants);assert.equal(readSetup(s,'family').profiles[p.subjectId].position,'Midfield');assert.equal(exchangeStatus(s,'family').links[0].status,'imported-snapshot');assert.throws(()=>approveTransfer(s,'family',p.id,approved),/stale/);
});
test('snapshot UIDs cannot duplicate entries; conflict defaults preserve the existing name until explicitly selected',()=>{
 const s=memory();let p=preview(s,'family',{selected:['displayName','schedules'],resolutions:{displayName:'keep',schedules:'replace'}});approveTransfer(s,'family',p.id,approved);const n=readWorkspace(s,'family').entries.length;
 p=preview(s,'family',{selected:['schedules'],resolutions:{schedules:'replace'}});approveTransfer(s,'family',p.id,approved);assert.equal(readWorkspace(s,'family').entries.length,n);assert.equal(new Set(loadConfiguredRole('family',s).activities.map(activityKey)).size,loadConfiguredRole('family',s).activities.length);
});
test('create, link and update use explicit identity; duplicate creation and unlinked updates fail closed',()=>{
 const s=memory(),target=pair(s,'college'),base={direction:'push',provider:'arena-pathway',...target,selected:['displayName'],resolutions:{displayName:'replace'}};
 const existing=destinationExamples(s,'college','arena-pathway')[0].id;
 assert.throws(()=>previewTransfer(s,'college',{...base,operation:'update',destinationId:existing}),/Link this/);
 let p=previewTransfer(s,'college',{...base,operation:'link',destinationId:existing,selected:[]});approveTransfer(s,'college',p.id,{authorized:true});
 p=previewTransfer(s,'college',{...base,operation:'update',destinationId:existing});approveTransfer(s,'college',p.id,{authorized:true});assert.equal(destinationExamples(s,'college','arena-pathway')[0].fields.displayName,'Sam Taylor');
 assert.throws(()=>previewTransfer(s,'college',{...base,operation:'create'}),/Duplicate prevented/);
 const s2=memory();p=previewTransfer(s2,'college',{...base,operation:'create',destinationId:existing});approveTransfer(s2,'college',p.id,{authorized:true});assert.throws(()=>previewTransfer(s2,'college',{...base,operation:'create'}),/Duplicate/);
});
test('stale preview and rollback detect changes even when a legacy writer does not increment revision',()=>{
 const s=memory(),p=preview(s,'family');applyNotification(s,'family','playmetrics-change-family');assert.throws(()=>approveTransfer(s,'family',p.id,approved),/stale/);
 const q=preview(s,'family');approveTransfer(s,'family',q.id,approved);const now=readWorkspace(s,'family');s.setItem(roleKey('family'),JSON.stringify({...now,drafts:{new:'Changed'}}));assert.throws(()=>rollbackTransfer(s,'family'),/changed/);
});
test('rollback restores the prior local projection without recalling any external data',()=>{
 const s=memory(),before=loadConfiguredRole('family',s);const p=preview(s,'family',{selected:['position','schedules'],resolutions:{schedules:'replace'}});approveTransfer(s,'family',p.id,approved);assert.ok(readWorkspace(s,'family').entries.length);rollbackTransfer(s,'family');assert.deepEqual(loadConfiguredRole('family',s),before);assert.match(exchangeStatus(s,'family').receipts.at(-1).status,/rolled back locally/);
});
test('minor self transfers, cross-role approvals and foreign organization/team requests are blocked',()=>{
 const s=memory(),p=addSetupPerson(s,'college',{name:'Fictional minor',sport:'soccer',teamName:'Fictional team',minor:true});const plan=preview(s,'college',{subjectId:p.id,teamId:p.id+'-team'});assert.throws(()=>approveTransfer(s,'college',plan.id,approved),/minor requires/);
 const parent=preview(s,'family');assert.throws(()=>approveTransfer(s,'coach',parent.id,approved),/stale/);
 assert.throws(()=>preview(s,'family',{teamId:'foreign-team'}),/outside/);assert.throws(()=>preview(s,'family',{selected:['birthYear','recruiting']}),/Unsupported/);
 const d=readWorkspace(s,'family');d.exchange.pending.rows[0].after='Injected';s.setItem(roleKey('family'),JSON.stringify(d));assert.throws(()=>approveTransfer(s,'family',parent.id,approved),/payload changed/);
});
test('notification choices filter fictional messages while keeping role permissions and scopes',()=>{
 const s=memory();saveSetup(s,'family',{status:'saved',preferences:{notifications:['changes'],opportunities:[]}});assert.equal(configuredNotifications('family',s).length,1);assert.ok(loadConfiguredRole('family',s).activities.every(e=>e.eventType!=='opportunity'));
});
test('standalone HTTP serves the new adapter/UI but keeps the approved landing and restrictive CSP',async t=>{
 const server=createPlayRcmdServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());const base='http://127.0.0.1:'+server.address().port;
 for(const p of ['/assets/playrcmd-onboarding.js','/playrcmd/onboarding.js','/playrcmd/onboarding.css'])assert.equal((await fetch(base+p)).status,200,p);
 const tour=await(await fetch(base+'/assets/siem-guidance.js')).text();assert.ok(tour.includes("!['family','college','coach'].includes(scenario.value)"));
 const r=await fetch(base+'/demo?scenario=coach');assert.doesNotMatch(r.headers.get('content-security-policy'),/unsafe-inline/);assert.equal((await fetch(base+'/api/portfolio')).status,404,'no live cross-product API introduced');
});

test('manual association edits preserve stable IDs; removal only removes its own local commitments',async()=>{
 const {updateSetupPerson,removeSetupPerson}=await import('../../public/playrcmd-onboarding.js');const s=memory();
 const person={name:'Fictional editable',sport:'swimming',teamName:'Local swim team',minor:true};const p=addSetupPerson(s,'family',person);
 assert.throws(()=>addSetupPerson(s,'family',person),/already exists/);addConfiguredCommitment(s,'family',manual(p.id+'-team',p.id));
 updateSetupPerson(s,'family',p.id,{...person,name:'Fictional edited',teamName:'Edited local swim team'});assert.equal(loadConfiguredRole('family',s).participants.find(x=>x.id===p.id).name,'Fictional edited');assert.equal(readWorkspace(s,'family').entries.length,3);
 removeSetupPerson(s,'family',p.id);assert.equal(readWorkspace(s,'family').entries.length,0);assert.deepEqual(loadConfiguredRole('family',s),loadRole('family',s));assert.throws(()=>removeSetupPerson(s,'coach',p.id),/Unknown/);
});

test('existing family builder is opt-in and projected without migrating or rewriting its records',()=>{
 const s=memory();const original={version:1,familyId:'local-family',athletes:[{id:'builder-sample',name:'Fictional builder child',sport:'soccer',origin:'siem',type:'athlete'}],events:[{id:'builder-event',ref:'builder-ref',athleteId:'builder-sample',source:'manual',title:'Existing fictional builder practice',type:'practice',start:'2030-05-06T22:00:00.000Z',end:'2030-05-06T23:00:00.000Z',status:'scheduled',requirements:[]}],actions:{},audit:[],permissions:{recruiting:false,lockedIn:false}};
 s.setItem('arenaPathway.siem.v1',JSON.stringify(original));const bytes=s.getItem('arenaPathway.siem.v1');assert.ok(!loadConfiguredRole('family',s).activities.some(e=>e.title===original.events[0].title));
 saveSetup(s,'family',{useBuilder:true});const d=loadConfiguredRole('family',s);assert.ok(d.participants.some(p=>p.name==='Fictional builder child'));assert.ok(d.activities.some(e=>e.title===original.events[0].title));assert.equal(s.getItem('arenaPathway.siem.v1'),bytes);assert.ok(!loadConfiguredRole('coach',s).activities.some(e=>e.title===original.events[0].title));
 resetGuidedSetup(s,'family');assert.equal(s.getItem('arenaPathway.siem.v1'),bytes);
});

test('a second sport/team reuses the existing athlete identity without widening external organization scope',async()=>{
 const {addSetupTeam}=await import('../../public/playrcmd-onboarding.js');const s=memory(),before=loadRole('family',s);const t=addSetupTeam(s,'family',{participantId:'alex',name:'Fictional second sport',sport:'swimming'});
 const d=loadConfiguredRole('family',s);assert.equal(d.participants.length,before.participants.length);assert.ok(d.participants.find(p=>p.id==='alex').sports.includes('swimming'));const pull=preview(s,'family',{selected:['sport']});approveTransfer(s,'family',pull.id,approved);assert.ok(loadConfiguredRole('family',s).participants.find(p=>p.id==='alex').sports.includes('swimming'));assert.equal(d.teams.find(x=>x.id===t.id).organizationId,'setup-family');addConfiguredCommitment(s,'family',manual(t.id,'alex'));assert.equal(readWorkspace(s,'family').entries.length,3);
 assert.throws(()=>addSetupTeam(s,'family',{participantId:'foreign',name:'Foreign',sport:'soccer'}),/owned/);assert.throws(()=>addSetupTeam(s,'family',{participantId:'alex',name:'Fictional second sport',sport:'swimming'}),/already exists/);
});

test('one coach cannot accidentally create a second provider profile by changing selected teams',()=>{
 const s=memory(),d=loadConfiguredRole('coach',s);let p=previewTransfer(s,'coach',{direction:'push',provider:'soccer-center',operation:'create',subjectId:'u14',teamId:'u14',selected:['displayName']});approveTransfer(s,'coach',p.id,{authorized:true});
 assert.throws(()=>previewTransfer(s,'coach',{direction:'push',provider:'soccer-center',operation:'create',subjectId:'u17',teamId:'u17',selected:['displayName']}),/Duplicate/);
 const existing=destinationExamples(s,'coach','soccer-center').find(p=>p.identityKey===d.ctx.personId);p=previewTransfer(s,'coach',{direction:'push',provider:'soccer-center',operation:'update',subjectId:'u17',teamId:'u17',destinationId:existing.id,selected:['displayName']});approveTransfer(s,'coach',p.id,{authorized:true});assert.equal(destinationExamples(s,'coach','soccer-center').filter(p=>p.identityKey===d.ctx.personId).length,1);
});
