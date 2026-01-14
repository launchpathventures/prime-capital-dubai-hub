/**
 * CATALYST - Quiz Page
 * 
 * Route: /learn/quiz/[quizId]
 * Shows quiz questions with full learn shell and sidebar navigation.
 * Used for standalone quizzes like RERA practice exams.
 */

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { QuizPageClient } from "./quiz-page-client"
import { LearnShell } from "../../_surface/learn-shell"

interface PageProps {
  params: Promise<{ quizId: string }>
  searchParams: Promise<{ returnTo?: string }>
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

interface Module {
  slug: string
  title: string
  status: "complete" | "current" | "locked"
}

interface Competency {
  slug: string
  name: string
  number: number
  locked: boolean
  modules: Module[]
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

async function getCompetencies(): Promise<Competency[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("competencies")
    .select(`
      slug,
      name,
      display_order,
      learning_modules (slug, title, display_order)
    `)
    .order("display_order", { ascending: true })
  
  if (error) return []
  
  return (data || []).map((comp, index) => ({
    slug: comp.slug,
    name: comp.name,
    number: index + 1,
    locked: false,
    modules: ((comp as { learning_modules?: { slug: string; title: string; display_order: number }[] }).learning_modules || [])
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map(m => ({
        slug: m.slug,
        title: m.title,
        status: "current" as const,
      })),
  }))
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function QuizPage({ params, searchParams }: PageProps) {
  const { quizId } = await params
  const { returnTo } = await searchParams
  
  const [data, competencies, userRole, userMenu] = await Promise.all([
    getQuizData(quizId),
    getCompetencies(),
    getUserRole(),
    getUserForMenu(),
  ])
  
  if (!data || data.questions.length === 0) {
    notFound()
  }
  
  // Practice exams don't show immediate feedback, topic quizzes do
  const isPracticeExam = data.quiz.slug.includes("practice-exam")
  
  return (
    <LearnShell 
      activeSection="rera"
      competencies={competencies}
      userRole={userRole}
      user={userMenu ?? undefined}
    >
      <div className="learn-content">
        <QuizPageClient 
          quiz={data.quiz}
          questions={data.questions}
          returnTo={returnTo}
          showImmediateFeedback={!isPracticeExam}
        />
      </div>
    </LearnShell>
  )
}
