# Catalyst — Project Architecture Document (v3)

## 1. Inputs & Discovery Summary

Catalyst is shaped by one simple, repeated delivery reality:

> AI collapses build time — but it doesn’t automatically keep things aligned.

Across enterprise delivery (and agency delivery at scale), the cost is rarely “coding hours”. The cost is drift:

- stakeholders see the real thing too late, then steer late
- decisions don’t get captured, so they don’t stick
- teams translate intent through too many artefacts (and lose meaning)
- a proof becomes production by accident
- delivery depends on a single person holding context

Catalyst has been developed and refined through:

- RIVER Group delivery work turning multi-month cycles into week-scale delivery
- Partner agencies adopting Catalyst to move beyond low-code constraints into production-capable delivery
- The practical constraints of using AI day-to-day: AI is strongest when the environment is consistent and the method is explicit

This document explains the shape of Catalyst as a **decision and experience architecture**: how the vision of “weeks not months” becomes a practical system teams can run.

---

## 2. Key Insights & Patterns Identified

### Insight A — Speed isn’t the problem; drift is
**Learned:** When you can build quickly, it becomes easier to build the wrong thing quickly.  
**Why it matters:** Misalignment becomes visible later — and late steering is expensive.  
**Influence:** Catalyst makes alignment a first-class activity: decisions are captured, review is frequent, and proof is the default alignment tool.

### Insight B — “Wireframes-as-truth” creates long translation loops
**Learned:** Wireframes can help, but they often become the truth — and still need to be rebuilt (sometimes repeatedly) into real software.  
**Why it matters:** It stretches delivery and increases interpretation gaps.  
**Influence:** Catalyst biases to working proof early, with wireframes optional when they genuinely help.

### Insight C — Teams need a safe way to go from proof to production
**Learned:** Early proofs are valuable, but unsafe when they quietly become the live system.  
**Why it matters:** Accidental production creates reliability, security, and support risk.  
**Influence:** Catalyst introduces a staged path (POC → MVP → MMP → PROD) with explicit “what changes now” expectations.

### Insight D — The system must be runnable by anyone
**Learned:** If it depends on a hero lead, it doesn’t scale across a team or partner network.  
**Why it matters:** The minute someone leaves or a project is handed over, delivery slows and decisions get re-litigated.  
**Influence:** Catalyst is designed for continuity: durable artefacts, repeatable rituals, and clear roles.

### Insight E — There are two valid ways to start
**Learned:** Some teams need to move immediately (proof-first). Others need clarity first (intent-first).  
**Why it matters:** Forcing one entry path creates friction and reduces adoption.  
**Influence:** Catalyst supports both starts while keeping the same guardrails and promotion path.

---

## 3. Core Design & Experience Decisions

### Decision 1 — Position Catalyst as a delivery method *and* a kit
**Choice:** Catalyst is the way you run delivery, and the kit is what makes that way runnable.  
**Why:** A starter kit without a method becomes “vibe coding at speed”. A method without a kit becomes “process with friction”.  
**Trade-off:** Requires discipline in documentation and consistent patterns across the codebase.

### Decision 2 — Make proof the default alignment tool
**Choice:** Working proof leads; documentation supports.  
**Why:** It reduces interpretation gaps and gets stakeholders steering on reality.  
**Trade-off:** Requires clear boundaries so proofs don’t become accidental production.

### Decision 3 — Use decision checkpoints to prevent drift
**Choice:** Catalyst has explicit moments where the team stops and decides: “are we aligned?”, “are we ready to move forward?”, “is this safe to ship?”.  
**Why:** Without explicit checkpoints, projects drift by default.  
**Trade-off:** Slightly more structure upfront, materially less rework and debate downstream.

### Decision 4 — Stage quality instead of pretending everything is production
**Choice:** The system explicitly changes expectations as you move from proof → early product → market-ready → production.  
**Why:** Teams either overbuild early (slow) or underbuild late (risky) when quality isn’t staged.  
**Trade-off:** Requires teams to be honest about what stage they are actually in.

### Decision 5 — Treat stakeholder confidence as a designed outcome
**Choice:** Catalyst deliberately supports narrative + proof so stakeholders can understand the “why”, “what”, and “so what”.  
**Why:** Trust is what unlocks decisions; decisions unlock speed.  
**Trade-off:** Requires keeping narrative artefacts lean and current.

### Decision 6 — Keep the technical foundations AI-friendly (secondary)
**Choice:** The kit uses consistent conventions and composable UI patterns so AI and humans can extend it safely.  
**Why:** AI output quality is strongly correlated with predictability of structure.  
**Trade-off:** Teams may need to unlearn idiosyncratic patterns.

---

## 4. Resulting User Journey (High-Level)

### Journey A — Default delivery journey
1) Brief on intent (what matters, what success looks like)
2) Produce a focused proof quickly
3) Run a live review where decisions are made (not just feedback collected)
4) Choose the next move explicitly: stop / refine / advance
5) Increase quality intentionally as you move toward production

**Where value is delivered:** early proof, fast steering, durable decisions, reduced rework.

### Journey B — Stakeholder confidence journey
1) Understand what we’re doing and why
2) See proof early enough to steer
3) Make decisions that stick
4) Advance with clear expectations (not hope)

### Journey C — Adoption journey
- **DIY:** teams adopt the kit + method to deliver their own work.
- **Managed:** teams work with RIVER Group to run the method and/or harden work toward production.

---

## 5. Architectural Shape of Catalyst (Conceptual)

Catalyst is intentionally shaped as a connected set of surfaces and artefacts that serve different human needs:

### Layer 1 — Narrative (orientation)
Explains what Catalyst is, sets expectations, and makes the approach feel runnable.

### Layer 2 — Method (execution)
The repeatable delivery loop, role clarity, decision capture, steering rituals, and staged promotion.

### Layer 3 — Proof (working software)
The proof surface that stakeholders can interact with and steer on.

### Layer 4 — The kit (enabler)
The practical building blocks that make the method fast: consistent structure, surfaces, components, and conventions.

---

## 6. Deferred Paths & Future Considerations

### Deferred A — Packaging “community/lite”
Proving repeatable outcomes comes first. Broader packaging follows when the system is stable and teachable.

### Deferred B — Deep enterprise governance by default
Enterprise governance patterns are valuable, but should be optional modules rather than default weight for every project.

### Deferred C — Heavier automation and spec tooling
Automation can help, but it should not become the identity. The system stays useful even as tools evolve.

**Signals to revisit these:** increasing adoption, repeatable delivery outcomes, and clear demand for production hardening pathways.

---

## 7. How This Document Should Be Used

Use this Architecture Document to:

- Explain the “why” behind Catalyst in a way stakeholders and delivery leads can trust
- Defend the shift from translation-heavy delivery to proof-led steering
- Guide trade-offs when teams drift toward either scope sprawl or premature hardening
- Keep builders aligned: build the proof that supports the decisions, not random output

It complements:

- **Vision:** why this exists and what success looks like
- **PRD/Requirements:** what is in/out for the current phase
- **State of Play:** what’s true today, what’s next, and what decisions were made

---

## Maintaining this doc

This Architecture captures durable decisions and trade-offs that shape the solution. Update it when those decisions change; capture week-to-week delivery updates in a separate “State of Play” artefact.
