import {createHash} from 'node:crypto';
export const KINDS=['organization','team','league','division','competition','season','event','location','community'];
export const SPORTS=['lacrosse','volleyball','basketball','swimming'];
export const REGIONS=['denver-metro','northern-front-range','pikes-peak','eastern-plains','southeast','southwest','western-slope','central-mountains','san-luis-valley'];
export const PROGRAMS=['year-round-usa-swimming','seasonal-usa-swimming','masters-swimming','summer-swimming','high-school-swimming','collegiate-swimming','indoor-volleyball','beach-volleyball','other-volleyball','field-lacrosse','box-lacrosse','basketball','unknown'];
export const normalize=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
export const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
export const stableID=(kind,...parts)=>'co-'+kind+'-'+hash(parts.map(normalize).join('|')).slice(0,20);
export function identity(e){if(e.kind==='organization')return ['organization',normalize(e.name),e.state||'?'].join('|');if(e.kind==='team')return ['team',e.organizationId||e.leagueId||'?',normalize(e.name),e.sport,e.seasonId||'unknown',e.divisionId||'unknown',e.genders?.join(',')||'unknown'].join('|');return [e.kind,e.sport||'',e.leagueId||'',e.competitionId||'',normalize(e.name),e.seasonId||''].join('|');}
export function entity(input){return {aliases:[],sports:input.sport?[input.sport]:[],state:null,region:null,city:null,genders:[],levels:[],programType:'unknown',audience:'unknown',organizationId:null,leagueId:null,divisionId:null,competitionId:null,seasonId:null,locationIds:[],evidenceIds:[],reviewStatus:'candidate',lastVerifiedAt:null,...input};}
export function eventState(event,asOf=new Date().toISOString().slice(0,10)){if(!event.startDate)return 'date-unconfirmed';if(!event.seasonId||event.dateConfidence!=='published')return 'needs-review';return (event.endDate||event.startDate)<asOf?'historical':'published-upcoming';}
export function validateEntities(entities,{asOf=new Date().toISOString().slice(0,10)}={}){
 const errors=[],ids=new Map(),identities=new Map();
 for(const e of entities){if(ids.has(e.id))errors.push('DUPLICATE_ID:'+e.id);ids.set(e.id,e);if(!e.id||!e.name||!KINDS.includes(e.kind))errors.push('INVALID_ENTITY:'+e.id);if(e.sport&&!SPORTS.includes(e.sport))errors.push('INVALID_SPORT:'+e.id);if((e.sports||[]).some(s=>!SPORTS.includes(s)))errors.push('INVALID_SPORTS:'+e.id);if(!e.evidenceIds?.length)errors.push('MISSING_EVIDENCE:'+e.id);if(e.region&&!REGIONS.includes(e.region))errors.push('INVALID_REGION:'+e.id);if(e.state&&e.state!=='CO')errors.push('NON_COLORADO:'+e.id);if(!PROGRAMS.includes(e.programType||'unknown'))errors.push('INVALID_PROGRAM:'+e.id);
  const key=identity(e);if(identities.has(key)&&identities.get(key)!==e.id)errors.push('DUPLICATE_IDENTITY:'+e.id);identities.set(key,e.id);
  if(e.kind==='organization')for(const alias of [e.name,...(e.aliases||[])]){const key='alias|'+normalize(alias)+'|'+e.state;if(identities.has(key)&&identities.get(key)!==e.id)errors.push('DUPLICATE_ORGANIZATION:'+e.id);identities.set(key,e.id);}
  if(e.sport&&e.programType&&e.programType!=='unknown'){const expectedSport=e.programType.includes('swimming')?'swimming':e.programType.includes('volleyball')?'volleyball':e.programType.includes('lacrosse')?'lacrosse':e.programType==='basketball'?'basketball':null;if(expectedSport&&e.sport!==expectedSport)errors.push('CROSS_SPORT_PROGRAM:'+e.id);}
  if(e.sport==='swimming'&&e.programType==='summer-swimming'&&e.affiliations?.includes('year-round-USA-Swimming'))errors.push('MIXED_SWIM_CLASSIFICATION:'+e.id);
  if(e.kind==='event'&&e.current===true&&eventState(e,asOf)!=='published-upcoming')errors.push('STALE_EVENT:'+e.id);
  if(e.startDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(e.startDate)||!Number.isFinite(Date.parse(e.startDate))||e.endDate&&e.endDate<e.startDate))errors.push('INVALID_DATES:'+e.id);
 }
 for(const e of entities){
  const required=e.legacy?(e.kind==='team'?['organizationId']:e.kind==='division'?['leagueId']:[]):{team:['organizationId'],division:['leagueId','seasonId'],season:['competitionId'],event:['seasonId','competitionId']}[e.kind]||[];
  for(const key of required)if(!e[key])errors.push('ORPHAN_'+key+':'+e.id);
  for(const [field,kind] of Object.entries({organizationId:'organization',leagueId:'league',divisionId:'division',competitionId:'competition',seasonId:'season'})){
   if(!e[field])continue;const parent=ids.get(e[field]);if(!parent||parent.kind!==kind){errors.push('ORPHAN_'+field+':'+e.id);continue;}
   if(e.sport&&parent.sport&&e.sport!==parent.sport||e.sport&&parent.kind==='organization'&&!parent.sports.includes(e.sport))errors.push('CROSS_SPORT:'+e.id+':'+field);
   if(e.programType==='summer-swimming'&&parent.programType==='year-round-usa-swimming'||e.programType==='year-round-usa-swimming'&&parent.programType==='summer-swimming')errors.push('MIXED_SWIM_CLASSIFICATION:'+e.id);
  }
  if(e.seasonId){const s=ids.get(e.seasonId);if(e.leagueId&&s?.leagueId&&e.leagueId!==s.leagueId)errors.push('WRONG_LEAGUE:'+e.id);if(e.competitionId&&s?.competitionId!==e.competitionId)errors.push('WRONG_COMPETITION:'+e.id);if(e.divisionId&&ids.get(e.divisionId)?.seasonId!==e.seasonId)errors.push('WRONG_SEASON:'+e.id);if(e.kind==='event'&&s?.startDate&&e.startDate&&(e.startDate<s.startDate||e.startDate>(s.endDate||'9999')))errors.push('EVENT_OUTSIDE_SEASON:'+e.id);}
 }
 return {valid:!errors.length,errors:[...new Set(errors)]};
}
export function reconcile({source,manifest,rows,pages=[],frontier=[],previousCount=null,decreaseReason=null}){
 const outcomes={candidate:rows.length,imported:0,excluded:0,duplicate:0,unresolved:0},seen=new Set(),errors=[];
 for(const r of rows){if(seen.has(r.sourceRecordId)){errors.push('DUPLICATE_SOURCE_ROW:'+r.sourceRecordId);continue;}seen.add(r.sourceRecordId);if(r.decision==='import')outcomes.imported++;else if(r.decision==='duplicate'&&r.reason)outcomes.duplicate++;else if(r.decision==='exclude'&&r.reason)outcomes.excluded++;else outcomes.unresolved++;}
 const expected=manifest?.expectedRecordIds||[],missing=expected.filter(id=>!seen.has(id)),unexpected=[...seen].filter(id=>!expected.includes(id));
 if(!manifest?.reviewedAt||!manifest?.reviewer||!manifest?.evidenceURL||!expected.length)errors.push('NO_INDEPENDENT_EXPECTATION');
 if(missing.length)errors.push('MISSING_EXPECTED_ROWS');if(unexpected.length)errors.push('UNREVIEWED_ROWS');
 if(!pages.some(p=>p.extractedRows>0&&p.role!=='landing'))errors.push('LANDING_ONLY');
 if(frontier.some(f=>f.status!=='processed'&&f.status!=='excluded'))errors.push('UNRESOLVED_FRONTIER');
 if(pages.some(p=>p.paginationUnresolved))errors.push('UNRESOLVED_PAGINATION');
 if(outcomes.unresolved)errors.push('UNRESOLVED_RECORDS');
 if(previousCount!==null&&outcomes.imported+outcomes.duplicate<previousCount&&!decreaseReason)errors.push('UNEXPLAINED_DECREASE');
 if(manifest?.scopeClosed!==true)errors.push('OPEN_SOURCE_SCOPE');
 if(manifest?.expectedPageURLs?.some(url=>!pages.some(p=>p.url===url&&p.status==='processed')))errors.push('MISSING_EXPECTED_PAGE');
 const blocked=pages.length>0&&pages.every(p=>p.status==='blocked');
 const status=blocked?'blocked':errors.length?(errors.some(x=>['UNEXPLAINED_DECREASE','UNRESOLVED_RECORDS','UNREVIEWED_ROWS'].includes(x))?'needs-review':'partial'):'complete';
 return {sourceId:source.id,status,counts:outcomes,expected:expected.length||null,captured:expected.filter(id=>seen.has(id)).length,missing,unexpected,errors,scope:manifest?.scope||source.scope,statewideComplete:false};
}
