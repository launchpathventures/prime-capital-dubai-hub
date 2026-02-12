/**
 * CATALYST - App Client Providers
 *
 * Route-group level client providers for features that need browser runtime:
 * - Theme switching
 * - Toast notifications
 * - URL-driven auth toasts
 */

"use client"

import { Suspense } from "react"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { UrlToast } from "@/components/shared/url-toast"

interface AppClientProvidersProps {
  children: React.ReactNode
  showUrlToast?: boolean
}

export function AppClientProviders({
  children,
  showUrlToast = true,
}: AppClientProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
        {showUrlToast && (
          <Suspense fallback={null}>
            <UrlToast />
          </Suspense>
        )}
      </ToastProvider>
    </ThemeProvider>
  )
}

