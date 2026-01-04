/**
 * CATALYST - Markdown Viewer
 *
 * Displays raw markdown content with a header showing the filename
 * and a copy button. Used for prompts and other markdown files that
 * users need to copy as raw text.
 */

import { Text } from "@/components/core"
import { CopyButton } from "@/components/shared/copy-button"

export interface MarkdownViewerProps {
  /** Display title (e.g., "Starter", "Vision") */
  title: string
  /** Source filename shown below the title */
  filename: string
  /** Raw markdown content to display */
  content: string
  /** Maximum height before scrolling (default: 500px) */
  maxHeight?: number
}

export function MarkdownViewer({
  title,
  filename,
  content,
  maxHeight = 500,
}: MarkdownViewerProps) {
  return (
    <div className="markdown-viewer rounded-xl border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <Text weight="semibold">{title}</Text>
          <Text size="xs" variant="muted">
            {filename}
          </Text>
        </div>
        <CopyButton text={content} />
      </div>
      <div
        className="overflow-y-auto p-4"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
          {content}
        </pre>
      </div>
    </div>
  )
}
