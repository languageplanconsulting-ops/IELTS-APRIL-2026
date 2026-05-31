import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import WebSocket from 'ws'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from './userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from './userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from './userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from './userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from './userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from './userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS } from './userProvidedReadingPracticeGeneralTraining.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from './userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from './userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from './userProvidedReadingPracticeJune2026.mjs'
import {
  buildReadingExamPayload,
  isValidReadingParsedPayload,
  normalizeReadingQuestionRecord,
  resolveReadingPassageBodyParagraphs
} from './readingImportUtils.mjs'

dotenv.config()

const app = express()
const port = process.env.PORT || 8787
const assessmentJobs = new Map()
const ASSESSMENT_JOB_TTL_MS = 1000 * 60 * 30
const DEFAULT_FEEDBACK_CREDITS = 20
const DEFAULT_FULL_MOCK_CREDITS = 10
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })
const MAX_SPEAKING_SAMPLE_VIDEO_BYTES = Number(process.env.SPEAKING_SAMPLE_VIDEO_MAX_BYTES || 220 * 1024 * 1024)
const videoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, os.tmpdir()),
    filename: (_req, file, cb) => cb(null, `ielts-speaking-sample-${Date.now()}-${randomUUID()}${path.extname(file.originalname || '')}`)
  }),
  limits: { fileSize: MAX_SPEAKING_SAMPLE_VIDEO_BYTES }
})
const ADMIN_PANEL_CODE = String(process.env.ADMIN_PANEL_CODE || 'englishplanforeover').trim()
const ADMIN_CODE_TOKEN_PREFIX = 'admin-code:'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const requireJson = createRequire(import.meta.url)
const distDir = path.resolve(__dirname, '../dist')
const indexHtmlPath = path.join(distDir, 'index.html')
const isDirectRun = process.argv[1] ? path.resolve(process.argv[1]) === __filename : false
const JAN_2026_MUSIC_BRAIN_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-jan-2026-passage-2-music-and-brain.json')
const JAN_2026_MEDIEVAL_CASTLES_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-jan-2026-passage-2-medieval-castles.json')
const JAN_2026_PRODUCTIVE_BOREDOM_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-jan-2026-passage-3-productive-power-of-boredom.json')
const JAN_2026_URBAN_EVOLUTION_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-jan-2026-passage-3-urban-evolution.json')
const JAN_2026_COGNITIVE_COST_GPS_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-jan-2026-passage-3-cognitive-cost-of-gps.json')
const FEB_2026_BRITISH_ARISTOCRACY_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-2-british-aristocracy.json')
const FEB_2026_VAQUITA_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-2-saving-the-vaquita.json')
const FEB_2026_ADHD_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-2-adhd-innate-or-upbringing.json')
const FEB_2026_DIGITAL_NOMADS_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-1-rise-of-digital-nomads.json')
const FEB_2026_MOVIE_THEATRES_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-1-disappearance-of-movie-theatres.json')
const FEB_2026_SPANISH_ARMADA_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-1-spanish-armada.json')
const FEB_2026_EIGHT_HOUR_SLEEP_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-3-myth-of-eight-hour-sleep.json')
const FEB_2026_WOOD_WIDE_WEB_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-3-wood-wide-web.json')
const FEB_2026_DIGITAL_NATIVE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-3-myth-of-digital-native.json')
const FEB_2026_PRODUCTIVE_UNEASE_BOREDOM_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-feb-2026-passage-3-productive-unease-of-boredom.json')
const APRIL_2024_TRAUMA_LANGUAGE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2024-passage-2-trauma-language-popular-culture.json')
const APRIL_2026_BALD_EAGLE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-1-bald-eagle.json')
const APRIL_2026_HABSBURG_JAW_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-1-habsburg-jaw.json')
const APRIL_2026_PRIMARY_EDUCATION_AI_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-1-primary-education-ai.json')
const APRIL_2026_POLAR_BEARS_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-1-polar-bears.json')
const APRIL_2026_HOUSE_OF_WINDSOR_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-2-house-of-windsor.json')
const APRIL_2026_SOCIAL_MEDIA_POLARIZATION_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-2-social-media-algorithms-polarization.json')
const APRIL_2026_CANCEL_CULTURE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-2-psychology-cancel-culture.json')
const APRIL_2026_DELAYED_ADULTHOOD_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-2-delayed-adulthood.json')
const APRIL_2026_UNCERTAIN_PREDICTION_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-3-uncertain-science-of-prediction.json')
const APRIL_2026_URBAN_DARKNESS_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-3-case-for-urban-darkness.json')
const APRIL_2026_WHAT_IS_RESTORATION_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-april-2026-passage-3-what-is-restoration.json')
const MARCH_2026_NATURAL_WATER_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-2-natural-water-cleaning.json')
const MARCH_2026_CRITICAL_THINKING_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-2-critical-thinking.json')
const MARCH_2026_HISTORY_AI_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-2-history-education-ai.json')
const MARCH_2026_ARTISTS_AI_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-2-artists-ai.json')
const MARCH_2026_GREEN_ARCHITECTURE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-1-future-green-architecture.json')
const MARCH_2026_DEVELOPING_ENVIRONMENT_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-1-environmental-problems-developing-countries.json')
const MARCH_2026_WOOD_CYCAD_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-1-saving-the-wood-cycad.json')
const MARCH_2026_QUIET_SKILL_FORGETTING_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-3-quiet-skill-of-forgetting.json')
const MARCH_2026_IMPERFECT_DESIGN_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-3-imperfect-design.json')
const MARCH_2026_GOOD_ARCHIVE_READING_EXAMS = requireJson('../cambridge-reading-imports/ielts-academic-reading-march-2026-passage-3-good-archive.json')

app.use(cors())
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || '25mb'
const captureRawRequestBody = (req, _res, buffer) => {
  req.rawBody = buffer?.length ? buffer.toString('utf8') : ''
}
app.use(express.json({
  limit: requestBodyLimit,
  verify: captureRawRequestBody
}))
app.use(express.urlencoded({
  extended: false,
  limit: requestBodyLimit,
  verify: captureRawRequestBody
}))

const GEMINI_PRICING_VERIFIED_AT = '2026-05-02'
const GEMINI_PRICING_SOURCE_URL = 'https://ai.google.dev/gemini-api/docs/pricing?hl=en'
const GEMINI_STANDARD_PRICING_USD_PER_1M_TOKENS = {
  'gemini-2.5-flash': {
    inputText: 0.3,
    inputAudio: 1.0,
    outputText: 2.5
  },
  'gemini-2.5-flash-lite': {
    inputText: 0.1,
    inputAudio: 0.3,
    outputText: 0.4
  },
  'gemini-2.0-flash': {
    inputText: 0.1,
    inputAudio: 0.7,
    outputText: 0.4
  }
}

const roundUsdAmount = (value, digits = 8) => Number(Number(value || 0).toFixed(digits))

const normalizeUsageDetails = (details) =>
  (Array.isArray(details) ? details : [])
    .map((item) => ({
      modality: String(item?.modality || item?.mode || 'TEXT').trim().toUpperCase(),
      tokenCount: Math.max(
        0,
        Number(
          item?.tokenCount ??
            item?.token_count ??
            item?.count ??
            0
        ) || 0
      )
    }))
    .filter((item) => item.tokenCount > 0)

const summarizeUsageDetails = (details) => {
  const summary = {
    text: 0,
    image: 0,
    video: 0,
    audio: 0,
    document: 0,
    other: 0
  }
  for (const item of normalizeUsageDetails(details)) {
    if (item.modality === 'TEXT') summary.text += item.tokenCount
    else if (item.modality === 'IMAGE') summary.image += item.tokenCount
    else if (item.modality === 'VIDEO') summary.video += item.tokenCount
    else if (item.modality === 'AUDIO') summary.audio += item.tokenCount
    else if (item.modality === 'DOCUMENT') summary.document += item.tokenCount
    else summary.other += item.tokenCount
  }
  return summary
}

const normalizeGeminiUsageMetadata = (payload) => {
  const usage = payload?.usageMetadata || payload?.usage_metadata
  if (!usage || typeof usage !== 'object') return null
  return {
    promptTokenCount: Math.max(0, Number(usage.promptTokenCount ?? usage.prompt_token_count ?? 0) || 0),
    candidatesTokenCount: Math.max(
      0,
      Number(usage.candidatesTokenCount ?? usage.candidates_token_count ?? 0) || 0
    ),
    totalTokenCount: Math.max(0, Number(usage.totalTokenCount ?? usage.total_token_count ?? 0) || 0),
    thoughtsTokenCount: Math.max(0, Number(usage.thoughtsTokenCount ?? usage.thoughts_token_count ?? 0) || 0),
    promptTokensDetails: normalizeUsageDetails(
      usage.promptTokensDetails ?? usage.prompt_tokens_details ?? []
    ),
    candidatesTokensDetails: normalizeUsageDetails(
      usage.candidatesTokensDetails ?? usage.candidates_tokens_details ?? []
    )
  }
}

const pickGeminiPricingForModel = (model) => {
  const normalized = String(model || '').trim().toLowerCase()
  if (!normalized) return null
  if (normalized.startsWith('gemini-2.5-flash-lite')) {
    return {
      modelFamily: 'gemini-2.5-flash-lite',
      ...GEMINI_STANDARD_PRICING_USD_PER_1M_TOKENS['gemini-2.5-flash-lite']
    }
  }
  if (normalized.startsWith('gemini-2.5-flash')) {
    return {
      modelFamily: 'gemini-2.5-flash',
      ...GEMINI_STANDARD_PRICING_USD_PER_1M_TOKENS['gemini-2.5-flash']
    }
  }
  if (normalized.startsWith('gemini-2.0-flash')) {
    return {
      modelFamily: 'gemini-2.0-flash',
      ...GEMINI_STANDARD_PRICING_USD_PER_1M_TOKENS['gemini-2.0-flash']
    }
  }
  return null
}

const calculateGeminiApiCost = ({ model, usageMetadata, fallbackInputModality = 'TEXT' }) => {
  const normalizedUsage = normalizeGeminiUsageMetadata({ usageMetadata })
  const pricing = pickGeminiPricingForModel(model)
  if (!normalizedUsage || !pricing) return null

  const promptByModality = summarizeUsageDetails(normalizedUsage.promptTokensDetails)
  const outputByModality = summarizeUsageDetails(normalizedUsage.candidatesTokensDetails)
  const hasPromptDetails = Object.values(promptByModality).some((value) => value > 0)
  const hasOutputDetails = Object.values(outputByModality).some((value) => value > 0)

  if (!hasPromptDetails && normalizedUsage.promptTokenCount > 0) {
    const normalizedFallback = String(fallbackInputModality || 'TEXT').trim().toUpperCase()
    if (normalizedFallback === 'AUDIO') promptByModality.audio = normalizedUsage.promptTokenCount
    else promptByModality.text = normalizedUsage.promptTokenCount
  }

  if (!hasOutputDetails && normalizedUsage.candidatesTokenCount > 0) {
    outputByModality.text = normalizedUsage.candidatesTokenCount
  }

  const inputTextTokens =
    promptByModality.text +
    promptByModality.image +
    promptByModality.video +
    promptByModality.document +
    promptByModality.other
  const inputAudioTokens = promptByModality.audio
  const outputTextTokens =
    outputByModality.text +
    outputByModality.image +
    outputByModality.video +
    outputByModality.audio +
    outputByModality.document +
    outputByModality.other

  const inputCostUsd =
    inputTextTokens * (pricing.inputText / 1_000_000) +
    inputAudioTokens * (pricing.inputAudio / 1_000_000)
  const outputCostUsd = outputTextTokens * (pricing.outputText / 1_000_000)
  const totalCostUsd = inputCostUsd + outputCostUsd

  return {
    provider: 'gemini',
    model: String(model || ''),
    modelFamily: pricing.modelFamily,
    promptTokenCount: normalizedUsage.promptTokenCount,
    candidatesTokenCount: normalizedUsage.candidatesTokenCount,
    totalTokenCount: normalizedUsage.totalTokenCount,
    thoughtsTokenCount: normalizedUsage.thoughtsTokenCount,
    promptTokensByModality: promptByModality,
    outputTokensByModality: outputByModality,
    inputCostUsd: roundUsdAmount(inputCostUsd),
    outputCostUsd: roundUsdAmount(outputCostUsd),
    totalCostUsd: roundUsdAmount(totalCostUsd),
    pricingVersion: {
      source: GEMINI_PRICING_SOURCE_URL,
      verifiedAt: GEMINI_PRICING_VERIFIED_AT
    }
  }
}

const createApiUsageTracker = () => {
  const records = []

  return {
    record(entry) {
      if (entry && typeof entry === 'object') records.push(entry)
    },
    summarize() {
      const calls = records.map((item, index) => ({
        id: index + 1,
        provider: String(item.provider || 'gemini'),
        operation: String(item.operation || 'unknown'),
        model: String(item.model || ''),
        modelFamily: String(item.modelFamily || item.model || ''),
        promptTokenCount: Math.max(0, Number(item.promptTokenCount || 0)),
        candidatesTokenCount: Math.max(0, Number(item.candidatesTokenCount || 0)),
        totalTokenCount: Math.max(0, Number(item.totalTokenCount || 0)),
        inputCostUsd: roundUsdAmount(item.inputCostUsd || 0),
        outputCostUsd: roundUsdAmount(item.outputCostUsd || 0),
        totalCostUsd: roundUsdAmount(item.totalCostUsd || 0)
      }))
      return {
        provider: 'gemini',
        totalCalls: calls.length,
        totalPromptTokens: calls.reduce((sum, item) => sum + item.promptTokenCount, 0),
        totalCompletionTokens: calls.reduce((sum, item) => sum + item.candidatesTokenCount, 0),
        totalTokens: calls.reduce((sum, item) => sum + item.totalTokenCount, 0),
        inputCostUsd: roundUsdAmount(calls.reduce((sum, item) => sum + item.inputCostUsd, 0)),
        outputCostUsd: roundUsdAmount(calls.reduce((sum, item) => sum + item.outputCostUsd, 0)),
        totalCostUsd: roundUsdAmount(calls.reduce((sum, item) => sum + item.totalCostUsd, 0)),
        pricingVersion: {
          source: GEMINI_PRICING_SOURCE_URL,
          verifiedAt: GEMINI_PRICING_VERIFIED_AT
        },
        calls
      }
    }
  }
}

const PART2_FLUENCY_WORD_COUNT_REDUCTION = 0.87
const PART2_FLUENCY_WORD_COUNT_INCREASE = 1.08

const scalePart2FluencyWordCount = (base) =>
  Math.round(base * PART2_FLUENCY_WORD_COUNT_REDUCTION * PART2_FLUENCY_WORD_COUNT_INCREASE)

const PART2_FLUENCY_WORD_COUNTS = {
  band9Min: 310,
  band8Min: scalePart2FluencyWordCount(238),
  band7Min: scalePart2FluencyWordCount(213),
  band6Min: scalePart2FluencyWordCount(170),
  band6Max: scalePart2FluencyWordCount(212),
  band5Floor: scalePart2FluencyWordCount(128)
}

const buildBucketRubricTh = (testMode = 'part2') => `
ไวยากรณ์ (Grammar)
Band 9: ใช้ conditionals, perfect tense, past tense ไม่มีข้อผิดพลาด ใช้ subordinating conjunction และถ้าเป็น Part 3 ต้องใช้ passive voice ถูกต้องอย่างน้อย 3 ครั้ง
Band 8: ใช้ perfect tense และ past tense ใช้ subordinating conjunction ไม่มีข้อผิดพลาด และถ้าเป็น Part 3 ต้องใช้ passive voice ถูกต้องอย่างน้อย 2 ครั้ง
Band 7: ${
  testMode === 'part2'
    ? 'ใช้ simple tense ได้ถูกต้อง ใช้ subordinating conjunction และอนุโลม grammar mistakes ที่ไม่รบกวนความเข้าใจได้ไม่เกิน 3 ครั้ง'
    : 'ใช้ simple tense ได้ถูกต้อง ใช้ subordinating conjunction ยอมรับผิดพลาดเล็กน้อยไม่เกิน 3 ครั้ง'
} และถ้าเป็น Part 3 ต้องใช้ passive voice ถูกต้องอย่างน้อย 1 ครั้ง
Band 6: simple tense ผิดไม่เกิน 3 ครั้ง มี past tense error มี conjunction error หรือไม่ใช้ มี grammar error มากกว่า 5 ครั้ง แต่ยังพอเข้าใจ
Band 5: simple tense ผิด ไม่มี tense shift ที่ถูกต้อง ไม่ใช้หรือใช้ conjunction ผิด มี grammar error มากกว่า 5 ครั้ง และรบกวนความเข้าใจ
Band 4: เหมือน band 5 และรบกวนความเข้าใจชัดเจน

คำศัพท์ (Vocabulary)
Band 9: ${
  testMode === 'part1' || testMode === 'part3'
    ? 'collocation อย่างน้อย 10 จุด และ C1-C2 อย่างน้อย 5 จุด ไม่มีคำผิดธรรมชาติ'
    : 'collocation > 6 (B1+) และ C1-C2 อย่างน้อย 2 ไม่มีคำผิดธรรมชาติ'
}
Band 8: collocation > 4-5 (B1+) และ C1-C2 อย่างน้อย 1 ไม่มีคำผิดธรรมชาติ
Band 7: collocation 2-5 (B1+) ไม่มี lexical error และคำแปลกหูไม่เกิน 3 ครั้ง
Band 6: collocation ส่วนใหญ่ A2-B1 มีคำแปลกหู/ผิดบ่อยแต่ยังพอเข้าใจ
Band 5: collocation ส่วนใหญ่ A2-B1 มีคำผิดบ่อยและมีประโยคเข้าใจไม่ได้มากกว่า 2-3 ประโยค
Band 4: collocation ส่วนใหญ่ A1-B1 มีคำผิดบ่อยและมีประโยคเข้าใจไม่ได้มากกว่า 3 ประโยค

ความคล่องแคล่ว (Fluency)
Band 9: referencing > 4 ถูกต้องทั้งหมด พูด >= ${PART2_FLUENCY_WORD_COUNTS.band9Min} คำ ลื่นไหลต่อเนื่อง (hesitation ตามธรรมชาติเล็กน้อยยอมรับได้)
Band 8: referencing > 3 ถูกต้อง พูด >= ${PART2_FLUENCY_WORD_COUNTS.band8Min} คำ มี self-correction ได้ถ้าทำให้ความหมายชัดขึ้น
Band 7: พูด >= ${PART2_FLUENCY_WORD_COUNTS.band7Min} คำ ใช้ referencing อย่างน้อย 2 ครั้งถูกต้อง มี pause/filler ตามธรรมชาติได้
Band 6: พูด ${PART2_FLUENCY_WORD_COUNTS.band6Min}-${PART2_FLUENCY_WORD_COUNTS.band6Max} คำ referencing ไม่มีหรือผิดบางครั้ง มี hesitation/filler ได้หากไม่รบกวนความเข้าใจ
Band 5: พูด < ${PART2_FLUENCY_WORD_COUNTS.band6Min} คำ referencing ไม่มีหรือผิดบ่อย ความลื่นไหลสะดุดจนกระทบความเข้าใจ
Band 4: พูด < ${PART2_FLUENCY_WORD_COUNTS.band6Min} คำ referencing ไม่มีหรือผิดแทบทั้งหมด ความลื่นไหลสะดุดรุนแรงและรบกวนความเข้าใจชัดเจน
`

const punctuationPrompt = ({ rawTranscript }) => `
You are an expert transcript editor for an IELTS speaking test.
You will receive a raw, unpunctuated Speech-to-Text (STT) transcript of about 700-800 words.

Your ONLY tasks are:
1. Add punctuation.
- Insert periods, commas, and question marks to make the text readable based on spoken cadence.
- Capitalize the beginnings of sentences.

2. Fix STT mishears.
- Correct phonetic transcription errors only when the intended meaning is obvious from context.
- Example: change "cell belief" to "self-belief" only if the surrounding context clearly shows that meaning.

3. Remove stutters / filler noise when it is clearly just speech disfluency.
- You may remove filler words like "um", "ah", and repeated stutter fragments like "I I I think".
- Do NOT remove meaningful self-correction that changes the content of the answer.

CRITICAL DIRECTIVE - DO NOT CORRECT GRAMMAR:
- You MUST preserve the speaker's original grammatical errors, wrong vocabulary choices, and awkward phrasing.
- If they say "She don't like", keep it as "She don't like".
- If they say "In the past I will go", keep it as "In the past I will go".
- If they say "I am very boring" when they mean bored, keep it as "I am very boring".
- If they say "I has worked", keep it as "I has worked".
- If they say "I work yesterday", keep it as "I work yesterday" unless the missing "-ed" is clearly an STT hearing error rather than the speaker's grammar.

We are using this transcript to grade the speaker's English proficiency.
If you fix their grammar, the test is ruined.

Return only the cleaned transcript.

Transcript:
${rawTranscript || '(empty)'}
`

const rubricPrompt = ({ testMode, topic, prompt, cues, punctuatedTranscript, whisperTranscript, durationSeconds, questionBreakdown }) => `
You are an IELTS Speaking Part 2 examiner.
Use this bucket rubric strictly:
${buildBucketRubricTh(testMode)}

Return only valid JSON with this schema:
{
  "criteria": {
    "fluency": number,
    "lexical": number,
    "grammar": number
  },
  "componentReports": {
    "grammar": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "lexical": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "fluency": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    }
  },
  "analysisSignals": {
    "grammarErrorCount": number,
    "vocabularyIssueCount": number,
    "meaningImpact": string
  },
  "strengths": string[],
  "improvements": string[],
  "modelNotes": string
}
Rules:
- Scores must be 4.0 to 9.0
- Use punctuated transcript as primary evidence
- Spoken markers are normal in speaking tests: do NOT penalize fillers such as "um", "uh", "you know", "i think" by default.
- Brief hesitation, restart, or self-correction is acceptable unless it repeatedly harms clarity or coherence.
- explanationThai must be Thai (technical terms can be English)
- plusOnePlan.fix must be Thai coaching language (quote may keep original learner wording as evidence)
- Use the polite Thai register with "ครับ" and never "ค่ะ".
- requiredTicks must reflect that band's bucket logic
- each required tick includes 1-3 short direct quotes from the submitted text as evidence whenever possible
- plusOnePlan should include as many actionable quote+fix items as possible (prefer 12-20 when evidence supports it)
- analysisSignals.grammarErrorCount = count clear grammatical errors across the submitted answer(s)
- analysisSignals.vocabularyIssueCount = count clear vocabulary mistakes or awkward lexical choices across the submitted answer(s)
- analysisSignals.meaningImpact must be one of: "none", "minor", "major"
- Use "none" when there are many mistakes but the answer is still very understandable.
- Use "minor" when there is awkward phrasing but the speaker's intent still stays clear overall.
- Use "major" only when repeated mistakes alter or obscure the speaker's intended meaning.
- Fluency must not go below Band 6 just because of frequent grammar mistakes when meaning remains understandable.
- Fluency should fall to Band 5 or Band 4 only when grammar mistakes alter or seriously obscure the speaker's intent.
- Count only clear issues. Do not inflate counts for minor spoken hesitation or natural filler.
- strengths: 2-4 bullet-sized strings
- improvements: 2-4 actionable strings
- modelNotes <= 70 words

Topic: ${topic}
Prompt: ${prompt}
Cue points: ${cues.join(' | ')}
Duration seconds: ${durationSeconds}
Punctuated transcript:
${punctuatedTranscript || '(empty)'}
ASR transcript (backup evidence):
${whisperTranscript || '(empty)'}
Question breakdown:
${Array.isArray(questionBreakdown) && questionBreakdown.length
    ? questionBreakdown
        .map(
          (item, index) =>
            `[${index}] Question: ${item.question || 'Question'}\nAnswer: ${item.punctuatedTranscript || item.rawTranscript || '(empty)'}`
        )
        .join('\n\n')
    : '(none)'}
`

const splitTrialSpeakingBreakdown = (questionBreakdown) => {
  const items = Array.isArray(questionBreakdown) ? questionBreakdown : []
  return {
    part2: items[0] || null,
    followUps: items.slice(1)
  }
}

const trialSpeakingRubricPrompt = ({
  topic,
  prompt,
  cues,
  punctuatedTranscript,
  whisperTranscript,
  durationSeconds,
  questionBreakdown
}) => {
  const trialBreakdown = splitTrialSpeakingBreakdown(questionBreakdown)
  const part2Answer = trialBreakdown.part2?.punctuatedTranscript || trialBreakdown.part2?.rawTranscript || '(empty)'
  const followUpBlock = trialBreakdown.followUps.length
    ? trialBreakdown.followUps
        .map(
          (item, index) =>
            `[Follow-up ${index + 1}] Question: ${item.question || 'Question'}\nAnswer: ${item.punctuatedTranscript || item.rawTranscript || '(empty)'}`
        )
        .join('\n\n')
    : '(none)'

  return `
You are an IELTS Speaking examiner evaluating a ONE-TIME TRIAL speaking task.

This trial has:
- 1 long-turn response (the 2-minute Part 2 style answer)
- 3 follow-up questions

Scoring rules for this TRIAL:
- Fluency must be judged ONLY from the 2-minute long-turn response.
- Grammar must be judged from the ENTIRE submitted task (long turn + all follow-ups).
- Lexical resource / vocabulary must be judged from the ENTIRE submitted task (long turn + all follow-ups).
- Do NOT average fluency from the follow-up questions into the fluency score.
- The final report must still return only 3 scores: fluency, lexical, grammar.

Use this bucket rubric strictly:
${buildBucketRubricTh('part2')}

Return only valid JSON with this schema:
{
  "criteria": {
    "fluency": number,
    "lexical": number,
    "grammar": number
  },
  "componentReports": {
    "grammar": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "lexical": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "fluency": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    }
  },
  "analysisSignals": {
    "grammarErrorCount": number,
    "vocabularyIssueCount": number,
    "meaningImpact": string
  },
  "strengths": string[],
  "improvements": string[],
  "modelNotes": string
}
Rules:
- Scores must be 4.0 to 9.0
- Use punctuated transcript as primary evidence
- Spoken markers are normal in speaking tests: do NOT penalize fillers such as "um", "uh", "you know", "i think" by default.
- explanationThai must be Thai and use "ครับ"
- In grammar and lexical explanations, mention that the score reflects the whole submitted task.
- In fluency explanation, mention clearly that the score reflects only the 2-minute response.
- plusOnePlan.fix must be Thai coaching language
- requiredTicks must reflect the chosen band's logic
- each required tick includes 1-3 short direct quotes whenever possible
- analysisSignals.grammarErrorCount = count clear grammatical errors across the whole task
- analysisSignals.vocabularyIssueCount = count clear vocabulary issues across the whole task
- analysisSignals.meaningImpact must be one of: "none", "minor", "major"
- strengths: 2-4 bullet-sized strings
- improvements: 2-4 actionable strings
- modelNotes <= 70 words

Topic: ${topic}
Prompt: ${prompt}
Cue points: ${Array.isArray(cues) ? cues.join(' | ') : ''}
Duration seconds: ${durationSeconds}
Full punctuated transcript:
${punctuatedTranscript || '(empty)'}
ASR transcript (backup evidence):
${whisperTranscript || '(empty)'}

Long-turn response only (THIS IS THE ONLY EVIDENCE FOR FLUENCY):
Question: ${trialBreakdown.part2?.question || prompt || 'Long turn'}
Answer: ${part2Answer}

Follow-up answers (USE THESE FOR GRAMMAR + VOCABULARY ONLY):
${followUpBlock}
`
}

const fullMockWholeRubricPrompt = ({
  topic,
  prompt,
  cues,
  punctuatedTranscript,
  whisperTranscript,
  durationSeconds,
  questionBreakdown
}) => `
You are an IELTS Speaking examiner assessing a FULL MOCK TEST as one whole performance.

Important scoring behavior:
- This is speech-to-text and likely mishears have already been cleaned when obvious.
- Do NOT penalize natural fillers or hesitation such as "um", "hm", "you know", or "yeah".
- Self-correction is acceptable and should only be penalized according to the criteria below.
- Assess the entire performance as one whole answer set. Do NOT split scoring by Part 1, Part 2, and Part 3.

Return only valid JSON with this schema:
{
  "criteria": {
    "fluency": number,
    "lexical": number,
    "grammar": number
  },
  "componentReports": {
    "grammar": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "lexical": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    },
    "fluency": {
      "band": number,
      "explanationThai": string,
      "requiredTicks": [{ "requirement": string, "isMet": boolean, "evidence": string[] }],
      "plusOnePlan": [{ "quote": string, "fix": string }]
    }
  },
  "analysisSignals": {
    "grammarErrorCount": number,
    "vocabularyIssueCount": number,
    "meaningImpact": string
  },
  "strengths": string[],
  "improvements": string[],
  "modelNotes": string
}

Rules for the JSON:
- Scores must be 4.0 to 9.0
- explanationThai must be Thai, concise, practical, and use "ครับ" not "ค่ะ"
- requiredTicks must show ONLY the checklist for the achieved band
- requiredTicks.evidence must contain 0-10 short direct quotes from the submitted text, only when relevant
- If a checklist item is satisfied, give direct quotes proving it
- If a checklist item is not satisfied, evidence can be empty or can quote the nearest relevant attempt
- For "no mistakes" style items, evidence is optional
- plusOnePlan must be the NEXT band checklist only, with quote-based coaching from the submitted text
- strengths: 2-4 short points
- improvements: 2-4 actionable points
- modelNotes <= 80 words
- analysisSignals.meaningImpact must be one of "none", "minor", "major"
- Use "none" when mistakes are noticeable but understanding stays clear
- Use "minor" when awkwardness exists but intent remains understandable overall
- Use "major" only when mistakes create real misunderstanding of the speaker's intent

Assessment criteria

Grammar
Band 9:
- Use conditionals
- Use passive voice more than 5 times
- Use perfect tense
- No grammar mistakes whatsoever
- Use subordinating conjunctions
- Use one prepositional phrase
- Use "which" correctly as in "S + V, which..."

Band 8:
- Use conditionals
- Use passive voice more than 2 times
- Use perfect tense
- No grammar mistakes whatsoever
- Use subordinating conjunctions

Band 7:
- Use simple tense (present/past) with no mistakes
- Use passive voice at least 1 time
- No more than 3 other grammar mistakes such as plural/singular
- Use subordinating conjunctions

Band 6:
- Make grammar mistakes throughout, but none hinders understanding

Band 5:
- Make grammar mistakes throughout, with over 30% hindering understanding and creating misunderstanding of intent

Band 4:
- Make grammar mistakes throughout, with over 50% hindering understanding and creating misunderstanding of intent

Vocabulary
Band 9:
- Use at least 6 B2-C2 level collocations
- No awkward vocabulary use and no vocabulary mistakes
- At least 4 C2 level vocabulary items

Band 8:
- Use at least 6 B2-C2 level collocations
- No awkward vocabulary use and no vocabulary mistakes
- At least 2 C2 level vocabulary items

Band 7:
- Use at least 6 B1+ collocations
- No wrong word use, up to 3 awkward phrases allowed

Band 6:
- Mostly use basic vocabulary
- Mistakes occur throughout, but they do not hinder understanding

Band 5:
- Mostly use basic vocabulary
- Mistakes occur throughout and hinder understanding, up to 5 mistakes

Band 4:
- Mostly use basic vocabulary
- Mistakes occur throughout and hinder understanding, more than 5 mistakes

Fluency
Band 9:
- Use more than 5 referencing words such as this, that, those, such
- No hesitation and no self-correction
- No vagueness in vocabulary or grammar
- Use at least 3 transitional words properly
- All questions receive clear explanation and/or example support

Band 8:
- Use more than 5 referencing words
- If there is self-correction, it is always correct
- No vagueness in vocabulary or grammar
- Use at least 3 transitional words properly
- All questions receive clear explanation and/or example support

Band 7:
- Use more than 3 referencing words
- If there is self-correction, it is always correct, with up to 1 mistake only
- No vagueness in vocabulary or grammar
- Use at least 2 transitional words properly
- Most questions receive clear explanation and/or example support, though some answers may still be too general

Band 6:
- Use more than 3 referencing words
- If there is self-correction, it is sometimes wrong from 2 mistakes
- Some vagueness in vocabulary/grammar is allowed, but it must not hinder understanding
- Most questions receive clear explanation and/or example support, though some answers may still be too general

Band 5:
- If there is self-correction, it is mostly wrong from 4 mistakes
- Vagueness in vocabulary/grammar hinders understanding
- Ideas lack support such as reasons or examples

Band 4:
- If there is self-correction, it is mostly wrong more than 50%
- Vagueness in vocabulary/grammar hinders understanding
- Ideas lack support such as reasons or examples

Topic: ${topic}
Prompt: ${prompt}
Cue points: ${cues.join(' | ')}
Duration seconds: ${durationSeconds}
Punctuated transcript:
${punctuatedTranscript || '(empty)'}
ASR transcript (backup evidence):
${whisperTranscript || '(empty)'}
Question breakdown:
${Array.isArray(questionBreakdown) && questionBreakdown.length
    ? questionBreakdown
        .map(
          (item, index) =>
            `[${index}] Question: ${item.question || 'Question'}\nAnswer: ${item.punctuatedTranscript || item.rawTranscript || '(empty)'}`
        )
        .join('\n\n')
    : '(none)'}
`

const fullMockSection1Prompt = ({ part1Questions, part1Transcript }) => `
You are an English Plan IELTS Speaking coach.
You are reviewing ONLY Speaking Part 1.

Return only valid JSON with this schema:
{
  "introThai": string,
  "analysisThai": string,
  "mistakes": [
    {
      "issue": string,
      "evidence": string,
      "suggestion": string
    }
  ]
}

Rules:
- Focus only on grammatical mistakes from Part 1.
- Do NOT calculate or mention a band score.
- The tone should match English Plan coaching in Thai.
- Use the polite Thai register with "ครับ" and never "ค่ะ".
- Keep introThai short and clear: explain that Part 1 mostly shows the student's language foundation.
- analysisThai should explain what the mistakes suggest about the student's grammar foundation.
- mistakes should contain concrete Evidence -> Suggestion items.
- mistakes.suggestion must be Thai.
- If there are no clear mistakes, return an empty mistakes array and say that grammar foundation looked stable.
- Maximum 20 mistakes.

Part 1 questions:
${part1Questions.length ? part1Questions.map((item, index) => `${index + 1}. ${item}`).join('\n') : '(none)'}

Part 1 transcript:
${part1Transcript || '(empty)'}
`

const customVocabularyLiftPrompt = ({ testMode, punctuatedTranscript, questionBreakdown }) => `
You are an English Plan IELTS Speaking vocabulary coach.

Create fresh, answer-specific vocabulary upgrade suggestions based ONLY on the learner's exact submitted answer.

Return only valid JSON with this schema:
{
  "suggestions": [
    {
      "sourceQuestionIndex": number,
      "sourceQuestion": string,
      "sourcePhrase": string,
      "replacement": string,
      "level": string,
      "thaiMeaning": string,
      "reasonThai": string
    }
  ]
}

Rules:
- Generate 4-10 suggestions only when the learner actually used a phrase that can be improved.
- Every sourcePhrase must appear verbatim in the learner transcript.
- replacement must be a more natural or more precise phrase for IELTS speaking, not just a synonym list.
- Prioritize spoken English over academic or essay-style English.
- Prefer conversational, natural, high-scoring spoken phrases that a candidate could realistically say under time pressure.
- Avoid upgrades that sound too formal, too literary, too academic, or like written IELTS essays unless the original answer clearly needs that exact register.
- If two possible upgrades exist, choose the one that sounds more natural when spoken aloud.
- Do NOT fix grammar globally. Focus only on vocabulary, collocation, phrasing, and naturalness.
- sourceQuestionIndex is zero-based. Use -1 if the transcript is not question-split.
- level should be one of: A2, B1, B2, C1, C2.
- thaiMeaning and reasonThai must be Thai.
- Use the polite Thai register with "ครับ" and never "ค่ะ".
- Avoid repeating the same replacement idea.
- If the answer is already strong, still provide a few meaningful refinement ideas instead of generic fillers.
- In reasonThai, explain briefly why the new phrase sounds more natural in spoken English.

Test mode: ${testMode}
Full punctuated transcript:
${punctuatedTranscript || '(empty)'}

Question breakdown:
${Array.isArray(questionBreakdown) && questionBreakdown.length
    ? questionBreakdown
        .map(
          (item, index) =>
            `[${index}] Question: ${item.question || 'Question'}\nAnswer: ${item.punctuatedTranscript || item.rawTranscript || '(empty)'}`
        )
        .join('\n\n')
    : '(none)'}
`

const transcriptAnnotationPrompt = ({ testMode, questionBreakdown, part3AnswerCoaching, componentReports }) => `
You are an English Plan IELTS Speaking coach.

Create transcript-linked improvement annotations so the UI can highlight exact weak spots in each answer.

Return only valid JSON with this schema:
{
  "items": [
    {
      "questionIndex": number,
      "annotations": [
        {
          "label": string,
          "issueType": string,
          "highlightText": string,
          "commentThai": string
        }
      ]
    }
  ]
}

Rules:
- questionIndex is zero-based and must match the question breakdown below.
- annotations should be concrete and tied to exact text the learner said.
- highlightText must appear verbatim inside that answer's punctuated transcript.
- issueType should be one of: grammar, vocabulary, fluency, explanation, example, transition.
- label should be short, such as "Need example", "Awkward wording", "Weak reason", "Grammar slip".
- commentThai must be short, practical Thai coaching.
- Use the polite Thai register with "ครับ" and never "ค่ะ".
- Add 0-3 annotations per answer.
- If there is a clear grammar problem, prioritize at least one grammar annotation with the exact wrong phrase.
- If an answer lacks explanation or example, prefer issueType "explanation" or "example" over generic fluency.
- For Part 3, use the coaching priorities below when relevant.
- Do not invent highlights that are not in the transcript.

Test mode: ${testMode}

Part 3 coaching priorities:
${Array.isArray(part3AnswerCoaching) && part3AnswerCoaching.length
    ? part3AnswerCoaching
        .map((item, index) => `Q${index + 1} ${item.question}: ${item.missing.join(', ')} | ${item.suggestionThai}`)
        .join('\n')
    : '(none)'}

Criterion summaries:
Grammar: ${componentReports?.grammar?.explanationThai || '(none)'}
Vocabulary: ${componentReports?.lexical?.explanationThai || '(none)'}
Fluency: ${componentReports?.fluency?.explanationThai || '(none)'}

Question breakdown:
${Array.isArray(questionBreakdown) && questionBreakdown.length
    ? questionBreakdown
        .map(
          (item, index) =>
            `[${index}] Question: ${item.question || 'Question'}\nAnswer: ${item.punctuatedTranscript || item.rawTranscript || '(empty)'}`
        )
        .join('\n\n')
    : '(none)'}
`

const parseModelJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    throw new Error('No JSON found in model response.')
  }
  const candidate = String(match[0] || '').trim()
  try {
    return JSON.parse(candidate)
  } catch {
    const repaired = candidate
      .replace(/```json|```/gi, '')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3')
      .replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ': "$1"')
    try {
      return JSON.parse(repaired)
    } catch {
      // Last-resort tolerant parse for near-JSON model output.
      // Input comes from LLM providers, not end users.
      const tolerant = Function(`"use strict"; return (${repaired});`)()
      if (tolerant && typeof tolerant === 'object') return tolerant
      throw new Error('No valid JSON object found in model response.')
    }
  }
}

const clampBand = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  return Math.min(9, Math.max(0, Number(num.toFixed(1))))
}

const sanitizeErrorMessage = (value) => {
  const message = String(value || '').replace(/sk-[a-zA-Z0-9_-]+/g, '[redacted-key]')
  const lower = message.toLowerCase()
  if (lower.includes('11201') || lower.includes('licc failed')) {
    return 'ENGLISH PLAN rejected this app (code 11201: license/entitlement mismatch for current endpoint).'
  }
  if (lower.includes('timeout')) {
    return 'ENGLISH PLAN took too long to respond. Please try again.'
  }
  return message.slice(0, 200)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const safeFetch = async (url, options = {}, { timeoutMs = 45000, retries = 1, retryDelayMs = 700 } = {}) => {
  let lastError = null
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeout)
      return response
    } catch (error) {
      clearTimeout(timeout)
      lastError = error
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1))
        continue
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const normalizeSupabaseUrl = (value) => {
  const raw = String(value || '').trim().replace(/\/$/, '')
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  // Accept a plain project ref copied from Supabase settings, e.g. "abcd1234xyz".
  if (/^[a-z0-9-]{8,}$/i.test(raw) && !raw.includes('.')) {
    return `https://${raw}.supabase.co`
  }

  // Accept host-only values like "abcd1234xyz.supabase.co".
  if (/^[a-z0-9-]+\.supabase\.co$/i.test(raw)) {
    return `https://${raw}`
  }

  return raw
}

const SUPABASE_URL = normalizeSupabaseUrl(process.env.SUPABASE_URL)
const SUPABASE_ANON_KEY = String(process.env.SUPABASE_ANON_KEY || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const SUPABASE_TTS_BUCKET = String(process.env.SUPABASE_TTS_BUCKET || 'speaking-question-audio').trim()
const QUESTION_AUDIO_MANIFEST_PATH = '_manifests/question-audio.json'
let questionAudioBucketReady = false
let questionAudioManifestCache = null
const SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET = String(
  process.env.SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET || 'speaking-sample-videos'
).trim()
const SPEAKING_SAMPLE_VIDEO_SIGNED_URL_SECONDS = Math.max(
  300,
  Number(process.env.SPEAKING_SAMPLE_VIDEO_SIGNED_URL_SECONDS || 60 * 60 * 6)
)
const SPEAKING_SAMPLE_VIDEO_PLAYBACK_SECONDS = Math.max(
  300,
  Number(process.env.SPEAKING_SAMPLE_VIDEO_PLAYBACK_SECONDS || 60 * 60 * 24)
)
const SPEAKING_SAMPLE_VIDEO_PROXY_CHUNK_BYTES = Math.min(
  2 * 1024 * 1024,
  Math.max(256 * 1024, Number(process.env.SPEAKING_SAMPLE_VIDEO_PROXY_CHUNK_BYTES || 1024 * 1024))
)
const SPEAKING_SAMPLE_VIDEO_MANIFEST_PATH = '_manifests/speaking-sample-videos.json'
let speakingSampleVideoBucketReady = false
let speakingSampleVideoManifestCache = null
const SUPABASE_REPORTS_BUCKET = String(process.env.SUPABASE_REPORTS_BUCKET || 'assessment-report-history').trim()
const ASSESSMENT_REPORT_INDEX_PATH = '_manifests/assessment-reports.json'
let assessmentReportsBucketReady = false
let assessmentReportsIndexCache = null
const SUPABASE_READING_PDOY_PROGRESS_BUCKET = String(process.env.SUPABASE_READING_PDOY_PROGRESS_BUCKET || 'reading-pdoy-progress').trim()
const READING_PDOY_PROGRESS_INDEX_PATH = '_manifests/reading-pdoy-progress.json'
let readingPdoyProgressBucketReady = false
let readingPdoyProgressIndexCache = null
const SUPABASE_READING_ATTEMPTS_BUCKET = String(process.env.SUPABASE_READING_ATTEMPTS_BUCKET || 'reading-attempt-history').trim()
let readingAttemptsBucketReady = false

const ensureSupabaseConfigured = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY')
  }
}

const buildSupabaseUrl = (path) => `${SUPABASE_URL}${path}`

const buildSupabaseHeaders = ({ serviceRole = false, accessToken, includeJson = true, prefer } = {}) => {
  ensureSupabaseConfigured()
  const apiKey = serviceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY
  return {
    apikey: apiKey,
    Authorization: `Bearer ${accessToken || apiKey}`,
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    ...(prefer ? { Prefer: prefer } : {})
  }
}

const parseJsonSafe = async (response) => {
  const text = await response.text().catch(() => '')
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const supabaseRequest = async (path, options = {}, requestOptions) => {
  ensureSupabaseConfigured()
  let response
  try {
    response = await safeFetch(buildSupabaseUrl(path), options, requestOptions)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || '')
    const hint =
      SUPABASE_URL && !/^https?:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL)
        ? ` Check SUPABASE_URL format: ${SUPABASE_URL}`
        : ''
    throw new Error(`Could not reach Supabase.${hint}${message ? ` ${message}` : ''}`.trim())
  }
  if (!response.ok) {
    const payload = await parseJsonSafe(response)
    const message =
      payload?.msg ||
      payload?.error_description ||
      payload?.error ||
      payload?.message ||
      response.statusText ||
      'Supabase request failed.'
    const error = new Error(String(message))
    error.status = response.status
    error.payload = payload
    throw error
  }
  return response
}

const fetchSupabaseJson = async (path, options = {}, requestOptions) => {
  const response = await supabaseRequest(path, options, requestOptions)
  return parseJsonSafe(response)
}

const slugifyAudioSegment = (value, fallback = 'item') => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return normalized || fallback
}

const hashQuestionAudioText = (text) =>
  createHash('sha1')
    .update(String(text || '').trim())
    .digest('hex')
    .slice(0, 12)

const encodeStorageObjectPath = (value) =>
  String(value || '')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

const buildSupabaseStorageObjectUrl = ({ bucket, objectPath, publicAsset = false }) =>
  `${SUPABASE_URL}/storage/v1/object/${publicAsset ? 'public/' : ''}${encodeURIComponent(bucket)}/${encodeStorageObjectPath(
    objectPath
  )}`

const normalizeQuestionAudioItemInput = (value = {}) => {
  const text = String(value?.text || value?.question || '').trim()
  const cacheKey = slugifyAudioSegment(value?.cacheKey || value?.key || '')
  if (!text || !cacheKey) return null
  const rawSection = String(value?.section || '').trim()
  const section = /part\s*3/i.test(rawSection)
    ? 'part3'
    : /part\s*1/i.test(rawSection)
      ? 'part1'
      : slugifyAudioSegment(rawSection, 'part1')
  const topicId = slugifyAudioSegment(value?.topicId || value?.topicTitle || section)
  const topicTitle = String(value?.topicTitle || value?.topicId || section).trim() || section
  return {
    cacheKey,
    text,
    section,
    topicId,
    topicTitle
  }
}

const buildQuestionAudioObjectPath = (item) => {
  const textHash = hashQuestionAudioText(item.text)
  return {
    textHash,
    objectPath: `${item.section}/${item.topicId}/${item.cacheKey}-${textHash}.mp3`
  }
}

const getVideoExtensionFromMimeType = (mimeType) => {
  const normalized = String(mimeType || '').toLowerCase()
  if (normalized.includes('mp4')) return 'mp4'
  if (normalized.includes('ogg')) return 'ogv'
  return 'webm'
}

const isMissingSupabaseRelationError = (error) => {
  const text = `${error?.message || ''} ${JSON.stringify(error?.payload || {})}`.toLowerCase()
  return (
    error?.status === 404 ||
    /relation .* does not exist|schema cache|could not find the table|pgrst205|not_found/.test(text)
  )
}

const isSupabaseMissingResourceError = (error) => {
  const text = `${error?.message || ''} ${JSON.stringify(error?.payload || {})}`.toLowerCase()
  return error?.status === 404 || /bucket not[_ ]found|not[_ ]found|resource/.test(text)
}

const normalizeSignedStorageUrl = (signedUrl) => {
  const value = String(signedUrl || '').trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `${SUPABASE_URL}${value.startsWith('/') ? '' : '/'}${value}`
}

const readVideoFileSignature = (filePath) => {
  const fd = fs.openSync(filePath, 'r')
  try {
    const buffer = Buffer.alloc(16)
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0)
    const signature = buffer.subarray(0, bytesRead)
    const ascii = signature.toString('ascii')
    if (signature[0] === 0x1a && signature[1] === 0x45 && signature[2] === 0xdf && signature[3] === 0xa3) {
      return { isVideo: true, mimeType: 'video/webm' }
    }
    if (ascii.includes('ftyp')) {
      return { isVideo: true, mimeType: 'video/mp4' }
    }
    if (ascii.startsWith('OggS')) {
      return { isVideo: true, mimeType: 'video/ogg' }
    }
    return { isVideo: false, mimeType: '' }
  } finally {
    fs.closeSync(fd)
  }
}

const looksLikeVideoFile = (filePath, mimeType = '') => {
  const normalized = String(mimeType || '').toLowerCase()
  const signature = readVideoFileSignature(filePath)
  return signature.isVideo && (
    /^video\/(webm|mp4|ogg|quicktime|x-matroska)/.test(normalized) ||
    normalized === 'application/octet-stream' ||
    normalized === 'binary/octet-stream' ||
    !normalized
  )
}

const normalizeUploadedVideoMimeType = (file) => {
  const rawMimeType = String(file?.mimetype || '').toLowerCase()
  const originalName = String(file?.originalname || '').toLowerCase()
  const signature = file?.path ? readVideoFileSignature(file.path) : { isVideo: false, mimeType: '' }
  if (!signature.isVideo) return { mimeType: rawMimeType || 'application/octet-stream', isVideo: false }
  if (/^video\/(webm|mp4|ogg|quicktime|x-matroska)/.test(rawMimeType)) {
    return { mimeType: rawMimeType, isVideo: true }
  }
  if (originalName.endsWith('.mp4') || signature.mimeType === 'video/mp4') return { mimeType: 'video/mp4', isVideo: true }
  if (originalName.endsWith('.ogv') || originalName.endsWith('.ogg') || signature.mimeType === 'video/ogg') {
    return { mimeType: 'video/ogg', isVideo: true }
  }
  return { mimeType: signature.mimeType || 'video/webm', isVideo: true }
}

const normalizeSpeakingSampleVideoInput = (body = {}) => {
  const topicId = String(body.topicId || body.topic_id || '').trim().slice(0, 240)
  const topicTitle = String(body.topicTitle || body.topic_title || '').trim()
  const prompt = String(body.prompt || '').trim()
  const durationSeconds = Math.max(0, Math.round(Number(body.durationSeconds || body.duration_seconds || 0) || 0))
  const trimStartSeconds = Math.min(durationSeconds || Number.MAX_SAFE_INTEGER, Math.max(0, Number(body.trimStartSeconds || body.trim_start_seconds || 0) || 0))
  const requestedTrimEnd = Number(body.trimEndSeconds || body.trim_end_seconds || 0) || 0
  const trimEndSeconds = Math.min(
    durationSeconds || Number.MAX_SAFE_INTEGER,
    Math.max(trimStartSeconds, requestedTrimEnd || durationSeconds || trimStartSeconds)
  )
  const videoDeviceLabel = String(body.videoDeviceLabel || body.video_device_label || '').trim().slice(0, 500)
  const audioDeviceLabel = String(body.audioDeviceLabel || body.audio_device_label || '').trim().slice(0, 500)
  const backgroundBlurEnabled = String(body.backgroundBlurEnabled || body.background_blur_enabled || '').toLowerCase() === 'true'
  const transcript = String(body.transcript || '').trim().slice(0, 50000)
  const subtitles = normalizeSpeakingSampleSubtitles(body.subtitlesJson || body.subtitles || '')
  const subtitleStyle = normalizeSpeakingSampleSubtitleStyle(body.subtitleStyleJson || body.subtitle_style || body.subtitleStyle || '')
  if (!topicId || !topicTitle) return null
  return {
    topicId,
    topicTitle,
    prompt,
    durationSeconds,
    trimStartSeconds,
    trimEndSeconds,
    videoDeviceLabel,
    audioDeviceLabel,
    backgroundBlurEnabled,
    transcript,
    subtitles,
    subtitleStyle
  }
}

const roundSpeakingSampleSubtitleSeconds = (seconds) =>
  Number((Number.isFinite(Number(seconds)) ? Number(seconds) : 0).toFixed(3))

const normalizeSpeakingSampleSubtitleNoteText = (value) =>
  String(value || '').trim().replace(/\s+/g, ' ')

const normalizeSpeakingSampleSubtitleNotes = (value) => {
  const items = Array.isArray(value) ? value : []
  return items
    .slice(0, 12)
    .map((item, index) => ({
      id: String(item?.id || `note-${index + 1}`).slice(0, 120),
      phrase: normalizeSpeakingSampleSubtitleNoteText(item?.phrase || item?.word || item?.term || '').slice(0, 160),
      detail: String(item?.detail || item?.explanation || item?.description || '').trim().slice(0, 800),
      kind: item?.kind === 'grammar' || item?.kind === 'vocabulary' ? item.kind : undefined,
      partOfSpeech: String(item?.partOfSpeech || item?.part_of_speech || '').trim().slice(0, 40),
      thaiMeaning: String(item?.thaiMeaning || item?.thai_meaning || '').trim().slice(0, 240),
      grammarRule: String(item?.grammarRule || item?.grammar_rule || '').trim().slice(0, 120),
      exampleSentence: String(item?.exampleSentence || item?.example_sentence || '').trim().slice(0, 240)
    }))
    .filter(
      (item) =>
        item.phrase &&
        (item.detail || item.thaiMeaning || item.grammarRule || item.partOfSpeech)
    )
}

const normalizeSpeakingSampleSubtitles = (value) => {
  let raw = value
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      raw = JSON.parse(trimmed)
    } catch {
      return []
    }
  }
  const items = Array.isArray(raw) ? raw : []
  return items
    .slice(0, 200)
    .map((item, index) => {
      const startSeconds = Math.max(0, Number(item?.startSeconds ?? item?.start_seconds ?? 0) || 0)
      const endSeconds = Math.max(startSeconds + 0.12, Number(item?.endSeconds ?? item?.end_seconds ?? startSeconds + 3) || startSeconds + 3)
      const text = String(item?.text || '').trim().slice(0, 1000)
      const confidence = Number(item?.confidence)
      const notes = normalizeSpeakingSampleSubtitleNotes(item?.notes || item?.details || [])
      return {
        id: String(item?.id || `cue-${index + 1}`).slice(0, 80),
        startSeconds: roundSpeakingSampleSubtitleSeconds(startSeconds),
        endSeconds: roundSpeakingSampleSubtitleSeconds(endSeconds),
        text,
        ...(notes.length ? { notes } : {}),
        ...(Number.isFinite(confidence) ? { confidence: Math.max(0, Math.min(1, confidence)) } : {})
      }
    })
    .filter((item) => item.text)
}

const buildSpeakingSampleSubtitlesFromWords = ({ words = [], transcript = '', trimStartSeconds = 0, trimEndSeconds = 0 }) => {
  const rawTimedWords = Array.isArray(words)
    ? words
        .map((item) => ({
          word: String(item?.word || '').trim(),
          start: Math.max(0, Number(item?.start || 0) || 0),
          end: Math.max(0, Number(item?.end || 0) || 0),
          confidence: Math.max(0, Math.min(1, Number(item?.confidence ?? 0.75) || 0.75))
        }))
        .filter((item) => item.word)
    : []
  const hasTrimRange = trimEndSeconds > trimStartSeconds
  const usableWords = rawTimedWords
    .filter((item) => !hasTrimRange || (item.end >= trimStartSeconds && item.start <= trimEndSeconds))
    .map((item) => ({
      ...item,
      start: hasTrimRange ? Math.max(trimStartSeconds, item.start) : item.start,
      end: hasTrimRange ? Math.min(trimEndSeconds, Math.max(item.end, item.start)) : item.end
    }))
    .filter((item) => item.end > item.start)
  if (!usableWords.length) {
    const rawWords = String(transcript || '').trim().split(/\s+/).filter(Boolean)
    const duration = Math.max(6, (trimEndSeconds > trimStartSeconds ? trimEndSeconds - trimStartSeconds : rawWords.length / 2.4) || 6)
    const chunks = []
    for (let index = 0; index < rawWords.length; index += 4) {
      chunks.push(rawWords.slice(index, index + 4).join(' '))
    }
    const cueDuration = duration / Math.max(1, chunks.length)
    return chunks.map((text, index) => ({
      id: `cue-${index + 1}`,
      startSeconds: roundSpeakingSampleSubtitleSeconds(trimStartSeconds + index * cueDuration),
      endSeconds: roundSpeakingSampleSubtitleSeconds(trimStartSeconds + Math.min(duration, (index + 1) * cueDuration)),
      text,
      confidence: 0.6
    }))
  }

  const cues = []
  let currentWords = []
  let currentStart = usableWords[0].start
  usableWords.forEach((word, index) => {
    const previous = usableWords[index - 1]
    const gap = previous ? word.start - previous.end : 0
    const currentDuration = Math.max(0, (previous?.end || word.end) - currentStart)
    const textIfAdded = [...currentWords, word.word].join(' ')
    const shouldBreak =
      currentWords.length >= 3 ||
      currentDuration >= 1.25 ||
      gap > 0.38 ||
      /[.!?]$/.test(previous?.word || '') ||
      textIfAdded.length > 26
    if (currentWords.length && shouldBreak) {
      const cueWords = usableWords.slice(index - currentWords.length, index)
      const confidence =
        cueWords.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, cueWords.length)
      const cueEnd = Math.max(currentStart + 0.16, previous?.end || word.start)
      cues.push({
        id: `cue-${cues.length + 1}`,
        startSeconds: roundSpeakingSampleSubtitleSeconds(Math.max(0, currentStart - 0.035)),
        endSeconds: roundSpeakingSampleSubtitleSeconds(cueEnd + 0.045),
        text: currentWords.join(' '),
        confidence: Number(confidence.toFixed(2))
      })
      currentWords = []
      currentStart = word.start
    }
    currentWords.push(word.word)
  })
  if (currentWords.length) {
    const cueWords = usableWords.slice(-currentWords.length)
    const confidence =
      cueWords.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, cueWords.length)
    const cueEnd = Math.max(currentStart + 0.16, cueWords[cueWords.length - 1]?.end || currentStart + 0.45)
    cues.push({
      id: `cue-${cues.length + 1}`,
      startSeconds: roundSpeakingSampleSubtitleSeconds(Math.max(0, currentStart - 0.035)),
      endSeconds: roundSpeakingSampleSubtitleSeconds(cueEnd + 0.045),
      text: currentWords.join(' '),
      confidence: Number(confidence.toFixed(2))
    })
  }
  const boundedTrimEnd = Number(trimEndSeconds || 0)
  return cues.map((cue) => ({
    ...cue,
    endSeconds: roundSpeakingSampleSubtitleSeconds(
      boundedTrimEnd > 0 ? Math.min(boundedTrimEnd, Math.max(cue.startSeconds + 0.12, cue.endSeconds)) : cue.endSeconds
    )
  }))
}

const normalizeSpeakingSampleSubtitleStyle = (value) => {
  let raw = value
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return {}
    try {
      raw = JSON.parse(trimmed)
    } catch {
      return {}
    }
  }
  if (!raw || typeof raw !== 'object') return {}
  const colorPattern = /^#[0-9a-f]{6}$/i
  const textAlign = ['left', 'center', 'right'].includes(String(raw.textAlign || ''))
    ? String(raw.textAlign)
    : 'center'
  return {
    fontFamily: String(raw.fontFamily || '').slice(0, 300),
    textColor: colorPattern.test(String(raw.textColor || '')) ? String(raw.textColor) : '#ffffff',
    backgroundColor: colorPattern.test(String(raw.backgroundColor || '')) ? String(raw.backgroundColor) : '#0f172a',
    fontSize: Math.min(42, Math.max(14, Number(raw.fontSize || 22) || 22)),
    boxWidthPercent: Math.min(96, Math.max(35, Number(raw.boxWidthPercent || 78) || 78)),
    verticalPositionPercent: Math.min(92, Math.max(12, Number(raw.verticalPositionPercent || 82) || 82)),
    horizontalPositionPercent: Math.min(90, Math.max(10, Number(raw.horizontalPositionPercent || 50) || 50)),
    textAlign,
    videoFlipHorizontal: raw.videoFlipHorizontal === true || String(raw.videoFlipHorizontal || '').toLowerCase() === 'true'
  }
}

const ensureSpeakingSampleVideoBucket = async () => {
  if (speakingSampleVideoBucketReady) return
  ensureSupabaseConfigured()
  try {
    const bucket = await fetchSupabaseJson(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}`, {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    })
    if (bucket && bucket.public !== false) {
      await supabaseRequest(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}`, {
        method: 'PUT',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          id: SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET,
          name: SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET,
          public: false
        })
      })
    }
  } catch (error) {
    if (!isSupabaseMissingResourceError(error)) {
      throw error
    }
    await supabaseRequest('/storage/v1/bucket', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        id: SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET,
        name: SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET,
        public: false
      })
    })
  }
  speakingSampleVideoBucketReady = true
}

const loadSpeakingSampleVideoManifest = async ({ forceRefresh = false } = {}) => {
  if (speakingSampleVideoManifestCache && !forceRefresh) return speakingSampleVideoManifestCache
  await ensureSpeakingSampleVideoBucket()
  let response
  try {
    response = await supabaseRequest(
      `/storage/v1/object/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}/${encodeStorageObjectPath(
        SPEAKING_SAMPLE_VIDEO_MANIFEST_PATH
      )}`,
      {
        method: 'GET',
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      },
      { timeoutMs: 10000, retries: 0 }
    )
  } catch (error) {
    if (!isSupabaseMissingResourceError(error)) {
      throw error
    }
    speakingSampleVideoManifestCache = { items: {} }
    return speakingSampleVideoManifestCache
  }
  const payload = await parseJsonSafe(response)
  speakingSampleVideoManifestCache = payload && typeof payload === 'object' ? payload : { items: {} }
  if (!speakingSampleVideoManifestCache.items || typeof speakingSampleVideoManifestCache.items !== 'object') {
    speakingSampleVideoManifestCache.items = {}
  }
  return speakingSampleVideoManifestCache
}

const saveSpeakingSampleVideoManifest = async (manifest) => {
  await ensureSpeakingSampleVideoBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}/${encodeStorageObjectPath(
      SPEAKING_SAMPLE_VIDEO_MANIFEST_PATH
    )}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '3600'
      },
      body: JSON.stringify(manifest)
    }
  )
  speakingSampleVideoManifestCache = manifest
}

const uploadSpeakingSampleVideoFile = async ({ objectPath, filePath, mimeType }) => {
  await ensureSpeakingSampleVideoBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': mimeType || 'video/webm',
        'x-upsert': 'true',
        'cache-control': '31536000'
      },
      body: fs.createReadStream(filePath),
      duplex: 'half'
    },
    { timeoutMs: 120000, retries: 0 }
  )
}

const hashFileSha256 = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = fs.createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(hash.digest('hex')))
  })

const deleteSpeakingSampleVideoObject = async (objectPath) => {
  const normalized = String(objectPath || '').trim()
  if (!normalized) return
  await ensureSpeakingSampleVideoBucket()
  await supabaseRequest(`/storage/v1/object/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}`, {
    method: 'DELETE',
    headers: buildSupabaseHeaders({ serviceRole: true }),
    body: JSON.stringify({ prefixes: [normalized] })
  })
}

const signSpeakingSampleVideoObject = async (objectPath) => {
  const normalized = String(objectPath || '').trim()
  if (!normalized) return ''
  await ensureSpeakingSampleVideoBucket()
  const payload = await fetchSupabaseJson(
    `/storage/v1/object/sign/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}/${encodeStorageObjectPath(normalized)}`,
    {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({ expiresIn: SPEAKING_SAMPLE_VIDEO_SIGNED_URL_SECONDS })
    }
  )
  return normalizeSignedStorageUrl(payload?.signedURL || payload?.signedUrl || payload?.url)
}

const getSpeakingSampleVideoPlaybackSecret = () =>
  String(process.env.SPEAKING_SAMPLE_VIDEO_PLAYBACK_SECRET || SUPABASE_SERVICE_ROLE_KEY || ADMIN_PANEL_CODE).trim()

const createSpeakingSampleVideoPlaybackSignature = ({ topicId, objectPath, version, expiresAt }) =>
  createHmac('sha256', getSpeakingSampleVideoPlaybackSecret())
    .update([topicId, objectPath, version || 1, expiresAt].map((value) => String(value || '')).join('\n'))
    .digest('hex')

const createSpeakingSampleVideoPlaybackUrl = (item) => {
  const topicId = String(item?.topicId || item?.id || '').trim()
  const objectPath = String(item?.objectPath || '').trim()
  if (!topicId || !objectPath) return ''
  const expiresAt = Math.floor(Date.now() / 1000) + SPEAKING_SAMPLE_VIDEO_PLAYBACK_SECONDS
  const version = Number(item?.version || 1) || 1
  const params = new URLSearchParams({
    v: String(version),
    exp: String(expiresAt),
    sig: createSpeakingSampleVideoPlaybackSignature({ topicId, objectPath, version, expiresAt })
  })
  return `/api/speaking-sample-videos/${encodeURIComponent(topicId)}/blob?${params.toString()}`
}

const verifySpeakingSampleVideoPlaybackSignature = (item, query = {}) => {
  const expiresAt = Number(query.exp || 0)
  const signature = String(query.sig || '').trim()
  const version = Number(query.v || item?.version || 1) || 1
  if (!expiresAt || !signature || expiresAt < Math.floor(Date.now() / 1000)) return false
  const expected = createSpeakingSampleVideoPlaybackSignature({
    topicId: item.topicId,
    objectPath: item.objectPath,
    version,
    expiresAt
  })
  try {
    const receivedBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expected, 'hex')
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
  } catch {
    return false
  }
}

const mapSpeakingSampleVideoDbRecord = (row = {}) => ({
  id: String(row.topic_id || row.id || ''),
  topicId: String(row.topic_id || row.id || ''),
  topicTitle: String(row.topic_title || ''),
  prompt: String(row.prompt || ''),
  objectPath: String(row.object_path || ''),
  videoUrl: String(row.video_url || ''),
  mimeType: String(row.mime_type || 'video/webm'),
  sizeBytes: Number(row.size_bytes || 0),
  durationSeconds: Number(row.duration_seconds || 0),
  trimStartSeconds: Number(row.trim_start_seconds || 0),
  trimEndSeconds: Number(row.trim_end_seconds || row.duration_seconds || 0),
  videoDeviceLabel: String(row.video_device_label || ''),
  audioDeviceLabel: String(row.audio_device_label || ''),
  backgroundBlurEnabled: row.background_blur_enabled === true,
  transcript: String(row.transcript || ''),
  subtitles: normalizeSpeakingSampleSubtitles(row.subtitles || []),
  subtitleStyle: normalizeSpeakingSampleSubtitleStyle(row.subtitle_style || {}),
  version: Number(row.version || 1),
  storageProvider: String(row.storage_provider || 'supabase'),
  checksumSha256: String(row.checksum_sha256 || ''),
  isActive: row.is_active !== false,
  createdAt: String(row.created_at || ''),
  updatedAt: String(row.updated_at || row.created_at || ''),
  uploadedBy: String(row.created_by_email || '')
})

const signSpeakingSampleVideoItem = async (item) => {
  const playbackUrl = createSpeakingSampleVideoPlaybackUrl(item)
  return {
    ...item,
    videoUrl: playbackUrl,
    isPrivate: true,
    signedUrlExpiresAt: new Date(Date.now() + SPEAKING_SAMPLE_VIDEO_PLAYBACK_SECONDS * 1000).toISOString()
  }
}

const findSpeakingSampleVideoRecordByTopicId = async (topicId, { forceRefresh = false } = {}) => {
  const normalizedTopicId = String(topicId || '').trim()
  if (!normalizedTopicId) return null
  const records = await loadSpeakingSampleVideoRecords({ forceRefresh })
  return records.find((item) => String(item.topicId) === normalizedTopicId) || null
}

const parseHttpByteRange = (rangeHeader, totalSize) => {
  const size = Math.max(0, Number(totalSize || 0) || 0)
  if (!size) return null
  const match = String(rangeHeader || '').match(/^bytes=(\d*)-(\d*)$/i)
  if (!match) {
    return { start: 0, end: Math.min(size - 1, SPEAKING_SAMPLE_VIDEO_PROXY_CHUNK_BYTES - 1) }
  }
  let start
  let end
  if (match[1] === '' && match[2] !== '') {
    const suffixLength = Math.min(size, Math.max(1, Number(match[2]) || 1))
    start = Math.max(0, size - suffixLength)
    end = size - 1
  } else {
    start = Math.min(size - 1, Math.max(0, Number(match[1]) || 0))
    end = match[2] !== '' ? Math.min(size - 1, Math.max(start, Number(match[2]) || start)) : size - 1
  }
  end = Math.min(end, start + SPEAKING_SAMPLE_VIDEO_PROXY_CHUNK_BYTES - 1)
  return { start, end }
}

const sendSpeakingSampleVideoBlob = async (req, res, item) => {
  const sizeBytes = Math.max(0, Number(item.sizeBytes || 0) || 0)
  const requestedRange = String(req.headers.range || '').trim()
  const boundedRange = parseHttpByteRange(requestedRange, sizeBytes)
  const headers = buildSupabaseHeaders({ serviceRole: true, includeJson: false })
  if (boundedRange) headers.Range = `bytes=${boundedRange.start}-${boundedRange.end}`
  const response = await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_SPEAKING_SAMPLE_VIDEO_BUCKET)}/${encodeStorageObjectPath(item.objectPath)}`,
    { headers },
    { timeoutMs: 120000, retries: 0 }
  )
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || item.mimeType || 'video/webm'
  if (boundedRange && sizeBytes > 0) {
    res.status(206)
    res.setHeader('Content-Range', `bytes ${boundedRange.start}-${boundedRange.start + buffer.length - 1}/${sizeBytes}`)
  } else {
    res.status(response.status === 206 ? 206 : 200)
    const contentRange = response.headers.get('content-range')
    if (contentRange) res.setHeader('Content-Range', contentRange)
  }
  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Length', String(buffer.length))
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  return res.send(buffer)
}

const loadSpeakingSampleVideoRecords = async ({ forceRefresh = false } = {}) => {
  try {
    const rows = await fetchSupabaseJson(
      '/rest/v1/speaking_sample_videos?select=topic_id,topic_title,prompt,object_path,mime_type,size_bytes,duration_seconds,trim_start_seconds,trim_end_seconds,video_device_label,audio_device_label,background_blur_enabled,transcript,subtitles,subtitle_style,version,storage_provider,checksum_sha256,is_active,created_by_email,created_at,updated_at&is_active=eq.true&deleted_at=is.null&order=topic_title.asc',
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    return Array.isArray(rows) ? rows.map(mapSpeakingSampleVideoDbRecord) : []
  } catch (error) {
    if (!isMissingSupabaseRelationError(error)) throw error
    const manifest = await loadSpeakingSampleVideoManifest({ forceRefresh })
    return Object.values(manifest.items || {})
  }
}

const saveSpeakingSampleVideoRecord = async (item, { createdBy } = {}) => {
  try {
    const previousRows = await fetchSupabaseJson(
      `/rest/v1/speaking_sample_videos?select=version,object_path&topic_id=eq.${encodeURIComponent(item.topicId)}&limit=1`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const previous = Array.isArray(previousRows) ? previousRows[0] || null : null
    const rows = await fetchSupabaseJson('/rest/v1/speaking_sample_videos', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify({
        topic_id: item.topicId,
        topic_title: item.topicTitle,
        prompt: item.prompt,
        object_path: item.objectPath,
        mime_type: item.mimeType,
        size_bytes: item.sizeBytes,
        duration_seconds: item.durationSeconds,
        trim_start_seconds: item.trimStartSeconds,
        trim_end_seconds: item.trimEndSeconds,
        video_device_label: item.videoDeviceLabel,
        audio_device_label: item.audioDeviceLabel,
        background_blur_enabled: item.backgroundBlurEnabled === true,
        transcript: item.transcript,
        subtitles: item.subtitles,
        subtitle_style: item.subtitleStyle,
        version: Number(previous?.version || 0) + 1,
        storage_provider: 'supabase',
        checksum_sha256: item.checksumSha256,
        is_active: true,
        created_by: createdBy || null,
        created_by_email: item.uploadedBy,
        deleted_at: null
      })
    })
    const saved = mapSpeakingSampleVideoDbRecord(Array.isArray(rows) ? rows[0] || {} : rows || {})
    return { item: saved, previousObjectPath: previous?.object_path || '' }
  } catch (error) {
    if (!isMissingSupabaseRelationError(error)) throw error
    return { item, previousObjectPath: '' }
  }
}

const ensureQuestionAudioBucket = async () => {
  if (questionAudioBucketReady) return
  ensureSupabaseConfigured()
  try {
    const bucket = await fetchSupabaseJson(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_TTS_BUCKET)}`, {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    })
    if (bucket && bucket.public !== true) {
      await supabaseRequest(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_TTS_BUCKET)}`, {
        method: 'PUT',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          id: SUPABASE_TTS_BUCKET,
          name: SUPABASE_TTS_BUCKET,
          public: true
        })
      })
    }
  } catch (error) {
    if (error?.status !== 404 && !(error?.status === 400 && /bucket not found|not found/i.test(String(error?.message || '')))) {
      throw error
    }
    await supabaseRequest('/storage/v1/bucket', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        id: SUPABASE_TTS_BUCKET,
        name: SUPABASE_TTS_BUCKET,
        public: true
      })
    })
  }
  questionAudioBucketReady = true
}

const loadQuestionAudioManifest = async ({ forceRefresh = false } = {}) => {
  if (questionAudioManifestCache && !forceRefresh) return questionAudioManifestCache
  await ensureQuestionAudioBucket()
  const manifestUrl = buildSupabaseStorageObjectUrl({
    bucket: SUPABASE_TTS_BUCKET,
    objectPath: QUESTION_AUDIO_MANIFEST_PATH,
    publicAsset: true
  })
  const response = await safeFetch(manifestUrl, { method: 'GET' }, { timeoutMs: 10000, retries: 0 }).catch(() => null)
  if (!response || response.status === 404) {
    questionAudioManifestCache = { items: {} }
    return questionAudioManifestCache
  }
  if (response.status === 400) {
    const body = await response.text().catch(() => '')
    if (/bucket not found|not found|resource/i.test(body)) {
      questionAudioManifestCache = { items: {} }
      return questionAudioManifestCache
    }
    throw new Error(`Could not load TTS audio manifest (${response.status}).`)
  }
  if (!response.ok) {
    throw new Error(`Could not load TTS audio manifest (${response.status}).`)
  }
  const payload = await parseJsonSafe(response)
  questionAudioManifestCache = payload && typeof payload === 'object' ? payload : { items: {} }
  if (!questionAudioManifestCache.items || typeof questionAudioManifestCache.items !== 'object') {
    questionAudioManifestCache.items = {}
  }
  return questionAudioManifestCache
}

const saveQuestionAudioManifest = async (manifest) => {
  await ensureQuestionAudioBucket()
  await supabaseRequest(`/storage/v1/object/${encodeURIComponent(SUPABASE_TTS_BUCKET)}/${encodeStorageObjectPath(QUESTION_AUDIO_MANIFEST_PATH)}`, {
    method: 'POST',
    headers: {
      ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
      'Content-Type': 'application/json',
      'x-upsert': 'true',
      'cache-control': '3600'
    },
    body: JSON.stringify(manifest)
  })
  questionAudioManifestCache = manifest
}

const ensureAssessmentReportsBucket = async () => {
  if (assessmentReportsBucketReady) return
  ensureSupabaseConfigured()
  try {
    await fetchSupabaseJson(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_REPORTS_BUCKET)}`, {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    })
  } catch (error) {
    if (error?.status !== 404) throw error
    await supabaseRequest('/storage/v1/bucket', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        id: SUPABASE_REPORTS_BUCKET,
        name: SUPABASE_REPORTS_BUCKET,
        public: false
      })
    })
  }
  assessmentReportsBucketReady = true
}

const loadAssessmentReportsIndex = async ({ forceRefresh = false } = {}) => {
  if (assessmentReportsIndexCache && !forceRefresh) return assessmentReportsIndexCache
  await ensureAssessmentReportsBucket()
  try {
    const response = await supabaseRequest(
      `/storage/v1/object/${encodeURIComponent(SUPABASE_REPORTS_BUCKET)}/${encodeStorageObjectPath(ASSESSMENT_REPORT_INDEX_PATH)}`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const payload = await parseJsonSafe(response)
    assessmentReportsIndexCache = payload && typeof payload === 'object' ? payload : { items: [] }
  } catch (error) {
    if (error?.status !== 400 && error?.status !== 404) throw error
    assessmentReportsIndexCache = { items: [] }
  }
  if (!Array.isArray(assessmentReportsIndexCache.items)) {
    assessmentReportsIndexCache.items = []
  }
  return assessmentReportsIndexCache
}

const saveAssessmentReportsIndex = async (index) => {
  await ensureAssessmentReportsBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_REPORTS_BUCKET)}/${encodeStorageObjectPath(ASSESSMENT_REPORT_INDEX_PATH)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '3600'
      },
      body: JSON.stringify(index)
    }
  )
  assessmentReportsIndexCache = index
}

const uploadAssessmentReportJson = async ({ objectPath, payload }) => {
  await ensureAssessmentReportsBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_REPORTS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '31536000'
      },
      body: JSON.stringify(payload)
    }
  )
}

const loadAssessmentReportJson = async (objectPath) => {
  const response = await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_REPORTS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    }
  )
  return parseJsonSafe(response)
}

const ensureReadingPdoyProgressBucket = async () => {
  if (readingPdoyProgressBucketReady) return
  ensureSupabaseConfigured()
  try {
    await fetchSupabaseJson(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_READING_PDOY_PROGRESS_BUCKET)}`, {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    })
  } catch (error) {
    if (error?.status !== 404) throw error
    await supabaseRequest('/storage/v1/bucket', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        id: SUPABASE_READING_PDOY_PROGRESS_BUCKET,
        name: SUPABASE_READING_PDOY_PROGRESS_BUCKET,
        public: false
      })
    })
  }
  readingPdoyProgressBucketReady = true
}

const loadReadingPdoyProgressIndex = async ({ forceRefresh = false } = {}) => {
  if (readingPdoyProgressIndexCache && !forceRefresh) return readingPdoyProgressIndexCache
  await ensureReadingPdoyProgressBucket()
  try {
    const response = await supabaseRequest(
      `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_PDOY_PROGRESS_BUCKET)}/${encodeStorageObjectPath(READING_PDOY_PROGRESS_INDEX_PATH)}`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const payload = await parseJsonSafe(response)
    readingPdoyProgressIndexCache = payload && typeof payload === 'object' ? payload : { items: [] }
  } catch (error) {
    if (error?.status !== 400 && error?.status !== 404) throw error
    readingPdoyProgressIndexCache = { items: [] }
  }
  if (!Array.isArray(readingPdoyProgressIndexCache.items)) {
    readingPdoyProgressIndexCache.items = []
  }
  return readingPdoyProgressIndexCache
}

const saveReadingPdoyProgressIndex = async (index) => {
  await ensureReadingPdoyProgressBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_PDOY_PROGRESS_BUCKET)}/${encodeStorageObjectPath(READING_PDOY_PROGRESS_INDEX_PATH)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '3600'
      },
      body: JSON.stringify(index)
    }
  )
  readingPdoyProgressIndexCache = index
}

const uploadReadingPdoyProgressJson = async ({ objectPath, payload }) => {
  await ensureReadingPdoyProgressBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_PDOY_PROGRESS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '3600'
      },
      body: JSON.stringify(payload)
    }
  )
}

const loadReadingPdoyProgressJson = async (objectPath) => {
  const response = await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_PDOY_PROGRESS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    }
  )
  return parseJsonSafe(response)
}

const ensureReadingAttemptsBucket = async () => {
  if (readingAttemptsBucketReady) return
  ensureSupabaseConfigured()
  try {
    await fetchSupabaseJson(`/storage/v1/bucket/${encodeURIComponent(SUPABASE_READING_ATTEMPTS_BUCKET)}`, {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    })
  } catch (error) {
    if (error?.status !== 404) throw error
    await supabaseRequest('/storage/v1/bucket', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        id: SUPABASE_READING_ATTEMPTS_BUCKET,
        name: SUPABASE_READING_ATTEMPTS_BUCKET,
        public: false
      })
    })
  }
  readingAttemptsBucketReady = true
}

const buildReadingAttemptsObjectPath = (userId) => `users/${normalizeOptionalUuid(userId) || 'unknown'}.json`

const uploadReadingAttemptsJson = async ({ objectPath, payload }) => {
  await ensureReadingAttemptsBucket()
  await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_ATTEMPTS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
        'Content-Type': 'application/json',
        'x-upsert': 'true',
        'cache-control': '3600'
      },
      body: JSON.stringify(payload)
    }
  )
}

const loadReadingAttemptsJson = async (objectPath) => {
  await ensureReadingAttemptsBucket()
  const response = await supabaseRequest(
    `/storage/v1/object/${encodeURIComponent(SUPABASE_READING_ATTEMPTS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`,
    {
      headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
    }
  )
  return parseJsonSafe(response)
}

const normalizeReadingPdoyStep = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (['intro', 'evidence', 'decide', 'result', 'complete'].includes(normalized)) return normalized
  return 'intro'
}

const sanitizeReadingPdoyProgressPayload = (value) => {
  if (!value || typeof value !== 'object') return null
  const lessonId = String(value.lessonId || '').trim()
  if (!lessonId) return null
  return {
    lessonId,
    sessionActive: Boolean(value.sessionActive),
    step: normalizeReadingPdoyStep(value.step),
    questionIndex: Math.max(0, Number(value.questionIndex || 0)),
    evidenceInput: String(value.evidenceInput || '').slice(0, 1000),
    decision: String(value.decision || '').slice(0, 100),
    selectedOption: String(value.selectedOption || '').slice(0, 10),
    optionParaphraseInput: String(value.optionParaphraseInput || '').slice(0, 1000),
    feedback: String(value.feedback || '').slice(0, 2000),
    introChoice: String(value.introChoice || '').slice(0, 500),
    evidenceAttempts: Math.max(0, Number(value.evidenceAttempts || 0)),
    decisionAttempts: Math.max(0, Number(value.decisionAttempts || 0)),
    lessonType: String(value.lessonType || '').slice(0, 80),
    examId: String(value.examId || '').slice(0, 120),
    examTitle: String(value.examTitle || '').slice(0, 300),
    category: normalizeReadingCategory(value.category),
    passageNumber: Math.max(0, Number(value.passageNumber || 0)),
    passageTitle: String(value.passageTitle || '').slice(0, 300),
    questionNumber: Math.max(0, Number(value.questionNumber || 0)),
    questionPrompt: String(value.questionPrompt || '').slice(0, 1000)
  }
}

const mapReadingPdoyProgressSummary = (row) => ({
  userId: normalizeOptionalUuid(row?.userId),
  learnerName: String(row?.learnerName || row?.learnerEmail || 'Student'),
  learnerEmail: normalizeEmail(row?.learnerEmail || ''),
  lessonId: String(row?.lessonId || ''),
  lessonType: String(row?.lessonType || ''),
  examId: String(row?.examId || ''),
  examTitle: String(row?.examTitle || ''),
  category: normalizeReadingCategory(row?.category),
  passageNumber: Math.max(0, Number(row?.passageNumber || 0)),
  passageTitle: String(row?.passageTitle || ''),
  questionNumber: Math.max(0, Number(row?.questionNumber || 0)),
  questionPrompt: String(row?.questionPrompt || ''),
  step: normalizeReadingPdoyStep(row?.step),
  questionIndex: Math.max(0, Number(row?.questionIndex || 0)),
  sessionActive: Boolean(row?.sessionActive),
  updatedAt: row?.updatedAt || null,
  objectPath: String(row?.objectPath || '')
})

const persistReadingPdoyProgressForUser = async ({ userId, profile, progress }) => {
  const normalizedUserId = normalizeOptionalUuid(userId)
  const sanitizedProgress = sanitizeReadingPdoyProgressPayload(progress)
  if (!normalizedUserId || !profile || !sanitizedProgress) return null
  const updatedAt = new Date().toISOString()
  const objectPath = `current/${normalizedUserId}.json`
  const payload = {
    userId: normalizedUserId,
    learnerName: String(profile?.full_name || profile?.email || 'Student'),
    learnerEmail: normalizeEmail(profile?.email || ''),
    updatedAt,
    progress: sanitizedProgress
  }
  await uploadReadingPdoyProgressJson({ objectPath, payload })
  const index = await loadReadingPdoyProgressIndex()
  const summary = mapReadingPdoyProgressSummary({
    userId: normalizedUserId,
    learnerName: payload.learnerName,
    learnerEmail: payload.learnerEmail,
    lessonId: sanitizedProgress.lessonId,
    lessonType: sanitizedProgress.lessonType,
    examId: sanitizedProgress.examId,
    examTitle: sanitizedProgress.examTitle,
    category: sanitizedProgress.category,
    passageNumber: sanitizedProgress.passageNumber,
    passageTitle: sanitizedProgress.passageTitle,
    questionNumber: sanitizedProgress.questionNumber,
    questionPrompt: sanitizedProgress.questionPrompt,
    step: sanitizedProgress.step,
    questionIndex: sanitizedProgress.questionIndex,
    sessionActive: sanitizedProgress.sessionActive,
    updatedAt,
    objectPath
  })
  const existingItems = Array.isArray(index.items) ? index.items : []
  index.items = [summary, ...existingItems.filter((item) => normalizeOptionalUuid(item?.userId) !== normalizedUserId)].slice(0, 5000)
  await saveReadingPdoyProgressIndex(index)
  return summary
}

const DEEPGRAM_TTS_MAX_CHARS = 1800

const splitTtsTextIntoChunks = (text, maxChars = DEEPGRAM_TTS_MAX_CHARS) => {
  const normalizedText = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalizedText) return []
  if (normalizedText.length <= maxChars) return [normalizedText]

  const chunks = []
  const pushChunk = (value) => {
    const chunk = String(value || '').trim()
    if (chunk) chunks.push(chunk)
  }
  const splitLongPiece = (piece) => {
    const words = String(piece || '').split(/\s+/).filter(Boolean)
    let current = ''
    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      if (next.length > maxChars) {
        pushChunk(current)
        current = word
      } else {
        current = next
      }
    }
    pushChunk(current)
  }

  const sentences = normalizedText.match(/[^.!?]+(?:[.!?]+["']?|$)/g) || [normalizedText]
  let current = ''
  for (const sentence of sentences) {
    const piece = sentence.trim()
    if (!piece) continue
    if (piece.length > maxChars) {
      pushChunk(current)
      current = ''
      splitLongPiece(piece)
      continue
    }

    const next = current ? `${current} ${piece}` : piece
    if (next.length > maxChars) {
      pushChunk(current)
      current = piece
    } else {
      current = next
    }
  }
  pushChunk(current)
  return chunks
}

const generateDeepgramTtsAudioBuffer = async (text, modelOverride) => {
  const apiKey = String(process.env.DEEPGRAM_API_KEY || '').trim()
  if (!apiKey) {
    const error = new Error('Missing DEEPGRAM_API_KEY on backend environment')
    error.status = 500
    throw error
  }

  const model = String(modelOverride || process.env.DEEPGRAM_TTS_MODEL || 'aura-2-asteria-en').trim()
  const chunks = splitTtsTextIntoChunks(text)
  if (!chunks.length) {
    const error = new Error('TTS text is empty.')
    error.status = 400
    throw error
  }

  const buffers = await Promise.all(chunks.map(async (chunk) => {
    const response = await safeFetch(`https://api.deepgram.com/v1/speak?model=${encodeURIComponent(model)}&encoding=mp3`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: chunk
      })
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      const error = new Error(`Deepgram TTS failed: ${body.slice(0, 180)}`)
      error.status = response.status
      throw error
    }

    return Buffer.from(await response.arrayBuffer())
  }))

  return Buffer.concat(buffers)
}

const TTS_SPEAKER_LINE = /^([A-Z][A-Z0-9\s]{0,22}):\s*(.*)$/

const parseListeningTtsSegments = (text) => {
  const segments = []
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines) {
    const match = line.match(TTS_SPEAKER_LINE)
    if (match) {
      segments.push({
        speaker: match[1].trim(),
        text: match[2].trim()
      })
      continue
    }
    if (segments.length) {
      segments[segments.length - 1].text = `${segments[segments.length - 1].text} ${line}`.trim()
    } else {
      segments.push({ speaker: '', text: line })
    }
  }

  return segments.filter((segment) => segment.text)
}

const TTS_FEMALE_SPEAKER_NAMES = new Set([
  'alice',
  'dana',
  'emma',
  'joy',
  'laura',
  'leah',
  'lily',
  'maya',
  'mia',
  'nina',
  'woman',
  'female',
  'student b'
])

const TTS_MALE_SPEAKER_NAMES = new Set([
  'arun',
  'david',
  'dexter',
  'leo',
  'mark',
  'mike',
  'oscar',
  'ravi',
  'rob',
  'sam',
  'tim',
  'man',
  'male',
  'student a'
])

const getListeningTtsSpeakerModel = ({ speaker, speakerIndex, maleModel, femaleModel }) => {
  const speakerKey = String(speaker || '').trim().toLowerCase()
  if (TTS_FEMALE_SPEAKER_NAMES.has(speakerKey)) return femaleModel
  if (TTS_MALE_SPEAKER_NAMES.has(speakerKey)) return maleModel
  return speakerIndex % 2 === 0 ? maleModel : femaleModel
}

const generateListeningSectionTtsAudioBuffer = async ({ text, section }) => {
  const segments = parseListeningTtsSegments(text)
  const hasDialogue = segments.filter((segment) => segment.speaker).length >= 2
  const maleModel = String(process.env.DEEPGRAM_TTS_DIALOGUE_MALE_MODEL || 'aura-2-draco-en').trim()
  const femaleModel = String(process.env.DEEPGRAM_TTS_DIALOGUE_FEMALE_MODEL || 'aura-2-pandora-en').trim()
  const lectureModel = String(process.env.DEEPGRAM_TTS_LECTURE_MODEL || 'aura-2-pandora-en').trim()

  if (Number(section) === 3 && hasDialogue) {
    const buffers = []
    const speakerOrder = new Map()
    for (const segment of segments) {
      if (!speakerOrder.has(segment.speaker)) speakerOrder.set(segment.speaker, speakerOrder.size)
      const model = getListeningTtsSpeakerModel({
        speaker: segment.speaker,
        speakerIndex: speakerOrder.get(segment.speaker) || 0,
        maleModel,
        femaleModel
      })
      buffers.push(await generateDeepgramTtsAudioBuffer(segment.text, model))
    }
    return Buffer.concat(buffers)
  }

  const lectureText = segments.map((segment) => segment.text).join(' ')
  return generateDeepgramTtsAudioBuffer(lectureText || text, lectureModel)
}

const getListeningSectionNumberFromAudioItem = (item = {}) => {
  const explicitSection = Number(item?.sectionNumber || 0)
  if ([1, 2, 3, 4].includes(explicitSection)) return explicitSection
  const rawSection = String(item?.section || '').trim()
  const match = rawSection.match(/(?:listening[-\s]*)?section[-\s]*(\d+)/i)
  const parsed = match ? Number(match[1]) : 0
  return [1, 2, 3, 4].includes(parsed) ? parsed : 0
}

const isListeningSectionAudioItem = (item = {}) =>
  String(item?.audioKind || '').trim() === 'listening-section' || getListeningSectionNumberFromAudioItem(item) > 0

const uploadQuestionAudioBuffer = async ({ objectPath, audioBuffer }) => {
  await ensureQuestionAudioBucket()
  await supabaseRequest(`/storage/v1/object/${encodeURIComponent(SUPABASE_TTS_BUCKET)}/${encodeStorageObjectPath(objectPath)}`, {
    method: 'POST',
    headers: {
      ...buildSupabaseHeaders({ serviceRole: true, includeJson: false }),
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
      'cache-control': '31536000'
    },
    body: audioBuffer
  })
}

const questionAudioObjectExists = async (objectPath) => {
  const publicUrl = buildSupabaseStorageObjectUrl({
    bucket: SUPABASE_TTS_BUCKET,
    objectPath,
    publicAsset: true
  })
  const response = await safeFetch(publicUrl, { method: 'HEAD' }, { timeoutMs: 10000, retries: 0 }).catch(() => null)
  return Boolean(response?.ok)
}

const getOrCreateQuestionAudioAsset = async (
  rawItem,
  { allowGenerate = true, force = false, audioBufferFactory } = {}
) => {
  const item = normalizeQuestionAudioItemInput(rawItem)
  if (!item) {
    const error = new Error('Question audio item is missing key or text.')
    error.status = 400
    throw error
  }

  const manifest = await loadQuestionAudioManifest()
  const existingEntry = manifest.items?.[item.cacheKey]
  const { textHash, objectPath } = buildQuestionAudioObjectPath(item)
  const publicUrl = buildSupabaseStorageObjectUrl({
    bucket: SUPABASE_TTS_BUCKET,
    objectPath,
    publicAsset: true
  })

  if (!force && existingEntry?.textHash === textHash && existingEntry?.audioUrl) {
    return {
      ...existingEntry,
      cacheKey: item.cacheKey,
      question: item.text,
      audioUrl: existingEntry.audioUrl,
      cached: true
    }
  }

  if (!force && (await questionAudioObjectExists(objectPath))) {
    const nextEntry = {
      cacheKey: item.cacheKey,
      section: item.section,
      topicId: item.topicId,
      topicTitle: item.topicTitle,
      question: item.text,
      textHash,
      objectPath,
      audioUrl: publicUrl,
      createdAt: existingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    manifest.items[item.cacheKey] = nextEntry
    await saveQuestionAudioManifest(manifest)
    return {
      ...nextEntry,
      cached: true
    }
  }

  if (!allowGenerate) {
    const error = new Error('Question audio has not been generated yet.')
    error.status = 404
    throw error
  }

  const audioBuffer = audioBufferFactory
    ? await audioBufferFactory(item)
    : await generateDeepgramTtsAudioBuffer(item.text)
  await uploadQuestionAudioBuffer({ objectPath, audioBuffer })
  const nextEntry = {
    cacheKey: item.cacheKey,
    section: item.section,
    topicId: item.topicId,
    topicTitle: item.topicTitle,
    question: item.text,
    textHash,
    objectPath,
    audioUrl: publicUrl,
    createdAt: existingEntry?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  manifest.items[item.cacheKey] = nextEntry
  await saveQuestionAudioManifest(manifest)
  return {
    ...nextEntry,
    cached: false
  }
}

const persistAssessmentReportForUser = async ({ userId, profile, requestBody, result }) => {
  const normalizedUserId = normalizeOptionalUuid(userId)
  if (!normalizedUserId || !profile || !result || typeof result !== 'object') return null

  const reportId = randomUUID()
  const createdAt = new Date().toISOString()
  const testMode = ['part1', 'part2', 'part3', 'full'].includes(String(requestBody?.testMode || ''))
    ? String(requestBody.testMode)
    : 'part2'
  const topicTitle = String(requestBody?.topic || profile?.full_name || 'Speaking report').trim() || 'Speaking report'
  const topicCategory =
    testMode === 'part1' ? 'Speaking Part 1' : testMode === 'part2' ? 'Speaking Part 2' : testMode === 'part3' ? 'Speaking Part 3' : 'Speaking Full Mock'
  const objectPath = `${createdAt.slice(0, 10)}/${normalizedUserId}/${reportId}.json`
  const snapshot = sanitizeSavedReportSnapshot({
    testMode,
    topicTitle,
    topicCategory,
    prompt: String(requestBody?.prompt || ''),
    cues: Array.isArray(requestBody?.cues) ? requestBody.cues : [],
    report: result,
    selectedProvider: String(result?.primaryProvider || result?.provider || '')
  })
  const payload = {
    id: reportId,
    userId: normalizedUserId,
    learnerName: String(profile?.full_name || profile?.email || 'Student'),
    learnerEmail: normalizeEmail(profile?.email || ''),
    testMode,
    topicTitle,
    topicCategory,
    prompt: String(requestBody?.prompt || ''),
    cues: (Array.isArray(requestBody?.cues) ? requestBody.cues : []).map((item) => String(item || '')).slice(0, 20),
    transcript: String(requestBody?.transcript || '').slice(0, 40000),
    questionResponses: Array.isArray(requestBody?.questionResponses)
      ? requestBody.questionResponses
          .map((item) => ({
            question: String(item?.question || '').slice(0, 1000),
            response: String(item?.response || '').slice(0, 12000)
          }))
          .slice(0, 40)
      : [],
    report: snapshot?.report || {},
    selectedProvider: snapshot?.selectedProvider || 'gemini',
    createdAt
  }

  await uploadAssessmentReportJson({ objectPath, payload })
  const index = await loadAssessmentReportsIndex()
  const apiUsage = result?.apiUsage && typeof result.apiUsage === 'object' ? result.apiUsage : {}
  const summary = mapAssessmentReportSummary({
    id: reportId,
    userId: normalizedUserId,
    learnerName: payload.learnerName,
    learnerEmail: payload.learnerEmail,
    testMode,
    topicTitle,
    topicCategory,
    overallBand: Number(result?.overallBand ?? result?.totalScore ?? 0),
    provider: payload.selectedProvider,
    apiCostUsd: Number(apiUsage?.totalCostUsd ?? 0),
    totalTokens: Number(apiUsage?.totalTokens ?? 0),
    totalCalls: Number(apiUsage?.totalCalls ?? 0),
    createdAt,
    objectPath
  })
  index.items = [summary, ...(Array.isArray(index.items) ? index.items : [])].slice(0, 1000)
  await saveAssessmentReportsIndex(index)
  return summary
}

const sendEmailWithResend = async ({ to, subject, html, text }) => {
  if (!RESEND_API_KEY) {
    console.warn('Resend email skipped: RESEND_API_KEY is not configured.')
    return { skipped: true, reason: 'missing_resend_api_key' }
  }
  const recipients = (Array.isArray(to) ? to : [to]).map((item) => normalizeEmail(item)).filter(Boolean)
  if (recipients.length === 0) {
    console.warn('Resend email skipped: recipient is missing.')
    return { skipped: true, reason: 'missing_recipient' }
  }

  const response = await safeFetch(
    'https://api.resend.com/emails',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: recipients,
        subject: String(subject || '').trim(),
        html: String(html || '').trim(),
        text: String(text || '').trim()
      })
    },
    { timeoutMs: 25000, retries: 1, retryDelayMs: 900 }
  )

  const payload = await parseJsonSafe(response)
  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      payload?.name ||
      `Resend email request failed (${response.status}).`
    throw new Error(String(message))
  }

  return {
    skipped: false,
    id: String(payload?.id || '')
  }
}

const sendNewSignupNotificationEmail = async ({ req, learner }) => {
  const { baseUrl, approvalUrl } = buildApprovalEmailUrls({ req, userId: learner?.id })
  const learnerName = escapeHtml(learner?.full_name || learner?.email || 'Student')
  const learnerEmail = escapeHtml(learner?.email || '')
  const adminPanelUrl = baseUrl || approvalUrl
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
      <h2 style="margin-bottom:8px;">New learner sign-up</h2>
      <p style="margin-top:0;">A new learner has created an account and is waiting for approval.</p>
      <p><strong>Name:</strong> ${learnerName}<br /><strong>Email:</strong> ${learnerEmail}</p>
      ${
        approvalUrl
          ? `<p><a href="${escapeHtml(approvalUrl)}" style="display:inline-block;padding:12px 18px;background:#123b7a;color:#ffffff;text-decoration:none;border-radius:8px;">Grant Access</a></p>`
          : ''
      }
      ${
        adminPanelUrl
          ? `<p><a href="${escapeHtml(adminPanelUrl)}">Open admin panel</a></p>`
          : ''
      }
      <p style="color:#52607a;">This approval link stays valid for 7 days.</p>
    </div>
  `
  const text = [
    'New learner sign-up',
    '',
    `Name: ${String(learner?.full_name || learner?.email || 'Student')}`,
    `Email: ${String(learner?.email || '')}`,
    approvalUrl ? `Grant access: ${approvalUrl}` : '',
    adminPanelUrl ? `Admin panel: ${adminPanelUrl}` : ''
  ]
    .filter(Boolean)
    .join('\n')

  return sendEmailWithResend({
    to: ADMIN_SIGNUP_NOTIFY_EMAIL,
    subject: 'New learner sign-up waiting for approval',
    html,
    text
  })
}

const sendAccessGrantedEmail = async ({ learner }) => {
  const learnerName = String(learner?.full_name || learner?.email || 'Student').trim()
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#172033">
      <p>Hi krub,</p>
      <p>Your access is granted for this app.</p>
      <p>Have a nice week!</p>
    </div>
  `
  const text = ['Hi krub,', '', 'Your access is granted for this app.', '', 'Have a nice week!'].join('\n')
  return sendEmailWithResend({
    to: learner?.email,
    subject: 'Your app access is granted',
    html,
    text
  })
}

const applyInitialAccessCredits = ({ isActivating, feedbackCredits, fullMockCredits }) => ({
  feedbackCredits:
    isActivating && Math.max(0, Number(feedbackCredits ?? 0)) <= 0
      ? DEFAULT_FEEDBACK_CREDITS
      : feedbackCredits,
  fullMockCredits:
    isActivating && Math.max(0, Number(fullMockCredits ?? 0)) <= 0
      ? DEFAULT_FULL_MOCK_CREDITS
      : fullMockCredits
})

const activateLearnerAccess = async ({ userId }) => {
  const before = await loadUserProfileWithAccess(userId)
  if (!before) throw new Error('Learner profile not found.')
  const activatedWindow = buildDefaultAccessWindow(new Date().toISOString())
  const wasActive = String(before?.learner_access?.status || 'inactive') === 'active'
  const initialCredits = applyInitialAccessCredits({
    isActivating: !wasActive,
    feedbackCredits: before?.learner_access?.feedback_credits ?? 0,
    fullMockCredits: before?.learner_access?.full_mock_credits ?? 0
  })

  await supabaseRequest('/rest/v1/learner_access', {
    method: 'POST',
    headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify(
      buildLearnerAccessPayload({
        userId,
        status: 'active',
        startsAt: activatedWindow.startsAt,
        expiresAt: before?.learner_access?.expires_at || activatedWindow.expiresAt,
        feedbackCredits: initialCredits.feedbackCredits,
        fullMockCredits: initialCredits.fullMockCredits
      })
    )
  })

  const after = await loadUserProfileWithAccess(userId)
  if (!after) throw new Error('Learner profile not found after activation.')
  const emailResult = !wasActive ? await sendAccessGrantedEmail({ learner: after }) : { skipped: true, reason: 'already_active' }
  return {
    learner: after,
    wasActive,
    emailResult
  }
}

const buildLearnerAccessPayload = ({
  userId,
  status = 'active',
  startsAt,
  expiresAt,
  feedbackCredits,
  fullMockCredits
}) => ({
  user_id: userId,
  status: status === 'inactive' ? 'inactive' : 'active',
  starts_at: startsAt || new Date().toISOString(),
  expires_at: expiresAt || null,
  feedback_credits: Math.max(0, Number(feedbackCredits ?? 0)),
  full_mock_credits: Math.max(0, Number(fullMockCredits ?? 0))
})

const addMonthsUtc = (value, months) => {
  const baseDate = new Date(value)
  if (Number.isNaN(baseDate.getTime())) return null
  const nextDate = new Date(baseDate)
  nextDate.setUTCMonth(nextDate.getUTCMonth() + Number(months || 0))
  return nextDate.toISOString()
}

const buildDefaultAccessWindow = (startsAt) => {
  const effectiveStartsAt = startsAt || new Date().toISOString()
  return {
    startsAt: effectiveStartsAt,
    expiresAt: addMonthsUtc(effectiveStartsAt, 3)
  }
}

const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim()
const RESEND_FROM_EMAIL = String(process.env.RESEND_FROM_EMAIL || 'Language Plan <onboarding@resend.dev>').trim()
const ADMIN_SIGNUP_NOTIFY_EMAIL = normalizeEmail(
  process.env.ADMIN_SIGNUP_NOTIFY_EMAIL || 'languageplanconsulting@gmail.com'
)
const APP_BASE_URL = String(process.env.APP_BASE_URL || '').trim().replace(/\/+$/, '')
const ACCESS_APPROVAL_SECRET = String(process.env.ACCESS_APPROVAL_SECRET || ADMIN_PANEL_CODE || 'language-plan').trim()
const ACCESS_APPROVAL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7
const THINKIFIC_WEBHOOK_SECRET = String(process.env.THINKIFIC_WEBHOOK_SECRET || '').trim()
const THINKIFIC_ALLOWED_COURSE_IDS = String(process.env.THINKIFIC_ALLOWED_COURSE_IDS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)
const THINKIFIC_DEFAULT_ACCESS_MONTHS = Math.max(0, Number(process.env.THINKIFIC_DEFAULT_ACCESS_MONTHS || 3) || 0)
const parseThinkificCreditDefault = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}
const THINKIFIC_FEEDBACK_CREDITS = Math.max(
  0,
  parseThinkificCreditDefault(process.env.THINKIFIC_FEEDBACK_CREDITS, DEFAULT_FEEDBACK_CREDITS)
)
const THINKIFIC_FULL_MOCK_CREDITS = Math.max(
  0,
  parseThinkificCreditDefault(process.env.THINKIFIC_FULL_MOCK_CREDITS, DEFAULT_FULL_MOCK_CREDITS)
)

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const base64UrlEncode = (value) =>
  Buffer.from(String(value || ''), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

const base64UrlDecode = (value) => {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

const signApprovalPayload = (payload) =>
  createHmac('sha256', ACCESS_APPROVAL_SECRET).update(payload).digest('hex')

const createAccessApprovalToken = ({ userId }) => {
  const payload = JSON.stringify({
    purpose: 'approve-signup',
    userId: String(userId || '').trim(),
    exp: Date.now() + ACCESS_APPROVAL_TOKEN_TTL_MS
  })
  return `${base64UrlEncode(payload)}.${signApprovalPayload(payload)}`
}

const verifyAccessApprovalToken = (token) => {
  const [encodedPayload, signature] = String(token || '').trim().split('.')
  if (!encodedPayload || !signature) return null
  let payloadText = ''
  try {
    payloadText = base64UrlDecode(encodedPayload)
  } catch {
    return null
  }
  const expectedSignature = signApprovalPayload(payloadText)
  if (expectedSignature !== signature) return null
  let payload = null
  try {
    payload = JSON.parse(payloadText)
  } catch {
    return null
  }
  if (payload?.purpose !== 'approve-signup') return null
  if (!payload?.userId || Number(payload?.exp || 0) < Date.now()) return null
  return {
    userId: String(payload.userId || '').trim()
  }
}

const resolveAppBaseUrl = (req) => {
  if (APP_BASE_URL) return APP_BASE_URL
  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim()
  const protocol = forwardedProto || req?.protocol || 'https'
  const host = String(req?.headers?.host || '').trim()
  return host ? `${protocol}://${host}`.replace(/\/+$/, '') : ''
}

const buildApprovalEmailUrls = ({ req, userId }) => {
  const baseUrl = resolveAppBaseUrl(req)
  const token = createAccessApprovalToken({ userId })
  return {
    baseUrl,
    approvalUrl: baseUrl ? `${baseUrl}/api/admin/approve-signup?token=${encodeURIComponent(token)}` : ''
  }
}

const sanitizeNotebookSection = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  return ['speaking', 'writing', 'listening', 'reading', 'custom'].includes(normalized)
    ? normalized
    : 'speaking'
}

const sanitizeCustomSections = (value) =>
  Array.from(
    new Set(
      (Array.isArray(value) ? value : [])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 50)
    )
  )

const sanitizeSavedReportSnapshot = (value) => {
  if (!value || typeof value !== 'object') return undefined
  return {
    testMode: ['part1', 'part2', 'part3', 'full'].includes(String(value.testMode || ''))
      ? String(value.testMode)
      : 'part2',
    topicTitle: String(value.topicTitle || ''),
    topicCategory: String(value.topicCategory || ''),
    prompt: String(value.prompt || ''),
    cues: (Array.isArray(value.cues) ? value.cues : []).map((item) => String(item || '')).slice(0, 20),
    report: value.report && typeof value.report === 'object' ? value.report : {},
    selectedProvider: String(value.selectedProvider || '')
  }
}

const sanitizeNotebookEntries = (value) =>
  (Array.isArray(value) ? value : []).slice(0, 1000).map((entry) => ({
    id: String(entry?.id || randomUUID()),
    section: sanitizeNotebookSection(entry?.section),
    ...(entry?.customSectionName ? { customSectionName: String(entry.customSectionName).trim().slice(0, 120) } : {}),
    topicTitle: String(entry?.topicTitle || '').slice(0, 300),
    criterion: String(entry?.criterion || '').slice(0, 200),
    quote: String(entry?.quote || '').slice(0, 4000),
    fix: String(entry?.fix || '').slice(0, 4000),
    ...(entry?.thaiMeaning ? { thaiMeaning: String(entry.thaiMeaning).slice(0, 4000) } : {}),
    ...(entry?.personalNote ? { personalNote: String(entry.personalNote).slice(0, 8000) } : {}),
    ...(entry?.savedReportSnapshot ? { savedReportSnapshot: sanitizeSavedReportSnapshot(entry.savedReportSnapshot) } : {}),
    createdAt: String(entry?.createdAt || new Date().toISOString())
  }))

const mapNotebookRecord = (row) => ({
  entries: sanitizeNotebookEntries(row?.entries),
  customSections: sanitizeCustomSections(row?.custom_sections),
  updatedAt: row?.updated_at || null
})

const normalizeReadingCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'general-training' || normalized === 'general training' || normalized === 'gt') {
    return 'general-training'
  }
  if (normalized === 'advanced' || normalized === 'passage3') return 'advanced'
  return 'normal'
}

const toReadingDatabaseCategory = (value) => {
  const category = normalizeReadingCategory(value)
  if (category === 'advanced') return 'passage3'
  if (category === 'general-training') return 'general-training'
  return 'passage1'
}

const normalizeReadingCollectionTitle = (value) =>
  String(value || '').trim().slice(0, 160)

const normalizeReadingAnswerType = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (['true-false-not-given', 'yes-no-not-given', 'multiple-choice', 'text'].includes(normalized)) {
    return normalized
  }
  return 'text'
}

const sanitizeReadingReportItems = (value) =>
  (Array.isArray(value) ? value : [])
    .slice(0, 200)
    .map((item) => ({
      number: Math.max(0, Number(item?.number || 0)),
      prompt: String(item?.prompt || '').slice(0, 2000),
      correctAnswer: String(item?.correctAnswer || '').slice(0, 500),
      answerType: normalizeReadingAnswerType(item?.answerType),
      acceptedAnswers: Array.isArray(item?.acceptedAnswers)
        ? item.acceptedAnswers.map((answer) => String(answer || '').slice(0, 500)).slice(0, 20)
        : undefined,
      ...(item?.answerGroup ? { answerGroup: String(item.answerGroup).slice(0, 300) } : {}),
      exactPortion: String(item?.exactPortion || '').slice(0, 4000),
      explanationThai: String(item?.explanationThai || '').slice(0, 4000),
      paraphrasedVocabulary: String(item?.paraphrasedVocabulary || '').slice(0, 2000),
      userAnswer: String(item?.userAnswer || '').slice(0, 1000),
      isCorrect: Boolean(item?.isCorrect)
    }))
    .filter((item) => item.number > 0)

const sanitizeReadingAttemptSummary = (value, fallbackExamId = '') => {
  if (!value || typeof value !== 'object') return null
  const examId = String(value.examId || fallbackExamId || '').trim().slice(0, 180)
  if (!examId) return null
  const reportItems = sanitizeReadingReportItems(value.reportItems)
  const computedCorrect = reportItems.filter((item) => item.isCorrect).length
  const computedTotal = reportItems.length
  const totalQuestions = computedTotal || Math.max(0, Number(value.totalQuestions || 0))
  const correctCount = computedTotal ? computedCorrect : Math.max(0, Number(value.correctCount || 0))
  const accuracy = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : Math.max(0, Number(value.accuracy || 0))
  return {
    examId,
    examTitle: String(value.examTitle || '').slice(0, 300),
    category: normalizeReadingCategory(value.category),
    correctCount,
    totalQuestions,
    accuracy: Math.max(0, Math.min(100, accuracy)),
    wrongCount: Math.max(0, totalQuestions - correctCount),
    completedAt: String(value.completedAt || new Date().toISOString()),
    reportItems
  }
}

const sanitizeReadingAttemptHistory = (value) => {
  const source =
    value && typeof value === 'object'
      ? Array.isArray(value)
        ? value.map((attempt) => [attempt?.examId, attempt])
        : Object.entries(value)
      : []
  return Object.fromEntries(
    source
      .map(([examId, attempt]) => sanitizeReadingAttemptSummary(attempt, examId))
      .filter(Boolean)
      .map((attempt) => [attempt.examId, attempt])
  )
}

const normalizeSupportReportCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (['bug', 'account', 'content', 'billing', 'other'].includes(normalized)) return normalized
  return 'bug'
}

const normalizeSupportReportStatus = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (['open', 'in_progress', 'resolved', 'closed'].includes(normalized)) return normalized
  return 'open'
}

const sanitizeSupportPageContext = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  return normalized ? normalized.slice(0, 80) : 'workspace'
}

const sanitizeSupportMessage = (value) => String(value || '').trim().replace(/\s+\n/g, '\n').slice(0, 5000)

const normalizeReadingAnswer = (value) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .toUpperCase()

const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

const parseAcceptedReadingAnswers = (value) =>
  String(value || '')
    .split(/[|,/&]+/)
    .map((item) => canonicalizeReadingCorrectAnswer(item))
    .filter(Boolean)

const canonicalizeReadingCorrectAnswer = (value) => {
  const normalized = normalizeReadingAnswer(value)
  if (!normalized) return ''
  if (normalized.startsWith('NOT GIVEN')) return 'NOT GIVEN'
  if (normalized.startsWith('TRUE')) return 'TRUE'
  if (normalized.startsWith('FALSE')) return 'FALSE'
  if (normalized.startsWith('YES')) return 'YES'
  if (normalized.startsWith('NO')) return 'NO'
  if (READING_ROMAN_HEADING_PATTERN.test(normalized)) return normalized.toLowerCase()
  const letterMatch = normalized.match(/^([A-G])(?:\b|\s|\()/)
  if (letterMatch) return letterMatch[1]
  return String(value || '').trim()
}

const guessReadingAnswerType = (correctAnswer) => {
  const normalized = normalizeReadingAnswer(canonicalizeReadingCorrectAnswer(correctAnswer))
  if (['TRUE', 'FALSE', 'NOT GIVEN'].includes(normalized)) return 'true-false-not-given'
  if (['YES', 'NO', 'NOT GIVEN'].includes(normalized)) return 'yes-no-not-given'
  if (/^[A-G]$/.test(normalized)) return 'multiple-choice'
  if (READING_ROMAN_HEADING_PATTERN.test(normalized)) return 'multiple-choice'
  return 'text'
}

const inferReadingAnswerType = (correctAnswer, questionSectionText = '') => {
  const normalized = normalizeReadingAnswer(canonicalizeReadingCorrectAnswer(correctAnswer))
  const section = String(questionSectionText || '')
  if (normalized === 'NOT GIVEN') {
    if (/\bYES\b/i.test(section) && /\bNO\b/i.test(section)) return 'yes-no-not-given'
    if (/\bTRUE\b/i.test(section) && /\bFALSE\b/i.test(section)) return 'true-false-not-given'
  }
  return guessReadingAnswerType(correctAnswer)
}

const sanitizeReadingJudgementPrompt = (prompt, answerType) => {
  const text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (answerType !== 'true-false-not-given' && answerType !== 'yes-no-not-given') return text

  const stripped = text
    .replace(
      /^(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers)\s+(?:believes?|claims?|argues?|suggests?|states?|says?|thinks?|maintains?|contends?|implies?|feels?|considers?|indicates?|holds?|asserts?)\s+(?:that\s+)?/i,
      ''
    )
    .replace(
      /^(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers)(?:'s|’s)\s+(?:view|opinion|belief|claim|argument|suggestion|position)\s+(?:is|was)\s+(?:that\s+)?/i,
      ''
    )
    .replace(
      /^(?:according to|in the view of|in the opinion of)\s+(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers),?\s*/i,
      ''
    )
    .trim()

  return stripped || text
}

const stripReadingDragDropUiText = (text) =>
  String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*Drag and drop an option[\s\S]*?(?=Questions?\s+\d|$)/i, '')
    .replace(/\s*Questions?\s+\d+(?:\s*[–-]\s*\d+)?[\s\S]*$/i, '')
    .trim()

const stripReadingMatchingListFromPrompt = (text) =>
  String(text || '')
    .replace(
      /(?:\.\s*|\s+)List of (?:Headings|Ideas|Researchers|People|Statements)\b[\s\S]*$/i,
      ''
    )
    .trim()

const sanitizeReadingQuestionPrompt = (prompt, correctAnswer) => {
  const raw = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (/^drop heading here/i.test(raw)) {
    const remainder = stripReadingDragDropUiText(raw.replace(/^drop heading here\s*…?\s*/i, ''))
    return remainder || 'Choose the correct heading for this section.'
  }
  if (/^drop answer here/i.test(raw)) {
    const remainder = stripReadingDragDropUiText(
      raw
        .replace(/^drop answer here\s*…?\s*/i, '')
        .replace(/^[\.\•]\s*/, '')
    )
    return remainder || 'Complete the summary below.'
  }
  if (READING_ROMAN_HEADING_PATTERN.test(String(correctAnswer || '').trim()) && /^paragraph\s+[a-h]\b/i.test(raw)) {
    return raw
  }
  return stripReadingMatchingListFromPrompt(stripReadingDragDropUiText(raw) || raw)
}

const QUESTION_SECTION_HEADER_REGEX =
  /(?:^|\n)\s*Questions?\s+(\d+)(?:\s*[–-]\s*(\d+)|\s+and\s+(\d+))?/gi
const QUESTION_SECTION_MARKER_REGEX = /(?:^|\n)\s*Questions?\s+\d+(?:\s*[–-]\s*\d+|\s+and\s+\d+)?/i

const parseQuestionRangesFromText = (text) => {
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const matches = [...String(text || '').matchAll(QUESTION_SECTION_HEADER_REGEX)]
  return matches.map((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return {
      start: Math.min(start, end),
      end: Math.max(start, end)
    }
  })
}

const getQuestionSectionTextForNumber = (text, questionNumber) => {
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const source = String(text || '')
  const matches = [...source.matchAll(QUESTION_SECTION_HEADER_REGEX)]
  const matchIndex = matches.findIndex((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return questionNumber >= Math.min(start, end) && questionNumber <= Math.max(start, end)
  })
  if (matchIndex < 0) return ''
  const current = matches[matchIndex]
  const next = matches[matchIndex + 1]
  return source.slice(current.index, next ? next.index : source.length)
}

const stripWrappedQuotes = (value) => {
  const text = String(value || '').replace(/\r/g, '').trim()
  if (!text) return ''
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'")) ||
    (text.startsWith('```') && text.endsWith('```'))
  ) {
    return text.replace(/^(```|["'])/, '').replace(/(```|["'])$/, '').trim()
  }
  return text
}

const splitReadingTitleAndBody = (value, fallbackTitle) => {
  const lines = String(value || '').replace(/\r/g, '').split('\n')
  const titleIndex = lines.findIndex((line) => line.trim())
  const title = String(titleIndex >= 0 ? lines[titleIndex] : fallbackTitle || 'Passage 1').trim() || String(fallbackTitle || 'Passage 1')
  const bodyText = lines
    .slice(titleIndex >= 0 ? titleIndex + 1 : 0)
    .join('\n')
    .trim()
  const bodyParagraphs = bodyText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n+/g, ' ').trim())
    .filter(Boolean)

  return {
    title,
    bodyParagraphs
  }
}

const parseReadingPassages = (rawPassageText) => {
  const source = stripWrappedQuotes(rawPassageText)
  const passages = []
  const matches = [...source.matchAll(/(?:^|\n)\s*READING PASSAGE\s+(\d+)\s*$/gim)]
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const next = matches[index + 1]
    const block = source
      .slice(current.index, next ? next.index : source.length)
      .replace(/^\s*READING PASSAGE\s+\d+\s*/i, '')
      .trim()
    const questionMarker = block.search(QUESTION_SECTION_MARKER_REGEX)
    const passageBodyRaw = questionMarker >= 0 ? block.slice(0, questionMarker).trim() : block.trim()
    const questionSectionText = questionMarker >= 0 ? block.slice(questionMarker).trim() : ''
    const { title, bodyParagraphs } = splitReadingTitleAndBody(passageBodyRaw, `Passage ${current[1]}`)
    passages.push({
      number: Number(current[1]),
      title,
      bodyParagraphs,
      questionSectionText,
      questionRanges: parseQuestionRangesFromText(questionSectionText)
    })
  }

  if (passages.length === 0 && source.trim()) {
    const fallbackQuestionMarker = source.search(QUESTION_SECTION_MARKER_REGEX)
    const fallbackPassageBodyRaw = fallbackQuestionMarker >= 0 ? source.slice(0, fallbackQuestionMarker).trim() : source.trim()
    const fallbackQuestionSectionText = fallbackQuestionMarker >= 0 ? source.slice(fallbackQuestionMarker).trim() : ''
    const { title: fallbackTitle, bodyParagraphs: fallbackBodyParagraphs } = splitReadingTitleAndBody(
      fallbackPassageBodyRaw,
      'Passage 1'
    )
    passages.push({
      number: 1,
      title: fallbackTitle,
      bodyParagraphs: fallbackBodyParagraphs,
      questionSectionText: fallbackQuestionSectionText,
      questionRanges: parseQuestionRangesFromText(fallbackQuestionSectionText)
    })
  }

  return passages
}

const parseReadingAnswerKey = (rawAnswerKey) => {
  const source = stripWrappedQuotes(rawAnswerKey)
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:\s*[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map((match) =>
    String(match[1] || '').trim()
  )
  return segments.map((segment) => {
    const numberMatch = segment.match(/^Question\s+(\d+):/im)
    const promptMatch = segment.match(
      /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
    )
    const correctAnswerMatch = segment.match(/Correct Answer:\s*(.+)/i)
    const acceptedAnswersMatch = segment.match(/Accepted Answers:\s*(.+)/i)
    const answerGroupMatch = segment.match(/Answer Group:\s*(.+)/i)
    const exactPortionMatch = segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)
    const explanationMatch = segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)
    const paraphraseMatch = segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)
    const questionNumber = Number(numberMatch?.[1] || 0)
    const prompt = String(promptMatch?.[1] || '').trim()
    const correctAnswer = canonicalizeReadingCorrectAnswer(String(correctAnswerMatch?.[1] || '').trim())
    const acceptedAnswers = parseAcceptedReadingAnswers(acceptedAnswersMatch?.[1] || '')
    return {
      number: questionNumber,
      prompt,
      correctAnswer,
      acceptedAnswers: acceptedAnswers.length ? acceptedAnswers : undefined,
      answerGroup: String(answerGroupMatch?.[1] || '').trim() || undefined,
      answerType: guessReadingAnswerType(correctAnswer),
      exactPortion: String(exactPortionMatch?.[1] || '').trim(),
      explanationThai: String(explanationMatch?.[1] || '').trim(),
      paraphrasedVocabulary: String(paraphraseMatch?.[1] || '').trim()
    }
  })
}

const normalizeReadingParsedPayload = (payload) => ({
  ...(payload && typeof payload === 'object' ? payload : {}),
  passages: Array.isArray(payload?.passages)
    ? payload.passages.map((passage) => ({
        ...passage,
        bodyParagraphs: resolveReadingPassageBodyParagraphs(passage?.title, passage?.bodyParagraphs),
        questions: Array.isArray(passage?.questions)
          ? passage.questions.map((question) =>
              normalizeReadingQuestionRecord(question, passage?.questionSectionText || '')
            )
          : []
      }))
    : [],
  questionCount: Number(payload?.questionCount || 0)
})

const READING_MONTH_RELEASES = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11
}

const normalizeReadingReleaseAt = (value) => {
  const text = String(value || '').trim()
  if (!text) return ''
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

const getReadingReleaseAtFromMonthlyTitle = (value) => {
  const match = String(value || '').match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})\b/i
  )
  if (!match) return ''
  const monthIndex = READING_MONTH_RELEASES[String(match[1] || '').toLowerCase()]
  const year = Number(match[2])
  if (!Number.isInteger(monthIndex) || !Number.isInteger(year) || year < 2020 || year > 2100) return ''
  return new Date(Date.UTC(year, monthIndex, 19, 17, 0, 0, 0)).toISOString()
}

const resolveReadingReleaseAt = ({ releaseAt, collectionTitle, title } = {}) =>
  normalizeReadingReleaseAt(releaseAt) ||
  getReadingReleaseAtFromMonthlyTitle(collectionTitle) ||
  getReadingReleaseAtFromMonthlyTitle(title)

const getReadingExamReleaseAt = (exam) =>
  normalizeReadingReleaseAt(exam?.releaseAt || exam?.parsedPayload?.releaseAt || exam?.parsed_payload?.releaseAt)

const getReadingViewerRole = (req) =>
  String(req?.auth?.profile?.role || req?.auth?.role || 'student')
    .trim()
    .toLowerCase()

const canViewReadingExam = (exam, role, now = new Date()) => {
  if (role === 'admin') return true
  const releaseAt = getReadingExamReleaseAt(exam)
  return !releaseAt || Date.parse(releaseAt) <= now.getTime()
}

const READING_FULL_TEST_PART2_PASSAGE_TEXT = `READING PASSAGE 1
Manatees
You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.

Manatees, also known as sea cows, are aquatic mammals that belong to a group of animals called Sirenia. This group also contains dugongs. Dugongs and manatees look quite alike – they are similar in size, colour and shape, and both have flexible flippers for forelimbs. However, the manatee has a broad, rounded tail, whereas the dugong’s is fluked, like that of a whale. There are three species of manatees: the West Indian manatee (Trichechus manatus), the African manatee (Trichechus senegalensis) and the Amazonian manatee (Trichechus inunguis).

Unlike most mammals, manatees have only six bones in their neck – most others, including humans and giraffes, have seven. This short neck allows a manatee to move its head up and down, but not side to side. To see something on its left or its right, a manatee must turn its entire body, steering with its flippers. Manatees have pectoral flippers but no back limbs, only a tail for propulsion. They do have pelvic bones, however – a leftover from their evolution from a four-legged to a fully aquatic animal. Manatees share some visual similarities to elephants. Like elephants, manatees have thick, wrinkled skin. They also have some hairs covering their bodies which help them sense vibrations in the water around them.

Seagrasses and other marine plants make up most of a manatee’s diet. Manatees spend about eight hours each day grazing and uprooting plants. They eat up to 15% of their weight in food each day. African manatees are omnivorous – studies have shown that molluscs and fish make up a small part of their diets. West Indian and Amazonian manatees are both herbivores.

Manatees’ teeth are all molars – flat, rounded teeth for grinding food. Due to manatees’ abrasive aquatic plant diet, these teeth get worn down and they eventually fall out, so they continually grow new teeth that get pushed forward to replace the ones they lose. Instead of having incisors to grasp their food, manatees have lips which function like a pair of hands to help tear food away from the seafloor.

Manatees are fully aquatic, but as mammals, they need to come up to the surface to breathe. When awake, they typically surface every two to four minutes, but they can hold their breath for much longer. Adult manatees sleep underwater for 10-12 hours a day, but they come up for air every 15-20 minutes. Active manatees need to breathe more frequently. It’s thought that manatees use their muscular diaphragm and breathing to adjust their buoyancy. They may use diaphragm contractions to compress and store gas in folds in their large intestine to help them float.

The West Indian manatee reaches about 3.5 metres long and weighs on average around 500 kilogrammes. It moves between fresh water and salt water, taking advantage of coastal mangroves and coral reefs, rivers, lakes and inland lagoons. There are two subspecies of West Indian manatee: the Antillean manatee is found in waters from the Bahamas to Brazil, whereas the Florida manatee is found in US waters, although some individuals have been recorded in the Bahamas. In winter, the Florida manatee is typically restricted to Florida. When the ambient water temperature drops below 20°C, it takes refuge in naturally and artificially warmed water, such as at the warm-water outfalls from powerplants.

The African manatee is also about 3.5 metres long and found in the sea along the west coast of Africa, from Mauritania down to Angola. The species also makes use of rivers, with the mammals seen in landlocked countries such as Mali and Niger. The Amazonian manatee is the smallest species, though it is still a big animal. It grows to about 2.5 metres long and 350 kilogrammes. Amazonian manatees favour calm, shallow waters that are above 23°C. This species is found in fresh water in the Amazon Basin in Brazil, as well as in Colombia, Ecuador and Peru.

All three manatee species are endangered or at a heightened risk of extinction. The African manatee and Amazonian manatee are both listed as Vulnerable by the International Union for Conservation of Nature (IUCN). It is estimated that 140,000 Amazonian manatees were killed between 1935 and 1954 for their meat, fat and skin with the latter used to make leather. In more recent years, African manatee decline has been tied to incidental capture in fishing nets and hunting. Manatee hunting is now illegal in every country the African species is found in.

The two subspecies of West Indian manatee are listed as Endangered by the IUCN. Both are also expected to undergo a decline of 20% over the next 40 years. A review of almost 1,800 cases of entanglement in fishing nets and of plastic consumption among marine mammals in US waters from 2009 to 2020 found that at least 700 cases involved manatees. The chief cause of death in Florida manatees is boat strikes. However, laws in certain parts of Florida now limit boat speeds during winter, allowing slow-moving manatees more time to respond.

Questions 1–6
Complete the notes below.
Choose ONE WORD AND/OR A NUMBER from the passage for each answer.
Write your answers in boxes 1–6 on your answer sheet.

Manatees
Appearance
● look similar to dugongs, but with a differently shaped 1______________
Movement
● have fewer neck bones than most mammals
● need to use their 2______________ to help to turn their bodies around in order to look sideways
● sense vibrations in the water by means of 3______________ on their skin
Feeding
● eat mainly aquatic vegetation, such as 4______________
● grasp and pull up plants with their 5______________
Breathing
● come to the surface for air every 2-4 minutes when awake and every 15-20 while sleeping
● may regulate the 6______________ of their bodies by using muscles of diaphragm to store air internally

Questions 7–13
Do the following statements agree with the information given in Reading Passage 1?
In boxes 7–13 on your answer sheet, write
TRUE               if the statement agrees with the information
FALSE              if the statement contradicts the information
NOT GIVEN    if there is no information on this

7   West Indian manatees can be found in a variety of different aquatic habitats.
8   The Florida manatee lives in warmer waters than the Antillean manatee.
9   The African manatee’s range is limited to coastal waters between the West African countries of Mauritania and Angola.
10   The extent of the loss of Amazonian manatees in the mid-twentieth century was only revealed many years later.
11   It is predicted that West Indian manatee populations will fall in the coming decades.
12   The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009-2020.
13   There is some legislation in place which aims to reduce the likelihood of boat strikes on manatees in Florida.

READING PASSAGE 2
Procrastination
You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.

A psychologist explains why we put off important tasks and how we can break this habit

A
Procrastination is the habit of delaying a necessary task, usually by focusing on less urgent, more enjoyable, and easier activities instead. We all do it from time to time. We might be composing a message to a friend who we have to let down, or putting together an important report for college or work; we’re doing our best to avoid doing the job at hand, but deep down we know that we should just be getting on with it. Unfortunately, berating ourselves won’t stop us procrastinating again. In fact, it’s one of the worst things we can do. This matters because, as my research shows, procrastination doesn’t just waste time, but is actually linked to other problems, too.

B
Contrary to popular belief, procrastination is not due to laziness or poor time management. Scientific studies suggest procrastination is, in fact, caused by poor mood management. This makes sense if we consider that people are more likely to put off starting or completing tasks that they are really not keen to do. If just thinking about the task threatens our sense of self-worth or makes us anxious, we will be more likely to put it off. Research involving brain imaging has found that areas of the brain linked to detection of threats and emotion regulation are actually different in people who chronically procrastinate compared to those who don’t procrastinate frequently.

C
Tasks that are emotionally loaded or difficult, such as preparing for exams, are prime candidates for procrastination. People with low self-esteem are more likely to procrastinate. Another group of people who tend to procrastinate are perfectionists, who worry their work will be judged harshly by others. We know that if we don’t finish that report or complete those home repairs, then what we did can’t be evaluated. When we avoid such tasks, we also avoid the negative emotions associated with them. This is rewarding, and it conditions us to use procrastination to repair our mood. If we engage in more enjoyable tasks instead, we get another mood boost. In the long run, however, procrastination isn’t an effective way of managing emotions. The ‘mood repair’ we experience is temporary. Afterwards, people tend to be left with a sense of guilt that not only increases their negative mood, but also reinforces their tendency to procrastinate.

D
So why is this such a problem? When most people think of the costs of procrastination, they think of the toll on productivity. For example, studies have shown that procrastination negatively impacts on student performance. But putting off reading textbooks and writing essays may affect other areas of students’ lives. In one study of over 3,000 German students over a six-month period, those who reported procrastinating over their university work were also more likely to engage in study-related misconduct, such as cheating and plagiarism. But the behaviour that procrastination was most closely linked with was using fraudulent excuses to get deadline extensions. Other research shows that employees on average spend almost a quarter of their workday procrastinating, and again this is linked with negative outcomes. In fact, in one US survey of over 22,000 employees, participants who said they regularly procrastinated had less annual income and less employment stability. For every one-point increase on a measure of chronic procrastination, annual income decreased by US$15,000.

E
Procrastination also correlates with serious health and well-being problems. A tendency to procrastinate is linked to poor mental health, including higher levels of depression and anxiety. Across numerous studies, I’ve found people who regularly procrastinate report a greater number of health issues, such as headaches, flu and colds, and digestive issues. They also experience higher levels of stress and poor sleep quality. They are less likely to practise healthy behaviours, such as eating a healthy diet and regularly exercising, and use destructive coping strategies to manage their stress. In one study of over 700 people, I found people prone to procrastination had a 63% greater risk of poor heart health after accounting for other personality traits and demographics.

F
Finding better ways of managing our emotions is one route out of the vicious cycle of procrastination. An important first step is to manage our environment and how we view the task. There are a number of evidence-based strategies that can help us fend off distractions that can occupy our minds when we should be focusing on the thing we should be getting on with. For example, reminding ourselves about why the task is important and valuable can increase positive feelings towards it. Forgiving ourselves and feeling compassion when we procrastinate can help break the procrastination cycle. We should admit that we feel bad, but not be overly critical of ourselves. We should remind ourselves that we’re not the first person to procrastinate, nor the last. Doing this can take the edge off the negative feelings we have about ourselves when we procrastinate. This can all make it easier to get back on track.

Questions 14–16
Reading Passage 2 has six paragraphs, A–F.
Which paragraph contains the following information?
Write the correct letter, A–F, in boxes 14–16 on your answer sheet.
NB   You may use any letter more than once.

14   mention of false assumptions about why people procrastinate
15   reference to the realisation that others also procrastinate
16   neurological evidence of a link between procrastination and emotion

Questions 17–22
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 17–22 on your answer sheet.

What makes us procrastinate?
Many people think that procrastination is the result of 17___________. Others believe it to be the result of an inability to organise time efficiently. But scientific studies suggest that procrastination is actually due to poor mood management. The tasks we are most likely to put off are those that could damage our self-esteem or cause us to feel 18___________ when we think about them. Research comparing chronic procrastinators with other people even found differences in the brain regions associated with regulating emotions and identifying 19___________.
Emotionally loaded and difficult tasks often cause us to procrastinate. Getting ready to take 20___________ might be a typical example of one such task. People who are likely to procrastinate tend to be either 21___________ or those with low self-esteem.
Procrastination is only a short-term measure for managing emotions. It’s often followed by a feeling of 22___________, which worsens our mood and leads to more procrastination.

Questions 23 and 24
Choose TWO letters, A–E.
Write the correct letters in boxes 23 and 24 on your answer sheet.
Which TWO comparisons between employees who often procrastinate and those who do not are mentioned in the text?
A   Their salaries are lower.
B   The quality of their work is inferior.
C   They don’t keep their jobs for as long.
D   They don’t enjoy their working lives as much.
E   They have poorer relationships with colleagues.

Questions 25 and 26
Choose TWO letters, A–E.
Write the correct letters in boxes 25 and 26 on your answer sheet.
Which TWO recommendations for getting out of a cycle of procrastination does the writer give?
A   not judging ourselves harshly
B   setting ourselves manageable aims
C   rewarding ourselves for tasks achieved
D   prioritising tasks according to their importance
E   avoiding things that stop us concentrating on our tasks

READING PASSAGE 3
Invasion of the Robot Umpires
You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.

A few years ago, Fred DeJesus from Brooklyn, New York became the first umpire in a minor league baseball game to use something called the Automated Ball-Strike System (ABS), often referred to as the ‘robo-umpire’. Instead of making any judgments himself about a strike*, DeJesus had decisions fed to him through an earpiece, connected to a modified missile-tracking system. The contraption looked like a large black pizza box with one glowing green eye; it was mounted above the press stand.

Major League Baseball (MLB), who had commissioned the system, wanted human umpires to announce the calls, just as they would have done in the past. When the first pitch came in, a recorded voice told DeJesus it was a strike. Previously, calling a strike was a judgment call on the part of the umpire. Even if the batter does not hit the ball, a pitch that passes through the ‘strike zone’ (an imaginary zone about seventeen inches wide, stretching from the batter’s knees to the middle of his chest) is considered a strike. During that first game, when DeJesus announced calls, there was no heckling and no shouted disagreement. Nobody said a word.

For a hundred and fifty years or so, the strike zone has been the game’s animating force-countless arguments between a team’s manager and the umpire have taken place over its boundaries and whether a ball had crossed through it. The rules of play have evolved in various stages. Today, everyone knows that you may scream your disagreement in an umpire’s face, but you must never shout personal abuse at them or touch them. That’s a no-no. When the robo-umpires came, however, the arguments stopped.

During the first robo-umpire season, players complained about some strange calls. In response, MLB decided to tweak the dimensions of the zone, and the following year the consensus was that ABS is profoundly consistent. MLB says the device is near-perfect, precise to within fractions of an inch. “It’ll reduce controversy in the game, and be good for the game,” says Rob Manfred, who is Commissioner for MLB. But the question is whether controversy is worth reducing, or whether it is the sign of a human hand.

A human, at least, yells back. When I spoke with Frank Viola, a coach for a North Carolina team, he said that ABS works as designed, but that it was also unforgiving and pedantic, almost legalistic. “Manfred is a lawyer,” Viola noted. Some pitchers have complained that, compared with a human’s, the robot’s strike zone seems too precise. Viola was once a major-league player himself. When he was pitching, he explained, umpires rewarded skill. “Throw it where you aimed, and it would be a strike, even if it was an inch or two outside. There was a dialogue between pitcher and umpire.”

The executive tasked with running the experiment for MLB is Morgan Sword, who’s in charge of baseball operations. According to Sword, ABS was part of a larger project to make baseball more exciting since executives are terrified of losing younger fans, as has been the case with horse racing and boxing. He explains how they began the process by asking fans what version of baseball they found most exciting. The results showed that everyone wanted more action: more hits, more defense, more baserunning. This type of baseball essentially hasn’t existed since the 1960s, when the hundred-mile-an-hour fastball, which is difficult to hit and control, entered the game. It flattened the game into strikeouts, walks, and home runs a type of play lacking much action.

Sword’s team brainstormed potential fixes. Any rule that existed, they talked about changing-from changing the bats to changing the geometry of the field. But while all of these were ruled out as potential fixes, ABS was seen as a perfect vehicle for change. According to Sword, once you get the technology right, you can load any strike zone you want into the system. “It might be a triangle, or a blob, or something shaped like Texas. Over time, as baseball evolves, ABS can allow the zone to change with it.”

“In the past twenty years, sports have moved away from judgment calls. Soccer has Video Assistant Referees (for offside decisions, for example). Tennis has Hawk-Eye (for line calls, for example). For almost a decade, baseball has used instant replay on the base paths. This is widely liked, even if the precision can sometimes cause problems. But these applications deal with something physical: bases, lines, goals. The boundaries of action are precise, delineated like the keys of a piano. This is not the case with ABS and the strike zone. Historically, a certain discretion has been appreciated.”

I decided to email Alva Noë, a professor at Berkeley University and a baseball fan, for his opinion. “Hardly a day goes by that I don’t wake up and run through the reasons that this [robo-umpires] is such a terrible idea,” he replied. He later told me, “This is part of a movement to use algorithms to take the hard choices of living out of life.” Perhaps he’s right. We watch baseball to kill time, not to maximize it. Some players I have met take a dissenting stance toward the robots too, believing that accuracy is not the answer. According to Joe Russo, who plays for a New Jersey team, “With technology, people just want everything to be perfect. That’s not reality. I think perfect would be weird. Your teams are always winning, work is always just great, there’s always money in your pocket, your car never breaks down. What is there to talk about?”
—————————–
*strike: a strike is when the batter swings at a ball and misses or when the batter does not swing at a ball that passes through the strike zone.

Questions 27–32
Do the following statements agree with the claims of the writer in Reading Passage 3?
In boxes 27-32 on your answer sheet, write
YES                  if the statement agrees with the claims of the writer
NO                   if the statement contradicts the claims of the writer
NOT GIVEN    if it is impossible to say what the writer thinks about this

27   When DeJesus first used ABS, he shared decision-making about strikes with it.
28   MLB considered it necessary to amend the size of the strike zone when criticisms were received from players.
29   MLB is keen to justify the money spent on improving the accuracy of ABS’s calculations.
30   The hundred-mile-an-hour fastball led to a more exciting style of play.
31   The differing proposals for alterations to the baseball bat led to fierce debate on Sword’s team.
32   ABS makes changes to the shape of the strike zone feasible.

Questions 33–37
Complete the summary using the list of phrases, A–H, below.
Write the correct letter, A–H, in boxes 33-37 on your answer sheet.

Calls by the umpire
Even after ABS was developed, MLB still wanted human umpires to shout out decisions as they had in their 33___________ . The umpire’s job had, at one time, required a 34___________ about whether a ball was a strike. A ball is considered a strike when the batter does not hit it and it crosses through a 35___________ extending approximately from the batter’s knee to his chest.
In the past, 36___________ over strike calls were not uncommon, but today everyone accepts the complete ban on pushing or shoving the umpire. One difference, however, is that during the first game DeJesus used ABS, strike calls were met with 37___________

A   pitch boundary
B   numerous disputes
C   team tactics
D   subjective assessment
E   widespread approval
F   former roles
G   total silence
H   perceived area

Questions 38–40
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 38–40 on your answer sheet.

38   What does the writer suggest about ABS in the fifth paragraph?
A   lt is bound to make key decisions that are wrong.
B   It may reduce some of the appeal of the game.
C   It will lead to the disappearance of human umpires.
D   It may increase calls for the rules of baseball to be changed.

39   Morgan Sword says that the introduction of ABS
A   was regarded as an experiment without a guaranteed outcome.
B   was intended to keep up with developments in other sports.
C   was a response to changing attitudes about the role of sport.
D   was an attempt to ensure baseball retained a young audience.

40   Why does the writer include the views of Noe and Russo?
A   to show that attitudes to technology vary widely
B   to argue that people have unrealistic expectations of sport
C   to indicate that accuracy is not the same thing as enjoyment
D   to suggest that the number of baseball fans needs to increase`

const READING_FULL_TEST_PART2_ANSWER_KEY = `READING PASSAGE 1: Manatees
Question 1: Appearance: look similar to dugongs, but with a differently shaped 1______________

Correct Answer: tail
Exact Portion: "However, the manatee has a broad, rounded tail, whereas the dugong’s is fluked, like that of a whale."
Short Thai Explanation: โจทย์ถามว่าส่วนไหนของ manatee กับ dugong มีรูปร่างต่างกัน โดยในบทความเปรียบเทียบชัดเจนว่าความต่างหลักคือหางของ manatee เป็นทรงกลมกว้าง ส่วน dugong หางเป็นแฉก ดังนั้นคำตอบคือ tail.
Paraphrased Vocabulary: look similar to = look quite alike; differently shaped = broad, rounded ... whereas the dugong’s is fluked

Question 2: Movement: need to use their 2______________ to help to turn their bodies around in order to look sideways

Correct Answer: flippers
Exact Portion: "To see something on its left or its right, a manatee must turn its entire body, steering with its flippers."
Short Thai Explanation: manatee หันคอซ้ายขวาไม่ได้ จึงต้องหมุนทั้งตัวเวลาอยากมองด้านข้าง และบทความบอกตรง ๆ ว่ามันบังคับทิศทางด้วย flippers.
Paraphrased Vocabulary: look sideways = see something on its left or its right; help to turn their bodies = steering with

Question 3: Movement: sense vibrations in the water by means of 3______________ on their skin

Correct Answer: hairs
Exact Portion: "They also have some hairs covering their bodies which help them sense vibrations in the water around them."
Short Thai Explanation: ข้อนี้หาได้ตรงตัวจากบทความ เพราะผู้เขียนบอกว่าเส้นขนที่ปกคลุมร่างกายช่วยให้ manatee รับรู้แรงสั่นสะเทือนในน้ำได้.
Paraphrased Vocabulary: by means of = with the help of; on their skin = covering their bodies

Question 4: Feeding: eat mainly aquatic vegetation, such as 4______________

Correct Answer: Seagrasses
Exact Portion: "Seagrasses and other marine plants make up most of a manatee’s diet."
Short Thai Explanation: คำว่า such as ในโจทย์ต้องการตัวอย่างพืชน้ำที่ manatee กินเป็นหลัก และบทความยก Seagrasses มาเป็นคำแรก จึงเป็นคำตอบที่ตรงที่สุด.
Paraphrased Vocabulary: eat mainly = make up most of a manatee’s diet; aquatic vegetation = marine plants

Question 5: Feeding: grasp and pull up plants with their 5______________

Correct Answer: lips
Exact Portion: "manatees have lips which function like a pair of hands to help tear food away from the seafloor."
Short Thai Explanation: แม้บทความจะบอกว่าไม่ได้ใช้ incisors จับอาหาร แต่ใช้ lips แทน โดย lips ทำหน้าที่เหมือนมือในการดึงหรือฉีกอาหารขึ้นมาจากพื้นทะเล.
Paraphrased Vocabulary: grasp and pull up plants = tear food away from the seafloor; function like a pair of hands = help pick up food

Question 6: Breathing: may regulate the 6______________ of their bodies by using muscles of diaphragm to store air internally

Correct Answer: buoyancy
Exact Portion: "It’s thought that manatees use their muscular diaphragm and breathing to adjust their buoyancy."
Short Thai Explanation: โจทย์ใช้คำว่า regulate แต่บทความใช้คำว่า adjust ซึ่งมีความหมายสอดคล้องกัน และสิ่งที่ manatee ปรับก็คือ buoyancy หรือการลอยตัวของร่างกาย.
Paraphrased Vocabulary: regulate = adjust; store air internally = compress and store gas in folds in their large intestine

Question 7: West Indian manatees can be found in a variety of different aquatic habitats.

Correct Answer: TRUE
Exact Portion: "It moves between fresh water and salt water, taking advantage of coastal mangroves and coral reefs, rivers, lakes and inland lagoons."
Short Thai Explanation: บทความยืนยันชัดว่าพวกมันอาศัยได้ทั้งน้ำจืด น้ำเค็ม ป่าชายเลน แนวปะการัง แม่น้ำ ทะเลสาบ และลากูน จึงตรงกับคำว่า a variety of different aquatic habitats.
Paraphrased Vocabulary: a variety of different aquatic habitats = fresh water, salt water, mangroves, coral reefs, rivers, lakes and lagoons

Question 8: The Florida manatee lives in warmer waters than the Antillean manatee.

Correct Answer: NOT GIVEN
Exact Portion: "the Antillean manatee is found in waters from the Bahamas to Brazil, whereas the Florida manatee is found in US waters ... When the ambient water temperature drops below 20°C, it takes refuge in naturally and artificially warmed water"
Short Thai Explanation: บทความบอกแค่ถิ่นอาศัยของทั้งสองชนิดย่อย และบอกว่า Florida manatee จะหนีไปน้ำอุ่นเมื่ออากาศเย็นลง แต่ไม่ได้เปรียบเทียบตรง ๆ ว่าน้ำที่ Florida manatee อยู่โดยรวมอุ่นกว่า Antillean manatee.
Paraphrased Vocabulary: warmer waters than = explicit temperature comparison, which is missing

Question 9: The African manatee’s range is limited to coastal waters between the West African countries of Mauritania and Angola.

Correct Answer: FALSE
Exact Portion: "The species also makes use of rivers, with the mammals seen in landlocked countries such as Mali and Niger."
Short Thai Explanation: โจทย์บอกว่าถูกจำกัดอยู่แค่ชายฝั่ง แต่บทความระบุชัดว่า African manatees ยังเข้าแม่น้ำและพบได้ในประเทศที่ไม่มีทางออกทะเลด้วย จึงขัดแย้งโดยตรง.
Paraphrased Vocabulary: limited to coastal waters ≠ seen in landlocked countries

Question 10: The extent of the loss of Amazonian manatees in the mid-twentieth century was only revealed many years later.

Correct Answer: NOT GIVEN
Exact Portion: "It is estimated that 140,000 Amazonian manatees were killed between 1935 and 1954"
Short Thai Explanation: เรารู้จำนวนที่ถูกฆ่าในช่วงปี 1935-1954 แต่บทความไม่ได้บอกเลยว่าข้อมูลนี้ถูกค้นพบหรือเปิดเผยเมื่อไร ดังนั้นส่วน many years later ไม่มีหลักฐานรองรับ.
Paraphrased Vocabulary: extent of the loss = 140,000 were killed; only revealed many years later = timing of discovery not mentioned

Question 11: It is predicted that West Indian manatee populations will fall in the coming decades.

Correct Answer: TRUE
Exact Portion: "Both are also expected to undergo a decline of 20% over the next 40 years."
Short Thai Explanation: คำว่า expected ตรงกับ predicted และ undergo a decline ก็คือจำนวนลดลง ดังนั้นข้อความนี้ตรงกับโจทย์ชัดเจน.
Paraphrased Vocabulary: predicted = expected; will fall = undergo a decline; in the coming decades = over the next 40 years

Question 12: The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009-2020.

Correct Answer: NOT GIVEN
Exact Portion: "A review of almost 1,800 cases ... from 2009 to 2020 found that at least 700 cases involved manatees."
Short Thai Explanation: บทความให้เพียงจำนวนเคสในช่วงปี 2009-2020 แต่ไม่ได้เปรียบเทียบกับช่วงก่อนหน้า จึงไม่มีข้อมูลว่าความเสี่ยงเพิ่มขึ้นอย่างมีนัยสำคัญหรือไม่.
Paraphrased Vocabulary: increased significantly = upward trend over time, which is not stated

Question 13: There is some legislation in place which aims to reduce the likelihood of boat strikes on manatees in Florida.

Correct Answer: TRUE
Exact Portion: "laws in certain parts of Florida now limit boat speeds during winter, allowing slow-moving manatees more time to respond."
Short Thai Explanation: บทความพูดถึง laws ที่จำกัดความเร็วเรือในบางพื้นที่ของ Florida เพื่อให้ manatee มีเวลาหลบมากขึ้น จึงตรงกับการลดโอกาสเกิด boat strikes.
Paraphrased Vocabulary: legislation = laws; reduce likelihood of boat strikes = limit boat speeds during winter

READING PASSAGE 2: Procrastination
Question 14: mention of false assumptions about why people procrastinate

Correct Answer: B
Exact Portion: "Contrary to popular belief, procrastination is not due to laziness or poor time management."
Short Thai Explanation: ย่อหน้า B เริ่มด้วยการหักล้างความเชื่อผิด ๆ เกี่ยวกับสาเหตุของการผัดวันประกันพรุ่ง จึงเป็นย่อหน้าที่พูดถึง false assumptions โดยตรง.
Paraphrased Vocabulary: false assumptions = popular belief that is contradicted

Question 15: reference to the realisation that others also procrastinate

Correct Answer: F
Exact Portion: "We should remind ourselves that we’re not the first person to procrastinate, nor the last."
Short Thai Explanation: ย่อหน้า F แนะนำให้เตือนตัวเองว่าเราไม่ใช่คนเดียวที่เป็นแบบนี้ ซึ่งตรงกับการตระหนักว่าคนอื่นก็ procrastinate เหมือนกัน.
Paraphrased Vocabulary: realisation that others also procrastinate = not the first person to procrastinate, nor the last

Question 16: neurological evidence of a link between procrastination and emotion

Correct Answer: B
Exact Portion: "Research involving brain imaging has found that areas of the brain linked to detection of threats and emotion regulation are actually different"
Short Thai Explanation: brain imaging เป็นหลักฐานทางประสาทวิทยาโดยตรง และเนื้อหาก็เชื่อมพฤติกรรม procrastination เข้ากับสมองส่วนที่เกี่ยวกับอารมณ์.
Paraphrased Vocabulary: neurological evidence = brain imaging; emotion = emotion regulation

Question 17: Many people think that procrastination is the result of 17___________.

Correct Answer: laziness
Exact Portion: "Contrary to popular belief, procrastination is not due to laziness or poor time management."
Short Thai Explanation: โจทย์พูดถึงความเชื่อของคนทั่วไป และบทความระบุสองความเชื่อหลักคือ laziness กับ poor time management โดยช่องว่างแรกต้องเป็น laziness.
Paraphrased Vocabulary: Many people think = popular belief

Question 18: The tasks we are most likely to put off are those that could damage our self-esteem or cause us to feel 18___________ when we think about them.

Correct Answer: anxious
Exact Portion: "If just thinking about the task threatens our sense of self-worth or makes us anxious, we will be more likely to put it off."
Short Thai Explanation: threatens our sense of self-worth ตรงกับ damage our self-esteem และ makes us anxious ก็คือ cause us to feel anxious.
Paraphrased Vocabulary: damage our self-esteem = threatens our sense of self-worth; cause us to feel = makes us

Question 19: Research comparing chronic procrastinators with other people even found differences in the brain regions associated with regulating emotions and identifying 19___________.

Correct Answer: threats
Exact Portion: "areas of the brain linked to detection of threats and emotion regulation are actually different"
Short Thai Explanation: โจทย์ใช้คำว่า identifying แต่บทความใช้คำว่า detection ซึ่งมีความหมายเท่ากัน ดังนั้นสิ่งที่สมองระบุได้ต่างกันคือ threats.
Paraphrased Vocabulary: identifying = detection of; associated with = linked to

Question 20: Emotionally loaded and difficult tasks often cause us to procrastinate. Getting ready to take 20___________ might be a typical example of one such task.

Correct Answer: exams
Exact Portion: "Tasks that are emotionally loaded or difficult, such as preparing for exams, are prime candidates for procrastination."
Short Thai Explanation: preparing for exams คือคำตอบตรงตัวของตัวอย่างงานยากที่มีภาระทางอารมณ์และทำให้เราชอบผัดไปก่อน.
Paraphrased Vocabulary: getting ready to take = preparing for; typical example = such as

Question 21: People who are likely to procrastinate tend to be either 21___________ or those with low self-esteem.

Correct Answer: perfectionists
Exact Portion: "People with low self-esteem are more likely to procrastinate. Another group of people who tend to procrastinate are perfectionists"
Short Thai Explanation: บทความยกมา 2 กลุ่มคือคน self-esteem ต่ำ และ perfectionists ดังนั้นคำตอบที่หายไปคือ perfectionists.
Paraphrased Vocabulary: another group = either A or B structure in the summary

Question 22: It’s often followed by a feeling of 22___________, which worsens our mood and leads to more procrastination.

Correct Answer: guilt
Exact Portion: "people tend to be left with a sense of guilt that not only increases their negative mood, but also reinforces their tendency to procrastinate."
Short Thai Explanation: หลังจาก procrastinate แล้วมักเหลือความรู้สึกผิดอยู่ ซึ่งยิ่งทำให้อารมณ์แย่และวนกลับไป procrastinate อีก.
Paraphrased Vocabulary: followed by a feeling of = left with a sense of; worsens our mood = increases negative mood

Question 23: Which TWO comparisons between employees who often procrastinate and those who do not are mentioned in the text?

Correct Answer: A
Accepted Answers: A | C
Answer Group: procrastination-employees-comparison
Exact Portion: "participants who said they regularly procrastinated had less annual income and less employment stability."
Short Thai Explanation: สำหรับข้อ 23-24 บทความให้ 2 คำตอบคือรายได้น้อยกว่าและความมั่นคงในงานน้อยกว่า ระบบจะยอมรับ A และ C โดยไม่บังคับลำดับ.
Paraphrased Vocabulary: less annual income = salaries are lower; less employment stability = don’t keep their jobs for as long

Question 24: Which TWO comparisons between employees who often procrastinate and those who do not are mentioned in the text?

Correct Answer: C
Accepted Answers: A | C
Answer Group: procrastination-employees-comparison
Exact Portion: "participants who said they regularly procrastinated had less annual income and less employment stability."
Short Thai Explanation: ข้อนี้อยู่ใน answer pair เดียวกับข้อ 23 ดังนั้นคำตอบที่ถูกอีกตัวคือ C และถ้าผู้เรียนสลับลำดับ A/C กับ C/A ก็ยังจะนับถูก.
Paraphrased Vocabulary: less employment stability = don’t keep their jobs for as long

Question 25: Which TWO recommendations for getting out of a cycle of procrastination does the writer give?

Correct Answer: A
Accepted Answers: A | E
Answer Group: procrastination-cycle-recommendations
Exact Portion: "strategies that can help us fend off distractions" / "not be overly critical of ourselves"
Short Thai Explanation: สำหรับข้อ 25-26 ผู้เขียนแนะนำ 2 อย่างคืออย่าตัดสินตัวเองแรงเกินไป และกำจัดสิ่งรบกวนสมาธิ ระบบจะยอมรับ A และ E โดยไม่บังคับลำดับ.
Paraphrased Vocabulary: not judging ourselves harshly = not be overly critical of ourselves; avoiding things that stop us concentrating = fend off distractions

Question 26: Which TWO recommendations for getting out of a cycle of procrastination does the writer give?

Correct Answer: E
Accepted Answers: A | E
Answer Group: procrastination-cycle-recommendations
Exact Portion: "strategies that can help us fend off distractions" / "not be overly critical of ourselves"
Short Thai Explanation: ข้อนี้จับคู่กับข้อ 25 และคำตอบอีกตัวคือ E เพราะผู้เขียนชี้ชัดว่าต้องจัดการสิ่งรบกวนสมาธิเมื่อเราควรโฟกัสงาน.
Paraphrased Vocabulary: fend off distractions = avoid things that stop us concentrating on our tasks

READING PASSAGE 3: Invasion of the Robot Umpires
Question 27: When DeJesus first used ABS, he shared decision-making about strikes with it.

Correct Answer: NO
Exact Portion: "Instead of making any judgments himself about a strike, DeJesus had decisions fed to him through an earpiece"
Short Thai Explanation: ข้อความนี้ขัดกับโจทย์โดยตรง เพราะ DeJesus ไม่ได้ร่วมตัดสินกับระบบ แต่รับคำตัดสินจากระบบอย่างเดียว.
Paraphrased Vocabulary: shared decision-making ≠ instead of making any judgments himself

Question 28: MLB considered it necessary to amend the size of the strike zone when criticisms were received from players.

Correct Answer: YES
Exact Portion: "players complained about some strange calls. In response, MLB decided to tweak the dimensions of the zone"
Short Thai Explanation: เมื่อผู้เล่นร้องเรียนเรื่อง strange calls ทาง MLB ก็ปรับขนาดของ strike zone ทันที จึงตรงกับข้อความในโจทย์.
Paraphrased Vocabulary: criticisms were received = players complained; amend the size = tweak the dimensions

Question 29: MLB is keen to justify the money spent on improving the accuracy of ABS’s calculations.

Correct Answer: NOT GIVEN
Exact Portion: "MLB says the device is near-perfect, precise to within fractions of an inch."
Short Thai Explanation: บทความพูดถึงความแม่นยำของ ABS แต่ไม่ได้พูดถึงเรื่องงบประมาณหรือความพยายามอธิบายว่าค่าใช้จ่ายคุ้มค่า.
Paraphrased Vocabulary: justify the money spent = financial motivation, which is not mentioned

Question 30: The hundred-mile-an-hour fastball led to a more exciting style of play.

Correct Answer: NO
Exact Portion: "It flattened the game into strikeouts, walks, and home runs a type of play lacking much action."
Short Thai Explanation: โจทย์บอกว่าทำให้เกมน่าตื่นเต้นขึ้น แต่บทความบอกตรงกันข้ามว่ามันทำให้เกมขาดแอคชัน จึงเป็น NO.
Paraphrased Vocabulary: more exciting style of play ≠ flattened the game ... lacking much action

Question 31: The differing proposals for alterations to the baseball bat led to fierce debate on Sword’s team.

Correct Answer: NOT GIVEN
Exact Portion: "Any rule that existed, they talked about changing-from changing the bats to changing the geometry of the field."
Short Thai Explanation: บทความบอกเพียงว่าทีมงานคุยกันเรื่องการเปลี่ยนกฎหลายอย่าง แต่ไม่ได้บอกเลยว่ามีการถกเถียงอย่างดุเดือด.
Paraphrased Vocabulary: fierce debate = argument intensity, which is not stated

Question 32: ABS makes changes to the shape of the strike zone feasible.

Correct Answer: YES
Exact Portion: "you can load any strike zone you want into the system. 'It might be a triangle, or a blob, or something shaped like Texas.'"
Short Thai Explanation: Sword อธิบายชัดว่าถ้าเทคโนโลยีพร้อม เราสามารถใส่ strike zone รูปแบบไหนก็ได้ จึงทำให้การเปลี่ยนรูปร่างของ zone เป็นไปได้จริง.
Paraphrased Vocabulary: feasible = can load any strike zone you want / allow the zone to change

Question 33: Even after ABS was developed, MLB still wanted human umpires to shout out decisions as they had in their 33___________ .

Correct Answer: F
Exact Portion: "wanted human umpires to announce the calls, just as they would have done in the past"
Short Thai Explanation: in the past สื่อถึงบทบาทเดิมของกรรมการมนุษย์ จึงตรงกับ former roles.
Paraphrased Vocabulary: in the past = former roles

Question 34: The umpire’s job had, at one time, required a 34___________ about whether a ball was a strike.

Correct Answer: D
Exact Portion: "calling a strike was a judgment call on the part of the umpire"
Short Thai Explanation: judgment call คือการใช้วิจารณญาณส่วนตัวของกรรมการ จึงตรงกับ subjective assessment.
Paraphrased Vocabulary: judgment call = subjective assessment

Question 35: A ball is considered a strike when the batter does not hit it and it crosses through a 35___________ extending approximately from the batter’s knee to his chest.

Correct Answer: H
Exact Portion: "the ‘strike zone’ (an imaginary zone about seventeen inches wide, stretching from the batter’s knees to the middle of his chest)"
Short Thai Explanation: strike zone ถูกอธิบายว่าเป็น imaginary zone หรือพื้นที่สมมติที่ผู้เล่นรับรู้ร่วมกัน จึงตรงกับ perceived area.
Paraphrased Vocabulary: imaginary zone = perceived area

Question 36: In the past, 36___________ over strike calls were not uncommon.

Correct Answer: B
Exact Portion: "countless arguments between a team’s manager and the umpire have taken place over its boundaries"
Short Thai Explanation: countless arguments หมายถึงการโต้เถียงจำนวนมาก ดังนั้น numerous disputes จึงเป็นคำตอบที่ตรงที่สุด.
Paraphrased Vocabulary: countless arguments = numerous disputes

Question 37: during the first game DeJesus used ABS, strike calls were met with 37___________

Correct Answer: G
Exact Portion: "there was no heckling and no shouted disagreement. Nobody said a word."
Short Thai Explanation: nobody said a word แปลว่าเงียบกริบ จึงตรงกับ total silence.
Paraphrased Vocabulary: nobody said a word = total silence

Question 38: What does the writer suggest about ABS in the fifth paragraph?

Correct Answer: B
Exact Portion: "ABS works as designed, but that it was also unforgiving and pedantic" / "There was a dialogue between pitcher and umpire."
Short Thai Explanation: ผู้เขียนชี้ว่า ABS แม่นก็จริง แต่ความเถรตรงเกินไปทำให้เสน่ห์แบบมนุษย์และการโต้ตอบในเกมหายไปบางส่วน จึงสื่อว่ามันอาจลดความน่าดึงดูดของเกม.
Paraphrased Vocabulary: reduce some of the appeal = unforgiving, pedantic, loss of dialogue and human flexibility

Question 39: Morgan Sword says that the introduction of ABS

Correct Answer: D
Exact Portion: "ABS was part of a larger project to make baseball more exciting since executives are terrified of losing younger fans"
Short Thai Explanation: Sword บอกเหตุผลชัดว่า MLB กลัวเสียแฟนรุ่นใหม่ จึงพยายามทำให้เกมน่าตื่นเต้นขึ้นเพื่อรักษาคนดูกลุ่มนี้ไว้.
Paraphrased Vocabulary: terrified of losing younger fans = attempt to ensure baseball retained a young audience

Question 40: Why does the writer include the views of Noe and Russo?

Correct Answer: C
Exact Portion: "We watch baseball to kill time, not to maximize it." / "people just want everything to be perfect ... What is there to talk about?"
Short Thai Explanation: ผู้เขียนใช้มุมมองของทั้งสองคนเพื่อย้ำว่าความแม่นยำหรือความสมบูรณ์แบบไม่ได้เท่ากับความสนุกเสมอไป เพราะกีฬาเองก็มีเสน่ห์จากความเป็นมนุษย์และพื้นที่ให้ถกเถียง.
Paraphrased Vocabulary: accuracy is not the same thing as enjoyment = perfect would be weird; no imperfection means no conversation`

const READING_FULL_TEST_PART3_PASSAGE_TEXT = `READING PASSAGE 1
Nutmeg – a valuable spice
You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.

The nutmeg tree, Myristica fragrans, is a large evergreen tree native to Southeast Asia. Until the late 18th century, it only grew in one place in the world: a small group of islands in the Banda Sea, part of the Moluccas – or Spice Islands – in northeastern Indonesia. The tree is thickly branched with dense foliage of tough, dark green oval leaves, and produces small, yellow, bell-shaped flowers and pale yellow pear-shaped fruits. The fruit is encased in a flesh husk. When the fruit is ripe, this husk splits into two halves along a ridge running the length of the fruit. Inside is a purple-brown shiny seed, 2-3 cm long by about 2 cm across, surrounded by a lacy red or crimson covering called an ‘aril’. These are the sources of the two spices nutmeg and mace, the former being produced from the dried seed and the latter from the aril.

Nutmeg was a highly prized and costly ingredient in European cuisine in the Middle Ages, and was used as a flavouring, medicinal, and preservative agent. Throughout this period, the Arabs were the exclusive importers of the spice to Europe. They sold nutmeg for high prices to merchants based in Venice, but they never revealed the exact location of the source of this extremely valuable commodity. The Arab-Venetian dominance of the trade finally ended in 1512, when the Portuguese reached the Banda Islands and began exploiting its precious resources.

Always in danger of competition from neighbouring Spain, the Portuguese began subcontracting their spice distribution to Dutch traders. Profits began to flow into the Netherlands, and the Dutch commercial fleet swiftly grew into one of the largest in the world. The Dutch quietly gained control of most of the shipping and trading of spices in Northern Europe. Then, in 1580, Portugal fell under Spanish rule, and by the end of the 16th century the Dutch found themselves locked out of the market. As prices for pepper, nutmeg, and other spices soared across Europe, they decided to fight back.

In 1602, Dutch merchants founded the VOC, a trading corporation better known as the Dutch East India Company. By 1617, the VOC was the richest commercial operation in the world. The company had 50,000 employees worldwide, with a private army of 30,000 men and a fleet of 200 ships. At the same time, thousands of people across Europe were dying of the plague, a highly contagious and deadly disease. Doctors were desperate for a way to stop the spread of this disease, and they decided nutmeg held the cure. Everybody wanted nutmeg, and many were willing to spare no expense to have it. Nutmeg bought for a few pennies in Indonesia could be sold for 68,000 times its original cost on the streets of London. The only problem was the short supply. And that’s where the Dutch found their opportunity.

The Banda Islands were ruled by local sultans who insisted on maintaining a neutral trading policy towards foreign powers. This allowed them to avoid the presence of Portuguese or Spanish troops on their soil, but it also left them unprotected from other invaders. In 1621, the Dutch arrived and took over. Once securely in control of the Bandas, the Dutch went to work protecting their new investment. They concentrated all nutmeg production into a few easily guarded areas, uprooting and destroying any trees outside the plantation zones. Anyone caught growing a nutmeg seedling or carrying seeds without the proper authority was severely punished. In addition, all exported nutmeg was covered with lime to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands. There was only one obstacle to Dutch domination. One of the Banda Islands, a sliver of land called Run, only 3 km long by less than 1 km wide, was under the control of the British. After decades of fighting for control of this tiny island, the Dutch and British arrived at a compromise settlement, the Treaty of Breda, in 1667. Intent on securing their hold over every nutmeg-producing island, the Dutch offered a trade: if the British would give them the island of Run, they would in turn give Britain a distant and much less valuable island in North America. The British agreed. That other island was Manhattan, which is how New Amsterdam became New York. The Dutch now had a monopoly over the nutmeg trade which would last for another century.

Then, in 1770, a Frenchman named Pierre Poivre successfully smuggled nutmeg plants to safety in Mauritius, an island off the coast of Africa. Some of these were later exported to the Caribbean where they thrived, especially on the island of Grenada. Next, in 1778, a volcanic eruption in the Banda region caused a tsunami that wiped out half the nutmeg groves. Finally, in 1809, the British returned to Indonesia and seized the Banda Islands by force. They returned the islands to the Dutch in 1817, but not before transplanting hundreds of nutmeg seedlings to plantations in several locations across southern Asia. The Dutch nutmeg monopoly was over.

Today, nutmeg is grown in Indonesia, the Caribbean, India, Malaysia, Papua New Guinea and Sri Lanka, and world nutmeg production is estimated to average between 10,000 and 12,000 tonnes per year.

Questions 1-4
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-4 on your answer sheet.

The nutmeg tree and fruit
●   the leaves of the tree are 1……………………. in shape
●   the 2……………………. surrounds the fruit and breaks open when the fruit is ripe
●   the 3……………………. is used to produce the spice nutmeg
●   the covering known as the aril is used to produce 4……………………..
●   the tree has yellow flowers and fruit

Questions 5-7
Do the following statements agree with the information given in Reading Passage 1?
In boxes 5-7 on your answer sheet, write
TRUE               if the statement agrees with the information
FALSE              if the statement contradicts the information
NOT GIVEN    if there is no information on this

5   In the Middle Ages, most Europeans knew where nutmeg was grown.
6   The VOC was the world’s first major trading company.
7   Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.

Questions 8-13
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 8-13 on your answer sheet.

Middle Ages
Nutmeg was brought to Europe by the 8……………
16th century
European nations took control of the nutmeg trade
17th century
Demand for nutmeg grew, as it was believed to be effective against the disease known as the 9……………
The Dutch
– took control of the Banda Islands
– restricted nutmeg production to a few areas
– put 10…………… on nutmeg to avoid it being cultivated outside the islands
– finally obtained the island of 11…………… from the British
Late 18th century
1770 – nutmeg plants were secretly taken to 12……………
1778 – half the Banda Islands’ nutmeg plantations were destroyed by a 13……………

READING PASSAGE 2
Driverless cars
You should spend about 20 minutes on Questions 14-26 which are based on Reading Passage 2 below.

A
The automotive sector is well used to adapting to automation in manufacturing. The implementation of robotic car manufacture from the 1970s onwards led to significant cost savings and improvements in the reliability and flexibility of vehicle mass production. A new challenge to vehicle production is now on the horizon and, again, it comes from automation. However, this time it is not to do with the manufacturing process, but with the vehicles themselves.
Research projects on vehicle automation are not new. Vehicles with limited self-driving capabilities have been around for more than 50 years, resulting in significant contributions towards driver assistance systems. But since Google announced in 2010 that it had been trialling self-driving cars on the streets of California, progress in this field has quickly gathered pace.

B
There are many reasons why technology is advancing so fast. One frequently cited motive is safety; indeed, research at the UK’s Transport Research Laboratory has demonstrated that more than 90 percent of road collisions involve human error as a contributory factor, and it is the primary cause in the vast majority. Automation may help to reduce the incidence of this.
Another aim is to free the time people spend driving for other purposes. If the vehicle can do some or all of the driving, it may be possible to be productive, to socialise or simply to relax while automation systems have responsibility for safe control of the vehicle. If the vehicle can do the driving, those who are challenged by existing mobility models – such as older or disabled travellers – may be able to enjoy significantly greater travel autonomy.

C
Beyond these direct benefits, we can consider the wider implications for transport and society, and how manufacturing processes might need to respond as a result. At present, the average car spends more than 90 percent of its life parked. Automation means that initiatives for car-sharing become much more viable, particularly in urban areas with significant travel demand. If a significant proportion of the population choose to use shared automated vehicles, mobility demand can be met by far fewer vehicles.

D
The Massachusetts Institute of Technology investigated automated mobility in Singapore, finding that fewer than 30 percent of the vehicles currently used would be required if fully automated car sharing could be implemented. If this is the case, it might mean that we need to manufacture far fewer vehicles to meet demand. However, the number of trips being taken would probably increase, partly because empty vehicles would have to be moved from one customer to the next.
Modelling work by the University of Michigan Transportation Research Institute suggests automated vehicles might reduce vehicle ownership by 43 percent, but that vehicles’ average annual mileage double as a result. As a consequence, each vehicle would be used more intensively, and might need replacing sooner. This faster rate of turnover may mean that vehicle production will not necessarily decrease

E
Automation may prompt other changes in vehicle manufacture. If we move to a model where consumers are tending not to own a single vehicle but to purchase access to a range of vehicle through a mobility provider, drivers will have the freedom to select one that best suits their needs for a particular journey, rather than making a compromise across all their requirements.
Since, for most of the time, most of the seats in most cars are unoccupied, this may boost production of a smaller, more efficient range of vehicles that suit the needs of individuals. Specialised vehicles may then be available for exceptional journeys, such as going on a family camping trip or helping a son or daughter move to university.

F
There are a number of hurdles to overcome in delivering automated vehicles to our roads. These include the technical difficulties in ensuring that the vehicle works reliably in the infinite range of traffic, weather and road situations it might encounter; the regulatory challenges in understanding how liability and enforcement might change when drivers are no longer essential for vehicle operation; and the societal changes that may be required for communities to trust and accept automated vehicles as being a valuable part of the mobility landscape.

G
It’s clear that there are many challenges that need to be addressed but, through robust and targeted research, these can most probably be conquered within the next 10 years. Mobility will change in such potentially significant ways and in association with so many other technological developments, such as telepresence and virtual reality, that it is hard to make concrete predictions about the future. However, one thing is certain: change is coming, and the need to be flexible in response to this will be vital for those involved in manufacturing the vehicles that will deliver future mobility.

Questions 14-18
Reading Passage 2 has seven paragraphs, A-G.
Which section contains the following information?
Write the correct letter, A-G, in boxes 14-18 on your answer sheet.

14   reference to the amount of time when a car is not in use
15   mention of several advantages of driverless vehicles for individual road-users
16   reference to the opportunity of choosing the most appropriate vehicle for each trip
17   an estimate of how long it will take to overcome a number of problems
18   a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured

Questions 19-22
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 19-22 on your answer sheet.

The impact of driverless cars
Figures from the Transport Research Laboratory indicate that most motor accidents are partly due to 19……………………., so the introduction of driverless vehicles will result in greater safety. In addition to the direct benefits of automation, it may bring other advantages. For example, schemes for 20………………………. will be more workable, especially in towns and cities, resulting in fewer cars on the road.
According to the University of Michigan Transportation Research Institute, there could be a 43 percent drop in 21…………………….. of cars. However, this would mean that the yearly 22…………………….. of each car would, on average, be twice as high as it currently is. this would lead to a higher turnover of vehicles, and therefore no reduction in automotive manufacturing.

Questions 23 and 24
Choose TWO letters, A-E.
Write the correct letters in boxes 23 and 24 on your answer sheet.
Which TWO benefits of automated vehicles does the writer mention?
A   Car travellers could enjoy considerable cost savings.
B   It would be easier to find parking spaces in urban areas.
C   Travellers could spend journeys doing something other than driving.
D   People who find driving physically difficult could travel independently.
E   A reduction in the number of cars would mean a reduction in pollution.

Questions 25 and 26
Choose TWO letters, A-E.
Write the correct letters in boxes 25 and 26 on your answer sheet.
Which TWO challenges to automated vehicle development does the writer mention?
A   making sure the general public has confidence in automated vehicles
B   managing the pace of transition from conventional to automated vehicles
C   deciding how to compensate professional drivers who become redundant
D   setting up the infrastructure to make roads suitable for automated vehicles
E   getting automated vehicles to adapt to various different driving conditions

READING PASSAGE 3
What is exploration?
You should spend about 20 minutes on Questions 27-40 which are based on Reading Passage 3 below.

We are all explores. Our desire to discover, and then share that new-found knowledge, is part of what makes us human – indeed, this has played an important part in our success as a species. Long before the first caveman slumped down beside the fire and grunted news that there were plenty of wildebeest over yonder, our ancestors had learnt the value of sending out scouts to investigate the unknown. This questing nature of ours undoubtedly helped our species spread around the globe, just as it nowadays no doubt helps the last nomadic Penan maintain their existence in the depleted forests of Borneo, and a visitor negotiate the subways of New York.

Over the years, we’ve come to think of explorers as a peculiar breed – different from the rest of us, different from those of us who are merely ‘well travelled’, even; and perhaps there is a type of person more suited to seeking out the new, a type of caveman more inclined to risk venturing out. That, however, doesn’t take away from the fact that we all have this enquiring instinct, even today; and that in all sorts of professions – whether artist, marine biologist or astronomer – borders of the unknown are being tested each day.

Thomas Hardy set some of his novels in Egdon Heath, a fictional area of uncultivated land, and used the landscape to suggest the desires and fears of his characters. He is delving into matters we all recognise because they are common to humanity. This is surely an act of exploration, and into a world as remote as the author chooses. Explorer and travel writer Peter Fleming talks of the moment when the explorer returns to the existence he has left behind with his loved ones. The traveller ‘who has for weeks or months seen himself only as a puny and irrelevant alien crawling laboriously over a country in which he has no roots and no background, suddenly encounters his other self, a relatively solid figure, with a place in the minds of certain people’.

In this book about the exploration of the earth’s surface, I have confined myself to those whose travels were real and who also aimed at more than personal discovery. But that still left me with another problem: the word ‘explorer’ has become associated with a past era. We think back to a golden age, as if exploration peaked somehow in the 19th century – as if the process of discovery is now on the decline, though the truth is that we have named only one and a half million of this planet’s species, and there may be more than 10 million – and that’s not including bacteria. We have studied only 5 per cent of the species we know. We have scarcely mapped the ocean floors, and know even less about ourselves; we fully understand the workings of only 10 per cent of our brains.

Here is how some of today’s ‘explorers’ define the word. Ran Fiennes, dubbed the ‘greatest living explorer’, said, ‘An explorer is someone who has done something that no human has done before – and also done something scientifically useful.’ Chris Bonington, a leading mountaineer, felt exploration was to be found in the act of physically touching the unknown: ‘You have to have gone somewhere new.’ Then Robin Hanbury-Tenison, a campaigner on behalf of remote so-called ‘tribal’ peoples, said, ‘A traveller simply records information about some far-off world, and reports back; but an explorer changes the world.’ Wilfred Thesiger, who crossed Arabia’s Empty Quarter in 1946, and belongs to an era of unmechanised travel now lost to the rest of us, told me, ‘If I’d gone across by camel when I could have gone by car, it would have been a stunt.’ To him, exploration meant bringing back information from a remote place regardless of any great self-discovery.

Each definition is slightly different – and tends to reflect the field of endeavour of each pioneer. It was the same whoever I asked: the prominent historian would say exploration was a thing of the past, the cutting-edge scientist would say it was of the present. And so on. They each set their own particular criteria; the common factor in their approach being that they all had, unlike many of us who simply enjoy travel or discovering new things, both a very definite objective from the outset and also a desire to record their findings.

I’d best declare my own bias. As a writer, I’m interested in the exploration of ideas. I’ve done a great many expeditions and each one was unique. I’ve lived for months alone with isolated groups of people all around the world, even two ‘uncontacted tribes’. But none of these things is of the slightest interest to anyone unless, through my books, I’ve found a new slant, explored a new idea. Why? Because the world has moved on. The time has long passed for the great continental voyages – another walk to the poles, another crossing of the Empty Quarter. We know how the land surface of our planet lies; exploration of it is now down to the details – the habits of microbes, say, or the grazing behaviour of buffalo. Aside from the deep sea and deep underground, it’s the era of specialists. However, this is to disregard the role the human mind has in conveying remote places; and this is what interests me: how a fresh interpretation, even of a well-travelled route, can give its readers new insights.

Questions 27-32
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-32 on your answer sheet.

27   The writer refers to visitors to New York to illustrate the point that
A   exploration is an intrinsic element of being human.
B   most people are enthusiastic about exploring.
C   exploration can lead to surprising results.
D   most people find exploration daunting.

28   According to the second paragraph, what is the writer’s view of explorers?
A   Their discoveries have brought both benefits and disadvantages.
B   Their main value is in teaching others.
C   They act on an urge that is common to everyone.
D   They tend to be more attracted to certain professions than to others.

29   The writer refers to a description of Egdon Heath to suggest that
A   Hardy was writing about his own experience of exploration.
B   Hardy was mistaken about the nature of exploration.
C   Hardy’s aim was to investigate people’s emotional states.
D   Hardy’s aim was to show the attraction of isolation.

30   In the fourth paragraph, the writer refers to ‘a golden age’ to suggest that
A   the amount of useful information produced by exploration has decreased.
B   fewer people are interested in exploring than in the 19th century.
C   recent developments have made exploration less exciting.
D   we are wrong to think that exploration is no longer necessary.

31   In the sixth paragraph, when discussing the definition of exploration, the writer argues that
A   people tend to relate exploration to their own professional interests.
B   certain people are likely to misunderstand the nature of exploration.
C   the generally accepted definition has changed over time.
D   historians and scientists have more valid definitions than the general public.

32   In the last paragraph, the writer explains that he is interested in
A   how someone’s personality is reflected in their choice of places to visit.
B   the human ability to cast new light on places that may be familiar.
C   how travel writing has evolved to meet changing demands.
D   the feelings that writers develop about the places that they explore.

Questions 33-37
Look at the following statements (Questions 33-37) and the list of explorers below.
Match each statement with the correct explorer, A-E.
Write the correct letter, A-E, in boxes 33-37 on your answer sheet.
NB  You may use any letter more than once.

33   He referred to the relevance of the form of transport used.
34   He described feelings on coming back home after a long journey.
35   He worked for the benefit of specific groups of people.
36   He did not consider learning about oneself an essential part of exploration.
37   He defined exploration as being both unique and of value to others.

List of Explorers
A     Peter Fleming
B     Ran Fiennes
C     Chris Bonington
D     Robin Hanbury-Tenison
E     Wilfred Thesiger

Questions 38-40
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.

The writer’s own bias
The writer has experience of a large number of 38………………., and was the first stranger that certain previously 39………………… people had encountered. He believes there is no need for further exploration of Earth’s 40…………………., except to answer specific questions such as how buffalo eat.`

const READING_FULL_TEST_PART3_ANSWER_KEY = `READING PASSAGE 1: Nutmeg – a valuable spice
Question 1: the leaves of the tree are 1……………………. in shape

Correct Answer: oval
Exact Portion: "The tree is thickly branched with dense foliage of tough, dark green oval leaves"
Short Thai Explanation: โจทย์ถามรูปร่างของใบไม้ และบทความใช้คำว่า oval leaves ตรงตัว จึงตอบว่า oval.
Paraphrased Vocabulary: are [oval] in shape = oval leaves

Question 2: the 2……………………. surrounds the fruit and breaks open when the fruit is ripe

Correct Answer: husk
Exact Portion: "The fruit is encased in a flesh husk. When the fruit is ripe, this husk splits into two halves"
Short Thai Explanation: สิ่งที่ห่อหุ้มผลไม้และแตกออกเมื่อผลสุกคือ husk ตามบทความระบุชัดเจน.
Paraphrased Vocabulary: surrounds = encased in; breaks open = splits

Question 3: the 3……………………. is used to produce the spice nutmeg

Correct Answer: seed
Exact Portion: "the former being produced from the dried seed"
Short Thai Explanation: ในสองเครื่องเทศที่ได้จากผลนัทเมก ตัวแรกคือ nutmeg และบทความบอกว่ามาจาก dried seed.
Paraphrased Vocabulary: is used to produce = being produced from

Question 4: the covering known as the aril is used to produce 4……………………..

Correct Answer: mace
Exact Portion: "the latter from the aril"
Short Thai Explanation: ส่วนหุ้มที่เรียกว่า aril ใช้ผลิตเครื่องเทศตัวที่สองคือ mace.
Paraphrased Vocabulary: covering known as the aril = aril; is used to produce = from

Question 5: In the Middle Ages, most Europeans knew where nutmeg was grown.

Correct Answer: FALSE
Exact Portion: "they never revealed the exact location of the source"
Short Thai Explanation: ชาวอาหรับไม่เคยเปิดเผยแหล่งปลูกที่แท้จริงให้ยุโรปรู้ ดังนั้นข้อความในโจทย์จึงขัดกับบทความ.
Paraphrased Vocabulary: knew where ... was grown ≠ never revealed the exact location

Question 6: The VOC was the world’s first major trading company.

Correct Answer: NOT GIVEN
Exact Portion: "By 1617, the VOC was the richest commercial operation in the world."
Short Thai Explanation: บทความบอกเพียงว่า VOC ร่ำรวยที่สุดในโลก แต่ไม่ได้บอกว่าเป็นบริษัทการค้าใหญ่แห่งแรกของโลก.
Paraphrased Vocabulary: world’s first = not stated

Question 7: Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.

Correct Answer: TRUE
Exact Portion: "Intent on securing their hold over every nutmeg-producing island" / "The Dutch now had a monopoly over the nutmeg trade"
Short Thai Explanation: หลังอังกฤษยอมยกเกาะ Run ให้ ดัตช์ก็ครอบครองทุกเกาะที่ผลิตนัทเมกและผูกขาดการค้าได้สำเร็จ.
Paraphrased Vocabulary: control of all the islands = securing their hold over every nutmeg-producing island

Question 8: Nutmeg was brought to Europe by the 8……………

Correct Answer: Arabs
Exact Portion: "the Arabs were the exclusive importers of the spice to Europe"
Short Thai Explanation: ผู้นำนัทเมกเข้าสู่ยุโรปในยุคกลางคือ the Arabs ตามที่บทความบอกตรงตัว.
Paraphrased Vocabulary: brought to Europe = importers to Europe

Question 9: Demand for nutmeg grew, as it was believed to be effective against the disease known as the 9……………

Correct Answer: plague
Exact Portion: "people across Europe were dying of the plague" / "they decided nutmeg held the cure"
Short Thai Explanation: ความต้องการนัทเมกเพิ่มขึ้นเพราะคนเชื่อว่ามันช่วยรักษา plague ได้.
Paraphrased Vocabulary: effective against = held the cure

Question 10: put 10…………… on nutmeg to avoid it being cultivated outside the islands

Correct Answer: lime
Exact Portion: "all exported nutmeg was covered with lime"
Short Thai Explanation: ดัตช์เคลือบนัทเมกด้วย lime เพื่อไม่ให้เมล็ดนำไปปลูกต่อที่อื่นได้.
Paraphrased Vocabulary: put ... on = covered with

Question 11: finally obtained the island of 11…………… from the British

Correct Answer: Run
Exact Portion: "if the British would give them the island of Run"
Short Thai Explanation: เกาะที่ดัตช์ได้มาจากอังกฤษในข้อตกลงนั้นคือ Run.
Paraphrased Vocabulary: obtained ... from = give them

Question 12: 1770 – nutmeg plants were secretly taken to 12……………

Correct Answer: Mauritius
Exact Portion: "successfully smuggled nutmeg plants to safety in Mauritius"
Short Thai Explanation: ปี 1770 มีการลักลอบนำต้นนัทเมกไปที่ Mauritius.
Paraphrased Vocabulary: secretly taken to = smuggled ... to

Question 13: 1778 – half the Banda Islands’ nutmeg plantations were destroyed by a 13……………

Correct Answer: tsunami
Exact Portion: "a tsunami that wiped out half the nutmeg groves"
Short Thai Explanation: สิ่งที่ทำลายสวนนัทเมกไปครึ่งหนึ่งคือ tsunami ซึ่งเกิดตามหลังภูเขาไฟระเบิด.
Paraphrased Vocabulary: destroyed by = wiped out by

READING PASSAGE 2: Driverless cars
Question 14: reference to the amount of time when a car is not in use

Correct Answer: C
Exact Portion: "the average car spends more than 90 percent of its life parked"
Short Thai Explanation: ย่อหน้า C ระบุเวลาที่รถไม่ได้ใช้งานโดยตรง คือจอดอยู่มากกว่า 90% ของอายุการใช้งาน.
Paraphrased Vocabulary: not in use = parked

Question 15: mention of several advantages of driverless vehicles for individual road-users

Correct Answer: B
Exact Portion: "be productive, to socialise or simply to relax" / "older or disabled travellers ... may be able to enjoy significantly greater travel autonomy"
Short Thai Explanation: ย่อหน้า B รวมข้อดีหลายอย่างสำหรับผู้ใช้รถแต่ละคน เช่น มีเวลาไปทำอย่างอื่น และช่วยให้ผู้สูงอายุหรือผู้พิการเดินทางได้อิสระขึ้น.
Paraphrased Vocabulary: advantages for individual road-users = direct personal benefits

Question 16: reference to the opportunity of choosing the most appropriate vehicle for each trip

Correct Answer: E
Exact Portion: "select one that best suits their needs for a particular journey"
Short Thai Explanation: ย่อหน้า E บอกชัดว่าผู้ใช้จะมีอิสระเลือกคันที่เหมาะกับการเดินทางแต่ละแบบมากที่สุด.
Paraphrased Vocabulary: most appropriate vehicle for each trip = one that best suits their needs for a particular journey

Question 17: an estimate of how long it will take to overcome a number of problems

Correct Answer: G
Exact Portion: "these can most probably be conquered within the next 10 years"
Short Thai Explanation: ย่อหน้า G ให้กรอบเวลาชัดเจนว่าอุปสรรคต่าง ๆ น่าจะเอาชนะได้ภายใน 10 ปี.
Paraphrased Vocabulary: overcome problems = conquered; estimate of how long = within the next 10 years

Question 18: a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured

Correct Answer: D
Exact Portion: "vehicle production will not necessarily decrease"
Short Thai Explanation: แม้คนจะมีรถน้อยลง แต่รถแต่ละคันอาจถูกใช้หนักและเปลี่ยนใหม่เร็วขึ้น จึงอาจไม่ทำให้ยอดผลิตรถลดลง.
Paraphrased Vocabulary: may have no effect on the number manufactured = will not necessarily decrease

Question 19: most motor accidents are partly due to 19…………………….

Correct Answer: human error
Exact Portion: "more than 90 percent of road collisions involve human error as a contributory factor"
Short Thai Explanation: สถิติระบุว่าปัจจัยร่วมสำคัญของอุบัติเหตุส่วนใหญ่คือ human error.
Paraphrased Vocabulary: partly due to = contributory factor

Question 20: schemes for 20………………………. will be more workable

Correct Answer: car-sharing
Exact Portion: "initiatives for car-sharing become much more viable"
Short Thai Explanation: ระบบอัตโนมัติจะทำให้โครงการ car-sharing มีความเป็นไปได้มากขึ้น โดยเฉพาะในเขตเมือง.
Paraphrased Vocabulary: schemes = initiatives; more workable = more viable

Question 21: there could be a 43 percent drop in 21…………………….. of cars

Correct Answer: vehicle ownership
Exact Portion: "automated vehicles might reduce vehicle ownership by 43 percent"
Short Thai Explanation: สิ่งที่อาจลดลง 43% คือ vehicle ownership หรือการเป็นเจ้าของรถยนต์.
Paraphrased Vocabulary: drop in = reduce

Question 22: the yearly 22…………………….. of each car would, on average, be twice as high

Correct Answer: mileage
Exact Portion: "vehicles’ average annual mileage double as a result"
Short Thai Explanation: ค่าที่จะเพิ่มขึ้นสองเท่าคือ annual mileage ของรถแต่ละคัน.
Paraphrased Vocabulary: yearly = annual; twice as high = double

Question 23: Which TWO benefits of automated vehicles does the writer mention?

Correct Answer: C
Accepted Answers: C | D
Answer Group: driverless-benefits
Exact Portion: "it may be possible to be productive, to socialise or simply to relax"
Short Thai Explanation: หนึ่งในคำตอบคู่ของข้อ 23-24 คือ C เพราะผู้โดยสารสามารถใช้เวลาเดินทางไปทำอย่างอื่นแทนการขับรถ.
Paraphrased Vocabulary: spend journeys doing something other than driving = be productive, socialise or relax

Question 24: Which TWO benefits of automated vehicles does the writer mention?

Correct Answer: D
Accepted Answers: C | D
Answer Group: driverless-benefits
Exact Portion: "older or disabled travellers – may be able to enjoy significantly greater travel autonomy"
Short Thai Explanation: อีกคำตอบของคู่ข้อ 23-24 คือ D เพราะคนที่ขับรถลำบากจะมีอิสระในการเดินทางมากขึ้น.
Paraphrased Vocabulary: travel independently = greater travel autonomy

Question 25: Which TWO challenges to automated vehicle development does the writer mention?

Correct Answer: A
Accepted Answers: A | E
Answer Group: driverless-challenges
Exact Portion: "communities to trust and accept automated vehicles"
Short Thai Explanation: หนึ่งในคำตอบคู่ของข้อ 25-26 คือ A เพราะบทความพูดถึงความท้าทายในการทำให้สังคมเชื่อมั่นและยอมรับรถอัตโนมัติ.
Paraphrased Vocabulary: general public has confidence = communities trust and accept

Question 26: Which TWO challenges to automated vehicle development does the writer mention?

Correct Answer: E
Accepted Answers: A | E
Answer Group: driverless-challenges
Exact Portion: "works reliably in the infinite range of traffic, weather and road situations"
Short Thai Explanation: อีกคำตอบของคู่ข้อ 25-26 คือ E เพราะรถต้องปรับตัวให้ทำงานได้ในสภาพการขับขี่ที่หลากหลายมาก.
Paraphrased Vocabulary: various different driving conditions = traffic, weather and road situations

READING PASSAGE 3: What is exploration?
Question 27: The writer refers to visitors to New York to illustrate the point that

Correct Answer: A
Exact Portion: "Our desire to discover ... is part of what makes us human" / "helps ... a visitor negotiate the subways of New York"
Short Thai Explanation: ผู้เขียนยกตัวอย่างคนที่พยายามหาทางในรถไฟใต้ดินนิวยอร์กเพื่อชี้ว่าความอยากสำรวจเป็นส่วนหนึ่งของความเป็นมนุษย์.
Paraphrased Vocabulary: intrinsic element of being human = part of what makes us human

Question 28: According to the second paragraph, what is the writer’s view of explorers?

Correct Answer: C
Exact Portion: "we all have this enquiring instinct"
Short Thai Explanation: ผู้เขียนมองว่านักสำรวจเพียงแค่ทำตามสัญชาตญาณอยากรู้อยากเห็นที่ทุกคนมีเหมือนกัน.
Paraphrased Vocabulary: urge that is common to everyone = enquiring instinct we all have

Question 29: The writer refers to a description of Egdon Heath to suggest that

Correct Answer: C
Exact Portion: "used the landscape to suggest the desires and fears of his characters"
Short Thai Explanation: ตัวอย่างนี้ใช้เพื่อแสดงว่าการสำรวจอาจหมายถึงการเจาะลึกสภาวะอารมณ์และความกลัวของมนุษย์ได้ด้วย.
Paraphrased Vocabulary: investigate people’s emotional states = desires and fears of his characters

Question 30: In the fourth paragraph, the writer refers to ‘a golden age’ to suggest that

Correct Answer: D
Exact Portion: "as if the process of discovery is now on the decline, though the truth is that ..."
Short Thai Explanation: ผู้เขียนกำลังโต้แย้งความคิดที่ว่าการสำรวจหมดความจำเป็นแล้ว โดยบอกว่ายังมีสิ่งอีกมากที่เราไม่รู้.
Paraphrased Vocabulary: wrong to think exploration is no longer necessary = the truth is that much remains unknown

Question 31: In the sixth paragraph, when discussing the definition of exploration, the writer argues that

Correct Answer: A
Exact Portion: "Each definition is slightly different – and tends to reflect the field of endeavour of each pioneer."
Short Thai Explanation: คำนิยามของแต่ละคนต่างกันไปเพราะมักสะท้อนสาขาอาชีพหรือความสนใจของคนนั้นเอง.
Paraphrased Vocabulary: professional interests = field of endeavour

Question 32: In the last paragraph, the writer explains that he is interested in

Correct Answer: B
Exact Portion: "how a fresh interpretation, even of a well-travelled route, can give its readers new insights"
Short Thai Explanation: ผู้เขียนสนใจความสามารถของมนุษย์ในการให้มุมมองใหม่กับสถานที่ที่คนคุ้นเคยอยู่แล้ว.
Paraphrased Vocabulary: cast new light on familiar places = fresh interpretation ... gives new insights

Question 33: He referred to the relevance of the form of transport used.

Correct Answer: E
Exact Portion: "If I’d gone across by camel when I could have gone by car, it would have been a stunt."
Short Thai Explanation: คนที่พูดถึงความสำคัญของวิธีเดินทางคือ Wilfred Thesiger เพราะเขาเปรียบเทียบ camel กับ car โดยตรง.
Paraphrased Vocabulary: form of transport = camel / car

Question 34: He described feelings on coming back home after a long journey.

Correct Answer: A
Exact Portion: "the moment when the explorer returns to the existence he has left behind with his loved ones"
Short Thai Explanation: Peter Fleming เป็นคนที่กล่าวถึงความรู้สึกเมื่อเดินทางกลับสู่ชีวิตเดิมและคนที่รัก.
Paraphrased Vocabulary: coming back home = returns to the existence he has left behind

Question 35: He worked for the benefit of specific groups of people.

Correct Answer: D
Exact Portion: "a campaigner on behalf of remote so-called ‘tribal’ peoples"
Short Thai Explanation: Robin Hanbury-Tenison ทำงานเพื่อประโยชน์ของกลุ่มชนเผ่าห่างไกลโดยตรง.
Paraphrased Vocabulary: specific groups of people = tribal peoples

Question 36: He did not consider learning about oneself an essential part of exploration.

Correct Answer: E
Exact Portion: "regardless of any great self-discovery"
Short Thai Explanation: Wilfred Thesiger ไม่ถือว่าการค้นพบตัวเองเป็นแก่นสำคัญของการสำรวจ.
Paraphrased Vocabulary: did not consider self-learning essential = regardless of any great self-discovery

Question 37: He defined exploration as being both unique and of value to others.

Correct Answer: B
Exact Portion: "done something that no human has done before – and also done something scientifically useful"
Short Thai Explanation: Ran Fiennes ให้นิยามว่าต้องไม่เคยมีใครทำมาก่อนและต้องมีประโยชน์ด้วย.
Paraphrased Vocabulary: unique = no human has done before; of value to others = scientifically useful

Question 38: The writer has experience of a large number of 38……………….

Correct Answer: expeditions
Exact Portion: "I’ve done a great many expeditions"
Short Thai Explanation: ผู้เขียนบอกตรงตัวว่าเขาทำ expeditions มาแล้วเป็นจำนวนมาก.
Paraphrased Vocabulary: a large number of = a great many

Question 39: was the first stranger that certain previously 39………………… people had encountered

Correct Answer: uncontacted
Exact Portion: "even two ‘uncontacted tribes’"
Short Thai Explanation: คำตอบคือ uncontacted เพราะผู้เขียนบอกว่าเคยอยู่กับชนเผ่าที่ไม่เคยติดต่อโลกภายนอกมาก่อน.
Paraphrased Vocabulary: previously uncontacted people = uncontacted tribes

Question 40: He believes there is no need for further exploration of Earth’s 40…………………

Correct Answer: land surface
Exact Portion: "We know how the land surface of our planet lies; exploration of it is now down to the details"
Short Thai Explanation: ผู้เขียนมองว่าเราไม่จำเป็นต้องสำรวจภาพใหญ่ของพื้นผิวโลกอีกแล้ว เหลือเพียงการเจาะรายละเอียดเฉพาะเรื่อง.
Paraphrased Vocabulary: no need for further exploration = we know how it lies; except for details = down to the details`

const READING_PDOY_HUARANGO_PASSAGE_TEXT = `READING PASSAGE 1
The return of the huarango
The arid valleys of southern Peru are welcoming the return of a native plant

The south coast of Peru is a narrow, 2,000-kilometre-long strip of desert squeezed between the Andes and the Pacific Ocean. It is also one of the most fragile ecosystems on Earth. It hardly ever rains there, and the only year-round source of water is located tens of metres below the surface. This is why the huarango tree is so suited to life there: it has the longest roots of any tree in the world. They stretch down 50-80 metres and, as well as sucking up water for the tree, they bring it into the higher subsoil, creating a water source for other plant life.

Dr David Beresford-Jones, archaeobotanist at Cambridge University, has been studying the role of the huarango tree in landscape change in the Lower Ica Valley in southern Peru. He believes the huarango was key to the ancient people’s diet and, because it could reach deep water sources, it allowed local people to withstand years of drought when their other crops failed. But over the centuries huarango trees were gradually replaced with crops. Cutting down native woodland leads to erosion, as there is nothing to keep the soil in place. So when the huarangos go, the land turns into a desert. Nothing grows at all in the Lower Ica Valley now.

For centuries the huarango tree was vital to the people of the neighbouring Middle Ica Valley too. They grew vegetables under it and ate products made from its seed pods. Its leaves and bark were used for herbal remedies, while its branches were used for charcoal for cooking and heating, and its trunk was used to build houses. But now it is disappearing rapidly. The majority of the huarango forests in the valley have already been cleared for fuel and agriculture – initially, these were smallholdings, but now they’re huge farms producing crops for the international market.

‘Of the forests that were here 1,000 years ago, 99 per cent have already gone,’ says botanist Oliver Whaley from Kew Gardens in London, who, together with ethnobotanist Dr William Milliken, is running a pioneering project to protect and restore the rapidly disappearing habitat. In order to succeed, Whaley needs to get the local people on board, and that has meant overcoming local prejudices. ‘Increasingly aspirational communities think that if you plant food trees in your home or street, it shows you are poor, and still need to grow your own food,’ he says. In order to stop the Middle Ica Valley going the same way as the Lower Ica Valley, Whaley is encouraging locals to love the huarangos again. ‘It’s a process of cultural resuscitation,’ he says. He has already set up a huarango festival to reinstate a sense of pride in their eco-heritage, and has helped local schoolchildren plant thousands of trees.

‘In order to get people interested in habitat restoration, you need to plant a tree that is useful to them,’ says Whaley. So, he has been working with local families to attempt to create a sustainable income from the huarangos by turning their products into foodstuffs. ‘Boil up the beans and you get this thick brown syrup like molasses. You can also use it in drinks, soups or stews.’ The pods can be ground into flour to make cakes, and the seeds roasted into a sweet, chocolatey ‘coffee’. ‘It’s packed full of vitamins and minerals,’ Whaley says.

And some farmers are already planting huarangos. Alberto Benevides, owner of Ica Valley’s only certified organic farm, which Whaley helped set up, has been planting the tree for 13 years. He produces syrup and flour, and sells these products at an organic farmers’ market in Lima. His farm is relatively small and doesn’t yet provide him with enough to live on, but he hopes this will change. ‘The organic market is growing rapidly in Peru,’ Benevides says. ‘I am investing in the future.’

But even if Whaley can convince the local people to fall in love with the huarango again, there is still the threat of the larger farms. Some of these cut across the forests and break up the corridors that allow the essential movement of mammals, birds and pollen up and down the narrow forest strip. In the hope of counteracting this, he’s persuading farmers to let him plant forest corridors on their land. He believes the extra woodland will also benefit the farms by reducing their water usage through a lowering of evaporation and providing a refuge for bio-control insects.

‘If we can record biodiversity and see how it all works, then we’re in a good position to move on from there. Desert habitats can reduce down to very little,’ Whaley explains. ‘It’s not like a rainforest that needs to have this huge expanse. Life has always been confined to corridors and islands here. If you just have a few trees left, the population can grow up quickly because it’s used to exploiting water when it arrives.’ He sees his project as a model that has the potential to be rolled out across other arid areas around the world. ‘If we can do it here, in the most fragile system on Earth, then that’s a real message of hope for lots of places, including Africa, where there is drought and they just can’t afford to wait for rain.’

Questions 1-5
Complete the notes below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answer in boxes 1-5 on your answer sheet.

The importance of the huarango tree
–   its roots can extend as far as 80 metres into the soil

–   can access 1………………… deep below the surface

–   was a crucial part of local inhabitants’ 2………………… a long time ago

–   helped people to survive periods of 3…………………..

–   prevents 4………………… of the soil

–   prevents land from becoming a 5…………………

Questions 6-8
Complete the table below.

Choose NO MORE THAN TWO WORDS from the passage for each answer.

Write your answers in boxes 6-8 on your answer sheet.

Traditional uses of the huarango tree
Part of tree

Traditional use

6………………..

Fuel

7………………. and ……………….

Medicine

8………………

construction

Questions 9-13
Do the following statements agree with the information given in Reading Passage 1?

In boxes 9-13 on your answer sheet, write

TRUE               if the statement agrees with the information

FALSE              if the statement contradicts the information

NOT GIVEN    if there is no information on this

9   Local families have told Whaley about some traditional uses of huarango products.

10   Farmer Alberto Benevides is now making a good profit from growing huarangos.

11   Whaley needs the co-operation of farmers to help preserve the area’s wildlife.

12   For Whaley’s project to succeed, it needs to be extended over a very large area.

13   Whaley has plans to go to Africa to set up a similar project.`

const READING_PDOY_HUARANGO_ANSWER_KEY = `READING PASSAGE 1: The return of the huarango
Question 1: can access 1………………… deep below the surface

Correct Answer: water
Exact Portion: "the only year-round source of water is located tens of metres below the surface"
Short Thai Explanation: รากของต้น huarango เข้าถึง water ที่อยู่ลึกลงไปใต้ผิวดินได้ จึงอยู่รอดในพื้นที่แห้งแล้งนี้ได้.
Paraphrased Vocabulary: deep below the surface = อยู่ลึกลงไปใต้ผิวดิน

Question 2: was a crucial part of local inhabitants’ 2………………… a long time ago

Correct Answer: diet
Exact Portion: "He believes the huarango was key to the ancient people’s diet"
Short Thai Explanation: คำว่า crucial part ตรงกับ key และสิ่งที่ต้นไม้ชนิดนี้สำคัญต่อคนโบราณคือ diet หรืออาหารการกิน.
Paraphrased Vocabulary: crucial part = key; local inhabitants = ancient people; diet = อาหารการกิน

Question 3: helped people to survive periods of 3…………………..

Correct Answer: drought
Exact Portion: "it allowed local people to withstand years of drought"
Short Thai Explanation: survive periods of ... ตรงกับ withstand years of drought ดังนั้นคำตอบคือ drought.
Paraphrased Vocabulary: survive periods of = withstand years of; drought = ภัยแล้ง

Question 4: prevents 4………………… of the soil

Correct Answer: erosion
Exact Portion: "Cutting down native woodland leads to erosion, as there is nothing to keep the soil in place."
Short Thai Explanation: ต้น huarango ช่วยยึดดินไว้ พอถูกตัดออกไปก็เกิด erosion หรือการพังทลายของดิน.
Paraphrased Vocabulary: prevents ... of the soil = keep the soil in place; erosion = การชะล้างพังทลาย

Question 5: prevents land from becoming a 5…………………

Correct Answer: desert
Exact Portion: "when the huarangos go, the land turns into a desert"
Short Thai Explanation: ถ้าไม่มีต้น huarango พื้นที่นั้นจะกลายเป็น desert ดังนั้นต้นไม้ชนิดนี้ช่วยป้องกันไม่ให้พื้นที่กลายเป็นทะเลทราย.
Paraphrased Vocabulary: becoming a = turns into a; desert = ทะเลทราย

Question 6: Traditional uses of the huarango tree - Fuel

Correct Answer: branches
Exact Portion: "its branches were used for charcoal for cooking and heating"
Short Thai Explanation: ส่วนของต้นไม้ที่ใช้เป็นเชื้อเพลิงคือ branches เพราะนำไปทำถ่านสำหรับ cooking and heating.
Paraphrased Vocabulary: fuel = charcoal for cooking and heating; branches = กิ่งไม้

Question 7: Traditional uses of the huarango tree - Medicine

Correct Answer: leaves and bark
Exact Portion: "Its leaves and bark were used for herbal remedies"
Short Thai Explanation: ส่วนที่ใช้เป็นยาในข้อนี้คือ leaves and bark เพราะทั้งสองอย่างถูกใช้ทำ herbal remedies.
Paraphrased Vocabulary: medicine = herbal remedies; leaves and bark = ใบและเปลือก

Question 8: Traditional uses of the huarango tree - construction

Correct Answer: trunk
Exact Portion: "its trunk was used to build houses"
Short Thai Explanation: ส่วนที่ใช้ด้าน construction คือ trunk เพราะบทความบอกตรง ๆ ว่าใช้สร้างบ้าน.
Paraphrased Vocabulary: construction = build houses; trunk = ลำต้น

Question 9: Local families have told Whaley about some traditional uses of huarango products.

Correct Answer: NOT GIVEN
Exact Portion: "he has been working with local families to attempt to create a sustainable income from the huarangos"
Short Thai Explanation: บทความบอกแค่ว่า Whaley ทำงานร่วมกับครอบครัวท้องถิ่นเพื่อพัฒนาสินค้า แต่ไม่ได้บอกว่าครอบครัวเหล่านั้นเป็นคนเล่าเรื่องการใช้แบบดั้งเดิมให้เขาฟัง.
Paraphrased Vocabulary: told Whaley about = เป็นคนให้ข้อมูลกับ Whaley โดยตรง

Question 10: Farmer Alberto Benevides is now making a good profit from growing huarangos.

Correct Answer: FALSE
Exact Portion: "His farm is relatively small and doesn’t yet provide him with enough to live on"
Short Thai Explanation: ประโยคในโจทย์บอกว่าเขาได้กำไรดีแล้ว แต่บทความบอกตรงข้ามว่า farm ของเขายังทำเงินไม่พอเลี้ยงชีพ จึงเป็น FALSE.
Paraphrased Vocabulary: making a good profit = ทำกำไรดี; doesn’t yet provide enough to live on = ยังไม่พอเลี้ยงชีพ

Question 11: Whaley needs the co-operation of farmers to help preserve the area’s wildlife.

Correct Answer: TRUE
Exact Portion: "he’s persuading farmers to let him plant forest corridors on their land" / "allow the essential movement of mammals, birds and pollen"
Short Thai Explanation: Whaley ต้องการความร่วมมือจาก farmers จริง เพราะต้องให้เขาปลูก forest corridors บนที่ดินของพวกเขา เพื่อช่วยให้สัตว์และเกสรเคลื่อนที่ได้.
Paraphrased Vocabulary: co-operation of farmers = persuading farmers to let him; preserve wildlife = allow movement of mammals, birds and pollen

Question 12: For Whaley’s project to succeed, it needs to be extended over a very large area.

Correct Answer: FALSE
Exact Portion: "Desert habitats can reduce down to very little" / "It’s not like a rainforest that needs to have this huge expanse."
Short Thai Explanation: โจทย์บอกว่าต้องใช้พื้นที่ใหญ่มาก แต่ Whaley อธิบายตรงกันข้ามว่า desert habitats อยู่ได้แม้เหลือพื้นที่ไม่มาก จึงเป็น FALSE.
Paraphrased Vocabulary: a very large area = huge expanse; does not need = can reduce down to very little

Question 13: Whaley has plans to go to Africa to set up a similar project.

Correct Answer: NOT GIVEN
Exact Portion: "a model that has the potential to be rolled out across other arid areas around the world, including Africa"
Short Thai Explanation: บทความบอกเพียงว่าโมเดลนี้อาจนำไปใช้ใน Africa ได้ แต่ไม่ได้บอกว่า Whaley มีแผนจะเดินทางไปตั้งโครงการเอง จึงเป็น NOT GIVEN.
Paraphrased Vocabulary: has plans to go = มีแผนจะเดินทางไปเอง; rolled out across = นำไปประยุกต์ใช้ในหลายพื้นที่`

const READING_PDOY_SILBO_PASSAGE_TEXT = `READING PASSAGE 2
Silbo Gomero – the whistle ‘language’ of the Canary Islands
La Gomera is one of the Canary Islands situated in the Atlantic Ocean off the northwest coast of Africa. This small volcanic island is mountainous, with steep rocky slopes and deep, wooded ravines, rising to 1,487 metres at its highest peak. It is also home to the best known of the world’s whistle ‘languages’, a means of transmitting information over long distances which is perfectly adapted to the extreme terrain of the island.

This ‘language’, known as ‘Silbo’ or ‘Silbo Gomero’ – from the Spanish word for ‘whistle’ – is now shedding light on the language-processing abilities of the human brain, according to scientists. Researchers say that Silbo activates parts of the brain normally associated with spoken language, suggesting that the brain is remarkably flexible in its ability to interpret sounds as language.

‘Science has developed the idea of brain areas that are dedicated to language, and we are starting to understand the scope of signals that can be recognised as language,’ says David Corina, co-author of a recent study and associate professor of psychology at the University of Washington in Seattle.

Silbo is a substitute for Spanish, with individual words recoded into whistles which have high- and low-frequency tones. A whistler – or silbador – puts a finger in his or her mouth to increase the whistle’s pitch, while the other hand can be cupped to adjust the direction of the sound. ‘There is much more ambiguity in the whistled signal than in the spoken signal,’ explains lead researcher Manuel Carreiras, psychology professor at the University of La Laguna on the Canary island of Tenerife. Because whistled ‘words’ can be hard to distinguish, silbadores rely on repetition, as well as awareness of context, to make themselves understood.

The silbadores of Gomera are traditionally shepherds and other isolated mountain folk, and their novel means of staying in touch allows them to communicate over distances of up to 10 kilometres. Carreiras explains that silbadores are able to pass a surprising amount of information via their whistles. ‘In daily life they use whistles to communicate short commands, but any Spanish sentence could be whistled.’ Silbo has proved particularly useful when fires have occurred on the island and rapid communication across large areas has been vital.

The study team used neuroimaging equipment to contrast the brain activity of silbadores while listening to whistled and spoken Spanish. Results showed the left temporal lobe of the brain, which is usually associated with spoken language, was engaged during the processing of Silbo. The researchers found that other key regions in the brain’s frontal lobe also responded to the whistles, including those activated in response to sign language among deaf people. When the experiments were repeated with non-whistlers, however, activation was observed in all areas of the brain.

‘Our results provide more evidence about the flexibility of human capacity for language in a variety of forms,’ Corina says. ‘These data suggest that left-hemisphere language regions are uniquely adapted for communicative purposes, independent of the modality of signal. The non-Silbo speakers were not recognising Silbo as a language. They had nothing to grab onto, so multiple areas of their brains were activated.’

Carreiras says the origins of Silbo Gomero remain obscure, but that indigenous Canary Islanders, who were of North African origin, already had a whistled language when Spain conquered the volcanic islands in the 15th century. Whistled languages survive today in Papua New Guinea, Mexico, Vietnam, Guyana, China, Nepal, Senegal, and a few mountainous pockets in southern Europe. There are thought to be as many as 70 whistled languages still in use, though only 12 have been described and studied scientifically. This form of communication is an adaptation found among cultures where people are often isolated from each other, according to Julien Meyer, a researcher at the Institute of Human Sciences in Lyon, France. ‘They are mostly used in mountains or dense forests,’ he says. ‘Whistled languages are quite clearly defined and represent an original adaptation of the spoken language for the needs of isolated human groups.’

But with modern communication technology now widely available, researchers say whistled languages like Silbo are threatened with extinction. With dwindling numbers of Gomera islanders still fluent in the language, Canaries’ authorities are taking steps to try to ensure its survival. Since 1999, Silbo Gomero has been taught in all of the island’s elementary schools. In addition, locals are seeking assistance from the United Nations Educational, Scientific and Cultural Organization (UNESCO). ‘The local authorities are trying to get an award from the organisation to declare [Silbo Gomero] as something that should be preserved for humanity,’ Carreiras adds.

Questions 14-19
Do the following statements agree with the information given in Reading Passage 2?

In boxes 14-19 on your answer sheet, write

TRUE               if the statement agrees with the information

FALSE              if the statement contradicts the information

NOT GIVEN    if there is no information on this

14   La Gomera is the most mountainous of all the Canary Islands.

15   Silbo is only appropriate for short and simple messages.

16   In the brain-activity study, silbadores and non-whistlers produced different results.

17   The Spanish introduced Silbo to the islands in the 15th century.

18   There is precise data available regarding all of the whistle languages in existence today.

19   The children of Gomera now learn Silbo.

Questions 20-26
Complete the notes below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 20-26 on your answer sheet.

Silbo Gomero
How Silbo is produced

●   high- and low-frequency tones represent different sounds in Spanish 20……………

●   pitch of whistle is controlled using silbador’s 21……………

●   22………….. is changed with a cupped hand

How Silbo is used

●   has long been used by shepherds and people living in secluded locations

●   in everyday use for the transmission of brief 23……………

●   can relay essential information quickly, e.g. to inform people about 24……………

The future of Silbo

●   future under threat because of new 25……………

●   Canaries’ authorities hoping to receive a UNESCO 26……………. to help preserve it`

const READING_PDOY_SILBO_ANSWER_KEY = `READING PASSAGE 2: Silbo Gomero – the whistle ‘language’ of the Canary Islands
Question 14: La Gomera is the most mountainous of all the Canary Islands.

Correct Answer: NOT GIVEN
Exact Portion: "This small volcanic island is mountainous, with steep rocky slopes and deep, wooded ravines"
Short Thai Explanation: บทความบอกแค่ว่า La Gomera เป็นเกาะที่ภูเขาเยอะ แต่ไม่ได้เปรียบเทียบว่าเป็นเกาะที่ภูเขามากที่สุดในบรรดา Canary Islands จึงเป็น NOT GIVEN.
Paraphrased Vocabulary: most mountainous = มีภูเขามากที่สุด; mountainous = เป็นเกาะภูเขา

Question 15: Silbo is only appropriate for short and simple messages.

Correct Answer: FALSE
Exact Portion: "In daily life they use whistles to communicate short commands, but any Spanish sentence could be whistled."
Short Thai Explanation: ข้อความในโจทย์บอกว่าใช้ได้แค่ข้อความสั้น ๆ แต่บทความบอกชัดว่าแม้จะใช้กับ short commands ในชีวิตประจำวัน ก็ยังสามารถผิวปากเป็นประโยคภาษาสเปนใด ๆ ก็ได้ จึงเป็น FALSE.
Paraphrased Vocabulary: only appropriate for short and simple messages = use only for short commands; any Spanish sentence could be whistled = ใช้ได้กว้างกว่านั้น

Question 16: In the brain-activity study, silbadores and non-whistlers produced different results.

Correct Answer: TRUE
Exact Portion: "Results showed the left temporal lobe ... was engaged during the processing of Silbo" / "When the experiments were repeated with non-whistlers, however, activation was observed in all areas of the brain."
Short Thai Explanation: กลุ่ม silbadores และ non-whistlers ให้ผลต่างกันจริง เพราะผู้ผิวปากใช้สมองบางส่วนที่เกี่ยวกับภาษาโดยเฉพาะ ส่วน non-whistlers มีการทำงานกระจายทั่วสมอง.
Paraphrased Vocabulary: produced different results = activation patterns were different

Question 17: The Spanish introduced Silbo to the islands in the 15th century.

Correct Answer: FALSE
Exact Portion: "indigenous Canary Islanders ... already had a whistled language when Spain conquered the volcanic islands in the 15th century"
Short Thai Explanation: Silbo มีอยู่ก่อนที่สเปนจะเข้ามาแล้ว ดังนั้นสเปนไม่ได้เป็นผู้นำภาษานี้เข้ามา จึงเป็น FALSE.
Paraphrased Vocabulary: introduced = นำเข้ามา; already had = มีอยู่ก่อนแล้ว

Question 18: There is precise data available regarding all of the whistle languages in existence today.

Correct Answer: FALSE
Exact Portion: "There are thought to be as many as 70 whistled languages still in use, though only 12 have been described and studied scientifically."
Short Thai Explanation: ข้อนี้เป็น FALSE เพราะยังไม่มีข้อมูลที่แม่นยำครบทั้งหมด ปัจจุบันมีเพียง 12 ภาษาเท่านั้นที่ได้รับการอธิบายและศึกษาทางวิทยาศาสตร์.
Paraphrased Vocabulary: precise data regarding all = described and studied scientifically for every language

Question 19: The children of Gomera now learn Silbo.

Correct Answer: TRUE
Exact Portion: "Since 1999, Silbo Gomero has been taught in all of the island’s elementary schools."
Short Thai Explanation: เด็ก ๆ บนเกาะ Gomera เรียน Silbo จริง เพราะบทความบอกว่ามีการสอนในโรงเรียนประถมทั้งหมดของเกาะตั้งแต่ปี 1999.
Paraphrased Vocabulary: children of Gomera = elementary school students on the island; now learn = has been taught

Question 20: high- and low-frequency tones represent different sounds in Spanish 20……………

Correct Answer: words
Exact Portion: "Silbo is a substitute for Spanish, with individual words recoded into whistles which have high- and low-frequency tones."
Short Thai Explanation: สิ่งที่ถูก recoded เป็นเสียงผิวปังคือ words จึงเติมคำว่า words.
Paraphrased Vocabulary: represent different sounds in Spanish = words recoded into whistles

Question 21: pitch of whistle is controlled using silbador’s 21……………

Correct Answer: finger
Exact Portion: "A whistler – or silbador – puts a finger in his or her mouth to increase the whistle’s pitch"
Short Thai Explanation: pitch ของเสียงผิวปังถูกควบคุมด้วย finger ตามที่บทความบอกตรง ๆ.
Paraphrased Vocabulary: pitch is controlled using = puts a finger ... to increase the whistle’s pitch

Question 22: 22………….. is changed with a cupped hand

Correct Answer: direction
Exact Portion: "the other hand can be cupped to adjust the direction of the sound"
Short Thai Explanation: มืออีกข้างที่ทำเป็นถ้วยใช้เพื่อปรับ direction ของเสียง ดังนั้นคำตอบคือ direction.
Paraphrased Vocabulary: is changed = adjusted; cupped hand = มือที่โค้งเป็นถ้วย

Question 23: in everyday use for the transmission of brief 23……………

Correct Answer: commands
Exact Portion: "In daily life they use whistles to communicate short commands"
Short Thai Explanation: สิ่งที่ส่งกันในชีวิตประจำวันคือ brief commands หรือคำสั่งสั้น ๆ.
Paraphrased Vocabulary: in everyday use = in daily life; brief = short

Question 24: can relay essential information quickly, e.g. to inform people about 24……………

Correct Answer: fires
Exact Portion: "Silbo has proved particularly useful when fires have occurred on the island"
Short Thai Explanation: ตัวอย่างของข้อมูลสำคัญที่ส่งอย่างรวดเร็วคือเรื่อง fires ที่เกิดขึ้นบนเกาะ.
Paraphrased Vocabulary: relay essential information quickly = proved particularly useful for rapid communication; inform people about = when fires have occurred

Question 25: future under threat because of new 25……………

Correct Answer: technology
Exact Portion: "But with modern communication technology now widely available, researchers say whistled languages like Silbo are threatened with extinction."
Short Thai Explanation: อนาคตของ Silbo ถูกคุกคามเพราะ modern communication technology แพร่หลายขึ้น.
Paraphrased Vocabulary: under threat = threatened with extinction; new = modern communication

Question 26: Canaries’ authorities hoping to receive a UNESCO 26……………. to help preserve it

Correct Answer: award
Exact Portion: "The local authorities are trying to get an award from the organisation"
Short Thai Explanation: คำตอบคือ award เพราะทางการท้องถิ่นกำลังพยายามขอรางวัลหรือการรับรองจาก UNESCO เพื่อช่วยอนุรักษ์ภาษา.
Paraphrased Vocabulary: hoping to receive = trying to get; help preserve = declare as something that should be preserved`

const READING_EXERCISE3_HENRY_MOORE_PASSAGE_TEXT = `READING PASSAGE 1
Henry Moore (1898-1986)
The British sculptor Henry Moore was a leading figure in the 20th-century art world

Henry Moore was born in Castleford, a small town near Leeds in the north of England. He was the seventh child of Raymond Moore and his wife Mary Baker. He studied at Castleford Grammar School from 1909 to 1915, where his early interest in art was encouraged by his teacher Alice Gostick. After leaving school, Moore hoped to become a sculptor, but instead he complied with his father’s wish that he train as a schoolteacher. He had to abandon his training in 1917 when he was sent to France to fight in the First World War.

After the war, Moore enrolled at the Leeds School of Art, where he studied for two years. In his first year, he spent most of his time drawing. Although he wanted to study sculpture, no teacher was appointed until his second year. At the end of that year, he passed the sculpture examination and was awarded a scholarship to the Royal College of Art in London. In September 1921, he moved to London and began three years of advanced study in sculpture.

Alongside the instruction he received at the Royal College, Moore visited many of the London museums, particularly the British Museum, which had a wide-ranging collection of ancient sculpture. During these visits, he discovered the power and beauty of ancient Egyptian and African sculpture. As he became increasingly interested in these ‘primitive’ forms of art, he turned away from European sculptural traditions.

After graduating, Moore spent the first six months of 1925 travelling in France. When he visited the Trocadero Museum in Paris, he was impressed by a cast of a Mayan sculpture of the rain spirit. It was a male reclining figure with its knees drawn up together, and its head at a right angle to its body. Moore became fascinated with this stone sculpture, which he thought had a power and originality that no other stone sculpture possessed. He himself started carving a variety of subjects in stone, including depiction of reclining women, mother-and-child groups, and masks.

Moore’s exceptional talent soon gained recognition, and in 1926 he started work as a sculpture instructor at the Royal College. In 1933, he became a member of a group of young artists called Unit One. The aim of the group was to convince the English public of the merits of the emerging international movement in modern art and architecture.

Around this time, Moore moved away from the human figure to experiment with abstract shapes. In 1931, he held an exhibition at the Leicester Galleries in London. His work was enthusiastically welcomed by fellow sculptors, but the reviews in the press were extremely negative and turned Moore into a notorious figure. There were calls for his resignation from the Royal College, and the following year, when his contract expired, he left to start a sculpture department at the Chelsea School of Art in London.

Throughout the 1930s, Moore did not show any inclination to please the British public. He became interested in the paintings of the Spanish artist Pablo Picasso, whose work inspired him to distort the human body in a radical way. At times, he seemed to abandon the human figure altogether. The pages of his sketchbooks from this period show his ideas for abstract sculptures that bore little resemblance to the human form.

In 1940, during the Second World War, Moore stopped teaching at the Chelsea School and moved to a farmhouse about 20 miles north of London. A shortage of materials forced him to focus on drawing. He did numerous small sketches of Londoners, later turning these ideas into large coloured drawings in his studio. In 1942, he returned to Castleford to make a series of sketches of the miners who worked there.

In 1944, Harlow, a town near London, offered Moore a commission for a sculpture depicting a family. The resulting work signifies a dramatic change in Moore’s style, away from the experimentation of the 1930s towards a more natural and humanistic subject matter. He did dozens of studies in clay for the sculpture, and these were cast in bronze and issued in editions of seven to nine copies each. In this way, Moore’s work became available to collectors all over the world. The boost to his income enabled him to take on ambitious projects and start working on the scale he felt his sculpture demanded.

Critics who had begun to think that Moore had become less revolutionary were proven wrong by the appearance, in 1950, of the first of Moore’s series of standing figures in bronze, with their harsh and angular pierced forms and distinct impression of menace. Moore also varied his subject matter in the 1950s with such works as Warrior with Shield and Falling Warrior. These were rare examples of Moore’s use of the male figure and owe something to his visit to Greece in 1951, when he had the opportunity to study ancient works of art.

In his final years, Moore created the Henry Moore Foundation to promote art appreciation and to display his work. Moore was the first modern English sculptor to achieve international critical acclaim and he is still regarded as one of the most important sculptors of the 20th century.

Questions 1-7
Do the following statements agree with the claims of the writer in Reading Passage 1?

In boxes 1-7 on your answer sheet, write

TRUE               if the statement agrees with the information

FALSE              if the statement contradicts the information

NOT GIVEN    if there is no information on this

1   On leaving school, Moore did what his father wanted him to do.

2   Moore began studying sculpture in his first term at the Leeds School of Art.

3   When Moore started at the Royal College of Art, its reputation for teaching sculpture was excellent.

4   Moore became aware of ancient sculpture as a result of visiting London Museums.

5   The Trocadero Museum’s Mayan sculpture attracted a lot of public interest.

6   Moore thought the Mayan sculpture was similar in certain respects to other stone sculptures.

7   The artists who belonged to Unit One wanted to make modern art and architecture more popular.

Questions 8-13
Complete the notes below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 8-13 on your answer sheet.

Moore’s career as an artist
1930s

●   Moore’s exhibition at the Leicester Galleries is criticised by the press

●   Moore is urged to offer his 8………………… and leave the Royal College.

1940s

●   Moore turns to drawing because 9…………………. for sculpting are not readily available

●   While visiting his hometown, Moore does some drawings of 10………………….

●   Moore is employed to produce a sculpture of a 11…………………

●   12………………. start to buy Moore’s work

●   Moore’s increased 13…………………. makes it possible for him to do more ambitious sculptures

1950s

●   Moore’s series of bronze figures marks a further change in his style`

const READING_EXERCISE3_HENRY_MOORE_ANSWER_KEY = `READING PASSAGE 1: Henry Moore (1898-1986)
Question 1: On leaving school, Moore did what his father wanted him to do.

Correct Answer: TRUE
Exact Portion: "he complied with his father’s wish that he train as a schoolteacher"
Short Thai Explanation: Moore ทำตามความต้องการของพ่อจริง เพราะหลังออกจากโรงเรียนเขายอมฝึกเป็นครูตามที่พ่ออยากให้ทำ.
Paraphrased Vocabulary: did what his father wanted = complied with his father’s wish

Question 2: Moore began studying sculpture in his first term at the Leeds School of Art.

Correct Answer: FALSE
Exact Portion: "In his first year, he spent most of his time drawing. Although he wanted to study sculpture, no teacher was appointed until his second year."
Short Thai Explanation: ข้อนี้เป็น FALSE เพราะปีแรกเขาไม่ได้เริ่มเรียน sculpture อย่างจริงจัง และยังไม่มีครูสอนจนกว่าจะถึงปีที่สอง.
Paraphrased Vocabulary: first term = first year; began studying sculpture = no teacher was appointed until his second year

Question 3: When Moore started at the Royal College of Art, its reputation for teaching sculpture was excellent.

Correct Answer: NOT GIVEN
Exact Portion: "he moved to London and began three years of advanced study in sculpture"
Short Thai Explanation: บทความบอกแค่ว่า Moore ไปเรียน sculpture ที่ Royal College of Art แต่ไม่ได้ให้ข้อมูลเรื่องชื่อเสียงของสถาบันว่าดีเยี่ยมหรือไม่ จึงเป็น NOT GIVEN.
Paraphrased Vocabulary: reputation was excellent = ชื่อเสียงด้านการสอนยอดเยี่ยม

Question 4: Moore became aware of ancient sculpture as a result of visiting London Museums.

Correct Answer: TRUE
Exact Portion: "Moore visited many of the London museums ... During these visits, he discovered the power and beauty of ancient Egyptian and African sculpture."
Short Thai Explanation: Moore รู้จักและซาบซึ้งงานประติมากรรมโบราณจากการไปเยี่ยมพิพิธภัณฑ์ในลอนดอนจริง.
Paraphrased Vocabulary: became aware of = discovered; as a result of visiting = during these visits

Question 5: The Trocadero Museum’s Mayan sculpture attracted a lot of public interest.

Correct Answer: NOT GIVEN
Exact Portion: "he was impressed by a cast of a Mayan sculpture of the rain spirit"
Short Thai Explanation: บทความบอกเพียงว่า Moore ประทับใจงานชิ้นนี้ แต่ไม่ได้บอกว่าคนทั่วไปสนใจมันมากแค่ไหน จึงเป็น NOT GIVEN.
Paraphrased Vocabulary: attracted a lot of public interest = ได้รับความสนใจจากสาธารณะมาก

Question 6: Moore thought the Mayan sculpture was similar in certain respects to other stone sculptures.

Correct Answer: FALSE
Exact Portion: "he thought had a power and originality that no other stone sculpture possessed"
Short Thai Explanation: Moore มองว่างานชิ้นนี้มีพลังและความแปลกใหม่ที่งานหินชิ้นอื่นไม่มี จึงไม่ได้คิดว่ามันคล้ายกับงานหินอื่น.
Paraphrased Vocabulary: similar in certain respects = คล้ายกันบางด้าน; no other stone sculpture possessed = ไม่มีงานหินอื่นเหมือน

Question 7: The artists who belonged to Unit One wanted to make modern art and architecture more popular.

Correct Answer: TRUE
Exact Portion: "The aim of the group was to convince the English public of the merits of the emerging international movement in modern art and architecture."
Short Thai Explanation: กลุ่ม Unit One ต้องการโน้มน้าวให้สาธารณชนเห็นคุณค่าของ modern art and architecture จึงตรงกับการทำให้เป็นที่ยอมรับมากขึ้น.
Paraphrased Vocabulary: more popular = convince the public of the merits

Question 8: Moore is urged to offer his 8………………… and leave the Royal College.

Correct Answer: resignation
Exact Portion: "There were calls for his resignation from the Royal College"
Short Thai Explanation: คำตอบคือ resignation เพราะมีเสียงเรียกร้องให้เขาลาออกจาก Royal College.
Paraphrased Vocabulary: offer his ... and leave = resignation

Question 9: Moore turns to drawing because 9…………………. for sculpting are not readily available

Correct Answer: materials
Exact Portion: "A shortage of materials forced him to focus on drawing."
Short Thai Explanation: เขาหันไปวาดรูปเพราะขาด materials สำหรับทำประติมากรรม.
Paraphrased Vocabulary: are not readily available = shortage of

Question 10: While visiting his hometown, Moore does some drawings of 10………………….

Correct Answer: miners
Exact Portion: "he returned to Castleford to make a series of sketches of the miners who worked there"
Short Thai Explanation: ตอนกลับบ้านเกิด Moore วาดภาพ miners หรือคนงานเหมือง.
Paraphrased Vocabulary: hometown = Castleford; drawings = sketches

Question 11: Moore is employed to produce a sculpture of a 11…………………

Correct Answer: family
Exact Portion: "offered Moore a commission for a sculpture depicting a family"
Short Thai Explanation: คำตอบคือ family เพราะเขาได้รับ commission ให้สร้างประติมากรรมที่แสดงครอบครัว.
Paraphrased Vocabulary: employed to produce = offered a commission for

Question 12: 12………………. start to buy Moore’s work

Correct Answer: collectors
Exact Portion: "Moore’s work became available to collectors all over the world"
Short Thai Explanation: คนที่เริ่มซื้อผลงานของ Moore คือ collectors.
Paraphrased Vocabulary: start to buy = became available to collectors

Question 13: Moore’s increased 13…………………. makes it possible for him to do more ambitious sculptures

Correct Answer: income
Exact Portion: "The boost to his income enabled him to take on ambitious projects"
Short Thai Explanation: รายได้ที่เพิ่มขึ้นทำให้เขาทำงานชิ้นใหญ่และทะเยอทะยานขึ้นได้ คำตอบคือ income.
Paraphrased Vocabulary: makes it possible = enabled him to; increased = boost to`

const READING_EXERCISE4_DESOLENATOR_PASSAGE_TEXT = `READING PASSAGE 2
The Desolenator: producing clean water
A

Travelling around Thailand in the 1990s, William Janssen was impressed with the basic rooftop solar heating systems that were on many homes, where energy from the sun was absorbed by a plate and then used to heat water for domestic use. Two decades later Janssen developed that basic idea he saw in Southeast Asia into a portable device that uses the power from the sun to purify water.

B

The Desolenator operates as a mobile desalination unit that can take water from different places, such as the sea, rivers, boreholes and rain, and purify it for human consumption. It is particularly valuable in regions where natural groundwater reserves have been polluted, or where seawater is the only water source available.

Janssen saw that there was a need for a sustainable way to clean water is both the developing and the developed countries when he moved to the United Arab Emirates and saw large-scale water processing. ‘I was confronted with the enormous carbon footprint that the Gulf nations have because of all of the desalination that they do,’ he says.

C

The Desolenator can produce 15 litres of drinking water per day, enough to sustain a family for cooking and drinking. Its main selling point is that unlike standard desalination techniques, it doesn’t require a generated power supply: just sunlight. It measures 120 cm by 90 cm, and it easy to transport, thanks to its two wheels. Water enters through a pipe, and flows as a thin film between a sheet of double glazing and the surface of a solar panel, where it is heated by the sun. the warm water flows into a small boiler (heated by a solar-powered battery) where it is converted to steam. When the steam cools, it becomes distilled water. The device has a very simple filter to trap particles, and this can easily be shaken to remove them. There are two tubes for liquid coming out: one for the waste – salt from seawater, fluoride, etc. – and another for the distilled water. The performance of the unit is shown on an LCD screen and transmitted to the company which provides servicing when necessary.

D

A recent analysis found that at least two-thirds of the world’s population lives with severe water scarcity for at least a month every year. Janssen says that be 2030 half of the world’s population will be living with water stress – where the demand exceeds the supply over a certain period of time. ‘It is really important that a sustainable solution is brought to the market that is able to help these people,’ he says. Many countries ‘don’t have the money for desalination plants, which are very expensive to build. They don’t have the money to operate them, they are very maintenance intensive, and they don’t have the money to buy the diesel to run the desalination plants, so it is a really bad situation.’

E

The device is aimed at a wide variety of users – from homeowners in the developing world who do not have a constant supply of water to people living off the grid in rural parts of the US. The first commercial versions of the Desolenator are expected to be in operation in India early next year, after field tests are carried out. The market for the self-sufficient devices in developing countries is twofold – those who cannot afford the money for the device outright and pay through microfinance, and middle-income homes that can lease their own equipment. ‘People in India don’t pay for a fridge outright; they pay for it over six months. They would put the Desolenator on their roof and hook it up to their municipal supply and they would get very reliable drinking water on a daily basis,’ Janssen says. In the developed world, it is aimed at niche markets where tap water is unavailable – for camping, on boats, or for the military, for instance.

F

Prices will vary according to where it is bought. In the developing world, the price will depend on what deal aid organisations can negotiate. In developed countries, it is likely to come in at $1,000 (£685) a unit, said Janssen. ‘We are a venture with a social mission. We are aware that the product we have envisioned is mainly finding application in the developing world and humanitarian sector and that this is the way we will proceed. We do realise, though, that to be a viable company there is a bottom line to keep in mind,’ he says.

G

The company itself is based at Imperial College London, although Janssen, its chief executive, still lives in the UAE. It has raised £340,000 in funding so far. Within two years, he says, the company aims to be selling 1,000 units a month, mainly in the humanitarian field. They are expected to be sold in areas such as Australia, northern Chile, Peru, Texas and California.

Questions 14-20
Reading Passage 2 has nine paragraphs, A-H

Choose the correct heading for each section from the list of headings below

Write the correct number, i-x, in boxes 14-20 on your answer sheet.

List of Headings

i           Getting the finance for production

ii          An unexpected benefit

iii         From initial inspiration to new product

iv         The range of potential customers for the device

v          What makes the device different from alternatives

vi         Cleaning water from a range of sources

vii        Overcoming production difficulties

viii       Profit not the primary goal

ix         A warm welcome for the device

x          The number of people affected by water shortages

14   Section A

15   Section B

16   Section C

17   Section D

18   Section E

19   Section F

20   Section G

Questions 21-26
Complete the summary below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 21-26 on your answer sheet.

How the Desolenator works
The energy required to operate the Desolenator comes from sunlight. The device can be used in different locations, as it has 21………………… . Water is fed into a pipe, and a 22………………….. of water flows over a solar panel. The water then enters a boiler, where it turns into steam. Any particles in the water are caught in a 23………………… . The purified water comes out through one tube, and all types of 24………………… come out through another. A screen displays the 25………………… of the device, and transmits the information to the company so that they know when the Desolenator requires 26…………………. .`

const READING_EXERCISE4_DESOLENATOR_ANSWER_KEY = `READING PASSAGE 2: The Desolenator: producing clean water
Question 14: Section A

Correct Answer: iii
Exact Portion: "Two decades later Janssen developed that basic idea he saw in Southeast Asia into a portable device"
Short Thai Explanation: ย่อหน้า A พูดถึงจุดเริ่มต้นของแรงบันดาลใจในไทย และการพัฒนา idea นั้นจนกลายเป็นผลิตภัณฑ์ใหม่ จึงตรงกับ heading iii.
Paraphrased Vocabulary: initial inspiration = basic idea he saw in Southeast Asia; new product = portable device

Question 15: Section B

Correct Answer: vi
Exact Portion: "can take water from different places, such as the sea, rivers, boreholes and rain"
Short Thai Explanation: ย่อหน้า B เน้นว่าระบบนี้ทำความสะอาดน้ำได้จากหลายแหล่ง จึงตรงกับ heading vi.
Paraphrased Vocabulary: a range of sources = different places such as sea, rivers, boreholes and rain

Question 16: Section C

Correct Answer: v
Exact Portion: "unlike standard desalination techniques, it doesn’t require a generated power supply: just sunlight"
Short Thai Explanation: ย่อหน้า C อธิบายจุดเด่นที่ทำให้ต่างจากวิธี desalination แบบอื่น นั่นคือใช้แค่ sunlight ไม่ต้องมีพลังงานที่ผลิตขึ้นมา จึงตรงกับ heading v.
Paraphrased Vocabulary: different from alternatives = unlike standard desalination techniques

Question 17: Section D

Correct Answer: x
Exact Portion: "at least two-thirds of the world’s population lives with severe water scarcity"
Short Thai Explanation: ย่อหน้า D พูดถึงจำนวนคนจำนวนมากที่ได้รับผลกระทบจากการขาดแคลนน้ำ จึงตรงกับ heading x.
Paraphrased Vocabulary: number of people affected = two-thirds of the world’s population

Question 18: Section E

Correct Answer: iv
Exact Portion: "The device is aimed at a wide variety of users"
Short Thai Explanation: ย่อหน้า E อธิบายกลุ่มลูกค้าหลายแบบ ทั้งในประเทศกำลังพัฒนาและประเทศพัฒนาแล้ว จึงตรงกับ heading iv.
Paraphrased Vocabulary: range of potential customers = a wide variety of users

Question 19: Section F

Correct Answer: viii
Exact Portion: "We are a venture with a social mission"
Short Thai Explanation: ย่อหน้า F บอกชัดว่าบริษัทมี social mission และกำไรไม่ใช่เป้าหมายหลักเพียงอย่างเดียว จึงตรงกับ heading viii.
Paraphrased Vocabulary: profit not the primary goal = venture with a social mission

Question 20: Section G

Correct Answer: i
Exact Portion: "It has raised £340,000 in funding so far."
Short Thai Explanation: ย่อหน้า G พูดถึงการระดมทุนของบริษัท จึงตรงกับ heading i เรื่อง getting the finance for production.
Paraphrased Vocabulary: getting the finance = raised funding

Question 21: The device can be used in different locations, as it has 21………………… .

Correct Answer: wheels
Exact Portion: "it is easy to transport, thanks to its two wheels"
Short Thai Explanation: คำตอบคือ wheels เพราะล้อทำให้อุปกรณ์เคลื่อนย้ายไปใช้ในสถานที่ต่าง ๆ ได้ง่าย.
Paraphrased Vocabulary: used in different locations = easy to transport

Question 22: a 22………………….. of water flows over a solar panel.

Correct Answer: film
Exact Portion: "flows as a thin film between a sheet of double glazing and the surface of a solar panel"
Short Thai Explanation: น้ำไหลเป็น thin film เหนือแผง จึงเติมคำว่า film.
Paraphrased Vocabulary: flows over a solar panel = flows as a thin film

Question 23: Any particles in the water are caught in a 23………………… .

Correct Answer: filter
Exact Portion: "The device has a very simple filter to trap particles"
Short Thai Explanation: คำตอบคือ filter เพราะตัวกรองเป็นส่วนที่ดักจับ particles.
Paraphrased Vocabulary: are caught in = trap

Question 24: all types of 24………………… come out through another.

Correct Answer: waste
Exact Portion: "one for the waste – salt from seawater, fluoride, etc."
Short Thai Explanation: ของเหลวอีกท่อหนึ่งคือ waste หรือของเสียที่ถูกแยกออกมา.
Paraphrased Vocabulary: all types of = salt, fluoride, etc.

Question 25: A screen displays the 25………………… of the device

Correct Answer: performance
Exact Portion: "The performance of the unit is shown on an LCD screen"
Short Thai Explanation: หน้าจอแสดง performance ของตัวเครื่องโดยตรง.
Paraphrased Vocabulary: screen displays = is shown on an LCD screen

Question 26: they know when the Desolenator requires 26…………………. .

Correct Answer: servicing
Exact Portion: "transmitted to the company which provides servicing when necessary"
Short Thai Explanation: ข้อมูลถูกส่งไปให้บริษัทเพื่อรู้ว่าเมื่อไรเครื่องต้องการ servicing.
Paraphrased Vocabulary: know when ... requires = provides servicing when necessary`

const READING_EXERCISE5_DANCE_ENGINEERS_PASSAGE_TEXT = `READING PASSAGE 1
Could urban engineers learn from dance?
A

The way we travel around cities has a major impact on whether they are sustainable. Transportation is estimated to account for 30% of energy consumption in most of the world’s most developed nations, so lowering the need for energy-using vehicles is essential for decreasing the environmental impact of mobility. But as more and more people move to cities, it is important to think about other kinds of sustainable travel too. The ways we travel affect our physical and mental health, our social lives, our access to work and culture, and the air we breathe. Engineers are tasked with changing how we travel round cities through urban design, but the engineering industry still works on the assumptions that led to the creation of the energy-consuming transport systems we have now: the emphasis placed solely on efficiency, speed, and quantitative data. We need radical changes, to make it healthier, more enjoyable, and less environmentally damaging to travel around cities.

B

Dance might hold some of the answers. That is not to suggest everyone should dance their way to work, however healthy and happy it might make us, but rather that the techniques used by choreographers to experiment with and design movement in dance could provide engineers with tools to stimulate new ideas in city-making. Richard Sennett, an influential urbanist and sociologist who has transformed ideas about the way cities are made, argues that urban design has suffered from a separation between mind and body since the introduction of the architectural blueprint.

C

Whereas medieval builders improvised and adapted construction through their intimate knowledge of materials and personal experience of the conditions on a site, building designs are now conceived and stored in media technologies that detach the designer from the physical and social realities they are creating. While the design practices created by these new technologies are essential for managing the technical complexity of the modern city, they have the drawback of simplifying reality in the process.

D

To illustrate, Sennett discusses the Peachtree Center in Atlanta, USA, a development typical of the modernist approach to urban planning prevalent in the 1970s. Peachtree created a grid of streets and towers intended as a new pedestrian-friendly downtown for Atlanta. According to Sennett, this failed because its designers had invested too much faith in computer-aided design to tell them how it would operate. They failed to take into account that purpose-built street cafés could not operate in the hot sun without the protective awnings common in older buildings, and would need energy-consuming air conditioning instead, or that its giant car park would feel so unwelcoming that it would put people off getting out of their cars. What seems entirely predictable and controllable on screen has unexpected results when translated into reality.

E

The same is true in transport engineering, which uses models to predict and shape the way people move through the city. Again, these models are necessary, but they are built on specific world views in which certain forms of efficiency and safety are considered and other experience of the city ignored. Designs that seem logical in models appear counter-intuitive in the actual experience of their users. The guard rails that will be familiar to anyone who has attempted to cross a British road, for example, were an engineering solution to pedestrian safety based on models that prioritise the smooth flow of traffic. On wide major roads, they often guide pedestrians to specific crossing points and slow down their progress across the road by using staggered access points divide the crossing into two – one for each carriageway. In doing so they make crossings feel longer, introducing psychological barriers greatly impacting those that are the least mobile, and encouraging others to make dangerous crossings to get around the guard rails. These barriers don’t just make it harder to cross the road: they divide communities and decrease opportunities for healthy transport. As a result, many are now being removed, causing disruption, cost, and waste.

F

If their designers had had the tools to think with their bodies – like dancers – and imagine how these barriers would feel, there might have been a better solution. In order to bring about fundamental changes to the ways we use our cities, engineering will need to develop a richer understanding of why people move in certain ways, and how this movement affects them. Choreography may not seem an obvious choice for tackling this problem. Yet it shares with engineering the aim of designing patterns of movement within limitations of space. It is an art form developed almost entirely by trying out ideas with the body, and gaining instant feedback on how the results feel. Choreographers have deep understanding of the psychological, aesthetic, and physical implications of different ways of moving.

G

Observing the choreographer Wayne McGregor, cognitive scientist David Kirsh described how he ‘thinks with the body’, Kirsh argues that by using the body to simulate outcomes, McGregor is able to imagine solutions that would not be possible using purely abstract thought. This kind of physical knowledge is valued in many areas of expertise, but currently has no place in formal engineering design processes. A suggested method for transport engineers is to improvise design solutions and instant feedback about how they would work from their own experience of them, or model designs at full scale in the way choreographers experiment with groups of dancers. Above all, perhaps, they might learn to design for emotional as well as functional effects.

Questions 1-6
Reading Passage 1 has seven paragraphs, A-G.

Which paragraph contains the following information?

Write the correct letter, A-G, in boxes 1-6 on your answer sheet.

1   reference to an appealing way of using dance that the writer is not proposing

2   an example of a contrast between past and present approaches to building

3   mention of an objective of both dance and engineering

4   reference to an unforeseen problem arising from ignoring the climate

5   why some measures intended to help people are being reversed

6   reference to how transport has an impact on human lives

Questions 7-13
Complete the summary below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 7-13 on your answer sheet.

Guard rails
Guard rails were introduced on British roads to improve the 7…………………… of pedestrians, while ensuring that the movement of 8……………………. is not disrupted. Pedestrians are led to access points, and encouraged to cross one 9…………………….. at a time.

An unintended effect is to create psychological difficulties in crossing the road, particularly for less 10………………….. people. Another result is that some people cross the road in a 11……………………. way. The guard rails separate 12……………………., and make it more difficult to introduce forms of transport that are 13…………………….`

const READING_EXERCISE5_DANCE_ENGINEERS_ANSWER_KEY = `READING PASSAGE 1: Could urban engineers learn from dance?
Question 1: reference to an appealing way of using dance that the writer is not proposing

Correct Answer: B
Exact Portion: "That is not to suggest everyone should dance their way to work, however healthy and happy it might make us"
Short Thai Explanation: ผู้เขียนยกไอเดียการเต้นไปทำงานที่ฟังดูน่าสนุกและดีต่อสุขภาพขึ้นมา แต่บอกชัดว่าไม่ใช่สิ่งที่กำลังเสนอจริง ๆ ดังนั้นคำตอบคือย่อหน้า B.
Paraphrased Vocabulary: an appealing way = healthy and happy; not proposing = not to suggest

Question 2: an example of a contrast between past and present approaches to building

Correct Answer: C
Exact Portion: "Whereas medieval builders improvised ... building designs are now conceived and stored in media technologies"
Short Thai Explanation: ย่อหน้า C เปรียบเทียบตรง ๆ ระหว่าง medieval builders กับวิธีออกแบบอาคารสมัยใหม่ จึงตรงกับโจทย์.
Paraphrased Vocabulary: contrast between past and present = Whereas medieval ... now

Question 3: mention of an objective of both dance and engineering

Correct Answer: F
Exact Portion: "it shares with engineering the aim of designing patterns of movement within limitations of space"
Short Thai Explanation: ย่อหน้า F บอกว่าทั้ง choreography และ engineering มีเป้าหมายร่วมกัน คือการออกแบบรูปแบบการเคลื่อนไหวในพื้นที่จำกัด.
Paraphrased Vocabulary: objective of both = shares with engineering the aim

Question 4: reference to an unforeseen problem arising from ignoring the climate

Correct Answer: D
Exact Portion: "street cafés could not operate in the hot sun without the protective awnings"
Short Thai Explanation: ปัญหาที่ไม่คาดคิดเกิดจากการไม่คำนึงถึงสภาพอากาศร้อน ทำให้ street cafés ใช้งานไม่ได้ตามที่ออกแบบไว้ จึงอยู่ในย่อหน้า D.
Paraphrased Vocabulary: unforeseen problem = unexpected results; climate = hot sun

Question 5: why some measures intended to help people are being reversed

Correct Answer: E
Exact Portion: "As a result, many are now being removed, causing disruption, cost, and waste."
Short Thai Explanation: ย่อหน้า E อธิบายว่าราวกั้นที่ตั้งใจเพิ่มความปลอดภัยกลับสร้างปัญหาหลายอย่าง จึงกำลังถูกถอดออกในภายหลัง.
Paraphrased Vocabulary: intended to help people = solution to pedestrian safety; being reversed = being removed

Question 6: reference to how transport has an impact on human lives

Correct Answer: A
Exact Portion: "The ways we travel affect our physical and mental health, our social lives, our access to work and culture, and the air we breathe."
Short Thai Explanation: ย่อหน้า A กล่าวชัดว่าการเดินทางส่งผลต่อสุขภาพ ชีวิตสังคม งาน วัฒนธรรม และอากาศที่เราหายใจ จึงตรงกับโจทย์ที่สุด.
Paraphrased Vocabulary: impact on human lives = affect our physical and mental health, social lives, access to work and culture

Question 7: improve the 7…………………… of pedestrians

Correct Answer: safety
Exact Portion: "were an engineering solution to pedestrian safety"
Short Thai Explanation: คำตอบคือ safety เพราะ guard rails ถูกติดตั้งมาเพื่อเพิ่มความปลอดภัยให้ pedestrians.
Paraphrased Vocabulary: improve = solution to; pedestrians = pedestrian

Question 8: ensuring that the movement of 8……………………. is not disrupted

Correct Answer: traffic
Exact Portion: "models that prioritise the smooth flow of traffic"
Short Thai Explanation: guard rails ถูกออกแบบให้ช่วยคนข้ามถนน แต่ก็ต้องไม่รบกวนการไหลของ traffic.
Paraphrased Vocabulary: movement is not disrupted = smooth flow

Question 9: encouraged to cross one 9…………………….. at a time

Correct Answer: carriageway
Exact Portion: "divide the crossing into two – one for each carriageway"
Short Thai Explanation: ทางข้ามถูกแบ่งเป็นสองส่วน ทำให้คนต้องข้ามทีละ carriageway.
Paraphrased Vocabulary: one ... at a time = divide the crossing into two

Question 10: particularly for less 10………………….. people

Correct Answer: mobile
Exact Portion: "greatly impacting those that are the least mobile"
Short Thai Explanation: คนที่ได้รับผลกระทบมากเป็นพิเศษคือคนที่เคลื่อนไหวได้น้อยหรือ less mobile.
Paraphrased Vocabulary: less ... people = least mobile

Question 11: some people cross the road in a 11……………………. way

Correct Answer: dangerous
Exact Portion: "encouraging others to make dangerous crossings"
Short Thai Explanation: ผลข้างเคียงคือบางคนเลือกข้ามถนนแบบ dangerous เพื่อเลี่ยง guard rails.
Paraphrased Vocabulary: in a ... way = dangerous crossings

Question 12: The guard rails separate 12…………………….

Correct Answer: communities
Exact Portion: "they divide communities"
Short Thai Explanation: guard rails ไม่ได้แค่ขวางการข้ามถนน แต่ยัง divide communities ด้วย.
Paraphrased Vocabulary: separate = divide

Question 13: forms of transport that are 13…………………….

Correct Answer: healthy
Exact Portion: "decrease opportunities for healthy transport"
Short Thai Explanation: ราวกั้นทำให้การส่งเสริมรูปแบบการเดินทางที่ healthy ทำได้ยากขึ้น.
Paraphrased Vocabulary: forms of transport = transport; make it more difficult to introduce = decrease opportunities for`

const READING_EXERCISE6_EXTINCT_SPECIES_PASSAGE_TEXT = `READING PASSAGE 2
Should we try to bring extinct species back to life?
A

The passenger pigeon was a legendary species. Flying in vast numbers across North America, with potentially many millions within a single flock, their migration was once one of nature’s great spectacles. Sadly, the passenger pigeon’s existence came to an end on 1 September 1914, when the last living specimen died at Cincinnati Zoo. Geneticist Ben Novak is lead researcher on an ambitious project which now aims to bring the bird back to life through a process known as ‘de-extinction’. The basic premise involves using cloning technology to turn the DNA of extinct animals into a fertilised embryo, which is carried by the nearest relative still in existence – in this case, the abundant band-tailed pigeon – before being born as a living, breathing animal. Passenger pigeons are one of the pioneering species in this field, but they are far from the only ones on which this cutting-edge technology is being trialled.

B

In Australia, the thylacine, more commonly known as the Tasmanian tiger, is another extinct creature which genetic scientists are striving to bring back to life. ‘There is no carnivore now in Tasmania that fills the niche which thylacines once occupied,’ explains Michael Archer of the University of New South Wales. He points out that in the decades since the thylacine went extinct, there has been a spread in a ‘dangerously debilitating’ facial tumour syndrome which threatens the existence of the Tasmanian devils, the island’s other notorious resident. Thylacines would have prevented this spread because they would have killed significant numbers of Tasmanian devils. ‘If that contagious cancer had popped up previously, it would have burned out in whatever region it started. The return of thylacines to Tasmania could help to ensure that devils are never again subjected to risks of this kind.’

C

If extinct species can be brought back to life, can humanity begin to correct the damage it has caused to the natural world over the past few millennia? ‘The idea of de-extinction is that we can reverse this process, bringing species that no longer exist back to life,’ says Beth Shapiro of University of California Santa Cruz’s Genomics Institute. ‘I don’t think that we can do this. There is no way to bring back something that is 100 per cent identical to a species that went extinct a long time ago.’ A more practical approach for long-extinct species is to take the DNA of existing species as a template, ready for the insertion of strands of extinct animal DNA to create something new; a hybrid, based on the living species, but which looks and/or acts like the animal which died out.

D

This complicated process and questionable outcome begs the question: what is the actual point of this technology? ‘For us, the goal has always been replacing the extinct species with a suitable replacement,’ explains Novak. ‘When it comes to breeding, band-tailed pigeons scatter and make maybe one or two nests per hectare, whereas passenger pigeons were very social and would make 10,000 or more nests in one hectare.’ Since the disappearance of this key species, ecosystems in the eastern US have suffered, as the lack of disturbance caused by thousands of passenger pigeons wrecking trees and branches means there has been minimal need for regrowth. This has left forests stagnant and therefore unwelcoming to the plants and animals which evolved to help regenerate the forest after a disturbance. According to Novak, a hybridized band-tailed pigeon, with the added nesting habits of a passenger pigeon, could, in theory, re-establish that forest disturbance, thereby creating a habitat necessary for a great many other native species to thrive.

E

Another popular candidate for this technology is the woolly mammoth. George Church, professor at Harvard Medical School and leader of the Woolly Mammoth Revival Project, has been focusing on cold resistance, the main way in which the extinct woolly mammoth and its nearest living relative, the Asian elephant, differ. By pinpointing which genetic traits made it possible for mammoths to survive the icy climate of the tundra, the project’s goal is to return mammoths, or a mammoth-like species, to the area. ‘My highest priority would be preserving the endangered Asian elephant,’ says Church, ‘expanding their range to the huge ecosystem of the tundra. Necessary adaptations would include smaller ears, thicker hair, and extra insulating fat, all for the purpose of reducing heat loss in the tundra, and all traits found in the now extinct woolly mammoth.’ This repopulation of the tundra and boreal forests of Eurasia and North America with large mammals could also be a useful factor in reducing carbon emissions – elephants punch holes through snow and knock down trees, which encourages grass growth. This grass growth would reduce temperature, and mitigate emissions from melting permafrost.

F

While the prospect of bringing extinct animals back to life might capture imaginations, it is, of course, far easier to try to save an existing species which is merely threatened with extinction. ‘Many of the technologies that people have in mind when they think about de-extinction can be used as a form of “genetic rescue”,’ explains Shapiro. She prefers to focus the debate on how this emerging technology could be used to fully understand why various species went extinct in the first place, and therefore how we could use it to make genetic modifications which could prevent mass extinctions in the future. ‘I would also say there’s an incredible moral hazard to not do anything at all,’ she continues. ‘We know that what we are doing today is not enough, and we have to be willing to take some calculated and measured risks.’

Questions 14-17
Reading Passage 2 has six paragraphs, A-F.

Which paragraph contains the following information?

Write the correct letter, A-F, in boxes 14-17 on your answer sheet.

NB   You may use any letter more than once.

14   a reference to how further disappearance of multiple species could be avoided.

15   explanation of a way of reproducing an extinct animal using the DNA of only that species

16   reference to a habitat which has suffered following the extinction of a species

17   mention of the exact point at which a particular species became extinct

Questions 18-22
Complete the summary below.

Choose NO MORE THAN TWO WORDS from the passage for each answer.

Write your answers in boxes 18-22 on your answer sheet.

The woolly mammoth revival project
Professor George Church and his team are trying to identify the 18…………………… which enabled mammoths to live in the tundra. The findings could help preserve the mammoth’s close relative, the endangered Asian elephant.

According to Church, introducing Asian elephants to the tundra would involve certain physical adaptations to minimise 19…………………… To survive in the tundra, the species would need to have the mammoth-like features of thicker hair, 20………………….. of a reduced size and more 21……………………..

Repopulating the tundra with mammoths or Asian elephant/mammoth hybrids would also have an impact on the environment, which could help to reduce temperatures and decrease 22……………………

Questions 23-26
Look at the following statements (Questions 23-26) and the list of people below.

Match each statement with the correct person, A, B or C.

Write the correct letter, A, B or C, in boxes 23-26 on your answer sheet.

NB   You may use any letter more than once.

23   Reintroducing an extinct species to its original habitat could improve the health of a particular species living there.

24   It is important to concentrate on the causes of an animal’s extinction.

25   A species brought back from extinction could have an important beneficial impact on the vegetation of its habitat.

26   Our current efforts at preserving biodiversity are insufficient.

List of People

A     Ben Novak

B     Michael Archer

C     Beth Shapiro`

const READING_EXERCISE6_EXTINCT_SPECIES_ANSWER_KEY = `READING PASSAGE 2: Should we try to bring extinct species back to life?
Question 14: a reference to how further disappearance of multiple species could be avoided.

Correct Answer: B
Exact Portion: "The return of thylacines to Tasmania could help to ensure that devils are never again subjected to risks of this kind."
Short Thai Explanation: ย่อหน้า B อธิบายว่าการกลับมาของ thylacines อาจช่วยป้องกันไม่ให้ Tasmanian devils เผชิญความเสี่ยงซ้ำอีก ซึ่งเป็นการหลีกเลี่ยงการสูญหายต่อไปของสายพันธุ์อื่น.
Paraphrased Vocabulary: further disappearance = never again subjected to risks; multiple species = thylacines and devils

Question 15: explanation of a way of reproducing an extinct animal using the DNA of only that species

Correct Answer: A
Exact Portion: "using cloning technology to turn the DNA of extinct animals into a fertilised embryo"
Short Thai Explanation: ย่อหน้า A อธิบายกระบวนการ de-extinction แบบพื้นฐานโดยใช้ DNA ของสัตว์สูญพันธุ์นั้นเพื่อสร้างตัวอ่อน.
Paraphrased Vocabulary: reproducing an extinct animal = bring the bird back to life; using the DNA = turn the DNA ... into a fertilised embryo

Question 16: reference to a habitat which has suffered following the extinction of a species

Correct Answer: D
Exact Portion: "Since the disappearance of this key species, ecosystems in the eastern US have suffered"
Short Thai Explanation: ย่อหน้า D กล่าวตรง ๆ ว่าระบบนิเวศใน eastern US ได้รับผลเสียหลังการหายไปของ passenger pigeon.
Paraphrased Vocabulary: habitat which has suffered = ecosystems ... have suffered following extinction

Question 17: mention of the exact point at which a particular species became extinct

Correct Answer: A
Exact Portion: "came to an end on 1 September 1914, when the last living specimen died at Cincinnati Zoo"
Short Thai Explanation: ย่อหน้า A ให้วันเวลาชัดเจนมากว่า passenger pigeon สูญพันธุ์เมื่อไร จึงตรงกับคำถามนี้.
Paraphrased Vocabulary: exact point = 1 September 1914

Question 18: trying to identify the 18…………………… which enabled mammoths to live in the tundra

Correct Answer: genetic traits
Exact Portion: "By pinpointing which genetic traits made it possible for mammoths to survive the icy climate of the tundra"
Short Thai Explanation: ทีมของ Church กำลังพยายามหา genetic traits ที่ทำให้ mammoths อยู่รอดใน tundra ได้.
Paraphrased Vocabulary: enabled ... to live = made it possible ... to survive

Question 19: physical adaptations to minimise 19……………………

Correct Answer: heat loss
Exact Portion: "all for the purpose of reducing heat loss in the tundra"
Short Thai Explanation: การปรับลักษณะทางกายภาพเหล่านี้มีเป้าหมายเพื่อลด heat loss.
Paraphrased Vocabulary: minimise = reducing

Question 20: have the mammoth-like features of thicker hair, 20………………….. of a reduced size

Correct Answer: ears
Exact Portion: "Necessary adaptations would include smaller ears, thicker hair"
Short Thai Explanation: อวัยวะที่ต้องเล็กลงคือ ears.
Paraphrased Vocabulary: of a reduced size = smaller

Question 21: and more 21……………………..

Correct Answer: insulating fat
Exact Portion: "and extra insulating fat"
Short Thai Explanation: อีกลักษณะหนึ่งคือมี insulating fat มากขึ้นเพื่อกันความหนาว.
Paraphrased Vocabulary: more = extra

Question 22: could help to reduce temperatures and decrease 22……………………

Correct Answer: emissions
Exact Portion: "reduce temperature, and mitigate emissions from melting permafrost"
Short Thai Explanation: การเพิ่มสัตว์ใหญ่กลับเข้า tundra อาจช่วยลดอุณหภูมิและลด emissions ได้.
Paraphrased Vocabulary: decrease = mitigate

Question 23: Reintroducing an extinct species to its original habitat could improve the health of a particular species living there.

Correct Answer: B
Exact Portion: "The return of thylacines to Tasmania could help to ensure that devils are never again subjected to risks of this kind."
Short Thai Explanation: Michael Archer เชื่อว่าการนำ thylacines กลับมาอาจช่วยปกป้อง Tasmanian devils จากโรคได้.
Paraphrased Vocabulary: improve the health of a particular species = help ensure devils are not subjected to risks

Question 24: It is important to concentrate on the causes of an animal’s extinction.

Correct Answer: C
Exact Portion: "focus the debate on how this emerging technology could be used to fully understand why various species went extinct in the first place"
Short Thai Explanation: Beth Shapiro เน้นว่าควรทำความเข้าใจสาเหตุที่สัตว์สูญพันธุ์ก่อน.
Paraphrased Vocabulary: concentrate on the causes = understand why species went extinct

Question 25: A species brought back from extinction could have an important beneficial impact on the vegetation of its habitat.

Correct Answer: A
Exact Portion: "could, in theory, re-establish that forest disturbance, thereby creating a habitat necessary for a great many other native species to thrive"
Short Thai Explanation: Ben Novak มองว่าการนำ passenger pigeon แบบลูกผสมกลับมาอาจช่วยให้ป่าฟื้นตัวและเอื้อต่อพืชพรรณและสิ่งมีชีวิตอื่น ๆ.
Paraphrased Vocabulary: beneficial impact on vegetation = re-establish forest disturbance and habitat regeneration

Question 26: Our current efforts at preserving biodiversity are insufficient.

Correct Answer: C
Exact Portion: "We know that what we are doing today is not enough"
Short Thai Explanation: Beth Shapiro พูดตรง ๆ ว่าสิ่งที่เรากำลังทำอยู่ตอนนี้ยังไม่พอ.
Paraphrased Vocabulary: current efforts ... are insufficient = what we are doing today is not enough`

const READING_EXERCISE7_NUTMEG_PASSAGE_TEXT = `READING PASSAGE 1
Nutmeg – a valuable spice
The nutmeg tree, Myristica fragrans, is a large evergreen tree native to Southeast Asia. Until the late 18th century, it only grew in one place in the world: a small group of islands in the Banda Sea, part of the Moluccas – or Spice Islands – in northeastern Indonesia. The tree is thickly branched with dense foliage of tough, dark green oval leaves, and produces small, yellow, bell-shaped flowers and pale yellow pear-shaped fruits. The fruit is encased in a flesh husk. When the fruit is ripe, this husk splits into two halves along a ridge running the length of the fruit. Inside is a purple-brown shiny seed, 2-3 cm long by about 2 cm across, surrounded by a lacy red or crimson covering called an ‘aril’. These are the sources of the two spices nutmeg and mace, the former being produced from the dried seed and the latter from the aril.

Nutmeg was a highly prized and costly ingredient in European cuisine in the Middle Ages, and was used as a flavouring, medicinal, and preservative agent. Throughout this period, the Arabs were the exclusive importers of the spice to Europe. They sold nutmeg for high prices to merchants based in Venice, but they never revealed the exact location of the source of this extremely valuable commodity. The Arab-Venetian dominance of the trade finally ended in 1512, when the Portuguese reached the Banda Islands and began exploiting its precious resources.

Always in danger of competition from neighbouring Spain, the Portuguese began subcontracting their spice distribution to Dutch traders. Profits began to flow into the Netherlands, and the Dutch commercial fleet swiftly grew into one of the largest in the world. The Dutch quietly gained control of most of the shipping and trading of spices in Northern Europe. Then, in 1580, Portugal fell under Spanish rule, and by the end of the 16th century the Dutch found themselves locked out of the market. As prices for pepper, nutmeg, and other spices soared across Europe, they decided to fight back.

In 1602, Dutch merchants founded the VOC, a trading corporation better known as the Dutch East India Company. By 1617, the VOC was the richest commercial operation in the world. The company had 50,000 employees worldwide, with a private army of 30,000 men and a fleet of 200 ships. At the same time, thousands of people across Europe were dying of the plague, a highly contagious and deadly disease. Doctors were desperate for a way to stop the spread of this disease, and they decided nutmeg held the cure. Everybody wanted nutmeg, and many were willing to spare no expense to have it. Nutmeg bought for a few pennies in Indonesia could be sold for 68,000 times its original cost on the streets of London. The only problem was the short supply. And that’s where the Dutch found their opportunity.

The Banda Islands were ruled by local sultans who insisted on maintaining a neutral trading policy towards foreign powers. This allowed them to avoid the presence of Portuguese or Spanish troops on their soil, but it also left them unprotected from other invaders. In 1621, the Dutch arrived and took over. Once securely in control of the Bandas, the Dutch went to work protecting their new investment. They concentrated all nutmeg production into a few easily guarded areas, uprooting and destroying any trees outside the plantation zones. Anyone caught growing a nutmeg seedling or carrying seeds without the proper authority was severely punished. In addition, all exported nutmeg was covered with lime to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands. There was only one obstacle to Dutch domination. One of the Banda Islands, a sliver of land called Run, only 3 km long by less than 1 km wide, was under the control of the British. After decades of fighting for control of this tiny island, the Dutch and British arrived at a compromise settlement, the Treaty of Breda, in 1667. Intent on securing their hold over every nutmeg-producing island, the Dutch offered a trade: if the British would give them the island of Run, they would in turn give Britain a distant and much less valuable island in North America. The British agreed. That other island was Manhattan, which is how New Amsterdam became New York. The Dutch now had a monopoly over the nutmeg trade which would last for another century.

Then, in 1770, a Frenchman named Pierre Poivre successfully smuggled nutmeg plants to safety in Mauritius, an island off the coast of Africa. Some of these were later exported to the Caribbean where they thrived, especially on the island of Grenada. Next, in 1778, a volcanic eruption in the Banda region caused a tsunami that wiped out half the nutmeg groves. Finally, in 1809, the British returned to Indonesia and seized the Banda Islands by force. They returned the islands to the Dutch in 1817, but not before transplanting hundreds of nutmeg seedlings to plantations in several locations across southern Asia. The Dutch nutmeg monopoly was over.

Today, nutmeg is grown in Indonesia, the Caribbean, India, Malaysia, Papua New Guinea and Sri Lanka, and world nutmeg production is estimated to average between 10,000 and 12,000 tonnes per year.

Questions 1-4
Complete the notes below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 1-4 on your answer sheet.

The nutmeg tree and fruit
●   the leaves of the tree are 1……………………. in shape

●   the 2……………………. surrounds the fruit and breaks open when the fruit is ripe

●   the 3……………………. is used to produce the spice nutmeg

●   the covering known as the aril is used to produce 4……………………..

●   the tree has yellow flowers and fruit

Questions 5-7
Do the following statements agree with the information given in Reading Passage 1?

In boxes 5-7 on your answer sheet, write

TRUE               if the statement agrees with the information

FALSE              if the statement contradicts the information

NOT GIVEN    if there is no information on this

5   In the Middle Ages, most Europeans knew where nutmeg was grown.

6   The VOC was the world’s first major trading company.

7   Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.

Questions 8-13
Complete the table below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 8-13 on your answer sheet.

Middle Ages

Nutmeg was brought to Europe by the 8……………

16th century

European nations took control of the nutmeg trade

17th century

Demand for nutmeg grew, as it was believed to be effective against the disease known as the 9……………

The Dutch

– took control of the Banda Islands

– restricted nutmeg production to a few areas

– put 10…………… on nutmeg to avoid it being cultivated outside the islands

– finally obtained the island of 11…………… from the British

Late 18th century

1770 – nutmeg plants were secretly taken to 12……………

1778 – half the Banda Islands’ nutmeg plantations were destroyed by a 13……………`

const READING_EXERCISE7_NUTMEG_ANSWER_KEY = `READING PASSAGE 1: Nutmeg – a valuable spice
Question 1: the leaves of the tree are 1……………………. in shape

Correct Answer: oval
Exact Portion: "dense foliage of tough, dark green oval leaves"
Short Thai Explanation: คำอธิบายรูปร่างของ leaves คือ oval จึงเติมคำนี้.
Paraphrased Vocabulary: in shape = leaves

Question 2: the 2……………………. surrounds the fruit and breaks open when the fruit is ripe

Correct Answer: husk
Exact Portion: "The fruit is encased in a flesh husk. When the fruit is ripe, this husk splits"
Short Thai Explanation: สิ่งที่หุ้มผลไม้และแตกออกเมื่อสุกคือ husk.
Paraphrased Vocabulary: surrounds = encased in; breaks open = splits

Question 3: the 3……………………. is used to produce the spice nutmeg

Correct Answer: seed
Exact Portion: "the former being produced from the dried seed"
Short Thai Explanation: nutmeg ผลิตจาก dried seed ดังนั้นคำตอบคือ seed.
Paraphrased Vocabulary: is used to produce = produced from

Question 4: the covering known as the aril is used to produce 4……………………..

Correct Answer: mace
Exact Portion: "the latter from the aril"
Short Thai Explanation: เครื่องเทศที่ได้จาก aril คือ mace.
Paraphrased Vocabulary: covering known as the aril = aril

Question 5: In the Middle Ages, most Europeans knew where nutmeg was grown.

Correct Answer: FALSE
Exact Portion: "they never revealed the exact location of the source"
Short Thai Explanation: ชาวอาหรับไม่เคยเปิดเผยแหล่งปลูกที่แท้จริง จึงไม่ใช่ว่าชาวยุโรปส่วนใหญ่รู้.
Paraphrased Vocabulary: knew where ... was grown = revealed the exact location

Question 6: The VOC was the world’s first major trading company.

Correct Answer: NOT GIVEN
Exact Portion: "the VOC was the richest commercial operation in the world"
Short Thai Explanation: บทความบอกว่า VOC ร่ำรวยมาก แต่ไม่ได้บอกว่าเป็นบริษัทการค้าใหญ่แห่งแรกของโลก จึงเป็น NOT GIVEN.
Paraphrased Vocabulary: first major trading company = บริษัทการค้าใหญ่แห่งแรก

Question 7: Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.

Correct Answer: TRUE
Exact Portion: "securing their hold over every nutmeg-producing island"
Short Thai Explanation: หลัง Treaty of Breda ชาวดัตช์ได้ครอบครองทุกเกาะที่ผลิต nutmeg จึงเป็น TRUE.
Paraphrased Vocabulary: control of all the islands = hold over every nutmeg-producing island

Question 8: Nutmeg was brought to Europe by the 8……………

Correct Answer: Arabs
Exact Portion: "the Arabs were the exclusive importers of the spice to Europe"
Short Thai Explanation: ผู้นำ nutmeg เข้ายุโรปในยุคกลางคือ Arabs.
Paraphrased Vocabulary: brought to Europe = importers ... to Europe

Question 9: disease known as the 9……………

Correct Answer: plague
Exact Portion: "people across Europe were dying of the plague"
Short Thai Explanation: โรคที่คนเชื่อว่า nutmeg ช่วยได้คือ plague.
Paraphrased Vocabulary: disease known as = plague

Question 10: put 10…………… on nutmeg to avoid it being cultivated outside the islands

Correct Answer: lime
Exact Portion: "all exported nutmeg was covered with lime"
Short Thai Explanation: ชาวดัตช์เอา lime ไปเคลือบเมล็ดเพื่อไม่ให้เอาไปปลูกที่อื่นได้.
Paraphrased Vocabulary: put ... on = covered with

Question 11: finally obtained the island of 11…………… from the British

Correct Answer: Run
Exact Portion: "if the British would give them the island of Run"
Short Thai Explanation: เกาะที่ดัตช์ได้จากอังกฤษคือ Run.
Paraphrased Vocabulary: obtained ... from = give them

Question 12: 1770 – nutmeg plants were secretly taken to 12……………

Correct Answer: Mauritius
Exact Portion: "successfully smuggled nutmeg plants to safety in Mauritius"
Short Thai Explanation: ในปี 1770 ต้น nutmeg ถูกลักลอบนำไปที่ Mauritius.
Paraphrased Vocabulary: secretly taken to = smuggled ... to

Question 13: 1778 – half the Banda Islands’ nutmeg plantations were destroyed by a 13……………

Correct Answer: tsunami
Exact Portion: "caused a tsunami that wiped out half the nutmeg groves"
Short Thai Explanation: สิ่งที่ทำลายสวน nutmeg ไปครึ่งหนึ่งคือ tsunami.
Paraphrased Vocabulary: destroyed by = wiped out by`

const READING_EXERCISE8_DRIVERLESS_CARS_PASSAGE_TEXT = `READING PASSAGE 2
Driverless cars
A

The automotive sector is well used to adapting to automation in manufacturing. The implementation of robotic car manufacture from the 1970s onwards led to significant cost savings and improvements in the reliability and flexibility of vehicle mass production. A new challenge to vehicle production is now on the horizon and, again, it comes from automation. However, this time it is not to do with the manufacturing process, but with the vehicles themselves.

Research projects on vehicle automation are not new. Vehicles with limited self-driving capabilities have been around for more than 50 years, resulting in significant contributions towards driver assistance systems. But since Google announced in 2010 that it had been trialling self-driving cars on the streets of California, progress in this field has quickly gathered pace.

B

There are many reasons why technology is advancing so fast. One frequently cited motive is safety; indeed, research at the UK’s Transport Research Laboratory has demonstrated that more than 90 percent of road collisions involve human error as a contributory factor, and it is the primary cause in the vast majority. Automation may help to reduce the incidence of this.

Another aim is to free the time people spend driving for other purposes. If the vehicle can do some or all of the driving, it may be possible to be productive, to socialise or simply to relax while automation systems have responsibility for safe control of the vehicle. If the vehicle can do the driving, those who are challenged by existing mobility models – such as older or disabled travellers – may be able to enjoy significantly greater travel autonomy.

C

Beyond these direct benefits, we can consider the wider implications for transport and society, and how manufacturing processes might need to respond as a result. At present, the average car spends more than 90 percent of its life parked. Automation means that initiatives for car-sharing become much more viable, particularly in urban areas with significant travel demand. If a significant proportion of the population choose to use shared automated vehicles, mobility demand can be met by far fewer vehicles.

D

The Massachusetts Institute of Technology investigated automated mobility in Singapore, finding that fewer than 30 percent of the vehicles currently used would be required if fully automated car sharing could be implemented. If this is the case, it might mean that we need to manufacture far fewer vehicles to meet demand. However, the number of trips being taken would probably increase, partly because empty vehicles would have to be moved from one customer to the next.

Modelling work by the University of Michigan Transportation Research Institute suggests automated vehicles might reduce vehicle ownership by 43 percent, but that vehicles’ average annual mileage double as a result. As a consequence, each vehicle would be used more intensively, and might need replacing sooner. This faster rate of turnover may mean that vehicle production will not necessarily decrease

E

Automation may prompt other changes in vehicle manufacture. If we move to a model where consumers are tending not to own a single vehicle but to purchase access to a range of vehicle through a mobility provider, drivers will have the freedom to select one that best suits their needs for a particular journey, rather than making a compromise across all their requirements.

Since, for most of the time, most of the seats in most cars are unoccupied, this may boost production of a smaller, more efficient range of vehicles that suit the needs of individuals. Specialised vehicles may then be available for exceptional journeys, such as going on a family camping trip or helping a son or daughter move to university.

F

There are a number of hurdles to overcome in delivering automated vehicles to our roads. These include the technical difficulties in ensuring that the vehicle works reliably in the infinite range of traffic, weather and road situations it might encounter; the regulatory challenges in understanding how liability and enforcement might change when drivers are no longer essential for vehicle operation; and the societal changes that may be required for communities to trust and accept automated vehicles as being a valuable part of the mobility landscape.

G

It’s clear that there are many challenges that need to be addressed but, through robust and targeted research, these can most probably be conquered within the next 10 years. Mobility will change in such potentially significant ways and in association with so many other technological developments, such as telepresence and virtual reality, that it is hard to make concrete predictions about the future. However, one thing is certain: change is coming, and the need to be flexible in response to this will be vital for those involved in manufacturing the vehicles that will deliver future mobility.

Questions 14-18
Reading Passage 2 has seven paragraphs, A-G.

Which section contains the following information?

Write the correct letter, A-G, in boxes 14-18 on your answer sheet.

14   reference to the amount of time when a car is not in use

15   mention of several advantages of driverless vehicles for individual road-users

16   reference to the opportunity of choosing the most appropriate vehicle for each trip

17   an estimate of how long it will take to overcome a number of problems

18   a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured

Questions 19-22
Complete the summary below.

Choose NO MORE THAN TWO WORDS from the passage for each answer.

Write your answers in boxes 19-22 on your answer sheet.

The impact of driverless cars
Figures from the Transport Research Laboratory indicate that most motor accidents are partly due to 19……………………., so the introduction of driverless vehicles will result in greater safety. In addition to the direct benefits of automation, it may bring other advantages. For example, schemes for 20………………………. will be more workable, especially in towns and cities, resulting in fewer cars on the road.

According to the University of Michigan Transportation Research Institute, there could be a 43 percent drop in 21…………………….. of cars. However, this would mean that the yearly 22…………………….. of each car would, on average, be twice as high as it currently is. this would lead to a higher turnover of vehicles, and therefore no reduction in automotive manufacturing.

Questions 23 and 24
Choose TWO letters, A-E.

Write the correct letters in boxes 23 and 24 on your answer sheet.

Which TWO benefits of automated vehicles does the writer mention?

A   Car travellers could enjoy considerable cost savings.

B   It would be easier to find parking spaces in urban areas.

C   Travellers could spend journeys doing something other than driving.

D   People who find driving physically difficult could travel independently.

E   A reduction in the number of cars would mean a reduction in pollution.

Questions 25 and 26
Choose TWO letters, A-E.

Write the correct letters in boxes 25 and 26 on your answer sheet.

Which TWO challenges to automated vehicle development does the writer mention?

A   making sure the general public has confidence in automated vehicles

B   managing the pace of transition from conventional to automated vehicles

C   deciding how to compensate professional drivers who become redundant

D   setting up the infrastructure to make roads suitable for automated vehicles

E   getting automated vehicles to adapt to various different driving conditions`

const READING_EXERCISE8_DRIVERLESS_CARS_ANSWER_KEY = `READING PASSAGE 2: Driverless cars
Question 14: reference to the amount of time when a car is not in use

Correct Answer: C
Exact Portion: "the average car spends more than 90 percent of its life parked"
Short Thai Explanation: ย่อหน้า C พูดถึงเวลาที่รถไม่ได้ถูกใช้งานโดยตรง คือจอดอยู่กว่า 90% ของเวลา.
Paraphrased Vocabulary: not in use = parked

Question 15: mention of several advantages of driverless vehicles for individual road-users

Correct Answer: B
Exact Portion: "be productive, to socialise or simply to relax" / "older or disabled travellers ... may be able to enjoy significantly greater travel autonomy"
Short Thai Explanation: ย่อหน้า B กล่าวถึงข้อดีหลายอย่างสำหรับผู้ใช้แต่ละคน เช่น มีเวลาทำอย่างอื่น และช่วยให้ผู้สูงอายุหรือคนพิการเดินทางได้อิสระขึ้น.
Paraphrased Vocabulary: individual road-users = travellers

Question 16: reference to the opportunity of choosing the most appropriate vehicle for each trip

Correct Answer: E
Exact Portion: "select one that best suits their needs for a particular journey"
Short Thai Explanation: ย่อหน้า E บอกว่าผู้ใช้จะมีอิสระเลือกรถที่เหมาะที่สุดสำหรับแต่ละทริป.
Paraphrased Vocabulary: most appropriate = best suits; each trip = particular journey

Question 17: an estimate of how long it will take to overcome a number of problems

Correct Answer: G
Exact Portion: "these can most probably be conquered within the next 10 years"
Short Thai Explanation: ย่อหน้า G ให้กรอบเวลาชัดว่าปัญหาต่าง ๆ น่าจะเอาชนะได้ภายใน 10 ปี.
Paraphrased Vocabulary: estimate of how long = within the next 10 years

Question 18: a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured

Correct Answer: D
Exact Portion: "vehicle production will not necessarily decrease"
Short Thai Explanation: ย่อหน้า D บอกว่าการผลิตรถอาจไม่ได้ลดลง แม้รูปแบบการใช้รถจะเปลี่ยนไป.
Paraphrased Vocabulary: no effect on the number manufactured = will not necessarily decrease

Question 19: most motor accidents are partly due to 19…………………….

Correct Answer: human error
Exact Portion: "more than 90 percent of road collisions involve human error as a contributory factor"
Short Thai Explanation: สาเหตุร่วมสำคัญของอุบัติเหตุส่วนใหญ่คือ human error.
Paraphrased Vocabulary: partly due to = contributory factor

Question 20: schemes for 20………………………. will be more workable

Correct Answer: car-sharing
Exact Portion: "initiatives for car-sharing become much more viable"
Short Thai Explanation: โครงการที่ทำได้จริงมากขึ้นคือ car-sharing.
Paraphrased Vocabulary: schemes = initiatives; more workable = more viable

Question 21: there could be a 43 percent drop in 21…………………….. of cars

Correct Answer: vehicle ownership
Exact Portion: "automated vehicles might reduce vehicle ownership by 43 percent"
Short Thai Explanation: สิ่งที่จะลดลง 43% คือ vehicle ownership.
Paraphrased Vocabulary: drop in = reduce

Question 22: the yearly 22…………………….. of each car

Correct Answer: mileage
Exact Portion: "vehicles’ average annual mileage double as a result"
Short Thai Explanation: คำตอบคือ mileage เพราะระยะทางใช้งานต่อปีของรถแต่ละคันจะเพิ่มเป็นสองเท่า.
Paraphrased Vocabulary: yearly = annual

Question 23: Which TWO benefits of automated vehicles does the writer mention?

Correct Answer: C
Exact Portion: "it may be possible to be productive, to socialise or simply to relax"
Short Thai Explanation: ข้อ C ถูก เพราะผู้เดินทางสามารถใช้เวลาไปทำอย่างอื่นแทนการขับรถ.
Paraphrased Vocabulary: doing something other than driving = be productive, socialise or relax

Question 24: Which TWO benefits of automated vehicles does the writer mention?

Correct Answer: D
Exact Portion: "older or disabled travellers – may be able to enjoy significantly greater travel autonomy"
Short Thai Explanation: ข้อ D ถูก เพราะคนที่ขับรถลำบากทางร่างกายจะเดินทางได้อย่างอิสระมากขึ้น.
Paraphrased Vocabulary: travel independently = greater travel autonomy

Question 25: Which TWO challenges to automated vehicle development does the writer mention?

Correct Answer: A
Exact Portion: "communities to trust and accept automated vehicles"
Short Thai Explanation: ข้อ A ถูก เพราะหนึ่งในความท้าทายคือทำให้สังคมเชื่อมั่นและยอมรับรถอัตโนมัติ.
Paraphrased Vocabulary: general public has confidence = trust and accept

Question 26: Which TWO challenges to automated vehicle development does the writer mention?

Correct Answer: E
Exact Portion: "works reliably in the infinite range of traffic, weather and road situations"
Short Thai Explanation: ข้อ E ถูก เพราะรถต้องปรับตัวให้ทำงานได้ในสภาพถนน จราจร และอากาศที่หลากหลาย.
Paraphrased Vocabulary: adapt to various driving conditions = works reliably in traffic, weather and road situations`

const isCambridgeBookReadingExamRecord = (exam) => {
  const id = String(exam?.id || '').toLowerCase()
  const title = String(exam?.title || '').toLowerCase()
  return (
    /^cambridge-(1[1-7]|19)-/.test(id) ||
    /\bcambridge\s*(1[1-7]|19)\b/.test(title) ||
    /^c(1[1-7]|19)\s/.test(title)
  )
}

const getReadingExamCollectionTitle = (exam) =>
  normalizeReadingCollectionTitle(exam?.collectionTitle || exam?.parsedPayload?.collectionTitle || exam?.parsed_payload?.collectionTitle)

const isReadingBankExamRecord = (exam) =>
  isCambridgeBookReadingExamRecord(exam) || Boolean(getReadingExamCollectionTitle(exam))

const mapBuiltInReadingExam = (exam, timestamps) => {
  const storedPayload = exam.parsedPayload || exam.parsed_payload
  let parsedPayload = storedPayload
  try {
    const rebuilt = buildReadingExamPayload({
      ...exam,
      parsedPayload: storedPayload
    })
    if (isValidReadingParsedPayload(rebuilt)) {
      parsedPayload = rebuilt
    }
  } catch (error) {
    if (!isValidReadingParsedPayload(parsedPayload)) {
      throw error
    }
  }
  if (!isValidReadingParsedPayload(parsedPayload)) {
    parsedPayload = buildReadingExamPayload(exam)
  }
  return {
    ...exam,
    parsedPayload,
    ...(resolveReadingReleaseAt(exam) ? { releaseAt: resolveReadingReleaseAt(exam) } : {}),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt
  }
}

const BUILT_IN_READING_BANK_EXAMS = [
  ...APRIL_2026_UNCERTAIN_PREDICTION_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-3-uncertain-science-of-prediction',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_URBAN_DARKNESS_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-3-case-for-urban-darkness',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_WHAT_IS_RESTORATION_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-3-what-is-restoration',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_DELAYED_ADULTHOOD_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-2-delayed-adulthood',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_CANCEL_CULTURE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-2-psychology-cancel-culture',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_SOCIAL_MEDIA_POLARIZATION_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-2-social-media-algorithms-polarization',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_HOUSE_OF_WINDSOR_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-2-house-of-windsor',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_POLAR_BEARS_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-1-polar-bears',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_PRIMARY_EDUCATION_AI_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-1-primary-education-ai',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_HABSBURG_JAW_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-1-habsburg-jaw',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2026_BALD_EAGLE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2026-passage-1-bald-eagle',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...APRIL_2024_TRAUMA_LANGUAGE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-april-2024-passage-2-trauma-language-popular-culture',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_WOOD_CYCAD_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-1-saving-the-wood-cycad',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_DEVELOPING_ENVIRONMENT_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-1-environmental-problems-developing-countries',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_GREEN_ARCHITECTURE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-1-future-green-architecture',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_ARTISTS_AI_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-2-artists-ai',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_HISTORY_AI_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-2-history-education-ai',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_CRITICAL_THINKING_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-2-critical-thinking',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_NATURAL_WATER_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-2-natural-water-cleaning',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_QUIET_SKILL_FORGETTING_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-3-quiet-skill-of-forgetting',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_IMPERFECT_DESIGN_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-3-imperfect-design',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...MARCH_2026_GOOD_ARCHIVE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-march-2026-passage-3-good-archive',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_DIGITAL_NOMADS_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-1-rise-of-digital-nomads',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_MOVIE_THEATRES_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-1-disappearance-of-movie-theatres',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_SPANISH_ARMADA_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-1-spanish-armada',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_BRITISH_ARISTOCRACY_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-2-british-aristocracy',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_VAQUITA_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-2-saving-the-vaquita',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_ADHD_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-2-adhd-innate-or-upbringing',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_EIGHT_HOUR_SLEEP_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-3-myth-of-eight-hour-sleep',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_WOOD_WIDE_WEB_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-3-wood-wide-web',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_DIGITAL_NATIVE_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-3-myth-of-digital-native',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...FEB_2026_PRODUCTIVE_UNEASE_BOREDOM_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-feb-2026-passage-3-productive-unease-of-boredom',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...JAN_2026_MUSIC_BRAIN_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-jan-2026-passage-2-music-brain',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...JAN_2026_MEDIEVAL_CASTLES_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-jan-2026-passage-2-medieval-castles',
        ...exam
      },
      {
        createdAt: '2026-05-18T00:00:00.000Z',
        updatedAt: '2026-05-18T00:00:00.000Z'
      }
    )
  ),
  ...JAN_2026_PRODUCTIVE_BOREDOM_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-jan-2026-passage-3-productive-power-of-boredom',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...JAN_2026_URBAN_EVOLUTION_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-jan-2026-passage-3-urban-evolution',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...JAN_2026_COGNITIVE_COST_GPS_READING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(
      {
        id: 'builtin-reading-jan-2026-passage-3-cognitive-cost-of-gps',
        ...exam
      },
      {
        createdAt: '2026-05-19T00:00:00.000Z',
        updatedAt: '2026-05-19T00:00:00.000Z'
      }
    )
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-16T00:00:00.000Z',
      updatedAt: '2026-05-16T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-16T00:00:00.000Z',
      updatedAt: '2026-05-16T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-15T00:00:00.000Z',
      updatedAt: '2026-05-15T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-15T00:00:00.000Z',
      updatedAt: '2026-05-15T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-22T00:00:00.000Z',
      updatedAt: '2026-05-22T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-22T00:00:00.000Z',
      updatedAt: '2026-05-22T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-22T00:00:00.000Z',
      updatedAt: '2026-05-22T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-22T00:00:00.000Z',
      updatedAt: '2026-05-22T00:00:00.000Z'
    })
  ),
  ...USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS.map((exam) =>
    mapBuiltInReadingExam(exam, {
      createdAt: '2026-05-24T00:00:00.000Z',
      updatedAt: '2026-05-24T00:00:00.000Z'
    })
  )
]

const BUILT_IN_READING_PDOY_EXAMS = [
  {
    id: 'builtin-reading-pdoy-huarango',
    title: 'Exercise 1 - The Return of the Huarango',
    category: 'normal',
    rawPassageText: READING_PDOY_HUARANGO_PASSAGE_TEXT,
    rawAnswerKey: READING_PDOY_HUARANGO_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 1 - The Return of the Huarango',
      category: 'normal',
      rawPassageText: READING_PDOY_HUARANGO_PASSAGE_TEXT,
      rawAnswerKey: READING_PDOY_HUARANGO_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-pdoy-silbo',
    title: 'Exercise 2 - Silbo Gomero',
    category: 'normal',
    rawPassageText: READING_PDOY_SILBO_PASSAGE_TEXT,
    rawAnswerKey: READING_PDOY_SILBO_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 2 - Silbo Gomero',
      category: 'normal',
      rawPassageText: READING_PDOY_SILBO_PASSAGE_TEXT,
      rawAnswerKey: READING_PDOY_SILBO_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex3-henry-moore',
    title: 'Exercise 3 - Henry Moore',
    category: 'normal',
    rawPassageText: READING_EXERCISE3_HENRY_MOORE_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE3_HENRY_MOORE_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 3 - Henry Moore',
      category: 'normal',
      rawPassageText: READING_EXERCISE3_HENRY_MOORE_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE3_HENRY_MOORE_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex4-desolenator',
    title: 'Exercise 4 - The Desolenator',
    category: 'normal',
    rawPassageText: READING_EXERCISE4_DESOLENATOR_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE4_DESOLENATOR_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 4 - The Desolenator',
      category: 'normal',
      rawPassageText: READING_EXERCISE4_DESOLENATOR_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE4_DESOLENATOR_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex5-dance-engineers',
    title: 'Exercise 5 - Could urban engineers learn from dance?',
    category: 'normal',
    rawPassageText: READING_EXERCISE5_DANCE_ENGINEERS_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE5_DANCE_ENGINEERS_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 5 - Could urban engineers learn from dance?',
      category: 'normal',
      rawPassageText: READING_EXERCISE5_DANCE_ENGINEERS_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE5_DANCE_ENGINEERS_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex6-extinct-species',
    title: 'Exercise 6 - Should we try to bring extinct species back to life?',
    category: 'normal',
    rawPassageText: READING_EXERCISE6_EXTINCT_SPECIES_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE6_EXTINCT_SPECIES_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 6 - Should we try to bring extinct species back to life?',
      category: 'normal',
      rawPassageText: READING_EXERCISE6_EXTINCT_SPECIES_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE6_EXTINCT_SPECIES_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex7-nutmeg',
    title: 'Exercise 7 - Nutmeg',
    category: 'normal',
    rawPassageText: READING_EXERCISE7_NUTMEG_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE7_NUTMEG_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 7 - Nutmeg',
      category: 'normal',
      rawPassageText: READING_EXERCISE7_NUTMEG_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE7_NUTMEG_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  },
  {
    id: 'builtin-reading-ex8-driverless-cars',
    title: 'Exercise 8 - Driverless cars',
    category: 'normal',
    rawPassageText: READING_EXERCISE8_DRIVERLESS_CARS_PASSAGE_TEXT,
    rawAnswerKey: READING_EXERCISE8_DRIVERLESS_CARS_ANSWER_KEY,
    parsedPayload: buildReadingExamPayload({
      title: 'Exercise 8 - Driverless cars',
      category: 'normal',
      rawPassageText: READING_EXERCISE8_DRIVERLESS_CARS_PASSAGE_TEXT,
      rawAnswerKey: READING_EXERCISE8_DRIVERLESS_CARS_ANSWER_KEY
    }),
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z'
  }
]

const BUILT_IN_READING_EXAMS = [...BUILT_IN_READING_BANK_EXAMS, ...BUILT_IN_READING_PDOY_EXAMS]

const mapReadingExamRecord = (row) => {
  const storedPayload = normalizeReadingParsedPayload(row?.parsed_payload)
  const collectionTitle = getReadingExamCollectionTitle({
    parsedPayload: storedPayload,
    parsed_payload: row?.parsed_payload
  })
  const releaseAt = resolveReadingReleaseAt({
    releaseAt: storedPayload?.releaseAt || row?.parsed_payload?.releaseAt,
    collectionTitle,
    title: row?.title
  })
  const exam = {
    id: String(row?.id || ''),
    title: String(row?.title || 'Reading exam'),
    category: normalizeReadingCategory(row?.category),
    ...(collectionTitle ? { collectionTitle } : {}),
    ...(releaseAt ? { releaseAt } : {}),
    rawPassageText: String(row?.raw_passage_text || ''),
    rawAnswerKey: String(row?.raw_answer_key || ''),
    createdAt: row?.created_at || null,
    updatedAt: row?.updated_at || null
  }
  return {
    ...exam,
    parsedPayload:
      exam.rawPassageText && exam.rawAnswerKey
        ? {
            ...buildReadingExamPayload({
              ...exam,
              releaseAt,
              parsedPayload: storedPayload
            }),
            ...(collectionTitle ? { collectionTitle } : {}),
            ...(releaseAt ? { releaseAt } : {})
          }
        : {
            ...storedPayload,
            ...(releaseAt ? { releaseAt } : {})
          }
  }
}

const mapSupportReportRecord = (row) => ({
  id: String(row?.id || ''),
  userId: normalizeOptionalUuid(row?.user_id),
  reporterName: String(row?.reporter_name || row?.reporter_email || 'Student'),
  reporterEmail: normalizeEmail(row?.reporter_email || ''),
  pageContext: sanitizeSupportPageContext(row?.page_context),
  category: normalizeSupportReportCategory(row?.category),
  message: String(row?.message || ''),
  status: normalizeSupportReportStatus(row?.status),
  adminNote: String(row?.admin_note || ''),
  createdAt: row?.created_at || null,
  updatedAt: row?.updated_at || null,
  resolvedAt: row?.resolved_at || null
})

const mapAssessmentReportSummary = (row) => ({
  id: String(row?.id || ''),
  userId: normalizeOptionalUuid(row?.userId),
  learnerName: String(row?.learnerName || row?.learnerEmail || 'Student'),
  learnerEmail: normalizeEmail(row?.learnerEmail || ''),
  testMode: ['part1', 'part2', 'part3', 'full'].includes(String(row?.testMode || '')) ? String(row.testMode) : 'part2',
  topicTitle: String(row?.topicTitle || 'Speaking report'),
  topicCategory: String(row?.topicCategory || 'Speaking'),
  overallBand: clampBand(Number(row?.overallBand ?? 0)),
  provider: String(row?.provider || row?.selectedProvider || 'gemini'),
  apiCostUsd: Math.max(0, Number(row?.apiCostUsd ?? row?.api_cost_usd ?? 0)),
  totalTokens: Math.max(0, Number(row?.totalTokens ?? row?.total_tokens ?? 0)),
  totalCalls: Math.max(0, Number(row?.totalCalls ?? row?.total_calls ?? 0)),
  createdAt: row?.createdAt || null,
  objectPath: String(row?.objectPath || '')
})

const mapLearnerRecord = (row) => ({
  id: String(row?.id || ''),
  name: String(row?.full_name || row?.email || 'Student'),
  email: normalizeEmail(row?.email || ''),
  role: String(row?.role || 'student'),
  status: String(row?.learner_access?.status || 'inactive'),
  startsAt: row?.learner_access?.starts_at || null,
  expiresAt: row?.learner_access?.expires_at || null,
  feedbackRemaining: Math.max(0, Number(row?.learner_access?.feedback_credits ?? 0)),
  fullMockRemaining: Math.max(0, Number(row?.learner_access?.full_mock_credits ?? 0)),
  createdAt: row?.created_at || null
})

const mapCreditProfile = (row) => ({
  name: String(row?.full_name || row?.email || 'Student'),
  plan: isTrialProfileRecord(row) ? 'TRIAL' : 'VIP',
  status: String(row?.learner_access?.status || 'inactive'),
  startsAt: row?.learner_access?.starts_at || null,
  expiresAt: row?.learner_access?.expires_at || null,
  feedbackRemaining: Math.max(0, Number(row?.learner_access?.feedback_credits ?? 0)),
  fullMockRemaining: Math.max(0, Number(row?.learner_access?.full_mock_credits ?? 0))
})

const createAdminCodeSessionPayload = () => ({
  session: {
    accessToken: `${ADMIN_CODE_TOKEN_PREFIX}${ADMIN_PANEL_CODE}`,
    refreshToken: `${ADMIN_CODE_TOKEN_PREFIX}${ADMIN_PANEL_CODE}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365,
    userId: 'admin-code',
    role: 'admin',
    name: 'Admin',
    email: 'admin@englishplan.local'
  },
  creditProfile: {
    name: 'Admin',
    plan: 'VIP',
    status: 'active',
    startsAt: null,
    expiresAt: null,
    feedbackRemaining: 9999,
    fullMockRemaining: 9999
  }
})

const verifyAdminCodeToken = (token) => {
  const normalizedToken = String(token || '').trim()
  if (!normalizedToken.startsWith(ADMIN_CODE_TOKEN_PREFIX)) return null
  const providedCode = normalizedToken.slice(ADMIN_CODE_TOKEN_PREFIX.length).trim()
  if (!providedCode || providedCode !== ADMIN_PANEL_CODE) return null
  return {
    user: {
      id: 'admin-code',
      email: 'admin@englishplan.local'
    },
    profile: {
      id: 'admin-code',
      email: 'admin@englishplan.local',
      full_name: 'Admin',
      role: 'admin',
      learner_access: {
        status: 'active',
        starts_at: null,
        expires_at: null,
        feedback_credits: 9999,
        full_mock_credits: 9999
      }
    }
  }
}

const loadUserProfileWithAccess = async (userId) => {
  const query = `/rest/v1/profiles?select=id,email,full_name,role,created_at,learner_access(status,starts_at,expires_at,feedback_credits,full_mock_credits)&id=eq.${encodeURIComponent(
    userId
  )}&limit=1`
  const rows = await fetchSupabaseJson(query, {
    headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
  })
  return Array.isArray(rows) ? rows[0] || null : null
}

const loadUserProfileByEmail = async (email) => {
  const query = `/rest/v1/profiles?select=id,email,full_name,role,created_at,learner_access(status,starts_at,expires_at,feedback_credits,full_mock_credits)&email=eq.${encodeURIComponent(
    normalizeEmail(email)
  )}&limit=1`
  const rows = await fetchSupabaseJson(query, {
    headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
  })
  return Array.isArray(rows) ? rows[0] || null : null
}

const timingSafeStringEqual = (received, expected) => {
  try {
    const receivedBuffer = Buffer.from(String(received || ''), 'utf8')
    const expectedBuffer = Buffer.from(String(expected || ''), 'utf8')
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
  } catch {
    return false
  }
}

const verifyThinkificWebhookSignature = (req) => {
  if (!THINKIFIC_WEBHOOK_SECRET) {
    const error = new Error('THINKIFIC_WEBHOOK_SECRET is not configured.')
    error.status = 503
    throw error
  }
  const receivedSignature = String(
    req.headers['x-thinkific-hmac-sha256'] ||
      req.headers['x-thinkific-hmac-sha256-signature'] ||
      req.headers['x-thinkific-webhook-signature'] ||
      ''
  )
    .trim()
    .toLowerCase()
  const expectedSignature = createHmac('sha256', THINKIFIC_WEBHOOK_SECRET)
    .update(String(req.rawBody || ''))
    .digest('hex')
    .toLowerCase()
  return timingSafeStringEqual(receivedSignature, expectedSignature)
}

const pickFirstTextValue = (...values) => {
  for (const value of values) {
    const normalized = String(value || '').trim()
    if (normalized) return normalized
  }
  return ''
}

const normalizeThinkificEventName = (req, payload = {}) =>
  pickFirstTextValue(
    req.headers['x-thinkific-topic'],
    req.headers['x-thinkific-event'],
    payload?.event_name,
    payload?.eventName,
    payload?.event,
    payload?.topic,
    payload?.type
  )
    .toLowerCase()
    .replace(/_/g, '.')

const extractThinkificEnrollmentPayload = (payload = {}) => {
  const resource = payload?.resource && typeof payload.resource === 'object' ? payload.resource : payload
  const user =
    resource?.user ||
    payload?.user ||
    resource?.student ||
    payload?.student ||
    resource?.owner ||
    payload?.owner ||
    {}
  const course = resource?.course || payload?.course || resource?.product || payload?.product || {}
  const firstName = pickFirstTextValue(user?.first_name, user?.firstName)
  const lastName = pickFirstTextValue(user?.last_name, user?.lastName)
  const email = normalizeEmail(
    pickFirstTextValue(
      user?.email,
      resource?.email,
      payload?.email,
      resource?.user_email,
      payload?.user_email,
      resource?.student_email,
      payload?.student_email
    )
  )
  const name = pickFirstTextValue(
    user?.name,
    user?.full_name,
    user?.fullName,
    resource?.name,
    resource?.full_name,
    resource?.fullName,
    payload?.name,
    payload?.full_name,
    payload?.fullName,
    resource?.billing_name,
    payload?.billing_name,
    [firstName, lastName].filter(Boolean).join(' '),
    email ? email.split('@')[0] : ''
  )
  const courseId = pickFirstTextValue(
    resource?.course_id,
    resource?.courseId,
    course?.id,
    course?.course_id,
    payload?.course_id,
    payload?.courseId
  )
  const courseName = pickFirstTextValue(course?.name, course?.title, resource?.course_name, payload?.course_name)

  return {
    email,
    name: name || 'Student',
    courseId,
    courseName,
    enrollmentId: pickFirstTextValue(resource?.id, resource?.enrollment_id, payload?.id, payload?.enrollment_id),
    startsAt: pickFirstTextValue(
      resource?.activated_at,
      resource?.started_at,
      resource?.created_at,
      payload?.created_at,
      payload?.occurred_at
    ),
    expiresAt: pickFirstTextValue(resource?.expiry_date, resource?.expires_at, payload?.expiry_date, payload?.expires_at)
  }
}

const isThinkificCourseAllowed = (courseId) => {
  if (THINKIFIC_ALLOWED_COURSE_IDS.length === 0) return true
  return THINKIFIC_ALLOWED_COURSE_IDS.includes(String(courseId || '').trim())
}

const buildThinkificAccessWindow = ({ startsAt, expiresAt }) => {
  const parsedStartsAt = new Date(startsAt || '')
  const effectiveStartsAt = Number.isNaN(parsedStartsAt.getTime())
    ? new Date().toISOString()
    : parsedStartsAt.toISOString()
  const parsedExpiresAt = new Date(expiresAt || '')
  const effectiveExpiresAt = !Number.isNaN(parsedExpiresAt.getTime())
    ? parsedExpiresAt.toISOString()
    : THINKIFIC_DEFAULT_ACCESS_MONTHS > 0
      ? addMonthsUtc(effectiveStartsAt, THINKIFIC_DEFAULT_ACCESS_MONTHS)
      : null

  return {
    startsAt: effectiveStartsAt,
    expiresAt: effectiveExpiresAt
  }
}

const generateTemporaryPassword = () => `${randomBytes(18).toString('base64url')}Aa1`

const sendThinkificAccessEmail = async ({ req, learner, temporaryPassword, courseName, wasActive }) => {
  const appUrl = resolveAppBaseUrl(req)
  const learnerName = escapeHtml(learner?.full_name || learner?.email || 'Student')
  const learnerEmail = normalizeEmail(learner?.email || '')
  const safeCourseName = escapeHtml(courseName || 'your course')
  const appLink = appUrl ? `<p><a href="${escapeHtml(appUrl)}">Open the IELTS practice app</a></p>` : ''
  const passwordBlock = temporaryPassword
    ? `
      <p>Your app account has been created automatically.</p>
      <p><strong>Email:</strong> ${escapeHtml(learnerEmail)}<br />
      <strong>Temporary password:</strong> ${escapeHtml(temporaryPassword)}</p>
      <p>Please sign in with this password, then keep it somewhere safe.</p>
    `
    : `
      <p>Your existing app account has ${wasActive ? 'active' : 'newly activated'} access.</p>
      <p>Sign in with the same app password you already use for ${escapeHtml(learnerEmail)}.</p>
    `
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#172033">
      <p>Hi ${learnerName},</p>
      <p>Your access for ${safeCourseName} is ready in the IELTS practice app.</p>
      ${passwordBlock}
      ${appLink}
      <p>Have a nice week!</p>
    </div>
  `
  const text = [
    `Hi ${String(learner?.full_name || learner?.email || 'Student')},`,
    '',
    `Your access for ${courseName || 'your course'} is ready in the IELTS practice app.`,
    '',
    temporaryPassword
      ? `Email: ${learnerEmail}\nTemporary password: ${temporaryPassword}\nPlease sign in with this password, then keep it somewhere safe.`
      : `Your existing app account has ${wasActive ? 'active' : 'newly activated'} access. Sign in with the app password you already use for ${learnerEmail}.`,
    appUrl ? `Open the app: ${appUrl}` : '',
    '',
    'Have a nice week!'
  ]
    .filter(Boolean)
    .join('\n')

  return sendEmailWithResend({
    to: learnerEmail,
    subject: 'Your IELTS app access is ready',
    html,
    text
  })
}

const provisionThinkificEnrollmentAccess = async ({ req, enrollment }) => {
  const existingProfile = await loadUserProfileByEmail(enrollment.email)
  const previousStatus = String(existingProfile?.learner_access?.status || 'inactive')
  let userId = String(existingProfile?.id || '')
  let temporaryPassword = ''
  let createdAppAccount = false

  if (!userId) {
    temporaryPassword = generateTemporaryPassword()
    const created = await fetchSupabaseJson('/auth/v1/admin/users', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        email: enrollment.email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          name: enrollment.name,
          role: 'student',
          thinkific_course_id: enrollment.courseId || null,
          thinkific_enrollment_id: enrollment.enrollmentId || null
        }
      })
    })
    userId = String(created?.user?.id || created?.id || '')
    if (!userId) throw new Error('Could not create app account for Thinkific enrollee.')
    createdAppAccount = true
  }

  await supabaseRequest('/rest/v1/profiles', {
    method: 'POST',
    headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({
      id: userId,
      email: enrollment.email,
      full_name: enrollment.name || enrollment.email,
      role: 'student'
    })
  })

  const accessWindow = buildThinkificAccessWindow({
    startsAt: enrollment.startsAt,
    expiresAt: enrollment.expiresAt
  })
  await supabaseRequest('/rest/v1/learner_access', {
    method: 'POST',
    headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify(
      buildLearnerAccessPayload({
        userId,
        status: 'active',
        startsAt: accessWindow.startsAt,
        expiresAt: accessWindow.expiresAt,
        feedbackCredits: Math.max(
          THINKIFIC_FEEDBACK_CREDITS,
          Number(existingProfile?.learner_access?.feedback_credits ?? 0)
        ),
        fullMockCredits: Math.max(
          THINKIFIC_FULL_MOCK_CREDITS,
          Number(existingProfile?.learner_access?.full_mock_credits ?? 0)
        )
      })
    )
  })

  const profile = await loadUserProfileWithAccess(userId)
  if (!profile) throw new Error('Thinkific learner profile was not found after provisioning.')

  const shouldEmailLearner = createdAppAccount || previousStatus !== 'active'
  const emailResult = shouldEmailLearner
    ? await sendThinkificAccessEmail({
        req,
        learner: profile,
        temporaryPassword: createdAppAccount ? temporaryPassword : '',
        courseName: enrollment.courseName,
        wasActive: previousStatus === 'active'
      })
    : { skipped: true, reason: 'already_active' }

  return {
    learner: mapLearnerRecord(profile),
    createdAppAccount,
    previousStatus,
    emailResult
  }
}

const isTrialProfileRecord = (profile, authUser = null) => {
  const profileName = String(profile?.full_name || '').trim()
  const profileRole = String(profile?.role || 'student').trim()
  const userMetaRole = String(authUser?.user_metadata?.role || authUser?.raw_user_meta_data?.role || '').trim()
  return (
    profileRole === 'trial' ||
    userMetaRole === 'trial' ||
    profileName === 'Trial User' ||
    profileName.startsWith('Trial - ')
  )
}

const resolveSessionRole = (profile, authUser = null) => {
  if (String(profile?.role || 'student') === 'admin') return 'admin'
  return isTrialProfileRecord(profile, authUser) ? 'trial' : 'student'
}

const verifySupabaseAccessToken = async (accessToken) => {
  if (!accessToken) throw new Error('Missing access token')
  const user = await fetchSupabaseJson('/auth/v1/user', {
    headers: buildSupabaseHeaders({ accessToken, includeJson: false })
  })
  if (!user?.id) throw new Error('Invalid auth session')
  const profile = await loadUserProfileWithAccess(user.id)
  return { user, profile }
}

app.get('/api/admin/approve-signup', async (req, res) => {
  try {
    const token = String(req.query?.token || '').trim()
    const verified = verifyAccessApprovalToken(token)
    if (!verified?.userId) {
      return res.status(400).send(`
        <html><body style="font-family:Arial,sans-serif;padding:32px;">
          <h2>Approval link is invalid</h2>
          <p>This approval link is missing, expired, or has already been replaced.</p>
        </body></html>
      `)
    }

    if (String(req.query?.confirm || '') !== '1') {
      return res.send(`
        <html>
          <body style="font-family:Arial,sans-serif;padding:32px;color:#172033;">
            <h2>Grant access</h2>
            <p>Click the button below to activate this learner and send the access email.</p>
            <form method="GET" action="/api/admin/approve-signup">
              <input type="hidden" name="token" value="${escapeHtml(token)}" />
              <input type="hidden" name="confirm" value="1" />
              <button type="submit" style="padding:12px 18px;background:#123b7a;color:#fff;border:0;border-radius:8px;cursor:pointer;">
                Grant Access
              </button>
            </form>
          </body>
        </html>
      `)
    }

    const activation = await activateLearnerAccess({ userId: verified.userId })
    const learnerName = escapeHtml(activation.learner?.full_name || activation.learner?.email || 'Student')
    const learnerEmail = escapeHtml(activation.learner?.email || '')
    const baseUrl = resolveAppBaseUrl(req)
    const openAppLink = baseUrl ? `<p><a href="${escapeHtml(baseUrl)}">Open the app</a></p>` : ''
    const emailMessage = activation.emailResult?.skipped
      ? activation.wasActive
        ? 'This learner already had active access, so no new client email was sent.'
        : 'Access was granted, but the client email could not be sent automatically.'
      : 'The learner has been emailed automatically.'

    return res.send(`
      <html>
        <body style="font-family:Arial,sans-serif;padding:32px;color:#172033;">
          <h2>Access granted</h2>
          <p><strong>${learnerName}</strong> (${learnerEmail}) now has active access.</p>
          <p>${escapeHtml(emailMessage)}</p>
          ${openAppLink}
        </body>
      </html>
    `)
  } catch (error) {
    return res.status(500).send(`
      <html><body style="font-family:Arial,sans-serif;padding:32px;">
        <h2>Could not grant access</h2>
        <p>${escapeHtml(error instanceof Error ? error.message : 'Unknown error')}</p>
      </body></html>
    `)
  }
})

const normalizeOptionalUuid = (value) => {
  const normalized = String(value || '').trim()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    normalized
  )
    ? normalized
    : null
}

const ensureActiveStudentAccess = (profile) => {
  if (!profile) throw new Error('Profile not found')
  if (String(profile.role || 'student') === 'admin') return
  const status = String(profile?.learner_access?.status || 'inactive')
  if (status !== 'active') {
    throw new Error('Your access is inactive. Please contact your course admin.')
  }
  const expiresAt = profile?.learner_access?.expires_at
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    throw new Error('Your access has expired. Please contact your course admin.')
  }
}

const ensureTrialCreditsAvailable = (profile) => {
  if (!isTrialProfileRecord(profile)) return
  const feedbackRemaining = Math.max(0, Number(profile?.learner_access?.feedback_credits ?? 0))
  const fullMockRemaining = Math.max(0, Number(profile?.learner_access?.full_mock_credits ?? 0))
  if (feedbackRemaining <= 0 || fullMockRemaining <= 0) {
    throw new Error('This trial email has already been used. Please unlock the full course to continue.')
  }
}

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization || '')
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
    const adminAuth = verifyAdminCodeToken(token)
    if (adminAuth) {
      req.auth = { accessToken: token, ...adminAuth }
      return next()
    }
    const { user, profile } = await verifySupabaseAccessToken(token)
    req.auth = { accessToken: token, user, profile }
    next()
  } catch (error) {
    res.status(401).json({
      error: {
        status: 401,
        type: 'auth_error',
        message: error instanceof Error ? error.message : 'Unauthorized'
      }
    })
  }
}

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization || '')
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
    const adminAuth = verifyAdminCodeToken(token)
    if (adminAuth) {
      req.auth = { accessToken: token, ...adminAuth }
      return next()
    }
    const { user, profile } = await verifySupabaseAccessToken(token)
    if (String(profile?.role || 'student') !== 'admin') {
      return res.status(403).json({
        error: {
          status: 403,
          type: 'forbidden',
          message: 'Admin access required'
        }
      })
    }
    req.auth = { accessToken: token, user, profile }
    next()
  } catch (error) {
    res.status(401).json({
      error: {
        status: 401,
        type: 'auth_error',
        message: error instanceof Error ? error.message : 'Unauthorized'
      }
    })
  }
}

app.post('/api/integrations/thinkific/webhook', async (req, res) => {
  try {
    ensureSupabaseConfigured()
    if (!verifyThinkificWebhookSignature(req)) {
      return res.status(401).json({
        error: {
          status: 401,
          type: 'thinkific_webhook_signature_error',
          message: 'Invalid Thinkific webhook signature.'
        }
      })
    }

    const eventName = normalizeThinkificEventName(req, req.body)
    if (
      eventName &&
      !['enrollment.created', 'enrollment.completed', 'enrollment.updated', 'order.created'].includes(eventName)
    ) {
      return res.json({
        ok: true,
        ignored: true,
        reason: 'unsupported_event',
        event: eventName
      })
    }

    const enrollment = extractThinkificEnrollmentPayload(req.body)
    if (!enrollment.email) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'thinkific_webhook_payload_error',
          message: 'Thinkific webhook did not include a learner email.'
        }
      })
    }
    if (!isThinkificCourseAllowed(enrollment.courseId)) {
      return res.json({
        ok: true,
        ignored: true,
        reason: 'course_not_allowed',
        courseId: enrollment.courseId || null
      })
    }

    const result = await provisionThinkificEnrollmentAccess({ req, enrollment })
    return res.json({
      ok: true,
      event: eventName || 'enrollment',
      courseId: enrollment.courseId || null,
      courseName: enrollment.courseName || '',
      learner: result.learner,
      createdAppAccount: result.createdAppAccount,
      email: {
        skipped: Boolean(result.emailResult?.skipped),
        reason: result.emailResult?.reason || ''
      }
    })
  } catch (error) {
    console.error('Thinkific webhook provisioning failed:', error)
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'thinkific_webhook_error',
        message: error instanceof Error ? error.message : 'Could not process Thinkific webhook.'
      }
    })
  }
})

const decrementLearnerCredits = async ({ userId, assessmentMode }) => {
  const profile = await loadUserProfileWithAccess(userId)
  ensureActiveStudentAccess(profile)
  if (String(profile?.role || 'student') === 'admin') {
    return mapCreditProfile(profile)
  }

  const feedbackRemaining = Math.max(0, Number(profile?.learner_access?.feedback_credits ?? 0))
  const fullMockRemaining = Math.max(0, Number(profile?.learner_access?.full_mock_credits ?? 0))
  const isTrialUser = isTrialProfileRecord(profile)

  if (assessmentMode === 'trialSpeaking') {
    if (!isTrialUser) {
      throw new Error('Trial mode is reserved for trial accounts only.')
    }
    if (feedbackRemaining <= 0 || fullMockRemaining <= 0) {
      throw new Error('This trial email has already been used. Please unlock the full course to continue.')
    }

    await supabaseRequest(`/rest/v1/learner_access?user_id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' }),
      body: JSON.stringify({
        feedback_credits: 0,
        full_mock_credits: 0
      })
    })

    const updatedTrialProfile = await loadUserProfileWithAccess(userId)
    return mapCreditProfile(updatedTrialProfile)
  }

  if (feedbackRemaining <= 0) {
    throw new Error('Feedback creditsหมดแล้ว')
  }
  if (assessmentMode === 'fullMock' && fullMockRemaining <= 0) {
    throw new Error('Full Mock creditsหมดแล้ว')
  }

  await supabaseRequest(`/rest/v1/learner_access?user_id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' }),
    body: JSON.stringify({
      feedback_credits: feedbackRemaining - 1,
      ...(assessmentMode === 'fullMock' ? { full_mock_credits: fullMockRemaining - 1 } : {})
    })
  })

  const updatedProfile = await loadUserProfileWithAccess(userId)
  return mapCreditProfile(updatedProfile)
}

const generateFallbackAssessment = ({ punctuatedTranscript, topic, providerReason, testMode }) => {
  const normalizedText = String(punctuatedTranscript || '').trim()
  const wordCount = normalizedText ? normalizedText.split(/\s+/).filter(Boolean).length : 0

  const isPart2 = String(testMode || 'part2') === 'part2'
  const fluency = isPart2
    ? wordCount >= PART2_FLUENCY_WORD_COUNTS.band7Min
      ? 7
      : wordCount >= PART2_FLUENCY_WORD_COUNTS.band6Min
        ? 6
        : wordCount >= PART2_FLUENCY_WORD_COUNTS.band5Floor
          ? 5
          : 4
    : wordCount >= 250
      ? 7
      : wordCount >= 200
        ? 6
        : wordCount >= 150
          ? 5
          : 4
  const lexical = wordCount >= 220 ? 6.5 : wordCount >= 170 ? 6 : wordCount >= 120 ? 5.5 : 5
  const grammar = wordCount >= 220 ? 6.5 : wordCount >= 160 ? 6 : wordCount >= 100 ? 5.5 : 5
  const componentTemplate = (band, criterion) => ({
    band,
    explanationThai: `โหมดสำรอง: ระบบประเมินจากความยาวและความต่อเนื่องของคำตอบสำหรับ ${criterion} เนื่องจากโมเดลหลักไม่พร้อมใช้งาน`,
    requiredTicks: [
      {
        requirement: 'คำตอบมีความต่อเนื่องและพัฒนาประเด็นได้',
        isMet: wordCount >= 140,
        evidence: normalizedText ? [normalizedText.slice(0, 160)] : []
      }
    ],
    plusOnePlan: [
      {
        quote: normalizedText.slice(0, 120) || 'คำตอบสั้นเกินไป',
        fix: 'เพิ่มรายละเอียดด้วยตัวอย่างเฉพาะเจาะจง 2-3 จุด และเชื่อมประโยคด้วย linking words'
      }
    ]
  })

  return {
    provider: 'gemini-fallback',
    criteria: { fluency, lexical, grammar },
    strengths: [
      `ระบบยังส่งผลประเมินได้แม้ provider ภายนอกล้มเหลว`,
      `ประเมินจาก transcript ปัจจุบัน (${wordCount} words)`
    ],
    improvements: [
      'พูดให้ครบเวลาและขยายแต่ละ cue point ด้วยรายละเอียด',
      'เพิ่ม complex sentence และ transition words เพื่อดัน band'
    ],
    modelNotes: `Gemini fallback mode for topic "${topic || 'Unknown topic'}". Reason: ${sanitizeErrorMessage(
      providerReason
    )}`,
    componentReports: {
      grammar: componentTemplate(grammar, 'Grammar'),
      lexical: componentTemplate(lexical, 'Vocabulary'),
      fluency: componentTemplate(fluency, 'Fluency')
    }
  }
}

const normalizeAssessment = (payload, provider) => ({
  provider,
  criteria: {
    fluency: clampBand(payload.criteria?.fluency),
    lexical: clampBand(payload.criteria?.lexical),
    grammar: clampBand(payload.criteria?.grammar)
  },
  strengths: Array.isArray(payload.strengths) ? payload.strengths.slice(0, 4) : [],
  improvements: Array.isArray(payload.improvements) ? payload.improvements.slice(0, 4) : [],
  modelNotes: typeof payload.modelNotes === 'string' ? payload.modelNotes : '',
  componentReports: payload.componentReports ?? {},
  analysisSignals:
    payload?.analysisSignals && typeof payload.analysisSignals === 'object'
      ? {
          grammarErrorCount: Number.isFinite(Number(payload.analysisSignals.grammarErrorCount))
            ? Math.max(0, Math.round(Number(payload.analysisSignals.grammarErrorCount)))
            : null,
          vocabularyIssueCount: Number.isFinite(Number(payload.analysisSignals.vocabularyIssueCount))
            ? Math.max(0, Math.round(Number(payload.analysisSignals.vocabularyIssueCount)))
            : null,
          meaningImpact: normalizeMeaningImpact(payload.analysisSignals.meaningImpact)
        }
      : null
})

const extractFullMockPlan = ({ prompt, cues }) => {
  const normalizedCues = Array.isArray(cues) ? cues : []
  return {
    part1Questions: normalizedCues
      .filter((item) => String(item || '').startsWith('Part 1 -'))
      .map((item) => String(item || '').replace(/^Part\s*1\s*-\s*/i, '').trim())
      .filter(Boolean),
    part2Prompt: String(prompt || '').trim(),
    part3Questions: normalizedCues
      .filter((item) => String(item || '').startsWith('Part 3 -'))
      .map((item) => String(item || '').replace(/^Part\s*3\s*-\s*/i, '').trim())
      .filter(Boolean)
  }
}

const splitFullMockQuestionBreakdown = (questionBreakdown, plan) => {
  const items = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const part1Count = plan.part1Questions.length
  const part2Start = part1Count
  const part3Start = part1Count + (plan.part2Prompt ? 1 : 0)
  return {
    part1: items.slice(0, part1Count),
    part2: plan.part2Prompt ? items.slice(part2Start, part2Start + 1) : [],
    part3: items.slice(part3Start)
  }
}

const joinQuestionResponses = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item?.punctuatedTranscript || item?.rawTranscript || '').trim())
    .filter(Boolean)
    .join('\n\n')

const normalizeSection1Review = (payload) => ({
  introThai:
    typeof payload?.introThai === 'string'
      ? payload.introThai
      : 'อันดับแรกคือเราต้องเข้าใจกรรมการก่อนว่า Speaking Part 1 วัดพื้นฐานภาษาของเราเป็นหลัก',
  analysisThai:
    typeof payload?.analysisThai === 'string'
      ? payload.analysisThai
      : 'จาก Part 1 ส่วนนี้ให้ดูจุดไวยากรณ์ที่ทำให้กรรมการรู้สึกว่าพื้นฐานภาษายังไม่นิ่งพอ',
  mistakes: Array.isArray(payload?.mistakes)
    ? payload.mistakes.slice(0, 20).map((item) => ({
        issue: String(item?.issue || ''),
        evidence: String(item?.evidence || ''),
        suggestion: String(item?.suggestion || '')
      }))
    : []
})

const buildSection1Fallback = (part1Items, grammarReport) => {
  const fallbackFromPlan = Array.isArray(grammarReport?.plusOnePlan)
    ? grammarReport.plusOnePlan
        .slice(0, 12)
        .map((item) => ({
          issue: 'Grammar point to clean up',
          evidence: String(item?.quote || ''),
          suggestion: String(item?.fix || '')
        }))
        .filter((item) => item.evidence || item.suggestion)
    : []
  const transcriptPreview = joinQuestionResponses(part1Items)
  return {
    introThai:
      'อันดับแรกคือเราต้องเข้าใจกรรมการก่อนว่า Speaking Part 1 เขาแทบจะวัดได้แค่พื้นฐานภาษาและความแม่นของรูปประโยคพื้นฐานของเรา',
    analysisThai: fallbackFromPlan.length
      ? 'จากคำตอบ Part 1 นี้ เราควรรีบเก็บ grammar slip เล็ก ๆ ที่ทำให้ impression แรกของกรรมการดูไม่แน่นพอ'
      : 'ใน Part 1 ยังไม่เจอจุดผิดที่ชัดมากจากระบบสำรอง แต่ส่วนนี้ยังควรใช้เช็กความแม่นของ tense, article และ preposition ทุกครั้ง',
    mistakes:
      fallbackFromPlan.length > 0
        ? fallbackFromPlan
        : transcriptPreview
          ? [
              {
                issue: 'Fallback review only',
                evidence: transcriptPreview.slice(0, 180),
                suggestion: 'ลองเช็ก tense, article, preposition และ subject-verb agreement ใน Part 1 อีกครั้ง'
              }
            ]
          : []
  }
}

const roundToHalfBand = (value) => {
  const base = Math.floor(value)
  const fraction = value - base
  if (fraction < 0.25) return base
  if (fraction < 0.75) return base + 0.5
  return base + 1
}

const roundPronunciationBand = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  const base = Math.floor(num)
  const fraction = num - base
  if (fraction < 0.25) return base
  if (fraction > 0.75) return base + 1
  return base + 0.5
}

const normalizeThaiRegisterText = (value) =>
  String(value || '')
    .replace(/นะคะ/g, 'นะครับ')
    .replace(/ค่ะ/g, 'ครับ')

const normalizeThaiRegisterDeep = (value) => {
  if (typeof value === 'string') return normalizeThaiRegisterText(value)
  if (Array.isArray(value)) return value.map((item) => normalizeThaiRegisterDeep(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeThaiRegisterDeep(item)])
    )
  }
  return value
}

const normalizeComponentReport = (report, fallbackBand) => ({
  // Keep the same ceiling across all report components so the UI can safely render
  // up to 10 checklist items, evidence quotes, and suggestions per subscore.
  band: clampBand(report?.band ?? fallbackBand),
  explanationThai:
    typeof report?.explanationThai === 'string'
      ? normalizeThaiRegisterText(report.explanationThai)
      : 'คำอธิบายไม่เพียงพอจากระบบประเมินครับ',
  requiredTicks: Array.isArray(report?.requiredTicks)
    ? report.requiredTicks.slice(0, 10).map((item) => ({
        requirement: normalizeThaiRegisterText(item?.requirement || ''),
        isMet: Boolean(item?.isMet),
        evidence: Array.isArray(item?.evidence)
          ? item.evidence.slice(0, 10).map((x) => normalizeThaiRegisterText(String(x)))
          : []
      }))
    : [],
  plusOnePlan: Array.isArray(report?.plusOnePlan)
    ? report.plusOnePlan.slice(0, 10).map((item) => ({
        quote: normalizeThaiRegisterText(item?.quote || ''),
        fix: normalizeThaiRegisterText(item?.fix || ''),
        thaiMeaning: typeof item?.thaiMeaning === 'string' ? normalizeThaiRegisterText(item.thaiMeaning) : ''
      }))
    : [],
  plusOneChecklist: Array.isArray(report?.plusOneChecklist)
    ? report.plusOneChecklist.slice(0, 10).map((item) => ({
        requirement: normalizeThaiRegisterText(item?.requirement || item?.quote || ''),
        statusThai: normalizeThaiRegisterText(item?.statusThai || ''),
        quote: normalizeThaiRegisterText(item?.quote || item?.requirement || ''),
        fix: normalizeThaiRegisterText(item?.fix || ''),
        originalText: normalizeThaiRegisterText(item?.originalText || ''),
        improvedText: normalizeThaiRegisterText(item?.improvedText || '')
      }))
    : []
})

const buildQuoteCandidates = ({ punctuatedTranscript, questionBreakdown }) => {
  const answers = Array.isArray(questionBreakdown)
    ? questionBreakdown
        .map((item) => String(item?.punctuatedTranscript || item?.rawTranscript || '').trim())
        .filter(Boolean)
    : []

  const answerQuotes = answers
    .map((answer) => answer.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((answer) => (answer.length > 140 ? `${answer.slice(0, 137).trim()}...` : answer))

  if (answerQuotes.length > 0) return answerQuotes

  const fallbackText = String(punctuatedTranscript || '').replace(/\s+/g, ' ').trim()
  if (!fallbackText) return []

  return fallbackText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((sentence) => (sentence.length > 140 ? `${sentence.slice(0, 137).trim()}...` : sentence))
}

const toQuotedEvidence = (value) => {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["']+|["']+$/g, '')
  return text ? `"${text}"` : ''
}

const splitTranscriptSentences = ({ punctuatedTranscript, questionBreakdown }) => {
  const answers = Array.isArray(questionBreakdown)
    ? questionBreakdown
        .flatMap((item) =>
          String(item?.punctuatedTranscript || item?.rawTranscript || '')
            .split(/(?<=[.!?])\s+/)
            .map((sentence) => sentence.trim())
        )
        .filter(Boolean)
    : []

  if (answers.length > 0) return answers

  return String(punctuatedTranscript || '')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

const makeGlobalPattern = (regex) => {
  if (!(regex instanceof RegExp)) return null
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`
  return new RegExp(regex.source, flags)
}

const countPatternHits = (text, regex) => {
  const value = String(text || '')
  const pattern = makeGlobalPattern(regex)
  if (!pattern || !value) return 0
  const matches = value.match(pattern)
  return matches ? matches.length : 0
}

const matchesPattern = (text, regex) => {
  if (!(regex instanceof RegExp)) return false
  const pattern = new RegExp(regex.source, regex.flags.replace(/g/g, ''))
  return pattern.test(String(text || ''))
}

const collectSentenceMatches = (sentences, regex, limit = 10) =>
  (Array.isArray(sentences) ? sentences : [])
    .filter((sentence) => matchesPattern(sentence, regex))
    .slice(0, limit)

const clipSentence = (value, max = 180) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max - 3).trim()}...` : text
}

const PASSIVE_VOICE_REGEX = /\b(am|is|are|was|were|be|been|being)\s+\w+(?:ed|en|wn|lt|pt|nt)\b/gi
const CONDITIONAL_REGEX = /\bif\b[^.!?]{0,120}\b(would|could|might|will)\b|\b(would|could|might)\b[^.!?]{0,120}\bif\b/gi
const PERFECT_TENSE_REGEX = /\b(has|have|had)\s+\w+(?:ed|en|wn|lt|pt|nt)\b/gi
const SUBORDINATING_REGEX = /\b(although|though|unless|whereas|because|since|while|even though|if)\b/gi
const PREPOSITIONAL_PHRASE_REGEX = /\b(in light of this|on top of that|with regard to|in terms of|as a result of|from my perspective)\b/gi
const WHICH_CLAUSE_REGEX = /,\s*which\b/gi
const REFERENCING_REGEX = /\b(this|that|those|these|such)\b/gi
const TRANSITION_REGEX = /\b(firstly|first of all|to begin with|however|moreover|in addition|for instance|for example|on the other hand|therefore|as a result|for one thing|besides|overall|meanwhile|on top of that|looking back)\b/gi

const buildPassiveRewrite = (sentence) => {
  const raw = String(sentence || '').trim().replace(/[.!?]+$/, '')
  if (!raw) return ''
  const irregular = {
    build: 'built',
    built: 'built',
    make: 'made',
    made: 'made',
    change: 'changed',
    changed: 'changed',
    create: 'created',
    created: 'created',
    develop: 'developed',
    developed: 'developed',
    give: 'given',
    gave: 'given',
    take: 'taken',
    took: 'taken',
    teach: 'taught',
    taught: 'taught',
    use: 'used',
    used: 'used',
    help: 'helped',
    helped: 'helped',
    cause: 'caused',
    caused: 'caused',
    improve: 'improved',
    improved: 'improved'
  }
  const pattern =
    /^(they|people|someone|we|the government|companies|schools|teachers|parents|many people)\s+([a-z']+)\s+(.+)$/i
  const match = raw.match(pattern)
  if (!match) return ''
  const objectPhrase = String(match[3] || '').trim()
  const normalizedObject = objectPhrase.replace(/\b(last year|recently|every day|everyday|in school|at school|for students)\b.*$/i, '').trim()
  if (!normalizedObject) return ''
  const verb = String(match[2] || '').toLowerCase()
  const participle =
    irregular[verb] || (verb.endsWith('ed') ? verb : verb.endsWith('e') ? `${verb}d` : `${verb}ed`)
  const be = /\b(systems|rules|students|people|skills|changes|lessons|ideas|methods|tools)\b/i.test(normalizedObject)
    ? 'were'
    : 'was'
  const cleanedObject = normalizedObject.replace(/^(the|a|an)\s+/i, (prefix) => prefix.toLowerCase())
  const capitalizedObject = cleanedObject.charAt(0).toUpperCase() + cleanedObject.slice(1)
  return `${capitalizedObject} ${be} ${participle}.`
}

const getNextBandRequirementBank = ({ criterion, targetBand, testMode }) => {
  const key = String(criterion || '').toLowerCase()
  const roundedBand = Math.max(4, Math.min(9, Math.floor(Number(targetBand) || 0)))
  if (testMode === 'full') {
    return FULL_MOCK_WHOLE_CHECKLIST_REQUIREMENTS[key]?.[roundedBand] || []
  }
  const base =
    key === 'grammar' && testMode === 'part2' && PART2_GRAMMAR_REQUIREMENTS[roundedBand]
      ? PART2_GRAMMAR_REQUIREMENTS[roundedBand]
      : key === 'lexical' && (testMode === 'part1' || testMode === 'part3') && PART13_LEXICAL_REQUIREMENTS[roundedBand]
      ? PART13_LEXICAL_REQUIREMENTS[roundedBand]
      : STANDARD_CHECKLIST_REQUIREMENTS[key]?.[roundedBand] || []
  if (key === 'grammar' && testMode === 'part3' && PASSIVE_VOICE_PART3_REQUIREMENTS[roundedBand]) {
    return [...base, PASSIVE_VOICE_PART3_REQUIREMENTS[roundedBand]]
  }
  return base
}

const summarizeRequirementProgress = ({ requirement, punctuatedTranscript, questionBreakdown, plusOnePlan }) => {
  const sentences = splitTranscriptSentences({ punctuatedTranscript, questionBreakdown })
  const fullText = sentences.join(' ')
  const normalizedRequirement = String(requirement || '').toLowerCase()
  const fallbackPlan = Array.isArray(plusOnePlan) ? plusOnePlan.find((item) => item?.quote && item?.fix) : null
  const underdevelopedAnswer = (Array.isArray(questionBreakdown) ? questionBreakdown : []).find((item) => {
    const answer = String(item?.punctuatedTranscript || item?.rawTranscript || '').trim()
    return answer && !isFullyDevelopedAnswer(answer)
  })
  const buildFallbackSuggestion = () => ({
    statusThai: '',
    originalText: fallbackPlan?.quote || clipSentence(sentences[0] || ''),
    improvedText: fallbackPlan?.fix || 'เติมเหตุผลหรือยกตัวอย่างให้ตรง requirement ของ checklist ข้อนี้ครับ'
  })

  if (
    normalizedRequirement.includes('average') ||
    normalizedRequirement.includes('words per question') ||
    normalizedRequirement.includes('คำต่อคำถาม')
  ) {
    const shortestAnswer = getShortestQuestionModeAnswers(questionBreakdown, 1)[0]
    const targetMatch = String(requirement || '').match(/(\d+)/)
    const targetWords = Number(targetMatch?.[1] || 0)
    const currentAverage = Array.isArray(questionBreakdown) && questionBreakdown.length
      ? (
          questionBreakdown.reduce(
            (sum, item) => sum + countWords(item?.punctuatedTranscript || item?.rawTranscript || ''),
            0
          ) / Math.max(1, questionBreakdown.length)
        ).toFixed(1)
      : '0'
    const exampleSentence = buildFluencyExpansionExample(shortestAnswer?.question || '')
    return {
      statusThai: `สถานะ: ตอนนี้เฉลี่ย ${currentAverage} คำต่อคำถาม แต่ target ข้อนี้คืออย่างน้อย ${targetWords} คำครับ`,
      originalText: clipSentence(
        shortestAnswer ? `Q${shortestAnswer.index + 1} ${shortestAnswer.question}: ${shortestAnswer.answer}` : sentences[0] || ''
      ),
      improvedText: shortestAnswer
        ? `ช่วงนี้ยังสั้นไปครับ ลองต่อหลังประโยคนี้ด้วยรายละเอียดเพิ่ม เช่น "${exampleSentence}" P'Doy's tips: ต้องฝึกพูดให้เร็วขึ้น คิดให้เร็วขึ้น โดยเติมรายละเอียดผ่าน explanation หรือ example ครับ และการยกตัวอย่างคือวิธีที่ง่ายที่สุด`
        : `เพิ่มความยาวด้วยโครง answer -> reason -> example ครับ เช่น "${exampleSentence}" P'Doy's tips: ต้องฝึกพูดให้เร็วขึ้น คิดให้เร็วขึ้น โดยเติมรายละเอียด และการยกตัวอย่างคือวิธีที่ง่ายที่สุด`
    }
  }

  if (normalizedRequirement.includes('passive voice')) {
    const count = countPatternHits(fullText, PASSIVE_VOICE_REGEX)
    const requiredCount = normalizedRequirement.includes('มากกว่า 5') ? 6 : normalizedRequirement.includes('มากกว่า 2') ? 3 : 1
    const candidate = sentences.find((sentence) => !matchesPattern(sentence, PASSIVE_VOICE_REGEX)) || sentences[0] || ''
    const rewritten = buildPassiveRewrite(candidate)
    return {
      statusThai: `สถานะ: คุณใช้ไป ${count} ครั้ง`,
      originalText: clipSentence(candidate),
      improvedText:
        count >= requiredCount
          ? `ตอนนี้ requirement ข้อนี้ผ่านแล้วครับ ลองคงความแม่นของ passive voice แบบนี้ต่อไป`
          : rewritten || `ลองเปลี่ยนประโยคนี้ให้เป็น Passive Voice เพื่อเพิ่ม variation ของ grammar ครับ`
    }
  }

  if (normalizedRequirement.includes('conditionals')) {
    const count = countPatternHits(fullText, CONDITIONAL_REGEX)
    const candidate = sentences.find((sentence) => !matchesPattern(sentence, CONDITIONAL_REGEX)) || sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น conditional ชัดเจน ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count > 0
          ? 'รักษาการใช้ if-clause ให้แม่นแบบนี้ต่อ และลองเพิ่มอีก 1 ประโยคในคำตอบที่อธิบายเหตุ-ผล'
          : `ลองเพิ่ม conditional ในประโยคนี้ เช่น "If ..., ... would ..." เพื่อให้เข้าเกณฑ์ข้อนี้ครับ`
    }
  }

  if (normalizedRequirement.includes('perfect tense')) {
    const count = countPatternHits(fullText, PERFECT_TENSE_REGEX)
    const candidate = sentences.find((sentence) => !matchesPattern(sentence, PERFECT_TENSE_REGEX)) || sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น perfect tense ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count > 0
          ? 'ลองเพิ่ม perfect tense อีก 1 จุดในช่วงที่พูดถึงประสบการณ์หรือผลลัพธ์ต่อเนื่องครับ'
          : `ลองปรับประโยคนี้ให้เป็นรูป have/has/had + V3 เช่น "I have learned that..." ครับ`
    }
  }

  if (normalizedRequirement.includes('subordinating conjunction')) {
    const count = countPatternHits(fullText, SUBORDINATING_REGEX)
    const candidate = sentences.find((sentence) => !matchesPattern(sentence, SUBORDINATING_REGEX)) || sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น subordinating conjunction ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count > 0
          ? 'ลองเพิ่ม because / although / even though ในประโยคถัดไปเพื่อให้ complex sentence ชัดขึ้นครับ'
          : `ลองเชื่อมประโยคนี้ด้วย because / although / even though เพื่อให้ได้ subordinate clause ชัด ๆ ครับ`
    }
  }

  if (normalizedRequirement.includes('prepositional phrase')) {
    const count = countPatternHits(fullText, PREPOSITIONAL_PHRASE_REGEX)
    const candidate = sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น prepositional phrase แบบ target นี้ ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count > 0
          ? 'ลองคงการเปิดประโยคด้วยวลีบุพบทแบบนี้ต่อไปในอีก 1-2 ช่วงของคำตอบครับ'
          : `ลองเติมวลีอย่าง "In light of this," หรือ "On top of that," หน้า ประโยคนี้เพื่อให้ภาษา advanced ขึ้นครับ`
    }
  }

  if (normalizedRequirement.includes('"which"') || normalizedRequirement.includes('which...)')) {
    const count = countPatternHits(fullText, WHICH_CLAUSE_REGEX)
    const candidate = sentences.find((sentence) => !matchesPattern(sentence, WHICH_CLAUSE_REGEX)) || sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น which-clause ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count > 0
          ? 'ลองเพิ่ม which-clause อีก 1 จุดในประโยคอธิบายผลลัพธ์ เพื่อให้ประโยคซับซ้อนขึ้นครับ'
          : `ลองเชื่อมประโยคนี้ด้วย ", which ..." เพื่อเพิ่ม relative clause ที่ตรงกับ checklist ครับ`
    }
  }

  if (normalizedRequirement.includes('ไม่มีข้อผิดพลาดทางไวยากรณ์')) {
    return {
      statusThai: 'สถานะ: ข้อนี้จะผ่านได้เมื่อ grammar slip ทั้งหมดหายไปจากคำตอบครับ',
      originalText: clipSentence(fallbackPlan?.quote || sentences[0] || ''),
      improvedText: fallbackPlan?.fix || 'ย้อนเช็ก tense, article, subject-verb agreement และ plural/singular ในประโยคที่ยาวที่สุดก่อนครับ'
    }
  }

  if (normalizedRequirement.includes('collocations')) {
    const matchingPlans = (Array.isArray(plusOnePlan) ? plusOnePlan : []).slice(0, 3)
    return {
      statusThai: `สถานะ: ตอนนี้ระบบยังต้องการ collocation ที่แม่นขึ้นให้ครบตาม checklist ครับ`,
      originalText: clipSentence(matchingPlans[0]?.quote || sentences[0] || ''),
      improvedText:
        matchingPlans[0]?.fix || 'ลองอัปเกรดคำพื้นฐานเป็น collocation ที่ฟังเป็นธรรมชาติมากขึ้นในหัวข้อเดียวกันครับ'
    }
  }

  if (normalizedRequirement.includes('c2 level')) {
    const matchingPlans = (Array.isArray(plusOnePlan) ? plusOnePlan : []).slice(0, 3)
    return {
      statusThai: 'สถานะ: ยังต้องเพิ่มคำระดับสูงที่ใช้ได้เนียนในบริบทจริงครับ',
      originalText: clipSentence(matchingPlans[0]?.quote || sentences[0] || ''),
      improvedText:
        matchingPlans[0]?.fix || 'เลือกอัปเกรดเพียง 1-2 คำในประโยคเดิม ให้ฟัง advanced แต่ยังเป็นธรรมชาติครับ'
    }
  }

  if (normalizedRequirement.includes('awkward') || normalizedRequirement.includes('คำผิดบริบท')) {
    return {
      statusThai: 'สถานะ: ลดคำที่ฟังแปลกหรือยังไม่เข้าบริบทให้หมดก่อน ข้อนี้ถึงจะผ่านครับ',
      originalText: clipSentence(fallbackPlan?.quote || sentences[0] || ''),
      improvedText: fallbackPlan?.fix || 'เลือกคำที่ง่ายกว่าแต่ใช้ได้ชัวร์ จะดีกว่าคำยากที่ยังไม่แม่นครับ'
    }
  }

  if (normalizedRequirement.includes('referencing')) {
    const count = countPatternHits(fullText, REFERENCING_REGEX)
    const needed = normalizedRequirement.includes('มากกว่า 5') ? 6 : 4
    const candidate = sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น referencing ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count >= needed
          ? 'ตอนนี้ข้อนี้ค่อนข้างแน่นแล้วครับ รักษาการเชื่อม this / that / this idea ให้ต่อเนื่องแบบนี้'
          : 'หลังประโยคนี้ ลองตามด้วยคำอย่าง "this idea", "that experience", "such a method" เพื่อเชื่อมความให้ลื่นขึ้นครับ'
    }
  }

  if (normalizedRequirement.includes('transitional words')) {
    const count = countPatternHits(fullText, TRANSITION_REGEX)
    const needed = normalizedRequirement.includes('อย่างน้อย 3') ? 3 : 2
    const candidate = sentences[0] || ''
    return {
      statusThai: `สถานะ: ตอนนี้ระบบเห็น transition ${count} จุด`,
      originalText: clipSentence(candidate),
      improvedText:
        count >= needed
          ? 'ลองรักษาการใช้ transition แบบนี้ต่อ และกระจายให้ทั่วทั้งคำตอบครับ'
          : 'ลองเติม transition อย่าง "to begin with", "on top of that", "as a result" ก่อนหรือหลังประโยคนี้ครับ'
    }
  }

  if (normalizedRequirement.includes('ยกตัวอย่าง') || normalizedRequirement.includes('อธิบายขยายความ') || normalizedRequirement.includes('support')) {
    const candidateAnswer = underdevelopedAnswer
      ? String(underdevelopedAnswer?.punctuatedTranscript || underdevelopedAnswer?.rawTranscript || '')
      : sentences[0] || ''
    return {
      statusThai: underdevelopedAnswer
        ? 'สถานะ: ยังมีบางคำตอบที่ตอบตรงประเด็นแต่ยังไม่ขยายเหตุผล/ตัวอย่างให้สุดครับ'
        : 'สถานะ: รักษาการขยายความ + ยกตัวอย่างให้ครบทุกคำถามแบบนี้ต่อไปครับ',
      originalText: clipSentence(candidateAnswer),
      improvedText:
        underdevelopedAnswer
          ? 'ต่อท้ายคำตอบนี้ด้วยเหตุผล 1 ประโยค + ตัวอย่าง 1 ประโยค เช่น because... / for example... ครับ'
          : 'ในทุกคำถาม พยายามคงโครง answer -> reason -> example ให้ชัดเจนครับ'
    }
  }

  if (normalizedRequirement.includes('self-correction')) {
    return {
      statusThai: 'สถานะ: ระบบไม่นับ filler เป็นหลัก แต่ควรลดการแก้คำกลางประโยคที่ทำให้ flow หลุดครับ',
      originalText: clipSentence(sentences[0] || ''),
      improvedText: 'ถ้าจะ self-correct ให้แก้สั้น ๆ แล้วเดินประโยคต่อทันที อย่าหยุดแก้นานครับ'
    }
  }

  if (normalizedRequirement.includes('basic vocabulary') || normalizedRequirement.includes('พื้นฐานทั่วไป')) {
    return {
      statusThai: 'สถานะ: ตอนนี้ยังพึ่งคำพื้นฐานค่อนข้างมากครับ',
      originalText: clipSentence(fallbackPlan?.quote || sentences[0] || ''),
      improvedText: fallbackPlan?.fix || 'เลือกอัปเกรดคำสำคัญเพียง 1 คำในแต่ละประโยคก่อน จะคุมความถูกต้องได้ง่ายกว่าครับ'
    }
  }

  return buildFallbackSuggestion()
}

const buildChecklistUnlockItems = ({
  criterion,
  currentBand,
  testMode,
  punctuatedTranscript,
  questionBreakdown,
  plusOnePlan
}) => {
  const targetBand = getNextBandTarget(currentBand)
  const requirements = getNextBandRequirementBank({
    criterion,
    targetBand,
    testMode
  })

  return requirements.slice(0, 10).map((requirement) => {
    const detail = summarizeRequirementProgress({
      requirement,
      punctuatedTranscript,
      questionBreakdown,
      plusOnePlan
    })
    return {
      requirement,
      statusThai: detail.statusThai || '',
      quote: requirement,
      fix: detail.improvedText || detail.statusThai || '',
      originalText: detail.originalText || '',
      improvedText: detail.improvedText || ''
    }
  })
}

const ensureQuotedTickEvidence = ({ requiredTicks, punctuatedTranscript, questionBreakdown }) => {
  const quoteCandidates = buildQuoteCandidates({ punctuatedTranscript, questionBreakdown })
  const defaultEvidence = quoteCandidates.slice(0, 10).map(toQuotedEvidence).filter(Boolean)
  const normalizedSourceText = String(punctuatedTranscript || '')
    .toLowerCase()
    .replace(/["']/g, '')

  return (Array.isArray(requiredTicks) ? requiredTicks : []).map((tick, index) => {
    const normalizedEvidence = (Array.isArray(tick?.evidence) ? tick.evidence : [])
      .map((item) => String(item || '').replace(/\s+/g, ' ').trim())
      .filter((item) => {
        const comparable = item.toLowerCase().replace(/["']/g, '')
        return comparable && normalizedSourceText.includes(comparable)
      })
      .map(toQuotedEvidence)
      .filter(Boolean)
      .slice(0, 10)

    const rotatedFallback =
      quoteCandidates.length > 0
        ? quoteCandidates
            .slice(index % quoteCandidates.length)
            .concat(quoteCandidates.slice(0, index % quoteCandidates.length))
            .slice(0, 10)
            .map(toQuotedEvidence)
            .filter(Boolean)
        : defaultEvidence

    return {
      ...tick,
      evidence: normalizedEvidence.length > 0 ? normalizedEvidence : rotatedFallback
    }
  })
}

const getNextBandTarget = (band) => {
  const normalized = clampBand(band)
  if (normalized >= 9) return 9
  if (normalized % 1 === 0.5) return Math.min(9, Math.ceil(normalized))
  return Math.min(9, normalized + 1)
}

const CHECKLIST_GUIDE_BANK = {
  grammar: {
    5: [
      {
        quote: 'Target: keep simple present/past patterns accurate in short sentences.',
        fix: 'Use clean frames like "I usually...", "I went...", "It helped me..." before adding longer ideas.'
      },
      {
        quote: 'Add one clear reason clause in each answer.',
        fix: 'Useful phrases: "because...", "so that...", "which means that..."'
      }
    ],
    6: [
      {
        quote: 'Target: make simple tense mostly accurate and reduce article/preposition slips.',
        fix: 'Check small forms before you finish: "a/the", "in/on/at", "to/for/about".'
      },
      {
        quote: 'Add controlled complex sentences, not just short statements.',
        fix: 'Useful frames: "I think this matters because...", "The reason I say that is that..."'
      }
    ],
    7: [
      {
        quote: 'Target: Band 7 needs accurate simple tenses plus clear subordinating conjunctions.',
        fix: 'Build answers with "although", "because", "when", "even though", "which is why".'
      },
      {
        quote: 'Use one extended sentence after each main idea.',
        fix: 'Example: "Although I was nervous at first, I gradually became more confident because I practised every day."'
      },
      {
        quote: 'Self-check for avoidable slips before ending the point.',
        fix: 'Watch common patterns: "a mindset shift", "about themselves", "those types of problems".'
      }
    ],
    8: [
      {
        quote: 'Target: Band 8 needs very strong tense control with hardly any distracting errors.',
        fix: 'Mix present, past, and present perfect naturally: "I used to..., but I have become..., so now I..."'
      },
      {
        quote: 'Upgrade clause variety so your grammar sounds flexible, not repetitive.',
        fix: 'Useful frames: "Not only... but also...", "What impressed me most was...", "Had I not read it, I would have..."'
      },
      {
        quote: 'Make each longer sentence accurate from start to finish.',
        fix: 'After speaking, mentally check subject-verb agreement and article use in your longest sentence.'
      }
    ],
    9: [
      {
        quote: 'Target: Band 9 requires near-error-free control, even in long complex sentences.',
        fix: 'Use advanced patterns precisely: conditionals, cleft sentences, and inversion only when they sound natural.'
      },
      {
        quote: 'Make grammar support nuance, not just correctness.',
        fix: 'Example: "Had I encountered that advice earlier, I might have avoided years of unnecessary self-doubt."'
      }
    ]
  },
  lexical: {
    5: [
      {
        quote: 'Target: replace basic repeated words with stable B1 choices.',
        fix: 'Start with safe upgrades such as "important -> essential", "problem -> issue", "help -> support".'
      },
      {
        quote: 'Add one natural collocation per answer.',
        fix: 'Useful collocations: "make progress", "gain confidence", "have a positive impact".'
      }
    ],
    6: [
      {
        quote: 'Target: Band 6 needs mostly A2-B1 vocabulary used more naturally.',
        fix: 'Swap broad words for sharper ones: "big change -> significant change", "good advice -> practical advice".'
      },
      {
        quote: 'Build 2-3 dependable topic phrases you can reuse.',
        fix: 'Examples: "broaden my perspective", "shape my mindset", "deal with pressure".'
      }
    ],
    7: [
      {
        quote: 'Target: Band 7 needs 2-5 solid B1+ collocations with very few unnatural choices.',
        fix: 'Use phrases like "reframe my perspective", "build self-confidence", "navigate difficult situations".'
      },
      {
        quote: 'Avoid sounding translated from Thai by choosing complete chunks, not isolated hard words.',
        fix: 'Say "had a profound impact on me" instead of only upgrading one adjective.'
      },
      {
        quote: 'Add one precise describing phrase and one result phrase.',
        fix: 'Useful frames: "I was genuinely overwhelmed by...", "As a result, I became more..."'
      }
    ],
    8: [
      {
        quote: 'Target: Band 8 needs frequent strong collocations plus at least one higher-level word used naturally.',
        fix: 'Try: "transformative experience", "deeply ingrained habit", "a remarkably practical message".'
      },
      {
        quote: 'Show flexibility by paraphrasing the same idea in two ways.',
        fix: 'Example: "It boosted my confidence" -> "It made me far more self-assured in social situations."'
      },
      {
        quote: 'Choose sophistication that still sounds spoken, not memorized.',
        fix: 'Use C1 words sparingly inside natural sentences, not as a list of difficult vocabulary.'
      }
    ],
    9: [
      {
        quote: 'Target: Band 9 for Part 1 / Part 3 now needs at least 10 natural collocations plus at least 5 C1-C2 words.',
        fix: 'Build answers around natural chunks first, then layer in a few advanced words that fully match the context.'
      },
      {
        quote: 'Keep every advanced word fully in context.',
        fix: 'If a stronger phrase feels memorized, replace it with a slightly simpler chunk that sounds more natural in speech.'
      }
    ]
  },
  fluency: {
    5: [
      {
        quote: 'Target: extend answers beyond short fragments and keep the idea moving.',
        fix: 'Use a 3-part frame: answer -> reason -> example.'
      },
      {
        quote: 'Reduce dead stops by preparing bridge phrases.',
        fix: 'Useful bridges: "The main reason is...", "What I mean is...", "For example..."'
      }
    ],
    6: [
      {
        quote: `Target: Band 6 needs around ${PART2_FLUENCY_WORD_COUNTS.band6Min}-${PART2_FLUENCY_WORD_COUNTS.band6Max} words with understandable flow.`,
        fix: 'For each cue point, add one reason and one short example before moving on.'
      },
      {
        quote: 'Use referencing words more deliberately.',
        fix: 'Useful words: "this book", "that idea", "it", "this advice", "that experience".'
      }
    ],
    7: [
      {
        quote: `Target: Band 7 needs about ${PART2_FLUENCY_WORD_COUNTS.band7Min}+ words with at least 2 clear references used correctly.`,
        fix: 'Stretch each point with "One reason is...", "What stood out to me was...", "Because of that..."'
      },
      {
        quote: 'Add a mini follow-up sentence after every main statement.',
        fix: 'Example: "It changed my mindset. More specifically, it made me stop overthinking what other people thought about me."'
      },
      {
        quote: 'Keep transitions audible so the answer sounds guided.',
        fix: 'Useful transitions: "to begin with", "on top of that", "as a result", "looking back".'
      }
    ],
    8: [
      {
        quote: `Target: Band 8 needs roughly ${PART2_FLUENCY_WORD_COUNTS.band8Min}+ words with strong continuity and natural self-correction.`,
        fix: 'Link ideas across the whole story: "That shift eventually led to...", "What reinforced this was..."'
      },
      {
        quote: 'Develop each idea fully before switching topics.',
        fix: 'Try a 4-step flow: point -> detail -> personal reaction -> result.'
      },
      {
        quote: 'Use referencing to connect earlier and later parts of the answer.',
        fix: 'Useful phrases: "that lesson", "this change", "the same message", "that moment".'
      }
    ],
    9: [
      {
        quote: `Target: Band 9 needs ${PART2_FLUENCY_WORD_COUNTS.band9Min}+ words with effortless flow and very strong cohesion.`,
        fix: 'Sound reflective and connected: "In hindsight...", "What is particularly striking is...", "That is precisely why..."'
      },
      {
        quote: 'Make the response feel like one continuous argument, not separate bullet points.',
        fix: 'End each section by naturally setting up the next idea.'
      }
    ]
  }
}

const CHECKLIST_THAI_TEXT = {
  'Target: keep simple present/past patterns accurate in short sentences.':
    'เป้าหมาย: รักษา simple present และ simple past ให้แม่นในประโยคสั้น ๆ ก่อน',
  'Use clean frames like "I usually...", "I went...", "It helped me..." before adding longer ideas.':
    'เริ่มจากโครงประโยคที่ชัดก่อน เช่น "I usually...", "I went...", "It helped me..." แล้วค่อยต่อยอดเป็นประโยคที่ยาวขึ้น',
  'Add one clear reason clause in each answer.':
    'ในแต่ละคำตอบควรมีเหตุผลที่ชัดอย่างน้อย 1 ช่วงประโยค',
  'Useful phrases: "because...", "so that...", "which means that..."':
    'วลีที่ใช้ได้: "because...", "so that...", "which means that..."',
  'Target: make simple tense mostly accurate and reduce article/preposition slips.':
    'เป้าหมาย: ทำให้ simple tense แม่นเป็นส่วนใหญ่ และลดการพลาดเรื่อง article / preposition',
  'Check small forms before you finish: "a/the", "in/on/at", "to/for/about".':
    'ก่อนจบประโยคให้เช็กคำเล็ก ๆ เสมอ เช่น "a/the", "in/on/at", "to/for/about"',
  'Add controlled complex sentences, not just short statements.':
    'เพิ่ม complex sentence ที่คุมได้จริง ไม่ใช่มีแต่ประโยคสั้น ๆ',
  'Useful frames: "I think this matters because...", "The reason I say that is that..."':
    'โครงที่ใช้ได้: "I think this matters because...", "The reason I say that is that..."',
  'Target: Band 7 needs accurate simple tenses plus clear subordinating conjunctions.':
    'เป้าหมาย: Band 7 ต้องใช้ simple tense ให้แม่น และมี subordinating conjunction ที่ชัดเจน',
  'Build answers with "although", "because", "when", "even though", "which is why".':
    'สร้างคำตอบด้วยคำเชื่อมอย่าง "although", "because", "when", "even though", "which is why"',
  'Use one extended sentence after each main idea.':
    'หลังแต่ละ main idea ให้มีประโยคขยายอย่างน้อย 1 ประโยค',
  'Example: "Although I was nervous at first, I gradually became more confident because I practised every day."':
    'ตัวอย่าง: "Although I was nervous at first, I gradually became more confident because I practised every day."',
  'Self-check for avoidable slips before ending the point.':
    'ก่อนปิดแต่ละประเด็นให้ self-check จุดพลาดที่เลี่ยงได้',
  'Watch common patterns: "a mindset shift", "about themselves", "those types of problems".':
    'ระวังรูปที่พลาดบ่อย เช่น "a mindset shift", "about themselves", "those types of problems"',
  'Target: Band 8 needs very strong tense control with hardly any distracting errors.':
    'เป้าหมาย: Band 8 ต้องคุม tense ได้แน่นมาก และแทบไม่มี error ที่รบกวนการฟัง',
  'Mix present, past, and present perfect naturally: "I used to..., but I have become..., so now I..."':
    'ผสม present, past และ present perfect ให้เป็นธรรมชาติ เช่น "I used to..., but I have become..., so now I..."',
  'Upgrade clause variety so your grammar sounds flexible, not repetitive.':
    'เพิ่มความหลากหลายของ clause เพื่อให้ grammar ฟังยืดหยุ่น ไม่ซ้ำเดิม',
  'Useful frames: "Not only... but also...", "What impressed me most was...", "Had I not read it, I would have..."':
    'โครงที่ใช้ได้: "Not only... but also...", "What impressed me most was...", "Had I not read it, I would have..."',
  'Make each longer sentence accurate from start to finish.':
    'ทำให้ทุกประโยคยาวแม่นตั้งแต่ต้นจนจบ',
  'After speaking, mentally check subject-verb agreement and article use in your longest sentence.':
    'หลังพูดประโยคยาว ลองเช็กในใจเรื่อง subject-verb agreement และ article อีกครั้ง',
  'Target: Band 9 requires near-error-free control, even in long complex sentences.':
    'เป้าหมาย: Band 9 ต้องคุมไวยากรณ์ได้เกือบไร้ข้อผิดพลาด แม้ในประโยคยาวและซับซ้อน',
  'Use advanced patterns precisely: conditionals, cleft sentences, and inversion only when they sound natural.':
    'ใช้โครงสร้างขั้นสูงอย่างแม่นยำ เช่น conditionals, cleft sentences และ inversion เฉพาะเมื่อฟังเป็นธรรมชาติ',
  'Make grammar support nuance, not just correctness.':
    'ให้ grammar ช่วยสื่อ nuance ไม่ใช่แค่ถูกต้องอย่างเดียว',
  'Example: "Had I encountered that advice earlier, I might have avoided years of unnecessary self-doubt."':
    'ตัวอย่าง: "Had I encountered that advice earlier, I might have avoided years of unnecessary self-doubt."',
  'Target: replace basic repeated words with stable B1 choices.':
    'เป้าหมาย: แทนคำพื้นฐานที่ใช้ซ้ำด้วยคำระดับ B1 ที่มั่นคงกว่า',
  'Start with safe upgrades such as "important -> essential", "problem -> issue", "help -> support".':
    'เริ่มจากการอัปเกรดแบบปลอดภัย เช่น "important -> essential", "problem -> issue", "help -> support"',
  'Add one natural collocation per answer.':
    'ในแต่ละคำตอบเพิ่มอย่างน้อย 1 collocation ที่ฟังธรรมชาติ',
  'Useful collocations: "make progress", "gain confidence", "have a positive impact".':
    'collocation ที่ใช้ได้: "make progress", "gain confidence", "have a positive impact"',
  'Target: Band 6 needs mostly A2-B1 vocabulary used more naturally.':
    'เป้าหมาย: Band 6 ต้องใช้คำระดับ A2-B1 เป็นหลัก แต่ให้ฟังธรรมชาติมากขึ้น',
  'Swap broad words for sharper ones: "big change -> significant change", "good advice -> practical advice".':
    'เปลี่ยนคำกว้าง ๆ ให้คมขึ้น เช่น "big change -> significant change", "good advice -> practical advice"',
  'Build 2-3 dependable topic phrases you can reuse.':
    'สร้าง topic phrases ที่หยิบกลับมาใช้ซ้ำได้จริง 2-3 ชุด',
  'Examples: "broaden my perspective", "shape my mindset", "deal with pressure".':
    'ตัวอย่าง: "broaden my perspective", "shape my mindset", "deal with pressure"',
  'Target: Band 7 needs 2-5 solid B1+ collocations with very few unnatural choices.':
    'เป้าหมาย: Band 7 ต้องมี collocation ระดับ B1+ ที่แน่น 2-5 จุด และแทบไม่มีคำที่ฟังไม่ธรรมชาติ',
  'Use phrases like "reframe my perspective", "build self-confidence", "navigate difficult situations".':
    'ใช้วลีอย่าง "reframe my perspective", "build self-confidence", "navigate difficult situations"',
  'Avoid sounding translated from Thai by choosing complete chunks, not isolated hard words.':
    'หลีกเลี่ยงการฟังเหมือนแปลจากไทย โดยเลือกเป็น chunks ทั้งก้อน ไม่ใช่แค่คำยากเดี่ยว ๆ',
  'Say "had a profound impact on me" instead of only upgrading one adjective.':
    'เช่น พูดว่า "had a profound impact on me" แทนการเปลี่ยนแค่ adjective คำเดียว',
  'Add one precise describing phrase and one result phrase.':
    'เพิ่ม 1 วลีบรรยายที่แม่น และ 1 วลีที่บอกผลลัพธ์',
  'Useful frames: "I was genuinely overwhelmed by...", "As a result, I became more..."':
    'โครงที่ใช้ได้: "I was genuinely overwhelmed by...", "As a result, I became more..."',
  'Target: Band 8 needs frequent strong collocations plus at least one higher-level word used naturally.':
    'เป้าหมาย: Band 8 ต้องมี strong collocations บ่อยพอ และมีคำระดับสูงอย่างน้อย 1 คำที่ใช้ได้เป็นธรรมชาติ',
  'Try: "transformative experience", "deeply ingrained habit", "a remarkably practical message".':
    'ลองใช้: "transformative experience", "deeply ingrained habit", "a remarkably practical message"',
  'Show flexibility by paraphrasing the same idea in two ways.':
    'โชว์ความยืดหยุ่นด้วยการ paraphrase ความคิดเดียวกันได้ 2 แบบ',
  'Example: "It boosted my confidence" -> "It made me far more self-assured in social situations."':
    'ตัวอย่าง: "It boosted my confidence" -> "It made me far more self-assured in social situations."',
  'Choose sophistication that still sounds spoken, not memorized.':
    'เลือกคำที่ดู sophisticated แต่ยังฟังเป็นภาษาพูด ไม่ใช่เหมือนท่องมา',
  'Use C1 words sparingly inside natural sentences, not as a list of difficult vocabulary.':
    'ใช้คำระดับ C1 แบบพอดีในประโยคธรรมชาติ ไม่ใช่เรียงคำยากเป็นลิสต์',
  'Target: Band 9 for Part 1 / Part 3 now needs at least 10 natural collocations plus at least 5 C1-C2 words.':
    'เป้าหมาย: Band 9 ของ Part 1 / Part 3 ตอนนี้ต้องมี collocation ธรรมชาติอย่างน้อย 10 จุด และคำระดับ C1-C2 อย่างน้อย 5 คำ',
  'Build answers around natural chunks first, then layer in a few advanced words that fully match the context.':
    'เริ่มจากวางคำตอบด้วย chunks ที่ฟังธรรมชาติก่อน แล้วค่อยเติมคำระดับสูงบางคำที่เข้ากับบริบทจริง ๆ',
  'Keep every advanced word fully in context.':
    'ทำให้ทุกคำขั้นสูงอยู่ในบริบทที่เหมาะจริง',
  'If a stronger phrase feels memorized, replace it with a slightly simpler chunk that sounds more natural in speech.':
    'ถ้าวลีที่ยากกว่าฟังเหมือนท่องมา ให้ถอยมาใช้ chunk ที่ง่ายลงเล็กน้อยแต่ฟังธรรมชาติกว่า',
  'Target: extend answers beyond short fragments and keep the idea moving.':
    'เป้าหมาย: ขยายคำตอบให้เกินกว่าประโยคสั้น ๆ และรักษา flow ของความคิดให้เดินต่อ',
  'Use a 3-part frame: answer -> reason -> example.':
    'ใช้โครง 3 ส่วน: ตอบตรง ๆ -> ให้เหตุผล -> ยกตัวอย่าง',
  'Reduce dead stops by preparing bridge phrases.':
    'ลดจังหวะหยุดตายด้วยการเตรียม bridge phrases ไว้ล่วงหน้า',
  'Useful bridges: "The main reason is...", "What I mean is...", "For example..."':
    'bridge phrases ที่ใช้ได้: "The main reason is...", "What I mean is...", "For example..."',
  [`Target: Band 6 needs around ${PART2_FLUENCY_WORD_COUNTS.band6Min}-${PART2_FLUENCY_WORD_COUNTS.band6Max} words with understandable flow.`]:
    `เป้าหมาย: Band 6 ควรพูดได้ราว ${PART2_FLUENCY_WORD_COUNTS.band6Min}-${PART2_FLUENCY_WORD_COUNTS.band6Max} คำ และยังคงความลื่นไหลที่ฟังเข้าใจง่าย`,
  'For each cue point, add one reason and one short example before moving on.':
    'ในแต่ละ cue point ให้เติม 1 เหตุผลและ 1 ตัวอย่างสั้น ๆ ก่อนเปลี่ยนไปประเด็นถัดไป',
  'Use referencing words more deliberately.':
    'ใช้คำอ้างอิง (referencing) ให้ตั้งใจและชัดเจนมากขึ้น',
  'Useful words: "this book", "that idea", "it", "this advice", "that experience".':
    'คำที่ใช้ได้ดี: "this book", "that idea", "it", "this advice", "that experience"',
  [`Target: Band 7 needs about ${PART2_FLUENCY_WORD_COUNTS.band7Min}+ words with at least 2 clear references used correctly.`]:
    `เป้าหมาย: Band 7 ต้องพูดได้ประมาณ ${PART2_FLUENCY_WORD_COUNTS.band7Min}+ คำ และใช้ reference อย่างน้อย 2 จุดได้ถูกต้อง`,
  'Stretch each point with "One reason is...", "What stood out to me was...", "Because of that..."':
    'ขยายแต่ละประเด็นด้วย "One reason is...", "What stood out to me was...", "Because of that..."',
  'Add a mini follow-up sentence after every main statement.':
    'หลังทุก main statement ให้มีประโยค follow-up สั้น ๆ ต่ออีก 1 ประโยค',
  'Example: "It changed my mindset. More specifically, it made me stop overthinking what other people thought about me."':
    'ตัวอย่าง: "It changed my mindset. More specifically, it made me stop overthinking what other people thought about me."',
  'Keep transitions audible so the answer sounds guided.':
    'ทำให้ transitions ได้ยินชัด เพื่อให้คำตอบฟังเหมือนมีคนนำทาง',
  'Useful transitions: "to begin with", "on top of that", "as a result", "looking back".':
    'transitions ที่ใช้ได้: "to begin with", "on top of that", "as a result", "looking back"',
  [`Target: Band 8 needs roughly ${PART2_FLUENCY_WORD_COUNTS.band8Min}+ words with strong continuity and natural self-correction.`]:
    `เป้าหมาย: Band 8 ต้องพูดได้ราว ${PART2_FLUENCY_WORD_COUNTS.band8Min}+ คำ มี continuity ที่แน่น และ self-correction อย่างเป็นธรรมชาติ`,
  'Link ideas across the whole story: "That shift eventually led to...", "What reinforced this was..."':
    'เชื่อมไอเดียตลอดทั้งเรื่อง เช่น "That shift eventually led to...", "What reinforced this was..."',
  'Develop each idea fully before switching topics.':
    'พัฒนาแต่ละไอเดียให้สุดก่อนค่อยเปลี่ยนหัวข้อ',
  'Try a 4-step flow: point -> detail -> personal reaction -> result.':
    'ลองใช้ flow 4 ขั้น: point -> detail -> personal reaction -> result',
  'Use referencing to connect earlier and later parts of the answer.':
    'ใช้ referencing เพื่อเชื่อมช่วงต้นและช่วงท้ายของคำตอบเข้าหากัน',
  'Useful phrases: "that lesson", "this change", "the same message", "that moment".':
    'วลีที่ใช้ได้: "that lesson", "this change", "the same message", "that moment"',
  'Target: Band 9 needs 310+ words with effortless flow and very strong cohesion.':
    'เป้าหมาย: Band 9 ต้องพูดได้ 310+ คำแบบไหลลื่นมาก และมี cohesion ที่แน่นมาก',
  'Sound reflective and connected: "In hindsight...", "What is particularly striking is...", "That is precisely why..."':
    'ทำให้โทนฟัง reflective และเชื่อมกัน เช่น "In hindsight...", "What is particularly striking is...", "That is precisely why..."',
  'Make the response feel like one continuous argument, not separate bullet points.':
    'ทำให้คำตอบฟังเหมือนข้อโต้แย้งเดียวที่ไหลต่อเนื่อง ไม่ใช่ bullet points แยกกัน',
  'End each section by naturally setting up the next idea.':
    'จบแต่ละช่วงด้วยการปูไปสู่ไอเดียถัดไปอย่างเป็นธรรมชาติ'
}

const buildChecklistPlusOnePlan = ({ criterion, currentBand }) => {
  const key = String(criterion || '').toLowerCase()
  const targetBand = getNextBandTarget(currentBand)
  const bank = CHECKLIST_GUIDE_BANK[key]?.[targetBand] || []
  if (!bank.length) return []

  const toThaiChecklistText = (value) => {
    const text = String(value || '').trim()
    return CHECKLIST_THAI_TEXT[text] || text
  }

  return bank.map((item) => ({
    quote: `เส้นทางสู่ Band ${targetBand.toFixed(1)}: ${toThaiChecklistText(item.quote)}`,
    fix: toThaiChecklistText(item.fix)
  }))
}

const ensureLexicalUpgradePlans = ({ plusOnePlan, punctuatedTranscript }) => {
  const existing = Array.isArray(plusOnePlan) ? plusOnePlan : []
  const normalizedText = String(punctuatedTranscript || '').toLowerCase()
  const MAX_LEXICAL_PLAN_ITEMS = 10

  return existing
    .map((item) => ({
      quote: normalizeThaiRegisterText(item?.quote || ''),
      fix: normalizeThaiRegisterText(item?.fix || ''),
      thaiMeaning: normalizeThaiRegisterText(item?.thaiMeaning || '')
    }))
    .filter((item) => {
      const quote = String(item.quote || '').trim()
      if (!quote) return false
      const directQuotedPhrase = quote.match(/"([^"]+)"/)?.[1]?.trim()
      if (directQuotedPhrase) {
        return normalizedText.includes(directQuotedPhrase.toLowerCase())
      }
      return true
    })
    .slice(0, MAX_LEXICAL_PLAN_ITEMS)
}

const buildEvidenceBasedPlusOneChecklist = (plusOnePlan) => {
  const items = Array.isArray(plusOnePlan) ? plusOnePlan : []
  return items
    .filter((item) => String(item?.quote || '').trim() && String(item?.fix || '').trim())
    .slice(0, 10)
    .map((item) => ({
      quote: normalizeThaiRegisterText(item.quote),
      fix: normalizeThaiRegisterText(item.fix)
    }))
}

const sanitizeFluencyReport = (report) => {
  const fillerHints = ['um', 'uh', 'you know', 'i mean', 'filler', 'hesitation marker']
  const mentionsFiller = (value) => {
    const text = String(value || '').toLowerCase()
    return fillerHints.some((hint) => text.includes(hint))
  }
  const safePlan = Array.isArray(report?.plusOnePlan)
    ? report.plusOnePlan.filter((item) => !mentionsFiller(item?.quote) && !mentionsFiller(item?.fix))
    : []
  return {
    ...report,
    requiredTicks: Array.isArray(report?.requiredTicks)
      ? report.requiredTicks.filter((tick) => !mentionsFiller(tick?.requirement))
      : [],
    plusOnePlan: safePlan
  }
}

const countWords = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length

const transitionPattern =
  /\b(firstly|first of all|to begin with|however|moreover|in addition|for instance|for example|on the other hand|therefore|as a result|for one thing|besides)\b/i
const examplePattern = /\b(for example|for instance|such as|for one thing|like)\b/i
const explanationPattern = /\b(because|since|so|this means|that means|therefore|as a result|which is why)\b/i

const fluencyBandFromAvgWordsPerQuestion = (avgWordsPerQuestion, testMode = '') => {
  if (testMode === 'part3' || testMode === 'part1') {
    if (avgWordsPerQuestion >= 70) return 9
    if (avgWordsPerQuestion >= 60) return 8
    if (avgWordsPerQuestion >= 50) return 7
    if (avgWordsPerQuestion >= 40) return 6
    if (avgWordsPerQuestion >= 4) return 5
    return 4
  }

  if (avgWordsPerQuestion >= 210) return 9
  if (avgWordsPerQuestion >= 190) return 8
  if (avgWordsPerQuestion >= 160) return 7
  if (avgWordsPerQuestion >= 120) return 6
  if (avgWordsPerQuestion >= 100) return 5
  return 4
}

const normalizeIssueCount = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : null)
const normalizeMeaningImpact = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  return ['none', 'minor', 'major'].includes(normalized) ? normalized : null
}

const applyFluencyMeaningFloor = ({ band, analysisSignals }) => {
  const numericBand = clampBand(Number(band) || 0)
  const grammarErrorCount = normalizeIssueCount(analysisSignals?.grammarErrorCount)
  const meaningImpact = normalizeMeaningImpact(analysisSignals?.meaningImpact)
  const floorApplied =
    numericBand < 6 &&
    grammarErrorCount !== null &&
    grammarErrorCount >= 5 &&
    (meaningImpact === 'none' || meaningImpact === 'minor')

  return {
    band: floorApplied ? 6 : numericBand,
    floorApplied,
    grammarErrorCount,
    meaningImpact
  }
}

const isFullyDevelopedAnswer = (answer) => {
  const normalizedAnswer = String(answer || '').trim()
  const words = countWords(normalizedAnswer)
  const hasSupport = examplePattern.test(normalizedAnswer) || explanationPattern.test(normalizedAnswer)
  return words >= 18 && hasSupport
}

const QUESTION_MODE_FLUENCY_TARGET_BY_BAND = {
  6: 40,
  7: 50,
  8: 60,
  9: 70
}

const getQuestionModeFluencyTarget = (targetBand) => {
  const rounded = Math.max(6, Math.min(9, Math.round(Number(targetBand) || 7)))
  return QUESTION_MODE_FLUENCY_TARGET_BY_BAND[rounded] || 50
}

const buildFluencyExpansionExample = (question) => {
  const normalizedQuestion = String(question || '').trim().toLowerCase()
  if (normalizedQuestion.includes('why')) {
    return 'One reason I say that is that it has had a very clear impact on me, especially in terms of my daily life.'
  }
  if (normalizedQuestion.includes('how often')) {
    return 'For example, I usually do that two or three times a week because it helps me stay consistent.'
  }
  if (normalizedQuestion.includes('do you')) {
    return 'For example, whenever I have the chance to do that, I notice that it makes me feel much more relaxed.'
  }
  if (normalizedQuestion.includes('what')) {
    return 'More specifically, one thing I would add is that it affects me in a very practical way on a regular basis.'
  }
  if (normalizedQuestion.includes('future') || normalizedQuestion.includes('plan')) {
    return 'In the future, I would like to develop this further because I think it could benefit me in the long term.'
  }
  return 'One reason for this is that it affects me quite directly, and for example, I can see that in my everyday routine.'
}

const getShortestQuestionModeAnswers = (questionBreakdown, limit = 3) =>
  (Array.isArray(questionBreakdown) ? questionBreakdown : [])
    .map((item, index) => {
      const answer = String(item?.punctuatedTranscript || item?.rawTranscript || '').trim()
      return {
        index,
        question: String(item?.question || `Question ${index + 1}`),
        answer,
        words: countWords(answer),
        fullyDeveloped: isFullyDevelopedAnswer(answer)
      }
    })
    .filter((item) => item.answer)
    .sort((a, b) => {
      if (a.fullyDeveloped !== b.fullyDeveloped) return a.fullyDeveloped ? 1 : -1
      return a.words - b.words
    })
    .slice(0, limit)

const buildQuestionModeFluencySignals = ({ questionBreakdown, analysisSignals }) => {
  const items = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const totalAnswers = items.length
  const totalWordsAcrossQuestions = items.reduce(
    (sum, item) => sum + countWords(item?.punctuatedTranscript || item?.rawTranscript || ''),
    0
  )
  const avgWordsPerQuestion = totalWordsAcrossQuestions / Math.max(1, totalAnswers)
  const fullyDevelopedAnswerCount = items.filter((item) =>
    isFullyDevelopedAnswer(item?.punctuatedTranscript || item?.rawTranscript || '')
  ).length
  const grammarErrorCount = normalizeIssueCount(analysisSignals?.grammarErrorCount)
  const vocabularyIssueCount = normalizeIssueCount(analysisSignals?.vocabularyIssueCount)
  const meaningImpact = normalizeMeaningImpact(analysisSignals?.meaningImpact)
  const mostThreshold = Math.max(1, Math.ceil(totalAnswers * 0.67))

  return {
    questionBreakdown: items,
    punctuatedTranscript: items.map((item) => String(item?.punctuatedTranscript || item?.rawTranscript || '').trim()).filter(Boolean).join(' '),
    totalAnswers,
    totalWordsAcrossQuestions,
    avgWordsPerQuestion: Number(avgWordsPerQuestion.toFixed(1)),
    fullyDevelopedAnswerCount,
    allAnswersFullyDeveloped: totalAnswers > 0 && fullyDevelopedAnswerCount === totalAnswers,
    mostAnswersFullyDeveloped: totalAnswers > 0 && fullyDevelopedAnswerCount >= mostThreshold,
    someAnswersNotFullyDeveloped: totalAnswers > 0 && fullyDevelopedAnswerCount < totalAnswers,
    noAnswersFullyDeveloped: totalAnswers > 0 && fullyDevelopedAnswerCount === 0,
    grammarErrorCount,
    vocabularyIssueCount,
    meaningImpact,
    hasIssueCounts: grammarErrorCount !== null && vocabularyIssueCount !== null
  }
}

const buildQuestionModeFluencyBand = ({ avgWordsPerQuestion, testMode, signals }) => {
  const fallbackBand = fluencyBandFromAvgWordsPerQuestion(avgWordsPerQuestion, testMode)
  if (!signals?.hasIssueCounts) return fallbackBand

  if (
    avgWordsPerQuestion >= 70 &&
    signals.allAnswersFullyDeveloped &&
    signals.grammarErrorCount === 0 &&
    signals.vocabularyIssueCount === 0
  ) {
    return 9
  }

  if (
    avgWordsPerQuestion >= 60 &&
    signals.allAnswersFullyDeveloped &&
    signals.grammarErrorCount <= 2 &&
    signals.vocabularyIssueCount <= 1 &&
    signals.meaningImpact !== 'major'
  ) {
    return 8
  }

  if (
    avgWordsPerQuestion >= 50 &&
    signals.mostAnswersFullyDeveloped &&
    signals.grammarErrorCount <= 4 &&
    signals.vocabularyIssueCount <= 3 &&
    signals.meaningImpact !== 'major'
  ) {
    return 7
  }

  if (
    avgWordsPerQuestion >= 40 &&
    avgWordsPerQuestion < 50 &&
    signals.grammarErrorCount <= 5 &&
    signals.meaningImpact !== 'major'
  ) {
    return 6
  }

  if (
    avgWordsPerQuestion >= 40 &&
    signals.someAnswersNotFullyDeveloped &&
    signals.meaningImpact !== 'major'
  ) {
    return 6
  }

  if (avgWordsPerQuestion < 40 && signals.noAnswersFullyDeveloped && signals.grammarErrorCount > 6) {
    return 5
  }

  if (signals.meaningImpact === 'none' || signals.meaningImpact === 'minor') {
    return Math.max(5, Math.min(6, fallbackBand))
  }

  return 4
}

const buildQuestionModeFluencyRequiredTicks = ({ band, signals, punctuatedTranscript, questionBreakdown }) => {
  const quoteEvidence = buildQuoteCandidates({ punctuatedTranscript, questionBreakdown })
    .slice(0, 3)
    .map(toQuotedEvidence)
    .filter(Boolean)
  const fallbackEvidence = quoteEvidence.length > 0 ? quoteEvidence : ['"No usable transcript quote found."']

  if (band >= 9) {
    return [
      { requirement: 'Band 9: average >= 70 words per question', isMet: signals.avgWordsPerQuestion >= 70, evidence: fallbackEvidence },
      {
        requirement: 'All answers are fully developed with explanation and/or example',
        isMet: signals.allAnswersFullyDeveloped,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No grammatical errors',
        isMet: signals.grammarErrorCount === 0,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No vocabulary mistakes or awkward wording',
        isMet: signals.vocabularyIssueCount === 0,
        evidence: fallbackEvidence
      }
    ]
  }

  if (band >= 8) {
    return [
      { requirement: 'Band 8: average >= 60 words per question', isMet: signals.avgWordsPerQuestion >= 60, evidence: fallbackEvidence },
      {
        requirement: 'All answers are fully developed with explanation and/or example',
        isMet: signals.allAnswersFullyDeveloped,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No grammatical errors',
        isMet: signals.grammarErrorCount === 0,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No more than 1 vocabulary mistake or awkward phrase',
        isMet: signals.vocabularyIssueCount !== null ? signals.vocabularyIssueCount <= 1 : false,
        evidence: fallbackEvidence
      }
    ]
  }

  if (band >= 7) {
    return [
      { requirement: 'Band 7: average >= 50 words per question', isMet: signals.avgWordsPerQuestion >= 50, evidence: fallbackEvidence },
      {
        requirement: 'Most answers are fully developed with explanation and/or example',
        isMet: signals.mostAnswersFullyDeveloped,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No more than 3 grammatical errors',
        isMet: signals.grammarErrorCount !== null ? signals.grammarErrorCount <= 3 : false,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No more than 3 vocabulary mistakes or awkward phrases',
        isMet: signals.vocabularyIssueCount !== null ? signals.vocabularyIssueCount <= 3 : false,
        evidence: fallbackEvidence
      }
    ]
  }

  if (band >= 6) {
    return [
      {
        requirement: 'Band 6: average 40-49 words per question',
        isMet: signals.avgWordsPerQuestion >= 40 && signals.avgWordsPerQuestion < 50,
        evidence: fallbackEvidence
      },
      {
        requirement: 'Some answers are not fully developed and miss reasons or examples',
        isMet: signals.someAnswersNotFullyDeveloped,
        evidence: fallbackEvidence
      },
      {
        requirement: 'No more than 4 grammatical errors',
        isMet: signals.grammarErrorCount !== null ? signals.grammarErrorCount <= 4 : false,
        evidence: fallbackEvidence
      }
    ]
  }

  if (band >= 5) {
    return [
      {
        requirement: 'Band 5: average below 40 words per question',
        isMet: signals.avgWordsPerQuestion < 40,
        evidence: fallbackEvidence
      },
      {
        requirement: 'Answers never become fully developed with reasons or examples',
        isMet: signals.noAnswersFullyDeveloped,
        evidence: fallbackEvidence
      },
      {
        requirement: 'More than 6 grammatical errors',
        isMet: signals.grammarErrorCount !== null ? signals.grammarErrorCount > 6 : false,
        evidence: fallbackEvidence
      },
      {
        requirement: "Mistakes alter or obscure the speaker's intended meaning",
        isMet: signals.meaningImpact === 'major',
        evidence: fallbackEvidence
      }
    ]
  }

  return [
    {
      requirement: 'Band 4: average below 40 words per question',
      isMet: signals.avgWordsPerQuestion < 40,
      evidence: fallbackEvidence
    },
    {
      requirement: 'Answers do not provide real explanation or examples',
      isMet: signals.noAnswersFullyDeveloped,
      evidence: fallbackEvidence
    },
    {
      requirement: "Mistakes repeatedly alter or seriously obscure the speaker's intended meaning",
      isMet: signals.meaningImpact === 'major',
      evidence: fallbackEvidence
    }
  ]
}

const buildQuestionModeFluencyExplanationThai = ({ testMode, band, signals }) => {
  const modeLabel = testMode === 'part1' ? 'Part 1' : 'Part 3'
  const countSummary = signals.hasIssueCounts
    ? `grammar errors ${signals.grammarErrorCount} จุด, vocabulary awkwardness ${signals.vocabularyIssueCount} จุด, meaning impact = ${signals.meaningImpact || 'unknown'}`
    : 'ยังไม่มี detailed grammar/vocabulary counts เพราะใช้ fallback provider'
  const meaningFloorNote =
    band === 6 && (signals.meaningImpact === 'none' || signals.meaningImpact === 'minor') && (signals.grammarErrorCount || 0) >= 5
      ? ' แม้จะมี grammar slip หลายจุด แต่ความหมายยังเข้าใจได้ จึงไม่กด fluency ต่ำกว่า Band 6 ครับ'
      : ''
  return `${modeLabel} fluency rubric ใหม่: เฉลี่ย ${signals.avgWordsPerQuestion} คำต่อคำถาม, fully developed ${signals.fullyDevelopedAnswerCount}/${signals.totalAnswers} คำตอบ, ${countSummary} จึงจัดไว้ที่ Band ${band.toFixed(
    1
  )}${meaningFloorNote}`
}

const buildQuestionModeFluencyPlan = (signals, currentBand = 6) => {
  const nextBandTarget = getNextBandTarget(currentBand)
  const targetWords = getQuestionModeFluencyTarget(nextBandTarget)
  const shortAnswers = getShortestQuestionModeAnswers(signals.questionBreakdown, 3)
  const plan = []

  if (signals.avgWordsPerQuestion < targetWords) {
    plan.push({
      quote: `Average words per question: ${signals.avgWordsPerQuestion} (target for Band ${nextBandTarget.toFixed(1)} = ${targetWords})`,
      fix: `ตอนนี้ word count ยังไม่ถึงเกณฑ์ครับ ต้องฝึกพูดให้เร็วขึ้น คิดให้เร็วขึ้น โดยเติมรายละเอียดมากขึ้น เช่น explanation หรือ example ครับ P'Doy's tips: การยกตัวอย่างคือวิธีที่ง่ายที่สุดในการดัน fluency`
    })
  }

  shortAnswers.forEach((item) => {
    const exampleSentence = buildFluencyExpansionExample(item.question)
    plan.push({
      quote: `Q${item.index + 1} ${item.question}: "${clipSentence(item.answer)}"`,
      fix: `คำตอบข้อนี้ยังสั้นไปครับ ลองต่อหลังช่วงนี้ด้วยรายละเอียดเพิ่ม เช่น "${exampleSentence}" แล้วค่อยปิดคำตอบ`
    })
  })

  if (plan.length === 0) {
    plan.push({
      quote: `Average words per question: ${signals.avgWordsPerQuestion}`,
      fix: 'ขยายทุกคำตอบด้วยโครง answer -> reason -> example ให้ครบก่อนจบคำตอบ'
    })
  }

  if (signals.someAnswersNotFullyDeveloped) {
    plan.push({
      quote: `Fully developed answers: ${signals.fullyDevelopedAnswerCount}/${signals.totalAnswers}`,
      fix: `ถ้าคำตอบยังสั้นหรือจบเร็วเกินไป ให้เติม because / since และตามด้วยตัวอย่างสั้น ๆ ทันทีครับ P'Doy's tips: giving example คือทางลัดที่ง่ายที่สุด`
    })
  }

  if (signals.grammarErrorCount !== null && signals.grammarErrorCount > 3) {
    plan.push({
      quote: `Grammar errors counted: ${signals.grammarErrorCount}`,
      fix: 'ลด grammar slip ในแต่ละคำตอบ โดยเช็ก tense, article และ subject-verb agreement ในประโยคที่ยาวที่สุด'
    })
  }

  if (signals.vocabularyIssueCount !== null && signals.vocabularyIssueCount > 1) {
    plan.push({
      quote: `Vocabulary awkwardness counted: ${signals.vocabularyIssueCount}`,
      fix: 'เลือกคำที่เป็นธรรมชาติมากขึ้นและใช้ collocation ที่ชัวร์ แทนการฝืนใช้คำยากที่ยังไม่แม่น'
    })
  }

  return plan.slice(0, 10)
}

const STANDARD_CHECKLIST_REQUIREMENTS = {
  grammar: {
    9: [
      'ใช้ conditionals, perfect tense และ past tense',
      'ไม่มีข้อผิดพลาดทางไวยากรณ์เลยสำหรับการพูด',
      'ใช้ subordinating conjunction'
    ],
    8: [
      'ใช้ perfect tense และ past tense',
      'ใช้ subordinating conjunction',
      'ไม่มีข้อผิดพลาดทางไวยากรณ์'
    ],
    7: [
      'ใช้ simple tense ได้อย่างถูกต้อง',
      'ใช้ subordinating conjunction',
      'มีข้อผิดพลาดทางไวยากรณ์เล็กน้อยได้ไม่เกิน 3 ครั้ง'
    ],
    6: [
      'simple tense ผิดได้ไม่เกิน 3 ครั้ง',
      'มี past tense error',
      'มี subordinating conjunction error หรือไม่ใช้เลย',
      'มี grammar error มากกว่า 5 ครั้ง แต่ยังไม่รบกวนความเข้าใจ'
    ],
    5: [
      'มี simple tense error',
      'ไม่มี tense shift ที่ถูกต้องเมื่อพูดถึงอดีต',
      'ไม่ใช้ subordinating conjunction หรือใช้ผิด',
      'มี grammar error มากกว่า 5 ครั้งและเริ่มรบกวนความเข้าใจ'
    ],
    4: [
      'มี simple tense error',
      'ไม่มี tense shift ที่ถูกต้องเมื่อพูดถึงอดีต',
      'ไม่ใช้ subordinating conjunction หรือใช้ผิด',
      'มี grammar error มากกว่า 5 ครั้งและรบกวนความเข้าใจชัดเจน'
    ]
  },
  lexical: {
    9: [
      'มี collocation มากกว่า 6 คำในระดับ B1 ขึ้นไป',
      'มี collocation ระดับ C1-C2 อย่างน้อย 2 คำ',
      'ไม่มี lexical choice ที่ผิดหรือฟังแปลกหูเลย'
    ],
    8: [
      'มี collocation มากกว่า 4-5 คำในระดับ B1 ขึ้นไป',
      'มี collocation ระดับ C1-C2 อย่างน้อย 1 คำ',
      'ไม่มี lexical choice ที่ผิดหรือฟังแปลกหูเลย'
    ],
    7: [
      'มี collocation มากกว่า 2-5 คำในระดับ B1 ขึ้นไป',
      'ไม่มี lexical error สำคัญ',
      'มีคำที่ฟังแปลกหูได้ไม่เกิน 3 ครั้ง'
    ],
    6: [
      'collocation และคำศัพท์ส่วนใหญ่อยู่ระดับ A2-B1',
      'มีคำที่ฟังแปลกหูและ lexical error ตลอดการพูด',
      'ยังพอเข้าใจความหมายได้'
    ],
    5: [
      'collocation และคำศัพท์ส่วนใหญ่อยู่ระดับ A2-B1',
      'มีคำที่ฟังแปลกหูและ lexical error ตลอดการพูด',
      'มีประโยคที่เข้าใจไม่ได้มากกว่า 2-3 ประโยค'
    ],
    4: [
      'collocation และคำศัพท์ส่วนใหญ่อยู่ระดับ A1-B1',
      'มีคำที่ฟังแปลกหูและ lexical error ตลอดการพูด',
      'มีประโยคที่เข้าใจไม่ได้มากกว่า 3 ประโยค'
    ]
  },
  fluency: {
    9: [
      'ใช้ referencing มากกว่า 4 ครั้งและถูกต้อง',
      'ไม่มี hesitation หรือ self-correction',
      `พูดได้อย่างน้อย ${PART2_FLUENCY_WORD_COUNTS.band9Min} คำ`
    ],
    8: [
      'ใช้ referencing มากกว่า 3 ครั้งและถูกต้อง',
      'ถ้ามี self-correction ต้องแก้ได้ถูกต้อง',
      `พูดได้อย่างน้อย ${PART2_FLUENCY_WORD_COUNTS.band8Min} คำ`
    ],
    7: [
      `พูดได้อย่างน้อย ${PART2_FLUENCY_WORD_COUNTS.band7Min} คำ`,
      'ใช้ referencing อย่างน้อย 2 ครั้งได้อย่างถูกต้อง',
      'ถ้ามี self-correction ต้องแก้ได้ถูกต้อง'
    ],
    6: [
      `พูดได้ ${PART2_FLUENCY_WORD_COUNTS.band6Min}-${PART2_FLUENCY_WORD_COUNTS.band6Max} คำ`,
      'ไม่มี referencing หรือใช้แล้วยังผิดบางครั้ง',
      'ถ้ามี self-correction บางครั้งยังแก้ผิดอยู่'
    ],
    5: [
      `พูดได้น้อยกว่า ${PART2_FLUENCY_WORD_COUNTS.band6Min} คำ`,
      'ไม่มี referencing หรือใช้แล้วผิดบ่อย',
      'self-correction ส่วนใหญ่ยังผิดอยู่มากกว่า 50%'
    ],
    4: [
      `พูดได้น้อยกว่า ${PART2_FLUENCY_WORD_COUNTS.band6Min} คำ`,
      'ไม่มี referencing หรือใช้แล้วผิดแทบทั้งหมด',
      'self-correction มักผิดมากกว่า 70%'
    ]
  }
}

const PASSIVE_VOICE_PART3_REQUIREMENTS = {
  9: 'ใช้ passive voice ได้ถูกต้องอย่างน้อย 3 ครั้ง',
  8: 'ใช้ passive voice ได้ถูกต้องอย่างน้อย 2 ครั้ง',
  7: 'ใช้ passive voice ได้ถูกต้องอย่างน้อย 1 ครั้ง'
}

const PART2_GRAMMAR_REQUIREMENTS = {
  7: [
    'ใช้ simple tense ได้อย่างถูกต้อง',
    'ใช้ subordinating conjunction',
    'มี grammar mistakes ที่ไม่รบกวนความเข้าใจได้ไม่เกิน 3 ครั้ง'
  ]
}

const PART13_LEXICAL_REQUIREMENTS = {
  9: [
    'มี collocation อย่างน้อย 10 คำที่ใช้ได้เป็นธรรมชาติ',
    'มีคำศัพท์ระดับ C1-C2 อย่างน้อย 5 คำ',
    'ไม่มี lexical choice ที่ผิดหรือฟังแปลกหูเลย'
  ]
}

const FULL_MOCK_WHOLE_CHECKLIST_REQUIREMENTS = {
  grammar: {
    9: [
      'ใช้ประโยคเงื่อนไข (Conditionals / If-clauses) ได้อย่างถูกต้อง',
      'ใช้โครงสร้างถูกกระทำ (Passive Voice) มากกว่า 5 ครั้ง',
      'ใช้โครงสร้าง Perfect Tense ได้อย่างถูกต้อง',
      'ไม่มีข้อผิดพลาดทางไวยากรณ์เลยแม้แต่น้อย (0 Mistakes)',
      'ใช้คำสันธานเชื่อมประโยคย่อย (Subordinating conjunctions เช่น although, unless, whereas) ได้ถูกต้อง',
      'มีการใช้วลีบุพบท (Prepositional phrase เช่น in light of this, on top of that) อย่างน้อย 1 ครั้ง',
      'มีการใช้ประโยคขยายความด้วย "which" (รูปแบบ: ประโยคหลัก + , which...) อย่างน้อย 1 ครั้ง'
    ],
    8: [
      'ใช้ประโยคเงื่อนไข (Conditionals) ได้อย่างถูกต้อง',
      'ใช้โครงสร้างถูกกระทำ (Passive Voice) มากกว่า 2 ครั้ง',
      'ใช้โครงสร้าง Perfect Tense ได้อย่างถูกต้อง',
      'ไม่มีข้อผิดพลาดทางไวยากรณ์เลย (0 Mistakes)',
      'ใช้คำสันธานเชื่อมประโยคย่อย (Subordinating conjunctions) ได้ถูกต้อง'
    ],
    7: [
      'ใช้โครงสร้างพื้นฐาน (Simple tenses: Present, Past) ได้อย่างแม่นยำและ ไม่มีข้อผิดพลาด',
      'ใช้โครงสร้างถูกกระทำ (Passive Voice) อย่างน้อย 1 ครั้ง',
      'อนุโลมให้มีข้อผิดพลาดทางไวยากรณ์ย่อยๆ ได้ ไม่เกิน 3 จุด (เช่น ลืมเติม s/es หรือผิดเรื่องเอกพจน์/พหูพจน์)',
      'ใช้คำสันธานเชื่อมประโยคย่อย (Subordinating conjunctions) ได้'
    ],
    6: [
      'มีข้อผิดพลาดทางไวยากรณ์ปรากฏให้เห็นตลอดการพูด แต่ ไม่เป็นอุปสรรคต่อความเข้าใจ (ผู้ฟังยังสามารถเข้าใจเจตนาของผู้พูดได้อย่างชัดเจน แม้ไวยากรณ์จะผิด)'
    ],
    5: [
      'มีข้อผิดพลาดทางไวยากรณ์ตลอดการพูด และมีมากกว่า 30% ของข้อผิดพลาดที่ ทำให้สื่อความหมายผิดเพี้ยน (สร้างความเข้าใจผิดหรือไม่สามารถสื่อสารเจตนาได้)'
    ],
    4: [
      'มีข้อผิดพลาดทางไวยากรณ์ตลอดการพูด และมีมากกว่า 50% ของข้อผิดพลาดที่ เป็นอุปสรรคต่อการสื่อสารอย่างรุนแรง (ผู้ฟังไม่สามารถเข้าใจเจตนาได้เลย)'
    ]
  },
  lexical: {
    9: [
      'ใช้กลุ่มคำที่มักใช้คู่กัน (Collocations) ในระดับ B2-C2 อย่างน้อย 6 กลุ่มคำ',
      'ใช้คำศัพท์ระดับวิชาการขั้นสูง (C2 level) อย่างน้อย 4 คำ',
      'ไม่มี การใช้คำศัพท์ที่ฟังดูขัดหู/ไม่เป็นธรรมชาติ (No awkward use) และไม่มีการใช้คำผิดบริบทเลย'
    ],
    8: [
      'ใช้กลุ่มคำที่มักใช้คู่กัน (Collocations) ในระดับ B2-C2 อย่างน้อย 6 กลุ่มคำ',
      'ใช้คำศัพท์ระดับวิชาการขั้นสูง (C2 level) อย่างน้อย 2 คำ',
      'ไม่มี การใช้คำศัพท์ที่ฟังดูขัดหู/ไม่เป็นธรรมชาติ และไม่มีการใช้คำผิดบริบท'
    ],
    7: [
      'ใช้กลุ่มคำที่มักใช้คู่กัน (Collocations) ในระดับ B1 ขึ้นไป อย่างน้อย 6 กลุ่มคำ',
      'ไม่มี การใช้คำผิดความหมาย (Wrong use) แต่อาจอนุโลมให้มีการใช้คำที่ฟังดูไม่เป็นธรรมชาติ (Awkwardness) ได้สูงสุด 3 จุด'
    ],
    6: [
      'ใช้คำศัพท์พื้นฐานทั่วไปเป็นหลัก',
      'มีข้อผิดพลาดในการเลือกใช้คำตลอดการพูด แต่ข้อผิดพลาดนั้น ไม่เป็นอุปสรรคต่อความเข้าใจ (ผู้ฟังยังเดาเจตนาได้)'
    ],
    5: [
      'ใช้คำศัพท์พื้นฐานทั่วไปเป็นหลัก',
      'มีข้อผิดพลาดในการเลือกใช้คำที่ ทำให้ผู้ฟังงงหรือไม่เข้าใจ สูงสุด 5 จุด'
    ],
    4: [
      'ใช้คำศัพท์พื้นฐานทั่วไปเป็นหลัก',
      'มีข้อผิดพลาดในการเลือกใช้คำที่ ทำให้ผู้ฟังงงหรือไม่เข้าใจ มากกว่า 5 จุดขึ้นไป'
    ]
  },
  fluency: {
    9: [
      'ใช้คำอ้างอิงถึงสิ่งที่พูดไปแล้ว (Referencing เช่น this, that, those, such method) มากกว่า 5 ครั้ง เพื่อเชื่อมโยงเนื้อหาให้ลื่นไหล',
      'ใช้คำเชื่อมประโยค (Transitional words) ได้อย่างถูกต้องและเหมาะสมอย่างน้อย 3 คำ',
      'ไม่มีการชะงักหยุดคิด (No hesitation) และ ไม่มีการพูดแก้คำผิดตัวเอง (No self-correction) ในระดับที่ทำให้เสียจังหวะ',
      'ไม่มีความกำกวมเลย ทั้งในด้านการใช้คำศัพท์และไวยากรณ์',
      'ทุกคำถาม มีการอธิบายขยายความ และ/หรือ มีการยกตัวอย่างสนับสนุนแนวคิดอย่างชัดเจน'
    ],
    8: [
      'ใช้คำอ้างอิงถึงสิ่งที่พูดไปแล้ว (Referencing) มากกว่า 5 ครั้ง',
      'ใช้คำเชื่อมประโยค (Transitional words) ได้อย่างถูกต้องและเหมาะสมอย่างน้อย 3 คำ',
      'หากมีการพูดแก้คำผิดตัวเอง (Self-correction) การแก้คำผิดนั้น ต้องถูกต้องเสมอ',
      'ไม่มีความกำกวมเลย ทั้งในด้านการใช้คำศัพท์และไวยากรณ์',
      'ทุกคำถาม มีการอธิบายขยายความ และ/หรือ มีการยกตัวอย่างสนับสนุน'
    ],
    7: [
      'ใช้คำอ้างอิงถึงสิ่งที่พูดไปแล้ว (Referencing) มากกว่า 3 ครั้ง',
      'ใช้คำเชื่อมประโยค (Transitional words) อย่างน้อย 2 คำ',
      'หากมีการพูดแก้คำผิดตัวเอง (Self-correction) การแก้คำผิดนั้นมักจะถูกต้อง (อนุโลมให้แก้แล้วผิดได้สูงสุดเพียง 1 ครั้ง)',
      'ไม่มีความกำกวม ทั้งในด้านคำศัพท์และไวยากรณ์',
      'คำถาม ส่วนใหญ่ (ไม่จำเป็นต้องทุกข้อ) มีการอธิบายขยายความหรือยกตัวอย่างสนับสนุน หรือในบางครั้งอาจจะตอบกว้างๆ เกินไปบ้าง (Generalized)'
    ],
    6: [
      'ใช้คำอ้างอิงถึงสิ่งที่พูดไปแล้ว (Referencing) มากกว่า 3 ครั้ง',
      'หากมีการพูดแก้คำผิดตัวเอง การแก้คำผิดนั้น มักจะทำได้ไม่ถูกต้อง (มีข้อผิดพลาดตั้งแต่ 2 ครั้งขึ้นไป)',
      'มีความกำกวมในการใช้ศัพท์หรือไวยากรณ์บ้าง แต่ ไม่เป็นอุปสรรคต่อความเข้าใจ',
      'คำถาม ส่วนใหญ่ มีการให้เหตุผลประกอบ แต่บางครั้งคำตอบก็กว้างเกินไปและขาดรายละเอียดที่ชัดเจน'
    ],
    5: [
      'หากมีการพูดแก้คำผิดตัวเอง การแก้คำผิดนั้น ผิดพลาดเป็นส่วนใหญ่ (ตั้งแต่ 4 ครั้งขึ้นไป)',
      'มีความกำกวมในการใช้ศัพท์หรือไวยากรณ์ ซึ่ง เป็นอุปสรรคต่อความเข้าใจ (ทำให้ผู้ฟังไม่ชัดเจนในเนื้อหาหรือเข้าใจเจตนาผิด)',
      'ขาดการสนับสนุนแนวคิด (ไม่มีการให้เหตุผลที่สมเหตุสมผล หรือไม่มีการยกตัวอย่างประกอบ)'
    ],
    4: [
      'หากมีการพูดแก้คำผิดตัวเอง การแก้คำผิดนั้น มักจะผิดพลาดแทบทั้งหมด (มากกว่า 50%)',
      'มีความกำกวมในการใช้ศัพท์หรือไวยากรณ์อย่างหนัก จนไม่สามารถสื่อสารเจตนาได้',
      'ขาดการสนับสนุนแนวคิดและรายละเอียดโดยสิ้นเชิง'
    ]
  }
}

const applyRequirementTextBank = ({ requiredTicks, requirementBank }) => {
  const ticks = Array.isArray(requiredTicks) ? requiredTicks : []
  const bank = Array.isArray(requirementBank) ? requirementBank : []
  if (!bank.length) return ticks
  return bank.map((requirement, index) => ({
    requirement,
    isMet: ticks[index]?.isMet ?? true,
    evidence: Array.isArray(ticks[index]?.evidence) ? ticks[index].evidence : []
  }))
}

const buildStandardChecklistTicks = ({
  criterion,
  band,
  testMode,
  totalWords,
  avgWordsPerQuestion,
  questionModeSignals
}) => {
  const key = String(criterion || '').toLowerCase()
  const roundedBand = Math.max(4, Math.min(9, Math.floor(Number(band) || 0)))
  if (key === 'fluency' && (testMode === 'part3' || testMode === 'part1') && questionModeSignals) {
    return buildQuestionModeFluencyRequiredTicks({
      band: roundedBand,
      signals: questionModeSignals,
      punctuatedTranscript: questionModeSignals.punctuatedTranscript || '',
      questionBreakdown: questionModeSignals.questionBreakdown || []
    })
  }
  const items =
    key === 'lexical' && (testMode === 'part1' || testMode === 'part3') && PART13_LEXICAL_REQUIREMENTS[roundedBand]
      ? PART13_LEXICAL_REQUIREMENTS[roundedBand]
      : STANDARD_CHECKLIST_REQUIREMENTS[key]?.[roundedBand] || []
  const adjustedItems =
    key === 'grammar' && testMode === 'part3' && PASSIVE_VOICE_PART3_REQUIREMENTS[roundedBand]
      ? [...items, PASSIVE_VOICE_PART3_REQUIREMENTS[roundedBand]]
      : items
  const evidence = []
  if (key === 'fluency') {
    if (testMode === 'part3' || testMode === 'part1') evidence.push(`avgWordsPerQuestion=${avgWordsPerQuestion}`)
    if (testMode === 'part2') evidence.push(`totalWords=${totalWords}`)
  }
  return adjustedItems.map((requirement) => ({
    requirement,
    isMet: true,
    evidence
  }))
}

const buildNextAttemptFocusThai = ({ testMode, criteria, componentReports, questionBreakdown }) => {
  if (testMode === 'part1') {
    if (Number(criteria?.grammar || 0) <= 6) {
      return 'โฟกัสรอบถัดไป: แก้การใช้ article และโครงสร้างประโยคสั้น ๆ ให้แม่นขึ้นในทุกคำตอบ'
    }
    return 'โฟกัสรอบถัดไป: ขยายคำตอบสั้น ๆ ด้วยเหตุผล 1 ข้อและรายละเอียดเพิ่มอีก 1 ประโยค'
  }

  if (testMode === 'part3') {
    const weakFluency = Number(criteria?.fluency || 0) <= 6
    const weakGrammar = Number(criteria?.grammar || 0) <= 6.5
    if (weakFluency || weakGrammar) {
      return 'โฟกัสรอบถัดไป: ขยายทุกคำตอบด้วยเหตุผล 1 ข้อและตัวอย่าง 1 ข้อให้ครบก่อนจบคำตอบ'
    }
    return 'โฟกัสรอบถัดไป: เพิ่ม transitional words และเชื่อมเหตุผลกับตัวอย่างให้ลื่นไหลขึ้น'
  }

  if (testMode === 'part2') {
    if (Number(componentReports?.fluency?.band || criteria?.fluency || 0) <= 6) {
      return 'โฟกัสรอบถัดไป: เล่าให้ต่อเนื่องขึ้นโดยเรียงเหตุการณ์ให้ชัด แล้วปิดท้ายด้วยความรู้สึกหรือข้อสรุป'
    }
    return 'โฟกัสรอบถัดไป: เพิ่มรายละเอียดเฉพาะเจาะจงและตัวอย่างจริงเพื่อให้เรื่องเล่าดูน่าสนใจขึ้น'
  }

  if (Array.isArray(questionBreakdown) && questionBreakdown.length > 0) {
    return 'โฟกัสรอบถัดไป: ขยายแต่ละคำตอบด้วยเหตุผล 1 ข้อและตัวอย่าง 1 ข้อ'
  }

  return 'โฟกัสรอบถัดไป: พูดให้ชัดขึ้นและเพิ่มรายละเอียดสนับสนุนในแต่ละประเด็นสำคัญ'
}

const buildPart3AnswerCoaching = (questionBreakdown) => {
  const items = Array.isArray(questionBreakdown) ? questionBreakdown : []

  return items
    .map((item) => {
      const answer = String(item?.punctuatedTranscript || item?.rawTranscript || '').trim()
      const words = countWords(answer)
      const missing = []
      if (words < 22 || !explanationPattern.test(answer)) {
        missing.push('lack explanation')
      }
      if (words < 30 || !examplePattern.test(answer)) {
        missing.push('lack example')
      }
      if (words < 26 || !transitionPattern.test(answer)) {
        missing.push('lack transtional words')
      }
      if (missing.length === 0) return null

      const suggestionParts = []
      if (missing.includes('lack explanation')) {
        suggestionParts.push('เติมประโยคเหตุผลด้วย because / since เพื่อขยายความคิดหลักให้ชัดขึ้น')
      }
      if (missing.includes('lack example')) {
        suggestionParts.push('ตามด้วยตัวอย่างสั้น ๆ เช่น for example เพื่อให้คำตอบจับต้องได้')
      }
      if (missing.includes('lack transtional words')) {
        suggestionParts.push('เชื่อมประโยคด้วย however, moreover, as a result หรือ in addition เพื่อให้คำตอบลื่นขึ้น')
      }

      return {
        question: String(item?.question || 'Question'),
        missing: missing.slice(0, 3),
        suggestionThai: suggestionParts.join(' | ')
      }
    })
    .filter(Boolean)
    .slice(0, 5)
}

const normalizeCustomVocabularySuggestions = (payload, questionBreakdown, punctuatedTranscript = '') => {
  const items = Array.isArray(payload?.suggestions) ? payload.suggestions : []
  const breakdown = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const normalizedFullText = String(punctuatedTranscript || '').toLowerCase()
  return items
    .map((item) => {
      const sourceQuestionIndex = Number.isFinite(Number(item?.sourceQuestionIndex))
        ? Number(item.sourceQuestionIndex)
        : -1
      const sourceQuestion = String(
        item?.sourceQuestion || (sourceQuestionIndex >= 0 ? breakdown[sourceQuestionIndex]?.question || '' : '')
      ).trim()
      const sourcePhrase = String(item?.sourcePhrase || '').trim()
      const replacement = String(item?.replacement || '').trim()
      const level = String(item?.level || '').trim().toUpperCase()
      const thaiMeaning = String(item?.thaiMeaning || '').trim()
      const reasonThai = String(item?.reasonThai || '').trim()
      const answerText =
        sourceQuestionIndex >= 0
          ? String(breakdown[sourceQuestionIndex]?.punctuatedTranscript || breakdown[sourceQuestionIndex]?.rawTranscript || '')
          : String(punctuatedTranscript || '')
      if (!sourcePhrase || !replacement || !thaiMeaning || !reasonThai) return null
      if (answerText && !answerText.toLowerCase().includes(sourcePhrase.toLowerCase())) return null
      if (normalizedFullText && !normalizedFullText.includes(sourcePhrase.toLowerCase())) return null
      return {
        sourceQuestionIndex,
        sourceQuestion,
        sourcePhrase,
        replacement,
        level: level || 'B1',
        thaiMeaning: normalizeThaiRegisterText(thaiMeaning),
        reasonThai: normalizeThaiRegisterText(reasonThai)
      }
    })
    .filter(Boolean)
}

const normalizeTranscriptAnnotations = (payload, questionBreakdown) => {
  const groups = Array.isArray(payload?.items) ? payload.items : []
  const breakdown = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const map = new Map()

  for (const group of groups) {
    const questionIndex = Number(group?.questionIndex)
    if (!Number.isFinite(questionIndex) || questionIndex < 0 || questionIndex >= breakdown.length) continue
    const answerText = String(breakdown[questionIndex]?.punctuatedTranscript || breakdown[questionIndex]?.rawTranscript || '')
    const annotations = (Array.isArray(group?.annotations) ? group.annotations : [])
      .map((item) => {
        const label = String(item?.label || '').trim()
        const issueType = String(item?.issueType || '').trim().toLowerCase()
        const highlightText = String(item?.highlightText || '').trim()
        const commentThai = String(item?.commentThai || '').trim()
        if (!label || !issueType || !highlightText || !commentThai) return null
        if (!answerText.toLowerCase().includes(highlightText.toLowerCase())) return null
        return { label, issueType, highlightText, commentThai }
      })
      .filter(Boolean)
      .slice(0, 3)

    map.set(questionIndex, annotations)
  }

  return breakdown.map((item, index) => ({
    ...item,
    annotations: map.get(index) || []
  }))
}

const buildCustomVocabularySuggestions = async ({
  testMode,
  punctuatedTranscript,
  questionBreakdown,
  usageTracker
}) => {
  try {
    const payload = await callGeminiCleanupJson(
      customVocabularyLiftPrompt({
        testMode,
        punctuatedTranscript,
        questionBreakdown
      }),
      usageTracker
    )
    return normalizeCustomVocabularySuggestions(payload, questionBreakdown, punctuatedTranscript).slice(0, 12)
  } catch {
    return []
  }
}

const buildTranscriptAnnotations = async ({
  testMode,
  questionBreakdown,
  part3AnswerCoaching,
  componentReports,
  usageTracker
}) => {
  const breakdown = Array.isArray(questionBreakdown) ? questionBreakdown : []
  if (!breakdown.length) return breakdown
  try {
    const payload = await callGeminiCleanupJson(
      transcriptAnnotationPrompt({
        testMode,
        questionBreakdown: breakdown,
        part3AnswerCoaching,
        componentReports
      }),
      usageTracker
    )
    return normalizeTranscriptAnnotations(payload, breakdown)
  } catch {
    return breakdown.map((item) => ({ ...item, annotations: [] }))
  }
}

const buildTopFixesFromReport = ({ componentReports, questionBreakdown, vocabularyLevelUpSuggestions, punctuatedTranscript }) => {
  const fixes = []
  const breakdown = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const vocabSuggestions = Array.isArray(vocabularyLevelUpSuggestions) ? vocabularyLevelUpSuggestions : []
  const transcriptText = String(punctuatedTranscript || '').trim()

  const grammarAnnotation = breakdown
    .flatMap((item, index) =>
      (Array.isArray(item?.annotations) ? item.annotations : [])
        .filter((annotation) => annotation?.issueType === 'grammar' && annotation?.highlightText)
        .map((annotation) => ({
          questionLabel: item?.question ? `Q${index + 1}: ${item.question}` : `Q${index + 1}`,
          annotation
        }))
    )
    .find(Boolean)

  if (grammarAnnotation) {
    fixes.push({
      label: 'Grammar',
      title: `${grammarAnnotation.questionLabel} -> "${grammarAnnotation.annotation.highlightText}"`,
      detail: grammarAnnotation.annotation.commentThai
    })
  } else {
    const firstGrammarPlan = componentReports?.grammar?.plusOnePlan?.[0] || componentReports?.grammar?.plusOneChecklist?.[0]
    if (firstGrammarPlan?.quote && firstGrammarPlan?.fix) {
      fixes.push({
        label: 'Grammar',
        title: firstGrammarPlan.quote,
        detail: firstGrammarPlan.fix
      })
    }
  }

  const firstVocab = vocabSuggestions[0]
  if (firstVocab?.sourcePhrase && firstVocab?.replacement) {
    fixes.push({
      label: 'Vocabulary',
      title: `"${firstVocab.sourcePhrase}" -> "${firstVocab.replacement}"`,
      detail: firstVocab.reasonThai || `ลองใช้ "${firstVocab.replacement}" ให้เป็นธรรมชาติมากขึ้น`
    })
  } else {
    const firstLexicalPlan = componentReports?.lexical?.plusOnePlan?.[0] || componentReports?.lexical?.plusOneChecklist?.[0]
    if (firstLexicalPlan?.quote && firstLexicalPlan?.fix) {
      fixes.push({
        label: 'Vocabulary',
        title: firstLexicalPlan.quote,
        detail: firstLexicalPlan.fix
      })
    }
  }

  const fluencyAnnotations = breakdown
    .flatMap((item, index) =>
      (Array.isArray(item?.annotations) ? item.annotations : [])
        .filter((annotation) =>
          ['explanation', 'example', 'fluency'].includes(String(annotation?.issueType || '').toLowerCase())
        )
        .map((annotation) => ({
          questionLabel: item?.question ? `Q${index + 1}: ${item.question}` : `Q${index + 1}`,
          highlightText: String(annotation?.highlightText || '').trim()
        }))
    )
    .filter((item) => item.highlightText)
    .slice(0, 3)

  if (fluencyAnnotations.length > 0) {
    fixes.push({
      label: 'Fluency',
      title: fluencyAnnotations.map((item) => `${item.questionLabel} -> "${item.highlightText}"`).join(' | '),
      detail: 'ต้องขยายความโดยการ give reasons + examples'
    })
  } else {
    const transcriptFluencyQuotes = transcriptText
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .filter((sentence) => !examplePattern.test(sentence) && !explanationPattern.test(sentence))
      .slice(0, 3)

    if (transcriptFluencyQuotes.length > 0) {
      fixes.push({
        label: 'Fluency',
        title: transcriptFluencyQuotes.map((item) => `"${item}"`).join(' | '),
        detail: 'ต้องขยายความโดยการ give reasons + examples'
      })
    } else {
      const firstFluencyPlan = componentReports?.fluency?.plusOnePlan?.[0] || componentReports?.fluency?.plusOneChecklist?.[0]
      if (firstFluencyPlan?.quote && firstFluencyPlan?.fix) {
        fixes.push({
          label: 'Fluency',
          title: firstFluencyPlan.quote,
          detail: firstFluencyPlan.fix
        })
      }
    }
  }

  if (fixes.length < 3) {
    const fallbackGrammarPlan = componentReports?.grammar?.plusOnePlan?.[0]
    if (
      fallbackGrammarPlan?.quote &&
      fallbackGrammarPlan?.fix &&
      !fixes.some((item) => item.label === 'Grammar')
    ) {
      fixes.push({
        label: 'Grammar',
        title: fallbackGrammarPlan.quote,
        detail: fallbackGrammarPlan.fix
      })
    }
  }

  return fixes.slice(0, 3)
}

const buildFinalReport = async ({
  result,
  testMode,
  pronunciationBand,
  punctuatedTranscript,
  punctuationErrors,
  questionBreakdown
}) => {
  const normalizedQuestionBreakdown = Array.isArray(questionBreakdown) ? questionBreakdown : []
  const useQuestionModeFluencyRubric =
    normalizedQuestionBreakdown.length > 0 && (testMode === 'part1' || testMode === 'part3')
  let fluencyOverrideInfo = null
  let questionModeFluencySignals = null
  let modelFluencyGuard = null
  if (useQuestionModeFluencyRubric) {
    questionModeFluencySignals = buildQuestionModeFluencySignals({
      questionBreakdown: normalizedQuestionBreakdown,
      analysisSignals: result.analysisSignals
    })
    const fluencyBand = buildQuestionModeFluencyBand({
      avgWordsPerQuestion: questionModeFluencySignals.avgWordsPerQuestion,
      testMode,
      signals: questionModeFluencySignals
    })
    fluencyOverrideInfo = {
      fluencyBand,
      avgWordsPerQuestion: questionModeFluencySignals.avgWordsPerQuestion,
      totalWordsAcrossQuestions: questionModeFluencySignals.totalWordsAcrossQuestions
    }
  }

  if (!fluencyOverrideInfo) {
    modelFluencyGuard = applyFluencyMeaningFloor({
      band: result.criteria?.fluency,
      analysisSignals: result.analysisSignals
    })
  }

  const nextCriteria = {
    ...result.criteria,
    fluency: fluencyOverrideInfo ? fluencyOverrideInfo.fluencyBand : modelFluencyGuard?.band ?? result.criteria.fluency,
    pronunciation: pronunciationBand
  }
  const rawThreeComponentAverage = (nextCriteria.fluency + nextCriteria.lexical + nextCriteria.grammar) / 3
  const totalScore = clampBand(roundToHalfBand(rawThreeComponentAverage))
  const reportCriteria = {
    fluency: nextCriteria.fluency,
    lexical: nextCriteria.lexical,
    grammar: nextCriteria.grammar
  }

  const componentReports = {
    grammar: normalizeComponentReport(result.componentReports?.grammar, nextCriteria.grammar),
    lexical: normalizeComponentReport(result.componentReports?.lexical, nextCriteria.lexical),
    fluency: normalizeComponentReport(
      sanitizeFluencyReport(result.componentReports?.fluency),
      nextCriteria.fluency
    )
  }

  if (testMode === 'full') {
    ;(['grammar', 'lexical', 'fluency']).forEach((key) => {
      const roundedBand = Math.max(4, Math.min(9, Math.floor(Number(componentReports[key].band) || 0)))
      const thaiBank = FULL_MOCK_WHOLE_CHECKLIST_REQUIREMENTS[key]?.[roundedBand] || []
      componentReports[key].requiredTicks = applyRequirementTextBank({
        requiredTicks: componentReports[key].requiredTicks,
        requirementBank: thaiBank
      })
      componentReports[key].requiredTicks = ensureQuotedTickEvidence({
        requiredTicks:
          componentReports[key].requiredTicks.length > 0
            ? componentReports[key].requiredTicks
            : thaiBank.map((requirement) => ({ requirement, isMet: true, evidence: [] })),
        punctuatedTranscript,
        questionBreakdown: normalizedQuestionBreakdown
      })
    })
  }

  if (modelFluencyGuard?.floorApplied) {
    componentReports.fluency = normalizeComponentReport(
      {
        ...componentReports.fluency,
        band: modelFluencyGuard.band,
        explanationThai: `${componentReports.fluency.explanationThai} แม้จะมี grammar mistake หลายจุด แต่ความหมายโดยรวมยังเข้าใจได้และ intent ยังไม่เพี้ยน จึงไม่กด fluency ต่ำกว่า Band 6 ครับ`
      },
      nextCriteria.fluency
    )
  }

  if (fluencyOverrideInfo) {
    const fluencyEvidenceLabel =
      questionModeFluencySignals && (testMode === 'part3' || testMode === 'part1')
        ? buildQuestionModeFluencyExplanationThai({
            testMode,
            band: fluencyOverrideInfo.fluencyBand,
            signals: questionModeFluencySignals
          })
        : testMode === 'part3'
          ? `เกณฑ์พิเศษ Part 3: คิดจากจำนวนคำเฉลี่ยต่อคำถาม = ${fluencyOverrideInfo.avgWordsPerQuestion} คำ`
          : `เกณฑ์พิเศษ Part 1: คิดจากจำนวนคำเฉลี่ยต่อคำถาม = ${fluencyOverrideInfo.avgWordsPerQuestion} คำ`
    componentReports.fluency = normalizeComponentReport(
      {
        ...componentReports.fluency,
        band: fluencyOverrideInfo.fluencyBand,
        explanationThai: fluencyEvidenceLabel,
        requiredTicks:
          questionModeFluencySignals && (testMode === 'part3' || testMode === 'part1')
            ? buildQuestionModeFluencyRequiredTicks({
                band: fluencyOverrideInfo.fluencyBand,
                signals: questionModeFluencySignals,
                punctuatedTranscript,
                questionBreakdown: normalizedQuestionBreakdown
              })
            : testMode === 'part3'
            ? [
                {
                  requirement: 'Band 9: เฉลี่ย >= 70 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 70,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 8: เฉลี่ย >= 60 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 60,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 7: เฉลี่ย >= 50 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 50,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 6: เฉลี่ย 40-49 คำ/คำถาม',
                  isMet:
                    fluencyOverrideInfo.avgWordsPerQuestion >= 40 &&
                    fluencyOverrideInfo.avgWordsPerQuestion < 50,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 5: เฉลี่ย 4-39 คำ/คำถาม',
                  isMet:
                    fluencyOverrideInfo.avgWordsPerQuestion >= 4 &&
                    fluencyOverrideInfo.avgWordsPerQuestion < 40,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 4: เฉลี่ย < 4 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion < 4,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                }
              ]
            : [
                {
                  requirement: 'Band 9: เฉลี่ย >= 210 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 210,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 8: เฉลี่ย >= 190 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 190,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 7: เฉลี่ย >= 160 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion >= 160,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 6: เฉลี่ย 120-159 คำ/คำถาม',
                  isMet:
                    fluencyOverrideInfo.avgWordsPerQuestion >= 120 &&
                    fluencyOverrideInfo.avgWordsPerQuestion < 160,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 5: เฉลี่ย 100-119 คำ/คำถาม',
                  isMet:
                    fluencyOverrideInfo.avgWordsPerQuestion >= 100 &&
                    fluencyOverrideInfo.avgWordsPerQuestion < 120,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                },
                {
                  requirement: 'Band 4: เฉลี่ย < 100 คำ/คำถาม',
                  isMet: fluencyOverrideInfo.avgWordsPerQuestion < 100,
                  evidence: [`avg=${fluencyOverrideInfo.avgWordsPerQuestion}`]
                }
              ],
        plusOnePlan:
          questionModeFluencySignals && (testMode === 'part3' || testMode === 'part1')
            ? buildQuestionModeFluencyPlan(questionModeFluencySignals, fluencyOverrideInfo.fluencyBand)
            : [
                {
                  quote: `Average words per question: ${fluencyOverrideInfo.avgWordsPerQuestion}`,
                  fix: 'ขยายคำตอบแต่ละข้อด้วยเหตุผล + ตัวอย่างเฉพาะเจาะจง เพื่อเพิ่มจำนวนคำเฉลี่ยต่อคำถาม'
                }
              ]
      },
      nextCriteria.fluency
    )
  }

  componentReports.lexical.plusOnePlan = ensureLexicalUpgradePlans({
    plusOnePlan: componentReports.lexical.plusOnePlan,
    punctuatedTranscript
  })
  if (testMode !== 'full') {
    ;['grammar', 'lexical', 'fluency'].forEach((key) => {
      const existingTicks = componentReports[key].requiredTicks
      const fallbackTicks = buildStandardChecklistTicks({
        criterion: key,
        band: componentReports[key].band,
        testMode,
        totalWords: fluencyOverrideInfo?.totalWordsAcrossQuestions || countWords(punctuatedTranscript),
        avgWordsPerQuestion: fluencyOverrideInfo?.avgWordsPerQuestion || 0,
        questionModeSignals: questionModeFluencySignals
      })
      componentReports[key].requiredTicks = ensureQuotedTickEvidence({
        requiredTicks: existingTicks.length > 0 ? existingTicks : fallbackTicks,
        punctuatedTranscript,
        questionBreakdown: normalizedQuestionBreakdown
      })
    })
  }
  ;['grammar', 'lexical', 'fluency'].forEach((key) => {
    componentReports[key].plusOneChecklist = buildChecklistUnlockItems({
      criterion: key,
      currentBand: componentReports[key].band,
      testMode,
      punctuatedTranscript,
      questionBreakdown: normalizedQuestionBreakdown,
      plusOnePlan: componentReports[key].plusOnePlan
    })
  })
  const vocabularyLevelUpSuggestions = await buildCustomVocabularySuggestions({
    testMode,
    punctuatedTranscript,
    questionBreakdown: normalizedQuestionBreakdown
  })
  const nextAttemptFocusThai = buildNextAttemptFocusThai({
    testMode,
    criteria: reportCriteria,
    componentReports,
    questionBreakdown: normalizedQuestionBreakdown
  })
  const part3AnswerCoaching =
    testMode === 'part3' ? buildPart3AnswerCoaching(normalizedQuestionBreakdown) : []

  return normalizeThaiRegisterDeep({
    ...result,
    overallBand: totalScore,
    totalScore,
    rawFourComponentAverage: Number(rawThreeComponentAverage.toFixed(2)),
    criteria: reportCriteria,
    componentReports,
    nextAttemptFocusThai,
    part3AnswerCoaching,
    vocabularyLevelUpSuggestions,
    punctuatedTranscript,
    questionBreakdown: normalizedQuestionBreakdown,
    punctuationWarnings: punctuationErrors
  })
}

const normalizeTextOutput = (text) => String(text || '').trim()

const whisperTokensFromVerboseJson = (whisperJson) => {
  const segments = Array.isArray(whisperJson?.segments) ? whisperJson.segments : []
  const tokens = []
  for (const segment of segments) {
    const segmentText = String(segment.text || '').trim()
    if (!segmentText) continue
    const segmentWords = segmentText.split(/\s+/).filter(Boolean)
    const avgLogprob = Number(segment.avg_logprob ?? -1.2)
    for (const word of segmentWords) {
      tokens.push({ token: word, logprob: avgLogprob })
    }
  }
  return { tokens }
}

const estimatePronunciationFromTranscript = ({ transcript, whisperJson, durationSeconds }) => {
  const normalizeWord = (value) => String(value || '').replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, '').toLowerCase()
  const rawWords = String(transcript || '').trim().split(/\s+/).filter(Boolean)
  const normalizedWords = rawWords.map((word) => normalizeWord(word)).filter(Boolean)
  const totalWords = normalizedWords.length

  const fillerPhrases = new Set(['you know', 'i mean'])
  const fillerSingles = new Set(['um', 'uh', 'er', 'like', 'well', 'so'])
  const functionWords = new Set([
    'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'and', 'but', 'or', 'is', 'are',
    'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had'
  ])

  const filteredWords = []
  for (let i = 0; i < normalizedWords.length; i += 1) {
    const word = normalizedWords[i]
    const phrase = `${word} ${normalizedWords[i + 1] || ''}`.trim()
    if (fillerPhrases.has(phrase)) {
      i += 1
      continue
    }
    if (fillerSingles.has(word)) continue
    filteredWords.push(word)
  }

  const providedWords = Array.isArray(whisperJson?.words)
    ? whisperJson.words.map((item) => ({
        token: item.word,
        confidence: Number(item.confidence ?? 0.5)
      }))
    : []
  const tokens = providedWords.length
    ? providedWords
    : (whisperTokensFromVerboseJson(whisperJson).tokens || []).map((token) => ({
        token: token.token,
        confidence: Math.exp(Number(token.logprob ?? -2))
      }))
  const hasReliableWordConfidence = providedWords.length > 0
  const tokenConfidenceQueue = tokens
    .map((token) => {
      const word = normalizeWord(token.token)
      if (!word) return null
      return {
        word,
        confidence: Math.min(0.99, Math.max(0.01, Number(token.confidence ?? 0.5)))
      }
    })
    .filter(Boolean)

  const segments = Array.isArray(whisperJson?.segments) ? whisperJson.segments : []
  const averageSegmentConfidence =
    segments.length > 0
      ? Math.min(
          0.98,
          Math.max(
            0.6,
            segments.reduce((sum, segment) => sum + Math.exp(Number(segment.avg_logprob ?? -1.2)), 0) /
              segments.length
          )
        )
      : 0.72

  let tokenCursor = 0
  const contentWordEntries = filteredWords
    .map((word) => {
      const nextToken = tokenConfidenceQueue[tokenCursor]
      let confidence = averageSegmentConfidence
      if (nextToken) {
        confidence = nextToken.confidence
        tokenCursor += 1
      }
      return { word, confidence, isFunctionWord: functionWords.has(word) }
    })
    .filter((item) => !item.isFunctionWord)

  const contentWords = contentWordEntries.length
  const avgContentConfidence =
    contentWords > 0
      ? contentWordEntries.reduce((sum, item) => sum + Number(item.confidence), 0) / contentWords
      : 0

  const lowConfidenceEntries = contentWordEntries.filter((item) => item.confidence < 0.75)
  const criticalEntries = contentWordEntries.filter((item) => item.confidence < 0.5)
  const lowConfidenceContentWords = lowConfidenceEntries.length
  const criticalContentWords = criticalEntries.length
  const clarityIssueRate = contentWords > 0 ? lowConfidenceContentWords / contentWords : 1

  let estimatedPronunciationBand = 4.25
  if (avgContentConfidence >= 0.92 && criticalContentWords === 0 && clarityIssueRate < 0.03) {
    estimatedPronunciationBand = 8.5
  } else if (avgContentConfidence >= 0.86 && criticalContentWords <= 1 && clarityIssueRate < 0.07) {
    estimatedPronunciationBand = 7.25
  } else if (avgContentConfidence >= 0.76 && clarityIssueRate < 0.15) {
    estimatedPronunciationBand = 6.25
  } else if (avgContentConfidence >= 0.65 && clarityIssueRate < 0.25) {
    estimatedPronunciationBand = 5.25
  }

  if (!hasReliableWordConfidence) {
    // Without true per-word confidence data, keep estimate conservative.
    estimatedPronunciationBand = Math.min(6.0, estimatedPronunciationBand)
  }

  const missingContentWordCount = Math.max(0, contentWords - tokenConfidenceQueue.length)
  const lowConfidenceIssues = lowConfidenceEntries.slice(0, 120).map((item) => {
    const confidencePct = Math.round(item.confidence * 100)
    const isCritical = item.confidence < 0.5
    return {
      word: item.word,
      confidence: confidencePct,
      issueType: isCritical ? 'recognition_error' : 'likely_mispronounced',
      riskLevel: isCritical ? 'critical' : 'moderate',
      reason: isCritical
        ? 'possible pronunciation issue (word may be recognized incorrectly)'
        : 'possible clarity issue (low confidence content word)',
      advice:
        'Slow down slightly, stress key syllables, and repeat this word in short phrase practice.'
    }
  })

  const missingWordIssues = Array.from({ length: Math.min(20, missingContentWordCount) }).map((_, idx) => ({
    word: contentWordEntries[idx]?.word || 'content word',
    confidence: 0,
    issueType: 'missing_word',
    riskLevel: 'moderate',
    reason: 'possible unclear pronunciation or skipped word',
    advice: 'Keep a steady pace and fully pronounce word endings to improve word capture.'
  }))

  const allIssues = [...lowConfidenceIssues, ...missingWordIssues].slice(0, 120)
  const pronunciationIssueCount = Math.min(contentWords, allIssues.length)
  const pronunciationMistakeRate = contentWords > 0 ? pronunciationIssueCount / contentWords : 1
  const pronunciationMistakeRatePct = Number((pronunciationMistakeRate * 100).toFixed(1))

  const confidence = hasReliableWordConfidence
    ? avgContentConfidence >= 0.9
      ? 'high'
      : avgContentConfidence >= 0.78
        ? 'medium'
        : 'low'
    : 'low'

  return {
    wordCount: totalWords,
    pronunciationIssueCount,
    pronunciationMistakeRate: Number(pronunciationMistakeRate.toFixed(4)),
    estimatedPronunciationBand,
    mispronouncedOrUnclearWords: allIssues,
    confidence,
    note: hasReliableWordConfidence
      ? 'Speech Clarity Estimate from transcript confidence; possible clarity issues, not exact pronunciation diagnosis.'
      : 'Limited confidence data available from transcript provider; pronunciation estimate is conservative.',
    metrics: {
      totalWords,
      minorErrorRate: pronunciationMistakeRatePct,
      criticalErrorRate: Number(((criticalContentWords / Math.max(1, contentWords)) * 100).toFixed(1))
    },
    wordAnalysis: allIssues.map((item) => ({
      word: item.word,
      confidence: item.confidence,
      status: item.riskLevel === 'critical' ? 'critical' : 'minor'
    }))
  }
}

const estimatePronunciationBand = (whisperJson) => {
  const segments = Array.isArray(whisperJson?.segments) ? whisperJson.segments : []
  if (segments.length === 0) {
    return 5.5
  }

  const avgLogprob =
    segments.reduce((sum, segment) => sum + Number(segment.avg_logprob ?? -1.2), 0) /
    segments.length
  const noSpeechProb =
    segments.reduce((sum, segment) => sum + Number(segment.no_speech_prob ?? 0.15), 0) /
    segments.length
  const compressionRatio =
    segments.reduce((sum, segment) => sum + Number(segment.compression_ratio ?? 1.3), 0) /
    segments.length

  const logprobSignal = Math.min(1, Math.max(0, (avgLogprob + 1.4) / 1.3))
  const noSpeechSignal = Math.min(1, Math.max(0, 1 - noSpeechProb))
  const compressionSignal = Math.min(1, Math.max(0, 1.6 - compressionRatio))
  const combined = logprobSignal * 0.45 + noSpeechSignal * 0.35 + compressionSignal * 0.2

  return clampBand(4 + combined * 5)
}

const GEMINI_TRANSCRIPTION_MODELS = [
  process.env.GEMINI_TRANSCRIPTION_MODEL,
  'gemini-2.5-flash',
  'gemini-2.0-flash'
].filter(Boolean)

const normalizeAudioMimeType = (rawMimeType) => {
  const value = String(rawMimeType || '')
    .trim()
    .toLowerCase()
    .split(';')[0]
    .trim()
  if (!value) return 'audio/webm'
  if (value.startsWith('video/webm') || value.startsWith('video/x-matroska')) return 'audio/webm'
  if (value.startsWith('video/mp4') || value.startsWith('video/quicktime')) return 'audio/mp4'
  if (value.startsWith('video/ogg')) return 'audio/ogg'
  if (value === 'audio/mp3') return 'audio/mpeg'
  if (value === 'audio/x-wav') return 'audio/wav'
  if (value === 'audio/m4a') return 'audio/mp4'
  return value
}

const transcriptionMimeCandidates = (rawMimeType) => {
  const raw = String(rawMimeType || '')
    .trim()
    .toLowerCase()
    .split(';')[0]
    .trim()
  const normalized = normalizeAudioMimeType(rawMimeType)
  const candidates = [normalized]
  if (raw.startsWith('video/') && raw !== normalized) candidates.unshift(raw)
  if (normalized === 'audio/webm') candidates.push('audio/ogg', 'video/webm')
  if (normalized === 'audio/mp4') candidates.push('audio/mpeg', 'video/mp4')
  if (normalized === 'audio/mpeg') candidates.push('audio/mp4')
  if (normalized === 'audio/wav') candidates.push('audio/webm')
  if (normalized === 'audio/ogg') candidates.push('video/ogg')
  return [...new Set(candidates.filter(Boolean))]
}

const normalizeBase64AudioPayload = (value) =>
  String(value || '')
    .trim()
    .replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '')
    .replace(/\s+/g, '')

const extractGeminiTextFromPayload = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return normalizeTextOutput(
    parts
      .map((part) => String(part?.text || ''))
      .join('\n')
      .trim()
  )
}

const transcribeWithDeepgram = async ({ audioBase64, audioMimeType }) => {
  const apiKey = String(process.env.DEEPGRAM_API_KEY || '').trim()
  if (!apiKey) throw new Error('Missing DEEPGRAM_API_KEY for transcription')
  if (!audioBase64) throw new Error('No audio payload for transcription')

  const normalizedAudioBase64 = normalizeBase64AudioPayload(audioBase64)
  const audioBuffer = Buffer.from(normalizedAudioBase64, 'base64')
  if (!audioBuffer || audioBuffer.byteLength < 1024) {
    throw new Error('Audio payload too short for transcription')
  }
  const mimeCandidates = transcriptionMimeCandidates(audioMimeType)
  const model = String(process.env.DEEPGRAM_STT_MODEL || 'nova-3').trim()
  const errors = []
  for (const mimeType of mimeCandidates) {
    try {
      const response = await safeFetch(
        `https://api.deepgram.com/v1/listen?model=${encodeURIComponent(
          model
        )}&smart_format=true&punctuate=true&utterances=true&filler_words=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${apiKey}`,
            'Content-Type': mimeType
          },
          body: audioBuffer
        },
        { timeoutMs: 65000, retries: 1, retryDelayMs: 900 }
      )
      if (!response.ok) {
        const body = await response.text().catch(() => '')
        errors.push(`${mimeType}: ${response.status} ${body.slice(0, 120)}`)
        continue
      }
      const payload = await response.json()
      const alt = payload?.results?.channels?.[0]?.alternatives?.[0] || {}
      const transcriptText = normalizeTextOutput(alt?.transcript)
      if (!transcriptText) {
        errors.push(`${mimeType}: empty transcript`)
        continue
      }
      const words = Array.isArray(alt?.words)
        ? alt.words.map((item) => ({
            word: String(item?.punctuated_word || item?.word || '').replace(/^[^a-zA-Z']+|[^a-zA-Z']+$/g, ''),
            confidence: Math.max(0.01, Math.min(0.99, Number(item?.confidence ?? 0.5))),
            start: Number(item?.start ?? 0),
            end: Number(item?.end ?? 0)
          }))
        : []
      return {
        raw: payload,
        whisperTranscript: transcriptText,
        pronunciationSignalBand: 6,
        model,
        words
      }
    } catch (error) {
      errors.push(`${mimeType}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  throw new Error(`Deepgram failed for all mime types. ${errors.join(' | ')}`)
}

const buildIFlytekAuthUrl = ({ host, path }) => {
  const appId = String(process.env.IFLYTEK_APP_ID || '').trim()
  const apiKey = String(process.env.IFLYTEK_API_KEY || '').trim()
  const apiSecret = String(process.env.IFLYTEK_API_SECRET || '').trim()
  if (!appId) throw new Error('Missing IFLYTEK_APP_ID for transcription')
  if (!apiKey) throw new Error('Missing IFLYTEK_API_KEY for transcription')
  if (!apiSecret) throw new Error('Missing IFLYTEK_API_SECRET for transcription')

  const date = new Date().toUTCString()
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
  const signature = createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')
  const url = `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(
    date
  )}&host=${encodeURIComponent(host)}`
  return { appId, url, host, path }
}

const extractWavPcm16 = (audioBuffer) => {
  if (!audioBuffer || audioBuffer.byteLength < 44) {
    throw new Error('WAV file is too short.')
  }
  if (audioBuffer.toString('ascii', 0, 4) !== 'RIFF' || audioBuffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Invalid WAV header.')
  }
  let offset = 12
  let fmt = null
  let dataOffset = -1
  let dataSize = 0
  while (offset + 8 <= audioBuffer.byteLength) {
    const chunkId = audioBuffer.toString('ascii', offset, offset + 4)
    const chunkSize = audioBuffer.readUInt32LE(offset + 4)
    const chunkDataStart = offset + 8
    if (chunkId === 'fmt ') {
      const audioFormat = audioBuffer.readUInt16LE(chunkDataStart)
      const channels = audioBuffer.readUInt16LE(chunkDataStart + 2)
      const sampleRate = audioBuffer.readUInt32LE(chunkDataStart + 4)
      const bitsPerSample = audioBuffer.readUInt16LE(chunkDataStart + 14)
      fmt = { audioFormat, channels, sampleRate, bitsPerSample }
    } else if (chunkId === 'data') {
      dataOffset = chunkDataStart
      dataSize = chunkSize
      break
    }
    offset = chunkDataStart + chunkSize + (chunkSize % 2)
  }
  if (!fmt) throw new Error('WAV fmt chunk missing.')
  if (dataOffset < 0 || dataSize <= 0) throw new Error('WAV data chunk missing.')
  if (fmt.audioFormat !== 1 || fmt.bitsPerSample !== 16) {
    throw new Error('WAV must be PCM 16-bit.')
  }
  const raw = audioBuffer.subarray(dataOffset, Math.min(audioBuffer.byteLength, dataOffset + dataSize))
  if (fmt.channels === 1) {
    return { pcmBuffer: raw, sampleRate: fmt.sampleRate }
  }
  const frameCount = Math.floor(raw.byteLength / (2 * fmt.channels))
  const mono = Buffer.allocUnsafe(frameCount * 2)
  for (let i = 0; i < frameCount; i += 1) {
    let sum = 0
    for (let c = 0; c < fmt.channels; c += 1) {
      sum += raw.readInt16LE(i * fmt.channels * 2 + c * 2)
    }
    const avg = Math.max(-32768, Math.min(32767, Math.round(sum / fmt.channels)))
    mono.writeInt16LE(avg, i * 2)
  }
  return { pcmBuffer: mono, sampleRate: fmt.sampleRate }
}

const resolveIFlytekAudioConfig = ({ audioMimeType, audioBuffer }) => {
  const mimeType = normalizeAudioMimeType(audioMimeType)
  if (mimeType.includes('wav') || mimeType.includes('pcm')) {
    const { pcmBuffer, sampleRate } = extractWavPcm16(audioBuffer)
    return { encoding: 'raw', format: `audio/L16;rate=${sampleRate}`, payloadBuffer: pcmBuffer }
  }
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
    return { encoding: 'lame', format: 'audio/L16;rate=16000', payloadBuffer: audioBuffer }
  }
  throw new Error(
    `Unsupported audio format for ENGLISH PLAN (${mimeType || 'unknown'}). Please use WAV or MP3 for reliable scoring.`
  )
}

const transcribeWithIFlytek = async ({ audioBase64, audioMimeType }) => {
  const normalizedAudioBase64 = normalizeBase64AudioPayload(audioBase64)
  const audioBuffer = Buffer.from(normalizedAudioBase64, 'base64')
  if (!audioBuffer || audioBuffer.byteLength < 1024) {
    throw new Error('Audio payload too short for transcription')
  }
  const { encoding, format, payloadBuffer } = resolveIFlytekAudioConfig({ audioMimeType, audioBuffer })
  const language = String(process.env.IFLYTEK_IAT_LANGUAGE || 'en_us').trim()
  const domain = String(process.env.IFLYTEK_IAT_DOMAIN || 'iat').trim()
  const accent = String(process.env.IFLYTEK_IAT_ACCENT || '').trim()
  const configuredHost = String(process.env.IFLYTEK_IAT_HOST || 'iat-api-sg.xf-yun.com').trim()
  const configuredPath = String(process.env.IFLYTEK_IAT_PATH || '/v2/iat').trim()
  const endpointCandidates = [
    { host: configuredHost, path: configuredPath },
    { host: 'iat-api.xfyun.cn', path: configuredPath }
  ].filter((item, index, arr) => arr.findIndex((x) => x.host === item.host && x.path === item.path) === index)

  const runOneEndpoint = ({ host, path }) =>
    new Promise((resolve, reject) => {
      const { appId, url } = buildIFlytekAuthUrl({ host, path })
      const ws = new WebSocket(url)
      const frameSize = 1280
      const intervalMs = 40
      const resultBySn = new Map()
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      try {
        ws.close()
      } catch {
        // ignore close errors
      }
      reject(error instanceof Error ? error : new Error(String(error)))
    }
    const succeed = (payload) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      try {
        ws.close()
      } catch {
        // ignore close errors
      }
      resolve(payload)
    }
    const timeout = setTimeout(() => {
      fail(new Error('ENGLISH PLAN transcription timeout'))
    }, 80000)

    ws.on('open', async () => {
      try {
        let offset = 0
        const sendFrame = (status, chunkBase64 = '') => {
          const payload = {
            data: {
              status,
              format,
              encoding,
              audio: chunkBase64
            }
          }
          if (status === 0) {
            payload.common = { app_id: appId }
            payload.business = accent ? { language, domain, accent } : { language, domain }
          }
          ws.send(JSON.stringify(payload))
        }

        const firstChunk = payloadBuffer.slice(0, frameSize)
        offset += firstChunk.length
        sendFrame(0, firstChunk.toString('base64'))
        while (offset < payloadBuffer.length) {
          await sleep(intervalMs)
          const chunk = payloadBuffer.slice(offset, offset + frameSize)
          offset += chunk.length
          sendFrame(1, chunk.toString('base64'))
        }
        await sleep(intervalMs)
        ws.send(JSON.stringify({ data: { status: 2 } }))
      } catch (error) {
        fail(error)
      }
    })

    ws.on('message', (data) => {
      try {
        const text = typeof data === 'string' ? data : Buffer.from(data).toString('utf8')
        const payload = JSON.parse(text)
        if (Number(payload?.code || 0) !== 0) {
          fail(new Error(`ENGLISH PLAN error ${payload?.code}: ${payload?.message || 'unknown error'}`))
          return
        }
        const result = payload?.data?.result
        if (result?.ws) {
          const sentence = result.ws
            .map((item) => String(item?.cw?.[0]?.w || ''))
            .join('')
            .trim()
          if (sentence) {
            resultBySn.set(Number(result?.sn ?? resultBySn.size + 1), sentence)
          }
        }
        if (Number(payload?.data?.status) === 2) {
          const transcriptText = normalizeTextOutput(
            [...resultBySn.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([, value]) => value)
              .join(' ')
          )
          if (!transcriptText) {
            fail(new Error('ENGLISH PLAN returned empty transcript'))
            return
          }
          succeed({
            raw: payload,
            whisperTranscript: transcriptText,
            pronunciationSignalBand: 6,
            model: 'iflytek-iat'
          })
        }
      } catch (error) {
        fail(error)
      }
    })

    ws.on('error', () => {
      fail(new Error('ENGLISH PLAN websocket error'))
    })

    ws.on('close', (code) => {
      if (!settled) {
        fail(new Error(`ENGLISH PLAN websocket closed unexpectedly (${code})`))
      }
    })
  })

  let lastError = null
  const endpointErrors = []
  for (const endpoint of endpointCandidates) {
    try {
      return await runOneEndpoint(endpoint)
    } catch (error) {
      lastError = error
      const message = error instanceof Error ? error.message : String(error)
      endpointErrors.push(`${endpoint.host}${endpoint.path}: ${message}`)
      const lower = message.toLowerCase()
      const isLicenseError = lower.includes('11201') || lower.includes('licc failed')
      if (!isLicenseError) break
    }
  }
  throw new Error(endpointErrors.join(' | ') || (lastError instanceof Error ? lastError.message : 'Unknown ENGLISH PLAN transcription error'))
}

const scoreTranscriptionConfidenceQuality = ({ transcript, words }) => {
  const transcriptWords = countWords(transcript)
  if (!Array.isArray(words) || words.length === 0 || transcriptWords === 0) return 0.2
  const usable = words.filter((item) => item.word)
  if (usable.length === 0) return 0.2
  const coverage = Math.min(1, usable.length / Math.max(1, transcriptWords))
  const avg = usable.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / usable.length
  const criticalRate = usable.filter((item) => Number(item.confidence || 0) < 0.5).length / usable.length
  return Number((coverage * 0.55 + avg * 0.3 + (1 - criticalRate) * 0.15).toFixed(4))
}

const transcribeWithEmergencyFallback = async ({ audioBase64, audioMimeType, primaryError, usageTracker, preferWordTimestamps = false }) => {
  const errors = primaryError
    ? [`english-plan: ${primaryError instanceof Error ? primaryError.message : String(primaryError || 'unknown error')}`]
    : []
  if (preferWordTimestamps && process.env.DEEPGRAM_API_KEY) {
    try {
      const deepgram = await transcribeWithDeepgram({ audioBase64, audioMimeType })
      const quality = scoreTranscriptionConfidenceQuality({
        transcript: deepgram.whisperTranscript,
        words: deepgram.words || []
      })
      return {
        provider: 'deepgram-word-timing',
        engine: `deepgram-${deepgram.model}-word-timing`,
        quality,
        result: deepgram,
        diagnostics: [{ provider: 'deepgram-word-timing', engine: `deepgram-${deepgram.model}-word-timing`, quality }],
        errors
      }
    } catch (error) {
      errors.push(`deepgram-word-timing: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (process.env.GEMINI_API_KEY) {
    try {
      const google = await transcribeWithGoogle({ audioBase64, audioMimeType, usageTracker })
      const quality = scoreTranscriptionConfidenceQuality({
        transcript: google.whisperTranscript,
        words: google.words || []
      })
      return {
        provider: 'gemini-backup',
        engine: 'gemini-2.5-flash-backup',
        quality,
        result: google,
        diagnostics: [{ provider: 'gemini-backup', engine: 'gemini-2.5-flash-backup', quality }],
        errors
      }
    } catch (error) {
      errors.push(`gemini: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (process.env.DEEPGRAM_API_KEY) {
    try {
      const deepgram = await transcribeWithDeepgram({ audioBase64, audioMimeType })
      const quality = scoreTranscriptionConfidenceQuality({
        transcript: deepgram.whisperTranscript,
        words: deepgram.words || []
      })
      return {
        provider: 'deepgram-backup',
        engine: `deepgram-${deepgram.model}-backup`,
        quality,
        result: deepgram,
        diagnostics: [{ provider: 'deepgram-backup', engine: `deepgram-${deepgram.model}-backup`, quality }],
        errors
      }
    } catch (error) {
      errors.push(`deepgram: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  throw new Error(errors.join(' | '))
}

const transcribeWithBestProvider = async ({ audioBase64, audioMimeType, usageTracker, preferWordTimestamps = false }) => {
  // Runtime STT is intentionally Gemini/Deepgram-first. ENGLISH PLAN is used for pronunciation service status.
  return await transcribeWithEmergencyFallback({
    audioBase64,
    audioMimeType,
    primaryError: null,
    usageTracker,
    preferWordTimestamps
  })
}

const tryParseNumber = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const extractIseScore = (payload, decodedText) => {
  const directCandidates = [
    payload?.data?.total_score,
    payload?.data?.score,
    payload?.result?.score,
    payload?.result?.total_score
  ]
  for (const item of directCandidates) {
    const parsed = tryParseNumber(item)
    if (parsed !== null) return parsed
  }
  const xmlPatterns = [
    /total_score=["']?([0-9.]+)/i,
    /overall_score=["']?([0-9.]+)/i,
    /pronunciation_score=["']?([0-9.]+)/i,
    /score=["']?([0-9.]+)/i
  ]
  for (const pattern of xmlPatterns) {
    const match = decodedText.match(pattern)
    if (match?.[1]) {
      const parsed = tryParseNumber(match[1])
      if (parsed !== null) return parsed
    }
  }
  return null
}

const mapIseScoreToBand = (rawScore) => {
  // iFlytek ISE commonly returns 0-100 scores.
  const score100 = Math.max(0, Math.min(100, Number(rawScore || 0)))
  return clampBand(roundPronunciationBand(4 + (score100 / 100) * 5))
}

const assessPronunciationWithIFlytekISE = async ({ audioBase64, audioMimeType, referenceText }) => {
  const normalizedAudioBase64 = normalizeBase64AudioPayload(audioBase64)
  const audioBuffer = Buffer.from(normalizedAudioBase64, 'base64')
  if (!audioBuffer || audioBuffer.byteLength < 1024) {
    throw new Error('Audio payload too short for ENGLISH PLAN pronunciation assessment')
  }
  const { encoding, format, payloadBuffer } = resolveIFlytekAudioConfig({ audioMimeType, audioBuffer })
  const host = String(process.env.IFLYTEK_ISE_HOST || 'ise-api-sg.xf-yun.com').trim()
  const path = String(process.env.IFLYTEK_ISE_PATH || '/v2/ise').trim()
  const category = String(process.env.IFLYTEK_ISE_CATEGORY || 'read_sentence').trim()
  const language = String(process.env.IFLYTEK_ISE_LANGUAGE || 'en_us').trim()
  const ent = String(process.env.IFLYTEK_ISE_ENT || 'en_vip').trim()
  const cmd = String(process.env.IFLYTEK_ISE_CMD || 'ssb').trim()
  const tte = String(process.env.IFLYTEK_ISE_TTE || 'utf-8').trim()
  const refText = String(referenceText || 'hello world').trim()
  if (!refText) throw new Error('Missing reference text for ENGLISH PLAN pronunciation assessment')

  const profiles = [
    { sub: String(process.env.IFLYTEK_ISE_SUB || 'ise').trim() || 'ise', category, ent, cmd, tte },
    { sub: 'xse', category, ent, cmd, tte },
    { sub: 'ise', category: 'read_word', ent, cmd, tte }
  ].filter((item, index, arr) => arr.findIndex((x) => x.sub === item.sub && x.category === item.category) === index)

  const runProfile = async (profile) => {
    const { appId, url } = buildIFlytekAuthUrl({ host, path })
    const ws = new WebSocket(url)
    const frameSize = 1280
    const intervalMs = 40

    return await new Promise((resolve, reject) => {
    let settled = false
    let decodedResultText = ''
    let rawPayload = null
    const fail = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      try {
        ws.close()
      } catch {
        // ignore close errors
      }
      reject(error instanceof Error ? error : new Error(String(error)))
    }
    const succeed = (result) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      try {
        ws.close()
      } catch {
        // ignore close errors
      }
      resolve(result)
    }
    const timeout = setTimeout(() => {
      fail(new Error('ENGLISH PLAN pronunciation assessment timeout'))
    }, 90000)

    ws.on('open', async () => {
      try {
        let offset = 0
        const sendFrame = (status, chunkBase64 = '') => {
          const payload = {
            data: {
              status,
              format,
              encoding,
              data: chunkBase64
            }
          }
          if (status === 0) {
            payload.common = { app_id: appId }
            payload.business = {
              category: profile.category,
              sub: profile.sub,
              ent: profile.ent,
              cmd: profile.cmd,
              tte: profile.tte,
              text: `\uFEFF${refText}`,
              auf: format,
              aue: encoding
            }
          }
          ws.send(JSON.stringify(payload))
        }

        const firstChunk = payloadBuffer.slice(0, frameSize)
        offset += firstChunk.length
        sendFrame(0, firstChunk.toString('base64'))
        while (offset < payloadBuffer.length) {
          await sleep(intervalMs)
          const chunk = payloadBuffer.slice(offset, offset + frameSize)
          offset += chunk.length
          sendFrame(1, chunk.toString('base64'))
        }
        await sleep(intervalMs)
        ws.send(JSON.stringify({ data: { status: 2 } }))
      } catch (error) {
        fail(error)
      }
    })

    ws.on('message', (data) => {
      try {
        const text = typeof data === 'string' ? data : Buffer.from(data).toString('utf8')
        const payload = JSON.parse(text)
        rawPayload = payload
        if (Number(payload?.code || 0) !== 0) {
          fail(new Error(`ENGLISH PLAN error ${payload?.code}: ${payload?.message || 'unknown error'}`))
          return
        }
        const resultBase64 = String(payload?.data?.data || '')
        if (resultBase64) {
          decodedResultText = Buffer.from(resultBase64, 'base64').toString('utf8')
        }
        if (Number(payload?.data?.status) === 2) {
          const rawScore = extractIseScore(payload, decodedResultText)
          if (rawScore === null) {
            fail(new Error('ENGLISH PLAN returned no readable pronunciation score'))
            return
          }
          const band = mapIseScoreToBand(rawScore)
          const confidence = rawScore >= 82 ? 'high' : rawScore >= 70 ? 'medium' : 'low'
          const scorePct = Math.max(0, Math.min(100, Number(rawScore.toFixed(1))))
          succeed({
            raw: rawPayload,
            score100: scorePct,
            band,
            confidence,
            note: 'Pronunciation score is based on ENGLISH PLAN ISE.',
            wordAnalysis: [
              {
                word: 'overall-pronunciation',
                confidence: Math.round(scorePct),
                status: scorePct >= 70 ? 'minor' : 'critical'
              }
            ],
            metrics: {
              totalWords: countWords(refText),
              minorErrorRate: Number((100 - scorePct).toFixed(1)),
              criticalErrorRate: Number((Math.max(0, 70 - scorePct) * 0.8).toFixed(1))
            }
          })
        }
      } catch (error) {
        fail(error)
      }
    })

    ws.on('error', () => fail(new Error('ENGLISH PLAN pronunciation websocket error')))
    ws.on('close', (code) => {
      if (!settled) fail(new Error(`ENGLISH PLAN pronunciation websocket closed unexpectedly (${code})`))
    })
  })
  }

  const errors = []
  for (const profile of profiles) {
    try {
      return await runProfile(profile)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push(`${profile.sub}/${profile.category}: ${message}`)
      const lower = message.toLowerCase()
      const shouldTryNext =
        lower.includes('11201') ||
        lower.includes('10163') ||
        lower.includes('unknown field') ||
        lower.includes('must be one of')
      if (!shouldTryNext) break
    }
  }
  throw new Error(errors.join(' | ') || 'ENGLISH PLAN pronunciation assessment failed')
}

const probeEnglishPlanEndpoint = async ({ host, path }) => {
  const { appId, url } = buildIFlytekAuthUrl({ host, path })
  return await new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    let settled = false
    const finish = (ok, payload) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      try {
        ws.close()
      } catch {
        // ignore close errors
      }
      if (ok) resolve(payload)
      else reject(payload instanceof Error ? payload : new Error(String(payload)))
    }
    const timeout = setTimeout(() => {
      finish(false, new Error(`ENGLISH PLAN probe timeout (${host})`))
    }, 15000)

    ws.on('open', () => {
      const tinySilence = Buffer.alloc(320, 0).toString('base64')
      ws.send(
        JSON.stringify({
          common: { app_id: appId },
          business: {
            category: 'read_sentence',
            sub: 'ise',
            ent: 'en_vip',
            cmd: 'ssb',
            tte: 'utf-8',
            text: '\uFEFFhello world',
            auf: 'audio/L16;rate=16000',
            aue: 'raw'
          },
          data: { status: 0, format: 'audio/L16;rate=16000', encoding: 'raw', data: tinySilence }
        })
      )
      ws.send(JSON.stringify({ data: { status: 2 } }))
    })

    ws.on('message', (data) => {
      try {
        const text = typeof data === 'string' ? data : Buffer.from(data).toString('utf8')
        const payload = JSON.parse(text)
        const code = Number(payload?.code ?? 0)
        if (code !== 0) {
          if (code === 11201) {
            finish(false, new Error(`ENGLISH PLAN error ${code}: ${payload?.message || 'unknown error'}`))
            return
          }
          // For cross-product probes (e.g. IAT payload to ISE endpoint), non-11201 means auth/route is reachable.
          finish(true, {
            ok: true,
            endpoint: `${host}${path}`,
            warning: `Endpoint reachable but returned business error ${code}: ${payload?.message || 'unknown error'}`
          })
          return
        }
        finish(true, { ok: true, endpoint: `${host}${path}` })
      } catch (error) {
        finish(false, error)
      }
    })

    ws.on('error', () => finish(false, new Error(`ENGLISH PLAN websocket error (${host})`)))
    ws.on('close', (code) => {
      if (!settled) finish(false, new Error(`ENGLISH PLAN websocket closed (${host}) code=${code}`))
    })
  })
}

const transcribeWithGoogle = async ({ audioBase64, audioMimeType, usageTracker }) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY for transcription')
  if (!audioBase64) throw new Error('No audio payload for transcription')

  const normalizedAudioBase64 = normalizeBase64AudioPayload(audioBase64)
  const audioBuffer = Buffer.from(normalizedAudioBase64, 'base64')
  if (!audioBuffer || audioBuffer.byteLength < 1024) {
    throw new Error('Audio payload too short for transcription')
  }
  if (audioBuffer.byteLength > 22 * 1024 * 1024) {
    throw new Error('Audio payload too large for reliable Gemini transcription')
  }
  const mimeTypeCandidates = transcriptionMimeCandidates(audioMimeType)
  const audioData = audioBuffer.toString('base64')
  const modelErrors = []
  const endpointCandidates = ['v1beta', 'v1']

  for (const model of GEMINI_TRANSCRIPTION_MODELS) {
    for (const mimeType of mimeTypeCandidates) {
      for (const apiVersion of endpointCandidates) {
        try {
          const response = await safeFetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models/${encodeURIComponent(
              model
            )}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: 'Transcribe this audio to plain English text only. Do not add extra commentary.' },
                      { inline_data: { mime_type: mimeType, data: audioData } }
                    ]
                  }
                ],
                generationConfig: { temperature: 0 }
              })
            },
            { timeoutMs: 65000, retries: 2, retryDelayMs: 1200 }
          )
          if (!response.ok) {
            const body = await response.text().catch(() => '')
            modelErrors.push(`${apiVersion}:${model}/${mimeType}: ${response.status} ${body.slice(0, 120)}`)
            continue
          }
          const payload = await response.json()
          const transcriptText = extractGeminiTextFromPayload(payload)
          if (!transcriptText) {
            const blockReason = payload?.promptFeedback?.blockReason || 'empty transcript'
            modelErrors.push(`${apiVersion}:${model}/${mimeType}: ${blockReason}`)
            continue
          }
          const costBreakdown = calculateGeminiApiCost({
            model,
            usageMetadata: payload?.usageMetadata,
            fallbackInputModality: 'AUDIO'
          })
          if (costBreakdown) {
            usageTracker?.record({
              ...costBreakdown,
              operation: 'transcription'
            })
          }
          return {
            raw: null,
            whisperTranscript: transcriptText,
            pronunciationSignalBand: 6,
            model
          }
        } catch (error) {
          const message = error?.message || 'unknown model error'
          modelErrors.push(`${apiVersion}:${model}/${mimeType}: ${String(message).slice(0, 120)}`)
        }
      }
    }
  }

  throw new Error(
    `Google transcription failed after ${GEMINI_TRANSCRIPTION_MODELS.length} model attempts. ${modelErrors.join(' | ')}`
  )
}

const callGemini = async (prompt, usageTracker) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
  const candidates = [
    String(process.env.GEMINI_ASSESSMENT_MODEL || 'gemini-2.5-flash').trim(),
    'gemini-2.5-flash'
  ].filter(Boolean)
  const tried = []
  for (const model of [...new Set(candidates)]) {
    const response = await safeFetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
        })
      },
      { timeoutMs: 65000, retries: 2, retryDelayMs: 1200 }
    )
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      tried.push(`${model}: ${response.status} ${body.slice(0, 120)}`)
      continue
    }
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      tried.push(`${model}: empty text`)
      continue
    }
    const costBreakdown = calculateGeminiApiCost({
      model,
      usageMetadata: data?.usageMetadata,
      fallbackInputModality: 'TEXT'
    })
    if (costBreakdown) {
      usageTracker?.record({
        ...costBreakdown,
        operation: 'assessment'
      })
    }
    try {
      return normalizeAssessment(parseModelJson(text), model)
    } catch (error) {
      tried.push(
        `${model}: parse failed ${sanitizeErrorMessage(error?.message || error).slice(0, 120)}`
      )
      continue
    }
  }
  throw new Error(`Gemini failed on all models. ${tried.join(' | ')}`)
}

const GEMINI_ASSESSMENT_REPORT_ATTEMPTS = Math.max(
  1,
  Math.min(5, Math.round(Number(process.env.GEMINI_ASSESSMENT_REPORT_ATTEMPTS || 3)) || 3)
)
const GEMINI_ASSESSMENT_RETRY_DELAY_MS = Math.max(
  500,
  Math.min(5000, Math.round(Number(process.env.GEMINI_ASSESSMENT_RETRY_DELAY_MS || 1600)) || 1600)
)

const runGeminiAssessmentReportWithRetries = async ({ buildReport, onProgress }) => {
  const errors = []
  for (let attempt = 1; attempt <= GEMINI_ASSESSMENT_REPORT_ATTEMPTS; attempt += 1) {
    try {
      if (attempt > 1) {
        onProgress(
          Math.min(88, 58 + attempt * 7),
          `Main scoring model was busy. Retrying assessment API (${attempt}/${GEMINI_ASSESSMENT_REPORT_ATTEMPTS}) for the full report.`
        )
      }
      return await buildReport()
    } catch (error) {
      const message = sanitizeErrorMessage(error instanceof Error ? error.message : String(error))
      errors.push(`attempt ${attempt}: ${message}`)
      if (attempt >= GEMINI_ASSESSMENT_REPORT_ATTEMPTS) break
      onProgress(
        Math.min(86, 56 + attempt * 7),
        'Main scoring model did not return a usable report yet. Trying the API again before using backup mode.'
      )
      await sleep(GEMINI_ASSESSMENT_RETRY_DELAY_MS * attempt)
    }
  }
  throw new Error(
    `Gemini assessment failed after ${GEMINI_ASSESSMENT_REPORT_ATTEMPTS} attempts. ${errors.join(' | ')}`
  )
}

const callGeminiText = async (prompt, usageTracker, operation = 'text') => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
  const candidates = [
    String(process.env.GEMINI_TEXT_MODEL || process.env.GEMINI_ASSESSMENT_MODEL || 'gemini-2.5-flash').trim(),
    'gemini-2.5-flash'
  ].filter(Boolean)
  const tried = []
  for (const model of [...new Set(candidates)]) {
    const response = await safeFetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      },
      { timeoutMs: 45000, retries: 1, retryDelayMs: 700 }
    )
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      tried.push(`${model}: ${response.status} ${body.slice(0, 120)}`)
      continue
    }
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      tried.push(`${model}: empty text`)
      continue
    }
    const costBreakdown = calculateGeminiApiCost({
      model,
      usageMetadata: data?.usageMetadata,
      fallbackInputModality: 'TEXT'
    })
    if (costBreakdown) {
      usageTracker?.record({
        ...costBreakdown,
        operation
      })
    }
    return normalizeTextOutput(text)
  }
  throw new Error(`Gemini text failed on all models. ${tried.join(' | ')}`)
}

const callGeminiCleanupText = async (prompt, usageTracker) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
  const candidates = [
    String(process.env.GEMINI_CLEANUP_MODEL || 'gemini-2.5-flash-lite').trim(),
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ].filter(Boolean)
  const tried = []
  for (const model of [...new Set(candidates)]) {
    const response = await safeFetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        })
      },
      { timeoutMs: 45000, retries: 1, retryDelayMs: 700 }
    )
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      tried.push(`${model}: ${response.status} ${body.slice(0, 120)}`)
      continue
    }
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      tried.push(`${model}: empty text`)
      continue
    }
    const costBreakdown = calculateGeminiApiCost({
      model,
      usageMetadata: data?.usageMetadata,
      fallbackInputModality: 'TEXT'
    })
    if (costBreakdown) {
      usageTracker?.record({
        ...costBreakdown,
        operation: 'cleanup'
      })
    }
    return normalizeTextOutput(text)
  }
  throw new Error(`Gemini cleanup text failed on all models. ${tried.join(' | ')}`)
}

const callGeminiJson = async (prompt, usageTracker, operation = 'json') =>
  parseModelJson(await callGeminiText(prompt, usageTracker, operation))
const callGeminiCleanupJson = async (prompt, usageTracker) =>
  parseModelJson(await callGeminiCleanupText(prompt, usageTracker))

const buildFullMockAssessmentReport = async ({
  topic,
  prompt,
  cues,
  punctuatedTranscript,
  whisperTranscript,
  durationSeconds,
  questionBreakdown,
  punctuationErrors,
  pronunciationBand,
  onProgress,
  usageTracker
}) => {
  const safeProgress = typeof onProgress === 'function' ? onProgress : () => {}

  safeProgress(52, 'Combining the whole mock transcript into one complete performance.')
  safeProgress(64, 'Scoring grammar, vocabulary, and fluency across the full mock as one performance.')

  return buildFinalReport({
    result: await callGemini(
      fullMockWholeRubricPrompt({
        topic,
        prompt,
        cues: Array.isArray(cues) ? cues : [],
        punctuatedTranscript,
        whisperTranscript,
        durationSeconds,
        questionBreakdown
      }),
      usageTracker
    ),
    testMode: 'full',
    pronunciationBand,
    punctuatedTranscript,
    punctuationErrors,
    questionBreakdown
  })
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const adminCode = String(req.body?.adminCode || '').trim()
    if (adminCode) {
      if (adminCode !== ADMIN_PANEL_CODE) {
        return res.status(401).json({
          error: {
            status: 401,
            type: 'auth_login_error',
            message: 'Incorrect admin code.'
          }
        })
      }
      return res.json(createAdminCodeSessionPayload())
    }

    ensureSupabaseConfigured()
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '').trim()
    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Email and password are required.'
        }
      })
    }

    const authPayload = await fetchSupabaseJson('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: buildSupabaseHeaders(),
      body: JSON.stringify({ email, password })
    })
    const profile = await loadUserProfileWithAccess(authPayload?.user?.id)
    if (!profile) {
      return res.status(403).json({
        error: {
          status: 403,
          type: 'missing_profile',
          message: 'This account does not have an app profile yet.'
        }
      })
    }
    if (String(profile.role || 'student') !== 'admin') {
      ensureActiveStudentAccess(profile)
    }

    return res.json({
      session: {
        accessToken: String(authPayload?.access_token || ''),
        refreshToken: String(authPayload?.refresh_token || ''),
        expiresAt: Number(authPayload?.expires_at || 0),
        userId: String(authPayload?.user?.id || ''),
        role: resolveSessionRole(profile, authPayload?.user),
        name: String(profile.full_name || profile.email || 'Student'),
        email: normalizeEmail(profile.email || authPayload?.user?.email || '')
      },
      creditProfile: mapCreditProfile(profile)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'auth_login_error',
        message: error instanceof Error ? error.message : 'Could not sign in.'
      }
    })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    ensureSupabaseConfigured()
    const name = String(req.body?.name || '').trim()
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '').trim()

    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Name, email, and password are required.'
        }
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Password must be at least 6 characters.'
        }
      })
    }

    const existingProfile = await loadUserProfileByEmail(email)
    if (existingProfile?.id) {
      if (isTrialProfileRecord(existingProfile)) {
        await supabaseRequest('/rest/v1/learner_access', {
          method: 'POST',
          headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
          body: JSON.stringify(
            buildLearnerAccessPayload({
              userId: existingProfile.id,
              status: 'active',
              startsAt: existingProfile?.learner_access?.starts_at || new Date().toISOString(),
              expiresAt: null,
              feedbackCredits: Math.max(1, Number(existingProfile?.learner_access?.feedback_credits ?? 0)),
              fullMockCredits: Math.max(1, Number(existingProfile?.learner_access?.full_mock_credits ?? 0))
            })
          )
        })

        return res.status(201).json({
          success: true,
          message: 'Your one-time trial account is ready.'
        })
      }

      return res.status(409).json({
        error: {
          status: 409,
          type: 'email_exists',
          message: 'This email is already registered. Please sign in instead.'
        }
      })
    }

    const created = await fetchSupabaseJson('/auth/v1/admin/users', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: 'student' }
      })
    })
    const userId = String(created?.user?.id || created?.id || '')
    if (!userId) {
      throw new Error('Could not create learner account.')
    }

    await supabaseRequest('/rest/v1/profiles', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        id: userId,
        email,
        full_name: name,
        role: 'student'
      })
    })

    await supabaseRequest('/rest/v1/learner_access', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(
        buildLearnerAccessPayload({
          userId,
          status: 'inactive',
          startsAt: new Date().toISOString(),
          expiresAt: null,
          feedbackCredits: 0,
          fullMockCredits: 0
        })
      )
    })

    const createdProfile = await loadUserProfileWithAccess(userId)
    try {
      if (createdProfile) {
        await sendNewSignupNotificationEmail({ req, learner: createdProfile })
      }
    } catch (emailError) {
      console.error('Could not send new signup notification email:', emailError)
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please wait for your admin to activate your access.'
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'auth_signup_error',
        message: error instanceof Error ? error.message : 'Could not create your account.'
      }
    })
  }
})

app.post('/api/auth/trial-signup', async (req, res) => {
  try {
    ensureSupabaseConfigured()
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '').trim()

    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Email and password are required.'
        }
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Password must be at least 6 characters.'
        }
      })
    }

    const existingProfile = await loadUserProfileByEmail(email)
    if (existingProfile?.id) {
      return res.status(409).json({
        error: {
          status: 409,
          type: 'email_exists',
          message: 'This email has already used its one-time trial. Please sign in with the same trial account here to view your access and report.'
        }
      })
    }

    const created = await fetchSupabaseJson('/auth/v1/admin/users', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true }),
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: 'Trial User', role: 'trial' }
      })
    })
    const userId = String(created?.user?.id || created?.id || '')
    if (!userId) {
      throw new Error('Could not create trial account.')
    }

    const displayName = `Trial - ${email.split('@')[0] || 'user'}`
    await supabaseRequest('/rest/v1/profiles', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        id: userId,
        email,
        full_name: displayName,
        role: 'student'
      })
    })

    await supabaseRequest('/rest/v1/learner_access', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(
        buildLearnerAccessPayload({
          userId,
          status: 'active',
          startsAt: new Date().toISOString(),
          expiresAt: null,
          feedbackCredits: 1,
          fullMockCredits: 1
        })
      )
    })

    return res.status(201).json({
      success: true,
      message: 'Your one-time trial account is ready.'
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'auth_trial_signup_error',
        message: error instanceof Error ? error.message : 'Could not create your trial account.'
      }
    })
  }
})

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const refreshToken = String(req.body?.refreshToken || '').trim()
    const adminAuth = verifyAdminCodeToken(refreshToken)
    if (adminAuth) {
      return res.json(createAdminCodeSessionPayload())
    }

    ensureSupabaseConfigured()
    if (!refreshToken) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Refresh token is required.'
        }
      })
    }
    const authPayload = await fetchSupabaseJson('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: buildSupabaseHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken })
    })
    const profile = await loadUserProfileWithAccess(authPayload?.user?.id)
    if (!profile) {
      throw new Error('This account does not have an app profile yet.')
    }
    if (String(profile.role || 'student') !== 'admin') {
      ensureActiveStudentAccess(profile)
    }
    return res.json({
      session: {
        accessToken: String(authPayload?.access_token || ''),
        refreshToken: String(authPayload?.refresh_token || refreshToken),
        expiresAt: Number(authPayload?.expires_at || 0),
        userId: String(authPayload?.user?.id || ''),
        role: resolveSessionRole(profile, authPayload?.user),
        name: String(profile.full_name || profile.email || 'Student'),
        email: normalizeEmail(profile.email || authPayload?.user?.email || '')
      },
      creditProfile: mapCreditProfile(profile)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'auth_refresh_error',
        message: error instanceof Error ? error.message : 'Could not refresh session.'
      }
    })
  }
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const profile = await loadUserProfileWithAccess(req.auth.user.id)
    if (!profile) throw new Error('Profile not found')
    if (String(profile.role || 'student') !== 'admin') {
      ensureActiveStudentAccess(profile)
    }
    return res.json({
      session: {
        userId: String(req.auth.user.id || ''),
        role: resolveSessionRole(profile, req.auth.user),
        name: String(profile.full_name || profile.email || 'Student'),
        email: normalizeEmail(profile.email || req.auth.user.email || '')
      },
      creditProfile: mapCreditProfile(profile)
    })
  } catch (error) {
    return res.status(403).json({
      error: {
        status: 403,
        type: 'auth_profile_error',
        message: error instanceof Error ? error.message : 'Could not load profile.'
      }
    })
  }
})

app.patch('/api/me/profile', requireAuth, async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    if (!name) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Name is required.'
        }
      })
    }
    await supabaseRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(req.auth.user.id)}`, {
      method: 'PATCH',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' }),
      body: JSON.stringify({ full_name: name })
    })
    const profile = await loadUserProfileWithAccess(req.auth.user.id)
    return res.json({
      session: {
        userId: String(req.auth.user.id || ''),
        role: String(profile?.role || 'student'),
        name: String(profile?.full_name || profile?.email || 'Student'),
        email: normalizeEmail(profile?.email || req.auth.user.email || '')
      },
      creditProfile: mapCreditProfile(profile)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'profile_update_error',
        message: error instanceof Error ? error.message : 'Could not update profile.'
      }
    })
  }
})

app.get('/api/admin/learners', requireAdmin, async (_req, res) => {
  try {
    const rows = await fetchSupabaseJson(
      '/rest/v1/profiles?select=id,email,full_name,role,created_at,learner_access(status,starts_at,expires_at,feedback_credits,full_mock_credits)&order=created_at.desc',
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    return res.json({
      learners: (Array.isArray(rows) ? rows : []).map(mapLearnerRecord)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_learners_error',
        message: error instanceof Error ? error.message : 'Could not load learners.'
      }
    })
  }
})

app.post('/api/admin/learners', requireAdmin, async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const email = normalizeEmail(req.body?.email)
    const password = String(req.body?.password || '').trim()
    const role = String(req.body?.role || 'student') === 'admin' ? 'admin' : 'student'
    if (!name || !email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Name, email, and password are required.'
        }
      })
    }

    const existingProfile = await loadUserProfileByEmail(email)
    const previousStatus = String(existingProfile?.learner_access?.status || 'inactive')
    const requestedStatus = String(req.body?.status || 'active') === 'inactive' ? 'inactive' : 'active'
    const requestedStartsAt = req.body?.startsAt || new Date().toISOString()
    const defaultAccessWindow =
      requestedStatus === 'active' && !req.body?.expiresAt
        ? buildDefaultAccessWindow(requestedStartsAt)
        : null
    let userId = ''
    try {
      const created = await fetchSupabaseJson('/auth/v1/admin/users', {
        method: 'POST',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role }
        })
      })
      userId = String(created?.user?.id || created?.id || '')
    } catch (error) {
      if (!existingProfile?.id) throw error
      userId = existingProfile.id
      await supabaseRequest(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role }
        })
      })
    }

    await supabaseRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' }),
      body: JSON.stringify({
        email,
        full_name: name,
        role
      })
    })

    await supabaseRequest('/rest/v1/learner_access', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(buildLearnerAccessPayload({
        userId,
        status: requestedStatus,
        startsAt: defaultAccessWindow?.startsAt || requestedStartsAt,
        expiresAt: req.body?.expiresAt || defaultAccessWindow?.expiresAt || null,
        feedbackCredits: req.body?.feedbackCredits,
        fullMockCredits: req.body?.fullMockCredits
      }))
    })

    const profile = await loadUserProfileWithAccess(userId)
    const nextStatus = String(profile?.learner_access?.status || 'inactive')
    if (profile && previousStatus !== 'active' && nextStatus === 'active') {
      try {
        await sendAccessGrantedEmail({ learner: profile })
      } catch (emailError) {
        console.error('Could not send access granted email:', emailError)
      }
    }
    return res.json({
      learner: mapLearnerRecord(profile)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_create_learner_error',
        message: error instanceof Error ? error.message : 'Could not create learner access.'
      }
    })
  }
})

app.patch('/api/admin/learners/:userId', requireAdmin, async (req, res) => {
  try {
    const userId = String(req.params.userId || '').trim()
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Learner id is required.'
        }
      })
    }

    const beforeProfile = await loadUserProfileWithAccess(userId)
    const previousStatus = String(beforeProfile?.learner_access?.status || 'inactive')
    const requestedStatus = String(req.body?.status || previousStatus || 'inactive') === 'inactive' ? 'inactive' : 'active'
    const activatingNow = previousStatus !== 'active' && requestedStatus === 'active'
    const activationWindow =
      activatingNow && !req.body?.expiresAt ? buildDefaultAccessWindow(new Date().toISOString()) : null
    const requestedCredits = applyInitialAccessCredits({
      isActivating: activatingNow,
      feedbackCredits: req.body?.feedbackCredits,
      fullMockCredits: req.body?.fullMockCredits
    })
    const profilePatch = {}
    if (req.body?.name) profilePatch.full_name = String(req.body.name).trim()
    if (req.body?.email) profilePatch.email = normalizeEmail(req.body.email)
    if (req.body?.role) profilePatch.role = String(req.body.role) === 'admin' ? 'admin' : 'student'
    if (Object.keys(profilePatch).length > 0) {
      await supabaseRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' }),
        body: JSON.stringify(profilePatch)
      })
    }

    if (req.body?.password || req.body?.name || req.body?.role || req.body?.email) {
      await supabaseRequest(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          ...(req.body?.email ? { email: normalizeEmail(req.body.email) } : {}),
          ...(req.body?.password ? { password: String(req.body.password).trim() } : {}),
          ...(req.body?.name || req.body?.role
            ? { user_metadata: { ...(req.body?.name ? { name: String(req.body.name).trim() } : {}), ...(req.body?.role ? { role: String(req.body.role) === 'admin' ? 'admin' : 'student' } : {}) } }
            : {})
        })
      })
    }

    await supabaseRequest('/rest/v1/learner_access', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(buildLearnerAccessPayload({
        userId,
        status: requestedStatus,
        startsAt: activationWindow?.startsAt || req.body?.startsAt,
        expiresAt: req.body?.expiresAt || activationWindow?.expiresAt || null,
        feedbackCredits: requestedCredits.feedbackCredits,
        fullMockCredits: requestedCredits.fullMockCredits
      }))
    })

    const profile = await loadUserProfileWithAccess(userId)
    const nextStatus = String(profile?.learner_access?.status || 'inactive')
    if (profile && previousStatus !== 'active' && nextStatus === 'active') {
      try {
        await sendAccessGrantedEmail({ learner: profile })
      } catch (emailError) {
        console.error('Could not send access granted email:', emailError)
      }
    }
    return res.json({
      learner: mapLearnerRecord(profile)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_update_learner_error',
        message: error instanceof Error ? error.message : 'Could not update learner access.'
      }
    })
  }
})

app.get('/api/me/notebook', requireAuth, async (req, res) => {
  try {
    const rows = await fetchSupabaseJson(
      `/rest/v1/user_notebooks?select=user_id,entries,custom_sections,updated_at&user_id=eq.${encodeURIComponent(
        req.auth.user.id
      )}&limit=1`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const row = Array.isArray(rows) ? rows[0] || null : null
    return res.json(row ? mapNotebookRecord(row) : { entries: [], customSections: [], updatedAt: null })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'notebook_load_error',
        message: error instanceof Error ? error.message : 'Could not load notebook.'
      }
    })
  }
})

app.put('/api/me/notebook', requireAuth, async (req, res) => {
  try {
    const payload = {
      user_id: req.auth.user.id,
      entries: sanitizeNotebookEntries(req.body?.entries),
      custom_sections: sanitizeCustomSections(req.body?.customSections)
    }
    await supabaseRequest('/rest/v1/user_notebooks', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload)
    })
    const rows = await fetchSupabaseJson(
      `/rest/v1/user_notebooks?select=user_id,entries,custom_sections,updated_at&user_id=eq.${encodeURIComponent(
        req.auth.user.id
      )}&limit=1`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const row = Array.isArray(rows) ? rows[0] || null : null
    return res.json(
      row ? mapNotebookRecord(row) : { entries: payload.entries, customSections: payload.custom_sections, updatedAt: null }
    )
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'notebook_save_error',
        message: error instanceof Error ? error.message : 'Could not save notebook.'
      }
    })
  }
})

app.get('/api/me/reading-attempts', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'reading_attempts_auth_error',
          message: 'Please sign in before loading reading reports.'
        }
      })
    }
    const objectPath = buildReadingAttemptsObjectPath(userId)
    try {
      const payload = await loadReadingAttemptsJson(objectPath)
      return res.json({
        attempts: sanitizeReadingAttemptHistory(payload?.attempts),
        updatedAt: payload?.updatedAt || null
      })
    } catch (error) {
      if (error?.status !== 400 && error?.status !== 404) throw error
      return res.json({ attempts: {}, updatedAt: null })
    }
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_attempts_load_error',
        message: error instanceof Error ? error.message : 'Could not load reading reports.'
      }
    })
  }
})

app.put('/api/me/reading-attempts', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'reading_attempts_auth_error',
          message: 'Please sign in before saving reading reports.'
        }
      })
    }
    const attempts = sanitizeReadingAttemptHistory(req.body?.attempts)
    const updatedAt = new Date().toISOString()
    const payload = {
      userId,
      updatedAt,
      attempts
    }
    await uploadReadingAttemptsJson({
      objectPath: buildReadingAttemptsObjectPath(userId),
      payload
    })
    return res.json({ attempts, updatedAt })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_attempts_save_error',
        message: error instanceof Error ? error.message : 'Could not save reading reports.'
      }
    })
  }
})

app.get('/api/me/reading-pdoy-progress', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'reading_pdoy_auth_error',
          message: 'Please sign in before loading Reading with P\'Doy progress.'
        }
      })
    }
    const index = await loadReadingPdoyProgressIndex()
    const summary = (Array.isArray(index.items) ? index.items : []).find(
      (item) => normalizeOptionalUuid(item?.userId) === userId
    )
    if (!summary?.objectPath) {
      return res.json({ progress: null, updatedAt: null })
    }
    const payload = await loadReadingPdoyProgressJson(summary.objectPath)
    return res.json({
      progress: payload?.progress && typeof payload.progress === 'object' ? payload.progress : null,
      updatedAt: payload?.updatedAt || summary.updatedAt || null
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_pdoy_progress_load_error',
        message: error instanceof Error ? error.message : 'Could not load Reading with P\'Doy progress.'
      }
    })
  }
})

app.put('/api/me/reading-pdoy-progress', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'reading_pdoy_auth_error',
          message: 'Please sign in before saving Reading with P\'Doy progress.'
        }
      })
    }
    const profile = await loadUserProfileWithAccess(userId)
    if (!profile) {
      throw new Error('Profile not found.')
    }
    const summary = await persistReadingPdoyProgressForUser({
      userId,
      profile,
      progress: req.body?.progress
    })
    return res.json({
      progress: sanitizeReadingPdoyProgressPayload(req.body?.progress),
      summary
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_pdoy_progress_save_error',
        message: error instanceof Error ? error.message : 'Could not save Reading with P\'Doy progress.'
      }
    })
  }
})

app.get('/api/admin/reading-pdoy-progress', requireAdmin, async (_req, res) => {
  try {
    const index = await loadReadingPdoyProgressIndex()
    return res.json({
      reports: (Array.isArray(index.items) ? index.items : [])
        .map(mapReadingPdoyProgressSummary)
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_reading_pdoy_progress_error',
        message: error instanceof Error ? error.message : 'Could not load Reading with P\'Doy progress.'
      }
    })
  }
})

app.get('/api/me/support-reports', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'support_reports_auth_error',
          message: 'Please sign in with a learner account before using support reports.'
        }
      })
    }

    const rows = await fetchSupabaseJson(
      `/rest/v1/support_reports?select=id,user_id,reporter_name,reporter_email,page_context,category,message,status,admin_note,created_at,updated_at,resolved_at&user_id=eq.${encodeURIComponent(
        userId
      )}&order=created_at.desc`,
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )

    return res.json({
      reports: (Array.isArray(rows) ? rows : []).map(mapSupportReportRecord)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'support_reports_load_error',
        message: error instanceof Error ? error.message : 'Could not load support reports.'
      }
    })
  }
})

app.post('/api/me/support-reports', requireAuth, async (req, res) => {
  try {
    const userId = normalizeOptionalUuid(req.auth?.user?.id)
    if (!userId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'support_reports_auth_error',
          message: 'Please sign in with a learner account before submitting a support report.'
        }
      })
    }

    const profile = await loadUserProfileWithAccess(userId)
    if (!profile) {
      throw new Error('Profile not found.')
    }

    const message = sanitizeSupportMessage(req.body?.message)
    if (!message) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please describe the bug or problem before sending it to the admin.'
        }
      })
    }

    const rows = await fetchSupabaseJson('/rest/v1/support_reports', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
      body: JSON.stringify({
        user_id: userId,
        reporter_name: String(profile?.full_name || profile?.email || 'Student').slice(0, 160),
        reporter_email: normalizeEmail(profile?.email || req.auth?.user?.email || ''),
        page_context: sanitizeSupportPageContext(req.body?.pageContext),
        category: normalizeSupportReportCategory(req.body?.category),
        message,
        status: 'open',
        admin_note: ''
      })
    })

    const created = Array.isArray(rows) ? rows[0] || null : rows
    return res.json({
      report: mapSupportReportRecord(created),
      message: 'Your problem report has been sent to the admin team.'
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'support_report_create_error',
        message: error instanceof Error ? error.message : 'Could not create support report.'
      }
    })
  }
})

app.get('/api/admin/support-reports', requireAdmin, async (_req, res) => {
  try {
    const rows = await fetchSupabaseJson(
      '/rest/v1/support_reports?select=id,user_id,reporter_name,reporter_email,page_context,category,message,status,admin_note,created_at,updated_at,resolved_at&order=created_at.desc',
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    return res.json({
      reports: (Array.isArray(rows) ? rows : []).map(mapSupportReportRecord)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_support_reports_error',
        message: error instanceof Error ? error.message : 'Could not load support reports.'
      }
    })
  }
})

app.patch('/api/admin/support-reports/:reportId', requireAdmin, async (req, res) => {
  try {
    const reportId = normalizeOptionalUuid(req.params.reportId)
    if (!reportId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'A valid report id is required.'
        }
      })
    }

    const status = normalizeSupportReportStatus(req.body?.status)
    const adminNote = String(req.body?.adminNote || '').trim().slice(0, 5000)

    const rows = await fetchSupabaseJson(`/rest/v1/support_reports?id=eq.${encodeURIComponent(reportId)}`, {
      method: 'PATCH',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
      body: JSON.stringify({
        status,
        admin_note: adminNote,
        resolved_at: status === 'resolved' || status === 'closed' ? new Date().toISOString() : null
      })
    })

    const updated = Array.isArray(rows) ? rows[0] || null : rows
    return res.json({
      report: mapSupportReportRecord(updated)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_support_report_update_error',
        message: error instanceof Error ? error.message : 'Could not update support report.'
      }
    })
  }
})

app.get('/api/admin/assessment-reports', requireAdmin, async (_req, res) => {
  try {
    const index = await loadAssessmentReportsIndex()
    const reports = (Array.isArray(index.items) ? index.items : [])
      .map(mapAssessmentReportSummary)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    return res.json({ reports })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_assessment_reports_error',
        message: error instanceof Error ? error.message : 'Could not load assessment reports.'
      }
    })
  }
})

app.get('/api/admin/assessment-reports/:reportId', requireAdmin, async (req, res) => {
  try {
    const reportId = String(req.params.reportId || '').trim()
    if (!reportId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'A report id is required.'
        }
      })
    }
    const index = await loadAssessmentReportsIndex()
    const summary = (Array.isArray(index.items) ? index.items : []).find((item) => String(item?.id || '') === reportId)
    if (!summary?.objectPath) {
      return res.status(404).json({
        error: {
          status: 404,
          type: 'not_found',
          message: 'Assessment report not found.'
        }
      })
    }
    const report = await loadAssessmentReportJson(String(summary.objectPath))
    return res.json({
      report: {
        ...report,
        summary: mapAssessmentReportSummary(summary)
      }
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_assessment_report_detail_error',
        message: error instanceof Error ? error.message : 'Could not load the assessment report.'
      }
    })
  }
})

app.get('/api/reading/exams', requireAuth, async (req, res) => {
  try {
    const viewerRole = getReadingViewerRole(req)
    const now = new Date()
    const rows = await fetchSupabaseJson(
      '/rest/v1/reading_exams?select=id,category,title,raw_passage_text,raw_answer_key,parsed_payload,created_at,updated_at&order=created_at.desc',
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    const uploadedExams = (Array.isArray(rows) ? rows : [])
      .map(mapReadingExamRecord)
      .filter(isReadingBankExamRecord)
      .filter((exam) => canViewReadingExam(exam, viewerRole, now))
    return res.json({
      exams: [
        ...BUILT_IN_READING_EXAMS.filter((exam) => canViewReadingExam(exam, viewerRole, now)),
        ...uploadedExams
      ]
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_exams_load_error',
        message: error instanceof Error ? error.message : 'Could not load reading exams.'
      }
    })
  }
})

app.post('/api/admin/reading/exams', requireAdmin, async (req, res) => {
  try {
    const title = String(req.body?.title || '').trim()
    const rawPassageText = String(req.body?.rawPassageText || '').trim()
    const rawAnswerKey = String(req.body?.rawAnswerKey || '').trim()
    const category = normalizeReadingCategory(req.body?.category)
    const collectionTitle = normalizeReadingCollectionTitle(req.body?.collectionTitle) || 'IELTS Academic Reading May 2026'
    const releaseAt = resolveReadingReleaseAt({
      releaseAt: req.body?.releaseAt,
      collectionTitle,
      title
    })
    if (!title || !rawPassageText || !rawAnswerKey) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Title, passage text, and answer key are required.'
        }
      })
    }

    const parsedPayload = buildReadingExamPayload({
      title,
      category,
      collectionTitle,
      releaseAt,
      rawPassageText,
      rawAnswerKey
    })

    const rows = await fetchSupabaseJson('/rest/v1/reading_exams', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
      body: JSON.stringify({
        category: toReadingDatabaseCategory(category),
        title,
        raw_passage_text: rawPassageText,
        raw_answer_key: rawAnswerKey,
        parsed_payload: parsedPayload,
        created_by: normalizeOptionalUuid(req.auth?.profile?.id || req.auth?.user?.id)
      })
    })

    const created = Array.isArray(rows) ? rows[0] || null : rows
    return res.json({
      exam: mapReadingExamRecord(created)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_exam_create_error',
        message: error instanceof Error ? error.message : 'Could not create reading exam.'
      }
    })
  }
})

app.post('/api/admin/reading/exams/validate-bulk', requireAdmin, async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body?.exams) ? req.body.exams : Array.isArray(req.body) ? req.body : []
    if (rawItems.length === 0) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please provide at least one reading exam in the validation payload.'
        }
      })
    }

    if (rawItems.length > 50) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Validation is limited to 50 reading exams per request.'
        }
      })
    }

    const items = rawItems.map((item, index) => {
      const title = String(item?.title || '').trim() || `Untitled item ${index + 1}`
      const rawPassageText = String(item?.rawPassageText || '').trim()
      const rawAnswerKey = String(item?.rawAnswerKey || '').trim()
      const category = normalizeReadingCategory(item?.category)
      const collectionTitle = normalizeReadingCollectionTitle(item?.collectionTitle) || 'IELTS Academic Reading May 2026'
      const releaseAt = resolveReadingReleaseAt({
        releaseAt: item?.releaseAt,
        collectionTitle,
        title
      })

      try {
        if (!rawPassageText || !rawAnswerKey) {
          throw new Error('Missing rawPassageText or rawAnswerKey.')
        }
        const parsedPayload = buildReadingExamPayload({
          title,
          category,
          collectionTitle,
          releaseAt,
          rawPassageText,
          rawAnswerKey
        })
        return {
          index: index + 1,
          title,
          category,
          collectionTitle,
          releaseAt,
          ok: true,
          passageCount: Array.isArray(parsedPayload?.passages) ? parsedPayload.passages.length : 0,
          questionCount: Number(parsedPayload?.questionCount || 0)
        }
      } catch (error) {
        return {
          index: index + 1,
          title,
          category,
          ok: false,
          passageCount: 0,
          questionCount: 0,
          error: error instanceof Error ? error.message : 'Could not validate this exam payload.'
        }
      }
    })

    const valid = items.filter((item) => item.ok).length
    const invalid = items.length - valid

    return res.json({
      validation: {
        total: items.length,
        valid,
        invalid,
        items
      }
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_exam_bulk_validate_error',
        message: error instanceof Error ? error.message : 'Could not validate reading exams.'
      }
    })
  }
})

app.post('/api/admin/reading/exams/bulk', requireAdmin, async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body?.exams) ? req.body.exams : Array.isArray(req.body) ? req.body : []
    if (rawItems.length === 0) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please provide at least one reading exam in the bulk upload payload.'
        }
      })
    }

    if (rawItems.length > 50) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Bulk upload is limited to 50 reading exams per request.'
        }
      })
    }

    const records = rawItems.map((item, index) => {
      const title = String(item?.title || '').trim()
      const rawPassageText = String(item?.rawPassageText || '').trim()
      const rawAnswerKey = String(item?.rawAnswerKey || '').trim()
      const category = normalizeReadingCategory(item?.category)
      const collectionTitle = normalizeReadingCollectionTitle(item?.collectionTitle) || 'IELTS Academic Reading May 2026'
      const releaseAt = resolveReadingReleaseAt({
        releaseAt: item?.releaseAt,
        collectionTitle,
        title
      })

      if (!title || !rawPassageText || !rawAnswerKey) {
        throw new Error(
          `Bulk item ${index + 1} is missing title, rawPassageText, or rawAnswerKey.`
        )
      }

      return {
        category: toReadingDatabaseCategory(category),
        title,
        raw_passage_text: rawPassageText,
        raw_answer_key: rawAnswerKey,
        parsed_payload: buildReadingExamPayload({
          title,
          category,
          collectionTitle,
          releaseAt,
          rawPassageText,
          rawAnswerKey
        }),
        created_by: normalizeOptionalUuid(req.auth?.profile?.id || req.auth?.user?.id)
      }
    })

    const rows = await fetchSupabaseJson('/rest/v1/reading_exams', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
      body: JSON.stringify(records)
    })

    return res.json({
      exams: (Array.isArray(rows) ? rows : []).map(mapReadingExamRecord)
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_exam_bulk_create_error',
        message: error instanceof Error ? error.message : 'Could not bulk upload reading exams.'
      }
    })
  }
})

app.delete('/api/admin/reading/exams/:examId', requireAdmin, async (req, res) => {
  try {
    const examId = normalizeOptionalUuid(req.params.examId)
    if (!examId) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'A valid reading exam id is required.'
        }
      })
    }

    await supabaseRequest(`/rest/v1/reading_exams?id=eq.${encodeURIComponent(examId)}`, {
      method: 'DELETE',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=minimal' })
    })

    return res.json({
      success: true,
      examId
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'reading_exam_delete_error',
        message: error instanceof Error ? error.message : 'Could not delete reading exam.'
      }
    })
  }
})

app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.get('/api/speaking-sample-videos', requireAuth, async (_req, res) => {
  try {
    const records = await loadSpeakingSampleVideoRecords()
    const items = await Promise.all(
      records
        .filter((item) => item?.objectPath)
        .sort((a, b) => String(a.topicTitle || '').localeCompare(String(b.topicTitle || '')))
        .map(signSpeakingSampleVideoItem)
    )
    return res.json({ items })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_catalog_error',
        message: error instanceof Error ? error.message : 'Could not load speaking sample videos.'
      }
    })
  }
})

app.get('/api/speaking-sample-videos/:topicId/blob', async (req, res) => {
  try {
    const topicId = String(req.params?.topicId || '').trim()
    if (!topicId) {
      return res.status(400).json({
        error: { status: 400, type: 'validation_error', message: 'topicId is required.' }
      })
    }
    const existing = await findSpeakingSampleVideoRecordByTopicId(topicId)
    if (!existing?.objectPath) {
      return res.status(404).json({
        error: { status: 404, type: 'not_found', message: 'No speaking sample video found for this topic.' }
      })
    }
    if (!verifySpeakingSampleVideoPlaybackSignature(existing, req.query)) {
      return res.status(403).json({
        error: { status: 403, type: 'forbidden', message: 'This speaking sample video link has expired. Refresh the page and try again.' }
      })
    }
    return sendSpeakingSampleVideoBlob(req, res, existing)
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_blob_error',
        message: error instanceof Error ? error.message : 'Could not load speaking sample video.'
      }
    })
  }
})

app.get('/api/admin/speaking-sample-videos', requireAdmin, async (_req, res) => {
  try {
    const records = await loadSpeakingSampleVideoRecords({ forceRefresh: true })
    const items = await Promise.all(
      records
        .filter((item) => item?.objectPath)
        .sort((a, b) => String(a.topicTitle || '').localeCompare(String(b.topicTitle || '')))
        .map(signSpeakingSampleVideoItem)
    )
    return res.json({ items })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'admin_speaking_sample_video_catalog_error',
        message: error instanceof Error ? error.message : 'Could not load speaking sample videos.'
      }
    })
  }
})

app.post('/api/admin/speaking-sample-videos/transcribe', requireAdmin, videoUpload.single('video'), async (req, res) => {
  const tempFilePath = req.file?.path
  try {
    const file = req.file
    if (!file?.path || Number(file.size || 0) < 1024) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Recorded video is missing or too short for transcription.'
        }
      })
    }
    const uploadType = normalizeUploadedVideoMimeType(file)
    const mimeType = uploadType.mimeType
    if (!mimeType.startsWith('video/') && !mimeType.startsWith('audio/')) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please upload an audio or video recording for transcription.'
        }
      })
    }
    if (mimeType.startsWith('video/') && !uploadType.isVideo) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please upload a valid video recording.'
        }
      })
    }

    const buffer = await fs.promises.readFile(file.path)
    const transcription = await transcribeWithBestProvider({
      audioBase64: buffer.toString('base64'),
      audioMimeType: mimeType,
      preferWordTimestamps: true
    })
    const transcript = String(transcription?.result?.whisperTranscript || '').trim()
    if (!transcript) {
      return res.status(502).json({
        error: {
          status: 502,
          type: 'empty_transcript',
          message: 'Backend transcription returned empty text.'
        }
      })
    }
    const trimStartSeconds = Math.max(0, Number(req.body?.trimStartSeconds || 0) || 0)
    const requestedTrimEnd = Math.max(trimStartSeconds, Number(req.body?.trimEndSeconds || 0) || 0)
    const durationHint = Math.max(0, Number(req.body?.durationSeconds || 0) || 0)
    const trimEndSeconds =
      requestedTrimEnd > trimStartSeconds
        ? requestedTrimEnd
        : durationHint > trimStartSeconds
          ? durationHint
          : requestedTrimEnd
    const subtitles = buildSpeakingSampleSubtitlesFromWords({
      words: transcription?.result?.words || [],
      transcript,
      trimStartSeconds,
      trimEndSeconds
    })

    return res.json({
      provider: String(transcription?.provider || 'unknown'),
      model: String(transcription?.engine || transcription?.result?.model || 'unknown'),
      confidenceQuality: Number(transcription?.quality || 0),
      transcript,
      subtitles,
      words: transcription?.result?.words || []
    })
  } catch (error) {
    const status = Number(error?.status) || 500
    const message = error?.error?.message || error?.message || 'Could not transcribe speaking sample video.'
    return res.status(status).json({
      error: {
        status,
        type: error?.type || 'speaking_sample_video_transcription_error',
        message
      }
    })
  } finally {
    if (tempFilePath) {
      fs.promises.unlink(tempFilePath).catch(() => undefined)
    }
  }
})

app.post('/api/admin/speaking-sample-videos', requireAdmin, videoUpload.single('video'), async (req, res) => {
  const tempFilePath = req.file?.path
  try {
    const normalized = normalizeSpeakingSampleVideoInput(req.body || {})
    const file = req.file
    if (!normalized) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'topicId and topicTitle are required before uploading a speaking sample video.'
        }
      })
    }
    if (!file?.path || Number(file.size || 0) < 1024) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Recorded video is missing or too short.'
        }
      })
    }
    const uploadType = normalizeUploadedVideoMimeType(file)
    const mimeType = uploadType.mimeType
    if (!uploadType.isVideo || !looksLikeVideoFile(file.path, mimeType)) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please upload a video recording.'
        }
      })
    }

    const now = new Date().toISOString()
    const extension = getVideoExtensionFromMimeType(mimeType)
    const objectPath = `part2/${slugifyAudioSegment(normalized.topicId)}/${Date.now()}-${randomUUID()}.${extension}`
    const checksumSha256 = await hashFileSha256(file.path)
    await uploadSpeakingSampleVideoFile({
      objectPath,
      filePath: file.path,
      mimeType
    })

    const manifest = await loadSpeakingSampleVideoManifest({ forceRefresh: true })
    const previous = manifest.items?.[normalized.topicId]
    const item = {
      id: normalized.topicId,
      topicId: normalized.topicId,
      topicTitle: normalized.topicTitle,
      prompt: normalized.prompt,
      objectPath,
      videoUrl: '',
      mimeType,
      sizeBytes: Number(file.size || 0),
      durationSeconds: normalized.durationSeconds,
      trimStartSeconds: normalized.trimStartSeconds,
      trimEndSeconds: normalized.trimEndSeconds,
      videoDeviceLabel: normalized.videoDeviceLabel,
      audioDeviceLabel: normalized.audioDeviceLabel,
      backgroundBlurEnabled: normalized.backgroundBlurEnabled,
      transcript: normalized.transcript,
      subtitles: normalized.subtitles,
      subtitleStyle: normalized.subtitleStyle,
      version: Number(previous?.version || 0) + 1,
      storageProvider: 'supabase',
      checksumSha256,
      isActive: true,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
      uploadedBy: req.auth?.user?.email || req.auth?.profile?.email || 'admin'
    }
    const saved = await saveSpeakingSampleVideoRecord(item, {
      createdBy: normalizeOptionalUuid(req.auth?.profile?.id || req.auth?.user?.id)
    })
    const savedItem = {
      ...item,
      ...saved.item,
      createdAt: saved.item.createdAt || item.createdAt,
      updatedAt: saved.item.updatedAt || item.updatedAt,
      uploadedBy: saved.item.uploadedBy || item.uploadedBy
    }
    manifest.items[normalized.topicId] = savedItem
    await saveSpeakingSampleVideoManifest(manifest)
    const previousObjectPath = saved.previousObjectPath || previous?.objectPath || ''
    if (previousObjectPath && previousObjectPath !== objectPath) {
      deleteSpeakingSampleVideoObject(previousObjectPath).catch((cleanupError) => {
        console.error('Could not delete replaced speaking sample video:', cleanupError)
      })
    }

    return res.json({ item: await signSpeakingSampleVideoItem(savedItem) })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_upload_error',
        message: error instanceof Error ? error.message : 'Could not upload speaking sample video.'
      }
    })
  } finally {
    if (tempFilePath) {
      fs.promises.unlink(tempFilePath).catch(() => undefined)
    }
  }
})

app.get('/api/admin/speaking-sample-videos/:topicId/blob', requireAdmin, async (req, res) => {
  try {
    const topicId = String(req.params?.topicId || '').trim()
    if (!topicId) {
      return res.status(400).json({
        error: { status: 400, type: 'validation_error', message: 'topicId is required.' }
      })
    }
    const existing = await findSpeakingSampleVideoRecordByTopicId(topicId, { forceRefresh: true })
    if (!existing?.objectPath) {
      return res.status(404).json({
        error: { status: 404, type: 'not_found', message: 'No speaking sample video found for this topic.' }
      })
    }
    return sendSpeakingSampleVideoBlob(req, res, existing)
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_blob_error',
        message: error instanceof Error ? error.message : 'Could not load speaking sample video.'
      }
    })
  }
})

app.patch('/api/admin/speaking-sample-videos/:topicId', requireAdmin, async (req, res) => {
  try {
    const topicId = String(req.params?.topicId || '').trim()
    if (!topicId) {
      return res.status(400).json({
        error: { status: 400, type: 'validation_error', message: 'topicId is required.' }
      })
    }
    const records = await loadSpeakingSampleVideoRecords({ forceRefresh: true })
    const existing = records.find((item) => String(item.topicId) === topicId)
    if (!existing?.objectPath) {
      return res.status(404).json({
        error: { status: 404, type: 'not_found', message: 'No speaking sample video found for this topic.' }
      })
    }

    const trimStartSeconds = Math.max(0, Number(req.body?.trimStartSeconds ?? existing.trimStartSeconds ?? 0) || 0)
    const trimEndSeconds = Math.max(
      trimStartSeconds,
      Number(req.body?.trimEndSeconds ?? existing.trimEndSeconds ?? existing.durationSeconds ?? 0) || 0
    )
    const transcript = String(req.body?.transcript ?? existing.transcript ?? '').slice(0, 50000)
    const subtitles = req.body?.subtitlesJson
      ? normalizeSpeakingSampleSubtitles(req.body.subtitlesJson)
      : existing.subtitles || []
    const subtitleStyle = req.body?.subtitleStyleJson
      ? normalizeSpeakingSampleSubtitleStyle(req.body.subtitleStyleJson)
      : existing.subtitleStyle || {}

    const now = new Date().toISOString()
    const item = {
      ...existing,
      trimStartSeconds,
      trimEndSeconds,
      transcript,
      subtitles,
      subtitleStyle,
      version: Number(existing.version || 0) + 1,
      updatedAt: now
    }

    try {
      await supabaseRequest(`/rest/v1/speaking_sample_videos?topic_id=eq.${encodeURIComponent(topicId)}`, {
        method: 'PATCH',
        headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
        body: JSON.stringify({
          trim_start_seconds: trimStartSeconds,
          trim_end_seconds: trimEndSeconds,
          transcript,
          subtitles,
          subtitle_style: subtitleStyle,
          version: item.version,
          updated_at: now
        })
      })
    } catch (error) {
      if (!isMissingSupabaseRelationError(error)) throw error
    }

    const manifest = await loadSpeakingSampleVideoManifest({ forceRefresh: true })
    manifest.items[topicId] = item
    await saveSpeakingSampleVideoManifest(manifest)

    return res.json({ item: await signSpeakingSampleVideoItem(item) })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_update_error',
        message: error instanceof Error ? error.message : 'Could not update speaking sample video.'
      }
    })
  }
})

app.delete('/api/admin/speaking-sample-videos/:topicId', requireAdmin, async (req, res) => {
  try {
    const topicId = String(req.params?.topicId || '').trim()
    if (!topicId) {
      return res.status(400).json({
        error: { status: 400, type: 'validation_error', message: 'topicId is required.' }
      })
    }
    const records = await loadSpeakingSampleVideoRecords({ forceRefresh: true })
    const existing = records.find((item) => String(item.topicId) === topicId)
    if (!existing?.objectPath) {
      return res.status(404).json({
        error: { status: 404, type: 'not_found', message: 'No speaking sample video found for this topic.' }
      })
    }

    const now = new Date().toISOString()
    try {
      await supabaseRequest(`/rest/v1/speaking_sample_videos?topic_id=eq.${encodeURIComponent(topicId)}`, {
        method: 'PATCH',
        headers: buildSupabaseHeaders({ serviceRole: true }),
        body: JSON.stringify({
          is_active: false,
          deleted_at: now,
          updated_at: now
        })
      })
    } catch (error) {
      if (!isMissingSupabaseRelationError(error)) throw error
    }

    const manifest = await loadSpeakingSampleVideoManifest({ forceRefresh: true })
    if (manifest.items?.[topicId]) {
      delete manifest.items[topicId]
      await saveSpeakingSampleVideoManifest(manifest)
    }
    deleteSpeakingSampleVideoObject(existing.objectPath).catch((cleanupError) => {
      console.error('Could not delete speaking sample video object:', cleanupError)
    })

    return res.json({ ok: true, topicId })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'speaking_sample_video_delete_error',
        message: error instanceof Error ? error.message : 'Could not delete speaking sample video.'
      }
    })
  }
})

app.get('/api/admin/tts/catalog', requireAdmin, async (_req, res) => {
  try {
    const manifest = await loadQuestionAudioManifest()
    const items = Object.values(manifest.items || {}).sort((a, b) =>
      String(a.section || '').localeCompare(String(b.section || '')) ||
      String(a.topicTitle || '').localeCompare(String(b.topicTitle || '')) ||
      String(a.question || '').localeCompare(String(b.question || ''))
    )
    return res.json({ items })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'tts_catalog_error',
        message: error instanceof Error ? error.message : 'Could not load TTS catalog.'
      }
    })
  }
})

app.post('/api/admin/tts/generate', requireAdmin, async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : req.body?.item ? [req.body.item] : []
    const force = Boolean(req.body?.force)
    if (!items.length) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'At least one question audio item is required.'
        }
      })
    }
    if (items.length > 20) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Please generate at most 20 question audios in one batch.'
        }
      })
    }

    const results = []
    for (const item of items) {
      const listeningSectionNumber = isListeningSectionAudioItem(item)
        ? getListeningSectionNumberFromAudioItem(item)
        : 0
      const asset = await getOrCreateQuestionAudioAsset(item, {
        allowGenerate: true,
        force,
        audioBufferFactory: listeningSectionNumber
          ? (normalizedItem) =>
              generateListeningSectionTtsAudioBuffer({
                text: normalizedItem.text,
                section: listeningSectionNumber
              })
          : undefined
      })
      results.push(asset)
    }

    return res.json({
      items: results,
      generatedCount: results.filter((item) => !item.cached).length,
      cachedCount: results.filter((item) => item.cached).length
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'tts_generation_error',
        message: error instanceof Error ? error.message : 'Could not generate question audio.'
      }
    })
  }
})

app.post('/api/tts/question-audio', requireAuth, async (req, res) => {
  try {
    const asset = await getOrCreateQuestionAudioAsset(req.body || {}, { allowGenerate: true })
    return res.json({
      audioUrl: asset.audioUrl,
      cached: asset.cached
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'tts_question_audio_error',
        message: error instanceof Error ? error.message : 'Could not prepare question audio.'
      }
    })
  }
})

app.post('/api/tts/listening-section-audio', requireAuth, async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim()
    const section = Number(req.body?.section || 0)
    const cacheKey = String(req.body?.cacheKey || req.body?.key || '').trim()
    if (!text || !cacheKey || !section) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'cacheKey, section, and text are required for listening section audio.'
        }
      })
    }

    const asset = await getOrCreateQuestionAudioAsset(
      {
        cacheKey,
        text,
        section: `listening-section-${section}`,
        topicId: req.body?.topicId || cacheKey,
        topicTitle: req.body?.topicTitle || `Listening Section ${section}`
      },
      {
        allowGenerate: true,
        audioBufferFactory: () => generateListeningSectionTtsAudioBuffer({ text, section })
      }
    )

    return res.json({
      audioUrl: asset.audioUrl,
      cached: asset.cached
    })
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        type: 'listening_section_tts_error',
        message: error instanceof Error ? error.message : 'Could not prepare listening section audio.'
      }
    })
  }
})

app.post('/api/tts', async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim()
    if (!text) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Text is required for TTS generation'
        }
      })
    }

    const audioBuffer = await generateDeepgramTtsAudioBuffer(text)
    res.setHeader('Content-Type', 'audio/mpeg')
    return res.send(audioBuffer)
  } catch (error) {
    return res.status(500).json({
      error: {
        status: 500,
        type: 'deepgram_tts_error',
        message: error instanceof Error ? error.message : String(error)
      }
    })
  }
})

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!process.env.IFLYTEK_APP_ID || !process.env.IFLYTEK_API_KEY || !process.env.IFLYTEK_API_SECRET) {
      return res.status(500).json({
        error: {
          status: 500,
          type: 'configuration_error',
          message: 'Missing IFLYTEK_APP_ID, IFLYTEK_API_KEY, or IFLYTEK_API_SECRET on backend environment'
        }
      })
    }

    const file = req.file
    if (!file?.buffer || file.buffer.byteLength < 1024) {
      return res.status(400).json({
        error: {
          status: 400,
          type: 'validation_error',
          message: 'Audio file is missing or too short'
        }
      })
    }

    const transcription = await transcribeWithBestProvider({
      audioBase64: file.buffer.toString('base64'),
      audioMimeType: file.mimetype || 'audio/webm'
    })

    const text = String(transcription?.result?.whisperTranscript || '').trim()
    if (!text) {
      return res.status(502).json({
        error: {
          status: 502,
          type: 'empty_transcript',
          message: 'ENGLISH PLAN transcription returned empty text'
        }
      })
    }

    return res.json({
      provider: String(transcription?.provider || 'unknown'),
      model: String(transcription?.engine || transcription?.result?.model || 'unknown'),
      confidenceQuality: Number(transcription?.quality || 0),
      text
    })
  } catch (error) {
    const status = Number(error?.status) || 500
    const type = error?.type || error?.error?.type || 'english_plan_transcription_error'
    const message = error?.error?.message || error?.message || 'Unknown ENGLISH PLAN transcription error'
    console.error('Transcription error:', { status, type, message })
    return res.status(status).json({
      error: {
        status,
        type,
        message
      }
    })
  }
})

app.get('/api/english-plan/health', async (req, res) => {
  try {
    if (!process.env.IFLYTEK_APP_ID || !process.env.IFLYTEK_API_KEY || !process.env.IFLYTEK_API_SECRET) {
      return res.status(500).json({
        ok: false,
        message: 'Missing IFLYTEK_APP_ID, IFLYTEK_API_KEY, or IFLYTEK_API_SECRET on backend environment'
      })
    }
    const configuredIseHost = String(process.env.IFLYTEK_ISE_HOST || 'ise-api-sg.xf-yun.com').trim()
    const configuredIsePath = String(process.env.IFLYTEK_ISE_PATH || '/v2/ise').trim()
    const configuredIatHost = String(process.env.IFLYTEK_IAT_HOST || 'iat-api-sg.xf-yun.com').trim()
    const configuredIatPath = String(process.env.IFLYTEK_IAT_PATH || '/v2/iat').trim()
    const endpoints = [
      { host: configuredIseHost, path: configuredIsePath, label: 'configured-ise' },
      { host: configuredIatHost, path: configuredIatPath, label: 'configured-iat' },
      { host: 'ise-api.xfyun.cn', path: '/v2/ise', label: 'cn-ise-fallback' },
      { host: 'iat-api.xfyun.cn', path: '/v2/iat', label: 'cn-iat-fallback' }
    ].filter((item, index, arr) => arr.findIndex((x) => x.host === item.host && x.path === item.path) === index)

    const diagnostics = []
    for (const endpoint of endpoints) {
      try {
        const probe = await probeEnglishPlanEndpoint(endpoint)
        diagnostics.push({ endpoint: probe.endpoint, ok: true, label: endpoint.label, warning: probe.warning || '' })
        return res.json({
          ok: true,
          message: `ENGLISH PLAN connected successfully at ${probe.endpoint}`,
          diagnostics
        })
      } catch (error) {
        const message = sanitizeErrorMessage(error instanceof Error ? error.message : String(error))
        diagnostics.push({ endpoint: `${endpoint.host}${endpoint.path}`, ok: false, message, label: endpoint.label })
      }
    }

    return res.status(502).json({
      ok: false,
      message: 'ENGLISH PLAN connection failed on all known endpoints.',
      diagnostics
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: sanitizeErrorMessage(error instanceof Error ? error.message : String(error))
    })
  }
})

const updateAssessmentJob = (jobId, patch) => {
  const current = assessmentJobs.get(jobId)
  if (!current) return
  const nextProgress =
    typeof patch.progress === 'number'
      ? Math.max(Number(current.progress || 0), Number(patch.progress || 0))
      : current.progress
  const next = {
    ...current,
    ...patch,
    progress: nextProgress
  }
  if (patch.message && patch.message !== current.message) {
    next.messages = [...(current.messages || []), patch.message]
  }
  assessmentJobs.set(jobId, next)
}

const pruneAssessmentJobs = () => {
  const now = Date.now()
  for (const [jobId, job] of assessmentJobs.entries()) {
    const createdAt = Number(job.createdAt || now)
    if (now - createdAt > ASSESSMENT_JOB_TTL_MS) {
      assessmentJobs.delete(jobId)
    }
  }
}

const runAssessment = async (
  {
    topic,
    prompt,
    cues,
    testMode,
    transcript,
    questionResponses,
    durationSeconds,
    audioBase64,
    audioMimeType,
    assessmentMode
  },
  onProgress = () => {}
) => {
  onProgress(5, 'Examining your grammar.')
  onProgress(8, 'กำลังตรวจสอบไวยากรณ์ของคำตอบคุณ')
  const usageTracker = createApiUsageTracker()

  let rawTranscript = String(transcript || '').trim()
  let whisperTranscript = ''
  let pronunciationSignalBand = 5.5
  let pronunciationBand = 5.5
  let pronunciationMetrics = null
  let pronunciationEstimate = null
  let wordAnalysis = []
  let pronunciationEngine = 'none'
  let pronunciationFallbackReason = ''

  if (audioBase64) {
    try {
      onProgress(15, 'Moving on to pronunciation analysis.')
      const transcription = await transcribeWithBestProvider({ audioBase64, audioMimeType, usageTracker })
      const whisperResult = transcription.result
      whisperTranscript = String(whisperResult?.whisperTranscript || '').trim()
      rawTranscript = whisperTranscript || rawTranscript
      pronunciationSignalBand = whisperResult?.pronunciationSignalBand || 6
      const pronunciationResult = estimatePronunciationFromTranscript({
        transcript: rawTranscript,
        whisperJson: whisperResult?.raw || { words: whisperResult?.words || [] },
        durationSeconds: Number(durationSeconds || 0)
      })
      pronunciationEstimate = {
        wordCount: pronunciationResult.wordCount,
        pronunciationIssueCount: pronunciationResult.pronunciationIssueCount,
        pronunciationMistakeRate: pronunciationResult.pronunciationMistakeRate,
        estimatedPronunciationBand: roundPronunciationBand(pronunciationResult.estimatedPronunciationBand),
        mispronouncedOrUnclearWords: pronunciationResult.mispronouncedOrUnclearWords,
        confidence: pronunciationResult.confidence,
        note: pronunciationResult.note
      }
      pronunciationBand = clampBand(roundPronunciationBand(pronunciationResult.estimatedPronunciationBand))
      pronunciationMetrics = pronunciationResult.metrics
      wordAnalysis = pronunciationResult.wordAnalysis
      pronunciationEngine = transcription.engine
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      pronunciationFallbackReason = sanitizeErrorMessage(reason)
      if (!rawTranscript) {
        throw new Error(pronunciationFallbackReason)
      }
      const providedEstimate = estimatePronunciationFromTranscript({
        transcript: rawTranscript,
        whisperJson: null,
        durationSeconds: Number(durationSeconds || 0)
      })
      pronunciationEstimate = {
        wordCount: providedEstimate.wordCount,
        pronunciationIssueCount: providedEstimate.pronunciationIssueCount,
        pronunciationMistakeRate: providedEstimate.pronunciationMistakeRate,
        estimatedPronunciationBand: roundPronunciationBand(providedEstimate.estimatedPronunciationBand),
        mispronouncedOrUnclearWords: providedEstimate.mispronouncedOrUnclearWords,
        confidence: 'low',
        note: providedEstimate.note
      }
      pronunciationEngine = 'google-transcription-unavailable'
      pronunciationBand = clampBand(roundPronunciationBand(providedEstimate.estimatedPronunciationBand))
      pronunciationMetrics = providedEstimate.metrics
      wordAnalysis = providedEstimate.wordAnalysis
    }
  }

  if (!audioBase64 && rawTranscript) {
    const providedEstimate = estimatePronunciationFromTranscript({
      transcript: rawTranscript,
      whisperJson: null,
      durationSeconds: Number(durationSeconds || 0)
    })
    pronunciationEstimate = {
      wordCount: providedEstimate.wordCount,
      pronunciationIssueCount: providedEstimate.pronunciationIssueCount,
      pronunciationMistakeRate: providedEstimate.pronunciationMistakeRate,
      estimatedPronunciationBand: roundPronunciationBand(providedEstimate.estimatedPronunciationBand),
      mispronouncedOrUnclearWords: providedEstimate.mispronouncedOrUnclearWords,
      confidence: 'low',
      note: providedEstimate.note
    }
    pronunciationEngine = 'browser-stt-fallback'
    pronunciationBand = clampBand(roundPronunciationBand(providedEstimate.estimatedPronunciationBand))
    pronunciationMetrics = providedEstimate.metrics
    wordAnalysis = providedEstimate.wordAnalysis
  }

  if (!rawTranscript) {
    throw new Error(
      `No transcript available. Please record your speech again. ${pronunciationFallbackReason ? `(${pronunciationFallbackReason})` : ''}`.trim()
    )
  }

  let punctuatedTranscript = rawTranscript
  let questionBreakdown = []
  const punctuationErrors = []
  onProgress(22, 'Resolving likely transcript mishears without correcting student grammar.')
  onProgress(30, 'Collecting information on fluency and coherence.')
  const punctuationProviders = [{ name: 'gemini-cleanup', call: callGeminiCleanupText }]
  const normalizedQuestionResponses = Array.isArray(questionResponses)
    ? questionResponses
        .map((item) => ({
          question: String(item?.question || '').trim(),
          response: String(item?.response || '').trim()
        }))
        .filter((item) => item.question || item.response)
    : []

  if (normalizedQuestionResponses.length > 0) {
    for (const provider of punctuationProviders) {
      try {
        const punctuatedItems = await Promise.all(
          normalizedQuestionResponses.map(async (item) => {
            const fixed = await provider.call(
              punctuationPrompt({ rawTranscript: item.response }),
              usageTracker
            )
            return {
              question: item.question,
              rawTranscript: item.response,
              punctuatedTranscript: fixed || item.response
            }
          })
        )
        questionBreakdown = punctuatedItems
        punctuatedTranscript = punctuatedItems.map((item) => item.punctuatedTranscript).join('\n\n')
        break
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        punctuationErrors.push(`${provider.name}: ${message}`)
      }
    }
  }

  if (!questionBreakdown.length) {
    for (const provider of punctuationProviders) {
      try {
        punctuatedTranscript = await provider.call(punctuationPrompt({ rawTranscript }), usageTracker)
        break
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        punctuationErrors.push(`${provider.name}: ${message}`)
      }
    }
  }

  onProgress(55, 'Running rubric scoring and checklist generation.')
  const comparisons = {}
  const errors = []
  try {
    const normalizedAssessmentMode = String(assessmentMode || 'standard')
    const buildGeminiReport = async () =>
      normalizedAssessmentMode === 'fullMock'
        ? await buildFullMockAssessmentReport({
            topic,
            prompt,
            cues: Array.isArray(cues) ? cues : [],
            punctuatedTranscript,
            whisperTranscript,
            durationSeconds: Number(durationSeconds || 0),
            questionBreakdown,
            punctuationErrors,
            pronunciationBand,
            onProgress,
            usageTracker
          })
        : normalizedAssessmentMode === 'trialSpeaking'
          ? await buildFinalReport({
              result: await callGemini(
                trialSpeakingRubricPrompt({
                  topic,
                  prompt,
                  cues: Array.isArray(cues) ? cues : [],
                  punctuatedTranscript,
                  whisperTranscript,
                  durationSeconds: Number(durationSeconds || 0),
                  questionBreakdown
                }),
                usageTracker
              ),
              testMode: 'part2',
              pronunciationBand,
              pronunciationEngine,
              pronunciationFallbackReason,
              pronunciationMetrics,
              pronunciationEstimate,
              wordAnalysis,
              punctuatedTranscript,
              punctuationErrors,
              questionBreakdown
            })
          : await buildFinalReport({
              result: await callGemini(
                rubricPrompt({
                  testMode: String(testMode || 'part2'),
                  topic,
                  prompt,
                  cues: Array.isArray(cues) ? cues : [],
                  punctuatedTranscript,
                  whisperTranscript,
                  durationSeconds: Number(durationSeconds || 0),
                  questionBreakdown
                }),
                usageTracker
              ),
              testMode: String(testMode || 'part2'),
              pronunciationBand,
              pronunciationEngine,
              pronunciationFallbackReason,
              pronunciationMetrics,
              pronunciationEstimate,
              wordAnalysis,
              punctuatedTranscript,
              punctuationErrors,
              questionBreakdown
            })
    const geminiReport = await runGeminiAssessmentReportWithRetries({
      buildReport: buildGeminiReport,
      onProgress
    })
    comparisons.gemini = geminiReport
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`gemini: ${message}`)
    comparisons.gemini = await buildFinalReport({
      result: generateFallbackAssessment({
        punctuatedTranscript,
        topic,
        providerReason: message,
        testMode: String(testMode || 'part2')
      }),
      testMode: String(testMode || 'part2'),
      pronunciationBand,
      pronunciationEngine,
      pronunciationFallbackReason,
      pronunciationMetrics,
      pronunciationEstimate,
      wordAnalysis,
      punctuatedTranscript,
      punctuationErrors,
      questionBreakdown
    })
  }

  const primaryProvider = 'gemini'
  const primaryReport = comparisons[primaryProvider]
  if (primaryReport) {
    const enrichedQuestionBreakdown = await buildTranscriptAnnotations({
      testMode: String(testMode || 'part2'),
      questionBreakdown: primaryReport.questionBreakdown || [],
      part3AnswerCoaching: primaryReport.part3AnswerCoaching || [],
      componentReports: primaryReport.componentReports || {},
      usageTracker
    })
    const enrichedVocabularySuggestions = await buildCustomVocabularySuggestions({
      testMode: String(testMode || 'part2'),
      punctuatedTranscript: primaryReport.punctuatedTranscript || punctuatedTranscript,
      questionBreakdown: enrichedQuestionBreakdown,
      usageTracker
    })
    const topFixes = buildTopFixesFromReport({
      componentReports: primaryReport.componentReports || {},
      questionBreakdown: enrichedQuestionBreakdown,
      vocabularyLevelUpSuggestions: enrichedVocabularySuggestions,
      punctuatedTranscript: primaryReport.punctuatedTranscript || punctuatedTranscript
    })
    comparisons[primaryProvider] = {
      ...primaryReport,
      questionBreakdown: enrichedQuestionBreakdown,
      vocabularyLevelUpSuggestions: enrichedVocabularySuggestions,
      topFixes
    }
  }
  onProgress(92, 'Generating your detailed score report.')

  onProgress(100, 'Your report is ready.')
  return {
    ...comparisons[primaryProvider],
    primaryProvider,
    comparisons,
    comparisonErrors: errors,
    apiUsage: usageTracker.summarize()
  }
}

app.post('/api/assess', requireAuth, async (req, res) => {
  try {
    pruneAssessmentJobs()
    if (String(req.auth.profile?.role || 'student') !== 'admin') {
      ensureActiveStudentAccess(req.auth.profile)
      await decrementLearnerCredits({
        userId: req.auth.user.id,
        assessmentMode: req.body?.assessmentMode
      })
    }
    const result = await runAssessment(req.body || {})
    try {
      await persistAssessmentReportForUser({
        userId: req.auth.user.id,
        profile: req.auth.profile,
        requestBody: req.body || {},
        result
      })
    } catch (persistError) {
      console.error('Could not persist assessment report:', persistError)
    }
    return res.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(500).json({ error: message })
  }
})

app.post('/api/assess/start', requireAuth, async (req, res) => {
  pruneAssessmentJobs()
  try {
    if (String(req.auth.profile?.role || 'student') !== 'admin') {
      await decrementLearnerCredits({
        userId: req.auth.user.id,
        assessmentMode: req.body?.assessmentMode
      })
    }
  } catch (error) {
    return res.status(403).json({
      error: {
        status: 403,
        type: 'credit_error',
        message: error instanceof Error ? error.message : 'Could not consume credits.'
      }
    })
  }
  const jobId = randomUUID()
  assessmentJobs.set(jobId, {
    userId: req.auth.user.id,
    createdAt: Date.now(),
    status: 'processing',
    progress: 1,
    message: 'Loading Analysis Messages',
    messages: ['Loading Analysis Messages']
  })

  void runAssessment(req.body || {}, (progress, message) => {
    updateAssessmentJob(jobId, {
      progress: Math.max(1, Math.min(100, Math.round(progress))),
      message
    })
  })
    .then((result) => {
      void persistAssessmentReportForUser({
        userId: req.auth.user.id,
        profile: req.auth.profile,
        requestBody: req.body || {},
        result
      }).catch((persistError) => {
        console.error('Could not persist assessment report:', persistError)
      })
      updateAssessmentJob(jobId, {
        status: 'completed',
        progress: 100,
        message: 'Your report is ready.',
        result
      })
    })
    .catch((error) => {
      updateAssessmentJob(jobId, {
        status: 'failed',
        progress: 100,
        message: 'Assessment failed.',
        error: error instanceof Error ? error.message : String(error)
      })
    })

  return res.json({ jobId })
})

app.get('/api/assess/status/:jobId', requireAuth, (req, res) => {
  pruneAssessmentJobs()
  const job = assessmentJobs.get(req.params.jobId)
  if (!job) return res.status(404).json({ error: 'Assessment job not found' })
  if (job.userId && job.userId !== req.auth.user.id) {
    return res.status(403).json({ error: 'Assessment job does not belong to this user.' })
  }
  return res.json(job)
})

app.use((error, _req, res, next) => {
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      error: `Upload payload is too large. Current JSON request limit is ${requestBodyLimit}.`
    })
  }
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: {
        status: 413,
        type: 'upload_too_large',
        message: `Uploaded file is too large. Speaking sample videos must be under ${Math.round(
          MAX_SPEAKING_SAMPLE_VIDEO_BYTES / (1024 * 1024)
        )} MB.`
      }
    })
  }
  return next(error)
})

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(distDir))

  app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(indexHtmlPath)
  })
}

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`English Plan server running on http://localhost:${port}`)
  })
}

export default app
