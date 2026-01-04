/**
 * CATALYST - Auth Surface Doc Tab: Overview
 *
 * What the Auth surface is, why it exists, when to use it.
 * Audience hierarchy: stakeholder → catalyst dev → technical dev
 */

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  LogInIcon,
  ShieldCheckIcon,
  KeyIcon,
  SmartphoneIcon,
  LightbulbIcon,
  FolderIcon,
  BookOpenIcon,
} from "lucide-react"

export function OverviewTab() {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="space-y-4">
        <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
          <p className="text-lg font-medium leading-snug">
            The gateway to your application
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Clean, focused authentication pages that build trust. Sign in,
            registration, password recovery — all the flows users expect,
            styled to match your brand.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What You Get</h2>
        <p className="text-muted-foreground">
          A complete authentication UI, ready to connect:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={LogInIcon}
            title="Sign in & register"
            description="Email + password forms with validation. Optional social login buttons."
          />
          <FeatureCard
            icon={KeyIcon}
            title="Password recovery"
            description="Forgot password and reset flows. Email-based verification."
          />
          <FeatureCard
            icon={ShieldCheckIcon}
            title="Multiple auth modes"
            description="Demo, password, Supabase, or custom API. Switch with env vars."
          />
          <FeatureCard
            icon={SmartphoneIcon}
            title="Mobile-friendly"
            description="Centered card layout that works on any screen size."
          />
        </div>
      </section>

      {/* When to Use It */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to Use It</h2>
        <p className="text-muted-foreground">
          Use this surface when you need user authentication:
        </p>

        <div className="bg-card rounded-xl border p-6">
          <ul className="space-y-3">
            <UseCaseItem
              title="User accounts"
              example="Sign in, sign up, profile management"
            />
            <UseCaseItem
              title="Protected content"
              example="Gated features, premium access"
            />
            <UseCaseItem
              title="Team applications"
              example="Multi-user systems, collaboration"
            />
            <UseCaseItem
              title="SaaS products"
              example="Subscription management, billing"
            />
            <UseCaseItem
              title="Internal tools"
              example="Admin access, employee portals"
            />
          </ul>
        </div>

        {/* Auth modes callout */}
        <div className="bg-muted/50 flex gap-3 rounded-lg p-4">
          <LightbulbIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Flexible authentication modes</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Start with demo mode for development, switch to Supabase for
              production, or connect your own auth API. One surface, multiple
              backends.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="space-y-4">
        <Accordion>
          <AccordionItem value="technical-details" className="border-none">
            <AccordionTrigger className="px-0 py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <FolderIcon className="text-muted-foreground h-5 w-5" />
                <h2 className="text-xl font-semibold">Technical Details</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-2">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Metadata */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                    Configuration
                  </h3>
                  <dl className="space-y-3">
                    <MetadataItem label="Folder" value="app/(auth)" />
                    <MetadataItem label="URL" value="/auth/*" />
                    <MetadataItem label="Layout" value="AuthShell" />
                    <MetadataItem label="Navigation" value="N/A" />
                    <MetadataItem label="Auth" value="None (pre-auth)" />
                  </dl>
                </div>

                {/* Folder structure */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
                    Folder Structure
                  </h3>
                  <pre className="text-muted-foreground text-xs leading-relaxed">
                    {`app/(auth)/
├── AUTH.md         # Docs
├── auth.css        # Styles
├── layout.tsx      # Shell wrapper
├── _surface/
│   ├── auth-shell.tsx
│   └── auth-card.tsx
└── auth/
    ├── login/
    ├── register/
    └── reset-password/`}
                  </pre>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 text-sm">
                Delete the entire{" "}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  app/(auth)
                </code>{" "}
                folder to remove this surface. Also remove API routes in{" "}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  app/api/auth/
                </code>.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Learn More */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="text-muted-foreground h-5 w-5" />
          <h2 className="text-lg font-medium">Learn More</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <ReadingLink
            href="/docs/develop/authentication"
            title="Authentication"
            description="Full auth setup guide"
          />
          <ReadingLink
            href="/docs/surfaces/app"
            title="App Surface"
            description="Protected pages"
          />
          <ReadingLink
            href="/docs/integrations/supabase-auth"
            title="Supabase"
            description="Backend integration"
          />
        </div>
      </section>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs">{value}</dd>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="bg-card group rounded-xl border p-5 transition-colors">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function UseCaseItem({ title, example }: { title: string; example: string }) {
  return (
    <li className="flex gap-3 text-sm">
      <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>
        <strong className="text-foreground">{title}</strong>
        <span className="text-muted-foreground"> — {example}</span>
      </span>
    </li>
  )
}

function ReadingLink({
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
      className="bg-muted/50 hover:bg-muted group flex flex-col rounded-lg p-3 transition-colors"
    >
      <span className="text-primary text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </Link>
  )
}
