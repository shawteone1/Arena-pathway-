# Live qualification recovery — results

**Live acceptance remains failed.** Base `38ddb29e`, branch `codex/live-qualification-recovery`. Original source research, history, application, catalog and approval pins are preserved.

## Fresh source-separated live reference test

The eight-case sample excludes both earlier benchmark sets and was hash-frozen before recovery implementation/acquisition. Intake reads logged generic search results and publisher/member links, never benchmark names/URLs. Same analyst assembled references and reviewed facts; this is **not an external blind audit**. Five independently checked reference pages were blocked; their indexed publisher claims remain provisional reference evidence, not live qualification. The purposive sample supports no statewide estimate.

| Sport | Expected references | Verified identity recall | Reviewed CO + published youth | Verified current offering | Organization profile eligible | Published |
|---|---:|---:|---:|---:|---:|---:|
| lacrosse | 4 | 1/4 | 0/4 | 0/4 | 0 | 0 |
| volleyball | 4 | 2/4 | 2/4 | 0/4 | 2 | 0 |

Overall: **3/8 identity recall (37.5%); 2/8 reviewed Colorado/published-youth evidence (25%); 0/8 current-program recall; zero publications.** Thresholds were not reduced. Full-pool precision, classification accuracy and current membership freshness remain unknown. The acceptance command exits 1.

### Named fresh-sample outcomes

- [Denver City Lax](https://citylaxdenver.org/programs/): Public-source retrieval blocked: ROBOTS_UNAVAILABLE
- [Bison Lacrosse Club](https://www.bisonlaxclub.com/): Identity reviewed; geography or owned youth-program evidence incomplete.
- [Grizzlies Girls Lacrosse](https://www.grizzliesgirlslacrosse.org/): Publisher not reached by the declared query/member frontier; no identity can be verified.
- [Mountain Lacrosse League](https://www.mountainlax.com/content/872/General-Information): Publisher not reached by the declared query/member frontier; no identity can be verified.
- [The EDGE Volleyball Club](https://www.theedgevc.com/developmental): Scoped organization/location/published-youth evidence reviewed; active dated program and registration remain unproven.
- [Colorado Boom Volleyball Club](https://coloradoboom.com/): Scoped organization/location/published-youth evidence reviewed; active dated program and registration remain unproven.
- [Alliance Youth Sports Association](https://allianceyosa.sportngin.com/youthprograms): Public-source retrieval blocked: HTTP_403
- [Colorado Springs Altitude Volleyball Club](https://www.csavbc.org/page/show/1920794-contact-us): Publisher not reached by the declared query/member frontier; no identity can be verified.

## Known twelve: recovery diagnostics, not the fresh acceptance set

| Organization | Source-reviewed identity | Reviewed CO + published youth | Verified current program |
|---|---|---|---|
| NORCO | no new verification | unresolved | no |
| Elevation Volleyball Club | no new verification | unresolved | no |
| Colorado Momentum Volleyball Club | no new verification | unresolved | no |
| ClubOne Volleyball | no new verification | unresolved | no |
| Prime Volleyball Academy | yes | yes | no |
| VC Denver | yes | yes | no |
| Boulder Valley Lacrosse | yes | yes | no |
| Foothills Pack | yes | yes | no |
| Warriors Youth Sports | no new verification | unresolved | no |
| Littleton Youth Sports | yes | unresolved | no |
| Denver United Lacrosse | no new verification | unresolved | no |
| Ranger Youth Lacrosse | yes | yes | no |

Four of the six previously missing lacrosse publisher identities were recovered: Boulder Valley, Foothills Pack, Littleton and Ranger. Three now have reviewed Colorado/published-youth evidence. Littleton still lacks acquired state/service-area proof. Warriors was source-discovered but robots could not be verified. Denver United never surfaced in the bounded selected generic/member frontier; it is a discovery miss, not demonstrated inaccessibility. Its previously known benchmark URL was not inserted as a seed.

Prime and VC Denver now have reviewed Colorado/published-youth evidence. NORCO, Elevation, Momentum and ClubOne retain their original directory observations; their official program sources were not newly qualified in this run. Prior 403/robots failures are preserved as historical evidence, not described as new attempts today.

These are **published organization/program facts, not verified active participation or open registration**. A current offering needs an explicitly reviewed active date interval and same-program association. None was established. The old zero-current-program problem remains.

## New scoped review assessments

There are 19 source-bound identity review receipts; 13 also support Colorado and a publisher-operated youth program. Some organizations already existed. These are additional scoped review records, **not 19 new clubs**, and do not change the legacy generic approval flag or consumer catalog. Review scopes, versions, body hashes, selector descriptors, URLs and dates are stored in `scoped-reviews.json` and `evaluation.json`.

| Organization / provider | Evidence page | Reviewed CO/youth | Profile eligible | Current program eligible |
|---|---|---|---|---|
| Synergy Sports Operations | [publisher](https://synergysportsoperations.com/about-us/) | incomplete | no | no |
| Colorado Boom Volleyball Club | [publisher](https://coloradoboom.com/) | yes | yes, with current-status unknown disclosure | no |
| Boulder Elite | [publisher](https://www.boulderelite.com/) | incomplete | no | no |
| The EDGE Volleyball Club | [publisher](https://www.theedgevc.com/developmental) | yes | yes, with current-status unknown disclosure | no |
| Denver Lacrosse Club | [publisher](https://www.denverlacrosse.org/boys-spring) | yes | yes, with current-status unknown disclosure | no |
| City of Colorado Springs | [publisher](https://coloradosprings.gov/parks/page/colorado-springs-youth-lacrosse) | yes | yes, with current-status unknown disclosure | no |
| South Suburban Parks and Recreation | [publisher](https://www.southsuburbansports.com/youth-lacrosse) | incomplete | no | no |
| Foothills Pack | [publisher](https://www.foothillspack.com/) | yes | yes, with current-status unknown disclosure | no |
| Prime Volleyball Academy | [publisher](https://www.primevolleyballacademy.com/) | yes | yes, with current-status unknown disclosure | no |
| Northern Power Lacrosse | [publisher](https://northernpowerlax.com/) | yes | yes, with current-status unknown disclosure | no |
| Grand Valley Lacrosse | [publisher](https://www.grandvalleylax.com/about/about-us/9321) | yes | yes, with current-status unknown disclosure | no |
| Littleton Youth Sports | [publisher](https://www.littletonyouthsports.org/lacrosse-faqs) | incomplete | no | no |
| Kings Lacrosse Club | [publisher](https://kingslacrosseclub.com/) | incomplete | no | no |
| Boulder Valley Lacrosse | [publisher](https://www.boulderlacrosse.org/) | yes | yes, with current-status unknown disclosure | no |
| Bison Lacrosse Club | [publisher](https://www.bisonlaxclub.com/) | incomplete | no | no |
| Rise Volleyball Club | [publisher](https://www.risevbcolorado.com/) | yes | yes, with current-status unknown disclosure | no |
| VC Denver | [publisher](https://www.vcdenver.org/youth-program) | yes | yes, with current-status unknown disclosure | no |
| Ranger Youth Lacrosse | [publisher](https://www.rangerlacrosse.org/about/about-us/18227) | yes | yes, with current-status unknown disclosure | no |
| Jets Lacrosse Club | [publisher](https://www.jetslacrosse.com/) | yes | yes, with current-status unknown disclosure | no |

## Acquisition scope and limits

The final test comprises 72 distinct sources across the latest root/link/parent/member runs. An earlier development pass is retained in history and is excluded from fresh-sample scoring; cumulative recovery may use still-valid dated evidence from that pass. No fixture is scored as live acquisition.

Generic public searches were invoked through the connected research tool and logged with ranks/URLs. The executable acquisition process consumes those logs. No unattended production search API or scheduler is configured. Membership traversal is budgeted and partial; the Colorado-table link extraction produces source candidates, not automatic organizations or teams. Raw national/mixed-region links never establish Colorado eligibility.

Media/articles and directory publishers surfaced among search results. They remain unverified candidates; they are not promoted as sports organizations. Full output-pool adjudication and broader sources remain required. Current-date extraction supports explicit month/day/year intervals; ambiguous seasons, one-year date ranges and registration headlines require further review, not automatic activation.

## Retrieval failures

- [Frequently Asked Questions – Rocky Mountain Storm Lacrosse](https://rockymountainstormlacrosse.teamsnapsites.com/faq/): HTTP_410: Public source returned HTTP 410; attempted 2026-11-10T15:57:07.726Z; last success none.
- [Mesa Juniors Volleyball Company](https://www.mesajuniors.org/): HTTP_403: Public source returned HTTP 403; attempted 2026-11-10T15:57:51.504Z; last success none.
- [Ranger Lax Fall Registration](https://www.rangerlacrosse.org/program/ranger-lax-fall-registration/13358): RATE_LIMIT: HTTP 503; Retry-After not provided. No automatic immediate retry.; attempted 2026-11-10T15:53:59.792Z; last success none.
- [Arapahoe Youth League](https://www.aylsports.org/home): ROBOTS_UNAVAILABLE: Robots could not be verified (HTTP 406); attempted 2026-11-10T15:57:15.253Z; last success none.
- [Warriors Youth Sports](https://www.warriorsyouthsports.com/content/34032/LAX-FAQ): ROBOTS_UNAVAILABLE: Robots could not be verified (HTTP 406); attempted 2026-11-10T15:57:19.057Z; last success none.
- [Boys Lacrosse](https://www.spartanyouthclub.com/boyslacrosse): HTTP_403: Public source returned HTTP 403; attempted 2026-11-10T15:57:29.284Z; last success none.
- [Programs | Denver City Lacrosse](https://citylaxdenver.org/programs/): ROBOTS_UNAVAILABLE: Robots could not be verified (HTTP 202); attempted 2026-11-10T15:57:08.615Z; last success none.
- [Ranger Youth Lacrosse](https://www.rangerlacrosse.org/): ERROR: Source host refresh window is not due; attempted 2026-11-10T15:56:59.547Z; last success 2026-11-10T15:51:59.038Z.
- [Youth Programs](https://allianceyosa.sportngin.com/youthprograms): HTTP_403: Public source returned HTTP 403; attempted 2026-11-10T15:58:14.153Z; last success none.
- [Volleyball - City of Aurora](https://www.auroragov.org/things_to_do/recreation___sports_programs/youth_sports/volleyball): ROBOTS_UNAVAILABLE: Robots could not be verified (HTTP 301); attempted 2026-11-10T15:57:52.507Z; last success none.
- [10th Mountain Lacrosse](https://www.10thmtnlax.com/): HTTP_403: Public source returned HTTP 403; attempted 2026-11-10T15:57:05.272Z; last success none.

All remaining record-level gaps—including type/identity, Colorado, youth ownership, dates and registration—are named in `data/qualification-recovery/review-queue.json`. Unprocessed member links are retained in `member-candidates.json`. No unresolved rows are silently omitted from those reports.

## Validation / release decision

147 Node.js 22 tests and 23 Chromium browser checks passed. Engineering tests do not override the failed live gate. All 408 prior staged records and their approved pins/semantic versions were retained; a separate preservation check covers complete historical objects. Existing website, family workspace, SIEM, Recruiting, Locked In, branding and navigation remain unchanged. Physical iPhone/iPad Safari, an external blind audit, secure reviewer accounts, integration/security/load testing and a real scheduler remain untested/unconfigured.

**Not ready for open-ended discovery, current-opportunity claims or publication.** Next useful work is permitted source access, better independent source coverage, complete-output adjudication and dated program evidence—not another redesign or relaxed qualification rule.
