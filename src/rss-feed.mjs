import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {load} from 'cheerio';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
import {Agent, fetch} from 'undici';
import {readFile, writeFile, mkdir, rename} from 'node:fs/promises';
import {dirname} from 'node:path';

export const REFRESH_MS=15*60*1000, MAX_BYTES=2*1024*1024;
export const TOPICS=['professional','college','national','youth','recruiting','development','podcast'];
const array=v=>v==null?[]:Array.isArray(v)?v:[v];
const scalar=v=>typeof v==='object'?v?.['#text']??'':v??'';
const text=(v,max=400)=>{const doc=load(String(scalar(v)));doc('script,style,iframe,object').remove();return doc.text().replace(/\s+/g,' ').trim().slice(0,max);};
export function publicAddress(address){
 if(isIP(address)===4){const [a,b]=address.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&(b===168||b===0||b===2)||a===198&&(b===18||b===19||b===51)||a===203&&b===0||a===100&&b>=64&&b<=127);}
 return isIP(address)===6&&/^[23][0-9a-f]{3}:/i.test(address)&&!/^200[12]:|^2001:db8:/i.test(address);
}
export function safeFeedURL(value,host){
 const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443'||u.hostname!==host||isIP(u.hostname)||u.hostname.endsWith('.local')||!u.hostname.includes('.'))throw Error('Unsafe feed URL');return u;
}
export function articleURL(value){
 try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||isIP(u.hostname)||!u.hostname.includes('.')||/\.(local|localhost|internal)$/i.test(u.hostname))return null;u.hash='';for(const k of [...u.searchParams.keys()])if(/^(utm_.+|fbclid|gclid|mc_cid|mc_eid)$/i.test(k))u.searchParams.delete(k);u.searchParams.sort();return u.href;}catch{return null;}
}
export function normalizeFeed(xml,source,now=Date.now()){
 if(Buffer.byteLength(xml)>MAX_BYTES||/<!DOCTYPE|<!ENTITY/i.test(xml)||XMLValidator.validate(xml)!==true)throw Error('Invalid XML');
 const data=new XMLParser({ignoreAttributes:false,processEntities:true,trimValues:true}).parse(xml);
 const channel=data.rss?.channel,atom=data.feed;if(!channel&&!atom)throw Error('Not RSS or Atom');
 const items=[];for(const raw of array(channel?.item??atom?.entry)){
  const link=atom?array(raw.link).find(l=>!l['@_rel']||l['@_rel']==='alternate')?.['@_href']:scalar(raw.link);
  const url=articleURL(link),title=text(raw.title,240),published=Date.parse(scalar(raw.pubDate??raw.published??raw.updated??raw['dc:date']));
  if(!url||!title||!Number.isFinite(published)||published>now+5*60*1000)continue;
  const labels=array(raw.category).map(c=>text(c?.['@_term']??c,120).toLowerCase());
  // Only explicit category labels, or a single-purpose source's coverage, establish topics.
  const topics=TOPICS.filter(t=>labels.some(l=>({national:/national|olympic|international/,professional:/professional|\bpro\b|\bnba\b|\bnll\b/,college:/college|ncaa/,youth:/youth|high school|junior/,recruiting:/recruit/,development:/development|coaching|training/,podcast:/podcast/}[t]).test(l)));
  if(!topics.length&&source.coverage.length===1&&TOPICS.includes(source.coverage[0]))topics.push(source.coverage[0]);
  items.push({id:text(raw.guid??raw.id,500)||url,title,url,summary:text(raw.description??raw.summary??raw['content:encoded']??raw.content),author:text(raw['dc:creator']??raw.author?.name??raw.author,120)||null,publishedAt:new Date(published).toISOString(),publisher:source.name,sourceId:source.id,sport:source.sport,topics});
 }
 return deduplicate(items);
}
export function deduplicate(items){
 const urls=new Set(),ids=new Set();return [...items].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(i=>{const id=i.sourceId+':'+i.id;if(urls.has(i.url)||ids.has(id))return false;urls.add(i.url);ids.add(id);return true;}).slice(0,100);
}
export function enabled(source){return source.enabled===true&&source.verification?.status==='verified'&&source.rights?.status==='approved'&&!!source.rights?.evidence&&!!source.rights?.reviewedAt;}

// Pin the checked DNS result to the connection to prevent DNS rebinding.
async function checkedRequest(url,options){
 let abort;const aborted=new Promise((_,reject)=>{abort=()=>reject(options.signal.reason);if(options.signal.aborted)abort();else options.signal.addEventListener('abort',abort,{once:true});});
 let addresses;try{addresses=await Promise.race([lookup(url.hostname,{all:true}),aborted]);}finally{options.signal.removeEventListener('abort',abort);}if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw Error('Private feed address');
 const dispatcher=new Agent({connect:{lookup:(_host,opts,cb)=>opts.all?cb(null,addresses):cb(null,addresses[0].address,addresses[0].family)}});
 try{const response=await fetch(url,{...options,dispatcher});return {response,close:()=>dispatcher.close()};}catch(error){await dispatcher.close();throw error;}
}
export async function fetchFeed(source,previous={}, {request=checkedRequest,timeoutMs=10000,now=Date.now()}={}){
 const original=safeFeedURL(source.feedUrl,new URL(source.feedUrl).hostname),signal=AbortSignal.timeout(timeoutMs);
 const headers={Accept:'application/rss+xml, application/atom+xml, application/xml, text/xml','User-Agent':'ArenaPathwayRSS/1.0'};
 if(previous.etag)headers['If-None-Match']=previous.etag;if(previous.lastModified)headers['If-Modified-Since']=previous.lastModified;
 let url=original;
 for(let hop=0;hop<=3;hop++){
  const {response,close}=await request(url,{headers,redirect:'manual',signal});
  try{
   if([301,302,303,307,308].includes(response.status)){await response.body?.cancel();if(hop===3)throw Error('Too many redirects');url=safeFeedURL(new URL(response.headers.get('location'),url).href,original.hostname);continue;}
   if(response.status===304){if(!Array.isArray(previous.items))throw Error('304 without cached snapshot');return {...previous,lastSuccessAt:new Date(now).toISOString()};}
   if(response.status!==200)throw Error('HTTP '+response.status);
   if(!/^(application\/(rss\+xml|atom\+xml|xml)|text\/xml)(\s*;|$)/i.test(response.headers.get('content-type')||''))throw Error('Non-XML content type');
   if(Number(response.headers.get('content-length'))>MAX_BYTES)throw Error('Feed exceeds size limit');
   let size=0;const chunks=[];for await(const chunk of response.body){size+=chunk.length;if(size>MAX_BYTES)throw Error('Feed exceeds size limit');chunks.push(chunk);}
   const xml=Buffer.concat(chunks).toString('utf8');if(!/^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<(rss|feed)(?:\s|>)/i.test(xml.replace(/^\uFEFF/,'')))throw Error('Not an XML feed');
   return {items:normalizeFeed(xml,source,now),etag:response.headers.get('etag'),lastModified:response.headers.get('last-modified'),lastSuccessAt:new Date(now).toISOString()};
  }finally{await response.body?.cancel().catch(()=>{});await close();}
 }
}
export class FeedService{
 constructor(sources,{file,fetcher=fetchFeed,now=()=>Date.now(),refreshMs=REFRESH_MS}={}){this.sources=sources;this.file=file;this.fetcher=fetcher;this.now=now;this.refreshMs=refreshMs;this.cache={};this.pending=new Map();this.saving=Promise.resolve();this.ready=this.restore();}
 async restore(){if(this.file)try{const data=JSON.parse(await readFile(this.file,'utf8'));if(data.schemaVersion===1)this.cache=data.publishers??{};}catch{/* Missing cache starts cold. */}}
 async save(){if(!this.file)return;this.saving=this.saving.catch(()=>{}).then(async()=>{await mkdir(dirname(this.file),{recursive:true});await writeFile(this.file+'.tmp',JSON.stringify({schemaVersion:1,publishers:this.cache}));await rename(this.file+'.tmp',this.file);});await this.saving;}
 async refresh(source){await this.ready;if(!enabled(source))return;if(this.pending.has(source.id))return this.pending.get(source.id);const old=this.cache[source.id]??{};if(old.feedUrl===source.feedUrl&&this.now()-Date.parse(old.attemptedAt)<this.refreshMs)return;
 const work=(async()=>{let next={...old};if(old.feedUrl!==source.feedUrl)next={};try{next=await this.fetcher(source,next,{now:this.now()});next.error=null;}catch{next.error='Publisher temporarily unavailable';}this.cache[source.id]={...next,feedUrl:source.feedUrl,attemptedAt:new Date(this.now()).toISOString()};await this.save();})();this.pending.set(source.id,work);try{await work;}finally{this.pending.delete(source.id);}}
 async refreshAll(){await Promise.all(this.sources.filter(enabled).map(s=>this.refresh(s)));}
 start(){this.refreshAll().catch(console.error);this.timer=setInterval(()=>this.refreshAll().catch(console.error),this.refreshMs);this.timer.unref();}
 stop(){clearInterval(this.timer);}
 async read(sport,selected=[],topic=''){
  await this.ready;const sources=this.sources.filter(s=>s.sport===sport),chosen=sources.filter(s=>enabled(s)&&selected.includes(s.id));await Promise.all(chosen.map(s=>this.refresh(s)));
  const publishers=sources.map(s=>{const c=this.cache[s.id];return {id:s.id,name:s.name,sport:s.sport,coverage:s.coverage,enabled:enabled(s),status:!enabled(s)?'pending-review':!c?.lastSuccessAt?'unavailable':c.error||this.now()-Date.parse(c.lastSuccessAt)>this.refreshMs*2?'stale':'ready',lastSuccessAt:c?.lastSuccessAt??null,reason:!enabled(s)?s.rights?.status!=='approved'?'Publisher access review pending':'Endpoint verification pending':c?.error??null};});
  const items=deduplicate(chosen.flatMap(s=>this.cache[s.id]?.feedUrl===s.feedUrl?this.cache[s.id]?.items??[]:[]).filter(i=>i.sport===sport&&selected.includes(i.sourceId)&&(!topic||i.topics.includes(topic))));return {publishers,items,refreshAfterMs:this.refreshMs};
 }
}
