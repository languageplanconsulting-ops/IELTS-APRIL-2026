#!/usr/bin/env node
/**
 * Bake paraphrased summary text into Cambridge / generated fill-blank sources.
 * Skips hand-crafted journey intensive sets (stages 1–15) — those stay as authored.
 * Run: npx tsx scripts/apply-fill-blank-paraphrase-to-sources.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { paraphraseFillBlankSet } from '../src/readingFillBlankParaphrase.ts'
import { MANUAL_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const generatedBankPath = path.join(root, 'src/generated/readingNewFillBlankSets.json')
const readingQuestionsPath = path.join(root, 'src/readingNewFillBlankQuestions.ts')

const generatedSets = fs.existsSync(generatedBankPath)
  ? JSON.parse(fs.readFileSync(generatedBankPath, 'utf8'))
  : []

const isJourneyIntensive = (set) => /^journey-normal-stage-(?:[1-9]|1[0-5])$/.test(set.examId)

const cambridgeManualSets = MANUAL_FILL_BLANK_SETS.filter((set) => !isJourneyIntensive(set))

const paraphrasedCambridge = cambridgeManualSets.map((set) => paraphraseFillBlankSet(set))
const paraphrasedGenerated = generatedSets.map((set) =>
  isJourneyIntensive(set) ? set : paraphraseFillBlankSet(set)
)

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const escapeTsString = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')

const replaceSummaryTextInFile = (filePath, originalSets, paraphrasedSets) => {
  let content = fs.readFileSync(filePath, 'utf8')
  let replacements = 0

  for (let setIndex = 0; setIndex < originalSets.length; setIndex += 1) {
    const set = originalSets[setIndex]
    const paraphrased = paraphrasedSets[setIndex]
    if (!paraphrased) continue

    for (let lineIndex = 0; lineIndex < set.summaryLines.length; lineIndex += 1) {
      const oldText = set.summaryLines[lineIndex].text
      const newText = paraphrased.summaryLines[lineIndex]?.text
      if (!newText || oldText === newText) continue

      const patterns = [
        `text:\n          '${escapeTsString(oldText)}'`,
        `text: '${escapeTsString(oldText)}'`,
        `text:\n          "${oldText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`,
        `text: "${oldText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
      ]
      const replacement = `text:\n          '${escapeTsString(newText)}'`

      let replaced = false
      for (const pattern of patterns) {
        if (!content.includes(pattern)) continue
        content = content.replace(pattern, replacement)
        replacements += 1
        replaced = true
        break
      }

      if (!replaced) {
        const loose = new RegExp(
          `text:\\s*(?:'${escapeRegExp(escapeTsString(oldText))}'|"${escapeRegExp(oldText.replace(/\\/g, '\\\\').replace(/"/g, '\\"'))}")`,
          'g'
        )
        if (loose.test(content)) {
          content = content.replace(loose, `text: '${escapeTsString(newText)}'`)
          replacements += 1
        }
      }
    }
  }

  fs.writeFileSync(filePath, content)
  return replacements
}

fs.writeFileSync(generatedBankPath, `${JSON.stringify(paraphrasedGenerated, null, 2)}\n`)

const replacements = replaceSummaryTextInFile(
  readingQuestionsPath,
  cambridgeManualSets,
  paraphrasedCambridge
)

console.log(`Paraphrased ${cambridgeManualSets.length} Cambridge/manual fill-blank sets in TS`)
console.log(`Paraphrased ${paraphrasedGenerated.filter((set) => !isJourneyIntensive(set)).length} generated JSON sets`)
console.log(`Updated ${replacements} summary lines in readingNewFillBlankQuestions.ts`)
