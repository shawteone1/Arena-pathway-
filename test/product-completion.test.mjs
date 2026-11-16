import test from 'node:test';
import assert from 'node:assert/strict';
import {competitionMediaOptions,competitionSummary} from '../public/competition-records.js';
import {associateClub} from '../public/club-association.js';
import {approvedArticleImage} from '../public/news-editorial.js';
import {createServer} from '../server.mjs';
import {readFile} from 'node:fs/promises';
const events=[{id:'practice',kind:'practice',name:'Practice',start:'2026-11-16'},{id:'game',kind:'game',name:'Game',start:'2026-11-20'},{id:'race',kind:'meet',name:'Race',start:'2026-12-02'},{id:'container',kind:'tournament',container:true,name:'Tournament container',start:'2026-11-21'},{id:'match',kind:'match',name:'Match',start:'2026-11-21'}];
test('new media associations exclude practices and containers; edited historical uploads keep exact references',()=>{
 assert.deepEqual(competitionMediaOptions(events).map(([id])=>id),['','game','race','match']);
 assert.match(competitionMediaOptions(events,'practice').at(-1)[1],/Retained practice.*existing upload only/);
 assert.equal(competitionMediaOptions(events,'practice').at(-1)[0],'practice');
 assert.deepEqual(competitionMediaOptions(events,'deleted').at(-1),['deleted','Retained event reference · scheduled event removed']);
 assert.equal(competitionMediaOptions(events,'game').filter(([id])=>id==='game').length,1);
});
test('explicit season date summaries exclude practices and other athletes, count zeros and update from retained records',()=>{
 const profile={id:'one',sport:'lacrosse',records:[{id:'a',eventRef:'game',metrics:{Goals:2}},{id:'b',eventRef:'match',metrics:{Goals:0,Assists:1}},{id:'c',eventRef:'practice',metrics:{Goals:100}},{id:'d',athleteId:'other',eventRef:'game',metrics:{Goals:200}},{id:'e',eventRef:'deleted',metrics:{Goals:500}}]};
 const before=structuredClone(profile);assert.deepEqual(competitionSummary(profile,events),{recordCount:2,totals:{Goals:2,Assists:1}});assert.deepEqual(competitionSummary(profile,events,{from:'2026-11-21',through:'2026-11-21'}),{recordCount:1,totals:{Goals:0,Assists:1}});assert.deepEqual(profile,before);
 assert.throws(()=>competitionSummary(profile,events,{from:'2026-12-01',through:'2026-11-01'}),/season end/);
});
test('swimming season summaries never sum race times, distances or places',()=>{
 const profile={id:'one',sport:'swimming',records:[{eventRef:'game',metrics:{'Time (seconds)':60,'Distance (meters)':100,Place:1}},{eventRef:'race',metrics:{'Time (seconds)':80,'Distance (meters)':200,Place:2}}]};assert.deepEqual(competitionSummary(profile,events).totals,{'Recorded swims':2});
});
test('My Club stores one existing organization reference, keeps saved opportunities and never activates Recruiting',()=>{
 const p={id:'athlete',sport:'lacrosse',clubTeam:'Previous manual club',programTeam:'Retained team',saved:['saved-old'],plans:[{id:'old'}],modules:['schedules'],recruiting:{notes:'Preserve',parentApproved:true}};const org={id:'reviewed-club',name:'Reviewed club',sports:['lacrosse','volleyball']};associateClub(p,org);associateClub(p,org);assert.equal(p.clubId,org.id);assert.equal(p.clubTeam,org.name);assert.equal(p.programTeam,'Retained team');assert.equal(p.clubTeamNeedsReview,true);assert.deepEqual(p.saved,['saved-old','reviewed-club']);assert.deepEqual(p.modules,['schedules']);assert.deepEqual(p.plans,[{id:'old'}]);assert.equal(p.recruiting.notes,'Preserve');assert.equal(p.recruiting.parentApproved,false);assert.throws(()=>associateClub(p,{id:'other',name:'Other',sport:'swimming'}),/sport/);
});
test('article metadata cannot grant image display; approved images require bound local asset and license',()=>{
 const item={url:'https://publisher.example/story',image:{url:'/assets/editorial/story.webp',articleURL:'https://publisher.example/story',credit:'Photographer',license:'Recorded permission',permitted:true}};assert.equal(approvedArticleImage(item),item.image);for(const change of [{permitted:false},{articleURL:'https://publisher.example/other'},{license:''},{url:'https://publisher.example/photo.jpg'}])assert.equal(approvedArticleImage({...item,image:{...item.image,...change}}),null);
});
test('public photography reuses the four licensed manifests and serves real optimized assets',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../src/photography.json',import.meta.url)));const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{const photos=await(await fetch(base+'/api/news-photography')).json();assert.deepEqual(Object.keys(photos).sort(),['basketball','lacrosse','swimming','volleyball']);for(const [sport,p] of Object.entries(photos)){assert.deepEqual(p,manifest[sport]);assert.equal((await fetch(base+'/assets/'+p.asset)).status,200);}for(const script of ['club-association.js','news-editorial.js'])assert.match((await fetch(base+'/assets/'+script)).headers.get('content-type'),/javascript/);}finally{await new Promise(r=>server.close(r));}
});
