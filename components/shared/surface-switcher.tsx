/**
 * CATALYST - Surface Switcher
 *
 * Popover menu for quick navigation between surfaces.
 * Opens on hover, matching the theme toggle behavior.
 * Shows the current surface's icon and highlights it in the menu.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useHeaderPopover } from "./header-popover-context"
import {
  GlobeIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  PresentationIcon,
  GridIcon,
  HomeIcon,
  LockIcon,
  GraduationCapIcon,
  type LucideIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Surface Configuration
// -----------------------------------------------------------------------------

export type Surface = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

export const surfaces: Surface[] = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "web", label: "Web", href: "/web", icon: GlobeIcon },
  { id: "admin", label: "Admin", href: "/admin", icon: LayoutDashboardIcon },
  { id: "learn", label: "Learn", href: "/learn", icon: GraduationCapIcon },
  { id: "auth", label: "Auth", href: "/auth", icon: LockIcon },
  { id: "present", label: "Present", href: "/present", icon: PresentationIcon },
  { id: "examples", label: "Examples", href: "/examples", icon: GridIcon },
  { id: "docs", label: "Docs", href: "/docs", icon: BookOpenIcon },
]

/**
 * Get the current surface based on pathname.
 * Matches the most specific path first (e.g., /admin/dashboard matches "admin").
 */
export function getSurfaceFromPath(pathname: string): Surface {
  // Check surfaces in reverse order (most specific paths first)
  // Skip "home" initially to check other surfaces first
  for (const surface of surfaces) {
    if (surface.id !== "home" && pathname.startsWith(surface.href)) {
      return surface
    }
  }
  // Default to home
  return surfaces[0]
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function SurfaceSwitcher() {
  const { open, setOpen } = useHeaderPopover("surface")
  const pathname = usePathname()
  const currentSurface = getSurfaceFromPath(pathname)
  const CurrentIcon = currentSurface.icon

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shared-surface-switcher text-muted-foreground outline-none"
            aria-label={`Current: ${currentSurface.label}. Switch surface`}
            tabIndex={-1}
          >
            <CurrentIcon className="h-4 w-4" />
          </Button>
        }
        onMouseEnter={() => setOpen(true)}
      />
      <PopoverContent
        className="w-44 gap-1! p-1"
        align="end"
        onMouseLeave={() => setOpen(false)}
        tabIndex={-1}
      >
        {surfaces.map((surface) => {
          const isActive = surface.id === currentSurface.id
          return (
            <Link
              key={surface.href}
              href={surface.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
                isActive
                  ? "bg-accent text-primary font-medium"
                  : "hover:bg-accent"
              )}
              onClick={() => setOpen(false)}
              tabIndex={-1}
            >
              <surface.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {surface.label}
            </Link>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
