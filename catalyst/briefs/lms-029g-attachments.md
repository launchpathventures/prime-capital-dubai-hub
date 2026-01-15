# LMS-029g: Attachments

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 1 hour  
**Dependencies:** LMS-029c  

---

## Objective

Allow users to attach files (images, PDFs) to their feedback.

---

## Tasks

### 1. Attachment Upload Component

**File:** `components/lms/feedback-attachments.tsx`

```typescript
"use client"

import { useState, useRef } from "react"
import { Paperclip, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadAttachment } from "@/lib/lms/feedback-actions"

type Props = {
  attachments: string[]
  onAdd: (path: string) => void
  onRemove: (path: string) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf"
]

export function FeedbackAttachments({ attachments, onAdd, onRemove }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only images and PDFs are allowed")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 10MB")
      return
    }

    setError(undefined)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const path = await uploadAttachment(formData)
      onAdd(path)
    } catch (err) {
      setError("Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          id="feedback-attachment"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || attachments.length >= 3}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4 mr-1" />
          )}
          Attach
        </Button>
        <span className="text-xs text-muted-foreground">
          {attachments.length}/3 files (max 10MB each)
        </span>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((path) => (
            <div
              key={path}
              className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
            >
              <span className="truncate max-w-[150px]">
                {path.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => onRemove(path)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 2. Upload Action

**File:** `lib/lms/feedback-actions.ts` (add to existing)

```typescript
export async function uploadAttachment(formData: FormData): Promise<string> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const file = formData.get("file") as File
  const ext = file.name.split(".").pop()
  const filename = `${user.id}/${Date.now()}-attachment.${ext}`

  const { error } = await supabase.storage
    .from("feedback")
    .upload(filename, file)

  if (error) throw error

  return filename
}
```

### 3. Add to Feedback Modal

Update `components/lms/feedback-modal.tsx`:

```tsx
import { FeedbackAttachments } from "./feedback-attachments"

// State
const [attachments, setAttachments] = useState<string[]>([])

// In the form, after voice recording:
<FeedbackAttachments
  attachments={attachments}
  onAdd={(path) => setAttachments(prev => [...prev, path])}
  onRemove={(path) => setAttachments(prev => prev.filter(p => p !== path))}
/>

// Update submitFeedback call:
await submitFeedback({
  ...
  attachments
})
```

---

## Verification

- [ ] Attach button appears in modal
- [ ] Can select image/PDF files
- [ ] File size validation works (10MB limit)
- [ ] File type validation works
- [ ] Upload to Supabase Storage works
- [ ] Can remove attachments before submit
- [ ] Max 3 attachments enforced
- [ ] Attachments saved with feedback
