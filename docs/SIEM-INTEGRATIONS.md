# SIEM v1 integration support and data coordination

Baseline inspected 2026-11-08: PR #2 open, unmerged; head
`f4c251737696ed59bd44cc7abe62e97fc79cdf68`. This includes the approved original
AP logo and derivatives. The older handoff commit `ddf23ac` is not the current
review head. SIEM branch: `codex/siem-parent-command-center-v1`. No merge or deployment.

## Support matrix

| Provider / interface | Implemented behavior | Connection / limits |
| --- | --- | --- |
| Arena Pathway | Read-only `/api/catalog` opportunity cards filtered by participant sport, with source links/review dates | Reviewed snapshot, not live engine synchronization; no athlete record copy |
| Manual family events | Local normalized events, stable-reference updates, history, cancellation, requirements | Browser only, unverified user assertions |
| ICS file import | Atomic import of 1–500 VEVENTs, UID identity, UTC start/end, cancellation, URL and evidence | Snapshot only; 500 KB max; recurring, all-day, floating and TZID dates rejected explicitly |
| TeamSnap | Adapter contract / status registry | Unconnected; approved interface and authorization needed |
| PlayMetrics | Adapter contract / status registry | Unconnected; approved interface and authorization needed |
| SportsEngine | Adapter contract / status registry | Unconnected; approved interface and authorization needed |
| Teamworks | Adapter contract / status registry | Unconnected; approved interface and authorization needed |
| Google Calendar | Adapter contract / status registry | Unconnected; no OAuth credentials or token handling |
| Outlook | Adapter contract / status registry | Unconnected; no OAuth credentials or token handling |
| Authorized email notifications | Adapter contract / communications summary | Unconnected; no inbox reading, parsing or email sending |
| Gym / wellness | Provider-neutral contract for official API, ICS, approved export and manual | Gym systems unconnected; manual entry and generic bounded ICS file import work locally |
| Recruiting | Permission-gated `productStatus` publisher contract | No product connection; allowlisted minimal statuses only |
| Locked In | Same minimal-status publisher contract | No document, identity, compliance record or payment copying |

No provider API access was supplied or verified. A public website or calendar URL
is not evidence of an authorized API integration. There are no network requests
from SIEM to third-party providers. Links are evidence/navigation only. No scraping,
OAuth simulation, background sync, automated booking, messaging or registration.

## Adapter / synchronization contract

`public/siem-model.js` defines normalization, `upsert`, `synchronize`, `syncResult`,
`stale`, `parseICS` and `productStatus`. An adapter must produce bounded batches of:

- Family ID supplied by trusted context; participant ID, participant type and sport
  resolved from family identity. `athleteId` / `athletes` remain internal compatibility
  names for participants; a parent uses `type: parent`, sport `personal`.
- Source provider, stable original reference, organization and team, event type,
  start/end ISO timestamps, location, cancellation status, source URL and evidence.
- Optional requirements: stable ID, non-sensitive label and completion boolean.
- Booking state: `available`, `interest`, `confirmed`. Confirmation in this prototype
  is explicitly the parent's assertion, never evidence of a provider reservation.
- Personal activity label only; no health, credential, medical or payment fields.

Identity is `(family, participant, provider, original reference)`. A semantically
unchanged import does not increment its version. Changes preserve previous
normalized versions; derived alerts include event versions so an old acknowledgment
does not hide a new change. Duplicate candidates retain both source records and
links; they are never silently merged. Cross-source exact title/time matches are
candidates, not proven identity matches.

`synchronize` returns `{state, provider, imported}`. It stages a complete batch and
returns the original state on failure. Unsupported providers return `unconnected`;
failures retain previous success time. Missing or invalid success timestamps and
operations older than 24 hours are stale. UI connection times describe local
operations and are not persisted provider sync claims. All normalized inputs remain
unverified in this prototype. A future verified connector needs a server-owned
trust assertion rather than a browser boolean.

Future gym adapters must declare interface mode, supported booking semantics,
provider timezone and recurrence capabilities, consent scope, timestamp/cursor and
safe error codes. Export files must use an approved mapped schema; there is no
arbitrary CSV or JSON import in v1. Remote ICS fetching needs SSRF defenses and
secret-URL handling on a backend; neither is implemented here.

## Coordination with data build PR #3

Inspected PR #3 (`codex/colorado-data-engine-v1-review`) at head
`c13de9052f2a88e6c7bd30f015d06e9942067951`. It is a separate review; no merge of it
is implied. SIEM changes no files under `data/`, `engine/`, catalog logic or source
assets. It consumes the current catalog JSON shape only. Sports remain explicit
on every participant/event, and opportunity matching never combines sport data.

After the data build is reviewed, its owner can expose approved opportunities
through the existing catalog read contract or a versioned read-only projection.
Keep engine source IDs, record IDs, review evidence and sport scope. Never infer
a private athlete's registration or confirmed attendance from an opportunity row.
Do not copy the engine SQLite store into SIEM. Reconcile shared `server.mjs`,
`src/views.mjs`, `public/style.css` and `package.json` changes when combining PRs;
run both branches' tests. No external coordination messages were sent.

Existing My Pathway profiles remain authoritative and are read as parent-managed
athlete identities. SIEM does not copy recruiting notes, saved records or existing
all-day personal plans. Those plans remain in My Pathway; users must explicitly
enter/import timed commitments into SIEM v1. This is a visible integration gap,
not a claim that the current calendar includes every existing personal record.
