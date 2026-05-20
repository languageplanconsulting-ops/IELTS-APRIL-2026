/**
 * Find gap-fill / summary-completion questions where the summary line
 * gives away the answer via verbatim passage wording (too easy).
 *
 * Run: node scripts/audit-reading-fill-paraphrase.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')

const DOTS = /[.．…⋯·•_\-–—]{2,}|…/
const FILL_SECTION =
  /complete the (notes|sentences|summary|table)|choose one word|write one word only|each gap|fill in the/i

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (value) => normalize(value).split(' ').filter(Boolean)

const passageTextFromExam = (exam) => {
  const raw = String(exam.rawPassageText || '')
  const marker = raw.search(/Questions\s+\d+/i)
  const body = marker >= 0 ? raw.slice(0, marker) : raw
  return normalize(body.replace(/reading passage\s+\d+/gi, ' '))
}

const summarySectionText = (exam) => {
  const raw = String(exam.rawPassageText || '')
  const match = raw.match(/Questions\s+(\d+)[^\n]*\n([\s\S]*?)$/i)
  return match ? match[2] : raw
}

const promptBeforeBlank = (prompt) => {
  const parts = String(prompt || '').split(DOTS)
  return normalize(parts[0] || '').split(' ').slice(-8).join(' ')
}

const promptAfterBlank = (prompt) => {
  const parts = String(prompt || '').split(DOTS)
  return normalize(parts[1] || '').split(' ').slice(0, 8).join(' ')
}

const findPassageWindow = (passageText, answer, radius = 80) => {
  const needle = normalize(answer)
  if (!needle || needle.length < 2) return ''
  const idx = passageText.indexOf(needle)
  if (idx < 0) return ''
  return passageText.slice(Math.max(0, idx - radius), idx + needle.length + radius)
}

const overlapScore = (a, b) => {
  const ta = new Set(tokenize(a))
  const tb = tokenize(b)
  if (!ta.size || !tb.length) return 0
  let hit = 0
  for (const word of tb) {
    if (ta.has(word) && word.length > 2) hit += 1
  }
  return hit / tb.length
}

const issues = []

const loadImportFiles = () => {
  const files = fs
    .readdirSync(importsDir)
    .filter((name) => name.endsWith('.json') && !name.includes('template'))
  const exams = []
  for (const file of files) {
    const parsed = JSON.parse(fs.readFileSync(path.join(importsDir, file), 'utf8'))
    const items = Array.isArray(parsed) ? parsed : [parsed]
    for (const item of items) {
      exams.push({ file, ...item })
    }
  }
  return exams
}

const parseQuestions = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map(
    (m) => String(m[1] || '').trim()
  )
  return segments.map((segment) => {
    const number = Number(segment.match(/^Question\s+(\d+):/i)?.[1] || 0)
    const prompt = String(
      segment.match(
        /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/i
      )?.[1] || ''
    ).trim()
    const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
    const exactPortion = String(
      segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
    ).trim()
    const paraphrasedVocabulary = String(segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)?.[1] || '').trim()
    return { number, prompt, correctAnswer, exactPortion, paraphrasedVocabulary }
  })
}

const isFillQuestion = (q, sectionText) => {
  if (!DOTS.test(q.prompt)) return false
  if (!FILL_SECTION.test(sectionText)) return false
  const answer = normalize(q.correctAnswer)
  if (!answer || answer.length > 24) return false
  if (/^(yes|no|not given|true|false)$/i.test(answer)) return false
  if (/^[ivx]+$/i.test(answer)) return false
  return true
}

for (const exam of loadImportFiles()) {
  const sectionText = summarySectionText(exam)
  if (!FILL_SECTION.test(sectionText)) continue
  const passageText = passageTextFromExam(exam)
  const questions = parseQuestions(exam.rawAnswerKey)

  for (const q of questions) {
    if (!isFillQuestion(q, sectionText)) continue

    const answer = normalize(q.correctAnswer)
    const before = promptBeforeBlank(q.prompt)
    const after = promptAfterBlank(q.prompt)
    const window = findPassageWindow(passageText, answer)
    const flags = []

    if (before && window.includes(before)) {
      flags.push('summary_before_blank_appears_verbatim_near_answer_in_passage')
    }
    if (after && window.includes(after)) {
      flags.push('summary_after_blank_appears_verbatim_near_answer_in_passage')
    }

    const promptNorm = normalize(q.prompt.replace(DOTS, ' '))
    if (promptNorm.includes(answer) && answer.length >= 3) {
      flags.push('answer_substring_already_in_prompt')
    }

    const exactNorm = normalize(q.exactPortion)
    const beforeOverlap = overlapScore(exactNorm, before)
    const afterOverlap = overlapScore(exactNorm, after)
    if (beforeOverlap >= 0.55) {
      flags.push(`high_overlap_before_blank_${Math.round(beforeOverlap * 100)}pct`)
    }
    if (afterOverlap >= 0.45) {
      flags.push(`high_overlap_after_blank_${Math.round(afterOverlap * 100)}pct`)
    }

    const paraPairs = String(q.paraphrasedVocabulary || '')
      .split(';')
      .map((pair) => pair.split('=').map((s) => s.trim()))
      .filter((pair) => pair.length === 2)
    for (const [left, right] of paraPairs) {
      const l = normalize(left)
      const r = normalize(right)
      if (l && r && (l === r || l.includes(r) || r.includes(l))) {
        flags.push(`weak_paraphrase_pair:${left}=${right}`)
      }
    }

    if (flags.length) {
      issues.push({
        file: exam.file,
        title: exam.title,
        question: q.number,
        answer: q.correctAnswer,
        prompt: q.prompt.slice(0, 120),
        exactPortion: q.exactPortion.slice(0, 100),
        flags
      })
    }
  }
}

const byFile = new Map()
for (const item of issues) {
  const key = item.file
  if (!byFile.has(key)) byFile.set(key, [])
  byFile.get(key).push(item)
}

console.log(`Scanned monthly import JSON files — ${issues.length} fill questions flagged\n`)
for (const [file, items] of [...byFile.entries()].sort()) {
  console.log(`### ${file} (${items.length})`)
  for (const item of items.sort((a, b) => a.question - b.question)) {
    console.log(`  Q${item.question} [${item.answer}] ${item.flags.join(', ')}`)
    console.log(`    ${item.prompt}`)
  }
  console.log('')
}

const outPath = path.join(root, 'scripts/reading-fill-paraphrase-audit.json')
fs.writeFileSync(outPath, JSON.stringify({ scannedAt: new Date().toISOString(), issues }, null, 2), 'utf8')
console.log(`Wrote ${outPath}`)
