# v0.7 visual redesign — work in progress

Branch: `codex/arena-pathway-v07-visual`
Base: `origin/codex/arena-pathway-transfer` at
`b52ed8ca23e40278f2bffd9e1092b68aac3966a2`, the head of draft PR #1.
The base tree matches the completed v0.6 build. Neither the v0.6 development
branch nor `main` was reset or overwritten.

## Blocking input: approved logo

The requested `Interlocked AP Letterman Patch Logo.png` was not attached to the
request or present in the workspace. The old generic A has been removed from
rendered pages and the asset allowlist. There is no invented interlocked AP,
shield, replacement letterform, or placeholder favicon. The text wordmark remains
while the approved original is pending. `src/brand.json` explicitly records this
incomplete state. **This draft is not the completed approved visual identity.**

Once the original arrives:

1. View and inspect the actual PNG; confirm it is the supplied approved artwork.
2. With ImageMagick available, run:

   ```sh
   npm run prepare:brand -- "/absolute/path/Interlocked AP Letterman Patch Logo.png"
   npm run check:brand
   npm run check
   ```

3. The preparation script retains the original unchanged in `design/brand`,
   records its SHA-256 and dimensions, and creates lossless WebP desktop/mobile
   derivatives plus PNG favicon and Apple touch treatments. It resizes with the
   original aspect ratio; square icons use transparent padding. It does not
   trace, crop, recolor, distort, remove backgrounds, or generate artwork.
4. Compare all derivatives with the original, including color/profile fidelity,
   letterform details, edge padding and small-size legibility. Confirm that the
   original canvas is suitable before changing any clear space.
5. Restart the Node process and test header/footer, iPhone, iPad, desktop and icons.
   The brand manifest enables the actual image treatments consistently.

`npm run check:brand` intentionally fails until that original and its derivatives
exist. A passing application test suite is not a claim that the logo is complete.

## Implemented presentation changes

- Exact requested palette: midnight navy `#111827`, vintage cream `#F3EFE6`, muted
  varsity red `#A52A3B`, silver `#B1B5BC`, white and charcoal. Gold tokens removed.
- Self-hosted Barlow Condensed athletic display typography, editorial serif
  accents and system body fonts. The font license is retained with the asset.
- Full-width Folsom Field panorama and cinematic overlays on the umbrella home,
  with the unchanged “YOUR SPORT. YOUR PATH. ONE PLACE.” tagline.
- Mission, discovery, development and opportunity chapters. Sport discovery uses
  photographic editorial features rather than dense uniform corporate cards.
- One Sports dropdown, still exactly Lacrosse, Volleyball, Basketball, Swimming,
  Build Your Own. Existing native details behavior and Escape/outside-click
  handlers remain unchanged.
- Each sport uses relevant, licensed photography; View All Teams is prominent.
  Shared five-section navigation and all original route behavior are retained.
- Directories group clubs, swim programs, named teams, schools, leagues and
  divisions, with parent organization labels and existing sources/save controls.
- Swimming program-format filtering is derived only from existing source text.
  Denver Swim Academy and Loveland Swim Club are explicitly year-round. Other
  programs remain unclassified. Zero records are asserted to be summer-league
  programs because the catalog does not establish that seasonal classification.
- Build My Pathway becomes three visible journey chapters (starting point,
  direction, choices). IDs, field values, persistence and default-off media hooks
  remain intact; no additional portal or application workflow was introduced.
- Mobile CSS covers narrow iPhone widths, iPad layouts, input font sizes that
  avoid iOS focus zoom, 48px action targets, visible focus, reduced motion,
  responsive photo sources and typography. Photo source/license credits are in
  `/credits` and `src/photography.json`.

## Preserved byte-for-byte

The v0.6 catalog, catalog queries/quality validation, browser interaction code,
profile persistence/migration logic and all eight original automated test groups
are unchanged. A committed SHA-256 fixture checks those boundaries. Saved
opportunities, personal/imported plans, ICS export, recruiting planner, family
profiles and opt-in sources keep their existing local-storage schema.

No data records, affiliations, source dates or quality claims were changed.
No backend rebuild, framework migration, fan/coaching portal or deployment
configuration was added. Package and health versions identify the development
iteration as 0.7.0.

## Files

- `src/views.mjs`: shared shell, homepage, sport/directory presentation, onboarding,
  photo credits. Workspace and data-page workflows remain in place.
- `public/style.css`: readable shared typography/layout, editorial and mobile CSS.
- `src/presentation.mjs`: presentation-only entity labels and conservative swim
  classification; `src/photography.json`: image provenance;
  `src/brand.json`: explicit pending approved-artwork manifest.
- `public/photos/*`: responsive WebP derivatives; `public/fonts/*`: self-hosted
  type and OFL license; old `public/a.svg` removed.
- `server.mjs`: allowlisted new visual assets and updated health version only.
- `scripts/prepare-brand.mjs`, `scripts/check-brand.mjs`: deterministic original
  retention, image-format optimization and completion checks.
- `test/design.test.mjs`, `test/fixtures/v06-preserved.json`: regression checks.
- `package.json`, `README.md`, this document: version, commands and delivery notes.

## Verification and remaining QA

`npm run check`: 18 passing groups (all eight original groups plus ten design
regression groups). Includes first-party routes and assets, original-file hashes,
exact menu destinations, sport photos/CTAs, entity hierarchy, evidence-based
swimming filters, onboarding hooks/defaults, structural mobile checks and solid
text/button contrast pairs. No runtime dependencies were added.

`npm run check:brand`: BLOCKED by missing approved PNG. This is intentional.

No screenshots or interactive browser/mobile results are available. The attached
cloud environment reports desktop enabled/state unknown, but its tool catalog
has no callable `cua_repl.js`. The Sites managed-preview instructions require
skipping preview/browser QA in this condition. No substitute browser-control
process or preview server was started. Node HTTP tests use ephemeral servers only.

Still required: inspect the actual logo, verify its derived treatments, and run
real iPhone/iPad/desktop visual and touch QA at widths 320, 375, 390, 768, 820,
1024 and 1440px, landscape and 200% zoom. Check menu focus/Escape/outside-click,
image crops/contrast, overflow, form validation/scroll/focus, directory filters,
profile save/reload/switch/delete, media choices, saved records, ICS download and
recruiting persistence. Capture screenshots once browser tools are available.
See `docs/QA.md` for the existing interaction acceptance checklist.

## Review boundary

Prepare the draft PR against `codex/arena-pathway-transfer`, not `main`. Keep it
in draft while the original logo and browser/mobile checks are outstanding.
Do not merge, update GoDaddy/Airo preview, publish, or change production.
