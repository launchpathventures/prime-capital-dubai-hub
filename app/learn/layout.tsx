/**
 * CATALYST - Learn Route Group Layout
 *
 * Root layout for the learn route group.
 * Imports learn.css for surface-specific styles.
 * Each page renders its own LearnShell with appropriate configuration.
 *
 * AUTH:
 * - /learn routes should be protected (learner or admin role)
 * - Individual pages handle user data fetching for shell
 */

import "./learn.css"

// Force dynamic rendering - these routes use cookies for auth
export const dynamic = "force-dynamic"

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata = {
  title: "Learning Portal | Prime Capital Dubai",
  description: "Prime Capital Dubai agent training and certification platform",
}

// -----------------------------------------------------------------------------
// Layout Component
// -----------------------------------------------------------------------------

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
