/**
 * Admin Surface Root
 *
 * Redirects to the dashboard as the main entry point.
 */

import { redirect } from "next/navigation"

export default function AdminRootPage() {
  redirect("/admin/dashboard")
}
