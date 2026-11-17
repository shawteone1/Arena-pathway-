# Completion blueprint — before implementation

Baseline product24ac0e1e091993cef8726dc03715bc783f1668ad. [112-row preimplementation traceability](../requirements-reconciliation-20261117/REPORT.md) and [machine-readable classifications](../requirements-reconciliation-20261117/REQUIREMENTS.json) are authoritative inventory, not a new product strategy. Work isolated on codex/ap-product-completion-20261117; original candidate remains on GitHub unchanged.

## Preserve and complete

Homepage hierarchy, athlete cards, full identity profile, focused editors, content-section builder and finished portfolio exist. Preserve their AP design and useful behavior. Accepted SIEM engine/demo and LockedIn are unchanged except any narrowly demonstrated integration defect. No new sports, providers, source approvals or parallel identity/event database.

Eight design surfaces:

1. **Homepage:** preserve actual current [render](../requirements-reconciliation-20261117/current/after/chromium-coverage-homepage-loaded.png), four pillars and My Athletes. No new homepage redesign.
2. **Parent dashboard:** [rendered working layout](blueprint/parent.html). Parent identity and family overview; athlete gallery remains central. Next family commitments and action priorities form a readable adjacent overview; messages/changes appear from real available local records. Saved clubs/opportunities and optional recruiting/LockedIn accessible. Empty states are honest, not seeded Rivera content.
3. **Athlete gallery:** preserve current distinctive cards, add clear Archive wording matching recoverable removal. Named exact confirmation remains. Do not invent ratings.
4. **Full athlete profile:** preserve current cover/avatar/story sections; expose retained team warning and reviewed club lookup in focused editor. Athlete information remains single source.
5. **Profile editor:** existing focused sheets, add missing recruiting interests and optional secondary position as needed. Keep student academics and parent age review, no giant all-fields form.
6. **Recruiting dashboard:** identity/status/next step and actual saved program/reviewed camp/showcase cards. Honest empty coverage; browse remains independent. Avoid duplicating college directory implementation.
7. **Portfolio builder:** same7 rich sections and individual owned media/results/appearances. Add compact individual identity/academic inclusion controls within the relevant section, subordinate to content. Exact primary action Build My Recruiting Profile. Retain focus/scroll.
8. **Finished portfolio:** preserve AP header and editorial composition; include selected athletic history/goals/school location. Require source revision saved before approval; local approval still never means public sharing. Save/reopen/edit/rebuild existing composition, not another identity.

Current rendered profile/editor/builder/portfolio are reference layouts, not rejected checkbox proposals: [profile](../requirements-reconciliation-20261117/current/after/chromium-complete-athlete-profile-ipad-portrait.png), [editor](../requirements-reconciliation-20261117/current/after/chromium-audit-profile-editor.png), [dashboard](../requirements-reconciliation-20261117/current/after/chromium-recruiting-dashboard-ipad-portrait.png), [builder](../requirements-reconciliation-20261117/current/after/chromium-recruiting-builder-ipad-portrait.png), [portfolio](../requirements-reconciliation-20261117/current/after/chromium-lacrosse-finished-portfolio-ipad-portrait.png). Their verified omissions are listed in traceability, not treated as new visual standards to copy blindly.

## Data and architecture

Parent overview reads existing `arenaPathway.v2` profiles/saved IDs and `localFamilyCalendar` plus existing SIEM `scopedActivities`/`actionQueue` functions. No new family/athlete/calendar store. Local communications, changes and actions remain existing source records. Rivera remains an explicit SIEM demonstration only. All athlete and event links carry original IDs; no PII in external links.

Profile edits persist existing keys; new compatibility fields are additive optional values. Recruiting retains canonical field keys and selection arrays; new presentation details map through the same projection boundary. Existing saved selections adapt without automatic inclusion of new fields. Strict current parent/age/rules guard remains; changed source or selections revoke local approval.

Safe removal remains an atomic local archive/tombstone, preserving media and unrelated people; UI calls it archive rather than irreversible delete. No destructive migration or new production authorization claims.

Directory result pagination repairs existing page slicing rather than discarding records. All rows remain reachable and filters/query compatibility remain. Official content not enriched without evidence. RSS source/rights boundaries remain unchanged.

## Phase gates

C: parent identity/overview/gallery/management→focused profile editing/save/reload and SIEM continuity before further recruiting corrections. D: full information→content→Build→finished→Save→other pillar→return/reload→edit/rebuild→approve/revoke across4 sports. E/F: same2+-athlete fictional family, all25 mandated steps with no direct database seeding, responsive Chromium/WebKit, selected-video playback, accurate stats, nested races/matches, archive isolation, source restrictions and LockedIn.

Only READY when all required integrated journeys and rendered major surfaces pass. External infrastructure/rights gaps are disclosed, not fabricated. Candidate review is not physical-device, enterprise security or production certification. No further push/merge/deploy/publish authorized.
