// Read-only projection of the existing verified directory. No ingestion or data copy.
import {directory,opportunities,clientCatalog,sourceFor} from '../src/unified-directory.mjs';
const sports=new Set(['lacrosse','volleyball','basketball','swimming']);
export const officialResources=[
 {id:'usa-lacrosse',kind:'education',name:'USA Lacrosse · Coaching development',url:'https://www.usalacrosse.com/',summary:'Official governing-body resource. Check current courses, certification and renewal requirements with the organization.'},
 {id:'nfhs',kind:'education',name:'NFHS Learning Center',url:'https://nfhslearn.com/',summary:'Official coaching education resource. Course access, requirements and fees are controlled by NFHS.'},
 {id:'chsaa',kind:'jobs',name:'CHSAA · Colorado school sports',url:'https://chsaanow.com/',summary:'Official Colorado association resource. Check published coaching opportunities and school requirements at the source; no specific vacancy is verified here.'}
];
const https=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}};
export function networkProjection(params=new URLSearchParams()){
 const sport=sports.has(params.get('sport'))?params.get('sport'):'volleyball',kind=params.get('kind')||'clubs',q=(params.get('q')||'').slice(0,100).toLowerCase();
 if(['education','jobs'].includes(kind))return {sport,kind,asOf:new Date().toISOString(),status:'official-resources-not-verified-openings',total:officialResources.filter(r=>r.kind===kind).length,items:officialResources.filter(r=>r.kind===kind).map(r=>({...r,classification:'Official resource · no live opening claimed',reviewedAt:null})),notice:kind==='jobs'?'No dated Colorado coaching vacancies are verified in the current snapshot. These are official resources to check, not job advertisements.':'Official reference links; current requirements and course availability require confirmation.'};
 const raw=kind==='clubs'?directory(sport,'youth',new URLSearchParams({q})):opportunities(sport,'youth',kind==='tryouts'?'tryout':kind==='camps'?'camp':kind==='tournaments'?'tournament':kind==='showcases'?'showcase':kind,new URLSearchParams({q}));
 const items=raw.map(row=>{
  const record=row.organization||row;let source;try{source=sourceFor(record);}catch{}
  source=source?.url?source:clientCatalog.sources.find(s=>[...(record.sourceIds||[]),...(row.sourceIds||[]),...(row.programs?.flatMap(p=>p.sourceIds)||[])].includes(s.id));
  return {id:row.id||record.id,name:record.name||row.name,sport,kind,summary:record.summary||row.summary||row.programs?.map(p=>p.name).join(' · ')||'Reviewed program reference',city:record.city||'',state:record.state||'Location unconfirmed',url:https(source?.url),source:source?.title||source?.id||'Source unavailable',reviewedAt:source?.reviewedAt||null,start:row.start||null,end:row.end||null,scheduleState:row.scheduleState||'Confirm current availability',classification:'Reviewed source snapshot · not live availability'};
 }).filter(r=>r.url&&(!q||[r.name,r.summary,r.city].join(' ').toLowerCase().includes(q)));
 return {sport,kind,total:items.length,asOf:new Date().toISOString(),items:items.slice(0,60),notice:'Colorado-first existing reviewed AP data. Verification applies to sourced facts at review time. Dates, enrollment and availability must be confirmed with the official source; no registration or booking occurs here.'};
}
