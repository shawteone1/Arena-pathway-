import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cleanProfile,loadState,persist,STORAGE_KEY,modulesFor,setModules,toggleSaved,scheduleFor,moduleDefinitions} from '../public/state.js';
import {builder,myPathway} from '../src/views.mjs';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};};
const profile=extra=>cleanProfile({id:'athlete',sport:'volleyball',role:'parent',guardian:true,modules:[],...extra});

test('new explicit module choices are independent of goal, interests and saved clubs',()=>{
 const p=profile({goal:'recruiting',interests:['recruiting','community'],modules:['teams','camps']});
 assert.deepEqual(modulesFor(p),['teams','camps']);const before=structuredClone(p);toggleSaved(p,'denver-juniors');
 assert.deepEqual(p,{...before,saved:['denver-juniors']});assert.equal(p.saved[0],'denver-juniors');assert.ok(!p.modules.includes('recruiting'));
 toggleSaved(p,'denver-juniors');assert.deepEqual(p.saved,[]);assert.deepEqual(p.modules,['teams','camps']);
});
test('all seven modules can be selected independently, sanitized and ordered without mandatory progression',()=>{
 for(const {id} of moduleDefinitions){const p=profile({modules:[id]});assert.deepEqual(p.modules,[id]);}
 const p=profile({modules:['community','teams','community','invalid','recruiting']});assert.deepEqual(p.modules,['community','teams','recruiting']);
 setModules(p,['recruiting','community','teams']);assert.deepEqual(p.modules,['recruiting','community','teams']);
 setModules(p,[]);assert.deepEqual(p.modules,[]);assert.equal(p.mediaEnabled,false);
});
test('removing every module retains saved records, personal calendars, recruiting plans and media preferences after reload',()=>{
 const p=profile({modules:['teams','schedules','recruiting','media'],mediaEnabled:true,mediaSources:['du-news'],saved:['denver-juniors','camp'],plans:[{id:'plan',name:'Practice',start:'2026-12-01',note:'Local gym'}],recruiting:{checks:['research'],notes:'Academic fit'}});
 const retained={saved:structuredClone(p.saved),plans:structuredClone(p.plans),recruiting:structuredClone(p.recruiting)};setModules(p,[]);
 const storage=memory();persist(storage,{version:2,profiles:[p],active:p.id});const restored=loadState(storage).profiles[0];
 for(const key of Object.keys(retained))assert.deepEqual(restored[key],retained[key]);assert.deepEqual(restored.mediaSourcePreferences,['du-news']);assert.deepEqual(restored.mediaSources,[]);assert.deepEqual(restored.modules,[]);
 setModules(restored,['media','schedules','recruiting','teams']);assert.deepEqual(restored.mediaSources,['du-news']);assert.equal(scheduleFor(restored,{opportunities:[]})[0].id,'plan');assert.equal(restored.recruiting.notes,'Academic fit');
});
test('family profiles retain independent module selections, ordering and media sources',()=>{
 const a=profile({id:'a',modules:['community','teams']}),b=profile({id:'b',sport:'swimming',modules:['schedules','recruiting'],recruiting:{checks:['questions'],notes:'Swim research'}}),storage=memory();
 const unchanged=structuredClone(b);setModules(a,['media','teams']);a.mediaSources=['club-updates'];a.mediaSourcePreferences=['club-updates'];setModules(a,[]);toggleSaved(a,'denver-juniors');
 persist(storage,{version:2,profiles:[a,b],active:b.id});const result=loadState(storage);assert.deepEqual(result.profiles[1],unchanged);assert.deepEqual(result.profiles[0].modules,[]);assert.deepEqual(result.profiles[0].mediaSourcePreferences,['club-updates']);assert.equal(result.active,'b');assert.equal(result.profiles[0].guardian,true);
});
test('legacy profiles migrate expressed choices without deriving recruiting from saved clubs, college records or notes',()=>{
 const p=cleanProfile({sport:'basketball',goal:'teams',interests:['camps'],saved:['club','college'],recruiting:{notes:'Old notes'},plans:[{id:'old',name:'Practice',start:'2026-12-01'}]});
 assert.deepEqual(p.modules,['teams','camps','schedules']);assert.ok(!p.modules.includes('recruiting'));assert.equal(p.recruiting.notes,'Old notes');
 const opted=cleanProfile({sport:'swimming',goal:'community',interests:['recruiting'],mediaEnabled:true,mediaSources:['du-news']});assert.deepEqual(opted.modules,['community','recruiting','media']);
 assert.deepEqual(cleanProfile({...opted,modules:[]}).modules,[]);assert.equal(cleanProfile({...opted,modules:[]}).mediaEnabled,false);
});
test('existing v2 storage migrates nondestructively and remains idempotent',()=>{
 const storage=memory(),raw={version:2,active:'legacy',profiles:[{id:'legacy',sport:'lacrosse',goal:'tryouts',interests:['community'],saved:['denver-elite'],mediaEnabled:false,recruiting:{notes:'Retain this'}}]};storage.setItem(STORAGE_KEY,JSON.stringify(raw));
 const migrated=loadState(storage);assert.deepEqual(migrated.profiles[0].modules,['teams','community']);assert.equal(migrated.profiles[0].recruiting.notes,'Retain this');assert.equal(storage.getItem(STORAGE_KEY),JSON.stringify(raw));persist(storage,migrated);assert.deepEqual(loadState(storage),migrated);
});
test('media is off by default and retained sources do not display without module opt-in',()=>{
 const p=profile();assert.deepEqual(p.modules,[]);assert.equal(p.mediaEnabled,false);assert.deepEqual(p.mediaSources,[]);
 const disabled=profile({modules:['teams'],mediaEnabled:true,mediaSources:['du-news','unknown']});assert.equal(disabled.mediaEnabled,false);assert.deepEqual(disabled.mediaSources,[]);assert.deepEqual(disabled.mediaSourcePreferences,['du-news']);setModules(disabled,['media']);assert.deepEqual(disabled.mediaSources,['du-news']);
});
test('workspace navigation starts empty and optional features are inert templates until selected',()=>{
 const html=myPathway();assert.match(html,/<nav id="workspace-nav"[^>]*><\/nav>/);assert.match(html,/<div id="workspace-modules"><\/div>/);
 for(const {id} of moduleDefinitions)assert.ok(html.includes('id="template-'+id+'"'));
 const outsideTemplates=html.replace(/<template[^>]*>[\s\S]*?<\/template>/g,'');assert.ok(!outsideTemplates.includes('href="#recruiting"'));assert.ok(!outsideTemplates.includes('id="recruiting-form"'));
 const form=builder();assert.equal((form.match(/name="workspace-module"/g)||[]).length,7);assert.ok(!/<input[^>]*name="workspace-module"[^>]*checked/.test(form));assert.ok(form.includes('name="interests"'));
});
test('workspace supports keyboard reorder and retains organization lookup without recruiting side effects',()=>{
 const app=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');assert.ok(app.includes('setModules(p,modules)'));assert.ok(app.includes("button.setAttribute('aria-label','Move '"));assert.ok(!app.includes('innerHTML'));
 assert.ok(app.includes('t.organizationId===r.id'));assert.ok(app.includes("modules.includes('recruiting')"));assert.ok(app.includes("if(modules.includes('schedules'))renderSchedule(p)"));
});
