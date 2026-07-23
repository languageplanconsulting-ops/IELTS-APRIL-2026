/**
 * Enrich Cambridge reading Thai explanations to match Cam 17/19 criteria:
 * - quoted passage evidence in explanationThai
 * - meaningful paraphrasedVocabulary (not HTML artifacts)
 * - clean question prompts
 *
 * Run: node scripts/enrich-cambridge-reading-explanations.mjs [book...] [--force]
 * Example: node scripts/enrich-cambridge-reading-explanations.mjs 11 14 15 16
 *          node scripts/enrich-cambridge-reading-explanations.mjs 12 13 17 19
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'
import { isWeakReadingExplanation } from './reading-explanation-criteria.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const { buildReadingExamPayload } = await import(
  pathToFileURL(path.join(root, 'server/readingImportUtils.mjs')).href
)

const DEFAULT_BOOKS = [11, 12, 13, 14, 15, 16, 17, 19]
const args = process.argv.slice(2)
const force = args.includes('--force')
const books = args.filter((arg) => /^\d+$/.test(arg)).map(Number)
const targetBooks = books.length ? books : DEFAULT_BOOKS

const synthesizePrompt = (fields, passageTitle = '') => {
  const cleaned = cleanBrokenPrompt(fields.prompt, fields.number)
  if (cleaned && !/^Question\s+\d+$/i.test(cleaned)) return cleaned

  const answer = String(fields.correctAnswer || '').trim()
  const title = String(passageTitle || '').replace(/^>\s*/, '').trim()
  if (/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(answer)) {
    return `Statement ${fields.number}: refer to the passage and decide if this is true, false, or not given`
  }
  if (/^[A-H]$/.test(answer)) {
    return `Which paragraph contains the following information? (Question ${fields.number})`
  }
  if (/^[A-J]$/.test(answer)) {
    return `Which phrase or heading best matches? (Question ${fields.number})`
  }
  if (/^[A-E]$/.test(answer)) {
    return `Which TWO options are correct? (Question ${fields.number})`
  }
  if (title) {
    return `Complete the summary/diagram for "${title}" — ONE WORD ONLY from the passage (Question ${fields.number})`
  }
  return `Complete using words from the passage (Question ${fields.number})`
}

const needsComprehensiveUpgrade = (candidate) => {
  const reason = isWeakReadingExplanation(candidate)
  if (reason) return true
  if (/^Question \d+$/i.test(candidate.prompt)) return true
  if (/Question \d+ →/.test(candidate.paraphrasedVocabulary || '')) return true
  if (!/ข้อความในข้อว่า|ในข้อให้เติม|ย่อหน้า [A-H] มีเนื้อหา|มุมมองของผู้เขียนในบทความ|คำถาม:|คำถามถามว่า/.test(candidate.explanationThai || '')) {
    return true
  }
  return false
}

const usableExactHint = (exactPortion) => {
  const hint = String(exactPortion || '').trim().replace(/^["']|["']$/g, '')
  if (!hint || hint.length < 20) return undefined
  if (/^Question\s+\d+$/i.test(hint)) return undefined
  if (/^…/.test(hint)) return undefined
  return hint
}

const cleanBrokenPrompt = (raw, number) => {
  let text = String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/question-number-\d+["']?\s*class\s*=\s*["']?ielts-reading-question-number["']?>\s*\d+\s*/gi, '')
    .replace(new RegExp(`^${number}\\s*`, 'i'), '')
    .replace(/\s+A\s*(?:TRUE|FALSE|NOT GIVEN)(?:\s+B\s*(?:TRUE|FALSE|NOT GIVEN))?(?:\s+C\s*(?:NOT GIVEN))?[\s\S]*$/i, '')
      .replace(/\s+A(?:TRUE|FALSE|NOT GIVEN)[\s\S]*$/i, '')
      .replace(/\s+A\s+[A-Z][\w\s,.'()-]{8,}(?:\s+B\s+[A-Z][\w\s,.'()-]{8,})?[\s\S]*$/i, '')
    .replace(/Drop heading here[A-H]\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text || /^Question\s+\d+$/i.test(text)) {
    return `Question ${number}`
  }
  return text
}

const parseAnswerKeySegments = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  return [...source.matchAll(/(?:^|\n)(Question\s+\d+:\s*[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map((match) =>
    String(match[1] || '').trim()
  )
}

const parseSegmentFields = (segment) => {
  const number = Number(segment.match(/^Question\s+(\d+):/im)?.[1] || 0)
  const prompt = String(
    segment.match(
      /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
    )?.[1] || ''
  ).trim()
  const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
  const acceptedAnswers = String(segment.match(/Accepted Answers:\s*(.+)/i)?.[1] || '').trim()
  const answerGroup = String(segment.match(/Answer Group:\s*(.+)/i)?.[1] || '').trim()
  const exactPortion = String(
    segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')
  const explanationThai = String(
    segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)?.[1] || ''
  ).trim()
  const paraphrasedVocabulary = String(segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)?.[1] || '').trim()

  return {
    number,
    prompt,
    correctAnswer,
    acceptedAnswers,
    answerGroup,
    exactPortion,
    explanationThai,
    paraphrasedVocabulary
  }
}

const makeBlock = ({ number, prompt, answer, accepted, answerGroup, exact, thai, para }) =>
  `Question ${number}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: ${answerGroup}

Exact Portion: "${String(exact || prompt).replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const enrichExam = (exam, { force: forceAll }) => {
  const parsed = buildReadingExamPayload(exam)
  const passage = parsed.passages[0]
  if (!passage) return { exam, changed: 0 }

  const body = passage.bodyParagraphs.join('\n\n')
  const passageTitle = passage.title.replace(/^>\s*/, '').trim()
  const passageNum = passage.number
  const segments = parseAnswerKeySegments(exam.rawAnswerKey)
  let changed = 0

  const blocks = segments.map((segment) => {
    const fields = parseSegmentFields(segment)
    const questionSectionText = passage.questionSectionText || ''
    const answerType = fields.correctAnswer.match(/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i)
      ? fields.correctAnswer.toUpperCase() === 'NOT GIVEN'
        ? questionSectionText.match(/\bYES\b/i) && questionSectionText.match(/\bNO\b/i)
          ? 'yes-no-not-given'
          : 'true-false-not-given'
        : ['YES', 'NO'].includes(fields.correctAnswer.toUpperCase())
          ? 'yes-no-not-given'
          : 'true-false-not-given'
      : /^[A-H]$/.test(fields.correctAnswer)
        ? 'multiple-choice'
        : 'text'

    const candidate = {
      ...fields,
      answerType,
      explanationThai: fields.explanationThai,
      paraphrasedVocabulary: fields.paraphrasedVocabulary,
      exactPortion: fields.exactPortion
    }

    const needsWork = forceAll || needsComprehensiveUpgrade(candidate)
    if (!needsWork) return segment

    const promptRaw =
      cleanBrokenPrompt(fields.prompt, fields.number) &&
      !/^Question\s+\d+$/i.test(cleanBrokenPrompt(fields.prompt, fields.number))
        ? cleanBrokenPrompt(fields.prompt, fields.number)
        : synthesizePrompt(fields, passageTitle)
    const prompt =
      candidate.answerType === 'text' && promptRaw && !/…/.test(promptRaw) && !/\?$/.test(promptRaw)
        ? `${promptRaw} …`
        : promptRaw
    const enrich = buildComprehensiveEnrichment({
      body,
      prompt,
      answer: fields.correctAnswer,
      hand: usableExactHint(fields.exactPortion) ? { exact: usableExactHint(fields.exactPortion) } : {}
    })

    changed += 1
    return makeBlock({
      number: fields.number,
      prompt,
      answer: fields.correctAnswer,
      accepted: fields.acceptedAnswers || fields.correctAnswer,
      answerGroup: fields.answerGroup,
      exact: enrich.exact,
      thai: enrich.thai,
      para: enrich.para
    })
  })

  if (!changed) return { exam, changed: 0 }

  const rawAnswerKey = `READING PASSAGE ${passageNum}: ${passageTitle}\n\n${blocks.join('\n\n')}`
  // Drop the stale parsedPayload cache: buildReadingExamPayload() prefers it over
  // rawAnswerKey when present, so leaving it in place would silently discard this edit.
  const { parsedPayload, ...rest } = exam
  return {
    exam: { ...rest, rawAnswerKey, updatedAt: new Date().toISOString() },
    changed
  }
}

let totalChanged = 0

for (const book of targetBooks) {
  const modulePath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(pathToFileURL(modulePath).href)
  const exams = mod[exportName]
  let bookChanged = 0

  const nextExams = exams.map((exam) => {
    const { exam: enriched, changed } = enrichExam(exam, { force })
    bookChanged += changed
    return enriched
  })

  totalChanged += bookChanged
  fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
  console.log(`Cambridge ${book}: enriched ${bookChanged} question(s)`)
}

console.log(`Done. ${totalChanged} explanations updated across ${targetBooks.length} book(s).`)
