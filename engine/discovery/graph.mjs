import {hash} from '../models.mjs';
export function participationGraph(snapshot,participation=snapshot.participation){
 const programs=participation?.programs||[],assigned=new Map((participation?.teamAssignments||[]).map(a=>[a.teamId,a])),programById=new Map(programs.map(p=>[p.id,p]));
 const nodes=snapshot.entities.map(e=>({...e,type:e.kind==='location'?'facility':e.kind==='organization'&&e.category==='association'?'association':e.kind,identityReviewStatus:e.reviewStatus,participationReviewStatus:e.kind==='team'&&!assigned.has(e.id)?'needs-parent-review':e.reviewStatus}));
 nodes.push(...programs.map(p=>({...p,type:'program'})));
 const edges=[],add=(from,to,relation,status,evidenceIds,extra={})=>edges.push({id:hash([from,to,relation]),from,to,relation,status,evidenceIds,...extra});
 for(const p of programs)add(p.id,p.organizationId,'operated-by',p.reviewStatus,p.evidenceIds);
 for(const e of snapshot.entities){
  const a=assigned.get(e.id),p=a?programById.get(a.programId):null;
  if(e.kind==='team'&&p){add(e.id,p.id,'team-program','verified',a.evidenceIds);add(e.id,p.organizationId,'owned-by','verified',a.evidenceIds);}
  else if(e.organizationId)add(e.id,e.organizationId,e.kind==='team'?'reported-parent':'operated-by',e.kind==='team'?'needs-review':e.reviewStatus,e.evidenceIds);
  for(const key of ['leagueId','competitionId','divisionId','seasonId'])if(e[key])add(e.id,e[key],key.replace('Id','-membership'),'observed',e.evidenceIds,{current:false,reason:'Published relationship evidence is not proof of current season or parent ownership.'});
 }
 for(const p of programs)for(const id of p.locationIds||[])add(p.id,id,'uses-facility',p.reviewStatus,p.evidenceIds,{current:false});
 return {evidence:snapshot.evidence.map(e=>({id:e.id,url:e.url,sourceId:e.sourceId,reviewedAt:e.fetchedAt})),schemaVersion:1,generatedAt:new Date().toISOString(),nodes,edges,reviewQueue:participation?.exceptions||[],statewideComplete:false};
}
export function validateGraph(graph){
 const nodes=new Map(),errors=[],evidence=new Set((graph.evidence||[]).map(e=>e.id));for(const n of graph.nodes){if(nodes.has(n.id))errors.push('DUPLICATE_GRAPH_ID:'+n.id);nodes.set(n.id,n);}
 const owning=new Map();for(const e of graph.edges){const from=nodes.get(e.from),to=nodes.get(e.to);if(!from||!to){errors.push('ORPHAN_GRAPH_EDGE:'+e.id);continue;}if(!e.evidenceIds?.length||e.evidenceIds.some(id=>!evidence.has(id)))errors.push('GRAPH_EDGE_EVIDENCE:'+e.id);
 if(e.status==='verified'&&e.relation==='owned-by'){if(from.type!=='team'||!['organization','association'].includes(to.type))errors.push('WRONG_PARENT_TYPE:'+e.id);if(owning.has(e.from)&&owning.get(e.from)!==e.to)errors.push('MULTIPLE_TEAM_OWNERS:'+e.from);owning.set(e.from,e.to);}
 if(e.status==='verified'&&from.sport&&to.sport&&from.sport!==to.sport)errors.push('CROSS_SPORT_GRAPH:'+e.id);
 }
 return {valid:errors.length===0,errors};
}
