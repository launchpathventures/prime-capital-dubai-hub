/**
 * CATALYST - Audio Data Fetching
 * 
 * Server-side functions to fetch audio transcripts for modules.
 */

import { createClient } from "@/lib/supabase/server"

export interface AudioTrackData {
  slug: string
  title: string
  type: "intro" | "demo" | "walkthrough"
  audioUrl: string | null
  audioDurationSeconds: number | null
  transcript: string
}

/**
 * Fetch audio tracks for a module by matching the module number pattern.
 * Audio slugs follow format: {compOrder}.{moduleOrder}-{slug}-{type}
 * e.g., "0.1-orientation-intro", "1.2-competitive-landscape-demo"
 */
export async function getAudioForModule(
  competencyOrder: number,
  moduleOrder: number
): Promise<AudioTrackData[]> {
  const supabase = await createClient()
  
  // Build the module number prefix (e.g., "0.1", "1.2")
  const modulePrefix = `${competencyOrder}.${moduleOrder + 1}`
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("slug, title, type, audio_url, audio_duration_seconds, transcript")
    .like("slug", `${modulePrefix}-%`)
    .order("type")
  
  if (error) {
    console.error("Failed to fetch audio for module:", error)
    return []
  }
  
  // Sort by type priority: intro -> demo -> walkthrough
  const typePriority = { intro: 0, demo: 1, walkthrough: 2 }
  
  return (data || [])
    .map((row) => ({
      slug: row.slug,
      title: row.title || "",
      type: row.type as "intro" | "demo" | "walkthrough",
      audioUrl: row.audio_url,
      audioDurationSeconds: row.audio_duration_seconds,
      transcript: row.transcript || "",
    }))
    .sort((a, b) => (typePriority[a.type] || 0) - (typePriority[b.type] || 0))
}

/**
 * Fetch all audio tracks for a competency.
 */
export async function getAudioForCompetency(
  competencyOrder: number
): Promise<AudioTrackData[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("slug, title, type, audio_url, audio_duration_seconds, transcript")
    .like("slug", `${competencyOrder}.%`)
    .order("slug")
  
  if (error) {
    console.error("Failed to fetch audio for competency:", error)
    return []
  }
  
  return (data || []).map((row) => ({
    slug: row.slug,
    title: row.title || "",
    type: row.type as "intro" | "demo" | "walkthrough",
    audioUrl: row.audio_url,
    audioDurationSeconds: row.audio_duration_seconds,
    transcript: row.transcript || "",
  }))
}

/**
 * Format duration from seconds to human readable string.
 */
export function formatAudioDuration(seconds: number | null): string {
  if (!seconds) return "1-2 min"
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  
  if (mins === 0) return `${secs} sec`
  if (secs === 0) return `${mins} min`
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
