# Unified sports development and operations

Branch: `codex/unified-sports-data-ux`, based on reviewed `codex/colorado-data-engine-v1-review` at `c13de90`. No merge or deployment is authorized.

## Codespaces preview

Use Node.js 22.13+ (verified here on 22.23.4).

```sh
nvm install 22
nvm use 22
npm ci
npm run check
PORT=3000 npm start
```

Forward port 3000 in Codespaces and open its preview. No database service is needed for the web preview: it reads committed reviewed audit/catalog snapshots. Profiles, saved items, module choices, schedules and recruiting plans remain browser-local per family profile, not secure server accounts. Media and recruiting require opt-in. Existing local storage keys are preserved.

## Database and safe import workflow

Back up the existing operator database first. Additive SQLite migrations 004/005 create programs, team assignments, classification reviews/history, canonical identity links, program evidence and registration references; original entity payloads remain intact. Do not replace an existing database with an empty one. To create a separate operator copy from the reviewed snapshot:

```sh
export ARENA_DATA_DB=var/unified-sports-v1.sqlite
npm run data:bootstrap
npm run data:backup -- --out=var/unified-before-import.sqlite
npm run data:import -- --source=SOURCE_ID
```

Inspect the run's raw evidence, candidate decisions, expected membership IDs, pagination/frontier, exclusions, missing members and warnings using `npm run data:report`. Expectation manifests must be independently reviewed from the published source scope before import, never derived from captured database rows. An inaccessible source remains blocked/needs-review; do not bypass controls. Never import athlete rosters or personal minor information.

Approve only reviewed facts, naming the reviewer and evidence-based rationale:

```sh
npm run data:approve -- --run=RUN_ID --reviewer=REVIEWER --reason=REVIEW_RATIONALE --allow-partial
```

`--allow-partial` permits reviewed identities from a partial source; it does not declare discovery complete. New organizations/teams automatically enter the classification queue. Review `data/unified/review-plan.json` and add explicit evidenced program classifications/ownership decisions, never assume an organizer owns participants or that a URL means registration is open.

```sh
npm run data:classify
npm run data:export
npm run data:validate
npm run validate:participation
npm run check
```

Commit both audit and slim participation artifacts together, plus registry/independent expectations and refreshed coverage reports. The classifier refuses silent program/team-link removal. Review revisions preserve prior classifications and raw normalized evidence. Registration references are separately stored and have unknown availability unless dated evidence establishes otherwise.

## Recovery and refreshes

Imports stage candidates separately from reviewed records. Failed imports do not replace the approved catalog. For an abandoned running job, use `npm run data:interrupt -- --run=RUN_ID --reason=...`, investigate, then re-import. Restore a backup or bootstrap an audit into a **new** database path; validate before selecting it. Never delete the only working database. SQLite backup uses VACUUM INTO and requires a new destination filename.

`npm run data:refresh` reports due sources without fetching. `npm run data:refresh -- --execute` performs imports but does not approve them. A real scheduler is **not configured, tested or operational**. Operators must configure one with explicit environment/database path, logging, overlap prevention and rate limits, then test failure handling before claiming monitoring.

## QA and hosting

Automated: `npm run check`. Browser: install Python Playwright and Chromium, then `ARENA_QA_NO_SANDBOX=1 python scripts/qa-unified.py` only in an isolated trusted development container. Browser script starts a local Node server, uses isolated browser storage and writes screenshots to ignored `var/pathway-qa/`.

Node 22 local startup, route tests and SQLite bootstrap were verified. GoDaddy/Airo was not modified or exercised; deployment remains a separate approval step. Its actual Node version, persistent writable volume, native SQLite support, proxy/port environment and optional `pdftotext` PDF dependency must be verified on the hosting account before deployment. Keep ingestion operator-side unless a durable hosting environment is explicitly provisioned. No runtime Playwright requirement.

Physical iPhone/iPad, Safari/WebKit, VoiceOver, secure accounts and production scheduler remain untested/unimplemented. Chromium viewport QA checks menu operation, filtering, module controls, keyboard access, touch targets and horizontal overflow; it is not a full accessibility certification.
