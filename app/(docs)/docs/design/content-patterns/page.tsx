/**
 * CATALYST - Content Patterns Documentation
 *
 * Narrative patterns for the three project models:
 * websites, presentations, and apps.
 */

export default function ContentPatternsPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Content Patterns
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Narrative structures for websites, presentations, and apps.
        </p>
      </header>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          Catalyst supports three project models, each with distinct content
          patterns. These patterns provide starting points—adapt them to your
          specific needs.
        </p>
      </section>

      {/* Website Pattern */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Website Narrative Pattern</h2>
        <p className="text-muted-foreground text-sm">
          Websites provide orientation, narrative, and trust. The structure
          leads visitors from understanding to action.
        </p>

        <div className="space-y-3">
          <SectionCard
            number={1}
            title="Hero"
            description="Clear value proposition. What is this? Why should I care?"
            example="H1 + subhead + primary CTA"
          />
          <SectionCard
            number={2}
            title="Problem"
            description="Anchor the why. What pain does this solve?"
            example="Bullet points of current frustrations"
          />
          <SectionCard
            number={3}
            title="Solution"
            description="How does this solve the problem? Before/after contrast."
            example="Grid comparing old way vs new way"
          />
          <SectionCard
            number={4}
            title="Audience"
            description="Who is this for? Help visitors self-identify."
            example="3 audience cards with specific benefits"
          />
          <SectionCard
            number={5}
            title="How It Works"
            description="Simple process overview. Make it concrete."
            example="3-6 step flow with icons"
          />
          <SectionCard
            number={6}
            title="Proof"
            description="Evidence it works. Testimonials, logos, case studies."
            example="Customer quotes or project examples"
          />
          <SectionCard
            number={7}
            title="Objections"
            description="Address concerns. FAQ or scope boundaries."
            example="What this is NOT / limitations"
          />
          <SectionCard
            number={8}
            title="CTA"
            description="Clear next step. Don't make them think."
            example="Primary + secondary action buttons"
          />
        </div>
      </section>

      {/* Presentation Pattern */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Presentation Narrative Pattern</h2>
        <p className="text-muted-foreground text-sm">
          Presentations tell a stakeholder story leading to decisions. Each
          slide/section advances the argument.
        </p>

        <div className="space-y-3">
          <SectionCard
            number={1}
            title="Context"
            description="Where are we? What happened to get here?"
            example="Current situation, recent events"
          />
          <SectionCard
            number={2}
            title="Challenge"
            description="What's the problem or opportunity?"
            example="Specific issue with evidence"
          />
          <SectionCard
            number={3}
            title="Options Considered"
            description="What paths were evaluated?"
            example="2-3 options with trade-offs"
          />
          <SectionCard
            number={4}
            title="Recommendation"
            description="What do we propose and why?"
            example="Clear recommendation with rationale"
          />
          <SectionCard
            number={5}
            title="Evidence"
            description="Why should we trust this recommendation?"
            example="Data, examples, expert opinion"
          />
          <SectionCard
            number={6}
            title="Implications"
            description="What happens if we do this? If we don't?"
            example="Risks, costs, benefits"
          />
          <SectionCard
            number={7}
            title="Next Steps"
            description="What decisions are needed? What happens next?"
            example="Specific asks with owners"
          />
        </div>
      </section>

      {/* App Pattern */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">App Proof Pattern</h2>
        <p className="text-muted-foreground text-sm">
          Apps demonstrate working proof with staged hardening. In POC stage,
          the focus is on validating the concept, not polish.
        </p>

        <div className="space-y-3">
          <PatternItem
            title="Context Switch"
            description="Every page should be able to explain why it exists and what it proves. Include a toggle or panel showing the reasoning behind the UI."
            example="'Why this page' button revealing Vision/Requirements context"
          />
          <PatternItem
            title="Decision Trace"
            description="Map UI sections to the decisions and requirements that led to them. Show stakeholders the thread from intent to implementation."
            example="Sidebar panel linking UI to requirement IDs"
          />
          <PatternItem
            title="Stage Indicators"
            description="Show what quality stage (POC/MVP/MMP/PROD) applies to each section. Set expectations about polish level."
            example="Badge showing 'POC' on experimental features"
          />
          <PatternItem
            title="Validation Points"
            description="Mark areas where stakeholder feedback is needed. Make it clear what questions the POC is answering."
            example="Highlighted sections with 'Feedback needed' callouts"
          />
        </div>
      </section>

      {/* Key Principle */}
      <section className="border-primary bg-primary/5 space-y-2 border-l-4 p-4">
        <p className="font-medium">Design Supports Validation</p>
        <p className="text-muted-foreground text-sm">
          In Catalyst, content patterns exist to drive clarity and decisions.
          Every section should answer a question or enable an action. If it
          doesn&apos;t serve validation, question whether it&apos;s needed.
        </p>
      </section>

      {/* Tone Guidance */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Tone Guidance</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Plain language:</strong> Write clearly. Avoid jargon unless
            the audience uses it.
          </li>
          <li>
            <strong>Direct:</strong> Say what you mean. Don&apos;t hedge.
          </li>
          <li>
            <strong>Outcome-led:</strong> Focus on what the reader can do or
            decide, not features.
          </li>
          <li>
            <strong>Honest:</strong> Acknowledge limitations. Don&apos;t
            overclaim.
          </li>
        </ul>
      </section>

      {/* Reference */}
      <section className="border-border rounded-lg border border-dashed p-6">
        <h3 className="font-medium">Related</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          See{" "}
          <a
            href="/docs/design/layout"
            className="text-primary hover:underline"
          >
            Layout
          </a>{" "}
          for page structure, and{" "}
          <a
            href="/docs/components/patterns"
            className="text-primary hover:underline"
          >
            Component Patterns
          </a>{" "}
          for UI implementation patterns.
        </p>
      </section>
    </article>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function SectionCard({
  number,
  title,
  description,
  example,
}: {
  number: number
  title: string
  description: string
  example: string
}) {
  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
        {number}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        <p className="text-muted-foreground mt-2 text-xs italic">
          e.g., {example}
        </p>
      </div>
    </div>
  )
}

function PatternItem({
  title,
  description,
  example,
}: {
  title: string
  description: string
  example: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-medium">{title}</h4>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      <p className="text-muted-foreground mt-2 text-xs italic">
        e.g., {example}
      </p>
    </div>
  )
}
