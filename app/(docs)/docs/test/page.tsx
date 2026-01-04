/**
 * CATALYST - Developer Test Page (Hidden)
 *
 * General-purpose debugging page for developers.
 * NOT listed in navigation - access via /docs/test manually.
 *
 * Use this page for:
 * - Testing new components in isolation
 * - Debugging auth/cookie issues
 * - Checking environment variables
 * - Any temporary dev utilities
 *
 * Keep this page minimal in production builds.
 */

import { Container, Stack, Text, Title } from "@/components/core"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dev Test | Catalyst",
  robots: "noindex, nofollow",
}

export default function DevTestPage() {
  const env = process.env.NODE_ENV
  const timestamp = new Date().toISOString()

  return (
    <Container size="md" className="py-12">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title size="h3">Developer Test Page</Title>
          <Text variant="muted" size="sm">
            Hidden utility page for debugging. Not listed in navigation.
          </Text>
        </Stack>

        <div className="rounded-lg border p-4 bg-muted/30">
          <Stack gap="sm">
            <Text size="sm" weight="medium">Environment Info</Text>
            <div className="font-mono text-xs space-y-1">
              <p><span className="text-muted-foreground">NODE_ENV:</span> {env}</p>
              <p><span className="text-muted-foreground">Timestamp:</span> {timestamp}</p>
            </div>
          </Stack>
        </div>

        <div className="rounded-lg border border-dashed p-8 text-center">
          <Text variant="muted" size="sm">
            Add your debugging components here.
            <br />
            This content is excluded from search indexing.
          </Text>
        </div>
      </Stack>
    </Container>
  )
}
