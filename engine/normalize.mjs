import {readFileSync} from 'node:fs';
import {entity,stableID,normalize,hash} from './models.mjs';
const aliases=JSON.parse(readFileSync(new URL('../data/engine/aliases.json',import.meta.url),'utf8'));
export function normalizeRow(raw,source,page,existing=[]){
 const evidenceId='ev-'+hash([source.id,page.url,page.sha256,raw.nativeId,raw]).slice(0,24),evidence={id:evidenceId,sourceId:source.id,url:page.url,fetchedAt:page.fetchedAt,bodySha256:page.sha256,selector:source.selector||source.adapter,facts:{sourceRecordId:String(raw.nativeId),name:raw.name,division:raw.division||null,season:raw.season||null,kind:raw.kind,...(raw.programFacts?{program:raw.programFacts}:{}),...(raw.originalRow?{originalRow:raw.originalRow}:{})}};
 const sourceRecordId=source.id+':'+(raw.scopeKey?raw.scopeKey+':':'')+raw.nativeId;
 if(/^(?:unattached|unassigned|un|una|bye(?: week)?)$/i.test(raw.name?.trim()||''))return {row:{sourceRecordId,decision:'exclude',reason:'Not a club/team identity: unattached or scheduling placeholder'},evidence};
 const sourceState=source.state||'CO';
 if(raw.state&&raw.state!==sourceState)return {row:{sourceRecordId,decision:'exclude',reason:'Visiting out-of-scope state organization'},evidence};
 const sport=raw.sport||source.sport,base={sport,sports:sport?[sport]:source.sports||[],state:Object.hasOwn(raw,'state')?raw.state:(source.state??null),city:Object.hasOwn(raw,'city')?raw.city:source.city||null,region:Object.hasOwn(raw,'region')?raw.region:source.region||null,genders:raw.genders||source.genders||[],levels:raw.levels||source.levels||[],programType:raw.programType||source.programType||'unknown',audience:raw.audience||source.audience||'unknown',evidenceIds:[evidenceId],summary:raw.summary||source.summary||'Public source record; unspecified fields remain unknown.'};
 const displayName=source.rowAliases?.[raw.name]||raw.name;const orgName=raw.organizationName||source.organizationName||displayName;
 const prior=existing.find(e=>e.kind==='organization'&&(sourceState==='CO'&&e.id===aliases[orgName]||[e.name,...e.aliases].some(n=>normalize(n)===normalize(orgName)))&&e.state===sourceState&&(!sport||e.sports.includes(sport)));
 const org=prior||entity({...base,sport:source.sports?.length>1?null:base.sport,sports:source.sports||base.sports,genders:source.adapter==='college'?[]:base.genders,programType:source.adapter==='college'?'unknown':base.programType,id:stableID('organization',orgName,sourceState),kind:'organization',name:orgName,...(source.organizationName&&raw.kind!=='organization'?{summary:source.organizationSummary||'Public organizational provider: '+source.organizationName,genders:source.genders||[],levels:source.levels||[],programType:source.sports?.length>1?'unknown':source.programType||'unknown'}:{}),category:raw.category||source.category||'club',aliases:raw.aliases||[],affiliations:raw.affiliations||source.affiliations||[]});
 let main,supporting=[];
 if(raw.kind==='organization')main=org;
 else if(raw.kind==='league')main=existing.find(e=>e.kind==='league'&&e.sport===sport&&normalize(e.name)===normalize(raw.name))||entity({...base,id:stableID('league',source.id,raw.nativeId),kind:'league',name:raw.name});
 else if(raw.kind==='community')main=entity({...base,id:stableID('community',source.id,raw.nativeId),kind:'community',name:raw.name,organizationId:org.id}),supporting=[org];
 else if(raw.kind==='location')main=entity({...base,id:stableID('location',source.id,raw.nativeId),kind:'location',name:raw.name,address:raw.address||null});
 else if(raw.kind==='event'){
  const home=normalizeRow({...raw,kind:'team',name:raw.homeName,nativeId:'home-'+raw.nativeId},source,page,existing).row;
  const away=normalizeRow({...raw,kind:'team',name:raw.awayName,nativeId:'away-'+raw.nativeId},source,page,existing).row;
  supporting=[...(home.supportingEntities||[]),home.entity,...(away.supportingEntities||[]),away.entity].filter(Boolean);
  supporting=[...new Map(supporting.map(e=>[e.id,e])).values()];
  main=entity({...base,id:stableID('event',source.id,raw.scopeKey||'',raw.nativeId),kind:'event',name:raw.name,competitionId:home.entity?.competitionId,seasonId:home.entity?.seasonId,divisionId:home.entity?.divisionId,homeTeamId:home.entity?.id,awayTeamId:away.entity?.id,startDate:raw.startDate||null,endDate:raw.startDate||null,sourceDateText:raw.sourceDateText,sourceTimeText:raw.sourceTimeText,dateConfidence:raw.startDate?'published':'unconfirmed',current:false,locationName:raw.locationName});
  if(!raw.startDate)return {row:{sourceRecordId,entity:main,supportingEntities:supporting,decision:'unresolved',reason:'Schedule date lacks independently verified season year; never present as current'},evidence};
 }
 else if(raw.kind==='team'){
  supporting.push(org);let league=null,competition=null,season=null,division=null;
  if(source.leagueName){league=existing.find(e=>e.kind==='league'&&e.sport===sport&&normalize(e.name)===normalize(source.leagueName))||entity({...base,id:stableID('league',source.id),kind:'league',name:source.leagueName});supporting.push(league);}
  if(raw.division||raw.season){competition=entity({...base,id:stableID('competition',source.id,raw.competitionName||source.competitionName||source.leagueName),kind:'competition',name:raw.competitionName||source.competitionName||source.leagueName,leagueId:league?.id||null});season=entity({...base,id:stableID('season',competition.id,raw.season||'year-unconfirmed'),kind:'season',name:raw.season?competition.name+' '+raw.season:competition.name+' — year unconfirmed',year:raw.season&&/^\d{4}$/.test(raw.season)?Number(raw.season):null,competitionId:competition.id,leagueId:league?.id||null});supporting.push(competition,season);}
  if(raw.division){division=entity({...base,id:stableID('division',source.id,season.id,raw.division),kind:'division',name:raw.division,leagueId:league.id,competitionId:competition.id,seasonId:season.id});supporting.push(division);}
  main=entity({...base,id:stableID('team',org.id,sport,displayName,season?.id||'unknown',division?.id||'unknown',(base.genders||[]).join('-')),kind:'team',name:displayName,organizationId:org.id,leagueId:league?.id||null,competitionId:competition?.id||null,seasonId:season?.id||null,divisionId:division?.id||null,nativeCode:raw.nativeId});
 }else return {row:{sourceRecordId,decision:'unresolved',reason:'Unsupported row classification'},evidence};
 if(raw.discoveryOnly||base.state!==sourceState)return {row:{sourceRecordId,entity:main,supportingEntities:supporting,decision:'unresolved',reason:'Discovered candidate requires official Colorado affiliation verification'},evidence};
 if(raw.kind==='team'&&source.teamNamePrefix&&!main.seasonId){const old=existing.find(e=>e.kind==='team'&&e.organizationId===org.id&&normalize(e.name)===normalize(source.teamNamePrefix+raw.name)&&!e.seasonId);if(old)main=old;}
 const canonical=existing.find(e=>e.id===main.id);if(canonical&&main.kind==='team')main={...main,nativeCode:canonical.nativeCode};const duplicate=!!canonical;return {row:{sourceRecordId,entity:main,supportingEntities:supporting,decision:duplicate?'duplicate':'import',reason:duplicate?'Matched canonical reviewed entity; no overwrite':null},evidence};
}
