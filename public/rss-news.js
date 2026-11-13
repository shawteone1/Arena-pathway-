// Public news only. Subscriptions stay on the existing athlete record.
export const TOPICS=[['','All news'],['professional','Professional'],['college','College'],['national','National / Olympic'],['youth','Youth'],['recruiting','Recruiting'],['development','Development'],['podcast','Podcast']];
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const sportNames={basketball:'Basketball',volleyball:'Volleyball',lacrosse:'Lacrosse',swimming:'Swimming'};
export function espnDestination(sport){
 if(!sportNames[sport])return null;
 return sport==='basketball'
  ?{url:'https://www.espn.com/nba/',label:'ESPN Basketball',kind:'News destination',collegeURL:'https://www.espn.com/mens-college-basketball/'}
  :{url:'https://www.espn.com/search/_/q/'+sport,label:'ESPN '+sportNames[sport],kind:'Search on ESPN · External link'};
}
export function requestSources(data,profile,selection=profile.contentSubscriptions||[]){
 const allowed=new Set((data.publishers||[]).filter(p=>p.sport===profile.sport).map(p=>p.id));
 return [...selection].filter(id=>allowed.has(id));
}
export function selectNews(data,profile,publisher='',topic=''){
 const selected=new Set(profile.contentSubscriptions||[]),allowed=new Set((data.publishers||[]).filter(p=>p.enabled&&p.sport===profile.sport&&selected.has(p.id)).map(p=>p.id));
 const seen=new Set();return (data.items||[]).filter(i=>i.sport===profile.sport&&allowed.has(i.sourceId)&&Number.isFinite(Date.parse(i.publishedAt))&&(!publisher||publisher===i.sourceId)&&(!topic||i.topics?.includes(topic))).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(i=>{if(seen.has(i.url))return false;seen.add(i.url);return true;});
}
const articleLink=(title,url,cls='news-action')=>{const a=node('a',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className=cls;return a;};
const dateLabel=value=>new Date(value).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZone:'UTC',timeZoneName:'short'});
export function mountRSSNews(target,profile,{update,notify}){
 target.querySelector('[data-rss-news]')?.remove();target.querySelector('[data-news-destination]')?.remove();
 const destination=espnDestination(profile.sport);
 if(destination){
  const hero=node('aside');hero.dataset.newsDestination='';hero.className='news-destination';hero.setAttribute('aria-label',destination.label);
  const copy=node('div');const eyebrow=node('span','AROUND THE SPORT');eyebrow.className='news-eyebrow';copy.append(eyebrow,node('h3',destination.label),node('p',destination.kind));
  const actions=node('div');actions.className='news-destination-actions';actions.append(articleLink((profile.sport==='basketball'?'Open ESPN Basketball':'Search ESPN '+sportNames[profile.sport]),destination.url,'news-action espn-action'));
  if(destination.collegeURL)actions.append(articleLink('College basketball',destination.collegeURL,'news-action espn-college'));
  hero.append(copy,actions);target.prepend(hero);
 }
 const root=node('section');root.dataset.rssNews='';root.className='rss-news editorial-library';target.append(root);
 const heading=node('div');heading.className='editorial-heading';heading.append(node('h3','Publisher updates'));
 const manage=node('button','Choose publishers');manage.type='button';manage.className='news-action';
 const refresh=node('button','Refresh news');refresh.type='button';refresh.className='news-action news-action-muted';
 const tools=node('div');tools.className='editorial-tools';tools.append(manage,refresh);heading.append(tools);
 const status=node('p','Loading publishers…');status.className='rss-status';status.setAttribute('role','status');
 const controls=node('div');controls.className='rss-controls';
 const publisher=node('select');publisher.setAttribute('aria-label','RSS publisher');
 const topics=node('select');topics.setAttribute('aria-label','News category');
 for(const [value,label] of TOPICS)topics.add(new Option(label,value));
 for(const [label,input] of [['Publisher',publisher],['Category',topics]]){const l=node('label',label);l.append(input);controls.append(l);}
 const following=node('div');following.className='rss-following';following.setAttribute('aria-label','Followed publishers');
 const list=node('div');list.className='editorial-grid rss-items';list.setAttribute('aria-live','polite');
 const choices=node('details');choices.className='source-manager';choices.append(node('summary','Choose news publishers'));
 root.append(heading,status,controls,following,list,choices);
 let selected=new Set(profile.contentSubscriptions||[]),data={publishers:[],items:[]},catalogLoaded=false,generation=0,timer;
 const openChoices=()=>{choices.open=true;choices.querySelector('summary').focus();choices.scrollIntoView({block:'nearest'});};manage.addEventListener('click',openChoices);
 function setSelection(p,checked){
  if(!root.isConnected)return;
  if(update(athlete=>{const saved=new Set(athlete.contentSubscriptions||[]);if(checked)saved.add(p.id);else saved.delete(p.id);athlete.contentSubscriptions=[...saved];})){
   if(checked)selected.add(p.id);else selected.delete(p.id);
   drawChoices();draw();notify(checked?'Publisher followed for this athlete.':'Publisher removed for this athlete.');load();
  }else drawChoices();
 }
 function draw(){
  const approved=data.publishers.filter(p=>p.enabled),followed=approved.filter(p=>selected.has(p.id));controls.hidden=!approved.length;
  const old=publisher.value;publisher.replaceChildren(new Option('All selected publishers',''));for(const p of followed)publisher.add(new Option(p.name,p.id));if([...publisher.options].some(o=>o.value===old))publisher.value=old;
  following.replaceChildren();for(const p of followed){const remove=node('button',p.name+' ×');remove.type='button';remove.setAttribute('aria-label','Unfollow '+p.name);remove.addEventListener('click',()=>setSelection(p,false));following.append(remove);}
  const items=selectNews(data,{...profile,contentSubscriptions:[...selected]},publisher.value,topics.value);list.replaceChildren();
  for(const item of items){
   const card=node('article');card.className='record editorial-card';const body=node('div');body.className='editorial-body';const badge=node('span',item.publisher);badge.className='publisher-label';
   const h=node('h4');h.append(articleLink(item.title,item.url,'news-headline'));const time=node('time',dateLabel(item.publishedAt));time.dateTime=item.publishedAt;
   body.append(badge,h,time);if(item.author)body.append(node('small','By '+item.author));if(item.summary)body.append(node('p',item.summary));body.append(articleLink('Read article',item.url));
   const p=data.publishers.find(p=>p.id===item.sourceId);if(p?.lastSuccessAt){const stamp=node('p',(p.status==='stale'?'Updates delayed · Last updated ':'Updated ')+dateLabel(p.lastSuccessAt));stamp.className='rss-freshness';body.append(stamp);}
   card.append(body);list.append(card);
  }
  if(!items.length&&approved.length){
   const empty=node('div');empty.className='editorial-empty';empty.append(node('h4',followed.length?'No stories in this view':'Make it your feed'),node('p',followed.length?'Try another category or publisher.':'Choose the publishers you want to follow.'));
   if(!followed.length){const choose=node('button','Choose publishers');choose.type='button';choose.className='news-action';choose.addEventListener('click',openChoices);empty.append(choose);}list.append(empty);
  }
 }
 function drawChoices(){
  const activeId=document.activeElement?.dataset.rssSource,pendingOpen=choices.querySelector('[data-pending-publishers]')?.open;
  choices.querySelectorAll(':scope>label,:scope>details,:scope>p').forEach(n=>n.remove());
  const approved=data.publishers.filter(p=>p.enabled),pending=data.publishers.filter(p=>!p.enabled);
  if(!approved.length)choices.append(node('p','RSS publishers will be available after access review. Your saved choices stay intact.'));
  const pendingPanel=node('details');pendingPanel.dataset.pendingPublishers='';pendingPanel.open=!!pendingOpen;pendingPanel.append(node('summary','Awaiting approval · '+pending.length));
  for(const p of data.publishers){
   const label=node('label');label.className='check';const cb=node('input');cb.type='checkbox';cb.dataset.rssSource=p.id;cb.disabled=!p.enabled;cb.checked=selected.has(p.id);
   const copy=node('span');copy.append(node('strong',p.name),node('small',p.enabled?(p.status==='stale'?'Updates delayed':p.status==='unavailable'?'Publisher temporarily unavailable':'Automatic updates'):'Access review pending'));
   label.append(cb,copy);(p.enabled?choices:pendingPanel).append(label);cb.addEventListener('change',()=>setSelection(p,cb.checked));
  }
  if(pending.length)choices.append(pendingPanel);
  if(activeId)[...choices.querySelectorAll('[data-rss-source]')].find(cb=>cb.dataset.rssSource===activeId)?.focus();
 }
 async function read(ids){const query=new URLSearchParams({sport:profile.sport,sources:ids.join(',')});const response=await fetch('/api/rss-news?'+query,{cache:'no-store'});if(!response.ok)throw Error('News unavailable');return response.json();}
 async function load(){
  clearTimeout(timer);const current=++generation;if(!root.isConnected)return;root.setAttribute('aria-busy','true');refresh.disabled=true;refresh.textContent='Refreshing…';
  try{
   // Read the current catalog first. Retired preferences remain saved but never enter an API request.
   let result=data;if(!catalogLoaded)result=await read([]);
   if(current!==generation||!root.isConnected)return;
   const ids=requestSources(result,profile,selected);if(ids.length||catalogLoaded)result=await read(ids);
   if(current!==generation||!root.isConnected)return;
   data=result;catalogLoaded=true;
   const approved=data.publishers.filter(p=>p.enabled),selectedPublishers=approved.filter(p=>selected.has(p.id)),stale=selectedPublishers.some(p=>['stale','unavailable'].includes(p.status));
   status.textContent=approved.length?(stale?'Some updates are delayed. Last available stories are shown.':'Automatic updates every 15 minutes.'):'More publishers are awaiting access review. Explore ESPN or your reviewed articles.';
   drawChoices();draw();
  }catch{
   if(current!==generation||!root.isConnected)return;status.textContent='News updates unavailable. Your selections are saved. Try Refresh news.';draw();
  }finally{
   if(current===generation&&root.isConnected){root.setAttribute('aria-busy','false');refresh.disabled=false;refresh.textContent='Refresh news';timer=setTimeout(load,15*60*1000);}
  }
 }
 publisher.addEventListener('change',draw);topics.addEventListener('change',draw);refresh.addEventListener('click',load);load();
 const observer=new MutationObserver(()=>{if(!root.isConnected){clearTimeout(timer);generation++;observer.disconnect();}});observer.observe(document.body,{childList:true,subtree:true});
}
