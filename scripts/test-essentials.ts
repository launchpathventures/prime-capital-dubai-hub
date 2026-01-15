/**
 * CATALYST - Test Essentials Generation
 * 
 * Run with: npx tsx scripts/test-essentials.ts
 */

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { config } from "dotenv"
import {
  ESSENTIALS_PROMPT_VERSION,
  hashContent,
  buildEssentialsPrompt,
  parseEssentialsResponse,
} from "../lib/lms/essentials"

// Load environment variables
config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const anthropicKey = process.env.ANTHROPIC_API_KEY!

async function testEssentialsGeneration() {
  console.log("🧪 Testing Essentials Generation...\n")

  // 1. Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 2. Fetch a test module (Module 1.2 - Prime Capital Positioning)
  console.log("📚 Fetching module 1.2...")
  const { data: module, error: moduleError } = await supabase
    .from("learning_modules")
    .select(`
      id,
      slug,
      title,
      type,
      content,
      estimated_duration,
      frontmatter,
      competency_id,
      competencies (
        id,
        slug,
        name,
        description
      )
    `)
    .eq("module_number", "1.2")
    .single()

  if (moduleError || !module) {
    console.error("❌ Failed to fetch module:", moduleError)
    process.exit(1)
  }

  console.log(`✅ Found: ${module.title}\n`)

  // 3. Fetch audio transcripts
  const { data: audioTranscripts } = await supabase
    .from("audio_transcripts")
    .select("slug, title, duration, type")
    .eq("module_id", module.id)

  console.log(`🎧 Audio transcripts: ${audioTranscripts?.length || 0}`)

  // 4. Build the prompt
  console.log("\n📝 Building AI prompt...")
  const competency = module.competencies as unknown as { name: string; description: string | null }
  
  const { systemPrompt, userPrompt } = buildEssentialsPrompt({
    module: {
      title: module.title,
      type: module.type,
      content: module.content || "",
      estimated_duration: module.estimated_duration,
      frontmatter: module.frontmatter as Record<string, unknown> | null,
    },
    competency: {
      name: competency?.name || "Unknown",
      description: competency?.description || null,
    },
    audioTranscripts: (audioTranscripts || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      duration: a.duration || "unknown",
      type: a.type,
    })),
    requiredFacts: [
      "10,000+ registered agents in Dubai",
      "Antidote to Dubai hustle",
    ],
  })

  console.log("✅ Prompt built")
  console.log(`   System prompt: ${systemPrompt.length} chars`)
  console.log(`   User prompt: ${userPrompt.length} chars`)

  // 5. Call Claude API
  console.log("\n🤖 Calling Claude API...")
  const anthropic = new Anthropic({ apiKey: anthropicKey })

  const startTime = Date.now()
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  })
  const elapsed = Date.now() - startTime

  console.log(`✅ Response received in ${elapsed}ms`)
  console.log(`   Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`)

  // 6. Parse response
  const content = response.content[0]
  if (content.type !== "text") {
    console.error("❌ Unexpected response type")
    process.exit(1)
  }

  console.log("\n📦 Parsing response...")
  try {
    const essentials = parseEssentialsResponse(content.text)
    
    // Add metadata
    essentials.generatedAt = new Date().toISOString()
    essentials.sourceHash = hashContent(module.content || "")
    essentials.promptVersion = ESSENTIALS_PROMPT_VERSION

    console.log("✅ Parsed successfully!\n")
    
    // Display results
    console.log("═══════════════════════════════════════════════════════════")
    console.log("                    GENERATED ESSENTIALS")
    console.log("═══════════════════════════════════════════════════════════\n")
    
    console.log("📋 TL;DR:")
    console.log(`   ${essentials.tldr}\n`)
    
    console.log(`🎯 Key Facts (${essentials.keyFacts.length}):`)
    essentials.keyFacts.forEach((f: { fact: string }, i: number) => {
      console.log(`   ${i + 1}. ${f.fact}`)
    })
    
    console.log(`\n📝 Scripts (${essentials.scripts.length}):`)
    essentials.scripts.forEach((s: { scenario: string; script: string }, i: number) => {
      console.log(`   ${i + 1}. [${s.scenario}]`)
      console.log(`      "${s.script.substring(0, 100)}..."`)
    })
    
    console.log(`\n🖼️ Images (${essentials.images.length}):`)
    essentials.images.forEach((img: { src: string; essential: boolean }, i: number) => {
      console.log(`   ${i + 1}. ${img.src} (essential: ${img.essential})`)
    })
    
    console.log(`\n🎧 Audio (${essentials.audio.length}):`)
    essentials.audio.forEach((a: { title: string; duration: string }, i: number) => {
      console.log(`   ${i + 1}. ${a.title} (${a.duration})`)
    })
    
    console.log("\n💬 Practice Scenario:")
    console.log(`   Situation: ${essentials.practice.situation.substring(0, 80)}...`)
    console.log(`   Task: ${essentials.practice.task.substring(0, 80)}...`)
    
    console.log("\n🤔 Reflection:")
    console.log(`   ${essentials.reflection}`)

    // 7. Save to database
    console.log("\n💾 Saving to database...")
    const { error: updateError } = await supabase
      .from("learning_modules")
      .update({
        essentials,
        essentials_generated_at: new Date().toISOString(),
        essentials_source_hash: essentials.sourceHash,
        essentials_prompt_version: essentials.promptVersion,
      })
      .eq("id", module.id)

    if (updateError) {
      console.error("❌ Save failed:", updateError)
    } else {
      console.log("✅ Essentials saved to database!")
    }

    console.log("\n═══════════════════════════════════════════════════════════")
    console.log("                    TEST COMPLETE ✅")
    console.log("═══════════════════════════════════════════════════════════")

  } catch (parseError) {
    console.error("❌ Parse failed:", parseError)
    console.log("\nRaw response:")
    console.log(content.text.substring(0, 1000))
    process.exit(1)
  }
}

testEssentialsGeneration().catch(console.error)
