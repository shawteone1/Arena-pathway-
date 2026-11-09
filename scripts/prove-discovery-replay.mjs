import{readFileSync,writeFileSync}from'node:fs';import{resolve}from'node:path';
import{EngineStore}from'../engine/store.mjs';import{restoreSnapshot}from'../engine/transfer.mjs';import{hash}from'../engine/models.mjs';import{replayReviewedArchive}from'../engine/discovery/archive.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url))),snapshot=read('data/engine/approved.json'),sources=read('data/discovery/archive-sources.json');
const store=new EngineStore(resolve(process.env.ARENA_DATA_DB||'var/sports-discovery-review.sqlite'));
try{
 if(!store.entities().length)restoreSnapshot(store,snapshot);const before=store.entities(),proof=[];
 for(const s of sources){const config={...s,snapshotSha256:hash(snapshot)},result=replayReviewedArchive(store,config,snapshot,read(s.expectedManifest));store.approve(result.runId,{reviewer:'Codex exact archive preservation review',reason:'Replay the original approved organization identity only; source date and participation claims are not refreshed.',allowPartial:true});proof.push({sourceId:s.id,adapter:s.adapter,runId:result.runId,expected:result.report.expected,captured:result.report.captured,status:result.report.status,originalEvidenceDates:result.report.originalEvidenceDates,entityIds:s.archivedEntityIds});}
 if(hash(store.entities())!==hash(before))throw Error('Archive replay changed reviewed identities');
 const report={verifiedAt:new Date().toISOString(),purpose:'Actual configuration-driven replay of retained public research; not new live-source discovery or current verification.',recordsBefore:before.length,recordsAfter:store.entities().length,identityPayloadsUnchanged:true,proof};writeFileSync(new URL('../data/discovery/replay-proof.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{store.close();}
