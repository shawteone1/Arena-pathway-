# PlayRcmd — executive qualification

**READY FOR GITHUB REVIEW — local branch only.** November 18, 2026.

Branch: `demo/playrcmd-standalone-v1`. Qualified from `e3d694d9c89e37ca4882bcd59be5ce2e93a271ba`; this report and verified corrections are in the following local qualification commit (`git log -1 --format='%H'`). No push, merge, deployment, publication or DNS change. Soccer Center and LXDiN remain untouched.

## Decision and corrections

The remaining AP layout failure was a **genuine inherited phone-density defect**, not a PlayRcmd engine regression or an obsolete assertion. The existing SIEM first-screen contract still requires the commitment, priority and next-action text to fit. AP's two-row phone header retained excess outer spacing after navigation expanded. A scoped CSS correction changes only its vertical padding and row gap below 700px. All navigation, text sizes, content, 44px controls and original assertions remain.

| College Everyday, 390×844 | Before | After Chromium | After WebKit |
| --- | ---: | ---: | ---: |
| AP header height | 113px | 95px | 95px |
| Next-action bottom | 857.84px — FAIL | 839.84px — PASS | 820.34px — PASS |

Actual screenshots: [before](qualification/before/ap-college-phone-viewport.png) / [after](qualification/after/ap-college-phone-viewport.png). [Original failing log](qualification/before/ap-layout-test.txt), [72-case cross-engine measurements](qualification/after/cross-engine-layout.json).

A separate WebKit **test synchronization defect** was also corrected: the parent-return test previously waited only for a server-rendered select, then navigated away while SIEM imports were pending. Diagnostics recorded canceled `local-family-calendar.js` and `siem-platform-model.js` requests. The test now requires the real `data-startup-state=ready` dashboard and family grid. This strengthens startup coverage; page-error and behavioral assertions remain intact. [Diagnostic evidence](qualification/before/parent-webkit-network.json), [original failure](qualification/before/parent-webkit-original.txt), [corrected run](qualification/after/ap-completion-parent-20261117-webkit.txt).

## Final relevant checks

| Qualification gate | Result |
| --- | --- |
| `npm run check` — syntax/data/participation/discovery and full Node suite | **321 passed, 0 failed** |
| Existing SIEM automated suite / standalone isolation test | **40 / 1 passed**; subsets of the Node total |
| Original AP family Chromium browser suite | **18/18 passed** |
| AP WebKit SIEM startup, legacy listeners, modes, approval/privacy and asset recovery | **5/5 passed** |
| Current AP entry, preservation and parent-return suites | **7/7 Chromium; 7/7 WebKit passed** |
| Unchanged first-screen bounds, 3 roles × 3 modes × 4 sizes × 2 engines | **72/72 passed** |
| PlayRcmd landing → demo, navigation, setup/import, reset and storage isolation | **4/4 viewport flows per engine passed** |

Chromium **151.0.7922.34**, installed Chromium **156.0.8078.79** (current AP profile suites), and actual Playwright **WebKit 26.5** were exercised. WebKit ran using user-local native libraries and a launcher outside the repository; no host package installation or product configuration change was required. **Physical iPad/Safari and macOS Safari were not available.** No user-agent substitution is counted as Safari testing.

Desktop 1440×1000, iPad 1024×768 and 768×1024, and phone 390×844 were browser-inspected in both engines. Landing, demo entry, family/setup, navigation, source labels and reset work without horizontal page overflow, JavaScript errors, failed assets or external requests. Fictional family/sample inputs and unconnected/simulated providers remain clearly labeled. [Actual screenshot index](qualification/SCREENSHOTS.md), [flow results](qualification/after/browser-results.json), [all commands/results](qualification/RESULTS.md).

## Preservation, ecosystem and limits

The only existing **runtime** file changed is `public/siem-platform.css`, scoped to the AP SIEM phone header. Models, fixture data, controllers, server, catalog and storage contracts remain byte-identical to `e3d694d`. The original failing layout test is byte-identical. [Source integrity evidence](qualification/source-integrity.json).

All three ecosystem links are preserved at their exact supplied HTTPS destinations and returned HTTP 200: **Soccer Center**, **Arena Pathway**, **LA02UK**. The LA02UK reference still points to `https://la02uk.com`. There was no explicit legal ownership statement in the approved source, and the public destination does not substantiate ownership of PlayRcmd; no ownership wording was invented. [Read-only destination evidence](qualification/ecosystem-verification.json).

A supplemental historical `qa-release.py` run has **14 passes and six legacy failures on both the untouched approved commit and this candidate**, with identical failing case names. These are not counted as passing or hidden: the suite still expects retired profile Recruiting controls and old directory/media defaults. The maintained suites above verify the current behavior. [Baseline/candidate comparison](qualification/RESULTS.md#historical-release-suite).

This is qualification for GitHub review of the fictional standalone demo, not production integration or physical-device certification. No live connectors, authentication or data stores were introduced. The unavailable November 18 AP review remains an external traceability item; this build does not claim its unrelated improvements.
