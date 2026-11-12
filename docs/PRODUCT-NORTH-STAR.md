ARENA PATHWAY

Product North Star & Architecture Charter

Version 1.0 — November 8, 2026

Status: Approved product direction. Governing reference for future builds.

1. Mission

Arena Pathway brings enterprise-level intelligence, organization, efficiency and modular functionality into everyday sports and family life.

Brand tagline: Your sport. Your path. One place.

Product philosophy: Powerful underneath. Simple everywhere else.

We are not building another sports directory, recruiting website or messaging platform.

We are building a configurable sports and family operating environment that consolidates information, simplifies participation, supports development, and makes the next action clear.

Our core product question is:

Does this make the user’s life easier?

2. Two entry pathways

A. Assigned / Aligned Sports

Four initial dedicated sport environments:

* Lacrosse
* Volleyball
* Basketball
* Swimming

Colorado statewide first, followed by national expansion.

Each sport provides organized clubs, teams, leagues, schedules, tryouts, camps, community programs and development opportunities.

B. Build Your Own Pathway

A personalized experience based on the user’s sport, interests, goals, location and desired modules.

Recruiting, media and development are selected independently. Saving a club never automatically activates recruiting.

Neither entry pathway requires use of every commercial product.

SIEM must also be directly accessible without requiring either sport pathway or a full athlete profile.

3. Four independent commercial pillars

Profile

Family and athlete sports profiles, relevant content, schedules, media and development. Profile is independent of Recruiting.

Release-candidate decision, November 12, 2026: Profile, SIEM, LockedIn and Recruiting are the four independent pillars. LockedIn is Coming Soon in AP; no verification or document service is implemented.

SIEM — Sports Information, Events & Management

The family’s one-pane-of-glass management platform.

Consolidates multiple children, calendars, sports, clubs, communications, responsibilities, alerts and actionable events.

SIEM is independent of recruiting profiles.

Recruiting

An optional, parent-controlled recruiting extension that reuses approved athlete information.

Combines LinkedIn-style identity and networking with CRM-style relationship tracking, college/program research, recruiting activity, media, performance information, showcases and development opportunities.

Explore ZoomInfo-style program intelligence only through properly licensed or publicly authorized data sources.

Recruiting is optional and not a prerequisite for SIEM.

Locked In

Secure verification, documentation and onboarding.

Supports authorized identity/age verification, administrative workflows, document handling, payment-provider handoffs and status reporting.

Sensitive data remains within authorized systems. SIEM receives only necessary status and action metadata.

Commercial rule: All four pillars must function independently or together. Customers choose the capabilities they need, subject to eligibility and organization-sponsored access. Switching optional modules off preserves underlying information.

4. Shared identity, not mandatory profiles

Separate:

* Family account and parent permissions
* Lightweight child/athlete association
* Optional LinkedIn-style sports profile
* Optional recruiting profile
* SIEM connections and family events
* Locked In verification and onboarding state

Link related records through stable identifiers rather than duplicating sensitive data.

SIEM onboarding requires only the information necessary to connect and correlate authorized sources.

Do not demand recruiting fields, athlete biographies, statistics or graduation years to use family scheduling and monitoring.

5. Sports-data architecture

Follow Soccer Center’s directory and source-validation principles.

All four sports must distinguish:

* Youth Clubs & Programs
* High School
* College
* Adult Leagues
* Semi-Pro / Professional where applicable
* Community & Recreation

Youth participation is the primary discovery experience.

Maintain canonical relationships between organizations, programs, teams, leagues, divisions, seasons, schedules, facilities and events.

One organization profile may contain multiple age-group teams. Do not duplicate the club as separate top-level listings.

Sport-specific distinctions:

* Swimming: Year-round, seasonal, summer league, high school, college and Masters
* Volleyball: Club-first, boys/girls, indoor/beach, age-group teams nested underneath
* Lacrosse: Youth, high school, college and adult; field/box and participation levels
* Basketball: Youth clubs/select/feeder, community recreation, school programs and older categories separately

Use official associations, club websites, tournament participation and competition schedules to discover underlying organizations and teams.

Never stop after finding one club or a directory gateway.

Every source needs provenance, review dates, classification, freshness and coverage checks.

Unknown information must remain unknown. Incomplete imports must never be presented as complete.

6. SIEM — one pane of glass

SIEM must answer four questions:

1. What is happening?
2. What has changed?
3. What needs my attention?
4. What can I do next?

Primary functions:

* Family overview
* Multiple children and sports
* Consolidated calendar
* Communications summary
* Prioritized action center
* Connected-systems status
* Saved activities and relevant opportunities

The interface must emphasize decisions and actions, not raw notification volume.

7. Integration philosophy

Connect once. Consolidate what is available. Make it actionable.

Prefer supported, familiar integration methods:

* Authorized email connections
* ICS/iCal calendar subscriptions
* Club-published schedules and announcements
* Official provider APIs
* Permitted exports
* Supported webhooks
* Approved notifications

Priority providers include PlayMetrics, TeamSnap, SportsEngine, Teamworks, Google, Microsoft and relevant club platforms.

The parent should not need to understand API credentials or technical feed formats.

An email address is an identifier, not authorization to retrieve account data.

Use secure OAuth or another approved authorization method.

Support multiple family members, accounts, teams and providers.

Private app-only chats must not be treated as accessible without a verified provider integration.

Every connection must show its real status, supported data types, last synchronization, errors and disconnection controls.

8. Events, communications and action management

Normalize source events with:

* Source/provider
* Family/athlete/team association
* Event type and time
* Original event reference
* Change history
* Verification confidence
* Required action
* Priority and resolution status

Detect duplicate messages, schedule changes, cancellations, conflicting events and approaching deadlines.

Ambiguous child/team mappings require parental confirmation.

Users may choose supported notification destinations, including email, Slack and approved messaging integrations.

SIEM remains the system of record for actions. Do not distribute sensitive family or athlete information unnecessarily into shared groups.

AI proposes; the parent approves.

9. Simplicity and usability

Every release must meet these principles:

* Useful within minutes
* Minimal onboarding
* Progressive disclosure
* No redundant data entry
* Clear, predictable navigation
* Familiar interactions
* One obvious next action
* Accurate, source-backed information
* Mobile-first usability
* Independent feature activation
* Easy connection and disconnection
* No unnecessary technical language

Do not add a feature solely because the architecture supports it.

Avoid excessive navigation and dashboards that create more work for the user.

10. Design identity

Preserve the approved Interlocked AP Letterman Patch logo and v0.7 collegiate visual language.

The Arena Pathway landing page is an umbrella brand experience with stadium imagery, not a sport-specific homepage.

Sports selection includes:

* Lacrosse
* Volleyball
* Basketball
* Swimming
* Build Your Own

Maintain a premium athletic experience without sacrificing readability, accessibility or simplicity.

11. Deferred capabilities

AI lifestyle optimization, parent wellness recommendations, sophisticated travel coordination and proactive schedule suggestions are future enhancements.

Design extensible event models, but do not let these enhancements delay core integrations, trusted data and functional user workflows.

Parent wellness scheduling may exist as an optional utility; AI optimization is not a launch dependency.

12. Commercial principles

Arena Pathway must be easy to use and easy to do business with.

Maintain independent activation and entitlement boundaries for SIEM, Recruiting and Locked In.

Support possible family subscriptions, premium athlete capabilities and organizational subscriptions without forcing bundles.

Do not finalize prices or promise unsupported integrations before market validation.

Prioritize real value, adoption, retention and manageable customer support.

13. Engineering controls

Use version-controlled code and isolated development branches.

Preserve verified existing work.

Keep public sports data logically separate from private family and athlete information.

Require authorization, least-privilege access, auditability, secure storage and protections for minors.

Do not claim simulated connectors are live.

Do not merge into main, update GoDaddy/Airo or publish production changes without explicit approval.

14. Release acceptance criteria

For every feature or release, report:

* What user problem was solved?
* What friction was removed?
* What new complexity was introduced?
* Is the next action clear?
* Are integrations genuinely working?
* Is the data accurate and appropriately classified?
* Can an iPhone/iPad user complete the workflow?
* Is any unrelated product now a mandatory dependency?
* Were automated, integration, security and browser tests completed?
* What remains unresolved?

Definition of success: A parent or athlete can find relevant information, connect supported systems, understand what matters and take the next action with minimal effort.

15. Standing instruction to Codex

Treat this document as Arena Pathway’s governing product and architectural charter.

Before implementing a substantial feature, check it against the principles above.

If a proposed change conflicts with the charter, report the conflict and propose a simpler alternative before implementation.

Do not silently expand scope.

Update this charter only when a product decision is explicitly approved.

Build sophisticated capabilities that feel effortless to use.
