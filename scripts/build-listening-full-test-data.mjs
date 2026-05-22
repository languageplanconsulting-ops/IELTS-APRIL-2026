/**
 * Build foundation sets for full listening tests (Cam 15–17, 19–20).
 * Explanations follow cambridge-17-listening-enrichment-builder rules:
 * question phrase + paraphrase bridge + script quote + answer.
 *
 * Run: python3 scripts/extract-cambridge-17-listening-full-from-pdf.py
 *      node scripts/fetch-cambridge-listening-scripts.mjs
 *      node scripts/fetch-cambridge-listening-questions.mjs
 *      node scripts/fetch-cambridge-listening-answer-keys.mjs
 *      node scripts/build-listening-full-test-data.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  buildListeningEnrichment,
  findListeningQuote,
  focusQuoteOnTarget
} from './cambridge-17-listening-enrichment-builder.mjs'
import { buildQuestionWordPhrase } from './fetch-cambridge-listening-questions.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const scripts17 = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'cambridge-17-listening-scripts.json'), 'utf8')
)
const scriptsByBookPath = path.join(__dirname, 'cambridge-listening-scripts.json')
const scriptsLegacyPath = path.join(__dirname, 'cambridge-1516-listening-scripts.json')
const scriptsByBookRaw = fs.existsSync(scriptsByBookPath)
  ? scriptsByBookPath
  : scriptsLegacyPath
const scriptsByBook = fs.existsSync(scriptsByBookRaw)
  ? JSON.parse(fs.readFileSync(scriptsByBookRaw, 'utf8'))
  : { 15: {}, 16: {}, 19: {}, 20: {} }

const keys1920Path = path.join(__dirname, 'cambridge-1920-listening-answer-keys.json')
const keys1920 = fs.existsSync(keys1920Path)
  ? JSON.parse(fs.readFileSync(keys1920Path, 'utf8'))
  : { 19: {}, 20: {} }

const keysAll = {
  ...JSON.parse(fs.readFileSync(path.join(__dirname, 'cambridge-listening-full-answer-keys.json'), 'utf8')),
  ...keys1920
}
const tasks17 = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'cambridge-17-listening-tasks.json'), 'utf8')
)

const scripts1516 = scriptsByBook

const questionsPath = path.join(__dirname, 'cambridge-listening-questions.json')
const legacyQuestionsPath = path.join(__dirname, 'cambridge-1516-listening-questions.json')
const questionsRaw = fs.existsSync(questionsPath)
  ? questionsPath
  : legacyQuestionsPath
const questionsAll = fs.existsSync(questionsRaw)
  ? JSON.parse(fs.readFileSync(questionsRaw, 'utf8'))
  : { 15: {}, 16: {}, 17: {}, 19: {}, 20: {} }
for (const book of ['17', '19', '20']) {
  if (!questionsAll[book]) questionsAll[book] = {}
}

const cambridgeAudioUrl = (book, section, test) => {
  if (book >= 19) {
    return `https://engnovate.com/wp-content/uploads/2024/08/cambridge-ielts-${book}-academic-listening-${test}-audio-${section}.mp3`
  }
  return `https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam${book}-Test${test}-Section${section}.mp3`
}

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const isMcAnswer = (answer) => /^[A-G]$/i.test(String(answer || '').trim())

const questionStartForSection = (section) => ({ 1: 1, 2: 11, 3: 21, 4: 31 }[section] || 1)

const splitPassageSentences = (passage) =>
  passage
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const resolveTargetText = (passage, answer) => {
  const primary = String(answer).replace(/\([^)]*\)/g, '').split('/')[0].trim()
  const quote = findListeningQuote(passage, primary, primary, primary, '')
  if (quote && quote.length > 8) return focusQuoteOnTarget(quote, primary, 120)

  const stem = normalize(primary)
  if (stem.length >= 3) {
    for (const sentence of splitPassageSentences(passage)) {
      if (normalize(sentence).includes(stem)) return sentence
    }
  }

  const words = stem.split(' ').filter((word) => word.length > 3)
  for (const sentence of splitPassageSentences(passage)) {
    const normalizedSentence = normalize(sentence)
    const hits = words.filter((word) => normalizedSentence.includes(word)).length
    if (hits >= Math.min(2, words.length)) return sentence
  }

  return primary
}

const inferQuestionWordPhrase = (section, qNum, answer, targetText, layout) => {
  if (layout === 'choice') {
    return `ข้อ ${qNum} (เลือกคำตอบที่ถูก)`
  }
  if (section === 1) {
    return `ช่องว่างในข้อ ${qNum} (Part 1 notes)`
  }
  if (section === 4) {
    return `ช่องว่างในข้อ ${qNum} (Part 4 lecture notes)`
  }
  if (section === 2 && qNum >= 15) {
    return `Label the map · ข้อ ${qNum}`
  }
  const snippet = String(targetText || answer).split(/\s+/).slice(0, 6).join(' ')
  return snippet ? `คำตอบที่เกี่ยวกับ "${snippet}"` : `ช่องว่างในข้อ ${qNum}`
}

const enrichTaskFields = (passage, taskStub) => {
  const enriched = buildListeningEnrichment({ body: passage, task: taskStub })
  return {
    evidence: enriched.quote || taskStub.targetText,
    passageKeyword: (enriched.quote || taskStub.targetText).slice(0, 80),
    thaiMeaning: enriched.thaiMeaning,
    explanationThai: enriched.explanationThai,
    targetText: taskStub.targetText
  }
}

const getOfficialQuestion = (book, test, qNum) =>
  questionsAll[String(book)]?.[String(test)]?.[String(qNum)]

const buildQuestionFromAnswer = (book, test, section, scriptEntry, qNum, answer) => {
  const passage = scriptEntry.scriptParagraphs.join('\n\n')
  const official = getOfficialQuestion(book, test, qNum)
  const layout =
    official?.type === 'matching-row'
      ? 'matching-row'
      : official?.type === 'choice' || isMcAnswer(answer)
        ? 'choice'
        : 'gap-fill'
  const targetText = resolveTargetText(passage, answer)
  const phraseType =
    layout === 'matching-row' ? 'matching-row' : layout === 'choice' ? 'choice' : official.type
  const questionWordPhrase =
    official?.questionText
      ? buildQuestionWordPhrase({
          type: phraseType,
          stem: official.stem || '',
          gapLine: official.gapLine || '',
          rowLabel: official.rowLabel || '',
          options: official.options || [],
          answer
        })
      : inferQuestionWordPhrase(section, qNum, answer, targetText, layout)
  const questionText =
    official?.questionText ||
    (layout === 'choice'
      ? `Question ${qNum}\nChoose the correct letter, A, B or C.`
      : `Complete the notes below.\n${qNum} ____`)

  const taskStub = {
    questionWordPhrase,
    targetText,
    correctAnswer: layout === 'choice' || layout === 'matching-row' ? String(answer).trim().toUpperCase() : answer,
    questionText
  }

  const enriched = enrichTaskFields(passage, taskStub)
  const acceptedAnswers = String(answer).includes('/')
    ? String(answer)
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
    : undefined

  const options =
    official?.options?.length
      ? official.options.map((opt) => ({ key: opt.key, text: opt.text }))
      : layout === 'choice'
        ? ['A', 'B', 'C'].map((key) => ({ key, text: `Option ${key}` }))
        : []

  const displayQuestion =
    layout === 'choice'
      ? official?.stem || `Question ${qNum}: Choose the correct answer`
      : layout === 'matching-row'
        ? official?.rowLabel || questionWordPhrase
        : official?.gapLine || `Question ${qNum}: Complete the notes (____)`

  return {
    id: `full-cam${book}-t${test}-s${section}-q${qNum}`,
    number: qNum,
    section,
    question: displayQuestion,
    passage,
    evidence: enriched.evidence,
    correctAnswer: taskStub.correctAnswer,
    acceptedAnswers,
    options,
    passageKeyword: enriched.passageKeyword,
    questionKeyword: questionWordPhrase,
    thaiMeaning: enriched.thaiMeaning,
    explanationThai: enriched.explanationThai,
    questionText,
    layout
  }
}

const buildQuestionsFromAnswers = (book, test, section, scriptEntry, answers) => {
  const qStart = questionStartForSection(section)
  return answers.map((answer, index) =>
    buildQuestionFromAnswer(book, test, section, scriptEntry, qStart + index, answer)
  )
}

const builderTaskToQuestion = (task, testId, section, passage) => {
  const enriched = enrichTaskFields(passage, task)
  return {
    id: `foundation-${testId}-${task.id}`,
    number: task.questionNumber,
    section,
    question: task.questionWordPhrase,
    passage,
    evidence: enriched.evidence || task.targetText,
    correctAnswer: task.correctAnswer || 'A',
    options: [],
    passageKeyword: (enriched.evidence || task.targetText).slice(0, 80),
    questionKeyword: task.questionWordPhrase,
    thaiMeaning: task.thaiMeaning || enriched.thaiMeaning,
    explanationThai: task.explanationThai || enriched.explanationThai,
    questionText: task.questionText,
    layout: task.questionText.includes('Label')
      ? 'matching-row'
      : task.questionText.includes('____')
        ? 'gap-fill'
        : 'choice'
  }
}

const getScript = (book, section, test) => {
  if (book === 17) {
    return scripts17[`section${section}`]?.find((s) => s.test === test)
  }
  return scriptsByBook[String(book)]?.[String(test)]?.[`section${section}`]
}

const buildSectionSet = (book, test, section, useBuilderTasks) => {
  const scriptEntry = getScript(book, section, test)
  const keys = keysAll[String(book)]?.[String(test)]?.[String(section)]
  if (!scriptEntry?.scriptParagraphs?.length || !keys?.length) return null

  const setId = `full-test-cam${book}-t${test}-s${section}`
  const title = `Cambridge ${book} Test ${test} · Section ${section} — ${scriptEntry.title}`

  let questions
  if (useBuilderTasks && book === 17 && (section === 2 || section === 4)) {
    const secKey = section === 2 ? 'section2' : 'section4'
    const taskTest = tasks17[secKey]?.find((t) => t.test === test)
    const passage = scriptEntry.scriptParagraphs.join('\n\n')
    const testId = `cam17-sec${section}-test${test}`
    questions = taskTest?.tasks?.map((task) => builderTaskToQuestion(task, testId, section, passage))
  } else if (book === 16 && section === 2) {
    return null
  } else {
    questions = buildQuestionsFromAnswers(book, test, section, scriptEntry, keys)
  }

  if (!questions?.length) return null

  return {
    id: setId,
    category: section === 1 ? 'part1-detail' : section <= 2 ? 'essential' : 'advanced',
    title,
    section,
    levelLabel: `Full Test · Cam ${book} Test ${test} · Section ${section}`,
    audioUrl: scriptEntry.audioUrl || cambridgeAudioUrl(book, section, test),
    questions
  }
}

const FULL_TEST_BOOKS = [15, 16, 17, 19, 20]

const allSets = []
for (const book of FULL_TEST_BOOKS) {
  for (let test = 1; test <= 4; test += 1) {
    for (const section of [1, 2, 3, 4]) {
      const useBuilder = book === 17 && (section === 2 || section === 4)
      const set = buildSectionSet(book, test, section, useBuilder)
      if (set) allSets.push(set)
    }
  }
}

const weakExplanation = (text) => {
  const value = String(text || '').trim()
  if (!value) return true
  if (/^คำตอบคือ [A-G]\.?$/i.test(value)) return true
  if (/^คำตอบคือ "/.test(value) && !/ในโจทย์|โจทย์/.test(value)) return true
  return false
}

let weakCount = 0
let genericMcCount = 0
for (const set of allSets) {
  for (const question of set.questions) {
    if (weakExplanation(question.explanationThai)) weakCount += 1
    if (/^ข้อ \d+ \(เลือกคำตอบที่ถูก\)$/.test(String(question.questionKeyword || ''))) {
      genericMcCount += 1
    }
  }
}

const outPath = path.join(root, 'src/listeningFullTestGeneratedSets.ts')
const body = `/** Auto-generated by scripts/build-listening-full-test-data.mjs — do not edit manually */
import type { ListeningFoundationSet } from './listeningFoundationData'

export const LISTENING_FULL_TEST_GENERATED_SETS: ListeningFoundationSet[] = ${JSON.stringify(allSets, null, 2)} as ListeningFoundationSet[]
`

fs.writeFileSync(outPath, body, 'utf8')
console.log(`Wrote ${outPath} (${allSets.length} section sets, ${weakCount} weak explanations, ${genericMcCount} generic MC stems)`)
if (weakCount > 0) {
  console.warn('Some explanations may still need manual question stems for higher MC quality.')
}
if (genericMcCount > 0) {
  console.warn('Run node scripts/fetch-cambridge-listening-questions.mjs to replace generic MC stems.')
}
