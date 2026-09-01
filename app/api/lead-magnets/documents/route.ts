/**
 * CATALYST - Second Opinion Document Upload
 */

import { NextResponse } from "next/server"
import {
  ALLOWED_DOCUMENT_TYPE_SET,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_DOCUMENTS_PER_SUBMISSION,
  prepareLeadMagnetDocument,
} from "@/lib/lead-magnets/documents"
import { z } from "zod"

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const uploadRequestSchema = z.object({
  submissionId: z.string().regex(UUID_V4_REGEX),
  files: z
    .array(
      z.object({
        name: z.string().min(1).max(255),
        type: z.string().max(150),
        size: z.number().int().positive().max(MAX_DOCUMENT_SIZE_BYTES),
      }),
    )
    .min(1)
    .max(MAX_DOCUMENTS_PER_SUBMISSION),
})

export async function POST(request: Request) {
  try {
    const parsed = uploadRequestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    for (const file of parsed.data.files) {
      if (!ALLOWED_DOCUMENT_TYPE_SET.has(file.type)) {
        return NextResponse.json(
          { error: `${file.name} is not a supported file type.` },
          { status: 400 },
        )
      }
    }

    const origin = new URL(request.url).origin
    const uploads = []
    for (const file of parsed.data.files) {
      uploads.push(
        await prepareLeadMagnetDocument(
          file,
          parsed.data.submissionId,
          origin,
        ),
      )
    }

    return NextResponse.json({ uploads })
  } catch (error) {
    console.error("[Lead Magnet Documents] upload failed", error)
    return NextResponse.json(
      { error: "The documents could not be uploaded. Please try again." },
      { status: 500 },
    )
  }
}
