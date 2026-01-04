/**
 * CATALYST - Docs Route Group Layout
 *
 * Applies DocsShell to all pages in the (docs) route group.
 * Visibility controlled by config.features.showDocsInProduction.
 *
 * This layout wraps: core (documentation), design, and components pages.
 */

import "./docs.css"
import { notFound } from "next/navigation"
import { DocsShell } from "./_surface/docs-shell"
import { isDocsEnabled } from "@/lib/config"

export default async function DocsGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if docs should be visible (always in dev, configurable in prod)
  if (!isDocsEnabled()) {
    notFound()
  }

  const docsPasswordEnabled = Boolean(process.env.DOCS_PASSWORD?.trim())

  return <DocsShell showLogout={docsPasswordEnabled}>{children}</DocsShell>
}
