/**
 * Audit advanced reading question UI grouping for all Cambridge passage-3 exams.
 * Run: npx tsx scripts/audit-advanced-reading-ui-groups.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { auditReadingQuestionDisplayPlan } from '../src/readingQuestionDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAdvancedExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs.readdirSync(serverDir).filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
  const exams = []
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        exams.push(...value.filter((exam) => exam?.category === 'advanced' && exam?.parsedPayload?.passages))
      }
    }
  }
  return exams
}

const exams = await loadAdvancedExams()
const allIssues = []
const modeCounts = {}

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const { plan, issues } = auditReadingQuestionDisplayPlan(passage, questions, exam.id)
    for (const question of questions) {
      const mode = plan.byQuestionNumber.get(question.number) || 'unknown'
      modeCounts[mode] = (modeCounts[mode] || 0) + 1
    }
    for (const issue of issues) {
      allIssues.push({ examId: exam.id, ...issue })
    }
  }
}

const byKind = {}
for (const issue of allIssues) {
  byKind[issue.kind] = (byKind[issue.kind] || 0) + 1
}

console.log(`Advanced UI group audit: ${exams.length} exams, ${Object.values(modeCounts).reduce((a, b) => a + b, 0)} questions`)
console.log('Display modes:', modeCounts)
console.log(`Issues: ${allIssues.length}`)
if (Object.keys(byKind).length) console.log('By kind:', byKind)

if (allIssues.length) {
  for (const issue of allIssues.slice(0, 50)) {
    console.log(`- ${issue.examId} Q${issue.question}: ${issue.kind}${issue.detail ? ` — ${issue.detail}` : ''}`)
  }
  if (allIssues.length > 50) console.log(`... and ${allIssues.length - 50} more`)
  process.exit(1)
}

console.log('All advanced reading questions classify and render cleanly.')
