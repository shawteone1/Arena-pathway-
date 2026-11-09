import {activityContract,activityKey,FIXTURE_NOW} from './siem-platform-model.js';
export const scenarioLabels={parent:'Parent · Family of three',coach:'Coach · Two teams',college:'College athlete · Campus & sport'};
export function createScenario(kind='parent'){
 if(!Object.hasOwn(scenarioLabels,kind))throw Error('Unknown demo');
 const now=Date.parse(FIXTURE_NOW),at=h=>new Date(now+h*36e5).toISOString();
 const tenantId='fixture-'+kind,personId='demo-'+kind,role={parent:'parent',coach:'coach',college:'college-athlete'}[kind];
 const organizations=kind==='parent'?[{id:'family',name:'Morgan family'}]:kind==='coach'?[{id:'club',name:'Summit Athletic Club'},{id:'program',name:'Front Range Development'}]:[{id:'campus',name:'Cedar Valley University'},{id:'club',name:'Campus skills program'}];
 const teams=kind==='coach'?[{id:'u14',name:'U14 Basketball',organizationId:'club'},{id:'u17',name:'U17 Lacrosse',organizationId:'program'}]:kind==='parent'?[{id:'swim',name:'Alex · Swimming',organizationId:'family'},{id:'basketball',name:'Riley · Basketball',organizationId:'family'}]:[{id:'varsity',name:'Women’s Basketball',organizationId:'campus'},{id:'skills',name:'Community Skills',organizationId:'club'}];
 const participants=kind==='parent'?[{id:'alex',name:'Alex Morgan',label:'Swimming'},{id:'riley',name:'Riley Morgan',label:'Basketball'},{id:'parent',name:'Jamie Morgan',label:'Parent · Personal'}]:kind==='coach'?[{id:'u14',name:'U14 Basketball',label:'Team'},{id:'u17',name:'U17 Lacrosse',label:'Team'}]:[{id:'sam',name:'Sam Taylor',label:'College athlete'}];
 const memberships=organizations.map(o=>({organizationId:o.id,role,teamIds:teams.filter(t=>t.organizationId===o.id).map(t=>t.id)}));
 if(kind==='college')memberships[1].role='coach';
 const ctx={tenantId,personId,role,roles:kind==='college'?['college-athlete','coach']:[role],memberships,participantIds:participants.map(p=>p.id)};
 const sources=organizations.flatMap(o=>[...['schedule','calendar'].map((id,i)=>({id:id+'-'+o.id,name:i?'Personal calendar export':'Club schedule export',tenantId,role:kind==='college'&&o.id==='club'?'coach':role,organizationId:o.id,status:'fixture',lastSynchronizedAt:at(i?-30:-.2),staleAfterMinutes:1440})),{id:'Teamworks-'+o.id,name:'Teamworks',tenantId,role:kind==='college'&&o.id==='club'?'coach':role,organizationId:o.id,status:'disconnected',lastSynchronizedAt:null,staleAfterMinutes:1440},{id:'email-'+o.id,name:'Authorized email',tenantId,role:kind==='college'&&o.id==='club'?'coach':role,organizationId:o.id,status:'failed',lastSynchronizedAt:at(-50),staleAfterMinutes:1440}]);
 const activities=[],history={};const p=participants[0].id,p2=participants[1]?.id||p,org=organizations[0].id,org2=organizations[1]?.id||org;
 function event(eventId,title,start,end,options={}){
 const organizationId=options.organizationId||org,r=options.role||role;
 return activityContract({schemaVersion:2,tenantId,sourceId:'schedule-'+organizationId,sourceIdentity:'demo-export-'+organizationId,eventId,organizationId,teamId:options.teamId||'',role:r,participantId:p,participantRelationship:kind==='parent'?'child':kind==='coach'?'team':'self',ownerId:null,title,start:at(start),end:at(end),timezone:'America/Denver',eventType:'practice',status:'scheduled',location:'North Training Center',originalSourceTimestamp:at(-1),lastSynchronizedAt:at(-.2),priority:2,requiredAction:null,evidence:{url:'',summary:'Fictional fixture only. No provider retrieval or real participant data.'},visibility:kind==='parent'?'family':'organization',permissionScope:{tenantId,organizationId,role:r,personIds:[personId]},relatedEventIds:[],...options});
 }
 const title=kind==='parent'?'Alex · Swim training':kind==='coach'?'U14 · Court session':'Strength & conditioning';
 const first=event('training',title,.5,1.5,{teamId:teams[0].id,requiredAction:{id:'venue',label:'Review the new training venue',complete:false}});
 const changed={...first,start:at(.75),end:at(1.75),location:'East Training Center · Court 2',originalSourceTimestamp:at(-.3)};
 history[activityKey(changed)]=[first];activities.push(changed);
 activities.push(event('overlap',kind==='parent'?'Riley · Basketball practice':kind==='coach'?'U17 · Field session':'Biology lab',1,2,{participantId:p2,organizationId:org2,teamId:teams[1]?.id||'',eventType:kind==='college'?'class':'practice',visibility:kind==='college'?'private':kind==='parent'?'family':'organization',ownerId:kind==='college'?personId:null,priority:1}));
 activities.push(event('deadline',kind==='parent'?'Confirm tomorrow’s pickup':kind==='coach'?'Confirm weekend field allocation':'Submit the travel study plan',3,3.25,{eventType:'deadline',priority:1,requiredAction:{id:'confirm',label:'Review and confirm locally',complete:false}}));
 activities.push(event('notice','Training venue moved to East Center',-.25,-.2,{eventType:'communication',relatedEventIds:['training'],location:'',requiredAction:null}));
 activities.push(event('meeting',kind==='college'?'Team film & coach meeting':kind==='coach'?'Program staff meeting':'Family pickup check-in',4,4.5,{eventType:'meeting',participantId:kind==='parent'?'parent':p}));
 activities.push(event('tomorrow',kind==='college'?'Evening with friends':kind==='coach'?'Weekend preparation':'Jamie · Personal workout',kind==='college'?10:25,kind==='college'?11:26,{eventType:'personal',participantId:kind==='parent'?'parent':p,visibility:'private',ownerId:personId,location:kind==='college'?'Campus café':'Community fitness studio'}));
 activities.push(event('canceled','Skills session',48,49,{status:'canceled'}));
 // Exact duplicate candidate retains both sources; never silently removes evidence.
 const duplicate=event('calendar-copy',title,.75,1.75,{sourceId:'calendar-'+org,sourceIdentity:'demo-calendar-'+org,location:changed.location,teamId:teams[0].id,lastSynchronizedAt:at(-30)});activities.push(duplicate);
 if(kind==='college'){
 activities.splice(1,1,event('lab','Biology lab',1,2,{eventType:'class',visibility:'private',ownerId:personId,priority:1}));
 activities.push(event('coach-private','Skills coaching session',2,3,{organizationId:'club',role:'coach',teamId:'skills',visibility:'organization'}));
 // Explicit negative fixture: never visible to this principal despite same role/org.
 activities.push(event('other-private','OTHER PERSON PRIVATE APPOINTMENT',2,3,{eventType:'personal',visibility:'private',ownerId:'someone-else',permissionScope:{tenantId,organizationId:org,role,personIds:['someone-else']}}));
 }
 return {kind,label:scenarioLabels[kind],ctx,organizations,teams,participants,sources,activities,history,actions:{},now,initialNow:now};
}
