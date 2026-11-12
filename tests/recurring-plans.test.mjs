import test from 'node:test';import assert from 'node:assert/strict';
import {normalizePlan,expandPlan,expandPlans} from '../public/recurring-plans.js';
test('single events retain date and category',()=>{const p=expandPlan({id:'a',name:'Meet',start:'2026-11-20',kind:'meet'});assert.equal(p[0].kind,'meet');assert.equal(p.length,1);});
test('weekly recurring practice has stable occurrence IDs',()=>{const p={id:'a',name:'Practice',start:'2026-11-02',repeat:'weekly',until:'2026-11-23',days:[1,3],kind:'practice'};const x=expandPlan(p);assert.deepEqual(x.map(e=>e.start),['2026-11-02','2026-11-04','2026-11-09','2026-11-11','2026-11-16','2026-11-18','2026-11-23']);assert.equal(new Set(x.map(e=>e.occurrenceId)).size,x.length);});
test('calendar boundary and week intervals filter correctly',()=>{const p={id:'b',name:'Practice',start:'2026-11-02',repeat:'weekly',interval:2,until:'2026-12-01',days:[1]};assert.deepEqual(expandPlan(p,{from:'2026-11-10',to:'2026-11-30'}).map(e=>e.start),['2026-11-16','2026-11-30']);});
test('invalid repeat end date rejected',()=>assert.throws(()=>normalizePlan({name:'X',start:'2026-11-01',repeat:'weekly'})));
test('malformed legacy plans ignored rather than crashing',()=>assert.equal(expandPlans([{name:'',start:'bad'}]).length,0));
