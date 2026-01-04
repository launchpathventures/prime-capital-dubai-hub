/**
 * CATALYST - Data & Security Audit
 *
 * Structured security review covering authentication, data protection,
 * and API security. Stage-appropriate checklists from POC to production.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ShieldCheckIcon,
  KeyIcon,
  DatabaseIcon,
  ServerIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DataSecurityAuditPage() {
  return (
    <article>
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Link
          href="/docs/audits"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Audits
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <Row gap="sm" className="items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <ShieldCheckIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Data &amp; Security
              </h1>
              <Text variant="muted" className="italic">
                Is this safe to use?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review authentication, data protection, and API security. The most
            critical audit — run this before exposing your app to users.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Stage expectations */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stage expectations</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <StageCard
              stage="POC"
              level="Light"
              expectations={[
                "No secrets in code or version control",
                "Mock auth is acceptable",
                "Known security gaps documented",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Real authentication working",
                "Basic input validation",
                "Secrets in environment variables",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Complete auth flow tested",
                "Role-based access enforced",
                "Ready for external users",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Penetration test ready",
                "Incident response plan exists",
                "Security monitoring in place",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="auth">
          <TabsList className="mb-4">
            <TabsTrigger value="auth">
              <KeyIcon className="h-4 w-4" />
              Auth & Access
            </TabsTrigger>
            <TabsTrigger value="data">
              <DatabaseIcon className="h-4 w-4" />
              Data Protection
            </TabsTrigger>
            <TabsTrigger value="api">
              <ServerIcon className="h-4 w-4" />
              API Security
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Auth & Access */}
          <TabsContent value="auth">
            <Stack gap="lg">
              <ChecklistSection
                title="Login Security"
                stage="mvp"
                items={[
                  "Login form uses HTTPS and secure cookies",
                  "Failed login attempts are rate-limited (e.g., 5 attempts per minute)",
                  "Account lockout after repeated failures (temporary or requires reset)",
                  "CSRF tokens protect login and logout forms",
                  "Login errors don't reveal whether email exists",
                  "Password fields use type=\"password\" and disable autocomplete for sensitive forms",
                ]}
              />

              <ChecklistSection
                title="Session Management"
                stage="mvp"
                items={[
                  "Session tokens are cryptographically random (128+ bits entropy)",
                  "Sessions expire after reasonable inactivity (e.g., 24h-7d based on sensitivity)",
                  "Sessions are invalidated on logout",
                  "Sessions are invalidated on password change",
                  "Session tokens stored in httpOnly cookies (not localStorage)",
                  "Concurrent session limits enforced (if applicable)",
                  "Session fixation is prevented (new token on auth state change)",
                ]}
              />

              <ChecklistSection
                title="Password Policies"
                stage="mmp"
                items={[
                  "Minimum password length enforced (12+ characters recommended)",
                  "Passwords hashed with bcrypt, Argon2, or scrypt (never MD5/SHA1)",
                  "Password reset tokens are single-use and expire within 1 hour",
                  "Password reset emails don't confirm if account exists",
                  "Old password required to set new password (when logged in)",
                  "Breached password checking (optional but recommended)",
                ]}
              />

              <ChecklistSection
                title="Role-Based Access Control"
                stage="mmp"
                items={[
                  "User roles are clearly defined (e.g., admin, member, viewer)",
                  "Role checks happen server-side (never trust client-side only)",
                  "Principle of least privilege applied (default to minimal access)",
                  "Role changes take effect immediately (no stale cached permissions)",
                  "Admin actions require re-authentication for sensitive operations",
                  "Privilege escalation is not possible through UI manipulation",
                ]}
              />

              <ChecklistSection
                title="Protected Routes"
                stage="mvp"
                items={[
                  "All authenticated routes check session validity",
                  "API routes return 401 for unauthenticated requests",
                  "API routes return 403 for unauthorized requests",
                  "Middleware protects route groups consistently",
                  "Deep links to protected content require authentication",
                  "OAuth/SSO callbacks validate state parameter",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Session stored in localStorage", fix: "Move to httpOnly cookie with Secure and SameSite flags" },
                  { issue: "No rate limiting on login", fix: "Add rate limiting middleware (e.g., 5 attempts/minute per IP)" },
                  { issue: "Password reset tokens never expire", fix: "Set 1-hour expiry and single-use flag in database" },
                  { issue: "Role checks only on frontend", fix: "Add server-side role validation in API routes and middleware" },
                  { issue: "Session persists after password change", fix: "Invalidate all sessions on password change" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Data Protection */}
          <TabsContent value="data">
            <Stack gap="lg">
              <ChecklistSection
                title="Encryption"
                stage="mvp"
                items={[
                  "All traffic uses HTTPS (TLS 1.2+, ideally TLS 1.3)",
                  "HSTS header enabled with adequate max-age",
                  "Sensitive data encrypted at rest in database",
                  "Encryption keys stored separately from encrypted data",
                  "No sensitive data in URL parameters (use POST bodies)",
                  "File uploads scanned or restricted by type",
                ]}
              />

              <ChecklistSection
                title="PII Handling"
                stage="mmp"
                items={[
                  "PII fields identified and documented (name, email, phone, address, etc.)",
                  "PII access logged for audit purposes",
                  "PII masked in logs and error messages",
                  "PII excluded from analytics and tracking",
                  "User data export available (GDPR right to portability)",
                  "Account deletion removes or anonymizes PII",
                ]}
              />

              <ChecklistSection
                title="Privacy Compliance"
                stage="mmp"
                items={[
                  "Privacy policy exists and is accessible",
                  "Cookie consent banner for non-essential cookies",
                  "Data processing purposes documented",
                  "Third-party data sharing disclosed",
                  "Data retention periods defined",
                  "DPA (Data Processing Agreement) with processors",
                ]}
              />

              <ChecklistSection
                title="Secure Storage"
                stage="mvp"
                items={[
                  "Database connections use SSL/TLS",
                  "Database credentials not hardcoded in source",
                  "Database uses row-level security (RLS) where applicable",
                  "Backups encrypted and access-controlled",
                  "Production data not used in development/staging",
                  "File storage uses signed URLs with expiry",
                ]}
              />

              <ChecklistSection
                title="Audit Logging"
                stage="prod"
                items={[
                  "Authentication events logged (login, logout, failures)",
                  "Authorization failures logged with context",
                  "Data access to sensitive records logged",
                  "Admin actions logged with actor and timestamp",
                  "Logs stored immutably (append-only or external service)",
                  "Log retention period defined and enforced",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Sensitive data in logs", fix: "Implement log sanitization to redact PII before writing" },
                  { issue: "No encryption at rest", fix: "Enable database encryption (e.g., Supabase encryption, AWS RDS encryption)" },
                  { issue: "Production data in dev", fix: "Use seed scripts or anonymized snapshots for development" },
                  { issue: "Missing data export feature", fix: "Implement user data export endpoint (JSON/CSV)" },
                  { issue: "Backups not tested", fix: "Schedule quarterly restore tests to verify backup integrity" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: API Security */}
          <TabsContent value="api">
            <Stack gap="lg">
              <ChecklistSection
                title="Input Validation"
                stage="mvp"
                items={[
                  "All inputs validated server-side (never trust client)",
                  "Type validation using schema library (Zod, Yup, etc.)",
                  "String lengths bounded (prevent oversized payloads)",
                  "Numeric ranges validated where applicable",
                  "Email, URL, and date formats validated",
                  "File upload size and type restricted",
                  "JSON body size limited at server level",
                ]}
              />

              <ChecklistSection
                title="Injection Prevention"
                stage="mvp"
                items={[
                  "Parameterized queries used (never string concatenation for SQL)",
                  "ORM or query builder prevents SQL injection",
                  "User input escaped in HTML output (XSS prevention)",
                  "Content-Security-Policy header configured",
                  "No eval() or dynamic code execution with user input",
                  "Command injection prevented (no shell exec with user input)",
                ]}
              />

              <ChecklistSection
                title="Rate Limiting"
                stage="mvp"
                items={[
                  "Rate limits applied per IP for public endpoints",
                  "Rate limits applied per user for authenticated endpoints",
                  "Expensive operations have stricter limits",
                  "Rate limit headers returned (X-RateLimit-*)",
                  "Graceful handling when limits exceeded (429 status)",
                  "DDoS protection at edge (Vercel, Cloudflare, etc.)",
                ]}
              />

              <ChecklistSection
                title="CORS Configuration"
                stage="mvp"
                items={[
                  "CORS origins explicitly whitelisted (not wildcard *)",
                  "Credentials mode configured appropriately",
                  "Allowed methods restricted to what's needed",
                  "Preflight caching configured (Access-Control-Max-Age)",
                  "No sensitive endpoints exposed to public origins",
                ]}
              />

              <ChecklistSection
                title="Secrets Management"
                stage="poc"
                items={[
                  "No secrets committed to version control",
                  "Secrets stored in environment variables",
                  "Different secrets per environment (dev/staging/prod)",
                  ".env files in .gitignore",
                  "Secrets rotated periodically",
                  "Access to production secrets restricted",
                  "Secret scanning enabled in CI (GitHub, GitLab, etc.)",
                ]}
              />

              <ChecklistSection
                title="Security Headers"
                stage="mmp"
                items={[
                  "Strict-Transport-Security (HSTS) enabled",
                  "Content-Security-Policy configured",
                  "X-Content-Type-Options: nosniff",
                  "X-Frame-Options: DENY or SAMEORIGIN",
                  "Referrer-Policy: strict-origin-when-cross-origin",
                  "Permissions-Policy configured (camera, microphone, etc.)",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "SQL injection vulnerability", fix: "Use parameterized queries or ORM, never concatenate user input" },
                  { issue: "XSS in user-generated content", fix: "Escape HTML output, use CSP header, sanitize rich text" },
                  { issue: "CORS allows all origins", fix: "Whitelist specific origins, never use * with credentials" },
                  { issue: "No rate limiting", fix: "Add rate limiting middleware (Vercel, Upstash, custom)" },
                  { issue: "API key in client bundle", fix: "Move to server-side API route, use server actions" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="Security Testing"
              items={[
                { name: "OWASP ZAP", url: "https://zaproxy.org", desc: "Web app security scanner" },
                { name: "Burp Suite", url: "https://portswigger.net/burp", desc: "Security testing toolkit" },
                { name: "npm audit", url: "https://docs.npmjs.com/cli/audit", desc: "Dependency vulnerability scanning" },
                { name: "Snyk", url: "https://snyk.io", desc: "Continuous security monitoring" },
              ]}
            />
            <ResourceCard
              title="Headers & Configuration"
              items={[
                { name: "Security Headers", url: "https://securityheaders.com", desc: "Scan your security headers" },
                { name: "Mozilla Observatory", url: "https://observatory.mozilla.org", desc: "Website security analysis" },
                { name: "CSP Evaluator", url: "https://csp-evaluator.withgoogle.com", desc: "Test CSP policies" },
                { name: "SSL Labs", url: "https://ssllabs.com/ssltest", desc: "SSL/TLS configuration test" },
              ]}
            />
            <ResourceCard
              title="References"
              items={[
                { name: "OWASP Top 10", url: "https://owasp.org/Top10", desc: "Top web security risks" },
                { name: "OWASP Cheat Sheets", url: "https://cheatsheetseries.owasp.org", desc: "Security implementation guides" },
                { name: "CWE Top 25", url: "https://cwe.mitre.org/top25", desc: "Most dangerous software weaknesses" },
                { name: "Next.js Security", url: "https://nextjs.org/docs/app/building-your-application/configuring/security-headers", desc: "Framework security docs" },
              ]}
            />
            <ResourceCard
              title="Supabase Security"
              items={[
                { name: "Row Level Security", url: "https://supabase.com/docs/guides/auth/row-level-security", desc: "Database access control" },
                { name: "Auth Helpers", url: "https://supabase.com/docs/guides/auth", desc: "Authentication patterns" },
                { name: "Security Best Practices", url: "https://supabase.com/docs/guides/platform/going-into-prod", desc: "Production checklist" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
          <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-blue-800 dark:text-blue-300">
            Use these prompts with your AI coding agent to run security checks:
          </Text>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Run the Security audit at MVP level</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Check all API routes for authentication</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Audit input validation in form handlers</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Find hardcoded secrets in the codebase</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Review CORS and security header configuration</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/code"
              title="Code & Testing"
              description="Test coverage and code quality affect security"
            />
            <RelatedAuditCard
              href="/docs/audits/deploy"
              title="Deploy & Observe"
              description="Security monitoring and incident response"
            />
            <RelatedAuditCard
              href="/docs/audits/integrations"
              title="Integrations & Services"
              description="Third-party API security and secrets"
            />
          </div>
        </section>
      </Stack>
    </article>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

function StageCard({
  stage,
  level,
  expectations,
}: {
  stage: string
  level: string
  expectations: string[]
}) {
  return (
    <div className="rounded-xl border p-4">
      <Row gap="sm" className="mb-2 items-center">
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">
          {stage}
        </span>
        <Text size="sm" variant="muted">
          {level} check
        </Text>
      </Row>
      <ul className="space-y-1">
        {expectations.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            <Text size="sm" variant="muted">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  )
}

const stageColors = {
  poc: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  mvp: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  mmp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  prod: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
} as const

function ChecklistSection({
  title,
  stage,
  items,
}: {
  title: string
  stage: "poc" | "mvp" | "mmp" | "prod"
  items: string[]
}) {
  const stageLabels = { poc: "POC", mvp: "MVP", mmp: "MMP", prod: "PROD" }
  
  return (
    <div className="rounded-xl border p-5">
      <Row gap="sm" className="mb-4 items-center justify-between">
        <Text weight="semibold">{title}</Text>
        <span className={cn("rounded px-2 py-0.5 text-xs font-medium", stageColors[stage])}>
          {stageLabels[stage]}+
        </span>
      </Row>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CommonIssues({
  items,
}: {
  items: { issue: string; fix: string }[]
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
      <Row gap="sm" className="mb-4 items-center">
        <AlertCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <Text weight="semibold" className="text-amber-900 dark:text-amber-200">Common Issues &amp; Quick Fixes</Text>
      </Row>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <WrenchIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-medium text-amber-900 dark:text-amber-200">{item.issue}:</span>{" "}
              <span className="text-amber-800 dark:text-amber-300">{item.fix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourceCard({
  title,
  items,
}: {
  title: string
  items: { name: string; url: string; desc: string }[]
}) {
  return (
    <div className="rounded-xl border p-5">
      <Text weight="semibold" className="mb-3">{title}</Text>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="text-sm">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              {item.name}
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
            <span className="text-muted-foreground"> — {item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RelatedAuditCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border p-4 transition-colors hover:border-primary/50"
    >
      <Text weight="medium" className="text-primary">{title}</Text>
      <Text size="sm" variant="muted" className="mt-1">{description}</Text>
    </Link>
  )
}
