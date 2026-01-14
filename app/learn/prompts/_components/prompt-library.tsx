/**
 * CATALYST - Prompt Library Component
 *
 * Displays categorized prompts with copy functionality.
 */

"use client"

import * as React from "react"
import { useState } from "react"
import { 
  SearchIcon,
  MapPinIcon,
  BuildingIcon,
  MailIcon,
  MessageSquareIcon,
  CalendarIcon,
  TrendingUpIcon,
  ShieldIcon,
  BookOpenIcon,
  FileTextIcon,
} from "lucide-react"
import { PromptCard } from "./prompt-card"

// =============================================================================
// Prompt Data
// =============================================================================

interface Prompt {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
}

const PROMPT_CATEGORIES = [
  { id: "all", label: "All Prompts", icon: BookOpenIcon },
  { id: "research", label: "Market Research", icon: SearchIcon },
  { id: "areas", label: "Area Knowledge", icon: MapPinIcon },
  { id: "developers", label: "Developers", icon: BuildingIcon },
  { id: "emails", label: "Email Drafts", icon: MailIcon },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquareIcon },
  { id: "meetings", label: "Meeting Prep", icon: CalendarIcon },
  { id: "market", label: "Market Updates", icon: TrendingUpIcon },
  { id: "compliance", label: "Compliance", icon: ShieldIcon },
  { id: "content", label: "Content", icon: FileTextIcon },
]

const PROMPTS: Prompt[] = [
  // Market Research
  {
    id: "market-deep-dive",
    title: "Market Segment Analysis",
    description: "Deep dive into a specific market segment",
    prompt: `Provide a detailed analysis of the [SEGMENT: e.g., "luxury villa", "affordable apartment", "branded residences"] market in Dubai.

Cover:
1. **Market Size** — Approximate inventory, new supply coming
2. **Price Trends** — How prices have moved over the past 2-3 years
3. **Key Locations** — Where this segment is concentrated
4. **Buyer Profile** — Who buys in this segment (nationality, purpose)
5. **Major Players** — Which developers dominate this segment
6. **Demand Drivers** — What's driving interest in this segment
7. **Supply Pipeline** — What's coming in the next 1-2 years
8. **Investment Outlook** — Expected yields, capital appreciation potential
9. **Risks & Considerations** — What could impact this segment

Provide specific examples where possible. Note any claims I should verify with official data.`,
    category: "research",
    tags: ["market", "analysis", "segments"],
  },
  {
    id: "buyer-nationality",
    title: "Buyer Nationality Insights",
    description: "Understand buying patterns by nationality",
    prompt: `Give me insights on [NATIONALITY: e.g., "Indian", "British", "Russian", "Chinese"] buyers in the Dubai real estate market.

Include:
1. **Market Share** — What percentage of transactions do they represent
2. **Preferred Locations** — Which areas are most popular with this group
3. **Property Preferences** — Types, sizes, price points they favor
4. **Buying Motivations** — Investment, lifestyle, Golden Visa, second home
5. **Payment Preferences** — Cash vs mortgage, payment plan preferences
6. **Cultural Considerations** — Any specific requirements or preferences
7. **Peak Seasons** — When are they most active in the market
8. **Recent Trends** — Any changes in their buying behavior

This helps me prepare for client meetings with buyers from this background.`,
    category: "research",
    tags: ["market", "demographics", "client prep"],
  },
  {
    id: "price-analysis",
    title: "Price Point Analysis",
    description: "Understand what's available at a specific budget",
    prompt: `What can a buyer get in Dubai for a budget of [BUDGET: e.g., "AED 1-1.5 million"]?

Provide:
1. **Property Types** — What's realistically available (apartment sizes, locations)
2. **Top Areas** — Best areas to look at this price point
3. **Off-Plan vs Ready** — What each offers at this budget
4. **Lifestyle Considerations** — What quality of life can they expect
5. **Investment Potential** — Expected yields, growth potential
6. **Compromises** — What they might need to sacrifice at this price
7. **Alternatives** — Nearby areas or property types to consider
8. **Timing Advice** — Is this a good time to buy at this price point

Focus on practical, honest advice rather than sales messaging.`,
    category: "research",
    tags: ["pricing", "budget", "client prep"],
  },
  {
    id: "infrastructure-impact",
    title: "Infrastructure Impact Analysis",
    description: "Assess how new infrastructure affects property values",
    prompt: `Analyze the impact of [INFRASTRUCTURE PROJECT: e.g., "Dubai Metro Blue Line", "Etihad Rail", "new highway connection"] on Dubai real estate.

Cover:
1. **Project Overview** — What it is, timeline, current status
2. **Areas Affected** — Which communities will benefit most
3. **Expected Impact** — How it typically affects property values
4. **Historical Precedent** — Similar projects and their actual impact
5. **Investment Timing** — When is the best time to buy relative to completion
6. **Price Premium** — How much more are affected areas worth
7. **Risks** — Delays, changes, or other considerations
8. **Specific Opportunities** — Properties or areas to watch

Help me advise clients on whether to factor this into their decisions.`,
    category: "research",
    tags: ["infrastructure", "investment", "market"],
  },
  {
    id: "rental-market",
    title: "Rental Market Analysis",
    description: "Understand rental dynamics for investor clients",
    prompt: `Provide a rental market analysis for [AREA OR PROPERTY TYPE: e.g., "1-bedroom apartments in Business Bay" or "villas in Arabian Ranches"].

Include:
1. **Current Rental Rates** — Range of monthly rents
2. **Yield Calculation** — Typical gross and net yields
3. **Tenant Profile** — Who rents here (demographics, typical lease terms)
4. **Vacancy Rates** — How quickly units get occupied
5. **Seasonal Patterns** — Best and worst times to find tenants
6. **Market Trend** — Are rents rising, stable, or falling
7. **Competition** — How much rental stock is available
8. **Landlord Considerations** — Service charges, maintenance costs, regulations

This is for advising investor clients on rental income expectations.`,
    category: "research",
    tags: ["rental", "investment", "yields"],
  },
  {
    id: "offplan-landscape",
    title: "Off-Plan Market Overview",
    description: "Current state of the off-plan market",
    prompt: `Give me an overview of the current off-plan market in Dubai.

Cover:
1. **Market Activity** — How active is the off-plan market right now
2. **Popular Projects** — Which launches are getting attention
3. **Developer Activity** — Who is launching, who is quiet
4. **Price Trends** — How off-plan prices compare to ready properties
5. **Payment Plans** — What payment structures are common
6. **Buyer Incentives** — What developers are offering
7. **Areas of Focus** — Where is most off-plan development happening
8. **Risks & Opportunities** — What to watch out for, what looks promising
9. **Regulatory Environment** — Any relevant RERA requirements

This helps me stay current for off-plan client conversations.`,
    category: "research",
    tags: ["off-plan", "market", "developers"],
  },
  {
    id: "area-overview",
    title: "Area Overview",
    description: "Get a comprehensive overview of any Dubai community",
    prompt: `Give me a comprehensive overview of [AREA NAME] as a residential area in Dubai. Include:

1. **Developer & History** — Who developed it, when it launched, the original vision
2. **Location & Connectivity** — Where it is, major roads, metro access, distance to key landmarks
3. **Property Types** — What's available (apartments, villas, townhouses), typical sizes
4. **Price Ranges** — Current approximate prices for 1BR, 2BR, 3BR apartments (if applicable)
5. **Demographics** — Who typically lives there (families, young professionals, investors)
6. **Key Amenities** — Schools, hospitals, malls, parks, dining options
7. **Pros & Cons** — Honest assessment for both end-users and investors
8. **Investment Potential** — Rental yields, capital appreciation trends, future outlook
9. **Upcoming Developments** — Any new projects or infrastructure coming

Be specific and factual. I'll verify key claims before sharing with clients.`,
    category: "areas",
    tags: ["research", "areas", "client prep"],
  },
  {
    id: "area-comparison",
    title: "Area Comparison",
    description: "Compare two or more Dubai communities for client recommendations",
    prompt: `Compare [AREA 1] and [AREA 2] for a client who is [DESCRIBE CLIENT: e.g., "a family with two children looking for a 3-bedroom apartment"].

For each area, provide:
1. **Price Comparison** — Similar unit types and sizes
2. **Community Features** — What each offers
3. **Proximity** — To schools, work hubs, amenities
4. **Lifestyle Fit** — Which suits their needs better
5. **Investment View** — Rental potential, resale value
6. **Practical Considerations** — Traffic, construction, community maturity

End with a clear recommendation based on their profile.`,
    category: "areas",
    tags: ["comparison", "client", "recommendations"],
  },
  {
    id: "developer-profile",
    title: "Developer Profile",
    description: "Research a developer's track record and reputation",
    prompt: `Give me a detailed profile of [DEVELOPER NAME] as a Dubai real estate developer.

Include:
1. **Company Overview** — Founded when, ownership, headquarters
2. **Track Record** — Major completed projects in Dubai (list 5-10 notable ones)
3. **Reputation** — Known for quality? On-time delivery? Any controversies?
4. **Current Projects** — What are they building now?
5. **Target Market** — Luxury, mid-market, affordable?
6. **Unique Selling Points** — What differentiates them from competitors?
7. **Financial Stability** — Any public information on their financial health
8. **Handover Experience** — Feedback from previous buyers

Be balanced and factual. Note any areas where I should verify with official sources.`,
    category: "developers",
    tags: ["developers", "due diligence", "research"],
  },
  {
    id: "developer-comparison",
    title: "Developer Comparison",
    description: "Compare developers for client decision-making",
    prompt: `Compare these developers for a client choosing between their projects: [DEVELOPER 1] vs [DEVELOPER 2]

Cover:
1. **Track Record** — Years in market, completed projects
2. **Quality Reputation** — Build quality, finishing standards
3. **Delivery Reliability** — On-time handover history
4. **Service Charges** — Typical rates for their properties
5. **After-Sales Service** — Reputation for post-handover support
6. **Payment Plans** — Typical structures they offer
7. **Resale Value** — How their properties hold value

Which would you recommend for [INVESTOR TYPE: e.g., "a first-time off-plan buyer prioritising safety over returns"]?`,
    category: "developers",
    tags: ["developers", "comparison"],
  },
  
  // Email Drafts
  {
    id: "email-inquiry-response",
    title: "Initial Inquiry Response",
    description: "Respond to a new lead's property inquiry",
    prompt: `Write a professional email response to a potential client who inquired about [PROPERTY TYPE] in [AREA] with a budget of [BUDGET].

Requirements:
- Warm but professional tone (not salesy)
- Thank them for reaching out
- Show brief knowledge of the area/property type
- Ask 2-3 qualifying questions about their goals
- Offer a specific next step (call or meeting)
- Keep under 150 words
- Match Prime Capital's brand voice: confident, restrained, grounded

Do not use phrases like "exciting opportunity" or "limited availability."`,
    category: "emails",
    tags: ["email", "leads", "first contact"],
  },
  {
    id: "email-followup",
    title: "Follow-Up After Viewing",
    description: "Follow up after a property viewing",
    prompt: `Write a follow-up email after a property viewing.

Context:
- Client name: [NAME]
- Properties viewed: [LIST PROPERTIES]
- Client feedback during viewing: [NOTES]
- Most interested in: [PREFERRED PROPERTY]

The email should:
- Reference specific details from the viewing
- Address any concerns they raised
- Provide any additional information they requested
- Suggest clear next steps
- Be warm but not pushy
- Keep under 200 words`,
    category: "emails",
    tags: ["email", "follow-up", "viewings"],
  },
  {
    id: "email-meeting-summary",
    title: "Meeting Summary Email",
    description: "Summarise a client meeting with action items",
    prompt: `Turn these meeting notes into a professional follow-up email:

[PASTE YOUR MEETING NOTES HERE]

The email should:
- Thank them for their time
- Summarise key discussion points
- List agreed action items with owners
- Confirm any next steps or deadlines
- Offer to clarify anything
- Professional but warm tone
- Use bullet points for clarity`,
    category: "emails",
    tags: ["email", "meetings", "summary"],
  },
  
  // WhatsApp
  {
    id: "whatsapp-viewing-confirm",
    title: "Viewing Confirmation",
    description: "Confirm a property viewing via WhatsApp",
    prompt: `Write a brief WhatsApp message to confirm a property viewing.

Details:
- Client name: [NAME]
- Property: [PROPERTY DESCRIPTION]
- Date: [DATE]
- Time: [TIME]
- Location: [ADDRESS]

Keep it under 40 words, friendly but professional. Include any essential instructions (parking, where to meet).`,
    category: "whatsapp",
    tags: ["whatsapp", "viewings", "confirmation"],
  },
  {
    id: "whatsapp-gentle-followup",
    title: "Gentle Follow-Up",
    description: "Follow up without being pushy",
    prompt: `Write a gentle WhatsApp follow-up for a client who viewed properties [X] days ago but hasn't responded.

Context:
- Properties they viewed: [PROPERTIES]
- They seemed interested in: [SPECIFIC PROPERTY]
- Last conversation: [BRIEF SUMMARY]

The message should:
- Be warm and non-pressuring
- Reference something specific from the viewing
- Offer to help or answer questions
- Not ask directly "have you decided?"
- Under 50 words`,
    category: "whatsapp",
    tags: ["whatsapp", "follow-up"],
  },
  {
    id: "whatsapp-price-update",
    title: "Price Update",
    description: "Share a price change with an interested client",
    prompt: `Write a WhatsApp message to inform a client about a price update on a property they were interested in.

Details:
- Property: [PROPERTY]
- Previous price: [OLD PRICE]
- New price: [NEW PRICE]
- Reason (if known): [REASON]

The message should:
- Sound like genuine good news, not a sales tactic
- Reference their previous interest
- Provide the key facts clearly
- Suggest a next step if appropriate
- Under 60 words`,
    category: "whatsapp",
    tags: ["whatsapp", "pricing", "updates"],
  },
  
  // Meeting Prep
  {
    id: "meeting-prep-investor",
    title: "Investor Meeting Prep",
    description: "Prepare for a meeting with an investor client",
    prompt: `Help me prepare for a meeting with an investor client.

Client profile:
- Name: [NAME]
- Background: [NATIONALITY, PROFESSION]
- Investment budget: [BUDGET]
- Goals: [RENTAL INCOME / CAPITAL APPRECIATION / GOLDEN VISA]
- Properties of interest: [AREAS OR TYPES]

Provide:
1. **5 Key Questions** to ask and understand their needs
2. **3 Potential Concerns** they might have and how to address them
3. **Market Insights** relevant to their budget and goals
4. **Property Suggestions** (types/areas, not specific units)
5. **Agenda Suggestion** for a 45-minute meeting`,
    category: "meetings",
    tags: ["meetings", "investors", "preparation"],
  },
  {
    id: "meeting-prep-enduser",
    title: "End-User Meeting Prep",
    description: "Prepare for a meeting with a family/end-user buyer",
    prompt: `Help me prepare for a meeting with an end-user buyer.

Client profile:
- Family situation: [E.G., COUPLE WITH 2 CHILDREN]
- Relocating from: [COUNTRY/CITY]
- Budget: [BUDGET]
- Must-haves: [SCHOOLS, COMMUTE, LIFESTYLE]
- Timeline: [WHEN DO THEY NEED TO MOVE]

Provide:
1. **5 Discovery Questions** to understand their lifestyle needs
2. **Area Recommendations** that might fit their profile
3. **Common Concerns** for families relocating to Dubai
4. **Practical Information** they'll likely need (schools, healthcare, etc.)
5. **Suggested Meeting Flow** for a 60-minute discovery session`,
    category: "meetings",
    tags: ["meetings", "end-users", "families"],
  },
  
  // Market Updates
  {
    id: "market-daily-brief",
    title: "Daily Market Brief",
    description: "Get a quick summary of Dubai real estate news",
    prompt: `What are the 3 most significant Dubai real estate developments or news items from the past 24-48 hours?

For each item, provide:
1. **Headline** — What happened
2. **Details** — Key facts
3. **Relevance** — Why it matters for property consultants
4. **Client Talking Point** — How to mention it in conversation

Focus on:
- New project launches
- Price or market trends
- Regulatory changes
- Major transactions
- Infrastructure updates

Be specific with dates, numbers, and sources where possible.`,
    category: "market",
    tags: ["market", "news", "daily"],
  },
  {
    id: "market-trend-summary",
    title: "Market Trend Summary",
    description: "Get an overview of current market conditions",
    prompt: `Give me a summary of current Dubai real estate market conditions.

Cover:
1. **Overall Market Direction** — Is it up, down, stabilising?
2. **Price Trends** — Which segments are rising/falling?
3. **Hot Areas** — Where is demand strongest?
4. **Buyer Demographics** — Who is buying right now?
5. **Rental Market** — Yields and demand
6. **Off-Plan vs Ready** — Which is more active?
7. **Key Factors** — What's driving the market?
8. **Outlook** — What do analysts expect?

Note: I'll verify specific numbers with official sources before sharing.`,
    category: "market",
    tags: ["market", "trends", "analysis"],
  },
  
  // Compliance & Regulations
  {
    id: "regulation-explainer",
    title: "Regulation Explainer",
    description: "Explain a specific regulation in simple terms",
    prompt: `Explain [REGULATION/TOPIC] in simple terms for a client.

Topics could include:
- Off-plan escrow requirements
- Golden Visa property route
- DLD registration fees
- Service charge regulations
- Ejari requirements
- RERA broker requirements

Provide:
1. **Simple Explanation** — What it is in plain language
2. **Why It Exists** — The purpose/protection it provides
3. **What It Means for Them** — Practical implications
4. **Key Requirements** — What they need to do/provide
5. **Common Questions** — FAQs clients typically have

Keep language accessible — avoid jargon.`,
    category: "compliance",
    tags: ["compliance", "regulations", "client education"],
  },
  {
    id: "visa-golden-overview",
    title: "Golden Visa Overview",
    description: "Explain Golden Visa property requirements",
    prompt: `Give me a clear, current overview of the UAE Golden Visa through property investment.

Include:
1. **Eligibility Criteria** — Property value requirements
2. **Property Types** — What qualifies, what doesn't
3. **Process Steps** — How to apply
4. **Timeline** — How long it takes
5. **Benefits** — What the visa provides
6. **Family Coverage** — Who can be included
7. **Common Mistakes** — What to avoid
8. **Recent Changes** — Any updates to the rules

Flag anything I should verify with official sources before advising clients.`,
    category: "compliance",
    tags: ["visa", "golden visa", "regulations"],
  },
  
  // Content Creation
  {
    id: "property-description",
    title: "Property Description",
    description: "Create a compelling property description",
    prompt: `Write a compelling property description for:

Property details:
- Type: [APARTMENT / VILLA / TOWNHOUSE]
- Bedrooms: [X]
- Bathrooms: [X]
- Size: [X sq ft]
- Location: [BUILDING, AREA]
- Floor: [X]
- View: [DESCRIBE]
- Features: [LIST KEY FEATURES]
- Price: [PRICE]

Requirements:
- Match Prime Capital brand voice: confident, restrained, grounded
- Highlight key selling points naturally
- Avoid superlatives like "stunning" or "unparalleled"
- Be factual and specific
- Under 150 words
- Include a brief, non-pushy call to action`,
    category: "content",
    tags: ["content", "listings", "marketing"],
  },
  {
    id: "social-caption",
    title: "Social Media Caption",
    description: "Create captions for property posts",
    prompt: `Write 3 Instagram caption options for a property post.

Property:
- Type: [PROPERTY TYPE]
- Location: [AREA]
- Key feature: [MAIN SELLING POINT]
- Target audience: [INVESTORS / FAMILIES / LUXURY BUYERS]

Requirements:
- Professional tone, not salesy
- Match Prime Capital brand voice
- Each caption under 150 characters (not including hashtags)
- Suggest 5 relevant hashtags for each
- Include subtle call to action

Avoid: Excessive emojis, "DM for details!", urgency language`,
    category: "content",
    tags: ["content", "social media", "marketing"],
  },
]

// =============================================================================
// Component
// =============================================================================

export function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPrompts = PROMPTS.filter(prompt => {
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const categoryCount = (category: string) => {
    if (category === "all") return PROMPTS.length
    return PROMPTS.filter(p => p.category === category).length
  }

  return (
    <div className="prompt-library">
      {/* Search */}
      <div className="prompt-library__search">
        <SearchIcon className="prompt-library__search-icon" />
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="prompt-library__search-input"
        />
      </div>

      {/* Categories */}
      <div className="prompt-library__categories">
        {PROMPT_CATEGORIES.map((category) => {
          const Icon = category.icon
          const count = categoryCount(category.id)
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="prompt-library__category"
              data-active={selectedCategory === category.id}
            >
              <Icon className="prompt-library__category-icon" />
              <span>{category.label}</span>
              <span className="prompt-library__category-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Prompt Grid */}
      <div className="prompt-library__grid">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="prompt-library__empty">
          <p>No prompts found matching your search.</p>
        </div>
      )}
    </div>
  )
}
