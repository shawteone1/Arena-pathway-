# Development verification

## Automated checks

Run `npm run check` with Node 22+. Eight test groups cover:

- Every homepage, builder, workspace and sport section route; every internal
  navigation / asset link; strict invalid-route 404s and HEAD / POST behavior.
- Search, type and city filters, HTML injection escaping, and public-only API data.
- All reviewed import manifests, unique records/aliases/team identities, parent
  relationships, source references and ambiguous scheduling-label exclusion.
- Corrupt state recovery and legacy preferences migrating with media off.
- Independent saved records, schedule entries and recruiting state by profile.
- Calendar date boundaries, newline escaping and UTF-8 line folding.
- Source review freshness and partial statewide coverage.
- Structural mobile breakpoints, focus styles, reduced motion and opt-in defaults.

The final structural check does not replace visual or interactive browser tests.

## Browser QA blocker in this session

The attached cloud environment reports desktop enabled with state `unknown`,
but the tool catalog exposes no `cua_repl.js` / desktop JavaScript tool. Per the
Sites managed-preview instructions, no alternate browser-control process or
preview server was started. The preexisting bootstrap server was stopped after
verification. HTTP tests create and close their own ephemeral local server.
Mobile visual layout, DOM interactions and accessibility have not been verified
in a real browser in this session.

## Browser acceptance checks still required

When the supported browser tool is available, run `sites-preview start` against
this checkout and use the exact returned URL. Test widths 320, 375, 390, 768 and
1440 pixels, plus 200% text zoom. At each width, verify:

1. No horizontal page overflow; stadium photo and letterman A remain legible;
   text contrast, heading hierarchy and the four sport tiles read clearly.
2. The single Sports menu has exactly five options. Keyboard focus, Escape,
   outside-click close, touch targets and each sport’s five tab links work.
3. Directory keyword / city / type filtering and empty results work by keyboard
   and touch; provenance details and source links remain accessible.
4. Build a new athlete profile. Media starts off. Turning it on without selecting
   a source prevents save; choosing one persists only the selected source.
   Turning it off clears selection. Reload preserves preferences.
5. Parent mode requires guardian acknowledgment. Add a second family profile,
   switch profiles, edit goals, save opportunities and ensure records stay
   separate. Delete a profile and confirm its notes/plans disappear.
6. Save one dated and one undated opportunity. Only the dated record appears
   automatically in Schedule. Add/remove a personal plan and import the exported
   ICS into a calendar app; confirm multi-day exclusive end handling.
7. Save collegiate programs, checklist selections and notes. Reload and verify
   the correct family profile’s shortlist / research remains.
8. Test blocked local storage and invalid stored JSON, and a failed catalog
   request. Show a useful failure and never falsely report a successful save.
9. Verify no third-party network requests occur on page load or enabling media.
   Only following a selected outbound link should visit a publisher.

Use real browser console/network checks and screenshots; do not describe these
acceptance checks as passed until they have run.
