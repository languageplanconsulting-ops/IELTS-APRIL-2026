/**
 * Pre-generates (warms) Deepgram TTS audio for every Listening section so learners
 * never trigger a live "generate on first play" delay — the exam UI already checks
 * the Supabase-backed audio cache before calling Deepgram, this script just fills it.
 *
 * Mirrors the exact cacheKey/topicId/section/text values that
 * playListeningFoundationPassage() and playListeningFullTestSection() in src/App.tsx
 * send to POST /api/tts/listening-section-audio, so the cache the app reads at
 * runtime is a hit as soon as this script has run.
 *
 * Usage:
 *   npx vite-node scripts/warm-listening-audio-cache.mjs -- [--dry-run] [--force] [--api-base=URL] [--batch-size=10] [--delay-ms=400]
 *
 * Must run via vite-node (not tsx/node) because src/listeningPart1FromWorkbook.ts
 * uses a Vite-only `?raw` markdown import that plain Node ESM/tsx cannot resolve.
 *
 * Env:
 *   ADMIN_PANEL_CODE (default: englishplanforeover) — must match the server's ADMIN_PANEL_CODE
 *   APP_BASE_URL (default: https://www.englishplan-ielts.com)
 */

import { LISTENING_PART1_FOUNDATION_SETS } from '../src/listeningPart1FromWorkbook.ts'
import { LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationData.ts'
import { CAMBRIDGE_12_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge12Data.ts'
import { CAMBRIDGE_13_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge13Data.ts'
import { CAMBRIDGE_17_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge17Data.ts'
import { CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridgeSafeData.ts'
import { resolveListeningFoundationAudioscript } from '../src/listeningFoundationAudioscript.ts'
import { parseListeningScriptSegments } from '../src/listeningScriptReader.ts'
import { LISTENING_FULL_TEST_BOOKS, FULL_TESTS_PER_BOOK, getFullTestSectionSets } from '../src/listeningFullTestData.ts'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const apiBaseArg = args.find((arg) => arg.startsWith('--api-base='))
const batchSizeArg = args.find((arg) => arg.startsWith('--batch-size='))
const delayArg = args.find((arg) => arg.startsWith('--delay-ms='))

const API_BASE = (apiBaseArg ? apiBaseArg.slice('--api-base='.length) : process.env.APP_BASE_URL || 'https://www.englishplan-ielts.com').replace(/\/$/, '')
const BATCH_SIZE = Math.max(1, Math.min(20, Number(batchSizeArg?.slice('--batch-size='.length)) || 10))
const DELAY_MS = Math.max(0, Number(delayArg?.slice('--delay-ms='.length)) || 400)
const ADMIN_CODE = String(process.env.ADMIN_PANEL_CODE || 'englishplanforeover').trim()
const AUTH = `Bearer admin-code:${ADMIN_CODE}`

// Mirrors ALL_LISTENING_FOUNDATION_SETS in src/App.tsx exactly.
const ALL_LISTENING_FOUNDATION_SETS = [
  ...LISTENING_PART1_FOUNDATION_SETS,
  ...LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced'),
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced'),
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced'),
]

// Mirrors getListeningFoundationAudioCacheKey() in src/App.tsx.
const getListeningFoundationAudioCacheKey = (set) => set.audioCacheKey || `listening-foundation-${set.id}`

// Mirrors the activeListeningFoundationScriptText useMemo in src/App.tsx.
const computeFoundationScriptText = (set) => {
  const resolvedScript = resolveListeningFoundationAudioscript(set)
  if (resolvedScript.trim()) return resolvedScript
  const uniquePassages = Array.from(new Set(set.questions.map((q) => q.passage.trim()).filter(Boolean)))
  return uniquePassages.join(' ') || set.questions[0]?.passage || ''
}

// Mirrors the activeListeningFullTestScriptText useMemo in src/App.tsx.
const computeFullTestScriptText = (set) => {
  const resolvedScript = resolveListeningFoundationAudioscript(set)
  if (resolvedScript.trim()) return resolvedScript
  return set.questions[0]?.passage || ''
}

const toAudioItem = ({ cacheKey, set, scriptText }) => {
  const text = (scriptText || set.questions[0]?.passage || '').trim()
  if (!text) return null
  return {
    cacheKey,
    text,
    section: `listening-section-${set.section}`,
    topicId: set.id,
    topicTitle: set.title
  }
}

const buildAllAudioItems = () => {
  const items = []
  const seenCacheKeys = new Set()

  for (const set of ALL_LISTENING_FOUNDATION_SETS) {
    const cacheKey = getListeningFoundationAudioCacheKey(set)
    if (seenCacheKeys.has(cacheKey)) continue
    seenCacheKeys.add(cacheKey)
    const item = toAudioItem({ cacheKey, set, scriptText: computeFoundationScriptText(set) })
    if (item) items.push(item)
    else console.warn(`skip (no script text): foundation ${set.id}`)
  }

  for (const bookNumber of LISTENING_FULL_TEST_BOOKS) {
    for (let testNumber = 1; testNumber <= FULL_TESTS_PER_BOOK; testNumber += 1) {
      for (const set of getFullTestSectionSets(bookNumber, testNumber)) {
        const cacheKey = `listening-full-test-${set.id}`
        if (seenCacheKeys.has(cacheKey)) continue
        seenCacheKeys.add(cacheKey)
        const item = toAudioItem({ cacheKey, set, scriptText: computeFullTestScriptText(set) })
        if (item) items.push(item)
        else console.warn(`skip (no script text): full-test ${set.id}`)
      }
    }
  }

  return items
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const generateBatch = async (items) => {
  const res = await fetch(`${API_BASE}/api/admin/tts/generate`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ items, force })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`batch failed (${res.status}): ${text.slice(0, 300)}`)
  }
  return res.json()
}

const chunk = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const main = async () => {
  const items = buildAllAudioItems()
  const totalChars = items.reduce((sum, item) => sum + item.text.length, 0)

  console.log(`API: ${API_BASE}`)
  console.log(dryRun ? 'DRY RUN — no requests will be sent' : force ? 'LIVE — will regenerate ALL items (force)' : 'LIVE — will generate only missing/uncached items')
  console.log(`Listening sections to warm: ${items.length} (${totalChars.toLocaleString()} script chars total)\n`)

  if (dryRun) {
    for (const item of items) {
      console.log(`  ${item.section.padEnd(20)} ${item.cacheKey.padEnd(45)} ${item.text.length}ch`)
    }
    return
  }

  let generated = 0
  let cached = 0
  let failed = 0
  const failures = []

  for (const batch of chunk(items, BATCH_SIZE)) {
    try {
      const { items: results } = await generateBatch(batch)
      for (const result of results) {
        if (result.cached) cached += 1
        else generated += 1
      }
      console.log(`batch of ${batch.length}: ok (${results.filter((r) => !r.cached).length} generated, ${results.filter((r) => r.cached).length} cached)`)
    } catch (error) {
      console.warn(`batch of ${batch.length} failed, retrying items individually: ${error.message}`)
      for (const item of batch) {
        try {
          const { items: results } = await generateBatch([item])
          const [result] = results
          if (result.cached) cached += 1
          else generated += 1
          console.log(`  ${item.cacheKey}: ${result.cached ? 'cached' : 'generated'}`)
        } catch (itemError) {
          failed += 1
          failures.push({ cacheKey: item.cacheKey, error: itemError.message })
          console.error(`  ${item.cacheKey}: FAILED — ${itemError.message}`)
        }
        await sleep(DELAY_MS)
      }
    }
    await sleep(DELAY_MS)
  }

  console.log(`\nDone. generated=${generated} cached=${cached} failed=${failed} total=${items.length}`)
  if (failures.length) {
    console.log('\nFailures:')
    for (const failure of failures) console.log(`  ${failure.cacheKey}: ${failure.error}`)
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
