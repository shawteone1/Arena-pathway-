# SIEM UX v2.1 — Dashboard refinement QA

Review branch: `codex/siem-ux-v21-refinement`.
Exact parent: `cd976233a2d4815ff6cc1b233a6684449fa9988c` on
`codex/siem-platform-ux-v2`. Route remains `/siem/platform`.

## Presentation changes

Compact KPI navigation replaces oversized cards. The sidebar collapses with a
named keyboard-accessible button and defaults collapsed on iPad-size viewports.
Organization/participant controls share a compact toolbar; secondary filters use
More filters. Phone schedules and queues preview the first item and retain all
remaining items behind native, keyboard-accessible disclosures.

The timeline groups days, marks each time with a visual rail, and shows start/end
times without repeating them in the same row. Alerts retain the same priority and
state, with separate Impact and Next lines. Review, acknowledgment and resolution
still invoke the existing handlers. Refresh controls move to the footer; freshness
and timestamps remain visible in the dashboard. Shared-screen privacy remains
on by default in Display Mode. Approved AP artwork, palette and three modes remain.

## Results

| Check | Result |
| --- | --- |
| `npm run check` | PASS — 110 automated tests; syntax/catalog/participation validation |
| `npm run check:brand` | PASS — approved original and derivative bytes |
| `git diff --check` | PASS |
| `npm run test:siem:refinement:browser` | PASS — 12 Chromium tests (7 inherited SIEM + 5 refinement tests) |
| `npm run test:release:browser` | PASS — 20 inherited release Chromium tests |
| Model/contract/discovery preservation | PASS — byte comparison with exact v2 base |
| First-screen visibility | PASS — 36 role × mode × viewport combinations |

Browser matrix: parent, coach and college; Everyday, Command Center and Display;
1440×900 desktop, 1024×768 iPad landscape, 768×1024 iPad portrait, 390×844 phone.
Every combination has no horizontal page overflow and shows a commitment title,
priority-alert title and next-action text above the viewport bottom.

Keyboard/touch tests cover sidebar toggle and focus retention, native mode buttons,
filter disclosure/focus preservation, private role switching, phone list expansion,
action acknowledgment, modal focus/Escape, privacy redaction and ≥44px visible
buttons, selects, summaries and KPI links. The original SIEM tests continue to
exercise correlation/duplicates, source timestamps, disconnected states, pause/
refresh, private role/org boundaries, no provider requests and unchanged local data.
The release suite checks the existing application, directories and family workspace.

## Measured before/after

Parent Everyday View, no scroll, same fixture and dimensions. Measurements are CSS
pixels; rounded to the nearest pixel. Before is captured from exact original v2
commit `cd976233` in its untouched worktree. After is captured by the refinement
browser suite. Raw measurements and 12 paired first-viewport screenshots are in
the transfer package.

| Viewport | KPI height before → after | First commitment top | First priority action top |
| --- | --- | --- | --- |
| Desktop 1440×900 | 141 → 57 | 901 → 561 | 901 → 561 |
| iPad landscape 1024×768 | 135 → 57 | 972 → 557 | 972 → 557 |
| iPad portrait 768×1024 | 135 → 57 | 998 → 557 | 998 → 557 |
| Phone 390×844 | 143 → 51 | 1136 → 507 | 1982 → 677 |

Representative desktop, iPad and phone screenshots were visually inspected.
Before/after sets include all three modes at all four sizes; additional original
SIEM matrix screenshots are available in the browser artifacts. No real people,
private athlete records or live provider data were used.

## Scope and limitations

No event model, fixture, adapter, data contract, correlation/permission logic,
source freshness function or action implementation was modified. No Sports
Discovery Engine, dataset, registry or ingestion changes. Tests protect these
files and the approved charter/logo bytes. Presentation reads existing scoped
queue data for Impact/Next; it introduces no new provider status or inference.

Browser checks use headless Chromium/Playwright emulation, not physical iPads or
phones, and do not constitute formal WCAG, screen-reader or production security
certification. Container browser execution used `ARENA_QA_NO_SANDBOX=1`; the app
configuration was not changed. All real providers remain unconnected. Demo actions
and sidebar choices remain page-local. The original v2 production-readiness
assessment and security limitations still apply. No push, merge or deployment.
