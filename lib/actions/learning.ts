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
