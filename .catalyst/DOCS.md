# Catalyst Docs

Standards for writing and maintaining Catalyst method documentation.

---

## Purpose

Catalyst docs are an **operating system for delivery**, not a knowledge base.

They exist to:
- Reduce ambiguity
- Guide action
- Support repeated use
- Make the system easy to run without explanation

Every page should help a reader decide what to do next, or confirm they're in the right place.

---

## Audience

Write for **non-technical Catalyst users** — people who build with AI but may not be developers.

| Do | Don't |
|----|-------|
| Use simple, everyday language | Use jargon or technical terms |
| Explain concepts before using them | Assume prior knowledge |
| Write like you're helping a colleague | Write like a reference manual |
| Be warm but efficient | Be overly casual or corporate |

**Example:**
- ❌ "Execute the delivery loop to validate hypotheses"
- ✅ "Run the loop to check if you're building the right thing"

---

## Two Levels of Documentation

Documentation work happens at two levels:

| Level | What it is | Key question |
|-------|-----------|--------------|
| **Section** | A group of related pages (e.g., Workflow, Prompts) | "Does this section tell a complete, coherent story?" |
| **Page** | A single page within a section | "Does this page serve its purpose clearly?" |

Both levels need attention. A good page in a bad section is still confusing.

---

## Section Management

A **section** is a group of related pages in the sidebar (e.g., Workflow, Prompts, Audits).

### Section Review Checklist

When reviewing or refactoring a section:

1. **Map all pages** — List every page in the section
2. **Identify the entry point** — Usually an "Overview" page that orients readers
3. **Check for overlap** — Are two pages saying the same thing?
4. **Check for gaps** — Is something missing that readers would expect?
5. **Verify order** — Do pages flow logically? (Overview first, then concepts, then specifics)
6. **Check naming** — Are titles consistent and clear?
7. **Remove what doesn't belong** — Move pages to other sections if needed

### Section Narrative

Every section should tell a story:

| Position | Purpose | Example (Workflow) |
|----------|---------|-------------------|
| **Entry** | Orient the reader, explain what this section covers | Overview page |
| **Core concepts** | The main ideas they need to understand | Delivery Loop, Principles |
| **Specifics** | Detailed pages for each sub-topic | POC, MVP, MMP, PROD |

The Overview page is the **front door** — it should:
- Explain why this section matters
- Introduce key concepts at a high level
- Help readers find the right sub-page

### Common Section Problems

| Problem | Symptom | Fix |
|---------|---------|-----|
| **Overlap** | Two pages cover similar content | Merge or differentiate clearly |
| **Orphan page** | A page that doesn't fit the section's theme | Move to correct section |
| **Missing overview** | Readers jump into specifics without context | Add an Overview page |
| **Wrong order** | Concepts appear before they're explained | Reorder pages |
| **Inconsistent naming** | "Delivery Cycles" vs "Delivery Loop" | Pick one and use everywhere |

### Marking Pages for Review

If a page needs work but can't be fixed immediately:

```tsx
{/* Review Notice */}
<div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
  <Text size="sm" weight="medium" className="text-amber-800 dark:text-amber-200">
    🚧 This page is under review and will be updated soon.
  </Text>
</div>
```

Place this immediately after the opening `<Stack>` and before the header.

---

## Page Management

A **page** is a single documentation page. Every page must serve a clear purpose.

### Page Structure

Every page follows this structure:

```
1. DocHeader      — Title, context, orientation
2. Problem/Why    — Why does this page matter?
3. Concepts       — Key ideas (often as cards)
4. Details        — Deeper content if needed
5. Next Steps     — Where to go from here
```

Not every page needs all sections, but the order should be consistent.

### The "Why Before What" Rule

Every section on a page should explain **why it matters** before diving into **what it is**.

| Section | Why first | Then what |
|---------|-----------|-----------|
| Principles | "Three beliefs that keep projects aligned..." | The three principle cards |
| Delivery Loop | "A four-step rhythm that puts principles into action..." | The four step cards |
| Stages | "Projects grow through stages with different expectations..." | The stage cards |

This prevents the "so what?" feeling readers get from unexplained lists.

### Card Content Guidelines

When using cards (via `DocCard` or custom cards):

| Rule | Guidance |
|------|----------|
| **Bold lead** | Start each card with a short bold phrase (3-5 words) |
| **Consistent length** | Cards in the same section should be similar length (~20-30 words) |
| **One idea per card** | Don't pack multiple concepts into one card |
| **Action-oriented** | Use verbs and outcomes, not abstract nouns |

**Example (good):**
```tsx
<DocCard number={1} title="Brief" color="blue">
  <strong>Define what and why.</strong> Capture scope, goals, and
  constraints so everyone — including AI — knows the target.
</DocCard>
```

**Example (bad):**
```tsx
<DocCard number={1} title="Brief" color="blue">
  The briefing phase is an important step in the delivery process
  where stakeholders and team members collaborate to establish
  clarity around the scope, objectives, and constraints of the work.
</DocCard>
```

### Page Review Checklist

When reviewing or refactoring a page:

1. **Purpose** — Can you state what this page is for in one sentence?
2. **DocHeader** — Does it have a proper header with title, subtitle, context?
3. **Narrative flow** — Does each section lead naturally to the next?
4. **Why before what** — Does each section explain its purpose?
5. **Simple language** — Would a non-technical reader understand?
6. **Empowerment** — Does each section leave the reader more capable, not confused?
7. **Visual balance** — Are cards/sections visually consistent?
8. **Next steps** — Does the page tell readers what to do next?

### Critical Review Questions

Before finalising a page, ask:

> "Does this page meet its intended purpose?"
> "Does the page as a whole tell a clear narrative that flows?"
> "Is every section clear (the why, then the what)?"
> "Is language simple and non-technical?"
> "Does each section leave the user more empowered (and never confused)?"

If any answer is "no", revise that section.

---

## DocHeader Reference

Every documentation page must start with a **DocHeader** component. This section provides detailed guidance on using it effectively.

### Basic Usage

Use the `DocHeader` component from `app/(docs)/_surface/doc-header.tsx`.

```tsx
import { DocHeader } from "../../_surface/doc-header"
import { LayersIcon } from "lucide-react"

<DocHeader
  title="Workflow"
  icon={<LayersIcon />}
  badges={<>...</>}
  subtitle="An introduction to the Catalyst workflow..."
  context={<>Read this when starting a project...</>}
/>
```

### Props

| Prop | Purpose | Required |
|------|---------|----------|
| `title` | Page title — bold, large, left-aligned | Yes |
| `icon` | Section icon — use the same icon for all pages in a section | No |
| `badges` | Metadata pills (e.g., "Overview", "~10 min") | No |
| `subtitle` | One line summarising what to expect | No |
| `context` | Brief orientation (when to read, who it's for) | No |

### Icon Convention

The `icon` prop should use the **section icon**, not a page-specific icon. This reinforces which section the reader is in.

| Section | Icon |
|---------|------|
| Workflow | `LayersIcon` |
| Prompts | `TargetIcon` |
| Audits | `ClipboardCheckIcon` |
| Design | `PaletteIcon` |
| Develop | `CodeIcon` |

All pages within a section use the same icon. This creates visual consistency in the sidebar and headers.

### Content Guidelines

**Subtitle** answers: *What will I learn from this page?*
- One sentence summarising what the page covers
- Sets expectations, not hype

**Context card** answers: *Should I read this now?*
- When to read (situation/trigger)
- Who it's for (role/persona)
- Keep to 2 lines max — not a micro version of the page

### Design Principles

The header should feel like a **calm, authoritative anchor**.

| Do | Don't |
|----|-------|
| Keep title left-aligned with page content | Use a large leading icon that pushes title right |
| Use icon as subtle section marker | Make icon the hero element |
| Keep context card informational | Overload context with navigation/CTAs |
| Use 2 lines max for context | Repeat the whole page in miniature |
| Use neutral badge styling | Use primary-coloured badges |

### Common Mistakes

- **Too busy**: Adding navigation, next steps, and outcome lists to the header
- **Icon dominance**: Large icon containers that become the visual focus
- **Colour overload**: Primary-coloured badges and cards competing for attention
- **Redundancy**: Subtitle and context saying the same thing differently

### Example (Good)

```tsx
<DocHeader
  title="Workflow"
  icon={<LayersIcon />}
  badges={
    <>
      <Badge>Overview</Badge>
      <Badge>~10 min</Badge>
    </>
  }
  subtitle="An introduction to the Catalyst workflow — the delivery loop, stage progression, and how to build effectively with AI."
  context={
    <>
      Read this when starting a project, beginning a new cycle, or re-aligning after drift.
      <br />
      Helpful for developers, designers, product leads, and stakeholders.
    </>
  }
/>
```

This header:
- Title aligns with content below
- Icon is a subtle marker, not a hero
- Subtitle tells you what to expect
- Context tells you when/who — nothing more

---

## Visual Hierarchy Rules

### Design Philosophy

- Calm, predictable, and intentional
- Optimised for scanning and revisiting
- Engagement comes from clarity, not decoration

### Colour Usage

Colour is secondary to layout and typography.

| Do | Don't |
|----|-------|
| Use icons for visual anchoring | Use full-colour card backgrounds as default |
| Use subtle borders for grouping | Use colour as primary structure signal |
| Use soft backgrounds sparingly | Apply different colours to every section |

Reserve colour for:
- Decision points
- Warnings or blockers
- Current stage indicators
- Primary CTAs

### Typography & Spacing

- **Slightly smaller body text** — density over sprawl
- **Strong section headers** — clear hierarchy
- **Generous vertical spacing** — breathing room between sections

---

## Canonical Doc UI Blocks

Docs use a **locked set** of visual patterns. This ensures consistency across all pages.

### Allowed Blocks

| Block | Purpose | When to Use |
|-------|---------|-------------|
| **Framing Header** | Page context and steering | Every page (required) |
| **Choice Cards** | Mutually exclusive paths | Decisions, entry points |
| **Step Lists** | Ordered actions | Workflows, setup guides |
| **Callouts** | High-value emphasis | Rare insights, warnings |
| **Next Step CTA** | Forward motion | End of every page |

### Adding New Patterns

If a page requires a visual pattern not in this list:
1. Design it intentionally
2. Document it in this file
3. Make it reusable across pages

Do not invent ad-hoc patterns.

---

## Doc Components

Doc pages use shared components from `app/(docs)/_surface/`. Import them as:

```tsx
import { DocHeader, DocSection, DocCard } from "../../_surface"
```

### DocHeader

Page header with title, subtitle, and context. Required on every page.

```tsx
<DocHeader
  title="Workflow"
  icon={<LayersIcon />}
  badges={<><Badge>Overview</Badge><Badge>~5 min</Badge></>}
  subtitle="How Catalyst keeps projects aligned."
  context={<>Read this when starting a project...</>}
/>
```

### DocSection

Section wrapper with title, optional description, and auto-generated anchor IDs.

```tsx
<DocSection
  title="The Principles"
  description="Three beliefs that keep projects aligned:"
>
  {/* Section content */}
</DocSection>
```

### DocCard

Content card with icon or number marker. Use for principles, steps, or choices.

```tsx
{/* With icon */}
<DocCard icon={<EyeIcon />} title="Show, don't tell" color="violet">
  <strong>Working software beats any description.</strong> A rough
  prototype makes ideas real and easy to react to.
</DocCard>

{/* With number */}
<DocCard number={1} title="Brief" color="blue">
  <strong>Define what and why.</strong> Capture scope, goals, and
  constraints so everyone knows the target.
</DocCard>
```

### Badge (page-specific helper)

For metadata pills in headers:

```tsx
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
      {children}
    </span>
  )
}
```

### Note (page-specific helper)

For callouts and asides — a simple gray card with no icon:

```tsx
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-lg border p-4">
      <Text size="sm" variant="muted">
        {children}
      </Text>
    </div>
  )
}
```

Usage:
```tsx
<Note>
  <strong>Solo builders:</strong> You wear all four modes. Making them
  explicit helps you give AI clearer instructions.
</Note>
```

Use for:
- Key insights or takeaways
- Warnings without heavy styling
- Contextual tips for specific audiences

Do not use coloured backgrounds or icons — keep it simple.

### LinkCard (page-specific helper)

For Next Steps navigation — consistent across all pages:

```tsx
function LinkCard({
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
      className="group flex flex-col gap-1 rounded-xl border p-4 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <Text weight="medium">{title}</Text>
        <ArrowRightIcon className="ml-auto h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <Text size="sm" variant="muted">
        {description}
      </Text>
    </Link>
  )
}
```

Usage:
```tsx
<DocSection
  title="Next Steps"
  description="Ready to dive deeper? Pick a path:"
>
  <Grid cols={2} gap="md">
    <LinkCard
      href="/docs/workflow/collaboration"
      title="Collaboration"
      description="How humans and AI work together."
    />
    <LinkCard
      href="/docs/workflow/poc"
      title="POC Stage"
      description="Delivery expectations for proof-of-concept."
    />
  </Grid>
</DocSection>
```

Key points:
- Always include `description` prop on DocSection
- No "primary" variant — all cards look the same
- Arrow animates on hover
- Usually 2 columns

---

## Cards: Strict Usage Rules

Cards are **semantic, not decorative**.

### Use Cards For

- Presenting choices (mutually exclusive options)
- Grouping actionable options
- Highlighting entry points or paths

### Do Not Use Cards For

- General explanation
- Long prose content
- Purely visual interest
- Lists that aren't decision-oriented

---

## Tables: Reference Information

Use tables for **structured reference information** that users scan rather than read.

### When to Use Tables

- Comparing options across consistent dimensions
- Stage/phase breakdowns with consistent columns
- Quick-reference lookups

### Table Pattern

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b text-left">
        <th className="pb-2 pr-4 font-medium">Column 1</th>
        <th className="pb-2 pr-4 font-medium">Column 2</th>
        <th className="pb-2 font-medium">Column 3</th>
      </tr>
    </thead>
    <tbody className="text-muted-foreground">
      <tr className="border-b">
        <td className="py-3 pr-4"><Badge /></td>
        <td className="py-3 pr-4">Value</td>
        <td className="py-3">Description</td>
      </tr>
      {/* More rows... */}
    </tbody>
  </table>
</div>
```

### Column Guidelines

| Use Case | Suggested Columns |
|----------|-------------------|
| Loop phases | Phase, Who Leads, What Happens |
| Stage comparison | Stage, Focus, Callouts |
| Feature matrix | Feature, POC, MVP, MMP, PROD |

### Styling Rules

- First column often uses a coloured badge for visual anchoring
- Body text uses `text-muted-foreground`
- Wrap in `overflow-x-auto` for mobile
- Use `py-3` for comfortable row height
- Last row has no `border-b`

### Card Styling

- Default: `border` only (no coloured backgrounds)
- Colour only on icons/badges, not card backgrounds
- Consistent padding and spacing across all cards

### Shared Content Principle

When the same content appears on multiple pages (e.g., the Delivery Loop phases), **use identical cards**.

| Rule | Why |
|------|-----|
| Same content | Readers recognise it instantly |
| Same colours | Visual consistency across pages |
| Same structure | No cognitive overhead |

Titles and descriptions can differ per page, but the card content should be copy-paste identical.

**Example:** The four-phase Delivery Loop cards appear on both:
- Overview page: "The Delivery Loop" section
- Delivery page: "The Four Phases" section

Both use the exact same cards (number, title, colour, content). Only the section title and description differ.

---

## Long Page Navigation

Any page with significant length must include an **in-page table of contents**.

### TOC Requirements

| Requirement | Implementation |
|-------------|----------------|
| Placement | Top-right or inline after framing header |
| Visual weight | Light — should not compete with content |
| Generation | Automatic from section headings |
| Purpose | Supports scanning, revisiting, partial reading |

### When to Add TOC

- Page has 4+ major sections
- Page is likely to be revisited
- Content serves multiple roles/situations

---

## Content Rules

### Every Page Must Answer

> "What should I do after this?"

If the answer isn't clear, add a **Next Step** section.

### Writing Style

- **Opinionated defaults** over neutral explanation
- **Assume intelligent readers** who value speed
- **Don't re-explain** core concepts once established
- **Link forward** — point to the next logical action

### Avoid

- Walls of text without structure
- Explaining the same concept on multiple pages
- Hedging language ("you might want to...", "consider...")
- Decorative content that doesn't guide action

---

## Success Criteria

A Catalyst doc is successful when:

| Criteria | Test |
|----------|------|
| **Relevance** | Reader can decide in 10 seconds if it applies |
| **Scannability** | Can be skimmed in under a minute |
| **Actionability** | Clear next step at the end |
| **Familiarity** | Structure feels consistent with other pages |

**Consistency builds trust. Trust enables speed.**

---

## File Locations

| Content | Location |
|---------|----------|
| Method docs (AGENTS, PLAYBOOK, etc.) | `/catalyst/*.md` |
| Rendered docs surface | `/app/(docs)/docs/` |
| Doc surface components | `/app/(docs)/_surface/` |
| Doc surface styles | `/app/(docs)/docs.css` |

---

## Updating Docs

When updating documentation:

1. **Read this file first** — ensure changes follow the standards
2. **Use existing patterns** — check canonical blocks before inventing
3. **Add framing headers** — every new page needs one
4. **Test scannability** — can you skim it in 60 seconds?
5. **Confirm next step** — every page should point forward

---

## AI Prompts for Documentation

Use these prompts to have AI review or refactor documentation.

### Review a Section

```
Read .catalyst/DOCS.md, then review the [SECTION NAME] section.

Check:
1. Does the section tell a complete, coherent story?
2. Is there an Overview page that orients readers?
3. Are there overlapping pages that should be merged?
4. Are there gaps — missing pages readers would expect?
5. Is the page order logical (overview → concepts → specifics)?
6. Are titles consistent across pages?
7. Do any pages belong in a different section?

Report findings and suggest improvements.
```

### Review a Page

```
Read .catalyst/DOCS.md, then critically review [PAGE PATH].

Check:
1. Does it have a proper DocHeader with title, subtitle, context?
2. Does each section explain why before what?
3. Is the language simple and non-technical?
4. Are card contents balanced (bold lead, similar length)?
5. Does the page flow as a clear narrative?
6. Does each section empower the reader?
7. Is there a clear next step at the end?

Report issues and suggest specific fixes.
```

### Refactor a Page

```
Read .catalyst/DOCS.md, then refactor [PAGE PATH] to meet the documentation standards.

Requirements:
1. Use DocHeader, DocSection, DocCard components from app/(docs)/_surface/
2. Structure: Problem/Why → Concepts → Details → Next Steps
3. Every section needs a "why" before the "what"
4. Cards should have bold leads and balanced length (~20-30 words)
5. Language should be simple, warm, and non-technical
6. Each section should leave readers more empowered

Make the changes, then explain what you updated and why.
```

### Quick Quality Check

```
Read .catalyst/DOCS.md, then answer these questions about [PAGE PATH]:

1. Does this page meet its intended purpose?
2. Does the page tell a clear narrative that flows?
3. Is every section clear (why, then what)?
4. Is language simple and non-technical?
5. Does each section empower the reader?

For any "no" answers, suggest specific improvements.
```

---

## Accordion Pages Pattern

Some documentation pages use a **searchable accordion pattern** for listing commands, components, or reference material. This pattern uses the `DocsAccordionPage` component.

### When to Use Accordion Pages

Use this pattern for:
- Command reference pages (slash commands, prompts)
- Component libraries (UI components, patterns)
- API reference documentation
- Any structured list where users need to search and deep-link

Do not use for:
- Narrative content (use standard page structure)
- Short lists (use regular sections with cards)
- Content that needs to be read linearly

### Structure

Accordion pages combine `DocHeader` for page context with `DocsAccordionPage` for the searchable list:

```tsx
export default function ChatCommandsPage() {
  return (
    <article>
      <Stack gap="lg">
        {/* Page header with context */}
        <DocHeader
          title="Chat Commands"
          icon={<TargetIcon />}
          badges={<><Badge>Commands</Badge><Badge>~3 min</Badge></>}
          subtitle="Start conversations, continue work, and create handoff summaries."
          context={<>Use these commands when planning...</>}
        />

        {/* Searchable accordion list */}
        <ChatCommandsClient items={commandsWithContent} />
      </Stack>
    </article>
  )
}
```

### Key Props

| Prop | Purpose | Notes |
|------|---------|-------|
| `hideHeader` | Hides DocsAccordionPage's built-in header | Set to `true` when using DocHeader |
| `className` | Controls spacing | Use `"space-y-6"` for tighter spacing with DocHeader |
| `showOverview` | Shows overview accordion | Include high-level context here |
| `renderTrigger` | Custom accordion title | Include icon with colored background |
| `afterAccordion` | Content after list | Use for "Next Steps" section |

### Spacing Pattern

When combining `DocHeader` with `DocsAccordionPage`:

```tsx
<Stack gap="lg">  {/* Tighter gap between header and accordion */}
  <DocHeader ... />
  <DocsAccordionPage
    hideHeader={true}
    className="space-y-6"  {/* Tighter internal spacing */}
    ...
  />
</Stack>
```

This creates appropriate visual hierarchy without excessive whitespace.

### Icon Treatment

Accordion triggers should use the **icon with colored background** pattern (not just the icon):

```tsx
renderTrigger={(item) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
      <MessageSquareIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
    </div>
    <code className="text-sm font-semibold">{item.command}</code>
    <span className="text-sm text-muted-foreground">{item.description}</span>
  </div>
)}
```

Color should match the section's visual identity established on the overview page.

### Overview Accordion

The overview accordion should contain:
1. **High-level explanation** — What this collection is for
2. **Key concepts** — Important context (gray Note components)
3. **Usage notes** — When/how to use (gray Note components)

Do not use colored cards in the overview — use gray `Note` components for consistency:

```tsx
<Note>
  <strong>Work with any AI:</strong> These prompts work with Claude, ChatGPT,
  Gemini, or any AI you prefer...
</Note>
```

### Next Steps Section

Use `afterAccordion` for Next Steps with 2 `LinkCard` components:

```tsx
afterAccordion={
  <>
    <div className="space-y-4">
      <div>
        <Text weight="medium" className="mb-3">Next Steps</Text>
        <Text size="sm" variant="muted" className="mb-4">
          Ready to dive deeper? Pick a path:
        </Text>
      </div>
      <Grid cols={2} gap="md">
        <LinkCard href="..." title="..." description="..." />
        <LinkCard href="..." title="..." description="..." />
      </Grid>
    </div>
  </>
}
```

Keep to 2 cards maximum — matches the standard pattern used throughout docs.

### Accordion Content

Each accordion item should show:
1. **What it does** — Brief description
2. **When to use** — Specific use cases
3. **Usage** — Syntax/invocation (in code block)
4. **Tips** — Helpful notes (bulleted list)
5. **Full content** — The actual prompt/component with copy button

Use consistent section labels across all accordion items in a page.

### File Organization

For accordion pages, split client/server components:

```
page.tsx              — Server component with DocHeader
client.tsx            — Client component with DocsAccordionPage
```

The server component loads data (prompts, commands, etc.) and passes to client component. This pattern keeps data loading server-side while maintaining accordion interactivity.

---

## Related Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI agent instructions (repo root) |
| `.catalyst/PLAYBOOK.md` | Minimal agent runbook |
| `app/(docs)/DOCS.md` | Docs surface technical reference |
