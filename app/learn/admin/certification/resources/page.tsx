/**
 * CATALYST - Certification Resources
 * 
 * View and download certification materials (evaluator guide, rubric, scenario sets).
 */

import Link from "next/link"
import { 
  GraduationCapIcon,
  ArrowLeftIcon,
  FileTextIcon,
  ClipboardListIcon,
  BookOpenIcon,
  UsersIcon,
  DownloadIcon,
} from "lucide-react"
import { promises as fs } from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// =============================================================================
// Types
// =============================================================================

interface Resource {
  id: string
  title: string
  description: string
  filename: string
  icon: React.ReactNode
  audience: 'evaluator' | 'trainee' | 'both'
}

// =============================================================================
// Resource Definitions
// =============================================================================

const resources: Resource[] = [
  {
    id: "evaluator-guide",
    title: "Evaluator Guide",
    description: "Complete guide for conducting certification assessments, including session structure, persona guidance, and decision framework.",
    filename: "evaluator-guide.md",
    icon: <BookOpenIcon className="h-5 w-5" />,
    audience: "evaluator",
  },
  {
    id: "rubric",
    title: "Scoring Rubric",
    description: "5-dimension scoring criteria with detailed level descriptions and pass/fail thresholds.",
    filename: "rubric.md",
    icon: <ClipboardListIcon className="h-5 w-5" />,
    audience: "both",
  },
  {
    id: "trainee-guide",
    title: "Trainee Preparation Guide",
    description: "What to expect, how to prepare, and tips for success in the certification assessment.",
    filename: "trainee-guide.md",
    icon: <UsersIcon className="h-5 w-5" />,
    audience: "trainee",
  },
  {
    id: "scenarios-a",
    title: "Assessment Scenarios - Set A",
    description: "Primary scenario set for first-time certification attempts with evaluator notes.",
    filename: "assessment-scenarios-a.md",
    icon: <FileTextIcon className="h-5 w-5" />,
    audience: "evaluator",
  },
  {
    id: "scenarios-b",
    title: "Assessment Scenarios - Set B",
    description: "Alternate scenario set for retake assessments to ensure genuine skill development.",
    filename: "assessment-scenarios-b.md",
    icon: <FileTextIcon className="h-5 w-5" />,
    audience: "evaluator",
  },
]

// =============================================================================
// Data Fetching
// =============================================================================

async function getResourceContent(filename: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "content", "lms", "certification", filename)
    const content = await fs.readFile(filePath, "utf-8")
    return content
  } catch (error) {
    console.error(`Failed to read ${filename}:`, error)
    return null
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function CertificationResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const params = await searchParams
  const viewId = params.view
  const activeResource = viewId ? resources.find(r => r.id === viewId) : null
  
  let rawContent: string | null = null
  
  if (activeResource) {
    rawContent = await getResourceContent(activeResource.filename)
  }

  return (
    <div className="learn-shell">
      {/* Header */}
      <header className="learn-header">
        <div className="learn-header__inner">
          <div className="learn-header__left">
            <Link href="/learn" className="learn-header__logo">
              <span className="learn-header__logo-icon">
                <GraduationCapIcon className="h-3.5 w-3.5" />
              </span>
              Prime Capital Learning
            </Link>
            <nav className="learn-header__breadcrumb">
              <Link href="/learn/admin/certification">Certification Admin</Link>
              <span className="learn-header__breadcrumb-sep">›</span>
              <span className="learn-header__breadcrumb-current">Resources</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="learn-content">
        {/* Back Link */}
        <Link href="/learn/admin/certification" className="cert-record-back">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="cert-resources-layout">
          {/* Sidebar - Resource List */}
          <aside className="cert-resources-sidebar">
            <h2 className="cert-resources-sidebar__title">Certification Materials</h2>
            
            <nav className="cert-resources-nav">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/learn/admin/certification/resources?view=${resource.id}`}
                  className={`cert-resources-nav__item ${viewId === resource.id ? 'cert-resources-nav__item--active' : ''}`}
                >
                  <span className="cert-resources-nav__icon">{resource.icon}</span>
                  <span className="cert-resources-nav__content">
                    <span className="cert-resources-nav__title">{resource.title}</span>
                    <span className="cert-resources-nav__badge">
                      {resource.audience === 'evaluator' ? 'Evaluator' : 
                       resource.audience === 'trainee' ? 'Trainee' : 'All'}
                    </span>
                  </span>
                </Link>
              ))}
            </nav>

            <div className="cert-resources-sidebar__note">
              <p>
                <strong>Evaluator-only</strong> materials contain assessment details 
                that trainees should not see before their certification.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="cert-resources-main">
            {activeResource && rawContent ? (
              <>
                <div className="cert-resources-header">
                  <div>
                    <h1 className="cert-resources-title">{activeResource.title}</h1>
                    <p className="cert-resources-desc">{activeResource.description}</p>
                  </div>
                  <div className="cert-resources-actions">
                    <a 
                      href={`/api/admin/certification/download?file=${activeResource.filename}`}
                      download={activeResource.filename}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download MD
                    </a>
                  </div>
                </div>
                <article className="cert-resources-content prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {rawContent}
                  </ReactMarkdown>
                </article>
              </>
            ) : (
              <div className="cert-resources-empty">
                <FileTextIcon className="h-12 w-12 text-gray-300" />
                <h2>Select a Resource</h2>
                <p>
                  Choose a document from the sidebar to view its contents.
                  All materials are available for reference during assessments.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
