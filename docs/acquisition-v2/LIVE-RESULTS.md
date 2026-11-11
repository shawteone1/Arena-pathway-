# Live acquisition results and release readiness

## Verdict

**Acceptance not met.** This is a reviewable acquisition foundation and an honest failed discovery trial, not a comprehensive Colorado dataset or an operational open-ended discovery service. No consumer records were replaced or published.

## Demonstrations

| Measurement | Actual live result | Interpretation |
|---|---|---|
| Official RMR prescribed directory | HTTP 403; denominator unknown | Blocked, not passed |
| VBNerd Rocky Mountain alternate | 102 / 102 named entries | Mixed-state directory scope only |
| Synergy portfolio | 6 / 6 cards | 3 organizations, 2 leagues, 1 facility; not statewide |
| Lacrosse held-out identity recall | 0 / 6 | Failed |
| Volleyball held-out identity recall | 6 / 6 | Identities only |
| Held-out qualified youth recall | 0 / 6 for each sport | Failed |
| Held-out consumer-visible recall | 0 / 6 for each sport | Failed |
| Live swimming generalization | 69 CSI entries | Unreviewed, not 69 verified youth clubs |
| Live basketball generalization | 38 HDN provider rows | Unreviewed, no independent membership denominator |

Precision, global classification accuracy, current-membership freshness and statewide totals are unknown. URL/hash/retrieval traceability is 100% in the trial. One raw volleyball duplicate identity was detected. Publisher modified timestamps do not establish current membership.

Repeated live VBNerd/Denver Juniors and HDN acquisitions produced zero record changes on unchanged content. Parser upgrades separately produced semantic-version changes; those are not new organizations. Eleven controlled scenarios cover additions, retirement review, classifications, aliases, outages, changed layouts, partial retrieval, new associations and second-sport reuse. They prove behavior only, not live recall.

## Preserved consumer results versus internal acquisition

| Sport | Existing all-category programs | Existing youth | Staged organization rows | Internally reviewed organizations | Newly consumer-published |
|---|---:|---:|---:|---:|---:|
| lacrosse | 11 | 3 | 18 | 4 | 0 |
| volleyball | 16 | 4 | 103 | 0 | 0 |
| basketball | 109 | 96 | 38 | 0 | 0 |
| swimming | 124 | 109 | 69 | 0 | 0 |

Staged rows are source-scoped observations, not unique verified Colorado organizations. The 292 records span organizations, programs, registrations, leagues and facilities. Four post-trial assisted reviews (Northern Power, Rocky Mountain Rattlers, RoughRiders and Grand Valley) are internal-only and excluded from blind-trial scoring. One Grand Valley alias was resolved with explicit evidence. Three LeagueApps marketing/design entries were excluded, with history retained.

## Named held-out exceptions

### volleyball

- [NORCO](https://www.norcovolleyball.com/clubfaq): Identity found, but both Colorado participation and youth eligibility were not established.
- [Elevation Volleyball Club](https://www.elevationvball.com/regional): Identity found, but both Colorado participation and youth eligibility were not established.
- [Colorado Momentum Volleyball Club](https://momentumvbc.com/): Identity found, but both Colorado participation and youth eligibility were not established.
- [ClubOne Volleyball](https://www.clubonevolleyball.com/pride): Identity found, but both Colorado participation and youth eligibility were not established.
- [Prime Volleyball Academy](https://www.primevolleyballacademy.com/): Identity found, but both Colorado participation and youth eligibility were not established.
- [VC Denver](https://www.vcdenver.org/youth-program): Identity found, but both Colorado participation and youth eligibility were not established.
### lacrosse

- [Boulder Valley Lacrosse](https://www.boulderlacrosse.org/): No matching identity reached within generic intake, access and traversal budget.
- [Foothills Pack](https://www.foothillspack.com/): No matching identity reached within generic intake, access and traversal budget.
- [Warriors Youth Sports](https://www.warriorsyouthsports.com/content/34032/LAX-FAQ): No matching identity reached within generic intake, access and traversal budget.
- [Littleton Youth Sports](https://www.littletonyouthsports.org/lacrosse-faqs): No matching identity reached within generic intake, access and traversal budget.
- [Denver United Lacrosse](https://www.unitedlacrosse.org/): No matching identity reached within generic intake, access and traversal budget.
- [Ranger Youth Lacrosse](https://www.rangerlacrosse.org/about/about-us/18227): No matching identity reached within generic intake, access and traversal budget.

All development and held-out record-level outcomes are in `data/acquisition-v2/evaluation.json`. Indexed benchmark evidence is explicitly labeled there; it is not a successful live retrieval.

## Source failures and incomplete scopes

- [Schedule](https://www.grandvalleylax.com/schedule): **failed**, ROBOTS_DENIED; attempted 2026-11-09T21:19:59.327Z.
- [www.aylsports.org /home](https://www.aylsports.org/home): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:11:09.076Z.
- [www.grandvalleylax.com /about/about-us/9321](https://www.grandvalleylax.com/about/about-us/9321): **partial**, scope/pagination reconciliation remains incomplete; attempted 2026-11-09T21:38:54.942Z.
- [Synergy published clubs and programs](https://synergysportsoperations.com/our-brands/): **partial**, scope/pagination reconciliation remains incomplete; attempted 2026-11-09T21:38:48.962Z.
- [register.colorado.3dlacrosse.com /](https://register.colorado.3dlacrosse.com/): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:11:25.224Z.
- [www.spartanyouthclub.com /boyslacrosse](https://www.spartanyouthclub.com/boyslacrosse): **failed**, HTTP_403; attempted 2026-11-09T21:11:04.748Z.
- [www.hoopdreamsnation.com /noco-teams](https://www.hoopdreamsnation.com/noco-teams): **partial**, scope/pagination reconciliation remains incomplete; attempted 2026-11-09T21:50:11.998Z.
- [cdn1.sportngin.com /attachments/document/b6d7-3408270/26-01-28.Girls.Clubs_and_Codes_25-26.pdf](https://cdn1.sportngin.com/attachments/document/b6d7-3408270/26-01-28.Girls.Clubs_and_Codes_25-26.pdf): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:10:19.565Z.
- [teamsideline.com /sites/denverlacrosse/schedules](https://teamsideline.com/sites/denverlacrosse/schedules): **failed**, HTTP_522; attempted 2026-11-09T21:12:11.865Z.
- [team180elite.com /about-team180/](https://team180elite.com/about-team180/): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:11:22.134Z.
- [US Lacrosse Age Brackets](https://www.uslacrosse.org/sites/default/files/public/documents/rules/age-group-chart-17-18.pdf): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:20:05.739Z.
- [US Lacrosse Rules](https://www.uslacrosse.org/rules): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:20:09.028Z.
- [mountainlax.com /content/426/History](https://mountainlax.com/content/426/History): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:11:10.347Z.
- [usalacrosse.com/lacrosse-chest-protector-faq](https://www.usalacrosse.com/lacrosse-chest-protector-faq): **failed**, HTTP_404; attempted 2026-11-09T21:20:08.261Z.
- [www.denverjuniorsvc.com /](https://www.denverjuniorsvc.com/): **partial**, scope/pagination reconciliation remains incomplete; attempted 2026-11-09T21:48:13.637Z.
- [cdn3.sportngin.com /attachments/document/34fb-2753153/26-01-28.Boys.Clubs_and_Codes_25-26.pdf](https://cdn3.sportngin.com/attachments/document/34fb-2753153/26-01-28.Boys.Clubs_and_Codes_25-26.pdf): **failed**, ROBOTS_UNAVAILABLE; attempted 2026-11-09T21:10:21.607Z.
- [RMR official club directory](https://www.rmrvolleyball.org/page/show/6830537-club-directory): **failed**, HTTP_403; attempted 2026-11-09T21:12:12.214Z.

Full source observations, counts, dates and config histories are in the portable ledger. All 96 preserved prior source references remain in `preserved-source-inventory.json`; selection, prior evidence and current retrieval are separate fields. Unknown owners/regions remain unknown.

## Phase assessment

1. Prescribed capture: implemented; official RMR blocked, alternate scopes measured separately.
2. Independent benchmark: frozen before live trial, but small same-analyst purposive sample. Not an externally blinded statewide audit. Thresholds declared before scoring; several fail or cannot be measured.
3. Repeatable discovery: registered source jobs, bounded traversal, durable frontier and typed candidate graph work. Search leads were manually exported from generic public web searches. No unattended search-provider API is configured. Generic profile parsing still misses programs and produces candidates requiring review.
4. Refresh: executable job runner and live repeats work. Controlled change scenarios pass. No recurring scheduler is installed or tested over time.
5. Operational console: read-only, local-only snapshot drill-down works; no authenticated multi-user operations or consumer publication integration.
6. Acceptance: not met. Keep open-ended Build My Pathway and Collective Data disabled.

## Pilot blockers

- Obtain permitted official membership access and independently establish in-scope denominators.
- Expand source acquisition beyond a bounded manual lead set; independently adjudicate the complete output pool and collect a fresh external hold-out sample.
- Verify geography, youth eligibility, parent/league/season relationships and registration dates before publication.
- Configure and test a real scheduler, credentials where authorized, monitoring and recovery procedures.
- Add production authentication/authorization, audit retention policy and egress controls before remote operational use. Host checks are not comprehensive DNS-rebinding protection.
- Complete assistive-technology and physical-device QA.

No source restriction was bypassed. No private athlete rosters were imported. The consumer application, SIEM, Recruiting, Locked In, branding and source catalog remain unchanged.
