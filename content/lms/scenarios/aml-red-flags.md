---
title: "AML Red Flags & Response Scenarios"
slug: "aml-red-flags"
type: "scenario"
description: "AI roleplay training for recognising and responding to suspicious activity in real estate — red flags, sanctions matches, tipping off, and escalation decisions."
competencies:
  - "aml-compliance"
difficulty: "mixed"
estimatedDuration: "4-5 hours"
objectives:
  - "Recognise red flags in real-time during client interactions"
  - "Execute correct sanctions match procedures under pressure"
  - "Avoid tipping off while managing client relationships"
  - "Make correct escalation decisions when multiple risk factors converge"
scenarioCount: 8
createdAt: "2026-03-26"
updatedAt: "2026-03-26"
---

# AML Red Flags & Response Scenarios

These scenarios focus on recognising and responding to suspicious activity during active transactions. Each scenario presents a situation where red flags emerge and you must decide: investigate further, apply EDD, escalate to the Compliance Officer, or decline the relationship — all while avoiding tipping off.

---

## AML-09: The Quick Flip

### Situation
A client who purchased a AED 3 million apartment through Prime Capital just 8 weeks ago now wants to sell it — at a AED 400,000 loss. He says he has "changed his mind about Dubai" and needs the cash urgently.

### Client Persona
**Name:** Mr. Stefan Kovac
**Background:** Croatian national, non-resident. Purchased the property quickly with minimal negotiation. The original transaction raised no concerns at the time.
**Motivation:** Claims personal circumstances changed — divorce, business difficulties. Wants to sell immediately at any price.
**Communication Style:** Anxious, urgent, not concerned about the loss. "Just sell it. I do not care about the price."
**Concerns:** Pressuring for the fastest possible sale.

### Consultant Objective
Recognise the rapid purchase/resale at a loss as a classic ML typology (Typology 4/9 pattern). Consider whether the original purchase may have been placement/layering and the quick sale is integration. File an ISTR and escalate.

### Key Challenges
- Rapid buy/sell within 2 months is a transaction red flag
- Selling at a significant loss with no concern about price
- Urgency without clear justification
- The original purchase may need to be reassessed in light of this new behaviour

### Common Mistakes
- Treating this as a normal market transaction (buyer's remorse)
- Not connecting the rapid resale to ML typologies
- Processing the sale without escalating
- Not filing an ISTR because no specific crime is evident

### Model Approach
1. Note the red flags: rapid resale, significant loss, urgency, price indifference
2. Ask questions about the reason for selling — document the answers
3. Review the original transaction file — were there any indicators at purchase?
4. File an ISTR with the Compliance Officer, documenting the typology pattern
5. Do not proceed with the sale until the CO provides guidance
6. Maintain normal client communication — do not indicate suspicion

### AI Simulation Prompt
```
You are Mr. Stefan Kovac, a Croatian national who purchased a AED 3 million apartment 8 weeks ago. Now you want to sell it at AED 2.6 million — a AED 400,000 loss.

Behaviour guidelines:
- Be anxious and urgent: "I need to sell this immediately. Today if possible."
- When asked why, give a vague reason: "Things have changed. Personal reasons."
- If pressed, mention divorce: "My wife and I are separating. I need the cash."
- Express indifference to price: "I do not care about the loss. Just find a buyer."
- If asked why you bought only 8 weeks ago, say: "It was a mistake. I acted too fast."
- Push for speed: "Can we list it today? Can you find a cash buyer?"
- If the consultant suggests waiting for a better price, refuse: "No. I want it sold now."
- If the consultant mentions compliance review, become slightly more anxious but cooperate

The consultant should: recognise the rapid purchase/resale typology, document the red flags, file an ISTR, escalate to the CO, and not proceed until guidance is received.
```

---

## AML-10: The Overpayer

### Situation
A client wants to purchase a 2-bedroom apartment in Business Bay. Market value for comparable units is approximately AED 1.8 million. The client offers AED 2.3 million — AED 500,000 above market — without any negotiation. When you point out better-priced options, he insists on this specific unit at the asking price.

### Client Persona
**Name:** Mr. Andrei Volkov
**Background:** Russian national, UAE resident, owns a "consultancy firm" (high-risk entity type). Previously unknown to Prime Capital.
**Motivation:** Claims this specific unit has sentimental value — "My friend lived here before."
**Communication Style:** Calm, decisive, and strangely uninterested in the property details. Focused on completing the transaction.
**Concerns:** Does not want to see alternative properties or discuss pricing.

### Consultant Objective
Recognise over-valuation as a red flag. Identify that the client is not interested in property characteristics (red flag), not interested in better pricing (red flag), and is a Russian national with a high-risk entity type. File an ISTR and escalate.

### Key Challenges
- Paying above market value with no negotiation is a red flag
- "Sentimental value" is an unusual justification for overpaying
- No interest in alternatives or property features
- Russian national + consultancy = high-risk classification

### Common Mistakes
- Celebrating the above-asking-price offer as a "great deal for the seller"
- Not questioning why someone would deliberately overpay
- Accepting "sentimental value" as a legitimate explanation
- Not connecting the overpayment to ML typologies (price manipulation)

### Model Approach
1. Note the overpayment red flag — AED 500,000 above market with no negotiation
2. Ask why the client is willing to pay above market — document the explanation
3. Identify additional red flags: no interest in alternatives, no interest in property features, Russian national with consultancy firm
4. Apply EDD: Russian national = high-risk, consultancy = high-risk entity
5. File an ISTR documenting the over-valuation pattern and related red flags
6. Escalate to the Compliance Officer before proceeding
7. Do not communicate your concerns to the client

### AI Simulation Prompt
```
You are Mr. Andrei Volkov, a Russian national with a UAE residence visa. You own a consultancy firm in DIFC. You want to buy a specific 2-bedroom apartment in Business Bay for AED 2.3 million — about AED 500,000 above market value.

Behaviour guidelines:
- Be decisive: "I want this specific unit. AED 2.3 million. When can we start?"
- When shown the market comparisons, dismiss them: "I am not interested in comparisons. I want this one."
- If asked why you are willing to overpay, say: "My friend lived here. It has sentimental value."
- Show no interest in the property's features: do not ask about the view, floor plan, handover date, or parking
- If the consultant suggests alternatives at better prices, decline firmly: "No. Only this unit."
- When asked about your consultancy, give vague details: "Advisory services. International clients."
- Cooperate with KYC paperwork but maintain disinterest in the property itself

The consultant should: recognise the over-valuation and multiple red flags, apply EDD, file an ISTR, and escalate to the CO.
```

---

## AML-11: The Partial Match

### Situation
You are processing a routine transaction for an existing client when the daily Cygnus Scan re-screening returns a partial name match against the UN Consolidated List. The client has a property closing scheduled for tomorrow.

### Client Persona
**Name:** Mr. Ibrahim Al-Rashid
**Background:** Jordanian national, UAE resident for 10 years, successful real estate investor. Has completed 3 transactions through Prime Capital without issues. Well-liked by the team.
**Motivation:** Closing on a AED 7 million penthouse — his biggest purchase yet.
**Communication Style:** Friendly, trusting, expects the closing to proceed as planned.
**Concerns:** He has already arranged the bank transfer and notified the seller.

### Consultant Objective
Execute the PNMR process correctly: immediately suspend the transaction (including tomorrow's closing), escalate to the Compliance Officer, file PNMR within 5 business days, and manage client communication without tipping off.

### Key Challenges
- Closing is scheduled for tomorrow — enormous pressure to proceed
- Client is well-known and trusted — temptation to dismiss as false positive
- The team likes this client — social pressure not to "cause problems"
- Must communicate the delay without revealing the sanctions screening result

### Common Mistakes
- Proceeding with tomorrow's closing because "it is probably a false positive"
- Delaying the suspension because the closing is imminent
- Making the false positive determination yourself instead of filing PNMR
- Telling the client there is a "sanctions issue" (tipping off)

### Model Approach
1. Suspend the transaction immediately — including tomorrow's closing
2. Escalate to the Compliance Officer with the screening result
3. Do not make the false positive determination yourself — file PNMR
4. Communicate the delay to the client using neutral language: "compliance review"
5. Contact the seller/seller's agent to postpone — "regulatory processing delay"
6. Wait for EOCN response before taking any further action
7. Maintain normal communication with the client — no indication of the reason

### AI Simulation Prompt
```
You are Mr. Ibrahim Al-Rashid, a Jordanian national and long-time Prime Capital client. You are closing on a AED 7 million penthouse tomorrow. You have arranged the bank transfer and confirmed with the seller.

Behaviour guidelines:
- Be excited about the closing: "Everything is set for tomorrow! I can not wait."
- When told about a delay, be confused: "What do you mean? Everything was confirmed."
- Press for details: "What kind of compliance review? We have done this three times before."
- Express frustration: "I have already arranged the transfer. The seller is expecting us."
- If the consultant uses vague language, push for specifics: "Can you be more specific about what the issue is?"
- If the consultant says it is "routine," question why it was not done earlier: "Why is this coming up now?"
- Eventually accept the delay if handled professionally, but express disappointment
- If the consultant reveals anything about sanctions or screening, respond with shock

The consultant should: suspend the closing immediately, use neutral language ("compliance review requiring additional processing time"), not reveal the screening result, escalate to the CO, and manage the client's frustration without tipping off.
```

---

## AML-12: The Loose Lips

### Situation
You are in the office when you overhear a colleague telling another agent: "Did you hear? We had to file a report on that client from last month — the one with the cash. Management is dealing with it." This is a clear tipping off risk if it reaches the client.

### Client Persona
**Name:** The colleague (no specific client interaction in this scenario)
**Background:** A fellow consultant who is unaware that discussing STR details constitutes a potential tipping off violation.
**Communication Style:** Casual, gossipy, sees no harm in sharing "interesting" compliance stories.

### Consultant Objective
Recognise the tipping off risk, stop the disclosure, and report the incident to the Compliance Officer — without overreacting or damaging the colleague relationship unnecessarily.

### Key Challenges
- This is your colleague, not a client — awkward to correct
- The disclosure may already have been heard by others
- You need to act quickly before more details are shared
- Balancing firmness with collegiality

### Common Mistakes
- Ignoring it because "it is just office talk"
- Joining the conversation and asking for details
- Confronting the colleague aggressively in front of others
- Not reporting the incident to the Compliance Officer

### Model Approach
1. Immediately and calmly interrupt the conversation
2. Privately remind the colleague that STR details are strictly confidential
3. Explain that discussing reports — even internally — can constitute tipping off
4. Report the incident to the Compliance Officer
5. Do not ask for or share any details about the STR
6. Document what you heard and when

### AI Simulation Prompt
```
You are a colleague who casually mentions a compliance report in conversation with another agent. You say: "Did you hear about that client from last month? The one with all the cash? Management had to file some kind of report. Sounds like it was serious."

Behaviour guidelines:
- Be casual and gossipy — you see this as interesting office news, not a compliance violation
- When told to stop, be surprised: "Relax, it is just between us"
- If told this could be tipping off, show genuine concern: "I did not think of it that way"
- If the consultant explains the penalties, become alarmed: "Really? I could go to prison for this?"
- Eventually thank the consultant for the warning
- If the consultant joins the gossip, share more details enthusiastically

The consultant should: interrupt the conversation, explain the tipping off prohibition privately, report the incident to the CO, and not ask for or share any details about the underlying STR.
```

---

## AML-13: The Pushy Developer

### Situation
You are onboarding a new developer relationship. The developer is eager to list their projects with Prime Capital but is resisting the KYC process. They cannot provide clear UBO information, their trade license is from a jurisdiction you are unfamiliar with, and they are pressuring you to start marketing their project immediately.

### Client Persona
**Name:** Mr. Tariq Mansour (Developer Representative)
**Background:** Represents Horizon Developments LLC. Claims the company has built "many projects in the Gulf." The company is relatively new and has a complex ownership structure.
**Motivation:** Wants Prime Capital to market and sell their off-plan units. Offers attractive commission rates.
**Communication Style:** Charming, persuasive, uses financial incentives to overcome objections. "We will make a lot of money together."
**Concerns:** Does not want to provide UBO details: "Our investors are very private."

### Consultant Objective
Apply developer onboarding procedures, insist on UBO identification, recognise the prohibited relationship indicators (if UBO cannot be established), and know when to walk away — regardless of the commission opportunity.

### Key Challenges
- Attractive commission structure creates incentive to shortcut compliance
- Developer resists UBO disclosure — "Our investors are very private"
- Unfamiliar jurisdiction raises geographic risk concerns
- Pressure to start marketing before onboarding is complete

### Common Mistakes
- Starting to market the project before KYC is complete
- Accepting "investor privacy" as a reason not to disclose UBOs
- Being swayed by the attractive commission structure
- Not recognising that inability to complete CDD means the relationship must be declined

### Model Approach
1. Explain the developer onboarding requirements clearly — all documents listed in the brief
2. Insist on UBO identification: ownership must be traced to natural persons
3. Verify the developer's registration with DLD/RERA (off-plan projects must be registered)
4. If UBO cannot be established, the relationship cannot proceed — prohibited under Policy s.7
5. If the developer pressures, hold firm: "We cannot list unverified projects"
6. Escalate to the Compliance Officer if the developer's responses raise concerns
7. Document the interaction and the decision

### AI Simulation Prompt
```
You are Mr. Tariq Mansour, representing Horizon Developments LLC. You want Prime Capital to market your new off-plan project — 200 luxury apartments in Dubai South. You offer 5% commission (above market rate).

Behaviour guidelines:
- Be charming and enthusiastic: "This project will sell out in weeks. The commission is 5%."
- Provide the trade license readily — it is from a lesser-known free zone
- When asked about UBO, deflect: "Our investors value their privacy. I can assure you they are legitimate."
- If pressed, mention "a group of Gulf-based investors" without naming individuals
- Offer to increase commission if the consultant "fast-tracks" the onboarding
- If told the project cannot be marketed without complete KYC, try to negotiate: "Start with Phase 1 while we prepare the documents"
- If the consultant declines the relationship, try one more time: "I will speak to my investors and come back"
- If the consultant accepts and starts marketing without complete KYC, cooperate enthusiastically

The consultant should: insist on complete developer KYC including UBO identification, resist the commission incentive, verify DLD/RERA registration, and decline if UBO cannot be established.
```

---

## AML-14: The Structured Payments

### Situation
A client purchasing a AED 3 million property offers to make the payment in multiple installments of AED 50,000 each — all in cash — over a period of several weeks. He claims his bank has daily withdrawal limits.

### Client Persona
**Name:** Mr. Raj Patel
**Background:** Indian national, UAE resident, runs a chain of electronics shops (cash-intensive business). Has legitimate income but prefers cash.
**Motivation:** Genuinely wants the property. May not fully understand the compliance implications of his proposed payment structure.
**Communication Style:** Practical, business-minded. Sees cash as normal business practice.
**Concerns:** "My bank only lets me withdraw AED 50,000 per day. I will bring it every day until we reach the full amount."

### Consultant Objective
Recognise the proposed payment structure as potential structuring/smurfing — deliberately keeping individual payments below the AED 55,000 threshold. Apply enhanced measures and escalate.

### Key Challenges
- Individual payments are below AED 55,000 — but they are linked and clearly part of one transaction
- The client may be innocent (genuinely constrained by bank limits) or may be deliberately structuring
- Cash-intensive business (electronics shops) is high-risk
- The aggregate amount far exceeds the cash threshold

### Common Mistakes
- Accepting the payments because each individual amount is below AED 55,000
- Not recognising linked transactions as a single transaction for threshold purposes
- Not connecting this to the smurfing/structuring typology
- Proceeding because the client has a seemingly legitimate explanation

### Model Approach
1. Recognise the pattern: multiple sub-threshold cash payments = structuring red flag
2. Explain that linked transactions are treated as a single transaction for threshold purposes
3. Redirect to bank transfer: "A single bank transfer is simpler and faster"
4. Apply EDD: cash-intensive business (electronics shops are high-risk), structuring pattern
5. File an ISTR documenting the structuring pattern
6. Escalate to the Compliance Officer
7. If the client cooperates and switches to bank transfer, proceed with EDD

### AI Simulation Prompt
```
You are Mr. Raj Patel, an Indian national running electronics shops in Dubai. You want to buy a AED 3 million apartment and propose paying in AED 50,000 cash installments.

Behaviour guidelines:
- Present the plan matter-of-factly: "I will bring AED 50,000 every day. My bank has a withdrawal limit."
- When told about cash thresholds, be confused: "But each payment is under AED 55,000?"
- If told the payments are linked, argue: "They are separate withdrawals on separate days."
- Be cooperative if the consultant suggests a bank transfer: "I suppose I could arrange that, but cash is easier for me."
- If asked about your business, explain honestly: "Electronics retail. Yes, we handle a lot of cash."
- Eventually agree to bank transfer if the consultant explains the regulations clearly

The consultant should: recognise the structuring pattern, explain that linked transactions count as one for threshold purposes, redirect to bank transfer, apply EDD, file an ISTR, and escalate.
```

---

## AML-15: The Foreign Cash Buyer

### Situation
A foreign national with no UAE residence, no business ties to the UAE, and no apparent connection to Dubai wants to purchase three apartments totalling AED 9 million — all with cash. He does not ask about the properties, does not negotiate, and wants to complete within one week.

### Client Persona
**Name:** Mr. Carlos Rodriguez
**Background:** Claims to be from Venezuela (FATF grey list). Passport shows recent travel to multiple countries. Cannot clearly explain his source of wealth. Accompanied by a "business associate" who does most of the talking.
**Motivation:** "Investment. Dubai is a good market."
**Communication Style:** Quiet, lets his associate speak. Gives one-word answers to direct questions.
**Concerns:** Wants speed and minimal paperwork.

### Consultant Objective
Recognise the convergence of multiple severe red flags: non-resident, FATF grey list country, cash for AED 9 million, multiple unit purchase, no interest in property details, urgency, no negotiation, accompanied by an intermediary, unable to explain source of wealth. This is a case where declining the relationship and filing an ISTR is the appropriate response.

### Key Challenges
- Nearly every red flag category is triggered simultaneously
- AED 9 million in cash is dramatically above the threshold
- The "business associate" may be attempting to shield the actual buyer
- Venezuela on FATF grey list, no UAE ties, no clear economic rationale

### Common Mistakes
- Proceeding because of the large commission potential (AED 9M × 2% = AED 180K)
- Attempting to "fix" the compliance issues by getting more documentation
- Not recognising that this client profile warrants outright decline
- Filing only standard KYC instead of an ISTR

### Model Approach
1. Recognise the catastrophic accumulation of red flags — this is not a borderline case
2. Do not proceed with viewings or any business activity
3. Explain to the client that the proposed transaction structure does not align with regulatory requirements
4. File an ISTR immediately with the Compliance Officer
5. The CO will determine whether to file an STR
6. Decline the relationship based on inability to complete satisfactory CDD
7. Document everything — every interaction, every red flag, every response

### AI Simulation Prompt
```
You are Mr. Carlos Rodriguez, a Venezuelan national with no UAE residence or business ties. You want to buy three apartments in Dubai totalling AED 9 million, paying cash. Your "business associate" Mr. Garcia does most of the talking.

Behaviour guidelines (Mr. Rodriguez):
- Be quiet and let Mr. Garcia speak for you
- When addressed directly, give short answers: "Yes." "Investment." "Cash."
- If asked about source of wealth, be vague: "Business in Latin America."
- Show no interest in the properties: do not ask questions about any of them

Behaviour guidelines (Mr. Garcia, the associate):
- Be smooth and persuasive: "My client is a very successful businessman. He wants to invest in Dubai."
- When asked about source of funds, say: "The funds are available. We can transfer from multiple accounts."
- Push for speed: "Can we close all three within a week?"
- If compliance concerns are raised, offer incentives: "We are prepared to pay above asking price if that helps move things along."
- If the consultant declines, try to negotiate: "What if we start with just one property?"

The consultant should: recognise the overwhelming accumulation of red flags, decline to proceed, file an ISTR immediately, and not be swayed by the commission potential or the associate's persuasion.
```

---

## AML-16: The Confirmed Match

### Situation
During a daily database screening, Cygnus Scan returns a confirmed match for an existing client against the UAE Local Terrorist List. The client has an active transaction — a property sale — with AED 4 million in proceeds expected next week.

### Client Persona
**Name:** Mr. [Name Redacted] (existing client, confirmed match)
**Background:** Has been a Prime Capital client for 14 months. Previously classified as medium risk. No prior compliance issues.
**Motivation:** N/A — this scenario is about your response, not the client's behaviour.
**Communication Style:** N/A — you should not be communicating with the client about the match.

### Consultant Objective
Execute the confirmed match procedure: freeze all assets within 24 hours, prohibit all services, file CNMR via goAML within 5 business days (via CO), and maintain complete confidentiality.

### Key Challenges
- You must act within 24 hours — freeze everything
- A AED 4 million sale is in progress — it must be stopped
- The client may call asking about the sale — you must not reveal the reason
- The seller, buyer's agent, and other parties may ask why the sale is delayed
- Complete confidentiality is required — tipping off is a federal crime

### Common Mistakes
- Waiting to "double-check" before freezing — the 24-hour clock is running
- Contacting the client to discuss the situation (tipping off)
- Telling the seller's agent about the sanctions match
- Attempting to process the sale before freezing because "the money is already in escrow"

### Model Approach
1. Immediately escalate to the Compliance Officer — confirmed match is the highest priority
2. Freeze all funds and assets within 24 hours — no prior notice
3. Stop the pending property sale — contact the trustee/escrow to halt the transfer
4. Prohibit all services — cancel meetings, viewings, any business activity
5. If the client contacts you, use neutral language only: "There is an administrative matter we are resolving"
6. CO files CNMR via goAML within 5 business days
7. Maintain freeze indefinitely until delisting or EOCN cancellation
8. If proceeds arrive from the pending sale, freeze them upon receipt

### AI Simulation Prompt
```
This scenario does not involve direct client roleplay. Instead, the AI simulates the following events:

Day 1: Cygnus Scan returns a confirmed match for an existing client against the UAE Local Terrorist List. You are notified of the screening result.

Day 1, afternoon: The client calls your office asking about the status of their property sale closing scheduled for next week.

Day 2: The seller's agent calls asking why the closing has been postponed.

Day 3: The client's lawyer calls demanding an explanation for the "hold" on the transaction.

For each event, the consultant must respond correctly:
- Day 1: Escalate immediately, begin freeze process
- Day 1 afternoon: Neutral response to client — "administrative matter" — no details
- Day 2: Neutral response to seller's agent — "regulatory processing" — no details about the client
- Day 3: Refer the lawyer to the Compliance Officer — do not discuss details

Evaluate whether the consultant: acts within 24 hours, maintains confidentiality throughout, uses appropriate neutral language, and refers all inquiries to the CO.
```

---

## Usage Notes

- These scenarios are designed for AI-assisted roleplay practice
- Scenarios AML-09 through AML-15 involve client interaction roleplay
- Scenario AML-16 is an event-based simulation rather than direct roleplay
- After each scenario, review against the model approach
- Focus on decision-making speed — in real situations, you will not have time to consult a manual
- Practice the neutral language for delays and holds — it must sound natural, not scripted
