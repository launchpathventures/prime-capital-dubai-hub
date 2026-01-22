/**
 * CATALYST - Feedback Modal
 *
 * Main feedback form with text input, context chip,
 * voice recording, and file attachments.
 *
 * Context is auto-detected and shown as a dismissible chip.
 * Users can remove the chip to give general feedback instead.
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
import { Label } from "@/components/ui/label"
import { useFeedback } from "./feedback-provider"
import { submitFeedback } from "@/lib/lms/feedback"
import { PageFeedbackList } from "./page-feedback-list"
import { FeedbackVoice } from "./feedback-voice"
import { FeedbackAttachments } from "./feedback-attachments"
import { FeedbackUrls } from "./feedback-urls"
import { SendIcon, XIcon, FileTextIcon, MessageSquareIcon, CheckCircleIcon, BookOpenIcon } from "lucide-react"

export function FeedbackModal() {
  const { enabled, isOpen, close, context, quotedText, setQuotedText } = useFeedback()
  const [text, setText] = useState("")
  const [includeContext, setIncludeContext] = useState(true)
  const [audioPath, setAudioPath] = useState<string>()
  const [attachments, setAttachments] = useState<string[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)

  // Don't render if feedback is disabled
  if (!enabled) return null

  const hasModuleContext = Boolean(context.moduleSlug)

  // Build the context label for the chip
  const getContextLabel = () => {
    if (context.moduleSlug) {
      // Format: "C3 / Module 2" or similar
      const compNum = context.competencySlug?.replace("competency-", "C") || ""
      const modNum = context.moduleSlug?.replace("module-", "Module ") || ""
      return `${compNum} / ${modNum}`
    }
    return null
  }

  const contextLabel = getContextLabel()

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await submitFeedback({
          feedbackType: includeContext && hasModuleContext ? "module" : "general",
          competencySlug: includeContext ? context.competencySlug : undefined,
          moduleSlug: includeContext ? context.moduleSlug : undefined,
          pageUrl: context.pageUrl,
          textContent: text || undefined,
          quotedText: quotedText,
          audioPath,
          attachments: attachments.length > 0 ? attachments : undefined,
          urls: urls.length > 0 ? urls : undefined,
        })
        // Show success state
        setShowSuccess(true)
        // Reset form after delay
        setTimeout(() => {
          setText("")
          setQuotedText(undefined)
          setAudioPath(undefined)
          setAttachments([])
          setUrls([])
          setIncludeContext(true)
          setShowSuccess(false)
          close()
        }, 1500)
      } catch (error) {
        console.error("Failed to submit feedback:", error)
      }
    })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
      // Reset context inclusion when closing
      setIncludeContext(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Thank you!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your feedback has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <DialogTitle className="flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5 text-primary" />
                Content Feedback
              </DialogTitle>
              <DialogDescription>
                Help us improve by reporting issues, suggesting changes, or flagging missing content.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              {/* Context indicator - shows what page/module this feedback is about */}
              {hasModuleContext && (
                <div className="feedback-context-block">
                  {includeContext ? (
                    <>
                      <div className="feedback-context-block__info">
                        <FileTextIcon className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Feedback for {contextLabel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This will be linked to the current page
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIncludeContext(false)}
                    className="feedback-context-block__toggle"
                  >
                    Give general feedback instead
                  </button>
                </>
              ) : (
                <>
                  <div className="feedback-context-block__info">
                    <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        General feedback
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Not linked to any specific page
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIncludeContext(true)}
                    className="feedback-context-block__toggle"
                  >
                    Link to {contextLabel}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Quoted text */}
          {quotedText && (
            <div className="relative rounded-lg border border-primary/20 bg-primary/5 p-4">
              <button
                onClick={() => setQuotedText(undefined)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove quote"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <p className="text-xs font-medium text-primary mb-2">
                Selected text
              </p>
              <p className="text-sm italic text-foreground pr-6">
                &ldquo;{quotedText}&rdquo;
              </p>
            </div>
          )}

          {/* Integrated text + voice input */}
          <div className="space-y-2">
            <Label htmlFor="feedback-text">Your feedback</Label>
            <FeedbackVoice
              text={text}
              onTextChange={setText}
              onTranscription={(transcription, path) => {
                setText((prev) =>
                  prev ? `${prev}\n\n${transcription}` : transcription
                )
                setAudioPath(path)
              }}
            />
          </div>

          {/* References section - files and URLs */}
          <div className="feedback-references">
            <div className="feedback-references__header">
              <BookOpenIcon className="h-4 w-4" />
              <span>Reference Materials</span>
            </div>
            <p className="feedback-references__description">
              Attach files or links that support your feedback (optional)
            </p>
            <div className="feedback-references__content">
              <FeedbackAttachments
                attachments={attachments}
                onAdd={(path) => setAttachments((prev) => [...prev, path])}
                onRemove={(path) =>
                  setAttachments((prev) => prev.filter((p) => p !== path))
                }
              />
              <FeedbackUrls
                urls={urls}
                onAdd={(url) => setUrls((prev) => [...prev, url])}
                onRemove={(url) => setUrls((prev) => prev.filter((u) => u !== url))}
              />
            </div>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={(!text.trim() && !audioPath) || isPending}
            className="w-full gap-2"
            size="lg"
          >
            {isPending ? (
              "Submitting..."
            ) : (
              <>
                <SendIcon className="h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>

          {/* Previous feedback for this page */}
          <PageFeedbackList
            competencySlug={context.competencySlug}
            moduleSlug={context.moduleSlug}
          />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
