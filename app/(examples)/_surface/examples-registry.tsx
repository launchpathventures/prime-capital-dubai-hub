/**
 * CATALYST - Examples Registry
 *
 * Single source of truth for all example pages.
 * Keeps overview cards and page headers consistent.
 *
 * ============================================================================
 * HOW TO ADD A NEW EXAMPLE
 * ============================================================================
 *
 * 1. Add an entry to the `examples` array below with:
 *    - id: URL slug (e.g., "dashboard" → /examples/dashboard)
 *    - title: Display name
 *    - icon: Lucide icon component name
 *    - color: Theme color (blue, emerald, amber, rose, violet, slate, etc.)
 *    - summary: Opening sentence shown in cards AND page headers
 *    - prompt: Additional prompt details for the ExamplePrompt component
 *
 * 2. Create the page at: app/(examples)/examples/[id]/page.tsx
 *
 * 3. Import the example config in your page:
 *    import { getExample } from "../../_surface"
 *    const example = getExample("your-id")
 *
 * 4. Use in your ExamplePrompt:
 *    <ExamplePrompt summary={example.summary}>
 *      {example.prompt}
 *    </ExamplePrompt>
 *
 * 5. Use in your page header:
 *    <Title>{example.title}</Title>
 *    <Text variant="muted">{example.summary}</Text>
 *
 * ============================================================================
 * HOW TO COPY AN EXISTING EXAMPLE
 * ============================================================================
 *
 * 1. Duplicate an existing example folder (e.g., copy dashboard/ to my-feature/)
 * 2. Add a new entry to this registry with unique id
 * 3. Update the page content as needed
 * 4. The overview page will automatically include your new example
 *
 */

import {
  LayoutDashboardIcon,
  UsersIcon,
  InboxIcon,
  KanbanIcon,
  BarChart3Icon,
  CreditCardIcon,
  RocketIcon,
  MapPinIcon,
  CalendarIcon,
  type LucideIcon,
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

export interface ExampleConfig {
  /** URL slug - used in /examples/[id] */
  id: string
  /** Display title */
  title: string
  /** Lucide icon component */
  icon: LucideIcon
  /** Theme color for gradients and accents */
  color: "blue" | "emerald" | "amber" | "rose" | "violet" | "slate" | "teal" | "orange"
  /** Opening sentence - shown in overview cards AND page headers */
  summary: string
  /** Additional prompt details for ExamplePrompt component */
  prompt: React.ReactNode
}

// =============================================================================
// COLOR MAPPINGS
// Converts color name to Tailwind classes for consistent styling
// =============================================================================

export const colorStyles = {
  blue: {
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    headerGradient: "from-blue-500/[0.06] via-blue-500/[0.02] to-transparent",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500/50",
  },
  teal: {
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    headerGradient: "from-teal-500/[0.06] via-teal-500/[0.02] to-transparent",
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderHover: "hover:border-teal-500/50",
  },
  emerald: {
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    headerGradient: "from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
  },
  amber: {
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    headerGradient: "from-amber-500/[0.06] via-amber-500/[0.02] to-transparent",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-500/50",
  },
  orange: {
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    headerGradient: "from-orange-500/[0.06] via-orange-500/[0.02] to-transparent",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderHover: "hover:border-orange-500/50",
  },
  rose: {
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    headerGradient: "from-rose-500/[0.06] via-rose-500/[0.02] to-transparent",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderHover: "hover:border-rose-500/50",
  },
  violet: {
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    headerGradient: "from-violet-500/[0.06] via-violet-500/[0.02] to-transparent",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-500/50",
  },
  slate: {
    gradient: "from-slate-500/20 via-slate-500/5 to-transparent",
    headerGradient: "from-slate-500/[0.06] via-slate-500/[0.02] to-transparent",
    iconBg: "bg-slate-200 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-400",
    borderHover: "hover:border-slate-500/50",
  },
} as const

// =============================================================================
// EXAMPLES REGISTRY
// Order here determines display order on overview page
// =============================================================================

export const examples: ExampleConfig[] = [
  {
    id: "landing",
    title: "Landing",
    icon: RocketIcon,
    color: "violet",
    summary: "Create a high-converting landing page that tells a story and drives action.",
    prompt: (
      <>
        <p>Structure: Hero → Social proof → Features → How it works → Testimonials → CTA</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Hero: Bold headline, subtext, CTA buttons, animated visual/mockup</li>
          <li>Social proof: Logo bar of trusted companies</li>
          <li>Features: 3-4 cards with icons, hover effects, subtle animations</li>
          <li>How it works: 3-step process with numbered badges</li>
          <li>Testimonials: 2-3 quotes with avatars and roles</li>
          <li>Final CTA: Strong closer with gradient background</li>
        </ul>
        <p className="mt-3">
          Feel: Modern, confident, polished. Use scroll animations, gradient accents, and micro-interactions.
          Make visitors want to click that button.
        </p>
      </>
    ),
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    color: "blue",
    summary: "Create a Dashboard example with stats, charts, and activity feeds.",
    prompt: (
      <>
        <p>Layout: Responsive grid with multiple sections</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Top row: 4 stat cards with icons, values, trends, and progress bars</li>
          <li>Middle row: Performance overview with mini charts + Recent activity timeline</li>
          <li>Bottom rows: Task list with checkboxes + Team members list + Recent orders table</li>
        </ul>
        <p className="mt-3">
          Include realistic mock data for a SaaS product. Use gradient backgrounds on cards for visual interest. 
          Make stats interactive where appropriate (e.g., task checkboxes toggle).
        </p>
        <p className="mt-3">
          Style: Use design tokens throughout. Clean, professional, data-rich but not overwhelming.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3Icon,
    color: "orange",
    summary: "Create an Analytics dashboard example that demonstrates a clear, client-ready data story.",
    prompt: (
      <>
        <p>Layout:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Top: Date range selector and key metric cards</li>
          <li>Middle: Primary trend chart with period comparison</li>
          <li>Bottom: Supporting charts and a small data table</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>4 metric cards: Visitors, Conversions, Revenue, Bounce Rate</li>
          <li>Main trend chart with realistic data and comparison</li>
          <li>Supporting bar chart (traffic sources)</li>
          <li>Supporting pie/donut chart (device distribution)</li>
          <li>Table showing top pages with conversion rates</li>
        </ul>
        <p className="mt-3">Outcome: This should feel like a real analytics view a client could react to.</p>
      </>
    ),
  },
  {
    id: "crm",
    title: "CRM",
    icon: UsersIcon,
    color: "emerald",
    summary: "Create a CRM example with customer list and detail view.",
    prompt: (
      <>
        <p>Layout: Two-column split view</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Left: Searchable/filterable customer list with avatar, name, company, status badge</li>
          <li>Right: Customer detail panel showing contact info, activity timeline, and quick actions</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>8-10 realistic mock customers</li>
          <li>Search input and status filter (All, Active, Inactive, Lead)</li>
          <li>Customer detail with: contact info card, recent activity timeline, notes section</li>
          <li>Action buttons: Email, Call, Edit, Archive</li>
        </ul>
        <p className="mt-3">Style: Use design tokens, match the Dashboard example patterns. Keep it clean and functional.</p>
      </>
    ),
  },
  {
    id: "inbox",
    title: "Inbox",
    icon: InboxIcon,
    color: "amber",
    summary: "Create an Inbox example with folders, message list, and detail view.",
    prompt: (
      <>
        <p>Layout: Email-client style with three sections</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Left sidebar: Folders (Inbox, Sent, Drafts, Archive) with unread counts</li>
          <li>Middle: Message list with sender, subject preview, time, read/unread state</li>
          <li>Right: Message detail view with full content and reply area</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>6-8 realistic mock messages (mix of read/unread)</li>
          <li>Folder navigation with active state</li>
          <li>Message list with selection state</li>
          <li>Compose button</li>
          <li>Reply/Forward/Archive actions in detail view</li>
        </ul>
        <p className="mt-3">Style: Clean email interface feel. Use neutral backgrounds to let content breathe.</p>
      </>
    ),
  },
  {
    id: "kanban",
    title: "Kanban",
    icon: KanbanIcon,
    color: "rose",
    summary: "Create a Kanban board example with columns and task cards.",
    prompt: (
      <>
        <p>Layout: Horizontal scrollable board with status columns</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Columns: Backlog, In Progress, Review, Done</li>
          <li>Cards: Task title, assignee avatar, priority tag, due date</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>3-4 cards per column (12-15 total tasks)</li>
          <li>Column headers with task count</li>
          <li>Cards with: title, assignee, priority (High/Medium/Low), due date</li>
          <li>Add Task button per column</li>
          <li>Visual polish: subtle shadows, hover states</li>
        </ul>
        <p className="mt-3">Style: Clean project management feel. Cards should be scannable at a glance.</p>
      </>
    ),
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCardIcon,
    color: "blue",
    summary: "Create a Billing & Account example that feels like a real SaaS settings page.",
    prompt: (
      <>
        <p>Layout: Card-based grid with logical groupings</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Plan & Usage: Current plan card with price, features, next billing + usage meters with limits</li>
          <li>Pricing Tiers: 3-tier upgrade strip (Starter/Pro/Enterprise) with current plan highlighted</li>
          <li>Payment & Invoices: Payment method card + invoice history table with status badges</li>
          <li>Account: Notification toggles + security settings (password, 2FA, sessions)</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Pro Plan @ $29/month with realistic features and billing date</li>
          <li>Pricing tier cards with feature lists, CTAs, and visual hierarchy (violet for Enterprise)</li>
          <li>4 usage meters at varied percentages (some approaching limits with warnings)</li>
          <li>Payment card preview with last 4 digits</li>
          <li>5-6 invoices with download actions</li>
          <li>Interactive toggles and session management</li>
        </ul>
        <p className="mt-3">
          Dialogs: Update payment method, view invoices, cancel subscription (with confirmation).
          Style: Emerald accents for active states, amber for notifications, rose for destructive, violet for premium. Use subtle gradient backgrounds on cards.
        </p>
      </>
    ),
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: CalendarIcon,
    color: "teal",
    summary: "Create an Events Calendar example with calendar and list views.",
    prompt: (
      <>
        <p>Layout: Full calendar view with event management capabilities</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Header: Title with event count, view toggle (Calendar/List), Add Event button</li>
          <li>Calendar view: Month/Week/Day views with event indicators, click to view details</li>
          <li>List view: Chronological event list grouped by date with past event styling</li>
          <li>Event popup: Full details with title, time, location, description, category</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>24 sample events spread across current month (before and after today)</li>
          <li>Event categories with color coding (Meeting=blue, Social=emerald, Deadline=rose, Personal=violet)</li>
          <li>Event details: title, date/time, location, description, category with icons</li>
          <li>Add Event dialog with category selection and form validation</li>
          <li>Today highlight with primary color circle, past events with reduced opacity</li>
        </ul>
        <p className="mt-3">
          Style: Clean calendar interface using FullCalendar with proper CSS theming.
          Category colors should be distinct. Use primary/teal accents for UI elements.
        </p>
      </>
    ),
  },
  {
    id: "maps",
    title: "Maps",
    icon: MapPinIcon,
    color: "violet",
    summary: "Create a property listings page with interactive map and list views.",
    prompt: (
      <>
        <p>Layout: Split view with map + listings, toggle between Map/List views</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Header: View toggle (Map/List), filter bar (price, bedrooms, property type)</li>
          <li>Map view: Interactive MapLibre map with property markers, popup on click</li>
          <li>List view: Grid of property cards with image, price, details</li>
          <li>Sidebar/cards: Property info, favorite button, quick stats</li>
        </ul>
        <p className="mt-3">Include:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>8-10 sample properties with varied prices, locations, images</li>
          <li>Filter controls that work across both views</li>
          <li>Map markers with price labels, cluster on zoom out</li>
          <li>Hover/click interactions between map and list</li>
        </ul>
        <p className="mt-3">
          Style: Clean real-estate feel. Blue accents for interactive elements.
          Use MapLibre GL with free OpenStreetMap tiles.
        </p>
      </>
    ),
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a single example by ID
 */
export function getExample(id: string): ExampleConfig | undefined {
  return examples.find((e) => e.id === id)
}

/**
 * Get example with computed color styles
 */
export function getExampleWithStyles(id: string) {
  const example = getExample(id)
  if (!example) return undefined
  return {
    ...example,
    styles: colorStyles[example.color],
  }
}

/**
 * Get all examples with computed color styles (for overview page)
 */
export function getAllExamplesWithStyles() {
  return examples.map((example) => ({
    ...example,
    href: `/examples/${example.id}`,
    styles: colorStyles[example.color],
  }))
}
