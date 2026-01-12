/**
 * CATALYST - How It Works
 *
 * Shows the 4-step learning process for the course overview page.
 * Uses Prime Capital brand design system.
 */

import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { 
  HeadphonesIcon, 
  BookOpenIcon, 
  ClipboardCheckIcon, 
  MessageSquareIcon 
} from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Listen & Learn",
    description: "Absorb key concepts through audio-first coaching from experienced consultants.",
    icon: HeadphonesIcon,
  },
  {
    number: 2,
    title: "Read & Review",
    description: "Dive deeper into scripts, processes, and detailed reference materials.",
    icon: BookOpenIcon,
  },
  {
    number: 3,
    title: "Test Your Knowledge",
    description: "Validate understanding with knowledge checks after each module.",
    icon: ClipboardCheckIcon,
  },
  {
    number: 4,
    title: "Practice & Apply",
    description: "Use your skills with real clients and get feedback from your team.",
    icon: MessageSquareIcon,
  },
]

export function HowItWorks() {
  return (
    <div className="py-16 sm:py-20 bg-muted/30">
      <Container size="lg">
        <Stack gap="xl">
          {/* Section Header */}
          <Stack gap="sm" className="text-center">
            <Title size="h2" className="font-serif font-normal text-3xl sm:text-4xl">
              How It Works
            </Title>
            <Text className="text-muted-foreground max-w-lg mx-auto">
              Four simple steps to master the Prime Capital approach.
            </Text>
          </Stack>
          
          {/* Steps Grid */}
          <Grid cols={4} gap="lg" className="sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Stack key={step.number} gap="md" className="text-center">
                {/* Icon with number overlay */}
                <div className="relative mx-auto">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-background border border-border shadow-sm">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                
                {/* Content */}
                <Stack gap="xs">
                  <Text weight="semibold" className="text-foreground">
                    {step.title}
                  </Text>
                  <Text size="sm" className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </div>
  )
}
