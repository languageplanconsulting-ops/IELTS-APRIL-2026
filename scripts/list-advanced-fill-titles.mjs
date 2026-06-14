/**
 * List every advanced (Passage 3) exam that has FILL-IN-THE-BLANK (summary/
 * note completion) questions, with the searchable passage title and the blank
 * range + answers. Read-only. Run: node scripts/list-advanced-fill-titles.mjs
 */
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'

const ALL = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
].filter((e) => e.category === 'advanced')

// group consecutive fill-blank (text) question numbers into ranges
const toRanges = (nums) => {
  const sorted = [...nums].sort((a, b) => a - b)
  const ranges = []
  for (const n of sorted) {
    const last = ranges[ranges.length - 1]
    if (last && n === last[1] + 1) last[1] = n
    else ranges.push([n, n])
  }
  return ranges
}

const cleanTitle = (exam, rt) => {
  const passTitle = rt.passages?.[0]?.title || ''
  // exam.title looks like "Cambridge 17 Test 4 Passage 3 - <Real Title>"
  const afterDash = String(exam.title || '').split(' - ').slice(1).join(' - ').trim()
  return (afterDash || passTitle || '').replace(/\s+/g, ' ').trim()
}

console.log('\nADVANCED READING — fill-in-the-blank groups (searchable titles)\n')
console.log('| Cambridge | Passage title (search "<title> IELTS reading") | Blanks | Answers |')
console.log('|---|---|---|---|')

for (const exam of ALL) {
  let rt
  try {
    rt = buildReadingExamPayload(exam)
  } catch {
    continue
  }
  const qs = rt.passages?.[0]?.questions || []
  const fills = qs.filter((q) => q.answerType === 'text')
  if (!fills.length) continue
  const ranges = toRanges(fills.map((q) => q.number))
  const rangeStr = ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(', ')
  const answers = fills
    .sort((a, b) => a.number - b.number)
    .map((q) => `${q.number}:${q.correctAnswer}`)
    .join(', ')
  const m = exam.id.match(/cambridge-(\d+)-test(\d+)/)
  const cam = m ? `C${m[1]} T${m[2]}` : exam.id
  console.log(`| ${cam} | ${cleanTitle(exam, rt)} | ${rangeStr} | ${answers} |`)
}
console.log('')
