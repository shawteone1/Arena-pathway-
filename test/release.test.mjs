import {createHash} from 'node:crypto';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {makeDemo,demoEvents,demoAlerts,acknowledgeDemo,scenarioIds} from '../public/release-demo-model.js';
import {approvedPositioning} from '../src/release-views.mjs';
import {createServer} from '../server.mjs';import {clientCatalog,programs} from '../src/unified-directory.mjs';
test('all three demonstrations reuse SIEM normalization, show changes/conflicts/actions and remain isolated',()=>{
 for(const kind of scenarioIds){const d=makeDemo(kind),alerts=demoAlerts(d);assert.ok(alerts.some(a=>a.type==='conflict'));assert.ok(alerts.some(a=>a.type==='changed'));assert.ok(alerts.some(a=>a.type==='canceled'));assert.ok(alerts.some(a=>a.type==='deadline'));assert.ok(demoEvents(d).some(e=>e.type==='communication'));assert.ok(d.state.events.every(e=>e.source==='manual'&&!e.verified&&e.evidence.includes('Fictional')));assert.ok(demoEvents(d,d.state.athletes[0].id).every(e=>e.athleteId===d.state.athletes[0].id));acknowledgeDemo(d,alerts[0].id);assert.equal(demoAlerts(d).find(a=>a.id===alerts[0].id).status,'acknowledged');assert.ok(demoAlerts(makeDemo(kind)).every(a=>a.status==='open'));}
 assert.throws(()=>makeDemo('fan'));assert.equal(makeDemo('parent').state.athletes.length,2);assert.equal(makeDemo('coach').state.athletes.length,2);assert.ok(makeDemo('college').state.events.some(e=>e.activity==='class'));
 const code=readFileSync(new URL('../public/release-demo.js',import.meta.url),'utf8');assert.ok(!/localStorage|sessionStorage|fetch\(|innerHTML/.test(code));
});
test('integration preserves reviewed records, source URLs and approved charter/brand assets while allowing additions',()=>{
 for(const file of ['src/brand.json','src/photography.json'])assert.equal(readFileSync(file,'utf8'),execFileSync('git',['show','ff4c226:'+file],{encoding:'utf8'}));
 const base=JSON.parse(execFileSync('git',['show','ff4c226:data/engine/approved.json'],{encoding:'utf8',maxBuffer:30e6}));
 const current=JSON.parse(readFileSync('data/engine/approved.json'));for(const collection of ['entities','evidence'])for(const row of base[collection])assert.deepEqual(current[collection].find(e=>e.id===row.id),row);
 const registry=JSON.parse(readFileSync('data/engine/registry.json'));for(const source of JSON.parse(execFileSync('git',['show','ff4c226:data/engine/registry.json'],{encoding:'utf8'})))assert.ok(source.urls.every(url=>registry.find(s=>s.id===source.id)?.urls.includes(url)));
 const oldPrograms=JSON.parse(execFileSync('git',['show','ff4c226:data/unified/catalog.json'],{encoding:'utf8',maxBuffer:30e6})).programs;for(const p of oldPrograms)assert.ok(programs.some(x=>x.id===p.id)||JSON.parse(readFileSync('data/unified/catalog.json')).programs.some(x=>x.id===p.id));

 // Immutable hashes of approved governance commit 95275cc; portable after cherry-pick.
 for(const [file,expected] of Object.entries({"AGENTS.md": "ce76b80ef1fcfb83d0036acea67fa11e6f87fb2a17d07d9b7b9a2c8037266ff5", "docs/PRODUCT-NORTH-STAR.md": "7afce3caa2e7113f5dbcb3dccd061dcc2ceab6b3654154e406ab1f03782fff27"}))assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),expected);
});
test('SIEM opportunities have verified youth program ownership and schedule state',()=>{
 assert.ok(clientCatalog.siemOpportunities.length);for(const o of clientCatalog.siemOpportunities){assert.equal(o.designation,'youth');assert.ok(programs.some(p=>p.id===o.programId&&p.organizationId===o.organizationId));assert.ok(['historical','needs-review','date-unconfirmed','published-upcoming'].includes(o.scheduleState));}
});
test('integrated presentation routes, scenario boundaries and CSP remain valid',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/','/about','/offerings','/collective-data','/soccer-center','/siem',...scenarioIds.map(s=>'/demos/'+s)]){const r=await fetch(base+path);assert.equal(r.status,200,path);assert.ok(r.headers.get('content-security-policy').includes("connect-src 'self'"));const html=await r.text();assert.match(html,/ap-desktop.webp/);if(path==='/siem'||path.startsWith('/demos/')){assert.ok(html.includes('Your life. One actionable dashboard.'));assert.ok(html.includes('Check your AP'));}const menu=html.match(/<nav aria-label="Sports">(.*?)<\/nav>/s)[1];assert.equal((menu.match(/<a /g)||[]).length,5);}
 const offerings=await(await fetch(base+'/offerings')).text();for(const text of ['SIEM','Locked In / IDM','Recruiting','Business Automation','Collective Data — Coming Soon'])assert.ok(offerings.includes(text));
 const about=await(await fetch(base+'/about')).text();assert.ok(about.includes(approvedPositioning));
 const siem=await(await fetch(base+'/siem')).text();assert.ok(siem.includes('siem-participant-add'));assert.ok(siem.includes('without creating an athlete or recruiting profile'));
 for(const asset of ['release-demo.js','release-demo-model.js','siem.js','siem-model.js'])assert.equal((await fetch(base+'/assets/'+asset)).status,200);
 assert.equal((await fetch(base+'/demos/fan')).status,404);assert.equal((await fetch(base+'/demos/coach',{method:'POST'})).status,405);assert.equal((await fetch(base+'/api/siem')).status,404);
});
