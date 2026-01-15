/**
 * CATALYST - Feedback Modal
 *
 * Main feedback form with text input, context toggle,
 * and placeholders for voice recording and attachments.
 */

"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useFeedback } from "./feedback-provider"
import { submitFeedback } from "@/lib/lms/feedback"
import { PageFeedbackList } from "./page-feedback-list"
import { FeedbackVoice } from "./feedback-voice"
import { FeedbackAttachments } from "./feedback-attachments"

export function FeedbackModal() {
  const { isOpen, close, context, quotedText, setQuotedText } = useFeedback()
  const [text, setText] = useState("")
  const [isModuleSpecific, setIsModuleSpecific] = useState(
    context.type === "module"
  )
  const [audioPath, setAudioPath] = useState<string>()
  const [attachments, setAttachments] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  // Update module toggle when context changes
  const hasModuleContext = Boolean(context.moduleSlug)

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await submitFeedback({
          feedbackType: isModuleSpecific && hasModuleContext ? "module" : "general",
          competencySlug: isModuleSpecific ? context.competencySlug : undefined,
          moduleSlug: isModuleSpecific ? context.moduleSlug : undefined,
          pageUrl: context.pageUrl,
          textContent: text || undefined,
          quotedText: quotedText,
          audioPath,
          attachments: attachments.length > 0 ? attachments : undefined,
        })
        // Reset form
        setText("")
        setQuotedText(undefined)
        setAudioPath(undefined)
        setAttachments([])
        close()
      } catch (error) {
        console.error("Failed to submit feedback:", error)
      }
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Feedback</DialogTitle>
          <DialogDescription>
            Report issues, suggest improvements, or flag missing content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="module-specific">Module-specific feedback</Label>
            <Switch
              id="module-specific"
              checked={isModuleSpecific}
              onCheckedChange={setIsModuleSpecific}
              disabled={!hasModuleContext}
            />
          </div>

          {isModuleSpecific && context.moduleSlug && (
            <p className="text-sm text-muted-foreground">
              Feedback for:{" "}
              <span className="font-medium">
                {context.competencySlug}/{context.moduleSlug}
              </span>
            </p>
          )}

          {/* Quoted text */}
          {quotedText && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">
                Selected text:
              </p>
              <p className="text-sm italic">&ldquo;{quotedText}&rdquo;</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-auto p-0 text-xs"
                onClick={() => setQuotedText(undefined)}
              >
                Remove quote
              </Button>
            </div>
          )}

          {/* Text input */}
          <div className="space-y-2">
            <Label htmlFor="feedback-text">Your feedback</Label>
            <Textarea
              id="feedback-text"
              placeholder="Describe the issue, missing content, or suggestion..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>

          {/* Voice recording */}
          <FeedbackVoice
            onTranscription={(transcription, path) => {
              setText((prev) =>
                prev ? `${prev}\n\n${transcription}` : transcription
              )
              setAudioPath(path)
            }}
          />

          {/* Attachments */}
          <FeedbackAttachments
            attachments={attachments}
            onAdd={(path) => setAttachments((prev) => [...prev, path])}
            onRemove={(path) =>
              setAttachments((prev) => prev.filter((p) => p !== path))
            }
          />

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={(!text.trim() && !audioPath) || isPending}
            className="w-full"
          >
            {isPending ? "Submitting..." : "Submit Feedback"}
          </Button>

          {/* Previous feedback for this page */}
          <PageFeedbackList
            competencySlug={context.competencySlug}
            moduleSlug={context.moduleSlug}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
