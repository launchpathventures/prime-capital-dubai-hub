/**
 * CATALYST - Quiz Completion Page
 *
 * Celebration page after completing a behaviour knowledge check.
 */

import Link from "next/link"
import { Container, Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, ChevronRightIcon, ChevronLeftIcon } from "lucide-react"

// -----------------------------------------------------------------------------
// Quiz Data (should match quiz page)
// -----------------------------------------------------------------------------

const quizData: Record<string, {
  title: string
  behaviourTitle: string
  behaviourSlug: string
  competencySlug: string
  nextBehaviour?: {
    slug: string
    title: string
  }
}> = {
  "prime-capital-identity-our-story": {
    title: "Our Story Knowledge Check",
    behaviourTitle: "Articulates the Prime Capital Story",
    behaviourSlug: "our-story",
    competencySlug: "prime-capital-identity",
    nextBehaviour: {
      slug: "boutique-positioning",
      title: "Boutique Positioning",
    },
  },
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function QuizCompletePage({ params }: PageProps) {
  const { id: quizId } = await params
  const quiz = quizData[quizId]

  if (!quiz) {
    return (
      <Container size="md" className="py-12">
        <Stack gap="md" className="text-center">
          <Title size="h2">Quiz not found</Title>
          <Button nativeButton={false} render={<Link href="/learn" />}>
            Back to Dashboard
          </Button>
        </Stack>
      </Container>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]" style={{ backgroundColor: "#f5f5f5" }}>
      <Container size="md" className="py-16">
        <Stack gap="2xl" className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-green-500">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>

          {/* Message */}
          <Stack gap="md">
            <Title size="h1" className="text-3xl sm:text-4xl">
              Congratulations!
            </Title>
            <Text size="lg" variant="muted">
              You've completed <strong>{quiz.behaviourTitle}</strong>
            </Text>
          </Stack>

          {/* Actions */}
          <Stack gap="md">
            {quiz.nextBehaviour ? (
              <>
                <Button 
                  size="lg"
                  nativeButton={false}
                  render={<Link href={`/learn/${quiz.competencySlug}/${quiz.nextBehaviour.slug}`} />}
                  className="gap-2"
                >
                  CONTINUE TO NEXT BEHAVIOUR
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/learn/course" />}
                  className="gap-2"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                  BACK TO COMPETENCY OVERVIEW
                </Button>
              </>
            ) : (
              <Button 
                size="lg"
                nativeButton={false}
                render={<Link href="/learn/course" />}
                className="gap-2"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                BACK TO COMPETENCY OVERVIEW
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  )
}
