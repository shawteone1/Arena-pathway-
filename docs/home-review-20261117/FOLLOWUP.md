# Homepage QA follow-up

Parent: `c78a38a072f4155a48d51c890ac515214b0d197c`.

## Two reported homepage failures corrected

1. The mission shortcut **Start with what matters to you** now targets `/build?new=1&guided=1`, matching the existing guided Add Athlete entry instead of the compact legacy `/build` form.
2. The exact approved supporting tagline **Your sport. Your path. One place.** is restored in the main hero beneath **Simple to use. Powerful underneath.** A footer-only appearance did not meet the approved placement.

Tests assert the hero-specific tagline and mission-specific destination, not a page-wide text match. No model, storage, SIEM, recruiting, LockedIn, permission or sharing logic changed.

## Independent review provenance

The coordinating task relayed independent browser results for parent `c78a38`: clicked home → athlete → recruiting → private save/reopen passed in desktop Chromium and iPad portrait/landscape WebKit, with the two homepage failures above. Those results apply to the parent only. This follow-up is not yet browser-verified; use its exact remote SHA for the next focused browser check. The original local browser socket restriction remains.

## Age-review friction inspected, safeguards unchanged

`recruitingGate` requires explicit parent/guardian management, age 16–100 reviewed within 366 days, and sport-specific guidance reviewed within 90 days. Private draft/save is distinct from approval. These controls remain intact.

The Athletic Background editor stamps `ageReviewedAt` only if the age value changes. An unchanged prefilled age with missing/expired review therefore cannot be reaffirmed by an ordinary Save. Recommended next UX change: a clearly labeled explicit **Confirm this age is current** action, including the athlete and age, that records the review without requiring users to change the value. Do not silently mark age reviewed on unrelated saves, infer it from graduation year, or weaken the age threshold. This patch deliberately does not change the approval flow.

## WebKit observation

The relayed report noted one module-import exception during a homepage transition, with two cancelled requests; five fresh retries were clean. No exact module URL, stack or reproduction sequence was available. No cause is established and no speculative loader or caching change was made. Capture the failing request URL/status, exception stack, route sequence and timing if it recurs.

No merge, deployment or production update. Browser acceptance of this follow-up remains pending.

## Automated verification

`npm run check`: 324 tests passed, zero failures, plus configured syntax, data/participation and discovery validation. `node --check src/views.mjs` and `git diff --check` also passed. These results do not substitute for the pending focused browser check.
