# Sports Discovery Engine v1 — diagnosis and coverage

Base: integrated RC `50ce75d`, inspected November 9, 2026. The diagnosis uses the original reviewed research, 513 normalized records, classification snapshots, actual API responses and paginated rendered directories. No source was freshly crawled or reverified during this build.

## Why lacrosse shows three and volleyball shows four

These are the default **Youth Clubs & Programs** views, not totals for every school, college, adult league, team or source URL. The source stages previously had no unified bridge to the visible-card count. The underlying artifacts contain only two classified lacrosse youth clubs and three classified volleyball youth clubs, supplemented by community providers. There is no evidence of a larger validated youth-club set being dropped from these two default views.

| Sport | Default youth organization cards | Explicit club-kind organizations | Other youth providers |
|---|---:|---:|---|
| Lacrosse | 3 | 2 | Mountain Recreation |
| Volleyball | 4 | 3 | YMCA of Northern Colorado |

Lacrosse clubs: **Denver Elite, Team 180 Elite**. Volleyball clubs: **Front Range Volleyball Club, Denver Juniors Volleyball Club, Colorado Skyline Juniors**. Team 180 / Urban Elite are aliases under the reviewed merged identity, not extra club cards.

## Named stage traces

| Record | Original evidence / ingestion | Classification | API and rendered result |
|---|---|---|---|
| 3d Colorado | Reviewed identity and Denver registration-office evidence retained as `3d-colorado`; subsequent official about-source access blocked | Youth eligibility/program scope unverified; `YOUTH_CLASSIFICATION_NOT_VERIFIED` | Not in youth API/HTML; retained review profile/evidence. No source-backed additional youth claim was invented |
| Denver Lacrosse Club | TeamSideline captured 58 independently expected participant rows under a league-organizer identity | No reviewed organization program; schedule participation does not establish club ownership | Organizer and participant evidence retained; not inserted as an assumed youth club |
| Air Academy, Arapahoe ELITE, Northfield JV, Regis JV | Actual named TeamSideline participant identities retained | Parent school/club, current season and relevant participation classifications require corroboration | Not top-level clubs, and not falsely published under the league as owner |
| Tou-Canned Sam, Down Hill, Grey Herd | Preserved CLL competition participants | 17 CLL participants lack independently reviewed owning organization relationships | Adult CLL league is accessible separately; participant labels are not 17 new clubs |
| Skyline 18 Royal (and ten other Skyline squads) | Latest extraction 0/11 expected; eleven original reviewed team identities retained | Verified historical identity/parent; current season unconfirmed | One Skyline club card, eleven nested/searchable teams; latest missing extraction is reported, not counted as eleven lost clubs |
| Denver Juniors 11 Kiki | Official list 18/18 expected, canonical parent retained | Reviewed child of Denver Juniors | One club card; team search finds the squad beneath it |
| RMR girls, boys and beach sources | Original directory links preserved, but membership retrieval blocked | Membership denominator unknown | No invented club names or zero-size complete import; all three source gaps retained |
| University of Denver, Regis, Colorado College | Reviewed college evidence/teams retained | College, not youth | Accessible under College, intentionally absent from default youth views |

The original TeamSideline normalizer used a source-level organizer as the reported parent. The graph now marks those raw edges **needs-review**, preserving the original records rather than promoting them into verified ownership. Only reviewed team/program assignments produce verified owning edges.

## Actual category counts

Counts are distinct organization cards per category, including community/program providers. An organization may appear in more than one category. Normalized totals include historical/retired records; they are not current accepting-registration counts.

| Sport | Stored orgs | Verified identities | Stored teams | Youth | High school | College | Adult | Professional | Community | Pending active team ownership |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| lacrosse | 13 | 13 | 87 | 3 | 0 | 7 | 1 | 0 | 1 | 75 |
| volleyball | 16 | 16 | 44 | 4 | 1 | 8 | 0 | 0 | 4 | 0 |
| basketball | 110 | 110 | 24 | 96 | 1 | 8 | 0 | 0 | 4 | 0 |
| swimming | 137 | 136 | 54 | 109 | 2 | 8 | 1 | 0 | 6 | 1 |

All 513 core records survive. The graph has 809 nodes (including the existing 296 program scopes) and 1069 evidence-linked edges. All 72 category/tool API views match their paginated HTML, with zero unexplained publication/record losses against the pinned RC baseline.

## Source scope and freshness

Registry: 96 source entries, preserving the engine registry and original research references, plus two configured archive replay examples. Statuses: 23 not-processed, 55 partial, 15 blocked, 3 needs-review.
There are 20 independently expected rows missing from latest source attempts, 15 blocked entries, 95 original open classification exceptions and 134 derived findings. These overlap and are not counts of unique missing clubs.

Source row denominators come from independent expectation manifests; publication retention uses a separate pinned RC baseline. Neither a page gateway nor the stored-record count is used as a statewide denominator. Expected denominators remain **unknown** when an independently reviewed list is unavailable.

| Source | Expected rows | Captured latest | Approved latest | Retained historical matches | Status |
|---|---:|---:|---:|---:|---|
| swim-mhsl | 21 | 21 | 21 | 0 | partial |
| swim-csscsa | 3 | 3 | 3 | 0 | partial |
| swim-sjsl | 7 | 7 | 7 | 0 | partial |
| swim-fsa | 8 | 8 | 8 | 0 | partial |
| swim-metro | 5 | 5 | 5 | 0 | partial |
| swim-aquawolves | 1 | 1 | 1 | 0 | partial |
| swim-aces | 1 | 1 | 1 | 0 | partial |
| swim-meet-candidates | unknown | 0 | 0 | 0 | blocked |
| volley-rmr-girls | unknown | 0 | 0 | 0 | blocked |
| volley-rmr-boys | unknown | 0 | 0 | 0 | blocked |
| volley-rmr-beach | unknown | 0 | 0 | 0 | blocked |
| volley-denver-juniors | 18 | 18 | 18 | 0 | partial |
| volley-skyline | 11 | 0 | 0 | 11 | partial |
| lax-dlc | 58 | 58 | 58 | 0 | needs-review |
| basket-cbc | 5 | 5 | 5 | 0 | partial |
| basket-aau | unknown | 0 | 0 | 0 | blocked |
| college-cmu | 7 | 7 | 7 | 0 | partial |
| college-fortlewis | 4 | 4 | 4 | 0 | partial |
| adaptive-denver | 3 | 3 | 3 | 0 | partial |
| adaptive-longmont | 4 | 4 | 4 | 0 | partial |
| adaptive-montrose | 1 | 1 | 1 | 0 | partial |
| parks-foothills | 2 | 2 | 2 | 0 | partial |
| parks-burlington | 2 | 2 | 2 | 0 | partial |
| facility-trinidad | 1 | 1 | 1 | 0 | partial |
| parks-breckenridge | 1 | 0 | 0 | 0 | blocked |
| college-adams | 5 | 5 | 5 | 0 | partial |
| college-pueblo | 5 | 5 | 5 | 0 | partial |
| college-coloradocollege | 7 | 7 | 7 | 0 | partial |
| nonprofit-specialolympics | 3 | 3 | 3 | 0 | partial |
| school-silvercreek | 1 | 1 | 1 | 0 | partial |
| swim-zone-team-scores | 78 | 78 | 0 | 0 | needs-review |
| swim-csi-embedded | 69 | 69 | 69 | 0 | partial |
| swim-csscsa-team-scores | unknown | 0 | 0 | 0 | blocked |
| basket-hdn-noco | 38 | 38 | 38 | 0 | partial |
| basket-hdn-soco | 30 | 30 | 30 | 0 | partial |
| basket-cybi | 1 | 0 | 0 | 0 | blocked |
| basket-ayl | unknown | 0 | 0 | 0 | blocked |
| basket-ccys | 1 | 0 | 0 | 0 | blocked |
| basket-elevation | 1 | 1 | 1 | 0 | partial |
| basket-swoosh | 1 | 0 | 0 | 0 | blocked |
| basket-psb | 1 | 1 | 1 | 0 | partial |
| basket-riot | 1 | 1 | 1 | 0 | partial |
| basket-warriors | 1 | 0 | 0 | 0 | blocked |
| basket-parker | 1 | 0 | 0 | 0 | blocked |
| swim-comsa | unknown | 0 | 0 | 0 | blocked |
| swim-durango-masters | 1 | 1 | 1 | 0 | partial |
| basket-goldcrown-program | 2 | 2 | 2 | 0 | partial |
| basket-goldcrown-feeders | 53 | 53 | 53 | 0 | partial |
| lax-3d-about | 1 | 0 | 0 | 0 | blocked |
| community-mountain-lacrosse | 1 | 1 | 1 | 0 | partial |
| community-ymca-basketball | 1 | 1 | 1 | 0 | partial |
| community-ymca-volleyball | 1 | 1 | 1 | 0 | partial |
| community-ymca-swimming | 1 | 1 | 1 | 0 | partial |
| school-niwot-girls-basketball | 4 | 4 | 4 | 0 | partial |
| school-niwot-boys-basketball | 1 | 1 | 1 | 0 | partial |
| school-niwot-girls-volleyball | 5 | 5 | 5 | 0 | partial |
| school-niwot-boys-volleyball | 4 | 4 | 4 | 0 | partial |
| school-niwot-girls-swimming | 2 | 0 | 0 | 0 | needs-review |
| replay-front-range | 1 | 1 | 1 | 0 | partial |
| replay-team180 | 1 | 1 | 1 | 0 | partial |

Source rows can represent clubs, provider cohorts, teams, schools or competition participants. Scopes overlap; summing them does not yield unique clubs. Original URLs, dates, raw evidence and source-specific expected IDs remain preserved. Archive replay has no new verification date and remains partial.

## Configuration-driven proof

Actual archive replays:
- `replay-front-range`: 1/1 expected identity, `partial`, original dates 2026-11-08; entity `front-range`.
- `replay-team180`: 1/1 expected identity, `partial`, original dates 2026-11-08; entity `team-180`.

Records before/after: **513/513**, payloads unchanged. This proves reuse and safe preservation of existing research, not fresh membership discovery. Automated tests separately add a comparable two-member synthetic web source using configuration and an extraction plugin, then corroborate the identities through another configured source with no page-code changes.

## Remaining coverage gaps

- Youth lacrosse club expansion and independently verified TeamSideline/CLL participant ownership; high-school lacrosse coverage.
- RMR girls/boys/beach membership extraction through permitted publisher-supported access, plus current volleyball team/season verification.
- Basketball feeder/provider cohorts are not confirmed competition teams; B & B possible alias is unresolved. AAU membership and openings remain unknown where unsupported.
- Swimming western/summer membership classifications, Burlington ownership, current schedules and seasonal vs summer eligibility. Retired combined “5 Parks Stingrays” is an explained correction, not an active missing club.
- Statewide school, adult, adaptive/community, recreational, elite and geographic gaps persist across all sports.
- No operational scheduler or ongoing monitoring is claimed. No new live clubs were added in this foundation build.

See `SPORTS-DISCOVERY-MISSING.md` for every named missing expected row and active classification/ownership gap. Full machine-readable traces are in `data/discovery/report.json`.

The source-to-card bridge explicitly distinguishes membership rows from parent organizations: Denver Juniors has 18 captured team rows mapping to one visible parent; Skyline has 11 retained historical team rows mapping to one visible parent despite 0 latest captured rows. These mappings use reviewed assignments, never the raw league-organizer parent field.
