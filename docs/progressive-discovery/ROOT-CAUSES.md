# Progressive discovery: publication bottleneck

Base: `codex/live-qualification-recovery`, `9157faa660b28ceb69100595ebd2ed6b4da52ad8`. Review branch: `codex/progressive-sports-discovery`. Assessed November 10, 2026.

The consumer directory did not consume the prior recovery build's scoped organization review receipts. `src/unified-directory.mjs` grouped only verified participation programs from `data/unified/catalog.json`. Thirteen newly reviewed Colorado/youth organizations remained in recovery sidecars; organization identities without a named program had no join into the public read model. Two older approved portfolio organizations were also missing from that model. The prior acquisition eligibility gate further combined organization identity, geography, youth evidence and a dated current offering.

The existing default consumer query did **not** explicitly require open registration. Describing registration as its sole cause would be incorrect. The missing read-model bridge and program-only join were the main publication bottlenecks.

## Corrections

- Compile source-bound prior reviews into an additive, independently validated organization-verification packet. Reuse canonical IDs and exact source versions/hashes. Preserve the old catalog.
- Permit reviewed organization records to render with zero programs and zero teams. Add only actually named, source-supported programs.
- Keep identity/sport/geography, published youth participation, named programs, current seasons and available opportunities independent.
- Default Youth requires published youth evidence. Organization-only Kings remains unclassified and accessible through the explicit **All verified organizations** filter, with youth unknown. This is not youth qualification.
- Registration and current-season filters require their own positive facts. Unknown registration remains selectable; a missing registration page does not hide an organization.
- Resolve aliases without treating schedule opponents as owned teams. Denver Lacrosse Club reuses its canonical ID; its 56 legacy schedule participants are not assigned to the club.

## Ranked remaining discovery failures

1. **Source selection and bounded traversal explain 6/6 fresh identity misses.** Generic results and national pages exhausted the frozen 36-source budget before the six publishers were reached. The linked frontier is retained, not declared complete.
2. **Access prevents primary reference checks for 5/6 cases.** HTTP 403 or unverifiable robots rules block the separate reference checker. This overlaps with the first cause; it is not proof the discovery runner reached those publishers. Colorado Valkyrie's reference page is accessible but was not reached by discovery.
3. **Extraction specificity and navigation noise remain unresolved.** Final extraction contains national clubs, historical national-team news and even a linked hockey program. These are unreviewed candidate rows, not Colorado organizations. The configurable member-link adapter and ranked links are foundations, not evidence of successful full directory capture.
4. **Evidence/review/publication necessarily fail downstream for all six fresh cases.** No primary identity record arrived, so no Colorado youth qualification or new public listing can be justified.

The title parser now selects the document head title instead of concatenating embedded SVG titles. This permits a literal, source-bound Kings identity/sport/Colorado review; it does not establish youth participation.

No restricted site was bypassed, no benchmark answer URL was inserted into acquisition, and no threshold was lowered. Supported next steps are reviewed association member links, permitted owner exports/APIs, or accessible official club/municipal publications. A third-party directory can identify candidates but cannot alone prove Colorado youth participation or current membership.
