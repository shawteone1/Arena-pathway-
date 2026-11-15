# November 15 diagnosis and correction map

Baseline: clean `31761f32275c8a2ea03b871f599c5e28f038780c`, recovery branch. Isolated checkpoint: `codex/ap-refinement-20261115`. No pre-existing uncommitted changes. No stable branch replaced.

| Finding | Reproduced cause / existing implementation | Focused disposition |
|---|---|---|
| Practices on unintended days; multiplied calendar entries | Weekly form simultaneously exposes event end and series Repeat through. Entering November 30 in both makes each Mon/Wed practice last 15 days. Five stable occurrences then overlap the other weekdays. See `before/reproduction.json` and calendar screenshot. Pure weekday expansion itself is correct. | Require explicit multi-day opt-in for occurrence end. Otherwise save occurrence end equal to start. No change to recurrence domain, IDs, exceptions or historical storage. |
| Duplicate end-date questions | Occurrence duration and recurrence bound presented together without explicit distinction. | One Repeat through date for normal weekly practices. Existing multi-day events retain their explicit opt-in on editing. |
| Recruiting parity | Existing three stages, college filtering, selection-based card, approval/revoke already implemented. Current SC CoachShareTab initializes field/match/media/event selections empty. | Preserve and exercise complete flow. No new builder or sharing system. |
| Discovery control overlap | City and region are independently selectable and can unintentionally narrow each other. | One Location selector. Legacy city+region links remain supported as a visibly named existing filter; choosing All Colorado clears their effect. |
| Recreational / Competitive classification | Reviewed program `levels` exist; organization names are not reliable evidence. | One additional reviewed-classification filter; explicit Not classified. No guessed travel classification. |
| ZIP radius | No approved ZIP centroid dataset or source-verified program coordinates found in retained data. | NOT IMPLEMENTED: explicit distance/coordinate limitation, no invented distance, ZIP parameter does not silently exclude records. Regional search still works. |
| Club/team manual fallback | Reviewed directory/datalist already exists; manual entry described only in text. | Explicit Add Your Own Club / Team button; same existing athlete save/association contracts. Parent entries never added to reviewed catalog. |
| SIEM setup inconsistency | Independent lightweight setup uses older sections/forms; SIEM active pillar missing on that route. | Existing setup uses scoped family-style panels, readable form controls and active SIEM navigation. Direct own-family calendar action. Same model/fixtures. |
| Missing article photos | Reviewed items have no approved local image metadata/assets. Snapshot endpoint does not ingest live RSS; publisher og:image is not an image license. CSP permits self/blob, not arbitrary publisher photos. | Preserve approved editorial fallback. No CSP loosening, unrelated photography or unapproved imagery. Presentation works; image acquisition/permission remains open. |
| LockedIn | Verified existing external SC demo. | Preserve exact URL and independent pillar. No AP rebuild. |

Source-level reference is the latest imported SC commit `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`, rechecked through GitHub. Current source files match their Git blob hashes. Actual SC public/demo pages and coach card were rendered again; protected parent portal requires authentication. These are not older source-rendered fixtures.
