# v0.7 visual redesign — approved logo integrated

Branch: `codex/arena-pathway-v07-visual`
Base: `origin/codex/arena-pathway-transfer` at
`b52ed8ca23e40278f2bffd9e1092b68aac3966a2`, the head of draft PR #1.
The base tree matches the completed v0.6 build. Neither that development branch
nor `main` was reset or overwritten. Keep the visual PR in draft until outstanding
real-browser/mobile QA is complete.

## Approved artwork and web treatments

The supplied `Interlocked AP Letterman Patch Logo.png` is retained unchanged at
`design/brand/Interlocked AP Letterman Patch Logo.png` (1536 × 1024 pixels).
Its SHA-256 is:

`e6416a5689f562260f3f15ed272c5427e04e7a77bcc387cb2436dccc7659f9ce`

The presentation board includes the embroidered patch, a “02 · LETTERMAN” label,
and the Arena Pathway name. Web treatments isolate the complete AP patch, cream
border and shadow at source rectangle x=310, y=45, width=900, height=805. A small
80 × 30 corner containing part of the board label is replaced with unaltered
background pixels from source x=390, y=45. This corner is outside the AP artwork.
The separate board label and bottom wordmark are not included in icon treatments.

No letters, proportions, stitching, patch borders, shadows or logo colors are
redrawn, recolored, rotated, regenerated or removed. The approved green/gold/cream
logo colors remain as supplied, alongside the application’s navy/cream/red/silver
interface palette. CSS preserves the logo aspect ratio and applies no color filter.

- `public/brand/ap-homepage.webp`: 900 × 805, lossless, large homepage treatment.
- `public/brand/ap-desktop.webp`: 256 × 229, lossless, shared navigation/footer.
- `public/brand/ap-mobile.webp`: 128 × 114, lossless, mobile picture source.
- `public/brand/favicon.png`: 64 × 64, aspect-preserving transparent icon padding.
- `public/brand/apple-touch-icon.png`: 180 × 180, aspect-preserving icon padding.

The original SHA, crop specification, intrinsic dimensions and every derivative
SHA are recorded in `src/brand.json`. `npm run check:brand` validates the retained
original and all derivative files. `scripts/prepare-brand.mjs` reproduces the
assets using ImageMagick without generative tools:

```sh
npm run prepare:brand -- "design/brand/Interlocked AP Letterman Patch Logo.png"
npm run check:brand
npm run check
```

Generated files are committed; Codespaces does not need ImageMagick or any asset
build step to run the application. Regeneration requires ImageMagick. The script
rejects an unexpected source size or a different original until manually reviewed.

Original and optimized artwork, including small-size desktop/mobile/icon assets,
were visually inspected as standalone images. A pixel comparison confirmed zero
changed pixels in the lossless homepage treatment outside the documented board-
label exclusion. This verifies asset derivation, not rendered page layout.

## Presentation changes

- Exact interface palette: midnight navy `#111827`, vintage cream `#F3EFE6`, muted
  varsity red `#A52A3B`, silver `#B1B5BC`, white and charcoal. Gold CSS tokens removed;
  the approved artwork’s gold embroidery is intentionally retained.
- Self-hosted Barlow Condensed athletic display typography, editorial serif
  accents and system body fonts; font OFL license retained with the asset.
- Full-width Folsom Field panorama and cinematic overlays, with the unchanged
  umbrella tagline “YOUR SPORT. YOUR PATH. ONE PLACE.”
- Editorial mission, discovery, development and opportunity chapters. A larger
  approved-logo treatment appears in the homepage mission section.
- Exactly one Sports dropdown: Lacrosse, Volleyball, Basketball, Swimming and
  Build Your Own. Native details and original Escape/outside-click behavior remain.
- Relevant responsive sport photography, prominent View All Teams, all existing
  sport landing pages and Teams/Tryouts/Camps/Community sections preserved.
- First-party directories distinguish clubs/swim programs, actual named teams,
  schools, leagues and divisions, with parent labels, provenance and save actions.
- Swimming format filtering uses existing explicit source text only: Denver Swim
  Academy and Loveland Swim Club are year-round. Other programs are unclassified;
  none is asserted to be summer-league solely from league membership.
- Build My Pathway uses three visible journey chapters. Every original field
  value, interaction hook and default-off media choice remains intact.
- iPhone/iPad CSS, 48px action targets, 16px inputs, visible focus, reduced motion,
  responsive WebP assets, and photographic source/license credits in `/credits`.

## Preserved application and data

The v0.6 Colorado catalog, catalog queries/quality validation, browser interaction
code, profile persistence/migration schema, and all eight original test groups
remain byte-for-byte unchanged. A committed SHA-256 fixture verifies those
boundaries. Family profiles, saved opportunities, personal/imported schedules,
ICS export, recruiting planner and opt-in sources retain their existing behavior.

No affiliations, source dates, data records or quality claims were changed. No fan
or coaching portal, backend rebuild, framework migration or deployment config was
added. Browser-local identity/storage limitations and partial statewide coverage
remain unchanged. Package/health versions identify development iteration 0.7.0.

## Modified file groups

- `src/views.mjs`, `public/style.css`: shared shell, home/sport/directory/onboarding
  presentation, responsive logo placement and image credits.
- `src/presentation.mjs`, `src/photography.json`: presentation labels, conservative
  swimming classification, and photo provenance.
- `src/brand.json`, `design/brand/*`, `public/brand/*`: approved source and faithful
  web/icon derivatives with provenance and dimensions.
- `public/photos/*`, `public/fonts/*`: responsive photography and licensed type;
  original generic `public/a.svg` removed.
- `server.mjs`: explicit visual-asset allowlist and development health version.
- `scripts/prepare-brand.mjs`, `scripts/check-brand.mjs`: deterministic asset
  derivation, retained-source and derivative integrity checks.
- `test/design.test.mjs`, `test/fixtures/v06-preserved.json`: regression checks.
- `package.json`, `README.md`, this document: version, commands and delivery notes.

## Verification and remaining QA

`npm run check`: **20 passing groups on Node 22.23.4**, including all eight original
groups, ten presentation regressions and two approved-logo integrity/routing
checks. Coverage includes preserved-file hashes, menu destinations, editorial
structure, source-backed swimming filters, onboarding hooks, responsive structure,
solid-color AA text contrast, original attachment hash, derivative hashes and
aspect ratios, homepage/header/mobile/icon references, and correct HTTP asset bytes.

`npm run check:brand`: **PASS**. Original and all treatments verified.

No browser/mobile screenshots or interaction pass is available. The attached
managed environment reports desktop enabled/state unknown, but exposes no callable
`cua_repl.js`. The Sites managed-preview instructions require skipping preview
and browser QA in this state. No alternate browser-control process or preview
server was started; HTTP tests create and close ephemeral servers only.

Still required: real iPhone/iPad/desktop QA at 320, 375, 390, 768, 820, 1024 and
1440px, landscape and 200% zoom. Check logo sizing/clear space, favicon appearance,
menu keyboard/touch/Escape/outside click, photo crops/contrast, overflow, form
validation/focus, filters, profile save/reload/switch/delete, media choices, saved
records, calendar export and recruiting persistence. Capture screenshots when
browser tooling is available. Existing acceptance details remain in `docs/QA.md`.

## Review boundary

Draft PR target: `codex/arena-pathway-transfer`, not `main`. Keep it draft until
browser/mobile QA is reviewed. Do not merge, update GoDaddy/Airo preview, publish,
or change production. GitHub writes from this session previously returned 403;
Codespaces transfer assets are provided for the owner’s working GitHub connection.
