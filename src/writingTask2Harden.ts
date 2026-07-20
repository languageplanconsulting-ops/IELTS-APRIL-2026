import type { WritingTask2VocabItem } from './writingTask2Data'
import type { Wgb2Blank, Wgb2Exercise, Wgb2Focus, Wgb2Segment } from './writingTask2Builder'
import { WGB2_NO_ARTICLE } from './writingTask2Builder'
import {
  buildDetailedThaiExplain,
  buildLetterHintMask,
  isLetterHintBlank,
  LETTER_HINT_FOCUS,
  resolveThaiMeaning
} from './writingLetterHint'
import { getWgb2OptionFillers } from './writingTask2Fillers'
import { isRealTask2Word } from './writingTask2RealWords'

/** Deterministic shuffle so option order is stable across re-renders. */
const shuffle = <T,>(items: T[], seed: string): T[] => {
  const next = [...items]
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = next.length - 1; i > 0; i -= 1) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    const j = Math.abs(h) % (i + 1)
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Morphological near-misses for IELTS Academic vocab / form tests. */
export const buildMorphDistractors = (answer: string): string[] => {
  const raw = answer.trim()
  if (!raw) return []
  const lower = raw.toLowerCase()
  const preserveCase = (candidate: string) => {
    if (/^[A-Z]/.test(raw) && !/^[A-Z]{2,}/.test(raw)) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1)
    }
    return candidate
  }

  const ranked: string[] = []
  const push = (value: string) => {
    const v = value.trim()
    if (!v || v.length < 3) return
    if (v.toLowerCase() === lower) return
    if (ranked.some((x) => x.toLowerCase() === v.toLowerCase())) return
    ranked.push(preserveCase(v))
  }

  const suffixRules: { re: RegExp; stem: (m: RegExpExecArray) => string; forms: (stem: string) => string[] }[] = [
    {
      re: /(.{3,})ing$/i,
      stem: (m) => m[1],
      forms: (s) => {
        const base = s.endsWith('e') ? s : `${s}e`
        return [s, base, `${s}ed`, `${s}s`, `${base}d`, `${s}ment`, `${s}ation`]
      }
    },
    {
      re: /(.{3,})ed$/i,
      stem: (m) => m[1],
      forms: (s) => {
        const base = s.endsWith('e') ? s : `${s}e`
        return [s, base, `${s}ing`, `${base.slice(0, -1)}ing`, `${s}s`, `${s}ly`]
      }
    },
    {
      re: /(.{3,})ably$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}able`, `${s}ability`, `${s}ably`, `un${s}able`, `${s}ed`]
    },
    {
      re: /(.{3,})ibly$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ible`, `${s}ibility`, `${s}ibly`, `un${s}ible`]
    },
    {
      re: /(.{3,})ly$/i,
      stem: (m) => m[1],
      forms: (s) => [s, `${s}ness`, `${s}ity`, `un${s}`]
    },
    {
      re: /(.{3,})able$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ible`, s, `${s}ability`, `${s}ably`, `${s}ant`, `${s}ance`, `${s}ence`]
    },
    {
      re: /(.{3,})ible$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}able`, `${s}ibility`, `${s}ibly`, `${s}ent`, `${s}ence`]
    },
    {
      re: /(.{3,})tion$/i,
      stem: (m) => m[1],
      forms: (s) => {
        const verb = s.endsWith('a') ? `${s}te` : s.endsWith('i') ? `${s}e` : s
        return [verb, `${verb}d`, `${verb}ing`, `${s}tive`, `${s}sion`]
      }
    },
    {
      re: /(.{3,})ment$/i,
      stem: (m) => m[1],
      forms: (s) => [s, `${s}ed`, `${s}ing`, `${s}al`]
    },
    {
      re: /(.{3,})ness$/i,
      stem: (m) => m[1],
      forms: (s) => [s, `${s}ly`, `un${s}`]
    },
    {
      re: /(.{3,})ence$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ent`, `${s}ency`, `${s}ance`, `${s}ant`]
    },
    {
      re: /(.{3,})ance$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ant`, `${s}ancy`, `${s}ence`, `${s}ent`]
    },
    {
      re: /(.{3,})ity$/i,
      stem: (m) => m[1],
      forms: (s) => {
        const adj = s.endsWith('bil') ? `${s.slice(0, -3)}ble` : s.endsWith('i') ? `${s}e` : s
        return [adj, `${adj}ly`]
      }
    },
    {
      re: /(.{3,})ous$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}e`, `${s}ously`, `${s}ity`]
    },
    {
      re: /(.{3,})ive$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ion`, `${s}e`, `${s}ely`]
    },
    {
      re: /(.{3,})al$/i,
      stem: (m) => m[1],
      forms: (s) => [`${s}ally`, `${s}e`, `${s}ity`]
    },
    {
      re: /(.{2,})ies$/i,
      stem: (m) => `${m[1]}y`,
      forms: (s) => [s, `${s}s`]
    },
    {
      re: /(.{3,})es$/i,
      stem: (m) => m[1],
      forms: (s) => [s, `${s}e`, `${s}ing`, `${s}ed`]
    },
    {
      re: /(.{3,})s$/i,
      stem: (m) => m[1],
      forms: (s) => [s, `${s}ing`, `${s}ed`, `${s}es`]
    }
  ]

  const applyForms = (word: string) => {
    for (const rule of suffixRules) {
      const match = rule.re.exec(word)
      if (!match) continue
      const stem = rule.stem(match)
      for (const form of rule.forms(stem)) push(form)
      break // one suffix match is enough
    }
  }

  // Always strip polarity prefixes before building foils (unreliable → reliable / reliant)
  let core = lower
  for (const prefix of ['un', 'in', 'im', 'ir', 'il', 'dis', 'non', 'over', 'under', 're']) {
    if (lower.startsWith(prefix) && lower.length > prefix.length + 3) {
      core = lower.slice(prefix.length)
      push(core)
      break
    }
  }
  if (core === lower) {
    for (const prefix of ['un', 'in', 'dis', 'non']) push(`${prefix}${lower}`)
  } else {
    for (const prefix of ['dis', 'non', 're']) push(`${prefix}${core}`)
  }

  // Build forms from the de-prefixed core first (avoids junk like "unreliible")
  applyForms(core)
  if (core === lower) applyForms(lower)

  // High-value foils for -able/-ible (reliant / reliance / reliability)
  if (/(able|ible)$/i.test(core)) {
    const stem = core.replace(/(able|ible)$/i, '')
    push(`${stem}ant`)
    push(`${stem}ent`)
    push(`${stem}ance`)
    push(`${stem}ence`)
    push(`${stem}ability`)
    push(`${stem}ibility`)
    push(`${stem}ably`)
    push(`${stem}ibly`)
  }

  if (ranked.length < 3) {
    push(`${lower}s`)
    push(`${lower}ed`)
    push(`${lower}ing`)
    push(`${lower}ly`)
  }

  ranked.sort((a, b) => Math.abs(a.length - raw.length) - Math.abs(b.length - raw.length))
  return ranked.filter((item) => {
    const w = item.toLowerCase()
    if (/ii|iible|s{2}ing|[aeiou]{4}/i.test(w)) return false
    // Drop broken stems like "worsene" / "reporte" / "pushs"
    if (/[^aeiou]e$/i.test(w) && !/(?:able|ible|ive|ose|ate|ite|ute|ise|ize)$/i.test(w)) return false
    if (/[^aeiou]s$/i.test(w) && !/(?:ss|ous|ics|ness|less|ysis)$/i.test(w) && !/[sxz]$/i.test(w.slice(0, -1))) {
      // allow regular plurals (car+s) but reject "pushs"
      if (!/[aeiou]s$/i.test(w) && !/ys$/i.test(w)) return !/[^aeiouy]s$/i.test(w)
    }
    return true
  })
}

const pickFourOptions = (answer: string, preferred?: string[], focus?: Wgb2Focus): string[] => {
  const pool = [...(preferred || []), ...buildMorphDistractors(answer)].filter(
    (item) => item.toLowerCase() !== answer.toLowerCase() && isRealTask2Word(item)
  )
  const unique: string[] = []
  for (const item of pool) {
    if (unique.some((x) => x.toLowerCase() === item.toLowerCase())) continue
    unique.push(item)
    if (unique.length >= 3) break
  }
  // Fallback fillers so every MCQ has exactly 4 choices
  for (const fill of getWgb2OptionFillers(focus)) {
    if (unique.length >= 3) break
    if (fill.toLowerCase() === answer.toLowerCase()) continue
    if (unique.some((x) => x.toLowerCase() === fill.toLowerCase())) continue
    unique.push(fill)
  }
  return shuffle([answer, ...unique.slice(0, 3)], answer)
}

const convertIdentityTypeToLetterHint = (blank: Extract<Wgb2Blank, { kind: 'type' }>): Wgb2Blank => {
  const answer = blank.answers[0]
  const mask = buildLetterHintMask(answer)
  const thaiMeaning = resolveThaiMeaning(answer, blank.thaiMeaning, blank.explain)
  return {
    kind: 'type',
    id: blank.id,
    base: mask.compactMask,
    answers: blank.answers,
    focus: LETTER_HINT_FOCUS,
    thaiMeaning: thaiMeaning || undefined,
    explain: buildDetailedThaiExplain({
      answer,
      focus: LETTER_HINT_FOCUS,
      thaiMeaning: thaiMeaning || undefined,
      authoredExplain: blank.explain
    })
  }
}

const convertSelectToLetterHint = (blank: Extract<Wgb2Blank, { kind: 'select' }>): Wgb2Blank | null => {
  const answer = blank.answer
  if (blank.focus === 'article' || blank.options.includes(WGB2_NO_ARTICLE)) return null
  if (answer.length < 6 || /\s/.test(answer)) return null
  if (!/^[A-Za-z][A-Za-z'-]*$/.test(answer)) return null
  if (!['word-choice', 'adjective', 'adverb', 'participle', 'noun'].includes(blank.focus)) return null
  const mask = buildLetterHintMask(answer)
  const thaiMeaning = resolveThaiMeaning(answer, undefined, blank.explain)
  return {
    kind: 'type',
    id: blank.id,
    base: mask.compactMask,
    answers: [answer],
    focus: LETTER_HINT_FOCUS,
    thaiMeaning: thaiMeaning || undefined,
    explain: buildDetailedThaiExplain({
      answer,
      focus: LETTER_HINT_FOCUS,
      thaiMeaning: thaiMeaning || undefined,
      authoredExplain: blank.explain
    })
  }
}

const convertIdentityTypeToSelect = (blank: Extract<Wgb2Blank, { kind: 'type' }>): Wgb2Blank => {
  // Prefer letter-hint fill-in over MCQ for vocabulary-length words
  if (blank.answers[0] && blank.answers[0].length >= 5 && /^[A-Za-z][A-Za-z'-]*$/.test(blank.answers[0])) {
    return convertIdentityTypeToLetterHint(blank)
  }
  const answer = blank.answers[0]
  const preferred =
    blank.focus === 'verb-tense'
      ? [
          `${answer}s`,
          `${answer}ed`,
          answer.endsWith('e') ? `${answer.slice(0, -1)}ing` : `${answer}ing`,
          `${answer}ing`
        ]
      : blank.focus === 'plural'
        ? [`${answer}s`, `${answer}es`, answer.replace(/y$/i, 'ies'), answer.replace(/s$/i, '')]
        : undefined

  const focus: Wgb2Focus =
    blank.focus === 'verb-tense' || blank.focus === 'plural' ? blank.focus : 'word-choice'
  return {
    kind: 'select',
    id: blank.id,
    options: pickFourOptions(answer, preferred, focus),
    answer,
    focus,
    explain:
      blank.explain ||
      buildDetailedThaiExplain({ answer, focus: blank.focus, authoredExplain: blank.explain })
  }
}

const expandSelectToFour = (blank: Extract<Wgb2Blank, { kind: 'select' }>): Wgb2Blank => {
  // Article blanks stay ternary (a / the / ∅)
  if (blank.focus === 'article' || blank.options.includes(WGB2_NO_ARTICLE)) return blank
  // Punctuation-like short options — leave alone
  if (blank.options.every((opt) => opt.length <= 2)) return blank

  // Task 2 tests grammar and word choice, not spelling: drop any authored foil
  // that is not a real English word, then top up with real ones.
  const options = blank.options.filter(
    (opt) => opt.toLowerCase() === blank.answer.toLowerCase() || isRealTask2Word(opt)
  )
  if (options.length >= 4) return { ...blank, options }

  const has = (word: string) => options.some((opt) => opt.toLowerCase() === word.toLowerCase())
  const topUps = [
    ...buildMorphDistractors(blank.answer).filter(isRealTask2Word),
    ...getWgb2OptionFillers(blank.focus)
  ]
  for (const item of topUps) {
    if (options.length >= 4) break
    if (item.toLowerCase() === blank.answer.toLowerCase() || has(item)) continue
    options.push(item)
  }
  return { ...blank, options: shuffle(options.slice(0, 4), blank.id || blank.answer) }
}

const mapBlank = (blank: Wgb2Blank, preferLetterHint: boolean): Wgb2Blank => {
  if (blank.kind === 'type') {
    const answer = blank.answers[0] || ''
    if (answer && answer.toLowerCase() === blank.base.toLowerCase()) {
      return convertIdentityTypeToSelect(blank)
    }
    return blank
  }
  if (blank.kind === 'select') {
    if (preferLetterHint) {
      const asLetter = convertSelectToLetterHint(blank)
      if (asLetter) return asLetter
    }
    return expandSelectToFour(blank)
  }
  return blank
}

const vocabMcqTargets = (
  vocab: WritingTask2VocabItem[],
  essayText: string
): { word: string; thaiMeaning: string }[] => {
  const targets: { word: string; thaiMeaning: string }[] = []
  const seen = new Set<string>()
  const add = (word: string, thaiMeaning: string) => {
    const candidate = word.trim()
    if (!candidate || candidate.length < 5) return
    if (/^(this|that|these|those|with|from|into|about|their|there|which|while|would|could|should|because|before|after|during|between)$/i.test(candidate)) {
      return
    }
    const key = candidate.toLowerCase()
    if (seen.has(key)) return
    if (!new RegExp(`\\b${escapeRegExp(candidate)}\\b`, 'i').test(essayText)) return
    seen.add(key)
    targets.push({ word: candidate, thaiMeaning })
  }

  for (const item of vocab) {
    const parts = item.word.trim().split(/\s+/).filter(Boolean)
    // Prefer the head content word (usually last in EN noun phrases / adj)
    add(parts.length === 1 ? parts[0] : parts[parts.length - 1], item.thaiMeaning)
    // Also test a strong first adjective in the phrase when present
    if (parts.length >= 2 && /(?:able|ible|ous|ive|al|ic|ary|ing)$/i.test(parts[0])) {
      add(parts[0], item.thaiMeaning)
    }
  }

  // Pull academic adjectives / adverbs sitting in plain essay text (e.g. unreliable, worsening, considerably)
  const academicToken =
    /\b((?:un|in|im|ir|il|dis|non)[a-z]{4,}(?:able|ible)|[a-z]{5,}(?:able|ible|ously|ively|ated|ised|ized)|[a-z]{6,}ly|worsening|limited|extensive|affordable|efficient|substantial(?:ly)?|considerable(?:ly)?)\b/gi
  let match: RegExpExecArray | null
  while ((match = academicToken.exec(essayText)) !== null) {
    add(match[1], 'เลือกคำศัพท์ที่เหมาะกับบริบทประโยค')
  }

  // Prefer longer / more "academic" looking words first
  return targets.sort((a, b) => b.word.length - a.word.length)
}

const injectVocabIntoText = (
  text: string,
  targets: { word: string; thaiMeaning: string }[],
  used: Set<string>,
  idPrefix: string,
  maxInject: number,
  mode: 'mcq' | 'letter-hint'
): Wgb2Segment[] => {
  if (!text || maxInject <= 0) return [{ kind: 'text', text }]

  type Hit = { start: number; end: number; word: string; thaiMeaning: string }
  const hits: Hit[] = []
  for (const target of targets) {
    if (used.has(target.word.toLowerCase())) continue
    if (hits.length >= maxInject) break
    const pattern = new RegExp(`\\b${escapeRegExp(target.word)}\\b`, 'i')
    const match = pattern.exec(text)
    if (!match || match.index == null) continue
    const start = match.index
    const end = start + match[0].length
    if (hits.some((h) => !(end <= h.start || start >= h.end))) continue
    hits.push({ start, end, word: match[0], thaiMeaning: target.thaiMeaning })
    used.add(target.word.toLowerCase())
  }

  if (!hits.length) return [{ kind: 'text', text }]
  hits.sort((a, b) => a.start - b.start)

  const segments: Wgb2Segment[] = []
  let cursor = 0
  hits.forEach((hit, index) => {
    if (hit.start > cursor) {
      segments.push({ kind: 'text', text: text.slice(cursor, hit.start) })
    }
    const answer = hit.word
    if (mode === 'letter-hint' && /^[A-Za-z][A-Za-z'-]*$/.test(answer) && answer.length >= 5) {
      const mask = buildLetterHintMask(answer)
      segments.push({
        kind: 'blank',
        blank: {
          kind: 'type',
          id: `${idPrefix}-vocab-${index}-${answer.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`,
          base: mask.compactMask,
          answers: [answer],
          focus: LETTER_HINT_FOCUS as Wgb2Focus,
          thaiMeaning: hit.thaiMeaning,
          explain: buildDetailedThaiExplain({
            answer,
            focus: LETTER_HINT_FOCUS,
            thaiMeaning: hit.thaiMeaning
          })
        }
      })
    } else {
      segments.push({
        kind: 'blank',
        blank: {
          kind: 'select',
          id: `${idPrefix}-vocab-${index}-${answer.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`,
          options: pickFourOptions(answer),
          answer,
          focus: 'word-choice' as Wgb2Focus,
          explain: buildDetailedThaiExplain({
            answer,
            focus: 'word-choice',
            thaiMeaning: hit.thaiMeaning
          })
        }
      })
    }
    cursor = hit.end
  })
  if (cursor < text.length) segments.push({ kind: 'text', text: text.slice(cursor) })
  return segments
}

/**
 * Hardens Task 2 drills:
 * 1) Identity type blanks → letter-hint / MCQ (no copy-paste)
 * 2) Some selects → letter-hint fill-ins (esp. GT vocab)
 * 3) Inject vocabulary letter-hint blanks (mot_ _ _ _ _) from prompt vocab
 */
export const hardenAcademicTask2Exercise = (
  exercise: Wgb2Exercise,
  vocab: WritingTask2VocabItem[],
  options?: { maxVocabMcq?: number; vocabFillMode?: 'mcq' | 'letter-hint'; preferLetterHint?: boolean }
): Wgb2Exercise => {
  const maxVocabMcq = options?.maxVocabMcq ?? 20
  const vocabFillMode = options?.vocabFillMode ?? 'letter-hint'
  const preferLetterHint = options?.preferLetterHint ?? vocabFillMode === 'letter-hint'
  const essayText = exercise.steps
    .flatMap((step) =>
      step.segments.map((segment) =>
        segment.kind === 'text'
          ? segment.text
          : segment.blank.kind === 'select'
            ? segment.blank.answer
            : segment.blank.kind === 'type'
              ? segment.blank.answers[0]
              : segment.blank.kind === 'drag'
                ? segment.blank.answer
                : ''
      )
    )
    .join(' ')
  const targets = vocabMcqTargets(vocab, essayText)
  const usedWords = new Set<string>()
  let remaining = maxVocabMcq

  for (const step of exercise.steps) {
    for (const segment of step.segments) {
      if (segment.kind !== 'blank') continue
      const blank = segment.blank
      if (blank.kind === 'select') usedWords.add(blank.answer.toLowerCase())
      if (blank.kind === 'type') usedWords.add(blank.answers[0]?.toLowerCase() || '')
      if (blank.kind === 'drag') usedWords.add(blank.answer.toLowerCase())
    }
  }

  const steps = exercise.steps.map((step) => {
    const nextSegments: Wgb2Segment[] = []
    for (const segment of step.segments) {
      if (segment.kind === 'blank') {
        nextSegments.push({ kind: 'blank', blank: mapBlank(segment.blank, preferLetterHint) })
        continue
      }
      if (remaining <= 0) {
        nextSegments.push(segment)
        continue
      }
      const before = remaining
      const injected = injectVocabIntoText(
        segment.text,
        targets,
        usedWords,
        `${exercise.id}-${step.id}`,
        remaining,
        vocabFillMode
      )
      const added = injected.filter((item) => item.kind === 'blank').length
      remaining = before - added
      nextSegments.push(...injected)
    }
    return { ...step, segments: nextSegments }
  })

  return { ...exercise, steps }
}

/** Placeholder for type blanks — never reveal the final answer. */
export const typeBlankPlaceholder = (blank: Extract<Wgb2Blank, { kind: 'type' }>): string => {
  if (isLetterHintBlank(blank)) {
    return buildLetterHintMask(blank.answers[0] || blank.base).spacedMask
  }
  const answer = blank.answers[0] || ''
  const base = blank.base || ''
  if (!base) return '…'
  if (answer && base.toLowerCase() !== answer.toLowerCase()) {
    return `(${base})`
  }
  switch (blank.focus) {
    case 'plural':
      return '(n. ?)'
    case 'participle':
      return '(V-ing/V3)'
    case 'verb-tense':
      return '(verb)'
    case 'noun':
      return '(noun)'
    case 'adjective':
      return '(adj)'
    case 'adverb':
      return '(adv)'
    default:
      return '…'
  }
}
