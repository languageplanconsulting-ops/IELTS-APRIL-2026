import fs from 'node:fs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'

const APPLY = process.argv.includes('--apply')

const FILES = [
  { path: 'server/userProvidedReadingPracticeCambridge11.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS },
  { path: 'server/userProvidedReadingPracticeCambridge12.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS },
  { path: 'server/userProvidedReadingPracticeCambridge13.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS },
  { path: 'server/userProvidedReadingPracticeCambridge14.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS },
  { path: 'server/userProvidedReadingPracticeCambridge15.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS },
  { path: 'server/userProvidedReadingPracticeCambridge17.mjs', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS }
]

function findOverlap(title, body0) {
  const titleWords = [...title.matchAll(/\S+/g)]
  const bodyWords = [...body0.matchAll(/\S+/g)]
  const maxN = Math.min(10, titleWords.length, bodyWords.length)
  for (let n = maxN; n >= 3; n--) {
    const titleTail = titleWords.slice(-n)
    const bodyHead = bodyWords.slice(0, n)
    const titleTailStr = titleTail.map((m) => m[0]).join(' ').toLowerCase()
    const bodyHeadStr = bodyHead.map((m) => m[0]).join(' ').toLowerCase()
    if (titleTailStr === bodyHeadStr) {
      const titleCutIndex = titleTail[0].index
      const lastBodyMatch = bodyHead[bodyHead.length - 1]
      const bodyCutEndIndex = lastBodyMatch.index + lastBodyMatch[0].length
      return { titleCutIndex, bodyCutEndIndex, n }
    }
  }
  return null
}

let totalFixed = 0
let totalSkipped = 0

for (const file of FILES) {
  let source = fs.readFileSync(file.path, 'utf8')
  let fileChanges = 0

  for (const exam of file.exams) {
    for (const passage of exam.parsedPayload?.passages || []) {
      const title = String(passage.title || '')
      const body0 = String(passage.bodyParagraphs?.[0] || '')
      const overlap = findOverlap(title, body0)
      if (!overlap) continue

      const newTitle = title.slice(0, overlap.titleCutIndex).trim()
      const newBody0 = body0.slice(overlap.bodyCutEndIndex).trim()

      const safe =
        newTitle.length >= 3 &&
        newTitle.length < 120 &&
        newBody0.length >= 30 &&
        /^[A-Z0-9"'“]/.test(newBody0)

      console.log(`\n[${exam.id}] passage ${passage.number} (overlap ${overlap.n} words) ${safe ? 'OK' : 'SKIP-UNSAFE'}`)
      console.log(`  title: "${title}"`)
      console.log(`      -> "${newTitle}"`)
      console.log(`  body:  "${body0.slice(0, 90)}..."`)
      console.log(`      -> "${newBody0.slice(0, 90)}..."`)

      if (!safe) {
        totalSkipped += 1
        continue
      }

      totalFixed += 1

      if (APPLY) {
        const oldTitleJson = JSON.stringify(title)
        const newTitleJson = JSON.stringify(newTitle)
        const oldBodyJson = JSON.stringify(body0)
        const newBodyJson = JSON.stringify(newBody0)

        const titleOccurrences = source.split(oldTitleJson).length - 1
        const bodyOccurrences = source.split(oldBodyJson).length - 1

        if (titleOccurrences !== 1) {
          console.log(`  !! ABORT: title JSON string occurs ${titleOccurrences} times in file (expected 1), skipping apply for this passage`)
          continue
        }
        if (bodyOccurrences !== 1) {
          console.log(`  !! ABORT: body JSON string occurs ${bodyOccurrences} times in file (expected 1), skipping apply for this passage`)
          continue
        }

        source = source.split(oldTitleJson).join(newTitleJson)
        source = source.split(oldBodyJson).join(newBodyJson)
        fileChanges += 1
      }
    }
  }

  if (APPLY && fileChanges > 0) {
    fs.writeFileSync(file.path, source, 'utf8')
    console.log(`\n>>> Wrote ${fileChanges} fixes to ${file.path}`)
  }
}

console.log(`\n\nTotal: ${totalFixed} fixable, ${totalSkipped} skipped as unsafe. ${APPLY ? 'APPLIED' : 'DRY RUN (pass --apply to write changes)'}`)
