# Completed browser journeys

All primary completion data were entered through supported UI in fresh browser contexts. Fictional family: parent Jordan Harper Demo; Alex Harper Demo (Lacrosse) and Taylor Harper Demo (Swimming). No direct database manipulation is used in the 25-step journey. IDs vary by engine/run; [Chromium proof](chromium-25-step-journey.json) and [WebKit proof](webkit-25-step-journey.json) record the actual same-family athlete/event/result/college IDs.

## Mandatory continuous journey

| Steps | Actual action and result | Evidence |
|---|---|---|
| 1–4 | Home shows mission/four pillars before sports; My Athletes opens family gallery. | `after/*-coverage-homepage-loaded-{desktop,ipad-portrait,ipad-landscape,phone}.png` |
| 5–7 | Six-step guided onboarding: reviewed/manual club, program/team, season, participation, athlete details and optional schedule/skip. Save opens the same athlete's full profile. | `qa-product-completion-20261117.py` uses wizard controls; `after/*-completed-athlete-profile-*.png` |
| 8 | Focused About Me, college goals, Education, Athletic Background and Achievements editors save; GPA 3.8/4 Unweighted, fictional school/location and history populate the profile. | `after/*-completed-athlete-profile-*.png`; focused editor captures linked in comparison |
| 9–10 | Monday/Wednesday range creates five unique selected-weekday practices; two one-time games and a Swimming meet use optional end times. Reload retains recurrence IDs/counts. | Same journey assertions; `after/*-athlete-month*.png` |
| 11 | Family setup adds parent around the same existing profiles; local SIEM calendar contains the original references and selected-week commitments. Header SIEM also returns to own family, not Rivera. | `after/*-same-family-calendar.png`; parent-context regression |
| 12 | Two Lacrosse competition records (3 + 2 goals) aggregate to 5, with a narrower season/date window yielding one record/2 before restoring full window. Practices are ineligible. | Same journey assertions and finished portfolio performance |
| 13 | Upload playable fictional game video to athlete gallery, associate the eligible game, preserve original media ID. | `after/*-finished-family-portfolio-*.png`; `videoPlayed=true` in proof |
| 14–16 | Recruiting identity-first workspace → independently saved information → seven content-rich section cards. Explicitly select owned video/results/one achievement/upcoming game. Independently exclude athlete photo while retaining name. | `after/*-recruiting-information-*.png`, `after/*-final-visual-builder-*.png` |
| 17–18 | Build My Recruiting Profile renders full coach-facing portfolio: identity, school/location, intro/goals, selected background, academics, selected competitions, achievement, playable highlight and appearance. Save stores the finished composition. | `after/*-finished-family-portfolio-*.png` |
| 19–20 | Navigate to SIEM through the global pillar; return and reload Recruiting. The actual completed profile and saved timestamp remain. | `after/*-saved-reopened-portfolio-*.png` |
| 21–22 | Edit athlete source information; stale approval is revoked and disabled until rebuilt/saved. Rebuild, save, approve locally, revoke and reload; state remains accurate. No external sharing. | `saveBeforeApprovalEnforced=true`; four-sport JSON and source revision tests |
| 23 | College research filters the selected sport; save reviewed program `du-lacrosse-men`, then return. Switching to Taylor does not inherit Alex's saved program; switching back retains Alex's saved portfolio. | Same-family assertions and saved-college ID in proof |
| 24–25 | Return to Parent Portal and find real saved program; open own SIEM/calendar and exact LockedIn external-demo entry without sending athlete information. | Parent-context/LockedIn assertions, `externalWrites=[]` |

The complete automated journey is one case per engine, not 25 separately counted tests. Screenshots are captured at desktop1440×900, iPad portrait810×1080, landscape1024×768 and phone390×844. Touch emulation is a separate test; none of these equals physical-device certification.

## Additional complete journeys

| Journey | Start → finish → return | Browser evidence |
|---|---|---|
| Parent phase gate | Create two different-sport athletes → add parent via family setup → integrated home/actual conflicts → primary SIEM local context → return/reload → focused athlete edit → parent-name edit. | `qa-completion-parent-20261117.py`, `*-parent-phase-c.json`, `after/*-parent-home-*.png` |
| Shared four-sport recruiting | For each Lacrosse/Basketball/Volleyball/Swimming athlete: source information, competition stats, video → visual selections with zero scroll delta → full portfolio/playback → save → other pillar/reload → edit/rebuild → approve/revoke/reload. | `*-recruiting-journeys.json`, `after/*-{sport}-finished-portfolio-*.png` |
| Club discovery and ownership | Simple searchable/scrollable results → official details → Save As My Club to selected athlete → profile/family association → focused reviewed-club edit → prior-team warning → reload → explicit confirmation. | `qa-supporting-20261117.py`, `qa-completion-corrections-20261117.py`, `after/*-reviewed-club-editor.png` |
| Stale chooser safety | Choose reviewed club/team → replace with club having no reviewed team → ArrowDown/Enter cannot pick old hidden options. | `test_changing_club_cannot_choose_a_stale_hidden_team` |
| Archive safety | Two athletes + media → named exact confirmation → archive one → active family/athlete/SIEM/recruiting excludes it → reload/stale supported writer cannot resurrect → unrelated athlete/media remains. | Foundation tests, `*-media-removal-proof.json`, `after/*-deletion-confirmation.png` |
| Nested competitions and historical media | Multiple Swimming races/Volleyball tournament matches → recorded performance → PB/target save → event edit/delete/view changes → reload; retain historical/orphan references and actual family projection. | `qa-completion-preservation-20261117.py`; existing underlying product-completion tests reused |
| Actual local message/action continuity | Existing local tools add communication with required follow-up → update same source reference/venue → parent message/change/priority → resolve in SIEM → reload → resolved priority absent from parent home. | `after/*-actual-local-message-change.png`; local action persistence Node tests |
| Fictional SIEM isolation | Explicit Rivera tour Next/Back/Restart/Skip → own family setup → same profile plus optional lightweight athlete → own calendar/athlete schedule/return. | Entry tests (including SIEM-only parent with no full profile), accepted SIEM suites; no live Slack connection |
| Four-sport content | Open each sport → reviewed editorial cards with publisher/date/summary and labeled AP illustration or intentional fallback → source preferences → actual original publisher tab → return to AP. | `*-coverage-public.json`, `*-publisher-checks.json`; four publisher main navigations returned200 in each engine |
| Assets and accessibility | Fresh/repeat navigation, stylesheet MIME/cache/failure recovery; keyboard chooser, focused editor, reduced motion, touch, responsive no horizontal overflow. | Profile-assets/supporting suites; final logs |

Native media uses a short locally generated fictional test clip/monogram. It proves upload, ownership, retention and actual playback, not access to a real child's highlight or licensed publisher photography. No unexpected external writes were permitted. Synthetic RSS fixtures validate rights/loading/failure boundaries without enabling any production publisher.
