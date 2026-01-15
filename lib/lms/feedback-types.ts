/**
 * CATALYST - LMS Feedback Types
 *
 * Type definitions and constants for the feedback system.
 * Separated from server actions to avoid "use server" export restrictions.
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Feedback = {
  id: string
  user_id: string
  feedback_type: "general" | "module"
  competency_slug: string | null
  module_slug: string | null
  page_url: string | null
  text_content: string | null
  voice_transcription: string | null
  quoted_text: string | null
  audio_path: string | null
  attachments: string[] | null
  urls: string[] | null
  status: "new" | "in_progress" | "complete" | "archived"
  created_at: string
  updated_at: string
}

export type FeedbackInput = {
  feedbackType: "general" | "module"
  competencySlug?: string
  moduleSlug?: string
  pageUrl: string
  textContent?: string
  voiceTranscription?: string
  quotedText?: string
  audioPath?: string
  attachments?: string[]
  urls?: string[]
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const STATUS_LABELS: Record<Feedback["status"], string> = {
  new: "New",
  in_progress: "In Progress",
  complete: "Complete",
  archived: "Archived",
}
