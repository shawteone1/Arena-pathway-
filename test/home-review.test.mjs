import test from 'node:test';
import assert from 'node:assert/strict';
import {home} from '../src/views.mjs';
import {buildInfo} from '../src/build-info.mjs';
test('home puts four independent tools before sport discovery without duplicate funnels',()=>{
 const html=home();
 assert.ok(html.indexOf('id="platform"')<html.indexOf('id="sports"'));
 assert.equal((html.match(/class="platform-pillar"/g)||[]).length,4);
 assert.match(html, /href="\/my-pathway\?view=family">My athletes/);
 assert.doesNotMatch(html,/Create My Pathway|LockedIn · Coming Soon|class="experience-nav"/);
 for(const route of ['/my-ap','/recruiting','/locked-in-demo','/sports/lacrosse','/sports/swimming','/sports/basketball','/sports/volleyball'])assert.ok(html.includes('href="'+route+'"'));
});
test('build metadata identifies actual checkout rather than package version',()=>{
 assert.match(buildInfo.commit,/^[a-f0-9]{40}$/);assert.equal(typeof buildInfo.dirty,'boolean');assert.ok(!Number.isNaN(Date.parse(buildInfo.startedAt)));
});

import {createServer} from '../server.mjs';
test('health exposes the runtime build without changing health version contract',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const response=await fetch('http://127.0.0.1:'+server.address().port+'/health');
 assert.equal(response.status,200);const health=await response.json();assert.equal(health.version,'0.7.0-development');assert.deepEqual(health.build,buildInfo);
});

test('approved supporting tagline is visible in hero, not footer only; mission uses guided onboarding',()=>{
 const html=home(),hero=html.slice(html.indexOf('<section class="stadium hero">'),html.indexOf('id="platform"'));
 assert.match(hero,/<p class="hero-intro">Your sport\. Your path\. One place\.<\/p>/);
 const mission=html.slice(html.indexOf('class="section mission"'),html.indexOf('class="closing-statement"'));
 assert.match(mission,/href="\/build\?new=1&guided=1">Start with what matters to you/);
 assert.doesNotMatch(mission,/href="\/build">/);
});
