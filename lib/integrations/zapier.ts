/**
 * CATALYST - Zapier Webhook Integration
 *
 * Fire-and-forget webhook utility for triggering Zapier automations.
 * Non-blocking — failures are logged but never prevent the calling action.
 */

/**
 * Trigger a Zapier webhook with event data.
 * Silently skips if ZAPIER_WEBHOOK_URL is not configured.
 */
export async function triggerZapierWebhook(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, timestamp: new Date().toISOString(), ...data }),
    })
  } catch (error) {
    // Non-blocking — log but don't throw
    console.error(`Zapier webhook failed for event "${event}":`, error)
  }
}
