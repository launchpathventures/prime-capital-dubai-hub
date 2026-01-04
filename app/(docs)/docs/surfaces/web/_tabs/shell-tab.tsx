/**
 * CATALYST - Web Surface Doc Tab: Layout
 *
 * How the web layout works — header, footer, content areas.
 * Written for catalyst devs (AI-first), technical details collapsible.
 */

import Link from "next/link"
import {
  CheckCircle2Icon,
  SparklesIcon,
  PanelTopIcon,
  LayoutIcon,
  PaletteIcon,
  FootprintsIcon,
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
            The Web surface uses a header + footer layout with full-width
            content. The header shows navigation, the footer shows links and
            branding, and your page content fills the space between.
          </p>
        </div>
      </section>

      {/* Visual Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Layout structure</h2>
        <p className="text-muted-foreground">
          Every page in the Web surface shares this layout:
        </p>

        <div className="bg-muted/30 overflow-hidden rounded-lg border">
          <div className="flex flex-col gap-px bg-border">
            <div className="bg-card flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="bg-muted h-6 w-20 rounded" />
                <div className="bg-muted h-4 w-16 rounded" />
                <div className="bg-muted h-4 w-16 rounded" />
              </div>
              <div className="text-muted-foreground text-xs font-medium uppercase">
                Header
              </div>
            </div>
            <div className="bg-card flex min-h-40 items-center justify-center p-4">
              <span className="text-muted-foreground text-sm">
                Your page content — full width available
              </span>
            </div>
            <div className="bg-card flex h-24 items-center justify-between px-4">
              <div className="flex gap-8">
                <div className="space-y-1">
                  <div className="bg-muted h-3 w-16 rounded" />
                  <div className="bg-muted h-3 w-12 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="bg-muted h-3 w-16 rounded" />
                  <div className="bg-muted h-3 w-12 rounded" />
                </div>
              </div>
              <div className="text-muted-foreground text-xs font-medium uppercase">
                Footer
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>No sidebar — maximum content width for marketing impact</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Header collapses to mobile menu on small screens</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Footer includes navigation, legal links, and branding</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Customize Header */}
      <section className="space-y-4">
        <TaskCard
          icon={PanelTopIcon}
          title="Customize the header"
          ask="Add a [Sign In] button to the right side of the header"
          description="The header is defined in the shell component. Add or remove elements to match your needs."
          details={[
            "Main nav links come from webNavItems",
            "CTA buttons are defined directly in the shell",
            "Mobile menu is handled automatically",
          ]}
          files={[
            { path: "app/(web)/_surface/web-shell.tsx", note: "Shell component" },
            { path: "lib/navigation.ts", note: "Navigation links" },
          ]}
          example={`// app/(web)/_surface/web-shell.tsx

<Header>
  <Header.Logo>
    <Link href="/">Logo</Link>
  </Header.Logo>
  
  <Header.Nav>
    {webNavItems.map(item => (
      <Link key={item.href} href={item.href}>{item.label}</Link>
    ))}
  </Header.Nav>
  
  <Header.Actions>
    <Button variant="ghost" asChild>
      <Link href="/auth/login">Sign In</Link>
    </Button>
    <Button asChild>
      <Link href="/auth/register">Get Started</Link>
    </Button>
  </Header.Actions>
</Header>`}
        />
      </section>

      {/* Customize Footer */}
      <section className="space-y-4">
        <TaskCard
          icon={FootprintsIcon}
          title="Customize the footer"
          ask="Add social media links to the footer"
          description="The footer includes navigation groups, legal links, and branding. Modify directly in the shell."
          details={[
            "Footer columns are defined as arrays of links",
            "Social icons can be added with lucide-react icons",
            "Copyright text updates automatically",
          ]}
          files={[
            { path: "app/(web)/_surface/web-shell.tsx", note: "Shell component" },
          ]}
          example={`// Footer link groups
const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
]

// Social links
<div className="flex gap-4">
  <a href="https://twitter.com/..."><TwitterIcon /></a>
  <a href="https://github.com/..."><GithubIcon /></a>
</div>`}
        />
      </section>

      {/* Full-Width Sections */}
      <section className="space-y-4">
        <TaskCard
          icon={LayoutIcon}
          title="Full-width sections"
          ask="Make the hero section extend to the full browser width"
          description="Pages have access to the full viewport width. Use edge-to-edge sections with inner containers for content."
          details={[
            "Use negative margins to break out of any parent padding",
            "Apply background colors to full-width wrapper",
            "Center content with max-width containers",
          ]}
          files={[]}
          example={`// Full-width section with centered content
<section className="w-screen relative left-1/2 -translate-x-1/2 bg-muted">
  <div className="max-w-6xl mx-auto px-4 py-16">
    {/* Your content */}
  </div>
</section>

// Or use the provided Section component
import { Section } from "@/components/core"

<Section variant="muted" fullWidth>
  <div className="max-w-6xl mx-auto px-4 py-16">
    {/* Your content */}
  </div>
</Section>`}
        />
      </section>

      {/* Custom Styles */}
      <section className="space-y-4">
        <TaskCard
          icon={PaletteIcon}
          title="Add custom styles"
          ask="Make the header sticky with a blur effect"
          description="Each surface has its own CSS file. Add styles there to customize the appearance."
          details={[
            "Surface CSS is imported by the layout automatically",
            "Use CSS variables for consistency",
            "Styles only apply to this surface",
          ]}
          files={[{ path: "app/(web)/web.css", note: "Web surface styles" }]}
          example={`/* app/(web)/web.css */

/* Sticky header with blur */
.web-shell [data-slot="header"] {
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  background: oklch(from var(--color-background) l c h / 0.8);
  z-index: 50;
}

/* Hero gradient */
.web-hero {
  background: linear-gradient(
    to bottom right,
    oklch(from var(--color-primary) l c h / 0.1),
    var(--color-background)
  );
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
                  app/(web)/_surface/web-shell.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(web)/layout.tsx
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  app/(web)/web.css
                </code>
              </li>
              <li>
                <code className="bg-muted rounded px-1 text-xs">
                  lib/navigation.ts
                </code>
              </li>
            </ul>
          </div>
          <div>
            <Text size="sm" weight="medium" className="mb-2">
              Common asks
            </Text>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>&ldquo;Add a link to the header...&rdquo;</li>
              <li>&ldquo;Change the footer layout...&rdquo;</li>
              <li>&ldquo;Make the header transparent...&rdquo;</li>
              <li>&ldquo;Add announcement bar above header&rdquo;</li>
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
