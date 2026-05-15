/**
 * CATALYST - Script Profile Selector + Chip
 *
 * Shared YouTube-admin UI for the Script Profile — the presenter the
 * generator writes for. The brand-level rules (banned vocabulary, investor
 * fears, CTA inventory) are identical across profiles; only the persona
 * (name, credibility, sign-off) changes.
 *
 *   <ProfileSelector> — single-select pill row, mirrors the FormatPill
 *                        pattern used in the workflow files.
 *   <ProfileChip>     — compact read-only badge for kanban + detail headers.
 */

"use client"

import * as React from "react"
import { Stack, Row, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { UserCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PROFILES,
  PROFILES_IN_DISPLAY_ORDER,
  type ProfileSlug,
} from "@/lib/youtube/profiles"

// =============================================================================
// PROFILE PILL
// =============================================================================

function ProfilePill({
  slug,
  selected,
  onSelect,
}: {
  slug: ProfileSlug
  selected: boolean
  onSelect: () => void
}) {
  const profile = PROFILES[slug]
  return (
    <button
      type="button"
      onClick={onSelect}
      title={profile.description}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all flex items-center gap-1.5",
        "hover:border-primary/60",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground"
      )}
    >
      <UserCircleIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="font-medium">{profile.displayName}</span>
      <span
        className={cn(
          "text-xs",
          selected ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        · {profile.displayRole}
      </span>
    </button>
  )
}

// =============================================================================
// PROFILE SELECTOR
// =============================================================================

export function ProfileSelector({
  value,
  onChange,
  label = "Which profile is this script for?",
  hint = "The script is written in this person's voice and credibility. Every other brand rule stays the same.",
}: {
  value: ProfileSlug
  onChange: (slug: ProfileSlug) => void
  label?: string
  hint?: string
}) {
  return (
    <Stack gap="sm">
      <Stack gap="xs">
        <Text className="font-medium">{label}</Text>
        <Text variant="muted" size="sm">
          {hint}
        </Text>
      </Stack>
      <Row gap="xs" wrap>
        {PROFILES_IN_DISPLAY_ORDER.map((slug) => (
          <ProfilePill
            key={slug}
            slug={slug}
            selected={value === slug}
            onSelect={() => onChange(slug)}
          />
        ))}
      </Row>
    </Stack>
  )
}

// =============================================================================
// PROFILE CHIP — read-only badge for cards + headers
// =============================================================================

export function ProfileChip({ slug }: { slug: ProfileSlug }) {
  const profile = PROFILES[slug]
  return (
    <Badge variant="outline" size="sm">
      <UserCircleIcon className="h-3 w-3 mr-1" />
      {profile.displayName}
    </Badge>
  )
}
