/**
 * CATALYST - Root Redirect
 * 
 * Temporary redirect to Learn surface.
 * TODO: Change back to web homepage when website launches.
 */

import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/learn")
}
