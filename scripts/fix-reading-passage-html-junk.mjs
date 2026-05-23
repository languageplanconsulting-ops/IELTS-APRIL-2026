/**
 * Remove Engnovate HTML form junk from Cambridge reading data files.
 * Run: node scripts/fix-reading-passage-html-junk.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const files = [
  'server/userProvidedReadingPracticeCambridge11.mjs',
  'server/userProvidedReadingPracticeCambridge14.mjs',
  'server/userProvidedReadingPracticeCambridge15.mjs',
  'server/userProvidedReadingPracticeCambridge16.mjs'
]

const formInRawPassagePattern = /\\n(?:[ \t]|\\n)*<form id =\\"\\n\\nQuestions/g
const formInParsedPayloadPattern = /\n            "<form id =\\""\n/g

let totalReplacements = 0

for (const relativePath of files) {
  const filePath = path.join(root, relativePath)
  let content = fs.readFileSync(filePath, 'utf8')
  const before = (content.match(/<form id/g) || []).length

  content = content.replace(formInParsedPayloadPattern, '\n')
  content = content.replace(formInRawPassagePattern, '\\n\\nQuestions')

  const after = (content.match(/<form id/g) || []).length
  const removed = before - after

  if (removed > 0) {
    fs.writeFileSync(filePath, content)
    totalReplacements += removed
    console.log(`Patched ${relativePath} (removed ${removed} form junk occurrence(s))`)
  } else {
    console.log(`No changes needed: ${relativePath}`)
  }
}

console.log(`Done. Removed ${totalReplacements} form junk occurrence(s) total.`)
