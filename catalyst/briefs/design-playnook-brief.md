# Coding Agent Brief — Create **Design Playbook** Page (Catalyst Docs)

## Objective

Create a new **Design Playbook** page in the Catalyst documentation that teaches teams how to produce **compelling, differentiated designs** when working with AI — without slowing delivery or reintroducing heavy design workflows.

This page must:
- Be **practical, detailed, and runnable**
- Assume **no prior context** (the reader has not seen transcripts or background theory)
- Work **at any stage of a Catalyst project** (POC → MVP → MMP → PROD)
- Treat all steps as **recommended best practice**, not hard requirements
- Align with Catalyst’s core philosophy: *prove fast, reduce drift, harden later*

This is **not** a design system page.
This is **not** about colours, fonts, or components in isolation.
This is a **process playbook** for getting AI to produce strong, non-generic design outcomes.

---

## Placement in Docs

- Location:  
  `/docs/design/playbooks/design-playbook.md`

- Navigation:
  - Top-level: **Design**
  - Sub-section: **Playbooks**
  - Page title: **Design Playbook**

- This page should appear **before**:
  - Customisation
  - Typography
  - Colours
  - Layout Principles

---

## Tone & Style Requirements

- Confident, practical, and human
- No hype, no marketing language
- Clear headings and short paragraphs
- Use **callouts** (e.g. “Why this matters”, “Common mistake”, “Catalyst note”)
- Use **collapsible sections** where content is long
- Assume the reader is:
  - a delivery lead
  - a developer
  - or a consultant using AI
- Avoid academic theory — focus on **what to do and why**

---

## Page Structure (Required)

### 1. Page Introduction

**Purpose:**
Explain *why* this playbook exists and *when* to use it.

Must include:
- A clear statement that AI design quality problems are usually caused by **missing inputs**, not bad tools
- Reinforce that this playbook is **recommended**, not mandatory
- Clarify that these steps can be applied:
  - at the start of a project
  - or retroactively if a design feels generic

Suggested framing:
> “AI can build fast, but without clear design intent it will converge on safe, generic outcomes. This playbook shows how to give AI the right inputs — at the right time — to produce distinctive, high-quality design without slowing delivery.”

---

### 2. Core Principle: AI Amplifies Taste, It Doesn’t Invent It

Explain the foundational idea that underpins the rest of the page.

Must cover:
- AI defaults to “average” aesthetics when under-specified
- Strong design requires **declared taste**
- Declared taste comes from:
  - references
  - language
  - constraints
- This playbook replaces:
  - heavy mood boards
  - early Figma rounds
  - long speculative design cycles

Include a short **Catalyst note**:
> “This playbook exists to replace slow, speculative design work — not to add more steps.”

---

### 3. Stage-Aware Guidance (POC → PROD)

Before listing steps, add a short section explaining:

- These steps scale with project stage
- Not everything is required at POC
- More rigour is expected as you move toward production

Include a simple table:

| Stage | Design expectation |
|------|-------------------|
| POC | Clear hero, consistent tone, credibility |
| MVP | Coherent system, repeatable patterns |
| MMP | Polished flows, brand alignment |
| PROD | Full system consistency, accessibility, performance |

---

## The Design Playbook — Recommended Steps

Each step below **must be its own section**.

---

### Step 1 — Design Intent (Before Writing Code)

**Purpose:**  
Prevent generic output by explicitly declaring intent.

**What to do:**
Before starting a Catalyst build, capture:

1. **One real-world reference**
   - A production site or app
   - Something realistic and credible
   - Example sources:
     - Linear
     - Stripe
     - Notion
     - Shopify
     - Apple
2. **One aspirational reference**
   - A “concept car” reference
   - May be more expressive or experimental
   - Example sources:
     - https://dribbble.com
     - https://mobbin.com
     - https://www.curated.design
3. **Declared vibe**
   - 3–5 adjectives, e.g.:
     - “technical and restrained”
     - “editorial and expressive”
     - “enterprise calm”
4. **Audience signal**
   - Who this design must convince:
     - founders
     - operators
     - executives
     - end consumers

**Output:**
- A short design intent note (can live in chat, docs, or a markdown file)

**Common mistake:**
- Skipping this step and “fixing design later”

---

### Step 2 — Visual Context Injection (Critical)

**Purpose:**  
Give AI visual grounding so it doesn’t default to generic patterns.

**Key rule:**
> Screenshots outperform text prompts.

**What to do:**
- Capture screenshots of:
  - your real-world reference
  - your aspirational reference
- Feed them directly into the AI model when designing
- Explicitly say:
  - “Use this as a visual reference”
  - “Adapt structure and tone, not content”

**Why this works:**
- Modern AI models are vision-first
- Without visual input, AI falls back to training priors

**Tools / sources:**
- Browser screenshots
- Design inspection tools
- Mobbin exports

---

### Step 3 — Language Calibration (Design Vocabulary)

**Purpose:**  
Enable better prompts by using shared design language.

**Why this matters:**
Teams can’t ask for what they can’t name.

**Introduce a shared vocabulary**, including:

- **Layouts**
  - bento
  - split
  - stacked
  - timeline
- **Styles**
  - flat
  - glass
  - editorial
  - futuristic
- **Interactions**
  - hover reveal
  - progressive blur
  - scroll-triggered animation
- **Component intent**
  - “conversion hero”
  - “social proof strip”
  - “process explainer”

Encourage teams to **name what they want**, not just describe it vaguely.

---

### Step 4 — Hero-First Design (The 50% Rule)

**Purpose:**  
Set the visual and emotional tone early.

**Rule:**
> Spend ~50% of design effort on the hero.

**Why:**
- The hero defines:
  - typography
  - colour
  - spacing
  - animation intensity
- The hero becomes:
  - demo thumbnail
  - pitch artefact
  - landing reference

**Catalyst guidance:**
- A strong hero is often “enough” for a POC
- Full app polish is not required early

---

### Step 5 — Structured Section Assembly

**Purpose:**  
Avoid “template soup” and visual incoherence.

**Recommended approach:**
Explicitly define page sections before building:

- Hero
- Social proof
- Feature explanation
- Process
- CTA

For each section, clarify:
- layout type
- level of animation
- content density

This gives AI **assembly instructions**, not guesswork.

---

### Step 6 — Micro-Iteration (Avoid Full Regenerations)

**Purpose:**  
Preserve good decisions while refining design.

**Best practice:**
- Iterate on:
  - individual components
  - spacing
  - animation
  - typography
- Avoid:
  - “regenerate the whole page”

**Why:**
- Full regeneration destroys accumulated intent
- Surgical changes preserve alignment

---

### Step 7 — Style Extraction & Lock (As You Mature)

**Purpose:**  
Prevent late-stage design drift.

**What to do (recommended from MVP onward):**
- Extract:
  - colour tokens
  - typography rules
  - spacing principles
- Save into a simple `style.md`
- Feed this back into:
  - future AI prompts
  - downstream surfaces (docs, app, presentation)

This creates **design memory** for AI.

---

## How to Use This Playbook in Catalyst

Include a short section explaining:

- Use **Steps 1–4** for early POCs
- Add **Steps 5–7** as you move toward MVP/MMP
- You can apply this playbook:
  - at project start
  - or mid-project to improve weak design

Reinforce:
> These steps are recommendations, not gates.

---

## Common Failure Modes (Callout Section)

Include a list of pitfalls:
- Starting with no references
- Overusing text prompts
- Re-generating entire pages repeatedly
- Skipping hero focus
- Treating design as “polish at the end”

---

## Closing: How This Fits Catalyst

End with a short alignment note:
- This playbook replaces slow, speculative design
- It keeps Catalyst fast
- It dramatically improves output quality
- It supports proof-led delivery without reintroducing friction

---

## Final Notes for Coding Agent

- This page must be **long-form and thorough**
- Use collapsible sections to manage length
- No code examples required
- No component references required
- Focus on *process*, *inputs*, and *decision quality*

**Goal:**  
A reader should be able to follow this page and reliably get **better, more distinctive AI-generated designs** in a Catalyst project.
