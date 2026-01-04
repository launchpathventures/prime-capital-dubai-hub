/**
 * CATALYST - Docs Accordion Page
 *
 * Shared component for documentation pages that display searchable accordion lists.
 * Provides consistent search, filtering, and accordion behavior across docs.
 *
 * Features:
 * - Search with auto-filter
 * - Single-open accordion behavior
 * - Auto-open single search result
 * - Overview accordion (open by default)
 * - URL hash navigation for deep linking (e.g., #button)
 * - Optional slots for custom content
 */

"use client"

import { useState, useMemo, useEffect, ReactNode, useCallback } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

export type BaseItem = {
  name: string
  slug: string
}

type DocsAccordionPageProps<T extends BaseItem> = {
  /** Page title */
  title: string
  /** Page description */
  description: string
  /** Array of items to display */
  items: T[]
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Filter function for search (defaults to name matching) */
  filterFn?: (item: T, searchTerm: string) => boolean
  /** Render the overview accordion content */
  renderOverview?: () => ReactNode
  /** Render each item's accordion content */
  renderItem: (item: T) => ReactNode
  /** Render the accordion trigger content (defaults to item name) */
  renderTrigger?: (item: T) => ReactNode
  /** Content to render above the search input */
  beforeSearch?: ReactNode
  /** Content to render below the search input */
  afterSearch?: ReactNode
  /** Content to render above the accordion list */
  beforeAccordion?: ReactNode
  /** Content to render below the accordion list */
  afterAccordion?: ReactNode
  /** Whether to show the overview accordion */
  showOverview?: boolean
  /** Custom class for the article wrapper */
  className?: string
}

// =============================================================================
// HASH HELPERS
// =============================================================================

/** Read hash from URL (client-side only) */
function getHash(): string {
  if (typeof window === "undefined") return ""
  return window.location.hash.slice(1)
}

/** Update URL hash using pushState (adds to history for back button) */
function setHash(slug: string | null) {
  if (typeof window === "undefined") return
  if (slug && slug !== "overview") {
    window.history.pushState(null, "", `#${slug}`)
  } else {
    window.history.pushState(null, "", window.location.pathname)
  }
}

/** Scroll to accordion element after brief delay */
function scrollToAccordion(slug: string) {
  setTimeout(() => {
    const element = document.getElementById(`accordion-${slug}`)
    element?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 100)
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DocsAccordionPage<T extends BaseItem>({
  title,
  description,
  items,
  searchPlaceholder = "Search...",
  filterFn,
  renderOverview,
  renderItem,
  renderTrigger,
  beforeSearch,
  afterSearch,
  beforeAccordion,
  afterAccordion,
  showOverview = true,
  className,
}: DocsAccordionPageProps<T>) {
  const [search, setSearch] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Get all valid slugs (including "overview" if applicable)
  const validSlugs = useMemo(() => {
    const slugs = items.map((item) => item.slug)
    if (showOverview && renderOverview) slugs.push("overview")
    return slugs
  }, [items, showOverview, renderOverview])

  // Default filter: match by name
  const defaultFilter = (item: T, term: string) =>
    item.name.toLowerCase().includes(term.toLowerCase())

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const term = search.toLowerCase()
    const filter = filterFn || defaultFilter
    return items.filter((item) => filter(item, term))
  }, [search, items, filterFn])

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = getHash()
    if (hash && validSlugs.includes(hash)) {
      setOpenItems([hash])
      scrollToAccordion(hash)
    } else {
      setOpenItems(["overview"])
    }
    setIsInitialized(true)
  }, [validSlugs])

  // Handle browser back/forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const handlePopState = () => {
      const hash = getHash()
      setSearch("") // Clear search to ensure all items are visible
      
      if (hash && validSlugs.includes(hash)) {
        setOpenItems([hash])
        scrollToAccordion(hash)
      } else {
        setOpenItems(["overview"])
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [validSlugs])

  // Auto-open single result, reset to overview when search cleared
  useEffect(() => {
    if (!isInitialized) return
    
    if (filteredItems.length === 1 && search.trim()) {
      const slug = filteredItems[0].slug
      setOpenItems([slug])
      setHash(slug)
    } else if (!search.trim() && openItems.length === 0) {
      setOpenItems(["overview"])
      setHash(null)
    }
  }, [filteredItems, search, isInitialized])

  // Single-open accordion behavior + hash update
  const handleAccordionChange = (value: string[]) => {
    let newOpenItem: string | null = null
    
    if (value.length > 1) {
      newOpenItem = value.find((v) => !openItems.includes(v)) || null
      setOpenItems(newOpenItem ? [newOpenItem] : [])
    } else {
      newOpenItem = value[0] || null
      setOpenItems(value)
    }
    
    setHash(newOpenItem)
  }

  // Default trigger renderer
  const defaultTrigger = (item: T) => <span>{item.name}</span>

  return (
    <article className={className ?? "space-y-8"}>
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
      </header>

      {/* Before search slot */}
      {beforeSearch}

      {/* Search */}
      <Input
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        startIcon={<SearchIcon />}
        clearable
      />

      {/* After search slot */}
      {afterSearch}

      {/* Before accordion slot */}
      {beforeAccordion}

      {/* Accordion list */}
      <Accordion
        value={openItems}
        onValueChange={handleAccordionChange}
        className="space-y-3"
      >
        {/* Overview accordion */}
        {showOverview &&
          renderOverview &&
          (!search.trim() || "overview".includes(search.toLowerCase())) && (
            <AccordionItem
              id="accordion-overview"
              value="overview"
              className="border-border rounded-lg border"
            >
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <span>Overview</span>
                  <Badge variant="outline">Start Here</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-4">{renderOverview()}</div>
              </AccordionContent>
            </AccordionItem>
          )}

        {/* Item accordions */}
        {filteredItems.map((item) => (
          <AccordionItem
            key={item.slug}
            id={`accordion-${item.slug}`}
            value={item.slug}
            className="border-border rounded-lg border"
          >
            <AccordionTrigger>
              {renderTrigger ? renderTrigger(item) : defaultTrigger(item)}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 overflow-visible py-4">
                {renderItem(item)}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* No results */}
        {filteredItems.length === 0 && search.trim() && (
          <div className="text-muted-foreground py-12 text-center">
            <p>No results found for &quot;{search}&quot;</p>
            <p className="mt-1 text-sm">Try a different search term</p>
          </div>
        )}
      </Accordion>

      {/* After accordion slot */}
      {afterAccordion}
    </article>
  )
}
