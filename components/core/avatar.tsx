/**
 * CATALYST - Avatar Component
 *
 * User avatar with initials and gradient background.
 * Use for user profiles, team members, comments, etc.
 *
 * Note: For image avatars, use shadcn's Avatar component from ui/.
 * This component is specifically for initial-based avatars with gradients.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-[10px]",
        sm: "w-7 h-7 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
      },
      gradient: {
        rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
        emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
        blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      },
    },
    defaultVariants: {
      size: "md",
      gradient: "blue",
    },
  }
)

// Gradient options for programmatic selection
export const avatarGradients = [
  "rose",
  "emerald", 
  "violet",
  "amber",
  "cyan",
  "blue",
  "slate",
] as const

export type AvatarGradient = (typeof avatarGradients)[number]

/**
 * Get a consistent gradient based on a string (name, email, id)
 * Returns the same gradient for the same input
 */
export function getAvatarGradient(str: string): AvatarGradient {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarGradients.length
  return avatarGradients[index]
}

/**
 * Get initials from a name (e.g., "Sarah Chen" -> "SC", "Mike" -> "M")
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join("")
    .toUpperCase()
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Name to derive initials from */
  name?: string
  /** Override initials (if not using name) */
  initials?: string
  /** Custom gradient class (overrides gradient prop) */
  gradientClass?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, gradient, name, initials, gradientClass, ...props }, ref) => {
    const displayInitials = initials || (name ? getInitials(name) : "?")
    const autoGradient = name ? getAvatarGradient(name) : gradient
    
    return (
      <div
        ref={ref}
        className={cn(
          "core-avatar",
          avatarVariants({ size, gradient: gradientClass ? undefined : autoGradient }),
          gradientClass,
          className
        )}
        {...props}
      >
        {displayInitials}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
