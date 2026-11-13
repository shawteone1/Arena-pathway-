# Discover / Grow / Connect — targeted presentation assessment

Clean start:39ecc7eb9c2f671658d4916f17c966facb6b3c39 on codex/ap-qa-20261112. AGENTS.md and full approved North Star read. The existing development branch is explicitly authorized. No charter, commercial-pillar, data-model, source-approval or infrastructure change.

Current-page audit captured the homepage, Lacrosse, athlete, My Feed, Development, Community and SIEM in a fresh810×1080 browser context. Existing synthetic profile fixtures and explicitly selected approved sources were used; no personal browser was read. Audit screenshots are retained separately from final matched evidence.

| Weakness | Focused reuse / correction |
|---|---|
| Homepage explains the platform before surfacing the four sports. | Retain stadium hero/tagline/letterman logo and all existing content. Bring sports earlier; add Discover/Grow/Connect anchors to existing sections and the approved complementary positioning line. |
| News lacks an intentional visual fallback when image rights are absent. | Reuse the existing reviewed feed, publisher chips, preferences, retry and source links. Add AP typographic editorial covers, explicitly decorative; never use unrelated sport photos as article thumbnails. Keep approved-image checks unchanged. |
| Full athlete header dominates every resource/tactical view. | Keep a fuller personal identity on Profile; use a compact identity treatment in Schedule/Stats/Media/Feed/Development/Community. Retain parent/privacy labels, photo/edit controls and all five tactical tabs. |
| Existing seasons and recorded achievements are understated. | Present only existing season/team values and record achievements. No invented stats, milestones, seasons, progress scores or new persistence fields. |
| Section rhythm and interactions remain static. | Extend the existing AP stylesheet, with restrained hover/pressed states and optional smooth anchors; reduced-motion users receive no transform/transition/scroll animation. No new animation package or design system. |

Soccer Center source re-read, read-only: public homepage src/pages/index.tsx blobd03dd4d619a81bcc84c562417c910f414ea931f0; parent-home-polish.css blobf96ad451da9b23366b5aa552f671a196bbf57314; UnifiedFeedWall.tsx blob2e43d601cf213894b9c91a37f2d7df75249c30af. These establish strong photography/editorial hierarchy, source controls, card grids and44px/focus patterns. AP's SSR/DOM components are retained; SC's authenticated media APIs/backend are not imported. AP has reviewed snapshots, not a live RSS refresh service; no new feed infrastructure is implied.

Discover/Grow/Connect are presentation concepts. Profile/SIEM/LockedIn/Recruiting remain the four independent pillars. Existing SIEM entry, colors, source disclosure, privacy, shared references and the external SC LockedIn link remain the validated implementation.
