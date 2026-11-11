import {hash} from '../models.mjs';
const tables={source:'source_config_versions',expectation:'source_expectation_versions',configuration:'discovery_configuration_versions'};
export function version(db,type,id,payload){
 const table=tables[type];if(!table)throw Error('Unknown registry version type');const key=type==='configuration'?'name':'source_id';
 const old=db.prepare(`SELECT revision,sha256 FROM ${table} WHERE ${key}=? ORDER BY revision DESC LIMIT 1`).get(id),sha=hash(payload);
 if(old?.sha256===sha)return old.revision;
 const revision=(old?.revision||0)+1;
 db.prepare(`INSERT INTO ${table} VALUES(?,?,?,?,?)`).run(id,revision,sha,new Date().toISOString(),JSON.stringify(payload));return revision;
}
export function attachRunVersions(store,source,manifest,runId){
 const config=version(store.db,'source',source.id,source),expectation=manifest?version(store.db,'expectation',source.id,manifest):null;
 store.db.prepare('INSERT INTO run_source_versions VALUES(?,?,?,?)').run(runId,source.id,config,expectation);
}
export function recordTasks(store,runId,source,report){
 for(const item of [...(report.frontier||[]),...(report.opponentCandidates||[]).map(p=>({...p,status:'candidate',kind:'opponent'}))]){
  const task={...item,sourceId:source.id,originRunId:runId,sport:source.sport||null,discoveredAt:report.latestVerificationDate||null};const id=hash([runId,item.url||item.key||item.name]);
  store.db.prepare('INSERT OR REPLACE INTO discovery_tasks VALUES(?,?,?,?,?)').run(id,source.id,runId,item.status||'unresolved',JSON.stringify(task));
 }
}
export function discoveryAudit(store){return {
 findings:store.db.prepare('SELECT * FROM discovery_findings ORDER BY id').all(),
 findingReviews:store.db.prepare('SELECT * FROM discovery_finding_reviews ORDER BY id').all(),
 sourceVersions:store.db.prepare('SELECT * FROM source_config_versions ORDER BY source_id,revision').all(),
 expectationVersions:store.db.prepare('SELECT * FROM source_expectation_versions ORDER BY source_id,revision').all(),
 runVersions:store.db.prepare('SELECT * FROM run_source_versions ORDER BY run_id').all(),
 configurationVersions:store.db.prepare('SELECT * FROM discovery_configuration_versions ORDER BY name,revision').all(),
 tasks:store.db.prepare('SELECT * FROM discovery_tasks ORDER BY id').all(),
 reconciliations:store.db.prepare('SELECT * FROM discovery_reconciliations ORDER BY id').all()
};}
export function restoreDiscovery(store,data){
 if(!data)return;for(const [table,rows]of Object.entries({source_config_versions:data.sourceVersions,source_expectation_versions:data.expectationVersions,run_source_versions:data.runVersions,discovery_configuration_versions:data.configurationVersions,discovery_tasks:data.tasks,discovery_reconciliations:data.reconciliations,discovery_findings:data.findings,discovery_finding_reviews:data.findingReviews})){
  if(!rows?.length)continue;
  // Registry versions seeded during restore must agree exactly on identity/hash/payload.
  for(const row of rows){const keys=Object.keys(row),allowed=new Set(store.db.prepare(`PRAGMA table_info(${table})`).all().map(c=>c.name));if(keys.some(k=>!allowed.has(k)))throw Error('Invalid discovery history column');if(['source_config_versions','source_expectation_versions','discovery_configuration_versions'].includes(table)&&hash(JSON.parse(row.payload_json))!==row.sha256)throw Error('Discovery history hash mismatch');const existing=table==='source_config_versions'?store.db.prepare('SELECT sha256 FROM source_config_versions WHERE source_id=? AND revision=?').get(row.source_id,row.revision):null;if(existing&&existing.sha256!==row.sha256)throw Error('Source history conflicts with restored current configuration');
   store.db.prepare(`INSERT OR REPLACE INTO ${table}(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`).run(...keys.map(k=>row[k]));
  }
 }
}
