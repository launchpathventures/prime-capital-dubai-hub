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
// CONSTANTS
// =============================================================================

/**
 * Default passing score threshold for quizzes (percentage)
 */
const DEFAULT_PASSING_SCORE = 70

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
    .select(
      `
      *,
      learning_modules (*)
    `
    )
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

  // Get competencies with modules
  const { data: competencies, error: compError } = await supabase
    .from("competencies")
    .select(
      `
      *,
      learning_modules (*)
    `
    )
    .order("display_order", { ascending: true })

  if (compError) throw compError

  // Get user's progress separately for modules without progress records
  const { data: progress, error: progError } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)

  if (progError) throw progError

  const progressMap = new Map(progress?.map((p) => [p.module_id, p]) || [])

  return competencies.map((comp) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const modules = (comp.learning_modules || []).map((mod: any) => ({
      ...transformModule(mod),
      progress: progressMap.get(mod.id)
        ? transformProgress(progressMap.get(mod.id)!)
        : null,
      isCompleted: progressMap.get(mod.id)?.status === "completed",
      isLocked: false, // TODO: Calculate based on previous module
    }))
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const completedCount = modules.filter((m: { isCompleted: boolean }) => m.isCompleted).length

    return {
      ...transformCompetency(comp),
      modules,
      completedCount,
      totalCount: modules.length,
      progressPercent:
        modules.length > 0
          ? Math.round((completedCount / modules.length) * 100)
          : 0,
    }
  })
}

/**
 * Get all competencies with progress for the current user (or zero progress if unauthenticated).
 * This version automatically gets the current user from the session.
 * Returns fallback data if database is unavailable.
 */
export async function getAllCompetenciesWithProgress(): Promise<CompetencyWithProgress[]> {
  try {
    const supabase = await createClient()
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get competencies with modules
    const { data: competencies, error: compError } = await supabase
      .from("competencies")
      .select(
        `
        *,
        learning_modules (*)
      `
      )
      .order("display_order", { ascending: true })

    if (compError) {
      console.error("Error fetching competencies:", compError)
      return getFallbackCompetencies()
    }
    if (!competencies || competencies.length === 0) {
      return getFallbackCompetencies()
    }

    // If no user, return with zero progress
    if (!user) {
      return competencies.map((comp) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const modules = (comp.learning_modules || []).map((mod: any) => ({
          ...transformModule(mod),
          progress: null,
          isCompleted: false,
          isLocked: false,
        }))
        /* eslint-enable @typescript-eslint/no-explicit-any */

        return {
          ...transformCompetency(comp),
          modules,
          completedCount: 0,
          totalCount: modules.length,
          progressPercent: 0,
        }
      })
    }

    // Get user's progress
    const { data: progress, error: progError } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", user.id)

    if (progError) {
      console.error("Error fetching progress:", progError)
    }

    const progressMap = new Map(progress?.map((p) => [p.module_id, p]) || [])

    return competencies.map((comp) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const modules = (comp.learning_modules || []).map((mod: any) => ({
        ...transformModule(mod),
        progress: progressMap.get(mod.id)
          ? transformProgress(progressMap.get(mod.id)!)
          : null,
        isCompleted: progressMap.get(mod.id)?.status === "completed",
        isLocked: false,
      }))
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const completedCount = modules.filter((m: { isCompleted: boolean }) => m.isCompleted).length

      return {
        ...transformCompetency(comp),
        modules,
        completedCount,
        totalCount: modules.length,
        progressPercent:
          modules.length > 0
            ? Math.round((completedCount / modules.length) * 100)
            : 0,
      }
    })
  } catch (error) {
    console.error("Error in getAllCompetenciesWithProgress:", error)
    return getFallbackCompetencies()
  }
}

/**
 * Returns fallback competency data when database is unavailable.
 */
function getFallbackCompetencies(): CompetencyWithProgress[] {
  const fallbackData = [
    { slug: "prime-capital-identity", name: "Prime Capital Identity", description: "Who we are and what makes us different" },
    { slug: "market-intelligence", name: "Market Intelligence", description: "Why Dubai? Why now?" },
    { slug: "client-discovery", name: "Client Discovery", description: "Understanding client needs" },
    { slug: "property-matching", name: "Property Matching", description: "Connecting clients with opportunities" },
    { slug: "objection-navigation", name: "Objection Navigation", description: "Addressing concerns with expertise" },
    { slug: "transaction-excellence", name: "Transaction Excellence", description: "Guiding the process" },
    { slug: "relationship-building", name: "Relationship Building", description: "Creating lasting partnerships" },
  ]
  
  return fallbackData.map((comp, index) => ({
    id: `fallback-${index}`,
    slug: comp.slug,
    name: comp.name,
    description: comp.description,
    displayOrder: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [],
    completedCount: 0,
    totalCount: 5,
    progressPercent: 0,
  }))
}

// =============================================================================
// MODULE QUERIES
// =============================================================================

/**
 * Get all modules for a competency.
 */
export async function getModules(
  competencyId: string
): Promise<LearningModule[]> {
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
  const learningModule = await getModule(competencySlug, moduleSlug)
  if (!learningModule) return null

  const supabase = await createClient()

  const { data: progress } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("module_id", learningModule.id)
    .single()

  return {
    ...learningModule,
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
export async function getQuizQuestions(
  moduleId: string
): Promise<QuizQuestion[]> {
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
 * Get quiz with all questions and context for a module.
 * Returns quiz data ready for the quiz page.
 */
export async function getQuizForModule(
  moduleId: string
): Promise<{
  moduleId: string
  moduleSlug: string
  moduleTitle: string
  competencySlug: string
  competencyName: string
  questions: QuizQuestion[]
  passingScore: number
} | null> {
  const supabase = await createClient()

  // Get module with competency info
  const { data: module, error: moduleError } = await supabase
    .from("learning_modules")
    .select(`
      id,
      slug,
      title,
      competency:competencies(
        slug,
        name
      )
    `)
    .eq("id", moduleId)
    .single()

  if (moduleError || !module) return null

  // Get questions for this module
  const questions = await getQuizQuestions(moduleId)

  // Extract competency data (it comes as an array with single element from the join)
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const competency = (module as any).competency?.[0] || (module as any).competency
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return {
    moduleId: module.id,
    moduleSlug: module.slug,
    moduleTitle: module.title,
    competencySlug: competency?.slug ?? "",
    competencyName: competency?.name ?? "",
    questions,
    passingScore: DEFAULT_PASSING_SCORE,
  }
}

/**
 * Submit a quiz attempt.
 */
export async function submitQuizAttempt(data: {
  moduleId: string
  score: number
  totalQuestions: number
  answers: Record<string, number>
}): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  const passed = (data.score / data.totalQuestions) * 100 >= DEFAULT_PASSING_SCORE

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: data.moduleId,
    score: data.score,
    max_score: data.totalQuestions,
    passed,
    answers: data.answers,
  })

  // Update learning progress if passed
  if (passed) {
    await supabase
      .from("learning_progress")
      .upsert({
        user_id: user.id,
        module_id: data.moduleId,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
  }
}

/**
 * Get competency progress summary for current user.
 * Returns progress for all competencies.
 */
export async function getCompetencyProgressSummary(): Promise<Array<{
  slug: string
  name: string
  completed: number
  total: number
}>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // Get all competencies with module counts
  const { data: competencies } = await supabase
    .from("competencies")
    .select(`
      slug,
      name,
      learning_modules(id)
    `)
    .order("display_order")

  if (!competencies) return []

  // Get user's completed modules
  const { data: progress } = await supabase
    .from("learning_progress")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("status", "completed")

  const completedModuleIds = new Set(progress?.map((p) => p.module_id) ?? [])

  return competencies.map((comp) => {
    const modules = comp.learning_modules || []
    const completed = modules.filter((m: { id: string }) => completedModuleIds.has(m.id)).length
    
    return {
      slug: comp.slug,
      name: comp.name,
      completed,
      total: modules.length,
    }
  })
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
export async function getUserLearningStats(
  userId: string
): Promise<UserLearningStats> {
  const supabase = await createClient()

  // Get all competencies and modules count
  const { data: competencies } = await supabase
    .from("competencies")
    .select("id")

  const { data: modules } = await supabase.from("learning_modules").select("id")

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
  const completedModules =
    progress?.filter((p) => p.status === "completed").length || 0
  const inProgressModules =
    progress?.filter((p) => p.status === "in_progress").length || 0

  // TODO: Calculate completed competencies properly
  const completedCompetencies = 0

  return {
    totalCompetencies: competencies?.length || 0,
    completedCompetencies,
    totalModules,
    completedModules,
    inProgressModules,
    overallProgressPercent:
      totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
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

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    frontmatter: row.frontmatter, // JSONB - all frontmatter fields
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

/* eslint-enable @typescript-eslint/no-explicit-any */

// =============================================================================
// USER DATA FOR SHELL
// =============================================================================

/**
 * User data for LearnShell display
 */
export interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

/**
 * Get authenticated user data for display in learn shell header.
 * User is guaranteed to be authenticated (protected by middleware).
 */
export async function getLearnUser(): Promise<LearnUser> {
  try {
    const supabase = await createClient()

    // getClaims() reads from the token directly, no network call
    const { data } = await supabase.auth.getClaims()
    const claims = data?.claims

    // For full user metadata, we still need getUser() but wrap in try/catch
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (claims || user) {
      const email = (claims?.email || user?.email || "") as string
      const displayName =
        user?.user_metadata?.display_name ??
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        email?.split("@")[0] ??
        "Learner"

      return {
        name: displayName,
        email,
        role: user?.user_metadata?.role || "learner",
        avatarUrl: user?.user_metadata?.avatar_url,
      }
    }
  } catch {
    // Fall through to default
  }

  // Fallback (edge case or demo mode)
  return {
    name: "Learner",
    email: "",
    role: "learner",
  }
}
