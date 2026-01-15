/**
 * CATALYST - Header Component
 *
 * A flexible header bar for all layout types.
 * Supports different configurations for web and app contexts.
 *
 * Variants:
 * - "web": Centered logo, nav links, and CTA (marketing style)
 * - "app": Mobile menu trigger, breadcrumbs, and actions (dashboard style)
 *
 * @example
 * // Web header with navigation
 * <Header variant="web">
 *   <Header.Logo />
 *   <Header.Nav items={navItems} />
 *   <Header.Actions>
 *     <Button>Get Started</Button>
 *   </Header.Actions>
 * </Header>
 *
 * // App header with mobile trigger
 * <Header variant="app">
 *   <Header.MobileMenuTrigger onClick={openMenu} />
 *   <Header.Title>Dashboard</Header.Title>
 * </Header>
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { Row, Title } from "@/components/core"
import { HeaderPopoverProvider } from "@/components/shared/header-popover-context"
import { MenuIcon, PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Header Root
// -----------------------------------------------------------------------------

interface HeaderProps extends React.ComponentProps<"header"> {
  /**
   * Visual variant of the header.
   * - "web": Marketing/public pages (centered layout)
   * - "app": Dashboard/internal pages (left-aligned with mobile trigger)
   * @default "app"
   */
  variant?: "web" | "app"
  children?: React.ReactNode
}

function Header({ variant = "app", children, className, ...props }: HeaderProps) {
  return (
    <header
      data-slot="header"
      data-variant={variant}
      className={cn(
        "layout-header",
        "bg-background flex h-14 items-center border-b px-4",
        // Web variant: centered content with space between
        variant === "web" && "justify-between",
        // App variant: left-aligned content
        variant === "app" && "gap-4",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

// -----------------------------------------------------------------------------
// Header Mobile Menu Trigger (for app/docs layouts)
// -----------------------------------------------------------------------------

interface HeaderMobileMenuTriggerProps
  extends React.ComponentProps<"button"> {
  /**
   * Called when the menu trigger is clicked.
   */
  onMenuClick?: () => void
}

function HeaderMobileMenuTrigger({
  onMenuClick,
  className,
  ...props
}: HeaderMobileMenuTriggerProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="header-mobile-menu-trigger"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className={cn("-ml-2 md:hidden", className)}
            aria-label="Open menu"
            {...props}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        }
      />
      <TooltipContent>Open Menu <Kbd className="ml-1.5">Alt+M</Kbd></TooltipContent>
    </Tooltip>
  )
}

// -----------------------------------------------------------------------------
// Header Sidebar Toggle (for app/docs layouts — desktop collapse/expand)
// COMMON LAYOUT PATTERN: Consistent sidebar toggle across all sidebar layouts
// -----------------------------------------------------------------------------

interface HeaderSidebarToggleProps extends React.ComponentProps<"button"> {
  /**
   * Whether the sidebar is currently open.
   */
  isOpen?: boolean
  /**
   * Called when the toggle is clicked.
   */
  onToggle?: () => void
}

function HeaderSidebarToggle({
  isOpen = true,
  onToggle,
  className,
  ...props
}: HeaderSidebarToggleProps) {
  const label = isOpen ? "Close Menu" : "Open Menu"
  
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="header-sidebar-toggle"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("-ml-2 hidden md:inline-flex", className)}
            aria-label={label}
            {...props}
          >
            {isOpen ? (
              <PanelLeftCloseIcon className="h-5 w-5" />
            ) : (
              <PanelLeftIcon className="h-5 w-5" />
            )}
          </Button>
        }
      />
      <TooltipContent>{label} <Kbd className="ml-1.5">Alt+M</Kbd></TooltipContent>
    </Tooltip>
  )
}

// -----------------------------------------------------------------------------
// Header Title (for app/docs layouts)
// -----------------------------------------------------------------------------

interface HeaderTitleProps extends React.ComponentProps<"h1"> {
  children: React.ReactNode
}

function HeaderTitle({ children, className, ...props }: HeaderTitleProps) {
  return (
    <Title
      as="h1"
      size="h6"
      data-slot="header-title"
      className={className}
      {...props}
    >
      {children}
    </Title>
  )
}

// -----------------------------------------------------------------------------
// Header Nav (for web layout)
// -----------------------------------------------------------------------------

interface HeaderNavProps extends React.ComponentProps<"nav"> {
  children: React.ReactNode
}

function HeaderNav({ children, className, ...props }: HeaderNavProps) {
  return (
    <Row
      as="nav"
      gap="lg"
      data-slot="header-nav"
      className={cn("hidden items-center md:flex", className)}
      {...props}
    >
      {children}
    </Row>
  )
}

// -----------------------------------------------------------------------------
// Header Actions (CTA buttons, etc.)
// -----------------------------------------------------------------------------

interface HeaderActionsProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

function HeaderActions({ children, className, ...props }: HeaderActionsProps) {
  return (
    <HeaderPopoverProvider>
      <Row
        gap="sm"
        data-slot="header-actions"
        className={className}
        {...props}
      >
        {children}
      </Row>
    </HeaderPopoverProvider>
  )
}

// -----------------------------------------------------------------------------
// Exports (compound component pattern)
// -----------------------------------------------------------------------------

const HeaderNamespace = Object.assign(Header, {
  MobileMenuTrigger: HeaderMobileMenuTrigger,
  SidebarToggle: HeaderSidebarToggle,
  Title: HeaderTitle,
  Nav: HeaderNav,
  Actions: HeaderActions,
})

export { HeaderNamespace as Header }
