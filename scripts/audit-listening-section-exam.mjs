#!/usr/bin/env node
/**
 * Audits listening foundation + builder sets for full audioscripts in the section exam UI.
 * Run: node scripts/audit-listening-section-exam.mjs
 */

import { CAMBRIDGE_10_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge10Section2.ts'
import { CAMBRIDGE_10_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge10Section4.ts'
import { CAMBRIDGE_11_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge11Section2.ts'
import { CAMBRIDGE_11_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge11Section4.ts'
import { CAMBRIDGE_12_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge12Section2.ts'
import { CAMBRIDGE_12_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge12Section4.ts'
import { CAMBRIDGE_13_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge13Section2.ts'
import { CAMBRIDGE_13_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge13Section4.ts'
import { CAMBRIDGE_14_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge14Section2.ts'
import { CAMBRIDGE_14_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge14Section4.ts'
import { CAMBRIDGE_16_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge16Section2.ts'
import { CAMBRIDGE_17_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge17Section2.ts'
import { CAMBRIDGE_17_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge17Section4.ts'
import { CAMBRIDGE_18_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge18Section2.ts'
import { LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationData.ts'
import { CAMBRIDGE_12_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge12Data.ts'
import { CAMBRIDGE_13_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge13Data.ts'
import { CAMBRIDGE_17_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge17Data.ts'
import { CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridgeSafeData.ts'
import {
  foundationSetToExamConfig,
  builderTaskToExamQuestion,
  buildListeningSectionExamGroups
} from '../src/listeningSectionExamModel.ts'
import {
  isListeningFoundationAudioscriptComplete,
  isListeningExcerptDrillSet,
  LISTENING_SECTION_MIN_SCRIPT_CHARS,
  resolveListeningFoundationAudioscript
} from '../src/listeningFoundationAudioscript.ts'

const BUILDER_SETS = [
  CAMBRIDGE_10_SECTION_2_EXAM_SET,
  CAMBRIDGE_10_SECTION_4_EXAM_SET,
  CAMBRIDGE_11_SECTION_2_EXAM_SET,
  CAMBRIDGE_11_SECTION_4_EXAM_SET,
  CAMBRIDGE_12_SECTION_2_EXAM_SET,
  CAMBRIDGE_12_SECTION_4_EXAM_SET,
  CAMBRIDGE_13_SECTION_2_EXAM_SET,
  CAMBRIDGE_13_SECTION_4_EXAM_SET,
  CAMBRIDGE_14_SECTION_2_EXAM_SET,
  CAMBRIDGE_14_SECTION_4_EXAM_SET,
  CAMBRIDGE_16_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_4_EXAM_SET,
  CAMBRIDGE_18_SECTION_2_EXAM_SET
]

const ALL_FOUNDATION = [
  ...LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS
]

const errors = []
const warnings = []

const minFor = (section) => LISTENING_SECTION_MIN_SCRIPT_CHARS[section] ?? 1200

console.log('=== Builder exam sets (scriptParagraphs) ===\n')
const builderSections = new Set(BUILDER_SETS.map((set) => set.sectionNumber))
console.log(`Sections in builder pipeline: ${[...builderSections].sort().join(', ')}`)
if (!builderSections.has(3)) {
  warnings.push('No Cambridge builder Section 3 sets in LISTENING_BUILDER_EXAM_SETS (only 2 and 4).')
}

for (const set of BUILDER_SETS) {
  for (const test of set.tests) {
    const script = test.scriptParagraphs.join('\n\n')
    const label = `Cam ${set.bookNumber} S${set.sectionNumber} Test ${test.testNumber}`
    const min = minFor(set.sectionNumber)
    const tasks = test.tasks.length
  const groups = buildListeningSectionExamGroups(
      test.tasks.map((task) => builderTaskToExamQuestion(task, test.tasks, test.id))
    )
    if (script.length < min) {
      errors.push(`${label}: script ${script.length} chars (min ${min})`)
    } else if (tasks < 10) {
      warnings.push(`${label}: only ${tasks} tasks`)
    } else {
      console.log(`OK  ${label}  script=${script.length}  tasks=${tasks}  groups=${groups.length}`)
    }
  }
}

console.log('\n=== Foundation sets (exam UI audioscript) ===\n')
for (const set of ALL_FOUNDATION) {
  const script = resolveListeningFoundationAudioscript(set)
  const config = foundationSetToExamConfig(set)
  const min = minFor(set.section)
  const ok = isListeningFoundationAudioscriptComplete(set, script)
  const excerpt = isListeningExcerptDrillSet(set) ? ' [excerpt drill]' : ''
  const line = `${set.section} | ${set.id.slice(0, 52)} | ${script.length} chars | Q${set.questions.length}${excerpt}`
  if (!ok) {
    errors.push(`${line} — below min ${min}`)
  } else if (config.passage.length !== script.length) {
    errors.push(`${line} — config mismatch (${config.passage.length})`)
  } else {
    console.log(`OK  ${line}`)
  }
}

console.log('\n=== Summary ===')
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`)
  warnings.forEach((item) => console.log(`  - ${item}`))
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`)
  errors.forEach((item) => console.log(`  - ${item}`))
  process.exit(1)
}
console.log('\nAll listening section exams have adequate audioscripts.')
