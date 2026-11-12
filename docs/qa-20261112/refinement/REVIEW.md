# AP-QA-20261112 — acceptance refinement

Branch: `codex/ap-qa-20261112`. Started from clean commit `b8a19cf2c0ec03370076fd474e9f58df0db7eab7`; this is a focused follow-up on that branch. No merge, remote push, publication, deployment, Soccer Center or production changes.

## Changes

1. **Parent navigation:** Players, Recruiting, Network/Messaging, Discover, Calendar, Saved. Existing athlete cards, independent recruiting research, My AP messages, sports discovery and the read-only local family calendar are reused. Saved summarizes existing records by athlete and links back to their existing workspace; it creates no new records or memberships.
2. **Athlete navigation:** exactly five primary tabs: **Profile / Schedule / Stats / Media / Recruiting**. Recruiting opens independently with the same selected athlete ID and never activates from saving a club or creating a profile. A separate resource row keeps **My Feed / Development / Community / Network** readily accessible. Existing preferences, modules, deep links and stored records remain authoritative.
3. **Grouped Profile:** About My Sport, Positions and Goals, Club & Team, Upcoming Events and Saved cards use the established cover/avatar, parent-managed/private state, edit actions and AP collegiate styling. Cards use two columns on iPad/desktop and one on phone. Sport-story/goals editing remains progressive disclosure; no new onboarding steps or duplicate profile fields.
4. **Reviewed content:** [all40-candidate audit](CONTENT-AUDIT.md) records individual decisions and evidence. **18 sources / 20 specific public written items approved**, including news and instructional guides across all four sports. **22 sources inactive.** Source choice is explicit per existing athlete; legacy candidate interests are retained without automatically subscribing. My Feed and Development have working source filters, persisted choices, source names, review dates, original summaries and outbound links. The original40-name registry stays unchanged; `data/content-review.json` adds decisions using the same canonical IDs.
5. **Scope of approval:** approval covers only the listed written items, not entire publisher libraries, linked videos, memberships, live sports streaming or licensing for redistribution. No external media is copied/embedded and no unchecked articles are automatically ingested. The experience is a reviewed link collection, **not a live provider feed**. Reviews expire after30 days and fail closed without deleting saved choices. Source selection does not enable Recruiting or another service.
6. **Isolation:** delayed content responses retain their original DOM targets. A guard prevents an old athlete’s asynchronous work from appending recruiting controls to a newly selected athlete. A regression test holds the response while switching from an age16 athlete to an age15 athlete, then verifies the second athlete’s controls and feed stay isolated.
7. **Media readiness:** videos preload metadata rather than whole files. Tests wait for the actual loaded player and successful H.264 playback after reload, instead of treating the page’s general load event as media readiness. Athlete/event references, IndexedDB storage and the schedule/stat/recruiting models are unchanged.

No calendar, directory, SIEM fixture/domain/event contract, original sports data, branding or authentication redesign. Additional automated preservation checks compare all original data/engine/brand files and core schedule, statistics, media-store and SIEM modules directly to `b8a19cf`.

## Validation

The original **213 automated tests remain passing**; five new tests bring the suite to **218 passed, 0 failed**. No tests were removed. Browser expectations were updated for the requested five-tab navigation, separate resource row and reviewed-content workflow. The historical candidate-inventory test was relabeled to distinguish the preserved inventory from its new activation decisions. The server preservation assertion permits only the new fixed read-only content endpoint; existing security/method/routing checks remain intact.

| Check | Final result |
|---|---|
| `npm run check` (syntax, data, participation, discovery, Node suite) | PASS — 218 tests, 0 failed |
| Explicit `npm test` | PASS — 218 tests, 0 failed |
| Expanded acceptance, Chromium | 11/11 |
| Expanded acceptance, actual WebKit/WPE | 11/11 |
| Existing profile visual/navigation | Chromium8/8; WebKit8/8 |
| Existing athlete workspace | 10/10 |
| Existing conformance / My AP / directories | Chromium12/12; WebKit12/12 |
| Rivera family SIEM | 18/18 |

Expanded acceptance includes all seven prior functional cases plus the six parent destinations, five tactical tabs, optional Recruiting, per-source filtering/reload, each sport’s Development items, cross-athlete subscription isolation, and a delayed-response/recruiting-age regression. Prior cases cover iPad recurrence creation/editing/skips/export/import deduplication, linked statistics, image/video persistence and playback, family calendar categories, source-attributed demo messages and Slack drafts with no outgoing posts.

Desktop1440×900, iPad810×1080, phone390×844 and the existing portrait/landscape profile checks are covered. Node24.22.1/npm11.9.0; Chromium and official Playwright WebKit build2336 via the existing `/workspace/scratch/webkit-local.sh` runtime. **These are browser/viewport tests, not physical iPad/iPhone Safari acceptance.** Exact logs and machine-readable results are in [logs](logs/) and [VALIDATION.json](VALIDATION.json). External publisher pages were reviewed through unauthenticated HTTP access and written-content inspection; the browser suites test AP’s selection/filtering and family workflows, not third-party website uptime forever.

Reproduce with `npm run check`, `npm test`, then start AP and run `npm run test:acceptance:browser`. For this environment’s WebKit run use `WEBKIT_PATH=/workspace/scratch/webkit-local.sh npm run test:acceptance:webkit`. Existing profile and conformance scripts retain their documented browser environment variables.

## Updated iPad evidence

All screenshots below are the actual AP application with fictional local profiles, not Soccer Center reconstructions:

- [Parent viewport](screenshots/ap-parent-ipad-viewport.png) / [full parent page](screenshots/ap-parent-ipad-full.png)
- [Athlete viewport](screenshots/ap-athlete-ipad-viewport.png) / [full grouped profile](screenshots/ap-athlete-ipad-full.png)
- [My Feed](screenshots/feed-ipad.png)
- Development: [Basketball](screenshots/development-basketball-ipad.png), [Volleyball](screenshots/development-volleyball-ipad.png), [Swimming](screenshots/development-swimming-ipad.png), [Lacrosse](screenshots/development-lacrosse-ipad.png)
- [Media](screenshots/media-ipad.png), [family calendar](screenshots/calendar-ipad.png), [phone profile](screenshots/iphone-profile.png)

Preview: run `npm start`; use `/my-pathway?view=family` for parent navigation, View Athlete for the same saved identity, `/my-pathway#my-feed`, `/my-pathway#camps`, `/recruiting`, and `/my-ap?scenario=local&section=calendar`. Existing source preferences remain under their existing advanced preferences route. No new dashboard is introduced.

## Remaining blockers / precise acceptance limits

1. **Original visual references — BLOCKED / NOT TESTED:** The original November11 Soccer Center screenshots and exact Soccer Center18 archive are not available in the supplied attachments or accessible workspace. The available ZIP is the CandidateA QA source package. Connected product records contain textual November11 UAT notes, but the inspected records provided no original image/archive reference. Previously captured source-rendered fixtures and the read-only GitHub snapshot are **not substitutes for these requested originals**. No new final side-by-side is presented as accepted. Attach the original screenshots and SC18 archive to complete exact visual comparison and sign-off. Soccer Center remains untouched.
2. **22 inactive candidates:** complete per-source reasons are in CONTENT-AUDIT.md and the data artifact. Examples: JVA drill pages explicitly require membership, The Race Club redirects to paid restricted content, a ShotMechanics workout link resolves to template content, and the sampled WorldofVolley article contains betting promotion. Other sources have unverified individual videos, script-dependent/empty content, paid programs or unconfirmed free items. None are silently activated.
3. **External instructional video approval:** the four-sport Development experience now works with six public written guides, but individual YouTube/publisher video availability/playback and whole-channel suitability are not certified by this review. Family-uploaded H.264 playback is separately tested in both engines. No blanket “all videos free” claim.
4. **Pilot capabilities unchanged:** browser-local persistence and parent settings are not authenticated accounts or secure cross-device storage. Recruiting remains an optional parent-controlled local preview with the existing age16/rules review gate; live coach sharing, current sport-specific rule validation and secure external revocation remain unimplemented. Provider messages and Slack replies remain demonstration/draft-only. LockedIn live verification/onboarding remains **Coming Soon**, status-only in SIEM.
5. **Final device acceptance:** hands-on iPad Safari/iPhone review and user approval are still required. Automated tests support covered workflow preservation; they do not supply the missing reference evidence or authorize release.

Review the new parent-to-athlete flow, grouped cards, source choices and inactive labels on iPad, then compare against the original SC references when supplied. Stop before merge, production push, deployment or publication.
