/**
 * Audit reading exams for MCQ / letter-bank display flaws.
 * Run: node scripts/audit-reading-mcq-display.mjs
 */
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'

const EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
]

const hasEmbeddedMcqOptions = (prompt) => {
  const text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (!text) return false
  if (/\s[A-G]\)\s+/i.test(text)) return true
  if (/\s[A-G]\s+.+\s[B-G]\s+/i.test(text)) return true
  if (/\s[A-G]\s+[A-Za-z"'(]/i.test(text) && text.length > 40) return true
  if (/List of (?:Researchers|Ideas|People|Statements|Companies)/i.test(text)) return true
  return false
}

const isLetterBankSection = (block) => {
  const text = String(block || '')
  if (/match\s+each/i.test(text)) return true
  if (/complete each sentence/i.test(text)) return true
  if (/complete the summary using the list of (?:words|phrases)/i.test(text)) return true
  return false
}

const issues = []

for (const exam of EXAMS) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const sectionText = passage.questionSectionText || ''
    for (const question of passage.questions || []) {
      const prompt = String(question.prompt || '').trim()
      const flaws = []

      if (question.answerType === 'multiple-choice' && hasEmbeddedMcqOptions(prompt)) {
        flaws.push('corrupted-mcq-prompt')
      }

      if (!prompt && question.answerType === 'multiple-choice') {
        const answer = String(question.correctAnswer || '').trim().toUpperCase()
        if (/^[A-J]$/.test(answer) && isLetterBankSection(sectionText)) {
          flaws.push('empty-prompt-letter-bank')
        } else if (/^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(answer)) {
          flaws.push('empty-prompt-heading')
        } else {
          flaws.push('empty-prompt')
        }
      }

      if (
        question.answerType === 'multiple-choice' &&
        /^[A-J]$/i.test(String(question.correctAnswer || '')) &&
        isLetterBankSection(sectionText) &&
        !/choose two letters/i.test(sectionText)
      ) {
        flaws.push('letter-bank-typed-as-mcq')
      }

      if (flaws.length) {
        issues.push({
          exam: exam.id,
          passage: passage.number,
          question: question.number,
          flaws,
          prompt: prompt.slice(0, 120)
        })
      }
    }
  }
}

const byFlaw = {}
for (const issue of issues) {
  for (const flaw of issue.flaws) {
    byFlaw[flaw] = (byFlaw[flaw] || 0) + 1
  }
}

console.log(`Reading MCQ display audit: ${issues.length} question(s) with potential flaws`)
console.log('By flaw type:', byFlaw)

if (issues.length) {
  for (const issue of issues.slice(0, 40)) {
    console.log(
      `- ${issue.exam} P${issue.passage} Q${issue.question}: ${issue.flaws.join(', ')} | ${JSON.stringify(issue.prompt)}`
    )
  }
  if (issues.length > 40) console.log(`... and ${issues.length - 40} more`)
}

process.exit(issues.some((item) => item.flaws.includes('corrupted-mcq-prompt')) ? 1 : 0)
