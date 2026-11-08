# SIEM v1 security assessment

Assessment date: 2026-11-08. Scope: local prototype, not production clearance.

## Implemented safeguards

- Existing strict asset allowlist, HTTP method limits, CSP, referrer and MIME
  headers retained. No personal-data server endpoints were added.
- Browser renders user values with DOM `textContent`; external links allow HTTPS
  only and reject embedded credentials. Original source evidence is retained.
- Domain operations require matching family, parent role and participant scope;
  sport mismatches fail. Reads filter inaccessible participants; cross-family
  correlation cannot reveal their event details through these functions.
- Recruiting and Locked In statuses require separate consent. Their publisher
  allowlists product/status metadata and drops arbitrary document/health/payment
  fields. Revoked status events are hidden by scoped reads and deleted by UI.
- The general event schema omits credentials, health measurements, medical
  documents, card data and raw product records. UI warns against sensitive input.
- No remote provider or gym can assert a connection or verified update. Provider
  writes fail closed when unconnected. No credentials are collected or stored.
- Wellness recommendations default off and are optional within SIEM. Parent
  memberships can be represented by a label or renewal deadline, without member
  numbers, payment details or health data.
- Local action/event changes, permission changes and command-center access have
  audit metadata. Whole SIEM data and individual events/parent participants can
  be deleted. My Pathway storage is separate and retained on SIEM reset.

## Material gaps / production blockers

**High: no persistent authentication, verified parental authority, server-enforced
family tenant isolation, or secure database.** All local role/context values and
permissions can be changed by anyone with browser access. Unit-tested guards
express intended authorization rules; they are not an enforceable security boundary.
There is one local family workspace per browser. Do not use real private records.

**High: browser storage is unencrypted and accessible to same-origin scripts.**
No secure credential vault exists; integrations that need secrets remain disabled.
A future backend needs authenticated sessions, family membership checks on every
read/write, row-level tenant keys, encrypted storage/backups, least-privilege
OAuth scopes, token encryption/rotation/revocation and protected audit logging.

**Medium: audit and retention are local and mutable.** These are troubleshooting
records, not tamper-resistant compliance evidence. Local data persists until deleted;
there is no automatic expiry, multi-device deletion or legal retention workflow.
The view shows the latest 40 audit entries; event history is retained locally.
Free text can contain sensitive information if entered despite the warnings.
Production needs field policy enforcement, retention limits and deletion jobs.

**Medium: scheduling is only as complete as supplied data.** No imported provider
reservation is verified. A local confirmed state is a user assertion. Timezone
and recurrence support is bounded; no background reminders or delivery guarantees.
No health inference, medical advice or fitness suitability scoring is performed.

**Medium: remote connector defenses are not implemented.** Before any connection,
add consent records and explicit approval for each external action, server-side
provider permission validation, safe URL fetching, rate limits, bounded imports,
retry/backoff, cursor durability, webhook signature verification and safe error
redaction. Keep external booking actions distinct from local calendar state.

No penetration test or formal privacy/legal review has been performed. Production
authentication, isolation and secret-storage behavior cannot be established by
prototype tests. Publication remains subject to the owner's explicit approval.
