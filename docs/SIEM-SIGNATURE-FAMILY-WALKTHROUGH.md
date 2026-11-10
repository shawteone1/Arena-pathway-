# Signature Family Demonstration — 7½-minute presentation

Positioning: **Keep the tools you already use. Manage their feeds in one actionable
dashboard.** Powerful underneath. Simple everywhere else.

Open `/siem/platform?scenario=family&mode=everyday` on a private local preview.
Use Reset demo before starting. The fictional Rivera family lives in Colorado:
Alex plays Foothills U13 Soccer; Jordan plays Rise 14U Volleyball; Taylor plays
Foothills U11 Soccer AND Rise 12U Volleyball. All clubs, venues, messages and family
members are fictional. Demo week: **May 6–12, 2030, America/Denver**. The fixed
Monday clock is 8 AM. No live providers or private athlete accounts are involved.

On iPad the sidebar starts collapsed. Its named arrow expands it; icons still
switch modes when collapsed. On a phone, use Show more commitments/actions to
expand the existing lists. No new dashboard or onboarding is needed.

## 0:00–0:45 — One family, four team schedules

Show Everyday View: three commitments today, two actual schedule changes, a
prioritized queue and the source-freshness line. Point to the Monday timeline:
Jordan's volleyball practice at 4:45 PM, Alex's changed soccer practice at 5:15 PM,
and Taylor's volleyball practice at 6:30 PM.

Say: “We are not replacing their tools. This family already receives information
from PlayMetrics, SportsEngine, TeamSnap and Slack. Arena Pathway brings the
permitted feeds together so they can understand what matters and decide next.”

Explicitly say these are fixtures, not a claim that the four platforms are connected.

## 0:45–1:40 — What needs me? Review the family overlap

Choose Command Center for the complete week and queue. Locate the Monday conflict
“Two commitments. One pickup plan.” Open Review details, then inspect Related
activities. Alex's practice overlaps Jordan's practice; Taylor needs a 6:10 PM
warmup arrival while Jordan needs a 6:15 PM pickup. One parent's attendance is not
assumed; the recommended next step is to confirm coverage, not automatically move
an event. Close details with Escape or Close details.

Say: “The dashboard turns schedules into a decision: who covers the overlapping
commitments? It doesn't decide permission, transport or attendance for us.”

## 1:40–2:50 — What changed? Three source records, one decision

Find **Alex · Soccer practice changed** in the action queue or What’s changed panel.
Open Review details. Show the previous 4:30 PM/Pine Grove plan and current
5:15 PM/Willow Creek Field 3 plan. In Original simulated sources, show:

- PlayMetrics practice update at 7:42 AM.
- TeamSnap calendar copy at 7:45 AM.
- Slack logistics announcement at 7:43 AM.

The same mapped practice appears once on the calendar and creates one practice
change decision. Its original records remain available for inspection. The
separate Wednesday Jordan volleyball update is a genuinely different change.

Say: “Three records don't need to mean three alerts. We keep the evidence while
putting the decision in one place. This fixture uses explicit child/team/event
mapping; a real ambiguous match would need review.”

Show original timestamps and source fixture freshness. Slack's 7:50 AM snapshot is
10 minutes old against a five-minute demo threshold, so it is visibly stale.
Refreshing the view does not refresh provider data or turn anything into a live feed.

## 2:50–3:45 — Focus without losing the family picture

Select **Taylor Rivera** in Participant. Both soccer and volleyball commitments
appear. Open More filters → Sport → Volleyball; only Taylor's volleyball team
activities remain. Clear filters. In Teams choose Jordan's Rise 14U team, then
clear again. More filters → Source → TeamSnap illustrates that a correlated soccer
practice is still available through its TeamSnap evidence even though PlayMetrics
remains the primary source. Clear filters before continuing.

Say: “Taylor has two sports, but one family association. We can focus by child,
team, sport or original source without duplicating the family.” School/family
items have no team sport and are shown with All sports.

## 3:45–5:00 — RSVP and arrival: a useful next step

Open **Jordan · Tournament RSVP due** in the action queue. TeamSnap owns the
fictional RSVP request; the related SportsEngine tournament is Saturday 8 AM–4 PM.
Close, then open the tournament calendar row to show Travel & arrival plan:
leave 6:30 AM, arrive 7:15 AM for check-in/warmup, begin at 8 AM. These are fictional
parent-entered buffers, not traffic predictions. Alex's 9 AM soccer game and
Taylor's 11:15 AM game explain why the Saturday coverage plan matters too.

Return to the RSVP details and click Preview simulated action. The approval button
is disabled until “I approve this simulated action only” is checked. You may leave
the preview unapproved to demonstrate that nothing happens automatically. If you
approve, explicitly read the no-sending confirmation. No provider RSVP changes.

## 5:00–6:00 — Complete a logistics action, visibly and safely

Open **Confirm Monday carpool coverage**. The Slack fixture asks whether Drew can
cover Jordan pickup and Taylor warmup while Casey takes Alex. Click Preview
simulated action. Explain the draft, check the approval box and click Approve
simulation only. The local SIEM action becomes resolved and the page confirms:
“Nothing was sent, submitted or changed in a provider.” Alternatively, Resolve
locally records only a local queue decision; it never sends a reply.

Say: “A message becomes a clear responsibility. Review and approval stay with the
parent. This is a simulation; production sending would require supported, securely
authorized provider interfaces.”

## 6:00–6:45 — Locked In status, not private documents

Open **Locked In demo · Jordan club form needs review**. Show the clearly simulated
status and its next step. Do not describe the form as submitted, verified or complete.
No identity, health, payment or document record is in the feed. The separate Locked
In pillar would own secure paperwork; SIEM receives only authorized status/action
metadata. The fixture includes fictional parent permission, not verified consent.

Recruiting remains optional and irrelevant to this family's scheduling demo.

## 6:45–7:30 — A screen the household can leave open

Switch to Display Mode. Privacy turns on automatically. Show generic commitments,
important actions and source freshness without names, locations, messages or
private evidence. View timestamps are distinct from original source timestamps.
The view redraws every 60 seconds when visible/unpaused and outside active controls;
manual refresh and pause remain available in the footer. This does not sync feeds.

Close: “Keep the tools you already use. Manage their feeds in one actionable
dashboard. What's next, what's changed, and what needs me—without another inbox.”

Reset demo to restore every original fixture, local action and approval state.
No accounts, personal workspace data or provider records change.
