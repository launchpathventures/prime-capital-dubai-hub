## Handover Prompt — Project Experience Document
_This prompt helps AI define who uses the project and how they experience it._

@AI: You are now producing the **Project Experience Document**.

**Stability note:** This prompt is intentionally stable. Only update it when the required structure, voice rules, or recurring AI failure modes indicate the template itself needs correcting.

This document defines **who uses this project and how they experience it**.
It captures the users, their journeys, and the features that serve them.

This is not a vision document (that's the north star).
This is not an architecture document (that's the technical structure).
This is the **experience layer** between vision and implementation.

---

## Purpose of the Experience Document

The Experience Document should:
- Define the primary users and personas
- Map the key journeys they take through the product
- Document feature areas that support those journeys
- Bridge Vision (why we exist) and Architecture (how it's built)

A reader should be able to understand:
> "Who uses this, what are they trying to accomplish, and how does the product support them?"

---

## Inputs You Will Receive

You may be given some or all of the following:
- Project name and description
- Vision document or north star statement
- Target audience descriptions
- Existing user research or personas
- Feature lists or requirements

If inputs are missing, make **reasonable assumptions** and clearly label them as assumptions.

---

## Required Structure

### 1. Purpose & Context
- What this document is for (defining users and experiences)
- Brief connection to the project vision
- When this document should be updated

### 2. Users & Personas
For each primary persona:
- **Who they are** — Role, context, responsibility
- **Core needs** — What they're trying to accomplish (3-5 bullets)
- **Key tension** — The primary challenge or trade-off they face

Also note secondary users who interact with the system but aren't the primary adopters.

Keep personas focused on those who matter most for the current phase.

### 3. User Journeys
Document 3-5 key journeys. For each:
- **Journey name** — Short, descriptive title
- **Persona** — Which user takes this journey
- **Steps** — Numbered sequence (5-7 steps)
- **Success** — What success looks like when journey completes

Journeys should represent the core value the product delivers.

### 4. Feature Areas
Group features by the experience they support:
- Feature area name
- Brief description
- Key capabilities (3-5 bullets)

This provides a high-level feature map without getting into implementation details.

### 5. Experience Principles
List 4-6 principles that guide how the product should feel:
- Each principle as a short phrase
- Brief explanation of what it means in practice

These should be usable during design and development decisions.

---

## Voice & Tone Rules

- Write for **humans first** — delivery leads, product managers, designers
- Use plain language, avoid jargon
- Focus on outcomes and experiences, not technical implementation
- Be specific about who users are and what they need
- Journeys should read as narratives, not technical specifications

---

## Quality Checks

Before finalising, verify:
- [ ] Personas are distinct and clearly defined
- [ ] Core needs are concrete and actionable
- [ ] Journeys cover the main value paths
- [ ] Success criteria are observable
- [ ] Feature areas connect to journeys
- [ ] Experience principles are usable for decisions

---

## Maintaining This Document

Note at the end:
- When to update (new personas, major features, journey changes)
- When NOT to update (sprint-level features, minor UI changes)
- Links to related docs (Vision, Architecture, Brand)
