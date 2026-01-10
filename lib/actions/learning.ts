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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

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
  return { success: true }
}

/**
 * Mark a module as completed.
 */
export async function markModuleComplete(moduleId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

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

  const {
    data: { user },
  } = await supabase.auth.getUser()
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
    const question = questions.find((q) => q.id === answer.questionId)
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
  const passed = score / maxScore >= config.learning.quizPassThreshold

  // Save attempt
  const { error: saveError } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: moduleId,
    score,
    max_score: maxScore,
    passed,
    answers: Object.fromEntries(
      answers.map((a) => [a.questionId, a.selectedOption])
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

// =============================================================================
// PROGRESS STATS & ANALYTICS
// =============================================================================

export interface ProgressStats {
  totalModules: number
  completedModules: number
  inProgressModules: number
  totalQuizzes: number
  passedQuizzes: number
  currentStreak: number
  overallProgressPercent: number
}

/**
 * Get current user's overall progress stats with streak calculation.
 */
export async function getProgressStats(): Promise<ProgressStats | null> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return null
  
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
  
  for (let i = 0; i < 365; i++) {
    // Limit to 1 year
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
