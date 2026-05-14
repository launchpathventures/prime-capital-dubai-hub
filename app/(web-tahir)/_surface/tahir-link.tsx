/**
 * CATALYST - Tahir Link
 *
 * Thin wrapper around next/link that runs the href through useTahirHref
 * so internal paths stay inside the Tahir surface when served from the
 * /tahir subdirectory (local dev / preview).
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { useTahirHref } from "./use-tahir-href"

type TahirLinkProps = React.ComponentProps<typeof Link>

export function TahirLink({ href, ...rest }: TahirLinkProps) {
  const buildHref = useTahirHref()
  const resolved = typeof href === "string" ? buildHref(href) : href
  return <Link href={resolved} {...rest} />
}
