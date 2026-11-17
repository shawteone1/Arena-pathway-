// SC-derived strict projection boundary. Same selected profile feeds every sport's card.
// No writes, no profile/event/media duplication, no external sharing.
import {recruitingGate} from './athlete-records.js';
import {eventRef} from './competition-records.js';
import {filterCoachProfile,selectedFields} from './recruiting-fields.js';
import {recruitingSport,eligibleCompetitions,appearanceEvents,selectedStatistics} from './recruiting-sports.js';
export function localAvatar(value){return typeof value==='string'&&value.length<=3e6&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)?value:null;}
export function buildCoachProjection(profile,options={}){if(!recruitingGate(profile,{now:options.now||new Date()}).allowed)throw Error('Parent management, current age 16+ review and sport-specific rules review are required.');return projectSelected(profile,options);}
// Private owner draft is separate from approval. Rules remain mandatory for strict approval.
export function buildOwnerDraftProjection(profile,options={}){const gate=recruitingGate(profile,{now:options.now||new Date()});if(!gate.parent||!gate.ageKnown)throw Error('A parent-managed athlete with a current age 16+ review is required for recruiting.');return {...projectSelected(profile,options),approved:false,ownerDraft:true};}
function projectSelected(profile,{events=[],media=[],config=recruitingSport(profile.sport),now=new Date()}={}){
 if(config.id!==profile.sport)throw Error('Recruiting sport must match the athlete.');
 const r=profile.recruiting||{},fields=selectedFields(r),competition=eligibleCompetitions(events,config),refs=new Set(competition.map(eventRef)),ids=new Set(r.recordIds||[]),eventIds=new Set(r.eventRefs||[]),mediaIds=new Set(r.highlightIds||[]);
 const records=(profile.records||[]).filter(row=>refs.has(row.eventRef)&&ids.has(row.id)&&(!row.athleteId||row.athleteId===profile.id));
 const gpa=Number(profile.gpa),scale=Number(profile.gpaScale),hasGpa=String(profile.gpa??'').trim()!==''&&String(profile.gpaScale??'').trim()!==''&&Number.isFinite(gpa)&&Number.isFinite(scale)&&scale>0&&gpa>=0&&gpa<=scale;
 const stats=selectedStatistics(records,config);stats.records=stats.records.map(r=>{const e=competition.find(e=>eventRef(e)===r.eventRef);return {...r,title:e?.name||config.recordLabel,date:e?.start||null,discipline:r.discipline||e?.discipline||null,course:r.course||e?.course||null};});
 const legacy=!Array.isArray(r.approvedFields),personal=(Array.isArray(profile.personalAchievements)?profile.personalAchievements:[]).filter(value=>(r.achievementSelections||[]).includes(value));
 const source={
  label:profile.nickname||null,jersey:profile.jersey||null,ageBand:profile.ageGroup||null,graduationYear:profile.graduationYear||null,
  avatarUrl:localAvatar(profile.avatarDataUrl),primaryPosition:profile.position||null,secondaryPosition:profile.secondaryPosition||null,clubName:profile.clubTeam||null,teamName:profile.clubTeamNeedsReview?null:profile.programTeam||null,playingLevel:profile.playingLevel||null,
  athleticHistory:profile.athleticHistory||null,profileIntroduction:profile.aboutSport||null,collegeGoals:profile.collegeGoals||(legacy&&r.visibility?.goals?profile.goals:null)||null,
  highSchool:profile.highSchool||null,schoolLocation:profile.schoolLocation||null,
  academics:{gpa:hasGpa?gpa:null,scale:hasGpa?scale:null,weighted:profile.gpaWeighted==='weighted'?true:profile.gpaWeighted==='unweighted'?false:null,details:profile.academicDetails||null,intendedMajor:profile.intendedMajor||null},
  achievements:[...new Set([...personal,...records.filter(row=>row.achievement).map(row=>row.achievement)])],
  stats,approvedMatchRecordCount:records.length,statsTableAvailable:true,
  measurements:config.measurements(profile,records,competition),
  highlights:media.filter(m=>m.athleteId===profile.id&&mediaIds.has(m.id)&&/^(image|video)\//.test(m.type)).map(m=>({id:m.id,title:m.caption||m.name||'Selected highlight',type:m.type})),
  upcomingEvents:appearanceEvents(events,config,{now}).filter(e=>eventIds.has(eventRef(e))).map(e=>({id:eventRef(e),date:e.start,title:e.name,location:e.note||'',eventType:e.kind,discipline:e.discipline||null,course:e.course||null})),
  mediaOriginProtected:false,
 };
 return {schemaVersion:1,sport:config.id,sportName:config.name,localPreviewOnly:true,externalSharing:false,approved:!!r.parentApproved,...filterCoachProfile(source,fields)};
}

// Local change-detection marker only, not a cryptographic signature or authorization.
// Never persist another athlete snapshot or photo copy just to track preview revision.
export function projectionRevision(projection){
 const text=JSON.stringify({...projection,approved:undefined});let a=2166136261,b=3339675911;
 for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b^text.charCodeAt(i),2246822519);}
 return 'local-v1-'+(a>>>0).toString(16)+'-'+(b>>>0).toString(16);
}
