# AP final stabilization — release-candidate acceptance

Branch: `codex/ap-qa-20261112`. Starting HEAD: `59416845eac1c66468f14f2a062ff534cb6d47d9`, the validated successor to reported `eca2d25`. The release commit containing this report is the candidate; obtain its SHA with `git log -1 --format=%H -- docs/qa-20261112/release-candidate/ACCEPTANCE.md`.

## Reconciliation and focused changes

The working tree was clean. AGENTS.md, the complete Product North Star, latest [source review](../source-reference/REVIEW.md), source manifest and validation reports were reviewed. Existing AP work was retained on its current development branch. Main and the older conformance branch were not substituted.

| Existing versus required | Finding and action |
| --- | --- |
| Independent Profile, SIEM, LockedIn, Recruiting | Functional separation already exists. Corrected stale three-pillar copy in local SIEM setup, Offerings/About and charter §3 under the user's explicit four-pillar release decision. Existing Business Automation remains an existing service, not a fifth pillar. |
| Shared athlete identity and event references | Existing profile IDs, local family projection, recurring occurrence IDs, game records and event media already work together. Added a parent-first browser regression rather than another model or workflow. |
| SC hierarchy and AP identity | Re-fetched seven actual SC components read-only at import `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`; hashes match the pinned manifest. Cover/avatar/actions, My Athletes, View Athlete, identity/privacy, grouped cards and five tactical tabs are already present. No aesthetic correction justified. |
| Content boundaries and approval | All 40 candidates and existing 19 approvals retained exactly. No new source, activation, connector, publisher video or automatic subscription. |
| Previously accepted calendar/directories | No implementation changes. Existing tests rerun, including directory coverage and family calendar filters. |

Changed application files are only `src/release-views.mjs` and `src/siem-view.mjs` (copy). `docs/PRODUCT-NORTH-STAR.md` records the explicit updated decision. `scripts/qa-release-candidate.py` and two npm commands add release checks. Four historical test files retain their original preservation assertions through exact, enumerated approved text transformations; no tests were removed, skipped or broadly exempted. All binary assets remain byte-preserved. See [changed files](CHANGED-FILES.txt), [content/frozen-file hashes](CONTENT-STATUS.json) and [read-only SC reference](SC-REFERENCE.json).

## Final validation

All final suites below ran against the restarted current build. Counts are test executions; inherited cases repeat across suites. No skipped or cancelled Node tests.

| Suite | Passed | Failed | Evidence |
| --- | ---: | ---: | --- |
| check | 218 | 0 | [log](check.log) |
| test | 218 | 0 | [log](test.log) |
| rc-chromium | 2 | 0 | [log](rc-chromium.log) |
| acceptance-chromium | 12 | 0 | [log](acceptance-chromium.log) |
| profile-chromium | 8 | 0 | [log](profile-chromium.log) |
| conformance-chromium | 12 | 0 | [log](conformance-chromium.log) |
| siem-family-chromium | 18 | 0 | [log](siem-family-chromium.log) |
| release-chromium | 20 | 0 | [log](release-chromium.log) |
| siem-platform-chromium | 7 | 0 | [log](siem-platform-chromium.log) |
| siem-refinement-chromium | 12 | 0 | [log](siem-refinement-chromium.log) |
| acquisition-chromium | 23 | 0 | [log](acquisition-chromium.log) |
| rc-webkit | 2 | 0 | [log](rc-webkit.log) |
| acceptance-webkit | 12 | 0 | [log](acceptance-webkit.log) |
| profile-webkit | 8 | 0 | [log](profile-webkit.log) |
| conformance-webkit | 12 | 0 | [log](conformance-webkit.log) |
| siem-webkit | 5 | 0 | [log](siem-webkit.log) |

Chromium: **114/114** browser executions. WebKit: **39/39**. Both `npm run check` and the separate `npm test` pass all **218** existing automated tests. WebKit is the actual Playwright WebKit/WPE engine, not a Chromium user-agent substitution. Desktop1440×900, iPad810×1080 (additional orientation/768px cases in existing suites) and iPhone390×844 are emulated viewports, not physical devices.

Initial attempts exposed test-harness issues: binary fixtures must bypass text normalization; a hidden card, projected family records and arrow-suffixed accessible link names require the correct existing UI selectors; the new copy assertion needed a refreshed server and hidden-heading lookup. These were corrected without changing functional models or weakening existing application checks. Earlier `*-FAILED.log` files are retained and excluded from the final pass totals. The final runs have zero failures.

## Current screenshots and preview paths

| View | Chromium | WebKit |
| --- | --- | --- |
| iPad parent, 810×1080 viewport | [screenshot](screenshots/chromium-ipad-parent-viewport.png) | [screenshot](screenshots/webkit-ipad-parent-viewport.png) |
| iPad athlete, 810×1080 viewport | [screenshot](screenshots/chromium-ipad-athlete-viewport.png) | [screenshot](screenshots/webkit-ipad-athlete-viewport.png) |
| Parent-first journey, full parent page | [screenshot](screenshots/chromium-ipad-parent-full.png) | [screenshot](screenshots/webkit-ipad-parent-full.png) |
| Parent-first journey, full athlete page | [screenshot](screenshots/chromium-ipad-athlete-full.png) | [screenshot](screenshots/webkit-ipad-athlete-full.png) |
| Desktop parent | [screenshot](screenshots/chromium-desktop-parent.png) | [screenshot](screenshots/webkit-desktop-parent.png) |
| iPhone athlete | [screenshot](screenshots/chromium-iphone-athlete.png) | [screenshot](screenshots/webkit-iphone-athlete.png) |

Full-page images retain the stated viewport width and extend vertically. All pictured people/data are synthetic fixtures. Additional WebKit evidence: [Schedule](screenshots/webkit-ipad-schedule.png), [Stats](screenshots/webkit-ipad-stats.png), [Media](screenshots/webkit-ipad-media.png), [My Feed](screenshots/webkit-ipad-feed.png), [Development](screenshots/webkit-ipad-development-volleyball.png), [Recruiting](screenshots/webkit-ipad-recruiting.png), [local family calendar](screenshots/webkit-ipad-calendar.png), [Rivera SIEM](screenshots/webkit-rivera-ipad.png). Playback telemetry: [Chromium](chromium-video-playback.json), [WebKit](webkit-video-playback.json). Stable synthetic IDs: [Chromium journey](chromium-journey.json), [WebKit journey](webkit-journey.json).

Run `npm start`; open `/my-pathway?view=family`, `/build?new=1`, `/my-pathway`, `/my-ap?scenario=local&section=calendar` or `/my-ap?scenario=family&section=messages`. Profile sections use `#schedules`, `#stats`, `#profile-media`, `#my-feed`, `#camps`; optional research is `/recruiting`. `npm run test:rc:browser` repeats the fresh parent-first workflow. Use `WEBKIT_PATH=/workspace/scratch/webkit-local.sh npm run test:rc:webkit` in this environment, or the installed Playwright WebKit launcher in another workspace. Screenshots do not seed persistent user data.

## Pillar and complete-journey evidence

| Check | Result covered by browser regressions |
| --- | --- |
| Profile without Recruiting | Parent local record → Add athlete → Lacrosse → existing catalog club → position → Save → visible profile. Recruiting remains off through event, stats, photo, content selection and club saving. |
| SIEM without detailed Profile | Separate fresh context creates a lightweight Swimming participant and practice in local SIEM with zero AP sports profiles; Recruiting and LockedIn permissions stay off. Independent recruiting research opens without creating a profile. |
| Independent optional Recruiting | Explicit opt-in reuses the same athlete, tournament, statistics and approved selections. Age16+/parent/rules-review gates tested; parent approval required. Local preview and revocation work. No coach link or outreach is sent. |
| LockedIn unavailable | Coming Soon remains visible. Profile, local events, calendar, media and research work with LockedIn off. |
| Module off preserves data | Recruiting, Saved and Teams toggled off; identity, saved club, plans, records, subscriptions, recruiting notes and IndexedDB media retained through reload. Existing suites also cover legacy publisher preferences when My Feed is disabled. |
| Parent-first complete journey | Recurring practice → move one occurrence without changing series ID → tournament → Log stats using its event reference → event-linked photo → family calendar → selected My Feed and Development items → save club → optional preview. One athlete ID, one parent ID, two stored plans, no duplicate entry. |
| Media, isolation and persistence | Existing photo/video upload and playback, caption/event references, reload, second-athlete isolation, record upsert, stale asynchronous response boundaries and browser-local migrations rerun. |
| SIEM demo and accessibility | Rivera actions/conflicts/filters, provider labels, timestamps, source evidence and Slack local draft-only reply behavior retained. Keyboard, focus, mobile overflow and responsive checks included. |

Machine-readable journey evidence records synthetic IDs and zero external writes. Parent management is a browser-local preference; these checks do not certify authentication, guardian identity, secure multiuser permissions or cross-device persistence.

## Content status

Counts refer to retained individual approvals from the dated November12 review, not live connectors or blanket approval of a publisher/channel. Following is opt-in for each athlete; a new profile follows zero sources.

| Sport | Candidates | Approved news | Approved development | Inactive | Approved written items |
| --- | ---: | ---: | ---: | ---: | ---: |
| Basketball | 10 | 3 | 1 | 6 | 4 |
| Volleyball | 10 | 3 | 2 | 5 | 6 |
| Lacrosse | 10 | 3 | 1 | 6 | 5 |
| Swimming | 10 | 5 | 1 | 4 | 6 |
| Total | 40 | 14 | 5 | 21 | 21 |

**19 verified approved sources, 21 inactive sources, zero approved publisher videos, zero live feed connections.** Twenty development-source candidates lack video approval: five have specific written guides approved, fifteen remain wholly inactive. There is no enumerated individual-video queue, so no invented video-item count. The prior approvals expire December12, 2026; runtime checks fail closed on expiration. News, instructional guides and family-uploaded files stay separate and sport-filtered. No link reapproval or new data acquisition was performed under the feature freeze. The [complete status inventory](CONTENT-STATUS.json) retains every inactive reason and approval expiry.

## Functional reference and remaining differences

The imported SC source establishes the functional hierarchy; it does not prove its production runtime. AP keeps the approved six parent destinations (Players, Recruiting, Network/Messaging, Discover, Calendar, Saved), five athlete tabs (Profile, Schedule, Stats, Media, Recruiting), separate My Feed/Development and AP's interlocked logo, collegiate styling and imagery. The richer SC parent menu is intentionally consolidated, not copied wholesale.

SC source includes authenticated parent access, server media assignments/collections, parent connection requests and RSS/YouTube content integrations. AP uses existing browser-local records/media, reports parent connections unavailable, and offers only reviewed written content snapshots. No SC backend, wizard, auth or infrastructure was imported. Original November11 screenshots were not exposed in this workspace; the older source-rendered fixture was not used as the definitive comparison. Pixel equivalence to the original screenshots and physical iPad/iPhone Safari remain acceptance gates.

## Pilot and production gates

1. User acceptance of the current candidate on physical target devices; original screenshot comparison when accessible. Browser emulation is not a device certification.
2. Production authentication, verified guardian relationships, access enforcement, backup and cross-device persistence are absent. Browser-local family creation is not account registration. Local storage/IndexedDB clearing loses local information.
3. Live provider connections, email retrieval, Slack OAuth/workspace approval and real replies are absent. SIEM provider messages and actions remain clearly labeled demonstrations; local Slack drafts send nothing.
4. Hosted private uploads, server access controls, shared file assignments and collections are unimplemented. Existing local photo/video playback works within documented browser limits.
5. Secure coach sharing/outreach/revocation and sport/class-year/division-specific NCAA/high-school review require separate authorization and validation. AP age16 is product policy, not contact permission. Preview approval sends nothing.
6. Parent-to-parent connections are unimplemented. Network placement/status and the separate demonstration Messages action work; no connection grants guardian access.
7. Video/resource licensing, individual youth-content approval, accessibility and review renewal remain content gates. Directory live completeness/registration verification remains a separate data-quality gate; no registration dates or records were invented.
8. LockedIn remains Coming Soon. Identity verification, documents and payments are absent and intentionally do not block the other pillars.

No newly confirmed functional application defect remains from this stabilization pass. This is a browser-local demonstration candidate for user acceptance; the gates above prevent representing it as a production service.

## Final acceptance checklist

- [ ] Review the final commit and test matrix, then open the parent and athlete screenshots.
- [ ] Repeat the synthetic family journey on the intended physical iPad/iPhone and desktop.
- [ ] Confirm the four independent pillars, optional recruiting and retained records when tools are hidden.
- [ ] Confirm demonstration/source labels and accept the explicit pilot exclusions above.
- [ ] Authorize any subsequent merge, remote push, deployment or publication separately.

No merge, push, deployment, publication or Soccer Center change was performed.
