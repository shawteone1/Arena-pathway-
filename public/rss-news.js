// Public news only. All subscriptions remain on the existing athlete record.
export const TOPICS=[['','All news'],['professional','Professional'],['college','College'],['national','National / Olympic'],['youth','Youth'],['recruiting','Recruiting'],['development','Development'],['podcast','Podcast']];
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
export function selectNews(data,profile,publisher='',topic=''){
 const selected=new Set(profile.contentSubscriptions||[]),allowed=new Set((data.publishers||[]).filter(p=>p.enabled&&p.sport===profile.sport&&selected.has(p.id)).map(p=>p.id));
 const seen=new Set();return (data.items||[]).filter(i=>i.sport===profile.sport&&allowed.has(i.sourceId)&&(!publisher||publisher===i.sourceId)&&(!topic||i.topics?.includes(topic))).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(i=>{if(seen.has(i.url))return false;seen.add(i.url);return true;});
}
export function mountRSSNews(target,profile,{update,notify}){
 target.querySelector('[data-rss-news]')?.remove();const root=node('section');root.dataset.rssNews='';root.className='rss-news editorial-library';target.append(root);
 const heading=node('div');heading.className='editorial-heading';heading.append(node('h3','Publisher news'));
 const refresh=node('button','Refresh news');refresh.type='button';refresh.className='secondary';heading.append(refresh);
 const status=node('p','Loading publishers…');status.setAttribute('role','status');
 const controls=node('div');controls.className='rss-controls';
 const publisher=node('select');publisher.setAttribute('aria-label','RSS publisher');
 const topics=node('select');topics.setAttribute('aria-label','News category');for(const [value,label] of TOPICS)topics.add(new Option(label,value));
 for(const [label,input] of [['Publisher',publisher],['Category',topics]]){const l=node('label',label);l.append(input);controls.append(l);}
 const list=node('div');list.className='editorial-grid rss-items';list.setAttribute('aria-live','polite');
 const choices=node('details');choices.className='source-manager';choices.append(node('summary','Choose news publishers'));
 root.append(heading,status,controls,list,choices);
 let selected=new Set(profile.contentSubscriptions||[]),data={publishers:[],items:[]},generation=0,timer;
 function draw(){
  const old=publisher.value;publisher.replaceChildren(new Option('All selected publishers',''));for(const p of data.publishers.filter(p=>p.enabled&&selected.has(p.id)))publisher.add(new Option(p.name,p.id));if([...publisher.options].some(o=>o.value===old))publisher.value=old;
  const items=selectNews(data,{...profile,contentSubscriptions:[...selected]},publisher.value,topics.value);list.replaceChildren();
  for(const item of items){const card=node('article');card.className='record editorial-card';const body=node('div');body.className='editorial-body';const badge=node('span',item.publisher);badge.className='publisher-label';const h=node('h4'),link=node('a',item.title);link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';h.append(link);const time=node('time',new Date(item.publishedAt).toLocaleString());time.dateTime=item.publishedAt;body.append(badge,h,time);if(item.author)body.append(node('small','By '+item.author));if(item.summary)body.append(node('p',item.summary));const visit=node('a','Read original article');visit.href=item.url;visit.target='_blank';visit.rel='noopener noreferrer';visit.className='rss-read';body.append(visit);const p=data.publishers.find(p=>p.id===item.sourceId);if(p?.lastSuccessAt){const stamp=node('p',(p.status==='stale'?'Updates delayed · Last updated ':'Updated ')+new Date(p.lastSuccessAt).toLocaleString());stamp.className='rss-freshness';body.append(stamp);}card.append(body);list.append(card);}
  if(!items.length){const empty=node('div');empty.className='editorial-empty';empty.append(node('h4',selected.size?'No matching publisher news':'Choose your publishers'),node('p','Follow publishers below. Reviewed articles above remain available.'));list.append(empty);}
 }
 function drawChoices(){choices.querySelectorAll('label').forEach(n=>n.remove());for(const p of data.publishers){const label=node('label');label.className='check';const cb=node('input');cb.type='checkbox';cb.dataset.rssSource=p.id;cb.disabled=!p.enabled;cb.checked=selected.has(p.id);const copy=node('span');copy.append(node('strong',p.name),node('small',p.enabled?(p.status==='stale'?'Updates delayed':'Refreshes automatically'):(p.reason||'Publisher review pending')));label.append(cb,copy);choices.append(label);cb.addEventListener('change',()=>{const next=new Set(selected);if(cb.checked)next.add(p.id);else next.delete(p.id);if(update(athlete=>{const saved=new Set(athlete.contentSubscriptions||[]);if(cb.checked)saved.add(p.id);else saved.delete(p.id);athlete.contentSubscriptions=[...saved];})){selected=next;draw();notify('Source choice saved for this athlete.');load();}else cb.checked=selected.has(p.id);});}}
 async function load(){
  clearTimeout(timer);const current=++generation;if(!root.isConnected)return;root.setAttribute('aria-busy','true');refresh.disabled=true;
  const query=new URLSearchParams({sport:profile.sport,sources:[...selected].filter(id=>id.startsWith(profile.sport+':rss:')).join(',')});
  try{const response=await fetch('/api/rss-news?'+query,{cache:'no-store'});if(!response.ok)throw Error('News unavailable');const result=await response.json();if(current!==generation||!root.isConnected)return;data=result;status.textContent=data.publishers.some(p=>p.enabled)?'Only publishers you follow appear here. Updates every 15 minutes.':'New publishers are awaiting access review. Nothing is followed automatically.';drawChoices();draw();}
  catch{if(current!==generation||!root.isConnected)return;status.textContent='News updates unavailable. Your selections are saved. Try Refresh news.';draw();}
  finally{if(current===generation&&root.isConnected){root.setAttribute('aria-busy','false');refresh.disabled=false;timer=setTimeout(load,15*60*1000);}}
 }
 publisher.addEventListener('change',draw);topics.addEventListener('change',draw);refresh.addEventListener('click',load);load();
 // Stop polling promptly when switching athletes or rerendering the workspace.
 const observer=new MutationObserver(()=>{if(!root.isConnected){clearTimeout(timer);generation++;observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});
}
