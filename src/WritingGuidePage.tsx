import { Children, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import './WritingGuidePage.css'
import {
  getWritingGuidedBuilder,
  assembleGuidedEssay,
  ROLE_LABEL_TH,
  STEP_COACH_TH,
  BLANK_COACH_TH,
  type WgbExercise,
  type WgbStep,
  type WgbBlank,
  type WgbSegment
} from './writingGuidedBuilder'
import {
  WRITING_TASK1_SECTIONS,
  WRITING_TASK2_TYPES,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  getWritingTask1ExamStem,
  IELTS_TASK1_SUMMARY_INSTRUCTION,
  IELTS_TASK1_WORD_LIMIT,
  type WritingGuideChipGroup,
  type WritingGuideStructure,
  type WritingTask1Section,
  type WritingTask1PracticePrompt
} from './writingGuideData'
import { WRITING_RECALL, WRITING_PREDICT, type ExamItem } from './writingExamRecalls'
import { renderPromptChart } from './writingTask1Charts'
import type {
  WritingEssaySavePayload,
  WritingReportParagraph,
  WritingReportSegment,
  WritingTask2EssaySavePayload
} from './writingReportTypes'
import {
  WRITING_TASK2_PROMPTS,
  getWritingTask2Prompts,
  type WritingTask2Track,
  type WritingTask2TypeId
} from './writingTask2Data'
import { getDenseWritingTask2Builder } from './writingTask2Dense'
import { WritingTask2Practice } from './WritingTask2Practice'
import { WritingTask2VocabQuiz } from './WritingTask2VocabQuiz'
import { hardenAcademicTask2Exercise } from './writingTask2Harden'
import { hardenTask1Exercise, getTask1BlankExplain } from './writingTask1Harden'
import { LetterHintBlankInput, isLetterHintBlank } from './LetterHintBlankInput'
import { resolveThaiMeaning } from './writingLetterHint'
import { countTask1Paragraphs } from './writingTask1WordCount'
import type { EngagementContext } from './engagementTracking'
import {
  GENERAL_TASK1_PROMPTS_BY_REGISTER,
  findGeneralTask1Prompt,
  type GeneralTask1Register
} from './writingGeneralTask1Data'
import { GeneralTask1LetterPractice } from './GeneralTask1LetterPractice'
import {
  buildWritingRecallFeedback,
  isWritingRecallExact,
  type WritingRecallCheck
} from './writingParagraphRecall'

type WritingGuidePageProps = {
  onBackHome: () => void
  onSaveEssayToNotebook?: (payload: WritingEssaySavePayload) => void
  onSaveTask2EssayToNotebook?: (payload: WritingTask2EssaySavePayload) => void
  onSaveVocabToNotebook?: (payload: { word: string; thaiMeaning: string; questionTitle: string; questionNumber: number }) => void
  onAnalyticsContextChange?: (context: EngagementContext) => void
}

type WritingFlow =
  | { step: 'hub' }
  | { step: 'latest'; filter: 'all' | 'task1' | 'task2' }
  | { step: 'task1-categories' }
  | { step: 'task1-questions'; categoryId: string }
  | { step: 'task1-drill'; categoryId: string; promptId: string }
  | { step: 'task1-guide'; categoryId: string }
  | { step: 'gt-home' }
  | { step: 'gt-task1-types' }
  | { step: 'gt-task1-questions'; register: GeneralTask1Register }
  | { step: 'gt-task1-drill'; register: GeneralTask1Register; promptId: string }
  | { step: 'task2-types'; track?: WritingTask2Track }
  | { step: 'task2-questions'; typeId: WritingTask2TypeId; track?: WritingTask2Track }
  | { step: 'task2-drill'; typeId: WritingTask2TypeId; promptId: string; track?: WritingTask2Track }
  | { step: 'gt-task2-vocab'; typeId: WritingTask2TypeId; promptId: string; track?: WritingTask2Track }

// Chart / diagram renderers now live in ./writingTask1Charts (renderPromptChart).
// The old free-text "answer sheet" exam paper has been removed — clicking a question now
// goes straight into the guided, fill-in-the-blank builder (WritingGuidedBuilder).

const WGB_STEP_SHORT: Record<WgbStep['role'], string> = {
  intro: 'Intro',
  overview: 'Overview',
  body1: 'Body 1',
  body2: 'Body 2'
}

const wgbNormalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

/* Legacy in-file recall implementation retained only as migration reference.
type WgbRecallCheck = {
  attempted: boolean
  passed: boolean
  feedback: string[]
}

const wgbWithoutSpaces = (value: string) => value.replace(/\s/gu, '')
const wgbWithoutPunctuation = (value: string) =>
  value.replace(/[\s.,!?;:'"“”‘’—–\-()[\]{}%$]/gu, '')
const wgbWords = (value: string) =>
  value
    .replace(/[^\p{L}\p{N}'’-]+/gu, ' ')
    .trim()
    .split(/\s+/u)
    .filter(Boolean)

type WgbRecallToken = {
  value: string
  isWord: boolean
}

type WgbTokenDiff =
  | { kind: 'substitute'; expected: WgbRecallToken; given: WgbRecallToken; expectedIndex: number }
  | { kind: 'missing'; expected: WgbRecallToken; expectedIndex: number }
  | { kind: 'extra'; given: WgbRecallToken; expectedIndex: number }

const wgbRecallTokens = (value: string): WgbRecallToken[] =>
  [...value.matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu)].map((match) => ({
    value: match[0],
    isWord: /^[\p{L}\p{N}]/u.test(match[0])
  }))

function buildWgbTokenDiffs(expected: string, given: string): {
  expectedTokens: WgbRecallToken[]
  diffs: WgbTokenDiff[]
} {
  const expectedTokens = wgbRecallTokens(expected)
  const givenTokens = wgbRecallTokens(given)
  const rows = expectedTokens.length + 1
  const cols = givenTokens.length + 1
  const dp = Array.from({ length: rows }, () => Array<number>(cols).fill(0))

  for (let i = 0; i < rows; i += 1) dp[i][0] = i
  for (let j = 0; j < cols; j += 1) dp[0][j] = j

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const same = expectedTokens[i - 1].value.toLocaleLowerCase() === givenTokens[j - 1].value.toLocaleLowerCase()
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (same ? 0 : 1))
    }
  }

  const diffs: WgbTokenDiff[] = []
  let i = expectedTokens.length
  let j = givenTokens.length
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const same = expectedTokens[i - 1].value.toLocaleLowerCase() === givenTokens[j - 1].value.toLocaleLowerCase()
      const cost = same ? 0 : 1
      if (dp[i][j] === dp[i - 1][j - 1] + cost) {
        if (!same || expectedTokens[i - 1].value !== givenTokens[j - 1].value) {
          diffs.push({
            kind: 'substitute',
            expected: expectedTokens[i - 1],
            given: givenTokens[j - 1],
            expectedIndex: i - 1
          })
        }
        i -= 1
        j -= 1
        continue
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      diffs.push({ kind: 'missing', expected: expectedTokens[i - 1], expectedIndex: i - 1 })
      i -= 1
      continue
    }
    if (j > 0) {
      diffs.push({ kind: 'extra', given: givenTokens[j - 1], expectedIndex: i })
      j -= 1
    }
  }

  return { expectedTokens, diffs: diffs.reverse() }
}

const WGB_PUNCTUATION_TH: Record<string, string> = {
  ',': 'comma (,)',
  '.': 'full stop (.)',
  ':': 'colon (:)',
  ';': 'semicolon (;)',
  '-': 'hyphen (-)',
  '—': 'dash (—)',
  "'": "apostrophe (')",
  '’': 'apostrophe (’)',
  '%': 'เครื่องหมายเปอร์เซ็นต์ (%)',
  $: 'เครื่องหมายดอลลาร์ ($)',
  '(': 'วงเล็บเปิด (()',
  ')': 'วงเล็บปิด ())'
}

const wgbPunctuationName = (value: string) => WGB_PUNCTUATION_TH[value] || `เครื่องหมาย “${value}”`

function wgbExpectedContext(tokens: WgbRecallToken[], index: number): string {
  const start = Math.max(0, index - 3)
  const end = Math.min(tokens.length, index + 4)
  return tokens
    .slice(start, end)
    .map((token) => token.value)
    .join(' ')
    .replace(/\s+([,.!?;:])/gu, '$1')
}

const WGB_PREPOSITIONS = new Set([
  'at',
  'between',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'over',
  'than',
  'to',
  'towards',
  'with'
])

function classifyWgbWordError(
  expectedWord: string,
  givenWord: string,
  expectedTokens: WgbRecallToken[],
  expectedIndex: number
): string {
  const expected = expectedWord.toLocaleLowerCase()
  const given = givenWord.toLocaleLowerCase()
  const context = wgbExpectedContext(expectedTokens, expectedIndex)
  const previous = expectedTokens[expectedIndex - 1]?.value.toLocaleLowerCase() || ''

  if ((expected === 'was' && given === 'were') || (expected === 'were' && given === 'was')) {
    return `was / were: ใน “…${context}…” ต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}” — was ใช้กับประธานเอกพจน์ ส่วน were ใช้กับประธานพหูพจน์`
  }
  if ((expected === 'is' && given === 'are') || (expected === 'are' && given === 'is')) {
    return `Subject–verb agreement: ใน “…${context}…” ต้องใช้ “${expectedWord}” ให้ตรงกับประธาน ${expected === 'is' ? 'เอกพจน์' : 'พหูพจน์'}`
  }

  if (
    previous &&
    ['is', 'are', 'was', 'were', 'be', 'been'].includes(previous) &&
    expected !== given
  ) {
    return `Passive voice (be + V3): ใน “…${context}…” หลัง “${previous}” ต้องใช้ V3 “${expectedWord}” ไม่ใช่ “${givenWord}” เพราะประธานเป็นสิ่งที่ถูกกระทำ`
  }

  const irregularBase = WGB_IRREGULAR_TENSES[expected]
  if (irregularBase && (given === irregularBase || given.endsWith('ing'))) {
    return `Past tense: ใน “…${context}…” ต้องใช้ V2 “${expectedWord}” ไม่ใช่ “${givenWord}” เพราะกำลังรายงานข้อมูลในอดีต`
  }
  if (
    expected.endsWith('ed') &&
    (given === expected.slice(0, -2) || given === expected.slice(0, -1) || given.endsWith('ing'))
  ) {
    return `Past tense (-ed): ใน “…${context}…” ต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}” เพราะเหตุการณ์เกิดในปีที่ผ่านไปแล้ว`
  }
  if (expected.endsWith('ing') && !given.endsWith('ing')) {
    return `V-ing clause: หลัง comma ใน “…${context}…” ต้องใช้ “${expectedWord}” เพื่อขยายผลของประโยคหลัก ไม่ใช้ “${givenWord}”`
  }
  if (
    WGB_PRESENT_S_ES.has(expected) &&
    ((expected.endsWith('es') && given === expected.slice(0, -2)) ||
      (expected.endsWith('s') && given === expected.slice(0, -1)))
  ) {
    return `Present simple s/es: ใน “…${context}…” ประธานเอกพจน์จึงต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}”`
  }
  if (['a', 'an', 'the'].includes(expected)) {
    return `Article: ใน “…${context}…” ต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}” เพื่อชี้คำนามให้ถูกต้อง`
  }
  if (WGB_PREPOSITIONS.has(expected)) {
    return `Preposition: ใน “…${context}…” ต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}” เพราะเป็นคำที่เข้าคู่กับโครงสร้างนี้`
  }
  if (expected.endsWith('s') && given === expected.slice(0, -1)) {
    return `เอกพจน์/พหูพจน์: ใน “…${context}…” ต้องใช้คำนามพหูพจน์ “${expectedWord}” ไม่ใช่ “${givenWord}”`
  }

  return `คำหรือการสะกด: ใน “…${context}…” ต้องเป็น “${expectedWord}” แต่พิมพ์ว่า “${givenWord}” ลองตรวจความหมายและตัวสะกดอีกครั้ง`
}

const WGB_IRREGULAR_TENSES: Record<string, string> = {
  began: 'begin',
  became: 'become',
  brought: 'bring',
  built: 'build',
  chose: 'choose',
  fell: 'fall',
  found: 'find',
  grew: 'grow',
  had: 'have',
  led: 'lead',
  made: 'make',
  rose: 'rise',
  saw: 'see',
  stood: 'stand',
  took: 'take',
  was: 'be',
  went: 'go',
  were: 'be',
  wrote: 'write'
}

const WGB_PRESENT_S_ES = new Set([
  'accounts',
  'becomes',
  'compares',
  'consists',
  'ends',
  'illustrates',
  'includes',
  'leads',
  'makes',
  'passes',
  'prepares',
  'reaches',
  'records',
  'remains',
  'represents',
  'shows',
  'stands',
  'starts',
  'turns'
])

function buildWgbRecallFeedback(expected: string, given: string): string[] {
  if (!given.trim()) return ['ยังไม่ได้พิมพ์ย่อหน้าเลยนะ ลองเขียนประโยคที่เพิ่งประกอบให้ครบก่อน ✍️']

  const { expectedTokens, diffs } = buildWgbTokenDiffs(expected, given)
  const detailedFeedback = diffs.map((diff) => {
    const context = wgbExpectedContext(expectedTokens, diff.expectedIndex)

    if (diff.kind === 'substitute') {
      if (
        diff.expected.isWord &&
        diff.given.isWord &&
        diff.expected.value.toLocaleLowerCase() === diff.given.value.toLocaleLowerCase()
      ) {
        return `Capital letter: ใน “…${context}…” ต้องพิมพ์ “${diff.expected.value}” ไม่ใช่ “${diff.given.value}” — ตรวจคำแรกของประโยคและชื่อเฉพาะ`
      }
      if (
        diff.expected.isWord &&
        diff.given.isWord &&
        diff.expected.value.replace(/['’\-]/gu, '').toLocaleLowerCase() ===
          diff.given.value.replace(/['’\-]/gu, '').toLocaleLowerCase()
      ) {
        return `Punctuation ในคำ: ใน “…${context}…” ต้องเขียน “${diff.expected.value}” ไม่ใช่ “${diff.given.value}” — ตรวจ apostrophe หรือ hyphen ภายในคำ`
      }
      if (!diff.expected.isWord || !diff.given.isWord) {
        return `Punctuation: ใน “…${context}…” ต้องใช้ ${wgbPunctuationName(diff.expected.value)} แทน ${wgbPunctuationName(diff.given.value)}`
      }
      return classifyWgbWordError(diff.expected.value, diff.given.value, expectedTokens, diff.expectedIndex)
    }

    if (diff.kind === 'missing') {
      if (!diff.expected.isWord) {
        return `Punctuation หาย: เติม ${wgbPunctuationName(diff.expected.value)} ใน “…${context}…” ให้ตรงตำแหน่ง`
      }
      const expectedLower = diff.expected.value.toLocaleLowerCase()
      const nextWord = expectedTokens[diff.expectedIndex + 1]?.value.toLocaleLowerCase() || ''
      if (
        ['is', 'are', 'was', 'were', 'be', 'been'].includes(expectedLower) &&
        /(?:ed|en|wn|lt|nt|pt|d|t)$/u.test(nextWord)
      ) {
        return `Passive voice ขาด verb to be: ใน “…${context}…” ต้องเติม “${diff.expected.value}” หน้า V3 เพื่อสร้าง be + V3`
      }
      return `คำหาย: เติม “${diff.expected.value}” ใน “…${context}…” แล้วอ่านประโยคใหม่ให้ครบ`
    }

    if (!diff.given.isWord) {
      return `Punctuation เกิน: ลบ ${wgbPunctuationName(diff.given.value)} บริเวณ “…${context}…”`
    }
    return `คำเกิน: ลบ “${diff.given.value}” บริเวณ “…${context}…” เพราะไม่มีคำนี้ในย่อหน้าที่ถูกต้อง`
  })

  if (detailedFeedback.length) return [...new Set(detailedFeedback)]

  const feedback: string[] = []
  const expectedCompact = wgbWithoutSpaces(expected)
  const givenCompact = wgbWithoutSpaces(given)

  if (expectedCompact.toLocaleLowerCase() === givenCompact.toLocaleLowerCase() && expectedCompact !== givenCompact) {
    feedback.push('ตัวพิมพ์ใหญ่–เล็ก: ตรวจคำขึ้นต้นประโยค ชื่อประเทศ ชื่อสถานที่ และชื่อเฉพาะให้ตรงทุกตัว')
  } else if (
    wgbWithoutPunctuation(expected).toLocaleLowerCase() ===
      wgbWithoutPunctuation(given).toLocaleLowerCase() &&
    wgbWithoutPunctuation(expected) !== wgbWithoutPunctuation(given)
  ) {
    feedback.push('ตัวพิมพ์ใหญ่–เล็ก: เนื้อหาคำถูกแล้ว แต่ยังมีตัวอักษรบางตำแหน่งใช้ capital letter ไม่ตรงกับต้นฉบับ')
  }

  if (
    wgbWithoutPunctuation(expected).toLocaleLowerCase() ===
      wgbWithoutPunctuation(given).toLocaleLowerCase() &&
    expectedCompact.replace(/[\p{L}\p{N}]/gu, '') !== givenCompact.replace(/[\p{L}\p{N}]/gu, '')
  ) {
    feedback.push('เครื่องหมายวรรคตอน: ตรวจ comma (,), full stop (.), colon (:), hyphen (-), apostrophe และเครื่องหมาย %/$ ให้ตรงตำแหน่ง')
  }

  const expectedWords = wgbWords(expected)
  const givenWords = wgbWords(given)
  const lowerGiven = givenWords.map((word) => word.toLocaleLowerCase())
  const lowerExpected = expectedWords.map((word) => word.toLocaleLowerCase())
  const mismatches = lowerExpected
    .map((word, index) => ({ expected: word, given: lowerGiven[index] ?? '', index }))
    .filter(({ expected: expectedWord, given: givenWord }) => expectedWord !== givenWord)

  const hasWasWereMismatch = mismatches.some(
    ({ expected: expectedWord, given: givenWord }) =>
      (expectedWord === 'was' && givenWord === 'were') || (expectedWord === 'were' && givenWord === 'was')
  )
  if (hasWasWereMismatch) {
    feedback.push('was / were: ใช้ was กับประธานเอกพจน์ และ were กับประธานพหูพจน์ พร้อมเช็กว่าประธานของประโยคคือคำใด')
  }

  const hasPastTenseMismatch = mismatches.some(({ expected: expectedWord, given: givenWord }) => {
    const base = WGB_IRREGULAR_TENSES[expectedWord]
    return (
      (base && (givenWord === base || givenWord.endsWith('ing'))) ||
      (expectedWord.endsWith('ed') &&
        (givenWord === expectedWord.slice(0, -2) ||
          givenWord === expectedWord.slice(0, -1) ||
          givenWord.endsWith('ing')))
    )
  })
  if (hasPastTenseMismatch) {
    feedback.push('Past tense: ข้อมูลในอดีตต้องใช้ V2 เช่น rose, stood, began, fell หรือกริยา -ed ให้ตรงกับปีในกราฟ')
  }

  const hasPresentAgreementMismatch = mismatches.some(({ expected: expectedWord, given: givenWord }) => {
    if (expectedWord.length < 4) return false
    return (
      (expectedWord.endsWith('es') && givenWord === expectedWord.slice(0, -2)) ||
      (expectedWord.endsWith('s') && givenWord === expectedWord.slice(0, -1))
    )
  })
  if (hasPresentAgreementMismatch) {
    feedback.push('Present simple s/es: ประธานเอกพจน์ต้องเติม s หรือ es ที่กริยา เช่น shows, compares หรือ consists')
  }

  const expectedLower = ` ${lowerExpected.join(' ')} `
  const givenLower = ` ${lowerGiven.join(' ')} `
  const expectedHasPassive = /\b(?:is|are|was|were|be|been)\s+\p{L}+(?:ed|en|wn|lt|nt|pt|d|t)\b/u.test(expectedLower)
  const givenHasPassive = /\b(?:is|are|was|were|be|been)\s+\p{L}+(?:ed|en|wn|lt|nt|pt|d|t)\b/u.test(givenLower)
  if (expectedHasPassive && !givenHasPassive) {
    feedback.push('Passive voice: ต้องมี be + V3 เช่น was occupied, were demolished หรือ is produced เพราะประธานเป็นสิ่งที่ถูกกระทำ')
  }

  if (!feedback.length) {
    const firstMismatch = mismatches[0]
    if (firstMismatch) {
      const expectedWord = expectedWords[firstMismatch.index] ?? ''
      const givenWord = givenWords[firstMismatch.index] || '—'
      feedback.push(`คำยังไม่ตรง: ตำแหน่งนี้ควรเป็น “${expectedWord}” แต่พบ “${givenWord}” ลองอ่านประโยคช้า ๆ แล้วตรวจรูปคำอีกครั้ง`)
    } else if (expectedWords.length !== givenWords.length) {
      feedback.push(`จำนวนคำยังไม่ครบ: ต้นฉบับมี ${expectedWords.length} คำ แต่คำตอบมี ${givenWords.length} คำ (ไม่นับช่องว่าง)`)
    } else {
      feedback.push('เกือบแล้ว! ยังมีอักขระบางตำแหน่งไม่ตรง ลองตรวจตัวพิมพ์ใหญ่และเครื่องหมายวรรคตอนทีละประโยค')
    }
  }

  return feedback
}
*/

function WgbCoachBubble({ coachKey, message, isBlankFocus }: { coachKey: string; message: string; isBlankFocus: boolean }) {
  return (
    <div key={coachKey} className={`wgbCoach ${isBlankFocus ? 'is-blank-focus' : ''}`}>
      <span className="wgbCoachAvatar" aria-hidden="true">
        {isBlankFocus ? '💭' : '🧑‍🏫'}
      </span>
      <div className="wgbCoachBody">
        <p className="wgbCoachLabel">P'Doy แนะนำ</p>
        <p className="wgbCoachMessage">{message}</p>
      </div>
    </div>
  )
}

function WritingGuidedBuilder({
  prompt,
  exercise,
  onSaveEssay,
  onSaveVocab
}: {
  prompt: WritingTask1PracticePrompt
  exercise: WgbExercise
  onSaveEssay?: (data: { paragraphs: WritingReportParagraph[]; score: { correct: number; total: number } }) => void
  onSaveVocab?: (payload: { word: string; thaiMeaning: string }) => void
}) {
  const steps = exercise.steps
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set())
  const [masteredSteps, setMasteredSteps] = useState<Set<string>>(() => new Set())
  const [recallDrafts, setRecallDrafts] = useState<Record<string, string>>({})
  const [recallChecks, setRecallChecks] = useState<Record<string, WritingRecallCheck>>({})
  const [checkedNow, setCheckedNow] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null)
  const [savedNotice, setSavedNotice] = useState(false)
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set())

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const isBlankCorrect = (blank: WgbBlank): boolean => {
    const value = values[blank.id]
    if (value == null || value.trim() === '') return false
    if (blank.kind === 'select') return value === blank.answer
    return blank.answers.some((answer) => wgbNormalize(answer) === wgbNormalize(value))
  }

  const stepBlanks = useMemo(
    () =>
      step.segments
        .filter((segment): segment is Extract<WgbSegment, { kind: 'blank' }> => segment.kind === 'blank')
        .map((segment) => segment.blank),
    [step]
  )
  const stepScore = stepBlanks.filter(isBlankCorrect).length
  const stepQuizDone = checkedSteps.has(step.id)
  const stepDone = masteredSteps.has(step.id)
  const allDone = steps.every((item) => masteredSteps.has(item.id))

  const totalBlanks = useMemo(
    () => steps.reduce((sum, item) => sum + item.segments.filter((s) => s.kind === 'blank').length, 0),
    [steps]
  )

  const setValue = (id: string, value: string) => {
    setCheckedNow(false)
    setSavedNotice(false)
    setValues((current) => ({ ...current, [id]: value }))
  }

  // Blanks in the current step that were wrong at the last check (for the explanation list).
  const wrongBlanks = checkedNow ? stepBlanks.filter((blank) => !isBlankCorrect(blank)) : []

  const blankCorrectAnswer = (blank: WgbBlank) => (blank.kind === 'select' ? blank.answer : blank.answers[0])

  const buildReportParagraphs = (): WritingReportParagraph[] =>
    steps.map((item) => {
      const segments: WritingReportSegment[] = item.segments.map((segment) => {
        if (segment.kind === 'text') return { kind: 'text', text: segment.text }
        const blank = segment.blank
        return {
          kind: 'blank',
          text: blankCorrectAnswer(blank),
          given: (values[blank.id] ?? '').trim(),
          correct: isBlankCorrect(blank),
          focus: blank.focus
        }
      })
      const plainText = segments
        .map((segment) => (segment.kind === 'text' ? segment.text : segment.text))
        .join('')
        .replace(/\s+([,.;:])/g, '$1')
        .trim()
      return { role: item.role, labelTh: item.labelTh, segments, plainText }
    })

  const handleSaveEssay = () => {
    if (!onSaveEssay) return
    const paragraphs = buildReportParagraphs()
    const total = paragraphs.reduce(
      (sum, para) => sum + para.segments.filter((segment) => segment.kind === 'blank').length,
      0
    )
    const correct = paragraphs.reduce(
      (sum, para) =>
        sum + para.segments.filter((segment) => segment.kind === 'blank' && segment.correct).length,
      0
    )
    onSaveEssay({ paragraphs, score: { correct, total } })
    setSavedNotice(true)
  }

  const checkStep = () => {
    setCheckedNow(true)
    if (stepBlanks.every(isBlankCorrect)) {
      setCheckedSteps((current) => {
        const next = new Set(current)
        next.add(step.id)
        return next
      })
    }
  }

  const goToStep = (index: number) => {
    const reachable = index === 0 || masteredSteps.has(steps[index - 1].id) || masteredSteps.has(steps[index].id)
    if (!reachable) return
    setStepIndex(index)
    setCheckedNow(false)
    setActiveBlankId(null)
  }

  const goNext = () => {
    if (!isLastStep) goToStep(stepIndex + 1)
  }

  const resetAll = () => {
    setStepIndex(0)
    setValues({})
    setCheckedSteps(new Set())
    setMasteredSteps(new Set())
    setRecallDrafts({})
    setRecallChecks({})
    setCheckedNow(false)
    setShowEssay(false)
    setActiveBlankId(null)
  }

  const model = useMemo(() => assembleGuidedEssay(exercise), [exercise])
  const modelWordCount = useMemo(() => countTask1Paragraphs(model), [model])
  const expectedParagraph = model[stepIndex]?.text ?? ''
  const recallDraft = recallDrafts[step.id] ?? ''
  const recallCheck = recallChecks[step.id]

  const setRecallDraft = (value: string) => {
    setRecallDrafts((current) => ({ ...current, [step.id]: value }))
    setRecallChecks((current) => ({
      ...current,
      [step.id]: { attempted: false, passed: false, feedback: [] }
    }))
  }

  const checkRecallParagraph = () => {
    const passed = isWritingRecallExact(expectedParagraph, recallDraft)
    const nextCheck: WritingRecallCheck = {
      attempted: true,
      passed,
      feedback: passed ? [] : buildWritingRecallFeedback(expectedParagraph, recallDraft, 'task1')
    }
    setRecallChecks((current) => ({ ...current, [step.id]: nextCheck }))
    if (passed) {
      setMasteredSteps((current) => {
        const next = new Set(current)
        next.add(step.id)
        return next
      })
    }
  }

  const activeBlank = activeBlankId ? stepBlanks.find((blank) => blank.id === activeBlankId) ?? null : null
  const coachMessage = activeBlank ? BLANK_COACH_TH[activeBlank.focus] : STEP_COACH_TH[step.role]
  const coachKey = activeBlank ? activeBlank.id : `step-${step.id}`

  return (
    <div className="wgbShell">
      <aside className="wgbVisualPane">
        <div className="wgbExamStem">
          <p className="writingIeltsPromptLine">{getWritingTask1ExamStem(prompt)}</p>
          <p className="writingIeltsPromptLine writingIeltsPromptLine-instruction">{IELTS_TASK1_SUMMARY_INSTRUCTION}</p>
          <p className="writingIeltsPromptLine writingIeltsPromptLine-limit">{IELTS_TASK1_WORD_LIMIT}</p>
        </div>
        <div className="wgbChart">{renderPromptChart(prompt)}</div>
      </aside>

      <div className="wgbPanel">
        <ol className="wgbRail">
          {steps.map((item, index) => {
            const done = masteredSteps.has(item.id)
            const reachable = index === 0 || masteredSteps.has(steps[index - 1].id) || done
            const current = index === stepIndex
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`wgbRailStep ${current ? 'is-current' : ''} ${done ? 'is-done' : ''} ${
                    reachable ? '' : 'is-locked'
                  }`}
                  onClick={() => goToStep(index)}
                  disabled={!reachable}
                >
                  <span className="wgbRailDot">{done ? '✓' : index + 1}</span>
                  <span className="wgbRailLabel">{WGB_STEP_SHORT[item.role]}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <WgbCoachBubble coachKey={coachKey} message={coachMessage} isBlankFocus={!!activeBlank} />

        <div key={step.id} className="wgbStepCard">
          <p className="wgbStepEyebrow">{ROLE_LABEL_TH[step.role]}</p>
          {step.hintTh ? <p className="wgbStepHint">{step.hintTh}</p> : null}

          <p className="wgbSentence">
            {step.segments.map((segment, index) => {
              if (segment.kind === 'text') return <span key={index}>{segment.text}</span>
              const blank = segment.blank
              const value = values[blank.id] ?? ''
              const correct = isBlankCorrect(blank)
              const stateClass = !checkedNow ? '' : correct ? 'is-correct' : 'is-incorrect'
              if (blank.kind === 'select') {
                return (
                  <span key={blank.id} className="wgbBlankWrap">
                    <select
                      className={`wgbSelect ${stateClass} ${value ? 'is-filled' : ''}`}
                      value={value}
                      onChange={(event) => setValue(blank.id, event.target.value)}
                      onFocus={() => setActiveBlankId(blank.id)}
                      onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    >
                      <option value="">— เลือก —</option>
                      {blank.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {checkedNow && !correct ? (
                      <em className="wgbReveal">{blank.answer}</em>
                    ) : null}
                  </span>
                )
              }
              if (isLetterHintBlank(blank)) {
                const gloss = resolveThaiMeaning(
                  blank.answers[0],
                  blank.kind === 'type' ? blank.thaiMeaning : undefined,
                  blank.explain
                )
                return (
                  <span key={blank.id} className="wgbBlankWrap">
                    <LetterHintBlankInput
                      answer={blank.answers[0]}
                      base={blank.base}
                      value={value}
                      stateClass={stateClass}
                      thaiMeaning={gloss}
                      saved={savedWords.has(blank.answers[0])}
                      onSaveToNotebook={
                        onSaveVocab && gloss
                          ? ({ word, thaiMeaning }) => {
                              onSaveVocab({ word, thaiMeaning })
                              setSavedWords((current) => new Set(current).add(word))
                            }
                          : undefined
                      }
                      onChange={(next) => setValue(blank.id, next)}
                      onFocus={() => setActiveBlankId(blank.id)}
                      onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                      onEnter={checkStep}
                    />
                    {checkedNow && !correct ? <em className="wgbReveal">{blank.answers[0]}</em> : null}
                  </span>
                )
              }
              const widthCh = Math.max(blank.base.length + 3, ...blank.answers.map((a) => a.length + 1), 7)
              return (
                <span key={blank.id} className="wgbBlankWrap">
                  <input
                    type="text"
                    className={`wgbInput ${stateClass} ${value ? 'is-filled' : ''}`}
                    value={value}
                    placeholder={`(${blank.base})`}
                    style={{ width: `${widthCh}ch` }}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(event) => setValue(blank.id, event.target.value)}
                    onFocus={() => setActiveBlankId(blank.id)}
                    onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') checkStep()
                    }}
                  />
                  {checkedNow && !correct ? <em className="wgbReveal">{blank.answers[0]}</em> : null}
                </span>
              )
            })}
          </p>

          <div className="wgbStepToolbar">
            <button type="button" className="wlpBtn wlpBtn-primary" onClick={checkStep}>
              ตรวจคำตอบ
            </button>
            <span className={`wgbStepScore ${checkedNow ? 'is-revealed' : ''}`}>
              {stepScore} / {stepBlanks.length}
            </span>
            {stepDone && !isLastStep ? (
              <button type="button" className="wlpBtn wlpBtn-primary wgbNextBtn" onClick={goNext}>
                ถัดไป →
              </button>
            ) : null}
          </div>

          {checkedNow ? (
            stepBlanks.every(isBlankCorrect) ? (
              <div className="wgbFeedback is-good" role="status">
                ถูกทุกช่องแล้ว! ต่อไปลองพิมพ์ย่อหน้าที่เพิ่งประกอบให้ตรง 100% ในกล่อง Genie ด้านล่าง ✨
              </div>
            ) : (
              <div className="wgbFeedback is-retry" role="status">
                ยังมีช่องที่ต้องแก้ — ดูคำเฉลยและคำอธิบายด้านล่างแล้วลองใหม่อีกครั้ง 🙂
              </div>
            )
          ) : null}

          {wrongBlanks.length ? (
            <div className="wgbExplainList" role="note">
              <p className="wgbExplainHead">ทำไมถึงเป็นคำนี้</p>
              {wrongBlanks.map((blank) => (
                <div key={blank.id} className="wgbExplainRow">
                  <span className="wgbExplainAnswer">{blankCorrectAnswer(blank)}</span>
                  <span className="wgbExplainWhy">
                    {getTask1BlankExplain(blank, values[blank.id] || '')}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {stepQuizDone ? (
            <section
              className={`wgbRecallCard ${recallCheck?.passed ? 'is-passed' : recallCheck?.attempted ? 'is-retry' : ''}`}
              aria-labelledby={`recall-title-${step.id}`}
            >
              <div className="wgbRecallGenie" aria-hidden="true">
                🧞
              </div>
              <div className="wgbRecallBody">
                <div className="wgbRecallHeading">
                  <div>
                    <p className="wgbRecallKicker">Genie Memory Check</p>
                    <h3 id={`recall-title-${step.id}`}>พิมพ์ {ROLE_LABEL_TH[step.role]} ที่เพิ่งตอบอีกครั้ง</h3>
                  </div>
                  <span className="wgbRecallRule">ต้องตรง 100%</span>
                </div>
                <p className="wgbRecallInstruction">
                  ช่องว่างและการขึ้นบรรทัดใหม่ไม่นับ แต่ <strong>ตัวพิมพ์ใหญ่–เล็ก เครื่องหมายวรรคตอน และรูปกริยา</strong>{' '}
                  ต้องตรงทั้งหมด จึงจะไปด่านถัดไปได้
                </p>
                <textarea
                  className="wgbRecallTextarea"
                  value={recallDraft}
                  onChange={(event) => setRecallDraft(event.target.value)}
                  placeholder="พิมพ์ย่อหน้าเต็มที่นี่…"
                  rows={Math.max(4, Math.min(8, Math.ceil(expectedParagraph.length / 75)))}
                  spellCheck={false}
                  disabled={recallCheck?.passed}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') checkRecallParagraph()
                  }}
                />
                <div className="wgbRecallToolbar">
                  <button
                    type="button"
                    className="wlpBtn wlpBtn-primary"
                    onClick={checkRecallParagraph}
                    disabled={recallCheck?.passed}
                  >
                    {recallCheck?.passed ? '✓ ผ่าน 100% แล้ว' : 'ตรวจย่อหน้า'}
                  </button>
                  <span className="wgbRecallShortcut">⌘/Ctrl + Enter เพื่อตรวจ</span>
                </div>

                {recallCheck?.passed ? (
                  <div className="wgbRecallSuccess" role="status">
                    <span aria-hidden="true">✨</span>
                    <div>
                      <strong>ตรง 100% แล้ว เก่งมาก!</strong>
                      <p>
                        Genie ตรวจทั้ง capital letter, punctuation และ grammar ครบแล้ว
                        {isLastStep ? ' คุณผ่านครบทุกย่อหน้าแล้ว 🎉' : ' พร้อมไปย่อหน้าถัดไปได้เลย'}
                      </p>
                    </div>
                  </div>
                ) : recallCheck?.attempted ? (
                  <div className="wgbRecallFeedback" role="alert">
                    <p className="wgbRecallFeedbackTitle">เกือบแล้วนะ ลองแตะฝุ่นดาวตรงจุดเหล่านี้อีกนิด ✨</p>
                    <ul>
                      {recallCheck.feedback.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>

        {allDone ? (
          <div className="wgbFinish">
            <div className="wgbFinishHead">
              <p className="wgbFinishTitle">จบแล้ว! คุณประกอบเรียงความครบ {totalBlanks} ช่อง 🎉</p>
              <div className="wgbFinishBtns">
                <button type="button" className="wlpBtn wlpBtn-primary" onClick={() => setShowEssay((v) => !v)}>
                  {showEssay ? 'ซ่อนเรียงความเต็ม' : 'ดูเรียงความเต็ม'}
                </button>
                {onSaveEssay ? (
                  <button
                    type="button"
                    className="wlpBtn wlpBtn-save"
                    onClick={handleSaveEssay}
                    disabled={savedNotice}
                  >
                    {savedNotice ? '✓ บันทึกลง Notebook แล้ว' : '＋ บันทึกเรียงความลง Notebook'}
                  </button>
                ) : null}
                <button type="button" className="wlpBtn wlpBtn-secondary" onClick={resetAll}>
                  เริ่มใหม่
                </button>
              </div>
              {savedNotice ? (
                <p className="wgbSavedHint">
                  บันทึกไว้ในหมวด <strong>Writing</strong> ของ Notebook แล้ว — เปิดดูเป็นรายงานพร้อมกราฟและคำตอบที่ไฮไลต์ได้ทุกเมื่อ 📓
                </p>
              ) : null}
            </div>
            {showEssay ? (
              <article className="wgbEssay">
                <p className="wgbEssayWordCount">{modelWordCount} words</p>
                {model.map((para) => (
                  <div key={para.role} className="wgbEssayPara">
                    <span className="wgbEssayLabel">{para.labelTh}</span>
                    <p>{para.text}</p>
                  </div>
                ))}
              </article>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function WritingVocabularyHelper({
  chipGroups,
  structures
}: {
  chipGroups?: WritingGuideChipGroup[]
  structures?: WritingGuideStructure[]
}) {
  return (
    <div className="writingGuideHelperPanel">
      <p className="writingGuideHelperIntro">คำศัพท์และโครงสร้างแนะนำ — เปิดเมื่อต้องการตัวช่วยเท่านั้น</p>
      {chipGroups?.length ? (
        <div className="writingGuideChipGroups">
          {chipGroups.map((group) => (
            <article key={group.id} className="writingGuideChipGroup">
              <div className="writingGuideChipGroupHead">
                <h4>{group.label}</h4>
                {group.hint ? <p>{group.hint}</p> : null}
              </div>
              <div className="writingGuideChipRow">
                {group.chips.map((chip) => (
                  <span key={chip} className="writingGuideChip">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {structures?.length ? (
        <div className="writingGuideStructureBlock">
          <p className="writingGuideStructureEyebrow">Complex structures</p>
          <div className="writingGuideStructureGrid">
            {structures.map((item) => (
              <article key={item.id} className="writingGuideStructureCard">
                <span className="writingGuideStructureLabel">{item.label}</span>
                <code>{item.template}</code>
                {item.note ? <p>{item.note}</p> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WritingFlowHead({
  eyebrow,
  title,
  subtitle,
  onBack,
  backLabel
}: {
  eyebrow: string
  title: string
  subtitle?: string
  onBack: () => void
  backLabel: string
}) {
  return (
    <div className="writingGuideFlowHead">
      <button type="button" className="writingGuideFlowBack" onClick={onBack}>
        ← {backLabel}
      </button>
      <div>
        <p className="writingGuideStructureEyebrow">{eyebrow}</p>
        <h3 className="writingGuideFlowTitle">{title}</h3>
        {subtitle ? <p className="writingGuideFlowSub">{subtitle}</p> : null}
      </div>
    </div>
  )
}

// ── Latest exam recall / prediction cards ────────────────────────────────

const matchesTaskFilter = (item: ExamItem, filter: 'all' | 'task1' | 'task2') => {
  if (filter === 'all') return true
  return item.tag.includes(filter === 'task1' ? 'Task 1' : 'Task 2')
}

/** Ticket rows on a numbered level path — used across the whole Writing journey */
function WgTicketPathList({
  children,
  ariaLabel,
  firstDone = true
}: {
  children: ReactNode
  ariaLabel?: string
  firstDone?: boolean
}) {
  const items = Children.toArray(children).filter(Boolean)
  return (
    <div className="wgTicketPathBoard" aria-label={ariaLabel}>
      <div className="wgTicketPath">
        {items.map((child, index) => (
          <div
            key={index}
            className={`wgTicketPathStep ${firstDone && index === 0 ? 'is-done' : ''}`.trim()}
            style={{ '--motion-stagger': index } as CSSProperties}
          >
            <span className="wgTicketPathNode" aria-hidden="true">
              {firstDone && index === 0 ? '✓' : index + 1}
            </span>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

function WritingLatestItem({ item }: { item: ExamItem }) {
  const stampTone = item.tag.includes('Task 2')
    ? 'lilac'
    : item.tag.includes('Task 1')
      ? 'peach'
      : 'yellow'
  const stampEmoji = item.tag.includes('Task 2') ? '✍️' : item.tag.includes('Task 1') ? '📈' : '📰'
  return (
    <article className={`wgTicket wgTicket-static`}>
      <span className={`wgTicketStamp wgTicketStamp-${stampTone}`} aria-hidden="true">
        {stampEmoji}
      </span>
      <span className="wgTicketBody">
        <span className="wgTicketTitleRow">
          <strong>
            {item.title}
            {item.isNew ? <span className="wgLatestNew">ใหม่</span> : null}
          </strong>
          <span className="wgTicketBadge">{item.tag}</span>
        </span>
        {item.bullets ? (
          <ul className="wgLatestBullets">
            {item.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        <span className="wgTicketSub">{item.meta}</span>
      </span>
    </article>
  )
}

function WritingLatestSection({
  filter,
  onPracticeTask1,
  onPracticeTask2
}: {
  filter: 'all' | 'task1' | 'task2'
  onPracticeTask1: () => void
  onPracticeTask2: () => void
}) {
  const recall = WRITING_RECALL.filter((item) => matchesTaskFilter(item, filter))
  const predict = WRITING_PREDICT.filter((item) => matchesTaskFilter(item, filter))

  return (
    <div className="wgLatestShell">
      <section className="wgLatestBlock">
        <h3 className="wgLatestBlockTitle">หัวข้อที่เพิ่งออกสอบ</h3>
        <p className="wgLatestBlockLead">รายงานจากผู้สอบจริง · ไม่ใช่ข้อสอบทางการ</p>
        {recall.length ? (
          <WgTicketPathList ariaLabel="หัวข้อที่เพิ่งออกสอบ">
            {recall.map((item, i) => (
              <WritingLatestItem key={i} item={item} />
            ))}
          </WgTicketPathList>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <section className="wgLatestBlock wgLatestBlock-predict">
        <h3 className="wgLatestBlockTitle">เก็งข้อสอบเดือนนี้</h3>
        <p className="wgLatestBlockLead">แนวโน้มจากสถิติย้อนหลัง · เป็นการคาดการณ์ ไม่ใช่ข้อสอบจริง</p>
        {predict.length ? (
          <WgTicketPathList ariaLabel="เก็งข้อสอบเดือนนี้" firstDone={false}>
            {predict.map((item, i) => (
              <WritingLatestItem key={`p-${i}`} item={item} />
            ))}
          </WgTicketPathList>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <section className="wgRecommend" aria-label="แบบฝึกที่แนะนำ">
        <h3 className="wgRecommendTitle">แบบฝึกที่แนะนำ</h3>
        <p className="wgRecommendLead">เริ่มฝึกเขียนทีละขั้นตอน พร้อมโครงสร้างและประโยคตัวอย่าง</p>
        <div className="wgRecommendGrid">
          {filter !== 'task2' ? (
            <button
              type="button"
              className="wgRecommendCard wgRecommendCard-t1"
              onClick={onPracticeTask1}
            >
              <span className="wgRecommendBadge">⭐ แนะนำ</span>
              <span className="wgRecommendStamp wgTicketStamp-peach" aria-hidden="true">
                📈
              </span>
              <span className="wgRecommendBody">
                <span className="wgRecommendKicker">Task 1 · รายงานข้อมูล</span>
                <strong className="wgRecommendHeading">ฝึกเขียน Task 1</strong>
                <span className="wgRecommendSub">
                  กราฟ ตาราง แผนที่ และกระบวนการ — ฝึกทีละขั้นตอนพร้อมประโยคตัวอย่าง
                </span>
                <span className="wgRecommendCta">เริ่มฝึกเลย →</span>
              </span>
            </button>
          ) : null}
          {filter !== 'task1' ? (
            <button
              type="button"
              className="wgRecommendCard wgRecommendCard-t2"
              onClick={onPracticeTask2}
            >
              <span className="wgRecommendBadge">⭐ แนะนำ</span>
              <span className="wgRecommendStamp wgTicketStamp-lilac" aria-hidden="true">
                ✍️
              </span>
              <span className="wgRecommendBody">
                <span className="wgRecommendKicker">Task 2 · เรียงความ</span>
                <strong className="wgRecommendHeading">ฝึกเขียน Task 2</strong>
                <span className="wgRecommendSub">
                  เรียงความ 4 ประเภท — วางโครงย่อหน้าให้ชัด พร้อมวลีเชื่อมและตัวอย่าง
                </span>
                <span className="wgRecommendCta">เริ่มฝึกเลย →</span>
              </span>
            </button>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export function WritingGuidePage({
  onBackHome,
  onSaveEssayToNotebook,
  onSaveTask2EssayToNotebook,
  onSaveVocabToNotebook,
  onAnalyticsContextChange
}: WritingGuidePageProps) {
  const [flow, setFlow] = useState<WritingFlow>({ step: 'hub' })
  const [showHelper, setShowHelper] = useState(false)

  const activeCategory = useMemo(() => {
    if (
      flow.step === 'hub' ||
      flow.step === 'latest' ||
      flow.step === 'task2-types' ||
      flow.step === 'task2-questions' ||
      flow.step === 'task2-drill' ||
      flow.step === 'task1-categories' ||
      flow.step === 'gt-home' ||
      flow.step === 'gt-task1-types' ||
      flow.step === 'gt-task1-questions' ||
      flow.step === 'gt-task1-drill'
    ) {
      return null
    }
    return WRITING_TASK1_SECTIONS.find((section) => section.id === flow.categoryId) || null
  }, [flow])

  const activePrompt = useMemo(() => {
    if (flow.step !== 'task1-drill') return null
    const prompts = activeCategory?.practicePrompts || WRITING_TIMELINE_PRACTICE_PROMPTS
    return prompts.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow, activeCategory])

  const activeTask2Prompts = useMemo(() => {
    if (flow.step !== 'task2-questions' && flow.step !== 'task2-drill') return []
    return getWritingTask2Prompts(flow.typeId, flow.track || 'academic')
  }, [flow])

  const activeTask2Prompt = useMemo(() => {
    if (flow.step !== 'task2-drill' && flow.step !== 'gt-task2-vocab') return null
    return WRITING_TASK2_PROMPTS.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow])

  const activeGeneralTask1Prompt = useMemo(() => {
    if (flow.step !== 'gt-task1-drill') return null
    return findGeneralTask1Prompt(flow.promptId)
  }, [flow])

  useEffect(() => {
    if (!onAnalyticsContextChange) return
    const isTask1 = flow.step.startsWith('task1') || flow.step.startsWith('gt-task1')
    const isTask2 = flow.step.startsWith('task2')
    const isGeneralTraining =
      flow.step.startsWith('gt-') || ('track' in flow && flow.track === 'general-training')
    const prompt = activePrompt || activeTask2Prompt || activeGeneralTask1Prompt
    onAnalyticsContextChange({
      page: 'writing',
      feature: isTask1
        ? isGeneralTraining
          ? 'writing.general-training.task1'
          : 'writing.task1'
        : isTask2
          ? isGeneralTraining
            ? 'writing.general-training.task2'
            : 'writing.academic.task2'
          : 'writing.hub',
      activityType: prompt ? 'test' : flow.step.includes('questions') ? 'question-list' : 'view',
      activityId:
        prompt?.id ||
        ('categoryId' in flow ? flow.categoryId : 'typeId' in flow ? flow.typeId : flow.step),
      label: prompt?.title || flow.step,
      metadata: { step: flow.step, track: isGeneralTraining ? 'general-training' : 'academic' }
    })
  }, [activeGeneralTask1Prompt, activePrompt, activeTask2Prompt, flow, onAnalyticsContextChange])

  const goBack = () => {
    setShowHelper(false)
    if (flow.step === 'hub') {
      onBackHome()
      return
    }
    if (flow.step === 'latest') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'task1-categories') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'gt-home') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'gt-task1-types' || (flow.step === 'task2-types' && flow.track === 'general-training')) {
      setFlow({ step: 'gt-home' })
      return
    }
    if (flow.step === 'task2-types') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'gt-task1-questions') {
      setFlow({ step: 'gt-task1-types' })
      return
    }
    if (flow.step === 'gt-task1-drill') {
      setFlow({ step: 'gt-task1-questions', register: flow.register })
      return
    }
    if (flow.step === 'task1-questions' || flow.step === 'task1-guide') {
      setFlow({ step: 'task1-categories' })
      return
    }
    if (flow.step === 'task1-drill') {
      setFlow({ step: 'task1-questions', categoryId: flow.categoryId })
      return
    }
    if (flow.step === 'task2-questions') {
      setFlow({ step: 'task2-types', track: flow.track })
      return
    }
    if (flow.step === 'task2-drill') {
      setFlow({ step: 'task2-questions', typeId: flow.typeId, track: flow.track })
      return
    }
    if (flow.step === 'gt-task2-vocab') {
      setFlow({ step: 'task2-drill', typeId: flow.typeId, promptId: flow.promptId, track: flow.track })
    }
  }

  const openCategory = (section: WritingTask1Section) => {
    setShowHelper(false)
    if (section.practicePrompts?.length) {
      setFlow({ step: 'task1-questions', categoryId: section.id })
      return
    }
    setFlow({ step: 'task1-guide', categoryId: section.id })
  }

  return (
    <section className="writingGuidePage">
      <div className="writingGuideAmbient" aria-hidden="true">
        <span className="writingGuideOrb writingGuideOrb-a" />
        <span className="writingGuideOrb writingGuideOrb-b" />
        <span className="writingGuideGridGlow" />
      </div>

      <div className="writingGuideFlowStage">
        {flow.step === 'hub' ? (
          <div className="writingGuideHubShell">
            <div className="writingGuideHubIntro">
              <p className="wlpKicker">IELTS Academic Writing · English Plan Institute</p>
              <h1 className="writingGuideHubH1">เส้นทางฝึก Writing</h1>
              <p className="writingGuideHubLead">
                เริ่มจากข้อสอบล่าสุด หรือไต่ไปฝึก Task 1 / Task 2 ทีละขั้น — คลิกด่านที่อยากเข้า
              </p>
              <span className="wlpAccentRule" aria-hidden="true" />
            </div>
            <div className="wgTicketPathBoard" aria-label="ทางลัด Writing">
              <div className="wgTicketPath">
                <div className="wgTicketPathStep is-done" style={{ '--motion-stagger': 0 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">✓</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'all' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-yellow" aria-hidden="true">📰</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>ข้อสอบล่าสุด</strong>
                        <span className="wgTicketBadge">ใหม่</span>
                      </span>
                      <span className="wgTicketSub">โจทย์จริง Task 1 และ Task 2 จากผู้สอบ · อัปเดตทุกสัปดาห์</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 1 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">2</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'task1' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-peach" aria-hidden="true">📈</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>Task 1 ล่าสุด</strong>
                        <span className="wgTicketBadge">Task 1</span>
                      </span>
                      <span className="wgTicketSub">โจทย์ Task 1 ที่เพิ่งออกสอบจริง</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 2 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">3</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'latest', filter: 'task2' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-lilac" aria-hidden="true">✍️</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>Task 2 ล่าสุด</strong>
                        <span className="wgTicketBadge">Task 2</span>
                      </span>
                      <span className="wgTicketSub">โจทย์ Task 2 ที่เพิ่งออกสอบจริง</span>
                    </span>
                    <span className="wgTicketGo">เปิดคลัง →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 3 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">4</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'task1-categories' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-blue" aria-hidden="true">📊</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>แบบฝึกหัด Task 1</strong>
                        <span className="wgTicketBadge">Practice</span>
                      </span>
                      <span className="wgTicketSub">ฝึกเขียนทีละขั้นตอน ตามประเภทกราฟ</span>
                    </span>
                    <span className="wgTicketGo">เข้าฝึก →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 4 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">5</span>
                  <button
                    type="button"
                    className="wgTicket"
                    onClick={() => setFlow({ step: 'task2-types' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-ink" aria-hidden="true">🧠</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>แบบฝึกหัด Task 2</strong>
                        <span className="wgTicketBadge">Practice</span>
                      </span>
                      <span className="wgTicketSub">ประเภทเรียงความ + แนวทางแต่ละแบบ</span>
                    </span>
                    <span className="wgTicketGo">เข้าฝึก →</span>
                  </button>
                </div>
                <div className="wgTicketPathStep" style={{ '--motion-stagger': 5 } as CSSProperties}>
                  <span className="wgTicketPathNode" aria-hidden="true">6</span>
                  <button
                    type="button"
                    className="wgTicket wgTicket-generalTraining"
                    onClick={() => setFlow({ step: 'gt-home' })}
                  >
                    <span className="wgTicketStamp wgTicketStamp-blue" aria-hidden="true">🌍</span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>GENERAL TRAINING WRITING</strong>
                        <span className="wgTicketBadge">Task 1 + 2</span>
                      </span>
                      <span className="wgTicketSub">
                        Task 1 letters + Task 2 essays · everyday English
                      </span>
                    </span>
                    <span className="wgTicketGo">เข้าฝึก →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {flow.step === 'latest' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={
                flow.filter === 'all' ? 'เส้นทาง · ล่าสุด' : flow.filter === 'task1' ? 'Task 1 · ล่าสุด' : 'Task 2 · ล่าสุด'
              }
              title={
                flow.filter === 'all'
                  ? 'ข้อสอบ Writing ล่าสุด'
                  : flow.filter === 'task1'
                  ? 'โจทย์ Task 1 ล่าสุด'
                  : 'โจทย์ Task 2 ล่าสุด'
              }
              subtitle="เดินตาม path · รวบรวมจากผู้สอบจริง · ไม่ใช่ข้อสอบทางการ"
              onBack={goBack}
              backLabel="Home"
            />
            <WritingLatestSection
              filter={flow.filter}
              onPracticeTask1={() => setFlow({ step: 'task1-categories' })}
              onPracticeTask2={() => setFlow({ step: 'task2-types' })}
            />
          </div>
        ) : null}

        {flow.step === 'gt-home' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="IELTS General Training Writing"
              title="เลือก Task ที่อยากฝึก"
              subtitle="Task 1 ฝึกจดหมายตามระดับความเป็นทางการ · Task 2 ฝึกเรียงความหัวข้อใกล้ตัว"
              onBack={goBack}
              backLabel="Writing Home"
            />
            <WgTicketPathList ariaLabel="General Training Writing tasks">
              <button type="button" className="wgTicket" onClick={() => setFlow({ step: 'gt-task1-types' })}>
                <span className="wgTicketStamp wgTicketStamp-peach" aria-hidden="true">💌</span>
                <span className="wgTicketBody">
                  <span className="wgTicketTitleRow">
                    <strong>GENERAL WRITING TASK 1</strong>
                    <span className="wgTicketBadge">Letters</span>
                  </span>
                  <span className="wgTicketSub">Formal · Semi-formal · Informal · 3 bullet points</span>
                </span>
                <span className="wgTicketGo">เลือกประเภท →</span>
              </button>
              <button
                type="button"
                className="wgTicket"
                onClick={() => setFlow({ step: 'task2-types', track: 'general-training' })}
              >
                <span className="wgTicketStamp wgTicketStamp-blue" aria-hidden="true">📝</span>
                <span className="wgTicketBody">
                  <span className="wgTicketTitleRow">
                    <strong>GENERAL WRITING TASK 2</strong>
                    <span className="wgTicketBadge">Essays</span>
                  </span>
                  <span className="wgTicketSub">4 essay types · 16 guided questions</span>
                </span>
                <span className="wgTicketGo">เลือกประเภท →</span>
              </button>
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'gt-task1-types' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="General Training · Task 1"
              title="จดหมายนี้ควรใช้ register แบบไหน?"
              subtitle="ดูความสัมพันธ์กับผู้รับก่อนเสมอ · ในทุกข้อจะต้องตอบ Formal / Semi-formal / Informal ให้ถูกก่อนเริ่มเขียน"
              onBack={goBack}
              backLabel="General Writing"
            />
            <WgTicketPathList ariaLabel="General Training Task 1 letter registers">
              <button
                type="button"
                className="wgTicket wgTicket-generalTraining"
                onClick={() => setFlow({ step: 'gt-task1-questions', register: 'informal' })}
              >
                <span className="wgTicketStamp wgTicketStamp-yellow" aria-hidden="true">👋</span>
                <span className="wgTicketBody">
                  <span className="wgTicketTitleRow">
                    <strong>Informal Letter</strong>
                    <span className="wgTicketBadge">พร้อมฝึก</span>
                  </span>
                  <span className="wgTicketSub">เขียนถึงเพื่อนหรือครอบครัว · ใช้ contractions + everyday conjunctions</span>
                </span>
                <span className="wgTicketGo">เปิด 4 ข้อ →</span>
              </button>
              <button
                type="button"
                className="wgTicket wgTicket-generalTraining"
                onClick={() => setFlow({ step: 'gt-task1-questions', register: 'semi-formal' })}
              >
                <span className="wgTicketStamp wgTicketStamp-lilac" aria-hidden="true">🤝</span>
                <span className="wgTicketBody">
                  <span className="wgTicketTitleRow">
                    <strong>Semi-formal Letter</strong>
                    <span className="wgTicketBadge">พร้อมฝึก</span>
                  </span>
                  <span className="wgTicketSub">รู้จักผู้รับ แต่ยังต้องรักษาระดับความสุภาพ · เลี่ยง contractions</span>
                </span>
                <span className="wgTicketGo">เปิด 4 ข้อ →</span>
              </button>
              <button
                type="button"
                className="wgTicket wgTicket-generalTraining"
                onClick={() => setFlow({ step: 'gt-task1-questions', register: 'formal' })}
              >
                <span className="wgTicketStamp wgTicketStamp-ink" aria-hidden="true">🏢</span>
                <span className="wgTicketBody">
                  <span className="wgTicketTitleRow">
                    <strong>Formal Letter</strong>
                    <span className="wgTicketBadge">พร้อมฝึก</span>
                  </span>
                  <span className="wgTicketSub">ไม่รู้จักผู้รับเป็นการส่วนตัว · ภาษาทางการ ปิดท้าย Yours faithfully</span>
                </span>
                <span className="wgTicketGo">เปิด 4 ข้อ →</span>
              </button>
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'gt-task1-questions' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={`General Training · Task 1 · ${
                flow.register === 'informal'
                  ? 'Informal'
                  : flow.register === 'semi-formal'
                    ? 'Semi-formal'
                    : 'Formal'
              }`}
              title="เลือกโจทย์จดหมาย"
              subtitle="รูปแบบข้อสอบจริง · 3 bullet points · 160–180 คำ · ทุกประโยคเริ่มด้วย transition"
              onBack={goBack}
              backLabel="ประเภทจดหมาย"
            />
            <WgTicketPathList ariaLabel="General Training Task 1 letter questions">
              {GENERAL_TASK1_PROMPTS_BY_REGISTER[flow.register].map((prompt, index) => {
                const stamps = [
                  { emoji: '🏠', tone: 'yellow' },
                  { emoji: '🎂', tone: 'peach' },
                  { emoji: '💼', tone: 'blue' },
                  { emoji: '⌚', tone: 'lilac' }
                ] as const
                const stamp = stamps[index % stamps.length]
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="wgTicket"
                    onClick={() =>
                      setFlow({ step: 'gt-task1-drill', register: flow.register, promptId: prompt.id })
                    }
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{prompt.title}</strong>
                        <span className="wgTicketBadge">Q{prompt.number}</span>
                      </span>
                      <span className="wgTicketSub">{prompt.situation}</span>
                    </span>
                    <span className="wgTicketGo">วิเคราะห์ register →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'gt-task1-drill' && activeGeneralTask1Prompt ? (
          <div className="writingGuideExamShell">
            <div className="writingGuideExamToolbar">
              <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                ← กลับไปเลือกข้อ
              </button>
            </div>
            <GeneralTask1LetterPractice
              key={activeGeneralTask1Prompt.id}
              prompt={activeGeneralTask1Prompt}
              onSaveVocab={
                onSaveVocabToNotebook
                  ? ({ word, thaiMeaning }) =>
                      onSaveVocabToNotebook({
                        word,
                        thaiMeaning,
                        questionTitle: activeGeneralTask1Prompt.title,
                        questionNumber: activeGeneralTask1Prompt.number
                      })
                  : undefined
              }
            />
          </div>
        ) : null}


        {flow.step === 'task1-categories' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · เส้นทางฝึก"
              title="เลือกประเภทกราฟที่อยากฝึก"
              subtitle="เดินตาม path · เลือกหมวด แล้วฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="กลับ"
            />
            <div className="wgBentoHead">
              <button
                type="button"
                className="wgBentoCta"
                onClick={() => setFlow({ step: 'latest', filter: 'task1' })}
              >
                ดูข้อสอบล่าสุด →
              </button>
            </div>
            <WgTicketPathList ariaLabel="ประเภทกราฟ Task 1">
              {(() => {
                const byId = Object.fromEntries(WRITING_TASK1_SECTIONS.map((s) => [s.id, s]))
                const stamps: Record<string, { emoji: string; tone: string }> = {
                  timeline: { emoji: '📈', tone: 'yellow' },
                  'no-timeline': { emoji: '🧩', tone: 'peach' },
                  map: { emoji: '🗺️', tone: 'blue' },
                  process: { emoji: '⚙️', tone: 'lilac' },
                  mixed: { emoji: '🔀', tone: 'ink' },
                  'all-types': { emoji: '📚', tone: 'yellow' }
                }
                const order = ['timeline', 'no-timeline', 'map', 'process', 'mixed', 'all-types'] as const
                return order.map((id) => {
                  const section = byId[id]
                  if (!section) return null
                  const stamp = stamps[id] || { emoji: '✍️', tone: 'yellow' }
                  const badge =
                    id === 'timeline'
                      ? 'Start'
                      : id === 'all-types'
                        ? 'Vocab'
                        : id === 'no-timeline'
                          ? 'No year'
                          : section.title.split('·')[0]?.trim() || 'Task 1'
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className="wgTicket"
                      onClick={() => openCategory(section)}
                    >
                      <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                        {stamp.emoji}
                      </span>
                      <span className="wgTicketBody">
                        <span className="wgTicketTitleRow">
                          <strong>{section.title}</strong>
                          <span className="wgTicketBadge">{badge}</span>
                        </span>
                        <span className="wgTicketSub">
                          {id === 'timeline'
                            ? `${section.subtitle} — โจทย์ที่เจอบ่อยที่สุด`
                            : section.subtitle}
                        </span>
                      </span>
                      <span className="wgTicketGo">เข้าคลัง →</span>
                    </button>
                  )
                })
              })()}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'task1-questions' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · เลือกข้อ"
              title={activeCategory.title}
              subtitle="เดินตาม path · เลือก 1 ข้อ แล้วเข้าฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="ประเภทกราฟ"
            />
            <WgTicketPathList ariaLabel="รายการข้อสอบ Task 1">
              {(activeCategory.practicePrompts || []).map((prompt, index) => {
                const stamps = [
                  { emoji: '📝', tone: 'yellow' },
                  { emoji: '📊', tone: 'peach' },
                  { emoji: '📉', tone: 'blue' },
                  { emoji: '🗺', tone: 'lilac' },
                  { emoji: '⚙️', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                const meta =
                  prompt.kind === 'timeline'
                    ? `${prompt.chartTypeLabel} · ${prompt.years[0]}–${prompt.years[prompt.years.length - 1]}`
                    : prompt.chartTypeLabel
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({ step: 'task1-drill', categoryId: activeCategory.id, promptId: prompt.id })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{getWritingTask1ExamStem(prompt)}</strong>
                        <span className="wgTicketBadge">Q{prompt.number}</span>
                      </span>
                      <span className="wgTicketSub">{meta}</span>
                    </span>
                    <span className="wgTicketGo">ฝึกเขียน →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'task1-drill' && activeCategory && activePrompt ? (
          (() => {
            const rawExercise = getWritingGuidedBuilder(activePrompt.id)
            const exercise = rawExercise ? hardenTask1Exercise(rawExercise, { maxLetterHints: 14 }) : null
            const prompt = activePrompt
            const category = activeCategory
            return (
              <div className="writingGuideExamShell">
                <div className="writingGuideExamToolbar">
                  <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                    ← กลับไปเลือกข้อ
                  </button>
                  <button
                    type="button"
                    className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                    onClick={() => setShowHelper((open) => !open)}
                    aria-expanded={showHelper}
                  >
                    ตัวช่วย
                  </button>
                </div>
                {showHelper ? (
                  <WritingVocabularyHelper chipGroups={category.chipGroups} structures={category.structures} />
                ) : null}
                {exercise ? (
                  <WritingGuidedBuilder
                    key={exercise.id}
                    prompt={prompt}
                    exercise={exercise}
                    onSaveVocab={
                      onSaveVocabToNotebook
                        ? ({ word, thaiMeaning }) =>
                            onSaveVocabToNotebook({
                              word,
                              thaiMeaning,
                              questionTitle: prompt.title,
                              questionNumber: prompt.number
                            })
                        : undefined
                    }
                    onSaveEssay={
                      onSaveEssayToNotebook
                        ? ({ paragraphs, score }) =>
                            onSaveEssayToNotebook({
                              promptId: prompt.id,
                              categoryTitle: category.title,
                              questionTitle: prompt.title,
                              questionNumber: prompt.number,
                              prompt,
                              paragraphs,
                              score
                            })
                        : undefined
                    }
                  />
                ) : (
                  <div className="writingGuideComingSoon">
                    <p>Guided writing practice for this question is not ready yet.</p>
                  </div>
                )}
              </div>
            )
          })()
        ) : null}

        {flow.step === 'task1-guide' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · คำศัพท์"
              title={activeCategory.title}
              subtitle="แบบฝึกกำลังจะมาเพิ่ม — ระหว่างนี้กด “ตัวช่วย” เพื่อดูคำศัพท์และโครงสร้างได้เลย"
              onBack={goBack}
              backLabel="ประเภทกราฟ"
            />
            <div className="writingGuideExamToolbar writingGuideExamToolbar-inline">
              <button
                type="button"
                className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                onClick={() => setShowHelper((open) => !open)}
                aria-expanded={showHelper}
              >
                ตัวช่วย
              </button>
            </div>
            {showHelper ? (
              <WritingVocabularyHelper
                chipGroups={activeCategory.chipGroups}
                structures={activeCategory.structures}
              />
            ) : (
              <div className="writingGuideComingSoon">
                <p>Exam questions for this category are not ready yet.</p>
                <p>Tap <strong>ตัวช่วย</strong> to view recommended vocabulary and structures.</p>
              </div>
            )}
          </div>
        ) : null}

        {flow.step === 'task2-types' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={
                flow.track === 'general-training'
                  ? 'General Training Writing · Task 2'
                  : 'Academic Writing · Task 2'
              }
              title={
                flow.track === 'general-training'
                  ? 'GENERAL TRAINING WRITING'
                  : 'เลือกประเภทเรียงความที่อยากฝึก'
              }
              subtitle={
                flow.track === 'general-training'
                  ? '4 ประเภท · ประเภทละ 4 ข้อ · โครงสร้างเดียวกับ Academic แต่ใช้ภาษาที่ง่ายและเป็นธรรมชาติกว่า'
                  : 'เดินตาม path · ดูจุดเน้นของแต่ละแบบ แล้วเข้าฝึกเติมคำทีละย่อหน้า'
              }
              onBack={goBack}
              backLabel="กลับ"
            />
            {flow.track === 'general-training' ? (
              <div className="wgGtIntroTemplate">
                <span className="wgGtIntroTemplateLabel">Fixed introduction pattern</span>
                <p>
                  It is widely acknowledged that <strong>_____</strong> plays an important role in{' '}
                  <strong>_____</strong>. However, <strong>_____</strong>. I believe that{' '}
                  <strong>_____</strong>, and the reasons will be elaborated in this essay.
                </p>
                <small>
                  ใช้ pattern นี้กับ Agree or Disagree และ Discuss Both Views เท่านั้น · Double Question และ
                  Advantages &amp; Disadvantages ใช้ introduction pattern เดียวกับ Academic
                </small>
              </div>
            ) : null}
            <WgTicketPathList ariaLabel="ประเภท Task 2">
              {WRITING_TASK2_TYPES.map((item, index) => {
                const stamps = [
                  { emoji: '💬', tone: 'yellow' },
                  { emoji: '⚖️', tone: 'peach' },
                  { emoji: '🔍', tone: 'blue' },
                  { emoji: '💡', tone: 'lilac' },
                  { emoji: '🧩', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({
                        step: 'task2-questions',
                        typeId: item.id as WritingTask2TypeId,
                        track: flow.track
                      })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>
                          {flow.track === 'general-training' && item.id === 'to-what-extent'
                            ? 'Agree or Disagree'
                            : item.title}
                        </strong>
                        <span className="wgTicketBadge">
                          {flow.track === 'general-training' ? 'GT' : index === 0 ? 'Start' : 'Task 2'}
                        </span>
                      </span>
                      <span className="wgTicketSub">{item.subtitle}</span>
                    </span>
                    <span className="wgTicketGo">เข้าคลัง →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
            {flow.track === 'general-training' ? (
              <div className="wgGtStructureNote">
                <strong>General Training model</strong>
                <span>
                  ใช้หัวข้อใกล้ตัวและภาษา B1+/B2 ที่ตรงไปตรงมา แต่ยังตอบครบทุกส่วนและมีอย่างน้อย 250 คำ
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        {flow.step === 'task2-questions' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={
                flow.track === 'general-training'
                  ? 'General Training · Task 2 · เลือกข้อ'
                  : 'Academic · Task 2 · เลือกข้อ'
              }
              title={`${
                flow.track === 'general-training' && flow.typeId === 'to-what-extent'
                  ? 'Agree or Disagree'
                  : WRITING_TASK2_TYPES.find((item) => item.id === flow.typeId)?.title || 'Task 2'
              }${
                flow.track === 'general-training' ? ' · General Training' : ''
              }`}
              subtitle="เดินตาม path · เลือก 1 ข้อ แล้วเข้าฝึกเขียนทีละย่อหน้า"
              onBack={goBack}
              backLabel="ประเภทเรียงความ"
            />
            <WgTicketPathList ariaLabel="รายการข้อสอบ Task 2">
              {activeTask2Prompts.map((prompt, index) => {
                const stamps = [
                  { emoji: '💬', tone: 'yellow' },
                  { emoji: '⚖️', tone: 'peach' },
                  { emoji: '🔍', tone: 'blue' },
                  { emoji: '💡', tone: 'lilac' },
                  { emoji: '🧩', tone: 'ink' }
                ] as const
                const stamp = stamps[index % stamps.length]
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    className="wgTicket"
                    onClick={() => {
                      setShowHelper(false)
                      setFlow({
                        step: 'task2-drill',
                        typeId: flow.typeId,
                        promptId: prompt.id,
                        track: flow.track
                      })
                    }}
                  >
                    <span className={`wgTicketStamp wgTicketStamp-${stamp.tone}`} aria-hidden="true">
                      {stamp.emoji}
                    </span>
                    <span className="wgTicketBody">
                      <span className="wgTicketTitleRow">
                        <strong>{prompt.title}</strong>
                        <span className="wgTicketBadge">Q{prompt.number}</span>
                      </span>
                      <span className="wgTicketSub">{prompt.meta}</span>
                    </span>
                    <span className="wgTicketGo">ฝึกเขียน →</span>
                  </button>
                )
              })}
            </WgTicketPathList>
          </div>
        ) : null}

        {flow.step === 'task2-drill' && activeTask2Prompt ? (
          (() => {
            const rawExercise = getDenseWritingTask2Builder(activeTask2Prompt.id)
            const prompt = activeTask2Prompt
              const exercise = rawExercise
                ? hardenAcademicTask2Exercise(rawExercise, prompt.vocab, {
                    maxVocabMcq: 20,
                    vocabFillMode: 'letter-hint',
                    preferLetterHint: true
                  })
                : rawExercise
            const baseTypeTitle =
              prompt.track === 'general-training' && prompt.typeId === 'to-what-extent'
                ? 'Agree or Disagree'
                : WRITING_TASK2_TYPES.find((item) => item.id === prompt.typeId)?.title || 'Task 2'
            const typeTitle =
              prompt.track === 'general-training'
                ? `General Training Writing · ${baseTypeTitle}`
                : baseTypeTitle
            return (
              <div className="writingGuideExamShell">
                <div className="writingGuideExamToolbar">
                  <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                    ← กลับไปเลือกข้อ
                  </button>
                  {prompt.track === 'general-training' ? (
                    <button
                      type="button"
                      className="writingGuideVocabTestBtn"
                      onClick={() =>
                        setFlow({
                          step: 'gt-task2-vocab',
                          typeId: prompt.typeId,
                          promptId: prompt.id,
                          track: prompt.track
                        })
                      }
                    >
                      🧠 ทดสอบการใช้คำศัพท์ (40 ข้อ) →
                    </button>
                  ) : null}
                </div>
                {exercise ? (
                  <WritingTask2Practice
                    key={exercise.id}
                    prompt={prompt}
                    exercise={exercise}
                    onSaveVocab={
                      onSaveVocabToNotebook
                        ? (vocab) =>
                            onSaveVocabToNotebook({
                              word: vocab.word,
                              thaiMeaning: vocab.thaiMeaning,
                              questionTitle: prompt.title,
                              questionNumber: prompt.number
                            })
                        : undefined
                    }
                    onSaveEssay={
                      onSaveTask2EssayToNotebook
                        ? ({ paragraphs, score }) =>
                            onSaveTask2EssayToNotebook({
                              promptId: prompt.id,
                              track: prompt.track || 'academic',
                              typeTitle,
                              questionTitle: prompt.questionText,
                              questionNumber: prompt.number,
                              meta: prompt.meta,
                              paragraphs,
                              vocab: prompt.vocab,
                              score
                            })
                        : undefined
                    }
                  />
                ) : (
                  <div className="writingGuideComingSoon">
                    <p>Guided writing practice for this question is not ready yet.</p>
                  </div>
                )}
              </div>
            )
          })()
        ) : null}

        {flow.step === 'gt-task2-vocab' && activeTask2Prompt ? (
          <div className="writingGuideExamShell">
            <div className="writingGuideExamToolbar">
              <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                ← กลับไปฝึกเขียน
              </button>
            </div>
            <WritingTask2VocabQuiz
              key={activeTask2Prompt.id}
              prompt={activeTask2Prompt}
              onSaveVocab={
                onSaveVocabToNotebook
                  ? (vocab, quizPrompt) =>
                      onSaveVocabToNotebook({
                        word: vocab.word,
                        thaiMeaning: vocab.thaiMeaning,
                        questionTitle: quizPrompt.title,
                        questionNumber: quizPrompt.number
                      })
                  : undefined
              }
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
