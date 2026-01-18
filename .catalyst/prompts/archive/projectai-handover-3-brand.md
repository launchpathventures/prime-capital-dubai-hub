## Handover Prompt — Project Brand Guide
_This prompt helps AI produce a project-specific brand guide covering voice, visuals, and communication style._

@AI: You are now producing the **Project Brand Guide** for this project.

**Stability note:** This prompt is intentionally stable. Only update it when the required structure, voice rules, or recurring AI failure modes indicate the template itself needs correcting.

This document defines **how this project looks, sounds, and feels** so that humans and AI can create consistent experiences across all surfaces.

This is not a full brand strategy document.
This is a **practical, decision-guiding artefact** for builders.

It should be written for **human stakeholders first** (delivery leads, designers, partner teams), and **technical / AI users second**.

---

## Purpose of the Project Brand Guide

The Project Brand Guide should:
- Define voice and tone for consistent communication
- Establish visual identity direction (colors, typography, style)
- Provide references to inspiration materials
- Help new team members (and AI agents) create consistent outputs
- Make the project's claims **simple and repeatable**, without hype

A reader should be able to:
> "Create communications and designs that feel consistent with the project identity — without extensive review cycles."

---

## Inputs You Will Receive

You may be given some or all of the following:
- Project name and short description
- Target audience (who needs to trust this)
- The project's purpose / outcomes (Vision)
- Visual inspiration references (in `/catalyst/inspiration/`)
- Any known constraints (enterprise, security, regulated, etc.)
- Any existing brand elements or phrases the team already uses

If inputs are missing, make **reasonable assumptions** and clearly label them as assumptions.

---

## Required Structure

### 1. Purpose & Context
- What this guide is for (practical brand consistency)
- What the project is (one sentence)
- The core message spine in plain English
- When this document should be updated

### 2. Audience & Communication Goals
- Primary audience (humans) and what they care about
- Secondary audience (builders / AI) and what they need
- Communication goals in priority order (e.g. runnable → trustworthy → clear → detailed)

### 3. Voice (How We Sound)
- English conventions (UK English suitable for NZ unless instructed otherwise)
- 4–6 voice traits (confident, grounded, outcome-first, etc.)
- What we optimise for (outcome first, trust second, mechanism third)
- What we avoid (hype, hedging, technical-first openings, jargon headlines)
- A short "voice checklist" to test any piece of writing

### 4. Message Spine (What We Always Mean)
- The 4–6 step story that appears everywhere (reality → problem → answer → mechanism → outcome)
- A canonical one-liner
- A canonical "why now" line
- A short "practical punchline" list (the rhythm, in human terms)

### 5. Language Rules (Words We Use)
- Preferred terms (human-first language)
- Internal terms that may exist, and how to introduce them gently
- Definitions for any key role terms
- How to describe relationship to any parent brand/organisation (if applicable)

### 6. Claims & Proof (How We Talk About Outcomes)
- A simple rule for making confident claims without hype
- An "approved proof patterns" list (2–5 sentences/claims)
- A recommended "trust pattern" structure:
  1) Outcome
  2) Reason
  3) Boundary / safety

### 7. Visual Identity
- Design philosophy (e.g., calm, minimal, proof-led)
- Color palette direction (reference to CSS tokens if applicable)
- Typography approach (font families, sizing principles)
- Layout principles (scannable, short sections, clear hierarchy)

### 8. Inspiration References
- Reference the `/catalyst/inspiration/` folder
- For each image, provide a text description so AI can understand the intent
- Categories: web, app, color, typography, etc.

### 9. Structure Templates (How We Write)
Provide 3–5 reusable templates, such as:
- Overview page template
- "Teach a concept" page template
- Meeting/ritual template
- Start-here CTA block

Each template should be short, scannable, and immediately reusable.

### 10. Language Library (Reusable Phrases)
Provide grouped bullet lists:
- Core phrases
- Value & outcomes
- Trust & safety

### 11. Conversational Moves
Provide:
- Outcome-first openers
- 4–6 questions that reduce uncertainty
- Short closers / CTAs

### 12. How to Use This Guide
- A step-by-step checklist for humans
- A step-by-step checklist for AI agents (what to paste into prompts)

---

## Style & Tone Requirements

- Write in **UK English suitable for New Zealand**
- Plain English, direct and friendly
- Confident and grounded (no hype)
- Outcome-focused (lead with value)
- Human-first; technical details are secondary
- Use short sections, bullets, and clear headings

---

## Final Check Before Output

Before responding, ensure:
- The guide is usable immediately (not theoretical)
- The one-liner and message spine are consistent and repeatable
- There are clear "do/don't" rules to prevent tone drift
- Visual direction is clear enough for designers and AI
- Inspiration references are described in text (AI can't see images)
- Humans and AI could create consistent outputs without further context

Now produce the **Project Brand Guide** in markdown code.
