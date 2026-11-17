# Browser journey evidence

All inputs are explicitly fictional. Tests use actual AP routes, controls, localStorage and IndexedDB, not source-rendered replacement screens. Each test uses a fresh browser context; four-sport recruiting uses a separate fresh context per sport while exercising all navigation/reload steps within that context.

## Family → athlete → focused edit → saved profile → removal

`qa-profile-foundation-20261117.py`:

1. Create Morgan/Lacrosse, Jamie/Swimming, Alex/Volleyball through the existing athlete form.
2. Open My Athletes; three cards retain the three original generated IDs. Open the actual Morgan profile.
3. Edit About Me, Education and Achievements independently; save each focused dialog and return to the identity page.
4. Navigate/reload; verify school, story, achievement and active ID persist.
5. Open management→Delete Athlete; wrong partial name cannot confirm; cancel preserves all three. Exact confirmation archives only Morgan. Reload leaves Jamie and Alex; local SIEM excludes Morgan.
6. Separate media case uploads an owned fictional monogram as profile photo and gallery item. Choose Featured Media, deselect/save/reload, reselect; recruiting highlights stay untouched.
7. Upload another athlete's gallery item. Remove the first athlete; inspect both original blob IDs/owners/bytes, the archived featured ID, and unrelated active athlete. Exercise a stale supported state writer; removed identity does not reappear.

Proof: `*-profile-foundation.json`, `*-media-removal-proof.json`. [Gallery](after/chromium-family-gallery-ipad-portrait.png), [profile](after/chromium-athlete-profile-ipad-portrait.png), [owned media](after/webkit-profile-with-owned-monogram.png), [confirmation](after/chromium-deletion-confirmation.png).

## Recruiting — one complete engine across four sports

`qa-recruiting-reconstruction-20261117.py`:

1. Create one parent-managed athlete, a one-time competition, sport-specific result and uploaded video linked to that competition. Upload a second private unselected photo.
2. Open Recruiting; identity/next-action landing contains no selection checkboxes. Complete About Me, high school, graduation year, GPA/scale/academic interests, position/event, current age review and two achievements through focused editors. Save independently.
3. Continue to Profile Builder. Include seven rich section cards; select one achievement, one competition record, one appearance and one video. Keep the second achievement/photo private. Assert each section button remains connected/focused; measure scroll from actual pointer-down, not Playwright's preparatory auto-scroll.
4. Preview. Verify school, selected achievement, correct sport metric and exactly one native video. Play and pause it successfully; unselected private content is absent.
5. Save Recruiting Profile. Open SIEM, return to Recruiting, reload; verify the same savedAt, athlete ID, selection IDs and completed portfolio.
6. Open Find Colleges, verify sport, save an actual reviewed program ID, return to the completed presentation.
7. Edit About Me, rebuild/preview/save. Review guidance in final help, approve locally, reload, then revoke and reload. Saved school survives; approval accurately reflects revocation.
8. Open the general athlete profile; the rebuilt story is shared, not re-entered or copied into another identity.

Adapters: Lacrosse/Attack/Goals3; Basketball/Point guard/Points14; Volleyball/Setter/Kills8; Swimming/100 freestyle/Time80seconds. These are labeled fictional test values, not sporting claims. All use the same editor, builder, projection and portfolio modules. [Exact IDs and results](webkit-recruiting-journeys.json).

[Information](after/chromium-recruiting-information-ipad-portrait.png) → [composition](after/chromium-recruiting-builder-ipad-portrait.png) → [portfolio](after/webkit-lacrosse-finished-portfolio-ipad-portrait.png) → [reopened](after/chromium-saved-reopened-portfolio-ipad-portrait.png). Each also has desktop/landscape/phone captures. The small white video fixture proves native playback; it is not represented as athlete action footage.

## Supporting accepted modules

`qa-supporting-20261117.py`:

- Homepage: exact four pillars, prominent My Athletes, mission, cards preceding sports; four responsive screenshots.
- Reviewed directory: search opens scrollable options; select club, open details, Save as My Club; same athlete owns club ID and Recruiting remains off.
- Monday/Wednesday practice from Nov23–Dec7: five visible occurrences, no required end time, estimated duration disclosed. Add one-time competition. Standard Stats and Media selectors exclude the practice series.
- Three athletes across LAX/swim/volleyball: selected week contains5 events; none0, LAX3, LAX+swim4; selection persists after reload. Re-select the week explicitly because date navigation is not persisted by the accepted SIEM. All5 return; day/month/week remain usable; Details opens the originating athlete schedule.
- Fictional Rivera Messages: sender/channel/timestamp/athlete, draft saved, nothing posted. No fictional panel in own local family. Exact LockedIn URL, safe new tab and zero write requests.
- iPad touch: actual tap to open profile/editor, save, reload and retain correct athlete ID/story.

## Guided onboarding, assets and keyboard

`qa-profile-assets-20261117.py`: six-step guided Swimming onboarding using sport choice buttons, manual unverified club/team fallback, season/category, athlete details and skip schedule. Completed identity/profile persists. Keyboard editor saves and returns focus to the matching edit control. Reduced-motion preference is honored; rendered widths do not overflow.

Fresh/repeat home/four-sport visits verify all stylesheets present, no failed asset responses and hidden error banner. Intentionally abort new CSS: visible honest failure state; restore route and Retry assets reloads the stylesheet. Existing WebKit SIEM suite separately exercises module-load failure recovery.

## Preserved regressions

Existing SIEM Family suite:18 Chromium cases; existing WebKit SIEM suite:5 cases. Existing RSS:5 per engine. Existing editorial:3 per engine. No existing domain test case removed. Historical checklist/old-profile browser scripts are retained but are not accepted primary UI specifications after this authorized reconstruction; replacement journeys assert finished outputs and persistence instead.
