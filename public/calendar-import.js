import {validDate,denverInstant} from './recurring-plans.js';
import {calendarDate} from './siem-calendar.js';
export function previewCalendar(text,existing=[]){
 if(typeof text!=='string'||text.length>500000)throw Error('Choose an ICS snapshot up to 500 KB.');
 const blocks=text.replace(/\r?\n[ \t]/g,'').match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g)||[];if(!blocks.length||blocks.length>400)throw Error('Expected 1–400 events.');
 const known=new Set(existing.map(e=>e.externalUid||(e.occurrenceId||e.id)+'@arena-pathway.local')),seen=new Set(),plans=[],duplicates=[];
 const decode=s=>s.replace(/\\n/gi,'\n').replace(/\\([,;\\])/g,'$1');
 for(const block of blocks){const lines=block.split(/\r?\n/),get=key=>lines.find(l=>l.startsWith(key+':'))?.slice(key.length+1)||'';if(lines.some(l=>/^(RRULE|RDATE|EXDATE|RECURRENCE-ID|DTSTART;TZID|DTEND;TZID)/.test(l)))throw Error('This preview accepts expanded all-day or UTC events, not recurring/provider timezone rules.');
  const uid=get('UID'),name=decode(get('SUMMARY'));if(!uid||!name)throw Error('Every event needs a UID and title.');if(seen.has(uid)||known.has(uid)){duplicates.push(uid);continue;}seen.add(uid);
  const allDay=get('DTSTART;VALUE=DATE'),start=allDay||get('DTSTART'),end=get('DTEND;VALUE=DATE')||get('DTEND');const plan={id:uid.endsWith('@arena-pathway.local')?uid.slice(0,-'@arena-pathway.local'.length):'ics:'+uid,externalUid:uid,name,kind:'other',repeat:'none',note:decode(get('DESCRIPTION')).slice(0,180)};
  if(allDay){const date=v=>/^\d{8}$/.test(v)?v.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3'):'';plan.start=date(start);const exclusive=date(end);if(!validDate(plan.start)||!validDate(exclusive)||exclusive<=plan.start)throw Error('Invalid all-day dates.');const d=new Date(exclusive+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-1);plan.end=d.toISOString().slice(0,10);}
  else{const instant=v=>{if(!/^\d{8}T\d{6}Z$/.test(v))throw Error('Use explicit UTC times or all-day dates.');const value=v.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,'$1-$2-$3T$4:$5:$6Z');if(!Number.isFinite(Date.parse(value))||new Date(value).toISOString()!==value.replace('Z','.000Z'))throw Error('Invalid UTC timestamp.');return value;};const a=instant(start),b=instant(end),time=v=>new Intl.DateTimeFormat('en-GB',{timeZone:'America/Denver',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(v));plan.start=calendarDate(a);plan.end=calendarDate(b);plan.startTime=time(a);plan.endTime=time(b);if(denverInstant(plan.start,plan.startTime)!==new Date(a).toISOString()||denverInstant(plan.end,plan.endTime)!==new Date(b).toISOString())throw Error('Ambiguous or sub-minute times cannot be imported without changing their meaning.');if(a>=b)throw Error('End must follow start.');}
  const kind=(plan.note.match(/Type: (practice|game|meet|tournament|camp|travel|other)/)||[])[1];if(kind)plan.kind=kind;plans.push(plan);
 }
 return {plans,duplicates};
}
