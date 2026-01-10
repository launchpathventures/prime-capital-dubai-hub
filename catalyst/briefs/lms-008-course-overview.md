# LMS-008: Course Overview Page

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 0.5-1 day  
**Dependencies:** LMS-001, LMS-003  

---

## Objective

Build the Course Overview page at `/learn/course` matching mockup 3. This is the "About" page for the entire learning program, explaining what the course covers and how it works.

---

## Reference Mockup

**Mockup 3 — Course Overview**

Key elements:
- Hero section with title and description
- "How It Works" section with numbered steps
- Learning Pathway showing all 9 competencies
- CTA to start learning

---

## Design Specifications

### Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│  PRIME CAPITAL LEARNING ACADEMY                                │
│                                                                │
│  Master Dubai Real Estate Excellence                           │
│                                                                │
│  A comprehensive training program designed to transform        │
│  you into a knowledgeable, confident, and effective           │
│  Prime Capital team member.                                    │
│                                                                │
│  [Start Learning →]                                            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  HOW IT WORKS                                                  │
│                                                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │    1    │  │    2    │  │    3    │  │    4    │          │
│  │ Study   │  │ Practice│  │ Test    │  │ Apply   │          │
│  │ the     │  │ with AI │  │ Your    │  │ in Real │          │
│  │ Content │  │ Clients │  │ Know-   │  │ Conver- │          │
│  │         │  │         │  │ ledge   │  │ sations │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  YOUR LEARNING PATHWAY                                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  0  │  FOUNDATIONS                              0/5 ◯    │ │
│  │     │  Prime Capital story, values, approach             │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  1  │  IDENTITY                                 0/4 ◯    │ │
│  │     │  How we present ourselves to clients              │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  2  │  CLIENT JOURNEY                           0/6 ◯    │ │
│  │     │  End-to-end client experience                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ... (all 9 competencies)                                     │
│                                                                │
│  [Begin Your Journey →]                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Deliverables

### 1. Create Course Overview Components

#### `components/lms/course-hero.tsx`

```tsx
/**
 * CATALYST - Course Hero
 */

import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

interface CourseHeroProps {
  firstCompetencySlug: string
}

export function CourseHero({ firstCompetencySlug }: CourseHeroProps) {
  return (
    <Stack gap="lg" className="text-center py-12 px-4">
      <Text size="xs" className="uppercase tracking-widest text-primary">
        Prime Capital Learning Academy
      </Text>
      
      <Title size="h1" className="text-4xl sm:text-5xl font-bold max-w-3xl mx-auto">
        Master Dubai Real Estate Excellence
      </Title>
      
      <Text size="lg" className="text-muted-foreground max-w-2xl mx-auto">
        A comprehensive training program designed to transform you into a 
        knowledgeable, confident, and effective Prime Capital team member.
      </Text>
      
      <Button asChild size="lg" className="mx-auto gap-2">
        <Link href={`/learn/${firstCompetencySlug}`}>
          Start Learning
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </Stack>
  )
}
```

#### `components/lms/how-it-works.tsx`

```tsx
/**
 * CATALYST - How It Works
 */

import { Stack, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpenIcon, 
  MessageSquareIcon, 
  ClipboardCheckIcon, 
  UsersIcon 
} from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Study the Content",
    description: "Learn key concepts, scripts, and processes through structured modules.",
    icon: BookOpenIcon,
  },
  {
    number: 2,
    title: "Practice with AI Clients",
    description: "Rehearse real conversations with AI-powered client simulations.",
    icon: MessageSquareIcon,
  },
  {
    number: 3,
    title: "Test Your Knowledge",
    description: "Validate understanding with knowledge checks after each module.",
    icon: ClipboardCheckIcon,
  },
  {
    number: 4,
    title: "Apply in Real Conversations",
    description: "Use your skills with actual clients and get feedback.",
    icon: UsersIcon,
  },
]

export function HowItWorks() {
  return (
    <Stack gap="lg" className="py-12 px-4 bg-muted/30">
      <Title size="h2" className="text-center">
        How It Works
      </Title>
      
      <Grid cols={4} gap="md" className="sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <Card key={step.number} className="border bg-background">
            <CardContent className="p-6 text-center">
              <Stack gap="md" align="center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-muted-foreground" />
                <Stack gap="xs">
                  <Text weight="semibold">{step.title}</Text>
                  <Text size="sm" className="text-muted-foreground">
                    {step.description}
                  </Text>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}
```

#### `components/lms/learning-pathway.tsx`

```tsx
/**
 * CATALYST - Learning Pathway
 */

import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckCircle2Icon, CircleIcon } from "lucide-react"
import type { CompetencyWithProgress } from "@/lib/learning-types"

interface LearningPathwayProps {
  competencies: CompetencyWithProgress[]
}

export function LearningPathway({ competencies }: LearningPathwayProps) {
  const firstIncomplete = competencies.find((c) => c.completed < c.total)
  
  return (
    <Stack gap="lg" className="py-12 px-4">
      <Title size="h2" className="text-center">
        Your Learning Pathway
      </Title>
      
      <Stack gap="sm" className="max-w-3xl mx-auto">
        {competencies.map((competency) => {
          const isComplete = competency.completed >= competency.total
          
          return (
            <Link key={competency.slug} href={`/learn/${competency.slug}`}>
              <Card className="border hover:border-foreground/20 transition-colors">
                <CardContent className="p-4">
                  <Row align="center" gap="md">
                    {/* Order Number */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground font-mono text-sm font-bold flex-shrink-0">
                      {competency.order}
                    </div>
                    
                    {/* Content */}
                    <Stack gap="none" className="flex-1 min-w-0">
                      <Row align="center" gap="sm">
                        <Text weight="semibold" className="uppercase tracking-wider">
                          {competency.title}
                        </Text>
                      </Row>
                      <Text size="sm" className="text-muted-foreground truncate">
                        {competency.description}
                      </Text>
                    </Stack>
                    
                    {/* Progress */}
                    <Row align="center" gap="sm" className="flex-shrink-0">
                      <Text size="sm" className="text-muted-foreground">
                        {competency.completed}/{competency.total}
                      </Text>
                      {isComplete ? (
                        <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                      ) : (
                        <CircleIcon className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </Row>
                  </Row>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </Stack>
      
      {/* CTA */}
      <Button asChild size="lg" className="mx-auto gap-2">
        <Link href={firstIncomplete ? `/learn/${firstIncomplete.slug}` : "/learn"}>
          Begin Your Journey
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </Stack>
  )
}
```

### 2. Update Course Overview Page

Update `app/learn/course/page.tsx`:

```tsx
/**
 * CATALYST - Course Overview Page
 *
 * About page for the learning program explaining structure and pathway.
 * Route: /learn/course
 */

import { Stack } from "@/components/core"
import { CourseHero, HowItWorks, LearningPathway } from "@/components/lms"
import { getAllCompetenciesWithProgress } from "@/lib/learning"

export const metadata = {
  title: "Course Overview | Prime Capital Learning",
  description: "Master Dubai real estate excellence with our comprehensive training program.",
}

export default async function CourseOverviewPage() {
  const competencies = await getAllCompetenciesWithProgress()
  
  const firstCompetencySlug = competencies[0]?.slug ?? "foundations"
  
  return (
    <Stack gap="none" className="min-h-full">
      <CourseHero firstCompetencySlug={firstCompetencySlug} />
      <HowItWorks />
      <LearningPathway competencies={competencies} />
    </Stack>
  )
}
```

### 3. Add Data Function

Add to `lib/learning.ts`:

```typescript
/**
 * Get all competencies with user progress
 */
export async function getAllCompetenciesWithProgress(): Promise<CompetencyWithProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get all competencies with module counts
  const { data: competencies, error } = await supabase
    .from("competencies")
    .select(`
      id,
      slug,
      title,
      description,
      order,
      modules:learning_modules(id)
    `)
    .order("order")
  
  if (error || !competencies) return []
  
  // If no user, return with zero progress
  if (!user) {
    return competencies.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description ?? "",
      order: c.order,
      total: c.modules.length,
      completed: 0,
    }))
  }
  
  // Get user's completed modules
  const { data: progress } = await supabase
    .from("learning_progress")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("status", "completed")
  
  const completedModuleIds = new Set(progress?.map((p) => p.module_id) ?? [])
  
  // Calculate progress per competency
  return competencies.map((c) => {
    const completedCount = c.modules.filter((m) => completedModuleIds.has(m.id)).length
    
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description ?? "",
      order: c.order,
      total: c.modules.length,
      completed: completedCount,
    }
  })
}
```

### 4. Add Types

Add to `lib/learning-types.ts`:

```typescript
export interface CompetencyWithProgress {
  id: string
  slug: string
  title: string
  description: string
  order: number
  total: number
  completed: number
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/lms/course-hero.tsx` | CREATE |
| `components/lms/how-it-works.tsx` | CREATE |
| `components/lms/learning-pathway.tsx` | CREATE |
| `app/learn/course/page.tsx` | UPDATE — Complete rewrite |
| `lib/learning.ts` | UPDATE — Add getAllCompetenciesWithProgress |
| `lib/learning-types.ts` | UPDATE — Add CompetencyWithProgress type |
| `components/lms/index.ts` | UPDATE — Export new components |

---

## Acceptance Criteria

- [ ] Hero section displays with title, description, CTA
- [ ] "How It Works" shows 4 numbered steps with icons
- [ ] Learning Pathway lists all 9 competencies in order
- [ ] Each competency shows progress (X/Y completed)
- [ ] Completed competencies show checkmark icon
- [ ] Links navigate to correct competency pages
- [ ] "Begin Your Journey" links to first incomplete competency
- [ ] Page is responsive (stacks on mobile)

---

## Notes

- This page serves as the "sales pitch" for the learning program
- Can be linked from dashboard or marketing site
- Progress data requires authentication; anonymous users see 0/X for all
- Consider adding estimated time per competency in Phase 2
