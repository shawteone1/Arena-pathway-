# Completed user journeys — actual browsers

Fresh, disposable fictional browser contexts; no production identity or imported real family data. `scripts/qa-final-20261116.py` adds seven cases. Case BCD repeats the complete schedule/stats/media/recruiting lifecycle for **all four sports**, not four separate recruiting implementations. Existing suites supply guided onboarding, exports/imports, provider isolation and asset-failure coverage. Counts and failed attempts are in RESULTS.json, not inflated by subtests or retries.

## Results by gate

| Journey | Functional | Visual/product, scoped internal demo | Persistence | Source verification |
|---|---|---|---|---|
| A Club selection/attachment | PASS | PASS; source facts shown, unknown enrichment disclosed | PASS correct existing athlete/org IDs after family navigation/reload | PASS reviewed directory IDs/links; missing About Us/logo rights BLOCKED |
| B Athlete/scheduling | PASS | PASS calendar/actions; no unnecessary one-time end-date field | PASS five exact occurrences; same series/athlete IDs after edit/reload | PASS existing recurrence contract and SC schedule source; no live provider claimed |
| C Statistics/media | PASS | PASS summary/gallery before forms; selected video plays | PASS historical uploads and another athlete remain intact | PASS competition-only adapter and unchanged source contracts; all uploaded samples fictional |
| D Recruiting, mandatory gate | PASS | PASS completed owner card; SC demo comparison available | PASS build/reopen/edit/approval/revoke after reload in four sports | PASS current SC source hashes/demo render; authenticated production parity BLOCKED |
| E SIEM/LockedIn | PASS | PASS consistent setup/dashboard/tour and athlete colors | PASS local athlete reference; Rivera remains isolated | PASS fixed no-data SC URL, current public demo HTTP200; providers simulated |
| F Sport content | PASS | PASS image/editorial cards and intentional public fallbacks | PASS source choices across reload | PASS approval boundary/snapshot labels; live activation and publisher imagery BLOCKED |

These are recorded product assessments of the linked rendered screens and interactions, not certification that all authenticated SC pages or physical iPads were tested.

## A — Select, save and return to My Club

Sport Lacrosse → Youth Clubs → search a real existing reviewed club → scrollable results → organization details → choose existing athlete → **Save as My Club** confirmation → View athlete and My Club → parent Players cards → View Athlete → reload. The org ID and original athlete ID match; no Recruiting module is enabled. A second existing case starts discovery with no athlete, carries the pending club into creation, saves once and confirms ownership after reload. Team/season/registration facts remain unknown where unverified; parent-entered teams are not verified directory entries.

Evidence: [search](after/chromium-club-search-ipad-portrait.png), [detail/save confirmation](after/chromium-club-detail-ipad-portrait.png), [parent context](after/chromium-parent-profile-ipad-portrait.png), [guided club menu](after/regression/chromium-club-search-onboarding.png). Both engines execute final A; product-completion 01/07 and recovery 03 also exercise creation/manual fallback. Nov15 cases combine region, age and program filters; one Location selector, All ages/All programs defaults and explicit unknown classifications remain.

## B — Athlete, practices, competition and family continuity

Guided creation remains covered separately in all four sports. With each fresh athlete, create Mon/Wed practices from **Nov16 through Nov30**. Exactly **16,18,23,25,30** appear, once each. Create two one-time games for Lacrosse/Basketball; Swimming/Volleyball create one meet/tournament with two independently identified races/matches. No mandatory one-time end time is supplied. Exercise day/week/month/list views, edit the practice location, reload and verify unchanged series/athlete IDs. In family Week Nov16 there are four projected activities: two practices and two competitive appearances; no Rivera record enters the real local calendar.

Evidence: [athlete schedule](after/chromium-athlete-schedule-ipad-portrait.png), [recurring form](after/regression/chromium-recurring-builder.png), [one-time competition](after/regression/chromium-one-time-game.png), [family projection](after/chromium-family-calendar-ipad-portrait.png). Exact IDs/dates in [Chromium](chromium-journey-D.json) / [WebKit](webkit-journey-D.json). Nov15 suite verifies `[1,0,1,0,0,0,0]` week distribution, stable occurrence refs and a five-VEVENT ICS export; historical exceptions/spans are not silently rewritten. Nov12 covers reviewed ICS import/deduplication. A live authenticated subscription remains unconnected.

## C — Multiple records, season summary and selected competition video

Two competitive records produce Lacrosse Goals **5**, Basketball Points **20**, Volleyball Kills **12**. Swimming records **80s and70s** as two swims; the UI does not sum them into150s. The standard Stats and Media pickers each contain only the two eligible competitions plus their blank option. Upload `test/fixtures/qa-family-video.mp4`, caption it, associate the first competition, then separately upload an unselected private photo. Gallery appears before the upload editor. Recruiting resolves the same selected video ID/blob and explicitly plays it; the unselected photo/honour do not appear.

Evidence: [summary](after/chromium-stats-ipad-portrait.png), [gallery](after/chromium-media-gallery-ipad-portrait.png), [finished card](after/chromium-lacrosse-finished-card-ipad-portrait.png). Final C intentionally seeds a **fictional historical practice-linked upload** to test backward compatibility; it remains attached/editable. A second athlete cannot see it. Consolidated 08 verifies caption edits, deletion and event isolation. No historical media or event IDs are reassigned.

## D — Exact mandatory recruiting sequence

Executed in Lacrosse, Basketball, Volleyball and Swimming, Chromium and WebKit:

1. Open the existing fresh athlete; review parent-entered age16 and the existing sport-rules acknowledgment. This is AP product eligibility, not NCAA contact permission.
2. Save a reviewed same-sport college/program in Stage1. No coach contacts are inferred.
3. Enter high school, graduation2028, About Me, two fictional personal achievements, academic interests, major and GPA3.8/4 in the dedicated editor. Existing name/sport/club/photo remain prefilled from the same athlete.
4. **Save athlete information**; see the saved summary. Choose information for my profile closes editing and focuses the existing selection heading.
5. Choose fields, one personal honour, two competition records, one competition appearance and only the video. Private honour/photo and all practices stay out.
6. Measure each native checkbox selection: maximum viewport delta **0px** in the recorded final four-sport runs; original controls stay connected. Separate keyboard and touch cases verify focus/actual emulated touch input. Intentional step transitions may scroll to their heading.
7. **Build My Recruiting Profile**; store completion metadata in the existing recruiting record and render the existing professional card. An empty composition cannot produce a false completed card/approval.
8. Review identity, school/academics, honours, selected records, appearances and highlight. Open the selected highlight and verify playback.
9. Navigate through the SIEM pillar.
10. Return through Recruiting; **View saved recruiting profile** is immediately available.
11. Reopen and reload: same composition/card and build marker retained.
12. Edit About Me, save, reselect/continue and rebuild: revised card displayed.
13. Parent approve local preview; reload/reopen shows approval. Revoke locally.
14. Reload: approval remains revoked; saved school and original athlete IDs remain. No external coach link or message exists.

Evidence: [saved information](after/chromium-recruiting-information-ipad-portrait.png), [composition](after/chromium-parent-composition-ipad-portrait.png), [finished card](after/chromium-lacrosse-finished-card-ipad-portrait.png), [reopened](after/chromium-reopened-card-ipad-portrait.png), [edited/rebuilt](after/webkit-rebuilt-card-ipad-portrait.png), [approved](after/webkit-approved-card-ipad-portrait.png). All four sport cards have desktop, portrait/landscape iPad and phone captures under after/. Machine-readable proof includes actual athlete/series/event/record/school IDs, video playback and revocation in the two journey-D JSONs.

Completion is an owner-only projection from existing saved fields/IDs/media, not a second athlete database or an immutable externally shared snapshot. Edits continue to invalidate local approval through the preserved revision rules.

## E — SIEM and LockedIn

SIEM entry → Set Up My Family → local parent/participant setup → associate existing athlete → Open family calendar → correct originating athlete → return. Existing records remain separate from the fictional Rivera tour. Final E/BCD, qualification and SIEM suites exercise these paths, stable blue/purple/green IDs, activity categories, messages/actions and local-only reply controls.

Evidence: [setup](after/chromium-family-setup-ipad.png), [entry](after/chromium-siem-entry-ipad-portrait.png), [tour](after/chromium-siem-tour-ipad-portrait.png), [messages](after/chromium-siem-messages-ipad-portrait.png), [calendar](after/chromium-family-calendar-ipad-portrait.png). LockedIn opens exactly `https://soccercenter.org/locked-in/index.html`, `_blank`, `noopener noreferrer`, with no athlete query string. Actual SC demo returns200 and remains unchanged ([capture](sc/screenshots/sc-current-lockedin.png)). No verification/payment/document operation is implemented in AP.

## F — Sport content and publisher return

Each public sport page has headline/publisher/date/summary and a deliberate sport-specific typography cover; reviewed dates are preserved. Athlete My Feed retains user-selected source chips, a featured photo and two-column editorial cards at suitable widths. All illustrations are explicitly **not article imagery**, with credits. A loaded photo suppresses the duplicate typography cover; a forced404 restores a readable fallback. No source becomes active by viewing a page. Development and family uploads remain separate.

Original publisher links were actually opened and AP retained after closing the publisher tab: **four of four document responses200 in each engine**, recorded in [Chromium](after/chromium-publisher-navigation.json) / [WebKit](after/webkit-publisher-navigation.json). This verifies link reachability, not republication rights or complete article re-auditing.

Evidence: [My Feed iPad](after/rss/chromium-lacrosse-ipad.png), [landscape](after/rss/chromium-lacrosse-ipad-landscape.png), [phone](after/rss/chromium-lacrosse-iphone.png), and four-sport public news captures `after/*-public-news-*`. Current catalog is19 approved/21 inactive reviewed candidates; supplemental RSS11 retained/0 enabled. The inactive controls are not a live integration failure.

## Device and failure boundaries

Browser viewport checks: desktop1440×900, iPad portrait810×1080, iPad landscape1024×768, phone390×844. A separate mobile/touch context records `pointerType=touch`. These are real browser-engine tests with emulated viewports, **not physical Safari/iPad certification**. Strict page-error and unexpected-main-page-write assertions remain; no forced checkbox clicks, retries hidden inside assertions or removed tests.

Initial harness failures/intermittent diagnostics are retained in REPORT.md/logs. Fresh/repeat homepage asset checks, forced CSS/module/photo failure and Retry/Reload preserve saved records. No new asset or recurrence fix was invented where the existing implementation already passed.
