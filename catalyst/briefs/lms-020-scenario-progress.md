# LMS-020: Scenario Progress & Reflection Tracking

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 4-6 hours  
**Dependencies:** LMS-016 (Scenario Integration), LMS-019 (Sidebar Navigation)  

---

## Objective

Implement scenario completion tracking through a reflection-based model. Users complete a scenario by submitting a learning-oriented reflection that captures their insights and future improvements. This progress integrates with the overall learning journey.

---

## Background

### Current State

- **Scenarios exist:** 6 categories with 20+ scenarios each in `scenarios` table
- **No completion tracking:** Scenarios have no equivalent to `learning_progress` table
- **Module progress works:** Users progress through modules via quiz completion
- **Reflection-based completion:** Scenarios are "complete" when a meaningful reflection is submitted

### Completion Philosophy

Scenario completion is **reflection-based, not task-based**. The user must:
1. Practice the scenario (externally, with AI tools)
2. Return and submit a reflection answering:
   - **What did you learn?** — Key insights from the practice
   - **What would you do differently next time?** — Improvements identified

This ensures scenarios aren't just "checked off" but drive genuine learning.

---

## Scope

### Part 1: Database Schema
- Create `scenario_progress` table for tracking completions
- Store reflection content with the progress record

### Part 2: Server Actions
- `completeScenario` action to save reflection and mark complete
- `getScenarioProgress` to fetch user's scenario completions

### Part 3: UI Components
- Reflection form component for submitting completions
- Progress indicators on scenario cards/lists
- Integration with scenario detail accordion

### Part 4: Layout Fixes
- **CSS Fix:** Content in sidebar layout is left-aligned instead of centered
- Fix scenario category page layout (not using LearnShell correctly)
- Fix quiz page layout (builds own shell instead of LearnShell)
- Fix admin certification page layout (builds own shell without sidebar)

---

## Deliverables

### 1. Database Migration

Create migration `20260114_scenario_progress.sql`:

```sql
-- Scenario Progress & Reflections
-- Tracks scenario completion through learning reflections

CREATE TABLE IF NOT EXISTS scenario_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_category TEXT NOT NULL,      -- e.g., 'objections', 'discovery'
  scenario_id TEXT NOT NULL,            -- e.g., 'OB-01', 'DS-03'
  
  -- Reflection content (required for completion)
  reflection_learned TEXT NOT NULL,     -- "What did you learn?"
  reflection_improve TEXT NOT NULL,     -- "What would you do differently?"
  
  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one completion per user per scenario
  UNIQUE(user_id, scenario_category, scenario_id)
);

-- Comments
COMMENT ON TABLE scenario_progress IS 'Tracks scenario completion via learning reflections';
COMMENT ON COLUMN scenario_progress.reflection_learned IS 'User reflection on key learnings from practice';
COMMENT ON COLUMN scenario_progress.reflection_improve IS 'User reflection on improvements for next time';

-- Indexes
CREATE INDEX idx_scenario_progress_user ON scenario_progress(user_id);
CREATE INDEX idx_scenario_progress_category ON scenario_progress(scenario_category);

-- RLS
ALTER TABLE scenario_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can view own scenario progress"
  ON scenario_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can create own scenario progress"
  ON scenario_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own scenario progress"
  ON scenario_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all scenario progress"
  ON scenario_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger
CREATE TRIGGER update_scenario_progress_updated_at
  BEFORE UPDATE ON scenario_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Server Actions

Create/update `lib/actions/scenario-actions.ts`:

```typescript
/**
 * CATALYST - Scenario Progress Server Actions
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ScenarioReflection {
  learned: string    // What did you learn?
  improve: string    // What would you do differently?
}

export interface ScenarioProgress {
  scenarioCategory: string
  scenarioId: string
  reflectionLearned: string
  reflectionImprove: string
  completedAt: string
}

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

/**
 * Complete a scenario by submitting a reflection
 */
export async function completeScenario(
  category: string,
  scenarioId: string,
  reflection: ScenarioReflection
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // Validate reflection content
  if (!reflection.learned?.trim() || reflection.learned.trim().length < 20) {
    return { success: false, error: "Please provide a meaningful reflection on what you learned (at least 20 characters)" }
  }
  
  if (!reflection.improve?.trim() || reflection.improve.trim().length < 20) {
    return { success: false, error: "Please describe what you would do differently next time (at least 20 characters)" }
  }
  
  // Upsert progress record
  const { error } = await supabase
    .from("scenario_progress")
    .upsert({
      user_id: user.id,
      scenario_category: category,
      scenario_id: scenarioId,
      reflection_learned: reflection.learned.trim(),
      reflection_improve: reflection.improve.trim(),
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,scenario_category,scenario_id",
    })
  
  if (error) {
    console.error("Failed to save scenario progress:", error)
    return { success: false, error: "Failed to save reflection" }
  }
  
  // Revalidate affected pages
  revalidatePath("/learn/scenarios")
  revalidatePath(`/learn/scenarios/${category}`)
  revalidatePath("/learn/progress")
  
  return { success: true }
}

/**
 * Get user's scenario progress for a category
 */
export async function getScenarioProgress(
  category?: string
): Promise<ScenarioProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  let query = supabase
    .from("scenario_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
  
  if (category) {
    query = query.eq("scenario_category", category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error("Failed to fetch scenario progress:", error)
    return []
  }
  
  return (data || []).map(p => ({
    scenarioCategory: p.scenario_category,
    scenarioId: p.scenario_id,
    reflectionLearned: p.reflection_learned,
    reflectionImprove: p.reflection_improve,
    completedAt: p.completed_at,
  }))
}

/**
 * Get count of completed scenarios for progress display
 */
export async function getScenarioCompletionStats(): Promise<{
  total: number
  byCategory: Record<string, number>
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { total: 0, byCategory: {} }
  }
  
  const { data, error } = await supabase
    .from("scenario_progress")
    .select("scenario_category")
    .eq("user_id", user.id)
  
  if (error) {
    console.error("Failed to fetch scenario stats:", error)
    return { total: 0, byCategory: {} }
  }
  
  const byCategory: Record<string, number> = {}
  for (const row of data || []) {
    byCategory[row.scenario_category] = (byCategory[row.scenario_category] || 0) + 1
  }
  
  return {
    total: data?.length || 0,
    byCategory,
  }
}
```

### 3. Reflection Form Component

Create `app/learn/scenarios/[category]/_components/scenario-reflection.tsx`:

```typescript
"use client"

/**
 * CATALYST - Scenario Reflection Form
 * 
 * Form for submitting learning reflections to complete scenarios.
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, PencilIcon, Loader2Icon } from "lucide-react"
import { completeScenario } from "@/lib/actions/scenario-actions"

interface ScenarioReflectionProps {
  category: string
  scenarioId: string
  isCompleted?: boolean
  existingReflection?: {
    learned: string
    improve: string
  }
  onComplete?: () => void
}

export function ScenarioReflection({
  category,
  scenarioId,
  isCompleted = false,
  existingReflection,
  onComplete,
}: ScenarioReflectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [learned, setLearned] = useState(existingReflection?.learned || "")
  const [improve, setImprove] = useState(existingReflection?.improve || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await completeScenario(category, scenarioId, {
      learned,
      improve,
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsOpen(false)
      onComplete?.()
    } else {
      setError(result.error || "Failed to save reflection")
    }
  }

  if (isCompleted && !isOpen) {
    return (
      <div className="scenario-reflection scenario-reflection--completed">
        <div className="scenario-reflection__status">
          <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
          <span>Completed</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="scenario-reflection__edit"
        >
          <PencilIcon className="h-3 w-3" />
          View/Edit Reflection
        </Button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="scenario-reflection__trigger"
      >
        <CheckCircleIcon className="h-4 w-4" />
        Mark as Complete
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="scenario-reflection__form">
      <div className="scenario-reflection__header">
        <h4>Complete This Scenario</h4>
        <p>Reflect on your practice to mark this scenario complete.</p>
      </div>

      <div className="scenario-reflection__field">
        <label htmlFor={`learned-${scenarioId}`}>
          What did you learn from this scenario?
        </label>
        <textarea
          id={`learned-${scenarioId}`}
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          placeholder="Key insights, techniques, or approaches you discovered..."
          rows={3}
          required
          minLength={20}
        />
      </div>

      <div className="scenario-reflection__field">
        <label htmlFor={`improve-${scenarioId}`}>
          What would you do differently next time?
        </label>
        <textarea
          id={`improve-${scenarioId}`}
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          placeholder="Areas for improvement, alternative approaches to try..."
          rows={3}
          required
          minLength={20}
        />
      </div>

      {error && (
        <div className="scenario-reflection__error">
          {error}
        </div>
      )}

      <div className="scenario-reflection__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4" />
              Complete Scenario
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
```

### 4. Update Scenario Accordion

Update `scenario-accordion.tsx` to include reflection form and completion status:

```typescript
// Add to ScenarioItem component props
interface ScenarioItemProps {
  scenario: ParsedScenario
  isOpen: boolean
  onToggle: () => void
  isCompleted?: boolean
  existingReflection?: { learned: string; improve: string }
  category: string
  onComplete?: () => void
}

// Add completion indicator to header
<div className="scenario-item__header-right">
  {isCompleted && (
    <span className="scenario-item__completed">
      <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
    </span>
  )}
  {/* ... existing stars and chevron */}
</div>

// Add reflection form at bottom of expanded content
{isOpen && (
  <div className="scenario-item__content">
    {/* ... existing scenario content */}
    
    <div className="scenario-item__reflection">
      <ScenarioReflection
        category={category}
        scenarioId={scenario.id}
        isCompleted={isCompleted}
        existingReflection={existingReflection}
        onComplete={onComplete}
      />
    </div>
  </div>
)}
```

### 5. CSS for Reflection Form

Add to `learn.css`:

```css
/* =============================================================================
   Scenario Reflection Form
   ============================================================================= */

.scenario-reflection {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-150);
}

.scenario-reflection--completed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: oklch(from var(--color-success) l c h / 0.08);
  border-radius: var(--lms-radius-sm);
  border: 1px solid oklch(from var(--color-success) l c h / 0.2);
}

.scenario-reflection__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-success);
}

.scenario-reflection__trigger {
  width: 100%;
  justify-content: center;
}

.scenario-reflection__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--gray-50);
  border-radius: var(--lms-radius-md);
  border: 1px solid var(--gray-150);
}

.scenario-reflection__header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.scenario-reflection__header p {
  font-size: 0.8125rem;
  color: var(--gray-500);
}

.scenario-reflection__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scenario-reflection__field label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--gray-700);
}

.scenario-reflection__field textarea {
  padding: 0.75rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--lms-radius-sm);
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 5rem;
  transition: border-color var(--lms-transition-fast);
}

.scenario-reflection__field textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 0.1);
}

.scenario-reflection__error {
  padding: 0.625rem 0.875rem;
  background: oklch(from var(--color-destructive) l c h / 0.1);
  border-radius: var(--lms-radius-sm);
  font-size: 0.8125rem;
  color: var(--color-destructive);
}

.scenario-reflection__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
}
```

### 6. Fix Layout Issues

#### A. CSS Fix — Content Left-Aligned in Sidebar Layout (Affects All Pages)

**Problem:** The CSS rule `.learn-shell--with-sidebar .learn-content` sets `margin: 0` which left-aligns content. Pages without a Table of Contents (ToC) should center their content.

**Current CSS:**
```css
.learn-shell--with-sidebar .learn-content {
  max-width: 54rem;
  margin: 0;  /* Left-aligns content */
  padding: 2rem 2.5rem 4rem;
}
```

**Fix:** Center content by default, let ToC wrapper handle left-alignment when ToC present:
```css
.learn-shell--with-sidebar .learn-content {
  max-width: 54rem;
  margin: 0 auto;  /* Center content */
  padding: 2rem 2.5rem 4rem;
}

/* When ToC wrapper is present, content goes left to make room for ToC */
.learn-content-wrapper .learn-content {
  margin: 0;
}
```

**Affected pages (will be fixed automatically):**
- RERA Practice Quizzes (`/learn/quiz/rera`)
- My Progress (`/learn/progress`)
- Certification (`/learn/certification`)
- Competency pages (`/learn/[competency]`)
- Scenarios index (`/learn/scenarios`)
- Course overview (`/learn`)

#### B. Pages Building Own Shell (Need Code Changes)

Three pages build their own shells instead of using `LearnShell`:

**1. Scenario Category Page (`app/learn/scenarios/[category]/page.tsx`)**

Uses `<div className="learn-shell">` without `--with-sidebar` modifier.

**Fix:** Use LearnShell component
```tsx
import { LearnShell } from "../../_surface/learn-shell"

return (
  <LearnShell activeSection="scenarios">
    <div className="learn-content">
      {/* ... existing content ... */}
    </div>
  </LearnShell>
)
```

**2. Quiz Page (`app/learn/quiz/[quizId]/page.tsx`)**

Builds own shell with `learn-shell--with-sidebar` class and custom `QuizSidebar` component.

**Fix:** Use LearnShell component
```tsx
import { LearnShell } from "../../_surface/learn-shell"

const activeSection = isRERAQuiz ? "rera" : "course"

return (
  <LearnShell activeSection={activeSection}>
    <div className="learn-content">
      {/* ... existing quiz content ... */}
    </div>
  </LearnShell>
)
```

**3. Admin Certification Page (`app/learn/admin/certification/page.tsx`)**

Uses `<div className="learn-shell">` without sidebar.

**Fix:** Use LearnShell component
```tsx
import { LearnShell } from "../../_surface/learn-shell"

return (
  <LearnShell activeSection="admin" userRole="admin">
    <div className="learn-content">
      {/* ... existing admin content ... */}
    </div>
  </LearnShell>
)
```

#### Summary

| Issue | Fix Type | Scope |
|-------|----------|-------|
| Content left-aligned | CSS change | All pages with sidebar |
| Scenario category no sidebar | Use LearnShell | 1 page |
| Quiz page custom shell | Use LearnShell | 1 page |
| Admin cert no sidebar | Use LearnShell | 1 page |

### 7. Update Category Page with Progress

Update `app/learn/scenarios/[category]/page.tsx` to fetch and display progress:

```typescript
// Add to data fetching
import { getScenarioProgress } from "@/lib/actions/scenario-actions"

// In page component
const progress = await getScenarioProgress(slug)
const completedIds = new Set(progress.map(p => p.scenarioId))
const progressMap = Object.fromEntries(
  progress.map(p => [p.scenarioId, { learned: p.reflectionLearned, improve: p.reflectionImprove }])
)

// Pass to accordion
<ScenarioAccordion 
  scenarios={scenarios}
  category={slug}
  completedIds={completedIds}
  progressMap={progressMap}
/>
```

### 8. Progress Page Integration

Add scenario progress to `/learn/progress` page:

```typescript
// Add to existing progress page
import { getScenarioCompletionStats } from "@/lib/actions/scenario-actions"

// Fetch stats
const scenarioStats = await getScenarioCompletionStats()

// Display section
<section className="progress-section">
  <h2>Scenario Practice</h2>
  <p className="progress-section__subtitle">
    {scenarioStats.total} scenarios completed
  </p>
  
  <div className="progress-categories">
    {Object.entries(scenarioStats.byCategory).map(([category, count]) => (
      <div key={category} className="progress-category">
        <span className="progress-category__name">{category}</span>
        <span className="progress-category__count">{count} completed</span>
      </div>
    ))}
  </div>
</section>
```

---

## Testing

### Database
- [ ] Migration applies cleanly
- [ ] RLS policies work correctly
- [ ] Unique constraint prevents duplicate completions

### Server Actions
- [ ] `completeScenario` validates reflection content
- [ ] `completeScenario` saves and returns success
- [ ] `getScenarioProgress` returns correct data
- [ ] `getScenarioCompletionStats` aggregates correctly

### UI
- [ ] Reflection form displays on unopened scenarios
- [ ] Completed indicator shows on header
- [ ] Edit reflection works for already-completed
- [ ] Form validation shows meaningful errors
- [ ] Success state updates UI without reload

### Layout
- [ ] Scenario index page centered correctly with sidebar
- [ ] Scenario category page centered correctly with sidebar
- [ ] Quiz page uses LearnShell with sidebar
- [ ] Admin certification page uses LearnShell with sidebar
- [ ] Mobile responsive layout works on all fixed pages
- [ ] No content clipping at small screen sizes

---

## Success Criteria

1. **Reflection-based completion works** — Users can submit meaningful reflections
2. **Progress tracked in database** — All completions stored with reflection content
3. **Visual feedback** — Clear completed/incomplete indicators
4. **Layout fixed** — Both scenario pages centered correctly with sidebar
5. **Progress page updated** — Scenario completions shown on progress page

---

## Files to Create/Modify

### Create
- `supabase/migrations/20260114_scenario_progress.sql`
- `lib/actions/scenario-actions.ts`
- `app/learn/scenarios/[category]/_components/scenario-reflection.tsx`

### Modify
- `app/learn/scenarios/[category]/page.tsx` — Use LearnShell, add progress
- `app/learn/scenarios/[category]/_components/scenario-accordion.tsx` — Add reflection UI
- `app/learn/quiz/[quizId]/page.tsx` — Use LearnShell instead of own shell
- `app/learn/admin/certification/page.tsx` — Use LearnShell instead of own shell
- `app/learn/learn.css` — Add reflection form styles
- `app/learn/progress/page.tsx` — Add scenario stats section

---

## Notes

- Reflections must be meaningful (min 20 chars each field) to count as completion
- Users can update their reflections even after completion
- Progress integrates with existing certification readiness checks
- Consider adding reflection prompts based on scenario type in future iteration
