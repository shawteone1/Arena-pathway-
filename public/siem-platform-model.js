// Versioned presentation contract and permission-first adapter over the existing SIEM domain.
import {empty,upsert,detect,act,safeURL} from './siem-model.js';
export const CONTRACT_VERSION=2;
export const roles=['parent','coach','college-athlete','professional-athlete','recreational-athlete'];
export const FIXTURE_NOW='2030-05-06T14:00:00.000Z';
const timestamp=v=>typeof v==='string'&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
const required=(v,k)=>{if(typeof v!=='string'||!v.trim()||v.length>200)throw Error('Invalid '+k);return v;};
export function activityContract(raw){
 if(raw.schemaVersion!==CONTRACT_VERSION)throw Error('Unsupported activity contract');
 for(const k of ['tenantId','sourceId','sourceIdentity','eventId','organizationId','participantId','title'])required(raw[k],k);
 if(!roles.includes(raw.role)||!roles.includes(raw.permissionScope?.role))throw Error('Unknown role');
 if(!['scheduled','canceled','completed'].includes(raw.status)||!['game','practice','class','meeting','personal','deadline','communication','opportunity'].includes(raw.eventType))throw Error('Invalid event type/status');
 if(!timestamp(raw.start)||!timestamp(raw.end)||Date.parse(raw.end)<=Date.parse(raw.start))throw Error('Invalid event interval');
 try{new Intl.DateTimeFormat('en',{timeZone:raw.timezone}).format();}catch{throw Error('Invalid timezone');}
 if(!raw.timezone||!timestamp(raw.originalSourceTimestamp)||(raw.lastSynchronizedAt!==null&&!timestamp(raw.lastSynchronizedAt)))throw Error('Invalid source timestamps');
 if(![1,2,3].includes(raw.priority)||!['family','organization','private'].includes(raw.visibility))throw Error('Invalid scope/priority');
 const scope=raw.permissionScope;if(scope.tenantId!==raw.tenantId||scope.organizationId!==raw.organizationId||scope.role!==raw.role||!Array.isArray(scope.personIds)||!scope.personIds.length||scope.personIds.some(id=>typeof id!=='string'))throw Error('Invalid permission scope');
 if(raw.visibility==='private'&&(!raw.ownerId||!scope.personIds.includes(raw.ownerId)))throw Error('Private activity requires owner');
 const action=raw.requiredAction;
 if(action&&(!action.id||!action.label||typeof action.complete!=='boolean'))throw Error('Invalid required action');
 // Allowlist fields. No source credentials, raw messages or sensitive product records.
 return {schemaVersion:2,tenantId:raw.tenantId,sourceId:raw.sourceId,sourceIdentity:raw.sourceIdentity,eventId:raw.eventId,organizationId:raw.organizationId,teamId:String(raw.teamId||''),role:raw.role,participantId:raw.participantId,participantRelationship:String(raw.participantRelationship||'self'),ownerId:raw.ownerId||null,title:raw.title,start:new Date(raw.start).toISOString(),end:new Date(raw.end).toISOString(),timezone:raw.timezone,eventType:raw.eventType,status:raw.status,location:String(raw.location||'').slice(0,180),originalSourceTimestamp:new Date(raw.originalSourceTimestamp).toISOString(),lastSynchronizedAt:raw.lastSynchronizedAt?new Date(raw.lastSynchronizedAt).toISOString():null,priority:raw.priority,requiredAction:action?{id:String(action.id),label:String(action.label).slice(0,100),complete:action.complete}:null,evidence:{url:safeURL(raw.evidence?.url),summary:String(raw.evidence?.summary||'').slice(0,250)},visibility:raw.visibility,permissionScope:{tenantId:scope.tenantId,organizationId:scope.organizationId,role:scope.role,personIds:[...scope.personIds]},relatedEventIds:Array.isArray(raw.relatedEventIds)?raw.relatedEventIds.filter(x=>typeof x==='string'):[],demo:true};
}
export const activityKey=e=>[e.tenantId,e.organizationId,e.role,e.sourceId,e.sourceIdentity,e.eventId].map(encodeURIComponent).join(':');
export function canRead(e,ctx){
 return e.tenantId===ctx.tenantId&&e.role===ctx.role&&e.permissionScope.role===ctx.role&&e.permissionScope.personIds.includes(ctx.personId)&&ctx.memberships.some(m=>m.role===ctx.role&&m.organizationId===e.organizationId&&(!e.teamId||m.teamIds.includes(e.teamId)))&&(e.visibility!=='private'||e.ownerId===ctx.personId)&&ctx.participantIds.includes(e.participantId);
}
export function scopedActivities(dataset,ctx,filters={}){
 return dataset.activities.filter(e=>canRead(e,ctx)).filter(e=>(!filters.organizations?.length||filters.organizations.includes(e.organizationId))&&(!filters.teams?.length||filters.teams.includes(e.teamId))&&(!filters.participant||filters.participant===e.participantId)&&(!filters.source||filters.source===e.sourceId));
}
export function sourceHealth(source,now){
 if(source.status==='disconnected')return {state:'disconnected',label:'Not connected',age:null};
 if(source.status==='failed')return {state:'failed',label:'Demo import failed',age:null};
 const at=Date.parse(source.lastSynchronizedAt);if(!Number.isFinite(at))return {state:'unknown',label:'No sync evidence',age:null};
 const age=Math.max(0,Math.floor((now-at)/60000));return {state:age>source.staleAfterMinutes?'stale':'fresh',label:age>source.staleAfterMinutes?'Stale fixture':'Current fixture',age};
}
export function visibleSources(dataset,ctx){return dataset.sources.filter(s=>s.tenantId===ctx.tenantId&&s.role===ctx.role&&ctx.memberships.some(m=>m.role===ctx.role&&m.organizationId===s.organizationId));}
export function projection(dataset,ctx,filters={}){
 const events=scopedActivities(dataset,ctx,filters),state=empty();state.familyId=ctx.tenantId;state.actions=dataset.actions;
 const ids=[...new Set(events.map(e=>e.participantId))];state.athletes=ids.map(id=>({id,name:id,sport:'personal',type:'athlete'}));
 const internal={id:ctx.personId,familyId:ctx.tenantId,role:'parent',athleteIds:ids},lookup=new Map();
 const project=e=>({athleteId:e.participantId,source:e.sourceId.includes('calendar')?'ics':'manual',ref:activityKey(e),title:e.title,type:['class','meeting','personal'].includes(e.eventType)?'practice':e.eventType,start:e.start,end:e.end,status:e.status,organization:e.organizationId,team:e.teamId,location:e.location,evidence:e.evidence.summary,sourceURL:e.evidence.url,requirements:e.requiredAction?[e.requiredAction]:[]});
 for(const e of events){const prior=dataset.history[activityKey(e)]||[];for(const h of prior.filter(h=>canRead(h,ctx)&&activityKey(h)===activityKey(e)))upsert(state,internal,project(h));const entry=upsert(state,internal,project(e));lookup.set(entry.id,e);}
 return {state,internal,lookup,events};
}
export function actionQueue(dataset,ctx,filters={}){
 const p=projection(dataset,ctx,filters);
 const raw=detect(p.state,p.internal,dataset.now).map(a=>{const related=a.eventIds.map(id=>p.lookup.get(id));return {...a,memberIds:[a.id],priority:a.type==='duplicate'?3:Math.min(a.priority,...related.map(e=>e.priority)),activities:related};});
 // One decision per underlying situation, while retaining all source records/evidence.
 const grouped=[];
 for(const a of raw.filter(a=>a.type!=='incomplete')){
 const signature=a.type==='conflict'?[...new Set(a.activities.map(e=>[e.participantId,e.title.toLowerCase(),e.start,e.end].join('|')))].sort().join('~'):null;
 const prior=signature&&grouped.find(g=>g.signature===signature);
 if(prior){prior.memberIds.push(a.id);prior.evidence.push(...a.evidence);for(const e of a.activities)if(!prior.activities.some(x=>activityKey(x)===activityKey(e)))prior.activities.push(e);if(a.status==='open')prior.status='open';}
 else grouped.push({...a,signature});
 }
 for(const a of raw.filter(a=>a.type==='incomplete')){const parent=grouped.find(g=>['changed','deadline','canceled'].includes(g.type)&&g.eventIds.some(id=>a.eventIds.includes(id)));if(parent)parent.memberIds.push(a.id);else grouped.push(a);}
 return grouped.sort((a,b)=>a.priority-b.priority||Math.min(...a.activities.map(e=>Date.parse(e.start)))-Math.min(...b.activities.map(e=>Date.parse(e.start)))||a.id.localeCompare(b.id));
}
export function takeAction(dataset,ctx,id,operation){
 const selected=actionQueue(dataset,ctx).find(a=>a.id===id);if(!selected)throw Error('Action unavailable');
 const p=projection(dataset,ctx);for(const member of selected.memberIds)act(p.state,p.internal,member,operation,null,dataset.now);dataset.actions=p.state.actions;
}
export function correlated(dataset,ctx,event,filters={}){
 const es=scopedActivities(dataset,ctx,filters),allowed=es.find(e=>activityKey(e)===activityKey(event));if(!allowed)return [];
 return es.filter(e=>activityKey(e)!==activityKey(allowed)&&(allowed.relatedEventIds.includes(e.eventId)||e.relatedEventIds.includes(allowed.eventId)||(e.participantId===allowed.participantId&&e.organizationId===allowed.organizationId&&e.start===allowed.start)));
}
// Adapter returns a whole validated snapshot. Failure never replaces last-known-good data.
export async function readAdapter(adapter,ctx,previous){
 try{const result=await adapter.read({tenantId:ctx.tenantId,personId:ctx.personId,role:ctx.role});if(result.schemaVersion!==2||!timestamp(result.asOf)||!Array.isArray(result.activities)||result.activities.length>1000)throw Error('Invalid adapter snapshot');const activities=result.activities.map(activityContract);if(activities.some(e=>!canRead(e,ctx)))throw Error('Adapter returned out-of-scope activity');return {ok:true,snapshot:{schemaVersion:2,asOf:result.asOf,activities},error:null};}
 catch{return {ok:false,snapshot:previous,error:'Feed unavailable or invalid. Last reviewed data retained.'};}
}
