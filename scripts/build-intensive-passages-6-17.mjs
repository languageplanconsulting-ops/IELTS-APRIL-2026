#!/usr/bin/env node
/**
 * Generate intensive journey ด่าน 6, 7–12, 13–15, 16–17 from Cambridge 16–18 (P1+P2 per test).
 * Source: ieltstrainingonline.com practice pages (stored in server/*.mjs).
 * Order: 6→16T1, 13–15→16T2–4, 7–12→17T1–4 + 18T1–2, 16–17→18T3–4.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** Fixed paragraph splits when scrape merged intro lines or dropped letters. */
const PARAGRAPH_OVERRIDES = {
  'cambridge-18-test2-passage2': [
    [
      'A',
      "Powerful artificial intelligence (AI) needs to be reliably aligned with human values, but does this mean AI will eventually have to police those values?"
    ],
    [
      'B',
      "This has been the decade of AI, with one astonishing feat after another. A chess-playing AI that can defeat not only all human chess players, but also all previous human-programmed chess machines, after learning the game in just four hours? That's yesterday's news, what's next? True, these prodigious accomplishments are all in so-called narrow AI, where machines perform highly specialised tasks. But many experts believe this restriction is very temporary. By mid-century, we may have artificial general intelligence (AGI) – machines that can achieve human-level performance on the full range of tasks that we ourselves can tackle."
    ],
    [
      'C',
      "If so, there's little reason to think it will stop there. Machines will be free of many of the physical constraints on human intelligence. Our brains run at slow biochemical processing speeds on the power of a light bulb, and their size is restricted by the dimensions of the human birth canal. It is remarkable what they accomplish, given these handicaps. But they may be as far from the physical limits of thought as our eyes are from the incredibly powerful Webb Space Telescope."
    ],
    [
      'D',
      "Once machines are better than us at designing even smarter machines, progress towards these limits could accelerate. What would this mean for us? Could we ensure a safe and worthwhile coexistence with such machines? On the plus side, AI is already useful and profitable for many things, and super AI might be expected to be super useful and super profitable. But the more powerful AI becomes, the more important it will be to specify its goals with great care. Folklore is full of tales of people who ask for the wrong thing, with disastrous consequences- King Midas, for example, might have wished that everything he touched turned to gold, but didn't really intend this to apply to his breakfast."
    ],
    [
      'E',
      "So we need to create powerful AI machines that are 'human-friendly'- that have goals reliably aligned with our own values. One thing that makes this task difficult is that we are far from reliably human-friendly ourselves. We do many terrible things to each other and to many other creatures with whom we share the planet. If superintendent machines don't do a lot better than us, we'll be in deep trouble. We'll have powerful new intelligence amplifying the dark sides of our own fallible natures."
    ],
    [
      'F',
      "For safety's sake, then, we want the machines to be ethically as well as cognitively superhuman. We want them to aim for the moral high ground, not for the troughs in which many of us spend some of our time. Luckily they'll be smart enough for the job. If there are routes to the moral high ground, they'll be better than us at finding them, and steering us in the right direction."
    ],
    [
      'G',
      "However, there are two big problems with this utopian vision. One is how we get the machines started on the journey, the other is what it would mean to reach this destination. The 'getting started' problem is that we need to tell the machines what they're looking for with sufficient clarity that we can be confident they will find it – whatever 'it' actually turns out to be. This won't be easy, given that we are tribal creatures and conflicted about the ideals ourselves. We often ignore the suffering of strangers, and even contribute to it, at least indirectly. How then, do we point machines in the direction of something better?"
    ],
    [
      'H',
      "As for the 'destination' problem, we might, by putting ourselves in the hands of these moral guides and gatekeepers, be sacrificing our own autonomy – an important part of what makes us human. Machines who are better than us at sticking to the moral high ground may be expected to discourage some of the lapses we presently take for granted. We might lose our freedom to discriminate in favour of our own communities, for example."
    ],
    [
      'I',
      "Loss of freedom to behave badly isn't always a bad thing, of course: denying ourselves the freedom to put children to work in factories, or to smoke in restaurants are signs of progress. But are we ready for ethical silicon police limiting our options? They might be so good at doing it that we won't notice them; but few of us are likely to welcome such a future."
    ],
    [
      'J',
      "These issues might seem far-fetched, but they are to some extent already here. AI already has some input into how resources are used in our National Health Service (NHS) here in the UK, for example. If it was given a greater role, it might do so much more efficiently than humans can manage, and act in the interests of taxpayers and those who use the health system. However, we'd be depriving some humans (e.g. senior doctors) of the control they presently enjoy. Since we'd want to ensure that people are treated equally and that policies are fair, the goals of AI would need to be specified correctly."
    ],
    [
      'K',
      "We have a new powerful technology to deal with- itself, literally, a new way of thinking. For our own safety, we need to point these new thinkers in the right direction, and get them to act well for us. It is not yet clear whether this is possible, but if it is, it will require a cooperative spirit, and a willingness to set aside self-interest."
    ],
    [
      'L',
      "Both general intelligence and moral reasoning are often thought to be uniquely human capacities. But safety seems to require that we think of them as a package: if we are to give general intelligence to machines, we'll need to give them moral authority, too. And where exactly would that leave human beings? All the more reason to think about the destination now, and to be careful about what we wish for."
    ]
  ]
}

const STAGE_SOURCES = {
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

const c16 = (await import('../server/userProvidedReadingPracticeCambridge16.mjs'))
  .USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS
const c17 = (await import('../server/userProvidedReadingPracticeCambridge17.mjs'))
  .USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS
const c18 = (await import('../server/userProvidedReadingPracticeCambridge18.mjs'))
  .USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_18_EXAMS
const { buildReadingExamPayload } = await import('../server/readingImportUtils.mjs')
const { READING_QUESTION_SECTION_OVERRIDES } = await import(
  './reading-question-section-overrides.mjs'
)

const ROMAN_HEADING = /^(i{1,3}|iv|v|vi{0,3}|vii{0,3}|viii|ix|x|xi|xii)$/i
const PARA_LETTER = /^[A-H]$/

const OCR_PASSAGE_FIXES = [
  [/se GN\s*['']?/g, ''],
  [/\bAnnes\b/g, 'Ames'],
  [/\bAPoB\b/g, 'APOB'],
  [/\bmodem\b/g, 'modern'],
  [/\baan\b/gi, 'an'],
  [/\bareference\b/gi, 'a reference'],
  [/\bwooly\b/g, 'woolly'],
  [/\blonghomed\b/g, 'longhorned'],
  [/\bthree-pieced\b/g, 'three-piece'],
  [/\bqganat\b/g, 'qanat'],
  [/\bD_\s+At/g, 'D\n\nAt'],
  [/^\s*lot of\b/gi, 'A lot of'],
  [/\bH\s*-\s*Norway/g, 'H\n\nNorway'],
  [/&euro;/g, '€'],
  [/\s*—+\s*\*Stand/g, '\n\n*Stand'],
  [/\d+Drop heading here[A-Z]/gi, '']
]

function cleanParagraphText(text) {
  let s = String(text || '').trim()
  for (const [re, rep] of OCR_PASSAGE_FIXES) {
    s = s.replace(re, rep)
  }
  return s.replace(/\s+/g, ' ').trim()
}

function cleanPrompt(prompt, ctx = {}) {
  let s = String(prompt || '')
    .replace(/\baan\b/gi, 'an')
    .replace(/^Drop (?:heading|answer) here\s*…?\s*/i, '')
    .replace(/\s*Drag and drop[\s\S]*$/i, '')
    .replace(/\s*Questions?\s+\d+\s*[-–][\s\S]*$/i, '')
    .replace(/\s*Write your answers in boxes[\s\S]*$/i, '')
    .replace(/\s*Choose the correct letter[\s\S]*$/i, '')
    .replace(/\s*In boxes on your answer sheet[\s\S]*$/i, '')
    .split('\n')[0]
    .replace(/\s+/g, ' ')
    .replace(/…+/g, ' … ')
    .trim()

  if (ctx.headingPara) {
    return `Paragraph ${ctx.headingPara}`
  }
  if (/^Paragraph\s+[A-G]$/i.test(s)) return s
  if (!s || s.length < 8) {
    if (ctx.fallback) return ctx.fallback
  }
  return s.slice(0, 280)
}

/** Merge bodyParagraphs when letter markers are on their own lines. */
function paragraphsFromBody(exam) {
  const passage = exam.parsedPayload?.passages?.[0]
  if (!passage) return []

  const bodies = passage.bodyParagraphs || []
  const chunks = []
  let buf = []

  const flush = () => {
    const text = cleanParagraphText(buf.join(' '))
    if (text.length >= 40) chunks.push(text)
    buf = []
  }

  for (const line of bodies) {
    const t = String(line).trim()
    if (/^[A-L]\.?$/.test(t)) {
      flush()
      continue
    }
    const stripped = t.replace(/^[A-L]\.\s+/, '').trim()
    if (stripped) buf.push(stripped)
  }
  flush()

  if (chunks.length >= 3) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return chunks.map((text, i) => [letters[i] || String(i + 1), text])
  }
  return null
}

const repairExamPayload = (exam) => {
  const qPos = String(exam.rawPassageText || '').search(/\nQuestions\s+\d+\s*[-–]/i)
  if (qPos < 0) return exam
  const body = exam.rawPassageText.slice(0, qPos).trim()
  const questionBlock = exam.rawPassageText.slice(qPos).trim()
  try {
    const parsedPayload = buildReadingExamPayload({
      id: exam.id,
      title: exam.title,
      category: exam.category,
      rawPassageText: `${body}\n\n${questionBlock}`,
      rawAnswerKey: exam.rawAnswerKey
    })
    return { ...exam, parsedPayload }
  } catch {
    return exam
  }
}

const pool = [...c16, ...c17, ...c18].map(repairExamPayload)

const esc = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n')

const ANSWER_ONLY_THAI =
  /^(TRUE|FALSE|NOT GIVEN|YES|NO|[A-H]|[A-H]{2}(?:\/[A-H])?|i{1,3}|iv|v|vi{0,3}|vii{0,3}|viii|ix|x|xi|xii|\d+)$/i

const parseParaphrase = (pv) => {
  const parts = String(pv || '')
    .split('=')
    .map((x) => x.trim())
  const third = parts[2] || ''
  const thaiMeaning =
    third && /[\u0E00-\u0E7F]/.test(third) && !ANSWER_ONLY_THAI.test(third) ? third : ''
  return { passageKeyword: parts[0] || '', questionKeyword: parts[1] || '', thaiMeaning }
}

const resolveThaiMeaning = (q, para) => {
  const expl = String(q.explanationThai || '').trim()
  if (expl && /[\u0E00-\u0E7F]{8,}/.test(expl)) {
    const tail = (expl.match(/จึง(?:คำตอบ|ตอบ|เลือก)[^]*$/i) || [])[0]?.trim() || ''
    const tailTooBrief =
      !tail ||
      tail.length < 32 ||
      /^จึง(?:คำตอบ|ตอบ|เลือก)\s+(?:TRUE|FALSE|NOT GIVEN|YES|NO|[A-H]|[ivx]+|\d+)/i.test(tail)
    if (!tailTooBrief) return tail.length <= 220 ? tail : `${tail.slice(0, 217).trim()}…`
    return expl.length <= 360 ? expl : `${expl.slice(0, 357).trim()}…`
  }
  if (para.thaiMeaning && /[\u0E00-\u0E7F]/.test(para.thaiMeaning)) return para.thaiMeaning
  const m = expl.match(/จึง(?:คำตอบ|ตอบ|เลือก)[^]*$|คำตอบคือ[^]+/i)
  return m ? m[0].trim().slice(0, 220) : ''
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
    const text = cleanParagraphText(m[2])
    if (text.length > 40) letterBlocks.push([m[1], text])
  }
  if (letterBlocks.length >= 3) return letterBlocks

  const re2 = /(?:^|\n\n)([A-I])\.\s+([\s\S]*?)(?=\n\n[A-I]\.|\n\nQuestions|\n\n<div|$)/g
  while ((m = re2.exec(raw)) !== null) {
    const text = cleanParagraphText(m[2])
    if (text.length > 40) letterBlocks.push([m[1], text])
  }
  if (letterBlocks.length >= 3) return letterBlocks

  const fromBody = paragraphsFromBody(exam)
  if (fromBody?.length >= 3) return fromBody

  const bodies = passage.bodyParagraphs || []
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return bodies
    .map((text, i) => {
      const cleaned = cleanParagraphText(
        String(text)
          .replace(/^[A-J]\s+/, '')
          .replace(/^[A-J]\.\s*/, '')
      )
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

/** Split combined P2 blocks (e.g. Questions 14–26 with embedded 19–21) into sub-ranges. */
function inferSubRanges(sectionText, fallbackRanges) {
  const found = []
  const re = /Questions\s+(\d+)\s*[-–]\s*(\d+)/gi
  let m
  while ((m = re.exec(sectionText)) !== null) {
    found.push({ start: Number(m[1]), end: Number(m[2]) })
  }
  const uniq = []
  const seen = new Set()
  for (const r of found) {
    const k = `${r.start}-${r.end}`
    if (!seen.has(k)) {
      seen.add(k)
      uniq.push(r)
    }
  }
  const base = (uniq.length > 1 ? uniq : fallbackRanges).sort((a, b) => a.start - b.start)
  return expandNestedRanges(base)
}

/** Turn [14–26, 19–21] into [14–18, 19–21, 22–26]. */
function expandNestedRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const output = []
  const used = new Set()

  for (let i = 0; i < sorted.length; i += 1) {
    if (used.has(i)) continue
    const outer = sorted[i]
    const nested = sorted
      .map((r, j) => ({ r, j }))
      .filter(({ r, j }) => j !== i && r.start >= outer.start && r.end <= outer.end)
    if (!nested.length) {
      output.push(outer)
      continue
    }
    nested.forEach(({ j }) => used.add(j))
    let cursor = outer.start
    for (const { r: inner } of nested.sort((a, b) => a.r.start - b.r.start)) {
      if (cursor < inner.start) output.push({ start: cursor, end: inner.start - 1 })
      output.push(inner)
      cursor = inner.end + 1
    }
    if (cursor <= outer.end) output.push({ start: cursor, end: outer.end })
  }

  return output.sort((a, b) => a.start - b.start)
}

/** When scraped section headers are incomplete, split by answer-type runs (e.g. TFNG block then fill). */
function inferRangesFromAnswerTypeRuns(questions) {
  if (!questions.length) return []
  const sorted = [...questions].sort((a, b) => a.number - b.number)
  const runs = []
  let cur = {
    start: sorted[0].number,
    end: sorted[0].number,
    type: sorted[0].answerType
  }
  for (const q of sorted.slice(1)) {
    if (q.answerType === cur.type) cur.end = q.number
    else {
      runs.push({ start: cur.start, end: cur.end })
      cur = { start: q.number, end: q.number, type: q.answerType }
    }
  }
  runs.push({ start: cur.start, end: cur.end })
  return runs
}

function filterRangesWithQuestions(ranges, questions) {
  if (!questions.length) return []
  const min = Math.min(...questions.map((q) => q.number))
  const max = Math.max(...questions.map((q) => q.number))
  return ranges.filter(
    (r) =>
      r.start >= min &&
      r.end <= max &&
      questions.some((q) => q.number >= r.start && q.number <= r.end)
  )
}

function renumberPassageQuestions(questions, ranges) {
  const minNum = Math.min(...questions.map((q) => q.number))
  if (minNum === 1) return { questions, ranges, shift: 0 }
  const shift = minNum - 1
  return {
    questions: questions.map((q) => ({ ...q, number: q.number - shift })),
    ranges: ranges.map((r) => ({ start: r.start - shift, end: r.end - shift })),
    shift
  }
}

function renumberSectionText(sectionText, shift) {
  if (!shift) return sectionText
  return String(sectionText || '')
    .replace(/Questions\s+(\d+)\s*[-–]\s*(\d+)/gi, (_, a, b) => {
      const start = Math.max(1, Number(a) - shift)
      const end = Math.max(1, Number(b) - shift)
      return `Questions ${start}-${end}`
    })
    .replace(/Questions\s+(\d+)\s+and\s+(\d+)/gi, (_, a, b) => {
      return `Questions ${Math.max(1, Number(a) - shift)} and ${Math.max(1, Number(b) - shift)}`
    })
    .replace(/^(\d+)\./gm, (_, n) => `${Math.max(1, Number(n) - shift)}.`)
}

function splitSliceByAnswerType(questions) {
  if (!questions.length) return []
  const sorted = [...questions].sort((a, b) => a.number - b.number)
  const runs = []
  let cur = { type: sorted[0].answerType, questions: [sorted[0]] }
  for (const q of sorted.slice(1)) {
    if (q.answerType === cur.type) cur.questions.push(q)
    else {
      runs.push(cur)
      cur = { type: q.answerType, questions: [q] }
    }
  }
  runs.push(cur)
  return runs
}

function classifyRange(sectionSlice) {
  const slice = sectionSlice.questions
  if (!slice.length) return null
  const text = sectionSlice.text.toLowerCase()
  const types = [...new Set(slice.map((q) => q.answerType))]
  const prompts = slice.map((q) => q.prompt).join(' ').toLowerCase()

  if (slice.some((q) => /which two/i.test(q.prompt))) {
    return { key: 'mcq', chooseTwo: true }
  }

  if (types.length === 1 && types[0] === 'true-false-not-given') return { key: 'tfng' }
  if (types.length === 1 && types[0] === 'yes-no-not-given') return { key: 'ynng' }
  if (types.every((t) => t === 'text')) {
    if (text.includes('notes below')) return { key: 'fill', variant: 'notes' }
    return { key: 'fill', variant: 'summary' }
  }

  const allRoman = slice.every((q) => ROMAN_HEADING.test(String(q.correctAnswer).trim()))
  if (allRoman || (text.includes('list of headings') && slice.some((q) => /paragraph/i.test(q.prompt)))) {
    return { key: 'headings' }
  }

  if (types.every((t) => t === 'multiple-choice')) {
    if (
      text.includes('which section') ||
      text.includes('section contains') ||
      text.includes('paragraph contains') ||
      text.includes('which paragraph') ||
      (text.includes('paragraphs') &&
        slice.every((q) => PARA_LETTER.test(String(q.correctAnswer).trim().toUpperCase())))
    ) {
      const maxLetter = slice.reduce(
        (max, q) => Math.max(max, q.correctAnswer.toUpperCase().charCodeAt(0)),
        65
      )
      return { key: 'matchingInfo', endLetter: String.fromCharCode(Math.max(71, maxLetter)) }
    }
    if (
      text.includes('list of timber') ||
      text.includes('timber cuts') ||
      slice.some((q) =>
        /to remove trees that are diseased|generate income across|to create a forest/i.test(q.prompt)
      )
    ) {
      return { key: 'matchingPeople', peopleKey: 'timber' }
    }
    if (text.includes('list of theories')) {
      return { key: 'matchingPeople', peopleKey: 'theories' }
    }
    if (
      text.includes('list of people') ||
      text.includes('researchers below') ||
      text.includes('list of researchers')
    ) {
      return { key: 'matchingPeople', peopleKey: 'people' }
    }
    if (text.includes('list of words') || text.includes('list of options')) {
      return { key: 'matchingPeople', peopleKey: 'words' }
    }
    if (text.includes('heading') || text.includes('list of headings')) {
      return { key: 'headings' }
    }
    if (
      /what point|what is the writer|why does|what challenge|what does the writer|which of the following|best summarises/i.test(
        prompts
      )
    ) {
      return { key: 'mcq' }
    }
    if (
      text.includes('complete the summary') &&
      slice.every((q) => /^[A-F]$/i.test(String(q.correctAnswer).trim()))
    ) {
      return { key: 'matchingPeople', peopleKey: 'words' }
    }
    if (text.includes('choose the correct letter') && !text.includes('which paragraph')) {
      return { key: 'mcq' }
    }
    return { key: 'matchingInfo', endLetter: 'H' }
  }

  if (types.includes('yes-no-not-given')) return { key: 'ynng' }
  if (types.includes('true-false-not-given')) return { key: 'tfng' }
  if (types.includes('text')) return { key: 'fill', variant: 'summary' }
  if (types.includes('multiple-choice')) return { key: 'matchingInfo', endLetter: 'H' }
  return null
}

function consolidateSections(sections) {
  const order = []
  const list = []
  for (const sec of sections) {
    const existing = list.find(
      (s) =>
        s.key === sec.key &&
        s.variant === sec.variant &&
        (s.peopleKey || '') === (sec.peopleKey || '')
    )
    if (existing) {
      existing.items.push(...sec.items)
    } else {
      list.push({ ...sec, items: [...sec.items] })
      order.push(sec.key)
    }
  }
  return { sections: list, sectionOrder: order }
}

function extractPeopleList(sectionText, peopleKey) {
  const lines = sectionText.split('\n')
  const people = []
  for (const line of lines) {
    const m = line.match(/^([A-G])\s+(.+)$/)
    if (m && !/section|paragraph|heading|theory/i.test(m[2])) {
      people.push(`${m[1]} ${m[2].trim()}`)
    }
  }
  if (people.length) return people
  if (peopleKey === 'timber') {
    return [
      'A a Timber Stand Improvement Cut',
      'B a Salvage Cut',
      'C a Shelterwood Cut'
    ]
  }
  if (peopleKey === 'words') {
    const wordOpts = []
    const re = /^\s*([A-F])\s+(.+)$/gm
    let m
    while ((m = re.exec(sectionText)) !== null) {
      wordOpts.push(`${m[1]} ${m[2].trim()}`)
    }
    if (wordOpts.length >= 4) return wordOpts
    return [
      'A medical practitioners',
      'B specialised tasks',
      'C available resources',
      'D reduced illness',
      'E professional authority',
      'F technology experts'
    ]
  }
  return null
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

const parseQuestionsFromAnswerKey = (rawAnswerKey) => {
  const segments = [
    ...String(rawAnswerKey || '').matchAll(
      /(?:^|\n)(Question\s+\d+:\s*[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi
    )
  ].map((m) => String(m[1] || '').trim())
  return segments
    .map((segment) => {
      const number = Number(segment.match(/^Question\s+(\d+):/im)?.[1] || 0)
      const prompt = String(
        segment.match(
          /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
        )?.[1] || ''
      ).trim()
      const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '')
        .trim()
        .replace(/\.$/, '')
      const acceptedRaw = segment.match(/Accepted Answers:\s*(.+)/i)?.[1]
      const acceptedAnswers = acceptedRaw
        ? acceptedRaw.split(/[|,/&]+/).map((x) => x.trim()).filter(Boolean)
        : undefined
      const exactPortion = String(segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || '')
        .trim()
        .replace(/^["']|["']$/g, '')
      const explanationThai = String(segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)?.[1] || '').trim()
      const paraphrasedVocabulary = String(segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)?.[1] || '').trim()
      const upper = correctAnswer.toUpperCase()
      let answerType = 'text'
      if (['YES', 'NO'].includes(upper)) answerType = 'yes-no-not-given'
      else if (['TRUE', 'FALSE', 'NOT GIVEN'].includes(upper)) answerType = 'true-false-not-given'
      else if (/^[A-H]$/.test(upper) || /^(i{1,3}|iv|v|vi{0,3}|vii{0,3}|viii|ix|x)$/i.test(upper))
        answerType = 'multiple-choice'
      return {
        number,
        prompt,
        correctAnswer: upper.startsWith('NOT GIVEN') ? 'NOT GIVEN' : correctAnswer,
        acceptedAnswers,
        answerType,
        exactPortion,
        explanationThai,
        paraphrasedVocabulary
      }
    })
    .filter((q) => q.number > 0 && q.prompt)
}

function applyAnswerTypesFromSectionText(questions, sectionText, ranges) {
  for (const range of ranges) {
    const sliceText = sliceSectionText(sectionText, range, ranges).toLowerCase()
    const slice = questions.filter((q) => q.number >= range.start && q.number <= range.end)
    const ynngSection =
      /views of the writer|claims of the writer|agree with the views/i.test(sliceText)
    const tfngSection =
      /agree with the information|agree with the statements/i.test(sliceText) &&
      !ynngSection
    for (const q of slice) {
      const upper = String(q.correctAnswer).toUpperCase()
      if (ynngSection && ['YES', 'NO', 'NOT GIVEN'].includes(upper)) {
        q.answerType = 'yes-no-not-given'
      } else if (tfngSection && ['TRUE', 'FALSE', 'NOT GIVEN'].includes(upper)) {
        q.answerType = 'true-false-not-given'
      }
    }
  }
}

function buildLayout(exam) {
  const passage = exam.parsedPayload.passages[0]
  const title = exam.title.replace(/^Cambridge \d+ Test \d+ Passage \d+ - /, '').trim()
  const paragraphs = PARAGRAPH_OVERRIDES[exam.id] || extractParagraphs(exam)
  let sectionText =
    READING_QUESTION_SECTION_OVERRIDES[exam.id] || passage.questionSectionText || ''
  let ranges = inferSubRanges(sectionText, passage.questionRanges || [])
  let questions = passage.questions || []

  const keyQuestions = parseQuestionsFromAnswerKey(exam.rawAnswerKey)
  if (keyQuestions.length >= 13) {
    questions = keyQuestions
    if (!READING_QUESTION_SECTION_OVERRIDES[exam.id]) {
      const qPos = String(exam.rawPassageText || '').search(/\nQuestions\s+\d+\s*[-–]/i)
      if (qPos >= 0) sectionText = exam.rawPassageText.slice(qPos).trim()
    }
    ranges = inferSubRanges(sectionText, [
      {
        start: Math.min(...questions.map((q) => q.number)),
        end: Math.max(...questions.map((q) => q.number))
      }
    ])
  }

  let shift = 0
  ;({ questions, ranges, shift } = renumberPassageQuestions(questions, ranges))
  sectionText = renumberSectionText(sectionText, shift)
  ranges = filterRangesWithQuestions(ranges, questions)
  applyAnswerTypesFromSectionText(questions, sectionText, ranges)
  const covered = new Set()
  for (const r of ranges) {
    for (let n = r.start; n <= r.end; n += 1) covered.add(n)
  }
  const coveredCount = ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0)
  if (coveredCount < questions.length) {
    ranges = inferRangesFromAnswerTypeRuns(questions)
  }

  const sections = []
  for (const range of ranges) {
    const slice = questions.filter((q) => q.number >= range.start && q.number <= range.end)
    const sliceText = sliceSectionText(sectionText, range, ranges)
    const subRanges = inferSubRanges(sliceText, [range])
    const chunks =
      subRanges.length > 1
        ? subRanges.map((sub) => ({
            questions: slice.filter((q) => q.number >= sub.start && q.number <= sub.end),
            text: sliceSectionText(sectionText, sub, subRanges)
          }))
        : splitSliceByAnswerType(slice).map((run) => ({
            questions: run.questions,
            text: sliceText
          }))
    let headingIdx = 0
    for (const chunk of chunks) {
      const kind = classifyRange({ text: chunk.text, questions: chunk.questions })
      if (!kind) continue
      const items = chunk.questions.map((q) => {
        const para = parseParaphrase(q.paraphrasedVocabulary)
        const ctx = {}
        if (kind.key === 'headings') {
          const paraMatch = String(q.prompt).match(/paragraph\s+([A-G])/i)
          ctx.headingPara = paraMatch
            ? paraMatch[1].toUpperCase()
            : String.fromCharCode(65 + headingIdx++)
        }
        return {
          prompt: cleanPrompt(q.prompt, ctx),
          answer: q.correctAnswer,
          evidence: q.exactPortion,
          acceptedAnswers: q.acceptedAnswers?.length ? q.acceptedAnswers : undefined,
          passageKeyword: para.passageKeyword,
          questionKeyword: para.questionKeyword,
          thaiMeaning: resolveThaiMeaning(q, para)
        }
      })

      sections.push({ ...kind, items, sectionText: chunk.text })
    }
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
          ? "['A Hamiltonian', 'B Jeffersonian', 'C Jacksonian']"
          : JSON.stringify(
              extractPeopleList(sec.sectionText || '', sec.peopleKey) || [
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
      const mcqInstruction = sec.chooseTwo
        ? 'Choose TWO letters, A–E, for each question.'
        : 'Choose the correct letter, A, B, C or D.'
      lines.push(
        `  mcq: { instruction: '${mcqInstruction}', options: ${JSON.stringify(mcqOpts)}, items: [`
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
        `      ${n}: s('${esc(item.passageKeyword || '')}', '${esc(item.questionKeyword || '')}', '${esc(item.thaiMeaning || '')}'),`
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
 * Normal Reading Journey ด่าน 6, 7–12, 13–15, 16–17 — Cambridge 16–18.
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
` : ''}${needsYnngP2 ? `const ynngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction: 'Do the following statements agree with the views of the writer in Reading Passage 2? Write YES, NO or NOT GIVEN.',
  items
})
` : ''}const fillBlock = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
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

passagesOut.push(`export const INTENSIVE_LAYOUTS_STAGE_6_17: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
`)
for (const stage of Object.keys(STAGE_SOURCES)) {
  passagesOut.push(`  ${stage}: [stage${stage}Passage1, stage${stage}Passage2],`)
}
passagesOut.push(`}\n`)

fs.writeFileSync(path.join(root, 'src/journeyIntensivePassages6to17.ts'), passagesOut.join('\n'))

// Solutions file
const solLines = []
solLines.push(`import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'
const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword, questionKeyword, thaiMeaning
})
export const INTENSIVE_SOLUTIONS_STAGE_6_17: Record<number, { 1: Record<number, IntensiveQuestionSolution>; 2: Record<number, IntensiveQuestionSolution> }> = {
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
fs.writeFileSync(path.join(root, 'src/intensiveJourneyQuestionSolutions6to17.ts'), solLines.join('\n'))

// Fill blank
const fillLines = []
fillLines.push(`import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17: NewFillBlankSet[] = [
`)
for (const [stage, layouts] of Object.entries(layoutsByStage)) {
  layouts.forEach((layout, i) => {
    const exam = examsByStage[stage][i]
    const block = emitFillBlank(Number(stage), i + 1, exam, layout)
    if (block) fillLines.push(block + ',')
  })
}
fillLines.push(`]\n`)
fs.writeFileSync(path.join(root, 'src/intensiveJourneyFillBlankStages6to17.ts'), fillLines.join('\n'))

console.log('Wrote journeyIntensivePassages6to17.ts, intensiveJourneyQuestionSolutions6to17.ts, intensiveJourneyFillBlankStages6to17.ts')
