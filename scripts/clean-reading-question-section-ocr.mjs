#!/usr/bin/env node
/**
 * Clean garbled OCR in questionSectionText using rawAnswerKey prompts where needed.
 * Run: node scripts/clean-reading-question-section-ocr.mjs [--dry-run]
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const root = process.cwd()

const FILES = [
  'server/userProvidedReadingPracticeCambridge11.mjs',
  'server/userProvidedReadingPracticeCambridge12.mjs',
  'server/userProvidedReadingPracticeCambridge13.mjs',
  'server/userProvidedReadingPracticeCambridge14.mjs',
  'server/userProvidedReadingPracticeCambridge15.mjs',
  'server/userProvidedReadingPracticeCambridge16.mjs',
  'server/userProvidedReadingPracticeCambridge17.mjs',
  'server/userProvidedReadingPracticeCambridge19.mjs'
]

const GARBLED_RE =
  /AF€|eccssmsniutneenee|csennncnnennennennee|Lanssnnnenmnnnene|\(\s*\\?\s*SAGE|\(\\\\ SAGE|2e0RS|u�[lI]|\uFFFD|rLanguagc\uFFFD/i

const parseAnswerKeyPrompts = (rawAnswerKey) => {
  const prompts = new Map()
  const blocks = String(rawAnswerKey || '').split(/\n\nQuestion /)
  for (const block of blocks) {
    const match = block.match(/^(\d+):\s*(.+?)(?:\n\nCorrect Answer:|\n\nAccepted Answers:)/s)
    if (match) prompts.set(Number(match[1]), match[2].trim().replace(/\s+/g, ' '))
  }
  return prompts
}

const formatBlankLine = (prompt, questionNumber) => {
  let text = String(prompt || '').trim()
  if (!text || /^Label the diagram/i.test(text) || /^Drop heading here/i.test(text)) return ''
  if (/^Complete the summary\/diagram/i.test(text)) return ''

  text = text
    .replace(/[.．…⋯]+/g, ' … ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!/\d/.test(text) && !/…/.test(text)) {
    text = `${text.replace(/\s+$/, '')} ${questionNumber} …`
  }

  if (!/\b\d+\s*…/.test(text) && !/…\s*\d+/.test(text)) {
    text = text.replace(/\s…\s/g, ` ${questionNumber} … `)
  }

  return text.replace(/\s+/g, ' ').trim()
}

const cleanQuestionSectionText = (sectionText, keyPrompts) => {
  let text = String(sectionText || '')
  if (!text) return text

  text = text
    .replace(/\(\s*\\?\s*SAGE/gi, '')
    .replace(/\(\\\\ SAGE/gi, '')
    .replace(/\(B\\ 2e0RS/gi, '')
    .replace(/2e0RS/gi, '')
    .replace(/Nw, www\./gi, '')
    .replace(/©THE/gi, '• the')
    .replace(/AF€\s*\d+\s*occ\s*IN\s*SHAPES/gi, 'are … … in shape')
    .replace(/eccssmsniutneenee/gi, '… …')
    .replace(/csennncnnennennennee/gi, '… …')
    .replace(/Lanssnnnenmnnnene/gi, '… …')
    .replace(/u�[lI][^\n"]{0,60}/gi, '… …')
    .replace(/[.:,]*\uFFFD[IYl1][^\n"]{0,40}/gi, '')
    .replace(/rLanguagc\uFFFD-/gi, 'Language')
    .replace(/[ \t]+\|[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (!GARBLED_RE.test(text)) return text

  const lines = text.split('\n')
  const rebuilt = lines.map((line) => {
    if (!GARBLED_RE.test(line)) return line

    const numMatch = line.match(/\b(\d{1,2})\b/)
    const num = numMatch ? Number(numMatch[1]) : null
    if (num && keyPrompts.has(num)) {
      const formatted = formatBlankLine(keyPrompts.get(num), num)
      if (formatted) return formatted
    }
    return line
      .replace(/AF€\s*\d+\s*occ\s*IN\s*SHAPES/gi, 'are … … in shape')
      .replace(/eccssmsniutneenee|csennncnnennennennee|Lanssnnnenmnnnene/gi, '… …')
      .replace(/[a-z]{10,}/gi, (word) => (/^[a-z]{10,}$/i.test(word) ? '… …' : word))
  })

  return rebuilt.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const cleanPrompt = (prompt, questionNumber, keyPrompts) => {
  const current = String(prompt || '').trim()
  if (!current) return current

  const diagramFallback = `Label the diagram (Questions 20-26): write ONE WORD ONLY from the passage for question ${questionNumber}`

  if (GARBLED_RE.test(current) || current === '……' || current === '…') {
    const fromKey = keyPrompts.get(questionNumber)
    if (fromKey && !GARBLED_RE.test(fromKey) && fromKey.length > 8 && !/^Label the diagram/i.test(fromKey)) {
      return fromKey
    }
    return diagramFallback
  }

  if (/Questions 27-29 The Reading Passage has eight paragraphs/i.test(current)) {
    return diagramFallback
  }

  return current
}

let sectionFixes = 0
let promptFixes = 0

for (const relPath of FILES) {
  const absPath = path.join(root, relPath)
  if (!fs.existsSync(absPath)) continue

  const mod = await import(`file://${absPath}`)
  const exportName = Object.keys(mod).find((key) => key.startsWith('USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_'))
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let touched = false
  const nextExams = exams.map((exam) => {
    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage) return exam

    const keyPrompts = parseAnswerKeyPrompts(exam.rawAnswerKey)
    const cleanedSection = cleanQuestionSectionText(passage.questionSectionText, keyPrompts)
    let examTouched = cleanedSection !== passage.questionSectionText

    const questions = (passage.questions || []).map((question) => {
      const nextPrompt = cleanPrompt(question.prompt, question.number, keyPrompts)
      if (nextPrompt !== question.prompt) {
        examTouched = true
        promptFixes += 1
        return { ...question, prompt: nextPrompt }
      }
      return question
    })

    if (cleanedSection !== passage.questionSectionText) sectionFixes += 1
    if (!examTouched) return exam
    touched = true

    const nextPassage = { ...passage, questionSectionText: cleanedSection, questions }
    const rawPassageText = String(exam.rawPassageText || '').includes('Questions ')
      ? exam.rawPassageText.replace(/Questions \d[\s\S]*$/m, cleanedSection)
      : exam.rawPassageText

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

  if (touched) {
    if (!DRY_RUN) {
      fs.writeFileSync(absPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
    }
    console.log(`${DRY_RUN ? '[dry-run] ' : ''}${relPath}: cleaned question-section OCR`)
  }
}

console.log(
  `${DRY_RUN ? 'Would clean' : 'Cleaned'} ${sectionFixes} question section(s), ${promptFixes} prompt(s).`
)
