# Visual news feed acceptance — November 16

Branch: `codex/ap-rss-news-feed`. Starting commit: `de7c552677fdddaff5782928b8f9d620f23d47ca`. Review: PR #13. This is a presentation upgrade to the existing reviewed-content and RSS paths, not a new feed engine.

## Implemented

- A featured story with licensed sport photography, bold AP collegiate typography, publisher, publication time where supplied, summary and original article link. Filtering promotes the first matching story; it never duplicates the featured record.
- Image-and-text cards beneath it; two columns on desktop/iPad, one on iPhone. Source chips scroll horizontally on narrow screens, without page overflow. Source management stays collapsed until requested.
- ESPN remains prominent for all four sports: NBA/college basketball destinations for basketball; explicitly labeled ESPN search destinations for the other sports. These are not claimed to be ESPN RSS coverage.
- One shared image presentation module serves both reviewed articles and eligible RSS stories. Existing development resources are unchanged.
- Responsive WebP `srcset`, eager/high-priority featured photograph, lazy supporting photographs, intrinsic dimensions, keyboard focus, 44px controls and reduced-motion styling.
- Failed images leave readable article content rather than broken icons or empty photo frames. A missing approved article asset falls back to licensed AP photography.

## Images and source restrictions

[Image metadata audit](IMAGE-METADATA-AUDIT.json): all eleven retained feeds returned HTTP 200 XML during this operator-only inspection. Seven contained discoverable image metadata. The checked ESPN feeds supplied none. The parser now recognizes Media RSS thumbnails/content/groups, image enclosures (including Atom), and embedded article images. Candidates are bounded, deduplicated and explicitly unapproved. They are not requested by the browser.

Metadata availability is **not** display permission. All eleven RSS sources remain disabled pending product-use approval; no source registry, source preference, rights decision or sport namespace was changed. The eight retired sources remain absent. Existing approved reviewed items remain opt-in snapshots, not live RSS.

Current screenshots show actual approved reviewed articles. Their photographs are existing licensed AP sport photographs, **not photographs of those reported events**. Every cover visibly says “Illustrative [sport] photography · not article imagery” and links to the existing credits/license page. No unrelated sport imagery, generated article photographs, publisher logos or fabricated dates were added. The same licensed photo can recur within a sport because no additional article-photo permission has been granted.

An approved article-specific local image requires explicit permission, exact article URL binding, credit and license information. Arbitrary feed `imageCandidates` cannot enable display. CSP remains self-hosted; no remote image proxy, Open Graph scraping or weaker image policy was introduced. Larger publisher imagery catalogs and live activation remain permission gates.

Soccer Center reference inspected read-only: `src/components/portal/UnifiedFeedWall.tsx` and `src/server/api/my-soccer/news-feed/GET.ts` in the existing source snapshot. Adapted principles: chronological RSS stories, source controls, publisher/date metadata, image extraction and editorial cards. AP preserves its own stack, rights gates, reviewed snapshots and distinct family-uploaded Media. These are adapted patterns, not a claim that React components were directly shared or that physical-device parity is certified.

## Validation

| Check | Passed | Failed | Skipped |
|---|---:|---:|---:|
| `npm run check` (syntax, data, participation, discovery and full unit suite) | 259 unit tests | 0 | 0 |
| `npm run test:rss` (subset of full suite) | 24 | 0 | 0 |
| RSS browser acceptance — Chromium | 5 | 0 | 0 |
| RSS browser acceptance — WebKit | 5 | 0 | 0 |
| New editorial acceptance — Chromium | 3 | 0 | 0 |
| New editorial acceptance — WebKit | 3 | 0 | 0 |
| Existing consolidated journeys — Chromium | 8 | 0 | 0 |
| Existing consolidated journeys — WebKit | 8 | 0 | 0 |
| `npm audit --omit=dev` | 0 vulnerabilities | — | — |

New unit coverage checks metadata extraction, approval boundaries, all four licensed manifest entries and actual image/JS asset responses. The existing byte-preservation assertion retains its original security/data checks, with only the new read-only photography endpoint excluded from its historical server comparison; that endpoint has separate response and asset tests.

New browser coverage exercises actual approved content for all four sports at 1440×900, 810×1080 and 390×844; nonempty decoded local images; visible illustration/credit labels; featured headline contrast; layout columns; no horizontal page overflow; touch targets; athlete-ID preservation; publisher/category selection; refresh/reload; unapproved-image requests blocked by design; photo-failure recovery and reduced-motion mode. Existing RSS checks cover retries, stale updates, retired preferences, cross-athlete responses and sport isolation. Existing consolidated checks cover onboarding, schedules, stats, media, recruiting, SIEM and independent LockedIn access.

During development screenshot inspection caught an inherited white featured-card background; it was corrected. Initial new-harness failures came from unscoped hidden Development selectors and loading the fixture after the initial catalog; the selectors/fixture setup were corrected. Final results above have no outstanding failures. Screenshot capture explicitly decodes responsive images after resizing and clears transient toasts/focus; it does not alter production loading behavior.

These are emulated browser viewports, not certification on physical iPad/iPhone hardware. WebKit uses the local WPE runtime wrapper, not installed iOS Safari.

## Screenshot evidence

Actual local AP, with approved reviewed sources explicitly selected for the synthetic QA athlete. Full page captures include AP branding and profile context. RSS-enabled synthetic fixture tests are separate from these real-content screenshots.

| Viewport | Before | After | AP context |
|---|---|---|---|
| Desktop | [Before](before/chromium-actual-desktop.png) | [After](after/chromium-lacrosse-desktop.png) | [Full page](after/chromium-lacrosse-desktop-context.png) |
| iPad | [Before](before/chromium-actual-ipad.png) | [After](after/chromium-lacrosse-ipad.png) | [Full page](after/chromium-lacrosse-ipad-context.png) |
| iPhone | [Before](before/chromium-actual-iphone.png) | [After](after/chromium-lacrosse-iphone.png) | [Full page](after/chromium-lacrosse-iphone-context.png) |

Other sports: [Basketball](after/chromium-basketball-ipad.png), [Volleyball](after/chromium-volleyball-ipad.png), [Swimming](after/chromium-swimming-ipad.png).

WebKit: [Desktop](after/webkit-lacrosse-desktop.png), [iPad](after/webkit-lacrosse-ipad.png), [iPhone](after/webkit-lacrosse-iphone.png). All evidence is committed PNG/Markdown/JSON, viewable directly on GitHub; no locally dependent comparison HTML.

To reproduce: `npm ci`, `npm start`, then `npm run test:rss:browser` and `npm run test:rss:visual:browser`. For this development environment use `WEBKIT_PATH=/workspace/scratch/webkit-local.sh PROFILE_BROWSER=webkit python scripts/qa-news-editorial.py` (or configure a working Playwright WebKit installation). No merge or deployment is part of this change.
