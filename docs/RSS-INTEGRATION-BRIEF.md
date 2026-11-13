# Arena Pathway RSS ingestion implementation brief

Status: candidate registry staged on `codex/ap-rss-source-registry`; **no live RSS ingestion, UI changes or deployment**. Source file: `data/rss-source-candidates.json`.

## Intended product behavior
- **My Feed** in each athlete's selected sport uses publisher-by-publisher opt-in. Do not auto-follow any publisher. Sports are completely isolated; no cross-sport content leakage.
- Keep existing reviewed-content resources active until RSS candidates are validated. New content appears only for the chosen athlete and selected sport.
- Offer topic controls for professional, college, national/Olympic, youth, recruiting, development, podcast where item classification is supported. Show source, timestamp, short summary, original article link.
- News links open on the publisher's site; no full-text scraping or unauthorized image hotlinking.
- Make publisher/source switches accessible on phone and tablet with large tap targets.

## Implementation acceptance criteria
1. Verify candidate URL is HTTPS and XML RSS/Atom (not HTML, anti-bot challenge, a login page or feed-directory landing page). Follow safe redirects and inspect content-type and first bytes. Reject local/private addresses, userinfo and off-domain redirect targets to prevent SSRF.
2. Server-side fetch only, with limited response bytes, timeouts, bounded redirects and conditional GET where supported. Do not proxy arbitrary URLs supplied by the browser. Approved feed URLs must be allowlisted in the source registry.
3. Normalize id/guid, title, URL, excerpt, author (when available), publication timestamp and publisher. Sanitize HTML and strip tracker parameters from article links. Deduplicate by canonical item URL or GUID.
4. Cache a last-good snapshot per publisher; mark stale feeds and surface their last successful refresh. If a publisher fails, other feeds and existing reviewed content still work.
5. Only publish feeds with rights/access review completed. Do not rely on third-party aggregators as if they are official publisher feeds.
6. Preserve existing `contentSubscriptions` athlete profile settings and explicitly opt-in to new RSS publishers.
7. Add tests for valid RSS and Atom, 403/HTML fallback, timeout, unsafe redirect, duplicate GUID, unsorted timestamps, empty selection, stale cache and cross-sport isolation.
8. No changes to Soccer Center production, Locked In, recruiting, or SIEM behavior.

## Next coding phase
Introduce a verified-feed catalog and ingestor, cache and read-only API, then My Feed rendering and publisher choice management. Demo using fixture feeds first; activate real feed URLs only after validation. Keep changes review-only until user approves deployment.
