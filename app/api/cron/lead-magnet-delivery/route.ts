/**
 * CATALYST - Lead Magnet Delivery Retry Cron
 */

import { NextResponse } from "next/server"
import { retryPendingLeadMagnets } from "@/lib/lead-magnets/delivery"

function isAuthorised(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  return Boolean(secret && auth === `Bearer ${secret}`)
}

export async function GET(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    return NextResponse.json(await retryPendingLeadMagnets())
  } catch (error) {
    console.error("[Lead Magnet Delivery Cron] failed", error)
    return NextResponse.json({ error: "Retry failed" }, { status: 500 })
  }
}
