# Acquisition v2 operator runbook

Read `AGENTS.md` and `docs/PRODUCT-NORTH-STAR.md` first. This additive branch is based directly on `codex/sports-discovery-engine-v1` at `5d554b947f5ad700fe2770b84b6a9511d8cedb7d`; integrated RC `50ce75d58074485054e65e92a3b5413591cf1712` is its ancestor. Review against the discovery branch first, not by duplicating underlying RC commits. No production deployment is included.

## Restore and inspect in Codespaces

Use Node.js 22 and the existing lockfile:

```bash
node --version
npm ci
npm run check
# Dedicated new SQLite database; never point bootstrap at a populated database.
node scripts/acquire-v2.mjs bootstrap --db=var/acquisition-v2.sqlite
node scripts/acquisition-console.mjs
```

Forward port 3101 **privately** in Codespaces and open it. This read-only internal snapshot console is separate from `npm start` on port 3000. It has no authentication and must not be publicly exposed. The console reads the exported ledger, not unsaved database state; export after acquisitions/reviews to update it. It shows actual source names, evidence, missing records, classification exceptions, pending reviews and consumer baseline counts; zero sources are monitored by a real scheduler.

If the default database already exists, choose a fresh path and set `ARENA_ACQUISITION_DB` for all subsequent commands. Bootstrap restores sources, configurations, frontier, runs, observations, versions, reviews and aliases transactionally. The cache is intentionally cold, so the first refresh retrieves full permitted content. Export is portable JSON; it contains no private family state.

## Acquire, validate and refresh

```bash
node scripts/acquire-v2.mjs run --job=prescribed-rmr
node scripts/acquire-v2.mjs run --job=alternate-volleyball
node scripts/acquire-v2.mjs run --job=lacrosse
node scripts/acquire-v2.mjs run --job=generalize
node scripts/acquire-v2.mjs run --job=generalize-basketball
node scripts/acquire-v2.mjs refresh --job=lacrosse --resume
node scripts/acquire-v2.mjs export
npm run acquisition:evaluate
npm run acquisition:acceptance
npm run acquisition:controlled
ARENA_QA_NO_SANDBOX=1 npm run test:acquisition:browser
```

The acceptance command intentionally exits **1** with the failed frozen live trial. Do not remove gates to make it green. The evaluator does not measure later assisted runs as a new blind success. `--force` does not bypass robots, rate limits or access controls. Use the browser sandbox where supported; the no-sandbox environment flag is only for this constrained QA environment.

Jobs are declared in `data/acquisition-v2/jobs.json`; adapter capabilities and extraction shapes are separate configuration. New comparable sources use configured source URLs, scope selectors/expected types and existing adapters, not consumer page code. Basketball HDN and swimming CSI live jobs demonstrate reuse. Benchmarks are never acquisition inputs. Search leads currently require a permitted external search/research step, not an operational AI discovery agent.

Review source access policies before adding jobs. Failed HTTP/robots sources remain failures. Alternate public sources have their own scope/access requirements and cannot certify a blocked official list. Shared host budgets, rate limits and pagination budgets apply. Terms requiring permission or APIs require review before running.

## Reviews and preservation

```bash
node scripts/acquire-v2.mjs review --record=RECORD_ID --decision=verified --reviewer=REVIEWER --reason=EVIDENCE_SUMMARY --evidence=https://official.example/source
node scripts/acquire-v2.mjs resolve-alias --from=RECORD_ID --to=CANONICAL_ID --reviewer=REVIEWER --reason=EVIDENCE_SUMMARY --evidence=https://official.example/source,https://official.example/alias
node scripts/acquire-v2.mjs export
```

Replace placeholders with actually reviewed evidence; these commands do not authenticate reviewers. Verification requires a current source observation. Reviews pin approved versions. A changed record creates a new candidate version without silently replacing an approved version. Alias review requires compatible sport/type and supporting URLs; duplicate names alone do not prove identity.

A complete independently bounded source can flag a disappeared member for review, never silently delete it. Unknown denominators, page budget exhaustion, layout failures and partial retrieval cannot retire members. Explicit `retired`, `excluded` and `reactivated` decisions retain history; reactivation requires fresh evidence. A failed refresh preserves prior successful observations and approved facts. New catalog reviews do not publish to the consumer website automatically.

## Recovery

Back up the dedicated SQLite database using SQLite backup while idle, or stop all jobs before copying the database and sidecars. Keep a committed/exported JSON snapshot as an additional portable recovery artifact. Do not run concurrent jobs against multiple copies and overwrite their exports. A single-active-job guard prevents same-job overlap; an external process lock is recommended for scheduler serialization. Inspect the run's failures/frontier, fix configuration or obtain permitted access, then `refresh --resume`. Do not delete the database to hide a failed run. Cold-bootstrap a trusted snapshot into a fresh database to recover; invalid references/hashes roll back.

## Scheduling (not installed or claimed operational)

`node scripts/acquisition-refresh.mjs` prints a plan without network activity. After permissions review and a successful manual run, an operator may install a scheduler. Example Linux cron entry (adapt absolute paths, ensure `flock` and Node 22 are installed):

```cron
15 3 * * * cd /workspaces/Arena-pathway- && ARENA_ACQUISITION_DB=/workspaces/Arena-pathway-/var/acquisition-v2.sqlite /usr/bin/flock -n /tmp/arena-acquisition.lock /absolute/path/to/node scripts/acquisition-refresh.mjs --execute --job=alternate-volleyball >> var/acquisition-refresh.log 2>&1
```

Test the exact command, logs, failure alerts, restart behavior and next-due decisions before describing monitoring as live. Codespaces may sleep; cron there is not a reliable production service. No recurring scheduler, provider account authorization, external search API, authenticated operations dashboard or production publication pipeline was configured by this build.

## Evidence limitations

Original historical evidence/research remains untouched. V2 ships source URLs, structured extraction facts, retrieval timestamps, config versions and body hashes. `evidence/retrieval-receipts.json` preserves observations, not raw response bodies. Probe `workspaceFile` paths are local scratch references and not portable archives. Full newly retrieved HTML was deliberately not included because pages can contain unrelated personal/contact/roster material. Body hashes cannot reconstruct publisher pages. A privacy-reviewed raw-evidence archive and retention policy remain operational work. Unknown owners, dates, geography and relationships remain unknown.
