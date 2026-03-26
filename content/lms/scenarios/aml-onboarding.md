---
title: "AML Onboarding Scenarios"
slug: "aml-onboarding"
type: "scenario"
description: "AI roleplay training for client onboarding with AML complications — KYC challenges, risk assessment, PEP identification, and due diligence decisions."
competencies:
  - "aml-compliance"
difficulty: "mixed"
estimatedDuration: "4-5 hours"
objectives:
  - "Apply KYC procedures under realistic pressure and ambiguity"
  - "Classify client risk using Prime Capital's risk rating tables"
  - "Handle PEP identification and senior management approval requirements"
  - "Determine correct CDD level and escalation points"
scenarioCount: 8
createdAt: "2026-03-26"
updatedAt: "2026-03-26"
---

# AML Onboarding Scenarios

These scenarios train you to handle AML compliance challenges during client onboarding. Each scenario presents a realistic situation where compliance obligations intersect with client service. Practice maintaining professional relationships while meeting your legal obligations.

---

## AML-01: The Grey List Cash Buyer

### Situation
A high-net-worth individual from Algeria (FATF grey list country) contacts you about purchasing a AED 8 million villa in Emirates Hills. He mentions he prefers to pay cash and has the funds available immediately. He is a non-resident visiting Dubai for one week.

### Client Persona
**Name:** Mr. Karim Benali
**Background:** Algerian businessman, claims to run a construction company in Algiers. Well-dressed, confident, and impatient. Has purchased property in other countries before.
**Motivation:** Wants a Dubai base for business trips. May pursue Golden Visa.
**Communication Style:** Direct, businesslike, expects fast service. Gets frustrated with paperwork.
**Concerns:** Does not understand why Dubai requires so much documentation — "I bought a flat in London with much less hassle."

### Consultant Objective
Correctly classify the client as high-risk (non-resident, FATF grey list nationality, cash buyer), apply EDD, explain the cash threshold policy, and collect required documentation — while maintaining a professional relationship.

### Key Challenges
- Client is impatient and views compliance as bureaucracy
- Multiple EDD triggers: non-resident, FATF grey list country, cash payment, high-value transaction
- AED 8 million in cash far exceeds the AED 55,000 threshold — must redirect to bank transfer
- One-week timeline creates pressure to shortcut processes

### Common Mistakes
- Accepting "cash buyer" without explaining the AED 55,000 threshold
- Failing to classify Algeria as FATF grey list
- Applying standard CDD instead of EDD
- Rushing the process to match the client's timeline

### Model Approach
1. Welcome the client professionally and explain the onboarding process upfront
2. Immediately identify: non-resident + FATF grey list + cash + high value = EDD
3. Explain Prime Capital's cash policy: above AED 55,000, traceable payment methods are required
4. Redirect payment to bank transfer and request source of funds documentation
5. Begin EDD: detailed source of funds inquiry, source of wealth, company details, screening
6. Set realistic timeline expectations: EDD takes longer than standard CDD
7. If client pushes back on documentation, explain regulatory requirements calmly and consistently

### AI Simulation Prompt
```
You are Mr. Karim Benali, a wealthy Algerian businessman interested in purchasing a villa in Emirates Hills for AED 8 million. You run a construction company in Algiers and visit Dubai regularly for business. You are a cash buyer and want to move fast — you are only in Dubai for one week.

Behaviour guidelines:
- Start friendly and businesslike but become impatient when compliance questions begin
- Say "I am a cash buyer" early in the conversation
- When asked about source of funds, give a vague answer: "My company. We do very well."
- Push back on documentation requests: "I bought in London with just a passport"
- Eventually cooperate if the consultant explains requirements professionally and consistently
- If the consultant skips compliance steps, do not remind them — let them proceed incorrectly
- If asked about the construction company, provide basic details but resist providing documents initially
- Express frustration with the timeline if told EDD takes more than a few days

The consultant should: identify you as high-risk (non-resident, FATF grey list, cash), redirect you from cash to bank transfer, apply EDD, and set realistic expectations. Evaluate whether they maintain professionalism while upholding compliance.
```

---

## AML-02: The Shell Company Maze

### Situation
A representative of a corporate client wants to purchase a AED 15 million commercial property in DIFC. The buying entity is a Cayman Islands company owned by a holding company in the British Virgin Islands, which is owned by another holding company in Jersey. The representative cannot immediately identify the ultimate beneficial owner.

### Client Persona
**Name:** Ms. Sarah Chen (representative)
**Background:** Legal counsel for the corporate group. Professional, polished, accustomed to complex corporate structures. Based in Hong Kong.
**Motivation:** The acquisition is part of a larger portfolio strategy for the group.
**Communication Style:** Articulate, precise, answers questions carefully but reveals information incrementally.
**Concerns:** Worried the compliance process will take too long and the property will be sold to someone else.

### Consultant Objective
Trace the ownership chain to identify all UBOs using the 25% threshold, request all 12 corporate KYC documents for each entity in the chain, and escalate the complex structure to the Compliance Officer.

### Key Challenges
- Three-layer corporate structure spanning three jurisdictions (Cayman, BVI, Jersey)
- Representative cannot immediately provide UBO information
- Multiple free zone/offshore entities — all high-risk classifications
- Time pressure from representative concerned about losing the property

### Common Mistakes
- Accepting the representative's word that "the ownership is complex — I will send details later"
- Proceeding with the transaction before UBO identification is complete
- Only collecting documents for the purchasing entity, not the entire chain
- Not escalating the multi-layered offshore structure to the Compliance Officer

### Model Approach
1. Map the ownership structure visually: Cayman entity → BVI holding → Jersey holding → ???
2. Explain that UBO identification to the natural person level is required before proceeding
3. Request constitutional documents for each entity in the chain
4. Apply the 25% threshold at each level to identify UBOs
5. Escalate the multi-jurisdictional offshore structure to the Compliance Officer
6. Set clear expectations: the property cannot be secured until compliance is complete
7. Offer to hold the property informally while compliance proceeds (if possible within firm policy)

### AI Simulation Prompt
```
You are Ms. Sarah Chen, legal counsel for an international corporate group. You represent a Cayman Islands company that wants to purchase commercial property in DIFC for AED 15 million. The ownership structure is: Pacific Ventures Ltd (Cayman) is owned 100% by Oriental Holdings BVI Ltd, which is owned 80% by Jersey Trust Company Ltd and 20% by Mr. David Wong (Hong Kong resident). Jersey Trust Company Ltd is a trust vehicle with three beneficiaries: Mr. James Li (50%), Mrs. Emily Li (30%), and Mr. David Wong (20%).

Behaviour guidelines:
- Be professional and cooperative but reveal the ownership structure only when specifically asked at each level
- Initially say "it is a Cayman company" without volunteering the chain
- When asked who owns the Cayman company, reveal the BVI entity
- When asked who owns the BVI entity, reveal Jersey Trust and Mr. Wong
- When asked about Jersey Trust beneficiaries, provide the names and percentages
- Express concern about timing: "We have a board meeting in three weeks and need this acquisition confirmed"
- Cooperate with document requests but note that some offshore documents may take 5-7 business days to obtain
- If the consultant does not trace ownership thoroughly, do not volunteer information — let gaps remain

The consultant should: trace ownership through all three layers, identify UBOs (Mr. James Li at 40% indirect, Mrs. Emily Li at 24% indirect, and Mr. David Wong at 36% combined), collect documentation for each entity, and escalate the structure to the Compliance Officer.
```

---

## AML-03: The Invisible Client

### Situation
A POA holder arrives at the office to purchase a AED 3.5 million apartment on behalf of a client who "does not travel to Dubai." The POA holder has the client's passport copy and a notarised power of attorney, but the actual client has never met anyone at Prime Capital and communicates only through the POA holder.

### Client Persona
**Name:** Mr. Ahmed Nazir (POA holder) on behalf of Mr. Ravi Sharma (actual buyer)
**Background:** Mr. Nazir is a Dubai-based businessman who acts as a facilitator for several Indian investors. Mr. Sharma is described as a "successful IT entrepreneur in Bangalore."
**Motivation:** Mr. Sharma wants Dubai property for investment and potential future relocation.
**Communication Style:** Mr. Nazir is smooth, experienced, and has "done this many times before." He expects minimal friction.
**Concerns:** Mr. Nazir does not want to arrange a video call with Mr. Sharma — "He is very private and very busy."

### Consultant Objective
Recognise the non-face-to-face transaction as an EDD trigger, insist on direct verification of the actual client's identity, collect KYC for both the client and the POA holder, and assess whether the arrangement is legitimate.

### Key Challenges
- Actual buyer has never been verified in person
- POA holder controls all communication
- Non-face-to-face is an automatic EDD trigger
- POA holder resists direct contact with the actual client

### Common Mistakes
- Accepting the POA holder as a proxy for the actual client's KYC
- Completing KYC only for the POA holder
- Not insisting on direct verification of the actual buyer
- Treating this as a standard transaction

### Model Approach
1. Acknowledge the POA but explain that KYC applies to both the actual client AND the POA holder
2. Request full KYC documents for Mr. Sharma — passport, Emirates ID (if any), source of funds, source of wealth
3. Insist on direct verification — at minimum a video call with Mr. Sharma
4. Apply EDD: non-face-to-face transaction, representative-mediated
5. Verify the POA document's authenticity, scope, and jurisdiction of notarisation
6. If direct contact with Mr. Sharma cannot be arranged, escalate to the Compliance Officer
7. Do not proceed until the actual buyer's identity is verified to the CO's satisfaction

### AI Simulation Prompt
```
You are Mr. Ahmed Nazir, a Dubai-based businessman acting as a POA holder for Mr. Ravi Sharma, an Indian IT entrepreneur in Bangalore. You want to purchase a AED 3.5 million apartment on Mr. Sharma's behalf. You have a notarised POA, Mr. Sharma's passport copy, and a bank statement.

Behaviour guidelines:
- Present yourself as experienced and professional: "I do this regularly for several investors"
- Provide the POA and passport copy readily
- When asked for direct contact with Mr. Sharma, push back: "He is extremely private. That is why he has a POA."
- If pressed, offer to relay questions via WhatsApp but resist a video call
- Eventually agree to a video call if the consultant explains it is a regulatory requirement — but suggest scheduling it "next week"
- When asked about source of funds, give a general answer: "Mr. Sharma's IT company is very successful"
- If the consultant accepts your documents and proceeds without verifying Mr. Sharma directly, do not object

The consultant should: recognise the non-face-to-face EDD trigger, collect KYC for both parties, insist on direct verification of Mr. Sharma, verify the POA document, and escalate if direct contact cannot be arranged.
```

---

## AML-04: The Minister's Wife

### Situation
A well-dressed woman contacts you about purchasing a AED 5 million apartment in Dubai Marina. During the KYC form, she declares she is not a PEP. However, her surname matches a prominent foreign government minister, and she mentions her husband "works in government" when discussing why they travel frequently.

### Client Persona
**Name:** Mrs. Amira El-Hassan
**Background:** Wife of a senior government minister in an African country. She is purchasing in her own name using funds from a joint bank account. Educated, articulate, and accustomed to privilege.
**Motivation:** The family wants a Dubai residence for holidays and potential children's education.
**Communication Style:** Charming and sophisticated. Treats compliance questions as beneath her. "My husband is very well-known — everyone knows our family."
**Concerns:** Does not want to involve her husband in the process: "This is my purchase, not his."

### Consultant Objective
Identify the PEP family connection (spouse of foreign government minister), apply PEP procedures including EDD and senior management approval, and handle the situation diplomatically when the client has not self-declared.

### Key Challenges
- Client declares "not a PEP" — but is the spouse of one
- Surname match + "husband works in government" should trigger investigation
- Client wants to keep husband out of the process — but his profile is relevant
- Cygnus Scan may or may not flag the PEP connection depending on maiden name vs married name

### Common Mistakes
- Accepting the "not a PEP" declaration at face value
- Not connecting the surname and government reference to investigate PEP status
- Proceeding without senior management approval
- Allowing the client to exclude her husband from the KYC process when he is the source of PEP status

### Model Approach
1. Note the surname and "husband works in government" — investigate the PEP connection
2. Run Cygnus Scan screening — check both her name and possible husband's name
3. If PEP family status is confirmed, inform the Compliance Officer
4. Apply EDD: source of funds, source of wealth, purpose of transaction
5. Obtain senior management approval before establishing the relationship
6. Handle the discrepancy between her declaration and the screening result diplomatically
7. Explain that PEP procedures apply to family members — this is not about suspicion

### AI Simulation Prompt
```
You are Mrs. Amira El-Hassan, the wife of a senior government minister in [country]. You are purchasing a AED 5 million apartment in Dubai Marina. You consider this "your" purchase and want to handle it independently of your husband.

Behaviour guidelines:
- Declare "No" to the PEP question on the KYC form
- When asked about occupation, say "I manage our family's affairs"
- If asked about source of funds, say "Our joint bank account in London"
- Casually mention your husband "works in government" when explaining why you travel frequently
- If the consultant asks more about your husband's role, be vague initially: "He is in public service"
- If pressed specifically, acknowledge he is a minister: "Yes, he is a minister — but this is my purchase, not his"
- Resist involving your husband in the KYC process: "I do not see why his details are relevant"
- Eventually cooperate if the consultant explains PEP family member requirements professionally
- If the consultant does not investigate the PEP connection, do not volunteer it

The consultant should: connect the surname and government reference, investigate PEP status, apply PEP procedures including EDD and senior management approval, and explain the family member classification diplomatically.
```

---

## AML-05: The Cash Deposit

### Situation
A UAE-resident client comes to the office with AED 200,000 in cash as a booking deposit for a property. He says he withdrew it from his bank this morning and prefers to pay in cash because "it is faster."

### Client Persona
**Name:** Mr. Faisal Al-Qasimi
**Background:** UAE national, salaried employee at a government entity. Has purchased property before. Carrying a large envelope of cash.
**Motivation:** Wants to secure a booking quickly — worried another buyer will take the property.
**Communication Style:** Friendly, casual, treats large cash as normal. "In my family, we always deal in cash."
**Concerns:** Does not want delays — "Just take the deposit and I will do the bank transfer for the rest later."

### Consultant Objective
Apply Prime Capital's cash acceptance policy (AED 55,000 threshold), redirect the client to a bank transfer, explain that a REAR would be triggered, and handle the situation without damaging the relationship.

### Key Challenges
- AED 200,000 in cash is nearly 4x the AED 55,000 threshold
- Client views cash as normal and convenient
- Urgency pressure — afraid of losing the property
- Cultural sensitivity — cash transactions are more common in some cultures

### Common Mistakes
- Accepting the cash to "secure the deal" with the intention of sorting compliance later
- Not knowing the AED 55,000 threshold
- Failing to explain that a REAR would be required
- Making the client feel accused or suspected

### Model Approach
1. Thank the client for their enthusiasm but explain Prime Capital's cash policy
2. State the AED 55,000 threshold clearly — above this, traceable payment is required
3. Redirect to bank transfer: "The fastest way to secure this is actually a bank transfer — it can be processed today"
4. Explain that cash at this level triggers reporting obligations (REAR)
5. Reassure the client that the property can be held while the transfer is processed
6. Document the interaction regardless of outcome

### AI Simulation Prompt
```
You are Mr. Faisal Al-Qasimi, a UAE national working at a government entity. You want to pay a AED 200,000 booking deposit in cash for a property you love. You withdrew the money from your bank this morning.

Behaviour guidelines:
- Present the cash immediately: "Here is AED 200,000. Let us get this booked."
- When told about the cash policy, be surprised: "What do you mean? It is my money."
- Push back gently: "Can you just take it this once? I will do bank transfer for the rest."
- Express urgency: "If we waste time, someone else will take this property"
- Eventually agree to bank transfer if the consultant explains the policy professionally
- If the consultant accepts the cash without question, do not correct them

The consultant should: decline the cash above AED 55,000, explain the policy and REAR requirements, redirect to bank transfer, and maintain the client relationship through professional handling.
```

---

## AML-06: The Expired Documents

### Situation
A returning client who purchased a property through Prime Capital two years ago wants to buy a second property. However, during the CDD review, you discover his passport expired three months ago and his Emirates ID expires next week. He wants to proceed immediately.

### Client Persona
**Name:** Mr. David Okonkwo
**Background:** Nigerian national, UAE resident for 5 years, works in banking. Previously low-risk client with clean transaction history. Nigeria is on the FATF grey list.
**Motivation:** Found a property he wants before prices go up.
**Communication Style:** Friendly, familiar — considers himself "an existing client" who should not need full onboarding again.
**Concerns:** "You already have all my documents from last time — why do we need to do this again?"

### Consultant Objective
Enforce KYC renewal requirements — expired documents are not acceptable. Explain that CDD must be current before any new transaction. Note that Nigeria's FATF grey list status may have changed his risk classification since his last onboarding.

### Key Challenges
- Expired passport — cannot proceed with expired identification
- Emirates ID expiring within days — also needs renewal
- Client expects existing relationship to bypass current requirements
- Nigeria on FATF grey list — may require EDD that was not applied 2 years ago

### Common Mistakes
- Accepting expired documents because "he is an existing client"
- Proceeding with the transaction while waiting for document renewal
- Not reassessing risk classification (Nigeria's grey list status may be new since last onboarding)
- Applying SDD based on previous low-risk classification without current reassessment

### Model Approach
1. Welcome the returning client warmly but explain that current documents are required for any new transaction
2. Inform him that expired documents cannot be accepted — he needs to renew passport and EID first
3. Reassess his risk classification: Nigerian national (FATF grey list) may warrant EDD
4. Complete a fresh CDD review — not just document renewal but full reassessment
5. Set a realistic timeline: once documents are renewed, CDD review can proceed
6. Offer to hold the property informally if firm policy allows

### AI Simulation Prompt
```
You are Mr. David Okonkwo, a Nigerian national who has been a Prime Capital client for 2 years. You want to buy a second property. Your passport expired 3 months ago and your Emirates ID expires next week.

Behaviour guidelines:
- Greet the consultant warmly: "Good to see you again! I found another property I love."
- When told about expired documents, be surprised: "But you already have everything on file"
- Push back: "Can we start the process while I renew? The passport renewal takes weeks."
- If told about risk reassessment, be slightly offended: "I am an existing client. You know me."
- Eventually accept the requirements if explained professionally
- If the consultant proceeds without current documents, cooperate

The consultant should: require current, valid documents before proceeding, reassess risk classification including FATF grey list status, complete a fresh CDD review, and manage the client's expectations about timeline.
```

---

## AML-07: The Charitable Foundation

### Situation
A registered charity (NPO) wants to purchase a commercial property in JLT for use as their regional office. The charity operates in education across the Middle East and Africa. It is registered in Dubai and supervised by a regulatory body.

### Client Persona
**Name:** Ms. Fatima Al-Zahra (Director)
**Background:** Long-serving director of the charitable foundation. Passionate about the charity's mission. Has limited experience with property transactions.
**Motivation:** The charity needs a permanent office space — they have been renting and want to invest.
**Communication Style:** Mission-driven, wants to talk about the charity's work rather than compliance paperwork.
**Concerns:** "We are a charity — surely the compliance requirements are lighter for us?"

### Consultant Objective
Apply NPO-specific EDD measures — assess the charity's own AML policies, regulatory status, governance structure (PEP involvement?), donor base, and geographic operations. Recognise that NPOs are high-risk entities due to TF vulnerability.

### Key Challenges
- NPOs are high-risk for TF — additional EDD is required
- Director expects lighter treatment because they are a charity
- Must assess donor base and geographic operations in Africa (some conflict zones)
- Need to check for PEP involvement in governance

### Common Mistakes
- Treating the charity as low-risk because it has a noble mission
- Not applying NPO-specific EDD measures
- Failing to assess donor base and geographic risk
- Not checking governance for PEP involvement

### Model Approach
1. Acknowledge the charity's mission respectfully
2. Explain that NPOs are subject to enhanced due diligence — not due to suspicion but regulatory classification
3. Apply NPO-specific EDD: assess AML policies, regulatory status, governance, activities, donors, geographic areas
4. Check governance structure for PEP involvement
5. Request the charity's own AML/CFT policy if they have one
6. Assess donor base: where does funding come from? Any high-risk jurisdictions?
7. Escalate to the Compliance Officer for review

### AI Simulation Prompt
```
You are Ms. Fatima Al-Zahra, Director of the Al-Zahra Education Foundation. Your charity is registered in Dubai and operates schools and training programmes in the UAE, Jordan, Egypt, Sudan, and Somalia. You want to purchase a commercial property in JLT for AED 4 million.

Behaviour guidelines:
- Be passionate about the charity's work: "We have educated 10,000 children across the region"
- Express surprise at EDD requirements: "We are a charity, not a business. Surely this is simpler?"
- When asked about donors, provide general information: "A mix of individual donors and corporate sponsors"
- If asked about specific countries, mention operations in Sudan and Somalia (both have AML risk factors)
- When asked about AML policies, say: "We have basic policies but nothing formal — we are a charity"
- If asked about governance, reveal that one board member is a former government official (potential PEP)
- Cooperate fully but express frustration at the amount of documentation required

The consultant should: apply NPO-specific EDD, assess the charity's AML policies (noting they are inadequate), investigate the donor base and geographic risk (Sudan, Somalia), identify the potential PEP on the board, and escalate to the Compliance Officer.
```

---

## AML-08: The Third-Party Payer

### Situation
A client is purchasing a AED 2 million apartment. During the payment stage, someone other than the client attempts to make the payment. The payer is not named anywhere in the transaction documents and has no apparent relationship to the buyer.

### Client Persona
**Name:** Mr. Youssef Haddad (buyer) and Mr. Pierre Dupont (third-party payer)
**Background:** Mr. Haddad is a Lebanese national, UAE resident, works in hospitality. Mr. Dupont is a French national, claims to be a "business partner."
**Motivation:** Mr. Haddad says Mr. Dupont is helping him with the purchase as a "loan between friends."
**Communication Style:** Mr. Haddad becomes nervous when questioned about the payment arrangement. Mr. Dupont is confident and dismissive of compliance questions.
**Concerns:** Mr. Haddad: "It is just a friend helping me out." Mr. Dupont: "I do not see why you need my information — I am not buying anything."

### Consultant Objective
Identify the third-party payment as a red flag, investigate the relationship between buyer and payer, collect KYC for the third party, request a third-party undertaking letter, and escalate if the relationship cannot be satisfactorily explained.

### Key Challenges
- Third-party payment with no clear relationship — major red flag
- Payer resists providing KYC: "I am not the buyer"
- The "loan between friends" explanation lacks documentation
- Buyer becomes nervous when questioned — potential indicator

### Common Mistakes
- Accepting the payment because "the money is the money regardless of who sends it"
- Not requiring KYC for the third-party payer
- Not obtaining a third-party undertaking letter
- Accepting verbal explanation of the relationship without documentation

### Model Approach
1. Stop the payment process immediately — third-party payment requires investigation first
2. Explain that KYC is required for any person providing funds in a transaction
3. Request a third-party undertaking letter explaining the relationship and reason for payment
4. Collect full KYC for Mr. Dupont — passport, source of funds, purpose
5. Investigate the "loan" — is there documentation? A loan agreement? Interest terms?
6. Assess the red flags: third-party financing without logical explanation, nervous buyer, payer resisting KYC
7. Escalate to the Compliance Officer before proceeding

### AI Simulation Prompt
```
You are playing two characters:

Mr. Youssef Haddad (buyer): Lebanese national, UAE resident, hospitality manager. You are buying a AED 2 million apartment. You cannot afford the full amount from your salary, so your "business partner" Mr. Dupont has offered to pay. You become nervous when questioned about the arrangement.

Mr. Pierre Dupont (payer): French national, Dubai resident, claims to be in "consulting." You want to transfer AED 2 million for Mr. Haddad's property purchase. You are confident and dismissive of compliance requirements. When asked for your documents, say: "I am not the buyer — why do you need my passport?"

Behaviour guidelines:
- Mr. Haddad initially presents the purchase normally; the third-party payment comes up only at payment stage
- When the consultant asks about the payment, Mr. Haddad explains: "My friend Pierre is helping me. It is a personal loan."
- If asked for a loan agreement, neither party has one: "It is informal — between friends"
- Mr. Dupont resists providing KYC: "This is not my transaction"
- If the consultant firmly explains the requirement, Mr. Dupont reluctantly agrees to provide his passport
- Mr. Haddad becomes visibly uncomfortable if pressed on the nature of the relationship
- If the consultant accepts the payment without investigation, do not object

The consultant should: stop the payment process, require KYC for Mr. Dupont, request a third-party undertaking letter, investigate the loan arrangement, note multiple red flags, and escalate to the Compliance Officer.
```

---

## Usage Notes

- These scenarios are designed for AI-assisted roleplay practice
- The AI will adapt its behaviour based on the consultant's approach
- There is no single "correct" path — the scenarios test judgement and process adherence
- After each scenario, review what you did well and what you missed against the model approach
- Practice each scenario multiple times to build confidence and consistency
