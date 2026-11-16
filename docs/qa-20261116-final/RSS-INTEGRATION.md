# RSS PR #13 — integration review

Verified GitHub PR #13 is open, head `1730221a163f7cfe32a40d2c31c371275018c0f5`, base `codex/ap-rss-source-registry`. The remote feature ref matches that SHA. It is not based on the current product-completion checkpoint.

## Recommendation: preserve the existing port; do not merge automatically

The product-completion checkpoint already ports the RSS reader, client adapter, catalog, verification and rights records. All seven relevant files have exactly identical Git blobs to PR #13 ([RSS-BLOBS.json](RSS-BLOBS.json)). A second feed engine is neither needed nor proposed. No merge or cherry-pick was performed in this review.

The current branch additionally preserves newer source-preference union behavior (reviewed and future live choices), safe failed-image rendering, revisioned local assets, stronger CSP and no-store RSS responses. Replacing those files wholesale with the older branch would risk regressions. If the PR is reconciled later, retain these newer behaviors and the current athlete/SIEM/directory code; review the full branch diff rather than treating PR #13 as a clean change against this checkpoint.

## What it does and does not resolve

- My Feed has a featured story, source chips and responsive image/text editorial cards. The existing licensed AP sport photographs are explicitly marked illustrative, not article photographs, with credits. Broken images leave readable editorial fallbacks.
- Public sport news uses intentional sport/category typography, headline, publisher, reviewed date and summary. It does not pretend unrelated sport photographs depict a reported story. This review corrects low contrast in the public fallback caption and prevents a loaded My Feed photo from stacking with its typography fallback. Photo failures still restore the fallback.
- RSS media/enclosure metadata can identify an image URL; it does not establish republication rights. The rights boundary remains in place. There are **zero approved publisher article images** available through this review.
- The existing reviewed registry remains **19 approved / 21 inactive** out of 40. The supplemental RSS catalog retains **11 candidates, zero enabled, 11 pending permission**; eight previously retired candidates remain absent. Neither ESPN nor another publisher is silently activated.
- Reviewed snapshots remain labeled snapshots. Test-only synthetic feed fixtures verify the live adapter; they are not evidence of an enabled production publisher feed.
- User source choices, sport isolation and original publisher links remain authoritative. News, Development and family-uploaded Media remain separate.

## Integration risk

The functional port is already compatible and tested within the current application. PR #13 alone does not authorize image use or make a live feed active. A blind merge from its older base is unnecessary and unsafe without resolving newer application differences. Athlete IDs, SIEM projections and directory records are outside this narrow review's code changes. Full browser regression results are recorded in REPORT.md; this recommendation is not merge authorization.

## Specific overlapping files

Direct comparison of PR head1730221a to checkpointf310946 (not an attempted merge) finds newer changes in `public/content-library.js` (17 changed lines, source-choice union/current rendering), `public/news-editorial.js` (5 changed lines before this review's additional cover fix), `server.mjs` (8 changed lines, asset/cache behavior), `src/views.mjs` (23 changed lines, current layout/assets), and `public/recruiting-builder.js` (60 newer lines). These must not be overwritten with the PR versions. The seven reader/registry files are identical; there is no outstanding reader-port conflict to resolve. No merge simulation was performed, so this is a file/behavior compatibility review, not a claim that Git would report textual conflicts.
