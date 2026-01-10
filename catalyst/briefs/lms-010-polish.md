# LMS-010: Polish & Production Readiness

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 1-2 days  
**Dependencies:** LMS-001 through LMS-009  

---

## Objective

Final polish pass to ensure the LMS is production-ready. This includes loading states, error handling, mobile optimization, accessibility, and performance.

---

## Scope

1. Loading skeletons for all pages
2. Error boundaries and fallbacks
3. Mobile responsive refinements
4. Accessibility audit and fixes
5. Performance optimizations
6. Empty states

---

## Deliverables

### 1. Loading Skeletons

#### `components/lms/skeletons/dashboard-skeleton.tsx`

```tsx
/**
 * CATALYST - Dashboard Loading Skeleton
 */

import { Stack, Grid } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <Stack gap="xl">
      {/* Header */}
      <Stack gap="xs">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </Stack>
      
      {/* Stats Grid */}
      <Grid cols={4} gap="md" className="sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Stack gap="sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
      
      {/* Competency List */}
      <Stack gap="sm">
        <Skeleton className="h-6 w-40" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Stack gap="xs" className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </Stack>
                <Skeleton className="h-2 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
```

#### `components/lms/skeletons/module-skeleton.tsx`

```tsx
/**
 * CATALYST - Module Page Loading Skeleton
 */

import { Stack, Grid } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ModuleSkeleton() {
  return (
    <Stack gap="xl">
      {/* Back link */}
      <Skeleton className="h-5 w-48" />
      
      {/* Header */}
      <Stack gap="sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </Stack>
      
      {/* Risk/Reward */}
      <Grid cols={2} gap="md">
        <Card>
          <CardContent className="p-4">
            <Stack gap="sm">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Stack gap="sm">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Process Steps */}
      <Stack gap="md">
        <Skeleton className="h-7 w-40" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <Stack gap="sm" className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </Stack>
              </div>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* CTA */}
      <Skeleton className="h-12 w-full max-w-sm mx-auto" />
    </Stack>
  )
}
```

#### `components/lms/skeletons/quiz-skeleton.tsx`

```tsx
/**
 * CATALYST - Quiz Loading Skeleton
 */

import { Stack } from "@/components/core"
import { Skeleton } from "@/components/ui/skeleton"

export function QuizSkeleton() {
  return (
    <Stack gap="lg" className="max-w-2xl mx-auto py-8">
      {/* Back link */}
      <Skeleton className="h-5 w-32" />
      
      {/* Header */}
      <Stack gap="sm">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      </Stack>
      
      {/* Question */}
      <Skeleton className="h-8 w-full max-w-lg" />
      
      {/* Options */}
      <Stack gap="sm">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </Stack>
      
      {/* Submit */}
      <Skeleton className="h-12 w-full" />
    </Stack>
  )
}
```

### 2. Loading.tsx Files

Create loading states for each route:

#### `app/learn/loading.tsx`

```tsx
import { DashboardSkeleton } from "@/components/lms/skeletons/dashboard-skeleton"

export default function Loading() {
  return <DashboardSkeleton />
}
```

#### `app/learn/[competency]/loading.tsx`

```tsx
import { CompetencySkeleton } from "@/components/lms/skeletons/competency-skeleton"

export default function Loading() {
  return <CompetencySkeleton />
}
```

#### `app/learn/[competency]/[module]/loading.tsx`

```tsx
import { ModuleSkeleton } from "@/components/lms/skeletons/module-skeleton"

export default function Loading() {
  return <ModuleSkeleton />
}
```

#### `app/learn/quiz/[quizId]/loading.tsx`

```tsx
import { QuizSkeleton } from "@/components/lms/skeletons/quiz-skeleton"

export default function Loading() {
  return <QuizSkeleton />
}
```

### 3. Error Boundaries

#### `app/learn/error.tsx`

```tsx
"use client"

import { useEffect } from "react"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("LMS Error:", error)
  }, [error])

  return (
    <Stack gap="lg" align="center" className="py-16 text-center">
      <AlertTriangleIcon className="h-16 w-16 text-destructive" />
      
      <Stack gap="sm">
        <Title size="h2">Something went wrong</Title>
        <Text className="text-muted-foreground max-w-md">
          We encountered an error loading this page. Please try again or contact support if the problem persists.
        </Text>
      </Stack>
      
      <Button onClick={reset} className="gap-2">
        <RefreshCwIcon className="h-4 w-4" />
        Try Again
      </Button>
    </Stack>
  )
}
```

#### `app/learn/not-found.tsx`

```tsx
import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { SearchXIcon, ArrowLeftIcon } from "lucide-react"

export default function NotFound() {
  return (
    <Stack gap="lg" align="center" className="py-16 text-center">
      <SearchXIcon className="h-16 w-16 text-muted-foreground" />
      
      <Stack gap="sm">
        <Title size="h2">Content Not Found</Title>
        <Text className="text-muted-foreground max-w-md">
          The module or competency you're looking for doesn't exist or has been moved.
        </Text>
      </Stack>
      
      <Button asChild className="gap-2">
        <Link href="/learn">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </Stack>
  )
}
```

### 4. Empty States

#### `components/lms/empty-state.tsx`

```tsx
/**
 * CATALYST - Empty State
 */

import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack gap="md" align="center" className="py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <Stack gap="xs">
        <Title size="h3">{title}</Title>
        <Text className="text-muted-foreground max-w-md">
          {description}
        </Text>
      </Stack>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </Stack>
  )
}
```

Usage example:

```tsx
// When no modules in competency
<EmptyState
  icon={BookOpenIcon}
  title="No Modules Yet"
  description="This competency doesn't have any modules yet. Check back soon!"
  action={{ label: "Go to Dashboard", href: "/learn" }}
/>
```

### 5. Mobile Responsive Fixes

Add to `app/learn/learn.css`:

```css
/* Mobile sidebar overlay */
@media (max-width: 768px) {
  .learn-shell {
    flex-direction: column;
  }
  
  .learn-sidebar {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--color-background);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .learn-sidebar[data-open="true"] {
    transform: translateX(0);
  }
  
  .learn-sidebar__backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: oklch(0 0 0 / 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .learn-sidebar__backdrop[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
  }
}

/* Ensure content doesn't overflow on mobile */
.learn-content {
  min-width: 0; /* Allow flex shrink */
  overflow-x: hidden;
}

/* Process model cards scroll horizontally on mobile */
@media (max-width: 640px) {
  .learn-process-steps {
    overflow-x: auto;
    padding-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
  }
}

/* Quiz options full width on mobile */
@media (max-width: 640px) {
  .quiz-option {
    padding: 1rem;
  }
}
```

### 6. Accessibility Improvements

#### Focus management

```tsx
// In quiz-question.tsx - Add focus ring styles
<button
  className={cn(
    // ... existing classes
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
  )}
  aria-checked={selectedId === option.id}
  role="radio"
>
```

#### Screen reader announcements

```tsx
// Add live region for quiz progress
<div 
  role="status" 
  aria-live="polite" 
  className="sr-only"
>
  Question {current} of {total}. {percentage}% complete.
</div>
```

#### Keyboard navigation

```tsx
// In CompetencySidebar - Add arrow key navigation
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  if (e.key === "ArrowDown" && index < modules.length - 1) {
    e.preventDefault()
    // Focus next item
  }
  if (e.key === "ArrowUp" && index > 0) {
    e.preventDefault()
    // Focus previous item
  }
}
```

### 7. Performance Optimizations

#### Image optimization

```tsx
// Use Next.js Image for any images
import Image from "next/image"

<Image
  src={founder.avatar}
  alt={founder.name}
  width={48}
  height={48}
  className="rounded-lg"
/>
```

#### Prefetching

```tsx
// Add prefetch hints for likely next pages
import Link from "next/link"

// In competency page, prefetch first module
<Link href={firstModule.href} prefetch>
```

#### Bundle optimization

```tsx
// Dynamic import for heavy components
const ProcessModel = dynamic(
  () => import("@/components/lms/process-model").then((m) => m.ProcessModel),
  { 
    loading: () => <ProcessModelSkeleton />,
    ssr: true 
  }
)
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/lms/skeletons/dashboard-skeleton.tsx` | CREATE |
| `components/lms/skeletons/module-skeleton.tsx` | CREATE |
| `components/lms/skeletons/competency-skeleton.tsx` | CREATE |
| `components/lms/skeletons/quiz-skeleton.tsx` | CREATE |
| `app/learn/loading.tsx` | CREATE |
| `app/learn/[competency]/loading.tsx` | CREATE |
| `app/learn/[competency]/[module]/loading.tsx` | CREATE |
| `app/learn/quiz/[quizId]/loading.tsx` | CREATE |
| `app/learn/error.tsx` | CREATE |
| `app/learn/not-found.tsx` | CREATE |
| `components/lms/empty-state.tsx` | CREATE |
| `app/learn/learn.css` | UPDATE — Add mobile styles |
| Various component files | UPDATE — Add a11y attributes |

---

## Acceptance Criteria

- [ ] All pages show loading skeletons during data fetch
- [ ] Error boundary catches and displays errors gracefully
- [ ] 404 page shows for invalid routes
- [ ] Empty states display when no content available
- [ ] Sidebar collapses to hamburger menu on mobile
- [ ] All interactive elements are keyboard accessible
- [ ] Screen readers can navigate the content
- [ ] Focus states are visible on all interactive elements
- [ ] Images use Next.js Image optimization
- [ ] Core Web Vitals pass (LCP < 2.5s, CLS < 0.1)

---

## Testing Checklist

### Manual Testing

- [ ] Test all pages at 320px, 768px, 1024px, 1440px widths
- [ ] Test with keyboard-only navigation
- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] Test slow network (throttle to 3G in DevTools)
- [ ] Test with JavaScript disabled (graceful degradation)

### Automated Testing

- [ ] Run Lighthouse accessibility audit (target 90+)
- [ ] Run axe DevTools scan
- [ ] Check bundle size with `next build`

---

## Notes

- Loading skeletons should match the layout of actual content
- Error boundaries don't catch errors in event handlers (use try/catch)
- Mobile sidebar requires client-side state for open/close
- Consider adding Suspense boundaries for granular loading states
- Performance optimizations should not affect functionality
