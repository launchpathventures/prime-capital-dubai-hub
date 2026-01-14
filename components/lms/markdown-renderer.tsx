/**
 * CATALYST - LMS Markdown Renderer
 * 
 * Rich markdown rendering for learning content.
 * Leverages CSS in learn.css for styling via .lms-prose class.
 * 
 * Features:
 * - Tables with alternating rows and proper styling
 * - Blockquotes as styled callouts (script examples)
 * - Pattern detection for Context:/Approach: callouts
 * - Scenario detection for practice sections
 * - Numbered lists with step indicators
 * - H2 headings with IDs for scroll navigation
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import Image from "next/image"
import { Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  MessageSquareQuoteIcon, 
  LightbulbIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  FileTextIcon,
} from "lucide-react"

// =============================================================================
// Utilities
// =============================================================================

/**
 * Generate a URL-safe slug from heading text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const components: Partial<Components> = {
    // Blockquotes → Script callouts with icon
    blockquote: BlockquoteComponent as any,
    
    // Tables → Rich styled tables (CSS handles styling)
    table: TableComponent as any,
    thead: TableHead as any,
    tbody: TableBody as any,
    tr: TableRow as any,
    th: TableHeaderCell as any,
    td: TableDataCell as any,
    
    // Headings with proper hierarchy
    h1: H1Component as any,
    h2: H2Component as any,
    h3: H3Component as any,
    h4: H4Component as any,
    
    // Lists with better styling
    ol: OrderedListComponent as any,
    ul: UnorderedListComponent as any,
    li: ListItemComponent as any,
    
    // Paragraphs with pattern detection
    p: ParagraphComponent as any,
    
    // Strong text
    strong: StrongComponent as any,
    
    // Horizontal rules
    hr: HRComponent as any,
    
    // Images with document styling
    img: ImageComponent as any,
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className={cn("lms-prose", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

// =============================================================================
// BLOCKQUOTE - Script/Quote Card
// =============================================================================

function BlockquoteComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Detect warning patterns
  if (text?.toLowerCase().includes("warning") || text?.toLowerCase().includes("caution")) {
    return (
      <Card className="my-6 border-l-4 border-l-warning bg-warning/5 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-3">
            <AlertTriangleIcon className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-foreground/90">
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Detect tip patterns
  if (text?.toLowerCase().includes("tip:") || text?.toLowerCase().includes("pro tip")) {
    return (
      <Card className="my-6 border-l-4 border-l-secondary-500 bg-secondary-50 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-3">
            <LightbulbIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-foreground/90">
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Default: Script/Example quote
  return (
    <Card className="my-6 border-l-4 border-l-primary bg-muted/40 shadow-none">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3">
          <MessageSquareQuoteIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="italic text-foreground/90">
              {children}
            </div>
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
  
  // Detect comparison columns for visual indicators
  const isNegative = text?.toLowerCase().includes("typical") || 
                     text?.toLowerCase().includes("instead of") ||
                     text?.toLowerCase().includes("don't") ||
                     text?.toLowerCase().includes("avoid")
  const isPositive = text?.toLowerCase().includes("prime capital") || 
                     text?.toLowerCase().includes("we say") ||
                     text?.toLowerCase().includes("better") ||
                     text?.toLowerCase().includes("do")
  
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
    <td className="px-4 py-3 border-t border-border align-top">
      {children}
    </td>
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

function H2Component({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  const id = text ? slugify(text) : undefined
  
  return (
    <h2 
      id={id}
      className="text-2xl font-serif font-semibold mt-12 mb-4 pb-2 border-b border-border text-foreground scroll-mt-24"
    >
      {children}
    </h2>
  )
}

function H3Component({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Detect scenario patterns like "Scenario 1:" or "### Scenario:"
  if (text?.toLowerCase().startsWith("scenario")) {
    return (
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning-700 text-xs font-semibold uppercase tracking-wider mb-2">
          🎭 Practice Scenario
        </div>
        <h3 className="text-xl font-serif font-semibold text-foreground">
          {text.replace(/^scenario\s*\d*:\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  // Detect "Key Point" or "Important" patterns
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
  return (
    <ol className="my-5 ml-0 space-y-3 list-none counter-reset-[item]">
      {children}
    </ol>
  )
}

function UnorderedListComponent({ children }: { children: React.ReactNode }) {
  return <ul className="my-5 ml-6 list-disc space-y-2">{children}</ul>
}

function ListItemComponent({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>
}

// =============================================================================
// PARAGRAPHS - Pattern Detection
// =============================================================================

function ParagraphComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Context: pattern → Info callout
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
  
  // Approach: pattern → Success callout
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
  
  // Risk: pattern → Warning callout
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
// IMAGES - Document Figure Style
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
