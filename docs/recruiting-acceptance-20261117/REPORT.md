# November17 recruiting acceptance failure — correction report

**Corrections implemented and internally qualified. Founder visual acceptance remains pending.**

The founder's physical-iPad rejection supersedes the previous candidate's READY recommendation. This report does not claim founder acceptance, authenticated Soccer Center production parity, enterprise readiness or physical-device certification.

Baseline: `bbdd9fcef548560842238344719d514ad8ba1a65` on `codex/ap-product-completion-20261117`, exact clean checkpoint verified. Work is isolated on **`codex/ap-recruiting-acceptance-20261117`**. The final commit SHA is provided in the handoff; resolve the containing report commit with `git log -1 --format=%H -- docs/recruiting-acceptance-20261117/REPORT.md`.

## Root cause of the rejected experience

The baseline's normal successful browser entry was a text-first workspace with four progress destinations, an athlete teaser, information panels and a long composition page. Its full portfolio was a separate destination behind a Build action; the live glimpse was constrained. Its athlete cards lacked the requested gold collectible identity. Passing persistence assertions did not establish the requested visible experience.

The source also retained redundant presentation/failure paths. `src/views.mjs` supplied a checklist template; `public/app.js` could construct the legacy recruiting module and optional planner container. The new mount waited for unrelated profile/media/publisher enhancement and statically depended on those modules. A failure in that chain could prevent the primary experience from mounting.

Not every suspected component was active: `public/recruiting-builder.js` was served but unimported in the normal baseline graph. [Actual baseline DOM/text readback](before/REACHABILITY.json) shows no old expandable builder in that successful session. We did not reproduce or diagnose the founder's exact physical-iPad cache/branch state and do not claim that the visible physical screen necessarily came from that file.

## Implemented corrections

- **One active route and render tree.** Dedicated `/recruiting` server shell and direct mount; no checklist template, legacy module constructor, optional recruiting container or generic old research introduction. Unreachable legacy branches were removed too. The historical builder export is navigation-only, and existing profile hashes resolve to the same current athlete/route.
- **One shared gold athlete identity.** Original metallic/gold AP card, intentional initials or owned photo, actual supplied jersey/lane label, sport/role/team/class, strong typography and the same existing athlete color cue. Used in the parent gallery, full profile and selected coach portfolio, without requiring recruiting activation. No ratings, fake logos or commercial card artwork.
- **Three clear destinations.** Explore Colleges → Prepare Recruiting Profile → Preview & Save. Existing reviewed sport-specific research, focused athlete editing and saved school IDs remain. Current source information is prefilled; tests verify it instead of requiring re-entry.
- **Actual portfolio visible during preparation.** Full selected story, school/academics, achievements, competition results, owned media and appearances render directly. One responsive native content panel edits the same composition without portfolio-height changes pushing controls. There is no separate hidden builder/preview application.
- **Finished result and management.** Explicit Save, direct saved/reopened entry, Edit Profile, Rebuild Portfolio, visible local parent-review status/actions and retained rules/revision gates. Selected video plays; unselected private items remain absent. External sharing remains disabled.

The existing sport-agnostic projection, composition, ownership, age/parent/rules controls and adapters are retained. Optional `jersey` reuses an existing athlete field through the allowlist; older saved compositions do not silently acquire that field. No second identity/event/media store, destructive migration or new live integration was introduced.

## Evidence, source comparison and product gates

- [Actual before/after comparisons](COMPARISON.html), [directly reviewable overview PNG](COMPARISON-OVERVIEW.png).
- [Actual Soccer Center render/source comparison](SC-COMPARISON.html), [source-to-target plan](PLAN.md), [architecture and data compatibility](ARCHITECTURE.md).
- [Functional and visual/product matrix](ACCEPTANCE.md), [complete13-step/four-sport and family journeys](JOURNEYS.md).
- [Exact engineering results and prior failures](TESTING.md), [selected results JSON](FINAL-RESULTS.json), [complete changed-file list](CHANGED-FILES.txt).

The final internal observable gates pass: premium identity immediately visible; genuine editable profile; only one recruiting root; no legacy checklist/preview containers; three primary destinations; full inline portfolio; explicit selected-only content; saved/reopened/rebuilt outcome; readable desktop/iPad/phone layouts. Founder judgement of premium quality remains open and is not replaced by these internal results.

Soccer Center source HEAD11de067414e63c5d3e3e221dfc14cc026dfbd8d0 matches the inspected components and remote readback. Canonical field/filter/projection behavior, research hierarchy, information prefill, conditional card sections and parent control semantics are reused/adapted from `RecruitingTab`, `CoachShareTab`, `CoachProfileCard`, `CoachProfilePreview` and `ProfileBuilder`. The gold identity is the original AP design explicitly requested. These different-stack front ends are not falsely described as directly sharing live React components. Public SC demo screenshots are actual renders; protected production editing remains source-verified without an authorized session.

HTML comparisons need a local browser preview; GitHub shows their source. PNGs are directly reviewable. From the repository root use `python3 -m http.server 3120`, then `/docs/recruiting-acceptance-20261117/COMPARISON.html`. This is a local development preview, not publication.

## Test results and preservation

- `npm run check`: **320 passed,0 failed,0 skipped**.
- `npm test`: **320 passed,0 failed,0 skipped**; same suite rerun, not640 unique tests.
- Chromium: **49 selected browser cases passed,0 failed,0 skipped**.
- WebKit: **36 selected browser cases passed,0 failed,0 skipped**.
- Actual desktop1440×900, iPad portrait810×1080, landscape1024×768 and phone390×844; separate touch, keyboard/focus/reduced-motion and asset-failure checks.
- **208 protected data/engine/SIEM/LockedIn/state/lifecycle/media/charter/adapter files byte-identical** to baseline. [Exact comparison](PRESERVATION.json). The accepted SIEM engine, events, directory provenance and LockedIn handoff were not rebuilt or modified.

Both engines complete the requested existing-athlete→profile edits→college research→selected composition→playable finished portfolio→save→other pillar→return/reload→edit/rebuild sequence across Lacrosse, Basketball, Volleyball and Swimming. The same-family25-step regression also passes. IDs, selected record/media/appearance references, saved timestamp, saved schools and local approval/revocation persistence are asserted. Screenshots are actual UI sessions using fictional records and clearly identified test media, not reconstructed mockups.

Earlier failed attempts, partial cloud-interrupted logs and manual reruns remain in the package. Tests were adapted to changed navigation/panel interaction and strengthened for absence of legacy paths and actual SIEM startup; none was removed or configured to ignore page errors. Selected totals count each case once.

## Remaining genuine limitations / warning

1. **Founder physical-iPad visual acceptance is pending.** Emulated viewports do not certify a physical device or subjective product acceptance.
2. **One prior WebKit module-import message is not conclusively root-caused.** That earlier run reached its four-sport saved results but failed teardown with `Importing a module script failed.` Later instrumented runs, including waiting for the actual SIEM startup state, pass without the message. The earlier failure remains visible in TESTING/logs; we do not declare a production incident resolved or suppress the error. This is a retained verification warning; no remaining reproducible P0 functional failure was found in the completed selected journeys.
3. **Production capabilities remain unavailable:** authenticated guardian authorization, cross-device/server persistence, secure external coach sharing/revocation and real provider/Slack/identity/payment handoffs. Local approval is not public sharing. Existing recoverable archive is not secure erasure.
4. **Verified coverage remains partial:**43 reviewed program rows and zero verified coaching-contact records; official links and specific unknowns remain honest. No coach, logo, result, geographic distance, source approval or licensed image was fabricated. Existing live-RSS/provider limitations are unchanged.
5. **Authenticated SC production comparison requires an authorized session.** Current public demos and actual source are the available evidence; no invented authenticated screens are presented.

## Delivery controls

All corrections and evidence are committed locally on the isolated branch. The baseline/validated branches remain rollback points. No push, merge, deployment, publication, source activation, real coach delivery or Soccer Center modification is authorized or performed. This report offers evidence of the corrected experience; it does not declare the prior rejected presentation accepted.
