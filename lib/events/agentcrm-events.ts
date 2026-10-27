/**
 * CATALYST - Prime's published events, read from the CRM (TopStreet AI Events, serviceos#1970)
 *
 * The CRM is the one home for events: this site keeps no copy. It lists what the CRM publishes and links to each event page there.
 * The CRM's address comes from AGENTCRM_API_URL (the enquiry endpoint this site already posts to).
 */

export type PublishedEvent = {
  title: string
  url: string
  events: { name: string; date: string; venue: string | null; url: string }[]
}

export function crmOrigin(): string | null {
  const configured = process.env.AGENTCRM_API_URL || "https://crm.primecapitaldubai.com/api/public/enquiry"
  try {
    return new URL(configured).origin
  } catch {
    return null
  }
}

/**
 * The published events. The CRM is given four seconds; if it cannot answer, this throws, so a page refreshing in the background keeps
 * the last good list rather than replacing it with an empty one. While the site is being built there is no last list: it starts empty
 * and fills in at the first refresh.
 */
export async function publishedEvents(): Promise<PublishedEvent[]> {
  const origin = crmOrigin()
  if (!origin) return []
  try {
    const res = await fetch(`${origin}/api/public/events`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error(`The CRM answered ${res.status}`)
    const body = (await res.json()) as { events?: PublishedEvent[] }
    return Array.isArray(body.events) ? body.events : []
  } catch (error) {
    if (process.env.NEXT_PHASE === "phase-production-build") return []
    throw error
  }
}
