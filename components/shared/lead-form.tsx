/**
 * CATALYST - Lead Form Component
 *
 * Wrapper for Fillout.com form embeds.
 * Used on Contact and Strategy Kit pages.
 */

import { cn } from "@/lib/utils"

interface LeadFormProps {
  /** Fillout form ID */
  formId: string
  /** Optional additional CSS classes */
  className?: string
  /** Minimum height for the iframe */
  minHeight?: number
}

export function LeadForm({ 
  formId, 
  className, 
  minHeight = 500 
}: LeadFormProps) {
  if (!formId) {
    return (
      <div className={cn("lead-form-placeholder p-8 rounded-xl border bg-muted/50 text-center", className)}>
        <p className="text-muted-foreground">
          Form configuration pending. Please contact us directly.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("lead-form overflow-hidden rounded-xl border bg-card", className)}>
      <iframe
        src={`https://forms.fillout.com/t/${formId}`}
        className="w-full border-0"
        style={{ minHeight: `${minHeight}px` }}
        title="Contact Form"
      />
    </div>
  )
}
