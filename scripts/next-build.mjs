/**
 * CATALYST - Next.js build wrapper
 */

import { spawn } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const suppressedLines = new Set([
  "[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`",
])

function createLineFilter(write) {
  let buffer = ""

  return {
    write(chunk) {
      buffer += chunk.toString()
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        if (!suppressedLines.has(line.trim())) {
          write(`${line}\n`)
        }
      }
    },
    flush() {
      if (buffer && !suppressedLines.has(buffer.trim())) {
        write(buffer)
      }
    },
  }
}

const nextBin = require.resolve("next/dist/bin/next")
const child = spawn(process.execPath, [nextBin, "build"], {
  env: {
    ...process.env,
    BROWSERSLIST_IGNORE_OLD_DATA: "true",
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  },
  stdio: ["inherit", "pipe", "pipe"],
})

const stdout = createLineFilter((line) => process.stdout.write(line))
const stderr = createLineFilter((line) => process.stderr.write(line))

child.stdout.on("data", (chunk) => stdout.write(chunk))
child.stderr.on("data", (chunk) => stderr.write(chunk))

child.on("close", (code) => {
  stdout.flush()
  stderr.flush()
  process.exit(code ?? 1)
})
