// Reviewed outbound resources, never a live provider feed. Opt-in uses existing athlete identity.
import {safeURL} from './siem-model.js';
export function reviewedSources(review,sport,category,{now=new Date()}={}){
 return (review.schemaVersion===1&&Array.isArray(review.sources)?review.sources:[]).filter(s=>s.sport===sport&&s.category===category&&s.decision==='approved'&&Array.isArray(s.items)&&s.items.length&&Date.parse(s.validUntil)>=now&&Date.parse(s.checkedAt)<=now&&s.items.every(i=>i.free===true&&i.youthSuitable===true&&!!safeURL(i.url)));
}
export function selectedContent(review,profile,category,sourceId='',options={}){
 return reviewedSources(review,profile.sport,category,options).filter(s=>(profile.contentSubscriptions||[]).includes(s.id)&&(!sourceId||s.id===sourceId)).flatMap(s=>s.items.map(item=>({...item,sourceId:s.id,sourceName:s.name,checkedAt:s.checkedAt})));
}
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const detailState=new Set();
let request;
export async function renderContentLibraries(profile,{update,notify}){
 const targets=Object.fromEntries(['my-feed','camps'].map(id=>[id,document.getElementById(id)]));
 const review=await(request??=(fetch('/api/reviewed-content').then(r=>{if(!r.ok)throw Error('Reviewed content unavailable');return r.json();})));
 for(const [category,targetId] of [['news','my-feed'],['development','camps']]){
  const target=targets[targetId];if(!target?.isConnected)continue;
  target.querySelector('[data-content-library]')?.remove();
  const root=node('section');root.dataset.contentLibrary=category;root.className='reviewed-content';
  root.append(node('h3',category==='news'?'My Feed · your selected publishers':'Development · reviewed learning resources'),node('p','Reviewed links, not a live feed. Nothing is followed automatically. Only the specific public items reviewed below are approved; other content or courses may require payment.'));
  const available=reviewedSources(review,profile.sport,category),availableIds=new Set(available.map(s=>s.id)),all=(review.sources||[]).filter(s=>s.sport===profile.sport&&s.category===category);
  const choices=node('details');choices.className='panel';choices.id='content-choices-'+category;const key=profile.id+':'+category;choices.open=detailState.has(key);choices.addEventListener('toggle',()=>{if(!choices.isConnected)return;if(choices.open)detailState.add(key);else detailState.delete(key);});choices.append(node('summary','Choose sources · '+available.length+' reviewed / '+all.length+' candidates'));
  const selected=new Set(profile.contentSubscriptions||[]);
  for(const source of all){const l=node('label'),cb=node('input'),text=node('span');l.className='check';cb.type='checkbox';cb.dataset.contentSource=source.id;cb.checked=selected.has(source.id)&&availableIds.has(source.id);cb.disabled=!availableIds.has(source.id);text.append(node('strong',source.name),node('small',cb.disabled?'Inactive · '+(source.decision==='approved'?'Review expired; pending recheck.':source.reason||'Not verified.'):'Reviewed public items · '+source.items.length+' available · checked '+source.checkedAt.slice(0,10)));l.append(cb,text);choices.append(l);cb.addEventListener('change',()=>{const next=new Set(selected);if(cb.checked)next.add(source.id);else next.delete(source.id);if(update(p=>p.contentSubscriptions=[...next])){selected.clear();for(const id of next)selected.add(id);draw();notify('Source choice saved for this athlete.');}else cb.checked=selected.has(source.id);});}
  const label=node('label','Filter selected sources'),filter=node('select');filter.setAttribute('aria-label',category==='news'?'My Feed source':'Development source');label.append(filter);root.append(choices,label);
  const list=node('div');list.className='content-items records';list.setAttribute('aria-live','polite');root.append(list);
  function draw(){const previous=filter.value;filter.replaceChildren(new Option('All selected sources',''));for(const s of available.filter(s=>selected.has(s.id)))filter.add(new Option(s.name,s.id));if([...filter.options].some(o=>o.value===previous))filter.value=previous;
   const items=selectedContent(review,{...profile,contentSubscriptions:[...selected]},category,filter.value);list.replaceChildren();
   for(const item of items){const card=node('article');card.className='record';card.dataset.contentSource=item.sourceId;card.append(node('span',item.format==='guide'?'Instructional guide':'Sports news'),node('h4',item.title),node('p',item.summary),node('p',item.sourceName+' · public item reviewed '+item.checkedAt.slice(0,10)));const a=node('a',item.format==='guide'?'Read the free guide ↗':'Read at source ↗');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);list.append(card);}
   if(!items.length)list.append(node('p',available.length?'Open Choose sources to follow reviewed items for this athlete. Unverified sources remain inactive.':'No individually approved free items for this sport yet. Source audit outcomes are listed above; existing camps remain available.'));
  }
  filter.addEventListener('change',draw);draw();target.append(root);
 }
}
