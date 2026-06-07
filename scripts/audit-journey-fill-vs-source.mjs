#!/usr/bin/env node
/**
 * Compare intensive journey fill-blank overrides against Cambridge source question files.
 *
 * Run: npx tsx scripts/audit-journey-fill-vs-source.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'
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
  17: ['cambridge-18-test4-passage1', 'cambridge-18-test4-passage2'],
  18: ['cambridge-18-test3-passage1', null],
  19: ['cambridge-18-test4-passage1', 'cambridge-11-test2-passage1'],
  20: ['cambridge-19-test1-passage1', 'cambridge-15-test3-passage2']
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
Rani Ki Vav | Late 11th century | As many as 500 sculptures decorate the monument | Restored in the 1990s. Excellent condition, despite the 9 … of 2001.
Surya Kund | 1026 | Steps on the 10 … produce a geometric pattern | Carved shrines. Looks more like a 11 … than a well.
Raniji Ki Baori | 1699 | Intricately carved monument | One of 21 baoris in the area commissioned by Queen Nathavatji
Chand Baori | 850 AD | Steps take you down 11 storeys to the bottom | Old, deep and very dramatic. Has 12 … which provide a view to the steps.
Neemrana Ki Baori | 1700 | Has two 13 … levels | Used by public today`,

  'cambridge-11-test1-passage2|20-26': `Questions 20-26
Label the diagram below.
Choose ONE WORD from the passage for each answer.
Write your answers in boxes 20-26 on your answer sheet.

How a boat is lifted on the Falkirk Wheel
A pair of 20 … are lifted in order to shut out water from canal basin
A 21 … is taken out, enabling Wheel to rotate
Hydraulic motors drive 22 …
A range of different-sized 23 … ensures boat keeps upright
Boat reaches top Wheel, then moves directly onto 24 …
Boat travels through tunnel beneath Roman 25 …
26 … raise boat 11 m to level of Union Canal`,

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

Making buildings with wood
Wood is a traditional building material, but current environmental concerns are encouraging 5 … to use wood in modern construction projects. Using wood, however, has its challenges. For example, as 6 … in the atmosphere enters wood, it increases in size. In addition, wood is prone to pests and the risk of fire is greater. However, wood can be turned into a better construction material if it is treated and combined with other materials. In one process, 7 … of solid wood are glued together to create building blocks. These blocks are lighter than concrete and steel but equal them in strength. Experts say that wooden buildings are an improvement on those made of concrete and steel in terms of the 8 … with which they can be constructed and how much noise is generated by the process.`,

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

  'cambridge-16-test4-passage1|1-9': `Questions 1-6
Label the diagrams below.
Choose ONE WORD ONLY from the passage for each answer.

The Persian Qanat Method
1 … placed over a hill in a straight line to direct water into a 2 …
vertical shafts to remove earth and provide 3 …

Cross-section of a Roman Qanat Shaft
4 … made of wood or stone
5 … attached to the plumb line
handholds and footholds used for 6 …

Questions 7-9
Answer the questions below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
7 What type of mineral were the Dolaucothi mines in Wales built to extract?
8 In addition to the patron, whose name might be carved onto a tunnel?
9 What part of Seleuceia Pieria was the Cevlik tunnel built to protect?`,

  'cambridge-10-test2-passage2|23-26': `Questions 23-26
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 23-26 on your answer sheet.

One study found a strong connection between children's IQ and the availability of 23 … and … at home.
Children of average ability seem to need more direction from teachers because they do not have 24 … .
Meta-cognition involves children understanding their own learning strategies, as well as developing 25 … .
Teachers who rely on what is known as 26 … often produce sets of impressive grades in class tests.`,

  'cambridge-10-test3-passage1|11-13': `Questions 11-13
Complete the sentences below.
Choose NO MORE THAN THREE WORDS from the passage for each answer.
Write your answers in boxes 11-13 on your answer sheet.

11 In Greece, tourism the most important … .
12 The travel and tourism industry in Jamaica is the major … .
13 The problems associated with measuring international tourism are often reflected in the measurement of … .`,

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
1 Some food plants, including 1 … , are already grown indoors.
2 Vertical farms would be located in 2 … , meaning that there would be less need to take them long distances to customers.
3 Vertical farms could use methane from plants and animals to produce 3 … .
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
Among the benefits are saving on 6 … costs, mitigating the risk of floods, making habitats for urban wildlife, tackling air pollution and even growing 7 …. Doctors are increasingly prescribing time spent 8 … outdoors for patients dealing with anxiety and depression. And research has found that access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid 9 …`,

  'cambridge-16-test1-passage2|21-24': `Questions 21-24
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 21-24 on your answer sheet.

The Step Pyramid of Djoser
The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian 21 … of the past. The area outside the pyramid included accommodation that was occupied by 22 …, along with many other buildings and features.
A wall ran around the outside of the complex and a number of false entrances were built into this. In addition, a long 23 … encircled the wall. As a result, any visitors who had not been invited were cleverly prevented from entering the pyramid grounds unless they knew the 24 … of the real entrance.`,

  'cambridge-17-test1-passage1|1-6': `Questions 1-6
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-6 on your answer sheet.

The London underground railway
The problem
• The 1 … of London increased rapidly between 1800 and 1850
• The streets were full of horse-drawn vehicles
The proposed solution
• Charles Pearson, a solicitor, suggested building an underground railway
• Building the railway would make it possible to move people to better housing in the 2 …
• A number of 3 … agreed with Pearson's idea
• The company initially had problems getting the 4 … needed for the project
• Negative articles about the project appeared in the 5 …
The construction
• The chosen route did not require many buildings to be pulled down
• The 'cut and cover' method was used to construct the tunnels
• With the completion of the brick arch, the tunnel was covered with 6 …`,

  'cambridge-17-test3-passage1|1-5': `Questions 1-5
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-5 on your answer sheet.

The thylacine
Appearance and behaviour
• looked rather like a dog
• had a series of stripes along its body and tail
• ate an entirely 1 … diet
• probably depended mainly on 2 … when hunting
• young spent first months of life inside its mother's 3 …
Decline and extinction
• last evidence in mainland Australia is a 3,100-year-old 4 …
• probably went extinct in mainland Australia due to animals known as dingoes
• reduction in 5 … and available sources of food were partly responsible for decline in Tasmania`,

  'cambridge-17-test2-passage2|24-26': `Questions 24-26
Complete the sentences below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 24-26 on your answer sheet.

24 An undesirable trait such as loss of … may be caused by a mutation in a tomato gene.
25 By modifying one gene in a tomato plant, researchers made the tomato three times its original …
26 A type of tomato which was not badly affected by … and was rich in vitamin C was produced by a team of researchers in China.`,

  'cambridge-18-test2-passage1|1-8': `Questions 1-8
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-8 on your answer sheet.
1 the ditch and henge were dug, possibly using tools made from … …
2 … … may have been arranged in deep pits inside the circle
3 builders used … … to make sledges and rollers
4 … … pulled them on giant baskets
5 they were brought from Wales by … …
6 a theory arose in the 17th century that its builders were Celtic … …
7 many experts agree it has been used as a … … site
8 in the 1960s, it was suggested that it worked as a … …`,

  'cambridge-16-test2-passage1|9-13': `Questions 9-13
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 9-13 on your answer sheet.

The Uffington White Horse
Location of the Uffington White Horse:
9 near an ancient road known as the …………………
Dating:
10 first reference to White Horse Hill appears in ………………… from the 1070s
11 according to analysis of the surrounding …………………, the Horse is Late Bronze Age / Early Iron Age
Possible reasons for creation of the Uffington White Horse:
12 was a representation of goddess Epona – associated with protection of horses and …………………
13 was a representation of a Welsh goddess called …………………`,

  'cambridge-16-test3-passage1|6-13': `Questions 6-13
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 6-13 on your answer sheet.

Warships and merchant ships
Warships were designed so that they were … and moved quickly. They often remained afloat after battles and were able to sail close to land as they lacked any additional weight. A battering ram made of … was included in the design for attacking and damaging the timber and oars of enemy ships. Warships, such as the 'trireme', had rowers on three different … .
Unlike warships, merchant ships had a broad … that lay far below the surface of the sea. Merchant ships were steered through the water with the help of large rudders and a tiller bar. They had both square and … sails. On merchant ships and warships, … was used to ensure rowers moved their oars in and out of the water at the same time.
Quantities of agricultural goods such as … were transported by merchant ships to two main ports in Italy. The ships were pulled to the shore by … . When the weather was clear and they could see islands or land, sailors used landmarks that they knew to help them navigate their route.`,

  'cambridge-11-test2-passage1|9-13': `Questions 9-13
Label the diagram below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 9-13 on your answer sheet.

Raising the hull of the Mary Rose: Stages one and two
9 … attached to hull by a network of bolts and lifting wires
10 … used to prevent the hull being sucked back downwards into the mud
11 … — guides that the legs of the lifting frame are located into
12 … — structure the hull is transferred into underwater
13 … used as extra protection for the hull`,

  'cambridge-19-test1-passage1|8-13': `Questions 8-13
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 8-13 on your answer sheet.

The tennis racket and how it has changed
Mike and Bob Bryan made changes to the types of … used on their racket frames.
Players were not allowed to use the spaghetti-strung racket because of the amount of … it created.
Changes to rackets can be regarded as being as important as players' diets or the … they do.
All rackets used to have natural strings made from the … of animals.
Pete Sampras had metal … put into the frames of his rackets.
Gonçalo Oliveira changed the … on his racket handles.`,

  'cambridge-15-test3-passage2|21-26': `Questions 21-26
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 21-26 on your answer sheet.

How the Desolenator works
The energy required to operate the Desolenator comes from sunlight. The device can be used in different locations, as it has … . Water is fed into a pipe, and a … of water flows over a solar panel. The water then enters a boiler, where it turns into steam. Any particles in the water are caught in a … . The purified water comes out through one tube, and all types of … come out through another. A screen displays the … of the device, and transmits the information to the company so that they know when the Desolenator requires … .`
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
  for (const book of [10, 11, 15, 16, 17, 18, 19]) {
    const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
    const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
    pool.push(...mod[key])
  }
  return pool
}

const answerKey = (q) => String(q?.correctAnswer || q?.answer || '').trim().toLowerCase()

const pool = await loadServerExams()
const journeyRecords = buildJourneyExamRecords(pool, 20, 20)
const issues = []

for (const set of INTENSIVE_JOURNEY_FILL_BLANK_SETS) {
  const stageMatch = set.examId.match(/journey-normal-stage-(\d+)/)
  if (!stageMatch) continue
  const stage = Number(stageMatch[1])
  if (stage > 20) continue

  const sources = STAGE_SOURCES[stage]
  if (!sources) continue
  const sourceExamId = sources[set.passageNumber - 1]
  if (!sourceExamId) continue

  const journeyExam =
    stage <= 17
      ? buildIntensiveJourneyExam(stage)
      : journeyRecords.find((e) => e.id === `journey-normal-stage-${stage}`)
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
    ...(set.summaryLines || []).map((l) => {
      if (l.type === 'table-header' || l.type === 'table-row') return (l.cells || []).join(' ')
      if (l.type === 'diagram') return ''
      return l.text || ''
    }),
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
