#!/usr/bin/env node
/**
 * Update question prompts from Cambridge source question files and rawAnswerKey.
 * Run: node scripts/reconcile-reading-prompts-from-source.mjs [bookNumbers...]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const books = process.argv.slice(2).map(Number).filter(Boolean).length
  ? process.argv.slice(2).map(Number).filter(Boolean)
  : [11, 13, 14, 15, 16, 17, 19]

const resolveSourcePaths = (book, examId) => {
  const match = examId.match(/^cambridge-(\d+)-test(\d+)-passage(\d+)$/)
  if (!match) return null
  const [, bookNum, test, passage] = match
  if (Number(bookNum) !== book) return null
  if (book === 13) {
    const base = `test${test}-passage${passage}`
    return path.join(__dirname, `cambridge-13-passages/${base}-questions.txt`)
  }
  return path.join(__dirname, `cambridge-${book}-questions/t${test}p${passage}.txt`)
}

const parseReferencePrompts = (questionText) => {
  const prompts = new Map()
  const lines = String(questionText || '').replace(/\r/g, '').split('\n')
  let currentNum = null
  let current = ''

  const flush = () => {
    if (currentNum !== null && current.trim()) {
      prompts.set(currentNum, current.trim().replace(/\s+/g, ' '))
    }
    currentNum = null
    current = ''
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^Questions?\s+\d/i.test(trimmed) || /^Complete the/i.test(trimmed) || /^Choose /i.test(trimmed)) {
      flush()
      continue
    }
    const numbered =
      trimmed.match(/^(\d{1,2})\.\s*(.+)$/) ||
      trimmed.match(/^(\d{1,2})\s+([A-Za-z"'(].*)$/) ||
      trimmed.match(/^(\d{1,2})\s+(TRUE|FALSE|NOT GIVEN|YES|NO)\b/i)
    if (numbered) {
      flush()
      currentNum = Number(numbered[1])
      current = numbered[2] || ''
      continue
    }
    if (currentNum !== null && !/^List of /i.test(trimmed) && !/^[A-J]\s/.test(trimmed)) {
      current += ` ${trimmed}`
    }
  }
  flush()
  return prompts
}

const parseAnswerKeyPrompts = (rawAnswerKey) => {
  const prompts = new Map()
  const blocks = String(rawAnswerKey || '').split(/\n\nQuestion /)
  for (const block of blocks) {
    const match = block.match(/^(\d+):\s*(.+?)(?:\n\nCorrect Answer:|\n\nAccepted Answers:)/s)
    if (match) prompts.set(Number(match[1]), match[2].trim().replace(/\s+/g, ' '))
  }
  return prompts
}

const shouldReplacePrompt = (current, next) => {
  const cur = String(current || '').trim()
  const nxt = String(next || '').trim()
  if (!nxt || nxt.length < 8) return false
  if (!cur) return true
  if (/^Question\s+\d+$/i.test(cur)) return true
  if (/^Complete the summary below\.?…?$/i.test(cur)) return true
  if (/^Label the diagram \(…?$/i.test(cur)) return true
  if (/^Choose the correct heading for this section\.?…?$/i.test(cur)) return true
  if (/^Drop (?:heading|answer) here/i.test(nxt)) return false
  if (cur === '……' || cur === '…') return true
  if (/^The feelings and motivations of characters become clear/i.test(cur) && nxt.length > cur.length + 10) return true
  if (/^In the second paragraph, the writer is impressed/i.test(cur) && nxt.length > cur.length + 10) return true
  if (nxt.length > cur.length + 20 && !cur.includes(nxt.slice(0, 24))) return true
  return false
}

let updatedCount = 0

for (const book of books) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  const nextExams = exams.map((exam) => {
    const sourcePath = resolveSourcePaths(book, exam.id)
    const sourcePrompts = sourcePath && fs.existsSync(sourcePath)
      ? parseReferencePrompts(fs.readFileSync(sourcePath, 'utf8'))
      : new Map()
    const keyPrompts = parseAnswerKeyPrompts(exam.rawAnswerKey)

    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage?.questions?.length) return exam

    let touched = false
    const questions = passage.questions.map((question) => {
      const fromKey = keyPrompts.get(question.number)
      const fromSource = sourcePrompts.get(question.number)
      const candidate = fromKey || fromSource
      if (!candidate || !shouldReplacePrompt(question.prompt, candidate)) return question
      touched = true
      updatedCount += 1
      return { ...question, prompt: candidate }
    })

    if (!touched) return exam
    return {
      ...exam,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [{ ...passage, questions }]
      },
      updatedAt: new Date().toISOString()
    }
  })

  const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
  console.log(`Reconciled prompts for Cambridge ${book}`)
}

console.log(`Updated ${updatedCount} question prompt(s).`)
