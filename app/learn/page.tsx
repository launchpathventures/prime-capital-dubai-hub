/**
 * CATALYST - Learn Dashboard Page
 *
 * Learning portal dashboard showing overall progress and courses.
 * Route: /learn
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PlayIcon,
  BookOpenIcon,
  GraduationCapIcon,
  TargetIcon,
  ArrowRightIcon,
} from "lucide-react"
import { LearnShell } from "./_surface"
import { getLearnUser, getUserLearningStats } from "@/lib/learning"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/lms"

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function LearnDashboardPage() {
  const user = await getLearnUser()
  const userId = await getUserId()
  
  // Get real progress stats from database
  const stats = userId
    ? await getUserLearningStats(userId)
    : {
        overallProgressPercent: 0,
        completedCompetencies: 0,
        totalCompetencies: 7,
        completedModules: 0,
        totalModules: 35,
      }
  
  const hasStarted = stats.completedModules > 0 || stats.overallProgressPercent > 0

  return (
    <LearnShell user={user}>
      <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
        <Container size="lg" className="py-8 sm:py-12">
          <Stack gap="xl">
            {/* Welcome Section */}
            <Stack gap="md" className="text-center max-w-2xl mx-auto">
              <Title size="h1" className="text-4xl sm:text-5xl">
                Welcome back, {user.name}
              </Title>
              <Text size="lg" variant="muted">
                Continue your journey to becoming a Prime Capital expert.
              </Text>
            </Stack>

            {/* Onboarding Prompt (show only if not started) */}
            {!hasStarted && (
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
            )}

            {/* Progress Overview */}
            <Stack gap="md">
              <Title size="h3">Your Progress</Title>
              <DashboardStats />
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
                          {stats.totalCompetencies} Competencies
                        </Text>
                      </Row>
                      <Row gap="xs" align="center">
                        <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                        <Text size="sm" variant="muted">
                          {stats.totalModules} Behaviours
                        </Text>
                      </Row>
                    </Row>

                    <Stack gap="xs">
                      <Row gap="sm" align="center" justify="between">
                        <Text size="sm" variant="muted">
                          Progress
                        </Text>
                        <Text size="sm" variant="muted">
                          {hasStarted ? `${stats.overallProgressPercent}% complete` : "Not started"}
                        </Text>
                      </Row>
                      <Progress value={stats.overallProgressPercent} className="h-2" />
                    </Stack>

                    <div className="pt-2">
                      <Button size="lg" nativeButton={false} render={<Link href="/learn/course" />}>
                        {hasStarted ? (
                          <>
                            Continue Course
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Start Course
                          </>
                        )}
                      </Button>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Container>
      </div>
    </LearnShell>
  )
}
