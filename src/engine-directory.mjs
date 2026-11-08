import {readFileSync,existsSync} from 'node:fs';
import {catalog as base,directoryRows as baseRows,sourceFor as baseSource} from './catalog.mjs';
import {coverageReport} from '../engine/coverage.mjs';
import {eventState} from '../engine/models.mjs';
const path=new URL('../data/engine/approved.json',import.meta.url);
export const engineSnapshot=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{entities:[],evidence:[],runs:[],sources:[]};
export const catalog=structuredClone(base);
const registry=JSON.parse(readFileSync(new URL('../data/engine/registry.json',import.meta.url),'utf8'));
export const engineCoverage=coverageReport(engineSnapshot,registry);
const evidence=new Map(engineSnapshot.evidence.map(e=>[e.id,e]));
const approvedEvidence=new Set(engineSnapshot.entities.filter(e=>e.reviewStatus==='verified'&&!e.legacy).flatMap(e=>e.evidenceIds));
for(const e of engineSnapshot.evidence){if(!approvedEvidence.has(e.id))continue;const s=registry.find(s=>s.id===e.sourceId);catalog.sources.push({id:e.id,title:s?.title||e.sourceId,url:e.url,reviewedAt:e.fetchedAt.slice(0,10),scope:'approved-engine-evidence',evidence:'Reviewed organizational fact: '+(e.facts.name||'Source record')+'. Unknown fields remain unclassified.'});}
export const published=engineSnapshot.entities.filter(e=>!e.legacy&&e.reviewStatus==='verified');
const meta=e=>({engine:true,region:e.region,genders:e.genders,levels:e.levels,programType:e.programType,seasonId:e.seasonId,competitionId:e.competitionId,audience:e.audience,lastVerifiedAt:e.lastVerifiedAt});
for(const e of published){
 const sourceIds=e.evidenceIds.filter(id=>catalog.sources.some(s=>s.id===id));if(!sourceIds.length)continue;
 const r={...e,...meta(e),sourceIds,season:e.seasonId?engineSnapshot.entities.find(s=>s.id===e.seasonId)?.name:null};
 if(e.kind==='organization')(e.category==='school'?catalog.schools:catalog.organizations).push({...r,sport:e.sport||e.sports?.[0],kind:e.category==='school'?'school':e.category==='club'&&e.sport==='swimming'?'swim-team':'club'});
 else if(e.kind==='team')catalog.teams.push({...r,kind:'team',division:e.divisionId?engineSnapshot.entities.find(d=>d.id===e.divisionId)?.name:null});
 else if(e.kind==='league')catalog.leagues.push(r);
 else if(e.kind==='division')catalog.divisions.push(r);
 else if(e.kind==='community')catalog.communities.push({...r,kind:'community'});
 else if(e.kind==='location'){catalog.locations??=[];catalog.locations.push({...r,kind:'location'});}
 else if(e.kind==='event'&&e.startDate)catalog.opportunities.push({...r,kind:'game',start:e.startDate,end:e.endDate||e.startDate,status:eventState(e),scheduleState:eventState(e)});
}
export const sourceFor=r=>catalog.sources.find(s=>s.id===r.sourceIds?.[0])||baseSource(r);
const cities={Denver:'denver-metro',Englewood:'denver-metro',Centennial:'denver-metro','Castle Rock':'denver-metro',Windsor:'northern-front-range',Loveland:'northern-front-range','Fort Collins':'northern-front-range','Grand Junction':'western-slope',Durango:'southwest','Colorado Springs':'pikes-peak'};
export function directoryRows(sport){
 const added=published.filter(e=>e.sport===sport||e.sports?.includes(sport)).filter(e=>['organization','team','league','division','location','community'].includes(e.kind)).map(e=>{
  const r=[...catalog.organizations,...catalog.schools,...catalog.teams,...catalog.leagues,...catalog.divisions,...catalog.communities,...(catalog.locations||[])].find(r=>r.id===e.id)||{...e,sourceIds:e.evidenceIds};
  const parent=e.organizationId?engineSnapshot.entities.find(p=>p.id===e.organizationId):null;
  return {...r,sport,city:e.city||parent?.city||null,state:'CO',region:e.region||parent?.region||null,kind:e.kind==='organization'?(e.category==='school'?'school':e.sport==='swimming'&&e.category==='club'?'swim-team':e.category==='parks-recreation'?'community':'club'):e.kind,summary:e.summary||'Source-backed '+e.kind+'; unspecified details remain unknown.'};
 });
 return [...baseRows(sport).map(r=>({...r,region:r.locationStatus?null:cities[r.city]||null,genders:[],levels:[],programType:null})),...added];
}
export function filterEngineRows(rows,params){return rows.filter(r=>(!params.get('q')||[r.name,r.city,r.summary,...(r.aliases||[])].join(' ').toLowerCase().includes(params.get('q').toLowerCase()))&&(!params.get('kind')||r.kind===params.get('kind'))&&(!params.get('city')||r.city===params.get('city'))&&(!params.get('competitionType')||(r.programType&&r.programType!=='unknown'?r.programType:r.leagueId?'league':'unknown')===params.get('competitionType'))&&(!params.get('region')||(r.region||'unknown')===params.get('region'))&&(!params.get('gender')||(r.genders?.length?r.genders.includes(params.get('gender')):params.get('gender')==='unknown'))&&(!params.get('level')||(r.levels?.length?r.levels.includes(params.get('level')):params.get('level')==='unknown'))&&(!params.get('season')||(r.seasonId||'unknown')===params.get('season'))&&(!params.get('competition')||(r.competitionId||'unknown')===params.get('competition')));}
export function programFor(record,baseClassifier){if(record.programType==='summer-swimming')return 'summer-league';if(record.programType==='year-round-usa-swimming')return 'year-round';if(record.programType==='high-school-swimming')return 'high-school';if(record.programType==='collegiate-swimming')return 'collegiate';return baseClassifier(record)||(record.sport==='swimming'&&record.kind==='team'?'unclassified':null);}
