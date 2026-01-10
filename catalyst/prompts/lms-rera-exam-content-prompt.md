# RERA Exam Competency Content Generation

**For GitHub Copilot Agents generating Competency 8: RERA Exam Preparation**

---

## Context

This competency prepares consultants to pass the mandatory DLD RERA Brokers Exam. The exam:
- Draws 40 random questions from a bank of **566 official questions**
- Allows **60 minutes** to complete
- Requires **75%** (30 correct) to pass

The full question bank is available in `data/rera-question-bank.json` with categories.

---

## Module Structure

Each module should follow the standard LMS format from `catalyst/prompts/lms-content-generation-prompt-v3.md`:

1. **YAML Frontmatter** — Full metadata including AI coach context
2. **Learning Objective** — What the learner will be able to do
3. **Why This Matters** — Connection to exam success
4. **Core Content** — Key concepts organized by exam relevance
5. **Key Points to Remember** — Exam-focused summaries
6. **Common Exam Traps** — Frequent mistakes on these questions
7. **Practice Questions** — Sample questions from the bank
8. **Key Takeaways** — 3-5 bullet summary

---

## Module Specifications

### 8.1 RERA Exam Overview (`8.1-exam-overview.md`)

**Type:** Knowledge

**Must Cover:**
- Exam format details (40 questions, 60 mins, 75% pass)
- Registration process at Dubai Real Estate Institute (DREI)
- Exam fees (AED 772.50 per broker, AED 1,545 for two)
- What to bring on exam day (Emirates ID, confirmation)
- Question distribution by category
- Retake policy and waiting period
- Study timeline recommendations

---

### 8.2 Ethics & Code of Conduct (`8.2-ethics-compliance.md`)

**Type:** Knowledge + Practice

**Must Cover:**
- Broker duties to clients (loyalty, equity, confidentiality)
- Professional Ethics Charter requirements
- Disclosure obligations
- What constitutes a breach of ethics
- Commission rules and restrictions
- Confidentiality after contract ends
- Disciplinary actions and consequences

**Key Questions to Address (from bank):**
- Q1-17 (Ethics fundamentals)
- Q88-89 (Contract validity)
- Q243, Q260 (Code of ethics definitions)

**Common Exam Traps:**
- "Breaching privacy includes revealing reason for sale" — FALSE (Q3)
- "Unethical to report unregistered brokers" — FALSE (Q9)
- "Guaranteeing ROI is OK" — FALSE (Q10)

---

### 8.3 RERA Regulations & Licensing (`8.3-regulations-licensing.md`)

**Type:** Knowledge + Practice

**Must Cover:**
- Broker card types (blue card restrictions)
- Licensing requirements
- Marketing restrictions (portal permits, cold calling ban)
- Advertising requirements (Trakheesi permit)
- Broker classification factors
- Violations and fines (AED 50,000 for unlicensed practice)
- Complaint registration process (RVS system)

**Key Questions to Address (from bank):**
- Q18-24 (Licensing basics)
- Q34-35 (Portal listing requirements)
- Q43 (Fines for violations)
- Q107, Q117-121 (Marketing rules)
- Q276 (Broker classification)

**Critical Numbers to Memorize:**
- AED 50,000 — Fine for unlicensed brokerage
- AED 500,000 — Fine for escrow violations by developers
- AED 772.50 — Exam fee per broker

---

### 8.4 Landlord & Tenant Law (`8.4-landlord-tenant.md`)

**Type:** Knowledge + Practice

**Must Cover:**
- Ejari registration requirements
- Eviction notice periods (12 months for personal use, 30 days for non-payment)
- Rent increase rules (RERA index, 90-day notice)
- Sublease rules (requires landlord consent)
- Rental Dispute Center (RDC) jurisdiction
- Lease renewal rights
- Tenancy contracts under/over 10 years

**Key Questions to Address (from bank):**
- Q25-27 (Eviction rules)
- Q36 (Notice to tenant after sale)
- Q379-410 (Comprehensive rental law)
- Q434-437 (True/False on leasing)

**Critical Numbers to Memorize:**
- 12 months — Eviction notice for personal use
- 30 days — Eviction notice for non-payment
- 90 days — Rent increase notification
- 10 years — Ejari vs Registration Trustee threshold
- 3 years — Restriction on re-leasing after personal use eviction (commercial)
- 2 years — Restriction on re-leasing after personal use eviction (residential)

---

### 8.5 Property Registration & Transfer (`8.5-property-registration.md`)

**Type:** Knowledge + Practice

**Must Cover:**
- DLD registration fees (4% of property value)
- Mortgage registration fees (0.25% of loan value)
- Title deed issuance process
- Registration Trustee vs Property Trustee roles
- Document requirements (Emirates ID, POA)
- NOC process and costs
- Digital services (Dubai REST app)
- Property status inquiry

**Key Questions to Address (from bank):**
- Q30, Q262 (Fee calculations)
- Q41, Q53-54, Q56 (Various DLD fees)
- Q116, Q222 (Trustee types)
- Q147, Q454-461 (Digital services)
- Q265-266, Q268 (Transfer process)

**Critical Numbers to Memorize:**
- 4% — DLD transfer fee (2% buyer, 2% seller)
- 0.25% — Mortgage registration fee
- AED 250 — Title deed fee
- AED 100 — Site map fee
- AED 50 — "To whom it may concern" certificate
- 1 sqm = 10.76 sqft — Area conversion

---

### 8.6 Off-Plan Sales & Escrow (`8.6-offplan-escrow.md`)

**Type:** Knowledge + Practice

**Must Cover:**
- Oqood registration system
- Escrow account requirements
- Developer obligations
- SPA (Sale Purchase Agreement) requirements
- Project cancellation/termination rules
- Buyer protection under Law 6 of 2019
- Area variation rules (5% margin)
- Payment plan structures

**Key Questions to Address (from bank):**
- Q20, Q39, Q50 (Escrow accounts)
- Q29 (Developer obligations under Law 6)
- Q37 (Termination forfeiture rules)
- Q42 (Escrow violation fines)
- Q46, Q275 (Oqood registration)
- Q91, Q258 (Area variation)

**Critical Numbers to Memorize:**
- 60 days — Developer must register sale in Oqood
- 5% — Area variation margin
- 40% — Maximum forfeiture if project 60%+ complete
- AED 500,000 — Fine for escrow violations
- 10 years — Structural defect warranty

---

### 8.7 Valuation & Calculations (`8.7-valuation-calculations.md`)

**Type:** Skills + Practice

**Must Cover:**
- Three approaches to valuation (Cost, Income, Comparison)
- CMA (Comparative Market Analysis) methodology
- DLD fee calculations with worked examples
- Service charge calculations (balcony at 25%)
- Commission split calculations
- Area conversions (sqm to sqft)
- Mortgage/equity calculations
- Rental yield calculations

**Key Questions to Address (from bank):**
- Q209, Q472-550 (All calculation questions)
- Q267, Q270, Q413 (CMA adjustments)
- Q411, Q417-421 (Valuation approaches)
- Q426 (Capitalization method)

**Calculation Formulas:**
```
DLD Transfer Fee = Property Value × 4%
Mortgage Registration = Loan Amount × 0.25%
Service Charge (Balcony) = Area × Rate × 0.25
Sqft = Sqm × 10.76
Equity = Market Value - Mortgage Balance
Yield = (Annual Rent / Property Value) × 100
```

**Worked Examples Required:**
1. DLD fees for AED 2M property (Answer: AED 80,000)
2. Service charge for 1500 sqft unit + 200 sqft balcony @ AED 15/sqft
3. Commission split 3:2 on AED 900,000 sale @ 5%
4. Area conversion 150 sqm to sqft

---

### 8.8 Exam Strategies & Time Management (`8.8-exam-strategies.md`)

**Type:** Skills

**Must Cover:**
- Time allocation (90 seconds per question)
- Question reading strategies
- Eliminating wrong answers
- True/False question patterns
- "All of the above" question strategies
- Calculation question approach
- When to guess vs skip
- Managing exam anxiety
- Day-before preparation
- Exam day checklist

**Key Patterns to Recognize:**
- Questions with "always" or "never" often have exceptions
- "All answers are correct" is frequently the answer
- True/False questions test specific rule knowledge
- Calculation questions require careful unit attention

---

## File Naming Convention

```
content/lms/8-rera-exam-prep/
├── _index.md                    (already created)
├── 8.1-exam-overview.md
├── 8.2-ethics-compliance.md
├── 8.3-regulations-licensing.md
├── 8.4-landlord-tenant.md
├── 8.5-property-registration.md
├── 8.6-offplan-escrow.md
├── 8.7-valuation-calculations.md
└── 8.8-exam-strategies.md
```

---

## Frontmatter Template

```yaml
---
title: "Module Title"
slug: "module-slug"
moduleNumber: "8.X"
competency: "rera-exam-prep"
competencyNumber: 8
duration: "45 min"
type: "Knowledge + Practice"
videos: []
resources: []
prev: "previous-slug"
next: "next-slug"
keywords: ["rera exam", "broker certification", "topic keywords"]
relatedModules: ["broker-licensing", "regulatory-framework"]
prerequisites: ["broker-licensing"]
commonQuestions:
  - "How many questions are on the RERA exam?"
  - "What topics should I focus on?"
aiCoach:
  enabled: true
  personality: "exam-coach"
  coachingPoints:
    - "Focus on understanding, not memorization"
    - "Practice with timed questions"
---
```

---

## Quality Standards

1. **Exam-Focused:** Every piece of content should help pass the exam
2. **Question References:** Include specific question numbers from the bank
3. **Critical Numbers:** Highlight numbers that must be memorized
4. **Common Traps:** Warn about frequently missed questions
5. **Practice Integration:** Include sample questions in each module
6. **Clear Structure:** Use tables, lists, and callouts for scanning

---

## References

- Question bank: `data/rera-question-bank.json`
- Main prompt: `catalyst/prompts/lms-content-generation-prompt-v3.md`
- Existing compliance module: `content/lms/0-foundations/0.3-broker-licensing.md`
- Transaction modules: `content/lms/5-transaction-management/`
