/**
 * CATALYST - Property Markdown Prose
 *
 * Lightweight markdown renderer for CRM property fields
 * (reasons_to_invest, location_and_views, about_developer, etc).
 * Lives next to the widget so it ships only on PDPs.
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

interface PropertyProseProps {
  content: string
  className?: string
}

export function PropertyProse({ content, className }: PropertyProseProps) {
  return (
    <div className={cn("property-prose text-[var(--web-spruce)] text-[15px] font-light leading-relaxed", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
