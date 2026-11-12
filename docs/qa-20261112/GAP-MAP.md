# AP-QA-20261112 — existing versus required

Audit baseline: `codex/final-ux-conformance` at `6f7f5493798665c28d2b566215476906c63ebecb`; clean worktree; fetched origin matched. No newer validated dependency found. Development branch: `codex/ap-qa-20261112`.

Read AGENTS.md and PRODUCT-NORTH-STAR.md before edits. Candidate ZIP was extracted outside the repository and reviewed before reuse; its patch script was not applied. SHA-256: `02ee6515bdb5a6e642e6e2ed11c8665adc4acd1283970c9c85859dd005f76631`. Original five utility tests passed independently. The candidate was a first slice, lacking shared-calendar integration, editing, imports, upload storage and application asset registration.

| Area | Existing reusable AP / SC reference | Required correction |
|---|---|---|
| Identity/profile | Approved AP cover/avatar/parent/My Athletes/View Athlete structure; stable v2 profile IDs and local editing | Retain layout; add sport story/goals, searchable existing club/team suggestions/custom entry, tryout choice and real local records |
| Schedule | Personal all-day plans, saved opportunities, ICS download; SC single/repeating schedule controls | Bounded recurrence, occurrence exceptions, categories, edit/delete, times, import preview, stable shared references |
| Family/SIEM | Accepted day/week/month calendar, scoped normalized activities, Rivera provider/evidence fixtures | Add read-only local athlete-plan projection and category filters; preserve fixtures/domain; Slack draft-only replies |
| Stats | Placeholder; SC event-linked game-record/stat structure | Parent-entered sport metrics and achievements, one record per event; no inferred results |
| Media | Publisher links labeled Media; avatar photo separate | Athlete/event-linked family uploads in IndexedDB; distinguish My Feed and Development |
| Content | Two legacy opted-in publisher sources; package 40 candidate names | Independent sport/category preferences; never activate candidates without verified free content |
| Recruiting | Independent optional local research/checklist | Parent-approved local preview reuses schedule/records/selected highlights; AP age16 gate; current sport/rule review remains external |
| LockedIn | Optional simulated status | Explicit Coming Soon for unimplemented live verification; no invented integration |
| Directories/brand | Approved directory records, regions, v0.7/logo | Preserve; no data acquisition or branding replacement |

Read-only Soccer Center `main` was checked at `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`: PlayerScheduleTab, PlayerStatsTab, PlayerMediaTab, GameRecordsSection, RecruitingTab, and `src/lib/portal/coach-sharing.ts`. Reused the single/repeating journey, athlete/event references, record-derived stats and parent-controlled sharing separation; no backend code imported. Existing source-rendered profile comparisons remain in `docs/conformance/profile-visual/`. An exact archive identified as Soccer Center 18 and the user's November11 original screenshots are not attached; exact export/version/pixel conformity cannot be certified.

The supplied README identifies S2, M2/M3 and P0–P4. It contains no separate comprehensive numbered November12 QA finding sheet. Delivery maps those actual identifiers and the user's steps; it does not invent finding numbers.
