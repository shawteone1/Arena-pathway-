# Architecture, reuse and preservation assessment

Baseline: `24ac0e1e091993cef8726dc03715bc783f1668ad`. The exact clean reconstruction checkpoint was inspected and normally pushed under the preceding review authorization; its branch remains untouched. All completion work is isolated on `codex/ap-product-completion-20261117`. The preimplementation inventory and blueprint are earlier local commits, not retroactive design claims.

## One family, one athlete identity

`arenaPathway.v2` remains the athlete/profile/saved-record/recurrence/results/recruiting-composition store. Existing `arenaPathway.siem.v1` remains the parent/lightweight participant/manual family communication/event/action store. Binary gallery media remain in the existing IndexedDB media library. No second athlete, event, media or recruiting database and no destructive migration were introduced.

`family-home.js` is a read adapter over `loadState`, `localFamilyCalendar`, `scopedActivities` and `actionQueue`. `parent-home.js` renders those records into the existing family gallery. Parent identity editing uses the existing SIEM parent record. Athlete cards, saved IDs and original event references remain authoritative. No Rivera messages are injected into actual family records. The parent summary limits the visible next commitments/priorities, with full-calendar/actions links; totals refer to the full collection.

Returning families' header/home SIEM entry points resolve to their local command center after hydration. The explicit guided tour and new-visitor SIEM entry still open the approved fictional demonstration. This is navigation context, not a replacement SIEM engine. Existing SIEM-only lightweight participants remain supported without compulsory full profiles or recruiting.

The local calendar adapter now preserves existing manual event history and incomplete required actions; local action decisions persist atomically into the existing SIEM root. Unknown versions or storage failures reject writes. Fictional scenario decisions remain isolated. SIEM's domain/model/fixtures, accepted layout and athlete colors are preserved.

## Profile and recruiting contract

Focused profile editors write existing identity/background/education/story/achievement keys. The reviewed club chooser uses the same catalog as discovery; manual entries do not become verified directory records. Replacing a club keeps prior team information flagged for parent review. The general profile shows that warning; the coach projection omits the unconfirmed retained team until explicitly confirmed or replaced. Reinstalled choice lists remove every old input/keyboard/document listener, preventing a stale hidden team selection.

The same `recruiting-sports.js` adapters supply four sports' terminology and metrics. No sport-specific recruiting application was created. Optional `athleticHistory` joins the canonical field allowlist. `collegeGoals`, `schoolLocation`, GPA scale/type and other retained fields are rendered from their existing keys. New fields never automatically become selected in older drafts. Existing saved schools and legacy field/item selections remain compatible.

The primary experience remains identity/status → independently saved information → visual content cards and subordinate detail choices → Build My Recruiting Profile → finished portfolio → explicit Save → saved portfolio on return. Selection updates mutate in place and retain focus/scroll. Original competition/result/media IDs are projected only when explicitly selected and owned by that athlete. Practices remain excluded from competition results and ordinary competition-media association.

Approval now requires the saved composition revision to match the current strict projection. Both disabled UI and handler enforce this. Source/selection edits revoke stale approval; retained older compositions require saving the current revision before approval. This is local review, never a public coach URL or secure external sharing claim.

The existing Swimming target-time editor node and its handlers are retained when mounting the richer profile overview. Results, personal bests, target time and historical media references are not migrated or recomputed destructively.

## Soccer Center source-to-target reuse

Source remote HEAD read back November17: `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`, matching the inspected source cache. React/TypeScript and authenticated backend components cannot honestly be described as directly shared DOM modules with AP's current server/vanilla-JS stack.

| Soccer Center reference | AP implementation | Decision and boundary |
|---|---|---|
| `RecruitingTab.tsx`, coach/program directories | `college-research.js`, `recruiting-directory.js`, existing reviewed AP catalog | Preserve the earlier port/adaptation: research tabs, filters, official links, saved IDs. No cross-sport coach substitution. |
| `ProfileBuilder.tsx` | `athlete-experience.js`, `recruiting-experience.js`, existing state | Adapt profile-first entry, focused editors and explicit progression. AP's original profile/portfolio presentation follows the approved November17 direction rather than cloning a checkbox page. |
| `CoachShareTab.tsx` | `recruiting-fields.js`, `recruiting-composition.js`, `recruiting-profile.js` | Preserve/extend the earlier behavioral port: field/item allowlist, ownership, competition-only projection, parent review/revocation. AP local approval is not the authenticated SC sharing system. |
| `CoachProfileCard.tsx`, `CoachProfilePreview.tsx` | `athlete-portfolio.js` | Adapt content hierarchy, education, performance, selected media and appearances into original AP collegiate portfolio. Same AP renderer across four sports. |
| Player creation / schedule / media tabs | Existing guided wizard, recurrence, meet sessions, gallery and media library | Preserve tested domain behavior; complete context/navigation rather than rewrite. |
| Public editorial presentation | Existing reviewed snapshots plus qualified RSS renderer | Preserve publisher attribution, image-rights boundary and clear freshness labels. No new source activation. |
| Old AP primary checklist | Retained compatibility modules, no longer primary UI | Retire as primary presentation, not destroy old drafts or re-enable competing entry points. |

Rendered public SC references are actual public demo pages. Protected production editors require an authorized session; source verification and public-demo screenshots do not establish authenticated production parity. LinkedIn/profile/recruiting product patterns informed the approved original design; no proprietary layouts/assets or third-party logos were copied. Prior design-reference retrieval failures remain documented in `docs/profile-reconstruction-20261117/REFERENCES.json`.

## Recoverable removal and data evidence

The existing named confirmation requires an exact athlete name. The action is accurately labeled **Archive Athlete**: recoverable browser-local archival, not irreversible deletion. Existing tombstones exclude archived athletes from active profiles, recruiting and stale calendar projections; unrelated athletes and archived binary media remain retained. Supported stale writers cannot resurrect an archived athlete. Production guardian authentication and server-side erasure remain external limitations.

[PRESERVATION.json](PRESERVATION.json) byte-compares 197 protected data/engine/domain/charter files to the actual reconstruction baseline: all unchanged. It does not pretend that every application file is protected or unchanged. The deliberate adapter/projection/UI changes are in the complete changed-file list. Node and real-browser archive, original-reference, nested-race/match and historical-media tests supplement that source comparison.

Directory pagination changes only the presentation slice to 24 rows. The browser enumerates every original Basketball ID across all pages and checks no duplicates. No directory facts, source approvals, geographic coordinates, team IDs or provider credentials were added. `catalog-records.js` centralizes the exact existing lookup categories without a new registry.
