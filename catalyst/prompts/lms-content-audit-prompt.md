# LMS Content Structure Audit Prompt

**Use this prompt FIRST in Claude.ai to validate the learning architecture before content production**

---

## Setup Instructions

### 1. Create a New Claude Project (or use existing)

Name it: `Prime Capital LMS Content`

### 2. Upload to Project Knowledge

Upload these files from your codebase:

1. `legacy/lms/prime-capital-learning-architecture-v2.md` — Original competency framework
2. `legacy/lms/prime-capital-training-guide.md` — Source training material
3. `legacy/lms/prime-capital-objection-handling-guide.md` — Objection handling content
4. `legacy/lms/prime-capital-offplan-training-program.md` — Off-plan specifics

### 3. Paste the Audit Prompt Below

---

## The Audit Prompt

```
You are a learning design expert auditing the curriculum structure for Prime Capital Dubai's Learning Management System. Your task is to validate and improve the competency and module outline BEFORE we invest in full content production.

## Context

Prime Capital Dubai is a boutique real estate advisory serving high-net-worth international investors. They're training Real Estate Consultants who need to:

1. Understand Dubai's market, regulations, and opportunities
2. Discover client needs and qualify effectively
3. Match properties to investor goals
4. Navigate transactions smoothly
5. Handle objections professionally
6. Build long-term client relationships

The training must be practical, example-driven, and immediately applicable in client situations. The brand voice is "quiet luxury" — authoritative but never pushy.

## Current Proposed Structure

### COMPETENCY 1: Market Intelligence (8 modules)

| # | Slug | Title | Description |
|---|------|-------|-------------|
| 1.1 | dubai-real-estate-overview | Dubai Real Estate Overview | Market history, growth story, current state, why Dubai now |
| 1.2 | regulatory-framework | Regulatory Framework | RERA, DLD, Ejari, escrow, investor protections |
| 1.3 | market-segments | Market Segments | Off-plan vs secondary vs commercial, when to recommend each |
| 1.4 | key-developers | Key Developers | Major developers (Emaar, DAMAC, Nakheel, Sobha, etc.), track records |
| 1.5 | area-knowledge | Area Knowledge | Dubai's areas, communities, characteristics, price points |
| 1.6 | golden-visa | Golden Visa & Residency | AED 2M threshold, benefits, process, positioning |
| 1.7 | market-trends | Market Trends & Analysis | Reading DXB Interact data, supply/demand, price indices |
| 1.8 | competitive-landscape | Competitive Landscape | Prime Capital positioning, major agencies, differentiation |

### COMPETENCY 2: Client Discovery (6 modules)

| # | Slug | Title | Description |
|---|------|-------|-------------|
| 2.1 | investor-personas | Investor Personas | End-user vs investor vs visa-seeker, nationality patterns |
| 2.2 | discovery-questions | Discovery Questions | Essential questions, how to ask, what to listen for |
| 2.3 | active-listening | Active Listening | Reading between lines, confirming understanding |
| 2.4 | qualification-framework | Qualification Framework | Budget, timeline, decision process, readiness indicators |
| 2.5 | understanding-investment-goals | Understanding Investment Goals | Capital growth vs yield vs lifestyle, matching goals |
| 2.6 | managing-expectations | Managing Expectations | Setting realistic timelines, yields, process expectations |

### COMPETENCY 3: Property Matching (7 modules)

| # | Slug | Title | Description |
|---|------|-------|-------------|
| 3.1 | property-analysis | Property Analysis | Evaluating against client criteria, scoring properties |
| 3.2 | yield-calculations | Yield Calculations | ROI, gross yield, net yield formulas with examples |
| 3.3 | off-plan-evaluation | Off-Plan Evaluation | Developer analysis, payment plans, risk assessment |
| 3.4 | secondary-market | Secondary Market | Resale value factors, condition assessment, negotiation |
| 3.5 | presentation-skills | Property Presentation | Presenting options, storytelling, visual materials |
| 3.6 | viewings-management | Managing Viewings | Scheduling, preparation, conducting viewings |
| 3.7 | comparative-analysis | Comparative Market Analysis | Side-by-side comparisons that help clients decide |

### COMPETENCY 4: Transaction Management (9 modules)

| # | Slug | Title | Description |
|---|------|-------|-------------|
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

| # | Slug | Title | Description |
|---|------|-------|-------------|
| 5.1 | common-objections | Common Objections | 5 objection types (Need, Understanding, Trust, Shortcoming, Tactical) |
| 5.2 | bubble-concerns | Market Bubble Concerns | Data-driven responses to "Is Dubai a bubble?" |
| 5.3 | developer-delays | Developer Delays | Addressing construction timeline concerns |
| 5.4 | hidden-fees | Hidden Fees & Costs | Full transparency on all transaction costs |
| 5.5 | objection-techniques | Objection Handling Techniques | Acknowledge-before-address, evidence-based responses |

### COMPETENCY 6: Relationship Stewardship (4 modules)

| # | Slug | Title | Description |
|---|------|-------|-------------|
| 6.1 | client-communication | Client Communication | Communication standards, response times, professionalism |
| 6.2 | follow-up-systems | Follow-Up Systems | Systematic touchpoints, CRM usage, timing |
| 6.3 | referral-generation | Referral Generation | Earning referrals through service quality |
| 6.4 | long-term-relationships | Long-Term Relationships | Portfolio conversations, repeat business, ongoing value |

**TOTAL: 6 competencies, 39 modules**

---

## Your Audit Tasks

Review the proposed structure against the source materials and your knowledge of real estate training best practices. Provide a detailed assessment covering:

### 1. COMPETENCY AUDIT

For each competency, assess:

- **Completeness**: Does it cover everything a consultant needs in this area?
- **Sequence**: Are modules in the right learning order?
- **Gaps**: What's missing that should be included?
- **Redundancy**: Are any modules duplicating content?
- **Naming**: Are titles clear and professional?

### 2. MODULE-LEVEL RECOMMENDATIONS

For each module, recommend:

- **Keep as-is**: Module is well-defined
- **Rename**: Suggest better title
- **Split**: Module covers too much, should be 2+ modules
- **Merge**: Module is too narrow, combine with another
- **Move**: Module belongs in different competency
- **Add**: New module needed (specify where)
- **Remove**: Module is unnecessary (explain why)

### 3. CRITICAL GAPS ANALYSIS

Based on the source materials, identify any critical topics NOT covered:

- Dubai-specific knowledge gaps
- Client journey gaps
- Compliance/regulatory gaps
- Practical skill gaps

### 4. SEQUENCING REVIEW

Review the overall learning journey:

- Should competencies be in a different order?
- Are there dependencies between modules that require resequencing?
- What's the recommended path for a new consultant?

### 5. SCOPE ASSESSMENT

Evaluate the overall scope:

- Is 39 modules too many, too few, or about right?
- Estimated total learning time at 25-35 min per module
- Recommendations for prioritization (what's essential vs nice-to-have)

---

## Output Format

Structure your response as:

### Executive Summary
[2-3 sentences on overall assessment]

### Competency-by-Competency Audit
[Detailed assessment of each competency]

### Recommended Changes
[Table of specific changes: Add/Remove/Rename/Split/Merge/Move]

### Critical Gaps
[List of missing topics with recommended placement]

### Revised Structure (if changes needed)
[Updated competency/module list incorporating your recommendations]

### Final Recommendation
[Go/No-Go for content production, with any conditions]

---

## Begin Audit

Review the source materials I've uploaded, then provide your comprehensive audit of the proposed learning structure. Be specific and actionable — I need to make decisions based on your analysis.
```

---

## What to Do With the Results

After Claude completes the audit:

1. **Review the recommendations** — Do they make sense for your client's needs?
2. **Share the output here** — I'll update the content generation prompt with the revised structure
3. **Approve the final structure** — Before we commit to producing 39+ modules of content

This audit step can save significant rework if we catch structural issues early.
