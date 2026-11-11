import {hash} from '../models.mjs';
export function coverageFindings(report,{now=Date.now()}={}){
 const findings=[];const add=(type,key,payload)=>findings.push({id:hash([type,key]),type,...payload});
 for(const s of report.sources){if(s.verifiedAt&&now-Date.parse(s.verifiedAt)>(s.refreshHours||168)*3600000)add('stale-source',s.id,{sourceId:s.id,reason:'Last source verification is older than its configured refresh interval; current claims require review.'});if(s.counts?.unresolved)add('unresolved-source-rows',s.id,{sourceId:s.id,count:s.counts.unresolved,reason:'Unresolved candidates (including yearless schedules or unverified meet identities) remain in the source review queue.'});if(s.status==='blocked')add('blocked-source',s.id,{sourceId:s.id,reason:'Latest source access is blocked; no bypass or completeness claim.'});
  for(const m of s.missing)add('missing-source-member',m.sourceRecordId,{sourceId:s.id,name:m.name,sourceRecordId:m.sourceRecordId,entityId:m.entityId,retainedHistorical:m.retainedHistorical,reason:m.explanation});
  if(s.errors.includes('UNRESOLVED_PAGINATION'))add('unresolved-pagination',s.id,{sourceId:s.id,reason:'Relevant membership pagination remains unresolved.'});
 }
 for(const t of report.traces)for(const issue of t.issues)add('classification',issue.id,{entityId:t.id,name:t.name,code:issue.code,reason:issue.reason});
 for(const r of report.retention.regressions)add('retention-regression',JSON.stringify(r),{...r,reason:'Previously reviewed record or publication membership changed without a review decision.'});
 return findings;
}
export function persistFindings(store,findings){
 const now=new Date().toISOString(),active=new Set(findings.map(f=>f.id));
 for(const f of findings)store.db.prepare("INSERT INTO discovery_findings VALUES(?,'open',?,?,?) ON CONFLICT(id) DO UPDATE SET status=CASE WHEN discovery_findings.status='acknowledged' THEN 'acknowledged' ELSE 'open' END,last_seen=excluded.last_seen,payload_json=excluded.payload_json").run(f.id,now,now,JSON.stringify(f));
 for(const old of store.db.prepare("SELECT id FROM discovery_findings WHERE status!='resolved'").all())if(!active.has(old.id))store.db.prepare("UPDATE discovery_findings SET status='resolved',last_seen=? WHERE id=?").run(now,old.id);
}
export function acknowledgeFinding(store,id,{reviewer,reason}={}){
 if(!reviewer||!reason)throw Error('Finding review requires a named reviewer and rationale');
 return store.transaction(()=>{const old=store.db.prepare('SELECT * FROM discovery_findings WHERE id=?').get(id);if(!old||old.status==='resolved')throw Error('Finding unavailable or already resolved');const at=new Date().toISOString();store.db.prepare("UPDATE discovery_findings SET status='acknowledged' WHERE id=?").run(id);store.db.prepare('INSERT INTO discovery_finding_reviews(finding_id,at,reviewer,reason,payload_json) VALUES(?,?,?,?,?)').run(id,at,reviewer,reason,JSON.stringify({action:'acknowledged',note:'Acknowledgment does not approve records or waive coverage gates.'}));});
}
