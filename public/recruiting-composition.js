import {selectedFields} from './recruiting-fields.js';
export const presentationSections=Object.freeze([
 {id:'introduction',title:'Athlete Introduction',fields:['label','photo','graduationYear','primaryPosition','profileIntroduction','collegeGoals']},
 {id:'background',title:'Athletic Background',fields:['clubName','playingLevel','secondaryPosition']},
 {id:'education',title:'Education & Academics',fields:['highSchool','academics']},
 {id:'achievements',title:'Achievements',fields:['achievements']},
 {id:'performance',title:'Performance',fields:['stats','measurements']},
 {id:'highlights',title:'Highlights',fields:['highlights']},
 {id:'appearances',title:'Upcoming Appearances',fields:['upcomingEvents']},
]);
const list=v=>[...new Set((Array.isArray(v)?v:[]).filter(x=>typeof x==='string'))];
export function draftSelection(p){const r=p.recruiting||{};return {fields:selectedFields(r),recordIds:list(r.recordIds),eventRefs:list(r.eventRefs),highlightIds:list(r.highlightIds),achievementSelections:list(r.achievementSelections)};}
export function savedSelection(p){const r=p.recruiting||{};if(r.presentation?.selection)return {fields:selectedFields({approvedFields:r.presentation.selection.fields}),...Object.fromEntries(['recordIds','eventRefs','highlightIds','achievementSelections'].map(k=>[k,list(r.presentation.selection[k])]))};return r.profileBuiltAt||r.parentApproved?draftSelection(p):null;}
export function withSelection(p,s){return {...p,recruiting:{...p.recruiting,approvedFields:s.fields,recordIds:s.recordIds,eventRefs:s.eventRefs,highlightIds:s.highlightIds,achievementSelections:s.achievementSelections}};}
export function chooseSection(p,id,included){const section=presentationSections.find(s=>s.id===id);if(!section)throw Error('Unknown presentation section');const fields=new Set(selectedFields(p.recruiting));for(const key of section.fields)included?fields.add(key):fields.delete(key);p.recruiting.approvedFields=[...fields];p.recruiting.parentApproved=false;}
export function saveComposition(p,revision,{now=new Date(),selection=draftSelection(p)}={}){if(!selection.fields.includes('label'))throw Error('Include Athlete Introduction before saving your recruiting profile.');p.recruiting.presentation={schemaVersion:1,selection:structuredClone(selection),savedAt:now.toISOString(),sourceRevision:revision};p.recruiting.profileBuiltAt=now.toISOString();p.recruiting.journeyStep=4;p.recruiting.parentApproved=false;return p.recruiting.presentation;}
