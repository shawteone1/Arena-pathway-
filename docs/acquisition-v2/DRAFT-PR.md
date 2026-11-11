Title: Add evidence-based acquisition operations and expose failed live discovery gates

Base: codex/sports-discovery-engine-v1
Head: codex/sports-data-acquisition-v2

Colorado directory counts previously reflected a small reviewed publication set rather than comprehensive acquisition. This additive change preserves that catalog and all consumer experiences while introducing a versioned acquisition ledger, configurable source jobs/adapters, bounded traversal, reviewed identity resolution, evidence-bearing candidate graph, incremental refresh, cold-cache snapshot restoration and a private read-only quality console.

Live prescribed RMR retrieval remains blocked (403). An alternate mixed-state directory captured 102/102 scoped entries. The sealed lacrosse held-out trial reached 0/6 identities; volleyball reached 6/6 identities but 0/6 qualified youth records. No new consumer records were published. Global precision, classification accuracy and statewide completeness are not established. This PR is an operational foundation with explicitly failed discovery acceptance, not launch approval for open-ended discovery.

Validation: 132 Node.js 22 automated tests; 23 desktop/tablet/mobile browser checks; 11 controlled refresh scenarios. The live acceptance command intentionally fails. See LIVE-RESULTS.md, TEST-REPORT.md and RUNBOOK.md for evidence, limitations and remaining blockers. No scheduler, live provider connections or deployments are claimed.
