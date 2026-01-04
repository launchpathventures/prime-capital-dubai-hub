/**
 * CATALYST - Presentation Route Group Layout
 *
 * Applies base styles for all pages in the (present) route group.
 * Individual presentation pages handle their own layout composition.
 */

import "./present.css"

export default function PresentGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
