# PlayRcmd standalone demo v1 — implementation report

Date: November 18, 2026. Status: local review build; no push, merge, publication, deployment or DNS changes.

## Delivered behavior

PlayRcmd opens independently at `/`, explains scattered sports information and the value of one family command center, and provides a prominent **Explore Interactive Demo** button. It enters the working fictional Rivera family directly at `/demo?scenario=family`, without visiting AP or Soccer Center. The landing includes the problem, benefits, authorized inputs and enterprise/OEM opportunity, with secondary ecosystem links. The brand uses forest green, sage and a custom directional mark, distinct from AP's collegiate design.

The demo reuses existing family overview, athlete selection, daily/weekly/monthly calendars, messages, changes, priorities, source details, action controls and six-step guided tour. Alex is green, Jordan blue and Taylor purple, with identifying names retained. `/setup` exposes the existing lightweight participant/manual event/UTC ICS workflow in a fictional browser-local sandbox. `/integrations` distinguishes working local inputs, fictional source examples and future authorized adapters. No new engine, authentication, provider connector, backend or data store was added.

The new package runs on its own server/port and keeps PlayRcmd records in a namespace in existing Web Storage. Reset clears only PlayRcmd setup records, drafts and view preferences, and reloads the original fixture and actions. The server exposes no AP application routes, global app script, private data endpoint or production catalog. The renderer composition seam and all adapters are explained in [the reuse map](COMPONENT-REUSE.md).

## Source and isolation

- Repository: `shawteone1/Arena-pathway-`.
- Source review head: `6e427754af0e8acd88a6597b5b41af6a49a30e42`, `codex/ap-recruiting-acceptance-20261117`.
- Work branch: `demo/playrcmd-standalone-v1`.
- Local implementation commit: use `git log -1 --format='%H %s'` on this branch; this report is included in that commit.
- Changes are additions only in `playrcmd/` and `docs/playrcmd/`. All existing AP tracked files, shared engines, data and assets remain byte-identical to the source review head. Soccer Center and LXDiN repositories/systems were not modified.
- No domain was invented or bound. No deployment target or credentials were added. LXDiN is handled in another Codex task, per the user.

## Validation and evidence

| Check | Actual result |
| --- | --- |
| Full repository automated suite, `npm test` | 321 passed, 0 failed; includes new standalone isolation test |
| Existing SIEM automated tests, `node --test test/siem*.test.mjs` | 40 passed, 0 failed |
| Standalone route / asset-closure / fictional-catalog / CSP / AP-route isolation test | Passed |
| JavaScript syntax checks for new server, views and adapter | Passed |
| Chromium 151 headless, desktop 1440×1000 | Passed standalone flow and captures |
| Chromium 151 headless, iPad landscape 1024×768 with touch | Passed standalone flow and captures |
| Chromium 151 headless, iPad portrait 768×1024 with touch | Passed standalone flow and captures |
| Chromium 151 headless, mobile 390×844 with touch | Passed standalone flow and captures |
| Existing AP family browser suite | 17 passed, 1 failed on unchanged AP code; see below |
| Physical iPad / Safari / WebKit | Not verified; WebKit native system libraries unavailable |

The standalone browser checks cover all three calendar views, all/none athlete filters and exact identity colors, original before/after cross-source evidence, all guided-tour steps, fictional setup, UTC ICS import and its calendar projection, production-sentinel storage exclusion, and namespace-only reset. All four viewport runs report zero JavaScript errors, zero failed assets, zero external requests and no horizontal document overflow. The sentinel is a synthetic test string, not real production data. Screenshots are captured from the actual running implementation, not rendered mockups. The illustrative command-center card on the landing is explicitly sample/demo content.

The existing AP browser suite's one failure is `test_first_screen_and_capture_comparison`, inherited from `qa-siem-refinement.py`: on the **college** scenario at 390×844, `nextActionBottom` is 857.84375px and exceeds the asserted 844px first-screen boundary. AP server, source, styles and tests are unchanged from the reviewed source commit. This failure is reported as an open baseline issue; the test and AP layout were not changed to make the result pass. The remaining 17 AP browser tests pass, including family sources/changes, source filtering, mode/scenario isolation, privacy, approval/reset, keyboard/focus, touch targets and sidebar/device checks.

Evidence:

- [Browser results by viewport](browser-results.json)
- [Standalone browser run](browser-tests.txt)
- [Repository automated test log](repository-tests.txt)
- [SIEM automated test log](siem-tests.txt)
- [Standalone route test log](standalone-tests.txt)
- [AP browser regression log with exact failure](ap-browser-tests.txt)
- [Actual screenshots index](SCREENSHOTS.md)

## External ecosystem links

Verified via HTTP GET on November 18, 2026. Each returned 200 at the exact requested URL, without a changed final destination:

| Link | Result | Placement |
| --- | --- | --- |
| https://soccercenter.org | HTTP 200 | Secondary Our Ecosystem section |
| https://arenapathway.com | HTTP 200 | Secondary Our Ecosystem section |
| https://la02uk.com | HTTP 200 | Secondary Our Ecosystem section |

No destination content or capabilities were invented. Availability at verification time does not imply ongoing uptime. External links open a separate tab with `noopener noreferrer`; no family/demo data is appended.

## Remaining acceptance limits

The November 18 AP acceptance review was not present in the inspected repository. Its outstanding improvements remain unverified/open and are not claimed as delivered. This implementation is ready for local partner review subject to reconciling that review and the documented baseline browser issue. Live providers, production accounts and dedicated-domain deployment remain outside this demonstration. See [open issues](OPEN-ISSUES.md).

## Review instructions

From the repository root, run `npm ci --ignore-scripts`, then `npm --prefix playrcmd start`. Open `http://127.0.0.1:4310`. The separate [review configuration](../../playrcmd/review.config.json) defaults to loopback port 4310; use `PLAYRCMD_HOST` and `PLAYRCMD_PORT` only for an authorized review environment. This package reads the shared modules from the same pinned checkout and is not deployed by copying only the `playrcmd/` directory.
