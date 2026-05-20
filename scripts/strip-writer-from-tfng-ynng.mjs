/**
 * Remove "writer..." framing from TRUE/FALSE/NOT GIVEN and YES/NO/NOT GIVEN question prompts.
 */
import fs from 'node:fs'
import path from 'node:path'

const writerRe = /\bwriter\b/i
const tfngAns = /^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i

export const stripWriterFromTfngPrompt = (prompt) => {
  let s = String(prompt || '').trim()
  const replacements = [
    [/^The writer believes that\s+/i, ''],
    [/^The writer believes\s+/i, ''],
    [/^The writer suggests that\s+/i, ''],
    [/^The writer suggests\s+/i, ''],
    [/^The writer says that\s+/i, ''],
    [/^The writer says\s+/i, ''],
    [/^The writer argues that\s+/i, ''],
    [/^The writer argues\s+/i, ''],
    [/^The writer claims that\s+/i, ''],
    [/^The writer claims\s+/i, ''],
    [/^The writer accepts that\s+/i, ''],
    [/^The writer accepts\s+/i, ''],
    [/^The writer's\s+/i, ''],
    [/^The writer\s+/i, '']
  ]
  for (const [pattern, replacement] of replacements) {
    s = s.replace(pattern, replacement)
  }
  if (/^[a-z]/.test(s)) s = s[0].toUpperCase() + s.slice(1)
  return s.trim()
}

const fixAnswerKey = (key) => {
  let changes = 0
  const blocks = key.split(/(?=Question\s+\d+:)/i)
  const fixed = blocks.map((block) => {
    const qm = block.match(/^(Question\s+(\d+):)([\s\S]*?)(?=Correct Answer:)/i)
    const am = block.match(/Correct Answer:\s*([^\n]+)/i)
    if (!qm || !am || !tfngAns.test(am[1].trim())) return block
    const oldPrompt = qm[3].replace(/\n+/g, ' ').trim()
    if (!writerRe.test(oldPrompt)) return block
    const newPrompt = stripWriterFromTfngPrompt(oldPrompt)
    if (newPrompt === oldPrompt) return block
    changes += 1
    let updated = block.replace(
      qm[0],
      `${qm[1]}${newPrompt}\n\n`
    )
    // Also soften Thai lines that echo "writer" in the question framing
    updated = updated.replace(/โจทย์(ที่)?ถามว่า writer/gi, 'โจทย์ถามว่า')
    updated = updated.replace(/statement (?:ของ|ที่มี) writer/gi, 'statement')
    return updated
  })
  return { text: fixed.join(''), changes }
}

const fixPassageText = (text, replacements) => {
  let updated = text
  for (const [oldPrompt, newPrompt] of replacements) {
    if (!oldPrompt || oldPrompt === newPrompt) continue
    const escaped = oldPrompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    updated = updated.replace(new RegExp(escaped, 'g'), newPrompt)
    // numbered question lines
    const numMatch = oldPrompt.match(/^(\d+)\s+/)
    if (numMatch) {
      const linePattern = new RegExp(
        `(^|\\n)(\\d{1,2})\\s+${escaped.replace(/^\d+\s+/, '')}`,
        'g'
      )
    }
    updated = updated.replace(
      new RegExp(`(^|\\n)(\\d{1,2})\\s+${oldPrompt.replace(/^[^(]*$/, '')}`, 'g'),
      (m, pre, num) => `${pre}${num} ${newPrompt}`
    )
  }
  // Fix numbered lines: "14 The writer believes..."
  for (const [oldPrompt, newPrompt] of replacements) {
    const oldLine = oldPrompt.replace(/^Question \d+:\s*/i, '')
    if (!writerRe.test(oldLine)) continue
    const pattern = new RegExp(
      `(^|\\n)(\\d{1,2})\\s+${oldLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      'g'
    )
    updated = updated.replace(pattern, `$1$2 ${newPrompt}`)
  }
  return updated
}

const collectReplacements = (key) => {
  const pairs = []
  const blocks = key.split(/(?=Question\s+\d+:)/i)
  for (const block of blocks) {
    const qm = block.match(/^Question\s+(\d+):([\s\S]*?)(?=Correct Answer:)/i)
    const am = block.match(/Correct Answer:\s*([^\n]+)/i)
    if (!qm || !am || !tfngAns.test(am[1].trim())) continue
    const oldPrompt = qm[2].replace(/\n+/g, ' ').trim()
    if (!writerRe.test(oldPrompt)) continue
    const newPrompt = stripWriterFromTfngPrompt(oldPrompt)
    pairs.push([oldPrompt, newPrompt])
  }
  return pairs
}

const fixExam = (exam) => {
  if (!exam.rawAnswerKey) return 0
  const pairs = collectReplacements(exam.rawAnswerKey)
  if (!pairs.length) return 0
  const { text: newKey, changes } = fixAnswerKey(exam.rawAnswerKey)
  exam.rawAnswerKey = newKey
  if (exam.rawPassageText) {
    let passage = exam.rawPassageText
    for (const [oldPrompt, newPrompt] of pairs) {
      passage = passage.split(oldPrompt).join(newPrompt)
    }
    exam.rawPassageText = passage
  }
  return changes
}

const fixJsonFile = (filePath) => {
  const exams = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let total = 0
  for (const exam of exams) {
    total += fixExam(exam)
  }
  if (total > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(exams, null, 2)}\n`)
  }
  return total
}

const fixMjsRawStrings = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8')
  let total = 0
  const blocks = content.split(/(?=Question\s+\d+:)/i)
  let changed = false
  const fixedBlocks = blocks.map((block) => {
    const qm = block.match(/^(Question\s+\d+:)([\s\S]*?)(?=Correct Answer:)/i)
    const am = block.match(/Correct Answer:\s*([^\n]+)/i)
    if (!qm || !am || !tfngAns.test(am[1].trim())) return block
    const oldPrompt = qm[2].replace(/\n+/g, ' ').trim()
    if (!writerRe.test(oldPrompt)) return block
    const newPrompt = stripWriterFromTfngPrompt(oldPrompt)
    if (newPrompt === oldPrompt) return block
    total += 1
    changed = true
    return block.replace(qm[0], `${qm[1]}${newPrompt}\n\n`)
  })
  if (changed) {
    content = fixedBlocks.join('')
    // fix parsed prompt fields
    for (const [, oldPrompt, newPrompt] of content.matchAll(
      /"prompt":\s*"((?:[^"\\]|\\.)*)"/g
    )) {
      const decoded = oldPrompt.replace(/\\"/g, '"').replace(/\\n/g, '\n')
      if (!writerRe.test(decoded)) continue
      const stripped = stripWriterFromTfngPrompt(decoded)
      if (stripped !== decoded) {
        const encoded = stripped.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        content = content.replace(`"prompt": "${oldPrompt}"`, `"prompt": "${encoded}"`)
      }
    }
    fs.writeFileSync(filePath, content)
  }
  return total
}

let grandTotal = 0
const importDir = 'cambridge-reading-imports'
for (const name of fs.readdirSync(importDir)) {
  if (!name.endsWith('.json')) continue
  const p = path.join(importDir, name)
  const n = fixJsonFile(p)
  if (n > 0) console.log(`Fixed ${n} in ${name}`)
  grandTotal += n
}

const cambridge12 = path.join('server', 'userProvidedReadingPracticeCambridge12.mjs')
if (fs.existsSync(cambridge12)) {
  const n = fixMjsRawStrings(cambridge12)
  if (n > 0) {
    console.log(`Fixed ${n} in userProvidedReadingPracticeCambridge12.mjs`)
    grandTotal += n
  }
}

// verify
let remaining = 0
for (const name of fs.readdirSync(importDir)) {
  if (!name.endsWith('.json')) continue
  const exams = JSON.parse(fs.readFileSync(path.join(importDir, name), 'utf8'))
  for (const exam of exams) {
    const blocks = (exam.rawAnswerKey || '').split(/(?=Question\s+\d+:)/i)
    for (const block of blocks) {
      const qm = block.match(/^Question\s+\d+:([\s\S]*?)(?=Correct Answer:)/i)
      const am = block.match(/Correct Answer:\s*([^\n]+)/i)
      if (!qm || !am || !tfngAns.test(am[1].trim())) continue
      if (writerRe.test(qm[1])) remaining += 1
    }
  }
}
console.log(`Done. Updated ${grandTotal} question(s). Remaining with writer: ${remaining}`)
