import {hash,stableID,normalize,SPORTS,REGIONS,PROGRAMS,eventState} from './models.mjs';
export const DESIGNATIONS=['youth','high-school','college','adult','professional','community'];
export const designationLabels={youth:'Youth Clubs & Programs','high-school':'High School',college:'College',adult:'Adult Leagues',professional:'Semi-Professional & Professional',community:'Community & Recreation'};
export const SWIM_TYPES=['year-round-competitive','seasonal-competitive','summer-recreational','high-school','collegiate','masters','unknown'];
export const LEVELS=['recreational','competitive','select','elite','development','high-school','collegiate','adaptive','unknown'];
export const GENDERS=['boys','girls','coed','men','women'];
export const emptyRegistration=()=>({method:'unknown',status:'unknown',url:null,tryoutRequirement:'unknown',tryoutStatus:'unknown',verifiedAt:null,opens:null,closes:null,evidenceIds:[]});
export function program(input){return {kind:'program',designation:null,programKind:'participation',programType:'unknown',swimType:'unknown',genders:[],levels:[],ages:{min:null,max:null},grades:{min:null,max:null},city:null,region:null,serviceArea:null,communityBased:false,registration:emptyRegistration(),locationIds:[],relatedRecordIds:[],leagueIds:[],evidenceIds:[],reviewStatus:'needs-review',reviewer:null,reviewedAt:null,reason:null,...input};}
export function programID(organizationId,sport,designation,track='general'){return stableID('program',organizationId,sport,designation,track);}
export function effectiveRegistration(registration,asOf=new Date().toISOString().slice(0,10)){
 const r={...emptyRegistration(),...registration};
 // A participant or a registration URL alone never proves current availability.
 if(!r.evidenceIds.length||!r.verifiedAt||!r.opens||!r.closes)return {...r,status:'unknown',asOf};
 if(asOf>r.closes)return {...r,status:'closed',asOf};
 if(asOf<r.opens)return {...r,status:'upcoming',asOf};
 if(r.status!=='open'||r.verifiedAt.slice(0,10)<asOf)return {...r,status:'unknown',asOf};
 return {...r,asOf};
}
export function canonicalID(id,links=[]){const seen=new Set();while(links.some(l=>l.from===id&&l.reviewStatus==='verified')){if(seen.has(id))throw Error('Canonical identity cycle');seen.add(id);id=links.find(l=>l.from===id&&l.reviewStatus==='verified').to;}return id;}
export function validateParticipation(snapshot,{entities=[],evidence=[],records=[],asOf=new Date().toISOString().slice(0,10)}={}){
 const errors=[],byId=new Map(entities.map(e=>[e.id,e])),ev=new Map(evidence.map(e=>[e.id,e])),programs=snapshot.programs||[],programMap=new Map(programs.map(p=>[p.id,p])),seen=new Set();
 for(const link of snapshot.canonicalLinks||[]){if(!byId.has(link.from)||!byId.has(link.to)||byId.get(link.from)?.kind!=='organization'||byId.get(link.to)?.kind!=='organization'||!link.reviewer||!link.reviewedAt||!link.reason||!link.evidenceIds?.length||link.reviewStatus!=='verified')errors.push('INVALID_CANONICAL_LINK:'+link.from);try{canonicalID(link.from,snapshot.canonicalLinks);}catch{errors.push('CANONICAL_CYCLE:'+link.from);}}
 for(const p of programs){
  if(!p.id||seen.has(p.id))errors.push('DUPLICATE_PROGRAM:'+p.id);seen.add(p.id);
  const org=byId.get(p.organizationId);if(!org||org.kind!=='organization')errors.push('PROGRAM_PARENT:'+p.id);
  if(!SPORTS.includes(p.sport)||org?.sports?.length&&!org.sports.includes(p.sport))errors.push('PROGRAM_CROSS_SPORT:'+p.id);
  if(p.reviewStatus==='verified'&&(!DESIGNATIONS.includes(p.designation)||!p.reviewer||!p.reviewedAt||!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewedAt)||!Number.isFinite(Date.parse(p.reviewedAt))||!p.reason))errors.push('UNREVIEWED_CLASSIFICATION:'+p.id);
  if(!PROGRAMS.includes(p.programType))errors.push('INVALID_PROGRAM_TYPE:'+p.id);const typedSport=p.programType.includes('swimming')?'swimming':p.programType.includes('volleyball')?'volleyball':p.programType.includes('lacrosse')?'lacrosse':p.programType==='basketball'?'basketball':null;if(typedSport&&typedSport!==p.sport)errors.push('PROGRAM_FORMAT_CROSS_SPORT:'+p.id);
  if(!p.evidenceIds?.length||p.evidenceIds.some(id=>!ev.has(id)))errors.push('PROGRAM_EVIDENCE:'+p.id);
  if(p.genders?.some(g=>!GENDERS.includes(g))||p.levels?.some(l=>!LEVELS.includes(l)))errors.push('INVALID_PARTICIPATION_FIELDS:'+p.id);
  if(p.region&&!REGIONS.includes(p.region))errors.push('INVALID_PROGRAM_REGION:'+p.id);
  for(const key of ['ages','grades']){const v=p[key]||{};if(Object.values(v).some(x=>x!==null&&(!Number.isInteger(x)||x<0))||v.min!==null&&v.max!==null&&v.min>v.max||key==='grades'&&Object.values(v).some(x=>x!==null&&x>12))errors.push('INVALID_'+key.toUpperCase()+':'+p.id);}
  if(p.sport==='swimming'&&(!SWIM_TYPES.includes(p.swimType)||p.swimType==='masters'&&p.designation!=='adult'||['high-school','collegiate'].includes(p.swimType)&&p.designation!==(p.swimType==='high-school'?'high-school':'college')))errors.push('SWIM_DESIGNATION:'+p.id);
  const swimMapping={'year-round-competitive':'year-round-usa-swimming','seasonal-competitive':'seasonal-usa-swimming','summer-recreational':'summer-swimming','high-school':'high-school-swimming',collegiate:'collegiate-swimming',masters:'masters-swimming'};if(p.sport==='swimming'&&p.swimType!=='unknown'&&p.programType!==swimMapping[p.swimType])errors.push('MIXED_SWIM_MEMBERSHIP:'+p.id);
  if(p.sport!=='swimming'&&p.swimType!=='unknown')errors.push('CROSS_SPORT_SWIM_TYPE:'+p.id);
  for(const id of p.locationIds||[])if(byId.get(id)?.kind!=='location')errors.push('PROGRAM_LOCATION:'+p.id+':'+id);
  for(const id of p.leagueIds||[])if(byId.get(id)?.kind!=='league')errors.push('PROGRAM_LEAGUE:'+p.id+':'+id);
  const registration={...emptyRegistration(),...p.registration};if(!['unknown','individual','team','both'].includes(registration.method)||!['unknown','open','closed','upcoming'].includes(registration.status)||!['unknown','required','not-required'].includes(registration.tryoutRequirement))errors.push('INVALID_REGISTRATION:'+p.id);
  if(registration.url&&!/^https:\/\//.test(registration.url))errors.push('INVALID_REGISTRATION_URL:'+p.id);
  if(registration.status==='open'&&effectiveRegistration(registration,asOf).status!=='open')errors.push('UNVERIFIED_OPEN_REGISTRATION:'+p.id);
 }
 for(const r of snapshot.registrations||[]){const p=programMap.get(r.programId);if(!p||p.organizationId!==r.organizationId)errors.push('REGISTRATION_PARENT:'+r.id);if(!r.evidenceIds?.length||r.evidenceIds.some(id=>!ev.has(id)))errors.push('REGISTRATION_EVIDENCE:'+r.id);if(r.status==='open'&&effectiveRegistration(r,asOf).status!=='open')errors.push('UNVERIFIED_REGISTRATION_OPPORTUNITY:'+r.id);}
 const linked=new Set();for(const a of snapshot.teamAssignments||[]){const team=byId.get(a.teamId),p=programMap.get(a.programId);if(!team||team.kind!=='team'||!p)errors.push('ORPHAN_TEAM_PROGRAM:'+a.teamId);else{
  if(linked.has(a.teamId))errors.push('DUPLICATE_TEAM_ASSIGNMENT:'+a.teamId);linked.add(a.teamId);
  if(team.sport!==p.sport)errors.push('TEAM_PROGRAM_CROSS_SPORT:'+a.teamId);
  if(canonicalID(team.organizationId,snapshot.canonicalLinks)!==p.organizationId){const correction=a.parentCorrection;if(!correction||correction.from!==team.organizationId||correction.to!==p.organizationId||!correction.reviewer||!correction.reviewedAt||!correction.evidenceIds?.length||correction.evidenceIds.some(id=>!ev.has(id)))errors.push('WRONG_TEAM_PARENT:'+a.teamId);}
  if(a.reviewStatus!=='verified'||!a.evidenceIds?.length||a.evidenceIds.some(id=>!ev.has(id))||!a.reason)errors.push('UNREVIEWED_TEAM_PARENT:'+a.teamId);
  if(['league-organizer','event-organizer'].includes(byId.get(p.organizationId)?.category)&&(!Array.isArray(a.parentOwnershipEvidence)||!a.parentOwnershipEvidence.length||a.parentOwnershipEvidence.some(id=>!ev.has(id))))errors.push('ORGANIZER_NOT_TEAM_PARENT:'+a.teamId);
 }}
 const classified=new Set([...programs.filter(p=>p.reviewStatus==='verified').map(p=>p.organizationId),...(snapshot.teamAssignments||[]).map(a=>a.teamId)]),queued=new Set((snapshot.exceptions||[]).filter(e=>e.status!=='resolved').map(e=>e.entityId));
 for(const e of entities.filter(e=>['organization','team'].includes(e.kind)&&e.reviewStatus==='verified'))if(!classified.has(canonicalID(e.id,snapshot.canonicalLinks))&&!classified.has(e.id)&&!queued.has(e.id))errors.push('SILENTLY_UNCLASSIFIED:'+e.id);
 return {valid:!errors.length,errors:[...new Set(errors)]};
}
export function classificationReport(snapshot,entities){
 const activeExceptions=snapshot.exceptions.filter(e=>e.status!=='resolved');
 const active=entities.filter(e=>e.reviewStatus==='verified'),programs=snapshot.programs.filter(p=>p.reviewStatus==='verified');
 return {generatedAt:snapshot.generatedAt,statewideComplete:false,classificationComplete:false,originalRecordsRetained:entities.length,programs:programs.length,assignedTeams:snapshot.teamAssignments.length,exceptions:activeExceptions,exceptionCount:activeExceptions.length,resolvedExceptions:snapshot.exceptions.length-activeExceptions.length,sports:SPORTS.map(sport=>({sport,programs:programs.filter(p=>p.sport===sport).length,canonicalOrganizations:new Set(programs.filter(p=>p.sport===sport).map(p=>p.organizationId)).size,teams:snapshot.teamAssignments.filter(a=>active.some(t=>t.id===a.teamId&&t.sport===sport)).length,byDesignation:Object.fromEntries(DESIGNATIONS.map(d=>[d,programs.filter(p=>p.sport===sport&&p.designation===d).length])),unresolved:activeExceptions.filter(e=>e.sport===sport||e.sports?.includes(sport)).length,regions:REGIONS.map(region=>({region,programs:programs.filter(p=>p.sport===sport&&p.region===region).length,status:programs.some(p=>p.sport===sport&&p.region===region)?'partial':'gap'}))}))};
}
