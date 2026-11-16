# Evidence-first diagnosis

Verified clean source checkpoint `f31094606124a98ef6d29d24de5dd76e9d9e2a76`. Isolated review branch `codex/ap-final-qualification-20261116`; original recovery, shared-recruiting and RSS refs preserved.

Actual current GitHub source `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`: twelve files downloaded to a separate read-only review copy and blob-verified (SC-SOURCE.json). Actual current anonymous SC demo rendered; protected parent routes redirect to login. No mockup/source-rendered fixture is substituted for an authenticated screen.

The earlier report conflated verification dependencies with demo blockers. Lack of production auth, protected external sharing, photo licenses or a physical iPad certificate does not by itself prevent a truthful local internal demonstration. A new verdict will depend on the rendered AP journeys and the new user's explicit scope.

Reproduced at baseline (BASELINE-OBSERVATIONS.json and before/):

1. Existing recruiting fields/selections survive navigation, and the owner card renders, but returning via the Recruiting pillar shows research with no obvious saved-card action. There is no explicit Build My Recruiting Profile action or completion marker. This is an interaction/completion gap, not lost athlete data (P1, mandatory recruiting gate).
2. Open local recruiting planner is visible on the canonical recruiting route even though the independent builder is already available (P2 redundant control). A previous actual screenshot also contains a pending Open builder button beside the initialized builder; source confirms a timing-dependent placeholder can remain (P2).
3. Information entry stays expanded together with all consent controls after save. SC ProfileBuilder onSaved transitions to field selection; AP needs a deliberate continue-to-selection action and a visible build action that doesn't require returning to the page top (P1).

Narrow correction: preserve the existing three-stage route, athlete data, strict projection, card renderer and consent. Add explicit owner-only completion/reopen metadata/action; a continue-to-selection control; retire redundant controls from the canonical route; retain legacy notes through existing module controls. No new recruiting workflow, sharing backend or source activation.

Other initial findings: one Location selector already exists and age defaults to All ages. Source-backed club program/location facts exist, but a self-description/logo and current registrations may not be verified. Their absence must be classified as content/rights coverage, not filled with invented content. Calendar recurrence and competition media are preserved pending fresh journeys.

4. Actual rendered My Feed inspection found both the loaded illustrative photo and the original typography cover visible on each story. Root cause: the asynchronous photography helper prepended a figure but never suppressed the existing editorial fallback. Narrow correction: mark a successfully loaded photo and hide only its sibling fallback; clear the marker when photography fails, preserving the original fallback and all rights checks. Before evidence: before/feed-duplicate-cover-ipad.png. Regression asserts one visible cover when loaded and a visible fallback on forced 404.

Test diagnostics retained: the first new Chromium run waited for a deliberately hidden SIEM scenario selector; corrected to attached-state readiness. WebKit completed all four sport lifecycles but emitted a navigation-cancelled RSS-request diagnostic at teardown; a fast retry had a weekday click-state failure while asynchronous portrait work was settling. Five focused original weekday probes passed; a CSS A/B injection was blocked by CSP and does not establish a CSS root cause. No recurrence/CSP implementation was changed. The final harness awaits actual portrait/news readiness before navigating and preserves the same strict error/state assertions. A legacy Nov12 test counted inactive supplemental RSS choices among the original five reviewed sources: now scopes the original five exactly and additionally asserts zero enabled RSS sources. These are recorded harness findings, not hidden application fixes.

Subsequent portrait/weekday probe: ten current smooth-scroll trials and ten temporary instant-scroll trials all selected Mon/Wed correctly. No CSS root cause was established and no speculative schedule/scroll change was made. Final complete Chromium/WebKit journeys pass with actual readiness waits and unchanged strict error assertions.
