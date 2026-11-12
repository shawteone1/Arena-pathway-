// Presentation adaptation of Soccer Center CalendarViews.tsx and calendar-display.ts
// (11de067). Uses AP's existing normalized activities and permission-scoped callbacks.
export const CALENDAR_ZONE='America/Denver';
export function calendarDate(value,allDay=false){
 if(allDay||/^\d{4}-\d{2}-\d{2}$/.test(value))return value.slice(0,10);
 if(!/(Z|[+-]\d{2}:?\d{2})$/i.test(value))return value.slice(0,10);
 const date=new Date(value);if(Number.isNaN(date.valueOf()))return '';
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:CALENDAR_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 return ['year','month','day'].map(type=>parts.find(p=>p.type===type)?.value).join('-');
}
export function shiftCalendarDate(key,view,delta){
 const d=new Date(key+'T12:00:00Z');if(view==='month'){const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+delta);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));}else d.setUTCDate(d.getUTCDate()+delta*(view==='week'?7:1));return d.toISOString().slice(0,10);
}
export function calendarRange(key,view){
 const start=new Date(key+'T12:00:00Z');if(view==='week')start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);if(view==='month')start.setUTCDate(1);
 const end=new Date(start);if(view==='month')end.setUTCMonth(end.getUTCMonth()+1);else end.setUTCDate(end.getUTCDate()+(view==='week'?7:1));
 return {start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)};
}
export function activityKind(event){return event.eventType==='tournament'||event.eventType==='game'&&/\btournament\b/i.test(event.title)?'tournament':['practice','game','meet','camp','travel'].includes(event.eventType)?event.eventType:'other';}
export function activityDates(event){const start=calendarDate(event.start),last=Number.isFinite(Date.parse(event.end))?calendarDate(new Date(Date.parse(event.end)-1).toISOString()):start;return {start,end:last<start?start:last};}
export const activityLabels={practice:'Practice',game:'Game',tournament:'Tournament',meet:'Meet',camp:'Camp',travel:'Travel',other:'Other activity'};
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
// Same month grid + selected-day agenda and responsive week columns as SC. No event copies are persisted.
export function calendarGrid({events,anchor,view,selectedDay,today,onDay,renderEvent}){
 const {start,end}=calendarRange(anchor,view),root=node('section',undefined,'ap-visual-calendar');root.setAttribute('aria-label',view==='month'?'Monthly calendar':'Weekly calendar');
 const byDate=new Map();for(const e of events){const dates=activityDates(e);for(let key=dates.start<start?start:dates.start;key<=dates.end&&key<end;key=shiftCalendarDate(key,'day',1)){if(!byDate.has(key))byDate.set(key,[]);byDate.get(key).push(e);}}
 const label=key=>new Date(key+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'});
 if(view==='week'){
  const grid=node('div',undefined,'ap-week-grid');for(let key=start;key<end;key=shiftCalendarDate(key,'day',1)){
   const day=node('section',undefined,'ap-week-day'),heading=node('h3',label(key));if(key===today)heading.setAttribute('aria-current','date');day.append(heading);const es=byDate.get(key)||[];for(const e of es)day.append(renderEvent(e));if(!es.length)day.append(node('p','No events','ap-small'));grid.append(day);
  }root.append(grid);return root;
 }
 const picked=selectedDay?.slice(0,7)===start.slice(0,7)?selectedDay:today.slice(0,7)===start.slice(0,7)?today:start;
 const weekdays=node('div',undefined,'ap-month-weekdays');weekdays.setAttribute('aria-hidden','true');for(const name of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])weekdays.append(node('span',name));root.append(weekdays);
 const grid=node('div',undefined,'ap-month-grid');const offset=(new Date(start+'T12:00:00Z').getUTCDay()+6)%7;for(let i=0;i<offset;i++){const blank=node('div',undefined,'ap-month-blank');blank.setAttribute('aria-hidden','true');grid.append(blank);}
 for(let key=start;key<end;key=shiftCalendarDate(key,'day',1)){
  const es=byDate.get(key)||[],cell=node('div',undefined,'ap-month-cell'),select=node('button',String(Number(key.slice(8))));select.type='button';select.className='ap-month-day';select.setAttribute('aria-label',label(key)+': '+es.length+' events');select.setAttribute('aria-pressed',String(key===picked));if(key===today)select.setAttribute('aria-current','date');select.addEventListener('click',()=>onDay(key));cell.append(select);
  const count=node('span',es.length?es.length+' events':'','ap-month-count');cell.append(count);
  const indicators=node('div',undefined,'ap-month-indicators');for(const kind of [...new Set(es.map(activityKind))]){const marker=node('span',activityLabels[kind],'ap-calendar-type');marker.dataset.activityType=kind;indicators.append(marker);}cell.append(indicators);grid.append(cell);
 }root.append(grid);
 const agenda=node('section',undefined,'ap-month-agenda');agenda.setAttribute('aria-label','Selected day events');agenda.setAttribute('aria-live','polite');agenda.append(node('h3',label(picked)));const es=byDate.get(picked)||[];for(const e of es)agenda.append(renderEvent(e));if(!es.length)agenda.append(node('p','No events for this day.','ap-empty'));root.append(agenda);return root;
}
