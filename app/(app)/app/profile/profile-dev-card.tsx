/**
 * CATALYST - Profile Dev Card
 *
 * Development helper card showing profile capabilities based on auth mode.
 * Explains what's possible (read-only demo vs. full Supabase integration).
 */

"use client"

import { Text, Stack, Row } from "@/components/core"
import { DevCard, DevCardBadge } from "@/components/shared"
import {
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
} from "lucide-react"
import { type AuthMode } from "@/lib/auth/config"
import { authModeConfigs } from "@/app/(auth)/_surface/auth-modes"

// -----------------------------------------------------------------------------
// Profile Feature Configurations (per mode)
// -----------------------------------------------------------------------------

type ProfileFeatures = {
  viewProfile: boolean
  updateName: boolean
  updateEmail: boolean
  updatePassword: boolean
  deleteAccount: boolean
}

type ProfileModeConfig = {
  description: string
  hint: string
  features: ProfileFeatures
}

const profileModeConfigs: Record<AuthMode, ProfileModeConfig> = {
  demo: {
    description: "View-only mode with mock data. No changes are persisted.",
    hint: "Switch to Supabase mode for real profile management.",
    features: {
      viewProfile: true,
      updateName: false,
      updateEmail: false,
      updatePassword: false,
      deleteAccount: false,
    },
  },
  password: {
    description: "Simple session auth. Profile data is read-only.",
    hint: "User data comes from session, not a database.",
    features: {
      viewProfile: true,
      updateName: false,
      updateEmail: false,
      updatePassword: false,
      deleteAccount: false,
    },
  },
  supabase: {
    description: "Full profile management via Supabase Auth API.",
    hint: "Changes to email trigger verification emails.",
    features: {
      viewProfile: true,
      updateName: true,
      updateEmail: true,
      updatePassword: true,
      deleteAccount: true,
    },
  },
  custom: {
    description: "Using custom auth endpoint. Profile features depend on your API.",
    hint: "Implement profile endpoints in your custom auth handler.",
    features: {
      viewProfile: true,
      updateName: false,
      updateEmail: false,
      updatePassword: false,
      deleteAccount: false,
    },
  },
}

// -----------------------------------------------------------------------------
// Feature Row Component
// -----------------------------------------------------------------------------

function FeatureRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <Row gap="xs" className="items-center">
      {enabled ? (
        <CheckCircle2Icon className="h-3.5 w-3.5 text-success" />
      ) : (
        <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <Text size="xs" variant={enabled ? "default" : "muted"}>
        {label}
      </Text>
    </Row>
  )
}

// -----------------------------------------------------------------------------
// ProfileDevCard Component
// -----------------------------------------------------------------------------

interface ProfileDevCardProps {
  mode: AuthMode
}

export function ProfileDevCard({ mode }: ProfileDevCardProps) {
  const config = profileModeConfigs[mode]
  const modeConfig = authModeConfigs[mode]

  return (
    <DevCard
      title="Profile"
      badge={<DevCardBadge>{modeConfig.label}</DevCardBadge>}
      footer={
        <Row gap="xs" className="items-center">
          <InfoIcon className="h-3 w-3 shrink-0" />
          <Text size="xs" variant="muted">
            {config.hint}
          </Text>
        </Row>
      }
    >
      <Stack gap="sm">
        {/* Mode description */}
        <Text size="sm" weight="medium">
          {config.description}
        </Text>

        {/* Feature availability */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <FeatureRow label="View profile" enabled={config.features.viewProfile} />
          <FeatureRow label="Edit profile" enabled={config.features.updateName} />
          <FeatureRow label="Update email" enabled={config.features.updateEmail} />
          <FeatureRow label="Update password" enabled={config.features.updatePassword} />
          <FeatureRow label="Delete account" enabled={config.features.deleteAccount} />
        </div>
      </Stack>
    </DevCard>
  )
}
