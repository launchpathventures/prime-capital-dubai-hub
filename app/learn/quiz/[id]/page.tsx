/**
 * CATALYST - Quiz Page
 *
 * Knowledge check interface for learning modules.
 * Dynamic route: /learn/quiz/[id]
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Quiz Data (mock - would come from database)
// -----------------------------------------------------------------------------

const quizData: Record<string, {
  title: string
  moduleSlug: string
  competencySlug: string
  questions: Array<{
    id: string
    question: string
    options: Array<{ text: string; correct: boolean }>
    explanation: string
  }>
}> = {
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
        explanation: "Dubai remains competitively priced compared to global gateway cities like London, New York, and Singapore, which is one of its key attractions for international investors.",
      },
      {
        id: "q3",
        question: "What significant market event occurred between 2008-2010?",
        options: [
          { text: "First real estate boom", correct: false },
          { text: "Global financial crisis impact and market correction", correct: true },
          { text: "Introduction of freehold ownership", correct: false },
          { text: "Launch of Golden Visa program", correct: false },
        ],
        explanation: "The global financial crisis had a significant impact on Dubai's property market between 2008-2010, leading to a market correction before the recovery period began in 2011.",
      },
      {
        id: "q4",
        question: "Why is understanding Dubai's market context important for real estate consultants?",
        options: [
          { text: "To memorize statistics for client meetings", correct: false },
          { text: "To position Dubai credibly and address investor concerns with facts", correct: true },
          { text: "To compare prices with other markets", correct: false },
          { text: "To predict future market movements", correct: false },
        ],
        explanation: "Understanding market context enables consultants to position Dubai as a credible investment destination, address investor concerns with factual context, and demonstrate expertise that builds client trust.",
      },
      {
        id: "q5",
        question: "What has driven Dubai's remarkable real estate growth since 2021?",
        options: [
          { text: "Pandemic-driven transformation and market fundamentals", correct: true },
          { text: "Government subsidies for property purchases", correct: false },
          { text: "Removal of all foreign ownership restrictions", correct: false },
          { text: "Mandatory property investment requirements", correct: false },
        ],
        explanation: "The Dubai real estate market has demonstrated remarkable resilience and growth since 2021, driven by pandemic-driven transformation, strong market fundamentals, and continued economic diversification.",
      },
    ],
  },
  "market-intelligence-2": {
    title: "Regulatory Framework Quiz",
    moduleSlug: "regulatory-framework",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "What is the primary role of RERA in Dubai's real estate sector?",
        options: [
          { text: "Issuing title deeds", correct: false },
          { text: "Collecting registration fees", correct: false },
          { text: "Licensing professionals and regulating the market", correct: true },
          { text: "Providing mortgage financing", correct: false },
        ],
        explanation: "RERA (Real Estate Regulatory Agency) is responsible for licensing real estate professionals and companies, regulating property advertisements, managing escrow accounts, and handling disputes.",
      },
      {
        id: "q2",
        question: "What is the standard property registration fee collected by DLD?",
        options: [
          { text: "2% of property value", correct: false },
          { text: "4% of property value", correct: true },
          { text: "5% of property value", correct: false },
          { text: "10% of property value", correct: false },
        ],
        explanation: "The Dubai Land Department collects a registration fee of 4% of the property value for all property transactions.",
      },
      {
        id: "q3",
        question: "What is the purpose of escrow accounts for off-plan purchases?",
        options: [
          { text: "To hold the buyer's personal documents", correct: false },
          { text: "To provide tax benefits to developers", correct: false },
          { text: "To protect buyers by ensuring funds are used only for construction", correct: true },
          { text: "To speed up the transaction process", correct: false },
        ],
        explanation: "Escrow regulations require developers to open dedicated accounts where buyer payments can only be used for construction, protecting buyers from developer insolvency or fund misuse.",
      },
      {
        id: "q4",
        question: "Which document confirms that a developer has no outstanding payments from a property seller?",
        options: [
          { text: "MOU (Memorandum of Understanding)", correct: false },
          { text: "Title Deed", correct: false },
          { text: "NOC (No Objection Certificate)", correct: true },
          { text: "Oqood", correct: false },
        ],
        explanation: "The NOC (No Objection Certificate) is issued by the developer confirming there are no outstanding payments or issues before a property can be transferred to a new owner.",
      },
      {
        id: "q5",
        question: "What is an Oqood?",
        options: [
          { text: "A type of lease agreement", correct: false },
          { text: "A title deed for off-plan properties", correct: true },
          { text: "A mortgage document", correct: false },
          { text: "A developer registration certificate", correct: false },
        ],
        explanation: "Oqood is the title document issued for off-plan properties, while a Title Deed is issued for completed properties after full payment and handover.",
      },
    ],
  },
  "market-intelligence-3": {
    title: "Golden Visa & Residency Quiz",
    moduleSlug: "golden-visa",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "A client is considering a AED 1.9M apartment. What should you highlight before they proceed?",
        options: [
          { text: "The property is overpriced for the area", correct: false },
          { text: "They're AED 100K short of Golden Visa eligibility—consider going slightly higher", correct: true },
          { text: "They should wait for prices to drop", correct: false },
          { text: "The rental yield will be too low", correct: false },
        ],
        explanation: "At AED 1.9M, the client is just AED 100K short of the AED 2M Golden Visa threshold. A good consultant always flags this proximity so the client can make an informed decision about whether the visa benefits are worth the additional investment.",
      },
      {
        id: "q2",
        question: "A client asks: 'Can I get the Golden Visa if I buy with a mortgage?' What's the correct response?",
        options: [
          { text: "Yes, mortgages up to 50% LTV are allowed for visa purposes", correct: false },
          { text: "No, the property must be fully paid off—but you can buy with a mortgage and pay it down before applying", correct: true },
          { text: "Yes, but you need a UAE bank mortgage specifically", correct: false },
          { text: "No, and you can never apply once a mortgage has been on the property", correct: false },
        ],
        explanation: "The Golden Visa requires the property to be fully paid off (no mortgage). However, many investors purchase with a mortgage initially and pay it down or refinance before applying for the visa. This is a common strategy that should be explained clearly.",
      },
      {
        id: "q3",
        question: "Beyond residency, what is often the MOST practical benefit of the Golden Visa for international investors?",
        options: [
          { text: "Access to UAE healthcare", correct: false },
          { text: "UAE banking access for property management", correct: true },
          { text: "Ability to vote in UAE elections", correct: false },
          { text: "Free education for children", correct: false },
        ],
        explanation: "UAE bank accounts require residency. Without the Golden Visa, managing rental income, paying service charges, and handling property matters becomes complicated. The banking access is often more valuable than the residency itself for investors who don't plan to live in Dubai.",
      },
      {
        id: "q4",
        question: "How should you position the Golden Visa to a yield-focused UK investor comparing Dubai to London?",
        options: [
          { text: "Focus only on the residency benefits and lifestyle", correct: false },
          { text: "Explain that Dubai yields (6-7%) plus the visa is better value than UK investor visas (£2M+) with lower yields (3-4%)", correct: true },
          { text: "Tell them the Golden Visa isn't relevant if they want yield", correct: false },
          { text: "Recommend they buy in London instead for stability", correct: false },
        ],
        explanation: "For yield-focused investors, position the Golden Visa as a bonus on top of strong returns. In the UK, investor visas require £2M+ AND deliver only 3-4% yields. In Dubai, the same AED 2M (≈£430K) delivers 6-7% yield AND a 10-year visa. This comparison demonstrates clear value.",
      },
      {
        id: "q5",
        question: "A family client asks about sponsoring relatives. What can the Golden Visa holder sponsor?",
        options: [
          { text: "Spouse only", correct: false },
          { text: "Spouse and children under 18 only", correct: false },
          { text: "Spouse, children, and potentially parents", correct: true },
          { text: "Extended family including siblings", correct: false },
        ],
        explanation: "The Golden Visa allows holders to sponsor their spouse, children (regardless of age for sons with certain conditions, daughters until marriage), and in some cases parents. This makes it a complete family solution, which is a powerful selling point for family-oriented investors.",
      },
    ],
  },
  "client-discovery-5": {
    title: "Understanding Investment Goals Quiz",
    moduleSlug: "understanding-investment-goals",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "What is the minimum property investment required for a 10-year Golden Visa?",
        options: [
          { text: "AED 750,000", correct: false },
          { text: "AED 1,000,000", correct: false },
          { text: "AED 2,000,000", correct: true },
          { text: "AED 5,000,000", correct: false },
        ],
        explanation: "The Golden Visa program requires a property investment of AED 2 million or more for a 10-year residency visa.",
      },
      {
        id: "q2",
        question: "Which investor type typically prefers off-plan purchases in emerging areas?",
        options: [
          { text: "Yield-focused investors", correct: false },
          { text: "Capital growth investors", correct: true },
          { text: "Lifestyle investors", correct: false },
          { text: "Short-term traders", correct: false },
        ],
        explanation: "Capital growth investors typically prefer off-plan purchases in emerging areas, accepting lower initial yields in exchange for appreciation potential over a longer time horizon.",
      },
      {
        id: "q3",
        question: "What is the first category of discovery questions in the framework?",
        options: [
          { text: "Investment objectives", correct: false },
          { text: "Property preferences", correct: false },
          { text: "Financial position", correct: true },
          { text: "Timeline requirements", correct: false },
        ],
        explanation: "The discovery questions framework starts with understanding the client's financial position (budget, financing preference, capital deployment timeline) before moving to investment objectives.",
      },
      {
        id: "q4",
        question: "Which type of property would you recommend to a yield-focused investor?",
        options: [
          { text: "Off-plan in Dubai South", correct: false },
          { text: "Ready, tenanted property in established area", correct: true },
          { text: "Premium villa on Palm Jumeirah", correct: false },
          { text: "Any property over AED 2M", correct: false },
        ],
        explanation: "Yield-focused investors prefer completed, tenanted properties in established areas with proven rental demand, as they need regular income from their investment.",
      },
      {
        id: "q5",
        question: "What question helps uncover a client's true concerns about Dubai investment?",
        options: [
          { text: "What is your budget?", correct: false },
          { text: "What concerns, if any, do you have about Dubai real estate?", correct: true },
          { text: "When do you want to complete the purchase?", correct: false },
          { text: "How many properties do you own?", correct: false },
        ],
        explanation: "Asking about concerns directly helps uncover the investor's specific worries and objections, which can then be addressed with relevant information and reassurance.",
      },
    ],
  },
  "market-intelligence-4": {
    title: "Dubai vs Global Markets Quiz",
    moduleSlug: "global-comparison",
    competencySlug: "market-intelligence",
    questions: [
      {
        id: "q1",
        question: "A UK investor says: 'I'm comparing Dubai to London for my next property purchase.' What's the most compelling yield comparison to share?",
        options: [
          { text: "Dubai and London have similar yields around 3-4%", correct: false },
          { text: "Dubai offers 6-7% gross yields vs London's 3-4%", correct: true },
          { text: "Yields don't matter, focus on capital growth", correct: false },
          { text: "London yields are higher due to stronger currency", correct: false },
        ],
        explanation: "Dubai's average gross rental yields of 6-7% significantly outperform London's 3-4%. This is a key differentiator that should be quantified in every global comparison conversation.",
      },
      {
        id: "q2",
        question: "A Singapore-based investor asks about entry costs. How does Dubai compare?",
        options: [
          { text: "Dubai has higher stamp duty than Singapore", correct: false },
          { text: "Both markets have similar transaction costs around 4%", correct: false },
          { text: "Dubai's 4% DLD fee is lower than Singapore's 25-30% ABSD for foreigners", correct: true },
          { text: "Singapore has no foreign buyer restrictions unlike Dubai", correct: false },
        ],
        explanation: "Singapore imposes Additional Buyer Stamp Duty (ABSD) of 60% for foreign buyers, making Dubai's 4% DLD registration fee dramatically more accessible. This is a powerful comparison for Singapore-based investors.",
      },
      {
        id: "q3",
        question: "When positioning Dubai against New York, which factor is NOT a key advantage?",
        options: [
          { text: "No annual property taxes in Dubai", correct: false },
          { text: "Higher rental yields in Dubai", correct: false },
          { text: "More transparent pricing than New York", correct: true },
          { text: "No capital gains tax in Dubai", correct: false },
        ],
        explanation: "New York's property market is actually known for transparent pricing through public records. Dubai's advantages over NYC are tax-related (no property tax, no capital gains tax) and yield-focused, not transparency.",
      },
      {
        id: "q4",
        question: "A client considering Miami asks: 'What makes Dubai different?' What's the strongest positioning?",
        options: [
          { text: "Dubai has better beaches than Miami", correct: false },
          { text: "Dubai offers higher yields, no property tax, and residency through purchase", correct: true },
          { text: "Dubai is closer to Europe than Miami", correct: false },
          { text: "Dubai has more luxury developments", correct: false },
        ],
        explanation: "The strongest positioning combines: higher yields (6-7% vs 4-5%), zero annual property tax, and the Golden Visa pathway. These are tangible, quantifiable advantages that differentiate Dubai from Miami for serious investors.",
      },
      {
        id: "q5",
        question: "A client says: 'Dubai seems volatile compared to London.' How should you address this?",
        options: [
          { text: "Acknowledge it and suggest London instead", correct: false },
          { text: "Explain that Dubai's market has matured with RERA regulation since 2007 and show the post-2020 growth trajectory", correct: true },
          { text: "Tell them volatility doesn't matter for long-term investors", correct: false },
          { text: "Avoid the topic and focus on yields instead", correct: false },
        ],
        explanation: "Address the concern directly by explaining Dubai's regulatory maturity since RERA was established in 2007. Show data on the post-2020 market growth driven by fundamentals (population, economic diversification) rather than speculation.",
      },
    ],
  },
  "client-discovery-1": {
    title: "Discovery: Investors Quiz",
    moduleSlug: "discovery-investors",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "An investor says: 'I'm looking for something around 2 million.' What's your best next question?",
        options: [
          { text: "Great, let me show you some options in that range", correct: false },
          { text: "Is that 2 million AED or your home currency?", correct: true },
          { text: "Would you consider going higher for better returns?", correct: false },
          { text: "Are you paying cash or financing?", correct: false },
        ],
        explanation: "Currency clarification is critical with international investors. AED 2M is ~$545K USD, but a UK investor might mean £2M (~AED 9M). This single question prevents major misalignment and shows attention to detail.",
      },
      {
        id: "q2",
        question: "During discovery, an investor mentions they own three buy-to-let properties in Manchester. What does this signal?",
        options: [
          { text: "They need education about property investment basics", correct: false },
          { text: "They're experienced with yield-focused investing and understand landlord responsibilities", correct: true },
          { text: "They want to replicate exactly what they do in the UK", correct: false },
          { text: "They'll be easy to close quickly", correct: false },
        ],
        explanation: "This signals an experienced yield investor who understands rental yields, tenant management, and property maintenance. Adjust your approach: less education, more comparative analysis. They'll appreciate data-driven conversations.",
      },
      {
        id: "q3",
        question: "An investor from India says: 'I want something that my son can use when he studies in Dubai next year.' What investor persona is this?",
        options: [
          { text: "Pure capital growth investor", correct: false },
          { text: "Yield-focused investor", correct: false },
          { text: "Hybrid lifestyle/investment buyer", correct: true },
          { text: "Short-term speculator", correct: false },
        ],
        explanation: "This is a hybrid lifestyle/investment buyer with immediate use case (son's accommodation) plus long-term investment goals. Property selection should prioritize areas near universities AND investment fundamentals.",
      },
      {
        id: "q4",
        question: "You ask about timeline and the investor says: 'No rush, maybe within a year.' What should you probe further?",
        options: [
          { text: "Nothing, they've answered the question clearly", correct: false },
          { text: "Whether there's a specific trigger event (visa renewal, liquidity event, family move)", correct: true },
          { text: "Why they're waiting so long to invest", correct: false },
          { text: "Whether they're serious or just browsing", correct: false },
        ],
        explanation: "Vague timelines often hide specific triggers. A 'year' might mean: after a business sale completes, when their child finishes school, or when a visa expires. Understanding the trigger helps you time follow-ups appropriately.",
      },
      {
        id: "q5",
        question: "An investor's spouse joins the call unexpectedly. How should you adapt?",
        options: [
          { text: "Continue as planned, they can catch up", correct: false },
          { text: "Brief the spouse, discover their priorities separately, then align both parties", correct: true },
          { text: "Focus on the original contact and follow up with the spouse later", correct: false },
          { text: "Ask the spouse to listen quietly while you finish the presentation", correct: false },
        ],
        explanation: "Spouse involvement changes the dynamic. Briefly summarize what you've covered, ask about the spouse's specific priorities (they may differ), and ensure both decision-makers feel heard. This often accelerates rather than delays decisions.",
      },
    ],
  },
  "client-discovery-2": {
    title: "BANT+ Qualification Quiz",
    moduleSlug: "qualification-framework",
    competencySlug: "client-discovery",
    questions: [
      {
        id: "q1",
        question: "In BANT+ qualification, what does the '+' represent beyond Budget, Authority, Need, and Timeline?",
        options: [
          { text: "Property preferences only", correct: false },
          { text: "Fit (whether Dubai and your service match their situation)", correct: true },
          { text: "Follow-up frequency", correct: false },
          { text: "Financial advisor approval", correct: false },
        ],
        explanation: "The '+' represents Fit—whether Dubai as a market and Prime Capital as an advisor truly match the client's situation. Not every inquiry should become a client; recognizing poor fit early saves time for everyone.",
      },
      {
        id: "q2",
        question: "A lead has a AED 5M budget and wants to buy this month, but their spouse handles all financial decisions and hasn't been involved. What's your assessment?",
        options: [
          { text: "Strong lead—high budget and urgent timeline", correct: false },
          { text: "Qualified but Authority is missing—include the spouse before progressing", correct: true },
          { text: "Disqualify—too complicated with two decision makers", correct: false },
          { text: "Progress anyway—the spouse will agree once they see the property", correct: false },
        ],
        explanation: "Budget and Timeline are strong, but Authority is compromised. Progressing without the decision-maker involved creates risk of deals falling through at the last moment. Insist on spouse involvement before moving forward.",
      },
      {
        id: "q3",
        question: "A prospect says: 'I'm just researching for now, maybe in 2-3 years.' How do you classify this lead?",
        options: [
          { text: "Hot lead—they're thinking long-term", correct: false },
          { text: "Qualified lead—add to pipeline", correct: false },
          { text: "Nurture lead—periodic contact but not active pipeline", correct: true },
          { text: "Dead lead—2-3 years is too far out", correct: false },
        ],
        explanation: "This is a nurture lead, not an active pipeline candidate. Add to your CRM with quarterly touchpoints (market updates, new launches), but don't waste active selling time. Their timeline may accelerate based on circumstances.",
      },
      {
        id: "q4",
        question: "During qualification, you discover the prospect's 'budget' is actually money they plan to liquidate from stocks over 6 months. What does this affect?",
        options: [
          { text: "Nothing—they have the money", correct: false },
          { text: "Timeline and potentially Budget (market conditions may change their liquid amount)", correct: true },
          { text: "Only their financing options", correct: false },
          { text: "Only their property choices", correct: false },
        ],
        explanation: "This affects both Timeline (6 months to liquidate) and potentially Budget (stock values fluctuate). Off-plan with payment plans might suit better than ready property requiring immediate full payment.",
      },
      {
        id: "q5",
        question: "A qualified lead with strong BANT scores wants to invest in commercial property for higher yields. What's the Fit assessment?",
        options: [
          { text: "Strong fit—high yields are always good", correct: false },
          { text: "Poor fit—if Prime Capital focuses on residential, refer out or be transparent about limitations", correct: true },
          { text: "Accept anyway—a sale is a sale", correct: false },
          { text: "Try to convince them residential is better", correct: false },
        ],
        explanation: "Fit matters. If your expertise is residential and the client wants commercial, either refer to a trusted commercial specialist or be transparent about your limitations. Trying to serve clients outside your expertise damages relationships.",
      },
    ],
  },
  "sales-mastery-1": {
    title: "First Contact Excellence Quiz",
    moduleSlug: "first-contact",
    competencySlug: "sales-mastery",
    questions: [
      {
        id: "q1",
        question: "A portal lead inquires about a specific property. What's the optimal first response?",
        options: [
          { text: "Send all available information about the property immediately", correct: false },
          { text: "Acknowledge quickly, confirm you have the property, and ask one discovery question", correct: true },
          { text: "Schedule a viewing first, then discuss details later", correct: false },
          { text: "Ask for their budget before providing any information", correct: false },
        ],
        explanation: "Speed matters for portal leads—respond within 5 minutes if possible. Acknowledge their inquiry, confirm availability, then pivot to discovery with one question. This shows responsiveness while starting to qualify.",
      },
      {
        id: "q2",
        question: "An inquiry comes in at 11 PM your time. When should you respond?",
        options: [
          { text: "Immediately, no matter the hour", correct: false },
          { text: "Within 10 minutes with a brief acknowledgment, then full response during business hours", correct: true },
          { text: "First thing next morning during business hours", correct: false },
          { text: "Only respond if they're in a timezone where it's daytime", correct: false },
        ],
        explanation: "Send a brief acknowledgment immediately (automated if needed) confirming receipt and promising a full response. Dubai's international clientele expects responsiveness, but detailed conversations should happen when you're at your best.",
      },
      {
        id: "q3",
        question: "During first contact, a lead asks: 'What's the best area to invest in?' What's the best response?",
        options: [
          { text: "Downtown Dubai—it's the most popular", correct: false },
          { text: "That depends on your goals—are you focused on yield, capital growth, or lifestyle?", correct: true },
          { text: "I'll send you a list of all the good areas", correct: false },
          { text: "Dubai Marina—best yields in the city", correct: false },
        ],
        explanation: "Avoid giving generic recommendations. Use the question to start discovery. Their investment goals (yield, growth, lifestyle) determine the answer. This positions you as an advisor, not just an information source.",
      },
      {
        id: "q4",
        question: "A first-contact lead says: 'I've been working with another agent but I'm not happy.' How should you proceed?",
        options: [
          { text: "Ask what went wrong and promise to be better", correct: false },
          { text: "Acknowledge their frustration, understand their timeline, and clarify if they're under any exclusive agreements", correct: true },
          { text: "Criticize the other agent to build rapport", correct: false },
          { text: "Suggest they give the other agent another chance", correct: false },
        ],
        explanation: "Don't badmouth competitors. Acknowledge their experience, understand urgency, and importantly—check for exclusive agreements that might complicate your involvement. Then differentiate through your discovery process.",
      },
      {
        id: "q5",
        question: "A lead's first message is: 'Price for Palm Jumeirah villa?' What do they really want?",
        options: [
          { text: "Just the price—give it to them quickly", correct: false },
          { text: "To assess market levels and whether they can afford the area—provide range and ask about their search", correct: true },
          { text: "To compare your prices with other agents", correct: false },
          { text: "Nothing—they're probably not serious", correct: false },
        ],
        explanation: "This buyer is likely assessing whether Palm Jumeirah fits their budget. Provide a price range, explain variation factors (sea view, plot size, condition), then ask about their search to begin discovery.",
      },
    ],
  },
  "sales-mastery-2": {
    title: "EOI & Booking Conversion Quiz",
    moduleSlug: "eoi-booking",
    competencySlug: "sales-mastery",
    questions: [
      {
        id: "q1",
        question: "Your client is ready to book an off-plan unit but hesitates, saying: 'Let me think about it overnight.' What's the most effective response?",
        options: [
          { text: "Sure, I'll hold the unit for you until tomorrow", correct: false },
          { text: "Acknowledge the request, remind them of unit scarcity, and ask what specific concern is holding them back", correct: true },
          { text: "Apply pressure by saying the unit will definitely sell tonight", correct: false },
          { text: "Agree and call them tomorrow", correct: false },
        ],
        explanation: "'Let me think about it' often masks a specific unresolved concern. Acknowledge respectfully, remind them gently of limited availability, then probe for the real objection. Address the concern if possible; if truly timing, respect it.",
      },
      {
        id: "q2",
        question: "During an off-plan launch, your client qualifies for priority access. What should you do BEFORE the launch day?",
        options: [
          { text: "Just show up on launch day with the client", correct: false },
          { text: "Pre-select 3-4 units matching their criteria and have EOI paperwork ready", correct: true },
          { text: "Let the client browse all options on launch day", correct: false },
          { text: "Focus on getting there early for best selection", correct: false },
        ],
        explanation: "Preparation wins at launches. Pre-select suitable units, have EOI forms ready with client details filled in, confirm budget and payment plan preferences. On launch day, you're executing a plan, not discovering needs.",
      },
      {
        id: "q3",
        question: "A client wants to proceed with EOI but asks: 'Is the EOI refundable if I change my mind?' What's the correct answer?",
        options: [
          { text: "Yes, always fully refundable", correct: false },
          { text: "It depends on the developer's policy—typically refundable within cooling-off period, less admin fees", correct: true },
          { text: "No, EOIs are never refundable", correct: false },
          { text: "Don't discuss this—it might discourage them", correct: false },
        ],
        explanation: "Always be transparent about EOI terms. Most developers offer a cooling-off period (typically 24-48 hours) with refund minus admin fees. Beyond that, policies vary. Check specific developer terms and explain them clearly.",
      },
      {
        id: "q4",
        question: "Your client has paid EOI and wants to switch to a different unit in the same project. What determines if this is possible?",
        options: [
          { text: "It's never possible after EOI", correct: false },
          { text: "Developer policy and unit availability—some allow switches, others don't", correct: true },
          { text: "It's always possible as long as the new unit is higher value", correct: false },
          { text: "Only possible before SPA signing", correct: false },
        ],
        explanation: "Unit switch policies vary by developer. Some allow pre-SPA switches with admin fees, others are strict. Check the specific developer's policy before promising anything. This should be clarified during initial EOI discussion.",
      },
      {
        id: "q5",
        question: "Post-EOI, your client receives the SPA and has questions about payment schedules. They mention the developer's salesperson gave different information. What should you do?",
        options: [
          { text: "Tell the client to follow what the developer said", correct: false },
          { text: "Review the SPA together, clarify discrepancies directly with developer sales, and document everything in writing", correct: true },
          { text: "Suggest the client hire a lawyer to sort it out", correct: false },
          { text: "Assume the developer is correct and move forward", correct: false },
        ],
        explanation: "You're the client's advocate. Review the SPA, identify discrepancies, then clarify with the developer's sales team in writing. Document confirmed terms via email. This protects the client and your reputation.",
      },
    ],
  },
  "sales-mastery-3": {
    title: "Closing Techniques Quiz",
    moduleSlug: "closing-techniques",
    competencySlug: "sales-mastery",
    questions: [
      {
        id: "q1",
        question: "After presenting three property options, your client says: 'They're all good. I need to think.' What closing approach is most appropriate?",
        options: [
          { text: "Give them time—they need to process", correct: false },
          { text: "Use the choice close: 'Based on our discussion, which feels closest to what you're looking for?'", correct: true },
          { text: "Apply pressure: 'All three might sell soon'", correct: false },
          { text: "Present more options to help them decide", correct: false },
        ],
        explanation: "Too many good options causes paralysis. Use the choice close to narrow focus. This isn't pressure—it's helping them articulate their preference. Their answer reveals priorities you can use to recommend the best fit.",
      },
      {
        id: "q2",
        question: "A client has viewed properties twice and engaged seriously, but keeps postponing the decision. What's the best approach?",
        options: [
          { text: "Keep following up until they decide", correct: false },
          { text: "Ask directly: 'Help me understand what's holding you back from moving forward'", correct: true },
          { text: "Offer a discount to accelerate the decision", correct: false },
          { text: "Assume they're not serious and focus on other leads", correct: false },
        ],
        explanation: "Repeated delays signal an unaddressed concern or changed circumstances. Ask directly but respectfully. The answer either reveals a solvable objection or confirms they're not ready—both are valuable information.",
      },
      {
        id: "q3",
        question: "Your client says: 'I love this unit, but I want to wait for the market to drop.' What's the most effective response?",
        options: [
          { text: "Agree that waiting might make sense", correct: false },
          { text: "Show them data on Dubai market trajectory and explain the cost of waiting (missed rental income, potential price increases)", correct: true },
          { text: "Tell them the market won't drop", correct: false },
          { text: "Suggest they buy now and sell if prices drop", correct: false },
        ],
        explanation: "This is a common timing objection. Don't dismiss it. Use data to show market direction, but more importantly, calculate the cost of waiting: 6 months of lost rental income at 6% yield is 3% of property value. Make the math tangible.",
      },
      {
        id: "q4",
        question: "During final negotiation, the developer won't reduce price but offers upgraded furnishing worth AED 50K. How should you position this to your client?",
        options: [
          { text: "Tell them to reject it and push for price reduction", correct: false },
          { text: "Present it as equivalent value, explaining they'd spend this anyway on furnishing", correct: true },
          { text: "Accept immediately without consulting the client", correct: false },
          { text: "Say it's a bad deal because it's not cash", correct: false },
        ],
        explanation: "Furnishing packages have real value—the client would spend this money anyway. Present it as equivalent to a AED 50K price reduction since it's money they won't need to spend post-handover. Let them decide.",
      },
      {
        id: "q5",
        question: "A client says yes to purchase but mentions their financial advisor suggested waiting. How do you handle this?",
        options: [
          { text: "Dismiss the financial advisor's opinion", correct: false },
          { text: "Offer to have a three-way call with the advisor to address any concerns with data", correct: true },
          { text: "Tell the client to choose between you and their advisor", correct: false },
          { text: "Agree to wait and follow up in a month", correct: false },
        ],
        explanation: "Financial advisors are gatekeepers for many high-net-worth clients. Offer to engage directly—this shows confidence and collaboration. Many advisors lack Dubai market knowledge; providing data can convert them into allies.",
      },
    ],
  },
  "property-matching-1": {
    title: "Yield & ROI Calculations Quiz",
    moduleSlug: "yield-calculations",
    competencySlug: "property-matching",
    questions: [
      {
        id: "q1",
        question: "A property costs AED 1,500,000 and rents for AED 100,000 per year. What's the gross rental yield?",
        options: [
          { text: "5.5%", correct: false },
          { text: "6.67%", correct: true },
          { text: "7.5%", correct: false },
          { text: "8.0%", correct: false },
        ],
        explanation: "Gross yield = Annual Rent / Purchase Price × 100. So 100,000 / 1,500,000 × 100 = 6.67%. This is the most common yield figure discussed with investors.",
      },
      {
        id: "q2",
        question: "A client asks about net yield. Which costs should be deducted from gross rental income to calculate it?",
        options: [
          { text: "Only service charges", correct: false },
          { text: "Service charges, maintenance, and management fees (if applicable)", correct: true },
          { text: "Mortgage payments", correct: false },
          { text: "The 4% DLD registration fee", correct: false },
        ],
        explanation: "Net yield deducts ongoing costs: service charges, maintenance reserves, property management fees (typically 5-8% of rent). Mortgage payments and one-time costs like DLD aren't included in yield calculations.",
      },
      {
        id: "q3",
        question: "A AED 2M property has AED 140K annual rent and AED 25K in annual costs. What's the net yield?",
        options: [
          { text: "7.0%", correct: false },
          { text: "6.0%", correct: false },
          { text: "5.75%", correct: true },
          { text: "5.0%", correct: false },
        ],
        explanation: "Net yield = (Annual Rent - Costs) / Price × 100. So (140,000 - 25,000) / 2,000,000 × 100 = 115,000 / 2,000,000 × 100 = 5.75%.",
      },
      {
        id: "q4",
        question: "Your client compares two properties: Property A yields 7% gross in JVC, Property B yields 5% gross on Palm Jumeirah. What should you highlight?",
        options: [
          { text: "Always recommend the higher yield property", correct: false },
          { text: "Different areas serve different purposes—JVC for yield, Palm for capital growth and lifestyle; match to their goals", correct: true },
          { text: "Palm is always better because it's premium", correct: false },
          { text: "JVC is too risky despite higher yield", correct: false },
        ],
        explanation: "Yield isn't everything. JVC delivers higher cash returns; Palm offers lower yield but stronger capital appreciation potential and lifestyle value. The right choice depends on the client's priorities established during discovery.",
      },
      {
        id: "q5",
        question: "A client wants to calculate total return. What should be included beyond rental yield?",
        options: [
          { text: "Only capital appreciation", correct: false },
          { text: "Capital appreciation, rental yield, and tax advantages (for their jurisdiction)", correct: true },
          { text: "Nothing—yield is the total return", correct: false },
          { text: "Only the Golden Visa value", correct: false },
        ],
        explanation: "Total return = Rental yield + Capital appreciation + Tax efficiency. Dubai's zero property tax and zero capital gains tax can significantly impact net returns compared to taxed markets. Always present the complete picture.",
      },
    ],
  },
  "property-matching-2": {
    title: "Payment Plan Analysis Quiz",
    moduleSlug: "payment-plan-analysis",
    competencySlug: "property-matching",
    questions: [
      {
        id: "q1",
        question: "An off-plan project offers: 20% on booking, 40% during construction, 40% on handover. What type of payment plan is this?",
        options: [
          { text: "Post-handover payment plan", correct: false },
          { text: "Standard construction-linked payment plan", correct: true },
          { text: "Balloon payment plan", correct: false },
          { text: "Aggressive front-loaded plan", correct: false },
        ],
        explanation: "This is a standard construction-linked plan where payments are tied to build milestones. The 60/40 split (60% by handover, 40% at handover) is common and balances developer cash flow with buyer protection.",
      },
      {
        id: "q2",
        question: "Your client has limited immediate liquidity but strong income. Which payment plan structure suits them best?",
        options: [
          { text: "High upfront payment for better unit selection", correct: false },
          { text: "Post-handover payment plan (e.g., 60% by handover, 40% over 2-3 years post-handover)", correct: true },
          { text: "Pay full amount upfront for maximum discount", correct: false },
          { text: "Standard construction-linked plan", correct: false },
        ],
        explanation: "Post-handover plans reduce immediate cash requirements and allow rental income to contribute to remaining payments. This suits buyers with income but limited capital—common among end-users upgrading their home.",
      },
      {
        id: "q3",
        question: "Two similar units are priced AED 2M with standard plan and AED 2.1M with 5-year post-handover plan. How should you present this?",
        options: [
          { text: "Always recommend the cheaper option", correct: false },
          { text: "Calculate the financing cost implicit in the post-handover plan and compare to mortgage rates", correct: true },
          { text: "Post-handover is always better for cash flow", correct: false },
          { text: "Recommend based on which unit has a better view", correct: false },
        ],
        explanation: "The AED 100K premium is effectively financing cost. Calculate: 100K / 2M = 5% extra, spread over 5 years. Compare to mortgage rates (currently ~4-5%) and the client's opportunity cost of capital. Make the math transparent.",
      },
      {
        id: "q4",
        question: "A client asks: 'What happens if I can't make a payment during construction?' What's the accurate answer?",
        options: [
          { text: "The developer will cancel immediately and keep all payments", correct: false },
          { text: "It depends on the SPA terms—typically there's a grace period, then penalties, then potential termination", correct: true },
          { text: "Nothing happens until handover", correct: false },
          { text: "You can always defer payments without penalty", correct: false },
        ],
        explanation: "SPA terms govern this. Typically: grace period (30-60 days), late payment penalties (varies), and eventual termination rights after extended default. Advise clients to review SPA terms carefully and maintain payment buffers.",
      },
      {
        id: "q5",
        question: "A developer offers a 2% discount for upfront full payment vs. their standard payment plan. When is this NOT a good deal?",
        options: [
          { text: "When the client has the cash available", correct: false },
          { text: "When the client can earn more than 2% annual return on that capital elsewhere", correct: true },
          { text: "When the property is in a prime area", correct: false },
          { text: "It's always a good deal to get discounts", correct: false },
        ],
        explanation: "If the standard plan spans 2+ years and the client can earn >2% annually (easily achievable in money markets), keeping capital invested and using the payment plan is financially smarter. The 2% discount may not compensate for opportunity cost.",
      },
    ],
  },
  "transaction-1": {
    title: "Off-Plan Transaction Journey Quiz",
    moduleSlug: "offplan-journey",
    competencySlug: "transaction-management",
    questions: [
      {
        id: "q1",
        question: "What is the correct sequence for an off-plan purchase?",
        options: [
          { text: "SPA → EOI → Oqood → Handover", correct: false },
          { text: "EOI → SPA → Oqood Registration → Construction → Handover → Title Deed", correct: true },
          { text: "Title Deed → SPA → EOI → Handover", correct: false },
          { text: "Oqood → EOI → Construction → Title Deed", correct: false },
        ],
        explanation: "The correct sequence is: EOI (Expression of Interest) to reserve the unit, SPA (Sale & Purchase Agreement) formalizing the purchase, Oqood registration with DLD, construction period, handover, then Title Deed issuance.",
      },
      {
        id: "q2",
        question: "A client signs the SPA. When is the property registered with DLD?",
        options: [
          { text: "Immediately upon SPA signing", correct: false },
          { text: "After Oqood registration, typically within 30 days of SPA", correct: true },
          { text: "Only after full payment", correct: false },
          { text: "At handover", correct: false },
        ],
        explanation: "Oqood (off-plan registration) happens within approximately 30 days of SPA execution. This registers the buyer's interest with DLD, providing legal protection even before property completion and title deed issuance.",
      },
      {
        id: "q3",
        question: "Your client asks: 'Who holds my payments during construction?' What's the correct answer?",
        options: [
          { text: "The developer's general account", correct: false },
          { text: "A RERA-regulated escrow account that can only be used for construction", correct: true },
          { text: "Your brokerage's trust account", correct: false },
          { text: "The client's own account until handover", correct: false },
        ],
        explanation: "All off-plan payments go to RERA-regulated escrow accounts. These funds can only be released to developers upon achieving construction milestones, protecting buyers from fund misuse.",
      },
      {
        id: "q4",
        question: "Construction completes and your client receives handover notice. What should they do before accepting the keys?",
        options: [
          { text: "Accept keys immediately to start earning rent", correct: false },
          { text: "Conduct a snagging inspection and ensure punch-list items are documented", correct: true },
          { text: "Wait for the title deed before visiting", correct: false },
          { text: "Pay remaining balance first, inspect later", correct: false },
        ],
        explanation: "Before accepting handover, conduct a thorough snagging inspection. Document any defects, unfinished work, or variations from specifications. These must be remedied by the developer before or shortly after handover acceptance.",
      },
      {
        id: "q5",
        question: "Your client wants to sell their off-plan unit before completion. What must happen first?",
        options: [
          { text: "Wait until construction is 100% complete", correct: false },
          { text: "Obtain NOC from the developer (requirements vary—often minimum % paid)", correct: true },
          { text: "Transfer is not possible until title deed is issued", correct: false },
          { text: "Simply find a buyer and transfer the SPA", correct: false },
        ],
        explanation: "To sell off-plan, obtain developer NOC first. Most developers require a minimum percentage paid (commonly 30-40%) before allowing transfers. Oqood transfer fees (typically 4%) apply. This is called 'flipping' and is regulated.",
      },
    ],
  },
  "transaction-2": {
    title: "RERA Contracts Quiz",
    moduleSlug: "rera-contracts",
    competencySlug: "transaction-management",
    questions: [
      {
        id: "q1",
        question: "What is the role of RERA in regulating off-plan contracts?",
        options: [
          { text: "RERA only handles tenant disputes", correct: false },
          { text: "RERA approves project registrations, SPA templates, and oversees escrow compliance", correct: true },
          { text: "RERA sets property prices", correct: false },
          { text: "RERA provides mortgages to buyers", correct: false },
        ],
        explanation: "RERA (Real Estate Regulatory Agency) approves off-plan project registrations, standardizes SPA templates for consumer protection, monitors escrow account compliance, and handles disputes between parties.",
      },
      {
        id: "q2",
        question: "A client asks: 'Is the SPA negotiable or is it standard?' What's the accurate answer?",
        options: [
          { text: "Every clause is fully negotiable", correct: false },
          { text: "Core terms follow RERA templates; some commercial terms may be negotiable depending on the developer", correct: true },
          { text: "SPAs are completely standardized with no variation", correct: false },
          { text: "Only the price is negotiable, nothing else", correct: false },
        ],
        explanation: "RERA provides standard SPA templates ensuring baseline consumer protection. However, developers may have approved variations, and some commercial terms (payment plans, included items) may be negotiable, especially for bulk buyers.",
      },
      {
        id: "q3",
        question: "Your client finds a clause in the SPA they don't understand. What should you advise?",
        options: [
          { text: "Sign anyway—the clauses are standard", correct: false },
          { text: "Recommend they have a legal professional review before signing", correct: true },
          { text: "Explain it yourself based on your experience", correct: false },
          { text: "Ask the developer's sales team to explain it", correct: false },
        ],
        explanation: "Always recommend legal review for SPA signing. While you can provide general guidance, legal interpretation should come from qualified legal professionals. This protects the client and your liability.",
      },
      {
        id: "q4",
        question: "What happens if a developer fails to deliver by the date specified in the SPA?",
        options: [
          { text: "Nothing—delays are normal and expected", correct: false },
          { text: "The SPA typically specifies developer obligations for delays, which may include compensation or termination rights", correct: true },
          { text: "Buyers can immediately get full refund with penalties", correct: false },
          { text: "The buyer must wait indefinitely", correct: false },
        ],
        explanation: "SPAs include provisions for developer delays, typically specifying grace periods and buyer remedies. Exact terms vary, but RERA guidelines protect buyers from excessive delays. Review these clauses carefully before signing.",
      },
      {
        id: "q5",
        question: "A client wants to make modifications to their off-plan unit during construction. Is this possible?",
        options: [
          { text: "Never—units are built exactly as per plans", correct: false },
          { text: "It depends on the developer's policy and how far construction has progressed", correct: true },
          { text: "Always possible with any modification", correct: false },
          { text: "Only after handover", correct: false },
        ],
        explanation: "Some developers offer customization windows during early construction phases. This varies significantly by developer and project. Inquire about policies upfront if the client may want modifications.",
      },
    ],
  },
  "transaction-3": {
    title: "MOU & Form F Quiz",
    moduleSlug: "mou-formf",
    competencySlug: "transaction-management",
    questions: [
      {
        id: "q1",
        question: "In a secondary market transaction, what is the purpose of the MOU (Form F)?",
        options: [
          { text: "It transfers ownership immediately", correct: false },
          { text: "It's a legally binding agreement outlining transaction terms before the transfer", correct: true },
          { text: "It's an optional document for record-keeping", correct: false },
          { text: "It replaces the need for DLD registration", correct: false },
        ],
        explanation: "The MOU (Memorandum of Understanding, using DLD's Form F template) is the binding agreement between buyer and seller outlining price, payment terms, and conditions before proceeding to NOC and title transfer.",
      },
      {
        id: "q2",
        question: "What is typically included in the buyer's deposit when signing Form F?",
        options: [
          { text: "The full purchase price", correct: false },
          { text: "10% of the purchase price, held by the brokerage", correct: true },
          { text: "Nothing—deposits are paid later", correct: false },
          { text: "4% DLD fee only", correct: false },
        ],
        explanation: "Standard practice is a 10% deposit from the buyer, held in the brokerage's trust account. This demonstrates commitment and provides security for both parties while NOC and transfer are processed.",
      },
      {
        id: "q3",
        question: "After MOU signing, what must happen before the property can be transferred at DLD?",
        options: [
          { text: "Nothing—proceed directly to DLD", correct: false },
          { text: "Obtain NOC from the developer/existing management company", correct: true },
          { text: "Wait 30 days mandatory cooling-off period", correct: false },
          { text: "Get RERA approval", correct: false },
        ],
        explanation: "Before DLD transfer, the seller must obtain a No Objection Certificate (NOC) from the developer (or property management company for older buildings) confirming no outstanding dues.",
      },
      {
        id: "q4",
        question: "A seller has an outstanding mortgage on the property. How is this handled in the transaction?",
        options: [
          { text: "Buyer pays the mortgage directly", correct: false },
          { text: "The transaction is blocked until mortgage is cleared by seller independently", correct: false },
          { text: "The MOU should address this—typically buyer's funds clear the mortgage, with protections in place", correct: true },
          { text: "Mortgages automatically transfer to the buyer", correct: false },
        ],
        explanation: "Mortgaged properties can be sold. The MOU specifies how the mortgage will be cleared—often through buyer funds routed via the bank. A liability letter is obtained, and structured transfer protects all parties.",
      },
      {
        id: "q5",
        question: "Who typically pays the DLD transfer fee (4%) in a secondary market transaction?",
        options: [
          { text: "Always the buyer", correct: false },
          { text: "Always the seller", correct: false },
          { text: "Negotiable between parties—commonly split 50/50 or paid by buyer", correct: true },
          { text: "Paid by the brokerage", correct: false },
        ],
        explanation: "DLD fee allocation is negotiable and should be specified in the MOU. Market practice varies: sometimes buyer pays full 4%, sometimes it's split. In a buyer's market, sellers may offer to cover part or all.",
      },
    ],
  },
  "objection-navigation-1": {
    title: "Objection Handling Framework Quiz",
    moduleSlug: "objection-framework",
    competencySlug: "objection-navigation",
    questions: [
      {
        id: "q1",
        question: "A client says: 'I've heard Dubai property is overpriced.' What type of objection is this?",
        options: [
          { text: "Need objection—they don't need property", correct: false },
          { text: "Understanding objection—they have misconceptions about market value", correct: true },
          { text: "Trust objection—they don't trust you", correct: false },
          { text: "Shortcoming objection—there's a real limitation", correct: false },
        ],
        explanation: "This is an Understanding objection based on perception rather than fact. The correct response is to provide data: show Dubai's price per square meter vs London, New York, Singapore. Numbers address misconceptions.",
      },
      {
        id: "q2",
        question: "What should you ALWAYS do before addressing any objection?",
        options: [
          { text: "Immediately correct the misconception with facts", correct: false },
          { text: "Acknowledge the concern and validate that it's a reasonable question", correct: true },
          { text: "Ask them where they heard that information", correct: false },
          { text: "Change the subject to something positive", correct: false },
        ],
        explanation: "The Acknowledge-Before-Address rule: validate first, respond second. 'That's a fair concern, and many investors ask about this...' reduces defensiveness and creates space for your response to be heard.",
      },
      {
        id: "q3",
        question: "A client says: 'How do I know you won't disappear after I pay?' What type of objection is this?",
        options: [
          { text: "Need objection", correct: false },
          { text: "Understanding objection", correct: false },
          { text: "Trust objection—they don't yet trust you or the process", correct: true },
          { text: "Tactical objection", correct: false },
        ],
        explanation: "This is a Trust objection about your reliability. Address it with evidence: RERA licensing, escrow protection, client references, company track record. Trust is built through proof, not promises.",
      },
      {
        id: "q4",
        question: "A client's budget is AED 1M but they want a 3-bed in Downtown Dubai, which starts at AED 3M. How do you classify this?",
        options: [
          { text: "Understanding objection—they don't understand prices", correct: false },
          { text: "Shortcoming objection—there's a genuine mismatch you can't overcome", correct: true },
          { text: "Trust objection", correct: false },
          { text: "Need objection", correct: false },
        ],
        explanation: "This is a Shortcoming objection—a genuine limitation. Be honest: 'Downtown 3-beds start at 3M. With your budget, let me show you areas where you CAN get 3 beds, or 2-beds in Downtown.' Don't promise the impossible.",
      },
      {
        id: "q5",
        question: "A client says: 'Another agent is offering 1% lower commission.' How should you handle this?",
        options: [
          { text: "Match or beat the commission immediately", correct: false },
          { text: "Recognize this as a Tactical objection—hold your value and focus on differentiated service", correct: true },
          { text: "Question whether the other agent is legitimate", correct: false },
          { text: "End the conversation if they won't pay full commission", correct: false },
        ],
        explanation: "This is a Tactical objection—negotiation, not a real deal-breaker. Competing on price commoditizes your service. Instead, articulate your value: experience, market access, service quality. Let them decide if the 1% is worth losing that.",
      },
    ],
  },
  "objection-navigation-2": {
    title: "Market & Timing Objections Quiz",
    moduleSlug: "market-objections",
    competencySlug: "objection-navigation",
    questions: [
      {
        id: "q1",
        question: "A client says: 'I'll wait for prices to come down.' What's the most effective response approach?",
        options: [
          { text: "Tell them prices won't come down", correct: false },
          { text: "Acknowledge the concern, show market data, and calculate the cost of waiting (missed rental income)", correct: true },
          { text: "Agree and tell them to call you when they're ready", correct: false },
          { text: "Offer a discount to make them buy now", correct: false },
        ],
        explanation: "Don't dismiss the concern. Show market trajectory data, then quantify cost of waiting: 'If you wait 12 months for a possible 5% drop, you've lost 7% in rental income. Net, you're worse off even if prices do drop.'",
      },
      {
        id: "q2",
        question: "A client references a negative article about Dubai real estate. How should you respond?",
        options: [
          { text: "Dismiss the article as fake news", correct: false },
          { text: "Acknowledge they've done research, ask what specifically concerns them, then address with data", correct: true },
          { text: "Avoid the topic and focus on properties", correct: false },
          { text: "Send them positive articles instead", correct: false },
        ],
        explanation: "Don't dismiss their research. Acknowledge it, isolate the specific concern, then address it with data. This shows you engage with all information, not just positive news—which builds trust.",
      },
      {
        id: "q3",
        question: "A client says: 'The 2008 crash proved Dubai is risky.' How do you handle this historical objection?",
        options: [
          { text: "Argue that 2008 won't happen again", correct: false },
          { text: "Acknowledge 2008, explain regulatory changes since then (RERA, escrow), and show post-2020 market maturity", correct: true },
          { text: "Tell them 2008 was a long time ago and doesn't matter", correct: false },
          { text: "Suggest they invest somewhere safer", correct: false },
        ],
        explanation: "2008 was real. Acknowledge it, then explain what changed: RERA established 2007, escrow enforcement strengthened, mortgage caps introduced, developer requirements tightened. The market that crashed in 2008 no longer exists.",
      },
      {
        id: "q4",
        question: "A client says: 'I want to wait until after Expo/World Cup/major event.' What underlying concern does this reveal?",
        options: [
          { text: "They're not interested in buying", correct: false },
          { text: "They believe major events artificially inflate prices which will correct afterward", correct: true },
          { text: "They're too busy to buy right now", correct: false },
          { text: "They want to visit Dubai during the event", correct: false },
        ],
        explanation: "This reveals a concern about event-driven price bubbles. Address it with data: show what happened after Expo 2020—prices continued rising because growth was driven by fundamentals (population, economic diversification), not the event itself.",
      },
      {
        id: "q5",
        question: "When facing market timing objections, what's the most persuasive supporting evidence?",
        options: [
          { text: "Your personal opinion as an expert", correct: false },
          { text: "Third-party data: DLD transaction records, bank reports, independent research", correct: true },
          { text: "Developer marketing materials", correct: false },
          { text: "Other clients who made successful purchases", correct: false },
        ],
        explanation: "Third-party, verifiable data is most persuasive: DLD official statistics, Knight Frank/JLL reports, bank research. Your opinion matters less than evidence. Let the data do the convincing.",
      },
    ],
  },
  "objection-navigation-3": {
    title: "Failure Scenarios & Resilience Quiz",
    moduleSlug: "failure-resilience",
    competencySlug: "objection-navigation",
    questions: [
      {
        id: "q1",
        question: "A deal falls through at the last minute after weeks of work. What's the most professional response?",
        options: [
          { text: "Express frustration to the client about wasted time", correct: false },
          { text: "Remain professional, understand the reason, and maintain the relationship for future opportunities", correct: true },
          { text: "Immediately move on and never contact them again", correct: false },
          { text: "Offer a significant discount to save the deal", correct: false },
        ],
        explanation: "Deals fail for many reasons, often outside anyone's control. Stay professional, understand what happened, and maintain the relationship. Many 'failed' deals return months later when circumstances change.",
      },
      {
        id: "q2",
        question: "You discover a client has been speaking to multiple agents about the same property. How should you handle this?",
        options: [
          { text: "Confront them about disloyalty", correct: false },
          { text: "Accept this as normal buyer behavior, differentiate through service quality", correct: true },
          { text: "Drop them as a client immediately", correct: false },
          { text: "Match whatever terms other agents are offering", correct: false },
        ],
        explanation: "Buyers exploring options is normal, not personal. Focus on what you control: service quality, market knowledge, responsiveness. The best agent wins, not the most offended one.",
      },
      {
        id: "q3",
        question: "A client you've worked with for months buys through another agent. What's the most productive response?",
        options: [
          { text: "Feel resentful and delete their contact", correct: false },
          { text: "Reflect on what you could have done differently, congratulate them, and stay connected for future business", correct: true },
          { text: "Ask them to explain why they didn't buy from you", correct: false },
          { text: "Warn other agents about this client", correct: false },
        ],
        explanation: "Use losses as learning. What could you have improved? Then, genuinely congratulate them—this graciousness is remembered. Many clients who bought elsewhere return for their second purchase.",
      },
      {
        id: "q4",
        question: "You've had a month with zero closings despite consistent effort. What's the healthiest mindset?",
        options: [
          { text: "Something is fundamentally wrong with your approach", correct: false },
          { text: "Sales has natural variance—review your pipeline quality but don't change everything based on one month", correct: true },
          { text: "The market must be bad right now", correct: false },
          { text: "You should consider a different career", correct: false },
        ],
        explanation: "Sales has inherent variance. One bad month isn't a trend. Review pipeline quality (are you qualifying effectively?), but don't overhaul your approach based on short-term variance. Consistency compounds over time.",
      },
      {
        id: "q5",
        question: "A client writes a negative review online after a transaction didn't meet their expectations. What's the best response?",
        options: [
          { text: "Ignore it—engaging makes it worse", correct: false },
          { text: "Respond professionally, acknowledge their experience, offer to discuss offline, and demonstrate commitment to resolution", correct: true },
          { text: "Defend yourself by explaining what really happened", correct: false },
          { text: "Ask happy clients to write positive reviews to bury it", correct: false },
        ],
        explanation: "Public responses to negative reviews show how you handle adversity. Acknowledge professionally, offer offline resolution, don't argue publicly. Future clients reading this see your character under pressure.",
      },
    ],
  },
  "relationship-1": {
    title: "Referral Generation Quiz",
    moduleSlug: "referral-generation",
    competencySlug: "relationship-stewardship",
    questions: [
      {
        id: "q1",
        question: "When is the best time to ask a satisfied client for referrals?",
        options: [
          { text: "Immediately after signing the MOU", correct: false },
          { text: "After successful handover or within 30 days of their positive experience", correct: true },
          { text: "Wait at least 6 months after the transaction", correct: false },
          { text: "Never ask—referrals should be spontaneous", correct: false },
        ],
        explanation: "Peak satisfaction occurs at key moments: successful handover, first rental income, positive transaction completion. This is when clients are most likely to enthusiastically refer. Don't wait until they forget the experience.",
      },
      {
        id: "q2",
        question: "A client says: 'I'll definitely recommend you if anyone asks.' How should you respond?",
        options: [
          { text: "Thank them and wait for referrals to come", correct: false },
          { text: "Thank them and make it easy: 'Who in your network might be thinking about Dubai property?'", correct: true },
          { text: "Send them a formal referral agreement to sign", correct: false },
          { text: "Offer them a referral bonus for each lead", correct: false },
        ],
        explanation: "Passive promises rarely convert to referrals. Make it concrete: ask about specific people in their network. This prompts them to think of actual names, increasing the likelihood of introductions.",
      },
      {
        id: "q3",
        question: "You receive a referral introduction. What should happen within the first 24 hours?",
        options: [
          { text: "Wait a few days so you don't seem desperate", correct: false },
          { text: "Contact the referral AND thank the referrer for the introduction", correct: true },
          { text: "Focus only on the new lead", correct: false },
          { text: "Research the referral thoroughly before making contact", correct: false },
        ],
        explanation: "Speed matters with referrals—they often indicate immediate interest. Contact promptly AND update the referrer. This closes the loop and encourages future referrals. The referrer feels their recommendation was valued.",
      },
      {
        id: "q4",
        question: "A past client refers someone who turns out to be unqualified. How should you handle this?",
        options: [
          { text: "Tell the referrer their contact wasn't a good lead", correct: false },
          { text: "Treat the referral professionally, thank the referrer regardless of outcome", correct: true },
          { text: "Ignore the referral since they're not qualified", correct: false },
          { text: "Ask the referrer to pre-qualify leads before sending them", correct: false },
        ],
        explanation: "Treat every referral with professionalism regardless of qualification. Thank the referrer warmly. Complaining about lead quality discourages future referrals. Unqualified today may be qualified next year.",
      },
      {
        id: "q5",
        question: "What's the most sustainable way to build a referral-based business?",
        options: [
          { text: "Offer high referral bonuses for every introduction", correct: false },
          { text: "Deliver exceptional service that clients naturally want to talk about", correct: true },
          { text: "Constantly remind past clients that you accept referrals", correct: false },
          { text: "Focus only on high-net-worth clients who know other wealthy people", correct: false },
        ],
        explanation: "Referrals follow service quality. Exceptional experiences create advocates. Bonuses and reminders help, but they can't compensate for mediocre service. Focus on making every client feel remarkably well-served.",
      },
    ],
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  const quiz = quizData[quizId]

  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [isAnswered, setIsAnswered] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)

  if (!quiz) {
    return (
      <Container size="md" className="py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Stack gap="md" align="center">
              <XCircleIcon className="h-12 w-12 text-muted-foreground" />
              <Title size="h3">Quiz Not Found</Title>
              <Text variant="muted">
                The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
              </Text>
              <Button nativeButton={false} render={<Link href="/learn" />}>
                Back to Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const passThreshold = config.learning.quizPassThreshold
  const passed = score / quiz.questions.length >= passThreshold

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    setIsAnswered(true)
    if (question.options[selectedAnswer].correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setIsComplete(false)
  }

  // Completion Screen
  if (isComplete) {
    return (
      <Container size="md" className="py-8">
        <Stack gap="xl">
          <Card>
            <CardContent className="py-12">
              <Stack gap="lg" align="center">
                {passed ? (
                  <CheckCircleIcon className="h-16 w-16 text-success" />
                ) : (
                  <XCircleIcon className="h-16 w-16 text-destructive" />
                )}
                <Stack gap="sm" align="center">
                  <Title size="h2">
                    {passed ? "Congratulations!" : "Keep Learning"}
                  </Title>
                  <Text variant="muted" align="center">
                    {passed
                      ? "You've successfully completed this knowledge check."
                      : `You need ${Math.round(passThreshold * 100)}% to pass. Review the module and try again.`}
                  </Text>
                </Stack>

                <Card className="w-full max-w-xs">
                  <CardContent className="pt-6">
                    <Stack gap="sm" align="center">
                      <Title size="h1">
                        {score}/{quiz.questions.length}
                      </Title>
                      <Text variant="muted">
                        {Math.round((score / quiz.questions.length) * 100)}% correct
                      </Text>
                      <Badge variant={passed ? "default" : "destructive"}>
                        {passed ? "Passed" : "Not Passed"}
                      </Badge>
                    </Stack>
                  </CardContent>
                </Card>

                <Row gap="md">
                  {!passed && (
                    <Button variant="outline" onClick={handleRetry}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Retry Quiz
                    </Button>
                  )}
                  <Button
                    nativeButton={false}
                    render={<Link href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`} />}
                  >
                    {passed ? "Continue Learning" : "Review Module"}
                  </Button>
                </Row>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    )
  }

  // Quiz Screen
  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`} />}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Module
            </Button>
          </Row>
          <Row gap="sm" align="center" justify="between">
            <Stack gap="xs">
              <Badge variant="outline">
                <ClipboardCheckIcon className="h-3 w-3 mr-1" />
                Knowledge Check
              </Badge>
              <Title size="h3">{quiz.title}</Title>
            </Stack>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </Row>
          <Progress value={progress} className="h-2" />
        </Stack>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = option.correct
                const showCorrect = isAnswered && isCorrect
                const showIncorrect = isAnswered && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswered}
                    className={cn(
                      "quiz-option w-full text-left p-4 rounded-lg border-2 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      isSelected && !isAnswered && "border-primary bg-primary/5",
                      !isSelected && !isAnswered && "border-border hover:border-primary/50",
                      showCorrect && "border-success bg-success/10",
                      showIncorrect && "border-destructive bg-destructive/10",
                      isAnswered && !isSelected && !isCorrect && "opacity-50"
                    )}
                    data-selected={isSelected}
                    data-correct={showCorrect}
                    data-incorrect={showIncorrect}
                  >
                    <Row gap="sm" align="center">
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-medium",
                          isSelected && !isAnswered && "border-primary text-primary",
                          !isSelected && !isAnswered && "border-muted-foreground text-muted-foreground",
                          showCorrect && "border-success text-success",
                          showIncorrect && "border-destructive text-destructive"
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Text className="flex-1">{option.text}</Text>
                      {showCorrect && <CheckCircleIcon className="h-5 w-5 text-success" />}
                      {showIncorrect && <XCircleIcon className="h-5 w-5 text-destructive" />}
                    </Row>
                  </button>
                )
              })}
            </Stack>

            {/* Explanation */}
            {isAnswered && (
              <Card className="mt-4 border-primary/20 bg-primary/5">
                <CardContent className="pt-4">
                  <Stack gap="xs">
                    <Text size="sm" weight="medium">Explanation</Text>
                    <Text size="sm" variant="muted">
                      {question.explanation}
                    </Text>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Row gap="md" justify="end">
          {!isAnswered ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </Row>
      </Stack>
    </Container>
  )
}
