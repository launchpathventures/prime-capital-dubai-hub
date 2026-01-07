# LMS Content Generation Prompt

**Use this prompt in Claude.ai with Projects**

---

## Setup Instructions

### 1. Create a New Claude Project

Name it: `Prime Capital LMS Content`

### 2. Upload to Project Knowledge

Upload these files from your codebase:

1. `catalyst/specs/lms-content-format.md` — **CRITICAL: The output format specification**
2. `legacy/lms/prime-capital-learning-architecture-v2.md` — Competency framework
3. `legacy/lms/prime-capital-training-guide.md` — Source training material (market data, stats, processes)
4. `legacy/lms/prime-capital-objection-handling-guide.md` — Objection handling content
5. `legacy/lms/prime-capital-offplan-training-program.md` — Off-plan specifics & qualification frameworks

### 3. Paste the Prompt Below

---

## The Prompt

```
You are creating world-class professional training content for Prime Capital Dubai, a boutique real estate advisory serving high-net-worth international investors.

## Your Mission

Research and produce ALL learning content for a complete Learning Management System. This covers 6 competencies with 39 modules total, plus knowledge-check quizzes.

This content must be:
- **Practical** — Immediately applicable in real client situations
- **Example-driven** — Filled with specific dialogue, scenarios, and calculations
- **Multimedia-enriched** — Includes curated YouTube videos and imagery
- **World-class** — Equal to top corporate training programs at firms like Knight Frank or Savills

## Output Format

You MUST follow the LMS Content Format Specification exactly. Every piece of content must be valid TypeScript that can be directly copy-pasted into the codebase.

## Research Requirements

For EACH module, conduct web research to ensure content is:
- Accurate for Dubai real estate in 2025-2026
- Reflects current RERA/DLD regulations
- Uses real market statistics and thresholds (Golden Visa at AED 2M, DLD fee at 4%, etc.)
- References actual Dubai areas, developers, and market dynamics
- Includes relevant YouTube videos from credible sources
- Includes Unsplash/Pexels image suggestions for visual context

## Brand Voice: "Quiet Luxury"

All content must reflect Prime Capital's positioning:
- **Authoritative** — Confident expertise, not arrogant
- **Discreet** — Professional, not flashy or pushy
- **Transparent** — Honest about limitations and risks
- **Calm** — No urgency tactics, no pressure language

Write for non-native English speakers: clear, simple, jargon-defined.

## Content Quality Standards

Each module must:
1. **Teach observable behaviours** — Not theory, but what consultants actually DO
2. **Include real examples** — Specific dialogue, scenarios, calculations
3. **Connect to client outcomes** — Why this matters to investor success
4. **Be immediately usable** — Consultant can apply it in their next client meeting
5. **Include multimedia resources** — Videos and images that bring concepts to life

---

## MULTIMEDIA REQUIREMENTS (CRITICAL)

### YouTube Video Curation

For EACH module, research and include 1-3 relevant YouTube videos. Prioritize:

**Dubai Real Estate Channels (High Priority):**
- Tahir Majithia (Prime Capital co-founder) — Dubai market insights
- Dubai Property Guy
- Firas Al-Msaddi (fäm Properties)
- PropertyFinder UAE
- Bayut
- DXB Interact official tutorials

**Topic-Specific Searches:**
- "Dubai real estate [topic] 2025"
- "RERA Dubai [process]"
- "Dubai Land Department [topic]"
- "Off-plan Dubai [topic]"
- "Golden Visa UAE property"

**Video Selection Criteria:**
- Recent (2024-2025 preferred, 2023 acceptable for evergreen topics)
- Professional quality
- Accurate information (verify against official sources)
- Duration under 15 minutes (learners won't watch longer)
- English language or English subtitles

**Output Format for Videos:**
```typescript
videos: [
  {
    title: "Video Title Here",
    url: "https://www.youtube.com/watch?v=XXXXX",
    duration: "8:24",
    description: "Why this video is relevant and what learners will gain",
    timestamp: "2:30", // Optional: specific timestamp to start at
  },
],
```

### Image Curation

For EACH module, suggest 2-4 images from Unsplash or Pexels to use as:
- Module header/hero image
- Section break visuals
- Concept illustrations

**Search Terms by Competency:**

| Competency | Unsplash/Pexels Search Terms |
|------------|------------------------------|
| Market Intelligence | "Dubai skyline", "Dubai Marina aerial", "Burj Khalifa", "Dubai real estate", "luxury apartment interior Dubai" |
| Client Discovery | "business meeting", "consultation", "professional handshake", "client meeting luxury", "taking notes meeting" |
| Property Matching | "luxury apartment viewing", "property tour", "Dubai villa", "modern apartment interior", "Dubai penthouse" |
| Transaction Management | "signing documents", "contract signing", "business paperwork", "keys handover", "office meeting" |
| Objection Navigation | "confident professional", "business discussion", "negotiation meeting", "thoughtful conversation" |
| Relationship Stewardship | "follow up call", "customer service", "thank you card", "long term partnership", "referral handshake" |

**Output Format for Images:**
```typescript
images: {
  hero: {
    unsplash: "https://unsplash.com/photos/XXXXX",
    alt: "Aerial view of Dubai Marina at sunset",
    searchTerm: "Dubai Marina aerial",
  },
  sections: [
    {
      unsplash: "https://unsplash.com/photos/XXXXX",
      alt: "Description of image",
      placement: "After 'Key Points' section",
    },
  ],
},
```

---

## PRACTICAL CONTENT REQUIREMENTS (CRITICAL)

### Every Module MUST Include:

**1. Real Dialogue Examples**

Show exact words consultants should use:

```markdown
### What to Say

**Client:** "I've heard Dubai is a bubble about to burst."

**Consultant:** "That's a fair concern—many investors ask about this. Let me share what the data actually shows. Dubai's 2024 transaction volume hit 169,000 sales, up 42% year-on-year. But here's what's different from 2008: today's buyers are 70% end-users, not speculators. The market fundamentals are completely different. Would you like me to show you the comparison?"
```

**2. Worked Calculation Examples**

For any numerical concept, show the math:

```markdown
### Yield Calculation Example

**Property:** 1-bedroom apartment in JVC
**Purchase Price:** AED 850,000
**Annual Rent:** AED 65,000
**Service Charges:** AED 12,000/year

**Gross Yield:** AED 65,000 ÷ AED 850,000 = **7.6%**
**Net Yield:** (AED 65,000 - AED 12,000) ÷ AED 850,000 = **6.2%**

*This net yield of 6.2% compares favourably to London (3-4%) and Singapore (4-6%).*
```

**3. Decision Frameworks**

Give consultants mental models they can apply:

```markdown
### The BANT Framework for Qualification

| Letter | Question | What You're Learning |
|--------|----------|---------------------|
| **B**udget | "What investment range are you comfortable with?" | Can they afford your properties? |
| **A**uthority | "Will anyone else be involved in this decision?" | Who else needs to be convinced? |
| **N**eed | "What's driving your interest in Dubai property?" | End-user, investor, or visa-seeker? |
| **T**imeline | "When are you looking to complete a purchase?" | Urgency and readiness level |
```

**4. Common Mistakes & Corrections**

Show what NOT to do:

```markdown
### Common Mistakes

❌ **Wrong:** "This property is a great investment, you should act fast."
✅ **Right:** "Based on your yield requirements, this property offers 6.8% gross yield. Here's how that compares to your other options."

❌ **Wrong:** Sending 15 property options via email
✅ **Right:** Presenting 3-4 curated options with clear rationale for each
```

**5. Checklists & Job Aids**

Provide tools consultants can print and use:

```markdown
### Pre-Meeting Checklist

Before any client meeting, confirm:

- [ ] Client's budget range and payment preference (cash/mortgage)
- [ ] Investment goal (yield, growth, lifestyle, visa)
- [ ] Timeline for purchase
- [ ] Previous Dubai market experience
- [ ] Decision-makers involved
- [ ] Specific areas or developers of interest
- [ ] Any concerns or objections already expressed
```

**6. Role-Play Scenarios**

Give practice scenarios:

```markdown
### Practice Scenario

**Situation:** A UK investor with £500,000 budget wants 8% yield but insists on Downtown Dubai only.

**The Challenge:** Downtown yields are typically 5-6%. How do you navigate this?

**Approach:**
1. Acknowledge their preference for Downtown
2. Explain the yield reality with specific examples
3. Offer alternatives: "For 8% yield, areas like JVC or Dubai South deliver. Or, in Downtown, you'd be looking at capital growth of 10-15% instead. Which matters more to you?"
```

---

## AUDIENCE CONSIDERATION

This content serves TWO audiences:

### 1. New-to-Dubai Agents
- Need foundational knowledge
- May have real estate experience elsewhere
- Need Dubai-specific regulations, processes, terminology
- Appreciate step-by-step guidance

### 2. Experienced Dubai Agents
- Know the basics, want refinement
- Looking for advanced techniques and edge cases
- Appreciate nuance and market insights
- Value efficiency—skip basics, get to actionable content

**Balance:** Lead with practical application, include foundational context in collapsible sections or as reference material

---

## THE 39 MODULES TO PRODUCE

### COMPETENCY 1: Market Intelligence (8 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 1.1 | dubai-real-estate-overview | Dubai Real Estate Overview | Market history, growth story, current state, why Dubai now |
| 1.2 | regulatory-framework | Regulatory Framework | RERA, DLD, Ejari, escrow, investor protections |
| 1.3 | market-segments | Market Segments | Off-plan vs secondary vs commercial, when to recommend each |
| 1.4 | key-developers | Key Developers | Major developers (Emaar, DAMAC, Nakheel, Sobha, etc.), track records, reputation indicators |
| 1.5 | area-knowledge | Area Knowledge | Dubai's areas (Downtown, Marina, Palm, JVC, Creek Harbour, Dubai South, etc.), characteristics, price points |
| 1.6 | golden-visa | Golden Visa & Residency | AED 2M threshold, benefits, process, positioning for clients |
| 1.7 | market-trends | Market Trends & Analysis | Reading DXB Interact data, interpreting supply/demand, price indices |
| 1.8 | competitive-landscape | Competitive Landscape | Prime Capital positioning, major agencies, differentiation |

### COMPETENCY 2: Client Discovery (6 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 2.1 | investor-personas | Investor Personas | End-user vs investor vs visa-seeker, nationality patterns, motivations |
| 2.2 | discovery-questions | Discovery Questions | The essential questions, how to ask them, what to listen for |
| 2.3 | active-listening | Active Listening | Reading between the lines, confirming understanding, noting unstated needs |
| 2.4 | qualification-framework | Qualification Framework | Budget, timeline, decision process, readiness indicators |
| 2.5 | understanding-investment-goals | Understanding Investment Goals | Capital growth vs yield vs lifestyle, matching goals to property types |
| 2.6 | managing-expectations | Managing Expectations | Setting realistic timelines, yields, and process expectations |

### COMPETENCY 3: Property Matching (7 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 3.1 | property-analysis | Property Analysis | Evaluating against client criteria, scoring properties |
| 3.2 | yield-calculations | Yield Calculations | ROI, gross yield, net yield formulas with worked examples |
| 3.3 | off-plan-evaluation | Off-Plan Evaluation | Developer analysis, payment plans, risk assessment |
| 3.4 | secondary-market | Secondary Market | Resale value factors, condition assessment, negotiation room |
| 3.5 | presentation-skills | Property Presentation | How to present options, storytelling, visual materials |
| 3.6 | viewings-management | Managing Viewings | Scheduling, preparation, conducting effective viewings |
| 3.7 | comparative-analysis | Comparative Market Analysis | Creating side-by-side comparisons that help clients decide |

### COMPETENCY 4: Transaction Management (9 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 4.1 | transaction-process | Transaction Process Overview | End-to-end journey, timeline, stakeholders |
| 4.2 | offers-negotiation | Offers & Negotiation | Structuring offers, negotiation tactics, closing |
| 4.3 | mou-process | MOU Process | Memorandum of Understanding, Form F, deposits |
| 4.4 | due-diligence | Due Diligence | Title verification, encumbrance checks, documentation |
| 4.5 | noc-transfer | NOC & Transfer | No Objection Certificate, DLD transfer, costs |
| 4.6 | mortgage-process | Mortgage Process | UAE mortgage options, LTV ratios, bank requirements |
| 4.7 | payment-plans | Payment Plans | Developer payment structures, post-handover plans |
| 4.8 | handover-process | Handover Process | Snagging, final payments, key collection |
| 4.9 | post-transaction | Post-Transaction Support | After-sale service, property management referrals |

### COMPETENCY 5: Objection Navigation (5 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 5.1 | common-objections | Common Objections | The 5 objection types (Need, Understanding, Trust, Shortcoming, Tactical) |
| 5.2 | bubble-concerns | Market Bubble Concerns | Data-driven responses to "Is Dubai a bubble?" |
| 5.3 | developer-delays | Developer Delays | Addressing construction timeline concerns |
| 5.4 | hidden-fees | Hidden Fees & Costs | Full transparency on all transaction costs |
| 5.5 | objection-techniques | Objection Handling Techniques | Acknowledge-before-address, evidence-based responses |

### COMPETENCY 6: Relationship Stewardship (4 modules)

| # | Slug | Title | Focus |
|---|------|-------|-------|
| 6.1 | client-communication | Client Communication | Communication standards, response times, professionalism |
| 6.2 | follow-up-systems | Follow-Up Systems | Systematic touchpoints, CRM usage, timing |
| 6.3 | referral-generation | Referral Generation | Earning referrals through service quality |
| 6.4 | long-term-relationships | Long-Term Relationships | Portfolio conversations, repeat business, ongoing value |

---

## OUTPUT STRUCTURE

For EACH module, produce in this exact order:

### 1. Module Content Entry (Enhanced with Multimedia)

```typescript
"{module-slug}": {
  title: "{Module Title}",
  duration: "{XX} min",
  content: `
## Introduction

[Opening paragraph — set context and relevance]

## [Main Section with Practical Examples]

[Core content with specific dialogue examples, calculations, or frameworks]

### What to Say

**Client:** "[Common client question or concern]"

**Consultant:** "[Exact words to use, with explanation]"

### [Worked Example or Framework]

[Step-by-step calculation, decision framework, or checklist]

## [Second Section]

[Additional content]

### Common Mistakes

❌ **Wrong:** [What not to do]
✅ **Right:** [What to do instead]

## Why This Matters

[Practical application — what changes in their next client meeting]
  `,
  keyTakeaways: [
    "[Actionable takeaway 1]",
    "[Actionable takeaway 2]",
    "[Actionable takeaway 3]",
    "[Actionable takeaway 4]",
  ],
  videos: [
    {
      title: "{Video Title}",
      url: "https://www.youtube.com/watch?v={VIDEO_ID}",
      duration: "{M:SS}",
      description: "{Why this video is valuable for this module}",
      timestamp: "{M:SS}", // Optional: where to start
    },
  ],
  images: {
    hero: {
      url: "https://unsplash.com/photos/{PHOTO_ID}",
      alt: "{Descriptive alt text}",
      credit: "{Photographer name}",
    },
    sections: [
      {
        url: "https://unsplash.com/photos/{PHOTO_ID}",
        alt: "{Description}",
        placement: "{After which section heading}",
      },
    ],
  },
  prevModule: { slug: "{prev-slug}", title: "{Prev Title}" },  // Omit for first module
  nextModule: { slug: "{next-slug}", title: "{Next Title}" },  // Omit for last module
  quizId: "{competency-slug}-{number}",  // Optional
},
```

### 2. Quiz Entry (for modules with quizzes)

```typescript
"{competency-slug}-{number}": {
  title: "{Quiz Title}",
  moduleSlug: "{module-slug}",
  competencySlug: "{competency-slug}",
  questions: [
    {
      id: "q1",
      question: "{Scenario-based question that tests application, not just recall}",
      options: [
        { text: "{Option A}", correct: false },
        { text: "{Option B}", correct: true },
        { text: "{Option C}", correct: false },
        { text: "{Option D}", correct: false },
      ],
      explanation: "{Why the correct answer is correct AND why wrong answers fail}",
    },
    // ... 4-5 more questions (mix of concept, scenario, calculation types)
  ],
},
```

---

## QUIZ ALLOCATION

Produce quizzes for these modules (key learning checkpoints):

| Competency | Modules with Quizzes |
|------------|---------------------|
| Market Intelligence | 1.1, 1.2, 1.6, 1.7 |
| Client Discovery | 2.2, 2.4, 2.5 |
| Property Matching | 3.2, 3.3, 3.7 |
| Transaction Management | 4.1, 4.3, 4.5 |
| Objection Navigation | 5.1, 5.5 |
| Relationship Stewardship | 6.2 |

Total: 16 quizzes across 39 modules.

---

## REFERENCE DATA FROM SOURCE MATERIALS

Use these exact figures from the Prime Capital training materials:

### Market Statistics (2024-2025)

- Dubai transactions 2024: **169,083 sales** (+42% YoY)
- Total value 2024: **AED 427 billion** (+34% YoY)
- Q1 2025 value: **AED 114 billion**
- Q2 2025 value: **AED 153.8 billion** (+33% vs Q1)
- Average rental yield Dubai: **6.9%**
- DLD registration fee: **4%**
- Golden Visa threshold: **AED 2 million**

### Global Comparison (use in objection handling)

| Market | Avg Yield | Property Tax | Capital Gains Tax |
|--------|-----------|--------------|-------------------|
| Dubai | 6.9% | 0% | 0% |
| London | 3-4% | 2-4% | Up to 28% |
| New York | 3-4.5% | 1-2% | Up to 20% |
| Singapore | 4-6% | ~10% | 0-20% |

### Area Price Points (AED per sq ft)

| Category | Areas | Price Range |
|----------|-------|-------------|
| Affordable | International City, Discovery Gardens, DSO | 770-1,000 |
| Mid-Income | JVC, JVT, Al Furjan, Arjan | 1,300-1,600 |
| Luxury | Business Bay, Dubai Marina, Dubai Hills | 2,000-2,600 |
| Ultra-Luxury | Downtown, Palm Jumeirah | 2,900-4,200+ |

### Key Developers (mention track records)

- **Emaar** — Burj Khalifa, Dubai Mall, Downtown Dubai, Creek Harbour
- **DAMAC** — Damac Hills, Damac Lagoons, Aykon City
- **Nakheel** — Palm Jumeirah, The World Islands, JVC
- **Sobha** — Sobha Hartland, known for quality finishes
- **Meraas** — Bluewaters, City Walk, La Mer
- **Ellington** — Boutique developer, design-focused

---

## PRODUCTION SEQUENCE

Produce content in this order (one competency at a time):

1. **Market Intelligence** — All 8 modules + 4 quizzes
2. **Client Discovery** — All 6 modules + 3 quizzes
3. **Property Matching** — All 7 modules + 3 quizzes
4. **Transaction Management** — All 9 modules + 3 quizzes
5. **Objection Navigation** — All 5 modules + 2 quizzes
6. **Relationship Stewardship** — All 4 modules + 1 quiz

After each competency, pause and confirm before continuing.

---

## BEGIN

Start with **Competency 1: Market Intelligence**.

Research current Dubai real estate market data (2025-2026), find relevant YouTube videos from channels like Tahir Majithia, PropertyFinder, or Bayut, and source appropriate Unsplash images.

Then produce all 8 modules and 4 quizzes following the exact format specification.

**For the first module, demonstrate the full format including:**
- Complete content with dialogue examples and practical frameworks
- 1-2 curated YouTube videos with timestamps
- 2-3 Unsplash image suggestions
- 5-question quiz with scenario-based questions

Confirm you understand all requirements, then begin with Module 1.1: Dubai Real Estate Overview.
```

---

## After Claude Produces Content

### Review Checklist

For each module:
- [ ] Content is 800-1500 words (increased for practical examples)
- [ ] Includes at least 2 dialogue examples ("What to Say")
- [ ] Includes at least 1 worked example or framework
- [ ] Includes "Common Mistakes" section
- [ ] Has 1-3 YouTube videos with working URLs
- [ ] Has 2-4 Unsplash images with alt text
- [ ] Key takeaways are actionable (start with verbs)
- [ ] Navigation links are correct (prev/next)
- [ ] Quiz has 5 questions with scenario-based options

### Verify YouTube Links

Before integrating, spot-check that YouTube URLs:
- Actually exist (not hallucinated)
- Are from credible channels
- Are recent (2023-2025)
- Are in English or have English subtitles

### Integration

Copy the TypeScript output directly into:
- Module content → `app/learn/[competency]/[module]/page.tsx`
- Quiz content → `app/learn/quiz/[id]/page.tsx`

Or use VS Code Copilot: "Add this module content to the moduleContent object"

---

## Estimated Output

| Content Type | Count | Est. Words |
|--------------|-------|------------|
| Modules | 39 | ~50,000 |
| Quizzes | 16 | ~8,000 |
| Videos | ~80 | curated |
| Images | ~120 | curated |
| **Total** | 55 items | ~58,000 words |

This will take Claude approximately **8-10 responses** to complete (one per competency, plus iterations for quality).

---

## Tips for Best Results

1. **Don't rush** — Let Claude complete one competency before moving to the next
2. **Request corrections inline** — "Module 1.3 needs more specific dialogue examples"
3. **Verify multimedia** — Check YouTube URLs actually work before integrating
4. **Test TypeScript** — Paste into VS Code to verify no syntax errors
5. **Review for brand voice** — Flag any pushy or salesy language for revision
6. **Check calculations** — Verify yield and ROI examples use correct formulas
2. **Request corrections inline** — "Module 1.3 needs more specific area examples"
3. **Verify facts** — Spot-check Golden Visa thresholds, DLD fees, developer names
4. **Test TypeScript** — Paste into VS Code to verify no syntax errors before integrating
