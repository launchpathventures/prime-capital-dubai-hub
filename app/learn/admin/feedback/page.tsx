/**
 * CATALYST - Admin Feedback Page
 *
 * View and manage all feedback submissions.
 * Filter by status and type, update status, export to Markdown.
 */

import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FeedbackFilters } from "./feedback-filters"
import { FeedbackList } from "./feedback-list"
import { LearnShell } from "@/app/learn/_surface"
import {
  MessageSquareIcon,
  AlertCircleIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react"

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

  // Get feedback counts for stats
  const { count: totalCount } = await supabase
    .from("lms_feedback")
    .select("*", { count: "exact", head: true })

  const { count: newCount } = await supabase
    .from("lms_feedback")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { count: inProgressCount } = await supabase
    .from("lms_feedback")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress")

  const { count: moduleCount } = await supabase
    .from("lms_feedback")
    .select("*", { count: "exact", head: true })
    .eq("feedback_type", "module")

  return (
    <LearnShell
      user={{ name: profile?.full_name || user.email || "Admin", role: "admin" }}
      activeSection="admin-feedback"
      userRole="admin"
    >
      <div className="learn-content">
        {/* Header */}
        <div className="cert-admin-header">
          <div>
            <h1 className="cert-admin-title">Content Feedback</h1>
            <p className="cert-admin-subtitle">
              Review and manage feedback from learners
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="cert-admin-stats">
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon">
              <MessageSquareIcon className="h-5 w-5" />
            </div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{totalCount || 0}</span>
              <span className="cert-admin-stat__label">Total Feedback</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon">
              <AlertCircleIcon className="h-5 w-5" />
            </div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{newCount || 0}</span>
              <span className="cert-admin-stat__label">New</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{inProgressCount || 0}</span>
              <span className="cert-admin-stat__label">In Progress</span>
            </div>
          </div>
          <div className="cert-admin-stat">
            <div className="cert-admin-stat__icon">
              <FileTextIcon className="h-5 w-5" />
            </div>
            <div className="cert-admin-stat__content">
              <span className="cert-admin-stat__value">{moduleCount || 0}</span>
              <span className="cert-admin-stat__label">Module-Specific</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FeedbackFilters />

        {/* Feedback List */}
        <section className="cert-admin-section" style={{ marginTop: "1.5rem" }}>
          <Suspense
            fallback={
              <div className="feedback-empty">
                <div className="feedback-empty__icon">
                  <ClockIcon className="h-6 w-6 animate-pulse" />
                </div>
                <p className="feedback-empty__title">Loading feedback...</p>
              </div>
            }
          >
            <FeedbackList status={params.status} type={params.type} />
          </Suspense>
        </section>
      </div>
    </LearnShell>
  )
}
