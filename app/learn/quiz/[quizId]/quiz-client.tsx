/**
 * CATALYST - Quiz Client Component
 * 
 * Handles quiz state, answer selection, and submission.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronLeftIcon, 
  CheckCircle2Icon,
  XCircleIcon,
  GraduationCapIcon,
  ArrowRightIcon,
  RotateCcwIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { submitQuizAttempt, type QuizAnswer } from "@/lib/actions/learning"

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

interface QuizClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
}

type QuizState = "in-progress" | "complete"

export function QuizClient({ quiz, questions }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [state, setState] = useState<QuizState>("in-progress")
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }
  
  const handleSubmit = async () => {
    if (selectedOption === null) return
    
    // Record answer
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption }
    setAnswers(newAnswers)
    
    // Check if correct
    const isCorrect = currentQuestion.options[selectedOption]?.correct
    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) {
      setScore(newScore)
    }
    
    // Move to next or complete
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      // Quiz complete - submit to server
      setIsSubmitting(true)
      try {
        const quizAnswers: QuizAnswer[] = Object.entries(newAnswers).map(([qId, opt]) => ({
          questionId: qId,
          selectedOption: opt,
        }))
        await submitQuizAttempt(quiz.slug, quizAnswers)
      } catch (error) {
        console.error("Failed to save quiz attempt:", error)
      }
      setIsSubmitting(false)
      setScore(newScore) // Include final answer
      setState("complete")
    }
  }
  
  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers({})
    setScore(0)
    setState("in-progress")
  }
  
  // Results screen
  if (state === "complete") {
    const finalScore = score
    const percentage = Math.round((finalScore / totalQuestions) * 100)
    const isPassed = percentage >= quiz.passing_score
    
    return (
      <div className="learn-shell">
        <header className="learn-header">
          <div className="learn-header__inner">
            <Link href="/learn" className="learn-header__logo">
              <span className="learn-header__logo-icon">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              Prime Capital Learning
            </Link>
          </div>
        </header>
        
        <main className="learn-main learn-main--centered">
          <Stack gap="xl" className="max-w-lg mx-auto text-center py-12 px-4">
            {/* Result Icon */}
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
              isPassed ? "bg-green-500/10" : "bg-amber-500/10"
            )}>
              {isPassed ? (
                <CheckCircle2Icon className="h-10 w-10 text-green-500" />
              ) : (
                <XCircleIcon className="h-10 w-10 text-amber-500" />
              )}
            </div>
            
            {/* Title */}
            <Stack gap="sm">
              <Text size="sm" className="uppercase tracking-wider text-muted-foreground">
                Knowledge Check Complete
              </Text>
              <Title size="h2">
                {isPassed ? "Great Job!" : "Keep Learning"}
              </Title>
              <Text className="text-muted-foreground">
                {isPassed 
                  ? "You've demonstrated your understanding of this material."
                  : `You need ${quiz.passing_score}% to pass. Review the material and try again.`
                }
              </Text>
            </Stack>
            
            {/* Score Card */}
            <Card>
              <CardContent className="py-6">
                <Stack gap="md" align="center">
                  <Text size="sm" className="uppercase tracking-wider text-muted-foreground">
                    Your Score
                  </Text>
                  <div className="text-5xl font-bold">
                    {finalScore}/{totalQuestions}
                  </div>
                  <div className={cn(
                    "text-lg font-medium",
                    isPassed ? "text-green-500" : "text-amber-500"
                  )}>
                    {percentage}% — {isPassed ? "PASSED" : "NOT PASSED"}
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn("w-full h-3", isPassed ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500")}
                  />
                </Stack>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Stack gap="sm" className="w-full">
              <Button 
                size="lg" 
                className="w-full gap-2"
                render={<Link href={`/learn/${quiz.competency_slug}`} />}
              >
                Continue Learning
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              
              {!isPassed && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleRetry}
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full"
                render={<Link href="/learn" />}
              >
                Back to Dashboard
              </Button>
            </Stack>
          </Stack>
        </main>
      </div>
    )
  }
  
  // Question screen
  const questionText = currentQuestion.question_text || currentQuestion.question
  
  return (
    <div className="learn-shell">
      <header className="learn-header">
        <div className="learn-header__inner">
          <div className="learn-header__left">
            <Link href="/learn" className="learn-header__logo">
              <span className="learn-header__logo-icon">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              Prime Capital Learning
            </Link>
          </div>
        </div>
      </header>
      
      <main className="learn-main learn-main--centered">
        <Stack gap="lg" className="max-w-2xl mx-auto py-8 px-4">
          {/* Back link */}
          <Link 
            href={`/learn/${quiz.competency_slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Competency
          </Link>
          
          {/* Header */}
          <Stack gap="md">
            <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
              Knowledge Check: {quiz.title}
            </Text>
            <Row align="center" gap="md">
              <Text size="sm" className="text-muted-foreground whitespace-nowrap">
                Question {currentIndex + 1} of {totalQuestions}
              </Text>
              <Progress value={progress} className="flex-1" />
              <Text size="sm" className="text-muted-foreground whitespace-nowrap">
                {Math.round(progress)}%
              </Text>
            </Row>
          </Stack>
          
          {/* Question */}
          <Card>
            <CardContent className="py-6">
              <Stack gap="lg">
                <Text size="lg" weight="medium">
                  {questionText}
                </Text>
                
                {/* Options */}
                <Stack gap="sm">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={cn(
                        "w-full p-4 text-left border rounded-lg transition-all",
                        "hover:border-foreground/30",
                        selectedOption === index
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border"
                      )}
                    >
                      <Row align="center" gap="sm">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedOption === index
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}>
                          {selectedOption === index && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        <Text>{option.text}</Text>
                      </Row>
                    </button>
                  ))}
                </Stack>
                
                {/* Submit button */}
                <Button 
                  size="lg" 
                  className="w-full"
                  disabled={selectedOption === null || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting 
                    ? "Submitting..." 
                    : currentIndex < totalQuestions - 1 
                      ? "Next Question" 
                      : "Complete Quiz"
                  }
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </main>
    </div>
  )
}
