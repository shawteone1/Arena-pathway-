# AP final source-reference acceptance pass

AP baseline: `eca2d25` on `codex/ap-qa-20261112`. No restart, architecture migration, Soccer Center edit, remote push, merge, deployment or publication.

## Authoritative source identified

GitHub’s current `shawteone1/Soccer-Center` history and branch listing identify **`11de067414e63c5d3e3e221dfc14cc026dfbd8d0`**, **“Import Soccer Center source from GoDaddy”**, **November 11, 2026 at 17:02:28 UTC**, as the latest imported source. Only `main` was returned. The recursive tree was not truncated. Fourteen targeted UI components, the authored player-profile labels and scoped styles were read at that immutable commit; [SOURCE.json](SOURCE.json) records blob identities and pinned links.

The existing scratch rendering harness is not an authoritative source checkout. No replacement archive was requested, downloaded or required for this analysis; no whole application was copied. Source analysis is complete independently of screenshot availability. Source code presence is evidence of implementation structure, **not independent certification of the current Airo production runtime or external integrations**.

## Actual source versus AP comparison

| Area | Soccer Center imported source | Current AP / decision |
|---|---|---|
| Parent | `parent-portal.tsx` actual NAV_ITEMS includes Players, Recruiting, Network/Messaging, Development, Calendar, Tryouts/Camps, Saved and Settings. Cover/avatar/actions, player cards and a sidebar organize the home. | Existing AP cover/avatar/edit/My Athletes retained. Six approved parent destinations reuse existing pages; Discover groups sports opportunities. AP collegiate colors and simpler layout intentionally retained. Network now opens its parent-owned section rather than bypassing it for demo Messages. |
| Athlete | `parent-portal-player.tsx` and `parent_portal_player.json` group About my soccer, Positions & goals, Club & team, Training preferences, Upcoming events and Tryout listings. Exactly Profile/Schedule/Stats/Media/Recruiting tactical tabs. | Five matching tactical tabs, About My Sport/Positions and Goals/Club & Team/Upcoming Events cards, later editing and tryout control already present. My Feed/Development remain separate resources. AP keeps sport-specific fields, existing IDs and a completed-looking profile immediately after basic creation. No soccer-only preferred-foot field or mandatory completion wizard added. |
| Schedule/calendar | `PlayerScheduleTab`, `PpCalendarTab`, `CalendarViews`: one/repeating practice, games, feed setup, family/player filtering, clickable calendar events. `GameDetailsPanel` reuses event references for stats/media. | Existing bounded recurrence, occurrence editing/skipping, snapshot ICS, categories and shared local family projection retained. **New Log stats action** on game/meet/tournament cards selects the existing event and loads its existing record. No duplicated event or stats entry. Live subscriptions/provider authorization remain absent. Accepted calendar visuals unchanged. |
| Stats | `PlayerStatsTab` derives totals and per-game logs from the same match records opened from Schedule. Missing values differ from zero; scheduled games are not automatically appearances. | Existing event-keyed sport metrics/achievements and totals reused. Shortcut does not create a record until Save, and saving again updates its original ID. No inferred official results or appearance counts. Soccer-specific match fields and a separate GameDetails system are not copied. |
| Media | `PlayerMediaTab` supports assigned family files, photo/video lightbox, captions, event tagging and named collections. Removing an assignment preserves the shared underlying file. | Existing athlete/event-linked photo/video library, captions, editing and playback retained. AP is browser-local and single-athlete-owned; Delete media deletes that local item. Shared family assignments, named collections and cloud hosting are genuine unimplemented differences, not newly simulated services. |
| Feed/development | `PpSourceFeed` separates follows from club affiliations and distinguishes link-only/interest-only sources. `UnifiedFeedWall` merges video/RSS/podcast items with type filters. `DevTab` fetches category-curated videos. | Existing explicit per-athlete source choices and source filters retained; affiliations are separate. AP has a reviewed outbound collection, not a live RSS/video/podcast wall. It now offers **21 specific written items from 19 sources**, with 21 candidates inactive. No whole-channel/video approval inferred. |
| Network | `PpNetworkTab` has parent email requests, accept/reject/cancel/remove and explicitly separates connections from guardian access. | **Navigation correction:** Network/Messaging opens Parent Network, which states that connections are unavailable and separate from guardian permissions. Existing demo Messages remain a distinct action. No fake connection requests, public minor discovery or permission grants added. |
| Recruiting | `RecruitingTab` allows general parent research at any age; outreach is U16–U19 product-gated, not verified age. Source includes drafts, coach sharing and selected records/media. `ParentRecruitingHub` adds research/player/outreach navigation. | Independent college research and parent-approved local preview reuse existing schedule, records, achievements and highlights. AP retains its approved age16+ policy, parent controls and rules-review gate. It does not claim secure coach links, outreach delivery, external revocation or NCAA-rule validation. No new outreach module/backend introduced. |

These are source-level functional/structural findings and observed AP behavior. The old fixture comparison is not definitive visual evidence. **Original November11 image pixels were not exposed in the accessible attachments/project references during this pass; exact visual matching is NOT TESTED.** This does not block the source analysis or the two narrow corrections. Updated actual AP screenshots are supplied below; no source-rendered fixture is relabeled as an original image.

## Targeted changes only

- Parent Network/Messaging routes to `#family-network`, supports direct fragment navigation, explains the guardian/message distinction and retains its existing My AP Messages action.
- Game/meet/tournament Schedule cards expose Log stats. The existing Stats form receives the same event reference and preloads any existing metrics; Save updates the same record ID. Models, IDs, persistence and the accepted calendar/directory components are unchanged.
- Sarah Pavan’s **The Importance of Setting Goals** is newly approved as a public written youth-development guide after reading its full goal-setting guidance. Her channel/videos remain unverified. Previous 20 approved items are unchanged and explicitly checked against the baseline by automated tests. New subscription remains opt-in; old candidate interests do not activate anything.

## Continued inactive-source review

[TRAINING-RECHECK.json](TRAINING-RECHECK.json) records the exact attempted/final URLs, statuses and capture hashes. This pass followed official-site links to working Breakthrough drill indexes, a specific youth dribbling overview, Pro Skills’ blog, Sarah Pavan’s goal-setting/body-height articles, Swax drill-titled pages, and official-site Elevate/HGR video embeds.

- **Sarah Pavan:** only the complete public written goal-setting article approved. No claims about YouTube availability, her whole channel or other services.
- **Breakthrough:** working indexes/overview found, but unrestricted access to the substantive linked video/bonus PDF was not established; remains inactive.
- **Pro Skills:** blog works; individual free drill instruction not verified; remains inactive.
- **Swax:** both drill-titled routes returned a short retail/custom-ball body without instructional content; remains inactive.
- **Elevate/HGR:** public YouTube oEmbed checks failed at the runtime tunnel with HTTP403. This is an access/verification limit, not a claim their videos are unavailable to ordinary users. No video activated.
- Remaining prior membership, paid-content, script-dependent and unsuitable-content decisions are retained. **19 sources / 21 written items available for explicit opt-in;21 inactive candidates; zero newly approved publisher videos.** No unverified source is activated.

## Validation and evidence

- `npm run check`: **218 passed, 0 failed**, including syntax, original data, participation and discovery checks.
- Explicit `npm test`: **218 passed, 0 failed**. No test cases removed. Only publication counts were updated for the newly verified item; all previously approved items must remain identical.
- Expanded parent/profile/schedule/media/source/recruiting acceptance: **Chromium12/12; WebKit12/12**. New regression follows Schedule → Log stats → Save → Schedule → Log stats, checks restored values, and verifies that a second save keeps the original record ID.
- Existing profile visual/navigation: Chromium8/8; WebKit8/8.
- Existing conformance / My AP / directory regression: Chromium12/12; WebKit12/12.
- Rivera family SIEM:18/18. Existing calendar categories, source-attributed demonstration messages, local draft-only Slack behavior and LockedIn Coming Soon remain intact.

Logs and [VALIDATION.json](VALIDATION.json) record final results. A parallel WebKit run timed out during video reload; isolated execution verified playback. A subsequent run exposed an old test helper that waited for any existing schedule row instead of the newly saved plan; the helper now waits for the persisted plan count before proceeding. No assertion or media playback check was removed. Final WebKit acceptance is run without competing browser suites. Physical iPad/iPhone acceptance remains separate.

Actual AP, iPad810×1080 viewport (full-page captures retain that width):

- [Parent](screenshots/parent-ipad.png), [athlete](screenshots/athlete-ipad.png)
- [Schedule](screenshots/schedule-ipad.png), [Stats](screenshots/stats-ipad.png)
- [Media](screenshots/media-ipad.png), [My Feed](screenshots/feed-ipad.png)
- [Recruiting](screenshots/recruiting-ipad.png), [Development](screenshots/development-ipad.png)

Use `npm start`; parent `/my-pathway?view=family`, athlete `/my-pathway`, Schedule `#schedules`, Stats `#stats`, Media `#profile-media`, Feed `#my-feed`, Development `#camps`, Recruiting `/recruiting`, local family calendar `/my-ap?scenario=local&section=calendar`. All local athlete-dependent paths use the existing selected identity. Sources/models/fixtures/brand preserved; [changed files](CHANGED-FILES.txt).

## Remaining acceptance limits

1. Original screenshot pixel comparison is not tested; source-based structural analysis is complete. No archive upload is a prerequisite.
2. **21 source candidates** and all unverified external instructional videos remain inactive. The working written-resource collection is not live feed parity with Soccer Center’s source-side multimedia wall.
3. AP has no authenticated parent accounts, cloud/shared family media library, named highlight collections, parent network requests, live source synchronization, secure coach access or outreach delivery. Local parent/recruiting settings are not a security boundary. Current sport-specific NCAA/high-school contact rules remain a separate gate; age16 is not contact permission.
4. Physical Safari/iPad/iPhone testing and user visual sign-off remain outstanding. Source/API code inspection is not proof of Soccer Center production behavior.

No Soccer Center modifications, backend import, merge, remote push, deployment or publication. Review this follow-up on the existing AP branch.
