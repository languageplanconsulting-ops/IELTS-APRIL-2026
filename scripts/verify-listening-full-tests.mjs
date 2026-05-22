/**
 * Verify full listening test catalog: 5 books × 4 tests × 40 questions = 20 exams.
 * Also checks Thai explanations follow enrichment rules (paraphrase bridge, not bare "คำตอบคือ").
 * Run: npx tsx scripts/verify-listening-full-tests.mjs
 */
import {
  FULL_TESTS_PER_BOOK,
  LISTENING_FULL_TEST_BOOKS,
  TOTAL_FULL_LISTENING_TESTS,
  getFullTestSectionSets,
  validateFullListeningTestCatalog
} from '../src/listeningFullTestData.ts'

const { ok, errors } = validateFullListeningTestCatalog()

const isWeakExplanation = (text) => {
  const value = String(text || '').trim()
  if (!value) return true
  if (/^คำตอบคือ [A-G]\.?$/i.test(value)) return true
  if (/^คำตอบคือ "/.test(value) && !/ในโจทย์|โจทย์/.test(value)) return true
  return false
}

const explanationErrors = []
for (const book of LISTENING_FULL_TEST_BOOKS) {
  for (let test = 1; test <= FULL_TESTS_PER_BOOK; test += 1) {
    for (const set of getFullTestSectionSets(book, test)) {
      for (const question of set.questions) {
        if (isWeakExplanation(question.explanationThai)) {
          explanationErrors.push(`${set.id} Q${question.number}: weak explanation`)
        }
      }
    }
  }
}

console.log(
  `Full listening tests: ${LISTENING_FULL_TEST_BOOKS.length} books × ${FULL_TESTS_PER_BOOK} tests = ${TOTAL_FULL_LISTENING_TESTS} exams`
)

if (!ok) {
  console.error(`Catalog validation failed (${errors.length} issue(s)):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

if (explanationErrors.length) {
  console.error(`Explanation validation failed (${explanationErrors.length} issue(s)):`)
  for (const error of explanationErrors.slice(0, 20)) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`All ${TOTAL_FULL_LISTENING_TESTS} full listening tests are complete (40 questions each).`)
console.log('All Thai explanations follow the paraphrase-bridge format.')
