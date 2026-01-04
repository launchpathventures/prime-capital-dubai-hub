/**
 * CATALYST - Authentication Documentation
 *
 * Multi-mode authentication system with configurable backends.
 * Supports demo, password, Supabase, and custom API modes.
 */

"use client"

import { Stack, Text } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocsAccordionPage } from "../../../_surface/docs-accordion-page"

// =============================================================================
// AUTH MODE DATA
// =============================================================================

type AuthModeInfo = {
  name: string
  slug: string
  description: string
  useCase: string
  setup: React.ReactNode
  envVars: { name: string; description: string; required: boolean }[]
  notes?: string[]
}

const AUTH_MODES: AuthModeInfo[] = [
  {
    name: "Demo Mode",
    slug: "demo",
    description: "Accepts any credentials for development and demonstrations.",
    useCase: "Development, demos, and testing UI flows without real authentication.",
    setup: (
      <Text variant="muted">
        Demo mode is the default when no other auth is configured. No setup required.
      </Text>
    ),
    envVars: [
      {
        name: "AUTH_MODE",
        description: "Set to \"demo\" to force demo mode even when other auth is configured",
        required: false,
      },
    ],
    notes: [
      "Any email/password combination will work",
      "Simulates a brief loading delay for realistic UX",
      "Use for prototyping and stakeholder demos",
    ],
  },
  {
    name: "Password Mode",
    slug: "password",
    description: "Validates against a single shared password.",
    useCase: "Simple password protection for internal tools, staging sites, or client previews.",
    setup: (
      <Stack gap="sm">
        <Text variant="muted">
          Set a password in your environment variables. Users only enter the password (no email).
        </Text>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{`# .env.local
AUTH_PASSWORD=your-secret-password`}</code>
        </pre>
      </Stack>
    ),
    envVars: [
      {
        name: "AUTH_PASSWORD",
        description: "The password users must enter to access the app",
        required: true,
      },
      {
        name: "AUTH_MODE",
        description: "Set to \"password\" to force password mode",
        required: false,
      },
    ],
    notes: [
      "Password is validated server-side via API route",
      "No user accounts or email required",
      "Good for protecting staging deployments",
    ],
  },
  {
    name: "Supabase Mode",
    slug: "supabase",
    description: "Full authentication via Supabase Auth.",
    useCase: "Production apps requiring real user accounts, registration, password reset, and session management.",
    setup: (
      <Stack gap="sm">
        <Text variant="muted">
          Configure your Supabase project credentials. Enables the full auth flow including
          registration, forgot password, email verification, and password reset.
        </Text>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{`# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}</code>
        </pre>
        <Text size="sm" variant="muted">
          See the <a href="/docs/integrations/supabase-auth" className="text-primary underline">Supabase Integration</a> docs
          for full setup instructions.
        </Text>
      </Stack>
    ),
    envVars: [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        description: "Your Supabase project URL",
        required: true,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        description: "Your Supabase anonymous/public key",
        required: true,
      },
      {
        name: "AUTH_MODE",
        description: "Set to \"supabase\" to force Supabase mode",
        required: false,
      },
    ],
    notes: [
      "Enables registration, forgot password, and email verification screens",
      "Uses Supabase's built-in session management",
      "Configure email templates in Supabase Dashboard",
    ],
  },
  {
    name: "Custom Mode",
    slug: "custom",
    description: "Authenticates via your own API endpoint.",
    useCase: "Integration with existing auth systems, custom backends, or third-party identity providers.",
    setup: (
      <Stack gap="sm">
        <Text variant="muted">
          Point to your authentication API endpoint. The endpoint receives POST requests
          with email and password, and should return a JSON response.
        </Text>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{`# .env.local
AUTH_CUSTOM_ENDPOINT=https://api.example.com/auth`}</code>
        </pre>
        <Text size="sm" weight="medium" className="mt-2">Expected API Response:</Text>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{`// Success
{ "success": true }

// Failure
{ "success": false, "error": "Invalid credentials" }`}</code>
        </pre>
      </Stack>
    ),
    envVars: [
      {
        name: "AUTH_CUSTOM_ENDPOINT",
        description: "URL of your authentication API endpoint",
        required: true,
      },
      {
        name: "AUTH_MODE",
        description: "Set to \"custom\" to force custom mode",
        required: false,
      },
    ],
    notes: [
      "Your endpoint receives { email, password } via POST",
      "Handle session/token management in your API",
      "Useful for migrating from existing auth systems",
    ],
  },
]

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderOverview() {
  return (
    <Stack gap="md">
      <Text variant="muted" className="leading-relaxed">
        Catalyst includes a flexible authentication system that supports multiple backends.
        The system auto-detects which mode to use based on your environment configuration,
        or you can explicitly set the mode with the <code className="bg-muted rounded px-1">AUTH_MODE</code> variable.
      </Text>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mode Priority (Auto-Detection)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-muted-foreground list-decimal space-y-2 pl-5 text-sm">
            <li>If <code className="bg-muted rounded px-1">AUTH_CUSTOM_ENDPOINT</code> is set → <strong>Custom</strong></li>
            <li>If Supabase URL + key are set → <strong>Supabase</strong></li>
            <li>If <code className="bg-muted rounded px-1">AUTH_PASSWORD</code> is set → <strong>Password</strong></li>
            <li>Otherwise → <strong>Demo</strong> (default)</li>
          </ol>
        </CardContent>
      </Card>

      <Text variant="muted" size="sm">
        Override auto-detection by setting <code className="bg-muted rounded px-1">AUTH_MODE=demo|password|supabase|custom</code>.
        This is useful when you want password auth but also have Supabase configured for data.
      </Text>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Auth Screens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><code className="bg-muted rounded px-1">/auth/login</code></div>
            <div className="text-muted-foreground">All modes</div>
            <div><code className="bg-muted rounded px-1">/auth/register</code></div>
            <div className="text-muted-foreground">Demo, Supabase, Custom</div>
            <div><code className="bg-muted rounded px-1">/auth/forgot-password</code></div>
            <div className="text-muted-foreground">Demo, Supabase, Custom</div>
            <div><code className="bg-muted rounded px-1">/auth/reset-password</code></div>
            <div className="text-muted-foreground">Demo, Supabase, Custom</div>
            <div><code className="bg-muted rounded px-1">/auth/verify-email</code></div>
            <div className="text-muted-foreground">Supabase only</div>
            <div><code className="bg-muted rounded px-1">/auth/success</code></div>
            <div className="text-muted-foreground">All modes</div>
          </div>
        </CardContent>
      </Card>

      <Text variant="muted" size="sm">
        After successful sign in, users are redirected to <code className="bg-muted rounded px-1">/app</code> by default.
        Configure with <code className="bg-muted rounded px-1">NEXT_PUBLIC_AUTH_REDIRECT_TO</code>.
      </Text>
    </Stack>
  )
}

function renderItem(mode: AuthModeInfo) {
  return (
    <Stack gap="md">
      {/* Description */}
      <Text variant="muted" className="leading-relaxed">
        {mode.description}
      </Text>

      {/* Use Case */}
      <div>
        <Text size="sm" weight="medium" className="mb-1">Use Case</Text>
        <Text size="sm" variant="muted">{mode.useCase}</Text>
      </div>

      {/* Setup */}
      <div>
        <Text size="sm" weight="medium" className="mb-2">Setup</Text>
        {mode.setup}
      </div>

      {/* Environment Variables */}
      <div>
        <Text size="sm" weight="medium" className="mb-2">Environment Variables</Text>
        <div className="space-y-2">
          {mode.envVars.map((env) => (
            <div key={env.name} className="flex items-start gap-2">
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs font-mono shrink-0">
                {env.name}
              </code>
              {env.required && (
                <Badge variant="secondary" className="text-xs shrink-0">Required</Badge>
              )}
              <Text size="xs" variant="muted" className="pt-0.5">{env.description}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {mode.notes && mode.notes.length > 0 && (
        <div>
          <Text size="sm" weight="medium" className="mb-2">Notes</Text>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            {mode.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </Stack>
  )
}

function renderTrigger(mode: AuthModeInfo) {
  return (
    <div className="flex items-center gap-2">
      <span>{mode.name}</span>
      <Badge variant="outline" className="text-xs font-mono">
        {mode.slug}
      </Badge>
    </div>
  )
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function AuthenticationPage() {
  return (
    <DocsAccordionPage
      title="Authentication"
      description="Multi-mode auth system with configurable backends. Supports demo, password, Supabase, and custom API modes."
      items={AUTH_MODES}
      searchPlaceholder="Search auth modes..."
      renderOverview={renderOverview}
      renderItem={renderItem}
      renderTrigger={renderTrigger}
    />
  )
}
