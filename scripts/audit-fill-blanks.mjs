import { buildIntensiveJourneyExam, getReadingJourneyStageId } from '../src/readingJourney.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'

const ELLIPSIS = /…|\.\.\.|\.{4,}/
const LEADING_FRAGMENT = /^[\s…\.]+[a-z]/i
const EMPTY_PROMPT = (p) => !p || p.trim().length < 3

function normalizeTextForLooseMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildReadingHintNeedles(excerpt) {
  const stripped = String(excerpt || '').trim()
  if (!stripped) return []
  const needles = [stripped]
  if (stripped.length > 80) needles.push(stripped.slice(0, 80))
  if (stripped.length > 50) needles.push(stripped.slice(0, 50))
  return needles
}

function evidenceResolvable(passage, exactPortion) {
  if (!exactPortion?.trim()) return { ok: false, reason: 'missing exactPortion' }
  const paragraphs = passage.bodyParagraphs || []
  const normalizedParagraphs = paragraphs.map((p) => normalizeTextForLooseMatch(p))
  for (const needle of buildReadingHintNeedles(exactPortion)) {
    const normalizedNeedle = normalizeTextForLooseMatch(needle)
    if (normalizedNeedle.length < 8) continue
    if (normalizedParagraphs.some((p) => p.includes(normalizedNeedle))) return { ok: true }
  }
  return { ok: false, reason: 'exactPortion not found in passage' }
}

function findActiveOverride(examId, start, end) {
  return NEW_FILL_BLANK_SETS.find(
    (s) => s.examId === examId && s.startNumber === start && s.endNumber === end
  )
}

const byPassage = []
const evidenceBroken = []

for (let stage = 1; stage <= 17; stage++) {
  const exam = buildIntensiveJourneyExam(stage)
  const examId = getReadingJourneyStageId(stage)

  exam.parsedPayload.passages.forEach((passage, pi) => {
    const pnum = pi + 1
    const fills = passage.questions.filter((q) => q.answerType === 'text')
    if (!fills.length) return

    const start = fills[0].number
    const end = fills[fills.length - 1].number
    const override = findActiveOverride(examId, start, end)
    const brokenPrompts = fills.filter((q) => {
      const prompt = String(q.prompt || '')
      return EMPTY_PROMPT(prompt) || ELLIPSIS.test(prompt) || LEADING_FRAGMENT.test(prompt)
    })

    let uiStatus
    if (override) {
      uiStatus = 'clean UI (override active)'
    } else {
      uiStatus = 'BROKEN legacy UI (… fragments)'
    }

    const evFails = []
    for (const q of fills) {
      const ev = evidenceResolvable(passage, q.exactPortion)
      if (!ev.ok) {
        evFails.push({ q: q.number, reason: ev.reason })
        evidenceBroken.push({ stage, p: pnum, q: q.number, title: passage.title, reason: ev.reason, uiStatus })
      }
    }

    byPassage.push({
      stage,
      p: pnum,
      title: passage.title,
      range: `${start}-${end}`,
      uiStatus,
      fillCount: fills.length,
      brokenPromptCount: brokenPrompts.length,
      evidenceFails: evFails.length,
      overrideFiltered: override ? null : 'no exact-range override in NEW_FILL_BLANK_SETS'
    })
  })
}

console.log('=== WHAT YOU SEE IN THE APP ===\n')
console.log('✅ Clean summary UI (override active):')
byPassage.filter((p) => p.uiStatus.includes('clean')).forEach((p) => {
  const extra = p.evidenceFails ? ` — ⚠ ${p.evidenceFails} show-evidence issues` : ''
  console.log(`  ด่าน ${p.stage} P${p.p} Q${p.range} — ${p.title}${extra}`)
})

console.log('\n❌ Broken legacy UI (… / cut-off text — your Megafires issue):')
byPassage.filter((p) => p.uiStatus.includes('BROKEN')).forEach((p) => {
  console.log(`  ด่าน ${p.stage} P${p.p} Q${p.range} — ${p.title} (${p.fillCount} questions)`)
})

console.log('\n=== Megafires sample prompts (ด่าน 4 P1) ===')
const exam4 = buildIntensiveJourneyExam(4)
exam4.parsedPayload.passages[0].questions
  .filter((q) => q.answerType === 'text')
  .forEach((q) => console.log(`  Q${q.number}: "${String(q.prompt).slice(0, 90)}"`))

console.log('\n=== Show evidence broken (click ? does not highlight) ===')
console.log(`Total: ${evidenceBroken.length} questions across ${new Set(evidenceBroken.map((e) => `ด่าน ${e.stage} P${e.p}`)).size} passages`)
const byEvPassage = {}
evidenceBroken.forEach((e) => {
  const k = `ด่าน ${e.stage} P${e.p} — ${e.title}`
  if (!byEvPassage[k]) byEvPassage[k] = []
  byEvPassage[k].push(`Q${e.q}`)
})
Object.entries(byEvPassage).forEach(([k, qs]) => console.log(`  ${k}: ${qs.join(', ')}`))

console.log('\n=== Summary counts ===')
console.log('Passages with clean UI:', byPassage.filter((p) => p.uiStatus.includes('clean')).length)
console.log('Passages with broken legacy UI:', byPassage.filter((p) => p.uiStatus.includes('BROKEN')).length)
console.log('Show-evidence failures:', evidenceBroken.length)
