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
  hook_v1: string | null
  hook_v2: string | null
  packaging: string | null
  script_body: string | null
  validation_score: number | null
  validation_notes: ValidationNotes | null
  validated_at: string | null
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

export type YouTubeScriptInput = {
  title: string
  topic?: string
  input_text?: string
  status?: ScriptStatus
  format?: Format
  hook_v1?: string
  hook_v2?: string
  packaging?: string
  script_body?: string
  validation_score?: number
  validation_notes?: ValidationNotes
  validated_at?: string
  word_count?: number
  target_length?: string
}

// =============================================================================
// READ
// =============================================================================

export async function getYouTubeScripts(): Promise<ActionResult<YouTubeScript[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("youtube_scripts")
      .select("*")
      .order("created_at", { ascending: false })

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
