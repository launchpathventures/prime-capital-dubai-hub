/**
 * CATALYST - Navigation Configuration
 *
 * Central location for all navigation items across layouts.
 * Modify these arrays to update navigation throughout the app.
 *
 * Structure:
 * - webNavItems: Public/marketing pages (web layout)
 * - appNavItems: Authenticated app pages (app layout)
 * - docsNavItems: Documentation + design pages (docs layout)
 * - presentations: Available presentations (present layout)
 */

import {
  LayoutDashboardIcon,
  SettingsIcon,
  LayersIcon,
  GraduationCapIcon,
} from "lucide-react"
import { type NavItem, type NavGroup } from "@/components/layout/collapsible-sidebar-nav"

// Re-export types for use in other files
export type { NavItem, NavGroup }

// -----------------------------------------------------------------------------
// Presentation Type
// -----------------------------------------------------------------------------

export type Presentation = {
  /** Presentation title */
  title: string
  /** Secondary info (date, audience, etc.) */
  addendum: string
  /** Route path */
  href: string
  /** Date for sorting (YYYY-MM-DD format, newest first) */
  date: string
}

/**
 * Get presentation metadata by path.
 * Use this in presentation pages to ensure header matches sidebar.
 *
 * @example
 * const presentation = getPresentationByPath("/present/20260101-placeholder")
 * // { title: "...", addendum: "...", href: "...", date: "..." }
 */
export function getPresentationByPath(path: string): Presentation | undefined {
  return presentations.find((p) => p.href === path)
}

// -----------------------------------------------------------------------------
// Web Navigation (header links for public pages)
// -----------------------------------------------------------------------------

export const webNavItems: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Team", href: "/team" },
]

/** "More" dropdown items for web navigation */
export const webMoreItems: NavItem[] = []

// -----------------------------------------------------------------------------
// App Navigation (sidebar links for authenticated pages)
// -----------------------------------------------------------------------------

export const appNavItems: NavGroup[] = [
  {
    label: "Overview",
    icon: LayoutDashboardIcon,
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
    ],
  },
  {
    label: "Website Content",
    icon: LayersIcon,
    items: [
      { label: "Properties", href: "/admin/properties" },
      { label: "Team", href: "/admin/team" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Stats", href: "/admin/stats" },
    ],
  },
  {
    label: "Learning",
    icon: GraduationCapIcon,
    items: [
      { label: "Modules", href: "/admin/learning/modules" },
      { label: "Users", href: "/admin/learning/users" },
      { label: "Progress", href: "/admin/learning/progress" },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    items: [
      { label: "Site Settings", href: "/admin/site-settings" },
      { label: "Profile", href: "/admin/profile" },
    ],
  },
]

// -----------------------------------------------------------------------------
// Docs Navigation (kept for reference but surface removed) (sidebar links for documentation + design)
// -----------------------------------------------------------------------------

// Docs navigation removed - surface deleted

// -----------------------------------------------------------------------------
// Presentations (for present layout; put newest at the top)
// -----------------------------------------------------------------------------

export const presentations: Presentation[] = [
  {
    title: "Placeholder Presentation",
    addendum: "Template Slides • January 2026",
    href: "/present/20260101-placeholder",
    date: "2026-01-01",
  },
  {
    title: "Presentations with Catalyst",
    addendum: "Example Slides • December 2025",
    href: "/present/20251231-catalyst-example",
    date: "2025-12-31",
  },
]

// -----------------------------------------------------------------------------
// App Navigation Helpers
// -----------------------------------------------------------------------------

export type AppPageInfo = {
  /** The section/group label (e.g., "Overview", "Manage") */
  section: string
  /** The page label (e.g., "Dashboard", "Settings") */
  page: string
  /** The section's first page href (for breadcrumb link) */
  sectionHref: string
  /** The current page href */
  pageHref: string
}

/**
 * Find the current app page info from the pathname.
 * Uses appNavItems to look up section and page labels.
 *
 * @example
 * const info = getAppPageInfo("/admin/settings")
 * // { section: "Manage", page: "Settings", sectionHref: "/admin/settings", pageHref: "/admin/settings" }
 */
export function getAppPageInfo(pathname: string): AppPageInfo | null {
  for (const group of appNavItems) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return {
          section: group.label || item.label,
          page: item.label,
          sectionHref: group.items[0]?.href || pathname,
          pageHref: item.href,
        }
      }
    }
  }

  return null
}
