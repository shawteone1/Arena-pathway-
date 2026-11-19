# PlayRcmd — three-role founder-review candidate

November 19, 2026 · **Ready for hands-on founder review before Monday, November 23.** Local only; not pushed, merged, deployed or published.

Branch: `demo/playrcmd-three-roles-v1`, created from the verified local and GitHub PlayRcmd head `0798ee2043785665ac4de64faa67e138b321ff65`. The implementation commit includes this report; obtain its exact SHA with `git log -1 --format='%H'`. No Arena Pathway, Soccer Center or LXDiN deployment was changed.

## Open the candidate

The running local preview is **http://127.0.0.1:4310/**. The prominent landing CTA opens **http://127.0.0.1:4310/roles**.

| Role | Direct entry | Working experience |
| --- | --- | --- |
| Parent & Family | `/demo?scenario=family` | Original Rivera family, three athletes and multiple sports; day/week/month calendars, filters, changes, messages, priorities, guided tour, fictional setup and public opportunity references |
| Athlete | `/demo?scenario=college` | Sam Taylor's fictional college timetable, team schedule, workouts, work, travel, competition, personal commitments and player opportunity example; manual recurrence, ICS import and optional separate AP profile/recruiting entry |
| Coach | `/demo?scenario=coach` | Morgan Lee across separately scoped club basketball, high school lacrosse and college lacrosse teams; consolidated calendar, organization/team filters, notices, actions, fictional credential renewal, official education resources and saved local session plans |

If the process has stopped, run `npm ci --ignore-scripts` from the repository root, then `npm --prefix playrcmd start`. Review remains loopback-only on the separate configured PlayRcmd port. An optional AP regression server was run separately on port 4320; PlayRcmd does not require it.

## What changed

The existing PlayRcmd brand and landing page are retained, with the primary CTA now leading to three premium role cards. Each role has direct navigation, a personal command center and an independent reset. Athlete and coach views use role-specific wording and coach-team color cues. Existing platforms are explicitly identified as the systems of record; PlayRcmd organizes information and demonstrates next steps without replacing registration, scheduling or messaging services.

A role-tools dialog adds bounded manual entry, UTC ICS file snapshots, an explicitly fictional notification lab, local message drafts and a read-only Network view. The coach also has a simple team-scoped session-plan notebook with save/delete/reload behavior. Profile creation and recruiting are never prerequisites.

The PlayMetrics practice-change and TeamSnap reminder examples expose source, sample sender/time, explicit team/athlete match, existing event identity, new time/location or reminder, next action, and provider-home links. A confirmation is required before applying a local simulation. The adapter updates the **same** normalized event identity, derives changes/priorities through existing SIEM rules, and rejects replayed notification IDs. It does not claim mailbox access, a universal email parser, authenticated deep links or any sending capability.

## Shared foundation and preservation

[Component reuse map](REUSE.md) · [Source-integrity proof](source-integrity.json).

**All 282 pre-existing AP source, public, engine and data files checked are byte-identical to the verified PlayRcmd baseline.** This includes the SIEM controller and models, original role/family fixtures, calendars, directory engine, source data, AP server and package contracts. No historical source-pin guard was weakened.

The PlayRcmd server composes a narrowly guarded host-loading boundary into the served controller response. The shared source file itself is untouched; AP's server continues to serve its original controller. No whole scheduling engine is copied into this package. New role fixtures, form orchestration and storage adaptation call the existing normalization, permission, calendar, action, recurrence and ICS functions.

All new local examples, notification overlays, drafts and session notes use existing browser Web Storage under `playrcmd.demo.v2.<role>.`. Reset clears only the selected role's namespace. Original AP storage and the earlier PlayRcmd v1 namespace remain untouched. These scopes demonstrate isolation; they are not authentication or a production security boundary.

## Verification

| Actual check | Result |
| --- | --- |
| Full `npm run check` — syntax, source/data/participation/discovery checks and Node suite | **327 passed, 0 failed** |
| PlayRcmd Node tests, included above | **7 passed**: routes/assets, fixture preservation, scope, recurrence/import, notifications, plans, network projection and guarded host composition |
| Three-role interaction QA | **24/24 flows passed**: 3 roles × desktop, iPad landscape, iPad portrait, phone × Chromium/WebKit |
| Retained family walkthrough/setup/import regression | **8/8 viewport/engine flows passed** |
| Original AP family Chromium browser suite | **18/18 passed** |
| AP WebKit startup, legacy listeners, modes, evidence/approval/privacy and asset recovery | **5/5 passed** |

Actual engines: Chromium **151.0.7922.34** and Playwright WebKit **26.5** using the previously qualified user-local launcher. These are genuine engines, not a Safari user-agent spoof. Physical iPad/iPhone and Apple Safari hardware were not available.

The final three-role flows exercise actual role selection and switching, all three calendar views, athlete/team and organization filters, recurring entry/update, valid and unsupported ICS inputs, import deduplication, notification matching/approval/replay, changes derived by the shared model, multi-team local drafts, official-resource/empty-opportunity states, plan save/reload/delete, unauthorized-record exclusion and namespace-only reset. All 24 report zero page errors, failed HTTP responses and unintended external requests. Responsive screenshots were inspected; no horizontal document overflow was found. The 30-second comprehension target is a founder acceptance check, not a claimed timed usability study.

[Final browser records](browser-results.json) · [Final browser log](logs/browser-verified.txt) · [Full automated log](logs/automated-verified.txt) · [Family regression](logs/family-regression.txt) · [AP Chromium](logs/ap-family-chromium.txt) · [AP WebKit](logs/ap-webkit.txt) · [Actual screenshots](SCREENSHOTS.md).

Earlier exploratory logs remain under `logs/`: an initial in-place host prototype hit AP's source-pin guard, so composition was moved into the isolated PlayRcmd server; an initial browser URL assertion incorrectly assumed the shared controller would not add mode/section query parameters. The corrected harness checks the scenario parameter and retains actual navigation/ready-state assertions. Neither initial failure is counted as passing. No automatic retry loop or page-error suppression was added.

## Sources, external links and honest gaps

The Network view calls the existing reviewed directory/program and opportunity infrastructure; it does not scrape, ingest or manufacture a second sports catalog. Public organization/program facts and original published tryout/camp dates retain official URL and review attribution. They are labeled **reviewed snapshots, not live availability**, and are kept separate from the fictional May 6–12, 2030 week.

The current snapshot has no verified showcase/tournament records for the exposed categories and no dated Colorado coaching vacancies. Those states say so. Coaching jobs and education views offer official references, not fabricated openings or scheduled courses. Current availability, fees, eligibility and credentials must be confirmed at the originating organization. The NFHS official site returned HTTP 403 to this environment during read-only verification; the valid official reference remains labeled as requiring confirmation.

Soccer Center, Arena Pathway and LA02UK links are preserved exactly and returned HTTP 200. TeamSnap, USA Lacrosse and CHSAA returned 200; PlayMetrics returned 200 after redirect to its official app entry. These are navigation links, not active integrations. [Destination checks](link-checks.json).

No actual PlayMetrics/TeamSnap email files were supplied in this task. The lab uses clearly labeled representative structured examples grounded in the retained family scenario, not a claimed verbatim rendering or general-purpose parser for observed private mail. Validate representative redacted/provider-approved examples before implementing a real importer.

## Remaining production work

- Provider-approved interfaces, account consent, permissions and tenant authorization; platform agreements and secure token handling before any live synchronization or sending.
- Production persistence, audit/retention controls, authenticated organization access and sensitive-data safeguards. No sensitive real athlete data belongs in this browser-local demo.
- Approved notification parsing/matching, ambiguity handling, provider message/event deep links, robust synchronization, failure recovery and production deduplication guarantees.
- Broader verified opportunity coverage and freshness, especially Colorado jobs, tournaments, showcases and current education schedules.
- ICS limits are inherited: 500 KB / 500 events, explicit UTC times; no recurring, floating, all-day or TZID imports. Manual weekly expansion is limited to 1–12 occurrences. Reuse the same reference and count to update a series; series resizing/deletion and advanced timezone recurrence are not added here.
- Fixture actions remain in page memory as in the original controller; role entries, drafts and plans persist locally until reset. No cross-device sync or account claims.
- Club administration/integrations and advanced training remain **Coming Soon**. Optional profile/recruiting links open the separate AP entry without transferring fictional athlete records.
- Physical Safari/device checks and founder sign-off are still needed. Earlier unrelated historical AP suite limitations remain documented in the prior qualification; this pass does not claim to repair them.

## Founder acceptance checklist

- [ ] From the landing CTA, choose each of the three roles without visiting AP or Soccer Center.
- [ ] Within 30 seconds in each role, identify the next commitment, an important change and the highest-priority action.
- [ ] Switch day/week/month; isolate an athlete or coach team/organization, then restore all commitments.
- [ ] Add three weekly fictional commitments, save again with the same reference/count, import a UTC ICS sample and confirm no second copy on reimport.
- [ ] Confirm a PlayMetrics practice-change match and a TeamSnap reminder; inspect the resulting calendar/action update, then replay one to see duplicate prevention.
- [ ] Save a draft for one team and a coach session plan for another; verify nothing is sent and other roles cannot see them.
- [ ] Explore sourced clubs/tryouts/camps and honest empty/official-resource states; confirm the systems-of-record positioning and Coming Soon boundaries are clear.
- [ ] Reset each role, confirm clean fictional starting data, and verify the ecosystem links remain secondary and intact.
