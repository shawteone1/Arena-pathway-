# Live qualification recovery — review runbook

Base: `codex/live-discovery-failure-analysis`, `38ddb29e275247207720fc00d1446e5035343cf1`.
Head branch: `codex/live-qualification-recovery`.
Read `AGENTS.md`, the governing Product North Star and [RESULTS.md](RESULTS.md) first.

## What changed

The existing acquisition engine now captures scoped public evidence with URL/body hash/date and selectors in the published HTML projection, projects a recognized public provider HTML-fragment format without reading configuration as facts, and retains permitted navigation/home links for discovery. A separate qualification assessment requires explicit version/hash-bound source reviews. Identity, Colorado location/service area, publisher-operated youth program, active date interval and registration availability are distinct states. Cross-page evidence needs actual captured same-publisher links and explicit review; a shared host alone is insufficient.

A reviewed organization is a source-reviewed, publisher-claimed public identity, **not legal/KYC or Locked In verification**. A published youth program may be historical or future. It never proves a currently active offering or open registration. No regex, search snippet or regional-directory location automatically verifies anything.

Typed review receipts are version-controlled in `scoped-reviews.json`, bound to existing ledger records/versions/body hashes. Publication eligibility also requires a reviewed participation designation (youth or community), preventing a municipal provider from being presented as a duplicate club. They are a new scoped assessment layer; **legacy generic approval pins remain unchanged**. They are not yet wired into the consumer API, old dashboard approval counters or directory. Nineteen scoped identity assessments therefore do not mean nineteen newly approved legacy records or new clubs. No extra database schema or application rebuild was introduced.

## Reproduce locally (Node.js 22)

```bash
npm ci
npm run check
# Read and score committed evidence without making network requests:
node scripts/evaluate-qualification-recovery.mjs --assert-acceptance
node scripts/report-qualification-recovery.mjs
```

The live acceptance command exits **1**. Do not bypass it. Original v2 and previous failed benchmark files are unchanged.

For a new permitted live acquisition run:

```bash
node scripts/run-qualification-recovery.mjs
node scripts/recovery-parent-sources.mjs
node scripts/recovery-members.mjs
node scripts/run-qualification-recovery.mjs --export-only
node scripts/check-recovery-preservation.mjs
```

The dedicated `var/qualification-recovery.sqlite` cold-bootstraps the preserved acquisition snapshot and then appends runs/history. Do not point it at another database or reset it to hide failures. `--export-only` performs no network acquisition. Repeated retrieval can change versions/body hashes, so **old scoped review receipts must not be blindly reused**; invalidated claims return to review. No script automatically regenerates positive reviews. Review the new publisher evidence and record fresh scoped decisions before scoring again.

Search inputs are the logged generic queries/ranks/URLs in `search-0.json` through `search-4.json`. The compiler reads these, not benchmark files. To repeat discovery research, invoke a permitted search provider with the protocol's generic queries and record its actual returned leads using that schema. This build used explicit connected-tool invocations; no unattended production search API is configured. Never replace logs with benchmark answer URLs or mark indexed snippets as retrieved evidence.

Independent benchmark publisher checking is separate:

```bash
node scripts/check-recovery-benchmark.mjs
```

That command deliberately reads the reference sample, and its results must never become intake seeds. The benchmark and protocol were SHA-256 frozen before recovery code/acquisition. They are a new source-separated sample, but same-analyst selection/review is not an external blind audit. Five independent reference-page checks were blocked; source-backed reference labels remain provisional where live adjudication was unavailable. A genuinely externally blinded acceptance test is still required before claiming reliable generalization.

## Review receipts and evidence

Each receipt names its reviewer/time, sport, primary record/version/body hash and individual claim IDs/relationships. Final-parser claims carry CSS paths in the published HTML projection; retained early-development claims for Boulder Valley, Rise and Ranger use explicitly labeled logical public-block indices, not CSS selectors. Their original URL/hash/date and extraction version remain auditable. Related-page claims also pin that record/version/hash and require captured publisher navigation. Identity text must occur in the acquired title/brand/heading; a reviewer cannot insert a benchmark name as evidence. Unknown roles and program/team/source-candidate records cannot become verified organizations. A source failure, missing current observation, stale retrieval, changed version/hash, wrong sport or unsupported claim invalidates the assessment.

The complete unresolved-record queue is `data/qualification-recovery/review-queue.json`; source failures, latest errors and last successes are retained there. Seven configured Colorado-table **link candidates** are not seven imported clubs. Unprocessed member links stay in `member-candidates.json`. No unknown membership denominator is labeled complete.

Current-date assessment supports explicit month/day/year start/end intervals. Ambiguous seasons, date ranges with a shared year, future registration headlines and historical schedule pages are not automatically current. No current offering was verified in this trial. Secure reviewer authentication/signing, production data promotion, a configured scheduler and full-output quality adjudication remain outside this review build.

## Validation and safeguards

147 automated Node 22 tests and 23 Chromium browser checks passed. Browser emulation covered desktop/tablet/mobile; physical iPhone/iPad Safari and assistive-technology QA were not performed. All 408 prior staged records, old versions/reviews/runs, identity links and legacy approval pins were preserved. Website code, branding, family workspace, SIEM, Recruiting, Locked In, navigation and existing public data are unchanged. No merge, push, deployment or Soccer Center production action was performed.

Review is justified by actual recovery: five known cases now have reviewed Colorado/published-youth evidence; two organizations in the new sample qualify at that limited scope. This does **not** satisfy live acceptance: fresh identity recall is 37.5%, published qualification recall 25%, current-program recall 0%, and consumer publication remains zero.
