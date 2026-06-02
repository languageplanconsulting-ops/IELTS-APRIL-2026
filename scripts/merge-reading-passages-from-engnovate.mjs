#!/usr/bin/env node
/**
 * Merge full passage bodies and cleaner question sections from Engnovate import JSON
 * into stored Cambridge reading exams, preserving Thai explanations and answer keys.
 *
 * Run: node scripts/merge-reading-passages-from-engnovate.mjs [bookNumbers...]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { READING_QUESTION_SECTION_OVERRIDES } from './reading-question-section-overrides.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const books = process.argv.slice(2).map(Number).filter(Boolean).length
  ? process.argv.slice(2).map(Number).filter(Boolean)
  : [11, 13, 14, 15, 16, 17, 19]

const stripHtml = (text) =>
  String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

const extractPassageBody = (rawPassageText) => {
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

const isUsableBody = (body) => {
  const text = String(body || '')
  if (text.length < 800) return false
  if (/Drop heading here|<input|form="/i.test(text)) return false
  return true
}

const extractQuestionSection = (rawPassageText) => {
  const source = String(rawPassageText || '').replace(/<[^>]+>/g, ' ')
  const match = source.match(/Questions\s+\d+\s*[-–]\s*\d+[\s\S]*/i)
  if (!match) return ''
  return match[0]
    .replace(/\r/g, '')
    .replace(/[ \t]+\|[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const splitBodyParagraphs = (body) => {
  const text = stripHtml(body)
  if (!text) return []

  const byBlank = text.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter((chunk) => chunk.length > 40)
  if (byBlank.length > 1) return byBlank

  const sentences = text
    .split(/(?<=[.!?]["']?)\s+(?=[A-Z"'(])/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
  const kept = sentences.filter((chunk) => chunk.length > 40)
  const joined = kept.join(' ')
  if (!kept.length || joined.length < text.length * 0.95) return [text]
  return kept
}

const parseAnswerKeyPrompts = (rawAnswerKey) => {
  const prompts = new Map()
  for (const block of String(rawAnswerKey || '').split(/\n\nQuestion /)) {
    const match = block.match(/^(\d+):\s*(.+?)(?:\n\nCorrect Answer:|\n\nAccepted Answers:)/s)
    if (match) prompts.set(Number(match[1]), match[2].trim().replace(/\s+/g, ' '))
  }
  return prompts
}

const sectionQuality = (text) => {
  const value = String(text || '')
  let score = value.length
  if (/AF€|eccssmsniutneenee|u�[lI]|\(\s*\\?\s*SAGE/i.test(value)) score -= 5000
  if (/Drop answer here/i.test(value)) score -= 200
  if (/Label the diagram below/i.test(value)) score += 200
  if (/Questions \d+-\d+/i.test(value)) score += 100
  return score
}

const shouldReplacePrompt = (current, next) => {
  const cur = String(current || '').trim()
  const nxt = String(next || '').trim()
  if (!nxt || nxt.length < 10) return false
  if (/^Label the diagram \(Questions/i.test(cur) && !/^Label the diagram \(Questions/i.test(nxt)) return true
  if (/^Question\s+\d+$/i.test(cur)) return true
  if (/^Complete the summary below\.?…?$/i.test(cur)) return true
  if (/^Choose the correct heading for this section\.?…?$/i.test(cur)) return true
  if (cur === '……' || cur === '…') return true
  if (/^Drop (?:heading|answer) here/i.test(nxt)) return false
  if (/Questions 27-29 The Reading Passage/i.test(cur)) return true
  if (/u�[lI]|AF€/i.test(cur)) return true
  if (nxt.length > cur.length + 15 && !/^Label the diagram \(Questions/i.test(nxt)) return true
  return false
}

let bodiesMerged = 0
let sectionsMerged = 0
let promptsMerged = 0

for (const book of books) {
  const importPath = path.join(root, 'cambridge-reading-imports', `cambridge-${book}-reading-import.json`)
  if (!fs.existsSync(importPath)) {
    console.warn(`Skip Cambridge ${book}: no import JSON`)
    continue
  }

  const importItems = JSON.parse(fs.readFileSync(importPath, 'utf8'))
  const importById = new Map(importItems.map((item) => [item.id, item]))

  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let touched = false
  const nextExams = exams.map((exam) => {
    const imported = importById.get(exam.id)
    if (!imported?.rawPassageText) return exam

    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage) return exam

    const body = extractPassageBody(imported.rawPassageText)
    if (!isUsableBody(body)) return exam
    const bodyParagraphs = splitBodyParagraphs(body)
    const titleLine = body.split(/\s+/).slice(0, 8).join(' ') || passage.title

    const override = READING_QUESTION_SECTION_OVERRIDES[exam.id]
    const importedSection = extractQuestionSection(imported.rawPassageText)
    const existingSection = passage.questionSectionText || ''
    let questionSectionText = override
      || (sectionQuality(importedSection) >= sectionQuality(existingSection) ? importedSection : existingSection)

    const passageNum = Number(exam.id.match(/passage(\d+)$/)?.[1] || 1)
    const rawPassageText = `READING PASSAGE ${passageNum}\n${titleLine}\n\n${bodyParagraphs.join('\n\n')}\n\n${questionSectionText}`

    const importPrompts = parseAnswerKeyPrompts(imported.rawAnswerKey)
    let promptsChanged = false
    const questions = (passage.questions || []).map((question) => {
      const candidate = importPrompts.get(question.number)
      if (!candidate || !shouldReplacePrompt(question.prompt, candidate)) return question
      promptsChanged = true
      promptsMerged += 1
      return { ...question, prompt: candidate }
    })

    const bodyChanged = bodyParagraphs.join(' ') !== (passage.bodyParagraphs || []).join(' ')
    const sectionChanged = questionSectionText !== existingSection
    if (!bodyChanged && !sectionChanged && !promptsChanged) return exam

    if (bodyChanged) bodiesMerged += 1
    if (sectionChanged) sectionsMerged += 1
    touched = true

    return {
      ...exam,
      rawPassageText,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [{
          ...passage,
          title: titleLine,
          bodyParagraphs,
          questionSectionText,
          questions
        }]
      },
      updatedAt: new Date().toISOString()
    }
  })

  if (touched) {
    const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
    fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
    console.log(`Merged Engnovate passages for Cambridge ${book}`)
  }
}

console.log(`Merged ${bodiesMerged} bodies, ${sectionsMerged} question sections, ${promptsMerged} prompts.`)
