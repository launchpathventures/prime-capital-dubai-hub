/**
 * CATALYST - Speech-to-Text API
 *
 * Transcribes audio directly using Deepgram Nova-2.
 * Accepts raw audio data (no storage required) for real-time transcription.
 *
 * POST /api/speech-to-text
 * Body: FormData with 'audio' field containing the audio blob
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY

export async function POST(request: NextRequest) {
  // Check API key configured
  if (!DEEPGRAM_API_KEY) {
    console.error("DEEPGRAM_API_KEY is not configured")
    return NextResponse.json(
      { error: "Speech-to-text service not configured" },
      { status: 503 }
    )
  }

  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get audio from request body
    const formData = await request.formData()
    const audioFile = formData.get("audio") as Blob | null

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio provided" },
        { status: 400 }
      )
    }

    console.log("Received audio:", audioFile.size, "bytes, type:", audioFile.type)

    // Convert to buffer
    const buffer = await audioFile.arrayBuffer()

    // Determine content type
    const contentType = audioFile.type || "audio/webm"

    console.log("Sending to Deepgram with content-type:", contentType)

    // Call Deepgram API with Nova-2 model
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": contentType,
        },
        body: buffer,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Deepgram API error:", response.status, errorText)
      
      // Return more specific error messages
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: "API key invalid or expired" },
          { status: 500 }
        )
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again." },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: "Transcription failed. Please try again." },
        { status: 500 }
      )
    }

    const result = await response.json()
    const transcript =
      result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ""

    // Log for debugging (remove in production)
    console.log("Transcription complete:", transcript.substring(0, 100) + "...")

    return NextResponse.json({
      transcript,
      confidence: result.results?.channels?.[0]?.alternatives?.[0]?.confidence,
    })
  } catch (error) {
    console.error("Speech-to-text error:", error)
    return NextResponse.json(
      { error: "Transcription request failed" },
      { status: 500 }
    )
  }
}
