/**
 * CATALYST - Coach Inline Prompt
 *
 * Prominent AI Coach prompt that integrates into the content flow.
 * Shows clear branding, value prop, input, and example prompts.
 * 
 * Used by: Module pages (after title, before content)
 */

"use client"

import * as React from "react"
import { SparklesIcon, ArrowRightIcon } from "lucide-react"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CoachInlinePromptProps {
  /** Placeholder text for the input */
  placeholder?: string
  /** Example prompts to show as clickable pills */
  examplePrompts?: string[]
  /** Additional CSS classes */
  className?: string
}

// -----------------------------------------------------------------------------
// Default Example Prompts by Context
// -----------------------------------------------------------------------------

const DEFAULT_EXAMPLES = [
  "Summarize this in simple terms",
  "What's the most important thing here?",
  "How would I explain this to a client?",
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CoachInlinePrompt({
  placeholder = "Ask anything about this module...",
  examplePrompts = DEFAULT_EXAMPLES,
  className,
}: CoachInlinePromptProps) {
  const { openCoach, sendMessage } = useCoach()
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    openCoach()
    // Small delay to ensure panel is open before sending
    setTimeout(() => {
      sendMessage(inputValue.trim())
      setInputValue("")
    }, 100)
  }

  const handleExampleClick = (prompt: string) => {
    openCoach()
    setTimeout(() => {
      sendMessage(prompt)
    }, 100)
  }

  return (
    <div
      className={cn(
        "coach-inline-prompt",
        className
      )}
    >
      {/* Header with branding */}
      <div className="coach-inline-prompt__header">
        <div className="coach-inline-prompt__brand">
          <span className="coach-inline-prompt__icon">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <span className="coach-inline-prompt__title">AI Coach</span>
          <span className="coach-inline-prompt__badge">Beta</span>
        </div>
        <p className="coach-inline-prompt__description">
          Get instant answers and explanations about this content
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="coach-inline-prompt__form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="coach-inline-prompt__input"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="coach-inline-prompt__submit"
          aria-label="Send message"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      {/* Example prompts */}
      {examplePrompts.length > 0 && (
        <div className="coach-inline-prompt__examples">
          <span className="coach-inline-prompt__examples-label">Try asking:</span>
          <div className="coach-inline-prompt__examples-list">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(prompt)}
                className="coach-inline-prompt__example"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
