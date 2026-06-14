/**
 * Flag advanced (Passage 3) FILL-IN-THE-BLANK questions whose answer does not
 * actually appear in its own evidence sentence (exactPortion) — the strongest
 * internal signal that the question/evidence was copied inaccurately.
 * Read-only. Run: node scripts/audit-advanced-fill-consistency.mjs
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

const ADVANCED_EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
].filter((exam) => exam.category === 'advanced')

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[‘’“”'".,!?;:()\[\]{}\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const flags = []
let fillTotal = 0

for (const exam of ADVANCED_EXAMS) {
  let runtime
  try {
    runtime = buildReadingExamPayload(exam)
  } catch (error) {
    flags.push({ id: exam.id, q: '-', kind: 'parse_error', detail: error.message })
    continue
  }
  const passage = runtime.passages?.[0]
  if (!passage) continue
  const bodyNorm = norm((passage.bodyParagraphs || []).join(' '))

  for (const q of passage.questions || []) {
    if (q.answerType !== 'text') continue
    fillTotal += 1
    const answers = [q.correctAnswer, ...(q.acceptedAnswers || [])].filter(Boolean)
    const evidenceNorm = norm(q.exactPortion)
    const answerInEvidence = answers.some((a) => evidenceNorm.includes(norm(a)))
    const answerInBody = answers.some((a) => bodyNorm.includes(norm(a)))
    const evidenceInBody = evidenceNorm.length > 12 && bodyNorm.includes(evidenceNorm.slice(0, 60))

    const reasons = []
    if (!q.exactPortion || evidenceNorm.length < 8) reasons.push('evidence_missing')
    else if (!answerInEvidence) reasons.push('answer_not_in_evidence')
    if (!answerInBody) reasons.push('answer_not_in_passage')
    if (q.exactPortion && evidenceNorm.length >= 12 && !evidenceInBody) reasons.push('evidence_not_in_passage')
    if (!q.prompt || norm(q.prompt).length < 4) reasons.push('prompt_empty')

    if (reasons.length) {
      flags.push({
        id: exam.id,
        q: q.number,
        answer: q.correctAnswer,
        reasons,
        prompt: String(q.prompt || '').slice(0, 90),
        evidence: String(q.exactPortion || '').slice(0, 90)
      })
    }
  }
}

console.log(`\nAdvanced fill-blank questions checked: ${fillTotal}`)
console.log(`Flagged: ${flags.length}\n`)
const byExam = {}
for (const f of flags) (byExam[f.id] ||= []).push(f)
for (const id of Object.keys(byExam)) {
  console.log(`■ ${id}`)
  for (const f of byExam[id]) {
    console.log(`   Q${f.q}  [${f.reasons.join(', ')}]  answer="${f.answer}"`)
    console.log(`      prompt:   ${f.prompt}`)
    console.log(`      evidence: ${f.evidence}`)
  }
  console.log('')
}
