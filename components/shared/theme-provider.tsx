/**
 * CATALYST - Theme Provider
 *
 * Wraps the app with next-themes ThemeProvider for dark mode support.
 * Uses class-based theming to work with Tailwind's .dark class.
 *
 * @source next-themes v0.4.x
 * @customised No — standard wrapper
 */

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
