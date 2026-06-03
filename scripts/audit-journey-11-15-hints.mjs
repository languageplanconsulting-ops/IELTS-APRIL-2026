#!/usr/bin/env node
/**
 * Audit evidence hints for intensive journey stages 11–15.
 * Mirrors App.tsx hint resolution (needles, resolve, matching-info paragraph).
 *
 * Run: npx tsx scripts/audit-journey-11-15-hints.mjs
 */
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'

const normalizeTextForLooseMatch = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/["'“”‘’.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const buildReadingHintNeedles = (hintExcerpt) => {
  const raw = String(hintExcerpt || '').trim()
  if (!raw) return []

  const quotedSegments = [...raw.matchAll(/["“”']([^"“”']{4,}?)["“”']/g)]
    .map((match) => String(match[1] || '').replace(/\s+/g, ' ').trim())
    .filter((segment) => segment.length >= 8)
  if (quotedSegments.length) return [...new Set(quotedSegments)]

  const normalized = raw.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const segments = normalized
    .split(/(?:\.\.\.|…)+|(?:\s+\/\s+)|(?:\s*;\s*)|\n+/)
    .map((segment) => segment.replace(/^["'“”]+|["'“”]+$/g, '').trim())
    .filter((segment) => segment.length >= 8)

  return segments.length ? [...new Set(segments)] : [normalized]
}

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const findReadingEvidenceParagraphIndex = (passage, exactPortion) => {
  if (!passage || !exactPortion) return -1
  const hintNeedles = buildReadingHintNeedles(exactPortion)
  const normalizedParagraphs = passage.bodyParagraphs.map((paragraph) => normalizeTextForLooseMatch(paragraph))
  for (const needle of hintNeedles) {
    const normalizedNeedle = normalizeTextForLooseMatch(needle)
    const foundIndex = normalizedParagraphs.findIndex((paragraph) => paragraph.includes(normalizedNeedle))
    if (foundIndex >= 0) return foundIndex
  }
  const normalizedExact = normalizeTextForLooseMatch(exactPortion)
  return normalizedParagraphs.findIndex((paragraph) => paragraph.includes(normalizedExact))
}

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

const isMatchingInfoQuestion = (passage, question) => {
  const section = passage.questionSectionText || ''
  if (!/which section contains/i.test(section)) return false
  if (/^paragraph\s+[A-G]/i.test(question.prompt)) return false
  if (!/^[A-G]$/i.test(String(question.correctAnswer || '').trim())) return false
  const infoRange = passage.questionRanges?.[0]
  if (!infoRange) return false
  return question.number >= infoRange.start && question.number <= infoRange.start + 3
}

const isHeadingQuestion = (passage, question) => {
  if (!/list of headings/i.test(passage.questionSectionText || '')) return false
  return /^paragraph\s+[A-G]/i.test(question.prompt)
}

const auditQuestion = (passage, question) => {
  const exactPortion = String(question.exactPortion || '').trim()
  const resolved = resolveReadingEvidenceNeedleInPassage(passage, exactPortion)
  const resolvedNorm = normalizeTextForLooseMatch(resolved)
  const highlightsInPassage = (passage.bodyParagraphs || []).some((paragraph) => {
    const norm = normalizeTextForLooseMatch(paragraph)
    return resolvedNorm.length >= 8 && norm.includes(resolvedNorm)
  })

  const paraIndex = findReadingEvidenceParagraphIndex(passage, exactPortion)
  const ok = highlightsInPassage

  const issues = []
  if (!ok) {
    issues.push('unresolved-highlight')
  }

  if (isMatchingInfoQuestion(passage, question)) {
    const expected = question.correctAnswer.toUpperCase().charCodeAt(0) - 65
    if (paraIndex >= 0 && paraIndex !== expected) {
      issues.push(`matching-info-paragraph-mismatch: answer ${question.correctAnswer} but evidence in ${String.fromCharCode(65 + paraIndex)}`)
    }
  }

  if (isHeadingQuestion(passage, question)) {
    const letter = question.prompt.match(/paragraph\s+([A-G])/i)?.[1]?.toUpperCase()
    if (letter) {
      const expected = letter.charCodeAt(0) - 65
      if (paraIndex >= 0 && paraIndex !== expected) {
        issues.push(`heading-paragraph-mismatch: ${question.prompt} but evidence in ${String.fromCharCode(65 + paraIndex)}`)
      }
    }
  }

  if (/\.\.\.|…/.test(exactPortion)) {
    issues.push('evidence-uses-ellipsis')
  }

  return { ok: issues.length === 0, issues, paraIndex, resolved: resolved.slice(0, 60) }
}

const failures = []
const warnings = []

for (let stage = 11; stage <= 15; stage += 1) {
  const exam = buildIntensiveJourneyExam(stage)
  if (!exam) {
    failures.push({ stage, error: 'exam build failed' })
    continue
  }
  for (const passage of exam.parsedPayload.passages) {
    for (const question of passage.questions || []) {
      const result = auditQuestion(passage, question)
      if (!result.ok) {
        const entry = {
          stage,
          passage: passage.number,
          q: question.number,
          issues: result.issues,
          evidence: String(question.exactPortion || '').slice(0, 90)
        }
        if (result.issues.includes('unresolved-highlight') || result.issues.some((i) => i.includes('mismatch'))) {
          failures.push(entry)
        } else {
          warnings.push(entry)
        }
      }
    }
  }
}

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`)
  for (const w of warnings) {
    console.log(`  stage ${w.stage} P${w.passage} Q${w.q}: ${w.issues.join(', ')}`)
  }
  console.log('')
}

if (!failures.length) {
  console.log('OK: Evidence hints for stages 11–15 (130 questions) resolve and align with App logic.')
  process.exit(warnings.length ? 0 : 0)
}

console.log(`FAIL: ${failures.length} question(s):\n`)
for (const f of failures) {
  console.log(`  stage ${f.stage} P${f.passage} Q${f.q}: ${f.issues.join(', ')}`)
  console.log(`    evidence: ${f.evidence}\n`)
}
process.exit(1)
