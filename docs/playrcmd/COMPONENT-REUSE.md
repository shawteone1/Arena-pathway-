# PlayRcmd component reuse map

Baseline: `shawteone1/Arena-pathway-`, review head `6e427754af0e8acd88a6597b5b41af6a49a30e42` (`codex/ap-recruiting-acceptance-20261117`). Main at `676b685` is an older three-file bootstrap without SIEM. No upstream source files were changed for this package.

| Capability | Shared implementation, used directly | PlayRcmd adaptation |
| --- | --- | --- |
| Family command center and navigation | `src/siem-platform-view.mjs`, `public/siem-platform.js`, `public/siem-platform.css` | Extract existing main fragment; retain all controller IDs; own header, footer, colors, routes |
| Lightweight setup and manual events | `src/siem-view.mjs`, `public/siem.js`, `public/siem-model.js` | Fictional-only instructions; own setup route; omit unrelated product permission presentation |
| Rivera family, source attribution, sample commitments | `public/siem-family-fixtures.js`, `public/siem-platform-fixtures.js` | Default accepted Rivera scenario; only family/local sandbox options exposed |
| Day/week/month, boundaries, filters | `public/siem-calendar.js`, `public/siem-additions.js` | Stable Alex green, Jordan blue, Taylor purple; names and labels retained |
| Normalization, scope, correlation, priorities, source health, actions | `public/siem-platform-model.js`, `public/siem-model.js` | None; use existing contracts and behavior |
| Guided demonstration and athlete color identity | `public/siem-guidance.js` | Existing six-step tour; PlayRcmd color values through CSS |
| Fictional Slack-style drafts | `public/siem-additions.js` | Existing session storage contract through scoped wrapper; nothing sent |
| Local calendar and stable athlete references | `public/local-family-calendar.js`, `public/state.js`, `public/athlete-lifecycle.js`, `public/meet-sessions.js`, `public/recurring-plans.js`, `public/regions.js` | Existing storage API with a PlayRcmd namespace; no AP records read |
| Calendar import | `public/siem-model.js` `parseICS`, existing `siem.js` form | Exact UTC snapshot interface and existing rejection/size limits |
| Brand / landing / interoperability explanation | New `playrcmd/views.mjs`, `playrcmd/public/style.css`, favicon | PlayRcmd-owned presentation only |
| Routes and review server | New `playrcmd/server.mjs`, `review.config.json` | Own port, host, health endpoint, strict asset list, empty catalog projection |

## Shared interface

The renderer contract is `<main id="main">…</main>` with the established `platform-*` and `siem-*` IDs. `extractMain()` fails explicitly if that boundary disappears. The AP layout and global app controller are not included. Existing shared modules are served at `/assets/` by allowlist, with their original relative ES module imports. The dependency-closure test requires all relative module imports to be present in that allowlist.

`adapter.js` installs a narrow `getItem`, `setItem`, `removeItem`, `clear` Web Storage facade **before** dynamic imports execute. Keys remain the same inside the core and are prefixed `playrcmd.demo.v1.` at the actual browser storage boundary. AP keys are not enumerated, loaded, migrated or deleted. An unavailable native storage API uses page-memory fallback. Reset clears only this namespace in local/session storage and returns to the family scenario, resetting actions, filters and calendar defaults by reinitializing the original modules. This is isolation for a demonstration, not an authentication/security boundary against arbitrary same-origin script.

Routes produced by the shared controller are translated to `/demo`, `/setup` or `/integrations`. A MutationObserver handles newly rendered links. No AP navigation, LockedIn workflow or external product dependency is needed to use the demo. `/api/catalog` provides `{opportunities:[],sources:[],organizations:[]}` to satisfy the existing read contract without serving production or directory records.

The activity model remains the existing version-2 contract: tenant, source identity/event reference, organization/team/participant scope, timestamps/timezone, status, evidence, requirements and permissions. No adapter fabricates verification, synchronization or authorization. Consult `docs/SIEM-INTEGRATIONS.md` for the existing support matrix and `docs/SIEM-UX-V2-CONTRACT.md` for normalized activity contracts.

## Reuse by other products

Arena Pathway continues to use its unchanged views and server. PlayRcmd composes those same views and modules with its own adapter. Soccer Center and authorized OEM products can use this composition boundary with their own branding, approved context and deployments; they are not modified or integrated by this build. Before shipping the core as a separately versioned package, extract the view-content boundary from the AP layout dependency, pin contract versions, and rerun both consumers' regression suites. This demo intentionally avoids a broad architecture refactor.
