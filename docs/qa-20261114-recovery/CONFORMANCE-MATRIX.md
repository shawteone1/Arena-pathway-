# Product conformance recovery — Stage 1 reference and exit gate

Baseline: `638b53fb182e42bb90563e80f789781e5c0c8591`, clean checkout on `codex/ap-qa-20261112`. Stable branch retained; corrections isolated on `codex/ap-conformance-recovery-20261114`. Full AGENTS and approved charter read. No remote writes.

## Verified reference

GitHub latest imported Soccer Center source: `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`, November 11 GoDaddy import; inspected current GitHub HEAD and 16 actual source components. Read-only copies used outside AP. Live rendered Soccer Center homepage and `/demo/parent-portal` inspected in Chromium at iPad dimensions. Live `/parent-portal` redirects to `/login/auth`; authenticated production creation/editing cannot be claimed tested. Demo club/program/age/team/player selection exercised using fictional records, blocking external non-GET requests. Original user screenshots remain a visual reference; no older reconstructed fixture is treated as definitive. Live SC pages emit React hydration error418 while recovering to rendered content; recorded, not repaired.

## Component-level decisions

| Area / actual SC reference | Current AP structural gap | Decision and correction |
| --- | --- | --- |
| `pages/index.tsx`, parent portal hierarchy | Header has SIEM and My Pathway but hides Recruiting/LockedIn; Explore competes with pillars. DGC anchors appear as another navigation system. | Adapt: expose Profile/SIEM/Recruiting/LockedIn in one global nav; Sports secondary. Retain DGC as section philosophy, existing destinations/assets. |
| `parent-portal-player-create.tsx` | Six steps exist behind guided query, but sport/participation/schedule are dropdowns; Goals unstructured. | Repair existing wizard with selectable sport/category/schedule cards and contextual reviewed club/team/season choices. Keep manual fallback, basic editor and single-save contract. Optional development interests replace vague Goals prompt; preserve old goals. |
| `parent-portal-player.tsx`, parent profile | Established identity/cards/tactical tabs already integrated. | Preserve core layout and IDs; use consistent global navigation and grouping. |
| `PlayerScheduleTab.tsx`, `PlayerCalendarSetup.tsx` | One generic form always shows end date, repeat-until and interval; timed one-time competition requires end time. | Adapt: event-aware form, one-time default for competitions, show recurrence only for weekly; optional end time with disclosed validated default; preserve normalizer/occurrence calculations. |
| `PlayerStatsTab.tsx` | Stats selector reuses all-event options including practices and container meets. | Repair: competition-only projection; retain historical records, media uses all event links; nested races/matches remain existing model. |
| `PlayerMediaTab.tsx` | Gallery-first already present and isolated by athlete. | Preserve: existing upload/playback/edit/delete and IndexedDB; regression-test continuity. |
| `RecruitingTab.tsx` | Directory exists, but research/build fragmented across optional module, details and legacy plan controls. | Adapt existing directory and builder into explicit Choose schools → Build athlete information → Build and preview stages. Keep existing filters, drafts, saves and optional activation. |
| `CoachShareTab.tsx`, `CoachProfileCard.tsx`, `CoachProfilePreview.tsx` | All event/record checkboxes selected by default; practice stats eligible; preview is plain text, academic/profile fields missing. | Repair: explicit empty default selections, competition-only eligible records/events, existing profile fields reused, parent-selected highlights, structured local coach card, approval/revocation. No external tokens/sharing/backend. |
| `UnifiedFeedWall.tsx`, `news-feed/GET.ts`, `unified-feed/GET.ts` | AP has reviewed JSON snapshots, not RSS ingestion. Legacy publisher-link module duplicates My Feed. | Preserve approvals; consolidate visible My Feed to reviewed article renderer, disclose snapshot/retry semantics. Keep permitted imagery check and editorial fallback. No new live ingestion claims. |
| SIEM platform, family fixtures | Existing stable shared athlete projection is already present. | Preserve engine/tour/colors/messages; test actual new athlete commitments in own-family calendar and Rivera isolation. |
| LockedIn | External verified reference already integrated. | Preserve external SC demo destination and four-pillar independence. |

## Asset root-cause investigation

Fresh sessions and repeated home → sport → home → profile → home navigations served both CSS files with200 and correct `text/css`, scripts as JavaScript, image/webp and font/ttf; no AP page errors/broken loaded images. There is no service worker. The intermittent external Codespaces failure has **not** been reproduced as a spontaneous server error, and no historical request log was supplied. It is not honest to claim a verified original network cause.

A confirmed resilience defect was reproduced by blocking `/assets/style.css`: homepage renders raw Times New Roman with no error/retry notice. No explicit cache policy or asset revision contract exists, so mixed browser/proxy responses cannot be ruled out. Repair will add explicit cache revalidation/revision handling and independently styled failure/retry feedback, including CSS and image failure checks. Keep CSP and MIME allowlist. Fault injection is distinguished from the unproven original trigger.

## Redundant paths

Keep old URLs/data/preferences backward compatible. Remove the legacy publisher-link section from the visible My Feed grouping; use one approved article renderer. Put legacy optional research checklist behind a single details disclosure; guide recruiting through the staged directory/builder instead. Keep advanced preferences out of primary navigation. Preserve all state rather than deleting modules or old records.

Stage1 exit gate: reference source, rendered unauthenticated/demo pages, AP rendered behavior and fault-injected delivery reviewed before product changes. Authenticated SC behaviors are source-verified only. Implementation proceeds against the corrections above; no aesthetic redesign or backend replacement is authorized.

Follow-up reference evidence: the actual public U16 demo recruiting builder and its coach-card preview were exercised and captured (before/sc-builder.png, before/sc-coach-card.png). Only fictional local selections were saved; no Create link, external invitation or Submit demo request was invoked. All external non-GET requests stayed blocked. SC demo requests showed a loading error; AP does not claim that live request service is verified.
