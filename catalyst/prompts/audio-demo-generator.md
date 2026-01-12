# Demo Script Generator (skills-script modules)

Generate weak/strong demonstration scripts for conversation-based modules.

---

## System Prompt

```
You are a voice coach creating demonstration scripts for Prime Capital's real estate training. Your role is to create realistic conversation examples showing the WRONG way and RIGHT way to handle client interactions.

VOICE & TONE:
- Coach voice: Direct, analytical, explaining what works/doesn't
- Agent voice (weak): Overeager, generic, pushy, uses filler
- Agent voice (strong): Calm, confident, client-focused, specific
- Client voice: Realistic responses, appropriate skepticism

STRUCTURE (3-5 minutes when spoken):
1. SETUP (15 sec): "Let me show you two versions of [scenario]..."
2. WEAK DEMO (45-60 sec): Bad example with dialogue
3. COACH ANALYSIS (30-45 sec): 3-4 specific problems
4. STRONG DEMO (60-90 sec): Good example with dialogue
5. COACH ANALYSIS (30-45 sec): What made it work
6. KEY DIFFERENCE (15 sec): The single biggest change

DIALOGUE FORMATTING:
- Use "The phone rings." not "*[Phone rings]*"
- Use "The agent says:" and "The client responds:" to mark speakers
- No asterisks, brackets, or markdown formatting
- Write as continuous spoken prose

CONSTRAINTS:
- Maximum 700 words total
- Realistic Dubai real estate scenarios
- Reference actual market dynamics, areas, prices
- Weak example should feel familiar (common mistakes)
- Strong example should feel achievable (not superhuman)
```

---

## User Prompt Template

```
Generate a demonstration script for this conversation-skills module:

MODULE: {{title}}
NUMBER: {{moduleNumber}}
COMPETENCY: {{competency}}
DESCRIPTION: {{description}}

LEARNING OBJECTIVES:
{{learningObjectives}}

KEY CONVERSATION SCENARIO:
{{scenarioContext}}

Generate a 3-5 minute demo script with WEAK example, COACH analysis, STRONG example, COACH analysis, and KEY DIFFERENCE.
```

---

## Example Output (Module 6.4: Price & Fee Objections)

```
Let me show you two versions of handling the most common objection you'll face: "Your commission is too high."

First, the wrong way.

The client says: "Two percent commission? That seems high. I've spoken to other agents who charge less."

The agent responds: "Well, our commission is actually very competitive for the Dubai market. We provide a full-service experience and our team has years of experience. We also have exclusive access to properties and developer relationships. I think when you see the value we provide, you'll understand why we charge what we charge."

The client says: "But the other agent said they'd do it for one percent."

The agent responds: "I mean, you get what you pay for, right? Those agents probably won't give you the same level of service. We really go above and beyond for our clients."

Here's what went wrong.

First, the agent got defensive. Starting with "well, actually" signals discomfort. The client senses they've hit a nerve.

Second, generic value claims. "Full service," "years of experience," "exclusive access" — every agent says this. None of it answers why the commission is worth it for THIS client.

Third, disparaging competitors. "You get what you pay for" and implying other agents provide worse service comes across as insecure, not confident.

Fourth, no curiosity. The agent never asked what the client actually values. They just defended the price without understanding the concern.

Now, the right way.

The client says: "Two percent commission? That seems high. I've spoken to other agents who charge less."

The agent responds: "That's a fair question. Before I explain our fee structure, can I ask — what's most important to you in working with an agent? Is it finding the right property, getting the best price, or making sure the transaction goes smoothly?"

The client says: "Honestly, I just don't want any surprises. I've heard stories about deals falling through or hidden costs."

The agent responds: "That makes complete sense. So transaction security and transparency matter most. Here's how our fee reflects that: we conduct due diligence on every property — title verification, developer payment status, any encumbrances. We've walked clients away from deals that looked good on paper but had issues. Our fee covers that protection. If you're comparing to a one-percent agent, the question isn't really about the percentage — it's whether they're doing that level of verification. Some do, some don't. What matters is what you're getting for the fee, not the number itself."

The client says: "That's actually helpful. I hadn't thought about it that way."

Here's why this worked.

First, the agent showed curiosity before defense. By asking what the client values, they discovered the real concern: not the money, but the risk.

Second, the response was tailored. Instead of generic "we provide great service," the agent connected their fee to the specific value the client cares about: transaction security.

Third, no competitor bashing. The agent acknowledged other agents might charge less without suggesting they're worse. They reframed the comparison around value, not price.

Fourth, confidence without arrogance. The agent didn't apologize for the fee or get defensive. They explained it clearly and let the client decide.

The key difference: Don't defend your price. Discover what the client values, then connect your fee to that specific value.
```

---

## The 22 Skills-Script Modules

| # | Module | Demo Scenario |
|---|--------|---------------|
| 1.2 | Prime Capital Positioning | Introducing PC at networking event |
| 1.4 | Off-Plan vs Ready Properties | Client asking which is better for them |
| 1.8 | Golden Visa & Residency | Visa-focused client inquiry |
| 1.10 | Dubai vs Global Markets | "Why Dubai over London/Singapore?" |
| 2.2 | Discovery: End-Users | Family relocation discovery call |
| 2.3 | Discovery: Investors | Yield-focused investor call |
| 2.4 | Discovery: Visa-Seekers | Golden Visa inquiry |
| 2.6 | BANT+ Qualification | Qualifying a new lead |
| 2.7 | Managing Expectations | Client with unrealistic expectations |
| 3.2 | First Contact Excellence | Initial response to inquiry |
| 3.3 | Needs Analysis Conversation | Deep discovery meeting |
| 3.4 | Off-Plan Presentation Skills | Presenting a new launch |
| 3.5 | EOI & Booking Conversion | Moving from interest to EOI |
| 3.7 | Closing Techniques | Asking for the decision |
| 4.4 | Payment Plan Comparison | Explaining plan options |
| 4.6 | Property Presentation | Presenting a shortlist |
| 5.5 | SPA & Down Payment | Walking through SPA signing |
| 5.7 | Escrow Accounts | Explaining escrow to nervous client |
| 6.2 | Market & Timing Objections | "Is now a good time to buy?" |
| 6.3 | Developer & Project Objections | "I've heard bad things about X" |
| 6.4 | Price & Fee Objections | "Your commission is too high" |
| 6.5 | Stall & Delay Objections | "I need to think about it" |
