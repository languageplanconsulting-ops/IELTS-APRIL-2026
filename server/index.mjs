import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createHmac, randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import WebSocket from 'ws'

dotenv.config()

const app = express()
const port = process.env.PORT || 8787
const assessmentJobs = new Map()
const ASSESSMENT_JOB_TTL_MS = 1000 * 60 * 30
const DEFAULT_FEEDBACK_CREDITS = 50
const DEFAULT_FULL_MOCK_CREDITS = 15
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })
const ADMIN_PANEL_CODE = String(process.env.ADMIN_PANEL_CODE || 'englishplanforeover').trim()
const ADMIN_CODE_TOKEN_PREFIX = 'admin-code:'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
const indexHtmlPath = path.join(distDir, 'index.html')
const isDirectRun = process.argv[1] ? path.resolve(process.argv[1]) === __filename : false

app.use(cors())
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || '25mb'
app.use(express.json({ limit: requestBodyLimit }))

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
Band 9: referencing > 4 ถูกต้องทั้งหมด พูด >= 310 คำ ลื่นไหลต่อเนื่อง (hesitation ตามธรรมชาติเล็กน้อยยอมรับได้)
Band 8: referencing > 3 ถูกต้อง พูด >= 280 คำ มี self-correction ได้ถ้าทำให้ความหมายชัดขึ้น
Band 7: พูด >= 250 คำ ใช้ referencing อย่างน้อย 2 ครั้งถูกต้อง มี pause/filler ตามธรรมชาติได้
Band 6: พูด 200-250 คำ referencing ไม่มีหรือผิดบางครั้ง มี hesitation/filler ได้หากไม่รบกวนความเข้าใจ
Band 5: พูด < 200 คำ referencing ไม่มีหรือผิดบ่อย ความลื่นไหลสะดุดจนกระทบความเข้าใจ
Band 4: พูด < 200 คำ referencing ไม่มีหรือผิดแทบทั้งหมด ความลื่นไหลสะดุดรุนแรงและรบกวนความเข้าใจชัดเจน
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
  if (['passage1', 'passage2', 'passage3', 'fulltest'].includes(normalized)) return normalized
  return 'fulltest'
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

const canonicalizeReadingCorrectAnswer = (value) => {
  const normalized = normalizeReadingAnswer(value)
  if (!normalized) return ''
  if (normalized.startsWith('NOT GIVEN')) return 'NOT GIVEN'
  if (normalized.startsWith('TRUE')) return 'TRUE'
  if (normalized.startsWith('FALSE')) return 'FALSE'
  if (normalized.startsWith('YES')) return 'YES'
  if (normalized.startsWith('NO')) return 'NO'
  const letterMatch = normalized.match(/^([A-G])(?:\b|\s|\()/)
  if (letterMatch) return letterMatch[1]
  return String(value || '').trim()
}

const guessReadingAnswerType = (correctAnswer) => {
  const normalized = normalizeReadingAnswer(canonicalizeReadingCorrectAnswer(correctAnswer))
  if (['TRUE', 'FALSE', 'NOT GIVEN'].includes(normalized)) return 'true-false-not-given'
  if (['YES', 'NO', 'NOT GIVEN'].includes(normalized)) return 'yes-no-not-given'
  if (/^[A-G]$/.test(normalized)) return 'multiple-choice'
  return 'text'
}

const parseQuestionRangesFromText = (text) => {
  const matches = [...String(text || '').matchAll(/Questions?\s+(\d+)\s*[–-]\s*(\d+)/gi)]
  return matches.map((match) => ({
    start: Number(match[1]),
    end: Number(match[2])
  }))
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

const parseReadingPassages = (rawPassageText) => {
  const source = stripWrappedQuotes(rawPassageText)
  const passages = []
  const matches = [...source.matchAll(/READING PASSAGE\s+(\d+)/gi)]
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const next = matches[index + 1]
    const block = source
      .slice(current.index, next ? next.index : source.length)
      .replace(/^READING PASSAGE\s+\d+\s*/i, '')
      .trim()
    const lines = block.split('\n')
    const title = String(lines.find((line) => line.trim()) || `Passage ${current[1]}`).trim()
    const questionMarker = block.search(/Questions?\s+\d+\s*[–-]\s*\d+/i)
    const passageBodyRaw = questionMarker >= 0 ? block.slice(0, questionMarker).trim() : block.trim()
    const questionSectionText = questionMarker >= 0 ? block.slice(questionMarker).trim() : ''
    const bodyParagraphs = passageBodyRaw
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\n+/g, ' ').trim())
      .filter(Boolean)
      .slice(1)
    passages.push({
      number: Number(current[1]),
      title,
      bodyParagraphs,
      questionSectionText,
      questionRanges: parseQuestionRangesFromText(questionSectionText)
    })
  }

  if (passages.length === 0 && source.trim()) {
    const fallbackQuestionMarker = source.search(/Questions?\s+\d+\s*[–-]\s*\d+/i)
    const fallbackPassageBodyRaw = fallbackQuestionMarker >= 0 ? source.slice(0, fallbackQuestionMarker).trim() : source.trim()
    const fallbackQuestionSectionText = fallbackQuestionMarker >= 0 ? source.slice(fallbackQuestionMarker).trim() : ''
    const fallbackLines = fallbackPassageBodyRaw.split('\n')
    const fallbackTitle = String(fallbackLines.find((line) => line.trim()) || 'Passage 1').trim()
    const fallbackBodyParagraphs = fallbackPassageBodyRaw
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\n+/g, ' ').trim())
      .filter(Boolean)
      .slice(1)
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
    const numberMatch = segment.match(/^Question\s+(\d+):\s*(.+)$/im)
    const correctAnswerMatch = segment.match(/Correct Answer:\s*(.+)/i)
    const exactPortionMatch = segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)
    const explanationMatch = segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)
    const paraphraseMatch = segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)
    const questionNumber = Number(numberMatch?.[1] || 0)
    const prompt = String(numberMatch?.[2] || '').trim()
    const correctAnswer = canonicalizeReadingCorrectAnswer(String(correctAnswerMatch?.[1] || '').trim())
    return {
      number: questionNumber,
      prompt,
      correctAnswer,
      answerType: guessReadingAnswerType(correctAnswer),
      exactPortion: String(exactPortionMatch?.[1] || '').trim(),
      explanationThai: String(explanationMatch?.[1] || '').trim(),
      paraphrasedVocabulary: String(paraphraseMatch?.[1] || '').trim()
    }
  })
}

const normalizeReadingQuestionRecord = (question) => {
  const correctAnswer = canonicalizeReadingCorrectAnswer(question?.correctAnswer || '')
  return {
    ...question,
    correctAnswer,
    answerType: guessReadingAnswerType(correctAnswer)
  }
}

const normalizeReadingParsedPayload = (payload) => ({
  ...(payload && typeof payload === 'object' ? payload : {}),
  passages: Array.isArray(payload?.passages)
    ? payload.passages.map((passage) => ({
        ...passage,
        questions: Array.isArray(passage?.questions)
          ? passage.questions.map((question) => normalizeReadingQuestionRecord(question))
          : []
      }))
    : [],
  questionCount: Number(payload?.questionCount || 0)
})

const buildReadingExamPayload = ({ title, category, rawPassageText, rawAnswerKey }) => {
  const passages = parseReadingPassages(rawPassageText)
  const questions = parseReadingAnswerKey(rawAnswerKey)
  const passagesWithQuestions = passages.map((passage) => ({
    ...passage,
    questions: questions.filter((question) =>
      passage.questionRanges.some((range) => question.number >= range.start && question.number <= range.end)
    )
  }))

  if (passagesWithQuestions.length === 0) {
    throw new Error('The passage parser could not find any READING PASSAGE blocks. Please keep the "READING PASSAGE 1/2/3" headings in your upload.')
  }

  if (questions.length === 0) {
    throw new Error('The answer key parser could not find any "Question X:" blocks. Please keep the Question / Correct Answer / Exact Portion format.')
  }

  const questionsMissingPassage = questions.filter(
    (question) => !passagesWithQuestions.some((passage) => passage.questions.some((item) => item.number === question.number))
  )
  if (questionsMissingPassage.length > 0) {
    throw new Error(
      `Some questions could not be matched to a passage range: ${questionsMissingPassage
        .slice(0, 10)
        .map((question) => question.number)
        .join(', ')}`
    )
  }

  return {
    title: String(title || '').trim(),
    category: normalizeReadingCategory(category),
    passages: passagesWithQuestions,
    questionCount: questions.length
  }
}

const mapReadingExamRecord = (row) => ({
  id: String(row?.id || ''),
  title: String(row?.title || 'Reading exam'),
  category: normalizeReadingCategory(row?.category),
  rawPassageText: String(row?.raw_passage_text || ''),
  rawAnswerKey: String(row?.raw_answer_key || ''),
  parsedPayload: normalizeReadingParsedPayload(row?.parsed_payload),
  createdAt: row?.created_at || null,
  updatedAt: row?.updated_at || null
})

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
  plan: 'VIP',
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

const verifySupabaseAccessToken = async (accessToken) => {
  if (!accessToken) throw new Error('Missing access token')
  const user = await fetchSupabaseJson('/auth/v1/user', {
    headers: buildSupabaseHeaders({ accessToken, includeJson: false })
  })
  if (!user?.id) throw new Error('Invalid auth session')
  const profile = await loadUserProfileWithAccess(user.id)
  return { user, profile }
}

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

const decrementLearnerCredits = async ({ userId, assessmentMode }) => {
  const profile = await loadUserProfileWithAccess(userId)
  ensureActiveStudentAccess(profile)
  if (String(profile?.role || 'student') === 'admin') {
    return mapCreditProfile(profile)
  }

  const feedbackRemaining = Math.max(0, Number(profile?.learner_access?.feedback_credits ?? 0))
  const fullMockRemaining = Math.max(0, Number(profile?.learner_access?.full_mock_credits ?? 0))

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

const generateFallbackAssessment = ({ punctuatedTranscript, topic, providerReason }) => {
  const normalizedText = String(punctuatedTranscript || '').trim()
  const wordCount = normalizedText ? normalizedText.split(/\s+/).filter(Boolean).length : 0

  const fluency = wordCount >= 250 ? 7 : wordCount >= 200 ? 6 : wordCount >= 150 ? 5 : 4
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
        quote: 'Target: Band 6 needs around 200-250 words with understandable flow.',
        fix: 'For each cue point, add one reason and one short example before moving on.'
      },
      {
        quote: 'Use referencing words more deliberately.',
        fix: 'Useful words: "this book", "that idea", "it", "this advice", "that experience".'
      }
    ],
    7: [
      {
        quote: 'Target: Band 7 needs about 250+ words with at least 2 clear references used correctly.',
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
        quote: 'Target: Band 8 needs roughly 280+ words with strong continuity and natural self-correction.',
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
        quote: 'Target: Band 9 needs 310+ words with effortless flow and very strong cohesion.',
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
  'Target: Band 6 needs around 200-250 words with understandable flow.':
    'เป้าหมาย: Band 6 ควรพูดได้ราว 200-250 คำ และยังคงความลื่นไหลที่ฟังเข้าใจง่าย',
  'For each cue point, add one reason and one short example before moving on.':
    'ในแต่ละ cue point ให้เติม 1 เหตุผลและ 1 ตัวอย่างสั้น ๆ ก่อนเปลี่ยนไปประเด็นถัดไป',
  'Use referencing words more deliberately.':
    'ใช้คำอ้างอิง (referencing) ให้ตั้งใจและชัดเจนมากขึ้น',
  'Useful words: "this book", "that idea", "it", "this advice", "that experience".':
    'คำที่ใช้ได้ดี: "this book", "that idea", "it", "this advice", "that experience"',
  'Target: Band 7 needs about 250+ words with at least 2 clear references used correctly.':
    'เป้าหมาย: Band 7 ต้องพูดได้ประมาณ 250+ คำ และใช้ reference อย่างน้อย 2 จุดได้ถูกต้อง',
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
  'Target: Band 8 needs roughly 280+ words with strong continuity and natural self-correction.':
    'เป้าหมาย: Band 8 ต้องพูดได้ราว 280+ คำ มี continuity ที่แน่น และ self-correction อย่างเป็นธรรมชาติ',
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
      'พูดได้อย่างน้อย 310 คำ'
    ],
    8: [
      'ใช้ referencing มากกว่า 3 ครั้งและถูกต้อง',
      'ถ้ามี self-correction ต้องแก้ได้ถูกต้อง',
      'พูดได้อย่างน้อย 280 คำ'
    ],
    7: [
      'พูดได้อย่างน้อย 250 คำ',
      'ใช้ referencing อย่างน้อย 2 ครั้งได้อย่างถูกต้อง',
      'ถ้ามี self-correction ต้องแก้ได้ถูกต้อง'
    ],
    6: [
      'พูดได้ 200-250 คำ',
      'ไม่มี referencing หรือใช้แล้วยังผิดบางครั้ง',
      'ถ้ามี self-correction บางครั้งยังแก้ผิดอยู่'
    ],
    5: [
      'พูดได้น้อยกว่า 200 คำ',
      'ไม่มี referencing หรือใช้แล้วผิดบ่อย',
      'self-correction ส่วนใหญ่ยังผิดอยู่มากกว่า 50%'
    ],
    4: [
      'พูดได้น้อยกว่า 200 คำ',
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

const buildCustomVocabularySuggestions = async ({ testMode, punctuatedTranscript, questionBreakdown }) => {
  try {
    const payload = await callGeminiCleanupJson(
      customVocabularyLiftPrompt({
        testMode,
        punctuatedTranscript,
        questionBreakdown
      })
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
  componentReports
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
      })
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
  if (value === 'audio/mp3') return 'audio/mpeg'
  if (value === 'audio/x-wav') return 'audio/wav'
  if (value === 'audio/m4a') return 'audio/mp4'
  return value
}

const transcriptionMimeCandidates = (rawMimeType) => {
  const normalized = normalizeAudioMimeType(rawMimeType)
  const candidates = [normalized]
  if (normalized === 'audio/webm') candidates.push('audio/ogg')
  if (normalized === 'audio/mp4') candidates.push('audio/mpeg')
  if (normalized === 'audio/mpeg') candidates.push('audio/mp4')
  if (normalized === 'audio/wav') candidates.push('audio/webm')
  return [...new Set(candidates)]
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
  const mimeType = normalizeAudioMimeType(audioMimeType)
  const model = String(process.env.DEEPGRAM_STT_MODEL || 'nova-3').trim()
  const response = await safeFetch(
    `https://api.deepgram.com/v1/listen?model=${encodeURIComponent(
      model
    )}&smart_format=true&punctuate=true`,
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
    throw new Error(`Deepgram failed: ${response.status} ${body.slice(0, 180)}`)
  }
  const payload = await response.json()
  const alt = payload?.results?.channels?.[0]?.alternatives?.[0] || {}
  const transcriptText = normalizeTextOutput(alt?.transcript)
  if (!transcriptText) throw new Error('Deepgram returned empty transcript')
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

const transcribeWithEmergencyFallback = async ({ audioBase64, audioMimeType, primaryError }) => {
  const errors = primaryError
    ? [`english-plan: ${primaryError instanceof Error ? primaryError.message : String(primaryError || 'unknown error')}`]
    : []
  if (process.env.GEMINI_API_KEY) {
    try {
      const google = await transcribeWithGoogle({ audioBase64, audioMimeType })
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

const transcribeWithBestProvider = async ({ audioBase64, audioMimeType }) => {
  // Runtime STT is intentionally Gemini/Deepgram-first. ENGLISH PLAN is used for pronunciation service status.
  return await transcribeWithEmergencyFallback({
    audioBase64,
    audioMimeType,
    primaryError: null
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

const transcribeWithGoogle = async ({ audioBase64, audioMimeType }) => {
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

const callGemini = async (prompt) => {
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
      { timeoutMs: 55000, retries: 1, retryDelayMs: 900 }
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

const callGeminiText = async (prompt) => {
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
    return normalizeTextOutput(text)
  }
  throw new Error(`Gemini text failed on all models. ${tried.join(' | ')}`)
}

const callGeminiCleanupText = async (prompt) => {
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
    return normalizeTextOutput(text)
  }
  throw new Error(`Gemini cleanup text failed on all models. ${tried.join(' | ')}`)
}

const callGeminiJson = async (prompt) => parseModelJson(await callGeminiText(prompt))
const callGeminiCleanupJson = async (prompt) => parseModelJson(await callGeminiCleanupText(prompt))

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
  onProgress
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
      })
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
        role: String(profile.role || 'student'),
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
        role: String(profile.role || 'student'),
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
        role: String(profile.role || 'student'),
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
      const existingProfile = await loadUserProfileByEmail(email)
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
        status: req.body?.status,
        startsAt: req.body?.startsAt,
        expiresAt: req.body?.expiresAt,
        feedbackCredits: req.body?.feedbackCredits,
        fullMockCredits: req.body?.fullMockCredits
      }))
    })

    const profile = await loadUserProfileWithAccess(userId)
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
        status: req.body?.status,
        startsAt: req.body?.startsAt,
        expiresAt: req.body?.expiresAt,
        feedbackCredits: req.body?.feedbackCredits,
        fullMockCredits: req.body?.fullMockCredits
      }))
    })

    const profile = await loadUserProfileWithAccess(userId)
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

app.get('/api/reading/exams', requireAuth, async (req, res) => {
  try {
    if (String(req.auth?.profile?.role || req.auth?.user?.role || 'student') !== 'admin') {
      return res.json({ exams: [] })
    }
    const rows = await fetchSupabaseJson(
      '/rest/v1/reading_exams?select=id,category,title,raw_passage_text,raw_answer_key,parsed_payload,created_at,updated_at&order=created_at.desc',
      {
        headers: buildSupabaseHeaders({ serviceRole: true, includeJson: false })
      }
    )
    return res.json({
      exams: (Array.isArray(rows) ? rows : []).map(mapReadingExamRecord)
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
      rawPassageText,
      rawAnswerKey
    })

    const rows = await fetchSupabaseJson('/rest/v1/reading_exams', {
      method: 'POST',
      headers: buildSupabaseHeaders({ serviceRole: true, prefer: 'return=representation' }),
      body: JSON.stringify({
        category,
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

      try {
        if (!rawPassageText || !rawAnswerKey) {
          throw new Error('Missing rawPassageText or rawAnswerKey.')
        }
        const parsedPayload = buildReadingExamPayload({
          title,
          category,
          rawPassageText,
          rawAnswerKey
        })
        return {
          index: index + 1,
          title,
          category,
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

      if (!title || !rawPassageText || !rawAnswerKey) {
        throw new Error(
          `Bulk item ${index + 1} is missing title, rawPassageText, or rawAnswerKey.`
        )
      }

      return {
        category,
        title,
        raw_passage_text: rawPassageText,
        raw_answer_key: rawAnswerKey,
        parsed_payload: buildReadingExamPayload({
          title,
          category,
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

app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.post('/api/tts', async (req, res) => {
  try {
    const apiKey = String(process.env.DEEPGRAM_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(500).json({
        error: {
          status: 500,
          type: 'configuration_error',
          message: 'Missing DEEPGRAM_API_KEY on backend environment'
        }
      })
    }

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

    const model = String(process.env.DEEPGRAM_TTS_MODEL || 'aura-2-asteria-en').trim()
    const response = await safeFetch('https://api.deepgram.com/v1/speak', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model
      })
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      return res.status(response.status).json({
        error: {
          status: response.status,
          type: 'deepgram_tts_error',
          message: `Deepgram TTS failed: ${body.slice(0, 180)}`
        }
      })
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer())
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
      const transcription = await transcribeWithBestProvider({ audioBase64, audioMimeType })
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
            const fixed = await provider.call(punctuationPrompt({ rawTranscript: item.response }))
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
        punctuatedTranscript = await provider.call(punctuationPrompt({ rawTranscript }))
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
    const geminiReport =
      assessmentMode === 'fullMock'
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
            onProgress
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
              })
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
    comparisons.gemini = geminiReport
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`gemini: ${message}`)
    comparisons.gemini = await buildFinalReport({
      result: generateFallbackAssessment({
        punctuatedTranscript,
        topic,
        providerReason: message
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
      componentReports: primaryReport.componentReports || {}
    })
    const enrichedVocabularySuggestions = await buildCustomVocabularySuggestions({
      testMode: String(testMode || 'part2'),
      punctuatedTranscript: primaryReport.punctuatedTranscript || punctuatedTranscript,
      questionBreakdown: enrichedQuestionBreakdown
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
    comparisonErrors: errors
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
      error: `Audio payload is too large. Current server limit is ${requestBodyLimit}.`
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
