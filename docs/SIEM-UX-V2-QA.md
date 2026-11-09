# SIEM UX v2 — QA report

## Verified build

Base: `codex/integrated-release-candidate-v1` at
`50ce75d58074485054e65e92a3b5413591cf1712`, verified against the remote ref and
local commit history before creating `codex/siem-platform-ux-v2`. Test runtime:
Node.js v24.22.1, Python 3.12 Playwright, local headless Chromium. Required runtime
is inherited Node.js >=22.13; no new runtime dependencies were introduced.

## Results

| Validation | Result |
| --- | --- |
| `npm run check` | PASS — syntax, catalog/participation validation and **108 automated tests**, 0 failures/skips |
| `npm run check:brand` | PASS — approved source, source hash and derivatives |
| `git diff --check` | PASS |
| `python scripts/qa-siem-platform.py` | PASS — **7 browser tests** |
| `python scripts/qa-release.py` | PASS — **20 inherited browser tests** |
| Protected engine/data/registry/ingestion/charter/logo bytes | PASS — compared directly with the exact base commit |
| New UI screenshots | Captured and representative desktop/phone/iPad screenshots visually inspected |

Browser commands used `ARENA_QA_NO_SANDBOX=1` for the container's isolated test
Chromium and `ARENA_QA_ARTIFACTS` to keep outputs outside source. This flag applies
to the local QA browser, not the app or a production configuration. No provider
accounts, private information, hosted deployment or production service was used.

## New browser coverage

The responsive matrix is **27 combinations**: three modes × parent/coach/college
scenarios × desktop 1440×1000, iPad portrait 768×1024 and phone 390×844. All have
one main heading and no horizontal page overflow. Mode navigation updates pressed
state and URL. Fifteen screenshots cover all scenario/size Everyday views and
coach Command/Display views at each size.

Interaction tests cover:

- Prioritized actions, review, resolution and focus after actions; state resets
  across scenarios without writing browser-local family data.
- One displayed commitment for a duplicate source record; duplicate candidate,
  change history and source identity retained in drill-down.
- Organization filtering before correlation and multi-role college/coach
  isolation, including hidden other-person private negative fixtures.
- Display privacy on by default; title/name/location/org/message/evidence
  redaction, closed/cleared details, hidden local action controls.
- Current/stale/failed/disconnected feed states, 60-second view redraw, pause,
  manual refresh and unchanged source timestamps.
- Keyboard mode selection, named controls, minimum 44px button/select heights,
  modal focus/Escape/focus return and filter focus preservation.
- No browser JavaScript errors, no outbound provider requests, no mutation of
  existing SIEM/My Pathway browser storage.

The inherited release browser suite additionally exercises independent modules,
profile save/delete/reorder, onboarding, source/participation filtering, directories,
organization pages, original demonstrations, lightweight SIEM family associations,
mobile/tablet layouts and brand loading.

## Interpretation and limits

These checks establish local-demo behavior; they do not certify authentication,
backend tenant isolation, production data fidelity, verified provider integration,
formal WCAG conformance or real-device usability. No live feeds were tested.
Playwright emulation is not a physical iPhone/iPad test. Keyboard/modal/label and
responsive checks were completed; screen-reader and independent accessibility
audits remain outstanding. The logo byte checker does not itself establish visual
fidelity; representative screenshots were also inspected.

See `SIEM-UX-V2-READINESS.md` for production blockers and the charter acceptance
review, and `SIEM-UX-V2-CONTRACT.md` for adapter semantics. Raw logs and screenshots
are included in the handoff ZIP. Transfer verification checks bundle integrity,
original commit/parent and tree identity separately; it does not rebuild the app.
