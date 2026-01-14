# LMS-014: Quiz System Fix & RERA Exam Integration

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2-3 days  
**Dependencies:** LMS-001, LMS-002  

---

## Problem Statement

Quizzes are not visible or accessible in the LMS. The current state:

1. **No quiz route exists** — `/learn/quiz/[quizId]` page was designed but never created
2. **No link to quizzes from modules** — Modules don't surface quiz CTAs
3. **Quiz questions not fully synced** — Only 51 questions in DB for 26 quizzes (should be ~200+)
4. **RERA practice exams invisible** — 6 practice exams exist but aren't linked anywhere
5. **No result persistence UI** — Can submit but can't view history

### Database State Analysis

| Status | Count | Notes |
|--------|-------|-------|
| Total quizzes | 26 | All synced from markdown |
| Questions synced | 51 | Only 6 quizzes have questions |
| Empty quizzes | 20 | Need question parsing fixed |
| RERA exams | 6 | 0 questions synced |

**Quizzes with questions:**
- foundations-2 (1 question)
- market-intelligence 1-4 (5 questions each = 20)
- sales-mastery 1-3 (10 questions each = 30)

**Quizzes without questions:**
- foundations-1, client-discovery 1-2, objection-navigation 1-3
- property-matching 1-2, transaction-management 1-3
- relationship-stewardship-1, all RERA quizzes

---

## Root Causes

### 1. Markdown Question Format Mismatch
The sync script expects:
```markdown
### Question 1
**Question text here**
- [ ] Option A
- [x] Correct option B  
- [ ] Option C
**Explanation:** Text here
```

But many files use:
```markdown
### Question 1
**Question text here**

A) Option A  
B) Option B  
C) Option C  
D) Option D  

**Correct Answer:** B  
**Explanation:** Text here
```

### 2. No Quiz Page Route
The brief [lms-007-quiz-system.md](lms-007-quiz-system.md) specifies creating `app/learn/quiz/[quizId]/page.tsx` but this was never implemented.

### 3. Module-Quiz Linkage Missing
- `KnowledgeCheckCTA` component exists but isn't rendered in module pages
- No mapping from modules to their related quizzes

---

## Solution Overview

### Phase 1: Fix Question Parsing (Day 1 AM)
Update sync script to handle both markdown question formats.

### Phase 2: Create Quiz Route (Day 1 PM)
Build the quiz page at `/learn/quiz/[quizId]` with:
- Question display
- Answer selection
- Progress tracking
- Results page

### Phase 3: Module Integration (Day 2 AM)
- Add quiz CTAs to module pages
- Surface quizzes in competency pages
- Link RERA exams to competency 8

### Phase 4: History & Analytics (Day 2 PM - Day 3)
- Quiz attempt history view
- Retake functionality
- Dashboard stats integration

---

## Deliverables

### 1. Fix Sync Script Question Parser

**File:** `lib/lms/sync.ts`

Update `parseQuizQuestions()` to handle both formats:

```typescript
function parseQuizQuestions(content: string): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  
  // Split by ### Question N (case insensitive)
  const questionBlocks = content.split(/###\s+Question\s+\d+/i).slice(1)

  for (const block of questionBlocks) {
    // Extract question text (first bold text or first paragraph after heading)
    let question = ""
    const boldMatch = block.match(/\*\*([^*]+)\*\*/)
    if (boldMatch && !boldMatch[1].match(/^(Correct Answer|Explanation)/i)) {
      question = boldMatch[1]
    }
    
    const options: Array<{ text: string; correct: boolean }> = []
    let correctAnswer: string | null = null
    let explanation = ""
    
    // Format 1: Checkbox style (- [ ] or - [x])
    const checkboxMatches = block.matchAll(/^-\s+\[([ x])\]\s+(.+)/gm)
    for (const match of checkboxMatches) {
      options.push({
        text: match[2].replace(/^[A-D]\)\s*/, "").trim(),
        correct: match[1] === "x",
      })
    }
    
    // Format 2: Letter style (A) Option text)
    if (options.length === 0) {
      const letterMatches = block.matchAll(/^([A-D])\)\s*(.+)/gm)
      for (const match of letterMatches) {
        options.push({
          text: match[2].trim(),
          correct: false, // Will set correct after finding correct answer
        })
      }
      
      // Find correct answer indicator
      const correctMatch = block.match(/\*\*Correct Answer:\*\*\s*([A-D])/i)
      if (correctMatch) {
        correctAnswer = correctMatch[1].toUpperCase()
        const correctIndex = correctAnswer.charCodeAt(0) - 65 // A=0, B=1, etc.
        if (options[correctIndex]) {
          options[correctIndex].correct = true
        }
      }
    }
    
    // Extract explanation
    const explanationMatch = block.match(
      /\*\*Explanation:?\*\*:?\s*([\s\S]+?)(?=---|\n\n###|\n\n##|$)/i
    )
    if (explanationMatch) {
      explanation = explanationMatch[1].trim()
    }
    
    if (question && options.length > 0) {
      questions.push({ question, options, explanation })
    }
  }

  return questions
}
```

### 2. Create Quiz Page

**File:** `app/learn/quiz/[quizId]/page.tsx`

```tsx
/**
 * CATALYST - Quiz Page
 * 
 * Route: /learn/quiz/[quizId]
 * Shows quiz questions and handles submission.
 */

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizClient } from "./quiz-client"

interface PageProps {
  params: Promise<{ quizId: string }>
}

async function getQuizData(quizSlug: string) {
  const supabase = await createClient()
  
  // Get quiz metadata
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("slug", quizSlug)
    .single()
  
  if (quizError || !quiz) return null
  
  // Get questions
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

export default async function QuizPage({ params }: PageProps) {
  const { quizId } = await params
  const data = await getQuizData(quizId)
  
  if (!data || data.questions.length === 0) {
    notFound()
  }
  
  return (
    <QuizClient 
      quiz={data.quiz}
      questions={data.questions}
    />
  )
}
```

**File:** `app/learn/quiz/[quizId]/quiz-client.tsx`

```tsx
/**
 * CATALYST - Quiz Client Component
 * 
 * Handles quiz state, answer selection, and submission.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { submitQuizAttempt } from "@/lib/actions/learning"

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
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [state, setState] = useState<QuizState>("in-progress")
  const [score, setScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const passed = (score / totalQuestions) * 100 >= quiz.passing_score
  
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
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    // Move to next or complete
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      // Quiz complete - submit to server
      setIsSubmitting(true)
      try {
        await submitQuizAttempt(quiz.slug, Object.entries(newAnswers).map(([qId, opt]) => ({
          questionId: qId,
          selectedOption: opt,
        })))
      } catch (error) {
        console.error("Failed to save quiz attempt:", error)
      }
      setIsSubmitting(false)
      setState("complete")
    }
  }
  
  // Results screen
  if (state === "complete") {
    const finalScore = score + (currentQuestion.options[selectedOption!]?.correct ? 1 : 0)
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
          <Stack gap="xl" className="max-w-lg mx-auto text-center py-12">
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
              <Title level={2}>
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
                nativeButton={false}
                render={<Link href={`/learn/${quiz.competency_slug}`} />}
              >
                Continue Learning
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              
              {!isPassed && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setCurrentIndex(0)
                    setSelectedOption(null)
                    setAnswers({})
                    setScore(0)
                    setState("in-progress")
                  }}
                >
                  Try Again
                </Button>
              )}
              
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
        </main>
      </div>
    )
  }
  
  // Question screen
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
                  {currentQuestion.question_text || currentQuestion.question}
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
                  {currentIndex < totalQuestions - 1 ? "Next Question" : "Complete Quiz"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </main>
    </div>
  )
}
```

### 3. Add Quiz Link to Module Page

**File:** `app/learn/[competency]/[module]/page.tsx`

Add after module content, before navigation:

```tsx
// Get related quiz for this module
const relatedQuiz = await getRelatedQuizForModule(competencySlug, moduleSlug)

// In the JSX, before </div> closing learn-content:
{relatedQuiz && (
  <div className="mt-8">
    <KnowledgeCheckCTA quizId={relatedQuiz.slug} />
  </div>
)}
```

**File:** `lib/learning.ts`

Add function:

```typescript
export async function getRelatedQuizForModule(
  competencySlug: string,
  moduleSlug: string
): Promise<{ slug: string; title: string } | null> {
  const supabase = await createClient()
  
  // Try to find quiz that references this module
  const { data } = await supabase
    .from("quizzes")
    .select("slug, title")
    .eq("competency_slug", competencySlug)
    .or(`related_module.ilike.%${moduleSlug}%`)
    .limit(1)
    .single()
  
  return data
}
```

### 4. Add Quiz Section to Competency Page

In `app/learn/[competency]/page.tsx`, after module list:

```tsx
// Fetch quizzes for this competency
const { data: quizzes } = await supabase
  .from("quizzes")
  .select("slug, title, question_count, passing_score")
  .eq("competency_slug", slug)
  .order("slug")

// In JSX, after modules section:
{quizzes && quizzes.length > 0 && (
  <section className="lms-card mt-8">
    <Stack gap="md" className="p-6">
      <Row align="center" gap="sm">
        <ClipboardCheckIcon className="h-5 w-5 text-primary" />
        <Text weight="semibold" size="lg">Knowledge Checks</Text>
      </Row>
      <Stack gap="sm">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.slug}
            href={`/learn/quiz/${quiz.slug}`}
            className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <Stack gap="xs">
              <Text weight="medium">{quiz.title}</Text>
              <Text size="sm" className="text-muted-foreground">
                {quiz.question_count} questions • {quiz.passing_score}% to pass
              </Text>
            </Stack>
            <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </Stack>
    </Stack>
  </section>
)}
```

### 5. Update Quiz Submission Action

**File:** `lib/actions/learning.ts`

Update to support quiz slug-based submission:

```typescript
export async function submitQuizAttempt(
  quizSlug: string,
  answers: QuizAnswer[]
): Promise<QuizResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get quiz with questions
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("passing_score")
    .eq("slug", quizSlug)
    .single()

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, options")
    .eq("quiz_slug", quizSlug)

  if (!questions || !quiz) throw new Error("Quiz not found")

  // Calculate score
  let score = 0
  const correctAnswers: string[] = []
  const explanations: Record<string, string> = {}

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId)
    if (!question) continue

    const options = question.options as Array<{ text: string; correct: boolean }>
    if (options[answer.selectedOption]?.correct) {
      score++
      correctAnswers.push(answer.questionId)
    }
  }

  const maxScore = questions.length
  const passed = (score / maxScore) * 100 >= quiz.passing_score

  // Save attempt
  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_slug: quizSlug,
    score,
    max_score: maxScore,
    passed,
    answers: Object.fromEntries(
      answers.map((a) => [a.questionId, a.selectedOption])
    ),
  })

  revalidatePath("/learn")

  return { score, maxScore, passed, correctAnswers, explanations }
}
```

---

## Database Changes

### Add quiz_slug to quiz_attempts

```sql
-- Add quiz_slug column to quiz_attempts
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS quiz_slug TEXT;

-- Create index for quiz lookup
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_slug 
ON quiz_attempts(quiz_slug);
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `lib/lms/sync.ts` | UPDATE — Fix question parser |
| `app/learn/quiz/[quizId]/page.tsx` | CREATE |
| `app/learn/quiz/[quizId]/quiz-client.tsx` | CREATE |
| `app/learn/quiz/[quizId]/not-found.tsx` | CREATE |
| `app/learn/[competency]/[module]/page.tsx` | UPDATE — Add quiz CTA |
| `app/learn/[competency]/page.tsx` | UPDATE — Add quiz section |
| `lib/learning.ts` | UPDATE — Add quiz helpers |
| `lib/actions/learning.ts` | UPDATE — Fix submission |

---

## Acceptance Criteria

### Phase 1: Sync Fix
- [ ] Running `pnpm sync:lms` syncs all quiz questions
- [ ] All 26 quizzes have their questions populated
- [ ] RERA practice exams have 40 questions each

### Phase 2: Quiz Page
- [ ] Quiz page loads at `/learn/quiz/[quizId]`
- [ ] Progress bar shows current question
- [ ] Radio buttons work for answer selection
- [ ] Submit advances to next question
- [ ] Final submit shows results screen
- [ ] Pass/fail determined by passing_score
- [ ] "Try Again" resets quiz state
- [ ] Quiz attempt saved to database

### Phase 3: Integration
- [ ] Module pages show "Take Quiz" CTA when quiz exists
- [ ] Competency pages show quiz list
- [ ] RERA competency shows all 6 practice exams
- [ ] Links work correctly

### Phase 4: History
- [ ] User can see past quiz attempts
- [ ] Dashboard shows quiz stats
- [ ] Can retake quizzes multiple times

---

## Testing Checklist

1. **Sync**
   - Run `pnpm sync:lms`
   - Check `quiz_questions` count in Supabase (expect ~200+)
   - Verify RERA questions synced

2. **Quiz Flow**
   - Navigate to `/learn/quiz/foundations-1`
   - Complete quiz, verify results show
   - Check `quiz_attempts` table for record

3. **Integration**
   - Visit module page, see quiz CTA
   - Click CTA, lands on quiz page
   - Complete quiz, navigate back

4. **Edge Cases**
   - Visit quiz with no questions → 404
   - Submit without selection → disabled
   - Network error on submit → graceful handling

---

## Notes

- Quiz questions stored in `quiz_questions` table, not inline in `quizzes`
- Some quizzes may have fewer questions than `question_count` — handle gracefully
- RERA exams are longer (40 questions) — may need pagination for better UX
- Consider adding timer for RERA exams in future iteration

---

## Related Briefs

- [LMS-007: Quiz System](lms-007-quiz-system.md) — Original specification (partially implemented)
- [LMS-009: Progress Tracking](lms-009-progress-tracking.md) — Integration with progress stats
- [LMS Content Audit: Quizzes](lms-content-audit-quizzes.md) — Content quality audit
