/**
 * CATALYST - Feedback URLs
 *
 * Input for adding YouTube videos or reference URLs.
 * Supports multiple URLs with add/remove functionality.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, PlusIcon, XIcon, YoutubeIcon } from "lucide-react"

type Props = {
  urls: string[]
  onAdd: (url: string) => void
  onRemove: (url: string) => void
}

export function FeedbackUrls({ urls, onAdd, onRemove }: Props) {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string>()

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL")
      return
    }

    if (urls.includes(trimmed)) {
      setError("This URL has already been added")
      return
    }

    onAdd(trimmed)
    setInputValue("")
    setError(undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      {/* URL list */}
      {urls.length > 0 && (
        <div className="space-y-2">
          {urls.map((url) => (
            <div key={url} className="feedback-url-item">
              {isYouTubeUrl(url) ? (
                <YoutubeIcon className="h-4 w-4 text-red-500 shrink-0" />
              ) : (
                <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="feedback-url-item__link"
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="feedback-url-item__remove"
                aria-label="Remove URL"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add URL input */}
      <div className="flex gap-2">
        <Input
          type="url"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setError(undefined)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste YouTube or reference URL..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          aria-label="Add URL"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
