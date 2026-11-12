# Arena Pathway — AP-QA-20261112 review

Development branch: `codex/ap-qa-20261112`, based directly on validated `codex/final-ux-conformance` commit `6f7f5493798665c28d2b566215476906c63ebecb`. This is a local review change, with no merge, push, publication, deployment or Soccer Center modification.

[Existing-versus-required audit and source provenance](GAP-MAP.md) · [Changed files](CHANGED-FILES.txt) · [Validation logs](logs/)

## Implemented and integrated

- Existing parent cover/avatar, My Athletes/View Athlete journey and AP branding retained. Four-sport club/team suggestions come from the existing catalog; free text is explicitly Add Your Own, with no fabricated membership. About My Sport, positions/goals and optional parent-entered age are editable after creation. Existing identity, participation and profile editing remain intact. Upcoming Events and the tryout on/off choice reuse existing sourced records, with no inferred registration availability.
- Schedule supports single events and bounded weekly recurrence, selectable weekdays, 1–4-week intervals, practice/game/meet/tournament/camp/travel/other categories, optional Denver times, multi-day dates, series editing/deletion and occurrence editing/skipping. A moved occurrence retains its original reference. Recurrence is expanded for display/export and never materialized in storage. Invalid legacy entries are ignored for rendering without a migration. DST gaps and rollover dates are rejected.
- Existing ICS export now preserves single-plan UIDs and emits distinct recurring-occurrence UIDs, with timed UTC or exclusive-end all-day entries. Import previews expanded UTC/all-day snapshots before adding, skips known UIDs, and refuses ambiguous provider timezone/recurrence instructions. This is snapshot interoperability, not live calendar synchronization or a general provider RRULE importer.
- **My AP → My family · this browser** reads the same athlete IDs, plans, saved published dates and existing local SIEM events. No second event store, athlete record or manual re-entry. Existing day/week/month UI is reused; seven named categories have distinct, consistent border colors and labels. Multi-day commitments appear on each covered date without duplicating source records. Rivera remains the default fictional demonstration.
- Stats/Game/Meet Records store parent-entered sport metrics and achievements against event references. Saving again updates the same event record; removed events retain their historical result. Swimming times and places are listed per record rather than summed across unrelated swims. No official results or inferred performance claims.
- Media is an athlete-owned browser-local IndexedDB photo/video library, with optional existing-event references, captions, editing and deletion. JPEG/PNG/WebP and MP4/WebM/MOV are accepted subject to browser codec support, 25 MB/item and 50 items/athlete. Portable byte storage fixes the tested WebKit blob-storage failure. Both engines load and play the synthetic H.264 MP4 test fixture. Blob URLs are released on rerender. No cloud upload, backup or cross-device persistence.
- My Feed is distinct from family Media and Development. The existing `media` module ID and publisher preferences are retained for compatibility, with the visible label My Feed. Forty supplied source candidates have independent per-athlete, per-sport news/development opt-in preferences. **All 40 remain inactive candidates**; interest selection does not activate or verify a source. Existing opted-in publisher links and camps continue working.
- Parent Network is placed in the existing family profile and links to My AP messages. Existing source/provider/timestamp/preview/priority/evidence/task behavior is retained. Slack demonstration messages now support editable, tab-local reply drafts; no POST, OAuth, workspace connection or delivery claim.
- Recruiting remains independent. Local previews reuse selected identity fields, schedule, records, achievements and selected media references. Parent management, a current parent-entered age16+ review and sport-specific rules-review acknowledgment gate the optional preview. Parent approval and local revocation are explicit. The age16 threshold is AP policy, not permission to contact coaches. No production access controls, secure coach link, invitations or recruiting communications exist.
- LockedIn remains visible as a strategic pillar, with Coming Soon for live verification, payments and secure onboarding; existing SIEM simulation is status-only.

## Actual package findings resolved

| Supplied identifier | Outcome |
|---|---|
| **S2** | Integrated schedule recurrence/categories/editing/deletion/filtering/export and shared family projection; original five tests retained and passing. |
| **M2/M3** | All 40 candidate names exposed as user-controlled news/development preferences. **Content approval/activation remains blocked**, not represented as complete. |
| **P0** | Club search/custom entry, stable parent/athlete identity, recurrence editing and ICS preview implemented. Exact SC18/November11 visual acceptance remains unverified. |
| **P1** | Athlete-owned image/video storage and event-linked records implemented; Media/My Feed/Development separated. Active approved free instructional content remains a data-review gap. |
| **P2** | Local family visibility, seven-category filters, source-attributed demos, Slack draft-only reply and parent Network placement implemented; Rivera regression suite passes. |
| **P3** | Local parent-controlled preview, approval, visibility and revocation implemented. **Secure external sharing and current sport-specific rules validation remain incomplete.** |
| **P4** | Coming Soon explicitly identifies unavailable LockedIn live capabilities; no fake verification. |

These are the actual labels in the supplied README, not invented QA finding numbers. There was no separate comprehensive numbered November12 finding sheet in the ZIP. The user's Steps2–7 correspond to the feature/status rows above.

## Validation

Node `v24.22.1`, npm `11.9.0`. See the exact commands and outputs in `logs/`. `npm run check` includes syntax checks for all new browser modules, original data/participation/discovery checks and the complete Node suite. Existing historical byte-freeze assertions were narrowly updated for the authorized additive category/model/UI changes, source endpoint and blob-only CSP permissions. Original data, directory rendering, engine, brand, Rivera/generic fixtures and underlying SIEM domain remain protected. Older browser assertions now target the approved preferences route and the expanded eight-section/seven-color UI; no behavior tests were removed.

| Check | Result |
|---|---|
| Original extracted ZIP tests | 5 passed, 0 failed |
| Adapted package utility tests | 5 passed, 0 failed; also included below |
| `npm run check` | PASS, including 213 Node tests, 0 failures |
| Explicit `npm test` | 213 passed, 0 failed |
| New remediation browser suite | Chromium 7/7; WebKit 7/7 |
| Existing profile visual/navigation suite | Chromium 8/8; WebKit 8/8 |
| Legacy athlete workspace | 10/10 |
| Conformance / My AP / directory regression | Chromium 12/12; WebKit 12/12 |
| SIEM platform | 7/7 |
| SIEM refinement | 12/12 |
| Rivera family SIEM | 18/18 |
| SIEM WebKit startup / roles / privacy | 5/5 |
| Release / unified directory / workspace suite | 20/20 |

Browser totals are 126 test executions, including inherited tests repeated by broader suites. Chromium and actual WebKit/WPE were used. The WebKit launcher was `/workspace/scratch/webkit-local.sh` (official Playwright WebKit build2336 with local runtime libraries); it is an environment path, not an application dependency. Tests cover desktop1440×900, iPad810×1080 (plus existing768×1024/1080×810 checks), and iPhone390×844 layouts. These are automated viewport/browser checks, **not physical iPad/iPhone Safari acceptance**.

The new suite exercises create/edit/navigation, recurrence overrides/skips and stable export UID, read-only parent projection, all seven categories, deletion, import preview/deduplication, event-linked records, PNG/video persistence and athlete isolation, independent candidate preferences, tryout control, parent preview/revocation, and Slack draft persistence with no external writes. Browser errors are asserted absent. Initial test failures exposed WebKit blob-storage and repeated registry-fetch/navigation problems; both were fixed and final reruns pass.

## Evidence and preview paths

Run `npm start` in this review checkout. Use `/build`, `/my-pathway`, `/my-pathway?view=family`, `/my-pathway#schedules`, `/my-pathway#stats`, `/my-pathway#profile-media`, `/my-pathway#my-feed`, `/my-pathway#camps`, `/recruiting`, `/my-ap?scenario=local&section=calendar`, and `/my-ap?scenario=family&section=messages`. Athlete-dependent paths use the existing selected local athlete; no demo/profile identity is silently copied into storage.

- [AP athlete iPad viewport](screenshots/ap-athlete-ipad-viewport.png), [AP parent iPad viewport](screenshots/ap-parent-ipad-viewport.png)
- [Media on iPad](screenshots/webkit-ipad-media.png), [local calendar on iPad](screenshots/webkit-ipad-local-calendar.png), [iPhone profile](screenshots/webkit-iphone-athlete.png), [desktop profile](screenshots/chromium-desktop-athlete.png)
- [Athlete side-by-side](athlete-comparison.html) / [image](screenshots/athlete-comparison.png)
- [Parent side-by-side](parent-comparison.html) / [image](screenshots/parent-comparison.png)

The comparison's left side reuses the previously captured, clearly labeled **source-rendered Soccer Center fixture**, not a live portal screenshot. The right side is the actual AP application in WebKit. Soccer Center read-only source commit `11de067` was inspected; no exact SC18 archive or original November11 user screenshots were supplied. Pixel/exact-version acceptance remains open. To open comparison HTML reliably, serve `docs/` locally, for example `python -m http.server 4021 --bind 127.0.0.1 --directory docs`, then visit `/qa-20261112/athlete-comparison.html` on that local server.

## Remaining demo versus pilot gates

1. **Content:** The registry is an inventory/preferences UI, not an active news feed or approved instructional library. Four official sport landing pages were probed; a 200 landing page does not prove a named video/source is currently free. Two recruiting links redirected to the NCAA homepage; the current NCAA recruiting resource was then found and inspected. CHSAA handbook and one lacrosse development path were inaccessible. [Access evidence](source-access-review.json) records outcomes without activating anything. All 40 candidates still need individual content/free-access/licensing approval.
2. **Recruiting:** The current general NCAA resource is linked, but current basketball/volleyball/lacrosse/swimming contact calendars, division/gender/class-year conditions and applicable high-school rules have **not been independently resolved into a rules engine or permission decision**. Parent acknowledgment is not legal validation. Coach sharing, invitations, communications, authenticated parent consent and externally enforceable revocation remain unimplemented. Local preview approval/revocation is not a security boundary.
3. **Connectivity:** Provider messages are fictional, Slack replies are drafts only, calendar imports are local snapshots, refresh redraws locally, and LockedIn live services are Coming Soon. Real integrations require appropriate authorization. There is no production authentication, secure cross-device persistence, provider synchronization or hosted media service.
4. **Calendar scope:** Weekly recurrence is supported, not arbitrary recurrence rules. Unsupported imported RRULE/TZID instructions are rejected rather than guessed. Ambiguous/sub-minute UTC-to-Denver imports are refused if they cannot round-trip exactly. Deleted events retain separately entered media/stat references as historical records; deleting a profile does not perform a destructive media-library sweep. Browser storage can be cleared or reach quota; this is not durable account storage. Codec support beyond the tested PNG/H.264 fixture requires device acceptance.
5. **Reference/device acceptance:** Exact SC18/export and original November11 visual comparison plus hands-on iPad/iPhone approval remain outstanding.

## Final acceptance checklist

- [ ] Parent creates an athlete from four sports, selects/searches or types a club/team, saves directly to the profile, edits without onboarding, then follows My Athletes/View Athlete with the same ID.
- [ ] Add a Monday/Wednesday recurring practice and game/meet/tournament/camp/travel; move/skip one occurrence, edit/delete a series, filter categories, export and reimport a snapshot without duplicate UIDs.
- [ ] Verify that the same events, including multi-day travel, appear on the browser-local family calendar with athlete/category filters; confirm the Rivera demonstration remains separate and labeled.
- [ ] Enter sport records/achievements, attach a photo and supported video to the existing event, reload, switch athletes and confirm isolation.
- [ ] Keep My Feed/Development choices independent from Media; recognize candidate sources as inactive and select no unapproved content for a pilot claim.
- [ ] Save a club without Recruiting; independently open Recruiting, review age/rules and selected fields, parent-approve a local preview and revoke it; verify nothing is transmitted.
- [ ] Review attributed demo messages and Slack local drafts, then verify no delivery/connection claim and LockedIn Coming Soon.
- [ ] Complete hands-on iPad/iPhone and exact SC reference acceptance; approve the unresolved content/rules/integration gates separately before any pilot claims or production release.

The automated regression evidence supports preservation of existing covered functionality, original records, fixtures, directories and branding. It does not certify unavailable external services or unsupplied visual references. Stop here for review; merge/deployment/publication require explicit authorization.
