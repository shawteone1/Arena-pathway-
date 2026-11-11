# My AP consolidation — QA and acceptance report

Base: `aebb0e8ee4b5e87e77f1eac8c0d2ee0abdd57c19`.
Branch: `codex/siem-my-ap-consolidation`. Primary route: `/my-ap`.
Exact Safari alias preserved: `/siem/platform?scenario=family&mode=everyday`.

## Recorded results

| Command / suite | Result |
| --- | --- |
| `npm run check` | PASS — 123 automated tests, syntax/catalog/participation validation |
| `npm run check:brand` | PASS — approved logo/source/derivatives |
| `git diff --check` | PASS |
| `npm run test:my-ap:browser` (Chromium) | PASS — 6 consolidation acceptance tests |
| `MY_AP_BROWSER=webkit npm run test:my-ap:browser` | PASS — 6 consolidation acceptance tests in actual WebKit |
| `npm run test:siem:family:browser` | PASS — 18 Chromium family/SIEM/refinement tests |
| `npm run test:release:browser` | PASS — 20 Chromium existing-app regressions |
| `npm run test:siem:webkit` | PASS — 5 WebKit startup/compatibility/failure-state tests |

Totals: **123 automated tests, 44 Chromium tests and 11 WebKit tests**. No skipped
cases or remaining failures in these final runs. Raw logs are packaged separately.
Tests that previously navigated retired landing pages now verify their redirects
and current My AP interactions. Local setup persistence tests open the explicitly
collapsed legacy-tools disclosure before editing and after reload.

## Acceptance scenarios

1. Homepage SIEM link opens `/my-ap` with Rivera, three KPI cards, populated events,
   actions and five fixture feeds. It does not open the old local setup or role page.
2. My Day, Calendar, Messages and My Family share one existing shell/data context.
   Calendar shows all 15 commitments + two deadlines; Messages shows four relevant
   notices; My Family shows three children and four teams without a sports profile.
3. The exact previous Safari route cold-loads and reloads with complete content
   under native WebKit and a legacy MediaQueryList API shim. The addListener
   fallback and visible module-error/reload behavior remain exercised.
4. Child, sport, source, team, organization and role filtering remain tested.
   Filters and local action state survive primary-section changes.
5. PlayMetrics/TeamSnap/Slack change evidence remains inspectable; one mapped
   practice change does not become duplicate alerts. Source timestamps stay honest.
6. Review, resolution, reset and approval-gated simulated RSVP/logistics actions
   remain local and send nothing. Original provider requirements are not rewritten.
7. Display privacy masks names, locations, message text, evidence, team details
   and even the family surname in secondary settings text/hidden panel DOM.
8. `/siem` and the three old demo URLs lead to safe local My AP destinations.
   Explicit older coach/college bookmarks retain optional-role intent. No old
   release-demo controller is loaded. `/siem/setup` preserves real local data.
9. Desktop 1440×900, iPad landscape 1024×768, iPad portrait 768×1024 and phone
   390×844 cover all four sections and three optional presentation modes. No page
   overflow. The Calendar phone list exposes its complete contents, unlike the
   intentionally compact My Day preview. Keyboard/44px primary touch targets pass.
10. Independent local family/athlete setup, event persistence after reload, My
    Pathway choices, onboarding and directories continue passing their tests.
    Domain models, all fixture records/contracts, brand and discovery/data bytes
    remain protected. No registry, ingestion, live provider or production change.

## Screenshots and execution context

Before screenshots were captured from the untouched exact base worktree with the
family query, including both iPad orientations and all modes. After screenshots
show each My AP section in Chromium and WebKit at the four target sizes. The handoff
contains paired iPad My Day comparisons plus Calendar, Messages and My Family
views. Representative phone/iPad screens were visually inspected.

WebKit version: 26.5, actual Linux headless WebKit with iPad viewport/touch profiles;
not Chromium with a Safari user-agent. Legacy API coverage removes its modern
MediaQueryList listener method, retaining addListener. This is a compatibility
simulation in real WebKit, **not confirmation on the reported physical iPad**.
Its iPadOS/version/console trace and direct hardware retest remain outstanding.

Runtime: Node v24.22.1, Python Playwright and Chromium/WebKit. No new app runtime
dependencies. The isolated Chromium test browser used ARENA_QA_NO_SANDBOX=1;
WebKit used an environment-provided WEBKIT_PATH launcher and user-owned test libs.
CSP was retained. A browser-test polling expression was replaced with driver-side
attribute polling because WebKit's string-polling path can conflict with strict
CSP; no unsafe-eval policy was added or browser tests skipped.

These are prototype tests, not production authentication, provider compatibility,
formal accessibility/security certification or physical-device validation. Read
MY-AP-READINESS.md for the remaining production blockers. Transfer restoration is
verified separately against the original branch/commit/tree. No push/merge/deploy.
