# PlayRcmd — independent enterprise-polish review candidate

Review branch: review/playrcmd-enterprise-polish-v1-2026-11-19.
Source reference explicitly named by the supplied package: Arena-pathway- branch demo/playrcmd-three-roles-v1, commit 482dc32063176562898dd52c0875c37d17fd545e.

## Repository boundary

The supplied patch references an existing PlayRcmd subproject in the AP source checkout, not an independent PlayRcmd repository URL. The user clarified that products must remain in independent repositories/deployments. This review is therefore LOCAL ONLY until the correct existing PlayRcmd repository is supplied. It must not be pushed to Arena Pathway or LXDiN, and it must not become a new engine fork. The source source checkout is isolated; its main/AP server, production hosting and shared files have not been edited. No repository has been consolidated or created.

## Product changes

Applied the supplied forest-green/energetic-accent landing design, command-center illustration, family/athlete/coach demo navigation, About Us, Mission, Contact and LA02UK portfolio sections. Added a locally served cinematic stadium photograph behind the hero. LA02UK is explicitly identified as parent organization.

The landing view now reads the supplied HTML. Only the explicit local landing asset allowlist and JPEG content type were added to the server. Its restrictive Content Security Policy is unchanged. The package's inline mobile-menu script was moved to a local JS file, and fonts were self-hosted, because the original inline/external assets would violate the existing policy. Existing shared Barlow font is reused; DM Sans license is included. No backend/dependency, database, scheduling logic, integration engine, model, adapter, fixture or demo controller changed.

## Assets

Stadium source: https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1800&q=85
Used as decorative cinematic atmosphere, not as a customer/partner endorsement or a product screenshot. Stored locally in enterprise-stadium.jpg.
DM Sans: Google Fonts, SIL OFL included in public/dmsans-OFL.txt. Existing shared Barlow font remains unchanged.

## QA results

PASS: node syntax checks of views.mjs, server.mjs and landing-polish.js.
PASS: npm --prefix playrcmd test — 8/8 tests. Includes existing roles, permission boundaries, recurrence/ICS, fictional notification deduplication, storage isolation, network projection and hosted-controller contract, plus a new HTTP regression check for the polished landing assets under the existing CSP.
PASS: live in-process HTTP requests to landing, roles, all three demo routes, setup, integrations and health; correct CSS/JS/TTF/JPEG MIME types; no inline script or external font import in the new landing; private landing source is not an extra served route. This is HTTP integration QA, not browser interaction testing.
PASS: original vs candidate rendering is byte-identical for demoPage(false, family/college/coach), setup, roleSelector and integrations. This was checked by importing the baseline view module alongside the candidate and comparing returned HTML.
PASS: git diff confirms all modified preexisting files are only playrcmd/views.mjs and playrcmd/server.mjs. All shared SIEM/AP sources, datasets, original demo assets and integration adapters remain unchanged.

Broader npm test: 328 tests, 314 passed, 14 failed. This checkout is shallow and numerous historical-preservation tests require absent reference commits (eca2d25, b8a19cf, f0429c3, 5d554b9, 5470bca, 39ecc7e, 31761f3, 9157faa, 95275cc and historical comparisons). The broad suite is NOT green; no unrelated engine/test changes were made to silence it. Required dependencies were installed from the existing lockfile with npm ci --ignore-scripts; dependency inputs did not change.

NOT RUN: actual desktop, iPad portrait/landscape and mobile rendering, browser interactions/reset, keyboard/screen-reader acceptance, overflow or console inspection. Browser-control tools are unavailable this turn; environment status lists desktop enabled/state unknown and no browser portal. No alternate browser/server, sandbox workaround or production deployment was attempted.

Before-and-after browser screenshots: NOT CAPTURED. Prior repository screenshots are historical and were not relabeled as this review's results. Baseline source is pinned above for later captures.

Contact section exists but no verified business inbox/form has been provided. The design's explicit unconfigured-contact disclosure remains. A verified direct contact route is a release dependency.

## Acceptance and next action

Status: LOCAL CODE REVIEW CANDIDATE; repository destination and browser acceptance are INCOMPLETE. Supply the existing independent PlayRcmd GitHub URL so the patch can be compared/rebased onto its actual source, rerun tests there, and push only a review branch. Do not copy the engine or import the AP repository wholesale into a new repository.

Problem addressed: fragmented product presentation; the supplied enterprise identity makes the working demo and integration limits clearer. New complexity is limited to local presentation assets; no unrelated product becomes a new mandatory dependency. No live integrations are claimed. iPhone/iPad usability remains unverified until browser QA can be completed.

No merge, deployment, publication, domain/DNS change or production-hosting change is authorized or performed.
