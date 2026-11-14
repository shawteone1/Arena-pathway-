// UI input adaptation only. Keep the tested recurrence/domain normalizer authoritative.
import {normalizePlan} from './recurring-plans.js';
export function scheduleEntry(input){
 const raw={...input};
 if(raw.repeat!=='weekly'&&raw.startTime&&!raw.endTime){
  const [hour,minute]=raw.startTime.split(':').map(Number);
  if(Number.isInteger(hour)&&Number.isInteger(minute)&&hour>=0&&hour<24&&minute>=0&&minute<60){
   const total=hour*60+minute+60;raw.endTime=String(Math.floor(total/60)%24).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
   if(total>=1440){const date=new Date((raw.end||raw.start)+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+1);raw.end=date.toISOString().slice(0,10);}
   raw.endTimeEstimated=true;
  }
 }else if(raw.endTime)raw.endTimeEstimated=false;
 return normalizePlan(raw);
}
