# Live discovery failure analysis

Foundation: acquisition v2 commit `16e49df9c2990cdaece4c6c4f55d6aaf24fd871f`. Branch: `codex/live-discovery-failure-analysis`. No redesign or application rebuild.

Read in order:

1. `NAMED-FAILURES.md`: every held-out organization, all seven stages, official URLs, obtained evidence, unknowns and next actions.
2. `ROOT-CAUSES.md`: overlapping cause counts, minimal corrections and remaining operational problems.
3. `ALTERNATE-SOURCES.md`: permitted alternate evidence and its limits.
4. `RERUN-RESULTS.md`: actual live post-hoc regression and validation.

The original protocol, benchmark, sealed trial, live acquisition ledger, reviewed catalog and consumer catalog are untouched. New direct official-page checks are diagnostic only. None of their held-out URLs is a seed for the discovery rerun. Those names are now known to the analyst, so a rerun of the old independent sample is **post-hoc regression, not a fresh independent blind evaluation**. Do not silently claim otherwise.

## Commands (Node 22)

```bash
npm ci
npm run check
# Network: original sources only, normal access client, robots/rate limits enforced.
node scripts/rerun-discovery-analysis.mjs
node scripts/evaluate-discovery-rerun.mjs --assert-acceptance
# Separate network diagnostics intentionally use the now-known official benchmark URLs.
# They never contribute to discovery recall.
node scripts/diagnose-heldout.mjs
node scripts/report-discovery-failures.mjs
ARENA_QA_NO_SANDBOX=1 npm run test:acquisition:browser
```

The acceptance command fails if the same measured deficits remain. A new run uses a dedicated `var/discovery-analysis-final.sqlite` database, cold-bootstrapped from the preserved v2 ledger; it does not overwrite the existing acquisition database. Repeated manual runs append history. Inspect provider permissions and quotas first. The original `npm run acquisition:acceptance` continues to score the immutable original trial and must continue to fail.

The publication boundary is deliberate: newly acquired candidates are not consumer records, and a candidate classification is not an approved fact. This investigation did not add an automatic publication path, weakening of qualifications, new portal, scheduler or open-ended AI feature. Production security, multi-day monitoring, physical iPhone/iPad Safari and fresh external blind research remain untested.

## Evidence provenance

`official-diagnostics-before.json` retains the initial diagnostic extraction, including the defects that motivated the corrections. `official-diagnostics.json` has the corrected text parsing and final explicit VC Denver JSON-wrapper rejection. Both preserve original response hashes and retrieval times, without treating raw JSON configuration as verification. `rerun-ledger.json` is a separate live-acquisition export with per-observation config and extractor fingerprints.

An early development rerun was interrupted after identifying the HTML word-boundary defect; its local database remains separate and was not used for scored results. The complete rerun then used block separators, configured profile names, stricter state evidence and linked traversal. The additional JSON-wrapper rejection was validated afterward by a fresh direct VC Denver diagnostic and tests. It does not turn that diagnosis into an independent discovery result; its wrapper source was not a rerun seed.

No full new raw-HTML archive is claimed. Body hashes, URLs, structured candidate evidence and retrieval outcomes are portable. Blocked pages are not reconstructed from search snippets or mirrors. No source is claimed statewide complete.
