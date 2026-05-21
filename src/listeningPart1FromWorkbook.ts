import listeningWorkbookRaw from '../cambridge-listening-transcript-first-workbook.md?raw'
import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'
import {
  parseListeningAcceptedAnswers,
  primaryListeningAnswer
} from './listeningPart1AnswerCheck'
import {
  CAMBRIDGE_PART1_PROMPTS_BY_TEST,
  CAMBRIDGE_PART1_THAI_BY_TEST
} from './listeningPart1OfficialContent'
import {
  CAMBRIDGE_PART1_AUDIO_BY_TEST,
  CAMBRIDGE_PART1_ANSWERS_BY_TEST,
  CAMBRIDGE_PART1_SCRIPT_BY_TEST
} from './listeningPart1CambridgeData'

type WorkbookPart1Item = {
  bookNumber: number
  testNumber: number
  questionNumber: number
  questionPrompt: string
  answer: string
  transcriptTrigger: string
  thaiExplanation: string
  thaiMeaning: string
}

const normalizeGapPrompt = (prompt: string) => prompt.replace(/_{2,3}/g, '____')

const parseHeading = (value: string) => {
  const bookMatch = value.match(/Book\s+(\d+)/i)
  const testMatch = value.match(/Test\s+(\d+)/i)
  return {
    bookNumber: bookMatch ? Number.parseInt(bookMatch[1], 10) : 0,
    testNumber: testMatch ? Number.parseInt(testMatch[1], 10) : 0
  }
}

const canonicalAnswer = (value: string) => primaryListeningAnswer(value)

const workbookMatchesScript = (item: WorkbookPart1Item, script: string, answerKey: string) => {
  const trigger = String(item.transcriptTrigger || '').trim()
  if (trigger && script.includes(trigger)) return true

  const accepted = parseListeningAcceptedAnswers(answerKey)
  return accepted.some((answer) => {
    const stem = answer.replace(/\([^)]*\)/g, '').trim()
    if (stem.length < 2) return false
    return script.toLowerCase().includes(stem.toLowerCase())
  })
}

const buildFallbackExplanationThai = (
  questionKeyword: string,
  evidence: string,
  answer: string,
  thaiMeaning: string
) => {
  const cue = questionKeyword.replace(/____/g, '…').trim() || 'ช่องว่างในข้อนี้'
  const snippet = evidence.length > 120 ? `${evidence.slice(0, 117)}…` : evidence
  const meaningLine = thaiMeaning ? ` (${thaiMeaning})` : ''
  return `โจทย์ถามเรื่อง "${cue}" — ในบทสนทนามี "${snippet}" จึงเติม "${answer}"${meaningLine}`
}

export const parseWorkbookPart1Items = (raw: string): WorkbookPart1Item[] => {
  const lines = String(raw || '').split('\n')
  let currentHeading = ''
  const items: WorkbookPart1Item[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.startsWith('## Book ')) {
      currentHeading = line.replace(/^##\s*/, '').trim()
      continue
    }

    if (!line.startsWith('### Q') || !/Part\s+1/i.test(currentHeading) || /extra verified/i.test(currentHeading)) {
      continue
    }

    const questionNumber = Number.parseInt(line.replace(/^###\s*Q/i, '').trim(), 10)
    const fields: Record<string, string> = {}
    let cursor = index + 1

    while (cursor < lines.length && !lines[cursor].startsWith('### Q') && !lines[cursor].startsWith('## ')) {
      const match = lines[cursor].match(/^- ([^:]+):\s*(.*)$/)
      if (match) fields[match[1].trim()] = match[2].replace(/^`|`$/g, '').trim()
      cursor += 1
    }

    if (fields['question prompt'] && fields['final answer'] && fields['transcript trigger']) {
      const heading = parseHeading(currentHeading)
      items.push({
        bookNumber: heading.bookNumber,
        testNumber: heading.testNumber,
        questionNumber: Number.isFinite(questionNumber) ? questionNumber : items.length + 1,
        questionPrompt: fields['question prompt'],
        answer: canonicalAnswer(fields['final answer']),
        transcriptTrigger: fields['transcript trigger'],
        thaiExplanation: fields['thai explanation'] || '',
        thaiMeaning: fields['thai meaning of key word'] || ''
      })
    }

    index = cursor - 1
  }

  return items
}

const splitPassageSentences = (passage: string) =>
  passage
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const normalize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const resolveEvidenceInPassage = (passage: string, trigger: string, answer: string): string => {
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

const inferTopicTitle = (script: string) => {
  if (/transport|bus|journey|travel|postcode/i.test(script)) return 'Transport survey'
  if (/restaurant|menu|dinner|fish|roof|vegetarian/i.test(script)) return 'Restaurant recommendations'
  if (/Milo|restaurant|chef|salary|breakfast supervisor/i.test(script)) return 'Restaurant job enquiry'
  if (/camera club|competition|photography/i.test(script)) return 'Camera club membership'
  if (/receptionist|medical centre|appointment/i.test(script)) return 'Job agency enquiry'
  if (/park|hectares|school visit/i.test(script)) return 'Country park school visit'
  if (/guitar|Gary Mathieson/i.test(script)) return 'Guitar class enquiry'
  if (/harbour|Kite Place|samphire|organic shop/i.test(script)) return 'Local shopping guide'
  if (/supermarket|badge|locker|Kaeden/i.test(script)) return 'Supermarket job induction'
  if (/furniture rental|Peak Rentals/i.test(script)) return 'Furniture rental enquiry'
  if (/carer|mother|council support/i.test(script)) return 'Carer support enquiry'
  if (/cousin|hotel|King|George Street/i.test(script)) return 'Family visit planning'
  return 'Part 1 notes completion'
}

const buildQuestion = (
  book: number,
  test: number,
  number: number,
  prompt: string,
  answerKey: string,
  script: string,
  trigger: string,
  thaiExplanation: string,
  thaiMeaning: string
): ListeningFoundationQuestion => {
  const acceptedAnswers = parseListeningAcceptedAnswers(answerKey)
  const answer = primaryListeningAnswer(answerKey)
  const question = normalizeGapPrompt(prompt)
  const evidence = resolveEvidenceInPassage(script, trigger, answer)
  const explanationThai =
    thaiExplanation ||
    buildFallbackExplanationThai(
      question.replace(/____/g, '').trim(),
      evidence,
      answer,
      thaiMeaning
    )
  return {
    id: `part1-cam${book}-test${test}-q${number}`,
    number,
    section: 1,
    question,
    passage: '',
    evidence,
    correctAnswer: answer,
    acceptedAnswers,
    options: [],
    passageKeyword: evidence.slice(0, 80),
    questionKeyword: question.replace(/____/g, '').trim().slice(0, 80),
    thaiMeaning,
    explanationThai,
    questionText: question,
    layout: 'gap-fill'
  }
}

const groupWorkbookItems = (items: WorkbookPart1Item[]) => {
  const grouped = new Map<string, Map<number, WorkbookPart1Item>>()
  for (const item of items) {
    const key = `${item.bookNumber}-${item.testNumber}`
    if (!grouped.has(key)) grouped.set(key, new Map())
    grouped.get(key)!.set(item.questionNumber, item)
  }
  return grouped
}

export const buildListeningPart1FoundationSets = (
  workbookRaw = listeningWorkbookRaw
): ListeningFoundationSet[] => {
  const workbookItems = parseWorkbookPart1Items(workbookRaw)
  const workbookByTest = groupWorkbookItems(workbookItems)
  const sets: ListeningFoundationSet[] = []

  for (const [key, script] of Object.entries(CAMBRIDGE_PART1_SCRIPT_BY_TEST)) {
    const [bookRaw, testRaw] = key.split('-')
    const book = Number.parseInt(bookRaw, 10)
    const test = Number.parseInt(testRaw, 10)
    const answers = CAMBRIDGE_PART1_ANSWERS_BY_TEST[key]
    if (!answers) continue

    const workbookQuestions = workbookByTest.get(key) ?? new Map()
    const questions: ListeningFoundationQuestion[] = []

    for (let number = 1; number <= 10; number += 1) {
      const answerKey = answers[String(number)]
      if (!answerKey) continue
      const workbookQ = workbookQuestions.get(number)
      const matchedWorkbook =
        workbookQ && workbookMatchesScript(workbookQ, script, answerKey) ? workbookQ : undefined
      const officialThai = CAMBRIDGE_PART1_THAI_BY_TEST[key]?.[String(number)]
      questions.push(
        buildQuestion(
          book,
          test,
          number,
          matchedWorkbook?.questionPrompt ||
            CAMBRIDGE_PART1_PROMPTS_BY_TEST[key]?.[String(number)] ||
            `Question ${number}: ____`,
          answerKey,
          script,
          matchedWorkbook?.transcriptTrigger || '',
          matchedWorkbook?.thaiExplanation || officialThai?.explanationThai || '',
          matchedWorkbook?.thaiMeaning || officialThai?.thaiMeaning || ''
        )
      )
    }

    if (questions.length === 0) continue

    sets.push({
      id: `foundation-part1-cam${book}-test${test}`,
      category: 'part1-detail',
      title: `Cam ${book} Test ${test} · Section 1 - ${inferTopicTitle(script)}`,
      section: 1,
      levelLabel: `Part 1 · Cam ${book} Test ${test} · Section 1`,
      audioUrl: CAMBRIDGE_PART1_AUDIO_BY_TEST[key] || '',
      audioscript: script,
      questions
    })
  }

  return sets.sort((a, b) => {
    const metaA = a.title.match(/Cam\s+(\d+)\s+Test\s+(\d+)/i)
    const metaB = b.title.match(/Cam\s+(\d+)\s+Test\s+(\d+)/i)
    const bookA = Number(metaA?.[1] || 0)
    const bookB = Number(metaB?.[1] || 0)
    if (bookA !== bookB) return bookA - bookB
    return Number(metaA?.[2] || 0) - Number(metaB?.[2] || 0)
  })
}

export const LISTENING_PART1_FOUNDATION_SETS = buildListeningPart1FoundationSets()
