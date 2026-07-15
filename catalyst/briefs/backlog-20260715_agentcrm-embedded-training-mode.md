<!-- CATALYST - Embedded AgentCRM training mode planning brief -->

---
title: "AgentCRM Embedded Training Mode"
stage: mvp
tags: [agentcrm, training, sandbox, supabase, lms]
---

# AgentCRM Embedded Training Mode

> **Reference copy — STALE, not the source of truth.** This epic is implemented in the **AgentCRM product repo** (`catalyst/briefs/backlog-agentcrm-20260715-epic_embedded-training-mode.md`). As of 2026-07-15 the source-of-truth version has advanced well past this copy: **all five sub-briefs are in review**, the coupling-audit gate was accepted (six thin presentational seams), scope grew on approval to add **bounded synthetic buyer property selection + proposal draft/preview** (Pack A now 7 checks, Pack B 6), local RLS/isolation verification passed, and the **media pack was delivered** (2 demos + 11 screenshots). Do not treat the body below as current — read the AgentCRM copy. This repo owns only the downstream curriculum links/media — see [backlog-20260715_agentcrm-training-mode-lms-links.md](backlog-20260715_agentcrm-training-mode-lms-links.md).
>
> **Catalyst Brief** — Read [AGENTS.md](../../AGENTS.md) and [BRIEFS.md](../../.catalyst/BRIEFS.md) before implementing.

**Phase:** MVP  
**Status:** Draft backlog — requires human approval before implementation  
**Primary user:** Prime Capital consultant learning the core AgentCRM response loop  
**Product baseline:** AgentCRM commit `58317aa09177e44a8e3dfa5c0d21643eb5b6c598`  
**Implementation location:** AgentCRM product repository, with LMS links and media added here only after the embedded experience is stable  
**Related curriculum:** [_review-20260715_agentcrm-agent-mastery-rebuild.md](_review-20260715_agentcrm-agent-mastery-rebuild.md)

---

## 1. Summary

Add a small, durable **Training Mode inside each AgentCRM installation**. It uses the normal AgentCRM shell and selected real interaction components, but stores synthetic learner state in one isolated Supabase table rather than in operational contacts, activities, notes, requirements, or deals.

The first release is deliberately limited to the four behaviours Prime Capital most needs agents to repeat correctly:

1. Speed to contact.
2. Buyer and seller qualification.
3. Useful notes.
4. A justified next contact date (NCD).

Deliver two reusable scenario packs—one buyer and one seller—and one capstone variant assembled from the same mechanics. Do not build a general simulator, a second AgentCRM deployment, a duplicated CRM schema, automatic prose grading, or LMS-to-AgentCRM integration.

The product question is:

> Can a consultant respond promptly to a synthetic client signal, capture truthful qualification, leave a useful note, and set the correct next contact date in the actual AgentCRM interaction pattern without touching live client data?

---

## 2. Objectives and Success Criteria

### Objectives

1. Give every consultant a private, repeatable practice space inside the AgentCRM installation they already use.
2. Make the four required behaviours the completion spine of every interactive scenario.
3. Reuse the real interface and interaction language without routing any training action into operational data or outbound providers.
4. Keep the build small enough to maintain as AgentCRM changes.
5. Produce stable interface states that can also be used for LMS screenshots and short demonstrations.

### Success criteria

- A signed-in agent can enter Training Mode without a separate account, application deployment, or database.
- Each agent sees only their own training session through Supabase row-level security.
- Starting, saving, resetting, leaving, and restarting a scenario are reliable across browser refreshes and normal Vercel execution.
- Both scenario packs require a speed-to-contact action, qualification changes, a new note, and a new NCD before completion.
- Training Mode makes zero writes to operational CRM tables.
- Training Mode invokes no phone, email, WhatsApp, SMS, proposal-send, notification-delivery, webhook, AI-outreach, or external storage provider.
- A learner can complete either pack on desktop and a supported mobile viewport.
- The same scenario fixtures can create approved screenshots and short interface demonstrations without real-looking personal data.
- A single implementation team can maintain the experience without synchronising a cloned AgentCRM application or mirrored CRM schema.

---

## 3. Users, Roles and Permissions

### Agent / consultant — in scope

The learner can:

- Open the Training Centre from normal agent navigation.
- Start the buyer pack, seller pack, or capstone.
- Work only with synthetic records.
- Record simulated contact outcomes.
- Update the qualification fields supplied by the scenario.
- Save a note and NCD.
- See objective checks and reset their own scenario.
- Exit to normal AgentCRM deliberately.

The learner cannot:

- Send communications.
- Upload documents.
- Create real contacts, requirements, proposals, deals, tasks, notes, or activities.
- See another learner's session.
- alter scenario definitions or pass criteria.

### Manager / coach — not a product role in this release

- Manager controls, dashboards, team comparisons, overrides, routing, analytics, and scenario assignment are excluded.
- A coach may observe the capstone directly or use the existing LMS checklist outside AgentCRM.
- No manager read policy is required on `training_sessions` in this release.

### Authentication

- Use the existing AgentCRM Supabase-authenticated user.
- Do not add training credentials, magic links, LMS tokens, or cross-application single sign-on.
- Training Mode must not be available in unauthenticated demo auth on a production installation.

---

## 4. Scope Definition

### In scope — must deliver

1. A Training Centre entry point inside the AgentCRM agent surface.
2. A route-bound Training Mode with a persistent synthetic-data banner and explicit Exit action.
3. One isolated Supabase `training_sessions` table with RLS.
4. Version-controlled TypeScript scenario definitions; no scenario-builder UI.
5. Start, resume, complete, reset, and exit behaviours.
6. One shared simulated contact-outcome interaction.
7. The relevant real buyer/seller qualification controls or a thin extracted presentation layer from them.
8. The real note and NCD interaction patterns or a thin extracted presentation layer from them.
9. Objective completion checks for speed event, required qualification changes, note creation, and NCD validity.
10. Buyer First Response scenario pack.
11. Seller Response and Retry scenario pack.
12. A capstone variant that reuses the same controls and validator with changed facts and expected answers.
13. Desktop and supported mobile layouts.
14. Automated isolation, RLS, service, validation, and outbound-blocking tests.
15. A small approved visual pack captured from Training Mode for the related LMS modules.

### Out of scope — must not deliver

- A separate AgentCRM deployment, tenant, or database.
- Training records in operational `contacts`, `requirements`, `activities`, `notes`, `tasks`, `properties`, `proposals`, `deals`, or document tables.
- `is_training` columns or training filters added across operational CRM tables, RPCs, reports, cron jobs, and integrations.
- A duplicated `training` schema mirroring the operational CRM schema.
- A generic database provider, generic simulator SDK, visual scenario builder, or plugin system.
- Full replicas of Today, Leads, Pool, Properties, Proposals, Pipeline, Deals, Documents, Inbox, or manager surfaces.
- Real telephony, email, WhatsApp, SMS, push, proposal sending, webhooks, document storage, or AI outreach.
- Inbox or manager-control training.
- Automatic AI judgement of note quality or sales-call quality.
- Audio call simulation, speech recognition, avatars, branching video, or generated client dialogue.
- Cross-learner claim races or a shared synthetic world. A conflict may be a deterministic scenario event.
- LMS progress callbacks, signed launches, iframe embedding, per-click LMS telemetry, or certificate changes.
- A training-history dashboard or long-term evidence archive.
- Interactive property, proposal, deal, or document workflows in this release. These remain visual/guided learning until separately justified.

### Why the first release stops here

The four required behaviours all share one contact-response loop and can reuse the same storage, controls, and validator. Properties, proposals, deals, documents, communications, and shared Pool races each introduce different data models or integrations. Including them now would turn this into a general AgentCRM simulator rather than a focused practice tool.

---

## 5. Product Journey

### Entry

1. The signed-in agent opens **Training Centre**.
2. The page explains that all records are synthetic and no communication will be sent.
3. The learner chooses Buyer, Seller, or Capstone.
4. The learner presses **Start scenario**. The scenario clock starts only after this deliberate action.

### Training workspace

The learner sees:

- The normal AgentCRM shell and familiar responsive styling.
- A persistent, visually distinct **Training mode — synthetic data** banner.
- A compact mission card with the client signal, goal, and elapsed response time.
- A synthetic contact record using familiar AgentCRM sections.
- Simulated contact actions, qualification, notes, and NCD controls.
- A four-item progress summary that describes results, not arbitrary clicks.

### Completion

1. The learner selects a simulated contact action and records its truthful outcome.
2. The learner confirms or corrects the required qualification facts.
3. The learner writes and saves a decision-useful note.
4. The learner sets the scenario's justified NCD.
5. **Check my work** runs deterministic server-side checks.
6. The learner sees Pass or Fix guidance for each required behaviour.
7. The learner may reset or exit. There is no LMS callback.

### Exit safety

- Exit requires an explicit action and returns to normal AgentCRM.
- The training banner and route disappear before any live page is shown.
- Training state must never alter the provider used by ordinary AgentCRM routes.

---

## 6. Scenario Packs

Every pack has the same mandatory completion contract:

| Behaviour | Required evidence |
|---|---|
| Speed to contact | A simulated contact attempt is recorded after scenario start and its elapsed time is shown without inventing an unapproved operational SLA. |
| Qualification | Required buyer/seller fields are confirmed or corrected; supplied inferred facts are not silently treated as confirmed. |
| Useful note | A new post-contact note exists and the learner reviews it against the four-part standard. |
| Next contact date | A new NCD is valid, future-dated where appropriate, and matches the commitment supplied by the scenario. |

### Pack A — Buyer First Response

**Signal:** A fresh portal buyer enquiry appears in the training mission card.  
**Synthetic contact:** Training Buyer Maya B.  
**Starting state:** Source range and property interest are present; commercial facts are partly inferred; no meaningful first response exists.

The learner must:

1. Read source, enquiry, local-time, ownership, and prior-activity context.
2. Begin the simulated contact attempt promptly.
3. Record the supplied connected outcome.
4. Correct the source budget to Maya's confirmed comfortable maximum.
5. Confirm purpose, location, property type/bedrooms, timing, funding, ready/off-plan preference, decision stage, and decision-maker context supplied by the scenario.
6. Leave unknown facts unknown.
7. Save a note covering context, facts/decision, action/commitment, and owner/timing.
8. Set the proposal-review meeting as the exact NCD.

**Completion-specific checks:**

- Confirmed budget differs correctly from the inferred source range.
- Required buyer facts have the expected confirmed/inferred state.
- The outcome, note creation time, and NCD all occur in this run.
- The NCD matches the supplied meeting time.

### Pack B — Seller Response and Retry

**Signal:** An assigned seller enquiry needs an immediate first attempt.  
**Synthetic contact:** Training Seller Karim S.  
**Starting state:** Basic property context exists; seller qualification is incomplete; the first supplied attempt is No answer.

The learner must:

1. Begin the first simulated attempt promptly and save **No answer** rather than Contacted.
2. Set the supplied justified retry NCD.
3. Trigger the scenario's connected follow-up event without waiting in real time.
4. Record the connected outcome.
5. Confirm property, location, type, bedrooms, target price, timing, motivation, post-sale plan, flexibility, occupancy, co-owner/authority context, and undecided listing arrangement supplied by the scenario.
6. Leave unsupported exclusivity or authority unconfirmed.
7. Save a four-part useful note.
8. Replace the retry NCD with the agreed valuation meeting time.

**Completion-specific checks:**

- No answer and connected are two separate synthetic activities.
- The first attempt is timestamped for the speed check.
- Required seller facts have the expected confirmed/open state.
- The current note and NCD describe the valuation commitment, not the earlier retry.

### Capstone — Mixed Response Loop

- Reuse Pack A or Pack B mechanics with different names, values, source details, response outcomes, meeting times, and qualification deltas.
- Do not add new controls, tables, assessment types, or external integrations.
- Hide step-level hints until **Check my work**.
- Require all four common checks to pass.
- The existing LMS coach checklist remains the human review mechanism for note usefulness and judgement.

---

## 7. Completion and Feedback Rules

### Speed to contact

- `started_at` is written by the server when the learner presses **Start scenario**.
- `first_contact_attempt_at` is written only when the first simulated outcome is saved.
- Elapsed time is computed server-side.
- The interface shows elapsed response time and reinforces immediate action.
- The first release does not turn an unapproved numeric SLA into a pass/fail threshold.
- A later confirmed Prime operational target can be added to the scenario definition without changing the storage model.
- Reset creates a fresh start timestamp.

### Qualification

- Each scenario definition declares the fields that matter, the supplied answers, and the expected confirmed/inferred/open state.
- Validation checks only those declared facts.
- Do not create a generic scoring engine for every possible rubric field.
- Buyer and seller expectations remain separate.

### Notes

- Deterministic checks confirm that a new non-empty note was saved in the current run.
- Do not use word count, keyword matching, or AI to claim that prose is good.
- Show the four-part human standard beside self-review:
  1. Context/interaction.
  2. Confirmed facts and decision meaning.
  3. Agreed action or commitment.
  4. Owner and timing.
- The learner explicitly confirms their review; the capstone coach can challenge quality.

### Next contact date

- Validation checks that the NCD was changed in the current run.
- It must equal the scenario's supplied commitment time or fall within an explicitly declared permitted window.
- It must obey the product's normal maximum-NCD invariant.
- The current NCD must replace obsolete retry dates after a connected outcome.

### Pass model

- Each common behaviour is Pass or Fix; do not calculate a percentage score.
- A pack completes only when all four common behaviours and its scenario-specific checks pass.
- Completion is stored only in the learner's training session.
- There is no certificate or LMS progress effect in this release.

---

## 8. Technical Architecture

### Architectural boundary

Do not switch the whole AgentCRM database provider globally. Add a route-scoped `TrainingScenarioService` used only under the Training Centre routes.

```text
AgentCRM app shell
├── /app/**                 existing live services → operational tables
└── /app/training/**        TrainingScenarioService → training_sessions only
                                                    → no outbound providers
```

This avoids changing live service resolution and avoids pretending that the existing process-global memory adapter provides learner isolation.

### Supabase storage

Create one table in each AgentCRM installation's existing Supabase project:

`training_sessions`

| Column | Purpose |
|---|---|
| `id uuid` | Stable row ID. |
| `user_id uuid` | Existing authenticated learner; RLS owner. |
| `scenario_key text` | Buyer, seller, or capstone definition key. |
| `scenario_version integer` | Version used to create/reset state. |
| `run_number integer` | Increments on reset. |
| `status text` | `not_started`, `active`, or `completed`. |
| `state jsonb` | Synthetic contact, requirement, activities, notes, NCD, mission state, and deterministic results. |
| `started_at timestamptz` | Server start time for the current run. |
| `first_contact_attempt_at timestamptz` | Server timestamp for speed evidence. |
| `completed_at timestamptz` | Current run completion time. |
| `created_at timestamptz` | Initial row creation. |
| `updated_at timestamptz` | Last mutation. |

Use a unique constraint on `(user_id, scenario_key)` and reset/update the same row. This prevents an unbounded event archive and removes the need for a cleanup cron in the first release.

### Row-level security

- Enable RLS.
- Authenticated users may select, insert, and update only rows where `user_id = auth.uid()`.
- Delete is not required; Reset updates the existing row from the server-owned fixture.
- No manager-wide read policy.
- No anonymous policy.
- Server actions must derive `user_id` from the authenticated session, never from request input.

### Scenario definitions

- Store versioned synthetic fixture definitions in AgentCRM TypeScript, not in Supabase tables.
- Use synthetic names, domains, phone numbers, properties, and meeting details clearly marked for training.
- Validate definitions and stored state with explicit schemas.
- Reset copies the current fixture version into the learner's row and clears timing/completion fields.
- A definition version change resets or migrates the affected session explicitly; do not silently combine versions.

### UI reuse rule

- Reuse the AgentCRM shell, design tokens, responsive patterns, and presentational controls.
- Reuse existing qualification, outcome, note, and NCD components only when their data and mutation handlers can be injected safely.
- If a component directly owns Supabase/server calls, extract the smallest presentational layer needed by both live and training routes.
- Do not refactor unrelated CRM services into a universal repository pattern.
- Do not recreate full live pages merely for visual similarity.

### Outbound safety

- Training routes expose simulated outcomes, not dial/send actions.
- Do not mount live communications controls in Training Mode.
- Do not call operational API routes and rely on a `training=true` parameter.
- Add server-side tests proving that scenario actions use only `TrainingScenarioService`.
- The persistent banner states that no communication is sent.

---

## 9. Supabase Migration and Rollback

### Migration

One idempotent migration must:

1. Create `training_sessions`.
2. Add the unique constraint and useful owner/status index.
3. Enable RLS.
4. Create authenticated owner-only select/insert/update policies.
5. Add updated-at handling using the project's existing convention where available.
6. Grant only the minimum authenticated access required.

### Rollback

- Disable the Training Centre feature flag/navigation entry.
- The operational product remains unaffected because no operational schema or row is changed.
- The isolated table may be dropped in an explicit rollback migration after confirming that training progress is not needed.

### Deployment order

1. Apply migration to a non-production AgentCRM Supabase project.
2. Run RLS and isolation tests with two authenticated users.
3. Deploy code with Training Centre disabled by default.
4. Enable for approved internal users/installation.
5. Validate both scenarios and reset.
6. Enable for all Prime agents after human acceptance.

Do not apply migrations or seed any Supabase project while planning this brief.

---

## 10. Design and Content Requirements

- Training Mode must feel unmistakably like AgentCRM, not like an LMS quiz or a separate branded product.
- A persistent amber or otherwise clearly distinct training banner must remain visible on desktop and mobile.
- Synthetic contacts must include `Training` in the visible record label.
- Mission instructions stay short and action-oriented; do not expose the expected answers before the learner acts.
- Pass/Fix feedback names the missing result and how to inspect it.
- Avoid celebratory gamification, points, badges, leaderboards, and decorative animation.
- The normal AgentCRM shell must not expose Inbox or manager controls within Training Mode.
- Exiting Training Mode must be obvious and deliberate.

### Visual training outputs

After the UI is stable, capture from the actual embedded Training Mode:

- One short Buyer First Response demonstration.
- One short Seller Response and Retry demonstration.
- Approximately eight annotated screenshots covering signal, qualification, outcome, note, NCD, validation, reset, and mobile layout.
- Captions/transcripts suitable for the related LMS modules.

Do not create a separate animation system. Normal screen recording and static annotation are sufficient.

---

## 11. Non-Functional Requirements

### Safety and privacy

- Synthetic data only.
- No real names, emails, phone numbers, documents, or client details.
- No operational-table mutations.
- No outbound provider calls.
- RLS isolation is release-blocking.

### Reliability

- Refresh and resume must preserve the active run.
- Reset must be deterministic.
- Two simultaneous users must not see or change each other's state.
- Vercel process restart or scale-out must not lose state.

### Accessibility and responsiveness

- Keyboard-operable controls and visible focus states.
- Status feedback must not rely on colour alone.
- Appropriate labels and live-region feedback for validation.
- Usable at the same supported mobile widths as the core lead workflow.

### Performance

- Starting, saving, checking, and resetting should normally provide visible feedback within two seconds on the target deployment.
- Keep state bounded to the scenario objects required by this brief.

---

## 12. Validation Plan

### Database and security

- Migration applies and rolls back cleanly in a disposable/non-production project.
- RLS owner can create/read/update their row.
- A second authenticated user cannot select or mutate the first user's row.
- Anonymous access is denied.
- Request-provided `user_id` cannot override session ownership.

### Service tests

- Start creates the correct versioned state.
- Resume returns the same state after a new request/process.
- Reset restores the fixture and increments `run_number`.
- First contact time is set once per run.
- Buyer and seller qualification transitions preserve inferred/open facts correctly.
- Notes and NCD changes are scoped to the current run.
- Completion passes and fails for every declared condition.
- No operational repository or outbound adapter is called.

### End-to-end tests

- Buyer pack passes end to end on desktop.
- Seller no-answer → retry → connected flow passes end to end on desktop.
- Buyer or seller capstone passes without hints.
- Reset removes prior answers and timing evidence.
- Refresh/resume works.
- Exit returns to normal AgentCRM with no training banner or state leakage.
- Two-user browser contexts remain isolated.
- Supported mobile viewport can complete both packs.

### Human acceptance

- A Prime Capital reviewer confirms the buyer and seller qualification expectations.
- A Prime Capital reviewer confirms that elapsed response time is presented accurately and without an invented SLA.
- A reviewer confirms the notes/NCD model matches expected agent practice.
- A reviewer completes both packs without developer assistance.
- Captured media contains only approved synthetic information.

---

## 13. Delivery Sequence and Estimate

### Phase 1 — Integration audit and final component boundary

**Indicative effort:** 2 days

- Trace the exact live component/service calls for outcome, buyer/seller qualification, notes, and NCD at baseline `58317aa0`.
- Identify which presentational components accept injected state/actions and which need a small extraction.
- Confirm the final route/component map before broad edits.
- Produce a revised estimate if the live components are more tightly coupled than expected.

This is not a memory-mode pilot. It is the first implementation step for the durable Supabase design.

### Phase 2 — Supabase foundation and Training Centre shell

**Indicative effort:** 3–4 days

- Migration, RLS, types, fixture schema, scenario service, start/resume/reset/exit.
- Feature-gated Training Centre and persistent banner.
- Isolation and service tests.

### Phase 3 — Shared response loop and Buyer pack

**Indicative effort:** 4–5 days

- Simulated outcome, timing evidence, buyer qualification, note, NCD, deterministic checks.
- Desktop/mobile completion and end-to-end tests.

### Phase 4 — Seller pack and capstone variant

**Indicative effort:** 4–6 days

- Seller qualification and two-touch outcome state.
- Capstone fixture variants using the same engine.
- Full regression, isolation, reset, and mobile tests.

### Phase 5 — LMS links and visual pack

**Indicative effort:** 2–3 days

- Capture two short demonstrations and approximately eight screenshots.
- Add captions/transcripts and contextual links/media to the existing curriculum.
- No LMS callback or new assessment infrastructure.

### Total planning range

**15–20 engineering days for one engineer**, subject to the two-day coupling audit. The first release must be stopped or re-scoped if implementing the shared controls requires a broad AgentCRM data-layer refactor.

---

## 14. Risks, Assumptions and Decisions

### Key risks

1. **Live components own their data calls.** Mitigation: extract only the necessary presentational boundary; do not generalise the whole product.
2. **Training Mode accidentally exposes a live mutation.** Mitigation: separate route/service, no live action controls, integration tests that fail on operational calls.
3. **The JSON state grows into a second CRM schema.** Mitigation: store only the fields needed by the two packs; reject unrelated feature requests.
4. **Automatic checks overclaim note quality.** Mitigation: deterministic presence check plus human four-part review.
5. **Scenario facts drift from the live rubric.** Mitigation: version fixtures and review them when qualification controls change.

### Assumptions

- Each AgentCRM agency continues to use a separate Supabase project/database.
- The existing authenticated user ID is available to server actions.
- Prime wants persistent per-agent practice rather than anonymous public demo access.
- The first release prioritises repeated core operating discipline over breadth of CRM features.

### Human decisions before approval

- **Required:** Confirm the buyer and seller scenario facts and expected qualification states.
- **Required:** Approve excluding interactive properties, proposals, deals, documents, Inbox, and manager controls from this release.
- **Required:** Approve one isolated Supabase table and migration in each enabled AgentCRM installation.

---

## 15. Acceptance Checklist

### Architecture and safety

- [ ] Training Mode runs inside the existing AgentCRM deployment.
- [ ] Only one isolated `training_sessions` table is added.
- [ ] No training rows enter operational CRM tables.
- [ ] Owner-only RLS passes two-user and anonymous tests.
- [ ] No outbound provider or operational action route is reachable.
- [ ] Normal AgentCRM routes retain their existing database behaviour.

### Learner experience

- [ ] Buyer pack requires speed, qualification, note, and NCD evidence.
- [ ] Seller pack requires speed, qualification, note, and NCD evidence.
- [ ] Capstone reuses the same mechanics without new infrastructure.
- [ ] Start, resume, check, reset, and exit work on desktop and mobile.
- [ ] Pass/Fix results are deterministic and understandable.
- [ ] Note quality is not falsely presented as machine-assessed.

### Scope control

- [ ] No generic simulator or scenario-authoring platform was introduced.
- [ ] No cloned database schema or operational training flags were introduced.
- [ ] No LMS callback, certificate change, iframe, manager dashboard, Inbox training, or real messaging was introduced.
- [ ] Properties, proposals, deals, and documents remain visual/guided rather than interactive in this release.

### Training media

- [ ] Two short demonstrations are captured from the finished Training Mode.
- [ ] Approximately eight approved synthetic screenshots are available.
- [ ] LMS placement includes captions/transcripts and no real data.

---

## 16. Handoff Notes for the Implementation Agent

1. Work in the AgentCRM repository from baseline commit `58317aa0`; preserve later compatible work and do not reset unrelated changes.
2. Begin with the live component/service coupling audit. Do not write the generic training framework until the narrowest safe reuse boundary is known.
3. Implement the table, RLS, scenario service, and Buyer pack as one production-shaped vertical slice. Do not use process memory as an intermediate architecture.
4. Keep scenario state deliberately incomplete. If a field or object does not support speed, qualification, note, or NCD practice, it probably does not belong in this brief.
5. Treat outbound isolation and operational-table isolation as release blockers, not polish.
6. Do not apply or mutate any Supabase project without explicit environment confirmation and migration authority at implementation time.
7. Keep this brief in `backlog-` until the four required human decisions are approved. Rename it to `active-` only when implementation is authorised.
