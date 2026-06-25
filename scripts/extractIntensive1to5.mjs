// Extract Normal-Reading ด่าน 1–5 source (passage text) + existing keyword mapping
// per (stage, slot) for the vocab-pairs workflow.
// Output: scripts/.intensive1to5/<stage>-<slot>.json  and index.json
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '.intensive1to5')
rmSync(outDir, { recursive: true, force: true }); mkdirSync(outDir, { recursive: true })

const transpile = (rel, dropImport) => {
  let src = readFileSync(join(here, '..', 'src', rel), 'utf8')
  let js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
  if (dropImport) js = js.replace(dropImport, '')
  const tmp = join(outDir, '__' + rel.replace(/[^a-z0-9]/gi, '_') + '.mjs')
  writeFileSync(tmp, js)
  return import(pathToFileURL(tmp).href + `?t=${Date.now()}`)
}

const layoutsMod = await transpile('journeyIntensivePassages1to5.ts', /import[^;]*intensivePassageBuilder[^;]*;?/)
const layouts = layoutsMod.INTENSIVE_LAYOUTS_STAGE_1_5

const para = (p) => Array.isArray(p) ? `${p[0] ? p[0] + ': ' : ''}${p[1] || ''}` : String(p)
const index = []
for (const stage of Object.keys(layouts)) {
  const pair = layouts[stage]
  for (const slotIdx of ['0', '1']) {
    const layout = pair[slotIdx]
    if (!layout) continue
    const slot = Number(slotIdx) + 1
    const text = (layout.paragraphs || []).map(para).join('\n\n')
    let n = 0
    const questions = []
    for (const sec of (layout.sectionOrder || [])) {
      const group = layout[sec]
      if (!group || !Array.isArray(group.items)) continue
      for (const it of group.items) {
        n += 1
        questions.push({
          n, section: sec,
          prompt: it.prompt || '',
          answer: it.answer || '',
          evidence: it.evidence || '',
          passageKeyword: it.passageKeyword || '',
          questionKeyword: it.questionKeyword || '',
          thaiMeaning: it.thaiMeaning || ''
        })
      }
    }
    const slug = `stage-${stage}-slot-${slot}`
    writeFileSync(join(outDir, `${slug}.json`), JSON.stringify({ stage: Number(stage), slot, title: layout.title || '', passageText: text, questions }, null, 2))
    index.push({ slug, stage: Number(stage), slot, count: questions.length })
  }
}
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2))
console.error('Extracted', index.length, 'passages,', index.reduce((s, x) => s + x.count, 0), 'questions')
console.error(index.map(x => `${x.slug}:${x.count}`).join('  '))
