export type HighlightCriterion = 'grammar' | 'vocabulary' | 'fluency'

export type HighlightStrength = {
  criterion: HighlightCriterion
  text: string
}

export type HighlightGrammarWeakness = {
  errorType: string
  originalText: string
  correctedText: string
  reasonThai: string
}

export type HighlightVocabWeakness = {
  sourcePhrase: string
  replacement: string
  level: string
  thaiMeaning: string
  reasonThai: string
}

export type HighlightSummary = {
  expectedScoreId: string
  expectedBandLabel: string
  expectedBand: number | null
  strengths: HighlightStrength[]
  grammarWeakness: HighlightGrammarWeakness | null
  vocabWeakness: HighlightVocabWeakness | null
}

type GrammarMistakeLike = {
  originalText?: string
  correctedText?: string
  errorTypeThai?: string
  reasonThai?: string
  issue?: string
  evidence?: string
  suggestion?: string
}

type VocabSuggestionLike = {
  sourcePhrase?: string
  replacement?: string
  level?: string
  thaiMeaning?: string
  reasonThai?: string
}

type TickLike = {
  requirement?: string
  isMet?: boolean
}

export const EXPECTED_SCORE_BAND: Record<string, number | null> = {
  explore: null,
  band5: 5,
  band55: 5.5,
  band6: 6,
  band65: 6.5,
  band7: 7,
  band75: 7.5,
  band8: 8,
  band85: 8.5,
  band89: 8
}

const GRAMMAR_TAG_RULES: Array<{ test: RegExp; tag: string }> = [
  { test: /article|คำนำหน้า/i, tag: 'ARTICLE' },
  { test: /uncountable|นับไม่ได้/i, tag: 'UNCOUNTABLE' },
  { test: /singular|plural|agreement|number|เอกพจน์|พหูพจน์/i, tag: 'NUMBER' },
  { test: /subject-verb|sva|ประธาน.*กริยา/i, tag: 'S-V AGREEMENT' },
  { test: /tense|past|present|perfect|กาล/i, tag: 'TENSE' },
  { test: /preposition|บุพบท/i, tag: 'PREPOSITION' },
  { test: /parallel/i, tag: 'PARALLELISM' },
  { test: /word order|ลำดับคำ/i, tag: 'WORD ORDER' },
  { test: /passive/i, tag: 'PASSIVE' },
  { test: /conjunction|คำเชื่อม/i, tag: 'CONJUNCTION' }
]

const CRITERION_LABEL_TH: Record<HighlightCriterion, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  fluency: 'Fluency'
}

export const highlightCriterionLabel = (criterion: HighlightCriterion) => CRITERION_LABEL_TH[criterion]

export const expectedScoreLabel = (id: string) => {
  if (!id || id === 'explore') return 'ดูคะแนนคร่าว ๆ'
  const band = EXPECTED_SCORE_BAND[id]
  return band != null ? `Band ${formatBand(band)}` : 'ดูคะแนนคร่าว ๆ'
}

export const formatBand = (band: number) => (Number.isInteger(band) ? String(band) : band.toFixed(1))

const stripQuotes = (value: string) => {
  let text = String(value || '').trim()
  while (text.length >= 2 && ['"', '“', '”', "'"].includes(text[0]) && ['"', '“', '”', "'"].includes(text[text.length - 1])) {
    text = text.slice(1, -1).trim()
  }
  return text
}

export const grammarErrorTag = (raw: string) => {
  const source = String(raw || '').trim()
  const match = GRAMMAR_TAG_RULES.find((rule) => rule.test.test(source))
  if (match) return match.tag
  const fallback = source.replace(/\s+/g, ' ').trim().toUpperCase()
  return fallback || 'GRAMMAR'
}

const classifyStrength = (text: string): HighlightCriterion => {
  const value = String(text || '')
  if (/conjunction|tense|past tense|ไวยากรณ์|passive|article|singular|plural/i.test(value)) {
    return 'grammar'
  }
  if (/คำศัพท์|collocation|vocab|lexical|C1|C2|B1\+|B2/i.test(value)) {
    return 'vocabulary'
  }
  if (/ลื่น|คล่อง|referenc|flow|fluency|hesitat|pause|ชัดเจน|เข้าใจง่าย|ไม่ซับซ้อน/i.test(value)) {
    return 'fluency'
  }
  return 'grammar'
}

const isNegativeTick = (requirement: string) =>
  /error|ผิด|แปลกหู|สะดุด|รบกวน|ไม่ใช้|ไม่มี|เข้าใจไม่ได้/i.test(requirement)

const preferredVocabLevels = (band: number | null) => {
  if (band == null || band <= 6) return ['B1', 'B2', 'C1', 'C2']
  if (band <= 7) return ['B2', 'B1', 'C1', 'C2']
  return ['C1', 'C2', 'B2', 'B1']
}

const normalizeMistake = (item: GrammarMistakeLike): HighlightGrammarWeakness | null => {
  const originalText = stripQuotes(item.originalText || item.evidence || '')
  const correctedText = stripQuotes(item.correctedText || item.suggestion || '')
  if (!originalText || !correctedText || originalText === correctedText) return null
  return {
    errorType: grammarErrorTag(item.errorTypeThai || item.issue || ''),
    originalText,
    correctedText,
    reasonThai: String(item.reasonThai || '').trim()
  }
}

const pickGrammarWeakness = (mistakes: GrammarMistakeLike[]) => {
  const normalized = mistakes.map(normalizeMistake).filter((item): item is HighlightGrammarWeakness => Boolean(item))
  return normalized[0] || null
}

const isNaturalnessOnlyReason = (reason: string) => {
  const text = String(reason || '')
  const mentionsNaturalness = /ธรรมชาติ|natural|idiom|สำนวน|ฟังดูดี|ลื่นไหลกว่า|ยกระดับคำศัพท์ให้ดู|more native|more fluent/i.test(
    text
  )
  const mentionsWrong = /ผิดความหมาย|ผิดบริบท|ใช้ผิด|คำผิด|wrong word|incorrect|ไม่ถูกต้อง|collocation ที่ผิด/i.test(text)
  return mentionsNaturalness && !mentionsWrong
}

const pickVocabWeakness = (
  suggestions: VocabSuggestionLike[],
  expectedBand: number | null,
  grammarQuote: string
) => {
  const grammar = grammarQuote.trim().toLowerCase()
  const ranked = preferredVocabLevels(expectedBand)
  const usable = suggestions
    .map((item) => ({
      sourcePhrase: stripQuotes(item.sourcePhrase || ''),
      replacement: stripQuotes(item.replacement || ''),
      level: String(item.level || '').trim().toUpperCase(),
      thaiMeaning: String(item.thaiMeaning || '').trim(),
      reasonThai: String(item.reasonThai || '').trim()
    }))
    .filter((item) => item.sourcePhrase && item.replacement && item.sourcePhrase !== item.replacement)
    .filter((item) => !isNaturalnessOnlyReason(item.reasonThai))
    .filter((item) => !grammar || !item.sourcePhrase.toLowerCase().includes(grammar))
    .filter((item) => !grammar || !grammar.includes(item.sourcePhrase.toLowerCase()))

  usable.sort((a, b) => {
    const aRank = ranked.indexOf(a.level)
    const bRank = ranked.indexOf(b.level)
    return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank)
  })
  return usable[0] || null
}

const pickStrengths = ({
  strengths,
  ticks
}: {
  strengths: string[]
  ticks: Array<{ criterion: HighlightCriterion; requirement: string; isMet: boolean }>
}): HighlightStrength[] => {
  const fromReport = strengths
    .map((text) => String(text || '').trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((text) => ({ criterion: classifyStrength(text), text }))

  if (fromReport.length >= 3) return fromReport

  const extras = ticks
    .filter((item) => item.isMet && item.requirement && !isNegativeTick(item.requirement))
    .map((item) => ({
      criterion: item.criterion,
      text: item.requirement
    }))

  const merged = [...fromReport]
  for (const extra of extras) {
    if (merged.length >= 3) break
    if (merged.some((item) => item.text === extra.text)) continue
    merged.push(extra)
  }
  return merged.slice(0, 3)
}

export const buildHighlightSummary = ({
  expectedScoreId,
  strengths,
  grammarMistakes,
  vocabularyLevelUpSuggestions,
  componentReports,
  mockGrammarMistakes
}: {
  expectedScoreId?: string
  strengths?: string[]
  grammarMistakes?: GrammarMistakeLike[]
  vocabularyLevelUpSuggestions?: VocabSuggestionLike[]
  componentReports?: {
    grammar?: { grammarMistakes?: GrammarMistakeLike[]; requiredTicks?: TickLike[] }
    lexical?: { requiredTicks?: TickLike[] }
    fluency?: { requiredTicks?: TickLike[] }
  }
  mockGrammarMistakes?: GrammarMistakeLike[]
} = {}): HighlightSummary => {
  const id = String(expectedScoreId || 'explore').trim() || 'explore'
  const expectedBand = Object.prototype.hasOwnProperty.call(EXPECTED_SCORE_BAND, id)
    ? EXPECTED_SCORE_BAND[id]
    : null
  const mistakes = [
    ...(Array.isArray(grammarMistakes) ? grammarMistakes : []),
    ...(Array.isArray(componentReports?.grammar?.grammarMistakes) ? componentReports.grammar.grammarMistakes : []),
    ...(Array.isArray(mockGrammarMistakes) ? mockGrammarMistakes : [])
  ]
  const grammarWeakness = pickGrammarWeakness(mistakes)
  const vocabWeakness = pickVocabWeakness(
    Array.isArray(vocabularyLevelUpSuggestions) ? vocabularyLevelUpSuggestions : [],
    expectedBand,
    grammarWeakness?.originalText || ''
  )
  const ticks = [
    ...(componentReports?.grammar?.requiredTicks || []).map((item) => ({
      criterion: 'grammar' as const,
      requirement: String(item?.requirement || '').trim(),
      isMet: Boolean(item?.isMet)
    })),
    ...(componentReports?.lexical?.requiredTicks || []).map((item) => ({
      criterion: 'vocabulary' as const,
      requirement: String(item?.requirement || '').trim(),
      isMet: Boolean(item?.isMet)
    })),
    ...(componentReports?.fluency?.requiredTicks || []).map((item) => ({
      criterion: 'fluency' as const,
      requirement: String(item?.requirement || '').trim(),
      isMet: Boolean(item?.isMet)
    }))
  ]

  return {
    expectedScoreId: id,
    expectedBandLabel: expectedScoreLabel(id),
    expectedBand,
    strengths: pickStrengths({
      strengths: Array.isArray(strengths) ? strengths : [],
      ticks
    }),
    grammarWeakness,
    vocabWeakness
  }
}
