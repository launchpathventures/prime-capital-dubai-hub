/**
 * CATALYST - Learn Route Group Layout
 *
 * Applies LearnShell to all pages in the learn route group.
 *
 * AUTH:
 * - /learn routes should be protected (learner or admin role)
 * - User will always be authenticated when this layout renders
 */

import "./learn.css"
import { LearnShell } from "./_surface"

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
  return <LearnShell>{children}</LearnShell>
}
