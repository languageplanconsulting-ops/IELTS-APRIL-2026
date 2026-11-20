// Shared paraphrase helpers for the Reading report and the notebook.
//
// A "pair" is question words ↔ passage words. Most pairs MEAN THE SAME (=), but
// the decisive pair of a FALSE / NO question CONTRADICTS (≠), and the decisive
// pair of a NOT GIVEN question is something the passage NEVER SAYS (≠). Showing
// those with "=" teaches the wrong lesson, so every renderer asks for the relation.
import {
  READING_NOT_GIVEN_CONTRAST_DATA,
  type ReadingNotGivenGap
} from './readingNotGivenContrastData.ts'
import { READING_FALSE_CONTRAST_DATA, type ReadingFalseGap } from './readingFalseContrastData.ts'

export type ReadingParaphraseRelation = 'same' | 'contradicts' | 'not-given'

export type ReadingNotGivenContrast = {
  /** Words from the question the passage does not support (verbatim). */
  q: string
  qTh: string
  /** Closest thing the passage really says (verbatim). */
  p: string
  pTh: string
  gap: ReadingNotGivenGap
  /** One simple Thai sentence ending in "→ NOT GIVEN". */
  why: string
}

/** Structured pair saved with a notebook entry. */
export type ReadingParaphraseNote = {
  q: string
  p: string
  th?: string
  note?: string
  relation?: ReadingParaphraseRelation
  /** Full question sentence, so the card can show the words in context. */
  questionText?: string
  /** Passage sentence (evidence), so the card can show the words in context. */
  passageText?: string
}

export const READING_NOT_GIVEN_GAP_LABELS: Record<ReadingNotGivenGap, string> = {
  time: '⏳ เวลาไม่ตรงกัน',
  'extra-detail': '➕ โจทย์เติมรายละเอียดเอง',
  comparison: '⚖️ บทความไม่ได้เปรียบเทียบ',
  cause: '🔗 บทความไม่ได้บอกเหตุผล',
  number: '🔢 บทความไม่ได้บอกตัวเลข',
  opinion: '💬 ผู้เขียนไม่ได้ให้ความเห็น',
  'different-topic': '🔀 คนละเรื่องกัน'
}

export const READING_FALSE_GAP_LABELS: Record<ReadingFalseGap, string> = {
  opposite: '🔄 ความหมายตรงข้าม',
  number: '🔢 ตัวเลขไม่ตรง',
  quantity: '📏 ปริมาณไม่ตรง (ทั้งหมด ≠ บางส่วน)',
  time: '⏳ เวลา/ลำดับไม่ตรง',
  'who-what': '👥 คนละคน / คนละสิ่ง',
  negation: '🚫 บทความบอกว่า “ไม่”'
}

/** One shape for both NOT GIVEN and FALSE / NO explanations in the report. */
export type ReadingJudgementContrast = {
  relation: Exclude<ReadingParaphraseRelation, 'same'>
  q: string
  qTh: string
  p: string
  pTh: string
  gapLabel: string
  why: string
}

export const READING_RELATION_LABELS: Record<ReadingParaphraseRelation, { sign: string; text: string }> = {
  same: { sign: '=', text: 'ความหมายเดียวกัน' },
  contradicts: { sign: '≠', text: 'ความหมายขัดกัน → FALSE / NO' },
  'not-given': { sign: '≠', text: 'บทความไม่ได้พูดถึง → NOT GIVEN' }
}

/** Same key the extract script uses (scripts/extractNotGiven.mjs). */
export const normalizeReadingNotGivenKey = (prompt: string) =>
  String(prompt || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export const lookupReadingNotGivenContrast = (prompt: string): ReadingNotGivenContrast | null =>
  READING_NOT_GIVEN_CONTRAST_DATA[normalizeReadingNotGivenKey(prompt)] ?? null

/**
 * The decisive mismatch for a TRUE/FALSE/NOT GIVEN (or YES/NO/NOT GIVEN) question:
 * NOT GIVEN → what the passage never says; FALSE / NO → what the passage contradicts.
 */
export const lookupReadingJudgementContrast = (
  prompt: string,
  correctAnswer: string
): ReadingJudgementContrast | null => {
  const answer = String(correctAnswer || '').trim().toUpperCase()
  const key = normalizeReadingNotGivenKey(prompt)
  if (answer.startsWith('NOT GIVEN')) {
    const entry = READING_NOT_GIVEN_CONTRAST_DATA[key]
    return entry ? { relation: 'not-given', ...entry, gapLabel: READING_NOT_GIVEN_GAP_LABELS[entry.gap] } : null
  }
  if (answer === 'FALSE' || answer === 'NO') {
    const entry = READING_FALSE_CONTRAST_DATA[key]
    return entry ? { relation: 'contradicts', ...entry, gapLabel: READING_FALSE_GAP_LABELS[entry.gap] } : null
  }
  return null
}

// The pair data marks a non-matching pair inside its Thai gloss, e.g.
// "ขึ้นกับฤดูกาล (แต่จริงคือตลอดทั้งปี)" or "สวยงามกว่า (บทความไม่กล่าวถึง)".
const MISMATCH_GLOSS = /\((?:แต่|ไม่ใช่|ไม่ได้|ไม่|บทความไม่)[^)]*\)|เทียบกับ|\bVS\b/i
const NOT_GIVEN_WORDING = /ไม่กล่าวถึง|ไม่ได้กล่าว|ไม่ได้บอก|ไม่ได้พูด|ไม่ได้ระบุ|ไม่พูดถึง|ไม่ระบุ|NOT GIVEN/i

const normalizeWords = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const inferReadingPairRelation = (
  pair: { q: string; p: string; th?: string; note?: string },
  context?: { correctAnswer?: string; contrastQuestionPhrase?: string }
): ReadingParaphraseRelation => {
  const answer = String(context?.correctAnswer || '').trim().toUpperCase()
  const gloss = String(pair.th || '')
  const glossMismatch = MISMATCH_GLOSS.test(gloss)
  const contrastQ = normalizeWords(context?.contrastQuestionPhrase || '')
  const pairQ = normalizeWords(pair.q)
  const overlapsContrast =
    contrastQ.length >= 4 && pairQ.length >= 4 && (pairQ.includes(contrastQ) || contrastQ.includes(pairQ))
  if (answer === 'NOT GIVEN') return overlapsContrast || glossMismatch ? 'not-given' : 'same'
  if (answer === 'FALSE' || answer === 'NO') return overlapsContrast || glossMismatch ? 'contradicts' : 'same'
  if (answer) return 'same'
  // Older notebook saves have no question context: read the gloss only.
  if (!glossMismatch) return 'same'
  return NOT_GIVEN_WORDING.test(`${gloss} ${pair.note || ''}`) ? 'not-given' : 'contradicts'
}

/**
 * Notebook entries saved before structured pairs existed store the pair as
 * quote "q  =  p", fix = note || p, thaiMeaning = th. Rebuild the pair from that.
 */
export const parseLegacyParaphraseEntry = (entry: {
  quote?: string
  fix?: string
  thaiMeaning?: string
}): ReadingParaphraseNote | null => {
  const match = /^([\s\S]+?)\s{2}[=≠]\s{2}([\s\S]+)$/.exec(String(entry.quote || '').trim())
  if (!match) return null
  const q = match[1].trim()
  const p = match[2].trim()
  if (!q || !p) return null
  const fix = String(entry.fix || '').trim()
  const note = fix && fix !== p ? fix : ''
  const th = String(entry.thaiMeaning || '').trim()
  return { q, p, th, note, relation: inferReadingPairRelation({ q, p, th, note }) }
}
