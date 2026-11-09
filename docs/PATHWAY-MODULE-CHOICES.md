# Choose Your Own Adventure workspace correction

Branch: `codex/pathway-module-choice`, based on the completed Colorado Data Engine commit `4272581`. This is a correction to Build My Pathway and the existing athlete/parent workspace. It does not add a portal or change the approved v0.7 artwork, homepage, Sports menu or Colorado data engine.

## User experience

Build My Pathway retains sport, role/guardian setting, location, focus and interests. Six independent selections configure the workspace:

- My Teams & Saved, including club/team discovery and tryouts.
- Schedules, including personal plans, saved dated opportunities and calendar export.
- Camps / Development, including its own saved camps and discovery.
- Community, including its own saved community resources and discovery.
- Recruiting, including the existing college research/checklist/notes tools.
- Media, off by default, showing only the selected publisher/source groups.

No module is preselected for a new profile. Choosing an interest or focus does not enable a module on a newly configured profile. The selection order becomes the initial workspace order. Empty selections are allowed; the workspace offers its customizer instead of inventing a next step.

Only selected modules have active sections and navigation links. Recruiting is not mounted for a profile that has not chosen it. Saving an organization adds its unchanged record ID to that profile's saved collection; it does not change the role, focus, interests, module list or recruiting plan. Saved club cards retain the organization name, city, source and expandable associated team/division/season information. They are not converted into college or recruiting records. Saving while Teams is off still retains the record for later use.

Customize my workspace lets each profile add/remove modules immediately and reorder them with labeled Up/Down buttons. Keyboard focus is retained after updates, controls have touch-sized targets, and navigation and section order follow the saved array. Edit pathway continues to change identity preferences, interests and individual media sources. Adding a family profile from a parent-managed profile starts with a parent/guardian setting but its own empty module choices and saved data.

Turning a module off does not delete saved records, personal calendar entries, saved recruiting checklists/notes or media preferences. Enabling it again restores those saved values. Forms with explicit Save buttons still require submission to save new edits. The Media module can be enabled from the customizer before sources are chosen; it then offers a source-selection link and displays no unselected content.

## Persistence and migration

The existing `arenaPathway.v2` key and version-2 family state remain supported. Each profile gains `moduleVersion: 1`, an ordered `modules` array, and `mediaSourcePreferences`. The existing `saved`, `plans`, `recruiting`, `role`, `guardian`, `sport`, `region`, `goal` and `interests` fields are preserved. Family members do not share module arrays, saved IDs, notes or media choices.

`modulesFor` validates/deduplicates module IDs without sorting them. An explicit array, including `[]`, is authoritative. `setModules` updates only the module list and active media flags, preserving the profile's saved records, plans and recruiting data. `mediaSourcePreferences` retains selected sources while media is disabled; `mediaSources` remains empty while disabled for compatibility with the existing off-by-default behavior.

Old profiles without a module array derive a starting selection from previously expressed focus/interests, existing personal plans and explicit media opt-in. Tryouts map into Teams. Saved clubs, college record IDs, recruiting notes and a fixed section order never infer recruiting. A prior explicit recruiting focus/interest migrates as recruiting opt-in. Migration is in memory until the next successful save, so a read does not overwrite the old storage. An explicit new module array is used on later reloads. Storage failures leave the prior choices/data intact and show the existing save error.

Parent control remains a setting on the local browser, not verified guardian authentication. There is no new account service or cross-device sync. Source choices erased by an older application version cannot be reconstructed; this correction preserves choices from this version onward.

## Files

- `public/state.js`: module definitions, ordered choices, compatibility migration and retained media preferences.
- `public/app.js`: independent selection, conditional section mounting, customization/reordering, scoped optional form handlers, saved organization details and per-profile behavior.
- `src/views.mjs`: module choices in onboarding, workspace customizer, empty initial navigation and inert templates for the optional sections.
- `public/style.css`: additive branded, responsive module-choice/reorder controls.
- `test/pathway.test.mjs`: nine state/structure regression groups.
- `scripts/qa-pathway.py`: ten real Chromium interaction groups with screenshots and calendar export.
- `test/design.test.mjs`: keeps catalog/query/original-application-test hashes intact while allowing the intentionally corrected workspace/state behavior to be tested by the original and new behavioral tests.
- `package.json`, `.gitignore`, this document and the engine runbook: test command and QA documentation.

## Validation

`npm run check` passes **56/56 Node test groups on Node.js 22.23.4**: the existing 47 application/branding/engine groups plus nine new pathway groups. Original application tests are unchanged. Catalog, source registry, reviewed overlay, expectations, migrations, source adapters, provenance and approved brand assets are unchanged by this correction.

`python scripts/qa-pathway.py` passes **10/10 Chromium interaction groups**:

1. Independent onboarding order, preserved sport/role/location/interests, no recruiting from a focus alone.
2. Saving a real club preserves organization ID/source/associated teams and leaves recruiting absent.
3. Disabled sections/navigation disappear; saved records/plans/recruiting/media preferences survive reload and re-enabling.
4. Keyboard reorder, matching navigation/section order, reload persistence and remove/re-add behavior.
5. Family profile isolation, profile switching and a new parent-controlled family profile with independent choices.
6. Only selected media sources appear; disabling and editing preserves choices.
7. Optional calendar, ICS download, recruiting checklist and notes still work after mounting/remounting.
8. Legacy saved clubs and notes do not enable recruiting.
9. A simulated storage failure rolls back the visible selection and retains saved records.
10. Phone 390×844, tablet 768×1024 and desktop 1280×900 layout checks; real Chromium touch events, keyboard menu dismissal, touch-target sizes, horizontal overflow and screenshots.

QA uses isolated synthetic family profiles and a local server. No existing user browser storage, external account, preview or production service is changed. JavaScript page errors fail the suite. Screenshots and the test calendar are written under ignored `var/pathway-qa/` (override with `ARENA_QA_ARTIFACTS`). Some element-only Chromium captures can include an offscreen fixed skip-link artifact; viewport screenshots and computed live coordinates confirm that the link remains offscreen until focused.

Reproduce the Node checks:

```bash
node --version
npm ci
npm run check
```

For browser checks, use Python Playwright (tested version 1.62.0) and Chromium. Install QA dependencies in a user-owned virtual environment if needed:

```bash
python -m venv .venv-qa
.venv-qa/bin/pip install playwright==1.62.0
.venv-qa/bin/python -m playwright install chromium
.venv-qa/bin/python scripts/qa-pathway.py
```

Alternatively, with Playwright available in the current Python environment, run `npm run test:workspace:browser`. `CHROMIUM_PATH` can select a system browser. Containers lacking a Chromium sandbox may explicitly set `ARENA_QA_NO_SANDBOX=1` for the isolated local QA browser. By default the script starts and stops its own local Node server. `ARENA_QA_BASE` can target an already running local development server.

These are Chromium viewport/touch emulations, not physical iPhone/iPad Safari or VoiceOver certification. Native Safari, assistive-technology and cross-device review remain outstanding. Nothing has been merged or deployed.
