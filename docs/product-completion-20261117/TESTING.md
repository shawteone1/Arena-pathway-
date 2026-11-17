# Engineering qualification results

Final selected cases all pass. Earlier failures/retries remain in logs and are discussed below; they are not silently added to the passing totals. `npm run check` includes the Node suite, so running `npm test` again is independent confirmation, not636 unique cases. The original310 Node tests remain, plus8 targeted cases. No existing browser case was removed.

| Command | Passed | Failed | Skipped | Evidence |
|---|---:|---:|---:|---|
| `npm run check` | 318 |0|0|[log](logs/release-check.log)|
| `npm test` | 318 |0|0|[log](logs/release-npm-test.log)|

| Browser suite | Chromium | WebKit |
|---|---|---|
| completion-parent-20261117 | [1 PASS](logs/release-completion-parent-20261117-chromium.log) | [1 PASS](logs/release-completion-parent-css-webkit.log) |
| product-completion-20261117 | [1 PASS](logs/release-25-step-visual-final-chromium.log) | [1 PASS](logs/release-25-step-visual-final-webkit.log) |
| completion-corrections-20261117 | [3 PASS](logs/release-completion-corrections-20261117-chromium.log) | [3 PASS](logs/release-completion-corrections-20261117-webkit.log) |
| completion-preservation-20261117 | [3 PASS](logs/release-completion-preservation-20261117-chromium.log) | [3 PASS](logs/release-completion-preservation-20261117-webkit.log) |
| completion-entry-20261117 | [3 PASS](logs/release-entry-independence-chromium.log) | [3 PASS](logs/release-entry-independence-webkit.log) |
| completion-editors-20261117 | [1 PASS](logs/release-completion-editors-20261117-chromium.log) | [1 PASS](logs/release-completion-editors-20261117-webkit.log) |
| profile-foundation-20261117 | [2 PASS](logs/release-profile-foundation-20261117-chromium.log) | [2 PASS](logs/release-profile-foundation-20261117-webkit.log) |
| recruiting-reconstruction-20261117 | [1 PASS](logs/release-recruiting-reconstruction-20261117-chromium.log) | [1 PASS](logs/release-recruiting-reconstruction-20261117-webkit.log) |
| supporting-20261117 | [4 PASS](logs/release-club-return-chromium.log) | [4 PASS](logs/release-club-return-webkit.log) |
| profile-assets-20261117 | [2 PASS](logs/release-profile-assets-20261117-chromium.log) | [2 PASS](logs/release-profile-assets-20261117-webkit.log) |
| rss | [5 PASS](logs/release-rss-chromium.log) | [5 PASS](logs/release-rss-webkit.log) |
| news-editorial | [3 PASS](logs/release-news-editorial-chromium.log) | [3 PASS](logs/release-news-editorial-webkit.log) |
| completion-publishers-20261117 | [1 PASS](logs/release-completion-publishers-20261117-chromium.log) | [1 PASS](logs/release-completion-publishers-20261117-webkit.log) |
| siem | [18 PASS](logs/release-siem-family-chromium.log) | [5 PASS](logs/release-siem-webkit-webkit.log) |

**Selected unique browser cases: Chromium48 / WebKit35; 0 failed, 0 skipped.** The four sports and25 main steps are subjourneys inside their cases, not inflated separate counts. Screenshot captures are not extra cases. [Exact machine-readable commands/results](FINAL-RESULTS.json).

## Runtime and responsive checks

Node24. Chromium uses `/usr/bin/chromium`; WebKit uses the installed Playwright-compatible launcher `/workspace/scratch/webkit-local.sh`. The actual responsive matrix is1440×900,810×1080,1024×768 and390×844; a separate iPad touch-emulation test saves/reloads profile information. Reduced motion, keyboard operation, touch targets, dialog focus and no horizontal overflow are checked. No claim of physical Safari/iPad certification.

The local app was served with `PORT=3113 node server.mjs`; after the last narrowly scoped CSS specificity fix, a fresh server on3114 was used for parent, editor,25-step and strengthened club-return evidence. No product JS/domain logic changed during those final captures. Actual scripts accept `ARENA_QA_BASE`; set `ARENA_PROFILE_OUT=docs/product-completion-20261117/after` and `ARENA_EDITORIAL_OUT=docs/product-completion-20261117/after/rss` to keep older evidence intact.

## New regression coverage and retained assertions

- `test/family-home.test.mjs`3cases: original same-ID family projection, honest empty family, complete saved-record lookup.
- `test/completion-integration.test.mjs`5cases: selected-only history/location/goals, saved-source revision, local history/follow-up/actions, unknown-version/quota protection, and unconfirmed team exclusion.
- New browser suites cover actual parent home, full same-family25 steps, reviewed keyboard picker/stale team listener cleanup, exact pagination ID conservation, nested competition/media preservation, current local message/action return, actual publishers and independent focused education save.
- Existing test assertions were adapted to intentional Archive/Build labels, actual async-ready states, and correct bounded pagination. The old “all rows on one page” assertion became a stronger exact original-ID conservation test. No assertions were removed simply to pass. The source guard hash updates are restricted to the two explicitly authorized local adapter/action-persistence files; SIEM models/fixtures and data remain byte-identical.

## Earlier failures, corrections and repeated runs

All attempt logs are retained under `logs/`, not only successful selected runs. Browser unittest has no automatic retry loop. Corrected code/harness runs are counted once in the selected table.

1. Baseline observational probes reproduced real omissions: missing integrated parent home, missing focused reviewed club search/retained-team warning, missing recruiting goals/history/location/detail choices, approval without a current saved revision, and unbounded directory density. These are fixed and traced.
2. Integration review then found lost Swimming target editor, incomplete saved-record lookup, missing local action/history persistence, stale hidden-team keyboard handlers and the global SIEM context route. Targeted regressions now cover them.
3. Harness corrections retained in early logs: visible versus attached hidden scenario selector; closed dialogs versus `dialog[open]`; existing Save profile label versus assumed parent-specific label; two legitimate empty-family Add Athlete links versus scoped header; existing directory Next-arrow link versus an assumed text label; clearing the chooser initial search before expecting all records; correctly opening both local-tools disclosures; and optional empty `programTeam` represented as an absent key. These were corrected without weakening the intended outcomes.
4. Native-video navigation in WebKit once timed out waiting for the whole page load event; the test now waits for DOMContentLoaded plus the actual completed athlete/portfolio UI and still verifies playable video, saved state and reload. Earlier timeout logs remain. This is a harness timing change, not an assertion that all Safari media timing is certified.
5. Some long baseline directories exceeded WebKit32767px full-page capture limits; paginated current directories retain all IDs. Initial unscrolled lazy-photo captures were not asset failures: real scrolling/decoding verified natural dimensions. Current asset-failure tests separately exercise real stylesheet/asset failure recovery.
6. One managed cloud environment connection reset interrupted earlier work. Files were preserved; final selected suites were rerun after environment readiness. No earlier interrupted run is counted as passing.
7. Final screenshot review found the legacy profile selector overriding parent saved-link font/spacing. Scoped CSS was corrected and both engines assert computed15px minimum font and20px link margin in the affected parent section.

## Scope boundaries

Actual original publisher links for all four sports returned200 in both engines. External non-read requests are blocked in reference/publisher probes. Synthetic RSS fixtures test live-adapter mechanics/rights/failure behavior; production RSS remains unactivated. Fresh SC public readback confirms demo/LockedIn200 and Parent Portal authentication redirect. Protected production editing is not browser-verified.

The SIEM-only independence case creates only a parent, without a full athlete profile, and verifies that global SIEM still opens the local family and excludes fictional Slack. This already worked; no additional product change was made. Trailing whitespace in retained logs was normalized for repository checks; failure messages, assertions and counts were preserved.
