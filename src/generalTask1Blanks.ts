import type { GeneralTask1Register, GeneralTask1Sentence } from './writingGeneralTask1Data'
import { resolveThaiMeaning } from './writingLetterHint'

export type OptionPracticeBlank = {
  id: string
  kind: 'transition' | 'contraction' | 'conjunction'
  answer: string
  options: string[]
  sentenceIndex: number
}

export type PracticeBlank =
  | OptionPracticeBlank
  | {
      id: string
      kind: 'letter-hint'
      answer: string
      thaiMeaning: string
      sentenceIndex: number
    }

export type RenderSegment = { kind: 'text'; text: string } | { kind: 'blank'; blank: PracticeBlank }

const CONJUNCTION_CONFUSABLES: Record<string, string[]> = {
  and: ['but', 'so'],
  but: ['and', 'so'],
  so: ['and', 'but'],
  'so that': ['because', 'so'],
  because: ['although', 'when'],
  although: ['because', 'however'],
  when: ['while', 'because'],
  while: ['when', 'although'],
  since: ['because', 'when'],
  if: ['when', 'because'],
  whether: ['if', 'that'],
  which: ['who', 'that']
}


const CONTRACTION_OPTIONS: Record<string, string[]> = {
  "i'm": ["I'm", 'I am', 'I was'],
  "i've": ["I've", 'I have', 'I had'],
  "i'd": ["I'd", 'I would', 'I will'],
  "i'll": ["I'll", 'I will', 'I would'],
  "can't": ["can't", 'cannot', "won't"],
  "couldn't": ["couldn't", 'could not', "can't"],
  "don't": ["don't", 'do not', "didn't"],
  "didn't": ["didn't", 'did not', "don't"],
  "won't": ["won't", 'will not', "wouldn't"],
  "wouldn't": ["wouldn't", 'would not', "won't"],
  "it's": ["it's", 'it is', 'its'],
  "that's": ["that's", 'that is', 'this is'],
  "there's": ["there's", 'there is', 'there are'],
  "we're": ["we're", 'we are', 'we were'],
  "we've": ["we've", 'we have', 'we had'],
  "we'll": ["we'll", 'we will', 'we would'],
  "you're": ["you're", 'you are', 'your'],
  "you'll": ["you'll", 'you will', 'you would'],
  "you've": ["you've", 'you have', 'you had']
}

export const normalizeApostrophe = (value: string) => value.replaceAll('’', "'")

const getContractionOptions = (answer: string) => {
  const normalized = normalizeApostrophe(answer)
  const mapped = CONTRACTION_OPTIONS[normalized.toLowerCase()]
  if (mapped) return [answer, ...mapped.slice(1)]

  const lower = normalized.toLowerCase()
  const expanded = lower.endsWith("n't")
    ? `${normalized.slice(0, -3)} not`
    : lower.endsWith("'re")
      ? `${normalized.slice(0, -3)} are`
      : lower.endsWith("'ve")
        ? `${normalized.slice(0, -3)} have`
        : lower.endsWith("'ll")
          ? `${normalized.slice(0, -3)} will`
          : lower.endsWith("'d")
            ? `${normalized.slice(0, -2)} would`
            : lower.endsWith("'s")
              ? `${normalized.slice(0, -2)} is`
              : normalized
  return [answer, expanded, `${normalized.split("'")[0]} had`]
}

const getConjunctionOptions = (answer: string) => {
  const lower = normalizeApostrophe(answer).toLowerCase()
  const confusables = CONJUNCTION_CONFUSABLES[lower] ?? ['and', 'but']
  return [...new Set([answer, ...confusables])].slice(0, 3)
}

export const transitionOptions = (answer: string, seed: number, bank: string[]) => {
  const distractors = bank.filter((item) => item !== answer)
  const offset = distractors.length > 0 ? seed % distractors.length : 0
  const options = [...distractors.slice(offset), ...distractors.slice(0, offset)].slice(0, 3)
  options.splice(seed % 4, 0, answer)
  return [...new Set(options)]
}

const CONTRACTION_RE =
  /\b(?:I|you|he|she|it|we|they|there|that|who|what|can|could|do|does|did|is|are|was|were|will|would|should|have|has)[’'][A-Za-z]+\b/gi
const CONJUNCTION_RE = /\b(?:so that|because|although|whether|while|since|which|when|and|but|so|if)\b/gi

/** Words worth ≥4 letters are candidates for an extra letter-hint blank. */
const CONTENT_WORD_RE = /\b[A-Za-z][A-Za-z'-]{3,}\b/g

/** Extra letter-hints added per sentence on top of the practicalVocab matches. */
const EXTRA_LETTER_HINTS_PER_SENTENCE = 3

/**
 * Function words carry no vocabulary value, so blanking them teaches nothing.
 * Quantifiers (much, many, most) are deliberately NOT here — they are worth drilling.
 */
const LETTER_HINT_STOPWORDS = new Set([
  'about',
  'after',
  'again',
  'also',
  'been',
  'before',
  'being',
  'both',
  'came',
  'come',
  'does',
  'doing',
  'done',
  'down',
  'each',
  'even',
  'ever',
  'from',
  'gets',
  'give',
  'goes',
  'gone',
  'have',
  'here',
  'into',
  'just',
  'know',
  'like',
  'made',
  'make',
  'mine',
  'more',
  'must',
  'need',
  'once',
  'only',
  'other',
  'ours',
  'over',
  'said',
  'same',
  'shall',
  'should',
  'some',
  'such',
  'sure',
  'take',
  'than',
  'that',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'thing',
  'things',
  'this',
  'those',
  'through',
  'time',
  'upon',
  'used',
  'very',
  'want',
  'well',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'will',
  'with',
  'would',
  'your',
  'yours'
])

export const TRANSITION_BANKS: Record<GeneralTask1Register, string[]> = {
  informal: [
    'First of all,',
    'Honestly,',
    'Also,',
    'For example,',
    'By the way,',
    'Anyway,',
    'However,',
    'Luckily,',
    'Then,',
    'Afterwards,',
    'Finally,',
    'Most importantly,'
  ],
  'semi-formal': [
    'First of all,',
    'Firstly,',
    'As you may remember,',
    'As you know,',
    'In fact,',
    'Actually,',
    'In addition,',
    'Moreover,',
    'However,',
    'Unfortunately,',
    'Honestly,',
    'If possible,',
    'Of course,',
    'Finally,'
  ],
  formal: [
    'First of all,',
    'To begin with,',
    'Firstly,',
    'In addition,',
    'Furthermore,',
    'Moreover,',
    'However,',
    'Unfortunately,',
    'Consequently,',
    'Therefore,',
    'In particular,',
    'Finally,'
  ]
}

export const buildSentenceSegments = (
  sentence: GeneralTask1Sentence,
  register: GeneralTask1Register,
  paragraphIndex: number,
  sentenceIndex: number,
  vocab: readonly { phrase: string; thaiMeaning: string }[]
): RenderSegment[] => {
  const transitionEnd = sentence.transition.length
  const rest = sentence.text.slice(transitionEnd)
  type Candidate =
    | { start: number; end: number; answer: string; kind: 'contraction' | 'conjunction' }
    | { start: number; end: number; answer: string; kind: 'letter-hint'; thaiMeaning: string }
  const blankCandidates: Candidate[] = []

  for (const match of rest.matchAll(CONTRACTION_RE)) {
    if (match.index === undefined) continue
    blankCandidates.push({
      start: match.index,
      end: match.index + match[0].length,
      answer: match[0],
      kind: 'contraction'
    })
  }

  for (const match of rest.matchAll(CONJUNCTION_RE)) {
    if (match.index === undefined) continue
    blankCandidates.push({
      start: match.index,
      end: match.index + match[0].length,
      answer: match[0],
      kind: 'conjunction'
    })
  }

  // Practical vocab → letter-hint fill-ins (prefer longer phrases / head words)
  for (const item of vocab) {
    const parts = item.phrase.trim().split(/\s+/).filter(Boolean)
    const candidates = [item.phrase.trim(), ...(parts.length > 1 ? [parts[parts.length - 1]] : [])]
    for (const candidate of candidates) {
      if (candidate.length < 5 || /\s/.test(candidate)) continue
      if (!/^[A-Za-z][A-Za-z'-]*$/.test(candidate)) continue
      const match = new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').exec(rest)
      if (!match || match.index == null) continue
      const start = match.index
      const end = start + match[0].length
      if (blankCandidates.some((h) => !(end <= h.start || start >= h.end))) continue
      blankCandidates.push({
        start,
        end,
        answer: match[0],
        kind: 'letter-hint',
        thaiMeaning: item.thaiMeaning
      })
      break
    }
  }

  // Content words → extra letter-hint fill-ins. The exact surface form is the
  // answer, so the learner has to produce "reports" not "report" and
  // "finished" not "finish" — the inflection is the point of the drill.
  const vocabHintCount = blankCandidates.filter((item) => item.kind === 'letter-hint').length
  const extraBudget = Math.max(EXTRA_LETTER_HINTS_PER_SENTENCE, vocabHintCount)

  const eligible: { start: number; end: number; answer: string; thaiMeaning: string }[] = []
  for (const match of rest.matchAll(CONTENT_WORD_RE)) {
    if (match.index == null) continue
    const word = match[0]
    const start = match.index
    const end = start + word.length
    if (LETTER_HINT_STOPWORDS.has(word.toLowerCase())) continue
    // Proper nouns mid-sentence (names, months) are spelling trivia, not vocabulary.
    if (start > 0 && /^[A-Z]/.test(word)) continue
    if (blankCandidates.some((item) => !(end <= item.start || start >= item.end))) continue
    const gloss = resolveThaiMeaning(word)
    if (!gloss) continue
    eligible.push({ start, end, answer: word, thaiMeaning: gloss })
  }

  // Spread the picks across the whole sentence instead of taking the first N —
  // otherwise every blank lands in the opening clause and the verb at the end
  // ("still runs", "could easily chair") is never drilled.
  const picks =
    eligible.length <= extraBudget
      ? eligible
      : Array.from({ length: extraBudget }, (_, index) =>
          eligible[Math.round((index * (eligible.length - 1)) / Math.max(extraBudget - 1, 1))]
        )
  for (const pick of picks) {
    if (blankCandidates.some((item) => !(pick.end <= item.start || pick.start >= item.end))) continue
    blankCandidates.push({ ...pick, kind: 'letter-hint' })
  }

  blankCandidates.sort((left, right) => left.start - right.start)
  const segments: RenderSegment[] = [
    {
      kind: 'blank',
      blank: {
        id: `gt1-${paragraphIndex}-${sentenceIndex}-transition`,
        kind: 'transition',
        answer: sentence.transition,
        options: transitionOptions(
          sentence.transition,
          paragraphIndex * 4 + sentenceIndex,
          TRANSITION_BANKS[register]
        ),
        sentenceIndex
      }
    }
  ]
  let cursor = 0
  let blankIndex = 0
  for (const candidate of blankCandidates) {
    if (candidate.start < cursor) continue
    if (candidate.start > cursor) segments.push({ kind: 'text', text: rest.slice(cursor, candidate.start) })
    if (candidate.kind === 'letter-hint') {
      segments.push({
        kind: 'blank',
        blank: {
          id: `gt1-${paragraphIndex}-${sentenceIndex}-letter-${blankIndex}`,
          kind: 'letter-hint',
          answer: candidate.answer,
          thaiMeaning: candidate.thaiMeaning,
          sentenceIndex
        }
      })
    } else {
      const options =
        candidate.kind === 'contraction'
          ? getContractionOptions(candidate.answer)
          : getConjunctionOptions(candidate.answer)
      segments.push({
        kind: 'blank',
        blank: {
          id: `gt1-${paragraphIndex}-${sentenceIndex}-${candidate.kind}-${blankIndex}`,
          kind: candidate.kind,
          answer: candidate.answer,
          options: [...new Set(options)],
          sentenceIndex
        }
      })
    }
    cursor = candidate.end
    blankIndex += 1
  }
  if (cursor < rest.length) segments.push({ kind: 'text', text: rest.slice(cursor) })
  return segments
}
