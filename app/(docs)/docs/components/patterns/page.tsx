/**
 * CATALYST - Component Patterns Documentation
 *
 * Preferred patterns for common UI scenarios:
 * forms, tables, empty states, loading, dialogs, and page structure.
 */

export default function PatternsPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Component Patterns
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Preferred approaches for common UI scenarios.
        </p>
      </header>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          These patterns represent the preferred way to build common UI in
          Catalyst. Following them ensures consistency and makes it easier for
          AI agents to understand and modify the codebase.
        </p>
      </section>

      {/* Forms */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Forms</h2>

        <PatternCard
          title="Simple Forms"
          when="POC stage, 1-5 fields, no complex validation"
          approach={[
            "Use native form with onSubmit handler",
            "Use Field, FieldLabel, Input components",
            "Basic client-side validation with required",
            "Show errors inline below fields",
          ]}
          code={`<form onSubmit={handleSubmit}>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" required />
    </Field>
    <Button type="submit">Save</Button>
  </FieldGroup>
</form>`}
        />

        <PatternCard
          title="Complex Forms"
          when="MVP+ stage, 5+ fields, validation rules, multi-step"
          approach={[
            "Use react-hook-form for state management",
            "Add zod for schema validation",
            "Handle errors via form.formState.errors",
            "Consider multi-step pattern for long forms",
          ]}
          code={`// Install: pnpm add react-hook-form zod @hookform/resolvers
const form = useForm<FormData>({
  resolver: zodResolver(schema),
})
// Then use form.register, form.handleSubmit, etc.`}
        />
      </section>

      {/* Tables */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Tables</h2>

        <PatternCard
          title="Basic Table"
          when="Static data, < 50 rows, no sorting/filtering"
          approach={[
            "Use Table, TableHeader, TableBody, TableRow, TableCell",
            "Map data directly in JSX",
            "No external library needed",
          ]}
          code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
        />

        <PatternCard
          title="Advanced Table"
          when="Sorting, filtering, pagination, large datasets"
          approach={[
            "Use @tanstack/react-table for state",
            "Wrap in components/vendor/data-table.tsx",
            "Support column visibility, sorting, filtering",
          ]}
          code={`// Install: pnpm add @tanstack/react-table
// Create columns definition and use useReactTable hook
// See components/vendor for wrapper pattern`}
        />
      </section>

      {/* Empty States */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Empty States</h2>

        <PatternCard
          title="Empty State Pattern"
          when="No data to display, first-time user, search with no results"
          approach={[
            "Centered layout with icon",
            "Clear message explaining the state",
            "Action button to resolve (add item, clear filters)",
            "Keep it simple — don't over-illustrate",
          ]}
          code={`<div className="flex flex-col items-center py-12 text-center">
  <FileIcon className="h-12 w-12 text-muted-foreground" />
  <h3 className="mt-4 font-medium">No items yet</h3>
  <p className="text-muted-foreground mt-1 text-sm">
    Create your first item to get started.
  </p>
  <Button className="mt-4">Create Item</Button>
</div>`}
        />
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Loading States</h2>

        <PatternCard
          title="Skeleton Loading"
          when="Content shape is known, perceived performance matters"
          approach={[
            "Use Skeleton component matching content layout",
            "Show skeleton immediately while data loads",
            "Don't over-skeleton — focus on primary content",
          ]}
          code={`// Loading state
<div className="space-y-4">
  <Skeleton className="h-8 w-1/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>

// Loaded state
<div className="space-y-4">
  <h1>{data.title}</h1>
  <p>{data.description}</p>
</div>`}
        />

        <PatternCard
          title="Spinner Loading"
          when="Quick operations, buttons, unknown content shape"
          approach={[
            "Use spinner icon in buttons during submit",
            "Disable button while loading",
            "Show brief loading state, not skeletons",
          ]}
          code={`<Button disabled={isLoading}>
  {isLoading && <Spinner className="mr-2 h-4 w-4" />}
  {isLoading ? "Saving..." : "Save"}
</Button>`}
        />
      </section>

      {/* Dialogs */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Dialogs</h2>

        <PatternCard
          title="Confirmation Dialog"
          when="Destructive actions, irreversible operations"
          approach={[
            "Use AlertDialog for confirmations",
            "Clear title stating the action",
            "Explain consequences in description",
            "Destructive action button styled appropriately",
          ]}
          code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete item?</AlertDialogTitle>
      <AlertDialogDescription>
        This cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
        />

        <PatternCard
          title="Form Dialog"
          when="Quick create/edit without leaving context"
          approach={[
            "Use Dialog for forms",
            "Keep form simple (< 5 fields)",
            "Close on successful submit",
            "Show loading state on submit button",
          ]}
          code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Add Item</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Item</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`}
        />
      </section>

      {/* Page Structure */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Page Structure</h2>

        <PatternCard
          title="App Page Pattern"
          when="Standard app page with header and content"
          approach={[
            "Page header with title and actions",
            "Content area with appropriate max-width",
            "Use consistent spacing (space-y-6 or space-y-8)",
          ]}
          code={`export default function Page() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Page Title</h1>
          <p className="text-muted-foreground">Description</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Content */}
      <div>{/* Main content here */}</div>
    </div>
  )
}`}
        />

        <PatternCard
          title="List/Detail Pattern"
          when="Master-detail views, item selection"
          approach={[
            "List view with selectable items",
            "Detail view in panel or separate route",
            "Maintain selection state",
            "Handle empty selection state",
          ]}
          code={`// Option 1: Side panel (Sheet)
// Option 2: Separate route (/items/[id])
// Option 3: Split view (flex, list on left, detail on right)`}
        />
      </section>

      {/* Key Principle */}
      <section className="border-primary bg-primary/5 space-y-2 border-l-4 p-4">
        <p className="font-medium">Pattern Principle</p>
        <p className="text-muted-foreground text-sm">
          Start simple. Use the basic pattern first. Only reach for the complex
          pattern when you have a clear need. Over-engineering in POC stage
          creates unnecessary work.
        </p>
      </section>

      {/* Reference */}
      <section className="border-border rounded-lg border border-dashed p-6">
        <h3 className="font-medium">Related</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          See{" "}
          <a
            href="/docs/components/examples"
            className="text-primary hover:underline"
          >
            Examples
          </a>{" "}
          for concrete implementations, and{" "}
          <a href="/docs/components/ui" className="text-primary hover:underline">
            UI Components
          </a>{" "}
          for the component library reference.
        </p>
      </section>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function PatternCard({
  title,
  when,
  approach,
  code,
}: {
  title: string
  when: string
  approach: string[]
  code: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-medium">{title}</h4>
      <p className="text-muted-foreground mt-1 text-sm">
        <strong>When:</strong> {when}
      </p>
      <div className="mt-3">
        <p className="text-sm font-medium">Approach:</p>
        <ul className="text-muted-foreground mt-1 space-y-1 text-sm">
          {approach.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
      <pre className="bg-muted mt-3 overflow-x-auto rounded p-3 text-xs">
        {code}
      </pre>
    </div>
  )
}
