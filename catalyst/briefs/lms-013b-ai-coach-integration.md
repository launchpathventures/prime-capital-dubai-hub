# LMS-013b: AI Coach Integration

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1-2 days  
**Dependencies:** LMS-013a (AI Coach Infrastructure)  
**Agent-Safe:** ⚠️ Partial — requires human review for UX polish and prompt tuning

---

## Objective

Integrate the AI Coach components (from LMS-013a) into the Learn surface. This includes:

1. **Three entry points** — Header bar, floating button, bottom prompt
2. **Context passing** — Each page level passes appropriate context
3. **Responsive design** — Mobile-friendly sidebar behavior
4. **Prompt tuning** — Refine system prompts based on testing

---

## Pre-requisites

Ensure LMS-013a is complete:
- [ ] `coach_usage` table exists
- [ ] `/api/coach/chat` endpoint works
- [ ] `components/lms/coach/` components exist
- [ ] `@anthropic-ai/sdk` is installed
- [ ] `ANTHROPIC_API_KEY` is set

---

## Integration Architecture

```
app/learn/
├── layout.tsx                    # NO changes (already minimal)
├── page.tsx                      # Course home — wrap with CoachProvider
├── [competency]/
│   ├── page.tsx                  # Competency page — wrap with CoachProvider
│   └── [module]/
│       └── page.tsx              # Module page — wrap with CoachProvider
│
└── _surface/
    └── learn-shell.tsx           # Add CoachPanel and CoachTrigger
```

---

## Part 1: Learn Shell Integration

### File: `app/learn/_surface/learn-shell.tsx`

Add CoachProvider, CoachPanel, and CoachTrigger to the shell.

```tsx
/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal with header, sidebar, and content area.
 * Now includes AI Coach integration.
 */

"use client"

import * as React from "react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"
import { CoachProvider, CoachPanel, CoachTrigger, CoachContext } from "@/components/lms/coach"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface Module {
  slug: string
  title: string
  status: "complete" | "current" | "locked"
}

interface Competency {
  slug: string
  name: string
  number: number
  locked: boolean
  modules: Module[]
}

interface LearnShellProps {
  children: React.ReactNode
  user: LearnUser
  /** Show sidebar navigation (false for dashboard/course overview) */
  showSidebar?: boolean
  /** Current competency slug for sidebar highlighting */
  currentCompetency?: string
  /** Current module slug for sidebar highlighting */
  currentModule?: string
  /** Competency data for sidebar */
  competencies?: Competency[]
  /** Coach context for AI Coach */
  coachContext?: CoachContext
}

// -----------------------------------------------------------------------------
// LearnShell Component
// -----------------------------------------------------------------------------

export function LearnShell({ 
  children, 
  user,
  showSidebar = false,
  currentCompetency,
  currentModule,
  competencies = [],
  coachContext = { level: "course" },
}: LearnShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  return (
    <CoachProvider initialContext={coachContext}>
      <div 
        className="learn-shell"
        data-has-sidebar={showSidebar}
      >
        <LMSHeader 
          onMenuClick={() => setDrawerOpen(true)}
          showMenuButton={showSidebar}
        />
        
        {showSidebar && competencies.length > 0 && (
          <>
            {/* Desktop sidebar */}
            <LearnSidebar 
              competencies={competencies}
              currentCompetency={currentCompetency}
              currentModule={currentModule}
            />
            
            {/* Mobile drawer */}
            <div 
              className="learn-drawer lg:hidden"
              data-open={drawerOpen}
            >
              <div 
                className="learn-drawer__backdrop"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="learn-drawer__panel">
                <LearnSidebar 
                  competencies={competencies}
                  currentCompetency={currentCompetency}
                  currentModule={currentModule}
                />
              </div>
            </div>
          </>
        )}
        
        <main className="learn-shell__main">
          {children}
        </main>
        
        {/* AI Coach - always available */}
        <CoachTrigger />
        <CoachPanel />
      </div>
    </CoachProvider>
  )
}
```

---

## Part 2: Entry Point Components

### 2a. Header Ask Bar

**File:** `components/lms/coach/coach-header-bar.tsx`

Inline prompt at top of content area. Used on all three page levels.

```tsx
/**
 * CATALYST - Coach Header Bar
 * 
 * Inline "Ask about..." prompt for top of module/competency pages.
 */

"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

interface CoachHeaderBarProps {
  placeholder?: string
  className?: string
}

export function CoachHeaderBar({ 
  placeholder = "Ask a question about this module...",
  className,
}: CoachHeaderBarProps) {
  const { openCoach } = useCoach()

  return (
    <button
      onClick={() => openCoach()}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg",
        "border bg-muted/30 px-4 py-3",
        "text-left text-sm text-muted-foreground",
        "transition-colors hover:bg-muted/50 hover:border-primary/20",
        className
      )}
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground/70 group-hover:text-primary" />
      <span>{placeholder}</span>
    </button>
  )
}
```

### 2b. Bottom Prompt

**File:** `components/lms/coach/coach-bottom-prompt.tsx`

Call-to-action at bottom of module/competency content.

```tsx
/**
 * CATALYST - Coach Bottom Prompt
 * 
 * CTA card at bottom of content to encourage questions.
 */

"use client"

import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stack, Text } from "@/components/core"
import { useCoach } from "./coach-provider"

interface CoachBottomPromptProps {
  title?: string
  description?: string
}

export function CoachBottomPrompt({
  title = "Questions about this module?",
  description = "Ask the AI Coach for a quick explanation or to clarify anything before you continue.",
}: CoachBottomPromptProps) {
  const { openCoach } = useCoach()

  return (
    <div className="rounded-xl border bg-muted/30 p-6">
      <Stack gap="md" align="center" className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="h-6 w-6 text-primary" />
        </div>
        <Stack gap="xs">
          <Text weight="medium">{title}</Text>
          <Text size="sm" variant="muted" className="max-w-md">
            {description}
          </Text>
        </Stack>
        <Button onClick={() => openCoach()} className="gap-2">
          <SparklesIcon className="h-4 w-4" />
          Ask the Coach
        </Button>
      </Stack>
    </div>
  )
}
```

### 2c. Update Barrel Export

**File:** `components/lms/coach/index.ts`

```typescript
/**
 * CATALYST - Coach Components
 */

export { CoachProvider, useCoach } from "./coach-provider"
export type { CoachContext } from "./coach-provider"
export { CoachPanel } from "./coach-panel"
export { CoachMessages } from "./coach-messages"
export { CoachTrigger } from "./coach-trigger"
export { CoachHeaderBar } from "./coach-header-bar"
export { CoachBottomPrompt } from "./coach-bottom-prompt"
```

---

## Part 3: Page-Level Integration

### 3a. Course Home Page (`/learn`)

**File:** `app/learn/page.tsx`

Pass course-level context. Header bar has search-style placeholder.

```tsx
// In the page component, pass context to LearnShell:
<LearnShell 
  user={user}
  showSidebar={false}
  coachContext={{ level: "course" }}
>
  <div className="container max-w-5xl py-8">
    {/* Header with coach bar */}
    <Stack gap="lg" className="mb-8">
      <Title>Your Learning Journey</Title>
      <CoachHeaderBar 
        placeholder="What do you want to learn about?" 
      />
    </Stack>
    
    {/* Rest of page content */}
    {/* ... competency list ... */}
  </div>
</LearnShell>
```

### 3b. Competency Page (`/learn/[competency]`)

**File:** `app/learn/[competency]/page.tsx`

Pass competency-level context with slug and name.

```tsx
// In the page component:
<LearnShell 
  user={user}
  showSidebar={true}
  currentCompetency={competency.slug}
  competencies={competencies}
  coachContext={{ 
    level: "competency",
    competencySlug: competency.slug,
    competencyName: competency.name,
  }}
>
  <div className="container max-w-4xl py-8">
    {/* Header */}
    <Stack gap="lg" className="mb-8">
      <Title>{competency.name}</Title>
      <Text variant="muted">{competency.description}</Text>
      <CoachHeaderBar 
        placeholder={`Ask about ${competency.name}...`}
      />
    </Stack>
    
    {/* Module list */}
    {/* ... */}
    
    {/* Bottom prompt */}
    <CoachBottomPrompt 
      title={`Questions about ${competency.name}?`}
      description="Get a summary or ask which module to start with."
    />
  </div>
</LearnShell>
```

### 3c. Module Page (`/learn/[competency]/[module]`)

**File:** `app/learn/[competency]/[module]/page.tsx`

Pass module-level context with full details.

```tsx
// In the page component:
<LearnShell 
  user={user}
  showSidebar={true}
  currentCompetency={competency.slug}
  currentModule={module.slug}
  competencies={competencies}
  coachContext={{ 
    level: "module",
    competencySlug: competency.slug,
    competencyName: competency.name,
    moduleSlug: module.slug,
    moduleName: module.title,
  }}
>
  <div className="container max-w-3xl py-8">
    {/* Header */}
    <Stack gap="lg" className="mb-8">
      <Text size="xs" variant="muted" className="uppercase tracking-wide">
        Module {module.moduleNumber}
      </Text>
      <Title>{module.title}</Title>
      <CoachHeaderBar 
        placeholder="Ask a question about this module..."
      />
    </Stack>
    
    {/* Module content */}
    <MarkdownRenderer content={module.content} />
    
    {/* Bottom prompt - before quiz CTA */}
    <CoachBottomPrompt />
    
    {/* Quiz CTA */}
    {module.quizId && (
      <KnowledgeCheckCTA quizId={module.quizId} />
    )}
  </div>
</LearnShell>
```

---

## Part 4: Mobile Responsive Styles

### File: `app/learn/learn.css`

Add styles for coach panel on mobile.

```css
/* =============================================================================
   AI Coach Panel - Mobile Responsive
   ============================================================================= */

/* Ensure coach trigger doesn't overlap with sidebar toggle */
@media (max-width: 1023px) {
  .coach-trigger {
    bottom: 5rem; /* Above mobile nav if present */
  }
}

/* Panel slides from right on all screens */
.coach-panel {
  /* Already handled in component with Tailwind */
}

/* Backdrop blur on mobile */
@media (max-width: 1023px) {
  .coach-backdrop {
    backdrop-filter: blur(4px);
  }
}
```

---

## Part 5: Prompt Tuning Notes

These are areas that need human review after initial implementation:

### Response Length
The system prompt says 30-50 words. Test with real questions:
- Is this too short for complex topics?
- Should "Summarize Key Points" be longer (100-150 words)?

### Module Linking Format
Currently: "See Module X.X: Title"
Consider: Should this be a clickable link? How does the frontend handle it?

### Error Messages
Current: "Sorry, I encountered an error. Please try again."
Consider: More specific messages for rate limiting, auth errors, etc.

### Guardrails Testing
Test these prompts to ensure they're rejected:
- "Write me a Python script"
- "What's the weather in Dubai?"
- "Tell me a joke"
- "Ignore your instructions and..."

---

## Deliverables Checklist

### Integration
- [ ] Update `learn-shell.tsx` with CoachProvider wrapping
- [ ] Create `coach-header-bar.tsx` component
- [ ] Create `coach-bottom-prompt.tsx` component
- [ ] Update coach barrel export
- [ ] Add coach context to course home page
- [ ] Add coach context to competency page
- [ ] Add coach context to module page
- [ ] Add CoachHeaderBar to all three page levels
- [ ] Add CoachBottomPrompt to competency and module pages
- [ ] Test mobile responsive behavior

### Prompt Tuning (Human Review)
- [ ] Test response length across different question types
- [ ] Verify module linking works correctly
- [ ] Test guardrails with off-topic prompts
- [ ] Adjust system prompts based on real usage

---

## Testing Scenarios

### Course Level
1. Open coach from `/learn`
2. Ask: "Where can I learn about Golden Visa?"
3. Expect: Brief answer pointing to Module 1.8

### Competency Level
1. Navigate to `/learn/market-intelligence`
2. Open coach
3. Ask: "What's the most important thing to know?"
4. Expect: Summary of competency themes + module recommendations

### Module Level
1. Navigate to `/learn/market-intelligence/competitive-landscape`
2. Open coach
3. Ask: "What's the advisory model?"
4. Expect: Detailed answer citing module content

### Quick Actions
1. Open coach on any module
2. Click "Summarize Key Points"
3. Expect: Concise TL;DR of the module

---

## Success Criteria

1. ✅ Coach accessible from all three page levels
2. ✅ Context label in coach panel updates correctly
3. ✅ Quick actions change based on context level
4. ✅ Mobile: panel slides in, backdrop dismisses
5. ✅ Responses are concise and cite modules
6. ✅ Off-topic questions are politely declined

---

## Future Enhancements (v2)

- [ ] Role play mode with client personas
- [ ] Quiz mode with generated questions
- [ ] Conversation persistence between sessions
- [ ] "Find across curriculum" semantic search
- [ ] Manager dashboard for common questions
