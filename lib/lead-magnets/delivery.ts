/**
 * CATALYST - Lead Magnet Delivery Queue
 *
 * Keeps gated-content and document-backed enquiries durable while AgentCRM is
 * unavailable. The queue is service-role only; public clients never see the
 * stored payload or delivery status.
 */

import { createClient } from "@supabase/supabase-js"

const AGENTCRM_API_URL =
  process.env.AGENTCRM_API_URL ||
  "https://crm.primecapitaldubai.com/api/public/enquiry"
const AGENTCRM_API_KEY = process.env.AGENTCRM_API_KEY
const MAX_ATTEMPTS = 12

export interface DeliveryResult {
  ok: boolean
  status: number
}

interface QueueInput {
  submissionId: string
  formMode: string
  payload: Record<string, unknown>
}

interface QueuedDelivery extends QueueInput {
  id: string
  attempts: number
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function nextAttemptAt(attempts: number) {
  const minutes = Math.min(2 ** Math.max(attempts, 0), 60 * 24)
  return new Date(Date.now() + minutes * 60_000).toISOString()
}

export async function sendAgentCrmPayload(
  payload: Record<string, unknown>,
  submissionId: string,
  formMode: string,
): Promise<DeliveryResult> {
  if (!AGENTCRM_API_KEY) {
    console.warn(
      `[Lead Magnet Delivery] AGENTCRM_API_KEY missing mode=${formMode} sub=${submissionId}`,
    )
    return { ok: false, status: 0 }
  }

  try {
    const response = await fetch(AGENTCRM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGENTCRM_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    })

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "")
      console.error(
        `[Lead Magnet Delivery] status=${response.status} mode=${formMode} sub=${submissionId} body=${responseBody.slice(0, 240)}`,
      )
    }

    return { ok: response.ok, status: response.status }
  } catch (error) {
    console.error(
      `[Lead Magnet Delivery] network mode=${formMode} sub=${submissionId} error=${error instanceof Error ? error.message : String(error)}`,
    )
    return { ok: false, status: 0 }
  }
}

export async function enqueueLeadMagnetDelivery(
  input: QueueInput,
): Promise<QueuedDelivery | null> {
  const client = createAdminClient()
  if (!client) return null

  const { data, error } = await client
    .from("lead_magnet_deliveries")
    .upsert(
      {
        submission_id: input.submissionId,
        form_mode: input.formMode,
        payload: input.payload,
        status: "pending",
        next_attempt_at: new Date().toISOString(),
      },
      { onConflict: "submission_id", ignoreDuplicates: true },
    )
    .select("id, submission_id, form_mode, payload, attempts")
    .maybeSingle()

  if (error) {
    console.error(
      `[Lead Magnet Delivery] queue failed sub=${input.submissionId} error=${error.message}`,
    )
    return null
  }

  if (data) {
    return {
      id: String(data.id),
      submissionId: String(data.submission_id),
      formMode: String(data.form_mode),
      payload: data.payload as Record<string, unknown>,
      attempts: Number(data.attempts || 0),
    }
  }

  const { data: existing, error: existingError } = await client
    .from("lead_magnet_deliveries")
    .select("id, submission_id, form_mode, payload, attempts")
    .eq("submission_id", input.submissionId)
    .maybeSingle()

  if (existingError || !existing) return null

  return {
    id: String(existing.id),
    submissionId: String(existing.submission_id),
    formMode: String(existing.form_mode),
    payload: existing.payload as Record<string, unknown>,
    attempts: Number(existing.attempts || 0),
  }
}

export async function deliverQueuedLeadMagnet(
  delivery: QueuedDelivery,
): Promise<DeliveryResult> {
  const result = await sendAgentCrmPayload(
    delivery.payload,
    delivery.submissionId,
    delivery.formMode,
  )
  const client = createAdminClient()
  if (!client) return result

  const attempts = delivery.attempts + 1
  const attemptedAt = new Date().toISOString()
  const status = result.ok
    ? "delivered"
    : attempts >= MAX_ATTEMPTS
      ? "exhausted"
      : "retrying"

  const { error } = await client
    .from("lead_magnet_deliveries")
    .update({
      attempts,
      status,
      last_status_code: result.status,
      last_attempt_at: attemptedAt,
      delivered_at: result.ok ? attemptedAt : null,
      next_attempt_at: result.ok ? null : nextAttemptAt(attempts),
      updated_at: attemptedAt,
    })
    .eq("id", delivery.id)

  if (error) {
    console.error(
      `[Lead Magnet Delivery] status update failed sub=${delivery.submissionId} error=${error.message}`,
    )
  }

  return result
}

export async function retryPendingLeadMagnets(limit = 25) {
  const client = createAdminClient()
  if (!client) return { processed: 0, delivered: 0, failed: 0 }

  const { data, error } = await client
    .from("lead_magnet_deliveries")
    .select("id, submission_id, form_mode, payload, attempts")
    .in("status", ["pending", "retrying"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)

  let delivered = 0
  let failed = 0
  for (const row of data || []) {
    const result = await deliverQueuedLeadMagnet({
      id: String(row.id),
      submissionId: String(row.submission_id),
      formMode: String(row.form_mode),
      payload: row.payload as Record<string, unknown>,
      attempts: Number(row.attempts || 0),
    })
    if (result.ok) delivered += 1
    else failed += 1
  }

  return { processed: data?.length || 0, delivered, failed }
}
