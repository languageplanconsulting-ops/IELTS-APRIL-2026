/** Find the verbatim passage sentence containing each fill-blank answer. */
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'

const ALL = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
]
const byId = {}
for (const e of ALL) if (e.category === 'advanced') byId[e.id] = e

const WANT = {
  'cambridge-14-test1-passage3': ['restaurants', 'performance', 'turnover', 'goals', 'characteristics'],
  'cambridge-14-test2-passage3': ['productive', 'perfectionists', 'dissatisfied'],
  'cambridge-14-test4-passage3': ['too large', 'microplastic', 'entire populations', 'concentrations', 'predators', 'disasters'],
  'cambridge-15-test1-passage3': ['expeditions', 'uncontacted', 'land surface'],
  'cambridge-16-test3-passage3': ['warm', 'summer', 'mustard'],
  'cambridge-14-test3-passage3': ['encouraging', "child's own desire", 'autonomy', 'targeted'],
  'cambridge-17-test4-passage3': ['memory', 'numbers', 'communication', 'visual'],
  'cambridge-19-test4-passage3': ['egalitarian', 'status', 'hunting', 'domineering', 'autonomy'],
  'cambridge-11-test1-passage3': ['sunshade', 'iron', 'algae', 'clouds', 'cables', 'snow', 'rivers'],
  'cambridge-11-test3-passage3': ['beginner', 'arithmetic', 'intuitive', 'scientists', 'experiments', 'theorems']
}

const sentences = (text) =>
  String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z'"‘“(])/)
    .map((s) => s.trim())
    .filter(Boolean)

for (const id of Object.keys(WANT)) {
  const exam = byId[id]
  if (!exam) { console.log(`\n# ${id}  (NOT FOUND)`); continue }
  const rt = buildReadingExamPayload(exam)
  const body = (rt.passages?.[0]?.bodyParagraphs || []).join(' ')
  const sents = sentences(body)
  console.log(`\n# ${id}`)
  for (const ans of WANT[id]) {
    const hit = sents.find((s) => s.toLowerCase().includes(ans.toLowerCase()))
    console.log(`  [${ans}] => ${hit ? hit.slice(0, 200) : '!! NOT FOUND'}`)
  }
}
