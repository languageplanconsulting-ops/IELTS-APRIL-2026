/**
 * Refresh Paraphrased Vocabulary lines for monthly fill questions (remove X=X pairs).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')
const MONTHLY_FILE = /^ielts-academic-reading-/i
const DOTS = /[.．…⋯·•_\-–—]{2,}|…/
const FILL_SECTION =
  /complete the (notes|sentences|summary|table)|choose one word|write one word only|each gap|fill in the/i

const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const buildVocabularyLine = (prompt, exactPortion, answer) => {
  const before = normalize(String(prompt || '').split(DOTS)[0]).split(' ').slice(-5).join(' ')
  const evidence = normalize(String(exactPortion || '').split(/\s*\/\s*/)[0]).split(' ').slice(0, 10).join(' ')
  const ans = String(answer || '').trim()
  if (!before || !evidence) return `answer signal = ${ans}`
  return `${before} = ${evidence}; answer signal = ${ans}`
}

const parseQuestions = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map(
    (m) => String(m[1] || '').trim()
  )
  return segments
}

const isFillQuestion = (segment, sectionText) => {
  const prompt = segment.match(/^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*Correct Answer:)/im)?.[1] || ''
  if (!DOTS.test(prompt)) return false
  if (!FILL_SECTION.test(sectionText)) return false
  const answer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
  if (/^[a-h]$/i.test(answer)) return false
  if (/^(yes|no|not given|true|false)$/i.test(answer)) return false
  if (prompt.includes('ONE WORD') && prompt.includes('___')) return false
  return true
}

let updated = 0
for (const file of fs.readdirSync(importsDir).filter((n) => MONTHLY_FILE.test(n) && n.endsWith('.json'))) {
  const filePath = path.join(importsDir, file)
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let changed = false
  for (const exam of items) {
    const sectionText = String(exam.rawPassageText || '').match(/Questions\s+\d+[^\n]*\n([\s\S]*?)$/i)?.[1] || ''
    if (!FILL_SECTION.test(sectionText)) continue
    const segments = parseQuestions(exam.rawAnswerKey)
    exam.rawAnswerKey = segments
      .map((segment) => {
        if (!isFillQuestion(segment, sectionText)) return segment
        const number = Number(segment.match(/^Question\s+(\d+):/i)?.[1] || 0)
        const prompt = segment.match(/^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*Correct Answer:)/im)?.[1]?.trim() || ''
        const answer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
        const exact = String(
          segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
        ).trim()
        const vocab = buildVocabularyLine(prompt, exact, answer)
        const next = segment.replace(/Paraphrased Vocabulary:\s*[\s\S]*$/i, `Paraphrased Vocabulary: ${vocab}`)
        if (next !== segment) {
          updated += 1
          changed = true
        }
        return next
      })
      .join('\n\n')
  }
  if (changed) fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8')
}

console.log(`Updated vocabulary on ${updated} fill questions.`)
