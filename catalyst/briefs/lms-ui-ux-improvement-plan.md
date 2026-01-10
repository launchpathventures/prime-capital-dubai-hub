# LMS UI/UX Improvement Plan

**Status:** 📋 PLANNING  
**Created:** 2026-01-10  
**Type:** Feature Overhaul  
**Priority:** High  

---

## Executive Summary

The Learning Management Surface (`/learn`) requires a comprehensive UI/UX overhaul. The current implementation is:
- **Clunky and inconsistent** — Mix of hardcoded data and unused database tables
- **Not connected to Supabase** — UI uses mock data instead of `competencies`, `learning_modules`, `quiz_questions` tables
- **Poor user experience** — Confusing navigation, outdated visual design, non-intuitive flow
- **Content not rendered** — Rich markdown content exists in `content/lms/` but isn't displayed

This plan establishes milestones, workstreams, and briefs to transform the learning surface into a polished, data-driven, **multimodal** training platform.

---

## Core Principles

### 1. Content is Truth
The markdown content in `content/lms/` is the **source of truth**. Supabase stores and serves this content as-is. The UI adapts to render whatever exists in the content — we don't force content into a rigid schema.

### 2. Multimodal Learning
Each module can be experienced in multiple ways:
- **Read** — Beautifully rendered markdown content
- **Listen** — AI Coach audio demonstrations (`.audio.md` files)
- **Practice** — Interactive scenarios with AI clients

### 3. Demonstrate Then Explain
Audio transcripts follow a "show, don't just tell" philosophy:
- Coach demonstrates strong vs weak approaches
- Then explains the reasoning behind each technique
- Learners hear what good looks like before they try it themselves

---

## Current State Analysis

### What Exists

| Layer | Status | Issues |
|-------|--------|--------|
| **Supabase Schema** | ✅ Complete | Tables: `competencies` (6 rows), `learning_modules` (0 rows), `quiz_questions` (0 rows), `learning_progress`, `quiz_attempts` |
| **Markdown Content** | ✅ Rich content | 9 competency folders in `content/lms/`, ~50+ module files with frontmatter |
| **UI Components** | ⚠️ Exists but poor | `LearnShell`, `LMSHeader`, `CompetencySidebar` — clunky design, hardcoded data |
| **Route Structure** | ⚠️ Partially correct | `/learn`, `/learn/[competency]`, `/learn/[competency]/[module]`, `/learn/quiz/[id]` |
| **Data Layer** | ❌ Missing | No `lib/` functions to fetch LMS data from Supabase |
| **Progress Tracking** | ❌ Not implemented | Tables exist but no UI or server actions use them |

### Key Problems

1. **Hardcoded Mock Data Everywhere**
   - [page.tsx](app/learn/page.tsx) — Dashboard uses hardcoded `competencies` array
   - [[competency]/page.tsx](app/learn/[competency]/page.tsx) — Competency list duplicated and hardcoded
   - [[module]/page.tsx](app/learn/[competency]/[module]/page.tsx) — Module content hardcoded as JSX
   - [competency-sidebar.tsx](app/learn/_surface/competency-sidebar.tsx) — Navigation hardcoded

2. **Content Mismatch**
   - DB has 6 competencies: `market-intelligence`, `client-discovery`, `property-matching`, `transaction-management`, `objection-navigation`, `relationship-stewardship`
   - UI has 7 different competencies: `prime-capital-identity`, `market-intelligence`, `client-discovery`, `property-matching`, `objection-navigation`, `transaction-excellence`, `relationship-building`
   - Content folder has 9 competencies (including `0-foundations`, `3-sales-mastery`, `8-rera-exam-prep`)
   - **No sync between any of these sources**

3. **Visual Design Issues**
   - Dated color scheme (`#525252` gray header, `#5a6c7d` sidebar)
   - Inconsistent with main app design system
   - Poor mobile responsiveness
   - No loading states or error handling
   - Typography inconsistent with design tokens

4. **UX Flow Problems**
   - Confusing navigation hierarchy
   - No clear learning pathway visualization
   - Progress not visible or trackable
   - Quiz flow disconnected from module completion
   - No "continue where you left off" functionality

---

## Success Criteria

| Metric | Target |
|--------|--------|
| **Data-driven** | 100% content from Supabase (competencies, modules, quizzes) |
| **Visual quality** | Matches provided mockups exactly |
| **Content compatibility** | Markdown frontmatter renders all UI components |
| **Usability** | Clear learning path, intuitive navigation, mobile-friendly |
| **Progress tracking** | Real-time progress saved to `learning_progress` table |
| **Quiz integration** | Quizzes work end-to-end with attempts saved |
| **Performance** | < 2s initial load, instant navigation |

---

## UI Mockup Reference

### Mockup → Page Mapping

| Mockup | Page Type | Route | Key Components |
|--------|-----------|-------|----------------|
| **Image 7** | Dashboard | `/learn` | Welcome banner, progress stats, course card |
| **Image 3** | Course Overview | `/learn/course` | Hero, "How it Works", learning pathway |
| **Image 6** | Competency Overview | `/learn/[competency]` | Context section, behaviours list, toolkit |
| **Image 8** | Module (Knowledge) | `/learn/[comp]/[module]` | Founders, Brand Values, Process Model |
| **Images 1, 2** | Module (Skills) | `/learn/[comp]/[module]` | Practice scenario, client profile, CTA |
| **Image 4** | Quiz Question | `/learn/quiz/[id]` | Question, options, submit button |
| **Image 5** | Quiz Complete | `/learn/quiz/[id]/results` | Score, next behaviour CTA |

### Component Library Required

Based on mockups, these components need to be built:

```
components/lms/
├── index.ts
├── lms-header.tsx              # ✅ Exists, needs update
├── competency-sidebar.tsx      # ✅ Exists, needs update  
├── progress-stats.tsx          # NEW: 3-column stats (%, competencies, behaviours)
├── course-card.tsx             # NEW: Course with image, progress bar
├── risk-reward-callout.tsx     # NEW: Two-column risk/reward boxes
├── process-model.tsx           # NEW: Numbered steps with scripts
├── founder-card.tsx            # NEW: Avatar, name, experience, focus
├── brand-values-grid.tsx       # NEW: 2x2 value cards
├── practice-scenario.tsx       # NEW: Client profile, objectives, CTA
├── resource-list.tsx           # NEW: Downloadable resources
├── behaviour-list-item.tsx     # NEW: Behaviour with status badge
├── quiz-question.tsx           # NEW: Question with radio options
├── quiz-results.tsx            # NEW: Score display, next action
└── knowledge-check-cta.tsx     # NEW: "Continue to Knowledge Check" button
```

### Design Tokens (from mockups)

| Element | Value | CSS Variable |
|---------|-------|--------------|
| Sidebar background | `#4a5a6a` (slate-gray) | `--learn-sidebar-bg` |
| Header background | `#4a5a6a` | `--learn-header-bg` |
| Content background | `#f5f5f0` (warm off-white) | `--learn-content-bg` |
| Risk callout | Red border + light red bg | `--learn-risk-*` |
| Reward callout | Green border + light green bg | `--learn-reward-*` |
| Current badge | `#4a5a6a` | `--learn-badge-current` |
| Locked state | `#9ca3af` (gray) | `--learn-badge-locked` |
| CTA button | `#4a5a6a` | `--learn-cta-bg` |

---

## Proposed Milestones

### Milestone 1: Data Foundation (2-3 days)
**Goal:** All LMS data flows from Supabase, content synced

- [ ] Create `lib/learning.ts` — Data fetching functions for competencies, modules, progress
- [ ] Populate `learning_modules` table from `content/lms/` markdown files
- [ ] Populate `quiz_questions` table from quiz content
- [ ] Ensure competency slugs match between DB, content, and config
- [ ] Add server actions for progress tracking

### Milestone 2: UI Overhaul — Core Shell (2 days)
**Goal:** New visual foundation matching design system

- [ ] Redesign `LearnShell` with clean, modern layout
- [ ] New `LMSHeader` with proper navigation and progress indicator
- [ ] Update color scheme to use design tokens
- [ ] Implement responsive sidebar/mobile drawer pattern

### Milestone 3: Dashboard Redesign (1-2 days)
**Goal:** Compelling, clear learning hub

- [ ] Dashboard fetches from Supabase, shows real progress
- [ ] Visual learning pathway (competencies as journey)
- [ ] Progress cards with completion percentage
- [ ] "Continue learning" prominent CTA
- [ ] Stats/achievement indicators

### Milestone 4: Module Experience (2-3 days)
**Goal:** Excellent content consumption experience

- [ ] Module page renders markdown content beautifully
- [ ] Sidebar shows competency structure and progress
- [ ] Mark complete functionality
- [ ] Next/previous module navigation
- [ ] Estimated reading time display

### Milestone 5: Quiz Flow (2 days)
**Goal:** Engaging, functional assessments

- [ ] Quiz questions fetched from Supabase
- [ ] Clean quiz interface with progress indicator
- [ ] Immediate feedback on answers
- [ ] Results page with pass/fail and retry
- [ ] Quiz attempts saved to database

### Milestone 6: Polish & Edge Cases (1-2 days)
**Goal:** Production-ready quality

- [ ] Loading states and skeletons
- [ ] Error boundaries and fallbacks
- [ ] Mobile optimization pass
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Workstreams

### WS1: Data Layer
Create the data foundation that connects UI to Supabase.

**Files to create:**
- `lib/learning.ts` — Server-only data fetching (competencies, modules, progress)
- `lib/learning-types.ts` — TypeScript types for LMS entities
- `lib/actions/learning.ts` — Server actions (mark complete, save progress, submit quiz)

**Key functions needed:**
```typescript
// lib/learning.ts
getCompetencies()
getCompetency(slug: string)
getModules(competencyId: string)
getModule(competencySlug: string, moduleSlug: string)
getUserProgress(userId: string)
getModuleProgress(userId: string, moduleId: string)
getQuizQuestions(moduleId: string)
getQuizAttempts(userId: string, moduleId: string)

// lib/actions/learning.ts
markModuleStarted(moduleId: string)
markModuleComplete(moduleId: string)
submitQuizAttempt(moduleId: string, answers: Answer[])
```

### WS2: Content Migration
Sync markdown content to Supabase tables.

**Tasks:**
1. Parse `content/lms/*/_index.md` files for competency data
2. Parse `content/lms/*/*.md` files for module data
3. Parse `content/lms/quizzes/*.md` files for quiz questions
4. Write migration script or manual SQL to populate tables
5. Reconcile competency slug mismatches (pick canonical set)

**Canonical Competencies (proposed):**
| Order | Slug | Name |
|-------|------|------|
| 0 | `foundations` | Foundations |
| 1 | `market-intelligence` | Market Intelligence |
| 2 | `client-discovery` | Client Discovery |
| 3 | `sales-mastery` | Sales Mastery |
| 4 | `property-matching` | Property Matching |
| 5 | `transaction-management` | Transaction Management |
| 6 | `objection-navigation` | Objection Navigation |
| 7 | `relationship-stewardship` | Relationship Stewardship |
| 8 | `rera-exam-prep` | RERA Exam Prep |

### WS3: Shell & Layout
Redesign the learn surface shell.

**Design principles:**
- Use design tokens (`var(--color-*)`)
- Match web surface sophistication (dark mode aware)
- Clean, focused reading experience
- Sidebar for navigation, not clutter

**Components to update:**
- `app/learn/_surface/learn-shell.tsx`
- `app/learn/_surface/competency-sidebar.tsx` → new design
- `components/lms/lms-header.tsx`
- `app/learn/learn.css`

### WS4: Page Redesigns
Update each page type with new UI.

**Dashboard (`/learn`):**
- Hero with user's progress
- Learning pathway visualization
- Competency cards with progress bars
- Quick stats (completed, in progress, time spent)

**Competency (`/learn/[competency]`):**
- Competency overview header
- Module list with status indicators
- Progress through competency
- Description and learning outcomes

**Module (`/learn/[competency]/[module]`):**
- Markdown content rendered with MDX
- Reading progress indicator
- Mark complete button
- Next/previous navigation
- Table of contents (optional)

**Quiz (`/learn/quiz/[id]`):**
- Clean question display
- Answer selection
- Progress through quiz
- Results summary
- Retry or continue flow

---

## Briefs to Generate

| Brief ID | Title | Scope | Dependency | Est. Days |
|----------|-------|-------|------------|-----------|
| `LMS-001` | Data Layer Foundation | Create `lib/learning.ts`, types, server actions | None | 1-2 |
| `LMS-002` | Content Sync | Sync markdown to Supabase (preserving all content as-is) | None | 1 |
| `LMS-003` | Learn Shell Redesign | New shell, header, sidebar matching mockups | None | 2 |
| `LMS-004` | Dashboard Page Overhaul | Data-driven dashboard with progress (mockup 7) | LMS-001, LMS-003 | 1-2 |
| `LMS-005` | Competency Overview Page | Competency landing with behaviours list (mockup 6) | LMS-001, LMS-003 | 1 |
| `LMS-006` | Module Learning Experience | Multimodal module page: Read, Listen, Practice | LMS-001, LMS-002, LMS-003 | 2-3 |
| `LMS-007` | Quiz System | Complete quiz flow (mockups 4,5) | LMS-001, LMS-002 | 2 |
| `LMS-008` | Course Overview Page | Course landing page (mockup 3) | LMS-001, LMS-003 | 1 |
| `LMS-009` | Progress Tracking Integration | Real-time progress updates, mark complete | LMS-001 | 1 |
| `LMS-010` | Polish & Optimization | Loading states, errors, mobile, perf | All above | 1-2 |
| `LMS-011` | Audio Transcript Creation | Create coach demo transcripts for all modules | LMS-002, LMS-006 | 3-5 |

**Total estimate:** ~3-4 weeks (including audio content)

---

## Recommended Execution Order

```
Week 1: Foundation (parallel tracks)
├── LMS-001: Data Layer Foundation ──────────┐
├── LMS-002: Content Sync ───────────────────┤ (can run parallel)
├── LMS-003: Learn Shell Redesign ───────────┘

Week 2: Core Pages
├── LMS-004: Dashboard Page ─────────────────┐
├── LMS-005: Competency Overview ────────────┤
├── LMS-006: Module Learning Experience ─────┤ (Read, Listen, Practice)
├── LMS-008: Course Overview ────────────────┘

Week 3: Completion
├── LMS-007: Quiz System ────────────────────┐
├── LMS-009: Progress Tracking ──────────────┤
└── LMS-010: Polish & Optimization ──────────┘

Week 3-4: Content (can overlap with Week 3)
└── LMS-011: Audio Transcript Creation ──────  (content team)
```

**Critical Path:** LMS-001 → LMS-004/005/006 → LMS-007

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content format inconsistency | Module parsing fails | Audit all markdown files first, standardize frontmatter |
| Quiz question format varies | Quiz system breaks | Define strict schema, validate on migration |
| Scope creep (AI coach, scenarios) | Delays core delivery | Explicitly defer to v2 |
| Mobile complexity | Extra time needed | Mobile-first CSS, test early |

---

## Content Format Specification

Based on the UI mockups, module content must follow this structure for the components to render correctly:

### Target UI Components (from mockups)

| Component | Description | Source |
|-----------|-------------|--------|
| **Module Header** | Title + subtitle describing the behaviour | Frontmatter `title`, `description` |
| **The Risk / The Reward** | Two-column callout (warning vs success) | Custom frontmatter fields |
| **The Context** | Introductory narrative | Markdown section `## The Context` |
| **Process Model** | Numbered steps with example scripts | Custom structure in frontmatter or markdown |
| **Founder Profiles** | Avatar, name, experience, focus | Shared data (team_members table) |
| **Brand Values** | 2x2 grid of values | Shared data or frontmatter |
| **Practice Section** | Client profile, scenario, objectives, coaching points | Frontmatter `practiceScenario` object |
| **Resources** | List of downloadable/linked resources | Frontmatter `resources` array |
| **Continue to Knowledge Check** | CTA linking to quiz | Frontmatter `quizId` |

### Required Frontmatter Structure

```yaml
---
# Core metadata
title: "Articulates the Prime Capital Story"
slug: "our-story"
moduleNumber: "1.1"
competencySlug: "prime-capital-identity"
type: "knowledge" | "skills" | "skills-script"
description: "Can clearly explain who Prime Capital is..."
estimatedDuration: 30  # minutes

# Risk/Reward callouts
theRisk: "You give a generic description that sounds like any agency..."
theReward: "Client immediately grasps our unique positioning..."

# Process Model (numbered steps with scripts)
processModel:
  - title: "Know the Origin Story"
    description: "Understand how Prime Capital was founded..."
    script: "Prime Capital was founded by three partners who saw a gap..."
  - title: "Articulate the Combined Expertise"
    description: "Be able to explain what each founder brings..."
    script: "Our founders bring 60+ years combined experience..."
  - title: "Connect to Client Benefit"
    description: "Always tie the story back to what it means for the client."
    script: "What this means for you is access to off-market opportunities..."

# Practice Scenario (for skills/skills-script modules)
practiceScenario:
  type: "voice-call" | "whatsapp" | "email" | "meeting"
  clientProfile:
    name: "Sarah Chen"
    location: "Singapore"
    background: "Family office director"
    investmentSize: "AED 10-20 million portfolio"
    keyContext: "Wants to understand the people behind the company..."
  scenario: "Sarah is evaluating Prime Capital for a multi-property portfolio..."
  objectives:
    - "Clearly articulate each founder's expertise and track record"
    - "Explain why the combination of founders creates unique value"
    - "Demonstrate how the founders' experience translates to client benefits"
    - "Project confidence without arrogance"
  questionsMayAsk:
    - "Tell me about the people behind Prime Capital. Who am I really working with?"
    - "I've worked with large institutions before. Why should I trust a boutique firm?"
  coachingPoints:
    confidence: "Speak with authority about the founders—you represent them"
    specificity: "Use specific numbers (60+ years combined, 20+ years each)"
    connection: "Link each founder's strength to a specific benefit for the client"
    authenticity: "Show genuine respect for the founders—clients can sense it"

# Resources
resources:
  - title: "Prime Capital Origin Story"
    type: "document"
    url: "/resources/origin-story.pdf"
  - title: "Founder Biography Document"
    type: "document"
    url: "/resources/founder-bios.pdf"

# Quiz link
quizId: "prime-capital-identity-1"

# AI Coach settings
aiCoach:
  enabled: true
  personality: "professional-mentor"
  focusAreas:
    - "Brand positioning"
    - "Founder expertise"
---
```

### Current Content Gap Analysis

| Element | Current State | Action Required |
|---------|---------------|-----------------|
| **Frontmatter** | ✅ Exists, but varies | Standardize across all modules |
| **theRisk / theReward** | ❌ Missing | Add to all modules |
| **processModel** | ⚠️ In prose form | Extract into structured array |
| **practiceScenario** | ⚠️ Separate files in `scenarios/` | Inline into module frontmatter |
| **resources** | ✅ Array exists | Populate with actual links |
| **quizId** | ⚠️ Inconsistent | Link each module to its quiz |

### Content Migration Tasks

1. **Standardize frontmatter** across all 50+ module files
2. **Extract "The Risk / The Reward"** from prose into frontmatter fields
3. **Structure Process Model** — pull numbered steps from prose into `processModel` array
4. **Inline practice scenarios** — move relevant scenarios from `scenarios/*.md` into module frontmatter
5. **Link quizzes** — set `quizId` on each module that has an associated quiz
6. **Add resources** — populate `resources` array with actual document links

### Example Module Transformation

**Before (current):**
```markdown
---
title: "Prime Capital Orientation"
slug: "company-orientation"
moduleType: knowledge
estimatedDuration: 45
---

# Prime Capital Orientation

## Introduction
Prime Capital Dubai is not a typical real estate agency...

## Our Story
Prime Capital was founded to serve a specific gap...
```

**After (target format):**
```markdown
---
title: "Articulates the Prime Capital Story"
slug: "our-story"
behaviourNumber: "1.1"
competencySlug: "prime-capital-identity"
type: "knowledge"
description: "Can clearly explain who Prime Capital is, how we started, and what we stand for."
estimatedDuration: 30

theRisk: "You give a generic description that sounds like any agency. Client doesn't understand why we're different."
theReward: "Client immediately grasps our unique positioning and feels they've found something special."

processModel:
  - title: "Know the Origin Story"
    description: "Understand how Prime Capital was founded and what gap in the market it was created to fill."
    script: "Prime Capital was founded by three partners who saw a gap: there was no truly client-first boutique serving international investors who wanted expertise without the sales pressure."
  - title: "Articulate the Combined Expertise"
    description: "Be able to explain what each founder brings and how it creates a unique combination."
    script: "Our founders bring 60+ years combined experience — Tahir in client relationships, Shaad in developer networks, and Rohit in international markets."
  - title: "Connect to Client Benefit"
    description: "Always tie the story back to what it means for the client."
    script: "What this means for you is access to off-market opportunities, honest guidance, and a team that genuinely doesn't need your business — we work with clients we believe in."

resources:
  - title: "Prime Capital Origin Story"
    type: "document"
  - title: "Founder Biography Document"
    type: "document"

quizId: "prime-capital-identity-1"
---

## The Context

This is where every consultant's journey begins. Before you can represent Prime Capital to clients...

## Our Founders

[Content about Tahir, Shaad, Rohit...]

## Brand Values

[Authoritative, Discreet, Transparent, Calm...]
```

---

## Canonical Competency List

Based on `content/lms/` folders (the most complete source):

| Order | Slug | Folder | Name | Modules |
|-------|------|--------|------|---------|
| 0 | `foundations` | `0-foundations` | Foundations | 5 |
| 1 | `market-intelligence` | `1-market-intelligence` | Market Intelligence | 10 |
| 2 | `client-discovery` | `2-client-discovery` | Client Discovery | 7 |
| 3 | `sales-mastery` | `3-sales-mastery` | Sales Mastery | ~10 |
| 4 | `property-matching` | `4-property-matching` | Property Matching | ~8 |
| 5 | `transaction-management` | `5-transaction-management` | Transaction Management | ~8 |
| 6 | `objection-navigation` | `6-objection-navigation` | Objection Navigation | ~8 |
| 7 | `relationship-stewardship` | `7-relationship-stewardship` | Relationship Stewardship | ~6 |
| 8 | `rera-exam-prep` | `8-rera-exam-prep` | RERA Exam Prep | TBD |

**Action:** Update `competencies` table to match this list (currently missing 0, 3, 8).

---

## Out of Scope (v2)

- AI Coach voice/chat integration (practice scenarios shown but not interactive)
- Video playback
- Certificates/badges generation
- Admin content editing UI
- Analytics dashboard
- Leaderboards/gamification

---

## Implementation Briefs

All 11 detailed implementation briefs have been generated. Each brief contains:
- Objective and scope
- Design specifications with ASCII wireframes
- Complete code examples
- Files to create/modify
- Acceptance criteria

| Brief | Title | Status | Estimate |
|-------|-------|--------|----------|
| [LMS-001](lms-001-data-layer.md) | Data Layer Foundation | 📋 READY | 1-2 days |
| [LMS-002](lms-002-content-sync.md) | Content Sync | 📋 READY | 1 day |
| [LMS-003](lms-003-shell-redesign.md) | Shell Redesign | 📋 READY | 1-2 days |
| [LMS-004](lms-004-dashboard.md) | Dashboard Page | 📋 READY | 1 day |
| [LMS-005](lms-005-competency-page.md) | Competency Overview Page | 📋 READY | 0.5-1 day |
| [LMS-006](lms-006-module-experience.md) | Module Learning Experience | 📋 READY | 2-3 days |
| [LMS-007](lms-007-quiz-system.md) | Quiz System | 📋 READY | 1-2 days |
| [LMS-008](lms-008-course-overview.md) | Course Overview Page | 📋 READY | 0.5-1 day |
| [LMS-009](lms-009-progress-tracking.md) | Progress Tracking Integration | 📋 READY | 1 day |
| [LMS-010](lms-010-polish.md) | Polish & Production Readiness | 📋 READY | 1-2 days |
| [LMS-011](lms-011-audio-transcripts.md) | Audio Transcript Creation | 📋 READY | 3-5 days |

### Brief Execution for GitHub Cloud Agents

Each brief is designed to be executed by a GitHub Copilot agent. To run:

1. Open the brief file in VS Code
2. Copy the entire content 
3. Create a new Copilot chat and paste the brief
4. Agent will implement all deliverables

**Recommended execution order:**
```
Parallel Track A: LMS-001 → LMS-004 → LMS-005 → LMS-006
Parallel Track B: LMS-002 (run sync script)
Parallel Track C: LMS-003 (can start immediately)
Content Track: LMS-011 (can run parallel once LMS-002 complete)

After Track A: LMS-007 → LMS-009
After all tracks: LMS-008, LMS-010
```

---

## Key Philosophy Changes

### Content-First Approach (LMS-002)
The original plan proposed migrating content to fit a rigid UI schema. This was **reversed**:
- Markdown content is the **source of truth**
- Supabase stores content **verbatim** with flexible JSONB frontmatter
- UI **adapts** to render whatever content exists
- Custom markdown renderers transform patterns into rich UI

### Multimodal Learning (LMS-006)
Each module supports three learning modes:
1. **Read** — Enhanced markdown rendering with custom components
2. **Listen** — AI Coach audio demonstrations (`.audio.md` files)
3. **Practice** — Interactive scenarios with AI clients

### Audio Transcript Format
Coach demonstrations follow a "demonstrate then explain" pattern:
```markdown
[DEMO: Weak]
"Hi, I'm calling from Prime Capital Real Estate..."

[COACH EXPLAINS]
Notice what happened there? I led with the company name...

[DEMO: Strong]
"Hi Sarah, this is James from Prime Capital..."
```

---

## Next Steps

1. **Start LMS-001** — Data layer is the foundation for everything
2. **Start LMS-003** — Shell redesign can happen in parallel  
3. **Run LMS-002** — Content sync populates database (preserving content as-is)

---

## Appendix: Current File Inventory

### Routes
- `app/learn/layout.tsx` — Uses LearnShell
- `app/learn/page.tsx` — Dashboard (hardcoded)
- `app/learn/[competency]/page.tsx` — Redirects to first module
- `app/learn/[competency]/[module]/page.tsx` — Module content (hardcoded)
- `app/learn/course/page.tsx` — Course overview (hardcoded)
- `app/learn/quiz/[id]/` — Quiz route (status unknown)

### Surface Components
- `app/learn/_surface/learn-shell.tsx` — Main shell
- `app/learn/_surface/competency-sidebar.tsx` — Navigation sidebar
- `app/learn/_surface/index.ts` — Exports

### Shared Components
- `components/lms/lms-header.tsx` — Fixed header
- `components/lms/index.ts` — Exports

### Styles
- `app/learn/learn.css` — Surface-specific styles

### Content
- `content/lms/0-foundations/` — 5 modules + index
- `content/lms/1-market-intelligence/` — Modules
- `content/lms/2-client-discovery/` — Modules
- `content/lms/3-sales-mastery/` — Modules
- `content/lms/4-property-matching/` — Modules
- `content/lms/5-transaction-management/` — Modules
- `content/lms/6-objection-navigation/` — Modules
- `content/lms/7-relationship-stewardship/` — Modules
- `content/lms/8-rera-exam-prep/` — Modules
- `content/lms/quizzes/` — Quiz files
- `content/lms/scenarios/` — Scenario files

### Database
- `competencies` — 6 rows (missing foundations, sales-mastery, rera-exam-prep)
- `learning_modules` — 0 rows (needs population)
- `quiz_questions` — 0 rows (needs population)
- `learning_progress` — 0 rows (ready for tracking)
- `quiz_attempts` — 0 rows (ready for tracking)
