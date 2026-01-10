/**
 * CATALYST - Quiz Actions
 *
 * Server actions for quiz functionality.
 * Can be called from Client Components.
 */

"use server"

import { 
  getQuizForModule, 
  submitQuizAttempt as dbSubmitQuizAttempt,
  getCompetencyProgressSummary as dbGetCompetencyProgressSummary,
} from "@/lib/learning"

/**
 * Get quiz data for a module.
 * Server action that can be called from client components.
 */
export async function getQuizData(moduleId: string) {
  try {
    const quiz = await getQuizForModule(moduleId)
    return { success: true, data: quiz }
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return { success: false, error: "Failed to fetch quiz" }
  }
}

/**
 * Submit a quiz attempt.
 * Server action that can be called from client components.
 */
export async function submitQuizAttemptAction(data: {
  moduleId: string
  score: number
  totalQuestions: number
  answers: Record<string, number>
}) {
  try {
    await dbSubmitQuizAttempt(data)
    return { success: true }
  } catch (error) {
    console.error("Error submitting quiz attempt:", error)
    return { success: false, error: "Failed to submit quiz attempt" }
  }
}

/**
 * Get competency progress summary.
 * Server action that can be called from client components.
 */
export async function getCompetencyProgress() {
  try {
    const progress = await dbGetCompetencyProgressSummary()
    return { success: true, data: progress }
  } catch (error) {
    console.error("Error fetching competency progress:", error)
    return { success: false, data: [] }
  }
}
