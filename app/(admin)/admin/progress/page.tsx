/**
 * CATALYST - Progress Redirect
 *
 * Redirects to the unified team page which now handles
 * user management, roles, and learning progress.
 */

import { redirect } from "next/navigation"

export default function AdminProgressRedirect() {
  redirect("/admin/team")
}
