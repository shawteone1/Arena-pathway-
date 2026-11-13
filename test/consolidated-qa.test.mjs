import {approvedPillarCopy} from './preservation-helper.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {collegeDivision,collegeRows} from '../public/college-research.js';
import {athleteColor} from '../public/siem-guidance.js';
import {withPresentation,selectedContent} from '../public/content-library.js';
import {clientCatalog,directory} from '../src/unified-directory.mjs';
import {createServer} from '../server.mjs';
const read=p=>JSON.parse(readFileSync(p)),baseline='9733b608321529448be64981729e9e4bad5a76eb';
test('consolidated corrections preserve source/data, domain, fixture and brand bytes with the explicit shared-event reader adaptation',()=>{
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseline,'data','engine','public/brand'],{encoding:'utf8'}).trim().split('\n');
 files.push(...['state.js','recurring-plans.js','athlete-records.js','media-library.js','calendar-import.js','local-family-calendar.js','siem-model.js','siem-calendar.js','siem-platform-model.js','siem-family-fixtures.js','siem-platform-fixtures.js'].map(p=>'public/'+p));
 for(const p of files)assert.deepEqual(readFileSync(p),approvedPillarCopy(p,execFileSync('git',['show',baseline+':'+p],{maxBuffer:40e6})),p);
});
test('publication metadata matches individual approved article identities and never changes activation or video approval',()=>{
 const original=read('data/content-review.json'),meta=read('data/content-presentation.json'),next=withPresentation(original,meta);assert.equal(original.sources.length,40);assert.equal(original.sources.filter(s=>s.decision==='approved').length,19);assert.equal(original.sources.filter(s=>s.decision==='inactive').length,21);
 assert.equal(next.sources.flatMap(s=>s.items).filter(i=>i.publishedAt).length,8);assert.equal(next.sources.flatMap(s=>s.items).filter(i=>i.image).length,0);assert.equal(original.sources.flatMap(s=>s.items).filter(i=>i.publishedAt).length,0);
 const item=original.sources.flatMap(s=>s.items).find(i=>meta.items[i.id]?.publishedAt);for(const patch of [{url:'https://other.example'},{publishedAt:'not a date'},{publishedAt:'2099-01-01'},{status:403}]){const invalid={items:{[item.id]:{...meta.items[item.id],...patch}}};assert.equal(withPresentation(original,invalid).sources.flatMap(s=>s.items).find(i=>i.id===item.id),item);}
 assert.deepEqual(selectedContent(next,{sport:'lacrosse',contentSubscriptions:[]},'news'),[]);
});
test('college division labels do not conflate NCAA/NAIA/NJCAA or club and unknown',()=>{
 for(const [value,label] of [['NCAA Division I','NCAA D1'],['NCAA Division II','NCAA D2'],['NCAA Division III','NCAA D3'],['NAIA','NAIA'],['NJCAA','NJCAA'],['MCLA Division I','Collegiate club'],['Unknown','Unconfirmed'],['Division I','Unconfirmed']])assert.equal(collegeDivision(value),label);
});
test('college filters project existing canonical teams with explicit gender evidence, never invent contacts or dates',()=>{
 for(const sport of ['lacrosse','volleyball','basketball','swimming'])for(const r of collegeRows(clientCatalog,sport)){assert.ok(clientCatalog.teams.some(t=>t.id===r.id&&t.sport===sport));assert.ok(!('email' in r));if(r.programGender==='women')assert.match(r.name,/women|girls/i);if(r.programGender==='men')assert.match(r.name,/\bmen|boys/i);}
 const before=read('data/catalog.json');for(const t of before.teams)assert.ok(clientCatalog.teams.some(x=>x.id===t.id));
});
test('athlete color is ID-stable across ordering, profiles, messages and redraw, with bounded palette',()=>{
 const ids=['alex','taylor','jordan','existing-stable-id','another-id'];const values=ids.map(athleteColor);assert.deepEqual([...ids].reverse().map(athleteColor).reverse(),values);for(const v of values)assert.ok(v>=0&&v<6&&Number.isInteger(v));assert.equal(athleteColor('existing-stable-id'),athleteColor('existing-stable-id'));
});
test('public community and LockedIn preview require no athlete, preserve restrictive methods/CSP and expose no real provider forms',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const path of ['/community','/community?sport=lacrosse','/locked-in-demo',...['lacrosse','volleyball','basketball','swimming'].flatMap(s=>['/sports/'+s,'/sports/'+s+'/development','/sports/'+s+'/news'])]){const res=await fetch(base+path);assert.equal(res.status,200,path);assert.ok(res.headers.get('content-security-policy').includes("connect-src 'self'"));const html=await res.text();if(path==='/locked-in-demo'){for(const name of ['NSID','Box','DocuSign','Fiserv','Non-operational','FICTIONAL'])assert.ok(html.includes(name));assert.ok(!/<input|<form/.test(html));}if(path.startsWith('/sports/')&&!/news|development/.test(path)){assert.ok(html.includes('sport-information'));assert.ok(html.includes('result-count'));assert.ok(html.includes('Community'));}}
 assert.equal((await fetch(base+'/locked-in-demo',{method:'POST'})).status,405);assert.equal((await fetch(base+'/sports/soccer/news')).status,404);
});
test('community categories keep missing officials/safety data explicit and do not create organization rows',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const html=await(await fetch('http://127.0.0.1:'+server.address().port+'/community')).text();for(const name of ['Recreation Centers & Parks','State and Regional Sports Associations','National Sports Associations','Referee / Officials Associations','Community and Adaptive Programs','Participation and Safety Resources','No applicable reviewed entries'])assert.ok(html.includes(name));assert.ok(!html.includes('offers every sport'));assert.ok(directory('lacrosse','youth',new URLSearchParams()).length>=13);
});
