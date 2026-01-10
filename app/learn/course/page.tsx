/**
 * CATALYST - Course Home Page
 *
 * Overview of the Real Estate Consultant Certification course.
 * Shows course structure, learning pathway, and getting started.
 */

import Link from "next/link"
import { Container, Stack, Grid, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpenIcon,
  ClipboardCheckIcon,
  TargetIcon,
  ClockIcon,
  CheckIcon,
  GraduationCapIcon,
  LightbulbIcon,
  MessageSquareIcon,
} from "lucide-react"
import { LearnShell } from "../_surface"
import { getLearnUser } from "@/lib/learning"

// -----------------------------------------------------------------------------
// Course Data
// -----------------------------------------------------------------------------

const courseData = {
  title: "Real Estate Consultant Certification",
  subtitle: "Master the essential competencies that define a Prime Capital consultant. From understanding our unique identity to building lasting client relationships, this certification covers everything you need to succeed.",
  stats: {
    competencies: 7,
    behaviours: 35,
    totalHours: 8,
  },
  learningPathway: [
    {
      number: 1,
      slug: "prime-capital-identity",
      title: "Prime Capital Identity",
      description: "Who we are and what makes us different",
      behaviours: 5,
      duration: "45 min",
      locked: false,
    },
    {
      number: 2,
      slug: "market-intelligence",
      title: "Market Intelligence",
      description: "Why Dubai? Why now?",
      behaviours: 5,
      duration: "50 min",
      locked: true,
    },
    {
      number: 3,
      slug: "client-discovery",
      title: "Client Discovery",
      description: "Understanding client needs",
      behaviours: 5,
      duration: "50 min",
      locked: true,
    },
    {
      number: 4,
      slug: "property-matching",
      title: "Property Matching",
      description: "Connecting clients with opportunities",
      behaviours: 5,
      duration: "55 min",
      locked: true,
    },
    {
      number: 5,
      slug: "objection-navigation",
      title: "Objection Navigation",
      description: "Addressing concerns with expertise",
      behaviours: 5,
      duration: "55 min",
      locked: true,
    },
    {
      number: 6,
      slug: "transaction-excellence",
      title: "Transaction Excellence",
      description: "Guiding the process",
      behaviours: 5,
      duration: "55 min",
      locked: true,
    },
    {
      number: 7,
      slug: "relationship-building",
      title: "Relationship Building",
      description: "Creating lasting partnerships",
      behaviours: 5,
      duration: "40 min",
      locked: true,
    },
  ],
  whatYoullLearn: [
    "Confidently articulate the Prime Capital story and value proposition",
    "Demonstrate expert knowledge of Dubai's real estate market dynamics",
    "Conduct effective client discovery conversations",
    "Match clients with ideal properties based on their unique needs",
    "Navigate objections with empathy and expertise",
    "Guide clients smoothly through the transaction process",
    "Build lasting relationships that generate referrals",
  ],
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function CourseHomePage() {
  const user = await getLearnUser()

  return (
    <LearnShell user={user}>
      <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80')",
        }}
      >
        <Container size="lg" className="h-full flex items-center justify-center text-center">
          <Stack gap="lg" className="max-w-3xl">
            <Badge variant="secondary" className="mx-auto">
              REQUIRED TRAINING
            </Badge>
            <Title size="h1" className="text-white text-4xl sm:text-5xl">
              {courseData.title}
            </Title>
            <Text size="lg" className="text-white/90">
              {courseData.subtitle}
            </Text>
            <Row gap="lg" align="center" justify="center" className="flex-wrap">
              <Row gap="xs" align="center" className="text-white">
                <TargetIcon className="h-5 w-5" />
                <Text size="sm">{courseData.stats.competencies} Competencies</Text>
              </Row>
              <Row gap="xs" align="center" className="text-white">
                <BookOpenIcon className="h-5 w-5" />
                <Text size="sm">{courseData.stats.behaviours} Key Behaviours</Text>
              </Row>
              <Row gap="xs" align="center" className="text-white">
                <ClockIcon className="h-5 w-5" />
                <Text size="sm">~{courseData.stats.totalHours} Hours Total</Text>
              </Row>
            </Row>
            <div>
              <Button 
                size="lg" 
                nativeButton={false}
                render={<Link href="/learn/prime-capital-identity" />}
                className="gap-2"
              >
                <GraduationCapIcon className="h-5 w-5" />
                START LEARNING
              </Button>
            </div>
          </Stack>
        </Container>
      </div>

      {/* Content Sections */}
      <div style={{ backgroundColor: "#f5f5f5" }} className="py-12">
        <Container size="lg">
          <Stack gap="2xl">
            {/* How This Course Works */}
            <Stack gap="lg">
              <Title size="h2" className="text-center">
                How This Course Works
              </Title>
              <Grid cols={3} gap="md" className="grid-cols-1 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Stack gap="md">
                      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                        <BookOpenIcon className="h-8 w-8 text-primary" />
                      </div>
                      <Stack gap="sm">
                        <Text weight="semibold" size="lg">
                          Learn
                        </Text>
                        <Text size="sm" variant="muted">
                          Each module presents essential concepts with real-world context and examples from Prime Capital's experience.
                        </Text>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Stack gap="md">
                      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                        <ClipboardCheckIcon className="h-8 w-8 text-primary" />
                      </div>
                      <Stack gap="sm">
                        <Text weight="semibold" size="lg">
                          Practice
                        </Text>
                        <Text size="sm" variant="muted">
                          Apply what you've learned through AI-powered simulations — practice client conversations before the real thing.
                        </Text>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Stack gap="md">
                      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                        <TargetIcon className="h-8 w-8 text-primary" />
                      </div>
                      <Stack gap="sm">
                        <Text weight="semibold" size="lg">
                          Prove
                        </Text>
                        <Text size="sm" variant="muted">
                          Demonstrate your understanding through short assessments. Pass all 35 behaviours to earn your certification.
                        </Text>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Stack>

            {/* What You'll Learn */}
            <Stack gap="lg">
              <Title size="h2" className="text-center">
                What You'll Learn
              </Title>
              <Card>
                <CardContent className="pt-6">
                  <Stack gap="sm">
                    {courseData.whatYoullLearn.map((item, index) => (
                      <Row key={index} gap="sm" align="start">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 shrink-0 mt-0.5">
                          <CheckIcon className="h-4 w-4 text-primary" />
                        </div>
                        <Text>{item}</Text>
                      </Row>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* Your Learning Pathway */}
            <Stack gap="lg">
              <div>
                <Title size="h2" className="mb-2">
                  Your Learning Pathway
                </Title>
                <Text variant="muted">
                  Complete each competency in order. Each competency contains 5 key behaviours that build upon each other. Master all behaviours to unlock the next competency.
                </Text>
              </div>
              <Stack gap="sm">
                {courseData.learningPathway.map((competency) => (
                  <Card 
                    key={competency.slug}
                    className={competency.locked ? "opacity-60" : ""}
                  >
                    <CardContent className="py-4">
                      <Row gap="md" align="center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                          <Text weight="semibold">{competency.number}</Text>
                        </div>
                        <Stack gap="xs" className="flex-1 min-w-0">
                          <Row gap="sm" align="center" className="flex-wrap">
                            <Text weight="semibold">{competency.title}</Text>
                            {competency.locked && (
                              <Badge variant="outline" className="text-xs">
                                COMING SOON
                              </Badge>
                            )}
                          </Row>
                          <Text size="sm" variant="muted">
                            {competency.description}
                          </Text>
                          <Row gap="sm" className="text-muted-foreground">
                            <Text size="xs">{competency.behaviours} behaviours</Text>
                            <Text size="xs">•</Text>
                            <Text size="xs">{competency.duration}</Text>
                          </Row>
                        </Stack>
                      </Row>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>

            {/* Ready to Begin CTA */}
            <Card className="bg-[#525252] text-white border-0">
              <CardContent className="pt-8 pb-8 text-center">
                <Stack gap="lg">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-lg bg-white/10">
                    <GraduationCapIcon className="h-8 w-8" />
                  </div>
                  <Stack gap="sm">
                    <Title size="h2" className="text-white">
                      Ready to Begin?
                    </Title>
                    <Text className="text-white/90">
                      Start with Competency 1: Prime Capital Identity and take your first steps toward certification.
                    </Text>
                  </Stack>
                  <div>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      nativeButton={false}
                      render={<Link href="/learn/prime-capital-identity" />}
                      className="gap-2"
                    >
                      <GraduationCapIcon className="h-5 w-5" />
                      START LEARNING NOW
                    </Button>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </div>
      </div>
    </LearnShell>
  )
}
