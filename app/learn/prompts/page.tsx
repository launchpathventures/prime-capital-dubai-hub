/**
 * CATALYST - AI Prompts Library
 *
 * Collection of ready-to-use prompts for Google Gemini.
 * Agents can copy these directly and use them in their daily work.
 */

import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { LearnShell } from "../_surface/learn-shell"
import { PromptLibrary } from "./_components/prompt-library"

// =============================================================================
// Page
// =============================================================================

export default async function PromptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [userRole, userMenu] = await Promise.all([getUserRole(), getUserForMenu()])

  return (
    <LearnShell 
      activeSection="prompts" 
      userRole={userRole}
      user={userMenu ?? undefined}
    >
      <div className="learn-prompts">
        <header className="learn-prompts__header">
          <h1 className="learn-prompts__title">AI Prompts Library</h1>
          <p className="learn-prompts__subtitle">
            Ready-to-use prompts for Google Gemini. Copy, paste, and customise for your needs.
          </p>
        </header>
        
        <PromptLibrary />
      </div>
    </LearnShell>
  )
}
