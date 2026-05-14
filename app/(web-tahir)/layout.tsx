/**
 * CATALYST - Tahir Route Group Layout
 *
 * Wraps every page on the tahirmajithia.com brand surface. Imports the
 * tahir.css token set and applies the TahirShell.
 *
 * URLs visitors see (e.g. tahirmajithia.com/about) are rewritten by
 * proxy.ts to /tahir/about, so route files live under tahir/* inside
 * this group.
 */

import "./tahir.css"
import type { Metadata } from "next"
import { TahirShell } from "./_surface/tahir-shell"
import { brands } from "@/lib/brand"

export const revalidate = 300

export const metadata: Metadata = {
  title: {
    default: brands.tahir.meta.title,
    template: `%s · ${brands.tahir.meta.title}`,
  },
  description: brands.tahir.meta.description,
  icons: {
    icon: [
      {
        url: brands.tahir.assets.favicon,
        type: "image/webp",
        sizes: "100x100",
      },
    ],
    shortcut: [
      {
        url: brands.tahir.assets.favicon,
        type: "image/webp",
        sizes: "100x100",
      },
    ],
    apple: [
      {
        url: brands.tahir.assets.favicon,
        type: "image/webp",
        sizes: "100x100",
      },
    ],
  },
}

export default function TahirGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TahirShell>{children}</TahirShell>
}
