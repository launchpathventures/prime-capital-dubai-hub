/**
 * CATALYST - Quiz Sheet
 * 
 * Slide-over panel for taking quizzes without leaving the module page.
 * Keeps user in context while completing knowledge checks.
 * 
 * Shows immediate feedback after each answer (correct/incorrect + explanation).
 */

"use client"

import * as React from "react"
import { Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  CheckCircle2Icon,
  XCircleIcon,
  RotateCcwIcon,
  ClipboardCheckIcon,
  ArrowRightIcon,
  XIcon,
  CheckIcon,
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

interface QuizSheetProps {
  quiz: Quiz
  questions: QuizQuestion[]
  trigger?: React.ReactNode
  /** Called when quiz is completed (passed or failed) */
  onComplete?: (passed: boolean, score: number, maxScore: number) => void
}

type QuizState = "in-progress" | "showing-feedback" | "complete"

// -----------------------------------------------------------------------------
// QuizSheet Component
// -----------------------------------------------------------------------------

export function QuizSheet({ quiz, questions, trigger, onComplete }: QuizSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [state, setState] = React.useState<QuizState>("in-progress")
  const [score, setScore] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = React.useState(false)
  
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  
  const handleOptionSelect = (optionIndex: number) => {
    if (state === "showing-feedback") return // Don't allow changes during feedback
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
    
    // Show feedback before moving to next question
    setState("showing-feedback")
  }
  
  const handleContinue = async () => {
    // Move to next question or complete quiz
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setState("in-progress")
    } else {
      // Quiz complete - submit to server
      setIsSubmitting(true)
      try {
        const quizAnswers: QuizAnswer[] = Object.entries(answers).map(([qId, opt]) => ({
          questionId: qId,
          selectedOption: opt,
        }))
        // Add the last answer
        quizAnswers.push({
          questionId: currentQuestion.id,
          selectedOption: selectedOption!,
        })
        await submitQuizAttempt(quiz.slug, quizAnswers)
      } catch (error) {
        console.error("Failed to save quiz attempt:", error)
      }
      setIsSubmitting(false)
      setState("complete")
      
      // Notify parent
      const finalScore = lastAnswerCorrect ? score + 1 : score
      const passed = (finalScore / totalQuestions) >= (quiz.passing_score / 100)
      onComplete?.(passed, finalScore, totalQuestions)
    }
  }
  
  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers({})
    setScore(0)
    setState("in-progress")
    setLastAnswerCorrect(false)
  }
  
  const handleClose = () => {
    setOpen(false)
    // Reset state after animation
    setTimeout(() => {
      setCurrentIndex(0)
      setSelectedOption(null)
      setAnswers({})
      setScore(0)
      setState("in-progress")
      setLastAnswerCorrect(false)
    }, 300)
  }
  
  // Calculate final score for results
  const getFinalScore = () => {
    if (state === "showing-feedback") {
      return lastAnswerCorrect ? score + 1 : score
    }
    return score
  }
  
  // Default trigger
  const defaultTrigger = (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-6 px-6">
        <Row align="center" justify="between" className="flex-col sm:flex-row gap-4">
          <Row gap="md" align="center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ClipboardCheckIcon className="h-6 w-6 text-primary" />
            </div>
            <Stack gap="xs">
              <Text weight="semibold" className="text-foreground">
                Ready to test your knowledge?
              </Text>
              <Text size="sm" className="text-muted-foreground">
                Complete a short quiz to reinforce what you&apos;ve learned.
              </Text>
            </Stack>
          </Row>
          <Button size="lg" className="gap-2 shrink-0">
            Take Quiz
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Row>
      </CardContent>
    </Card>
  )
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger nativeButton={false} render={<div className="cursor-pointer" />}>
        {trigger || defaultTrigger}
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg p-0 flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <Text size="xs" className="uppercase tracking-wider text-muted-foreground mb-1">
              Knowledge Check
            </Text>
            <SheetTitle className="text-base font-semibold">{quiz.title}</SheetTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {state === "complete" ? (
            <QuizResults
              score={getFinalScore()}
              totalQuestions={totalQuestions}
              passingScore={quiz.passing_score}
              onRetry={handleRetry}
              onClose={handleClose}
            />
          ) : (
            <QuizQuestionView
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              progress={progress}
              question={currentQuestion}
              selectedOption={selectedOption}
              isSubmitting={isSubmitting}
              showFeedback={state === "showing-feedback"}
              isCorrect={lastAnswerCorrect}
              onOptionSelect={handleOptionSelect}
              onSubmit={handleSubmit}
              onContinue={handleContinue}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// -----------------------------------------------------------------------------
// QuizQuestionView Component
// -----------------------------------------------------------------------------

interface QuizQuestionViewProps {
  currentIndex: number
  totalQuestions: number
  progress: number
  question: QuizQuestion
  selectedOption: number | null
  isSubmitting: boolean
  showFeedback: boolean
  isCorrect: boolean
  onOptionSelect: (index: number) => void
  onSubmit: () => void
  onContinue: () => void
}

function QuizQuestionView({
  currentIndex,
  totalQuestions,
  progress,
  question,
  selectedOption,
  isSubmitting,
  showFeedback,
  isCorrect,
  onOptionSelect,
  onSubmit,
  onContinue,
}: QuizQuestionViewProps) {
  const questionText = question.question_text || question.question
  
  return (
    <div className="p-6">
      <Stack gap="lg">
        {/* Progress */}
        <Stack gap="sm">
          <Row align="center" justify="between">
            <Text size="sm" className="text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
            <Text size="sm" className="text-muted-foreground">
              {Math.round(progress)}%
            </Text>
          </Row>
          <Progress value={progress} className="h-2" />
        </Stack>
        
        {/* Question */}
        <Text size="lg" weight="medium" className="leading-relaxed">
          {questionText}
        </Text>
        
        {/* Feedback Banner */}
        {showFeedback && (
          <div className={cn(
            "p-4 rounded-lg flex items-start gap-3",
            isCorrect ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            {isCorrect ? (
              <CheckCircle2Icon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <Stack gap="xs">
              <Text weight="semibold" className={isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
              {question.explanation && (
                <Text size="sm" className="text-muted-foreground">
                  {question.explanation}
                </Text>
              )}
            </Stack>
          </div>
        )}
        
        {/* Options */}
        <Stack gap="sm">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index
            const isCorrectOption = option.correct
            
            // Determine styling based on feedback state
            let optionStyle = "border-border"
            if (showFeedback) {
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
                onClick={() => onOptionSelect(index)}
                disabled={showFeedback}
                className={cn(
                  "w-full p-4 text-left border rounded-lg transition-all",
                  !showFeedback && "hover:border-foreground/30",
                  showFeedback && "cursor-default",
                  optionStyle
                )}
              >
                <Row align="start" gap="sm">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    showFeedback && isCorrectOption && "border-green-500 bg-green-500",
                    showFeedback && isSelected && !isCorrectOption && "border-red-500 bg-red-500",
                    !showFeedback && isSelected && "border-primary bg-primary",
                    !showFeedback && !isSelected && "border-muted-foreground/30"
                  )}>
                    {showFeedback && isCorrectOption && (
                      <CheckIcon className="h-3 w-3 text-white" />
                    )}
                    {showFeedback && isSelected && !isCorrectOption && (
                      <XIcon className="h-3 w-3 text-white" />
                    )}
                    {!showFeedback && isSelected && (
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
        {showFeedback ? (
          <Button 
            size="lg" 
            className="w-full gap-2"
            onClick={onContinue}
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
            disabled={selectedOption === null}
            onClick={onSubmit}
          >
            Submit Answer
          </Button>
        )}
      </Stack>
    </div>
  )
}

// -----------------------------------------------------------------------------
// QuizResults Component
// -----------------------------------------------------------------------------

interface QuizResultsProps {
  score: number
  totalQuestions: number
  passingScore: number
  onRetry: () => void
  onClose: () => void
}

function QuizResults({
  score,
  totalQuestions,
  passingScore,
  onRetry,
  onClose,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const isPassed = percentage >= passingScore
  
  return (
    <div className="p-6">
      <Stack gap="xl" align="center" className="text-center py-8">
        {/* Result Icon */}
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center",
          isPassed ? "bg-green-500/10" : "bg-amber-500/10"
        )}>
          {isPassed ? (
            <CheckCircle2Icon className="h-10 w-10 text-green-500" />
          ) : (
            <XCircleIcon className="h-10 w-10 text-amber-500" />
          )}
        </div>
        
        {/* Title */}
        <Stack gap="sm" align="center">
          <Title size="h3">
            {isPassed ? "Great Job!" : "Keep Learning"}
          </Title>
          <Text className="text-muted-foreground max-w-xs">
            {isPassed 
              ? "You've demonstrated your understanding of this material."
              : `You need ${passingScore}% to pass. Review the material and try again.`
            }
          </Text>
        </Stack>
        
        {/* Score */}
        <Card className="w-full">
          <CardContent className="py-6">
            <Stack gap="md" align="center">
              <Text size="sm" className="uppercase tracking-wider text-muted-foreground">
                Your Score
              </Text>
              <div className="text-4xl font-bold">
                {score}/{totalQuestions}
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
            className="w-full"
            onClick={onClose}
          >
            {isPassed ? "Continue Learning" : "Back to Module"}
          </Button>
          
          {!isPassed && (
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full gap-2"
              onClick={onRetry}
            >
              <RotateCcwIcon className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </Stack>
      </Stack>
    </div>
  )
}
