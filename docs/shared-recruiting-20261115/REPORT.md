# Shared multisport recruiting — acceptance report

Baseline: `1ea380462c1811a9ba3b2bbc7a6a5e1729b8bab8`. Isolated checkpoint: `codex/shared-recruiting-20261115`. Final delivery commit is supplied in the handoff; [changed files](CHANGED-FILES.txt), [source-to-target reuse matrix](REUSE-MATRIX.md), [configuration contract](SPORT-CONTRACT.md), and [exact validation results](RESULTS.json) accompany it.

**Final validation:** `npm run check` PASS; `npm test` **263 passed /0 failed /0 skipped**. Chromium **166 passed /0 failed** across17 suites; WebKit **91 passed /0 failed** across13 suites. The shared suite includes seven cases and four full sport subjourneys per engine. Full broad regression and affected final-candidate reruns are distinguished in RESULTS.json; earlier diagnostics are retained. No original case was removed.

## What was reused and changed

The inspected SC source is its latest imported commit **`11de067414e63c5d3e3e221dfc14cc026dfbd8d0`**, rechecked through GitHub. [Eleven source blob hashes match](REFERENCE.json), including RecruitingTab, CoachShareTab, CoachProfileCard/Preview, ProfileBuilder, the field/projection services and coach-sharing helpers. Actual current SC public/demo recruiting and coach-card pages were rendered again. Protected parent routes redirect to authentication; they were inspected at source level, not exercised as an authenticated user. No SC files, services or records were modified.

This is a behavior/contract port, not a replacement application or a React migration:

- **Direct JS port:** SC's allowlisted `FIELD_OUTPUTS` / `filterCoachProfile` behavior and canonical consent keys. Unknown/private fields cannot enter the projection.
- **Adapted projection:** selected owned competition records only; no profile-total fallback; explicit media and appearance selection; partial-stat coverage rather than missing values presented as zero.
- **Ported builder hierarchy:** existing athlete identity, introduction, school, graduation, academic information, college goals and honors; grouped field selection; owner preview and parent approval/revision/revocation.
- **One card renderer:** recognizable portrait/identity header, conditional About Me/college goals/school/academic sections, achievement list, numeric statistic cells with recorded counts, selected playable media and upcoming appearances. The same renderer and builder serve all four sports.
- **One sport configuration contract:** terminology, positions, competition/appearance kinds, existing metric keys, aggregation rules, performance measurements, directory adapters and rules resources. Swimming displays comparable selected PB/Target Time; race times are never summed. No rugby, rowing, soccer or other sport was activated.
- **Program/coaching interface:** preserves actual reviewed program IDs and official links, displays programs even when coaches are withheld, and defines a strict sport/program/provenance contract for verified contacts. No soccer contact records were imported.
- **One active journey:** the inline athlete-page builder is retired. Athlete Recruiting entries use `/recruiting?athlete=<existing-id>`. Legacy research notes/checklists/drafts remain; there is no second builder or athlete/event store.

SC preselects some recommended fields after loading its field list; AP deliberately retains its stricter all-off defaults for new previews. Matches/media/events still require explicit selection. This privacy adaptation is intentional, rather than a claim of identical defaults.

SC's deployed application remains unchanged and does not currently import AP's modules. This delivers one reusable SC-derived AP core and documented adapters, **not** a claim that both deployed products already share an npm package, authentication system or backend.

## Functional versus visual/product assessment

Visual PASS is the review assessment of the actual captures and interaction hierarchy; it is not user approval, physical-device certification or a claim of pixel identity with SC.

| Experience | Functional result | Visual/product result and actual difference |
|---|---|---|
| Three-stage path / public school research | **PASS:** school search remains accessible without creating an athlete; sport/gender/division/state/institution filters and existing saved/camp/showcase/draft views remain. | **PASS for review:** predictable stages and program/coaching disclosures. AP retains collegiate typography and its existing page shell; SC uses a more compact React portal. [SC discovery](sc/screenshots/sc-current-recruiting.png), [AP Lacrosse](after/chromium-lacrosse-schools.png). |
| Same-athlete builder | **PASS:** existing photo/identity/introduction are read automatically; edited school/academics reload from the same athlete. No duplicate entry, IDs or event store. | **PASS for review:** imported-identity panel and SC-derived grouped fields precede deliberate selection. Form remains secondary. [SC builder](sc/screenshots/sc-current-builder.png), [AP builder](after/chromium-lacrosse-builder.png). |
| Field privacy | **PASS:** photo, name, school, academics, achievements, statistics, media and appearances have independent explicit selections. Unselected honors/media and practice statistics stay out. Legacy visibility is adapted without a migration or new photo opt-in. | **PASS:** understandable field groups and strict card output. Empty/unavailable information is not fabricated. |
| Coach-facing card | **PASS:** selected existing introduction, school/GPA, goals, honors, competition metrics, video and appearances render through the same projection/card. | **PASS for review:** conditional information hierarchy, portrait, academic block, coverage-aware stat tiles and media resemble SC's proven structure while retaining AP identity. [Actual SC card](sc/screenshots/sc-current-coach-card.png), [AP Lacrosse](after/chromium-lacrosse-coach-card.png). |
| Four-sport reuse | **PASS:** complete Lacrosse, Basketball, Volleyball and Swimming browser journeys use one builder/renderer. Nested swimming race and volleyball match remain in their single parent plan. | **PASS for review:** the same presentation with different sport data. [Basketball](after/chromium-basketball-coach-card.png), [Volleyball](after/chromium-volleyball-coach-card.png), [Swimming](after/chromium-swimming-coach-card.png). |
| Parent approval / revision / revocation | **PASS:** approval/revocation survive navigation and reload. Selection/editor changes revoke approval; selected-content revision detection also invalidates approval after external profile edits. Existing age16/guardian/current-rules gates remain. | **PASS:** clear draft/approved status, parent review and local-only limitations. No active external share/send action is implied. |
| Coaching contacts populated with real verified data | **FAIL / DATA GAP:** current AP publication contains **zero verified coaching contacts**. All43 reviewed program rows remain: Lacrosse10, Basketball16, Volleyball8, Swimming9, all with their existing official source links. The adapter withholds wrong-sport, unverified, stale/future and personal-email records in tests. | **PASS for honest empty presentation:** program details explicitly explain contact verification is unavailable. This is not proof of coach-directory coverage. Synthetic test coaches are never published. |
| November15 preservation / independence | See exact regression results. Schedule entry, recurrence IDs/exceptions, directory/location data, SIEM model/fixtures and shared family projection are unchanged. Recruiting also works while publisher content is held unavailable. | AP branding, four pillars, sport directories, family colors and accepted SIEM layouts are preserved. No unrelated redesign. |

## Complete browser journey evidence

Fresh synthetic athlete → profile portrait → one-time competition (or meet/tournament with one nested race/match) → existing event-linked statistics/achievement → uploaded playable highlight → existing athlete introduction and age review → save a real reviewed college-program ID → edit missing academic/school information once → reload and verify same-profile prefill → select precise fields, one honor, competition record, highlight and appearance → coach-card preview/playback → approve/reload → revise/unselect school → approve/revoke/reload.

[Chromium four-sport continuity](chromium-four-sport-journeys.json) and [WebKit continuity](webkit-four-sport-journeys.json) record IDs, saved-school references, selected event/record references, one athlete/one source plan per scenario, video playback and zero external writes. A separate browser case verifies legacy preference/invalid-photo fallback without losing the old draft; another holds publisher requests while completing Recruiting. A configuration-contract unit fixture exercises a new metric/measurement contract without registering a new public sport or changing the UI.

Desktop1440×900, iPad810×1080 and iPhone390×844 captures are included. Full-page/component screenshots can extend below the viewport. The QA portrait is a synthetic “QA” image and the video is the existing synthetic mechanism fixture; neither is presented as a real athlete or achievement. The before and after journeys use different clearly synthetic data, so the comparison demonstrates structure and supported sections, not a pixel-diff of identical content.

[Side-by-side HTML](COMPARISON.html) includes actual AP-before/AP-after and current SC/AP pairs. GitHub displays HTML source/download rather than hosting it; open locally or in Codespaces. PNGs and this Markdown report are directly reviewable.

## Integration defects and validation findings

- Actual screenshot inspection caught a portrait policy error that structural assertions missed. Recruiting now reuses AP's Blob → ImageBitmap → canvas portrait path, preserving the existing restrictive image policy and falling back to initials for malformed legacy images. Browser checks require actual decoded portraits and no broken loaded images.
- Upcoming appearances use the same Denver calendar day as family scheduling and exclude ended timed competitions. A midnight-boundary regression exposed and corrected the initial UTC-day mismatch. Recurrence and schedule records were not changed.
- Recruiting previously waited behind the publisher-content request. Its owned-profile/media builder now initializes before that unrelated request, preserving module independence and preventing a feed outage from blocking the recruiting journey.
- Preview media resources are stopped/reset before URL disposal when a card is revised or revoked. WebKit tracing also observed native Blob/image work being canceled by immediate test reloads; final journeys wait for actually rendered portraits before navigating. No page errors are ignored or filtered from acceptance assertions.
- Compatibility review corrected unintended writeback of unedited legacy fields: the editor now writes only changed fields, retaining existing types and longer stored text. Missing GPA scales are withheld rather than assumed to be4.0; regression cases cover both.
- A rendered keyboard check found focus returning to the page body after field selection. The shared builder now restores the same selected control after the existing app rerender; Tab advances to the next field. A dedicated browser regression covers this.
- Existing tests now choose precise SC-derived fields and follow the canonical Recruiting route instead of the retired inline builder. Original cases and privacy/isolation assertions remain. Screenshot output is configurable so November15 evidence is not overwritten.

Final test totals and earlier failed-run diagnostics are in [RESULTS.json](RESULTS.json). Earlier native-control failures during parallel WebKit runs are retained in logs. Scheduling code was not changed to manufacture a passing result; native date/click reliability on a physical iPad remains an acceptance gate, and automated viewport checks do not certify it.

## Preserved information and remaining gates

No catalog/source registry, reviewed content approvals, engine, athlete/state contract, statistics/media domain, recurrence calculation, calendar linkage, discovery filter, SIEM domain/fixture or brand asset was replaced. Existing athlete IDs, saved opportunities, event references, drafts, notes/checklists and unknown extensions survive the current loader. Original source/domain byte guards remain; new tests cover the shared projection and compatibility.

Open gates:

1. Verify real sport-appropriate coaching contacts through the approved source/review process. Current coverage is0; program links are not a substitute for verified names/emails.
2. User acceptance of the actual AP/SC screenshots and physical iPad/iPhone interaction, including native date controls.
3. Production authentication, verified guardian authority, protected cross-device media, secure coach access, external approvals/delivery and live communication remain unimplemented. Local approval/revocation and its non-cryptographic revision marker do not provide those guarantees.
4. Previously documented ZIP-coordinate and permitted article-imagery gaps remain; this recruiting task does not activate content sources or expand directory coverage. Source approvals stay19 approved /21 inactive.

**Recommendation:** review the shared recruiting candidate for user acceptance with the coaching-data gap explicit. The reusable core and four-sport journey are delivered for review; comprehensive coaching coverage and production sharing are not represented as complete. No merge, push, deployment, publication or Soccer Center changes.
