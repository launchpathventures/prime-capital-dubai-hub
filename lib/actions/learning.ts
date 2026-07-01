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
import { trackActionError } from "@/lib/error-tracking"
import type { ProgressStats } from "@/lib/learning-types"

// =============================================================================
// TYPES
// =============================================================================

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

interface ModuleCompletionResult {
  certificateId?: string
}

// =============================================================================
// PROGRESS ACTIONS
// =============================================================================

/**
 * Mark a module as started.
 */
export async function markModuleStarted(moduleId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Upsert progress record
    const { error } = await supabase.from("learning_progress").upsert(
      {
        user_id: user.id,
        module_id: moduleId,
        status: "in_progress",
        started_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,module_id",
        ignoreDuplicates: false,
      }
    )

    if (error) throw error

    revalidatePath("/learn")
    return { success: true, data: undefined }
  } catch (error) {
    trackActionError(error, "markModuleStarted", { moduleId })
    return { success: false, error: "Failed to mark module as started" }
  }
}

/**
 * Mark a module as completed.
 */
export async function markModuleComplete(moduleId: string): Promise<ActionResult<ModuleCompletionResult>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { error } = await supabase.from("learning_progress").upsert(
      {
        user_id: user.id,
        module_id: moduleId,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,module_id",
        ignoreDuplicates: false,
      }
    )

    if (error) throw error

    let certificateId: string | undefined
    if (user.email) {
      try {
        const { issueCertificateForUser } = await import("@/lib/actions/certificate")
        const certificateResult = await issueCertificateForUser({
          userId: user.id,
          userEmail: user.email,
        })
        if (certificateResult.success) {
          certificateId = certificateResult.data.certificateId
        }
      } catch (certificateError) {
        trackActionError(certificateError, "markModuleComplete.issueCertificate", { moduleId })
      }
    }

    revalidatePath("/learn")
    return { success: true, data: { certificateId } }
  } catch (error) {
    trackActionError(error, "markModuleComplete", { moduleId })
    return { success: false, error: "Failed to mark module as completed" }
  }
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
  certificateEligible?: boolean
  certificateId?: string
}

/**
 * Submit a quiz attempt and get results.
 * Supports both quiz slug (new) and module ID (legacy) based submissions.
 */
export async function submitQuizAttempt(
  quizSlugOrModuleId: string,
  answers: QuizAnswer[]
): Promise<QuizResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Determine if this is a quiz slug or module ID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizSlugOrModuleId)
  
  let questions
  let passingScore = config.learning.quizPassThreshold
  let quizSlug: string | null = null
  let moduleId: string | null = null

  if (isUuid) {
    // Legacy: lookup by module_id
    moduleId = quizSlugOrModuleId
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("module_id", quizSlugOrModuleId)
    if (error) throw error
    questions = data
  } else {
    // New: lookup by quiz_slug
    quizSlug = quizSlugOrModuleId
    
    // Get quiz metadata for passing score and related module
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("passing_score, related_module")
      .eq("slug", quizSlug)
      .single()
    
    if (quiz?.passing_score) {
      passingScore = quiz.passing_score / 100 // Convert percentage to decimal
    }
    
    // Look up the module ID from the related module slug
    if (quiz?.related_module) {
      const { data: module } = await supabase
        .from("learning_modules")
        .select("id")
        .eq("slug", quiz.related_module)
        .single()
      
      if (module?.id) {
        moduleId = module.id
      }
    }
    
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_slug", quizSlug)
    if (error) throw error
    questions = data
  }

  if (!questions || questions.length === 0) {
    throw new Error("Quiz not found")
  }

  // Calculate score
  // Dedupe by questionId (last answer wins) so a buggy client can't inflate scores
  // by submitting the same question twice. Defense-in-depth — score must never exceed maxScore.
  const answersByQuestion = new Map<string, number>()
  for (const answer of answers) {
    answersByQuestion.set(answer.questionId, answer.selectedOption)
  }

  let score = 0
  const correctAnswers: string[] = []
  const explanations: Record<string, string> = {}

  for (const [questionId, selectedIndex] of answersByQuestion) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) continue

    const options = question.options as Array<{ text: string; correct: boolean }>
    const selectedOption = options[selectedIndex]

    if (selectedOption?.correct) {
      score++
      correctAnswers.push(questionId)
    }

    if (question.explanation) {
      explanations[questionId] = question.explanation
    }
  }

  const maxScore = questions.length
  const passed = (score / maxScore) >= passingScore

  // Save attempt
  const { error: saveError } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: moduleId,
    quiz_slug: quizSlug,
    score,
    max_score: maxScore,
    passed,
    answers: Object.fromEntries(
      answers.map((a) => [a.questionId, a.selectedOption])
    ),
  })

  if (saveError) throw saveError

  let certificateId: string | undefined

  // If passed and we have a module ID, mark module as complete.
  // Certificate issuance is centralized in markModuleComplete so a passing
  // module quiz does not make a second issuance attempt.
  if (passed && moduleId) {
    const completionResult = await markModuleComplete(moduleId)
    if (completionResult.success) {
      certificateId = completionResult.data.certificateId
    }
  }

  revalidatePath("/learn")

  // Standalone passing quizzes without a linked module still get a final
  // eligibility check, but issueCertificateForUser remains one-active-cert
  // idempotent.
  let certificateEligible = false
  if (certificateId) {
    certificateEligible = true
  } else if (passed && !moduleId && user.email) {
    try {
      const { issueCertificateForUser } = await import("@/lib/actions/certificate")
      const certificateResult = await issueCertificateForUser({
        userId: user.id,
        userEmail: user.email,
      })
      if (certificateResult.success) {
        certificateEligible = true
        certificateId = certificateResult.data.certificateId
      }
    } catch {
      // Non-blocking — don't fail the quiz submission
    }
  }

  return {
    score,
    maxScore,
    passed,
    correctAnswers,
    explanations,
    certificateEligible,
    certificateId,
  }
}

// =============================================================================
// PROGRESS STATS & ANALYTICS
// =============================================================================

/** Maximum number of days to consider when calculating streak */
const MAX_STREAK_DAYS = 365

/**
 * Get current user's overall progress stats with streak calculation.
 */
export async function getProgressStats(): Promise<ProgressStats> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Return default stats if not authenticated
  if (!user) {
    return {
      totalModules: 0,
      completedModules: 0,
      inProgressModules: 0,
      totalQuizzes: 0,
      passedQuizzes: 0,
      currentStreak: 0,
      overallProgressPercent: 0,
    }
  }
  
  // Get total modules count
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
  
  // Get user's progress records
  const { data: progressRecords } = await supabase
    .from("learning_progress")
    .select("status, completed_at")
    .eq("user_id", user.id)
  
  const completedModules = progressRecords?.filter((p) => p.status === "completed").length || 0
  const inProgressModules = progressRecords?.filter((p) => p.status === "in_progress").length || 0
  
  // Get total quizzes (count unique module_id from quiz_questions)
  const { data: quizModules } = await supabase
    .from("quiz_questions")
    .select("module_id")
  
  const uniqueQuizModules = new Set(quizModules?.map((q) => q.module_id) || [])
  const totalQuizzes = uniqueQuizModules.size
  
  // Get passed quizzes (count unique module_id from passed attempts)
  const { data: passedAttempts } = await supabase
    .from("quiz_attempts")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("passed", true)
  
  const passedQuizzes = new Set(passedAttempts?.map((a) => a.module_id) || []).size
  
  // Calculate streak from completed modules
  const completedDates = progressRecords
    ?.filter((p) => p.status === "completed" && p.completed_at)
    .map((p) => p.completed_at!)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  const currentStreak = calculateStreak(completedDates || [])
  
  const overallProgressPercent = totalModules && totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0
  
  return {
    totalModules: totalModules || 0,
    completedModules,
    inProgressModules,
    totalQuizzes,
    passedQuizzes,
    currentStreak,
    overallProgressPercent,
  }
}

/**
 * Calculate consecutive day streak from completion dates.
 * Returns the number of consecutive days with at least one completion.
 */
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  
  // Convert to date strings (YYYY-MM-DD) and get unique days
  const uniqueDays = [
    ...new Set(
      dates.map((d) => new Date(d).toISOString().split("T")[0])
    ),
  ].sort((a, b) => b.localeCompare(a)) // Sort descending (most recent first)
  
  if (uniqueDays.length === 0) return 0
  
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  
  // Check if streak is still active (today or yesterday has activity)
  if (!uniqueDays.includes(today) && !uniqueDays.includes(yesterday)) {
    return 0
  }
  
  // Count consecutive days from most recent
  let streak = 0
  let currentDate = new Date()
  
  for (let i = 0; i < MAX_STREAK_DAYS; i++) {
    const dateStr = currentDate.toISOString().split("T")[0]
    
    if (uniqueDays.includes(dateStr)) {
      streak++
      currentDate = new Date(currentDate.getTime() - 86400000) // Go back 1 day
    } else {
      // If we haven't started the streak yet (i === 0), allow skipping today
      if (i === 0 && dateStr === today) {
        currentDate = new Date(currentDate.getTime() - 86400000)
        continue
      }
      break
    }
  }
  
  return streak
}
