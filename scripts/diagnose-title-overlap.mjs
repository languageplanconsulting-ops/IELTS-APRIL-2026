import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'

const FILES = [
  { name: 'Cambridge11', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS },
  { name: 'Cambridge13', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS },
  { name: 'Cambridge14', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS },
  { name: 'Cambridge15', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS },
  { name: 'Cambridge17', exams: USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS }
]

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const file of FILES) {
  for (const exam of file.exams) {
    for (const passage of exam.parsedPayload?.passages || []) {
      const title = String(passage.title || '')
      const body0 = String(passage.bodyParagraphs?.[0] || '')
      const titleWords = title.split(/\s+/).filter(Boolean)
      if (titleWords.length < 5) continue // short titles are likely already clean

      const bodyWordsNorm = norm(body0).split(' ').filter(Boolean)
      const titleWordsNorm = norm(title).split(' ').filter(Boolean)

      let bestN = 0
      const maxN = Math.min(12, titleWordsNorm.length, bodyWordsNorm.length)
      for (let n = maxN; n >= 2; n--) {
        const tail = titleWordsNorm.slice(-n).join(' ')
        const head = bodyWordsNorm.slice(0, n).join(' ')
        if (tail === head) {
          bestN = n
          break
        }
      }

      console.log(`\n[${file.name}] ${exam.id} passage ${passage.number}`)
      console.log(`  TITLE: "${title}"`)
      console.log(`  BODY0 START: "${body0.slice(0, 100)}"`)
      if (bestN > 0) {
        const cutWords = titleWords.slice(0, titleWords.length - bestN)
        console.log(`  MATCH: n=${bestN}, suggested new title = "${cutWords.join(' ')}"`)
      } else {
        console.log(`  NO MATCH -- needs manual investigation (possible missing lead-in variant)`)
      }
    }
  }
}
