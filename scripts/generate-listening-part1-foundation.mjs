/**
 * Generate src/listeningPart1FoundationData.ts from Cambridge 18–20 Part 1 uploads.
 *
 * Sources:
 * - cambridge-listening-transcript-first-workbook.md (Thai notes + transcript triggers)
 * - ieltstrainingonline practice pages (question stems + answer keys)
 * - ieltstrainingonline audioscript pages (full Part 1 scripts)
 *
 * Run: node scripts/generate-listening-part1-foundation.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const workbookPath = path.join(root, 'cambridge-listening-transcript-first-workbook.md')
const outPath = path.join(root, 'src/listeningPart1FoundationData.ts')

const BOOKS = [18, 19, 20]
const TESTS = [1, 2, 3, 4]

const pad2 = (n) => String(n).padStart(2, '0')

const practiceUrl = (book, test) =>
  `https://ieltstrainingonline.com/practice-cam-${book}-listening-test-${pad2(test)}-with-answer-and-audioscripts/`

const audioscriptUrl = (book, test) =>
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-0${book}-listening-test-${pad2(test)}/`

const audioUrl = (book, test) =>
  `https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam${book}-test${test}-part1.m4a`

const esc = (s) =>
  JSON.stringify(String(s ?? ''))
    .replace(/\$/g, '\\$')

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const canonicalAnswer = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return raw
  if (raw.includes('/')) return raw.split('/').map((part) => part.trim()).filter(Boolean)[0]
  return raw.replace(/\(s\)/gi, 's').replace(/\(th\)/gi, 'th').trim()
}

const htmlToText = (html) =>
  String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'IELTS-Speaking-Part1-Generator/1.0' }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.text()
}

const parseWorkbookPart1 = (raw) => {
  const lines = String(raw || '').split('\n')
  const byTest = new Map()
  let currentKey = ''
  let currentBook = 0
  let currentTest = 0

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const heading = line.match(/^## Book (\d+) Test (\d+) Part 1(?:\s|$)/i)
    if (heading) {
      currentBook = Number.parseInt(heading[1], 10)
      currentTest = Number.parseInt(heading[2], 10)
      currentKey = `${currentBook}-${currentTest}`
      if (!byTest.has(currentKey)) {
        byTest.set(currentKey, { book: currentBook, test: currentTest, questions: new Map() })
      }
      continue
    }

    if (!line.startsWith('### Q') || !currentKey) continue

    const questionNumber = Number.parseInt(line.replace(/^###\s*Q/i, '').trim(), 10)
    const fields = {}
    let cursor = index + 1
    while (cursor < lines.length && !lines[cursor].startsWith('### Q') && !lines[cursor].startsWith('## ')) {
      const match = lines[cursor].match(/^- ([^:]+):\s*(.*)$/)
      if (match) fields[match[1].trim()] = match[2].replace(/^`|`$/g, '').trim()
      cursor += 1
    }

    if (fields['question prompt'] && fields['final answer'] && fields['transcript trigger']) {
      byTest.get(currentKey).questions.set(questionNumber, {
        questionPrompt: fields['question prompt'],
        answer: canonicalAnswer(fields['final answer']),
        transcriptTrigger: fields['transcript trigger'],
        thaiExplanation: fields['thai explanation'] || '',
        thaiMeaning: fields['thai meaning of key word'] || ''
      })
    }

    index = cursor - 1
  }

  return byTest
}

const extractPart1Block = (text) => {
  const part1Match = text.match(/(?:^|\n)\s*PART\s+1[\s\S]*?(?=(?:^|\n)\s*PART\s+2\b)/i)
  return part1Match ? part1Match[0].trim() : ''
}

const parsePart1Answers = (text, book, test) => {
  const marker = new RegExp(
    `Cam\\s+${book}\\s+Listening\\s+Test\\s+0?${test}\\b`,
    'i'
  )
  const markerIdx = text.search(marker)
  const tail = markerIdx >= 0 ? text.slice(markerIdx) : text.slice(Math.floor(text.length * 0.65))
  const part1AnswerMatch = tail.match(/Part\s+1\s+([\s\S]*?)(?:Part\s+2\b)/i)
  if (!part1AnswerMatch) return new Map()

  const block = part1AnswerMatch[1].replace(/\s+/g, ' ').trim()
  const answers = new Map()
  const re = /\b(10|[1-9])\s+([^]+?)(?=\s+(?:10|[1-9])\s+|(?:\s+Part\s+2\b)|$)/g
  let match
  while ((match = re.exec(block)) !== null) {
    answers.set(Number.parseInt(match[1], 10), canonicalAnswer(match[2].trim()))
  }
  return answers
}

const parsePart1QuestionStems = (text) => {
  const part1Block = extractPart1Block(text)
  if (!part1Block) return new Map()

  const stems = new Map()
  const normalizedBlock = part1Block
    .replace(/[·…]{2,}/g, '____')
    .replace(/\.{4,}/g, '____')
  const lines = normalizedBlock.split(/\n+/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || /^PART\s+1$/i.test(trimmed)) continue
    if (/^Questions?\s+\d/i.test(trimmed)) continue
    if (/^Complete the/i.test(trimmed)) continue
    if (/^Write ONE WORD/i.test(trimmed)) continue
    if (/^Location$/i.test(trimmed)) continue
    if (/^Job title$/i.test(trimmed)) continue
    if (/^Responsibilities include$/i.test(trimmed)) continue
    if (/^Pay and conditions$/i.test(trimmed)) continue
    if (/^##\s/.test(trimmed)) continue

    const numberedBlank = trimmed.match(/^●?\s*(\d+)\s*(?:£|[$€])?\s*____\s*(.*)$/i)
    if (numberedBlank) {
      const number = Number.parseInt(numberedBlank[1], 10)
      const tail = numberedBlank[2].trim()
      stems.set(number, tail ? `____ ${tail}` : '____')
      continue
    }

    const leadingBlank = trimmed.match(/^(\d+)\s*(?:£|[$€])?\s*____\s*(.*)$/i)
    if (leadingBlank) {
      const number = Number.parseInt(leadingBlank[1], 10)
      const tail = leadingBlank[2].trim()
      stems.set(number, tail ? `____ ${tail}` : '____')
      continue
    }

    const inlineBlank = trimmed.match(/^(.+?)\s*(\d+)\s*(?:£|[$€])?\s*____\s*(.*)$/i)
    if (inlineBlank) {
      const number = Number.parseInt(inlineBlank[2], 10)
      const prefix = inlineBlank[1].trim()
      const suffix = inlineBlank[3].trim()
      stems.set(number, `${prefix} ____${suffix ? ` ${suffix}` : ''}`.trim())
    }
  }

  if (stems.size === 0) {
    const inline = normalizedBlock.replace(/\s+/g, ' ')
    const inlineRe =
      /●?\s*(10|[1-9])\s*(?:£|[$€])?\s*____\s*([^●]+?)(?=●?\s*(?:10|[1-9])\s*(?:£|[$€])?\s*____|\s+Questions?\s+\d|\s+PART\s+2\b|$)/gi
    let inlineMatch
    while ((inlineMatch = inlineRe.exec(inline)) !== null) {
      const number = Number.parseInt(inlineMatch[1], 10)
      const tail = inlineMatch[2].trim()
      stems.set(number, tail ? `____ ${tail}` : '____')
    }
  }

  return stems
}

const splitPassageSentences = (passage) =>
  passage
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const resolveEvidenceInPassage = (passage, trigger, answer) => {
  const target = String(trigger || '').trim()
  if (target && passage.includes(target)) return target

  const sentences = splitPassageSentences(passage)
  const keywords = normalize(target)
    .split(' ')
    .filter((word) => word.length > 3)

  if (keywords.length) {
    let bestSentence = ''
    let bestScore = 0
    for (const sentence of sentences) {
      const normalizedSentence = normalize(sentence)
      const score = keywords.filter((word) => normalizedSentence.includes(word)).length
      if (score > bestScore) {
        bestScore = score
        bestSentence = sentence
      }
    }
    if (bestScore >= Math.min(2, keywords.length) && bestSentence) return bestSentence
  }

  const answerStem = normalize(answer)
  if (answerStem.length >= 3) {
    for (const sentence of sentences) {
      if (normalize(sentence).includes(answerStem)) return sentence
    }
  }

  return target || answer
}

const inferTopicTitle = (script, stems) => {
  const headingMatch = script.match(/^#\s+(.+)$/m)
  if (headingMatch) return headingMatch[1].trim()

  const firstStem = stems.get(1) || ''
  if (/restaurant|menu|dinner|food|drink/i.test(firstStem + script)) return 'Restaurant enquiry'
  if (/transport|bus|journey|travel/i.test(firstStem + script)) return 'Transport survey'
  if (/park|harbour|harbor|market|bridge/i.test(firstStem + script)) return 'Local area information'
  if (/restaurant|chef|salary|staff/i.test(firstStem + script)) return 'Job enquiry'
  return 'Part 1 notes completion'
}

const buildQuestionId = (book, test, number, prompt) =>
  `part1-cam${book}-test${test}-q${number}-${prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28)}`

const normalizeGapPrompt = (prompt) => prompt.replace(/_{2,3}/g, '____')

const buildSet = async (book, test, workbookByTest, cache) => {
  const key = `${book}-${test}`
  const practiceKey = practiceUrl(book, test)
  const scriptKey = audioscriptUrl(book, test)

  if (!cache.practice.has(practiceKey)) {
    cache.practice.set(practiceKey, htmlToText(await fetchText(practiceKey)))
  }
  if (!cache.script.has(scriptKey)) {
    cache.script.set(scriptKey, htmlToText(await fetchText(scriptKey)))
  }

  const practiceText = cache.practice.get(practiceKey)
  const scriptText = cache.script.get(scriptKey)
  const part1Script = extractPart1Block(scriptText)
  const answers = parsePart1Answers(scriptText, book, test)
  const stems = parsePart1QuestionStems(practiceText)
  const workbook = workbookByTest.get(key)

  if (answers.size === 0) throw new Error(`Missing Part 1 answers for Cam ${book} Test ${test}`)
  if (!part1Script) throw new Error(`Missing Part 1 audioscript for Cam ${book} Test ${test}`)

  const topicTitle = inferTopicTitle(part1Script, stems)
  const questions = []

  for (let number = 1; number <= 10; number += 1) {
    const answer = answers.get(number) || workbook?.questions.get(number)?.answer
    if (!answer) continue

    const workbookQ = workbook?.questions.get(number)
    const stem =
      workbookQ?.questionPrompt ||
      stems.get(number) ||
      `Question ${number}: ____`

    const questionPrompt = normalizeGapPrompt(stem)
    const evidence = resolveEvidenceInPassage(
      part1Script,
      workbookQ?.transcriptTrigger || '',
      answer
    )

    questions.push({
      id: buildQuestionId(book, test, number, questionPrompt),
      number,
      question: questionPrompt,
      evidence,
      correctAnswer: answer,
      passageKeyword: evidence.slice(0, 80),
      questionKeyword: questionPrompt.replace(/____/g, '').trim().slice(0, 80),
      thaiMeaning: workbookQ?.thaiMeaning || '',
      explanationThai: workbookQ?.thaiExplanation || ''
    })
  }

  if (questions.length < 10) {
    console.warn(`Cam ${book} Test ${test}: only ${questions.length}/10 Part 1 questions generated`)
  }

  return {
    id: `foundation-part1-cam${book}-test${test}`,
    category: 'part1-detail',
    title: `Cam ${book} Test ${test} · Section 1 - ${topicTitle}`,
    section: 1,
    levelLabel: `Part 1 · Cam ${book} Test ${test} · Section 1`,
    audioUrl: audioUrl(book, test),
    audioscript: part1Script,
    questions
  }
}

const renderQuestion = (question, section) => `      {
        id: ${esc(question.id)},
        number: ${question.number},
        section: ${section},
        question: ${esc(question.question)},
        passage: ${esc('')},
        evidence: ${esc(question.evidence)},
        correctAnswer: ${esc(question.correctAnswer)},
        options: [],
        passageKeyword: ${esc(question.passageKeyword)},
        questionKeyword: ${esc(question.questionKeyword)},
        thaiMeaning: ${esc(question.thaiMeaning)},
        explanationThai: ${esc(question.explanationThai)},
        questionText: ${esc(question.question)},
        layout: 'gap-fill' as const
      }`

const renderSet = (set) => `  {
    id: ${esc(set.id)},
    category: 'part1-detail',
    title: ${esc(set.title)},
    section: ${set.section},
    levelLabel: ${esc(set.levelLabel)},
    audioUrl: ${esc(set.audioUrl)},
    audioscript: ${esc(set.audioscript)},
    questions: [
${set.questions.map((question) => renderQuestion(question, set.section)).join(',\n')}
    ]
  }`

const main = async () => {
  const workbookRaw = fs.readFileSync(workbookPath, 'utf8')
  const workbookByTest = parseWorkbookPart1(workbookRaw)
  const cache = { practice: new Map(), script: new Map() }
  const sets = []

  for (const book of BOOKS) {
    for (const test of TESTS) {
      console.log(`Building Cam ${book} Test ${test} Part 1...`)
      sets.push(await buildSet(book, test, workbookByTest, cache))
    }
  }

  const file = `import type { ListeningFoundationSet } from './listeningFoundationData'

/** Auto-generated by scripts/generate-listening-part1-foundation.mjs — do not edit by hand. */
export const LISTENING_PART1_FOUNDATION_SETS: ListeningFoundationSet[] = [
${sets.map(renderSet).join(',\n')}
]
`

  fs.writeFileSync(outPath, file, 'utf8')
  console.log(`Wrote ${sets.length} sets (${sets.reduce((n, set) => n + set.questions.length, 0)} questions) to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
