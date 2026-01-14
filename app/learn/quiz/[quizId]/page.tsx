/**
 * CATALYST - Quiz Page
 * 
 * Route: /learn/quiz/[quizId]
 * Shows quiz questions with full learn shell and sidebar navigation.
 * Used for standalone quizzes like RERA practice exams.
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizPageClient } from "./quiz-page-client"
import { GraduationCapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface RERAQuiz {
  slug: string
  title: string
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

async function getRERAQuizzes(): Promise<RERAQuiz[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quizzes")
    .select("slug, title, question_count")
    .or("slug.ilike.%rera%,competency_slug.eq.rera-exam-prep")
    .order("title")
  
  if (error) return []
  return data || []
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function QuizPage({ params, searchParams }: PageProps) {
  const { quizId } = await params
  const { returnTo } = await searchParams
  
  const [data, competencies, reraQuizzes] = await Promise.all([
    getQuizData(quizId),
    getCompetencies(),
    getRERAQuizzes(),
  ])
  
  if (!data || data.questions.length === 0) {
    notFound()
  }
  
  // Determine if this is a RERA quiz
  const isRERAQuiz = data.quiz.slug.includes("rera") || data.quiz.competency_slug === "rera-exam-prep"
  
  return (
    <div className="learn-shell learn-shell--with-sidebar">
      {/* Header */}
      <header className="learn-header">
        <div className="learn-header__inner">
          <div className="learn-header__left">
            <Link href="/learn" className="learn-header__logo">
              <span className="learn-header__logo-icon">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              Prime Capital Learning
            </Link>
            <nav className="learn-header__breadcrumb">
              <Link href="/learn">Course</Link>
              <span className="learn-header__breadcrumb-sep">›</span>
              {isRERAQuiz ? (
                <span className="learn-header__breadcrumb-current">RERA Exam Practice</span>
              ) : (
                <>
                  <Link href={`/learn/${data.quiz.competency_slug}`}>
                    {data.quiz.competency_slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </Link>
                  <span className="learn-header__breadcrumb-sep">›</span>
                  <span className="learn-header__breadcrumb-current">Quiz</span>
                </>
              )}
            </nav>
          </div>
          <nav className="learn-header__nav">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/" />}>
              Home
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Sidebar */}
      <QuizSidebar 
        competencies={competencies}
        reraQuizzes={reraQuizzes}
        currentQuizSlug={quizId}
      />
      
      {/* Main Content */}
      <main className="learn-content">
        <div className="learn-content__inner">
          <QuizPageClient 
            quiz={data.quiz}
            questions={data.questions}
            returnTo={returnTo}
            showImmediateFeedback={!isRERAQuiz}
          />
        </div>
      </main>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Quiz Sidebar Component
// -----------------------------------------------------------------------------

interface QuizSidebarProps {
  competencies: Competency[]
  reraQuizzes: RERAQuiz[]
  currentQuizSlug: string
}

function QuizSidebar({ competencies, reraQuizzes, currentQuizSlug }: QuizSidebarProps) {
  // Separate RERA quizzes into categories
  const practiceExams = reraQuizzes.filter(q => q.slug.includes("practice-exam"))
  const topicQuizzes = reraQuizzes.filter(q => !q.slug.includes("practice-exam"))
  
  return (
    <aside className="learn-sidebar">
      {/* Header */}
      <div className="learn-sidebar__header">
        <div className="learn-sidebar__label">Quiz Practice</div>
        <Link 
          href="/learn"
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="learn-sidebar__nav">
        {/* RERA Practice Exams Section */}
        {practiceExams.length > 0 && (
          <div className="learn-competency" data-expanded="true">
            <div className="learn-competency__trigger" data-active="true">
              <span className="learn-competency__number">📝</span>
              <div className="learn-competency__info">
                <div className="learn-competency__name">RERA Practice Exams</div>
                <div className="learn-competency__meta">{practiceExams.length} full exams</div>
              </div>
            </div>
            <div className="learn-modules">
              {practiceExams.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/learn/quiz/${quiz.slug}`}
                  className="learn-module"
                  data-active={currentQuizSlug === quiz.slug}
                >
                  <span className="learn-module__icon" data-status={currentQuizSlug === quiz.slug ? "current" : "default"}>
                    {quiz.question_count}
                  </span>
                  <span>{quiz.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* RERA Topic Quizzes Section */}
        {topicQuizzes.length > 0 && (
          <div className="learn-competency" data-expanded="true">
            <div className="learn-competency__trigger">
              <span className="learn-competency__number">📚</span>
              <div className="learn-competency__info">
                <div className="learn-competency__name">RERA Topic Quizzes</div>
                <div className="learn-competency__meta">{topicQuizzes.length} topic quizzes</div>
              </div>
            </div>
            <div className="learn-modules">
              {topicQuizzes.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/learn/quiz/${quiz.slug}`}
                  className="learn-module"
                  data-active={currentQuizSlug === quiz.slug}
                >
                  <span className="learn-module__icon" data-status={currentQuizSlug === quiz.slug ? "current" : "default"}>
                    {quiz.question_count}
                  </span>
                  <span>{quiz.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Footer */}
      <div className="learn-sidebar__footer">
        <div className="learn-sidebar__progress">
          Practice makes perfect
        </div>
      </div>
    </aside>
  )
}
