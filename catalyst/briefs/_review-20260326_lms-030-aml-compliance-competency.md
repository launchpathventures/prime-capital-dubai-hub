# Brief: AML Compliance Competency (Competency 9)

**ID:** LMS-030
**Status:** Approved
**Priority:** P1 — Required for compliance training
**Surface:** LMS Content
**Estimate:** 3-4 sessions
**Tags:** lms, compliance, aml, content

---

## Objective

Create Competency 9: AML Compliance — a complete training competency covering Anti-Money Laundering, Counter-Terrorism Financing, and Proliferation Financing for Prime Capital Real Estate consultants. This is **mandatory compliance training** required by UAE law (Federal Decree-Law No. 20 of 2018) and Prime Capital's own AML/CFT Policy V.02 (Feb 2026).

Deliverables: 12 modules, 12 quizzes, ~30 audio scripts, 2 standalone scenario files (16 scenarios), 6 embedded practice scenarios.

---

## Source Materials

Two primary documents (stored in `.context/attachments/`):

### 1. AML Training for Real Estate - Training Material (1).pptx
- 89 slides of generic AML training for real estate
- Covers: ML/TF/PF definitions, FATF, UAE legal framework, KYC forms (individual & corporate), CDD/EDD, UBO identification, sanctions/screening, PEPs, risk assessment, goAML registration, STR/SAR reporting, red flags, typologies, governance
- Includes KYC form templates (individual and corporate) with field-level detail
- Includes risk rating tables (customer type, profession/industry, geography)

### 2. AML CFT Policy- Prime Capital Real Estate.pdf
- 68-page Prime Capital internal AML/CFT Policy V.02 (12 February 2026)
- **This is the authoritative source** — all training content must align with this policy
- Key Prime Capital-specific elements:
  - **Cygnus Scan** screening tool for sanctions/PEP checks
  - **Three Lines of Defence** model (Business → Compliance → Audit)
  - **Customer risk rating tables** (specific to Prime Capital — individuals by nationality/residency/employment; entities by business type)
  - **Prohibited customer types** (North Korea & Myanmar nationals, arms dealers, unlicensed hawala, drug dealing, unlicensed gambling/casino, unregistered NPOs/trusts, direct SDN links)
  - **Cash acceptance policy** — discourages cash > AED 55,000; must use bank transfers/cheques above threshold
  - **CDD review frequencies** — Low risk: every 2 years, Medium: annually, High: every 6 months
  - **ISTR/ISAR internal reporting form** (Appendix IV)
  - **60+ red flag indicators** (Appendix I) — categorised by Natural Person, Legal Person, and Transaction
  - **10 real estate ML/FT typology case studies** (Appendix III) — e.g., smurfing, rapid purchase/resale, front companies, family members as fronts, exploitation of charities
  - **FATF grey/blacklist** (Appendix II, as of June 2025)
  - **Penalty articles** (Articles 22-31) — fines AED 10,000 to AED 50,000,000, imprisonment up to 10 years
  - **TFS 4-step implementation** — Register (EOCN NAS), Screen, Implement TFS Measures, Report
  - **goAML reporting workflows** — CNMR (5 business days), PNMR (5 business days), STR/SAR, REAR
  - **Tipping off** — federal crime, fines AED 100K-500K + minimum 6 months imprisonment

---

## Content Architecture

### Competency Index

**Folder:** `content/lms/9-aml-compliance/`
**Competency file:** `_index.md`

```yaml
title: "AML Compliance"
slug: "aml-compliance"
competencyNumber: 9
description: "Anti-Money Laundering, Counter-Terrorism Financing, and Proliferation Financing compliance for real estate professionals. Master UAE regulatory requirements, Prime Capital's AML/CFT procedures, customer due diligence, sanctions screening, and suspicious activity reporting."
estimatedDuration: "6 hours"
moduleCount: 12
learningObjectives:
  - "Define money laundering, terrorist financing, and proliferation financing and their relevance to real estate"
  - "Apply Prime Capital's AML/CFT Policy and three lines of defence model"
  - "Perform KYC procedures for individual, corporate, and developer clients"
  - "Apply risk-based CDD, SDD, and EDD measures correctly"
  - "Identify PEPs and Ultimate Beneficial Owners"
  - "Conduct sanctions screening using Cygnus Scan and respond to matches"
  - "Recognise red flags and real estate ML/FT typologies"
  - "File STR/SAR, REAR, CNMR, and PNMR reports via goAML"
  - "Understand tipping off prohibitions and penalty framework"
order: 9
status: published
aiCoach:
  enabled: true
  personality: "compliance-expert"
  focus: "regulatory-precision"
```

### Module Plan (12 Modules)

Each module follows the existing format with frontmatter (title, slug, moduleNumber, competency, competencyNumber, type, description, estimatedDuration, order, status, quiz, aiCoach, learningObjectives) + markdown content.

---

#### Module 9.1: What is Money Laundering, Terrorist Financing & Proliferation Financing

**File:** `9.1-ml-tf-pf-overview.md`
**Type:** knowledge
**Duration:** 25 minutes
**Quiz:** `aml-compliance-1`
**Source material:** PPT slides 4-13, Policy sections 4.1-4.4

**Must cover:**
- Definition of ML (Federal Decree-Law No. 10 of 2025, Article 2) — the 6 acts that constitute ML crimes
- Three stages: Placement → Layering → Integration (with real estate examples for each)
- ML crimes are independent — punishment for predicate offence doesn't prevent ML prosecution
- FATF's 21 predicate offences (full list)
- Definition of Terrorist Financing — 3 components: fundraising, movement, use of funds
- Channels for TF: charities/NPOs, self-funding, fraud/theft/trafficking, hawala, crypto, cross-border cash
- Definition of Proliferation Financing (WMD) — working definitions from FATF 2021 Guidance
- PF Risk definition — breach/evasion of TFS obligations under FATF Recommendation 7
- Risks posed by ML: reputational, financial, legal, operational
- Financial crimes overview (10 types)
- Why real estate is attractive for ML (high value, relatively liquid, price manipulation possible)

**Learning objectives:**
- Define ML, TF, and PF using UAE legal definitions
- Explain the three stages of money laundering with real estate examples
- List the four categories of risk posed by money laundering
- Distinguish between ML, TF, and PF

---

#### Module 9.2: UAE Legal & Regulatory Framework

**File:** `9.2-uae-legal-framework.md`
**Type:** knowledge
**Duration:** 25 minutes
**Quiz:** `aml-compliance-2`
**Source material:** PPT slides 14-21, Policy section 5

**Must cover:**
- Federal Decree-Law No. (20) of 2018 ("the Decree Law") — primary AML/CFT legislation
- Federal Decree-Law No. (10) of 2025 — updated definitions
- Federal Decree No. (26) of 2021 — amendments
- Cabinet Decision No. (10) of 2019 — implementing regulations
- Cabinet Decision No. (74) of 2020 — terrorism lists / TFS
- Cabinet Decision No. (109) of 2023 — UBO procedures
- Cabinet Resolution No. (71) of 2024 — administrative penalties
- Circulars No. (1), (3), (4), (6) of 2025 — high-risk jurisdictions, screening, risk-based CDD
- Supplemental Guidance for Real Estate Sector
- Regulatory authorities: Central Bank AML/CFT Supervision, Ministry of Economy (supervisory authority for DNFBPs), EOCN, FIU
- FATF: role, 40 recommendations, 7 key themes
- FATF Grey List vs Black List (with current countries from Appendix II)
- Real estate agents/brokers = DNFBPs under Cabinet Decision No. 10 of 2019, Article 3
- 8 AML/CFT obligations for DNFBPs (the numbered list from PPT slide 21)

**Learning objectives:**
- Identify the primary UAE AML/CFT laws and their purpose
- Explain why real estate brokers are classified as DNFBPs
- Name the key regulatory authorities and their roles
- List the 8 core AML/CFT obligations for DNFBPs

---

#### Module 9.3: Prime Capital AML Governance & Your Role

**File:** `9.3-pc-aml-governance.md`
**Type:** knowledge
**Duration:** 20 minutes
**Quiz:** `aml-compliance-3`
**Source material:** Policy sections 2, 3, 6, 7, 21, 22, 23, 24

**Must cover:**
- Prime Capital's zero-tolerance policy statement
- Policy administration — owned by Compliance Officer, approved by Owner, reviewed annually minimum
- Three Lines of Defence model:
  - **1st Line (Business):** You — front office/sales responsible for KYC, CDD, client onboarding. This is where ML/TF is first detected.
  - **2nd Line (Compliance):** Compliance Officer/MLRO — policies, monitoring, advice, reporting STRs, liaison with regulators
  - **3rd Line (Audit):** Independent audit function — tests effectiveness of 1st and 2nd line
- Compliance Officer responsibilities (full list from Policy s.6.2 — 15 bullet points)
- Senior Management responsibilities (from Policy s.6.1)
- Bi-annual compliance reporting to Board (Policy s.6.5)
- Statutory prohibited relationships (Policy s.7) — shell banks, sanctioned persons, anonymous/fictitious names, incomplete CDD
- No retaliation policy (Policy s.21) — employees protected when reporting in good faith
- Training & awareness requirements (Policy s.22) — annual minimum, post-training assessment
- Know Your Employee (KYE) procedure (Policy s.24)
- Policy circulation requirements (Policy s.23)

**Learning objectives:**
- Explain the three lines of defence and your role in the first line
- Describe the Compliance Officer's key responsibilities
- List the prohibited business relationships at Prime Capital
- Understand your protection under the no-retaliation policy

---

#### Module 9.4: Risk Assessment & Customer Risk Rating

**File:** `9.4-risk-assessment.md`
**Type:** knowledge
**Duration:** 30 minutes
**Quiz:** `aml-compliance-4`
**Source material:** PPT slides 62-64, Policy sections 8, 10

**Must cover:**
- Risk-based approach overview — why one-size-fits-all doesn't work
- Three levels of risk assessment:
  1. Enterprise-Wide Risk Assessment (EWRA) — annual, 5 parameters (customer, geographic, delivery channel, product, transaction risk)
  2. Product/Service/New Technology risk assessment
  3. Customer Relationship (business) level risk assessment
- Customer risk factors: customer type, profession/business, country (domicile, nationality, operations), source of funds/income, transaction size/volume, screening/adverse media
- **Prime Capital's risk rating tables (CRITICAL — use exact tables from Policy s.10):**
  - **Individual clients:**
    - Low: Retired/pensioner/unemployed/salaried residing in UAE (except Syria, Sudan, Cuba, Iran, Russia)
    - Medium: Housewife/dependent/self-employed residing in UAE; salaried UAE national of Sudan/Syria/Cuba (except Iran, Russia)
    - High: Iran & Russian nationals in UAE; self-employed with high-risk business line; PEP; non-resident
  - **Entity clients:**
    - Low: Government entity, public joint company
    - Medium: Food manufacturing, car parts, furniture, café/restaurant, electronics, supermarket, clinic/pharmacy, salon
    - High: Tour & travel, PEP-owned company, consultancy, cash-intensive business, exchange house, insurance, oil & gas trading, car dealer, import/export, precious metals/luxury goods, assets management, lawyer firm, holding company, shipping, registered NPO/trust, auction house, general trading, free zone company
- **Prohibited clients (must NOT board):** North Korea & Myanmar nationals, SDN-linked, arms dealers, unregistered NPOs/trusts, drug dealing, unlicensed gambling/casino/hawala
- ML risk factors specific to real estate (8 items from Policy s.8.5): high-value cash, complex structures, third-party payments, rapid buy/resell, non-face-to-face, high-risk jurisdictions, over/under valuation, unusual source of funds
- TF risk factors (5 items): frequent low-value transactions, charitable org links, conflict zone funds, lack of economic justification, anonymous donors
- PF risk factors (4 items): sanctioned jurisdiction entities, shell/front companies, dual-use goods involvement, obscured end beneficiaries
- Cygnus Scan — automated risk assessment generation from KYC details
- National Risk Assessment (NRA) and Sectoral Risk Assessment (SRA) feed into company assessments

**Learning objectives:**
- Explain the three levels of AML/CFT risk assessment
- Classify individual and entity clients using Prime Capital's risk rating tables
- Identify the prohibited client types that must never be onboarded
- List the ML, TF, and PF risk factors relevant to real estate

---

#### Module 9.5: KYC for Individual Clients

**File:** `9.5-kyc-individuals.md`
**Type:** skills
**Duration:** 35 minutes
**Quiz:** `aml-compliance-5`
**Source material:** PPT slides 23-28, Policy section 9.3.1

**Embedded practice scenario:** Individual client hesitates when asked about source of funds — how do you handle it professionally without losing the relationship?

**Must cover:**
- KYC definition — not a one-time process; ongoing throughout business relationship
- KYC is mandatory, not optional — required before any transaction
- Key components of KYC process: understand customer type, channel (face-to-face vs not), product type, nationality, geographic presence, sanctions indicia
- KYC process flow: Identity document verification → Customer authentication → Risk assessment
- **Individual KYC form fields (all required):**
  - Name (as per ID), father/spouse name, DOB, place of birth, gender, nationality
  - Marital status, resident status (resident/non-resident)
  - Occupation type (salaried/self-employed/professional/other)
  - Service type (sell/buy/leasing/rent)
  - **Source of Funds** (critical field)
  - **Source of Wealth** (critical field)
  - Purpose of transaction
  - Emirates ID number (residents) / Passport number (non-residents) with issue/expiry dates
  - Contact details (UAE address, home country address for non-residents, mobile, email)
  - PEP declaration (yes/no, with explanation if yes)
  - Source of fund undertaking (signed declaration)
  - General undertaking statement (signed)
- **Documents to collect:**
  1. KYC form (system-based or manual)
  2. Source of fund undertaking
  3. Valid passport/visa/EID copy
  4. Valid passport/visa/EID of POA holder (if any)
  5. Source of funds document — bank statement/income proof/salary slip*
  6. Source of wealth (for PEP/high-risk)*
  7. Third-party undertaking letter + supporting docs (if any)
  - *Required for cash transactions, PEP, and high-risk customers as part of EDD
- Verification must use original, official, government-issued documents wherever possible
- For foreign nationals: documents must be legally valid in issuing jurisdiction

**Learning objectives:**
- Complete an individual KYC form with all required fields
- List the 7 documents required for individual client onboarding
- Explain the difference between source of funds and source of wealth
- Handle PEP declarations correctly

---

#### Module 9.6: KYC for Corporate & Legal Entities

**File:** `9.6-kyc-corporates.md`
**Type:** skills
**Duration:** 35 minutes
**Quiz:** `aml-compliance-6`
**Source material:** PPT slides 29-34, Policy sections 9.3.2, 9.4, 9.5

**Embedded practice scenario:** Corporate client — layered ownership structure with 3 holding companies, UBO is unclear. How do you investigate and when do you escalate?

**Must cover:**
- Corporate/Legal entity KYC form fields:
  - Full legal name, legal form, licensing authority
  - Trade license number with issue/expiry dates
  - Business address, contact details, website
  - Date/place/country of incorporation
  - Core business activities, main products/services
  - Number of subsidiaries (+ group chart)
  - Purpose of transaction
  - Source of funds (mandatory for cash/wire ≥ AED 55K and non-cash ≥ AED 300K)
  - Source of wealth, turnover details, external auditors
  - Tax identification/registration number
  - Shareholder/owner details (name + percentage holding)
  - UBO details (name, address, nationality, DOB, percentage holding)
  - Management structure (board, senior management, authorised signatories)
  - Bank details
  - AML/CFT questionnaire (if entity is a DNFBP)
  - PEP declaration for shareholders/board/senior management
  - Source of fund undertaking, general declaration
- **Documents for corporate clients (12 items):**
  1. KYC form, 2. Source of fund undertaking, 3. Valid trade license/certificate of incorporation, 4. Memorandum & Articles of Association/POA, 5. VAT registration certificate, 6. Valid IDs of owners/partners (UBOs) + POA holder, 7. Tenancy contract/address proof/utility bill, 8. Source of funds document (balance sheet/bank statement/VAT return)*, 9. Source of wealth (PEP/high-risk)*, 10. Third-party undertaking + supporting docs, 11. AML policy & procedures / AML questionnaire (if DNFBP), 12. UBO register
- **Developer onboarding** (Policy s.9.4):
  - Same core fields as corporate + developer-specific: commercial license, MOA, UBO IDs, POA for authorised signatory, tax registration certificate, signed agency agreement
- **External agency/broker onboarding** (Policy s.9.5):
  - Additional: RERA license, broker RERA card, agent-to-agent agreement
- AML/CFT questionnaire for DNFBP clients (15+ yes/no questions covering their own AML programme)
- **UBO Guidelines** reminder: 25% ownership or voting rights threshold (per Cabinet Decision 109 of 2023)
- Foreign legal persons: must state UAE legal representative's details

**Learning objectives:**
- Complete a corporate KYC form including UBO and shareholder details
- List the 12 documents required for corporate client onboarding
- Explain the additional requirements for developer and external broker onboarding
- Identify when the AML/CFT questionnaire must be completed

---

#### Module 9.7: Customer Due Diligence — SDD, CDD & EDD

**File:** `9.7-due-diligence.md`
**Type:** skills
**Duration:** 35 minutes
**Quiz:** `aml-compliance-7`
**Source material:** PPT slides 35-43, Policy sections 9.1, 9.2, 9.7

**Embedded practice scenario:** Walk-in client triggers multiple EDD indicators. Apply the correct level of due diligence and decide next steps.

**Must cover:**
- Risk-based CDD framework: Low → SDD, Medium → CDD, High → EDD (in addition to CDD)
- **Simplified Due Diligence (SDD)** — only for:
  - Public companies on stock exchange with adequate disclosure requirements
  - Government or semi-government companies
  - Firm's risk assessment confirms low risk for both customer and transaction
  - SDD measures: verify identity after establishing relationship, reduce frequency of ID updates, reduce ongoing monitoring, infer purpose from transaction type
  - **Never apply SDD when there is suspicion of ML/TF**
- **Customer Due Diligence (CDD)** — required when:
  - Any transaction on customer's name or behalf
  - Buying/selling/leasing property
  - Giving advice, information, or analysis
  - Signing any contract, agreement, LOI, MOU
  - Accepting any compensation/deposit
  - Receiving funds/proceeds from/on behalf of customer
  - Occasional transactions ≥ AED 55,000 (single or linked)
  - Suspicion of crime
  - Doubts about previously obtained ID data
- **CDD Measures (9 items from Policy s.9.2.3):**
  1. Obtain legally valid documents for foreign nationals/BOs
  2. Identify & verify customer, BOs, beneficiaries from reliable sources
  3. Background screening against sanctions, international lists, adverse media
  4. Determine purpose of business relationship; understand legal entity structure
  5. Continuously monitor transactions against risk profile
  6. Scrutinise transactions for consistency with customer knowledge
  7. Keep CDD records up to date, especially for high-risk
  8. Exercise enhanced levels for higher risk (verify source of funds)
  9. Verify identity from original government-issued documents
- **CDD timing exception:** Can verify after establishing relationship ONLY if: no suspicion, low ML/FT risk, funds held in escrow until verification complete, verification is prerequisite to closing
- **Authorised representatives** — same CDD applies; must hold valid authorising document
- **Enhanced Due Diligence (EDD)** — required for:
  - UAE non-residents
  - High-value cash transactions
  - Suspicious transactions
  - PEPs
  - Corporate customers
  - Customers from high-risk countries (FATF grey/blacklist)
  - Dealers in real estate & precious metals
  - Other cases determined by Compliance Officer
- **EDD Measures (from Policy s.9.7):**
  - Increased scrutiny and higher verification standards
  - Detailed inquiry into purpose of relationship, nature of business, source of funds
  - Identify sources of funds with detailed narrative + independent evidence (bank statements)
  - Collect information on expected transaction types, volumes, locations, timing
  - **Senior Management approval required** for establishing business relationship
  - Update customer/BO information semi-annually minimum
  - Enhanced monitoring — increased frequency, more controls, pattern selection
- **EDD risk factor categories (4):**
  1. Geography risk (high-risk country transactions)
  2. Product/services/channel risk (high-value cash, complex ownership, third-party/proxy)
  3. Transaction risk (cash, high value, crypto/virtual assets, international)
  4. Customer type risk (non-resident, high-risk business, NPO, PEP)
- **8 specific high-risk factors requiring EDD:**
  1. Customer from FATF high-risk jurisdiction or non-resident without ID
  2. PEP or foreign PEP (individual or beneficial owner)
  3. Legal entity with complex operations or unclear economic objectives
  4. Legal entity with complex structure
  5. Business relationship/transactions involving high-risk jurisdictions
  6. Cash-intensive legal entity
  7. NPOs
  8. Any other identified as high-risk through customer risk assessment
- **CDD review frequencies:**
  - Low risk: every 2 years
  - Medium risk: every 1 year
  - High risk: every 6 months

**Learning objectives:**
- Determine when to apply SDD, CDD, or EDD based on risk level
- List the 9 CDD measures Prime Capital takes
- Explain when EDD is required and what additional steps it involves
- State the CDD review frequencies for each risk category

---

#### Module 9.8: PEPs & UBO Identification

**File:** `9.8-peps-ubo.md`
**Type:** knowledge
**Duration:** 30 minutes
**Quiz:** `aml-compliance-8`
**Source material:** PPT slides 44-55, Policy sections 9.6, 9.7.1, 9.8

**Must cover:**
- **PEP definition** — persons entrusted with prominent public functions (UAE or foreign): heads of state/government, senior politicians, senior government officials, judicial/military officials, senior executives of state-owned corporations, senior officials of political parties, persons managing international organisations
- **PEP includes:**
  - Direct family: spouses, children, spouses of children, parents
  - Close associates: joint beneficial ownership, sole beneficial ownership of entity set up for PEP's benefit
  - Extended family: siblings, uncles/aunts, in-laws
- **PEP categorisation:**
  - Government roles: legislative bodies, executive bodies, diplomatic roles, judiciary, state-owned enterprises
  - Organisations: central financial institutions, armed forces (high-ranking), international sports committees
- **3 categories for Prime Capital screening:**
  - Foreign PEPs (prominent positions in foreign countries)
  - Domestic PEPs (UAE government/public sector)
  - International Organisation PEPs (senior executives of international orgs)
  - Related Persons (close associates, family members)
- **Prime Capital PEP procedures (Policy s.9.8.2):**
  a) Risk-based assessment at onboarding and throughout relationship
  b) Screening tool: **Cygnus Scan** — screens against global PEP databases at onboarding, periodically, and on new information/alerts
  c) Identification & verification: integrated into CDD; if PEP identified → EDD (verify political function, establish source of funds/wealth, understand business purpose, **obtain senior management approval**)
  d) Continuous monitoring: re-screening at regular intervals, monitoring for unusual activity
  e) Risk mitigation & escalation: all PEP relationships escalated to Compliance Officer; may be declined/terminated if transparency or legitimacy cannot be established
- **Senior management approval is mandatory for:**
  - Establishing business relationship with PEP
  - Continuing existing relationship with PEP
  - When existing customer/BO becomes or is newly identified as PEP
  - When existing PEP relationship is reviewed and CDD updated
  - Material/unusual/out-of-pattern transactions involving PEP
- Former PEPs: relationships classified as high-risk regardless
- **EDD for NPOs** (Policy s.9.7.2) — additional measures: assess NPO's own AML policies, regulatory/supervisory status, ownership/management structure (PEP involvement?), activities, donor base, geographic areas
- **UBO Identification:**
  - Cabinet Resolution No. 58 of 2020 — beneficial ownership framework
  - Cabinet Decision No. 109 of 2023 — updated UBO definition
  - UBO = 25% or more ownership (shareholding) OR 25% or more voting rights (direct or indirect)
  - If multiple persons share ownership that aggregates to 25% → all treated as owners/controllers
  - If no natural person identified through ownership → person exercising control through other means
  - If still no natural person → highest-ranking management official = UBO
  - Exemptions: entities directly/indirectly wholly owned by federal/emirate government; entities listed on regulated stock exchange (Europe, US, UK, GCC) — but must document evidence of disclosure requirements
  - **Escalation:** If each legal person/arrangement owns <25% but common ownership could aggregate ≥25%, escalate to Compliance Officer

**Learning objectives:**
- Define who qualifies as a PEP including family members and close associates
- Explain the mandatory senior management approval requirements for PEP relationships
- Determine the UBO of a legal entity using the 25% threshold and fallback rules
- Describe the additional EDD measures for NPOs

---

#### Module 9.9: Sanctions, Screening & Targeted Financial Sanctions

**File:** `9.9-sanctions-screening.md`
**Type:** skills
**Duration:** 35 minutes
**Quiz:** `aml-compliance-9`
**Source material:** PPT slides 51-60, Policy sections 11, 12, 13

**Embedded practice scenario:** Screening returns a partial name match on the UN Consolidated List during a transaction. Walk through the PNMR process step by step.

**Must cover:**
- What are sanctions/blacklists — persons/entities sanctioned by international regulators for fraud, crime, terrorism, ML, narcotics
- Sanctions lists: UN Consolidated List, UAE Local Terrorist List, OFAC, EU, HM Treasury, Canada
- Importance of screening: security, reputation, regulatory compliance
- **Prime Capital screening operations (Policy s.11.2):**
  - Search customer databases, transaction parties, potential customers, beneficial owners, people with direct/indirect relationships, directors/agents/POA holders
  - Continuously search before any transaction or business relationship
- **Cygnus Scan** — real-time screening of customer names against all applicable sanctions lists
  - System must be updated with latest lists
  - Existing customers regularly re-screened
  - Sanctioned customer transactions reported to FIU
- **Key identifiers for screening:**
  - Natural persons: name, DOB, nationality, ID/passport number, last known address
  - Legal persons: entity/company name, trade license number, address of registration, address of branches
- **Screening approach:**
  1. Ownership/control rule — entities >50% owned/controlled by listed person = sanctioned
  2. Fuzzy matching — detect close variations in spelling, phonetics, formatting
  3. Weak aliases — assess inclusion based on risk profile
- **Understanding screening results:**
  - Confirmed match: all key identifiers match → freeze and report
  - Partial/potential match: some identifiers match, can't confirm or rule out → suspend and report
  - False positive: on examination, not the same person → document internally, no external report
  - Negative match: no match found
- **Targeted Financial Sanctions (TFS):**
  - Definition: asset freezing + prohibition on making funds/services available
  - Purpose: deny means to violate international peace, support terrorism, finance WMD proliferation
  - Scope: UAE Local Terrorist List + UNSC Consolidated List
  - Freezing measures apply indefinitely until delisting or EOCN cancellation
  - **Other sanctions lists** (OFAC, HMT, EU) — match → escalate to Compliance Officer/supervisory authority
- **TFS 4-Step Implementation:**
  1. **Register** — Prime Capital registered with EOCN Notification Alert System (NAS) for automated updates
  2. **Screen** — Upon list updates (within 24 hours), before onboarding, KYC reviews, before transactions, daily database screening
  3. **Implement TFS Measures:**
    - Confirmed match → freeze all funds/assets within 24 hours (no prior notice), prohibit making any funds/services available
    - Permitted additions (interest, payments under pre-existing contracts) must be immediately frozen upon receipt
  4. **Report** — via goAML within 5 business days
- **TFS targets:** listed individuals/entities/groups, entities owned/controlled by listed persons, entities acting on behalf of listed persons
- **Prohibited business relationships** with sanctioned targets from: UAE Local Terrorist List, UN Consolidated List, EU, UK HMT, OFAC, EOCN NAS, Security Council Committee
- **Screening during weekends/holidays** — procedures must be in place; if no transactions occur, screening starts immediately on next business day
- **Obligations regarding other sanctions regimes** (Policy s.13): STR/SAR to FIU for suspicious activities not involving UN/UAE list matches; CNMR/PNMR for UN/UAE list matches; consult CO for OFAC/EU/HMT/INTERPOL matches
- **Lifting of freezing measures:** only when designated person is delisted from sanctions lists or EOCN communicates cancellation through goAML

**Learning objectives:**
- Explain the difference between confirmed match, partial match, and false positive
- Walk through the TFS 4-step implementation process
- Describe when and how to freeze assets upon a confirmed sanctions match
- List the sanctions lists Prime Capital screens against

---

#### Module 9.10: Red Flags & Real Estate ML/FT Typologies

**File:** `9.10-red-flags-typologies.md`
**Type:** skills-script
**Duration:** 30 minutes
**Quiz:** `aml-compliance-10`
**Source material:** PPT slides 73-79, Policy Appendix I and Appendix III

**Embedded practice scenario:** Client shows 3 red flags during onboarding — identify them and decide whether to proceed, apply EDD, or escalate to Compliance Officer.

**Must cover:**
- **Red flag indicators** are not proof of ML/TF but indicate need for further investigation or EDD
- **Natural Person red flags (from Policy Appendix I — include ALL):**
  - Reluctant to provide personal information or explain business activities, beneficial owner, source of wealth/funds, reason for activities, transaction partners, third-party dealings
  - Interested in foreign company formation in low-tax/secrecy jurisdictions without commercial explanation
  - Conducting transactions incompatible with socio-economic/professional profile
  - Signatory to multiple companies without explanation
  - Unusual interest in facilitating other party's business arrangements
  - Insists on intermediary for all interactions without justification
  - Actively avoids personal contact
  - Foreign national with no significant dealings in country, no clear economic rationale for real estate transaction
  - Refuses to cooperate or provide information/documents
  - Makes unusual requests (especially relating to secrecy)
  - PEP or familial/professional associations with PEP
- **Legal Person/Arrangement red flags (ALL):**
  - Cannot demonstrate real business activity history
  - Not findable on internet/LinkedIn
  - Directors/shareholders/BOs also found as representatives of other legal persons (professional nominees)
  - Registered under name not matching activity
  - Name appears to mimic high-profile multinational corporations
  - Public/non-professional email domain (Gmail, Hotmail, Yahoo)
  - Registered at address not matching profile or not locatable on maps
  - Incorporated in high ML/TF risk jurisdiction
  - Incorporated where BO reporting not required
  - Unnecessarily complex corporate structure
  - Unusually large number of beneficiaries/controlling interests/signatories
  - Registered at shared address (mailbox service indicator)
  - Directors/shareholders cannot be located or contacted
- **Transaction red flags (ALL — extensive list):**
  - Questionable connections between parties
  - No apparent business/trade rationale
  - Family member involvement without legitimate reason
  - Repeat transactions between same parties
  - Third-party financing without logical explanation
  - Loans from private third parties without documentation
  - Funds from entity going into liquidation/receivership
  - Business account used for personal purchases
  - Complicated routing without explanation
  - Transfer of real property natural→legal person off-market
  - Multiple large cash payments on loan/mortgage
  - Early loan/mortgage repayment (especially with penalties)
  - Involves persons linked to criminal activities
  - Several linked transactions (same parties, nationality, address, representatives)
  - Not interested in better price/payment terms
  - Strong interest in completing quickly without good cause
  - Interest in specific area without caring about price
  - Foreign/non-resident for tax purposes
  - Capital investment only (no intention to live/lease)
  - Large-scale operations (buying large plots, complete buildings)
  - Intermediaries acting for groups of associated individuals/entities
  - Unusual contractual terms
  - Funds from/to foreign country with no apparent connection or from low-tax/offshore jurisdiction
  - Recently created legal entities with large amounts vs assets
  - Cash collateral used for loan shortly after property purchase
  - Unexplained use of POA/delegation processes
  - Persons in tax havens/high-risk countries with matching transaction characteristics
  - Minors/incapacitated persons as transaction parties
  - Foundations/cultural/leisure/NPOs with mismatched transaction goals
  - Companies mainly owned by foreign nationals (may not be resident for tax)
  - Real estate contributed to company with no registered address/permanent establishment
  - Parties acting on behalf of hidden real customer
  - Unexplained last-minute identity/ownership changes
  - No particular interest in property characteristics (quality, construction, handover date)
  - Intermediaries who are foreign or non-resident for tax
  - Unnecessarily complex transactions making BO identification difficult
  - Numbers/sizes/types inconsistent with expected activity
  - Far larger than declared income/turnover
  - Changes in ownership of legal entities/real estate with unclear rationale and/or third-party involvement with unclear source of funds
  - Payments from third parties whose relationship is unclear
  - Business structures involving high-risk countries without clear reasons
  - Cannot explain source of funds or explanation lacks credibility
  - CDD measures cannot be performed / customer provides false/misleading/forged documentation
  - Large cash amounts without adequate explanation
- **Means of Payment red flags:**
  - Cash/negotiable instruments not stating true payer
  - Amount of such instruments significant relative to transaction value
  - Divided into smaller parts with short intervals
  - Doubts about validity of loan application documents
  - Loan granted/attempted using cash collateral deposited abroad
- **Other red flags:**
  - Contract cancellation penalising buyer (loss of deposit if sale doesn't proceed)
  - Subsequent additional transactions on same property in rapid succession with significant price changes
  - Agreed value significantly different from market value
  - Property development in high-risk area (economic/environmental)
  - Recording sale of building plot followed by declaration of completed building in unrealistically short time
  - Private contract with no intention to notarise/register
- **10 Real Estate ML/FT Typology Case Studies (from Policy Appendix III):**
  1. Concealing source of illicit funds through real estate purchases (Hungarian tax fraud → real estate)
  2. Cash transport, exchange houses, and real estate to conceal drug trafficking proceeds (Croatia)
  3. Smurfing — cash/cashier's cheques to conceal illicit source (US attorney, $177,500 cash, hockey players)
  4. Successive transactions for ML purposes (lawyer, shell companies, bearer shares, land reclassification)
  5. Asian national — restaurant purchase with mortgage, repaid from spouse's account with cross-border transfers to China (human smuggling network)
  6. Misuse of real estate agent to gain bank introduction for terrorist financing (offshore trust, Belgium)
  7. Family members as front for purchasing property (Canadian criminal, parents' names, mortgage paid in 6 months)
  8. Exploitation of legitimate charity (Individual A, cash deposits, power of attorney, charity → property → STR)
  9. Company used to launder money through real estate purchase and sale (East European, Belgian bank, voluntary liquidation, repurchase at higher price)
  10. Abuse of notary's client account (company purchased property, cheques cashed through notary, sole shareholder = drug trafficker)

**Learning objectives:**
- Identify red flags across natural persons, legal entities, and transactions
- Recognise the common real estate ML/FT typologies from case studies
- Determine appropriate response to red flags (investigate, apply EDD, escalate, or reject)
- Distinguish between red flags that require immediate escalation vs further monitoring

---

#### Module 9.11: Reporting — goAML, STR/SAR, REAR, ISTR

**File:** `9.11-reporting.md`
**Type:** skills
**Duration:** 30 minutes
**Quiz:** `aml-compliance-11`
**Source material:** PPT slides 66-72, 80, Policy sections 16, 17

**Embedded practice scenario:** You suspect ML based on client behaviour. Walk through the internal reporting chain from ISTR to Compliance Officer to external STR/SAR via goAML.

**Must cover:**
- **goAML registration** — Prime Capital's portal for all FIU reporting
- **Internal reporting — ISTR/ISAR (Policy s.17.2):**
  - ALL employees must submit ISTR to Compliance Officer upon discovering suspicious activity
  - Submit as soon as suspicion is established, no later than 24 hours
  - No minimum threshold or monetary value
  - Use Prime Capital's internal SAR/STR form (Appendix IV): client name, representative, address, phone, email, business/occupation, passport/ID/trade license, nationality, business location, nature/amount of suspected transactions, connected accounts, reason for suspicion, CO instructions
  - After submission: CO reviews circumstances, determines if external report required, documents rationale either way
- **External reporting — STR/SAR (Policy s.16, 17.3):**
  - Filed on goAML platform
  - Required for any suspicious transactions/activities NOT involving confirmed/partial matches to UAE Local Terrorist List or UN Consolidated List
  - CO must notify FIU without delay, within 24 hours of determining suspicion
  - No minimum threshold
  - Red flags ≠ automatic ML/TF but indicate EDD or further investigation needed
  - After STR filing: follow FIU instructions, classify customer as high-risk immediately, implement enhanced monitoring, delay transaction execution where possible (without tipping off)
  - All STR documents kept minimum 5 years from closing of investigation
- **Confirmed Name Match Report (CNMR) (Policy s.17.4):**
  - Required when confirmed match to sanctions list
  - Existing customer: freeze assets within 24 hours, prohibit services/fund transfers, submit CNMR via goAML within 5 business days
  - Potential customer: reject transaction, submit CNMR within 5 business days
  - Must include: full name + ID documents, amount of frozen funds/assets + proof, description of rejected transaction/freezing actions
- **Partial Name Match Report (PNMR) (Policy s.17.5):**
  - Required when partial match — can't confirm or rule out
  - Existing customer: suspend transactions immediately, withhold funds/assets/services, submit PNMR via goAML within 5 business days, maintain suspension until EOCN responds (false positive → lift, confirmed → freeze + CNMR)
  - Potential customer: attempt to obtain ID within 10 business days; if obtained → re-screen and act accordingly; if not obtained → reject transaction, submit PNMR within 5 business days
- **Real Estate Activity Report (REAR) (Policy s.17.1):**
  - Required for purchase/sale of freehold real estate with:
    - Single physical cash transaction ≥ AED 55,000 (or linked transactions), or
    - Payment via virtual asset (any amount), or
    - Funds converted from virtual asset
  - Must obtain/record: Emirates ID or passport copy, receipts/invoices/contracts, purchase & sale agreement
  - Submit via FIU goAML platform
  - If buyer/seller is legal person: trade license, articles of association, register of BOs, Emirates ID/passport for all BOs and shareholders
- **Information Requests from FIU (RFI) (Policy s.17.6):**
  - Company obliged to provide any additional information requested, accurately and promptly
- **Difference between CNMR/PNMR and STR/SAR:**
  - CNMR/PNMR = confirmed/partial match to designated person on sanctions list
  - STR/SAR = identified red flags or suspicion reasons, does NOT involve confirmed/partial name match
  - CNMR/PNMR relates to established legal relationship with designated person/party (e.g., POA)
  - STR/SAR does NOT involve established legal relationship with designated person

**Learning objectives:**
- Complete Prime Capital's internal SAR/STR form (ISTR/ISAR)
- Explain the difference between STR/SAR, CNMR, PNMR, and REAR
- Walk through the reporting timeline: suspicion → ISTR → CO review → external report
- State the deadlines for each report type (24 hours for STR, 5 business days for CNMR/PNMR)

---

#### Module 9.12: Tipping Off, Cash Policy, Record Keeping & Penalties

**File:** `9.12-tipping-off-penalties.md`
**Type:** knowledge
**Duration:** 20 minutes
**Quiz:** `aml-compliance-12`
**Source material:** PPT slide 81, Policy sections 18, 19, 20, 25

**Must cover:**
- **Tipping Off (Policy s.18):**
  - **It is a federal crime** to inform a client or any third party that a suspicious transaction report has been filed, will be filed, or that an investigation is underway
  - Applies to all employees, senior managers, officials, and staff — directly or indirectly
  - Penalties: fines AED 100,000 to AED 500,000 AND imprisonment of at least 6 months
  - Non-compliance = criminal offense + termination
  - Company must: maintain strict confidentiality of STR content and the act of reporting, implement system controls (access restrictions, secure communication), train staff
  - **When CDD itself would tip off:** if CDD measures would alert customer to investigation → do NOT apply CDD, notify FIU immediately via STR/SAR with reasons CDD was not performed
  - All suspicious transactions kept fully confidential
- **Cash Acceptance Policy (Policy s.19):**
  - Company discourages accepting cash > AED 55,000 per transaction
  - Above threshold: must use traceable payment methods (bank transfers, cheques)
  - Bank transfers and cheques are standard/encouraged forms of payment
  - Comprehensive KYC and CDD for all transactions
  - EDD for high-risk cases (PEPs, unusual transaction patterns)
  - REAR reporting required for qualifying cash transactions
- **Record Keeping (Policy s.20):**
  - Maintain accurate and complete records to comply with UAE AML/CFT regulations
  - Records include: CDD documents (identification, BO details, source of funds, risk assessments), transaction records (contracts, title deeds, payment evidence), internal records of STRs filed to FIU
  - AML/CFT programme documentation: staff training logs, compliance reviews, correspondence with authorities
  - **Minimum retention: 5 years** from end of business relationship or date of transaction
  - Records must be kept securely and remain accessible
  - Proper record-keeping supports: transparency, investigations, mitigating legal/regulatory risks
- **Penalties for Money Laundering (Policy s.25) — Federal Decree-Law No. 20 of 2018:**
  - **Article 22(1):** ML acts under Article 2 → imprisonment up to 10 years AND fine AED 100,000 to AED 5,000,000
  - **Aggravated ML:** Fine AED 300,000 to AED 10,000,000 if perpetrator abuses professional position, crime through NPO, crime through organised group, or recidivism
  - **Article 22(2):** Attempted ML → full penalty prescribed
  - **Article 22(3):** Using proceeds for TF → life imprisonment or 10+ years AND fine AED 300,000 to AED 10,000,000
  - **Article 22(4):** Using proceeds to finance illegal organisations → imprisonment + fine ≥ AED 300,000
  - **Article 22(5):** Courts may reduce/exempt sentence if offender provides information leading to disclosure/prosecution/arrest
  - **Article 23(1):** Legal persons (companies) → fine AED 500,000 to AED 50,000,000
  - **Article 23(2):** TF conviction → dissolution and closure
  - **Article 24:** Failure to report (Article 15) → imprisonment + fine AED 100,000 to AED 1,000,000
  - **Article 25:** Tipping off → imprisonment ≥ 6 months + fine AED 100,000 to AED 500,000
  - **Article 25 bis:** Possessing/concealing funds with evidence of illegality → imprisonment ≥ 3 months + fine ≥ AED 50,000
  - **Article 26 bis:** Violating Article 16 bis → imprisonment ≥ 6 months + fine AED 200,000 to AED 5,000,000
  - **Article 28:** Violating TFS directives → imprisonment + fine AED 50,000 to AED 5,000,000
  - **Article 31:** Any other violation → imprisonment + fine AED 10,000 to AED 100,000
  - Company may also take disciplinary action including termination

**Learning objectives:**
- Define tipping off and explain why it is a federal crime
- State Prime Capital's cash acceptance threshold and approved payment methods
- List the types of records that must be retained and for how long
- Identify the penalty ranges for key AML/CFT violations

---

## Quiz Plan (12 Quizzes)

Each quiz file lives in `content/lms/quizzes/` with the naming convention `aml-compliance-{n}.md`.

| Quiz | Covers Module | Related Module Field | Questions |
|------|--------------|---------------------|-----------|
| `aml-compliance-1` | 9.1 ML/TF/PF Overview | `9.1-ml-tf-pf-overview` | 5 |
| `aml-compliance-2` | 9.2 UAE Legal Framework | `9.2-uae-legal-framework` | 5 |
| `aml-compliance-3` | 9.3 PC AML Governance | `9.3-pc-aml-governance` | 5 |
| `aml-compliance-4` | 9.4 Risk Assessment | `9.4-risk-assessment` | 5 |
| `aml-compliance-5` | 9.5 KYC Individuals | `9.5-kyc-individuals` | 5 |
| `aml-compliance-6` | 9.6 KYC Corporates | `9.6-kyc-corporates` | 5 |
| `aml-compliance-7` | 9.7 CDD/SDD/EDD | `9.7-due-diligence` | 5 |
| `aml-compliance-8` | 9.8 PEPs & UBO | `9.8-peps-ubo` | 5 |
| `aml-compliance-9` | 9.9 Sanctions/TFS | `9.9-sanctions-screening` | 5 |
| `aml-compliance-10` | 9.10 Red Flags/Typologies | `9.10-red-flags-typologies` | 5 |
| `aml-compliance-11` | 9.11 Reporting | `9.11-reporting` | 5 |
| `aml-compliance-12` | 9.12 Tipping Off/Penalties | `9.12-tipping-off-penalties` | 5 |

All quizzes: 80% pass rate (4/5 correct), explanations for each answer.

---

## Audio Script Plan (~30 scripts)

### Competency Intro (1)
| File | Duration | Content |
|------|----------|---------|
| `_index.audio.md` | 2-3 min | Welcome to AML Compliance, why this matters for your career and Prime Capital, what you'll learn |

### Module Intros (12)
One per module, 60-90 seconds each, following existing intro pattern.

### Demo Scripts (5) — Weak/Strong Pattern
| Module | File | Duration | Demo Focus |
|--------|------|----------|------------|
| 9.5 | `9.5-kyc-individuals.demo.md` | 8-10 min | Weak: rushing through KYC form, missing source of funds. Strong: professional questioning that builds trust |
| 9.6 | `9.6-kyc-corporates.demo.md` | 8-10 min | Weak: accepting corporate docs at face value, missing UBO. Strong: tracing ownership structure methodically |
| 9.7 | `9.7-due-diligence.demo.md` | 8-10 min | Weak: applying standard CDD to high-risk client. Strong: recognising EDD triggers and escalating properly |
| 9.9 | `9.9-sanctions-screening.demo.md` | 8-10 min | Weak: ignoring partial name match, proceeding with transaction. Strong: suspending, documenting, PNMR within 5 days |
| 9.10 | `9.10-red-flags-typologies.demo.md` | 8-10 min | Weak: missing 3 red flags in a transaction. Strong: spotting flags, applying EDD, escalating to CO |

### Walkthrough Scripts (3)
| Module | File | Duration | Walkthrough Focus |
|--------|------|----------|-------------------|
| 9.7 | `9.7-due-diligence.walkthrough.md` | 5-7 min | Step-by-step: determining SDD vs CDD vs EDD for 4 different client scenarios |
| 9.9 | `9.9-sanctions-screening.walkthrough.md` | 5-7 min | Step-by-step: screening result → confirmed/partial/false positive → reporting workflow |
| 9.11 | `9.11-reporting.walkthrough.md` | 5-7 min | Step-by-step: suspicion → ISTR → CO review → STR/SAR via goAML (complete chain) |

---

## Scenario Plan (2 files, 16 scenarios)

### File 1: `content/lms/scenarios/aml-onboarding.md`

```yaml
title: "AML Onboarding Scenarios"
slug: "aml-onboarding"
type: "scenario"
description: "AI roleplay training for client onboarding with AML complications"
competencies: ["aml-compliance"]
difficulty: "mixed"
estimatedDuration: "4-5 hours"
scenarioCount: 8
```

| # | Title | Core Challenge | Competency Modules |
|---|-------|----------------|-------------------|
| AML-01 | The Grey List Cash Buyer | HNI from FATF grey-list country wants to pay cash. Apply EDD, source of funds, geographic risk assessment | 9.4, 9.5, 9.7 |
| AML-02 | The Shell Company Maze | Corporate buyer with 3 layered holding companies. Identify UBO, determine when to escalate | 9.6, 9.8 |
| AML-03 | The Invisible Client | Client sends POA holder, refuses to meet. Assess non-face-to-face risk, verify authorised representative | 9.5, 9.7 |
| AML-04 | The Minister's Wife | PEP's spouse buying under own name. Identify PEP family connection, obtain senior management approval | 9.8, 9.7 |
| AML-05 | The Cash Deposit | Client wants to pay AED 200K cash deposit. Apply cash acceptance policy, explain threshold, file REAR | 9.12, 9.11 |
| AML-06 | The Expired Documents | Returning client with expired IDs wants to transact urgently. Handle KYC renewal, CDD timing rules | 9.5, 9.7 |
| AML-07 | The Charitable Foundation | NPO purchasing commercial property. Apply NPO EDD measures, assess donor base and activities | 9.8, 9.7 |
| AML-08 | The Third-Party Payer | Someone other than the buyer wants to pay with no clear relationship. Investigate source, assess red flags | 9.10, 9.5 |

### File 2: `content/lms/scenarios/aml-red-flags.md`

```yaml
title: "AML Red Flags & Response Scenarios"
slug: "aml-red-flags"
type: "scenario"
description: "AI roleplay training for recognising and responding to suspicious activity in real estate"
competencies: ["aml-compliance"]
difficulty: "mixed"
estimatedDuration: "4-5 hours"
scenarioCount: 8
```

| # | Title | Core Challenge | Competency Modules |
|---|-------|----------------|-------------------|
| AML-09 | The Quick Flip | Client buys property, sells at loss within 2 months. Recognise rapid purchase/resale typology, consider ISTR | 9.10, 9.11 |
| AML-10 | The Overpayer | Buyer insists on paying significantly above market value. Investigate over-valuation red flag, economic rationale | 9.10, 9.11 |
| AML-11 | The Partial Match | Screening returns partial match on UN sanctions list during transaction. Execute PNMR process, suspend, report within 5 days | 9.9, 9.11 |
| AML-12 | The Loose Lips | Colleague mentions a client's STR to another agent. Recognise tipping off violation, understand it's a crime | 9.12 |
| AML-13 | The Pushy Developer | Developer onboarding — can't verify UBO, pressure to proceed. Apply prohibited relationships rules, know when to walk away | 9.6, 9.8, 9.4 |
| AML-14 | The Structured Payments | Client structures multiple linked transactions below AED 55K. Recognise smurfing/structuring, transaction monitoring | 9.10, 9.11 |
| AML-15 | The Foreign Cash Buyer | Foreign national, no UAE ties, buying multiple units with cash. Multiple red flags converging — escalate to CO | 9.10, 9.4, 9.7 |
| AML-16 | The Confirmed Match | Confirmed name match discovered during active transaction. Execute 24-hour freeze, CNMR via goAML within 5 days | 9.9, 9.11 |

---

## Embedded Practice Scenarios (6)

These go in the module's `practice_scenario` JSON field in frontmatter:

| Module | Scenario Title | Format |
|--------|---------------|--------|
| 9.5 | "The Reluctant Source of Funds" | Roleplay — client hesitates, you must get the information professionally |
| 9.6 | "The Ownership Puzzle" | Roleplay — trace UBO through complex corporate structure |
| 9.7 | "The Risk Triage" | Decision tree — 4 clients, determine SDD/CDD/EDD for each |
| 9.9 | "The Screening Alert" | Decision tree — partial match appears, walk through response steps |
| 9.10 | "The Three Red Flags" | Spot-the-flags — onboarding scenario with hidden indicators |
| 9.11 | "Suspicion to Report" | Process simulation — complete ISTR and walk through reporting chain |

---

## Implementation Order

### Phase 1: Foundation (Session 1)
1. Create folder `content/lms/9-aml-compliance/` + `audio/` subfolder
2. Write `_index.md` (competency index)
3. Write `_index.audio.md` (competency intro audio)
4. Write modules 9.1, 9.2, 9.3, 9.4 (knowledge foundations)
5. Write quizzes `aml-compliance-1` through `aml-compliance-4`
6. Write audio intros for 9.1-9.4

### Phase 2: KYC & Due Diligence (Session 2)
7. Write modules 9.5, 9.6, 9.7, 9.8 (skills-heavy)
8. Write quizzes `aml-compliance-5` through `aml-compliance-8`
9. Write audio intros for 9.5-9.8
10. Write demo scripts for 9.5, 9.6, 9.7
11. Write walkthrough script for 9.7

### Phase 3: Sanctions, Red Flags & Reporting (Session 3)
12. Write modules 9.9, 9.10, 9.11, 9.12
13. Write quizzes `aml-compliance-9` through `aml-compliance-12`
14. Write audio intros for 9.9-9.12
15. Write demo scripts for 9.9, 9.10
16. Write walkthrough scripts for 9.9, 9.11

### Phase 4: Scenarios (Session 3 or 4)
17. Write `content/lms/scenarios/aml-onboarding.md` (8 scenarios)
18. Write `content/lms/scenarios/aml-red-flags.md` (8 scenarios)

---

## Quality Checklist

- [ ] Every fact is traceable to either the PPT or the Policy document
- [ ] All Prime Capital-specific procedures reference the Policy (not generic advice)
- [ ] Risk rating tables match Policy s.10 exactly
- [ ] Prohibited customer types match Policy exactly
- [ ] Penalty amounts match Federal Decree-Law articles exactly
- [ ] FATF grey/blacklist countries match Policy Appendix II (June 2025)
- [ ] All 60+ red flag indicators from Appendix I are included in Module 9.10
- [ ] All 10 typology case studies from Appendix III are included in Module 9.10
- [ ] Cash threshold is AED 55,000 (not AED 55K or any other amount)
- [ ] CDD review frequencies: Low=2yr, Medium=1yr, High=6mo
- [ ] Screening tool is Cygnus Scan (not generic "screening system")
- [ ] TFS deadlines: freeze within 24 hours, report via goAML within 5 business days
- [ ] ISTR to CO: no later than 24 hours
- [ ] STR to FIU: without delay, within 24 hours of determining suspicion
- [ ] Tipping off penalties: AED 100K-500K + minimum 6 months imprisonment
- [ ] Every module has a quiz with 5 questions and 80% pass rate
- [ ] No critical AML/CFT content from either source document is missing
- [ ] Module content follows existing format (frontmatter + markdown)
- [ ] Audio scripts follow existing patterns (intro/demo/walkthrough with correct tags)
- [ ] Scenarios follow existing format (situation, persona, objective, challenges, model approach, AI simulation prompt)

---

## Files to Create

| File | Type |
|------|------|
| `content/lms/9-aml-compliance/_index.md` | Competency index |
| `content/lms/9-aml-compliance/_index.audio.md` | Competency intro audio |
| `content/lms/9-aml-compliance/9.1-ml-tf-pf-overview.md` | Module |
| `content/lms/9-aml-compliance/9.2-uae-legal-framework.md` | Module |
| `content/lms/9-aml-compliance/9.3-pc-aml-governance.md` | Module |
| `content/lms/9-aml-compliance/9.4-risk-assessment.md` | Module |
| `content/lms/9-aml-compliance/9.5-kyc-individuals.md` | Module |
| `content/lms/9-aml-compliance/9.6-kyc-corporates.md` | Module |
| `content/lms/9-aml-compliance/9.7-due-diligence.md` | Module |
| `content/lms/9-aml-compliance/9.8-peps-ubo.md` | Module |
| `content/lms/9-aml-compliance/9.9-sanctions-screening.md` | Module |
| `content/lms/9-aml-compliance/9.10-red-flags-typologies.md` | Module |
| `content/lms/9-aml-compliance/9.11-reporting.md` | Module |
| `content/lms/9-aml-compliance/9.12-tipping-off-penalties.md` | Module |
| `content/lms/9-aml-compliance/audio/9.1-ml-tf-pf-overview.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.2-uae-legal-framework.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.3-pc-aml-governance.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.4-risk-assessment.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.5-kyc-individuals.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.5-kyc-individuals.demo.md` | Audio demo |
| `content/lms/9-aml-compliance/audio/9.6-kyc-corporates.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.6-kyc-corporates.demo.md` | Audio demo |
| `content/lms/9-aml-compliance/audio/9.7-due-diligence.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.7-due-diligence.demo.md` | Audio demo |
| `content/lms/9-aml-compliance/audio/9.7-due-diligence.walkthrough.md` | Audio walkthrough |
| `content/lms/9-aml-compliance/audio/9.8-peps-ubo.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.9-sanctions-screening.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.9-sanctions-screening.demo.md` | Audio demo |
| `content/lms/9-aml-compliance/audio/9.9-sanctions-screening.walkthrough.md` | Audio walkthrough |
| `content/lms/9-aml-compliance/audio/9.10-red-flags-typologies.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.10-red-flags-typologies.demo.md` | Audio demo |
| `content/lms/9-aml-compliance/audio/9.11-reporting.intro.md` | Audio intro |
| `content/lms/9-aml-compliance/audio/9.11-reporting.walkthrough.md` | Audio walkthrough |
| `content/lms/9-aml-compliance/audio/9.12-tipping-off-penalties.intro.md` | Audio intro |
| `content/lms/quizzes/aml-compliance-1.md` | Quiz |
| `content/lms/quizzes/aml-compliance-2.md` | Quiz |
| `content/lms/quizzes/aml-compliance-3.md` | Quiz |
| `content/lms/quizzes/aml-compliance-4.md` | Quiz |
| `content/lms/quizzes/aml-compliance-5.md` | Quiz |
| `content/lms/quizzes/aml-compliance-6.md` | Quiz |
| `content/lms/quizzes/aml-compliance-7.md` | Quiz |
| `content/lms/quizzes/aml-compliance-8.md` | Quiz |
| `content/lms/quizzes/aml-compliance-9.md` | Quiz |
| `content/lms/quizzes/aml-compliance-10.md` | Quiz |
| `content/lms/quizzes/aml-compliance-11.md` | Quiz |
| `content/lms/quizzes/aml-compliance-12.md` | Quiz |
| `content/lms/scenarios/aml-onboarding.md` | Scenario file |
| `content/lms/scenarios/aml-red-flags.md` | Scenario file |

**Total: 46 files**

---

## Acceptance Criteria

- [ ] All 12 modules created with correct frontmatter and comprehensive content
- [ ] All 12 quizzes created with 5 questions each, 80% pass rate, explanations
- [ ] All 30 audio scripts created following existing patterns (intro/demo/walkthrough)
- [ ] Both scenario files created with 8 scenarios each (16 total)
- [ ] 6 embedded practice scenarios included in module frontmatter
- [ ] Content syncs successfully to Supabase via existing pipeline
- [ ] No critical AML/CFT content missing from either source document
- [ ] All Prime Capital-specific details (Cygnus Scan, risk tables, prohibited types, ISTR form, etc.) correctly referenced
- [ ] Quality checklist above passes
