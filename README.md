# Arena Pathway

A local-development Node.js application for Colorado athletes and families.
The umbrella homepage uses college stadium photography, a custom letterman A,
and navy, cream, red and gold. One Sports menu connects Lacrosse, Volleyball,
Basketball, Swimming and Build Your Own.

## Run locally

Node.js 22+ is required. There are no runtime or development dependencies to install.

```sh
npm run dev
```

Open http://localhost:3000. Set `PORT=3001` to change the port. `npm start`
runs without watch mode. The server binds to `0.0.0.0`.

## Verify

```sh
npm run check
npm run validate:data
```

The checks cover syntax, HTTP routes, internal navigation, search and type/location
filters, HTML escaping, method handling, provenance, source reconciliation,
duplicates, orphan records, freshness, profile migration, per-profile save isolation,
scheduling and calendar export. The responsive-code assertions are structural;
they do not establish browser or mobile usability. See [QA notes](docs/QA.md).

## Routes

- `/`: stadium-led umbrella homepage.
- `/sports/{sport}`: each sport’s landing page.
- `/sports/{sport}/teams`: first-party searchable clubs, named teams, swim teams,
  schools, leagues and divisions. Filters: `q`, `kind`, `city`.
- `/sports/{sport}/tryouts`, `/camps`, `/community`: separate sport sections.
- `/build`: athlete / parent pathway preferences; `?sport=swimming` preselects a
  sport; `?new=1` starts a separate family profile.
- `/my-pathway`: profiles, recommendations, saved opportunities, consolidated
  local schedule, calendar download, college shortlist / recruiting planner,
  and user-selected media links.
- `/data`: provenance, coverage boundaries, per-source import reconciliation
  and review dates.
- `/credits`: stadium photograph attribution and license.
- `/api/catalog`: public catalog only. No personal profile endpoint exists.
- `/api/coverage`: validation and reconciliation report.
- `/health`: health and development version.

## Architecture

- `server.mjs`: Node HTTP server, strict route matching, allowlisted assets and
  response security headers. Importable `createServer()` supports isolated tests.
- `src/views.mjs`: shared server-rendered layout and sport / pathway pages.
- `src/catalog.mjs`: catalog queries, provenance helpers and integrity validation.
- `data/catalog.json`: versioned Colorado records, sources and independent
  reviewed-subset manifests.
- `public/style.css`, `a.svg`, `stadium.jpg`: responsive branding and local assets.
- `public/app.js`: browser interaction, personal dashboard, safe DOM construction.
- `public/state.js`: profile migration, normalization, local state and ICS export.
- `scripts/validate-data.mjs`: source reconciliation report.
- `test/application.test.mjs`: Node’s built-in test runner; no external services.

The requested Soccer Center concepts are represented by a shared catalog,
searchable sport directories, one athlete/family workspace, saved opportunities,
schedules, recruiting planning, and opt-in sources. Soccer Center implementation
source was not available in this checkout or the owner’s public GitHub repositories;
this is not a claim of source-code parity.

## Profile and schedule scope

Profiles, saved records, personal plans and research notes live in this browser’s
`arenaPathway.v2` local-storage entry. Legacy `arenaPathway` preferences migrate
with media disabled. Profiles can be edited, selected or deleted independently.
Parent mode supports family-managed athlete profiles and requires a guardian
acknowledgment. It is a local preference, **not verified parental identity or an
authorization boundary**. Anyone with access to the browser can access its profiles.

No account backend, cross-device synchronization, live schedule connector,
notifications, registration, recruiting outreach or public athlete profile exists.
Imported dated opportunities and personal plans share a local schedule. Undated
programs remain in Saved. Calendar export uses all-day dates; any published local
time remains in the event description. It does not subscribe to future changes.

Media is off by default, and enabling it requires selecting sources. Selection
adds outbound publisher links, with no automatic feed requests or embedded social
trackers. Turning media off clears its source selections.

## Data scope

See [data maintenance](docs/DATA.md). Current coverage is partial statewide:
32 organizations (including 24 swim teams), 68 named squads / college programs,
3 schools, 3 leagues, 9 divisions, 12 opportunity records and 4 community records.
Reviewed subset totals are not statewide denominators. Unknown seasons, source
conflicts, excluded ambiguous records and inaccessible source imports are explicit.
Empty lacrosse and swimming camp pages are honest empty states, not fabricated
programs. Recheck source availability and dates before registering or traveling.

## Git and publication

Work is on `codex/development-setup`. `main` is preserved at the original working
baseline. Review and commit this branch as appropriate. Do not merge, deploy,
publish, or configure hosting without the owner’s approval. Local start and test
commands perform no publication, external writes, or repository pushes.
