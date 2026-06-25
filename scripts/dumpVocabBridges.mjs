// Dump the current vocab-bridge registry (src/readingPassage3VocabBridge.ts)
// to JSON so the pairs-generation pipeline can merge into it WITHOUT touching
// any of the existing curated questionPhrase / passagePhrase / keyVocab content.
//
// Output: scripts/.passage3-extract/existing-bridges.json
//   { [answerGroup]: { [questionNumber]: ReadingVocabBridge } }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))
const srcPath = join(here, '..', 'src', 'readingPassage3VocabBridge.ts')
const outDir = join(here, '.passage3-extract')
mkdirSync(outDir, { recursive: true })

let source = readFileSync(srcPath, 'utf8')
// Expose the (non-exported) registry const so we can read it after import.
source += '\nexport const __REGISTRY__ = READING_VOCAB_BRIDGE_BY_GROUP;\n'

const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText

const tmp = join(outDir, '__bridges.mjs')
writeFileSync(tmp, js)
const mod = await import(pathToFileURL(tmp).href + `?t=${Date.now()}`)
const registry = mod.__REGISTRY__

writeFileSync(join(outDir, 'existing-bridges.json'), JSON.stringify(registry, null, 2))

// Per-passage existing entries so each workflow agent reads a small file.
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
for (const [group, byNumber] of Object.entries(registry)) {
  const slim = Object.fromEntries(
    Object.entries(byNumber).map(([num, b]) => [
      num,
      { questionPhrase: b.questionPhrase, passagePhrase: b.passagePhrase, keyVocab: b.keyVocab || null }
    ])
  )
  writeFileSync(join(outDir, `${slugify(group)}.existing.json`), JSON.stringify({ answerGroup: group, entries: slim }, null, 2))
}

const groups = Object.keys(registry)
const totalQ = groups.reduce((s, g) => s + Object.keys(registry[g]).length, 0)
console.error(`Dumped ${groups.length} groups, ${totalQ} questions -> existing-bridges.json`)
