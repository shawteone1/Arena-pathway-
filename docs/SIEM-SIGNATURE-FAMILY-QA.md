# Signature Family Demonstration v1 — QA report

Branch: `codex/siem-signature-family-demo-v1`.
Base: `codex/siem-ux-v21-refinement` at `cad4aa70bcc594656a62bfaa8a3081888edee45e`.
Open `/siem/platform?scenario=family&mode=everyday`.

## Results

| Check | Result |
| --- | --- |
| `npm run check` | PASS — 118 automated tests; syntax/catalog/participation checks |
| `npm run check:brand` | PASS — approved AP source/derivative bytes |
| `git diff --check` | PASS |
| `npm run test:siem:family:browser` | PASS — 18 Chromium tests (6 family + 12 inherited SIEM/refinement) |
| `npm run test:release:browser` | PASS — 20 inherited release Chromium tests |
| Fixture shape | 3 children, 4 teams, 2 sports; 22 source records → 21 canonical activities |
| Cross-feed change | One Alex practice change decision; original PlayMetrics, TeamSnap and Slack evidence retained |
| Protected code | Models, contract, generic fixtures, engine/data/registry/ingestion remain byte-identical |

Eight new automated tests cover deterministic family composition, source attribution
and timestamp coherence, local Denver/UTC date boundaries, early arrivals, explicit
cross-feed matching and ambiguity rejection, child/team/sport/source filters, action
resolution/reset, role/tenant isolation and preservation boundaries.

Six new browser cases cover the signature family across 12 mode/viewport combinations,
source drill-down and change history, all filter dimensions, approval gate/no-sending,
tournament arrival/RSVP, simulated Locked In metadata, reset, privacy and no provider
requests. Inherited tests cover mode navigation, first-screen layout, collapsible
sidebar, role/org isolation, keyboard focus, touch targets, source states/freshness,
refresh/pause, duplicate handling and unchanged local family storage. The inherited
release suite verifies original Pathway, directory, onboarding and demonstration flows.

## Screenshots and environment

Captured 12 family first-viewport screenshots: Everyday, Command Center and Display
at desktop 1440×900, iPad landscape 1024×768, iPad portrait 768×1024 and phone 390×844.
Also captured a complete desktop Command Center and the three-source practice-change
evidence detail. Representative desktop/iPad/phone screenshots were visually inspected.
No horizontal page overflow or browser JavaScript errors in tested combinations.

Runtime: Node v24.22.1, Python Playwright and local Chromium. Required Node version
remains >=22.13; no new runtime npm dependencies. Container browser QA used
`ARENA_QA_NO_SANDBOX=1` for its isolated headless browser; no app security setting
was changed. This is emulation, not physical-device or formal accessibility certification.
Raw logs and screenshots are included in the transfer ZIP.

## Important interpretation

All records, venues, times, messages, approvals and Locked In status are fictional.
The fixed week is May 6–12, 2030, America/Denver. All real platforms are unconnected.
Source freshness describes fixture timestamps; view redraw is not provider sync.
Travel plans are fictional parent estimates, not routing or traffic calculations.

Consolidation uses explicit fixture mappings and preserves original evidence;
this does not establish reliable real-provider matching. Sport filtering applies
to team activities; All sports includes school/family records without team sport.
Source filtering may show a canonical primary event through its secondary source
record, with primary attribution retained. Local review/resolution and approved
simulations never submit forms, RSVP to providers or send messages.

The one inherited preservation assertion for server.mjs was narrowly updated to
allow the new family fixture asset in the existing allowlist; all other server
bytes are still compared to the original base. No broader serving permission,
new private API, discovery ingestion or contract change was introduced.

See the separate walkthrough and readiness report for presentation steps,
production blockers and privacy limits. No push, merge, publish or deployment.
