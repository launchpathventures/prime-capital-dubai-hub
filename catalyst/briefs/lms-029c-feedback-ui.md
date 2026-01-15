# LMS-029c: Feedback UI

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2 hours  
**Dependencies:** LMS-029a, LMS-029b  

---

## Objective

Create the floating feedback button and modal with text input and context detection.

---

## Tasks

### 1. Feedback Provider

**File:** `components/lms/feedback-provider.tsx`

```typescript
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type FeedbackContext = {
  isOpen: boolean
  open: () => void
  close: () => void
  context: {
    type: "general" | "module"
    competencySlug?: string
    moduleSlug?: string
    pageUrl: string
  }
  setContext: (ctx: FeedbackContext["context"]) => void
  quotedText?: string
  setQuotedText: (text?: string) => void
}

const FeedbackContext = createContext<FeedbackContext | null>(null)

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error("useFeedback must be inside FeedbackProvider")
  return ctx
}

export function FeedbackProvider({ 
  children,
  enabled 
}: { 
  children: ReactNode
  enabled: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<FeedbackContext["context"]>({
    type: "general",
    pageUrl: typeof window !== "undefined" ? window.location.pathname : ""
  })
  const [quotedText, setQuotedText] = useState<string>()

  if (!enabled) return <>{children}</>

  return (
    <FeedbackContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      context,
      setContext,
      quotedText,
      setQuotedText
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}
```

### 2. Floating Button

**File:** `components/lms/feedback-button.tsx`

```typescript
"use client"

import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeedback } from "./feedback-provider"

export function FeedbackButton() {
  const { open } = useFeedback()

  return (
    <Button
      onClick={open}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
      aria-label="Give feedback"
    >
      <MessageSquarePlus className="h-5 w-5" />
    </Button>
  )
}
```

### 3. Feedback Modal

**File:** `components/lms/feedback-modal.tsx`

```typescript
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useFeedback } from "./feedback-provider"
import { submitFeedback } from "@/lib/lms/feedback-actions"

export function FeedbackModal() {
  const { isOpen, close, context, quotedText, setQuotedText } = useFeedback()
  const [text, setText] = useState("")
  const [isModuleSpecific, setIsModuleSpecific] = useState(context.type === "module")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitFeedback({
        feedbackType: isModuleSpecific ? "module" : "general",
        competencySlug: isModuleSpecific ? context.competencySlug : undefined,
        moduleSlug: isModuleSpecific ? context.moduleSlug : undefined,
        pageUrl: context.pageUrl,
        textContent: text,
        quotedText
      })
      setText("")
      setQuotedText(undefined)
      close()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Content Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="module-specific">Module-specific feedback</Label>
            <Switch
              id="module-specific"
              checked={isModuleSpecific}
              onCheckedChange={setIsModuleSpecific}
              disabled={!context.moduleSlug}
            />
          </div>

          {isModuleSpecific && context.moduleSlug && (
            <p className="text-sm text-muted-foreground">
              Feedback for: {context.competencySlug}/{context.moduleSlug}
            </p>
          )}

          {/* Quoted text */}
          {quotedText && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
              <p className="text-sm italic">"{quotedText}"</p>
            </div>
          )}

          {/* Text input */}
          <Textarea
            placeholder="Describe the issue, missing content, or suggestion..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          {/* Voice recording placeholder - LMS-029e */}
          {/* Attachments placeholder - LMS-029g */}

          <Button 
            onClick={handleSubmit} 
            disabled={!text.trim() || submitting}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 4. Submit Action

**File:** `lib/lms/feedback-actions.ts`

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type FeedbackInput = {
  feedbackType: "general" | "module"
  competencySlug?: string
  moduleSlug?: string
  pageUrl: string
  textContent?: string
  voiceTranscription?: string
  quotedText?: string
  audioPath?: string
  attachments?: string[]
}

export async function submitFeedback(input: FeedbackInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("lms_feedback").insert({
    user_id: user.id,
    feedback_type: input.feedbackType,
    competency_slug: input.competencySlug,
    module_slug: input.moduleSlug,
    page_url: input.pageUrl,
    text_content: input.textContent,
    voice_transcription: input.voiceTranscription,
    quoted_text: input.quotedText,
    audio_path: input.audioPath,
    attachments: input.attachments
  })

  if (error) throw error
  
  revalidatePath(input.pageUrl)
}
```

### 5. Add to Learn Layout

**File:** `app/learn/layout.tsx`

Add the provider and components:

```tsx
import { FeedbackProvider } from "@/components/lms/feedback-provider"
import { FeedbackButton } from "@/components/lms/feedback-button"
import { FeedbackModal } from "@/components/lms/feedback-modal"
import { getFeedbackEnabled } from "@/lib/lms/feedback-settings"

export default async function LearnLayout({ children }) {
  const feedbackEnabled = await getFeedbackEnabled()

  return (
    <FeedbackProvider enabled={feedbackEnabled}>
      {children}
      {feedbackEnabled && (
        <>
          <FeedbackButton />
          <FeedbackModal />
        </>
      )}
    </FeedbackProvider>
  )
}
```

### 6. Context Detection Hook

**File:** `lib/hooks/use-feedback-context.ts`

```typescript
"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useFeedback } from "@/components/lms/feedback-provider"

export function useFeedbackContext() {
  const pathname = usePathname()
  const { setContext } = useFeedback()

  useEffect(() => {
    // Pattern: /learn/[competency]/[module]
    const match = pathname.match(/^\/learn\/([^\/]+)\/([^\/]+)/)
    
    if (match) {
      setContext({
        type: "module",
        competencySlug: match[1],
        moduleSlug: match[2],
        pageUrl: pathname
      })
    } else {
      setContext({
        type: "general",
        pageUrl: pathname
      })
    }
  }, [pathname, setContext])
}
```

Call this hook in module pages to auto-detect context.

---

## Verification

- [ ] Floating button appears on learn pages (when enabled)
- [ ] Modal opens on button click
- [ ] Context toggle works
- [ ] Auto-detects module context from URL
- [ ] Can submit text feedback
- [ ] Feedback saved to database
