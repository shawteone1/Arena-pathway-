# Signature Family v1 — Limitations and production readiness

This work adds one deterministic fictional scenario to the completed SIEM UX v2.1
shell. The existing event contract, core SIEM domain/correlation/permission logic,
original scenarios, layout improvements, discovery engine and datasets are preserved.
Base: `cad4aa70bcc594656a62bfaa8a3081888edee45e`.
Branch: `codex/siem-signature-family-demo-v1`. Route: `/siem/platform?scenario=family`.

## Demonstrated breadth

Three children, four team schedules and two sports share 15 timed commitments in
one Denver demonstration week. PlayMetrics contributes soccer practice/game and
team-announcement records; SportsEngine contributes volleyball practice/tournament
records and a Wednesday change; TeamSnap contributes calendar copies, RSVP,
meetings, school/family calendar entries and communications; Slack contributes
change announcements and an actionable logistics reminder. A fifth, internal
Locked In fixture contributes one explicitly simulated status-only deadline.
It is not another connected commercial provider or product requirement.

There are 22 normalized original source records and 21 displayed canonical
activities. Explicit matching of Alex's PlayMetrics event with its TeamSnap copy
preserves all source evidence and avoids a second calendar entry/change alert.
A linked Slack announcement is evidence/communication, not another change alert.
An adapter-side consolidation function uses the unchanged activity contract;
uncertain child/team/title/time mappings fail rather than silently merge.
Sport filtering derives from team metadata and excludes school/family items
without a team when a single sport is selected. Source filtering includes canonical
activities through their retained secondary evidence; primary attribution never
changes merely because a source filter was selected.

Travel and arrival are fictional parent-plan metadata linked by stable activity
identity, not a new event schema or routing service. Itineraries use Denver dates
correctly across UTC midnight. They do not automatically reserve transport, assign
drivers, infer traffic or prove feasible travel. Review the actual source before
making plans in a real deployment. The demo explicitly calls for confirmation.

## Isolation and source honesty

Every participant, club, team, venue and message is fictional. No real birthdays,
addresses, rosters, accounts, credentials or private child information are used.
Sources have fixture timestamps; all real platforms are unconnected. Slack uses a
five-minute fictional freshness threshold to demonstrate a stale snapshot without
claiming a provider failure. Source identity, original timestamps, freshness,
child/team and source evidence remain inspectable. Refresh only redraws the view.

All fixtures/actions/approvals remain in page memory; reset restores them. Existing
browser-local SIEM and My Pathway records are untouched. The college/coach/parent
scenarios remain separate. Loaded fixture code can be inspected, so role guards
and shared-screen privacy are demo controls, not production security boundaries.

RSVP, logistics and status handoff previews require a visible explicit approval
checkbox before a simulation can resolve the corresponding local action. No API
request, sending, booking, form submission or provider state update occurs. Resolve
locally also affects only the SIEM demo queue. Do not interpret local resolution as
completion of a real form, RSVP or transportation arrangement.

Locked In supplies minimal fictional status/action metadata with stated fictional
parent permission. No document is uploaded/opened, no identity/age is verified,
and no sensitive product record or payment card is copied. Recruiting remains
optional; no profile is needed to demonstrate scheduling.

## Before a production pilot

The unchanged v2 readiness assessment still applies: verified parental identity,
server-enforced tenant/person/role/team permissions, secure persistence and audit,
consent records, least-privilege provider authorization, secret storage, official
API/export/feed support, retention/deletion, retry/reconciliation and monitoring.
Real source matching needs stable provider references and human review for ambiguity.
External actions need provider-specific capability checks, explicit approval and
authorized server execution with auditable outcomes. None is implemented here.

Browser tests emulate screen sizes, not physical devices; independent accessibility,
privacy/security and real-user usability reviews remain outstanding. This is a
partner presentation artifact, not a claim of production integrations or customer
endorsement. No push, merge, publication, deployment or Soccer Center production
changes were performed. No Sports Discovery, registry or ingestion changes.
