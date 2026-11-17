import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {myPathway} from '../src/views.mjs';
import {buildOwnerDraftProjection,projectionRevision} from '../public/recruiting-profile.js';
import {chooseSection,draftSelection,saveComposition,savedSelection} from '../public/recruiting-composition.js';
test('one active recruiting shell contains no profile tools, legacy checklist or redundant builder, with independent research fallback',()=>{
 const html=myPathway({recruiting:true});for(const id of ['template-recruiting','optional-recruiting','recruiting-form','profile-sections','module-customizer'])assert(!html.includes('id="'+id+'"'),id);assert(html.includes('id="college-research"'));assert(html.includes('data-workspace-view="recruiting"'));const app=readFileSync('public/app.js','utf8');assert(!app.includes('renderRecruiting(p)'));assert(!app.includes('template-recruiting'));assert(app.indexOf("dataset.workspaceView==='recruiting'")<app.indexOf('const generation=++workspaceGeneration;const previousRecruiting'));const retired=readFileSync('public/recruiting-builder.js','utf8');assert(retired.includes('location.replace'));assert(!retired.includes('document.createElement'));assert(!retired.includes('Parent-controlled recruiting preview'));
});
test('jersey is selected-only, and old saved compositions do not gain the new identity field or lose original data',()=>{
 const now=new Date('2026-11-17T12:00:00Z'),p={id:'owned',nickname:'Fictional Athlete',jersey:'17',sport:'swimming',guardian:true,role:'parent',ageYears:16,ageReviewedAt:now.toISOString(),saved:['original-college'],recruiting:{notes:'Retain research',approvedFields:['label']}};let model=buildOwnerDraftProjection(p,{now});assert(!('jersey'in model));const rev=projectionRevision(model);saveComposition(p,rev,{now});const before=structuredClone(savedSelection(p));chooseSection(p,'introduction',true);model=buildOwnerDraftProjection(p,{now});assert.equal(model.jersey,'17');assert.equal(savedSelection(p).fields.includes('jersey'),false);assert.deepEqual(savedSelection(p),before);assert.deepEqual(p.saved,['original-college']);assert.equal(p.recruiting.notes,'Retain research');assert(draftSelection(p).fields.includes('jersey'));
});
