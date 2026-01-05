/**
 * CATALYST - Hub Projects List Page
 *
 * Grid view of all projects in the hub.
 * Shows project cards with status, progress, and activity.
 */

import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/hub"
import { hubConfig } from "@/lib/hub/config"
import type { Project } from "@/lib/hub/types"
import { FilterIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Mock Data (replace with Supabase queries)
// -----------------------------------------------------------------------------

const mockProjects: Project[] = [
  {
    id: "1",
    slug: "platform-development",
    name: "Platform Development",
    description: "Building the unified Prime Capital platform with website, learning portal, and admin.",
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
    description: "Finalizing brand identity, typography, and visual language for all touchpoints.",
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
    description: "Migrating existing content and setting up CMS for ongoing management.",
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
    description: "Developing onboarding modules and learning materials for new consultants.",
    status: "completed",
    clientName: "Prime Capital",
    progress: 100,
    displayOrder: 3,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
  },
]

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function HubProjectsPage() {
  const activeProjects = mockProjects.filter(p => p.status === "active")
  const completedProjects = mockProjects.filter(p => p.status === "completed")
  const otherProjects = mockProjects.filter(p => !["active", "completed"].includes(p.status))

  return (
    <Container size="lg">
      <Stack gap="xl">
        {/* Page Header */}
        <Row justify="between" align="center">
          <Stack gap="xs">
            <Title size="h3">{hubConfig.labels.projects}</Title>
            <Text variant="muted">
              {mockProjects.length} {mockProjects.length === 1 ? "project" : "projects"} total
            </Text>
          </Stack>
          <Row gap="sm">
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
          </Row>
        </Row>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">Active</Title>
              <Badge variant="secondary">{activeProjects.length}</Badge>
            </Row>
            <Grid cols={3} gap="md">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Grid>
          </Stack>
        )}

        {/* On Hold / Other */}
        {otherProjects.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">On Hold</Title>
              <Badge variant="outline">{otherProjects.length}</Badge>
            </Row>
            <Grid cols={3} gap="md">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Grid>
          </Stack>
        )}

        {/* Completed */}
        {completedProjects.length > 0 && (
          <Stack gap="md">
            <Row gap="sm" align="center">
              <Title size="h5">Completed</Title>
              <Badge variant="default">{completedProjects.length}</Badge>
            </Row>
            <Grid cols={3} gap="md">
              {completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Grid>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
