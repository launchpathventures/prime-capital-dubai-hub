/**
 * CATALYST - Event Registration Kiosk: moved to the CRM (TopStreet AI Events, serviceos#1970)
 *
 * The kiosk now lives in the CRM, where an event's registrations, check-ins and walk-ins are recorded against the event and its
 * leads. Staff open the CRM's kiosk address on the iPad and type the event's code (Events → the event → Run the door). This old
 * address sends them there, so a bookmarked iPad still lands in the right place.
 */

import { redirect } from "next/navigation"
import { crmOrigin } from "@/lib/events/agentcrm-events"

export const dynamic = "force-dynamic"

export default function RegisterKioskPage() {
  redirect(`${crmOrigin() ?? "https://crm.primecapitaldubai.com"}/kiosk`)
}
