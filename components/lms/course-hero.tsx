/**
 * CATALYST - Course Hero
 *
 * Hero section for the Course Overview page with title, description, and CTA.
 * Uses Prime Capital brand typography (Palatino headlines, Lato body).
 */

import Link from "next/link"
import { Container, Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, GraduationCapIcon } from "lucide-react"

interface CourseHeroProps {
  firstCompetencySlug: string
}

export function CourseHero({ firstCompetencySlug }: CourseHeroProps) {
  return (
    <div 
      className="relative bg-primary py-16 sm:py-24 overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Container size="md">
        <Stack gap="lg" className="text-center">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
              <GraduationCapIcon className="h-4 w-4 text-primary-foreground/80" />
              <Text size="xs" className="uppercase tracking-widest text-primary-foreground/80 font-medium">
                Prime Capital Learning Academy
              </Text>
            </div>
          </div>
          
          {/* Headline */}
          <Title 
            size="h1" 
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-primary-foreground max-w-3xl mx-auto leading-tight"
          >
            Master Dubai Real Estate Excellence
          </Title>
          
          {/* Description */}
          <Text size="lg" className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            A comprehensive training program designed to transform you into a 
            knowledgeable, confident, and effective Prime Capital team member.
          </Text>
          
          {/* CTA */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="gap-2 bg-background text-primary hover:bg-background/90"
              render={<Link href={`/learn/${firstCompetencySlug}`} />}
            >
              Start Learning
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Stack>
      </Container>
    </div>
  )
}
