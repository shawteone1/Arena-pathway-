import {readFileSync} from 'node:fs';
import {catalog,engineSnapshot,sourceFor as engineSource} from './engine-directory.mjs';
import {canonicalID,effectiveRegistration,classificationReport,validateParticipation,designationLabels} from '../engine/participation.mjs';
export const participation=JSON.parse(readFileSync(new URL('../data/unified/catalog.json',import.meta.url),'utf8'));
const normalized=new Map(engineSnapshot.entities.map(e=>[e.id,e]));
const validity=validateParticipation(participation,{entities:engineSnapshot.entities,evidence:engineSnapshot.evidence});if(!validity.valid)throw Error('Invalid published participation graph: '+validity.errors.join(', '));
export const reviewReport=classificationReport(participation,engineSnapshot.entities);
const allLegacy=[...catalog.organizations,...catalog.schools,...catalog.teams,...catalog.leagues,...catalog.divisions,...catalog.opportunities,...catalog.communities,...(catalog.locations||[])];
const oldById=new Map(allLegacy.map(e=>[e.id,e]));
const ev=new Map(engineSnapshot.evidence.map(e=>[e.id,e]));
export const evidenceFor=ids=>ids.map(id=>ev.get(id)).filter(Boolean);
export const sourceFor=r=>(r.sourceIds?.length?engineSource(r):null)||catalog.sources.find(s=>s.id===r.evidenceIds?.[0])||{id:r.evidenceIds?.[0],url:ev.get(r.evidenceIds?.[0])?.url,title:ev.get(r.evidenceIds?.[0])?.sourceId||'Verified source',reviewedAt:ev.get(r.evidenceIds?.[0])?.fetchedAt?.slice(0,10)};
export const organizationFor=id=>{id=canonicalID(id,participation.canonicalLinks);return normalized.get(id)?.kind==='organization'?(oldById.get(id)||normalized.get(id)):undefined;};
const legacyEvidenceIds=p=>p.evidenceIds.map(id=>catalog.sources.some(s=>s.id===id)?id:id.startsWith('legacy-')?id.slice(7):id).filter(id=>(catalog.sources.some(s=>s.id===id)||ev.has(id)));
export function sourceWarnings(p){const legacyMap={skyline:'volley-skyline',dj:'volley-denver-juniors',cbc:'basket-cbc'};const ids=new Set(p.evidenceIds.map(id=>id.startsWith('legacy-')?legacyMap[id.slice(7)]:ev.get(id)?.sourceId).filter(Boolean));return [...ids].flatMap(id=>{const latest=engineSnapshot.runs.filter(r=>r.source_id===id).at(-1);return latest?.status==='blocked'?[id+': latest access is blocked; prior verified facts are retained.']:latest?.report.missing?.length?[id+': '+latest.report.missing.length+' independently expected records missing in latest extraction; current participation needs confirmation.']:[];});}
export const programs=participation.programs.filter(p=>p.reviewStatus==='verified').map(p=>{const value={...p,sourceIds:legacyEvidenceIds(p),sourceWarnings:sourceWarnings(p)};Object.defineProperty(value,'registration',{enumerable:true,get:()=>effectiveRegistration(p.registration)});return value;});
export const programsFor=(id,sport)=>programs.filter(p=>p.organizationId===canonicalID(id,participation.canonicalLinks)&&(!sport||p.sport===sport));
export function teamsFor(id,sport){const ps=programsFor(id,sport);return participation.teamAssignments.filter(a=>ps.some(p=>p.id===a.programId)).map(a=>{const raw=normalized.get(a.teamId),r=oldById.get(a.teamId)||raw,p=ps.find(p=>p.id===a.programId);return {...r,kind:'team',programId:p.id,organizationId:p.organizationId,designation:p.designation,evidenceIds:a.evidenceIds,sourceIds:r.sourceIds||legacyEvidenceIds(p),season:r.seasonId?normalized.get(r.seasonId)?.name:r.season||null,classificationStatus:'verified',programType:p.programType};});}
const normalizedText=s=>String(s||'').toLowerCase();
function matches(p,params){
 const term=normalizedText(params.get('q')),org=organizationFor(p.organizationId),children=teamsFor(p.organizationId,p.sport).filter(t=>t.programId===p.id);
 const searchable=[p.name,org?.name,...(org?.aliases||[]),p.serviceArea,p.city,...children.map(t=>t.name)].join(' ').toLowerCase();
 if(term&&!searchable.includes(term))return false;
 if(params.get('city')&&p.city!==params.get('city'))return false;
 if(params.get('region')&&(p.region||'unknown')!==params.get('region'))return false;
 if(params.get('gender')&&(params.get('gender')==='unknown'?p.genders.length:p.genders.indexOf(params.get('gender'))<0))return false;
 if(params.get('level')&&(params.get('level')==='unknown'?p.levels.length:!p.levels.includes(params.get('level'))))return false;
 const format=params.get('format')||({ 'year-round':'year-round-competitive','summer-league':'summer-recreational','high-school':'high-school',collegiate:'collegiate',seasonal:'seasonal-competitive',masters:'masters',unclassified:'unknown'})[params.get('program')];
 if(format&&p.swimType!==format)return false;
 if(params.get('competitionType')&&p.programType!==params.get('competitionType')&&p.programKind!==params.get('competitionType'))return false;
 for(const [key,range]of [['age',p.ages],['grade',p.grades]]){const wanted=params.get(key);if(!wanted)continue;if(wanted==='unknown'){if(range.min!==null||range.max!==null)return false;}else {const n=Number(wanted);if(!Number.isInteger(n)||range.min===null&&range.max===null||range.min!==null&&range.max!==null&&(n<range.min||n>range.max)||range.min===null&&range.max!==n||range.max===null&&range.min!==n)return false;}}
 if(params.get('registration')&&p.registration.status!==params.get('registration'))return false;
 if(params.get('registrationMethod')&&p.registration.method!==params.get('registrationMethod'))return false;
 if(params.get('tryout')&&p.registration.tryoutRequirement!==params.get('tryout'))return false;
 if(params.get('season')&&!children.some(t=>(t.seasonId||'unknown')===params.get('season')))return false;
 return true;
}
export function directory(sport,designation='youth',params=new URLSearchParams()){
 const context=designation==='community'?p=>p.designation==='community'||p.communityBased:p=>p.designation===designation;
 let selected=programs.filter(p=>p.sport===sport&&context(p)&&matches(p,params));
 const kind=params.get('kind')||'club';
 if(kind==='league')selected=selected.filter(p=>p.programKind==='league');else if(!['team','division','location'].includes(kind))selected=selected.filter(p=>p.programKind!=='league'||designation==='adult');
 if(kind==='location')return (catalog.locations||[]).filter(l=>l.sport===sport&&designation==='community'&&(!params.get('region')||l.region===params.get('region'))&&(!params.get('q')||normalizedText(l.name).includes(normalizedText(params.get('q'))))).map(l=>({...l,kind:'location',facilityOnly:true,programs:[]}));
 const grouped=new Map();for(const p of selected){if(!grouped.has(p.organizationId))grouped.set(p.organizationId,[]);grouped.get(p.organizationId).push(p);}
 const results=[...grouped].map(([id,ps])=>{const organization=organizationFor(id),allTeams=teamsFor(id,sport).filter(t=>ps.some(p=>p.id===t.programId)),q=normalizedText(params.get('q'));return {...organization,id,sport,kind:kind==='league'?'league':organization.kind||'club',organization,programs:ps,teams:allTeams,matchedTeams:q?allTeams.filter(t=>normalizedText(t.name).includes(q)):[],designation,sourceIds:organization.sourceIds||ps.flatMap(p=>p.sourceIds),profileURL:'/organizations/'+encodeURIComponent(id)+'?sport='+sport};});
 if(kind==='team')return results.flatMap(r=>r.teams.filter(t=>!params.get('q')||normalizedText(t.name).includes(normalizedText(params.get('q')))).map(t=>({...t,organization:r.organization,profileURL:r.profileURL+'#teams',programs:r.programs.filter(p=>p.id===t.programId)})));
 if(kind==='division')return results.flatMap(r=>[...new Set(r.teams.map(t=>t.divisionId).filter(Boolean))].map(id=>({...normalized.get(id),kind:'division',organization:r.organization,profileURL:r.profileURL+'#teams',programs:r.programs})));
 return results.sort((a,b)=>a.name.localeCompare(b.name));
}
export function opportunities(sport,designation,kind,params=new URLSearchParams()){
 const scope=programs.filter(p=>p.sport===sport&&(p.designation===designation||designation==='community'&&p.communityBased));
 const ids=new Set(scope.flatMap(p=>p.relatedRecordIds));
 return catalog.opportunities.filter(r=>ids.has(r.id)&&(!kind||r.kind===kind)&&(!params.get('q')||[r.name,r.summary].join(' ').toLowerCase().includes(params.get('q').toLowerCase()))).map(r=>{const p=scope.find(p=>p.relatedRecordIds.includes(r.id));const start=r.start||r.startDate,asOf=new Date().toISOString().slice(0,10);return {...r,organizationId:p.organizationId,programId:p.id,designation:p.designation,scheduleState:!start?'date-unconfirmed':(r.end||start)<asOf?'historical':r.seasonId&&r.dateConfidence==='published'?'published-upcoming':'needs-review',profileURL:'/organizations/'+p.organizationId+'?sport='+sport};});
}
const programEvidence=[...new Set(programs.flatMap(p=>p.sourceIds))].filter(id=>!catalog.sources.some(s=>s.id===id)).map(id=>{const e=ev.get(id);return {id,url:e.url,title:e.sourceId,reviewedAt:e.fetchedAt.slice(0,10),scope:'reviewed-program-evidence',evidence:'Published organization/program fields; registration availability is separate.'};});
export const clientCatalog={...catalog,siemOpportunities:[...new Map(['lacrosse','volleyball','basketball','swimming'].flatMap(s=>opportunities(s,'youth')).map(o=>[o.id,o])).values()],registrationOpportunities:(participation.registrations||[]).filter(r=>programs.some(p=>p.id===r.programId)),savedRecordArchive:participation.programs.filter(p=>p.reviewStatus!=='verified').map(p=>({...p,sourceIds:legacyEvidenceIds(p),summary:'Retained saved program; '+p.reviewStatus+'. '+p.reason})),sources:[...catalog.sources,...programEvidence],programs,participation:{moduleVersion:2,programs,teamAssignments:participation.teamAssignments,organizationIds:[...new Set(programs.map(p=>p.organizationId))],exceptions:participation.exceptions.map(e=>({entityId:e.entityId,code:e.code,reason:e.reason})),labels:designationLabels}};
