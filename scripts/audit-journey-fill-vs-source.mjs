#!/usr/bin/env node
/**
 * Compare intensive journey fill-blank overrides against Cambridge source question files.
 *
 * Run: npx tsx scripts/audit-journey-fill-vs-source.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import { READING_QUESTION_SECTION_OVERRIDES } from './reading-question-section-overrides.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const STAGE_SOURCES = {
  1: ['cambridge-10-test1-passage1', 'cambridge-10-test1-passage2'],
  2: ['cambridge-10-test2-passage1', 'cambridge-10-test2-passage2'],
  3: ['cambridge-10-test3-passage1', 'cambridge-10-test3-passage2'],
  4: ['cambridge-10-test4-passage1', 'cambridge-10-test4-passage2'],
  5: ['cambridge-11-test1-passage1', 'cambridge-11-test1-passage2'],
  6: ['cambridge-16-test1-passage1', 'cambridge-16-test1-passage2'],
  13: ['cambridge-16-test2-passage1', 'cambridge-16-test2-passage2'],
  14: ['cambridge-16-test3-passage1', 'cambridge-16-test3-passage2'],
  15: ['cambridge-16-test4-passage1', 'cambridge-16-test4-passage2'],
  7: ['cambridge-17-test1-passage1', 'cambridge-17-test1-passage2'],
  8: ['cambridge-17-test2-passage1', 'cambridge-17-test2-passage2'],
  9: ['cambridge-17-test3-passage1', 'cambridge-17-test3-passage2'],
  10: ['cambridge-17-test4-passage1', 'cambridge-17-test4-passage2'],
  11: ['cambridge-18-test1-passage1', 'cambridge-18-test1-passage2'],
  12: ['cambridge-18-test2-passage1', 'cambridge-18-test2-passage2'],
  16: ['cambridge-18-test3-passage1', 'cambridge-18-test3-passage2'],
  17: ['cambridge-18-test4-passage1', 'cambridge-18-test4-passage2']
}

/** Hand-curated Cambridge fill blocks where OCR txt is garbled or missing (Cam 10, 18). */
const MANUAL_SOURCE_FILL = {
  'cambridge-10-test1-passage1|6-13': `Questions 6-8
Answer the questions below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 6-8 on your answer sheet.
6 Which part of some stepwells provided shade for people?
7 What type of serious climatic event, which took place in southern Rajasthan, is mentioned in the article?
8 Who are frequent visitors to stepwells nowadays?

Questions 9-13
Complete the table below.
Choose ONE WORD AND/OR A NUMBER from the passage for each answer.
Write your answers in boxes 9-13 on your answer sheet.

Stepwells
Rani Ki Vav | Features: Incredibly, in January 2001, this ancient structure survived a devastating 9 … that measured 7.6 on the Richter scale.
Surya Kund | Features: Steps on the 10 … produce a geometrical pattern. | Other notes: Looks more like a 11 … than a well.
Raniji Ki Baori | Features: On the fourth side, 12 … which provide a view of the steps. | Other notes: Has two 13 … levels`,

  'cambridge-17-test1-passage2|18-22': `Questions 18-22
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 18-22 on your answer sheet.

Roman amphitheatres
The Roman stadiums of Europe have proved very versatile. The amphitheatre of Arles, for example, was converted first into a 18 …, then into a residential area and finally into an arena where spectators could watch 19 … Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where 20 … is performed. The site of Lucca's amphitheatre has also been used for many purposes over the centuries, including the storage of 21 … It is now a market square with 22 … and homes incorporated into the remains of the Roman amphitheatre.`,

  'cambridge-16-test3-passage2|20-22': `Questions 20-22
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 20-22 on your answer sheet.

Interesting finds at an archaeological site
Organic materials such as animal skins and textiles are not discovered very often at archaeological sites. They have little protection against 20 … which means that they decay relatively quickly. But this is not always the case. If temperatures are low enough, fragile artefacts can be preserved for thousands of years.
A team of archaeologists have been working in the mountains in Oppland in Norway to recover artefacts revealed by shrinking ice cover. In the past, there were trade routes through these mountains and 21 … gathered there in the summer months to avoid being attacked by 22 … on lower ground.`,

  'cambridge-18-test1-passage1|1-7': `Questions 1-3
Complete the summary below.
Choose ONE WORD AND/OR A NUMBER from the passage for each answer.
Write your answers in boxes 1-3 on your answer sheet.

Urban farming in Paris
Vertical tubes are used to grow strawberries, 1 … and herbs.
There will eventually be a daily harvest of as much as 2 … in weight of fruit and vegetables.
It may be possible that the farm's produce will account for as much as 10% of the city's 3 … overall.

Questions 4-7
Complete the table below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 4-7 on your answer sheet.

Intensive farming versus aeroponic urban farming
Intensive farming – Growth: wide range of 4 … used
Intensive farming – Selection: varieties chosen that can survive long 5 …
Intensive farming – Sale: 6 … receive very little of overall income
Aeroponic urban farming – Selection: produce chosen because of its 7 …`,

  'cambridge-18-test3-passage1|5-8': `Questions 5-8
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 5-8 on your answer sheet.

Materials to take us beyond concrete
Concrete is one of the world's most common construction materials and one of its biggest sources of greenhouse gas emissions. But climate change is driving 5 … to turn to treated timber as a possible resource. Wood expands as it absorbs 6 … from the air and is susceptible to pests, not to mention fire. An adhesive is used to stick 7 … of solid-sawn timber together, crosswise, to form building blocks. Construction experts say that wooden buildings can be constructed at a greater 8 … than ones of concrete and steel and the process, it seems, is quieter.`,

  'cambridge-18-test3-passage2|24-26': `Questions 24-26
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 24-26 on your answer sheet.

The steam car
With these enhancements, the Dobles' new car company promised a steam vehicle which would provide all of the convenience of a gasoline car, but with much greater 24 …, much simpler driving controls, and a virtually silent powerplant, while keeping its emissions extremely low. The steam car was too expensive for many people and its design was constantly being altered. By the time the company folded in 1931, fewer than 25 … of the amazing Model E steam cars had been produced. Astonishingly, an unmodified Doble Model E runs clean enough to pass the emissions laws in California today, and they are pretty 26 …`,

  'cambridge-16-test4-passage1|1-13': `Questions 1-6
Label the diagrams below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-6 on your answer sheet.

The Persian Qanat Method
1 … placed over a hill in a straight line to direct water into a 2 …
vertical shafts to remove earth and provide 3 …

Cross-section of a Roman Qanat Shaft
4 … made of wood or stone
5 … attached to the plumb line
handholds and footholds used for 6 …

Questions 11-13
Answer the questions below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 11-13 on your answer sheet.
11 What type of mineral were the Dolaucothi mines in Wales built to extract?
12 In addition to the patron, whose name might be carved onto a tunnel?
13 What part of Seleuceia Pieria was the Cevlik tunnel built to protect?`,

  'cambridge-10-test2-passage2|23-26': `Questions 23-26
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 23-26 on your answer sheet.

Gifted children and learning
One study found that the higher the children's IQ scores, especially over 130, the better the quality of their educational backup, measured in terms of reported verbal interactions with parents, number of books and 23 … in the home.
Children of average ability seem to need more direction from teachers because they do not have 24 … .
Meta-cognition involves children understanding their own learning strategies, as well as developing 25 … .
Although 26 … can produce impressive results in class tests, this style of teaching does not develop children's self-regulation.`,

  'cambridge-10-test3-passage1|11-13': `Questions 11-13
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 11-13 on your answer sheet.

The Context, Meaning and Scope of Tourism
For example, tourism is the major source of 11 … in Bermuda, Greece, Italy, Spain, Switzerland and most Caribbean countries. The World Travel and Tourism Council (WTTC) suggest that the travel and tourism industry is the number one ranked 12 … in the Bahamas, Brazil, Canada, France, (the former) West Germany, Hong Kong, Italy, Jamaica, Japan, Singapore, the United Kingdom and the United States. In many cases, similar difficulties arise when attempts are made to measure 13 … .`,

  'cambridge-10-test3-passage2|19-22': `Questions 19-22
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 19-22 on your answer sheet.

Autumn leaves
The most vividly coloured red leaves are found on the side of the tree facing the 19 … .
The 20 … surfaces of leaves contain the most red pigment.
Red leaves are most abundant when daytime weather conditions are 21 … and sunny.
The intensity of the red colour of leaves increases as you go further 22 … .`,

  'cambridge-10-test4-passage1|1-6': `Questions 1-6
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-6 on your answer sheet.

The megafires of California
Wildfires now 1 … more unpredictably than in the past.
Megafires are 2 … times the size of the average forest fire of 20 years ago.
The region has had significantly 3 … normal precipitation in recent years.
Stopping wildfires quickly has left more brush to act as 4 … for megafires.
Fire 5 … are on average 78 days longer than they were 20 years ago.
There is increased 6 … in vulnerable wooded areas.`,

  'cambridge-10-test4-passage2|14-18': `Questions 14-18
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 14-18 on your answer sheet.

Second nature
Psychologists have long held that a person's character cannot undergo a 14 … in any meaningful way and that the key traits of personality are determined at a very 15 … .
Some qualities are less challenging to develop than others, 16 … being one of them.
However, developing qualities requires mastering a range of 17 … which are diverse and sometimes surprising.
For example, to bring more joy and passion into your life, you must be open to experiencing negative 18 … .`,

  'cambridge-11-test1-passage1|1-7': `Questions 1-7
Complete the sentences below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 1-7 on your answer sheet.

Indoor farming
1 Some food plants, including 1 …, are already grown indoors.
2 Vertical farms would be located in 2 …, meaning that there would be less need to take them long distances to customers.
3 Vertical farms could use methane from plants and animals to produce 3 ….
4 The consumption of 4 … would be cut because agricultural vehicles would be unnecessary.
5 The fact that vertical farms would need 5 … light is a disadvantage.
6 One form of vertical farming involves planting in 6 … which are not fixed.
7 The most probable development is that food will be grown on 7 … in towns and cities.`,

  'cambridge-18-test1-passage2|22-26': `Questions 22-26
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 22-26 on your answer sheet.

Forest management in Pennsylvania, USA
Some dead wood is removed to avoid the possibility of 22 … .
The 23 … from the tops of cut trees can help improve soil quality.
Some damaged trees should be left, as their 24 … provide habitats for insect predators like woodpeckers, bats and small mammals.
For example, many species like 25 … provide food for wildlife.
Finally, 26 … species of trees in a forest should also stay behind as they add to its structural diversity.`,

  'cambridge-18-test4-passage1|6-9': `Questions 6-9
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 6-9 on your answer sheet.

Green roofs
Among the benefits are saving on 6 … costs, mitigating the risk of floods, making habitats for urban wildlife, tackling air pollution and even growing 7 …. Doctors are increasingly prescribing time spent 8 … outdoors for patients dealing with anxiety and depression. And research has found that access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid 9 …`
}

const norm = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[\u2013\u2014–—]/g, ' ')
    .replace(/\{(\d+)\}/g, ' $1 ')
    .replace(/\d+\s*[.…⋯]+/g, ' ___ ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenOverlap = (a, b) => {
  const aw = norm(a).split(' ').filter((w) => w.length > 2 && w !== '___')
  const bs = new Set(norm(b).split(' ').filter((w) => w.length > 2 && w !== '___'))
  if (!aw.length) return 0
  return aw.filter((w) => bs.has(w)).length / aw.length
}

const resolveQuestionPath = (examId) => {
  const match = examId.match(/^cambridge-(\d+)-test(\d+)-passage(\d+)$/)
  if (!match) return null
  const [, book, test, passage] = match
  return path.join(__dirname, `cambridge-${book}-questions`, `t${test}p${passage}.txt`)
}

const loadSourceQuestionText = (examId) => {
  if (READING_QUESTION_SECTION_OVERRIDES[examId]) {
    return READING_QUESTION_SECTION_OVERRIDES[examId]
  }
  const filePath = resolveQuestionPath(examId)
  if (filePath && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8')
  }
  return ''
}

const extractFillBlock = (text, sourceStart, sourceEnd) => {
  const source = String(text || '')
  const blocks = source.split(/(?=Questions?\s+\d+)/i).map((b) => b.trim()).filter(Boolean)

  for (const block of blocks) {
    const header = block.match(/Questions?\s+(\d+)\s*[–-]\s*(\d+)/i)
    if (!header) continue
    const bStart = Number(header[1])
    const bEnd = Number(header[2])
    const isFill =
      /complete the (summary|notes|table|sentences)|answer the questions|label the diagram/i.test(block)
    if (!isFill) continue
    if (bStart <= sourceStart && bEnd >= sourceEnd) return block
    if (bStart === sourceStart && bEnd === sourceEnd) return block
    if (bStart <= sourceStart && bEnd >= sourceStart && bEnd <= sourceEnd + 2) return block
  }
  return ''
}

const remapBlanks = (text, delta) =>
  String(text || '').replace(/\b(\d{1,2})\s*[.…⋯]+/g, (_, n) => `{${Number(n) + delta}}`)

const skeleton = (text) => norm(text).replace(/\b\d+\b/g, '___')

const loadServerExams = async () => {
  const pool = []
  for (const book of [10, 11, 16, 17, 18]) {
    const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
    const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
    pool.push(...mod[key])
  }
  return pool
}

const answerKey = (q) => String(q?.correctAnswer || q?.answer || '').trim().toLowerCase()

const pool = await loadServerExams()
const issues = []

for (const set of INTENSIVE_JOURNEY_FILL_BLANK_SETS) {
  const stageMatch = set.examId.match(/journey-normal-stage-(\d+)/)
  if (!stageMatch) continue
  const stage = Number(stageMatch[1])
  if (stage > 17) continue

  const sources = STAGE_SOURCES[stage]
  if (!sources) continue
  const sourceExamId = sources[set.passageNumber - 1]
  if (!sourceExamId) continue

  const journeyExam = buildIntensiveJourneyExam(stage)
  const journeyPassage = journeyExam?.parsedPayload?.passages?.find((p) => p.number === set.passageNumber)
  if (!journeyPassage) continue

  const journeyFillQs = journeyPassage.questions.filter(
    (q) => q.answerType === 'text' && q.number >= set.startNumber && q.number <= set.endNumber
  )
  const sourceExam = pool.find((e) => e.id === sourceExamId)
  const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
  if (!sourcePassage) continue

  const sourceNumbers = []
  for (const jq of journeyFillQs) {
    const ja = answerKey(jq)
    const match = sourcePassage.questions.find((sq) => {
      if (sq.answerType !== 'text') return false
      const sa = answerKey(sq)
      if (sa === ja) return true
      const accepted = (sq.acceptedAnswers || []).map((a) => String(a).toLowerCase())
      return accepted.includes(ja)
    })
    if (match) sourceNumbers.push(match.number)
  }

  if (sourceNumbers.length !== journeyFillQs.length) {
    issues.push({
      stage,
      passage: set.passageNumber,
      range: `${set.startNumber}-${set.endNumber}`,
      issue: 'SOURCE_MATCH_FAILED',
      detail: `Matched ${sourceNumbers.length}/${journeyFillQs.length} answers for ${sourceExamId}`
    })
    continue
  }

  const sourceStart = Math.min(...sourceNumbers)
  const sourceEnd = Math.max(...sourceNumbers)
  const delta = set.startNumber - sourceStart

  const manualKey = `${sourceExamId}|${sourceStart}-${sourceEnd}`
  let fillBlock = MANUAL_SOURCE_FILL[manualKey]
  if (!fillBlock) {
    const questionText = loadSourceQuestionText(sourceExamId)
    fillBlock = extractFillBlock(questionText, sourceStart, sourceEnd)
  }

  if (!fillBlock) {
    issues.push({
      stage,
      passage: set.passageNumber,
      range: `${set.startNumber}-${set.endNumber}`,
      issue: 'NO_SOURCE_BLOCK',
      detail: `${sourceExamId} Q${sourceStart}-${sourceEnd}`
    })
    continue
  }

  const remappedSource = remapBlanks(fillBlock, delta)
  const overrideText = [
    set.summaryTitle || '',
    ...(set.summaryLines || []).map((l) => l.text || ''),
    ...(set.instructions || [])
  ].join(' ')

  const overlap = tokenOverlap(overrideText, remappedSource)
  const evidenceOverlap = set.questions.reduce((sum, q) => {
    const line =
      set.summaryLines.find((l) => (l.text || '').includes(`{${q.number}}`))?.text || overrideText
    return sum + tokenOverlap(line, q.exactPortion || '')
  }, 0) / Math.max(set.questions.length, 1)

  const status = overlap >= 0.55 ? 'OK' : evidenceOverlap > 0.45 && overlap < 0.45 ? 'EVIDENCE' : 'MISMATCH'

  if (status === 'OK') {
    console.log(
      `OK   stage ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber} (${Math.round(overlap * 100)}% match) "${set.summaryTitle?.slice(0, 40)}"`
    )
  } else {
    issues.push({
      stage,
      passage: set.passageNumber,
      range: `${set.startNumber}-${set.endNumber}`,
      issue: status,
      overlap: Math.round(overlap * 100),
      evidenceOverlap: Math.round(evidenceOverlap * 100),
      title: set.summaryTitle,
      sourceExamId,
      sourceRange: `${sourceStart}-${sourceEnd}`,
      sampleOverride: overrideText.slice(0, 100),
      sampleSource: remappedSource.replace(/\s+/g, ' ').slice(0, 120)
    })
  }
}

console.log('\n=== ISSUES ===')
for (const i of issues) {
  console.log(`[${i.issue}] stage ${i.stage} P${i.passage} Q${i.range} (${i.overlap ?? '-'}% vs source, ${i.evidenceOverlap ?? '-'}% evidence)`)
  if (i.title) console.log(`  title: ${i.title}`)
  if (i.detail) console.log(`  ${i.detail}`)
  else console.log(`  source: ${i.sourceExamId} Q${i.sourceRange}`)
  if (i.sampleOverride) console.log(`  override: ${i.sampleOverride}…`)
  if (i.sampleSource) console.log(`  cambridge: ${i.sampleSource}…`)
  console.log()
}
console.log(`Total issues: ${issues.length}`)
