# My Feed RSS integration review

Built from `codex/ap-rss-source-registry`, base commit `fde3259`. Review only; no merge or deployment.

My Feed now supports publisher-by-publisher RSS opt-in using the existing athlete's `contentSubscriptions`, alongside the unchanged reviewed-content resources. New IDs use `<sport>:rss:<publisher>`, so existing reviewed-item choices do not silently subscribe an athlete to a publisher's ongoing feed. Independent controls update the current saved subscription list rather than overwriting another control's changes. No athlete schema migration is needed. No Soccer Center, SIEM, Locked In or recruiting functionality changes.

The news section uses existing editorial cards, large accessible controls and a responsive two-column/one-column layout. It shows publisher, publication time, optional author, a short plain-text excerpt and the original article link. No publisher images, embedded media, tracking pixels or full articles are loaded. Filters cover professional, college, national/Olympic, youth, recruiting, development and podcast. Categories come from explicit item labels or a single-purpose source's coverage; unknown items appear under All news, never every category of a multi-topic publisher. The Recruiting filter only filters public news; it does not activate or change the recruiting product.

## Activation gate

**No RSS publisher is enabled in this PR.** The brief requires completed rights/access review as well as technical endpoint validation. The candidate registry supplied no such approvals. `enabled: true`, `verification.status: verified`, and `rights.status: approved` with evidence and a review date are all required in `data/rss-feed-catalog.json`. XML availability alone establishes no permission to republish excerpts or continuously ingest a publisher. Pending sources are visible but disabled; existing individually reviewed articles remain usable.

A reviewer must establish permitted use, attribution/excerpt limits, applicable terms, youth suitability/access policy and any approval expiry, record evidence and date, and reverify the endpoint before a separate activation change. An approval must cover ongoing feed content rather than only previously reviewed articles. Third-party coverage must remain identified as third-party. No aggregator has been presented as an official league feed. Do not bypass blocked pages or fetch publisher homepages as feeds.

## Endpoint evidence — November 13, 2026 UTC

`data/rss-endpoint-verification.json` records both attempts, exact URLs, timestamps, status/content type, first bytes, response size and SHA-256 where a complete response was read. Bodies are excluded from Git. `data/rss-source-candidates.json` is unchanged. Endpoint probes that returned 404 establish only that the listed attempted path failed, not that a publisher has no feed elsewhere.

| Sport | Publisher | Attempted HTTPS endpoint | Result |
| --- | --- | --- | --- |
| Lacrosse | National Lacrosse League | `https://www.nll.com/feed/` | RSS verified, 20 usable items |
| Lacrosse | World Lacrosse | `https://worldlacrosse.sport/feed/` | RSS verified, 12 items |
| Volleyball | VolleyballMag | `https://volleyballmag.com/feed/` | RSS verified, 10 items |
| Volleyball | VolleyCountry | `https://volleycountry.com/feed` | RSS verified, 10 items |
| Volleyball | Coaching Volleyball | `https://coachingvb.com/feed/` | Initial 200 RSS parsed, 10 items; DNS ENOTFOUND on recheck; reliability unresolved |
| Volleyball | World ParaVolley | `https://worldparavolley.org/feed/` | RSS verified, 10 items |
| Volleyball | Asian Volleyball Confederation | `https://asianvolleyball.net/new/feed/` | Initial 503; recheck RSS verified, 10 items |
| Swimming | SwimSwam | `https://swimswam.com/feed/` | RSS verified, 10 items |
| Swimming | Swimming World | `https://www.swimmingworldmagazine.com/news/feed/` | RSS verified, 10 items |
| Basketball | ESPN NBA | `https://www.espn.com/espn/rss/nba/news` | RSS verified, 18 items; no HTML challenge in these attempts |
| Basketball | ESPN College Basketball | `https://www.espn.com/espn/rss/ncb/news` | RSS verified, 14 items |
| Basketball | CBS Sports College Basketball | `https://www.cbssports.com/rss/headlines/college-basketball/` | RSS verified, 36 items; college-only endpoint |
| Lacrosse | USA Lacrosse | `https://www.usalacrosse.com/rss.xml` | 404 HTML; discovery still needed |
| Lacrosse | Inside Lacrosse | `https://www.insidelacrosse.com/rss` | 404 HTML; discovery and permission still needed |
| Lacrosse | PLL · OurSports Central | `https://www.oursportscentral.com/feeds/rss/l-254.xml` | 404 HTML; third-party, exact endpoint unconfirmed |
| Swimming | USA Swimming | `https://www.usaswimming.org/rss` | 404 HTML; discovery still needed |
| Swimming | SwimSwam Podcast | `https://feed.podbean.com/swimswam/feed.xml` | XML response exceeds 2 MiB limit; not enabled |
| Basketball | SLAM | `https://www.slamonline.com/feed/` | 403 HTML; not enabled |
| Basketball | NBA | `https://www.nba.com/rss/nba_rss.xml` | 404 HTML; discovery still needed |

Twelve technically validated endpoints including Coaching Volleyball's initial successful response; seven remain technically blocked. All nineteen remain rights/access gated. Successful verification is a point-in-time observation, not a service availability promise.

## Runtime and operations

- Read-only `GET /api/rss-news?sport=<sport>&sources=<comma-separated catalog IDs>&topic=<optional category>`. Only known IDs within the requested sport are accepted. Empty selection returns no items. No athlete identifiers or preferences are stored server-side; all news and caches are public publisher data.
- Server-side fetches use the code-controlled catalog only. HTTPS, no userinfo, default TLS port, no IP-literal URLs, public DNS results pinned to connections, same-host HTTPS redirects only, at most three redirects, a ten-second timeout including DNS/body reads, and a 2 MiB decompressed response cap. HTTP/XML content type and first bytes are checked. Invalid XML, DTDs/entities, HTML/challenges and unsafe redirects fail closed.
- Approved feeds refresh on server startup, every 15 minutes and on reads after the publisher's TTL. Concurrent requests share one refresh. The browser refreshes every 15 minutes while its section is connected; disconnecting or switching athlete cancels future polling and ignores late responses. Refresh news rereads the cache without bypassing publisher rate limits.
- ETag/Last-Modified conditional GETs preserve snapshots on 304. Plain-text normalization strips markup, limits excerpts, removes common tracking parameters, deduplicates canonical URLs and publisher GUIDs, and sorts newest first. Undated or invalid/future articles are omitted instead of inventing dates. Up to 100 latest items are retained per publisher and per response.
- Last-good snapshots persist through an atomic rename to `var/rss-cache.json` (Git ignored). Failures preserve prior items, last success time and a stale/unavailable publisher status. Each publisher refreshes independently. Production needs a writable persistent `var` directory; multiple app instances have independent caches and schedules. No separate worker or production hosting change is introduced.
- `npm run verify:rss` repeats registry-only live validation and writes evidence to `var/rss-validation/results.json`. It never enables publishers or changes rights decisions. Its operator-only transport honors the environment proxy; the runtime transport pins DNS and connects directly. A proxy-only production host will need a separately reviewed transport configuration before activation.

## Validation

Synthetic RSS/Atom fixtures exercise the real ingestor, API and cache; browser API fixtures demonstrate enabled publishers without altering the production catalog. Review screenshots show synthetic publishers: [desktop](rss-review/screenshots/chromium-desktop.png), [iPad](rss-review/screenshots/chromium-ipad.png), [iPhone](rss-review/screenshots/chromium-iphone.png). See `test/rss-feed.test.mjs` and `scripts/qa-rss.py`. Browser evidence is generated under `var/qa-rss/`; fixture publishers and articles are clearly synthetic.

- `npm run check`: passed all syntax, data, participation and discovery checks; **251 tests passed**, including 20 RSS tests.
- `python scripts/qa-rss.py`: **4 Chromium browser tests passed**; acceptance covers opt-in and removal, categories and publisher filters, latest ordering, stale status, review-publisher preference preservation, reload, desktop/iPad/iPhone layout, retry, delayed responses, athlete switching and all four sport catalogs.
- `python scripts/qa-consolidated.py`: **8 existing Chromium browser tests passed**, including athlete workflows, reviewed-feed retry, independent SIEM, recruiting and Locked In behavior.
- `npm audit --omit=dev`: **0 vulnerabilities**.
- `git diff --check`: passed.
- WebKit was attempted twice (before and after downloading its browser). Final launch is blocked by missing host libraries: `libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libharfbuzz-icu.so.0`, `libmanette-0.2.so.0`, `libhyphen.so.0`, `libGLESv2.so.2`. Neither the managed package helper nor `sudo` exists in this environment. Chromium mobile viewport checks passed; Safari/WebKit validation remains uncompleted. Rerun `PROFILE_BROWSER=webkit npm run test:rss:browser` on a host with those libraries.

The new route is explicitly excluded from the existing server-source preservation snapshot comparison; pre-existing security, data and sport route comparisons remain exact. All protected product modules and the original candidate registry remain unchanged. No production write, merge or deployment was performed.
