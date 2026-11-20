// Extract every NOT GIVEN (default) or FALSE / NO reading question (Cambridge server banks +
// Normal ด่าน intensive layouts) into one JSON list for writing the "≠" contrasts.
// Usage: node scripts/extractNotGiven.mjs <outFile> [--false]
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const outFile = process.argv[2] || join(here, '.not-given', 'items.json')
const WANT = process.argv.includes('--false') ? new Set(['FALSE', 'NO']) : new Set(['NOT GIVEN'])
mkdirSync(dirname(outFile), { recursive: true })

export const normalizeNotGivenKey = (prompt) =>
  String(prompt || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

const items = new Map()
const add = (item) => {
  const key = normalizeNotGivenKey(item.prompt)
  if (!key || items.has(key)) return
  items.set(key, { key, ...item })
}

// 1) Cambridge / practice banks served by the API.
const serverFiles = readdirSync(join(root, 'server')).filter((f) => /^userProvidedReading.*\.mjs$/.test(f))
for (const file of serverFiles) {
  const mod = await import(pathToFileURL(join(root, 'server', file)).href)
  for (const value of Object.values(mod)) {
    if (!Array.isArray(value)) continue
    for (const exam of value) {
      for (const passage of exam?.parsedPayload?.passages || []) {
        for (const q of passage.questions || []) {
          if (!['true-false-not-given', 'yes-no-not-given'].includes(q.answerType)) continue
          if (!WANT.has(String(q.correctAnswer || '').trim().toUpperCase())) continue
          add({
            answer: String(q.correctAnswer).trim().toUpperCase(),
            source: exam.title || file,
            kind: q.answerType === 'yes-no-not-given' ? 'YNNG' : 'TFNG',
            prompt: q.prompt,
            evidence: q.exactPortion || '',
            explanationThai: q.explanationThai || ''
          })
        }
      }
    }
  }
}

// 2) Normal-Reading ด่าน intensive layouts (same priority chain as readingJourney).
const tmpDir = join(dirname(outFile), '__mjs')
rmSync(tmpDir, { recursive: true, force: true }); mkdirSync(tmpDir, { recursive: true })
const MODULES = [
  ['journeyIntensivePassages1to5', 'INTENSIVE_LAYOUTS_STAGE_1_5'], ['journeyIntensivePassages6to17', 'INTENSIVE_LAYOUTS_STAGE_6_17'],
  ['journeyIntensivePassages6', 'INTENSIVE_LAYOUTS_STAGE_6'], ['journeyIntensivePassages7to9', 'INTENSIVE_LAYOUTS_STAGE_7_9'],
  ['journeyIntensivePassages8to12', 'INTENSIVE_LAYOUTS_STAGE_8_12'], ['journeyIntensivePassages10', 'INTENSIVE_LAYOUTS_STAGE_10'],
  ['journeyIntensivePassages11', 'INTENSIVE_LAYOUTS_STAGE_11'], ['journeyIntensivePassages12', 'INTENSIVE_LAYOUTS_STAGE_12'],
  ['journeyIntensivePassages13', 'INTENSIVE_LAYOUTS_STAGE_13'], ['journeyIntensivePassages14', 'INTENSIVE_LAYOUTS_STAGE_14'],
  ['journeyIntensivePassages15', 'INTENSIVE_LAYOUTS_STAGE_15'], ['journeyIntensivePassages11to15', 'INTENSIVE_LAYOUTS_STAGE_11_15']
]
for (const [name] of MODULES) {
  const src = readFileSync(join(root, 'src', `${name}.ts`), 'utf8')
  let js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
  js = js.replace(/from '\.\/([A-Za-z0-9_]+)\.ts'/g, "from './$1.mjs'")
  writeFileSync(join(tmpDir, `${name}.mjs`), js)
}
const layoutsByModule = []
for (const [name, exp] of MODULES) {
  layoutsByModule.push((await import(pathToFileURL(join(tmpDir, `${name}.mjs`)).href))[exp] || {})
}
for (let stage = 1; stage <= 20; stage++) {
  const layouts = layoutsByModule.map((m) => m[stage]).find(Boolean)
  if (!layouts) continue
  layouts.forEach((layout, idx) => {
    for (const sec of layout?.sectionOrder || []) {
      const group = layout[sec]
      if (!group || !Array.isArray(group.items)) continue
      for (const it of group.items) {
        if (sec !== 'tfng' && sec !== 'ynng') continue
        if (!WANT.has(String(it.answer || '').trim().toUpperCase())) continue
        add({
          answer: String(it.answer).trim().toUpperCase(),
          source: `ด่าน ${stage} slot ${idx + 1} · ${layout.title || ''}`,
          kind: sec === 'ynng' ? 'YNNG' : 'TFNG',
          prompt: it.prompt,
          evidence: it.evidence || '',
          explanationThai: it.thaiMeaning || ''
        })
      }
    }
  })
}
rmSync(tmpDir, { recursive: true, force: true })
const list = [...items.values()]
writeFileSync(outFile, JSON.stringify(list, null, 2))
console.error([...WANT].join('/'), 'items:', list.length)
