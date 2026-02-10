/**
 * CATALYST - Admin Progress Queries
 *
 * Server-side queries for admin learner progress dashboard.
 * All queries respect RLS and require admin role.
 */

import { createClient } from "@/lib/supabase/server"

// =============================================================================
// Types
// =============================================================================

export interface LearnerSummary {
  id: string
  fullName: string
  email: string
  certificationStatus: "in_progress" | "ready" | "certified"
  overallProgress: number
  lastActivity: string | null
  completedModules: number
  totalModules: number
  isAtRisk: boolean
}

export interface LearnerDetail extends LearnerSummary {
  competencyProgress: CompetencyProgress[]
  quizResults: QuizResult[]
  scenarioProgress: ScenarioCategoryProgress[]
}

export interface ModuleProgress {
  id: string
  slug: string
  title: string
  status: "completed" | "in_progress" | "not_started"
  completedAt: string | null
  quizScore: number | null
  quizMaxScore: number | null
  quizPassed: boolean | null
  quizAttempts: number
}

export interface CompetencyProgress {
  slug: string
  name: string
  completedModules: number
  totalModules: number
  progressPercent: number
  modules: ModuleProgress[]
}

export interface QuizResult {
  moduleSlug: string
  moduleName: string
  competencySlug: string
  bestScore: number
  maxScore: number
  passed: boolean
  attemptCount: number
  lastAttemptDate: string | null
}

export interface ScenarioCompletion {
  scenarioId: string
  completedAt: string | null
  reflectionLearned: string | null
  reflectionImprove: string | null
}

export interface ScenarioCategoryProgress {
  categorySlug: string
  categoryTitle: string
  totalScenarios: number
  completedScenarios: number
  reflectionsSubmitted: number
  completions: ScenarioCompletion[]
}

export interface ProgressStats {
  totalLearners: number
  averageProgress: number
  readyCount: number
  certifiedCount: number
  atRiskCount: number
}

// =============================================================================
// Queries
// =============================================================================

/**
 * Get all learners with their progress summary.
 */
export async function getAllLearnersWithProgress(): Promise<LearnerSummary[]> {
  const supabase = await createClient()

  // Get all learner profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("id, full_name, role, certification_status, created_at")
    .eq("role", "learner")

  if (profilesError) {
    console.error("Failed to fetch learner profiles:", profilesError)
    return []
  }

  // Get total modules count
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })

  // Get user emails from auth (via RPC if available, otherwise skip)
  const { data: authUsers } = await supabase.rpc("get_all_users")
  const emailMap = new Map<string, string>()
  if (authUsers) {
    for (const user of authUsers) {
      emailMap.set(user.id, user.email)
    }
  }

  // Get all learning progress
  const { data: allProgress } = await supabase
    .from("learning_progress")
    .select("user_id, status, completed_at")

  // Get all quiz attempts for last activity
  const { data: allQuizAttempts } = await supabase
    .from("quiz_attempts")
    .select("user_id, attempted_at")

  // Get all scenario progress for last activity
  const { data: allScenarioProgress } = await supabase
    .from("scenario_progress")
    .select("user_id, completed_at")

  // Build learner summaries
  const learners: LearnerSummary[] = (profiles || []).map((profile) => {
    const userProgress = allProgress?.filter((p) => p.user_id === profile.id) || []
    const completedModules = userProgress.filter((p) => p.status === "completed").length
    const overallProgress = totalModules && totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0

    // Calculate last activity from all sources
    const progressDates = userProgress
      .filter((p) => p.completed_at)
      .map((p) => new Date(p.completed_at!).getTime())

    const quizDates = (allQuizAttempts || [])
      .filter((q) => q.user_id === profile.id && q.attempted_at)
      .map((q) => new Date(q.attempted_at).getTime())

    const scenarioDates = (allScenarioProgress || [])
      .filter((s) => s.user_id === profile.id && s.completed_at)
      .map((s) => new Date(s.completed_at).getTime())

    const allDates = [...progressDates, ...quizDates, ...scenarioDates]
    const lastActivityDate = allDates.length > 0 ? Math.max(...allDates) : null

    // Check if at risk: inactive > 7 days and progress < 100%
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const isAtRisk = overallProgress < 100 &&
      (lastActivityDate === null || lastActivityDate < sevenDaysAgo)

    return {
      id: profile.id,
      fullName: profile.full_name || "No name",
      email: emailMap.get(profile.id) || "No email",
      certificationStatus: profile.certification_status || "in_progress",
      overallProgress,
      lastActivity: lastActivityDate ? new Date(lastActivityDate).toISOString() : null,
      completedModules,
      totalModules: totalModules || 0,
      isAtRisk,
    }
  })

  return learners
}

/**
 * Get progress statistics summary.
 */
export async function getProgressStats(): Promise<ProgressStats> {
  const learners = await getAllLearnersWithProgress()

  const totalLearners = learners.length
  const averageProgress = totalLearners > 0
    ? Math.round(learners.reduce((sum, l) => sum + l.overallProgress, 0) / totalLearners)
    : 0
  const readyCount = learners.filter((l) => l.certificationStatus === "ready").length
  const certifiedCount = learners.filter((l) => l.certificationStatus === "certified").length
  const atRiskCount = learners.filter((l) => l.isAtRisk).length

  return {
    totalLearners,
    averageProgress,
    readyCount,
    certifiedCount,
    atRiskCount,
  }
}

/**
 * Get detailed progress for a single learner.
 */
export async function getLearnerDetail(userId: string): Promise<LearnerDetail | null> {
  const supabase = await createClient()

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, full_name, role, certification_status")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    console.error("Failed to fetch learner profile:", profileError)
    return null
  }

  // Get user email
  const { data: authUsers } = await supabase.rpc("get_all_users")
  const email = authUsers?.find((u: { id: string; email: string }) => u.id === userId)?.email || "No email"

  // Get competencies with modules (both ordered by display_order)
  const { data: competencies } = await supabase
    .from("competencies")
    .select(`
      id,
      slug,
      name,
      display_order,
      learning_modules (
        id,
        slug,
        title,
        display_order
      )
    `)
    .order("display_order")
    .order("display_order", { ascending: true, referencedTable: "learning_modules" })

  // Get user's learning progress
  const { data: userProgress } = await supabase
    .from("learning_progress")
    .select("module_id, status, completed_at")
    .eq("user_id", userId)

  // Get user's quiz attempts
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("module_id, quiz_slug, score, max_score, passed, attempted_at")
    .eq("user_id", userId)
    .order("attempted_at", { ascending: false })

  // Get all quizzes for mapping slug to title
  const { data: allQuizzes } = await supabase
    .from("quizzes")
    .select("slug, title, competency_slug, related_module")

  // Get user's scenario progress
  const { data: scenarioProgress } = await supabase
    .from("scenario_progress")
    .select("scenario_category, scenario_id, reflection_learned, reflection_improve, completed_at")
    .eq("user_id", userId)

  // Get all scenarios for completion status
  const { data: allScenarios } = await supabase
    .from("scenarios")
    .select("slug, title, scenario_count")

  // Build a map of quiz results by module_id for quick lookup
  const quizByModuleId = new Map<string, { bestScore: number; maxScore: number; passed: boolean; attempts: number }>()
  for (const attempt of quizAttempts || []) {
    if (!attempt.module_id) continue
    const existing = quizByModuleId.get(attempt.module_id)
    if (!existing) {
      quizByModuleId.set(attempt.module_id, {
        bestScore: Math.min(attempt.score, attempt.max_score),
        maxScore: attempt.max_score,
        passed: attempt.passed,
        attempts: 1,
      })
    } else {
      existing.attempts++
      const cappedScore = Math.min(attempt.score, attempt.max_score)
      if (cappedScore > existing.bestScore) {
        existing.bestScore = cappedScore
        existing.maxScore = attempt.max_score
        existing.passed = attempt.passed
      }
    }
  }

  // Calculate total modules and completed
  const allModules: Array<{ id: string; slug: string; title: string; competencySlug: string }> = []
  const competencyProgress: CompetencyProgress[] = []

  for (const comp of competencies || []) {
    const modules = comp.learning_modules || []
    
    // Build module progress for this competency (modules already ordered by display_order from query)
    const moduleProgressList: ModuleProgress[] = modules.map((m: { id: string; slug: string; title: string; display_order: number }) => {
      const progress = userProgress?.find((p) => p.module_id === m.id)
      const quiz = quizByModuleId.get(m.id)
      
      let status: "completed" | "in_progress" | "not_started" = "not_started"
      if (progress?.status === "completed") {
        status = "completed"
      } else if (progress?.status === "in_progress") {
        status = "in_progress"
      }
      
      return {
        id: m.id,
        slug: m.slug,
        title: m.title,
        status,
        completedAt: progress?.completed_at || null,
        quizScore: quiz?.bestScore ?? null,
        quizMaxScore: quiz?.maxScore ?? null,
        quizPassed: quiz?.passed ?? null,
        quizAttempts: quiz?.attempts ?? 0,
      }
    })
    
    const completedInComp = moduleProgressList.filter((m) => m.status === "completed").length

    competencyProgress.push({
      slug: comp.slug,
      name: comp.name,
      completedModules: completedInComp,
      totalModules: modules.length,
      progressPercent: modules.length > 0
        ? Math.round((completedInComp / modules.length) * 100)
        : 0,
      modules: moduleProgressList,
    })

    for (const mod of modules) {
      allModules.push({
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        competencySlug: comp.slug,
      })
    }
  }

  const totalModules = allModules.length
  const completedModules = userProgress?.filter((p) => p.status === "completed").length || 0
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  // Calculate last activity
  const progressDates = (userProgress || [])
    .filter((p) => p.completed_at)
    .map((p) => new Date(p.completed_at!).getTime())
  const quizDates = (quizAttempts || [])
    .filter((q) => q.attempted_at)
    .map((q) => new Date(q.attempted_at).getTime())
  const scenarioDates = (scenarioProgress || [])
    .filter((s) => s.completed_at)
    .map((s) => new Date(s.completed_at).getTime())

  const allDates = [...progressDates, ...quizDates, ...scenarioDates]
  const lastActivityDate = allDates.length > 0 ? Math.max(...allDates) : null

  // Check if at risk
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const isAtRisk = overallProgress < 100 &&
    (lastActivityDate === null || lastActivityDate < sevenDaysAgo)

  // Build quiz results (grouped by module_id or quiz_slug, best score)
  const quizResultsMap = new Map<string, QuizResult>()
  for (const attempt of quizAttempts || []) {
    // Prefer module_id as grouping key, fall back to quiz_slug
    const key = attempt.module_id || attempt.quiz_slug
    if (!key) continue

    // Try to find quiz info from quizzes table
    const quiz = attempt.quiz_slug 
      ? allQuizzes?.find((q) => q.slug === attempt.quiz_slug)
      : null
    
    // Try to find module info if module_id exists
    const learningModule = attempt.module_id 
      ? allModules.find((m) => m.id === attempt.module_id)
      : null

    // Determine display name and competency
    const displayName = quiz?.title || learningModule?.title || attempt.quiz_slug || "Unknown Quiz"
    const competencySlug = quiz?.competency_slug || learningModule?.competencySlug || "unknown"

    const existing = quizResultsMap.get(key)

    if (!existing) {
      quizResultsMap.set(key, {
        moduleSlug: learningModule?.slug || attempt.quiz_slug || key,
        moduleName: displayName,
        competencySlug,
        // Cap score at max_score to handle data integrity issues
        bestScore: Math.min(attempt.score, attempt.max_score),
        maxScore: attempt.max_score,
        passed: attempt.passed,
        attemptCount: 1,
        lastAttemptDate: attempt.attempted_at,
      })
    } else {
      existing.attemptCount++
      // Cap score at max_score
      const cappedScore = Math.min(attempt.score, attempt.max_score)
      if (cappedScore > existing.bestScore) {
        existing.bestScore = cappedScore
        existing.maxScore = attempt.max_score
        existing.passed = attempt.passed
      }
      if (attempt.attempted_at > (existing.lastAttemptDate || "")) {
        existing.lastAttemptDate = attempt.attempted_at
      }
    }
  }

  // Build scenario results - with individual completions for each category
  const scenarioCategoryProgress: ScenarioCategoryProgress[] = (allScenarios || []).map((scenario) => {
    // Get all progress entries for this category
    const categoryProgressList = scenarioProgress?.filter(
      (p) => p.scenario_category === scenario.slug
    ) || []
    
    // Build individual completion records, sorted by most recent first
    const completions: ScenarioCompletion[] = categoryProgressList
      .sort((a, b) => {
        const dateA = a.completed_at ? new Date(a.completed_at).getTime() : 0
        const dateB = b.completed_at ? new Date(b.completed_at).getTime() : 0
        return dateB - dateA
      })
      .map((p) => ({
        scenarioId: p.scenario_id,
        completedAt: p.completed_at || null,
        reflectionLearned: p.reflection_learned || null,
        reflectionImprove: p.reflection_improve || null,
      }))
    
    const completedCount = completions.length
    const reflectionsCount = completions.filter(
      (c) => c.reflectionLearned || c.reflectionImprove
    ).length
    
    return {
      categorySlug: scenario.slug,
      categoryTitle: scenario.title,
      totalScenarios: scenario.scenario_count || 0,
      completedScenarios: completedCount,
      reflectionsSubmitted: reflectionsCount,
      completions,
    }
  })

  return {
    id: profile.id,
    fullName: profile.full_name || "No name",
    email,
    certificationStatus: profile.certification_status || "in_progress",
    overallProgress,
    lastActivity: lastActivityDate ? new Date(lastActivityDate).toISOString() : null,
    completedModules,
    totalModules,
    isAtRisk,
    competencyProgress,
    quizResults: Array.from(quizResultsMap.values()),
    scenarioProgress: scenarioCategoryProgress,
  }
}

/**
 * Get the current user's own progress (for My Progress page).
 * Reuses the same data structure as getLearnerDetail but for the authenticated user.
 */
export async function getMyProgress(): Promise<LearnerDetail | null> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }
  
  // Reuse getLearnerDetail with current user's ID
  return getLearnerDetail(user.id)
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 days ago").
 */
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never"

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? "" : "s"} ago`

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}
