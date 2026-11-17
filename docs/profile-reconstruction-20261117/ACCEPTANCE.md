# Functional and visual/product acceptance

Scope: fictional, browser-local demonstration; engineering assessment against [approved task blueprint](BLUEPRINT.md). Founder acceptance and physical iPad certification remain separate.

| Requirement | Functional | Visual/product | Evidence and precise limits |
|---|---|---|---|
| My Athletes visual gallery | PASS | PASS | Three distinct sport cards, identity, team, season/category, Profile/Schedule, management menu; `*-family-gallery-{desktop,ipad-portrait,ipad-landscape,phone}.png`. Initials are intentional when no photo is uploaded; no fake rankings. |
| Genuine athlete profile | PASS | PASS | Branded masthead, large identity, story/background/education/achievements, featured gallery, performance/events/development rail; five tactical tabs retained. `*-athlete-profile-*`, `*-profile-with-owned-monogram.png`. |
| Independent focused edits | PASS | PASS | About, school, achievements edited in named athlete dialogs; save, return, reload; keyboard activation/focus return and iPad touch test. No giant all-fields redirect. |
| Safe removal / athlete isolation | PASS | PASS | Exact-name confirmation, cancel/wrong-name safeguards, parent guard, atomic archive, retained blobs and unrelated athlete, no stale supported-writer resurrection. Explicitly not secure erasure. |
| Recruiting workspace / information first | PASS | PASS | Athlete identity, completeness next action, preview/shortlist, focused information editors; no permission inputs on landing/information. `*-recruiting-dashboard-*`, `*-recruiting-information-*`. |
| Visual content assembly | PASS | PASS | Seven meaningful content cards and immediate private portfolio, item-level records/videos/appearances/achievements. Measured pointer-down-to-selection scroll delta ≤2px, connected focused controls. `*-recruiting-builder-*`. |
| Finished save/reopen/rebuild | PASS | PASS | Native video plays; selected school, competition, fields, media and achievements only. Save→SIEM→Recruiting→reload→edit→rebuild; durable composition and accurate review state. `*-finished-portfolio-*`, `*-saved-reopened-portfolio-*`, journey JSON. |
| Parent review / privacy | PASS | PASS | Parent/current age policy preserved; detailed review/help at end. Approval and revocation persist. Owner draft never means external sharing; strict approval still requires rules review. |
| Four sports, one implementation | PASS | PASS | Same full journey for Lacrosse, Basketball, Volleyball and Swimming; actual configured metric and college IDs logged, no UI forks. |
| College research | PASS | PASS | Sport defaults correctly; official program links, filters and existing saved IDs. Zero verified coaching contacts honestly disclosed; authenticated coach delivery unavailable. |
| Homepage hierarchy | PASS | PASS | My Athletes visible, required mission and tagline, four pillar cards before existing four sports; existing AP letterman/photography retained. `*-homepage-*`. |
| Simple directory | PASS | PASS | Searchable scrollable reviewed club results, one Location, All ages/All programs defaults, Save as My Club persists to correct athlete. Hidden compatibility params retain old links. Specific facts/unknowns replace repeated generic warning. No new records/logos fabricated. |
| Optional end times / recurrence | PASS | PASS | New Mon/Wed series produces five unique occurrences; one-time competition stays one-time; missing end means labeled estimated 60-minute duration. Existing explicit times preserved. |
| SIEM all/none/subset athletes | PASS | PASS | Three-athlete, three-sport family: all5/none0/LAX3/LAX+swim4 selected-week events; reload subset then explicit date selection; correct originating athlete route. No fixture/real-family mix. |
| Fictional messaging | PASS | PASS | Existing Rivera Slack evidence presented as fictional channel chat; sender/time/athlete/follow-up visible; draft only, no network writes; absent in real local family. |
| SIEM accepted functionality | PASS | PASS | Preserved domain/fixtures and 18 Chromium/5 WebKit regression cases. New global header initially regressed phone fold; corrected and full suite rerun. |
| LockedIn | PASS | PRESERVED | Exact unchanged URL, new-tab safe rel, no athlete query parameters; public GET200. No provider/identity/payment operation tested or activated. |
| Feeds / approvals | PASS | PRESERVED | Existing RSS5 and editorial3 per engine; sport isolation, user preferences, loading/fallback and rights boundary retained. Source registries unchanged; static reviewed snapshots not called live feeds. |
| Fresh/repeat assets / accessibility | PASS | PASS | Four sport pages and home CSS delivery; intentional CSS failure banner and retry restoration; keyboard dialog, reduced motion and target/overflow checks. This is not a full WCAG audit. |

## Presentation assessment

The rejected experience was a stack of form panels and permission rows. The new primary surfaces are original AP identity cards, a continuous editorial profile and a portfolio-first recruiting workspace. Information entry, assembly, preview and saved management are visibly different steps. Forms are focused dialogs; permissions are understandable section/item choices after information entry. Empty sections are omitted from the finished portfolio. Parents can research schools and return without losing the saved result.

Directly inspected rendered screenshots: phone family gallery, iPad story/profile, information step, content builder, finished portfolio, homepage, calendar and chat. See [COMPARISON.html](COMPARISON.html) and the linked original PNGs. This is an engineering visual PASS against the blueprint, not a claim that the founder has accepted the reconstruction or that authenticated third-party product parity was certified.

## External / production boundaries

- LocalStorage/IndexedDB only: no authenticated guardian proof, production tenant isolation, cross-device backup or durable server sync.
- Removal is disclosed recoverable local archiving, not secure erasure; arbitrary manual storage replacement/old builds are outside the supported stale-writer guarantee.
- External coach sharing, live messages, Slack posts, provider/calendar URL subscriptions and verification/payment handoffs are not operational.
- 43 reviewed college-program records; zero verified coaching contacts. Official links are the supported research output.
- Existing content approval boundary: 19 reviewed active /21 inactive candidates; 11 RSS endpoints retained, zero enabled. Zero approved publisher article images. Licensed AP sports illustration is identified as illustration, not event photography.
- Directory/ZIP coverage and coordinates remain partial; no invented distance or new eligibility facts.
- Viewport/touch emulation is not physical-device testing. Public reference pages and actual SC source were inspected; authenticated LinkedIn/NCSA/SportsRecruits/Hudl/SC private flows were not available or claimed.
