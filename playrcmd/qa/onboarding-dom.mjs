// Optional DOM wiring test, NOT browser/layout qualification. Install jsdom outside the app.
// PLAYRCMD_JSDOM_MODULE=/absolute/path/node_modules/jsdom/lib/api.js node playrcmd/qa/onboarding-dom.mjs
import {pathToFileURL} from 'node:url';
import {readFile,writeFile,unlink} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {JSDOM}=await import(pathToFileURL(process.env.PLAYRCMD_JSDOM_MODULE).href);
const model=await import('../../public/playrcmd-onboarding.js');
const original=await readFile(new URL('../public/onboarding.js',import.meta.url),'utf8');
const temporary=new URL('../public/.onboarding-dom-test.mjs',import.meta.url);
await writeFile(temporary,original.replace("'/assets/playrcmd-onboarding.js'",JSON.stringify(pathToFileURL(new URL('../../public/playrcmd-onboarding.js',import.meta.url).pathname).href)));
try{
 const {installOnboarding}=await import(temporary.href);
 for(const kind of ['family','college','coach']){
  const dom=new JSDOM('<!doctype html><html><head></head><body><section class="pr-tools-bar"><button data-tool="entry">Planner</button></section><button class="ap-tour-start">Existing tour</button></body></html>',{url:'https://review.invalid/demo?scenario='+kind});
  for(const name of ['window','document','history','location','Option','CustomEvent'])globalThis[name]=dom.window[name];globalThis.confirm=()=>true;
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false};
  const storage=dom.window.localStorage;let tour=0,planner=0;document.querySelector('.ap-tour-start').onclick=()=>tour++;document.querySelector('[data-tool=entry]').onclick=()=>planner++;
  const click=(scope,name)=>{const b=[...scope.querySelectorAll('button')].find(b=>b.textContent===name);assert.ok(b,name);b.click()};
  installOnboarding(kind,storage);const wizard=document.getElementById('pr-setup-dialog');assert.ok(wizard.open);
  click(wizard,'Skip setup');assert.equal(model.readSetup(storage,kind).status,'skipped');
  const panel=document.querySelector('.pr-onboarding-bar');click(panel,'Start Tour');assert.equal(tour,1);click(panel,'Edit My Setup');assert.ok(wizard.open);
  click(wizard,'Save & continue');assert.equal(model.readSetup(storage,kind).step,1);click(wizard,'Back');assert.equal(model.readSetup(storage,kind).step,0);click(wizard,'Skip this step');assert.equal(model.readSetup(storage,kind).step,1);
  const f=document.getElementById('pr-setup-person-form');const inputs=f.querySelectorAll('input[type=text]');inputs[0].value='Fictional DOM association';inputs[1].value='Fictional DOM team';const minor=f.querySelector('input[type=checkbox]');if(minor)minor.checked=false;
  f.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));assert.equal(model.readSetup(storage,kind).people.length,1);
  click(wizard,'Save & continue');click(wizard,'Add calendars / import schedules / recurring activities');assert.equal(planner,1);assert.ok(!wizard.open);click(panel,'Edit My Setup');assert.equal(model.readSetup(storage,kind).step,2);
  click(wizard,'Save & continue');click(wizard,'Save & continue');click(wizard,'Save setup & open command center');assert.equal(model.readSetup(storage,kind).status,'saved');
  click(panel,'Pull from Soccer Center');const transfer=document.getElementById('pr-transfer-dialog');assert.ok(transfer.open);const form=document.getElementById('pr-transfer-form');
  // The first offered field is displayName; choose it explicitly, then approve the conflict separately.
  form.querySelector('fieldset input[type=checkbox]').checked=true;form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  const review=document.getElementById('pr-transfer-review');const choice=review.querySelector('select');if(choice){choice.value='replace';choice.dispatchEvent(new dom.window.Event('change'));}
  for(const input of review.querySelectorAll('input[type=checkbox]'))input.checked=true;click(review,'Approve simulated transfer');assert.match(transfer.textContent,/No external system changed/);assert.equal(model.exchangeStatus(storage,kind).links.length,1);
  click(transfer,'Undo last simulated transfer');assert.equal(model.exchangeStatus(storage,kind).links.length,0);click(transfer,'Close');assert.ok(!transfer.open);
  click(panel,'Push to Arena Pathway');const push=document.getElementById('pr-transfer-dialog'),pf=document.getElementById('pr-transfer-form');pf.querySelector('fieldset input[type=checkbox]').checked=true;pf.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  for(const input of document.getElementById('pr-transfer-review').querySelectorAll('input[type=checkbox]'))input.checked=true;click(document.getElementById('pr-transfer-review'),'Approve simulated transfer');assert.ok(model.destinationExamples(storage,kind,'arena-pathway').some(p=>p.subjectId),push.textContent.slice(-1200));
  pf.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));assert.match(push.textContent,/Duplicate prevented/);click(push,'Close');
  click(panel,'Push to Soccer Center');const link=document.getElementById('pr-transfer-dialog'),lf=document.getElementById('pr-transfer-form');const mode=lf.querySelectorAll('select')[1];mode.value='link';mode.dispatchEvent(new dom.window.Event('change'));lf.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  for(const input of document.getElementById('pr-transfer-review').querySelectorAll('input[type=checkbox]'))input.checked=true;click(document.getElementById('pr-transfer-review'),'Approve simulated transfer');
  mode.value='update';mode.dispatchEvent(new dom.window.Event('change'));lf.querySelector('fieldset input[type=checkbox]').checked=true;lf.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));const conflict=document.getElementById('pr-transfer-review').querySelector('select');if(conflict){conflict.value='replace';conflict.dispatchEvent(new dom.window.Event('change'));}
  for(const input of document.getElementById('pr-transfer-review').querySelectorAll('input[type=checkbox]'))input.checked=true;click(document.getElementById('pr-transfer-review'),'Approve simulated transfer');assert.match(link.textContent,/No external system changed/);click(link,'Close');
  // Returning user does not get the first-launch modal again; edit still opens it.
  panel.remove();wizard.remove();transfer.remove();installOnboarding(kind,storage);assert.ok(!document.getElementById('pr-setup-dialog').open);
  dom.window.close();console.log('PASS DOM wiring:',kind,'first launch, skip/edit/save, planner hook, tour hook, selective pull/approval/undo, create/link/update/duplicate push, returning user.');
 }
}finally{await unlink(temporary)}
