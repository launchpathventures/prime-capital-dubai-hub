/**
 * CATALYST - Certificate Server Actions
 *
 * Server actions for issuing and managing completion certificates.
 * Eligibility is checked dynamically — never hardcoded.
 */

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { config } from "@/lib/config"
import { trackActionError } from "@/lib/error-tracking"
import { triggerZapierWebhook } from "@/lib/integrations/zapier"
import type { CertificateEligibility, CertificateWithProfile } from "@/lib/learning-types"

// =============================================================================
// Types
// =============================================================================

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// =============================================================================
// Eligibility Check
// =============================================================================

/**
 * Check whether a user is eligible for a completion certificate.
 * All counts are queried dynamically from the database.
 */
export async function checkCertificateEligibility(
  userId?: string
): Promise<CertificateEligibility> {
  const supabase = await createClient()

  // Use provided userId or current user
  let targetUserId = userId
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { eligible: false, modulesCompleted: 0, totalModules: 0, quizzesPassed: 0, totalQuizzes: 0 }
    }
    targetUserId = user.id
  }

  // Dynamic total modules count
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })

  // User's completed modules
  const { count: modulesCompleted } = await supabase
    .from("learning_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserId)
    .eq("status", "completed")

  // Dynamic total quizzes count
  const { count: totalQuizzes } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true })

  // User's passed quizzes (deduplicated by quiz_slug)
  const { data: passedAttempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_slug, module_id")
    .eq("user_id", targetUserId)
    .eq("passed", true)

  // Deduplicate by quiz_slug (preferred) or module_id
  const passedSet = new Set<string>()
  for (const attempt of passedAttempts || []) {
    const key = attempt.quiz_slug || attempt.module_id
    if (key) passedSet.add(key)
  }
  const quizzesPassed = passedSet.size

  const safeTotal = totalModules || 0
  const safeCompleted = modulesCompleted || 0
  const safeTotalQuizzes = totalQuizzes || 0

  const eligible =
    safeTotal > 0 &&
    safeCompleted >= safeTotal &&
    safeTotalQuizzes > 0 &&
    quizzesPassed >= safeTotalQuizzes

  return {
    eligible,
    modulesCompleted: safeCompleted,
    totalModules: safeTotal,
    quizzesPassed,
    totalQuizzes: safeTotalQuizzes,
  }
}

// =============================================================================
// Issue Certificate
// =============================================================================

/**
 * Issue a completion certificate to the current user.
 * Checks eligibility, prevents duplicates, fires webhook.
 */
export async function issueCertificate(): Promise<ActionResult<CertificateWithProfile>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check for existing active certificate
    const { data: existing } = await supabase
      .from("completion_certificates")
      .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
      .eq("user_id", user.id)
      .is("revoked_at", null)
      .limit(1)
      .single()

    if (existing) {
      return {
        success: true,
        data: {
          id: existing.id,
          certificateId: existing.certificate_id,
          userId: existing.user_id,
          issuedAt: existing.issued_at,
          revokedAt: existing.revoked_at,
          revokedBy: existing.revoked_by,
          revokeReason: existing.revoke_reason,
          modulesCompleted: existing.modules_completed,
          quizzesPassed: existing.quizzes_passed,
          courseName: existing.course_name,
          createdAt: existing.created_at,
          fullName: existing.user_profiles?.full_name || "Unknown",
        },
      }
    }

    // Check eligibility
    const eligibility = await checkCertificateEligibility(user.id)
    if (!eligibility.eligible) {
      return {
        success: false,
        error: `Not eligible. Completed ${eligibility.modulesCompleted}/${eligibility.totalModules} modules and ${eligibility.quizzesPassed}/${eligibility.totalQuizzes} quizzes.`,
      }
    }

    // Generate certificate ID: PCD-{YEAR}-{NNNN}
    // Count existing certificates to determine next number
    const { count: existingCount } = await supabase
      .from("completion_certificates")
      .select("*", { count: "exact", head: true })

    const seqNum = (existingCount || 0) + 1
    const year = new Date().getFullYear()
    const certificateId = `PCD-${year}-${String(seqNum).padStart(4, "0")}`

    // Get user profile for name
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    // Insert certificate
    const { data: cert, error: insertError } = await supabase
      .from("completion_certificates")
      .insert({
        certificate_id: certificateId,
        user_id: user.id,
        modules_completed: eligibility.modulesCompleted,
        quizzes_passed: eligibility.quizzesPassed,
        course_name: config.learning.courseName,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Fire Zapier webhook (non-blocking)
    triggerZapierWebhook("certificate_issued", {
      learnerName: profile?.full_name || "Unknown",
      learnerEmail: user.email,
      certificateId,
      certificateUrl: `${config.app.url}/certificate/${certificateId}`,
      modulesCompleted: eligibility.modulesCompleted,
      quizzesPassed: eligibility.quizzesPassed,
    })

    revalidatePath("/learn")
    revalidatePath("/learn/certification")
    revalidatePath("/learn/admin/certification")

    return {
      success: true,
      data: {
        id: cert.id,
        certificateId: cert.certificate_id,
        userId: cert.user_id,
        issuedAt: cert.issued_at,
        revokedAt: cert.revoked_at,
        revokedBy: cert.revoked_by,
        revokeReason: cert.revoke_reason,
        modulesCompleted: cert.modules_completed,
        quizzesPassed: cert.quizzes_passed,
        courseName: cert.course_name,
        createdAt: cert.created_at,
        fullName: profile?.full_name || "Unknown",
      },
    }
  } catch (error) {
    trackActionError(error, "issueCertificate")
    return { success: false, error: "Failed to issue certificate" }
  }
}

// =============================================================================
// Revoke Certificate (Admin)
// =============================================================================

/**
 * Revoke a completion certificate. Admin only.
 */
export async function revokeCertificate(
  certificateId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Admin access required" }
    }

    const { error } = await supabase
      .from("completion_certificates")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: user.id,
        revoke_reason: reason,
      })
      .eq("certificate_id", certificateId)

    if (error) throw error

    revalidatePath("/learn/admin/certification")
    return { success: true, data: undefined }
  } catch (error) {
    trackActionError(error, "revokeCertificate", { certificateId })
    return { success: false, error: "Failed to revoke certificate" }
  }
}
