/**
 * CATALYST - Examples Breadcrumb
 *
 * Breadcrumb navigation for examples header.
 * Shows: Examples icon > Current example name (with its icon)
 *
 * Mobile: Shows just the current page name
 * Desktop: Shows icon + current page
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GridIcon, ChevronRightIcon } from "lucide-react"
import { Text } from "@/components/core"
import { getExamplesPageInfo } from "@/lib/navigation"

export function ExamplesBreadcrumb() {
  const pathname = usePathname()
  const pageInfo = getExamplesPageInfo(pathname)

  // Fallback for unknown pages
  const label = pageInfo?.label || "Examples"
  const PageIcon = pageInfo?.icon || GridIcon
  const isOverview = pathname === "/examples"

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2 text-sm"
    >
      {/* Examples home icon - always visible */}
      <Link
        href="/examples"
        className="text-muted-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
        aria-label="Examples home"
      >
        <GridIcon className="h-4 w-4" />
      </Link>

      {/* Only show chevron + page if not on overview */}
      {!isOverview && (
        <>
          <ChevronRightIcon className="text-muted-foreground/50 h-3.5 w-3.5 shrink-0" />

          {/* Mobile: Just label */}
          <Text
            size="sm"
            className="text-foreground truncate font-medium sm:hidden"
          >
            {label}
          </Text>

          {/* Desktop: Icon + label */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <PageIcon className="text-muted-foreground h-4 w-4" />
            <Text size="sm" className="text-foreground font-medium">
              {label}
            </Text>
          </div>
        </>
      )}

      {/* Overview page*/}
      {isOverview && (
        <Text size="sm" className="text-foreground font-medium">
          Catalyst Examples
        </Text>
      )}
    </nav>
  )
}
