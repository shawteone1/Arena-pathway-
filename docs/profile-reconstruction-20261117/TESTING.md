# Engineering verification and run history

Node24; headless Chromium at `/usr/bin/chromium`; managed WebKit launcher `/workspace/scratch/webkit-local.sh`. Local server after asset registration: `http://127.0.0.1:3007`. Desktop1440×900, iPad portrait810×1080, iPad landscape1024×768, phone390×844; explicit iPad touch context too. These are browser/viewport tests, not physical iPad/Safari certification.

## Final selected runs

| Command / suite | Chromium | WebKit | Log |
|---|---:|---:|---|
| `npm run check` (syntax + complete Node suite) | 310 passed /0 failed /0 skipped | — | `logs/check-final-complete.log` |
| `npm test` (same Node cases, not another310 unique tests) | 310 passed /0 failed /0 skipped | — | `logs/npm-test-final.log` |
| `qa-profile-foundation-20261117.py` | 2 /0 /0 | 2 /0 /0 | `profile-{chromium,webkit}-complete.log` |
| `qa-recruiting-reconstruction-20261117.py` | 1 /0 /0 | 1 /0 /0 | `recruiting-chromium-focus.log`, `recruiting-webkit-dom-ready.log` |
| `qa-supporting-20261117.py` | 4 /0 /0 | 4 /0 /0 | `supporting-{chromium,webkit}-eligibility.log` |
| `qa-profile-assets-20261117.py` | 2 /0 /0 | 2 /0 /0 | `assets-{chromium,webkit}-final.log` |
| Existing `qa-siem-family.py` | 18 /0 /0 | — | `siem-chromium-final.log` |
| Existing `qa-siem-webkit.py` | — | 5 /0 /0 | `siem-webkit.log` |
| Existing `qa-rss.py` | 5 /0 /0 | 5 /0 /0 | `rss-{chromium,webkit}.log` |
| Existing `qa-news-editorial.py` | 3 /0 /0 | 3 /0 /0 | `editorial-{chromium,webkit}.log` |
| **Final browser cases** | **35 passed** | **22 passed** | No final skipped cases |

The recruiting case contains four complete sport subjourneys per engine; it counts as one unittest case, not four extra cases. Responsive captures within a case are not counted as separate passing tests.

Reproduction example:

```sh
npm run check
npm test
PORT=3007 npm start
ARENA_QA_BASE=http://127.0.0.1:3007 python3 scripts/qa-profile-foundation-20261117.py
ARENA_QA_BASE=http://127.0.0.1:3007 python3 scripts/qa-recruiting-reconstruction-20261117.py
ARENA_QA_BASE=http://127.0.0.1:3007 python3 scripts/qa-supporting-20261117.py
ARENA_QA_BASE=http://127.0.0.1:3007 python3 scripts/qa-profile-assets-20261117.py
# Repeat the four new suites with PROFILE_BROWSER=webkit and a valid WEBKIT_PATH.
```

## Existing assertions and authorized change boundaries

All297 baseline automated cases remain. Twelve new domain cases cover removal(5), recruiting composition(4) and calendar/optional duration(3); Node also discovers the new approved-source helper module, yielding310 runner cases. No baseline test case was removed.

Old byte-freeze assertions cannot simultaneously require state/projection files to remain byte-identical and permit the explicitly requested removal/multi-athlete UI. Instead, exactly four authorized source paths are hash-pinned in `test/fixtures/nov17-approved-source.json`. All other protected baseline checks remain. Tests now assert the required mission/pillars, specific verification facts and optional-duration semantics; they do not demand the rejected UI. [198-file independent preservation proof](PROTECTED-FILES.json).

Historical checkbox recruiting/profile browser suites remain as historical files; they were **not** all rerun or falsely reported passing against replacement UI. Their accepted domain behavior remains in the full Node suite, existing SIEM/RSS/editorial suites, and the stronger replacement save/finish/return journeys. RSS setup/reload readiness changed from removed `#show-tryouts` to the finished profile marker; publisher/filter/rights assertions remain.

## Failures, corrections and intermittent runs

All retained attempts are indexed in [RUNS.json](RUNS.json). Log trailing whitespace is normalized; outcomes and failure traces are retained. Final pass counts above do not erase earlier failures.

- Initial Phase B new module404: explicit server asset allowlist/registration was missing. Corrected without weakening CSP; restart required after adding modules. Phase B then passed in Chromium and WebKit before recruiting replacement.
- Final-review disclosure collapsed after guidance acknowledgment: corrected view-state retention. Old async recruiting pane remained interactive while replacement loaded: corrected busy/inert lifecycle and generation guard. Editors/tests now await the completed information screen.
- New My Athletes header pushed accepted SIEM phone action below the first screen: reproduced by existing fold assertion. Corrected responsive header placement; targeted check then all18 SIEM cases pass, with unchanged threshold.
- Initial scroll assertion included Playwright's own pre-click auto-scroll. Pointer trace showed unchanged position at the actual selection. Now assert ≤2px from pointer-down plus connected focused control; no forced clicks or suppression.
- New archive test first used wrong module URLs (`/media-library.js` rather than `/assets/...`) and a CSP-sensitive string expression; corrected harness paths/function form. Both engines pass blob-retention and stale-writer checks.
- Guided-onboarding harness first matched hidden backing form controls as well as visible choices. It now clicks the visible sport choice and scopes fields to the existing wizard. No product assertion removed.
- Calendar harness initially assumed navigation date persists across reload. Athlete selection does persist; the accepted calendar resets its date. Test explicitly restores the selected week before asserting unchanged counts.
- WebKit had navigation/load/idle timeouts during development/concurrent runs, including cleanup navigation to JSON `/health` between sports. Each sport now uses the required fresh browser context; within each sport all pillar navigation, reload, saved composition and approval checks remain. Asset readiness asserts actual stylesheet availability rather than generic network-idle. Prior timeout logs retained.
- Later WebKit runs recorded a guidance-control wait and a reload-load timeout. Checking disclosure state alone did not resolve the reload timeout: logged initial states were closed. Final harness waits for DOMContentLoaded on reload and then the actual completed portfolio/state, rather than waiting for the whole video-bearing document load event. All approval/revocation/playback/persistence assertions remain. Final all-four-sport run passes; prior failures remain in `recruiting-webkit-focus.log` and `recruiting-webkit-review-state.log`. The isolated earlier control wait was not reproduced in the final run; its precise cause is not asserted.

No runtime browser page errors, silent retries in tests, disabled functional assertions, new source activation or external write operations were used to obtain the final result. These are scoped tests, not a comprehensive accessibility/security audit or performance benchmark.
