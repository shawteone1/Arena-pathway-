// Operator-only verification of registry endpoints; never accepts browser URLs or enables sources.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {lookup} from 'node:dns/promises';
import {createHash} from 'node:crypto';
import {fetch,EnvHttpProxyAgent} from 'undici';
import {fetchFeed,publicAddress} from '../src/rss-feed.mjs';
const catalog=JSON.parse(await readFile(new URL('../data/rss-feed-catalog.json',import.meta.url)));
const dispatcher=new EnvHttpProxyAgent();
const results=[];
for(const source of catalog.sources){
 let evidence={id:source.id,url:source.feedUrl,checkedAt:new Date().toISOString()};
 try{const snapshot=await fetchFeed(source,{}, {request:async(url,options)=>{
  const addresses=await lookup(url.hostname,{all:true});if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw Error('Private feed address');
  const response=await fetch(url,{...options,dispatcher});evidence.httpStatus=response.status;evidence.contentType=response.headers.get('content-type');evidence.finalURL=url.href;
  // The production reader enforces limits before consuming this stream.
  const hash=createHash('sha256');let first='';let bytes=0;
  const stream=response.body?.pipeThrough(new TransformStream({transform(chunk,controller){hash.update(chunk);bytes+=chunk.length;if(!first)first=Buffer.from(chunk).toString('utf8').slice(0,120);controller.enqueue(chunk);},flush(){evidence.bytes=bytes;evidence.sha256=hash.digest('hex');evidence.firstBytes=first;}}));
  return {response:new Response(stream,{status:response.status,headers:response.headers}),close:async()=>{}};
 }});evidence={...evidence,status:'verified',items:snapshot.items.length};if(!snapshot.items.length)throw Error('No usable dated articles');
 }catch(error){evidence={...evidence,status:'blocked',reason:error.message};}
 results.push(evidence);console.log(source.name+': '+evidence.status+(evidence.reason?' ('+evidence.reason+')':' · '+evidence.items+' items'));
}
await dispatcher.close();await mkdir(new URL('../var/rss-validation/',import.meta.url),{recursive:true});await writeFile(new URL('../var/rss-validation/results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
