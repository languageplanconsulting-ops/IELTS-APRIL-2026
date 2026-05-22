import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const book = Number(process.argv[2])
if (!book) {
  console.error('Usage: node scripts/build-cambridge-reading-book.mjs <book>')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importJsonPath = path.join(root, 'cambridge-reading-imports', `cambridge-${book}-reading-import.json`)
const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)

const { buildReadingExamPayload } = await import(
  pathToFileURL(path.join(root, 'server/readingImportUtils.mjs')).href
)

const items = JSON.parse(fs.readFileSync(importJsonPath, 'utf8'))

const exams = items.map((item) => {
  const exam = {
    id: item.id,
    title: item.title,
    category: item.category,
    rawPassageText: item.rawPassageText,
    rawAnswerKey: item.rawAnswerKey
  }
  let parsedPayload
  try {
    parsedPayload = buildReadingExamPayload(exam)
  } catch (error) {
    console.error(`Failed to parse ${item.id}:`, error.message)
    throw error
  }
  return {
    ...exam,
    parsedPayload,
    createdAt: '2026-05-22T00:00:00.000Z',
    updatedAt: '2026-05-22T00:00:00.000Z'
  }
})

const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
const fileBody = `export const ${exportName} = ${JSON.stringify(exams, null, 2)}
`

fs.writeFileSync(outputPath, fileBody, 'utf8')
const qCount = exams.reduce((sum, exam) => sum + (exam.parsedPayload?.passages?.[0]?.questions?.length || 0), 0)
console.log(`Wrote ${exams.length} Cambridge ${book} reading exams (${qCount} questions) to ${outputPath}`)
