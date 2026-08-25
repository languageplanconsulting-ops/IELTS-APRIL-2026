/**
 * Unit test for the personalised "unlock next band" pipeline.
 * Run: node scripts/test-unlock-personalization.mjs
 *
 * Covers:
 *  - filterUnlockRewrites keeps verbatim quotes, drops hallucinated / no-op /
 *    duplicate / empty ones, and caps the list.
 *  - buildChecklistUnlockItems emits personalised (isPersonalized) items when
 *    rewrites exist, and falls back to generic requirement lines when they don't.
 */
import { __testables } from '../server/index.mjs'

const { filterUnlockRewrites, buildChecklistUnlockItems } = __testables

let passed = 0
let failed = 0
const check = (name, cond) => {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}`)
  }
}

// The learner's real transcript (already punctuated).
const transcript =
  'I like reading books because it is fun. My favourite place is my home. ' +
  'I usually go there every day after work to relax.'
const comparableSource = __testables.normalizeForQuoteMatch(transcript)

console.log('filterUnlockRewrites:')

// A mix of good, hallucinated, no-op, duplicate and empty items.
const modelItems = [
  {
    requirement: 'ใช้ complex sentence',
    originalText: 'I like reading books because it is fun.',
    improvedText: 'I am really into reading, mainly because it lets me unwind.',
    reasonThai: 'เพิ่มโครงสร้างซับซ้อนและคำศัพท์'
  },
  {
    // Hallucinated — never said "I hate swimming".
    requirement: 'ยกระดับคำศัพท์',
    originalText: 'I hate swimming in the ocean.',
    improvedText: 'I am not fond of swimming.',
    reasonThai: 'x'
  },
  {
    // No-op — improved is identical to original (ignoring punctuation/case).
    requirement: 'no change',
    originalText: 'My favourite place is my home.',
    improvedText: 'my favourite place is my home',
    reasonThai: 'x'
  },
  {
    // Duplicate of the first original.
    requirement: 'dup',
    originalText: 'I like reading books because it is fun.',
    improvedText: 'Something else entirely.',
    reasonThai: 'x'
  },
  {
    // Valid second item.
    requirement: 'เพิ่มคำเชื่อม',
    originalText: 'I usually go there every day after work to relax.',
    improvedText: 'I tend to head there daily after work, so that I can properly unwind.',
    reasonThai: 'ใช้ so that เชื่อมประโยค'
  },
  {
    // Empty improvedText → dropped.
    requirement: 'empty',
    originalText: 'My favourite place is my home.',
    improvedText: '',
    reasonThai: 'x'
  }
]

const filtered = filterUnlockRewrites(modelItems, comparableSource)
check('keeps only the 2 verbatim, useful rewrites', filtered.length === 2)
check('first kept item is the reading sentence', filtered[0]?.originalText.startsWith('I like reading'))
check('second kept item is the "go there" sentence', filtered[1]?.originalText.startsWith('I usually go there'))
check('drops the hallucinated "swimming" quote', !filtered.some((r) => /swimming/.test(r.originalText)))
check('carries requirement label + reasonThai', Boolean(filtered[0]?.requirement && filtered[0]?.reasonThai))
check('empty items array returns []', filterUnlockRewrites([], comparableSource).length === 0)

// Cap at MAX_UNLOCK_ITEMS (5): build 7 distinct valid sentences.
const longSource =
  'Sentence one alpha. Sentence two beta. Sentence three gamma. Sentence four delta. ' +
  'Sentence five epsilon. Sentence six zeta. Sentence seven eta.'
const longItems = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta'].map((w, i) => ({
  requirement: `r${i}`,
  originalText: `Sentence ${['one', 'two', 'three', 'four', 'five', 'six', 'seven'][i]} ${w}.`,
  improvedText: `A much better sentence number ${i} indeed.`,
  reasonThai: 'ok'
}))
const capped = filterUnlockRewrites(longItems, __testables.normalizeForQuoteMatch(longSource))
check('caps the list at 5 items', capped.length === 5)

console.log('\nbuildChecklistUnlockItems:')

// With rewrites present → personalised items.
const personalised = buildChecklistUnlockItems({
  criterion: 'grammar',
  currentBand: 6,
  testMode: 'part2',
  punctuatedTranscript: transcript,
  questionBreakdown: [],
  plusOnePlan: [],
  unlockRewrites: filtered
})
check('returns one entry per rewrite', personalised.length === filtered.length)
check('every entry is isPersonalized', personalised.every((p) => p.isPersonalized === true))
check(
  'each carries originalText + improvedText (strikethrough + green)',
  personalised.every((p) => p.originalText && p.improvedText)
)
check('reasonThai is preserved for the Thai explanation', personalised[0]?.reasonThai.length > 0)

// With no rewrites → generic fallback, never marked personalised.
const generic = buildChecklistUnlockItems({
  criterion: 'grammar',
  currentBand: 6,
  testMode: 'part2',
  punctuatedTranscript: transcript,
  questionBreakdown: [],
  plusOnePlan: [],
  unlockRewrites: []
})
check('falls back to generic requirement lines', generic.length > 0)
check('fallback items are NOT personalised', generic.every((p) => p.isPersonalized === false))

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
