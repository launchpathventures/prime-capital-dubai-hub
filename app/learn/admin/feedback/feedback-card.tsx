/**
 * CATALYST - Feedback Card
 *
 * Individual feedback item display with status management.
 * Elegant card design with visual status indicators.
 */

"use client"

import { useState, useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateFeedbackStatus, type Feedback } from "@/lib/lms/feedback"
import { STATUS_LABELS } from "@/lib/lms/feedback-types"
import { formatDistanceToNow } from "date-fns"
import {
  FileTextIcon,
  MessageSquareIcon,
  MicIcon,
  PaperclipIcon,
  ExternalLinkIcon,
  UserIcon,
  LinkIcon,
  YoutubeIcon,
  BookOpenIcon,
} from "lucide-react"

type Props = {
  feedback: Feedback
  fileUrls?: Record<string, string>
  userName?: string | null
}

export function FeedbackCard({ feedback, fileUrls = {}, userName }: Props) {
  const [status, setStatus] = useState(feedback.status)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateFeedbackStatus(
          feedback.id,
          newStatus as "new" | "in_progress" | "complete"
        )
        setStatus(newStatus as Feedback["status"])
      } catch (error) {
        console.error("Failed to update status:", error)
      }
    })
  }

  return (
    <article className={`feedback-card feedback-card--${status}`}>
      {/* Header */}
      <header className="feedback-card__header">
        <div className="feedback-card__meta">
          {userName && (
            <span className="feedback-card__user">
              <UserIcon className="h-3 w-3" />
              {userName}
            </span>
          )}
          <span
            className={`feedback-card__type feedback-card__type--${feedback.feedback_type}`}
          >
            {feedback.feedback_type === "module" ? (
              <FileTextIcon className="h-3 w-3" />
            ) : (
              <MessageSquareIcon className="h-3 w-3" />
            )}
            {feedback.feedback_type}
          </span>
          {feedback.competency_slug && (
            <span className="feedback-card__location">
              {feedback.competency_slug}/{feedback.module_slug}
            </span>
          )}
        </div>

        <div className="feedback-card__actions">
          <span className="feedback-card__time">
            {formatDistanceToNow(new Date(feedback.created_at), {
              addSuffix: true,
            })}
          </span>
          <Select
            value={status}
            onValueChange={(v) => v && handleStatusChange(v)}
            disabled={isPending}
          >
            <SelectTrigger className="feedback-status-select h-8 text-xs">
              <SelectValue>{STATUS_LABELS[status]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Body */}
      <div className="feedback-card__body">
        {/* Quoted text */}
        {feedback.quoted_text && (
          <blockquote className="feedback-card__quote">
            &ldquo;{feedback.quoted_text}&rdquo;
          </blockquote>
        )}

        {/* Main text content */}
        {feedback.text_content && (
          <p className="feedback-card__text">{feedback.text_content}</p>
        )}

        {/* Voice transcription */}
        {feedback.voice_transcription && (
          <div className="feedback-card__transcription">
            <div className="feedback-card__transcription-label">
              <MicIcon className="h-3.5 w-3.5" />
              Voice Transcription
            </div>
            <p className="feedback-card__transcription-text">
              {feedback.voice_transcription}
            </p>
          </div>
        )}

        {/* References section - attachments and URLs */}
        {((feedback.attachments && feedback.attachments.length > 0) || 
          (feedback.urls && feedback.urls.length > 0)) && (
          <div className="feedback-card__references">
            <div className="feedback-card__references-header">
              <BookOpenIcon className="h-4 w-4" />
              <span>Reference Materials</span>
            </div>
            
            {/* Attachments */}
            {feedback.attachments && feedback.attachments.length > 0 && (
              <div className="feedback-card__attachments">
                <PaperclipIcon className="h-4 w-4 text-gray-400" />
                {feedback.attachments.map((path, idx) => {
                  const url = fileUrls[path]
                  if (!url) return null
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="feedback-card__attachment"
                    >
                      Attachment {idx + 1}
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )
                })}
              </div>
            )}

            {/* Reference URLs */}
            {feedback.urls && feedback.urls.length > 0 && (
              <div className="feedback-card__urls">
                {feedback.urls.map((url, idx) => {
                  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be")
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="feedback-card__url"
                    >
                      {isYouTube ? (
                        <YoutubeIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="truncate">{url}</span>
                      <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="feedback-card__footer">
        <span className="feedback-card__page" title={feedback.page_url ?? undefined}>
          {feedback.page_url}
        </span>
        <span className="feedback-card__id">ID: {feedback.id.slice(0, 8)}</span>
      </footer>
    </article>
  )
}
