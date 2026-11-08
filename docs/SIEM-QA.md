# SIEM Parent Command Center v1 QA

## Baseline and preservation

PR #2 was verified open/unmerged at `f4c2517`; SIEM is isolated on
`codex/siem-parent-command-center-v1`. The approved AP original and its byte-checked
derivatives, four sports, directories and Build My Pathway remain intact. Data
engine PR #3 is inspected/documented, not merged. No catalog/source asset edits.

## Automated verification

Run `npm run check`, `npm run check:brand`, `git diff --check`.

The suite contains the existing 20 regression tests and 15 new SIEM tests (35
in total). Coverage includes:

- Family / multiple-child read/write isolation, role and sport boundaries.
- Idempotency, cross-source duplicate candidates and evidence retention.
- Athlete and parent overlaps, touching boundaries, cancellation and history.
- Deadline priority, missing requirements and opportunity classification.
- Acknowledgment, resolution, reopening, future reminders, fresh-version alerts.
- Failed batch atomicity, stale/invalid timestamps and unconnected providers.
- Recruiting / Locked In consent and sensitive-field omission; consent revocation.
- Safe source URLs, unverified assertions and unsupported source rejection.
- Bounded UTC ICS, invalid dates, recurrence/timezone rejection and file-size limits.
- Wellness defaults, supplied free time, travel/pickup buffers, preferences,
  parent booking states and stable weekly occurrence identities.
- SIEM HTTP route/assets, CSP, no personal-data server endpoint.
- Existing pathways, profile saves, media defaults, directories, data reconciliation,
  logo hashes and structural responsive/accessibility checks.

## Browser verification limit

The managed environment reports `SITES_MANAGED_LINUX_CONTAINER=1`. Available
browser tools were searched; `cua_repl.js` is unavailable. The Sites workflow
explicitly prohibits starting a preview or substituting another browser path in
this situation. No browser session, visual screenshot, mobile or interactive
end-to-end validation was performed. HTTP and domain tests do not establish visual
quality or interactive usability. Manual desktop/mobile QA remains outstanding.

## Review checklist

1. Run `npm start`; open `/siem` locally. Verify prototype notice and AP mark.
2. In Build My Pathway add two parent-managed athletes in different sports.
   Return to SIEM, add a parent and review participant/sport filters.
3. Add overlapping timed commitments, a deadline and an incomplete requirement.
   Acknowledge/resolve/reopen alerts and set a local reminder.
4. Reuse a reference with a new time/location or canceled status. Review full
   event version history; a new revision must require attention again.
5. Import the same UTC ICS twice, then a duplicate from another source. Reject
   RRULE/TZID/all-day imports without changing the prior state.
6. Add a parent class as available, save interest, then explicitly confirm a
   booking. Confirm that only confirmed commitments reserve calendar time.
7. Check wellness suggestions with a real supplied window, travel/pickup buffers
   and activity preference; toggle off and confirm recommendations disappear.
8. Check every provider remains unconnected or explicitly local/snapshot. Verify
   there are no fabricated updates or external booking/message requests.
9. Revoke optional product status permission; delete events/parents, then reset
   SIEM storage. My Pathway data must remain intact.
10. Review keyboard navigation and 390px / desktop layouts, including header,
    filters, date controls, audit details and long event titles.

## Known v1 limits

No production authentication/backend, external provider sync, background reminders,
verified bookings or provider recurring reservations. Weekly manual recurrence is
bounded to 12 explicit local occurrences. Shortening a repeated series does not
delete previous occurrences automatically; remove them explicitly. No arbitrary
approved-export parser, remote ICS feed fetch, membership management API or travel
routing exists. User-supplied travel/pickup buffers apply conservatively around
all confirmed family commitments. Free windows are supplied, not inferred from
an incomplete empty calendar. Existing all-day My Pathway plans are not copied
or silently interpreted as timed commitments. Opportunity cards are catalog sport
matches, not verified current recruiting opportunities or live data-engine updates.
