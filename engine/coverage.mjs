import {SPORTS,REGIONS} from './models.mjs';
export function coverageReport(snapshot,registry=snapshot.sources||[]){
 const entities=snapshot.entities||[],runs=snapshot.runs||[];
 return {generatedAt:snapshot.generatedAt||null,scheduler:snapshot.scheduler||{configured:false,tested:false,operational:false},statewideComplete:false,sports:SPORTS.map(sport=>{
  const sources=registry.filter(s=>(s.sports||[s.sport]).includes(sport)).map(source=>{
   const relevant=runs.filter(r=>r.source_id===source.id),latest=relevant.at(-1),approved=[...relevant].reverse().find(r=>r.approved_at);
   return {id:source.id,title:source.title,url:source.urls?.[0]||null,status:latest?.status||'discovered',attempted:!!latest,processed:!!latest?.report.pages?.some(p=>p.status==='processed'),runId:latest?.id||null,approved:!!approved,latestVerificationDate:latest?.report.latestVerificationDate||null,expected:latest?.report.expected??null,captured:latest?.report.captured||0,counts:latest?.report.counts||{candidate:0,imported:0,duplicate:0,excluded:0,unresolved:0},missing:latest?.report.missing||[],issues:latest?.report.errors||[],frontierPending:latest?.report.frontier?.filter(f=>!['processed','excluded'].includes(f.status)).length||0};
  });
  const published=entities.filter(e=>!e.legacy&&e.reviewStatus==='verified'&&(e.sport===sport||e.sports?.includes(sport)));
  return {sport,sources,discoveredSources:sources.length,attemptedSources:sources.filter(s=>s.attempted).length,processedSources:sources.filter(s=>s.processed).length,organizations:published.filter(e=>e.kind==='organization').length,teams:published.filter(e=>e.kind==='team').length,regions:REGIONS.map(region=>({region,organizations:published.filter(e=>e.kind==='organization'&&e.region===region).length,teams:published.filter(e=>e.kind==='team'&&e.region===region).length,status:published.some(e=>e.region===region)?'partial':'gap'})),latestVerificationDate:sources.map(s=>s.latestVerificationDate).filter(Boolean).sort().at(-1)||null,gaps:['Statewide denominator unknown; source subsets are not a statewide census.','School, parks, adaptive, nonprofit, facility, elite, recreational and gender coverage remains incomplete.','Unclassified geography, participation, gender and seasons remain unknown.','Blocked or client-rendered source memberships require publisher-supported access or manual evidence review.']};
 })};
}
