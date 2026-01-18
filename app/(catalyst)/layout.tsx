/**
 * CATALYST - Catalyst Route Group Layout
 *
 * Applies CatalystShell to all pages in the (catalyst) route group.
 * Public by default with noindex to keep out of search engines.
 */

import "./catalyst.css"
import type { Metadata } from "next"
import { CatalystShell } from "./_surface/catalyst-shell"

export const metadata: Metadata = {
  title: "Catalyst",
  description: "Project status and briefs dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CatalystGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CatalystShell>{children}</CatalystShell>
}
