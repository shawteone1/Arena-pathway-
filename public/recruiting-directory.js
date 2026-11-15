// Ported program-with-optional-coaches contract from SC RecruitingTab.tsx.
// AP adapts only its reviewed sport records, never SC's bundled soccer contacts.
import {recruitingSport} from './recruiting-sports.js';
export function collegeDivision(value=''){
 if(/NJCAA/i.test(value))return 'NJCAA';if(/NAIA/i.test(value))return 'NAIA';if(/NCAA/i.test(value)){if(/(?:Division\s*III|Division\s*3|D3)\b/i.test(value))return 'NCAA D3';if(/(?:Division\s*II|Division\s*2|D2)\b/i.test(value))return 'NCAA D2';if(/(?:Division\s*I|Division\s*1|D1)\b/i.test(value))return 'NCAA D1';}if(/club|MCLA|WCLA/i.test(value))return 'Collegiate club';return 'Unconfirmed';
}
const official=url=>{try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
export function verifiedCoaches(catalog,program,{now=new Date()}={}){
 return (catalog.recruitingCoaches||[]).filter(c=>c.sport===program.sport&&c.programId===program.id&&c.verificationStatus==='verified'&&c.officialStaffPage===true&&c.name&&official(c.staffPageUrl)&&Number.isFinite(Date.parse(c.checkedDate))&&Date.parse(c.checkedDate)<=now&&now-Date.parse(c.checkedDate)<=90*86400000).map(c=>({coachId:c.id,name:c.name,role:c.role||null,email:c.emailIsPersonal===false&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email||'')?c.email:null,staffPageUrl:official(c.staffPageUrl),checkedDate:c.checkedDate}));
}
export function collegeRows(catalog,sport){
 recruitingSport(sport);
 const pids=new Set((catalog.participation?.programs||[]).filter(p=>p.designation==='college'&&p.sport===sport).map(p=>p.id)),ids=new Set((catalog.participation?.teamAssignments||[]).filter(a=>pids.has(a.programId)).map(a=>a.teamId));
 return catalog.teams.filter(t=>t.sport===sport&&ids.has(t.id)).map(t=>{const org=[...catalog.organizations,...catalog.schools].find(o=>o.id===t.organizationId),record={...t,institution:org?.name||t.name,city:org?.city||'',region:org?.region||'',state:org?.state||'',programGender:/\bwomen[’'s]*\b|girls/i.test(t.name)?'women':/\bmen[’'s]*\b|boys/i.test(t.name)?'men':'unknown',divisionLabel:collegeDivision(t.division),officialURL:official(catalog.sources.find(s=>t.sourceIds?.includes(s.id))?.url)||''};return {...record,coaches:verifiedCoaches(catalog,record)};});
}
