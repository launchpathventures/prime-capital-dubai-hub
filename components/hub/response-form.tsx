/**
 * CATALYST - Response Form Component
 *
 * Combined text + voice response input for questions.
 * Uses tabs to switch between input modes.
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stack, Text } from "@/components/core"
import { VoiceRecorder } from "./voice-recorder"
import { SendIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ResponseFormProps {
  /** Question ID for organizing the response */
  questionId: string
  /** Called when response is submitted */
  onSubmit: (response: { text?: string; audioUrl?: string; duration?: number }) => void | Promise<void>
  /** Whether submission is in progress */
  isSubmitting?: boolean
  /** Custom class name */
  className?: string
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ResponseForm({ 
  questionId, 
  onSubmit, 
  isSubmitting = false,
  className 
}: ResponseFormProps) {
  const [text, setText] = React.useState("")
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [audioDuration, setAudioDuration] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState("text")

  const hasContent = text.trim() || audioUrl

  const handleSubmit = async () => {
    if (!hasContent || isSubmitting) return

    await onSubmit({
      text: text.trim() || undefined,
      audioUrl: audioUrl || undefined,
      duration: audioUrl ? audioDuration : undefined,
    })

    // Reset form
    setText("")
    setAudioUrl(null)
    setAudioDuration(0)
  }

  const handleRecordingComplete = (url: string, duration: number) => {
    setAudioUrl(url)
    setAudioDuration(duration)
  }

  return (
    <div className={cn("hub-response-form", className)}>
      <Stack gap="md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="text">Text Response</TabsTrigger>
            <TabsTrigger value="voice">Voice Response</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <Stack gap="sm">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your response..."
                rows={4}
                className="resize-none"
              />
              <Text size="xs" variant="muted" className="text-right">
                {text.length} characters
              </Text>
            </Stack>
          </TabsContent>

          <TabsContent value="voice" className="mt-4">
            <VoiceRecorder
              questionId={questionId}
              onRecordingComplete={handleRecordingComplete}
            />
            {audioUrl && (
              <Text size="sm" className="text-success mt-2">
                ✓ Recording ready ({Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, "0")})
              </Text>
            )}
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleSubmit}
          disabled={!hasContent || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              Submit Response
            </>
          )}
        </Button>
      </Stack>
    </div>
  )
}
