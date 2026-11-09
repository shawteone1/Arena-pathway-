# SIEM UX v2 — Activity contract and adapter boundary

Contract version: **2**. Runtime validator: `activityContract` in
`public/siem-platform-model.js`. This is a presentation contract around the existing
SIEM domain; it does not create a second discovery engine or sensitive-record store.

## Activity fields

| Field | Meaning / validation |
| --- | --- |
| `schemaVersion` | Exactly `2`; reject unsupported versions |
| `tenantId` | Family/organization security boundary; resolved by future authenticated server |
| `sourceId`, `sourceIdentity` | Provider/feed and scoped source account/export identity; never credentials |
| `eventId` | Original event/notification reference |
| `organizationId`, `teamId` | Stable organization and optional team IDs |
| `role` | Parent, coach, college-athlete, professional-athlete or recreational-athlete |
| `participantId`, `participantRelationship` | Stable participant association; lightweight, no profile prerequisite |
| `ownerId` | Required for private visibility |
| `title`, `location` | Non-sensitive activity summary and location; avoid raw private communications |
| `start`, `end`, `timezone` | Explicit-offset ISO timestamps, end after start, valid IANA display timezone |
| `eventType` | Game, practice, class, meeting, personal, deadline, communication or opportunity |
| `status` | Scheduled, canceled or completed |
| `originalSourceTimestamp` | Time the source originally reported this version |
| `lastSynchronizedAt` | Actual source synchronization time, or null; never a dashboard redraw time |
| `priority` | 1 high, 2 review, 3 radar |
| `requiredAction` | Null or `{id, label, complete}`; non-sensitive local action metadata |
| `evidence` | `{url, summary}`; HTTPS links only, no credentials or sensitive payload |
| `visibility` | Family, organization or private |
| `permissionScope` | Matching tenant, organization, role and allowlisted `personIds` |
| `relatedEventIds` | Candidate source relationships, resolved only inside permitted data |
| `demo` | True throughout this release; no verified/live assertion |

Stable identity is the tuple `(tenant, organization, role, sourceId, sourceIdentity,
eventId)`. Role/organization scope is part of identity so action state cannot bleed
across roles even when two source exports reuse an event reference. A single
person can have several role-specific organization/team memberships. A selected
role never implies permission to access the other memberships' private data.

The public validator allowlists fields, validates timestamps/scopes and drops
unknown medical/payment/token fields. Free text is not a medical-data scrubber.
Production requires upstream data minimization and server-side permission checks.

## Reuse of existing SIEM components

`projection()` first applies tenant, role, person, organization, team, participant
and private-owner guards, then adapts authorized activities into the existing
`empty`, `upsert` and `detect` functions from `siem-model.js`. Historical fixture
versions pass through existing change tracking. `takeAction()` calls existing
`act()`. Its sole backwards-compatible extension is an optional deterministic
`now` argument; existing callers retain the real-clock default.

The new queue groups duplicate overlap decisions and folds incomplete-requirement
signals into the same event's change/deadline decision. Member alert IDs and source
evidence remain attached; review/resolution updates every grouped member. Duplicate
source records are not deleted. The calendar shows an exact same-participant,
same-title/time pair once; details and the duplicate action retain source identity.
Candidate matching remains deterministic, not proof of shared event identity.

## Future data-engine adapter interface

Do not modify discovery, source registry, ingestion, engine stores or sport datasets
for this workstream. There are no live connectors in this release.

An authorized backend adapter can implement:

```js
const adapter = {
  async read({tenantId, personId, role}) {
    // Resolve authentication and allowed scope on the server, not from these strings.
    return {schemaVersion: 2, asOf: '2030-05-06T14:00:00Z', activities: []};
  }
};
const result = await readAdapter(adapter, context, previousSnapshot);
// result: {ok, snapshot, error}; use snapshot only as a validated atomic unit.
```

`readAdapter` validates up to 1,000 activities and rejects a batch containing any
out-of-scope activity. On error it retains the prior snapshot and returns a generic
message that excludes raw exceptions/credentials. This pure contract is tested but
is not wired to remote services. The current dashboard reads deterministic fixtures
only. Integrating an adapter also requires a server-owned history/action repository
and authorized feed-health projection; the UI panels do not need provider-specific
code or a redesign.

A feed-health projection uses `id`, `name`, `tenantId`, `organizationId`, `role`,
`status`, `lastSynchronizedAt` and `staleAfterMinutes`. Status is `fixture`, `failed`
or `disconnected` in this demo. Missing timestamps are unknown, failures are explicit,
and age thresholds are per feed. View refresh time is separate from source sync time.

For a production adapter, derive scope from the authenticated principal; validate
source ownership, memberships, timestamps, licensing and consent; retain evidence,
cursors and last-known-good snapshots; add retry/backoff and rate limiting; do not
send secrets or raw private product records to the browser. Public discovery rows
must not become confirmed private commitments. Preserve sport and program ownership
when the independently reviewed discovery interface is connected later.

## Fixture and refresh policy

`createScenario` uses a fixed `2030-05-06T14:00:00Z` clock (8 AM Denver). All people,
organizations, team names, updates and notices are fictional. Reload/reset reproduces
the same fixture; actions live in memory and reset with scenario changes. No local
family storage is read/written. Display Mode defaults privacy on; redraw every 60
seconds only while visible, unpaused, outside an open dialog/interactive panel.
Manual refresh is available. Source timestamps never advance on redraw.
