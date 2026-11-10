# Validation report — November 10, 2026

Node.js **22.23.4**, Linux, local Node server. No production or GoDaddy/Airo environment was contacted.

| Check | Result |
|---|---|
| `npm run check` | **160/160 Node tests**, zero failed/skipped; data, participation and discovery checks passed |
| `npm run check:brand` | Approved original logo and derivative SHA checks passed |
| `python scripts/qa-progressive.py` | **27/27 Chromium browser tests** passed |
| `node scripts/check-progressive-preservation.mjs` | All 600 prior records, 872 versions, 377 observations, 32 runs, 7 reviews, 284 configuration-history rows and 1 identity link retained; approval pins unchanged; all 247 prior sources retained |
| Cold ledger restore/export | New temporary database reproduced sealed `live.json` byte for byte, offline |
| Fresh live discovery acceptance | **FAILED**: identity 0/6, qualified youth 0/6, new cohort publications 0 |
| Reviewed-record publication | 16/16 organization identities explicitly accessible; 15/15 published-youth records visible by default |
| Git whitespace | `git diff --check` passed |

The 160 Node tests include the original 147 groups plus 13 progressive groups. They exercise independent states, missing registration, stale/blocked retained facts, unknown youth, age/registration filters, canonical aliases, no placeholder teams, current season versus availability, source relationships, original record preservation and HTTP routes. Controlled fixture dates and many-to-many memberships validate rule behavior; they are never presented as live program/league evidence.

The 27 browser checks include 23 inherited application/acquisition checks and 4 progressive tests. Coverage includes directory and profile behavior, saved organization identity, no automatic recruiting, independent family module state, media opt-in, module reordering, calendar/recruiting handlers, SIEM lightweight onboarding, demonstration pages, branding, console drill-down, keyboard controls, touch targets and overflow.

New views were checked at **390×844**, **768×1024** and **1280×900**. Directory/profile screenshots at each size are included in the transfer package. Screenshots were inspected at phone, tablet and desktop sizes. No horizontal overflow was detected in the tested routes. Original release tests also cover the wider inherited viewport matrix.

Not performed: physical iPhone/iPad Safari, VoiceOver or a full accessibility/security audit, authenticated provider integrations, real registration flows, external blind benchmark adjudication, production scheduler operation or hosting deployment. Existing SIEM/demo connections remain illustrative; private family data remains browser-local with existing disclosures. Recruiting, Locked In and server-side access behavior were not redesigned.

## Intentional test expectation changes

- Youth directory counts change from lacrosse 3 to 13 and volleyball 4 to 9. Denver city results change from 1 to 3. A previously absent Northern Power record now appears.
- Exact byte guards remain for unrelated branding/server/SIEM/governance/research files. Authorized directory code and the small client recommendation bridge necessarily change; the original CSS is still asserted as an unchanged prefix, with verification styles appended.
- The old v2 acceptance evaluator gained `--no-write` for tests so current UI checks cannot overwrite its historical evaluation artifact. Its expected failed acceptance and thresholds are unchanged.
- No test was skipped, disabled or changed to waive discovery acceptance. The fresh sample failed and is reported separately from unit/browser correctness.

Full logs: `node-tests.txt`, `browser-tests.txt`, `brand-check.txt`, `preservation-check.txt`. Test runs include Node's SQLite experimental-feature notice; it did not prevent startup, validation or cold restore.
