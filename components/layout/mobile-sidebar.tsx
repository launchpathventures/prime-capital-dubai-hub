/**
 * CATALYST - Mobile Sidebar Component
 *
 * Sheet-based sidebar for mobile viewports.
 * Uses the same visual structure as desktop Sidebar for consistency.
 *
 * COMMON LAYOUT PATTERN:
 * All sidebar layouts should use this for mobile instead of showing
 * the desktop sidebar. This ensures consistent mobile UX.
 *
 * @example
 * <MobileSidebar open={isMobile && isOpen} onOpenChange={setIsOpen}>
 *   <Sidebar.Header>
 *     <Logo />
 *   </Sidebar.Header>
 *   <Sidebar.Body>
 *     <CollapsibleSidebarNav items={navItems} />
 *   </Sidebar.Body>
 * </MobileSidebar>
 */

"use client"

import * as React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// MobileSidebar
// -----------------------------------------------------------------------------

interface MobileSidebarProps {
  /** Whether the mobile sidebar is open */
  open: boolean
  /** Called when open state changes */
  onOpenChange: (open: boolean) => void
  /** Sidebar content (use Sidebar.Header, Sidebar.Body, etc.) */
  children: React.ReactNode
  /** Additional class for the sheet content */
  className?: string
}

export function MobileSidebar({
  open,
  onOpenChange,
  children,
  className,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className={cn(
          "layout-mobile-sidebar",
          "bg-sidebar text-sidebar-foreground w-64 p-0",
          className
        )}
      >
        <div className="flex h-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
