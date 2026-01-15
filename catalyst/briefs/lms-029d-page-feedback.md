# LMS-029d: Page Feedback Display

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** LMS-029c  

---

## Objective

Show existing feedback for the current page so users don't duplicate reports.

---

## Tasks

### 1. Fetch Page Feedback Action

**File:** `lib/lms/feedback-actions.ts` (add to existing)

```typescript
export async function getPageFeedback(
  competencySlug?: string,
  moduleSlug?: string
): Promise<Feedback[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from("lms_feedback")
    .select(`
      id,
      feedback_type,
      competency_slug,
      module_slug,
      text_content,
      quoted_text,
      status,
      created_at,
      user_id
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  if (moduleSlug) {
    query = query
      .eq("competency_slug", competencySlug)
      .eq("module_slug", moduleSlug)
  }

  const { data, error } = await query
  if (error) throw error
  
  return data || []
}

export type Feedback = {
  id: string
  feedback_type: "general" | "module"
  competency_slug?: string
  module_slug?: string
  text_content?: string
  quoted_text?: string
  status: "new" | "in_progress" | "complete"
  created_at: string
  user_id: string
}
```

### 2. Page Feedback Component

**File:** `components/lms/page-feedback.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { useFeedback } from "./feedback-provider"
import { getPageFeedback, type Feedback } from "@/lib/lms/feedback-actions"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export function PageFeedback() {
  const { context, isOpen } = useFeedback()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    
    setLoading(true)
    getPageFeedback(context.competencySlug, context.moduleSlug)
      .then(setFeedback)
      .finally(() => setLoading(false))
  }, [isOpen, context.competencySlug, context.moduleSlug])

  if (!isOpen || loading) return null
  if (feedback.length === 0) return null

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm font-medium mb-2">
        Previous feedback ({feedback.length})
      </p>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {feedback.map((item) => (
          <div 
            key={item.id} 
            className="text-sm p-2 rounded bg-muted"
          >
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={item.status} />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </span>
            </div>
            {item.quoted_text && (
              <p className="text-xs italic text-muted-foreground mb-1">
                "{item.quoted_text.slice(0, 50)}..."
              </p>
            )}
            <p className="line-clamp-2">
              {item.text_content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Feedback["status"] }) {
  const variants = {
    new: "default",
    in_progress: "secondary", 
    complete: "outline"
  } as const

  return (
    <Badge variant={variants[status]} className="text-xs">
      {status.replace("_", " ")}
    </Badge>
  )
}
```

### 3. Add to Feedback Modal

Update `components/lms/feedback-modal.tsx` to include PageFeedback:

```tsx
import { PageFeedback } from "./page-feedback"

// Inside DialogContent, after the submit button:
<PageFeedback />
```

---

## Verification

- [ ] Previous feedback shows when opening modal
- [ ] Shows feedback count
- [ ] Shows status badge
- [ ] Shows relative time
- [ ] Truncates long content
- [ ] Scrollable if many items
