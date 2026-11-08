import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {entity,validateEntities,reconcile,eventState} from '../../engine/models.mjs';
import {EngineStore} from '../../engine/store.mjs';
import {PublicSourceClient,publicURL,USER_AGENT} from '../../engine/fetcher.mjs';
import {extractHTML} from '../../engine/adapters/html.mjs';
import {extractJSON} from '../../engine/adapters/json.mjs';
import {normalizeRow} from '../../engine/normalize.mjs';
import {importSource} from '../../engine/runner.mjs';
const source={id:'test-source',title:'Test official source',urls:['https://example.org/teams'],allowedHosts:['example.org'],adapter:'mhsl',sport:'swimming',state:'CO',programType:'summer-swimming',leagueName:'League',accessPolicy:{decision:'allowed'},minIntervalMs:1000,scope:'Reviewed team table'};
const manifest={reviewedAt:'2026-11-08',reviewer:'Independent census reviewer',evidenceURL:source.urls[0],scopeClosed:true,expectedRecordIds:['test-source:A','test-source:B'],expectedPageURLs:source.urls};
const pages=[{url:source.urls[0],status:'processed',role:'membership',extractedRows:2}];
const rows=[{sourceRecordId:'test-source:A',decision:'import'},{sourceRecordId:'test-source:B',decision:'import'}];
const org=entity({id:'o',kind:'organization',name:'Organization',sports:['swimming'],state:'CO',evidenceIds:['ev']});
const competition=entity({id:'c',kind:'competition',name:'Competition',sport:'swimming',evidenceIds:['ev']});
const season=entity({id:'s',kind:'season',name:'2026',sport:'swimming',competitionId:'c',startDate:'2026-01-01',endDate:'2026-12-31',evidenceIds:['ev']});
const league=entity({id:'l',kind:'league',name:'League',sport:'swimming',evidenceIds:['ev']});
const division=entity({id:'d',kind:'division',name:'A',sport:'swimming',leagueId:'l',seasonId:'s',competitionId:'c',evidenceIds:['ev']});
const team=entity({id:'t',kind:'team',name:'Team',sport:'swimming',organizationId:'o',leagueId:'l',divisionId:'d',seasonId:'s',competitionId:'c',evidenceIds:['ev']});
const good=[org,competition,season,league,division,team];
test('independent expected IDs detect removed memberships and cannot be substituted by current stored totals',()=>{
 assert.equal(reconcile({source,manifest,rows,pages}).status,'complete');const r=reconcile({source,manifest,rows:rows.slice(0,1),pages});assert.equal(r.status,'partial');assert.deepEqual(r.missing,['test-source:B']);assert.ok(r.errors.includes('MISSING_EXPECTED_ROWS'));
});
test('a directory-only page, unknown denominator, pagination or membership frontier cannot be complete',()=>{
 for(const extra of [{pages:[{...pages[0],role:'landing'}]},{manifest:null},{pages:[{...pages[0],paginationUnresolved:true}]},{frontier:[{url:'https://example.org/division-b',status:'pending'}]}])assert.notEqual(reconcile({source,manifest,rows,pages,...extra}).status,'complete');
});
test('counts balance duplicate/excluded/unresolved candidates and unresolved rows block completion',()=>{
 const x=[{sourceRecordId:'test-source:A',decision:'duplicate',reason:'Known alias'},{sourceRecordId:'test-source:B',decision:'exclude',reason:'Unattached swimmer'}];let r=reconcile({source,manifest,rows:x,pages});assert.equal(r.counts.duplicate,1);assert.equal(r.counts.excluded,1);assert.equal(r.status,'complete');x[1].reason=null;r=reconcile({source,manifest,rows:x,pages});assert.equal(r.counts.unresolved,1);assert.notEqual(r.status,'complete');
});
test('unexplained decreases block a source even if its changed list is self-consistent',()=>{
 assert.ok(reconcile({source,manifest,rows,pages,previousCount:3}).errors.includes('UNEXPLAINED_DECREASE'));
 assert.ok(!reconcile({source,manifest,rows,pages,previousCount:3,decreaseReason:'Published source correction, reviewed'}).errors.includes('UNEXPLAINED_DECREASE'));
});
test('duplicate clubs/aliases and team identities fail while distinct seasons/divisions remain separate',()=>{
 assert.equal(validateEntities(good).valid,true);const copy={...team,id:'copy'};assert.ok(validateEntities([...good,copy]).errors.some(e=>e.startsWith('DUPLICATE_IDENTITY')));
 const secondSeason={...season,id:'s2',name:'2027',startDate:'2027-01-01',endDate:'2027-12-31'};const distinct={...team,id:'other',seasonId:'s2',divisionId:null};assert.equal(validateEntities([...good,secondSeason,distinct]).valid,true);
 assert.ok(validateEntities([...good,{...org,id:'o2',name:'Other name',aliases:['Organization']}]).errors.some(e=>e.startsWith('DUPLICATE_ORGANIZATION')));
});
test('orphans, cross-sport relationships and incorrect season/competition associations fail',()=>{
 assert.ok(validateEntities(good.filter(e=>e.id!=='o')).errors.some(e=>e.startsWith('ORPHAN_organizationId')));
 assert.ok(validateEntities(good.filter(e=>e.id!=='l')).errors.some(e=>e.startsWith('ORPHAN_leagueId')));
 assert.ok(validateEntities(good.map(e=>e.id==='d'?{...e,sport:'basketball'}:e)).errors.some(e=>e.startsWith('CROSS_SPORT')));
 const other={...competition,id:'c2',name:'Other competition'};assert.ok(validateEntities([...good,other].map(e=>e.id==='t'?{...e,competitionId:'c2'}:e)).errors.some(e=>e.startsWith('WRONG_COMPETITION')));
});
test('summer and USA year-round swimming cannot be merged through parent classification',()=>{
 const records=good.map(e=>e.id==='o'?{...e,programType:'year-round-usa-swimming'}:e.id==='t'?{...e,programType:'summer-swimming'}:e);assert.ok(validateEntities(records).errors.some(e=>e.startsWith('MIXED_SWIM_CLASSIFICATION')));
});
test('stale or unconfirmed schedules are never current and event dates must fit the declared season',()=>{
 const e=entity({id:'game',kind:'event',name:'Meet',sport:'swimming',competitionId:'c',seasonId:'s',startDate:'2026-02-01',dateConfidence:'published',current:true,evidenceIds:['ev']});assert.equal(eventState(e,'2026-11-08'),'historical');assert.ok(validateEntities([...good,e],{asOf:'2026-11-08'}).errors.includes('STALE_EVENT:game'));
 assert.equal(eventState({...e,startDate:null}),'date-unconfirmed');assert.ok(validateEntities([...good,{...e,startDate:'2027-01-02',current:false}]).errors.includes('EVENT_OUTSIDE_SEASON:game'));
});
test('organizational adapters never retain source contacts or minor roster fields',()=>{
 const html='<table><tr><td>2026 MHSL DIVISION ALIGNMENT</td></tr><tr><td>A</td><td>Team Alpha</td><td>PRIVATE CONTACT alice@example.org</td><td>ALPHA</td></tr></table>';
 const r=extractHTML(html,source.urls[0],source);assert.equal(r.rows.length,1);assert.deepEqual(r.rows[0],{nativeId:'ALPHA',name:'Team Alpha',division:'A',season:'2026',kind:'team',url:null});assert.ok(!JSON.stringify(r).includes('alice@'));
 const json=extractJSON(JSON.stringify({clubs:[{code:'A',name:'Club',state:'CO',athletes:[{name:'Private minor'}]}],nextPage:2}),{apiDocumentationURL:'https://example.org/docs',itemsKey:'clubs',fields:{id:'code',name:'name',state:'state'}});assert.ok(!JSON.stringify(json).includes('Private minor'));assert.equal(json.paginationUnresolved,true);
});
test('meet candidates distinguish unattached, out-of-state and unverifiable club affiliations',()=>{
 const page={url:source.urls[0],fetchedAt:'2026-11-08T00:00:00Z',sha256:'hash'};
 assert.equal(normalizeRow({nativeId:'UN',name:'Unattached',kind:'organization'},source,page).row.decision,'exclude');
 assert.equal(normalizeRow({nativeId:'AZ',name:'Visiting Club',kind:'organization',state:'AZ'},source,page).row.decision,'exclude');
 const r=normalizeRow({nativeId:'X',name:'Unknown Club',kind:'organization',state:null,discoveryOnly:true},source,page).row;assert.equal(r.decision,'unresolved');assert.equal(r.entity.state,null);
});
test('request policy blocks private hosts, unregistered redirects, credentials and roster routes',()=>{
 for(const url of ['http://example.org','https://127.0.0.1/','https://user:secret@example.org/','https://example.org/roster','https://private.example.org/'])assert.throws(()=>publicURL(url,source.allowedHosts));
});
test('robots and rate-limit responses prevent content traversal instead of bypassing restrictions',async()=>{
 const calls=[],transport=async url=>{calls.push(url);return new Response(url.endsWith('robots.txt')?'User-agent: *\nDisallow: /teams':'SHOULD NOT FETCH');};
 const client=new PublicSourceClient({transport,wait:async()=>{}});await assert.rejects(client.get(source.urls[0],source),e=>e.code==='ROBOTS_DENIED');assert.equal(calls.length,1);
 let count=0;const rate=new PublicSourceClient({transport:async url=>url.endsWith('robots.txt')?new Response('User-agent: *\nAllow: /'):new Response('rate limited',{status:429,headers:{'retry-after':'3600'}}),wait:async()=>{}});await assert.rejects(rate.get(source.urls[0],source),e=>e.code==='RATE_LIMIT');await assert.rejects(rate.get(source.urls[0],source),e=>e.code==='RATE_WINDOW');
});
test('SQLite staging does not publish until explicit review, approvals are idempotent and conflicts roll back',()=>{
 const store=new EngineStore(':memory:');try{const src={...source,id:'s'},id=store.start(src),ev={id:'ev',sourceId:'s',url:'https://example.org/teams',fetchedAt:'2026-11-08',facts:{name:'Organization'}};
 const row={sourceRecordId:'s:o',decision:'import',entity:org};store.finish(id,{rows:[row],evidence:[ev],report:{status:'complete',errors:[],unexpected:[],counts:{candidate:1,imported:1}}});assert.equal(store.entities().length,0);assert.equal(store.report().runs[0].report.counts.imported,0);
 assert.throws(()=>store.approve(id,{}));store.approve(id,{reviewer:'Test reviewer',reason:'Verified official organization'});assert.equal(store.entities().length,1);assert.equal(store.approve(id,{reviewer:'Test reviewer',reason:'Replay'}).idempotent,true);
 const id2=store.start(src);store.finish(id2,{rows:[{...row,entity:{...org,name:'Overwritten'}}],evidence:[],report:{status:'complete',errors:[],unexpected:[],counts:{candidate:1,imported:1}}});assert.throws(()=>store.approve(id2,{reviewer:'Test',reason:'Attempt overwrite'}));assert.equal(store.entities()[0].name,'Organization');
 }finally{store.close();}
});
test('re-imports preserve entity IDs, cannot approve landing-only missing expectations, and do not delete reviewed data',()=>{
 const store=new EngineStore(':memory:');try{let id=store.start(source);store.finish(id,{rows:[{sourceRecordId:'x',decision:'import',entity:org}],evidence:[],report:{status:'partial',errors:['NO_INDEPENDENT_EXPECTATION'],unexpected:['x'],counts:{candidate:1,imported:1}}});assert.throws(()=>store.approve(id,{reviewer:'Test',reason:'Only landing page',allowPartial:true}));assert.equal(store.entities().length,0);}finally{store.close();}
});
test('concurrent source runs and migration tampering are rejected; durable databases survive reopen',()=>{
 const dir=mkdtempSync(join(tmpdir(),'arena-engine-test-')),path=join(dir,'engine.sqlite');let store=new EngineStore(path);try{const id=store.start(source);assert.throws(()=>store.start(source));store.finish(id,{rows:[],evidence:[],report:{status:'blocked',errors:['Blocked source'],counts:{candidate:0,imported:0}}});store.close();store=new EngineStore(path);assert.equal(store.report().runs.length,1);store.db.prepare('UPDATE migrations SET sha256=? WHERE version=1').run('tampered');store.close();assert.throws(()=>new EngineStore(path),/Migration checksum/);}finally{try{store.close();}catch{}rmSync(dir,{recursive:true,force:true});}
});
test('failed imports retain a blocked history entry without touching verified entities',async()=>{
 const store=new EngineStore(':memory:');try{const client={get:async()=>{throw Object.assign(Error('No access'),{code:'HTTP_403'});}};const run=await importSource(store,source,{client,manifest});assert.equal(run.report.status,'blocked');assert.equal(store.entities().length,0);assert.equal(store.report().runs.length,1);}finally{store.close();}
});

test('multi-sport college organization stays canonical without combining distinct gender teams',()=>{
 const s={...source,id:'college',adapter:'college',organizationName:'Colorado College Example',sports:['basketball','swimming'],programType:'unknown',category:'school',levels:['collegiate'],leagueName:null},p={url:source.urls[0],fetchedAt:'2026-11-08',sha256:'hash'};
 const a=normalizeRow({name:'Example Men Basketball',kind:'team',nativeId:'b-men',sport:'basketball',genders:['men']},s,p).row;
 const b=normalizeRow({name:'Example Women Swimming',kind:'team',nativeId:'s-women',sport:'swimming',genders:['women'],programType:'collegiate-swimming'},s,p).row;
 assert.equal(a.entity.organizationId,b.entity.organizationId);assert.deepEqual({...a.supportingEntities[0],evidenceIds:[]},{...b.supportingEntities[0],evidenceIds:[]});assert.equal(a.supportingEntities[0].sport,null);assert.equal(validateEntities([...a.supportingEntities,a.entity,b.entity]).valid,true);
});

test('runner keeps out-of-scope related pages unresolved instead of fetching them',async()=>{
 const s=new EngineStore(':memory:'),calls=[];
 const client={async get(url){calls.push(url);return {url,body:Buffer.from('<main><a href="https://other.example/teams">Other teams</a></main>'),contentType:'text/html',sha256:'abc',fetchedAt:'2026-11-08'};}};
 const r=await importSource(s,{...source,adapter:'discovery'},{client,manifest,maxPages:10});assert.deepEqual(calls,source.urls);assert.ok(r.report.errors.includes('UNRESOLVED_FRONTIER'));assert.notEqual(r.report.status,'complete');s.close();
});

test('aggregate PDF team summaries retain tied rankings and reject individual result layouts',async()=>{
 const {extractClubText}=await import('../../engine/adapters/pdf.mjs');const s={documentScope:'team-scores-only',combinedOnly:true,rowPattern:'^\\s*\\d+\\s{2,}(.+?)\\s{2,}(.+?)\\s{2,}[\\d,. ]+\\s*$'};
 const r=extractClubText('Combined Team Scores - Through Event 44\n  1  Club One  Club One  125.50\n  1  Club Two  Club Two  125.50\nWomen - Team Rankings\n  1  Club One  Club One  125.50',s);assert.equal(r.rows.length,2);assert.equal(r.rows[0].state,null);assert.notEqual(r.rows[0].nativeId,r.rows[1].nativeId);assert.equal(r.rows[0].discoveryOnly,true);assert.throws(()=>extractClubText('Event 1 Girls 100 Free\n Name Age Seed Time',s),/Athlete results/);
});
test('association extraction traverses every member and keeps adjacent team names separate',()=>{
 const s={...source,adapter:'association-list',listContains:'Club One'};const r=extractHTML('<ul><li>Club One (ONE)</li><li>5 Parks</li><li>Stingrays (STING)</li><li>New Member (NEW)</li></ul>',source.urls[0],s);assert.deepEqual(r.rows.map(r=>r.name),['Club One','5 Parks','Stingrays','New Member']);
 const report=reconcile({source:s,manifest:{...manifest,expectedRecordIds:r.rows.slice(0,3).map(r=>source.id+':'+r.nativeId)},rows:r.rows.map(r=>({sourceRecordId:source.id+':'+r.nativeId,decision:'import'})),pages});assert.equal(report.status,'needs-review');assert.ok(report.errors.includes('UNREVIEWED_ROWS'));
});
test('retirement retains revision history, protects the baseline and rejects active orphaning',()=>{
 const s=new EngineStore(':memory:');const run=s.start(source);s.finish(run,{rows:[],evidence:[],report:{status:'partial',counts:{candidate:0,imported:0,duplicate:0,excluded:0,unresolved:0},errors:[]}});
 const o={...org,legacy:false,reviewStatus:'verified'},t={...team,reviewStatus:'verified',leagueId:null,divisionId:null,competitionId:null,seasonId:null};for(const e of [o,t])s.db.prepare('INSERT INTO entities(id,kind,sport,review_status,payload_json) VALUES(?,?,?,?,?)').run(e.id,e.kind,e.sport||null,e.reviewStatus,JSON.stringify(e));
 assert.throws(()=>s.retire('o',{reviewer:'Reviewer',reason:'Correction',runId:run}),/dependent/);s.retire('t',{reviewer:'Reviewer',reason:'Incorrect published identity',runId:run});s.retire('o',{reviewer:'Reviewer',reason:'Corrected source list',runId:run});assert.equal(s.entities().length,2);assert.equal(s.report().revisions.length,2);assert.ok(s.entities().every(e=>e.reviewStatus==='retired'));s.close();
});
test('persistent host reservations honor newly learned longer crawl delays and cooldowns',()=>{
 const s=new EngineStore(':memory:');assert.equal(s.reserveRequest('https://example.org',1000),0);const wait=s.reserveRequest('https://example.org',30000);assert.ok(wait>25000&&wait<=30000,'a newly learned 30-second crawl delay applies after robots, not the old 1-second interval');s.deferRequest('https://example.org',Date.now()+7200000);assert.throws(()=>s.reserveRequest('https://example.org',1000),/not due/);s.close();
});
