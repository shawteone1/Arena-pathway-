# One recruiting experience — architecture and compatibility

The source remains the November17 candidate `bbdd9fcef548560842238344719d514ad8ba1a65`; all changes are isolated on `codex/ap-recruiting-acceptance-20261117`.

## Active paths

| Entry | Current destination / responsibility |
|---|---|
| Parent Portal athlete card | Existing `/my-pathway?athlete=<id>`; same stable athlete record, new shared gold identity renderer |
| Profile Recruiting tab / Build Recruiting Profile | `/recruiting?athlete=<id>`, independent of optional module flags |
| Global Recruiting | Same route, selected existing athlete or independent public college research |
| Legacy profile hashes `#recruiting`, `#recruiting-profile-builder`, `#coach-profile-preview` | Replace navigation to the same `/recruiting` route with the existing athlete ID |
| Historical `recruiting-builder.js` export | Compatibility navigation only; no form, checklist, preview renderer or storage writer |
| Explore Colleges | Existing reviewed college research component inside the same recruiting root; source-backed programs and saved IDs |
| Prepare Recruiting Profile | Existing focused profile editors, then the same strict-selected portfolio renderer and one content-choice panel |
| Preview & Save | Same portfolio renderer and original composition selections; save/reopen/edit/rebuild and local approval/revocation |

There is one `mountRecruitingExperience` call site in the application. Recruiting has a dedicated server shell and early application route branch. It no longer constructs the athlete schedule/media/feed tools before mounting. The application imports `profile-qa.js` only outside the recruiting route, so an unrelated profile/publisher dependency failure cannot replace recruiting with an old interface. A browser test blocks those dependency requests and still opens the identity and reviewed college research.

The old SSR `template-recruiting`, checklist writer/constructor and `optional-recruiting` container are removed. They are not hidden behind CSS or a new wrapper. Old module preferences, research checks/notes and selected data remain in storage. Legacy CSS selectors can remain harmless for old cached consumers; they cannot create an interface.

## Shared identity and selected-only portfolio

`athlete-identity.js` is an original DOM renderer, used by family cards, the full athlete profile and coach-facing portfolio. The profile adapter reads existing name/photo, sport, club/team, role/event, class/category and jersey/lane label. Gold/metallic treatment uses CSS, the approved AP mark and the existing typography. No commercial card artwork, fabricated player rating, fake club logo or new photograph is used. Existing athlete color hashing supplies the same blue/purple/green cue in each context.

The coach renderer receives the existing strict/owner-draft projection, never the whole athlete record. The optional existing `jersey` field has been added to the canonical allowlist and introduction section. Earlier saved field selections do not automatically acquire it. The athlete ID is passed as a presentation-only option for a consistent color cue; it is not added to the selected coach data or an external URL.

The full portfolio renders during preparation. One responsive native dialog contains the existing section/item controls; its position and scroll are independent from portfolio-height changes. It is a content editor for the same composition, not another recruiting application or preview. Each achievement, competition record, owned media item and appearance must be selected explicitly. Practices stay excluded by unchanged sport adapters. Media thumbnails and actual portfolio playback reference the original IndexedDB blob IDs, with object URLs disposed on navigation.

## Existing data contracts retained

- Athlete IDs, parent relationships, profile keys and module choices: existing `arenaPathway.v2`, unchanged state/lifecycle implementation.
- Schedules, recurrence/exception IDs and competition references: unchanged plan/meet/statistics engine.
- Owned photo/video library: unchanged existing IndexedDB library and original athlete/media references.
- Recruiting: unchanged selection-based composition store, source-revision comparison, strict parent/age/rules gates and local review semantics. No new athlete snapshot/database, migration or coach-sharing service.
- Saved college/program IDs and catalog/source relationships: unchanged reviewed directory and sport adapters.
- Family/SIEM: unchanged store, projection engine, actions, accepted demonstration and color source.
- LockedIn: exact accepted Soccer Center handoff unchanged, without athlete information in its URL.

[PRESERVATION.json](PRESERVATION.json) byte-compares208 protected data, engine, SIEM, LockedIn, lifecycle, media, charter and adapter files to the actual baseline; none changed. This is complemented by the same-family browser journey, archive isolation, nested races/matches, source restrictions and saved-recruiting assertions. It does not claim access to or migration of the founder's physical iPad storage.

## Soccer Center reuse boundary

Actual source HEAD `11de067414e63c5d3e3e221dfc14cc026dfbd8d0` was read back from the Soccer Center remote and matches the inspected source. AP retains the earlier canonical field/filter and strict coach projection port. `RecruitingTab.tsx` research hierarchy, `ProfileBuilder.tsx` independently saved athlete information, `CoachShareTab.tsx` selection/ownership/revocation behavior and `CoachProfileCard.tsx` conditional portfolio sections remain the functional foundation. The original AP identity/portfolio layout implements the founder's specific gold-card direction. React/authenticated backend components are not falsely described as shared live DOM code between different application stacks.

The current source/reference matrix is in [PLAN.md](PLAN.md). Actual public Soccer Center renders and their sign-in boundary are in `reference/`. No authenticated production-editor parity is claimed without an authorized session. No Soccer Center files or services were modified.
