# Draft PR: Separate organization verification from current participation and opportunities

**Base:** `codex/live-qualification-recovery` at `9157faa660b28ceb69100595ebd2ed6b4da52ad8`
**Head:** `codex/progressive-sports-discovery`
**Status:** Draft review only; do not merge or deploy.

Families could not see reviewed organizations because scoped acquisition reviews were disconnected from the consumer read model and a named participation-program join was required. This adds source-bound organization verification independently of youth evidence, named programs, current seasons and registration.

Default youth discovery rises from **3 to 13 lacrosse organizations** and **4 to 9 volleyball organizations**. Sixteen reviewed profiles become accessible, including one explicitly unclassified organization with youth unknown; fifteen have published youth evidence. Five real named programs are retained. There are zero new verified current seasons, invented competition teams or current opportunities. Existing data, canonical IDs, source history and family state remain intact. No provider integration or separate portal was added.

The reusable discovery plan, source-link adapter configuration, preservation checks and source-to-visible reports reuse the existing engine. **Fresh independent-source live acceptance still fails: 0/6 identities, 0/6 youth qualification and zero cohort publications.** A 36-source crawl retrieved 26 pages and failed on 10; no source scope is complete. This change is reviewable as a publication correction, not a claim of dependable broad discovery or statewide completeness.

Validation: 160 Node tests and 27 Chromium browser tests pass on Node 22.23.4; brand hashes, cold ledger restore and historical preservation pass. Physical iOS Safari, VoiceOver, production scheduler and external blind research audit remain outstanding.

Review `ROOT-CAUSES.md`, `COVERAGE.md`, `LIVE-ACCEPTANCE.md`, `RULES-AND-RUNBOOK.md` and `QA.md` in this directory. The transfer README records the exact final head commit and bundle checksums.

Product charter assessment: this removes the need to restart research elsewhere merely because registration is unknown, while introducing explicit evidence statuses and two filters. The next action is to review the organization profile/source and confirm current eligibility. No unrelated commercial product becomes mandatory. Simulated integrations remain labeled. No push, merge, production publication or Soccer Center change was performed.
