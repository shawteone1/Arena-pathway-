import{hash}from'../models.mjs';
export function restoreAcquisition(ledger,snapshot){
 if(snapshot.schemaVersion!==2)throw Error('Unsupported acquisition snapshot');
 if(ledger.db.prepare('SELECT id FROM sources LIMIT 1').get()||ledger.db.prepare('SELECT id FROM acquisition_runs LIMIT 1').get())throw Error('Acquisition restore requires a fresh dedicated database; existing work will not be overwritten');
 const sourceIds=new Set(snapshot.sources.map(s=>s.id)),records=new Map(snapshot.records.map(r=>[r.id,r]));
 if(sourceIds.size!==snapshot.sources.length||records.size!==snapshot.records.length)throw Error('Duplicate snapshot identity');
 for(const row of snapshot.records){if(!sourceIds.has(row.source_id)||row.record.id!==row.id||row.record.sourceId!==row.source_id)throw Error('Invalid acquisition record/source relationship');for(const version of [row.current_version,row.approved_version].filter(Boolean))if(!snapshot.versions.some(v=>v.record_id===row.id&&v.version===version))throw Error('Missing acquisition record version');}
 for(const row of snapshot.sourceConfigHistory||[])if(hash(JSON.parse(row.payload_json))!==row.sha256)throw Error('Acquisition source history hash mismatch');
 const aliases=new Map((snapshot.identityLinks||[]).map(l=>[l.from_record,l.to_record]));for(const id of aliases.keys()){const seen=new Set();let current=id;while(current){if(seen.has(current))throw Error('Acquisition identity cycle');seen.add(current);current=aliases.get(current);}}
 return ledger.engine.transaction(()=>{
  for(const s of snapshot.sources){ledger.db.prepare('INSERT INTO sources VALUES(?,?)').run(s.id,JSON.stringify(s.config));ledger.db.prepare('INSERT INTO acquisition_sources VALUES(?,?,?,?,?,?,?,?,?,NULL)').run(s.id,s.sport,s.region,JSON.stringify(s.config),s.last_attempt,s.last_success,s.retrieval_status,s.failure_reason,s.next_due);}
  for(const r of snapshot.sourceConfigHistory||[])ledger.db.prepare('INSERT INTO source_config_versions VALUES(?,?,?,?,?)').run(r.source_id,r.revision,r.sha256,r.recorded_at,r.payload_json);
  for(const r of snapshot.runs)ledger.db.prepare('INSERT INTO acquisition_runs VALUES(?,?,?,?,?,?,?)').run(r.id,r.job,r.mode,r.started_at,r.finished_at,r.status,JSON.stringify(r.report));
  for(const r of snapshot.records)ledger.db.prepare('INSERT INTO acquisition_records VALUES(?,?,?,?,?,?,?)').run(r.id,r.source_id,r.native_id,r.current_version,r.approved_version,r.lifecycle,JSON.stringify(r.record));
  for(const r of snapshot.versions)ledger.db.prepare('INSERT INTO acquisition_record_versions VALUES(?,?,?,?,?,?)').run(r.record_id,r.version,r.run_id,r.observed_at,r.semantic_hash,JSON.stringify(r.record));
  for(const r of snapshot.observations)ledger.db.prepare('INSERT INTO acquisition_observations VALUES(?,?,?,?,?,?)').run(r.id,r.run_id,r.source_id,r.at,r.status,JSON.stringify(r.payload));
  for(const r of snapshot.reviews)ledger.db.prepare('INSERT INTO acquisition_reviews VALUES(?,?,?,?,?,?,?,?)').run(r.id,r.record_id,r.version,r.at,r.reviewer,r.decision,r.reason,r.evidence_url);
  for(const r of snapshot.identityLinks||[])ledger.db.prepare('INSERT INTO acquisition_identity_links VALUES(?,?,?,?,?,?,?)').run(r.id,r.from_record,r.to_record,r.at,r.reviewer,r.reason,r.evidence_json);
  for(const r of snapshot.frontier||[])ledger.db.prepare('INSERT INTO acquisition_frontier VALUES(?,?,?,?,?,?,?)').run(r.job,r.url,r.sport,r.depth,r.status,JSON.stringify(r.config),r.last_run);
  return{sources:snapshot.sources.length,records:snapshot.records.length,runs:snapshot.runs.length,cacheRestored:false,note:'History preserved; first refresh refetches because raw HTTP cache is not exported.'};
 });
}
