import {empty,upsert,detect,scoped,act} from './siem-model.js';
export const scenarioIds=['parent','coach','college'];
export function makeDemo(kind,now=Date.now()){
 if(!scenarioIds.includes(kind))throw Error('Unknown demonstration');
 const state=empty();state.familyId='demo-'+kind;
 const names={parent:[['alex','Alex · swimming','swimming'],['riley','Riley · basketball','basketball']],coach:[['u12','U12 · field program','soccer'],['u15','U15 · development program','soccer']],college:[['sam','Sam · college athletics','basketball']]};
 state.athletes=names[kind].map(([id,name,sport])=>({id,name,sport,type:'athlete'}));
 const ctx={id:'demo-operator',familyId:state.familyId,role:'parent',athleteIds:state.athletes.map(a=>a.id)};
 const day=new Date(now);day.setDate(day.getDate()+1);day.setHours(16,0,0,0);const at=h=>new Date(day.getTime()+h*3600000).toISOString();
 const first=state.athletes[0].id,second=state.athletes[1]?.id||first;
 const add=(ref,athleteId,title,type,start,end,extra={})=>upsert(state,ctx,{ref,athleteId,title,type,start:at(start),end:at(end),source:'manual',organization:'Illustrative '+(kind==='coach'?'Soccer Center club':'program'),evidence:'Fictional demo fixture; not retrieved from a provider.',...extra});
 add('practice',first,kind==='college'?'Team practice':kind==='coach'?'U12 field session':'Alex swim practice','practice',0,1,{location:'Sample training venue'});
 add('practice',first,kind==='college'?'Team practice':kind==='coach'?'U12 field session':'Alex swim practice','practice',.25,1.25,{location:'Updated sample training venue'});
 add('overlap',second,kind==='college'?'Chemistry lab':kind==='coach'?'U15 field session':'Riley basketball practice','practice',.5,1.5,{activity:kind==='college'?'class':'team activity'});
 add('deadline',first,kind==='college'?'Confirm academic travel plan':kind==='coach'?'Confirm field allocation':'Confirm family transport','deadline',-2,-1.75,{requirements:[{id:'confirm',label:'Review and confirm locally',complete:false}]});
 add('notice',first,'Schedule update: venue changed','communication',-3,-2.9);
 if(kind==='college')add('personal',first,'Dinner with friends','practice',3,4,{activity:'personal commitment',location:'Sample campus café'});
 add('canceled',second,kind==='college'?'Study group':kind==='coach'?'Program meeting':'Weekend skills session','practice',24,25,{status:'canceled'});
 return {kind,state,ctx,now};
}
export const demoEvents=(demo,athleteId='')=>scoped(demo.state,demo.ctx,athleteId?{athlete:athleteId}:{});
export const demoAlerts=(demo,athleteId='')=>detect(demo.state,demo.ctx,demo.now).filter(a=>!athleteId||a.athleteIds.includes(athleteId));
export function acknowledgeDemo(demo,id){act(demo.state,demo.ctx,id,'acknowledged');}
