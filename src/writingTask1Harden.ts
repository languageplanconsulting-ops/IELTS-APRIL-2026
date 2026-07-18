/**
 * Harden Academic Writing Task 1 guided builders:
 * - convert giveaway type blanks → letter-hint fill-ins
 * - convert some vocab-like selects → letter-hint
 * - inject more letter-hint vocab blanks into plain text
 * - attach detailed Thai explanations
 */

import type { WgbBlank, WgbExercise, WgbSegment } from './writingGuidedBuilder'
import {
  buildDetailedThaiExplain,
  buildLetterHintMask,
  LETTER_HINT_FOCUS,
  resolveThaiMeaning
} from './writingLetterHint'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const STOP = new Set([
  'about', 'after', 'before', 'between', 'during', 'which', 'while', 'where', 'there', 'their',
  'these', 'those', 'other', 'others', 'being', 'having', 'would', 'could', 'should', 'however',
  'whereas', 'starting', 'followed', 'reaching', 'peaking', 'respectively', 'number', 'numbers',
  'percent', 'percentage', 'figure', 'figures', 'years', 'year', 'from', 'with', 'that', 'this'
])

const contentWordTargets = (essayText: string): string[] => {
  const words = essayText.match(/\b[A-Za-z][A-Za-z'-]{4,}\b/g) || []
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of words) {
    const w = raw.toLowerCase()
    if (STOP.has(w)) continue
    if (seen.has(w)) continue
    // Prefer academic-ish / chart vocabulary
    if (
      !/(?:tion|sion|ment|ness|ance|ence|able|ible|ally|edly|ingly|crease|crease|cline|peak|fluct|proportion|category|overall)$/i.test(
        w
      ) &&
      w.length < 7
    ) {
      continue
    }
    seen.add(w)
    out.push(raw)
  }
  return out.sort((a, b) => b.length - a.length)
}

const toLetterHintType = (
  id: string,
  answer: string,
  explain?: string,
  thaiMeaning?: string
): WgbBlank => {
  const mask = buildLetterHintMask(answer)
  const gloss = resolveThaiMeaning(answer, thaiMeaning, explain)
  return {
    kind: 'type',
    id,
    base: mask.compactMask,
    answers: [answer],
    focus: LETTER_HINT_FOCUS,
    thaiMeaning: gloss || undefined,
    explain: buildDetailedThaiExplain({
      answer,
      focus: LETTER_HINT_FOCUS,
      thaiMeaning: gloss || undefined,
      authoredExplain: explain
    })
  }
}

const mapBlank = (blank: WgbBlank): WgbBlank => {
  if (blank.kind === 'type') {
    const answer = blank.answers[0] || ''
    if (answer && answer.toLowerCase() === blank.base.toLowerCase() && answer.length >= 5) {
      return toLetterHintType(blank.id, answer, blank.explain)
    }
    // Keep conjugation drills, but enrich explain
    return {
      ...blank,
      explain: buildDetailedThaiExplain({
        answer,
        focus: blank.focus,
        authoredExplain: blank.explain
      })
    }
  }

  // Convert some word-choice / trend / paraphrase selects into letter-hint
  if (
    blank.kind === 'select' &&
    ['word-choice', 'trend-phrase', 'paraphrase', 'degree-adverb'].includes(blank.focus) &&
    blank.answer.length >= 6 &&
    /^[A-Za-z][A-Za-z'-]*$/.test(blank.answer) &&
    !/\s/.test(blank.answer)
  ) {
    return toLetterHintType(blank.id, blank.answer, blank.explain)
  }

  return {
    ...blank,
    explain: buildDetailedThaiExplain({
      answer: blank.answer,
      focus: blank.focus,
      authoredExplain: blank.explain
    })
  }
}

const injectIntoText = (
  text: string,
  targets: string[],
  used: Set<string>,
  idPrefix: string,
  maxInject: number
): WgbSegment[] => {
  if (!text || maxInject <= 0) return [{ kind: 'text', text }]
  type Hit = { start: number; end: number; word: string }
  const hits: Hit[] = []
  for (const target of targets) {
    if (used.has(target.toLowerCase())) continue
    if (hits.length >= maxInject) break
    const match = new RegExp(`\\b${escapeRegExp(target)}\\b`).exec(text)
    if (!match || match.index == null) continue
    const start = match.index
    const end = start + match[0].length
    if (hits.some((h) => !(end <= h.start || start >= h.end))) continue
    hits.push({ start, end, word: match[0] })
    used.add(target.toLowerCase())
  }
  if (!hits.length) return [{ kind: 'text', text }]
  hits.sort((a, b) => a.start - b.start)
  const segments: WgbSegment[] = []
  let cursor = 0
  hits.forEach((hit, index) => {
    if (hit.start > cursor) segments.push({ kind: 'text', text: text.slice(cursor, hit.start) })
    segments.push({
      kind: 'blank',
      blank: toLetterHintType(`${idPrefix}-lh-${index}-${hit.word.toLowerCase()}`, hit.word)
    })
    cursor = hit.end
  })
  if (cursor < text.length) segments.push({ kind: 'text', text: text.slice(cursor) })
  return segments
}

export const hardenTask1Exercise = (
  exercise: WgbExercise,
  options?: { maxLetterHints?: number }
): WgbExercise => {
  const maxLetterHints = options?.maxLetterHints ?? 14
  const essayText = exercise.steps
    .flatMap((step) =>
      step.segments.map((segment) =>
        segment.kind === 'text'
          ? segment.text
          : segment.blank.kind === 'select'
            ? segment.blank.answer
            : segment.blank.answers[0]
      )
    )
    .join(' ')
  const targets = contentWordTargets(essayText)
  const used = new Set<string>()
  let remaining = maxLetterHints

  for (const step of exercise.steps) {
    for (const segment of step.segments) {
      if (segment.kind !== 'blank') continue
      const blank = segment.blank
      used.add((blank.kind === 'select' ? blank.answer : blank.answers[0]).toLowerCase())
    }
  }

  const steps = exercise.steps.map((step) => {
    const next: WgbSegment[] = []
    for (const segment of step.segments) {
      if (segment.kind === 'blank') {
        next.push({ kind: 'blank', blank: mapBlank(segment.blank) })
        continue
      }
      if (remaining <= 0) {
        next.push(segment)
        continue
      }
      const before = remaining
      const injected = injectIntoText(segment.text, targets, used, `${exercise.id}-${step.id}`, remaining)
      remaining = before - injected.filter((s) => s.kind === 'blank').length
      next.push(...injected)
    }
    return { ...step, segments: next }
  })

  return { ...exercise, steps }
}

export const getTask1BlankExplain = (blank: WgbBlank, userAnswer?: string): string =>
  buildDetailedThaiExplain({
    answer: blank.kind === 'select' ? blank.answer : blank.answers[0],
    focus: blank.focus,
    userAnswer,
    authoredExplain: blank.explain
  })
