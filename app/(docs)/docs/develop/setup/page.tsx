/**
 * CATALYST - Setup Guide (Detailed)
 *
 * Comprehensive setup guide with detailed instructions, troubleshooting,
 * and help accordions for each step. For the quick version, see /docs/core/quickstart.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { CopyButton } from "@/components/shared"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  TerminalIcon,
  ArrowRightIcon,
  DownloadIcon,
  PackageIcon,
  GitBranchIcon,
  CodeIcon,
  PaletteIcon,
  SparklesIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
  ExternalLinkIcon,
  PlayIcon,
  LightbulbIcon,
  ClockIcon,
  WrenchIcon,
  CheckIcon,
  KeyboardIcon,
  AlertCircleIcon,
  BotIcon,
  SettingsIcon,
} from "lucide-react"
import { config } from "@/lib/config"

export default function SetupPage() {
  return (
    <article>
      <Stack gap="2xl">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <header className="space-y-4">
          <Row gap="md" className="flex-wrap">
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <ClockIcon className="h-3 w-3" />
              20-30 min setup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle2Icon className="h-3 w-3" />
              Beginner friendly
            </span>
          </Row>
          <h1 className="text-3xl font-bold tracking-tight">Setup Guide</h1>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Complete setup instructions with troubleshooting for each step.
            This guide expands on the{" "}
            <Link
              href="/docs/core/quickstart"
              className="text-primary hover:underline"
            >
              Quickstart
            </Link>{" "}
            with detailed help for beginners and troubleshooting when things go wrong.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Guide Overview */}
        {/* ================================================================ */}
        <div className="border-border bg-muted/30 rounded-lg border p-4">
          <Text size="sm" weight="medium" className="mb-3">
            This guide follows the same 3 steps as Quickstart:
          </Text>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                1
              </span>
              <span>Create your repo</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                2
              </span>
              <span>Initialize & run</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                3
              </span>
              <span>Start building</span>
            </div>
          </div>
          <Text size="xs" variant="muted" className="mt-3">
            Plus prerequisite setup (Steps 1-2) and optional customization (Step 7).
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Intro Tip */}
        {/* ================================================================ */}
        <div className="bg-primary/5 flex items-start gap-3 rounded-lg p-4">
          <SparklesIcon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <Text weight="medium">First time setting up a dev environment?</Text>
            <Text size="sm" variant="muted" className="mt-1">
              That&apos;s okay! Each step includes detailed instructions. Take your time — you only do this once.
            </Text>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Before You Begin */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/30 space-y-4 rounded-xl border p-6">
          <Row gap="sm">
            <CheckCircle2Icon className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Before You Begin</h2>
          </Row>
          <Text size="sm" variant="muted">
            Make sure you have or can get the following:
          </Text>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Required */}
            <div className="space-y-3">
              <Text size="sm" weight="semibold" className="text-emerald-600 dark:text-emerald-400">
                ✓ Required
              </Text>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                  A GitHub account (free)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                  Access to the Catalyst repository
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                  A computer (Windows, Mac, or Linux)
                </li>
              </ul>
            </div>

            {/* Will be installed */}
            <div className="space-y-3">
              <Text
                size="sm"
                weight="semibold"
                className="text-muted-foreground"
              >
                ○ Will be installed
              </Text>
              <ul className="space-y-2">
                <li className="text-muted-foreground flex items-center gap-2 text-sm">
                  <DownloadIcon className="h-4 w-4" />
                  Node.js (runs JavaScript)
                </li>
                <li className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CodeIcon className="h-4 w-4" />
                  VS Code (code editor)
                </li>
                <li className="text-muted-foreground flex items-center gap-2 text-sm">
                  <GitBranchIcon className="h-4 w-4" />
                  Git (version control)
                </li>
                <li className="text-muted-foreground flex items-center gap-2 text-sm">
                  <BotIcon className="h-4 w-4" />
                  GitHub Copilot (AI assistant)
                </li>
              </ul>
            </div>
          </div>

          <NoAccessCard />
        </section>

        {/* ================================================================ */}
        {/* PHASE 1: ENVIRONMENT SETUP (Pre-requisites) */}
        {/* ================================================================ */}
        <div className="border-border border-l-4 pl-4">
          <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wide">
            Before you start
          </Text>
          <Text size="sm" variant="muted" className="mt-1">
            One-time setup for your machine
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Step 1: Install Required Software */}
        {/* ================================================================ */}
        <StepSection
          step={1}
          icon={WrenchIcon}
          title="Install required software"
          description="Get the tools you need to run Catalyst."
        >
          <Accordion className="space-y-2">
            {/* Node.js */}
            <AccordionItem
              value="nodejs"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <DownloadIcon className="text-primary h-4 w-4" />
                  <span className="font-medium">Node.js</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    — Runs JavaScript on your computer
                  </span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </span>
                    <div>
                      Go to{" "}
                      <a
                        href="https://nodejs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        nodejs.org
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </span>
                    <div>
                      Download the <strong>LTS version</strong>
                      <Text size="xs" variant="muted" className="block">
                        LTS = Long Term Support (most stable)
                      </Text>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </span>
                    <div>
                      Run the installer
                      <Text size="xs" variant="muted" className="block">
                        Accept all default settings
                      </Text>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      4
                    </span>
                    <div>
                      Restart your computer
                      <Text size="xs" variant="muted" className="block">
                        Ensures Node.js is available everywhere
                      </Text>
                    </div>
                  </li>
                </ol>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>
                    To verify: Open a terminal and run{" "}
                    <code className="rounded bg-blue-100 px-1 dark:bg-blue-900/50">
                      node --version
                    </code>
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* VS Code */}
            <AccordionItem
              value="vscode"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <CodeIcon className="text-primary h-4 w-4" />
                  <span className="font-medium">Visual Studio Code</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    — Code editor with AI integration
                  </span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </span>
                    <div>
                      Go to{" "}
                      <a
                        href="https://code.visualstudio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        code.visualstudio.com
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </span>
                    <div>Download for your operating system</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </span>
                    <div>
                      Run the installer
                      <Text size="xs" variant="muted" className="block">
                        Check &quot;Add to PATH&quot; if prompted
                      </Text>
                    </div>
                  </li>
                </ol>
                <Text size="xs" variant="muted" className="mt-4">
                  Other AI-enabled IDEs work too:{" "}
                  <a
                    href="https://cursor.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Cursor
                  </a>
                  ,{" "}
                  <a
                    href="https://windsurf.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Windsurf
                  </a>
                  , or{" "}
                  <a
                    href="https://antigravity.google/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Antigravity
                  </a>
                  .
                </Text>
              </AccordionContent>
            </AccordionItem>

            {/* Git */}
            <AccordionItem
              value="git"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <GitBranchIcon className="text-primary h-4 w-4" />
                  <span className="font-medium">Git</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    — Version control for code
                  </span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </span>
                    <div>
                      Go to{" "}
                      <a
                        href="https://git-scm.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        git-scm.com
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </span>
                    <div>Download for your operating system</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </span>
                    <div>
                      Run the installer
                      <Text size="xs" variant="muted" className="block">
                        Accept all defaults (there are many screens, just keep
                        clicking Next)
                      </Text>
                    </div>
                  </li>
                </ol>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>
                    To verify: Open a terminal and run{" "}
                    <code className="rounded bg-blue-100 px-1 dark:bg-blue-900/50">
                      git --version
                    </code>
                  </span>
                </div>
                <Text size="xs" variant="muted" className="mt-2">
                  Note: Mac and Linux often have Git pre-installed.
                </Text>
              </AccordionContent>
            </AccordionItem>

            {/* pnpm */}
            <AccordionItem
              value="pnpm"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <PackageIcon className="text-primary h-4 w-4" />
                  <span className="font-medium">pnpm</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    — Fast package manager
                  </span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <div className="space-y-3 text-sm">
                  <Text>Open a terminal and run one of these commands:</Text>
                  <div className="space-y-2">
                    <div className="bg-background flex items-center justify-between rounded-lg p-3">
                      <code>npm install -g pnpm</code>
                      <CopyButton text="npm install -g pnpm" variant="icon" />
                    </div>
                    <Text size="xs" variant="muted" className="text-center">
                      or
                    </Text>
                    <div className="bg-background flex items-center justify-between rounded-lg p-3">
                      <code>corepack enable</code>
                      <CopyButton text="corepack enable" variant="icon" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>
                    To verify: Run{" "}
                    <code className="rounded bg-blue-100 px-1 dark:bg-blue-900/50">
                      pnpm --version
                    </code>
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </StepSection>

        {/* ================================================================ */}
        {/* Step 2: Set Up GitHub Copilot */}
        {/* ================================================================ */}
        <StepSection
          step={2}
          icon={BotIcon}
          title="Set up GitHub Copilot"
          description="Your AI coding assistant for Catalyst development."
        >
          <div className="bg-muted/50 mb-4 rounded-lg p-4">
            <Row gap="sm" className="mb-2">
              <LightbulbIcon className="h-4 w-4 text-amber-500" />
              <Text size="sm" weight="medium">
                AI-Powered Development
              </Text>
            </Row>
            <Text size="sm" variant="muted">
              GitHub Copilot is your AI coding assistant. It understands the
              project context and helps you write code. Other options include
              Cursor, Windsurf, or Claude — but this guide focuses on Copilot.
            </Text>
          </div>

          <Accordion className="space-y-2">
            <AccordionItem
              value="subscribe"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                    1
                  </span>
                  <span className="font-medium">
                    Subscribe to GitHub Copilot
                  </span>
                  <span className="text-muted-foreground text-sm font-normal">
                    ($10/month)
                  </span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </span>
                    <div>
                      Go to{" "}
                      <a
                        href="https://github.com/features/copilot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        github.com/features/copilot
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </span>
                    <div>
                      Click &quot;Start my free trial&quot; or &quot;Get GitHub
                      Copilot&quot;
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </span>
                    <div>
                      Sign in with your GitHub account and complete signup
                    </div>
                  </li>
                </ol>
                <Text size="xs" variant="muted" className="mt-3">
                  Students and open source contributors may qualify for free
                  access.
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="install"
              className="border-border overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="hover:bg-muted/50 px-4 py-3">
                <Row gap="sm">
                  <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                    2
                  </span>
                  <span className="font-medium">Install Copilot in VS Code</span>
                </Row>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/30 px-4 pt-4 pb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </span>
                    <div>Open VS Code</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </span>
                    <div>
                      Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on Mac)
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </span>
                    <div>
                      Search for &quot;GitHub Copilot&quot; and install both:
                      <ul className="text-muted-foreground mt-1 ml-4 list-disc">
                        <li>GitHub Copilot</li>
                        <li>GitHub Copilot Chat</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      4
                    </span>
                    <div>Sign in when prompted</div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <HelpAccordion title="Using a different AI tool?">
            <div className="space-y-3 text-sm">
              <p>
                Catalyst works with any AI coding tool. The key patterns in{" "}
                <code className="bg-muted rounded px-1">AGENTS.md</code> and the
                starter prompts work across:
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Cursor</a> — Built-in AI chat
                </li>
                <li>
                  <a href="https://windsurf.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Windsurf</a> — Cascade AI
                </li>
                <li>
                  <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Antigravity</a> — Cloud IDE with Gemini
                </li>
                <li>
                  <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Claude Code</a> — Terminal-based (for experienced devs)
                </li>
              </ul>
              <p className="text-muted-foreground text-xs pt-1">
                Catalyst is optimised for full IDEs with file access and inline editing.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* PHASE 2: CREATE YOUR REPO (Quickstart Step 1) */}
        {/* ================================================================ */}
        <div className="border-primary border-l-4 pl-4">
          <Row gap="sm">
            <Text size="xs" weight="semibold" className="text-primary uppercase tracking-wide">
              Quickstart Step 1
            </Text>
          </Row>
          <Text size="sm" variant="muted" className="mt-1">
            Create your repo from the Catalyst template
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Step 3: Create from Template */}
        {/* ================================================================ */}
        <StepSection
          step={3}
          icon={GitBranchIcon}
          title="Create your repo from template"
          description="Get your own copy of Catalyst — not a clone."
        >
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20 mb-4">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <Text size="sm" className="text-amber-800 dark:text-amber-200">
              <strong>Never clone Catalyst directly</strong> — your commits
              would target the wrong repo. Always use the template to create your own repo.
            </Text>
          </div>

          <div className="space-y-4">
            <Text size="sm" weight="medium">
              Option A: GitHub Web (simplest)
            </Text>
            <ol className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  1
                </span>
                <span>
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
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  2
                </span>
                <span>
                  Click the green{" "}
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
                    Use this template
                  </span>{" "}
                  button → Create a new repository
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  3
                </span>
                <span>Name your project (e.g., <code className="bg-muted rounded px-1">my-project</code>), choose visibility, and create</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  4
                </span>
                <span>
                  Copy your new repo URL from the green{" "}
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
                    Code
                  </span>{" "}
                  button
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                  5
                </span>
                <span>Clone your new repo:</span>
              </li>
            </ol>
            <CodeBlock code="git clone https://github.com/YOUR-ORG/my-project.git" />
            <Text size="xs" variant="muted">
              Replace <code className="bg-muted rounded px-1">YOUR-ORG/my-project</code> with your actual repo URL
            </Text>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background text-muted-foreground px-2 text-sm">
                  or
                </span>
              </div>
            </div>

            <Text size="sm" weight="medium">
              Option B: GitHub CLI (one command)
            </Text>
            <Text size="xs" variant="muted" className="mb-2">
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
              </code>{" "}
              then{" "}
              <code className="bg-muted rounded px-1">
                gh auth login
              </code>
            </Text>
            <CodeBlock code="gh repo create my-project --template WEARERIVER/catalyst-ai-dev-kit --private --clone" />
          </div>

          <NoAccessCard />

          <HelpAccordion title="Need help with this step?">
            <div className="space-y-3 text-sm">
              <p>
                <strong>Can&apos;t see &quot;Use this template&quot;?</strong> You may not have access to the Catalyst repository. Contact {config.vendor.name} to get access.
              </p>
              <p>
                <strong>Clone failed?</strong> Make sure you&apos;re cloning your new repo URL (not the Catalyst repo). Check that you created the repo successfully in GitHub first.
              </p>
              <p>
                <strong>gh command not found?</strong> Install GitHub CLI first, then run <code className="bg-muted rounded px-1">gh auth login</code> to authenticate.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* PHASE 3: INITIALIZE & RUN (Quickstart Step 2) */}
        {/* ================================================================ */}
        <div className="border-primary border-l-4 pl-4">
          <Row gap="sm">
            <Text size="xs" weight="semibold" className="text-primary uppercase tracking-wide">
              Quickstart Step 2
            </Text>
          </Row>
          <Text size="sm" variant="muted" className="mt-1">
            Initialize & run your project
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Step 4: Install Dependencies */}
        {/* ================================================================ */}
        <StepSection
          step={4}
          icon={PackageIcon}
          title="Install dependencies"
          description="Install project packages with pnpm."
        >
          <CodeBlock code={`cd my-project
pnpm install`} />

          <HelpAccordion title="pnpm install failed?">
            <div className="space-y-3 text-sm">
              <p>
                <strong>pnpm not found?</strong> Make sure you installed pnpm in
                Step 1. Run{" "}
                <code className="bg-muted rounded px-1">
                  npm install -g pnpm
                </code>{" "}
                to install it.
              </p>
              <p>
                <strong>Network error?</strong> Check your internet connection and try again.
              </p>
              <p>
                <strong>Still failing?</strong> Try deleting{" "}
                <code className="bg-muted rounded px-1">node_modules</code> and{" "}
                <code className="bg-muted rounded px-1">pnpm-lock.yaml</code>,
                then run{" "}
                <code className="bg-muted rounded px-1">pnpm install</code>{" "}
                again.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* Step 5: Environment Setup */}
        {/* ================================================================ */}
        <StepSection
          step={5}
          icon={SettingsIcon}
          title="Set up environment"
          description="Configure environment variables for your project."
        >
          <CodeBlock code="copy .env.example .env.local" />
          <Text size="xs" variant="muted" className="mt-2">
            On Mac/Linux, use <code className="bg-muted rounded px-1">cp</code> instead of <code className="bg-muted rounded px-1">copy</code>
          </Text>

          <div className="bg-muted/50 mt-4 rounded-lg p-4">
            <Text size="sm" variant="muted">
              The <code className="bg-muted rounded px-1">.env.local</code> file
              contains settings for your local environment. For a basic POC, the
              defaults work fine. If you&apos;re using Supabase authentication,
              you&apos;ll need to add your keys.
            </Text>
          </div>

          <HelpAccordion title="What's in .env.local?">
            <div className="space-y-3 text-sm">
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_URL</strong> — Your Supabase
                project URL (optional for POC)
              </p>
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> — Your Supabase
                anon key (optional for POC)
              </p>
              <p>
                <strong>NEXT_PUBLIC_DOCS_ENABLED</strong> — Set to
                &quot;false&quot; to hide docs in production
              </p>
              <p>
                See{" "}
                <Link
                  href="/docs/integrations/supabase-auth"
                  className="text-primary hover:underline"
                >
                  Supabase Auth
                </Link>{" "}
                for full authentication setup.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* Step 6: Run */}
        {/* ================================================================ */}
        <StepSection
          step={6}
          icon={PlayIcon}
          title="Start the dev server"
          description="Run the development server to see Catalyst in action."
        >
          <CodeBlock code="pnpm dev" />

          <div className="bg-emerald-50 dark:bg-emerald-950/20 mt-4 flex items-start gap-3 rounded-lg p-4">
            <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <Text
                weight="medium"
                className="text-emerald-900 dark:text-emerald-100"
              >
                You should see:
              </Text>
              <Text
                size="sm"
                className="mt-1 text-emerald-800 dark:text-emerald-200"
              >
                Open{" "}
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  localhost:3000
                </a>{" "}
                in your browser. You&apos;ll see the Catalyst landing page with
                links to Web, App, Docs, and Present surfaces.
              </Text>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 mt-3 flex items-start gap-3 rounded-lg p-4">
            <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <Text
                size="sm"
                weight="medium"
                className="text-amber-900 dark:text-amber-100"
              >
                Keep the terminal running!
              </Text>
              <Text size="xs" className="text-amber-800 dark:text-amber-200">
                The dev server needs to stay active while you work. Press Ctrl+C
                to stop it later.
              </Text>
            </div>
          </div>

          <HelpAccordion title="Server not starting?">
            <div className="space-y-3 text-sm">
              <p>
                <strong>Port in use?</strong> Another app might be using port
                3000. Kill it or run{" "}
                <code className="bg-muted rounded px-1">
                  pnpm dev -- -p 3001
                </code>
                .
              </p>
              <p>
                <strong>Missing dependencies?</strong> Run{" "}
                <code className="bg-muted rounded px-1">pnpm install</code>{" "}
                again.
              </p>
              <p>
                <strong>Node version issues?</strong> Make sure you have Node.js
                18 or higher. Check with{" "}
                <code className="bg-muted rounded px-1">node --version</code>.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* PHASE 4: START BUILDING (Quickstart Step 3) */}
        {/* ================================================================ */}
        <div className="border-primary border-l-4 pl-4">
          <Row gap="sm">
            <Text size="xs" weight="semibold" className="text-primary uppercase tracking-wide">
              Quickstart Step 3
            </Text>
          </Row>
          <Text size="sm" variant="muted" className="mt-1">
            Start building with AI
          </Text>
        </div>

        {/* ================================================================ */}
        {/* Step 7: Customize Your Project */}
        {/* ================================================================ */}
        <StepSection
          step={7}
          icon={PaletteIcon}
          title="Customise your project"
          description="Make this project yours using AI prompts."
          optional
        >
          <div className="space-y-4">
            <Text size="sm" variant="muted">
              Now that everything is running, use AI to customise the project.
              For comprehensive design changes, see the{" "}
              <Link href="/docs/design/customisation" className="text-primary hover:underline">
                Customisation guide
              </Link>.
            </Text>

            {/* Design Personality */}
            <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50/50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/10">
              <Row gap="sm" className="mb-2 items-center">
                <SparklesIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <Text weight="semibold">Beyond just colour</Text>
              </Row>
              <Text size="sm" className="text-violet-900 dark:text-violet-200">
                Changing the primary colour alone won&apos;t differentiate your
                project. The{" "}
                <Link href="/docs/design/customisation" className="underline">
                  Customisation guide
                </Link>{" "}
                covers personality presets that adjust radius, gray temperature,
                typography, and more.
              </Text>
            </div>

            {/* Rename Project */}
            <PromptCard
              title="Rename Project"
              prompt={`Read AGENTS.md, then rename this project from "Catalyst" to "[YOUR PROJECT NAME]".

Update:
1. The app name in lib/config.ts
2. The page title in app/layout.tsx
3. The package name in package.json
4. The heading in AGENTS.md`}
            />

            {/* Quick Colour Change */}
            <PromptCard
              title="Quick Colour Change"
              prompt={`Read AGENTS.md, then change the primary colour from blue to [purple/green/orange].

Update all primary-50 through primary-900 values in app/globals.css.
Keep the same lightness and chroma patterns, just change the hue.`}
            />
          </div>

          <HelpAccordion title="What if I don't want to customise yet?">
            <div className="space-y-3 text-sm">
              <p>
                That&apos;s fine! You can skip this step and start building
                features right away. Customisation can happen any time.
              </p>
            </div>
          </HelpAccordion>

          <div className="mt-4 flex">
            <Link
              href="/docs/design/customisation"
              className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 text-sm font-medium transition-colors"
            >
              <PaletteIcon className="h-4 w-4" />
              Full Customisation Guide
            </Link>
          </div>
        </StepSection>

        {/* ================================================================ */}
        {/* Step 8: Start Building */}
        {/* ================================================================ */}
        <StepSection
          step={8}
          icon={SparklesIcon}
          title="Start building with AI"
          description="Use the starter prompt for best results."
        >
          <div className="space-y-4">
            <Text size="sm" variant="muted">
              For the best AI experience, start each new chat by priming it with
              the starter prompt:
            </Text>

            <div className="bg-muted/50 flex items-center justify-between gap-3 rounded-lg p-4">
              <div>
                <code className="text-sm">catalyst/prompts/codingai-1-starter.md</code>
                <Text size="xs" variant="muted" className="mt-1 block">
                  Attach or paste this file at the start of each AI chat
                </Text>
              </div>
              <CopyButton text="catalyst/prompts/codingai-1-starter.md" variant="icon" />
            </div>

            <div className="space-y-3">
              <Text size="sm" weight="medium">
                What the starter prompt does:
              </Text>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  Sets guardrails for simple, maintainable code
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  Tells AI to read AGENTS.md for conventions
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  Establishes a collaboration pattern (confirm goals, phased
                  work)
                </li>
                <li className="flex gap-2">
                  <CheckCircle2Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  AI replies &quot;Yes&quot; when ready to proceed
                </li>
              </ul>
            </div>
          </div>

          <HelpAccordion title="Tips for effective prompting">
            <div className="space-y-3 text-sm">
              <p>
                <strong>Be specific.</strong> Instead of &quot;make a
                dashboard&quot;, say &quot;create a dashboard showing 4 stat
                cards and a recent activity list&quot;.
              </p>
              <p>
                <strong>Reference patterns.</strong> Say &quot;Follow the
                pattern from /app/dashboard&quot; to get consistent results.
              </p>
              <p>
                <strong>Use @workspace.</strong> In Copilot, use{" "}
                <code className="bg-muted rounded px-1">@workspace</code> to give
                it full codebase context.
              </p>
              <p>
                <strong>Start small.</strong> Build one feature at a time.
                It&apos;s easier to iterate on a working page than fix a broken
                complex one.
              </p>
            </div>
          </HelpAccordion>
        </StepSection>

        {/* ================================================================ */}
        {/* Quick Reference */}
        {/* ================================================================ */}
        <section className="border-border bg-muted/20 space-y-4 rounded-xl border p-5">
          <Row gap="sm">
            <KeyboardIcon className="text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Quick Reference</h2>
          </Row>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-background space-y-3 rounded-lg p-4">
              <Text size="sm" weight="medium">
                Keyboard Shortcuts
              </Text>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Open Copilot Chat</span>
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">
                    Ctrl+Shift+I
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Command Palette</span>
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">
                    Ctrl+Shift+P
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Open Terminal</span>
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">
                    Ctrl+`
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Save File</span>
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">
                    Ctrl+S
                  </kbd>
                </div>
              </div>
            </div>
            <div className="bg-background space-y-3 rounded-lg p-4">
              <Text size="sm" weight="medium">
                Terminal Commands
              </Text>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <code className="text-muted-foreground">pnpm dev</code>
                  <span className="text-muted-foreground">Start server</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-muted-foreground">pnpm build</code>
                  <span className="text-muted-foreground">Build for prod</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-muted-foreground">pnpm lint</code>
                  <span className="text-muted-foreground">Check code</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-muted-foreground">Ctrl+C</code>
                  <span className="text-muted-foreground">Stop server</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Troubleshooting */}
        {/* ================================================================ */}
        <section className="border-border space-y-4 rounded-lg border p-5">
          <Row gap="sm">
            <AlertCircleIcon className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">Troubleshooting</h2>
          </Row>

          <Accordion className="space-y-2">
            <AccordionItem value="server" className="border-none">
              <AccordionTrigger className="hover:bg-muted/50 rounded-lg px-4 py-3 text-sm">
                Server won&apos;t start?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    • Delete{" "}
                    <code className="bg-muted rounded px-1">node_modules</code>{" "}
                    folder and run{" "}
                    <code className="bg-muted rounded px-1">pnpm install</code>{" "}
                    again
                  </li>
                  <li>
                    • Make sure you&apos;re in the project directory (
                    <code className="bg-muted rounded px-1">
                      cd my-project
                    </code>
                    )
                  </li>
                  <li>
                    • Check Node version:{" "}
                    <code className="bg-muted rounded px-1">node --version</code>{" "}
                    (need 20+)
                  </li>
                  <li>
                    • Kill any process on port 3000 or use{" "}
                    <code className="bg-muted rounded px-1">
                      pnpm dev -- -p 3001
                    </code>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai" className="border-none">
              <AccordionTrigger className="hover:bg-muted/50 rounded-lg px-4 py-3 text-sm">
                AI not responding or following conventions?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    • Make sure you primed the AI with the starter prompt first
                  </li>
                  <li>
                    • In Copilot, use{" "}
                    <code className="bg-muted rounded px-1">@workspace</code> to
                    give it context
                  </li>
                  <li>
                    • Ask: &quot;What did you learn from AGENTS.md?&quot; to
                    verify it read the file
                  </li>
                  <li>• Try starting a fresh chat and priming again</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="changes" className="border-none">
              <AccordionTrigger className="hover:bg-muted/50 rounded-lg px-4 py-3 text-sm">
                Changes not showing in browser?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    • Make sure you saved the file (
                    <kbd className="bg-muted rounded px-1">Ctrl+S</kbd>)
                  </li>
                  <li>
                    • Hard refresh the browser (
                    <kbd className="bg-muted rounded px-1">Ctrl+Shift+R</kbd>)
                  </li>
                  <li>• Check the terminal for errors</li>
                  <li>
                    • Restart the dev server: Ctrl+C, then{" "}
                    <code className="bg-muted rounded px-1">pnpm dev</code>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="git" className="border-none">
              <AccordionTrigger className="hover:bg-muted/50 rounded-lg px-4 py-3 text-sm">
                Git or clone issues?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Make sure you have access to the repository</li>
                  <li>
                    • If you get 404, contact {config.vendor.name} for access
                  </li>
                  <li>
                    • Try cloning via VS Code instead of terminal (or vice
                    versa)
                  </li>
                  <li>
                    • Make sure Git is installed:{" "}
                    <code className="bg-muted rounded px-1">git --version</code>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ================================================================ */}
        {/* POC-Safe Reminder */}
        {/* ================================================================ */}
        <section className="border-amber-500/30 bg-amber-50 space-y-3 rounded-xl border p-5 dark:bg-amber-950/20">
          <Row gap="sm">
            <LightbulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Catalyst is about steering
            </h3>
          </Row>
          <Text size="sm" className="text-amber-800 dark:text-amber-200">
            Building proof, not production. Keep your first iteration POC-safe:
          </Text>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">→</span>
              Keep scope tight — aim for something steerable inside a week
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">→</span>
              Mock data is fine — don&apos;t wire up production databases yet
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">→</span>
              Book a steering session once the proof works
            </li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Success State */}
        {/* ================================================================ */}
        <section className="border-emerald-500/30 bg-emerald-50 space-y-5 rounded-xl border p-6 dark:bg-emerald-950/20">
          <Row gap="sm">
            <CheckCircle2Icon className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              You&apos;re all set!
            </h3>
          </Row>
          <Text size="sm" className="text-emerald-800 dark:text-emerald-200">
            Your development environment is ready. Start building with AI and
            iterate fast.
          </Text>

          <div className="grid gap-2 md:grid-cols-2">
            <SuccessLink
              href="/docs/core/approach"
              label="Learn the approach"
            />
            <SuccessLink
              href="/docs/workflow"
              label="Understand the workflow"
            />
            <SuccessLink
              href="/docs/design"
              label="Explore the design system"
            />
            <SuccessLink
              href="/docs/project/coding-prompts"
              label="See more prompt examples"
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

function StepSection({
  step,
  icon: Icon,
  title,
  description,
  optional,
  children,
}: {
  step: number
  icon: React.ElementType
  title: string
  description: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="border-border rounded-xl border p-6">
      <div className="mb-4">
        <Row gap="md" className="mb-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {step}
          </div>
          <div className="flex items-center gap-2">
            <Icon className="text-muted-foreground h-5 w-5" />
            <h3 className="text-lg font-semibold">{title}</h3>
            {optional && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                Optional
              </span>
            )}
          </div>
        </Row>
        <Text size="sm" variant="muted" className="ml-11">
          {description}
        </Text>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div>
      {label && (
        <Text size="xs" variant="muted" className="mb-1.5">
          {label}
        </Text>
      )}
      <div className="bg-muted group relative overflow-hidden rounded-lg">
        <pre className="overflow-x-auto p-4 text-sm">
          <code>{code}</code>
        </pre>
        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={code} variant="icon" />
        </div>
      </div>
    </div>
  )
}

function HelpAccordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Accordion className="mt-3">
      <AccordionItem value="help" className="border-none">
        <AccordionTrigger className="text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg px-4 py-3 text-sm">
          <Row gap="sm">
            <HelpCircleIcon className="h-4 w-4" />
            {title}
          </Row>
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-muted-foreground px-4 pt-3 pb-1">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function NoAccessCard() {
  return (
    <div className="bg-background mt-4 flex items-center justify-between gap-4 rounded-lg border p-4">
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
  )
}

function PromptCard({ title, prompt }: { title: string; prompt: string }) {
  return (
    <div className="border-border rounded-lg border p-4">
      <Row gap="sm" className="mb-3">
        <SparklesIcon className="text-primary h-4 w-4" />
        <Text size="sm" weight="medium">
          {title}
        </Text>
      </Row>
      <div className="bg-muted rounded-lg p-3">
        <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
          {prompt}
        </pre>
      </div>
      <div className="mt-2 flex justify-end">
        <CopyButton text={prompt} variant="icon" />
      </div>
    </div>
  )
}

function SuccessLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg p-2 text-sm text-emerald-700 transition-colors hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
    >
      <ArrowRightIcon className="h-3.5 w-3.5" />
      {label}
    </Link>
  )
}
