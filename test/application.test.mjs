import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from '../server.mjs';
import {catalog,sports,sections,validateCatalog,freshness,directoryRows} from '../src/catalog.mjs';
import {loadState,cleanProfile,toggleSaved,scheduleFor,calendarText,persist,STORAGE_KEY} from '../public/state.js';
import {readFileSync} from 'node:fs';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};};
test('catalog reconciles expanded records without claiming statewide completeness',()=>{
 const r=validateCatalog();assert.deepEqual(r.errors,[]);assert.equal(catalog.coverage.status,'partial');assert.equal(catalog.coverage.statewideExpected,null);
 for(const i of r.importReports){assert.equal(i.imported,i.expected);assert.deepEqual(i.missing,[]);}
 assert.equal(catalog.imports.find(i=>i.id==='cll-schedule-teams').candidateCount,18);
 assert.equal(catalog.teams.filter(t=>t.sourceIds.includes('cll-schedule')).length,17);
 assert.ok(!catalog.teams.some(t=>t.name==='Bye Week'));
 for(const sport of sports){assert.ok(directoryRows(sport).some(r=>r.kind==='team'));assert.ok(catalog.communities.some(r=>r.sport===sport));}
});
test('missing imported members, duplicate aliases, duplicate teams, orphan teams and broken provenance fail validation',()=>{
 const missing=structuredClone(catalog);missing.organizations=missing.organizations.filter(o=>o.id!=='wsl-aspen');assert.match(validateCatalog(missing).errors.join('\n'),/Incomplete import/);
 const dup=structuredClone(catalog);dup.organizations.push({...dup.organizations[0],id:'new-id',name:'Another name',aliases:['DENVER ELITE']});assert.match(validateCatalog(dup).errors.join('\n'),/Duplicate organization/);
 const team=structuredClone(catalog);team.teams.push({...team.teams[0],id:'copy'});assert.match(validateCatalog(team).errors.join('\n'),/Duplicate team/);
 const orphan=structuredClone(catalog);orphan.teams[0].organizationId='missing';assert.match(validateCatalog(orphan).errors.join('\n'),/Invalid team parent/);
 const noSource=structuredClone(catalog);noSource.organizations[0].sourceIds=['not-a-source'];assert.match(validateCatalog(noSource).errors.join('\n'),/Missing provenance/);
 const unreconciled=structuredClone(catalog);unreconciled.imports.find(i=>i.candidateCount).candidateCount=22;assert.match(validateCatalog(unreconciled).errors.join('\n'),/Unreconciled candidate count/);
});
test('freshness expires after 90 days and is independent of unknown season',()=>{
 assert.equal(freshness({reviewedAt:'2026-01-01'},new Date('2026-05-01')),'Review overdue');
 assert.equal(freshness({reviewedAt:'2026-11-08'},new Date('2026-11-08')),'Source reviewed');
});
test('profile state recovers corrupt storage, migrates legacy preferences with media OFF, and sanitizes fields',()=>{
 const storage=memory();storage.setItem(STORAGE_KEY,'{broken');assert.equal(loadState(storage).profiles.length,0);
 storage.setItem('arenaPathway',JSON.stringify({sport:'Swimming',role:'Parent / Family',goal:'Recruiting',media:true}));
 const state=loadState(storage);assert.equal(state.profiles[0].sport,'swimming');assert.equal(state.profiles[0].goal,'recruiting');assert.equal(state.profiles[0].mediaEnabled,false);assert.deepEqual(state.profiles[0].mediaSources,[]);
 assert.equal(cleanProfile({sport:'invalid'}),null);assert.equal(cleanProfile({sport:'basketball',role:'coach'}).role,'athlete');assert.deepEqual(cleanProfile({sport:'basketball',mediaEnabled:false,mediaSources:['du-news']}).mediaSources,[]);
 persist(storage,state);assert.deepEqual(loadState(storage),state);
});
test('saves, notes and schedules remain isolated between family profiles',()=>{
 const a=cleanProfile({id:'a',sport:'lacrosse',role:'parent',guardian:true});const b=cleanProfile({id:'b',sport:'swimming'});
 toggleSaved(a,'de-tryout');toggleSaved(a,'frvc-camp');assert.deepEqual(b.saved,[]);assert.equal(scheduleFor(a,catalog).length,1);
 a.plans.push({id:'personal',name:'Practice',start:'2026-11-09',note:'Local pool'});assert.equal(scheduleFor(a,catalog)[0].name,'Practice');assert.equal(scheduleFor(b,catalog).length,0);
 toggleSaved(a,'de-tryout');assert.equal(scheduleFor(a,catalog).length,1);
});
test('calendar export uses exclusive end dates, escapes injected lines and folds UTF-8 safely',()=>{
 const text=calendarText([{id:'x',name:'Practice\nBEGIN:VEVENT',start:'2026-12-31',note:'a,b;c\\d'},{id:'y',name:'🏊'.repeat(40),start:'2026-11-09'}]);
 assert.match(text,/DTEND;VALUE=DATE:20270101/);assert.match(text,/Practice\\nBEGIN:VEVENT/);assert.equal((text.match(/\r\nBEGIN:VEVENT/g)||[]).length,2);for(const line of text.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);
});
test('all routes, source assets, search filters, strict 404s, and internal navigation work',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port;
 const paths=['/','/build','/my-pathway','/data','/credits',...sports.flatMap(s=>['/sports/'+s,...sections.map(c=>'/sports/'+s+'/'+c)])];
 for(const path of paths){const response=await fetch(base+path);assert.equal(response.status,200,path);const html=await response.text();assert.match(html,/<main id="main"/);const sportsNav=html.match(/<nav aria-label="Sports">(.*?)<\/nav>/s)[1];assert.equal((sportsNav.match(/<a /g)||[]).length,5);assert.ok(!/fan portal|coach portal/i.test(html));for(const [,href] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)){const linked=await fetch(base+href);assert.equal(linked.status,200,`${path} -> ${href}`);await linked.arrayBuffer();}}
 for(const path of ['/sports/football','/sports/lacrosse/teams/extra','/sports/lacrosse/nope','/assets/nope','/not-found'])assert.equal((await fetch(base+path)).status,404,path);
 let html=await (await fetch(base+'/sports/volleyball/teams?q=Kiki')).text();assert.match(html,/1 record/);assert.match(html,/Denver Juniors 11 Kiki/);assert.ok(!html.includes('data-record="sky-18-royal"'));
 html=await (await fetch(base+'/sports/lacrosse/teams?kind=club&city=Denver')).text();assert.match(html,/2 records/);
 html=await (await fetch(base+'/sports/lacrosse/teams?q=%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E')).text();assert.ok(!html.includes('<script>alert'));assert.match(html,/&lt;script&gt;/);
 const head=await fetch(base+'/build',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.match(head.headers.get('content-security-policy'),/script-src 'self'/);
 assert.equal((await fetch(base+'/build',{method:'POST'})).status,405);
 const api=await (await fetch(base+'/api/catalog')).json();assert.ok(!('profiles' in api));assert.equal((await (await fetch(base+'/api/coverage')).json()).valid,true);
});
test('responsive and accessibility code includes narrow layouts, tap targets, label associations and opt-in defaults',()=>{
 const css=readFileSync(new URL('../public/style.css',import.meta.url),'utf8');assert.match(css,/@media\(max-width:650px\)/);assert.match(css,/min-height:48px/);assert.match(css,/focus-visible/);assert.match(css,/prefers-reduced-motion/);
 // This is a structural regression check, not browser or mobile interaction QA.
 const js=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');assert.ok(!js.includes('innerHTML'));assert.match(js,/mediaEnabled\?mediaSources:\[\]/);
});
