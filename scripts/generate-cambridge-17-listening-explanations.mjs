/**
 * Regenerate comprehensive Thai explanations for all Cambridge 17 listening tasks.
 *
 * Run: node scripts/generate-cambridge-17-listening-explanations.mjs
 *      node scripts/generate-cambridge-17-listening-builder.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildListeningEnrichment } from './cambridge-17-listening-enrichment-builder.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const scriptsPath = path.join(__dirname, 'cambridge-17-listening-scripts.json')
const overridesPath = path.join(__dirname, 'cambridge-17-listening-script-overrides.json')
const tasksPath = path.join(__dirname, 'cambridge-17-listening-tasks.json')

const scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'))
const scriptOverrides = fs.existsSync(overridesPath)
  ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
  : { section2: {}, section4: {} }
const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'))

const getScriptBody = (sectionKey, testNumber) => {
  const secOverrides = sectionKey === 'section2' ? scriptOverrides.section2 : scriptOverrides.section4
  const override = secOverrides?.[String(testNumber)]
  const st = scripts[sectionKey].find((t) => t.test === testNumber)
  const paragraphs = override?.scriptParagraphs || st?.scriptParagraphs || []
  return paragraphs.join('\n\n')
}

let updated = 0

for (const sectionKey of ['section2', 'section4']) {
  for (const testBlock of tasksData[sectionKey]) {
    const body = getScriptBody(sectionKey, testBlock.test)
    for (const task of testBlock.tasks) {
      const enriched = buildListeningEnrichment({ body, task })
      task.thaiMeaning = enriched.thaiMeaning
      task.explanationThai = enriched.explanationThai
      if (!task.targetText && enriched.quote) {
        task.targetText = enriched.quote.slice(0, 120)
      }
      updated += 1
    }
  }
}

fs.writeFileSync(tasksPath, `${JSON.stringify(tasksData, null, 2)}\n`)
console.log(`Updated ${updated} listening task explanations in cambridge-17-listening-tasks.json`)
