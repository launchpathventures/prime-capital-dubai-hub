/**
 * CATALYST - YouTube Scripts Server Actions
 *
 * CRUD operations for the youtube_scripts table.
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { trackActionError } from "@/lib/error-tracking"
import type { ActionResult } from "./cms"
import type { Format } from "@/lib/youtube/prompts"
import type { ProfileSlug } from "@/lib/youtube/profiles"

// =============================================================================
// TYPES
// =============================================================================

export type ScriptStatus = "idea" | "script_drafted" | "script_ready" | "script_recorded" | "script_live"

export type YouTubeScript = {
  id: string
  title: string
  topic: string | null
  input_text: string | null
  status: ScriptStatus
  format: Format | null
  profile_slug: ProfileSlug
  hook_v1: string | null
  hook_v2: string | null
  packaging: string | null
  script_body: string | null
  validation_score: number | null
  validation_notes: ValidationNotes | null
  validated_at: string | null
  panel_review: PanelReview | null
  panel_review_score: number | null
  panel_reviewed_at: string | null
  word_count: number | null
  target_length: string | null
  user_id: string | null
  created_at: string | null
  updated_at: string | null
}

export type ValidationNotes = {
  overall: string
  score: number
  checks: {
    category: string
    passed: boolean
    notes: string
  }[]
}

export type ReviewerOutput = {
  /** 0-100 score the reviewer assigns from its specialist lens. */
  score: number
  /** One- to two-sentence summary of the reviewer's verdict. */
  verdict: string
  /** Specific, actionable issues the reviewer flagged. */
  top_issues: string[]
  /** Things the script does well from this lens — kept brief. */
  ok_signals: string[]
}

export type PanelReview = {
  /** Synthesised 0-100 overall score (Haiku synthesiser output). */
  overall_score: number
  /** Synthesiser's one- to two-sentence overall verdict. */
  verdict: string
  /** Must-fix items before recording. */
  blocking_issues: string[]
  /** Nice-to-have polish — not blocking. */
  polish_recommendations: string[]
  /** Synthesiser's go/no-go call. */
  ready_to_record: boolean
  /** Individual reviewer outputs from the four specialist agents. */
  reviewers: {
    structure: ReviewerOutput
    voice: ReviewerOutput
    evidence: ReviewerOutput
    retention: ReviewerOutput
  }
  /** ISO timestamp set server-side. */
  reviewed_at: string
}

export type YouTubeScriptInput = {
  title: string
  topic?: string
  input_text?: string
  status?: ScriptStatus
  format?: Format
  profile_slug?: ProfileSlug
  hook_v1?: string
  hook_v2?: string
  packaging?: string
  script_body?: string
  validation_score?: number | null
  validation_notes?: ValidationNotes | null
  validated_at?: string | null
  panel_review?: PanelReview | null
  panel_review_score?: number | null
  panel_reviewed_at?: string | null
  word_count?: number
  target_length?: string
}

export type YouTubeScriptMessage = {
  id: string
  script_id: string
  role: "user" | "assistant"
  content: string
  tool_name: string | null
  tool_input: Record<string, unknown> | null
  cleared_at: string | null
  created_at: string
}

export type YouTubeScriptVersion = {
  id: string
  script_id: string
  version_number: number
  script_body: string | null
  packaging: string | null
  hook_v1: string | null
  hook_v2: string | null
  word_count: number | null
  validation_score: number | null
  validation_notes: ValidationNotes | null
  panel_review: Record<string, unknown> | null
  panel_review_score: number | null
  chat_summary: string | null
  profile_slug: ProfileSlug | null
  created_at: string
}

// =============================================================================
// READ
// =============================================================================

export async function getYouTubeScripts(
  options: { profileSlug?: ProfileSlug } = {}
): Promise<ActionResult<YouTubeScript[]>> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("youtube_scripts")
      .select("*")
      .order("created_at", { ascending: false })

    if (options.profileSlug) {
      query = query.eq("profile_slug", options.profileSlug)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data: data as YouTubeScript[] }
  } catch (error) {
    trackActionError(error, "getYouTubeScripts")
    return { success: false, error: "Failed to load scripts" }
  }
}

export async function getYouTubeScript(id: string): Promise<ActionResult<YouTubeScript>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("youtube_scripts")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    if (!data) return { success: false, error: "Script not found" }
    return { success: true, data: data as YouTubeScript }
  } catch (error) {
    trackActionError(error, "getYouTubeScript")
    return { success: false, error: "Failed to load script" }
  }
}

// =============================================================================
// CREATE
// =============================================================================

export async function createYouTubeScript(
  input: YouTubeScriptInput
): Promise<ActionResult<YouTubeScript>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("youtube_scripts")
      .insert({
        ...input,
        status: input.status || "idea",
        user_id: user?.id,
      })
      .select("*")
      .single()

    if (error) throw error
    revalidatePath("/admin/youtube")
    return { success: true, data: data as YouTubeScript }
  } catch (error) {
    trackActionError(error, "createYouTubeScript")
    return { success: false, error: "Failed to create script" }
  }
}

export async function createYouTubeScripts(
  inputs: YouTubeScriptInput[]
): Promise<ActionResult<YouTubeScript[]>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const rows = inputs.map((input) => ({
      ...input,
      status: input.status || "idea",
      user_id: user?.id,
    }))

    const { data, error } = await supabase
      .from("youtube_scripts")
      .insert(rows)
      .select("*")

    if (error) throw error
    revalidatePath("/admin/youtube")
    return { success: true, data: data as YouTubeScript[] }
  } catch (error) {
    trackActionError(error, "createYouTubeScripts")
    return { success: false, error: "Failed to create scripts" }
  }
}

// =============================================================================
// UPDATE
// =============================================================================

export async function updateYouTubeScript(
  id: string,
  input: Partial<YouTubeScriptInput>
): Promise<ActionResult<YouTubeScript>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("youtube_scripts")
      .update(input)
      .eq("id", id)
      .select("*")
      .single()

    if (error) throw error
    revalidatePath("/admin/youtube")
    return { success: true, data: data as YouTubeScript }
  } catch (error) {
    trackActionError(error, "updateYouTubeScript")
    return { success: false, error: "Failed to update script" }
  }
}

export async function updateScriptStatus(
  id: string,
  status: ScriptStatus
): Promise<ActionResult<YouTubeScript>> {
  return updateYouTubeScript(id, { status })
}

// =============================================================================
// MESSAGES — chat refinement thread
// =============================================================================

/** Fetch the active (not-yet-rolled-off) chat thread for a script. */
export async function getYouTubeScriptMessages(
  scriptId: string
): Promise<ActionResult<YouTubeScriptMessage[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("youtube_script_messages")
      .select("*")
      .eq("script_id", scriptId)
      .is("cleared_at", null)
      .order("created_at", { ascending: true })

    if (error) throw error
    return { success: true, data: (data ?? []) as YouTubeScriptMessage[] }
  } catch (error) {
    trackActionError(error, "getYouTubeScriptMessages")
    return { success: false, error: "Failed to load messages" }
  }
}

// =============================================================================
// VERSIONS — snapshots taken at regen time
// =============================================================================

/** Fetch every snapshot ever taken for a script, newest first. */
export async function getYouTubeScriptVersions(
  scriptId: string
): Promise<ActionResult<YouTubeScriptVersion[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("youtube_script_versions")
      .select("*")
      .eq("script_id", scriptId)
      .order("version_number", { ascending: false })

    if (error) throw error
    return { success: true, data: (data ?? []) as YouTubeScriptVersion[] }
  } catch (error) {
    trackActionError(error, "getYouTubeScriptVersions")
    return { success: false, error: "Failed to load versions" }
  }
}

// =============================================================================
// DELETE
// =============================================================================

export async function deleteYouTubeScript(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("youtube_scripts")
      .delete()
      .eq("id", id)

    if (error) throw error
    revalidatePath("/admin/youtube")
    return { success: true, data: undefined }
  } catch (error) {
    trackActionError(error, "deleteYouTubeScript")
    return { success: false, error: "Failed to delete script" }
  }
}
