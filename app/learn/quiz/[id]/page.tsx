/**
 * CATALYST - Quiz Page
 *
 * Knowledge check interface for learning behaviours.
 * Dynamic route: /learn/quiz/[id]
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, CheckCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Quiz Data (mock - would come from database)
// -----------------------------------------------------------------------------

const quizData: Record<string, {
  title: string
  behaviourSlug: string
  competencySlug: string
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }>
}> = {
  "prime-capital-identity-our-story": {
    title: "Our Story Knowledge Check",
    behaviourSlug: "our-story",
    competencySlug: "prime-capital-identity",
    questions: [
      {
        id: "q1",
        question: "What is Prime Capital's positioning in the Dubai market?",
        options: [
          "The largest agency with the most listings",
          "A boutique advisory focused on quality over volume",
          "A discount brokerage with low fees",
          "A developer-owned sales channel",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "What is our primary value to clients?",
        options: [
          "Access to off-market opportunities",
          "Honest guidance",
          "A team of 60+ years combined experience",
          "Trusted guidance through expertise, discretion, and transparency",
        ],
        correctAnswer: 3,
      },
      {
        id: "q3",
        question: "How should you describe our founders' expertise?",
        options: [
          "Three partners who saw a gap in the market",
          "60+ years combined experience — Tahir in client relationships, Shaad in developer networks, and Rohit in international markets",
          "Young entrepreneurs with fresh ideas",
          "Former developers with insider knowledge",
        ],
        correctAnswer: 1,
      },
    ],
  },
}

// -----------------------------------------------------------------------------
// QuizPage Component
// -----------------------------------------------------------------------------

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const quiz = quizData[quizId]

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [correctAnswers, setCorrectAnswers] = React.useState(0)

  if (!quiz) {
    return (
      <Container size="md" className="py-12">
        <Stack gap="md" className="text-center">
          <Title size="h2">Quiz not found</Title>
          <Button nativeButton={false} render={<Link href="/learn" />}>
            Back to Dashboard
          </Button>
        </Stack>
      </Container>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    setIsSubmitted(true)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1)
    }

    // Auto-advance after a delay
    setTimeout(() => {
      if (isLastQuestion) {
        // Navigate to completion page
        router.push(`/learn/quiz/${quizId}/complete`)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setIsSubmitted(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
      <Container size="md" className="py-8">
        <Stack gap="xl">
          {/* Back Link */}
          <Link
            href={`/learn/${quiz.competencySlug}/${quiz.behaviourSlug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            BACK TO LEARNING CONTENT
          </Link>

          {/* Question Header */}
          <Stack gap="sm" className="text-center">
            <Text size="sm" variant="muted" className="uppercase tracking-wider">
              Knowledge Check — Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Text>
            <Title size="h1" className="text-3xl sm:text-4xl max-w-2xl mx-auto">
              {currentQuestion.question}
            </Title>
          </Stack>

          {/* Answer Options */}
          <Stack gap="md" className="max-w-2xl mx-auto w-full">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
                disabled={isSubmitted}
                className={cn(
                  "w-full p-6 rounded-lg border-2 transition-all text-left",
                  "hover:border-primary hover:bg-white",
                  selectedAnswer === index && !isSubmitted && "border-primary bg-white",
                  isSubmitted && index === currentQuestion.correctAnswer && "border-green-500 bg-green-50",
                  isSubmitted && index === selectedAnswer && index !== currentQuestion.correctAnswer && "border-red-500 bg-red-50",
                  isSubmitted && "cursor-not-allowed"
                )}
              >
                <Row gap="md" align="center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0",
                      selectedAnswer === index && !isSubmitted && "border-primary bg-primary text-white",
                      isSubmitted && index === currentQuestion.correctAnswer && "border-green-500 bg-green-500 text-white",
                      isSubmitted && index === selectedAnswer && index !== currentQuestion.correctAnswer && "border-red-500 bg-red-500 text-white"
                    )}
                  >
                    {selectedAnswer === index && !isSubmitted && "●"}
                    {isSubmitted && index === currentQuestion.correctAnswer && <CheckCircleIcon className="h-5 w-5" />}
                  </div>
                  <Text className="flex-1">{option}</Text>
                </Row>
              </button>
            ))}
          </Stack>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="px-12"
              >
                SUBMIT ANSWER
              </Button>
            </div>
          )}

          {/* Feedback */}
          {isSubmitted && (
            <Card className={cn(
              "max-w-2xl mx-auto w-full",
              selectedAnswer === currentQuestion.correctAnswer ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            )}>
              <CardContent className="pt-6 text-center">
                <Text size="lg" weight="semibold" className={selectedAnswer === currentQuestion.correctAnswer ? "text-green-700" : "text-red-700"}>
                  {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                </Text>
                <Text size="sm" className="mt-2">
                  {isLastQuestion 
                    ? "Moving to completion page..." 
                    : "Moving to next question..."}
                </Text>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </div>
  )
}
