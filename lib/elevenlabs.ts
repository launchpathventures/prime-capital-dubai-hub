/**
 * CATALYST - Eleven Labs TTS Service
 *
 * Generates speech audio from text using Eleven Labs API.
 */

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

export interface TTSOptions {
  voiceId?: string
  modelId?: string
  outputFormat?: string
  stability?: number
  similarityBoost?: number
}

export interface TTSResult {
  audio: Buffer
  contentType: string
  requestId: string
}

/**
 * Convert text to speech using Eleven Labs API
 */
export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured")
  }

  const voiceId =
    options.voiceId || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb"
  const modelId =
    options.modelId || process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2"
  const outputFormat = options.outputFormat || "mp3_44100_128"

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=${outputFormat}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Eleven Labs API error: ${response.status} - ${error}`)
  }

  const requestId = response.headers.get("request-id") || ""
  const arrayBuffer = await response.arrayBuffer()

  return {
    audio: Buffer.from(arrayBuffer),
    contentType: "audio/mpeg",
    requestId,
  }
}

/**
 * Clean transcript text for TTS
 * - Remove markdown formatting
 * - Convert tags to speech-friendly markers
 * - Handle section breaks
 */
export function prepareTranscriptForTTS(transcript: string): string {
  return (
    transcript
      // Remove frontmatter
      .replace(/^---[\s\S]*?---\n/, "")
      // Remove markdown headers (keep text)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove markdown links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove bold/italic markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Convert demo markers to spoken cues
      .replace(/\[DEMO:\s*Weak\]/gi, "... Here's the weak approach: ...")
      .replace(/\[DEMO:\s*Strong\]/gi, "... Now, the strong approach: ...")
      .replace(/\[DEMO:\s*Comparison\]/gi, "... Let's compare: ...")
      .replace(/\[COACH EXPLAINS\]/gi, "... Here's why this matters: ...")
      .replace(/\[PRACTICE TIP\]/gi, "... Practice tip: ...")
      .replace(/\[KEY INSIGHT\]/gi, "... Key insight: ...")
      // Convert scene directions to pauses
      .replace(/\*\[Scene:[^\]]+\]\*/gi, "...")
      .replace(/\*\[[^\]]+\]\*/gi, "...")
      // Remove horizontal rules
      .replace(/^---+$/gm, "...")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Clean up excessive whitespace
      .replace(/\n{3,}/g, "\n\n")
      // Remove leading/trailing whitespace
      .trim()
  )
}

/**
 * Estimate audio duration from text (rough: ~150 words/minute)
 */
export function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length
  return Math.ceil((wordCount / 150) * 60) // seconds
}

/**
 * Get available voices from Eleven Labs
 */
export async function getVoices(): Promise<
  Array<{ voice_id: string; name: string }>
> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured")
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      "xi-api-key": apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.status}`)
  }

  const data = await response.json()
  return data.voices
}

/**
 * Get subscription/usage info
 */
export async function getSubscriptionInfo(): Promise<{
  character_count: number
  character_limit: number
  can_extend_character_limit: boolean
}> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured")
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
    headers: {
      "xi-api-key": apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription: ${response.status}`)
  }

  return response.json()
}
