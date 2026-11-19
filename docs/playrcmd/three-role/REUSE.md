# Three-role component reuse and adapters

| Capability | Existing reused implementation | New implementation in this branch |
| --- | --- | --- |
| Command center and calendar/messages/action navigation | `src/siem-platform-view.mjs`, `public/siem-platform.js`, `public/siem-platform.css` | Own role navigation and labels; guarded served-response composition via `playrcmd/controller-adapter.mjs` |
| Family example | `public/siem-family-fixtures.js` | None in default scenario: original activities/sources preserved; optional local overlays only after explicit entry/application |
| Athlete and coach scenarios | `public/siem-platform-fixtures.js` | `public/playrcmd-roles.js` enriches scoped fictional records, class/work/travel/game examples and a third organization/team |
| Daily/weekly/monthly calendar and category filters | `public/siem-calendar.js`, `public/siem-additions.js`, existing controller | None; same grid, boundaries, athlete/team selection and shared core rendering |
| Activity normalization and organization/participant permissions | `public/siem-platform-model.js` `activityContract`, `canRead`, `scopedActivities` | Adapter supplies explicit fictional memberships and validates every added record; corrupted/out-of-scope records fail closed |
| Changes, action priorities, correlation, approvals and source status | Existing SIEM model/projection/action functions | No rewritten algorithms; host entries are projected into the original controller |
| Manual entry and bounded recurrence | `public/siem-model.js` `expandWeekly`; `public/recurring-plans.js` `denverInstant` | Role forms and mapping to original normalized activity contract |
| Calendar import | `public/siem-model.js` `parseICS` | Role-aware form; stable UID upserts; atomic staging before local save |
| Fictional provider examples | Original Rivera source/change scenario and existing contracts | Two structured notification records per role, explicit identity matching, approval, replay guard and canonical-event updates |
| Team messages | Existing shared Messages section | Team-scoped local draft composer; no send path; disabled sending control |
| Coach session plans | Existing Web Storage lifecycle/isolation | Small bounded team-keyed local notebook; save/read/delete, no new DB, training or club administration engine |
| Public network/opportunities | `src/unified-directory.mjs` `directory`, `opportunities`, `clientCatalog`, `sourceFor` | `playrcmd/network.mjs` read-only bounded projection; `/api/network`; source/freshness/empty-state presentation |
| Family setup | Original `src/siem-view.mjs`, `public/siem.js` and local calendar model | Retained as separate fictional family sandbox; no profile prerequisite |
| Brand and role entry | Original PlayRcmd shell, landing, typography/colors and ecosystem | `/roles` selector; mobile role toolbar/dialogs and coach-team cue colors |

## Controller composition contract

The controller remains the original on-disk AP file. PlayRcmd alone serves a composed `/assets/siem-platform.js` response: one exact scenario-loader expression delegates to `globalThis.siemDemoHost.loadScenario(kind)` when supplied, otherwise retaining the full existing default; one local-update listener re-loads host data and calls the existing `render()` and status functions. The listener preserves the in-page action state and adjusts the existing calendar anchor/section. It adds no event evaluation or scheduling rules.

The composition adapter requires exactly one expected loader expression and throws if the contract changes. A targeted test checks its failure path. The original AP source hash guards remain unchanged and pass. The AP server does not use this adapter or expose the new fixture module. Upstream controller changes require a deliberate seam review, not silent substring drift.

The new fixture module is located next to shared pure modules to preserve their existing relative ES-module imports. It is only added to PlayRcmd's explicit asset allowlist. There is no copied SIEM implementation, AP global app script or extra profile runtime in the PlayRcmd client.

## Storage, identity and access

`adapter.js` installs role-specific Web Storage facades before loading any SIEM module: `playrcmd.demo.v2.family.`, `.college.` or `.coach.`. Shared legacy keys remain unchanged inside the facade. The role overlay uses `playrcmd.role.<kind>` within that scope and retains bounded normalized entries, applied fictional notification IDs, small drafts and session notes. Stable manual identity includes participant/team plus reference; ICS identity includes participant/team plus UID. Replays update the same event, not a second commitment. Shared exact-duplicate calendar evidence is retained while known fixture copies remain coherent.

The family local setup uses the family namespace. Existing AP and PlayRcmd v1 storage is neither loaded nor migrated/deleted. Reset clears the active role's local/session prefix and reloads that role's fixture. Switching role creates a new document and controller, keeping filters, raw private messages and session state from crossing roles. Public network records are shared intentionally; private role notes are not.

This is a prototype boundary over fictional data, not authenticated multi-tenant storage. The production authorization layer remains a separate requirement. No sensitive documents, production athlete information, credentials, payment data, live provider connector or sending endpoint is added.
