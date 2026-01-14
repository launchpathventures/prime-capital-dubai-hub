/**
 * CATALYST - Module Coach Prompt
 * 
 * Client component that renders CoachInlinePrompt with module-specific
 * example prompts. Used within CoachWrapper on module pages.
 */

"use client"

import { CoachInlinePrompt } from "./coach-inline-prompt"

interface ModuleCoachPromptProps {
  moduleTitle: string
}

export function ModuleCoachPrompt({ moduleTitle }: ModuleCoachPromptProps) {
  // Context-aware example prompts for module level
  const examplePrompts = [
    "Summarize this in simple terms",
    "What's the key takeaway here?",
    "How do I explain this to a client?",
  ]

  return (
    <CoachInlinePrompt
      placeholder={`Ask anything about "${moduleTitle}"...`}
      examplePrompts={examplePrompts}
    />
  )
}
