#!/usr/bin/env node
/**
 * Sync passage bodies and question sections from PDF extract files
 * (scripts/cambridge-*-passages/ and scripts/cambridge-*-questions/).
 *
 * Updates stored passage text in parsedPayload and rawPassageText while
 * preserving existing question metadata and answer keys.
 *
 * Run:
 *   node scripts/sync-reading-from-pdf-source.mjs           # all books with sources
 *   node scripts/sync-reading-from-pdf-source.mjs 17 11     # specific books
 *   node scripts/sync-reading-from-pdf-source.mjs --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const DRY_RUN = process.argv.includes('--dry-run')
const targetBooks = process.argv.slice(2).map(Number).filter(Boolean)
const books = targetBooks.length ? targetBooks : [11, 13, 14, 15, 16, 17, 19]

const resolveSourcePaths = (book, examId) => {
  const match = examId.match(/^cambridge-(\d+)-test(\d+)-passage(\d+)$/)
  if (!match) return null
  const [, bookNum, test, passage] = match
  if (Number(bookNum) !== book) return null

  if (book === 13) {
    const base = `test${test}-passage${passage}`
    return {
      passagePath: path.join(__dirname, `cambridge-13-passages/${base}.txt`),
      questionPath: path.join(__dirname, `cambridge-13-passages/${base}-questions.txt`)
    }
  }

  const key = `t${test}p${passage}`
  return {
    passagePath: path.join(__dirname, `cambridge-${book}-passages/${key}.txt`),
    questionPath: path.join(__dirname, `cambridge-${book}-questions/${key}.txt`)
  }
}

const cleanPassageBody = (body) => {
  let text = String(body || '')
    .replace(/\r/g, '')
    .replace(/\ba(\d+)\s+The\b/g, 'The')
    .replace(/([a-z])\.([A-Z])/g, '$1. $2')
    .replace(/�eople/g, 'people')
    .replace(/�orld/g, 'world')
    .replace(/�en/g, 'been')
    .replace(/worid/gi, 'world')
    .replace(/enoµgh/gi, 'enough')
    .replace(/gre9tly/gi, 'greatly')
    .replace(/\bTh e\b/g, 'The')
    .replace(/'g ondola/g, "'gondola")
    .replace(/\bg ondola/g, 'gondola')
    .replace(/into\.the/gi, 'into the')
    .replace(/ten ro cwenty/gi, 'ten to twenty')
    .replace(/\bro slow\b/gi, 'to slow')
    .replace(/\bro end\b/gi, 'to end')
    .replace(/\bro its\b/gi, 'to its')
    .replace(/\bro ice-forming\b/gi, 'to ice-forming')
    .replace(/\bco inject\b/gi, 'to inject')
    .replace(/\bche role\b/gi, 'the role')
    .replace(/\bBue will\b/g, 'But will')
    .replace(/\bcwency\b/gi, 'twenty')
  return text
}

const isGarbledQuestionSource = (text) =>
  /AF€|eccssmsniutneenee|csennncnnennennennee|\(\s*\\?\s*SAGE|u�[lI]/i.test(String(text || ''))

const splitParagraphs = (body) => {
  const lines = body.split('\n').map((line) => line.trim()).filter(Boolean)
  if (!lines.length) return []

  const title = lines[0]
  const rest = lines.slice(1).join(' ').trim()
  if (!rest) return [title]

  const chunks = body
    .split('\n')
    .slice(1)
    .join('\n')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  if (chunks.length > 1) return chunks

  const sentences = rest
    .split(/(?<=[.!?]["']?)\s+(?=[A-Z"'(])/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  const kept = sentences.filter((chunk) => chunk.length > 40)
  const joinedKept = kept.join(' ')
  if (!kept.length || joinedKept.length < rest.length * 0.95) return [rest.trim()]
  return kept
}

const normalizeDashes = (text) =>
  String(text || '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[—–]/g, '-')

let totalSynced = 0

for (const book of books) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) {
    console.warn(`Skip Cambridge ${book}: export not found`)
    continue
  }

  const updated = exams.map((exam) => {
    const paths = resolveSourcePaths(book, exam.id)
    if (!paths || !fs.existsSync(paths.passagePath) || !fs.existsSync(paths.questionPath)) {
      return exam
    }

    const passageBody = cleanPassageBody(fs.readFileSync(paths.passagePath, 'utf8'))
    const questionsText = normalizeDashes(fs.readFileSync(paths.questionPath, 'utf8').trim())
    const passageNum = Number(exam.id.match(/passage(\d+)$/)?.[1] || 1)
    const bodyParagraphs = splitParagraphs(passageBody)
    const passageTitle = bodyParagraphs[0]?.split(/\s+/).slice(0, 8).join(' ') || exam.title
    const titleLine = passageBody.split('\n')[0]?.trim() || passageTitle

    const rawPassageText = `READING PASSAGE ${passageNum}\n${titleLine}\n\n${bodyParagraphs.join('\n\n')}\n\n${questionsText}`

    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage) return exam

    const nextPassage = {
      ...passage,
      title: titleLine,
      bodyParagraphs,
      questionSectionText: isGarbledQuestionSource(questionsText)
        ? passage.questionSectionText || questionsText
        : questionsText
    }

    totalSynced += 1
    return {
      ...exam,
      rawPassageText,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [nextPassage, ...(exam.parsedPayload.passages?.slice(1) || [])]
      },
      updatedAt: new Date().toISOString()
    }
  })

  const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  if (!DRY_RUN) {
    fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(updated, null, 2)}\n`, 'utf8')
  }
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Synced Cambridge ${book} from PDF extracts -> ${outputPath}`)
}

console.log(`${DRY_RUN ? 'Would sync' : 'Synced'} ${totalSynced} passage(s) from source files.`)
