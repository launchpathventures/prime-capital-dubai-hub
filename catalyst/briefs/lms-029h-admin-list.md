# LMS-029h: Admin Feedback List

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2 hours  
**Dependencies:** LMS-029a  

---

## Objective

Create admin interface to view, filter, and manage feedback status.

---

## Tasks

### 1. Add Sidebar Link

**File:** `lib/navigation.ts`

Add to learn admin navigation (find the learn admin nav section):

```typescript
{ label: "Feedback", href: "/learn/admin/feedback" }
```

### 2. Feedback List Page

**File:** `app/learn/admin/feedback/page.tsx`

```typescript
import { Suspense } from "react"
import { Stack, Title, Text } from "@/components/core"
import { FeedbackList } from "./feedback-list"
import { FeedbackFilters } from "./feedback-filters"

export default function FeedbackPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Content Feedback</Title>
        <Text variant="muted">
          Review and manage feedback from learners
        </Text>
      </div>

      <FeedbackFilters />

      <Suspense fallback={<div>Loading...</div>}>
        <FeedbackList />
      </Suspense>
    </Stack>
  )
}
```

### 3. Feedback Filters Component

**File:** `app/learn/admin/feedback/feedback-filters.tsx`

```typescript
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Row } from "@/components/core"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function FeedbackFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const status = searchParams.get("status") || "all"
  const type = searchParams.get("type") || "all"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/learn/admin/feedback?${params.toString()}`)
  }

  return (
    <Row gap="md" className="flex-wrap">
      <Select value={status} onValueChange={(v) => updateFilter("status", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(v) => updateFilter("type", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="module">Module</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" asChild>
        <a href="/api/feedback/export" download="feedback.md">
          <Download className="h-4 w-4 mr-2" />
          Export Markdown
        </a>
      </Button>
    </Row>
  )
}
```

### 4. Feedback List Component

**File:** `app/learn/admin/feedback/feedback-list.tsx`

```typescript
import { createClient } from "@/lib/supabase/server"
import { Stack } from "@/components/core"
import { FeedbackCard } from "./feedback-card"

type Props = {
  searchParams?: {
    status?: string
    type?: string
  }
}

export async function FeedbackList({ searchParams }: Props) {
  const supabase = await createClient()
  
  let query = supabase
    .from("lms_feedback")
    .select("*")
    .order("created_at", { ascending: false })

  if (searchParams?.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status)
  }

  if (searchParams?.type && searchParams.type !== "all") {
    query = query.eq("feedback_type", searchParams.type)
  }

  const { data: feedback } = await query

  if (!feedback?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No feedback found
      </div>
    )
  }

  return (
    <Stack gap="md">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </Stack>
  )
}
```

### 5. Feedback Card Component

**File:** `app/learn/admin/feedback/feedback-card.tsx`

```typescript
"use client"

import { useState } from "react"
import { Row, Stack, Text } from "@/components/core"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateFeedbackStatus } from "@/lib/lms/feedback-actions"
import { formatDistanceToNow } from "date-fns"

type Props = {
  feedback: {
    id: string
    feedback_type: string
    competency_slug?: string
    module_slug?: string
    page_url?: string
    text_content?: string
    quoted_text?: string
    voice_transcription?: string
    attachments?: string[]
    status: string
    created_at: string
  }
}

export function FeedbackCard({ feedback }: Props) {
  const [status, setStatus] = useState(feedback.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      await updateFeedbackStatus(feedback.id, newStatus)
      setStatus(newStatus)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <Row justify="between" align="center">
          <Row gap="sm" align="center">
            <Badge variant={feedback.feedback_type === "module" ? "default" : "secondary"}>
              {feedback.feedback_type}
            </Badge>
            {feedback.competency_slug && (
              <Text size="sm" variant="muted">
                {feedback.competency_slug}/{feedback.module_slug}
              </Text>
            )}
          </Row>
          
          <Row gap="sm" align="center">
            <Text size="sm" variant="muted">
              {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
            </Text>
            <Select value={status} onValueChange={handleStatusChange} disabled={updating}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Row>
      </CardHeader>
      
      <CardContent>
        <Stack gap="sm">
          {feedback.quoted_text && (
            <div className="bg-muted p-2 rounded text-sm italic">
              "{feedback.quoted_text}"
            </div>
          )}
          
          {feedback.text_content && (
            <Text>{feedback.text_content}</Text>
          )}

          {feedback.voice_transcription && (
            <div className="text-sm">
              <Text size="sm" variant="muted">Voice transcription:</Text>
              <Text>{feedback.voice_transcription}</Text>
            </div>
          )}

          {feedback.attachments?.length > 0 && (
            <div className="text-sm">
              <Text size="sm" variant="muted">
                Attachments: {feedback.attachments.length} file(s)
              </Text>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
```

### 6. Update Status Action

**File:** `lib/lms/feedback-actions.ts` (add to existing)

```typescript
export async function updateFeedbackStatus(
  feedbackId: string,
  status: string
): Promise<void> {
  const supabase = await createClient()
  
  // Admin check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Not authorized")
  }

  const { error } = await supabase
    .from("lms_feedback")
    .update({ status })
    .eq("id", feedbackId)

  if (error) throw error
  
  revalidatePath("/learn/admin/feedback")
}
```

---

## Verification

- [ ] Sidebar link appears in Learn Admin
- [ ] Feedback list loads
- [ ] Status filter works
- [ ] Type filter works  
- [ ] Status can be updated per feedback
- [ ] Cards show all feedback details
- [ ] Export button triggers download
