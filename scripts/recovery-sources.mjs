// Search-provider bridge: input is logged generic query results, never benchmark files.
import{readFileSync}from'node:fs';import{sourceDefinition}from'../engine/acquisition/run.mjs';
export function recoverySources(){
 const batches=Array.from({length:5},(_,i)=>JSON.parse(readFileSync('data/qualification-recovery/search-'+i+'.json'))),roots={lacrosse:[],volleyball:[]},seen=new Set();
 const excluded=/facebook|instagram|reddit|youtube|wikipedia|twitter|linkedin|sportsengine\.com|gymdesk|gofundme|pinterest|maxpreps|\.pdf(?:\?|$)|register|signup|\/staff|\/board|\/roster|\/contact|checkout|\/athlet|sponsor|donate|\/sports\/article|\/local-sports\/|\/sports\/|womens-lacrosse|coaching-staff|championship|\/news\//i;
 const queues=batches.map(batch=>batch.leads.filter(l=>!excluded.test(l.url)&&/lacrosse|volley|youth.*(?:sport|league|program)|club.*program/i.test(l.title+' '+l.url)&&!/university|college|high school|professional|adult|masters|news|girls lacrosse committee|boys lacrosse committee|championship results/i.test(l.title)).map(l=>({...l,sport:batch.sport,query:batch.query})));
 while(queues.some(q=>q.length))for(const queue of queues){const lead=queue.shift();if(!lead)continue;const u=new URL(lead.url),host=u.hostname.replace(/^www\./,'');if(seen.has(host)||roots[lead.sport].length>=(lead.sport==='lacrosse'?28:20))continue;seen.add(host);roots[lead.sport].push(sourceDefinition(lead.url,lead.sport,{type:'other',name:lead.title,discoveredFrom:'public-search',searchEvidence:{query:lead.query,rank:lead.rank},refreshHours:168}));}
 return roots;
}
