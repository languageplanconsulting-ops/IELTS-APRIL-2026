import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CAMBRIDGE_13_ACADEMIC_ANSWERS,
  CAMBRIDGE_13_PASSAGE_META
} from './cambridge-13-answers.mjs'
import {
  CAMBRIDGE_13_THAI_EXPLANATIONS,
  CAMBRIDGE_13_TABLE_PROMPTS
} from './cambridge-13-thai-explanations.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const passageDir = path.join(__dirname, 'cambridge-13-passages')
const out = path.join(__dirname, '../cambridge-reading-imports/cambridge-13-reading-import.json')

const findQuote = (body, hints) => {
  const keys = String(hints || '')
    .split('|')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
  const sentences = body
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[A-H]\s+/, '').trim())
    .filter((s) => s.length > 40)
  const hit =
    sentences.find((s) => keys.every((k) => s.toLowerCase().includes(k))) ||
    sentences.find((s) => keys.filter((k) => k.length > 4).every((k) => s.toLowerCase().includes(k))) ||
    sentences.find((s) => keys.some((k) => k.length > 4 && s.toLowerCase().includes(k)))
  return (hit || sentences[0] || body).trim().slice(0, 240)
}

const block = ({ n, prompt, answer, accepted, test, passage, exact, thai, para }) =>
  `Question ${n}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge 13 Test ${test} Passage ${passage}

Exact Portion: "${String(exact).replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const buildKey = (test, passage, title, qs) =>
  `READING PASSAGE ${passage}: ${title}\n\n${qs.map((q) => block({ ...q, test, passage })).join('\n\n')}`

const normalizeQuestionText = (qText, start, end) => {
  const cleaned = String(qText || '')
    .replace(/\r/g, '')
    .replace(/^#+\s*/gm, '')
    .trim()
  return `Questions ${start}-${end}\n\n${cleaned}`
}

const buildPassage = (num, title, body, qText, start, end) =>
  `READING PASSAGE ${num}\n${title}\n\n${body}\n\n${normalizeQuestionText(qText, start, end)}`

const readPassageBody = (test, passage) => {
  const raw = fs.readFileSync(path.join(passageDir, `test${test}-passage${passage}.txt`), 'utf8')
  const lines = raw.replace(/\r/g, '').split('\n')
  const title = lines[0]?.trim() || `Passage ${passage}`
  const body = lines.slice(1).join('\n').trim()
  return { title, body }
}

const readQuestionBlock = (test, passage) =>
  fs.readFileSync(path.join(passageDir, `test${test}-passage${passage}-questions.txt`), 'utf8').trim()

const parseNumberedPrompts = (qText, start, end) => {
  const prompts = new Map()
  const lines = qText.split('\n')
  let current = ''
  let currentNum = null

  const flush = () => {
    if (currentNum !== null && current.trim()) {
      prompts.set(currentNum, current.trim().replace(/\s+/g, ' '))
    }
    current = ''
    currentNum = null
  }

  for (const line of lines) {
    const m = line.match(/^(\d+)\.\s*(.*)$/)
    if (m) {
      flush()
      currentNum = Number(m[1])
      if (currentNum >= start && currentNum <= end) {
        current = m[2]
      } else {
        currentNum = null
      }
      continue
    }
    if (currentNum !== null && line.trim() && !line.startsWith('#')) {
      current += ` ${line.trim()}`
    }
  }
  flush()
  return prompts
}

const defaultHints = (answer, prompt) => {
  const a = String(answer || '').toLowerCase()
  if (/^(true|false|not given|yes|no)$/i.test(a)) {
    return `${a}|statement`
  }
  if (/^[a-g]$/i.test(a)) return `paragraph ${a.toLowerCase()}|section`
  if (/^[ivx]+$/i.test(a)) return 'paragraph|heading'
  const words = String(prompt || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 5)
    .slice(0, 3)
  return [a, ...words].filter(Boolean).join('|') || a
}

const explanationKey = (test, passage, n) => `${test}-${passage}-${n}`

const mkQuestions = (body, test, passage, start, end, answers, qText) => {
  const prompts = parseNumberedPrompts(qText, start, end)
  return answers.map((answer, index) => {
    const n = start + index
    const key = explanationKey(test, passage, n)
    const handWritten = CAMBRIDGE_13_THAI_EXPLANATIONS[key]
    const prompt =
      CAMBRIDGE_13_TABLE_PROMPTS[key] || prompts.get(n) || `Question ${n}`
    const hints = handWritten?.exactHints || defaultHints(answer, prompt)
    const exact = findQuote(body, hints)
    const thai = handWritten?.thai || `จากข้อความในบทความที่เกี่ยวข้องกับ "${hints.split('|')[0]}" จึงตอบ ${answer}`
    const para = handWritten?.para || `${prompt.slice(0, 60)} = ${answer} = คำตอบจาก passage`
    return {
      n,
      prompt,
      answer,
      accepted: answer === 'fathers' ? 'fathers|dads' : answer,
      exact,
      thai,
      para
    }
  })
}

const passageAnswerOffset = (test, passage) =>
  CAMBRIDGE_13_PASSAGE_META.filter((m) => m.test === test && m.passage < passage).reduce(
    (sum, m) => sum + (m.end - m.start + 1),
    0
  )

const exams = CAMBRIDGE_13_PASSAGE_META.map((meta) => {
  const { test, passage, title, category, start, end } = meta
  const { body } = readPassageBody(test, passage)
  const qText = readQuestionBlock(test, passage)
  const allAnswers = CAMBRIDGE_13_ACADEMIC_ANSWERS[test]
  const offset = passageAnswerOffset(test, passage)
  const count = end - start + 1
  const passageAnswers = allAnswers.slice(offset, offset + count)

  const questions = mkQuestions(body, test, passage, start, end, passageAnswers, qText)

  return {
    id: `cambridge-13-test${test}-passage${passage}`,
    title: `Cambridge 13 Test ${test} Passage ${passage} - ${title}`,
    category,
    sourceBook: 'Cambridge IELTS 13',
    testNumber: test,
    passageNumber: passage,
    questionRange: `${start}-${end}`,
    rawPassageText: buildPassage(passage, title, body, qText, start, end),
    rawAnswerKey: buildKey(test, passage, title, questions)
  }
})

fs.writeFileSync(out, JSON.stringify(exams, null, 2), 'utf8')
const qCount = exams.reduce((s, e) => s + (e.rawAnswerKey.match(/Question \d+:/g) || []).length, 0)
console.log(`Wrote ${exams.length} exams (${qCount} questions) to ${out}`)
