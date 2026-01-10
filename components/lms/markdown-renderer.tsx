/**
 * CATALYST - LMS Markdown Renderer
 * 
 * Renders markdown content with enriched visual components.
 * The source content stays as markdown - only rendering is enhanced.
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import { Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const components: Partial<Components> = {
    // Blockquotes → Script callouts
    blockquote: BlockquoteComponent as any,
    
    // Tables → Styled comparison tables  
    table: TableComponent as any,
    th: TableHeaderCell as any,
    td: TableDataCell as any,
    
    // Headings → Section dividers with scenario detection
    h2: H2Component as any,
    h3: H3Component as any,
    h4: H4Component as any,
    
    // Lists → Styled with icons
    ol: OrderedListComponent as any,
    ul: UnorderedListComponent as any,
    li: ListItemComponent as any,
    
    // Paragraphs with pattern detection (Context:, Approach:)
    p: ParagraphComponent as any,
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

// Blockquote → Script/Quote Card
function BlockquoteComponent({ children }: { children: React.ReactNode }) {
  return (
    <Card className="my-6 border-l-4 border-l-primary bg-muted/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-3">
          <span className="text-2xl flex-shrink-0">💬</span>
          <div className="flex-1 italic text-foreground/90">
            {children}
          </div>
        </div>
        <Text size="xs" className="text-right text-muted-foreground mt-2">
          — Example Script
        </Text>
      </CardContent>
    </Card>
  )
}

// Tables → Rich comparison tables with ✓/✗ icons
function TableComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  const isNegative = text?.toLowerCase().includes("typical") || 
                     text?.toLowerCase().includes("instead of")
  const isPositive = text?.toLowerCase().includes("prime capital") || 
                     text?.toLowerCase().includes("we")
  
  return (
    <th className="px-4 py-3 text-left font-semibold bg-muted/50">
      <span className="flex items-center gap-2">
        {isNegative && <span className="text-red-500">✗</span>}
        {isPositive && <span className="text-green-500">✓</span>}
        {children}
      </span>
    </th>
  )
}

function TableDataCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 border-t">
      {children}
    </td>
  )
}

// H2 Component
function H2Component({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold mt-10 mb-4 pb-2 border-b">{children}</h2>
}

// H3 with scenario detection
function H3Component({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Detect scenario patterns like "Scenario 1:" or "### Scenario:"
  if (text?.toLowerCase().startsWith("scenario")) {
    return (
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
          🎭 Practice Scenario
        </div>
        <h3 className="text-xl font-semibold">
          {text.replace(/^scenario\s*\d*:\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  return <h3 className="text-xl font-semibold mt-8 mb-4">{children}</h3>
}

// H4 Component
function H4Component({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-semibold mt-6 mb-3">{children}</h4>
}

// Ordered List Component
function OrderedListComponent({ children }: { children: React.ReactNode }) {
  return <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
}

// Unordered List Component
function UnorderedListComponent({ children }: { children: React.ReactNode }) {
  return <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
}

// List Item Component
function ListItemComponent({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>
}

// Pattern-detected paragraphs
function ParagraphComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Context: pattern → blue callout
  if (text?.match(/^\*?\*?Context\*?\*?:/i)) {
    return (
      <div className="my-4 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
        <Text size="xs" className="uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
          Context
        </Text>
        <p className="text-blue-900 dark:text-blue-100">{text.replace(/^\*?\*?Context\*?\*?:\s*/i, "")}</p>
      </div>
    )
  }
  
  // Approach: pattern → green callout
  if (text?.match(/^\*?\*?Approach\*?\*?:/i)) {
    return (
      <div className="my-4 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900">
        <Text size="xs" className="uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-1">
          Approach
        </Text>
        <p className="text-green-900 dark:text-green-100">{text.replace(/^\*?\*?Approach\*?\*?:\s*/i, "")}</p>
      </div>
    )
  }
  
  return <p className="my-4 leading-relaxed">{children}</p>
}

// Utility
function extractText(children: React.ReactNode): string | null {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(extractText).filter(Boolean).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as { props: { children: React.ReactNode } }).props.children)
  }
  return null
}
