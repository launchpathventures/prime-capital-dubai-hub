/**
 * CATALYST - Migrate Property Images to Supabase Storage
 * 
 * Downloads external images, compresses them with Sharp, and uploads 
 * to Supabase storage, then updates the database records with new URLs.
 * 
 * Features:
 * - Resizes to max 1920px width (maintains aspect ratio)
 * - Converts to WebP format (60-80% smaller than PNG/JPEG)
 * - Compresses to 80% quality (visually indistinguishable)
 * 
 * Run with: npx tsx scripts/migrate-property-images.ts
 */

import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const BUCKET_NAME = "property-images"

interface Property {
  slug: string
  cover_image: string | null
  images: string[] | null
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!exists) {
    console.log(`Creating bucket: ${BUCKET_NAME}`)
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]
    })
    if (error) {
      console.error("Failed to create bucket:", error)
      throw error
    }
  } else {
    console.log(`Bucket ${BUCKET_NAME} already exists`)
  }
}

function getFileExtension(url: string): string {
  // Handle URLs with query params
  const cleanUrl = url.split("?")[0]
  const ext = cleanUrl.split(".").pop()?.toLowerCase() || "jpg"
  // Map common extensions
  if (ext === "webp") return "webp"
  if (ext === "png") return "png"
  if (ext === "gif") return "gif"
  return "jpg"
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  }
  return types[ext] || "image/jpeg"
}

// Compression settings
const MAX_WIDTH = 1920
const WEBP_QUALITY = 80

async function compressImage(buffer: ArrayBuffer): Promise<{ data: Buffer; sizeReduction: string }> {
  const inputSize = buffer.byteLength
  
  const compressed = await sharp(Buffer.from(buffer))
    .resize(MAX_WIDTH, null, {
      withoutEnlargement: true, // Don't upscale smaller images
      fit: "inside"
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  
  const outputSize = compressed.byteLength
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1)
  const sizeReduction = `${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024).toFixed(0)}KB (${reduction}% smaller)`
  
  return { data: compressed, sizeReduction }
}

async function downloadImage(url: string): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  try {
    console.log(`  Downloading: ${url.substring(0, 80)}...`)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      }
    })
    
    if (!response.ok) {
      console.error(`  Failed to download (${response.status}): ${url}`)
      return null
    }
    
    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || getContentType(getFileExtension(url))
    
    return { buffer, contentType }
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error)
    return null
  }
}

async function uploadToSupabase(
  slug: string,
  imageIndex: number,
  buffer: Buffer,
): Promise<string | null> {
  // Always use .webp extension since we convert all images
  const filename = `${slug}/${imageIndex === 0 ? "cover" : `gallery-${imageIndex}`}.webp`
  
  console.log(`  Uploading: ${filename}`)
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType: "image/webp",
      upsert: true
    })
  
  if (error) {
    console.error(`  Upload failed:`, error)
    return null
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename)
  
  return urlData.publicUrl
}

function isExternalUrl(url: string | null): boolean {
  if (!url) return false
  return url.startsWith("http://") || url.startsWith("https://")
}

async function migratePropertyImages() {
  console.log("\n=== Property Image Migration ===\n")
  
  // Ensure bucket exists
  await ensureBucketExists()
  
  // Get all properties
  const { data: properties, error } = await supabase
    .from("properties")
    .select("slug, cover_image, images")
  
  if (error || !properties) {
    console.error("Failed to fetch properties:", error)
    return
  }
  
  console.log(`\nFound ${properties.length} properties to process\n`)
  
  for (const property of properties as Property[]) {
    console.log(`\nProcessing: ${property.slug}`)
    
    const allImages: string[] = []
    
    // Add cover image first
    if (property.cover_image) {
      allImages.push(property.cover_image)
    }
    
    // Add gallery images (skip duplicates)
    if (property.images) {
      for (const img of property.images) {
        if (!allImages.includes(img)) {
          allImages.push(img)
        }
      }
    }
    
    const newUrls: string[] = []
    let newCoverImage: string | null = null
    
    for (let i = 0; i < allImages.length; i++) {
      const url = allImages[i]
      
      // Skip if not external (local paths)
      if (!isExternalUrl(url)) {
        console.log(`  Skipping (not external): ${url}`)
        newUrls.push(url)
        if (i === 0) newCoverImage = url
        continue
      }
      
      // Download the image
      const downloaded = await downloadImage(url)
      
      if (downloaded) {
        // Compress with Sharp
        console.log(`  Compressing...`)
        const { data: compressed, sizeReduction } = await compressImage(downloaded.buffer)
        console.log(`  ${sizeReduction}`)
        
        // Upload compressed image
        const newUrl = await uploadToSupabase(property.slug, i, compressed)
        
        if (newUrl) {
          newUrls.push(newUrl)
          if (i === 0) newCoverImage = newUrl
          console.log(`  ✓ Migrated to: ${newUrl}`)
        } else {
          // Keep original on failure
          newUrls.push(url)
          if (i === 0) newCoverImage = url
        }
      } else {
        // Keep original on failure
        newUrls.push(url)
        if (i === 0) newCoverImage = url
      }
    }
    
    // Update database
    const { error: updateError } = await supabase
      .from("properties")
      .update({
        cover_image: newCoverImage,
        images: newUrls.slice(1), // All except cover
      })
      .eq("slug", property.slug)
    
    if (updateError) {
      console.error(`  Failed to update database:`, updateError)
    } else {
      console.log(`  ✓ Database updated`)
    }
  }
  
  console.log("\n=== Migration Complete ===\n")
}

migratePropertyImages().catch(console.error)
