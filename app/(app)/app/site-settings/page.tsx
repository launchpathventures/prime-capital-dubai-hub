/**
 * CATALYST - Site Settings Admin Page
 *
 * Configuration for site-wide settings and feature flags.
 * Full CRUD with Supabase.
 */

import { getSiteSettingsFromDb } from "@/lib/actions/cms"
import { SiteSettingsClient } from "./site-settings-client"

export const metadata = {
  title: "Site Settings | Admin",
}

export default async function SiteSettingsPage() {
  const result = await getSiteSettingsFromDb()
  const settings = result.success ? result.data : []

  return <SiteSettingsClient settings={settings} />
}
