# PlayRcmd portfolio exchange contract v1 — FICTIONAL DEMONSTRATION

## Inspected sources and boundaries

- PlayRcmd/AP source baseline: `9c93e2dd4f2087aec5e6bd185a91bbd585191efe` (review candidate), original three-role source `482dc32063176562898dd52c0875c37d17fd545e`.
- AP: `public/state.js` (`cleanProfile`, identity/guardian/modules), `public/recurring-plans.js` (`normalizePlan`, `expandPlans`), `public/local-family-calendar.js`, `public/siem-model.js`, `public/siem-platform-model.js`, `public/playrcmd-roles.js`.
- Soccer Center reference checkout: `shawteone1/Soccer-Center`, commit `11de067414e63c5d3e3e221dfc14cc026dfbd8d0`. Inspected `src/server/db/schema.ts`, parent profile/family/player schedule endpoints and `src/server/lib/coach-projection.ts`, `coach-profile-fields.ts`, `src/lib/portal/coach-sharing.ts`.

These are pinned source references, not a statement about a live database's deployed schema. SC/AP are independent products; this demonstration contacts neither one. Existing profile/role/recruiting engines are not copied or changed.

## Canonical, selectable projection

Envelope: `schemaVersion:1`, provider (`soccer-center` or `arena-pathway`), stable `externalId`, `profileType`, `mode:fictional-demonstration`, and `data` containing only fields below. The current adapter factories return curated fictional records. They do not accept a login, token, live URL, database row ID or arbitrary remote response.

| Canonical field | Soccer Center reference | Arena Pathway reference | Handling |
| --- | --- | --- | --- |
| displayName | `sc_player_profiles.label`; owner-scoped projection key `label` | `profile.nickname` | Explicit checkbox; known local subject required; text capped at 100/60 chars. No matching by name alone. |
| sport | SC player example is soccer; no invented multi-sport SC SQL field | `profile.sport` | Whitelisted sport display metadata; never an authorization grant. |
| teamName | `sc_player_affiliations.orgName`; directory reference `orgKey` may identify a team | `profile.clubTeam`; SIEM's explicit teams/organizations remain the scope authority | Selected primary affiliation display only. Importing a team name never adds a real organization membership. |
| position | `sc_player_profiles.primaryPosition` | `profile.position` | Optional; not offered to Coach associations. |
| parentDisplayName | `sc_parent_profiles.displayName` | Local family participant display name; no assumption that AP has an equivalent production SQL table | Parent role only, explicit checkbox/guardian approval. No email, address or contact details. |
| schedules | `sc_calendar_events.uid,title,startAt,endAt,eventType,status,location` (owner/feed-scoped) | Existing `profile.plans` (`id,name,start,end,startTime,endTime,repeat,...`) expanded with the ORIGINAL `expandPlans` | Timed fictional snapshots only. Stable UID/occurrence identity, UTC instants, selected local team/subject, existing SIEM contract validation. No subscription or background fetch. |

SC's team directory fields `sc_teams.id/importKey/organizationKey/displayName` are references, not proof that the parent or coach belongs to that organization. SC's `sc_calendar_events.id` may change on sync; use the upstream UID/feed identity, not refreshed row UUIDs, for production duplicate detection. SC `sequence` and update/version metadata need production optimistic-concurrency validation.

AP plans retain their original recurrence engine. This adapter does not implement another scheduler. The demonstration's AP fixture uses a valid `profile.plans` record; its occurrences come from `expandPlans`. Untimed/all-day/provider subscription behavior is not production-qualified here; the supplied examples are explicitly timed. Existing manual/ICS tools keep their bounded input contract, including rejection of unsupported TZID/floating/recurring ICS syntax.

Coach records represent the coach's OWN fictional coaching association and its team schedule; no private athlete profile is exposed through a coach workspace. The SC-shaped actor label for a coach is a **proposed canonical extension**, not a claim that `sc_player_profiles` stores coaches or that an existing SC coach-write API is qualified. Actual coach-account/profile API mapping needs separate validation. Destination sport vocabularies also require validation: the canonical demo supports soccer, but this does not claim that every AP profile API supports soccer.

## Explicit exclusions

No DOB/birth year, contact email/phone/address, health or identity documents, payments, internal user/family IDs, authentication material, recruiting permissions, academics, private notes, media or coach-share tokens are imported or exported. A schedule is not a parent authorization or proof of team membership. Unknown fields are dropped; unknown selected field names are rejected.

The SC coach projection explicitly excludes private birth/contact/calendar/Locked In data; this demo does not treat that projection as permission to fetch those categories. Its schedule mapping describes a separately owner-authorized endpoint, not a coach token. No token-scoped athlete/coach response is broadened.

## Pull

1. Show current local information and the chosen curated provider example.
2. Choose an existing, locally authorized athlete/team association. New local associations can be added through setup first.
3. Select fields (none preselected).
4. Preview before/proposed values. Nonempty conflicts default to KEEP EXISTING. Applying a proposed conflicting value is an explicit per-field choice.
5. Approve the fictional transfer; parent role additionally requires guardian approval. Athlete self-sharing of an under-18/age-unconfirmed local association is blocked; use a parent-managed workspace.
6. Save only selected values as browser-local snapshot metadata, with provider/external-ID/field provenance. Schedules upsert by stable provider/UID + local subject/team identity; unrelated fixture/manual activities are preserved.

Source ownership is retained per imported field. Editing a local association marks its display name/sport/team as local/manual, rather than continuing to attribute those values to the provider. Import is a snapshot, never synchronized status.

## Push / link / update

Destination records are mock canonical projections stored INSIDE the existing role workspace. They are not database rows or network requests. This proves approval UX, not a production SC/AP write API.

- Create: deterministic provider/owner identity (one coach identity across teams); an already mapped subject cannot create another destination profile. A disabled existing-profile selection cannot redirect Create into an existing record.
- Link: explicit destination sample selection and identity attestation; no profile fields are written. One local subject maps to one mock destination per provider, and an existing record cannot be reassigned to another subject.
- Update: requires a prior approved link. Only selected fields are proposed; existing destination values win unless the user explicitly chooses the proposed value for each conflict.
- Changing the selected coaching team cannot create a second provider profile for the same coach. Names alone never merge or overwrite profiles. Linking/updates to another role/subject/team are rejected.

Preview is bound to workspace revision AND a content fingerprint, so even older writers that do not increment the revision invalidate a stale preview. Approval revalidates scope, allowed fields and the canonical payload. One bounded receipt is stored; no network transfer occurs. Receipts say `SIMULATED · No external system changed`.

## Rollback and reset

The last approved simulated transfer records one non-recursive before-state inside the same role workspace. Undo restores that state only if no intervening change occurred (revision + content fingerprint); otherwise it fails closed and asks for review. It does not recall any external information, because none was sent. Receipt history is bounded to 10.

Reset guided setup removes only that role's guided configuration, simulated transfer metadata and guided/imported entries. Existing builder records are preserved. The ORIGINAL Reset this role control clears only the active PlayRcmd role prefix and restarts first-launch setup; other roles and native AP/SC stores remain separate.

## Storage and connection states

No database or backend added. Existing `playrcmd.role.<kind>` workspace now carries `setup`, `exchange` and `revision` metadata alongside entries/plans/drafts. In-browser `adapter.js` already scopes this key under `playrcmd.demo.v2.<role>.`; no access is made to other products' native localStorage or other origins.

- Connected / synchronized: **none**, explicitly shown.
- Imported snapshot: selected fictional values with source provenance; no ongoing sync.
- Linked external system: **simulated identity reference only**, no authenticated account.
- Fictional demonstration: all supplied people/provider records, notifications and destination receipts.

The existing family builder is read in-place ONLY after opt-in. Its existing `localFamilyCalendar` projection validates source records; the PlayRcmd adapter binds the resulting records to a private demo-owned context without moving them or altering source storage. It does not grant access to an external organization's real records.

## Production requirements — not implemented/approved

- Official APIs and contracts/versioning for each product, with provider-specific inbound AND outbound validation against the deployed schemas.
- Authenticated OAuth/OIDC/account linking; server-side subject/tenant/parent/team authorization and independent age/guardian checks. The demo's local roles and confirmation boxes are NOT production authentication/security boundaries.
- Purpose/field-scoped consent, proof of parent authority, least-privilege access and independent Recruiting/age restrictions enforced server-side. Never import permission flags as authority.
- CSRF/replay protections, short-lived signed transfer plans, idempotency keys, optimistic concurrency/ETags, audit/retention, revocation and incident handling.
- Verified timezone/all-day/recurrence semantics, stable UID/feed scope and deletion/version reconciliation. Do not silently treat tentative or missing provider data as verified.
- Destination-owned field policies, reviewed conflict handling, destination-specific rollback/compensation and deletion/consent policies.
- No production integration may be inferred from the fictional destination receipts or browser-local permissions.
