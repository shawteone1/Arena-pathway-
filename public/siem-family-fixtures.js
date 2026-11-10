// Fictional signature demonstration. No accounts, credentials, networks or private people.
import {activityContract,activityKey,canRead} from './siem-platform-model.js';
export const FAMILY_WEEK={start:'2030-05-06',end:'2030-05-12',timezone:'America/Denver',label:'May 6–12, 2030'};
const instant=(day,time)=>new Date(`2030-05-${String(day).padStart(2,'0')}T${time}:00-06:00`).toISOString();
export function consolidateFamilyRecords(records,links,ctx){
 const clean=records.map(activityContract);if(clean.some(e=>!canRead(e,ctx)))throw Error('Out-of-scope family fixture');
 const byKey=new Map(clean.map(e=>[activityKey(e),e]));if(byKey.size!==clean.length)throw Error('Repeated source record identity');
 const canonical=new Map(),origins={};
 for(const e of clean){const key=activityKey(e),targetKey=links[key]||key,target=byKey.get(targetKey);if(!target)throw Error('Missing correlation target');if(targetKey!==key&&['participantId','teamId','organizationId','role','title','start','end','status','eventType'].some(k=>e[k]!==target[k]))throw Error('Ambiguous cross-feed mapping');
 canonical.set(targetKey,target);(origins[targetKey]??=[]).push(e);
 }
 return {activities:[...canonical.values()],origins};
}
export function createFamilyDemo(){
 const tenantId='signature-rivera-family',personId='demo-parent-casey',role='parent';
 const organizations=[{id:'soccer-club',name:'Foothills United Soccer · fictional'},{id:'volleyball-club',name:'Front Range Rise Volleyball · fictional'},{id:'rivera-family',name:'Rivera family · fictional'}];
 const participants=[{id:'alex',name:'Alex Rivera',label:'Soccer',sports:['soccer']},{id:'jordan',name:'Jordan Rivera',label:'Volleyball',sports:['volleyball']},{id:'taylor',name:'Taylor Rivera',label:'Soccer & volleyball',sports:['soccer','volleyball']}];
 const teams=[{id:'alex-soccer',name:'Alex · Foothills U13 Soccer',organizationId:'soccer-club',sport:'soccer',participantId:'alex'},{id:'jordan-volleyball',name:'Jordan · Rise 14U Volleyball',organizationId:'volleyball-club',sport:'volleyball',participantId:'jordan'},{id:'taylor-soccer',name:'Taylor · Foothills U11 Soccer',organizationId:'soccer-club',sport:'soccer',participantId:'taylor'},{id:'taylor-volleyball',name:'Taylor · Rise 12U Volleyball',organizationId:'volleyball-club',sport:'volleyball',participantId:'taylor'}];
 const ctx={tenantId,personId,role,roles:[role],participantIds:participants.map(p=>p.id),memberships:organizations.map(o=>({organizationId:o.id,role,teamIds:teams.filter(t=>t.organizationId===o.id).map(t=>t.id)}))};
 const sources=[['playmetrics','PlayMetrics','soccer-club','07:58',15],['sportsengine','SportsEngine','volleyball-club','07:54',15],['teamsnap-calendar','TeamSnap','rivera-family','07:55',15],['slack','Slack','rivera-family','07:50',5],['locked-in-demo','Locked In · status simulation','volleyball-club','07:56',60]].map(([id,name,organizationId,time,staleAfterMinutes])=>({id,name,organizationId,tenantId,role,status:'fixture',lastSynchronizedAt:instant(6,time),staleAfterMinutes}));
 const records=[],history={},itineraries={},links={};
 function add(eventId,title,day,start,end,participantId,teamId,sourceId,eventType='practice',extra={}){
 const team=teams.find(t=>t.id===teamId),organizationId=team?.organizationId||'rivera-family',source=sources.find(s=>s.id===sourceId);
 const e=activityContract({schemaVersion:2,tenantId,sourceId,sourceIdentity:'fictional-'+sourceId+'-export',eventId,organizationId,teamId:teamId||'',role,participantId,participantRelationship:'child',ownerId:null,title,start:instant(day,start),end:instant(day,end),timezone:'America/Denver',eventType,status:'scheduled',location:team?.sport==='soccer'?'Willow Creek Fields · fictional Denver metro venue':'Summit Courts · fictional Denver metro venue',originalSourceTimestamp:instant(6,'07:40'),lastSynchronizedAt:source.lastSynchronizedAt,priority:2,requiredAction:null,evidence:{url:'',summary:'Fictional '+source.name+' fixture. No provider retrieval or live connection.'},visibility:'family',permissionScope:{tenantId,organizationId,role,personIds:[personId]},relatedEventIds:[],...extra});records.push(e);return e;
 }
 const changed=add('alex-mon-practice','Alex · Soccer practice',6,'17:15','18:30','alex','alex-soccer','playmetrics','practice',{priority:1,location:'Willow Creek Fields · Field 3 (fictional)',requiredAction:{id:'review-change',label:'Review new time and venue; coordinate volleyball pickup',complete:false},originalSourceTimestamp:instant(6,'07:42'),evidence:{url:'',summary:'DEMO PlayMetrics update: Monday practice moves from 4:30 PM at Pine Grove to 5:15 PM at Willow Creek Field 3. Arrive 5:00 PM. Fictional venues.'}});
 history[activityKey(changed)]=[activityContract({...changed,start:instant(6,'16:30'),end:instant(6,'17:45'),location:'Pine Grove Fields · fictional',originalSourceTimestamp:instant(5,'18:00'),requiredAction:null})];
 const calendarCopy=add('teamsnap-alex-mon','Alex · Soccer practice',6,'17:15','18:30','alex','alex-soccer','teamsnap-calendar','practice',{priority:1,location:changed.location,originalSourceTimestamp:instant(6,'07:45'),evidence:{url:'',summary:'DEMO TeamSnap calendar copy of the same PlayMetrics practice update. Explicit fictional team/event mapping; not an inferred real integration.'}});
 links[activityKey(calendarCopy)]=activityKey(changed);
 const announcement=add('slack-practice-change','Alex practice moved · logistics channel',6,'07:43','07:44','alex','alex-soccer','slack','communication',{relatedEventIds:[changed.eventId],originalSourceTimestamp:instant(6,'07:43'),location:'Simulated #soccer-parent-logistics',evidence:{url:'',summary:'DEMO Slack announcement: Alex’s U13 practice is now 5:15 PM at Willow Creek Field 3. This confirms the fixture calendar change; review the shared pickup plan.'}});
 add('jordan-mon-practice','Jordan · Volleyball practice',6,'16:45','18:15','jordan','jordan-volleyball','sportsengine');
 add('taylor-mon-volleyball','Taylor · Volleyball practice',6,'18:30','20:00','taylor','taylor-volleyball','sportsengine');
 add('transport-reminder','Confirm Monday carpool coverage',6,'08:05','19:00','taylor','taylor-volleyball','slack','communication',{priority:1,relatedEventIds:[changed.eventId,'jordan-mon-practice','taylor-mon-volleyball'],originalSourceTimestamp:instant(6,'07:48'),location:'Simulated #family-team-logistics',requiredAction:{id:'carpool',label:'Review the overlap and approve a simulated carpool reply',complete:false},evidence:{url:'',summary:'DEMO Slack: Casey can take Alex. Can Drew cover Jordan’s 6:15 pickup and Taylor’s 6:10 arrival? Confirm a plan before replying. No message has been sent.'}});
 add('taylor-tue-soccer','Taylor · Soccer practice',7,'16:15','17:30','taylor','taylor-soccer','playmetrics');
 const volleyballChange=add('jordan-wed-practice','Jordan · Volleyball practice',8,'17:00','18:30','jordan','jordan-volleyball','sportsengine','practice',{location:'Summit Courts · Court 2 (fictional)',evidence:{url:'',summary:'DEMO SportsEngine change: Wednesday training moves from 4:30 PM on Court 1 to 5 PM on Court 2.'}});
 history[activityKey(volleyballChange)]=[activityContract({...volleyballChange,start:instant(8,'16:30'),end:instant(8,'18:00'),location:'Summit Courts · Court 1 (fictional)'})];
 add('alex-wed-practice','Alex · Soccer practice',8,'18:45','20:00','alex','alex-soccer','playmetrics');
 add('taylor-thu-soccer','Taylor · Soccer practice',9,'16:15','17:30','taylor','taylor-soccer','playmetrics');
 add('taylor-thu-volleyball','Taylor · Volleyball practice',9,'18:00','19:30','taylor','taylor-volleyball','sportsengine');
 const tournament=add('jordan-sat-tournament','Jordan · Front Range volleyball tournament',11,'08:00','16:00','jordan','jordan-volleyball','sportsengine','game',{location:'High Plains Event Center · fictional Aurora venue',evidence:{url:'',summary:'DEMO SportsEngine tournament schedule: Saturday 8 AM–4 PM; arrive 7:15 AM for check-in/warmup. RSVP by Friday 6 PM. Match times remain illustrative.'}});
 add('tournament-rsvp','Jordan · Tournament RSVP due',10,'18:00','18:15','jordan','jordan-volleyball','teamsnap-calendar','deadline',{priority:1,relatedEventIds:[tournament.eventId],requiredAction:{id:'rsvp',label:'Review Saturday arrival and approve the simulated RSVP',complete:false},evidence:{url:'',summary:'DEMO TeamSnap RSVP request for the same SportsEngine tournament. Respond by Friday 6 PM. Preview requires explicit approval; no real submission.'}});
 add('alex-sat-game','Alex · Soccer league game',11,'09:00','10:30','alex','alex-soccer','playmetrics','game',{location:'Aspen Meadow Park · fictional Lakewood venue'});
 add('taylor-sat-game','Taylor · Soccer league game',11,'11:15','12:30','taylor','taylor-soccer','playmetrics','game',{location:'Willow Creek Fields · fictional Denver venue'});
 add('taylor-sun-volleyball','Taylor · Volleyball friendly',12,'13:00','14:30','taylor','taylor-volleyball','sportsengine','game');
 add('playmetrics-announcement','Soccer team planning announcement',6,'07:41','07:42','alex','alex-soccer','playmetrics','communication',{relatedEventIds:['team-meeting'],evidence:{url:'',summary:'DEMO PlayMetrics team announcement: Thursday 8:15 PM planning meeting is listed in the family TeamSnap calendar. No joining link or real message.'}});
 add('teamsnap-weekend-notice','Weekend availability and RSVP reminder',6,'07:46','07:47','jordan','jordan-volleyball','teamsnap-calendar','communication',{relatedEventIds:[tournament.eventId,'tournament-rsvp'],evidence:{url:'',summary:'DEMO TeamSnap communication: confirm the volleyball tournament RSVP by Friday and review the 7:15 AM arrival plan.'}});
 add('team-meeting','Alex · Team tournament planning meeting',9,'20:15','20:45','alex','alex-soccer','teamsnap-calendar','meeting',{location:'Illustrative online team meeting · no joining link'});
 add('school-concert','Taylor · School spring concert',10,'15:30','16:30','taylor','','teamsnap-calendar','class',{location:'Fictional neighborhood school auditorium'});
 add('family-dinner','Family Sunday dinner',12,'18:00','19:30','alex','','teamsnap-calendar','personal',{location:'Family home · no address collected'});
 add('onboarding-status','Locked In demo · Jordan club form needs review',7,'18:00','18:15','jordan','jordan-volleyball','locked-in-demo','deadline',{priority:1,requiredAction:{id:'onboarding',label:'Review the simulated onboarding status; open no private documents',complete:false},evidence:{url:'',summary:'SIMULATED Locked In status: parent review needed. Minimal status only, with fictional parent permission. No document, identity, health or payment record is copied into SIEM.'}});
 const merged=consolidateFamilyRecords(records,links,ctx);
 // Related messages are evidence, not another practice-change alert.
 merged.origins[activityKey(changed)].push(announcement);
 function travel(eventId,depart,arrive,note){const e=merged.activities.find(e=>e.eventId===eventId);itineraries[activityKey(e)]={departAt:instant(Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',day:'2-digit'}).format(new Date(e.start))),depart),arrivalAt:instant(Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',day:'2-digit'}).format(new Date(e.start))),arrive),note};}
 travel(changed.eventId,'16:30','17:00','Fictional parent plan: allow 30 minutes to the changed venue; not live routing.');
 travel('jordan-mon-practice','16:00','16:30','Fictional family estimate: arrive 15 minutes before practice.');
 travel('taylor-mon-volleyball','17:40','18:10','Fictional plan: warmup arrival conflicts with Jordan pickup at 6:15; confirm a second driver.');
 travel(tournament.eventId,'06:30','07:15','Fictional parent travel buffer: 45 minutes plus 45-minute early check-in/warmup. No traffic estimate.');
 travel('alex-sat-game','07:45','08:30','Fictional parent plan: 45-minute drive; arrive 30 minutes before kickoff.');
 return {kind:'family',label:'Signature Rivera family · fictional',ctx,organizations,teams,participants,sources,activities:merged.activities,history,actions:{},now:Date.parse(instant(6,'08:00')),initialNow:Date.parse(instant(6,'08:00')),sourceRecords:records,origins:merged.origins,itineraries,week:FAMILY_WEEK,approvals:[]};
}
export function familySourceRecords(dataset,ctx,event){
 if(!canRead(event,ctx))return [];
 return (dataset.origins[activityKey(event)]||[]).filter(e=>canRead(e,ctx));
}
export function familySourceView(dataset,sourceId){
 if(!sourceId)return dataset;
 return {...dataset,activities:dataset.activities.filter(e=>e.sourceId===sourceId||(dataset.origins[activityKey(e)]||[]).some(r=>r.sourceId===sourceId))};
}
export function familyScope(dataset,filters){
 let teams=filters.teams||[];
 if(filters.sport){const ids=dataset.teams.filter(t=>t.sport===filters.sport).map(t=>t.id);teams=teams.length?teams.filter(id=>ids.includes(id)):ids;if(!teams.length)teams=['__no-team-match__'];}
 return {organizations:filters.organizations,teams,participant:filters.participant,source:''};
}
