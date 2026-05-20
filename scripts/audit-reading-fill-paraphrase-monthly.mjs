/**
 * Audit gap-fill / summary-completion in MONTHLY uploads only
 * (ielts-academic-reading-*.json under cambridge-reading-imports).
 *
 * Flags questions where the summary gives away the answer via verbatim
 * passage wording around the blank (too easy to scan without paraphrase).
 *
 * Run: node scripts/audit-reading-fill-paraphrase-monthly.mjs
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
const MONTHLY_FILE = /^ielts-academic-reading-/i

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

/** Answer word duplicated in passage immediately before gap (e.g. genetic + sampling). */
const answerStemLeaksFromPassage = (passageText, answer, beforeWords) => {
  const a = normalize(answer)
  if (!a || a.length < 3) return false
  const window = findPassageWindow(passageText, a, 40)
  if (!window) return false
  const beforeTokens = tokenize(beforeWords)
  if (!beforeTokens.length) return false
  const stem = beforeTokens[beforeTokens.length - 1]
  if (stem.length < 4) return false
  const idx = window.indexOf(a)
  if (idx < 0) return false
  const left = window.slice(Math.max(0, idx - 30), idx).trim()
  return left.endsWith(stem) || left.includes(` ${stem} `)
}

const severityFromFlags = (flags) => {
  if (
    flags.some(
      (f) =>
        f.includes('verbatim') ||
        f.includes('answer_substring') ||
        f.includes('answer_stem_leak') ||
        /high_overlap_before_blank_(7[5-9]|[89]\d|100)pct/.test(f)
    )
  ) {
    return 'critical'
  }
  if (flags.some((f) => f.includes('high_overlap'))) return 'moderate'
  if (flags.some((f) => f.startsWith('weak_paraphrase'))) return 'minor'
  return 'minor'
}

const loadMonthlyExams = () => {
  const files = fs
    .readdirSync(importsDir)
    .filter((name) => name.endsWith('.json') && MONTHLY_FILE.test(name))
  const exams = []
  for (const file of files) {
    const parsed = JSON.parse(fs.readFileSync(path.join(importsDir, file), 'utf8'))
    const items = Array.isArray(parsed) ? parsed : [parsed]
    for (const item of items) {
      exams.push({ file, ...item })
    }
  }
  return exams.sort((a, b) => a.file.localeCompare(b.file))
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
  if (/^[a-h]$/i.test(String(q.correctAnswer || '').trim())) return false
  if (/^[ivx]+$/i.test(answer)) return false
  return true
}

const issues = []
let totalFillQuestions = 0
const examsScanned = []

for (const exam of loadMonthlyExams()) {
  const sectionText = summarySectionText(exam)
  if (!FILL_SECTION.test(sectionText)) continue

  const passageText = passageTextFromExam(exam)
  const questions = parseQuestions(exam.rawAnswerKey)
  let examFillCount = 0
  let examIssueCount = 0

  for (const q of questions) {
    if (!isFillQuestion(q, sectionText)) continue
    totalFillQuestions += 1
    examFillCount += 1

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

    if (answerStemLeaksFromPassage(passageText, answer, before)) {
      flags.push('answer_stem_leak_summary_word_matches_passage_before_answer')
    }

    const exactNorm = normalize(q.exactPortion)
    const beforeOverlap = overlapScore(exactNorm, before)
    const afterOverlap = overlapScore(exactNorm, after)
    if (beforeOverlap >= 0.55) {
      flags.push(`high_overlap_before_blank_${Math.round(beforeOverlap * 100)}pct`)
    }
    if (afterOverlap >= 0.55) {
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
      examIssueCount += 1
      issues.push({
        file: exam.file,
        collectionTitle: exam.collectionTitle || '',
        title: exam.title,
        question: q.number,
        answer: q.correctAnswer,
        prompt: q.prompt,
        exactPortion: q.exactPortion.slice(0, 140),
        flags,
        severity: severityFromFlags(flags)
      })
    }
  }

  if (examFillCount > 0) {
    examsScanned.push({
      file: exam.file,
      title: exam.title,
      collectionTitle: exam.collectionTitle || '',
      fillCount: examFillCount,
      issueCount: examIssueCount
    })
  }
}

const bySeverity = {
  critical: issues.filter((i) => i.severity === 'critical'),
  moderate: issues.filter((i) => i.severity === 'moderate'),
  minor: issues.filter((i) => i.severity === 'minor')
}

const jsonPath = path.join(root, 'scripts/reading-fill-paraphrase-audit-monthly.json')
const mdPath = path.join(root, 'scripts/reading-fill-paraphrase-audit-monthly.md')

const lines = [
  '# Monthly upload — fill-in-the-blank paraphrase audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  '',
  `| Metric | Count |`,
  `| --- | ---: |`,
  `| Monthly JSON files scanned | ${examsScanned.length} |`,
  `| Total gap-fill / summary-completion questions | ${totalFillQuestions} |`,
  `| **Questions with paraphrase problems** | **${issues.length}** |`,
  `| Critical (verbatim / answer in prompt / stem leak / ≥75% overlap) | ${bySeverity.critical.length} |`,
  `| Moderate (55–74% overlap with evidence) | ${bySeverity.moderate.length} |`,
  `| Minor (only weak X=X paraphrase notes) | ${bySeverity.minor.length} |`,
  '',
  '### Problem types',
  '',
  '- **verbatim_near_answer** — words before/after the blank in the summary also appear next to the answer in the passage',
  '- **answer_stem_leak** — summary word before blank is the same stem as in passage (e.g. `genetic` → `sampling`)',
  '- **answer_in_prompt** — correct answer already visible in the question line',
  '- **high_overlap** — summary line copies ≥55% of words from Exact Portion before/after the gap',
  '- **weak_paraphrase** — Paraphrased Vocabulary uses identical terms (e.g. `sea ice = sea ice`)',
  '',
  '---',
  '',
  '## By passage (fill count → issues)',
  ''
]

for (const exam of examsScanned.sort((a, b) => b.issueCount - a.issueCount || a.file.localeCompare(b.file))) {
  const status = exam.issueCount === 0 ? '✓' : exam.issueCount === exam.fillCount ? '⚠ all' : '⚠'
  lines.push(`- ${status} **${exam.title}** — ${exam.issueCount}/${exam.fillCount} fill Qs flagged (\`${exam.file}\`)`)
}

for (const level of ['critical', 'moderate', 'minor']) {
  const group = bySeverity[level]
  if (!group.length) continue
  lines.push('', `---`, '', `## ${level.toUpperCase()} (${group.length})`, '')
  let lastFile = ''
  for (const item of group.sort((a, b) => a.file.localeCompare(b.file) || a.question - b.question)) {
    if (item.file !== lastFile) {
      lines.push('', `### ${item.title}`, `\`${item.file}\``, '')
      lastFile = item.file
    }
    lines.push(
      `**Q${item.question}** — answer: \`${item.answer}\` — ${item.flags.join(', ')}`,
      '',
      `> ${item.prompt.replace(/\s+/g, ' ').trim()}`,
      ''
    )
  }
}

fs.writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      scannedAt: new Date().toISOString(),
      totalFillQuestions,
      issueCount: issues.length,
      bySeverity: {
        critical: bySeverity.critical.length,
        moderate: bySeverity.moderate.length,
        minor: bySeverity.minor.length
      },
      examsScanned,
      issues
    },
    null,
    2
  ),
  'utf8'
)
fs.writeFileSync(mdPath, lines.join('\n'), 'utf8')

console.log(`Monthly uploads: ${examsScanned.length} passages with fill questions`)
console.log(`Fill questions: ${totalFillQuestions} | Flagged: ${issues.length}`)
console.log(`  critical: ${bySeverity.critical.length}`)
console.log(`  moderate: ${bySeverity.moderate.length}`)
console.log(`  minor: ${bySeverity.minor.length}`)
console.log(`\nWrote ${mdPath}`)
console.log(`Wrote ${jsonPath}`)
