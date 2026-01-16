/**
 * CATALYST - AI Prompts Library
 *
 * Collection of ready-to-use prompts for Google Gemini.
 * Agents can copy these directly and use them in their daily work.
 */

import { PromptLibrary } from "./_components/prompt-library"

// =============================================================================
// Page
// =============================================================================

export default async function PromptsPage() {
  return (
    <div className="learn-prompts">
        <header className="learn-prompts__header">
          <h1 className="learn-prompts__title">AI Prompts Library</h1>
          <p className="learn-prompts__subtitle">
            Ready-to-use prompts for Google Gemini. Copy, paste, and customise for your needs.
          </p>
        </header>
        
        <PromptLibrary />
    </div>
  )
}
