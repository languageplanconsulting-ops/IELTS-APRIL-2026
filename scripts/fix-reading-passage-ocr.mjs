#!/usr/bin/env node
/**
 * Apply safe OCR typo fixes to reading passage bodies and question sections.
 * Run: node scripts/fix-reading-passage-ocr.mjs [--dry-run]
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')

const FILES = [
  'server/userProvidedReadingPracticeCambridge11.mjs',
  'server/userProvidedReadingPracticeCambridge12.mjs',
  'server/userProvidedReadingPracticeCambridge13.mjs',
  'server/userProvidedReadingPracticeCambridge14.mjs',
  'server/userProvidedReadingPracticeCambridge15.mjs',
  'server/userProvidedReadingPracticeCambridge16.mjs',
  'server/userProvidedReadingPracticeCambridge17.mjs',
  'server/userProvidedReadingPracticeCambridge19.mjs',
  'server/userProvidedReadingPracticeJune2026.mjs'
]

const REPLACEMENTS = [
  [/�eople/g, 'people'],
  [/�orld/g, 'world'],
  [/�en/g, 'been'],
  [/work�/g, 'work'],
  [/worid/gi, 'world'],
  [/enoµgh/gi, 'enough'],
  [/gre9tly/gi, 'greatly'],
  [/\bTh e\b/g, 'The'],
  [/\bth e\b/g, 'the'],
  [/'g ondola/g, "'gondola"],
  [/\bg ondola/g, 'gondola'],
  [/into\.the\b/gi, 'into the'],
  [/geo-engi\.neering/gi, 'geo-engineering'],
  [/Yale\.C\.are for sale\.'\s*Fortunately,/g,
    "Yale. Finally, in 1954, he placed an advertisement in the business newspaper The Wall Street Journal — under the category 'Miscellaneous Items for Sale' — that read: 'Biblical Manuscripts dating back to at least 200 B.C. are for sale. This would be an ideal gift to an educational or religious institution by an individual or group.' Fortunately,"],
  [/\ba\d+\s+The\b/g, 'The'],
  [/\(fe\)\s*2eRE\s+/gi, ''],
  [/difficulry/gi, 'difficulty'],
  [/lee alone/gi, 'let alone'],
  [/\bco the\b/gi, 'to the'],
  [/generally refers co the/gi, 'generally refers to the'],
  [/radiation ro be/gi, 'radiation to be'],
  [/Re-routing Russian rivers co increase/gi, 'Re-routing Russian rivers to increase'],
  [/che snow/gi, 'the snow'],
  [/in che research/gi, 'in the research'],
  [/Laborarory/gi, 'Laboratory'],
  [/I chink/gi, 'I think'],
  [/ten ro twenty/gi, 'ten to twenty'],
  [/\bro slow\b/gi, 'to slow'],
  [/\bro end\b/gi, 'to end'],
  [/\bro its\b/gi, 'to its'],
  [/\bro ice-forming\b/gi, 'to ice-forming'],
  [/\bco inject\b/gi, 'to inject'],
  [/\bche role\b/gi, 'the role'],
  [/\bche research\b/gi, 'the research'],
  [/\bBue will\b/g, 'But will'],
  [/\bcwency\b/gi, 'twenty'],
  [/Thar's/gi, "That's"],
  [/tlie time/gi, 'the time'],
  [/PIA\s*\d+/g, ''],
  [/HHSRERARRER/g, ''],
  [/1718867188/g, ''],
  [/gold, silver and u�[^\s]+[^\w]*\s*wool/gi, 'gold, silver and wool'],
  [/\(\s*\\?\s*SAGE/gi, ''],
  [/\(\\\\ SAGE/gi, ''],
  [/AF€\s*\d+\s*occ\s*IN\s*SHAPES/gi, 'are oval in shape'],
  [/eccssmsniutneenee/gi, 'husk'],
  [/csennncnnennennennee/gi, 'mace'],
  [/Lanssnnnenmnnnene/gi, 'seed'],
  [/©THE/gi, '• the'],
  [/2e0RS/gi, '']
]

const applyReplacements = (text) => {
  let value = String(text || '')
  let fixes = 0
  for (const [pattern, replacement] of REPLACEMENTS) {
    const matches = value.match(pattern)
    if (matches?.length) {
      value = value.replace(pattern, replacement)
      fixes += matches.length
    }
  }
  return { value, fixes }
}

let total = 0

for (const relPath of FILES) {
  const absPath = path.join(process.cwd(), relPath)
  if (!fs.existsSync(absPath)) continue

  const mod = await import(`file://${absPath}`)
  const exportName = Object.keys(mod).find((key) => key.startsWith('USER_PROVIDED_READING_PRACTICE_'))
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let fileFixes = 0
  let touched = false

  const nextExams = exams.map((exam) => {
    let examTouched = false
    const nextExam = { ...exam }

    if (exam.rawPassageText) {
      const { value, fixes } = applyReplacements(exam.rawPassageText)
      if (fixes) {
        nextExam.rawPassageText = value
        examTouched = true
        fileFixes += fixes
      }
    }

    const passages = (exam.parsedPayload?.passages || []).map((passage) => {
      let passageTouched = false
      const nextPassage = { ...passage }

      if (passage.questionSectionText) {
        const { value, fixes } = applyReplacements(passage.questionSectionText)
        if (fixes) {
          nextPassage.questionSectionText = value
          passageTouched = true
          fileFixes += fixes
        }
      }

      if (Array.isArray(passage.bodyParagraphs)) {
        const bodyParagraphs = passage.bodyParagraphs.map((paragraph) => {
          const { value, fixes } = applyReplacements(paragraph)
          if (fixes) {
            passageTouched = true
            fileFixes += fixes
            return value
          }
          return paragraph
        })
        nextPassage.bodyParagraphs = bodyParagraphs
      }

      return passageTouched ? nextPassage : passage
    })

    if (examTouched || passages.some((passage, index) => passage !== exam.parsedPayload.passages[index])) {
      touched = true
      nextExam.parsedPayload = { ...exam.parsedPayload, passages }
      nextExam.updatedAt = new Date().toISOString()
      return nextExam
    }

    return exam
  })

  if (touched) {
    total += fileFixes
    if (!DRY_RUN) {
      fs.writeFileSync(absPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
    }
    console.log(`${DRY_RUN ? '[dry-run] ' : ''}${relPath}: ${fileFixes} OCR fix(es)`)
  }
}

console.log(`${DRY_RUN ? 'Would apply' : 'Applied'} ${total} OCR fix(es).`)
