/**
 * CATALYST - Course Hero
 *
 * Hero section for the Course Overview page with title, description, and CTA.
 */

import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

interface CourseHeroProps {
  firstCompetencySlug: string
}

export function CourseHero({ firstCompetencySlug }: CourseHeroProps) {
  return (
    <Stack gap="lg" className="text-center py-12 px-4">
      <Text size="xs" className="uppercase tracking-widest text-primary">
        Prime Capital Learning Academy
      </Text>
      
      <Title size="h1" className="text-4xl sm:text-5xl font-bold max-w-3xl mx-auto">
        Master Dubai Real Estate Excellence
      </Title>
      
      <Text size="lg" className="text-muted-foreground max-w-2xl mx-auto">
        A comprehensive training program designed to transform you into a 
        knowledgeable, confident, and effective Prime Capital team member.
      </Text>
      
      <Button 
        size="lg" 
        className="mx-auto gap-2"
        nativeButton={false}
        render={<Link href={`/learn/${firstCompetencySlug}`} />}
      >
        Start Learning
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </Stack>
  )
}
