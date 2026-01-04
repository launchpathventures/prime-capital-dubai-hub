/**
 * CATALYST - Shell Layout Component
 *
 * A flexible container with explicit slots for building layouts.
 * Provides the structural foundation for Web, App, and Docs layouts.
 *
 * Slots:
 * - Shell.Sidebar: Optional sidebar (left or right positioned)
 * - Shell.Header: Top header bar
 * - Shell.Content: Main content area
 *
 * @example
 * <Shell>
 *   <Shell.Sidebar position="left">...</Shell.Sidebar>
 *   <Shell.Header>...</Shell.Header>
 *   <Shell.Content>...</Shell.Content>
 * </Shell>
 */

import * as React from "react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Shell Root
// -----------------------------------------------------------------------------

interface ShellProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div
      data-slot="shell"
      className={cn("layout-shell", "flex h-screen w-full overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Shell Sidebar
// -----------------------------------------------------------------------------

interface ShellSidebarProps extends React.ComponentProps<"aside"> {
  /**
   * Position of the sidebar. Determines flex order and border placement.
   * @default "left"
   */
  position?: "left" | "right"
  children: React.ReactNode
}

function ShellSidebar({
  position = "left",
  children,
  className,
  ...props
}: ShellSidebarProps) {
  return (
    <aside
      data-slot="shell-sidebar"
      data-position={position}
      className={cn(
        "layout-shell__sidebar",
        // Base styles
        "bg-sidebar text-sidebar-foreground hidden w-64 flex-col md:flex",
        // Position-based ordering and borders
        position === "left" && "order-first border-r",
        position === "right" && "order-last border-l",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// -----------------------------------------------------------------------------
// Shell Header
// -----------------------------------------------------------------------------

interface ShellHeaderProps extends React.ComponentProps<"header"> {
  children?: React.ReactNode
}

function ShellHeader({ children, className, ...props }: ShellHeaderProps) {
  return (
    <header
      data-slot="shell-header"
      className={cn(
        "layout-shell__header",
        "bg-background border-b px-4 py-3 md:px-6",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

// -----------------------------------------------------------------------------
// Shell Content
// -----------------------------------------------------------------------------

interface ShellContentProps extends React.ComponentProps<"main"> {
  children: React.ReactNode
}

function ShellContent({ children, className, ...props }: ShellContentProps) {
  return (
    <main
      data-slot="shell-content"
      className={cn("layout-shell__content", "flex-1 overflow-auto scroll-smooth", className)}
      {...props}
    >
      {children}
    </main>
  )
}

// -----------------------------------------------------------------------------
// Shell Body (wrapper for header + content when sidebar is present)
// -----------------------------------------------------------------------------

interface ShellBodyProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function ShellBody({ children, className, ...props }: ShellBodyProps) {
  return (
    <div
      data-slot="shell-body"
      className={cn("layout-shell__body", "flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Exports (compound component pattern)
// -----------------------------------------------------------------------------

const ShellNamespace = Object.assign(Shell, {
  Sidebar: ShellSidebar,
  Header: ShellHeader,
  Content: ShellContent,
  Body: ShellBody,
})

export { ShellNamespace as Shell }
