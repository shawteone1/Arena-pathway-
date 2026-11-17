# Data reuse, compatibility and deletion assessment

Baseline: `a86edc7c2da735a8a50978ac72e917ac9b7f960d`. No destructive migration, external writes or new athlete/event database.

| Information / behavior | Authoritative existing contract | Presentation / compatibility treatment |
|---|---|---|
| Athlete identity and family ownership | `arenaPathway.v2.profiles[].id`, parent/guardian settings | Same IDs, same root store; focused editors write only changed fields. Local parent settings are not authenticated guardian proof. |
| Introduction, education, background, achievements | Existing athlete fields including `aboutSport`, `highSchool`, `graduationYear`, `academicDetails`, `personalAchievements` | One profile editor feeds general profile and recruiting; no copied identity object. Existing omitted/unknown fields preserved. |
| Competition statistics / swimming measurements | `records`, `competition-records.js`, `recruiting-sports.js`, `swimming-progress.js` | Existing sport adapters, eligibility and aggregate calculations; practices excluded from recruiting statistics. No invented results. |
| Calendar / recurring events | `plans`, stable series/occurrence IDs and exceptions, `recurring-plans.js` | Same canonical events projected into SIEM; optional end-time adapter supplies a disclosed estimated duration only on new saves. No historical timestamp migration. |
| Media | IndexedDB `arenaPathway.media.v1`, athleteId / eventRef / media ID | Same blobs and ownership; featured-gallery selections are separate from recruiting selections. Selected coach-card videos use original blobs and native playback. |
| Recruiting draft | `approvedFields`, `recordIds`, `highlightIds`, `eventRefs`, `achievementSelections` | Rich content cards adapt these existing arrays; not another composition database. Nothing auto-selects all media or competitions. |
| Saved recruiting presentation | Existing athlete's `recruiting.presentation` (version 1 selection contract) | Stores field/record/media/event IDs, source revision and timestamp only. Legacy built drafts adapt read-only; new format is written only on explicit Save. Resolves current athlete information; source changes invalidate prior approval. |
| Permission / review | `recruitingGate`, strict `buildCoachProjection`, source revision | Current local parent and age-16 review preserved. Owner-draft projection is private, never approved, and does not masquerade as sharing. Rules review remains required for strict local approval, in final review. |
| Schools / opportunities | Existing saved IDs and reviewed program records | College research usable without a profile/composition. No contacts copied from soccer. Private notes and outreach drafts retained; no live delivery. |
| Module choices and source preferences | Existing modules / subscriptions / source registries | Original optional preferences remain in collapsed secondary controls. Turning modules off preserves data. No publisher or instructional source activated. |
| SIEM | Existing models, Rivera fixtures, actions/messages and projections | Calendar-only selection filters authorized IDs; all/none/subsets do not duplicate events. Fictional chat presents existing Rivera Slack evidence and existing local draft action only. |
| LockedIn | Existing external-demo handoff | Exact URL, new tab, noopener/noreferrer; no athlete parameters. No AP recreation. |

## Reuse versus reconstruction

Actual Soccer Center source reference remains `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`, verified through a read-only GitHub request on November 17 ([HEAD](SC-REFERENCE-HEAD.json)). Source files previously blob-verified in [SC-SOURCE.json](../qa-20261116-final/SC-SOURCE.json) are actual imported source, not fabricated fixtures.

| Reference | Decision in this implementation |
|---|---|
| SC `ProfileBuilder`, `RecruitingTab`, `CoachShareTab`, `CoachProfileCard` / `CoachProfilePreview` | Preserve proven information, selected-only projection, permission and save/review concepts. Original AP profile/portfolio/guided UI reconstructs the rejected presentation. These are **adapted behaviors, not shared React components or an authenticated production parity claim**. |
| SC program / coach directories | Retain reviewed AP sport-specific directory adapter; never relabel soccer coaches. |
| AP `recruiting-sports.js`, competition eligibility, projection/gates, portrait decoding | Reuse existing implementations; split private owner draft from strict approval without weakening strict gate. |
| AP `recruiting-builder.js` and old checklist primary journey | Retired from primary rendering; file retained for compatibility/history. Existing draft arrays, notes, school IDs and approval contracts adapted. |
| AP media library, recurrence, statistics, SIEM domain and fixtures | Preserved. The new UI calls existing domain functions rather than reimplementing them. |

The shared sport contract remains identity, role/event terminology, competition/appearance kinds, metric definitions/aggregation, measurements and verified program/opportunity data. One gallery/profile/editor/builder/portfolio serves four configured sports. No Rugby/Rowing activation.

## Safe local removal

“Remove athlete” is a durable **local archive**, explicitly disclosed in the confirmation. The complete athlete record moves atomically into `archivedProfiles`; `deletedAthletes` tombstones exclude the identity from active profile/recruiting/calendar/setup projections. IndexedDB media remains recoverable, not erased. No partial cross-store deletion transaction is attempted.

Confirmation requires the exact named athlete and existing local parent/guardian setting. Storage failure keeps the prior state. Every supported current-version persist merges existing tombstones; a stale supported writer cannot resurrect a removed identity. Legacy SIEM participants with that ID are excluded, not silently reassigned. Other athlete IDs, blobs, shared organizations and directory records remain untouched.

Browser tests upload two athletes' media, choose featured media, remove one athlete, inspect retained blob sizes/owners and archived selection references, reload, then exercise a stale supported writer. Pure tests additionally cover wrong guardian/name, no input mutation, storage failure and legacy projection exclusion. [Chromium proof](chromium-media-removal-proof.json), [WebKit proof](webkit-media-removal-proof.json).

Limits: no authenticated guardian/tenant boundary exists in this browser-local demo. This is not secure erasure, cross-device deletion, a retention-policy implementation or a promise against arbitrary manual storage replacement / old pre-tombstone application builds. Permanent destruction and archive recovery UI are not claimed. Protect browser access and use fictional demonstration records.

## Preservation proof

[PROTECTED-FILES.json](PROTECTED-FILES.json) records exact baseline/current blob comparison for all existing `data/` and `engine/` files plus recurrence, media, statistics, SIEM models/fixtures and LockedIn. State persistence and local projection files necessarily changed for explicitly requested safe removal; these changes are individually hash-pinned in `test/fixtures/nov17-approved-source.json`, not falsely reported byte-identical.
