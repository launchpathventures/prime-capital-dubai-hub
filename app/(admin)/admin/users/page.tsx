/**
 * CATALYST - Users Redirect
 *
 * Redirects to the unified team page.
 */

import { redirect } from "next/navigation"

export default function AdminUsersRedirect() {
  redirect("/admin/team")
}
