import type { WritingTask2Prompt } from './writingTask2Data'

// ─────────────────────────────────────────────────────────────────────────────
// Vocab-usage quiz engine for General Training Task 2.
//
// Goal: stop the vocab from "just showing up" (copyable). Every question forces
// the learner to decide HOW to use the word — the right collocate, the right
// word-form, or to spot the only natural sentence. Questions are generated from
// the REAL essay sentences (free, authentic context) plus small word-keyed data
// (word families + collocate alternatives) shared across all essays.
// ─────────────────────────────────────────────────────────────────────────────

export type VocabQuizKind = 'collocation' | 'word-form' | 'spot-usage' | 'spell'

export type VocabQuizChoice = { text: string; correct: boolean }

export type VocabQuizQuestion = {
  id: string
  kind: VocabQuizKind
  word: string
  thaiMeaning: string
  instruction: string
  // Cloze kinds (collocation / word-form / spell): a sentence split around one blank.
  before?: string
  after?: string
  // Choice kinds carry choices (single word/phrase, or full sentence for spot-usage).
  choices: VocabQuizChoice[]
  // Spell kind: the full target word plus the starting letters that are revealed.
  answer?: string
  prefix?: string
  explain: string
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'with',
  'without', 'at', 'by', 'as', 'that', 'this', 'their', 'your', 'our'
])

// Word families keyed by EVERY member (lowercased) → the full ordered family.
// Used for word-form questions and form-swap spot-usage. Add a member here and
// every essay that uses any form of the word gains form questions automatically.
// Clean part-of-speech families only (noun / adjective / adverb of ONE lemma).
// No plurals, no antonyms — so exactly one form fits any given grammar slot.
const WORD_FAMILY_GROUPS: string[][] = [
  ['independence', 'independent', 'independently'],
  ['responsibility', 'responsible', 'responsibly'],
  ['flexibility', 'flexible', 'flexibly'],
  ['reliability', 'reliable', 'reliably'],
  ['affordability', 'affordable', 'affordably'],
  ['safety', 'safe', 'safely'],
  ['practicality', 'practical', 'practically'],
  ['profession', 'professional', 'professionally'],
  ['education', 'educational', 'educationally'],
  ['finance', 'financial', 'financially'],
  ['society', 'social', 'socially'],
  ['nation', 'national', 'nationally'],
  ['person', 'personal', 'personally'],
  ['stability', 'stable', 'stably'],
  ['ability', 'able', 'ably'],
  ['necessity', 'necessary', 'necessarily'],
  ['isolation', 'isolated'],
  ['prevention', 'preventable'],
  ['ambition', 'ambitious', 'ambitiously'],
  ['physically', 'physical'],
  ['adequacy', 'adequate', 'adequately'],
  ['accuracy', 'accurate', 'accurately'],
  ['history', 'historical', 'historically'],
  ['environment', 'environmental', 'environmentally'],
  ['mobility', 'mobile'],
  ['speciality', 'specialist', 'special'],
  ['familiarity', 'familiar'],
  ['distress', 'distressing'],
  ['commitment', 'committed'],
  ['meaning', 'meaningful', 'meaningfully']
]

const WORD_FAMILY: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const group of WORD_FAMILY_GROUPS) {
    for (const member of group) {
      // First group that mentions a member wins, keeping families deterministic.
      if (!map[member]) map[member] = group
    }
  }
  return map
})()

// Collocate alternatives keyed by a VERB → verbs that clearly do NOT collocate
// with the same object (wrong meaning/direction), so there is only one right
// answer. Adjective collocations are handled by word families or safe gaps.
const COLLOCATE_ALTERNATIVES: Record<string, string[]> = {
  build: ['make', 'do', 'fix'],
  develop: ['make', 'fix', 'open'],
  gain: ['reach', 'collect', 'grab'],
  share: ['spend', 'waste', 'carry'],
  prevent: ['delay', 'deny', 'remove'],
  cause: ['ease', 'solve', 'reduce'],
  divide: ['multiply', 'add', 'raise'],
  reject: ['accept', 'approve', 'allow'],
  support: ['oppose', 'ignore', 'block'],
  receive: ['lose', 'give', 'send'],
  bring: ['leave', 'lose', 'drop'],
  reduce: ['raise', 'boost', 'extend'],
  provide: ['deny', 'remove', 'lack'],
  protect: ['harm', 'risk', 'weaken'],
  book: ['cancel', 'leave', 'lose'],
  gather: ['scatter', 'drop', 'spill']
}

const NOUN_DISTRACTORS = [
  'thing', 'matter', 'way', 'part', 'system', 'method', 'area', 'point',
  'side', 'level', 'stage', 'group', 'factor', 'process'
]

const SENTENCE_SPLIT = /(?<=[.!?])\s+/

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Deterministic string hash → seed, so option order is stable across renders.
const hashSeed = (value: string): number => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const seededShuffle = <T,>(items: T[], seedStr: string): T[] => {
  const array = [...items]
  let seed = hashSeed(seedStr) || 1
  for (let index = array.length - 1; index > 0; index -= 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    const target = seed % (index + 1)
    ;[array[index], array[target]] = [array[target], array[index]]
  }
  return array
}

const pickDistractors = (pool: string[], exclude: string, count: number, seedStr: string): string[] => {
  const filtered = pool.filter((item) => item.toLowerCase() !== exclude.toLowerCase())
  return seededShuffle(filtered, seedStr).slice(0, count)
}

type Token = { word: string; start: number; end: number }

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = []
  const regex = /[A-Za-z][A-Za-z'-]*/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(text))) {
    tokens.push({ word: match[0], start: match.index, end: match.index + match[0].length })
  }
  return tokens
}

// Locate the collocation phrase inside a sentence, tolerating a plural on the
// final word (essay may say "fixed schedules" for "fixed schedule").
const locatePhrase = (sentence: string, phrase: string): { start: number; end: number } | null => {
  const words = phrase.split(/\s+/).map(escapeRegExp)
  if (!words.length) return null
  const last = words.length - 1
  words[last] = `${words[last]}(?:s|es)?`
  const regex = new RegExp(`\\b${words.join('\\s+')}\\b`, 'i')
  const match = regex.exec(sentence)
  if (!match) return null
  return { start: match.index, end: match.index + match[0].length }
}

const findSentence = (sentences: string[], phrase: string): string | null => {
  for (const sentence of sentences) {
    if (locatePhrase(sentence, phrase)) return sentence
  }
  return null
}

// Build a cloze (before / answer / after) by blanking one token span.
const clozeAround = (sentence: string, token: Token) => ({
  before: sentence.slice(0, token.start),
  answer: sentence.slice(token.start, token.end),
  after: sentence.slice(token.end)
})

const contentTokensInPhrase = (sentence: string, span: { start: number; end: number }): Token[] =>
  tokenize(sentence.slice(span.start, span.end))
    .map((token) => ({ word: token.word, start: token.start + span.start, end: token.end + span.start }))
    .filter((token) => !STOPWORDS.has(token.word.toLowerCase()))

const capitalMatch = (source: string, sample: string): string =>
  source[0] === source[0]?.toUpperCase() ? sample.charAt(0).toUpperCase() + sample.slice(1) : sample

export const buildVocabQuiz = (prompt: WritingTask2Prompt, targetCount = 40): VocabQuizQuestion[] => {
  const essay = prompt.paragraphs.map((paragraph) => paragraph.text).join(' ')
  const sentences = essay.split(SENTENCE_SPLIT)
  const questions: VocabQuizQuestion[] = []
  const seen = new Set<string>()

  const push = (question: VocabQuizQuestion) => {
    const signature = `${question.kind}|${question.before ?? ''}|${question.choices.find((c) => c.correct)?.text ?? ''}`
    if (seen.has(signature)) return
    seen.add(signature)
    questions.push(question)
  }

  prompt.vocab.forEach((item, vocabIndex) => {
    const phrase = item.word
    const sentence = findSentence(sentences, phrase)
    if (!sentence) return
    const span = locatePhrase(sentence, phrase)
    if (!span) return
    const content = contentTokensInPhrase(sentence, span)
    if (!content.length) return

    const head = content[content.length - 1]
    const idBase = `${prompt.id}-vq-${vocabIndex}`

    // ── One gap per content token, using the strongest test available for it ──
    content.forEach((token, tokenIndex) => {
      const lower = token.word.toLowerCase()
      const family = WORD_FAMILY[lower]
      const alts = COLLOCATE_ALTERNATIVES[lower]
      const cloze = clozeAround(sentence, token)
      // Only run a word-form question when the essay uses an exact family member
      // (guards against plurals/inflections that would leave no correct option).
      const familyExact = family && family.some((form) => form.toLowerCase() === lower)

      if (familyExact && family.length >= 3) {
        // Word-form: options are the same lemma in different parts of speech.
        const options = seededShuffle(
          family.map((form) => capitalMatch(cloze.answer, form)),
          `${idBase}-${tokenIndex}-form`
        )
        push({
          id: `${idBase}-${tokenIndex}-form`,
          kind: 'word-form',
          word: phrase,
          thaiMeaning: item.thaiMeaning,
          instruction: 'เลือก “รูปคำ” ที่ถูกต้องตามหน้าที่ในประโยค',
          before: cloze.before,
          after: cloze.after,
          choices: options.map((text) => ({ text, correct: text.toLowerCase() === cloze.answer.toLowerCase() })),
          explain: `ต้องใช้ “${cloze.answer}” ให้ตรงหน้าที่ในประโยค — รูปอื่นในตระกูลคำ (${family.join(' / ')}) เป็นคนละหน้าที่ (คำนาม/คุณศัพท์/กริยาวิเศษณ์) จึงเติมลงช่องนี้ไม่ได้`
        })
      } else if (alts) {
        // Collocation: same part of speech, but the wrong partner for this word.
        const options = seededShuffle(
          [cloze.answer, ...alts.map((word) => capitalMatch(cloze.answer, word))],
          `${idBase}-${tokenIndex}-colloc`
        )
        push({
          id: `${idBase}-${tokenIndex}-colloc`,
          kind: 'collocation',
          word: phrase,
          thaiMeaning: item.thaiMeaning,
          instruction: 'เลือกคำที่ “เข้าคู่” (collocation) ได้ถูกต้อง',
          before: cloze.before,
          after: cloze.after,
          choices: options.map((text) => ({ text, correct: text.toLowerCase() === cloze.answer.toLowerCase() })),
          explain: `“${phrase}” ใช้คำว่า “${cloze.answer}” — คำอย่าง ${alts.slice(0, 2).join(', ')} มีความหมายใกล้เคียงแต่ไม่เข้าคู่กันตามธรรมชาติของภาษา`
        })
      } else {
        // Fallback: complete the phrase with the right word (generic-noun distractors).
        const distractors = pickDistractors(NOUN_DISTRACTORS, token.word, 3, `${idBase}-${tokenIndex}-gap`)
        const options = seededShuffle(
          [cloze.answer, ...distractors.map((word) => capitalMatch(cloze.answer, word))],
          `${idBase}-${tokenIndex}-gap`
        )
        push({
          id: `${idBase}-${tokenIndex}-gap`,
          kind: 'collocation',
          word: phrase,
          thaiMeaning: item.thaiMeaning,
          instruction: 'เลือกคำที่ทำให้วลีสมบูรณ์และเป็นธรรมชาติ',
          before: cloze.before,
          after: cloze.after,
          choices: options.map((text) => ({ text, correct: text.toLowerCase() === cloze.answer.toLowerCase() })),
          explain: `“${phrase}” (${item.thaiMeaning}) — ช่องนี้ต้องเป็น “${cloze.answer}” เพื่อให้วลีถูกต้อง`
        })
      }
    })

    // ── Spell it: reveal the first 2–3 letters, one box per missing letter ──
    const spellTargets = [head, content[0]].filter(
      (token, position, list) =>
        /^[A-Za-z]+$/.test(token.word) &&
        token.word.length >= 4 &&
        list.findIndex((other) => other.start === token.start) === position
    )
    spellTargets.forEach((token, tokenIndex) => {
      const cloze = clozeAround(sentence, token)
      const prefixLen = token.word.length <= 5 ? 2 : 3
      if (token.word.length - prefixLen < 1) return
      push({
        id: `${idBase}-spell-${tokenIndex}`,
        kind: 'spell',
        word: phrase,
        thaiMeaning: item.thaiMeaning,
        instruction: 'พิมพ์เติมตัวอักษรที่หายไปให้ครบ (มีตัวขึ้นต้นให้แล้ว)',
        before: cloze.before,
        after: cloze.after,
        choices: [],
        answer: token.word,
        prefix: token.word.slice(0, prefixLen),
        explain: `คำเต็มคือ “${token.word}” — วลี “${phrase}” แปลว่า ${item.thaiMeaning}`
      })
    })

    // ── "Pick the correct collocation" — full phrase vs head-swapped decoys ──
    if (content.length >= 2) {
      const correctPhrase = sentence.slice(span.start, span.end)
      const decoys = pickDistractors(NOUN_DISTRACTORS, head.word, 3, `${idBase}-pick`)
      const headRe = new RegExp(`${escapeRegExp(head.word)}\\b`, 'i')
      const options = seededShuffle(
        [
          { text: correctPhrase, correct: true },
          ...decoys.map((word) => ({
            text: correctPhrase.replace(headRe, capitalMatch(head.word, word)),
            correct: false
          }))
        ],
        `${idBase}-pickorder`
      )
      push({
        id: `${idBase}-pick`,
        kind: 'collocation',
        word: phrase,
        thaiMeaning: item.thaiMeaning,
        instruction: `เลือกวลีที่เป็น collocation ถูกต้อง (${item.thaiMeaning})`,
        choices: options,
        explain: `วลีที่ถูกคือ “${correctPhrase}” — ตัวเลือกอื่นเปลี่ยนคำหลักจึงไม่ใช่ collocation ที่ใช้จริง`
      })
    }

    // ── Spot-usage: only the natural sentence survives a collocate/form swap ──
    const headFamily = WORD_FAMILY[head.word.toLowerCase()]
    const headAlts = COLLOCATE_ALTERNATIVES[content[0].word.toLowerCase()]
    const headCloze = clozeAround(sentence, head)
    const firstCloze = clozeAround(sentence, content[0])
    if (headAlts && content[0].start !== head.start) {
      const wrong = seededShuffle(headAlts, `${idBase}-spot`).slice(0, 2)
      const spotChoices = seededShuffle(
        [
          { text: sentence, correct: true },
          ...wrong.map((word) => ({
            text: firstCloze.before + capitalMatch(firstCloze.answer, word) + firstCloze.after,
            correct: false
          }))
        ],
        `${idBase}-spotorder`
      )
      push({
        id: `${idBase}-spot`,
        kind: 'spot-usage',
        word: phrase,
        thaiMeaning: item.thaiMeaning,
        instruction: `เลือกประโยคที่ใช้ “${phrase}” ได้เป็นธรรมชาติที่สุด`,
        choices: spotChoices,
        explain: `“${phrase}” ต้องใช้กับ “${firstCloze.answer}” — ตัวเลือกอื่นสลับคำเข้าคู่ผิด จึงฟังไม่เป็นธรรมชาติ`
      })
    } else if (
      headFamily &&
      headFamily.length >= 3 &&
      headFamily.some((form) => form.toLowerCase() === head.word.toLowerCase())
    ) {
      const wrongForms = seededShuffle(
        headFamily.filter((form) => form.toLowerCase() !== headCloze.answer.toLowerCase()),
        `${idBase}-spotform`
      ).slice(0, 2)
      const spotChoices = seededShuffle(
        [
          { text: sentence, correct: true },
          ...wrongForms.map((form) => ({
            text: headCloze.before + capitalMatch(headCloze.answer, form) + headCloze.after,
            correct: false
          }))
        ],
        `${idBase}-spotformorder`
      )
      push({
        id: `${idBase}-spotform`,
        kind: 'spot-usage',
        word: phrase,
        thaiMeaning: item.thaiMeaning,
        instruction: `เลือกประโยคที่ใช้รูปคำของ “${head.word}” ได้ถูกต้อง`,
        choices: spotChoices,
        explain: `ในช่องนี้ต้องเป็น “${headCloze.answer}” — รูปอื่นในตระกูลคำผิดหน้าที่ทางไวยากรณ์`
      })
    }
  })

  // Deterministic overall order, then cap at the target count.
  return seededShuffle(questions, `${prompt.id}-order`).slice(0, targetCount)
}
