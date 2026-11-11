import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {cleanProfile,loadState,persist,toggleSaved} from '../public/state.js';
import {inSearchRegion,searchRegions} from '../public/regions.js';
import {directory} from '../src/unified-directory.mjs';
import {builder,sportPage} from '../src/views.mjs';
test('editing identity preserves local history and unknown extension data across reload',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const p=cleanProfile({id:'old',nickname:'Athlete',sport:'swimming',clubTeam:'Existing club',position:'100m freestyle',saved:['club'],plans:[{id:'plan',start:'2030-05-06',name:'Practice'}],recruiting:{checks:['research'],notes:'Existing notes'},customExtension:{retain:true}});
 const original=structuredClone(p);persist(storage,{version:2,profiles:[p],active:p.id});const next=loadState(storage);next.profiles[0].nickname='Edited';persist(storage,next);const restored=loadState(storage).profiles[0];assert.deepEqual(restored,{...original,nickname:'Edited'});toggleSaved(restored,'another-club');assert.ok(!restored.modules.includes('recruiting'));
});
test('search areas intentionally overlap without rewriting source geography',()=>{
 for(const city of ['Aurora','Centennial','Castle Rock','Parker']){assert.ok(inSearchRegion({city},'south-denver-dtc'));assert.ok(inSearchRegion({city},'denver-metro'));}
 assert.ok(inSearchRegion({city:'Colorado Springs'},'southern-colorado'));assert.ok(inSearchRegion({city:'Colorado Springs'},'colorado-springs-metro'));
 assert.ok(inSearchRegion({city:'Longmont'},'boulder-metro'));assert.ok(inSearchRegion({city:'Longmont'},'northern-colorado'));assert.equal(searchRegions.length,7);assert.ok(!inSearchRegion({city:null},'south-denver-dtc'));
});
test('initial sport entry renders every searchable reviewed directory row',()=>{
 for(const sport of ['lacrosse','volleyball','basketball','swimming']){const html=sportPage(sport,undefined,new URLSearchParams());assert.match(html,/role="search"/);for(const row of directory(sport))assert.ok(html.includes('data-record="'+row.id+'"')||html.includes('data-organization="'+row.id+'"'),row.id);for(const [,label] of searchRegions)assert.ok(html.includes(label));}
 assert.match(builder(),/id="athlete-form"/);assert.ok(!builder().includes('workspace-module'));
});
test('all inherited dependency engine/data and fixtures remain exact at their appropriate tips',()=>{
 const refs=['5470bca','332ba1b'];
 const seen=new Set();for(const ref of refs){const files=execFileSync('git',['ls-tree','-r','--name-only',ref],{encoding:'utf8'}).trim().split('\n').filter(f=>f.startsWith('data/')||f.startsWith('engine/')||['public/siem-family-fixtures.js','public/siem-platform-fixtures.js','public/siem-platform-model.js','public/siem-model.js','AGENTS.md','docs/PRODUCT-NORTH-STAR.md'].includes(f));for(const f of files){if(ref==='5470bca'&&!f.startsWith('engine/')&&!f.startsWith('data/'))continue;if(seen.has(f))continue;seen.add(f);assert.deepEqual(readFileSync(f),execFileSync('git',['show',ref+':'+f],{maxBuffer:40e6}),f);}}
});
