/**
 * CATALYST - Admin Projects Management Page
 *
 * CRUD interface for managing hub projects.
 * Create, edit, and archive projects.
 */

import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { hubConfig } from "@/lib/hub/config"
import type { Project, ProjectStatus } from "@/lib/hub/types"
import {
  PlusIcon,
  ArrowLeftIcon,
  EditIcon,
  ArchiveIcon,
  ExternalLinkIcon,
} from "lucide-react"
import Link from "next/link"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Project[] = [
  {
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
  {
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
  {
    id: "3",
    slug: "content-migration",
    name: "Content Migration",
    description: "Migrating existing content",
    status: "on_hold",
    clientName: "Prime Capital",
    progress: 30,
    displayOrder: 2,
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "4",
    slug: "training-content",
    name: "Training Content",
    description: "Developing onboarding modules",
    status: "completed",
    clientName: "Prime Capital",
    progress: 100,
    displayOrder: 3,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
  },
]

// -----------------------------------------------------------------------------
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  on_hold: { label: "On Hold", variant: "outline" },
  archived: { label: "Archived", variant: "outline" },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminProjectsPage() {
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
            <Title size="h3">Manage {hubConfig.labels.projects}</Title>
            <Text variant="muted">
              Create and manage hub projects
            </Text>
          </Stack>
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Project
          </Button>
        </Row>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>{hubConfig.labels.projects}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProjects.map((project) => {
                  const status = statusConfig[project.status]
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Stack gap="none">
                          <Text size="sm" weight="medium">{project.name}</Text>
                          <Text size="xs" variant="muted">{project.slug}</Text>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Row gap="sm" align="center" className="w-32">
                          <Progress value={project.progress} className="h-1.5 flex-1" />
                          <Text size="xs" variant="muted">{project.progress}%</Text>
                        </Row>
                      </TableCell>
                      <TableCell>
                        <Text size="sm" variant="muted">
                          {new Date(project.updatedAt).toLocaleDateString("en-US", {
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
                            render={<Link href={`/hub/projects/${project.slug}`} />}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ArchiveIcon className="h-4 w-4" />
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
