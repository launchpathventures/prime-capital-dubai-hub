# LMS-007: Quiz System

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1-2 days  
**Dependencies:** LMS-001, LMS-002  

---

## Objective

Build the quiz experience at `/learn/quiz/[quizId]` matching mockups 4 and 5. This includes the question page with multiple choice answers and the results/completion page.

---

## Reference Mockups

| Mockup | Screen | Key Elements |
|--------|--------|--------------|
| **4** | Quiz Question | Progress indicator, question text, 4 answer options, Submit button |
| **5** | Quiz Complete | Success message, score breakdown, competency progress, Next Steps |

---

## Design Specifications

### Quiz Question Page (Mockup 4)

```
┌────────────────────────────────────────────────────────────────┐
│  [Back to Module]                                              │
│                                                                │
│  KNOWLEDGE CHECK: PRIME CAPITAL FOUNDATIONS                    │
│  Question 1 of 5                          ████████░░░░ 20%     │
│                                                                │
│  What is the combined years of experience among                │
│  Prime Capital's three founders?                               │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ○  40+ years                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ●  60+ years                                    ✓       │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ○  80+ years                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ○  100+ years                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    [Submit Answer]                        │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### Quiz Complete Page (Mockup 5)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│           ✓ KNOWLEDGE CHECK COMPLETE                           │
│                                                                │
│           Prime Capital Foundations                            │
│           You've demonstrated your understanding of the        │
│           Prime Capital story, values, and approach.           │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    YOUR SCORE                             │ │
│  │                                                           │ │
│  │                      4/5                                  │ │
│  │                      80%                                  │ │
│  │                    PASSED                                 │ │
│  │                                                           │ │
│  │  ████████████████████████████████████░░░░░░░░            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  COMPETENCY PROGRESS                                      │ │
│  │                                                           │ │
│  │  Identity            ████████████████░░░░  4/5 Complete   │ │
│  │  Client Journey      ████████░░░░░░░░░░░░  2/5 Complete   │ │
│  │  Product Knowledge   ░░░░░░░░░░░░░░░░░░░░  0/8 Complete   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  🎯 NEXT STEPS                                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Continue Learning                                    →  │ │
│  │  Next: Service Model (Competency 2)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Review This Module                                   →  │ │
│  │  Go back and review Prime Capital Foundations            │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Return to Dashboard                                  →  │ │
│  │  See your overall progress                               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Deliverables

### 1. Create Quiz Components

#### `components/lms/quiz-progress.tsx`

```tsx
/**
 * CATALYST - Quiz Progress Indicator
 */

import { Row, Text } from "@/components/core"
import { Progress } from "@/components/ui/progress"

interface QuizProgressProps {
  current: number
  total: number
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <Row align="center" gap="md" className="w-full">
      <Text size="sm" className="text-muted-foreground whitespace-nowrap">
        Question {current} of {total}
      </Text>
      <Progress value={percentage} className="flex-1" />
      <Text size="sm" className="text-muted-foreground whitespace-nowrap">
        {percentage}%
      </Text>
    </Row>
  )
}
```

#### `components/lms/quiz-question.tsx`

```tsx
/**
 * CATALYST - Quiz Question
 */

"use client"

import { useState } from "react"
import { Stack, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "@/lib/learning-types"

interface QuizQuestionProps {
  question: QuizQuestionType
  onSubmit: (answerId: string) => void
  isSubmitting?: boolean
}

export function QuizQuestion({ question, onSubmit, isSubmitting }: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const handleSubmit = () => {
    if (selectedId) {
      onSubmit(selectedId)
    }
  }
  
  return (
    <Stack gap="lg">
      {/* Question Text */}
      <Text size="lg" weight="medium">
        {question.questionText}
      </Text>
      
      {/* Answer Options */}
      <Stack gap="sm">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            className={cn(
              "w-full p-4 text-left border rounded-lg transition-all",
              "hover:border-foreground/30",
              selectedId === option.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border"
            )}
            disabled={isSubmitting}
          >
            <Row align="center" gap="sm">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedId === option.id
                    ? "border-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {selectedId === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <Text>{option.text}</Text>
            </Row>
          </button>
        ))}
      </Stack>
      
      {/* Submit Button */}
      <Button 
        size="lg" 
        className="w-full" 
        onClick={handleSubmit}
        disabled={!selectedId || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </Stack>
  )
}
```

#### `components/lms/quiz-result.tsx`

```tsx
/**
 * CATALYST - Quiz Result
 */

import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

interface QuizResultProps {
  score: number
  total: number
  passingScore: number
  quizTitle: string
  quizDescription?: string
}

export function QuizResult({ 
  score, 
  total, 
  passingScore, 
  quizTitle,
  quizDescription 
}: QuizResultProps) {
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= passingScore
  
  return (
    <Stack gap="lg" className="text-center">
      {/* Success/Fail Icon */}
      <div className="mx-auto">
        {passed ? (
          <CheckCircle2Icon className="h-16 w-16 text-green-500" />
        ) : (
          <XCircleIcon className="h-16 w-16 text-red-500" />
        )}
      </div>
      
      {/* Header */}
      <Stack gap="xs">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          Knowledge Check Complete
        </Text>
        <Title size="h2">{quizTitle}</Title>
        {quizDescription && (
          <Text className="text-muted-foreground">{quizDescription}</Text>
        )}
      </Stack>
      
      {/* Score Card */}
      <Card className="border">
        <CardContent className="p-6">
          <Stack gap="md">
            <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
              Your Score
            </Text>
            
            <Stack gap="xs">
              <Text className="text-5xl font-bold">
                {score}/{total}
              </Text>
              <Text size="lg" className="text-muted-foreground">
                {percentage}%
              </Text>
              <div className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-medium",
                passed 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {passed ? "PASSED" : "NOT PASSED"}
              </div>
            </Stack>
            
            <Progress 
              value={percentage} 
              className="h-3"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
```

#### `components/lms/quiz-next-steps.tsx`

```tsx
/**
 * CATALYST - Quiz Next Steps
 */

import Link from "next/link"
import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRightIcon, BookOpenIcon, LayoutDashboardIcon, RotateCcwIcon } from "lucide-react"

interface NextStep {
  title: string
  description: string
  href: string
  icon: "continue" | "review" | "dashboard"
}

interface QuizNextStepsProps {
  steps: NextStep[]
}

export function QuizNextSteps({ steps }: QuizNextStepsProps) {
  return (
    <Stack gap="md">
      <Text size="xs" className="uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        🎯 Next Steps
      </Text>
      
      <Stack gap="sm">
        {steps.map((step) => (
          <Link key={step.title} href={step.href}>
            <Card className="border hover:border-foreground/20 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <Row align="center" justify="between">
                  <Row gap="md" align="center">
                    <StepIcon type={step.icon} />
                    <Stack gap="none">
                      <Text weight="medium">{step.title}</Text>
                      <Text size="sm" className="text-muted-foreground">
                        {step.description}
                      </Text>
                    </Stack>
                  </Row>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </Row>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

function StepIcon({ type }: { type: string }) {
  switch (type) {
    case "continue":
      return <BookOpenIcon className="h-5 w-5 text-primary" />
    case "review":
      return <RotateCcwIcon className="h-5 w-5 text-muted-foreground" />
    case "dashboard":
      return <LayoutDashboardIcon className="h-5 w-5 text-muted-foreground" />
    default:
      return null
  }
}
```

#### `components/lms/competency-progress-list.tsx`

```tsx
/**
 * CATALYST - Competency Progress List
 */

import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CompetencyProgress } from "@/lib/learning-types"

interface CompetencyProgressListProps {
  competencies: CompetencyProgress[]
}

export function CompetencyProgressList({ competencies }: CompetencyProgressListProps) {
  return (
    <Card className="border">
      <CardContent className="p-4 sm:p-6">
        <Stack gap="md">
          <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
            Competency Progress
          </Text>
          
          <Stack gap="sm">
            {competencies.map((comp) => (
              <Stack key={comp.slug} gap="xs">
                <Row align="center" justify="between">
                  <Text size="sm" weight="medium">
                    {comp.title}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {comp.completed}/{comp.total} Complete
                  </Text>
                </Row>
                <Progress 
                  value={(comp.completed / comp.total) * 100} 
                  className="h-2" 
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
```

### 2. Create Quiz Page

Create `app/learn/quiz/[quizId]/page.tsx`:

```tsx
/**
 * CATALYST - Quiz Page
 *
 * Handles quiz question display and answer submission.
 * Route: /learn/quiz/[quizId]
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Stack, Text, Title } from "@/components/core"
import { ChevronLeftIcon } from "lucide-react"
import { 
  QuizProgress,
  QuizQuestion,
  QuizResult,
  QuizNextSteps,
  CompetencyProgressList,
} from "@/components/lms"
import { submitQuizAnswer, getQuizWithQuestions, getCompetencyProgress } from "@/lib/learning"
import type { Quiz, QuizQuestion as QuizQuestionType, CompetencyProgress } from "@/lib/learning-types"

interface PageProps {
  params: Promise<{ quizId: string }>
}

export default function QuizPage({ params }: PageProps) {
  const router = useRouter()
  const [quizId, setQuizId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [competencyProgress, setCompetencyProgress] = useState<CompetencyProgress[]>([])
  
  // Load quiz data
  useEffect(() => {
    async function load() {
      const { quizId } = await params
      setQuizId(quizId)
      const quizData = await getQuizWithQuestions(quizId)
      if (!quizData) {
        notFound()
      }
      setQuiz(quizData)
    }
    load()
  }, [params])
  
  if (!quiz) {
    return <div>Loading...</div>
  }
  
  const currentQuestion = quiz.questions[currentIndex]
  const totalQuestions = quiz.questions.length
  
  const handleAnswerSubmit = async (answerId: string) => {
    setIsSubmitting(true)
    
    // Record answer
    const newAnswers = { ...answers, [currentQuestion.id]: answerId }
    setAnswers(newAnswers)
    
    // Check if correct
    const isCorrect = currentQuestion.options.find(
      (o) => o.id === answerId
    )?.isCorrect
    
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    
    // Move to next question or complete
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Quiz complete - save attempt
      await submitQuizAnswer({
        quizId: quiz.id,
        answers: newAnswers,
        score: score + (isCorrect ? 1 : 0),
        total: totalQuestions,
      })
      
      // Fetch updated progress
      const progress = await getCompetencyProgress()
      setCompetencyProgress(progress)
      
      setIsComplete(true)
    }
    
    setIsSubmitting(false)
  }
  
  // Completed state
  if (isComplete) {
    const nextSteps = [
      {
        title: "Continue Learning",
        description: quiz.nextModule 
          ? `Next: ${quiz.nextModule.title}` 
          : "Continue your learning journey",
        href: quiz.nextModule 
          ? `/learn/${quiz.competencySlug}/${quiz.nextModule.slug}`
          : `/learn/${quiz.competencySlug}`,
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
      <Stack gap="xl" className="max-w-2xl mx-auto py-8">
        <QuizResult
          score={score}
          total={totalQuestions}
          passingScore={quiz.passingScore}
          quizTitle={quiz.title}
          quizDescription="You've demonstrated your understanding of the Prime Capital story, values, and approach."
        />
        
        {competencyProgress.length > 0 && (
          <CompetencyProgressList competencies={competencyProgress} />
        )}
        
        <QuizNextSteps steps={nextSteps} />
      </Stack>
    )
  }
  
  // Question state
  return (
    <Stack gap="lg" className="max-w-2xl mx-auto py-8">
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
          Knowledge Check: {quiz.competencyTitle}
        </Text>
        <QuizProgress current={currentIndex + 1} total={totalQuestions} />
      </Stack>
      
      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        onSubmit={handleAnswerSubmit}
        isSubmitting={isSubmitting}
      />
    </Stack>
  )
}
```

### 3. Add Data Fetching Functions

Add to `lib/learning.ts`:

```typescript
/**
 * Get quiz with all questions
 */
export async function getQuizWithQuestions(quizId: string): Promise<Quiz | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      *,
      questions:quiz_questions(
        id,
        question_text,
        options,
        correct_option_index,
        explanation,
        order
      ),
      module:learning_modules(
        slug,
        title,
        competency:competencies(
          slug,
          title
        )
      )
    `)
    .eq("id", quizId)
    .single()
  
  if (error || !data) return null
  
  // Transform to Quiz type
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    passingScore: data.passing_score ?? 70,
    moduleSlug: data.module?.slug ?? "",
    moduleTitle: data.module?.title ?? "",
    competencySlug: data.module?.competency?.slug ?? "",
    competencyTitle: data.module?.competency?.title ?? "",
    questions: data.questions
      .sort((a, b) => a.order - b.order)
      .map((q) => ({
        id: q.id,
        questionText: q.question_text,
        options: q.options.map((opt: string, i: number) => ({
          id: `${q.id}-${i}`,
          text: opt,
          isCorrect: i === q.correct_option_index,
        })),
        explanation: q.explanation,
      })),
    nextModule: null, // TODO: Fetch next module
  }
}

/**
 * Submit quiz attempt
 */
export async function submitQuizAnswer(data: {
  quizId: string
  answers: Record<string, string>
  score: number
  total: number
}): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: data.quizId,
    score: data.score,
    total_questions: data.total,
    answers: data.answers,
    passed: (data.score / data.total) * 100 >= 70,
  })
}

/**
 * Get competency progress for current user
 */
export async function getCompetencyProgress(): Promise<CompetencyProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  // Get all competencies with module counts
  const { data: competencies } = await supabase
    .from("competencies")
    .select(`
      slug,
      title,
      modules:learning_modules(count)
    `)
    .order("order")
  
  // Get user's completed modules
  const { data: progress } = await supabase
    .from("learning_progress")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("status", "completed")
  
  const completedModuleIds = new Set(progress?.map((p) => p.module_id) ?? [])
  
  // Build progress data
  return (competencies ?? []).map((c) => ({
    slug: c.slug,
    title: c.title,
    total: c.modules[0]?.count ?? 0,
    completed: 0, // TODO: Calculate based on modules in this competency
  }))
}
```

### 4. Update Types

Add to `lib/learning-types.ts`:

```typescript
export interface Quiz {
  id: string
  title: string
  description?: string
  passingScore: number
  moduleSlug: string
  moduleTitle: string
  competencySlug: string
  competencyTitle: string
  questions: QuizQuestion[]
  nextModule: { slug: string; title: string } | null
}

export interface QuizQuestion {
  id: string
  questionText: string
  options: QuizOption[]
  explanation?: string
}

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface CompetencyProgress {
  slug: string
  title: string
  total: number
  completed: number
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/lms/quiz-progress.tsx` | CREATE |
| `components/lms/quiz-question.tsx` | CREATE |
| `components/lms/quiz-result.tsx` | CREATE |
| `components/lms/quiz-next-steps.tsx` | CREATE |
| `components/lms/competency-progress-list.tsx` | CREATE |
| `app/learn/quiz/[quizId]/page.tsx` | CREATE |
| `lib/learning.ts` | UPDATE — Add quiz functions |
| `lib/learning-types.ts` | UPDATE — Add quiz types |
| `components/lms/index.ts` | UPDATE — Export new components |

---

## Database Requirements

Ensure these tables exist (from LMS-001):

- `quizzes` — Quiz metadata
- `quiz_questions` — Individual questions with options stored as JSON array
- `quiz_attempts` — User submissions

---

## Acceptance Criteria

- [ ] Quiz question page shows progress bar and current question number
- [ ] Radio buttons work for answer selection
- [ ] Submit button disabled until answer selected
- [ ] Answers are validated and scored correctly
- [ ] Quiz complete page shows score, pass/fail status
- [ ] Competency progress updates after completion
- [ ] Next steps show relevant navigation options
- [ ] Quiz attempt is saved to database
- [ ] Handle edge cases (no questions, already completed)

---

## Notes

- Quiz is client-side to avoid page reloads between questions
- Consider adding answer feedback (correct/incorrect) after each question in Phase 2
- Review functionality could show which answers were wrong
- Timer functionality can be added later if needed
