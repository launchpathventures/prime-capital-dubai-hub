/**
 * CATALYST - Code & Testing Audit
 *
 * Structured code quality review covering standards, test coverage,
 * and dependency health. Ensure your codebase is maintainable.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  CodeIcon,
  CheckSquareIcon,
  PackageIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
  FileCodeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CodeAuditPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CodeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Code &amp; Testing
              </h1>
              <Text variant="muted" className="italic">
                Is this maintainable?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review coding standards, test coverage, and dependency health.
            Maintainable code scales; messy code creates debt.
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
              level="Skip"
              expectations={[
                "Lint passes, that's enough",
                "Tests are optional",
                "Speed over quality",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Light"
              expectations={[
                "Happy path tests exist",
                "No critical vulnerabilities",
                "Basic structure established",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Good test coverage",
                "Tech debt documented",
                "Dependencies audited",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "High coverage on critical paths",
                "Dependencies current and secure",
                "Debt actively managed",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="standards">
          <TabsList className="mb-4">
            <TabsTrigger value="standards">
              <FileCodeIcon className="h-4 w-4" />
              Standards & Style
            </TabsTrigger>
            <TabsTrigger value="testing">
              <CheckSquareIcon className="h-4 w-4" />
              Test Coverage
            </TabsTrigger>
            <TabsTrigger value="dependencies">
              <PackageIcon className="h-4 w-4" />
              Dependencies & Debt
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Standards & Style */}
          <TabsContent value="standards">
            <Stack gap="lg">
              <ChecklistSection
                title="Linting & Formatting"
                stage="poc"
                items={[
                  "ESLint passes with no errors",
                  "Prettier formatting applied consistently",
                  "No disabled linting rules without justification",
                  "Lint runs in CI on every PR",
                  "Pre-commit hooks enforce linting",
                  "Editor settings match project config",
                ]}
              />

              <ChecklistSection
                title="TypeScript Quality"
                stage="mvp"
                items={[
                  "TypeScript strict mode enabled",
                  "No use of 'any' without explicit justification",
                  "Proper types for API responses",
                  "Shared types in dedicated files",
                  "Enums or const objects for fixed values",
                  "Generics used appropriately for reusable code",
                  "No ts-ignore comments without explanation",
                ]}
              />

              <ChecklistSection
                title="Naming Conventions"
                stage="mvp"
                items={[
                  "PascalCase for components and types",
                  "camelCase for variables and functions",
                  "SCREAMING_SNAKE_CASE for constants",
                  "kebab-case for file names",
                  "Descriptive names (not single letters except loops)",
                  "Boolean variables start with is/has/should",
                  "Event handlers prefixed with handle or on",
                ]}
              />

              <ChecklistSection
                title="File Structure"
                stage="mvp"
                items={[
                  "Files organized by feature or route",
                  "Components in appropriate folders (core, ui, shared)",
                  "Imports organized (external, internal, relative)",
                  "Barrel exports where appropriate",
                  "No circular dependencies",
                  "Related files colocated together",
                ]}
              />

              <ChecklistSection
                title="Code Organization"
                stage="mmp"
                items={[
                  "Functions small and focused (single responsibility)",
                  "No deeply nested conditionals",
                  "Complex logic extracted to utility functions",
                  "Comments explain WHY, not WHAT",
                  "No commented-out code left in codebase",
                  "Magic numbers replaced with named constants",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "ESLint errors ignored in CI", fix: "Make lint failure block PR merges" },
                  { issue: "TypeScript 'any' scattered throughout", fix: "Gradually type with unknown or proper types" },
                  { issue: "Inconsistent naming", fix: "Document conventions in CONTRIBUTING.md, enforce with lint rules" },
                  { issue: "Console.log statements in production", fix: "Add no-console lint rule, use proper logging" },
                  { issue: "Circular dependencies causing bugs", fix: "Use madge or circular-dependency-plugin to detect" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Test Coverage */}
          <TabsContent value="testing">
            <Stack gap="lg">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50/50 p-5 dark:border-blue-900/50 dark:from-blue-950/20 dark:to-sky-950/10">
                <h3 className="mb-3 font-semibold">Coverage Targets by Stage</h3>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Text size="sm" weight="medium">POC</Text>
                    <Text size="sm" variant="muted">0% — tests optional</Text>
                  </div>
                  <div>
                    <Text size="sm" weight="medium">MVP</Text>
                    <Text size="sm" variant="muted">~40% — happy paths</Text>
                  </div>
                  <div>
                    <Text size="sm" weight="medium">MMP</Text>
                    <Text size="sm" variant="muted">~70% — critical paths</Text>
                  </div>
                  <div>
                    <Text size="sm" weight="medium">PROD</Text>
                    <Text size="sm" variant="muted">~80% — comprehensive</Text>
                  </div>
                </div>
              </div>

              <ChecklistSection
                title="Unit Tests"
                stage="mvp"
                items={[
                  "Utility functions have unit tests",
                  "Pure functions tested with various inputs",
                  "Edge cases covered (null, empty, boundary values)",
                  "Tests are isolated (no external dependencies)",
                  "Tests run fast (under 5 seconds for unit suite)",
                  "Test names describe expected behavior",
                ]}
              />

              <ChecklistSection
                title="Integration Tests"
                stage="mvp"
                items={[
                  "API routes tested with mock data",
                  "Database operations tested (CRUD)",
                  "Authentication flows tested",
                  "Form submission and validation tested",
                  "Critical user journeys covered",
                  "Tests use realistic test data",
                ]}
              />

              <ChecklistSection
                title="Component Tests"
                stage="mmp"
                items={[
                  "Interactive components have render tests",
                  "User interactions tested (click, type, etc.)",
                  "Different states tested (loading, error, empty)",
                  "Accessibility tested in components",
                  "Responsive behavior tested where critical",
                  "Snapshot tests for complex UI (sparingly)",
                ]}
              />

              <ChecklistSection
                title="E2E Tests"
                stage="mmp"
                items={[
                  "Critical user journeys covered end-to-end",
                  "Login/authentication flow tested",
                  "Core business workflows tested",
                  "E2E tests run in CI on PR",
                  "Flaky tests identified and fixed",
                  "Test data reset between runs",
                ]}
              />

              <ChecklistSection
                title="Test Infrastructure"
                stage="mvp"
                items={[
                  "Tests run in CI on every PR",
                  "Coverage reports generated",
                  "Tests block merge if failing",
                  "Test environment isolated from production",
                  "Mock data fixtures maintained",
                  "Test utilities shared across tests",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Tests not run in CI", fix: "Add test step to GitHub Actions workflow" },
                  { issue: "Flaky tests causing CI failures", fix: "Identify and fix race conditions, add retries sparingly" },
                  { issue: "Tests coupled to implementation", fix: "Test behavior not implementation, use testing-library queries" },
                  { issue: "Slow test suite", fix: "Run unit tests first, parallelize, use mocks appropriately" },
                  { issue: "No tests for auth flows", fix: "Add integration tests for login, logout, session handling" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 3: Dependencies & Debt */}
          <TabsContent value="dependencies">
            <Stack gap="lg">
              <ChecklistSection
                title="Dependency Security"
                stage="mvp"
                items={[
                  "npm audit shows no critical vulnerabilities",
                  "Dependabot or similar enabled for updates",
                  "Security advisories monitored",
                  "Dependencies from trusted sources only",
                  "No dependencies with known exploits",
                  "Lock file committed and up to date",
                ]}
              />

              <ChecklistSection
                title="Dependency Currency"
                stage="mmp"
                items={[
                  "Major dependencies less than 6 months behind",
                  "Framework version supported (not EOL)",
                  "Security patches applied promptly",
                  "Update schedule documented",
                  "Breaking changes tracked in upgrade notes",
                  "Automated update PRs reviewed regularly",
                ]}
              />

              <ChecklistSection
                title="Bundle Health"
                stage="mmp"
                items={[
                  "No duplicate packages in bundle",
                  "Unused dependencies removed",
                  "Heavy dependencies justified",
                  "Tree-shakeable packages preferred",
                  "Bundle size monitored for regressions",
                  "Alternative lighter packages evaluated",
                ]}
              />

              <ChecklistSection
                title="Technical Debt"
                stage="mmp"
                items={[
                  "Tech debt documented in issues or tracking system",
                  "TODO comments have linked issues",
                  "Debt has effort estimates",
                  "Debt prioritized by impact",
                  "Time allocated for debt reduction",
                  "Dead code identified and removed",
                ]}
              />

              <ChecklistSection
                title="Code Cleanup"
                stage="mmp"
                items={[
                  "No unused imports",
                  "No unused variables",
                  "No unreachable code",
                  "No deprecated API usage",
                  "Console statements removed",
                  "Debug code removed",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Critical npm vulnerabilities", fix: "Run npm audit fix, update or replace vulnerable packages" },
                  { issue: "Outdated major versions", fix: "Schedule upgrade sprint, follow migration guides" },
                  { issue: "Huge bundle from one library", fix: "Use tree-shaking imports or find lighter alternative" },
                  { issue: "TODO comments never addressed", fix: "Create issues for TODOs, add to backlog with priority" },
                  { issue: "Dead code accumulating", fix: "Use ts-prune or knip to find unused exports" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 font-semibold">Quick Commands</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Text size="sm" weight="medium" className="mb-2">Linting &amp; Formatting</Text>
              <ul className="space-y-1 text-sm font-mono text-muted-foreground">
                <li>pnpm lint</li>
                <li>pnpm format --check</li>
                <li>npx tsc --noEmit</li>
              </ul>
            </div>
            <div>
              <Text size="sm" weight="medium" className="mb-2">Dependencies</Text>
              <ul className="space-y-1 text-sm font-mono text-muted-foreground">
                <li>npm audit</li>
                <li>npx depcheck</li>
                <li>npx npm-check-updates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="Testing Frameworks"
              items={[
                { name: "Vitest", url: "https://vitest.dev/", desc: "Fast unit testing for Vite/Next.js" },
                { name: "Playwright", url: "https://playwright.dev/", desc: "Cross-browser E2E testing" },
                { name: "Testing Library", url: "https://testing-library.com/", desc: "User-centric component testing" },
                { name: "MSW", url: "https://mswjs.io/", desc: "API mocking for tests" },
              ]}
            />
            <ResourceCard
              title="Code Quality"
              items={[
                { name: "ESLint", url: "https://eslint.org/", desc: "Pluggable JavaScript linter" },
                { name: "Prettier", url: "https://prettier.io/", desc: "Code formatter" },
                { name: "TypeScript ESLint", url: "https://typescript-eslint.io/", desc: "TypeScript linting rules" },
                { name: "Husky", url: "https://typicode.github.io/husky/", desc: "Git hooks for linting" },
              ]}
            />
            <ResourceCard
              title="Dependency Management"
              items={[
                { name: "Dependabot", url: "https://github.com/dependabot", desc: "Automated dependency updates" },
                { name: "Socket", url: "https://socket.dev/", desc: "Supply chain security" },
                { name: "depcheck", url: "https://www.npmjs.com/package/depcheck", desc: "Find unused dependencies" },
                { name: "knip", url: "https://knip.dev/", desc: "Find unused files and dependencies" },
              ]}
            />
            <ResourceCard
              title="Code Analysis"
              items={[
                { name: "SonarCloud", url: "https://sonarcloud.io/", desc: "Code quality and security" },
                { name: "CodeClimate", url: "https://codeclimate.com/", desc: "Maintainability analysis" },
                { name: "ts-prune", url: "https://www.npmjs.com/package/ts-prune", desc: "Find unused TypeScript exports" },
                { name: "madge", url: "https://www.npmjs.com/package/madge", desc: "Circular dependency detection" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
          <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-blue-800 dark:text-blue-300">
            Use these prompts with your AI coding agent to check code quality:
          </Text>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Run the Code &amp; Testing audit at MVP level</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Find files missing test coverage</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Check for TypeScript any usage</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Find TODO comments without linked issues</code></li>
            <li><code className="rounded bg-blue-100 px-1.5 py-0.5 dark:bg-blue-900/50">Audit dependencies for security vulnerabilities</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/data"
              title="Data & Security"
              description="Code quality impacts security"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="Code efficiency affects performance"
            />
            <RelatedAuditCard
              href="/docs/audits/deploy"
              title="Deploy & Observe"
              description="CI/CD and deployment pipelines"
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
          {level}
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
