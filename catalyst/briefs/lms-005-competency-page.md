# LMS-005: Competency Overview Page

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 day  
**Dependencies:** LMS-001 (Data Layer), LMS-003 (Shell)  

---

## Objective

Build the competency overview page at `/learn/[competency]` matching mockup 6. Shows competency context, list of behaviours (modules), and toolkit resources.

---

## Reference Mockup

**Mockup 6:** Competency overview with sidebar, context section, behaviours list, and toolkit.

Key elements:
- Sidebar navigation (from LMS-003)
- Competency header with number and title
- "The Context" intro section
- Our Positioning / Our Founders / Our Promise subsections
- "Key Behaviours (0/5 completed)" section
- Behaviour list items with status badges
- "Toolkit" resources section

---

## Design Specifications

### Layout

```
┌────────────────┬──────────────────────────────────────────────┐
│   Sidebar      │  ← BACK TO COMPETENCY OVERVIEW               │
│                │                                              │
│                │  COMPETENCY 1                                │
│                │  Prime Capital Identity                      │
│                │  "Who are we and what makes us different?"   │
│                │                                              │
│                │  📖 The Context                              │
│                │  ─────────────────────────────────────────── │
│                │  This is where every consultant's journey    │
│                │  begins. Before you can represent Prime...   │
│                │                                              │
│                │  Our Positioning: Quiet luxury...            │
│                │  Our Founders: 60+ combined years...         │
│                │  Our Promise: From initial enquiry...        │
│                │                                              │
│                │  ┌─────────────────┐ ┌─────────────────┐     │
│                │  │ ⚠️ THE RISK     │ │ ✓ THE REWARD    │     │
│                │  │ You sound like  │ │ You articulate  │     │
│                │  │ every other...  │ │ our unique...   │     │
│                │  └─────────────────┘ └─────────────────┘     │
│                │                                              │
│                │  📝 Key Behaviours (0/5 completed)           │
│                │  ─────────────────────────────────────────── │
│                │  ┌────────────────────────────────────────┐  │
│                │  │ 1  Articulates the Prime Capital story │  │
│                │  │    Explains our founding, our journey  │→ │
│                │  │    [CURRENT]                           │  │
│                │  └────────────────────────────────────────┘  │
│                │  ┌────────────────────────────────────────┐  │
│                │  │ 2  Embodies boutique positioning       │  │
│                │  │    Demonstrates 'quiet luxury'...      │→ │
│                │  │    [CURRENT]                           │  │
│                │  └────────────────────────────────────────┘  │
│                │  ...                                         │
│                │                                              │
│                │  🧰 Toolkit                                  │
│                │  ─────────────────────────────────────────── │
│                │  📄 Prime Capital Brand Guidelines       →   │
│                │  📄 Founder Bios & Expertise Areas       →   │
│                │  📄 Client Testimonials Library          →   │
│                │                                              │
└────────────────┴──────────────────────────────────────────────┘
```

---

## Deliverables

### 1. Update `app/learn/[competency]/page.tsx`

```tsx
/**
 * CATALYST - Competency Overview Page
 *
 * Shows competency details with list of behaviours (modules).
 * Route: /learn/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpenIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  FileTextIcon,
  CheckCircleIcon,
  CircleIcon,
  LockIcon,
} from "lucide-react"
import { getCompetencyWithModules } from "@/lib/learning"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ competency: string }>
}

export default async function CompetencyOverviewPage({ params }: PageProps) {
  const { competency: competencySlug } = await params
  
  // Fetch competency with modules
  const competency = await getCompetencyWithModules(competencySlug)
  
  if (!competency) {
    notFound()
  }
  
  // Get user progress (optional - gracefully handle if not authenticated)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // TODO: Get actual progress from getCompetenciesWithProgress
  const completedCount = 0
  const totalCount = competency.moduleCount
  
  return (
    <Stack gap="xl">
      {/* Back link */}
      <Link 
        href="/learn/course"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Competency Overview
      </Link>
      
      {/* Header */}
      <Stack gap="sm">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          Competency {competency.displayOrder}
        </Text>
        <Title size="h1" className="text-3xl sm:text-4xl">
          {competency.name}
        </Title>
        <Text className="text-muted-foreground italic">
          "{competency.description}"
        </Text>
      </Stack>
      
      {/* The Context */}
      <Stack gap="md">
        <Row gap="sm" align="center">
          <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
          <Title size="h3">The Context</Title>
        </Row>
        
        <Stack gap="md" className="text-foreground/90 leading-relaxed">
          <Text>
            This is where every consultant's journey begins. Before you can represent 
            Prime Capital to clients, you need to deeply understand who we are, what we 
            stand for, and how we're different from every other real estate company in Dubai.
          </Text>
          
          <Text>
            Prime Capital Dubai is not just another real estate company. We are a boutique 
            advisory serving discerning international investors who expect more than 
            transactions — they expect trusted guidance.
          </Text>
          
          <Stack gap="sm">
            <Text>
              <strong>Our Positioning:</strong> Quiet luxury. We don't chase volume. We don't 
              use pressure tactics. We build relationships with sophisticated clients who value 
              expertise, discretion, and transparency.
            </Text>
            <Text>
              <strong>Our Founders:</strong> 60+ combined years of experience across Tahir 
              (client relationships, content), Shaad (developer relationships), and Rohit 
              (international markets, project development). This isn't a startup — it's 
              institutional knowledge in a boutique setting.
            </Text>
            <Text>
              <strong>Our Promise:</strong> From initial enquiry to handover and beyond, we 
              guide clients through every step. We earn trust through competence, not persuasion.
            </Text>
          </Stack>
        </Stack>
      </Stack>
      
      {/* Risk / Reward Callouts */}
      <Grid cols={2} gap="md" className="sm:grid-cols-2">
        <div className="learn-callout learn-callout--risk">
          <div className="learn-callout__label">⚠️ The Risk</div>
          <div className="learn-callout__text">
            You sound like every other agent in Dubai. Clients don't see the difference. 
            You compete on price and lose to bigger firms.
          </div>
        </div>
        <div className="learn-callout learn-callout--reward">
          <div className="learn-callout__label">✓ The Reward</div>
          <div className="learn-callout__text">
            You articulate our unique value proposition with confidence. Clients choose 
            us because they understand we're different — and you embody that difference.
          </div>
        </div>
      </Grid>
      
      {/* Key Behaviours */}
      <Stack gap="md">
        <Row gap="sm" align="center" justify="between">
          <Title size="h3">Key Behaviours ({completedCount}/{totalCount} completed)</Title>
        </Row>
        
        <Stack gap="sm">
          {competency.modules.map((module, index) => (
            <BehaviourCard
              key={module.id}
              number={index + 1}
              title={module.title}
              description={module.description || ""}
              status={index < 4 ? "current" : "locked"}
              href={`/learn/${competencySlug}/${module.slug}`}
            />
          ))}
        </Stack>
      </Stack>
      
      {/* Toolkit */}
      <Stack gap="md">
        <Row gap="sm" align="center">
          <FileTextIcon className="h-5 w-5 text-muted-foreground" />
          <Title size="h3">Toolkit</Title>
        </Row>
        
        <Stack gap="xs">
          <ResourceLink title="Prime Capital Brand Guidelines" />
          <ResourceLink title="Founder Bios & Expertise Areas" />
          <ResourceLink title="Client Testimonials Library" />
        </Stack>
      </Stack>
    </Stack>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

interface BehaviourCardProps {
  number: number
  title: string
  description: string
  status: "complete" | "current" | "locked"
  href: string
}

function BehaviourCard({ number, title, description, status, href }: BehaviourCardProps) {
  const isLocked = status === "locked"
  
  const StatusIcon = {
    complete: CheckCircleIcon,
    current: CircleIcon,
    locked: LockIcon,
  }[status]
  
  const Wrapper = isLocked ? "div" : Link
  const wrapperProps = isLocked ? {} : { href }
  
  return (
    <Card 
      className={`border transition-colors ${
        isLocked 
          ? "opacity-60 cursor-not-allowed" 
          : "hover:border-foreground/20 cursor-pointer"
      }`}
    >
      <Wrapper {...wrapperProps}>
        <CardContent className="p-4">
          <Row align="center" gap="md">
            {/* Number */}
            <div className="flex items-center justify-center w-8 h-8 rounded bg-muted text-sm font-semibold flex-shrink-0">
              {number}
            </div>
            
            {/* Content */}
            <Stack gap="xs" className="flex-1 min-w-0">
              <Row align="center" gap="sm" className="flex-wrap">
                <Text weight="medium" className="truncate">{title}</Text>
                <Badge 
                  variant={status === "locked" ? "outline" : "secondary"}
                  className="text-xs uppercase"
                >
                  {status === "complete" && "Complete"}
                  {status === "current" && "Current"}
                  {status === "locked" && "Locked"}
                </Badge>
              </Row>
              <Text size="sm" className="text-muted-foreground line-clamp-1">
                {description}
              </Text>
            </Stack>
            
            {/* Arrow */}
            {!isLocked && (
              <ChevronRightIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </Row>
        </CardContent>
      </Wrapper>
    </Card>
  )
}

function ResourceLink({ title }: { title: string }) {
  return (
    <Card className="border hover:border-foreground/20 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <Row align="center" justify="between">
          <Row gap="sm" align="center">
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            <Text size="sm">{title}</Text>
          </Row>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
        </Row>
      </CardContent>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params (for known competencies)
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  // Import config to get competency slugs
  const { config } = await import("@/lib/config")
  
  return config.learning.competencies.map((slug) => ({
    competency: slug,
  }))
}
```

### 2. Create Competency Layout with Sidebar

Create `app/learn/[competency]/layout.tsx`:

```tsx
/**
 * CATALYST - Competency Layout
 *
 * Adds sidebar to competency and module pages.
 */

import { LearnShell } from "../_surface"
import { createClient } from "@/lib/supabase/server"

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    return {
      name: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Learner",
      email: user.email || "",
      role: user.user_metadata?.role || "learner",
    }
  }
  
  return { name: "Learner", email: "", role: "learner" }
}

export default async function CompetencyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ competency: string }>
}) {
  const user = await getUser()
  const { competency } = await params
  
  return (
    <LearnShell 
      user={user} 
      showSidebar={true}
      currentCompetency={competency}
    >
      {children}
    </LearnShell>
  )
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/learn/[competency]/page.tsx` | UPDATE — Complete rewrite |
| `app/learn/[competency]/layout.tsx` | CREATE — Adds sidebar |

---

## Acceptance Criteria

- [ ] Page shows competency title, number, and description
- [ ] "The Context" section renders with styled prose
- [ ] Risk/Reward callouts display in two-column grid
- [ ] Behaviours list shows all modules with correct status
- [ ] Complete/Current/Locked badges display correctly
- [ ] Locked behaviours are non-clickable with reduced opacity
- [ ] Toolkit resources section displays
- [ ] Sidebar is visible and highlights current competency
- [ ] Back link navigates to course overview
- [ ] Page is responsive (callouts stack on mobile)

---

## Data Dependencies

This page requires:
- `getCompetencyWithModules(slug)` from LMS-001
- User progress (optional enhancement)

Currently uses placeholder data for:
- Context text (should come from `_index.md` content field)
- Risk/Reward (should come from competency's `_index.md` frontmatter)
- Module statuses (should come from user progress)

---

## Notes

- Context text is hardcoded for now — will be dynamic when content migration completes
- Toolkit resources are placeholder — will link to actual documents
- Module locking logic is simplified — should check previous module completion
