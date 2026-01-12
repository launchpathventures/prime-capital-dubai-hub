# LMS Audio Script Generation — Agent Prompts

One-shot prompts for generating all audio content per competency.

---

## How to Use

1. Copy the relevant competency prompt below
2. Run in Claude/Copilot with the module content attached
3. Review output for accuracy and tone
4. Save scripts to `content/lms/{competency}/audio/`

---

## Competency 0: Foundations (5 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the FOUNDATIONS competency.

CONTEXT:
Foundations is the onboarding competency. New consultants learn who Prime Capital is, professional standards, compliance basics, tools, and daily workflow. The tone should be welcoming but professional — setting expectations for excellence.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words): Why this matters, 3-4 essentials, key takeaway
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)

FORMAT:
Use this exact format for each module:

===
MODULE 0.X: [Title]
TYPE: [knowledge/skills]
===

### INTRO (60-90 seconds)
[Script text - no markdown, written for speech]

### WALKTHROUGH (if skills type, 2-4 minutes)
[Script text - no markdown, written for speech]

---

MODULES TO GENERATE:

0.1 Prime Capital Orientation (knowledge)
- Who we are, what makes us different, the advisory model
- Consultants must understand and articulate our positioning

0.2 Professional Standards (knowledge)
- Code of conduct, communication standards, client expectations
- Sets the bar for professional behavior

0.3 Broker Licensing & Compliance (knowledge)
- RERA registration, legal requirements, compliance basics
- Non-negotiable foundation for credibility

0.4 Essential Tools Overview (knowledge)
- CRM, communication platforms, property databases
- Tools they'll use daily

0.5 Daily Workflow & Productivity (skills)
- Morning routines, time-blocking, pipeline reviews
- How top performers structure their day

VOICE GUIDELINES:
- Direct, confident, no corporate fluff
- "Here's what matters..." not "In this module we will explore..."
- Reference real Dubai context (RERA, areas, market dynamics)
- Acknowledge the learning curve without being patronizing

Generate all scripts now.
```

---

## Competency 1: Market Intelligence (10 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the MARKET INTELLIGENCE competency.

CONTEXT:
Market Intelligence covers Dubai market knowledge — from regulatory framework to area expertise to competitive positioning. This is the foundation of credibility. Consultants who don't know the market can't advise clients.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words): Why this matters, 3-4 essentials, key takeaway
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills-script modules: DEMO (3-5 min / ~600-700 words) with weak/strong examples

FORMAT:
===
MODULE 1.X: [Title]
TYPE: [knowledge/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### DEMO (if skills-script type, 3-5 minutes)
[Script with: Setup → Weak example → Coach analysis → Strong example → Coach analysis → Key difference]

---

MODULES TO GENERATE:

1.1 Dubai Real Estate Overview (knowledge)
- Market size, growth trajectory, key drivers
- The 30,000-foot view every consultant needs

1.2 Prime Capital Positioning (skills-script)
- How to articulate what makes PC different
- Demo scenario: Introducing PC at networking event

1.3 Regulatory Framework (knowledge)
- RERA, DLD, legal structure
- The rules of the game

1.4 Off-Plan vs Ready Properties (skills-script)
- Explaining options to clients based on their goals
- Demo scenario: Client asking "which is better for me?"

1.5 Key Developers (knowledge)
- Emaar, DAMAC, Nakheel, Sobha, etc.
- Track records, strengths, red flags

1.6 Dubai Areas & Communities (knowledge)
- Geographic overview, lifestyle segments
- Where different client types typically buy

1.7 Area Deep-Dives by Segment (knowledge)
- Detailed area profiles by investor type
- Reference material for matching

1.8 Golden Visa & Residency (skills-script)
- Explaining visa pathways and requirements
- Demo scenario: Visa-focused client inquiry

1.9 Dubai Economic Vision (knowledge)
- D33, economic diversification, future outlook
- Why Dubai's trajectory matters to investors

1.10 Dubai vs Global Markets (skills-script)
- Positioning Dubai against London, Singapore, etc.
- Demo scenario: "Why Dubai over other markets?"

VOICE GUIDELINES:
- Authoritative but accessible
- Use specific numbers, areas, examples
- For demos: weak examples should feel painfully familiar, strong examples should feel achievable

Generate all scripts now.
```

---

## Competency 2: Client Discovery (7 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the CLIENT DISCOVERY competency.

CONTEXT:
Client Discovery is about understanding before prescribing. Most agents jump to properties immediately. Prime Capital consultants discover goals, concerns, and criteria first. This competency teaches how to ask the right questions and truly listen.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 2.X: [Title]
TYPE: [knowledge/skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

2.1 Investor Personas (knowledge)
- End-users vs investors vs visa-seekers
- Different motivations, different approaches

2.2 Discovery: End-Users (skills-script)
- Discovery conversation with families/relocators
- Demo scenario: UK couple relocating with children

2.3 Discovery: Investors (skills-script)
- Discovery conversation with yield-focused investors
- Demo scenario: Investor asking about returns

2.4 Discovery: Visa-Seekers (skills-script)
- Discovery conversation with Golden Visa clients
- Demo scenario: Client primarily interested in residency

2.5 Active Listening (skills)
- Listening techniques, reading between the lines
- Walkthrough: How to listen in practice

2.6 BANT+ Qualification (skills-script)
- Budget, Authority, Need, Timeline + Motivation
- Demo scenario: Qualifying a new inbound lead

2.7 Managing Expectations (skills-script)
- Setting realistic expectations without losing the deal
- Demo scenario: Client with unrealistic price/yield expectations

VOICE GUIDELINES:
- Empathetic but professional
- Emphasize curiosity over assumption
- For demos: show how questions reveal what clients really want

Generate all scripts now.
```

---

## Competency 3: Sales Mastery (8 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the SALES MASTERY competency.

CONTEXT:
Sales Mastery covers the consultative sales process — from first contact through closing. Prime Capital's approach is advisory, not pushy. We guide decisions rather than pressure them. This competency teaches how to move deals forward while maintaining trust.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 3.X: [Title]
TYPE: [knowledge/skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

3.1 Off-Plan Lead Sources (knowledge)
- Where leads come from, quality indicators
- Understanding your pipeline sources

3.2 First Contact Excellence (skills-script)
- The critical first response to an inquiry
- Demo scenario: Responding to website inquiry

3.3 Needs Analysis Conversation (skills-script)
- Deep discovery meeting structure
- Demo scenario: First proper consultation call

3.4 Off-Plan Presentation Skills (skills-script)
- Presenting new launches effectively
- Demo scenario: Walking through a new project

3.5 EOI & Booking Conversion (skills-script)
- Moving from interest to commitment
- Demo scenario: Client interested but hesitating on EOI

3.6 Follow-Up Sequences (skills)
- Building effective follow-up cadences
- Walkthrough: Structuring your follow-up system

3.7 Closing Techniques (skills-script)
- Asking for the decision without pressure
- Demo scenario: Client ready but needs the ask

3.8 Pipeline Management (skills)
- CRM hygiene, stage management, forecasting
- Walkthrough: Weekly pipeline review process

VOICE GUIDELINES:
- Confident but not aggressive
- "Guide the decision" not "close the deal"
- For demos: show consultative approach vs pushy sales

Generate all scripts now.
```

---

## Competency 4: Property Matching (7 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the PROPERTY MATCHING competency.

CONTEXT:
Property Matching is the analytical competency — evaluating properties, calculating returns, comparing options. This is where expertise shows. Clients trust consultants who can run the numbers and explain them clearly.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 4.X: [Title]
TYPE: [skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

4.1 Property Analysis Framework (skills)
- Systematic property evaluation approach
- Walkthrough: Analyzing a property step-by-step

4.2 Yield & ROI Calculations (skills)
- Gross yield, net yield, ROI projections
- Walkthrough: Running the numbers correctly

4.3 Off-Plan Evaluation (skills)
- Assessing off-plan projects and developers
- Walkthrough: Due diligence checklist

4.4 Payment Plan Comparison (skills-script)
- Explaining and comparing payment structures
- Demo scenario: Comparing two payment plans for client

4.5 Secondary Market Evaluation (skills)
- Assessing resale properties
- Walkthrough: Resale property analysis

4.6 Property Presentation (skills-script)
- Presenting shortlisted properties effectively
- Demo scenario: Presenting three options to client

4.7 Comparative Market Analysis (skills)
- Building and presenting CMAs
- Walkthrough: Creating a CMA

VOICE GUIDELINES:
- Analytical and precise
- Use specific numbers and examples
- For walkthroughs: step-by-step practical guidance
- For demos: show expertise through clear explanation

Generate all scripts now.
```

---

## Competency 5: Transaction Management (12 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the TRANSACTION MANAGEMENT competency.

CONTEXT:
Transaction Management covers the end-to-end deal process — from EOI to handover and beyond. This is where deals succeed or fail. Clients need guidance through unfamiliar processes, and consultants must manage complexity without creating stress.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 5.X: [Title]
TYPE: [knowledge/skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

5.1 Off-Plan Transaction Journey (knowledge)
- End-to-end off-plan process overview
- What happens at each stage

5.2 Secondary Transaction Journey (knowledge)
- End-to-end resale process overview
- Key differences from off-plan

5.3 RERA Smart Contracts (knowledge)
- Digital contract system, requirements
- The new standard for transactions

5.4 EOI & Booking Process (skills)
- Processing an EOI correctly
- Walkthrough: EOI submission step-by-step

5.5 SPA & Down Payment (skills-script)
- Walking client through SPA signing
- Demo scenario: Explaining SPA to first-time buyer

5.6 Oqood Registration (knowledge)
- Off-plan registration system
- What it is and why it matters

5.7 Escrow Accounts (skills-script)
- Explaining escrow to clients
- Demo scenario: Nervous client asking about payment safety

5.8 Mortgage Process (knowledge)
- Dubai mortgage landscape, process
- Key information for financed purchases

5.9 MOU & Form F (skills)
- Secondary transaction documents
- Walkthrough: Completing MOU correctly

5.10 NOC & Transfer (knowledge)
- Developer NOC process, DLD transfer
- Final steps in secondary transactions

5.11 Handover Process (skills)
- Managing handover day
- Walkthrough: Handover checklist and process

5.12 Post-Transaction Service (skills)
- Ongoing client service after closing
- Walkthrough: Setting up post-sale touchpoints

VOICE GUIDELINES:
- Reassuring and methodical
- Emphasize client communication throughout
- For demos: show how to explain complex processes simply
- For walkthroughs: practical step-by-step guidance

Generate all scripts now.
```

---

## Competency 6: Objection Navigation (7 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the OBJECTION NAVIGATION competency.

CONTEXT:
Objection Navigation teaches how to handle resistance without being defensive or pushy. Objections are buying signals in disguise — they mean the client is engaged enough to raise concerns. This competency teaches turning objections into opportunities.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 6.X: [Title]
TYPE: [skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

6.1 Objection Handling Framework (skills)
- LAER framework: Listen, Acknowledge, Explore, Respond
- Walkthrough: Applying LAER in practice

6.2 Market & Timing Objections (skills-script)
- "Is now a good time to buy?"
- Demo scenario: Client worried about market timing

6.3 Developer & Project Objections (skills-script)
- "I've heard bad things about this developer"
- Demo scenario: Client with concerns about specific developer

6.4 Price & Fee Objections (skills-script)
- "Your commission is too high" / "The price is too high"
- Demo scenario: Client questioning fees

6.5 Stall & Delay Objections (skills-script)
- "I need to think about it" / "Not right now"
- Demo scenario: Client going cold after strong interest

6.6 Strategic Follow-Up (skills)
- Re-engaging leads who've gone quiet
- Walkthrough: Follow-up strategy for stalled deals

6.7 Failure Scenarios & Resilience (skills)
- Dealing with lost deals, rejection, setbacks
- Walkthrough: Recovery process and mindset

VOICE GUIDELINES:
- Calm and confident
- Objections are opportunities, not attacks
- For demos: show curiosity and reframing, not defensiveness
- Weak examples should show common defensive reactions

Generate all scripts now.
```

---

## Competency 8: RERA Exam Prep (8 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the RERA EXAM PREP competency.

CONTEXT:
RERA Exam Prep covers everything needed to pass the broker licensing exam. This is compliance-focused and factual, but the audio should make dense regulatory content more digestible. Help consultants understand AND remember.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - knowledge modules: Intro only
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)

FORMAT:
===
MODULE 8.X: [Title]
TYPE: [knowledge/skills]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH (if skills type, 2-4 minutes)
[Script text]

---

MODULES TO GENERATE:

8.1 RERA Exam Overview (knowledge)
- Exam format, passing requirements, what to expect
- Setting expectations for the exam

8.2 Ethics & Code of Conduct (knowledge)
- RERA ethical requirements
- Professional standards for licensed brokers

8.3 RERA Regulations & Licensing (knowledge)
- Key regulations, licensing requirements
- The legal framework

8.4 Landlord & Tenant Law (knowledge)
- Law 26, tenant rights, eviction rules
- Rental market regulations

8.5 Property Registration & Transfer (knowledge)
- DLD registration, transfer process
- Ownership documentation

8.6 Off-Plan Sales & Escrow (knowledge)
- Off-plan regulations, escrow requirements
- Consumer protection framework

8.7 Valuation & Calculations (skills)
- Exam calculation methods
- Walkthrough: Common calculation types and methods

8.8 Exam Strategies & Time Management (skills)
- How to approach the exam
- Walkthrough: Test-taking strategies

VOICE GUIDELINES:
- Clear and methodical
- Make regulatory content memorable with examples
- For walkthroughs: practical exam-day guidance
- Help them understand WHY rules exist, not just what they are

Generate all scripts now.
```

---

## Competency 7: Relationship Stewardship (4 modules)

```
You are generating audio scripts for Prime Capital's real estate training LMS. Generate all audio content for the RELATIONSHIP STEWARDSHIP competency.

CONTEXT:
Relationship Stewardship is about the long game — maintaining client relationships after transactions close, earning referrals, and evolving from agent to trusted advisor. This competency differentiates consultants who build careers from those who just close deals.

OUTPUT REQUIRED:
For each module below, generate:
1. INTRO SCRIPT (60-90 sec / ~150-200 words)
2. Additional script based on type:
   - skills modules: WALKTHROUGH (2-4 min / ~400-500 words)
   - skills-script modules: DEMO (3-5 min / ~600-700 words)

FORMAT:
===
MODULE 7.X: [Title]
TYPE: [skills/skills-script]
===

### INTRO (60-90 seconds)
[Script text]

### WALKTHROUGH or DEMO (based on type)
[Script text]

---

MODULES TO GENERATE:

7.1 Client Communication Standards (skills)
- Professional communication protocols
- Walkthrough: Email tone, response timing, boundaries

7.2 Follow-Up Systems (skills)
- Systematic post-transaction touchpoints
- Walkthrough: Building your follow-up system

7.3 Referral Generation (skills-script)
- Earning referrals naturally
- Demo scenario: Asking for a referral without being awkward

7.4 Long-Term Client Development (skills)
- Evolving from agent to trusted advisor
- Walkthrough: Relationship stages and engagement strategy

VOICE GUIDELINES:
- Warm but professional
- Emphasize genuine care over tactics
- For demos: show natural conversation, not scripted asks
- Long-term thinking — relationships over transactions

Generate all scripts now.
```

---

## Generation Checklist

| Competency | Modules | Intros | Demos | Walkthroughs | Status |
|------------|---------|--------|-------|--------------|--------|
| 0 - Foundations | 5 | 5 | 0 | 1 | ⬜ |
| 1 - Market Intelligence | 10 | 10 | 4 | 0 | ⬜ |
| 2 - Client Discovery | 7 | 7 | 5 | 1 | ⬜ |
| 3 - Sales Mastery | 8 | 8 | 5 | 2 | ⬜ |
| 4 - Property Matching | 7 | 7 | 2 | 5 | ⬜ |
| 5 - Transaction Management | 12 | 12 | 2 | 4 | ⬜ |
| 6 - Objection Navigation | 7 | 7 | 4 | 3 | ⬜ |
| 7 - Relationship Stewardship | 4 | 4 | 1 | 3 | ⬜ |
| 8 - RERA Exam Prep | 8 | 8 | 0 | 2 | ⬜ |
| **TOTAL** | **72** | **72** | **23** | **21** | |
