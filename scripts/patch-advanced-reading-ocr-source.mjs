/**
 * Patch OCR garbage in advanced reading source data (server .mjs files).
 * Run: npx tsx scripts/patch-advanced-reading-ocr-source.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  fixCommonReadingOcrTypos,
  patchAdvancedReadingPassageSource,
  patchAdvancedReadingRawAnswerKeyPrompt,
  rebuildAdvancedReadingRawPassageText,
  sanitizeReadingQuestionSectionTextForDisplay,
  stripGarbledOcrFromReadingText
} from '../src/readingOcrCleanup.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const BOOKS = [11, 12, 13, 14, 15, 16, 17, 19]

const parseQuestionPromptsFromTxt = (text) => {
  const prompts = new Map()
  for (const line of String(text || '').split('\n')) {
    const trimmed = line.trim()
    const match = trimmed.match(/^(\d+)\.?\s+(.+)$/)
    if (!match) continue
    const number = Number(match[1])
    const prompt = match[2].trim()
    if (prompt.length >= 8) prompts.set(number, prompt)
  }
  return prompts
}

const resolveQuestionTxtPath = (examId) => {
  const match = examId.match(/^cambridge-(\d+)-test(\d+)-passage3$/)
  if (!match) return null

  const candidates = [
    path.join(root, 'scripts', `cambridge-${match[1]}-questions`, `t${match[2]}p3.txt`),
    path.join(
      root,
      'scripts',
      `cambridge-${match[1]}-passages`,
      `test${match[2]}-passage3-questions.txt`
    ),
    path.join(root, 'scripts', `cambridge-${match[1]}-passages`, `t${match[2]}p3.txt`)
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

const loadCleanQuestionSectionFromTxt = (examId) => {
  const txtPath = resolveQuestionTxtPath(examId)
  if (!txtPath) return null
  return sanitizeReadingQuestionSectionTextForDisplay(
    stripGarbledOcrFromReadingText(fs.readFileSync(txtPath, 'utf8'))
  )
}

let totalPatchedExams = 0

for (const book of BOOKS) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const modulePath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  const mod = await import(pathToFileURL(modulePath).href)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) {
    console.warn(`Skip Cambridge ${book}: export not found`)
    continue
  }

  let bookPatches = 0

  const nextExams = exams.map((exam) => {
    if (exam.category !== 'advanced') return exam

    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage) return exam

    const questionTxtPath = resolveQuestionTxtPath(exam.id)
    const txtPrompts = questionTxtPath
      ? parseQuestionPromptsFromTxt(fs.readFileSync(questionTxtPath, 'utf8'))
      : new Map()
    const cleanQuestionSection = loadCleanQuestionSectionFromTxt(exam.id)

    patchAdvancedReadingPassageSource(passage)

    if (cleanQuestionSection) {
      passage.questionSectionText = cleanQuestionSection
    }

    for (const question of passage.questions || []) {
      const txtPrompt = txtPrompts.get(question.number)
      if (txtPrompt && txtPrompt.length > String(question.prompt || '').length) {
        question.prompt = txtPrompt.replace(/\s+/g, ' ').trim()
      }
    }

    let rawAnswerKey = exam.rawAnswerKey || ''
    for (const question of passage.questions || []) {
      rawAnswerKey = patchAdvancedReadingRawAnswerKeyPrompt(
        rawAnswerKey,
        question.number,
        question.prompt || ''
      )
    }

    const rawPassageText = fixCommonReadingOcrTypos(
      rebuildAdvancedReadingRawPassageText(exam.title, passage)
    )

    bookPatches += 1
    return {
      ...exam,
      rawPassageText,
      rawAnswerKey,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [{ ...passage }]
      },
      updatedAt: new Date().toISOString()
    }
  })

  if (bookPatches > 0) {
    fs.writeFileSync(
      modulePath,
      `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`,
      'utf8'
    )
    totalPatchedExams += bookPatches
    console.log(`Patched Cambridge ${book}: ${bookPatches} advanced exam(s)`)
  }
}

console.log(`Done. Patched ${totalPatchedExams} advanced reading exam(s).`)
