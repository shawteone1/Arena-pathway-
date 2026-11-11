# Profile-only visual conformance correction

Branch: `codex/final-ux-conformance`. Follow-up baseline: `8c48179`. This replaces the sparse AP profile presentation rejected during hands-on iPad testing. It does not change the accepted calendar, 13 lacrosse listings, volleyball results or any directory data.

## Visual evidence

All AP screenshots below are actual application screenshots using fictional browser-local records. Viewport captures are exactly **810 × 1080** portrait and **1080 × 810** landscape, captured with Playwright WebKit. A 768 × 1024 tablet and 390 × 844 phone are also exercised. These are automated browser captures, not new physical-device acceptance.

| View | Side-by-side | Actual AP iPad frame |
| --- | --- | --- |
| Parent / My Athletes | [Parent comparison](screenshots/parent-comparison-ipad.png) · [HTML comparison](parent-comparison.html) | [Portrait](screenshots/ap-parent-ipad-portrait.png) · [Landscape](screenshots/ap-parent-ipad-landscape.png) |
| Athlete / Profile | [Athlete comparison](screenshots/athlete-comparison-ipad.png) · [HTML comparison](athlete-comparison.html) | [Portrait](screenshots/ap-athlete-ipad-portrait.png) · [Landscape](screenshots/ap-athlete-ipad-landscape.png) |
| Local profile photo | — | [Photo/avatar state](screenshots/ap-athlete-photo-ipad.png) |

[Full athlete page](screenshots/ap-athlete-full-page.png) · [Media section](screenshots/ap-media-full-page.png).

**Reference limitation:** The user's November 11 SC screenshots were not attached or available in this session, so they were not inspected. The left-hand frames are explicitly labeled **source-rendered SC references**, not live SC screenshots or reproductions of the missing images. The actual SC parent/player React components and their profile styles were fetched read-only at `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`, then rendered in a temporary, isolated frontend harness. Session/data responses, missing authored-content labels and unrelated child sections are stubbed. No SC backend, production account or live private data was used. Exact matching to the user's original images remains unverified.

[Source/evidence manifest](EVIDENCE.json). Reviewable fixture and bundling inputs are retained as [fixture code](reference-fixture.tsx.txt) and [reference harness](reference-build.mjs.txt). They are test evidence, never served by AP. Temporary dependencies were installed outside AP; no AP package/dependency or infrastructure change was made.

## What changed

### Parent experience

- A cover/avatar identity card, parent/family privacy state and clear profile actions precede the athlete list, matching SC's parent profile hierarchy.
- Existing parent name/avatar data is read from the existing browser-local SIEM parent participant. **Edit profile** updates that same participant ID and store; it does not create another parent account or family database. Editing supports the existing display name plus an optional local photo. Other family records, event history, permissions and connection fields are retained.
- If no parent participant exists, the header says “Your family pathway” and links to the existing family setup to add parent details. No parent identity is invented or created on page load.
- **My Athletes** cards read the existing AP profiles. Cards show avatar/initials, athlete name, sport, position/event and club/team, with a single **View Athlete** action.
- `/my-pathway?view=family` is the parent profile view. Within the profile experience, My Pathway and My Athletes return there. **Open My AP** remains a separate link to SIEM.

### Athlete experience

- The large page heading and detached controls no longer dominate the page. The athlete's cover, overlapping avatar, name, club/team, sport, position/event, parent-managed state and edit action form one identity card.
- The profile has a consistent navigation strip: **Profile overview, Schedule, Stats, Media, Development, Community, Network**. Each active section uses the same white cards, border radius, spacing, typography and AP red/navy active state.
- Profile overview now contains distinct **About the athlete**, **Club & team**, **Next on your schedule** and **Your saved opportunities** cards. All displayed facts/counts come from the existing selected profile; no performances, memberships or dates are invented.
- An optional camera action supports a browser-local profile photo, with an initials fallback. JPG/PNG/WebP inputs are limited to 2 MB and saved as a small 256-pixel JPEG on the same athlete record. Images are decoded/displayed locally; no upload endpoint, remote image service or CSP relaxation was added. Remove photo removes only that photo field. The screenshot uses a synthetic illustrated avatar, not a real minor's photograph.
- View Athlete links resolve the existing ID (`?athlete=...`); changing athlete updates that link state, and reloading keeps the correct selection. Missing IDs show a clear local “not found” state rather than another athlete's identity.
- Recruiting remains a separate, collapsed, optional tool. Saving or viewing an athlete does not activate it. The existing `/recruiting` planner and module data remain intact.

## Preservation and validation

| Check | Result |
| --- | --- |
| Focused Node profile/application/state regressions | **24 passed; 0 failed; 0 skipped** — [log](logs/node.txt) |
| Focused Chromium profile/iPad/navigation regressions | **8/8 passed** — [log](logs/chromium.txt) |
| Focused actual WebKit profile/iPad/navigation regressions | **8/8 passed** — [log](logs/webkit.txt) |
| Existing Pathway browser module/editing regressions | **10/10 passed** — [log](logs/pathway.txt) |
| `git diff --check` | Pass |

The focused tests cover parent → athlete navigation, direct-ID reloads, missing IDs, all sections, parent editing on the existing ID, saved clubs/plans/recruiting notes, optional-module preferences, local photo persistence/removal, invalid images, quota failure and switching athletes during asynchronous photo processing. No profile test sends a POST or other mutation request.

Preservation tests compare the accepted SIEM/calendar files, directory code, engine/data and shared state contract against `8c48179`: **unchanged**. The previous stylesheet remains an exact prefix; new visual rules are scoped to the profile wrapper. Rendered HTML for all four sports' landing, youth and college directories remains **byte-identical** to the baseline. The Schedule module retains its existing event/planner handlers; this correction changes its profile card presentation, not the accepted My AP calendar.

Re-run:

```sh
node --test test/profile-visual.test.mjs test/pathway.test.mjs test/application.test.mjs test/conformance.test.mjs
python scripts/qa-profile-visual.py
PROFILE_BROWSER=webkit WEBKIT_PATH=/workspace/scratch/webkit-local.sh python scripts/qa-profile-visual.py
python scripts/qa-pathway.py
```

The WebKit wrapper uses the previously installed official Playwright WebKit with user-local system libraries; details are in [the existing runtime validation](../VALIDATION.md). On a machine with normal Playwright WebKit dependencies, omit `WEBKIT_PATH`.

## Genuine remaining gaps

- Exact visual acceptance against the user's November 11 screenshots is pending because those images were not supplied. The comparisons establish source/component alignment, not a claim of pixel-perfect live Airo parity.
- The parent header supports existing local participant name/photo, not an authenticated SC-style parent account, editable bio/location, cover-image upload/repositioning, guardian invitations or permission verification. The AP cover remains branded.
- Stats remain an honest empty state; no performance imports are connected. Media retains chosen publisher links; profile photos do not constitute a media-upload service. Network has saved records and a link to My AP messages; live networking/chat is not implemented.
- My AP provider integrations and Locked In remain simulated/unconnected/status-only as before. No authentication, secure cross-device persistence, external recruiting sharing, verification or payment service was added.
- New iPad screenshots/tests use actual WebKit at iPad dimensions. The corrected profile still needs the user's hands-on physical iPad visual sign-off.

No SC files, backend, authentication, infrastructure, approved calendar or directory implementation were changed. No merge, remote publication or deployment was attempted in this follow-up.
