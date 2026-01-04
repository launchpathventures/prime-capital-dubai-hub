/**
 * CATALYST - Content & SEO Audit
 *
 * Structured content review covering copy quality, legal requirements,
 * and search optimization. Web surfaces only.
 */

import Link from "next/link"
import { Stack, Text, Row } from "@/components/core"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FileTextIcon,
  SearchIcon,
  ScaleIcon,
  ArrowLeftIcon,
  CircleIcon,
  ExternalLinkIcon,
  WrenchIcon,
  AlertCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ContentAuditPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <FileTextIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <Row gap="sm" className="items-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Content &amp; SEO
                </h1>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Web
                </span>
              </Row>
              <Text variant="muted" className="italic">
                Is content ready for users?
              </Text>
            </div>
          </Row>
          <Text size="lg" variant="muted" className="leading-relaxed">
            Review copy quality, legal requirements, and search optimization.
            Applies to public-facing web surfaces only.
          </Text>
        </header>

        {/* ================================================================ */}
        {/* Scope Note */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-5 dark:border-orange-900/50 dark:from-orange-950/20 dark:to-amber-950/10">
          <h3 className="mb-2 font-semibold">Applies to: Web Surfaces Only</h3>
          <Text size="sm" variant="muted">
            This audit covers public-facing marketing pages, landing pages, and documentation. 
            App surfaces (dashboards, admin panels) typically do not need SEO optimization.
          </Text>
        </section>

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
                "Content is placeholder",
                "SEO doesn't matter",
                "Not public-facing",
              ]}
            />
            <StageCard
              stage="MVP"
              level="Skip"
              expectations={[
                "Draft copy acceptable",
                "No legal text needed",
                "May still be private",
              ]}
            />
            <StageCard
              stage="MMP"
              level="Full"
              expectations={[
                "Final copy approved",
                "Legal pages reviewed",
                "SEO implemented",
              ]}
            />
            <StageCard
              stage="PROD"
              level="Complete"
              expectations={[
                "Search console connected",
                "Indexed and monitored",
                "Content strategy active",
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Tabbed Checklists */}
        {/* ================================================================ */}
        <Tabs defaultValue="copy">
          <TabsList className="mb-4">
            <TabsTrigger value="copy">
              <ScaleIcon className="h-4 w-4" />
              Copy & Legal
            </TabsTrigger>
            <TabsTrigger value="seo">
              <SearchIcon className="h-4 w-4" />
              Search & Discovery
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Copy & Legal */}
          <TabsContent value="copy">
            <Stack gap="lg">
              <ChecklistSection
                title="Content Quality"
                stage="mmp"
                items={[
                  "All placeholder text (Lorem ipsum) removed",
                  "Headlines are clear and compelling",
                  "Body copy is scannable (short paragraphs, bullets)",
                  "Call-to-action buttons have clear labels",
                  "Tone of voice consistent across pages",
                  "Grammar and spelling checked",
                  "Technical jargon explained or avoided",
                ]}
              />

              <ChecklistSection
                title="Brand Consistency"
                stage="mmp"
                items={[
                  "Company name spelled consistently",
                  "Product names consistent throughout",
                  "Brand voice guidelines followed",
                  "Taglines match marketing materials",
                  "Contact information accurate and current",
                  "Copyright year current",
                ]}
              />

              <ChecklistSection
                title="Required Legal Pages"
                stage="mmp"
                items={[
                  "Privacy Policy page exists and is accessible",
                  "Terms of Service/Terms of Use page exists",
                  "Cookie Policy (if using cookies)",
                  "Legal pages reviewed by legal counsel",
                  "Legal pages linked from footer",
                  "Last updated date shown on legal pages",
                ]}
              />

              <ChecklistSection
                title="Cookie Consent"
                stage="mmp"
                items={[
                  "Cookie consent banner shown for EU visitors",
                  "Non-essential cookies blocked until consent",
                  "Consent preferences saveable",
                  "Easy way to withdraw consent",
                  "Cookie categories explained",
                  "Analytics comply with consent choice",
                ]}
              />

              <ChecklistSection
                title="Compliance Basics"
                stage="mmp"
                items={[
                  "GDPR requirements addressed (if EU users)",
                  "CCPA requirements addressed (if CA users)",
                  "Data collection purposes disclosed",
                  "Third-party data sharing disclosed",
                  "Contact method for privacy requests",
                  "Account deletion process documented",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Lorem ipsum still visible", fix: "Search codebase for 'lorem', replace all instances" },
                  { issue: "Missing privacy policy", fix: "Use generator (Termly, Iubenda) or have lawyer draft" },
                  { issue: "Copyright year outdated", fix: "Use dynamic year: new Date().getFullYear()" },
                  { issue: "Cookie banner not blocking cookies", fix: "Implement proper consent management platform" },
                  { issue: "Inconsistent product name", fix: "Create content style guide with approved terminology" },
                ]}
              />
            </Stack>
          </TabsContent>

          {/* Tab 2: Search & Discovery */}
          <TabsContent value="seo">
            <Stack gap="lg">
              <ChecklistSection
                title="Meta Tags"
                stage="mmp"
                items={[
                  "Unique title tag per page (under 60 characters)",
                  "Meta description per page (under 160 characters)",
                  "Title tag includes primary keyword",
                  "Meta description is compelling (drives clicks)",
                  "No duplicate titles across pages",
                  "Next.js Metadata API used consistently",
                ]}
              />

              <ChecklistSection
                title="Open Graph & Social"
                stage="mmp"
                items={[
                  "og:title set for each page",
                  "og:description set for each page",
                  "og:image set (1200x630px recommended)",
                  "og:url set to canonical URL",
                  "og:type set appropriately (website, article)",
                  "Twitter Card tags configured",
                  "Social share preview tested",
                ]}
              />

              <ChecklistSection
                title="Technical SEO"
                stage="mmp"
                items={[
                  "sitemap.xml generated and accessible",
                  "sitemap.xml submitted to Google Search Console",
                  "robots.txt exists and configured correctly",
                  "robots.txt not blocking important pages",
                  "Canonical URLs set on all pages",
                  "Trailing slashes handled consistently",
                  "HTTPS used on all pages",
                ]}
              />

              <ChecklistSection
                title="Structured Data"
                stage="mmp"
                items={[
                  "Organization schema on homepage",
                  "Article schema on blog posts",
                  "FAQ schema where applicable",
                  "Breadcrumb schema on nested pages",
                  "Structured data validated (no errors)",
                  "JSON-LD format used (not microdata)",
                ]}
              />

              <ChecklistSection
                title="URL Structure"
                stage="mmp"
                items={[
                  "URLs are human-readable",
                  "URLs use hyphens (not underscores)",
                  "URLs are lowercase",
                  "URLs are descriptive (not IDs)",
                  "URL structure is logical and hierarchical",
                  "Redirects in place for changed URLs",
                ]}
              />

              <ChecklistSection
                title="Error Pages & Redirects"
                stage="mmp"
                items={[
                  "Custom 404 page with helpful content",
                  "404 page links to homepage and key pages",
                  "Old URLs redirect to new URLs (301)",
                  "No redirect chains (A→B→C)",
                  "Broken links fixed or redirected",
                  "404 errors monitored in Search Console",
                ]}
              />

              <ChecklistSection
                title="Core Web Vitals & SEO"
                stage="prod"
                items={[
                  "Core Web Vitals passing (LCP, CLS, INP)",
                  "Mobile-friendly test passing",
                  "Page speed acceptable for SEO",
                  "No mixed content warnings",
                  "Images have descriptive alt text",
                  "Heading hierarchy correct (h1 → h2 → h3)",
                ]}
              />

              <CommonIssues
                items={[
                  { issue: "Missing meta descriptions", fix: "Add generateMetadata() to all page.tsx files" },
                  { issue: "Social share looks broken", fix: "Add og:image, test with Facebook sharing debugger" },
                  { issue: "Pages not indexed", fix: "Check robots.txt, submit sitemap to Search Console" },
                  { issue: "Duplicate title tags", fix: "Make titles unique, include page-specific keywords" },
                  { issue: "Broken links causing 404s", fix: "Use broken link checker, add redirects" },
                ]}
              />
            </Stack>
          </TabsContent>
        </Tabs>

        {/* ================================================================ */}
        {/* Meta Tag Templates */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="mb-3 font-semibold">Next.js Metadata Template</h3>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
{`export const metadata: Metadata = {
  title: "Page Title | Brand Name",
  description: "Compelling description under 160 chars",
  openGraph: {
    title: "Page Title | Brand Name",
    description: "Compelling description",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title | Brand Name",
    description: "Compelling description",
    images: ["/og-image.png"],
  },
}`}
          </pre>
        </section>

        {/* ================================================================ */}
        {/* Tools & Resources */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tools &amp; Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ResourceCard
              title="SEO Testing"
              items={[
                { name: "Google Search Console", url: "https://search.google.com/search-console", desc: "Monitor search performance" },
                { name: "Google Rich Results Test", url: "https://search.google.com/test/rich-results", desc: "Test structured data" },
                { name: "Schema.org Validator", url: "https://validator.schema.org/", desc: "Validate JSON-LD" },
                { name: "Ahrefs Webmaster Tools", url: "https://ahrefs.com/webmaster-tools", desc: "Free SEO audit" },
              ]}
            />
            <ResourceCard
              title="Social Preview"
              items={[
                { name: "Facebook Sharing Debugger", url: "https://developers.facebook.com/tools/debug/", desc: "Test OG tags" },
                { name: "Twitter Card Validator", url: "https://cards-dev.twitter.com/validator", desc: "Test Twitter cards" },
                { name: "LinkedIn Post Inspector", url: "https://www.linkedin.com/post-inspector/", desc: "Test LinkedIn previews" },
                { name: "opengraph.xyz", url: "https://www.opengraph.xyz/", desc: "Preview social cards" },
              ]}
            />
            <ResourceCard
              title="Content & Legal"
              items={[
                { name: "Termly", url: "https://termly.io/", desc: "Privacy policy generator" },
                { name: "Iubenda", url: "https://www.iubenda.com/", desc: "Cookie consent & policies" },
                { name: "Hemingway Editor", url: "https://hemingwayapp.com/", desc: "Readability checker" },
                { name: "Grammarly", url: "https://www.grammarly.com/", desc: "Grammar and spelling" },
              ]}
            />
            <ResourceCard
              title="Technical SEO"
              items={[
                { name: "Screaming Frog", url: "https://www.screamingfrog.co.uk/seo-spider/", desc: "Site crawler" },
                { name: "Sitemap Generator", url: "https://www.xml-sitemaps.com/", desc: "Generate sitemaps" },
                { name: "Redirect Checker", url: "https://httpstatus.io/", desc: "Check redirect chains" },
                { name: "Broken Link Checker", url: "https://www.deadlinkchecker.com/", desc: "Find broken links" },
              ]}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* AI Agent Quick Commands */}
        {/* ================================================================ */}
        <section className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/50 dark:bg-orange-950/20">
          <h3 className="mb-3 font-semibold text-orange-900 dark:text-orange-200">AI Agent Commands</h3>
          <Text size="sm" className="mb-3 text-orange-800 dark:text-orange-300">
            Use these prompts with your AI coding agent to check content and SEO:
          </Text>
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
            <li><code className="rounded bg-orange-100 px-1.5 py-0.5 dark:bg-orange-900/50">Run the Content &amp; SEO audit at MMP level</code></li>
            <li><code className="rounded bg-orange-100 px-1.5 py-0.5 dark:bg-orange-900/50">Find pages missing meta descriptions</code></li>
            <li><code className="rounded bg-orange-100 px-1.5 py-0.5 dark:bg-orange-900/50">Check for placeholder text (Lorem ipsum)</code></li>
            <li><code className="rounded bg-orange-100 px-1.5 py-0.5 dark:bg-orange-900/50">Audit Open Graph tags across pages</code></li>
            <li><code className="rounded bg-orange-100 px-1.5 py-0.5 dark:bg-orange-900/50">Check sitemap.xml and robots.txt configuration</code></li>
          </ul>
        </section>

        {/* ================================================================ */}
        {/* Related Audits */}
        {/* ================================================================ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Related audits</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <RelatedAuditCard
              href="/docs/audits/accessibility"
              title="Accessibility & Inclusion"
              description="Accessible content for all users"
            />
            <RelatedAuditCard
              href="/docs/audits/performance"
              title="Speed & Performance"
              description="Core Web Vitals affect SEO"
            />
            <RelatedAuditCard
              href="/docs/audits/experience"
              title="Design & Experience"
              description="UX impacts engagement metrics"
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
