/**
 * CATALYST - Admin Prompt Management
 *
 * Interface for managing AI system prompts.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { LearnShell } from "@/app/learn/_surface/learn-shell"
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
  const [userRole, userMenu] = await Promise.all([
    getUserRole(),
    getUserForMenu(),
  ])

  // Admin only
  if (userRole !== "admin") {
    redirect("/learn")
  }

  const prompts = await getPrompts()

  return (
    <LearnShell
      activeSection="admin"
      userRole={userRole}
      user={userMenu ?? undefined}
    >
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
    </LearnShell>
  )
}
