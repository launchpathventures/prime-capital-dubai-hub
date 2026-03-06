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
import { Suspense } from "react"
import type { Metadata } from "next"
import { WebShell } from "./_surface/web-shell"
import { BidPersistence } from "./_surface/bid-persistence"
import { Analytics } from "@vercel/analytics/next"

export const revalidate = 300

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
}

export default function WebGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <BidPersistence />
      </Suspense>
      <WebShell>{children}</WebShell>
      <Analytics debug={process.env.NODE_ENV === "development"} />
    </>
  )
}
