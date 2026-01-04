/**
 * CATALYST - Auth Shell
 *
 * Polished shell for authentication pages.
 * Features floating header (like presentations) and centered layout.
 *
 * Used by: (auth) route group
 */

import * as React from "react"
import { AuthHeader } from "./auth-header"

// -----------------------------------------------------------------------------
// AuthShell Component
// -----------------------------------------------------------------------------

interface AuthShellProps {
  children: React.ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="auth-shell auth-content">
      {/* Floating header (hidden by default, shows on hover/kbd) */}
      <AuthHeader />

      {/* Centered container */}
      <div className="auth-container">
        {/* Auth content (login form, etc.) */}
        {children}
      </div>
    </div>
  )
}
