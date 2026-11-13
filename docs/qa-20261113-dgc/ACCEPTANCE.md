# Arena Pathway — Discover. Grow. Connect.

Branch: codex/ap-qa-20261112. Baseline: 39ecc7eb9c2f671658d4916f17c966facb6b3c39. The final local commit SHA is identified in the delivery response. No merge, push, deployment, publication or Soccer Center modification is authorized or performed.

## Focus and reference

[Preparation and targeted gap map](GAP-MAP.md) record the clean baseline, full charter/AGENTS review, actual current-page audit and read-only Soccer Center source blobs. This pass extends the existing AP presentation stylesheet and DOM/SSR components; it does not create another design system or import SC's React/authenticated feed backend.

Discover/Grow/Connect describe the athlete experience. Profile, SIEM, LockedIn and Recruiting remain the four independent commercial pillars. The approved letterman logo, stadium imagery, four sport environments, source records, typography, palette and “Your sport. Your path. One place.” tagline remain. The user-approved “A place to belong. A place to become.” positioning complements that tagline.

## Presentation changes

- **Discover:** the stadium homepage now brings the four sports forward before the existing mission/platform explanation. Discover/Grow/Connect anchors lead to existing content, not new dashboards. All previous sections, service disclosures and destinations remain. The four sport pages add matching anchors to their existing news, development and community sections; regional search and complete matching directory lists remain intact.
- **Editorial feed:** existing approved stories keep their actual headline, publisher, publication metadata, source link, filters, Manage Sources, retry/loading/empty states and sport separation. Where approved article imagery is absent, a static, decorative AP typographic cover provides a deliberate editorial fallback. It is not a photograph or publisher logo, and unrelated sports photography is never substituted. Development uses a distinct cover treatment and remains separate from news and uploaded Media. The existing approved-image permission/path check is unchanged.
- **Grow:** Profile retains its fuller personal identity header, photo controls, parent/privacy badges, five tactical tabs and existing information cards. Existing season labels appear in the cover caption; recorded achievements appear alongside their existing records only when present. Resource/tactical views use a compact identity header so the athlete's feed, schedule or gallery reaches the foreground sooner. Editing remains available, including the original Remove Photo action. No achievement, number, progress rating, season or public sharing capability is generated.
- **Connect:** the previously validated SIEM entry, Start Guided Tour, own-family setup, dashboard, athlete colors, calendar relationships, messages, evidence disclosures and privacy behavior are preserved. Community and parent/athlete navigation retain their existing paths. No new AI, connector, social exposure or communication service is added.
- **Motion:** brief hover/pressed feedback and optional smooth anchors enhance existing controls. Reduced-motion users get no transform, transition, animation or smooth scrolling from these refinements. No autoplay, continuous effects, animation library or new asset download is introduced. Existing optimized sport photographs remain lazy-loaded in the application; the screenshot harness eagerly decodes them only for reliable capture.

## Functionality and trust

All data, engine records, brand/photo/font assets, state/identity models, recurrence, shared event projection, stats/media models, SIEM engine/fixtures and recruiting models remain byte-preserved from 39ecc7e. The existing content approval/freshness/source-selection functions remain byte-identical; only their card rendering changes. No migration, duplicate event store, new data source or package dependency is introduced.

Source baseline remains 40 candidates, 19 approved/21 inactive, 21 written items (14 news/7 guides). No publisher article image or instructional video approval is added. There is no AP live RSS refresh service to repurpose: AP's reviewed snapshot endpoints and retry remain honest snapshots. Soccer Center's feed source controls and editorial hierarchy are the reference; its backend is not imported and live connectivity is not implied.

LockedIn remains the established external demo at https://soccercenter.org/locked-in/index.html. Its introduction, safe new-tab/return behavior and secondary archived AP reference are unchanged. The prior candidate's anonymous live-access evidence is retained in docs/qa-20261113-polish/SC-ACCESS.json; this pass does not claim a new live verification. Regression testing checks the unchanged destination and no AP data transfer. Recruiting stays optional and parent-controlled; schedules, stats, achievements and selected media reuse the same athlete identifiers and approvals.

## Validation and regression findings

**Final results: npm run check PASS; npm test 235 passed / 0 failed / 0 skipped; Chromium 141 passed / 0 failed across 13 suites; WebKit 66 passed / 0 failed across 9 suites.** Chromium 156.0.8078.79 and WPE WebKit 26.5 were used. Existing tests remain. New coverage checks DGC anchors and homepage order, four complete sport directories, no automatic source activation, honest editorial covers, compact/full identity continuity, explicit seasons/achievements, reduced motion and responsive controls.

The original profile suite caught an over-tall cover moving the tabs below their accepted iPad position and a compact footer hiding Remove Photo. Both were corrected in CSS, preserving the original tests and photo workflow. A diagnostic assertion was adjusted to account for CSS uppercase text. The capture harness was corrected to decode offscreen lazy images; the application's lazy-loading behavior was not changed.

## Remaining limitations and user acceptance

- Physical iPad/Safari acceptance remains required; Linux Chromium/WebKit and responsive viewports do not certify physical devices.
- Please review the complementary positioning, the earlier sports-first homepage order, the AP editorial-cover treatment and compact resource headers. These are visual acceptance decisions, not new product-strategy or permission gates.
- Source coverage is still partial. News remains a reviewed snapshot; inactive sources, publisher imagery and instructional-video approvals remain separate content gates. No new records or dates were fabricated to make the experience look busier.
- Profiles/events/records remain browser-local and family media remains in IndexedDB. Production authentication, verified guardian permissions, cross-device persistence, secure coach links/sharing and live provider connections remain unimplemented. LockedIn is an external fictional demonstration, not verification/payment infrastructure. Slack remains a local demo draft workflow; existing ICS snapshots are not live subscriptions.
- The interface is more expressive without adding a functional dependency: a user can discover publicly, use Profile without Recruiting, use SIEM independently and ignore LockedIn without losing information.

## Evidence and changed files

[Machine-readable results](RESULTS.json), [Chromium runs](logs/chromium-runs.json), [WebKit runs](logs/webkit-runs.json) and [complete screenshot inventory](SCREENSHOT-INVENTORY.json) retain the precise results. Screenshots include desktop 1440×900, iPad 810×1080 and iPhone 390×844 viewports, plus component crops. Fixtures are synthetic test-only family records. No private user records are pictured.

| iPad experience | Before | After |
| --- | --- | --- |
| Homepage | [Before](screenshots/chromium-before-home-ipad.png) | [After](screenshots/chromium-after-home-ipad.png) |
| Sport destination | [Before](screenshots/chromium-before-sport-ipad.png) | [After](screenshots/chromium-after-sport-ipad.png) |
| Athlete identity | [Before](screenshots/chromium-before-athlete-ipad.png) | [After](screenshots/chromium-after-athlete-ipad.png) |
| My Feed | [Before](screenshots/chromium-before-feed-cards-ipad.png) | [After](screenshots/chromium-after-feed-cards-ipad.png) |
| SIEM, retained | [Before](screenshots/chromium-before-siem-ipad.png) | [After](screenshots/chromium-after-siem-ipad.png) |

Matched WebKit captures and responsive desktop/iPhone captures are in the same screenshot directory. The original seven-page audit is retained separately. Source references support hierarchy and interaction comparison; these captures do not pretend to reproduce authenticated Soccer Center screens.

[Complete changed-file list](CHANGED-FILES.txt). Product changes are limited to public/app.js, public/content-library.js, public/ux-polish.css, src/views.mjs and src/consolidated-views.mjs. Remaining files are focused regression tests, capture scripts and QA documentation/evidence. No production data, dependencies or backend configuration changed.
