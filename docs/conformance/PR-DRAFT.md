# Finish profile-first UX and align Arena Pathway with Soccer Center patterns

Base: `codex/siem-my-ap-consolidation`
Head: `codex/final-ux-conformance`
Status: draft review requested; no merge/deployment authorization.

Parents and athletes can create a basic athlete identity, save, and immediately open a profile overview. Existing preferences, saved opportunities and recruiting notes remain attached to the same ID. Editing no longer returns users through workspace configuration, and the quick form waits for existing data before accepting edits.

The profile uses the read-only Soccer Center identity-card and family/player-navigation patterns, adapted to AP branding and sport fields. My AP retains My Day, Calendar, Messages and My Family. Calendar now has daily agendas, visual weekly columns, monthly grids with selected-day agendas, previous/next controls, athlete filtering and labeled activity colors. Messages show evidence previews, original providers/times, readable required actions and links to related events and precise tasks.

Sport entry pages expose all matching reviewed rows, with primary overlapping Colorado region filters and search-preserving expansion to All Colorado. Club saves never activate Recruiting. `/recruiting` offers college research independently and reuses the existing optional athlete planner. Locked In remains simulated and status-only.

## Dependencies and preservation

The branch starts from My AP consolidation `332ba1b`, carries reviewed progressive discovery `5470bca` in dependency commit `638b454`, and preserves the earlier conformance work at `f583877`. The large inherited data/evidence diff is documented separately from focused UX changes; this is not a new live-acquisition result. No reviewed records, fixtures, approved brand assets, charter or normalized permission models were discarded or rewritten.

Soccer Center reference: `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`. Relevant exported source was read only. No SC build, backend copy, migration, repair or production change was performed.

## Validation

- `npm run check`: **194 passed, 0 failed, 0 skipped**, including data/participation/discovery reconciliation.
- Chromium conformance: **12/12**.
- Actual WebKit conformance: **12/12**, including delayed-script editing and recruiting independence.
- Preserved Pathway browser workflows: **10/10**.
- Rivera family demonstration: **18/18**.
- Dedicated WebKit regressions: **5/5**.

[Review and preview paths](REVIEW.md) · [SC reuse/gap assessment](SOCCER-CENTER-REUSE.md) · [Validation logs](VALIDATION.md) · [Acceptance matrix/checklist](ACCEPTANCE.md) · [Focused changed files](UX-FILES.txt) · [Inherited dependency files](DEPENDENCY-FILES.txt).

Screenshots: [profile](screenshots/athlete-profile.png), [month calendar](screenshots/calendar-month.png), [messages](screenshots/messages.png), [directory](screenshots/sport-directory.png), [recruiting](screenshots/recruiting.png).

## Demonstration and pilot boundaries

Browser-local records are not authenticated or securely persisted across devices. Providers, source freshness and approval actions in the Rivera demonstration are fictional; no messages or submissions are sent. External recruiting sharing remains off. Stats/Network show honest empty states; Media retains publisher links. Physical Safari, live Airo visual parity, production parent permissions and live acquisition acceptance remain unresolved. Statewide coverage and current registrations are not certified.

Review the acceptance checklist before external sales-demo rehearsal. Merging, publishing and deploying either product require separate explicit approval.
