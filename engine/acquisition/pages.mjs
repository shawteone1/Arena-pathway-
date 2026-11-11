import{hash}from'../models.mjs';import{publicURL}from'../fetcher.mjs';import{extractAcquisition}from'./extract.mjs';
export async function acquirePages(client,source,{cache=null,maxPages=source.maxPages||6}={}){
 // Multi-page sources are fetched per page; a 304 for page 1 cannot validate every other page.
 const conditional=cache&&!(cache.parsed?.pages?.length>1)?{etag:cache.etag,lastModified:cache.lastModified}:{};
 const first=await client.get(source.url,source,conditional);
 if(first.status===304){if(!cache?.parsed)throw Object.assign(Error('304 without compatible saved extraction'),{code:'NO_COMPATIBLE_304_CACHE'});return{response:{...first,url:cache.url,sha256:cache.sha256,etag:cache.etag,lastModified:cache.lastModified,fetchedAt:cache.fetchedAt},parsed:cache.parsed};}
 const records=new Map(),seen=new Set(),queue=[source.url],pages=[],issues=[],links=[];let partial=false,declaredCount=null,sourceDate=null;
 while(queue.length&&seen.size<maxPages){const url=queue.shift();if(seen.has(url))continue;seen.add(url);
  try{publicURL(url,source.allowedHosts);const response=url===source.url?first:await client.get(url,source),parsed=await extractAcquisition(response,{...source,url,urls:[url]});sourceDate||=parsed.sourceDate;declaredCount??=parsed.declaredCount;partial||=parsed.partial&&!parsed.paginationURLs?.length;issues.push(...parsed.issues);links.push(...parsed.links);
   pages.push({url:response.url,bodySha256:response.sha256,retrievedAt:response.fetchedAt,extracted:parsed.records.length});
   for(const row of parsed.records){const old=records.get(row.nativeId);if(old&&hash({...old,pageEvidence:undefined})!==hash({...row,pageEvidence:undefined})){partial=true;issues.push('CONFLICTING_PAGINATION_ID:'+row.nativeId);continue;}records.set(row.nativeId,{...row,pageEvidence:{url:response.url,bodySha256:response.sha256,retrievedAt:response.fetchedAt,sourceDate:parsed.sourceDate||null,selector:source.rowSelector||source.headingSelector||source.adapter}});}
   for(const next of parsed.paginationURLs||[]){publicURL(next,source.allowedHosts);if(!seen.has(next)&&!queue.includes(next))queue.push(next);}
  }catch(error){partial=true;issues.push('PAGINATION_PAGE_FAILURE:'+(error.code||error.message));}
 }
 if(queue.length){partial=true;issues.push('UNRESOLVED_PAGINATION_BUDGET');}
 if(declaredCount!==null&&declaredCount!==records.size){partial=true;issues.push('DECLARED_COUNT_MISMATCH');}
 const parsed={records:[...records.values()],links:[...new Map(links.map(l=>[l.url,l])).values()],pages,issues:[...new Set(issues)],partial,declaredCount,sourceDate};
 return{response:{...first,sha256:pages.length===1?first.sha256:hash(pages.map(p=>p.bodySha256)),etag:pages.length>1?null:first.etag,lastModified:pages.length>1?null:first.lastModified},parsed};
}
