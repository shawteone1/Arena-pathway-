# My Feed — final cleanup and UX review

Synced from the requested feature-branch commit `51f6c4a`. Delivery stays on `codex/ap-rss-news-feed`, PR #13. No merge, deployment, production change or protected-module edit.

## Final source state

**11 retained, technically verified RSS sources; 0 enabled; 11 disabled pending product-use approval; 8 blocked/unreliable sources removed from the operational catalog.** The removed feeds were not requested during this review and have not been restored. The original candidate and historical endpoint evidence files remain archival evidence, not operational catalogs.

| Sport | Retained sources | Enabled | Disabled |
| --- | --- | --- | --- |
| Basketball | ESPN NBA, ESPN College Basketball, CBS Sports College Basketball | 0 | 3 |
| Volleyball | VolleyballMag, VolleyCountry, World ParaVolley, Asian Volleyball Confederation | 0 | 4 |
| Lacrosse | National Lacrosse League, World Lacrosse | 0 | 2 |
| Swimming | SwimSwam, Swimming World | 0 | 2 |

Removed: USA Lacrosse, Inside Lacrosse, PLL/OurSports Central, Coaching Volleyball, USA Swimming, SwimSwam Podcast, SLAM, NBA. Old athlete preferences for these IDs are preserved, but are never requested as live sources. This fixes the cleanup regression where a retired saved ID caused the read-only API to reject the entire news request. No cross-sport choices are sent or displayed.

All eleven retained feeds passed final live HTTPS/XML ingestion checks with usable dated articles. The initial pass timed out on NLL, World Lacrosse, VolleyCountry and AVC; all four passed the retry. Both attempts, exact endpoint URLs, timestamps, sizes and hashes are recorded in `data/rss-final-verification.json`. This is point-in-time verification, not an uptime guarantee. `npm run verify:rss` tests only the retained catalog and never enables a publisher.

## ESPN by sport

| Sport | Prominent destination | RSS status |
| --- | --- | --- |
| Basketball | [ESPN NBA](https://www.espn.com/nba/) and [college basketball](https://www.espn.com/mens-college-basketball/) buttons | Two verified endpoints retained; approval-gated; opt-in only |
| Volleyball | [Search ESPN Volleyball](https://www.espn.com/search/_/q/volleyball) | Explicit external search link; no ESPN RSS in this sport's catalog |
| Lacrosse | [Search ESPN Lacrosse](https://www.espn.com/search/_/q/lacrosse) | Explicit external search link; no ESPN RSS in this sport's catalog |
| Swimming | [Search ESPN Swimming](https://www.espn.com/search/_/q/swimming) | Explicit external search link; no ESPN RSS in this sport's catalog |

No basketball feed, broad ESPN feed or search results are inserted into the other sports. External search is labeled as external search, is not fetched by AP, and is never presented as an ingested feed. Standing ESPN navigation does not auto-follow a publisher or bypass the rights gate.

## Delivered UX and behavior

- Prominent ESPN destination banner, large filled article/action buttons, softer editorial surfaces, clearer headline/publisher/date hierarchy, and fewer outlined panels. Styling is scoped to My Feed; AP's logo, typography and palette remain intact.
- Existing reviewed articles remain usable. RSS publisher updates are a separate clearly labeled stream with newest-first cards, UTC publication timestamps, short excerpts, original links, last-update times and stale status. No publisher images, embedded players, full text or logo assets are loaded.
- Individual publisher choices and immediate Unfollow buttons. Publisher/category filters retain sport isolation and do not alter any recruiting functionality. Unknown classification stays under All news.
- Approval-pending RSS publishers are grouped under a collapsed disclosure; inactive reviewed publishers are behind an explicit secondary button. Disabled sources do not dominate the default view. Empty states identify the available next action.
- Refresh buttons show Refreshing while reading. Public news refreshes automatically every 15 minutes; the underlying TTL, conditional GETs, bounded XML reader, persistent last-good snapshots, independent publisher failures, deduplication and server-side allowlist are preserved.
- The existing athlete ID, profile schema and `contentSubscriptions` remain authoritative. Both reviewed and RSS source controls update the current saved list instead of overwriting each other's changes. No default follows or migrations.

## Terms review and activation blockers

The actual public terms/footers were reviewed. [Publisher terms findings](RSS-PUBLISHER-TERMS.md) and `data/rss-rights-review.json` distinguish explicit restrictions from missing grants, with source URLs, dates and separate headline/excerpt/attribution/linking findings. Public availability alone was not treated as a license. The catalog now records that review evidence while keeping every `rights.status` pending and `enabled` false.

Before activation: obtain permitted product-use scope for headlines, excerpt length, attribution/linking, suitability/access policy and caching/expiry; record approval evidence; recheck the relevant endpoint. ESPN/Disney, CBS, SwimSwam and Swimming World restrict the proposed product reuse; the other sources do not establish a sufficient public grant in the reviewed material. No outreach to publishers was sent.

Operations remain unchanged: a writable persistent `var` directory is needed for `var/rss-cache.json`. Multiple app instances have separate schedules/caches. Runtime DNS is pinned to direct connections; a proxy-only production host needs an approved compatible transport configuration. This review does not configure or deploy production.

## Test results and review evidence

| Check | Result |
| --- | --- |
| `npm run check` | PASS: syntax, data, participation, discovery and **255 repository tests** |
| `npm run test:rss` | PASS: **24 RSS-specific tests** |
| `python scripts/qa-rss.py` | PASS: **5 Chromium acceptance tests**, including actual-catalog snapshots, selection/removal, category/publisher filters, persistence, shared source preferences, retired preferences, timestamps, stale/retry behavior, delayed-response athlete isolation, all four sport catalogs and ESPN destinations |
| `python scripts/qa-consolidated.py` | PASS: **8 existing Chromium regression tests**, including profiles, media, schedules, reviewed feeds, recruiting, independent SIEM and Locked In |
| Desktop / iPad / iPhone visual checks | PASS at 1440×900, 810×1080, 390×844; no horizontal overflow; large controls; final screenshots inspected |
| `npm audit --omit=dev` | PASS: **0 vulnerabilities** |
| `git diff --check` | PASS |
| WebKit/Safari attempt | BLOCKED at browser launch: missing `libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libharfbuzz-icu.so.0`, `libmanette-0.2.so.0`, `libhyphen.so.0`, `libGLESv2.so.2`; browser downloaded but host lacks required libraries and a privileged installer |

Actual catalog with existing approved reviewed articles selected (RSS remains disabled):

- [Desktop](rss-review/screenshots/chromium-actual-desktop.png)
- [iPad](rss-review/screenshots/chromium-actual-ipad.png)
- [iPhone](rss-review/screenshots/chromium-actual-iphone.png)

Enabled interaction demonstration using **synthetic RSS API fixtures**, never an enabled production publisher:

- [Desktop](rss-review/screenshots/chromium-desktop.png)
- [iPad](rss-review/screenshots/chromium-ipad.png)
- [iPhone](rss-review/screenshots/chromium-iphone.png)

The screenshots preserve the real AP page and source-management UI. Fixture news is labeled synthetic. Transient save notifications are allowed to dismiss before capture. The page-level fixed skip-navigation link is excluded from component-only captures to avoid Chromium's tall element capture overlay; its application behavior is unchanged.

Soccer Center, SIEM, Locked In, Recruiting, athlete identity/state models, scheduling and media implementations are unchanged by this cleanup. Existing regression and preservation tests passed. No merge or production deployment has occurred.
