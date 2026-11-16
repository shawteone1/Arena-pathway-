// Presentation adapter over the preserved local SIEM setup/domain; no new store.
import {loadState} from './state.js';
import {markAthlete} from './siem-guidance.js';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
export function installFamilySetup(){
 const root=document.querySelector('.siem-setup');if(!root)return;
 root.querySelector('h1').nextElementSibling.textContent='Add your family and keep athlete schedules linked. Recruiting stays optional.';
 const nav=node('nav',undefined,'family-setup-steps');nav.setAttribute('aria-label','Family setup steps');
 for(const [label,id] of [['1 · My athletes','overview'],['2 · Parents','family-parents'],['3 · Family calendar','family-finish']]){const a=node('a',label);a.href='#'+id;nav.append(a);}root.querySelector('h1').after(nav);
 const parent=root.querySelector('#parent-add');const group=node('section');group.id='family-parents';group.append(node('h3','Parents & guardians'));parent.before(group);group.append(parent);
 for(const a of root.querySelectorAll('a[href="/my-ap?section=family"]'))a.href='/my-ap?scenario=local&section=family';
 const finish=node('section',undefined,'section compact family-setup-finish');finish.id='family-finish';finish.append(node('p','YOUR FAMILY, CONNECTED','eyebrow red'),node('h2','Your next stop: the family calendar.'),node('p','Existing athlete schedules appear through the same athlete and event references. Your family stays separate from the fictional Rivera tour.'));
 for(const [text,href,cls] of [['Continue to my family calendar','/my-ap?scenario=local&section=calendar','button'],['Review my family','/my-ap?scenario=local&section=family','text-link']]){const a=node('a',text,cls);a.href=href;finish.append(a);}root.querySelector('.siem-local-tools').before(finish);
 const people=root.querySelector('#siem-people');const overview=root.querySelector('#overview');overview.querySelector(':scope>p').textContent='Your existing athlete profiles are already linked. Add only the family members you need.';const advanced=root.querySelector('.siem-local-tools');for(const id of ['siem-stats','siem-filters'])advanced.append(root.querySelector('#'+id));
 function enhance(){let profiles=[],legacy=[];try{profiles=loadState(localStorage).profiles;legacy=(JSON.parse(localStorage.getItem('arenaPathway.siem.v1')||'null')?.athletes||[]).filter(a=>a.type==='parent'||a.origin==='siem');}catch{return;}
  // Same identity/order as the preserved SIEM render; also verify displayed name.
  [...profiles.map(p=>({...p,name:p.nickname||p.sport+' athlete'})),...legacy].forEach((p,index)=>{const card=people.children[index];if(!card||card.dataset.profileId||card.querySelector('h3')?.textContent!==p.name)return;card.dataset.profileId=p.id;if(p.type!=='parent')markAthlete(card,p.id);const athlete=profiles.find(a=>a.id===p.id);if(!athlete)return;const count=card.querySelector('h3')?.nextElementSibling;if(count?.tagName==='P')count.textContent='Schedule linked · view athlete calendar';if(athlete.clubTeam)card.append(node('p',athlete.clubTeam));for(const [text,hash] of [['View athlete',''],['Athlete schedule','#schedules']]){const a=node('a',text,'text-link');a.href='/my-pathway?athlete='+encodeURIComponent(p.id)+hash;card.append(a);}});
 }
 enhance();new MutationObserver(enhance).observe(people,{childList:true});
}
