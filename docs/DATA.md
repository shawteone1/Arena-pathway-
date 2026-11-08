# Catalog maintenance and coverage

The catalog is a reviewed snapshot, not a live statewide registry. Each record
has a stable ID, entity type, sport, source IDs and explicitly known fields.
Sources include a direct URL, review date, scope and short evidence summary.
No athlete names, rosters of minors or private contact details were imported.

## Entity boundaries

Organizations are clubs or whole swim teams. Named age/grade squads are separate
team records linked to an organization. Collegiate teams link to a school.
Leagues and divisions are independent records; linking a league does not imply
its teams have been imported. Community entries are sourced organization contacts,
not an invented social network. Opportunities distinguish published dates from
undated program information. A source URL is never itself a team record.

## Reviewed expansions

- Western Slope League: all 16 named member rows expanded into whole swim-team
  organizations. The source does not establish season or division membership.
- Willow Creek III division table: all five named teams expanded, with one
  division subset. Official division title and season remain unknown; this is
  not the complete Mile High Swim League.
- Denver Juniors: 18 named West teams expanded from official navigation.
- Colorado Skyline: 11 named teams expanded from official navigation.
- CBC: five named team links expanded. Conflicting child-page titles are flagged;
  no season or roster availability is assumed.
- University of Denver: seven launch-sport collegiate programs expanded.
- Colorado State and Regis: four launch-sport programs each expanded.
- Colorado Lacrosse League: five fall box division headings expanded. Box member
  teams remain unknown. Separately, 18 unique field-schedule labels were reviewed
  and 17 teams expanded into Super Masters, Competitive and Recreation divisions.
  “Bye Week” is excluded as ambiguous. The spelling “Genisis LC” is retained from
  the source. Calendar years are not explicit on each schedule card, so those
  games are not invented as dated opportunities. Adult teams are labeled and
  excluded from default athlete/family recommendations.
- RMR January 2026 boys-club PDF: search-index discovery evidence only; the full
  source returned HTTP 403. Zero completed membership imports are claimed.

These are completed *reviewed subsets* where marked, not complete statewide
imports. Source coverage can change without a repository update.

## Add or update records

1. Read an official club, association, school or scheduling source. Record its
   direct URL, review date, published date when present, and exact scope.
2. Extract underlying named records, not only the discovery URL. Do not turn
   offered age ranges into inferred named teams. Preserve unknown season,
   division, location and availability fields rather than guessing.
3. Match existing names and aliases. Team 180 / Urban Elite are aliases of the
   merged Team 180 Elite organization; they are not extra clubs. Match team
   identity within its organization and season. Review cross-source matches
   before assigning a new ID.
4. Store an independently reviewed `imports[].expectedIds` list. Record candidate
   totals and exclusions when applicable. Update that manifest only after
   comparing the actual source rows, not simply copying current data counts.
5. Set `needs-review` for conflicts or ambiguous exclusions. A snapshot can have
   all expected rows present while its current season remains unconfirmed.
6. Run `npm run validate:data` and `npm test`. Validation rejects missing sources,
   orphan parent links, duplicate names/aliases, duplicate team identities,
   unreconciled candidate counts, invalid dates and missing expected rows.
7. Review the application’s `/data` page and sport search results. A source newly
   added without underlying records must never increase the imported team count.

## Freshness

Source reviews expire after 90 days. Review dates indicate a page was examined,
not that every listed program was contacted. Null seasons display as unconfirmed.
Event dates use separate published evidence; dated past events remain visible
as past in personal schedules. There is no automatic updater or live feed.
Future validation improvements: field-level evidence, persisted raw-source
snapshots / hashes, automatic conflict suggestions and full statewide denominators.

## Coverage gaps

Statewide totals are unknown. High-school, recreational and collegiate coverage
remains partial; only three schools are currently cataloged. Additional clubs,
swim leagues and regional associations remain to be reviewed. Dated camp coverage
is incomplete, particularly lacrosse and swimming. CBC team page conflicts and
CLL season years need organizer confirmation. Production should use a database,
review queue and scheduled provenance checks before claiming reliable live data.
