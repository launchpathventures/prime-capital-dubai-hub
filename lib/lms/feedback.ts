/**
 * CATALYST - LMS Feedback System
 *
 * Server actions for feedback collection and management.
 * Handles feedback submission, retrieval, status updates, and export.
 */

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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
  status: "new" | "in_progress" | "complete"
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
}

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------

export async function getFeedbackEnabled(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "feedback_enabled")
    .single()

  return data?.value === true
}

export async function setFeedbackEnabled(enabled: boolean): Promise<void> {
  const supabase = await createClient()

  // Check admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Not authorized")
  }

  await supabase
    .from("site_settings")
    .update({ value: enabled })
    .eq("key", "feedback_enabled")

  revalidatePath("/learn")
}

// -----------------------------------------------------------------------------
// Submit Feedback
// -----------------------------------------------------------------------------

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("lms_feedback").insert({
    user_id: user.id,
    feedback_type: input.feedbackType,
    competency_slug: input.competencySlug || null,
    module_slug: input.moduleSlug || null,
    page_url: input.pageUrl,
    text_content: input.textContent || null,
    voice_transcription: input.voiceTranscription || null,
    quoted_text: input.quotedText || null,
    audio_path: input.audioPath || null,
    attachments: input.attachments || null,
  })

  if (error) throw error

  revalidatePath(input.pageUrl)
}

// -----------------------------------------------------------------------------
// Get Page Feedback
// -----------------------------------------------------------------------------

export async function getPageFeedback(
  competencySlug?: string,
  moduleSlug?: string
): Promise<Feedback[]> {
  const supabase = await createClient()

  let query = supabase
    .from("lms_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  if (moduleSlug && competencySlug) {
    query = query
      .eq("competency_slug", competencySlug)
      .eq("module_slug", moduleSlug)
  }

  const { data, error } = await query
  if (error) throw error

  return (data as Feedback[]) || []
}

// -----------------------------------------------------------------------------
// Get All Feedback (Admin)
// -----------------------------------------------------------------------------

export async function getAllFeedback(filters?: {
  status?: string
  type?: string
}): Promise<Feedback[]> {
  const supabase = await createClient()

  let query = supabase
    .from("lms_feedback")
    .select("*")
    .order("created_at", { ascending: false })

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.type && filters.type !== "all") {
    query = query.eq("feedback_type", filters.type)
  }

  const { data, error } = await query
  if (error) throw error

  return (data as Feedback[]) || []
}

// -----------------------------------------------------------------------------
// Update Feedback Status (Admin)
// -----------------------------------------------------------------------------

export async function updateFeedbackStatus(
  feedbackId: string,
  status: "new" | "in_progress" | "complete"
): Promise<void> {
  const supabase = await createClient()

  // Admin check
  const {
    data: { user },
  } = await supabase.auth.getUser()
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

// -----------------------------------------------------------------------------
// Upload Audio
// -----------------------------------------------------------------------------

export async function uploadFeedbackAudio(
  formData: FormData
): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const file = formData.get("audio") as File
  const filename = `${user.id}/${Date.now()}-recording.webm`

  const { error } = await supabase.storage
    .from("feedback")
    .upload(filename, file)

  if (error) throw error

  return filename
}

// -----------------------------------------------------------------------------
// Upload Attachment
// -----------------------------------------------------------------------------

export async function uploadFeedbackAttachment(
  formData: FormData
): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
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
