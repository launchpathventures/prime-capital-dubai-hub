/**
 * CATALYST - Auth Dev Card
 *
 * Development helper card showing auth mode info and links to all auth screens.
 * Uses the generic DevCard component with auth-specific content.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Text, Stack } from "@/components/core"
import { Button } from "@/components/ui/button"
import { DevCard, DevCardBadge } from "@/components/shared"
import { 
  LogInIcon, 
  UserPlusIcon, 
  KeyIcon, 
  MailIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "lucide-react"
import { type AuthMode } from "@/lib/auth/config"
import { authModeConfigs } from "./auth-modes"

// -----------------------------------------------------------------------------
// Auth Screen Links
// -----------------------------------------------------------------------------

const authScreens = [
  { href: "/auth/login", label: "Sign in", icon: LogInIcon },
  { href: "/auth/register", label: "Register", icon: UserPlusIcon },
  { href: "/auth/forgot-password", label: "Forgot", icon: MailIcon },
  { href: "/auth/reset-password", label: "Reset", icon: KeyIcon },
  { href: "/auth/verify-email", label: "Verify", icon: ShieldCheckIcon },
  { href: "/auth/success", label: "Success", icon: CheckCircleIcon },
  // Note: Signout removed - it's a POST-only API route, not a page
]

// -----------------------------------------------------------------------------
// AuthDevCard Component
// -----------------------------------------------------------------------------

interface AuthDevCardProps {
  mode: AuthMode
}

export function AuthDevCard({ mode }: AuthDevCardProps) {
  const pathname = usePathname()
  const modeConfig = authModeConfigs[mode]

  return (
    <DevCard 
      title="Auth" 
      badge={<DevCardBadge>{modeConfig.label}</DevCardBadge>}
      footer={
        <Text size="xs" variant="muted">
          {modeConfig.hint}
        </Text>
      }
    >
      <Stack gap="sm">
        {/* Mode description */}
        <Text size="sm" weight="medium">
          {modeConfig.description}
        </Text>

        {/* Screen links */}
        <div className="flex flex-wrap gap-1.5">
          {authScreens.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Button
                key={href}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="shadow-none"
                render={<Link href={href} />}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            )
          })}
        </div>
      </Stack>
    </DevCard>
  )
}

// Re-export as DevCard for backwards compatibility in existing imports
export { AuthDevCard as DevCard }
