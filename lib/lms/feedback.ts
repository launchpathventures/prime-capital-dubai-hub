/**
 * CATALYST - LMS Feedback System
 *
 * Server actions for feedback collection and management.
 * Handles feedback submission, retrieval, status updates, and export.
 */

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Feedback, FeedbackInput } from "./feedback-types"

// Re-export types for convenience (types are allowed in "use server" files)
export type { Feedback, FeedbackInput }

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
    urls: input.urls || null,
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

  const file = formData.get("audio")
  if (!file || !(file instanceof File)) {
    throw new Error("No audio file provided or invalid file type")
  }

  const filename = `${user.id}/${Date.now()}-recording.webm`

  const { error } = await supabase.storage
    .from("feedback")
    .upload(filename, file, {
      contentType: "audio/webm",
      upsert: false,
    })

  if (error) {
    console.error("Supabase storage upload error:", error)
    throw new Error(`Upload failed: ${error.message}`)
  }

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

  const file = formData.get("file")
  if (!file || !(file instanceof File)) {
    throw new Error("No file provided or invalid file type")
  }

  const ext = file.name.split(".").pop() || "bin"
  const filename = `${user.id}/${Date.now()}-attachment.${ext}`

  const { error } = await supabase.storage
    .from("feedback")
    .upload(filename, file, {
      upsert: false,
    })

  if (error) {
    console.error("Supabase storage upload error:", error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  return filename
}

// -----------------------------------------------------------------------------
// Get Signed URL for Feedback File
// -----------------------------------------------------------------------------

export async function getFeedbackFileUrl(path: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("feedback")
    .createSignedUrl(path, 3600) // 1 hour expiry

  if (error) {
    console.error("Failed to create signed URL:", error)
    return null
  }

  return data.signedUrl
}

// -----------------------------------------------------------------------------
// Get Signed URLs for Multiple Files
// -----------------------------------------------------------------------------

export async function getFeedbackFileUrls(
  paths: string[]
): Promise<Record<string, string>> {
  const supabase = await createClient()
  const urls: Record<string, string> = {}

  // Get signed URLs in parallel
  const results = await Promise.all(
    paths.map(async (path) => {
      const { data, error } = await supabase.storage
        .from("feedback")
        .createSignedUrl(path, 3600)
      return { path, url: error ? null : data?.signedUrl }
    })
  )

  for (const { path, url } of results) {
    if (url) urls[path] = url
  }

  return urls
}
