/**
 * CATALYST - Voice Recorder Component
 *
 * Audio recording component for question responses.
 * Handles recording, playback, and upload to storage.
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Row, Stack, Text } from "@/components/core"
import { Progress } from "@/components/ui/progress"
import { MicIcon, SquareIcon, PlayIcon, PauseIcon, Trash2Icon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface VoiceRecorderProps {
  /** Called when recording is complete with the audio URL and duration */
  onRecordingComplete: (audioUrl: string, duration: number) => void
  /** Optional question ID for organizing uploads */
  questionId?: string
  /** Max recording duration in seconds (default: 300 = 5 minutes) */
  maxDuration?: number
  /** Custom class name */
  className?: string
}

type RecordingState = "idle" | "recording" | "processing" | "recorded"

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VoiceRecorder({
  onRecordingComplete,
  questionId,
  maxDuration = 300,
  className,
}: VoiceRecorderProps) {
  const [state, setState] = React.useState<RecordingState>("idle")
  const [duration, setDuration] = React.useState(0)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setState("processing")
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType || "audio/webm" 
        })
        
        // Create local URL for playback
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // TODO: In production, upload to Supabase Storage
        // const filename = questionId ? `${questionId}/${Date.now()}.webm` : `${Date.now()}.webm`
        // const { data, error } = await supabase.storage.from('voice-recordings').upload(filename, blob)
        // if (data) {
        //   const { data: { publicUrl } } = supabase.storage.from('voice-recordings').getPublicUrl(filename)
        //   onRecordingComplete(publicUrl, duration)
        // }
        
        // For now, use the local URL (questionId reserved for future upload organization)
        void questionId // Used for organizing uploads when Supabase Storage is connected
        setState("recorded")
        onRecordingComplete(url, duration)
      }

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setState("recording")
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(d => {
          const newDuration = d + 1
          if (newDuration >= maxDuration) {
            stopRecording()
          }
          return newDuration
        })
      }, 1000)

    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  const playRecording = () => {
    if (!audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setDuration(0)
    setState("idle")
    setIsPlaying(false)
  }

  return (
    <div className={cn("hub-voice-recorder p-4 border rounded-lg bg-muted/30", className)}>
      <Stack gap="md">
        {/* Error Message */}
        {error && (
          <Text size="sm" className="text-destructive">{error}</Text>
        )}

        {/* Idle State */}
        {state === "idle" && (
          <Stack gap="sm" className="items-center py-4">
            <Button onClick={startRecording} size="lg" className="gap-2">
              <MicIcon className="h-5 w-5" />
              Start Recording
            </Button>
            <Text size="xs" variant="muted">
              Max {Math.floor(maxDuration / 60)} minutes
            </Text>
          </Stack>
        )}

        {/* Recording State */}
        {state === "recording" && (
          <Stack gap="md" className="items-center py-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                <MicIcon className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <Row gap="md" align="center">
              <Text size="lg" weight="medium" className="tabular-nums">
                {formatDuration(duration)}
              </Text>
              <Text size="sm" variant="muted">/ {formatDuration(maxDuration)}</Text>
            </Row>

            <Progress value={(duration / maxDuration) * 100} className="h-1 w-full max-w-xs" />

            <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
              <SquareIcon className="h-5 w-5" />
              Stop Recording
            </Button>
          </Stack>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <Stack gap="sm" className="items-center py-4">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            <Text variant="muted">Processing...</Text>
          </Stack>
        )}

        {/* Recorded State */}
        {state === "recorded" && audioUrl && (
          <Stack gap="md">
            <Row gap="md" align="center" justify="between">
              <Row gap="sm" align="center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={playRecording}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </Button>
                <Text size="sm" weight="medium" className="tabular-nums">
                  {formatDuration(duration)}
                </Text>
              </Row>

              <Row gap="sm">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={deleteRecording}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    deleteRecording()
                    startRecording()
                  }}
                >
                  Re-record
                </Button>
              </Row>
            </Row>
          </Stack>
        )}
      </Stack>
    </div>
  )
}
