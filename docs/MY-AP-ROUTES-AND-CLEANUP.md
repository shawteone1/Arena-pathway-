# My AP consolidation — routes, navigation and legacy cleanup

Review base: `codex/siem-family-safari-fix` at
`aebb0e8ee4b5e87e77f1eac8c0d2ee0abdd57c19`.
Branch: `codex/siem-my-ap-consolidation`.
The history retains the Safari fix, Signature Family, UX v2.1, UX v2 and Integrated
Release Candidate work. This is a navigation/stabilization review, not a new app.

## One primary experience

The homepage SIEM link, SIEM demonstration links, offerings entry and existing
Soccer Center club-use-case preview now open **/my-ap**, defaulting to Rivera.
The same existing SIEM shell and panels support four familiar primary sections:

- **My Day:** upcoming activities, changes, deadlines and prioritized actions.
- **Calendar:** the complete scoped family week, including deadlines (17 entries
  in the unfiltered Rivera fixture), rather than the four-item home preview.
- **Messages:** four relevant communications with source attribution and related
  activity evidence. Privacy redacts message content.
- **My Family:** three lightweight child associations and four team memberships,
  plus an explicit link to existing local family setup/preferences.

Everyday, Command Center and Display are optional presentation choices in this
same shell. They do not create a second dashboard or copy data. Settings contains
source connections and optional role demonstrations. Source freshness remains
visible in the home summary. Section changes preserve active scope and demo action
state; scenario/reset/reload retains the existing page-memory reset semantics.

The existing Soccer Center Parent Portal Design reference was reviewed read-only
for its family-centered primary navigation and separation of family/calendar
content from advanced operations. No source, private records or visual assets
were imported, and Soccer Center production was not modified. Arena Pathway's
approved letterman presentation and logo remain the actual UI design system.

## Route map

| Path | Behavior |
| --- | --- |
| `/my-ap` | Canonical My AP shell; Rivera / My Day / Everyday by default |
| `/my-ap?section=calendar` | Complete scoped family calendar |
| `/my-ap?section=messages` | Relevant communications |
| `/my-ap?section=family` | Lightweight family relationships and local setup link |
| `/my-ap?section=settings` | Secondary connection/preferences panels |
| `/siem/platform?scenario=family&mode=everyday` | Preserved HTTP 200 alias using exactly the same shell; real browser render tested |
| `/siem` | HTTP 302 to `/my-ap?scenario=family&mode=everyday` |
| `/demos/parent` | HTTP 302 to current Rivera / Everyday, not the superseded sample parent landing page |
| `/demos/coach` | HTTP 302 to optional coach role fixture in My AP / Command |
| `/demos/college` | HTTP 302 to optional college role fixture in My AP / Everyday |
| `/siem/setup` | Preserved browser-local family setup and independent SIEM tools |
| Unknown demo paths | Existing safe 404; no arbitrary redirect destination |

Redirects are temporary 302 responses for review safety. `/siem` preserves only
known scenario/mode/section query values. No user-supplied external destination is
accepted. The exact Safari diagnostic route is intentionally NOT redirected.

## Retired versus preserved

| Component | Decision |
| --- | --- |
| Older standalone Parent/Coach/College landing pages | Retired from HTTP routing and all active primary marketing navigation |
| `demoPage()` in release views | Archived/unserved export retained for source compatibility; server no longer imports/calls it |
| `release-demo.js` and `release-demo-model.js` | Preserved inactive compatibility artifacts and model tests; not loaded by current entry/legacy routes |
| Original platform parent/coach/college fixtures | Retained as explicitly optional Settings role demos; useful isolation tests and independent capabilities remain |
| Rivera family fixtures | Unchanged and now primary; no duplication into user storage |
| Original local SIEM setup and storage | Moved to `/siem/setup`, same storage keys and controller; no deletion/migration |
| Original local calendar/action/ICS/wellness/product preferences | Preserved behind a clearly labeled Local scheduling and action tools disclosure |
| My Pathway / Build My Pathway | Independent and unchanged in functionality; navigation links to SIEM now point to My AP |
| Sports Discovery engine, ingestion, datasets and source registry | No changes; protected by byte comparisons |
| Runtime npm dependencies | Unchanged; no new package or service added |

There is no destructive data cleanup. Previously bookmarked demo routes lead to
working content in the new shell. Local tools are deliberately not marketed as a
competing demonstration dashboard. Local records remain separate from fixture data.

## Test changes explained

Existing tests were updated for the explicitly authorized redirects, primary
section/sidebar target and preserved setup path. The local tools disclosure must
be opened before editing and again after reload; persistence is still checked.
Optional role switching now opens Settings. Prior snapshot checks were narrowed
only for requested shared-navigation link changes; core/data/brand byte comparisons
remain. New tests verify redirect safety, no old renderer at legacy routes, main
homepage → My AP rendering, section continuity, family setup persistence and the
unchanged exact Safari route in actual WebKit and Chromium.
