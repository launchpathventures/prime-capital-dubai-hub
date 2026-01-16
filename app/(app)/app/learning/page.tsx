/**
 * CATALYST - Admin Learning Page
 *
 * Overview of all competencies and modules for management.
 * Allows admins to view and manage learning content.
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  EditIcon,
  BarChart3Icon,
  UsersIcon,
  HomeIcon,
  FileTextIcon,
  MessageSquareIcon,
  HeartHandshakeIcon,
  ChevronRightIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Competency Data (mock - would come from database)
// -----------------------------------------------------------------------------

const competencies = [
  {
    slug: "market-intelligence",
    name: "Market Intelligence",
    description: "Dubai's real estate landscape, regulations, and market dynamics",
    icon: BarChart3Icon,
    moduleCount: 8,
    quizCount: 2,
    status: "published" as const,
  },
  {
    slug: "client-discovery",
    name: "Client Discovery",
    description: "Understanding client needs, goals, and preferences",
    icon: UsersIcon,
    moduleCount: 6,
    quizCount: 1,
    status: "published" as const,
  },
  {
    slug: "property-matching",
    name: "Property Matching",
    description: "Identifying and presenting properties that align with client criteria",
    icon: HomeIcon,
    moduleCount: 7,
    quizCount: 0,
    status: "draft" as const,
  },
  {
    slug: "transaction-management",
    name: "Transaction Management",
    description: "Navigating the full transaction process from offer to handover",
    icon: FileTextIcon,
    moduleCount: 9,
    quizCount: 0,
    status: "draft" as const,
  },
  {
    slug: "objection-navigation",
    name: "Objection Navigation",
    description: "Handling investor concerns with confidence and credibility",
    icon: MessageSquareIcon,
    moduleCount: 5,
    quizCount: 0,
    status: "draft" as const,
  },
  {
    slug: "relationship-stewardship",
    name: "Relationship Stewardship",
    description: "Building lasting relationships through exceptional service",
    icon: HeartHandshakeIcon,
    moduleCount: 4,
    quizCount: 0,
    status: "draft" as const,
  },
]

const totalModules = competencies.reduce((sum, c) => sum + c.moduleCount, 0)
const totalQuizzes = competencies.reduce((sum, c) => sum + c.quizCount, 0)
const publishedCount = competencies.filter((c) => c.status === "published").length

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function AdminLearningPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Row gap="md" align="start" justify="between">
          <Stack gap="xs">
            <Title size="h3">Learning Management</Title>
            <Text variant="muted">
              Manage competencies, modules, and quiz content for the learning portal.
            </Text>
          </Stack>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Competency
          </Button>
        </Row>

        {/* Stats Overview */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Competencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{competencies.length}</Title>
                <Text size="sm" variant="muted">areas</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{totalModules}</Title>
                <Text size="sm" variant="muted">lessons</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Knowledge Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{totalQuizzes}</Title>
                <Text size="sm" variant="muted">quizzes</Text>
              </Row>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row gap="sm" align="baseline">
                <Title size="h2">{publishedCount}</Title>
                <Text size="sm" variant="muted">/ {competencies.length} competencies</Text>
              </Row>
            </CardContent>
          </Card>
        </Grid>

        {/* Competencies List */}
        <Stack gap="md">
          <Title size="h4">Competencies</Title>
          <Stack gap="sm">
            {competencies.map((competency) => (
              <CompetencyRow key={competency.slug} competency={competency} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Competency Row Component
// -----------------------------------------------------------------------------

interface CompetencyRowProps {
  competency: typeof competencies[0]
}

function CompetencyRow({ competency }: CompetencyRowProps) {
  const Icon = competency.icon
  const statusConfig = {
    published: { label: "Published", variant: "default" as const },
    draft: { label: "Draft", variant: "secondary" as const },
  }
  const { label, variant } = statusConfig[competency.status]

  return (
    <Card>
      <CardContent className="py-4">
        <Row gap="md" align="center">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <Stack gap="none" className="flex-1 min-w-0">
            <Text weight="medium">{competency.name}</Text>
            <Text size="sm" variant="muted" className="truncate">
              {competency.description}
            </Text>
          </Stack>
          <Row gap="md" align="center" className="shrink-0">
            <Row gap="xs" align="center">
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" variant="muted">
                {competency.moduleCount} modules
              </Text>
            </Row>
            <Row gap="xs" align="center">
              <ClipboardCheckIcon className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" variant="muted">
                {competency.quizCount} quizzes
              </Text>
            </Row>
            <Badge variant={variant}>{label}</Badge>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={`/app/learning/${competency.slug}`} />}
            >
              <EditIcon className="h-4 w-4 mr-1" />
              Manage
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </Row>
        </Row>
      </CardContent>
    </Card>
  )
}
