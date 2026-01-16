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
  ArrowLeftIcon,
  RotateCcwIcon,
  CheckIcon,
  XIcon as XMarkIcon,
  DownloadIcon,
  LightbulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
// Markdown Generator
// -----------------------------------------------------------------------------

function generateResultsMarkdown(
  quiz: Quiz,
  questions: QuizQuestion[],
  answers: Record<string, number>,
  score: number,
  passed: boolean
): string {
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const percentage = Math.round((score / questions.length) * 100)
  
  let md = `# Quiz Results: ${quiz.title}\n\n`
  md += `**Date:** ${date}  \n`
  md += `**Score:** ${score}/${questions.length} (${percentage}%)  \n`
  md += `**Result:** ${passed ? 'PASSED ✓' : 'NOT PASSED ✗'}  \n`
  md += `**Passing Score:** ${quiz.passing_score}%  \n\n`
  md += `---\n\n`
  
  questions.forEach((question, index) => {
    const userAnswerIndex = answers[question.id]
    const userAnswer = question.options[userAnswerIndex]
    const correctIndex = question.options.findIndex(opt => opt.correct)
    const isCorrect = userAnswer?.correct
    const questionText = question.question_text || question.question
    
    md += `## Question ${index + 1} ${isCorrect ? '✓' : '✗'}\n\n`
    md += `**${questionText}**\n\n`
    
    question.options.forEach((option, optIndex) => {
      const isUserAnswer = optIndex === userAnswerIndex
      const isCorrectAnswer = option.correct
      
      let marker = ''
      if (isUserAnswer && isCorrectAnswer) {
        marker = ' ← Your Answer (Correct)'
      } else if (isUserAnswer) {
        marker = ' ← Your Answer'
      } else if (isCorrectAnswer) {
        marker = ' ✓ Correct Answer'
      }
      
      const prefix = isUserAnswer || isCorrectAnswer ? '**' : ''
      const suffix = isUserAnswer || isCorrectAnswer ? '**' : ''
      md += `- ${prefix}${String.fromCharCode(65 + optIndex)}) ${option.text}${suffix}${marker}\n`
    })
    
    if (!isCorrect && question.explanation) {
      md += `\n**Explanation:** ${question.explanation}\n`
    }
    
    md += `\n---\n\n`
  })
  
  // Summary
  const correctCount = Object.entries(answers).filter(([qId]) => {
    const q = questions.find(q => q.id === qId)
    return q?.options[answers[qId]]?.correct
  }).length
  
  md += `## Summary\n\n`
  md += `- **Correct Answers:** ${correctCount}\n`
  md += `- **Incorrect Answers:** ${questions.length - correctCount}\n`
  md += `- **Accuracy:** ${percentage}%\n`
  
  return md
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

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
  const [showReview, setShowReview] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  
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
    setShowReview(false)
    setExpandedQuestions(new Set())
  }
  
  const handleDownloadResults = () => {
    const finalScore = getFinalScore()
    const percentage = Math.round((finalScore / totalQuestions) * 100)
    const isPassed = percentage >= quiz.passing_score
    const markdown = generateResultsMarkdown(quiz, questions, answers, finalScore, isPassed)
    const filename = `${quiz.slug}-results-${new Date().toISOString().split('T')[0]}.md`
    downloadMarkdown(markdown, filename)
  }
  
  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }
  
  const expandAllQuestions = () => {
    setExpandedQuestions(new Set(questions.map(q => q.id)))
  }
  
  const collapseAllQuestions = () => {
    setExpandedQuestions(new Set())
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
    const isRERAQuiz = quiz.slug.includes("rera")
    const backHref = isRERAQuiz ? "/learn/quiz/rera" : backLink
    
    return (
      <Stack gap="xl" className="max-w-2xl mx-auto py-8">
        {/* Summary Section */}
        <Stack gap="lg" align="center" className="text-center">
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
            <Text size="sm" className="uppercase tracking-wider text-muted-foreground">
              {quiz.title}
            </Text>
            <Title size="h2">
              {isPassed ? "Great Job!" : "Keep Practicing"}
            </Title>
            <Text className="text-muted-foreground max-w-md">
              {isPassed 
                ? "You've demonstrated your understanding of this material."
                : `You need ${quiz.passing_score}% to pass. Review your answers below to learn from your mistakes.`
              }
            </Text>
          </Stack>
          
          {/* Score Card */}
          <Card className="w-full max-w-sm">
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
          
          {/* Action Buttons */}
          <Row gap="sm" className="w-full max-w-sm flex-wrap justify-center">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownloadResults}
            >
              <DownloadIcon className="h-4 w-4" />
              Download Results
            </Button>
            {!isPassed && (
              <Button 
                className="gap-2"
                onClick={handleRetry}
              >
                <RotateCcwIcon className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </Row>
        </Stack>
        
        {/* Review Section */}
        <Stack gap="md">
          <Row justify="between" align="center">
            <Title size="h4">Review Your Answers</Title>
            <Row gap="sm">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={expandAllQuestions}
                className="text-xs"
              >
                Expand All
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={collapseAllQuestions}
                className="text-xs"
              >
                Collapse All
              </Button>
            </Row>
          </Row>
          
          <Stack gap="sm">
            {questions.map((question, index) => {
              const userAnswerIndex = answers[question.id]
              const userAnswer = question.options[userAnswerIndex]
              const isCorrect = userAnswer?.correct
              const isExpanded = expandedQuestions.has(question.id)
              const questionText = question.question_text || question.question
              
              return (
                <Card 
                  key={question.id} 
                  className={cn(
                    "transition-colors",
                    isCorrect ? "border-green-500/30" : "border-red-500/30"
                  )}
                >
                  <button
                    onClick={() => toggleQuestionExpanded(question.id)}
                    className="w-full text-left p-4"
                  >
                    <Row justify="between" align="start" gap="md">
                      <Row gap="sm" align="start" className="flex-1 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          isCorrect ? "bg-green-500/10" : "bg-red-500/10"
                        )}>
                          {isCorrect ? (
                            <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                        <Stack gap="xs" className="flex-1 min-w-0">
                          <Text weight="medium" className="line-clamp-2">
                            Q{index + 1}: {questionText}
                          </Text>
                          {!isExpanded && (
                            <Text size="sm" className={cn(
                              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {isCorrect 
                                ? "Correct" 
                                : `Your answer: ${String.fromCharCode(65 + userAnswerIndex)}) ${userAnswer?.text?.slice(0, 40)}${(userAnswer?.text?.length ?? 0) > 40 ? '...' : ''}`
                              }
                            </Text>
                          )}
                        </Stack>
                      </Row>
                      {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                    </Row>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                      <Stack gap="md">
                        {/* All Options */}
                        <Stack gap="xs">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = optIndex === userAnswerIndex
                            const isCorrectAnswer = option.correct
                            
                            return (
                              <div
                                key={optIndex}
                                className={cn(
                                  "px-3 py-2 rounded-md text-sm flex items-start gap-2",
                                  isCorrectAnswer && "bg-green-500/10 border border-green-500/30",
                                  isUserAnswer && !isCorrectAnswer && "bg-red-500/10 border border-red-500/30",
                                  !isUserAnswer && !isCorrectAnswer && "bg-muted/50"
                                )}
                              >
                                <span className="font-medium shrink-0">
                                  {String.fromCharCode(65 + optIndex)})
                                </span>
                                <span className="flex-1">{option.text}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle2Icon className="h-4 w-4 text-green-500 shrink-0" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircleIcon className="h-4 w-4 text-red-500 shrink-0" />
                                )}
                              </div>
                            )
                          })}
                        </Stack>
                        
                        {/* Explanation (only for incorrect answers) */}
                        {!isCorrect && question.explanation && (
                          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                            <LightbulbIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <Text size="sm" className="text-amber-700 dark:text-amber-300">
                              {question.explanation}
                            </Text>
                          </div>
                        )}
                      </Stack>
                    </div>
                  )}
                </Card>
              )
            })}
          </Stack>
        </Stack>
        
        {/* Bottom Navigation */}
        <Stack gap="sm" className="w-full max-w-sm mx-auto">
          <Button 
            variant={isPassed ? "default" : "outline"}
            size="lg" 
            className="w-full gap-2"
            render={<Link href={backHref} />}
          >
            {isPassed ? "Continue Learning" : (isRERAQuiz ? "Back to RERA Quizzes" : backLabel)}
            {isPassed && <ArrowRightIcon className="h-4 w-4" />}
          </Button>
          
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
    )
  }
  
  // Question screen
  const questionText = currentQuestion.question_text || currentQuestion.question
  const showingFeedback = state === "showing-feedback"
  const correctIndex = currentQuestion.options.findIndex(opt => opt.correct)
  
  // For RERA quizzes, link back to RERA index
  const isRERAQuiz = quiz.slug.includes("rera")
  const backHref = isRERAQuiz ? "/learn/quiz/rera" : backLink
  
  return (
    <Stack gap="lg" className="max-w-2xl">
      {/* Back Link + Quiz Title */}
      <Stack gap="sm">
        <Link 
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {isRERAQuiz ? "Back to RERA Quizzes" : backLabel}
        </Link>
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
