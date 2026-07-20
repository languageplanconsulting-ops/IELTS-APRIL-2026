/**
 * Audit every listening foundation set: question evidence must appear in resolved audioscript.
 * Run: npx tsx scripts/audit-listening-script-match.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationData.ts'
import { CAMBRIDGE_12_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge12Data.ts'
import { CAMBRIDGE_13_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge13Data.ts'
import { CAMBRIDGE_17_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge17Data.ts'
import { CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridgeSafeData.ts'
import {
  isListeningExcerptDrillSet,
  resolveListeningFoundationAudioscript
} from '../src/listeningFoundationAudioscript.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const ALL_SETS = [
  ...LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS,
]

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const evidenceInScript = (evidence, script) => {
  const e = normalize(evidence)
  const s = normalize(script)
  if (!e || !s) return false
  if (s.includes(e)) return true
  const words = e.split(' ').filter((w) => w.length > 3)
  if (words.length < 3) return s.includes(e)
  let hits = 0
  for (const word of words) if (s.includes(word)) hits += 1
  return hits / words.length >= 0.75
}

const mismatches = []
const cambridgeAudioMismatches = []
let questionCount = 0

for (const set of ALL_SETS) {
  const script = resolveListeningFoundationAudioscript(set)
  const hasCambridgeAudio = /Cam\d+-Test\d+-Section\d+\.mp3/i.test(set.audioUrl || '')
  const isExcerpt = isListeningExcerptDrillSet(set)

  for (const question of set.questions) {
    questionCount += 1
    const ok = evidenceInScript(question.evidence, script)
    if (ok) continue

    const item = {
      setId: set.id,
      title: set.title,
      question: question.number,
      evidence: question.evidence.slice(0, 100),
      prompt: question.question.slice(0, 80),
      hasCambridgeAudio,
      isExcerpt
    }
    mismatches.push(item)
    if (hasCambridgeAudio) cambridgeAudioMismatches.push(item)
  }
}

console.log(`Scanned ${ALL_SETS.length} sets, ${questionCount} questions\n`)
console.log(`Evidence not in audioscript: ${mismatches.length}`)
console.log(`With Cambridge MP3 + mismatch: ${cambridgeAudioMismatches.length}\n`)

const bySet = new Map()
for (const item of mismatches) {
  if (!bySet.has(item.setId)) bySet.set(item.setId, [])
  bySet.get(item.setId).push(item)
}

for (const [setId, items] of [...bySet.entries()].sort()) {
  const first = items[0]
  console.log(`- ${setId}`)
  console.log(`  ${first.title}`)
  console.log(`  ${items.length} questions · cambridge audio: ${first.hasCambridgeAudio} · excerpt drill: ${first.isExcerpt}`)
  for (const item of items.slice(0, 3)) {
    console.log(`    Q${item.question}: ${item.evidence}`)
  }
  if (items.length > 3) console.log(`    ... +${items.length - 3} more`)
  console.log('')
}

fs.writeFileSync(
  path.join(root, 'scripts/listening-script-match-audit.json'),
  JSON.stringify({ mismatches, questionCount, setCount: ALL_SETS.length }, null, 2)
)

process.exit(mismatches.length ? 1 : 0)
