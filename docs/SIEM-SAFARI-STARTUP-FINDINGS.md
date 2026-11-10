# SIEM Signature Family — Safari/WebKit startup investigation

Base verified: `codex/siem-signature-family-demo-v1`, commit
`2493cf140970630a6e4bad106025d85dee0392d8`.
Review branch: `codex/siem-family-safari-fix`.
Route: `/siem/platform?scenario=family&mode=everyday`.

## Findings and reproduction

The original code unconditionally calls `compactRail.addEventListener('change', …)`
before `applySidebar()`, family scenario construction and the initial `render()`.
MediaQueryList implementations exposing only the legacy `addListener` API throw
at this line. The static server-rendered heading stays **Your day, connected.**;
there are no KPI cards, schedules or action panels. A nonessential responsive
sidebar observer thus prevents the entire demonstration from starting.

Reproduction used genuine Playwright WebKit **26.5**, an iPad device context, and
a pre-page-load compatibility shim that removes MediaQueryList.addEventListener
while retaining its native addListener implementation. This recreates the older
Safari API surface; it is not a test on an actual historical Safari release.
Original runtime error:

```text
compactRail.addEventListener is not a function.
… 'compactRail.addEventListener' is undefined
```

All HTML, CSS, fonts, logo and JavaScript module responses were HTTP 200 with the
correct MIME types, including siem-family-fixtures.js. The dashboard had zero KPI
cards and the exact reported static heading. The package contains the captured
runtime/asset JSON and before screenshot. This isolates the reproduced failure
from asset loading, family data, Denver date parsing and permissions.

**Important diagnostic limit:** the unchanged original build rendered normally in
current WebKit with its normal APIs. We have not accessed the reported physical
iPad, its Safari console, forwarded-port response headers or iPadOS version.
Therefore the legacy-API crash is a confirmed defect and a reproduction of the
reported screen, but is not a confirmed diagnosis of that particular device.
A stale/incomplete server build, failed module request or another startup error on
that device remains possible. Its version/console trace is still needed if the
patched build does not resolve the physical-device case. No claim is made that
all older Safari versions support every JavaScript feature used by the platform.

## Fix

- Feature-detect MediaQueryList.addEventListener; use addListener when necessary.
  If neither observer API exists, use the initial media-query result and retain
  the manual sidebar toggle. Resize observation cannot block scenario startup.
- Add a small external module bootstrap that catches module loading/evaluation
  failures and presents a visible error/reload control, logging the original error
  to the browser console. A loading/noscript message replaces an initially empty
  content area. An intentionally missing fixture module now produces this clear
  recovery state instead of a silent blank dashboard.
- Keep CSP intact and add only the new bootstrap file to the asset allowlist.
  No cache-policy changes or speculative provider/backend fixes were introduced.

All fictional family records, itineraries, timestamps, approvals, original
scenarios, event models/contracts and discovery data remain byte-identical to the
base. The dashboards, filtering, correlation, source freshness and privacy behavior
are preserved. No network connection to an external provider was added.

## Verification

| Check | Result |
| --- | --- |
| `npm run check` | PASS — 120 automated tests, syntax/catalog/participation validation |
| `npm run check:brand` | PASS |
| `git diff --check` | PASS |
| `npm run test:siem:webkit` | PASS — 5 WebKit tests |
| `npm run test:siem:family:browser` | PASS — 18 Chromium family/SIEM/refinement tests |
| `npm run test:release:browser` | PASS — 20 Chromium release regressions |

WebKit regressions verify cold/fresh context and reload at iPad portrait 810×1080
and landscape 1080×810, three child associations, four selectable teams, schedules,
five source feeds including simulated Locked In status, actions and HTTP/MIME
responses. They also test the legacy listener and live viewport change, absence
of both optional observer APIs, mode/filter/evidence/approval/privacy interactions,
and visible handling of a deliberately failed module request.

This is 43 browser tests in total (5 WebKit + 38 Chromium). Raw logs and screenshots
are packaged. WebKit is actually launched, not Chromium with a Safari user-agent.
The current managed environment lacked system libraries; test-only Debian libraries
were SHA-256 verified and extracted to a user-owned directory, with an optional
WEBKIT_PATH launcher used locally. No application runtime dependencies or system
production configuration changed. Codespaces can use normal Playwright WebKit
installation with its documented OS dependencies.

## Recheck on the physical iPad

Import the complete bundle on its separate review branch, install dependencies,
and restart the local development server from that worktree. Open the unchanged
route on its private forwarded port and reload. The title should become
**One family. Four team schedules.**, with three KPI values and populated panels.
If startup fails, the new panel will say **The dashboard could not start.** Inspect
Safari's Web Inspector console and Network responses for the original exception,
asset status/MIME, and actual server build. Do not clear family local storage as a
troubleshooting step; this fix does not read or modify that data.

Physical-device confirmation and formal historic Safari support certification are
outstanding. This remains the same fictional demo with the existing production
readiness limitations. No push, merge, deployment or production modifications.
