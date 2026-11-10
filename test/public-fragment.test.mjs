import test from'node:test';import assert from'node:assert/strict';import{extractAcquisition}from'../engine/acquisition/extract.mjs';
const url='https://club.example/youth',source={adapter:'profile-evidence',sport:'lacrosse',type:'other'};
test('public provider fragment parses HTML and navigation without treating config as geography',()=>{
 const body=Buffer.from(JSON.stringify({uuid:'a'.repeat(32),isHomePage:false,page_title:'Youth',headsection:'<title>Example Lacrosse Club</title>',content:'<div dmwrapped="true"><nav><a href="/about">Our club</a><a href="/">Home</a></nav><p>Youth lacrosse programs.</p></div>',css:'Youth programs in Colorado Springs',ssr_script:'throw Error("never run")'}));
 const parsed=extractAcquisition({url,body,sha256:'x',fetchedAt:new Date().toISOString()},source);assert.equal(parsed.records[0].name,'Example Lacrosse Club');assert.equal(parsed.records[0].classification.state,null);assert.ok(parsed.links.some(l=>l.url==='https://club.example/about'));assert.ok(parsed.links.some(l=>l.url==='https://club.example/'));
});
test('arbitrary JSON config remains unsupported instead of silently becoming verified HTML',()=>{const p=extractAcquisition({url,body:Buffer.from(JSON.stringify({content:'Youth lacrosse in Colorado Springs',title:'A club'}))},source);assert.equal(p.records.length,0);assert.equal(p.partial,true);});
