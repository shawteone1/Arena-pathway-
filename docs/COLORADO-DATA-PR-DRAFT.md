# Colorado Data Engine v1: reviewed ingestion, validation and first-party directories

Base: `codex/arena-pathway-v07-review`  
Head: `codex/colorado-data-engine-v1`  
Status: draft; do not merge or deploy.

Arena Pathway now stages source-derived Colorado sports records, reconciles them against independently reviewed membership lists, and publishes only reviewed additions alongside the untouched v0.7 catalog. Directory landing pages, blocked memberships, unknown seasons and unverified meet participants cannot become complete imports.

Changes:

- Reusable HTML, standings/schedule, aggregate PDF and documented JSON adapters; source registry, independent expectation manifests, review queue, revisions and portable import history.
- Node 22 SQLite migrations, transactional staging/review, stable identities, idempotent imports, protected reviewed data, audited retirement, backup/restore and due-refresh commands. Robots, host scope, crawl delays and persistent rate/cooldown controls apply to public-source requests.
- First-party directory filters for geography, sport, gender/coed, participation, seasons, competitions and published program types; separate year-round, summer, high-school and collegiate swimming views; provenance and explicit unknowns; dated listings distinguish historical schedules. Saved divisions/facilities resolve through the existing athlete workspace, and new college programs join recruiting.
- Approved logo, photography, palette, Sports menu, four sport environments, browser-local profiles, optional media, calendar and recruiting workflows are preserved. No additional portals or hosting changes.

Reviewed additions: **51 active organizations, 130 teams/programs, seven leagues, 14 divisions, 11 community/adaptive resources and two facilities**. Forty-six registered discovery sources have recorded attempts, with 65 import attempts retained. Multi-sport organization counts below overlap:

| Sport | New organizations | New teams/programs |
|---|---:|---:|
| Lacrosse | 6 | 65 |
| Volleyball | 8 | 5 |
| Basketball | 8 | 10 |
| Swimming | 49 | 50 |

Coverage and limitations:

- MHSL 21/21 independently reviewed 2026 memberships; South Jeffco 7/7; FSA 8/8 separate list entries; Metro 5/5 member headings; CSSCSA three formal leagues. All broader source scopes remain partial. AquaWolves is confirmed year-round; ACES' seasonal classification remains unknown.
- DLC supplies 58 team/division memberships, not 58 separate clubs. Its 149 yearless games remain unresolved and unpublished. The 2026 Western Zone aggregate yields 78 national meet participants: one Unattached exclusion and 77 affiliation/alias candidates, not 78 Colorado imports.
- RMR lists and AAU discovery are blocked; CHSAA's client-rendered standings remain unexpanded. Skyline's latest extraction misses 11 independently expected teams; existing reviewed records remain intact. Full statewide, school, recreational, elite, coed/gender, adaptive, parks, nonprofit, facility and tournament coverage is not complete. Central Mountains remains a gap. Source-level pending/blocked/unresolved counts and all regional gaps are in [the coverage report](COLORADO-DATA-COVERAGE.md).
- A pre-release flattened FSA label combined adjacent teams incorrectly; its organization/team were retired with history retained, and the corrected independent list was reconciled. No baseline catalog records were changed.
- Scheduler configured/tested/operational: no/no/no. SQLite uses Node 22's experimental built-in API; aggregate PDF imports require Poppler. Actual GoDaddy/Airo persistent storage, system packages and scheduler compatibility remain unverified. No hosting preview was touched.

Validation: **47/47 automated test groups pass on Node.js 22.23.4**: all 20 existing groups plus 27 new engine/integration groups. Quality gates cover independent missing memberships, landing-only completion, unresolved pagination/frontier, duplicates, orphans, cross-sport/season/competition errors, mixed swimming types, stale schedules, unexplained decreases, privacy/access/rate limits, atomic review, idempotency, migrations, audit recovery, routes, filters and saved-entity lookup. The existing design assertions were narrowly updated for reviewed swimming additions and the additive saved-record lookup. Original application tests are unchanged. Fresh audit bootstrap restores 341 entities and 65 runs and validates successfully; start command/PORT and key routes pass under Node 22. `npm audit --omit=dev`: zero vulnerabilities at validation time.

Outstanding mobile/visual QA: real iPhone/iPad Sports dropdown, filter disclosure/keyboard operation, touch targets, long names, horizontal overflow of filters/tables, screen-reader/focus order, photographic contrast, large directories, saved facility/division persistence and college recommendations. No browser screenshots or real touch QA were possible in this environment; structural checks are not visual acceptance.

Operations, recovery and scheduler prerequisites: [engine runbook](COLORADO-DATA-ENGINE.md). Do not merge into main, update GoDaddy/Airo preview, or deploy until separately approved.
