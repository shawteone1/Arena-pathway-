# Sports Discovery Engine v1 — operator runbook

Branch: `codex/sports-discovery-engine-v1`; base: integrated RC `50ce75d58074485054e65e92a3b5413591cf1712`. The approved website, public directory rules, SIEM, recruiting, Locked In presentation, branding and original research/data files remain unchanged. This is a data-engine/reconciliation foundation, not an expanded statewide membership census.

## Architecture and artifacts

- `data/engine/registry.json`: preserved live-source configuration. `data/discovery/registry.json`: versioned inventory combining that registry, preserved raw-audit source records, all 22 original research links and two archive replay examples. Research references without an adapter/independent member list are not counted as processed data imports.
- `data/discovery/decision-tree.json`: sport-configurable organizational structures: association membership, club programs, competition participants, school/college, community provider, archived identities. The runner records the selected policy and observed/remaining steps. Policies require identity, parent, season and classification review; they never authorize automatic publication.
- `data/discovery/taxonomy.json`: registered sports, program types, states and regions. Current defaults remain the four Colorado sports. Future additions require explicit taxonomy/policy/source configuration, independent scope evidence and tests; they do not automatically add public navigation or extend approved product scope. The normalizer namespaces organizations by configured source state; out-of-scope visitors remain excluded.
- `engine/adapters/index.mjs`: extraction registry wrapping all existing HTML, JSON and PDF adapters; callers may register a pure extraction plugin and select an approved discovery structure. Unknown adapters/policies fail closed. Existing robots/host/terms/rate-limit controls stay in the source client. An adapter must not fetch arbitrary URLs or enumerate private rosters.
- `data/discovery/graph.json`: organizations (including explicit association identity where evidence provides one), programs, teams, leagues/competitions, divisions/seasons, facilities/events, evidence and typed relationships. No RMR association/club record is invented merely because its source URL exists. Reported league-organizer parents are needs-review edges; verified ownership requires a reviewed program/team assignment.
- `data/discovery/publication-baseline.json`: immutable retention baseline from RC `50ce75d`, including record hashes and per-category visible IDs. It is **not** a membership denominator. Independent source membership expectations remain in source-specific manifests.
- `data/discovery/source-bindings.json`: explicit evidence-based links from prior source identifiers to retained historical records; currently Skyline. A retained match never counts as capture in a failed/latest extraction.
- `data/discovery/report.json`: expected → captured → approved in latest run → published identity/category, named gaps, 513 full record traces, 72 actual API/HTML audits, retention regressions and derived findings. Operator identities not yet in the public snapshot are listed separately.
- `data/discovery/audit.json`: durable registry/expectation revisions, source-run bindings, discovery tasks, findings/review history and reconciliation history from the review database. Older imported runs without stored configuration snapshots remain unbound; their exact historical configuration is unknown, not reconstructed from today's config. All new runs bind versions before extraction.
- `data/discovery/replay-proof.json`: actual two-source replay proof, original dates, unchanged identities and source-specific expected counts. No live re-verification is implied.

SQLite migrations **006/007** are additive. They retain source configurations/expectation revisions, run bindings, tree versions, URL/opponent tasks, reconciliation history and named findings/reviews. Existing entity/program/source-evidence tables and raw imports are preserved. `EngineStore.report()`/export/restore now round-trip this history. Tampered version payload hashes are rejected transactionally. Do not edit already applied migration files.

## Read-only validation

Node.js 22.23.4 was used. No external source is fetched by the commands below.

```sh
npm run discovery:check
npm run check
```

`discovery:check` starts/stops a loopback web server and compares actual API and all paginated HTML results for four sports × six participation categories × club/program, league and team tools. It checks exact IDs, not just totals, and fails on unexplained lost/changed baseline records, duplicate cards, API/render disagreement, invalid graph edges or unsupported source-completeness claims. It never changes the public catalog.

Default check uses the committed reviewed audit. To inspect an operator database's newer staged/approved source observations as well:

```sh
npm run discovery:check -- --db=var/sports-discovery-review.sqlite
```

The public snapshot and live operator database are separate lanes. An approved database identity without a reviewed program/public snapshot is **not** counted as a visible club. No automatic publication occurs.

## Initialize and preserve the operator database

Use a new filename; never overwrite your only working database. The review artifact was generated using `var/sports-discovery-review.sqlite`.

```sh
export ARENA_DATA_DB=var/sports-discovery-review.sqlite
npm run data:bootstrap
npm run data:backup -- --out=var/discovery-before-import.sqlite
npm run discovery:build -- --db=var/sports-discovery-review.sqlite
```

Skip bootstrap when the database already contains work. `build` creates a fresh database from the reviewed snapshot only when empty, inventories versions/frontier/findings and updates **reporting artifacts** under `data/discovery/`. It does not export public application data. Existing review databases are retained; snapshot restore refuses to overwrite active work.

## Add another comparable source through configuration

1. Preserve its original URL and research context. Define its exact organization/member/team/season scope, access requirements, sport, state, allowed hosts, refresh interval, page budget and traversal pattern.
2. Choose an existing adapter and a structure from the decision tree; most directory changes require configuration, not a new parser. Add the source to `data/engine/registry.json`. If a new extractor is necessary, register it in `createAdapters()` or pass a plugin Map to `importSource`; keep extraction pure, use the existing client, and set `discoveryStructure` explicitly for an unmapped adapter. No website-page code is required.
3. Independently review the source list/page scope and commit `data/engine/expectations/SOURCE_ID.json` with original evidence URL, reviewed date/reviewer, expected record IDs/pages and whether the **defined scope** is closed. Never generate expected members from imported records. Unknown counts stay unknown; landing-only, unresolved pagination and unresolved members prevent completion.
4. Stage, inspect and approve only corroborated facts:

```sh
npm run data:import -- --source=SOURCE_ID
npm run data:report
npm run data:approve -- --run=RUN_ID --reviewer=REVIEWER --reason=REVIEW_RATIONALE --allow-partial
```

Partial approval does not mark the source complete. New identities enter the classification queue. Club ownership, audience, season, registration availability and AAU affiliation are not inferred from a name, schedule entry or registration URL. Unexplained source decreases cannot be approved; prior identities remain retained.

5. Review program/parent classification with actual evidence. Existing `data/unified/review-plan.json` and `data:classify` workflow remain in place. New source adapters retain documented organization/program facts; new unsupported classification patterns stay queued until a reusable reviewed mapping is provided. This v1 does not claim automatic semantic classification of every source. A verified identity alone is insufficient for public youth discovery.
6. After review, update the reviewed public snapshots and reconcile again:

```sh
npm run data:classify
npm run data:export
npm run discovery:build -- --db=var/sports-discovery-review.sqlite
npm run check
```

Review changes in original evidence, source versions, counts, missing members and API/HTML results before committing. Do not replace verified records with unreviewed source rows. Raw historical evidence and season distinctions remain intact.

For an intentional publication or record change, `data/discovery/review-decisions.json` supports explicit scoped decisions (`publication-loss`, `record-loss`, `record-change`) with exact key, reviewer, review date, reason and evidence URLs. This is a review trail, not a verified account or security authorization service. Do not regenerate the retention baseline to conceal losses. Other preservation tests and source approval rules remain independent safeguards.

## Replay existing reviewed research without re-crawling

Two real configured examples are in `data/discovery/archive-sources.json`: Front Range Volleyball and Team 180 Elite. Their independent **retention** manifests are explicit, not fabricated membership censuses.

```sh
npm run discovery:replay -- --source=replay-front-range --db=var/sports-discovery-review.sqlite
```

This stages an exact prior reviewed identity and preserves its evidence/date. Inspect and approve it with the existing data-approval command and `--allow-partial`; it remains partial and has no new source verification date. For the reproducible reviewed two-source proof:

```sh
npm run discovery:prove
```

`discovery:prove` uses `ARENA_DATA_DB`, or its own default review database, replays/approves **only unchanged prior identities**, and writes `data/discovery/replay-proof.json`. It does not approve new clubs or close discovery. Automated tests also demonstrate a second comparable synthetic web source through configuration and an extraction plugin, including real pagination and safe duplicate handling. Synthetic names never enter public application data.

## Findings and review

Coverage findings include named missing expected members, blocked/stale sources, unresolved source rows/pagination, classification gaps and retention regressions. They persist in SQLite; old findings become resolved only when absent from new factual reconciliation. Acknowledgment does not approve a record, waive a failing gate or close a source:

```sh
node scripts/sports-discovery.mjs acknowledge --db=var/sports-discovery-review.sqlite --finding=FINDING_ID --reviewer=REVIEWER --reason=REVIEW_NOTE
```

Classification and ingestion review queues remain authoritative for their respective steps. Ambiguous aliases such as B & B are retained for review rather than silently merged. A retired mistaken identity is reported as retired, not as an unexplained active-club loss.

## Refresh strategy — proposed, not operational

```sh
npm run discovery:refresh-plan
```

The plan reports last attempt, last verified source date, next due time and required action. It has no scheduler and performs no network or approval action.

- Association membership: weekly/season-change checks against independently reviewed membership revisions; expand permitted member/division/detail links and retain old membership evidence.
- Clubs/programs: weekly or publisher-appropriate intervals; review changes in program types, team parents, age/gender/levels and joining links. Current availability needs dated evidence.
- Teams/divisions/seasons: refresh around published season transitions; never reuse an old team as a new season or turn an age group into a club.
- Schedules: more frequent refresh only where terms/rate limits permit (for example daily). Keep cancellation/change history, original date text, explicit season confidence and historical/current separation.
- Blocked/access-restricted sources: respect robots, terms, API requirements, Retry-After and source budgets. Queue publisher-supported alternatives or manual evidence; never bypass controls or repeatedly hammer failures.
- Opponents and newly linked organizations: persistent discovery candidates requiring separate registered scope and corroboration, not automatic imports.

An operator may later provision a real scheduler around `data:refresh -- --execute`, with explicit database path, logging, overlap prevention and rate limits. That stages imports only. Configure and test the scheduler, provider access and failure recovery before calling monitoring operational. None is configured in this build.

## Failure recovery

Failed imports do not overwrite published records. Use `data:interrupt` only for an abandoned running job with a recorded rationale. Inspect staged rows and errors, fix source configuration/expectations through review, and rerun. Back up SQLite with `data:backup`; restore snapshots/backups to **new** database paths and validate source history and public retention before selecting them. Version hashes, run bindings and raw evidence must survive recovery. Do not delete failed-run evidence or use a fresh baseline to erase a discrepancy.

No secure family account, private integration, live-provider or hosting behavior was added. No application deployment or scheduler operation is authorized by these commands.
