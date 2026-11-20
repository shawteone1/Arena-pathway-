import test from 'node:test';import assert from 'node:assert/strict';
import {readFile,writeFile,unlink} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {createPlayRcmdServer,brandAssets} from '../server.mjs';import {activeBrand,brandImage} from '../brand.mjs';import * as after from '../views.mjs';
test('master and generated brand assets match the approved-image manifest',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../brand/asset-manifest.json',import.meta.url),'utf8'));
 const master=await readFile(new URL('../brand/masters/'+manifest.approved_source_name,import.meta.url));assert.equal(createHash('sha256').update(master).digest('hex'),'5ae1a3292deb5b6a9a81a07a472360a91f2194649bd31c602b089c8f5c5195d3');
 assert.equal(activeBrand.sport,'soccer');for(const [name,record]of Object.entries(manifest.assets)){const bytes=await readFile(new URL('../public/brand/soccer/'+name,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,name);}
});
test('approved full logo, emblem and favicon load from explicit self-hosted routes under the unchanged CSP',async t=>{
 const server=createPlayRcmdServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/','/roles','/demo?scenario=family','/demo?scenario=college','/demo?scenario=coach','/setup','/integrations']){const r=await fetch(base+path),html=await r.text();assert.equal(r.status,200);assert.ok(html.includes(brandImage),path);assert.ok(html.includes('/brand/soccer/icon-32.png'));assert.match(r.headers.get('content-security-policy'),/img-src 'self' blob:/);}
 for(const [path] of brandAssets){const r=await fetch(base+path);assert.equal(r.status,200,path);const expected=path.endsWith('.webp')?'image/webp':path.endsWith('.png')?'image/png':'image/x-icon';assert.equal(r.headers.get('content-type'),expected,path);assert.ok((await r.arrayBuffer()).byteLength>0);}
 assert.equal((await fetch(base+'/playrcmd/brand/masters/682F7A0C-FD73-4B7B-8519-BF5BC67AC602.jpeg')).status,404);
 assert.equal((await fetch(base+'/playrcmd/brand/football/icon-32.png')).status,404,'no unapproved sport variant');
});
test('all existing demo IDs and controller scripts remain unchanged from the verified guided candidate',async()=>{
 const temp=new URL('../.logo-baseline-views.mjs',import.meta.url);await writeFile(temp,execFileSync('git',['show','e92374f2342efb1a2edc20355f17b8e1386651ca:playrcmd/views.mjs']));
 try{const before=await import(temp.href);const ids=s=>[...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]).sort();const scripts=s=>[...s.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);for(const role of ['family','college','coach']){assert.deepEqual(ids(after.demoPage(false,role)),ids(before.demoPage(false,role)));assert.deepEqual(scripts(after.demoPage(false,role)),scripts(before.demoPage(false,role)));}assert.deepEqual(ids(after.demoPage(true)),ids(before.demoPage(true)));}
 finally{await unlink(temp)}
});
