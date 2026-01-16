/**
 * CATALYST - Learn Route Group Layout
 *
 * Root layout for the learn route group.
 * Renders a persistent shell (header + sidebar) so only
 * content refreshes during navigation.
 *
 * AUTH:
 * - /learn routes should be protected (learner or admin role)
 * - Shell fetches user data for header menu
 */

import "./learn.css"
import { LearnLayoutShell } from "./_surface/learn-layout-shell"

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

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LearnLayoutShell>
      {children}
    </LearnLayoutShell>
  )
}
