import robotsParser from 'robots-parser';
import {fetch,EnvHttpProxyAgent} from 'undici';
import {isIP} from 'node:net';
import {createHash} from 'node:crypto';
export const USER_AGENT='ArenaPathwayResearchBot/1.0';
export class SourceBlocked extends Error{constructor(code,message,url){super(message);this.code=code;this.url=url;}}
export function publicURL(input,allowedHosts){const u=new URL(input);if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443'||isIP(u.hostname)||!allowedHosts.includes(u.hostname))throw new SourceBlocked('OUT_OF_SCOPE','Only explicitly registered public HTTPS hosts may be accessed',input);if(/(?:roster|athlete-profile|swimmer-profile|login|signin|register|checkout|account|\/athletes\/)/i.test(u.pathname))throw new SourceBlocked('PRIVACY_PATH','Player/registration/private paths are excluded',input);return u;}
export class PublicSourceClient{
 constructor({transport,clock=()=>Date.now(),wait=ms=>new Promise(r=>setTimeout(r,ms)),maxBytes=3000000,rateGate=null}={}){this.dispatcher=transport?null:new EnvHttpProxyAgent();this.transport=transport||((url,opts)=>fetch(url,{...opts,dispatcher:this.dispatcher}));this.clock=clock;this.wait=wait;this.maxBytes=maxBytes;this.rateGate=rateGate;this.robots=new Map();this.lastRequest=new Map();}
 async request(url,source,headers={}){publicURL(url,source.allowedHosts);const origin=new URL(url).origin,spacing=Math.max(1000,source.minIntervalMs||2000);const remaining=this.rateGate?this.rateGate(origin,spacing):spacing-(this.clock()-(this.lastRequest.get(origin)??-Infinity));if(remaining>60000)throw new SourceBlocked('RATE_WINDOW','Host refresh is deferred; do not retry yet',url);if(remaining>0)await this.wait(remaining);this.lastRequest.set(origin,this.clock());let r;try{r=await this.transport(url,{headers:{'User-Agent':USER_AGENT,'Accept':'text/html,application/pdf,application/json;q=0.8',...headers},redirect:'manual',signal:AbortSignal.timeout(20000)});}catch(e){throw new SourceBlocked('NETWORK_ERROR',e.message,url);}return r;}
 async body(r,url){if(Number(r.headers.get('content-length'))>this.maxBytes){await r.body?.cancel();throw new SourceBlocked('TOO_LARGE','Source exceeds configured limit',url);}let size=0,chunks=[];for await(const chunk of r.body){size+=chunk.length;if(size>this.maxBytes)throw new SourceBlocked('TOO_LARGE','Source exceeds configured limit',url);chunks.push(Buffer.from(chunk));}return Buffer.concat(chunks);}
 async rules(url,source){const origin=new URL(url).origin;if(this.robots.has(origin))return this.robots.get(origin);const robotsURL=origin+'/robots.txt';const r=await this.request(robotsURL,source);let text='';if(r.status===404||r.status===410)text='User-agent: *\nAllow: /';else if(r.status===200)text=(await this.body(r,robotsURL)).toString('utf8');else {if([429,503].includes(r.status)){const retry=r.headers.get('retry-after'),until=retry&&/^\d+$/.test(retry)?this.clock()+Number(retry)*1000:Date.parse(retry||'')||this.clock()+3600000;this.rateGate?.defer?.(origin,until);this.lastRequest.set(origin,until);}await r.body?.cancel();throw new SourceBlocked('ROBOTS_UNAVAILABLE',`Robots could not be verified (HTTP ${r.status})`,robotsURL);}const rules=robotsParser(robotsURL,text);this.robots.set(origin,rules);return rules;}
 async get(input,source,{etag,lastModified}={}){
  if(source.accessPolicy?.decision!=='allowed')throw new SourceBlocked('TERMS_REVIEW','Source access/terms review is pending',input);
  let url=input;
  for(let redirects=0;redirects<5;redirects++){
   publicURL(url,source.allowedHosts);const rules=await this.rules(url,source);if(rules.isAllowed(url,USER_AGENT)===false)throw new SourceBlocked('ROBOTS_DENIED','Robots directives prohibit this path',url);
   const delay=rules.getCrawlDelay(USER_AGENT);if(delay>60)throw new SourceBlocked('CRAWL_DELAY','Source requires a longer scheduling interval',url);
   const r=await this.request(url,{...source,minIntervalMs:Math.max(source.minIntervalMs||0,(delay||0)*1000)},{...(etag?{'If-None-Match':etag}:{}),...(lastModified?{'If-Modified-Since':lastModified}:{})});
   if([301,302,303,307,308].includes(r.status)){url=new URL(r.headers.get('location'),url).href;await r.body?.cancel();continue;}
   if(r.status===304)return {url,status:304,body:null};
   if(r.status===429||r.status===503){const retry=r.headers.get('retry-after');const until=retry&&/^\d+$/.test(retry)?this.clock()+Number(retry)*1000:Date.parse(retry||'')||this.clock()+3600000;this.lastRequest.set(new URL(url).origin,until);this.rateGate?.defer?.(new URL(url).origin,until);await r.body?.cancel();throw new SourceBlocked('RATE_LIMIT',`HTTP ${r.status}; Retry-After ${r.headers.get('retry-after')||'not provided'}. No automatic immediate retry.`,url);}
   if(r.status!==200){await r.body?.cancel();throw new SourceBlocked('HTTP_'+r.status,`Public source returned HTTP ${r.status}`,url);}
   const body=await this.body(r,url);return {url,status:r.status,body,sha256:createHash('sha256').update(body).digest('hex'),contentType:r.headers.get('content-type')||'',etag:r.headers.get('etag'),lastModified:r.headers.get('last-modified'),fetchedAt:new Date(this.clock()).toISOString()};
  }throw new SourceBlocked('REDIRECT_LIMIT','Too many redirects',url);
 }
 async close(){await this.dispatcher?.close();}
}
