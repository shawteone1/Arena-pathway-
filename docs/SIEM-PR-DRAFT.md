# Arena Pathway SIEM v1 — Parent Command Center and optional wellness calendar

Adds `/siem` so parents can review family commitments, source evidence, changes
and prioritized actions in one local dashboard. Parents are schedule participants;
optional wellness classes distinguish availability, interest and confirmed local
commitments and suggest fits against supplied free windows and travel/pickup buffers.

Based on PR #2 head `f4c251737696ed59bd44cc7abe62e97fc79cdf68`, which was open and
unmerged when inspected. Preserves v0.7 approved AP branding, all four sports,
directories and Build My Pathway. Work is separate from data-engine PR #3 and does
not alter its catalog or store. See integration coordination notes for future merge
conflicts and the read-only sport-scoped projection contract.

Includes normalized versioned events, deterministic correlation, action state and
local reminders, bounded atomic UTC ICS import, weekly local occurrences, provider
contracts, source status, minimal permissioned Recruiting/Locked In status events,
and documentation of integration support and security gaps.

Validation: `npm run check` (35 automated tests plus syntax/catalog validation),
`npm run check:brand`, and `git diff --check`. Browser/mobile QA is outstanding:
managed browser tooling required by Sites is unavailable.

This is explicitly a browser-local prototype. Authentication, secure persistence,
server-enforced tenant isolation and credential storage are production blockers.
Unsupported providers and gyms remain unconnected; no external actions are sent.
Existing all-day My Pathway personal plans remain in their original workspace.

Review documents:
- `docs/SIEM-INTEGRATIONS.md` — support matrix and data-engine handoff.
- `docs/SIEM-SECURITY.md` — safeguards and production blockers.
- `docs/SIEM-QA.md` — coverage, limitations and manual review steps.

Draft review only. Do not merge, publish, or deploy to GoDaddy/Airo or any other
hosting target without owner approval.
