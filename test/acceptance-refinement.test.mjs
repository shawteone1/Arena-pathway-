import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{execFileSync}from'node:child_process';
import{reviewedSources,selectedContent}from'../public/content-library.js';import{loadState,persist}from'../public/state.js';
const review=JSON.parse(readFileSync('data/content-review.json')),now=new Date(review.reviewedAt),options={now};
test('all40 candidate identities receive individual decisions; only20 inspected written items are approved',()=>{
 const original=JSON.parse(readFileSync('data/sport-content-sources.json')),ids=Object.entries(original.sports).flatMap(([sport,categories])=>Object.entries(categories).flatMap(([category,names])=>names.map(name=>sport+':'+category+':'+name)));
 assert.equal(review.sources.length,40);assert.deepEqual(new Set(review.sources.map(s=>s.id)),new Set(ids));assert.equal(review.sources.filter(s=>s.decision==='approved').length,18);assert.equal(review.sources.flatMap(s=>s.items).length,20);
 for(const s of review.sources){assert.ok(s.reason&&s.checkedAt&&s.validUntil&&s.evidence.length);if(s.decision==='approved')for(const item of s.items){assert.equal(item.free,true);assert.equal(item.youthSuitable,true);assert.ok(item.summary&&item.reviewScope);assert.ok(s.evidence.some(e=>e.finalUrl===item.url&&e.status===200&&e.sha256));}else assert.equal(s.items.length,0);}
});
test('old candidate interests never turn on subscriptions and source filters keep sport/category boundaries',()=>{
 const p={id:'unchanged',sport:'volleyball',contentSelections:review.sources.map(s=>s.id)};assert.deepEqual(selectedContent(review,p,'news','',options),[]);
 p.contentSubscriptions=review.sources.map(s=>s.id);const news=selectedContent(review,p,'news','',options),guides=selectedContent(review,p,'development','',options);assert.ok(news.length&&guides.length);assert.ok(news.every(i=>i.sourceId.startsWith('volleyball:news:')));assert.ok(guides.every(i=>i.sourceId.startsWith('volleyball:development:')));assert.equal(selectedContent(review,p,'news','basketball:news:FIBA',options).length,0);
 const id=news[0].sourceId;assert.ok(selectedContent(review,p,'news',id,options).every(i=>i.sourceId===id));
});
test('inactive, expired, malformed and unsafe reviewed sources fail closed',()=>{
 const source=review.sources.find(s=>s.decision==='approved'),r={schemaVersion:1,sources:[source]};assert.equal(reviewedSources(r,source.sport,source.category,options).length,1);
 for(const patch of [{decision:'inactive'},{validUntil:'2020-01-01'},{checkedAt:'2099-01-01'},{items:{}},{items:[{free:false,youthSuitable:true,url:'https://example.org/'}]},{items:[{free:true,youthSuitable:false,url:'https://example.org/'}]},{items:[{free:true,youthSuitable:true,url:'javascript:alert(1)'}]},{items:[{free:true,youthSuitable:true,url:'https://user:password@example.org/'}]}])assert.deepEqual(reviewedSources({...r,sources:[{...source,...patch}]},source.sport,source.category,options),[]);
});
test('new subscriptions preserve all browser-local profile fields, old interests and independent Recruiting',()=>{
 const p={id:'stable',nickname:'Athlete',sport:'swimming',guardian:true,role:'parent',saved:['existing'],plans:[{id:'event',name:'Meet',start:'2026-11-12'}],contentSelections:['legacy-interest'],contentSubscriptions:['swimming:news:USA Swimming'],extension:{keep:true},recruiting:{checks:[],notes:'Keep'}};const map=new Map([['arenaPathway.v2',JSON.stringify({version:2,active:p.id,profiles:[p]})]]),s={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const state=loadState(s);persist(s,state);const result=loadState(s).profiles[0];assert.equal(result.id,p.id);assert.deepEqual(result.contentSelections,p.contentSelections);assert.deepEqual(result.contentSubscriptions,p.contentSubscriptions);assert.deepEqual(result.saved,p.saved);assert.deepEqual(result.extension,p.extension);assert.equal(result.plans[0].id,'event');assert.ok(!result.modules.includes('recruiting'));
});
test('accepted directories, original inventories, brand, fixtures and schedule/domain models remain byte-identical to b8a19cf',()=>{
 for(const path of ['data/sport-content-sources.json','public/state.js','public/recurring-plans.js','public/athlete-records.js','public/media-library.js','public/local-family-calendar.js','public/calendar-import.js','public/siem-model.js','public/siem-calendar.js','public/siem-platform.js','public/siem-platform-model.js','public/siem-family-fixtures.js','public/siem-platform-fixtures.js','AGENTS.md','docs/PRODUCT-NORTH-STAR.md'])assert.deepEqual(readFileSync(path),execFileSync('git',['show','b8a19cf:'+path]),path);
 const paths=execFileSync('git',['ls-tree','-r','--name-only','b8a19cf','engine','data','public/brand'],{encoding:'utf8'}).trim().split('\n');for(const path of paths)assert.deepEqual(readFileSync(path),execFileSync('git',['show','b8a19cf:'+path],{maxBuffer:40e6}),path);
});
