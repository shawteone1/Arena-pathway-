export function refreshPlan(registry,snapshot,{now=Date.now()}={}){
 return {schedulerConfigured:false,schedulerTested:false,operational:false,automaticApproval:false,items:registry.map(s=>{
  const latest=snapshot.runs.filter(r=>r.source_id===s.id).at(-1),last=latest?.finished_at||latest?.started_at||s.reviewedAt||null,interval=(s.refreshHours||168)*3600000,at=last?Date.parse(last):NaN;
  return {sourceId:s.id,adapter:s.adapter,lastAttempt:last,lastSourceVerification:latest?.report.latestVerificationDate||null,nextDue:Number.isFinite(at)?new Date(at+interval).toISOString():null,due:!Number.isFinite(at)||now>=at+interval,action:s.adapter==='research-reference'?'Register a scoped adapter and independent expectations before import':s.adapter==='reviewed-archive'?'Replay preserves records; verify the original public source separately':latest?.status==='blocked'?'Review access/terms and use permitted publisher-supported sources; never bypass':'Import to staging; reconcile membership, evidence, classifications and publication before approval'};
 })};
}
