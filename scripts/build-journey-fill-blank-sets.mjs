#!/usr/bin/env node
/**
 * Build journey fill-blank override sets for Quest Log stages.
 * Prefers hand-authored manual sets, then generates fresh from source passages.
 *
 * Run: npx tsx scripts/build-journey-fill-blank-sets.mjs [maxStage]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildJourneyStageDefinitions,
  buildJourneyExamRecords,
  orderJourneySourceExams,
  getJourneyPassageQuestionOffset
} from '../src/readingJourney.ts'
import { MANUAL_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import {
  buildThaiGlossary,
  findBestSourceSet,
  generateFillBlankSet,
  isLetterFillGroup,
  remapSetToJourney
} from './lib/fillBlankSetGenerator.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outputPath = path.join(root, 'src/generated/journeyFillBlankSets.json')
const generatedBankPath = path.join(root, 'src/generated/readingNewFillBlankSets.json')
const maxStage = Math.max(1, Number(process.argv[2] || 5))

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  pool.push(...mod[key].filter((exam) => exam.category === 'normal'))
}

const generatedSets = fs.existsSync(generatedBankPath)
  ? JSON.parse(fs.readFileSync(generatedBankPath, 'utf8'))
  : []
const thaiGlossary = buildThaiGlossary(pool)
const noop = () => false

const definitions = buildJourneyStageDefinitions(pool, 30).slice(0, maxStage)
const journeyExams = buildJourneyExamRecords(pool, 30)
const journeySets = []
const warnings = []

for (const definition of definitions) {
  const journeyExam = journeyExams.find((exam) => exam.id === definition.id)
  if (!journeyExam) continue

  if (definition.intensive || definition.stageNumber <= 15) {
    for (let index = 0; index < 2; index += 1) {
      const slot = index + 1
      const passage = journeyExam.parsedPayload.passages[index]
      if (!passage) continue

      const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, definition.id)
      for (const group of groups) {
        const fillQuestions = group.questions.filter((question) => question.answerType === 'text')
        if (!fillQuestions.length || isLetterFillGroup(fillQuestions)) continue

        const generated = generateFillBlankSet({
          examId: definition.id,
          passage,
          fillQuestions,
          groupInstruction: group.instruction,
          thaiGlossary
        })
        if (generated) journeySets.push(generated)
      }
    }
    continue
  }

  const sourceExams = definition.sourceExamIds
    .map((examId) => pool.find((exam) => exam.id === examId))
    .filter(Boolean)
  if (sourceExams.length !== 2) continue

  const orderedSources = orderJourneySourceExams(sourceExams)

  for (let index = 0; index < 2; index += 1) {
    const slot = index + 1
    const passage = journeyExam.parsedPayload.passages[index]
    const sourceExam = orderedSources[index]
    const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
    if (!passage || !sourceExam || !sourcePassage) continue

    const offset = getJourneyPassageQuestionOffset(sourcePassage, slot)
    const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, definition.id)

    for (const group of groups) {
      const fillQuestions = group.questions.filter((question) => question.answerType === 'text')
      if (!fillQuestions.length) continue
      if (isLetterFillGroup(fillQuestions)) {
        warnings.push(
          `Stage ${definition.stageNumber} P${slot} Q${group.start}-${group.end}: skipped (letter-based fill)`
        )
        continue
      }

      const sourceStart = group.start - offset
      const sourceEnd = group.end - offset
      let sourceSet = findBestSourceSet(
        sourceExam.id,
        sourceStart,
        sourceEnd,
        MANUAL_FILL_BLANK_SETS,
        generatedSets
      )

      if (!sourceSet) {
        sourceSet = generateFillBlankSet({
          examId: sourceExam.id,
          passage: sourcePassage,
          fillQuestions: fillQuestions.map((question) => ({
            ...question,
            number: question.number - offset
          })),
          groupInstruction: group.instruction,
          thaiGlossary
        })
      }

      const remapped = remapSetToJourney(sourceSet, {
        journeyExamId: definition.id,
        passageNumber: passage.number,
        journeyStart: group.start,
        journeyEnd: group.end
      })

      if (!remapped) {
        warnings.push(
          `Stage ${definition.stageNumber} P${slot} Q${group.start}-${group.end}: remap failed (${sourceExam.id} ${sourceStart}-${sourceEnd})`
        )
        continue
      }

      journeySets.push(remapped)
    }
  }
}

let existingTail = []
if (fs.existsSync(outputPath) && maxStage < 30) {
  const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  existingTail = existing.filter((set) => {
    const stage = Number(String(set.examId || '').replace('journey-normal-stage-', ''))
    return stage > maxStage
  })
}

const merged = [...journeySets, ...existingTail]

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')

const questionTotal = journeySets.reduce((sum, set) => sum + set.questions.length, 0)
console.log(
  `Wrote ${journeySets.length} journey fill-blank sets (${questionTotal} questions) for stages 1-${maxStage}`
)
if (existingTail.length) {
  console.log(`Kept ${existingTail.length} sets for stages ${maxStage + 1}+`)
}
if (warnings.length) {
  console.warn('Warnings:')
  for (const warning of warnings) console.warn(`  - ${warning}`)
}
