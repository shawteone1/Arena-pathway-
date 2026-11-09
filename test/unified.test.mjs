import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,mkdtempSync,rmSync}from'node:fs';import{tmpdir}from'node:os';import{join}from'node:path';import{execFileSync}from'node:child_process';
import {program,programID,validateParticipation,effectiveRegistration,canonicalID,classificationReport}from'../engine/participation.mjs';
import{entity}from'../engine/models.mjs';import{EngineStore}from'../engine/store.mjs';import{publishParticipation,readParticipation}from'../engine/classification-store.mjs';import{restoreSnapshot}from'../engine/transfer.mjs';import{importSource}from'../engine/runner.mjs';import{extractHTML}from'../engine/adapters/html.mjs';import{csiRows}from'../engine/adapters/csi.mjs';
import{programs,directory,teamsFor,opportunities,participation,reviewReport,clientCatalog}from'../src/unified-directory.mjs';import{catalog,engineSnapshot}from'../src/engine-directory.mjs';import{createServer}from'../server.mjs';import{cleanProfile,modulesFor,setModules,toggleSaved}from'../public/state.js';
const ev={id:'ev',sourceId:'fixture',url:'https://example.org/programs',fetchedAt:'2026-11-08',facts:{name:'Club'}};
const org=entity({id:'org',name:'Youth Club',kind:'organization',sport:'basketball',state:'CO',reviewStatus:'verified',evidenceIds:['ev'],category:'club'});
const team=entity({id:'team',name:'Club 6th Grade',kind:'team',sport:'basketball',organizationId:'org',evidenceIds:['ev'],reviewStatus:'verified'});
const p=program({id:'program',name:'Youth basketball',sport:'basketball',organizationId:'org',designation:'youth',programType:'basketball',reviewStatus:'verified',reviewer:'Reviewer',reviewedAt:'2026-11-08',reason:'Public program evidence',evidenceIds:['ev']});
const assignment={teamId:'team',programId:'program',reviewStatus:'verified',reason:'Published parent',evidenceIds:['ev']};
const graph=()=>({programs:[structuredClone(p)],teamAssignments:[structuredClone(assignment)],exceptions:[],canonicalLinks:[]});
const validate=g=>validateParticipation(g,{entities:[org,team],evidence:[ev]});
test('all sport primary directories enforce youth / school / college / adult separation',()=>{
 for(const sport of ['lacrosse','volleyball','basketball','swimming'])for(const designation of ['youth','high-school','college','adult','professional']){const results=directory(sport,designation);for(const result of results)assert.ok(result.programs.every(p=>p.designation===designation));}
 assert.ok(directory('lacrosse','adult').some(r=>r.programs.some(p=>p.programKind==='league')));assert.ok(!directory('lacrosse','youth').some(r=>/Colorado Lacrosse League/.test(r.name)));
 assert.ok(directory('swimming','adult').some(r=>r.programs.some(p=>p.swimType==='masters')));
});
test('club-first results retain one parent while individual team search finds the child',()=>{
 const all=directory('volleyball','youth');assert.equal(all.filter(r=>r.id==='denver-juniors').length,1);assert.equal(new Set(all.map(r=>r.id)).size,all.length);assert.ok(!all.some(r=>r.id==='dj-11-kiki'));
 const hits=directory('volleyball','youth',new URLSearchParams('q=Kiki'));assert.equal(hits.length,1);assert.equal(hits[0].id,'denver-juniors');assert.ok(hits[0].matchedTeams.some(t=>t.name==='Denver Juniors 11 Kiki'));
 assert.equal(teamsFor('denver-juniors','volleyball').length,18);assert.ok(teamsFor('denver-juniors','volleyball').every(t=>t.organizationId==='denver-juniors'));
});
test('CSI explicit Year Round, Seasonal and Collegiate codes reconcile independently and metadata is not a club',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../data/engine/expectations/swim-csi-embedded.json',import.meta.url)));assert.equal(manifest.expectedRecordIds.length,69);assert.deepEqual(manifest.countsByType,{'Year Round':54,Seasonal:13,'Collegiate Only':2});
 const latest=engineSnapshot.runs.filter(r=>r.source_id==='swim-csi-embedded'&&r.approved_at).at(-1);assert.equal(latest.report.captured,69);assert.equal(latest.report.expected,69);assert.notEqual(latest.status,'complete');assert.ok(!engineSnapshot.entities.some(e=>/Safe Sport Status verified/.test(e.name)));
 const aces=programs.find(p=>p.membershipType==='Year Round'&&p.clubCode==='ACES'),aqua=programs.find(p=>p.clubCode==='AQUA');assert.equal(aces.swimType,'year-round-competitive');assert.equal(aqua.swimType,'year-round-competitive');
 assert.equal(programs.filter(p=>p.clubCode&&p.membershipType==='Seasonal').length,13);assert.ok(programs.filter(p=>p.clubCode&&p.membershipType==='Seasonal').every(p=>p.swimType==='seasonal-competitive'));
});
test('static published Apps Script clubs are parsed without running scripts or importing footer/roster fields',()=>{
 const html='<h2>Seasonal clubs</h2><table><tr><th>Team</th><th>Code</th><th>Type</th></tr><tr><td>Sample Club</td><td>SMP</td><td>Seasonal</td></tr><tr><td>Safe Sport Status</td><td>—</td><td>Seasonal</td></tr></table>',config=JSON.stringify({userHtml:html}),outer=JSON.stringify(config).replaceAll('\\"','\\x22');
 const rows=csiRows('<script>goog.script.init('+outer+'); throw new Error("never execute");</script>');assert.equal(rows.rows.length,1);assert.equal(rows.rows[0].programFacts.swimType,'seasonal-competitive');assert.equal(rows.ignoredMetadata,1);
});
test('community programs use actual providers; a facility alone does not create a program',()=>{
 const mountain=directory('lacrosse','community').find(r=>r.name==='Mountain Recreation');assert.ok(mountain);assert.ok(mountain.programs.every(p=>p.communityBased));
 const ymca=directory('basketball','community').filter(r=>r.name==='YMCA of Northern Colorado');assert.equal(ymca.length,1);
 const facilities=directory('swimming','community',new URLSearchParams('kind=location'));assert.equal(facilities.length,2);assert.ok(facilities.every(r=>r.facilityOnly&&r.programs.length===0));
 assert.ok(reviewReport.exceptions.some(e=>e.code==='FACILITY_PROGRAM_RELATION_UNVERIFIED'));
});
test('Gold Crown is a league organizer, not a club or owner of every feeder team',()=>{
 const roots=directory('basketball','youth');assert.ok(!roots.some(r=>r.name==='Gold Crown Foundation'));
 const leagues=directory('basketball','youth',new URLSearchParams('kind=league'));const gold=leagues.find(r=>r.name==='Gold Crown Foundation');assert.ok(gold);assert.equal(gold.programs[0].registration.method,'team');assert.equal(gold.programs[0].registration.status,'unknown');assert.equal(teamsFor(gold.id,'basketball').length,0);assert.ok(gold.programs[0].leagueIds.length);
 const source=engineSnapshot.runs.filter(r=>r.source_id==='basket-goldcrown-feeders'&&r.approved_at).at(-1);assert.equal(source.report.captured,53);assert.equal(source.report.expected,53);assert.notEqual(source.status,'complete');
});
test('unknown ownership and classification are queued, not silently hidden or made into youth clubs',()=>{
 assert.ok(reviewReport.exceptions.some(e=>e.entityId==='3d-colorado'&&e.code==='YOUTH_CLASSIFICATION_NOT_VERIFIED'));
 assert.ok(!directory('lacrosse','youth').some(r=>r.id==='3d-colorado'));assert.ok(reviewReport.exceptions.some(e=>e.code==='PARTICIPANT_PARENT_UNVERIFIED'));
 const allPublicTeams=new Set(participation.teamAssignments.map(a=>a.teamId));for(const e of reviewReport.exceptions.filter(e=>e.code==='PARTICIPANT_PARENT_UNVERIFIED'))assert.ok(!allPublicTeams.has(e.entityId));
 assert.equal(reviewReport.originalRecordsRetained,engineSnapshot.entities.length);assert.equal(reviewReport.statewideComplete,false);
});
test('participation validator rejects missing designations, orphan programs and cross-sport formats',()=>{
 assert.equal(validate(graph()).valid,true);const missing=graph();missing.programs[0].designation=null;assert.ok(validate(missing).errors.some(e=>e.startsWith('UNREVIEWED_CLASSIFICATION')));
 const orphan=graph();orphan.programs[0].organizationId='missing';assert.ok(validate(orphan).errors.some(e=>e.startsWith('PROGRAM_PARENT')));
 const cross=graph();cross.programs[0].programType='masters-swimming';assert.ok(validate(cross).errors.some(e=>e.startsWith('PROGRAM_FORMAT_CROSS_SPORT')));
});
test('parent ownership correction cannot be bypassed with a boolean flag',()=>{
 const g=graph();g.programs[0].organizationId='other';g.teamAssignments[0].parentCorrection=true;const other={...org,id:'other',name:'Other Club'};assert.ok(validateParticipation(g,{entities:[org,other,team],evidence:[ev]}).errors.some(e=>e.startsWith('WRONG_TEAM_PARENT')));
});
test('seasonal USA membership cannot be relabeled summer recreational or Masters youth',()=>{
 const swim={...org,sport:'swimming',sports:['swimming']},g=graph();g.programs[0]={...p,sport:'swimming',programType:'seasonal-usa-swimming',swimType:'summer-recreational'};g.teamAssignments=[];
 assert.ok(validateParticipation(g,{entities:[swim],evidence:[ev]}).errors.some(e=>e.startsWith('MIXED_SWIM_MEMBERSHIP')));g.programs[0]={...g.programs[0],programType:'masters-swimming',swimType:'masters'};assert.ok(validateParticipation(g,{entities:[swim],evidence:[ev]}).errors.some(e=>e.startsWith('SWIM_DESIGNATION')));
});
test('current registration requires dated source evidence rather than a URL or team participation',()=>{
 assert.equal(effectiveRegistration({status:'open',url:'https://example.org/register'}).status,'unknown');
 const registration={status:'open',opens:'2026-11-01',closes:'2026-11-30',verifiedAt:'2026-11-08',evidenceIds:['ev']};assert.equal(effectiveRegistration(registration,'2026-11-08').status,'open');assert.equal(effectiveRegistration(registration,'2026-12-01').status,'closed');assert.equal(effectiveRegistration(registration,'2026-11-09').status,'unknown');
 const psb=programs.find(p=>p.aauAffiliation==='not-affiliated');assert.ok(psb);assert.equal(psb.registration.status,'unknown');assert.ok(psb.registration.url.includes('leagueapps.com'));
});
test('age and grade fields keep mixed published units instead of turning 17U into grade 17',()=>{
 const mixed=programs.find(p=>p.ageGradeText==='4th-17U');assert.ok(mixed);assert.equal(mixed.grades.min,4);assert.equal(mixed.grades.max,null);assert.equal(mixed.ages.max,17);assert.equal(mixed.ages.min,null);
 const invalid=graph();invalid.programs[0].grades={min:8,max:4};assert.ok(validate(invalid).errors.some(e=>e.startsWith('INVALID_GRADES')));
});
test('historical or yearless schedules cannot enter current public fixtures',()=>{
 for(const sport of ['lacrosse','volleyball','basketball','swimming'])for(const d of ['youth','high-school','college','adult'])for(const r of opportunities(sport,d,'game'))if(r.scheduleState==='published-upcoming')assert.ok(r.seasonId&&r.dateConfidence==='published');
 assert.ok(engineSnapshot.candidates.some(c=>c.payload.entity?.kind==='event'&&c.payload.decision==='unresolved'));
});
test('source references for configured registration facts must still exist on the published page',()=>{
 const source={adapter:'profile',profiles:[{name:'Provider',requiredText:['Youth'],programFacts:{registration:{url:'https://example.org/join'}}}]};
 const missing=extractHTML('<p>Youth program</p>','https://example.org/',source);assert.equal(missing.rows.length,0);assert.ok(missing.issues[0].startsWith('REGISTRATION_REFERENCE_MISSING'));
 const good=extractHTML('<p>Youth program</p><a href="/join">Join</a>','https://example.org/',source);assert.equal(good.rows.length,1);assert.equal(good.rows[0].originalRow.registrationURL,'/join');
});
test('accessible membership pagination is processed and incomplete budgets remain partial',async()=>{
 const source={id:'pages',sport:'basketball',state:'CO',adapter:'named-elements',selector:'.club',entityKind:'organization',urls:['https://example.org/clubs'],allowedHosts:['example.org'],followURLPattern:'^https://example.org/clubs$',followPagination:true};
 const manifest={expectedRecordIds:['pages:Club A','pages:Club B'],expectedPageURLs:[source.urls[0],source.urls[0]+'?page=2'],reviewedAt:'2026-11-08',reviewer:'Independent reviewer',evidenceURL:source.urls[0],scopeClosed:true};
 const client={async get(url){return {url,contentType:'text/html',fetchedAt:'2026-11-08',sha256:url,body:Buffer.from(url.includes('?')?'<p class="club">Club B</p>':'<p class="club">Club A</p><a rel="next" href="?page=2">Next</a>')};}};
 const a=new EngineStore(':memory:'),b=new EngineStore(':memory:');try{const complete=await importSource(a,source,{client,manifest,maxPages:2});assert.equal(complete.report.captured,2);assert.equal(complete.report.status,'complete');assert.equal(complete.report.pages[0].paginationUnresolved,false);const partial=await importSource(b,source,{client,manifest,maxPages:1});assert.notEqual(partial.report.status,'complete');assert.ok(partial.report.errors.includes('UNRESOLVED_PAGINATION'));assert.equal(partial.report.captured,1);}finally{a.close();b.close();}
});
test('classification snapshots are durable, reviewed and refuse silent program deletion',()=>{
 const dir=mkdtempSync(join(tmpdir(),'arena-classification-')),path=join(dir,'engine.sqlite');let s=new EngineStore(path);try{
  s.register({id:'fixture'});s.db.prepare('INSERT INTO evidence VALUES(?,?,?,?,?)').run(ev.id,ev.sourceId,ev.url,ev.fetchedAt,JSON.stringify(ev));for(const e of [org,team])s.db.prepare('INSERT INTO entities(id,kind,sport,review_status,payload_json) VALUES(?,?,?,?,?)').run(e.id,e.kind,e.sport,'verified',JSON.stringify(e));
  assert.throws(()=>publishParticipation(s,graph()),/reviewer/);publishParticipation(s,graph(),{reviewer:'QA',reason:'Independent source review'});assert.equal(readParticipation(s).programs.length,1);assert.throws(()=>publishParticipation(s,{programs:[],teamAssignments:[],exceptions:[{id:'o',entityId:'org'},{id:'t',entityId:'team'}],canonicalLinks:[]},{reviewer:'QA',reason:'Attempt deletion'}),/lose a prior program/);s.close();s=new EngineStore(path);assert.equal(readParticipation(s).teamAssignments.length,1);
 }finally{s.close();rmSync(dir,{recursive:true,force:true});}
});
test('every original reviewed normalized entity and evidence payload remains present and identical',()=>{
 const original=JSON.parse(execFileSync('git',['show','origin/codex/colorado-data-engine-v1-review:data/engine/approved.json'],{encoding:'utf8',maxBuffer:20*1024*1024}));
 for(const collection of ['entities','evidence'])for(const row of original[collection])assert.deepEqual(engineSnapshot[collection].find(e=>e.id===row.id),row,row.id);
 assert.equal(validateParticipation(participation,{entities:engineSnapshot.entities,evidence:engineSnapshot.evidence}).valid,true);
});
test('seven independent workspace modules keep saved records and optional recruiting/media',()=>{
 const p=cleanProfile({sport:'lacrosse',modules:['teams','saved'],goal:'recruiting'});toggleSaved(p,'denver-elite');assert.deepEqual(p.modules,['teams','saved']);assert.ok(!p.modules.includes('recruiting'));assert.equal(p.mediaEnabled,false);setModules(p,[]);assert.deepEqual(p.saved,['denver-elite']);
 const migrated=cleanProfile({sport:'lacrosse',moduleVersion:1,modules:['teams','camps']});assert.deepEqual(migrated.modules,['teams','saved','camps']);assert.equal(migrated.moduleVersion,2);
});
test('first-party profiles and hierarchy routes work, while unknown sports and bogus organizations stay 404',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const sport of ['lacrosse','volleyball','basketball','swimming'])for(const section of ['youth','high-school','college','adult','professional','community','schedules'])assert.equal((await fetch(base+'/sports/'+sport+'/'+section)).status,200,sport+'/'+section);
 let html=await(await fetch(base+'/organizations/denver-juniors?sport=volleyball')).text();assert.match(html,/Actual teams &amp; divisions|Actual teams & divisions/);assert.match(html,/Denver Juniors 11 Kiki/);assert.match(html,/Save organization to My Teams/);
 html=await(await fetch(base+'/organizations/3d-colorado?sport=lacrosse')).text();assert.match(html,/classification needs review/);
 assert.equal((await fetch(base+'/organizations/missing')).status,404);assert.equal((await fetch(base+'/sports/football/youth')).status,404);assert.equal((await fetch(base+'/api/data/directory?sport=swimming&designation=all')).status,400);
 const report=await(await fetch(base+'/api/data/classification')).json();assert.ok(report.exceptionCount>0);assert.equal(report.statewideComplete,false);
});
test('program names and facility venues never override verified participation designations',()=>{
 const collegeBound=programs.find(p=>p.name.includes('College Bound Elite'));assert.ok(collegeBound);assert.equal(collegeBound.designation,'youth');
 const feeder=programs.find(p=>p.programKind==='feeder'&&/High School/.test(p.publishedVenue||''));assert.ok(feeder);assert.equal(feeder.designation,'youth');
 const niwot=programs.find(p=>p.name==='Niwot High School Girls Volleyball');assert.equal(niwot.designation,'high-school');assert.equal(teamsFor(niwot.organizationId,'volleyball').length,7);
});
test('newly approved source identities enter a durable classification queue before publication',async()=>{
 const s=new EngineStore(':memory:');const source={id:'new-source',sport:'basketball',state:'CO',adapter:'named-elements',selector:'.club',entityKind:'organization',urls:['https://example.org/clubs'],allowedHosts:['example.org']};const client={async get(url){return {url,contentType:'text/html',fetchedAt:'2026-11-08',sha256:'content',body:Buffer.from('<p class="club">New Club</p>')};}};
 try{const run=await importSource(s,source,{client,manifest:{reviewedAt:'2026-11-08',reviewer:'Independent reviewer',evidenceURL:source.urls[0],expectedRecordIds:['new-source:New Club'],expectedPageURLs:source.urls,scopeClosed:true},maxPages:1});s.approve(run.runId,{reviewer:'Reviewer',reason:'Scope identity approved'});const state=readParticipation(s);assert.equal(state.programs.length,0);assert.equal(state.exceptions.length,1);assert.equal(state.exceptions[0].code,'PENDING_PARTICIPATION_REVIEW');}finally{s.close();}
});
test('missing or conflicting aliases cannot merge teams into parent organization identities',()=>{
 const g=graph();g.canonicalLinks=[{from:'team',to:'org',reviewStatus:'verified',reviewer:'Reviewer',reviewedAt:'2026-11-08',reason:'Wrong role',evidenceIds:['ev']}];assert.ok(validate(g).errors.some(e=>e.startsWith('INVALID_CANONICAL_LINK')));
});

test('registration references retain program ownership and survive a fresh SQLite audit restore',()=>{
 const refs=participation.registrations;assert.ok(refs.length>0);for(const r of refs){const p=participation.programs.find(p=>p.id===r.programId);assert.ok(p);assert.equal(r.organizationId,p.organizationId);assert.equal(r.status,'unknown');assert.ok(r.evidenceIds.length);assert.ok(r.sourceIds.every(id=>engineSnapshot.sources.some(s=>s.id===id)));}
 const dir=mkdtempSync(join(tmpdir(),'arena-registration-'));const store=new EngineStore(join(dir,'restored.sqlite'));try{restoreSnapshot(store,engineSnapshot);assert.deepEqual(readParticipation(store).registrations,refs.toSorted((a,b)=>a.id.localeCompare(b.id)));}finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
