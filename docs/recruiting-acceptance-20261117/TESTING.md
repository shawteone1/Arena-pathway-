# Engineering results and retained failures

The original318 Node cases remain; two targeted tests add single-shell/retired-entry and selected-only jersey compatibility checks. No prior test case was removed. Existing UI assertions were adapted to the expressly requested removal of the checklist and superseded navigation labels; absence of those legacy paths is now asserted.

| Check | Passed | Failed | Skipped | Log |
|---|---:|---:|---:|---|
| `npm run check` | 320 |0|0|[log](logs/cleanup-check.log)|
| `npm test` | 320 |0|0|[log](logs/final-npm-test.log)|

`npm run check` includes the Node suite. Running `npm test` is confirmation, not640 unique tests.

| Browser suite | Chromium | WebKit |
|---|---|---|
| recruiting-acceptance-20261117 | [2 PASS](logs/qualified-recruiting-acceptance-chromium.log) | [2 PASS](logs/qualified-recruiting-acceptance-webkit.log) |
| product-completion-20261117 | [1 PASS](logs/cleanup-family-chromium.log) | [1 PASS](logs/cleanup-family-webkit.log) |
| completion-parent-20261117 | [1 PASS](logs/qualified-completion-parent-20261117-chromium.log) | [1 PASS](logs/qualified-completion-parent-20261117-webkit.log) |
| completion-corrections-20261117 | [3 PASS](logs/qualified-completion-corrections-20261117-chromium.log) | [3 PASS](logs/qualified-completion-corrections-20261117-webkit.log) |
| completion-preservation-20261117 | [3 PASS](logs/qualified-completion-preservation-20261117-chromium.log) | [3 PASS](logs/qualified-completion-preservation-20261117-webkit.log) |
| completion-entry-20261117 | [3 PASS](logs/qualified-completion-entry-20261117-chromium.log) | [3 PASS](logs/qualified-completion-entry-20261117-webkit.log) |
| completion-editors-20261117 | [1 PASS](logs/qualified-completion-editors-20261117-chromium.log) | [1 PASS](logs/qualified-completion-editors-20261117-webkit.log) |
| profile-foundation-20261117 | [2 PASS](logs/qualified-profile-foundation-20261117-chromium.log) | [2 PASS](logs/qualified-profile-foundation-20261117-webkit.log) |
| supporting-20261117 | [4 PASS](logs/resumed-supporting-20261117-chromium.log) | [4 PASS](logs/resumed-supporting-20261117-webkit.log) |
| profile-assets-20261117 | [2 PASS](logs/cleanup-assets-chromium.log) | [2 PASS](logs/cleanup-assets-webkit.log) |
| rss | [5 PASS](logs/resumed-rss-chromium.log) | [5 PASS](logs/resumed-rss-webkit.log) |
| news-editorial | [3 PASS](logs/resumed-news-editorial-chromium.log) | [3 PASS](logs/resumed-news-editorial-webkit.log) |
| completion-publishers-20261117 | [1 PASS](logs/resumed-completion-publishers-20261117-chromium.log) | [1 PASS](logs/resumed-completion-publishers-20261117-webkit.log) |
| siem | [18 PASS](logs/resumed-siem-family-chromium.log) | [5 PASS](logs/resumed-siem-webkit-webkit.log) |

**Selected browser cases: Chromium49 / WebKit36;0 failed,0 skipped.** Four sports and the13/25 journey steps are subjourneys, not separately inflated test counts. [Exact selected results](FINAL-RESULTS.json).

## Commands and environment

Node24, Chromium `/usr/bin/chromium`, WebKit `/workspace/scratch/webkit-local.sh`. Start the current app with `PORT=3138 node server.mjs`. Set `ARENA_QA_BASE=http://127.0.0.1:3138`, `ARENA_PROFILE_OUT=docs/recruiting-acceptance-20261117/after` and `ARENA_EDITORIAL_OUT=docs/recruiting-acceptance-20261117/after/rss`. For WebKit also set `PROFILE_BROWSER=webkit WEBKIT_PATH=/workspace/scratch/webkit-local.sh`. Run each listed `scripts/qa-<suite>.py` (SIEM uses `qa-siem-family.py` / `qa-siem-webkit.py`). Browser source/output plumbing keeps the prior validated screenshots intact.

Selected runs span3137 and the fresh3138 server. Following mechanical removal of unreachable legacy branches, full Node checks, dedicated entry/dependency-isolation, asset-recovery and complete same-family journeys were rerun. The removed branches were unreachable under the already dedicated route; no domain behavior changed. Both fresh-entry single-case runs are retained in `logs/cleanup-entry-*.log`.

## Failed/interrupted attempts — not hidden or counted as passing

1. The initial check had4 failing source/HTML assertions that explicitly expected the now-rejected checklist template/module constructor and old introductory wording. Tests now preserve all other module/record checks and explicitly require the retired paths to be absent. No suite/case was removed.
2. The first gold-card browser test matched both an inactive hidden family gallery and the active profile card. The assertion was scoped to the actual athlete masthead, rather than asserting that shared components cannot exist in separate hidden profile contexts.
3. The first same-family test adaptation attempted selection before opening the new native content panel / collapsed item choices. It timed out. The test now opens the actual controls through user clicks, retains all original selection/ownership/save assertions, and passes.
4. During rendered inspection the first inline layout placed a growing portfolio above controls on tablets, creating a long page and possible control movement. It was corrected to one content panel over the same full portfolio. The four-sport tests retain focused-control and zero document-scroll-delta assertions; actual panel screenshots are viewport captures.
5. One earlier WebKit four-sport run completed its workflow assertions but failed teardown with `Importing a module script failed.` It is retained in `logs/final-recruiting-acceptance-20261117-webkit.log`. The message did not identify its URL. Instrumented diagnostics and a stronger wait for the real SIEM startup state (rather than its server-rendered shell) were added; subsequent selected four-sport runs pass without that error. Normal canceled fixture-blob loads are logged when preview object URLs are disposed. We have not proven the exact cause of the one earlier module message and do not erase it or claim physical Safari certification. This remains a verification warning, not a claimed resolved production incident.
6. A managed cloud environment restart interrupted the diagnostic run and two supporting-suite batches. Files were preserved. The diagnostic navigation timeout and partial logs remain; interrupted cases are not counted. The remaining suites resumed after environment readiness.
7. Earlier successful design iterations remain logged too; the selected table counts each unique case once, not the sum of manual reruns. No automatic retry loop or page-error suppression was added.

## Responsive and source evidence

Actual desktop1440×900, iPad810×1080 and1024×768, phone390×844 screenshots; separate touch/keyboard/focus/reduced-motion/asset-failure checks. These are browser tests, not physical-device certification. Source registry, catalog, recurrence, media store, SIEM and LockedIn preservation are checked in208 byte-identical protected files. Reference/publisher probes allow reads only; no production services are activated. Authenticated Soccer Center production editing is unavailable without a session and is not claimed browser-verified.

Trailing whitespace in retained logs was normalized for repository checks; failure messages and result counts were not removed. Early first-render images are segregated under `iterations/first-render` and are not the final candidate evidence.
