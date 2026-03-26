/**
 * CATALYST - Certificate Queries
 *
 * Server-side queries for completion certificates.
 * Includes public, authenticated, and admin query functions.
 */

import { createClient } from "@/lib/supabase/server"
import type { CertificateWithProfile, CompletionCertificate } from "@/lib/learning-types"

// =============================================================================
// Public Queries
// =============================================================================

/**
 * Get a certificate by its human-readable ID (e.g. "PCD-2026-0001").
 * Used for the public shareable certificate page — no auth required.
 */
export async function getCertificateByPublicId(
  certificateId: string
): Promise<CertificateWithProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("completion_certificates")
    .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
    .eq("certificate_id", certificateId)
    .single()

  if (error || !data) return null

  return mapCertificateRow(data)
}

// =============================================================================
// Authenticated Queries
// =============================================================================

/**
 * Get the current user's completion certificate (if any).
 */
export async function getMyCertificate(): Promise<CertificateWithProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("completion_certificates")
    .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null

  return mapCertificateRow(data)
}

// =============================================================================
// Admin Queries
// =============================================================================

/**
 * Get all issued certificates for admin dashboard.
 */
export async function getAllCertificates(): Promise<CertificateWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("completion_certificates")
    .select("*, user_profiles!completion_certificates_user_id_fkey(full_name)")
    .order("issued_at", { ascending: false })

  if (error || !data) return []

  return data.map(mapCertificateRow)
}

// =============================================================================
// Helpers
// =============================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCertificateRow(row: any): CertificateWithProfile {
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
