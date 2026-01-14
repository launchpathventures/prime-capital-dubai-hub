/**
 * CATALYST - Certification Document Download API
 * 
 * Serves certification markdown files for download.
 */

import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const ALLOWED_FILES = [
  "evaluator-guide.md",
  "rubric.md",
  "trainee-guide.md",
  "assessment-scenarios-a.md",
  "assessment-scenarios-b.md",
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get("file")
  
  // Validate filename
  if (!filename || !ALLOWED_FILES.includes(filename)) {
    return NextResponse.json(
      { error: "Invalid file requested" },
      { status: 400 }
    )
  }
  
  try {
    const filePath = path.join(process.cwd(), "content", "lms", "certification", filename)
    const content = await fs.readFile(filePath, "utf-8")
    
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error(`Failed to read ${filename}:`, error)
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    )
  }
}
