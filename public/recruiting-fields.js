// Ported from Soccer Center 11de067: coach-profile-fields.ts and
// src/lib/portal/coach-sharing.ts. See docs/shared-recruiting-20261115/REUSE-MATRIX.md.
// Canonical keys deliberately match SC; AP supplies sport data and local consent.
export const COACH_PROFILE_FIELDS=Object.freeze([
 {key:'label',label:'athlete name',group:'identity',description:'Existing athlete display name'},
 {key:'ageBand',label:'age group',group:'identity',description:'Parent-entered participation category'},
 {key:'graduationYear',label:'graduation year',group:'identity',description:'Existing expected graduation year'},
 {key:'jersey',label:'jersey / lane label',group:'identity',description:'Existing athlete-entered number or lane label'},
 {key:'photo',label:'athlete photo',group:'identity',description:'Existing photo, owner preview only; not external sharing'},
 {key:'primaryPosition',label:'primary position / event',group:'positions',description:'Existing sport position or event'},
 {key:'secondaryPosition',label:'secondary position / event',group:'positions',description:'Existing secondary role'},
 {key:'clubName',label:'club / team',group:'club',description:'Family-entered affiliation, not verified membership'},
 {key:'athleticHistory',label:'athletic history',group:'club',description:'Family-entered participation history'},
 {key:'playingLevel',label:'playing level',group:'club',description:'Family-reported participation level'},
 {key:'profileIntroduction',label:'About Me',group:'profile',description:'Existing athlete introduction'},
 {key:'collegeGoals',label:'college goals',group:'profile',description:'Recruiting interests and academic / athletic aspirations'},
 {key:'highSchool',label:'high school',group:'profile',description:'School name and location; selected separately from identity'},
 {key:'academics',label:'academics',group:'profile',description:'Family-reported academic details, GPA and intended major'},
 {key:'achievements',label:'achievements',group:'profile',description:'Personal honors and achievements from selected competition records'},
 {key:'stats',label:'stats',group:'stats',description:'Only selected competition records; never practices or profile totals'},
 {key:'measurements',label:'performance measurements',group:'stats',description:'Sport-specific measurements from selected performances'},
 {key:'highlights',label:'highlights',group:'profile',description:'Only uploaded media selected below'},
 {key:'upcomingEvents',label:'upcoming events',group:'profile',description:'Only selected games, meets, tournaments, camps or showcases'},
]);
// Direct JavaScript port of SC's allowlisted output mapping/filter. AP adds
// measurements and schoolLocation; unsupported soccer/contact/internal keys stay absent.
const FIELD_OUTPUTS={
 label:['label'],jersey:['jersey'],ageBand:['ageBand'],graduationYear:['graduationYear'],photo:['avatarUrl'],
 primaryPosition:['primaryPosition'],secondaryPosition:['secondaryPosition'],
 clubName:['clubName','teamName'],athleticHistory:['athleticHistory'],playingLevel:['playingLevel'],
 profileIntroduction:['profileIntroduction'],collegeGoals:['collegeGoals'],
 highSchool:['highSchool','schoolCity','schoolState','schoolLocation'],academics:['academics'],
 achievements:['achievements'],stats:['stats','statsTableAvailable','approvedMatchRecordCount'],
 measurements:['measurements'],highlights:['highlights'],upcomingEvents:['upcomingEvents'],
};
export function filterCoachProfile(profile,fields){
 const source=profile,result={};
 for(const field of fields){
  for(const key of (Object.prototype.hasOwnProperty.call(FIELD_OUTPUTS,field)?FIELD_OUTPUTS[field]:[])??[]){
   if(Object.prototype.hasOwnProperty.call(source,key))result[key]=source[key];
  }
 }
 if('mediaOriginProtected' in source)result.mediaOriginProtected=source.mediaOriginProtected;
 return result;
}
const legacyFields={identity:['label','primaryPosition','clubName','graduationYear','highSchool'],overview:['profileIntroduction'],academics:['academics'],goals:['collegeGoals'],schedule:['upcomingEvents'],stats:['stats'],achievements:['achievements'],highlights:['highlights']};
export function selectedFields(recruiting={}){
 const keys=Array.isArray(recruiting.approvedFields)?recruiting.approvedFields:Object.entries(legacyFields).filter(([key])=>recruiting.visibility?.[key]).flatMap(([,keys])=>keys);
 const allow=new Set(COACH_PROFILE_FIELDS.map(f=>f.key));return [...new Set(keys.filter(k=>allow.has(k)))];
}
