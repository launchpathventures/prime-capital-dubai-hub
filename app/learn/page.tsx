/**
 * CATALYST - Learn Dashboard Page
 *
 * Learning portal dashboard matching the Prime Capital Learning design.
 * Features welcome message, progress overview, and course cards.
 */

import Link from "next/link"
import { Container, Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCapIcon,
  PlayCircleIcon,
  ChevronRightIcon,
  TargetIcon,
  BookOpenIcon,
} from "lucide-react"

// -----------------------------------------------------------------------------
// Course Data (mock - would come from database)
// -----------------------------------------------------------------------------

const courseData = {
  title: "Real Estate Consultant Certification",
  description: "Master the 7 core competencies and 35 key behaviours that define a Prime Capital consultant.",
  competencies: 7,
  behaviours: 35,
  completedCompetencies: 0,
  completedBehaviours: 0,
}

// Calculate overall progress
const overallProgress = Math.round(
  (courseData.completedBehaviours / courseData.behaviours) * 100
)

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default function LearnDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F2EFEA]">
      <Container size="md" className="py-12 px-4 md:px-6">
        <Stack gap="xl">
          {/* Welcome Header */}
          <Stack gap="sm">
            <h1 className="font-headline text-4xl md:text-5xl text-[#3F4142] tracking-tight">
              Welcome back, Sarah
            </h1>
            <Text className="text-[#576C75] text-lg">
              Continue your journey to becoming a Prime Capital expert.
            </Text>
          </Stack>

          {/* Tour Card */}
          <Card className="bg-white border-[#E5E2DD] rounded-[2px]">
            <CardContent className="py-5 px-6">
              <Row gap="md" align="center" justify="between" className="flex-wrap">
                <Row gap="md" align="center">
                  <div className="w-12 h-12 rounded-full bg-[#576C75]/10 flex items-center justify-center">
                    <GraduationCapIcon className="h-6 w-6 text-[#576C75]" />
                  </div>
                  <Stack gap="none">
                    <Text weight="medium" className="text-[#3F4142]">
                      New to the platform?
                    </Text>
                    <Text size="sm" className="text-[#576C75]">
                      Take a quick 2-minute tour to understand how your training works.
                    </Text>
                  </Stack>
                </Row>
                <Button 
                  className="bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px] gap-2"
                >
                  <PlayCircleIcon className="h-4 w-4" />
                  Start Tour
                </Button>
              </Row>
            </CardContent>
          </Card>

          {/* Your Progress */}
          <Stack gap="md">
            <h2 className="font-headline text-xl text-[#3F4142]">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border-[#E5E2DD] rounded-[2px]">
                <CardContent className="py-6 text-center">
                  <Text className="font-headline text-4xl text-[#3F4142]">
                    {overallProgress}%
                  </Text>
                  <Text size="sm" className="text-[#576C75] mt-1">
                    Overall Complete
                  </Text>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#E5E2DD] rounded-[2px]">
                <CardContent className="py-6 text-center">
                  <Text className="font-headline text-4xl text-[#3F4142]">
                    {courseData.completedCompetencies}/{courseData.competencies}
                  </Text>
                  <Text size="sm" className="text-[#576C75] mt-1">
                    Competencies
                  </Text>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#E5E2DD] rounded-[2px]">
                <CardContent className="py-6 text-center">
                  <Text className="font-headline text-4xl text-[#3F4142]">
                    {courseData.completedBehaviours}/{courseData.behaviours}
                  </Text>
                  <Text size="sm" className="text-[#576C75] mt-1">
                    Behaviours
                  </Text>
                </CardContent>
              </Card>
            </div>
          </Stack>

          {/* Your Courses */}
          <Stack gap="md">
            <h2 className="font-headline text-xl text-[#3F4142]">Your Courses</h2>
            <Card className="bg-white border-[#E5E2DD] rounded-[2px] overflow-hidden">
              {/* Course Image - Dubai Skyline gradient placeholder */}
              <div 
                className="relative h-48 md:h-64 w-full"
                style={{
                  background: "linear-gradient(135deg, #576C75 0%, #A6B5B0 50%, #F2EFEA 100%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Course Content */}
              <CardContent className="p-6">
                <Stack gap="md">
                  <Badge 
                    variant="outline" 
                    className="w-fit border-[#576C75]/30 text-[#576C75] rounded-[2px] text-xs uppercase tracking-wider"
                  >
                    Required Training
                  </Badge>
                  
                  <h3 className="font-headline text-2xl text-[#3F4142]">
                    {courseData.title}
                  </h3>
                  
                  <Text className="text-[#576C75]">
                    {courseData.description}
                  </Text>
                  
                  <Row gap="md" align="center">
                    <Row gap="xs" align="center">
                      <TargetIcon className="h-4 w-4 text-[#576C75]" />
                      <Text size="sm" className="text-[#576C75]">
                        {courseData.competencies} Competencies
                      </Text>
                    </Row>
                    <Row gap="xs" align="center">
                      <BookOpenIcon className="h-4 w-4 text-[#576C75]" />
                      <Text size="sm" className="text-[#576C75]">
                        {courseData.behaviours} Behaviours
                      </Text>
                    </Row>
                  </Row>
                  
                  <Stack gap="xs">
                    <Row align="center" justify="between">
                      <Progress value={overallProgress} className="h-1.5 flex-1 mr-4" />
                      <Text size="sm" className="text-[#576C75]">
                        {overallProgress > 0 ? `${overallProgress}% complete` : "Not started"}
                      </Text>
                    </Row>
                  </Stack>
                  
                  <Button 
                    nativeButton={false}
                    render={<Link href="/learn/prime-capital-identity" />}
                    className="w-fit bg-[#576C75] hover:bg-[#4a5d65] text-white rounded-[2px] gap-2 mt-2"
                  >
                    Start Course
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  )
}
