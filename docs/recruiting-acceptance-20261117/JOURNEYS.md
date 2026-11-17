# Completed user journeys and evidence

The four-sport acceptance case enters fictional records through the UI, rather than seeding an independent database. It inherits the original assertions for athlete/event/result/media ownership, selection, playback, saved composition/revision, saved school, leave/reload, edit/rebuild and approval/revocation. The new case adds the actual parent-card/profile sequence, jersey, profile prefill, same athlete-color cue, three-destination navigation, absent legacy DOM and full inline portfolio.

| Requested step | Actual sequence / evidence |
|---|---|
|1. Open Parent Portal | Create a fictional athlete normally, then use My Athletes. `after/*-{sport}-parent-portal-*.png` shows the existing athlete in family context. |
|2. Select existing athlete | View Profile uses the original athlete ID. No second athlete or recruiting identity is created. |
|3. Premium identity visible | Gold AP identity is present immediately in the profile; explicitly entered jersey/lane label17, actual sport, team/class and intentional initials. `*-identity-and-profile-*.png`. |
|4. Complete athlete profile | Original story, background, education, achievements, media, performance and upcoming events remain integrated. `*-complete-athlete-profile-*.png`. |
|5. Edit school/About/achievements | Focused profile editors save these fields before entering Recruiting. Later recruiting editors assert existing field values and only fill missing/changed values. |
|6. Enter Recruiting | Same athlete, same gold card, one primary root and three clear destinations. `*-recruiting-entry-*.png` / `*-recruiting-dashboard-*.png`. No checkbox-first entry. |
|7. Research college | Explore Colleges opens reviewed records for that sport. Official links and honest missing-contact status remain; research works without profile creation too. `*-college-discovery-*.png`. |
|8. Assemble information | Prepare uses existing information; Choose content opens one focused panel. Explicitly select one achievement, competition result, owned video and upcoming competition. Private photo/achievement remain excluded. `*-composition-controls-*.png` are viewport captures of the actual responsive panel. |
|9. Preview actual portfolio | The full selected portfolio already exists during preparation, before the final Review & Save action. Same identity cue and number, selected academics, results, honor, video and appearance. `*-recruiting-builder-*.png` then `*-finished-portfolio-*.png`. |
|10. Save | Save Recruiting Profile persists the existing composition's selection IDs and revision. No external transmission. |
|11. Navigate away | Open SIEM and wait for the command center startup state to become ready; then use the global Recruiting pillar. This tests the real dashboard transition, not only its server shell. |
|12. Reopen | Same athlete, saved timestamp, result/media/appearance selections and school data remain after return and reload. `*-saved-reopened-portfolio-*.png`. |
|13. Edit/rebuild | Edit source introduction, rebuild, save, review guidance, approve locally, reload, revoke and reload. Original athlete/result/media/school IDs remain. Return to the general profile shows the revised story. |

All thirteen steps repeat for Lacrosse, Basketball, Volleyball and Swimming using the same sport-agnostic interface/engine. Each surface is captured at1440×900 desktop,810×1080 iPad portrait,1024×768 landscape and390×844 phone in Chromium and WebKit. `[engine]-recruiting-journeys.json` records each actual athlete/competition/result/school ID and zero selection scroll delta. These are browser viewport/touch checks, not physical-iPad certification.

The same-family25-step regression additionally exercises two athletes, guided creation, Monday/Wednesday practices, one-time competitions, actual family/SIEM calendar linkage, season aggregation, competition-linked video, photo exclusion, stale-approval save gating, athlete switching and the unchanged LockedIn URL. The per-engine25-step proof is saved beside this report.

## Failure and compatibility cases

The route-isolation case blocks requests for `profile-qa.js` and `content-library.js`, opens Recruiting and still reaches its gold identity and verified sport research. It checks that `template-recruiting`, `optional-recruiting`, `recruiting-form`, `recruiting-profile-builder` and module-customizer do not exist in that render tree. A legacy athlete hash navigates to the same current Recruiting route.

The selected-only jersey Node case proves that an older saved composition does not automatically include the new optional identity field or lose research notes/saved schools. General profile, archive isolation, actual parent home, reviewed club edit, nested races/matches, media retention, SIEM subsets/messages/actions, source restrictions, asset recovery and touch regressions are retained.

## Evidence interpretation

Every athlete, school biography and performance entered by the browser is fictional and labeled as such. The short video/monogram/private test photo are deliberate test fixtures, not real athlete footage or publisher photography. Actual original source/program pages are not replaced with fabricated records. Composition-panel screenshots capture the real viewport; full portfolio captures are full-page images. No reconstructed mockup is used as implementation evidence.
