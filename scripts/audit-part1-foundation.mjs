/**
 * Audit Cambridge 18–20 Part 1 bank: scripts, answers, prompts, explanations.
 * Run: node scripts/audit-part1-foundation.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const ANSWERS = {
  '18-1': ['DW30 7YZ / DW3Q 7YZ', '24 April', 'dentist', 'parking', 'Claxby', 'late', 'evening', 'supermarket', 'pollution', 'storage'],
  '18-2': ['training', 'discount', 'taxi', 'service', 'English', 'Wivenhoe', 'equipment', '9.75', 'deliveries', 'Sunday'],
  '18-3': ['Marrowfield', 'relative', 'socialise / socialize', 'full', 'Domestic Life', 'clouds', 'timing', 'Animal Magic', 'movement', 'dark'],
  '18-4': ['receptionist', 'Medical', 'Chastons', 'appointments', 'database', 'experience', 'confident', 'temporary', '1.15', 'parking'],
  '19-1': ['69 / sixty-nine', 'stream', 'data', 'map', 'visitors', 'sounds', 'freedom', 'skills', '4.95', 'leaders'],
  '19-2': ['Mathieson', 'beginners', 'college', 'New', '11', 'instrument', 'ear', 'clapping', 'recording', 'alone'],
  '19-3': ['harbour / harbor', 'bridge', '3.30', 'Rose', 'sign', 'purple', 'samphire', 'melon', 'coconut', 'strawberry'],
  '19-4': ['Kaeden', 'locker', 'passport', 'uniform', 'third', '0412 665 903', 'yellow', 'plastic', 'ice', 'gloves'],
  '20-1': ['fish', 'roof', 'Spanish', 'vegetarian', 'Audley', 'hotel', 'reviews', 'local', '30', 'average'],
  '20-2': ['break', 'time', 'shower', 'money', 'memory', 'lifting', 'fall', 'taxi', 'insurance', 'stress'],
  '20-3': ['239', 'modern', 'lamp', 'Aaron', 'damage', 'electronic', 'insurance', 'Space', 'app', 'exchanges'],
  '20-4': ['Kings', '125', 'walking', 'boat', 'Tuesday', 'space', 'vegetarian', '2.30', '75', 'port']
}

const parseAccepted = (raw) =>
  String(raw || '')
    .split(/\s*\/\s*/)
    .map((part) => part.replace(/\([^)]*\)/g, '').trim())
    .filter(Boolean)

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const answerInScript = (script, raw) => {
  const variants = parseAccepted(raw)
  const normScript = normalize(script)
  return variants.some((variant) => {
    const stem = normalize(variant)
    if (stem.length >= 2 && normScript.includes(stem)) return true
    const digits = variant.replace(/[^\d.]/g, '')
    if (digits && script.includes(digits)) return true
    return false
  })
}

const scriptsDir = path.join(root, 'scripts/part1-scripts')
const audioJson = JSON.parse(fs.readFileSync(path.join(root, 'scripts/cambridge-part1-audio-urls.json'), 'utf8'))

let issues = 0

console.log('=== Part 1 foundation audit ===\n')

for (const [key, answers] of Object.entries(ANSWERS)) {
  const [book, test] = key.split('-')
  const file = path.join(scriptsDir, `cam${book}-test${String(test).padStart(2, '0')}.txt`)
  if (!fs.existsSync(file)) {
    console.log(`FAIL ${key}: missing script file`)
    issues += 1
    continue
  }

  const script = fs.readFileSync(file, 'utf8').trim()
  const audio = audioJson[key]

  console.log(`Cam ${book} Test ${test}`)
  console.log(`  Script: ${script.length} chars · ${script.split('\n').length} lines`)
  console.log(`  Audio URL: ${audio ? 'configured' : 'MISSING'}`)

  if (script.length < 500) {
    console.log('  WARN: script looks unusually short')
    issues += 1
  }

  answers.forEach((answer, index) => {
    const n = index + 1
    if (!answerInScript(script, answer)) {
      console.log(`  WARN Q${n}: "${answer}" not found clearly in script`)
      issues += 1
    }
  })

  console.log('')
}

console.log(issues ? `${issues} warning(s). Review above.` : 'All local checks passed.')
console.log('\nRun npm run verify:listening-part1-audio when online to confirm audio URLs.')
