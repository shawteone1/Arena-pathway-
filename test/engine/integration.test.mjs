import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {EngineStore} from '../../engine/store.mjs';import {seedBaseline} from '../../engine/baseline.mjs';import {restoreSnapshot} from '../../engine/transfer.mjs';import {validateEntities} from '../../engine/models.mjs';import {createServer} from '../../server.mjs';import {engineSnapshot,catalog,directoryRows,filterEngineRows} from '../../src/engine-directory.mjs';
const original=JSON.parse(readFileSync(new URL('../../data/catalog.json',import.meta.url)));
test('portable audit restores reviewed entities, candidate history and approvals transactionally',()=>{
 const dir=mkdtempSync(join(tmpdir(),'arena-audit-')),path=join(dir,'restored.sqlite');let s=new EngineStore(path);try{seedBaseline(s);const result=restoreSnapshot(s,engineSnapshot);assert.equal(result.restoredEntities,engineSnapshot.entities.length);assert.equal(validateEntities(s.entities()).valid,true);assert.equal(s.report().candidates.length,engineSnapshot.candidates.length);assert.equal(s.report().approvals.length,engineSnapshot.approvals.length);assert.throws(()=>restoreSnapshot(s,engineSnapshot),/fresh/);s.close();s=new EngineStore(path);assert.equal(s.report().runs.length,engineSnapshot.runs.length);s.db.prepare('VACUUM INTO ?').run(join(dir,'backup.sqlite'));}finally{s.close();rmSync(dir,{recursive:true,force:true});}
});
test('published overlay preserves every original reviewed record and excludes all unresolved games',()=>{
 for(const key of ['organizations','teams','schools','leagues','divisions','communities','opportunities'])for(const row of original[key])assert.deepEqual(catalog[key].find(r=>r.id===row.id),row);
 assert.ok(engineSnapshot.candidates.some(r=>r.payload.entity?.kind==='event'&&r.payload.decision==='unresolved'));
 const unverified=new Set(engineSnapshot.entities.filter(e=>e.reviewStatus!=='verified').map(e=>e.id));for(const sport of ['swimming','lacrosse','basketball','volleyball'])assert.ok(directoryRows(sport).every(r=>!unverified.has(r.id)));
 assert.equal(catalog.opportunities.filter(e=>e.engine&&e.scheduleState==='date-unconfirmed').length,0);
 assert.ok(directoryRows('swimming').some(r=>r.name==='Aquawolves Swim Team'&&r.programType==='year-round-usa-swimming'));
 assert.ok(directoryRows('swimming').some(r=>r.name==='ACES Swim Club'&&r.programType==='unknown'));
 assert.ok(catalog.schools.some(r=>r.name==='Colorado Mesa University'));
});
test('directory filters distinguish seasons, collegiate genders, geography and adaptive programs',()=>{
 const all=directoryRows('swimming');let rows=filterEngineRows(all,new URLSearchParams('region=western-slope&gender=women&level=collegiate&competitionType=collegiate-swimming'));assert.ok(rows.length);assert.ok(rows.every(r=>r.region==='western-slope'&&r.genders.includes('women')));
 rows=filterEngineRows(directoryRows('basketball'),new URLSearchParams('level=adaptive'));assert.ok(rows.some(r=>r.name.includes('SCOPE')));
 const season=all.find(r=>r.seasonId&&r.name.includes('Fox'))?.seasonId;assert.ok(season);assert.ok(filterEngineRows(all,new URLSearchParams({season})).every(r=>r.seasonId===season));
});
test('coverage and first-party routes serve partial source denominators with read-only HTTP access',async t=>{
 const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>s.close(r)));const base='http://127.0.0.1:'+s.address().port;
 for(const route of ['/data/engine','/sports/swimming/teams?program=summer-league','/sports/swimming/teams?program=collegiate','/sports/basketball/community','/sports/lacrosse/teams?level=high-school']){const r=await fetch(base+route);assert.equal(r.status,200,route);const html=await r.text();assert.ok(html.includes('/assets/brand/'));assert.ok(html.includes('id="main"'));}
 const coverage=await (await fetch(base+'/api/data/coverage')).json();assert.equal(coverage.statewideComplete,false);assert.equal(coverage.scheduler.operational,false);const mhsl=coverage.sports.find(s=>s.sport==='swimming').sources.find(s=>s.id==='swim-mhsl');assert.equal(mhsl.expected,21);assert.equal(mhsl.captured,21);assert.notEqual(mhsl.status,'complete');assert.ok(coverage.sports.find(s=>s.sport==='volleyball').sources.some(s=>s.status==='blocked'));
 assert.equal((await fetch(base+'/api/data/coverage',{method:'POST'})).status,405);
 const redirect=await fetch(base+'/sports/swimming/teams?sport=basketball&level=adaptive',{redirect:'manual'});assert.equal(redirect.status,302);assert.ok(redirect.headers.get('location').includes('level=adaptive'));
});
test('saved directory divisions and facilities can be resolved by the existing athlete workspace',()=>{
 const app=readFileSync(new URL('../../public/app.js',import.meta.url),'utf8');const declaration=app.match(/function findRecord\(id\)\{[^\n]+\}/)[0];const findRecord=new Function('data',declaration+';return findRecord;')(catalog);
 for(const r of [...catalog.divisions,...(catalog.locations||[])])assert.equal(findRecord(r.id)?.id,r.id);
});
