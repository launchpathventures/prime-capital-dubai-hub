/**
 * CATALYST - Auth Card
 *
 * Shared card wrapper for auth pages providing:
 * - Consistent header with logo
 * - Consistent footer with vendor attribution
 * - Flexible middle content via children
 *
 * Pages can use this for a consistent auth card layout,
 * or skip it entirely for custom layouts (e.g., success pages).
 */

import * as React from "react"
import { Logo } from "@/components/layout/logo"
import { Text } from "@/components/core"
import { config } from "@/lib/config"

// -----------------------------------------------------------------------------
// AuthCard Component
// -----------------------------------------------------------------------------

interface AuthCardProps {
  /** Card content */
  children: React.ReactNode
  /** Hide the logo header */
  hideLogo?: boolean
  /** Hide the vendor footer */
  hideFooter?: boolean
  /** Additional class names */
  className?: string
}

export function AuthCard({ 
  children, 
  hideLogo = false,
  hideFooter = false,
  className,
}: AuthCardProps) {
  return (
    <div className={`auth-card ${className ?? ""}`}>
      {/* Logo header */}
      {!hideLogo && (
        <div className="auth-card-logo">
          <Logo />
        </div>
      )}

      {/* Main content */}
      <div className="auth-card-content">
        {children}
      </div>

      {/* Vendor footer */}
      {!hideFooter && (
        <footer className="auth-card-footer">
          <Text size="xs" variant="muted">
            {config.app.name} by{" "}
            <a 
              href={config.vendor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {config.vendor.name}
            </a>
          </Text>
        </footer>
      )}
    </div>
  )
}
