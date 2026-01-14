/**
 * CATALYST - Knowledge Check Client
 * 
 * Client wrapper for QuizSheet that handles the slide-over interaction.
 */

"use client"

import { QuizSheet } from "./quiz-sheet"

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

interface KnowledgeCheckClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
}

export function KnowledgeCheckClient({ quiz, questions }: KnowledgeCheckClientProps) {
  return (
    <QuizSheet 
      quiz={quiz}
      questions={questions}
    />
  )
}
