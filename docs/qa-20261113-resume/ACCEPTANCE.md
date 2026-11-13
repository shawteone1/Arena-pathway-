# November 13 resumed iPad acceptance correction

Development branch: `codex/ap-qa-20261112`. Baseline: `48ca091c56772ff49b5e6217b8766ecfbc7f0158`. The local follow-up commit containing this report is identified in the delivery response; no merge, push or deployment is authorized or performed.

## Reconciliation and reference

The branch started clean at the expected baseline. History and reflog contained no unfinished work after48ca091. Read AGENTS.md and the full approved PRODUCT-NORTH-STAR.md. Existing November13 improvements and evidence are preserved. See [reconciliation](RECONCILIATION.md) for the concise reuse/gap map and exact SC source blobs inspected read-only. Soccer Center remains unchanged at imported reference11de067414e63c5d3e3e221dfc14cc026dfbd8d0. No attachment, source transfer, SC backend import or architecture restart was needed.

## Latest numbered findings

1. **LockedIn:** `/locked-in-demo` now has Parent review, Box sample documents, Club review and Simulated handoff stages. The established SC pure fictional model supplies permission, version/acceptance, expiration/revocation, replacement, preview and idempotent failed/retried handoff rules. NSID, Box, DocuSign and Fiserv actions only change in-memory sample status. Reset/reload clears the sample. No AP athlete information, identity evidence, file upload, signature, card, payment, provider API or external transfer is used. Live services remain Coming Soon.
2. **SIEM:** Guided tour is visible in the existing banner and remains available in Settings, separately from family setup. Start/Next/Back/Skip/Restart stay optional. ID-stable blue/purple/green cues apply across existing profile/calendar/message/action presentations; Rivera's three athletes now have distinct cues. Athlete events feed My AP through shared references; fictional Rivera data stays separate.
3. **Scheduling:** List, Day, Week and Month reuse the established SIEM calendar grid and original event model. Existing weekday recurrence, occurrence editing, filtering and ICS snapshots/export remain. Locations can be typed or selected from previously entered locations. Swimming races and volleyball matches are nested in the existing meet/tournament plan, with stable child IDs and day offsets. Each session supports editing/deletion and stats/media linking. Parent containers remain editable in the athlete list; SIEM and ICS project sessions once, avoiding competing duplicate parent commitments. No generated occurrence or independent calendar store is persisted. A parent edit that would invalidate child days is rejected.
4. **Recruiting:** Build Profile opens the actual parent-controlled local builder, reusing the same athlete, records, event appearances and selected media. Parents choose field groups and individual records/events/highlights, preview, approve or revoke. Existing age16+, parent management and current sport/rules review gates remain; age16 is AP policy, not contact permission. Editing selection clears approval. No secure coach URL, invitation or external communication is created. Existing identity/About/Goals editing remains the single input path. Turning Recruiting off retains its selections and underlying information.
5. **Sport landing pages:** Retained the already implemented information-first four sport pages, full regional discovery lists, overlapping region choices, Community/Development links and sport-specific reviewed news. Verified responsive presentation and source separation. No new sports, organizations, registration dates, publisher imagery or sources were added; no additional landing redesign was necessary.
6. **Swimming overview:** Personal Best and Target Time are visible together by explicitly identified race discipline and pool course (SCY/SCM/LCM). Personal Best is the lowest positive family-entered logged time in that comparison group. Legacy unclassified times remain stored and are not compared across distances/courses. Targets require an explicit discipline/course and positive seconds or m:ss.xx; they preserve their IDs on edit. No performance verification is implied.

## Data and independence

Original profile/plan/record IDs, browser-local preferences, saved opportunities, source registries, brand assets, fixtures and domain models are retained. New fields are additive: `plan.sessions`, explicit swim record context, `profile.swimmingTargets`, and recruiting record/event selections. The family adapter changes only its read projection; byte-preservation tests permit precisely that import/loop substitution and retain all other frozen assertions. Parent creation/editing, local media and event changes do not activate Recruiting. SIEM remains usable without a detailed athlete profile. LockedIn is a separate synthetic demonstration and cannot block another pillar.

## Content status

Unchanged40 candidates:19 approved sources,21 inactive. Approved sources provide21 written items:14 news items and7 guides. Eight news items have reviewed publication timestamps; six have unknown publication dates. There are zero approved article images or instructional video items. Snapshot labels, user source choice and sport/category boundaries remain.

| Sport | Approved | Inactive | Approved news/development sources |
|---|---:|---:|---|
| Basketball |4|6|3 /1|
| Volleyball |5|5|3 /2|
| Lacrosse |4|6|3 /1|
| Swimming |6|4|5 /1|

Fifteen inactive development candidates still need individual free-content/youth-suitability review, including video approval where relevant. Six additional inactive news candidates remain. No exact count of future video items can be claimed from a channel candidate list. No candidate was automatically activated.

## Validation

`npm run check`: PASS (syntax/data/participation/discovery checks and231/231 tests). Separate `npm test`:231 passed,0 failed,0 skipped. Chromium:129 passed/0 failed across11 suites. WPE WebKit:54 passed/0 failed across7 suites. Responsive checks use1440×900,810×1080 and390×844 CSS-pixel viewports. Final runs include original122 Chromium/47 WebKit cases plus7 resumed cases in each engine; repeated diagnostic runs are not double-counted. Raw counts: [BROWSER-RESULTS.json](BROWSER-RESULTS.json); per-suite exit codes/durations and complete logs are in [logs](logs). Raw logs retain the initial target-course failure and its corrected rerun; the course requirement and no-write behavior are now explicit browser regression checks. A numeric CSS selector in the new weekday test was also corrected. The WebKit directory screenshot initially exceeded the engine’s32,767-pixel capture limit; responsive evidence now uses viewport captures and the entire suite passes. The media-retention regression also confirms that a caption edit after session deletion retains its original event reference. No existing test case was removed. The prior LockedIn browser assertion was narrowly updated to allow its fictional permission checkbox while continuing to forbid real data-entry/provider forms.

## Pilot / production gates

- Physical iPad Safari acceptance remains a user step. Desktop/iPad/iPhone sizes and Linux Chromium/WPE WebKit are development checks, not a claim of device certification.
- AP persists profiles/events/records in this browser and media in IndexedDB. Production authentication, verified parent identity, cloud backup, cross-device synchronization and secure coach sharing are not implemented.
- LockedIn has fictional, resettable sample packets only. All real NSID/Box/DocuSign/Fiserv/club integrations, authorization, retention and vendor agreements remain future work.
- Calendar feed subscription is not live; use the existing reviewed ICS snapshot workflow. Demonstration messages and Slack replies remain local/simulated, not connected posting.
- News is reviewed snapshot content. Inactive sources, instructional videos, image rights, live refresh and incomplete public directory coverage remain separate data/production gates.
- Recruiting supports the existing local field/record/event/highlight selection and preview. SC's academic/contact/link service is not imported; NCAA/high-school contact permissions require current applicable review before a real service.

Recommended acceptance: open the LockedIn fictional walkthrough and test revocation/retry; use the SIEM banner tour; create a meet with two races and a tournament with two matches; edit a recurring weekday series; log a race time and explicit-course target; link media to a session; verify the shared My AP reference; select and revoke a local recruiting preview; repeat those interactions on the user's iPad. No feature should be represented as production-connected.

## Changed-file summary

- `public/lockedin-demo-model.js`, `public/lockedin-demo.js`, `src/consolidated-views.mjs`: attributed fictional SC workflow adaptation, AP UI and truthful live-service limits.
- `public/meet-sessions.js`, `public/schedule-presentation.js`, `public/swimming-progress.js`: additive event projections, existing calendar presentation reuse and comparable swimming times/targets.
- `public/app.js`, `public/profile-qa.js`, `public/local-family-calendar.js`: integrate those projections and UI with the original athlete/event/record/media stores; retain orphan media event references during caption edits.
- `public/college-research.js`: connect Build Profile to the existing controlled preview, without another athlete record.
- `public/siem-guidance.js`, `src/siem-platform-view.mjs`, `public/siem-platform.css`, `public/style.css`: discoverable optional tour, consistent palette and scoped presentation.
- `server.mjs`, `package.json`: serve/check the additive browser modules; no new runtime dependency, backend or package-lock change.
- Tests, browser scripts, local QA evidence and this report: exact paths in [CHANGED-FILES.txt](CHANGED-FILES.txt). Frozen-data assertions remain; only the explicit read-adapter substitution is permitted.

## Reproduce

Use `npm ci`, `npm run check` and `npm test`. Run `npm start` in one terminal; in another run `python scripts/qa-nov13-resume.py` and the existing `test:*:browser` scripts. For WebKit, set `PROFILE_BROWSER=webkit MY_AP_BROWSER=webkit WEBKIT_PATH=/path/to/compatible/Playwright-WebKit` as appropriate to the environment, then run the corresponding browser scripts. This development environment used `/workspace/scratch/webkit-local.sh` for installed WPE WebKit26.5; that scratch launcher is not a production/runtime dependency. `scripts/qa-nov13-resume-evidence.py` uses the current server on3000 and a read-only git-archive of48ca091 on3001; screenshots use synthetic records at810×1080, with some component crops.


## Final browser suite counts

| Suite / engine | Passed | Failed |
|---|---:|---:|
| conformance-chromium | 12 | 0 |
| siem-family-chromium | 18 | 0 |
| release-chromium | 20 | 0 |
| siem-platform-chromium | 7 | 0 |
| siem-refinement-chromium | 12 | 0 |
| acquisition-chromium | 23 | 0 |
| acceptance-chromium | 12 | 0 |
| rc-chromium | 2 | 0 |
| resume-chromium | 7 | 0 |
| consolidated-chromium | 8 | 0 |
| profile-chromium | 8 | 0 |
| acceptance-webkit | 12 | 0 |
| rc-webkit | 2 | 0 |
| conformance-webkit | 12 | 0 |
| siem-webkit | 5 | 0 |
| resume-webkit | 7 | 0 |
| consolidated-webkit | 8 | 0 |
| profile-webkit | 8 | 0 |

## Representative iPad evidence

Screenshots are actual AP pages in an810×1080 browser viewport, using fictional fixtures. Component crops supplement full viewport captures. Baseline comparisons are against AP48ca091, not an older rendered Soccer Center fixture. The original screenshot reference was not required or requested again in this resume.

| Experience | Baseline | Corrected |
|---|---|---|
| Parent | [before](screenshots/chromium-before-parent-ipad.png) | [after](screenshots/chromium-after-parent-ipad.png) |
| Athlete identity | [before](screenshots/chromium-before-athlete-ipad.png) | [after](screenshots/chromium-after-athlete-ipad.png) |
| Swimming overview | [before](screenshots/webkit-before-swimmer-overview-ipad.png) | [after](screenshots/webkit-after-swimmer-overview-ipad.png) |
| Athlete schedule | [before](screenshots/chromium-before-schedule-ipad.png) | [after](screenshots/chromium-after-schedule-ipad.png) |
| Recruiting builder | [before](screenshots/chromium-before-recruiting-builder-ipad.png) | [after](screenshots/chromium-after-recruiting-builder-ipad.png) |
| SIEM athlete cues | [before](screenshots/webkit-before-siem-family-ipad.png) | [after](screenshots/webkit-after-siem-family-ipad.png) |
| LockedIn | [before](screenshots/chromium-before-lockedin-ipad.png) | [interactive workflow](screenshots/chromium-after-lockedin-workflow-ipad.png) |
| Reviewed news retained | [before](screenshots/chromium-before-feed-ipad.png) | [after](screenshots/chromium-after-feed-ipad.png) |

[Discoverable SIEM tour](screenshots/webkit-after-siem-tour-ipad.png). Browser versions and viewport metadata accompany the screenshots. No known failing application regression remains in the completed suites; the pilot/production gates listed above remain unresolved.
