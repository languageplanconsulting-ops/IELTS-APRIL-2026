// Read-only integrity audit over existing Normal Reading passage data.
// Does NOT fetch or introduce any new text. For each passage, cross-checks
// matchingInfo/headings answer letters against where their own `evidence`
// string actually appears among the paragraph bodies already in the repo.
// A consistent off-by-N mismatch across every item in a passage is strong,
// self-contained proof of a mislettering bug (e.g. a bogus title/byline
// paragraph inserted as 'A', shifting every real paragraph down by one) —
// the same signature manually confirmed for the Tea and the Industrial
// Revolution passage. This lets us find/fix such bugs with confidence
// without needing to fetch any external "source" text.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src'
const files = readdirSync(dir).filter((f) => /^journeyIntensivePassages.*\.ts$/.test(f))

const TUPLE_RE = /\[\s*'([A-Z]?)'\s*,\s*'((?:\\.|[^'\\])*)'\s*\]/g
const Q_RE = /\bq\(\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,/g

function decode(s) {
  return s
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
}

function norm(s) {
  return decode(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const SECTION_KEYS = ['matchingInfo', 'fill', 'matchingPeople', 'headings', 'mcq', 'ynng', 'tfng']

function extractSectionBlock(blockText, key) {
  // Find "key:" not preceded by a letter (avoid matching inside other words)
  const re = new RegExp(`(?:^|[^A-Za-z])${key}\\s*:`)
  const m = re.exec(blockText)
  if (!m) return null
  const start = m.index + m[0].length
  // Find the earliest start of any other section key after this point
  let end = blockText.length
  for (const other of SECTION_KEYS) {
    if (other === key) continue
    const oreN = new RegExp(`(?:^|[^A-Za-z])${other}\\s*:`)
    oreN.lastIndex = 0
    const rest = blockText.slice(start)
    const om = oreN.exec(rest)
    if (om) {
      const idx = start + om.index + (om[0][0] === other[0] ? 0 : 1)
      if (idx < end) end = idx
    }
  }
  return blockText.slice(start, end)
}

function extractItems(sectionText) {
  if (!sectionText) return []
  const items = []
  Q_RE.lastIndex = 0
  let m
  while ((m = Q_RE.exec(sectionText)) !== null) {
    items.push({ prompt: decode(m[1]), answer: decode(m[2]), evidence: decode(m[3]) })
  }
  return items
}

let shiftBugs = []
let scattered = []
let titleBleeds = []
let notFound = []

for (const file of files) {
  const text = readFileSync(join(dir, file), 'utf8')
  const blocks = text.split(/(?=^const \w+: IntensivePassageLayout = \{)/m).filter((b) => /^const \w+: IntensivePassageLayout/.test(b))

  for (const block of blocks) {
    const nameMatch = block.match(/^const (\w+):/)
    const varName = nameMatch ? nameMatch[1] : '(unknown var)'
    const titleMatch = block.match(/title:\s*'((?:\\.|[^'\\])*)'/)
    const title = titleMatch ? decode(titleMatch[1]) : '(unknown title)'

    const paraSection = block.match(/paragraphs:\s*\[([\s\S]*?)\n\s*\],/)
    if (!paraSection) continue
    const paragraphs = []
    TUPLE_RE.lastIndex = 0
    let pm
    while ((pm = TUPLE_RE.exec(paraSection[1])) !== null) {
      paragraphs.push({ letter: pm[1], text: decode(pm[2]) })
    }
    if (!paragraphs.length) continue

    // --- Title-bleed check: does paragraph A's text start with the title? ---
    const firstLettered = paragraphs.find((p) => p.letter)
    if (firstLettered && title !== '(unknown title)') {
      const nTitle = norm(title)
      const nPara = norm(firstLettered.text)
      if (nTitle.length > 8 && nPara.startsWith(nTitle)) {
        titleBleeds.push({
          file,
          varName,
          title,
          letter: firstLettered.letter,
          preview: firstLettered.text.slice(0, 160)
        })
      }
    }

    // --- Answer-letter vs evidence-location shift check (matchingInfo + headings) ---
    for (const key of ['matchingInfo', 'headings']) {
      const sectionText = extractSectionBlock(block, key)
      const items = extractItems(sectionText)
      if (!items.length) continue

      const mismatches = []
      for (const item of items) {
        if (!/^[A-Z]$/.test(item.answer)) continue // headings answers are roman numerals sometimes for other q()s; skip non-letter
        const nEvidence = norm(item.evidence)
        if (nEvidence.length < 12) continue
        let foundLetter = null
        for (const p of paragraphs) {
          if (!p.letter) continue
          if (norm(p.text).includes(nEvidence)) {
            foundLetter = p.letter
            break
          }
        }
        if (!foundLetter) {
          notFound.push({ file, varName, title, section: key, prompt: item.prompt.slice(0, 60), evidence: item.evidence.slice(0, 80) })
          continue
        }
        if (foundLetter !== item.answer) {
          mismatches.push({ prompt: item.prompt.slice(0, 60), recorded: item.answer, found: foundLetter })
        }
      }

      if (mismatches.length) {
        const shifts = new Set(mismatches.map((mm) => mm.found.charCodeAt(0) - mm.recorded.charCodeAt(0)))
        if (shifts.size === 1 && mismatches.length >= 2) {
          shiftBugs.push({ file, varName, title, section: key, shift: [...shifts][0], count: mismatches.length, totalItems: items.length, mismatches })
        } else {
          scattered.push({ file, varName, title, section: key, count: mismatches.length, totalItems: items.length, mismatches })
        }
      }
    }
  }
}

console.log(`Scanned ${files.length} files.\n`)

console.log(`=== TITLE-BLEED (title text prepended to first paragraph): ${titleBleeds.length} ===`)
for (const t of titleBleeds) {
  console.log(`[${t.file}] ${t.varName} "${t.title}" para ${t.letter}:`)
  console.log(`    "${t.preview}..."`)
}

console.log(`\n=== CONSISTENT SHIFT BUGS (high confidence — same class as Tea passage fix): ${shiftBugs.length} ===`)
for (const s of shiftBugs) {
  console.log(`[${s.file}] ${s.varName} "${s.title}" [${s.section}]: shift=${s.shift > 0 ? '+' : ''}${s.shift}, ${s.count}/${s.totalItems} items mismatched`)
  for (const mm of s.mismatches) console.log(`    "${mm.prompt}..." recorded=${mm.recorded} actualLetter=${mm.found}`)
}

console.log(`\n=== SCATTERED MISMATCHES (no single consistent shift — needs manual review): ${scattered.length} ===`)
for (const s of scattered) {
  console.log(`[${s.file}] ${s.varName} "${s.title}" [${s.section}]: ${s.count}/${s.totalItems} items mismatched`)
  for (const mm of s.mismatches) console.log(`    "${mm.prompt}..." recorded=${mm.recorded} actualLetter=${mm.found}`)
}

console.log(`\n=== EVIDENCE NOT FOUND IN ANY PARAGRAPH (possible real content loss, or paraphrased evidence): ${notFound.length} ===`)
for (const n of notFound) {
  console.log(`[${n.file}] ${n.varName} "${n.title}" [${n.section}]: "${n.prompt}..." evidence="${n.evidence}..."`)
}
