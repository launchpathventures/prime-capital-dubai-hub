/**
 * CATALYST - Logo Component
 *
 * Displays the Catalyst brand mark.
 * Used in sidebar headers and web navigation.
 *
 * @example
 * <Logo />
 * <Logo size="sm" />
 * <Logo showText={false} />
 */

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ZapIcon } from "lucide-react"
import { Row, Text } from "@/components/core"

// -----------------------------------------------------------------------------
// Logo Component
// -----------------------------------------------------------------------------

interface LogoProps extends React.ComponentProps<"a"> {
  /**
   * Size variant of the logo.
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  /**
   * Whether to show the text beside the icon.
   * @default true
   */
  showText?: boolean
}

function Logo({
  size = "default",
  showText = true,
  className,
  ...props
}: LogoProps) {
  return (
    <Link
      href="/"
      data-slot="logo"
      className={cn(
        "layout-logo",
        "flex items-center gap-2 font-semibold",
        size === "sm" && "text-sm",
        size === "default" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
      {...props}
    >
      {/* Icon mark */}
      <div
        className={cn(
          "bg-primary text-primary-foreground flex items-center justify-center rounded-md",
          size === "sm" && "h-6 w-6",
          size === "default" && "h-7 w-7",
          size === "lg" && "h-8 w-8"
        )}
      >
        <ZapIcon
          className={cn(
            size === "sm" && "h-3.5 w-3.5",
            size === "default" && "h-4 w-4",
            size === "lg" && "h-5 w-5"
          )}
        />
      </div>

      {/* Text */}
      {showText && <Text as="span" weight="semibold">Catalyst</Text>}
    </Link>
  )
}

export { Logo }
