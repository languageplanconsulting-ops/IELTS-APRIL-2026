/**
 * Audit Thai explanations for Full Reading books (Cambridge 11–17, 19).
 * Run: npx tsx scripts/audit-reading-full-test-explanations.mjs
 */
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { READING_FULL_TEST_BOOKS } from '../src/readingFullTestData.ts'
import { isWeakReadingExplanation } from './reading-explanation-criteria.mjs'

const books = READING_FULL_TEST_BOOKS
const failures = []
let total = 0

for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[`USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`]
  let bookWeak = 0

  for (const exam of exams) {
    const parsed = buildReadingExamPayload(exam)
    for (const passage of parsed.passages || []) {
      for (const question of passage.questions || []) {
        total += 1
        const reason = isWeakReadingExplanation(question)
        if (reason) {
          bookWeak += 1
          failures.push({
            book,
            exam: exam.id,
            q: question.number,
            reason,
            explanation: question.explanationThai?.slice(0, 80)
          })
        }
      }
    }
  }
  console.log(`Cambridge ${book}: ${bookWeak} weak / ${exams.length * 13 + (exams.filter((e) => e.id.includes('passage3')).length * 1)} questions checked`)
}

console.log(`\nTotal questions: ${total}`)
console.log(`Weak explanations: ${failures.length}`)

if (failures.length) {
  console.error('\nSample issues:')
  for (const f of failures.slice(0, 25)) {
    console.error(`  cam${f.book} ${f.exam} Q${f.q}: ${f.reason}`)
  }
  process.exit(1)
}

console.log('All Full Reading explanations meet criteria.')
