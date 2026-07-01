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

interface IssueCertificateForUserOptions {
  userId: string
  userEmail?: string | null
}

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
    safeCompleted >= safeTotal

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

    return await issueCertificateForUser({
      userId: user.id,
      userEmail: user.email,
    })
  } catch (error) {
    trackActionError(error, "issueCertificate")
    return { success: false, error: "Failed to issue certificate" }
  }
}

/**
 * Issue a completion certificate for a specific user.
 * Used by module/quiz completion so certificates are created automatically.
 */
export async function issueCertificateForUser({
  userId,
  userEmail,
}: IssueCertificateForUserOptions): Promise<ActionResult<CertificateWithProfile>> {
  try {
    const supabase = await createClient()

    // Check for existing active certificate first so completion hooks are idempotent.
    const { data: existing } = await supabase
      .from("completion_certificates")
      .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .limit(1)
      .single()

    if (existing) {
      return {
        success: true,
        data: mapCertificateActionRow(existing),
      }
    }

    const eligibility = await checkCertificateEligibility(userId)
    if (!eligibility.eligible) {
      return {
        success: false,
        error: `Not eligible. Completed ${eligibility.modulesCompleted}/${eligibility.totalModules} modules and ${eligibility.quizzesPassed}/${eligibility.totalQuizzes} quizzes.`,
      }
    }

    const { data: certificateId, error: seqError } = await supabase.rpc("generate_certificate_id")
    if (seqError || !certificateId) throw seqError ?? new Error("Failed to generate certificate ID")

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", userId)
      .single()

    const { data: cert, error: insertError } = await supabase
      .from("completion_certificates")
      .insert({
        certificate_id: certificateId,
        user_id: userId,
        modules_completed: eligibility.modulesCompleted,
        quizzes_passed: eligibility.quizzesPassed,
        course_name: config.learning.courseName,
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: racedExisting } = await supabase
          .from("completion_certificates")
          .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
          .eq("user_id", userId)
          .is("revoked_at", null)
          .limit(1)
          .single()

        if (racedExisting) {
          return {
            success: true,
            data: mapCertificateActionRow(racedExisting),
          }
        }
      }

      throw insertError
    }

    const certificateUrl = `${config.app.url}/certificate/${certificateId}`
    const certificatePdfUrl = `${config.app.url}/api/certificate/${certificateId}/pdf`

    triggerZapierWebhook("certificate_issued", {
      learnerName: profile?.full_name || "Unknown",
      learnerEmail: userEmail,
      recipientEmail: userEmail,
      certificateId,
      certificateUrl,
      certificatePdfUrl,
      modulesCompleted: eligibility.modulesCompleted,
      quizzesPassed: eligibility.quizzesPassed,
      courseName: config.learning.courseName,
      emailSubject: `Your ${config.app.name} completion certificate is ready`,
    })

    revalidatePath("/learn")
    revalidatePath("/learn", "layout")
    revalidatePath("/learn/certification")
    revalidatePath("/learn/progress")
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
    trackActionError(error, "issueCertificateForUser", { userId })
    return { success: false, error: "Failed to issue certificate" }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCertificateActionRow(row: any): CertificateWithProfile {
  return {
    id: row.id,
    certificateId: row.certificate_id,
    userId: row.user_id,
    issuedAt: row.issued_at,
    revokedAt: row.revoked_at,
    revokedBy: row.revoked_by,
    revokeReason: row.revoke_reason,
    modulesCompleted: row.modules_completed,
    quizzesPassed: row.quizzes_passed,
    courseName: row.course_name,
    createdAt: row.created_at,
    fullName: row.user_profiles?.full_name || "Unknown",
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
