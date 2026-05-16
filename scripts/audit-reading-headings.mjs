/**
 * Audit matching-headings questions: missing list, zero UI options, wrong fill grouping.
 * Run: node scripts/audit-reading-headings.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

const isReadingMatchingHeadingQuestion = (passage, question) => {
  if (!question) return false
  const prompt = String(question.prompt || '').trim()
  const answer = String(question.correctAnswer || '').trim()

  if (
    /^which\s+two\b|^match\s+each\b|^complete the\s+(?:summary|sentences|notes|table)\b|^true\s*\/\s*false|^yes\s*\/\s*no/i.test(
      prompt
    )
  ) {
    return false
  }

  if (/^heading for paragraph/i.test(prompt) || /^heading paragraph/i.test(prompt)) {
    return true
  }
  if (/choose the correct heading/i.test(prompt)) {
    return true
  }
  if (
    READING_ROMAN_HEADING_PATTERN.test(answer) &&
    (/^paragraph\s+[A-G]\b/i.test(prompt) || /^section\s+[A-Z]\b/i.test(prompt))
  ) {
    return true
  }

  return false
}

const extractHeadingOptions = (passage) => {
  const sectionText = String(passage?.questionSectionText || '')
  const listMatch = sectionText.match(/List of Headings\s*\n([\s\S]*?)(?=\n\s*\d+\s*(?:Paragraph|\.|\s))/i)
  const headingSource = listMatch?.[1] || sectionText
  return headingSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^((?:i|ii|iii|iv|v|vi|vii|viii|ix|x))[\).:\-]?\s+(.+)$/i)
      if (!match) return null
      return { letter: match[1].toLowerCase(), text: match[2].trim() }
    })
    .filter(Boolean)
}

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

const issues = {
  noOptions: [],
  missingListInSection: [],
  answerNotInOptions: [],
  sectionHasHeadingTaskButUnclassified: [],
  falsePositiveHeading: []
}

const exams = await loadExams()
let headingCount = 0

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const st = String(passage.questionSectionText || '')
    const hasHeadingTask = /choose the correct heading|list of headings/i.test(st)
    const options = extractHeadingOptions(passage)
    const optionLetters = new Set(options.map((o) => o.letter))

    const headingQs = (passage.questions || []).filter((q) => isReadingMatchingHeadingQuestion(passage, q))
    headingCount += headingQs.length

    if (hasHeadingTask && !st.includes('List of Headings') && options.length < 4) {
      issues.missingListInSection.push({
        examId: exam.id,
        optionsFound: options.length,
        snippet: st.slice(0, 120).replace(/\n/g, ' ')
      })
    }

    if (hasHeadingTask && options.length >= 4) {
      const unclassified = (passage.questions || []).filter((q) => {
        const ans = String(q.correctAnswer || '').trim()
        return READING_ROMAN_HEADING_PATTERN.test(ans) && !isReadingMatchingHeadingQuestion(passage, q)
      })
      unclassified.forEach((q) => {
        issues.sectionHasHeadingTaskButUnclassified.push({
          examId: exam.id,
          q: q.number,
          prompt: q.prompt.slice(0, 60),
          answer: q.correctAnswer
        })
      })
    }

    for (const q of headingQs) {
      if (options.length === 0) {
        issues.noOptions.push({
          examId: exam.id,
          q: q.number,
          prompt: q.prompt.slice(0, 70),
          answer: q.correctAnswer,
          answerType: q.answerType
        })
      }
      const ans = String(q.correctAnswer || '').trim().toLowerCase()
      if (options.length > 0 && ans && !optionLetters.has(ans)) {
        issues.answerNotInOptions.push({
          examId: exam.id,
          q: q.number,
          answer: ans,
          optionLetters: [...optionLetters].join(', ')
        })
      }
    }

    // Possible false positives: classified as heading but answer is not roman
    for (const q of passage.questions || []) {
      if (!isReadingMatchingHeadingQuestion(passage, q)) continue
      const ans = String(q.correctAnswer || '').trim()
      if (!READING_ROMAN_HEADING_PATTERN.test(ans) && !/^heading/i.test(q.prompt)) {
        issues.falsePositiveHeading.push({
          examId: exam.id,
          q: q.number,
          prompt: q.prompt.slice(0, 70),
          answer: ans
        })
      }
    }
  }
}

const outPath = path.join(__dirname, 'reading-headings-audit.json')
fs.writeFileSync(outPath, JSON.stringify(issues, null, 2), 'utf8')

console.log(`Scanned ${exams.length} exams · ${headingCount} matching-heading questions\n`)

const print = (title, list) => {
  console.log(`## ${title} (${list.length})`)
  if (!list.length) {
    console.log('None.\n')
    return
  }
  const byExam = new Map()
  list.forEach((item) => {
    const key = item.examId
    if (!byExam.has(key)) byExam.set(key, [])
    byExam.get(key).push(item)
  })
  for (const [examId, items] of byExam) {
    console.log(`\n### ${examId}`)
    items.forEach((i) => {
      const parts = Object.entries(i)
        .filter(([k]) => k !== 'examId')
        .map(([k, v]) => `${k}: ${v}`)
      console.log(`  - ${parts.join(' · ')}`)
    })
  }
  console.log('')
}

print('CRITICAL: Heading questions with ZERO choice options (broken UI)', issues.noOptions)
print('CRITICAL: Passage has heading task but no List of Headings in text', issues.missingListInSection)
print('WARN: Correct answer not in parsed heading list', issues.answerNotInOptions)
print('WARN: Roman-numeral answer not classified as heading', issues.sectionHasHeadingTaskButUnclassified)
print('INFO: Possible false-positive heading classification', issues.falsePositiveHeading)

console.log(`Full JSON: ${outPath}`)
