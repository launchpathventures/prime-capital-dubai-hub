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
  GraduationCapIcon,
  TargetIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// User Data Fetching
// -----------------------------------------------------------------------------

async function getUserName(): Promise<string> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const displayName =
        user.user_metadata?.display_name ??
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        "there"
      return displayName
    }
  } catch {
    // Fall through to default
  }

  return "there"
}

// -----------------------------------------------------------------------------
// Competency Data (mock - would come from database)
// -----------------------------------------------------------------------------

const competencies = [
  {
    slug: "prime-capital-identity",
    name: "Prime Capital Identity",
    description: "Who we are and what makes us different",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "45 min",
    status: "not-started" as const,
  },
  {
    slug: "market-intelligence",
    name: "Market Intelligence",
    description: "Why Dubai? Why now?",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "50 min",
    status: "not-started" as const,
  },
  {
    slug: "client-discovery",
    name: "Client Discovery",
    description: "Understanding client needs",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "50 min",
    status: "not-started" as const,
  },
  {
    slug: "property-matching",
    name: "Property Matching",
    description: "Connecting clients with opportunities",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "55 min",
    status: "not-started" as const,
  },
  {
    slug: "objection-navigation",
    name: "Objection Navigation",
    description: "Addressing concerns with expertise",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "55 min",
    status: "not-started" as const,
  },
  {
    slug: "transaction-excellence",
    name: "Transaction Excellence",
    description: "Guiding the process",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "55 min",
    status: "not-started" as const,
  },
  {
    slug: "relationship-building",
    name: "Relationship Building",
    description: "Creating lasting partnerships",
    behaviours: 5,
    completedBehaviours: 0,
    estimatedTime: "40 min",
    status: "not-started" as const,
  },
]

// Calculate overall progress
const totalCompetencies = competencies.length
const completedCompetencies = competencies.filter((c) => c.status === "completed").length
const totalBehaviours = competencies.reduce((sum, c) => sum + c.behaviours, 0)
const completedBehaviours = competencies.reduce((sum, c) => sum + c.completedBehaviours, 0)
const overallProgress = totalBehaviours > 0 ? Math.round((completedBehaviours / totalBehaviours) * 100) : 0

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function LearnDashboardPage() {
  const userName = await getUserName()

  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
      <Container size="lg" className="py-8 sm:py-12">
        <Stack gap="xl">
          {/* Welcome Section */}
          <Stack gap="md" className="text-center max-w-2xl mx-auto">
            <Title size="h1" className="text-4xl sm:text-5xl">
              Welcome back, {userName}
            </Title>
            <Text size="lg" variant="muted">
              Continue your journey to becoming a Prime Capital expert.
            </Text>
          </Stack>

          {/* New to Platform Card */}
          <Card className="border-2">
            <CardContent className="py-6">
              <Row gap="lg" align="center" justify="between" className="flex-col sm:flex-row">
                <Row gap="md" align="center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted shrink-0">
                    <GraduationCapIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Stack gap="xs">
                    <Text weight="semibold" size="lg">
                      New to the platform?
                    </Text>
                    <Text size="sm" variant="muted">
                      Take a quick 2-minute tour to understand how your training works.
                    </Text>
                  </Stack>
                </Row>
                <Button variant="secondary" className="shrink-0">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Tour
                </Button>
              </Row>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Stack gap="md">
            <Title size="h3">Your Progress</Title>
            <Grid cols={3} gap="md" className="grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Stack gap="sm">
                    <Title size="h2" className="text-4xl">
                      {overallProgress}%
                    </Title>
                    <Text variant="muted">Overall Complete</Text>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Stack gap="sm">
                    <Title size="h2" className="text-4xl">
                      {completedCompetencies}/{totalCompetencies}
                    </Title>
                    <Text variant="muted">Competencies</Text>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Stack gap="sm">
                    <Title size="h2" className="text-4xl">
                      {completedBehaviours}/{totalBehaviours}
                    </Title>
                    <Text variant="muted">Behaviours</Text>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Stack>

          {/* Your Courses */}
          <Stack gap="md">
            <Title size="h3">Your Courses</Title>
            
            {/* Main Course Card */}
            <Card className="overflow-hidden">
              {/* Hero Image */}
              <div
                className="h-48 sm:h-64 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80')",
                }}
              />
              
              <CardContent className="pt-6">
                <Stack gap="md">
                  <Badge variant="secondary" className="w-fit">
                    REQUIRED TRAINING
                  </Badge>
                  
                  <Stack gap="sm">
                    <Title size="h3">Real Estate Consultant Certification</Title>
                    <Text variant="muted">
                      Master the 7 core competencies and 35 key behaviours that define a Prime Capital consultant.
                    </Text>
                  </Stack>

                  <Row gap="lg" className="flex-wrap">
                    <Row gap="xs" align="center">
                      <TargetIcon className="h-4 w-4 text-muted-foreground" />
                      <Text size="sm" variant="muted">
                        {totalCompetencies} Competencies
                      </Text>
                    </Row>
                    <Row gap="xs" align="center">
                      <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                      <Text size="sm" variant="muted">
                        {totalBehaviours} Behaviours
                      </Text>
                    </Row>
                  </Row>

                  <Stack gap="xs">
                    <Row gap="sm" align="center" justify="between">
                      <Text size="sm" variant="muted">
                        Progress
                      </Text>
                      <Text size="sm" variant="muted">
                        Not started
                      </Text>
                    </Row>
                    <Progress value={overallProgress} className="h-2" />
                  </Stack>

                  <div className="pt-2">
                    <Button size="lg" nativeButton={false} render={<Link href="/learn/course" />}>
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Competency Card Component (Removed - no longer used in dashboard)
// -----------------------------------------------------------------------------

