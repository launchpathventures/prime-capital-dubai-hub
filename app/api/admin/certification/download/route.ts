/**
 * CATALYST - Certification Document Download API
 *
 * Serves certification markdown files for download.
 * Requires admin role to access.
 */

import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { createClient } from "@/lib/supabase/server"

const ALLOWED_FILES = [
  "evaluator-guide.md",
  "rubric.md",
  "trainee-guide.md",
  "assessment-scenarios-a.md",
  "assessment-scenarios-b.md",
]

export async function GET(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Admin role check
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (!isAdmin) {
    return NextResponse.json({ error: "Access denied: Admin only" }, { status: 403 })
  }

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
