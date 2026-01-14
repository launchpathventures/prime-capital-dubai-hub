/**
 * CATALYST - Prompt Card Component
 *
 * Displays a single prompt with expandable content and copy button.
 */

"use client"

import * as React from "react"
import { useState } from "react"
import { CopyIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// =============================================================================
// Types
// =============================================================================

interface Prompt {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
}

interface PromptCardProps {
  prompt: Prompt
}

// =============================================================================
// Component
// =============================================================================

export function PromptCard({ prompt }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div 
      className="prompt-card"
      data-expanded={isExpanded}
    >
      <div 
        className="prompt-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="prompt-card__info">
          <h3 className="prompt-card__title">{prompt.title}</h3>
          <p className="prompt-card__description">{prompt.description}</p>
        </div>
        <div className="prompt-card__actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="prompt-card__copy"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
          <button 
            className="prompt-card__expand"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="prompt-card__content">
          <pre className="prompt-card__prompt">{prompt.prompt}</pre>
          <div className="prompt-card__tags">
            {prompt.tags.map((tag) => (
              <span key={tag} className="prompt-card__tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
