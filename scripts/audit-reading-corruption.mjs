import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'
import { USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS } from '../server/userProvidedReadingPracticeGeneralTraining.mjs'
import { USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS } from '../server/userProvidedReadingPracticeCustom.mjs'

const EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS
]

const GARBAGE = /BO\s*DEW\s*THAT|BO\|DE THI THAT|BOIDUJDOAN|<input|Drop heading here|Drop answer here|drag and drop an option|HHHHHHHH|Questions?\s+\d+[-–]\d+.{0,200}Questions?\s+\d+[-–]\d+/i

const issues = []

const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean)

for (const exam of EXAMS) {
  const passages = exam.parsedPayload?.passages || []
  for (const passage of passages) {
    const title = String(passage.title || '')
    const body0 = String(passage.bodyParagraphs?.[0] || '')

    if (GARBAGE.test(title)) {
      issues.push({ exam: exam.id, kind: 'title-garbage', detail: title })
    }

    // Overlap heuristic: does title's tail duplicate body's head, or does
    // body start mid-phrase (leading lowercase / stray punctuation) as if a
    // lead-in clause got stolen into the title?
    const titleWords = words(title)
    const bodyWords = words(body0)
    if (titleWords.length >= 4 && bodyWords.length >= 4) {
      // Check if the last 3+ words of title reappear as the first 3+ words of body.
      for (let n = Math.min(8, titleWords.length); n >= 3; n--) {
        const titleTail = titleWords.slice(-n).join(' ').toLowerCase()
        const bodyHead = bodyWords.slice(0, n).join(' ').toLowerCase()
        if (titleTail === bodyHead) {
          issues.push({ exam: exam.id, kind: 'title-body-duplicate-overlap', detail: `title="${title}" body starts="${bodyWords.slice(0, 12).join(' ')}"` })
          break
        }
      }
    }
    if (/^[,;:.\)\]]/.test(body0.trim())) {
      issues.push({ exam: exam.id, kind: 'body-starts-with-stray-punctuation', detail: body0.slice(0, 80) })
    }

    for (const question of passage.questions || []) {
      const prompt = String(question.prompt || '')
      if (GARBAGE.test(prompt)) {
        issues.push({ exam: exam.id, kind: 'prompt-garbage', detail: `Q${question.number}: ${prompt}` })
      }
      if (prompt.length > 220) {
        issues.push({ exam: exam.id, kind: 'prompt-suspiciously-long', detail: `Q${question.number} (${prompt.length} chars): ${prompt.slice(0, 160)}...` })
      }
    }
  }
}

if (!issues.length) {
  console.log(`No corruption patterns found across ${EXAMS.length} exams.`)
  process.exit(0)
}

console.log(`Found ${issues.length} potential issues across ${EXAMS.length} exams:\n`)
for (const issue of issues) {
  console.log(`[${issue.kind}] ${issue.exam}\n  ${issue.detail}\n`)
}
