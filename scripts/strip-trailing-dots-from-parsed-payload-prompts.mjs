#!/usr/bin/env node
/**
 * Same fix as strip-trailing-dots-from-prompts.mjs, but for books whose
 * parsedPayload cache is load-bearing (raw rawAnswerKey/rawPassageText can't
 * be parsed standalone, so the cache can't just be stripped) — mutates
 * parsedPayload.passages[].questions[].prompt directly instead.
 *
 * Run: node scripts/strip-trailing-dots-from-parsed-payload-prompts.mjs [book...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const args = process.argv.slice(2)
const books = args.filter((a) => /^\d+$/.test(a)).map(Number)
const targetBooks = books.length ? books : []

const NON_FILL_ANSWER = /^(TRUE|FALSE|NOT GIVEN|YES|NO|[A-J]|i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i
const TRAILING_DOTS = /[\s.!?]*(?:…\s*){2,}\s*$/
// A stale cache can also glue an unrelated later section's instructions onto
// the end of a prompt (seen in Cambridge 13 Q23) — cut at the first such marker.
const BLEED_MARKER = /\s+Questions?\s+\d+[\s\S]*$/

let grandTotal = 0

for (const book of targetBooks) {
  const modulePath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(pathToFileURL(modulePath).href)
  const exams = mod[exportName]
  let bookTotal = 0

  const nextExams = exams.map((exam) => {
    const payload = exam.parsedPayload
    if (!payload || !Array.isArray(payload.passages)) return exam

    let examChanged = 0
    const passages = payload.passages.map((passage) => {
      const questions = (passage.questions || []).map((question) => {
        const answer = String(question.correctAnswer || '').trim()
        if (!NON_FILL_ANSWER.test(answer)) return question
        const original = String(question.prompt || '')
        let cleaned = original.replace(BLEED_MARKER, '').trimEnd()
        cleaned = cleaned.replace(TRAILING_DOTS, '').trimEnd()
        if (cleaned === original || !cleaned) return question
        examChanged += 1
        return { ...question, prompt: cleaned }
      })
      return { ...passage, questions }
    })

    if (!examChanged) return exam
    bookTotal += examChanged
    return { ...exam, parsedPayload: { ...payload, passages }, updatedAt: new Date().toISOString() }
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
