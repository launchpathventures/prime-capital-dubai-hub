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
  BookOpenIcon,
  ClipboardCheckIcon,
  ComponentIcon,
  PaletteIcon,
  TargetIcon,
  LayoutDashboardIcon,
  UsersIcon,
  InboxIcon,
  KanbanIcon,
  BarChart3Icon,
  SettingsIcon,
  CreditCardIcon,
  GripIcon,
  GridIcon,
  LayersIcon,
  RocketIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingIcon,
  MessageSquareQuoteIcon,
  TrendingUpIcon,
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
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Properties", href: "/properties" },
  { label: "Team", href: "/team" },
]

/** "More" dropdown items for web navigation */
export const webMoreItems: NavItem[] = [
  { label: "Strategy Kit", href: "/strategy-kit" },
  { label: "Contact", href: "/contact" },
]

// -----------------------------------------------------------------------------
// App Navigation (sidebar links for authenticated pages)
// -----------------------------------------------------------------------------

export const appNavItems: NavGroup[] = [
  {
    label: "Overview",
    icon: LayoutDashboardIcon,
    items: [
      { label: "Dashboard", href: "/app/dashboard" },
    ],
  },
  {
    label: "Website Content",
    icon: LayersIcon,
    items: [
      { label: "Properties", href: "/app/properties" },
      { label: "Team", href: "/app/team" },
      { label: "Testimonials", href: "/app/testimonials" },
      { label: "Stats", href: "/app/stats" },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    items: [
      { label: "Site Settings", href: "/app/site-settings" },
      { label: "Profile", href: "/app/profile" },
    ],
  },
]

// -----------------------------------------------------------------------------
// Examples Navigation (sidebar links for reference implementations)
// -----------------------------------------------------------------------------

export const examplesNavItems: NavItem[] = [
  { label: "Overview", href: "/examples", icon: GridIcon },
  { label: "Landing", href: "/examples/landing", icon: RocketIcon },
  { label: "Dashboard", href: "/examples/dashboard", icon: LayoutDashboardIcon },
  { label: "Analytics", href: "/examples/analytics", icon: BarChart3Icon },
  { label: "CRM", href: "/examples/crm", icon: UsersIcon },
  { label: "Inbox", href: "/examples/inbox", icon: InboxIcon },
  { label: "Kanban", href: "/examples/kanban", icon: KanbanIcon },
  { label: "Billing", href: "/examples/billing", icon: CreditCardIcon },
  { label: "Calendar", href: "/examples/calendar", icon: CalendarIcon },
  { label: "Maps", href: "/examples/maps", icon: MapPinIcon },
]

// -----------------------------------------------------------------------------
// Docs Navigation (sidebar links for documentation + design)
// -----------------------------------------------------------------------------

export const docsNavItems: NavGroup[] = [
  {
    label: "Overview",
    icon: BookOpenIcon,
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Quickstart", href: "/docs/core/quickstart" },
      { label: "Features", href: "/docs/core/architecture" },
      { label: "Approach", href: "/docs/core/approach" },
      { label: "Stacks", href: "/docs/core/stacks" },
      { label: "Glossary", href: "/docs/core/glossary" },
      { label: "What Next", href: "/docs/core/what-next" },
    ],
  },
  {
    label: "Workflow",
    icon: LayersIcon,
    items: [
      { label: "Overview", href: "/docs/workflow" },
      { label: "Roles & Collaboration", href: "/docs/workflow/roles" },
      { label: "Delivery Cycles", href: "/docs/workflow/delivery" },
      { label: "POC Workflow", href: "/docs/workflow/poc" },
      { label: "MVP Workflow", href: "/docs/workflow/mvp" },
      { label: "MMP Workflow", href: "/docs/workflow/mmp" },
      { label: "PROD Workflow", href: "/docs/workflow/production" },
    ],
  },
  {
    label: "Prompts",
    icon: TargetIcon,
    items: [
      { label: "Overview", href: "/docs/prompts" },
      { label: "Project Sessions", href: "/docs/prompts/project-sessions" },
      { label: "Project Artefacts", href: "/docs/prompts/project-artefacts" },
      { label: "Coding Sessions", href: "/docs/prompts/coding-sessions" },
      { label: "Quality & Audits", href: "/docs/prompts/quality" },
      { label: "Stage Promotion", href: "/docs/prompts/promotion" },
    ],
  },
  {
    label: "Audits",
    icon: ClipboardCheckIcon,
    items: [
      { label: "Overview", href: "/docs/audits" },
      { label: "Data & Security", href: "/docs/audits/data" },
      { label: "Accessibility & Inclusion", href: "/docs/audits/accessibility" },
      { label: "Design & Experience", href: "/docs/audits/experience" },
      { label: "Speed & Performance", href: "/docs/audits/performance" },
      { label: "Code & Testing", href: "/docs/audits/code" },
      { label: "Deploy & Observe", href: "/docs/audits/deploy" },
      { label: "Content & SEO", href: "/docs/audits/content" },
      { label: "Integrations & Services", href: "/docs/audits/integrations" },
    ],
  },
  {
    label: "Design",
    icon: PaletteIcon,
    items: [
      { label: "Overview", href: "/docs/design" },
      { label: "Playbook", href: "/docs/design/playbook" },
      { label: "Customisation", href: "/docs/design/customisation" },
      { label: "Demo", href: "/docs/design/demo" },
      { label: "Colours", href: "/docs/design/colors" },
      { label: "Typography", href: "/docs/design/typography" },
      { label: "Layout", href: "/docs/design/layout" },
      { label: "Patterns", href: "/docs/design/content-patterns" },
    ],
  },
  {
    label: "Develop",
    icon: SettingsIcon,
    items: [
      { label: "Overview", href: "/docs/develop" },
      { label: "Setup", href: "/docs/develop/setup" },
      { label: "Standards", href: "/docs/develop/standards" },
      { label: "Helpers", href: "/docs/develop/helpers" },
      { label: "Authentication", href: "/docs/develop/authentication" },
      { label: "Upgrade", href: "/docs/develop/upgrade" },
      { label: "Deployments", href: "/docs/develop/deployments" },
    ],
  },
  {
    label: "Components",
    icon: ComponentIcon,
    items: [
      { label: "Overview", href: "/docs/components" },
      { label: "Patterns", href: "/docs/components/patterns" },
      { label: "Examples", href: "/docs/components/examples" },
      { label: "UI (Shadcn)", href: "/docs/components/ui" },
      { label: "Core", href: "/docs/components/core" },
      { label: "Shared", href: "/docs/components/shared" },
      { label: "Vendor", href: "/docs/components/vendor" },
      { label: "— Charts", href: "/docs/components/vendor/charts" },
      { label: "— DnD Kit", href: "/docs/components/vendor/dnd-kit" },
      { label: "Layout", href: "/docs/components/layout" },
    ],
  },
  {
    label: "Surfaces",
    icon: LayersIcon,
    items: [
      { label: "Overview", href: "/docs/surfaces" },
      { label: "Web", href: "/docs/surfaces/web" },
      { label: "App", href: "/docs/surfaces/app" },
      { label: "Docs", href: "/docs/surfaces/docs" },
      { label: "Examples", href: "/docs/surfaces/examples" },
      { label: "Present", href: "/docs/surfaces/present" },
      { label: "Auth", href: "/docs/surfaces/auth" },
    ],
  },
  {
    label: "Integrations",
    icon: BookOpenIcon,
    items: [
      { label: "Overview", href: "/docs/integrations" },
      { label: "Supabase", href: "/docs/integrations/supabase-auth" },
    ],
  },
]

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
// Docs Navigation Helpers
// -----------------------------------------------------------------------------

export type DocsPageInfo = {
  /** The section/group label (e.g., "Overview", "Workflow") */
  section: string
  /** The page label (e.g., "Introduction", "Decision Points") */
  page: string
  /** The section's first page href (for breadcrumb link) */
  sectionHref: string
  /** The current page href */
  pageHref: string
}

/**
 * Find the current docs page info from the pathname.
 * Uses docsNavItems to look up section and page labels.
 *
 * @example
 * const info = getDocsPageInfo("/docs/workflow/delivery")
 * // { section: "Workflow", page: "Delivery Cycles", sectionHref: "/docs/workflow", pageHref: "/docs/workflow/delivery" }
 */
export function getDocsPageInfo(pathname: string): DocsPageInfo | null {
  // Strip hash from pathname for matching
  const cleanPath = pathname.split("#")[0]

  for (const group of docsNavItems) {
    for (const item of group.items) {
      // Match the item href (also strip hash for comparison)
      const itemPath = item.href.split("#")[0]
      if (itemPath === cleanPath || item.href === pathname) {
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

// -----------------------------------------------------------------------------
// Examples Navigation Helpers
// -----------------------------------------------------------------------------

export type ExamplesPageInfo = {
  /** The page label (e.g., "Dashboard", "Analytics") */
  label: string
  /** The page href */
  href: string
  /** The page icon */
  icon: typeof GridIcon
}

/**
 * Find the current examples page info from the pathname.
 * Uses examplesNavItems to look up label and icon.
 *
 * @example
 * const info = getExamplesPageInfo("/examples/dashboard")
 * // { label: "Dashboard", href: "/examples/dashboard", icon: LayoutDashboardIcon }
 */
export function getExamplesPageInfo(pathname: string): ExamplesPageInfo | null {
  const item = examplesNavItems.find((item) => item.href === pathname)
  if (!item) return null
  
  return {
    label: item.label,
    href: item.href,
    icon: item.icon || GridIcon,
  }
}

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
 * const info = getAppPageInfo("/app/settings")
 * // { section: "Manage", page: "Settings", sectionHref: "/app/settings", pageHref: "/app/settings" }
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
