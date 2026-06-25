// Extract Normal-Reading ด่าน 6–20 source (passage text) + existing keyword
// mapping per (stage, slot) for the vocab-pairs workflow, resolving each stage's
// layout with the SAME priority order as readingJourney.buildIntensiveJourneyExam.
// Output: scripts/.intensive6to20/<stage>-<slot>.json  and index.json
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '.intensive6to20')
rmSync(outDir, { recursive: true, force: true }); mkdirSync(outDir, { recursive: true })
const tmpDir = join(outDir, '__mjs'); mkdirSync(tmpDir, { recursive: true })

const MODULES = [
  'journeyIntensivePassages1to5', 'journeyIntensivePassages6to17', 'journeyIntensivePassages6',
  'journeyIntensivePassages7to9', 'journeyIntensivePassages8to12', 'journeyIntensivePassages10',
  'journeyIntensivePassages11', 'journeyIntensivePassages12', 'journeyIntensivePassages13',
  'journeyIntensivePassages14', 'journeyIntensivePassages15', 'journeyIntensivePassages11to15'
]
// Transpile each into the temp dir, rewriting relative '.ts' imports to '.mjs'.
for (const name of MODULES) {
  const src = readFileSync(join(here, '..', 'src', `${name}.ts`), 'utf8')
  let js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
  js = js.replace(/from '\.\/([A-Za-z0-9_]+)\.ts'/g, "from './$1.mjs'")
  writeFileSync(join(tmpDir, `${name}.mjs`), js)
}
const load = async (name, exp) => (await import(pathToFileURL(join(tmpDir, `${name}.mjs`)).href + `?t=${Date.now()}`))[exp]

const L1_5 = await load('journeyIntensivePassages1to5', 'INTENSIVE_LAYOUTS_STAGE_1_5')
const L6_17 = await load('journeyIntensivePassages6to17', 'INTENSIVE_LAYOUTS_STAGE_6_17')
const L6 = await load('journeyIntensivePassages6', 'INTENSIVE_LAYOUTS_STAGE_6')
const L7_9 = await load('journeyIntensivePassages7to9', 'INTENSIVE_LAYOUTS_STAGE_7_9')
const L8_12 = await load('journeyIntensivePassages8to12', 'INTENSIVE_LAYOUTS_STAGE_8_12')
const L10 = await load('journeyIntensivePassages10', 'INTENSIVE_LAYOUTS_STAGE_10')
const L11 = await load('journeyIntensivePassages11', 'INTENSIVE_LAYOUTS_STAGE_11')
const L12 = await load('journeyIntensivePassages12', 'INTENSIVE_LAYOUTS_STAGE_12')
const L13 = await load('journeyIntensivePassages13', 'INTENSIVE_LAYOUTS_STAGE_13')
const L14 = await load('journeyIntensivePassages14', 'INTENSIVE_LAYOUTS_STAGE_14')
const L15 = await load('journeyIntensivePassages15', 'INTENSIVE_LAYOUTS_STAGE_15')
const L11_15 = await load('journeyIntensivePassages11to15', 'INTENSIVE_LAYOUTS_STAGE_11_15')

// Same priority chain as buildIntensiveJourneyExam.
const resolve = (stage) =>
  L1_5[stage] || L6_17[stage] || L6[stage] || L7_9[stage] || L8_12[stage] ||
  L10[stage] || L11[stage] || L12[stage] || L13[stage] || L14[stage] || L15[stage] || L11_15[stage] || null

const para = (p) => Array.isArray(p) ? `${p[0] ? p[0] + ': ' : ''}${p[1] || ''}` : String(p)
const index = []
for (let stage = 6; stage <= 20; stage++) {
  const layouts = resolve(stage)
  if (!layouts) continue
  layouts.forEach((layout, idx) => {
    if (!layout) return
    const slot = idx + 1
    const text = (layout.paragraphs || []).map(para).join('\n\n')
    let n = 0
    const questions = []
    for (const sec of (layout.sectionOrder || [])) {
      const group = layout[sec]
      if (!group || !Array.isArray(group.items)) continue
      for (const it of group.items) {
        n += 1
        questions.push({
          n, section: sec, prompt: it.prompt || '', answer: it.answer || '', evidence: it.evidence || '',
          passageKeyword: it.passageKeyword || '', questionKeyword: it.questionKeyword || '', thaiMeaning: it.thaiMeaning || ''
        })
      }
    }
    const slug = `stage-${stage}-slot-${slot}`
    writeFileSync(join(outDir, `${slug}.json`), JSON.stringify({ stage, slot, title: layout.title || '', passageText: text, questions }, null, 2))
    index.push({ slug, stage, slot, count: questions.length })
  })
}
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2))
const stages = [...new Set(index.map((x) => x.stage))].sort((a, b) => a - b)
console.error('Extracted', index.length, 'passages,', index.reduce((s, x) => s + x.count, 0), 'questions')
console.error('stages:', stages.join(','))
console.error(index.map((x) => `${x.slug}:${x.count}`).join('  '))
