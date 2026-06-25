/**
 * CATALYST - Kiosk Route Group Layout
 *
 * A deliberately chrome-free shell for full-screen kiosk surfaces (e.g. the
 * event registration iPad). No WebShell, no nav, no footer — the page owns
 * the entire viewport so a guest sees only the task in front of them.
 *
 * Self-contained: brings its own styles via kiosk.css. Delete this group to
 * remove every kiosk surface.
 */

import "./kiosk.css"
import type { Metadata } from "next"

// Kiosk pages are operational tools, never public content — keep them out of
// search results entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function KioskGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
