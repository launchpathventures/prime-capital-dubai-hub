/**
 * CATALYST - Knowledge Check CTA
 * 
 * Server component that fetches quiz data and renders the QuizSheet slide-over.
 * Uses Prime Capital brand design tokens.
 */

import { createClient } from "@/lib/supabase/server"
import { KnowledgeCheckClient } from "./knowledge-check-client"

interface KnowledgeCheckCTAProps {
  quizId: string
}

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

export async function KnowledgeCheckCTA({ quizId }: KnowledgeCheckCTAProps) {
  const data = await getQuizData(quizId)
  
  // If no quiz data, don't render anything
  if (!data || data.questions.length === 0) {
    return null
  }
  
  return (
    <KnowledgeCheckClient 
      quiz={data.quiz}
      questions={data.questions}
    />
  )
}
