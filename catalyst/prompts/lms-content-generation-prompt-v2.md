# LMS Content Generation Prompt v2.0

**Skills-First Architecture — Revised After Curriculum Audit**

---

## Setup Instructions

### 1. Create a New Claude Project

Name it: `Prime Capital LMS Content v2`

### 2. Upload to Project Knowledge

Upload these files from your codebase:

1. `catalyst/specs/lms-content-format.md` — **CRITICAL: The output format specification**
2. `legacy/lms/prime-capital-learning-architecture-v2.md` — Original competency framework (for reference)
3. `legacy/lms/prime-capital-training-guide.md` — Source training material (market data, stats, processes)
4. `legacy/lms/prime-capital-objection-handling-guide.md` — Objection handling content
5. `legacy/lms/prime-capital-offplan-training-program.md` — Off-plan specifics & qualification frameworks

### 3. Paste the Prompt Below

---

## The Prompt

```
You are creating world-class professional training content for Prime Capital Dubai, a boutique real estate advisory serving high-net-worth international investors.

## Your Mission

Research and produce ALL learning content for a complete Learning Management System following the **Skills-First Architecture**. This covers 8 competencies with 60 modules total, plus knowledge-check quizzes, AI simulation prompts, and a Scenario Bank.

This content must be:
- **Skills-first** — Every module answers "What can the consultant DO after completing this?"
- **Script-driven** — Talk tracks and exact words consultants can use immediately
- **Simulation-ready** — AI practice prompts for unlimited skill repetition
- **Practical** — Immediately applicable in real client situations
- **Multimedia-enriched** — Curated YouTube videos and imagery

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

---

## CURRICULUM STRUCTURE (8 COMPETENCIES, 60 MODULES)

### COMPETENCY 0: Foundations (5 modules)

Purpose: Equip consultants with company context, compliance requirements, essential tools, and daily workflow habits before they engage with market content.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 0.1 | company-orientation | Prime Capital Orientation | Knowledge | Company history, founders (Tahir, Shaad, Rohit), services, brand positioning, "quiet luxury" voice |
| 0.2 | code-of-conduct | Professional Standards | Knowledge + Commitment | Code of conduct, dress code, ethics, accountability—ends with signed acknowledgment |
| 0.3 | broker-licensing | Broker Licensing & Compliance | Knowledge + Checklist | Trakheesi registration, BRN requirements, RERA certification, advertising rules, QR codes |
| 0.4 | essential-tools | Essential Tools Overview | Knowledge + Demo | Dubai-REST, Trakheesi, DXB Interact, CRM overview, Property Finder/Bayut basics |
| 0.5 | daily-workflow | Daily Workflow & Productivity | Skills | Morning routine, time-blocking, CRM hygiene, weekly review rhythm, what a successful day looks like |

**Module 0.5 Must Include:**
- Morning routine (first 60 minutes)
- Time-blocking framework
- CRM discipline rules
- Weekly pipeline review
- AI Simulation: "It's Monday 8:45am. Walk me through your first 90 minutes."

---

### COMPETENCY 1: Market Intelligence (10 modules)

Purpose: Build deep Dubai market knowledge that creates client confidence.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 1.1 | dubai-overview | Dubai Real Estate Overview | Knowledge | Market history, 2002 freehold law, cycles (2008, 2014, 2020), current state, why Dubai now |
| 1.2 | competitive-landscape | Prime Capital Positioning | Knowledge + Script | Where Prime Capital fits, major competitors, differentiation—includes "Why Prime Capital" talk track |
| 1.3 | regulatory-framework | Regulatory Framework | Knowledge | RERA, DLD, Ejari, escrow, investor protections, Oqood system |
| 1.4 | offplan-vs-ready | Off-Plan vs Ready Properties | Knowledge + Script | Key differences, when to recommend each—includes comparison talk track |
| 1.5 | key-developers | Key Developers | Knowledge | Emaar, DAMAC, Nakheel, Sobha, Ellington—track records, specialties, reputation signals |
| 1.6 | area-knowledge | Dubai Areas & Communities | Knowledge | Geographic overview, price bands (affordable/mid/luxury/ultra), community characteristics |
| 1.7 | area-deep-dives | Area Deep-Dives by Segment | Knowledge + Application | Detailed profiles: JVC, Business Bay, Downtown, Dubai Hills, Palm—yield data, buyer profiles |
| 1.8 | golden-visa | Golden Visa & Residency | Knowledge + Script | AED 2M threshold, 10-year visa, 2-year investor visa, 5-year retirement—includes positioning talk track |
| 1.9 | economic-vision | Dubai's Economic Vision | Knowledge | D33 Agenda, 2040 Master Plan, population projections, infrastructure pipeline—confidence builders |
| 1.10 | global-comparison | Dubai vs Global Markets | Knowledge + Script | Yield comparison (6.9% vs 3-4%), tax advantages, ownership rights—includes "Why Dubai over London/Singapore" talk track |

**AI Simulations for Competency 1:**
- "A client asks: Is Dubai in a bubble? The prices seem unsustainable."
- "A client from Hong Kong asks why they should invest in Dubai instead of Singapore."
- "A client wants to know the difference between Emaar and DAMAC."

---

### COMPETENCY 2: Client Discovery (7 modules)

Purpose: Develop the questioning and listening skills to deeply understand what investors actually want—and qualify them efficiently.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 2.1 | investor-personas | Investor Personas | Knowledge | End-user vs investor vs visa-seeker, nationality patterns (Indian, Pakistani, British, Russian, Chinese), motivation differences |
| 2.2 | discovery-endusers | Discovery: End-Users | Skills + Script | Questions for buyers who will live in the property—current situation, preferences, timeline, family needs |
| 2.3 | discovery-investors | Discovery: Investors | Skills + Script | Questions for capital growth vs yield seekers—objectives, timeline, portfolio, experience level |
| 2.4 | discovery-visa | Discovery: Visa-Seekers | Skills + Script | Questions for Golden Visa buyers—residency goals, usage plans, budget optimization for 2M threshold |
| 2.5 | active-listening | Active Listening | Skills | Reading between lines, mirroring, confirming understanding, noting emotional cues |
| 2.6 | qualification-framework | BANT+ Qualification | Skills + Script | Budget, Authority, Need, Timeline + Dubai-specific factors (funds location, financing needs, travel plans) |
| 2.7 | managing-expectations | Managing Expectations | Skills + Script | Setting realistic timelines, yield expectations, construction phases—includes "expectation reset" talk track |

**Module 2.3 Must Include Full Script:**
- Opening question
- Investment objective questions
- Timeline questions
- Experience questions
- Portfolio questions
- Budget qualification
- Financing questions

**AI Simulations for Competency 2:**
- "A Russian investor says he wants 'something good in Dubai.' Qualify him."
- "An Indian family wants to buy for their son studying in Dubai. Discover their real needs."
- "A British expat currently renting wants to buy but seems hesitant about timing."

---

### COMPETENCY 3: Sales Mastery — NEW (8 modules)

Purpose: Build the practical sales skills for off-plan property conversion—from first contact through to commitment. This is the CORE SKILLS competency.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 3.1 | lead-sources | Off-Plan Lead Sources | Knowledge | Where leads come from: developer events, portal enquiries, referrals, social media, walk-ins—volume and quality by source |
| 3.2 | first-contact | First Contact Excellence | Skills + Script | The first 60 seconds—what to say when a portal lead picks up, developer event follow-up, speed-to-lead importance |
| 3.3 | needs-analysis | Needs Analysis Conversation | Skills + Script | Full discovery call structure—building rapport, asking questions, summarizing needs, proposing next step |
| 3.4 | offplan-presentation | Off-Plan Presentation Skills | Skills + Script | How to present a development: storytelling, developer credibility, payment plan walkthrough, handling "I'll think about it" |
| 3.5 | eoi-booking | EOI & Booking Conversion | Skills + Script | Moving from interest to Expression of Interest—urgency creation, limited inventory positioning, booking process walkthrough |
| 3.6 | followup-sequences | Follow-Up Sequences | Skills + Templates | Day 1, Day 3, Day 7, Day 14 follow-up structure—messages that don't feel desperate, re-engagement strategies |
| 3.7 | closing-techniques | Closing Techniques | Skills + Script | Assumptive close, alternative close, urgency close, handling "I need to discuss with my spouse" |
| 3.8 | pipeline-management | Pipeline Management | Skills | Stages of a deal, when to push vs nurture, recognizing dead leads, weekly pipeline review discipline |

**Module 3.2 Must Include:**
- The 60-second window concept
- Script: Portal Lead Response (Immediate Call-Back)
- "If they're busy" script
- Speed-to-lead data (5 min = 21x more likely)
- Exercise: Record yourself responding to a portal lead

**Module 3.6 Must Include:**
- Full follow-up sequence table (Day 0, 1, 3, 5, 7, 14)
- "What NOT to do" examples
- "What TO do" with specific message frameworks

**AI Simulations for Competency 3:**
- "A lead just enquired about DAMAC Lagoons. Call them back."
- "Present Emaar Beachfront to a first-time investor focused on rental yield."
- "The client says 'I'll think about it.' Get them to commit to a next step."

---

### COMPETENCY 4: Property Matching (7 modules)

Purpose: Develop the analytical and presentation skills to match the right property to each investor's specific goals.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 4.1 | property-analysis | Property Analysis Framework | Skills | Evaluating properties against client criteria—scoring methodology, red flags, deal-breakers |
| 4.2 | yield-calculations | Yield & ROI Calculations | Skills + Calculator | Gross yield, net yield, ROI with Dubai examples—must be able to calculate live with clients |
| 4.3 | offplan-evaluation | Off-Plan Evaluation | Skills + Checklist | Developer track record, project location, payment plan analysis, construction risk assessment |
| 4.4 | payment-plan-analysis | Payment Plan Comparison | Skills + Script | 80/20 vs 60/40 vs post-handover—how to explain implications, which suits which buyer |
| 4.5 | secondary-evaluation | Secondary Market Evaluation | Skills | Resale value factors, condition assessment, tenant situations, negotiation leverage points |
| 4.6 | presentation-skills | Property Presentation | Skills + Script | Presenting 2-3 options effectively, storytelling, visual materials, avoiding overwhelm |
| 4.7 | comparative-analysis | Comparative Market Analysis | Skills | Side-by-side comparisons that help clients decide—what to include, how to frame |

**Module 4.4 Must Include Full Script:**
Complete payment plan comparison dialogue showing 60/40 vs 80/20.

---

### COMPETENCY 5: Transaction Management (12 modules)

Purpose: Master the end-to-end transaction process for both off-plan and secondary properties.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 5.1 | offplan-journey | Off-Plan Transaction Journey | Knowledge + Checklist | EOI → Booking → SPA → Oqood → Construction → Handover—timeline, stakeholders, consultant's role at each stage |
| 5.2 | secondary-journey | Secondary Transaction Journey | Knowledge + Checklist | Offer → MOU → NOC → Transfer—timeline, stakeholders, key differences from off-plan |
| 5.3 | rera-contracts | RERA Smart Contracts | Knowledge + Practice | Form A (listing), Form B (buyer), Form F (sale), Form I (agent-to-agent)—when and how to complete each |
| 5.4 | eoi-process | EOI & Booking Process | Skills + Checklist | Expression of Interest, booking deposit ($10K), booking forms, moving to SPA |
| 5.5 | spa-process | SPA & Down Payment | Skills + Script | Sales Purchase Agreement walkthrough, down payment collection, common client questions |
| 5.6 | oqood-registration | Oqood Registration | Knowledge + Checklist | Initial sales contract registration, what clients need to provide, timeline |
| 5.7 | escrow-protection | Escrow Accounts | Knowledge + Script | How escrow protects buyers, RERA oversight—includes client education talk track |
| 5.8 | mortgage-process | Mortgage Process | Knowledge + Referral Script | UAE mortgage options, LTV ratios (80% resident, 50% non-resident), bank requirements, when to refer |
| 5.9 | mou-formf | MOU & Form F | Skills + Checklist | Memorandum of Understanding, deposits, terms—for secondary transactions |
| 5.10 | noc-transfer | NOC & Transfer | Knowledge + Checklist | No Objection Certificate, DLD transfer, trustee office process, costs breakdown |
| 5.11 | handover-process | Handover Process | Skills + Checklist | Snagging, final payments, key collection, defect liability period |
| 5.12 | post-transaction | Post-Transaction Service | Skills | After-sale support, property management referrals, portfolio conversation opener |

---

### COMPETENCY 6: Objection Navigation (7 modules)

Purpose: Build confidence in handling resistance and develop emotional resilience.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 6.1 | objection-framework | Objection Handling Framework | Skills | Five types (Need, Understanding, Trust, Shortcoming, Tactical), acknowledge-before-address methodology |
| 6.2 | market-objections | Market & Timing Objections | Skills + Scripts | "Is Dubai a bubble?", "Should I wait for prices to drop?", "The market is too hot" |
| 6.3 | developer-objections | Developer & Project Objections | Skills + Scripts | "What if they delay?", "I've heard bad things about [developer]", "Off-plan is risky" |
| 6.4 | price-fee-objections | Price & Fee Objections | Skills + Scripts | "It's too expensive", "Hidden fees", "I can get it cheaper direct from developer" |
| 6.5 | stall-objections | Stall & Delay Objections | Skills + Scripts | "I need to think about it", "I need to discuss with my spouse", "Send me more information" |
| 6.6 | strategic-followup | Strategic Follow-Up | Skills | 5+ touchpoint strategy, persistence without pressure, re-engagement sequences |
| 6.7 | failure-resilience | Failure Scenarios & Resilience | Skills | **Deals that fall through, clients who ghost, losing to competitors, developer delays—emotional management and practical recovery** |

**Module 6.7 Must Include:**
- Scenario 1: The Ghost (client disappears after 4 viewings)
- Scenario 2: Lost to Another Agent
- Scenario 3: Deal Falls Through at NOC Stage
- Scenario 4: Developer Delays Handover
- Resilience Practices (daily, weekly, after a loss)
- Mindset Shifts
- "Permission to Close" script

---

### COMPETENCY 7: Relationship Stewardship (4 modules)

Purpose: Build systems and habits for long-term client relationships.

| # | Slug | Title | Type | Focus |
|---|------|-------|------|-------|
| 7.1 | client-communication | Client Communication Standards | Skills | Response time expectations, channel preferences, professionalism, "quiet luxury" voice in practice |
| 7.2 | follow-up-systems | Follow-Up Systems | Skills | CRM-based touchpoints, timing, lifecycle stages |
| 7.3 | referral-generation | Referral Generation | Skills + Script | Earning referrals through service, when and how to ask, referral program structure |
| 7.4 | long-term-relationships | Long-Term Client Development | Skills | Portfolio conversations, market updates for past clients, repeat business cultivation |

---

## CONTENT REQUIREMENTS

### Every Module MUST Include:

**1. Talk Tracks / Scripts**
For any module marked "Skills + Script", provide exact words:

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
```

**3. Common Mistakes & Corrections**

```markdown
### Common Mistakes

❌ **Wrong:** "This property is a great investment, you should act fast."
✅ **Right:** "Based on your yield requirements, this property offers 6.8% gross yield. Here's how that compares to your other options."
```

**4. Checklists & Job Aids**

```markdown
### Pre-Meeting Checklist

Before any client meeting, confirm:

- [ ] Client's budget range and payment preference (cash/mortgage)
- [ ] Investment goal (yield, growth, lifestyle, visa)
- [ ] Timeline for purchase
```

**5. AI Simulation Prompt**
EVERY skills module must include an AI simulation prompt at the end:

```markdown
## AI Practice

Use this prompt to practice with an AI assistant:

> You are playing [PERSONA]. [Situation details]. The consultant's job is to [objective]. Provide feedback at the end rating: Needs Work / Competent / Strong.
```

---

## AI SIMULATION PROMPT FORMAT

For each AI simulation, provide:

```markdown
## AI Practice: [Scenario Name]

### Simulation Setup

You are playing: **[Name]**, [age]-year-old [nationality] [profession]. [Brief background].

**Your situation (reveal gradually):**
- Budget: [Range, but be vague initially]
- Goal: [Primary motivation]
- Timeline: [Timeframe]
- Concerns: [Hidden worries]
- Decision process: [Who else is involved]

**Your communication style:**
- [Trait 1]
- [Trait 2]
- [How they respond to good/bad consultants]

**The consultant's job:**
- [Objective 1]
- [Objective 2]
- [Objective 3]

End the simulation after 8-10 exchanges or when a next step is agreed.

**Provide feedback:**
- What the consultant did well
- What they missed or could improve
- Rating: Needs Work / Competent / Strong
```

---

## YOUTUBE VIDEO CURATION

For EACH module, research and include 1-3 relevant YouTube videos.

**Priority Channels:**
- Tahir Majithia (Prime Capital co-founder)
- Dubai Property Guy
- Firas Al-Msaddi (fäm Properties)
- PropertyFinder UAE
- Bayut
- DXB Interact official tutorials

**Selection Criteria:**
- Recent (2024-2025 preferred, 2023 acceptable)
- Professional quality, accurate information
- Duration under 15 minutes
- English language

**Output Format:**
```typescript
videos: [
  {
    title: "Video Title Here",
    url: "https://www.youtube.com/watch?v=XXXXX",
    duration: "8:24",
    description: "Why this video is relevant",
    timestamp: "2:30", // Optional
  },
],
```

---

## IMAGE CURATION

For EACH module, suggest 2-4 images from Unsplash or Pexels.

**Search Terms by Competency:**

| Competency | Search Terms |
|------------|--------------|
| Foundations | "office setup", "professional workspace", "business planning", "morning routine" |
| Market Intelligence | "Dubai skyline", "Dubai Marina aerial", "luxury apartment Dubai" |
| Client Discovery | "business meeting", "consultation", "professional handshake" |
| Sales Mastery | "phone call business", "sales presentation", "closing deal", "follow up" |
| Property Matching | "luxury apartment viewing", "property tour", "Dubai villa" |
| Transaction Management | "signing documents", "contract signing", "keys handover" |
| Objection Navigation | "confident professional", "negotiation", "thoughtful conversation" |
| Relationship Stewardship | "follow up call", "customer service", "referral handshake" |

---

## REFERENCE DATA

### Market Statistics (2024-2025)

- Dubai transactions 2024: **169,083 sales** (+42% YoY)
- Total value 2024: **AED 427 billion** (+34% YoY)
- Q1 2025 value: **AED 114 billion**
- Q2 2025 value: **AED 153.8 billion** (+33% vs Q1)
- Average rental yield Dubai: **6.9%**
- DLD registration fee: **4%**
- Golden Visa threshold: **AED 2 million**

### Global Comparison

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

### Key Developers

- **Emaar** — Burj Khalifa, Dubai Mall, Downtown Dubai, Creek Harbour
- **DAMAC** — Damac Hills, Damac Lagoons, Aykon City
- **Nakheel** — Palm Jumeirah, The World Islands, JVC
- **Sobha** — Sobha Hartland, known for quality finishes
- **Meraas** — Bluewaters, City Walk, La Mer
- **Ellington** — Boutique developer, design-focused

---

## QUIZ ALLOCATION

Produce quizzes for these modules (key learning checkpoints):

| Competency | Modules with Quizzes |
|------------|---------------------|
| 0: Foundations | 0.3, 0.5 |
| 1: Market Intelligence | 1.1, 1.3, 1.8, 1.10 |
| 2: Client Discovery | 2.3, 2.6 |
| 3: Sales Mastery | 3.2, 3.5, 3.7 |
| 4: Property Matching | 4.2, 4.4 |
| 5: Transaction Management | 5.1, 5.3, 5.9 |
| 6: Objection Navigation | 6.1, 6.2, 6.7 |
| 7: Relationship Stewardship | 7.3 |

**Total: 20 quizzes across 60 modules**

Quiz questions must test APPLICATION, not recall:
- Scenario-based: "A client says X. What do you do?"
- NOT: "What does RERA stand for?"

---

## SCENARIO BANK (SEPARATE DELIVERABLE)

After completing all modules, produce a **Scenario Bank** with 75 practice scenarios:

| Category | Count | Examples |
|----------|-------|----------|
| First Contact | 10 | Portal lead response, developer event follow-up, cold lead re-engagement |
| Discovery | 15 | End-user, investor, visa-seeker, vague buyer, difficult qualifier |
| Presentation | 10 | Off-plan walkthrough, payment plan comparison, developer credibility |
| Objections | 20 | Bubble, delays, fees, competition, stalls, spouse consultation |
| Closing | 10 | EOI commitment, overcoming hesitation, assumptive close |
| Difficult Situations | 10 | Ghosted client, lost deal, developer delay, angry client |

**Each scenario includes:**
1. Situation
2. Persona
3. Objective
4. Key Challenges
5. Common Mistakes
6. Model Approach
7. Script/Talk Track
8. AI Simulation Prompt

---

## PRODUCTION SEQUENCE

Produce content in this order (one competency at a time):

1. **Competency 0: Foundations** — 5 modules + 2 quizzes
2. **Competency 1: Market Intelligence** — 10 modules + 4 quizzes
3. **Competency 2: Client Discovery** — 7 modules + 2 quizzes
4. **Competency 3: Sales Mastery** — 8 modules + 3 quizzes
5. **Competency 4: Property Matching** — 7 modules + 2 quizzes
6. **Competency 5: Transaction Management** — 12 modules + 3 quizzes
7. **Competency 6: Objection Navigation** — 7 modules + 3 quizzes
8. **Competency 7: Relationship Stewardship** — 4 modules + 1 quiz
9. **Scenario Bank** — 75 scenarios organized by category

After each competency, pause and confirm before continuing.

---

## OUTPUT FORMAT

### Module Entry

```typescript
"{module-slug}": {
  title: "{Module Title}",
  duration: "{XX} min",
  type: "{Knowledge | Skills | Skills + Script | Knowledge + Checklist}",
  content: `
## Introduction

[Opening paragraph — why this matters]

## [Main Section]

[Core content]

### What to Say

**Client:** "[Question]"

**Consultant:** "[Response]"

### Common Mistakes

❌ **Wrong:** [Bad approach]
✅ **Right:** [Good approach]

### Checklist

- [ ] Item 1
- [ ] Item 2

## AI Practice

> [Simulation prompt for this module]

## Why This Matters

[Practical application]
  `,
  keyTakeaways: [
    "[Actionable takeaway 1]",
    "[Actionable takeaway 2]",
    "[Actionable takeaway 3]",
  ],
  videos: [...],
  images: {...},
  prevModule: { slug: "{prev-slug}", title: "{Prev Title}" },
  nextModule: { slug: "{next-slug}", title: "{Next Title}" },
  quizId: "{competency-slug}-{number}",
},
```

### Quiz Entry

```typescript
"{competency-slug}-{number}": {
  title: "{Quiz Title}",
  moduleSlug: "{module-slug}",
  competencySlug: "{competency-slug}",
  questions: [
    {
      id: "q1",
      question: "{Scenario-based question}",
      options: [
        { text: "{Option A}", correct: false },
        { text: "{Option B}", correct: true },
        { text: "{Option C}", correct: false },
        { text: "{Option D}", correct: false },
      ],
      explanation: "{Why correct is correct, why wrong is wrong}",
    },
  ],
},
```

---

## BEGIN

Start with **Competency 0: Foundations**.

Research Prime Capital's company information, Dubai broker licensing requirements (RERA, Trakheesi), and find relevant YouTube videos.

Produce all 5 modules and 2 quizzes following the exact format specification.

**For Module 0.1, demonstrate the full format including:**
- Complete content with brand voice examples
- "Quiet luxury" communication standards
- 1-2 curated YouTube videos
- 2-3 Unsplash image suggestions
- AI practice prompt

Confirm you understand all requirements, then begin with Module 0.1: Prime Capital Orientation.
```

---

## After Claude Produces Content

### Review Checklist

For each module:
- [ ] Content is 1000-2000 words (skills modules may be longer)
- [ ] Includes talk tracks/scripts where marked "Skills + Script"
- [ ] Includes at least 1 worked example or framework
- [ ] Includes "Common Mistakes" section
- [ ] Includes AI Simulation prompt for skills modules
- [ ] Has 1-3 YouTube videos with working URLs
- [ ] Has 2-4 Unsplash images with alt text
- [ ] Key takeaways are actionable (start with verbs)
- [ ] Navigation links are correct (prev/next)
- [ ] Quiz has 5 scenario-based questions

### Verify YouTube Links

Before integrating, spot-check that YouTube URLs:
- Actually exist (not hallucinated)
- Are from credible channels
- Are recent (2023-2025)
- Are in English or have English subtitles

---

## Summary Metrics

| Content Type | Count |
|--------------|-------|
| Competencies | 8 |
| Modules | 60 |
| Quizzes | 20 |
| AI Simulations | ~45 |
| Scenario Bank | 75 |
| YouTube Videos | ~100 |
| Images | ~150 |

**Estimated Learning Time:**
- Streamlined Path (35 modules): 15-20 hours
- Extended Path (60 modules): 26-34 hours

---

## Tips for Best Results

1. **Don't rush** — Let Claude complete one competency before moving to the next
2. **Request script refinement** — "Module 3.2 needs a more natural-sounding script"
3. **Verify multimedia** — Check YouTube URLs actually work
4. **Test TypeScript** — Paste into VS Code to verify no syntax errors
5. **Review for brand voice** — Flag any pushy or salesy language
6. **Prioritize Sales Mastery** — Competency 3 is the most critical for new consultants
