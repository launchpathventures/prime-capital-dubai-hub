/**
 * CATALYST - Web Route Group Layout
 *
 * Applies WebShell to all pages in the (web) route group.
 * This includes: landing page, login, register, and other public pages.
 *
 * NOTE: web.css contains marketing-specific styles (hero effects, bento grids).
 * Safe to remove if building an app-only project without a marketing site.
 */

import "./web.css"
import { WebShell } from "./_surface/web-shell"

export default function WebGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WebShell>{children}</WebShell>
}
