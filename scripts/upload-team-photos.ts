/**
 * CATALYST - Upload team photos to Supabase storage
 * 
 * Usage: npx tsx scripts/upload-team-photos.ts
 * 
 * Prerequisites:
 * 1. Save team photos to public/images/team/:
 *    - tahir-majitia.jpg
 *    - shaad-haji.jpg
 *    - rohit-saluja.jpg
 */

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables:")
  console.error("- NEXT_PUBLIC_SUPABASE_URL")
  console.error("- SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Team members with their photo files
const teamPhotos = [
  { slug: "tahir-majitia", file: "tahir-majithia.png" },
  { slug: "shaad-haji", file: "Shaad-Haji.png" },
  { slug: "rohit-saluja", file: "Rohit-Saluja.jpg" },
]

async function uploadTeamPhotos() {
  const teamDir = path.join(process.cwd(), "public/images/team")
  
  console.log("📸 Uploading team photos to Supabase storage...\n")
  
  for (const member of teamPhotos) {
    const filePath = path.join(teamDir, member.file)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${member.slug}: ${member.file} not found`)
      continue
    }
    
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `team/${member.file}`
    
    // Upload to storage
    const contentType = member.file.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cms")
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      })
    
    if (uploadError) {
      console.error(`❌ Failed to upload ${member.file}:`, uploadError.message)
      continue
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("cms")
      .getPublicUrl(storagePath)
    
    const publicUrl = urlData.publicUrl
    
    // Update team_members table
    const { error: updateError } = await supabase
      .from("team_members")
      .update({ photo: publicUrl })
      .eq("slug", member.slug)
    
    if (updateError) {
      console.error(`❌ Failed to update ${member.slug}:`, updateError.message)
      continue
    }
    
    console.log(`✅ ${member.slug}`)
    console.log(`   📤 Uploaded: ${storagePath}`)
    console.log(`   🔗 URL: ${publicUrl}\n`)
  }
  
  console.log("Done!")
}

uploadTeamPhotos().catch(console.error)
