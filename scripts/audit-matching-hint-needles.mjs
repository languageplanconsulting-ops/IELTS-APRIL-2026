#!/usr/bin/env node
/**
 * Assert matching questions (headings, information, statements/people) get 4 hint needles.
 * Run: npx tsx scripts/audit-matching-hint-needles.mjs
 */
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'

const MATCHING_HINT_HIGHLIGHT_COUNT = 4

const normalizeTextForLooseMatch = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/["'“”‘’.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const buildReadingHintNeedles = (hintExcerpt) => {
  const raw = String(hintExcerpt || '').trim()
  if (!raw) return []
  const normalized = raw.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s+/g, ' ').trim()
  const segments = normalized
    .split(/(?:\.\.\.|…)+|(?:\s+\/\s+)|(?:\s*;\s*)|\n+/)
    .map((segment) => segment.replace(/^["'“”]+|["'“”]+$/g, '').trim())
    .filter((segment) => segment.length >= 8)
  return segments.length ? [...new Set(segments)] : [normalized]
}

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const resolveReadingEvidenceNeedleInPassage = (passage, evidenceText) => {
  const stripped = String(evidenceText || '')
    .replace(/^Paragraph\s+[A-G]:\s*/i, '')
    .trim()
  if (!stripped || !passage) return ''

  const paragraphs = passage.bodyParagraphs || []
  const needles = buildReadingHintNeedles(stripped)

  for (const needle of needles) {
    const normalizedNeedle = normalizeTextForLooseMatch(needle)
    if (normalizedNeedle.length < 8) continue
    for (const paragraph of paragraphs) {
      const regex = new RegExp(escapeRegExp(needle), 'i')
      const match = paragraph.match(regex)
      if (match?.[0]) return match[0]
    }
  }

  const words = stripped.split(/\s+/).filter((word) => word.length > 3)
  for (let length = Math.min(14, words.length); length >= 5; length -= 1) {
    const candidate = words.slice(0, length).join(' ')
    const normalizedCandidate = normalizeTextForLooseMatch(candidate)
    if (normalizedCandidate.length < 12) continue
    for (const paragraph of paragraphs) {
      if (normalizeTextForLooseMatch(paragraph).includes(normalizedCandidate)) {
        const regex = new RegExp(escapeRegExp(candidate), 'i')
        const match = paragraph.match(regex)
        if (match?.[0]) return match[0]
      }
    }
  }

  return stripped.length > 120 ? stripped.slice(0, 120).trim() : stripped
}

const isMatchingQuestion = (passage, question) => {
  const section = passage.questionSectionText || ''
  const answer = String(question.correctAnswer || '').trim()
  if (/which section contains/i.test(section) && /^[A-G]$/i.test(answer)) {
    const infoRange = passage.questionRanges?.[0]
    if (infoRange && question.number >= infoRange.start && question.number <= infoRange.end) return true
  }
  if (/list of headings/i.test(section) && /^paragraph\s+[A-G]/i.test(question.prompt)) return true
  if (/match each statement/i.test(section) && /^[A-D]$/i.test(answer)) {
    const peopleRange = passage.questionRanges?.find(
      (range) => question.number >= range.start && question.number <= range.end
    )
    if (peopleRange && /list of people/i.test(section)) return true
  }
  return false
}

const getPassageLabel = (index) => String.fromCharCode(65 + index)

const clip = (value, maxLength = 200) => {
  const compact = String(value || '').replace(/\s+/g, ' ').trim()
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1).trim()}…` : compact
}

const buildMatchingHintNeedles = (passage, question) => {
  const useParagraphLabels = /which section contains/i.test(passage.questionSectionText || '')
  const correctText = buildReadingHintNeedles(question.exactPortion)[0] || String(question.exactPortion || '').trim()
  const portions = [correctText]
  const paragraphs = passage.bodyParagraphs || []

  for (let index = 0; index < paragraphs.length && portions.length < MATCHING_HINT_HIGHLIGHT_COUNT; index += 1) {
    const sentences = String(paragraphs[index] || '')
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
      .filter((sentence) => sentence.length >= 18)
    for (const sentence of sentences.length ? sentences : [paragraphs[index]]) {
      if (portions.length >= MATCHING_HINT_HIGHLIGHT_COUNT) break
      const prefix = useParagraphLabels ? `Paragraph ${getPassageLabel(index)}: ` : ''
      const snippet = prefix + clip(sentence)
      if (!portions.some((item) => normalizeTextForLooseMatch(item) === normalizeTextForLooseMatch(snippet))) {
        portions.push(snippet)
      }
    }
  }

  const needles = []
  const seen = new Set()
  for (const portion of portions) {
    if (needles.length >= MATCHING_HINT_HIGHLIGHT_COUNT) break
    const resolved = resolveReadingEvidenceNeedleInPassage(passage, portion)
    const normalized = normalizeTextForLooseMatch(resolved)
    if (normalized.length >= 8 && !seen.has(normalized)) {
      seen.add(normalized)
      needles.push(resolved)
    }
  }

  return needles
}

const failures = []

for (let stage = 11; stage <= 15; stage += 1) {
  const exam = buildIntensiveJourneyExam(stage)
  for (const passage of exam.parsedPayload.passages) {
    for (const question of passage.questions || []) {
      if (!isMatchingQuestion(passage, question)) continue
      const needles = buildMatchingHintNeedles(passage, question)
      if (needles.length !== MATCHING_HINT_HIGHLIGHT_COUNT) {
        failures.push({
          stage,
          passage: passage.number,
          q: question.number,
          count: needles.length
        })
      }
    }
  }
}

if (!failures.length) {
  console.log('OK: All intensive matching questions (stages 11–15) resolve to 4 hint needles.')
  process.exit(0)
}

console.log(`FAIL: ${failures.length} matching question(s) with wrong needle count:\n`)
for (const f of failures) {
  console.log(`  stage ${f.stage} P${f.passage} Q${f.q}: ${f.count} needles (expected 4)`)
}
process.exit(1)
