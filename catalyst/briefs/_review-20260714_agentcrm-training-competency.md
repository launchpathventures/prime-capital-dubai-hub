<!-- CATALYST - AgentCRM training competency implementation brief -->

---
title: "AgentCRM Training Competency"
stage: mvp
tags: [lms, agentcrm, onboarding, simulations]
---

# AgentCRM Training Competency

> **Superseded (2026-07-15).** The module structure, scenarios, quizzes, and capstone from this brief were replaced by the rebuild in [_review-20260715_agentcrm-agent-mastery-rebuild.md](_review-20260715_agentcrm-agent-mastery-rebuild.md), which is the version now on disk and the one to review. This brief is retained only for its source research and product-truth rationale.

## Outcome

Create a practical AgentCRM competency that gets a new Prime Capital consultant from first login to safe, repeatable daily operation. Learners must be able to prioritise work, handle a lead, capture qualification, communicate in context, match property, create a proposal, maintain the pipeline, and leave every active lead with a truthful next action.

The competency also includes a shared team-performance module covering evidence and handovers, with assignment, coaching, and settings actions clearly gated to manager roles.

## Why this work exists

AgentCRM is not a conventional record system. Its core promise is to answer two questions:

1. Who needs attention now?
2. What should happen next?

A feature tour would teach navigation but not the behaviour that makes the CRM reliable. Training therefore follows the work loop and requires evidence from realistic tasks.

## Research basis

The curriculum was derived from the AgentCRM source repository at `/Users/thg/code/agentcrm`, verified at commit `58317aa0` dated 9 July 2026.

Primary evidence reviewed:

- `catalyst/specs/project-vision.md` and `project-experience.md`
- Current app navigation and role gates in `lib/navigation.ts`
- Onboarding flow in `app/(app)/app/onboarding/`
- Today action queue and next-best-action rules
- Lead pool, ownership, release, stage, and qualification services
- Lead detail, communication, property matching, proposal, and deal surfaces
- Manager Team and Insights navigation
- Product guide tours and end-to-end journey tests
- Recent product history through July 2026

## Product truths the training must preserve

1. **The contact is the centre of the record.** Requirements, communications, proposals, and deals attach to the person and their evolving intent.
2. **A deal is not an early-stage lead.** Create a deal only when the client commits to progress on a specific property.
3. **Today is a signal queue, not a static task list.** Unread inbound, fresh enquiries, engagement, proposal views, overdue follow-ups, and missing next dates can surface work.
4. **A future follow-up date is a promise.** The engine suppresses most routine prompts until that time, while still allowing live client signals to break through.
5. **Every interaction needs an outcome.** Capture the activity, update facts or qualification when learned, and set the next contact date or an honest terminal/parked state.
6. **Lead ownership has meaning.** Claim, assignment, release, nurture, and do-not-contact behaviour must not be treated as interchangeable.
7. **AI drafts are proposals, not decisions.** The consultant remains accountable for facts, suitability, tone, confidentiality, and the send action.
8. **Channel availability is agency-configured.** Training must not promise WhatsApp or personal mailbox features when those flags are disabled.
9. **Managers coach from evidence.** Response, activity, stuck leads, assignment, qualification, and conversion signals are inputs to coaching—not substitutes for judgement.

## Competency design

| Module | Observable learner outcome | Practical proof |
|---|---|---|
| 10.1 Operating model and setup | Explain the object model, complete setup, and locate the five core work areas | Account-readiness check and navigation drill |
| 10.2 Running Today | Read the signal and reason, execute/defer honestly, and clear a queue without hiding work | Timed morning triage mission |
| 10.3 Lead pool and first response | Select and claim an appropriate lead, respond quickly, and record the outcome | New-enquiry response mission |
| 10.4 Lead workspace and qualification | Turn a conversation into structured facts, confirmed qualification, stage, and next contact | Qualification call debrief mission |
| 10.5 Communications and follow-up | Use the correct channel, review an AI draft, send safely, and preserve context | Inbox-to-next-action mission |
| 10.6 Matching and proposals | Translate confirmed requirements into a defensible shortlist and track proposal engagement | Three-property shortlist mission |
| 10.7 Deals and pipeline hygiene | Create a deal at commitment, progress it truthfully, and close the daily/weekly loop | Pipeline clean-up mission |
| 10.8 Team performance & manager control room | Interpret evidence, hand over cleanly, and—when authorised—assign and coach fairly | Team review mission using a training account or supplied report |

## Assessment model

- Eight knowledge checks, one per module, with five questions each and an 80% pass mark.
- Eight hands-on missions completed in AgentCRM or a training tenant. Completion requires a reflection and named evidence.
- Six AI roleplays that rehearse client or coaching conversations tied to correct CRM follow-through.
- Recommended readiness standard: all core agent modules complete, all core quizzes passed, and the first six hands-on missions evidenced before unsupervised lead handling.
- The team-performance module is shared awareness. Manager-only actions are completed only with an authorised training account; they do not block the core agent-readiness gate.

## Content boundaries

- Teach durable workflows and decision rules, not pixel-perfect screen coordinates.
- Name current labels where useful, but explain that role, device, and agency feature settings can change visible options.
- Do not include live client data in exercises. Use training records only.
- Do not instruct learners to send external communications, publish proposals, reassign leads, or change settings in production without explicit manager approval.
- Do not describe disabled or unverified integrations as universally available.
- Do not duplicate full sales, market, compliance, or transaction instruction already covered by other competencies; link the CRM behaviour to those capabilities.

## Deliverables

- [x] Competency index at `content/lms/10-agentcrm-mastery/_index.md`
- [x] Eight practical modules at `content/lms/10-agentcrm-mastery/`
- [x] Eight module quizzes at `content/lms/quizzes/`
- [x] One hands-on AgentCRM mission category at `content/lms/scenarios/agentcrm-workflow-lab.md`
- [x] One AI roleplay category at `content/lms/scenarios/agentcrm-roleplays.md`
- [x] Scenario index totals and mappings updated
- [x] Project state updated for review

## Acceptance criteria

- [x] Markdown frontmatter matches the existing LMS sync schema.
- [x] The competency contains eight modules in numeric order.
- [x] Every module has an explicit outcome, workflow, practical exercise, success criteria, failure/recovery guidance, and linked quiz.
- [x] Each quiz contains exactly five unambiguous questions, four options per question, one correct option, explanations, and an 80% pass threshold.
- [x] Hands-on missions use training data and specify evidence without requiring unsupported LMS file uploads.
- [x] AI roleplay headings and sections match the existing scenario parser.
- [x] Content distinguishes Agent, Manager, and feature-gated workflows.
- [x] Content does not contradict the July 2026 source behaviour.
- [x] Local validation confirms all new files parse and cross-references resolve.

## Completion notes

- Added eight modules, eight five-question quizzes, eight workflow labs, and six AI roleplays.
- Added a non-AI scenario path so hands-on labs use reflection completion instead of attempting to launch an empty AI session.
- Recorded the source snapshot, curriculum rationale, product variability, and drift triggers in the competency audit.
- Content validation passed with 8 modules, 40 questions, 8 workflow labs, 6 AI roleplays, and 113 scenarios across the full bank.
- Targeted ESLint passed for all touched TypeScript files.
- Repository-wide TypeScript validation remains blocked by pre-existing missing marketing hero images in eight web routes; no TypeScript errors were reported in the AgentCRM training changes.

## Human review focus

1. Confirm the Prime Capital production tenant uses the labels and feature gates described.
2. Confirm which training tenant or designated practice records learners should use.
3. Confirm whether manager training should be mandatory for senior consultants.
4. Test the six AI roleplays for tone, evaluation quality, and realistic escalation.
5. Review content after material AgentCRM workflow changes; the source snapshot is recorded above to make drift visible.
