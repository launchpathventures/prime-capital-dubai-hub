/**
 * CATALYST - User Menu Component
 *
 * User avatar with dropdown menu for account actions.
 * Displays user name, role, and provides sign out.
 *
 * @see components/shared/signout.tsx for signout components with prefetch safety
 */

"use client"

import * as React from "react"
import { UserIcon, LogOutIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignoutMenuItem } from "@/components/shared/signout"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UserMenuUser {
  /** User's display name (defaults to "User" if empty) */
  name?: string
  /** User's email address */
  email?: string
  /** User's role or account type (e.g., "User", "Admin", "Guest") */
  role?: string
  /** URL to user's avatar image */
  avatarUrl?: string
}

interface UserMenuProps {
  /** User data to display (if undefined, shows as Guest) */
  user?: UserMenuUser
  /** Additional class names */
  className?: string
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const defaultUser: UserMenuUser = {
  name: "User",
  role: "Guest",
}

// -----------------------------------------------------------------------------
// Avatar Component (internal)
// -----------------------------------------------------------------------------

// Deterministic color based on user name
const avatarColors = [
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
]

function getAvatarColor(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return avatarColors[hash % avatarColors.length]
}

function UserAvatar({ 
  user, 
  size = "md" 
}: { 
  user: { name: string; avatarUrl?: string }
  size?: "sm" | "md" 
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
  }

  // Get initials from name
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size]
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium",
        getAvatarColor(user.name),
        sizeClasses[size]
      )}
    >
      {initials || <UserIcon className="h-4 w-4" />}
    </div>
  )
}

// -----------------------------------------------------------------------------
// User Menu Component
// -----------------------------------------------------------------------------

export function UserMenu({ user: userProp, className }: UserMenuProps) {
  // Merge with defaults for graceful fallback - ensure name is always defined
  const user = { 
    ...defaultUser, 
    ...userProp,
    name: userProp?.name || defaultUser.name || "User",
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "shared-user-menu",
          "flex items-center gap-2 rounded-full p-1 sm:pr-3",
          "hover:bg-muted/50 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "cursor-pointer",
          className
        )}
      >
        <UserAvatar user={user} size="sm" />
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-sm font-medium leading-tight">{user.name}</span>
          {user.role && (
            <span className="text-xs text-muted-foreground leading-tight">
              {user.role}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              {user.email && (
                <p className="text-xs text-foreground/70 truncate">
                  {user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<SignoutMenuItem />} variant="destructive">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
