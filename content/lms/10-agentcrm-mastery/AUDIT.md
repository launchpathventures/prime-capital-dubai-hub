<!-- CATALYST - AgentCRM mastery product claim register -->

# AgentCRM Mastery Claim Register

## Source snapshot

- Product repository: `/Users/thg/code/agentcrm`
- Baseline: `58317aa09177e44a8e3dfa5c0d21643eb5b6c598`
- Baseline date: 9 July 2026
- Curriculum verification: 15 July 2026
- Product `HEAD` matched the baseline during verification.
- No AgentCRM, LMS, or Supabase data was changed during this rebuild.

## Old-to-new content map

| Previous module | Rebuilt module | Reuse decision |
|---|---|---|
| 10.1 Operating Model & Setup | 10.1 Operating Model, Navigation & Mobile | Retained the contact-centred model; replaced setup/integration emphasis with agent navigation and mobile use. |
| 10.2 Running Today | 10.2 Today, Notifications & Speed to Contact | Corrected future-NCD behaviour and added the separate notification path. |
| 10.3 Lead Pool, Ownership & First Response | 10.3 Finding, Filtering & Claiming Leads | Retained Pool safety; expanded Leads filters and exact claim-on-outcome rules. |
| 10.4 Lead Workspace & Qualification | 10.4 First Phone Call & Qualification Mastery | Reframed around first-call performance and added a separate seller path. |
| 10.5 Communications, Inbox & AI Follow-Up | 10.5 Lead Details, Notes, NCD & Touchpoints | Removed Inbox/AI training; retained truthful outcomes, notes, and next actions. |
| 10.6 Matching & Proposals | 10.6 Properties, Shortlists & Proposals | Retained source-grounded matching/proposal content and made the meeting hand-off explicit. |
| 10.7 Deals & Pipeline Hygiene | 10.7 Ideal Client Journey & Pipeline | Moved deal execution to 10.8; centred stages, meetings, decisions, and commitment evidence. |
| 10.8 Manager Control Room | 10.8 Deals, Documents & Ongoing Relationships | Removed all manager controls; replaced them with agent deal, document, and stewardship work. |

## Product-sensitive claims

| Topic | Learner-facing truth at baseline | Verified source path |
|---|---|---|
| Today candidates | Today includes active leads with no next contact date, a due/overdue next contact date, an overdue task, or an untouched New lead. Do-not-contact never appears; nurture appears only when due. A future next contact date removes the lead before message, engagement, and proposal enrichment. | `app/(app)/app/today/data.ts` (`getTodayContacts`, candidate filter before enrichment) |
| Signal engine | The pure next-action engine can rank unread inbound, new enquiries, engagement, and proposal views above a future next contact date, but it only runs for contacts that reached it. Training follows the learner-visible Today loader, not the engine comment alone. | `modules/crm/lib/next-action.ts` |
| Notifications | The bell/sheet shows unread in-app items and can deep-link to a record. Settings expose browser push, email, WhatsApp, digest, and per-type choices, but settings persist locally and actual delivery depends on event generation, permission, role, and tenant configuration. Today's separate Action Required strip is restricted and must not be treated as a second lead queue. | `components/shared/notifications-sheet.tsx`; `modules/activity/components/notification-bell.tsx`; `app/(app)/app/settings/notifications/page.tsx`; `app/(app)/app/today/data.ts`; `modules/activity/notification-types.ts` |
| Mobile/PWA | Mobile supports a compact lead journey with Profile, Activity, Buyer/qualification, Properties, Proposals, Deals, quick actions, notes/NCD, calls, and documents. PWA/native installation varies by device and configuration. | `components/shared/pwa-install-card.tsx`; `app/(app)/app/leads/[id]/_mobile/` |
| Leads and Pool filters | Leads/Pool support search and combinations including stage, source, tags, temperature, priority, age, budget, location/country, property type, timeline, qualification, activity, and ownership-related filters where role/surface permits. Pool order uses product priority tiers. | `modules/crm/components/lead-pool-view.tsx`; `leads-filter-row.tsx`; `leads-advanced-filters.tsx` |
| Pool locks and claims | Expanding a Pool row applies a five-minute soft lock. Dialling an unowned Pool lead applies a soft hold and writes an initiated attempt; it does not claim. A single-record outcome of spoke, appointment set, or callback claims. Non-contact/dead-end outcomes do not claim. A lost race must not be bypassed. | `modules/crm/services/lead-pool-service.ts`; `app/api/crm/contacts/call-attempt/route.ts`; `app/api/crm/contacts/quick-log/route.ts` |
| Wrong number vs DNC | Wrong number flags the phone invalid and releases the lead; it does not mean the intended contact withdrew consent. Do-not-contact is a person/contact restriction and stops outreach. | `app/api/crm/contacts/quick-log/route.ts`; lead state flow |
| Qualification | Qualification is per requirement and separates missing, inferred, and confirmed values. Manual requirement edits route non-empty values through confirmation. Prime's buyer essentials include budget, timeline, property type, purpose, funding, bedrooms, locations, ready/off-plan, motivation, decision stage, and decision maker. Seller essentials include property identity/location/type/bedrooms/target price/timeline plus motivation, post-sale plan, price flexibility, and listing exclusivity; occupancy, ownership and authority exist but are optional by default. Tenant configuration can change active/essential fields and threshold. | `lib/qualification/rubric-defaults.ts`; `lib/qualification/types.ts`; `lib/qualification/state.ts`; `modules/crm/lib/qualification-from-requirement.ts` |
| Matches | Match scores rank eligible properties; they do not establish suitability or live availability. Supported relationship statuses are Suggested, Shared, Viewed, Interested, and Rejected with guarded transitions. | `modules/crm/services/matching-service.ts`; `modules/crm/components/matches-tab.tsx` |
| Proposals | A proposal belongs to one contact, contains selected property IDs, starts as Draft, and can become Sent, Viewed, or Expired. View count is engagement evidence, not commitment. Mobile can create/view proposals for owned leads; Pool access is read-only. | `modules/crm/services/proposal-service.ts`; `modules/crm/types/proposal.ts`; mobile `proposals-tab.tsx` |
| Deals | Deals link a contact and may link a requirement and one or more properties. Status supports Open, Won, Lost, and Archived; pipeline stage labels are configurable. Training uses the business commitment gate rather than treating a proposal view as a deal. | `modules/crm/services/deal-service.ts`; `modules/crm/components/deal-form.tsx`; `modules/crm/types/deal.ts` |
| Documents | Identity documents are contact-level and shared across deals. Transaction and custom documents are referenced in the deal. The mobile contact document route supports generic files; deal controls distinguish identity from transaction files. File policy and permissions apply. | `modules/crm/components/deal-documents.tsx`; `app/api/contacts/[id]/documents/route.ts`; mobile `profile/documents-section.tsx` |

## Connected learner journeys

- **Buyer:** notification/Today → find/claim → first call → qualification → meeting → note/NCD → shortlist → proposal → follow-up meeting → decision → deal → dummy document → post-outcome action.
- **Seller:** find/filter → ownership check → first call → seller qualification → note/NCD → meeting/action plan → agreed service step → decision → active/nurture/lost state with consent respected.

The eight lab missions reuse Training Buyer Maya B. and Training Seller Karim S. so the learner sees each earlier decision affect the later record.

## Explicit exclusions

- Inbox workflows, objectives, quiz answers, labs, roleplays, and capstone dependencies.
- Manager dashboards, assignment policy, routing, analytics, coaching, settings, and other manager controls.
- Numeric response-time SLAs or attempt counts not confirmed by Prime Capital.
- Product feature changes, test-data seeding, LMS sync, Supabase access, and production mutation.
- Certificate-platform or assessor-system redesign.

## Configuration-dependent items for human confirmation

- Prime Capital's published speed-to-contact target and minimum attempt timing.
- Enabled notification delivery channels and browser/native push permissions.
- Any tenant overrides to buyer/seller rubric essentials or qualification threshold.
- Which designated practice records and harmless dummy file learners should use.
- Whether the practice tenant permits contact documents, deal documents, or both for LAB-08.

## Revalidation triggers

Recheck the curriculum when any of these change:

- Today candidate filtering or enrichment order.
- Notification event generation, deep links, preferences, or push/PWA delivery.
- Pool locks, claim-on-outcome, wrong-number, ownership, or release rules.
- Buyer/seller rubric fields, essential flags, confirmation semantics, or thresholds.
- Lead-detail mobile tabs/actions.
- Match statuses/scoring, proposal lifecycle/views, or property availability handling.
- Deal/contact/property associations, stage/status definitions, or won/lost behaviour.
- Contact/deal document storage, file policy, rename/delete support, or permissions.

## Local validation target

- Exactly 8 modules in numeric order.
- Exactly 8 quizzes with 5 questions each (40 total).
- Exactly 8 workflow labs and 6 roleplays.
- Required frontmatter and cross-references resolve.
- Forbidden learner scope (`Inbox` workflows and manager-control training) is absent.
- Module duration sum is 385 minutes and matches the overview headline.
