# Arena Pathway — Nov 12 QA Candidate A

Baseline: `codex/final-ux-conformance` at `6f7f5493798665c28d2b566215476906c63ebecb` (read-only verified). Soccer Center 18 is the behavior reference, not a target for edits. This is an **unapplied Codespaces source package**, because GitHub create-branch returned 403 and no Codespaces terminal is exposed to this chat.

## What this candidate implements

1. **S2 schedule parity — first functional slice:** Adds categorized event entry, optional end date, recurring weekly practices (selectable weekdays and repeat-until), occurrence expansion and distinct ICS UIDs per occurrence. Existing local storage is preserved and new fields are additive. The existing visual calendar and SIEM demonstration are not rewritten.
2. **M2/M3 editorial-source inventory:** Adds the morning's 40 news/development source names in a candidate registry. These are **not verified URLs, feeds, integrations or downloaded videos** and must not be displayed as live/fresh content until reviewed. No claim of current free availability.
3. **Guardrails:** No Soccer Center files altered, no credentials, no app-level role/PII redesign, no LinkedIn/recruiting flow changes, no publishing.

## Codespaces steps

Open the AP Codespace. Use `git status --short` and `git branch --show-current` before applying. This script assumes the checked-out source is exactly the verified v0.7 branch. Create a separate branch locally (`git switch -c codex/ap-qa-20261112-schedule`) after ensuring you are on the correct base. Extract this archive outside the repository. From the AP repository root:

```bash
python /path/to/extracted/ap_qa_nov12/scripts/apply-ap-qa.py --dry-run
python /path/to/extracted/ap_qa_nov12/scripts/apply-ap-qa.py
node --test tests/recurring-plans.test.mjs
npm run check
```

Then browser-test create/edit/remove events, repeating Monday/Wednesday practice, month boundaries, iCal import/export parity and existing local saved records. Run all existing browser QA scripts. Review `git diff` and commit to the isolated branch if tests pass. **Do not merge, push production deployment, or publish without authorization.**

## Further edits — explicit punch list

P0: Soccer Center 18 profile parity, sport/club dropdown or custom club, linked parent/athlete identities, recurring event editing and ICS import preview; P1: athlete-owned media storage/upload and stats linked to event IDs; P1: separate family upload vs sport-specific editorial My Feed vs approved instructional videos; P2: SIEM category filters (practice/game/meet/tournament/camp/travel), demo source messages and clearly simulated Slack replies, parent network parity; P3: recruiting generation from athlete records, sharing/revocation and NCAA/high-school compliance; P4: LockedIn visible as coming soon.

## Known limits of this candidate

The new plan recurrence currently operates in browser-local planning and ICS export, **not** on authenticated multi-device family records or live source connectors. External Slack reply integration is not implemented. Sport source publication/URLs remain a review queue. No test run against the entire actual AP repository was possible in this chat; only the standalone tests were run locally.
