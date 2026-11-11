# Progressive verification and operations

Read `AGENTS.md` and `docs/PRODUCT-NORTH-STAR.md` before further changes.

## Independent states

| State | Required evidence | Does not establish |
|---|---|---|
| Verified organization | Reviewed canonical identity, sport and Colorado geography, linked evidence IDs, URL/body hash/retrieval date | Youth participation or current operations |
| Youth program confirmed | Reviewed organization-operated youth participation; published age/grade where supported | A currently running season or open registration |
| Named team/program verified | Actual named official publication and real parent relationship | A fabricated competition team or current season |
| Current teams/season confirmed | Reviewed source-supported season start/end, current interval and review no older than 30 days; not blocked | Registration availability |
| Current opportunity verified | Explicit open availability, published date bounds, same-day nonfuture verification and supporting URL; not blocked | Other programs are available |

Display labels include **Verified organization**, **Youth program confirmed**, **Current teams/season confirmed**, **Registration available**, **Registration status unknown**, and **Additional verification needed**. Published youth participation can be undated or historical; both receive a clear currency warning. Stale organization facts remain with warnings rather than silently disappearing. Retirement needs explicit review. Unknown youth remains unclassified and excluded from default youth recommendations.

`engine/progressive.mjs` supplies reusable rules and graph validation. The additive publication packet stores reviews separately from raw source evidence. It does not change generic legacy approval flags. Unsupported identities stay in the existing review queues; raw extraction never auto-publishes.

## Discovery

`engine/acquisition/discovery-plan.mjs` supplies the association → league/member directory → organization → program/team → age/division → schedule/event → opportunity stages and independent-club, school, college, recreation and adult alternatives. These are configurable traversal roles, not proof every stage succeeded. Source-specific selectors live in `data/progressive-discovery/source-rules.json`; WhichVBClub is a candidate-link adapter example. It did not achieve a reconciled membership capture in this live test.

The runner uses existing adapters, `PublicSourceClient`, robots/access policy, rate limits, ledger, diff history and frontier. It consumes the preserved registry plus logged generic search results, never `withheld.json`. Search logs come from explicit public-search tool calls; there is no unattended search-provider integration. The 36-source budget is 9 roots + 6 first-level links + 3 second-level links per sport. Remaining links are explicitly pending. A returned page is not a complete source.

## Local commands (Node.js 22.13 or later)

```bash
npm ci
node scripts/check-progressive-preservation.mjs
node scripts/report-progressive-discovery.mjs
npm run check
npm run check:brand
npm start
```

The website starts from committed JSON; no live fetch or private account is needed. Open Codespaces port 3000. Review `/sports/lacrosse/youth`, `/sports/volleyball/youth`, the verification filters, organization profiles, `/pathway`, and existing SIEM demonstrations.

To rebuild the **local additive read model**, without deploying:

```bash
node scripts/publish-progressive-directory.mjs
```

Review receipts bind exact record versions, body hashes, selectors and names. Missing review bindings fail the compiler. It writes atomically and rejects unexplained loss of previously public organization IDs. It is not an automatic approval workflow for newly fetched data. Existing `data/qualification-recovery/review-queue.json` and named-gap reports remain intact.

To restore the complete delivered public-sports ledger into an empty `var/progressive-discovery.sqlite`, without network requests:

```bash
node scripts/run-progressive-discovery.mjs --export-only
```

The runner restores `ledger.json.gz` (including original history plus new observations); `base-ledger.json.gz` is the immutable previous ledger. Do not delete an existing database. Both archives are integrity checked and their hashes recorded in `preservation.json`.

A new permitted live refresh is explicit:

```bash
node scripts/run-progressive-discovery.mjs
```

This updates the local database and `live.json` only, retaining history and approval pins. Back up `var/progressive-discovery.sqlite` and versioned evidence before refreshing. It does not approve records, alter the reviewed catalog or deploy the site. Inspect failures, diffs, pagination and pending queues before review. On interruption rerun against the same ledger; no need to discard history. Restore a backed-up database only into a separate path for inspection.

A benchmark run must freeze protocol and a genuinely new withheld reference sample **before** discovery, seal its final `live.json`, then score it. Never overwrite the delivered seal and claim the new run is the original test. The reference-check script is research-only and must never be used as acquisition intake.

There is **no operating scheduler** or unattended search service. Existing refresh commands can be invoked by an operator. A real scheduler still needs environment ownership, single-run locking, credentials where authorized, monitoring, failure alerts and a tested schedule. Current opportunity assertions require active review; they expire independently of organization visibility.

No production database migration, private-family change, provider connection, GitHub push, merge or deployment was performed.
