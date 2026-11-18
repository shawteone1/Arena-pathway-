# Qualification commands and supporting results

Baseline: `e3d694d9c89e37ca4882bcd59be5ce2e93a271ba`. Original source head before PlayRcmd: `6e427754af0e8acd88a6597b5b41af6a49a30e42`. Work branch remains `demo/playrcmd-standalone-v1`. No remote write or deployment.

## Local runtime

- PlayRcmd: `npm --prefix playrcmd start`, loopback port 4310.
- Candidate AP: `PORT=4320 node server.mjs`.
- Approved baseline AP: a detached local worktree at `e3d694d`, `PORT=4321 node server.mjs`; no baseline source edits.
- Playwright Chromium **151.0.7922.34** for standalone, density and original SIEM browser tests.
- Current AP profile suites use installed `/usr/bin/chromium`: **156.0.8078.79**, Debian 13.
- Actual Playwright WebKit **26.5**, headless WPE; no user-agent simulation.
- Physical iPad, iOS/macOS Safari: **unavailable / not claimed**.

WebKit's native dependencies were downloaded as Debian packages and extracted in `/workspace/scratch/webkit-libs/root`, not installed into the host or committed. The test-only launcher `/workspace/scratch/webkit-runtime/run-webkit.sh` starts the installed Playwright `minibrowser-wpe/bin/MiniBrowser` with its normal bundle paths plus those local libraries. `WEBKIT_PATH` is the existing suites' supported launcher override. This resolved the previous runtime limitation without changing application CSP or suppressing any runtime errors. Other environments can use their normally installed Playwright WebKit and omit the override.

## Executed commands

Run from the repository root. Paths and browser launcher locations below describe this execution workspace; override them with installed equivalents elsewhere.

```sh
npm run check
node --test test/siem*.test.mjs
npm --prefix playrcmd test

CHROMIUM_PATH=/home/agent/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome \
  ARENA_QA_ARTIFACTS=docs/playrcmd/qualification/after \
  python scripts/qa-siem-family.py

ARENA_QA_BASE=http://127.0.0.1:4320 \
  WEBKIT_PATH=/workspace/scratch/webkit-runtime/run-webkit.sh \
  ARENA_QA_ARTIFACTS=docs/playrcmd/qualification/after/ap-webkit \
  python scripts/qa-siem-webkit.py

PLAYRCMD_ENGINES=chromium,webkit \
  WEBKIT_PATH=/workspace/scratch/webkit-runtime/run-webkit.sh \
  PLAYRCMD_QA_ARTIFACTS=docs/playrcmd/qualification/after/playrcmd \
  python playrcmd/test/browser.py

QUALIFICATION_ENGINES=chromium,webkit \
  WEBKIT_PATH=/workspace/scratch/webkit-runtime/run-webkit.sh \
  python playrcmd/test/qualify-layout.py
```

For **each** `PROFILE_BROWSER=chromium` and `PROFILE_BROWSER=webkit`, set `ARENA_QA_BASE=http://127.0.0.1:4320`, `WEBKIT_PATH` as above, and `ARENA_PROFILE_OUT=docs/playrcmd/qualification/after/ap-current-<engine>`, then execute:

```sh
python scripts/qa-completion-entry-20261117.py
python scripts/qa-completion-preservation-20261117.py
python scripts/qa-completion-parent-20261117.py
```

The parent case was rerun once per engine after strengthening its actual-startup wait. Its original WebKit error and diagnostic run remain in `before/`; they are not counted as successful final runs. All behavior and zero-page-error assertions remain. No automatic retry loop was used.

## Evidence index

| Check | Result | Evidence |
| --- | --- | --- |
| Full required check | 321 Node cases pass plus syntax/data/participation/discovery checks | [Log](after/automated-checks.txt) |
| SIEM automated subset | 40 pass | [Log](after/siem-automated.txt) |
| Standalone route/isolation subset | 1 pass | [Log](after/playrcmd-automated.txt) |
| AP family Chromium | 18 pass | [Log](after/ap-family-chromium.txt) |
| AP WebKit | 5 pass | [Log](after/ap-webkit.txt) |
| Current AP suites Chromium | 7 pass, 0 fail | [Manifest](after/ap-current-chromium.json) |
| Current AP suites WebKit | 7 pass, 0 fail | [Manifest](after/ap-current-webkit.json) |
| AP first-screen matrix | 72 combinations pass | [Log](after/cross-engine-layout.txt), [raw metrics](after/cross-engine-layout.json) |
| PlayRcmd per-engine four-size flows | 8 flows pass, no page errors/failed assets/external requests | [Log](after/playrcmd-browser.txt), [records](after/browser-results.json) |
| Existing models/controllers/server/original first-screen test unchanged | Verified against Git objects | [Source integrity](source-integrity.json) |
| Ecosystem URL destinations | Three HTTP 200 responses at exact supplied URLs | [Evidence](ecosystem-verification.json) |

`npm run check` includes the standalone Node test and the SIEM Node subset: these totals must not be added together. Responsive matrices and screenshots are subchecks, not inflated separate test cases. All log counts are from actual runs. Most redundant AP full-page captures were pruned after inspection; all failure logs, selected before/after captures, full measurements and 64 final PlayRcmd screenshots remain.

## Historical release suite

A supplemental `scripts/qa-release.py` run exercised older inherited profile assertions. It finished with **14 passes, 2 assertion failures and 4 selector errors**. The **same unmodified suite** was then run against the detached approved-commit worktree and produced the **same 20 per-case outcomes**. [Machine comparison](legacy-suite-comparison.json), [untouched baseline log](before/legacy-release-full.txt), [candidate log](after/ap-release-chromium.txt).

| Legacy case | Same baseline/candidate outcome | Expectation diverging from current source |
| --- | --- | --- |
| `test_calendar_and_recruiting_handlers_work_only_when_enabled` | ERROR | Waits for removed `#recruiting` profile container |
| `test_disabled_modules_leave_no_sections_or_links_and_keep_data` | ERROR | Waits for removed `#recruiting` profile container |
| `test_family_profiles_keep_separate_choices_and_new_profile_is_parent_controlled` | ERROR | Reads retired inline `#recruiting-notes` |
| `test_mobile_tablet_directory_profile_and_review_accessibility` | ERROR | Taps old `.engine-filter-options summary` |
| `test_media_sources_survive_disabled_module_and_builder_edits` | FAIL | Expects old `du-news` checkbox default/selection |
| `test_seven_modules_saved_opportunities_and_youth_recommendations` | FAIL | Expects `competitive` default; current value is `any` |

The profile Recruiting-container expectations conflict explicitly with the accepted [November 17 retirement architecture](../../recruiting-acceptance-20261117/ARCHITECTURE.md): one dedicated Recruiting route, with old profile checklist/template/constructor removed. The other three directory/media expectations also fail on the untouched approved source. This qualification does **not** claim to repair those historical tests or infer a new product defect from them. Their behavior and assertions are unchanged; the current maintained entry/preservation/parent suites and full Node contracts are the passing product gates. No previously passing case in this supplemental suite regressed.

## Scope and inspection

Screenshots were reviewed for landing hierarchy and CTA, independent demo navigation, desktop/iPad/phone readability, fictional-data notices and source simulation labels. Automated interaction follows the actual CTA, tours all six steps, filters athletes with stable green/blue/purple identity, checks before/after source evidence, creates fictional participants, imports a UTC ICS sample, reads it in the local calendar and resets the scoped workspace while preserving an unrelated synthetic AP storage sentinel.

The header correction applies only to `body[data-page="siem-platform"] > .site-header` below 700px. It changes **only** row-gap 10→2px and vertical padding 7→2px; computed header height is 113→95px. It leaves typography, content, touch dimensions and all model/state behavior unchanged. PlayRcmd uses its separate `.pr-header`, so its premium landing/header is unaffected.

LA02UK's existing ecosystem link was verified and preserved. Neither the approved source nor the public page supplied an explicit legal ownership statement; no new ownership claim was introduced. This is precise URL/reference verification, not legal-ownership certification.
