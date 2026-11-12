import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {loadState,persist} from '../public/state.js';
import {myPathway,sportPage} from '../src/views.mjs';
const baseline='8c48179998ca0c09b6ed4e56060e10acf670068b';
test('Nov 12 follow-up preserves directory, engine, original data, fixtures and SIEM domain',()=>{
 const paths=['public/regions.js','public/siem-family-fixtures.js','public/siem-platform-fixtures.js','public/siem.js','public/siem-model.js','src/unified-directory.mjs','src/unified-views.mjs','src/progressive-directory.mjs','engine'];
 const originalData=execFileSync('git',['ls-tree','-r','--name-only',baseline,'data'],{encoding:'utf8'}).trim().split('\n');
 assert.equal(execFileSync('git',['diff',baseline,'--',...paths,...originalData],{encoding:'utf8'}),'');
 const previous=execFileSync('git',['show',baseline+':public/style.css'],{encoding:'utf8'}),current=readFileSync('public/style.css','utf8');assert.ok(current.startsWith(previous),'Approved CSS remains byte-preserved; additions only');
});
test('accepted directory HTML stays byte-identical while profile markup becomes card-based',async()=>{
 const filename=new URL('../src/.profile-before-'+randomUUID()+'.mjs',import.meta.url);writeFileSync(filename,execFileSync('git',['show',baseline+':src/views.mjs']));
 try{const before=await import(filename.href);for(const sport of ['lacrosse','volleyball','basketball','swimming'])for(const section of [undefined,'youth','college']){const params=new URLSearchParams('region=all');assert.equal(sportPage(sport,section,params),before.sportPage(sport,section,params),sport+'/'+section);}}
 finally{unlinkSync(filename);}
 const html=myPathway();for(const id of ['family-profile','profile-summary','profile-nav','module-customizer','profile-select','delete-profile'])assert.ok(html.includes('id="'+id+'"'));
 for(const id of ['teams','saved','schedules','media','camps','community','recruiting'])assert.ok(html.includes('id="template-'+id+'"'));
 assert.ok(html.includes('athlete-profile-container'));assert.ok(!html.includes('class="page-heading"'));
});
test('optional local avatar is additive and survives load without losing identity or unrelated records',()=>{
 const raw={version:2,active:'existing',profiles:[{id:'existing',nickname:'Athlete',sport:'lacrosse',role:'parent',guardian:true,clubTeam:'Existing team',position:'Midfield',avatarDataUrl:'data:image/jpeg;base64,fixture',saved:['denver-elite'],plans:[{id:'practice',name:'Practice',start:'2030-05-06'}],modules:['teams'],recruiting:{checks:['research'],notes:'Retain family notes'},extension:{keep:true}}]};
 const map=new Map([['arenaPathway.v2',JSON.stringify(raw)]]),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const state=loadState(storage);persist(storage,state);const result=loadState(storage).profiles[0];
 assert.equal(result.id,'existing');assert.equal(result.avatarDataUrl,raw.profiles[0].avatarDataUrl);assert.deepEqual(result.saved,['denver-elite']);assert.equal(result.plans[0].id,'practice');assert.equal(result.recruiting.notes,'Retain family notes');assert.deepEqual(result.extension,{keep:true});assert.ok(!result.modules.includes('recruiting'));
});
