/**
 * Rebuild stored parsedPayload (and clean rawPassageText) for all Cambridge reading books.
 * Run: node scripts/rebuild-cambridge-reading-parsed-payloads.mjs [bookNumbers...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const defaultBooks = [11, 12, 13, 14, 15, 16, 17, 19]
const books = process.argv.slice(2).map(Number).filter(Boolean)
const targetBooks = books.length ? books : defaultBooks

const cleanRawPassageText = (value) =>
  String(value || '')
    .replace(/\r/g, '')
    .replace(/[\t ]*\n[\t ]*<(?:form|input|div|span|script)\b[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/gi, '\n')
    .replace(/[\t ]*<(?:form|input|div|span|script)\b[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/gi, '')
    .replace(/^\d+Drop heading here<input[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/im, '')
    .trim()

const GARBAGE =
  /drop heading here|drop answer here|<input|<form\b|<div\b|<span\b|<script\b|drag and drop an option|hidden"\s*form=/i

for (const book of targetBooks) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const sourceExams = mod[exportName]
  if (!Array.isArray(sourceExams)) {
    console.error(`Skip Cambridge ${book}: export ${exportName} not found`)
    continue
  }

  const exams = sourceExams.map((exam) => {
    const rawPassageText = cleanRawPassageText(exam.rawPassageText)
    const base = {
      id: exam.id,
      title: exam.title,
      category: exam.category,
      rawPassageText,
      rawAnswerKey: exam.rawAnswerKey,
      createdAt: exam.createdAt || '2026-05-22T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    }
    const parsedPayload = buildReadingExamPayload(base)
    return { ...base, parsedPayload }
  })

  let issues = 0
  for (const exam of exams) {
    for (const passage of exam.parsedPayload?.passages || []) {
      for (const paragraph of passage.bodyParagraphs || []) {
        if (GARBAGE.test(paragraph)) issues += 1
      }
      for (const question of passage.questions || []) {
        if (GARBAGE.test(question.prompt || '')) issues += 1
      }
    }
  }

  if (issues > 0) {
    console.error(`Cambridge ${book}: rebuild still has ${issues} garbage item(s)`)
    process.exitCode = 1
    continue
  }

  const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(exams, null, 2)}\n`, 'utf8')
  const questionCount = exams.reduce(
    (sum, exam) => sum + (exam.parsedPayload?.passages?.[0]?.questions?.length || 0),
    0
  )
  console.log(`Rebuilt Cambridge ${book}: ${exams.length} exams, ${questionCount} questions -> ${outputPath}`)
}
