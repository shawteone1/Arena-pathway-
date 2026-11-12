// Adapted from AP-QA-20261112 Candidate A. Pure, bounded expansion; never writes generated events.
export const EVENT_KINDS=Object.freeze(['practice','game','meet','tournament','camp','travel','other']);
const DAY=86400000,iso=d=>d.toISOString().slice(0,10),day=s=>new Date(s+'T12:00:00Z');
export const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&s>='1900-01-01'&&s<='2100-12-31'&&Number.isFinite(+day(s))&&iso(day(s))===s;
const timeOK=s=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export function denverInstant(date,time){
 if(!validDate(date)||!timeOK(time))throw Error('A valid date and time are required.');
 const target=Date.parse(date+'T'+time+':00Z'),format=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const wall=stamp=>{const p=format.formatToParts(new Date(stamp)),v=k=>p.find(x=>x.type===k).value;return v('year')+'-'+v('month')+'-'+v('day')+'T'+v('hour')+':'+v('minute');};
 let instant=target;for(let i=0;i<4;i++){const delta=target-Date.parse(wall(instant)+':00Z');if(!delta)break;instant+=delta;}
 if(wall(instant)!==date+'T'+time)throw Error('This Denver time does not exist because of daylight saving time.');
 return new Date(instant).toISOString();
}
export function normalizePlan(input){
 const name=String(input.name||'').trim().slice(0,100),start=String(input.start||'');if(!name||!validDate(start))throw Error('A title and valid start date are required.');
 const end=input.end||start;if(!validDate(end)||end<start)throw Error('End date must be valid and on or after the start.');
 const repeat=input.repeat==='weekly'?'weekly':'none',until=repeat==='weekly'?input.until:null;
 if(repeat==='weekly'&&(!validDate(until)||until<start||(+day(until)-day(start))/DAY>366))throw Error('Repeating events need an end date within one year of the start.');
 const interval=Number(input.interval||1);if(!Number.isInteger(interval)||interval<1||interval>4)throw Error('Choose a repeat interval of 1–4 weeks.');
 const days=Array.isArray(input.days)?[...new Set(input.days.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<=6))]:[];
 const startTime=input.startTime||'',endTime=input.endTime||'';if(startTime||endTime){if(!timeOK(startTime)||!timeOK(endTime)||denverInstant(end,endTime)<=denverInstant(start,startTime))throw Error('Provide valid start/end times with the end after the start (America/Denver).');}
 return {...input,id:String(input.id||''),name,start,end,kind:EVENT_KINDS.includes(input.kind)?input.kind:'other',repeat,interval,until,days:repeat==='weekly'?(days.length?days:[day(start).getUTCDay()]):[],startTime,endTime,note:String(input.note||'').trim().slice(0,180),excludedDates:Array.isArray(input.excludedDates)?input.excludedDates.filter(validDate):[],overrides:input.overrides&&typeof input.overrides==='object'?input.overrides:{}};
}
export function expandPlan(raw,{from='1900-01-01',to='2100-12-31',maxOccurrences=400}={}){
 const p=normalizePlan(raw);if(!p.id)throw Error('A stable event ID is required.');if(!validDate(from)||!validDate(to)||from>to||!Number.isInteger(maxOccurrences)||maxOccurrences<1||maxOccurrences>400)throw Error('Invalid expansion bounds.');
 const duration=(+day(p.end)-day(p.start))/DAY,output=[];
 function occurrence(original){
  if(p.excludedDates.includes(original))return;
  const finish=day(original);finish.setUTCDate(finish.getUTCDate()+duration);
  const override=p.overrides[original]||{},event=normalizePlan({...p,start:original,end:iso(finish),...override,repeat:'none',until:null});
  if(event.start>to||event.end<from)return;
  const occurrenceId=p.repeat==='weekly'?p.id+'@'+original:p.id;
  let startAt=null,endAt=null;if(event.startTime){startAt=denverInstant(event.start,event.startTime);endAt=denverInstant(event.end,event.endTime);}
  output.push({...event,repeat:p.repeat,originalDate:original,seriesId:p.id,occurrenceId,allDay:!startAt,startAt,endAt});
 }
 if(p.repeat==='none')occurrence(p.start);
 else{
  const start=day(p.start),weekStart=new Date(start);weekStart.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
  for(let d=new Date(start);iso(d)<=p.until;d.setUTCDate(d.getUTCDate()+1))if(Math.floor((d-weekStart)/DAY/7)%p.interval===0&&p.days.includes(d.getUTCDay())){occurrence(iso(d));if(output.length>=maxOccurrences)break;}
 }
 return output.sort((a,b)=>(a.startAt||a.start).localeCompare(b.startAt||b.start));
}
export function expandPlans(plans,opts={}){const seen=new Set();return (Array.isArray(plans)?plans:[]).flatMap(p=>{try{return expandPlan(p,opts);}catch{return [];}}).filter(e=>{if(seen.has(e.occurrenceId))return false;seen.add(e.occurrenceId);return true;}).sort((a,b)=>(a.startAt||a.start).localeCompare(b.startAt||b.start)||a.name.localeCompare(b.name));}
export function changeOccurrence(plan,originalDate,changes){
 const p=normalizePlan(plan);if(!expandPlan(p).some(e=>e.originalDate===originalDate))throw Error('Occurrence unavailable.');
 const original=expandPlan(p).find(e=>e.originalDate===originalDate);const value=normalizePlan({...original,...changes,repeat:'none',id:p.id});
 return {...p,overrides:{...p.overrides,[originalDate]:{name:value.name,start:value.start,end:value.end,startTime:value.startTime,endTime:value.endTime,kind:value.kind,note:value.note}}};
}
export function removeOccurrence(plan,originalDate){const p=normalizePlan(plan);return {...p,excludedDates:[...new Set([...p.excludedDates,originalDate])]};}
