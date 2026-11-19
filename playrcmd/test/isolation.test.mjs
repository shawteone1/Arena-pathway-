import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createPlayRcmdServer,sharedAssets} from '../server.mjs';

test('standalone routes, fictional catalog, asset closure and integration boundaries',async t=>{
 const server=createPlayRcmdServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/','/roles','/demo?scenario=family','/demo?scenario=college','/demo?scenario=coach','/setup','/integrations']){const r=await fetch(base+path);assert.equal(r.status,200);const html=await r.text();assert.match(html,/<title>.*PlayRcmd/);assert.doesNotMatch(html,/src="\/assets\/(app|lockedin-demo)\.js/);assert.doesNotMatch(html,/href="\/(my-ap|sports|recruiting|my-pathway)/);assert.match(r.headers.get('content-security-policy'),/connect-src 'self'/);}
 const html=await(await fetch(base)).text();for(const url of ['https://soccercenter.org','https://arenapathway.com','https://la02uk.com'])assert.ok(html.includes('href="'+url+'"'));
 assert.deepEqual(await(await fetch(base+'/api/catalog')).json(),{opportunities:[],sources:[],organizations:[]});
 for(const path of ['/my-ap','/sports/soccer','/locked-in-demo','/assets/app.js','/assets/lockedin-demo.js','/assets/../server.mjs'])assert.equal((await fetch(base+path)).status,404);
 assert.equal((await fetch(base+'/demo?scenario=unknown',{redirect:'manual'})).headers.get('location'),'/demo?scenario=family');
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 for(const name of sharedAssets){assert.equal((await fetch(base+'/assets/'+name)).status,200,name);if(!name.endsWith('.js'))continue;const code=await readFile(new URL('../../public/'+name,import.meta.url),'utf8');for(const match of code.matchAll(/from ['"]\.\/([^'"]+)['"]/g))assert.ok(sharedAssets.has(match[1]),name+' missing '+match[1]);}
});
