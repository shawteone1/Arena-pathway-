import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarDate,calendarRange,shiftCalendarDate,activityKind} from '../public/siem-calendar.js';
import {createServer} from '../server.mjs';
test('SC-style display dates preserve all-day dates and use Denver across DST and UTC midnight',()=>{
 assert.equal(calendarDate('2030-05-07T01:00:00Z'),'2030-05-06');
 assert.equal(calendarDate('2030-05-07',true),'2030-05-07');
 assert.equal(calendarDate('2030-05-07T01:00:00'),'2030-05-07');
 assert.equal(calendarDate('2030-03-10T08:30:00Z'),'2030-03-10');
 assert.equal(calendarDate('badZ'),'');
});
test('calendar navigation handles month ends, leap years, week boundaries and year rollover',()=>{
 assert.equal(shiftCalendarDate('2032-01-31','month',1),'2032-02-29');
 assert.equal(shiftCalendarDate('2030-01-31','month',1),'2030-02-28');
 assert.equal(shiftCalendarDate('2030-12-15','month',1),'2031-01-15');
 assert.deepEqual(calendarRange('2030-05-12','week'),{start:'2030-05-06',end:'2030-05-13'});
 assert.deepEqual(calendarRange('2032-02-29','month'),{start:'2032-02-01',end:'2032-03-01'});
});
test('activity labels distinguish actual tournament games from RSVP tasks without changing source fields',()=>{
 const game={eventType:'game',title:'Front Range volleyball tournament'};assert.equal(activityKind(game),'tournament');assert.equal(game.eventType,'game');
 assert.equal(activityKind({eventType:'deadline',title:'Tournament RSVP due'}),'other');
 assert.equal(activityKind({eventType:'practice',title:'Practice'}),'practice');
});
test('independent recruiting entry reuses the same profile renderer and offers research without an athlete',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 const html=await(await fetch(base+'/recruiting')).text();assert.ok(html.includes('data-workspace-view="recruiting"'));assert.ok(html.includes('Explore public college programs without creating an athlete'));assert.ok(html.includes('Sharing is off'));
 assert.equal((await fetch(base+'/assets/siem-calendar.js')).status,200);
});
