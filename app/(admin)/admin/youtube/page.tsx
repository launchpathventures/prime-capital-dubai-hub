/**
 * CATALYST - YouTube Scripts Admin Page
 *
 * Two views on one route, switched by ?profile=:
 *   - No profile         → Profile picker (which person are you working on?)
 *   - ?profile=tahir|ahmed → That presenter's Kanban (server-filtered)
 *
 * Script detail, new-script flows, and the Kanban itself all consume the
 * profile via ?profile= so the chosen presenter persists across navigation.
 */

import Link from "next/link"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon, UserCircleIcon } from "lucide-react"
import { YouTubeClient } from "./youtube-client"
import { getYouTubeScripts } from "@/lib/actions/youtube"
import {
  PROFILES,
  PROFILES_IN_DISPLAY_ORDER,
  isProfileSlug,
  type ProfileSlug,
} from "@/lib/youtube/profiles"

export const metadata = {
  title: "YouTube Scripts | Admin",
}

export const dynamic = "force-dynamic"

type SearchParams = Promise<{ profile?: string }>

export default async function YouTubeAdminPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const profile: ProfileSlug | null = isProfileSlug(params.profile)
    ? params.profile
    : null

  if (!profile) {
    return (
      <Container size="lg" className="py-6">
        <ProfilePicker />
      </Container>
    )
  }

  const result = await getYouTubeScripts({ profileSlug: profile })
  const scripts = result.success ? result.data : []

  return (
    <Container size="xl" className="py-6">
      {!result.success && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load scripts: {result.error}
        </div>
      )}
      <YouTubeClient initialScripts={scripts} profile={profile} />
    </Container>
  )
}

// =============================================================================
// PROFILE PICKER
// =============================================================================

function ProfilePicker() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Title size="h3">YouTube Scripts</Title>
        <Text variant="muted" size="sm">
          Pick who you&rsquo;re writing for. Each presenter has their own script board.
        </Text>
      </Stack>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {PROFILES_IN_DISPLAY_ORDER.map((slug) => {
          const profile = PROFILES[slug]
          return (
            <Card
              key={slug}
              className="group relative flex flex-col transition-all hover:border-primary/60 hover:shadow-md"
            >
              <Link
                href={`/admin/youtube?profile=${slug}`}
                className="absolute inset-0 rounded-lg"
                aria-label={`Open ${profile.displayName}'s board`}
              />
              <CardContent className="relative pointer-events-none flex flex-col gap-4 p-6 h-full">
                <Row align="center" gap="sm">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <UserCircleIcon className="h-5 w-5" />
                  </div>
                  <Stack gap="xs" className="min-w-0">
                    <Title size="h5" className="leading-tight">
                      {profile.displayName}
                    </Title>
                    <Text variant="muted" size="sm" className="leading-tight">
                      {profile.displayRole}
                    </Text>
                  </Stack>
                </Row>

                <Text variant="muted" size="sm" className="leading-relaxed">
                  {profile.description}
                </Text>

                <div className="flex-1" />

                <Row align="center" className="justify-between pt-2 border-t">
                  <Text size="sm" className="font-medium text-primary">
                    Open board
                  </Text>
                  <ArrowRightIcon className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Row>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </Stack>
  )
}
