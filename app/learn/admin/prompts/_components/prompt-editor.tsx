"use client"

/**
 * CATALYST - Prompt Editor Component
 *
 * Editable prompt card with save functionality.
 */

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SaveIcon, RotateCcwIcon, CheckIcon, Loader2Icon } from "lucide-react"
import { updatePrompt } from "../actions"

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

interface PromptEditorProps {
  prompt: Prompt
}

// =============================================================================
// Component
// =============================================================================

export function PromptEditor({ prompt }: PromptEditorProps) {
  const [content, setContent] = useState(prompt.content)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasChanges = content !== prompt.content

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const result = await updatePrompt(prompt.id, content)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        setError(result.error || "Failed to save")
      }
    })
  }

  const handleReset = () => {
    setContent(prompt.content)
    setError(null)
  }

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const getTypeColor = (type: string) => {
    if (type.startsWith("coach_")) return "default"
    if (type.startsWith("roleplay_")) return "secondary"
    return "outline"
  }

  return (
    <div className="prompt-editor">
      <div className="prompt-editor__header">
        <div className="prompt-editor__info">
          <h3 className="prompt-editor__title">{prompt.name}</h3>
          {prompt.description && (
            <p className="prompt-editor__description">{prompt.description}</p>
          )}
        </div>
        <Badge variant={getTypeColor(prompt.prompt_type)}>
          {formatType(prompt.prompt_type)}
        </Badge>
      </div>

      <textarea
        className="prompt-editor__textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        spellCheck={false}
      />

      {error && <p className="prompt-editor__error">{error}</p>}

      <div className="prompt-editor__footer">
        <span className="prompt-editor__updated">
          Last updated: {new Date(prompt.updated_at).toLocaleDateString()}
        </span>

        <div className="prompt-editor__actions">
          {hasChanges && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcwIcon className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
          >
            {isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckIcon className="h-4 w-4 mr-1" />
                Saved
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
