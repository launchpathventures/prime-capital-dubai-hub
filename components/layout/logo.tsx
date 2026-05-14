/**
 * CATALYST - Logo Component
 *
 * Displays the Prime Capital brand mark.
 * Used in sidebar headers and web navigation.
 * Supports light variant for transparent header overlays.
 *
 * @example
 * <Logo />
 * <Logo variant="light" />
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Logo Component
// -----------------------------------------------------------------------------

interface LogoProps extends React.ComponentProps<"a"> {
  /**
   * Visual variant of the logo.
   * - "default": Dark logo for light backgrounds
   * - "light": Light logo for dark/transparent backgrounds
   * @default "default"
   */
  variant?: "default" | "light"
  /**
   * Size variant of the logo.
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
}

function Logo({
  variant = "default",
  size = "default",
  className,
  ...props
}: LogoProps) {
  const logoSrc = variant === "light" ? "/logo-light.svg" : "/logo.svg"
  
  const heights = {
    sm: 40,
    default: 56,
    lg: 72,
  }
  
  return (
    <Link
      href="/"
      data-slot="logo"
      className={cn(
        "layout-logo",
        "flex items-center",
        className
      )}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Prime Capital"
        loading="eager"
        fetchPriority="high"
        style={{ 
          height: `${heights[size]}px`,
          width: "auto",
          transition: "all 0.3s cubic-bezier(0, 0, 0.2, 1)",
        }}
      />
    </Link>
  )
}

export { Logo }
