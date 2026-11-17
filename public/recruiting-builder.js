// Retired presentation entry. Retain the historical module URL/export for callers,
// but never construct another checklist, preview or athlete record.
export function renderRecruitingBuilder(profile){
 if(typeof location==='undefined')return;
 const target=new URL('/recruiting',location.origin);if(profile?.id)target.searchParams.set('athlete',profile.id);
 if(location.pathname!=='/recruiting')location.replace(target.pathname+target.search);
}
