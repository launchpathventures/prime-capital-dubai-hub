/**
 * CATALYST - Empty State
 */

import Link from "next/link"
import { Stack, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack gap="md" align="center" className="py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50" />
      <Stack gap="xs">
        <Title size="h3">{title}</Title>
        <Text className="text-muted-foreground max-w-md">
          {description}
        </Text>
      </Stack>
      {action && (
        <Button nativeButton={false} render={<Link href={action.href} />}>
          {action.label}
        </Button>
      )}
    </Stack>
  )
}
