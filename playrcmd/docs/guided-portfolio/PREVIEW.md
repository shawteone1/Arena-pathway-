# Guided setup review preview

Review branch: `review/playrcmd-guided-portfolio-2026-11-20`, based on verified `9c93e2dd4f2087aec5e6bd185a91bbd585191efe`. Use a SEPARATE existing-source checkout/Codespace, not the original review terminal or a live server. No preview was deployed automatically.

```sh
git fetch origin review/playrcmd-guided-portfolio-2026-11-20
git switch --track origin/review/playrcmd-guided-portfolio-2026-11-20
npm ci --ignore-scripts
PLAYRCMD_HOST=0.0.0.0 PLAYRCMD_PORT=4310 node playrcmd/server.mjs
```

Node >=22.13. Keep the full source checkout for the existing SIEM dependencies. Do not run root `npm start` (Arena Pathway). Forward port 4310 privately in Codespaces and open its actual HTTPS forwarded address while signed into the owner account on iPad. Leave the upstream protocol HTTP; GitHub terminates external HTTPS. No DNS or domain changes.

Open `/roles`, then a role, or `/demo?scenario=family`, `/demo?scenario=college`, `/demo?scenario=coach`. On first launch of each role the setup wizard opens. To reopen deliberately, use Edit My Setup or append `&setup=1`. Existing skipped/saved role data remains in place; the original reset control clears only that role and restarts first launch.

## Founder walkthrough

1. Choose Parent/Athlete/Coach. Try Back, Skip this step, Save & exit, resume, and Skip setup.
2. Add a fictional athlete/self/team association; edit it. Add a second team/sport to an existing athlete without another athlete record. Under-18/age-unconfirmed athlete self-transfers are blocked; the adult college fixture and parent-managed examples are labeled.
3. Parent: optionally include records from the ORIGINAL family builder, open it and return. No builder storage migration occurs.
4. Use the original Add/import planner for manual events, weekly recurrence and a supported UTC ICS snapshot. Close it and use Edit My Setup to resume.
5. Choose fictional notice/opportunity interests and save the reviewed command center. Reopen the page: first-launch wizard should stay dismissed.
6. Start Tour at any time. It reuses the established tour and keeps the current role. Skip/restart through its existing controls.
7. Pull from Soccer Center / Arena Pathway: inspect current/example data, select fields, preview conflicts, explicitly choose Apply where appropriate and approve. Parent approval is required. Repeat a snapshot to check stable-UID deduplication.
8. Push to a provider: Create new profile, then try Create again (blocked). Use a different fresh provider example for Link existing, then Update selected fields. Review before/after and keep/replace choices. Nothing leaves the browser.
9. Undo the latest transfer. Make another local change before Undo to verify the fail-closed stale-state rule. Inspect the clear simulation receipt/status labels.
10. Switch roles; verify data stays in its own role. Reset guided setup, then the original Reset this role control. The approved landing remains unchanged.

No real personal information, documents or credentials should be used in this fictional review. A public forwarded port would expose the fictional application; private forwarding is preferred.

## Checks

```sh
npm --prefix playrcmd test
npm test
# Existing real-browser acceptance (run only in a supported Playwright browser environment):
PLAYRCMD_QA_BASE=http://127.0.0.1:4310 python playrcmd/qa/onboarding-browser.py
npm --prefix playrcmd run test:roles:browser
```

A supplemental nonvisual DOM-wiring check uses jsdom outside the product dependencies:

```sh
npm install --prefix /tmp/playrcmd-dom --ignore-scripts --no-audit --no-fund jsdom
PLAYRCMD_JSDOM_MODULE=/tmp/playrcmd-dom/node_modules/jsdom/lib/api.js node playrcmd/qa/onboarding-dom.mjs
```

That check uses a DOM implementation and dialog stubs; it is NOT a browser screenshot, layout, native dialog or accessibility acceptance test. No production dependency is added.

Browser runner output defaults to /tmp/playrcmd-guided-browser; set PLAYRCMD_QA_ARTIFACTS to retain real screenshots/results. Test desktop, iPad portrait/landscape and phone, keyboard/touch, overflow and console errors. Current environment browser initialization is blocked; no visual acceptance or screenshots are claimed.
