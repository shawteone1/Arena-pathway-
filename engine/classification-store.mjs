import {validateParticipation} from './participation.mjs';
export function readParticipation(store){return {schemaVersion:1,generatedAt:new Date().toISOString(),registrations:store.db.prepare('SELECT payload_json FROM registration_opportunities ORDER BY id').all().map(r=>JSON.parse(r.payload_json)),programs:store.db.prepare('SELECT payload_json FROM participation_programs ORDER BY id').all().map(r=>JSON.parse(r.payload_json)),teamAssignments:store.db.prepare('SELECT payload_json FROM team_programs ORDER BY team_id').all().map(r=>JSON.parse(r.payload_json)),exceptions:store.db.prepare('SELECT payload_json FROM classification_reviews ORDER BY id').all().map(r=>JSON.parse(r.payload_json)),canonicalLinks:store.db.prepare('SELECT payload_json FROM canonical_identities').all().map(r=>JSON.parse(r.payload_json)),revisions:store.db.prepare('SELECT * FROM classification_revisions ORDER BY id').all()};}
export function publishParticipation(store,snapshot,{reviewer,reason}={}){
 if(!reviewer||!reason)throw Error('Classification review needs a named reviewer and rationale');const prior=readParticipation(store),before={...prior,revisions:[]},evidence=store.report().evidence;
 const check=validateParticipation(snapshot,{entities:store.entities(),evidence});if(!check.valid)throw Error(check.errors.join('\n'));
 const comparable=s=>JSON.stringify({programs:s.programs,registrations:s.registrations||[],teamAssignments:s.teamAssignments,exceptions:s.exceptions.filter(e=>e.status!=='resolved'),canonicalLinks:s.canonicalLinks});if(comparable(before)===comparable(snapshot))return {...prior,idempotent:true};
 return store.transaction(()=>{
  // A reviewed replacement snapshot must retain every prior program or explicitly retire it.
  for(const p of before.programs)if(!snapshot.programs.some(n=>n.id===p.id))throw Error('Classification update would lose a prior program: '+p.id);
  for(const link of snapshot.canonicalLinks||[])store.db.prepare('INSERT INTO canonical_identities VALUES(?,?,?) ON CONFLICT(from_id) DO UPDATE SET to_id=excluded.to_id,payload_json=excluded.payload_json').run(link.from,link.to,JSON.stringify(link));
  for(const p of snapshot.programs){store.db.prepare('INSERT INTO participation_programs VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET designation=excluded.designation,review_status=excluded.review_status,payload_json=excluded.payload_json').run(p.id,p.organizationId,p.sport,p.designation,p.reviewStatus,JSON.stringify(p));for(const id of p.evidenceIds)store.db.prepare('INSERT OR IGNORE INTO program_evidence VALUES(?,?)').run(p.id,id);}
  for(const r of snapshot.registrations||[])store.db.prepare('INSERT INTO registration_opportunities VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET availability_status=excluded.availability_status,payload_json=excluded.payload_json').run(r.id,r.programId,r.organizationId,r.status,JSON.stringify(r));
  const current=new Set((snapshot.teamAssignments||[]).map(a=>a.teamId));for(const a of before.teamAssignments)if(!current.has(a.teamId))throw Error('Classification update would lose a reviewed team link: '+a.teamId);
 for(const a of snapshot.teamAssignments||[])store.db.prepare('INSERT INTO team_programs VALUES(?,?,?) ON CONFLICT(team_id) DO UPDATE SET program_id=excluded.program_id,payload_json=excluded.payload_json').run(a.teamId,a.programId,JSON.stringify(a));
  for(const e of snapshot.exceptions||[])store.db.prepare('INSERT INTO classification_reviews VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,reason=excluded.reason,payload_json=excluded.payload_json').run(e.id,e.entityId,e.status||'open',e.reason,JSON.stringify(e));
  for(const e of before.exceptions.filter(e=>!snapshot.exceptions.some(n=>n.id===e.id))){const resolved={...e,status:'resolved',resolution:{reviewer,reason,at:new Date().toISOString()}};store.db.prepare('UPDATE classification_reviews SET status=?,payload_json=? WHERE id=?').run('resolved',JSON.stringify(resolved),e.id);}
  store.db.prepare('INSERT INTO classification_revisions(at,reviewer,rationale,before_json,after_json) VALUES(?,?,?,?,?)').run(new Date().toISOString(),reviewer,reason,JSON.stringify(before),JSON.stringify(snapshot));return readParticipation(store);
 });
}

export function restoreParticipation(store,snapshot){
 if(!snapshot)return;for(const p of snapshot.programs||[]){store.db.prepare('INSERT INTO participation_programs VALUES(?,?,?,?,?,?)').run(p.id,p.organizationId,p.sport,p.designation,p.reviewStatus,JSON.stringify(p));for(const id of p.evidenceIds)store.db.prepare('INSERT INTO program_evidence VALUES(?,?)').run(p.id,id);}
 for(const r of snapshot.registrations||[])store.db.prepare('INSERT INTO registration_opportunities VALUES(?,?,?,?,?)').run(r.id,r.programId,r.organizationId,r.status,JSON.stringify(r));
 for(const a of snapshot.teamAssignments||[])store.db.prepare('INSERT INTO team_programs VALUES(?,?,?)').run(a.teamId,a.programId,JSON.stringify(a));
 for(const e of snapshot.exceptions||[])store.db.prepare('INSERT INTO classification_reviews VALUES(?,?,?,?,?)').run(e.id,e.entityId,e.status||'open',e.reason,JSON.stringify(e));
 for(const l of snapshot.canonicalLinks||[])store.db.prepare('INSERT INTO canonical_identities VALUES(?,?,?)').run(l.from,l.to,JSON.stringify(l));
 for(const r of snapshot.revisions||[])store.db.prepare('INSERT INTO classification_revisions(at,reviewer,rationale,before_json,after_json) VALUES(?,?,?,?,?)').run(r.at,r.reviewer,r.rationale,r.before_json,r.after_json);
}
