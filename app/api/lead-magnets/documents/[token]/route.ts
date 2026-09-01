/**
 * CATALYST - Durable Lead Magnet Document Link
 */

import { NextResponse } from "next/server"
import {
  createLeadMagnetAdminClient,
  LEAD_MAGNET_DOCUMENT_BUCKET,
} from "@/lib/lead-magnets/documents"

interface RouteContext {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params
  const client = createLeadMagnetAdminClient()
  if (!client) {
    return NextResponse.json({ error: "Not available" }, { status: 503 })
  }

  const { data: document, error } = await client
    .from("lead_magnet_documents")
    .select("storage_path, filename, content_type, expires_at")
    .eq("access_token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle()

  if (error || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const { data: blob, error: downloadError } = await client.storage
    .from(LEAD_MAGNET_DOCUMENT_BUCKET)
    .download(String(document.storage_path))

  if (downloadError || !blob) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  return new NextResponse(blob, {
    headers: {
      "Content-Type": String(document.content_type),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(String(document.filename))}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
