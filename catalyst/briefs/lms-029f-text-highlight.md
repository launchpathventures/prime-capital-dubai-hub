# LMS-029f: Text Highlighting

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 1 hour  
**Dependencies:** LMS-029c  

---

## Objective

Allow users to select text on module pages and quote it in their feedback.

---

## Tasks

### 1. Text Selection Hook

**File:** `lib/hooks/use-text-selection.ts`

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"

type SelectionInfo = {
  text: string
  rect: DOMRect
} | null

export function useTextSelection(containerSelector: string) {
  const [selection, setSelection] = useState<SelectionInfo>(null)

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection()
    
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelection(null)
      return
    }

    // Check if selection is within the container
    const container = document.querySelector(containerSelector)
    if (!container) return

    const range = sel.getRangeAt(0)
    const isInContainer = container.contains(range.commonAncestorContainer)

    if (!isInContainer) {
      setSelection(null)
      return
    }

    const rect = range.getBoundingClientRect()
    setSelection({
      text: sel.toString().trim(),
      rect
    })
  }, [containerSelector])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setSelection(null)
  }, [])

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [handleSelectionChange])

  return { selection, clearSelection }
}
```

### 2. Quote Button Component

**File:** `components/lms/feedback-quote.tsx`

```typescript
"use client"

import { useTextSelection } from "@/lib/hooks/use-text-selection"
import { useFeedback } from "./feedback-provider"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"

type Props = {
  containerSelector: string
}

export function FeedbackQuote({ containerSelector }: Props) {
  const { selection, clearSelection } = useTextSelection(containerSelector)
  const { open, setQuotedText } = useFeedback()

  if (!selection) return null

  const handleQuote = () => {
    setQuotedText(selection.text)
    clearSelection()
    open()
  }

  // Position button near selection
  const style = {
    position: "fixed" as const,
    top: selection.rect.top - 40,
    left: selection.rect.left + selection.rect.width / 2,
    transform: "translateX(-50%)",
    zIndex: 100
  }

  return (
    <div style={style}>
      <Button
        size="sm"
        onClick={handleQuote}
        className="shadow-lg"
      >
        <Quote className="h-3 w-3 mr-1" />
        Quote in feedback
      </Button>
    </div>
  )
}
```

### 3. Add to Module Pages

In module page layout or component, add the quote button:

**File:** `app/learn/[competency]/[module]/page.tsx` (or layout)

```tsx
import { FeedbackQuote } from "@/components/lms/feedback-quote"

// Wrap module content in a container with an ID
<div id="module-content" className="module-content">
  {/* Module content here */}
</div>

// Add quote button
<FeedbackQuote containerSelector="#module-content" />
```

### 4. Display Quoted Text in Modal

Already handled in LMS-029c. The quoted text shows in the modal when set.

---

## Verification

- [ ] Select text on module page
- [ ] Quote button appears near selection
- [ ] Click opens feedback modal with quoted text
- [ ] Quoted text displays in modal
- [ ] Quoted text saved with feedback
- [ ] Only works within module content container
