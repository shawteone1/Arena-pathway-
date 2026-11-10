// Keep module-load and initialization failures visible instead of leaving a blank dashboard.
const content=document.getElementById('platform-content');
content.dataset.startupState='loading';
import('./siem-platform.js').then(()=>{content.dataset.startupState='ready';}).catch(error=>{
 console.error('SIEM dashboard startup failed:',error);
 content.dataset.startupState='error';
 const panel=document.createElement('section');panel.className='ap-panel';panel.setAttribute('role','alert');
 const heading=document.createElement('h2');heading.textContent='The dashboard could not start.';
 const message=document.createElement('p');message.textContent='Reload this page. If the problem continues, confirm the server is running the complete review build and check the browser console for the loading error. Your saved family data has not been changed.';
 const reload=document.createElement('button');reload.type='button';reload.className='ap-control';reload.textContent='Reload dashboard';reload.addEventListener('click',()=>location.reload());
 panel.append(heading,message,reload);content.replaceChildren(panel);
});
