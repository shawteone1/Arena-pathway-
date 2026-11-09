# Draft: Unified participation directories and configurable family pathway

Base: `codex/colorado-data-engine-v1-review`
Head: `codex/unified-sports-data-ux`

Families now begin in youth discovery, open first-party organization profiles, inspect verified program/team and joining details, and save records into independently selected workspace modules. Youth, school, college, adult/Masters, professional and community views are separated across four sports. Approved v0.7 logo, homepage, typography and palette are preserved.

- Adds typed program, ownership, classification review, registration-reference and provenance relationships through additive SQLite migrations, with safe audit transfer and retained original records.
- Adds club-first search, individual team matches, category/filter navigation, program profiles, source/freshness warnings and historical/current schedule separation.
- Expands official CSI membership (69/69), HDN provider scopes (38 northern, 30 southern), Gold Crown feeder/club posts (53/53), school tiers and official community/program sources. Provider scopes are not presumed competition teams or openings.
- Preserves all 341 reviewed-base core records and original evidence; current core total is 513. There are 296 program scopes (295 verified), 132 assigned teams and 95 open classification exceptions. Coverage remains statewide partial; blocked RMR/AYL and unresolved participant ownership are documented rather than concealed.
- Provides seven independent, reorderable modules with recruiting/media opt-in, per-family choices and retained data when disabled. Saving clubs does not activate recruiting.

Validation: Node.js 22.23.4 `npm run check` (79 tests); isolated Chromium browser suite (16 tests); fresh SQLite audit restoration. Browser viewports: 390×844, 768×1024, 1280×900. Screenshots accompany transfer package.

Existing test groups are retained. Assertions expecting a mixed/unclassified directory and six modules were updated to verify category separation and seven explicit modules; source/brand preservation checks remain. Added tests cover ownership, duplicate presentation, swimming classifications, registration evidence, source pagination failures, historical schedules, audit preservation and profile/module independence.

Not verified: physical iPhone/iPad, Safari, VoiceOver, GoDaddy/Airo runtime/storage and real scheduler. Registration availability remains unknown where no dated evidence exists. Substantial regional, school, adult, community and blocked-source gaps remain. See `docs/UNIFIED-COVERAGE.md` and `docs/UNIFIED-SPORTS-RUNBOOK.md` for exact scope and preview/import/recovery instructions.

Draft for review only. No main merge, GoDaddy preview update or production publication.
