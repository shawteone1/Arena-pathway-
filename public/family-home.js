import {findCatalogRecord} from './catalog-records.js';
// Parent-home read adapter. Existing athlete/SIEM stores and engines remain authoritative.
import {localFamilyCalendar} from './local-family-calendar.js';
import {scopedActivities,actionQueue} from './siem-platform-model.js';
import {loadState} from './state.js';
export function familyOverview(storage,catalog,{now=Date.now()}={}){
 const profiles=loadState(storage).profiles,dataset=localFamilyCalendar(storage,{catalog,now}),events=scopedActivities(dataset,dataset.ctx);let legacy=null;try{legacy=JSON.parse(storage.getItem('arenaPathway.siem.v1')||'null');}catch{}
 const parent=legacy?.athletes?.find(p=>p.type==='parent')||null;
 const commitments=events.filter(e=>e.eventType!=='communication'&&e.status!=='canceled'&&Date.parse(e.end)>=now).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start));
 const messages=events.filter(e=>e.eventType==='communication').sort((a,b)=>Date.parse(b.originalSourceTimestamp)-Date.parse(a.originalSourceTimestamp));
 const changes=events.filter(e=>e.status==='canceled'||(legacy?.events||[]).some(r=>r.id===e.eventId&&r.version>1)).sort((a,b)=>Date.parse(b.originalSourceTimestamp)-Date.parse(a.originalSourceTimestamp));
 const actions=actionQueue(dataset,dataset.ctx).filter(a=>a.status!=='resolved');
 const saved=profiles.flatMap(p=>p.saved.map(id=>({id,athleteId:p.id,athlete:p.nickname,record:findCatalogRecord(catalog,id)})));
 const lightweight=dataset.participants.filter(p=>!profiles.some(a=>a.id===p.id)&&(legacy?.athletes||[]).some(a=>a.id===p.id&&a.type!=='parent'));
 return {parent,profiles,lightweight,dataset,commitments,messages,changes,actions,saved};
}
