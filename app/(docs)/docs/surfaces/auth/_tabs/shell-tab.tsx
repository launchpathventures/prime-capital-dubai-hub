/**
 * CATALYST - Auth Surface Doc Tab: Layout
 *
 * How the auth layout works — centered cards, minimal chrome.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import {
  CheckCircle2Icon,
  SparklesIcon,
  LayoutIcon,
  PaletteIcon,
  BoxIcon,
} from "lucide-react"
import { Text, Row } from "@/components/core"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LayoutTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            Understanding the layout
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The Auth surface uses a minimal, centered layout. No navigation,
            no distractions — just the form and branding. This keeps users
            focused on the authentication task.
          </p>
        </div>
      </section>

      {/* Visual Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Every auth page shares this minimal layout:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="relative aspect-video">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

            {/* Centered card */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-card w-full max-w-sm rounded-lg border p-6 shadow-lg">
                {/* Logo */}
                <div className="bg-muted mx-auto mb-4 h-10 w-10 rounded-full" />
                {/* Title */}
                <div className="bg-muted mx-auto mb-2 h-4 w-32 rounded" />
                {/* Subtitle */}
                <div className="bg-muted mx-auto mb-6 h-3 w-48 rounded" />
                {/* Form fields */}
                <div className="space-y-3">
                  <div className="bg-muted h-10 rounded" />
                  <div className="bg-muted h-10 rounded" />
                  <div className="bg-primary h-10 rounded" />
                </div>
              </div>
            </div>

            {/* Optional footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="bg-muted mx-auto h-3 w-40 rounded" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Full-height centered layout</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>No header or navigation (minimal distractions)</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Card contains logo, title, and form</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Customize Card */}
      <section className="space-y-4">
        <TaskCard
          icon={BoxIcon}
          title="Customize the auth card"
          ask="Change the logo and title in the auth card"
          description="The auth card is a shared component used on all auth pages. Customize it in one place."
          details={[
            "Logo comes from your config or public/logo.svg",
            "Title and description are set per-page",
            "Card styling is in auth.css",
          ]}
          files={[
            { path: "app/(auth)/_surface/auth-card.tsx", note: "Card component" },
            { path: "lib/config.ts", note: "App name and logo" },
          ]}
          example={`// app/(auth)/_surface/auth-card.tsx

export function AuthCard({ 
  title, 
  description, 
  children 
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {/* Logo */}
        <div className="mx-auto mb-4">
          <Logo className="h-10 w-10" />
        </div>
        
        {/* Title */}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}`}
        />
      </section>

      {/* Background */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Customize the background"
          ask="Add a gradient background to auth pages"
          description="The auth shell provides the background. Customize with CSS for visual polish."
          details={[
            "Default: Subtle gradient with grid pattern",
            "Use CSS variables for color consistency",
            "Keep backgrounds subtle — don't compete with form",
          ]}
          files={[
            { path: "app/(auth)/auth.css", note: "Auth surface styles" },
          ]}
          example={`/* app/(auth)/auth.css */

/* Gradient background */
.auth-shell {
  background: linear-gradient(
    135deg,
    oklch(from var(--color-primary) l c h / 0.05),
    var(--color-background)
  );
}

/* Grid pattern overlay */
.auth-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(
    oklch(from var(--color-foreground) l c h / 0.03) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  pointer-events: none;
}

/* Gradient orb effect */
.auth-orb {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(from var(--color-primary) l c h / 0.15),
    transparent 70%
  );
  filter: blur(60px);
}`}
        />
      </section>

      {/* Custom Styles */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Make auth forms more compact"
          description="Each surface has its own CSS file. Add auth-specific styles there."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Use CSS variables for consistency",
            "Styles only apply to auth pages",
          ]}
          files={[{ path: "app/(auth)/auth.css", note: "Auth surface styles" }]}
          example={`/* app/(auth)/auth.css */

/* Compact form spacing */
.auth-shell .form-field {
  margin-bottom: 0.75rem;
}

/* Smaller input fields */
.auth-shell input {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Custom card shadow */
.auth-card {
  box-shadow: 
    0 4px 6px -1px oklch(from var(--color-foreground) l c h / 0.05),
    0 20px 25px -5px oklch(from var(--color-foreground) l c h / 0.1);
}

/* Animation on load */
.auth-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`}
        />
      </section>

      {/* Quick Reference */}
      <section className="bg-card space-y-3 rounded-lg border p-5">
        <h3 className="font-medium">Quick reference</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Key files
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(auth)/_surface/auth-shell.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(auth)/_surface/auth-card.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(auth)/auth.css
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/config.ts
                </code>
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Change the auth page background&rdquo;</li>
              <li>&ldquo;Update the logo on auth pages&rdquo;</li>
              <li>&ldquo;Add company branding&rdquo;</li>
              <li>&ldquo;Make the form wider/narrower&rdquo;</li>
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
