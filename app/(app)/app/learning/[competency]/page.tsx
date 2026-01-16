/**
 * CATALYST - Admin Competency Page
 *
 * Manage modules within a specific competency.
 * Dynamic route: /app/learning/[competency]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  GripVerticalIcon,
  ClockIcon,
  ClipboardCheckIcon,
  EyeIcon,
  BarChart3Icon,
  UsersIcon,
  HomeIcon,
  FileTextIcon,
  MessageSquareIcon,
  HeartHandshakeIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Competency Data (mock - would come from database)
// -----------------------------------------------------------------------------

const competencyData: Record<string, {
  name: string
  description: string
  icon: React.ElementType
  modules: Array<{
    id: string
    slug: string
    title: string
    duration: string
    status: "published" | "draft"
    hasQuiz: boolean
  }>
}> = {
  "market-intelligence": {
    name: "Market Intelligence",
    description: "Dubai's real estate landscape, regulations, and market dynamics",
    icon: BarChart3Icon,
    modules: [
      { id: "1", slug: "dubai-real-estate-overview", title: "Dubai Real Estate Overview", duration: "30 min", status: "published", hasQuiz: true },
      { id: "2", slug: "regulatory-framework", title: "Regulatory Framework", duration: "45 min", status: "published", hasQuiz: true },
      { id: "3", slug: "market-segments", title: "Market Segments", duration: "35 min", status: "published", hasQuiz: false },
      { id: "4", slug: "key-developers", title: "Key Developers", duration: "25 min", status: "published", hasQuiz: false },
      { id: "5", slug: "area-knowledge", title: "Area Knowledge", duration: "40 min", status: "published", hasQuiz: false },
      { id: "6", slug: "golden-visa", title: "Golden Visa & Residency", duration: "20 min", status: "published", hasQuiz: false },
      { id: "7", slug: "market-trends", title: "Market Trends & Analysis", duration: "35 min", status: "published", hasQuiz: false },
      { id: "8", slug: "competitive-landscape", title: "Competitive Landscape", duration: "30 min", status: "published", hasQuiz: false },
    ],
  },
  "client-discovery": {
    name: "Client Discovery",
    description: "Understanding client needs, goals, and preferences",
    icon: UsersIcon,
    modules: [
      { id: "1", slug: "investor-personas", title: "Investor Personas", duration: "35 min", status: "published", hasQuiz: false },
      { id: "2", slug: "discovery-questions", title: "Discovery Questions", duration: "40 min", status: "published", hasQuiz: false },
      { id: "3", slug: "active-listening", title: "Active Listening", duration: "25 min", status: "published", hasQuiz: false },
      { id: "4", slug: "qualification-framework", title: "Qualification Framework", duration: "30 min", status: "published", hasQuiz: false },
      { id: "5", slug: "understanding-investment-goals", title: "Understanding Investment Goals", duration: "35 min", status: "published", hasQuiz: true },
      { id: "6", slug: "managing-expectations", title: "Managing Expectations", duration: "25 min", status: "draft", hasQuiz: false },
    ],
  },
  "property-matching": {
    name: "Property Matching",
    description: "Identifying and presenting properties that align with client criteria",
    icon: HomeIcon,
    modules: [
      { id: "1", slug: "property-analysis", title: "Property Analysis", duration: "40 min", status: "draft", hasQuiz: false },
      { id: "2", slug: "yield-calculations", title: "Yield Calculations", duration: "35 min", status: "draft", hasQuiz: false },
      { id: "3", slug: "off-plan-evaluation", title: "Off-Plan Evaluation", duration: "45 min", status: "draft", hasQuiz: false },
      { id: "4", slug: "secondary-market", title: "Secondary Market", duration: "30 min", status: "draft", hasQuiz: false },
      { id: "5", slug: "presentation-skills", title: "Property Presentation", duration: "35 min", status: "draft", hasQuiz: false },
      { id: "6", slug: "viewings-management", title: "Managing Viewings", duration: "25 min", status: "draft", hasQuiz: false },
      { id: "7", slug: "comparative-analysis", title: "Comparative Market Analysis", duration: "30 min", status: "draft", hasQuiz: false },
    ],
  },
  "transaction-management": {
    name: "Transaction Management",
    description: "Navigating the full transaction process from offer to handover",
    icon: FileTextIcon,
    modules: [],
  },
  "objection-navigation": {
    name: "Objection Navigation",
    description: "Handling investor concerns with confidence and credibility",
    icon: MessageSquareIcon,
    modules: [],
  },
  "relationship-stewardship": {
    name: "Relationship Stewardship",
    description: "Building lasting relationships through exceptional service",
    icon: HeartHandshakeIcon,
    modules: [],
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    competency: string
  }>
}

export default async function AdminCompetencyPage({ params }: PageProps) {
  const { competency: competencySlug } = await params
  const competency = competencyData[competencySlug]

  if (!competency) {
    notFound()
  }

  const Icon = competency.icon
  const publishedCount = competency.modules.filter((m) => m.status === "published").length
  const quizCount = competency.modules.filter((m) => m.hasQuiz).length

  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Row gap="xs" align="center">
          <Link href="/app/learning">
            <Text size="sm" variant="muted" className="hover:text-foreground transition-colors">
              Learning Management
            </Text>
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          <Text size="sm">{competency.name}</Text>
        </Row>

        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <Row gap="lg" align="start" justify="between">
              <Row gap="md" align="start">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <Stack gap="sm">
                  <Stack gap="xs">
                    <Title size="h2">{competency.name}</Title>
                    <Text variant="muted">{competency.description}</Text>
                  </Stack>
                  <Row gap="md" align="center">
                    <Text size="sm" variant="muted">
                      {competency.modules.length} modules
                    </Text>
                    <Text size="sm" variant="muted">
                      {publishedCount} published
                    </Text>
                    <Text size="sm" variant="muted">
                      {quizCount} quizzes
                    </Text>
                  </Row>
                </Stack>
              </Row>
              <Row gap="sm">
                <Button variant="outline">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit Competency
                </Button>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </Row>
            </Row>
          </CardContent>
        </Card>

        {/* Modules List */}
        <Stack gap="md">
          <Row gap="sm" align="center" justify="between">
            <Title size="h4">Modules</Title>
            <Text size="sm" variant="muted">
              Drag to reorder
            </Text>
          </Row>
          
          {competency.modules.length > 0 ? (
            <Stack gap="sm">
              {competency.modules.map((module, index) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  competencySlug={competencySlug}
                  index={index + 1}
                />
              ))}
            </Stack>
          ) : (
            <Card>
              <CardContent className="py-12">
                <Stack gap="md" align="center">
                  <div className="p-4 rounded-full bg-muted">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Stack gap="xs" align="center">
                    <Text weight="medium">No modules yet</Text>
                    <Text size="sm" variant="muted">
                      Start building this competency by adding your first module.
                    </Text>
                  </Stack>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Module
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Module Row Component
// -----------------------------------------------------------------------------

interface ModuleRowProps {
  module: {
    id: string
    slug: string
    title: string
    duration: string
    status: "published" | "draft"
    hasQuiz: boolean
  }
  competencySlug: string
  index: number
}

function ModuleRow({ module, competencySlug, index }: ModuleRowProps) {
  const statusConfig = {
    published: { label: "Published", variant: "default" as const },
    draft: { label: "Draft", variant: "secondary" as const },
  }
  const { label, variant } = statusConfig[module.status]

  return (
    <Card>
      <CardContent className="py-3">
        <Row gap="md" align="center">
          <button className="cursor-grab text-muted-foreground hover:text-foreground transition-colors">
            <GripVerticalIcon className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
            <Text size="sm" weight="medium">{index}</Text>
          </div>
          <Stack gap="none" className="flex-1 min-w-0">
            <Text weight="medium">{module.title}</Text>
            <Row gap="sm" align="center">
              <Row gap="xs" align="center">
                <ClockIcon className="h-3 w-3 text-muted-foreground" />
                <Text size="xs" variant="muted">{module.duration}</Text>
              </Row>
              {module.hasQuiz && (
                <Row gap="xs" align="center">
                  <ClipboardCheckIcon className="h-3 w-3 text-muted-foreground" />
                  <Text size="xs" variant="muted">Has quiz</Text>
                </Row>
              )}
            </Row>
          </Stack>
          <Row gap="sm" align="center" className="shrink-0">
            <Badge variant={variant}>{label}</Badge>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={`/learn/${competencySlug}/${module.slug}`} target="_blank" />}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
          </Row>
        </Row>
      </CardContent>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Generate Static Params
// -----------------------------------------------------------------------------

export async function generateStaticParams() {
  return Object.keys(competencyData).map((competency) => ({
    competency,
  }))
}
