import test from 'node:test';
import assert from 'node:assert/strict';
import{extractAcquisition}from'../engine/acquisition/extract.mjs';
const parse=html=>extractAcquisition({body:Buffer.from(html),url:'https://public.example/club'}, {adapter:'profile-evidence',sport:'volleyball',nameSelector:'h1',type:'club'});
test('linked profile identity uses a configured heading, not the directory publisher or program title',()=>{
 const p=parse('<title>Directory Publisher | Clubs | Example</title><main><h1>Example Club</h1><p>Youth volleyball in Thornton, CO 80241.</p></main>');
 assert.equal(p.records[0].name,'Example Club');assert.equal(p.records[0].classification.state,'CO');assert.equal(p.records[0].classification.youthEligible,true);
});
test('embedded structured scripts and incidental team names cannot qualify geography or youth',()=>{
 const p=parse('<title>Volleyball</title><script type="application/ld+json">{"description":"Colorado youth volleyball"}</script><main><h1>Example</h1><p>Volleyball team: 17 Colorado Rachel.</p></main>');
 assert.equal(p.records[0].classification.state,null);assert.equal(p.records[0].classification.youthEligible,null);assert.equal(p.records[0].classification.qualificationEvidence.state,null);
});
test('qualification evidence points to the actual service-area statement rather than an incidental name',()=>{
 const p=parse('<title>Volleyball</title><main><h1>Example</h1><p>Colorado Rachel team.</p><p>Our youth volleyball program serves families in Colorado Springs.</p></main>');
 assert.equal(p.records[0].classification.state,'CO');assert.match(p.records[0].classification.qualificationEvidence.state,/Colorado Springs/);
});
test('missing configured identity heading is a layout failure and never silently emits a publisher identity',()=>{
 const p=parse('<title>Publisher | Clubs</title><main>Volleyball youth in Colorado Springs</main>');assert.equal(p.records.length,0);assert.ok(p.issues.length);
});
test('HTML-labeled JSON fragment wrappers remain unsupported instead of supplying qualification facts',()=>{
 const p=parse(JSON.stringify({title:'Volleyball | Denver, CO',configuration:'Youth program'}));assert.equal(p.records.length,0);assert.equal(p.partial,true);assert.deepEqual(p.issues,['PROFILE_JSON_WRAPPER_REQUIRES_ADAPTER']);
});
import{mkdtempSync,rmSync}from'node:fs';import{tmpdir}from'node:os';import{join}from'node:path';import{AcquisitionLedger}from'../engine/acquisition/ledger.mjs';import{acquire,sourceDefinition}from'../engine/acquisition/run.mjs';import{createHash}from'node:crypto';
test('configured member traversal captures club profiles while excluding unrelated and roster links',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'arena-analysis-')),ledger=new AcquisitionLedger(join(dir,'test.sqlite')),base='https://directory.example/';
 const pages={
  [base]:'<title>Volleyball clubs</title><main>Club<table><tbody><tr><td><a href="/clubs/1">Example Club</a></td></tr></tbody></table><a href="/clubs/1">Example Club</a><a href="/rosters/1">Players</a><a href="/advertiser">Other club</a></main>',
  [base+'clubs/1']:'<title>Publisher | Clubs</title><main><h1>Example Club</h1><p>Youth volleyball in Thornton, CO 80241.</p></main>'
 };const seen=[];const client={async get(url){seen.push(url);assert.ok(pages[url],'Only prescribed pages should be retrieved');const body=Buffer.from(pages[url]);return{url,body,status:200,sha256:createHash('sha256').update(body).digest('hex'),fetchedAt:new Date().toISOString()};}};
 try{const report=await acquire(ledger,{id:'configured-members',sport:'volleyball',sources:[sourceDefinition(base,'volleyball',{adapter:'scoped-table',rowSelector:'tbody tr',expectedHeader:'Club'})],followLinks:true,maxDepth:1,followURLPattern:'/clubs/\\d+$',discoveredSourceRules:[{urlPattern:'/clubs/\\d+$',config:{nameSelector:'h1',type:'club'}}]},{client,mode:'controlled'});assert.equal(report.retrieved,2);assert.deepEqual(seen,[base,base+'clubs/1']);const profile=ledger.snapshot().records.find(r=>r.native_id==='profile');assert.equal(profile.record.name,'Example Club');assert.equal(profile.record.classification.state,'CO');assert.equal(profile.approved_version,null);}finally{ledger.close();rmSync(dir,{recursive:true,force:true});}
});
