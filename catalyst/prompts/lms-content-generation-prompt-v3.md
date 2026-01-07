# LMS Content Generation Prompt v3.0

**Markdown Output • Audio-Ready Talk Tracks • Needs-Based Length**

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
You are creating world-class professional training content for Prime Capital Dubai, a boutique real estate advisory serving high-net-worth international investors.

## Your Mission

Research and produce ALL learning content for a complete Learning Management System following the **Skills-First Architecture**. This covers 8 competencies with 60 modules total, plus knowledge-check quizzes, AI simulation prompts, and a Scenario Bank.

This content must be:
- **Skills-first** — Every module answers "What can the consultant DO after completing this?"
- **Script-driven** — Talk tracks and exact words consultants can use immediately
- **Simulation-ready** — AI practice prompts for unlimited skill repetition
- **Practical** — Immediately applicable in real client situations
- **Multimedia-enriched** — Curated YouTube videos and imagery

---

## Output Format: Clearly Named Markdown Files

Produce each file with a **clear header block** so I can easily copy-paste into the correct location.

### File Structure

```
content/lms/
├── 0-foundations/
│   ├── _index.md              ← Competency overview page
│   ├── 0.1-company-orientation.md
│   ├── 0.2-code-of-conduct.md
│   └── ...
├── 1-market-intelligence/
│   ├── _index.md
│   ├── 1.1-dubai-overview.md
│   └── ...
└── quizzes/
    ├── foundations-1.md
    └── ...
```

### Output Each File Like This

Start every file with a clear marker:

```markdown
================================================================================
FILE: content/lms/0-foundations/0.1-company-orientation.md
================================================================================

---
title: "Prime Capital Orientation"
slug: "company-orientation"
moduleNumber: "0.1"
competency: "foundations"
competencyNumber: 0
duration: "25 min"
type: "Knowledge"
videos:
  - title: "Video Title"
    url: "https://youtube.com/watch?v=REAL_ID"
    duration: "8:24"
images:
  hero: "dubai-skyline-aerial"
  sections: ["business-meeting", "contract-signing"]
prev: null
next: "code-of-conduct"
---

[Content here]
```

### Competency Index File (_index.md)

Each competency folder needs an index file for the competency overview page:

```markdown
================================================================================
FILE: content/lms/0-foundations/_index.md
================================================================================

---
title: "Foundations"
slug: "foundations"
competencyNumber: 0
description: "Build the essential knowledge and habits every Prime Capital consultant needs before engaging with clients."
moduleCount: 5
estimatedTime: "2-3 hours"
icon: "building-2"
color: "blue"
modules:
  - number: "0.1"
    title: "Prime Capital Orientation"
    slug: "company-orientation"
    type: "Knowledge"
    duration: "25 min"
  - number: "0.2"
    title: "Professional Standards"
    slug: "code-of-conduct"
    type: "Knowledge"
    duration: "20 min"
---

## What You'll Learn

[2-3 paragraph overview of the competency - what skills/knowledge this competency builds]

## Why This Matters

[Connect to real consultant success - why mastering this competency leads to better outcomes]

## Key Outcomes

By completing this competency, you will be able to:

- [Specific, measurable outcome 1]
- [Specific, measurable outcome 2]
- [Specific, measurable outcome 3]

## Prerequisites

[What the learner should complete before this competency, or "None" for Foundations]

## How This Connects

[How this competency builds on previous ones and prepares for future ones]
```

**IMPORTANT:** Competency files are critical content. They:
- Appear on the competency overview page
- Provide context for the AI Learning Coach
- Help learners understand the learning journey

---

## AI LEARNING COACH CONTEXT

All content must be written with awareness that an **AI Learning Coach** will use it to:
- Answer learner questions about any module or competency
- Find relevant information across the entire curriculum
- Explain concepts in different ways
- Connect ideas between modules

### Context Requirements

**Every module must include:**

1. **Clear Learning Outcome** — So the coach knows what the learner should achieve
2. **Key Concepts Defined** — So the coach can explain terms consistently
3. **Practical Examples** — So the coach can reference real scenarios
4. **Common Misconceptions** — So the coach can correct misunderstandings
5. **Connections to Other Modules** — So the coach can guide learners to related content

**In frontmatter, include:**

```yaml
# For AI Coach context
keywords: ["first contact", "lead response", "speed to lead", "portal enquiry"]
relatedModules: ["lead-sources", "needs-analysis", "followup-sequences"]
prerequisites: ["lead-sources"]
commonQuestions:
  - "How quickly should I respond to a lead?"
  - "What if the client is busy when I call?"
  - "Should I send a WhatsApp before calling?"
```

This metadata helps the AI Coach:
- Find relevant modules when learners ask questions
- Suggest what to learn next
- Connect concepts across the curriculum

---

## Writing Style

### Brand Voice: "Quiet Luxury"

All content must reflect Prime Capital's positioning:
- **Authoritative** — Confident expertise, not arrogant
- **Discreet** — Professional, not flashy or pushy
- **Transparent** — Honest about limitations and risks
- **Calm** — No urgency tactics, no pressure language

Write for non-native English speakers: clear, simple, jargon-defined.

### Length: Based on Need, Not Arbitrary Limits

Write as much as the module requires—no more, no less.

- If a module needs detailed examples, multiple scripts, and worked calculations, it may be 1500+ words
- If a module can be fully taught in 400 words, don't pad it
- Skills + Script modules typically need more depth than pure Knowledge modules
- Let the content requirements drive length, not word count targets

### Audio-Ready Content

Use `<speak>` tags for any content that will be converted to audio via TTS. This includes:
- Talk tracks and scripts
- Coach walkthroughs
- Role-play demonstrations

```markdown
<speak>
**Client:** I've heard Dubai is a bubble.

**Consultant:** That's a fair concern. Let me share what the data shows...
</speak>
```

### Dialogue Guidelines for TTS

- Use contractions ("I've", "don't", "we'll")
- Write how people actually talk
- Keep responses conversational but complete
- No parenthetical asides in dialogue
- Avoid acronyms (say "two million dirhams" not "AED 2M")

### Coach Walkthrough Format

For multi-modal learning, include **coached audio sections** where a narrator walks the learner through an example, flipping between explanation and role-play demonstration.

```markdown
## Coach Walkthrough

<speak>
**Coach:** Let's walk through a real first contact call. I'll play both sides so you can hear how this sounds in practice.

The lead—let's call him Ahmed—just enquired about DAMAC Lagoons through Property Finder. He submitted the form 3 minutes ago. Here's how you open:

**Consultant:** "Hi Ahmed, this is Sarah from Prime Capital. You just enquired about DAMAC Lagoons—I'm actually working with several clients on that development right now. Is now a good time for a quick two-minute conversation?"

**Coach:** Notice what just happened. I confirmed I'm responding to HIS enquiry—not cold calling. I mentioned I'm working with other clients on the same project, which builds credibility without bragging. And I asked permission before diving in.

Now he says yes, so watch how I pivot immediately to his needs:

**Consultant:** "Perfect. Before I share any details, I'd like to understand what you're looking for. Are you considering this for investment, or would you be living there yourself?"

**Coach:** See that? No pitch. No "let me tell you about the amazing amenities." I went straight to understanding HIM. That's the Prime Capital difference.

Now let's say Ahmed tells me he's looking at investment. Watch how I follow up...
</speak>
```

**When to use Coach Walkthrough:**
- Complex skills that benefit from narrated demonstration
- When showing the "why" behind each step
- As an alternative to or complement to AI practice
- When you want the learner to HEAR the tone, not just read it

**Coach voice characteristics:**
- Warm but professional
- Explains the "why" after each demonstration
- Points out what to notice
- Encouraging but not patronizing

### Be Efficient, Not Sparse

- One idea per paragraph
- Cut filler phrases ("It's important to note that...", "As mentioned earlier...")
- Cut adjectives that don't add meaning
- But include all necessary detail, examples, and context

---

## MODULE ARCHITECTURE (REQUIRED)

Every module MUST follow this structure. Consistency across 60 modules matters more than any individual module being perfect.

### The Structure

```
1. LEARNING OBJECTIVE (1-2 sentences)
   What you'll be able to DO after this module

2. WHY THIS MATTERS (2-3 paragraphs max)
   The concept, with one compelling data point or story

3. THE CORE SKILL (Primary content)
   - ONE script/framework taught thoroughly
   - Annotated example showing WHY each part works
   - Call out "Quiet Luxury" tone explicitly

4. COACH WALKTHROUGH (for Skills + Script modules)
   - Audio-ready narrated demonstration
   - Coach flips between explanation and role-play
   - Shows the skill in action with commentary

5. PRACTICE CHECKPOINT
   Quick exercise or self-check—BEFORE variations

6. VARIATIONS & EDGE CASES (Reference material)
   - Collapsible <details> blocks
   - Clearly marked as secondary/reference
   - Formatted for scanning, not deep reading

7. COMMON MISTAKES (3 max)
   Quick hits, not extended examples

8. QUICK REFERENCE CARD
   Checklist or cheat sheet for real-world use

9. KEY TAKEAWAYS (3-5 bullets max)

10. AI PRACTICE (when appropriate)
    Full simulation for modules that need interactive practice
```

### When to Include Each Element

| Element | Knowledge | Skills | Skills + Script |
|---------|-----------|--------|-----------------|
| Learning Objective | ✓ | ✓ | ✓ |
| Why This Matters | ✓ | ✓ | ✓ |
| Core Skill/Content | ✓ | ✓ | ✓ |
| Coach Walkthrough | — | Optional | ✓ |
| Practice Checkpoint | — | ✓ | ✓ |
| Variations | — | If needed | ✓ |
| Common Mistakes | Optional | ✓ | ✓ |
| Quick Reference | Optional | ✓ | ✓ |
| Key Takeaways | ✓ | ✓ | ✓ |
| AI Practice | — | If needed | If needed |

**Not every module needs full AI practice.** A Coach Walkthrough may be sufficient for demonstrating a skill. Use AI Practice when:
- The skill requires back-and-forth dialogue practice
- There are multiple valid approaches to explore
- The learner needs to handle unpredictable responses

### Critical Principles

**1. One Primary Skill Per Module**
Don't teach 4 scripts. Teach ONE script well, then provide variations as collapsible reference. A consultant should know exactly what to memorize.

**2. Practice Midway, Not Just at End**
Insert a Practice Checkpoint after the core skill, before variations. By the end, the consultant is fatigued—they need early wins.

**3. Annotate Scripts to Explain WHY**
Don't just give the words. Explain why each part works:

```markdown
> **You:** "Is now a good time for a quick two-minute conversation?"

*Why this works: You're respecting their time and asking permission. Most agents launch into a pitch.*
```

**4. Call Out Brand Voice Explicitly**
Show what makes it "Quiet Luxury":

```markdown
### What Makes This "Quiet Luxury"

Notice what the script **doesn't** do:
- No pressure ("This is selling fast!")
- No pitch (price, features, hard sell)
- No assumptions about what they want
- No desperation ("I'd love to help you!")

The tone is confident, unhurried, professional.
```

**5. Collapse Variations with `<details>`**
Secondary content should be scannable, not overwhelming:

```markdown
<details>
<summary><strong>Developer Launch Lead</strong></summary>

> "Hi [Name], this is [Your Name] from Prime Capital..."

**Key difference:** Emphasize your developer access.
</details>
```

**6. Integrate Videos Into Content**
Don't just list videos in frontmatter. Reference them where relevant:

```markdown
## Why This Matters

Before we dive into the script, watch this 4-minute video showing a real first contact call:

📹 [First Contact Best Practices](https://youtube.com/watch?v=XXXXX) (4:12)

Notice how the consultant...
```

---

## EXAMPLE MODULE (Reference This)

Here's a complete example of the required format:

```markdown
================================================================================
FILE: content/lms/3-sales-mastery/3.2-first-contact.md
================================================================================

---
title: "First Contact Excellence"
slug: "first-contact"
moduleNumber: "3.2"
competency: "sales-mastery"
competencyNumber: 3
duration: "30 min"
type: "Skills + Script"
learning_outcome: "Respond to a new lead within 60 seconds using the Prime Capital first contact framework"
videos: []      # Added via LMS Admin
resources: []   # Added via LMS Admin
prev: "lead-sources"
next: "needs-analysis"
# AI Coach context
keywords: ["first contact", "lead response", "speed to lead", "portal enquiry", "callback"]
relatedModules: ["lead-sources", "needs-analysis", "followup-sequences"]
prerequisites: ["lead-sources"]
commonQuestions:
  - "How quickly should I respond to a lead?"
  - "What if the client is busy when I call?"
  - "Should I send a WhatsApp before calling?"
  - "What's the best opening line?"
---

# First Contact Excellence

## Learning Objective

By the end of this module, you will be able to **respond to a new off-plan lead within 60 seconds** using a script that opens dialogue, qualifies quickly, and secures a next step—without sounding like a salesperson.

---

## Why Response Time Changes Everything

When someone enquires about a property, they're interested *right now*. Five minutes later, they've messaged three other agents.

**The data:**

| Response Time | Result |
|---------------|--------|
| Under 5 minutes | 21x more likely to qualify |
| Over 1 hour | They've already spoken to 2-3 competitors |

---

## The Prime Capital First Contact Script

This is your primary script. Master this before learning variations.

**Scenario:** A lead enquired about an off-plan project through Property Finder.

### The Script (Annotated)

<speak>
**You:** "Hi [Name], this is [Your Name] from Prime Capital. You just enquired about [Project Name]—I'm actually working with several clients on that development right now."
</speak>

*Why this works: You've confirmed you're responding to their enquiry (not cold calling), and you've established credibility without bragging.*

<speak>
**You:** "Is now a good time for a quick two-minute conversation?"
</speak>

*Why this works: You're respecting their time and asking permission. Most agents launch into a pitch.*

**If yes:**

<speak>
**You:** "Perfect. Before I share any details, I'd like to understand what you're looking for. Are you considering this for investment, or would you be living there yourself?"
</speak>

*Why this works: You've pivoted to their needs immediately. You're an advisor, not a salesperson.*

**If busy:**

<speak>
**You:** "No problem at all. Would tomorrow morning or afternoon work better? I'll send you my direct WhatsApp with some details about the project in the meantime."
</speak>

*Why this works: You've proposed a specific alternative (not "I'll call back sometime") and you've created a reason to follow up.*

### What Makes This "Quiet Luxury"

Notice what the script **doesn't** do:
- No pressure ("This is selling fast!")
- No pitch (price, features, hard sell)
- No assumptions about what they want
- No desperation ("I'd love to help you!")

The tone is confident, unhurried, professional. You're the advisor they're lucky to have reached.

---

## 🎧 Coach Walkthrough

*Listen to this section to hear the script in action with coaching commentary.*

<speak>
**Coach:** Let's walk through a real first contact call. I'll play both sides so you can hear how this sounds in practice.

The lead—Ahmed—just enquired about DAMAC Lagoons through Property Finder. He submitted the form 3 minutes ago. Here's how you open:

**Consultant:** "Hi Ahmed, this is Sarah from Prime Capital. You just enquired about DAMAC Lagoons—I'm actually working with several clients on that development right now. Is now a good time for a quick two-minute conversation?"

**Coach:** Notice what just happened. I confirmed I'm responding to HIS enquiry—not cold calling. I mentioned I'm working with other clients on the same project, which builds credibility without bragging. And I asked permission before diving in.

**Ahmed:** "Yeah, I have a few minutes."

**Coach:** He said yes. Now watch—I don't launch into a pitch about the project. I pivot immediately to understanding HIM:

**Consultant:** "Perfect. Before I share any details, I'd like to understand what you're looking for. Are you considering this for investment, or would you be living there yourself?"

**Coach:** See that? No "let me tell you about the amazing amenities." I went straight to his needs. That's the Prime Capital difference.

**Ahmed:** "Investment. I'm looking at rental yield."

**Coach:** Now I have direction. I can ask about budget, timeline, and experience. But notice—I'm still asking, not pitching:

**Consultant:** "Got it. And have you invested in Dubai property before, or would this be your first purchase here?"

**Coach:** This question tells me how much education he needs and how to frame the conversation. A first-timer needs different support than an experienced investor.

The key throughout: stay curious, stay calm, and let HIM guide where we go. That's quiet luxury in action.
</speak>

---

## Practice Checkpoint

Before continuing, practice the script out loud three times. Then try this:

**Quick Practice:** A lead enquired about DAMAC Lagoons 2 minutes ago. Their name is Ahmed. Call them.

Record yourself. Did you:
- [ ] State your name and company clearly?
- [ ] Reference their specific enquiry?
- [ ] Ask if it's a good time?
- [ ] Open with a question, not a pitch?

If you checked all four, continue. If not, practice again.

---

## Variations by Lead Source

These are reference scripts for different situations. Return here when you encounter these lead types.

<details>
<summary><strong>Developer Launch Lead</strong></summary>

<speak>
**You:** "Hi [Name], this is [Your Name] from Prime Capital. I noticed you registered interest in [Project Name]. I've been working closely with [Developer] on this launch and have access to the full inventory. Is now a good time to talk about what you're looking for?"
</speak>

**Key difference:** Emphasize your developer access—they're likely getting calls from many agents.
</details>

<details>
<summary><strong>Referral Lead</strong></summary>

<speak>
**You:** "Hi [Name], this is [Your Name] from Prime Capital. [Referrer] mentioned you might be looking at property in Dubai—I've been working with them on their investments and they thought we might be a good fit. Is now a good time?"
</speak>

**Key difference:** Lead with the relationship. Trust is already partially established.
</details>

<details>
<summary><strong>Social Media Lead</strong></summary>

<speak>
**You:** "Hi [Name], thanks for reaching out! Happy to help with questions about Dubai property. Are you looking to invest, or considering moving here?"
</speak>

**Key difference:** More casual tone. They may be early in their journey.
</details>

---

## Common Mistakes

**1. Starting with a pitch**
Don't list property features. Ask a question first.

**2. Ending without a next step**
"Let me know if you have questions" loses momentum. Always propose something specific.

**3. Reading the script robotically**
The script is a framework. Adapt your tone to the person.

---

## Quick Reference Card

**Before you call:**
- Lead name (pronunciation?)
- Property/project they enquired about
- Lead source
- Quiet environment

**The call structure:**
1. Greeting + context (10 sec)
2. Permission check (5 sec)
3. Opening question (10 sec)
4. Listen and qualify (varies)
5. Propose next step (10 sec)

---

## Key Takeaways

- Respond within 5 minutes—speed is your competitive advantage
- Open with questions, not pitches—you're an advisor
- Always secure a next step—vague endings lose deals
- The script is a framework—adapt your tone to the person

---

## AI Practice: Portal Lead Response

**You are calling:** Sarah Mitchell, 38, British expat in Singapore. Works in finance, considering relocating to Dubai.

**Her situation (reveal gradually):**
- Budget: AED 1.5-2M
- Goal: Apartment to live in, not investment
- Timeline: 4 weeks to decide, job starts in 3 months
- Concerns: Doesn't know Dubai areas, worried about choosing remotely
- She's contacted 4 agencies—you're one of them

**Her style:**
- Professional and direct
- Skeptical of sales tactics
- Appreciates efficiency
- Responds well to good questions
- Put off by pressure or pitching

**Her enquiry:** 2BR in Business Bay, AED 1.8M, sent 5 minutes ago.

**Your job:**
- Open appropriately
- Qualify her situation
- Address her concerns about buying remotely
- Secure a next step

**Feedback criteria:**
- Quality of opening
- Qualification questions asked
- How concerns were handled
- Whether next step was secured
- Rating: Needs Work / Competent / Strong
```

---

## Content Requirements by Module Type

### Knowledge Modules
- Learning objective
- Core concept explained clearly
- One key framework or mental model
- Quick reference/summary
- Key takeaways

### Skills Modules
- Learning objective
- Why this skill matters
- The core skill taught thoroughly
- Practice checkpoint
- Common mistakes
- Full AI simulation

### Skills + Script Modules
- Everything in Skills, plus:
- Annotated primary script
- "Quiet Luxury" call-out
- Collapsible variation scripts
- Quick reference card

### Numerical Modules (Yields, Calculations)
- Worked examples with real numbers
- Step-by-step calculation
- Common errors to avoid
- Practice problems

---

## Additional Elements (When Applicable)

**Worked Calculation Examples** (for numerical modules):

```markdown
### Yield Calculation Example

**Property:** 1-bedroom apartment in JVC
**Purchase Price:** AED 850,000
**Annual Rent:** AED 65,000
**Service Charges:** AED 12,000/year

**Gross Yield:** AED 65,000 ÷ AED 850,000 = **7.6%**
**Net Yield:** (AED 65,000 - AED 12,000) ÷ AED 850,000 = **6.2%**
```

**Checklists** (where applicable):

```markdown
### Pre-Meeting Checklist

- [ ] Client's budget range and payment preference
- [ ] Investment goal (yield, growth, lifestyle, visa)
- [ ] Timeline for purchase
- [ ] Previous Dubai market experience
- [ ] Decision-makers involved
```

---

## AI SIMULATION FORMAT

See the full example in the "EXAMPLE MODULE" section above. Key elements:

- **Persona:** Name, age, nationality, profession, background
- **Situation (revealed gradually):** Budget, goal, timeline, concerns, decision process
- **Communication style:** 2-3 traits, how they respond to good/bad consultants
- **Consultant's job:** 3-4 specific objectives
- **Feedback criteria:** What to evaluate, rating scale

End simulations after 8-10 exchanges or when a next step is agreed.

---

## MEDIA & RESOURCES (Added Later via Admin)

Videos and external resources will be added to modules via the LMS Admin after content generation. Do not attempt to find or include videos.

### Frontmatter Fields for Admin

```yaml
# These fields are populated via LMS Admin, not during content generation
videos: []      # YouTube videos added later
resources: []   # External links, PDFs, tools added later
```

When videos or resources ARE added via admin, they follow this format:

```yaml
videos:
  - title: "Understanding Dubai Off-Plan Contracts"
    url: "https://www.youtube.com/watch?v=XXXXX"
    duration: "12:34"

resources:
  - title: "RERA Contract Templates"
    url: "https://dubailand.gov.ae/..."
    type: "external"  # external | pdf | tool
  - title: "Payment Plan Calculator"
    url: "/tools/payment-calculator"
    type: "tool"
```

**For content generation:** Leave `videos: []` and `resources: []` empty. Focus on the written content.

---

## CURRICULUM STRUCTURE (8 COMPETENCIES, 60 MODULES)

### COMPETENCY 0: Foundations (5 modules)

Purpose: Equip consultants with company context, compliance requirements, essential tools, and daily workflow habits before they engage with market content.

| # | Slug | Title | Type |
|---|------|-------|------|
| 0.1 | company-orientation | Prime Capital Orientation | Knowledge |
| 0.2 | code-of-conduct | Professional Standards | Knowledge |
| 0.3 | broker-licensing | Broker Licensing & Compliance | Knowledge + Checklist |
| 0.4 | essential-tools | Essential Tools Overview | Knowledge |
| 0.5 | daily-workflow | Daily Workflow & Productivity | Skills |

**Module 0.5 Must Include:**
- Morning routine (first 60 minutes)
- Time-blocking framework
- CRM discipline rules
- Weekly pipeline review
- AI Simulation: "It's Monday 8:45am. Walk me through your first 90 minutes."

---

### COMPETENCY 1: Market Intelligence (10 modules)

Purpose: Build deep Dubai market knowledge that creates client confidence.

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

**AI Simulations for Competency 1:**
- "A client asks: Is Dubai in a bubble? The prices seem unsustainable."
- "A client from Hong Kong asks why they should invest in Dubai instead of Singapore."
- "A client wants to know the difference between Emaar and DAMAC."

---

### COMPETENCY 2: Client Discovery (7 modules)

Purpose: Develop the questioning and listening skills to deeply understand what investors actually want—and qualify them efficiently.

| # | Slug | Title | Type |
|---|------|-------|------|
| 2.1 | investor-personas | Investor Personas | Knowledge |
| 2.2 | discovery-endusers | Discovery: End-Users | Skills + Script |
| 2.3 | discovery-investors | Discovery: Investors | Skills + Script |
| 2.4 | discovery-visa | Discovery: Visa-Seekers | Skills + Script |
| 2.5 | active-listening | Active Listening | Skills |
| 2.6 | qualification-framework | BANT+ Qualification | Skills + Script |
| 2.7 | managing-expectations | Managing Expectations | Skills + Script |

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

### COMPETENCY 3: Sales Mastery (8 modules)

Purpose: Build the practical sales skills for off-plan property conversion—from first contact through to commitment. This is the CORE SKILLS competency.

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

| # | Slug | Title | Type |
|---|------|-------|------|
| 4.1 | property-analysis | Property Analysis Framework | Skills |
| 4.2 | yield-calculations | Yield & ROI Calculations | Skills |
| 4.3 | offplan-evaluation | Off-Plan Evaluation | Skills + Checklist |
| 4.4 | payment-plan-analysis | Payment Plan Comparison | Skills + Script |
| 4.5 | secondary-evaluation | Secondary Market Evaluation | Skills |
| 4.6 | presentation-skills | Property Presentation | Skills + Script |
| 4.7 | comparative-analysis | Comparative Market Analysis | Skills |

**Module 4.4 Must Include Full Script:**
Complete payment plan comparison dialogue showing 60/40 vs 80/20.

---

### COMPETENCY 5: Transaction Management (12 modules)

Purpose: Master the end-to-end transaction process for both off-plan and secondary properties.

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

---

### COMPETENCY 6: Objection Navigation (7 modules)

Purpose: Build confidence in handling resistance and develop emotional resilience.

| # | Slug | Title | Type |
|---|------|-------|------|
| 6.1 | objection-framework | Objection Handling Framework | Skills |
| 6.2 | market-objections | Market & Timing Objections | Skills + Script |
| 6.3 | developer-objections | Developer & Project Objections | Skills + Script |
| 6.4 | price-fee-objections | Price & Fee Objections | Skills + Script |
| 6.5 | stall-objections | Stall & Delay Objections | Skills + Script |
| 6.6 | strategic-followup | Strategic Follow-Up | Skills |
| 6.7 | failure-resilience | Failure Scenarios & Resilience | Skills |

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

| # | Slug | Title | Type |
|---|------|-------|------|
| 7.1 | client-communication | Client Communication Standards | Skills |
| 7.2 | follow-up-systems | Follow-Up Systems | Skills |
| 7.3 | referral-generation | Referral Generation | Skills + Script |
| 7.4 | long-term-relationships | Long-Term Client Development | Skills |

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

### Quiz File Format

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

## PRODUCTION SEQUENCE

Produce content in this order (one competency at a time):

1. **Competency 0: Foundations** — 1 index + 5 modules + 2 quizzes
2. **Competency 1: Market Intelligence** — 1 index + 10 modules + 4 quizzes
3. **Competency 2: Client Discovery** — 1 index + 7 modules + 2 quizzes
4. **Competency 3: Sales Mastery** — 1 index + 8 modules + 3 quizzes
5. **Competency 4: Property Matching** — 1 index + 7 modules + 2 quizzes
6. **Competency 5: Transaction Management** — 1 index + 12 modules + 3 quizzes
7. **Competency 6: Objection Navigation** — 1 index + 7 modules + 3 quizzes
8. **Competency 7: Relationship Stewardship** — 1 index + 4 modules + 1 quiz
9. **Scenario Bank** — 75 scenarios organized by category

After each competency, pause and confirm before continuing.

---

## FILE NAMING CONVENTION (CRITICAL)

Follow this exact naming pattern:

### Competency Index Files
```
content/lms/{N}-{competency-slug}/_index.md
```
Examples:
- `content/lms/0-foundations/_index.md`
- `content/lms/1-market-intelligence/_index.md`
- `content/lms/3-sales-mastery/_index.md`

### Module Files
```
content/lms/{N}-{competency-slug}/{N.M}-{module-slug}.md
```
Examples:
- `content/lms/0-foundations/0.1-company-orientation.md`
- `content/lms/1-market-intelligence/1.8-golden-visa.md`
- `content/lms/3-sales-mastery/3.2-first-contact.md`

### Quiz Files
```
content/lms/quizzes/{competency-slug}-{N}.md
```
Examples:
- `content/lms/quizzes/foundations-1.md`
- `content/lms/quizzes/market-intelligence-3.md`

**ALWAYS** start each file output with the exact path:
```
================================================================================
FILE: content/lms/0-foundations/_index.md
================================================================================
```

---

## AFTER EACH COMPETENCY: AUDIT SUMMARY

After producing all files for a competency, output this summary:

### Competency [X]: [Name] — Audit

**Files Produced:**

| File | Title | Type | Quiz |
|------|-------|------|------|
| `0-foundations/_index.md` | Foundations | **Competency Index** | — |
| `0-foundations/0.1-company-orientation.md` | Prime Capital Orientation | Knowledge | — |
| `0-foundations/0.2-code-of-conduct.md` | Professional Standards | Knowledge | — |
| `0-foundations/0.3-broker-licensing.md` | Broker Licensing & Compliance | Knowledge + Checklist | ✓ |
| `quizzes/foundations-1.md` | Broker Licensing Quiz | Quiz | — |

**Notes:** [Any flags, assumptions made, or items needing review]

**Ready for next competency?**

---

## BEGIN

Start with **Competency 0: Foundations**.

### Step 1: Produce the Competency Index (REQUIRED)

**This file is critical.** It provides the overview for the competency page and context for the AI Learning Coach.

```
================================================================================
FILE: content/lms/0-foundations/_index.md
================================================================================
```

Include:
- Full description of what the competency covers
- Why it matters for consultant success
- Specific learning outcomes
- Prerequisites and connections to other competencies
- List of all modules with metadata

### Step 2: Produce Each Module

For each module, output with clear file markers:
```
================================================================================
FILE: content/lms/0-foundations/0.1-company-orientation.md
================================================================================
```

Include:
- Full YAML frontmatter (leave `videos: []` and `resources: []`)
- Complete content following the module architecture
- Coach walkthrough (for Skills + Script modules)
- AI practice prompt (when appropriate)

### Step 3: Produce Quizzes

```
================================================================================
FILE: content/lms/quizzes/foundations-1.md
================================================================================
```

### Step 5: Output Audit Summary

After all files, output the Audit Summary with all YouTube links listed for verification.

---

**Confirm you understand, then begin by researching YouTube videos for Competency 0.**
```

---

## How to Use This Prompt

### 1. Enable Research Mode

### 1. Initial Message

Copy everything inside the ``` code block above and paste it as your first message in a Claude Project.

### 2. After Each Competency

Say: **"Continue with Competency [X]."**

### 3. If Output Gets Cut Off

Say: **"Continue from where you stopped."**

### 4. To Request Changes

- "Module 3.2 script sounds too formal. Make it more conversational."
- "Module 6.7 needs more detail on the Ghost scenario."
- "Add more examples to the discovery questions."

---

## After Claude Produces Content

### 1. Save the Files

Create the directory structure locally:
```
content/
  lms/
    0-foundations/
      _index.md
      0.1-company-orientation.md
      0.2-code-of-conduct.md
      ...
    1-market-intelligence/
      ...
    quizzes/
      foundations-1.md
      foundations-2.md
      ...
```

### 2. Add Videos & Resources via LMS Admin

After content is in place, use the LMS Admin to:
- Add YouTube videos to relevant modules
- Add external resources (PDFs, tools, links)
- Update frontmatter `videos` and `resources` arrays

### 3. Pass to Me for Integration

Once you've saved a competency, paste it here and I'll:
- Create a loader function for markdown files
- Integrate with the existing LMS pages
- Add TTS processing for `<speak>` blocks

---

## Summary Metrics

| Content Type | Count |
|--------------|-------|
| Competency Index Files | 8 |
| Module Files | 60 |
| Quiz Files | 20 |
| Coach Walkthroughs | ~25 |
| AI Simulations | ~30 |
| Scenario Bank | 75 |
| **Total Files** | **88 + Scenario Bank** |

*Videos and resources added via LMS Admin after content generation.*

**Estimated Learning Time:**
- Streamlined Path (35 modules): 15-20 hours
- Extended Path (60 modules): 26-34 hours
