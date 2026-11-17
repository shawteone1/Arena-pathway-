# November 17 athlete profile and recruiting qualification

**READY FOR USER ACCEPTANCE** — scoped to a fictional, browser-local demonstration. Functional PASS and visual/product PASS against the reconstruction blueprint. This is a recommendation to review the new product experience, not founder acceptance, physical iPad certification or production authorization.

## What changed

The rejected primary profile/recruiting UI was replaced, rather than restyled. My Athletes now opens a visual, multisport card gallery. An athlete opens into a branded identity page with a continuous story, independently editable About/Background/Education/Achievements, featured media and a performance/calendar rail. Saving a focused edit returns to the same athlete and survives reload.

Recruiting now starts with identity and a next action, then follows **information → visual composition → finished preview → saved management**. Rich section cards and explicit individual selections replace the primary permission checklist. The finished portfolio contains the selected story, education, real stored competition metrics, achievements, playable selected highlights and appearances. Save creates a durable selection composition on the existing athlete; leaving for SIEM or colleges and returning reopens it. Edit/rebuild and local approval/revocation were exercised across four sports. No separate athlete or event store was introduced.

Supporting changes are limited to the requested homepage pillar hierarchy/My Athletes entry, simpler directory, optional end times, SIEM fictional message presentation and any/all/none athlete calendar selection. SIEM models/fixtures and the accepted LockedIn implementation are preserved.

## Evidence and acceptance gates

- [Blueprint and rationale](BLUEPRINT.md), including original desktop/iPad/phone [prototype](blueprint/PROTOTYPE.html), produced before new UI implementation.
- [Actual before/after comparison](COMPARISON.html), [comparison overview](COMPARISON-OVERVIEW.png), [complete athlete profile](after/chromium-complete-athlete-profile-ipad-portrait.png), [family cards](after/chromium-family-gallery-ipad-portrait.png).
- [Recruiting workspace](after/chromium-recruiting-dashboard-ipad-portrait.png), [information](after/chromium-recruiting-information-ipad-portrait.png), [composition](after/chromium-recruiting-builder-ipad-portrait.png), [finished profile](after/webkit-lacrosse-finished-portfolio-ipad-portrait.png), [saved/reopened result](after/chromium-saved-reopened-portfolio-ipad-portrait.png).
- [Complete journeys](JOURNEYS.md), [functional/visual matrix](ACCEPTANCE.md), [data reuse and deletion assessment](DATA-COMPATIBILITY.md), [engineering results and prior failures](TESTING.md).

All P0 reconstruction gates pass in the selected final runs: meaningful family cards; completed editable athlete story; information-first recruiting; selected-only finished saved/reopenable profile; one engine across four sports; recurrence/family continuity; no removed-athlete resurrection through supported writes; independent pillars; unchanged LockedIn handoff; no new source activations. No known unresolved critical product defect was reproduced in those completed journeys.

The final result has been inspected as rendered pages, not judged solely from source or test count. Identity/story and selected film/results are the main content, editing is secondary, and rules/privacy live in final review. Empty sections are omitted; limited-data profiles use honest prompts and intentional initials. Visual PASS is an engineering assessment against the blueprint; the founder must still judge whether it meets the desired premium standard.

## Tests

- `npm run check`: **310 passed, 0 failed, 0 skipped**, including syntax checks and the entire Node suite.
- `npm test`: **310 passed, 0 failed, 0 skipped** (same suite, not620 unique tests).
- Chromium: **35 final browser cases passed, 0 failed, 0 skipped**.
- WebKit: **22 final browser cases passed, 0 failed, 0 skipped**.
- The recruiting case in each engine includes four complete sport journeys, including selected-video playback, saved/reopened/rebuilt composition and approval/revocation. Capture variants are not counted as extra cases.
- Desktop1440×900, iPad portrait810×1080, iPad landscape1024×768, phone390×844, plus explicit iPad touch interaction and keyboard/reduced-motion checks.

Earlier failures are retained, not concealed. Real defects corrected included missing new asset registration, stale async recruiting controls, final-review state loss and a phone header regression affecting SIEM's first-screen action. Harness corrections and WebKit load/control timeouts are documented with logs in [TESTING.md](TESTING.md) and [RUNS.json](RUNS.json). The final tests wait for actual completed UI/state, not blanket network-idle. No automatic retry loop or weakened finished-result assertion was added.

Historical checkbox/profile browser specifications are retained but superseded for the deliberately reconstructed primary UI; they are not falsely counted as rerun passes. All baseline automated cases remain. Existing accepted SIEM/RSS/editorial browser suites were run separately.

## Preservation and source reference

[198 protected files](PROTECTED-FILES.json) remain byte-identical to the qualified baseline, including all existing `data/`, `engine/`, recurrence, media library, statistics domain, SIEM models/fixtures, LockedIn and governing documents. State/projection changes specifically needed for removal and multi-selection are individually hash-pinned and disclosed. Existing athlete/event/media/school IDs and approved sources are reused; there is no destructive migration.

Soccer Center's actual imported source HEAD remains **11de067414e63c5d3e3e221dfc14cc026dfbd8d0**, verified by a read-only GitHub request ([evidence](SC-REFERENCE-HEAD.json)). Its functional contracts informed compatibility. The new AP UI is original; it is not falsely described as shared React source or authenticated third-party production parity. Public LinkedIn/NCSA/SportsRecruits/Hudl reference material and retrieval limits are recorded in [REFERENCES.json](REFERENCES.json).

LockedIn exact approved URL returned HTTP200 with no redirect or athlete parameters ([access check](LOCKEDIN-ACCESS.json)). **Soccer Center was not modified.**

## Remaining boundaries / user acceptance decisions

No production authentication, verified guardian identity, cross-device persistence, secure external coach sharing, live Slack/provider/calendar subscription, document/payment transfer or permanent-erasure service is claimed. Removal is explicitly recoverable local archiving. Verified coaching contacts remain zero;43 reviewed programs provide official research links. Content remains19 approved/21 inactive candidates;11 retained RSS endpoints/0 enabled and0 approved publisher article images. Regional/coordinate coverage remains partial. None was broadened to manufacture completeness.

WebKit navigation/load timing failures are retained in the run history; final readiness uses explicit DOM/UI and state conditions while still testing actual reload, playback and return. Physical iPad testing and authenticated production access were not available, and this report does not certify either.

The next review should judge the family gallery, full identity page, guided builder and reopened finished portfolio directly. Production release remains blocked by the separate infrastructure/consent/security requirements above. No deployment or public publication is authorized by this qualification.

## Source control / handoff

Baseline verified clean at `a86edc7c2da735a8a50978ac72e917ac9b7f960d` on `codex/ap-final-qualification-20261116`; preserved as rollback point. Isolated development branch: **codex/ap-profile-reconstruction-20261117**. [Complete changed-file list](CHANGED-FILES.txt) and [evidence index](ARTIFACTS.json).

The exact containing commit SHA is supplied in the final handoff; retrieve it locally with `git log -1 --format=%H -- docs/profile-reconstruction-20261117/REPORT.md`. This report is committed with the validated implementation/evidence; it cannot contain its own Git hash.

**Local commit only. No push, merge, force-push, deployment, publication or Soccer Center changes.** GitHub will display PNGs directly after a separately authorized push; HTML comparisons/prototypes must be downloaded or served locally because normal GitHub file views show HTML source rather than running it.
