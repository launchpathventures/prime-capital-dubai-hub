/**
 * CATALYST - Admin Users Redirect
 *
 * Redirects to the progress page which is the single source of truth
 * for learner data (real database queries vs the old mock data).
 */

import { redirect } from "next/navigation"

export default function AdminUsersPage() {
  redirect("/admin/progress")
}
