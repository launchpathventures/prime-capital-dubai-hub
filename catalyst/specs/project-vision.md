# Project Vision Document
## Prime Capital Dubai — Unified Platform MVP

**Version:** 2.0  
**Date:** January 2026  
**Status:** Active  
**Phase:** MVP (Moving to Production)

---

## 1. Project Purpose & Context

### What This Project Is

This project delivers Prime Capital Dubai's complete digital infrastructure: a public-facing website that establishes market credibility, an admin system for managing content, and a learning platform for onboarding and training real estate consultants.

These three components form a single, cohesive platform built on a shared technology stack (Next.js, Supabase, Catalyst UI).

### The Problem It Solves

**For the business:**
Prime Capital is a boutique real estate advisory competing in a market dominated by high-volume agencies with loud, aggressive marketing. They need digital infrastructure that reflects their positioning—professional, restrained, trustworthy—while enabling efficient operations and scalable team growth.

Currently:
- No credible website exists for investor due diligence
- Content updates require developer intervention
- Agent onboarding relies on 2-3 day seminars with a 50-page PDF
- No mechanism to verify agent readiness before client contact
- Founders spend significant time on repetitive training delivery

**For international investors:**
Dubai real estate carries a trust deficit. Sophisticated HNW investors fear losing money to bubbles, hidden fees, developer delays, and unprofessional operators. Every touchpoint—especially the website—either confirms or contradicts these fears.

**For real estate consultants:**
New agents face cognitive overload from dense training materials, have no safe way to practise client conversations, and no clear path to demonstrating readiness.

### Context

- **Brand identity established**: Visual system and positioning defined by Duna Creative Studio ("antidote to the Dubai hustle")
- **Prototypes exist**: Client-approved website prototype and LMS wireframes ready for porting to production stack
- **Rapid go-to-market required**: Founders need to be operational quickly, with phased feature rollout
- **Technology decision made**: Catalyst UI component library, Next.js, Supabase (PostgreSQL with Row Level Security)
- **Training content exists**: 50-page training guide, objection handling guide, off-plan qualification frameworks, learning architecture documentation
- **CRM in transition**: Moving from Bitrix24 to GoHighLevel; platform must remain decoupled from CRM changes

---

## 2. North Star & Desired Outcomes

### North Star

> A unified platform where Prime Capital's public credibility, operational efficiency, and team capability reinforce each other—enabling the firm to scale without compromising its boutique positioning.

### Desired Outcomes

**For the Investor (Website User):**
- Immediately feels this agency is different from the "Dubai hustle" norm
- Understands what Prime Capital does and who it's for within one scroll
- Can evaluate the team's credibility without pressure
- Has a clear, dignified way to initiate contact or capture value (lead magnet)

**For Prime Capital (Business):**
- Generates qualified inbound leads via contact forms and lead magnet capture
- Establishes credibility for outbound and referral conversations
- Can update properties, team, and content without developer involvement
- Reduces founder time spent on repetitive training from days to hours
- Has visibility into agent knowledge and readiness

**For the Real Estate Consultant (Learner):**
- Can complete onboarding at their own pace with clear progression
- Understands what "good" looks like through practical examples
- Can practise skills safely before client interactions
- Has a searchable reference library for ongoing support
- Knows when they're ready for founder certification

**If This Project Goes Well:**
- The founders confidently share the website URL in high-stakes investor conversations
- Inbound enquiries reflect the target persona (HNW, sophisticated, international)
- Content updates happen in minutes, not days
- New agents reach productivity in 5 days instead of 2-3 weeks
- The platform becomes a durable asset requiring iteration, not replacement

---

## 3. Primary Personas & Core Needs

### Persona 1: The HNW "Smart Money" Investor

**Profile:**
- Net worth >$2M USD
- Business owner, C-suite executive, or family office representative
- Based internationally (UK, Europe, Singapore, Gulf states)
- Considering Dubai for: tax-free rental income, capital growth, Golden Visa residency

**Core Needs:**
- **Trust signals**: Proof that Prime Capital is professional, established, and discreet
- **Fear resolution**: Answers to concerns about bubbles, delays, hidden fees, and exit liquidity
- **Expertise evidence**: Demonstration that the team knows more than they do about the market
- **Low-pressure entry**: A way to engage without commitment (lead magnet, contact form)

**Jobs to Be Done:**
- "Help me understand if Dubai is right for my capital"
- "Show me you're not like the typical Dubai agent"
- "Let me do my due diligence on your firm before engaging"

### Persona 2: The Professional Referrer

**Profile:**
- Wealth manager, family office advisor, accountant, or lawyer
- Needs to recommend a Dubai real estate partner to a client
- Values discretion; will not associate with anything unsophisticated

**Core Need:**
- A website they can confidently share that makes them look good

**Job to Be Done:**
- "Validate this firm is legitimate before I stake my reputation on a referral"

### Persona 3: The New Real Estate Consultant (Nadia)

**Profile:**
- Age 25-35, sales background, new to Dubai real estate
- High smartphone comfort, can dedicate 2-3 hours daily to training
- Eager to start earning but nervous about early client interactions

**Core Needs:**
- **Clear progression**: Know what to learn and in what order
- **Practical application**: Content usable in real client situations
- **Safe practice**: Make mistakes without real-world consequences
- **Confidence**: Know when they're ready for live client contact

**Jobs to Be Done:**
- "Get me productive quickly so I can start earning"
- "Don't let me embarrass myself in my first client conversation"
- "Help me remember the regulations and processes when I need them"

### Persona 4: The Founder/Manager (Faisal)

**Profile:**
- Founding team member or senior leader
- Very limited time, currently spends 2-3 days per new agent
- Needs to maintain quality standard as team scales

**Core Needs:**
- **Leverage**: Reduce repetitive training delivery
- **Visibility**: See agent progress and identify knowledge gaps
- **Verification**: Confidence that certified agents are ready
- **Control**: Update content without developer dependency

**Jobs to Be Done:**
- "Let me spend 1 hour per agent instead of 3 days"
- "Show me who's ready and who needs more work"
- "Let me update a property listing myself"

---

## 4. Decision Principles

When trade-offs arise during delivery, use these principles:

| Principle | What It Means in Practice |
|-----------|---------------------------|
| **Trust over polish** | A slightly rougher page that feels credible beats a polished page that feels salesy. Never sacrifice tone for visual effect. |
| **Launch over completeness** | Ship with feature flags and placeholder content rather than waiting for everything to be perfect. Iterate in production. |
| **Restraint over persuasion** | No pop-ups, countdown timers, urgency tactics, or aggressive CTAs. Let quality speak. |
| **Practical over comprehensive** | Training content must be usable in live client situations. Cut anything that's "nice to know" over "need to know." |
| **Simple over clever** | Prefer straightforward implementations. Complexity creates maintenance burden and delays delivery. |
| **Mobile-functional, desktop-optimised** | HNW investors browse on desktop during due diligence. Agents learn on mobile during downtime. Both must work; desktop is the polish priority for public pages. |
| **Brand compliance is non-negotiable** | Typography (Palatino headlines, Lato body), colours (Spruce, Ash, Off White, Serenity), and tone must match the brand guide exactly. Deviation signals carelessness to sophisticated investors. |

---

## 5. MVP Success Scenarios

These scenarios define what "success" looks like for this phase:

### Scenario 1: The Skeptical Investor Due Diligence Check

**Persona:** HNW investor who received a cold outreach email  
**Trigger:** Clicks link in email to assess legitimacy

**Steps:**
1. Lands on homepage
2. Scans hero, scrolls to positioning section
3. Navigates to Team page, reviews bios
4. Checks About page for values/story
5. Returns to homepage, downloads Strategy Kit

**Success Looks Like:**
- Investor spends >90 seconds on site
- Downloads the Strategy Kit or notes contact details for follow-up
- Does not bounce at hero (no immediate red flags)

### Scenario 2: The Referrer Quick Check

**Persona:** UK-based wealth manager considering referring a client  
**Trigger:** Received Prime Capital name from network; visits site

**Steps:**
1. Scans homepage for 15-20 seconds
2. Checks footer for legitimacy signals (address, contact)
3. Possibly views one property or team bio

**Success Looks Like:**
- Site loads fast, looks premium, doesn't embarrass them
- They feel comfortable forwarding the URL to their client

### Scenario 3: The Founder Updates a Property Listing

**Persona:** Prime Capital founder  
**Trigger:** New property needs to be added to the website

**Steps:**
1. Logs into admin panel
2. Creates new property with details, specifications, images
3. Sets property to "published"
4. Views property on public site to confirm

**Success Looks Like:**
- Property appears on public site within seconds
- No developer involvement required
- Total time from login to published: under 10 minutes

### Scenario 4: The New Agent Completes Onboarding

**Persona:** New real estate consultant (Nadia)  
**Trigger:** First day at Prime Capital

**Steps:**
1. Receives login credentials for learning portal
2. Sees structured learning path with clear progression
3. Completes first competency module (Company & Positioning)
4. Takes knowledge check quiz, achieves passing score
5. Progress saved and visible to founders

**Success Looks Like:**
- Agent can work through modules at own pace on mobile
- Founders can see progress without asking
- Agent reaches "ready for founder session" status within 5 days

### Scenario 5: Agent Finds Answer During Client Call

**Persona:** Consultant mid-conversation with investor  
**Trigger:** Client asks about Golden Visa requirements

**Steps:**
1. Opens learning portal on phone
2. Searches "Golden Visa"
3. Finds relevant module/section
4. Reads answer while maintaining conversation flow

**Success Looks Like:**
- Answer found in under 60 seconds
- Information is accurate and current
- Agent handles question confidently

---

## 6. Vision vs. Current Phase Scope

### The Broader Vision

Over time, the Prime Capital platform should become:

**Website:**
- A content hub with regular market insights and educational content
- A dynamic property portal with real-time listings
- Multi-language ready (Arabic, Mandarin, Russian)
- SEO-optimised for "Dubai real estate advisory" and related terms
- Integrated with CRM for lead nurturing workflows

**Admin System:**
- Full CMS with rich content editing
- Analytics dashboard for website performance
- Lead management and routing
- Multi-user access with role-based permissions

**Learning Platform:**
- AI-powered practice simulations for client conversations
- Voice simulation for realistic roleplay
- Automated feedback on written communications
- Comprehensive quiz banks with adaptive learning
- Integration with performance data post-certification
- Peer learning and knowledge sharing features

### The Scope of This Phase (MVP)

| Component | In Scope | Out of Scope (Deferred) |
|-----------|----------|------------------------|
| **Website** | Homepage, About, Services, Team, Contact, Properties, Strategy Kit page | Blog (content only, structure ready), multi-language, SEO deep optimisation, WhatsApp integration |
| **Website** | Responsive design (mobile/tablet/desktop) | Video content, advanced animations |
| **Website** | Lead magnet capture, contact form | Newsletter system, email automation |
| **Website** | Feature flags for sections | Dynamic property search/filtering |
| **Admin** | Properties CRUD (create, read, update, delete) | Analytics dashboard |
| **Admin** | Team members CRUD | Lead management |
| **Admin** | Testimonials, stats, site settings | Audit logging |
| **Admin** | Basic authentication | Role-based permissions |
| **Admin** | Learning module management | — |
| **Admin** | Hub project/task management | — |
| **Learning** | Structured learning paths with modules | AI practice simulations |
| **Learning** | Progress tracking per user | Voice simulation |
| **Learning** | Knowledge check quizzes | Adaptive learning |
| **Learning** | Searchable content library | Artifact analysis |
| **Learning** | Founder visibility of progress | Advanced analytics |
| **Learning** | Module completion tracking | Peer learning features |
| **Hub** | Projects with status tracking | Automated notifications |
| **Hub** | Tasks with assignees and due dates | External integrations (Asana, etc.) |
| **Hub** | Questions with text and voice responses | File attachments on responses |
| **Hub** | Activity feed | Comments/threads |
| **Hub** | Reusable across future clients | White-labelling |

### Why This Focus Is Appropriate

The founders need three things operational now:

1. **A credible website** to support active sales conversations and outbound marketing
2. **Basic content control** to update properties and team without waiting for developers
3. **Structured onboarding** to reduce the time they spend on repetitive training

These three capabilities, delivered quickly and reliably, create immediate business value. Advanced features (AI simulations, analytics, multi-language) can be layered on once the foundation is solid and the team is using the platform daily.

The prototype demonstrates structure and tone; the work is to harden it to production quality on the Catalyst stack while preserving the ability to phase in advanced features.

### Independent Launch Capability

The public website, learning portal, and client hub can launch independently:

| Component | Can Launch When | Dependencies |
|-----------|-----------------|--------------|
| **Admin Panel** | Core CRUD operations functional | Supabase, Auth |
| **Client Hub** | Projects/tasks/questions functional | Supabase, Auth, Admin |
| **Learning Portal** | Learning modules defined, admin panel functional | Supabase, Auth, Admin |
| **Public Website** | Content entered via CMS, brand assets ready | Supabase, Auth, Admin |

The client hub or learning portal may go live before the public website — each has independent value. The admin panel is required for all surfaces, as it manages content, users, and configuration.

This is achieved through:
- Shared authentication (Supabase Auth) with role-based route protection
- Independent feature flags for each surface
- No hard dependencies between public pages, learning content, and hub projects

---

## 7. Non-Goals & Boundaries

### What This Project Is Not Trying to Solve

- **Lead qualification or scoring**: That's a CRM/sales process problem
- **Property transaction management**: No booking, contracts, or payments via the platform
- **Market analytics or data visualisation**: The Strategy Kit serves this need offline
- **Comprehensive SEO ranking**: Clean semantic HTML, but SEO performance optimisation is post-launch
- **Complete agent certification**: The founder coaching session remains human-delivered
- **AI-powered practice simulations**: Valuable, but deferred to avoid scope creep

### What Success Does Not Require

- Every property listing accurate and complete (placeholders acceptable)
- Blog populated with content (structure only)
- Multi-language support
- Privacy policy / terms fully written (placeholder pages acceptable)
- Every training module complete before launch (core modules sufficient)
- Sophisticated quiz question banks (basic knowledge checks sufficient)
- Perfect mobile polish (functional and dignified is the bar)

### Boundaries

**Brand:**
- Do not deviate from brand colours or typography
- Do not add urgency tactics (countdown timers, limited availability badges, pop-ups)
- Do not use stock photography of people
- Do not use salesy language or pressure tactics in any content

**Technical:**
- Do not over-engineer CMS integration—keep the data layer simple
- Do not build custom authentication when Supabase Auth suffices
- Do not add animation beyond CSS transitions
- Do not optimise prematurely—ship and measure first

**Scope:**
- Do not build blog functionality beyond page structure
- Do not integrate with CRM (forms route to Zapier; that's the boundary)
- Do not build AI simulation features in this phase
- Do not add video hosting or streaming capabilities

---

## 8. Technical Foundation

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 16 (App Router) | React-based, excellent DX, flexible rendering |
| **UI Components** | shadcn/ui + Base UI | Flexible, lightweight, copied into project for full control |
| **Styling** | Tailwind CSS | Utility-first, matches brand system |
| **Database** | Supabase (PostgreSQL) | Managed, real-time capable, built-in auth |
| **Authentication** | Supabase Auth | Simple, secure, no custom implementation |
| **File Storage** | Supabase Storage | Images, documents, consistent with data layer |
| **Forms** | Fillout.com (embedded) | Already integrated with Zapier/CRM |
| **Deployment** | Vercel | Optimised for Next.js, simple CI/CD |

**Migration note:** The website prototype currently uses Ant Design. This will be migrated to shadcn/ui to match the LMS prototype and create a unified component library across the platform.

### Data Architecture

**Core Tables:**
- `properties` — Property listings with specifications, features, images
- `team_members` — Staff profiles with bios, expertise, photos
- `services` — Service offerings with descriptions
- `testimonials` — Client quotes (anonymised as appropriate)
- `stats` — Credibility statistics (transaction volume, etc.)
- `site_settings` — Feature flags, global configuration

**Learning Tables:**
- `learning_modules` — Course content organised by competency
- `learning_progress` — User progress per module
- `quiz_questions` — Knowledge check questions
- `quiz_attempts` — User quiz submissions and scores
- `users` — Extended profile for learners (linked to Supabase Auth)

### Content Strategy

**Website Content:**
- Stored in Supabase, editable via admin panel
- Changes publish immediately (real-time via Supabase)
- Feature flags control section visibility without code changes

**Learning Content:**
- Markdown-based module content stored in database
- Structured metadata (competency, duration, prerequisites)
- Quiz questions stored separately for flexibility

**File Storage:**
- All images (properties, team headshots) uploaded directly to Supabase Storage via admin panel
- Strategy Kit PDF and downloadable resources hosted in Supabase Storage
- Files served via Supabase CDN

### Admin Users

| Role | Access | Authentication |
|------|--------|----------------|
| **Founders** | Full access to all CMS and LMS admin functions | Email/password via Supabase Auth |
| **Marketing Coordinator** | Full access to all CMS and LMS admin functions | Email/password via Supabase Auth |
| **Learners** | Access to learning portal only; accounts created by admin | Email/password via Supabase Auth |

---

## 9. Migration Approach

### Existing Repositories

Two existing repositories will be consolidated into a unified platform:

1. **Website repository** — Next.js/Tailwind with Ant Design and Supabase integration
2. **LMS prototype repository** — Next.js/Tailwind with shadcn/ui and Supabase integration

### Consolidation Strategy

The LMS prototype's technical foundation (shadcn/ui, route group patterns) becomes the base. Website functionality is migrated into this structure.

| Phase | Work |
|-------|------|
| **Component library standardisation** | Migrate website components from Ant Design to shadcn/ui |
| **Schema consolidation** | Merge Supabase table schemas from both repos |
| **Route structure** | Establish `(marketing)/`, `admin/`, `learn/`, `(auth)/` groups |
| **Admin unification** | Combine CMS admin (website) with learning admin (LMS) into single `/admin/*` |
| **Auth unification** | Single Supabase Auth implementation serving admin and learner users |
| **Hub removal** | Remove Client Hub concept; admin functions move to unified admin panel |

### Why shadcn/ui

The platform standardises on shadcn/ui rather than Ant Design because:
- Lighter weight, smaller bundle size
- Components copied into project (full customisation control)
- Less opinionated defaults align better with "quiet luxury" brand
- LMS prototype is further along; less migration work overall

### Existing Supabase Project

An existing Supabase project is in place. Schema will be extended to support both website content (properties, team, testimonials) and learning content (modules, progress, quiz attempts).

### Future Integration: Reelly.ai

**Status:** Deferred (post-MVP)

Reelly.ai is a property repository containing off-plan properties in Dubai. Future integration may enable:
- Syncing off-plan property data from Reelly.ai into the CMS
- Displaying Reelly.ai properties alongside locally-managed listings
- Reducing manual data entry for off-plan inventory

**MVP approach:** All properties managed directly in Supabase CMS. Reelly.ai integration scoped separately once core platform is stable.

---

## 10. Resolved Questions

| Question | Resolution |
|----------|------------|
| Are stats accurate or placeholder? | Managed via CMS — founders can update values directly |
| Are team members real? | Managed via CMS — founders control what's published |
| Are testimonials real? | Managed via CMS — founders control what's published |
| Which properties appear at launch? | Managed via CMS — individual items can be published/unpublished |
| Does Strategy Kit PDF exist? | Yes — hosted in Supabase Storage |
| What learning modules are required? | To be defined separately; managed via CMS |
| Quiz pass threshold? | 80% |
| Founder certification scheduling? | Manual process, outside the platform |
| Hosting infrastructure? | Vercel for frontend, existing Supabase project for backend |
| Logo and asset files? | Will be provided in correct formats (SVG, PNG) |

### Open Items (Remaining)

| Item | Component | Notes |
|------|-----------|-------|
| Website component migration | Website | Migrate Header, Footer, MobileNav, admin forms from Ant Design to shadcn/ui |
| Hub migration | Hub | Migrate projects, tasks, questions from legacy LMS repo |
| Final content for launch | Website | Stats values, team bios, properties, testimonials — entered via CMS |
| Learning module definitions | Learning | Content structure to be defined separately |
| Supabase schema consolidation | All | Merge website, LMS, and hub schemas; extend for unified admin |

---

## 11. Document Relationships

| Document | Purpose | Relationship to This Document |
|----------|---------|-------------------------------|
| **Project Vision** (this document) | Why we're building this, what success looks like | Source of truth for intent and scope |
| **Architecture Document** | Why the solution takes this shape | Explains technical and experience decisions |
| **Requirements Document** | What specifically needs to be built | Detailed specifications traceable to this vision |
| **Learning Architecture** | Structure of training content | Defines competencies, behaviours, assessment framework |
| **Learning PRD** | Detailed LMS requirements | Module specifications, simulation framework, metrics |
| **Brand Guidelines** | Visual and tonal standards | Non-negotiable constraints on all design decisions |
| **Mobile-First Design System** | Responsive development standards | Technical implementation guidance |

---

*This document should be treated as the source of truth for project intent. Implementation decisions should be traceable back to the principles and scope defined here. If a proposed change contradicts this document, pause and validate—either the change is wrong, or the vision needs explicit revision.*