# Draft: Reusable sports discovery and source-to-publication reconciliation

Base: `codex/integrated-release-candidate-v1` (`50ce75d`)
Head: `codex/sports-discovery-engine-v1`

Diagnoses sparse youth discovery by tracing preserved sources → normalized identity → reviewed participation → actual API → paginated HTML. Lacrosse's three youth cards are two clubs plus Mountain Recreation; volleyball's four are three clubs plus YMCA. No additional validated youth-club set was found hidden in the supplied artifacts. 3d classification, 75 lacrosse participant ownership cases, blocked RMR membership and 0/11 latest Skyline extraction are named separately from record loss. Existing Skyline squads remain retained/searchable.

Adds versioned source/expectation registries, sport/structure decision policies, configurable taxonomy, extraction plugins, evidence-linked participation graph, durable tasks/findings/history, actual publication reconciliation and refresh planning. Two configured real archive replays and an additional synthetic source/plugin test demonstrate reuse and extension without website-page code or invented club relationships.

Preserves the approved website, branding, SIEM, recruiting/Locked In experience, original research links and 513 core records. Does not inflate club totals or claim statewide completeness. Current youth organization counts remain lacrosse 3, volleyball 4, basketball 96 and swimming 109, including non-club providers. There are 15 blocked source entries, 20 missing expected rows and 95 original open classification exceptions.

Validation: 116 Node.js 22 automated tests; 20 Chromium tests; 72 category/tool API/HTML comparisons; unchanged presentation/data preservation; durable registry/audit recovery and safe archive replay tests. Physical Safari/iPhone/iPad/VoiceOver, live provider access and an operational scheduler remain unverified/unconfigured. See the diagnosis, named-missing report, QA report and runbook.

Review only. No merge, production/GoDaddy/Soccer Center modification or deployment.
