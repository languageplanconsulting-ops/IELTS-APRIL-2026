// Resolves the canonical Cambridge audioscript for a `${book}-${test}-${part}`
// key — the same key space as src/listeningCambridgeAudioUrls.ts.
//
// Scripts live in three places and none of them is keyed the way the audio map
// is, so this module is the single adapter:
//
//   books 15, 16, 19, 20 → scripts/cambridge-listening-scripts.json
//   book 17              → scripts/cambridge-17-listening-scripts.json
//   books 10-14, 16-18   → src/listeningBuilderCambridge<N>Section<S>.ts
//
// Coverage is partial by design: 124 of the 192 audio keys have a script.
// Books 10-14 only have parts 2 and 4, book 18 only part 2, book 21 none.
// Callers must handle a null return rather than assume a script exists.
//
// Run under `npx tsx` — the builder sources are TypeScript.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))

const readJson = (name) => JSON.parse(readFileSync(join(HERE, name), 'utf8'))

const MULTI_BOOK_SCRIPTS = readJson('cambridge-listening-scripts.json')
const CAM17_SCRIPTS = readJson('cambridge-17-listening-scripts.json')

/** Builder sets, loaded lazily so a run over JSON-only books pays nothing. */
const BUILDER_MODULES = {
  '10-2': () => import('../src/listeningBuilderCambridge10Section2.ts'),
  '10-4': () => import('../src/listeningBuilderCambridge10Section4.ts'),
  '11-2': () => import('../src/listeningBuilderCambridge11Section2.ts'),
  '11-4': () => import('../src/listeningBuilderCambridge11Section4.ts'),
  '12-2': () => import('../src/listeningBuilderCambridge12Section2.ts'),
  '12-4': () => import('../src/listeningBuilderCambridge12Section4.ts'),
  '13-2': () => import('../src/listeningBuilderCambridge13Section2.ts'),
  '13-4': () => import('../src/listeningBuilderCambridge13Section4.ts'),
  '14-2': () => import('../src/listeningBuilderCambridge14Section2.ts'),
  '14-4': () => import('../src/listeningBuilderCambridge14Section4.ts'),
  '16-2': () => import('../src/listeningBuilderCambridge16Section2.ts'),
  '17-2': () => import('../src/listeningBuilderCambridge17Section2.ts'),
  '17-4': () => import('../src/listeningBuilderCambridge17Section4.ts'),
  '18-2': () => import('../src/listeningBuilderCambridge18Section2.ts'),
}

const fromBuilder = async (book, test, part) => {
  const load = BUILDER_MODULES[`${book}-${part}`]
  if (!load) return null
  const module = await load()
  const set = Object.values(module).find((value) => value && Array.isArray(value.tests))
  if (!set) return null
  const entry = set.tests.find((candidate) => candidate.testNumber === test)
  return entry?.scriptParagraphs ?? null
}

const fromMultiBookJson = (book, test, part) =>
  MULTI_BOOK_SCRIPTS?.[book]?.[test]?.[`section${part}`]?.scriptParagraphs ?? null

// Cam 17's outer key is a position, not a test number — read the inner `test`
// field rather than trusting the index.
const fromCam17Json = (test, part) => {
  const section = CAM17_SCRIPTS?.[`section${part}`]
  if (!section) return null
  const entry = Object.values(section).find((candidate) => candidate.test === test)
  return entry?.scriptParagraphs ?? null
}

export const parseKey = (key) => {
  const [book, test, part] = key.split('-').map(Number)
  return { book, test, part }
}

/**
 * Paragraphs of canonical script for one section, or null when none exists.
 * JSON is preferred over the builder sets for books 15/16/19/20 — the generated
 * full-test sets bind some transcripts to the wrong section (see the note at
 * src/listeningFullTestData.ts:15).
 */
export const getScriptParagraphs = async (key) => {
  const { book, test, part } = parseKey(key)
  const paragraphs =
    (book === 17 ? fromCam17Json(test, part) : fromMultiBookJson(book, test, part)) ??
    (await fromBuilder(book, test, part))
  if (!Array.isArray(paragraphs)) return null
  const cleaned = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean)
  return cleaned.length > 0 ? cleaned : null
}
