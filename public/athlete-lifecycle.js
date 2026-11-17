// Local removal is an atomic archive/tombstone operation, not secure erasure.
export function removedAthleteIds(state){return new Set((state?.deletedAthletes||[]).filter(x=>typeof x?.id==='string').map(x=>x.id));}
export function deletedAthleteIds(storage){try{return removedAthleteIds(JSON.parse(storage.getItem('arenaPathway.v2')||'null'));}catch{return new Set();}}
export function archiveAthlete(state,id,confirmation,{now=new Date()}={}){
 const athlete=state.profiles.find(p=>p.id===id);if(!athlete)throw Error('This athlete is no longer active.');
 if(athlete.role!=='parent'||athlete.guardian!==true)throw Error('Local parent management is required to remove this athlete.');
 if(confirmation!==athlete.nickname)throw Error('Type the athlete’s name exactly to confirm.');
 const next=structuredClone(state),deletedAt=now.toISOString();next.archivedProfiles=[...(next.archivedProfiles||[]).filter(x=>x.profile.id!==id),{profile:structuredClone(athlete),deletedAt}];next.deletedAthletes=[...(next.deletedAthletes||[]).filter(x=>x.id!==id),{id,deletedAt}];next.profiles=next.profiles.filter(p=>p.id!==id);if(next.active===id)next.active=next.profiles[0]?.id||null;return next;
}
export function protectRemoval(next,stored){
 const out={...next},tombstones=new Map([...(stored?.deletedAthletes||[]),...(next.deletedAthletes||[])].filter(x=>typeof x?.id==='string').map(x=>[x.id,x]));
 if(tombstones.size){out.deletedAthletes=[...tombstones.values()];out.archivedProfiles=[...new Map([...(stored?.archivedProfiles||[]),...(next.archivedProfiles||[])].filter(x=>x?.profile?.id).map(x=>[x.profile.id,x])).values()];out.profiles=next.profiles.filter(p=>!tombstones.has(p.id));if(!out.profiles.some(p=>p.id===out.active))out.active=out.profiles[0]?.id||null;}return out;
}
