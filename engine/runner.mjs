import {PublicSourceClient,publicURL} from './fetcher.mjs';
import {extractJSON} from './adapters/json.mjs';
import {extractHTML} from './adapters/html.mjs';
import {extractClubPDF} from './adapters/pdf.mjs';
import {normalizeRow} from './normalize.mjs';
import {reconcile,hash} from './models.mjs';
export async function importSource(store,source,{client=new PublicSourceClient(),manifest=null,maxPages=source.maxPages||25}={}){
 const runId=store.start(source),pages=[],frontier=source.urls.map(url=>({url,status:'pending'})),rows=[],evidence=[],issues=[];const existing=store.entities(),seenRows=new Map();
 let index=0;
 try{
 while(index<frontier.length&&pages.length<maxPages){const task=frontier[index++];if(task.status!=='pending')continue;
  try{
   const response=await client.get(task.url,source);if(response.status===304){task.status='unresolved';pages.push({url:task.url,status:'needs-review',role:'unknown',extractedRows:0,code:'NOT_MODIFIED_REQUIRES_REUSE'});continue;}
   const parsed=source.adapter==='json-feed'?extractJSON(response.body.toString('utf8'),source):response.contentType.includes('pdf')?extractClubPDF(response.body,source):extractHTML(response.body,response.url,source);issues.push(...parsed.issues);
   for(const raw of parsed.rows){const {row,evidence:ev}=normalizeRow(raw,source,response,existing);if(seenRows.has(row.sourceRecordId))continue;seenRows.set(row.sourceRecordId,row);rows.push(row);evidence.push(ev);}
   const isLanding=source.adapter==='discovery'||source.landingURLs?.includes(task.url);
   pages.push({url:response.url,requestedURL:task.url,status:'processed',role:isLanding?'landing':source.adapter,extractedRows:parsed.rows.length,paginationUnresolved:parsed.paginationUnresolved,bodySha256:response.sha256,fetchedAt:response.fetchedAt});task.status='processed';
   for(const link of parsed.links){if(frontier.some(f=>f.url===link.url)||pages.some(p=>p.url===link.url))continue;
    let status='pending',reason=null;try{publicURL(link.url,source.allowedHosts);if(source.followURLPattern&&!new RegExp(source.followURLPattern).test(link.url)){status='unresolved';reason='Related source requires its own registered adapter/review';}}catch(e){status='unresolved';reason=e.code;}
    frontier.push({...link,status,reason});
   }
  }catch(error){task.status='blocked';task.reason=error.code||'PARSE_ERROR';pages.push({url:task.url,status:'blocked',role:'unknown',extractedRows:0,code:error.code||'PARSE_ERROR',reason:error.message});}
 }
 const previous=store.db.prepare('SELECT report_json FROM runs WHERE source_id=? AND approved_at IS NOT NULL ORDER BY finished_at DESC LIMIT 1').get(source.id);const prev=previous?JSON.parse(previous.report_json):null;
 const report=reconcile({source,manifest,rows,pages,frontier,previousCount:prev?prev.counts.imported+prev.counts.duplicate:null,decreaseReason:source.decreaseReason});report.sourceConfig=source;report.independentExpectation=manifest;report.sourceConfigSha256=hash(source);report.expectationSha256=manifest?hash(manifest):null;report.pages=pages;report.frontier=frontier;report.extractionIssues=issues;report.latestVerificationDate=pages.filter(p=>p.fetchedAt).map(p=>p.fetchedAt).sort().at(-1)||null;
 if(issues.length){report.errors.push(...issues);if(report.status==='complete')report.status='needs-review';}
 store.finish(runId,{rows,evidence,report});return {runId,report,rows,evidence};
 }catch(error){store.finish(runId,{rows:[],evidence:[],report:{sourceId:source.id,status:'blocked',counts:{candidate:0,imported:0,excluded:0,duplicate:0,unresolved:0},errors:['IMPORT_FAILURE:'+error.message],pages,frontier,statewideComplete:false}});throw error;}
}
