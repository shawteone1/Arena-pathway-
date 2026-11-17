# AP home and build-identity review candidate

Base: `6e427754af0e8acd88a6597b5b41af6a49a30e42` (`codex/ap-recruiting-acceptance-20261117`).
Review branch: `codex/ap-home-review-20261117`. No merge or deployment.

## What changed

- Home leads with My athletes and Explore the tools, not another profile-building funnel.
- The approved Simple to use / Powerful underneath mission stays prominent.
- Four independent product cards stay ahead of the four sport selections.
- Removed the competing Discover / Grow / Connect homepage navigation, repeated development/build funnel and duplicate LockedIn promotion. Their destinations remain available through the products, sports, or footer.
- Preserved AP branding, sports images and discovery, family/profile/recruiting routes, SIEM, and the existing Soccer Center LockedIn demo link. No family data or schema migration.
- `/health` adds actual checkout commit, branch, dirty/unknown status, and process start timestamp. Start with `AP_REVIEW=1 PORT=3017 npm start` to show a review-candidate banner. This does not make a server private or publish it. Access control must be provided by the preview host.
- Metadata is read at process startup. Restart after code changes; the dirty indicator must be false and the full commit must match the intended candidate before user acceptance.

## Verification and honest limits

The existing homepage tests were updated to the new navigation hierarchy, preserving sport and independent-product assertions. A new regression checks hierarchy, no competing funnels, and the health build contract. The historical server preservation guard normalizes only the newly added build metadata field.

`npm run check` passed all 323 tests, syntax checks, data/participation validation and discovery checks. A focused post-edit rerun checks the homepage/build/route contracts.

HTTP checks confirmed a served homepage carrying the matching base commit and a truthful uncommitted-changes indicator, and four pillars before sports. This was not browser visual verification.

Browser QA is **BLOCKED**. Installed Chromium failed before opening a page with `process_singleton_posix.cc: socket() failed: Operation not permitted`, both normal execution and a reviewed escalated attempt. An independent reviewer reproduced this. No screenshot or end-to-end clicked journey pass is claimed.

Before any request for Tom to test: use a browser-capable environment, inspect desktop/iPad/phone screenshots, and click home → My athletes → create/select a fictional athlete → Profile → Recruiting → prepare/select content → preview/save → leave → return/reopen/edit. Verify retained IDs/media/stats/schedule, Back/Forward and cancel behavior. Do not substitute a deep link for the initial Profile → Recruiting entry.

This is an engineering review candidate, **not acceptance-ready or enterprise-ready**. No stable private user preview URL or host-to-commit mapping has been verified. Existing demo/provider and local-storage limitations remain.
