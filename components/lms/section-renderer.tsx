/**
 * CATALYST - LMS Section Renderer
 * 
 * Renders markdown content split into visual section cards.
 * Each H2 heading starts a new section card.
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import Image from "next/image"
import Link from "next/link"
import { Text, Stack } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  MessageSquareQuoteIcon, 
  LightbulbIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  FileTextIcon,
  Bot,
  ArrowRight,
} from "lucide-react"

// =============================================================================
// Utilities
// =============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// =============================================================================
// Types
// =============================================================================

interface Section {
  id: string
  title: string
  content: string
}

/** Minimal scenario data for linking */
interface ScenarioLink {
  slug: string
  title: string
  scenarioCount: number | null
}

interface SectionRendererProps {
  content: string
  className?: string
  linkedScenarios?: ScenarioLink[]
}

// =============================================================================
// Content Splitting
// =============================================================================

/**
 * Split markdown content into sections based on H2 headings.
 * Content before the first H2 becomes an "intro" section.
 * H1 headings are stripped (title shown in page header).
 */
function splitIntoSections(markdown: string): Section[] {
  const sections: Section[] = []
  
  // Split by H2 headings, keeping the delimiter
  const parts = markdown.split(/(?=^## )/gm)
  
  parts.forEach((part, index) => {
    const trimmed = part.trim()
    if (!trimmed) return
    
    // Check if this part starts with H2
    const h2Match = trimmed.match(/^## (.+)$/m)
    
    if (h2Match) {
      const title = h2Match[1].trim()
      // Remove the H2 line from content (we'll render it as section header)
      const content = trimmed.replace(/^## .+\n?/, "").trim()
      sections.push({
        id: slugify(title),
        title,
        content,
      })
    } else if (index === 0 && trimmed) {
      // Intro content before first H2
      // Strip H1 heading (already shown in page header)
      const contentWithoutH1 = trimmed.replace(/^# .+\n?/, "").trim()
      // Only add intro section if there's content after stripping H1
      if (contentWithoutH1) {
        sections.push({
          id: "intro",
          title: "",
          content: contentWithoutH1,
        })
      }
    }
  })
  
  return sections
}

// =============================================================================
// Main Component
// =============================================================================

export function SectionRenderer({ content, className, linkedScenarios = [] }: SectionRendererProps) {
  const sections = splitIntoSections(content)
  
  // Count sections with titles (for numbering)
  let sectionNumber = 0
  
  return (
    <div className={cn("lms-sections", className)}>
      {sections.map((section) => {
        const hasTitle = !!section.title
        if (hasTitle) sectionNumber++
        
        return (
          <section
            key={section.id}
            id={section.id}
            className={cn(
              "lms-section-card",
              !hasTitle && "lms-section-card--intro"
            )}
          >
            {hasTitle && (
              <h2 className="lms-section-card__title">
                <span className="lms-section-card__number">{sectionNumber}</span>
                {section.title}
              </h2>
            )}
            <div className="lms-section-card__content">
              <div className="lms-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {section.content}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )
      })}
      
      {/* Practice with AI - shown after all content sections */}
      {linkedScenarios.length > 0 && (
        <section id="practice-with-ai" className="lms-section-card essentials-section--ai-practice">
          <h2 className="lms-section-card__title">
            <span className="lms-section-card__number">{++sectionNumber}</span>
            <Bot className="essentials-section__icon" />
            Practice with AI
          </h2>
          <div className="lms-section-card__content">
            <Text size="sm" className="essentials-ai-practice__intro">
              Ready to practice what you learned? Try these AI roleplay scenarios:
            </Text>
            <div className="essentials-ai-practice__grid">
              {linkedScenarios.map((scenario) => (
                <Link
                  key={scenario.slug}
                  href={`/learn/scenarios/${scenario.slug}`}
                  className="essentials-ai-practice__card"
                >
                  <div className="essentials-ai-practice__icon">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="essentials-ai-practice__content">
                    <span className="essentials-ai-practice__title">{scenario.title}</span>
                    {scenario.scenarioCount && (
                      <span className="essentials-ai-practice__count">
                        {scenario.scenarioCount} practice scenarios
                      </span>
                    )}
                  </div>
                  <ArrowRight className="essentials-ai-practice__arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// =============================================================================
// Markdown Components
// =============================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: Partial<Components> = {
  blockquote: BlockquoteComponent as any,
  table: TableComponent as any,
  thead: TableHead as any,
  tbody: TableBody as any,
  tr: TableRow as any,
  th: TableHeaderCell as any,
  td: TableDataCell as any,
  h1: H1Component as any,
  h2: H2InSection as any,
  h3: H3Component as any,
  h4: H4Component as any,
  ol: OrderedListComponent as any,
  ul: UnorderedListComponent as any,
  li: ListItemComponent as any,
  p: ParagraphComponent as any,
  strong: StrongComponent as any,
  hr: HRComponent as any,
  img: ImageComponent as any,
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// =============================================================================
// BLOCKQUOTE
// =============================================================================

function BlockquoteComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  if (text?.toLowerCase().includes("warning") || text?.toLowerCase().includes("caution")) {
    return (
      <Card className="my-6 border-l-4 border-l-warning bg-warning/5 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-3">
            <AlertTriangleIcon className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-foreground/90">{children}</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (text?.toLowerCase().includes("tip:") || text?.toLowerCase().includes("pro tip")) {
    return (
      <Card className="my-6 border-l-4 border-l-secondary-500 bg-secondary-50 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-3">
            <LightbulbIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-foreground/90">{children}</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="my-6 border-l-4 border-l-primary bg-muted/40 shadow-none">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3">
          <MessageSquareQuoteIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="italic text-foreground/90">{children}</div>
            <Text size="xs" className="text-right text-muted-foreground mt-3">
              — Example Script
            </Text>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// TABLES
// =============================================================================

function TableComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-[0.9375rem]">{children}</table>
    </div>
  )
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted">{children}</thead>
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border last:border-b-0">{children}</tr>
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  const isNegative = text?.toLowerCase().includes("typical") || 
                     text?.toLowerCase().includes("instead of") ||
                     text?.toLowerCase().includes("don't")
  const isPositive = text?.toLowerCase().includes("prime capital") || 
                     text?.toLowerCase().includes("we say") ||
                     text?.toLowerCase().includes("better")
  
  return (
    <th className="px-4 py-3 text-left font-semibold text-foreground">
      <span className="flex items-center gap-2">
        {isNegative && <span className="text-destructive">✗</span>}
        {isPositive && <span className="text-success">✓</span>}
        {children}
      </span>
    </th>
  )
}

function TableDataCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 border-t border-border align-top">{children}</td>
  )
}

// =============================================================================
// HEADINGS
// =============================================================================

function H1Component({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-serif font-semibold mt-8 mb-4 text-foreground">
      {children}
    </h1>
  )
}

function H2InSection({ children }: { children: React.ReactNode }) {
  // H2s inside sections (rare) - render as H3 visually
  return (
    <h3 className="text-xl font-serif font-semibold mt-8 mb-4 text-foreground">
      {children}
    </h3>
  )
}

function H3Component({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  if (text?.toLowerCase().startsWith("scenario")) {
    return (
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 text-xs font-semibold uppercase tracking-wider mb-2">
          Practice Scenario
        </div>
        <h3 className="text-xl font-serif font-semibold text-foreground">
          {text.replace(/^scenario\s*\d*:\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  if (text?.toLowerCase().includes("key point") || text?.toLowerCase().includes("important")) {
    return (
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          ⚡ Key Point
        </div>
        <h3 className="text-xl font-serif font-semibold text-foreground">
          {text.replace(/^(key point|important):\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  // Real Example / Example patterns
  if (text?.match(/^(real\s+)?example/i)) {
    return (
      <div className="lms-example-header">
        <span className="lms-example-header__badge">💡 Example</span>
        <h3 className="lms-example-header__title">
          {text.replace(/^(real\s+)?example:?\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  return (
    <h3 className="text-xl font-serif font-semibold mt-8 mb-4 text-foreground">
      {children}
    </h3>
  )
}

function H4Component({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-lg font-semibold mt-6 mb-3 text-foreground">
      {children}
    </h4>
  )
}

// =============================================================================
// LISTS
// =============================================================================

function OrderedListComponent({ children }: { children: React.ReactNode }) {
  return <ol className="my-5 ml-0 space-y-3 list-none counter-reset-[item]">{children}</ol>
}

function UnorderedListComponent({ children }: { children: React.ReactNode }) {
  return <ul className="my-5 ml-6 list-disc space-y-2">{children}</ul>
}

function ListItemComponent({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>
}

// =============================================================================
// PARAGRAPHS
// =============================================================================

function ParagraphComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  if (text?.match(/^\*?\*?Context\*?\*?:/i)) {
    return (
      <div className="my-5 p-4 rounded-lg bg-info-50 border border-info-200">
        <div className="flex gap-3">
          <InfoIcon className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <Text size="xs" className="uppercase tracking-wider text-info-600 font-semibold mb-1">
              Context
            </Text>
            <p className="text-info-900 leading-relaxed m-0">
              {text.replace(/^\*?\*?Context\*?\*?:\s*/i, "")}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (text?.match(/^\*?\*?Approach\*?\*?:/i)) {
    return (
      <div className="my-5 p-4 rounded-lg bg-success-50 border border-success-200">
        <div className="flex gap-3">
          <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <Text size="xs" className="uppercase tracking-wider text-success-600 font-semibold mb-1">
              Approach
            </Text>
            <p className="text-success-900 leading-relaxed m-0">
              {text.replace(/^\*?\*?Approach\*?\*?:\s*/i, "")}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (text?.match(/^\*?\*?(Risk|Warning|Caution)\*?\*?:/i)) {
    return (
      <div className="my-5 p-4 rounded-lg bg-destructive-50 border border-destructive-200">
        <div className="flex gap-3">
          <AlertTriangleIcon className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <Text size="xs" className="uppercase tracking-wider text-destructive-600 font-semibold mb-1">
              {text.match(/^\*?\*?(Risk|Warning|Caution)/i)?.[1] || "Risk"}
            </Text>
            <p className="text-destructive-900 leading-relaxed m-0">
              {text.replace(/^\*?\*?(Risk|Warning|Caution)\*?\*?:\s*/i, "")}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return <p className="my-4 leading-relaxed">{children}</p>
}

// =============================================================================
// OTHER ELEMENTS
// =============================================================================

function StrongComponent({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}

function HRComponent() {
  return <hr className="my-8 border-t border-border" />
}

// =============================================================================
// IMAGES
// =============================================================================

interface ImageProps {
  src?: string
  alt?: string
  title?: string
}

function ImageComponent({ src, alt, title }: ImageProps) {
  if (!src) return null
  
  // Check if this is a document image (in /images/lms/documents/)
  const isDocument = src.includes("/documents/") || src.includes("document")
  
  // Extract caption from title or alt
  const caption = title || alt
  
  if (isDocument) {
    return (
      <figure className="my-8">
        <div className="relative block w-full max-w-md mx-auto overflow-hidden rounded-lg border border-border bg-muted/30">
          {/* Document badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <FileTextIcon className="h-3.5 w-3.5" />
            Document
          </div>
          
          {/* Image */}
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={src}
              alt={alt || "Reference document"}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
        
        {caption && (
          <figcaption className="mt-3 text-center">
            <Text size="sm" className="text-muted-foreground">
              {caption}
            </Text>
          </figcaption>
        )}
      </figure>
    )
  }
  
  // Standard image
  return (
    <figure className="my-6">
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={450}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center">
          <Text size="sm" className="text-muted-foreground">
            {caption}
          </Text>
        </figcaption>
      )}
    </figure>
  )
}

// =============================================================================
// UTILITIES
// =============================================================================

function extractText(children: React.ReactNode): string | null {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(extractText).filter(Boolean).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as { props: { children: React.ReactNode } }).props.children)
  }
  return null
}
