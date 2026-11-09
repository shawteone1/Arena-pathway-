# Integrated release candidate v1 — QA report

Date: November 9, 2026. Runtime: Node.js 22.23.4. Local development only; no GitHub push, merge, hosting change or Soccer Center production access.

## Completed

| Check | Result |
|---|---|
| `npm run check` | 98 automated tests passed, 0 failed/skipped: all 79 Unified tests, 15 original SIEM tests, 4 integration groups |
| `npm run check:brand` | Passed: original approved source hash and web treatments verified |
| `ARENA_QA_NO_SANDBOX=1 python scripts/qa-release.py` | 20 Chromium browser tests passed, 0 failures |
| Existing standalone Unified browser suite | 16 passed before final copy polish; final release suite inherits those same 16 and adds 4 groups |
| Diff whitespace | `git diff --check` passed |
| Source and governance preservation | Tests compare reviewed source registry, approved audit, normalized participation data, brand/photography manifests and governance documents with original commits |

The four new automated groups cover three fixture scenarios and action isolation; exact source/governance preservation; verified youth opportunity ownership/schedule state; and integrated routes, five-item sport navigation, exact approved positioning, SIEM taglines, asset loading, method restrictions and CSP.

## Browser scope

- Chromium with fresh isolated browser contexts; no external account or provider requests are required.
- Phone 390×844, tablet 768×1024, desktop 1280×900.
- All nine presentation entry routes checked at every size: home, About, offerings, Collective Data, Soccer Center preview, SIEM local workspace, parent demo, coach demo, college-athlete demo.
- One h1, no document horizontal overflow, five Sports dropdown entries, operable Explore menu, loaded images, keyboard focus and minimum 44px primary demo action targets.
- Demo participant filtering, conflict review/acknowledgment/reset, explicit connection status and no mutation of family/SIEM browser storage.
- Lightweight SIEM athlete creation, manual event save and persistence across reload without a My Pathway or recruiting profile.
- Inherited coverage: module onboarding, enable/disable/reorder behavior, independent family choices, retained hidden data/media choices, saved clubs without recruiting, calendar/recruiting conditional handlers, directory filters, first-party club/team hierarchy, swimming classifications, school tiers and source presentation.
- Full-page screenshots of home, offerings and all three scenarios at each size. Images decoded before screenshots to capture lazy-loaded photography. Representative phone demo, tablet home and desktop college screenshots visually inspected. The initial calendar-label contrast and decorative arrow glyph issues were corrected; final checks passed.

## Not tested / not ready

No physical iPhone/iPad, native Safari/WebKit, VoiceOver, full WCAG audit, screen-reader walkthrough, independently tested contrast across every legacy surface, external penetration/security review, live OAuth/provider APIs, notification delivery, production identity verification, real payments or GoDaddy/Airo deployment. These remain explicit pilot blockers, not inferred successes from viewport tests.

The existing SIEM local guards and CSP are exercised by tests, but browser-local storage and simulated identities do not establish secure production tenancy. No private real athlete data was imported for demonstrations. No live synchronization or real scheduler is operational.

## Reproduce

```sh
nvm install 22
nvm use 22
npm ci
npm run check
npm run check:brand
```

Browser checks additionally require Python Playwright and Chromium. Use `CHROMIUM_PATH` to select an installed browser if needed. Run in a trusted isolated development environment:

```sh
ARENA_QA_NO_SANDBOX=1 python scripts/qa-release.py
```

The no-sandbox flag is for the isolated test container, not a production browser policy. The script starts/stops a local Node server, uses isolated storage and writes screenshots under ignored `var/pathway-qa/`. No Python or browser packages are needed to run the Node web application.

See `INTEGRATED-RC-V1.md`, `SIEM-SECURITY.md`, `SIEM-INTEGRATIONS.md` and `UNIFIED-COVERAGE.md` for integration, security and data gaps. Original assertions were retained; the raw-data preservation test now pins the exact reviewed base SHA `c13de90` instead of a mutable remote-tracking ref, so it works in a self-contained bundle checkout. No failures were skipped or weakened.
