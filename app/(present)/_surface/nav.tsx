/**
 * CATALYST - Presentation Nav
 *
 * Navigation components for presentations:
 * - PresentNav: Sheet-based nav (used during presentations)
 * - PresentNavList: Standalone list (used on index page)
 * - PresentNavItem: Individual presentation link
 *
 * Both use the same filtering/sorting logic and styling for DRY.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Logo } from "@/components/layout/logo"
import { presentations, type Presentation } from "@/lib/navigation"
import { SearchIcon, PresentationIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// -----------------------------------------------------------------------------
// Shared Hook: useFilteredPresentations
// -----------------------------------------------------------------------------

function useFilteredPresentations(search: string) {
  return React.useMemo(() => {
    const sorted = [...presentations].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (!search.trim()) return sorted

    const term = search.toLowerCase()
    return sorted.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.addendum.toLowerCase().includes(term)
    )
  }, [search])
}

// -----------------------------------------------------------------------------
// PresentNavList (standalone, for index page)
// -----------------------------------------------------------------------------

interface PresentNavListProps {
  /** Optional title override */
  title?: string
  /** Show Catalyst logo instead of "All Presentations" link (for index page) */
  showLogo?: boolean
  /** Custom class for the container */
  className?: string
  /** Called when a presentation item is clicked (for closing Sheet) */
  onItemClick?: () => void
}

export function PresentNavList({ title, showLogo = false, className, onItemClick }: PresentNavListProps) {
  const pathname = usePathname()
  const [search, setSearch] = React.useState("")
  const searchRef = React.useRef<HTMLInputElement>(null)
  const filtered = useFilteredPresentations(search)

  // Alt+S keyboard shortcut to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* Header — matches main header height */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        {showLogo ? (
          <Logo />
        ) : (
          <>
            <Link
              href="/present"
              onClick={onItemClick}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {title ?? `All Presentations`}
            </Link>
            <Badge className="h-5 min-w-5 px-1.5 text-xs">
              {presentations.length}
            </Badge>
          </>
        )}
      </div>

      {/* Search — no bottom border, flows into list */}
      <div className="px-4 pt-4 pb-2">
        <Input
          ref={searchRef}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<SearchIcon />}
          endIcon={!search && <Kbd>Alt+S</Kbd>}
        />
      </div>

      {/* List */}
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground px-3 py-6 text-center text-sm">
            No presentations found
          </p>
        ) : (
          filtered.map((presentation) => (
            <PresentNavItem
              key={presentation.href}
              presentation={presentation}
              isActive={pathname === presentation.href}
              onClick={onItemClick}
            />
          ))
        )}
      </nav>
    </div>
  )
}

// -----------------------------------------------------------------------------
// PresentNav (Sheet-based, for presentations)
// -----------------------------------------------------------------------------

interface PresentNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PresentNav({ open, onOpenChange }: PresentNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-96 p-0">
        <PresentNavList onItemClick={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}

// -----------------------------------------------------------------------------
// PresentNavItem
// -----------------------------------------------------------------------------

interface PresentNavItemProps {
  presentation: Presentation
  isActive: boolean
  onClick?: () => void
}

function PresentNavItem({
  presentation,
  isActive,
  onClick,
}: PresentNavItemProps) {
  return (
    <Link
      href={presentation.href}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-transparent p-3 transition-all",
        "hover:bg-accent hover:border-accent-foreground/10",
        isActive && "border-primary/20 bg-primary/5"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <PresentationIcon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{presentation.title}</p>
        <p className="text-muted-foreground text-xs">
          {presentation.addendum}
        </p>
      </div>
    </Link>
  )
}
