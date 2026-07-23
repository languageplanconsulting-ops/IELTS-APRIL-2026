#!/usr/bin/env node
/**
 * Enrich weak Thai explanations in the Custom reading bank.
 *
 * Unlike the Cambridge/June-2026 banks, Custom exams store their content
 * ONLY in `parsedPayload` — `rawPassageText` / `rawAnswerKey` are empty
 * strings — so the text-block enricher (enrich-cambridge-reading-explanations.mjs)
 * has nothing to parse. This script mutates parsedPayload questions in place.
 *
 * Run: node scripts/enrich-custom-reading-explanations.mjs [--force]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'
import { isWeakReadingExplanation } from './reading-explanation-criteria.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const force = process.argv.includes('--force')

const modulePath = path.join(root, 'server', 'userProvidedReadingPracticeCustom.mjs')
const exportName = 'USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS'
const mod = await import(pathToFileURL(modulePath).href)
const exams = mod[exportName]

let totalChanged = 0

const nextExams = exams.map((exam) => {
  const payload = exam.parsedPayload
  if (!payload || !Array.isArray(payload.passages)) return exam

  let examChanged = 0
  const passages = payload.passages.map((passage) => {
    const body = (passage.bodyParagraphs || []).join('\n\n')
    const questions = (passage.questions || []).map((question) => {
      const needsWork = force || isWeakReadingExplanation(question)
      if (!needsWork) return question

      const enrich = buildComprehensiveEnrichment({
        body,
        prompt: question.prompt || '',
        answer: question.correctAnswer || '',
        hand: {}
      })

      const next = {
        ...question,
        exactPortion: enrich.exact || question.exactPortion,
        explanationThai: enrich.thai || question.explanationThai,
        paraphrasedVocabulary: enrich.para || question.paraphrasedVocabulary
      }

      if (!isWeakReadingExplanation(next)) {
        examChanged += 1
        return next
      }
      return question
    })
    return { ...passage, questions }
  })

  totalChanged += examChanged
  if (!examChanged) return exam
  return { ...exam, parsedPayload: { ...payload, passages } }
})

fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
console.log(`Custom: enriched ${totalChanged} question(s)`)
