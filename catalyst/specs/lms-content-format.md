# LMS Content Format Specification

**Version 2.0 | January 2026**

This document specifies the exact format required when producing course content for the Prime Capital Dubai Learning Management System. AI agents generating content MUST follow these specifications precisely to ensure seamless integration with the LMS codebase.

**Skills-First Architecture:** This version reflects the curriculum audit that expanded the LMS to 8 competencies and 60 modules, with emphasis on practical sales skills, talk tracks, and AI simulation practice.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Competency Data Structure](#competency-data-structure)
3. [Module Data Structure](#module-data-structure)
4. [Quiz Data Structure](#quiz-data-structure)
5. [AI Simulation Structure](#ai-simulation-structure)
6. [Content Formatting Rules](#content-formatting-rules)
7. [Navigation & Linking](#navigation--linking)
8. [Complete Examples](#complete-examples)
9. [Validation Checklist](#validation-checklist)

---

## Architecture Overview

### Learning Hierarchy

```
Competency (8 total)
├── Module 1 (4-12 per competency)
│   ├── Content (markdown string with talk tracks)
│   ├── Key Takeaways (array of strings)
│   ├── AI Simulation Prompt (for skills modules)
│   └── Quiz (optional)
├── Module 2
│   └── ...
└── Module N
```

### The 8 Competencies (Fixed)

These competency slugs are fixed and must not change:

| # | Slug | Display Name | Modules |
|---|------|--------------|---------|
| 0 | `foundations` | Foundations | 5 |
| 1 | `market-intelligence` | Market Intelligence | 10 |
| 2 | `client-discovery` | Client Discovery | 7 |
| 3 | `sales-mastery` | Sales Mastery | 8 |
| 4 | `property-matching` | Property Matching | 7 |
| 5 | `transaction-management` | Transaction Management | 12 |
| 6 | `objection-navigation` | Objection Navigation | 7 |
| 7 | `relationship-stewardship` | Relationship Stewardship | 4 |

**Total: 60 modules**

### Module Types

Modules are categorized by their focus:

| Type | Description | Required Elements |
|------|-------------|-------------------|
| `Knowledge` | Information-focused | Content, takeaways |
| `Knowledge + Checklist` | Information with job aids | Content, takeaways, checklist |
| `Skills` | Practical application | Content, takeaways, AI simulation |
| `Skills + Script` | Talk tracks included | Content, talk tracks, AI simulation |

### File Locations

Content is currently defined inline in TypeScript files:

| Content Type | File Path |
|--------------|-----------|
| Competency metadata | `app/learn/[competency]/page.tsx` |
| Module content | `app/learn/[competency]/[module]/page.tsx` |
| Quiz questions | `app/learn/quiz/[id]/page.tsx` |

---

## Competency Data Structure

### TypeScript Interface

```typescript
interface CompetencyData {
  name: string            // Display name (e.g., "Market Intelligence")
  description: string     // One-line description for cards
  icon: React.ElementType // Lucide icon component
  modules: ModuleReference[]
}

interface ModuleReference {
  slug: string           // URL-safe identifier (e.g., "dubai-real-estate-overview")
  title: string          // Display title
  description: string    // One-line description
  duration: string       // Estimated time (e.g., "30 min")
  type: "Knowledge" | "Knowledge + Checklist" | "Skills" | "Skills + Script"
  status: "completed" | "in-progress" | "not-started"
}
```

### Example Competency Entry

```typescript
"market-intelligence": {
  name: "Market Intelligence",
  description: "Understand Dubai's real estate landscape, regulations, and market dynamics",
  icon: BarChart3Icon,
  modules: [
    {
      slug: "dubai-real-estate-overview",
      title: "Dubai Real Estate Overview",
      description: "History, growth, and current state of the Dubai property market",
      duration: "30 min",
      status: "not-started",
    },
    // ... more modules
  ],
}
```

### Slug Format Rules

- **Lowercase only**: `market-intelligence` not `Market-Intelligence`
- **Hyphens for spaces**: `dubai-real-estate-overview` not `dubai_real_estate_overview`
- **No special characters**: Only a-z, 0-9, and hyphens
- **Descriptive but concise**: 2-5 words maximum

---

## Module Data Structure

### TypeScript Interface

```typescript
interface ModuleContent {
  title: string           // Display title (matches ModuleReference.title)
  duration: string        // Estimated time (matches ModuleReference.duration)
  type: "Knowledge" | "Knowledge + Checklist" | "Skills" | "Skills + Script"
  content: string         // Markdown content (see formatting rules below)
  keyTakeaways: string[]  // 3-5 bullet points summarizing the module
  aiSimulation?: string   // AI practice prompt (required for Skills modules)
  videos?: VideoResource[] // Optional curated YouTube videos
  images?: ImageResources  // Optional Unsplash/Pexels images
  nextModule?: {          // Optional - omit for last module in competency
    slug: string
    title: string
  }
  prevModule?: {          // Optional - omit for first module in competency
    slug: string
    title: string
  }
  quizId?: string         // Optional - format: "{competency-slug}-{number}"
}

interface VideoResource {
  title: string           // Video title
  url: string             // Full YouTube URL
  duration: string        // Video length (e.g., "8:24")
  description: string     // Why this video is relevant
  timestamp?: string      // Optional start time (e.g., "2:30")
}

interface ImageResources {
  hero: {
    url: string           // Unsplash/Pexels URL
    alt: string           // Descriptive alt text
    credit: string        // Photographer name
  }
  sections?: Array<{
    url: string
    alt: string
    placement: string     // Where to show (e.g., "After 'Key Points' section")
  }>
}
```

### Module Content Requirements by Type

| Type | Required Content |
|------|------------------|
| Knowledge | Introduction, core content, why this matters |
| Knowledge + Checklist | Above + printable checklist with checkboxes |
| Skills | Above + "Common Mistakes" section + AI Simulation |
| Skills + Script | Above + full talk track with dialogue examples |

### Example Module Entry (with Multimedia)

```typescript
"market-intelligence": {
  "dubai-real-estate-overview": {
    title: "Dubai Real Estate Overview",
    duration: "30 min",
    content: `
## Introduction

Dubai's real estate market is one of the most dynamic and attractive in the world. Understanding its history, growth trajectory, and current state is fundamental to advising international investors effectively.

## Historical Context

Dubai's transformation from a small trading port to a global metropolis is one of the most remarkable urban development stories of the modern era.

### Key Milestones

- **1997**: Freehold property ownership introduced for UAE nationals
- **2002**: Freehold ownership extended to foreign nationals in designated areas
- **2004-2008**: First real estate boom, major developments launched

## Why This Matters

Understanding the market context enables you to:

1. Position Dubai as a credible investment destination
2. Address investor concerns with factual context
3. Demonstrate expertise that builds client trust
    `,
    keyTakeaways: [
      "Dubai's property market has matured significantly since 2002",
      "The regulatory framework (RERA, DLD) provides strong investor protection",
      "Dubai offers competitive pricing compared to global gateway cities",
      "Population growth and economic diversification drive long-term demand",
    ],
    nextModule: { slug: "regulatory-framework", title: "Regulatory Framework" },
    quizId: "market-intelligence-1",
  },
}
```

---

## Quiz Data Structure

### TypeScript Interface

```typescript
interface QuizData {
  title: string              // Quiz display name
  moduleSlug: string         // Links back to parent module
  competencySlug: string     // Links back to parent competency
  questions: QuizQuestion[]  // 4-6 questions per quiz
}

interface QuizQuestion {
  id: string                 // Unique within quiz (e.g., "q1", "q2")
  question: string           // The question text
  options: QuizOption[]      // Exactly 4 options
  explanation: string        // Shown after answering (explains correct answer)
}

interface QuizOption {
  text: string               // Option text
  correct: boolean           // Exactly ONE must be true per question
}
```

### Quiz Naming Convention

Quiz IDs follow the pattern: `{competency-slug}-{sequence-number}`

| Pattern | Example |
|---------|---------|
| First module quiz | `market-intelligence-1` |
| Second module quiz | `market-intelligence-2` |
| Fifth module quiz | `client-discovery-5` |

### Example Quiz Entry

```typescript
"market-intelligence-1": {
  title: "Dubai Real Estate Overview Quiz",
  moduleSlug: "dubai-real-estate-overview",
  competencySlug: "market-intelligence",
  questions: [
    {
      id: "q1",
      question: "When was freehold property ownership first extended to foreign nationals in Dubai?",
      options: [
        { text: "1997", correct: false },
        { text: "2002", correct: true },
        { text: "2008", correct: false },
        { text: "2010", correct: false },
      ],
      explanation: "Freehold ownership was extended to foreign nationals in designated areas in 2002, five years after it was introduced for UAE nationals in 1997.",
    },
    {
      id: "q2",
      question: "Which of the following is NOT a key characteristic of Dubai's current real estate market?",
      options: [
        { text: "Population growth driving housing demand", correct: false },
        { text: "Robust regulatory framework (RERA, DLD)", correct: false },
        { text: "Higher prices than London and New York", correct: true },
        { text: "Economic diversification supporting investment", correct: false },
      ],
      explanation: "Dubai remains competitively priced compared to global gateway cities like London, New York, and Singapore.",
    },
    // ... 3-4 more questions
  ],
}
```

### Quiz Design Guidelines

| Guideline | Requirement |
|-----------|-------------|
| Questions per quiz | 4-6 questions |
| Options per question | Exactly 4 |
| Correct answers | Exactly 1 per question |
| Pass threshold | 80% (configured in `lib/config.ts`) |
| Question types | Concept, process, scenario, application |

### Question Type Examples

**Concept Question:**
> "What is the primary role of RERA in Dubai's real estate sector?"

**Process Question:**
> "What is the correct order of steps for off-plan booking?"

**Scenario Question:**
> "A client says they're worried about developer delays. Which objection type is this?"

**Application Question:**
> "A UK investor asks about rental yields. Which Advisory Style is most appropriate?"

---

## AI Simulation Structure

AI simulations are the primary skill-building mechanism. Every module marked "Skills" or "Skills + Script" must include an AI simulation prompt.

### TypeScript Interface

```typescript
interface AISimulation {
  name: string              // Scenario name
  persona: {
    name: string            // Character name
    age: number
    nationality: string
    profession: string
    background: string      // 1-2 sentences
  }
  situation: {
    budget: string          // Range, revealed gradually
    goal: string            // Primary motivation
    timeline: string
    concerns: string[]      // Hidden worries
    decisionProcess: string // Who else is involved
  }
  communicationStyle: string[] // 3-4 traits
  consultantObjectives: string[] // What consultant must achieve
  endCondition: string      // When to end simulation
  feedbackCriteria: string[] // What to evaluate
}
```

### Example AI Simulation Prompt

Include this format at the end of skills modules:

```markdown
## AI Practice: Discovery Call with Investor

### Simulation Setup

You are playing: **Raj**, 45-year-old Indian businessman based in Mumbai. You have a successful trading company and are looking to diversify into real estate. This would be your first international property purchase.

**Your situation (reveal gradually):**
- Budget: 2-3 million AED (but be vague initially)
- Goal: Golden Visa for family + rental income
- Timeline: Within 6 months
- Concerns: Off-plan risk (heard stories of delays), unfamiliarity with Dubai process
- Decision process: Will consult with wife but has final authority
- You've spoken to two other agents already (don't volunteer this)

**Your communication style:**
- Polite but slightly guarded
- Answers questions but doesn't elaborate unless probed
- Responds well to agents who ask about his family situation
- Put off by agents who immediately pitch properties

**The consultant's job:**
- Build rapport
- Discover your actual goals and situation
- Qualify your budget and timeline
- Address your concerns about off-plan
- Propose a clear next step

End the simulation after 8-10 exchanges or when a next step is agreed.

**Provide feedback:**
- What the consultant did well
- What they missed or could improve
- Rating: Needs Work / Competent / Strong
```

### Simulation Categories

| Category | Use Case | Competencies |
|----------|----------|--------------|
| Discovery | Qualifying buyers | 2, 3 |
| First Contact | Portal lead response | 3 |
| Presentation | Presenting properties | 3, 4 |
| Objection | Handling resistance | 6 |
| Difficult | Upset clients, problems | 5, 6, 7 |

---

## Content Formatting Rules

### Markdown Syntax Supported

The LMS uses a simple markdown parser. Use ONLY these elements:

| Element | Syntax | Notes |
|---------|--------|-------|
| H2 Heading | `## Heading` | Main sections |
| H3 Heading | `### Heading` | Subsections |
| Bold | `**text**` | For emphasis |
| Bullet list | `- item` | Unordered lists |
| Numbered list | `1. item` | Ordered lists |
| Paragraphs | Double newline | Blank line between paragraphs |

### NOT Supported (Avoid These)

- Code blocks (triple backticks)
- Images
- Links
- Tables (use bullet lists instead)
- Inline code (single backticks)
- Blockquotes
- Horizontal rules

### Content Structure Template

Every module MUST follow this structure:

```markdown
## Introduction

[1-2 paragraphs setting context for the topic]

## [Main Topic Section]

[Core content with explanation]

### [Subsection if needed]

[Detail on specific aspect]

### Key Points

- **Point 1**: [Explanation]
- **Point 2**: [Explanation]
- **Point 3**: [Explanation]

## [Second Main Section if needed]

[Additional content]

## Why This Matters

[1-2 paragraphs connecting to practical application]

1. [Practical benefit 1]
2. [Practical benefit 2]
3. [Practical benefit 3]
```

### Writing Style Guidelines

| Guideline | Requirement |
|-----------|-------------|
| Tone | Professional, clear, confident — not corporate or stiff |
| Language | Simple, accessible to non-native English speakers |
| Sentences | Short to medium length, clear structure |
| Jargon | Define technical terms on first use |
| Voice | Second person ("you") for instructions |
| Brand | "Quiet luxury" — authoritative but not pushy |

### Word Count Guidelines

| Content Type | Target Length |
|--------------|---------------|
| Module content | 600-1200 words |
| Key takeaway | 10-25 words each |
| Quiz question | 10-30 words |
| Quiz option | 3-15 words |
| Quiz explanation | 20-50 words |

---

## Navigation & Linking

### Module Sequence

Modules within a competency must be properly linked:

```typescript
// First module
{
  prevModule: undefined,  // Omit this property entirely
  nextModule: { slug: "module-2-slug", title: "Module 2 Title" },
}

// Middle module
{
  prevModule: { slug: "module-1-slug", title: "Module 1 Title" },
  nextModule: { slug: "module-3-slug", title: "Module 3 Title" },
}

// Last module
{
  prevModule: { slug: "module-n-1-slug", title: "Module N-1 Title" },
  nextModule: undefined,  // Omit this property entirely
}
```

### Quiz Linking

Each module can optionally link to a quiz:

```typescript
// Module with quiz
{
  quizId: "competency-slug-1",  // Must exist in quizData
}

// Module without quiz
{
  // Simply omit the quizId property
}
```

---

## Complete Examples

### Full Competency Example

```typescript
// In app/learn/[competency]/page.tsx

"objection-navigation": {
  name: "Objection Navigation",
  description: "Handle investor concerns with confidence and credibility",
  icon: MessageSquareIcon,
  modules: [
    {
      slug: "common-objections",
      title: "Common Objections",
      description: "Understanding the most frequent investor concerns",
      duration: "30 min",
      status: "not-started",
    },
    {
      slug: "bubble-concerns",
      title: "Market Bubble Concerns",
      description: "Addressing fears about market overvaluation",
      duration: "35 min",
      status: "not-started",
    },
    {
      slug: "developer-delays",
      title: "Developer Delays",
      description: "Handling concerns about construction timelines",
      duration: "25 min",
      status: "not-started",
    },
    {
      slug: "hidden-fees",
      title: "Hidden Fees & Costs",
      description: "Transparency about all transaction costs",
      duration: "30 min",
      status: "not-started",
    },
    {
      slug: "objection-techniques",
      title: "Objection Handling Techniques",
      description: "Frameworks for addressing concerns professionally",
      duration: "35 min",
      status: "not-started",
    },
  ],
}
```

### Full Module Example

```typescript
// In app/learn/[competency]/[module]/page.tsx

"objection-navigation": {
  "common-objections": {
    title: "Common Objections",
    duration: "30 min",
    content: `
## Introduction

Every investor considering Dubai real estate will have questions and concerns. Some they express openly; others remain unspoken. Understanding the most common objections enables you to address them proactively and professionally.

## The Five Objection Types

Not all objections are equal. Recognizing the type helps you respond appropriately.

### Need Objections

The client doesn't see why they should invest at all.

- **Example**: "I'm not sure property is the right asset class for me"
- **Response approach**: Explore their investment goals and alternatives

### Understanding Objections

The client lacks information or has misconceptions.

- **Example**: "I heard Dubai prices are falling"
- **Response approach**: Provide accurate data and context

### Trust Objections

The client doesn't yet trust you, the market, or developers.

- **Example**: "How do I know the developer will deliver on time?"
- **Response approach**: Build credibility through evidence and references

### Shortcoming Objections

There's a genuine limitation you cannot overcome.

- **Example**: "I need a property under AED 500,000 in Downtown"
- **Response approach**: Acknowledge honestly and offer alternatives

### Tactical Objections

The client is negotiating or testing you.

- **Example**: "Your competitor is offering lower commission"
- **Response approach**: Hold your value, don't compete on price

## The Acknowledge-Before-Address Rule

Before responding to any objection, validate the client's concern.

- **Wrong**: "Actually, that's not correct. Let me explain..."
- **Right**: "That's a fair concern. Many investors ask about this..."

This approach:

1. Shows you're listening
2. Reduces defensiveness
3. Creates space for your response
4. Builds trust through empathy

## Why This Matters

Mastering objection navigation enables you to:

1. Convert hesitant prospects into confident buyers
2. Build deeper trust through transparent communication
3. Differentiate yourself from pushy competitors
4. Create long-term relationships based on honesty
    `,
    keyTakeaways: [
      "Objections fall into five types: Need, Understanding, Trust, Shortcoming, and Tactical",
      "Always acknowledge the concern before addressing it",
      "Match your response approach to the objection type",
      "Honest handling of shortcoming objections builds more trust than overselling",
    ],
    nextModule: { slug: "bubble-concerns", title: "Market Bubble Concerns" },
    quizId: "objection-navigation-1",
  },
}
```

### Full Module Example with Multimedia

```typescript
// Complete example with videos, images, and practical content

"market-intelligence": {
  "golden-visa": {
    title: "Golden Visa & Residency",
    duration: "25 min",
    content: `
## Introduction

The UAE Golden Visa program is one of Dubai's most powerful selling points for international investors. Understanding the requirements, benefits, and positioning enables you to present property investment as more than just a financial decision.

## Golden Visa Requirements

### Property Investment Route

To qualify for a 10-year Golden Visa through property investment:

- **Minimum Investment**: AED 2,000,000 (approximately USD 545,000)
- **Property Type**: Must be residential (not commercial)
- **Ownership**: Can be single property or multiple properties totalling AED 2M+
- **Mortgage**: Property must be fully paid (no mortgage allowed for visa purposes)

### What to Say

**Client:** "I'm interested in the Golden Visa. What do I need to qualify?"

**Consultant:** "The property investment route requires AED 2 million in residential real estate, fully paid off. Here's what makes it attractive: unlike other countries' investor visas, you're not parking money in a fund—you own a tangible asset that can generate 6-7% rental yield while you hold it. Would you like me to show you some options that hit exactly the AED 2M threshold?"

## The Real Benefits

### Beyond Residency

The Golden Visa unlocks:

- **10-year renewable residency** for investor and family
- **UAE banking access** — essential for property management
- **Business formation rights** — can establish UAE companies
- **No minimum stay requirements** — visit when you want
- **Sponsor family members** — spouse, children, parents

### Common Mistakes

❌ **Wrong:** "The Golden Visa is just about living in Dubai"
✅ **Right:** "The Golden Visa transforms your Dubai investment into a regional business hub—banking, company formation, and family residency all become accessible"

❌ **Wrong:** Recommending a AED 1.9M property without mentioning visa implications
✅ **Right:** "At AED 1.9M you're just AED 100K short of Golden Visa eligibility. Would it make sense to look at options at AED 2M+ to unlock the residency benefits?"

## Positioning for Different Clients

### For Yield-Focused Investors

"The Golden Visa is a bonus—you're getting 6-7% yield on a real asset, AND unlocking UAE residency and banking. In London, you'd need £2M+ for a similar visa, and you'd be earning 3% yield."

### For Business Owners

"Beyond residency, the Golden Visa lets you establish a UAE company. Many clients use this to create a regional hub—lower tax, access to Middle East and African markets, and AED/USD currency stability."

### For Families

"The visa covers your spouse and children automatically. Some clients also sponsor parents. It's a complete family solution, not just an investment visa."

## Worked Example

**Client Profile:** UK family, budget AED 2.5M, wants rental income + visa

**Recommendation Rationale:**
- AED 2.5M exceeds the AED 2M threshold with buffer
- Cash purchase qualifies for visa immediately
- Can rent property while visiting Dubai periodically
- Children can eventually study at UAE universities on family visa

**Sample Property:** 2-bedroom apartment in Dubai Marina
- Price: AED 2.4M
- Expected rent: AED 150,000/year
- Gross yield: 6.25%
- Visa: ✓ Qualifies for 10-year Golden Visa

## Why This Matters

The Golden Visa transforms your role from property broker to life advisor. Clients don't just buy square footage—they buy access to a new jurisdiction, banking system, and lifestyle option.

1. Always check if clients are within range of the AED 2M threshold
2. Position the visa as added value, not the primary reason to buy
3. Understand family composition to explain full visa benefits
    `,
    keyTakeaways: [
      "Golden Visa requires AED 2M+ in residential property, fully paid off",
      "Benefits extend beyond residency: banking, business formation, family sponsorship",
      "Always flag to clients when they're close to the AED 2M threshold",
      "Position the visa as added value that transforms the investment proposition",
    ],
    videos: [
      {
        title: "UAE Golden Visa Explained - Property Investment Route",
        url: "https://www.youtube.com/watch?v=example1",
        duration: "10:24",
        description: "Official overview of Golden Visa requirements and application process",
        timestamp: "2:15",
      },
      {
        title: "Golden Visa Dubai 2025 - What's Changed",
        url: "https://www.youtube.com/watch?v=example2",
        duration: "8:45",
        description: "Recent updates to the program and processing times",
      },
    ],
    images: {
      hero: {
        url: "https://unsplash.com/photos/ZVhm6rEKEX8",
        alt: "Dubai skyline at sunset with Burj Khalifa",
        credit: "David Rodrigo",
      },
      sections: [
        {
          url: "https://unsplash.com/photos/WE_Kv_ZB1l0",
          alt: "UAE passport and visa documents",
          placement: "After 'Golden Visa Requirements' section",
        },
        {
          url: "https://unsplash.com/photos/5QgIuuBxKwM",
          alt: "Family walking on Dubai beach",
          placement: "After 'For Families' section",
        },
      ],
    },
    prevModule: { slug: "area-knowledge", title: "Area Knowledge" },
    nextModule: { slug: "market-trends", title: "Market Trends & Analysis" },
    quizId: "market-intelligence-3",
  },
}
```

### Full Quiz Example

```typescript
// In app/learn/quiz/[id]/page.tsx

"objection-navigation-1": {
  title: "Common Objections Quiz",
  moduleSlug: "common-objections",
  competencySlug: "objection-navigation",
  questions: [
    {
      id: "q1",
      question: "A client says 'I heard Dubai property prices are falling.' What type of objection is this?",
      options: [
        { text: "Need objection", correct: false },
        { text: "Understanding objection", correct: true },
        { text: "Trust objection", correct: false },
        { text: "Tactical objection", correct: false },
      ],
      explanation: "This is an Understanding objection because the client has a misconception based on incomplete or incorrect information. The correct response is to provide accurate data and context.",
    },
    {
      id: "q2",
      question: "What should you do BEFORE addressing any client objection?",
      options: [
        { text: "Present data that proves them wrong", correct: false },
        { text: "Acknowledge and validate their concern", correct: true },
        { text: "Redirect to a different topic", correct: false },
        { text: "Ask why they have that concern", correct: false },
      ],
      explanation: "The Acknowledge-Before-Address rule requires validating the client's concern first. This shows you're listening, reduces defensiveness, and creates space for your response.",
    },
    {
      id: "q3",
      question: "A client needs a Downtown apartment for under AED 500,000, which doesn't exist. What objection type is this?",
      options: [
        { text: "Understanding objection", correct: false },
        { text: "Trust objection", correct: false },
        { text: "Shortcoming objection", correct: true },
        { text: "Need objection", correct: false },
      ],
      explanation: "This is a Shortcoming objection because there's a genuine limitation you cannot overcome. The correct approach is to acknowledge honestly and offer alternative solutions.",
    },
    {
      id: "q4",
      question: "A client says 'Your competitor is offering lower commission.' How should you classify this?",
      options: [
        { text: "Shortcoming objection", correct: false },
        { text: "Understanding objection", correct: false },
        { text: "Trust objection", correct: false },
        { text: "Tactical objection", correct: true },
      ],
      explanation: "This is a Tactical objection where the client is negotiating or testing you. The correct response is to hold your value rather than compete on price.",
    },
    {
      id: "q5",
      question: "Why is honest handling of shortcoming objections important?",
      options: [
        { text: "It helps close the sale faster", correct: false },
        { text: "It builds more trust than overselling", correct: true },
        { text: "It allows you to change the subject", correct: false },
        { text: "It is required by RERA regulations", correct: false },
      ],
      explanation: "Honestly acknowledging limitations and offering alternatives builds deeper trust with clients. This approach creates long-term relationships and referrals rather than one-time transactions.",
    },
  ],
}
```

---

## Validation Checklist

Before submitting content, verify:

### Competency Data

- [ ] Slug is lowercase with hyphens only
- [ ] Name matches one of the 8 defined competencies
- [ ] Description is one clear sentence
- [ ] Each module has all required fields (slug, title, description, duration, type, status)
- [ ] Module type is correct (Knowledge, Knowledge + Checklist, Skills, Skills + Script)
- [ ] Module order is logical and progressive

### Module Content

- [ ] Title matches the reference in competency data
- [ ] Duration is realistic (20-45 min typical)
- [ ] Type field matches content requirements
- [ ] Content follows the required structure template
- [ ] **Contains dialogue examples** ("What to Say" sections) for Skills + Script modules
- [ ] **Contains worked examples** (calculations, frameworks, checklists)
- [ ] **Contains "Common Mistakes"** section with ❌ Wrong / ✅ Right patterns
- [ ] **Contains AI Simulation prompt** for Skills and Skills + Script modules
- [ ] Only supported markdown syntax is used
- [ ] Word count is 1000-2000 words (skills modules may be longer)
- [ ] Key takeaways are 3-5 bullet points (start with action verbs)
- [ ] Navigation links (prevModule/nextModule) are correct
- [ ] Quiz ID follows naming convention (if applicable)

### AI Simulation Content

- [ ] Persona is clearly defined (name, age, nationality, profession)
- [ ] Situation includes hidden information to reveal gradually
- [ ] Communication style traits are specific (not generic)
- [ ] Consultant objectives are clear and measurable
- [ ] End condition is specified (exchange count or outcome)
- [ ] Feedback criteria include rating scale (Needs Work / Competent / Strong)

### Multimedia Content

- [ ] 1-3 YouTube videos included per module
- [ ] Video URLs are real and working (not hallucinated)
- [ ] Videos are recent (2023-2025 preferred)
- [ ] Videos are under 15 minutes duration
- [ ] Video descriptions explain relevance to module
- [ ] Hero image included with alt text and credit
- [ ] 1-3 section images with placement notes
- [ ] Image URLs are valid Unsplash/Pexels links

### Quiz Data

- [ ] Quiz ID matches the format `{competency}-{number}`
- [ ] Title describes the quiz content
- [ ] moduleSlug links to correct module
- [ ] competencySlug links to correct competency
- [ ] 5 questions are included
- [ ] Each question has exactly 4 options
- [ ] Each question has exactly 1 correct answer
- [ ] **At least 3 questions are scenario-based** (not pure recall)
- [ ] Explanations explain WHY correct AND why wrong answers fail
- [ ] Mix of question types (concept, process, scenario, calculation)

### Practical Content Quality

- [ ] Language is clear and accessible to non-native speakers
- [ ] Technical terms are defined on first use
- [ ] **Specific Dubai examples used** (areas, developers, price points)
- [ ] **Real calculations shown** with actual numbers
- [ ] Content is immediately applicable to next client meeting
- [ ] Brand voice is "quiet luxury" — authoritative, never pushy
- [ ] No urgency language or pressure tactics

---

## Complete Module List (60 Modules)

### Competency 0: Foundations (5 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 0.1 | company-orientation | Prime Capital Orientation | Knowledge |
| 0.2 | code-of-conduct | Professional Standards | Knowledge + Checklist |
| 0.3 | broker-licensing | Broker Licensing & Compliance | Knowledge + Checklist |
| 0.4 | essential-tools | Essential Tools Overview | Knowledge |
| 0.5 | daily-workflow | Daily Workflow & Productivity | Skills |

### Competency 1: Market Intelligence (10 modules)

| # | Slug | Title | Type |
|---|------|-------|------|
| 1.1 | dubai-overview | Dubai Real Estate Overview | Knowledge |
| 1.2 | competitive-landscape | Prime Capital Positioning | Knowledge + Script |
| 1.3 | regulatory-framework | Regulatory Framework | Knowledge |
| 1.4 | offplan-vs-ready | Off-Plan vs Ready Properties | Knowledge + Script |
| 1.5 | key-developers | Key Developers | Knowledge |
| 1.6 | area-knowledge | Dubai Areas & Communities | Knowledge |
| 1.7 | area-deep-dives | Area Deep-Dives by Segment | Knowledge |
| 1.8 | golden-visa | Golden Visa & Residency | Knowledge + Script |
| 1.9 | economic-vision | Dubai's Economic Vision | Knowledge |
| 1.10 | global-comparison | Dubai vs Global Markets | Knowledge + Script |

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
| 5.7 | escrow-protection | Escrow Accounts | Knowledge + Script |
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

## Quiz Allocation (20 Quizzes)

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

---

| Objection Handling Guide | `legacy/lms/prime-capital-objection-handling-guide.md` | 5 objection types and response strategies |
| Off-Plan Program | `legacy/lms/prime-capital-offplan-training-program.md` | Off-plan specifics, qualification frameworks |

### Key Statistics to Use (from Training Guide)

| Metric | Value | Source |
|--------|-------|--------|
| Dubai transactions 2024 | 169,083 sales (+42% YoY) | DLD |
| Transaction value 2024 | AED 427 billion (+34% YoY) | DLD |
| Average rental yield | 6.9% | Market data |
| DLD registration fee | 4% | DLD |
| Golden Visa threshold | AED 2,000,000 | UAE government |
| Population 2024 | 3.86 million | Dubai Statistics |
| Population 2033 target | 5.8 million | D33 Agenda |

### YouTube Channels to Prioritize

| Channel | Focus | Use For |
|---------|-------|---------|
| Tahir Majithia | Dubai market insights | Market intelligence modules |
| PropertyFinder UAE | Property search, market reports | Area knowledge, trends |
| Bayut | Market analysis, area guides | Area knowledge |
| fäm Properties | Investment strategies | Investment, yields |
| DXB Interact | Official market data | Market trends, analysis |

---

*This specification ensures all AI-generated content integrates seamlessly with the Prime Capital Dubai LMS and delivers world-class, practical training.*
