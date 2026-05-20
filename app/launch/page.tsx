/**
 * CATALYST - Launch / Surface Picker
 *
 * Shown after login to users with access to more than one surface. Each card
 * is labelled by what it does ("YouTube Generator", "Learning Portal") rather
 * than its internal route group, so users who don't recognise "admin" still
 * find the right destination.
 *
 * Single-surface users are bounced straight to their surface — they should
 * never land here.
 */

import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"
import { getUserWithProfile } from "@/lib/auth/require-auth"
import { getAccessibleSurfaces, type AppRole } from "@/lib/auth/surfaces"
import {
  Center,
  Container,
  Grid,
  Row,
  Stack,
  Text,
  Title,
} from "@/components/core"
import { Card } from "@/components/ui/card"
import { config } from "@/lib/config"

export const metadata = {
  title: `Choose a workspace | ${config.app.name}`,
}

export default async function LaunchPage() {
  const { profile } = await getUserWithProfile()

  const role = (profile?.role as AppRole | undefined) ?? "learner"
  const surfaces = getAccessibleSurfaces(role)

  if (surfaces.length <= 1) {
    redirect(surfaces[0]?.href ?? "/learn")
  }

  const firstName = profile?.full_name?.split(" ")[0]

  return (
    <main className="launch min-h-screen bg-background flex items-center justify-center p-6">
      <Container size="md">
        <Stack gap="2xl" align="stretch">
          <Stack gap="lg" align="center">
            <Link href="/launch" className="launch__logo">
              <Image
                src="/logo.svg"
                alt="Prime Capital"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <Stack gap="xs" align="center">
              <Title size="h1" align="center">
                {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
              </Title>
              <Text variant="muted" align="center">
                Choose where you&apos;d like to go.
              </Text>
            </Stack>
          </Stack>

          <Grid cols={surfaces.length >= 3 ? 3 : 2} gap="md">
            {surfaces.map((surface) => {
              const Icon = surface.icon
              return (
                <Link
                  key={surface.id}
                  href={surface.href}
                  className="launch-card group"
                >
                  <Card className="h-full p-6 transition hover:border-primary hover:shadow-md">
                    <Stack gap="md">
                      <Center className="h-12 w-12 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </Center>
                      <Stack gap="xs">
                        <Title size="h4">{surface.title}</Title>
                        <Text size="sm" variant="muted">
                          {surface.description}
                        </Text>
                      </Stack>
                      <Row
                        gap="xs"
                        align="center"
                        className="text-primary transition group-hover:translate-x-1"
                      >
                        <Text size="sm" weight="medium" variant="primary">
                          Open
                        </Text>
                        <ArrowRightIcon className="h-4 w-4" />
                      </Row>
                    </Stack>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </Stack>
      </Container>
    </main>
  )
}
