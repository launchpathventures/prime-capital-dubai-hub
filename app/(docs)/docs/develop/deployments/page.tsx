/**
 * CATALYST - Deployments Guide
 *
 * Branch strategy and deployment with Vercel. Covers environment setup,
 * preview deployments, and production configuration.
 */

import Link from "next/link"
import { CircleIcon } from "lucide-react"

export default function DeploymentsPage() {
  return (
    <article className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Deploy only when the stage justifies it. This guide covers branch
          strategy and Vercel setup for Catalyst projects.
        </p>
      </header>

      {/* Stage guidance callout */}
      <section className="border-border rounded-lg border bg-amber-50/50 p-5 dark:bg-amber-950/20">
        <h2 className="font-semibold">Deploy at the right time</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            <strong>POC:</strong> Keep local or use password-protected previews.
            No public traffic.
          </li>
          <li>
            <strong>MVP/MMP:</strong> Deploy to preview/UAT environments for
            testing with real users.
          </li>
          <li>
            <strong>PROD:</strong> Requires Refine checkpoint approval, monitoring,
            and rollback plan.
          </li>
        </ul>
      </section>

      {/* Branch Strategy */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Branch Strategy</h2>
        <p className="text-muted-foreground text-sm">
          Catalyst uses a simple branch strategy that maps to deployment
          environments:
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <BranchCard
            branch="main / master"
            environment="Production"
            description="Stable, release-ready code. Deploys to production domain."
            required
          />
          <BranchCard
            branch="develop"
            environment="UAT / Staging"
            description="Integration branch. Deploys to preview URL for UAT testing."
            required={false}
          />
          <BranchCard
            branch="demo"
            environment="Demo"
            description="Demo-specific branch. Deploys to demo subdomain for stakeholders."
            required={false}
          />
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-sm font-medium">Typical flow</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Feature branches → <code className="bg-background rounded px-1">develop</code> (UAT) →{" "}
            <code className="bg-background rounded px-1">main</code> (Production)
          </p>
        </div>
      </section>

      {/* Vercel Setup */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Vercel Setup</h2>
        <p className="text-muted-foreground text-sm">
          Vercel is the recommended deployment platform for Catalyst. It
          provides automatic deployments, preview URLs, and environment
          management.
        </p>

        {/* Step 1: Connect Repository */}
        <SetupStep
          number={1}
          title="Connect your repository"
        >
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>
              Go to{" "}
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                vercel.com/new
              </a>{" "}
              and import your GitHub/GitLab/Bitbucket repository.
            </li>
            <li>
              Vercel auto-detects Next.js — accept the default build settings.
            </li>
            <li>Click Deploy to create your first production deployment.</li>
          </ol>
        </SetupStep>

        {/* Step 2: Configure Production Branch */}
        <SetupStep
          number={2}
          title="Configure production branch"
        >
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>
              Go to <strong>Project Settings → Git</strong>.
            </li>
            <li>
              Set <strong>Production Branch</strong> to{" "}
              <code className="bg-muted rounded px-1">main</code> (or{" "}
              <code className="bg-muted rounded px-1">master</code>).
            </li>
            <li>
              Pushes to this branch deploy to your production domain.
            </li>
          </ol>
        </SetupStep>

        {/* Step 3: Set Up Preview Branches */}
        <SetupStep
          number={3}
          title="Set up preview branches (optional)"
        >
          <p className="text-muted-foreground mb-3 text-sm">
            Every branch automatically gets a preview URL. For stable
            environments like UAT or demo:
          </p>
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>
              Go to <strong>Project Settings → Domains</strong>.
            </li>
            <li>
              Add a subdomain like{" "}
              <code className="bg-muted rounded px-1">uat.yourproject.com</code>.
            </li>
            <li>
              Under <strong>Git Branch</strong>, select{" "}
              <code className="bg-muted rounded px-1">develop</code>.
            </li>
            <li>
              Repeat for{" "}
              <code className="bg-muted rounded px-1">demo</code> branch if
              needed.
            </li>
          </ol>
        </SetupStep>

        {/* Step 4: Environment Variables */}
        <SetupStep
          number={4}
          title="Configure environment variables"
        >
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>
              Go to <strong>Project Settings → Environment Variables</strong>.
            </li>
            <li>Add your variables (e.g., Supabase keys, API URLs).</li>
            <li>
              Select which environments each variable applies to:
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>
                  <strong>Production</strong> — Main/master branch
                </li>
                <li>
                  <strong>Preview</strong> — All other branches (develop, demo,
                  feature branches)
                </li>
                <li>
                  <strong>Development</strong> — Local development (use{" "}
                  <code className="bg-muted rounded px-1">vercel env pull</code>)
                </li>
              </ul>
            </li>
          </ol>
          <div className="bg-muted mt-4 rounded-lg p-3">
            <p className="text-sm font-medium">Tip: Branch-specific variables</p>
            <p className="text-muted-foreground mt-1 text-sm">
              For different values on develop vs. demo, add the variable twice
              with Preview environment and specify the branch for each.
            </p>
          </div>
        </SetupStep>

        {/* Step 5: Local Development */}
        <SetupStep
          number={5}
          title="Sync environment variables locally"
        >
          <p className="text-muted-foreground mb-3 text-sm">
            Pull environment variables from Vercel to your local{" "}
            <code className="bg-muted rounded px-1">.env</code> file:
          </p>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code>{`# Install Vercel CLI
pnpm i -g vercel

# Link to your project (first time only)
vercel link

# Pull development environment variables
vercel env pull`}</code>
          </pre>
          <p className="text-muted-foreground mt-3 text-sm">
            This creates a <code className="bg-muted rounded px-1">.env</code>{" "}
            file with your Development environment variables.
          </p>
        </SetupStep>
      </section>

      {/* Environment Configuration */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Environment Configuration</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Client-side variables</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Prefix with <code className="bg-muted rounded px-1">NEXT_PUBLIC_</code>
              . Safe for public use, bundled in client JavaScript.
            </p>
            <pre className="bg-muted mt-3 rounded p-2 text-xs">
              {`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_APP_ENV=production`}
            </pre>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Server-side variables</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              No prefix. Only available in server components and API routes.
              Safe for secrets.
            </p>
            <pre className="bg-muted mt-3 rounded p-2 text-xs">
              {`SUPABASE_SERVICE_ROLE_KEY=...
AUTH_SECRET=...`}
            </pre>
          </div>
        </div>

        <div className="border-border rounded-lg border border-dashed p-4">
          <h3 className="text-sm font-medium">Always update .env.example</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            When adding new environment variables, update{" "}
            <code className="bg-muted rounded px-1">.env.example</code> with the
            variable name (not the value) so other developers know what&apos;s
            required.
          </p>
        </div>
      </section>

      {/* Deployment Checklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Production Deployment Checklist</h2>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <p className="mb-4 text-sm font-medium text-emerald-900 dark:text-emerald-200">
            Before deploying to production:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            <ChecklistItem>All environment variables configured for Production</ChecklistItem>
            <ChecklistItem>Custom domain configured and DNS propagated</ChecklistItem>
            <ChecklistItem>SSL certificate active (automatic with Vercel)</ChecklistItem>
            <ChecklistItem>Analytics/monitoring integrated</ChecklistItem>
            <ChecklistItem>Error tracking configured (e.g., Sentry)</ChecklistItem>
            <ChecklistItem>Build succeeds without warnings</ChecklistItem>
            <ChecklistItem>
              Refine checkpoint passed — see{" "}
              <Link
                href="/docs/workflow/delivery"
                className="text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
              >
                Delivery cycles
              </Link>
            </ChecklistItem>
          </ul>
        </div>
      </section>

      {/* Related docs */}
      <section className="border-border rounded-lg border border-dashed p-6">
        <h3 className="font-medium">Related docs</h3>
        <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
          <li>
            <Link
              href="/docs/develop/upgrade"
              className="text-primary hover:underline"
            >
              Upgrade Checklists
            </Link>{" "}
            — Technical work for stage transitions
          </li>
          <li>
            <Link
              href="/docs/audits/deploy"
              className="text-primary hover:underline"
            >
              Deploy &amp; Observe Audit
            </Link>{" "}
            — Deployment quality verification
          </li>
          <li>
            <a
              href="https://vercel.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Vercel Documentation ↗
            </a>{" "}
            — Official Vercel docs
          </li>
        </ul>
      </section>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function BranchCard({
  branch,
  environment,
  description,
  required,
}: {
  branch: string
  environment: string
  description: string
  required: boolean
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <code className="bg-muted rounded px-2 py-0.5 text-sm font-medium">
          {branch}
        </code>
        {required ? (
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Required
          </span>
        ) : (
          <span className="text-muted-foreground rounded bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-800">
            Optional
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{environment}</p>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  )
}

function SetupStep({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {number}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-4 pl-10">{children}</div>
    </div>
  )
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
      <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/60" />
      <span>{children}</span>
    </li>
  )
}
