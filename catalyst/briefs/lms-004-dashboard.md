# LMS-004: Dashboard Page Overhaul

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1-2 days  
**Dependencies:** LMS-001 (Data Layer), LMS-003 (Shell)  

---

## Objective

Rebuild the `/learn` dashboard to match mockup 7. Data-driven page showing user's progress, courses, and next steps.

---

## Reference Mockup

**Mockup 7:** Dashboard with welcome message, progress stats, and course card.

Key elements:
- Welcome message with user's name
- "New to the platform?" onboarding prompt
- Progress stats (3 cards: %, competencies, behaviours)
- "Your Courses" section with course card
- Course card: image, badge, title, description, progress bar, CTA

---

## Design Specifications

### Layout

```
┌────────────────────────────────────────────────────────────┐
│                     (No sidebar on dashboard)              │
│                                                            │
│  Welcome back, Sarah                                       │
│  Continue your journey to becoming a Prime Capital expert. │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 💬 New to the platform?               [Start Tour] │    │
│  │    Take a quick 2-minute tour...                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  Your Progress                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │     0%       │ │     0/7      │ │    0/35      │       │
│  │   Overall    │ │ Competencies │ │  Behaviours  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                            │
│  Your Courses                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [Dubai skyline image]                             │    │
│  │                                                    │    │
│  │  REQUIRED TRAINING                                 │    │
│  │  Real Estate Consultant Certification              │    │
│  │  Master the 7 core competencies and 35 key...     │    │
│  │  ⊕ 7 Competencies  📖 35 Behaviours               │    │
│  │  ════════════════════════════════ Not started     │    │
│  │  [Start Course →]                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Single column, stacked stats |
| Tablet (640-1024px) | Stats in row, full-width course card |
| Desktop (>1024px) | Centered content, max-width 800px |

---

## Deliverables

### 1. Update `app/learn/page.tsx`

```tsx
/**
 * CATALYST - Learn Dashboard Page
 *
 * Learning portal dashboard showing progress and courses.
 * Route: /learn
 */

import Link from "next/link"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  PlayCircleIcon, 
  TargetIcon, 
  BookOpenIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getUserLearningStats } from "@/lib/learning"

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    return {
      id: user.id,
      name: user.user_metadata?.display_name 
        ?? user.user_metadata?.full_name 
        ?? user.email?.split("@")[0] 
        ?? "there",
    }
  }
  
  return { id: null, name: "there" }
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function LearnDashboardPage() {
  const user = await getUser()
  const stats = user.id 
    ? await getUserLearningStats(user.id) 
    : {
        overallProgressPercent: 0,
        completedCompetencies: 0,
        totalCompetencies: 7,
        completedModules: 0,
        totalModules: 35,
      }
  
  const hasStarted = stats.completedModules > 0 || stats.overallProgressPercent > 0
  
  return (
    <div className="py-8 sm:py-12 px-4">
      <Stack gap="xl" className="max-w-3xl mx-auto">
        {/* Welcome Section */}
        <Stack gap="sm">
          <Title size="h1" className="text-3xl sm:text-4xl">
            Welcome back, {user.name}
          </Title>
          <Text className="text-muted-foreground">
            Continue your journey to becoming a Prime Capital expert.
          </Text>
        </Stack>
        
        {/* Onboarding Prompt (show if not started) */}
        {!hasStarted && (
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <Row align="center" justify="between" className="flex-wrap gap-4">
                <Row gap="md" align="center">
                  <div className="p-2 rounded-full bg-muted">
                    <MessageSquareIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Stack gap="none">
                    <Text weight="medium">New to the platform?</Text>
                    <Text size="sm" className="text-muted-foreground">
                      Take a quick 2-minute tour to understand how your training works.
                    </Text>
                  </Stack>
                </Row>
                <Button variant="default" size="sm" className="gap-2">
                  <PlayCircleIcon className="h-4 w-4" />
                  Start Tour
                </Button>
              </Row>
            </CardContent>
          </Card>
        )}
        
        {/* Progress Stats */}
        <Stack gap="md">
          <Title size="h3">Your Progress</Title>
          <Grid cols={3} gap="md">
            <ProgressStatCard
              value={`${stats.overallProgressPercent}%`}
              label="Overall Complete"
            />
            <ProgressStatCard
              value={`${stats.completedCompetencies}/${stats.totalCompetencies}`}
              label="Competencies"
            />
            <ProgressStatCard
              value={`${stats.completedModules}/${stats.totalModules}`}
              label="Behaviours"
            />
          </Grid>
        </Stack>
        
        {/* Courses Section */}
        <Stack gap="md">
          <Title size="h3">Your Courses</Title>
          <CourseCard
            title="Real Estate Consultant Certification"
            description="Master the 7 core competencies and 35 key behaviours that define a Prime Capital consultant."
            imageUrl="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
            competencies={stats.totalCompetencies}
            behaviours={stats.totalModules}
            progress={stats.overallProgressPercent}
            href="/learn/course"
            isRequired
          />
        </Stack>
      </Stack>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function ProgressStatCard({ 
  value, 
  label 
}: { 
  value: string
  label: string 
}) {
  return (
    <Card className="bg-white border">
      <CardContent className="p-4 sm:p-6 text-center">
        <Text className="text-2xl sm:text-3xl font-light text-foreground">
          {value}
        </Text>
        <Text size="sm" className="text-muted-foreground mt-1">
          {label}
        </Text>
      </CardContent>
    </Card>
  )
}

interface CourseCardProps {
  title: string
  description: string
  imageUrl: string
  competencies: number
  behaviours: number
  progress: number
  href: string
  isRequired?: boolean
}

function CourseCard({
  title,
  description,
  imageUrl,
  competencies,
  behaviours,
  progress,
  href,
  isRequired,
}: CourseCardProps) {
  const hasStarted = progress > 0
  
  return (
    <Card className="bg-white border overflow-hidden">
      {/* Image */}
      <div 
        className="h-48 sm:h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      <CardContent className="p-4 sm:p-6">
        <Stack gap="md">
          {/* Badge */}
          {isRequired && (
            <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider">
              Required Training
            </Badge>
          )}
          
          {/* Title & Description */}
          <Stack gap="xs">
            <Title size="h4">{title}</Title>
            <Text size="sm" className="text-muted-foreground">
              {description}
            </Text>
          </Stack>
          
          {/* Meta */}
          <Row gap="md" className="text-sm text-muted-foreground">
            <Row gap="xs" align="center">
              <TargetIcon className="h-4 w-4" />
              <span>{competencies} Competencies</span>
            </Row>
            <Row gap="xs" align="center">
              <BookOpenIcon className="h-4 w-4" />
              <span>{behaviours} Behaviours</span>
            </Row>
          </Row>
          
          {/* Progress */}
          <Stack gap="xs">
            <Progress value={progress} className="h-1" />
            <Text size="xs" className="text-muted-foreground text-right">
              {hasStarted ? `${progress}% complete` : "Not started"}
            </Text>
          </Stack>
          
          {/* CTA */}
          <Button asChild className="gap-2">
            <Link href={href}>
              {hasStarted ? "Continue Course" : "Start Course"}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
```

### 2. Update `app/learn/layout.tsx`

Ensure dashboard uses shell without sidebar:

```tsx
/**
 * CATALYST - Learn Route Group Layout
 */

import "./learn.css"
import { LearnShell } from "./_surface"
import { createClient } from "@/lib/supabase/server"

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    return {
      name: user.user_metadata?.display_name 
        ?? user.user_metadata?.full_name 
        ?? user.email?.split("@")[0] 
        ?? "Learner",
      email: user.email || "",
      role: user.user_metadata?.role || "learner",
      avatarUrl: user.user_metadata?.avatar_url,
    }
  }
  
  return {
    name: "Learner",
    email: "",
    role: "learner",
  }
}

export const metadata = {
  title: "Learning Portal | Prime Capital Dubai",
  description: "Prime Capital Dubai agent training and certification platform",
}

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  // Note: showSidebar is controlled by individual pages/layouts
  // Dashboard (this page) has no sidebar
  return (
    <LearnShell user={user} showSidebar={false}>
      {children}
    </LearnShell>
  )
}
```

---

## Files to Modify

| File | Action |
|------|--------|
| `app/learn/page.tsx` | UPDATE — Complete rewrite |
| `app/learn/layout.tsx` | UPDATE — Pass showSidebar prop |

---

## Acceptance Criteria

- [ ] Dashboard shows personalized welcome with user's name
- [ ] Progress stats show real data from `getUserLearningStats()`
- [ ] Onboarding prompt shows only for users who haven't started
- [ ] Course card displays with image, badge, meta, progress bar
- [ ] "Start Course" / "Continue Course" CTA changes based on progress
- [ ] Progress bar reflects actual completion percentage
- [ ] Layout is responsive (stacks on mobile)
- [ ] No sidebar visible on dashboard
- [ ] Clicking course card navigates to `/learn/course`

---

## Test Cases

1. **New user (no progress):** Shows 0%, 0/7, 0/35; "Not started"; onboarding prompt visible
2. **User with progress:** Shows actual %, hides onboarding prompt, "Continue Course" CTA
3. **Mobile view:** Stats stack vertically, course card full width
4. **Unauthenticated:** Falls back to "there" name and zero stats

---

## Notes

- The "Start Tour" button is a placeholder — can be wired to a tour library later
- Course card is designed for single course now; structure supports multiple courses later
- Progress calculation happens server-side via `getUserLearningStats()`
