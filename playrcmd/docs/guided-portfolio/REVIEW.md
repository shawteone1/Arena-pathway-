# PlayRcmd guided setup + fictional portfolio connectivity

Review branch: `review/playrcmd-guided-portfolio-2026-11-20`.
Baseline: `9c93e2dd4f2087aec5e6bd185a91bbd585191efe`.
Status: IMPLEMENTED FOR REVIEW; real browser/device acceptance remains blocked.

## Working behavior

- First launch of each role opens a skippable five-step wizard: role, minimal athlete/team associations or portfolio examples, existing planner/calendar/ICS, notice/opportunity interests, review/save.
- Back, skip-step, skip-setup, save/exit, resume, edit and guided reset are provided. Existing role reset remains in place.
- Edit My Setup and Start Tour remain on the dashboard. The established guided tour is reused in the active role through a guarded PlayRcmd-only serving adapter, without editing the shared tour source.
- Add/edit/remove lightweight local associations, and attach another sport/team to the SAME athlete identity. Manual recurrence and ICS use the original SIEM/calendar primitives. Local coach session plans use the existing workspace shape and permissions.
- Parent setup can opt into the original family builder's existing read-only projection. Its records are not migrated, copied into a second source store or rewritten. The builder opens in a separate tab.
- Pull from Soccer Center / Pull from Arena Pathway show existing local data and provider examples before selection. Nothing is preselected. Only chosen fields enter the reviewed transaction.
- Create, link and selected-field update are user-initiated LOCAL SIMULATIONS. Conflict choices default to existing values. Parent approval, minor self-transfer blocking, subject/team separation, stable identifiers, stale-preview detection and guarded last-transfer rollback are implemented.
- Dashboard summary explicitly distinguishes fictional fixtures, selected imported snapshots and simulated external links; connected/synchronized providers are NONE.
- Existing profile/recruiting permissions, ages/guardian status and private information are not imported as authority. No external account, mailbox, connector or database is accessed. Canonical mock destination records do not imply production APIs exist.

## Preservation

Approved enterprise landing HTML/CSS, original role views, role fixtures/model, SIEM/calendar/profile/recruiting engines and original shared tour source are byte-identical to the baseline. The new model file `public/playrcmd-onboarding.js` is a PlayRcmd-only adapter using existing primitives, not a replacement engine. Existing AP and SC production code and databases were not changed.

Presentation changes are limited to the PlayRcmd adapter/tools, explicit static asset allowlist and PlayRcmd-only guarded tour composition. CSP remains restrictive; no unsafe-inline was added. No new runtime package, database, API endpoint, background job or production integration was added. Existing role browser-test assertions remain intact; they now dismiss the optional first-launch wizard when exercising the earlier role journeys.

## Acceptance evidence

- Focused PlayRcmd tests: **25/25 passed**, including the original tests and 17 new contract/flow checks.
- Broader source suite: **345/345 passed**, 0 failures/skips; evidence/full-suite.txt.
- DOM interaction checks: PASS for Parent, Athlete and Coach: first launch, Back/skip/edit/save, existing planner hook, existing tour hook, selected profile pull/approval/undo, create/link/update and duplicate rejection, and returning-user dismissal. The test uses jsdom and dialog stubs; it does NOT qualify native dialogs, actual layout or browser behavior.
- JavaScript/Python syntax checks: PASS for new/changed modules and browser-runner files.
- HTTP checks in the focused suite: new scripts/CSS served; original roles/assets remain available; restrictive CSP preserved; no live portfolio endpoint introduced.
- Source preservation comparison: PASS against the exact baseline for landing HTML/CSS, role views and underlying engines.

## Browser/device tests and screenshots

Attempted actual browser initialization with cua.getState(). It failed before any page load: “the gaas-browser node_repl sandbox cannot be disabled”. No bypass was attempted.

| Requirement | Result |
| --- | --- |
| Desktop, iPad landscape, iPad portrait, phone rendering | NOT VERIFIED |
| Actual touch/keyboard/native modal behavior and overflow | NOT VERIFIED |
| Real-browser demo journeys, role switches, reset, tour restart | NOT VERIFIED |
| Browser console/network errors | NOT VERIFIED |
| Actual screenshots | NONE CAPTURED |

The real-browser runner is `playrcmd/qa/onboarding-browser.py`; original role acceptance remains in `playrcmd/test/three-role-browser.py`. Run them in a supported environment using PREVIEW.md. No screenshot or visual pass is fabricated.

## Remaining production work

See FIELD-MAPPING.md for inspected source schemas and detailed field/exclusion rules. Production requires authenticated identity/guardian/age checks, provider-specific official APIs, consent scopes, server-side tenant/organization authorization, idempotency and concurrency control, audit/retention, validated timezone/recurrence semantics, and destination-owned rollback policies. Browser-local roles and checkboxes are demonstrations, not production authorization boundaries. Actual cross-product writes/synchronization remain unavailable.

## Founder checklist

- [ ] Open a separate review Codespace/checkout using PREVIEW.md. Confirm no live system is addressed.
- [ ] Inspect first launch, skip/back/save/resume, manual athlete/team edits, additional sport/team, planner and tour on all four device sizes.
- [ ] Parent: opt into the existing builder; confirm its data stays in place and appears through the read-only projection.
- [ ] Pull a selected snapshot; check default keep/explicit apply and repeat import. Push create, link then update; test duplicate blocking and undo/stale undo.
- [ ] Switch roles and reset one role; confirm other roles and native product storage remain separate.
- [ ] Confirm the approved landing page remains unchanged and approve the finished behavior only after real browser evidence.

No merge, deployment, publication, DNS change or live-site modification is authorized by this review package.
