import fs from 'node:fs'

/**
 * Shared spelling gate for Writing Task 2 multiple-choice options.
 *
 * Task 2 tests grammar and word choice, not spelling. Every option a learner
 * sees must therefore be a real English word — never a morphological invention
 * like "oftenly", "modernly", "thated" or "unwill". This module decides which
 * candidate strings are real; `build-task2-real-words.mjs` freezes the verdict
 * into `src/writingTask2RealWords.ts` so the app needs no dictionary at runtime.
 */

const DICT_PATH = '/usr/share/dict/words'

/**
 * web2 is a lemma list: it omits most inflected and function words. These are
 * unquestionably real and show up constantly in Task 2 options.
 */
const DICT_SUPPLEMENT = [
  'has', 'had', 'does', 'did', 'been', 'being', 'am', 'are', 'is', 'was', 'were',
  'said', 'made', 'went', 'gone', 'paid', 'held', 'kept', 'left', 'lost', 'met',
  'sent', 'spent', 'taught', 'thought', 'brought', 'bought', 'built', 'chose',
  'chosen', 'drawn', 'driven', 'eaten', 'fallen', 'felt', 'found', 'given',
  'grown', 'known', 'led', 'meant', 'put', 'risen', 'seen', 'shown', 'sold',
  'taken', 'told', 'understood', 'written', 'worse', 'worst', 'better', 'best',
  'fewer', 'fewest', 'more', 'most', 'less', 'least', 'further', 'furthest',
  'children', 'women', 'men', 'people', 'criteria', 'phenomena', 'data',
  'others', 'cannot', 'themselves', 'ourselves', 'oneself', 'everyone', 'everybody',
  'someone', 'somebody', 'anyone', 'anybody', 'nobody', 'nothing', 'something',
  'anything', 'everything', 'whereas', 'moreover', 'furthermore', 'nevertheless',
  'nonetheless', 'therefore', 'thus', 'however', 'overall', 'online', 'lifestyle',
  'workplace', 'healthcare', 'wellbeing', 'worldwide', 'nationwide', 'nowadays',
  'prioritize', 'prioritise', 'privatize', 'privatise', 'digitize', 'digitise',
  'incentivize', 'incentivise', 'globalize', 'globalise', 'urbanize', 'urbanise'
]

export const loadDictionary = () => {
  const raw = fs.readFileSync(DICT_PATH, 'utf8')
  const dict = new Set(
    raw
      .split('\n')
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean)
  )
  for (const word of DICT_SUPPLEMENT) dict.add(word)
  return dict
}

/**
 * Function words never take inflections, so "thated" / "withs" / "somes" must
 * not sneak in through the attested-inflection rule below.
 */
const CLOSED_CLASS = new Set([
  'a', 'an', 'the', 'this', 'that', 'these', 'those', 'some', 'any', 'each', 'every', 'all',
  'both', 'few', 'many', 'much', 'more', 'most', 'other', 'others', 'another', 'such', 'no',
  'and', 'but', 'or', 'nor', 'so', 'yet', 'if', 'than', 'then', 'because', 'while', 'whereas',
  'although', 'though', 'unless', 'until', 'since', 'whether', 'as', 'with', 'without', 'within',
  'from', 'into', 'onto', 'upon', 'about', 'above', 'below', 'under', 'over', 'between', 'among',
  'through', 'during', 'before', 'after', 'against', 'toward', 'towards', 'for', 'of', 'to', 'in',
  'on', 'at', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did',
  'has', 'have', 'had', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
  'his', 'its', 'our', 'their', 'who', 'whom', 'whose', 'which', 'what', 'when', 'where', 'why',
  'how', 'there', 'here', 'not', 'very', 'too', 'also', 'often', 'always', 'never', 'still',
  'cannot', 'well', 'instead', 'rather', 'quite', 'even', 'only', 'just', 'perhaps', 'indeed'
])

/**
 * Suffixes that mark a word as an adjective, so "-ed"/"-ing" would be invented
 * ("practicaled", "historicaling"). The stricter list also rules out plurals of
 * words that are never nouns ("obvious" -> "obviouses").
 */
const NON_VERB_SUFFIX = /(?:al|ous|ful|ive|ic|ary|able|ible|ity|ness|ency|ancy|ism|ist|less|ish|ly)$/
const NEVER_NOUN_SUFFIX = /(?:ous|ful|ive|ic|able|ible|less|ish|ly)$/

/** Verbs whose ending looks adjectival — the suffix rules above must skip them. */
const VERB_EXCEPTIONS = new Set([
  'drive', 'give', 'live', 'arrive', 'derive', 'thrive', 'strive', 'survive', 'revive',
  'deprive', 'contrive', 'forgive', 'receive', 'believe', 'achieve', 'relieve', 'deceive',
  'perceive', 'conceive', 'retrieve', 'panic', 'travel', 'total', 'signal', 'appeal',
  'reveal', 'deal', 'heal', 'seal', 'fail', 'detail', 'install', 'recall', 'control',
  'fill', 'fuel', 'label', 'model', 'cancel', 'handle', 'enable', 'disable'
])

/**
 * Verbs ending in consonant + y. Only these may take "-ied"/"-ying": nouns like
 * "city" or "history" must not become "citied" / "historying".
 */
const Y_VERBS = new Set([
  'carry', 'apply', 'study', 'rely', 'vary', 'imply', 'supply', 'deny', 'satisfy',
  'identify', 'qualify', 'classify', 'simplify', 'justify', 'occupy', 'worry', 'hurry',
  'copy', 'try', 'specify', 'modify', 'notify', 'verify', 'clarify', 'magnify',
  'multiply', 'reply', 'comply', 'accompany', 'empty', 'tidy', 'dry', 'rally', 'bury'
])

/** Bases whose regular inflections we trust: not function words, not already inflected. */
const isInflectableBase = (base, dict) => {
  if (base.length < 3) return false
  if (CLOSED_CLASS.has(base)) return false
  if (!dict.has(base)) return false
  // "reasons" + "ed" -> "reasonsed": refuse to inflect something already plural/past.
  if (/(?:s|ed|ing)$/.test(base) && !/(?:ss|us|is)$/.test(base)) return false
  return true
}

/** Adjectives with suppletive comparatives — "gooder" / "baddest" are not words. */
const IRREGULAR_COMPARATIVE = new Set(['good', 'bad', 'far', 'little', 'many', 'much'])

/** Regular inflections of `base`, spelled correctly. */
const regularInflections = (base) => {
  const forms = new Set()
  if (!IRREGULAR_COMPARATIVE.has(base)) {
    const short = base.length <= 6
    if (short) {
      if (base.endsWith('e')) {
        forms.add(`${base}r`)
        forms.add(`${base}st`)
      } else if (/[^aeiou]y$/.test(base)) {
        forms.add(`${base.slice(0, -1)}ier`)
        forms.add(`${base.slice(0, -1)}iest`)
      } else {
        forms.add(`${base}er`)
        forms.add(`${base}est`)
      }
    }
  }
  forms.add(/(?:s|x|z|ch|sh)$/.test(base) ? `${base}es` : `${base}s`)
  if (/[^aeiou]y$/.test(base)) {
    forms.delete(`${base}s`)
    forms.add(`${base.slice(0, -1)}ies`)
    forms.add(`${base.slice(0, -1)}ied`)
  }
  if (base.endsWith('e')) {
    forms.add(`${base}d`)
    forms.add(`${base.slice(0, -1)}ing`)
  } else {
    forms.add(`${base}ed`)
    forms.add(`${base}ing`)
    // Doubled final consonant after a single stressed vowel: program -> programmed
    if (/[aeiou][bdgklmnprt]$/.test(base)) {
      const doubled = `${base}${base.slice(-1)}`
      forms.add(`${doubled}ed`)
      forms.add(`${doubled}ing`)
      forms.add(`${doubled}er`)
    }
  }
  return forms
}

/** Suffixes we are willing to strip when hunting for a candidate's base form. */
const STRIPPABLE = ['iest', 'ies', 'ied', 'ier', 'est', 'ing', 'ed', 'er', 'es', 'd', 's']

const possibleBases = (word) => {
  const bases = new Set()
  for (const suffix of STRIPPABLE) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 3) continue
    const stem = word.slice(0, word.length - suffix.length)
    bases.add(stem)
    bases.add(`${stem}e`)
    bases.add(`${stem}y`)
    if (/(.)\1$/.test(stem)) bases.add(stem.slice(0, -1))
  }
  return bases
}

/**
 * True when `word` is safe to show as an option.
 *
 * web2 is a lemma list, so most inflections ("reasons", "walked") are absent
 * from it; those are accepted when they are correctly spelled inflections of a
 * word it does know. Spelling rules alone cannot tell a noun from a verb, so the
 * build layers a stricter attestation check on top for generated foils.
 */
export const isRealWord = (word, dict) => {
  const lower = String(word || '').trim().toLowerCase()
  if (!lower) return false
  if (!/^[a-z]+$/.test(lower)) return false
  // web2 lists archaic forms like "citied" / "historied". They are useless as
  // foils and read as misspellings, so block them regardless of the dictionary.
  const yStem = /^(.*[^aeiou])(?:ied|ying)$/.exec(lower)
  if (yStem && !Y_VERBS.has(`${yStem[1]}y`)) return false
  if (dict.has(lower)) return true
  // web2 lists -ize spellings only; the -ise variant is equally correct.
  if (/is(e|es|ed|ing|ation)$/.test(lower)) {
    if (isRealWord(lower.replace(/is(e|es|ed|ing|ation)$/, 'iz$1'), dict)) return true
  }
  for (const base of possibleBases(lower)) {
    if (!isInflectableBase(base, dict)) continue
    if (!regularInflections(base).has(lower)) continue
    if (!VERB_EXCEPTIONS.has(base)) {
      if (NON_VERB_SUFFIX.test(base) && /(?:ed|ing)$/.test(lower)) continue
      if (NEVER_NOUN_SUFFIX.test(base) && /e?s$/.test(lower)) continue
    }
    return true
  }
  return false
}

/** Multi-word and hyphenated options are authored phrases, not spelling foils. */
export const isSingleWord = (value) => /^[a-z]+$/i.test(String(value || '').trim())
