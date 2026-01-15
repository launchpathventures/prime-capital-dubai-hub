"use server"

/**
 * CATALYST - Prompt Management Actions
 *
 * Server actions for updating AI prompts.
 */

import { createClient } from "@/lib/supabase/server"
import { getUserRole } from "@/lib/auth/require-auth"
import { clearPromptCache } from "@/lib/lms/ai-prompts"
import { revalidatePath } from "next/cache"

export async function updatePrompt(
  promptId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  // Admin check
  const role = await getUserRole()
  if (role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get current version number
  const { data: versions } = await supabase
    .from("ai_prompt_versions")
    .select("version_number")
    .eq("prompt_id", promptId)
    .order("version_number", { ascending: false })
    .limit(1)

  const nextVersion = (versions?.[0]?.version_number || 0) + 1

  // Get current content for version history
  const { data: current } = await supabase
    .from("ai_prompts")
    .select("content")
    .eq("id", promptId)
    .single()

  // Save version history
  if (current) {
    await supabase.from("ai_prompt_versions").insert({
      prompt_id: promptId,
      content: current.content,
      version_number: nextVersion - 1,
      created_by: user.id,
      change_note: "Before update",
    })
  }

  // Update prompt
  const { error } = await supabase
    .from("ai_prompts")
    .update({
      content,
      updated_by: user.id,
    })
    .eq("id", promptId)

  if (error) {
    console.error("Failed to update prompt:", error)
    return { success: false, error: error.message }
  }

  // Clear cache so new prompt is used immediately
  clearPromptCache()

  // Revalidate admin page
  revalidatePath("/learn/admin/prompts")

  return { success: true }
}
