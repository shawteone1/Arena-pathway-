// Additive projection: races/matches live inside the existing parent plan, never another event store.
import {scheduleFor} from './state.js';
import {normalizePlan,expandPlans} from './recurring-plans.js';
export function sessionPlan(parent,input){
 if(!String(input.id||'').trim())throw Error('A stable session ID is required.');
 if(!['meet','tournament'].includes(parent.kind))throw Error('Sessions belong to a meet or tournament.');
 const offset=Number(input.dayOffset||0),span=(Date.parse(parent.end||parent.start)-Date.parse(parent.start))/86400000;
 if(!Number.isInteger(offset)||offset<0||offset>span)throw Error('Session day must fall within the meet/tournament.');
 const date=new Date(parent.start+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+offset);
 return {...normalizePlan({...input,start:date.toISOString().slice(0,10),end:date.toISOString().slice(0,10),kind:parent.kind==='meet'?'meet':'game',repeat:'none'}),dayOffset:offset,discipline:String(input.discipline||'').trim().slice(0,100),course:['SCY','SCM','LCM'].includes(input.course)?input.course:''};
}
export function athleteEvents(profile,catalog){
 const events=catalog?scheduleFor(profile,catalog):expandPlans(profile.plans||[]),out=[];
 for(const parent of events){const children=[];for(const raw of parent.sessions||[]){try{const s=sessionPlan(parent,raw),id=(parent.occurrenceId||parent.id)+'#'+s.id,expanded=expandPlans([{...s,id}])[0];if(expanded)children.push({...expanded,name:parent.name+' · '+s.name,parentRef:parent.occurrenceId||parent.id,parentPlanId:parent.seriesId||parent.id,sessionId:s.id,discipline:s.discipline,course:s.course});}catch{/* Preserve invalid legacy data without inventing an event. */}}
 out.push({...parent,container:children.length>0},...children);
 }const seen=new Set();return out.filter(e=>{const id=e.occurrenceId||e.id;if(seen.has(id))return false;seen.add(id);return true;}).sort((a,b)=>(a.startAt||a.start).localeCompare(b.startAt||b.start));
}
