#!/usr/bin/env node
/**
 * Generate intensive journey ด่าน 8–12 from Cambridge 14 (tests 2–4) + Cambridge 15 (tests 1–2).
 * Source: ieltstrainingonline.com practice pages (stored in server/*.mjs).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const STAGE_SOURCES = {
  8: ['cambridge-14-test2-passage1', 'cambridge-14-test2-passage2'],
  9: ['cambridge-14-test3-passage1', 'cambridge-14-test3-passage2'],
  10: ['cambridge-14-test4-passage1', 'cambridge-14-test4-passage2'],
  11: ['cambridge-15-test1-passage1', 'cambridge-15-test1-passage2'],
  12: ['cambridge-15-test2-passage1', 'cambridge-15-test2-passage2']
}

const c14 = (await import('../server/userProvidedReadingPracticeCambridge14.mjs'))
  .USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS
const c15 = (await import('../server/userProvidedReadingPracticeCambridge15.mjs'))
  .USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS
const pool = [...c14, ...c15]

const esc = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n')

const cleanPrompt = (p) =>
  String(p || '')
    .split('\n')[0]
    .replace(/\s+/g, ' ')
    .replace(/…/g, '…')
    .trim()
    .slice(0, 220)

const parseParaphrase = (pv) => {
  const parts = String(pv || '')
    .split('=')
    .map((x) => x.trim())
  return { passageKeyword: parts[0] || '', questionKeyword: parts[1] || '', thaiMeaning: parts[2] || '' }
}

const extractThai = (explanationThai) => {
  const m = String(explanationThai || '').match(/จึงตอบ[^]*$|คำตอบคือ[^]+/)
  return m ? m[0].slice(0, 80) : ''
}

/** Prefer clean lettered blocks from rawPassageText; fall back to bodyParagraphs. */
function extractParagraphs(exam) {
  const passage = exam.parsedPayload?.passages?.[0]
  if (!passage) return []

  const raw = String(exam.rawPassageText || '')
    .replace(/<div[\s\S]*/i, '')
    .replace(/READING PASSAGE \d+\s*/i, '')
    .replace(/^[^\n]+\n\nBorn in Scotland/m, 'Alexander Henderson (1831-1913)\n\nBorn in Scotland')
    .trim()

  const letterBlocks = []
  const re = /(?:^|\n\n)([A-I])\s*\n([\s\S]*?)(?=\n\n[A-I]\s*\n|\n\nQuestions|\n\n<div|$)/g
  let m
  while ((m = re.exec(raw)) !== null) {
    const text = m[2].replace(/\s+/g, ' ').trim()
    if (text.length > 40) letterBlocks.push([m[1], text])
  }
  if (letterBlocks.length >= 3) return letterBlocks

  const re2 = /(?:^|\n\n)([A-I])\.\s+([\s\S]*?)(?=\n\n[A-I]\.|\n\nQuestions|\n\n<div|$)/g
  while ((m = re2.exec(raw)) !== null) {
    const text = m[2].replace(/\s+/g, ' ').trim()
    if (text.length > 40) letterBlocks.push([m[1], text])
  }
  if (letterBlocks.length >= 3) return letterBlocks

  const bodies = passage.bodyParagraphs || []
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return bodies
    .map((text, i) => {
      const cleaned = String(text)
        .replace(/^[A-J]\s+/, '')
        .replace(/^[A-J]\.\s*/, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (!cleaned || cleaned.length < 20) return null
      return [letters[i] || String(i + 1), cleaned]
    })
    .filter(Boolean)
}

function sliceSectionText(sectionText, range, allRanges) {
  const idx = allRanges.findIndex((r) => r.start === range.start)
  const startMark = `Questions ${range.start}`
  const startPos = sectionText.indexOf(startMark)
  const next = allRanges[idx + 1]
  const endPos = next ? sectionText.indexOf(`Questions ${next.start}`) : sectionText.length
  return startPos >= 0 ? sectionText.slice(startPos, endPos > startPos ? endPos : undefined) : sectionText
}

function classifyRange(sectionSlice) {
  const slice = sectionSlice.questions
  if (!slice.length) return null
  const text = sectionSlice.text.toLowerCase()
  const types = [...new Set(slice.map((q) => q.answerType))]

  if (types.length === 1 && types[0] === 'true-false-not-given') return { key: 'tfng' }
  if (types.length === 1 && types[0] === 'yes-no-not-given') return { key: 'ynng' }
  if (types.every((t) => t === 'text')) {
    if (text.includes('notes below')) return { key: 'fill', variant: 'notes' }
    return { key: 'fill', variant: 'summary' }
  }
  if (types.every((t) => t === 'multiple-choice')) {
    if (text.includes('list of theories')) {
      return { key: 'matchingPeople', peopleKey: 'theories' }
    }
    if (text.includes('list of people') || text.includes('researchers below') || text.includes('list of researchers')) {
      return { key: 'matchingPeople', peopleKey: 'people' }
    }
    if (text.includes('heading') || text.includes('list of headings')) {
      return { key: 'headings' }
    }
    if (text.includes('which two') || text.includes('choose two')) {
      return { key: 'mcq', chooseTwo: true }
    }
    if (
      text.includes('which section') ||
      text.includes('paragraph contains') ||
      text.includes('which paragraph')
    ) {
      const maxLetter = slice.reduce(
        (max, q) => Math.max(max, q.correctAnswer.toUpperCase().charCodeAt(0)),
        65
      )
      return { key: 'matchingInfo', endLetter: String.fromCharCode(Math.max(71, maxLetter)) }
    }
    return { key: 'matchingInfo', endLetter: 'I' }
  }
  if (types.includes('true-false-not-given')) return { key: 'tfng' }
  if (types.includes('yes-no-not-given')) return { key: 'ynng' }
  return null
}

function consolidateSections(sections) {
  const order = []
  const map = new Map()
  for (const sec of sections) {
    if (!map.has(sec.key)) {
      const copy = { ...sec, items: [...sec.items] }
      map.set(sec.key, copy)
      order.push(sec.key)
    } else {
      map.get(sec.key).items.push(...sec.items)
    }
  }
  return { sections: order.map((k) => map.get(k)), sectionOrder: order }
}

function extractPeopleList(sectionText) {
  const lines = sectionText.split('\n')
  const people = []
  for (const line of lines) {
    const m = line.match(/^([A-G])\s+(.+)$/)
    if (m && !/section|paragraph|heading|theory/i.test(m[2])) {
      people.push(`${m[1]} ${m[2].trim()}`)
    }
  }
  return people.length ? people : null
}

function extractMcqOptions(sectionText) {
  const options = []
  const re = /^\s*([A-F])\s+(.+)$/gm
  let m
  while ((m = re.exec(sectionText)) !== null) {
    const label = m[2].trim()
    if (label.length > 3 && !/questions|reading passage/i.test(label)) {
      options.push(`${m[1]} ${label}`)
    }
  }
  return options.length >= 4 ? options : null
}

function extractHeadingOptions(sectionText) {
  const options = []
  const re = /^\s*(i{1,3}|iv|v|vi{0,3}|vii{0,3}|viii|ix|x|xi|xii)\s+(.+)$/gim
  let m
  while ((m = re.exec(sectionText)) !== null) {
    options.push(m[2].trim())
  }
  return options.length >= 4 ? options : null
}

function buildLayout(exam) {
  const passage = exam.parsedPayload.passages[0]
  const title = exam.title.replace(/^Cambridge \d+ Test \d+ Passage \d+ - /, '').trim()
  const paragraphs = extractParagraphs(exam)
  const sectionText = passage.questionSectionText || ''
  const questions = passage.questions || []
  const ranges = passage.questionRanges || []

  const sections = []
  for (const range of ranges) {
    const slice = questions.filter((q) => q.number >= range.start && q.number <= range.end)
    const sliceText = sliceSectionText(sectionText, range, ranges)
    const kind = classifyRange({ text: sliceText, questions: slice })
    if (!kind) continue
    const items = slice.map((q) => {
      const para = parseParaphrase(q.paraphrasedVocabulary)
      return {
        prompt: cleanPrompt(q.prompt),
        answer: q.correctAnswer,
        evidence: q.exactPortion,
        acceptedAnswers: q.acceptedAnswers?.length ? q.acceptedAnswers : undefined,
        passageKeyword: para.passageKeyword,
        questionKeyword: para.questionKeyword,
        thaiMeaning: para.thaiMeaning || extractThai(q.explanationThai)
      }
    })

    sections.push({ ...kind, items, sectionText: sliceText })
  }

  const { sections: merged, sectionOrder } = consolidateSections(sections)
  return { title, paragraphs, sections: merged, sectionOrder }
}

function emitQuestion(item, indent) {
  const parts = [
    `${indent}q('${esc(item.prompt)}', '${esc(item.answer)}', '${esc(item.evidence)}'`
  ]
  const meta = []
  if (item.acceptedAnswers?.length) {
    meta.push(`acceptedAnswers: ${JSON.stringify(item.acceptedAnswers)}`)
  }
  if (item.passageKeyword) meta.push(`passageKeyword: '${esc(item.passageKeyword)}'`)
  if (item.questionKeyword) meta.push(`questionKeyword: '${esc(item.questionKeyword)}'`)
  if (item.thaiMeaning) meta.push(`thaiMeaning: '${esc(item.thaiMeaning)}'`)
  if (meta.length) parts[0] += `, { ${meta.join(', ')} }`
  parts[0] += ')'
  return parts[0]
}

function emitLayout(stage, slot, layout, exam) {
  const varName = `stage${stage}Passage${slot}`
  const lines = []
  lines.push(`const ${varName}: IntensivePassageLayout = {`)
  lines.push(`  title: '${esc(layout.title)}',`)
  lines.push(`  sectionOrder: [${layout.sectionOrder.map((k) => `'${k}'`).join(', ')}],`)
  lines.push(`  paragraphs: [`)
  for (const [letter, text] of layout.paragraphs) {
    lines.push(`    ['${letter}', '${esc(text)}'],`)
  }
  lines.push(`  ],`)

  for (const sec of layout.sections) {
    if (sec.key === 'tfng') {
      const tfngFn = slot === 1 ? 'tfng' : 'tfngP2'
      lines.push(`  tfng: ${tfngFn}([`)
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'ynng') {
      const ynngFn = slot === 1 ? 'ynng' : 'ynngP2'
      lines.push(`  ynng: ${ynngFn}([`)
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'fill') {
      const title = esc(layout.title)
      if (sec.variant === 'notes') {
        lines.push(`  fill: fillNotes('${title}', [`)
      } else {
        lines.push(`  fill: fillBlock('${title}', [`)
      }
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'matchingInfo') {
      const end = sec.endLetter || 'G'
      lines.push(`  matchingInfo: matchingInfoBlock('${end}', [`)
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'headings') {
      const opts =
        extractHeadingOptions(sec.sectionText || '') ||
        sec.items.map((_, i) => `Heading option ${i + 1}`)
      lines.push(`  headings: headingBlock(${JSON.stringify(opts)}, [`)
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'matchingPeople') {
      const peopleList =
        sec.peopleKey === 'theories'
          ? 'THEORIES_A_B_C'
          : JSON.stringify(
              extractPeopleList(sec.sectionText || '') || [
                'A Researcher A',
                'B Researcher B',
                'C Researcher C',
                'D Researcher D'
              ]
            )
      lines.push(`  matchingPeople: matchingPeopleBlock(${peopleList}, [`)
      for (const item of sec.items) lines.push(emitQuestion(item, '    ') + ',')
      lines.push(`  ]),`)
    } else if (sec.key === 'mcq') {
      const mcqOpts = extractMcqOptions(sec.sectionText || '') || [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F'
      ]
      lines.push(
        `  mcq: { instruction: 'Choose TWO letters, A–F.', options: ${JSON.stringify(mcqOpts)}, items: [`
      )
      for (const item of sec.items) lines.push(emitQuestion(item, '      ') + ',')
      lines.push(`    ] },`)
    }
  }

  lines.push(`}`)
  return lines.join('\n')
}

function emitSolutions(stage, slot, layout) {
  const lines = []
  let n = 1
  for (const sec of layout.sections) {
    for (const item of sec.items) {
      lines.push(
        `      ${n}: s('${esc(item.evidence)}', '${esc(item.questionKeyword || item.prompt)}', '${esc(item.thaiMeaning || '')}'),`
      )
      n += 1
    }
  }
  return lines.join('\n')
}

function emitFillBlank(stage, slot, exam, layout) {
  const fillSection = layout.sections.find((s) => s.key === 'fill')
  if (!fillSection?.items.length) return null
  const passage = exam.parsedPayload.passages[0]
  const start = fillSection.items[0]
    ? passage.questions.find((q) => q.prompt === fillSection.items[0].prompt)?.number
    : null
  const range = passage.questionRanges?.find((r) => {
    const qs = passage.questions.filter((q) => q.number >= r.start && q.number <= r.end)
    return qs.every((q) => q.answerType === 'text')
  })
  if (!range) return null

  const startNum = slot === 1 ? range.start : range.start - 13 + 15
  const endNum = slot === 1 ? range.end : range.end - 13 + 15

  const summaryLines = fillSection.items.map((item, i) => {
    const num = startNum + i
    const line = item.prompt.replace(/…+/g, `{${num}}`).slice(0, 120)
    return `      { type: 'bullet', text: ${JSON.stringify(line)} },`
  })

  return `  {
    examId: "journey-normal-stage-${stage}",
    passageNumber: ${slot},
    startNumber: ${startNum},
    endNumber: ${endNum},
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions ${startNum}–${endNum}",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes ${startNum}–${endNum} on your answer sheet."
    ],
    summaryTitle: "${esc(layout.title)}",
    summaryLines: [
${summaryLines.join('\n')}
    ],
    questions: [
${fillSection.items
  .map((item, i) => {
    const num = startNum + i
    return `      { number: ${num}, answer: ${JSON.stringify(item.answer)}, passageKeyword: ${JSON.stringify(item.passageKeyword)}, questionKeyword: ${JSON.stringify(item.questionKeyword)}, thaiMeaning: ${JSON.stringify(item.thaiMeaning)}, exactPortion: ${JSON.stringify(item.evidence)} }`
  })
  .join(',\n')}
    ]
  }`
}

// Build all layouts
const layoutsByStage = {}
const examsByStage = {}
for (const [stage, ids] of Object.entries(STAGE_SOURCES)) {
  layoutsByStage[stage] = []
  examsByStage[stage] = []
  for (const id of ids) {
    const exam = pool.find((e) => e.id === id)
    if (!exam) throw new Error(`Missing exam ${id}`)
    layoutsByStage[stage].push(buildLayout(exam))
    examsByStage[stage].push(exam)
  }
}

// Verify 13 questions each
for (const [stage, layouts] of Object.entries(layoutsByStage)) {
  layouts.forEach((layout, i) => {
    const count = layout.sections.reduce((s, sec) => s + sec.items.length, 0)
    if (count !== 13) {
      console.warn(`WARN stage ${stage} passage ${i + 1}: ${count} questions (expected 13)`)
    }
  })
}

const needsYnngP2 = Object.values(layoutsByStage).some((layouts) =>
  layouts.some((layout, i) => i === 1 && layout.sections.some((s) => s.key === 'ynng'))
)
const needsHeadings = Object.values(layoutsByStage).some((layouts) =>
  layouts.some((layout) => layout.sections.some((s) => s.key === 'headings'))
)
const needsTfngP2 = Object.values(layoutsByStage).some((layouts) =>
  layouts.some((layout, i) => i === 1 && layout.sections.some((s) => s.key === 'tfng'))
)
const needsYnngP1 = Object.values(layoutsByStage).some((layouts) =>
  layouts.some((layout, i) => i === 0 && layout.sections.some((s) => s.key === 'ynng'))
)

const passagesOut = []
passagesOut.push(`/**
 * Normal Reading Journey ด่าน 8–12 — Cambridge 14 (tests 2–4) + Cambridge 15 (tests 1–2).
 * Source: ieltstrainingonline.com (P1 + P2 only per stage).
 */
import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const tfng = (items: IntensiveQuestionSpec[]) => ({
  instruction: 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE or NOT GIVEN.',
  items
})
${needsTfngP2 ? `const tfngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction: 'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE or NOT GIVEN.',
  items
})
` : ''}${needsYnngP1 ? `const ynng = (items: IntensiveQuestionSpec[]) => ({
  instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 1? Write YES, NO or NOT GIVEN.',
  items
})
` : ''}const THEORIES_A_B_C = ['A Hamiltonian', 'B Jeffersonian', 'C Jacksonian']
const fillBlock = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})
const fillNotes = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})
${needsHeadings ? `const headingBlock = (options: string[], items: IntensiveQuestionSpec[]) => ({
  instruction: 'Choose the correct heading for each paragraph from the list below.',
  options,
  items
})
` : ''}
const matchingPeopleBlock = (people: string[], items: IntensiveQuestionSpec[]) => ({
  instruction: 'Look at the following statements and the list of people below. Match each statement with the correct person, A–G.',
  people,
  items
})
const matchingInfoBlock = (endLetter: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Which section contains the following information? Write A–' + endLetter + '.',
  items
})
const q = (
  prompt: string,
  answer: string,
  evidence: string,
  meta?: Partial<IntensiveQuestionSpec>
): IntensiveQuestionSpec => ({ prompt, answer, evidence, ...meta })

`)

for (const [stage, layouts] of Object.entries(layoutsByStage)) {
    layouts.forEach((layout, i) => {
    passagesOut.push(emitLayout(Number(stage), i + 1, layout, examsByStage[stage][i]))
    passagesOut.push('')
  })
}

passagesOut.push(`export const INTENSIVE_LAYOUTS_STAGE_8_12: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
`)
for (const stage of Object.keys(STAGE_SOURCES)) {
  passagesOut.push(`  ${stage}: [stage${stage}Passage1, stage${stage}Passage2],`)
}
passagesOut.push(`}\n`)

fs.writeFileSync(path.join(root, 'src/journeyIntensivePassages8to12.ts'), passagesOut.join('\n'))

// Solutions file
const solLines = []
solLines.push(`import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'
const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword, questionKeyword, thaiMeaning
})
export const INTENSIVE_SOLUTIONS_STAGE_8_12: Record<number, { 1: Record<number, IntensiveQuestionSolution>; 2: Record<number, IntensiveQuestionSolution> }> = {
`)
for (const [stage, layouts] of Object.entries(layoutsByStage)) {
  solLines.push(`  ${stage}: {`)
  layouts.forEach((layout, i) => {
    solLines.push(`    ${i + 1}: {`)
    solLines.push(emitSolutions(Number(stage), i + 1, layout))
    solLines.push(`    },`)
  })
  solLines.push(`  },`)
}
solLines.push(`}\n`)
fs.writeFileSync(path.join(root, 'src/intensiveJourneyQuestionSolutions8to12.ts'), solLines.join('\n'))

// Fill blank
const fillLines = []
fillLines.push(`import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_8_12: NewFillBlankSet[] = [
`)
for (const [stage, layouts] of Object.entries(layoutsByStage)) {
  layouts.forEach((layout, i) => {
    const exam = examsByStage[stage][i]
    const block = emitFillBlank(Number(stage), i + 1, exam, layout)
    if (block) fillLines.push(block + ',')
  })
}
fillLines.push(`]\n`)
fs.writeFileSync(path.join(root, 'src/intensiveJourneyFillBlankStages8to12.ts'), fillLines.join('\n'))

console.log('Wrote journeyIntensivePassages8to12.ts, intensiveJourneyQuestionSolutions8to12.ts, intensiveJourneyFillBlankStages8to12.ts')
