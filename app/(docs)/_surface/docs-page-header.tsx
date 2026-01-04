/**
 * CATALYST - Docs Page Header
 *
 * A consistent page header for documentation pages.
 * Shows title and optional subtitle at the top of content.
 *
 * @example
 * <DocsPageHeader
 *   title="Introduction"
 *   subtitle="Everything you need to know to get started with Catalyst"
 * />
 */

import { cn } from "@/lib/utils"

interface DocsPageHeaderProps {
  /** The main page title */
  title: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Additional className for the container */
  className?: string
}

export function DocsPageHeader({
  title,
  subtitle,
  className,
}: DocsPageHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-2", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
