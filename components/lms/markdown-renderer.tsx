/**
 * CATALYST - LMS Markdown Renderer
 * 
 * Rich markdown rendering for learning content.
 * Leverages CSS in learn.css for styling via .lms-content class.
 * 
 * Features:
 * - Tables with alternating rows and proper styling
 * - Blockquotes as styled callouts (script examples)
 * - Pattern detection for Context:/Approach: callouts
 * - Scenario detection for practice sections
 * - Numbered lists with step indicators
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import { Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  MessageSquareQuoteIcon, 
  LightbulbIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
} from "lucide-react"

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
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className={cn("lms-content", className)}>
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
  return (
    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 pb-2 border-b border-border text-foreground">
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
