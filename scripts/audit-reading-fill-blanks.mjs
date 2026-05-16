/**
 * Audit gap-fill questions for missing blank markers (Cam 12 T1 P2 Q14 class of bugs).
 * Run: node scripts/audit-reading-fill-blanks.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const DOTS = /[.．…⋯·•_\-–—]{2,}|…/
const FILL_SECTION = /complete the (notes|sentences|summary|table)|choose one word|write one word only|each gap|fill in the/i
const NUMBERED_LINE = (n) => new RegExp(`^\\s*${n}\\b`, 'm')

const loadExams = async () => {
  const mods = [
    '../server/userProvidedReadingPracticeCambridge12.mjs',
    '../server/userProvidedReadingPracticeCambridge13.mjs',
    '../server/userProvidedReadingPracticeCambridge19.mjs'
  ]
  const exams = []
  for (const rel of mods) {
    const mod = await import(new URL(rel, import.meta.url).href)
    const key = Object.keys(mod).find((k) => k.includes('CAMBRIDGE') && k.includes('EXAMS'))
    exams.push(...(mod[key] || []))
  }
  return exams
}

const lineForQuestion = (sectionText, n) => {
  const lines = String(sectionText || '').split('\n')
  return lines.find((l) => NUMBERED_LINE(n).test(l))?.trim() || ''
}

const bulletLineForGap = (sectionText, prompt) => {
  const snippet = String(prompt || '')
    .replace(/^[^a-z]+/i, '')
    .slice(0, 35)
    .trim()
  if (snippet.length < 8) return ''
  const lines = String(sectionText || '').split('\n')
  return (
    lines.find((l) => l.includes('…………') && l.toLowerCase().includes(snippet.slice(0, 12).toLowerCase())) ||
    ''
  ).trim()
}

const missingBlankInLine = []
const missingBlankInPrompt = []
const noteStyleNoNumber = []
const wrongTypeText = []

const exams = await loadExams()

for (const exam of exams) {
  const sectionText =
    exam.parsedPayload?.passages?.[0]?.questionSectionText ||
    exam.rawPassageText?.split(/\nQuestions \d+/i).slice(1).join('\nQuestions ') ||
    ''

  for (const passage of exam.parsedPayload?.passages || []) {
    const st = passage.questionSectionText || ''
    const inFillContext = FILL_SECTION.test(st)

    for (const q of passage.questions || []) {
      if (q.answerType !== 'text') continue
      if (!inFillContext) continue

      const prompt = String(q.prompt || '')
      const line = lineForQuestion(st, q.number)
      const bullet = bulletLineForGap(st, prompt)
      const promptHasDots = DOTS.test(prompt)
      const lineHasDots = DOTS.test(line)
      const bulletHasDots = DOTS.test(bullet)

      const isHeading =
        /paragraph [A-Z]|choose the correct heading|heading for/i.test(prompt) ||
        /^[ivx]+$/i.test(String(q.correctAnswer || '').trim())

      if (isHeading) {
        wrongTypeText.push({
          examId: exam.id,
          q: q.number,
          prompt: prompt.slice(0, 80),
          answer: q.correctAnswer
        })
        continue
      }

      if (!line && !bullet) {
        if (!promptHasDots) {
          noteStyleNoNumber.push({
            examId: exam.id,
            q: q.number,
            prompt: prompt.slice(0, 100),
            note: 'no numbered line; prompt also lacks …'
          })
        }
        continue
      }

      if (line && !lineHasDots) {
        missingBlankInLine.push({
          examId: exam.id,
          q: q.number,
          line: line.slice(0, 140),
          prompt: prompt.slice(0, 100)
        })
      }

      if (!promptHasDots && (lineHasDots || bulletHasDots)) {
        missingBlankInPrompt.push({
          examId: exam.id,
          q: q.number,
          line: (line || bullet).slice(0, 100),
          prompt: prompt.slice(0, 100)
        })
      }
    }
  }
}

const printGroup = (title, list) => {
  console.log(`\n## ${title} (${list.length})\n`)
  if (!list.length) {
    console.log('None.\n')
    return
  }
  const byExam = new Map()
  for (const i of list) {
    if (!byExam.has(i.examId)) byExam.set(i.examId, [])
    byExam.get(i.examId).push(i)
  }
  for (const [examId, items] of [...byExam.entries()].sort()) {
    console.log(`### ${examId}`)
    for (const i of items) {
      console.log(`  Q${i.q}: ${i.prompt || i.line || ''}`)
      if (i.line && i.prompt) console.log(`    line: ${i.line}`)
      if (i.note) console.log(`    ${i.note}`)
    }
    console.log('')
  }
}

console.log(`Scanned ${exams.length} Cambridge reading exams\n`)
printGroup('CRITICAL: Numbered line has NO blank (same bug as fixed Q14)', missingBlankInLine)
printGroup('LOW: Prompt missing … but line/bullet has dots (fallback UI)', missingBlankInPrompt)
printGroup('NOTE: Bullet/notes format without question number in text', noteStyleNoNumber)
printGroup('WARN: Heading questions stored as text type', wrongTypeText)

fs.writeFileSync(
  path.join(root, 'scripts/reading-fill-blank-audit.json'),
  JSON.stringify({ missingBlankInLine, missingBlankInPrompt, noteStyleNoNumber, wrongTypeText }, null, 2),
  'utf8'
)
