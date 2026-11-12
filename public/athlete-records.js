export const sportMetrics={lacrosse:['Goals','Assists','Ground balls','Saves'],volleyball:['Kills','Assists','Aces','Blocks','Digs'],basketball:['Points','Rebounds','Assists','Steals'],swimming:['Time (seconds)','Place','Distance (meters)']};
export function saveGameRecord(profile,{eventRef,metrics={},achievement='',notes=''}){
 if(!eventRef||typeof eventRef!=='string')throw Error('Choose a scheduled game or meet.');
 const allowed=sportMetrics[profile.sport]||[],clean={};for(const [key,value] of Object.entries(metrics)){if(!allowed.includes(key)||value==='')continue;const n=Number(value);if(!Number.isFinite(n)||n<0||n>100000)throw Error('Statistics must be nonnegative numbers.');clean[key]=n;}
 const previous=(profile.records||[]).find(r=>r.eventRef===eventRef),record={...previous,id:previous?.id||crypto.randomUUID(),eventRef,metrics:clean,achievement:String(achievement).trim().slice(0,300),notes:String(notes).trim().slice(0,1000)};
 profile.records=[...(profile.records||[]).filter(r=>r.eventRef!==eventRef),record];return record;
}
export function totalsFor(profile){if(profile.sport==='swimming'){const times=(profile.records||[]).map(r=>r.metrics?.['Time (seconds)']).filter(Number.isFinite);return times.length?{'Recorded swims':times.length}:{};}const totals={};for(const record of profile.records||[])for(const [key,value] of Object.entries(record.metrics||{}))if(Number.isFinite(value))totals[key]=(totals[key]||0)+value;return totals;}
export function recruitingGate(profile,{now=new Date()}={}){
 const age=Number(profile.ageYears),reviewed=Date.parse(profile.ageReviewedAt||''),ageKnown=Number.isInteger(age)&&age>=16&&age<=100&&Number.isFinite(reviewed)&&now-reviewed<=366*86400000&&now>=reviewed;
 const rules=profile.recruiting?.rulesReview;
 return {ageKnown,parent:profile.role==='parent'&&profile.guardian===true,rules:!!(rules?.acknowledged&&rules.sport===profile.sport&&Date.parse(rules.at)<=now&&now-Date.parse(rules.at)<=90*86400000),get allowed(){return this.ageKnown&&this.parent&&this.rules;}};
}
export function recruitingSnapshot(profile,events,media){
 const gate=recruitingGate(profile);if(!gate.allowed||!profile.recruiting?.parentApproved)throw Error('Parent approval, age 16+ review and sport-specific rules review are required.');
 const fields=profile.recruiting.visibility||{},out={athleteId:profile.id,sport:profile.sport,localPreviewOnly:true,sharing:'Not connected',approvedAt:profile.recruiting.approvedAt};
 if(fields.identity)out.identity={name:profile.nickname,clubTeam:profile.clubTeam,position:profile.position};
 if(fields.schedule)out.schedule=events.map(e=>({eventRef:e.occurrenceId||e.id,name:e.name,start:e.start,kind:e.kind}));
 if(fields.stats)out.records=profile.records||[];
 if(fields.achievements)out.achievements=(profile.records||[]).filter(r=>r.achievement).map(r=>({eventRef:r.eventRef,achievement:r.achievement}));
 if(fields.highlights)out.highlights=media.filter(m=>(profile.recruiting.highlightIds||[]).includes(m.id)&&m.athleteId===profile.id).map(m=>({id:m.id,caption:m.caption,eventRef:m.eventRef,type:m.type}));
 return out;
}
