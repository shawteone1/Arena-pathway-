# Arena Pathway — Product Conformance Recovery

Baseline: `638b53fb182e42bb90563e80f789781e5c0c8591`. Stable branch `codex/ap-qa-20261112` is unchanged. Work is isolated on `codex/ap-conformance-recovery-20261114`. The local delivery commit is identified in the final response. No merge, push, deployment, publication or Soccer Center modification.

## Reference and diagnosis

[Component-level conformance matrix and Stage 1 exit gate](CONFORMANCE-MATRIX.md). Soccer Center source HEAD is the November 11 imported commit `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`. Its actual public homepage and anonymous parent demo were rendered and exercised, including U16 recruiting, the actual builder/coach-card preview, schedule, Stats and Media. No SC Create link or request submission was invoked. Screenshots in `before/sc-*` are actual live rendered demo/public pages, not the earlier reconstructed SC fixture. Production `/parent-portal` redirects to sign-in: protected production editing was reviewed in source and the user's supplied historical screenshots, not claimed tested live. Read-only reference copies stay outside AP; external non-GET requests were blocked during SC exploration. No SC repository file was changed.

The failure was structural: four pillars were not visible together, the guided creation UI mostly exposed selects, a generic scheduling form imposed irrelevant end/recurrence fields, Stats reused all event types, and recruiting's old preview selected all records/events by default. A separate legacy publisher-link module competed with the approved article renderer. The earlier test suite froze header text and measured isolated components but did not walk the revised recruiting journey or fault-inject asset delivery.

## Implemented corrections by stage

1. **Reference established first.** Matrix, current source and live public/demo interactions recorded before product changes. Authenticated limitations are explicit.
2. **Unified navigation.** Profile, SIEM, Recruiting and LockedIn are first-level links everywhere. Sports remains secondary. The old Explore menu is removed; its informational destinations remain in the footer. DGC section philosophy and AP stadium/letterman identity remain. Shared styles now load across pages, with one responsive header; iPhone navigation uses a dedicated four-pillar row.
3. **Athlete workflow.** Existing six-step wizard now offers sport, participation and schedule choice cards; reviewed club/team/season suggestions remain searchable and manual entries remain available. Goals becomes an optional development goal plus sport-specific interests. No new mandatory data. Editing stays on the existing basic form. Recurring practice retains multiple weekdays, locations, bounded expansion and stable IDs. One-time games/meets default to one event, hide recurrence-only fields and hide an end date unless multiple days is explicitly chosen. A missing one-time end time gets a disclosed 60-minute block, validated by the existing normalizer. Weekly timed practices still require a valid end. Stats choices and totals use competitions only, excluding practices and parent event containers. Historical records are retained. Nested races/matches, Personal Best/Target Time, gallery-first media and event linking are preserved.
4. **Recruiting journey.** Choose schools → Build athlete information → Build and preview. Reuses existing college filters/saves, athlete ID, profile, event and media stores. Optional school/graduation/academic/overview edits write to the same athlete, not a duplicate profile. Every field/event/result/highlight defaults off unless previously explicitly selected. Practices, container events and orphan/non-competition results are excluded from the coach projection without deleting them. Selected competitions, recorded achievements and chosen media feed a structured local player card. The private college shortlist stays outside that coach card. Approval is checked before recording approval; review edits revoke it. Age16/parent/current sport-rules checks remain. Revocation is local; no secure coach token, public exposure or invitation is implied. The older research checklist remains behind a disclosure and keeps its saved notes. Switching the optional module off removes its profile panel and preserves data; direct recruiting access remains independent.
5. **Feeds.** One visible approved My Feed renderer replaces the competing publisher-link section. News and Development remain distinct from uploaded Media. Public and athlete editorial cards use matched AP typography/fallback treatments without unrelated photography. Source preferences, filter chips, metadata, retry and empty/error states remain. AP has JSON review snapshots; it does not have SC's authenticated live feed service, so retry reloads a snapshot and never claims live RSS refresh. All 40 candidates and approval records remain byte-preserved.
6. **SIEM/LockedIn.** SIEM engine, fictional Rivera fixtures, colors, tour, messages, actions and calendar projections are byte-preserved. Actual athlete commitments remain projected by stable references into the own-family calendar; no duplicate store or Rivera mixing. LockedIn remains the external Soccer Center demo: https://soccercenter.org/locked-in/index.html. No verification, payment or document service was rebuilt.
7. **Acceptance and preservation.** Added fault-injected stylesheet, image and module recovery, repeated navigation, four-sport guided creation, competition eligibility, nested race/match results, staged recruiting/privacy/card/approval/revocation and own-family continuity tests. All prior cases remain. Legacy selectors were adapted for the revised user flow; original domain/data/brand byte guards remain.

## Asset failure investigation

Fresh and repeat sessions locally returned correct CSS/JavaScript/image/font MIME types with no AP page errors. No spontaneous original Codespaces failure was reproduced. There is no service worker. Blocking core CSS reproduced an unstyled page with no recovery control; that is a confirmed defect, distinct from the unverified original network trigger.

The server now sets explicit revalidation headers. CSS/root application assets carry a revision derived from shipped code/styles. An independent recovery script detects missing/empty stylesheet rules, broken images and failed application modules. Its small inline recovery shell has an explicit CSP hash (no unsafe-inline relaxation). Retry restores CSS/images or reloads a failed module graph; stored information is untouched. Unknown asset routes still return404 with nosniff and real MIME types. Physical Codespaces/iPad network behavior remains an acceptance gate, not a fabricated root-cause finding.

## Validation

**Final results: npm run check PASS; npm test 240 passed / 0 failed / 0 skipped; Chromium 151 passed / 0 failed across 14 suites; WebKit 76 passed / 0 failed across 10 suites.** Chromium 156.0.8078.79 and WPE WebKit 26.5 were used. [Exact results](RESULTS.json), [Chromium suite manifest](logs/chromium-runs.json) and [WebKit suite manifest](logs/webkit-runs.json) retain actual counts and exit codes. All 235 previous automated cases remain, plus five new model/delivery cases. No test case was deleted.

Diagnostic failures were corrected before final reporting: stylesheet.sheet existed with zero rules after failure in Chromium; the iPad/phone header displaced established content thresholds; legacy tests expected the removed Explore menu, old unversioned asset URL, obsolete recruiting heading or hidden approve controls. The optional recruiting profile panel was restored to module-off absence while preserving independent access on /recruiting. Existing SIEM first-screen measurements and profile thresholds were retained rather than relaxed. Initial test/capture errors are retained separately where relevant.

## Content and source status

19 approved / 21 inactive candidates, across four separate sports. 21 reviewed items (14 news / 7 written guides). All 21 original article/resource URLs returned HTTP200 in this pass; see [read-only link check](CONTENT-LINK-CHECK.json). Reachability is not new content, youth-suitability, image-rights or video approval. No candidate was activated, no article/date/achievement was invented, and no publisher photo or instructional video was newly approved. Existing videos/candidate channels remain inactive until separately approved.

## Demonstration-readiness gates

| Gate | Verdict / limit |
| --- | --- |
| Reference source and actual public/demo render verified | PASS; protected production SC editing remains source-verified only. |
| Four-pillar access, public discovery and optional recruiting | PASS locally in Chromium/WebKit; no pillar activation dependency added. |
| Guided creation → recurrence → competition → Stats/Media → own-family calendar | PASS locally in Chromium/WebKit, using synthetic local fixtures. |
| Three-stage recruiting and selection-only coach card | PASS locally in Chromium/WebKit; local preview/approval/revocation only. |
| Source approvals, stable records/models/IDs | PASS: original data, brand and domain/identity byte guards; no destructive migration. |
| Original intermittent Codespaces unstyled load | Original trigger NOT REPRODUCED; fault-injected local recovery verified. |
| Physical iPad user acceptance and equal product-family quality | PENDING user review of the actual candidate; green automation is not visual acceptance. |
| Production authentication, verified guardianship, cross-device storage, secure coach links/live providers | NOT IMPLEMENTED; production pilot gates remain. |
| AP live RSS ingestion, licensed publisher imagery and instructional videos | NOT IMPLEMENTED/NOT APPROVED; reviewed snapshots and deliberate fallbacks only. |

This is a candidate for renewed hands-on demonstration testing, not a declaration that user acceptance or production readiness has been achieved. Re-test the specific iPad/Codespaces navigation and initial-load behavior, complete the chosen-school/player-card journey and compare the actual workflow with Soccer Center before accepting this recovery.

## Before/after and Soccer Center comparison

[Actual rendered comparison index](COMPARISON.html) places SC public/demo screenshots next to AP baseline and candidate captures. Open it from this QA folder to retain its relative image paths. [Reference source inventory](REFERENCE-SOURCES.json) identifies the inspected files/blobs. Matched AP captures use the same explicit synthetic family and athlete records; fixture achievements, schools, seasons and results are not product data or claims.

| Experience | AP baseline | AP candidate |
| --- | --- | --- |
| Homepage | [Before](screenshots/chromium-before-home-ipad.png) | [After](screenshots/chromium-after-home-ipad.png) |
| Lacrosse destination | [Before](screenshots/chromium-before-lacrosse-ipad.png) | [After](screenshots/chromium-after-lacrosse-ipad.png) |
| Public editorial cards | [Before](screenshots/chromium-before-lacrosse-editorial.png) | [After](screenshots/chromium-after-lacrosse-editorial.png) |
| Guided onboarding | [Before](screenshots/chromium-before-onboarding-ipad.png) | [After](screenshots/chromium-after-onboarding-ipad.png) |
| Parent workspace | [Before](screenshots/chromium-before-parent-ipad.png) | [After](screenshots/chromium-after-parent-ipad.png) |
| Athlete profile | [Before](screenshots/chromium-before-athlete-ipad.png) | [After](screenshots/chromium-after-athlete-ipad.png) |
| Schedule | [Before](screenshots/chromium-before-schedule-content.png) | [After](screenshots/chromium-after-schedule-content.png) |
| Statistics | [Before](screenshots/chromium-before-stats-content.png) | [After](screenshots/chromium-after-stats-content.png) |
| Athlete Media | [Before](screenshots/chromium-before-media-content.png) | [After](screenshots/chromium-after-media-content.png) |
| My Feed | [Before](screenshots/chromium-before-feed-content.png) | [After](screenshots/chromium-after-feed-content.png) |
| Development | [Before](screenshots/chromium-before-development-content.png) | [After](screenshots/chromium-after-development-content.png) |
| Recruiting directory | [Before](screenshots/chromium-before-recruiting-schools-ipad.png) | [After](screenshots/chromium-after-recruiting-schools-ipad.png) |
| Recruiting builder | [Before](screenshots/chromium-before-recruiting-builder-ipad.png) | [After](screenshots/chromium-after-recruiting-builder-ipad.png) |
| Local player card | [Before](screenshots/chromium-before-recruiting-card.png) | [After](screenshots/chromium-after-recruiting-card.png) |
| SIEM, domain retained | [Before](screenshots/chromium-before-siem-ipad.png) | [After](screenshots/chromium-after-siem-ipad.png) |
| LockedIn, external demo retained | [Before](screenshots/chromium-before-lockedin-ipad.png) | [After](screenshots/chromium-after-lockedin-ipad.png) |
| Asset failure / retry | [Original unstyled failure](before/ap-css-failure.png) | [Recovery notice](screenshots/chromium-after-asset-recovery-ipad.png) / [Restored](screenshots/chromium-after-asset-restored-ipad.png) |

The same matched captures exist with the `webkit-` prefix. Homepage/Feed desktop1440×900, iPad810×1080 and iPhone390×844 captures are retained. Browser suites also exercise iPad768/landscape layouts, calendar controls, real synthetic video playback and gallery edits/deletes; those runtime screenshots are in the development environment's `var/` QA directories. The complete committed screenshot dimensions/size inventory is linked below. No old source-rendered fixture is used as the definitive comparison.

Actual SC differences remain explicit: AP uses multi-sport fields and AP collegiate typography/palette; its browser-local family/guardian assertions are not SC authentication; its directory coverage is Colorado and partial; its news is reviewed snapshots instead of SC's server ingestion; its recruiting card has local approval rather than a secure production coach link. These are not represented as functional parity where infrastructure/content is absent.

[Complete changed-file list](CHANGED-FILES.txt) and [screenshot inventory](SCREENSHOT-INVENTORY.json).

### Final suite counts

| Suite | Chromium | WebKit |
| --- | ---: | ---: |
| Recovery acceptance and fault injection | 10 | 10 |
| Discover/Grow/Connect preservation | 6 | 6 |
| Shared UX / LockedIn transition | 6 | 6 |
| November13 recurrence/races/matches/builder | 7 | 7 |
| Consolidated full journey | 8 | 8 |
| Athlete/media/source acceptance | 12 | 12 |
| Release candidate independence | 2 | 2 |
| Profile/parent identity | 8 | 8 |
| Conformance/navigation/calendar | 12 | 12 |
| SIEM family | 18 | — |
| Release/legacy preservation | 20 | — |
| SIEM platform | 7 | — |
| SIEM first-screen refinement | 12 | — |
| Acquisition/unchanged directory behavior | 23 | — |
| Dedicated SIEM WebKit | — | 5 |
| **Final total** | **151** | **76** |

The WebKit suites cover the full athlete/recruiting/media journey and dedicated SIEM checks; this does not imply every Chromium-only suite was run in WebKit. All final runs passed. Diagnostic logs retain earlier failures rather than concealing them. No original case was deleted. Presentation snapshot assertions were scoped to preserved main content/shared security contracts where the task explicitly changed the header, cache contract or recruiting presentation.

### Integrated runtime evidence

[Chromium uploaded photo/video gallery](screenshots/chromium-after-uploaded-media-ipad.png), [WebKit gallery](screenshots/webkit-after-uploaded-media-ipad.png), [Chromium linked family calendar](screenshots/chromium-after-linked-family-calendar-ipad.png), [WebKit linked family calendar](screenshots/webkit-after-linked-family-calendar-ipad.png), [Chromium approved local card](screenshots/chromium-after-approved-local-card-ipad.png) and [WebKit approved local card](screenshots/webkit-after-approved-local-card-ipad.png) come from the integrated regression suites, using synthetic uploads and fictional local records. They supplement the identically seeded before/after captures rather than pretending to be matched fixture pairs. Real synthetic MP4 ready/playback status is retained in [Chromium playback evidence](chromium-media-playback.json) and [WebKit playback evidence](webkit-media-playback.json).

LockedIn was also rendered again in a fresh anonymous Chromium context on November14: HTTP200 at the exact established URL, titled “Locked In — Parent to club guided demo,” showing fictional-record/no-live-service disclosure. [Entry/access evidence](SC-LOCKEDIN-ACCESS.json). No demo submission, verification, document or payment handoff was exercised or activated.
