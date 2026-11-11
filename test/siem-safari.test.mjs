import {preservedBytes,uxFiles} from './preservation-helper.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {createServer} from '../server.mjs';
test('Safari startup fix preserves all family fixtures, models, contracts and discovery bytes',()=>{
 const base='2493cf140970630a6e4bad106025d85dee0392d8';
 const files=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(f=>f.startsWith('engine/')||f.startsWith('data/')||f.startsWith('public/brand/')||['public/siem-family-fixtures.js','public/siem-platform-fixtures.js','public/siem-platform-model.js','public/siem-model.js','docs/SIEM-UX-V2-CONTRACT.md','docs/PRODUCT-NORTH-STAR.md','AGENTS.md'].includes(f));
 for(const f of files.filter(f=>!uxFiles.has(f)))assert.deepEqual(readFileSync(f),preservedBytes(base,f,{maxBuffer:40e6}),f);
});
test('startup bootstrap and loading fallback are served with existing CSP and JavaScript MIME',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 const page=await fetch(base+'/siem/platform?scenario=family&mode=everyday');assert.equal(page.status,200);assert.ok(page.headers.get('content-security-policy').includes("script-src 'self'"));const html=await page.text();assert.match(html,/src="\/assets\/siem-platform-boot.js"/);assert.match(html,/Loading your demonstration dashboard/);
 const asset=await fetch(base+'/assets/siem-platform-boot.js');assert.equal(asset.status,200);assert.match(asset.headers.get('content-type'),/javascript/);assert.equal((await fetch(base+'/assets/not-allowlisted.js')).status,404);
});
