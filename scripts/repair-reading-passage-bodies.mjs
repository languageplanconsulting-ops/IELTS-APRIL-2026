#!/usr/bin/env node
/**
 * Restore corrupted passage bodies from git HEAD or PDF/Engnovate sources.
 * Run: node scripts/repair-reading-passage-bodies.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const books = [11, 13, 14, 15, 16, 17, 19]

const isBadBody = (bodyParagraphs) => {
  const body = (bodyParagraphs || []).join(' ')
  if (!body || body.length < 800) return true
  if (/<input|Drop heading|\bform="/i.test(body)) return true
  if (/^\s*['"]?[^'"]+['"]?\s+\d{1,2}Drop heading/i.test(body)) return true
  return false
}

const extractPassageBodyFromRaw = (rawPassageText) => {
  let source = String(rawPassageText || '').replace(/<[^>]+>/g, ' ')
  const markers = [
    source.search(/Questions\s+\d+\s*[-–]\s*\d+/i),
    source.search(/\bDrop heading here/i),
    source.search(/\b(1[4-9]|[27][0-9]|3[0-9]|40)\s*Drop heading here/i)
  ].filter((index) => index >= 0)
  const cut = markers.length ? Math.min(...markers) : -1
  let body = cut >= 0 ? source.slice(0, cut) : source
  body = body
    .replace(/^READING PASSAGE\s+\d+\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  return body
}

const splitBodyParagraphs = (body) => {
  const text = String(body || '').trim()
  if (!text) return []
  const sentences = text
    .split(/(?<=[.!?]["']?)\s+(?=[A-Z"'(])/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
  const kept = sentences.filter((chunk) => chunk.length > 40)
  if (!kept.length || kept.join(' ').length < text.length * 0.95) return [text]
  return kept
}

const loadGitExam = (book, examId) => {
  try {
    const rel = `server/userProvidedReadingPracticeCambridge${book}.mjs`
    const content = execSync(`git show HEAD:${rel}`, { cwd: root, encoding: 'utf8' })
    const match = content.match(new RegExp(`"id": "${examId}"[\\s\\S]*?"bodyParagraphs": \\[([\\s\\S]*?)\\],\\s*"questionSectionText"`))
    if (!match) return null
    const paragraphs = [...match[1].matchAll(/"((?:[^"\\\\]|\\\\.)*)"/g)].map((item) =>
      item[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    )
    return isBadBody(paragraphs) ? null : paragraphs
  } catch {
    return null
  }
}

const loadPdfBody = (book, examId) => {
  const match = examId.match(/^cambridge-\d+-test(\d+)-passage(\d+)$/)
  if (!match) return null
  const [, test, passage] = match
  const filePath =
    book === 13
      ? path.join(__dirname, `cambridge-13-passages/test${test}-passage${passage}.txt`)
      : path.join(__dirname, `cambridge-${book}-passages/t${test}p${passage}.txt`)
  if (!fs.existsSync(filePath)) return null
  const body = fs.readFileSync(filePath, 'utf8').trim()
  if (body.length < 800) return null
  return splitBodyParagraphs(body)
}

const loadImportBody = (book, examId) => {
  const importPath = path.join(root, 'cambridge-reading-imports', `cambridge-${book}-reading-import.json`)
  if (!fs.existsSync(importPath)) return null
  const item = JSON.parse(fs.readFileSync(importPath, 'utf8')).find((entry) => entry.id === examId)
  if (!item?.rawPassageText) return null
  const body = extractPassageBodyFromRaw(item.rawPassageText)
  if (body.length < 800 || /Drop heading here|<input/i.test(body)) return null
  return splitBodyParagraphs(body)
}

let repaired = 0

for (const book of books) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let touched = false
  const nextExams = exams.map((exam) => {
    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage || !isBadBody(passage.bodyParagraphs)) return exam

    const replacement =
      loadGitExam(book, exam.id) ||
      loadImportBody(book, exam.id) ||
      loadPdfBody(book, exam.id)
    if (!replacement?.length) {
      console.warn(`Could not repair ${exam.id}`)
      return exam
    }

    repaired += 1
    touched = true
    const passageNum = Number(exam.id.match(/passage(\d+)$/)?.[1] || 1)
    const questionSectionText = passage.questionSectionText || ''
    const rawPassageText = `READING PASSAGE ${passageNum}\n${replacement[0]?.slice(0, 80) || passage.title}\n\n${replacement.join('\n\n')}\n\n${questionSectionText}`

    return {
      ...exam,
      rawPassageText,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [{ ...passage, bodyParagraphs: replacement }]
      },
      updatedAt: new Date().toISOString()
    }
  })

  if (touched) {
    fs.writeFileSync(
      path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`),
      `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`,
      'utf8'
    )
    console.log(`Repaired passage bodies for Cambridge ${book}`)
  }
}

console.log(`Repaired ${repaired} corrupted passage body/bodies.`)
