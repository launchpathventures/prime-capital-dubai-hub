/**
 * CATALYST - Quiz Layout
 *
 * Wraps quiz pages in the LearnShell without sidebar.
 */

import { LearnShell } from "../_surface"
import { getLearnUser } from "@/lib/learning"

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getLearnUser()

  return <LearnShell user={user}>{children}</LearnShell>
}
