// Extract all Passage-3 (Band 7 / "advanced") reading questions into compact
// per-passage JSON files for the vocab-bridge generation workflow.
//
// Output: scripts/.passage3-extract/<slug>.json  (one per passage)
//         scripts/.passage3-extract/index.json    (list of {slug, answerGroup, file, count})
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '.passage3-extract')

const modules = [
  ['10', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_10_EXAMS'],
  ['11', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS'],
  ['12', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS'],
  ['13', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS'],
  ['14', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS'],
  ['15', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS'],
  ['16', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS'],
  ['17', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS'],
  ['18', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_18_EXAMS'],
  ['19', 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS']
]

const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const index = []

for (const [book, exportName] of modules) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName] || []
  for (const exam of exams) {
    if (exam.category !== 'advanced') continue
    const passages = exam?.parsedPayload?.passages || []
    for (const passage of passages) {
      const questions = (passage.questions || []).filter((q) =>
        String(q.answerGroup || '').includes('Passage 3')
      )
      if (!questions.length) continue
      const answerGroup = questions[0].answerGroup
      const slug = slugify(answerGroup)
      // Question-section text carries MCQ option letters; include it for context.
      const record = {
        answerGroup,
        title: passage.title || exam.title || '',
        bodyParagraphs: passage.bodyParagraphs || [],
        questionSectionText: passage.questionSectionText || '',
        questions: questions
          .sort((a, b) => a.number - b.number)
          .map((q) => ({
            number: q.number,
            prompt: q.prompt,
            correctAnswer: q.correctAnswer,
            acceptedAnswers: q.acceptedAnswers || undefined,
            answerType: q.answerType,
            exactPortion: q.exactPortion || ''
          }))
      }
      const file = `${slug}.json`
      writeFileSync(join(outDir, file), JSON.stringify(record, null, 2))
      index.push({ slug, answerGroup, file, count: record.questions.length })
    }
  }
}

index.sort((a, b) => a.answerGroup.localeCompare(b.answerGroup))
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2))
console.log(`Extracted ${index.length} passages, ${index.reduce((s, x) => s + x.count, 0)} questions`)
console.log(`Output: ${outDir}`)
