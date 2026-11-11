import {preservedBytes,uxFiles} from './preservation-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createScenario} from '../public/siem-platform-fixtures.js';
import {activityContract,activityKey,roles,scopedActivities,canRead,actionQueue,takeAction,correlated,sourceHealth,visibleSources,readAdapter,FIXTURE_NOW} from '../public/siem-platform-model.js';
import {createServer} from '../server.mjs';
const base='50ce75d58074485054e65e92a3b5413591cf1712';
test('platform fixtures have deterministic timestamps and all requested activity/source fields',()=>{
 for(const kind of ['parent','coach','college']){const d=createScenario(kind),repeat=createScenario(kind);assert.deepEqual(d,repeat);assert.equal(d.now,Date.parse(FIXTURE_NOW));for(const e of d.activities){assert.deepEqual(activityContract(e),e);assert.equal(e.schemaVersion,2);assert.equal(e.demo,true);assert.equal(e.timezone,'America/Denver');assert.ok(e.originalSourceTimestamp);}}
 assert.ok(roles.includes('professional-athlete'));assert.ok(roles.includes('recreational-athlete'));
});
test('contract rejects ambiguous times, scope mismatch, unsafe links and sensitive payload fields',()=>{
 const raw=createScenario().activities[0];assert.throws(()=>activityContract({...raw,start:'2030-05-06T09:00'}));assert.throws(()=>activityContract({...raw,timezone:'Wrong/Zone'}));assert.throws(()=>activityContract({...raw,permissionScope:{...raw.permissionScope,tenantId:'other'}}));assert.throws(()=>activityContract({...raw,visibility:'private',ownerId:null}));
 const safe=activityContract({...raw,evidence:{url:'javascript:alert(1)'},medical:'SECRET',token:'SECRET'});assert.equal(safe.evidence.url,'');assert.equal(JSON.stringify(safe).includes('SECRET'),false);
});
test('parent and coach organization/team filters apply before SIEM correlation',()=>{
 const parent=createScenario();assert.equal(scopedActivities(parent,{...parent.ctx,tenantId:'other'}).length,0);assert.ok(actionQueue(parent,parent.ctx).some(a=>a.type==='conflict'));
 const d=createScenario('coach');assert.equal(scopedActivities(d,d.ctx,{organizations:['club']}).some(e=>e.organizationId==='program'),false);
 const narrow={...d.ctx,memberships:d.ctx.memberships.filter(m=>m.organizationId==='club')};assert.ok(scopedActivities(d,narrow).every(e=>e.organizationId==='club'));assert.equal(actionQueue(d,narrow).filter(a=>a.type==='conflict').length,0);assert.ok(scopedActivities(d,d.ctx,{teams:['u17']}).every(e=>e.teamId==='u17'));
});
test('one identity may have multiple roles without exposing private cross-role activities',()=>{
 const d=createScenario('college');assert.deepEqual(d.ctx.roles,['college-athlete','coach']);const campus=scopedActivities(d,d.ctx);assert.ok(campus.some(e=>e.eventType==='class'));assert.ok(!campus.some(e=>e.eventId==='other-private'||e.eventId==='coach-private'));const coach={...d.ctx,role:'coach'};const es=scopedActivities(d,coach);assert.deepEqual(es.map(e=>e.eventId),['coach-private']);assert.equal(canRead(campus.find(e=>e.visibility==='private'),coach),false);
});
test('existing SIEM logic powers changes, duplicates, deadlines and per-scenario actions',()=>{
 const d=createScenario();const queue=actionQueue(d,d.ctx);for(const type of ['changed','canceled','conflict','duplicate','deadline'])assert.ok(queue.some(a=>a.type===type),type);assert.equal(queue[0].priority,1);assert.equal(queue.filter(a=>a.type==='conflict').length,1);assert.ok(queue.find(a=>a.type==='deadline').memberIds.length>1);const a=queue.find(a=>a.type==='deadline');takeAction(d,d.ctx,a.id,'acknowledged');assert.equal(actionQueue(d,d.ctx).find(x=>x.id===a.id).status,'acknowledged');takeAction(d,d.ctx,a.id,'resolved');assert.equal(actionQueue(d,d.ctx).find(x=>x.id===a.id).status,'resolved');assert.ok(actionQueue(createScenario(),createScenario().ctx).every(a=>a.status==='open'));assert.throws(()=>takeAction(d,{...d.ctx,tenantId:'other'},a.id,'resolved'));assert.equal(d.activities.filter(e=>e.title===d.activities[0].title).length,2);
});
test('correlation and detail relationships cannot cross permission boundaries',()=>{
 const d=createScenario('college'),notice=d.activities.find(e=>e.eventId==='notice');assert.ok(correlated(d,d.ctx,notice).some(e=>e.eventId==='training'));const hidden=d.activities.find(e=>e.eventId==='other-private');notice.relatedEventIds.push(hidden.eventId);assert.ok(!correlated(d,d.ctx,notice).some(e=>e.eventId==='other-private'));assert.equal(correlated(d,d.ctx,hidden).length,0);
});
test('feed health keeps disconnected, failed, stale and current fixture states explicit',()=>{
 const d=createScenario();assert.deepEqual(new Set(visibleSources(d,d.ctx).map(s=>sourceHealth(s,d.now).state)),new Set(['fresh','stale','failed','disconnected']));const source=d.sources[0],before=source.lastSynchronizedAt;sourceHealth(source,d.now+60000);assert.equal(source.lastSynchronizedAt,before);assert.equal(sourceHealth({...source,lastSynchronizedAt:null},d.now).state,'unknown');
});
test('adapter validates snapshots atomically and retains last-known-good on failure/out-of-scope data',async()=>{
 const d=createScenario('college'),good={schemaVersion:2,asOf:FIXTURE_NOW,activities:scopedActivities(d,d.ctx)},adapter={read:async()=>good};const accepted=await readAdapter(adapter,d.ctx,null);assert.equal(accepted.ok,true);const previous=accepted.snapshot;
 for(const read of [async()=>{throw Error('token-secret');},async()=>({...good,activities:d.activities}),async()=>({...good,schemaVersion:999}),async()=>({...good,activities:[{...good.activities[0],end:'invalid'}]})]){const result=await readAdapter({read},d.ctx,previous);assert.equal(result.ok,false);assert.equal(result.snapshot,previous);assert.equal(result.error.includes('token-secret'),false);}
});
test('platform changes preserve discovery engine, data, registry, ingestion and approved assets exactly',()=>{
 const files=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(p=>p.startsWith('engine/')||p.startsWith('data/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(p)||p==='src/engine-directory.mjs'||p==='src/unified-directory.mjs'||p.startsWith('public/brand/')||p.startsWith('design/brand/')||p==='docs/PRODUCT-NORTH-STAR.md'||p==='AGENTS.md');
 for(const f of files.filter(f=>!uxFiles.has(f)))assert.deepEqual(readFileSync(f),preservedBytes(base,f,{maxBuffer:40e6}),f);
});
test('platform route and allowlisted assets work without changing old workspace/demo routes',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const origin='http://127.0.0.1:'+server.address().port;
 for(const path of ['/siem/platform','/siem','/demos/parent','/demos/coach','/demos/college','/my-pathway','/build'])assert.equal((await fetch(origin+path)).status,200,path);
 const res=await fetch(origin+'/siem/platform');assert.ok(res.headers.get('content-security-policy').includes("script-src 'self'"));const html=await res.text();assert.match(html,/ap-desktop.webp/);for(const label of ['Everyday View','Command Center','Display Mode','Shared-screen privacy','ILLUSTRATIVE DEMO'])assert.ok(html.includes(label));for(const f of ['siem-platform.js','siem-platform-model.js','siem-platform-fixtures.js','siem-platform.css'])assert.equal((await fetch(origin+'/assets/'+f)).status,200);
 assert.equal((await fetch(origin+'/api/siem/platform')).status,404);assert.equal((await fetch(origin+'/siem/platform',{method:'POST'})).status,405);
});
