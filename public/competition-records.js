// Selection rules over existing athlete events/records; no second event or record store.
import {recruitingSnapshot,totalsFor} from './athlete-records.js';
export const eventRef=event=>event.occurrenceId||event.id;
export const isCompetition=event=>!!event&&!event.container&&['game','match','meet','tournament'].includes(event.kind);
export const competitionEvents=events=>events.filter(isCompetition);
export function competitionRecords(profile,events){const ids=new Set(competitionEvents(events).map(eventRef));return (profile.records||[]).filter(record=>ids.has(record.eventRef));}
export function selectedRecruitingSnapshot(profile,events,media){
 const preferences=profile.recruiting||{},records=new Set(preferences.recordIds||[]),appearances=new Set(preferences.eventRefs||[]),eligible=competitionEvents(events),selected=competitionRecords(profile,events).filter(r=>records.has(r.id));
 const snapshot=recruitingSnapshot({...profile,records:selected},eligible.filter(e=>appearances.has(eventRef(e))),media);
 const fields=preferences.visibility||{};
 if(fields.identity)snapshot.identity={...snapshot.identity,...Object.fromEntries(['graduationYear','highSchool','schoolLocation'].filter(k=>profile[k]).map(k=>[k,profile[k]]))};
 if(fields.overview)snapshot.overview=profile.aboutSport||'';
 if(fields.academics)snapshot.academics={details:profile.academicDetails||'',intendedMajor:profile.intendedMajor||''};
 if(fields.goals)snapshot.goals=profile.goals||'';
 return snapshot;
}

// A new upload offers competitions only. Editing may keep its exact historical
// association (including a practice or deleted event) without silently changing it.
export function competitionMediaOptions(events,retainedRef=''){
 const options=[['','No event selected'],...competitionEvents(events).map(e=>[eventRef(e),e.start+' · '+e.name])];
 if(retainedRef&&!options.some(([id])=>id===retainedRef)){
  const old=events.find(e=>eventRef(e)===retainedRef);
  options.push([retainedRef,old?'Retained '+(old.kind||'event')+' · '+old.start+' · '+old.name+' (existing upload only)':'Retained event reference · scheduled event removed']);
 }
 return options;
}

// Explicit date boundaries define the parent's season; never infer a season
// from a team label or add incomparable swimming race times.
export function competitionSummary(profile,events,{from='',through=''}={}){
 if(from&&through&&from>through)throw Error('The season end must be on or after its start.');
 const eligible=competitionRecords(profile,events).filter(r=>(!r.athleteId||r.athleteId===profile.id)&&events.some(e=>eventRef(e)===r.eventRef&&(!from||e.start>=from)&&(!through||e.start<=through)));
 return {recordCount:eligible.length,totals:totalsFor({...profile,records:eligible})};
}
