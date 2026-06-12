#!/usr/bin/env node
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import { buildJourneyStageDefinitions } from '../src/readingJourney.ts'

const STAGE_SOURCES_6_17 = {
  10: ['cambridge-17-test4-passage1', 'cambridge-17-test4-passage2'],
  11: ['cambridge-18-test1-passage1', 'cambridge-18-test1-passage2'],
  12: ['cambridge-18-test2-passage1', 'cambridge-18-test2-passage2'],
  13: ['cambridge-16-test2-passage1', 'cambridge-16-test2-passage2'],
  14: ['cambridge-16-test3-passage1', 'cambridge-16-test3-passage2'],
  15: ['cambridge-16-test4-passage1', 'cambridge-16-test4-passage2'],
  16: ['cambridge-18-test3-passage1', 'cambridge-18-test3-passage2'],
  17: ['cambridge-18-test4-passage1', 'cambridge-18-test4-passage2']
}

const pool = []
for (const book of [11, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
  pool.push(...mod[key])
}

function extractBlock(text, start, end) {
  const src = String(text || '')
  const blocks = src.split(/(?=Questions?\s+\d+)/i).map((b) => b.trim()).filter(Boolean)
  for (const block of blocks) {
    const h = block.match(/Questions?\s+(\d+)\s*[–-]\s*(\d+)/i)
    if (!h) continue
    const bs = Number(h[1])
    const be = Number(h[2])
    if (/complete the|answer the questions|label the diagram/i.test(block) && bs <= start && be >= end) {
      return block.trim()
    }
  }
  return ''
}

const defs = buildJourneyStageDefinitions(pool, 20, 20)
const stageSourceMap = Object.fromEntries(
  defs.map((d) => [d.stageNumber, d.sourceExamIds])
)

const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => {
  const m = s.examId.match(/stage-(\d+)/)
  return m && Number(m[1]) >= 10 && Number(m[1]) <= 20
})

for (const set of sets) {
  const stage = Number(set.examId.match(/stage-(\d+)/)[1])
  let srcId = STAGE_SOURCES_6_17[stage]?.[set.passageNumber - 1]
  if (!srcId && stageSourceMap[stage]) {
    srcId = stageSourceMap[stage][set.passageNumber - 1]
  }
  const exam = pool.find((e) => e.id === srcId)
  const p = exam?.parsedPayload?.passages?.[0]
  const block = extractBlock(p?.questionSectionText, set.startNumber, set.endNumber)
  console.log(`=== stage ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber} src=${srcId || 'MISSING'} ===`)
  console.log(block || '(no block)')
  console.log('')
}
