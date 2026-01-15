/**
 * CATALYST - Admin Layout
 * 
 * Wraps admin pages with noindex robots directive.
 * Admin pages should not be indexed by search engines.
 */

import { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
