/**
 * CATALYST - Layout Components
 *
 * Layout components for page structure.
 * Shell, Sidebar, Header, and page-level patterns.
 */

"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function LayoutComponentsPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Layout Components
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Primitives for page structure and navigation.
          </p>
        </div>
      </header>

      {/* Info box */}
      <section className="bg-muted space-y-3 rounded-lg p-4">
        <h2 className="font-medium">Architecture</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Layout components follow a <strong>compound component</strong> pattern.
          The <code>Shell</code> provides slots for Sidebar and Content. Layouts
          compose these primitives for different contexts (Guest, App, Docs).
        </p>
      </section>

      {/* Component list */}
      <Accordion
        className="space-y-4"
      >
        {/* Shell */}
        <AccordionItem
          value="shell"
          className="border-border rounded-lg border px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <span>Shell</span>
              <Badge variant="secondary">core</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Base layout container with slots for Sidebar and Content.
                Handles responsive behaviour and sidebar positioning.
              </p>

              <div className="bg-muted rounded-lg p-4">
                <div className="border-border flex h-32 overflow-hidden rounded border">
                  <div className="bg-primary/10 border-border flex w-16 shrink-0 items-center justify-center border-r text-xs">
                    Sidebar
                  </div>
                  <div className="flex flex-1 items-center justify-center text-xs">
                    Content
                  </div>
                </div>
              </div>

              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`import { Shell } from "@/components/layout/shell"

<Shell>
  <Shell.Sidebar position="left">
    <Sidebar />
  </Shell.Sidebar>
  <Shell.Content>
    {children}
  </Shell.Content>
</Shell>`}
              </pre>

              <code className="text-muted-foreground block text-xs">
                components/layout/shell.tsx
              </code>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sidebar */}
        <AccordionItem
          value="sidebar"
          className="border-border rounded-lg border px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <span>Sidebar</span>
              <Badge variant="secondary">core</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Sidebar component with Header, Body, and Footer slots.
                Supports collapsible state and responsive behaviour.
              </p>

              <div className="bg-muted rounded-lg p-4">
                <div className="border-border flex h-40 w-48 flex-col overflow-hidden rounded border">
                  <div className="bg-primary/10 border-border flex h-12 items-center justify-center border-b text-xs">
                    Header
                  </div>
                  <div className="flex flex-1 items-center justify-center text-xs">
                    Body (nav)
                  </div>
                  <div className="bg-primary/10 border-border flex h-10 items-center justify-center border-t text-xs">
                    Footer
                  </div>
                </div>
              </div>

              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`import { Sidebar } from "@/components/layout/sidebar"

<Sidebar>
  <Sidebar.Header>
    <Logo />
  </Sidebar.Header>
  <Sidebar.Body>
    <CollapsibleSidebarNav items={navItems} />
  </Sidebar.Body>
  <Sidebar.Footer>
    <UserMenu />
  </Sidebar.Footer>
</Sidebar>`}
              </pre>

              <code className="text-muted-foreground block text-xs">
                components/layout/sidebar.tsx
              </code>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Header */}
        <AccordionItem
          value="header"
          className="border-border rounded-lg border px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <span>Header</span>
              <Badge variant="secondary">core</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Top navigation bar with Logo, navigation items, and actions.
                Supports guest and app variants.
              </p>

              <div className="bg-muted rounded-lg p-4">
                <div className="border-border flex h-12 items-center justify-between overflow-hidden rounded border px-4">
                  <div className="text-xs font-medium">Logo</div>
                  <div className="flex gap-4 text-xs">
                    <span>Nav</span>
                    <span>Nav</span>
                    <span>Nav</span>
                  </div>
                  <div className="text-xs">Actions</div>
                </div>
              </div>

              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`import { Header } from "@/components/layout/header"

<Header>
  <Header.Logo />
  <Header.Nav items={navItems} />
  <Header.Actions>
    <Button>Sign In</Button>
  </Header.Actions>
</Header>`}
              </pre>

              <code className="text-muted-foreground block text-xs">
                components/layout/header.tsx
              </code>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Logo */}
        <AccordionItem
          value="logo"
          className="border-border rounded-lg border px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <span>Logo</span>
              <Badge variant="outline">utility</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Brand logo component with icon and text variants.
                Links to homepage.
              </p>

              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`import { Logo } from "@/components/layout/logo"

<Logo />
<Logo showText={false} />  // Icon only`}
              </pre>

              <code className="text-muted-foreground block text-xs">
                components/layout/logo.tsx
              </code>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CollapsibleSidebarNav */}
        <AccordionItem
          value="sidebar-nav"
          className="border-border rounded-lg border px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <span>CollapsibleSidebarNav</span>
              <Badge variant="outline">utility</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Navigation component for sidebar with optional search and 
                collapsible accordion sections.
              </p>

              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`import { CollapsibleSidebarNav } from "@/components/layout/collapsible-sidebar-nav"

const items = [
  { title: "Dashboard", href: "/app" },
  { title: "Settings", href: "/app/settings" },
]

// Basic
<CollapsibleSidebarNav items={items} />

// With search and accordion
<CollapsibleSidebarNav items={items} showSearch accordion />`}
              </pre>

              <code className="text-muted-foreground block text-xs">
                components/layout/collapsible-sidebar-nav.tsx
              </code>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Surface Shells */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Surface Shells</h2>
        <p className="text-muted-foreground text-sm">
          These primitives are composed into shells colocated with each surface
          in{" "}
          <code className="bg-muted rounded px-1">
            app/(surface)/_surface/
          </code>
          :
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ShellCard
            name="WebShell"
            path="app/(web)/_surface/"
            description="Header + content. For public pages."
          />
          <ShellCard
            name="AppShell"
            path="app/(app)/_surface/"
            description="Sidebar + content. For app pages."
          />
          <ShellCard
            name="DocsShell"
            path="app/(docs)/_surface/"
            description="Sidebar + content. For documentation."
          />
          <ShellCard
            name="SlidesShell"
            path="app/(present)/_surface/"
            description="Full-screen slides. For presentations."
          />
        </div>
      </section>
    </article>
  )
}

/**
 * Shell card for composed shells section.
 */
function ShellCard({
  name,
  path,
  description,
}: {
  name: string
  path: string
  description: string
}) {
  return (
    <div className="border-border rounded-lg border p-4">
      <h3 className="font-medium">{name}</h3>
      <code className="text-muted-foreground mt-1 block text-xs">{path}</code>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  )
}
