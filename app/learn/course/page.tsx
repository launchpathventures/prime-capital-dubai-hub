/**
 * CATALYST - Course Overview Page
 *
 * About page for the learning program explaining structure and pathway.
 * Route: /learn/course
 */

import { Stack } from "@/components/core"
import { CourseHero, HowItWorks, LearningPathway } from "@/components/lms"
import { LearnShell } from "../_surface"
import { getLearnUser, getAllCompetenciesWithProgress } from "@/lib/learning"

export const metadata = {
  title: "Course Overview | Prime Capital Learning",
  description: "Master Dubai real estate excellence with our comprehensive training program.",
}

export default async function CourseOverviewPage() {
  const [user, competencies] = await Promise.all([
    getLearnUser(),
    getAllCompetenciesWithProgress(),
  ])
  
  const firstCompetencySlug = competencies[0]?.slug ?? "prime-capital-identity"
  
  return (
    <LearnShell user={user}>
      <Stack gap="none" className="min-h-full">
        <CourseHero firstCompetencySlug={firstCompetencySlug} />
        <HowItWorks />
        <LearningPathway competencies={competencies} />
      </Stack>
    </LearnShell>
  )
}
