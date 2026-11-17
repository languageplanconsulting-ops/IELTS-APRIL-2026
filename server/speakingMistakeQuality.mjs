// Speaking grammar-mistake quality: keep the grader from blaming the learner for the
// speech-to-text, and give every mistake one fixed type so habits can be counted.
//
// Found in the Nov 2026 audit of 84 reports:
// - Chrome's speech recognition ends each chunk with a full stop and the app glued chunks with no
//   space, so transcripts read "the music.Uh, has.Change a lot" (17% of quoted mistakes).
// - 48 "spelling" / "punctuation" mistakes were really the machine mishearing the learner
//   ("a koala shirt" for "a polo shirt", "the regular closes" for "clothes").
// - 656 mistakes carried 181 different free-text labels, so nothing could be counted.
//
// Pure functions only, so scripts/validate-speaking-mistakes.ts can test them.

// ── 1. transcript clean-up ──────────────────────────────────────────────────────────────

const SENTENCE_START_WORDS = new Set(['i', "i'm", "i've", "i'd", "i'll"])

/**
 * Remove the full stops the browser glues between words ("has.Change" → "has change").
 * Only touches lower-case letter + "." + capital letter, so "U.S.", "e.g.", "3.5" and
 * "gmail.com" are left alone. Also puts a missing space after "," "?" "!".
 */
export const cleanSpeechTranscript = (value) =>
  String(value || '')
    .replace(/\bI\.(?=[A-Z])/g, 'I ')
    .replace(/([a-z])\.([A-Z][a-z']*)/g, (_match, before, word) =>
      `${before} ${SENTENCE_START_WORDS.has(word.toLowerCase()) ? word : word.charAt(0).toLowerCase() + word.slice(1)}`
    )
    .replace(/([a-z])([,?!])([A-Za-z])/g, '$1$2 $3')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

// ── 2. fixed mistake types ──────────────────────────────────────────────────────────────

/** The only types a speaking grammar mistake may have. Labels are what the learner sees. */
export const SPEAKING_MISTAKE_TYPES = {
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

export const SPEAKING_MISTAKE_TYPE_KEYS = Object.keys(SPEAKING_MISTAKE_TYPES)

// Checked in order; the first hit wins, so a mixed label like "article และ plural" becomes
// "article". Subject-verb sits before plural because "agreement" would otherwise look like number.
const TYPE_RULES = [
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

// Things a speaker cannot get wrong: the machine wrote these, not the learner.
const TRANSCRIPTION_ONLY = /spelling|punctuation|capitali[sz]|typo|สะกด|วรรคตอน|ตัวพิมพ์|เว้นวรรค/i

/**
 * Map whatever label the model gave (old free text included) to one fixed type key.
 * Returns 'transcription' for spelling / punctuation / capital-letter labels, which the
 * caller must drop.
 */
export const normalizeMistakeType = (raw) => {
  const label = String(raw || '').trim()
  if (!label) return 'other'
  const key = label.toLowerCase()
  if (SPEAKING_MISTAKE_TYPES[key] && key !== 'other') return key
  const hit = TYPE_RULES.find(([, pattern]) => pattern.test(label))
  if (hit) return hit[0]
  if (TRANSCRIPTION_ONLY.test(label)) return 'transcription'
  return 'other'
}

const tokens = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z' ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

/** Words removed from the original and words added by the correction (order ignored). */
export const diffWords = (originalText, correctedText) => {
  const before = tokens(originalText)
  const after = tokens(correctedText)
  const leftover = after.slice()
  const removed = []
  for (const word of before) {
    const index = leftover.indexOf(word)
    if (index >= 0) leftover.splice(index, 1)
    else removed.push(word)
  }
  return { removed, added: leftover }
}

const ARTICLES = new Set(['a', 'an', 'the'])
const OFTEN_DROPPED = new Set(['it', 'them', 'is', 'am', 'are', 'was', 'were', 'be', 'i', 'he', 'she', 'they', 'we', 'there', "it's", "i'm"])

/**
 * The model sometimes files a change under the wrong type ("my mom gave." → "my mom gave it."
 * labelled "article"). When the change itself is unambiguous, trust the change.
 */
export const refineMistakeType = (type, originalText, correctedText) => {
  const { removed, added } = diffWords(originalText, correctedText)
  const changed = [...removed, ...added]
  if (changed.length && changed.every((word) => ARTICLES.has(word))) return 'article'
  if (!removed.length && added.length && added.every((word) => OFTEN_DROPPED.has(word))) return 'missing-word'
  return type
}

// ── 3. speech-to-text mishearings ───────────────────────────────────────────────────────

const FUNCTION_WORDS = new Set(
  `a an the in on at to for of with from by about into onto over under through around after before between among
  during since until till than then and or but so if because as while when where who whom whose which that this these
  those there their they're its it's it i me my mine we us our you your you're he him his she her they them
  is am are was were be been being have has had do does did can could will would shall should may might must
  not no yes some any much many few little more most less least very too two also just`.split(/\s+/)
)

// Irregular verb forms: "see → saw" is a tense mistake, not a mishearing, even though the
// spellings are close.
const IRREGULAR_FORMS = new Set(
  `go goes went gone see saw seen come came get got gotten give gave given take took taken make made know knew known
  think thought tell told become became begin began begun feel felt find found leave left meet met pay paid run ran
  say said sit sat sell sold send sent spend spent stand stood teach taught understand understood wear wore worn
  win won write wrote written buy bought bring brought build built catch caught choose chose chosen drink drank drunk
  drive drove driven eat ate eaten fall fell fallen fly flew flown forget forgot forgotten grow grew grown hear heard
  hold held keep kept lose lost mean meant ride rode rise rose risen sleep slept speak spoke spoken swim swam
  throw threw thrown wake woke lie lay laid`.split(/\s+/)
)

// Words that sound the same: in speech these can only ever be the transcript's spelling.
const HOMOPHONE_GROUPS = [
  ['their', 'there', "they're"],
  ['its', "it's"],
  ['your', "you're"],
  ['to', 'too', 'two'],
  ['whose', "who's"],
  ['hear', 'here'],
  ['know', 'no'],
  ['right', 'write'],
  ['buy', 'by', 'bye']
]

const stem = (word) => word.replace(/(ies|ied|ing|ed|es|s|ly|er|est|e|y)$/, '')

const commonPrefixLength = (left, right) => {
  let index = 0
  while (index < left.length && index < right.length && left[index] === right[index]) index += 1
  return index
}

const editDistance = (left, right) => {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= right.length; j += 1) {
      const saved = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1))
      previous = saved
    }
  }
  return row[right.length]
}

/** Same word in another form (change/changed, culture/cultural, economy/economic). */
const isSameWordFamily = (left, right) =>
  left.startsWith(right) ||
  right.startsWith(left) ||
  stem(left) === stem(right) ||
  commonPrefixLength(left, right) >= 5

/**
 * True when the "mistake" is really one word swapped for a similar-sounding one, which in a
 * speaking test is the speech-to-text mishearing the learner, not the learner's grammar.
 */
export const isLikelyMishearing = (originalText, correctedText) => {
  const { removed, added } = diffWords(originalText, correctedText)
  if (removed.length !== 1 || added.length !== 1) return false
  const [heard, meant] = [removed[0], added[0]]
  if (HOMOPHONE_GROUPS.some((group) => group.includes(heard) && group.includes(meant))) return true
  if (FUNCTION_WORDS.has(heard) || FUNCTION_WORDS.has(meant)) return false
  if (IRREGULAR_FORMS.has(heard) || IRREGULAR_FORMS.has(meant)) return false
  if (isSameWordFamily(heard, meant)) return false
  const distance = editDistance(heard, meant)
  return distance <= 2 || (distance <= 3 && Math.min(heard.length, meant.length) >= 6)
}

/**
 * Decide what to keep from one model row. Returns null to drop it, or the fixed type key.
 */
export const classifySpeakingMistake = ({ errorType, errorTypeThai, originalText, correctedText }) => {
  const type = normalizeMistakeType(errorType || errorTypeThai)
  if (type === 'transcription') return null
  if (isLikelyMishearing(originalText, correctedText)) return null
  return refineMistakeType(type, originalText, correctedText)
}
