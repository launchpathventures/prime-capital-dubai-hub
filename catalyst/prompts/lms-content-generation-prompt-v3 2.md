# LMS Content Generation Prompt v3.0

**Markdown Output • Concise Content • Audio-Ready Talk Tracks**

---

## Setup Instructions

### 1. Create a New Claude Project

Name it: `Prime Capital LMS Content v3`

### 2. Upload to Project Knowledge

Upload these 5 files:

1. `catalyst/specs/lms-content-format.md`
2. `legacy/lms/prime-capital-learning-architecture-v2.md`
3. `legacy/lms/prime-capital-training-guide.md`
4. `legacy/lms/prime-capital-objection-handling-guide.md`
5. `legacy/lms/prime-capital-offplan-training-program.md`

### 3. Paste the Prompt Below

---

## The Prompt

```
You are creating training content for Prime Capital Dubai, a boutique real estate advisory.

## Output Format: Markdown Files

Produce each module as a **standalone Markdown file** with YAML frontmatter. NOT TypeScript.

### File Naming Convention

```
content/lms/{competency-slug}/{module-slug}.md
```

Example: `content/lms/foundations/company-orientation.md`

### File Structure

```markdown
---
title: "Module Title"
slug: "module-slug"
competency: "competency-slug"
duration: "25 min"
type: "Knowledge | Skills | Skills + Script"
quizId: "competency-1" # Optional
videos:
  - title: "Video Title"
    url: "https://youtube.com/watch?v=XXXXX"
    duration: "8:24"
  - title: "Another Video"
    url: "https://youtube.com/watch?v=YYYYY"
    duration: "5:12"
images:
  hero: "dubai-skyline-aerial"
  sections: ["business-meeting", "contract-signing"]
prev: "previous-module-slug"
next: "next-module-slug"
---

[Content here]
```

---

## Writing Style: Concise & Audio-Ready

Content will be converted to audio using text-to-speech. Write accordingly:

### Be Ruthlessly Concise

- If it can be said in fewer words, do it
- One idea per paragraph
- Short sentences (15-20 words max)
- No filler phrases ("It's important to note that...", "As mentioned earlier...")
- Cut adjectives that don't add meaning

**❌ Too long:**
> "It's important to understand that Dubai's real estate market has experienced significant growth over the past several years, and this growth has been driven by a number of different factors including population growth, economic diversification, and favorable government policies."

**✅ Concise:**
> "Dubai's real estate market grew 42% in 2024. Three drivers: population growth, economic diversification, and favorable government policies."

### Audio-Ready Talk Tracks

Mark dialogue sections with `<speak>` tags. These will be converted to audio.

```markdown
## What to Say

<speak>
**Client:** I've heard Dubai is a bubble.

**Consultant:** That's a fair concern. Let me share what the data shows. Dubai hit 169,000 sales in 2024—up 42% from last year. But here's the key difference from 2008: 70% of today's buyers are end-users, not speculators. The fundamentals are completely different.
</speak>
```

### Dialogue Guidelines for TTS

- Use contractions ("I've", "don't", "we'll")
- Write how people actually talk
- Keep consultant responses under 60 words
- No parenthetical asides in dialogue
- Avoid acronyms in speech (say "two million dirhams" not "AED 2M")

---

## Content Requirements

### Every Module Must Have:

1. **Introduction** (2-3 sentences max)
2. **Core content** (teach one thing well)
3. **What to Say** section (for Skills + Script modules)
4. **Common Mistakes** (❌ Wrong / ✅ Right)
5. **Key Takeaways** (3-4 bullets, action verbs)

### Skills + Script Modules Must Also Have:

6. **AI Practice prompt** (simulation scenario)

### Word Count Targets

| Module Type | Target |
|-------------|--------|
| Knowledge | 400-600 words |
| Knowledge + Checklist | 500-700 words |
| Skills | 600-800 words |
| Skills + Script | 800-1000 words |

**Less is more.** If content is useful and complete at 400 words, don't pad to 600.

---

## Curriculum Structure (60 Modules)

### Competency 0: Foundations (5 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 0.1 | company-orientation | Prime Capital Orientation | Knowledge |
| 0.2 | code-of-conduct | Professional Standards | Knowledge |
| 0.3 | broker-licensing | Broker Licensing & Compliance | Knowledge + Checklist |
| 0.4 | essential-tools | Essential Tools Overview | Knowledge |
| 0.5 | daily-workflow | Daily Workflow & Productivity | Skills |

### Competency 1: Market Intelligence (10 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 1.1 | dubai-overview | Dubai Real Estate Overview | Knowledge |
| 1.2 | competitive-landscape | Prime Capital Positioning | Skills + Script |
| 1.3 | regulatory-framework | Regulatory Framework | Knowledge |
| 1.4 | offplan-vs-ready | Off-Plan vs Ready Properties | Skills + Script |
| 1.5 | key-developers | Key Developers | Knowledge |
| 1.6 | area-knowledge | Dubai Areas & Communities | Knowledge |
| 1.7 | area-deep-dives | Area Deep-Dives by Segment | Knowledge |
| 1.8 | golden-visa | Golden Visa & Residency | Skills + Script |
| 1.9 | economic-vision | Dubai's Economic Vision | Knowledge |
| 1.10 | global-comparison | Dubai vs Global Markets | Skills + Script |

### Competency 2: Client Discovery (7 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 2.1 | investor-personas | Investor Personas | Knowledge |
| 2.2 | discovery-endusers | Discovery: End-Users | Skills + Script |
| 2.3 | discovery-investors | Discovery: Investors | Skills + Script |
| 2.4 | discovery-visa | Discovery: Visa-Seekers | Skills + Script |
| 2.5 | active-listening | Active Listening | Skills |
| 2.6 | qualification-framework | BANT+ Qualification | Skills + Script |
| 2.7 | managing-expectations | Managing Expectations | Skills + Script |

### Competency 3: Sales Mastery (8 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 3.1 | lead-sources | Off-Plan Lead Sources | Knowledge |
| 3.2 | first-contact | First Contact Excellence | Skills + Script |
| 3.3 | needs-analysis | Needs Analysis Conversation | Skills + Script |
| 3.4 | offplan-presentation | Off-Plan Presentation Skills | Skills + Script |
| 3.5 | eoi-booking | EOI & Booking Conversion | Skills + Script |
| 3.6 | followup-sequences | Follow-Up Sequences | Skills |
| 3.7 | closing-techniques | Closing Techniques | Skills + Script |
| 3.8 | pipeline-management | Pipeline Management | Skills |

### Competency 4: Property Matching (7 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 4.1 | property-analysis | Property Analysis Framework | Skills |
| 4.2 | yield-calculations | Yield & ROI Calculations | Skills |
| 4.3 | offplan-evaluation | Off-Plan Evaluation | Skills + Checklist |
| 4.4 | payment-plan-analysis | Payment Plan Comparison | Skills + Script |
| 4.5 | secondary-evaluation | Secondary Market Evaluation | Skills |
| 4.6 | presentation-skills | Property Presentation | Skills + Script |
| 4.7 | comparative-analysis | Comparative Market Analysis | Skills |

### Competency 5: Transaction Management (12 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 5.1 | offplan-journey | Off-Plan Transaction Journey | Knowledge + Checklist |
| 5.2 | secondary-journey | Secondary Transaction Journey | Knowledge + Checklist |
| 5.3 | rera-contracts | RERA Smart Contracts | Knowledge |
| 5.4 | eoi-process | EOI & Booking Process | Skills + Checklist |
| 5.5 | spa-process | SPA & Down Payment | Skills + Script |
| 5.6 | oqood-registration | Oqood Registration | Knowledge + Checklist |
| 5.7 | escrow-protection | Escrow Accounts | Skills + Script |
| 5.8 | mortgage-process | Mortgage Process | Knowledge |
| 5.9 | mou-formf | MOU & Form F | Skills + Checklist |
| 5.10 | noc-transfer | NOC & Transfer | Knowledge + Checklist |
| 5.11 | handover-process | Handover Process | Skills + Checklist |
| 5.12 | post-transaction | Post-Transaction Service | Skills |

### Competency 6: Objection Navigation (7 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 6.1 | objection-framework | Objection Handling Framework | Skills |
| 6.2 | market-objections | Market & Timing Objections | Skills + Script |
| 6.3 | developer-objections | Developer & Project Objections | Skills + Script |
| 6.4 | price-fee-objections | Price & Fee Objections | Skills + Script |
| 6.5 | stall-objections | Stall & Delay Objections | Skills + Script |
| 6.6 | strategic-followup | Strategic Follow-Up | Skills |
| 6.7 | failure-resilience | Failure Scenarios & Resilience | Skills |

### Competency 7: Relationship Stewardship (4 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 7.1 | client-communication | Client Communication Standards | Skills |
| 7.2 | follow-up-systems | Follow-Up Systems | Skills |
| 7.3 | referral-generation | Referral Generation | Skills + Script |
| 7.4 | long-term-relationships | Long-Term Client Development | Skills |

---

## Quiz Format

Produce quizzes as separate files: `content/lms/quizzes/{quiz-id}.md`

```markdown
---
quizId: "foundations-1"
title: "Broker Licensing Quiz"
moduleSlug: "broker-licensing"
competencySlug: "foundations"
---

## Question 1

A consultant wants to advertise a property on Instagram. What must they include?

- [ ] Just the property photos and price
- [x] Trakheesi permit number and QR code
- [ ] Their personal phone number
- [ ] The developer's logo

**Explanation:** All property advertisements in Dubai must display the Trakheesi permit number and QR code. This is a RERA requirement—violations can result in fines.

## Question 2

[Continue with 4 more questions...]
```

---

## Reference Data

### Market Statistics (2024-2025)

- Transactions 2024: 169,083 sales (+42% YoY)
- Value 2024: AED 427 billion
- Average yield: 6.9%
- DLD fee: 4%
- Golden Visa: AED 2 million minimum

### Developer Quick Reference

- **Emaar** — Downtown, Creek Harbour, premium reputation
- **DAMAC** — Lagoons, Hills, branded residences
- **Nakheel** — Palm, JVC, established communities
- **Sobha** — Hartland, quality finishes
- **Ellington** — Boutique, design-focused

---

## Production Sequence

Produce one competency at a time:

1. **Competency 0: Foundations** (5 modules + 2 quizzes)
2. **Competency 1: Market Intelligence** (10 modules + 4 quizzes)
3. **Competency 2: Client Discovery** (7 modules + 2 quizzes)
4. **Competency 3: Sales Mastery** (8 modules + 3 quizzes)
5. **Competency 4: Property Matching** (7 modules + 2 quizzes)
6. **Competency 5: Transaction Management** (12 modules + 3 quizzes)
7. **Competency 6: Objection Navigation** (7 modules + 3 quizzes)
8. **Competency 7: Relationship Stewardship** (4 modules + 1 quiz)

---

## After Each Competency: Audit Summary

After producing all modules for a competency, output this summary:

### Competency [X] Audit

**Modules Produced:** [count]

| # | File | Words | Videos | Quiz |
|---|------|-------|--------|------|
| 0.1 | company-orientation.md | 482 | 2 | — |
| 0.2 | code-of-conduct.md | 391 | 1 | — |
| 0.3 | broker-licensing.md | 567 | 2 | ✓ |

**Links to Verify:**
- [ ] https://youtube.com/watch?v=XXXXX (0.1)
- [ ] https://youtube.com/watch?v=YYYYY (0.1)
- [ ] https://youtube.com/watch?v=ZZZZZ (0.2)

**Ready for next competency?**

---

## Begin

Start with **Competency 0: Foundations**.

Produce 5 markdown files + 2 quiz files.

For the first module (company-orientation.md), include:
- Full YAML frontmatter
- Concise content (~450 words)
- 1-2 YouTube video URLs
- Brand voice examples

After all 5 modules and 2 quizzes, output the Audit Summary.

Confirm you understand, then begin.
```

---

## How to Use This Prompt

### Initial Message

Copy everything inside the ``` code block above and paste it as your first message in the Claude Project.

### After Each Competency

Say: **"Continue with Competency [X]."**

### If Output Gets Cut Off

Say: **"Continue from where you stopped."**

### To Request Changes

- "Module 3.2 script sounds too formal. Make it more conversational."
- "Cut 0.4 down to 400 words—it's too long."
- "The YouTube URL for 1.3 is broken. Find an alternative."

---

## After Claude Produces Content

### 1. Save the Files

Create the directory structure locally:
```
content/
  lms/
    foundations/
      company-orientation.md
      code-of-conduct.md
      ...
    market-intelligence/
      ...
    quizzes/
      foundations-1.md
      foundations-2.md
      ...
```

### 2. Verify Links

Use the Audit Summary to quickly check:
- YouTube URLs load correctly
- URLs are recent (2023-2025)
- Content matches what you expected

### 3. Pass to Me for Integration

Once you've saved and verified a competency, paste it here and I'll:
- Create a loader function for markdown files
- Integrate with the existing LMS pages
- Add TTS processing for `<speak>` blocks

---

## Summary: What Changed from v2

| Aspect | v2 | v3 |
|--------|----|----|
| Output format | TypeScript | Markdown files |
| Word count | 1000-2000 | 400-1000 (concise) |
| Talk tracks | Plain text | `<speak>` tags for TTS |
| Audit | None | Summary after each competency |
| Maintenance | Edit code | Edit markdown (non-dev friendly) |
