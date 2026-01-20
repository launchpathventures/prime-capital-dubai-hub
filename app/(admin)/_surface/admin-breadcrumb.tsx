/**
 * Admin Breadcrumb
 *
 * Breadcrumb navigation for admin header.
 * Shows: Admin icon > Section > Page
 *
 * Mobile: Collapses to just show current page or section
 * Desktop: Shows full path
 *
 * @example
 * <AdminBreadcrumb section="Manage" page="Settings" sectionHref="/admin/settings" />
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, ChevronRightIcon } from "lucide-react"
import { Text } from "@/components/core"
import { getAppPageInfo } from "@/lib/navigation"

interface AdminBreadcrumbProps {
  /** Override the section (otherwise derived from pathname) */
  section?: string
  /** Override the page (otherwise derived from pathname) */
  page?: string
  /** Override the section link href */
  sectionHref?: string
}

export function AdminBreadcrumb({
  section: sectionOverride,
  page: pageOverride,
  sectionHref: sectionHrefOverride,
}: AdminBreadcrumbProps) {
  const pathname = usePathname()
  const pageInfo = getAppPageInfo(pathname)

  // Check if we're on the landing page
  const isLandingPage = pathname === "/admin"

  const section = sectionOverride || pageInfo?.section
  const page = pageOverride || pageInfo?.page
  const sectionHref = sectionHrefOverride || pageInfo?.sectionHref || "/admin"

  // Don't show page in breadcrumb if it's the same as section
  const showPage = page && page !== section

  // What to show as the "current" item (rightmost)
  const currentLabel = showPage ? page : section || "Admin"

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2 text-sm"
    >
      {/* Admin home icon - always visible */}
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground flex shrink-0 items-center transition-colors"
        aria-label="Admin home"
      >
        <LayoutDashboardIcon className="h-4 w-4" />
      </Link>

      {/* Landing page: just show "Admin" label (no chevron) */}
      {isLandingPage && (
        <Text size="sm" className="text-foreground font-medium">
          Admin
        </Text>
      )}

      {/* Other pages: show chevron and breadcrumb path */}
      {!isLandingPage && (
        <>
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
        </>
      )}
    </nav>
  )
}
