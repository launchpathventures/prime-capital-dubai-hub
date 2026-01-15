/**
 * CATALYST - Feedback Attachments
 *
 * File attachment component for feedback.
 * Supports images and PDFs up to 10MB.
 */

"use client"

import { useState, useRef } from "react"
import { Paperclip, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadFeedbackAttachment } from "@/lib/lms/feedback"

type Props = {
  attachments: string[]
  onAdd: (path: string) => void
  onRemove: (path: string) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_ATTACHMENTS = 3
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]

export function FeedbackAttachments({ attachments, onAdd, onRemove }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only images and PDFs are allowed")
      return
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 10MB")
      return
    }

    setError(undefined)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const path = await uploadFeedbackAttachment(formData)
      onAdd(path)
    } catch (err) {
      console.error("Upload failed:", err)
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
          disabled={uploading || attachments.length >= MAX_ATTACHMENTS}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4 mr-1" />
          )}
          Attach File
        </Button>
        <span className="text-xs text-muted-foreground">
          {attachments.length}/{MAX_ATTACHMENTS} files (max 10MB each)
        </span>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

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
