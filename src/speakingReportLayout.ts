// Student-facing layout logic for the Speaking report (pure, so it can be tested).
//
// Why: a Nov 2026 review of a real Part 2 report found the same mistake shown up to 8 times
// (summary, mistake list, three skill ladders, Vocabulary Lift), numbers that disagreed
// ("about 4–5 mistakes" above a list of 10; target 6.5 vs 7.0), and ✓ ticks that quoted the
// student's own mistakes as proof. These helpers let the report show each mistake once,
// lead with the top 3, and keep every count and tick consistent.

export type ReportMistake = {
  originalText: string
  correctedText: string
  errorType?: string
  errorTypeThai?: string
  reasonThai?: string
}

export type ReportVocabSuggestion = {
  sourcePhrase: string
  replacement: string
  level?: string
  thaiMeaning?: string
  reasonThai?: string
  sourceQuestion?: string
}

/** Same keys as server/speakingMistakeQuality.mjs SPEAKING_MISTAKE_TYPES. */
export const REPORT_MISTAKE_TYPE_LABELS: Record<string, string> = {
  article: 'article (a / an / the)',
  plural: 'plural (เอกพจน์ / พหูพจน์)',
  preposition: 'preposition (in / on / at …)',
  'missing-word': 'missing word (ขาดคำ)',
  tense: 'tense (กาล)',
  'subject-verb': 'subject-verb agreement',
  'verb-pattern': 'verb pattern (-ing / to + verb)',
  'sentence-structure': 'sentence structure (การเชื่อมประโยค)',
  'word-form': 'word form (ชนิดคำ)',
  'word-order': 'word order (ลำดับคำ)',
  pronoun: 'pronoun (สรรพนาม)',
  'word-choice': 'word choice (การเลือกคำ)',
  other: 'grammar'
}

// Old reports carry free-text labels; map them the same way the server does.
const TYPE_RULES: Array<[string, RegExp]> = [
  ['subject-verb', /subject[- ]verb|subject and verb|s-v|sva|ประธาน.*กริยา/i],
  ['tense', /tense|กาล/i],
  ['article', /article|determiner|คำนำหน้า/i],
  ['plural', /plural|singular|uncountable|countable|quantifier|พหูพจน์|เอกพจน์|นับไม่ได้|นับได้/i],
  ['preposition', /preposition|บุพบท/i],
  ['verb-pattern', /gerund|infinitive|verb form|verb pattern|verb structure|verb usage|modal|auxiliary|passive|รูปกริยา/i],
  ['missing-word', /missing|omission|omitted|fragment|ขาด|ไม่สมบูรณ์/i],
  ['word-order', /word order|ลำดับคำ/i],
  ['word-form', /word form|part of speech|word class|adjective|adverb|comparative|superlative|ชนิดคำ/i],
  ['pronoun', /pronoun|possessive|demonstrative|สรรพนาม/i],
  ['sentence-structure', /structure|parallel|relative|clause|conjunction|run-on|โครงสร้าง|เชื่อม/i],
  ['word-choice', /word choice|vocab|collocation|คำศัพท์|เลือกคำ/i]
]

export const reportMistakeType = (mistake: Pick<ReportMistake, 'errorType' | 'errorTypeThai'>) => {
  const key = String(mistake.errorType || '').trim().toLowerCase()
  if (key && REPORT_MISTAKE_TYPE_LABELS[key]) return key
  const label = String(mistake.errorTypeThai || '')
  const hit = TYPE_RULES.find(([, pattern]) => pattern.test(label))
  return hit ? hit[0] : 'other'
}

/** Lower case, no punctuation, single spaces — for "is this the same words?" checks. */
export const normalizeQuote = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const containsQuote = (haystack: string, needle: string) => {
  const hay = ` ${normalizeQuote(haystack)} `
  const ndl = normalizeQuote(needle)
  return ndl.length > 0 && hay.includes(` ${ndl} `)
}

export type MistakeGroup = { type: string; label: string; items: ReportMistake[] }

/** One list, grouped by type, biggest group first (ties keep the order the grader found them). */
export const groupMistakes = (mistakes: ReportMistake[]): MistakeGroup[] => {
  const groups = new Map<string, MistakeGroup>()
  const seen = new Set<string>()
  for (const mistake of mistakes) {
    const quote = normalizeQuote(mistake.originalText)
    if (!quote || !normalizeQuote(mistake.correctedText) || seen.has(quote)) continue
    seen.add(quote)
    const type = reportMistakeType(mistake)
    const group = groups.get(type) || { type, label: REPORT_MISTAKE_TYPE_LABELS[type] || type, items: [] }
    group.items.push(mistake)
    groups.set(type, group)
  }
  return [...groups.values()].sort((left, right) => right.items.length - left.items.length)
}

/**
 * The top fixes shown first: one example from each of the biggest mistake types, so three
 * different habits rather than three of the same kind.
 */
export const pickTopFixes = (groups: MistakeGroup[], max = 3) =>
  groups.slice(0, max).map((group) => ({
    type: group.type,
    label: group.label,
    count: group.items.length,
    mistake: group.items.find(teachesSomething) || group.items[0]
  }))

/**
 * A good first example changes or adds a word. A fix that only deletes words
 * ("he named Ceiling" → "named Ceiling") is hard to learn from at a glance.
 */
const teachesSomething = (mistake: ReportMistake) => {
  const before = normalizeQuote(mistake.originalText).split(' ')
  const after = normalizeQuote(mistake.correctedText).split(' ')
  return after.some((word) => !before.includes(word))
}

/**
 * Vocabulary suggestions that are not already in the mistake list. The grader often files the
 * same slip twice ("economy recession" as a word-form mistake and as a vocabulary upgrade).
 */
export const filterVocabAgainstMistakes = (suggestions: ReportVocabSuggestion[], mistakes: ReportMistake[]) => {
  const quotes = mistakes.map((mistake) => mistake.originalText).filter(Boolean)
  return suggestions.filter((item) => {
    const source = item.sourcePhrase || ''
    if (!normalizeQuote(source)) return false
    return !quotes.some((quote) => containsQuote(quote, source) || containsQuote(source, quote))
  })
}

/** A ✓ tick must never quote one of the student's mistakes as proof. */
export const cleanTickEvidence = (evidence: string[], mistakes: ReportMistake[]) =>
  evidence.filter((item) => !mistakes.some((mistake) => containsQuote(item, mistake.originalText)))

/**
 * Ticks such as "✓ มี grammar error 4-5 ครั้ง" read like praise for making mistakes, and their
 * count disagrees with the real list. The list already says how many there are.
 */
export const isErrorAllowanceTick = (requirement: string) =>
  /error|mistake|ข้อผิดพลาด|ผิดได้ไม่เกิน|ผิดไม่เกิน|ไม่เกิน\s*\d+\s*(ครั้ง|จุด)/i.test(String(requirement || ''))

/**
 * The skill explanation is written before the mistake list is built, so its count can disagree
 * ("ประมาณ 4-5 ครั้ง" above 10 mistakes). Swap the count for the real one.
 */
export const alignMistakeCount = (text: string, count: number) => {
  if (!count) return String(text || '')
  return String(text || '').replace(
    /((?:ข้อผิดพลาด(?:ทางไวยากรณ์)?|grammar error|error))\s*(?:ประมาณ|ราว ๆ|ราว|about)?\s*\d+(?:\s*[-–]\s*\d+)?\s*(?:ครั้ง|จุด)/gi,
    `$1 ${count} จุด`
  )
}

/** Keep a +1 rewrite only the first time its sentence appears across the skill ladders. */
export const createChecklistDeduper = () => {
  const used = new Set<string>()
  return <T extends { originalText?: string; quote?: string }>(items: T[]) =>
    items.filter((item) => {
      const key = normalizeQuote(item.originalText || item.quote || '')
      if (!key) return true
      if (used.has(key)) return false
      used.add(key)
      return true
    })
}

/** "You reached your target" vs "you are not there yet", so the two targets stop disagreeing. */
export const describeTarget = (overallBand: number, expectedBand: number | null, nextBand: number) => {
  if (expectedBand == null) return { reached: false, text: `ขั้นต่อไป Band ${nextBand.toFixed(1)}` }
  if (overallBand >= expectedBand) {
    return { reached: true, text: `ถึงเป้า Band ${expectedBand.toFixed(1)} แล้ว · ขั้นต่อไป ${nextBand.toFixed(1)}` }
  }
  return { reached: false, text: `เป้า Band ${expectedBand.toFixed(1)} · อีก ${(expectedBand - overallBand).toFixed(1)}` }
}

export type AnswerSegment = { text: string; mistake?: ReportMistake }

/**
 * Split an answer so each mistake can be marked where the student said it. Longest quotes
 * win and marks never overlap; matching ignores case.
 */
export const segmentAnswerWithMistakes = (answer: string, mistakes: ReportMistake[]): AnswerSegment[] => {
  const text = String(answer || '')
  if (!text) return []
  const lower = text.toLowerCase()
  const taken: Array<{ start: number; end: number; mistake: ReportMistake }> = []
  const ordered = mistakes
    .filter((mistake) => String(mistake.originalText || '').trim().length >= 2)
    .sort((left, right) => right.originalText.length - left.originalText.length)
  for (const mistake of ordered) {
    const quote = mistake.originalText.trim().replace(/^["“”']+|["“”']+$/g, '').toLowerCase()
    if (!quote) continue
    let from = 0
    while (from <= lower.length) {
      const start = lower.indexOf(quote, from)
      if (start < 0) break
      const end = start + quote.length
      const before = start === 0 ? ' ' : lower[start - 1]
      const after = end >= lower.length ? ' ' : lower[end]
      const wordEdges = !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after)
      if (wordEdges && !taken.some((span) => start < span.end && end > span.start)) {
        taken.push({ start, end, mistake })
        break
      }
      from = start + 1
    }
  }
  taken.sort((left, right) => left.start - right.start)
  const segments: AnswerSegment[] = []
  let cursor = 0
  for (const span of taken) {
    if (span.start > cursor) segments.push({ text: text.slice(cursor, span.start) })
    segments.push({ text: text.slice(span.start, span.end), mistake: span.mistake })
    cursor = span.end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) })
  return segments
}

/** The message sent to the admin inbox when a student says the machine misheard them. */
export const buildMishearingReport = ({
  topic,
  heard,
  suggested
}: {
  topic: string
  heard: string
  suggested: string
}) => `[ระบบได้ยินผิด · Speaking] หัวข้อ: ${topic || '-'} | ระบบได้ยินว่า: "${heard}" | ระบบแก้เป็น: "${suggested}"`
