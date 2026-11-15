# Shared recruiting configuration and data contract

Implementation entry points: `recruiting-sports.js` (sport adapter), `recruiting-fields.js` (SC-derived consent contract), `recruiting-profile.js` (strict projection), `coach-card.js` (one renderer), existing `recruiting-builder.js` and `college-research.js` (one journey). These are browser ES modules usable independently of AP's page shell; the field/projection modules have no DOM/storage/service dependency. No additional framework, athlete store or event database was added. The old inline athlete-page builder is retired; athlete Recruiting links open the same canonical `/recruiting` journey. Legacy research notes/checklists remain available without creating a second builder.

## Sport configuration

Each configuration supplies:

```js
{
  id, name, positions,                       // identity and sport role terminology
  competitionKinds, appearanceKinds,         // eligible records vs upcoming appearances
  recordLabel, competitionLabel,
  metrics,                                  // existing verified metric keys
  aggregation: 'sum' | 'records',             // sum supported game metrics; never sum race times
  measurementFields,                        // optional supported measurement labels
  measurements(profile, selectedRecords, events), // selected, comparable performance adapter
  resources: [{label, url}]                  // existing recruiting/rules resources
}
```

Lacrosse uses Goals/Assists/Ground balls/Saves; Basketball Points/Rebounds/Assists/Steals; Volleyball Kills/Assists/Aces/Blocks/Digs; Swimming Time/Place/Distance records with comparable discipline/course Personal Best and Target Time. These keys reference the existing athlete-records domain rather than replacing it. The shared UI has no `if sport === ...` presentation branch. Configuration selects the metrics, labels and measurement function.

`recruiting-directory.js` supplies the same sport-keyed program/coaching adapter for each configuration. Programs retain original team IDs and reviewed program assignments. Camps/showcases use existing source records; drafts and saved schools use existing athlete preferences. Missing data is not replaced by another sport's records.

Future sports require an explicitly authorized configuration, metric/data adapter and verified publication. The product's enabled-sport allowlist remains a separate activation policy. Soccer, rugby and rowing are **not** activated. The configuration-contract unit fixture proves another metric/measurement contract uses the same core without registering a public sport or rewriting builder/card components. This is not a claim of verified data coverage for future sports.

## Athlete / selections / projection

- Athlete identity: existing `arenaPathway.v2.profiles[].id`. Existing nickname/photo/club/team/position, school, graduation, introduction, academics, records, media and plans are read in place.
- Missing information edits update that same athlete. Optional additions: `collegeGoals`, `personalAchievements[]`, `playingLevel`, `gpa`, `gpaScale`, `gpaWeighted`. No second athlete record or independent recruiting event store. Saving a missing field does not rewrite untouched legacy values/types; a GPA scale must be supplied rather than invented.
- Existing `recruiting.recordIds`, `eventRefs`, `highlightIds`, `visibility`, draft/checklist/notes and parent flags are retained.
- New precise consent: `recruiting.approvedFields[]` uses SC canonical keys (`label`, `photo`, `highSchool`, `academics`, `profileIntroduction`, etc.). Explicit `[]` means nothing selected. New photo/school consent is independent of name consent.
- Legacy coarse visibility is adapted at read time only until a user edits selections. Photo is never implicitly selected. Previously explicitly chosen legacy development-goal text is preserved for legacy previews; new college goals use the distinct `collegeGoals` field and do not default to private development goals.
- Personal honors are referenced through `achievementSelections[]`; competition achievements come only from selected owned competition records. Unselected honors remain private.
- Projection first scopes selected records/media/appearances and then applies SC's allowlisted output filter. No arbitrary profile property, private note, practice statistic, birth information, unrelated module data or unselected media blob reaches the card renderer.
- Swimming PB uses selected comparable race records; targets are restricted to those same disciplines/courses. Race times are never summed. Missing statistics are not zero; partial totals carry recorded counts.
- Parent/guardian, current age16+ review and applicable sport/rules acknowledgment remain AP's existing gates. They are browser-local assertions, not verified identities or permission to contact coaches.
- Approval/revocation persist locally. A compact `approvedRevision` detects subsequent changes to selected preview content without persisting a duplicate athlete/photo snapshot. This non-cryptographic change marker is **not authentication or a secure signature**. Legacy approvals lacking a marker remain compatible until explicit revision/renewal; no secure external approval is claimed.
- The same strict projection feeds the single owner-preview card renderer for all four sports. External delivery/tokens/authenticated coach access/media proxies are deliberately unavailable.

## Coaching publication contract

Optional reviewed `catalog.recruitingCoaches[]` records must identify `id`, exact `sport`, existing `programId`, verified name/role, `verificationStatus: 'verified'`, `officialStaffPage: true`, HTTPS `staffPageUrl`, and non-future `checkedDate` within90 days. Email additionally requires `emailIsPersonal: false` and a valid published address. Wrong-sport, unverified, stale/future and personal-email records are withheld; programs remain visible when coach arrays are empty, following SC's LEFT JOIN behavior.

Current AP publication contains **zero verified coaching contacts**. The adapter's synthetic unit fixtures test this contract only; they are not added to the catalog or shown as real staff. Official program links remain available and coverage is explicitly partial. SC's soccer contact JSON is not copied into AP.

## Scope of sharing between products

The field filter is a direct JavaScript port of SC's `coach-sharing.ts`; canonical keys/groups, selection-first projection, builder fields and conditional coach-card hierarchy are ported/adapted from its actual components. React/SC database handlers cannot be mounted directly in AP without a framework/service migration, which is outside scope. SC remains unchanged and is not currently importing AP's modules. This delivers one reusable AP recruiting core derived from SC, not a claim of an already-deployed cross-product backend or package rollout.

Legacy snapshot helper exports remain only for backwards-compatible API/tests; active builder/card paths use the new single strict projection and renderer. No second recruiting workflow calls the old summary projection.
