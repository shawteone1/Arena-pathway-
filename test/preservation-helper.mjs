import {execFileSync} from 'node:child_process';
export const uxFiles=new Set(['server.mjs','src/views.mjs','src/unified-directory.mjs','src/unified-views.mjs','src/progressive-directory.mjs','public/state.js','public/app.js','public/siem.js','public/siem-platform-model.js']); // Nov 12: additive event categories/local source; domain and fixtures remain frozen.
export function preservedBytes(base,file,options={}){
 let ref=base;
 if(file.startsWith('engine/')||file.startsWith('data/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(file)){
  try{execFileSync('git',['cat-file','-e','5470bca:'+file],{stdio:'ignore'});ref='5470bca';}catch{}
 }
 // Preserve the latest My AP navigation in the retired renderer too.
 if(['src/release-views.mjs','src/siem-view.mjs','public/siem-model.js'].includes(file))ref='332ba1b';
 const original=execFileSync('git',['show',ref+':'+file],options);
 if(file==='src/release-views.mjs'){const next=original.toString().replace("'/build','Choose your pathway modules'","'/recruiting','Explore recruiting'");return approvedPillarCopy(file,typeof original==='string'?next:Buffer.from(next));}
 return approvedPillarCopy(file,original);
}

// Explicit user-approved four-pillar clarification, AP release-candidate task Nov 12.
const pillarChanges={
  "docs/PRODUCT-NORTH-STAR.md": [
    [
      "3. Three commercial pillars",
      "3. Four independent commercial pillars\n\nProfile\n\nFamily and athlete sports profiles, relevant content, schedules, media and development. Profile is independent of Recruiting.\n\nRelease-candidate decision, November 12, 2026: Profile, SIEM, LockedIn and Recruiting are the four independent pillars. LockedIn is Coming Soon in AP; no verification or document service is implemented."
    ],
    [
      "A content-rich, parent-controlled athlete profile and progression platform.",
      "An optional, parent-controlled recruiting extension that reuses approved athlete information."
    ],
    [
      "Commercial rule: All three pillars must function independently or together. Customers can use none, one, two or all three, subject to eligibility and organization-sponsored access.",
      "Commercial rule: All four pillars must function independently or together. Customers choose the capabilities they need, subject to eligibility and organization-sponsored access. Switching optional modules off preserves underlying information."
    ]
  ],
  "src/siem-view.mjs": [
    [
      "Three pillars. Your permissions.",
      "Four pillars. Your permissions."
    ],
    [
      "SIEM monitors family activity. Recruiting owns athlete recruiting plans. Locked In owns verification and paperwork.",
      "Profile holds family and athlete sports information. SIEM manages family activity independently of a detailed profile. Recruiting is optional and parent-controlled. LockedIn is Coming Soon; verification and document services are not implemented."
    ]
  ],
  "src/release-views.mjs": [
    [
      "SIEM, Recruiting and Locked In remain the charter’s three independent product pillars.",
      "Profile, SIEM, LockedIn and Recruiting are the four independent product pillars. Profile includes family and athlete sports information; Recruiting is optional. LockedIn is Coming Soon."
    ],
    [
      "<h2>Four capabilities. Your choice.</h2><p><strong>SIEM:</strong>",
      "<h2>Four pillars. Your choice.</h2><p><strong>Profile:</strong> family and athlete sports information, schedules, media and development. <strong>SIEM:</strong>"
    ],
    [
      "<strong>Locked In / IDM:</strong> authorized identity, document and onboarding workflows.",
      "<strong>LockedIn:</strong> Coming Soon; identity and document services are not implemented in AP."
    ],
    [
      "<strong>Recruiting:</strong> content-rich, parent-controlled athlete identity, program research and relationship planning. <strong>Business Automation:</strong>",
      "<strong>Recruiting:</strong> optional, parent-controlled program research and relationship planning using existing athlete information.</p><p><strong>Business Automation service:</strong>"
    ],
    [
      "SIEM, Recruiting and Locked In can work independently or together.",
      "Profile, SIEM, LockedIn and Recruiting are independent choices. LockedIn being unavailable does not block the others."
    ]
  ]
};
export function approvedPillarCopy(file,original){
 if(!pillarChanges[file])return original; // Keep binary brand assets byte-for-byte.
 let next=original.toString();
 for(const [before,after] of pillarChanges[file])next=next.replaceAll(before,after);
 return typeof original==='string'?next:Buffer.from(next);
}
