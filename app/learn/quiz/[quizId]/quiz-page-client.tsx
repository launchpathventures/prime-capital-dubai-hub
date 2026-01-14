/**
 * CATALYST - Quiz Page Client Component
 * 
 * Handles quiz state, answer selection, and submission.
 * This component is used within the learn shell (rendered by page.tsx).
 * 
 * For RERA exams: No feedback shown during quiz, only scored at the end.
 * For regular quizzes: Shows immediate feedback after each answer.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2Icon,
  XCircleIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  CheckIcon,
  XIcon as XMarkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { submitQuizAttempt, type QuizAnswer } from "@/lib/actions/learning"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

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

interface QuizPageClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
  returnTo?: string
  /** If true, show immediate feedback after each question */
  showImmediateFeedback?: boolean
}

type QuizState = "in-progress" | "showing-feedback" | "complete"

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function QuizPageClient({ quiz, questions, returnTo, showImmediateFeedback = false }: QuizPageClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [state, setState] = useState<QuizState>("in-progress")
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  
  // Determine back link
  const backLink = returnTo || `/learn/${quiz.competency_slug}`
  const backLabel = returnTo ? "Back to Module" : "Back to Competency"
  
  const handleOptionSelect = (optionIndex: number) => {
    if (state === "showing-feedback") return
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
    setLastAnswerCorrect(isCorrect)
    if (isCorrect) {
      setScore(newScore)
    }
    
    // Show feedback if enabled, otherwise move directly to next
    if (showImmediateFeedback) {
      setState("showing-feedback")
    } else {
      // Move to next question or complete quiz directly (RERA exam mode)
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelectedOption(null)
      } else {
        // Quiz complete - submit to server
        await completeQuiz(newAnswers, newScore)
      }
    }
  }
  
  const handleContinue = async () => {
    // Move to next question or complete quiz
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setState("in-progress")
    } else {
      // Quiz complete - submit to server
      const finalAnswers = { ...answers, [currentQuestion.id]: selectedOption! }
      const finalScore = lastAnswerCorrect ? score + 1 : score
      await completeQuiz(finalAnswers, finalScore)
    }
  }
  
  const completeQuiz = async (finalAnswers: Record<string, number>, finalScore: number) => {
    setIsSubmitting(true)
    try {
      const quizAnswers: QuizAnswer[] = Object.entries(finalAnswers).map(([qId, opt]) => ({
        questionId: qId,
        selectedOption: opt,
      }))
      await submitQuizAttempt(quiz.slug, quizAnswers)
    } catch (error) {
      console.error("Failed to save quiz attempt:", error)
    }
    setIsSubmitting(false)
    setScore(finalScore)
    setState("complete")
  }
  
  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers({})
    setScore(0)
    setState("in-progress")
    setLastAnswerCorrect(false)
  }
  
  // Calculate final score for display
  const getFinalScore = () => {
    if (state === "showing-feedback") {
      return lastAnswerCorrect ? score + 1 : score
    }
    return score
  }
  
  // Results screen
  if (state === "complete") {
    const finalScore = getFinalScore()
    const percentage = Math.round((finalScore / totalQuestions) * 100)
    const isPassed = percentage >= quiz.passing_score
    
    return (
      <Stack gap="xl" className="max-w-xl mx-auto text-center py-8">
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
            {quiz.title}
          </Text>
          <Title size="h2">
            {isPassed ? "Great Job!" : "Keep Practicing"}
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
          {!isPassed && (
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={handleRetry}
            >
              <RotateCcwIcon className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant={isPassed ? "default" : "outline"}
            size="lg" 
            className="w-full gap-2"
            nativeButton={false}
            render={<Link href={backLink} />}
          >
            {isPassed ? "Continue Learning" : backLabel}
            {isPassed && <ArrowRightIcon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full"
            nativeButton={false}
            render={<Link href="/learn" />}
          >
            Back to Dashboard
          </Button>
        </Stack>
      </Stack>
    )
  }
  
  // Question screen
  const questionText = currentQuestion.question_text || currentQuestion.question
  const showingFeedback = state === "showing-feedback"
  const correctIndex = currentQuestion.options.findIndex(opt => opt.correct)
  
  return (
    <Stack gap="lg" className="max-w-2xl">
      {/* Quiz Title */}
      <Stack gap="xs">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          {quiz.title}
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
      
      {/* Question Card */}
      <Card>
        <CardContent className="py-6">
          <Stack gap="lg">
            <Text size="lg" weight="medium" className="leading-relaxed">
              {questionText}
            </Text>
            
            {/* Feedback Banner (only for non-RERA quizzes) */}
            {showingFeedback && (
              <div className={cn(
                "p-4 rounded-lg flex items-start gap-3",
                lastAnswerCorrect ? "bg-green-500/10" : "bg-red-500/10"
              )}>
                {lastAnswerCorrect ? (
                  <CheckCircle2Icon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <Stack gap="xs">
                  <Text weight="semibold" className={lastAnswerCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                    {lastAnswerCorrect ? "Correct!" : "Incorrect"}
                  </Text>
                  {currentQuestion.explanation && (
                    <Text size="sm" className="text-muted-foreground">
                      {currentQuestion.explanation}
                    </Text>
                  )}
                </Stack>
              </div>
            )}
            
            {/* Options */}
            <Stack gap="sm">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index
                const isCorrectOption = option.correct
                
                // Determine styling based on feedback state
                let optionStyle = "border-border"
                if (showingFeedback) {
                  if (isCorrectOption) {
                    optionStyle = "border-green-500 bg-green-500/10"
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = "border-red-500 bg-red-500/10"
                  }
                } else if (isSelected) {
                  optionStyle = "border-primary bg-primary/5 ring-2 ring-primary/20"
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showingFeedback}
                    className={cn(
                      "w-full p-4 text-left border rounded-lg transition-all",
                      !showingFeedback && "hover:border-foreground/30",
                      showingFeedback && "cursor-default",
                      optionStyle
                    )}
                  >
                    <Row align="start" gap="sm">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                        showingFeedback && isCorrectOption && "border-green-500 bg-green-500",
                        showingFeedback && isSelected && !isCorrectOption && "border-red-500 bg-red-500",
                        !showingFeedback && isSelected && "border-primary bg-primary",
                        !showingFeedback && !isSelected && "border-muted-foreground/30"
                      )}>
                        {showingFeedback && isCorrectOption && (
                          <CheckIcon className="h-3 w-3 text-white" />
                        )}
                        {showingFeedback && isSelected && !isCorrectOption && (
                          <XMarkIcon className="h-3 w-3 text-white" />
                        )}
                        {!showingFeedback && isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <Text className="flex-1">{option.text}</Text>
                    </Row>
                  </button>
                )
              })}
            </Stack>
            
            {/* Action button */}
            {showingFeedback ? (
              <Button 
                size="lg" 
                className="w-full gap-2"
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? "Saving..." 
                  : currentIndex < totalQuestions - 1 
                    ? <>Continue <ArrowRightIcon className="h-4 w-4" /></>
                    : "See Results"
                }
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full"
                disabled={selectedOption === null || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting 
                  ? "Submitting..." 
                  : showImmediateFeedback
                    ? "Submit Answer"
                    : currentIndex < totalQuestions - 1 
                      ? "Next Question" 
                      : "Complete Exam"
                }
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
