#!/usr/bin/env node
/**
 * Export every Normal Reading exam as a self-contained markdown review file.
 * One file per passage; designed to be opened in Claude Code so an LLM can
 * verify each passage + question + answer against the original Cambridge
 * source (publicly available online IELTS practice sites) and output a
 * structured findings.json.
 *
 * Run: node scripts/export-reading-for-review.mjs
 * Output: review/<examId>.md  (one file per passage)
 *         review/INDEX.md     (links to every file)
 */

import fs from 'node:fs'
import path from 'node:path'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const EXAM_SOURCES = [
  ['cambridge11', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS],
  ['cambridge12', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS],
  ['cambridge13', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS],
  ['cambridge14', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS],
  ['cambridge15', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS],
  ['cambridge16', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS],
  ['cambridge17', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS],
  ['cambridge19', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS],
  ['june2026', USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS]
]

const REVIEW_DIR = path.join(process.cwd(), 'review')
if (!fs.existsSync(REVIEW_DIR)) fs.mkdirSync(REVIEW_DIR, { recursive: true })

const indexLines = ['# Reading audit — review file index', '']
let totalFiles = 0

const formatQuestion = (question) => {
  const out = []
  out.push(`### Q${question.number}`)
  out.push('')
  out.push(`- **answerType:** \`${question.answerType || 'text'}\``)
  out.push(`- **prompt:** ${JSON.stringify(question.prompt || '')}`)
  if (Array.isArray(question.options) && question.options.length) {
    out.push(`- **options:**`)
    for (const option of question.options) {
      const letter = option?.letter || option?.key || option?.label || '?'
      const text = option?.text || option?.label || ''
      out.push(`  - **${letter}.** ${text}`)
    }
  }
  if (question.instruction) {
    out.push(`- **instruction:** ${JSON.stringify(question.instruction)}`)
  }
  out.push(`- **currentAnswer:** \`${question.correctAnswer || ''}\``)
  if (Array.isArray(question.acceptedAnswers) && question.acceptedAnswers.length > 1) {
    out.push(`- **acceptedAnswers:** ${question.acceptedAnswers.join(' | ')}`)
  }
  if (question.exactPortion) {
    out.push(`- **exactPortion (current claim):** ${JSON.stringify(question.exactPortion)}`)
  }
  out.push('')
  return out.join('\n')
}

const exportExam = (book, exam) => {
  let payload
  try {
    payload = buildReadingExamPayload({
      ...exam,
      parsedPayload: exam.parsedPayload || exam.parsed_payload
    })
  } catch (error) {
    console.warn(`Skipping ${exam.id}: ${error.message}`)
    return
  }

  for (const passage of payload.passages || []) {
    const fileName = `${book}__${exam.id}__p${passage.number}.md`
    const filePath = path.join(REVIEW_DIR, fileName)

    const lines = []
    lines.push(`# ${exam.id} — Passage ${passage.number}`)
    lines.push('')
    lines.push(`**Title:** ${passage.title || '(none)'}`)
    lines.push(`**Source:** ${exam.title}`)
    lines.push(`**Category:** ${exam.category}`)
    lines.push(`**Question range:** ${passage.questions?.[0]?.number || '?'}–${passage.questions?.[passage.questions.length - 1]?.number || '?'} (${passage.questions?.length || 0} questions)`)
    lines.push('')
    lines.push(`---`)
    lines.push('')
    lines.push(`## Passage body (current)`)
    lines.push('')
    if (Array.isArray(passage.bodyParagraphs) && passage.bodyParagraphs.length) {
      for (const paragraph of passage.bodyParagraphs) {
        lines.push(paragraph)
        lines.push('')
      }
    } else {
      lines.push('*(no paragraphs)*')
      lines.push('')
    }
    lines.push(`---`)
    lines.push('')
    lines.push(`## Question section (raw, as shown to student)`)
    lines.push('')
    lines.push('```')
    lines.push(passage.questionSectionText || '(none)')
    lines.push('```')
    lines.push('')
    lines.push(`---`)
    lines.push('')
    lines.push(`## Questions (with current answer keys)`)
    lines.push('')
    for (const question of passage.questions || []) {
      lines.push(formatQuestion(question))
    }
    lines.push(`---`)
    lines.push('')
    lines.push(`## Verification checklist for the reviewer`)
    lines.push('')
    lines.push(`1. **Passage completeness** — Does the passage above appear complete? Watch for:`)
    lines.push(`   - OCR corruption (e.g., "�eople", "enoµgh", "worid's", "gre9tly")`)
    lines.push(`   - Hyphenation artifacts ("Single­ storey", "non­ edible")`)
    lines.push(`   - Missing paragraphs or truncated sentences`)
    lines.push(`   - Run-on lines that should be separate sentences`)
    lines.push(`2. **Question alignment with real IELTS** — For each question:`)
    lines.push(`   - Compare with the original Cambridge ${book.replace('cambridge', '')} source (search "${exam.title}" on mini-ielts.com / ielts-mentor.com / engexam.info)`)
    lines.push(`   - Verify the prompt wording matches the official version`)
    lines.push(`   - Verify the correct answer matches the official key`)
    lines.push(`   - For MCQ: confirm the option set matches the original`)
    lines.push(`3. **Answer-key sanity** — For each:`)
    lines.push(`   - TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN spelling exactly correct`)
    lines.push(`   - For fill-blank: word count respects the instruction's cap`)
    lines.push(`   - For matching headings: the heading letter is valid for this passage`)
    lines.push('')
    lines.push(`## Reviewer output format`)
    lines.push('')
    lines.push(`If you find issues, append to **../findings.json** an entry per issue:`)
    lines.push('')
    lines.push('```json')
    lines.push('{')
    lines.push(`  "examId": "${exam.id}",`)
    lines.push(`  "passageNumber": ${passage.number},`)
    lines.push(`  "questionNumber": <Q# or null for passage-text issues>,`)
    lines.push(`  "kind": "passage_ocr" | "passage_truncated" | "wrong_prompt" | "wrong_answer" | "wrong_options" | "missing_paragraph" | "other",`)
    lines.push(`  "currentValue": "<what's there now>",`)
    lines.push(`  "suggestedValue": "<what it should be>",`)
    lines.push(`  "source": "<URL of the IELTS practice site or PDF you verified against>",`)
    lines.push(`  "reasoning": "<one-sentence why>",`)
    lines.push(`  "confidence": "high" | "medium" | "low"`)
    lines.push('}')
    lines.push('```')
    lines.push('')
    lines.push(`Only mark confidence=high when you've verified against a source you can cite.`)

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
    indexLines.push(`- [${exam.id} — P${passage.number}](./${fileName})`)
    totalFiles += 1
  }
}

for (const [book, exams] of EXAM_SOURCES) {
  for (const exam of exams) {
    exportExam(book, exam)
  }
}

fs.writeFileSync(path.join(REVIEW_DIR, 'INDEX.md'), indexLines.join('\n'), 'utf8')

// Empty findings file the reviewer appends to.
const findingsPath = path.join(process.cwd(), 'findings.json')
if (!fs.existsSync(findingsPath)) {
  fs.writeFileSync(findingsPath, '[]\n', 'utf8')
}

console.log(`Exported ${totalFiles} review files to ${REVIEW_DIR}/`)
console.log(`Index: ${REVIEW_DIR}/INDEX.md`)
console.log(`Empty findings file ready at: ${findingsPath}`)
console.log('')
console.log('Next: open Claude Code in this folder and run /audit-reading.')
