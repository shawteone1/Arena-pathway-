# Colorado Data Engine v1

Development branch: `codex/colorado-data-engine-v1`. Review target: `codex/arena-pathway-v07-review`. No merge, preview update, deployment or production write is part of this change.

The engine adds a reviewed, first-party catalog overlay. It does not replace `data/catalog.json`, the approved AP artwork, sport environments, navigation, profiles, media preferences, recruiting planner or calendars. Browser-local athlete/parent persistence is unchanged. The workspace lookup now also recognizes saved divisions and facilities. There are no additional portals.

## Runtime and storage

Use **Node.js 22.13 or newer** (verified with 22.23.4). The engine uses Node's built-in `node:sqlite` (experimental warning on Node 22), with foreign keys, WAL, full synchronous commits, busy timeouts, migration checksums and same-source run locks. Run `npm ci` to install the pinned HTML parser, robots parser and proxy-aware HTTP client. Public aggregate PDFs additionally need the system `pdftotext` executable (Poppler); without it, that source is blocked rather than silently treated as imported. HTML ingestion and the website do not need Poppler.

The default database is `var/colorado-data-v1.sqlite`, configurable with `ARENA_DATA_DB` or `--db=/absolute/path`. The database and WAL files are ignored by Git. Use a durable, backed-up writable volume for an operator database. The application reads the committed `data/engine/approved.json` snapshot; it neither opens SQLite nor ingests live data during web requests. Restart the application after an approved export to load the new snapshot.

The migration path is `engine/migrations/*.sql`; ordered checksum-verified migrations run when the operator opens a database. Typed entities and relationship tables can later move to a managed SQL database, but that backend has not been implemented or tested. Do not place SQLite on a shared network filesystem or let multiple application instances manage separate competing copies.

Node 22 is compatible with the repository's Node start command and `PORT`-based server configuration. The actual GoDaddy/Airo runtime version, writable persistent volume, system PDF utility, process restart semantics and external scheduler are **not verified**. No hosting configuration or preview was changed. If Airo cannot provide durable SQLite/Poppler, run ingestion in an operator environment and transfer only the reviewed snapshot; keep the existing website start command.

## Architecture and review boundary

- `engine/models.mjs`: normalized models, stable identities, reconciliation and graph/season/freshness validation.
- `engine/adapters/`: scoped HTML membership, club navigation, college programs, standings, schedule, team-only PDF and documented JSON adapters. Selectors restrict extraction to organization/team/program facts; raw pages, contacts and swimmer rows are not stored.
- `engine/fetcher.mjs`: explicit host registration, public HTTPS paths, publisher access review, own user agent, robots checks, redirect checks, host rate reservations, crawl delays, size/time limits and persistent Retry-After cooldowns. An unreadable robots file, access denial or unsupported API is a review issue. No proxy rotation, credential borrowing or crawler impersonation is used.
- `data/engine/registry.json`: source scope, locations, sports, formats, refresh interval, traversal rules and access-review basis. Public access eligibility is a scoped operator review, not a claim of publisher endorsement or a blanket license. Recheck each publisher's applicable terms/API requirements before expanding scope.
- `data/engine/expectations/*.json`: separately reviewed source-specific membership IDs, page URLs, census notes, reviewer/date and evidence URL. These are independent of imported entities. Never create a denominator by counting the database. An expectation is bounded to its stated source subset; it is not a statewide census.
- `engine/store.mjs`: durable staging, evidence, runs, queue, approvals, relationships, revisions, safe inserts, protected reviewed entities, audited retirement and atomic exports.
- `src/engine-directory.mjs`: combines the original catalog with only active verified additions. Unresolved games, candidates and retired identities are not directory entries. The public source list includes evidence attached to published additions, not every unreviewed candidate.

Organizations, actual team identities, leagues, divisions, competition seasons, events, locations and community resources are separate entities. Distinct seasons/divisions/genders remain distinct. A named meet participant is a candidate until its Colorado affiliation and identity are corroborated; Unattached and explicit out-of-state rows are excluded. Unknown geography, gender/coed, levels, seasons and affiliations stay null/unknown. No AAU membership is inferred from the sport basketball. A year-round recreational CARA program is not automatically a USA Swimming club or summer league.

Imported entity changes never overwrite existing reviewed payloads automatically. A conflicting re-import fails approval transactionally and requires a separate field/evidence review. Evidence IDs and native source labels are not canonical identity fields. Retire mistaken engine additions with a named rationale and evidence run; retire/reconcile their dependents first. The legacy catalog cannot be retired through this engine. All revisions remain in the audit history.

## Execute and validate an import

From the repository root:

```bash
node --version
npm ci
npm run data:bootstrap
npm run data:validate
npm run data:refresh
npm run data:import -- --source=swim-mhsl
```

`data:bootstrap` restores the committed sanitized audit snapshot into a fresh database, preserving reviewed records, import candidates, runs, approvals, reviews and revisions. It refuses a database with existing import work. Bootstrap once per new operator database. If starting independent discovery without the portable audit, an import seeds the original reviewed catalog automatically instead. Do not run bootstrap over an existing working database.

`data:import` stages candidates; **it does not publish**. Omitting `--source` attempts all registered sources. `--max-pages=3` can bound exploratory work, but pending pages force a partial status. `--new-only` skips sources that have any recorded attempt. Requests remain sequential within an import; never parallelize repeated imports to defeat source rate limits.

Inspect source runs, independent expectations, sanitized candidates and the open queue:

```bash
npm run data:report > /tmp/arena-source-audit.json
node scripts/data-engine.mjs reviews
```

Review every eligible source row, exclusion, duplicate, unexpected member, pending page, pagination and season. Update independently reviewed expectations from source evidence, never from imported totals. A source with unresolved members or links remains partial/blocked/needs-review. A landing page or a single record cannot complete an association import. Open scope currently prevents every registered source from being certified complete.

To approve a separately verified subset of a partial source, provide an explicit rationale:

```bash
npm run data:approve -- --run=RUN_ID --reviewer='Your name' --reason='Exact reviewed scope and evidence' --allow-partial
npm run data:validate
npm run data:export
node scripts/data-coverage-report.mjs
npm run check
```

Approval only admits independently expected import/duplicate rows. Unexpected or unresolved records remain staged/reviewable. A run with no independent expectation, a blocked run, duplicate source rows or an unexplained total decrease cannot be approved. Graph conflicts roll back the complete transaction. Reapproving the same run is idempotent; re-importing a known identity reuses its ID and does not multiply teams. Source counts distinguish candidate, pending staged, approved imported, duplicate, excluded and unresolved outcomes. Re-imports never delete records that disappear upstream.

The snapshot and coverage Markdown are the reviewable delivery artifacts. Commit them on the development branch. Exporting locally is not permission to update an external preview or deploy.

## Failure recovery and audit operations

Before a long refresh or operator change:

```bash
npm run data:backup -- --out=/absolute/safe/path/arena-before-refresh.sqlite
```

This uses SQLite `VACUUM INTO` for a consistent snapshot and refuses an existing target. Do not copy a live SQLite file without its WAL. For recovery, stop the operator import process, copy the backup to a **new** database path (keep the current database for investigation), then validate it:

```bash
cp -n /absolute/safe/path/arena-before-refresh.sqlite /absolute/safe/path/arena-recovered.sqlite
npm run data:validate -- --db=/absolute/safe/path/arena-recovered.sqlite
npm run data:report -- --db=/absolute/safe/path/arena-recovered.sqlite
```

Use the restored database only after inspecting the report. Alternatively bootstrap the committed snapshot into another fresh `--db` path. No operator command resets or overwrites the working database. A failed source attempt has a durable blocked report; reviewed entities remain intact. Retry only after addressing the reported access/parser/rate issue and observing the cooldown. Do not bypass a publisher block.

After a killed process, confirm it is no longer running before releasing its source lock:

```bash
node scripts/data-engine.mjs interrupt --run=RUN_ID --reason='Operator confirmed the process terminated'
```

This records an interrupted, blocked attempt. It does not approve candidates or alter reviewed entities. Re-import normally afterward. To close a review issue without changing data:

```bash
node scripts/data-engine.mjs resolve --review=ISSUE_ID --reviewer='Your name' --reason='Evidence and disposition'
```

Closing an issue does not mark a source complete or approve a run. To retire a mistaken nonlegacy import, use `retire --entity=ID --run=EVIDENCE_RUN_ID --reviewer=NAME --reason=RATIONALE`; dependent active records must be handled first. Retirement retains prior versions and does not change the reviewed v0.7 catalog. Source totals may decrease only with a documented source-specific `decreaseReason`, while independent missing memberships still remain visible.

## Scheduled refresh support

`npm run data:refresh` is a dry-run due-source plan. `npm run data:refresh -- --execute` stages due imports, honors rate limits and leaves review/approval/export manual. It never auto-publishes. No external cron, GitHub Action, hosting scheduler or monitoring process is installed; scheduler configured/tested/operational remains false in reports.

After separate scheduler authorization, an operator could configure a job equivalent to the following on a machine with Node 22, the repository dependencies and a durable database:

```text
0 4 * * * cd /path/to/Arena-pathway- && ARENA_DATA_DB=/durable/arena.sqlite /absolute/path/to/node scripts/data-engine.mjs refresh --execute >> /durable/refresh.log 2>&1
```

Use the scheduler's concurrency lock, controlled timezone, failure alerts and log rotation. First test a manually invoked scheduled job, a cooldown/blocked source, a crash and backup recovery. Record real scheduler configuration and test evidence before changing operational status. This example has not been installed or executed as a scheduler.

## Directory behavior and QA

Existing first-party pages gain geography, sport, gender/coed, participation, season, competition and program/competition-type filters. Swimming separates year-round USA Swimming, summer leagues, high school and college, with unclassified entries retained. Actual team names, organizational parents, source references and unknown fields appear within Arena Pathway. Historical dates are labeled; unconfirmed-year games are not published. New college organizations join the recruiting planner's existing school relationships.

The test suite covers independent missing teams, landing-only completion, unresolved frontier/pagination, duplicates, orphan/cross-sport relationships, incorrect seasons/competitions, mixed swimming types, stale events, unexplained decreases, public-source access controls, rate limits, privacy, transactional review, protected baseline records, idempotency, migrations, recovery, routes, filters and saved-entity lookup. Existing application and branding tests remain. The original catalog/query/application-test fixture hashes remain protected. Workspace and profile-state behavior now has dedicated independent-module regression tests; see PATHWAY-MODULE-CHOICES.md.

The initial data-engine delivery had no browser-controlled screenshot run. The subsequent workspace correction includes Chromium phone/tablet/desktop interaction checks and screenshots; see PATHWAY-MODULE-CHOICES.md. Real iOS Safari and assistive-technology review remain outstanding. Broader directory review: iPhone and iPad filter disclosure/keyboard use; Sports dropdown and touch targets; long organization/team names; horizontal overflow of filters/tables; focus order and screen-reader labels; loaded-photo contrast; saved facility/division persistence and college recommendations; large swimming/lacrosse result sets. Structural CSS and HTTP checks do not establish visual or touch QA.
