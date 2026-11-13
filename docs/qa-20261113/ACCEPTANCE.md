# Arena Pathway — consolidated corrective acceptance, November13

Baseline: `9733b608321529448be64981729e9e4bad5a76eb`. Branch: `codex/ap-qa-20261112`. The commit containing this report is the review candidate; use `git log -1 --format=%H -- docs/qa-20261113/ACCEPTANCE.md` to obtain its final SHA. No merge, push, deployment, publication or Soccer Center change is authorized or performed in this pass.

## Scope and reference

[Gap map](GAP-MAP.md) was prepared before implementation. AGENTS.md and the complete Product North Star were read. The working tree was clean at the validated baseline. SC main was rechecked and still points to import `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`. Actual player creation, schedule, editorial feed/source picker, recruiting, community, homepage and LockedIn components were inspected read-only; [source manifest](SC-REFERENCE.json).

The user's original iPad screenshots establish the visual acceptance direction: club-first onboarding, the optional calendar choice, content-first records/gallery, editorial news cards with publisher chips, and college gender/division filters. The older source-rendered fixture is not treated as definitive. AP keeps its existing interlocked logo, collegiate palette, typography, stadium imagery and static Node/ESM architecture. No SC backend, authentication system, live feed engine or application was copied.

## Findings addressed

| Finding | Implemented correction and limits |
| --- | --- |
| AP-01 | All four public sport pages now lead with sport information, participation links, reviewed news and development guides. Create Your Pathway is secondary. The same full searchable directory remains below; no teaser replaces the complete list. No catalog record, region filter or registration date changed. |
| AP-02 | Primary Add Athlete entry is now a six-stage guided presentation: club/search/manual → existing program/team or manual label → published/manual season → age/participation → athlete details/goals → optional schedule. It saves once through the existing form/store. Program/team are consolidated per the user's requested sequence; SC source has separate team/details stages before its optional calendar screen. Basic editing and an explicit Enter basics instead path remain available. SIEM requires no wizard. |
| AP-03 | Existing parent cover/avatar/actions, My Athletes and six parent destinations remain. The five tactical tabs and four separate resource links remain. Profile cards have closer spacing and a Game/Meet Records summary alongside About, Positions & Goals, Club & Team, Upcoming Events, Saved and tryout controls. Existing identities are edited rather than recreated. |
| AP-04 | Schedule displays records first, with Connect Calendar Feed, Build Schedule Manually, Add Game/Meet/Tournament, Add Recurring Practice and Review/Edit Schedule actions. Editors open on demand. Recurrence/occurrence IDs, editing/deletion, categories, ICS preview/deduplication/export and the existing parent projection are reused. Connect clearly states that live subscriptions are unconnected and offers the existing ICS snapshot path. Originating SIEM events link to the same athlete and highlighted event reference. |
| AP-05 | Stats totals/game records appear before Log Stats/Add Game controls and collapsed entry form. Media displays its actual athlete-owned photo/video gallery before Add Media. Per-item caption/event editing is disclosed on demand; editing updates visible and accessible captions, preserves media identity, and deletion remains scoped to the athlete. No uploaded files enter external news or Development. |
| AP-06 | My Feed now has two-column editorial cards, prominent linked headlines, publisher badges, source chips, Manage Sources, dated publication metadata where inspected, loading/error/retry/empty states and responsive layouts. Source management is secondary to content; subscriptions remain opt-in and athlete-specific. Eight of14 approved news items have inspected publication times; six remain explicitly unknown. **No image permission is established: no article images are displayed. Full image-based visual parity therefore remains a content-rights gate.** No live RSS/refresh claim is made; Retry reloads the reviewed snapshot. |
| AP-07 | Existing camps and individually approved free written guides remain accessible, with sport-specific skills/technique versus development-planning filters and Visit Resource links. No publisher video/channel is approved, so Watch Video is not fabricated and candidates remain inactive. This is a genuine remaining video-content gate. |
| AP-08 | Public Community and athlete links now present six categories using existing engine source IDs, scopes and review dates. Shared YMCA/RMR/CHSAA sources are grouped without creating organizations. Recreation links do not assert a sport at every location. Leagues are not mislabeled as governing associations. **No separate prepared AP Community registry was found in the available input/current tree or reachable Git history. Officials/safety categories, and some sport-association coverage, remain explicitly empty pending the actual reviewed registry/data.** The existing engine data is not overwritten. |
| AP-09 | Optional college discovery adds sport/state/Colorado-region/gender/division/institution filters and SC-style Coaches & Colleges, College ID Camps, Showcases & Tournaments, Saved Opportunities, Outreach Drafts and Build Profile sections. Only existing canonical program/team/opportunity facts are projected. NCAA/NAIA/NJCAA, collegiate club and unknown division remain distinct; unknown gender remains unknown. Filters survive saving. Current coverage is partial and Colorado-focused; empty divisions/events are reported as empty. Drafts are browser-local and require existing parent/age16+/rules-review gates; parent preview/approval/revocation reuse existing athlete data. No coach address, invitation or external transmission is invented. |
| AP-10 | Settings → Start guided tour is opt-in and covers all six requested areas, with Next/Back/Skip/Restart/Finish and focus return. It never starts automatically. ID-hashed athlete color cues appear on profile schedules, SIEM calendar/message/change/action cards, while names and activity-category labels remain. Technical source/permission metadata is expandable; provider DEMO labels remain visible. Modal/message spacing improves iPad readability. A first-screen phone regression from placing the tour in its own row was caught and fixed by using existing Settings. Rivera fixtures remain separate from browser-local profiles. |
| AP-11 | Open LockedIn Demo is available from AP's homepage, parent profile, SIEM settings/source status and relevant event detail. `/locked-in-demo` provides an AP-branded **non-operational preview**, based on the actual SC fictional parent→provider→parent approval→club hierarchy. NSID, Box, DocuSign and Fiserv are described as proposed handoffs, not active connections. No identity/card/document input, verification, signature, transfer or payment occurs. It does not reproduce the full interactive SC demonstration or block other pillars. |

## Data, identity and independence

All original data/engine/brand bytes and domain models are checked against9733b60. Additive changes are UI helpers and a separate article-publication metadata file; the original40 candidates and all approval records are unchanged. There is no destructive migration, new event store, duplicate family account or duplicated athlete entry.

The complete browser journey starts at the sport directory, uses primary guided Add Athlete, creates one recurring practice series and one tournament, records stats against the existing event, uploads event media, follows selected sport-specific news/guides, opens public Community, views the same references in local SIEM and returns to the originating event. It saves a college opportunity while Recruiting remains off and opens the independent LockedIn preview. Separate checks cover basic editing, occurrence editing, local drafts, parent preview/revocation and retention when Recruiting is hidden.

Profile works without Recruiting. Public Community, college research and LockedIn preview work with no athlete. SIEM accepts a lightweight participant without a detailed profile. Saving clubs, events and media never activates Recruiting. The existing acceptance suites retain cross-athlete isolation, source-response race handling, video playback, local storage/IndexedDB persistence, local Slack draft-only replies and Rivera action/filter behavior. Browser-local parent management is a preference, not verified guardian identity or production authorization.

## Final automated and browser validation

All218 existing automated cases still run; seven targeted cases bring the total to225. Historical UI freezes were narrowed only for the explicitly changed directory wrapper/SIEM renderer/additive routes; all original data, domain models, fixtures and branding now also have a complete baseline-byte preservation check. No test case was removed or skipped.

| Suite | Passed | Failed | Evidence |
| --- | ---: | ---: | --- |
| check | 225 | 0 | [log](logs/check.log) |
| test | 225 | 0 | [log](logs/test.log) |
| consolidated-chromium | 8 | 0 | [log](logs/consolidated-chromium.log) |
| acceptance-chromium | 12 | 0 | [log](logs/acceptance-chromium.log) |
| rc-chromium | 2 | 0 | [log](logs/rc-chromium.log) |
| profile-chromium | 8 | 0 | [log](logs/profile-chromium.log) |
| conformance-chromium | 12 | 0 | [log](logs/conformance-chromium.log) |
| siem-family-chromium | 18 | 0 | [log](logs/siem-family-chromium.log) |
| release-chromium | 20 | 0 | [log](logs/release-chromium.log) |
| siem-platform-chromium | 7 | 0 | [log](logs/siem-platform-chromium.log) |
| siem-refinement-chromium | 12 | 0 | [log](logs/siem-refinement-chromium.log) |
| acquisition-chromium | 23 | 0 | [log](logs/acquisition-chromium.log) |
| consolidated-webkit | 8 | 0 | [log](logs/consolidated-webkit.log) |
| acceptance-webkit | 12 | 0 | [log](logs/acceptance-webkit.log) |
| rc-webkit | 2 | 0 | [log](logs/rc-webkit.log) |
| profile-webkit | 8 | 0 | [log](logs/profile-webkit.log) |
| conformance-webkit | 12 | 0 | [log](logs/conformance-webkit.log) |
| siem-webkit | 5 | 0 | [log](logs/siem-webkit.log) |

Final totals: **npm run check225/225; separate npm test225/225; Chromium122/122; WebKit47/47**. Browser totals count executions because inherited cases repeat across suites. Chromium and actual WebKit/WPE were run; WebKit is not a Chromium user-agent substitution. Desktop1440×900, iPad810×1080 plus768px/landscape cases, and iPhone390×844 were exercised. Media playback telemetry, engine versions and complete synthetic journey states are retained alongside [machine-readable results](VALIDATION.json).

Initial browser attempts are retained in logs/initial-attempt and excluded from final totals. They identified the genuine phone-fold regression from tour placement, source DEMO label visibility, and selectors needing the new guided/disclosure actions. Gallery-save assertions now await the IndexedDB operation before reading the updated caption. A preview lifetime interruption invalidated one earlier run; final runs own their servers and completed normally. All final logs pass; screenshots were then regenerated with matched synthetic data. A final narrow content-heading cleanup was followed by both automated commands, both engines' full corrective and acceptance suites, and new matched captures.

## Before/after iPad evidence

These are actual AP captures from the exact9733b60 baseline on a separate local server and the current candidate, using the same synthetic athlete/event IDs, records, subscriptions and media. The viewport is810×1080; component crops and full-page images extend to their content height. No real family records, child photographs, provider account or external messages were used. The original SC screenshots supplied in the conversation are the hierarchy reference; no regenerated SC fixture stands in for them.

| Experience | Baseline | Corrected candidate |
| --- | --- | --- |
| Add Athlete | [before](screenshots/webkit-before-add-athlete.png) | [after](screenshots/webkit-after-add-athlete.png) |
| Parent workspace | [before](screenshots/webkit-before-parent.png) | [after](screenshots/webkit-after-parent.png) |
| Athlete profile | [before](screenshots/webkit-before-athlete.png) | [after](screenshots/webkit-after-athlete.png) |
| Schedule | [before](screenshots/webkit-before-schedule.png) | [after](screenshots/webkit-after-schedule.png) |
| Stats | [before](screenshots/webkit-before-stats.png) | [after](screenshots/webkit-after-stats.png) |
| Family Media | [before](screenshots/webkit-before-media.png) | [after](screenshots/webkit-after-media.png) |
| My Feed | [before](screenshots/webkit-before-my-feed.png) | [after](screenshots/webkit-after-my-feed.png) |
| Development | [before](screenshots/webkit-before-development.png) | [after](screenshots/webkit-after-development.png) |
| Optional Recruiting | [before](screenshots/webkit-before-recruiting.png) | [after](screenshots/webkit-after-recruiting.png) |
| Sport landing | [before](screenshots/webkit-before-sport-viewport.png) | [after](screenshots/webkit-after-sport-viewport.png) |
| Rivera calendar | [before](screenshots/webkit-before-siem-calendar.png) | [after](screenshots/webkit-after-siem-calendar.png) |

Additional evidence: [guided club step](screenshots/webkit-guided-club-ipad.png), [optional schedule step](screenshots/webkit-guided-schedule-ipad.png), [optional SIEM tour](screenshots/webkit-after-siem-tour.png), [public Community](screenshots/webkit-after-community.png), [LockedIn preview](screenshots/webkit-after-lockedin.png). Matching Chromium captures are in the same folder. Both engines retained13 lacrosse rows before and after; directory query/model bytes and all original records are preserved.

Playback telemetry: [Chromium](chromium-video-playback.json), [WebKit](webkit-video-playback.json). Synthetic journey state: [Chromium](chromium-journey.json), [WebKit](webkit-journey.json). [Complete changed-file list](CHANGED-FILES.txt).

Run `npm start`; then use `/sports/lacrosse` (or the other three sports), `/my-pathway?view=family`, `/build?new=1&guided=1`, `/my-pathway`, `/community`, `/recruiting`, `/my-ap?scenario=local&section=calendar`, `/my-ap?scenario=family`, and `/locked-in-demo`. In SIEM, open **Settings → Start guided tour**. The tour never starts automatically. Connect Calendar Feed honestly offers a snapshot import and reports live subscriptions unconnected. LockedIn is a read-only fictional preview.

Repeat the new journey with `npm run test:consolidated:browser`; for this QA environment use `WEBKIT_PATH=/workspace/scratch/webkit-local.sh npm run test:consolidated:webkit`. Other environments need their own compatible Playwright/WebKit installation; the scratch launcher is environment-specific.

## Content approval status

| Sport | Candidates | Approved news sources | Approved development sources | Inactive sources | Approved written items |
| --- | ---: | ---: | ---: | ---: | ---: |
| Basketball | 10 | 3 | 1 | 6 | 4 |
| Volleyball | 10 | 3 | 2 | 5 | 6 |
| Lacrosse | 10 | 3 | 1 | 6 | 5 |
| Swimming | 10 | 5 | 1 | 4 | 6 |
| Total | 40 | 14 | 5 | 21 | 21 |

**19 approved sources available for explicit selection;21 inactive;0 approved publisher videos;0 approved article images;0 live feed connections.** New profiles follow zero sources. Twenty development-source candidates lack video approval: five have specific written items approved, fifteen are entirely inactive. No enumerated individual-video queue exists, so an individual-video count is not invented. The original approval expiry remains December12,2026; inspecting publication metadata does not renew approvals. Expired sources fail closed.

Fourteen existing article URLs returned HTTP200 in the metadata review. Eight have reliable article publication timestamps; six remain unknown. Open Graph image candidates were observed but no reuse permission established; none is embedded or downloaded into AP. [Metadata review](ARTICLE-METADATA-REVIEW.json) retains URL/status/date/hash and image-permission decisions. A reviewed publisher does not imply approval of its other articles, paid courses, linked videos or advertisements.

## Remaining acceptance and pilot gates

1. Article-image permissions/assets are absent; SC's illustrated feed remains visually richer. The editorial layout supports an explicitly approved local image, but no generic/stolen/generated image substitutes for an article image. Pixel equivalence is not claimed.
2. Instructional videos/channels require individual free-access, youth-suitability and content approval. Current Development provides seven approved written guides plus existing sourced camps, not a verified video library.
3. The separately prepared Community registry is unavailable in the accessible source/input/history. No officials/safety associations or missing sport programs were invented to fill categories. Exact registry location or a reviewed data acquisition is needed to finish those entries.
4. College discovery is limited to existing reviewed Colorado records. Program divisions/genders/dates/coach details not supported by source evidence remain unknown. Additional national coverage, ID camps and showcases need data, not another UI or invented availability.
5. No production authentication, verified guardian authorization, cross-device persistence, cloud backup/private hosted media, shared file collections or parent connection service exists. Local browser data can be lost when its storage is cleared; no real personal data was used in QA.
6. ICS import is a snapshot, not a live URL/provider subscription. SIEM adapters/messages/actions and Slack replies remain simulations/local drafts. Live OAuth, authorization and delivery infrastructure are absent.
7. Coach sharing and outreach are local previews/drafts only. AP's16+ policy and manual rules acknowledgment do not authorize NCAA/high-school contact. Secure sharing, external revocation, legal/rules review and delivery need separate implementation/authorization.
8. LockedIn is Coming Soon with a read-only fictional preview. Actual vendor contracts, secure identity/document workflows, recipient authorization, signatures and payments remain unimplemented.
9. Current evidence uses real Chromium and WebKit/WPE at emulated desktop/iPad/iPhone sizes. It does not certify physical iPad/iPhone Safari behavior, full WCAG compliance or SC production behavior. Repeat the targeted user acceptance on intended physical devices.

The candidate corrects the integrated UI workflows; the content and production gates above remain real. No new application architecture, sport, commercial module or competing dashboard was introduced.
