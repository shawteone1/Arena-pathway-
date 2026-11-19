import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlayRcmdServer} from '../server.mjs';
test('enterprise landing assets work under the existing restrictive CSP', async t=>{
 const server=createPlayRcmdServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());
 const base='http://127.0.0.1:'+server.address().port;
 const r=await fetch(base),html=await r.text();assert.equal(r.status,200);
 assert.doesNotMatch(r.headers.get('content-security-policy'),/unsafe-inline|fonts.googleapis/);
 assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>/);
 for(const href of ['/roles','/demo?scenario=family','/demo?scenario=college','/demo?scenario=coach','/integrations','https://la02uk.com'])assert.ok(html.includes('href="'+href+'"'),href);
 for(const [path,type] of [['polish.css','text/css'],['landing-polish.js','text/javascript'],['enterprise-stadium.jpg','image/jpeg'],['dm-sans-regular.ttf','font/ttf'],['dm-sans-bold.ttf','font/ttf']]){
  const asset=await fetch(base+'/playrcmd/'+path);assert.equal(asset.status,200,path);assert.equal(asset.headers.get('content-type'),type,path);assert.ok((await asset.arrayBuffer()).byteLength>0);
 }
 const css=await(await fetch(base+'/playrcmd/polish.css')).text();assert.doesNotMatch(css,/@import|https?:\/\//);
 assert.equal((await fetch(base+'/playrcmd/landing-polish.html')).status,404,'private source HTML is not an extra served route');
 assert.equal((await(await fetch(base+'/health')).json()).mode,'fictional-demo');
});
