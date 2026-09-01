/**
 * CATALYST - Lead Magnet Document Storage
 */

import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "node:crypto"
import {
  ALLOWED_DOCUMENT_TYPES,
  LEAD_MAGNET_DOCUMENT_BUCKET,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENTS_PER_SUBMISSION,
} from "@/lib/lead-magnets/constants"

export {
  LEAD_MAGNET_DOCUMENT_BUCKET,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENTS_PER_SUBMISSION,
}
export const ALLOWED_DOCUMENT_TYPE_SET = new Set<string>(
  ALLOWED_DOCUMENT_TYPES,
)

export interface LeadMagnetDocument {
  url: string
  filename: string
  contentType: string
  sizeBytes: number
}

export function createLeadMagnetAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function safeFilename(filename: string) {
  const cleaned = filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-120)
  return cleaned || "document"
}

export interface PreparedLeadMagnetDocument extends LeadMagnetDocument {
  uploadPath: string
  uploadToken: string
}

export async function prepareLeadMagnetDocument(
  file: { name: string; type: string; size: number },
  submissionId: string,
  origin: string,
): Promise<PreparedLeadMagnetDocument> {
  const client = createLeadMagnetAdminClient()
  if (!client) throw new Error("Document storage is not configured")

  const documentId = randomUUID()
  const path = `${submissionId}/${documentId}-${safeFilename(file.name)}`
  const { data: upload, error: uploadError } = await client.storage
    .from(LEAD_MAGNET_DOCUMENT_BUCKET)
    .createSignedUploadUrl(path)

  if (uploadError || !upload) {
    throw new Error(uploadError?.message || "Could not prepare document upload")
  }

  const accessToken = randomUUID()
  const { error: metadataError } = await client
    .from("lead_magnet_documents")
    .insert({
      submission_id: submissionId,
      access_token: accessToken,
      storage_path: path,
      filename: file.name,
      content_type: file.type,
      size_bytes: file.size,
    })

  if (metadataError) {
    await client.storage.from(LEAD_MAGNET_DOCUMENT_BUCKET).remove([path])
    throw new Error(metadataError.message)
  }

  return {
    url: `${origin}/api/lead-magnets/documents/${accessToken}`,
    filename: file.name,
    contentType: file.type,
    sizeBytes: file.size,
    uploadPath: path,
    uploadToken: upload.token,
  }
}
