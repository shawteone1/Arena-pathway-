// Brand/storage/navigation boundary. No SIEM rules or fixture copies live here.
const scenario=new URLSearchParams(location.search).get('scenario')||'family';
const role=['coach','college'].includes(scenario)?scenario:'family';
const prefix='playrcmd.demo.v2.'+role+'.';
document.body.dataset.playrcmdRole=role;
const backing=[];
for(const name of ['localStorage','sessionStorage']){
 let native;try{native=window[name];}catch{}
 const memory=new Map(),store={getItem:key=>native?native.getItem(prefix+key):(memory.get(String(key))??null),setItem:(key,value)=>native?native.setItem(prefix+key,String(value)):memory.set(String(key),String(value)),removeItem:key=>native?native.removeItem(prefix+key):memory.delete(String(key)),clear:()=>{if(native){for(let i=native.length-1;i>=0;i--){const key=native.key(i);if(key?.startsWith(prefix))native.removeItem(key);}}else memory.clear();}};
 backing.push(store);
 // The shared modules still request their original contracts; only their storage is scoped.
 Object.defineProperty(window,name,{configurable:true,get:()=>store});
}
function reset(){for(const store of backing)store.clear();location.assign('/demo?scenario='+role);}
document.getElementById('pr-reset').onclick=reset;
function adaptLinks(){
 const eyebrow=document.getElementById('platform-eyebrow');
 if(eyebrow?.textContent.includes('MY AP'))eyebrow.textContent=eyebrow.textContent.replace('MY AP','PLAYRCMD');
 if(role!=='family'){
  const familyLink=document.querySelector('[data-section-link=family] .ap-mode-label');const label=role==='coach'?'My teams':'My context';if(familyLink&&familyLink.textContent!==label)familyLink.textContent=label;
  const panelHeading=document.querySelector('[data-section=family] .ap-panel-heading h2');if(panelHeading&&panelHeading.textContent==='My Family')panelHeading.textContent=label;
  for(const p of document.querySelectorAll('[data-section=family] p'))if(p.textContent==='These are fictional demonstration associations, not an authenticated family account. No recruiting profile is required.')p.textContent=role==='coach'?'Fictional coaching associations. Each team has its own authorized organization; no club administration account is connected.':'Fictional athlete context. Profile and recruiting creation are optional.';
  for(const p of document.querySelectorAll('.ap-feed p'))if(p.textContent==='Read from existing athlete plans. No copied events or provider sync.')p.textContent='Local fictional planning or file snapshots. No provider synchronization or booking.';
  const title=document.getElementById('platform-title');if(title?.textContent.includes('whole family week'))title.textContent='Calendar · Your commitments.';else if(title?.textContent.startsWith('My Family'))title.textContent=role==='coach'?'Your independently managed teams.':'Your athlete context.';
 }
 const subtitle=document.getElementById('platform-subtitle');
 if(subtitle?.textContent.includes('Check your AP.'))subtitle.textContent=subtitle.textContent.replace('Check your AP.','Check your PlayRcmd.');
 for(const a of document.querySelectorAll('a[href]')){
  const url=new URL(a.getAttribute('href'),location.origin);
  if(url.origin!==location.origin)continue;
  if(role!=='family'&&(url.pathname==='/siem/setup'||url.pathname==='/setup'||url.pathname==='/build'||url.pathname==='/my-pathway'||url.searchParams.get('scenario')==='local')){a.hidden=true;continue;}
  if(url.pathname==='/my-ap'||url.pathname==='/siem/platform'){url.pathname='/demo';if(!url.searchParams.has('scenario'))url.searchParams.set('scenario','family');a.setAttribute('href',url.pathname+url.search+url.hash);}
  else if(['/siem/setup','/build','/my-pathway'].includes(url.pathname)){a.setAttribute('href','/setup');if(url.pathname==='/build')a.textContent='Add fictional athlete →';if(url.pathname==='/my-pathway')a.textContent='Fictional setup tools →';}
  else if(url.pathname==='/locked-in-demo'){a.setAttribute('href','/integrations');a.textContent='Integration concepts →';}
 }
}
const setup=document.body.dataset.page==='siem';
try{
 if(setup)await import('/assets/siem.js');
 else{
  const {loadConfiguredRole:loadRole}=await import('/assets/playrcmd-onboarding.js');
  globalThis.siemDemoHost={loadScenario:kind=>['family','college','coach'].includes(kind)?loadRole(kind,localStorage):null};
  // Each role starts a separate document and storage scope; no cross-role controller state.
  document.getElementById('platform-scenario').addEventListener('change',event=>{event.stopImmediatePropagation();location.assign('/demo?scenario='+event.target.value);},{capture:true});
  for(const option of document.querySelectorAll('#platform-scenario option')){
   if(!['family','local','college','coach'].includes(option.value))option.remove();
   else if(option.value==='local')option.textContent='Fictional setup · this browser';
  }
  document.querySelector('.ap-kicker').textContent='PLAYRCMD / '+role.toUpperCase()+' COMMAND CENTER';
  await import('/assets/siem-platform.js');
  const resetButton=document.getElementById('platform-reset'),replacement=resetButton.cloneNode(true);
  replacement.onclick=reset;resetButton.replaceWith(replacement);
  if(scenario==='local')document.querySelector('.pr-tools-bar').hidden=true;
  else{const {installRoleTools}=await import('/playrcmd/role-tools.js');installRoleTools(role,localStorage);const {installOnboarding}=await import('/playrcmd/onboarding.js');installOnboarding(role,localStorage);}
  document.getElementById('platform-content').dataset.startupState='ready';
 }
 adaptLinks();
 new MutationObserver(()=>adaptLinks()).observe(document.getElementById('main'),{childList:true,subtree:true});
}catch(error){
 console.error('PlayRcmd startup failed',error);
 const alert=document.createElement('p');alert.setAttribute('role','alert');alert.textContent='The demonstration could not start. Reload the page to try again.';document.getElementById('main').prepend(alert);
}
