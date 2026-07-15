<!-- CATALYST - AgentCRM agent mastery curriculum rebuild brief -->

---
title: "AgentCRM Agent Mastery Rebuild"
stage: mvp
tags: [lms, agentcrm, onboarding, agent-training, practical-skills]
---

# AgentCRM Agent Mastery Rebuild

> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../../.catalyst/BRIEFS.md) before implementing.

**Phase:** MVP  
**Status:** In review  
**Primary learner:** Prime Capital consultant using AgentCRM  
**Product baseline:** AgentCRM commit `58317aa0`  
**Supersedes:** The module structure in `_review-20260714_agentcrm-training-competency.md`; accurate source-derived content may be retained and rewritten.

---

## 1. Summary

Rebuild Competency 10 as a practical **AgentCRM agent operating playbook**. The competency must teach the tools, judgement, habits, and repeatable workflow a consultant needs to run a working day: notice priority work, find and claim the right lead, make fast first contact, qualify buyer and seller needs, maintain useful records and next actions, work with properties and proposals, progress the client through meetings and decisions, create and manage deals, upload documents correctly, and preserve the relationship after an opportunity is won or lost.

The current implementation contains useful product research and several sound mental models, but its structure overweights generic assessment design, Inbox workflows that are not enabled, and manager controls that do not belong in agent mastery. This rebuild keeps the useful source-grounded material and replaces the course spine, module outcomes, scenarios, quizzes, job aids, and capstone.

The competency should answer one practical question:

> Can this consultant use AgentCRM to move a real prospect from first signal to investment decision quickly, consistently, and with a clear next action?

This is a curriculum/content rebuild. It is not an AgentCRM product-development project or a certification-platform redesign.

---

## 2. Objectives and Success Criteria

### Objectives

1. Teach the everyday AgentCRM tools an agent must operate confidently on desktop and mobile.
2. Build the mindsets that make CRM use effective rather than administrative.
3. Make speed to contact and first-call quality central to the learning journey.
4. Teach separate buyer and seller qualification paths without duplicating the full sales curriculum.
5. Give agents a clear minimum-touchpoint and next-action discipline.
6. Teach the ideal client progression from enquiry to investment decision and deal.
7. Make the distinction between interest and commitment operationally unmistakable.
8. Teach properties, proposals, deals, stages, and documents as connected parts of the client journey.
9. Teach that a won or lost opportunity changes the current transaction, not the value of the client relationship.
10. Provide practical job aids that agents can use while working, not only while studying.

### Success criteria

- A learner can explain the full AgentCRM client journey without referring to a feature menu.
- A learner can begin from Today or a notification, find the correct lead, claim it where appropriate, and take the next action.
- A learner can demonstrate the first-contact workflow on both a buyer and a seller case.
- A learner can leave a useful record: correct details, concise note, qualification, outcome, and next contact date.
- A learner can explain and apply the minimum communication-touchpoint model.
- A learner can find and assess properties, build a shortlist, and create a proposal linked to confirmed needs.
- A learner can distinguish an interested client from a client who has committed to progress on a named property.
- A learner can create and manage a deal, associate the correct property, progress the stage truthfully, and upload a safe training document.
- A learner can explain the correct ongoing relationship after a won or lost opportunity without keeping a dead transaction artificially active or overriding consent.
- The complete experience works without Inbox content or manager-only controls.
- Every module includes one reusable practical tool and one hands-on AgentCRM task.
- The final capstone follows connected buyer and seller records rather than unrelated click-through exercises.
- Course and module duration estimates reconcile and remain achievable within one working day for an experienced broker new to AgentCRM.

---

## 3. Users, Roles, and Permissions

### In-scope learner: Agent / Consultant

The learner may be:

- New to Dubai real estate and AgentCRM.
- An experienced broker who is new to AgentCRM.
- A current consultant who needs a consistent operating standard.

The agent must learn to:

- Work assigned and eligible pool leads.
- Use Today, Leads, filters, notifications, properties, proposals, deals, documents, and the mobile experience.
- Capture buyer and seller qualification.
- Set and honour next actions.
- Move client work through the correct progression.

### Supporting role: Manager / Coach

Managers may observe the final capstone and use its simple checklist. Manager dashboards, assignment policy, performance coaching, team settings, routing configuration, and manager-only controls are **not taught in this competency**.

### Permissions assumptions

- Training occurs in an approved practice environment or on explicitly designated practice records.
- Learners use normal agent permissions.
- Practice must not require manager-only navigation.
- Any feature that varies by role, agency setting, device, or notification permission must be labelled accurately.

---

## 4. Scope Definition

### In scope — must deliver

1. A rewritten Competency 10 overview and operating model.
2. Eight rewritten and renamed agent-focused modules.
3. Eight linked five-question knowledge checks.
4. Eight workflow missions that form two connected client journeys.
5. Six focused AI roleplays tied to the client journey.
6. Practical quick-reference tools embedded in the modules.
7. A simple final “run the client journey” capstone and manager checklist described in content.
8. Correct references to Today, notifications, lead discovery, Pool, lead details, qualification, notes, next contact date, properties, proposals, pipeline, deals, documents, and mobile use.
9. Buyer and seller variants wherever the workflow materially differs.
10. Updated scenario indexes, counts, course audit, cross-references, module metadata, and quiz mappings.

### Out of scope — must not deliver

- **Inbox training.** Inbox is not enabled and must not appear as a learner workflow, learning objective, lab dependency, quiz answer, or readiness requirement.
- Manager-control-room, team-performance, routing, assignment-policy, analytics, or settings training.
- A new manager competency; capture it as future work only.
- AgentCRM product feature changes, including Today, notifications, Pool, deals, documents, or mobile implementation.
- Supabase schema changes, data seeding, LMS sync, or production data mutation.
- Certificate-eligibility rearchitecture or a complex assessor/evidence platform.
- New LMS upload, rubric, roleplay, or scenario infrastructure unless an existing parser defect prevents the agreed content from rendering.
- A full sales, market, compliance, AML, transaction, or relationship-stewardship curriculum. Link to the appropriate competencies instead.
- Instructions to send test communications, proposals, or notifications to real clients.
- Pixel-perfect screen tours likely to drift. Teach decisions, labels, and current control locations only where useful.

---

## 5. Requirements

### A. Competency architecture

**R1. Agent operating outcome**  
Rewrite the competency outcome around running a prospect from first signal to investment decision with speed, context, correct qualification, and a visible next action.

**R2. Eight-module structure**  
Deliver exactly these eight modules in this order:

1. AgentCRM Operating Model, Navigation & Mobile
2. Today, Notifications & Speed to Contact
3. Finding, Filtering & Claiming Leads
4. First Phone Call & Qualification Mastery
5. Lead Details, Notes, Next Contact Date & Touchpoints
6. Properties, Shortlists & Proposals
7. The Ideal Client Journey & Pipeline
8. Deals, Documents & Ongoing Relationships

**R3. Module file names and mappings**  
Rename the current module files to match the new structure. Update every quiz `relatedModule`, slug reference, scenario mapping, course index link, and validation assumption. Content has not been approved for sync, so clarity is preferred over retaining misleading module slugs.

Recommended filenames:

- `10.1-operating-model-navigation-mobile.md`
- `10.2-today-notifications-speed.md`
- `10.3-finding-filtering-claiming.md`
- `10.4-first-call-qualification.md`
- `10.5-lead-details-notes-follow-up.md`
- `10.6-properties-shortlists-proposals.md`
- `10.7-client-journey-pipeline.md`
- `10.8-deals-documents-relationships.md`

**R4. Consistent module pattern**  
Every module must contain:

1. Observable learner outcome.
2. Core mindset.
3. Why the skill matters to client service and agent performance.
4. Product workflow and decision rules.
5. Buyer/seller difference where relevant.
6. Desktop and mobile guidance where relevant.
7. A worked example.
8. A contrast case showing a tempting wrong action.
9. A quick-reference practical tool.
10. A hands-on task using the connected practice journeys.
11. Clear success criteria.
12. Common mistakes and recovery.

**R5. Working-day sequence**  
The module order and examples must resemble an agent’s work: notice → select → contact → qualify → capture → schedule → meet → match → propose → follow up → decide → deal → documents → continue the relationship.

**R6. Durable principles over feature tour**  
Teach what decision the agent is making and what good record state looks like. Avoid long descriptions of navigation that do not contribute to performing the work.

**R7. Existing content reuse**  
Reuse accurate material from the current modules where it supports this brief. Remove or substantially reduce content that belongs to Inbox, AI theory, manager coaching, team dashboards, or generic assessment explanation.

### B. Module requirements

#### Module 10.1 — AgentCRM Operating Model, Navigation & Mobile

**R8. Core mindset**  
Teach that AgentCRM is the shared memory and next-action system for the client relationship, not a personal address book or an administrative reporting burden.

**R9. Practical content**  
Cover:

- Contact as the centre of the relationship.
- Buyer and seller requirements.
- Lead/enquiry, property, proposal, deal, activity, note, task, and next contact date.
- The difference between an opportunity and a person.
- Core agent navigation only.
- Notification access and settings at a high level.
- Installing/opening the supported mobile/PWA experience.
- What is consistent across desktop and mobile and what may move.

**R10. Practical tool and task**  
Provide a one-page “AgentCRM relationship map” and mobile quick-start checklist. The learner opens a designated record on desktop and mobile and traces contact → requirement → property/proposal → deal → next action without editing live data.

#### Module 10.2 — Today, Notifications & Speed to Contact

**R11. Core mindset**  
Teach that speed to contact is a competitive and service advantage. Today and notifications exist to reduce delay between a client signal and useful human action; an empty screen is not the goal.

**R12. Today rules**  
Teach the actual pinned product behaviour for:

- Which records appear on Today.
- Signal and reason.
- New lead and first-contact work.
- Due and overdue next contact dates.
- Future next contact date suppression.
- What Done, defer, complete, or equivalent controls do and do not persist.
- How notifications complement Today.

Do not repeat the unsupported claim that all live signals break through a future NCD on Today. Verify the enabled notification behaviour and teach only what the product actually surfaces. If a product gap remains, record it in `AUDIT.md`; do not invent a training workaround.

**R13. Notifications and mobile**  
Distinguish in-app notifications, notification preferences, and native/web push only where confirmed and enabled. Show how an agent moves from a notification to the relevant lead and next action on mobile.

**R14. Practical tool and task**  
Provide a Today priority guide and speed-to-contact checklist. The learner triages a timed Today set, opens a notification, identifies the first three actions, completes one response loop, and leaves the right outcome and next date.

#### Module 10.3 — Finding, Filtering & Claiming Leads

**R15. Core mindset**  
Teach: find the right opportunity, understand its context, then take responsibility. Claiming is a service commitment, not a way to accumulate leads.

**R16. Practical content**  
Cover:

- Finding a known lead.
- Filtering the Leads list by the dimensions actually available.
- Useful filter recipes for new, uncontacted, buyer, seller, location, stage, and follow-up work where supported.
- Difference between assigned leads and Pool leads.
- Reviewing source, history, duplicate risk, previous ownership, fit, and personal capacity before claiming.
- Pool locks/claim conflicts and what to do when another agent wins the claim.
- Claim-on-outcome versus merely opening or dialling, using the actual product behaviour.
- Confirming ownership after the action.

**R17. Practical tool and task**  
Provide a lead-search recipe card and claim checklist. The learner finds one buyer and one seller, filters the list, evaluates a Pool record, handles one controlled claim conflict, and confirms the final owner.

#### Module 10.4 — First Phone Call & Qualification Mastery

**R18. Core mindset**  
Teach that the first call is the highest-leverage moment in AgentCRM. Its purpose is to create relevance, establish direction, capture enough truth, and secure the next meaningful commitment—usually a meeting or defined follow-up—not to complete every field.

**R19. First-call workflow**  
Teach:

1. Read source, property, history, local time, and ownership before calling.
2. Open with the specific enquiry or relationship context.
3. Establish the client’s objective.
4. Qualify the minimum useful commercial frame conversationally.
5. Distinguish confirmed client facts from inferred source data.
6. Summarise what was heard.
7. Book the next meeting or agree the next useful action.
8. Record outcome, qualification, note, stage, and next contact date immediately.

**R20. Buyer qualification**  
Provide a practical buyer checklist covering the confirmed essentials currently supported by the Prime Capital rubric, including purpose, budget, location, property type/bedrooms, timing, funding, ready/off-plan preference, decision stage, and decision makers. Do not duplicate full discovery training; focus on what must be captured in AgentCRM.

**R21. Seller qualification**  
Provide a separate seller checklist covering the property, location, type, bedrooms, target price, timeline, occupancy/status, ownership/authority, motivation, post-sale plan, price flexibility, and listing context where supported. Make clear which fields are essential, optional, inferred, or unavailable in the configured rubric.

**R22. Practical tools and task**  
Provide a first-call preparation card, buyer qualification card, seller qualification card, and post-call save checklist. The learner completes one buyer roleplay and one seller roleplay, then updates both records correctly.

#### Module 10.5 — Lead Details, Notes, Next Contact Date & Touchpoints

**R23. Core mindset**  
Teach that every interaction should make the record more useful to the next action and the next authorised colleague. Notes are not a diary; the NCD is not a snooze button.

**R24. Lead-details mastery**  
Cover the agent-relevant sections of a lead record, including:

- Identity and contact information.
- Source and enquiry context.
- Buyer/seller requirements.
- Qualification state.
- Activities and call outcomes.
- Notes.
- Tasks and next contact date.
- Matches, proposals, and deals.
- Documents where visible.

**R25. Useful note standard**  
Teach a simple note structure:

- What happened.
- What the client confirmed or changed.
- Current intent, concern, or decision.
- What was agreed next, by whom, and when.

Do not create a decorative acronym unless it genuinely improves recall.

**R26. Minimum communication touchpoints**  
Teach the minimum sequence without inventing an unconfirmed numeric SLA:

1. Make the first call as soon as the lead becomes eligible and the agent can respond properly.
2. If unanswered, record the exact outcome and use an approved follow-up message where enabled.
3. Set a justified NCD for the next attempt.
4. Make the next planned attempt from Today or the relevant notification.
5. Add a value-led follow-up tied to the enquiry, meeting, property, or proposal.
6. Decide explicitly whether the opportunity remains active, moves to nurture, or is lost based on facts and consent.

Where Prime Capital has a configured response SLA or contact-cadence policy, use that value. If no numeric standard is confirmed during build, keep the content sequence-based and flag the number for human review rather than hardcoding it.

**R27. Practical tool and task**  
Provide a note template, touchpoint cadence card, and NCD decision guide. The learner corrects weak notes/NCDs and completes a multi-touch follow-up record.

#### Module 10.6 — Properties, Shortlists & Proposals

**R28. Core mindset**  
Teach that access to inventory is not advice. An agent creates value by translating confirmed requirements into a small, defensible decision set.

**R29. Properties workflow**  
Cover:

- Finding and filtering properties.
- Opening and reading property details.
- Checking fit against the active buyer requirement.
- Distinguishing live facts from fields that require verification.
- Match score as a review aid, not a suitability decision.
- Recording suggested, shared, viewed, interested, or rejected status truthfully where supported.
- Mobile property review where practical.

**R30. Proposal workflow**  
Cover:

- Selecting a small decision set.
- Explaining fit, differences, trade-offs, and pending checks.
- Creating and previewing a client-specific proposal.
- Avoiding unauthorised practice sends.
- Understanding proposal engagement and preparing the next meeting/follow-up.
- Keeping the proposal linked to the right contact and requirement.

**R31. Practical tool and task**  
Provide a property review checklist, three-option shortlist template, and proposal quality checklist. The learner creates a draft proposal from a confirmed buyer requirement and prepares the follow-up meeting.

#### Module 10.7 — The Ideal Client Journey & Pipeline

**R32. Core mindset**  
Teach that pipeline progress is the sequence of real client commitments and decisions. Stages describe evidence; they are not targets to move for appearance.

**R33. Ideal journey**  
Use this durable journey as the primary model:

1. Initial call.
2. Booked meeting.
3. Qualification and decision frame confirmed.
4. Property research and shortlist.
5. Proposal prepared/shared through the authorised workflow.
6. Follow-up meeting.
7. Client comparison, objections, and investment decision.
8. Explicit instruction to progress a named property.
9. Deal creation.

The content may map this journey to current pipeline labels, but must keep the evidence behind each step more important than the label.

**R34. Interested versus committed**  
Teach contrast cases such as:

- “I like this one” — interested, not committed.
- “This is our favourite; we need to discuss it” — interested, not committed.
- “Please verify the terms and hold while we decide” — not yet committed unless the product/business process defines otherwise.
- “Proceed with this named property; explain the next transaction step” — commitment sufficient to create a deal when other required context exists.

**R35. Practical tool and task**  
Provide a visual client-journey map, stage-evidence guide, and interested-versus-committed decision card. The learner progresses connected records through the right steps and explains every stage using evidence.

#### Module 10.8 — Deals, Documents & Ongoing Relationships

**R36. Core mindset**  
Teach that the deal represents committed transaction work on a specific property. A won or lost opportunity changes the transaction; it does not erase the person or the long-term relationship.

**R37. Deal workflow**  
Cover:

- The commitment gate.
- Creating a deal from the correct client and named property.
- Required and useful deal fields.
- Ownership and next obligation.
- Deal stages and evidence.
- Key dates and financial information at the level the product supports.
- Adding or managing associated properties where applicable.
- Correcting a stage when evidence changes.
- Won and lost outcomes.

**R38. Documents**  
Teach:

- Where client and deal documents belong in the current product.
- Uploading a safe dummy training document.
- Clear naming and correct association.
- Checking that the file is present and accessible to the right authorised users.
- Never using real passports, Emirates IDs, bank statements, or transaction documents for practice.
- Renaming/removing a mistaken training upload if the product supports it.

**R39. Won/lost relationship model**  
Teach all of the following:

- A **won deal** begins post-transaction relationship stewardship, referrals, reviews, and future requirements where appropriate.
- A **lost deal/opportunity** ends or changes the current transaction; it does not automatically make the person irrelevant.
- A lost opportunity may move to an appropriate future relationship/nurture path only when there is a real reason and consent.
- Do not keep a dead deal active merely to preserve the relationship.
- Do-not-contact always overrides the “live prospect” mindset.

**R40. Practical tool and task**  
Provide a deal-creation checklist, document checklist, and won/lost relationship guide. The learner decides which of two records warrants a deal, creates it, uploads a dummy document, progresses the stage, and leaves an appropriate post-outcome relationship action.

### C. Embedded practical tools

**R41. Tool format**  
Every module must include a clearly labelled **Agent Tool** section in plain Markdown. Tools must be concise enough to use on a phone during work and printable without special LMS infrastructure.

**R42. Required tool set**  
Deliver these tools across the modules:

1. AgentCRM relationship map.
2. Mobile quick-start checklist.
3. Today priority guide.
4. Speed-to-contact checklist.
5. Lead filter recipe card.
6. Pool claim checklist.
7. First-call preparation card.
8. Buyer qualification card.
9. Seller qualification card.
10. Post-call save checklist.
11. Useful-note template.
12. Minimum-touchpoint cadence card.
13. NCD decision guide.
14. Property review checklist.
15. Three-property shortlist template.
16. Proposal quality checklist.
17. Client-journey/pipeline map.
18. Stage-evidence guide.
19. Interested-versus-committed decision card.
20. Deal-creation checklist.
21. Document checklist.
22. Won/lost relationship guide.

Tools may be combined where that improves usability. Do not inflate the content merely to preserve a count.

### D. Connected workflow missions

**R43. Two golden-thread journeys**  
Replace the disconnected lab feeling with two recurring practice records:

#### Buyer journey

Notification/Today → find or claim → first call → buyer qualification → meeting booked → notes/NCD → property shortlist → proposal → follow-up meeting → investment decision → deal → document → post-outcome relationship.

#### Seller journey

Find/filter → ownership check → first call → seller qualification → notes/NCD → meeting/action plan → proposal or agreed service step where supported → follow-up decision → active/nurture/lost relationship state.

**R44. Eight mission structure**  
Rewrite the workflow lab as:

- **LAB-01:** Relationship Map, Navigation & Mobile Setup
- **LAB-02:** Today, Notification & Speed-to-Contact Sprint
- **LAB-03:** Find, Filter & Claim the Right Lead
- **LAB-04:** Buyer First Call and CRM Save
- **LAB-05:** Seller First Call, Notes, NCD & Touchpoints
- **LAB-06:** Property Shortlist and Proposal
- **LAB-07:** Meeting-to-Decision Pipeline
- **LAB-08:** Deal, Dummy Document and Ongoing Relationship

**R45. Mission evidence**  
Keep evidence light. Each mission must name the visible result the learner should be able to show on the practice record. Reflection may remain, but the mission's educational value comes from the resulting record and self-check, not long written evidence.

### E. Focused roleplays

**R46. Roleplay set**  
Retain six roleplays, rewritten around high-value conversations:

1. Buyer first contact and meeting booking.
2. Seller first contact and qualification.
3. Efficient qualification without interrogating.
4. Proposal follow-up meeting and trade-off discussion.
5. Interested versus committed decision.
6. Won/lost opportunity and the next relationship step.

No roleplay may depend on Inbox. The client prompt must create realistic pressure without scripting the answer.

**R47. CRM follow-through prompt**  
Every roleplay must finish with a short “What changes in AgentCRM?” self-check covering outcome, facts learned, stage, next action/NCD, proposal/deal decision, and relationship state as applicable.

### F. Knowledge checks

**R48. Quiz purpose**  
Quizzes confirm product rules and decision understanding; they do not need to act as a complex readiness system.

**R49. Quiz structure**  
Maintain eight quizzes with five questions and an 80% pass mark for current LMS compatibility.

**R50. Quiz design**  
Questions must:

- Use short realistic AgentCRM situations.
- Use plausible near-miss alternatives.
- Avoid obviously reckless distractors.
- Avoid testing the same deal, DNC, or multiple-requirement rule repeatedly.
- Test buyer and seller qualification.
- Test Today and notifications without referring to Inbox.
- Test interested versus committed.
- Test deals/documents, properties/proposals, notes/NCD, Pool claiming, mobile use, and ongoing relationships.
- Explain the operational consequence of the correct decision.

### G. Simple capstone

**R51. Capstone**  
Add a concise capstone description to the competency index or workflow-lab introduction. The learner completes a 45–60 minute “run the client journey” challenge using the connected practice records.

**R52. Capstone checklist**  
The manager/coach checks only whether the learner can:

1. Find and prioritise the correct lead.
2. Act with appropriate speed and ownership.
3. Conduct and record useful qualification.
4. Leave a clear note and next contact date.
5. Progress meetings, properties, and proposals truthfully.
6. Distinguish interest from commitment.
7. Create/manage the right deal and dummy document.
8. Leave the correct ongoing relationship action after won/lost.

Keep the checklist pass/fail and practical. Do not build a new assessment platform in this brief.

### H. Fidelity, safety, and content maintenance

**R53. Product baseline**  
Verify every consequential product instruction against AgentCRM commit `58317aa0`. Current `HEAD` may be checked for awareness but must not silently replace the baseline if it differs.

**R54. Today and notifications verification**  
At the start of implementation, inspect the Today loader, next-action engine, notification bell/sheet, preferences, push/PWA surfaces, and mobile lead journey. Resolve content against learner-visible behaviour rather than comments or intended architecture alone.

**R55. Buyer/seller field verification**  
Verify the current Prime Capital qualification rubric, which buyer/seller fields are shown, which are essential, and what manual edits mark confirmed.

**R56. Deal/document verification**  
Verify current deal creation, required property association, stages, contact versus deal documents, upload/rename/delete behaviour, and agent permissions before writing steps.

**R57. Feature variability**  
Where notifications, push, mobile installation, proposals, documents, or other controls vary, state the durable workflow and the verified alternative. Do not teach unavailable controls as universal.

**R58. Practice safety**  
All examples and tasks use dummy people, properties, amounts, and files. Do not use live clients or genuine identity/financial documents.

**R59. Course audit**  
Rewrite `content/lms/10-agentcrm-mastery/AUDIT.md` as a concise claim register covering the source snapshot, product-sensitive statements, learner journeys, exclusions, and revalidation triggers. Do not retain the previous report's heavy readiness architecture as learner-facing scope.

---

## 6. Non-Functional Requirements

### Readability and tone

- Use concise UK English suitable for an international Dubai workforce.
- Tone is direct, practical, professional, and agent-to-agent.
- Avoid hype, slogans, patronising explanations, and academic instructional-design language.
- Define product terms when first used; do not assume “NCD” is understood before “next contact date”.
- Use short paragraphs, checklists, examples, and decision tables where they improve action.

### Mobile and accessibility

- Every Agent Tool must work as readable plain text on a mobile screen.
- Avoid instructions that rely only on colour, precise pointer position, or one desktop layout.
- Give controls their visible label and purpose; acknowledge mobile placement differences.
- Scenario instructions must be understandable to a learner working in a second language.

### Maintainability

- Keep product-sensitive statements easy to locate in `AUDIT.md`.
- Prefer current labels plus durable intent, not screen coordinates.
- Record the verified product path for Today, notifications, Pool, qualification, proposals, deals, documents, and mobile.
- Ensure course overview and module duration totals reconcile.

### Data and privacy

- Use only dummy or approved training records.
- Use a harmless dummy document for upload practice.
- Never include real contact details, passports, Emirates IDs, bank details, or transactional documents in content or scenarios.

---

## 7. Design and Content Requirements

### Learning design

- Build around **mindset → tool → worked example → contrast case → product task**.
- Use the same buyer and seller records across modules so the learner sees cause and effect.
- Let practical tools carry the operating standard; keep explanatory prose only where it changes judgement.
- Teach the ideal client journey as the organising model, with product features introduced when needed.
- Make mobile actions part of the normal workflow, not an optional appendix.

### Core mindset statements

The final content must express these ideas in clear learner language:

1. **Speed creates opportunity.** Act quickly while still reading the context.
2. **Claiming means ownership.** Do not claim work you cannot progress.
3. **The record should tell the truth.** Capture what happened, not what you hoped happened.
4. **Every touch creates a next step.** Use a meaningful NCD, not a hiding date.
5. **Qualification guides value.** The first call should create direction and a meeting, not interrogate.
6. **Properties require judgement.** A shortlist is more valuable than an inventory dump.
7. **Interest is not commitment.** Create a deal only when the client decides to progress a named property.
8. **Stages follow evidence.** Never move a stage merely to make the pipeline look healthy.
9. **Won/lost describes the opportunity, not the human relationship.** Continue appropriate stewardship unless consent says stop.
10. **Mobile keeps the record current.** Capture outcomes and next actions while the context is fresh.

### Trust cues

- Clearly distinguish current product fact, Prime Capital operating standard, and suggested best practice.
- Mark controls that depend on notification permission, mobile installation, role, or agency configuration.
- Do not imply that a feature has recorded an action until the learner confirms the resulting record.

---

## 8. Risks, Assumptions, and Open Questions

### Risks

1. **Today versus notification drift:** source comments and learner-visible behaviour may differ. Verify both surfaces before writing.
2. **Seller qualification variability:** the configured Prime Capital rubric may expose more or fewer seller fields than expected.
3. **Document ambiguity:** contact documents and deal documents may have different controls or permissions.
4. **Mobile drift:** PWA, desktop, and mobile layouts may not expose identical actions.
5. **Cadence ambiguity:** Prime Capital's numeric response SLA and minimum attempt count may not be formally confirmed.
6. **Scope creep:** the work may drift back into manager training, certification systems, or product engineering.

### Assumptions

- Inbox remains disabled and excluded.
- The course has not been approved for production sync, so renaming module files/slugs is acceptable when references are updated.
- Eight modules, eight quizzes, eight workflow labs, and six roleplays remain compatible with the current LMS.
- Existing accurate content can be reused; a full blank-page rewrite is unnecessary.
- A manager can observe the capstone without new LMS infrastructure.

### Open questions

**During build — do not block initial work:**

1. What numeric speed-to-contact SLA should Prime Capital publish? If not confirmed, teach immediate response and configured SLA without inventing a number.
2. What exact minimum attempt count/timing should accompany the sequence in R26? Draft the sequence first and flag timing for human review.
3. Which notification channels and mobile push behaviours are enabled in the Prime Capital tenant? Verify source/default behaviour and label configuration-dependent items.
4. Which seller qualification dimensions are configured as essential?
5. Should document practice use contact documents, deal documents, or both? Follow the learner's actual workflow and verified permissions.

**Post-phase:**

- Manager/team-control competency.
- Inbox training when the feature is enabled.
- Formal LMS readiness/certificate enforcement.
- Automated training-tenant seeding or reset tooling.

### Blockers

None. The implementation agent can begin with the curriculum map, product verification, module renames, and reusable content inventory while recording the during-build questions.

---

## 9. Acceptance Checklist

### Structure and scope

- [x] Brief renamed `approved-` → `active-` before implementation begins.
- [x] Competency overview reflects agent mastery and the ideal client journey.
- [x] Exactly eight modules exist in the required order.
- [x] Module files/slugs, quiz mappings, scenarios, indexes, and references are consistent.
- [x] Inbox is absent from learner objectives, module workflows, quizzes, labs, roleplays, and capstone.
- [x] Manager controls, dashboards, coaching, routing, and settings are removed from the competency.
- [x] No product or Supabase mutations were performed.

### Critical tools and skills

- [x] Today concept and actual rules are taught accurately.
- [x] Notifications and speed-to-contact behaviour are taught accurately.
- [x] Finding and filtering Leads is practised.
- [x] Pool review and claiming is practised.
- [x] Lead Details, Notes, and NCD are practised.
- [x] Minimum communication touchpoints are explicit.
- [x] Buyer qualification and seller qualification are separate and practical.
- [x] First phone call mastery is the central qualification exercise.
- [x] Properties and proposals are practised as one advisory workflow.
- [x] The ideal call → meeting → proposal → follow-up → decision journey is visible throughout.
- [x] Interested versus committed is taught and tested.
- [x] Deal creation, deal management, and dummy-document upload are practised.
- [x] Won/lost opportunity versus ongoing relationship is taught with consent boundaries.
- [x] Mobile use is embedded across the journey.

### Learning assets

- [x] Every module includes an Agent Tool section.
- [x] The required quick-reference tool set is delivered without unnecessary duplication.
- [x] Eight workflow missions form the connected buyer and seller journeys.
- [x] Six roleplays match the agreed high-value conversations.
- [x] Every roleplay ends with an AgentCRM follow-through self-check.
- [x] Eight quizzes contain five questions each, with one defensible answer and plausible distractors.
- [x] A simple 45–60 minute capstone and pass/fail manager checklist are included.

### Fidelity and quality

- [x] AgentCRM commit `58317aa0` exists and was used as the baseline.
- [x] Today and notifications were verified against learner-visible source paths.
- [x] Buyer/seller qualification fields and confirmation behaviour were verified.
- [x] Pool claiming and ownership behaviour were verified.
- [x] Properties, proposal, deal, document, and mobile behaviour were verified.
- [x] Course `AUDIT.md` records product-sensitive claims and exclusions.
- [x] Course headline duration equals the sum/meaning of module durations.
- [x] Content uses clear UK English and remains usable on mobile.
- [x] Scenario/parser validation confirms 8 modules, 40 questions, 8 labs, and 6 roleplays.
- [x] Targeted lint/type checks run only if TypeScript changes are required; otherwise content validation is recorded.
- [x] No LMS sync or Supabase mutation was performed without explicit confirmation of the correct project.

---

## 10. Handoff Notes for the Implementation Agent

### Start here

1. Read this brief, the original `_review-20260714_agentcrm-training-competency.md`, and `.context/agentcrm-pedagogical-review.md`.
2. Rename this brief to `active-20260715_agentcrm-agent-mastery-rebuild.md`.
3. Confirm AgentCRM commit `58317aa0` exists; do not silently substitute a different `HEAD`.
4. Inspect Today, notifications, Pool, buyer/seller qualification, properties, proposals, deals, documents, and mobile source before editing claims.
5. Produce a short old-module → new-module content map. Reuse accurate passages and remove irrelevant scope.
6. Rename/rewrite the competency files and update linked quiz/scenario references.
7. Rebuild the practice journeys and practical tools before polishing prose.
8. Validate counts, mappings, durations, frontmatter, and forbidden scope.
9. Update this checklist and add completion notes.
10. Rename the brief to `_review-20260715_agentcrm-agent-mastery-rebuild.md` when complete.

### Priorities

1. Correct product behaviour and scope.
2. Practical job tools.
3. First-call and qualification mastery.
4. Connected buyer/seller journeys.
5. Properties → proposals → meetings → decisions → deals.
6. Mobile execution.
7. Quiz and prose refinement.

### Do not overbuild

- Do not build a new certification or evidence platform.
- Do not add Inbox as a future-looking section.
- Do not retain manager material merely because Module 10.8 already exists.
- Do not create more scenarios than the agreed eight labs and six roleplays.
- Do not add academic assessment terminology to learner content.
- Do not turn the modules into exhaustive product documentation.
- Do not hardcode an unconfirmed numeric SLA or contact cadence.

### What good looks like

An agent can keep the course open beside AgentCRM and use its tools immediately. The buyer and seller records progress naturally from Today/notification through first call, qualification, meetings, properties/proposal, decision, deal/documents, and the next relationship action. The learner understands not only which control to use, but the business mindset behind it.

### References

#### Workspace

- `catalyst/briefs/_review-20260714_agentcrm-training-competency.md`
- `.context/agentcrm-pedagogical-review.md`
- `content/lms/10-agentcrm-mastery/`
- `content/lms/quizzes/agentcrm-mastery-*.md`
- `content/lms/scenarios/agentcrm-workflow-lab.md`
- `content/lms/scenarios/agentcrm-roleplays.md`
- `lib/lms/sync.ts`

#### AgentCRM product baseline (`/Users/thg/code/agentcrm` at `58317aa0`)

- `catalyst/specs/project-vision.md`
- `catalyst/specs/project-experience.md`
- `app/(app)/app/today/data.ts`
- `modules/crm/lib/next-action.ts`
- `components/shared/notifications-sheet.tsx`
- `modules/activity/components/notification-bell.tsx`
- `app/(app)/app/settings/notifications/page.tsx`
- `components/shared/pwa-install-card.tsx`
- `modules/crm/components/lead-pool-view.tsx`
- `modules/crm/services/lead-pool-service.ts`
- `app/api/crm/contacts/call-attempt/route.ts`
- `app/api/crm/contacts/quick-log/route.ts`
- `lib/qualification/`
- `modules/crm/lib/qualification-from-requirement.ts`
- `modules/crm/services/matching-service.ts`
- `modules/crm/components/matches-tab.tsx`
- `modules/crm/services/proposal-service.ts`
- `modules/crm/services/deal-service.ts`
- `modules/crm/components/deal-form.tsx`
- `modules/crm/components/deal-documents.tsx`
- `app/(app)/app/leads/[id]/_mobile/`
- `app/api/contacts/[id]/documents/route.ts`

### Known repository limitation

`/Users/thg/code/launchpath-skills/public/SKILL_INDEX.md` was still missing when this brief was written. Continue with repository and Catalyst instructions unless the index becomes available.

---

## 11. Completion Notes

**Completed by:** Codex, Tallinn workspace  
**Completion date:** 2026-07-15

### Delivered

- Rebuilt the competency overview and all eight modules around one consultant working day and the connected Maya/Karim practice records.
- Delivered 22 labelled Agent Tools, eight five-question quizzes, eight workflow missions, six focused AI roleplays, and a 45–60 minute capstone with an eight-item pass/fail checklist.
- Rewrote the product claim audit against AgentCRM `58317aa0`, including the learner-visible Today limitation and configuration-dependent notification, qualification, document, proposal, and mobile behaviour.
- Extended the existing scenario detail parser/UI so every roleplay's “What changes in AgentCRM?” self-check renders after practice. The existing no-AI workflow-mission reflection path was preserved.
- Updated the scenario indexes/audit and project state. No LMS sync, Supabase access, product-repository mutation, seeding, or production-data mutation was performed.

### Validation

- Content/parser validation: 336 checks passed; 8 modules, 385 module minutes, 22 tools, 40 questions, 8 labs, and 6 roleplays.
- Targeted ESLint: passed for all touched TypeScript files.
- Vitest: 12 files and 111 tests passed.
- `git diff --check`: passed.
- Repo-wide `tsc --noEmit`: blocked only by pre-existing missing marketing hero images referenced by eight `(web)` pages; no error was reported in the touched scenario files.
- Essentials generation was intentionally not run because the repository script reads and writes Supabase; this brief explicitly prohibits Supabase mutation and LMS sync.

### Human review

- Confirm Prime Capital's numeric response SLA and minimum-attempt timing before publishing a numeric standard.
- Confirm enabled notification channels, browser/mobile push permissions, and any tenant event-generation limits.
- Confirm tenant overrides to buyer/seller qualification essentials and the seller rubric.
- Confirm the designated Maya/Karim practice records and whether LAB-08 may use contact documents, deal documents, or demonstration-only mode.
- Sample one roleplay and the complete capstone before approving LMS sync.
- Generate refreshed LMS essentials only as part of an explicitly authorised sync against the confirmed Supabase project.

### Known product limitation

At the pinned baseline, a future next contact date removes a lead from Today before message/proposal signal enrichment. The training states this learner-visible behaviour and does not claim that every live signal breaks through a future NCD.
