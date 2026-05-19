/**
 * Ensures the first question in matching-information / matching-heading groups
 * does not target paragraphs A or B (indices 0–1).
 */
import fs from 'node:fs'
import path from 'node:path'

const IMPORT_DIR = path.resolve('cambridge-reading-imports')

const extractAnswerKeyBlock = (key, number) => {
  const next = number + 1
  const pattern = new RegExp(
    `Question\\s+${number}:\\s*([\\s\\S]*?)(?=\\n\\nQuestion\\s+${next}:|$)`,
    'i'
  )
  const match = String(key || '').match(pattern)
  if (!match) return null
  return {
    header: `Question ${number}:`,
    body: match[1].trimStart(),
    full: `Question ${number}: ${match[1].trimStart()}`
  }
}

const replaceAnswerKeyBlock = (key, number, newBody) => {
  const next = number + 1
  const pattern = new RegExp(
    `Question\\s+${number}:\\s*[\\s\\S]*?(?=\\n\\nQuestion\\s+${next}:|$)`,
    'i'
  )
  return key.replace(pattern, `Question ${number}: ${newBody}`)
}

const getInformationAnswerLetter = (body) => {
  const match = body.match(/Correct Answer:\s*([A-G])/i)
  return match?.[1]?.toUpperCase() || ''
}

const getHeadingParagraphLetter = (body) => {
  const match = body.match(/^(?:Paragraph|Section)\s+([A-G])/i)
  return match?.[1]?.toUpperCase() || ''
}

const extractPassageQuestionLine = (text, number) => {
  const pattern = new RegExp(`(?:^|\\n)(${number})\\s+([^\\n]+)`, 'm')
  const match = String(text || '').match(pattern)
  if (!match) return null
  return { number: match[1], line: match[2].trim(), full: `${match[1]} ${match[2].trim()}` }
}

const replacePassageQuestionLine = (text, number, newLineBody) => {
  const pattern = new RegExp(`((?:^|\\n)${number}\\s+)([^\\n]+)`, 'm')
  return text.replace(pattern, `$1${newLineBody}`)
}

const findMatchingInformationRange = (text) => {
  const pattern =
    /Questions?\s+(\d+)\s*[-–]\s*(\d+)(?=[\s\S]{0,400}?Which paragraph contains the following information)/gi
  let best = null
  for (const match of text.matchAll(pattern)) {
    const start = Number(match[1])
    const end = Number(match[2])
    if (!best || end - start < best.end - best.start) {
      best = { start, end, kind: 'information' }
    }
  }
  return best
}

const isHeadingIntroSection = (letter) => letter === 'A' || letter === 'B'

const findMatchingHeadingRange = (passageText, answerKey) => {
  const pattern =
    /Questions?\s+(\d+)\s*[-–]\s*(\d+)(?=[\s\S]{0,500}?Choose the correct heading)/gi
  let start = null
  let sectionEnd = null
  for (const match of passageText.matchAll(pattern)) {
    const candidateStart = Number(match[1])
    const candidateEnd = Number(match[2])
    if (start === null || candidateEnd - candidateStart < sectionEnd - start) {
      start = candidateStart
      sectionEnd = candidateEnd
    }
  }
  if (start === null) return null
  const firstBlock = extractAnswerKeyBlock(answerKey, start)
  if (!firstBlock || !/^(?:Paragraph|Section)\s+[A-G]/i.test(firstBlock.body)) return null
  let last = start
  for (let n = start + 1; n <= sectionEnd; n += 1) {
    const block = extractAnswerKeyBlock(answerKey, n)
    if (block && /^(?:Paragraph|Section)\s+[A-G]/i.test(block.body)) last = n
    else break
  }
  return { start, end: last, kind: 'heading' }
}

const swapQuestion = (exam, a, b) => {
  let key = exam.rawAnswerKey
  const blockA = extractAnswerKeyBlock(key, a)
  const blockB = extractAnswerKeyBlock(key, b)
  if (!blockA || !blockB) {
    throw new Error(`Missing answer key blocks ${a} or ${b}`)
  }
  key = replaceAnswerKeyBlock(key, a, blockB.body)
  key = replaceAnswerKeyBlock(key, b, blockA.body)
  exam.rawAnswerKey = key

  let passage = exam.rawPassageText
  const lineA = extractPassageQuestionLine(passage, a)
  const lineB = extractPassageQuestionLine(passage, b)
  if (lineA && lineB) {
    passage = replacePassageQuestionLine(passage, a, lineB.line)
    passage = replacePassageQuestionLine(passage, b, lineA.line)
    exam.rawPassageText = passage
  }
}

const fixInformationGroup = (exam, range) => {
  const first = range.start
  const firstBlock = extractAnswerKeyBlock(exam.rawAnswerKey, first)
  if (!firstBlock) return false
  const firstAnswer = getInformationAnswerLetter(firstBlock.body)
  if (firstAnswer !== 'A' && firstAnswer !== 'B') return false

  let partner = null
  for (let n = first + 1; n <= range.end; n += 1) {
    const block = extractAnswerKeyBlock(exam.rawAnswerKey, n)
    if (!block) continue
    const letter = getInformationAnswerLetter(block.body)
    if (letter && letter !== 'A' && letter !== 'B') {
      partner = n
      break
    }
  }
  if (!partner) {
    console.warn(`  No C+ partner found for Q${first} in ${exam.title}`)
    return false
  }
  swapQuestion(exam, first, partner)
  return true
}

const fixHeadingGroup = (exam, range) => {
  const first = range.start
  const firstBlock = extractAnswerKeyBlock(exam.rawAnswerKey, first)
  if (!firstBlock) return false
  const firstPara = getHeadingParagraphLetter(firstBlock.body)
  if (!isHeadingIntroSection(firstPara)) return false

  let partner = null
  for (let n = first + 1; n <= range.end; n += 1) {
    const block = extractAnswerKeyBlock(exam.rawAnswerKey, n)
    if (!block) continue
    const para = getHeadingParagraphLetter(block.body)
    if (para === 'C' || (para > 'C' && para <= 'G')) {
      partner = n
      break
    }
  }
  if (!partner) {
    console.warn(`  No paragraph C+ partner for heading Q${first} in ${exam.title}`)
    return false
  }

  swapQuestion(exam, first, partner)
  return true
}

const auditExam = (exam) => {
  const infoRange = findMatchingInformationRange(exam.rawPassageText)
  if (infoRange) {
    const block = extractAnswerKeyBlock(exam.rawAnswerKey, infoRange.start)
    const letter = getInformationAnswerLetter(block?.body || '')
    if (letter === 'A' || letter === 'B') {
      return { kind: 'information', letter, range: infoRange }
    }
  }
  const headingRange = findMatchingHeadingRange(exam.rawPassageText, exam.rawAnswerKey)
  if (headingRange) {
    const block = extractAnswerKeyBlock(exam.rawAnswerKey, headingRange.start)
    const para = getHeadingParagraphLetter(block?.body || '')
    if (isHeadingIntroSection(para)) {
      return { kind: 'heading', para, range: headingRange }
    }
  }
  return null
}

const files = fs
  .readdirSync(IMPORT_DIR)
  .filter((name) => name.endsWith('.json') && name.includes('passage-2'))

let fixed = 0
for (const file of files) {
  const filePath = path.join(IMPORT_DIR, file)
  const exams = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let changed = false
  for (const exam of exams) {
    const issue = auditExam(exam)
    if (!issue) continue
    const ok =
      issue.kind === 'information'
        ? fixInformationGroup(exam, issue.range)
        : fixHeadingGroup(exam, issue.range)
    if (ok) {
      const still = auditExam(exam)
      if (still) {
        console.error(`FAILED verify after fix: ${file} – ${exam.title}`)
      } else {
        console.log(`Fixed ${file} (${issue.kind}, Q${issue.range.start})`)
        changed = true
        fixed += 1
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(exams, null, 2)}\n`)
  }
}

console.log(`Done. Fixed ${fixed} exam(s).`)
