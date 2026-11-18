// Brand/storage/navigation boundary. No SIEM rules or fixture copies live here.
const prefix='playrcmd.demo.v1.';
const backing=[];
for(const name of ['localStorage','sessionStorage']){
 let native;try{native=window[name];}catch{}
 const memory=new Map(),store={getItem:key=>native?native.getItem(prefix+key):(memory.get(String(key))??null),setItem:(key,value)=>native?native.setItem(prefix+key,String(value)):memory.set(String(key),String(value)),removeItem:key=>native?native.removeItem(prefix+key):memory.delete(String(key)),clear:()=>{if(native){for(let i=native.length-1;i>=0;i--){const key=native.key(i);if(key?.startsWith(prefix))native.removeItem(key);}}else memory.clear();}};
 backing.push(store);
 // The shared modules still request their original contracts; only their storage is scoped.
 Object.defineProperty(window,name,{configurable:true,get:()=>store});
}
function reset(){for(const store of backing)store.clear();location.assign('/demo?scenario=family');}
document.getElementById('pr-reset').onclick=reset;
function adaptLinks(){
 const eyebrow=document.getElementById('platform-eyebrow');
 if(eyebrow?.textContent.includes('MY AP'))eyebrow.textContent=eyebrow.textContent.replace('MY AP','PLAYRCMD');
 const subtitle=document.getElementById('platform-subtitle');
 if(subtitle?.textContent.includes('Check your AP.'))subtitle.textContent=subtitle.textContent.replace('Check your AP.','Check your PlayRcmd.');
 for(const a of document.querySelectorAll('a[href]')){
  const url=new URL(a.getAttribute('href'),location.origin);
  if(url.origin!==location.origin)continue;
  if(url.pathname==='/my-ap'||url.pathname==='/siem/platform'){url.pathname='/demo';if(!url.searchParams.has('scenario'))url.searchParams.set('scenario','family');a.setAttribute('href',url.pathname+url.search+url.hash);}
  else if(['/siem/setup','/build','/my-pathway'].includes(url.pathname)){a.setAttribute('href','/setup');if(url.pathname==='/build')a.textContent='Add fictional athlete →';if(url.pathname==='/my-pathway')a.textContent='Fictional setup tools →';}
  else if(url.pathname==='/locked-in-demo'){a.setAttribute('href','/integrations');a.textContent='Integration concepts →';}
 }
}
const setup=document.body.dataset.page==='siem';
try{
 if(setup)await import('/assets/siem.js');
 else{
  // The wrapper supports only the accepted family scenario and a fictional local sandbox.
  for(const option of document.querySelectorAll('#platform-scenario option')){
   if(!['family','local'].includes(option.value))option.remove();
   else if(option.value==='local')option.textContent='Fictional setup · this browser';
  }
  document.querySelector('.ap-kicker').textContent='PLAYRCMD / FAMILY COMMAND CENTER';
  await import('/assets/siem-platform.js');
  const resetButton=document.getElementById('platform-reset'),replacement=resetButton.cloneNode(true);
  replacement.onclick=reset;resetButton.replaceWith(replacement);
  document.getElementById('platform-content').dataset.startupState='ready';
 }
 adaptLinks();
 new MutationObserver(()=>adaptLinks()).observe(document.getElementById('main'),{childList:true,subtree:true});
}catch(error){
 console.error('PlayRcmd startup failed',error);
 const alert=document.createElement('p');alert.setAttribute('role','alert');alert.textContent='The demonstration could not start. Reload the page to try again.';document.getElementById('main').prepend(alert);
}
