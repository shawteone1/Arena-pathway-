# November 17 product blueprint — before implementation

Baseline a86edc7c2da735a8a50978ac72e917ac9b7f960d, clean; isolated codex/ap-profile-reconstruction-20261117. November16 physical acceptance supersedes the previous visual PASS. No SIEM/LockedIn reconstruction.

## Reference rationale and boundaries

LinkedIn's public profile guidance emphasizes photograph/identity, a story and experience/education. SportsRecruits' public student-athlete page emphasizes profile, film and college research. NCSA's recruiting guidance emphasizes assembling athletic/academic information and next steps; Hudl emphasizes video and performance. These are interaction principles, not layouts or artwork to copy. REFERENCES.json records actual retrieval; unavailable pages are not claimed inspected. Soccer Center's existing ProfileBuilder, CoachShareTab, card, schedule and media source remain functional/data references; its authenticated pages are not an exclusive visual template. Existing imported source commit11de067 is distinct from an unknown Airo deployment SHA.

## 1 Family gallery

“My Athletes” is the main entry, Add Athlete obvious. Three-column desktop, two-column iPad, one-column phone. Original AP athlete cards: sport-colored band, large photo/initials, typographic name, position/event, team, graduation/participation and season. No ratings. View Profile primary; Schedule and management menu secondary. Edit opens the same athlete editor. Delete requires named confirmation and local parent-management status.

## 2 Athlete profile

An editorial identity masthead: branded cover, large portrait, name/sport, club/position, school/class/location and local visibility. One story column with About Me, Education and Athletic Background; a supporting rail for upcoming appearances and recorded performance. Achievements as a narrative list. Featured Media a visual gallery. Development links below. Existing Profile/Schedule/Stats/Media/Recruiting tabs remain; My Feed/Development/Community/Network remain resources, not new commercial pillars. Empty prompts ask for meaningful content without presenting six blank administrative boxes.

## 3 Focused editors

Independent dialogs for Identity, About Me, Education, Athletic Background and Achievements. Athlete name/photo always visible. One focused field group, save confirmation, return focus and scroll. Write original athlete fields; revoke stale local approval. Media/schedule/stat editors keep their tested stores and references. No giant all-fields form on the profile.

## 4 Recruiting workspace

Athlete identity + useful completeness (“3 of5 story essentials”, never a quality/ranking score), next recommendation and owner preview. Saved programs/relevant reviewed opportunities alongside. College research remains independently accessible. Landing is not a permission checklist. Existing legacy notes/schools/compositions remain available through compatibility adapters, not a competing primary builder.

## 5 Guided journey

1 Complete athlete information: populated profile sections and focused editing; no privacy controls. Save information independently. Continue to Profile Builder.
2 Visual presentation: content-rich section cards for Introduction, Athletic Background, Education, Achievements, Performance, Highlights and Appearances. Include/exclude buttons with aria-pressed, actual summaries and immediate preview. Individual records/media/appearances selected through content tiles; no automatic all-events inclusion. Selections update in place, preserving focus/scroll.
3 Finished portfolio: full identity, selected content, playable media, meaningful sections only. Edit or Save Recruiting Profile. Final-review/help owns rules/parent review, not the landing hero.
4 Saved presentation: reopen directly, revise composition, review changed source information, approve/revoke locally. College navigation retains progress. No external coach link or transmission.

Age16/current parent review remains product policy. Owner-draft preview is explicitly separate from parent approval/external sharing. Existing strict approval projection/gate remains authoritative. Rules acknowledgment is reviewed in final help; it is not NCAA eligibility certification.

## 6 Finished portfolio

Original AP portfolio layout with cinematic branded header/portrait and athlete story, education, selected performance tiles, achievements, film and relevant appearances. No blank placeholder sections or made-up numbers. Common renderer for four sport adapters. Limited-data profiles remain useful through identity/story/school. Selected-only composition and source references, not a second athlete database.

## 7 Data relationships / compatibility

arenaPathway.v2 athlete ID → plans/records/saved schools/profile fields. Existing IndexedDB media keyed athleteId/eventRef. Profile editor writes these fields once. Recruiting draft continues legacy approvedFields/recordIds/highlightIds/eventRefs/achievementSelections. Saved recruiting composition snapshots only selection IDs/field keys + version/timestamp/revision, never athlete data or blobs. Existing compositions adapt read-only until explicit Save. SIEM projects current athlete events; no copied schedule. Changing optional modules preserves records.

## 8 Sport contract

Reuse recruiting-sports.js: identity, position/event labels, competition/appearance kinds, metric keys, aggregation (swim records, not summed times), measurements, colleges/coaches/opportunities. One profile/editor/builder/portfolio implementation. Only Lacrosse/Basketball/Volleyball/Swimming enabled. Future sports require configuration + verified data, not UI forks.

## 9 Safe deletion

Parent-managed local athlete only; dialog names athlete, describes effects and requires typing their name. Atomic localStorage save moves the whole athlete into an archivedProfiles array and adds a durable tombstone; no cross-store destructive transaction. Media retained in local archive, explicitly disclosed as not secure erase. Active profiles, SIEM legacy people/events, setup and recruiting projections filter tombstones. Merge existing tombstones on every supported persist so a stale current-version tab cannot resurrect deleted identity. Unrelated athletes, shared directory data and events are untouched. Failed storage leaves original state intact. Test reload, stale writer, other athletes/media and local SIEM projection. No claim of authenticated guardian authorization where none exists.

## Supporting scope

Homepage: existing hero/brand assets retained; “Simple to use. Powerful underneath.” + tagline, My Athletes header entry and four pillar cards before sport directory. Directory: search, one Location, Age, Program type; retain old URL filtering contracts and evidence on source details. No new records. Recurring/one-time end times optional using labeled estimated duration; recurrence model unchanged. SIEM: isolated fictional Slack-style panel plus calendar-only athlete-set selection (including none), preserving the accepted engine/category colors/actions and Rivera separation. LockedIn exact handoff unchanged.

## Gates

Phase B profile must pass gallery→profile→focused edit→reload→safe delete/isolation before Phase C integration. Then full four-sport recruiting save/reopen/edit/approval/revocation. Phase D targeted changes only. Actual before/after and desktop1440×900, iPad810×1080 and1024×768, phone390×844. Browser viewport tests are not physical-device certification. Old checkbox journey tests are historical evidence, not a reason to retain rejected UI; domain/contract tests must remain and replacement journeys must test stronger finished outcomes.
