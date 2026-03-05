/**
 * CATALYST - Upload team photos to Supabase storage
 * 
 * Uploads all team photos from public/images/team/ to the Supabase "cms" bucket,
 * then updates the corresponding team_members row with the public URL.
 * 
 * Usage: npx tsx scripts/upload-team-photos.ts
 * 
 * Modes:
 *   --dry-run    Show what would happen without uploading or updating
 *   --audit      Show current DB photo values vs local files
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

// ============================================================================
// TEAM PHOTO MAPPING
// Maps each local filename to the team_members.slug in Supabase.
// Keep this list in sync when adding/removing team members.
// ============================================================================
const teamPhotos: { slug: string; file: string }[] = [
  // Founders
  { slug: "tahir-majitia",             file: "tahir-majithia.png" },
  { slug: "shaad-haji",                file: "Shaad Haji .jpeg" },
  { slug: "rohit-saluja",              file: "Rohit-Saluja.jpg" },
  // Associate Directors
  { slug: "ahmed-ashfaq",              file: "Ahmed Ashfaq .jpg" },
  { slug: "anisha-mehrotra",           file: "Anisha Mehrotra .jpg" },
  { slug: "ghada-mary-benitez",        file: "Ghada Mary Benitez.jpg" },
  // Operations
  { slug: "virna-ann-trinidad",        file: "Virna Ann Trinidad.jpg" },
  // Senior Property Consultants
  { slug: "gina-sadana",               file: "Divneet Gina Sadana.jpg" },
  { slug: "kyle-lopez",                file: "Kyle Lopes.jpg" },
  { slug: "rakshima-mehra",            file: "Rakshhima Mehra .jpg" },
  { slug: "sourav-umesh-lakhiyani",    file: "Sourav Lakhyani.jpg" },
  { slug: "arman-kabir",               file: "Arman Kabir.jpg" },
  { slug: "zorica-dimitrijievic",      file: "Zorica Dimitrijievic.jpg" },
  { slug: "jiezelle-claire-clemente",  file: "Jiezelle Claire Clemente.jpg" },
  // Property Consultants
  { slug: "hamzah-khaleeli",           file: "Hamzah Hassan Khaleeli.jpg" },
  { slug: "harshini-shetty",           file: "Harshini Shetty .jpg" },
  { slug: "ismat-sultana",             file: "Ismat Sultana.jpg" },
  { slug: "khaseibah-rashed-saeed",    file: "Khaseibah Rashed Saeed.jpg" },
  { slug: "mohib-malgi",               file: "Mohib Malgi .jpg" },
  { slug: "mujibunnissa-sattar",       file: "Mujibunnissa Sattar.jpg" },
  { slug: "parisa-lakhu",              file: "Parisa Lakhu.jpg" },
  { slug: "rachel-matai",              file: "Rachel Matai.jpg" },
  { slug: "rishabh-arora",             file: "Rishabh Arora .jpg" },
  { slug: "riyam-al-mayyahi",          file: "Riyam Almayyahi.jpg" },
  { slug: "silvia-fernandes",          file: "Silvia Fernandez.jpg" },
  { slug: "subha-arora",               file: "Subha Arora.png" },
  { slug: "svitlana-tereshchenko",     file: "Svitlana Tereshchenko.jpg" },
  { slug: "aysha-ali",                 file: "Aysha Ali.jpg" },
  { slug: "aysha-sana",                file: "Aysha Sana.jpg" },
  { slug: "muhammad-wajahat",          file: "Muhammad Wajahat.jpg" },
  { slug: "raghav-passan",             file: "Raghav Passan.jpg" },
  { slug: "rabir-saluja",              file: "Rabir Saluja.jpg" },
  { slug: "ruhaan-chawla",             file: "Ruhaan Chawla .JPG" },
]

// ============================================================================
// AUDIT MODE — show current state of DB vs local files
// ============================================================================
async function auditTeamPhotos() {
  const teamDir = path.join(process.cwd(), "public/images/team")

  console.log("🔍 Auditing team photos...\n")

  // Fetch all team members from DB
  const { data: dbMembers, error } = await supabase
    .from("team_members")
    .select("slug, name, photo")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("❌ Failed to fetch team members:", error.message)
    return
  }

  // List local files
  const localFiles = fs.existsSync(teamDir) ? fs.readdirSync(teamDir) : []

  console.log(`📁 Local files in public/images/team/: ${localFiles.length}`)
  console.log(`👥 Team members in DB: ${dbMembers?.length ?? 0}\n`)

  // Check each mapping
  console.log("── Mapping Status ──────────────────────────────────────────")
  for (const mapping of teamPhotos) {
    const localExists = localFiles.some(f => f === mapping.file)
    const dbMember = dbMembers?.find(m => m.slug === mapping.slug)
    const hasPhoto = dbMember?.photo && dbMember.photo.length > 0

    const localIcon = localExists ? "✅" : "❌"
    const dbIcon = dbMember ? "✅" : "❌"
    const photoIcon = hasPhoto ? "✅" : "⬜"

    console.log(`${localIcon} Local  ${dbIcon} DB  ${photoIcon} Photo  │ ${mapping.slug}`)
    if (!dbMember) console.log(`   ⚠️  No DB row with slug "${mapping.slug}"`)
    if (dbMember && hasPhoto) console.log(`   🔗 ${dbMember.photo}`)
  }

  // Check for DB members without a mapping
  const mappedSlugs = new Set(teamPhotos.map(m => m.slug))
  const unmapped = dbMembers?.filter(m => !mappedSlugs.has(m.slug)) ?? []
  if (unmapped.length > 0) {
    console.log("\n── DB members without a local photo mapping ──")
    for (const m of unmapped) {
      console.log(`   ⚠️  ${m.slug} (${m.name}) — photo: ${m.photo || "(none)"}`)
    }
  }

  // Check for local files without a mapping
  const mappedFiles = new Set(teamPhotos.map(m => m.file))
  const unmappedFiles = localFiles.filter(f => !mappedFiles.has(f))
  if (unmappedFiles.length > 0) {
    console.log("\n── Local files without a slug mapping ──")
    for (const f of unmappedFiles) {
      console.log(`   ⚠️  ${f}`)
    }
  }

  console.log("\nDone!")
}

// ============================================================================
// UPLOAD MODE — upload photos and update DB
// ============================================================================
async function uploadTeamPhotos(dryRun: boolean) {
  const teamDir = path.join(process.cwd(), "public/images/team")
  
  console.log(dryRun
    ? "📸 DRY RUN — showing what would happen...\n"
    : "📸 Uploading team photos to Supabase storage...\n"
  )
  
  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const member of teamPhotos) {
    const filePath = path.join(teamDir, member.file)
    
    // Check if file exists locally
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${member.slug}: ${member.file} not found`)
      skipped++
      continue
    }

    // Normalise the storage filename (remove spaces, lowercase)
    const ext = path.extname(member.file).toLowerCase()
    const storageFilename = `${member.slug}${ext}`
    const storagePath = `team/${storageFilename}`
    const contentType = ext === ".png" ? "image/png" : "image/jpeg"

    if (dryRun) {
      console.log(`🔄 Would upload: ${member.file} → cms/${storagePath}`)
      console.log(`   Would update: team_members.photo WHERE slug = "${member.slug}"\n`)
      uploaded++
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("cms")
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      })
    
    if (uploadError) {
      console.error(`❌ Failed to upload ${member.file}:`, uploadError.message)
      failed++
      continue
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("cms")
      .getPublicUrl(storagePath)
    
    const publicUrl = urlData.publicUrl
    
    // Update team_members table
    const { data: updateData, error: updateError } = await supabase
      .from("team_members")
      .update({ photo: publicUrl })
      .eq("slug", member.slug)
      .select("slug")
    
    if (updateError) {
      console.error(`❌ Failed to update DB for ${member.slug}:`, updateError.message)
      failed++
      continue
    }

    if (!updateData || updateData.length === 0) {
      console.warn(`⚠️  Photo uploaded but no DB row matched slug "${member.slug}" — photo is orphaned`)
      console.log(`   🔗 URL: ${publicUrl}\n`)
      skipped++
      continue
    }
    
    console.log(`✅ ${member.slug}`)
    console.log(`   📤 Uploaded: cms/${storagePath}`)
    console.log(`   🔗 URL: ${publicUrl}\n`)
    uploaded++
  }
  
  console.log("────────────────────────")
  console.log(`✅ Uploaded: ${uploaded}  ⚠️ Skipped: ${skipped}  ❌ Failed: ${failed}`)
  console.log("Done!")
}

// ============================================================================
// CLI
// ============================================================================
const args = process.argv.slice(2)

if (args.includes("--audit")) {
  auditTeamPhotos().catch(console.error)
} else {
  const dryRun = args.includes("--dry-run")
  uploadTeamPhotos(dryRun).catch(console.error)
}
