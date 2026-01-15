/**
 * CATALYST - Admin Feedback List
 *
 * View and manage all feedback submissions.
 * Filter by status and type, update status, export to Markdown.
 */

import { Suspense } from "react"
import { Stack, Row, Title, Text } from "@/components/core"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FeedbackFilters } from "./feedback-filters"
import { FeedbackList } from "./feedback-list"
import { LearnShell } from "@/app/learn/_surface"

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>
}) {
  const supabase = await createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login?redirectTo=/learn/admin/feedback")
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/learn")
  }

  const params = await searchParams

  return (
    <LearnShell
      user={{ name: profile?.full_name || user.email || "Admin", role: "admin" }}
      activeSection="admin-feedback"
      userRole="admin"
    >
      <Stack gap="lg" className="p-6 max-w-5xl mx-auto">
        <div>
          <Title size="h1">Content Feedback</Title>
          <Text variant="muted">
            Review and manage feedback from learners
          </Text>
        </div>

        <FeedbackFilters />

        <Suspense
          fallback={
            <div className="text-center py-12 text-muted-foreground">
              Loading feedback...
            </div>
          }
        >
          <FeedbackList
            status={params.status}
            type={params.type}
          />
        </Suspense>
      </Stack>
    </LearnShell>
  )
}
