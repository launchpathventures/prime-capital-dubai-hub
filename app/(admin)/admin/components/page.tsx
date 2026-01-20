/**
 * Components Demo Page
 *
 * Interactive showcase of UI components included in the admin.
 */

import { config } from "@/lib/config"
import { Container, Stack, Text, Title } from "@/components/core"
import { ComponentExample } from "@/components/component-example"

export const metadata = {
  title: `Components | ${config.app.name}`,
  description: "Explore the UI components available in the admin",
}

export default function ComponentsPage() {
  return (
    <Container size="lg" className="py-6">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Title size="h3">Components</Title>
          <Text variant="muted">
            Explore the available UI components.
          </Text>
        </Stack>

        {/* Component Showcase */}
        <ComponentExample />
      </Stack>
    </Container>
  )
}
