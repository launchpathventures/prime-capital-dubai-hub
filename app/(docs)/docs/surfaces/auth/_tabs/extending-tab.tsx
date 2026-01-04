/**
 * CATALYST - Auth Surface Doc Tab: Develop
 *
 * How to build in the Auth surface — written for catalyst devs (AI-first).
 * Audience: stakeholder → catalyst dev → technical dev
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2Icon,
  SparklesIcon,
  FileCodeIcon,
  KeyIcon,
  MailIcon,
  ShieldIcon,
  ServerIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"

export function DevelopTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Building in the Auth surface
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This guide shows you how to customize auth forms, switch auth modes,
            and add new flows. Each section starts with what to ask AI, then
            shows the technical details.
          </p>
        </div>
      </section>

      {/* How to Work with AI */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Working with AI</h2>
        <p className="text-muted-foreground">
          Catalyst is AI-first. When you need to customize auth, describe what
          you want. AI knows the auth modes and will update the right files.
        </p>

        <div className="bg-card space-y-4 rounded-lg border p-5">
          <Row gap="sm" className="items-center">
            <SparklesIcon className="text-primary h-5 w-5" />
            <Text weight="medium">Example prompts</Text>
          </Row>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add a company name field to the registration form&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Switch from demo mode to Supabase authentication&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Add Google social login to the sign in page&rdquo;
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary shrink-0">→</span>
              <span className="text-sm">
                &ldquo;Change the redirect after login to /dashboard&rdquo;
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground border-t pt-3 text-xs">
            AI reads the project docs (AGENTS.md, AUTH.md) and knows the auth
            patterns. You focus on <em>what</em> you need, AI handles <em>how</em>.
          </p>
        </div>
      </section>

      {/* Auth Modes */}
      <section className="space-y-4">
        <TaskCard
          icon={KeyIcon}
          title="Switch auth modes"
          ask="Switch from demo mode to Supabase authentication"
          description="Auth modes are configured via environment variables. No code changes needed to switch."
          details={[
            "Demo mode: Accepts any credentials (for development)",
            "Password mode: Single password for all users",
            "Supabase mode: Full auth with email/password and socials",
            "Custom mode: Your own auth API endpoint",
          ]}
          files={[
            { path: ".env.local", note: "Environment variables" },
            { path: "lib/auth/config.ts", note: "Auth configuration" },
          ]}
          example={`# .env.local

# Demo mode (default - no config needed)

# Password mode
AUTH_PASSWORD=your-secret-password

# Supabase mode (auto-detected when configured)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Custom mode
AUTH_CUSTOM_ENDPOINT=https://api.example.com/auth

# Redirect after login
NEXT_PUBLIC_AUTH_REDIRECT_TO=/app/dashboard`}
        />
      </section>

      {/* Customize Forms */}
      <section className="space-y-4">
        <TaskCard
          icon={FileCodeIcon}
          title="Customize auth forms"
          ask="Add a [phone number] field to the registration form"
          description="Each auth page has a corresponding form component. Add fields and validation there."
          details={[
            "Forms are in the page folders (login-form.tsx, register-form.tsx)",
            "Use the Input and Label components for consistency",
            "Add validation in the form submission handler",
          ]}
          files={[
            { path: "app/(auth)/auth/register/register-form.tsx", note: "Registration form" },
            { path: "app/(auth)/auth/login/login-form.tsx", note: "Login form" },
          ]}
          example={`// app/(auth)/auth/register/register-form.tsx

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",  // ← Add new field
  })

  return (
    <form onSubmit={handleSubmit}>
      {/* Existing fields */}
      
      {/* New phone field */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      {/* Submit button */}
    </form>
  )
}`}
        />
      </section>

      {/* Email Templates */}
      <section className="space-y-4">
        <TaskCard
          icon={MailIcon}
          title="Customize email templates"
          ask="Change the password reset email template"
          description="Email templates are configured in your Supabase dashboard. Catalyst uses the default templates."
          details={[
            "Go to Supabase Dashboard → Authentication → Email Templates",
            "Customize confirmation, reset, and invite emails",
            "Include your brand colors and messaging",
          ]}
          files={[]}
          example={`// Email templates are in Supabase Dashboard
// Authentication → Email Templates

// Available templates:
// - Confirm signup
// - Reset password
// - Magic link
// - Invite user
// - Change email address

// Template variables:
// {{ .ConfirmationURL }} - Link to confirm
// {{ .Token }} - Verification token
// {{ .RedirectTo }} - Return URL

// Example custom template:
/*
<h1>Reset Your Password</h1>
<p>Click the link below to reset your password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>This link expires in 24 hours.</p>
*/`}
        />
      </section>

      {/* Protected Routes */}
      <section className="space-y-4">
        <TaskCard
          icon={ShieldIcon}
          title="Protect routes"
          ask="Make [/admin] require authentication"
          description="Protected routes are handled by middleware. Add routes under the (app) route group for automatic protection."
          details={[
            "Routes under app/(app)/ are protected by default",
            "Unauthenticated users are redirected to /auth/login",
            "After login, users return to their original destination",
          ]}
          files={[
            { path: "proxy.ts", note: "Middleware for route protection" },
          ]}
          example={`// Routes are protected by route group:

// Protected routes (require auth):
app/(app)/
  └── admin/         // /admin - protected
  └── dashboard/     // /dashboard - protected
  └── settings/      // /settings - protected

// Public routes (no auth required):
app/(web)/
  └── about/         // /about - public
  └── pricing/       // /pricing - public

app/(auth)/
  └── login/         // /auth/login - public
  └── register/      // /auth/register - public

// The proxy.ts middleware checks auth for /app/* routes:
// If no session → redirect to /auth/login?returnTo=...`}
        />
      </section>

      {/* Custom API */}
      <section className="space-y-4">
        <TaskCard
          icon={ServerIcon}
          title="Connect custom auth API"
          ask="Use our existing auth API instead of Supabase"
          description="Set AUTH_CUSTOM_ENDPOINT to use your own authentication backend. Catalyst will proxy requests to your API."
          details={[
            "Your API receives action, email, password in POST body",
            "Return { success: true } or { success: false, error: '...' }",
            "On success, Catalyst sets a session cookie",
          ]}
          files={[
            { path: "app/api/auth/validate-custom/route.ts", note: "Custom auth proxy" },
          ]}
          example={`// Set environment variable:
AUTH_CUSTOM_ENDPOINT=https://api.example.com/auth

// Your API receives:
POST /auth
{
  "action": "login" | "register" | "forgot-password" | "reset-password",
  "email": "user@example.com",
  "password": "...",
  "name": "..."  // Only for register
}

// Expected response:
{
  "success": true,
  "user": { "id": "...", "email": "..." }  // Optional
}

// Or on error:
{
  "success": false,
  "error": "Invalid credentials"
}`}
        />
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key locations
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(auth)/auth/
                </code>{" "}
                — Auth pages
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/auth/config.ts
                </code>{" "}
                — Auth mode config
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/api/auth/
                </code>{" "}
                — API routes
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Switch to Supabase auth&rdquo;</li>
              <li>&ldquo;Add field to registration&rdquo;</li>
              <li>&ldquo;Change redirect after login&rdquo;</li>
              <li>&ldquo;Add social login button&rdquo;</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function TaskCard({
  icon: Icon,
  title,
  ask,
  description,
  details,
  files,
  example,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  ask: string
  description: string
  details: string[]
  files: { path: string; note: string }[]
  example: string
}) {
  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="border-b bg-muted/30 px-5 py-3">
        <Row gap="sm" className="items-center">
          <Icon className="text-muted-foreground h-4 w-4" />
          <Text weight="medium">{title}</Text>
        </Row>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Ask AI */}
        <div className="border-primary/20 bg-primary/5 rounded-lg border p-3">
          <Row gap="sm" className="items-start">
            <SparklesIcon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <Text size="xs" variant="muted" className="uppercase tracking-wide">
                Ask AI
              </Text>
              <Text size="sm" className="mt-0.5">
                &ldquo;{ask}&rdquo;
              </Text>
            </div>
          </Row>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {/* Details */}
        <ul className="space-y-1.5">
          {details.map((detail, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        {/* Files */}
        {files.length > 0 && (
          <div className="border-t pt-4">
            <Text size="xs" variant="muted" className="mb-2 uppercase tracking-wide">
              Files involved
            </Text>
            <ul className="space-y-1">
              {files.map((file, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    {file.path}
                  </code>
                  <span className="text-muted-foreground">— {file.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Example */}
        <div className="border-t pt-2">
          <Accordion>
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="px-0 py-2 text-sm">
                Technical details
              </AccordionTrigger>
              <AccordionContent className="px-0">
                <div className="bg-muted/50 overflow-x-auto rounded-md p-4">
                  <pre className="text-xs leading-relaxed">{example}</pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
