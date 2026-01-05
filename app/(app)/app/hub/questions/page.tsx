/**
 * CATALYST - Admin Questions Management Page
 *
 * CRUD interface for managing hub questions.
 * Create questions and view responses.
 */

import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { hubConfig } from "@/lib/hub/config"
import type { Question, QuestionStatus, Project } from "@/lib/hub/types"
import {
  PlusIcon,
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
} from "lucide-react"
import Link from "next/link"

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
    description: "We've implemented a new navigation pattern for the hub.",
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
    description: "We're using Palatino for headlines.",
    context: "Reference the brand guidelines document.",
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
    description: "What's the maximum recording length you'd need?",
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
    description: "How would you like to be notified of task status changes?",
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
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<QuestionStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Pending", variant: "outline" },
  answered: { label: "Answered", variant: "secondary" },
  resolved: { label: "Resolved", variant: "default" },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminQuestionsPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Back Link */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit gap-1"
          nativeButton={false}
          render={<Link href="/app/hub" />}
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to Hub
        </Button>

        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">Manage {hubConfig.labels.questions}</Title>
            <Text variant="muted">
              Create questions and collect client feedback
            </Text>
          </Stack>
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Question
          </Button>
        </Row>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>{hubConfig.labels.questions}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockQuestions.map((question) => {
                  const status = statusConfig[question.status]
                  return (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Text size="sm" weight="medium" className="max-w-xs truncate">
                          {question.title}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" variant="muted">
                          {question.project?.name}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Row gap="xs" align="center">
                          <MessageSquareIcon className="h-3 w-3 text-muted-foreground" />
                          <Text size="sm">{question.responseCount}</Text>
                        </Row>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" variant="muted">
                          {new Date(question.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                      </TableCell>
                      <TableCell className="text-right">
                        <Row gap="xs" justify="end">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            nativeButton={false}
                            render={<Link href={`/hub/questions/${question.id}`} />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </Row>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
