# Approved PlayRcmd PR/CMD soccer-ball logo integration

Review branch: review/playrcmd-approved-soccer-logo-2026-11-20.
Verified starting branch: review/playrcmd-guided-portfolio-2026-11-20.
Source commit: e92374f2342efb1a2edc20355f17b8e1386651ca.

## Exact approved source

The founder reattached and confirmed the visible PR/CMD image in this task. Its accessible upload was named 1-Photo-1.jpg (1280×853 RGB). A byte-for-byte copy is preserved as `playrcmd/brand/masters/682F7A0C-FD73-4B7B-8519-BF5BC67AC602.jpeg`, using the founder's approved source name.

Master SHA256: `5ae1a3292deb5b6a9a81a07a472360a91f2194649bd31c602b089c8f5c5195d3`.

No artwork was regenerated, substituted, traced, repainted or recolored. The master JPEG, including its original bytes, remains intact. Only deterministic cropping, resizing and exterior alpha masking were used.

## Asset preparation

`playrcmd/brand/prepare_assets.py` records exact crop rectangles and export hashes in asset-manifest.json. The complete mark uses crop (294,34,984,819), preserving ball, PlayR wordmark and CMD. The emblem uses a proportional square (350,32,926,608), excluding the unrelated wordmark top pixels below y=597. No letter, soccer panel or ring geometry was redesigned.

Near-white pixels connected to the image boundary become transparent only outside a protected ellipse covering the complete ball. Enclosed wordmark counters and white interior PR/circle details remain opaque. The native transparent full PNG has exactly the same RGB bytes as the corresponding original crop; only alpha changes. The white panel texture is the approved photograph, not a substituted flat-color drawing. No aggressive edge decontamination was applied because that would change the approved pixels; a fine JPEG edge may remain when examining transparent exports at high magnification.

Outputs: transparent PNG and lossless WebP full mark, original-background fallback, optimized 192/384-width full marks, 64/128/256/576 emblem exports, 16/32/48/64 favicon PNGs, 180px touch icon and multiresolution ICO. `asset-proof.png` is an actual export inspection board, explicitly NOT a website screenshot.

## Integration and preservation

- Complete approved image replaces the old placeholder/text identity in landing header/footer and shared role/setup/integration page headers/footers.
- Compact ball crop appears in the illustrated command-center header, beside role labels and in favicon/touch icons.
- A local white contrast plate supports the approved navy lettering on dark surroundings; the artwork colors remain navy/red/white/graphite.
- CSS is limited to logo sizing, header spacing necessary for the approved tall lockup, dropdown alignment and contrast. Existing stadium photography, fonts, green/charcoal page backgrounds, buttons, hero text, navigation and layout structure remain. No site-wide color redesign.
- `playrcmd/brand.mjs` selects only the approved soccer variant. Explicit self-hosted asset routes avoid wildcard file serving. Future variants can have separate folders/config entries, but no unapproved sport variant or selector was created.
- SIEM/calendar/profile/recruiting engines, onboarding, provider simulation, role switching/reset and all controller IDs/scripts are unchanged. No Soccer Center, LXDiN or unrelated AP source was modified.

## Actual verification

- Exact source/master SHA verified; alpha/crop/white-detail/hash/icon checks PASS (`python3 playrcmd/brand/verify_assets.py`).
- New HTTP regression checks serve full mark, emblem, PNG/ICO assets at 200 with correct image/webp, image/png and image/x-icon MIME types. All landing/role/setup/integration pages reference the complete approved logo; no unapproved variant or master path is served. Existing CSP remains unchanged.
- Focused PlayRcmd suite: **28/28 passed**.
- Full source suite: **348/348 passed**, zero failures/skips.
- Existing onboarding DOM checks pass for all three roles. They are nonvisual DOM tests, not native browser acceptance.
- Original vs candidate demo/setup interactive IDs and controller script lists match. Underlying engine and onboarding source files remain byte-identical to the starting commit.
- Asset proof visually inspected: full identity on light background and dark background with contrast plate; isolated emblem; no clipping or accidental inclusion of the lower wordmark in the compact crop.

## Browser/device screenshots — BLOCKED

Actual browser initialization was attempted using cua.getState() and failed before navigation: “the gaas-browser node_repl sandbox cannot be disabled”. No sandbox bypass was attempted.

| Device | Before screenshot | After screenshot | Actual render/contrast/overflow acceptance |
| --- | --- | --- | --- |
| Desktop 1440×1000 | Unavailable | Unavailable | NOT VERIFIED |
| iPad landscape 1024×768 | Unavailable | Unavailable | NOT VERIFIED |
| iPad portrait 768×1024 | Unavailable | Unavailable | NOT VERIFIED |
| Phone 390×844 | Unavailable | Unavailable | NOT VERIFIED |

No live preview URL was opened or verified. The GitHub integration lists no accessible Codespaces. No claim is made that a preview is live. Existing screenshots elsewhere in the repository are historical and are not substituted as this change's before/after evidence.

`playrcmd/qa/logo-browser.py` provides an actual screenshot/loaded-image/proportion/overflow runner for a supported Playwright environment. It records before images only when a real separate baseline server is supplied via PLAYRCMD_BEFORE_BASE.

## Owner preview steps

In a separate review checkout/Codespace:

```sh
git fetch origin review/playrcmd-approved-soccer-logo-2026-11-20
git switch --track origin/review/playrcmd-approved-soccer-logo-2026-11-20
npm ci --ignore-scripts
PLAYRCMD_HOST=0.0.0.0 PLAYRCMD_PORT=4310 node playrcmd/server.mjs
```

Use Node >=22.13 and the full source tree for existing shared dependencies. Forward 4310 privately; open its actual HTTPS address on the founder's iPad owner session. Do NOT run the root Arena Pathway server. Leave port protocol HTTP upstream; GitHub terminates external HTTPS.

For supported local browser QA, use another terminal:

```sh
PLAYRCMD_QA_BASE=http://127.0.0.1:4310 python playrcmd/qa/logo-browser.py
npm --prefix playrcmd run test:roles:browser
```

Optional actual before server: create an isolated detached worktree at e92374f2342efb1a2edc20355f17b8e1386651ca and run ONLY its PlayRcmd server on port 4311. Supply `PLAYRCMD_BEFORE_BASE=http://127.0.0.1:4311`. Do not switch or reset the active candidate checkout for screenshots.

## Founder acceptance still required

- [ ] Review full mark readability/white contrast plate and circular emblem at desktop, both iPad orientations and phone dimensions.
- [ ] Check no clipping/distortion; favicon/saved home-screen icon reflects the approved soccer art.
- [ ] Exercise onboarding/tour, role switches, calendar/notifications and reset; confirm no unrelated visual/functionality change.
- [ ] Record actual before-and-after screenshots and the opened/verified preview URL.

No main merge, deployment, publication, production overwrite or DNS change was performed. This is a source review branch only. The generated asset proof is not proof of browser acceptance.
