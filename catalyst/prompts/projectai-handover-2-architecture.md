## Handover Prompt — Project Architecture Document
_This prompt helps AI define a project’s decision and experience architecture._

@AI: You are now producing the **Project Architecture Document**.

**Stability note:** This prompt is intentionally stable. Only update it when the required structure, voice rules, or recurring AI failure modes indicate the template itself needs correcting.

This document explains **how the project’s vision was translated into direction, structure, and focus**.
It captures the key insights, decisions, and trade-offs that shape the solution — without prescribing technical implementation.

This is not a technical architecture document.
This is a **decision and experience architecture document**.

---

## Purpose of the Architecture Document

The Architecture Document should:
- Bridge the Vision and the Requirements
- Make implicit thinking explicit
- Provide a defensible rationale for what is being built
- Support stakeholder confidence and alignment
- Enable storytelling around *how we arrived here*

A reader should be able to understand:
> “Given the vision and constraints, why does this solution take this shape?”

---

## Required Structure

### 1. Inputs & Discovery Summary
Briefly summarise the key inputs that informed the direction, such as:
- workshops, hui, interviews, or discussions
- constraints, risks, or realities surfaced
- organisational, cultural, or operational context

Focus on what *mattered*, not everything that happened.

---

### 2. Key Insights & Patterns Identified
List the most important insights uncovered during discovery.

For each insight:
- describe what was learned
- explain why it matters
- note how it influenced direction or focus

These insights should clearly connect vision to structure.

---

### 3. Core Design & Experience Decisions
Document the major decisions that shape the solution.

For each decision, include:
- what choice was made
- why this option was selected
- what alternatives were considered (briefly)
- what trade-off was accepted

Examples:
- prioritising one user type over another in v1
- focusing on a specific interaction or flow
- simplifying or deferring certain capabilities

---

### 4. Resulting User Journey (High-Level)
Describe the intended user journey or journeys that emerge from these decisions.

Include:
- starting context
- key moments or transitions
- where value is delivered
- where the journey intentionally stops in this phase

This should read as an experience narrative, not a screen list.

---

### 5. Architectural Shape of the POC
Explain how the above translates into the **conceptual shape** of the POC.

For example:
- major sections or areas of the experience
- how users move between them
- what is surfaced early vs later
- how different audiences or roles are accommodated

Avoid technical terms unless necessary.

---

### 6. Deferred Paths & Future Considerations
Call out:
- important paths, features, or ideas that were intentionally deferred
- why they were not appropriate for this phase
- signals that would indicate they should be revisited later

This demonstrates intentional restraint.

---

### 7. How This Document Should Be Used
Briefly explain:
- how this document supports delivery and decision-making
- how it complements the Vision and Requirements documents
- how it can be used in stakeholder conversations or presentations

---

## Style & Tone Requirements
- Write in **UK English suitable for New Zealand** (unless instructed otherwise)
- Clear, structured, and reflective
- Confident but not defensive
- No technical implementation detail
- Written as a trusted partner explaining the thinking behind the work

---

## Final Check Before Output
Ensure that:
- Decisions are clearly justified
- The journey from vision to solution is understandable
- A coding agent could use this to stay aligned during execution
- A stakeholder could read this and feel confident in the direction

Now produce the **Project Architecture Document** in markdown code.










