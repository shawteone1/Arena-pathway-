# Live rerun results

**Acceptance remains failed.** This is a post-hoc rerun of the originally independent sample, not a new blind test. No diagnostic official URLs or benchmark names were discovery seeds. No statewide denominator or completeness claim is made.

| Sport | Original identity recall | Rerun identity recall | Rerun youth evidence only | Qualified CO + youth | Reviewed | Newly visible |
|---|---|---|---|---|---|---|
| lacrosse | 0/6 | 0/6 | 0/6 | 0/6 | 0/6 | 0/6 |
| volleyball | 6/6 | 6/6 | 3/6 | 0/6 | 0/6 | 0/6 |

Volleyball added candidate historical youth-participation evidence for NORCO, Elevation and Colorado Momentum. None gained sufficient state/service-area evidence. ClubOne, Prime and VC Denver detail extraction still lacks youth qualifications. Directory identities and multiple source observations are not extra organizations. No new consumer records were published.

The original official RMR source still returns 403. VBNerd retrieval reached the root and all 102 linked club pages (103 successful source retrievals, no HTTP failures in that job), but an accessible page is not a complete qualification chain. Lacrosse retrieved 34 sources, failed on 14 and left five frontier links unprocessed at its declared 48-source budget. Increasing depth and budget did not reach any held-out lacrosse identities.

## Per-record rerun

| Organization | Identity | Youth evidence | Colorado evidence | Qualified / approved / visible |
|---|---|---|---|---|
| Boulder Valley Lacrosse | not reached | unknown | unknown | no / no / no |
| Foothills Pack | not reached | unknown | unknown | no / no / no |
| Warriors Youth Sports | not reached | unknown | unknown | no / no / no |
| Littleton Youth Sports | not reached | unknown | unknown | no / no / no |
| Denver United Lacrosse | not reached | unknown | unknown | no / no / no |
| Ranger Youth Lacrosse | not reached | unknown | unknown | no / no / no |
| NORCO | found | candidate | unknown | no / no / no |
| Elevation Volleyball Club | found | candidate | unknown | no / no / no |
| Colorado Momentum Volleyball Club | found | candidate | unknown | no / no / no |
| ClubOne Volleyball | found | unknown | unknown | no / no / no |
| Prime Volleyball Academy | found | unknown | unknown | no / no / no |
| VC Denver | found | unknown | unknown | no / no / no |

## Interpretation

Source reach and field-level evidence acquisition remain the limiting capabilities. Parser corrections cannot manufacture sources or safely infer geography. Direct diagnostic retrieval showed usable youth/state claims for Ranger and Prime, but those checks used their now-known URLs, so they are not counted as independent gains. No manual verification or automatic publication was used to inflate results.

Precision, full-pool classification accuracy and current-membership freshness remain unknown. Both the frozen original acceptance command and the post-hoc rerun acceptance command exit 1. A new independent quality claim requires fresh externally assembled held-out cases, adjudicated output and permitted source access.

## Validation and preservation

- Node.js 22.23.4: 138 automated tests passed, none failed/skipped. All original tests retained; six focused extraction/traversal regression tests added.
- Chromium desktop/tablet/mobile regression: 23 tests passed. Physical iPhone/iPad Safari and screen readers were not tested.
- All 292 previous staged records, their historical versions and approved-version pins were retained in the separate rerun database.
- Existing consumer source/data files, v2 protocol/benchmark/sealed trial, reviewed data, branding, SIEM, Recruiting, Locked In, navigation and governance documents are unchanged from 16e49df9.
- No push, merge, deployment, production mutation or automatic publication.

## Source failures and budget exceptions

### analysis-rmr

- [RMR official club directory](https://www.rmrvolleyball.org/page/show/6830537-club-directory): {'code': 'HTTP_403', 'message': 'Public source returned HTTP 403'}.

### analysis-lacrosse

- [www.aylsports.org /home](https://www.aylsports.org/home): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 406)'}.
- [register.colorado.3dlacrosse.com /](https://register.colorado.3dlacrosse.com/): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 406)'}.
- [www.spartanyouthclub.com /boyslacrosse](https://www.spartanyouthclub.com/boyslacrosse): {'code': 'HTTP_403', 'message': 'Public source returned HTTP 403'}.
- [team180elite.com /about-team180/](https://team180elite.com/about-team180/): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 500)'}.
- [mountainlax.com /content/426/History](https://mountainlax.com/content/426/History): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 406)'}.
- [Schedule](https://www.grandvalleylax.com/schedule): {'code': 'ROBOTS_DENIED', 'message': 'Robots directives prohibit this path'}.
- [US Lacrosse Age Brackets](https://www.uslacrosse.org/sites/default/files/public/documents/rules/age-group-chart-17-18.pdf): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 301)'}.
- [usalacrosse.com/lacrosse-chest-protector-faq](https://www.usalacrosse.com/lacrosse-chest-protector-faq): {'code': 'HTTP_404', 'message': 'Public source returned HTTP 404'}.
- [US Lacrosse Rules](https://www.uslacrosse.org/rules): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 301)'}.
- [Locations](https://teamsideline.com/sites/denverlacrosse/locations): {'code': 'HTTP_522', 'message': 'Public source returned HTTP 522'}.
- [ELITE MANGO](https://teamsideline.com/sites/denverlacrosse/schedule/742575/ELITE-MANGO): {'code': 'HTTP_522', 'message': 'Public source returned HTTP 522'}.
- [1st/2nd Grade](https://teamsideline.com/sites/denverlacrosse/schedule/743658/1st2nd-Grade): {'code': 'NETWORK_ERROR', 'message': 'The operation was aborted due to timeout'}.
- [Game Schedules](https://www.teamsideline.com/Org/Schedules.aspx?d=LYsHZebBa%2f1mR9pjL6buHQ%3d%3d): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 302)'}.
- [Game Locations](https://www.teamsideline.com/Org/Locations.aspx?d=LYsHZebBa%2f1mR9pjL6buHQ%3d%3d): {'code': 'ROBOTS_UNAVAILABLE', 'message': 'Robots could not be verified (HTTP 302)'}.
- Unprocessed: https://leagues.teamlinkt.com/coloradolacrosseleague — Unprocessed source frontier: job budget reached. Not complete.
- Unprocessed: https://fmhsathletics.com/teams/4400088/boys/lacrosse/varsity/schedule — Unprocessed source frontier: job budget reached. Not complete.
- Unprocessed: https://www.fmhsathletics.com/schedule?year=2025-2026 — Unprocessed source frontier: job budget reached. Not complete.
- Unprocessed: https://www.gjhstigers.com/ — Unprocessed source frontier: job budget reached. Not complete.
- Unprocessed: https://cmumavericks.com/sports/womens-lacrosse/ — Unprocessed source frontier: job budget reached. Not complete.

### analysis-volleyball

No HTTP failures or pending frontier URLs in this bounded job. Qualification remains incomplete.
