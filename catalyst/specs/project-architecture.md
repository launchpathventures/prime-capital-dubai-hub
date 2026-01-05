# Project Architecture Document
## Prime Capital Dubai — Unified Platform MVP

**Version:** 2.0  
**Date:** January 2026  
**Companion to:** Project Vision Document v2.0

---

## 1. Inputs & Discovery Summary

### What Informed This Direction

**Brand Strategy & Positioning (Duna Creative)**

The brand blueprint established Prime Capital's positioning as the "antidote to the Dubai hustle"—a boutique advisory that earns trust through restraint, expertise, and discretion. This wasn't aesthetic guidance alone; it defined the emotional register the entire platform must achieve. The strategy explicitly named the eight fears of HNW investors (bubbles, delays, hidden fees, liquidity, stability, legitimacy, remote management) and positioned the brand as their resolution.

**Design System & Visual Language**

A comprehensive design system provided exact specifications for colour, typography, spacing, and component behaviour. The "quiet luxury" principle—substance over shine—translated into specific constraints: generous whitespace, muted colour palette (Spruce, Ash, Serenity, Off White), serif headlines (Palatino), light-weight body copy (Lato 300), and no visual noise. These constraints apply across all three platform components.

**Existing Prototype Work**

Two functional prototypes exist and received client approval:
- **Website prototype**: Demonstrates page structure, content flow, and brand tone
- **LMS prototype**: Demonstrates learning path structure, module navigation, and progress tracking

Both prototypes share the same technical foundation (Next.js, Tailwind, Supabase), confirming the consolidation approach.

**Training Content Audit**

Existing training materials (50-page guide, objection handling guide, off-plan qualification frameworks) revealed that new agents face cognitive overload from dense, seminar-based delivery. The learning architecture work identified six core competencies and defined a behaviour-focused approach that connects knowledge to observable client-facing actions.

**Stakeholder Constraints**

- Founders require rapid go-to-market—weeks, not months
- No external marketing team; the platform must be low-maintenance once live
- Founders currently spend 2-3 days per new agent on training delivery
- CRM is transitioning from Bitrix24 to GoHighLevel; the platform must remain decoupled
- Real photography may not be ready for launch; graceful placeholders needed

**Infrastructure Context**

An existing Supabase project with table schemas from prototype work. Forms already built in Fillout.com and connected via Zapier. This existing infrastructure should be leveraged, not rebuilt.

---

## 2. Key Insights & Patterns Identified

### Insight 1: Trust Is Earned in the First Scroll

**What We Learned**

HNW investors make rapid judgements about legitimacy. The first 10-15 seconds on the homepage determine whether they continue or bounce. This isn't about "grabbing attention"—it's about not triggering scepticism.

**Why It Matters**

The homepage hero and immediate scroll content carry disproportionate weight. Any element that feels generic, aggressive, or inconsistent with the premium positioning will confirm the user's pre-existing scepticism about Dubai real estate.

**How It Influenced Direction**

The homepage opens with the brand's core promise ("We move complexity out of sight") rather than property listings or calls-to-action. Trust-building precedes selling. The same restraint principle applies to the entire platform—no pop-ups, no urgency tactics, no aggressive CTAs anywhere.

---

### Insight 2: The Referrer Is a Gatekeeper

**What We Learned**

Many HNW investors encounter Prime Capital through a professional intermediary—a wealth manager, family office advisor, or lawyer. These referrers check the website before recommending it to clients. Their bar is different: they need to feel confident the site won't embarrass them.

**Why It Matters**

A referrer's 15-second scan is a different journey than an investor's 90-second due diligence. Both must be served. The referrer needs immediate signals of legitimacy (professional design, real address, no gimmicks) without requiring deep engagement.

**How It Influenced Direction**

Footer contains full contact details and physical address on every page. Navigation is clean and conventional. No elements that would make a professional hesitate to share the URL with their client.

---

### Insight 3: Properties Are Proof, Not Product

**What We Learned**

The properties page serves a different function for Prime Capital than it does for a high-volume agency. These aren't listings to be searched and compared—they're evidence of access, taste, and market position.

**Why It Matters**

Building a sophisticated property search system would be premature and potentially counterproductive. The current phase needs to demonstrate portfolio quality, not enable self-service property discovery.

**How It Influenced Direction**

Properties are presented as a curated portfolio, not a searchable database. Filtering is minimal. The experience emphasises quality over quantity. Properties can be toggled off entirely via the CMS if content isn't ready.

---

### Insight 4: Training Fails When It's a Firehose

**What We Learned**

The current 2-3 day seminar based on a 50-page document creates cognitive overload. Agents retain approximately 20% at 30 days. They forget critical details between training and application. There's no mechanism to verify readiness before client contact.

**Why It Matters**

Unprepared agents damage the brand's carefully cultivated positioning. One pushy interaction or compliance error undermines the "antidote to the Dubai hustle" promise. Scaling the team requires a training approach that doesn't require founder presence for every new hire.

**How It Influenced Direction**

The learning system is structured as modular, self-paced content organised by competency. Each module connects to observable behaviours in client situations. Knowledge checks verify understanding before progression. Founders gain visibility into readiness without spending days in training delivery.

---

### Insight 5: Content Control Is a Daily Need, Not a Monthly One

**What We Learned**

Properties change status. Team members join or leave. Statistics update. Testimonials are approved. In the current state, every content change requires developer involvement. This creates bottlenecks and delays.

**Why It Matters**

A website that can't be updated becomes stale and loses credibility. A learning platform that can't adapt to new content becomes irrelevant. The founders and marketing coordinator need direct control over content without technical barriers.

**How It Influenced Direction**

The admin system enables real-time content updates that publish immediately. No staging or approval workflow—when someone updates a property, it appears on the public site within seconds. This simplicity is intentional; complexity can be added later if needed.

---

### Insight 6: One Platform, Not Three Products

**What We Learned**

The website, admin system, and learning platform could be built as separate products. But the user base overlaps (founders use all three), the brand must be consistent across all, and the data relationships are interconnected (properties displayed on website and referenced in training).

**Why It Matters**

Separate products create maintenance burden, potential brand drift, and authentication complexity. A unified platform on a shared stack reduces overhead and ensures consistency.

**How It Influenced Direction**

All three components share the Catalyst UI foundation, Supabase backend, and deployment infrastructure. Route structure cleanly separates concerns (`/admin/*`, `/learn/*`, public pages) while sharing authentication and design system.

---

## 3. Core Design & Experience Decisions

### Decision 1: Homepage as Trust Narrative, Not Property Showcase

**Choice Made**

The homepage leads with brand positioning and trust-building content before introducing properties. The first property content appears only after the user has scrolled past the hero, stats bar, and positioning section.

**Why Selected**

The primary user arrives sceptical. Leading with properties would feel transactional—exactly the "Dubai hustle" pattern the brand exists to counter. Trust must be established before commercial content has any credibility.

**Alternatives Considered**
- Property-first hero (rejected: too transactional)
- Split hero with property imagery (rejected: dilutes message)
- Video hero (rejected: adds complexity, loading time, potential for "flashy" perception)

**Trade-off Accepted**

Users who arrive specifically wanting to browse properties must scroll or navigate. This friction is intentional—it filters for the right kind of engagement.

---

### Decision 2: Feature Flags for Graceful Incompleteness

**Choice Made**

Properties, team, and other content sections can be independently enabled or disabled via CMS configuration, without code changes. When disabled, navigation adjusts automatically and direct URLs show appropriate fallbacks.

**Why Selected**

Content readiness may not align with launch timing. The founders need flexibility to go live with a credible subset of pages, then enable additional sections as content is ready.

**Alternatives Considered**
- Hard-coded page visibility (rejected: no flexibility)
- "Coming Soon" placeholders (rejected: signals incompleteness)
- Delayed launch until all content ready (rejected: delays go-to-market)

**Trade-off Accepted**

Navigation must dynamically adjust to hidden pages. This adds implementation complexity but preserves launch flexibility.

---

### Decision 3: Desktop-Optimised, Mobile-Functional

**Choice Made**

Design and testing priority goes to desktop experience for the public website. Mobile is fully responsive and functional, but desktop is the primary optimisation target. The learning system inverts this—mobile is the primary consumption context.

**Why Selected**

HNW investors conducting due diligence typically do so on desktop. The considered, research-oriented behaviour of the target persona aligns with desktop browsing. However, agents learning during commutes or downtime need mobile-first training content.

**Alternatives Considered**
- Mobile-first for all components (rejected: doesn't match investor behaviour)
- Desktop-only for learning (rejected: doesn't match agent reality)

**Trade-off Accepted**

Some homepage visual richness (overlapping images, complex layouts) simplifies on mobile. Learning content must be fully consumable on phone screens.

---

### Decision 4: Immediate Publishing, No Draft Workflow

**Choice Made**

When content is updated in the admin system, changes publish immediately to the public site via real-time Supabase updates. No staging environment, no approval workflow, no scheduled publishing.

**Why Selected**

The user base is small (founders, marketing coordinator). Adding workflow complexity would slow down a team that needs to move quickly. The risk of accidental publication is lower than the cost of approval bottlenecks.

**Alternatives Considered**
- Draft/publish workflow (rejected: unnecessary overhead for small team)
- Scheduled publishing (rejected: adds complexity without clear need)
- Staging environment (rejected: maintenance burden, delays)

**Trade-off Accepted**

A mistake published immediately is also fixed immediately. No safety net, but also no friction. This can be revisited if the team grows or content governance becomes a concern.

---

### Decision 5: Learner Accounts Created by Admin

**Choice Made**

New consultants cannot self-register. Their accounts are created by founders or the marketing coordinator through the admin panel. Learners receive credentials and access only the learning portal.

**Why Selected**

Prime Capital is selective about who joins the team. Self-registration would create accounts for people who haven't been vetted. Admin-created accounts ensure the learning platform population matches actual team members.

**Alternatives Considered**
- Self-registration with invite code (rejected: still allows unvetted access)
- Self-registration with approval workflow (rejected: adds complexity)
- No accounts, public content (rejected: progress tracking requires identity)

**Trade-off Accepted**

Adds a manual step to onboarding. Acceptable for a small, selective team.

---

### Decision 6: Competency-Based Learning Structure

**Choice Made**

Training content is organised by competency (Market Intelligence, Client Discovery, Property Matching, Transaction Management, Objection Navigation, Relationship Stewardship) rather than by document or topic.

**Why Selected**

Competency-based structure maps to job performance. An agent can ask "What do I need to know to handle client objections?" and find a coherent learning path. Topic-based organisation ("Here's the regulations section") doesn't connect knowledge to action.

**Alternatives Considered**
- Document-based structure (rejected: doesn't map to behaviour)
- Chronological onboarding flow (rejected: doesn't support reference use)
- Flat topic list (rejected: no hierarchy or progression)

**Trade-off Accepted**

Requires more upfront content structuring. Existing 50-page guide must be decomposed and reorganised, not simply uploaded.

---

### Decision 7: Standardise on shadcn/ui, Migrate Website from Ant Design

**Choice Made**

The unified platform uses shadcn/ui as the component library. The LMS prototype already uses shadcn/ui; the website prototype (currently Ant Design) will be migrated to shadcn/ui.

**Why Selected**

- shadcn/ui is more flexible and lighter weight
- Components are copied into the project (not npm dependencies), allowing full customisation
- Better alignment with the "quiet luxury" brand — less opinionated defaults
- The LMS prototype is further along with shadcn/ui; migrating the website is less work than migrating the LMS

**Alternatives Considered**
- Standardise on Ant Design (rejected: heavier, more opinionated, would require LMS rewrite)
- Keep both libraries (rejected: maintenance burden, inconsistent UX, larger bundle)
- Use neither, build custom (rejected: unnecessary effort)

**Trade-off Accepted**

Website components (Header, Footer, MobileNav, admin forms) need to be rebuilt using shadcn/ui primitives. The visual design and behaviour remain the same; the implementation changes. This adds migration effort but results in a more maintainable unified codebase.

---

### Decision 9: Unified Admin Panel

**Choice Made**

A single admin panel at `/admin/*` serves both CMS functions (properties, team, content) and LMS functions (learning modules, users, progress tracking). The LMS prototype's "Client Hub" concept is removed.

**Why Selected**

The admin user base is the same people (founders, marketing coordinator). Separate admin areas would require context-switching and duplicate navigation. A unified admin with clear sections is simpler to learn and maintain.

**Alternatives Considered**
- Separate CMS and LMS admin panels (rejected: same users, unnecessary duplication)
- Keep Client Hub as investor portal (rejected: investors use public website, not a portal)
- Subdomain for LMS admin (rejected: complicates auth and deployment)

**Trade-off Accepted**

The admin panel has more sections to navigate. Clear information architecture and good navigation design mitigate this. The admin sidebar groups related functions (Content, Learning, Settings).

---

### Decision 10: Independent Launch Capability

**Choice Made**

The public website, learning portal, and client hub can launch independently of each other. The learning portal or client hub may go live before the public website is ready.

**Why Selected**

Each surface has independent value. The learning portal enables agent onboarding regardless of website readiness. The client hub enables project management regardless of either. Coupling launches would delay value delivery.

**Alternatives Considered**
- Single launch date for all components (rejected: delays value)
- Completely separate deployments (rejected: loses shared infrastructure benefits)

**Trade-off Accepted**

Multiple "launches" to communicate and manage. Navigation and routing must gracefully handle partial-live states. The admin panel must be functional before any surface can launch.

---

### Decision 11: Client Hub as Reusable Engagement Pattern

**Choice Made**

The Client Hub (`/hub/*`) is built as a reusable pattern for managing client engagements. It includes projects, tasks, and questions/feedback collection. The pattern is designed to be portable to future Launch Path Ventures projects.

**Why Selected**

Client engagement management is a common need across projects. Building it as a reusable pattern means the investment pays off multiple times. The Prime Capital deployment is the first implementation, but the architecture should support future clients.

**Alternatives Considered**
- Prime Capital-specific implementation (rejected: limits future value)
- Separate standalone product (rejected: unnecessary complexity for now)
- Third-party tool (Notion, Asana, etc.) (rejected: less integrated, less control)

**Trade-off Accepted**

Building for reusability adds some abstraction overhead. Configuration and theming must be flexible. Worth it for the long-term leverage.

---

## 4. Resulting User Journeys (High-Level)

### Journey A: The Sceptical Investor

**Starting Context**

An investor in London receives a cold outreach email from Prime Capital. They're mildly curious but deeply sceptical. They've been approached by Dubai agents before and found them pushy. They click the link expecting to confirm their scepticism.

**Key Moments**

*Arrival (0-10 seconds)*
The homepage loads quickly. Dark, muted hero with a confident headline: "We move complexity out of sight." No flashy images, no pop-ups. The investor's eyebrows rise slightly—this doesn't look like what they expected.

*First Scroll (10-30 seconds)*
Stats bar shows transaction volume and client retention. Not outrageous numbers, but substantial. Then the positioning section: "In a market saturated with noise, we chose a different path." The investor recognises themselves in this language.

*Engagement (30-90 seconds)*
Featured properties appear—high-end, branded residences. Not dozens of listings, just a curated few. Testimonials from "Private Client, London" and "Family Office Principal, Singapore." The investor navigates to the Team page.

*Validation (90-180 seconds)*
Team bios show real expertise. The About page reinforces the boutique positioning. The investor returns to the homepage.

*Conversion (180+ seconds)*
The Strategy Kit catches their eye. They enter their email. Or they note the contact details for later. Either way, Prime Capital now has a qualified lead.

**Where Value Is Delivered**

The investor's scepticism is addressed through cumulative evidence: tone, content, team credentials, and restraint. They leave feeling this firm might actually be different.

**Where This Journey Stops**

The investor does not book a call or submit a detailed enquiry. They've moved from sceptical to curious. The next touchpoint will be the Strategy Kit email or a follow-up from the sales team.

---

### Journey B: The Founder Updating Properties

**Starting Context**

A new off-plan project launches. The founder needs to add it to the website before sending an update to their investor list.

**Key Moments**

*Access (0-30 seconds)*
The founder navigates to `/admin` and logs in with their email and password. The admin dashboard shows an overview of current content.

*Creation (1-5 minutes)*
They click "Add Property" and complete the form: name, type, location, developer, price range, specifications. They upload images directly to Supabase Storage through the form.

*Publishing (immediate)*
They click "Publish." The property appears on the public website within seconds. They navigate to the public properties page to verify.

*Notification (optional)*
They copy the property URL and paste it into their email campaign or investor update.

**Where Value Is Delivered**

The founder has complete control over website content without waiting for a developer. Time from decision to published: under 10 minutes.

**Where This Journey Stops**

The admin system does not manage email campaigns, CRM updates, or lead routing. Those happen in other tools (Zapier, GoHighLevel). The admin's job is content management, not marketing automation.

---

### Journey C: The New Agent Onboarding

**Starting Context**

Nadia joins Prime Capital as a new consultant. She has sales experience but no Dubai real estate background. Her founder sends her learning portal credentials on her first day.

**Key Moments**

*Orientation (Day 1, 30 minutes)*
Nadia logs into `/learn` and sees her learning path. Six competencies, each with modules. The first competency—Market Intelligence—is highlighted as her starting point. Progress: 0%.

*Foundation Building (Days 1-2)*
She works through Market Intelligence modules during commute time and lunch breaks. Each module is 15-25 minutes. After each module, a knowledge check (5-10 questions) confirms understanding. She needs 80% to pass.

*Progression (Days 2-4)*
As she completes modules, her progress updates in real-time. When she gets stuck on Transaction Management, she searches "Oqood" and finds the relevant section immediately.

*Certification Readiness (Day 5)*
All knowledge checks complete. Her dashboard shows "Ready for founder session." The founder receives notification and schedules a 45-minute certification conversation.

**Where Value Is Delivered**

Nadia builds knowledge at her own pace, with verification at each step. The founder knows she's ready without having spent 2-3 days in training delivery. Nadia feels confident going into her first client conversation.

**Where This Journey Stops**

The learning platform does not conduct the founder certification session—that remains human-delivered. It does not provide AI-powered practice simulations (deferred). It does not track post-certification performance. Its job is to get agents from zero to certification-ready.

---

### Journey D: The Founder Monitoring Team Progress

**Starting Context**

Three new agents joined this month. The founder wants to know who's ready for client contact without asking each person individually.

**Key Moments**

*Dashboard View (30 seconds)*
The founder logs into admin and navigates to the learning progress section. A table shows all learners, their completion percentage, and certification status.

*Drill-Down (1-2 minutes)*
One agent is at 45% after two weeks—behind schedule. The founder clicks to see which modules are incomplete. Transaction Management and Objection Navigation are pending.

*Action (outside platform)*
The founder sends a direct message to the agent asking if they need support, and schedules a check-in.

**Where Value Is Delivered**

The founder has visibility into team readiness without interrupting agents or relying on self-reported progress. Problems surface early.

**Where This Journey Stops**

The platform shows progress but doesn't send automated reminders or alerts. It doesn't enforce deadlines. Management action happens through direct conversation, not system automation.

---

### Journey E: Tim Reviews Project Progress with Client

**Starting Context**

Tim (Launch Path Ventures) has a weekly check-in with the Prime Capital founders. He wants to review project progress, see completed tasks, and gather feedback on a recent deliverable.

**Key Moments**

*Hub Access (30 seconds)*
Tim navigates to `/hub` and logs in with his admin credentials. The hub dashboard shows active projects, recent activity, and pending questions.

*Project Review (2-3 minutes)*
He opens the "Platform Development" project. The project view shows:
- Overall progress (65% complete)
- Recent milestones achieved
- Upcoming tasks with assignees and due dates
- Activity feed of recent completions

*Question Review (2-3 minutes)*
Tim navigates to Questions. He sees a pending question: "Review the updated brand guidelines — does the typography feel right?" The founders have submitted responses (text and voice recording). Tim plays the voice response, reads the feedback.

*Task Update (1 minute)*
Based on the feedback, Tim marks a task as complete and adds a new task: "Adjust headline weight based on feedback." He assigns it and sets a due date.

**Where Value Is Delivered**

Tim has a clear view of project status without relying on email chains or separate tools. Client feedback is captured in context. Task management happens alongside the work, not in a disconnected system.

**Where This Journey Stops**

The hub doesn't send automated notifications (email/SMS) for new tasks or questions. It doesn't integrate with external project management tools. It's a focused engagement surface, not a full PM system.

---

### Journey F: Client Responds to Question

**Starting Context**

A Prime Capital founder receives a message from Tim asking them to review something in the hub. They log in to respond.

**Key Moments**

*Access (30 seconds)*
The founder navigates to `/hub` and logs in. They see a notification badge on Questions.

*Question View (1 minute)*
They open the question: "Review the updated brand guidelines — does the typography feel right?" The question includes context and attachments (screenshots, PDF).

*Response (2-5 minutes)*
The founder can respond via:
- Text input (for quick written feedback)
- Voice recording (for detailed verbal feedback)
- Both

They record a 2-minute voice response explaining their thoughts, then add a brief text summary.

*Confirmation*
The response is saved. Tim will see it next time he checks the hub.

**Where Value Is Delivered**

The client can provide feedback asynchronously, in the format that's easiest for them. Voice recording captures nuance that text often misses. Everything is organised by project/question, not scattered across email.

**Where This Journey Stops**

The client doesn't receive a notification when Tim responds or follows up. They need to check the hub or wait for Tim to message them directly.

---

## 5. Architectural Shape of the Solution

### Conceptual Structure

The platform is organised as four connected experiences sharing a common foundation. The public website, learning portal, and client hub can launch independently — they share infrastructure but don't depend on each other:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           UNIFIED PLATFORM                                       │
│                                                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────────┐│
│  │   PUBLIC WEBSITE    │ │   LEARNING PORTAL   │ │        CLIENT HUB           ││
│  │   (Investors)       │ │   (Consultants)     │ │   (Tim + Client Team)       ││
│  │                     │ │                     │ │                             ││
│  │ Homepage, About     │ │ Dashboard           │ │ Projects, Tasks             ││
│  │ Services, Team      │ │ Competencies        │ │ Questions/Feedback          ││
│  │ Properties, Contact │ │ Modules, Quizzes    │ │ Progress Tracking           ││
│  │                     │ │                     │ │                             ││
│  │ Route: (web)/        │ │ Route: learn/       │ │ Route: hub/                 ││
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────────────┘│
│            │                       │                          │                  │
│            │         All managed via unified admin            │                  │
│            └───────────────────────┼──────────────────────────┘                  │
│                                    ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                         UNIFIED ADMIN PANEL                                │  │
│  │                              (app)/                                        │  │
│  │                                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   CONTENT    │  │   LEARNING   │  │     HUB      │  │   SETTINGS   │   │  │
│  │  │  ──────────  │  │  ──────────  │  │  ──────────  │  │  ──────────  │   │  │
│  │  │  Properties  │  │  Modules     │  │  Projects    │  │  Site Config │   │  │
│  │  │  Team        │  │  Quizzes     │  │  Tasks       │  │  Feature     │   │  │
│  │  │  Testimonials│  │  Users       │  │  Questions   │  │  Flags       │   │  │
│  │  │  Stats       │  │  Progress    │  │              │  │  Accounts    │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                                            │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                             │
│                                    ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                         SHARED FOUNDATION                                  │  │
│  │                                                                            │  │
│  │    shadcn/ui  │  Supabase (Data + Auth + Storage)  │  Brand System        │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Launch Sequencing

| Sequence | What Launches | Enables |
|----------|---------------|---------|
| **Phase 1** | Admin Panel + Shared Foundation | Content entry, user creation |
| **Phase 2a** | Learning Portal | Agent onboarding (can proceed independently) |
| **Phase 2b** | Public Website | Investor-facing presence (can proceed independently) |

The learning portal may launch before the public website if:
- Learning modules are defined and entered
- Learner accounts are created
- The public website content isn't ready yet

This allows agent onboarding to begin immediately while website content is finalised.

### Route Structure

| Route | Access | Component | Purpose |
|-------|--------|-----------|---------|
| `/` | Public | Website | Homepage |
| `/about`, `/services`, `/contact` | Public | Website | Core pages |
| `/properties`, `/properties/[slug]` | Public | Website | Portfolio (toggleable) |
| `/team`, `/team/[slug]` | Public | Website | Team profiles (toggleable) |
| `/strategy-kit` | Public | Website | Lead magnet capture |
| `/admin` | Authenticated (Admin) | Admin | Dashboard overview |
| `/admin/properties` | Authenticated (Admin) | Admin | Property management |
| `/admin/team` | Authenticated (Admin) | Admin | Team member management |
| `/admin/testimonials` | Authenticated (Admin) | Admin | Testimonial management |
| `/admin/stats` | Authenticated (Admin) | Admin | Statistics management |
| `/admin/settings` | Authenticated (Admin) | Admin | Site configuration, feature flags |
| `/admin/users` | Authenticated (Admin) | Admin | User account management |
| `/admin/learning` | Authenticated (Admin) | Admin | Learning content management |
| `/admin/learning/[competency]` | Authenticated (Admin) | Admin | Competency module management |
| `/admin/progress` | Authenticated (Admin) | Admin | Team learning progress view |
| `/admin/hub` | Authenticated (Admin) | Admin | Hub content management |
| `/learn` | Authenticated (Learner) | Learning | Learning dashboard |
| `/learn/[competency]` | Authenticated (Learner) | Learning | Competency overview & modules |
| `/learn/[competency]/[module]` | Authenticated (Learner) | Learning | Module content |
| `/learn/quiz/[id]` | Authenticated (Learner) | Learning | Knowledge check |
| `/hub` | Authenticated (Admin) | Hub | Hub dashboard |
| `/hub/projects` | Authenticated (Admin) | Hub | Projects list |
| `/hub/projects/[slug]` | Authenticated (Admin) | Hub | Project detail |
| `/hub/tasks` | Authenticated (Admin) | Hub | Tasks overview |
| `/hub/questions` | Authenticated (Admin) | Hub | Questions/feedback list |
| `/hub/questions/[id]` | Authenticated (Admin) | Hub | Question detail with responses |

**Route groups in codebase:**
- `(web)/` — Public website pages (no URL prefix)
- `(app)/` — Admin/app area for CMS + LMS + Hub management
- `learn/` — Learner-facing portal
- `hub/` — Client engagement portal
- `(auth)/` — Authentication flows

**Launch groupings:**
- **Admin routes**: Must be live first (required by all other surfaces)
- **Hub routes**: Can launch independently (project management with client)
- **Learning routes**: Can launch independently (agent onboarding)
- **Website routes**: Can launch independently (public presence)

### How Different Audiences Are Accommodated

**Public Visitors (Investors, Referrers)**
- See only public routes
- No login required
- Trust-building content first, commercial content second
- Lead capture via Strategy Kit and Contact forms

**Admin Users (Founders, Marketing Coordinator, Tim)**
- Access admin routes after authentication
- Full CRUD on all content types
- User management for learners
- Learning progress visibility
- Hub project and task management

**Learners (Consultants)**
- Access learning routes after authentication
- Cannot access admin or hub routes
- See only their own progress
- Mobile-optimised content consumption

**Hub Users (Tim + Client Team)**
- Access hub routes after authentication (same as admin auth)
- View projects, tasks, questions
- Submit responses to questions
- Track project progress

### What's Surfaced Early vs. Later

**Public Website**

| Early (Above Fold) | Mid (First Scroll) | Later (Deep Engagement) |
|--------------------|-------------------|------------------------|
| Brand promise | Credibility stats | Full property portfolio |
| Visual tone | Positioning differentiation | Detailed team bios |
| Navigation clarity | Featured properties preview | Service methodology |
| | | Lead magnet deep-dive |

**Learning Portal**

| Early (Dashboard) | Mid (Competency View) | Later (Module Content) |
|-------------------|----------------------|----------------------|
| Overall progress % | Module list | Detailed content |
| Next recommended action | Time estimates | Knowledge check |
| Certification status | Completion states | Reflection questions |

---

## 6. Deferred Paths & Future Considerations

### Blog / Insights Section

**What's Deferred**

A blog or insights section for market commentary, educational content, and SEO.

**Why Not Now**

Content doesn't exist yet. A blog with no posts (or worse, placeholder posts) signals incompleteness. The Strategy Kit serves the "expertise demonstration" function for now.

**Revisit When**
- Prime Capital has 3-5 substantive articles ready to publish
- There's a commitment to regular content cadence (minimum monthly)
- SEO becomes a priority acquisition channel

---

### AI Practice Simulations

**What's Deferred**

AI-powered roleplay simulations where agents practice client conversations with simulated investor personas (The Bubble Sceptic, The Developer Doubter, The Fee Hunter, etc.).

**Why Not Now**

Requires significant development effort (prompt engineering, feedback generation, LMS integration). Core learning value can be delivered through content modules and knowledge checks. Simulations add value but aren't essential for initial onboarding.

**Revisit When**
- Core learning platform is stable and adopted
- Founder feedback indicates practice gap (agents know content but struggle in live conversations)
- Budget allows for AI integration development

---

### Multi-Language Support

**What's Deferred**

Arabic, Mandarin, Russian, or other language versions of the website.

**Why Not Now**

Translation requires content finalisation first. Adds significant complexity to maintenance. Current target personas are English-primary.

**Revisit When**
- Specific market expansion requires it (e.g., dedicated China outreach)
- Content is stable enough to translate without constant re-translation
- There's budget for professional translation (not machine translation)

---

### Reelly.ai Property Integration

**What's Deferred**

Integration with Reelly.ai property repository to sync off-plan property data automatically.

**Why Not Now**

Adds external dependency to MVP. Manual property entry via CMS is sufficient for current portfolio size. Integration complexity should be tackled when core platform is stable.

**Revisit When**
- Property volume exceeds what's manageable via manual entry
- Reelly.ai API is stable and documented
- Data mapping requirements are understood

---

### Advanced Analytics

**What's Deferred**

Website analytics dashboard, learning analytics, lead source tracking, conversion funnel analysis.

**Why Not Now**

Vercel Analytics and Supabase queries can provide basic visibility. Building custom dashboards adds scope without clear immediate need. The team is small enough for direct observation.

**Revisit When**
- Team growth makes direct observation impractical
- Marketing spend requires attribution tracking
- Learning effectiveness needs quantitative measurement

---

### Role-Based Admin Permissions

**What's Deferred**

Different permission levels for different admin users (e.g., marketing coordinator can edit content but not manage users).

**Why Not Now**

Only 2-3 admin users initially. Trust is high. Adding permission complexity creates maintenance burden without clear benefit.

**Revisit When**
- Admin user count grows beyond trusted inner circle
- Content governance requires audit trails
- Compliance requirements demand access controls

---

## 7. How This Document Should Be Used

### During Delivery

This document provides the **rationale behind requirements**. When implementation questions arise ("Should we add X?" or "Why is Y structured this way?"), the answer should be traceable to decisions documented here.

If a proposed change contradicts a documented decision, that's a signal to pause and validate—either the change is wrong, or the decision needs to be revisited with stakeholder input.

### Alongside Other Documents

| Document | Purpose | Relationship |
|----------|---------|--------------|
| **Vision Document** | Why we're building this, what success looks like | Architecture explains *how* we get there |
| **Architecture Document** (this) | Why the solution takes this shape | Bridges vision to requirements |
| **Requirements Document** | What specifically needs to be built | Architecture provides the "why" for each requirement |

### For Implementation Agents

A coding agent reading this document should understand:
- Why the homepage leads with trust content, not properties
- Why properties are curated, not searched
- Why learning content is competency-based, not document-based
- Why admin publishing is immediate, not staged
- What's intentionally deferred and shouldn't be built yet

### In Stakeholder Conversations

This document supports conversations about scope, trade-offs, and priorities:

- **"Why don't we have X?"** → See Deferred Paths section
- **"How do we know this is right?"** → See Key Insights and how they connect to decisions
- **"What if the user wants to do Y?"** → See User Journeys for intended paths
- **"Can we add Z?"** → Evaluate against decisions and accepted trade-offs

### For Future Team Members

Anyone joining the project later can read this document to understand not just *what* was built, but *why* it was built this way. This prevents relitigating settled decisions and helps new contributors make aligned choices.

---

*This document captures the thinking that shaped the solution. It should evolve if fundamental assumptions change, but individual decisions should not be revisited without clear evidence that the underlying insight was wrong.*