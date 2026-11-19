// PlayRcmd fictional role adapter. Shared SIEM rules remain the authority.
import {createScenario} from './siem-platform-fixtures.js';
import {createFamilyDemo} from './siem-family-fixtures.js';
import {activityContract,activityKey,canRead,FIXTURE_NOW} from './siem-platform-model.js';
import {parseICS,expandWeekly} from './siem-model.js';
import {denverInstant} from './recurring-plans.js';
export const roleLabels={family:'Parent & Family',college:'Athlete',coach:'Coach'};
export const roleKey=kind=>'playrcmd.role.'+kind;
export function readWorkspace(storage,kind){
 try{const s=JSON.parse(storage.getItem(roleKey(kind))||'null');if(s?.version===1&&s.kind===kind&&Array.isArray(s.entries)&&s.entries.length<=600&&Array.isArray(s.applied))return {...s,plans:Array.isArray(s.plans)?s.plans.filter(p=>p&&typeof p.id==='string'&&typeof p.teamId==='string'&&typeof p.title==='string'&&typeof p.notes==='string').slice(0,30):[],drafts:s.drafts&&typeof s.drafts==='object'&&!Array.isArray(s.drafts)?Object.fromEntries(Object.entries(s.drafts).filter(([,v])=>typeof v==='string').slice(0,30)):{} };}catch{}
 return {version:1,kind,entries:[],applied:[],plans:[],drafts:{}};
}
const at=(day,time)=>denverInstant('2030-05-'+String(day).padStart(2,'0'),time);
export function makeActivity(dataset,raw){
 raw=Object.fromEntries(Object.entries(raw).filter(([,value])=>value!==undefined&&value!==null));
 const team=dataset.teams.find(t=>t.id===raw.teamId);
 const participantId=raw.participantId||team?.participantId||(dataset.kind==='coach'?team?.id:null)||dataset.participants[0].id;
 const organizationId=raw.organizationId||team?.organizationId||dataset.organizations[0].id;
 const activity=activityContract({schemaVersion:2,tenantId:dataset.ctx.tenantId,sourceId:'manual-'+organizationId,sourceIdentity:'playrcmd-fictional-local:'+participantId+':'+(raw.teamId||''),eventId:raw.eventId,organizationId,teamId:raw.teamId||'',role:dataset.ctx.role,participantId,participantRelationship:dataset.kind==='coach'?'team':dataset.kind==='family'?'child':'self',ownerId:dataset.ctx.personId,title:raw.title,start:raw.start,end:raw.end,timezone:'America/Denver',eventType:raw.eventType||'personal',status:'scheduled',location:raw.location||'Fictional venue',originalSourceTimestamp:FIXTURE_NOW,lastSynchronizedAt:null,priority:2,requiredAction:null,evidence:{url:'',summary:'Fictional local example. No provider updated.'},visibility:dataset.kind==='family'?'family':dataset.kind==='coach'?'organization':'private',permissionScope:{tenantId:dataset.ctx.tenantId,organizationId,role:dataset.ctx.role,personIds:[dataset.ctx.personId]},relatedEventIds:[],...raw});
 if(team&&((dataset.kind==='coach'&&participantId!==(team.participantId||team.id))||(dataset.kind==='family'&&team.participantId&&participantId!==team.participantId)))throw Error('Athlete does not match the selected team');
 if(!canRead(activity,dataset.ctx))throw Error('Activity is outside the active role, organization or team');
 return activity;
}
function fixture(kind){
 if(kind==='family')return createFamilyDemo();
 const d=createScenario(kind);
 if(kind==='coach'){
  d.label='Morgan Lee · three independently managed teams';
  d.organizations=[{id:'club',name:'Summit Club · fictional'},{id:'program',name:'Front Range High School · fictional'},{id:'college',name:'Cedar Valley College · fictional'}];
  d.teams[0].name='Summit U14 · Club basketball';d.teams[1].name='Front Range Varsity · High school lacrosse';d.teams.push({id:'college-team',name:'Cedar Valley · College lacrosse',organizationId:'college',participantId:'college-team'});
  d.participants[0].name=d.teams[0].name;d.participants[1].name=d.teams[1].name;d.participants.push({id:'college-team',name:d.teams[2].name,label:'College team'});
  d.ctx.participantIds.push('college-team');d.ctx.memberships.push({organizationId:'college',role:'coach',teamIds:['college-team']});
  d.activities.push(makeActivity(d,{eventId:'college-practice',title:'Cedar Valley · College practice',teamId:'college-team',start:at(6,'15:00'),end:at(6,'16:30'),eventType:'practice',location:'Fictional college field'}),makeActivity(d,{eventId:'club-game',title:'Summit U14 · League game',teamId:'u14',start:at(8,'17:00'),end:at(8,'18:15'),eventType:'game'}),makeActivity(d,{eventId:'coach-renewal',title:'Review fictional coaching credential renewal',teamId:'college-team',start:at(10,'12:00'),end:at(10,'12:15'),eventType:'deadline',requiredAction:{id:'renewal',label:'Check the official governing-body renewal requirements',complete:false}}));
  for(const team of d.teams)d.activities.push(makeActivity(d,{eventId:'notice-'+team.id,title:team.name+' · Team reminder',teamId:team.id,start:at(6,'08:00'),end:at(6,'08:05'),eventType:'communication',requiredAction:{id:'review-'+team.id,label:'Review the fictional team reminder',complete:false}}));
 }else{
  d.label='Sam Taylor · fictional college athlete';d.ctx.roles=['college-athlete'];d.ctx.memberships=d.ctx.memberships.filter(m=>m.role==='college-athlete');d.activities.find(e=>e.eventId==='lab').location='Fictional campus · Biology Building';
  for(const [id,title,day,start,end,type] of [
   ['statistics','Statistics seminar',6,'10:15','11:15','class'],['work','Campus library · Work shift',6,'13:00','14:30','personal'],['workout','Personal workout · Mobility',7,'07:00','07:45','practice'],['competition','Varsity basketball · Competition',9,'17:00','19:00','game'],['travel','Team travel · Fictional away trip',9,'14:00','16:00','travel'],['opportunity','Illustrative player skills clinic · Not a live opening',11,'10:00','11:00','opportunity']
  ])d.activities.push(makeActivity(d,{eventId:id,title,start:at(day,start),end:at(day,end),eventType:type,teamId:'varsity'}));
 }
 return d;
}
export function loadRole(kind,storage){
 if(!Object.hasOwn(roleLabels,kind))throw Error('Unknown role');
 const d=fixture(kind),saved=readWorkspace(storage,kind);
 for(const org of d.organizations)for(const source of ['manual','ics'])if(kind!=='family'||saved.entries.some(e=>e.sourceId===source+'-'+org.id))d.sources.push({id:source+'-'+org.id,name:source==='ics'?'Fictional ICS snapshot':'Fictional local planning',tenantId:d.ctx.tenantId,role:d.ctx.role,organizationId:org.id,status:'local',lastSynchronizedAt:null,staleAfterMinutes:1440});
 for(const raw of saved.entries){
  try{
   const entry=activityContract(raw);if(!canRead(entry,d.ctx))continue;
   const index=d.activities.findIndex(e=>activityKey(e)===activityKey(entry));
   if(index<0)d.activities.push(entry);else{const previous=d.activities[index];if(['start','end','location','status','title'].some(key=>previous[key]!==entry[key]))(d.history[activityKey(entry)]??=[]).push(previous);d.activities[index]=entry;}
   if(d.kind==='family')d.origins[activityKey(entry)]=[entry,...(d.origins[activityKey(entry)]||[]).filter(e=>activityKey(e)!==activityKey(entry))];
  }catch{/* Untrusted local input cannot widen permission scope or break the fixture. */}
 }
 return d;
}
function saveEntries(storage,kind,entries,applied){
 const saved=readWorkspace(storage,kind),map=new Map(saved.entries.map(e=>[activityKey(e),e]));
 for(const entry of entries)map.set(activityKey(entry),entry);
 if(map.size>600)throw Error('Demo limit reached; reset this role to continue');
 storage.setItem(roleKey(kind),JSON.stringify({...saved,entries:[...map.values()],applied:applied?[...new Set([...saved.applied,applied])]:saved.applied}));return entries;
}
export function addCommitment(storage,kind,raw){
 const d=loadRole(kind,storage),count=Number(raw.count||1);
 if(!raw.ref?.trim()||raw.ref.length>100)throw Error('A stable reference of 1–100 characters is required');
 // Existing bounded recurrence, normalization and scope checks. No new scheduler.
 const entries=expandWeekly({ref:raw.ref,start:denverInstant(raw.day,raw.startTime),end:denverInstant(raw.day,raw.endTime)},count).map(e=>makeActivity(d,{eventId:'manual-'+e.ref,title:raw.title.trim(),start:e.start,end:e.end,eventType:raw.eventType,teamId:raw.teamId,participantId:raw.participantId,location:raw.location}));
 return saveEntries(storage,kind,entries);
}
export function importCalendar(storage,kind,text,teamId,participantId){
 const d=loadRole(kind,storage);
 const entries=parseICS(text,participantId||d.participants[0].id).map(e=>{
  if(!e.ref||!e.title)throw Error('Every event needs a UID and summary');
  return makeActivity(d,{eventId:'ics-'+e.ref,sourceId:'ics-'+(d.teams.find(t=>t.id===teamId)?.organizationId||d.organizations[0].id),title:e.title,start:e.start,end:e.end,teamId,participantId,location:e.location,status:e.status,evidence:{url:'',summary:'Fictional ICS file snapshot. No subscription or live synchronization.'}});
 });
 return saveEntries(storage,kind,entries);
}
export function notificationFixtures(kind,storage){
 const d=fixture(kind),team=d.teams[0],target=kind==='family'?d.activities.find(e=>e.eventId==='alex-mon-practice'):d.activities.find(e=>e.eventId==='training');
 const reminder=kind==='family'?d.activities.find(e=>e.eventId==='jordan-sat-tournament'):kind==='coach'?d.activities.find(e=>e.eventId==='college-practice'):d.activities.find(e=>e.eventId==='competition');
 return [
  {id:'playmetrics-change-'+kind,provider:'PlayMetrics',type:'Practice-change email',subject:'Practice updated · Please review the new time and location',sender:'Fictional team coordinator',received:'2030-05-06 08:00 MT',platformURL:'https://www.playmetrics.com/',targetKey:activityKey(target),organizationId:target.organizationId,teamId:target.teamId,participantId:target.participantId,title:target.title,start:at(6,'18:00'),end:at(6,'19:15'),location:'Willow Creek · Field 4 (fictional)',action:'Review the new practice time and coordinate your commitments',previous:target},
  {id:'teamsnap-reminder-'+kind,provider:'TeamSnap',type:'Event-reminder email',subject:'Upcoming event · Check arrival and confirm your plan',sender:'Fictional team manager',received:'2030-05-06 08:05 MT',platformURL:'https://www.teamsnap.com/',targetKey:activityKey(reminder),organizationId:reminder.organizationId,teamId:reminder.teamId,participantId:reminder.participantId,title:reminder.title,start:reminder.start,end:reminder.end,location:reminder.location,action:'Review the event reminder and arrival instructions',previous:reminder}
 ];
}
export function applyNotification(storage,kind,id){
 const d=loadRole(kind,storage),n=notificationFixtures(kind,storage).find(n=>n.id===id);
 if(!n)throw Error('Unknown fictional notification');
 const saved=readWorkspace(storage,kind);if(saved.applied.includes(id))return {duplicate:true,entry:null};
 const original=d.activities.find(e=>activityKey(e)===n.targetKey);
 if(!original||original.organizationId!==n.organizationId||original.teamId!==n.teamId||original.participantId!==n.participantId||!canRead(original,d.ctx))throw Error('Team or athlete matching requires review');
 const entry=activityContract({...original,start:n.start,end:n.end,location:n.location,requiredAction:{id:n.id,label:n.action,complete:false},evidence:{url:n.platformURL,summary:'FICTIONAL '+n.provider+' email example; explicitly matched to this existing event. Provider remains the system of record. Link opens provider home, not a real message.'}});
 const linked=d.activities.filter(e=>e.eventId==='calendar-copy'&&e.title===original.title&&e.start===original.start&&e.end===original.end&&canRead(e,d.ctx)).map(e=>activityContract({...e,start:n.start,end:n.end,location:n.location}));
 saveEntries(storage,kind,[entry,...linked],id);return {duplicate:false,entry};
}
export function savePlan(storage,kind,teamId,title,notes){
 if(kind!=='coach')throw Error('Session plans are coach-only');
 const d=loadRole(kind,storage);if(!d.teams.some(t=>t.id===teamId&&d.ctx.memberships.some(m=>m.role===d.ctx.role&&m.organizationId===t.organizationId&&m.teamIds.includes(t.id))))throw Error('Team not authorized');
 if(!title.trim()||title.length>100||notes.length>2000)throw Error('Use a title and notes up to 2,000 characters');
 const s=readWorkspace(storage,kind);if((s.plans||[]).length>=30)throw Error('Demo plan limit reached');
 const plan={id:globalThis.crypto.randomUUID(),teamId,title:title.trim(),notes,createdAt:new Date().toISOString()};storage.setItem(roleKey(kind),JSON.stringify({...s,plans:[...(s.plans||[]),plan]}));return plan;
}
