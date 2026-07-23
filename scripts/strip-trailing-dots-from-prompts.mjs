#!/usr/bin/env node
/**
 * Remove decorative trailing "… … …" runs glued onto the end of complete
 * (non fill-blank) question prompts — leftover from the original OCR import,
 * pure visual noise since the clue/statement text before them is already
 * whole. Fill-blank prompts are untouched: their "……" IS the blank marker.
 *
 * Operates directly on rawAnswerKey text, then strips any stale parsedPayload
 * cache for exams it touches (buildReadingExamPayload prefers that cache over
 * rawAnswerKey, so leaving it in place would silently discard the edit).
 *
 * Run: node scripts/strip-trailing-dots-from-prompts.mjs [book...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const args = process.argv.slice(2)
const books = args.filter((a) => /^\d+$/.test(a)).map(Number)
const targetBooks = books.length ? books : [11, 12, 13, 14, 15, 16, 17, 19]

const NON_FILL_ANSWER = /^(TRUE|FALSE|NOT GIVEN|YES|NO|[A-J]|i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i
// IMPORTANT: the head's trailing whitespace must NOT cross a newline. If it
// did (greedy \s*), an empty-prompt question (e.g. drag-and-drop headings,
// "Question 27: \n\nCorrect Answer: vi") would have its own blank-line
// separator swallowed into the head group, forcing the lazy prompt capture
// to skip forward and eat the NEXT "Question N:" block whole — silently
// deleting it. (Caught this the hard way: cost Cambridge 11 three questions.)
const BLOCK_RE = /(Question\s+\d+:[ \t]*)([\s\S]*?)(\n\nCorrect Answer:\s*([^\n]+))/g
const TRAILING_DOTS = /[\s.!?]*(?:…\s*){2,}\s*$/
// A stale/OCR-leftover next-section instruction sometimes glued itself onto
// the end, after the dots (e.g. "… … … Questions 10-13 Complete the summary
// using the list of words") — cut that bleed before stripping the dots.
const BLEED_MARKER = /\s+Questions?\s+\d+[\s\S]*$/

let grandTotal = 0

for (const book of targetBooks) {
  const modulePath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(pathToFileURL(modulePath).href)
  const exams = mod[exportName]
  let bookTotal = 0

  const nextExams = exams.map((exam) => {
    let examChanged = 0
    const rawAnswerKey = String(exam.rawAnswerKey || '').replace(BLOCK_RE, (full, head, prompt, tail, answer) => {
      const trimmedAnswer = answer.trim()
      if (!NON_FILL_ANSWER.test(trimmedAnswer)) return full
      let cleaned = prompt.replace(BLEED_MARKER, '').trimEnd()
      cleaned = cleaned.replace(TRAILING_DOTS, '').trimEnd()
      if (cleaned === prompt || !cleaned) return full
      examChanged += 1
      return `${head}${cleaned}${tail}`
    })

    if (!examChanged) return exam
    bookTotal += examChanged
    const { parsedPayload, ...rest } = exam
    return { ...rest, rawAnswerKey, updatedAt: new Date().toISOString() }
  })

  if (!bookTotal) {
    console.log(`Cambridge ${book}: 0 prompts changed`)
    continue
  }
  fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
  console.log(`Cambridge ${book}: cleaned ${bookTotal} prompt(s)`)
  grandTotal += bookTotal
}

console.log(`\nTotal prompts cleaned: ${grandTotal}`)
