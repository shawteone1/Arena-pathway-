import test from 'node:test';
import assert from 'node:assert/strict';
import {createFamilyDemo} from '../../public/siem-family-fixtures.js';
import {activityKey,scopedActivities,actionQueue} from '../../public/siem-platform-model.js';
import {loadRole,makeActivity,readWorkspace,roleKey,addCommitment,importCalendar,notificationFixtures,applyNotification,savePlan} from '../../public/playrcmd-roles.js';
import {networkProjection} from '../network.mjs';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const raw={title:'Fictional training',day:'2030-05-06',startTime:'16:00',endTime:'17:00',eventType:'practice',teamId:'varsity',ref:'repeat',count:3};
const ics='BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:stable-test\r\nDTSTART:20300506T220000Z\r\nDTEND:20300506T230000Z\r\nSUMMARY:Fictional imported commitment\r\nEND:VEVENT\r\nEND:VCALENDAR';

test('accepted family retained; athlete and coach use the original permission-scoped SIEM',()=>{
 const s=memory(),family=loadRole('family',s);assert.deepEqual(family.activities,createFamilyDemo().activities);assert.deepEqual(family.sources,createFamilyDemo().sources);
 const college=loadRole('college',s),visible=scopedActivities(college,college.ctx);for(const type of ['class','practice','game','travel','personal','opportunity'])assert.ok(visible.some(e=>e.eventType===type),type);assert.ok(!visible.some(e=>e.title.includes('OTHER PERSON')));
 const coach=loadRole('coach',s);assert.equal(coach.teams.length,3);assert.equal(new Set(coach.teams.map(t=>t.organizationId)).size,3);
 for(const team of coach.teams){const events=scopedActivities(coach,coach.ctx,{teams:[team.id]});assert.ok(events.length);assert.ok(events.every(e=>e.teamId===team.id));}
 const isolated={...coach.ctx,memberships:coach.ctx.memberships.filter(m=>m.organizationId==='club')};assert.ok(scopedActivities(coach,isolated).every(e=>e.organizationId==='club'));
 assert.throws(()=>makeActivity(coach,{eventId:'bad',title:'Unauthorized',teamId:'foreign',organizationId:'foreign',start:'2030-05-06T22:00:00Z',end:'2030-05-06T23:00:00Z'}),/outside/);
});

test('manual recurrence and ICS reuse existing bounded logic, stable identity and atomic failure',()=>{
 const s=memory();addCommitment(s,'college',raw);assert.equal(readWorkspace(s,'college').entries.length,3);addCommitment(s,'college',{...raw,title:'Changed training'});assert.equal(readWorkspace(s,'college').entries.length,3);assert.ok(readWorkspace(s,'college').entries.every(e=>e.title==='Changed training'));assert.ok(actionQueue(loadRole('college',s),loadRole('college',s).ctx).length);
 importCalendar(s,'college',ics,'varsity');importCalendar(s,'college',ics,'varsity');assert.equal(readWorkspace(s,'college').entries.length,4);
 const before=s.getItem(roleKey('college'));assert.throws(()=>importCalendar(s,'college',ics.replace('DTSTART:', 'DTSTART;TZID=America/Denver:'),'varsity'),/UTC/);assert.equal(s.getItem(roleKey('college')),before);assert.throws(()=>addCommitment(s,'college',{...raw,count:13}),/1–12/);assert.equal(s.getItem(roleKey('college')),before);
 assert.throws(()=>addCommitment(s,'family',{...raw,teamId:'alex-soccer',participantId:'jordan'}),/match/);
 addCommitment(s,'coach',{...raw,teamId:'u14',ref:'team-ref',count:1});addCommitment(s,'coach',{...raw,teamId:'u17',ref:'team-ref',count:1});assert.equal(readWorkspace(s,'coach').entries.length,2,'same reference in independent teams never overwrites');
});

test('fictional notifications explicitly match existing events, update once and derive shared priorities',()=>{
 for(const role of ['family','college','coach']){
  const s=memory(),d=loadRole(role,s),count=d.activities.length;
  for(const n of notificationFixtures(role,s)){
   const applied=applyNotification(s,role,n.id);assert.equal(applied.duplicate,false);assert.ok(applied.entry.evidence.summary.includes('FICTIONAL'));const workspace=s.getItem(roleKey(role));assert.equal(applyNotification(s,role,n.id).duplicate,true);assert.equal(s.getItem(roleKey(role)),workspace);
   const projected=loadRole(role,s);assert.equal(projected.activities.length,count);assert.equal(projected.activities.filter(e=>activityKey(e)===n.targetKey).length,1);assert.ok(actionQueue(projected,projected.ctx).some(a=>a.activities.some(e=>activityKey(e)===n.targetKey)));if(n.provider==='TeamSnap')assert.ok(!actionQueue(projected,projected.ctx).some(a=>a.type==='changed'&&a.activities.some(e=>activityKey(e)===n.targetKey)),'a reminder must not fabricate a time/venue change');
  }
  assert.throws(()=>applyNotification(s,role,'unknown'),/Unknown/);
 }
});

test('storage tampering cannot introduce another organization or principal; session plans are team scoped',()=>{
 const s=memory(),d=loadRole('coach',s);const foreign={...d.activities[0],tenantId:'other-tenant',title:'PRIVATE SENTINEL'};s.setItem(roleKey('coach'),JSON.stringify({version:1,kind:'coach',entries:[foreign],applied:[]}));assert.ok(!loadRole('coach',s).activities.some(e=>e.title==='PRIVATE SENTINEL'));
 savePlan(s,'coach','u14','Fictional passing session','Warmup, decision exercise, reflection');assert.equal(readWorkspace(s,'coach').plans[0].teamId,'u14');assert.equal(readWorkspace(s,'college').entries.length,0);assert.throws(()=>savePlan(s,'college','varsity','Bad','Bad'),/coach-only/);assert.throws(()=>savePlan(s,'coach','foreign','Bad','Bad'),/authorized/);
});

test('network projects sourced public references without inventing openings or missing dates',()=>{
 const data=networkProjection(new URLSearchParams({sport:'volleyball',kind:'clubs'}));assert.ok(data.total>0);for(const item of data.items){assert.ok(item.url.startsWith('https:'));assert.ok(item.id);assert.match(item.classification,/snapshot/)}
 const tryouts=networkProjection(new URLSearchParams({sport:'lacrosse',kind:'tryouts'}));assert.ok(tryouts.items.some(e=>e.id==='de-tryout'));
 const jobs=networkProjection(new URLSearchParams({kind:'jobs'}));assert.match(jobs.status,/not-verified-openings/);assert.ok(jobs.items.every(e=>!e.start));assert.match(jobs.notice,/No dated Colorado coaching vacancies/);
 const showcases=networkProjection(new URLSearchParams({kind:'showcases'}));assert.equal(showcases.total,0);assert.deepEqual(showcases.items,[]);
});

test('host composition is PlayRcmd-only and fails closed if the reusable controller boundary changes',async()=>{
 const {readFile}=await import('node:fs/promises');const {hostedController}=await import('../controller-adapter.mjs');
 const source=await readFile(new URL('../../public/siem-platform.js',import.meta.url),'utf8');assert.ok(!source.includes('siemDemoHost'),'AP controller must remain untouched');
 const hosted=hostedController(source);assert.ok(hosted.includes('globalThis.siemDemoHost'));assert.ok(hosted.includes("window.addEventListener('siem-demo-updated'"));assert.throws(()=>hostedController('a changed controller without the loader contract'),/contract changed/);
});
