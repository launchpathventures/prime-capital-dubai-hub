/**
 * CATALYST - RERA Exam Prep Index
 * 
 * Lists all RERA-related quizzes for exam preparation.
 */

import Link from "next/link"
import { 
  ClipboardCheckIcon,
  GraduationCapIcon,
  ChevronRightIcon,
  BookOpenIcon,
  CalculatorIcon,
  ScaleIcon,
  FileTextIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { LearnShell } from "../../_surface/learn-shell"

// =============================================================================
// Types
// =============================================================================

interface Quiz {
  slug: string
  title: string
  description: string | null
  question_count: number | null
  passing_score: number | null
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getRERAQuizzes(): Promise<Quiz[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quizzes")
    .select("slug, title, description, question_count, passing_score")
    .or("slug.ilike.%rera%,slug.ilike.%rera-%")
    .order("slug")
  
  if (error) {
    console.error("Failed to fetch RERA quizzes:", error)
    return []
  }
  
  return data || []
}

// =============================================================================
// Quiz Icon Mapping
// =============================================================================

function getQuizIcon(slug: string) {
  if (slug.includes("calculation")) return <CalculatorIcon className="h-5 w-5" />
  if (slug.includes("ethics")) return <ScaleIcon className="h-5 w-5" />
  if (slug.includes("regulation") || slug.includes("law")) return <FileTextIcon className="h-5 w-5" />
  if (slug.includes("practice-exam")) return <ClipboardCheckIcon className="h-5 w-5" />
  return <BookOpenIcon className="h-5 w-5" />
}

// =============================================================================
// Page Component
// =============================================================================

export default async function RERAQuizIndexPage() {
  const quizzes = await getRERAQuizzes()
  
  // Separate practice exams from topic quizzes
  const practiceExams = quizzes.filter(q => q.slug.includes("practice-exam"))
  const topicQuizzes = quizzes.filter(q => !q.slug.includes("practice-exam"))
  
  return (
    <LearnShell activeSection="rera">
      <div className="learn-content">
        <div className="lms-page">
          {/* Header */}
          <div className="lms-page__header">
            <div className="lms-page__eyebrow">
              <GraduationCapIcon className="h-4 w-4" />
              Exam Practice
            </div>
            <h1 className="lms-page__title">RERA Practice Quizzes</h1>
            <p className="lms-page__description">
              Prepare for your RERA certification exam with topic-focused quizzes 
              and full-length practice exams.
            </p>
          </div>
        
        {/* Topic Quizzes */}
        {topicQuizzes.length > 0 && (
          <div className="lms-section">
            <h2 className="lms-section__title">Topic Quizzes</h2>
            <p className="text-sm text-gray-500 mb-4">
              Focus on specific areas of the RERA exam
            </p>
            
            <div className="grid gap-3">
              {topicQuizzes.map(quiz => (
                <Link
                  key={quiz.slug}
                  href={`/learn/quiz/${quiz.slug}`}
                  className="lms-card lms-card--clickable group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                      {getQuizIcon(quiz.slug)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-sm text-gray-500 truncate">{quiz.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {quiz.question_count && (
                          <span>{quiz.question_count} questions</span>
                        )}
                        {quiz.passing_score && (
                          <span>{quiz.passing_score}% to pass</span>
                        )}
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Practice Exams */}
        {practiceExams.length > 0 && (
          <div className="lms-section">
            <h2 className="lms-section__title">Practice Exams</h2>
            <p className="text-sm text-gray-500 mb-4">
              Full-length simulated exams to test your readiness
            </p>
            
            <div className="grid gap-3">
              {practiceExams.map(quiz => (
                <Link
                  key={quiz.slug}
                  href={`/learn/quiz/${quiz.slug}`}
                  className="lms-card lms-card--clickable group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                      <ClipboardCheckIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-sm text-gray-500 truncate">{quiz.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {quiz.question_count && (
                          <span>{quiz.question_count} questions</span>
                        )}
                        {quiz.passing_score && (
                          <span>{quiz.passing_score}% to pass</span>
                        )}
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {quizzes.length === 0 && (
          <div className="lms-card text-center py-12">
            <ClipboardCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No RERA quizzes available</h3>
            <p className="text-sm text-gray-500">
              Check back later for exam preparation materials.
            </p>
          </div>
        )}
        </div>
      </div>
    </LearnShell>
  )
}
