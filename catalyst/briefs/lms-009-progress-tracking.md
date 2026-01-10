# LMS-009: Progress Tracking Integration

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 day  
**Dependencies:** LMS-001, LMS-004, LMS-006, LMS-007  

---

## Objective

Implement comprehensive progress tracking across the LMS. This includes server actions for recording progress, real-time updates to the UI, and ensuring all components reflect actual user progress.

---

## Scope

1. Server actions for progress mutations
2. Progress hooks for client components
3. Integration with Dashboard, Competency, Module, and Quiz pages
4. Sidebar progress indicators

---

## Deliverables

### 1. Server Actions

Create `lib/actions/learning-actions.ts`:

```typescript
/**
 * CATALYST - Learning Progress Server Actions
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

/**
 * Mark a module as started
 */
export async function startModule(moduleId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // Check if progress already exists
  const { data: existing } = await supabase
    .from("learning_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .single()
  
  if (existing) {
    // Already started
    return { success: true }
  }
  
  // Create new progress record
  const { error } = await supabase
    .from("learning_progress")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  // Revalidate affected pages
  revalidatePath("/learn")
  
  return { success: true }
}

/**
 * Mark a module as completed
 */
export async function completeModule(moduleId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // Upsert progress record
  const { error } = await supabase
    .from("learning_progress")
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      status: "completed",
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,module_id",
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  // Revalidate affected pages
  revalidatePath("/learn")
  
  return { success: true }
}

/**
 * Submit quiz attempt and update progress
 */
export async function submitQuizAttempt(data: {
  quizId: string
  moduleId: string
  answers: Record<string, string>
  score: number
  totalQuestions: number
}): Promise<{ success: boolean; passed: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, passed: false, error: "Not authenticated" }
  }
  
  const percentage = (data.score / data.totalQuestions) * 100
  const passed = percentage >= 70
  
  // Record quiz attempt
  const { error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      quiz_id: data.quizId,
      score: data.score,
      total_questions: data.totalQuestions,
      answers: data.answers,
      passed,
    })
  
  if (attemptError) {
    return { success: false, passed: false, error: attemptError.message }
  }
  
  // If passed, mark module as completed
  if (passed) {
    await completeModule(data.moduleId)
  }
  
  // Revalidate affected pages
  revalidatePath("/learn")
  
  return { success: true, passed }
}

/**
 * Get current user's overall progress stats
 */
export async function getProgressStats(): Promise<{
  totalModules: number
  completedModules: number
  totalQuizzes: number
  passedQuizzes: number
  currentStreak: number
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get total modules
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
  
  // Get completed modules
  const { count: completedModules } = await supabase
    .from("learning_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed")
  
  // Get total quizzes
  const { count: totalQuizzes } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true })
  
  // Get passed quizzes
  const { count: passedQuizzes } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("passed", true)
  
  // Calculate streak (consecutive days with activity)
  const { data: recentActivity } = await supabase
    .from("learning_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(30)
  
  const streak = calculateStreak(recentActivity?.map((a) => a.completed_at) ?? [])
  
  return {
    totalModules: totalModules ?? 0,
    completedModules: completedModules ?? 0,
    totalQuizzes: totalQuizzes ?? 0,
    passedQuizzes: passedQuizzes ?? 0,
    currentStreak: streak,
  }
}

/**
 * Calculate consecutive day streak
 */
function calculateStreak(dates: (string | null)[]): number {
  if (dates.length === 0) return 0
  
  const validDates = dates
    .filter((d): d is string => d !== null)
    .map((d) => new Date(d).toDateString())
  
  const uniqueDays = [...new Set(validDates)]
  
  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  // Check if today or yesterday has activity
  if (!uniqueDays.includes(today) && !uniqueDays.includes(yesterday)) {
    return 0
  }
  
  // Count consecutive days
  for (let i = 0; i < uniqueDays.length; i++) {
    const expectedDate = new Date(Date.now() - i * 86400000).toDateString()
    if (uniqueDays.includes(expectedDate)) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}
```

### 2. Progress Hook

Create `lib/hooks/use-learning-progress.ts`:

```typescript
/**
 * CATALYST - Learning Progress Hook
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { startModule, completeModule, getProgressStats } from "@/lib/actions/learning-actions"

interface ProgressStats {
  totalModules: number
  completedModules: number
  totalQuizzes: number
  passedQuizzes: number
  currentStreak: number
}

export function useLearningProgress() {
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch initial stats
  useEffect(() => {
    async function fetchStats() {
      const data = await getProgressStats()
      setStats(data)
      setIsLoading(false)
    }
    fetchStats()
  }, [])
  
  // Mark module as started
  const markStarted = useCallback(async (moduleId: string) => {
    const result = await startModule(moduleId)
    if (result.success) {
      // Refresh stats
      const data = await getProgressStats()
      setStats(data)
    }
    return result
  }, [])
  
  // Mark module as completed
  const markCompleted = useCallback(async (moduleId: string) => {
    const result = await completeModule(moduleId)
    if (result.success) {
      // Refresh stats
      const data = await getProgressStats()
      setStats(data)
    }
    return result
  }, [])
  
  return {
    stats,
    isLoading,
    markStarted,
    markCompleted,
  }
}
```

### 3. Module Page Progress Integration

Update module page to track when user views content:

```tsx
// In app/learn/[competency]/[module]/page.tsx

import { startModule } from "@/lib/actions/learning-actions"

export default async function ModulePage({ params }: PageProps) {
  // ... existing code ...
  
  // Mark module as started on view (server-side)
  if (module.id) {
    await startModule(module.id)
  }
  
  // ... rest of component ...
}
```

### 4. Quiz Integration

Update quiz page to properly submit progress:

```tsx
// In app/learn/quiz/[quizId]/page.tsx

import { submitQuizAttempt } from "@/lib/actions/learning-actions"

// In handleAnswerSubmit function:
const handleComplete = async () => {
  const result = await submitQuizAttempt({
    quizId: quiz.id,
    moduleId: quiz.moduleId,
    answers: newAnswers,
    score: finalScore,
    totalQuestions,
  })
  
  if (result.passed) {
    // Show success state
  }
}
```

### 5. Sidebar Progress Indicators

Update `app/learn/_surface/competency-sidebar.tsx`:

```tsx
/**
 * CATALYST - Competency Sidebar with Progress
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { CheckCircle2Icon, CircleIcon, PlayCircleIcon } from "lucide-react"
import type { ModuleWithProgress } from "@/lib/learning-types"

interface CompetencySidebarProps {
  competencySlug: string
  competencyTitle: string
  modules: ModuleWithProgress[]
}

export function CompetencySidebar({ 
  competencySlug, 
  competencyTitle, 
  modules 
}: CompetencySidebarProps) {
  const pathname = usePathname()
  
  return (
    <nav className="p-4">
      <Stack gap="sm">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground px-2">
          {competencyTitle}
        </Text>
        
        {modules.map((module) => {
          const isActive = pathname === `/learn/${competencySlug}/${module.slug}`
          
          return (
            <Link
              key={module.slug}
              href={`/learn/${competencySlug}/${module.slug}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <ModuleStatusIcon status={module.status} isActive={isActive} />
              <Text size="sm" className="flex-1 truncate">
                {module.title}
              </Text>
            </Link>
          )
        })}
      </Stack>
    </nav>
  )
}

function ModuleStatusIcon({ 
  status, 
  isActive 
}: { 
  status: "not_started" | "in_progress" | "completed"
  isActive: boolean 
}) {
  if (status === "completed") {
    return (
      <CheckCircle2Icon 
        className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive ? "text-primary-foreground" : "text-green-500"
        )} 
      />
    )
  }
  
  if (status === "in_progress") {
    return (
      <PlayCircleIcon 
        className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive ? "text-primary-foreground" : "text-amber-500"
        )} 
      />
    )
  }
  
  return (
    <CircleIcon 
      className={cn(
        "h-4 w-4 flex-shrink-0",
        isActive ? "text-primary-foreground/50" : "text-muted-foreground/30"
      )} 
    />
  )
}
```

### 6. Dashboard Stats Component

Update stats display to use real data:

```tsx
// In app/learn/page.tsx or components/lms/dashboard-stats.tsx

import { getProgressStats } from "@/lib/actions/learning-actions"

export async function DashboardStats() {
  const stats = await getProgressStats()
  
  if (!stats) {
    return <p>Sign in to track your progress</p>
  }
  
  const progressPercentage = stats.totalModules > 0
    ? Math.round((stats.completedModules / stats.totalModules) * 100)
    : 0
  
  return (
    <Grid cols={4} gap="md">
      <StatCard
        label="Progress"
        value={`${progressPercentage}%`}
        subtext={`${stats.completedModules}/${stats.totalModules} modules`}
      />
      <StatCard
        label="Quizzes Passed"
        value={`${stats.passedQuizzes}/${stats.totalQuizzes}`}
        subtext="Knowledge checks"
      />
      <StatCard
        label="Current Streak"
        value={`${stats.currentStreak}`}
        subtext="days"
      />
      <StatCard
        label="Time Spent"
        value="—"
        subtext="Coming soon"
      />
    </Grid>
  )
}
```

---

## Types to Add

Add to `lib/learning-types.ts`:

```typescript
export type ModuleStatus = "not_started" | "in_progress" | "completed"

export interface ModuleWithProgress {
  id: string
  slug: string
  title: string
  order: number
  status: ModuleStatus
}

export interface ProgressStats {
  totalModules: number
  completedModules: number
  totalQuizzes: number
  passedQuizzes: number
  currentStreak: number
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `lib/actions/learning-actions.ts` | CREATE |
| `lib/hooks/use-learning-progress.ts` | CREATE |
| `app/learn/[competency]/[module]/page.tsx` | UPDATE — Add startModule call |
| `app/learn/quiz/[quizId]/page.tsx` | UPDATE — Use submitQuizAttempt |
| `app/learn/_surface/competency-sidebar.tsx` | UPDATE — Add progress indicators |
| `app/learn/page.tsx` | UPDATE — Use real stats |
| `lib/learning-types.ts` | UPDATE — Add progress types |

---

## Database Requirements

Ensure tables have these columns (from LMS-001):

**learning_progress:**
- `user_id` (uuid, FK to users)
- `module_id` (uuid, FK to learning_modules)
- `status` (text: 'not_started', 'in_progress', 'completed')
- `started_at` (timestamp)
- `completed_at` (timestamp)
- Unique constraint on (user_id, module_id)

**quiz_attempts:**
- `user_id` (uuid, FK to users)
- `quiz_id` (uuid, FK to quizzes)
- `score` (int)
- `total_questions` (int)
- `answers` (jsonb)
- `passed` (boolean)
- `created_at` (timestamp)

---

## Acceptance Criteria

- [ ] Module is automatically marked as started when user views it
- [ ] Module is marked completed when quiz is passed
- [ ] Sidebar shows correct icons for each status
- [ ] Dashboard shows accurate completion percentage
- [ ] Quiz pass rate is tracked correctly
- [ ] Streak calculation works for consecutive days
- [ ] Anonymous users see "Sign in to track progress" message
- [ ] Progress persists across sessions
- [ ] Page revalidation happens after progress updates

---

## Notes

- Use `revalidatePath` to ensure cached pages show updated progress
- Consider adding optimistic updates for better UX
- Time tracking can be added in Phase 2 with more complex client-side logic
- Streak calculation is basic — could be enhanced with timezone awareness
