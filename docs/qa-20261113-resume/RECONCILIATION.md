# Resumed Nov13 acceptance correction

Start: clean codex/ap-qa-20261112 at48ca091c56772ff49b5e6217b8766ecfbc7f0158. Git status/reflog/history show no partial work after that commit. All earlier Nov13 changes and QA evidence are retained. AGENTS.md and the full approved charter were read. No architecture restart or repetition of completed directory/feed/card work.

Latest clarified scope supersedes the earlier static LockedIn preview: restore interactive fictional parent→club workflow; separately discoverable SIEM tour and blue/purple/green athlete palette; athlete calendar views and nested race/match entries; actual optional recruiting profile builder; existing regional public discovery/news presentation; swimming PB/target overview.

Reuse: existing AP recurrence, calendar grids, profile save/records/media/recruiting gates. Soccer Center11de067 GameDetailsPanel uses stable event references; RecruitingTab's Build Profile uses its coach-share component. LockedIn public/model.mjs and app.mjs provide pure fictional packet, permission, acceptance, preview and idempotent handoff logic. Reuse that pure model with fictional AP labels, not SC backend/auth or real AP data. Source SHA441de495764a4eb27ec77166b2d84126e03382d8.

Model additions are additive fields inside existing athlete plans/records/preferences: nested sessions in a meet/tournament, swimming result context and target goals. No independent event store, source activation or destructive migration. Existing general events and IDs remain valid. Parent calendar projects the same child IDs and avoids counting the parent container as a competing commitment.

Known source restrictions remain19 approved/21 inactive and no approved publisher videos/images. These are not silently activated during UI work. No merge/push/deployment or SC modification.

Recruiting source detail: CoachShareTab.tsx blob6246cd2df3e666ec69aa4f44add54afef1868b81 and ProfileBuilder.tsx blobc2c820adf86856e753284f3e6c9c7870a6db25fc were inspected read-only at the same SC commit. AP reuses its field → selected records/media/events → parent preview/revoke hierarchy. SC's API, link/token infrastructure and unrelated soccer/academic fields are not imported. Existing AP identity/About/Goals editing remains the single input path.

Preservation exception: public/local-family-calendar.js changes only its event reader from scheduleFor to the additive athleteEvents projection, filtering parent containers. Existing byte-preservation assertions now permit exactly those import/loop substitutions; the original state, recurrence, stats, media, calendar and SIEM domain models remain byte-identical. New behavioral tests check unchanged storage, stable projected child refs and retained legacy fields.
