#!/usr/bin/env node
/**
 * Agent-generated paragraph-explanation files use single-quoted string
 * literals but the prose they write (quoting English text like "summer's
 * day") often contains a raw, unescaped apostrophe — which prematurely
 * closes the string. tsc's --noEmit somehow tolerates the resulting
 * (differently-parsed-but-still-valid) file, but esbuild/Vite's real
 * parser correctly rejects it. This iteratively transforms each file with
 * esbuild, and on failure escapes the apostrophe nearest the reported
 * error position, until the file transforms cleanly.
 *
 * Run: node scripts/fix-unescaped-apostrophes.mjs <file.ts> [file2.ts...]
 */
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'

const esbuildMainPath = execSync(
  "find /Users/natchanon/.npm/_npx -maxdepth 6 -path '*/node_modules/esbuild/lib/main.js' | head -1",
  { encoding: 'utf8' }
).trim()
if (!esbuildMainPath) {
  console.error('Could not locate an esbuild install under ~/.npm/_npx (run `npx --yes tsx --version` once first).')
  process.exit(1)
}
const esbuild = await import(pathToFileURL(esbuildMainPath).href)

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Usage: node scripts/fix-unescaped-apostrophes.mjs <file.ts> [...]')
  process.exit(1)
}

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  let fixes = 0
  let guard = 0

  while (guard < 500) {
    guard += 1
    try {
      await esbuild.transform(content, { loader: 'ts' })
      break
    } catch (err) {
      const loc = err.errors?.[0]?.location
      if (!loc) {
        console.error(`${file}: unrecoverable error —`, err.errors?.[0]?.text)
        process.exit(1)
      }
      const lines = content.split('\n')
      const lineIndex = loc.line - 1
      const line = lines[lineIndex]
      // esbuild reports `column` as a UTF-8 BYTE offset, not a JS string
      // (UTF-16 code unit) index — Thai characters are 3 bytes each, so on
      // Thai text that column hugely overshoots the real character index.
      // Convert byte-offset -> char-index by walking the line's own UTF-8
      // byte lengths.
      let charCol = 0
      let byteCount = 0
      while (charCol < line.length && byteCount < loc.column) {
        byteCount += Buffer.byteLength(line[charCol], 'utf8')
        charCol += 1
      }
      // esbuild's column points at the character AFTER the string that
      // "closed" too early — the culprit is the nearest unescaped apostrophe
      // before that column (a contraction like "summer's", or a Thai-quoted
      // English word like 'coffee' — Thai prose never needs a raw ').
      const firstNonWsCol = line.search(/\S/)
      let fixCol = -1
      for (let i = Math.min(charCol, line.length) - 1; i >= 0; i -= 1) {
        // Skip the string's own opening delimiter — it's always the first
        // non-whitespace character on its line in this file's formatting.
        if (i === firstNonWsCol) continue
        if (line[i] === "'" && line[i - 1] !== '\\') {
          fixCol = i
          break
        }
      }
      if (fixCol === -1) {
        console.error(`${file}: could not locate a fixable apostrophe near ${loc.line}:${loc.column}`)
        console.error('  line:', line)
        process.exit(1)
      }
      lines[lineIndex] = line.slice(0, fixCol) + '\\' + line.slice(fixCol)
      content = lines.join('\n')
      fixes += 1
    }
  }

  if (guard >= 500) {
    console.error(`${file}: gave up after 500 fix attempts`)
    process.exit(1)
  }

  fs.writeFileSync(file, content, 'utf8')
  console.log(`${file}: ${fixes} apostrophe(s) escaped, now transforms cleanly`)
}
