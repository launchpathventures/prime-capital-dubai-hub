/**
 * CATALYST - Vendor Components
 *
 * External packages wrapped and styled to match the design system.
 * Currently empty — shows guidance for wrapping vendor packages.
 */

import { Badge } from "@/components/ui/badge"

export default function VendorComponentsPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Vendor Components
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          External packages wrapped and styled to match the design system.
        </p>
      </header>

      {/* Info box */}
      <section className="bg-muted space-y-3 rounded-lg p-4">
        <h2 className="font-medium">What Goes Here</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Vendor components wrap <strong>external npm packages</strong> that
          shadcn doesn&apos;t provide. The wrapper applies consistent styling
          and simplifies the API for your project.
        </p>
        <p className="text-muted-foreground text-sm">
          Examples: Calendar (react-day-picker), DataTable (TanStack Table),
          RichTextEditor (Tiptap)
        </p>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Components</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/docs/components/vendor/dnd-kit"
            className="border-border hover:border-primary/50 hover:bg-muted block rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <code className="text-sm font-medium">dnd-kit</code>
              <Badge variant="secondary" className="text-xs">New</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Drag-and-drop primitives for sortable lists and Kanban boards.
            </p>
          </a>
        </div>
      </section>

      {/* How to create */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Wrapping a Vendor Package</h2>

        <div className="border-border rounded-lg border p-6">
          <ol className="text-muted-foreground space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                1
              </span>
              <div>
                <strong className="text-foreground">Install the package</strong>
                <pre className="bg-muted mt-2 overflow-x-auto rounded-lg p-3 text-xs">
                  {`pnpm add react-day-picker`}
                </pre>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                2
              </span>
              <div>
                <strong className="text-foreground">Create the wrapper</strong>
                <p className="mt-1">
                  Add to{" "}
                  <code className="bg-muted rounded px-1">
                    components/vendor/calendar.tsx
                  </code>
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                3
              </span>
              <div>
                <strong className="text-foreground">Add the header</strong>
                <pre className="bg-muted mt-2 overflow-x-auto rounded-lg p-3 text-xs">
                  {`/**
 * CATALYST - Calendar Component
 *
 * @source react-day-picker v9.x
 * @customised Yes
 *   - Styled to match design system
 *   - Simplified props API
 */`}
                </pre>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                4
              </span>
              <div>
                <strong className="text-foreground">Apply design system styling</strong>
                <pre className="bg-muted mt-2 overflow-x-auto rounded-lg p-3 text-xs">
                  {`import { DayPicker } from "react-day-picker"

export function Calendar({ ...props }) {
  return (
    <DayPicker
      className="border-border rounded-lg border p-3"
      classNames={{
        day: "h-9 w-9 text-sm font-medium",
        selected: "bg-primary text-primary-foreground",
        // ... apply design tokens
      }}
      {...props}
    />
  )
}`}
                </pre>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Common packages */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Common Packages to Wrap</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <PackageSuggestion
            name="@dnd-kit/core"
            use="Drag and Drop"
            url="https://dndkit.com/"
            installed
          />
          <PackageSuggestion
            name="react-day-picker"
            use="Calendar / Date Picker"
            url="https://react-day-picker.js.org/"
          />
          <PackageSuggestion
            name="@tanstack/react-table"
            use="Advanced Data Tables"
            url="https://tanstack.com/table"
          />
          <PackageSuggestion
            name="@tiptap/react"
            use="Rich Text Editor"
            url="https://tiptap.dev/"
          />
          <PackageSuggestion
            name="recharts"
            use="Charts & Graphs"
            url="https://recharts.org/"
          />
          <PackageSuggestion
            name="react-dropzone"
            use="File Upload"
            url="https://react-dropzone.js.org/"
          />
        </div>
      </section>

      {/* Guidelines */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Guidelines</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-border rounded-lg border p-4">
            <h3 className="mb-2 font-medium text-success-700">Do</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Apply design system tokens</li>
              <li>• Simplify the API for your needs</li>
              <li>• Document the source package</li>
              <li>• Handle common config internally</li>
            </ul>
          </div>
          <div className="border-border rounded-lg border p-4">
            <h3 className="mb-2 font-medium text-destructive">Don&apos;t</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Use packages directly in pages</li>
              <li>• Copy-paste default styles</li>
              <li>• Over-abstract the API</li>
              <li>• Ignore package updates</li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  )
}

/**
 * Package suggestion card.
 */
function PackageSuggestion({
  name,
  use,
  url,
  installed = false,
}: {
  name: string
  use: string
  url: string
  installed?: boolean
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border hover:border-primary/50 hover:bg-muted block rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-center gap-2">
        <code className="text-sm">{name}</code>
        {installed && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            Installed
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mt-1 text-xs">{use}</p>
    </a>
  )
}
