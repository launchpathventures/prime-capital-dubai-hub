/**
 * CATALYST - Admin Prompt Management
 *
 * Interface for managing AI system prompts.
 */

import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth/require-auth"
import { PromptEditor } from "./_components/prompt-editor"
import { SparklesIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Prompts | Admin",
}

// =============================================================================
// Types
// =============================================================================

interface Prompt {
  id: string
  prompt_type: string
  name: string
  description: string | null
  content: string
  is_active: boolean
  updated_at: string
}

// =============================================================================
// Data Fetching
// =============================================================================

async function getPrompts(): Promise<Prompt[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .order("prompt_type")

  if (error) {
    console.error("Failed to fetch prompts:", error)
    return []
  }

  return data
}

// =============================================================================
// Page Component
// =============================================================================

export default async function AdminPromptsPage() {
  // Require admin access
  await requireAdmin()

  const prompts = await getPrompts()

  return (
    <div className="admin-prompts">
        <header className="admin-prompts__header">
          <div className="admin-prompts__header-icon">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <h1>AI Prompts</h1>
            <p>
              Manage system prompts for the AI Coach and Scenario Roleplay.
              Changes take effect immediately.
            </p>
          </div>
        </header>

        <div className="admin-prompts__list">
          {prompts.length === 0 ? (
            <p className="admin-prompts__empty">
              No prompts found. Run the migration to seed default prompts.
            </p>
          ) : (
            prompts.map((prompt) => (
              <PromptEditor key={prompt.id} prompt={prompt} />
            ))
          )}
        </div>
    </div>
  )
}
