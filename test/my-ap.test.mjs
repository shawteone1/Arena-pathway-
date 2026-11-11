import {preservedBytes,uxFiles} from './preservation-helper.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {legacySiemDestination} from '../src/siem-navigation.mjs';import {createServer} from '../server.mjs';
test('legacy My AP destinations are explicit local routes with safe bounded query preservation',()=>{
 assert.equal(legacySiemDestination('/siem'),'/my-ap?scenario=family&mode=everyday');
 assert.equal(legacySiemDestination('/demos/parent'),'/my-ap?scenario=family&mode=everyday');
 assert.equal(legacySiemDestination('/demos/coach'),'/my-ap?scenario=coach&mode=command');
 assert.equal(legacySiemDestination('/demos/college'),'/my-ap?scenario=college&mode=everyday');
 assert.equal(legacySiemDestination('/unknown'),null);
 assert.equal(legacySiemDestination('/siem',new URLSearchParams('next=https://evil.invalid&scenario=bad&mode=display&section=calendar')),'/my-ap?scenario=family&mode=display&section=calendar');
});
test('main entry, aliases, setup, legacy redirects, headers and retired renderer boundaries are valid',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/my-ap','/siem/platform?scenario=family&mode=everyday']){const r=await fetch(base+path);assert.equal(r.status,200);const html=await r.text();for(const label of ['My Day','Calendar','Messages','My Family'])assert.match(html,new RegExp('aria-label="'+label+'"'));assert.match(html,/siem-platform-boot.js/);assert.match(r.headers.get('content-security-policy'),/script-src 'self'/);}
 for(const path of ['/siem','/demos/parent','/demos/coach','/demos/college']){const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,302);assert.ok(r.headers.get('location').startsWith('/my-ap?'));const page=await(await fetch(base+path)).text();assert.ok(!page.includes('src="/assets/release-demo.js"'));}
 const setup=await(await fetch(base+'/siem/setup')).text();assert.match(setup,/siem-participant-add/);assert.match(setup,/Local scheduling and action tools/);assert.match(setup,/LOCAL PROTOTYPE/);
 const home=await(await fetch(base+'/')).text();assert.match(home,/href="\/my-ap">SIEM<\/a>/);assert.ok(!home.includes('href="/demos/'));
 assert.equal((await fetch(base+'/api/my-ap')).status,404);assert.equal((await fetch(base+'/my-ap',{method:'POST'})).status,405);
});
test('consolidation retains all source fixtures, model/contract, independent modules, brand and discovery bytes',()=>{
 const base='aebb0e8ee4b5e87e77f1eac8c0d2ee0abdd57c19';const files=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(f=>f.startsWith('engine/')||f.startsWith('data/')||f.startsWith('public/brand/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(f)||['public/siem-family-fixtures.js','public/siem-platform-fixtures.js','public/siem-platform-model.js','public/siem-model.js','public/siem-platform-boot.js','public/siem.js','public/state.js','public/app.js','public/release-demo-model.js','public/release-demo.js','docs/SIEM-UX-V2-CONTRACT.md','docs/PRODUCT-NORTH-STAR.md','AGENTS.md'].includes(f));
 for(const f of files.filter(f=>!uxFiles.has(f)))assert.deepEqual(readFileSync(f),preservedBytes(base,f,{maxBuffer:40e6}),f);
 const oldServer=execFileSync('git',['show',base+':server.mjs'],{encoding:'utf8'}),server=readFileSync('server.mjs','utf8').replace("   if(path==='/recruiting')return send(200,myPathway({recruiting:true}));\n",'');
 for(const [start,end] of [["  const headers =","   if(path==='/')"],["   if(path==='/build')","if(process.argv[1]"]])assert.equal(server.slice(server.indexOf(start),server.indexOf(end)),oldServer.slice(oldServer.indexOf(start),oldServer.indexOf(end)),'Security/data/sports routing remains exact');
});
