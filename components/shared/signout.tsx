/**
 * CATALYST - Signout Components
 *
 * Pre-configured signout components that handle the prefetch issue safely.
 *
 * ⚠️ WHY THESE EXIST
 * ------------------
 * Next.js <Link> components prefetch routes by default when they enter the
 * viewport. For the signout route, this would trigger logout unexpectedly!
 *
 * These components ensure prefetch={false} is always set, preventing the issue.
 * Use these instead of manually creating Links to /api/auth/signout.
 *
 * @see app/api/auth/signout/route.ts for server-side explanation
 * @see https://nextjs.org/docs/app/api-reference/components/link#prefetch
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { LogOutIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Signout Link (for menus/navigation)
// -----------------------------------------------------------------------------

interface SignoutLinkProps {
  /** Optional custom class name */
  className?: string
  /** Show icon before text (default: true) */
  showIcon?: boolean
  /** Custom label (default: "Sign out") */
  children?: React.ReactNode
}

/**
 * Safe signout link with prefetch disabled.
 * Use this in dropdowns, navigation menus, etc.
 *
 * Renders as an anchor tag styled for destructive action.
 */
export function SignoutLink({
  className,
  showIcon = true,
  children = "Sign out",
}: SignoutLinkProps) {
  return (
    <Link
      href="/api/auth/signout"
      prefetch={false} // CRITICAL: Prevents prefetch from triggering logout!
      className={cn(
        "signout-link",
        "inline-flex items-center gap-2 text-destructive",
        "hover:text-destructive/80 transition-colors",
        className
      )}
    >
      {showIcon && <LogOutIcon className="h-4 w-4" />}
      {children}
    </Link>
  )
}

// -----------------------------------------------------------------------------
// Signout Menu Item (for DropdownMenu render prop)
// -----------------------------------------------------------------------------

interface SignoutMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Children passed from DropdownMenuItem */
  children?: React.ReactNode
}

/**
 * Safe signout link for use with DropdownMenuItem's render prop.
 * Accepts children and props from the parent DropdownMenuItem.
 *
 * @example
 * <DropdownMenuItem render={<SignoutMenuItem />} variant="destructive">
 *   <LogOutIcon className="mr-2 h-4 w-4" />
 *   Sign out
 * </DropdownMenuItem>
 */
export function SignoutMenuItem({ children, ...props }: SignoutMenuItemProps) {
  return (
    <Link
      href="/api/auth/signout"
      prefetch={false} // CRITICAL: Prevents prefetch from triggering logout!
      {...props}
    >
      {children}
    </Link>
  )
}

// -----------------------------------------------------------------------------
// Signout Button (for standalone buttons)
// -----------------------------------------------------------------------------

interface SignoutButtonProps {
  /** Optional custom class name */
  className?: string
  /** Button variant styling */
  variant?: "default" | "outline" | "ghost"
  /** Button size */
  size?: "sm" | "md" | "lg"
  /** Show icon before text (default: true) */
  showIcon?: boolean
  /** Custom label (default: "Sign out") */
  children?: React.ReactNode
}

/**
 * Safe signout button with prefetch disabled.
 * Use this for standalone signout buttons (e.g., settings page).
 *
 * Renders as a Link styled as a button with destructive theme.
 */
export function SignoutButton({
  className,
  variant = "default",
  size = "md",
  showIcon = true,
  children = "Sign out",
}: SignoutButtonProps) {
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base",
  }

  const variantClasses = {
    default: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-destructive text-destructive hover:bg-destructive/10",
    ghost: "text-destructive hover:bg-destructive/10",
  }

  return (
    <Link
      href="/api/auth/signout"
      prefetch={false} // CRITICAL: Prevents prefetch from triggering logout!
      className={cn(
        "signout-button",
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon && <LogOutIcon className="h-4 w-4" />}
      {children}
    </Link>
  )
}
