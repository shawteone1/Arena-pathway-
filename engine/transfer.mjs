import {restoreDiscovery} from './discovery/registry.mjs';
import {restoreParticipation} from './classification-store.mjs';
import {validateParticipation} from './participation.mjs';
import {validateEntities} from './models.mjs';
// Reviewed portable audit snapshots are operator-controlled repository artifacts, never an HTTP import format.
export function restoreSnapshot(store,snapshot){
 if(snapshot.schemaVersion!==1)throw Error('Unsupported audit snapshot version');
 if(store.db.prepare('SELECT id FROM runs LIMIT 1').get()||store.entities().some(e=>!e.legacy))throw Error('Restore requires a fresh database; existing work will not be overwritten');
 const validation=validateEntities(snapshot.entities);if(!validation.valid)throw Error('Invalid snapshot: '+validation.errors.join(', '));
 if(snapshot.entities.some(e=>!['verified','retired'].includes(e.reviewStatus)))throw Error('Snapshot contains unreviewed published entities');
 if(snapshot.participation){const check=validateParticipation(snapshot.participation,{entities:snapshot.entities,evidence:snapshot.evidence});if(!check.valid)throw Error('Invalid participation snapshot: '+check.errors.join(', '));}
 return store.transaction(()=>{
  for(const source of snapshot.sources){store.db.prepare('INSERT INTO sources VALUES(?,?) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json').run(source.id,JSON.stringify(source));if(!snapshot.discovery)store.register(source);}
  for(const r of snapshot.runs)store.db.prepare('INSERT INTO runs VALUES(?,?,?,?,?,?,?)').run(r.id,r.source_id,r.started_at||r.finished_at,r.finished_at,r.status,JSON.stringify(r.report),r.approved_at);
  for(const e of snapshot.evidence)store.db.prepare('INSERT OR IGNORE INTO evidence VALUES(?,?,?,?,?)').run(e.id,e.sourceId,e.url,e.fetchedAt,JSON.stringify(e));
  for(const e of snapshot.entities){const old=store.db.prepare('SELECT payload_json FROM entities WHERE id=?').get(e.id);if(old){if(JSON.stringify(JSON.parse(old.payload_json))!==JSON.stringify(e))throw Error('Baseline differs; restore refused');continue;}store.db.prepare('INSERT INTO entities(id,kind,sport,review_status,payload_json) VALUES(?,?,?,?,?)').run(e.id,e.kind,e.sport||null,e.reviewStatus,JSON.stringify(e));}
  for(const e of snapshot.entities){for(const id of e.evidenceIds){if(!store.db.prepare('SELECT id FROM evidence WHERE id=?').get(id))throw Error('Missing source evidence '+id);store.db.prepare('INSERT OR IGNORE INTO entity_evidence VALUES(?,?)').run(e.id,id);}for(const key of ['organizationId','leagueId','divisionId','competitionId','seasonId'])if(e[key])store.db.prepare('INSERT OR IGNORE INTO relationships VALUES(?,?,?)').run(e.id,e[key],key);}
  for(const r of snapshot.candidates||[])store.db.prepare('INSERT INTO candidates VALUES(?,?,?)').run(r.run_id,r.source_record_id,JSON.stringify(r.payload));
  for(const r of snapshot.reviewHistory||snapshot.reviewQueue||[])store.db.prepare('INSERT INTO reviews VALUES(?,?,?,?,?,?)').run(r.id,r.run_id,r.record_id,r.status,r.reason,r.resolution_json||null);
  for(const r of snapshot.approvals||[])store.db.prepare('INSERT INTO approvals VALUES(?,?,?,?)').run(r.run_id,r.reviewer,r.reason,r.at);
  for(const r of snapshot.revisions||[])store.db.prepare('INSERT INTO revisions(entity_id,run_id,at,before_json,after_json) VALUES(?,?,?,?,?)').run(r.entity_id,r.run_id,r.at,r.before_json,r.after_json);
  restoreParticipation(store,snapshot.participation);
  restoreDiscovery(store,snapshot.discovery);
  return {restoredEntities:snapshot.entities.length,restoredRuns:snapshot.runs.length};
 });
}
