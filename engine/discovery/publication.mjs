import {load} from 'cheerio';
// Audit the actual public API and every rendered page, including pagination.
export async function auditPublication(base,sports,categories){
 const results=[],errors=[];
 for(const sport of sports)for(const designation of categories)for(const kind of ['club','league','team']){
  const response=await fetch(base+'/api/data/directory?'+new URLSearchParams({sport,designation,kind}));if(!response.ok)throw Error('Directory API failed: '+response.status);
  const api=await response.json(),rendered=new Set();let page=1,lastSignature=null;
  while(page<=1000){const html=await fetch(base+'/sports/'+sport+'/'+designation+'?kind='+kind+'&page='+page);if(!html.ok)throw Error('Rendered directory failed');const $=load(await html.text()),ids=$('.club-result').toArray().map(e=>$(e).attr(kind==='team'?'data-record':'data-organization')),signature=ids.join('|');
   if(page>1&&signature===lastSignature){errors.push('REPEATED_PUBLICATION_PAGE:'+sport+':'+designation+':'+kind);break;}for(const id of ids)rendered.add(id);lastSignature=signature;
   const next=$('a[rel=next]').length||$('a').toArray().some(e=>$(e).text().trim()==='Next →'||$(e).text().trim()==='Next');
   if(!next)break;page++;
  }
  if(page>1000)errors.push('PUBLICATION_PAGINATION_BUDGET:'+sport+':'+designation+':'+kind);
  const ids=api.map(r=>r.id).sort(),renderedIds=[...rendered].sort();if(JSON.stringify(ids)!==JSON.stringify(renderedIds))errors.push('API_RENDER_MISMATCH:'+sport+':'+designation+':'+kind);
  if(ids.length!==new Set(ids).size)errors.push('DUPLICATE_ORGANIZATION_CARD:'+sport+':'+designation+':'+kind);
  results.push({sport,designation,kind,ids,renderedIds,apiCount:api.length,renderedCount:rendered.size,pages:page,names:api.map(r=>({id:r.id,name:r.name,programKinds:[...new Set(r.programs.map(p=>p.programKind))]}))});
 }
 return {valid:!errors.length,errors,publication:results};
}
