import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {restoreSnapshot} from '../engine/transfer.mjs';
import {EngineStore} from '../engine/store.mjs';
import {seedBaseline} from '../engine/baseline.mjs';
import {importSource} from '../engine/runner.mjs';
import {PublicSourceClient} from '../engine/fetcher.mjs';
import {validateEntities} from '../engine/models.mjs';
const [command,...args]=process.argv.slice(2),options=Object.fromEntries(args.map(a=>{const [k,...v]=a.replace(/^--/,'').split('=');return [k,v.length?v.join('='):true];}));
const db=resolve(options.db||process.env.ARENA_DATA_DB||'var/colorado-data-v1.sqlite'),store=new EngineStore(db);seedBaseline(store);
const rateGate=(origin,spacing)=>store.reserveRequest(origin,spacing);rateGate.defer=(origin,until)=>store.deferRequest(origin,until);
const sources=JSON.parse(readFileSync(new URL('../data/engine/registry.json',import.meta.url),'utf8'));for(const s of sources)store.register(s);
try{
 if(command==='import'){
  let selected=options.source?sources.filter(s=>s.id===options.source):sources;if(options['new-only'])selected=selected.filter(s=>!store.db.prepare('SELECT id FROM runs WHERE source_id=?').get(s.id));if(!selected.length)throw Error('Unknown source');const client=new PublicSourceClient({rateGate});
  try{for(const source of selected){const path=new URL('../data/engine/expectations/'+source.id+'.json',import.meta.url);const manifest=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):null;const r=await importSource(store,source,{client,manifest,maxPages:Number(options['max-pages'])||source.maxPages});console.log(JSON.stringify({runId:r.runId,source:source.id,status:r.report.status,counts:r.report.counts,expected:r.report.expected,captured:r.report.captured}));}}
  finally{await client.close();}
 }else if(command==='approve'){console.log(store.approve(options.run,{reviewer:options.reviewer,reason:options.reason,allowPartial:!!options['allow-partial']}));}
 else if(command==='validate'){const r=validateEntities(store.entities());console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;}
 else if(command==='export'){const out=resolve(options.out||'data/engine/approved.json');const r=store.export(out);console.log('Exported reviewed entities and source audit to',out,r.entities.length);}
 else if(command==='retire'){console.log(store.retire(options.entity,{reviewer:options.reviewer,reason:options.reason,runId:options.run}).id);}
 else if(command==='reviews'){console.log(JSON.stringify(store.db.prepare("SELECT * FROM reviews WHERE status='open'").all(),null,2));}
 else if(command==='resolve'){if(!options.review||!options.reviewer||!options.reason)throw Error('Review ID, reviewer and reason are required');const r=store.db.prepare("UPDATE reviews SET status='resolved',resolution_json=? WHERE id=? AND status='open'").run(JSON.stringify({reviewer:options.reviewer,reason:options.reason,at:new Date().toISOString()}),options.review);if(!r.changes)throw Error('Unknown or already resolved issue');console.log('Review issue resolved; entity approval remains a separate action');}
 else if(command==='bootstrap'){console.log(restoreSnapshot(store,JSON.parse(readFileSync(resolve(options.from||'data/engine/approved.json'),'utf8'))));}
 else if(command==='interrupt'){if(!options.run||!options.reason)throw Error('Run and interruption reason required');const row=store.db.prepare('SELECT status FROM runs WHERE id=?').get(options.run);if(row?.status!=='running')throw Error('Only abandoned running jobs can be interrupted');store.finish(options.run,{rows:[],evidence:[],report:{sourceId:null,status:'blocked',counts:{candidate:0,imported:0,excluded:0,duplicate:0,unresolved:0},errors:['OPERATOR_INTERRUPTED:'+options.reason],statewideComplete:false}});console.log('Interrupted abandoned run; reviewed records preserved');}
 else if(command==='report'){console.log(JSON.stringify(store.report(),null,2));}
 else if(command==='refresh'){
  const now=Date.now(),due=sources.filter(s=>{const row=store.db.prepare('SELECT MAX(finished_at) AS at FROM runs WHERE source_id=?').get(s.id);return !row.at||now-Date.parse(row.at)>s.refreshHours*3600000;});
  console.log(JSON.stringify({schedulerConfigured:false,schedulerTested:false,operational:false,due:due.map(s=>s.id)}));
  if(options.execute){const client=new PublicSourceClient({rateGate});try{for(const s of due){const path=new URL('../data/engine/expectations/'+s.id+'.json',import.meta.url);const manifest=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):null;const r=await importSource(store,s,{client,manifest});console.log(s.id,r.runId,r.report.status);}}finally{await client.close();}}
 }else if(command==='backup'){const target=resolve(options.out||db+'.backup');store.db.prepare('VACUUM INTO ?').run(target);console.log('Database checkpoint/backup:',target);}
 else throw Error('Commands: import, approve, validate, export, report, refresh, backup, bootstrap, interrupt, reviews, resolve, retire');
}finally{store.close();}
