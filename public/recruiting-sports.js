// One recruiting UI. Configurations adapt AP's existing sport domain; no new sports enabled.
import {calendarDate} from './siem-calendar.js';
import {sportMetrics} from './athlete-records.js';
import {swimmingProgress,formatTime} from './swimming-progress.js';
const common={measurementFields:[],competitionKinds:['game','match','meet','tournament'],appearanceKinds:['game','match','meet','tournament','camp','showcase'],resources:[{label:'NCAA recruiting resources',url:'https://www.ncaa.org/eligibility-center/recruiting/'},{label:'Colorado high-school resources · accessibility unverified',url:'https://chsaanow.com/'}]};
const swimmingMeasurements=(profile,records,events)=>{
 const keys=new Set(records.map(r=>{const e=events.find(e=>(e.occurrenceId||e.id)===r.eventRef);return (r.discipline||e?.discipline||'').toLowerCase().trim()+'|'+(r.course||e?.course||'');}));
 return swimmingProgress({...profile,records,swimmingTargets:(profile.swimmingTargets||[]).filter(t=>keys.has(String(t.discipline||'').toLowerCase().trim()+'|'+t.course))},events).map(row=>({label:row.discipline+' · '+row.course,personalBest:row.personalBest?formatTime(row.personalBest):null,targetTime:row.target?formatTime(row.target):null}));
};
export const RECRUITING_SPORTS=Object.freeze({
 lacrosse:{...common,id:'lacrosse',name:'Lacrosse',positions:['Attack','Midfield','Defense','Goalie'],competitionLabel:'Game / tournament',recordLabel:'Game records',metrics:sportMetrics.lacrosse,aggregation:'sum',measurements:()=>[]},
 basketball:{...common,id:'basketball',name:'Basketball',positions:['Point guard','Shooting guard','Small forward','Power forward','Center'],competitionLabel:'Game / tournament',recordLabel:'Game records',metrics:sportMetrics.basketball,aggregation:'sum',measurements:()=>[]},
 volleyball:{...common,id:'volleyball',name:'Volleyball',positions:['Setter','Outside hitter','Opposite','Middle blocker','Libero','Defensive specialist'],competitionLabel:'Match / tournament',recordLabel:'Match records',metrics:sportMetrics.volleyball,aggregation:'sum',measurements:()=>[]},
 swimming:{...common,id:'swimming',name:'Swimming',measurementFields:['Personal Best','Target Time'],positions:['Freestyle','Backstroke','Breaststroke','Butterfly','Individual medley','Relay'],competitionLabel:'Race / meet',recordLabel:'Race records',metrics:sportMetrics.swimming,aggregation:'records',measurements:swimmingMeasurements},
});
export function recruitingSport(id){const config=RECRUITING_SPORTS[id];if(!config)throw Error('Recruiting is not configured for this sport.');return config;}
export function eligibleCompetitions(events,config){return events.filter(e=>!e.container&&config.competitionKinds.includes(e.kind));}
export function appearanceEvents(events,config,{now=new Date(),today=calendarDate(now.toISOString())}={}){return events.filter(e=>!e.container&&config.appearanceKinds.includes(e.kind)&&(e.endAt?Date.parse(e.endAt)>=now.getTime():(e.end||e.start)>=today));}
// SC aggregation policy: no profile totals fallback; a missing metric is not zero.
export function selectedStatistics(records,config){
 return {available:records.length>0,recordCount:records.length,label:config.recordLabel,aggregation:config.aggregation,metrics:config.metrics.map(key=>{const values=records.map(r=>r.metrics?.[key]).filter(Number.isFinite);return {key,value:values.length&&config.aggregation==='sum'?values.reduce((a,b)=>a+b,0):null,recordedCount:values.length};}),records:records.map(r=>({id:r.id,eventRef:r.eventRef,metrics:Object.fromEntries(config.metrics.filter(k=>Number.isFinite(r.metrics?.[k])).map(k=>[k,r.metrics[k]])),discipline:r.discipline||null,course:r.course||null}))};
}
