/**
 * CATALYST - New Script Mode Chooser
 *
 * Landing page for `/admin/youtube/new`. The user picks one of three
 * explicit entry modes — Brainstorm, Write One Script, or Review & Rewrite.
 * Each mode owns its own sub-route and workflow.
 *
 * Profile context: this route requires ?profile=tahir|ahmed. Without it we
 * bounce the user back to the picker so a presenter is always chosen before
 * a script is created.
 */

import Link from "next/link"
import { redirect } from "next/navigation"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LightbulbIcon,
  PenLineIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { PROFILES, isProfileSlug } from "@/lib/youtube/profiles"
import { ProfileChip } from "../_components/profile-selector"

export const metadata = {
  title: "New Script | YouTube | Admin",
}

type Mode = {
  href: string
  icon: React.ElementType
  title: string
  tagline: string
  description: string
  bullets: string[]
  cta: string
}

const MODES: Mode[] = [
  {
    href: "/admin/youtube/new/brainstorm",
    icon: LightbulbIcon,
    title: "Brainstorm Ideas",
    tagline: "A topic or rough thought, in — five format-tagged ideas, out.",
    description:
      "Use this when you don't yet know which angle to take. The AI explores the space and proposes a portfolio of distinct script ideas across formats.",
    bullets: [
      "Generates 5 ideas across the format portfolio",
      "Optional pre-filter by format(s)",
      "Voice note input + market scan fallback",
    ],
    cta: "Brainstorm Ideas",
  },
  {
    href: "/admin/youtube/new/single",
    icon: PenLineIcon,
    title: "Write One Script",
    tagline: "You know the angle — turn context straight into a script.",
    description:
      "Paste notes, a brief, or competitor context. The AI distils 3 angles, you confirm one, and a full script is generated end-to-end.",
    bullets: [
      "Distils your context into 3 concrete angles",
      "Confirm-or-edit step before generation",
      "Format is explicit — you choose",
    ],
    cta: "Write One Script",
  },
  {
    href: "/admin/youtube/new/review",
    icon: ShieldCheckIcon,
    title: "Review & Rewrite",
    tagline: "Bring an existing script up to the Prime Capital standard.",
    description:
      "Paste a draft you've already written or generated elsewhere. We score it against the format spec and brand guide, then rewrite to fix every issue.",
    bullets: [
      "Saves as a draft on submit",
      "Auto-validates against the format spec",
      "One-click rewrite with validator feedback",
    ],
    cta: "Review & Rewrite",
  },
]

type SearchParams = Promise<{ profile?: string }>

export default async function NewScriptModeChooserPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  if (!isProfileSlug(params.profile)) redirect("/admin/youtube")
  const profile = params.profile
  const profileMeta = PROFILES[profile]
  const profileQuery = `?profile=${profile}`

  return (
    <Container size="lg" className="py-6">
      <Stack gap="lg">
        {/* Header */}
        <Row align="center" gap="sm">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/admin/youtube${profileQuery}`} />}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Stack gap="xs" className="flex-1">
            <Title size="h3">New Script</Title>
            <Text variant="muted" size="sm">
              Pick how you want to start — each mode is purpose-built and explicit.
            </Text>
          </Stack>
          <ProfileChip slug={profile} />
        </Row>

        <Text variant="muted" size="sm">
          Writing for <span className="font-medium text-foreground">{profileMeta.displayName}</span>.
          To switch presenter, go back to the board.
        </Text>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {MODES.map((mode) => {
            const Icon = mode.icon
            return (
              <Card
                key={mode.href}
                className="group relative flex flex-col transition-all hover:border-primary/60 hover:shadow-md"
              >
                <Link
                  href={`${mode.href}${profileQuery}`}
                  className="absolute inset-0 rounded-lg"
                  aria-label={mode.title}
                />
                <CardContent className="relative pointer-events-none flex flex-col gap-4 p-6 h-full">
                  <Row align="center" gap="sm">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Title size="h5" className="leading-tight">
                      {mode.title}
                    </Title>
                  </Row>

                  <Text size="sm" className="font-medium leading-snug">
                    {mode.tagline}
                  </Text>

                  <Text variant="muted" size="sm" className="leading-relaxed">
                    {mode.description}
                  </Text>

                  <ul className="space-y-1.5">
                    {mode.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                        <Text variant="muted" size="sm" className="leading-relaxed">
                          {b}
                        </Text>
                      </li>
                    ))}
                  </ul>

                  <div className="flex-1" />

                  <Row align="center" className="justify-between pt-2 border-t">
                    <Text size="sm" className="font-medium text-primary">
                      {mode.cta}
                    </Text>
                    <ArrowRightIcon className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  </Row>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Stack>
    </Container>
  )
}
