import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'

const EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS
]

const isBadPrompt = (question) => {
  const prompt = String(question.prompt || '').trim()
  if (!prompt) return 'empty prompt'
  if (/^Question\s+\d+$/i.test(prompt)) return 'generic Question X prompt'
  if (/^(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):/im.test(prompt)) {
    return 'answer-key metadata leaked into prompt'
  }
  return ''
}

const failures = []
let textAnswerCount = 0
let totalQuestionCount = 0

for (const exam of EXAMS) {
  const parsedPayload = buildReadingExamPayload(exam)
  for (const passage of parsedPayload.passages || []) {
    for (const question of passage.questions || []) {
      totalQuestionCount += 1
      if (question.answerType === 'text') textAnswerCount += 1
      const reason = isBadPrompt(question)
      if (reason) {
        failures.push({
          exam: exam.title,
          passage: passage.number,
          question: question.number,
          answerType: question.answerType,
          reason,
          prompt: question.prompt
        })
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Reading prompt verification failed:')
  for (const failure of failures) {
    console.error(
      `- ${failure.exam} | Passage ${failure.passage} | Q${failure.question} | ${failure.answerType} | ${failure.reason}: ${JSON.stringify(failure.prompt)}`
    )
  }
  process.exit(1)
}

console.log(
  `Reading prompt verification passed: ${totalQuestionCount} questions checked, including ${textAnswerCount} text/fill answers.`
)
