// Selection rules over existing athlete events/records; no second event or record store.
import {recruitingSnapshot} from './athlete-records.js';
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
