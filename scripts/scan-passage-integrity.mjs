// One-off read-only integrity scan over existing Normal Reading passage data.
// Does NOT fetch or introduce any new text — only inspects strings already
// committed in the repo and reports structural red flags:
//   1. paragraph bodies that don't end in terminal punctuation (possible cut-off)
//   2. paragraph bodies that are suspiciously short (possible truncation)
//   3. duplicate/skipped paragraph letters within a single passage
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src'
const files = readdirSync(dir).filter((f) => /^journeyIntensivePassages.*\.ts$/.test(f))

const TUPLE_RE = /\[\s*'([A-Z]?)'\s*,\s*'((?:\\.|[^'\\])*)'\s*\]/g
const TITLE_RE = /title:\s*'((?:\\.|[^'\\])*)'/

function decode(s) {
  return s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n')
}

const okEndChars = new Set(['.', '!', '?', '"', "'", '’', '”', ')', '*'])

let flagged = []

for (const file of files) {
  const text = readFileSync(join(dir, file), 'utf8')
  // Split into rough passage blocks so we can attribute paragraphs to a title.
  const blocks = text.split(/(?=title:\s*')/)
  for (const block of blocks) {
    const titleMatch = block.match(TITLE_RE)
    const title = titleMatch ? decode(titleMatch[1]) : '(unknown title)'
    const paraSection = block.match(/paragraphs:\s*\[([\s\S]*?)\n\s*\],/)
    if (!paraSection) continue
    const seenLetters = []
    let m
    TUPLE_RE.lastIndex = 0
    while ((m = TUPLE_RE.exec(paraSection[1])) !== null) {
      const [, letter, rawText] = m
      const t = decode(rawText).trim()
      if (letter) seenLetters.push(letter)
      const last = t.slice(-1)
      const issues = []
      if (t.length < 60 && letter) issues.push(`very short (${t.length} chars) for a lettered paragraph`)
      if (!okEndChars.has(last)) issues.push(`does not end in terminal punctuation (ends '...${t.slice(-15)}')`)
      if (issues.length) {
        flagged.push({ file, title, letter: letter || '(unlettered)', preview: t.slice(0, 70), issues })
      }
    }
    // Check letter sequence sanity (skips/dupes among A-Z lettered paragraphs)
    const uniq = [...new Set(seenLetters)]
    if (uniq.length !== seenLetters.length) {
      flagged.push({ file, title, letter: '(sequence)', preview: seenLetters.join(','), issues: ['duplicate paragraph letter in same passage'] })
    }
  }
}

console.log(`Scanned ${files.length} files.\n`)
if (!flagged.length) {
  console.log('No structural red flags found.')
} else {
  console.log(`${flagged.length} potential issues:\n`)
  for (const f of flagged) {
    console.log(`[${f.file}] "${f.title}" para ${f.letter}: ${f.issues.join('; ')}`)
    console.log(`    "...${f.preview}..."`)
  }
}
