# LMS-001: Data Layer Foundation

**Status:** 📋 READY  
**Priority:** Critical (blocks LMS-004, 005, 006, 007, 009)  
**Estimated Time:** 1-2 days  
**Dependencies:** None  

---

## Objective

Create the data access layer for the Learning Management System. This provides typed functions to fetch competencies, modules, progress, and quizzes from Supabase, plus server actions for user interactions.

---

## Context

The LMS currently uses hardcoded mock data throughout the UI. Supabase tables exist but are not connected:

- `competencies` — 9 rows (just synced)
- `learning_modules` — 0 rows (needs population via LMS-002)
- `quiz_questions` — 0 rows (needs population via LMS-002)
- `learning_progress` — Ready for tracking
- `quiz_attempts` — Ready for tracking

This brief creates the TypeScript layer that all LMS pages will use.

---

## Deliverables

### 1. Create `lib/learning-types.ts`

Type definitions for all LMS entities. Uses **flexible JSONB** for frontmatter — we don't force content into rigid fields.

```typescript
/**
 * CATALYST - Learning Types
 * 
 * Type definitions for LMS entities.
 * Can be imported in both Server and Client Components.
 * 
 * Key principle: frontmatter is stored as JSONB, not rigid columns.
 * This allows different modules to have different fields without schema changes.
 */

// =============================================================================
// DATABASE ENTITY TYPES
// =============================================================================

export interface Competency {
  id: string
  slug: string
  name: string
  description: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface LearningModule {
  id: string
  competencyId: string
  slug: string
  title: string
  description: string | null
  moduleNumber: string | null           // "1.2", "0.1", etc.
  type: "knowledge" | "skills" | "skills-script"
  estimatedDuration: string | null      // "25 minutes"
  displayOrder: number
  
  // Full markdown content (after frontmatter)
  content: string
  
  // Flexible frontmatter - stores ALL fields from markdown as JSONB
  // Access specific fields: module.frontmatter?.learningObjectives
  frontmatter: Record<string, unknown> | null
  
  createdAt: string
  updatedAt: string
}

export interface AudioTranscript {
  id: string
  moduleId: string | null
  competencyId: string | null
  slug: string
  title: string
  duration: string | null               // "8 minutes"
  voice: string                         // "coach"
  type: string                          // "demonstration", "summary", "walkthrough"
  transcript: string                    // Full markdown transcript
  audioUrl: string | null               // URL after TTS generation
  frontmatter: Record<string, unknown> | null
  createdAt: string
}

export interface QuizQuestion {
  id: string
  quizId: string                        // "market-intelligence-1"
  competencySlug: string
  relatedModule: string | null
  questionNumber: number
  questionText: string
  options: QuizOption[]
  explanation: string | null
  displayOrder: number
}

export interface QuizOption {
  text: string
  correct: boolean
}

export interface LearningProgress {
  id: string
  userId: string
  moduleId: string
  status: "not_started" | "in_progress" | "completed"
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface QuizAttempt {
  id: string
  userId: string
  moduleId: string
  score: number
  maxScore: number
  passed: boolean
  answers: Record<string, string> | null
  attemptedAt: string
}

// =============================================================================
// ENRICHED TYPES (with joins/computed fields)
// =============================================================================

export interface CompetencyWithModules extends Competency {
  modules: LearningModule[]
  moduleCount: number
}

export interface CompetencyWithProgress extends Competency {
  modules: ModuleWithProgress[]
  completedCount: number
  totalCount: number
  progressPercent: number
}

export interface ModuleWithProgress extends LearningModule {
  progress: LearningProgress | null
  isCompleted: boolean
  isLocked: boolean  // Based on previous module completion
}

export interface UserLearningStats {
  totalCompetencies: number
  completedCompetencies: number
  totalModules: number
  completedModules: number
  inProgressModules: number
  overallProgressPercent: number
  quizzesPassed: number
  quizzesTotal: number
}
```

### 2. Create `lib/learning.ts`

Server-only data fetching functions.

```typescript
/**
 * CATALYST - Learning Data Provider (Server Only)
 * 
 * Fetches LMS data from Supabase.
 * All functions are async and use the server-side Supabase client.
 */

import "server-only"
import { createClient } from "@/lib/supabase/server"
import type {
  Competency,
  CompetencyWithModules,
  CompetencyWithProgress,
  LearningModule,
  ModuleWithProgress,
  AudioTranscript,
  QuizQuestion,
  LearningProgress,
  QuizAttempt,
  UserLearningStats,
} from "./learning-types"

// =============================================================================
// COMPETENCY QUERIES
// =============================================================================

/**
 * Get all competencies in display order.
 */
export async function getCompetencies(): Promise<Competency[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select("*")
    .order("display_order", { ascending: true })
  
  if (error) throw error
  return transformCompetencies(data)
}

/**
 * Get a single competency by slug.
 */
export async function getCompetency(slug: string): Promise<Competency | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select("*")
    .eq("slug", slug)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null // Not found
    throw error
  }
  return transformCompetency(data)
}

/**
 * Get competency with all its modules.
 */
export async function getCompetencyWithModules(
  slug: string
): Promise<CompetencyWithModules | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select(`
      *,
      learning_modules (*)
    `)
    .eq("slug", slug)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  
  return {
    ...transformCompetency(data),
    modules: transformModules(data.learning_modules || []),
    moduleCount: data.learning_modules?.length || 0,
  }
}

/**
 * Get all competencies with user progress.
 */
export async function getCompetenciesWithProgress(
  userId: string
): Promise<CompetencyWithProgress[]> {
  const supabase = await createClient()
  
  // Get competencies with modules and progress
  const { data: competencies, error: compError } = await supabase
    .from("competencies")
    .select(`
      *,
      learning_modules (
        *,
        learning_progress!inner (*)
      )
    `)
    .order("display_order", { ascending: true })
  
  if (compError) throw compError
  
  // Get user's progress separately for modules without progress records
  const { data: progress, error: progError } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)
  
  if (progError) throw progError
  
  const progressMap = new Map(progress?.map(p => [p.module_id, p]) || [])
  
  return competencies.map(comp => {
    const modules = (comp.learning_modules || []).map(mod => ({
      ...transformModule(mod),
      progress: progressMap.get(mod.id) 
        ? transformProgress(progressMap.get(mod.id)!) 
        : null,
      isCompleted: progressMap.get(mod.id)?.status === "completed",
      isLocked: false, // TODO: Calculate based on previous module
    }))
    
    const completedCount = modules.filter(m => m.isCompleted).length
    
    return {
      ...transformCompetency(comp),
      modules,
      completedCount,
      totalCount: modules.length,
      progressPercent: modules.length > 0 
        ? Math.round((completedCount / modules.length) * 100) 
        : 0,
    }
  })
}

// =============================================================================
// MODULE QUERIES
// =============================================================================

/**
 * Get all modules for a competency.
 */
export async function getModules(competencyId: string): Promise<LearningModule[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("competency_id", competencyId)
    .order("display_order", { ascending: true })
  
  if (error) throw error
  return transformModules(data)
}

/**
 * Get a single module by competency slug and module slug.
 */
export async function getModule(
  competencySlug: string,
  moduleSlug: string
): Promise<LearningModule | null> {
  const supabase = await createClient()
  
  // First get competency ID
  const { data: comp, error: compError } = await supabase
    .from("competencies")
    .select("id")
    .eq("slug", competencySlug)
    .single()
  
  if (compError) {
    if (compError.code === "PGRST116") return null
    throw compError
  }
  
  const { data, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("competency_id", comp.id)
    .eq("slug", moduleSlug)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  
  return transformModule(data)
}

/**
 * Get module with progress for a user.
 */
export async function getModuleWithProgress(
  competencySlug: string,
  moduleSlug: string,
  userId: string
): Promise<ModuleWithProgress | null> {
  const module = await getModule(competencySlug, moduleSlug)
  if (!module) return null
  
  const supabase = await createClient()
  
  const { data: progress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", module.id)
    .single()
  
  return {
    ...module,
    progress: progress ? transformProgress(progress) : null,
    isCompleted: progress?.status === "completed",
    isLocked: false, // TODO: Calculate
  }
}

// =============================================================================
// QUIZ QUERIES
// =============================================================================

/**
 * Get quiz questions for a module.
 */
export async function getQuizQuestions(moduleId: string): Promise<QuizQuestion[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("module_id", moduleId)
    .order("display_order", { ascending: true })
  
  if (error) throw error
  return transformQuestions(data)
}

/**
 * Get user's quiz attempts for a module.
 */
export async function getQuizAttempts(
  userId: string,
  moduleId: string
): Promise<QuizAttempt[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .order("attempted_at", { ascending: false })
  
  if (error) throw error
  return transformAttempts(data)
}

// =============================================================================
// PROGRESS QUERIES
// =============================================================================

/**
 * Get user's overall learning stats.
 */
export async function getUserLearningStats(userId: string): Promise<UserLearningStats> {
  const supabase = await createClient()
  
  // Get all competencies and modules count
  const { data: competencies } = await supabase
    .from("competencies")
    .select("id")
  
  const { data: modules } = await supabase
    .from("learning_modules")
    .select("id")
  
  // Get user progress
  const { data: progress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)
  
  // Get quiz attempts
  const { data: quizzes } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("passed", true)
  
  const totalModules = modules?.length || 0
  const completedModules = progress?.filter(p => p.status === "completed").length || 0
  const inProgressModules = progress?.filter(p => p.status === "in_progress").length || 0
  
  // TODO: Calculate completed competencies properly
  const completedCompetencies = 0
  
  return {
    totalCompetencies: competencies?.length || 0,
    completedCompetencies,
    totalModules,
    completedModules,
    inProgressModules,
    overallProgressPercent: totalModules > 0 
      ? Math.round((completedModules / totalModules) * 100) 
      : 0,
    quizzesPassed: quizzes?.length || 0,
    quizzesTotal: totalModules, // Assuming 1 quiz per module
  }
}

/**
 * Get user's progress for a specific module.
 */
export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<LearningProgress | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  
  return transformProgress(data)
}

// =============================================================================
// AUDIO TRANSCRIPT QUERIES
// =============================================================================

/**
 * Get audio transcript for a module.
 */
export async function getAudioTranscript(
  moduleSlug: string
): Promise<AudioTranscript | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("*")
    .eq("slug", `${moduleSlug}-audio`)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  
  return transformAudioTranscript(data)
}

/**
 * Get audio transcript for a competency overview.
 */
export async function getCompetencyAudioTranscript(
  competencySlug: string
): Promise<AudioTranscript | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("*")
    .eq("slug", `${competencySlug}-intro-audio`)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  
  return transformAudioTranscript(data)
}

// =============================================================================
// TRANSFORM HELPERS (snake_case to camelCase)
// =============================================================================

function transformCompetency(row: any): Competency {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCompetencies(rows: any[]): Competency[] {
  return rows.map(transformCompetency)
}

function transformModule(row: any): LearningModule {
  return {
    id: row.id,
    competencyId: row.competency_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    moduleNumber: row.module_number,
    type: row.type || "knowledge",
    estimatedDuration: row.estimated_duration,
    displayOrder: row.display_order,
    content: row.content,
    frontmatter: row.frontmatter,        // JSONB - all frontmatter fields
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformModules(rows: any[]): LearningModule[] {
  return rows.map(transformModule)
}

function transformAudioTranscript(row: any): AudioTranscript {
  return {
    id: row.id,
    moduleId: row.module_id,
    competencyId: row.competency_id,
    slug: row.slug,
    title: row.title,
    duration: row.duration,
    voice: row.voice || "coach",
    type: row.type || "demonstration",
    transcript: row.transcript,
    audioUrl: row.audio_url,
    frontmatter: row.frontmatter,
    createdAt: row.created_at,
  }
}

function transformProgress(row: any): LearningProgress {
  return {
    id: row.id,
    userId: row.user_id,
    moduleId: row.module_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformQuestion(row: any): QuizQuestion {
  return {
    id: row.id,
    quizId: row.quiz_id,
    competencySlug: row.competency_slug,
    relatedModule: row.related_module,
    questionNumber: row.question_number,
    questionText: row.question_text,
    options: row.options,
    explanation: row.explanation,
    displayOrder: row.display_order,
  }
}

function transformQuestions(rows: any[]): QuizQuestion[] {
  return rows.map(transformQuestion)
}

function transformAttempt(row: any): QuizAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    moduleId: row.module_id,
    score: row.score,
    maxScore: row.max_score,
    passed: row.passed,
    answers: row.answers,
    attemptedAt: row.attempted_at,
  }
}

function transformAttempts(rows: any[]): QuizAttempt[] {
  return rows.map(transformAttempt)
}
```

### 3. Create `lib/actions/learning.ts`

Server actions for user interactions.

```typescript
/**
 * CATALYST - Learning Server Actions
 * 
 * Server actions for LMS user interactions:
 * - Starting/completing modules
 * - Submitting quiz attempts
 */

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { config } from "@/lib/config"

// =============================================================================
// PROGRESS ACTIONS
// =============================================================================

/**
 * Mark a module as started.
 */
export async function markModuleStarted(moduleId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  // Upsert progress record
  const { error } = await supabase
    .from("learning_progress")
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      status: "in_progress",
      started_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,module_id",
      ignoreDuplicates: false,
    })
  
  if (error) throw error
  
  revalidatePath("/learn")
  return { success: true }
}

/**
 * Mark a module as completed.
 */
export async function markModuleComplete(moduleId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  const { error } = await supabase
    .from("learning_progress")
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      status: "completed",
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,module_id",
      ignoreDuplicates: false,
    })
  
  if (error) throw error
  
  revalidatePath("/learn")
  return { success: true }
}

// =============================================================================
// QUIZ ACTIONS
// =============================================================================

export interface QuizAnswer {
  questionId: string
  selectedOption: number
}

export interface QuizResult {
  score: number
  maxScore: number
  passed: boolean
  correctAnswers: string[]
  explanations: Record<string, string>
}

/**
 * Submit a quiz attempt and get results.
 */
export async function submitQuizAttempt(
  moduleId: string,
  answers: QuizAnswer[]
): Promise<QuizResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  // Get correct answers
  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("module_id", moduleId)
  
  if (qError) throw qError
  
  // Calculate score
  let score = 0
  const correctAnswers: string[] = []
  const explanations: Record<string, string> = {}
  
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) continue
    
    const options = question.options as Array<{ text: string; correct: boolean }>
    const selectedOption = options[answer.selectedOption]
    
    if (selectedOption?.correct) {
      score++
      correctAnswers.push(answer.questionId)
    }
    
    if (question.explanation) {
      explanations[answer.questionId] = question.explanation
    }
  }
  
  const maxScore = questions.length
  const passed = (score / maxScore) >= config.learning.quizPassThreshold
  
  // Save attempt
  const { error: saveError } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      score,
      max_score: maxScore,
      passed,
      answers: Object.fromEntries(
        answers.map(a => [a.questionId, a.selectedOption])
      ),
    })
  
  if (saveError) throw saveError
  
  // If passed, mark module as complete
  if (passed) {
    await markModuleComplete(moduleId)
  }
  
  revalidatePath("/learn")
  
  return {
    score,
    maxScore,
    passed,
    correctAnswers,
    explanations,
  }
}
```

### 4. Update Database Schema (Migration)

The current `learning_modules` table needs additional columns for structured content.

```sql
-- Migration: Add structured content columns to learning_modules
ALTER TABLE learning_modules 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'knowledge',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS the_risk TEXT,
ADD COLUMN IF NOT EXISTS the_reward TEXT,
ADD COLUMN IF NOT EXISTS process_model JSONB,
ADD COLUMN IF NOT EXISTS practice_scenario JSONB,
ADD COLUMN IF NOT EXISTS resources JSONB,
ADD COLUMN IF NOT EXISTS quiz_id TEXT;

-- Add check constraint for type
ALTER TABLE learning_modules 
ADD CONSTRAINT learning_modules_type_check 
CHECK (type IN ('knowledge', 'skills', 'skills-script'));

-- Add unique constraint for user progress
ALTER TABLE learning_progress
ADD CONSTRAINT learning_progress_unique 
UNIQUE (user_id, module_id);

COMMENT ON COLUMN learning_modules.type IS 'Module type: knowledge, skills, or skills-script';
COMMENT ON COLUMN learning_modules.the_risk IS 'Risk callout text for module header';
COMMENT ON COLUMN learning_modules.the_reward IS 'Reward callout text for module header';
COMMENT ON COLUMN learning_modules.process_model IS 'JSON array of process steps with title, description, script';
COMMENT ON COLUMN learning_modules.practice_scenario IS 'JSON object defining practice scenario for skills modules';
COMMENT ON COLUMN learning_modules.resources IS 'JSON array of resource links';
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `lib/learning-types.ts` | CREATE | TypeScript type definitions |
| `lib/learning.ts` | CREATE | Server-only data fetching |
| `lib/actions/learning.ts` | CREATE | Server actions for user interactions |
| `supabase/migrations/YYYYMMDD_learning_modules_extended.sql` | CREATE | Schema updates |

---

## Acceptance Criteria

- [ ] All types compile without errors
- [ ] `getCompetencies()` returns 9 competencies from database
- [ ] `getCompetencyWithModules()` returns competency with nested modules
- [ ] `getUserLearningStats()` returns correct progress calculations
- [ ] `markModuleStarted()` creates/updates progress record
- [ ] `markModuleComplete()` updates status to completed
- [ ] `submitQuizAttempt()` calculates score and saves attempt
- [ ] Quiz pass/fail respects `config.learning.quizPassThreshold`
- [ ] All functions handle errors gracefully (not found, auth errors)
- [ ] Migration runs successfully on Supabase

---

## Testing

```typescript
// Test in a page or API route:
import { getCompetencies, getUserLearningStats } from "@/lib/learning"

export default async function TestPage() {
  const competencies = await getCompetencies()
  console.log("Competencies:", competencies.length)
  
  // With a logged-in user:
  // const stats = await getUserLearningStats(userId)
  // console.log("Stats:", stats)
  
  return <div>Check console</div>
}
```

---

## Notes

- Re-export types from `lib/learning-types.ts` for client component usage
- Transform functions handle snake_case → camelCase conversion
- Progress uses upsert to handle both create and update
- Quiz results include explanations for learning feedback
