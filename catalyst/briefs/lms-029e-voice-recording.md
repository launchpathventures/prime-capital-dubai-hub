# LMS-029e: Voice Recording

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 2 hours  
**Dependencies:** LMS-029c  

---

## Objective

Add voice recording with Deepgram batch transcription to the feedback form.

---

## Environment Setup

Add to `.env.local`:
```bash
DEEPGRAM_API_KEY=626fcb11916da5e5d894b08eb6c9c85dce9a4efa
```

---

## Tasks

### 1. Voice Recording Component

**File:** `components/lms/feedback-voice.tsx`

```typescript
"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { transcribeAudio, uploadAudio } from "@/lib/lms/feedback-actions"

type Props = {
  onTranscription: (text: string, audioPath: string) => void
}

export function FeedbackVoice({ onTranscription }: Props) {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm"
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        stream.getTracks().forEach(track => track.stop())
        await processRecording(blob)
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      console.error("Failed to start recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const processRecording = async (blob: Blob) => {
    setProcessing(true)
    try {
      // Upload audio to Supabase Storage
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")
      const audioPath = await uploadAudio(formData)

      // Transcribe with Deepgram
      const transcription = await transcribeAudio(audioPath)
      
      onTranscription(transcription, audioPath)
    } catch (err) {
      console.error("Failed to process recording:", err)
    } finally {
      setProcessing(false)
    }
  }

  if (processing) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Transcribing...
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {recording ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
        >
          <Mic className="h-4 w-4 mr-1" />
          Record
        </Button>
      )}
      {recording && (
        <span className="text-sm text-red-500 animate-pulse">
          Recording...
        </span>
      )}
    </div>
  )
}
```

### 2. Upload Audio Action

**File:** `lib/lms/feedback-actions.ts` (add to existing)

```typescript
export async function uploadAudio(formData: FormData): Promise<string> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const file = formData.get("audio") as File
  const filename = `${user.id}/${Date.now()}-recording.webm`

  const { error } = await supabase.storage
    .from("feedback")
    .upload(filename, file)

  if (error) throw error

  return filename
}
```

### 3. Transcription API Route

**File:** `app/api/feedback/transcribe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Verify user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { audioPath } = await request.json()

  // Get audio from Supabase Storage
  const { data: audioData, error: downloadError } = await supabase.storage
    .from("feedback")
    .download(audioPath)

  if (downloadError || !audioData) {
    return NextResponse.json({ error: "Audio not found" }, { status: 404 })
  }

  // Convert to buffer
  const buffer = await audioData.arrayBuffer()

  // Call Deepgram API
  const response = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm"
      },
      body: buffer
    }
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    )
  }

  const result = await response.json()
  const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ""

  return NextResponse.json({ transcript })
}
```

### 4. Client Transcription Function

**File:** `lib/lms/feedback-actions.ts` (add to existing)

```typescript
export async function transcribeAudio(audioPath: string): Promise<string> {
  const response = await fetch("/api/feedback/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioPath })
  })

  if (!response.ok) {
    throw new Error("Transcription failed")
  }

  const { transcript } = await response.json()
  return transcript
}
```

### 5. Add to Feedback Modal

Update `components/lms/feedback-modal.tsx`:

```tsx
import { FeedbackVoice } from "./feedback-voice"

// State
const [audioPath, setAudioPath] = useState<string>()

// In the form, after Textarea:
<FeedbackVoice 
  onTranscription={(transcription, path) => {
    setText(prev => prev ? `${prev}\n\n${transcription}` : transcription)
    setAudioPath(path)
  }}
/>

// Update submitFeedback call to include audioPath
await submitFeedback({
  ...
  audioPath
})
```

---

## Verification

- [ ] Record button appears in modal
- [ ] Can start/stop recording
- [ ] Audio uploads to Supabase Storage
- [ ] Deepgram transcribes audio
- [ ] Transcription appears in text field
- [ ] Audio path saved with feedback
