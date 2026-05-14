/**
 * CATALYST - useTahirHref
 *
 * Local-dev safety net for the Tahir surface. When the visitor reaches
 * the site via the production hostname (tahirmajithia.com), proxy.ts
 * silently rewrites /about → /tahir/about and links can stay as bare
 * paths. When the visitor reaches it via the subdirectory on localhost
 * (/tahir, /tahir/about, …), the same bare paths would jump into the
 * Prime Capital surface. This hook detects the current mode from the
 * visible pathname and returns a builder that keeps internal links
 * inside the Tahir surface.
 */

"use client"

import { usePathname } from "next/navigation"

const TAHIR_PREFIX = "/tahir"

export function useTahirHref(): (path: string) => string {
  const pathname = usePathname() || ""
  const inSubdirectory =
    pathname === TAHIR_PREFIX || pathname.startsWith(`${TAHIR_PREFIX}/`)

  return (path: string) => {
    if (!path.startsWith("/") || path.startsWith("/tahir")) return path
    if (!inSubdirectory) return path
    return path === "/" ? TAHIR_PREFIX : `${TAHIR_PREFIX}${path}`
  }
}
