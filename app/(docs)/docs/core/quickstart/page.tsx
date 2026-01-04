/**
 * CATALYST - Quickstart (High-level)
 *
 * A fast, high-level overview for developers who want to get started
 * quickly. Points to the detailed Setup page for more information.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { CopyButton } from "@/components/shared"
import {
  ArrowRightIcon,
  TerminalIcon,
  SparklesIcon,
  CheckCircle2Icon,
  BookOpenIcon,
  ClockIcon,
  ZapIcon,
  BotIcon,
  CheckIcon,
  KeyboardIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  PaletteIcon,
} from "lucide-react"
import { config } from "@/lib/config"

export default function QuickstartPage() {
  return (
    <article>
      <Stack gap="2xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <Row gap="md" className="flex-wrap">
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <ClockIcon className="h-3 w-3" />5 minutes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ZapIcon className="h-3 w-3" />
              Beginner friendly
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              <BotIcon className="h-3 w-3" />
              AI-assisted
            </span>
          </Row>
          <h1 className="text-3xl font-bold tracking-tight">Quickstart</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Create your repo, install, and start building. This is the fast
            path — if you need detailed instructions or get stuck, visit the{" "}
            <Link
              href="/docs/develop/setup"
              className="text-primary hover:underline"
            >
              full Setup guide
            </Link>
            .
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Prerequisites */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-5">
          <Text weight="semibold">Before you begin</Text>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Text size="sm" variant="muted" weight="medium">
                You&apos;ll need:
              </Text>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  Node.js 20+ installed
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  pnpm package manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  Git installed
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  VS Code with Copilot (or similar AI editor)
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <Text size="sm" variant="muted" weight="medium">
                Quick checks:
              </Text>
              <div className="space-y-1.5">
                <div className="bg-background flex items-center justify-between rounded px-3 py-1.5 font-mono text-xs">
                  <span>node --version</span>
                  <CopyButton text="node --version" variant="icon" />
                </div>
                <div className="bg-background flex items-center justify-between rounded px-3 py-1.5 font-mono text-xs">
                  <span>pnpm --version</span>
                  <CopyButton text="pnpm --version" variant="icon" />
                </div>
              </div>
              <Text size="xs" variant="muted">
                No pnpm?{" "}
                <code className="bg-muted rounded px-1">npm i -g pnpm</code>
              </Text>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Quick Steps */}
        {/* ================================================================ */}
        <Stack gap="lg">
          {/* Step 1: Create Repo */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                1
              </span>
              <div className="bg-border mt-2 h-full w-px" />
            </div>
            <div className="flex-1 space-y-3 pb-6">
              <Row gap="sm">
                <GitBranchIcon className="text-primary h-5 w-5" />
                <Text weight="semibold">Create your repo from template</Text>
              </Row>
              <Text size="sm" variant="muted">
                Choose the method that works for you:
              </Text>

              {/* Option A: GitHub Web */}
              <div className="border-border space-y-3 rounded-lg border p-4">
                <Text size="sm" weight="medium">
                  Option A: GitHub Web (simplest)
                </Text>
                <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
                  <li>
                    Open{" "}
                    <a
                      href={config.catalyst.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Catalyst on GitHub
                      <ExternalLinkIcon className="ml-1 inline h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    Click{" "}
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
                      Use this template
                    </span>{" "}
                    → Create a new repository
                  </li>
                  <li>Name your project (e.g., <code className="bg-muted rounded px-1">my-project</code>) and create</li>
                  <li>Copy your new repo URL from the green <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">Code</span> button</li>
                </ol>
                <Text size="xs" variant="muted" className="pt-1">
                  Then clone it in your terminal:
                </Text>
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="overflow-x-auto text-sm">
                    git clone https://github.com/YOUR-ORG/my-project.git
                  </code>
                  <CopyButton
                    text="git clone https://github.com/YOUR-ORG/my-project.git"
                    variant="icon"
                  />
                </div>
                <Text size="xs" variant="muted">
                  Replace <code className="bg-muted rounded px-1">YOUR-ORG/my-project</code> with your actual repo URL
                </Text>
              </div>

              {/* Option B: GitHub CLI */}
              <div className="border-border space-y-2 rounded-lg border p-4">
                <Text size="sm" weight="medium">
                  Option B: GitHub CLI (one command)
                </Text>
                <Text size="xs" variant="muted">
                  Requires{" "}
                  <a
                    href="https://cli.github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub CLI
                  </a>{" "}
                  — install with{" "}
                  <code className="bg-muted rounded px-1">
                    winget install GitHub.cli
                  </code>
                </Text>
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="overflow-x-auto text-sm">
                    gh repo create my-project --template WEARERIVER/catalyst-ai-dev-kit --private --clone
                  </code>
                  <CopyButton
                    text="gh repo create my-project --template WEARERIVER/catalyst-ai-dev-kit --private --clone"
                    variant="icon"
                  />
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
                <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <Text size="sm" className="text-amber-800 dark:text-amber-200">
                  <strong>Never clone Catalyst directly</strong> — your commits
                  would target the wrong repo. Always use the template.
                </Text>
              </div>

              {/* No access card */}
              <div className="bg-background flex items-center justify-between gap-4 rounded-lg border p-4">
                <div>
                  <Text size="sm" weight="medium">
                    Don&apos;t have access to the repo?
                  </Text>
                  <Text size="xs" variant="muted">
                    Contact {config.vendor.name} to get access.
                  </Text>
                </div>
                <a
                  href={config.vendor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:bg-primary/10 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-current px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  Contact {config.vendor.name}
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2: Initialize & Run */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                2
              </span>
              <div className="bg-border mt-2 h-full w-px" />
            </div>
            <div className="flex-1 space-y-3 pb-6">
              <Row gap="sm">
                <TerminalIcon className="text-primary h-5 w-5" />
                <Text weight="semibold">Initialize & run</Text>
              </Row>
              <Text size="sm" variant="muted">
                Run these commands in your terminal:
              </Text>
              <div className="space-y-2">
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="text-sm">cd my-project</code>
                  <CopyButton text="cd my-project" variant="icon" />
                </div>
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="text-sm">pnpm install</code>
                  <CopyButton text="pnpm install" variant="icon" />
                </div>
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="text-sm">copy .env.example .env.local</code>
                  <CopyButton text="copy .env.example .env.local" variant="icon" />
                </div>
                <div className="bg-muted flex items-center justify-between gap-2 rounded-lg p-3">
                  <code className="text-sm">pnpm dev</code>
                  <CopyButton text="pnpm dev" variant="icon" />
                </div>
              </div>
              <Text size="xs" variant="muted">
                On Mac/Linux, use <code className="bg-muted rounded px-1">cp</code> instead of <code className="bg-muted rounded px-1">copy</code>
              </Text>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 flex items-start gap-2 rounded-lg p-3">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <Text size="sm" className="text-emerald-800 dark:text-emerald-200">
                  You should see{" "}
                  <code className="bg-emerald-100 dark:bg-emerald-900/50 rounded px-1">
                    http://localhost:3000
                  </code>{" "}
                  — Ctrl+click to open in browser
                </Text>
              </div>
            </div>
          </div>

          {/* Step 3: Start Building */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                3
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <Row gap="sm">
                <SparklesIcon className="text-primary h-5 w-5" />
                <Text weight="semibold">Start building with AI</Text>
              </Row>
              <Text size="sm" variant="muted">
                Open VS Code, start a new AI chat, and prime it with the starter
                prompt:
              </Text>
              <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg p-3">
                <code className="text-sm">catalyst/prompts/codingai-1-starter.md</code>
                <CopyButton
                  text="catalyst/prompts/codingai-1-starter.md"
                  variant="icon"
                />
              </div>
              <Text size="xs" variant="muted">
                Attach or paste this file — AI will reply &quot;Yes&quot; when
                ready.
              </Text>

              {/* First prompt example */}
              <div className="border-primary/20 bg-primary/5 space-y-3 rounded-lg border p-4">
                <Text size="sm" weight="medium">
                  Try your first prompt:
                </Text>
                <div className="bg-background rounded-lg p-3">
                  <Text size="sm" className="font-mono leading-relaxed">
                    Create a new page at /app/customers with a data table
                    showing Name, Email, Company, and Status. Use mock data.
                  </Text>
                </div>
                <div className="flex justify-end">
                  <CopyButton
                    text="Create a new page at /app/customers with a data table showing Name, Email, Company, and Status. Use mock data."
                    variant="icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </Stack>

        {/* ================================================================ */}
        {/* Success State */}
        {/* ================================================================ */}
        <section className="border-emerald-500/30 bg-emerald-50 space-y-4 rounded-xl border p-6 dark:bg-emerald-950/20">
          <Row gap="sm">
            <CheckCircle2Icon className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              You&apos;re ready to build
            </h3>
          </Row>
          <Text size="sm" className="text-emerald-800 dark:text-emerald-200">
            Your project is running and AI is primed. You now have a working
            Catalyst environment — start with a small proof, iterate quickly,
            and steer on what&apos;s real.
          </Text>
        </section>

        {/* ================================================================ */}
        {/* Quick Reference */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <Row gap="sm">
            <KeyboardIcon className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Quick reference</h2>
          </Row>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-border space-y-2 rounded-lg border p-4">
              <Text size="sm" weight="medium">
                Terminal commands
              </Text>
              <div className="text-muted-foreground space-y-1 text-sm">
                <div className="flex justify-between">
                  <code>pnpm dev</code>
                  <span>Start server</span>
                </div>
                <div className="flex justify-between">
                  <code>pnpm build</code>
                  <span>Build for prod</span>
                </div>
                <div className="flex justify-between">
                  <code>pnpm lint</code>
                  <span>Check code</span>
                </div>
                <div className="flex justify-between">
                  <code>Ctrl+C</code>
                  <span>Stop server</span>
                </div>
              </div>
            </div>
            <div className="border-border space-y-2 rounded-lg border p-4">
              <Text size="sm" weight="medium">
                VS Code shortcuts
              </Text>
              <div className="text-muted-foreground space-y-1 text-sm">
                <div className="flex justify-between">
                  <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    Ctrl+Shift+I
                  </kbd>
                  <span>Open Copilot</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    Ctrl+Shift+P
                  </kbd>
                  <span>Command palette</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    Ctrl+`
                  </kbd>
                  <span>Open terminal</span>
                </div>
                <div className="flex justify-between">
                  <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">
                    Ctrl+S
                  </kbd>
                  <span>Save file</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Troubleshooting */}
        {/* ================================================================ */}
        <section className="border-border space-y-3 rounded-lg border p-4">
          <Row gap="sm">
            <AlertCircleIcon className="text-muted-foreground h-4 w-4" />
            <Text size="sm" weight="medium">
              Quick fixes
            </Text>
          </Row>
          <div className="text-muted-foreground grid gap-2 text-sm md:grid-cols-2">
            <div>
              <strong className="text-foreground">Server won&apos;t start?</strong>{" "}
              Delete <code className="bg-muted rounded px-1">node_modules</code>{" "}
              and run <code className="bg-muted rounded px-1">pnpm install</code>{" "}
              again.
            </div>
            <div>
              <strong className="text-foreground">Changes not showing?</strong>{" "}
              Hard refresh with{" "}
              <kbd className="bg-muted rounded px-1">Ctrl+Shift+R</kbd>.
            </div>
            <div>
              <strong className="text-foreground">AI not following patterns?</strong>{" "}
              Make sure you primed with the starter prompt first.
            </div>
            <div>
              <strong className="text-foreground">Need more help?</strong>{" "}
              See the{" "}
              <Link
                href="/docs/develop/setup"
                className="text-primary hover:underline"
              >
                full Setup guide
              </Link>
              .
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Next Steps */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">What&apos;s next?</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <NextLink
              href="/docs/design/customisation"
              title="Make it yours"
              description="Customise colours, radius, fonts, and more"
              icon={PaletteIcon}
            />
            <NextLink
              href="/docs/core/approach"
              title="Learn the approach"
              description="Why proof-led delivery works"
            />
            <NextLink
              href="/docs/design"
              title="Explore the design system"
              description="Colours, typography, components"
            />
            <NextLink
              href="/docs/develop/setup"
              title="Full setup guide"
              description="Detailed steps if you get stuck"
              icon={BookOpenIcon}
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

function NextLink({
  href,
  title,
  description,
  icon: Icon = ArrowRightIcon,
}: {
  href: string
  title: string
  description: string
  icon?: React.ElementType
}) {
  return (
    <Link
      href={href}
      className="border-border hover:border-primary/30 hover:bg-muted/50 group flex items-center gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex-1">
        <Text weight="medium" className="group-hover:text-primary">
          {title}
        </Text>
        <Text size="sm" variant="muted">
          {description}
        </Text>
      </div>
      <Icon className="text-muted-foreground group-hover:text-primary h-4 w-4" />
    </Link>
  )
}
