/**
 * CATALYST - Generate Investor Decision Framework Voiceover and Captions
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { generateSpeech } from "../lib/elevenlabs"
import {
  FRAMEWORK_VIDEO_FPS,
  FRAMEWORK_VIDEO_SCENES,
} from "../remotion/investor-decision-framework/script"

const force = process.argv.includes("--force")
const outputDirectory = path.join(
  process.cwd(),
  "public",
  "videos",
  "framework-walkthrough",
  "audio"
)
const captionsPath = path.join(
  process.cwd(),
  "public",
  "videos",
  "investor-decision-framework-walkthrough.vtt"
)

function formatVttTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${remainingSeconds.toFixed(3).padStart(6, "0")}`
}

function buildCaptions() {
  const cues: string[] = ["WEBVTT", ""]
  let sceneStartFrame = 0

  for (const scene of FRAMEWORK_VIDEO_SCENES) {
    const sentences =
      scene.narration.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) ??
      [scene.narration]
    const totalWords = sentences.reduce(
      (total, sentence) => total + sentence.split(/\s+/).length,
      0
    )
    let sentenceStartFrame = sceneStartFrame

    sentences.forEach((sentence, index) => {
      const wordShare = sentence.split(/\s+/).length / totalWords
      const sentenceDuration =
        index === sentences.length - 1
          ? sceneStartFrame + scene.durationInFrames - sentenceStartFrame
          : scene.durationInFrames * wordShare
      const start = sentenceStartFrame / FRAMEWORK_VIDEO_FPS
      const end = (sentenceStartFrame + sentenceDuration) / FRAMEWORK_VIDEO_FPS

      cues.push(`${formatVttTime(start)} --> ${formatVttTime(end)}`)
      cues.push(sentence)
      cues.push("")
      sentenceStartFrame += sentenceDuration
    })

    sceneStartFrame += scene.durationInFrames
  }

  return cues.join("\n")
}

async function main() {
  await mkdir(outputDirectory, { recursive: true })

  for (const scene of FRAMEWORK_VIDEO_SCENES) {
    const audioPath = path.join(outputDirectory, `${scene.id}.mp3`)

    if (!force) {
      try {
        await import("node:fs/promises").then(({ access }) => access(audioPath))
        console.log(`Skipping ${scene.id}; audio already exists.`)
        continue
      } catch {
        // Generate the missing scene below.
      }
    }

    console.log(`Generating ${scene.id}...`)
    const { audio } = await generateSpeech(scene.narration, {
      stability: 0.62,
      similarityBoost: 0.78,
    })
    await writeFile(audioPath, audio)
  }

  await writeFile(captionsPath, buildCaptions())
  console.log("Framework narration and captions are ready.")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
