/**
 * CATALYST - Learn Dashboard Page
 *
 * Learning portal dashboard showing competencies and progress.
 * This is the main landing page for learners after authentication.
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUpIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
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

const competencies = [
  {
    slug: "market-intelligence",
    name: "Market Intelligence",
    description: "Understand Dubai's real estate landscape, regulations, and market dynamics",
    icon: BarChart3Icon,
    modules: 8,
    completedModules: 8,
    estimatedTime: "4 hours",
    status: "completed" as const,
  },
  {
    slug: "client-discovery",
    name: "Client Discovery",
    description: "Master the art of understanding client needs, goals, and preferences",
    icon: UsersIcon,
    modules: 6,
    completedModules: 4,
    estimatedTime: "3 hours",
    status: "in-progress" as const,
  },
  {
    slug: "property-matching",
    name: "Property Matching",
    description: "Learn to identify and present properties that align with client criteria",
    icon: HomeIcon,
    modules: 7,
    completedModules: 0,
    estimatedTime: "3.5 hours",
    status: "not-started" as const,
  },
  {
    slug: "transaction-management",
    name: "Transaction Management",
    description: "Navigate the full transaction process from offer to handover",
    icon: FileTextIcon,
    modules: 9,
    completedModules: 0,
    estimatedTime: "4.5 hours",
    status: "not-started" as const,
  },
  {
    slug: "objection-navigation",
    name: "Objection Navigation",
    description: "Handle investor concerns with confidence and credibility",
    icon: MessageSquareIcon,
    modules: 5,
    completedModules: 0,
    estimatedTime: "2.5 hours",
    status: "not-started" as const,
  },
  {
    slug: "relationship-stewardship",
    name: "Relationship Stewardship",
    description: "Build lasting relationships through exceptional service and follow-up",
    icon: HeartHandshakeIcon,
    modules: 4,
    completedModules: 0,
    estimatedTime: "2 hours",
    status: "not-started" as const,
  },
]

// Calculate overall progress
const totalModules = competencies.reduce((sum, c) => sum + c.modules, 0)
const completedModules = competencies.reduce((sum, c) => sum + c.completedModules, 0)
const overallProgress = Math.round((completedModules / totalModules) * 100)

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function LearnDashboardPage() {
  return (
    <Container size="lg" className="py-8">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <Title size="h2">Learning Dashboard</Title>
            <Badge variant="outline">
              {overallProgress}% Complete
            </Badge>
          </Row>
          <Text variant="muted">
            Welcome to the Prime Capital training platform. Complete all competencies to become certified.
          </Text>
        </Stack>

        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <Grid cols={4} gap="lg">
              <Stack gap="xs">
                <Row gap="xs" align="center">
                  <TrendingUpIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" variant="muted">Overall Progress</Text>
                </Row>
                <Title size="h3">{overallProgress}%</Title>
                <Progress value={overallProgress} className="h-2" />
              </Stack>
              
              <Stack gap="xs">
                <Row gap="xs" align="center">
                  <BookOpenIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" variant="muted">Modules Completed</Text>
                </Row>
                <Title size="h3">{completedModules}/{totalModules}</Title>
                <Text size="xs" variant="muted">modules across all competencies</Text>
              </Stack>
              
              <Stack gap="xs">
                <Row gap="xs" align="center">
                  <ClockIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" variant="muted">Time Remaining</Text>
                </Row>
                <Title size="h3">~16 hrs</Title>
                <Text size="xs" variant="muted">estimated to completion</Text>
              </Stack>
              
              <Stack gap="xs">
                <Row gap="xs" align="center">
                  <CheckCircleIcon className="h-4 w-4 text-primary" />
                  <Text size="sm" variant="muted">Certification Status</Text>
                </Row>
                <Title size="h3">In Progress</Title>
                <Text size="xs" variant="muted">complete all competencies</Text>
              </Stack>
            </Grid>
          </CardContent>
        </Card>

        {/* Competencies Grid */}
        <Stack gap="md">
          <Title size="h4">Core Competencies</Title>
          <Grid cols={3} gap="md">
            {competencies.map((competency) => (
              <CompetencyCard key={competency.slug} competency={competency} />
            ))}
          </Grid>
        </Stack>

        {/* Next Up Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayIcon className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Row gap="md" align="center" justify="between">
              <Stack gap="xs">
                <Text weight="medium">Client Discovery</Text>
                <Text size="sm" variant="muted">
                  Module 5: Understanding Investment Goals
                </Text>
              </Stack>
              <Button nativeButton={false} render={<Link href="/learn/client-discovery/understanding-investment-goals" />}>
                Continue
              </Button>
            </Row>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

// -----------------------------------------------------------------------------
// Competency Card Component
// -----------------------------------------------------------------------------

interface CompetencyCardProps {
  competency: typeof competencies[0]
}

function CompetencyCard({ competency }: CompetencyCardProps) {
  const progress = Math.round((competency.completedModules / competency.modules) * 100)
  const Icon = competency.icon
  
  const statusConfig = {
    completed: { label: "Completed", variant: "default" as const, color: "text-success" },
    "in-progress": { label: "In Progress", variant: "secondary" as const, color: "text-warning" },
    "not-started": { label: "Not Started", variant: "outline" as const, color: "text-muted-foreground" },
  }
  
  const { label, variant, color } = statusConfig[competency.status]

  return (
    <Link href={`/learn/${competency.slug}`}>
      <Card className="competency-card h-full hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <Row gap="sm" align="start" justify="between">
            <div className={`p-2 rounded-lg bg-primary/10 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant={variant}>{label}</Badge>
          </Row>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            <Stack gap="xs">
              <Text weight="semibold">{competency.name}</Text>
              <Text size="sm" variant="muted" className="line-clamp-2">
                {competency.description}
              </Text>
            </Stack>
            
            <Stack gap="xs">
              <Row gap="sm" align="center" justify="between">
                <Text size="xs" variant="muted">
                  {competency.completedModules}/{competency.modules} modules
                </Text>
                <Text size="xs" variant="muted">
                  {competency.estimatedTime}
                </Text>
              </Row>
              <Progress value={progress} className="h-1.5" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
}
