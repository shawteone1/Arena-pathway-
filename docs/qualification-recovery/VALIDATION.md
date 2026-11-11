# Validation and delivery gate

- Runtime: Node.js 22.23.4.
- `npm run check`: **147 passed**, 0 failures/skips. All existing tests retained. Added scoped evidence, current-versus-published date handling, source/hash/version/sport binding, same-publisher link validation, untyped/program candidate rejection and safe public-fragment tests.
- Chromium/Playwright: **23 passed**, desktop/tablet/mobile emulation. Existing application and internal console scenarios remain functional. Physical iPhone/iPad Safari and screen readers were not tested.
- `node scripts/evaluate-qualification-recovery.mjs --assert-acceptance`: **exit 1**. Fresh source-separated sample: 3/8 verified identities, 2/8 reviewed Colorado/published-youth evidence, 0/8 verified current offerings, 0 publications. Unknown precision and incomplete independent reference verification also fail gates.
- Benchmark/protocol SHA-256 hashes validated. No prior benchmark-set identities in the new eight-case sample. Independent reference inspection was kept separate from acquisition inputs; same-analyst/external-blinding limitations are explicit.
- Actual HTTP acquisition and public-search query logs are retained. No fixture or benchmark URL was supplied as an intake answer. Fixtures test behavior only.
- `node scripts/check-recovery-preservation.mjs`: all **408** prior staged records, approval pins, complete old versions/reviews/runs/identity links retained. Existing website/catalog/governance files unchanged. Snapshot comparison normalizes transient undefined serializer fields to the actual portable JSON format; complete persisted objects are compared.
- Current-availability proof remains incomplete even for profile-eligible organizations. Raw HTML is not archived as a complete response repository; structured facts, hashes, normalized selectors/logical legacy indices and dates are retained.

The user requested a reviewable change only if real acquisition improved. That delivery gate is met at a limited scope: four previously missing lacrosse publisher identities were recovered; five known cases acquired reviewed Colorado/published-youth evidence; two organizations in the fresh sample meet that published-fact scope. **It does not mean live acceptance passed.** No change to consumer data, generic legacy approval flags, production infrastructure, source permissions or verification thresholds was used to inflate those results.

No merge, push, deployment, GoDaddy/Airo preview or Soccer Center production changes were performed. Production monitoring, authenticated reviewer operations, legal/KYC verification, external blind testing and current-program eligibility are not claimed operational.
