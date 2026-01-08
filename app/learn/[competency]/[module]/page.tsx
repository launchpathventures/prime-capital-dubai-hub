/**
 * CATALYST - Module Content Page
 *
 * Displays learning module content with progress tracking.
 * Dynamic route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Container, Stack, Row, Text, Title, Prose } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Module Content Data (mock - would come from database/CMS)
// -----------------------------------------------------------------------------

const moduleContent: Record<string, Record<string, {
  title: string
  duration: string
  content: string
  keyTakeaways: string[]
  nextModule?: { slug: string; title: string }
  prevModule?: { slug: string; title: string }
  quizId?: string
}>> = {
  "market-intelligence": {
    "dubai-real-estate-overview": {
      title: "Dubai Real Estate Overview",
      duration: "30 min",
      content: `
## Introduction

Dubai's real estate market is one of the most dynamic and attractive in the world. Understanding its history, growth trajectory, and current state is fundamental to advising international investors effectively.

## Historical Context

Dubai's transformation from a small trading port to a global metropolis is one of the most remarkable urban development stories of the modern era. The real estate sector has been central to this transformation.

### Key Milestones

- **1997**: Freehold property ownership introduced for UAE nationals
- **2002**: Freehold ownership extended to foreign nationals in designated areas
- **2004-2008**: First real estate boom, major developments launched
- **2008-2010**: Global financial crisis impact and market correction
- **2011-2014**: Recovery and sustainable growth period
- **2020-Present**: Pandemic-driven transformation and record growth

## Current Market State

The Dubai real estate market has demonstrated remarkable resilience and growth, particularly since 2021. Key characteristics include:

### Market Fundamentals

- **Population Growth**: Dubai's population continues to grow, driving housing demand
- **Economic Diversification**: Tourism, finance, and technology sectors drive investment
- **Regulatory Maturity**: RERA and DLD provide robust investor protection
- **Infrastructure**: World-class infrastructure supports property values

### Price Dynamics

Dubai remains competitively priced compared to global cities like London, New York, and Singapore, offering attractive entry points for international investors.

## Why This Matters

Understanding the market context enables you to:

1. Position Dubai as a credible investment destination
2. Address investor concerns with factual context
3. Demonstrate expertise that builds client trust
4. Make informed property recommendations
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
    "regulatory-framework": {
      title: "Regulatory Framework",
      duration: "45 min",
      content: `
## Introduction

Dubai's real estate regulatory framework is designed to protect investors and ensure market transparency. Understanding these regulations is essential for providing accurate advice to clients.

## Key Regulatory Bodies

### RERA (Real Estate Regulatory Agency)

RERA is the regulatory arm of the Dubai Land Department, responsible for:

- Licensing real estate professionals and companies
- Regulating property advertisements
- Managing escrow accounts for off-plan projects
- Handling disputes between parties

### DLD (Dubai Land Department)

The DLD is the government authority that:

- Registers all property transactions
- Issues title deeds (Oqood for off-plan, Title Deed for completed)
- Maintains the property ownership registry
- Collects registration fees (4% of property value)

## Ownership Types

### Freehold

- Full ownership rights in perpetuity
- Available to foreign nationals in designated areas
- Most common for international investors

### Leasehold

- Long-term lease (typically 99 years)
- Less common, mainly in older developments

## Registration Process

All property transactions must be registered with the DLD:

1. **MOU (Memorandum of Understanding)**: Initial agreement between buyer and seller
2. **NOC (No Objection Certificate)**: Issued by developer confirming no outstanding payments
3. **Transfer**: Official registration at DLD trustee office
4. **Title Deed**: Issued by DLD confirming ownership

## Escrow Regulations

For off-plan purchases, developers must:

- Register the project with RERA
- Open a dedicated escrow account
- Use buyer payments only for construction
- Meet milestone requirements before fund release

This protects buyers from developer insolvency or fund misuse.
      `,
      keyTakeaways: [
        "RERA and DLD work together to regulate Dubai's property market",
        "All transactions must be registered with DLD (4% registration fee)",
        "Escrow accounts protect off-plan buyers from developer default",
        "Freehold ownership is available to foreign nationals in designated areas",
      ],
      prevModule: { slug: "dubai-real-estate-overview", title: "Dubai Real Estate Overview" },
      nextModule: { slug: "market-segments", title: "Market Segments" },
      quizId: "market-intelligence-2",
    },
    "golden-visa": {
      title: "Golden Visa & Residency",
      duration: "25 min",
      content: `
## Introduction

The UAE Golden Visa program is one of Dubai's most powerful selling points for international investors. Understanding the requirements, benefits, and positioning enables you to present property investment as more than just a financial decision—it's a gateway to a new jurisdiction, banking system, and lifestyle.

## Golden Visa Requirements

### Property Investment Route

To qualify for a 10-year Golden Visa through property investment:

- **Minimum Investment**: AED 2,000,000 (approximately USD 545,000)
- **Property Type**: Must be residential (not commercial)
- **Ownership**: Can be single property or multiple properties totalling AED 2M+
- **Mortgage**: Property must be fully paid (no mortgage allowed for visa purposes)
- **Timeline**: Application can begin once title deed is issued

### What to Say

**Client:** "I'm interested in the Golden Visa. What exactly do I need to qualify?"

**Consultant:** "The property investment route requires AED 2 million in residential real estate, fully paid off. Here's what makes it attractive: unlike investor visas in other countries where you park money in a fund, you own a tangible asset that generates 6-7% rental yield while you hold it. The visa covers your spouse and children automatically. Would you like me to show you some options that hit exactly the AED 2M threshold?"

**Client:** "Can I get the visa if I have a mortgage?"

**Consultant:** "The property needs to be fully paid for the Golden Visa. However, many clients purchase with a mortgage initially, then refinance or pay down once they're ready to apply. We can structure your investment timeline around this if the visa is important to you."

## The Real Benefits

### Beyond Residency

The Golden Visa unlocks:

- **10-year renewable residency** for investor and family
- **UAE banking access** — essential for property management and business
- **Business formation rights** — can establish UAE companies
- **No minimum stay requirements** — visit when you want, live where you want
- **Sponsor family members** — spouse, children, and even parents

### The Banking Advantage

This is often overlooked: UAE bank accounts require residency. Without the Golden Visa, managing rental income, paying service charges, and handling property matters becomes complicated. The visa solves this completely.

## Common Mistakes

❌ **Wrong:** "The Golden Visa is just about living in Dubai"

✅ **Right:** "The Golden Visa transforms your Dubai investment into a regional business hub—banking, company formation, and family residency all become accessible"

❌ **Wrong:** Recommending a AED 1.9M property without mentioning visa implications

✅ **Right:** "At AED 1.9M you're just AED 100K short of Golden Visa eligibility. Would it make sense to look at options at AED 2M+ to unlock the residency benefits?"

❌ **Wrong:** Assuming all clients want the visa

✅ **Right:** Ask: "Is UAE residency something that would be valuable for you, or are you purely focused on the investment returns?"

## Positioning for Different Clients

### For Yield-Focused Investors

"The Golden Visa is a bonus—you're getting 6-7% yield on a real asset, AND unlocking UAE residency and banking. In London, you'd need £2M+ for a similar investor visa, and you'd be earning 3% yield. Here, you get both."

### For Business Owners

"Beyond residency, the Golden Visa lets you establish a UAE company. Many clients use this to create a regional hub—lower tax environment, access to Middle East and African markets, and AED/USD currency stability."

### For Families

"The visa covers your spouse and children automatically. Some clients also sponsor parents. It's a complete family solution, not just an investment visa."

### For Privacy-Conscious Clients

"The UAE has no personal income tax and strong banking privacy. For clients restructuring their international affairs, the Golden Visa provides a legitimate second jurisdiction."

## Worked Example

**Client Profile:** UK family, budget AED 2.5M, wants rental income + visa

**The Conversation:**

**Consultant:** "Based on what you've shared—income generation plus the Golden Visa—I'd suggest looking at the AED 2.2-2.5M range. This gives you comfortable buffer above the AED 2M threshold, and at this price point in Dubai Marina, you're looking at properties that rent for AED 140-160K annually."

**Client:** "What does that work out to as a yield?"

**Consultant:** "Let me show you. On a AED 2.4M apartment with AED 150K annual rent, your gross yield is 6.25%. After service charges of around AED 20K, your net yield is 5.4%. Compare that to a £500K London flat earning £18K rent—that's 3.6% gross. Plus, in London there's no investor visa attached."

**Property Example:**

- **Property**: 2-bedroom apartment, Dubai Marina
- **Price**: AED 2,400,000
- **Expected rent**: AED 150,000/year
- **Service charges**: AED 20,000/year
- **Gross yield**: 6.25%
- **Net yield**: 5.4%
- **Golden Visa**: ✓ Qualifies

## Pre-Meeting Checklist

When a client mentions Golden Visa interest, prepare:

- [ ] Confirm their budget is at or above AED 2M
- [ ] Clarify if they'll pay cash or need to clear mortgage first
- [ ] Understand family composition (spouse, children, parents to sponsor?)
- [ ] Ask about banking needs and business interests
- [ ] Prepare 3-4 properties at the AED 2M-2.5M range
- [ ] Have comparison ready: Dubai visa vs UK/EU/US investor visa costs

## Why This Matters

The Golden Visa transforms your role from property broker to life advisor. Clients don't just buy square footage—they buy access to a new jurisdiction, banking system, and lifestyle option. When you can articulate this value clearly, you're no longer competing on price with other agents.

1. Always check if clients are within range of the AED 2M threshold
2. Position the visa as added value, not the primary reason to buy
3. Understand family composition to explain full visa benefits
4. Remember: the banking access is often more valuable than the residency itself
      `,
      keyTakeaways: [
        "Golden Visa requires AED 2M+ in residential property, fully paid off—no mortgage",
        "Benefits extend beyond residency: banking access, business formation, family sponsorship",
        "Always flag when clients are within AED 100-200K of the AED 2M threshold",
        "Position the visa as added value that transforms a property purchase into a lifestyle upgrade",
        "UAE banking access is often the most practical benefit for international investors",
      ],
      prevModule: { slug: "area-knowledge", title: "Area Knowledge" },
      nextModule: { slug: "market-trends", title: "Market Trends & Analysis" },
      quizId: "market-intelligence-3",
    },
  },
  "client-discovery": {
    "investor-personas": {
      title: "Investor Personas",
      duration: "30 min",
      content: `
## Learning Objective

By the end of this module, you will be able to identify the primary investor persona within 60 seconds of initial conversation and adapt your discovery approach based on their likely motivations, concerns, and decision-making patterns.

## Why Investor Personas Matter

Every client who contacts Prime Capital has a story. Some want a home. Some want returns. Some want a visa. Many want a combination. Understanding the primary driver shapes everything—the questions you ask, the properties you recommend, the objections you'll face.

Personas aren't boxes that clients fit neatly into. They're lenses that help you see clearly. Most clients have a primary motivation and secondary motivations. Your job is to identify the primary driver first, then explore the full picture.

## The Four Primary Personas

### 1. The End-User

**Primary motivation:** A home to live in, now or in the future.

**What they say:**
- "I want something close to my office"
- "My kids need good schools nearby"
- "I'm tired of paying rent every month"

**Decision dynamics:** Spouse/partner usually involved heavily. Children's needs often decide the location. Timeline tied to lease expiry, job start, or life events.

### 2. The Investor

**Primary motivation:** Financial returns—capital appreciation, rental yield, or both.

**What they say:**
- "What's the ROI on this?"
- "I want passive income"
- "I'm looking for something that will appreciate"

**Decision dynamics:** Often sole decision-maker (or with financial advisor). Comparison-driven: evaluating Dubai vs other markets.

### 3. The Visa-Seeker

**Primary motivation:** UAE residency through the Golden Visa program.

**What they say:**
- "I need something for the visa"
- "What's the minimum for Golden Visa?"
- "Can my family be included?"

**Decision dynamics:** Often first-time Dubai buyers. May have misconceptions about the process. Sometimes on a specific timeline.

### 4. The Hybrid

**Primary motivation:** Combination of above—most common in reality.

**What they say:**
- "I want a good investment that could also be a visa"
- "We might move to Dubai eventually, but for now we'd rent it out"

**Decision dynamics:** More complex qualification needed. May shift priorities as conversation progresses.

## Nationality Patterns

### Indian Investors
- Family decisions are common; ask who else is involved
- Strong ROI focus; have yield calculations ready
- Golden Visa for children's education is a major driver

### European Expats
- Lifestyle focus often trumps pure returns
- Exit strategy matters; they think about selling before buying
- Currency considerations affect perceived value

### GCC Investors
- Discretion paramount; earn trust before probing
- Developer reputation and prestige matter more than yield
- Relationship-first; don't rush the commercial discussion

### Chinese Investors
- Capital mobility considerations; don't ask directly
- Family safety and children's education are powerful motivators
- Extensive due diligence on developers; be ready with details

## The 60-Second Assessment

Within the first minute of conversation, gather clues:

**Listen for:** Why did they reach out? What words do they use? What questions do they ask first?

**Form a hypothesis:** Primary persona, likely secondary interests, nationality patterns that may apply.

Then test your hypothesis with early discovery questions.
      `,
      keyTakeaways: [
        "Four primary personas exist: End-user, Investor, Visa-seeker, and Hybrid—most clients are hybrids",
        "Nationality patterns inform but don't dictate your approach—use them as calibration",
        "60-second assessment is a hypothesis to test and refine through discovery",
        "The stated goal isn't always the real goal—dig deeper with follow-up questions",
      ],
      nextModule: { slug: "discovery-endusers", title: "Discovery: End-Users" },
    },
    "discovery-endusers": {
      title: "Discovery: End-Users",
      duration: "35 min",
      content: `
## Learning Objective

By the end of this module, you will be able to conduct a complete end-user discovery conversation using a structured script that uncovers lifestyle needs, family dynamics, timeline drivers, and emotional priorities.

## Why End-User Discovery Differs

End-users aren't buying an asset—they're buying a life. The apartment in Business Bay isn't about square footage; it's about waking up to a view, walking to work, and having a place to call home.

This emotional dimension changes everything. An investor tolerates imperfections if the numbers work. An end-user notices every flaw because they'll live with it daily.

## The End-User Discovery Script

### Opening: Set the Tone

**Consultant:** "Before we look at any properties, I'd like to understand what you're looking for so we can focus on options that actually fit. Does that sound okay?"

### Section 1: Current Situation

**Consultant:** "Let's start with where you are now. Are you currently renting in Dubai, or would this be a move from another city?"

Key follow-ups:
- "What made you choose [current location] originally?"
- "If you could change one thing about your current place, what would it be?"

### Section 2: Who's Involved

**Consultant:** "Who will be living in the new property? Is it just yourself, or is there family involved?"

Key follow-ups:
- "Are both of you equally involved in this decision?"
- "Will anyone else be visiting regularly—parents, other family?"

### Section 3: Location Priorities

**Consultant:** "Let's talk about location. Where do you work? Commute is usually a big factor."

Key follow-ups:
- "If you had to choose between a shorter commute and a bigger apartment, which would win?"
- "How important is walkability?"

### Section 4: Property Requirements

**Consultant:** "How many bedrooms are you thinking? What about outdoor space?"

Key follow-ups:
- "Are there any must-haves that would eliminate a property if it didn't have them?"
- "Do you prefer newer buildings or would an older building with more space work?"

### Section 5: Budget & Financing

**Consultant:** "Do you have a price range you're working with? Would you be paying cash, or would you need a mortgage?"

### Section 6: Timeline

**Consultant:** "What's your timeline looking like? Is there a date you need to move by?"

### Closing: Confirm Understanding

**Consultant:** "Let me make sure I've got this right. [Summarize key points.] Did I miss anything important?"

## Common Mistakes

1. **Jumping to properties too quickly** - Discovery first, listings second
2. **Focusing only on the primary contact** - Ask about absent partners
3. **Treating budget as a hard number** - Explore flexibility
      `,
      keyTakeaways: [
        "End-users buy a life, not an asset—discovery must uncover lifestyle and emotional priorities",
        "Family dynamics shape everything—who's involved, who decides, whose needs take priority",
        "The current situation reveals values—what they love and hate predicts what they'll want next",
        "Confirm understanding before moving forward—misunderstandings waste viewings",
      ],
      prevModule: { slug: "investor-personas", title: "Investor Personas" },
      nextModule: { slug: "discovery-investors", title: "Discovery: Investors" },
    },
    "discovery-investors": {
      title: "Discovery: Investors",
      duration: "40 min",
      content: `
## Learning Objective

By the end of this module, you will be able to qualify an investment buyer using a complete discovery script that uncovers investment objectives, risk tolerance, experience level, portfolio context, and the Goal Behind the Goal.

## Why Investor Discovery Is Different

Investors think in numbers. But the numbers that matter vary dramatically.

One investor wants the highest possible yield. Another wants capital appreciation. A third wants currency diversification and couldn't care less about Dubai specifically.

## The Investor Discovery Script

### Section 1: Investment Objective

**Consultant:** "When you think about property investment in Dubai, what's your primary goal? Are you focused on rental income, capital growth, or something else like diversification?"

Key follow-ups for yield-focused:
- "What yield range are you targeting?"
- "How important is tenant quality versus absolute yield?"

Key follow-ups for growth-focused:
- "What's your investment horizon?"
- "Are you comfortable with off-plan and timing risk?"

### Section 2: Experience Level

**Consultant:** "Have you invested in property before—either in Dubai or elsewhere?"

Key follow-ups:
- "What's your experience been like with those?"
- "Have you had any experiences that influence what you're looking for?"

### Section 3: Portfolio Context

**Consultant:** "How does Dubai fit into your overall investment strategy?"

This often reveals hidden motivations—currency hedging, diversification away from home market, etc.

### Section 4: Budget & Financing

**Consultant:** "What investment size are you comfortable with? Would you be paying cash, or would you want to leverage?"

If budget is vague: "Dubai has properties from AED 500K to AED 50M. Where do you see yourself on that spectrum?"

### Section 5: Timeline & Decision Process

**Consultant:** "What's your timeline? Are you actively ready to invest, or still in research mode?"

**Consultant:** "When it comes to making the decision, is that something you'll decide on your own, or are there others involved?"

### Section 6: The Goal Behind the Goal

**Consultant:** "Can I ask—what does [stated goal] actually mean for you? Why is that important?"

This technique uncovers real motivation. "High yield" might really mean "financial freedom." "Capital preservation" might mean "protecting wealth from inflation in my country."

### The Competitive Situation Check

**Consultant:** "Are you looking at other markets besides Dubai? Have you already spoken to other agents?"

## Common Mistakes

1. **Accepting "good investment" as an answer** - Push for specifics
2. **Quoting yield without knowing their baseline** - Establish their target first
3. **Skipping the decision process question** - Know who else is involved
      `,
      keyTakeaways: [
        "Always qualify what 'good investment' means—yield, growth, safety, or tax efficiency",
        "The Goal Behind the Goal reveals true motivation—dig beneath surface statements",
        "Experience shapes expectations—first-timers need education; seasoned investors need strategy",
        "Portfolio context matters—understand how Dubai fits their bigger picture",
      ],
      prevModule: { slug: "discovery-endusers", title: "Discovery: End-Users" },
      nextModule: { slug: "discovery-visa", title: "Discovery: Visa-Seekers" },
      quizId: "client-discovery-1",
    },
    "discovery-visa": {
      title: "Discovery: Visa-Seekers",
      duration: "35 min",
      content: `
## Learning Objective

By the end of this module, you will be able to qualify Golden Visa seekers efficiently using a discovery script that uncovers their real motivation for residency, family composition, budget constraints, and corrects common misconceptions.

## Why Visa-Seeker Discovery Matters

Visa-seekers think they want a property. What they actually want is what the visa enables: residency, banking access, business formation, family security, or a Plan B.

## Common Misconceptions to Correct

| Misconception | Reality |
|---------------|---------|
| "I can use a mortgage" | Property must be fully paid off |
| "Any property works" | Must be residential (not commercial) |
| "Immediate visa" | 3-6 weeks after title deed |
| "Visa is forever" | 10-year visa, renewable |

## The Visa-Seeker Discovery Script

### Section 1: The Real Motivation

**Consultant:** "When you think about having UAE residency, what does that open up for you? Is it about actually living here, banking access, business opportunities, or something else?"

Key follow-ups:
- "If you had the visa tomorrow, what would you actually do with it?"
- "Is banking access in the UAE important for you?"

### Section 2: Family Composition

**Consultant:** "Who will be included on the visa? Spouse, children, parents?"

The Golden Visa covers spouse and children automatically. Parents require additional applications.

### Section 3: Budget Reality Check

**Consultant:** "The Golden Visa requires AED 2 million minimum, fully paid off. No mortgage. Are you looking at the AED 2 million level, or higher?"

If they can't afford AED 2M: "At that budget, the property investment route won't work. However, there are other visa options—retirement visa, entrepreneur visa, remote work visa."

### Section 4: Timeline and Urgency

**Consultant:** "What's driving your timeline? Is there a specific date you need the visa by?"

Translate their deadline into purchase timeline: property takes 4-8 weeks, then visa application 3-6 weeks.

### Section 5: Secondary Interests

**Consultant:** "Beyond the visa, what else matters? Would you live in the property, rent it out, or keep it as a holiday base?"

Many visa-seekers also want yield—but some just want to qualify and don't care about the asset itself.

## Common Mistakes

1. **Assuming the visa is the only goal** - Explore secondary interests
2. **Not confirming cash availability** - "I have the budget" doesn't mean liquid cash
3. **Ignoring the family dimension** - Map the full family situation
      `,
      keyTakeaways: [
        "The visa is a means, not an end—understand what residency enables for them",
        "Correct misconceptions gently—many visa-seekers don't understand requirements",
        "Confirm cash reality—verify they can pay without mortgage",
        "Explore secondary interests—a pure-threshold buyer differs from someone wanting yield too",
      ],
      prevModule: { slug: "discovery-investors", title: "Discovery: Investors" },
      nextModule: { slug: "active-listening", title: "Active Listening" },
    },
    "active-listening": {
      title: "Active Listening",
      duration: "30 min",
      content: `
## Learning Objective

By the end of this module, you will be able to read between the lines of client responses, recognize the difference between buying signals and politeness, and use pivot questions that go deeper without being intrusive.

## The Three Levels of Listening

### Level 1: Surface Listening
You hear the words. You remember facts.

### Level 2: Contextual Listening
You hear the words plus their context. You understand why they're saying what they're saying.

### Level 3: Deep Listening
You hear what's said, what's not said, and how it's said. You notice emotion, hesitation, and conviction.

## What to Listen For

### Verbal Cues
- **Conviction words:** "Definitely," "absolutely," "must have" — signal non-negotiables
- **Hedging words:** "Maybe," "I guess," "ideally" — signal flexibility or uncertainty
- **Emotion words:** "Love," "hate," "can't stand" — signal strong preferences

### Tonal Cues
- **Energy increase:** Voice lifts, pace quickens — genuine interest
- **Energy decrease:** Voice drops, pace slows — boredom or discomfort
- **Hesitation:** Pause before answering — uncertainty or sensitivity

### What's NOT Said
- Avoided topics may indicate sensitivity
- Questions not asked reveal what doesn't matter to them

## Reading Between the Lines

### "That sounds interesting"
Could mean: genuine interest, polite deflection, or still processing.
**Pivot:** "What specifically caught your attention about that?"

### "I'll think about it"
Could mean: needs time, not convinced, or polite exit.
**Pivot:** "What aspects would you want to think through?"

### "My spouse will need to agree"
Could mean: joint decision, needs to convince them, or using spouse as excuse.
**Pivot:** "What do you think their main concerns would be?"

## Recognizing Buying Signals vs Politeness

### Buying Signals (Genuine Interest)
- "What happens next if we decide to proceed?"
- "How does the payment plan work?"
- Forward-looking statements: "When we move in..."
- Asking for specifics and details

### Politeness Signals (Not Interested)
- "That's nice." / "Interesting." / "Okay, good."
- Changing subject repeatedly
- Short answers, no follow-up questions
- "I have another call in a few minutes"

## Handling Clients Who Won't Open Up

**Acknowledge the resistance:** "I notice you're keeping your cards close, which I completely understand."

**Start with facts:** "Let's start with the practical stuff—budget, timeline, areas."

**Share first:** "Let me tell you what I'm seeing from other investors in similar situations."

**Give permission:** "It's completely fine if you're not sure yet."
      `,
      keyTakeaways: [
        "Listen at three levels: surface (words), contextual (meaning), and deep (emotion)",
        "Buying signals are forward-looking; politeness signals are surface-level",
        "Use pivot questions to go deeper: acknowledge, probe gently, offer an out",
        "Some clients need permission to open up—name the resistance or share first",
      ],
      prevModule: { slug: "discovery-visa", title: "Discovery: Visa-Seekers" },
      nextModule: { slug: "qualification-framework", title: "BANT+ Qualification" },
    },
    "qualification-framework": {
      title: "BANT+ Qualification",
      duration: "35 min",
      content: `
## Learning Objective

By the end of this module, you will be able to qualify a client's readiness within 5 minutes using the BANT+ framework—Budget, Authority, Need, Timeline, and Competitive situation.

## The BANT+ Framework

### B — Budget
What is their budget range? Is there flexibility? Cash or financing?

### A — Authority
Who makes the final decision? Who else needs to agree? Are there advisors involved?

### N — Need
What problem are they solving? How urgent is the need?

### T — Timeline
When do they want to buy? What's driving that timeline?

### + — Competitive Situation
Are they talking to other agents? Looking at other markets?

## The 5-Minute Qualifier Script

**Opening:** "Before we dive into specifics, let me ask a few quick questions to make sure I'm showing you things that actually fit."

**Question 1 (Budget):** "What budget range are you working with? Would that be cash or mortgage?"

**Question 2 (Timeline):** "What's your timeline? Are you looking to buy soon, or still researching?"

**Question 3 (Need):** "What's the main goal—living in, rental income, Golden Visa, or something else?"

**Question 4 (Authority):** "When it comes to deciding, is it just yourself, or are others involved?"

**Question 5 (Competition):** "Have you been looking at properties or speaking to other agents?"

**Closing:** "Perfect. So you're looking at [budget] for [goal], buying [timeline], with [decision-makers]. I have strong options. Shall we schedule a call this week?"

## The Decision Map Framework

For complex purchases, map who's involved:

- **Economic Buyer:** Has budget authority, signs the check
- **User:** Will actually use the property
- **Influencer:** Shapes the decision (family, advisors)
- **Blocker:** Could veto the deal

## Handling Common Challenges

### They won't tell you budget:
"Dubai has everything from AED 500K to AED 50M. Are we talking entry-level, mid-market, or premium?"

### "I'm just looking":
"That's fine. Can I ask what sparked your interest now? Is there a timeline, even roughly?"

### Decision-maker not available:
"What would be most useful for you to bring back to them?"

## Qualification Scoring

| Score | Profile | Action |
|-------|---------|--------|
| 5/5 strong | Hot lead | Prioritize, move fast |
| 3-4/5 | Warm lead | Nurture, schedule follow-up |
| 1-2/5 | Cold lead | Add to drip, check back later |
      `,
      keyTakeaways: [
        "BANT+ covers Budget, Authority, Need, Timeline, and Competitive situation",
        "The 5-Minute Qualifier is a conversation, not an interrogation—weave questions naturally",
        "Decision Maps reveal the full picture: economic buyer, user, influencers, and blockers",
        "Qualify early but not aggressively—balance efficiency with rapport-building",
      ],
      prevModule: { slug: "active-listening", title: "Active Listening" },
      nextModule: { slug: "managing-expectations", title: "Managing Expectations" },
      quizId: "client-discovery-2",
    },
    "managing-expectations": {
      title: "Managing Expectations",
      duration: "30 min",
      content: `
## Learning Objective

By the end of this module, you will be able to set realistic expectations from the first conversation about timelines, yields, processes, and market realities—protecting both client and consultant from future friction.

## Why Expectation Management Matters

Disappointed clients don't come from bad properties. They come from unrealistic expectations.

A client who expects 10% yield will be disappointed by 7%—even though 7% is excellent. A client who expects completion in one year will be frustrated by eighteen months—even though that's normal.

## The Five Expectation Areas

### 1. Market Expectations
**Unrealistic:** 10-15% yields, prices only go up
**Realistic:** 6-8% gross yields, markets fluctuate

**Script:** "Dubai's market is strong, but I want to be realistic. Average yields are around 6-8% gross, which is excellent compared to most global cities. That said, every investment has risks."

### 2. Timeline Expectations
**Unrealistic:** Purchase takes a few weeks, off-plan completes on time
**Realistic:** Ready property 4-8 weeks, off-plan dates are estimates

**Script:** "For a ready property, you're looking at four to eight weeks from offer to keys. For off-plan, completion dates are estimates—most developers complete within a few months of target, but delays happen."

### 3. Process Expectations
**Unrealistic:** Everything is simple, agent handles everything
**Realistic:** Multiple steps, multiple parties, costs beyond price

**Script:** "There are several steps: offer, MOU, due diligence, NOC, transfer at DLD. I'll coordinate everything, but you'll also interact with lawyers, developers, possibly banks."

### 4. Property Expectations
**Unrealistic:** Perfect property exists at their budget
**Realistic:** Every property involves trade-offs

**Script:** "At every budget level, there are trade-offs. Part of my job is understanding which factors matter most so we prioritize correctly."

### 5. Role Expectations
**Unrealistic:** Agent tells them what to buy
**Realistic:** Agent advises, client decides

**Script:** "My job isn't to sell you a property—it's to help you find the right one. I'll give my honest assessment, including concerns. Ultimately, you decide."

## When to Set Expectations

- **First contact:** Your role, realistic timeline, market realities
- **During discovery:** Specific budget and goal limitations
- **Before viewings:** Properties won't look exactly like marketing
- **Before offers:** Process steps, costs, what can be negotiated

## Handling Unrealistic Expectations

**Strategy 1: Acknowledge, Educate, Redirect**
"I understand the appeal of Downtown. At under one million, you'd be looking at studios there. For a three-bedroom at that budget, we'd explore JVC or Al Furjan."

**Strategy 2: Use Data**
"Let me share actual data: according to DXB Interact, average yields are 6-8%. The higher figures you've seen are likely calculated differently."

**Strategy 3: The "Other Clients" Frame**
"Most clients who've tried to negotiate 20% off have lost properties to other buyers. The successful approach is identifying fair value and moving quickly."

## Preventing Future Problems

- **Document everything:** Follow up in writing with key expectations
- **Confirm understanding:** "Just to confirm—you understand the 4% DLD fee is additional?"
- **Proactive updates:** When reality changes, communicate immediately
      `,
      keyTakeaways: [
        "Disappointment comes from unrealistic expectations, not bad properties—set expectations early",
        "Five key areas: market, timeline, process, property, and your role",
        "Use data and comparisons to educate—'According to DLD...' is more credible than 'I think...'",
        "Document and confirm understanding—put it in writing, verify they absorbed it",
      ],
      prevModule: { slug: "qualification-framework", title: "BANT+ Qualification" },
    },
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    competency: string
    module: string
  }>
}

export default async function ModulePage({ params }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  
  const competencyModules = moduleContent[competencySlug]
  if (!competencyModules) {
    notFound()
  }
  
  const moduleData = competencyModules[moduleSlug]
  if (!moduleData) {
    notFound()
  }

  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Row gap="xs" align="center" className="flex-wrap">
          <Link href="/learn">
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors">
              Dashboard
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Link href={`/learn/${competencySlug}`}>
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors capitalize">
              {competencySlug.replace(/-/g, " ")}
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Text size="sm">{moduleData.title}</Text>
        </Row>

        {/* Module Header */}
        <Stack gap="md">
          <Stack gap="sm">
            <Badge variant="outline" className="w-fit">
              <BookOpenIcon className="h-3 w-3 mr-1" />
              Module
            </Badge>
            <Title size="h1">{moduleData.title}</Title>
          </Stack>
          <Row gap="md" align="center">
            <Row gap="xs" align="center">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" variant="muted">{moduleData.duration} read</Text>
            </Row>
          </Row>
        </Stack>

        {/* Module Content */}
        <Prose className="module-content">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(moduleData.content) }} />
        </Prose>

        {/* Key Takeaways */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <Stack gap="md">
              <Row gap="sm" align="center">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <Title size="h4">Key Takeaways</Title>
              </Row>
              <ul className="space-y-2">
                {moduleData.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <Text size="sm">{takeaway}</Text>
                  </li>
                ))}
              </ul>
            </Stack>
          </CardContent>
        </Card>

        {/* Knowledge Check CTA */}
        {moduleData.quizId && (
          <Card>
            <CardContent className="pt-6">
              <Row gap="md" align="center" justify="between">
                <Stack gap="xs">
                  <Row gap="sm" align="center">
                    <ClipboardCheckIcon className="h-5 w-5 text-primary" />
                    <Text weight="medium">Knowledge Check</Text>
                  </Row>
                  <Text size="sm" variant="muted">
                    Test your understanding of this module with a short quiz.
                  </Text>
                </Stack>
                <Button nativeButton={false} render={<Link href={`/learn/quiz/${moduleData.quizId}`} />}>
                  Take Quiz
                </Button>
              </Row>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Row gap="md" align="center" justify="between" className="pt-4 border-t">
          {moduleData.prevModule ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}/${moduleData.prevModule.slug}`} />}
              className="gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <Stack gap="none" align="start">
                <Text size="xs" variant="muted">Previous</Text>
                <Text size="sm">{moduleData.prevModule.title}</Text>
              </Stack>
            </Button>
          ) : (
            <div />
          )}
          
          {moduleData.nextModule ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}/${moduleData.nextModule.slug}`} />}
              className="gap-2"
            >
              <Stack gap="none" align="end">
                <Text size="xs" variant="muted">Next</Text>
                <Text size="sm">{moduleData.nextModule.title}</Text>
              </Stack>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              nativeButton={false}
              render={<Link href={`/learn/${competencySlug}`} />}
            >
              Complete Competency
            </Button>
          )}
        </Row>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function formatMarkdown(content: string): string {
  // Simple markdown to HTML conversion
  // In production, use a proper markdown library like remark/rehype
  return content
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- (.*)/g, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
    .replace(/\n\| /g, '<tr><td>')
    .replace(/ \| /g, '</td><td>')
    .replace(/ \|$/gm, '</td></tr>')
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  const params: { competency: string; module: string }[] = []
  
  for (const [competency, modules] of Object.entries(moduleContent)) {
    for (const moduleSlug of Object.keys(modules)) {
      params.push({ competency, module: moduleSlug })
    }
  }
  
  return params
}
