/**
 * CATALYST - Quiz Page
 * 
 * Route: /learn/quiz/[quizId]
 * Shows quiz questions with full learn shell and sidebar navigation.
 * Used for standalone quizzes like RERA practice exams.
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizPageClient } from "./quiz-page-client"

interface PageProps {
  params: Promise<{ quizId: string }>
  searchParams: Promise<{ returnTo?: string }>
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { quizId } = await params
  const supabase = await createClient()
  
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title, description")
    .eq("slug", quizId)
    .single()
  
  if (!quiz) {
    return {
      title: "Quiz | Learning Portal",
    }
  }
  
  return {
    title: `${quiz.title} | Learning Portal`,
    description: quiz.description || `Test your knowledge with the ${quiz.title} quiz.`,
  }
}

// =============================================================================
// Types
// =============================================================================

interface QuizQuestion {
  id: string
  question: string
  question_text: string | null
  options: Array<{ text: string; correct: boolean }>
  explanation: string | null
  display_order: number
}

interface Quiz {
  slug: string
  title: string
  description: string | null
  competency_slug: string
  passing_score: number
  question_count: number
}

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function getQuizData(quizSlug: string): Promise<{
  quiz: Quiz
  questions: QuizQuestion[]
} | null> {
  const supabase = await createClient()
  
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("slug", quizSlug)
    .single()
  
  if (quizError || !quiz) return null
  
  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_slug", quizSlug)
    .order("display_order", { ascending: true })
  
  if (questionsError) return null
  
  return {
    quiz,
    questions: questions || [],
  }
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function QuizPage({ params, searchParams }: PageProps) {
  const { quizId } = await params
  const { returnTo } = await searchParams
  
  const data = await getQuizData(quizId)
  
  if (!data || data.questions.length === 0) {
    notFound()
  }
  
  // Practice exams don't show immediate feedback, topic quizzes do
  const isPracticeExam = data.quiz.slug.includes("practice-exam")
  
  return (
    <div className="learn-content">
        <QuizPageClient 
          quiz={data.quiz}
          questions={data.questions}
          returnTo={returnTo}
          showImmediateFeedback={!isPracticeExam}
        />
    </div>
  )
}
