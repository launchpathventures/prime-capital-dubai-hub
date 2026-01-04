/**
 * CATALYST - Sidebar Component
 *
 * A composable sidebar for app and docs layouts.
 * Provides structure for logo, navigation, and footer sections.
 *
 * COMMON LAYOUT PATTERN:
 * Supports collapsible behavior on desktop via `isOpen` prop.
 * Mobile sidebar should use Sheet component (handled in layout).
 *
 * @example
 * <Sidebar position="left" isOpen={sidebarOpen}>
 *   <Sidebar.Header>
 *     <Logo />
 *   </Sidebar.Header>
 *   <Sidebar.Body>
 *     <CollapsibleSidebarNav items={navItems} />
 *   </Sidebar.Body>
 *   <Sidebar.Footer>
 *     <UserBadge />
 *   </Sidebar.Footer>
 * </Sidebar>
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Sidebar Root
// -----------------------------------------------------------------------------

interface SidebarProps extends React.ComponentProps<"aside"> {
  /**
   * Position of the sidebar. Passed to Shell.Sidebar for styling.
   * @default "left"
   */
  position?: "left" | "right"
  /**
   * Whether sidebar is visible (desktop only).
   * Mobile sidebar uses Sheet and doesn't need this.
   * @default true
   */
  isOpen?: boolean
  children: React.ReactNode
}

function Sidebar({
  position = "left",
  isOpen = true,
  children,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      data-slot="sidebar"
      data-position={position}
      data-open={isOpen}
      className={cn(
        "layout-sidebar",
        // Base styles — always hidden on mobile (Sheet handles mobile)
        "bg-sidebar text-sidebar-foreground hidden flex-col md:flex",
        // Height constraint for independent scroll
        "h-full min-h-0",
        // Width with transition for collapse animation
        "w-64 transition-[width,opacity] duration-200 ease-in-out",
        // Position-based ordering and borders
        position === "left" && "order-first border-r",
        position === "right" && "order-last border-l",
        // Allow custom width override
        className,
        // Collapsed state — must come AFTER className to override custom widths
        !isOpen && "!w-0 overflow-hidden opacity-0"
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// -----------------------------------------------------------------------------
// Sidebar Header (logo area)
// -----------------------------------------------------------------------------

interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("layout-sidebar__header", "flex h-14 items-center border-b px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Sidebar Body (navigation area, scrollable)
// -----------------------------------------------------------------------------

interface SidebarBodyProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function SidebarBody({ children, className, ...props }: SidebarBodyProps) {
  return (
    <div
      data-slot="sidebar-body"
      className={cn("layout-sidebar__body", "min-h-0 flex-1 overflow-auto px-3 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Sidebar Footer (user badge / actions area)
// -----------------------------------------------------------------------------

interface SidebarFooterProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("layout-sidebar__footer", "border-t px-3 py-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Exports (compound component pattern)
// -----------------------------------------------------------------------------

const SidebarNamespace = Object.assign(Sidebar, {
  Header: SidebarHeader,
  Body: SidebarBody,
  Footer: SidebarFooter,
})

export { SidebarNamespace as Sidebar }
