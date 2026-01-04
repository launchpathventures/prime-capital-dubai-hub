/**
 * CATALYST - Docs Breadcrumb
 *
 * Breadcrumb navigation for docs header.
 * Shows: Docs icon > Section > Page
 *
 * Mobile: Collapses to just show current page or section
 * Desktop: Shows full path
 *
 * @example
 * <DocsBreadcrumb section="Workflow" page="Decision Points" sectionHref="/docs/workflow" />
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenIcon, ChevronRightIcon } from "lucide-react"
import { Text } from "@/components/core"
import { getDocsPageInfo } from "@/lib/navigation"

interface DocsBreadcrumbProps {
  /** Override the section (otherwise derived from pathname) */
  section?: string
  /** Override the page (otherwise derived from pathname) */
  page?: string
  /** Override the section link href */
  sectionHref?: string
}

export function DocsBreadcrumb({
  section: sectionOverride,
  page: pageOverride,
  sectionHref: sectionHrefOverride,
}: DocsBreadcrumbProps) {
  const pathname = usePathname()
  const pageInfo = getDocsPageInfo(pathname)

  const section = sectionOverride || pageInfo?.section
  const page = pageOverride || pageInfo?.page
  const sectionHref = sectionHrefOverride || pageInfo?.sectionHref || "/docs"

  // Don't show page in breadcrumb if it's the same as section (e.g., "Overview" page in "Overview" section)
  const showPage = page && page !== section && page !== "Overview"

  // What to show as the "current" item (rightmost)
  const currentLabel = showPage ? page : section || "Docs"

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1.5 text-sm"
    >
      {/* Docs home icon - always visible */}
      <Link
        href="/docs"
        className="text-muted-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
        aria-label="Documentation home"
      >
        <BookOpenIcon className="h-4 w-4" />
      </Link>

      <ChevronRightIcon className="text-muted-foreground/50 h-3.5 w-3.5 shrink-0" />

      {/* Mobile: Just show current page/section */}
      <Text
        size="sm"
        className="text-foreground truncate font-medium sm:hidden"
      >
        {currentLabel}
      </Text>

      {/* Desktop: Full breadcrumb path */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {section && (
          <>
            {showPage ? (
              <Link
                href={sectionHref}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {section}
              </Link>
            ) : (
              <Text size="sm" className="text-foreground font-medium">
                {section}
              </Text>
            )}
          </>
        )}

        {showPage && (
          <>
            <ChevronRightIcon className="text-muted-foreground/50 h-3.5 w-3.5" />
            <Text size="sm" className="text-foreground truncate font-medium">
              {page}
            </Text>
          </>
        )}
      </div>
    </nav>
  )
}
