/**
 * CATALYST - Hub Questions Page
 *
 * Questions list for the hub.
 * Shows questions with status, response count, and project.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/hub"
import { hubConfig } from "@/lib/hub/config"
import type { Question, Project } from "@/lib/hub/types"
import { FilterIcon } from "lucide-react"

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
  "2": {
    id: "2",
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    description: "Finalizing brand identity",
    status: "active",
    clientName: "Prime Capital",
    progress: 85,
    displayOrder: 1,
    createdAt: "2025-11-15T00:00:00Z",
    updatedAt: "2026-01-03T00:00:00Z",
  },
}

const mockQuestions: Question[] = [
  {
    id: "1",
    projectId: "1",
    title: "Review the updated hub navigation structure",
    description: "We've implemented a new navigation pattern for the hub. Please review and confirm the information architecture makes sense for your workflow.",
    context: "See the hub at /hub for the current implementation.",
    status: "pending",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-04T10:00:00Z",
    updatedAt: "2026-01-04T10:00:00Z",
    project: mockProjects["1"],
    responseCount: 0,
  },
  {
    id: "2",
    projectId: "2",
    title: "Review typography choices for headlines",
    description: "We're using Palatino for headlines. Does the weight and sizing feel right for the brand?",
    context: "Reference the brand guidelines document for comparison.",
    status: "answered",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-03T14:00:00Z",
    updatedAt: "2026-01-04T15:00:00Z",
    project: mockProjects["2"],
    responseCount: 2,
  },
  {
    id: "3",
    projectId: "1",
    title: "Confirm voice recording feature requirements",
    description: "What's the maximum recording length you'd need? Currently set to 5 minutes.",
    context: null,
    status: "resolved",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-02T09:00:00Z",
    updatedAt: "2026-01-03T11:00:00Z",
    project: mockProjects["1"],
    responseCount: 3,
  },
  {
    id: "4",
    projectId: "1",
    title: "Preferred notification method for task updates",
    description: "How would you like to be notified of task status changes? Email, in-app, or both?",
    context: "This will inform the notification system design.",
    status: "pending",
    createdById: "user1",
    createdByName: "Tim",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
    project: mockProjects["1"],
    responseCount: 0,
  },
]

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function HubQuestionsPage() {
  const pendingQuestions = mockQuestions.filter(q => q.status === "pending")
  const answeredQuestions = mockQuestions.filter(q => q.status === "answered")
  const resolvedQuestions = mockQuestions.filter(q => q.status === "resolved")

  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">{hubConfig.labels.questions}</Title>
            <Text variant="muted">
              {mockQuestions.length} {mockQuestions.length === 1 ? "question" : "questions"} total
            </Text>
          </Stack>
          <Row gap="sm">
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
          </Row>
        </Row>

        {/* Pending Questions */}
        {pendingQuestions.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">Pending Response</Title>
              <Badge variant="outline">{pendingQuestions.length}</Badge>
            </Row>
            <Grid cols={2} gap="md">
              {pendingQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </Grid>
          </Stack>
        )}

        {/* Answered Questions */}
        {answeredQuestions.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">Answered</Title>
              <Badge variant="secondary">{answeredQuestions.length}</Badge>
            </Row>
            <Grid cols={2} gap="md">
              {answeredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </Grid>
          </Stack>
        )}

        {/* Resolved Questions */}
        {resolvedQuestions.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">Resolved</Title>
              <Badge variant="default">{resolvedQuestions.length}</Badge>
            </Row>
            <Grid cols={2} gap="md">
              {resolvedQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </Grid>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
