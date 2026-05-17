/**
 * Generate listeningBuilderCambridge17Section2.ts and Section4.ts
 * from cambridge-17-listening-scripts.json + cambridge-17-listening-tasks.json
 *
 * Run: python3 scripts/extract-cambridge-17-listening-from-pdf.py
 *      node scripts/generate-cambridge-17-listening-explanations.mjs
 *      node scripts/generate-cambridge-17-listening-builder.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const scriptsPath = path.join(__dirname, 'cambridge-17-listening-scripts.json')
const tasksPath = path.join(__dirname, 'cambridge-17-listening-tasks.json')
const overridesPath = path.join(__dirname, 'cambridge-17-listening-script-overrides.json')

const scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'))
const scriptOverrides = fs.existsSync(overridesPath)
  ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
  : { section2: {}, section4: {} }
const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'))

const esc = (s) =>
  JSON.stringify(String(s ?? ''))
    .replace(/\$/g, '\\$')

const buildExamSet = (sectionNumber, titleSuffix) => {
  const secKey = sectionNumber === 2 ? 'section2' : 'section4'
  const scriptTests = scripts[secKey]
  const taskTests = tasksData[secKey]
  const qStart = sectionNumber === 2 ? 11 : 31

  const tests = scriptTests.map((st) => {
    const tt = taskTests.find((t) => t.test === st.test)
    if (!tt) throw new Error(`Missing tasks for ${secKey} test ${st.test}`)
    const tasks = [...tt.tasks].sort((a, b) => a.questionNumber - b.questionNumber)
    const secOverrides = sectionNumber === 2 ? scriptOverrides.section2 : scriptOverrides.section4
    const testOverride = secOverrides?.[String(st.test)]
    return {
      id: `cam17-sec${sectionNumber}-test${st.test}`,
      testNumber: st.test,
      title: testOverride?.title || st.title,
      scriptParagraphs: testOverride?.scriptParagraphs || st.scriptParagraphs,
      tasks
    }
  })

  return {
    id: `cambridge-17-section-${sectionNumber}`,
    bookNumber: 17,
    sectionNumber,
    title: `Cambridge 17 · Section ${sectionNumber}`,
    tests
  }
}

const renderTask = (task) => `        {
          id: ${esc(task.id)},
          questionNumber: ${task.questionNumber},
          questionText: ${esc(task.questionText)},
          questionWordPhrase: ${esc(task.questionWordPhrase)},
          targetText: ${esc(task.targetText)},
          thaiMeaning: ${esc(task.thaiMeaning)},
          explanationThai: ${esc(task.explanationThai)}${task.correctAnswer ? `,\n          correctAnswer: ${esc(task.correctAnswer)}` : ''}
        }`

const renderFile = (exportName, examSet) => {
  const testsSrc = examSet.tests
    .map(
      (test) => `    {
      id: ${esc(test.id)},
      testNumber: ${test.testNumber},
      title: ${esc(test.title)},
      scriptParagraphs: [
${test.scriptParagraphs.map((p) => `        ${esc(p)}`).join(',\n')}
      ],
      tasks: [
${test.tasks.map(renderTask).join(',\n')}
      ]
    }`
    )
    .join(',\n')

  return `import type { ListeningBuilderExamSet } from './listeningBuilderCambridge18Section2'

export const ${exportName}: ListeningBuilderExamSet = {
  id: ${esc(examSet.id)},
  bookNumber: ${examSet.bookNumber},
  sectionNumber: ${examSet.sectionNumber},
  title: ${esc(examSet.title)},
  tests: [
${testsSrc}
  ]
}
`
}

const s2 = buildExamSet(2, 'Section 2')
const s4 = buildExamSet(4, 'Section 4')

fs.writeFileSync(
  path.join(root, 'src/listeningBuilderCambridge17Section2.ts'),
  renderFile('CAMBRIDGE_17_SECTION_2_EXAM_SET', s2),
  'utf8'
)
fs.writeFileSync(
  path.join(root, 'src/listeningBuilderCambridge17Section4.ts'),
  renderFile('CAMBRIDGE_17_SECTION_4_EXAM_SET', s4),
  'utf8'
)

const answerOverrides = {}
for (const sec of ['section2', 'section4']) {
  for (const test of tasksData[sec]) {
    for (const task of test.tasks) {
      if (task.correctAnswer) answerOverrides[task.id] = task.correctAnswer
    }
  }
}
fs.writeFileSync(
  path.join(__dirname, 'cambridge-17-listening-overrides.json'),
  JSON.stringify(answerOverrides, null, 2) + '\n',
  'utf8'
)

console.log('Wrote src/listeningBuilderCambridge17Section2.ts')
console.log('Wrote src/listeningBuilderCambridge17Section4.ts')
console.log(`Overrides: ${Object.keys(answerOverrides).length} task answers`)
