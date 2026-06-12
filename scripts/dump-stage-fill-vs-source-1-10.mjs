#!/usr/bin/env node
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const STAGE_SOURCES = {
  1: ['cambridge-10-test1-passage1', 'cambridge-10-test1-passage2'],
  2: ['cambridge-10-test2-passage1', 'cambridge-10-test2-passage2'],
  3: ['cambridge-10-test3-passage1', 'cambridge-10-test3-passage2'],
  4: ['cambridge-10-test4-passage1', 'cambridge-10-test4-passage2'],
  5: ['cambridge-11-test1-passage1', 'cambridge-11-test1-passage2'],
  6: ['cambridge-16-test1-passage1', 'cambridge-16-test1-passage2'],
  7: ['cambridge-17-test1-passage1', 'cambridge-17-test1-passage2'],
  8: ['cambridge-17-test2-passage1', 'cambridge-17-test2-passage2'],
  9: ['cambridge-17-test3-passage1', 'cambridge-17-test3-passage2'],
  10: ['cambridge-17-test4-passage1', 'cambridge-17-test4-passage2']
}

const pool = []
for (const book of [10, 11, 16, 17]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
  pool.push(...mod[key])
}

const ak = (q) => String(q?.correctAnswer || '').trim().toLowerCase()

const lineText = (set) => {
  const parts = []
  if (set.summaryTitle) parts.push(`TITLE: ${set.summaryTitle}`)
  for (const l of set.summaryLines || []) {
    if (l.type === 'table-header' || l.type === 'table-row') parts.push(`[${l.type}] ${(l.cells || []).join(' | ')}`)
    else if (l.type === 'diagram') parts.push('[diagram]')
    else parts.push(l.text || '')
  }
  return parts
}

for (let stage = 1; stage <= 10; stage++) {
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  for (const set of sets) {
    const srcId = STAGE_SOURCES[stage][set.passageNumber - 1]
    const src = pool.find((e) => e.id === srcId)
    const jp = buildIntensiveJourneyExam(stage).parsedPayload.passages.find((p) => p.number === set.passageNumber)
    const jqs = jp.questions.filter((q) => q.answerType === 'text' && q.number >= set.startNumber && q.number <= set.endNumber)

    console.log(`\n${'='.repeat(70)}`)
    console.log(`STAGE ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber}  ←  ${srcId}`)
    console.log(`INSTRUCTIONS: ${(set.instructions || []).join(' | ')}`)
    console.log('--- OVERRIDE LINES ---')
    lineText(set).forEach((l) => console.log(l))

    console.log('--- JOURNEY PROMPTS ---')
    for (const jq of jqs) {
      console.log(`Q${jq.number}: ${jq.prompt.replace(/\s+/g, ' ').trim()}`)
    }

    console.log('--- CAMBRIDGE PROMPTS (matched by answer) ---')
    for (const jq of jqs) {
      const ja = ak(jq)
      const match = src?.parsedPayload?.passages?.[0]?.questions?.find((sq) => {
        if (sq.answerType !== 'text') return false
        const sa = ak(sq)
        if (sa === ja) return true
        return (sq.acceptedAnswers || []).map((a) => String(a).toLowerCase()).includes(ja)
      })
      const flag = match ? '' : ' *** NO MATCH ***'
      console.log(`Q${jq.number} (${ja}) → src Q${match?.number ?? '?'}: ${match?.prompt?.replace(/\s+/g, ' ').trim() ?? 'NONE'}${flag}`)
    }
  }
}
