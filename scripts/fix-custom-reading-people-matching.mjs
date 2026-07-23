#!/usr/bin/env node
/**
 * The generic quote-ranking enricher does not know about "match each
 * statement with the correct person" questions (List of people, A-D) — it
 * picked plausible-looking but WRONG evidence sentences for all of them.
 * This script re-derives explanations for just that question type: find the
 * sentence in the passage body that actually names/quotes the matched
 * person, so the "evidence" is real.
 *
 * Run: node scripts/fix-custom-reading-people-matching.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const modulePath = path.join(root, 'server', 'userProvidedReadingPracticeCustom.mjs')
const exportName = 'USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS'
const mod = await import(pathToFileURL(modulePath).href)
const exams = mod[exportName]

const splitSentences = (body) =>
  String(body || '')
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

const clip = (text, max) => {
  const t = String(text || '').trim()
  return t.length > max ? `${t.slice(0, max).trim()}…` : t
}

const extractPeopleList = (questionSectionText) => {
  const m = /List of people\n((?:[A-Z]\s{1,4}.+\n?)+)/.exec(questionSectionText || '')
  if (!m) return null
  const map = {}
  for (const line of m[1].split('\n')) {
    const lm = /^([A-Z])\s{1,4}(.+)$/.exec(line.trim())
    if (lm) map[lm[1]] = lm[2].trim()
  }
  return map
}

let totalFixed = 0

const nextExams = exams.map((exam) => {
  const payload = exam.parsedPayload
  if (!payload || !Array.isArray(payload.passages)) return exam

  let examFixed = 0
  const passages = payload.passages.map((passage) => {
    const peopleMap = extractPeopleList(passage.questionSectionText || '')
    if (!peopleMap) return passage

    const body = (passage.bodyParagraphs || []).join(' ')
    const sentences = splitSentences(body)

    const questions = (passage.questions || []).map((question) => {
      const answer = String(question.correctAnswer || '').trim()
      const name = peopleMap[answer]
      if (!name) return question

      // Match on the fullest distinguishing token(s) of the name — surname
      // for people, first significant word for organisations.
      const nameTokens = name.replace(/^(Dr|Professor|Prof\.?)\s+/i, '').split(/\s+/)
      const surname = nameTokens[nameTokens.length - 1]
      const candidates = sentences.filter((s) => s.includes(name) || s.includes(surname))
      if (!candidates.length) return question

      // Prefer the sentence with a quoted clause (an actual claim/quote),
      // else the longest mention (most likely to carry the substantive point).
      const withQuote = candidates.find((s) => /['"]/.test(s))
      const evidence = withQuote || candidates.sort((a, b) => b.length - a.length)[0]
      const snippet = clip(evidence, 220)
      const promptText = question.prompt || ''

      const thai = `ข้อความในข้อกล่าวถึง "${clip(promptText, 120)}" ซึ่งตรงกับสิ่งที่ ${name} พูด/เสนอไว้ในบทความว่า "${snippet}" จึงตอบ ${answer} (${name})`
      const para = `${clip(promptText, 40)} = ${name} = ${answer}`

      examFixed += 1
      return {
        ...question,
        exactPortion: evidence,
        explanationThai: thai,
        paraphrasedVocabulary: para
      }
    })
    return { ...passage, questions }
  })

  totalFixed += examFixed
  if (!examFixed) return exam
  return { ...exam, parsedPayload: { ...payload, passages } }
})

fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
console.log(`Custom: fixed ${totalFixed} "match to person" question(s)`)
