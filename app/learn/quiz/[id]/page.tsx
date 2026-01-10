/**
 * CATALYST - Quiz Page
 *
 * Knowledge check interface for learning modules.
 * Dynamic route: /learn/quiz/[id]
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Stack, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { 
  QuizProgress,
  QuizQuestion,
  QuizResult,
  QuizNextSteps,
  CompetencyProgressList,
} from "@/components/lms"
import { getQuizForModule, submitQuizAttempt, getCompetencyProgressSummary } from "@/lib/learning"
import type { QuizQuestion as QuizQuestionType } from "@/lib/learning-types"

// -----------------------------------------------------------------------------
// QuizPage Component
// -----------------------------------------------------------------------------

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string

  const [quiz, setQuiz] = React.useState<{
    moduleId: string
    moduleSlug: string
    moduleTitle: string
    competencySlug: string
    competencyName: string
    questions: QuizQuestionType[]
    passingScore: number
  } | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isComplete, setIsComplete] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [competencyProgress, setCompetencyProgress] = React.useState<Array<{
    slug: string
    name: string
    completed: number
    total: number
  }>>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load quiz data
  React.useEffect(() => {
    async function loadQuiz() {
      try {
        const quizData = await getQuizForModule(moduleId)
        if (!quizData) {
          setError("Quiz not found")
          return
        }
        if (quizData.questions.length === 0) {
          setError("No questions available for this quiz")
          return
        }
        setQuiz(quizData)
      } catch (err) {
        console.error("Error loading quiz:", err)
        setError("Failed to load quiz")
      } finally {
        setIsLoading(false)
      }
    }
    loadQuiz()
  }, [moduleId])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Text>Loading quiz...</Text>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Stack gap="md" className="text-center max-w-md">
          <Text size="lg" weight="semibold">{error || "Quiz not found"}</Text>
          <Button render={<Link href="/learn" />}>
            Back to Dashboard
          </Button>
        </Stack>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  const handleAnswerSubmit = async (optionIndex: number) => {
    setIsSubmitting(true)
    
    // Record answer
    const newAnswers = { ...answers, [currentQuestion.id]: optionIndex }
    setAnswers(newAnswers)
    
    // Check if correct
    const isCorrect = currentQuestion.options[optionIndex]?.correct || false
    
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    
    // Move to next question or complete
    if (isLastQuestion) {
      // Quiz complete - save attempt
      const finalScore = score + (isCorrect ? 1 : 0)
      
      try {
        await submitQuizAttempt({
          moduleId: quiz.moduleId,
          score: finalScore,
          totalQuestions,
          answers: newAnswers,
        })
        
        // Fetch updated progress
        const progress = await getCompetencyProgressSummary()
        setCompetencyProgress(progress)
        
        setIsComplete(true)
      } catch (err) {
        console.error("Error submitting quiz:", err)
        // Still show completion even if submission fails
        setIsComplete(true)
      }
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
        setIsSubmitting(false)
      }, 300)
    }
  }

  // Completed state
  if (isComplete) {
    const nextSteps = [
      {
        title: "Continue Learning",
        description: "Explore more modules in this competency",
        href: `/learn/${quiz.competencySlug}`,
        icon: "continue" as const,
      },
      {
        title: "Review This Module",
        description: `Go back and review ${quiz.moduleTitle}`,
        href: `/learn/${quiz.competencySlug}/${quiz.moduleSlug}`,
        icon: "review" as const,
      },
      {
        title: "Return to Dashboard",
        description: "See your overall progress",
        href: "/learn",
        icon: "dashboard" as const,
      },
    ]
    
    return (
      <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Stack gap="xl">
            <QuizResult
              score={score}
              total={totalQuestions}
              passingScore={quiz.passingScore}
              quizTitle={quiz.moduleTitle}
              quizDescription="You've demonstrated your understanding of this module."
            />
            
            {competencyProgress.length > 0 && (
              <CompetencyProgressList competencies={competencyProgress} />
            )}
            
            <QuizNextSteps steps={nextSteps} />
          </Stack>
        </div>
      </div>
    )
  }

  // Question state
  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Stack gap="lg">
          {/* Back link */}
          <Link 
            href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Module
          </Link>
          
          {/* Header */}
          <Stack gap="sm">
            <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
              Knowledge Check: {quiz.competencyName}
            </Text>
            <QuizProgress current={currentQuestionIndex + 1} total={totalQuestions} />
          </Stack>
          
          {/* Question */}
          <QuizQuestion
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isSubmitting={isSubmitting}
          />
        </Stack>
      </div>
    </div>
  )
}
