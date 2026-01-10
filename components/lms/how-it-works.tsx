/**
 * CATALYST - How It Works
 *
 * Shows the 4-step learning process for the course overview page.
 */

import { Stack, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpenIcon, 
  MessageSquareIcon, 
  ClipboardCheckIcon, 
  UsersIcon 
} from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Study the Content",
    description: "Learn key concepts, scripts, and processes through structured modules.",
    icon: BookOpenIcon,
  },
  {
    number: 2,
    title: "Practice with AI Clients",
    description: "Rehearse real conversations with AI-powered client simulations.",
    icon: MessageSquareIcon,
  },
  {
    number: 3,
    title: "Test Your Knowledge",
    description: "Validate understanding with knowledge checks after each module.",
    icon: ClipboardCheckIcon,
  },
  {
    number: 4,
    title: "Apply in Real Conversations",
    description: "Use your skills with actual clients and get feedback.",
    icon: UsersIcon,
  },
]

export function HowItWorks() {
  return (
    <Stack gap="lg" className="py-12 px-4 bg-muted/30">
      <Title size="h2" align="center">
        How It Works
      </Title>
      
      <Grid cols={4} gap="md" className="sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <Card key={step.number} className="border bg-background">
            <CardContent className="p-6 text-center">
              <Stack gap="md" align="center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-muted-foreground" />
                <Stack gap="xs">
                  <Text weight="semibold">{step.title}</Text>
                  <Text size="sm" className="text-muted-foreground">
                    {step.description}
                  </Text>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Stack>
  )
}
