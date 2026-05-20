/**
 * Audit matching questions (headings, information, features, statements, endings)
 * in monthly uploads for verbatim overlap between prompts/headings and passage evidence.
 *
 * Run: node scripts/audit-reading-matching-paraphrase-monthly.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')
const MONTHLY_FILE = /^ielts-academic-reading-/i
const ROMAN = /^(?:i{1,3}|iv|v|vi{0,3}|ix|x)$/i

const STOP = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'with', 'and', 'or', 'as', 'at', 'by', 'from', 'that',
  'this', 'which', 'what', 'how', 'when', 'where', 'why', 'who', 'are', 'was', 'were', 'been', 'being',
  'have', 'has', 'had', 'not', 'but', 'into', 'about', 'than', 'then', 'them', 'they', 'their', 'there',
  'reference', 'mention', 'details', 'description', 'explanation', 'suggestion', 'account', 'examples',
  'example', 'following', 'information', 'section', 'paragraph', 'heading', 'statements', 'writer', 'make',
  'made', 'does', 'did', 'can', 'could', 'would', 'should', 'will', 'also', 'only', 'more', 'most', 'some',
  'such', 'other', 'into', 'over', 'after', 'before', 'between', 'during', 'through', 'under', 'above'
])

const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (v) => normalize(v).split(' ').filter((w) => w.length > 2 && !STOP.has(w))

const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w)

const sharedTokenScore = (a, b) => {
  const ta = tokenize(a)
  const tb = tokenize(b)
  if (!ta.length || !tb.length) return 0
  const tbSet = new Set(tb)
  const tbStems = new Set(tb.map(stem))
  let hit = 0
  for (const w of ta) {
    if (tbSet.has(w)) hit += 1
    else if (tbStems.has(stem(w))) hit += 0.85
  }
  return hit / ta.length
}

const parseQuestions = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  return [...source.matchAll(/(?:^|\n)(Question\s+\d+:[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map((m) => {
    const segment = String(m[1] || '').trim()
    const number = Number(segment.match(/^Question\s+(\d+):/i)?.[1] || 0)
    const prompt = String(
      segment.match(/^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im)?.[1] || ''
    ).trim()
    const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
    const exactPortion = String(
      segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
    ).trim()
    const paraphrasedVocabulary = String(segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)?.[1] || '').trim()
    return { number, prompt, correctAnswer, exactPortion, paraphrasedVocabulary }
  })
}

const detectSectionTypes = (sectionText) => ({
  information: /which (?:paragraph|section) contains/i.test(sectionText),
  headings: /choose the correct heading|list of headings/i.test(sectionText),
  features: /match each statement|match each person|list of (?:people|experts|features)/i.test(sectionText),
  endings: /complete the sentences with the correct ending|sentence endings/i.test(sectionText),
  statements: /match each statement/i.test(sectionText) && !/list of people/i.test(sectionText)
})

const parseHeadings = (sectionText) => {
  const block = sectionText.match(/List of Headings\s*([\s\S]*?)(?=\n\s*\d+\s+Section|\n\s*\d+\s+Paragraph|\nQuestions|\n\d+\s+[A-Z])/i)?.[1] || ''
  const headings = new Map()
  for (const line of block.split('\n')) {
    const m = line.trim().match(/^((?:i{1,3}|iv|v|vi{0,3}|ix|x))\s+(.+)$/i)
    if (m) headings.set(m[1].toLowerCase(), m[2].trim())
  }
  return headings
}

const parseParagraphs = (rawPassageText) => {
  const body = String(rawPassageText || '').split(/Questions\s+\d+/i)[0] || ''
  const paragraphs = new Map()
  for (const m of body.matchAll(/\n([A-Z])\n\n([\s\S]*?)(?=\n[A-Z]\n\n|\nQuestions|\s*$)/g)) {
    paragraphs.set(m[1], m[2].trim())
  }
  return paragraphs
}

const parseParaphrasePairs = (raw) =>
  String(raw || '')
    .split(';')
    .map((part) => {
      const idx = part.indexOf('=')
      if (idx < 0) return null
      return {
        left: part.slice(0, idx).trim(),
        right: part.slice(idx + 1).trim().split('/')[0].trim()
      }
    })
    .filter(Boolean)

const weakParaphrasePairs = (pairs) => {
  const bad = []
  for (const { left, right } of pairs) {
    const l = normalize(left)
    const r = normalize(right)
    if (!l || !r) continue
    if (l === r) bad.push(`${left}=${right}`)
    else if (sharedTokenScore(left, right) >= 0.55) bad.push(`${left}=${right}`)
  }
  return bad
}

const DOTS = /[.．…⋯·•_\-–—]{2,}|…/

const classifyQuestion = (q, types) => {
  const answer = q.correctAnswer.trim()
  const prompt = q.prompt.trim()
  if (DOTS.test(prompt)) return null
  if (/^which two\b|^choose two\b|^complete the\b/i.test(prompt)) return null

  if (types.headings && /^(?:section|paragraph)\s+[A-Z]$/i.test(prompt) && ROMAN.test(answer)) {
    return 'matching-headings'
  }
  if (types.information && /^[A-G]$/i.test(answer) && !/^(?:section|paragraph)\s+[A-Z]$/i.test(prompt)) {
    return 'matching-information'
  }
  if (types.features && /^[A-G]$/i.test(answer) && !/^(?:section|paragraph)\s+[A-Z]$/i.test(prompt)) {
    return 'matching-features'
  }
  if (types.endings && DOTS.test(prompt) === false && /^[A-G]$/i.test(answer)) return 'matching-sentence-endings'
  return null
}

const loadMonthlyExams = () => {
  const exams = []
  for (const file of fs.readdirSync(importsDir).filter((n) => MONTHLY_FILE.test(n) && n.endsWith('.json'))) {
    const parsed = JSON.parse(fs.readFileSync(path.join(importsDir, file), 'utf8'))
    const items = Array.isArray(parsed) ? parsed : [parsed]
    for (const item of items) exams.push({ file, source: 'import', ...item })
  }
  return exams
}

const loadJuneServerExams = async () => {
  const mod = await import(new URL('../server/userProvidedReadingPracticeJune2026.mjs', import.meta.url).href)
  const key = Object.keys(mod).find((k) => k.includes('JUNE') && k.includes('EXAMS'))
  return (mod[key] || []).map((exam) => ({
    file: 'server/userProvidedReadingPracticeJune2026.mjs',
    source: 'june-2026-server',
    ...exam
  }))
}

const issues = []
let totalMatching = 0

const auditExam = (exam) => {
  const sectionText = String(exam.rawPassageText || '').match(/Questions[\s\S]*$/i)?.[0] || ''
  const types = detectSectionTypes(sectionText)
  if (!types.information && !types.headings && !types.features && !types.endings && !types.statements) return

  const questions = parseQuestions(exam.rawAnswerKey)
  const headings = parseHeadings(sectionText)
  const paragraphs = parseParagraphs(exam.rawPassageText)

  for (const q of questions) {
    const kind = classifyQuestion(q, types)
    if (!kind) continue
    totalMatching += 1

    const evidence = q.exactPortion.split(/\s*\/\s*/)[0].replace(/^["']+|["']+$/g, '').trim()
    const flags = []
    const pairs = parseParaphrasePairs(q.paraphrasedVocabulary)
    const weak = weakParaphrasePairs(pairs)
    if (weak.length) flags.push(`weak_paraphrase_pair:${weak.join(' | ')}`)

    if (kind === 'matching-headings') {
      const sectionMatch = q.prompt.match(/(?:section|paragraph)\s+([A-Z])/i)
      const letter = sectionMatch?.[1]
      const roman = q.correctAnswer.toLowerCase()
      const headingText = headings.get(roman) || ''
      const paraText = letter ? paragraphs.get(letter) || '' : ''
      if (headingText && paraText) {
        const overlap = sharedTokenScore(headingText, paraText.slice(0, 500))
        if (overlap >= 0.52) flags.push(`heading_paragraph_overlap_${Math.round(overlap * 100)}pct`)
      }
    } else {
      const promptOverlap = sharedTokenScore(q.prompt, evidence)
      if (promptOverlap >= 0.4) flags.push(`prompt_evidence_overlap_${Math.round(promptOverlap * 100)}pct`)
      const promptNorm = normalize(q.prompt)
      const evidenceNorm = normalize(evidence)
      for (const w of tokenize(q.prompt)) {
        if (w.length >= 8 && evidenceNorm.includes(w)) {
          flags.push(`shared_content_word:${w}`)
          break
        }
      }
    }

    if (!flags.length) continue

    const severity =
      flags.some((f) => /overlap_(7|8|9|10)\d|overlap_100|overlap_9\d/.test(f)) ||
      flags.some((f) => f.startsWith('shared_content_word')) ||
      (flags.some((f) => f.startsWith('weak_paraphrase')) &&
        flags.some((f) => f.includes('prompt_evidence') || f.includes('shared_content')))
        ? 'critical'
        : flags.some((f) => /overlap_(4|5|6)\d/.test(f) || f.startsWith('heading_paragraph'))
          ? 'moderate'
          : 'minor'

    issues.push({
      file: exam.file,
      source: exam.source,
      title: exam.title,
      type: kind,
      question: q.number,
      answer: q.correctAnswer,
      prompt: q.prompt,
      exactPortion: evidence.slice(0, 160),
      flags,
      severity
    })
  }
}

for (const exam of loadMonthlyExams()) auditExam(exam)
const juneExams = await loadJuneServerExams()
for (const exam of juneExams) auditExam(exam)

const bySeverity = {
  critical: issues.filter((i) => i.severity === 'critical'),
  moderate: issues.filter((i) => i.severity === 'moderate'),
  minor: issues.filter((i) => i.severity === 'minor')
}

const jsonPath = path.join(root, 'scripts/reading-matching-paraphrase-audit-monthly.json')
const mdPath = path.join(root, 'scripts/reading-matching-paraphrase-audit-monthly.md')

const lines = [
  '# Monthly matching — paraphrase audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  '',
  `| Metric | Count |`,
  `| --- | ---: |`,
  `| Matching questions scanned | ${totalMatching} |`,
  `| **Flagged** | **${issues.length}** |`,
  `| Critical | ${bySeverity.critical.length} |`,
  `| Moderate | ${bySeverity.moderate.length} |`,
  `| Minor | ${bySeverity.minor.length} |`,
  '',
  '### Types',
  '',
  '- **matching-information** — "Which paragraph contains…" prompts must not repeat passage words (e.g. denial → denied)',
  '- **matching-headings** — correct heading must not lift phrases from the paragraph opening',
  '- **matching-features** — statement prompts must paraphrase the evidence clause',
  '',
  '---',
  '',
  '## By file',
  ''
]

const byFile = new Map()
for (const i of issues) {
  if (!byFile.has(i.file)) byFile.set(i.file, [])
  byFile.get(i.file).push(i)
}
for (const [file, items] of [...byFile.entries()].sort()) {
  lines.push(`- **${file}** — ${items.length} issue(s)`)
}

for (const level of ['critical', 'moderate', 'minor']) {
  const group = bySeverity[level]
  if (!group.length) continue
  lines.push('', '---', '', `## ${level.toUpperCase()} (${group.length})`, '')
  let last = ''
  for (const item of group.sort((a, b) => a.file.localeCompare(b.file) || a.question - b.question)) {
    if (item.file !== last) {
      lines.push('', `### ${item.title}`, `\`${item.file}\` · ${item.type}`, '')
      last = item.file
    }
    lines.push(
      `**Q${item.question}** [${item.answer}] — ${item.flags.join(', ')}`,
      `> ${item.prompt}`,
      `> Evidence: ${item.exactPortion}`,
      ''
    )
  }
}

fs.writeFileSync(jsonPath, JSON.stringify({ scannedAt: new Date().toISOString(), totalMatching, issueCount: issues.length, issues }, null, 2), 'utf8')
fs.writeFileSync(mdPath, lines.join('\n'), 'utf8')

console.log(`Matching questions: ${totalMatching} | Flagged: ${issues.length}`)
console.log(`  critical: ${bySeverity.critical.length}`)
console.log(`  moderate: ${bySeverity.moderate.length}`)
console.log(`  minor: ${bySeverity.minor.length}`)
console.log(`\nWrote ${mdPath}`)
