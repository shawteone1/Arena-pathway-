# SIEM UX v2 — Review and production-readiness assessment

## Baseline and scope

Original reviewed branch: `codex/integrated-release-candidate-v1`.
Verified remote head and local history: `50ce75d58074485054e65e92a3b5413591cf1712`.
Local implementation branch: `codex/siem-platform-ux-v2`.
History includes integrated demonstrations, SIEM workspace, approved charter and
portable governance checks. No push, merge, deployment or Soccer Center changes.

No files in discovery engine, datasets, source registry or ingestion are changed.
An automated byte comparison against the exact base protects these boundaries
and the approved charter/logo assets. Shared server edits add only one SIEM route
and allowlisted assets. Existing `/siem` and `/demos/*` retain their behavior and
now offer links to the v2 demo. Existing data builds remain independent.

## User outcome and design decisions

- Everyday View makes next commitments, changes and decisions visible together;
  a source-freshness summary is visible before the schedule. No setup/profile needed.
- Command Center adds role, multiple organization/team, participant, source and
  priority filters, the complete activity list, actions, communications and source
  health. Activity details disclose evidence, timestamps, history and permitted
  related activities on demand. Filters run before correlation.
- Display Mode uses larger type, privacy on by default, a clear fixed demo date,
  view-refresh time, source freshness and pausable redraws. It is a responsive
  screen layout, not an operating-system kiosk or always-on background service.
- Parent, coach and college-athlete demonstrations reuse one UI and SIEM domain
  projection. The college scenario also supports a separate coaching membership.
  Professional/recreational roles are supported by the contract, not demoed as
  additional products. Recruiting and Locked In remain independent pillars.
- Actions are grouped by the decision needed, not raw signal volume. Resolving
  a demo alert never sends messages, changes registrations or books activities.

The conceptual references were priority queues (Splunk), adaptable views (QRadar),
correlation (Operations Bridge) and feed health (Wazuh). All components, styling
and assets here are original Arena Pathway work using the existing approved
letterman logo/palette. No proprietary screens, code or visual assets were copied.

## Security and privacy limits

This remains a demo, not production authentication or authorization. Browser guards
exercise intended role/org boundaries and protect normal UI behavior; fixture code
and contexts can be inspected/modified by a browser user. No real private athlete
information was imported. Shared-screen privacy removes details from the displayed
DOM and closes/clears the drill-down, but it is not encryption, access revocation,
login or a security boundary against inspection of loaded JavaScript/memory.

Production blockers:

1. Verified identity, parental authority, tenant membership and server-enforced
   per-record/role/team/owner permission checks on every request.
2. Durable, tenant-isolated event/history/action storage, protected audit trail,
   conflict handling, retention and deletion policies. Demo actions reset on reload.
3. Official provider authorization, secure token vault, least-privilege scopes,
   revoke/disconnect lifecycle, supported API/export/feed contracts and consent.
4. Trusted source timestamps, timezone/recurrence validation, reconciliation,
   delivery guarantees, retry/backoff and provider-specific health monitoring.
5. Data-minimization controls, independent accessibility/privacy/security reviews,
   pilot usability work with families/coaches, and production monitoring.

Teamworks, TeamSnap, PlayMetrics, Gmail, Outlook and all other external providers
are not connected. Fixture health includes labeled current/stale/failed states;
these are not observed real-provider reliability. No scraping, inbox access,
credentials, external actions, private document records or payment data are used.

## Known functional limits

The UX v2 route demonstrates fixtures only. The existing live-in-browser local
workspace is preserved at `/siem`; it is not silently imported into the demo.
The fixed clock is intentionally distinct from the actual view-refresh timestamp.
No backend scheduler, real notifications, external sync, calendar subscriptions,
remote action submission, month-grid editing, drag/drop or offline kiosk exists.
Current exact-title/time duplicate matching is deliberately conservative. Suspicious
matches remain candidates; the original records and evidence are kept.

A person must choose one active role at a time; this prevents private cross-role
aggregation. Multiple organizations/teams are selectable within authorized active
memberships. Display privacy hides selectors containing personal/team/org details.
It can be turned off explicitly on the screen and is re-enabled when entering
Display Mode. No production preference persistence or authenticated kiosk policy.

## Charter acceptance review

Problem solved: scattered schedules/signals become three clear questions.
Friction removed: no mandatory recruiting profile, one shared UI, in-place details,
role/org scope before correlation, and locally reviewable actions.
New complexity: three mode choices and an explicit role selector; defaults stay
simple and advanced filters appear in Command Center only.
Next action: review a prioritized item, inspect evidence, mark reviewed or resolve
locally. Demo confirmations state that no external action occurred.
Integrations: fixture contract only; no live connection promises.
Accuracy: synthetic data, source age and partial production capabilities labeled.
Mobile/tablet: automated browser matrix and keyboard/dialog checks recorded in QA.
Dependencies: no new commercial product or runtime npm package is required by UX v2.
Unresolved: production blockers above, real-device usability and assistive technology
review, authenticated integration adapters and a reviewed joint release with discovery.
