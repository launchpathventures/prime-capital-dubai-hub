/**
 * CATALYST - Collapsible Sidebar Navigation
 *
 * Flexible sidebar navigation supporting flat items, grouped sections,
 * and collapsible accordion mode with optional search filtering.
 *
 * FEATURES:
 * - Flat or grouped navigation items
 * - Optional search with Alt+S keyboard shortcut
 * - Accordion mode (single-open by default)
 * - Expand/collapse all button (appears with search + accordion)
 * - Auto-expand all sections when searching
 * - Collapse to active section when clearing search
 * - Click section header while expanded → collapse to that section
 * - Disable animations during search for instant feedback
 *
 * PROPS:
 * - items: NavItem[] | NavGroup[] — flat or grouped navigation
 * - showSearch: boolean — enable search filter (default: false)
 * - accordion: boolean — enable collapsible sections (default: false)
 * - onItemClick: () => void — callback for mobile sidebar close
 *
 * STATE ARCHITECTURE (for accordion mode):
 * - openSections: number[] — which sections are open (lifted to parent)
 * - isExpanded: boolean — manual expand mode (button clicked)
 * - isSearching: boolean — derived from search query
 * - showExpanded: isExpanded || isSearching — combined expand state
 *
 * KEY PATTERNS:
 * - State lifted to CollapsibleSidebarNav, passed as controlled props to accordion
 * - Section clicks directly call setOpenSections([index]) + onExitExpanded()
 * - Collapse button calls setOpenSections([]) + setIsExpanded(false)
 * - useEffect only handles expand (transition TO expanded mode)
 *
 * @example
 * // Basic flat navigation
 * <CollapsibleSidebarNav items={navItems} />
 *
 * // Grouped sections (always expanded)
 * <CollapsibleSidebarNav items={navGroups} />
 *
 * // Collapsible accordion with search
 * <CollapsibleSidebarNav items={navGroups} showSearch accordion />
 *
 * // With mobile close callback
 * <CollapsibleSidebarNav items={navGroups} showSearch accordion onItemClick={closeMobileSidebar} />
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type LucideIcon, SearchIcon, ListIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Row, Text } from "@/components/core"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NavItem {
  /** Display label for the nav item */
  label: string
  /** Route path (href) */
  href: string
  /** Optional Lucide icon component */
  icon?: LucideIcon
  /** Optional: mark as disabled */
  disabled?: boolean
}

export interface NavGroup {
  /** Optional group label (renders as section header) */
  label?: string
  /** Optional icon for the section header */
  icon?: LucideIcon
  /** Items in this group */
  items: NavItem[]
}

// -----------------------------------------------------------------------------
// CollapsibleSidebarNav Component
// -----------------------------------------------------------------------------

interface CollapsibleSidebarNavProps extends React.ComponentProps<"nav"> {
  /**
   * Navigation items. Can be a flat array of items or grouped.
   */
  items: NavItem[] | NavGroup[]
  /**
   * Show search filter input at the top.
   * @default false
   */
  showSearch?: boolean
  /**
   * Placeholder text for search input.
   * @default "Search..."
   */
  searchPlaceholder?: string
  /**
   * Use accordion for grouped navigation (single-open behavior).
   * @default false
   */
  accordion?: boolean
  /**
   * Called when a nav item is clicked.
   * Useful for closing mobile sidebar after navigation.
   */
  onItemClick?: () => void
}

function CollapsibleSidebarNav({
  items,
  showSearch = false,
  searchPlaceholder = "Search...",
  accordion = false,
  onItemClick,
  className,
  ...props
}: CollapsibleSidebarNavProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)

  // Alt+S keyboard shortcut to focus search
  React.useEffect(() => {
    if (!showSearch) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSearch])

  // Determine if items are grouped or flat
  const isGrouped = items.length > 0 && "items" in items[0]

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items

    const query = searchQuery.toLowerCase()

    if (isGrouped) {
      // Filter grouped items
      return (items as NavGroup[])
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLowerCase().includes(query)
          ),
        }))
        .filter((group) => group.items.length > 0)
    } else {
      // Filter flat items
      return (items as NavItem[]).filter((item) =>
        item.label.toLowerCase().includes(query)
      )
    }
  }, [items, searchQuery, isGrouped])

  // Find the active group index (group containing current page)
  // Uses most specific match (longest href) to avoid /docs matching everything
  const activeGroupIndex = React.useMemo(() => {
    if (!isGrouped) return 0
    const groups = items as NavGroup[]
    
    let bestMatch = { groupIndex: 0, hrefLength: 0 }
    
    groups.forEach((group, groupIndex) => {
      group.items.forEach((item) => {
        const isMatch = pathname === item.href || pathname.startsWith(item.href + "/")
        if (isMatch && item.href.length > bestMatch.hrefLength) {
          bestMatch = { groupIndex, hrefLength: item.href.length }
        }
      })
    })
    
    return bestMatch.groupIndex
  }, [items, isGrouped, pathname])

  // Accordion state: initialize to active section
  const [openSections, setOpenSections] = React.useState<number[]>([activeGroupIndex])
  
  // Sync open section when navigating to a different group
  React.useEffect(() => {
    if (!openSections.includes(activeGroupIndex)) {
      setOpenSections([activeGroupIndex])
    }
  }, [activeGroupIndex]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Expand mode: manually expanded or auto-expanded during search
  const [isExpanded, setIsExpanded] = React.useState(false)
  const isSearching = searchQuery.trim().length > 0
  const showExpanded = isExpanded || isSearching

  // Clear search and return to showing only the active section
  const handleClearSearch = () => {
    setSearchQuery("")
    setIsExpanded(false)
    setOpenSections([activeGroupIndex])
  }

  // Callback for accordion to exit expanded mode (collapse button)
  const handleExitExpanded = React.useCallback(() => {
    setIsExpanded(false)
  }, [])

  // Collapse all sections (for the collapse button)
  const handleCollapseAll = React.useCallback(() => {
    setOpenSections([])
    setIsExpanded(false)
  }, [])

  return (
    <nav
      data-slot="sidebar-nav"
      className={cn("layout-sidebar-nav", "flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      {/* Search filter - stays fixed above scroll area */}
      {showSearch && (
        <div className="mb-3 flex shrink-0 items-center gap-1 px-4 pt-4">
          <Input
            ref={searchRef}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={handleClearSearch}
            startIcon={<SearchIcon />}
            endIcon={!searchQuery && <Kbd>Alt+S</Kbd>}
            clearable
            className="h-8 text-sm"
          />
          {accordion && isGrouped && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => isExpanded ? handleCollapseAll() : setIsExpanded(true)}
                    aria-label={showExpanded ? "Collapse sections" : "Expand all sections"}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent side="right">
                {showExpanded ? "Collapse sections" : "Expand all sections"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Scrollable navigation list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {/* Navigation items */}
        {isGrouped
          ? accordion
            ? // Render grouped navigation with accordion
              <GroupedNavAccordion
                groups={filteredItems as NavGroup[]}
                pathname={pathname}
                onItemClick={onItemClick}
                expanded={showExpanded}
                onExitExpanded={handleExitExpanded}
                openSections={openSections}
                setOpenSections={setOpenSections}
                activeGroupIndex={activeGroupIndex}
                isSearching={isSearching}
              />
            : // Render grouped navigation with section icons (always expanded)
            (filteredItems as NavGroup[]).map((group, groupIndex) => {
              const GroupIcon = group.icon
              return (
                <div key={groupIndex} className="mb-4">
                  {group.label && (
                    <Row gap="sm" className="text-muted-foreground mb-2 px-3">
                      {GroupIcon && <GroupIcon className="h-4 w-4" />}
                      <Text as="span" size="xs" weight="medium" className="uppercase tracking-wider">
                        {group.label}
                      </Text>
                    </Row>
                  )}
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <SidebarNavItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        indented
                        onClick={onItemClick}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          : // Render flat navigation
            (filteredItems as NavItem[]).map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                onClick={onItemClick}
              />
            ))}

        {/* Empty state when search has no results */}
        {showSearch && searchQuery && filteredItems.length === 0 && (
          <Text size="sm" variant="muted" align="center" className="px-3 py-4">
            No pages found
          </Text>
        )}
      </div>
    </nav>
  )
}

// -----------------------------------------------------------------------------
// SidebarNavItem (internal)
// -----------------------------------------------------------------------------

interface SidebarNavItemProps {
  item: NavItem
  isActive: boolean
  /** Indent item (for grouped navigation) */
  indented?: boolean
  /** Called when item is clicked */
  onClick?: () => void
}

function SidebarNavItem({ item, isActive, indented = false, onClick }: SidebarNavItemProps) {
  const Icon = item.icon

  if (item.disabled) {
    return (
      <span
        className={cn(
          "text-muted-foreground flex items-center gap-3 rounded-md py-1.5 text-sm opacity-50",
          indented ? "pl-6 pr-3" : "px-3"
        )}
        aria-disabled="true"
      >
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md py-1.5 text-sm transition-colors",
        indented ? "pl-6 pr-3" : "px-3",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {indented && (
        <span className="text-muted-foreground/50 -ml-3 text-xs">└</span>
      )}
      {Icon && <Icon className="h-4 w-4" />}
      {item.label}
    </Link>
  )
}

// -----------------------------------------------------------------------------
// GroupedNavAccordion (internal)
// Two modes: default (single-open) and expanded (all open)
// -----------------------------------------------------------------------------

interface GroupedNavAccordionProps {
  groups: NavGroup[]
  pathname: string
  onItemClick?: () => void
  /** Whether all sections should be expanded */
  expanded?: boolean
  /** Callback to exit expanded mode */
  onExitExpanded?: () => void
  /** Currently open section indices (controlled) */
  openSections: number[]
  /** Callback to set which sections are open */
  setOpenSections: (sections: number[]) => void
  /** Index of the group containing the active page */
  activeGroupIndex: number
  /** Whether user is actively searching (disables animations) */
  isSearching?: boolean
}

function GroupedNavAccordion({ 
  groups, 
  pathname, 
  onItemClick, 
  expanded = false,
  onExitExpanded,
  openSections,
  setOpenSections,
  activeGroupIndex,
  isSearching = false,
}: GroupedNavAccordionProps) {
  // When entering expanded mode, open all sections
  const prevExpandedRef = React.useRef(expanded)
  const groupsLength = groups.length
  
  React.useEffect(() => {
    // Only expand all when transitioning TO expanded mode
    if (expanded && !prevExpandedRef.current) {
      setOpenSections(Array.from({ length: groupsLength }, (_, i) => i))
    }
    prevExpandedRef.current = expanded
  }, [expanded, groupsLength, setOpenSections])

  return (
    <Accordion
      value={openSections}
      onValueChange={(newValue) => {
        // In expanded mode, section clicks are handled by onClick on trigger
        if (!expanded) {
          setOpenSections(newValue as number[])
        }
      }}
      className="flex flex-col gap-1"
    >
      {groups.map((group, groupIndex) => {
        const GroupIcon = group.icon
        const isActiveGroup = groupIndex === activeGroupIndex

        return (
          <AccordionItem
            key={groupIndex}
            value={groupIndex}
            className="border-none"
          >
            <AccordionTrigger
              onClick={() => {
                // When in expanded mode, collapse to just this section
                if (expanded && onExitExpanded) {
                  setOpenSections([groupIndex])
                  onExitExpanded()
                }
              }}
              className={cn(
                "px-3 py-2 text-xs font-medium uppercase tracking-wider",
                "hover:bg-sidebar-accent/50 rounded-md",
                "[&>svg]:h-3.5 [&>svg]:w-3.5",
                isActiveGroup
                  ? "text-sidebar-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Row gap="sm" className="items-center">
                {GroupIcon && <GroupIcon className="h-4 w-4" />}
                <span>{group.label}</span>
              </Row>
            </AccordionTrigger>
            <AccordionContent className={cn("px-0 pt-1 pb-2", isSearching && "!animate-none")}>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    indented
                    onClick={onItemClick}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export { CollapsibleSidebarNav }
