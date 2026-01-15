/**
 * CATALYST - Deepgram Transcription API
 *
 * Transcribes audio files from Supabase Storage using Deepgram.
 * POST /api/feedback/transcribe
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY

export async function POST(request: NextRequest) {
  // Check API key configured
  if (!DEEPGRAM_API_KEY) {
    return NextResponse.json(
      { error: "Deepgram API key not configured" },
      { status: 500 }
    )
  }

  const supabase = await createClient()

  // Verify user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { audioPath } = await request.json()

  if (!audioPath) {
    return NextResponse.json(
      { error: "audioPath is required" },
      { status: 400 }
    )
  }

  // Get audio from Supabase Storage
  const { data: audioData, error: downloadError } = await supabase.storage
    .from("feedback")
    .download(audioPath)

  if (downloadError || !audioData) {
    console.error("Failed to download audio:", downloadError)
    return NextResponse.json({ error: "Audio not found" }, { status: 404 })
  }

  // Convert to buffer
  const buffer = await audioData.arrayBuffer()

  // Call Deepgram API
  try {
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/webm",
        },
        body: buffer,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Deepgram API error:", errorText)
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 500 }
      )
    }

    const result = await response.json()
    const transcript =
      result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ""

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error("Deepgram request failed:", error)
    return NextResponse.json(
      { error: "Transcription request failed" },
      { status: 500 }
    )
  }
}
