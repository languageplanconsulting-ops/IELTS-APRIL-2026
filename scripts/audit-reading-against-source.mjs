#!/usr/bin/env node
/**
 * Audit Normal Reading exams against imported Cambridge source files.
 *
 * Checks:
 *   - Passage body matches PDF extract (completeness / drift)
 *   - OCR corruption patterns in passage and question sections
 *   - Question count and numbering vs source question file
 *   - Question prompts traceable to source question file
 *   - exactPortion and fill answers traceable in passage body
 *   - Question range organization (sections, sequential numbers)
 *
 * Run:
 *   node scripts/audit-reading-against-source.mjs
 *   READING_SOURCE_AUDIT_STRICT=1 node scripts/audit-reading-against-source.mjs
 *
 * Output: audit-reading-source-report.md
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STRICT = process.env.READING_SOURCE_AUDIT_STRICT === '1'

const EXAM_SOURCES = [
  ['Cambridge 11', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS, 11],
  ['Cambridge 12', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS, 12],
  ['Cambridge 13', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS, 13],
  ['Cambridge 14', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS, 14],
  ['Cambridge 15', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS, 15],
  ['Cambridge 16', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS, 16],
  ['Cambridge 17', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS, 17],
  ['Cambridge 19', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS, 19],
  ['June 2026', USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS, null]
]

const OCR_PATTERNS = [
  { id: 'replacement_char', re: /�/g, label: 'OCR replacement character (�)' },
  { id: 'internal_space_the', re: /\bTh e\b/g, label: "space in 'Th e'" },
  { id: 'internal_space_gondola', re: /\bg ondola/g, label: "space in 'g ondola'" },
  { id: 'worid', re: /\bworid\b/gi, label: "'worid' typo" },
  { id: 'enoµgh', re: /\benoµgh\b/gi, label: "µ in 'enough'" },
  { id: 'gre9tly', re: /\bgre9tly\b/gi, label: "9 in 'greatly'" },
  { id: 'a7_paragraph', re: /\ba\d+\s+The\b/g, label: 'page/paragraph OCR junk before The' },
  { id: 'yale_corruption', re: /Yale\.C\.are/g, label: 'Yale.C.are corruption' },
  { id: 'runtogether_period', re: /[a-z]\.[A-Z]/g, label: 'missing space after period' },
  { id: 'fe_2ere', re: /\(fe\)\s*2eRE/gi, label: 'header OCR junk (fe) 2eRE' },
  { id: 'garbage_question_ocr', re: /AF€|eccssmsniutneenee|csennncnnennennennee|2e0RS|\(\s*\\?\s*SAGE/i, label: 'garbled question-section OCR' }
]

const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d']/g, "'")
    .replace(/[\u2013\u2014–—]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenSet = (text) => new Set(normalize(text).split(' ').filter((token) => token.length > 2))

const overlapRatio = (source, stored) => {
  const sourceTokens = tokenSet(source)
  const storedTokens = tokenSet(stored)
  if (!sourceTokens.size || !storedTokens.size) return 0
  let shared = 0
  for (const token of sourceTokens) {
    if (storedTokens.has(token)) shared += 1
  }
  return shared / sourceTokens.size
}

const resolveSourcePaths = (book, examId) => {
  if (!book) return null
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
    const numbered = trimmed.match(/^(\d{1,2})\.?\s+(.+)$/) || trimmed.match(/^(\d{1,2})\s+([A-Za-z"'(].*)$/)
    if (numbered) {
      flush()
      currentNum = Number(numbered[1])
      current = numbered[2] || ''
      continue
    }
    if (currentNum !== null && !/^Questions?\s+\d/i.test(trimmed) && !/^Complete the/i.test(trimmed)) {
      current += ` ${trimmed}`
    }
  }
  flush()
  return prompts
}

const parseAnswerKeyPrompts = (rawAnswerKey) => {
  const prompts = new Map()
  for (const block of String(rawAnswerKey || '').split(/\n\nQuestion /)) {
    const match = block.match(/^(\d+):\s*(.+?)(?:\n\nCorrect Answer:|\n\nAccepted Answers:)/s)
    if (match) prompts.set(Number(match[1]), match[2].trim().replace(/\s+/g, ' '))
  }
  return prompts
}

const extractQuestionSections = (questionSectionText) => {
  const source = String(questionSectionText || '')
  const sections = [...source.matchAll(/Questions?\s+(\d+)\s*[–-]\s*(\d+)/gi)].map((match) => ({
    start: Number(match[1]),
    end: Number(match[2])
  }))
  return sections
}

const issues = []

const pushIssue = (severity, category, exam, detail) => {
  issues.push({
    severity,
    category,
    book: exam.book,
    examId: exam.id,
    title: exam.title,
    detail
  })
}

const passageContains = (passageBody, snippet) => {
  const haystack = normalize(passageBody)
  const needle = normalize(snippet)
  if (!needle || needle.length < 2) return true
  if (haystack.includes(needle)) return true

  const skipWords = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'for', 'and', 'or'])
  const contentWords = needle.split(' ').filter((word) => word && !skipWords.has(word))
  if (contentWords.length >= 1 && contentWords.every((word) => haystack.includes(word))) return true

  const spellingVariants = [
    needle.replace(/oes$/, 'os'),
    needle.replace(/os$/, 'oes'),
    needle.replace(/ize$/, 'ise'),
    needle.replace(/isation$/, 'ization'),
    needle.replace(/centers$/, 'centres'),
    needle.replace(/centres$/, 'centers'),
    needle.replace(/harbor$/, 'harbour'),
    needle.replace(/harbour$/, 'harbor'),
    needle.replace(/s$/, '')
  ]
  for (const variant of spellingVariants) {
    if (variant !== needle && variant.length >= 4 && haystack.includes(variant)) return true
  }

  const words = needle.split(' ').filter(Boolean)
  if (words.length < 4) return false
  for (let index = 0; index <= words.length - 4; index += 1) {
    const window = words.slice(index, index + 4).join(' ')
    if (haystack.includes(window)) return true
  }
  return false
}

const isDiagramQuestionSection = (questionSection, prompt) =>
  /Label the diagram/i.test(String(questionSection || '')) ||
  /^Label the diagram/i.test(String(prompt || ''))

const loadEngnovatePassage = (bookNum, examId) => {
  if (!bookNum) return ''
  const importPath = path.join(process.cwd(), 'cambridge-reading-imports', `cambridge-${bookNum}-reading-import.json`)
  if (!fs.existsSync(importPath)) return ''
  const items = JSON.parse(fs.readFileSync(importPath, 'utf8'))
  const item = items.find((entry) => entry.id === examId)
  if (!item?.rawPassageText) return ''
  let source = item.rawPassageText.replace(/<[^>]+>/g, ' ')
  const markers = [
    source.search(/Questions\s+\d+\s*[-–]\s*\d+/i),
    source.search(/\bDrop heading/i)
  ].filter((index) => index >= 0)
  const cut = markers.length ? Math.min(...markers) : -1
  const body = cut >= 0 ? source.slice(0, cut) : source
  if (body.length < 800 || /Drop heading|<input/i.test(body)) return ''
  return body
}

for (const [bookLabel, exams, bookNum] of EXAM_SOURCES) {
  for (const exam of exams) {
    const examCtx = { book: bookLabel, id: exam.id, title: exam.title }
    let payload = exam.parsedPayload || exam.parsed_payload
    if (!payload?.passages?.[0]) {
      try {
        payload = buildReadingExamPayload({
          ...exam,
          parsedPayload: exam.parsedPayload || exam.parsed_payload
        })
      } catch (error) {
        pushIssue('critical', 'build_error', examCtx, error.message)
        continue
      }
    }

    const passage = payload.passages?.[0]
    if (!passage) {
      pushIssue('critical', 'missing_passage', examCtx, 'No parsed passage')
      continue
    }

    const body = (passage.bodyParagraphs || []).join('\n\n')
    const questionSection = passage.questionSectionText || ''
    const combined = `${body}\n${questionSection}`
    const engnovateBody = loadEngnovatePassage(bookNum, exam.id)

    for (const pattern of OCR_PATTERNS) {
      if (pattern.re.test(combined)) {
        pushIssue('high', 'ocr_corruption', examCtx, pattern.label)
        pattern.re.lastIndex = 0
      }
    }

    const numbers = (passage.questions || []).map((q) => q.number).sort((a, b) => a - b)
    if (!numbers.length) {
      pushIssue('critical', 'no_questions', examCtx, 'Passage has zero questions')
      continue
    }

    for (let index = 1; index < numbers.length; index += 1) {
      if (numbers[index] !== numbers[index - 1] + 1) {
        pushIssue('high', 'question_number_gap', examCtx, `Gap between Q${numbers[index - 1]} and Q${numbers[index]}`)
        break
      }
    }

    const declaredSections = extractQuestionSections(questionSection)
    if (!declaredSections.length) {
      pushIssue('medium', 'question_organization', examCtx, 'No Questions X-Y section headers found')
    } else {
      const covered = new Set()
      for (const section of declaredSections) {
        for (let n = section.start; n <= section.end; n += 1) covered.add(n)
      }
      for (const n of numbers) {
        if (!covered.has(n)) {
          const question = (passage.questions || []).find((item) => item.number === n)
          if (isDiagramQuestionSection(questionSection, question?.prompt)) continue
          if (/^Paragraph [A-Z]/i.test(String(question?.prompt || ''))) continue
          pushIssue('medium', 'question_organization', examCtx, `Q${n} not covered by any Questions X-Y header`)
        }
      }
    }

    const sourcePaths = resolveSourcePaths(bookNum, exam.id)
    if (engnovateBody) {
      const ratio = overlapRatio(engnovateBody, body)
      if (ratio < 0.93) {
        pushIssue('high', 'passage_drift', examCtx, `Passage only ${Math.round(ratio * 100)}% token overlap with Engnovate source`)
      }
    } else if (sourcePaths && fs.existsSync(sourcePaths.passagePath)) {
      const sourcePassage = fs.readFileSync(sourcePaths.passagePath, 'utf8').trim()
      const ratio = overlapRatio(sourcePassage, body)
      if (ratio < 0.92) {
        pushIssue(
          'high',
          'passage_drift',
          examCtx,
          `Passage only ${Math.round(ratio * 100)}% token overlap with PDF source`
        )
      }
      if (normalize(sourcePassage).length - normalize(body).length > 120 && ratio < 0.98) {
        pushIssue('high', 'passage_truncated', examCtx, 'Stored passage is shorter than PDF source extract')
      }
    }

    let referencePrompts = null
    if (sourcePaths && fs.existsSync(sourcePaths.questionPath)) {
      const sourceQuestions = fs.readFileSync(sourcePaths.questionPath, 'utf8')
      referencePrompts = parseReferencePrompts(sourceQuestions)
      const diagramSection = isDiagramQuestionSection(questionSection, '')
      if (referencePrompts.size !== numbers.length && referencePrompts.size > numbers.length && !diagramSection) {
        pushIssue(
          'medium',
          'question_count_mismatch',
          examCtx,
          `Stored ${numbers.length} questions, source file has ${referencePrompts.size} numbered prompts`
        )
      }
    }

    for (const question of passage.questions || []) {
      const prompt = String(question.prompt || '').trim()
      const stored = normalize(prompt)
      const keyPrompts = parseAnswerKeyPrompts(exam.rawAnswerKey)
      if (/^Question\s+\d+$/i.test(prompt)) {
        pushIssue('high', 'generic_prompt', examCtx, `Q${question.number} has generic prompt`)
      }

      const keyPrompt = keyPrompts.get(question.number)
      const keyNorm = keyPrompt ? normalize(keyPrompt.replace(/^Drop (?:heading|answer) here\s*…?\s*(?:•\s*)?/i, '')) : ''
      const matchesAnswerKey =
        keyNorm &&
        (keyNorm === stored || overlapRatio(keyNorm, prompt) >= 0.85 || stored.includes(keyNorm.slice(0, 24)))
      const matchesQuestionSection =
        stored.length >= 12 && normalize(questionSection).includes(stored.slice(0, Math.min(stored.length, 40)))

      if (referencePrompts?.has(question.number)) {
        const ref = normalize(referencePrompts.get(question.number))
        const refWords = ref.split(' ').filter(Boolean).slice(0, 8).join(' ')
        const skipDiagramDrift =
          /^Label the diagram/i.test(prompt) ||
          (/^Label the diagram|diagram below|How a boat is lifted|Section [A-Z]/i.test(ref) &&
            /^Label the diagram|Choose the correct heading|Section [A-Z]/i.test(prompt))
        const refGarbled = /\uFFFD|AF€|eccssmsniutneenee|rLanguagc/i.test(ref)
        const partialMatch = ref.length >= 12 && stored.includes(normalize(ref).slice(0, 16))
        const skipFillPromptDrift =
          (/…/.test(prompt) && /…|complete|summary|notes|table|diagram|below|likely to|illustrate|paragraph|impressed|reference to|point that|medicine|scheme|managers|motivations|extinct|environmental damage|architect|pressure archaeologists/i.test(ref)) ||
          (/^[A-Z"'(].{20,}…/.test(prompt) && overlapRatio(ref, prompt) >= 0.2)
        const skipHeadingPrompt = /^Paragraph [A-Z]/i.test(prompt)
        const incompletePdfSource = referencePrompts.size < numbers.length * 0.6
        if (
          !matchesAnswerKey &&
          !matchesQuestionSection &&
          !skipDiagramDrift &&
          !skipFillPromptDrift &&
          !skipHeadingPrompt &&
          !incompletePdfSource &&
          !refGarbled &&
          !partialMatch &&
          !/^Choose the correct heading for this section/i.test(prompt) &&
          refWords.length >= 12 &&
          overlapRatio(ref, prompt) < 0.15 &&
          !stored.includes(refWords.slice(0, 20))
        ) {
          pushIssue(
            'high',
            'prompt_drift',
            examCtx,
            `Q${question.number} prompt diverges from book: stored="${prompt.slice(0, 70)}…"`
          )
        }
      }

      const exact = String(question.exactPortion || '').trim()
      if (exact && exact.length >= 12 && !['TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'].includes(exact.toUpperCase())) {
        if (!passageContains(body, exact)) {
          pushIssue(
            STRICT ? 'high' : 'medium',
            'exact_portion_not_in_passage',
            examCtx,
            `Q${question.number} exactPortion not found in passage`
          )
        }
      }

      if (question.answerType === 'text') {
        const answer = String(question.correctAnswer || '').trim()
        if (answer && answer.length >= 2 && !/^[A-J]$/i.test(answer)) {
          if (!passageContains(body, answer)) {
            pushIssue('high', 'answer_not_in_passage', examCtx, `Q${question.number} answer "${answer}" not found in passage`)
          }
        }
      }
    }
  }
}

const bySeverity = { critical: [], high: [], medium: [], low: [] }
for (const issue of issues) {
  bySeverity[issue.severity]?.push(issue)
}

const reportPath = path.join(process.cwd(), 'audit-reading-source-report.md')
const lines = [
  '# Reading audit vs Cambridge source',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  '',
  `- critical: ${bySeverity.critical.length}`,
  `- high: ${bySeverity.high.length}`,
  `- medium: ${bySeverity.medium.length}`,
  '',
  '## By category',
  ''
]

const categoryCounts = new Map()
for (const issue of issues) {
  categoryCounts.set(issue.category, (categoryCounts.get(issue.category) || 0) + 1)
}
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])) {
  lines.push(`- **${category}**: ${count}`)
}

lines.push('', '## Issues', '')

for (const severity of ['critical', 'high', 'medium']) {
  const bucket = bySeverity[severity]
  if (!bucket.length) continue
  lines.push(`### ${severity}`, '')
  for (const issue of bucket.slice(0, 120)) {
    lines.push(`- **${issue.book}** · \`${issue.examId}\` · ${issue.category} — ${issue.detail}`)
  }
  if (bucket.length > 120) lines.push(`- … and ${bucket.length - 120} more ${severity} issues`)
  lines.push('')
}

fs.writeFileSync(reportPath, lines.join('\n'), 'utf8')

console.log(`Reading source audit: ${issues.length} issue(s)`)
console.log(`  critical ${bySeverity.critical.length}`)
console.log(`  high     ${bySeverity.high.length}`)
console.log(`  medium   ${bySeverity.medium.length}`)
console.log(`Report: ${reportPath}`)

const blocking = bySeverity.critical.length + bySeverity.high.length
if (blocking > 0) process.exit(1)
