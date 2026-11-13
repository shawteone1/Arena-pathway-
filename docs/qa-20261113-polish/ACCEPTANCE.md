# Product-family UX alignment — AP review candidate

Branch: `codex/ap-qa-20261112`. Baseline: `d3ed8609081124457e95e692ac8d6cac4721300b`. Final local commit SHA is supplied in the delivery response. Nothing is merged, pushed, deployed or published. Soccer Center is unchanged.

## Shared principles, distinct AP identity

This is a scoped presentation layer over the existing implementation. AP retains its interlocked letterman logo, stadium umbrella homepage, licensed sport photography, collegiate display headings, cream brand chrome, navy and burgundy actions, and blue/purple/green athlete cues. Soccer Center supplies the quality reference: consistent button hierarchy, visible focus, rounded white cards, subtle shadows, readable type, balanced spacing, progressive evidence disclosure and predictable paths. No frontend framework, new commercial module, backend or data source was introduced.

[Existing-versus-required assessment and source evidence](GAP-MAP.md) identify the exact read-only SC files/blobs inspected, including the documented October30 parent-home polish, supplementary October31 member polish and public homepage. The unavailable October27–29 conversation archive is not claimed as inspected. This is functional/design-pattern alignment, not an unsupported pixel-identical claim.

## What changed

- All four sport pages have a consistent photographic navy hero, clear Explore clubs & programs action and Create Your Pathway secondary action. Sport Home has an explicit active state. Existing category navigation uses recognizable buttons. Reviewed news has editorial headline/publisher/date cards, with dates only when already approved. Development and Community have distinct resource cards. Review/coverage explanation is expandable. The entire matching directory and overlapping regional search remain, reached directly through the hero anchor; no navigation level or preview-only directory is added.
- SIEM has a prominent Start Guided Tour. Its initial entry distinguishes Tour the fictional Rivera family, Set Up My Family and Explore Dashboard. Direct scenario/calendar/message links continue opening their requested view; returning URL state is retained. The optional tour deliberately switches to the existing fictional Rivera scenario without copying or writing user family records.
- SIEM card type, actions, panel spacing and iPad controls are more readable. Calendar category labels remain separate from athlete ID colors. Existing locations are shown in the Rivera summaries. Message titles, athlete, provider/time, preview and required actions precede detail. Repeated provenance is expandable; source health remains accessible below the main cards and in Settings. No evidence or audit record is deleted. Shared-screen privacy also masks the new entry copy, including hidden DOM text.
- Existing parent/athlete/recruiting screens use the same button, card, form, navigation, focus and empty-state treatment. The parent navigation now explicitly marks its current section and restores that marker from the existing page anchor. The established cover/avatar, grouped Profile information, Schedule/Stats/Media/Recruiting tabs, separate Feed/Development/Community resources and local recruiting builder stay intact. No onboarding, eligibility, approval/revocation or persistence logic is rewritten.
- LockedIn's primary action is **Open Interactive LockedIn Demo**, linking to the actual Soccer Center experience. The earlier AP simulation is retained only under a closed “Earlier AP local simulation · reference only” disclosure; its model and JS are unchanged and no new simulation is built.

## LockedIn URL, authentication and return path

Verified public route: **https://soccercenter.org/locked-in/index.html**.

A fresh anonymous Chromium context received HTTP200 at that exact URL, with title “Locked In — Parent to club guided demo”, interactive NSID/Box/Fiserv sample cards, the established club/DocuSign/handoff journey and no password input or sign-in redirect. The source's `LockedInExperience` iframe points to precisely this public file. The parent-portal wrapper also returned200 but adds portal chrome and cookie-consent UI. A generic non-browser request initially returned403; browser-identifying requests and a fresh actual browser worked. This was not presented as an authentication prerequisite.

The AP link opens a new tab with `noopener noreferrer`, contains no AP athlete IDs, query data or tokens, and sends no AP records. The AP introduction explicitly says to close the SC tab to return to AP. No unsupported SC return-URL parameter or iframe integration is invented. AP continues functioning independently if the external site changes or is unavailable. [Access evidence](SC-ACCESS.json), [anonymous direct page](sc-direct-anonymous.png), [portal wrapper](sc-portal-anonymous.png).

The established SC demo remains fictional. AP does not verify identity, upload sensitive documents, create signatures, collect payments or connect NSID/Box/DocuSign/Fiserv. LockedIn live services in AP remain Coming Soon.

## Preservation and independence

New regression assertions verify baseline bytes for all `data/`, `engine/`, `public/brand/` and the shared identity, recurrence, event projection, records, media, SIEM model/fixtures and earlier LockedIn model/JS. All original231 automated test cases remain, with2 additional boundary/preservation cases. The historical directory-HTML comparison permits only the explicit added stylesheet link; its directory/content comparison and every fixture/data assertion remain. No existing test case or accessibility/fold threshold is removed.

Athlete IDs, browser-local records, saved opportunities, calendar relationships, recurrence, race/match references, media event isolation, source preferences, recruiting selections/approvals/revocation and module independence are retained. Source approvals remain19 approved/21 inactive across40 candidates;21 reviewed written items, zero newly approved videos or article images. No club logos or affiliations are invented. Publisher content, development and uploaded family media remain separate.

## Validation

**Final results:** `npm run check` passed, including syntax/data/participation/discovery checks and233 tests. Separate `npm test`:233 passed,0 failed,0 skipped. Chromium:135 passed/0 failed across12 suites. WPE WebKit:60 passed/0 failed across8 suites. The existing129 Chromium/54 WebKit cases plus6 targeted UX cases per engine are counted once using their final runs; diagnostic/repeated runs are not double-counted. See [RESULTS.json](RESULTS.json), [Chromium manifest](logs/chromium-runs.json), [WebKit manifest](logs/webkit-runs.json) and the complete logs. Browser versions: Chromium156.0.8078.79 and WPE WebKit26.5. Responsive coverage includes1440×900,1024×768,810×1080,768×1024 and390×844 CSS-pixel layouts. New browser cases cover parent-section active state and hash restoration without data writes, external-tab safety/return, the archived local reference, four sport pages and full directory counts at desktop/iPad/iPhone sizes, tour/setup/dashboard choices, local-record preservation, ID-independent fictional tour, evidence disclosure, focus, touch sizes and resizing. Existing Chromium/WebKit suites retain profile, schedules, gallery/video, recruiting, local/fictional SIEM isolation, privacy, source status, calendar/action navigation and directory regression coverage.

The initial diagnostic run found entry visibility being evaluated after the existing URL rewrite, filter overflow when narrowing a tablet-sized view, and hidden entry copy retaining a fictional family name in privacy mode. Those defects were fixed in presentation wiring/CSS; the corresponding regressions are rerun. Existing provider DEMO wording and the unchanged first-screen/fold checks are preserved.

## Remaining differences and gates

- SC's documented patterns are reused, while AP deliberately keeps collegiate display headings, AP brand colors, its own licensed sport imagery and information-rich Colorado discovery. This is not a copy of SC's soccer theme or backend.
- Article cards contain reviewed real headlines/links and available dates, but zero publisher article images are approved for AP reuse. None are fabricated. Feeds remain reviewed snapshots, not live refresh;21 inactive candidates remain inactive.
- Physical iPad/Safari user acceptance is still required. Chromium and installed WPE WebKit are development browser checks at desktop, iPad and iPhone viewport sizes, not device certification.
- AP persistence is browser-local; production authentication, verified guardianship, cross-device backup, authorized provider connections, secure coach sharing and live vendor services remain outside this visual pass. Slack replies remain local demo drafts. Calendar subscriptions remain unconnected; existing reviewed ICS snapshot/import/export workflows are preserved.
- No operational AP function depends on opening the external LockedIn demo. Its live availability/authentication is controlled by Soccer Center; this report records observed anonymous behavior on November13,2026.

## Reproduce and inspect

Use `npm ci`, `npm run check` and `npm test`. Restart the existing Node server after checking out a new build (`npm start`, or the existing `npm run dev` watcher). Do not mix cached server-rendered markup with browser files edited in place. No infrastructure change is needed.

With the current server on3000, run `python scripts/qa-ux-polish.py` and the existing browser suites. For the installed development WebKit use `PROFILE_BROWSER=webkit MY_AP_BROWSER=webkit WEBKIT_PATH=/workspace/scratch/webkit-local.sh`; other environments should use their compatible Playwright WebKit path. The scratch launcher is not an application dependency.

`scripts/qa-ux-polish-evidence.py` captures the immutable d3ed860 baseline on3001 and current candidate on3000, using existing synthetic profile fixtures. Actual live SC access is recorded separately in SC-ACCESS.json; the browser regression uses an explicitly labeled external-tab stub to avoid making every test depend on SC availability. The stub is not represented as live URL/auth verification.

Manual palette checks: white on AP burgundy #a52a3b is7.01:1; white on navy #193550 is12.60:1; main text #172638 on white is15.32:1; supporting text #49596c on white is7.17:1. Focus uses a visible3px outline. New primary actions have44px or larger targets. These checks do not claim a complete WCAG certification.


## Final suite results

| Suite | Passed | Failed |
|---|---:|---:|
| resume-chromium | 7 |0|
| consolidated-chromium | 8 |0|
| acceptance-chromium | 12 |0|
| rc-chromium | 2 |0|
| conformance-chromium | 12 |0|
| siem-family-chromium | 18 |0|
| release-chromium | 20 |0|
| siem-platform-chromium | 7 |0|
| siem-refinement-chromium | 12 |0|
| acquisition-chromium | 23 |0|
| polish-chromium | 6 |0|
| profile-chromium | 8 |0|
| resume-webkit | 7 |0|
| consolidated-webkit | 8 |0|
| acceptance-webkit | 12 |0|
| rc-webkit | 2 |0|
| conformance-webkit | 12 |0|
| siem-webkit | 5 |0|
| polish-webkit | 6 |0|
| profile-webkit | 8 |0|

## Before/after evidence

[Complete screenshot inventory](SCREENSHOT-INVENTORY.json):68 actual AP screenshots plus2 anonymous live SC reference screenshots. The AP baseline is the immutable d3ed860 source; the corrected pages are this candidate. Main iPad captures are810×1080; component crops and desktop/iPhone examples supplement them. [Chromium capture metadata](chromium-evidence.json) and [WebKit metadata](webkit-evidence.json) record viewport/crop information. No older source-rendered SC fixture is used as the definitive comparison.

| Experience | Before | After |
|---|---|---|
| Lacrosse homepage | [baseline](screenshots/chromium-before-lacrosse-ipad.png) | [candidate](screenshots/chromium-after-lacrosse-ipad.png) |
| Sport navigation | [baseline](screenshots/chromium-before-sport-navigation-ipad.png) | [candidate](screenshots/chromium-after-sport-navigation-ipad.png) |
| Editorial/resources | [baseline](screenshots/chromium-before-sport-editorial-ipad.png) | [candidate](screenshots/chromium-after-sport-editorial-ipad.png) |
| Parent workspace | [baseline](screenshots/chromium-before-parent-ipad.png) | [candidate](screenshots/chromium-after-parent-ipad.png) |
| Athlete identity | [baseline](screenshots/chromium-before-athlete-ipad.png) | [candidate](screenshots/chromium-after-athlete-ipad.png) |
| Athlete overview | [baseline](screenshots/webkit-before-athlete-overview-ipad.png) | [candidate](screenshots/webkit-after-athlete-overview-ipad.png) |
| SIEM entry | [baseline](screenshots/chromium-before-siem-entry-ipad.png) | [candidate](screenshots/chromium-after-siem-entry-ipad.png) |
| Guided tour | [baseline](screenshots/webkit-before-siem-tour-ipad.png) | [candidate](screenshots/webkit-after-siem-tour-ipad.png) |
| Calendar | [baseline](screenshots/chromium-before-siem-calendar-ipad.png) | [candidate](screenshots/chromium-after-siem-calendar-ipad.png) |
| Action summaries | [baseline](screenshots/webkit-before-siem-actions-ipad.png) | [candidate](screenshots/webkit-after-siem-actions-ipad.png) |
| Messages | [baseline](screenshots/webkit-before-siem-messages-ipad.png) | [candidate](screenshots/webkit-after-siem-messages-ipad.png) |
| LockedIn introduction/action | [baseline](screenshots/chromium-before-lockedin-entry-ipad.png) | [candidate](screenshots/chromium-after-lockedin-entry-ipad.png) |
| Recruiting | [baseline](screenshots/chromium-before-recruiting-ipad.png) | [candidate](screenshots/chromium-after-recruiting-ipad.png) |
| iPhone sport page | [baseline](screenshots/webkit-before-lacrosse-iphone.png) | [candidate](screenshots/webkit-after-lacrosse-iphone.png) |
| Desktop SIEM | [baseline](screenshots/chromium-before-siem-desktop.png) | [candidate](screenshots/chromium-after-siem-desktop.png) |

## Changed files and final acceptance

[Complete changed-file list](CHANGED-FILES.txt). The functional changes are presentation-only wiring in existing renderers: scoped stylesheet loading; sport card/hero markup and current navigation marker; SIEM entry/tour and disclosure layout; parent navigation current-section marker; external LockedIn introduction. `public/ux-polish.css` holds the shared AP presentation layer. Tests, browser/capture scripts and QA evidence accompany the change. No model, registry, fixture, branding asset, package/dependency, authentication, data API or infrastructure change is included. The server change only registers the new stylesheet in the existing static-asset allowlist.

Recommended user acceptance: compare the iPad screenshots, open all four sport pages and their regional discovery, create/edit an athlete, follow a shared schedule event into SIEM, tour the fictional Rivera family, switch back to local family data, check message evidence, review an optional recruiting preview and open/close the verified SC LockedIn tab. No known failing regression remains in the final completed suites; physical-device review and the production/content gates above remain.
