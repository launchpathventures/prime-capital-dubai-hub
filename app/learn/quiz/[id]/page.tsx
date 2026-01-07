/**
 * CATALYST - Quiz Page
 *
 * Knowledge check interface matching the design screenshots.
 * Dynamic route: /learn/quiz/[id]
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CircleIcon,
  LockIcon,
  ChevronRightIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Quiz Data (mock - would come from database)
// -----------------------------------------------------------------------------

const quizData: Record<string, {
  title: string
  behaviourTitle: string
  competencySlug: string
  moduleSlug: string
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctIndex: number
  }>
}> = {
  "prime-capital-identity-our-story": {
    title: "Knowledge Check",
    behaviourTitle: "Articulates the Prime Capital Story",
    competencySlug: "prime-capital-identity",
    moduleSlug: "our-story",
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
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "What are the three key areas of founder expertise?",
        options: [
          "Marketing, Sales, Finance",
          "Technology, Operations, HR",
          "Client relationships, Developer networks, International markets",
          "Legal, Compliance, Administration",
        ],
        correctIndex: 2,
      },
      {
        id: "q3",
        question: "How many years of combined experience do the founders have?",
        options: [
          "20+ years",
          "40+ years",
          "60+ years",
          "100+ years",
        ],
        correctIndex: 2,
      },
    ],
  },
}

// All competencies for sidebar
const allCompetencies = [
  { id: 1, slug: "prime-capital-identity", name: "Prime Capital Identity", behaviourCount: 5, status: "active" as const },
  { id: 2, slug: "market-intelligence", name: "Market Intelligence", behaviourCount: 5, status: "coming-soon" as const },
  { id: 3, slug: "client-discovery", name: "Client Discovery", behaviourCount: 5, status: "coming-soon" as const },
  { id: 4, slug: "property-matching", name: "Property Matching", behaviourCount: 5, status: "coming-soon" as const },
  { id: 5, slug: "objection-navigation", name: "Objection Navigation", behaviourCount: 5, status: "coming-soon" as const },
  { id: 6, slug: "transaction-management", name: "Transaction Management", behaviourCount: 5, status: "coming-soon" as const },
  { id: 7, slug: "relationship-stewardship", name: "Relationship Stewardship", behaviourCount: 5, status: "coming-soon" as const },
]

// Behaviours for sidebar
const behavioursList = [
  { slug: "our-story", title: "Our Story", status: "current" as const },
  { slug: "boutique-positioning", title: "Boutique Positioning", status: "current" as const },
  { slug: "service-model", title: "Service Model", status: "current" as const },
  { slug: "founders-vision", title: "Founders' Vision", status: "current" as const },
  { slug: "brand-voice", title: "Brand Voice", status: "locked" as const },
]

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  const quiz = quizData[quizId]

  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [score, setScore] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)

  // Handle quiz not found
  if (!quiz) {
    return (
      <div className="flex min-h-screen bg-[#F2EFEA] items-center justify-center">
        <Card className="bg-white border-[#E5E2DD] rounded-[2px] max-w-md">
          <CardContent className="py-12 text-center">
            <Stack gap="md" align="center">
              <Text className="text-[#3F4142]">Quiz not found</Text>
              <Button 
                nativeButton={false}
                render={<Link href="/learn" />}
                className="bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px]"
              >
                Back to Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    if (selectedAnswer === question.correctIndex) {
      setScore((prev) => prev + 1)
    }
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      setIsComplete(true)
    }
  }

  // Completion Screen
  if (isComplete) {
    const passed = score === totalQuestions
    
    return (
      <div className="flex min-h-screen bg-[#F2EFEA]">
        {/* Sidebar */}
        <QuizSidebar competencySlug={quiz.competencySlug} />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Stack gap="lg" align="center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-[#576C75] flex items-center justify-center">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>

              {/* Title */}
              <h1 className="font-headline text-3xl text-[#3F4142]">
                Knowledge Check Complete!
              </h1>

              {/* Score */}
              <Text className="text-[#576C75] text-lg">
                You scored {score}/{totalQuestions} on &quot;{quiz.behaviourTitle}&quot;
              </Text>

              {/* Actions */}
              <Row gap="md" className="mt-4">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`} />}
                  className="border-[#576C75] text-[#576C75] hover:bg-[#576C75]/10 rounded-[2px] uppercase tracking-wider"
                >
                  Review Content
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href={`/learn/${quiz.competencySlug}`} />}
                  className="bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px] gap-2 uppercase tracking-wider"
                >
                  Next Behaviour
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </Row>
            </Stack>
          </div>
        </main>
      </div>
    )
  }

  // Quiz Screen
  return (
    <div className="flex min-h-screen bg-[#F2EFEA]">
      {/* Sidebar */}
      <QuizSidebar competencySlug={quiz.competencySlug} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-12">
          {/* Back Link */}
          <Link 
            href={`/learn/${quiz.competencySlug}/${quiz.moduleSlug}`}
            className="inline-flex items-center gap-2 text-[#576C75] hover:text-[#3F4142] transition-colors mb-8 text-sm uppercase tracking-wider"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Learning Content
          </Link>

          {/* Question Header */}
          <div className="text-center mb-8">
            <Text size="sm" className="text-[#576C75] uppercase tracking-wider mb-4">
              {quiz.title} — Question {currentQuestion + 1} of {totalQuestions}
            </Text>
            <h1 className="font-headline text-2xl md:text-3xl text-[#3F4142]">
              {question.question}
            </h1>
          </div>

          {/* Answer Options */}
          <Stack gap="sm" className="mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={cn(
                  "w-full text-left p-5 rounded-[2px] border-2 transition-all",
                  "flex items-center gap-4",
                  selectedAnswer === index
                    ? "border-[#576C75] bg-[#576C75]/5"
                    : "border-[#E5E2DD] bg-white hover:border-[#576C75]/30"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    selectedAnswer === index
                      ? "border-[#576C75]"
                      : "border-[#E5E2DD]"
                  )}
                >
                  {selectedAnswer === index && (
                    <div className="w-3 h-3 rounded-full bg-[#576C75]" />
                  )}
                </div>
                <Text className="text-[#3F4142]">{option}</Text>
              </button>
            ))}
          </Stack>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px] px-12 uppercase tracking-wider disabled:opacity-50"
            >
              Submit Answer
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Quiz Sidebar Component
// -----------------------------------------------------------------------------

function QuizSidebar({ competencySlug }: { competencySlug: string }) {
  return (
    <aside className="w-64 bg-[#576C75] text-white flex-shrink-0 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10">
        <Text size="xs" className="text-white/60 uppercase tracking-wider mb-3">
          Consultant Training
        </Text>
        <Link 
          href="/learn" 
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Exit to Course Overview
        </Link>
      </div>

      {/* Competency Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {allCompetencies.map((comp, index) => {
          const isActive = comp.slug === competencySlug
          const isExpanded = isActive
          
          return (
            <div key={comp.slug}>
              <Link
                href={`/learn/${comp.slug}`}
                className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded text-xs font-medium flex-shrink-0 ${
                  isActive ? "bg-white text-[#576C75]" : "bg-white/20 text-white"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Text size="sm" className="text-white truncate">
                      {comp.name}
                    </Text>
                    {isExpanded && <ChevronDownIcon className="h-4 w-4 text-white/60 flex-shrink-0" />}
                  </div>
                  <Text size="xs" className="text-white/60">
                    0/{comp.behaviourCount} behaviours
                  </Text>
                </div>
              </Link>

              {isExpanded && (
                <div className="pl-12 pr-4 pb-2">
                  {behavioursList.map((behaviour) => (
                    <Link
                      key={behaviour.slug}
                      href={`/learn/${comp.slug}/${behaviour.slug}`}
                      className="flex items-center gap-2 py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {behaviour.status === "locked" ? (
                        <LockIcon className="h-3 w-3 text-white/40" />
                      ) : (
                        <CircleIcon className="h-4 w-4 text-white/60" />
                      )}
                      <span className={behaviour.status === "locked" ? "text-white/40" : ""}>
                        {behaviour.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {comp.status === "coming-soon" && !isActive && (
                <div className="px-4 pb-2 pl-12">
                  <Badge className="bg-white/10 text-white/60 text-[10px] border-0">
                    <LockIcon className="h-3 w-3 mr-1" />
                    COMING SOON
                  </Badge>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex justify-between items-center text-sm">
          <Text size="xs" className="text-white/60 uppercase tracking-wider">
            Overall Progress
          </Text>
          <Text size="xs" className="text-white/80">
            0 / 35
          </Text>
        </div>
      </div>
    </aside>
  )
}
