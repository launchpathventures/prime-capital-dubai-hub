/**
 * CATALYST - Hub Question Detail Page
 *
 * Detailed view of a single question.
 * Shows question content, context, and all responses.
 * Includes response form for adding new responses.
 */

"use client"

import * as React from "react"

import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { ResponseForm } from "@/components/hub"
import { hubConfig } from "@/lib/hub/config"
import type { Question, QuestionResponse, QuestionStatus, Project } from "@/lib/hub/types"
import {
  ArrowLeftIcon,
  CalendarIcon,
  MessageCircleIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react"
import Link from "next/link"
import { use } from "react"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Record<string, Project> = {
  "1": {
    id: "1",
    slug: "platform-development",
    name: "Platform Development",
    description: "Building the unified Prime Capital platform",
    status: "active",
    clientName: "Prime Capital",
    progress: 65,
    displayOrder: 0,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2026-01-04T00:00:00Z",
  },
}

const mockQuestions: Record<string, Question> = {
  "1": {
    id: "1",
    projectId: "1",
    title: "Review the updated hub navigation structure",
    description: "We've implemented a new navigation pattern for the hub. Please review and confirm the information architecture makes sense for your workflow.",
    context: "See the hub at /hub for the current implementation. The navigation includes Dashboard, Projects, Tasks, and Questions sections.",
    status: "pending",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-04T10:00:00Z",
    updatedAt: "2026-01-04T10:00:00Z",
    project: mockProjects["1"],
  },
  "2": {
    id: "2",
    projectId: "1",
    title: "Review typography choices for headlines",
    description: "We're using Palatino for headlines. Does the weight and sizing feel right for the brand?",
    context: "Reference the brand guidelines document for comparison.",
    status: "answered",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-03T14:00:00Z",
    updatedAt: "2026-01-04T15:00:00Z",
    project: mockProjects["1"],
  },
}

const mockResponses: Record<string, QuestionResponse[]> = {
  "1": [],
  "2": [
    {
      id: "r1",
      questionId: "2",
      respondentId: "user2",
      respondentName: "Faisal",
      textResponse: "The typography looks good overall. I think the headline weight could be slightly lighter for a more elegant feel - maybe 400 instead of 500.",
      audioUrl: null,
      audioDuration: null,
      transcription: null,
      createdAt: "2026-01-04T11:00:00Z",
    },
    {
      id: "r2",
      questionId: "2",
      respondentId: "user3",
      respondentName: "Ahmed",
      textResponse: null,
      audioUrl: "/mock-audio.webm",
      audioDuration: 45,
      transcription: "I agree with Faisal. The current weight is a bit heavy. Also wondering if we should test different sizes on mobile.",
      createdAt: "2026-01-04T15:00:00Z",
    },
  ],
}

// -----------------------------------------------------------------------------
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<QuestionStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Pending", variant: "outline" },
  answered: { label: "Answered", variant: "secondary" },
  resolved: { label: "Resolved", variant: "default" },
}

// -----------------------------------------------------------------------------
// Response Item Component
// -----------------------------------------------------------------------------

interface ResponseItemProps {
  response: QuestionResponse
}

function ResponseItem({ response }: ResponseItemProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayback = () => {
    if (!response.audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(response.audioUrl)
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

  const initials = response.respondentName
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "?"

  return (
    <div className="hub-response-item py-4">
      <Row gap="md" align="start">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <Stack gap="sm" className="flex-1">
          <Row justify="between" align="center">
            <Text size="sm" weight="medium">{response.respondentName || "Anonymous"}</Text>
            <Text size="xs" variant="muted">
              {new Date(response.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </Row>

          {response.textResponse && (
            <Text size="sm">{response.textResponse}</Text>
          )}

          {response.audioUrl && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg w-fit">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
              <Stack gap="none">
                <Text size="xs" weight="medium">Voice response</Text>
                {response.audioDuration && (
                  <Text size="xs" variant="muted">{formatDuration(response.audioDuration)}</Text>
                )}
              </Stack>
            </div>
          )}

          {response.transcription && (
            <div className="pl-4 border-l-2 border-muted">
              <Text size="xs" variant="muted" className="italic">
                &ldquo;{response.transcription}&rdquo;
              </Text>
            </div>
          )}
        </Stack>
      </Row>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>
}

export default function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { id } = use(params)
  const [responses, setResponses] = React.useState<QuestionResponse[]>(mockResponses[id] || [])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const question = mockQuestions[id]

  if (!question) {
    return (
      <Container size="lg">
        <Stack gap="md" className="py-12 text-center">
          <Title size="h4">Question not found</Title>
          <Text variant="muted">The question you&apos;re looking for doesn&apos;t exist.</Text>
          <Button 
            variant="outline"
            nativeButton={false}
            render={<Link href="/hub/questions" />}
          >
            Back to {hubConfig.labels.questions}
          </Button>
        </Stack>
      </Container>
    )
  }

  const status = statusConfig[question.status]

  const handleSubmitResponse = async (response: { text?: string; audioUrl?: string; duration?: number }) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newResponse: QuestionResponse = {
      id: `r${Date.now()}`,
      questionId: question.id,
      respondentId: "current-user",
      respondentName: "You",
      textResponse: response.text || null,
      audioUrl: response.audioUrl || null,
      audioDuration: response.duration || null,
      transcription: null,
      createdAt: new Date().toISOString(),
    }
    
    setResponses(prev => [...prev, newResponse])
    setIsSubmitting(false)
  }

  return (
    <Container size="md">
      <Stack gap="xl">
        {/* Back Link */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit gap-1"
          nativeButton={false}
          render={<Link href="/hub/questions" />}
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to {hubConfig.labels.questions}
        </Button>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <Row justify="between" align="start" gap="md">
              <Stack gap="sm">
                <Row gap="sm" align="center">
                  <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant={status.variant}>{status.label}</Badge>
                </Row>
                <CardTitle className="text-xl">{question.title}</CardTitle>
              </Stack>
            </Row>
          </CardHeader>
          <CardContent>
            <Stack gap="md">
              {question.description && (
                <Text>{question.description}</Text>
              )}

              {question.context && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Text size="sm" weight="medium" className="mb-1">Context:</Text>
                  <Text size="sm" variant="muted">{question.context}</Text>
                </div>
              )}

              <Row gap="md" className="text-muted-foreground">
                <Row gap="xs" align="center">
                  <CalendarIcon className="h-4 w-4" />
                  <Text size="xs">
                    Asked {new Date(question.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Row>
                {question.createdByName && (
                  <Text size="xs">by {question.createdByName}</Text>
                )}
                {question.project && (
                  <Text size="xs">• {question.project.name}</Text>
                )}
              </Row>
            </Stack>
          </CardContent>
        </Card>

        {/* Responses */}
        <Card>
          <CardHeader>
            <Row gap="sm" align="center">
              <CardTitle>Responses</CardTitle>
              <Badge variant="secondary">{responses.length}</Badge>
            </Row>
            <CardDescription>
              {responses.length === 0 
                ? "No responses yet. Be the first to respond."
                : "All responses to this question"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap="none" className="divide-y">
              {responses.map((response) => (
                <ResponseItem key={response.id} response={response} />
              ))}
            </Stack>

            {responses.length === 0 && (
              <div className="text-center py-8">
                <Text variant="muted">No responses yet</Text>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Your Response</CardTitle>
            <CardDescription>
              Share your feedback via text or voice recording
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponseForm
              questionId={question.id}
              onSubmit={handleSubmitResponse}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
