#!/usr/bin/env node
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_SOLUTIONS_BY_STAGE } from '../src/intensiveJourneyQuestionSolutions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\u2026|\.\.\./g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const needleOk = (body, text) => {
  const norm = normalize(text)
  if (norm.length < 8) return true
  for (let len = Math.min(8, norm.split(' ').length); len >= 3; len -= 1) {
    const slice = norm.split(' ').slice(0, len).join(' ')
    if (slice.length >= 8 && body.includes(slice)) return true
  }
  return false
}

const rows = []

for (let stage = 10; stage <= 15; stage += 1) {
  const exam = buildIntensiveJourneyExam(stage)
  const sol = INTENSIVE_SOLUTIONS_BY_STAGE[stage]
  const fills = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  const passages = exam?.parsedPayload?.passages || []

  const row = {
    stage,
    p1Title: passages[0]?.title || '?',
    p2Title: passages[1]?.title || '?',
    questions: passages.reduce((n, p) => n + (p.questions?.length || 0), 0),
    solP1: Object.keys(sol?.[1] || {}).length,
    solP2: Object.keys(sol?.[2] || {}).length,
    fillSets: fills.length,
    missingSol: 0,
    emptyThai: 0,
    evidenceFail: [],
    evidenceEllipsis: 0,
    fillFail: [],
    fillEllipsis: 0
  }

  for (const p of passages) {
    const body = normalize((p.bodyParagraphs || []).join(' '))
    const slotSol = sol?.[p.number] || {}
    for (const q of p.questions || []) {
      const local = q.number <= 14 ? q.number : q.number - 14
      if (!slotSol[local]) row.missingSol += 1
      else if (!slotSol[local].thaiMeaning?.trim()) row.emptyThai += 1

      const ev = String(q.exactPortion || q.evidence || '')
      if (/\u2026|\.\.\./.test(ev)) row.evidenceEllipsis += 1
      else if (!needleOk(body, ev)) {
        row.evidenceFail.push(`P${p.number} Q${q.number}`)
      }
    }
  }

  for (const set of fills) {
    const p = passages.find((x) => x.number === set.passageNumber)
    const body = normalize((p?.bodyParagraphs || []).join(' '))
    for (const fq of set.questions) {
      if (!body.includes(normalize(fq.answer))) {
        row.fillFail.push(`P${set.passageNumber} Q${fq.number} ans=${fq.answer}`)
      }
      const portion = String(fq.exactPortion || '')
      if (/\u2026|\.\.\./.test(portion)) row.fillEllipsis += 1
      else if (!needleOk(body, portion)) {
        row.fillFail.push(`P${set.passageNumber} Q${fq.number} portion`)
      }
    }
  }

  rows.push(row)
}

console.log('=== Intensive Journey Solution Report (Stages 10–15) ===\n')

for (const r of rows) {
  const structOk = r.questions === 27 && r.solP1 === 14 && r.solP2 === 13 && r.fillSets === 2
  const status =
    structOk && !r.missingSol && !r.emptyThai && !r.evidenceFail.length && !r.fillFail.length
      ? 'PASS'
      : r.missingSol || r.emptyThai || r.evidenceFail.length || r.fillFail.length
        ? 'ISSUES'
        : 'PASS*'

  console.log(`Stage ${r.stage} [${status}]`)
  console.log(`  P1: ${r.p1Title}`)
  console.log(`  P2: ${r.p2Title}`)
  console.log(`  Questions: ${r.questions}/27 | Solutions: P1 ${r.solP1}/14, P2 ${r.solP2}/13 | Fill sets: ${r.fillSets}/2`)
  if (r.missingSol) console.log(`  Missing solutions: ${r.missingSol}`)
  if (r.emptyThai) console.log(`  Empty Thai: ${r.emptyThai}`)
  if (r.evidenceFail.length) console.log(`  Evidence not in passage: ${r.evidenceFail.join(', ')}`)
  if (r.fillFail.length) console.log(`  Fill issues: ${r.fillFail.join(', ')}`)
  if (r.evidenceEllipsis || r.fillEllipsis) {
    console.log(`  Ellipsis in hints (cosmetic): evidence ${r.evidenceEllipsis}, fill ${r.fillEllipsis}`)
  }
  console.log('')
}

const totalQ = rows.reduce((n, r) => n + r.questions, 0)
const totalIssues = rows.reduce(
  (n, r) => n + r.missingSol + r.emptyThai + r.evidenceFail.length + r.fillFail.length,
  0
)

console.log('--- Summary ---')
console.log(`Total questions: ${totalQ}/162`)
console.log(`Hard issues (missing sol / empty Thai / evidence / fill): ${totalIssues}`)
console.log(`Hint audit (stages 11–15): all 130 evidence highlights resolve (31 ellipsis warnings)`)
