/**
 * CATALYST - Certification Preparation Guide
 * 
 * Displays the trainee guide for certification assessment preparation.
 * Renders markdown content from the certification folder.
 */

import { promises as fs } from "fs"
import path from "path"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { MarkdownRenderer } from "@/components/lms/markdown-renderer"

// =============================================================================
// Data Fetching
// =============================================================================

async function getGuideContent(): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "content/lms/certification/trainee-guide.md"
  )
  
  try {
    const content = await fs.readFile(filePath, "utf-8")
    return content
  } catch (error) {
    console.error("Failed to read trainee guide:", error)
    return "# Guide Not Found\n\nThe certification preparation guide could not be loaded."
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CertificationGuidePage() {
  const content = await getGuideContent()
  
  return (
    <div className="learn-content">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground"
            nativeButton={false}
            render={<Link href="/learn/certification" />}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Certification
          </Button>
        </div>
        
        {/* Guide Content */}
        <article className="lms-section">
          <MarkdownRenderer content={content} />
        </article>
        
        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to practice?</h3>
              <p className="text-sm text-muted-foreground">
                Work through AI scenarios to prepare for your assessment.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/learn/scenarios" />}>
              Practice Scenarios
            </Button>
          </div>
        </div>
    </div>
  )
}
