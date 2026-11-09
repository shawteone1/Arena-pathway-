import {coverageFindings,persistFindings,acknowledgeFinding} from '../engine/discovery/findings.mjs';
import {refreshPlan} from '../engine/discovery/refresh.mjs';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {EngineStore} from '../engine/store.mjs';
import {restoreSnapshot} from '../engine/transfer.mjs';
import {hash} from '../engine/models.mjs';
import {version,attachRunVersions,recordTasks,discoveryAudit} from '../engine/discovery/registry.mjs';
import {participationGraph,validateGraph} from '../engine/discovery/graph.mjs';
import {discoveryDecision} from '../engine/discovery/decision.mjs';
import {categories,coverageReconciliation} from '../engine/discovery/reconcile.mjs';
import {auditPublication} from '../engine/discovery/publication.mjs';
import {replayReviewedArchive} from '../engine/discovery/archive.mjs';
import {createServer} from '../server.mjs';
const root=new URL('../',import.meta.url),read=path=>JSON.parse(readFileSync(new URL(path,root),'utf8'));
const [command='check',...argv]=process.argv.slice(2),args=Object.fromEntries(argv.map(a=>{const [k,...v]=a.replace(/^--/,'').split('=');return [k,v.join('=')||true];}));
const snapshot=read('data/engine/approved.json'),participation=read('data/unified/catalog.json'),tree=read('data/discovery/decision-tree.json'),baseline=read('data/discovery/publication-baseline.json'),bindings=read('data/discovery/source-bindings.json');
const sourceMap=new Map([...snapshot.sources,...read('data/engine/registry.json')].map(s=>[s.id,s]));
const legacy=read('data/catalog.json');
for(const s of legacy.sources){const sports=[...new Set([...legacy.organizations,...legacy.schools,...legacy.teams,...legacy.leagues,...legacy.opportunities,...legacy.communities].filter(r=>r.sourceIds?.includes(s.id)).flatMap(r=>r.sports||[r.sport]).filter(Boolean))];sourceMap.set('research:'+s.id,{id:'research:'+s.id,title:s.title,urls:[s.url],sports,sport:sports.length===1?sports[0]:null,adapter:'research-reference',scope:s.scope,reviewedAt:s.reviewedAt,evidence:s.evidence,origin:'Preserved user/reviewed research reference; not a membership import.',refreshHours:168});}
const archives=read('data/discovery/archive-sources.json').map(s=>({...s,snapshotSha256:hash(snapshot)}));for(const s of archives)sourceMap.set(s.id,s);
const registry=[...sourceMap.values()],manifests={};for(const s of registry){const path=s.expectedManifest||'data/engine/expectations/'+s.id+'.json';if(existsSync(new URL(path,root)))manifests[s.id]=read(path);}
if(command==='acknowledge'){const store=new EngineStore(resolve(args.db||process.env.ARENA_DATA_DB||'var/sports-discovery-v1.sqlite'));try{acknowledgeFinding(store,args.finding,{reviewer:args.reviewer,reason:args.reason});console.log('Acknowledged; no records approved and no coverage gate waived.');}finally{store.close();}
}else if(command==='refresh-plan'){console.log(JSON.stringify(refreshPlan(registry,snapshot),null,2));
}else if(command==='replay'){
 const selected=archives.find(s=>s.id===args.source);if(!selected)throw Error('Choose a configured archive source; this command never fetches live providers');const store=new EngineStore(resolve(args.db||process.env.ARENA_DATA_DB||'var/sports-discovery-v1.sqlite'));
 try{if(!store.entities().length)restoreSnapshot(store,snapshot);const result=replayReviewedArchive(store,selected,snapshot,manifests[selected.id]);console.log(JSON.stringify(result,null,2));}finally{store.close();}
}else if(['build','check'].includes(command)){
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));let api;
 try{api=await auditPublication('http://127.0.0.1:'+server.address().port,Object.keys(tree.sports),categories);}finally{await new Promise(r=>server.close(r));}
 let ingestionSnapshot=snapshot;if(command==='build'||args.db){const staging=new EngineStore(resolve(args.db||process.env.ARENA_DATA_DB||'var/sports-discovery-v1.sqlite'));try{if(!staging.entities().length)restoreSnapshot(staging,snapshot);ingestionSnapshot=staging.report();}finally{staging.close();}}
 const graph=participationGraph(snapshot,participation),graphValidation=validateGraph(graph),report=coverageReconciliation({snapshot,ingestionSnapshot,participation,registry,manifests,bindings,baseline,publication:api.publication,decisions:read('data/discovery/review-decisions.json')});report.publicationAudit=api;report.graphValidation=graphValidation;report.findings=coverageFindings(report);report.valid&&=api.valid&&graphValidation.valid;
 if(command==='build'){
  const store=new EngineStore(resolve(args.db||process.env.ARENA_DATA_DB||'var/sports-discovery-v1.sqlite'));
  try{
   if(!store.entities().length)restoreSnapshot(store,snapshot);
   store.transaction(()=>{for(const source of registry)store.register(source);version(store.db,'configuration','discovery-decision-tree',tree);
    for(const run of snapshot.runs){const source=run.report.sourceConfig;if(!source)continue;if(!store.db.prepare('SELECT run_id FROM run_source_versions WHERE run_id=?').get(run.id))attachRunVersions(store,source,run.report.independentExpectation,run.id);recordTasks(store,run.id,source,run.report);}
    for(const s of registry)store.register(s);
    for(const s of registry)if(manifests[s.id])version(store.db,'expectation',s.id,manifests[s.id]);
    persistFindings(store,report.findings);
    store.db.prepare('INSERT INTO discovery_reconciliations(at,baseline_sha256,payload_json) VALUES(?,?,?)').run(new Date().toISOString(),hash(baseline),JSON.stringify(report));
   });
   const decisions=registry.filter(s=>s.adapter!=='research-reference'&&s.sport).map(s=>{const latest=ingestionSnapshot.runs.filter(r=>r.source_id===s.id).at(-1)?.report;return discoveryDecision(s,tree,{rows:latest?.counts?.candidate||0,frontierResolved:!!latest?.pages?.some(p=>p.status==='processed')&&latest.frontier?.every(f=>['processed','excluded'].includes(f.status)),scopeReconciled:report.sources.find(x=>x.id===s.id)?.scopeComplete,archiveVerified:s.adapter==='reviewed-archive'&&latest?.sourceConfig?.snapshotSha256===hash(snapshot)});});
   const registryArtifact={schemaVersion:1,revision:1,baseCommit:baseline.commit,sources:registry.map(s=>({...s,configurationSha256:hash(s)})),decisions};
   mkdirSync(new URL('data/discovery/',root),{recursive:true});for(const [name,data]of Object.entries({'registry.json':registryArtifact,'graph.json':graph,'report.json':report,'audit.json':discoveryAudit(store)}))writeFileSync(new URL('data/discovery/'+name,root),JSON.stringify(data,null,2)+'\n');
  }finally{store.close();}
 }
 console.log(JSON.stringify({valid:report.valid,statewideComplete:false,retentionRegressions:report.retention.regressions,publicationErrors:api.errors,graphErrors:graphValidation.errors,sports:report.sports.map(s=>({sport:s.sport,storedOrganizations:s.normalizedOrganizations,storedTeams:s.normalizedTeams,categories:s.visibleByCategory.map(c=>[c.designation,c.count]),unpublishedOrganizations:s.missingOrganizations.map(e=>e.name),unassignedTeams:s.unassignedTeams.length}))},null,2));if(!report.valid)process.exitCode=1;
}else throw Error('Commands: check, build, refresh-plan, replay --source=SOURCE_ID [--db=PATH]');
