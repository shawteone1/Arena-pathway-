# Sports Discovery Engine v1 — automated test report

Node.js **22.23.4**. `npm run check`: **116 passed, 0 failed, 0 skipped**. Includes all 98 integrated RC test groups plus 18 discovery groups. `discovery:check` also validates the participation graph, exact baseline retention, source completeness and actual API/rendered publication.

`ARENA_QA_NO_SANDBOX=1 npm run test:release:browser`: **20 Chromium tests passed** at phone 390×844, tablet 768×1024 and desktop 1280×900. The original website/SIEM presentation source files remain byte-identical to the integrated RC. Real iPhone/iPad, native Safari, VoiceOver and external security/hosting/provider tests were not performed by this engine build.

New checks cover:

- Named diagnosis and unknown RMR denominators; 0/11 latest Skyline capture vs 11 retained teams.
- All 72 actual category/tool API and paginated HTML views, including duplicate card and pagination detection; 132 assigned teams available through classified views.
- Retention by IDs and payload hashes, preventing equal-total replacement from masking lost clubs; explicit evidence-backed scoped review decisions.
- Durable source revisions, expectation/run version bindings, reopen/reversion behavior and audit restoration.
- Configured additional source/plugin import, duplicate-safe corroboration and no automatic classification/publication.
- Configured JSON pagination success, budget failure, persistent frontier tasks and dropping unselected private fields.
- Unexplained membership decreases blocked from approval without deleting preserved records.
- Needs-review league-participant parent edges vs reviewed owning edges; orphan graph validation.
- Landing-only/missing-member completeness rejection.
- Two actual configured archive replays, repeated safely with original evidence/date and unchanged core identity/program counts.
- Sport/structure policy configuration, state-scoped identity namespaces and out-of-scope visitor exclusion.
- Refresh planning without an operational scheduler claim.
- UI/brand/SIEM and original research preservation; named findings and acknowledgment that cannot waive gates.
- Tampered registry-history rejection with transactional rollback; staged database identities distinguished from publishable programs.

The prior release test's whole-file data immutability assertion was refined into original entity/evidence preservation, original source-URL retention and program-ID retention, allowing reviewed additive imports. Brand and charter immutability remain exact. No original test group was removed, skipped or weakened to allow record loss; the new exact-ID publication baseline is a separate failing gate.

Current coverage: no unexplained loss of the 513 retained core records or previously visible club IDs. Source coverage remains partial: 15 blocked entries, 20 missing expected rows and 95 open original classification exceptions. These are reported gaps, not hidden test passes or complete-state claims. No new live-source verification occurred during this build.

See `SPORTS-DISCOVERY-DIAGNOSIS.md`, `SPORTS-DISCOVERY-MISSING.md`, `SPORTS-DISCOVERY-RUNBOOK.md` and `data/discovery/report.json`. Full raw test logs accompany the Codespaces transfer package. Transfer validation must include ZIP integrity, Git bundle restoration, exact commit and SHA-256 verification.
