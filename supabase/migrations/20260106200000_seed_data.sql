-- CATALYST - Seed Data Migration
-- 
-- Inserts minimal test data for development and initial launch:
-- - 6 core competencies
-- - 2-3 sample learning modules per competency
-- - 2-3 sample properties
-- - 2-3 team members
-- - Sample testimonials and stats
--
-- This data enables immediate testing and demonstration

-- =============================================================================
-- Competencies (The 6 Core Areas)
-- =============================================================================

INSERT INTO competencies (slug, name, description, display_order) VALUES
(
  'market-intelligence',
  'Market Intelligence',
  'Master Dubai''s real estate landscape: regulations, market dynamics, developer reputations, and the distinction between ready properties and off-plan investments. Build the foundation of credibility that HNW investors expect.',
  1
),
(
  'client-discovery',
  'Client Discovery',
  'Learn to uncover what clients truly need—not just what they say they want. Identify investment goals, risk tolerance, and hidden concerns that drive decision-making.',
  2
),
(
  'property-matching',
  'Property Matching',
  'Connect client requirements to the right opportunities. Learn to present properties in ways that align with investment objectives and address specific concerns.',
  3
),
(
  'transaction-management',
  'Transaction Management',
  'Navigate the Dubai property purchase process: from reservation to completion. Understand documentation, timelines, payment schedules, and the entities involved (DLD, Oqood, escrow).',
  4
),
(
  'objection-navigation',
  'Objection Navigation',
  'Address the eight core fears HNW investors bring to Dubai real estate: bubble concerns, payment security, liquidity, developer stability, remote management, legitimacy, delays, and hidden fees.',
  5
),
(
  'relationship-stewardship',
  'Relationship Stewardship',
  'Build long-term client relationships beyond the first transaction. Learn post-completion follow-up, referral generation, and maintaining trust through market changes.',
  6
);

-- =============================================================================
-- Sample Learning Modules
-- =============================================================================

-- Market Intelligence Modules
INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'dubai-market-overview',
  'Dubai Real Estate Market Overview',
  '# Dubai Real Estate Market Overview

## Introduction

Dubai''s real estate market is unique in the global landscape. Understanding its structure, regulations, and dynamics is essential for advising HNW investors.

## Key Market Characteristics

- **Freehold vs Leasehold**: Designated areas where foreigners can own property outright
- **Developer Dominance**: Major developers (Emaar, Meraas, Damac) shape market supply
- **Off-Plan Prevalence**: 60-70% of transactions involve properties under construction
- **Payment Plans**: Extended payment schedules make high-value properties accessible

## Regulatory Framework

- **Dubai Land Department (DLD)**: Oversees all property transactions
- **RERA**: Regulates real estate practice and practitioners
- **Oqood System**: Registration system for off-plan properties

## Market Cycles

Dubai real estate moves in cycles. Understanding past patterns helps contextualize current opportunities without making predictions about the future.

## Next Steps

Complete the knowledge check to verify your understanding of Dubai market fundamentals.',
  25,
  1
FROM competencies c WHERE c.slug = 'market-intelligence';

INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'off-plan-vs-ready',
  'Off-Plan vs Ready Properties',
  '# Off-Plan vs Ready Properties

## Understanding the Distinction

This is one of the most important concepts in Dubai real estate advising. Clients often conflate these two very different investment types.

## Off-Plan Properties

**Definition**: Properties purchased during construction, before completion.

**Characteristics**:
- Payment plans (typically 60/40 or 70/30 during construction)
- Lower initial capital requirement
- Potential for capital appreciation during construction
- Completion risk (delays, quality concerns)
- Developer reputation is critical

## Ready Properties

**Definition**: Completed properties available for immediate occupancy or rental.

**Characteristics**:
- Full payment or mortgage required
- Immediate rental income potential
- Known quality and condition
- Market-rate pricing (no payment plan discount)
- Lower completion risk

## Advising Approach

Never assume you know which type suits a client. Discovery questions reveal their risk profile, cash flow needs, and timeline.

## Next Steps

The knowledge check will present scenarios where you must identify which property type better serves specific client needs.',
  20,
  2
FROM competencies c WHERE c.slug = 'market-intelligence';

-- Client Discovery Modules
INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'discovery-framework',
  'The Discovery Framework',
  '# The Discovery Framework

## The Problem with Premature Solutions

Most agents hear "I''m interested in a two-bedroom apartment" and immediately start showing two-bedroom apartments. This is backwards.

## The Discovery Sequence

1. **Investment Goals**: Why are they looking at Dubai? (Capital preservation, growth, yield, diversification)
2. **Risk Tolerance**: What keeps them up at night? (The 8 fears framework)
3. **Liquidity Needs**: When might they need to exit?
4. **Cash Flow Requirements**: Income now or capital appreciation later?
5. **Management Preferences**: Hands-on or hands-off?

## Open-Ended Questions

- "What prompted you to consider Dubai real estate?"
- "Walk me through what a successful outcome looks like for you."
- "What concerns, if any, do you have about investing remotely?"

## What You''re Listening For

- Stated needs vs underlying needs
- Emotional drivers (security, legacy, control)
- Deal-breakers vs preferences

## Next Steps

Practice scenarios in the knowledge check will test your ability to identify what a client is really asking for.',
  30,
  1
FROM competencies c WHERE c.slug = 'client-discovery';

-- Transaction Management Modules
INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'purchase-process',
  'Dubai Property Purchase Process',
  '# Dubai Property Purchase Process

## From Interest to Completion

Understanding the complete transaction flow allows you to set accurate expectations and prevent client anxiety.

## Off-Plan Purchase Flow

1. **Reservation**: Client pays booking fee (typically 5-10% of property value)
2. **Sales Agreement**: Sign SPA with developer, register intent with DLD
3. **Oqood Registration**: DLD issues Oqood (interim title deed)
4. **Construction Payments**: Follow payment plan schedule (verified by developer)
5. **Completion**: Final payment, handover, receive title deed

## Ready Property Purchase Flow

1. **Offer**: Submit offer through agent (with initial deposit)
2. **Memorandum of Understanding (MOU)**: Agreement between buyer and seller
3. **No Objection Certificate (NOC)**: Developer confirms no outstanding fees
4. **Transfer at DLD**: Both parties present at Land Department for title transfer
5. **Title Deed**: Issued same day at DLD

## Key Documents

- **Title Deed**: Proof of ownership
- **Oqood**: Interim registration for off-plan
- **Sales & Purchase Agreement (SPA)**: Contract with developer
- **No Objection Certificate (NOC)**: Required for resale properties

## Timeline Expectations

- Off-plan: 2-4 years from purchase to completion (developer dependent)
- Ready property: 7-14 days from offer to title transfer

## Next Steps

The knowledge check will test your understanding of required documents and process sequences.',
  25,
  1
FROM competencies c WHERE c.slug = 'transaction-management';

-- Objection Navigation Modules
INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'the-eight-fears',
  'The Eight Fears Framework',
  '# The Eight Fears Framework

## Why This Matters

HNW investors considering Dubai real estate carry eight core fears. Your job isn''t to dismiss these fears—it''s to address them with evidence and structure.

## The Eight Fears

1. **Bubble Concern**: "Isn''t Dubai real estate overheated?"
2. **Payment Security**: "How do I know my money is safe during construction?"
3. **Liquidity**: "Can I actually sell when I need to?"
4. **Developer Stability**: "What if the developer goes bankrupt?"
5. **Remote Management**: "How do I manage property from abroad?"
6. **Legitimacy**: "Do foreigners actually own property, or is it a lease?"
7. **Delay Risk**: "What if construction is delayed indefinitely?"
8. **Hidden Fees**: "What am I not being told about costs?"

## Your Approach

For each fear:
1. **Acknowledge**: "That''s a valid concern—let''s address it directly."
2. **Evidence**: Provide specific mechanisms (escrow, Oqood, DLD)
3. **Boundaries**: Be honest about what you can''t guarantee

## Never

- Dismiss concerns as unfounded
- Make promises about future market performance
- Claim zero risk

## Next Steps

The knowledge check presents client objections. You''ll practice identifying which fear is being expressed and selecting appropriate responses.',
  30,
  1
FROM competencies c WHERE c.slug = 'objection-navigation';

-- Relationship Stewardship Modules  
INSERT INTO learning_modules (competency_id, slug, title, content, duration_minutes, display_order)
SELECT 
  c.id,
  'post-completion-stewardship',
  'Post-Completion Stewardship',
  '# Post-Completion Stewardship

## Beyond the Transaction

Most agents disappear after completion. You won''t. Post-completion stewardship is where lifetime client value is built.

## The 90-Day Check-In

Within 90 days of completion, reach out:
- "How''s the property meeting your expectations?"
- "Any questions about property management or rental process?"
- "Would you like an introduction to our property management partners?"

## Annual Market Updates

Once per year, proactively share:
- Market performance in their property''s area
- Comparable sales data (how their investment is performing)
- Any regulatory changes that affect them

**No ask, no pitch**—just value.

## Referral Generation

Earned, never asked for:
- "If you know anyone considering Dubai property, I''d be happy to provide the same level of service."

Wait until after they''ve experienced your stewardship. Asking too early damages trust.

## Long-Term Relationship Signals

- Remember personal details (family, business, preferences)
- Respond within 24 hours to any inquiry
- Offer help even when there''s no transaction involved

## Next Steps

The knowledge check tests your judgment on appropriate post-completion touchpoints and communication timing.',
  20,
  1
FROM competencies c WHERE c.slug = 'relationship-stewardship';

-- =============================================================================
-- Sample Properties
-- =============================================================================

INSERT INTO properties (
  slug, title, type, location, developer,
  price_from, price_to,
  bedrooms_from, bedrooms_to,
  size_from, size_to,
  completion_date,
  description,
  features,
  published,
  display_order
) VALUES
(
  'emaar-beachfront-residence',
  'Emaar Beachfront Residence',
  'apartment',
  'Dubai Harbour',
  'Emaar Properties',
  2500000,
  8500000,
  1,
  4,
  850,
  3200,
  '2026-12-31',
  'Luxury waterfront living at Dubai Harbour. Direct beach access, marina views, and world-class amenities in Emaar''s flagship beachfront development.

## Location

Dubai Harbour represents the next evolution of waterfront living in Dubai. Located between Dubai Marina and Palm Jumeirah, the development offers unparalleled connectivity and lifestyle amenities.

## Developer

Emaar Properties is Dubai''s most established developer, with a 25-year track record including Dubai Mall, Burj Khalifa, and Dubai Marina.

## Investment Highlights

- Beachfront location with private beach access
- Payment plan: 60/40 during construction
- Completion Q4 2026
- High rental yield potential (5-7% projected)
- Strong secondary market liquidity',
  '["Private beach access", "Marina berths available", "Infinity pool", "Gym and spa", "24/7 concierge", "Smart home integration", "Residents'' lounge", "Children''s play area"]',
  true,
  1
),
(
  'meraas-bluewaters-penthouse',
  'Bluewaters Residences Penthouse',
  'penthouse',
  'Bluewaters Island',
  'Meraas',
  15000000,
  28000000,
  3,
  5,
  4500,
  8500,
  '2025-06-30',
  'Ultra-luxury penthouse living with unobstructed views of Ain Dubai and the Arabian Gulf. Limited collection of residences on Bluewaters Island.

## Location

Bluewaters Island is a man-made island off the coast of JBR, home to Ain Dubai (world''s largest observation wheel) and a curated collection of high-end residences.

## Developer

Meraas is Dubai''s boutique luxury developer, known for City Walk, La Mer, and Bluewaters. They prioritize quality over volume.

## Investment Highlights

- Ready property (immediate occupancy)
- Resale opportunity with 20% below original launch price
- Full ownership (freehold)
- Proven rental market (short-term and annual)
- Unique location with limited future supply',
  '["Panoramic sea views", "Private elevator", "Rooftop terrace", "Chef''s kitchen", "Master suite with spa bathroom", "Home office", "Smart home system", "Two parking spaces", "Storage room"]',
  true,
  2
),
(
  'damac-hills-townhouse',
  'DAMAC Hills 2 Townhouse',
  'townhouse',
  'DAMAC Hills 2',
  'DAMAC Properties',
  1200000,
  1800000,
  3,
  4,
  2100,
  2800,
  '2026-03-31',
  'Family-oriented townhouse community with schools, parks, and recreational facilities. Suburban living with urban connectivity.

## Location

DAMAC Hills 2 is a master-planned community offering a balance between privacy and amenities. Located near Dubai Sports City with easy access to Al Qudra Road.

## Developer

DAMAC Properties is one of Dubai''s largest developers with over 44,000 completed units across the region.

## Investment Highlights

- Affordable entry point for Dubai real estate
- Family-friendly community amenities
- Payment plan: 70/30 (70% during construction)
- Completion Q1 2026
- Strong demand from owner-occupiers',
  '["Private garden", "Community pool", "Children''s play areas", "Skate park", "Outdoor cinema", "Sports facilities", "Retail center", "Schools nearby", "Pet-friendly"]',
  true,
  3
);

-- =============================================================================
-- Sample Team Members
-- =============================================================================

INSERT INTO team_members (
  slug, name, role, bio,
  expertise,
  email, phone, linkedin_url,
  published, display_order
) VALUES
(
  'omar-hassan',
  'Omar Hassan',
  'Founder & Principal Advisor',
  'Omar founded Prime Capital Dubai after observing a gap in the market: HNW investors needed an advisory partner, not a transactional agent.

With 12 years in Dubai real estate and a background in private wealth management, Omar brings an investor''s perspective to property advisory. He has advised on over $200M in transactions across off-plan, secondary market, and commercial properties.

## Philosophy

"Most agents sell properties. We help investors make decisions. That distinction matters."

## Background

- Previously: Director at a family office managing MENA real estate allocations
- CFA Level II Candidate
- Guest lecturer at Dubai Real Estate Institute

## Languages

English, Arabic, French',
  '["Off-Plan Advisory", "Portfolio Strategy", "Developer Due Diligence", "HNW Client Relations"]',
  'omar@primecapitaldubai.com',
  '+971 50 XXX XXXX',
  'https://linkedin.com/in/omar-hassan-example',
  true,
  1
),
(
  'sara-mitchell',
  'Sara Mitchell',
  'Senior Consultant',
  'Sara joined Prime Capital in 2022 after relocating from London, where she worked in luxury residential sales in Knightsbridge and Mayfair.

Her expertise lies in helping international clients navigate Dubai''s unique property landscape, particularly those accustomed to mature markets like London, New York, or Singapore.

## Approach

Sara specializes in translating client requirements across markets—understanding what "comparable to Mayfair" actually means in a Dubai context.

## Background

- 8 years in luxury property (4 years London, 4 years Dubai)
- BSc Real Estate Management, University College London
- Speaks regularly at MENA property investment forums

## Languages

English, Spanish',
  '["Luxury Residential", "International Client Advisory", "Market Transition Guidance", "Investment Comparison Analysis"]',
  'sara@primecapitaldubai.com',
  '+971 50 XXX XXXX',
  'https://linkedin.com/in/sara-mitchell-example',
  true,
  2
),
(
  'alex-nguyen',
  'Alex Nguyen',
  'Investment Analyst',
  'Alex provides quantitative analysis supporting Prime Capital''s advisory practice. He builds financial models, tracks market data, and produces the research that informs client recommendations.

Before joining Prime Capital, Alex worked in real estate investment banking and private equity, focusing on GCC markets.

## Focus Areas

- Comparative yield analysis
- Developer financial health assessment  
- Market cycle analysis
- Risk-adjusted return modeling

## Background

- Previously: Analyst at a Dubai-based real estate PE fund
- MSc Finance, London School of Economics
- Contributes to Prime Capital''s quarterly market reports

## Languages

English, Vietnamese, Mandarin',
  '["Financial Modeling", "Market Analysis", "Developer Research", "Risk Assessment"]',
  'alex@primecapitaldubai.com',
  '+971 50 XXX XXXX',
  'https://linkedin.com/in/alex-nguyen-example',
  true,
  3
);

-- =============================================================================
-- Sample Testimonials
-- =============================================================================

INSERT INTO testimonials (quote, author_name, author_title, author_location, published, display_order) VALUES
(
  'Omar and his team helped us navigate our first Dubai property purchase with clarity and patience. No pressure, just expertise. That''s rare in this market.',
  'Private Client',
  'Family Office Principal',
  'London, UK',
  true,
  1
),
(
  'We''ve worked with several Dubai agents over the years. Prime Capital is the first that felt more like a trusted advisor than a salesperson. The difference showed in the outcome.',
  'Michael Chen',
  'Investment Director',
  'Singapore',
  true,
  2
),
(
  'The post-completion support was unexpected and appreciated. Most agents disappear after closing. Prime Capital stayed engaged, which made all the difference when we decided to expand our portfolio.',
  'Private Client',
  'Entrepreneur',
  'Los Angeles, USA',
  true,
  3
);

-- =============================================================================
-- Sample Stats
-- =============================================================================

INSERT INTO stats (label, value, display_order) VALUES
('Transaction Volume', '$250M+', 1),
('Properties Delivered', '180+', 2),
('Client Retention', '94%', 3),
('Average Client Tenure', '4.2 years', 4);

-- =============================================================================
-- Sample Site Settings
-- =============================================================================

INSERT INTO site_settings (key, value) VALUES
(
  'features',
  '{"properties": true, "team": true, "testimonials": true, "blog": false}'::jsonb
),
(
  'metadata',
  '{"site_title": "Prime Capital Dubai", "site_description": "Boutique real estate advisory for discerning investors. We move complexity out of sight.", "contact_email": "hello@primecapitaldubai.com", "contact_phone": "+971 4 XXX XXXX"}'::jsonb
);
