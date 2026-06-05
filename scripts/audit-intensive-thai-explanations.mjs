#!/usr/bin/env node
/**
 * Audit intensive journey Thai explanations (thaiMeaning).
 * Run: node scripts/audit-intensive-thai-explanations.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const ANSWER_ONLY =
  /^(TRUE|FALSE|NOT GIVEN|YES|NO|[A-H]|[A-H]{2}(?:\/[A-H])?|i{1,3}|iv|v|vi{0,3}|vii{0,3}|viii|ix|x|xi|xii|\d+|[\d,.\s]+|population|suburbs|funding|fire|tool|meat|game)$/i

const hasThai = (s) => /[\u0E00-\u0E7F]{4,}/.test(s)

const isEnglishSentence = (s) => /^[A-Za-z"'(]/.test(s.trim()) && s.length > 60

function parseSolutionsFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const rows = []
  const stageChunks = text.split(/\n  (\d+): \{\n/).slice(1)
  for (let i = 0; i < stageChunks.length; i += 2) {
    const stage = Number(stageChunks[i])
    const stageBody = stageChunks[i + 1] || ''
    for (const passage of [1, 2]) {
      const pRe = new RegExp(`    ${passage}: \\{([\\s\\S]*?)\\n    \\},`)
      const block = stageBody.match(pRe)?.[1]
      if (!block) continue
      const qRe =
        /(\d+):\s*s\('((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)'\)/g
      let m
      while ((m = qRe.exec(block)) !== null) {
        const unesc = (x) => x.replace(/\\'/g, "'").replace(/\\n/g, '\n')
        rows.push({
          stage,
          passage,
          qNum: Number(m[1]),
          passageKeyword: unesc(m[2]),
          questionKeyword: unesc(m[3]),
          thaiMeaning: unesc(m[4])
        })
      }
    }
  }
  return rows
}

const files = [
  'src/intensiveJourneyQuestionSolutions1to5.ts',
  'src/intensiveJourneyQuestionSolutions6to17.ts'
]

const rows = files.flatMap((f) => parseSolutionsFile(path.join(root, f)))

function classify(row) {
  const { passageKeyword, questionKeyword, thaiMeaning } = row
  const issues = []

  if (!thaiMeaning?.trim()) issues.push('missing_thai')
  else if (ANSWER_ONLY.test(thaiMeaning.trim())) issues.push('answer_only')
  else if (!hasThai(thaiMeaning)) issues.push('no_thai_script')
  else if (thaiMeaning.length < 15) issues.push('thai_too_short')

  if (isEnglishSentence(passageKeyword)) issues.push('passage_field_is_evidence')
  if (passageKeyword.length > 100) issues.push('passage_keyword_too_long')
  if (questionKeyword.length > 70) issues.push('question_keyword_long')
  if (/…|\.\.\./.test(questionKeyword)) issues.push('keyword_ellipsis')
  if (/For example,|Question \d/i.test(questionKeyword)) issues.push('keyword_garbage')

  return { ...row, issues }
}

const findings = rows.map(classify).filter((r) => r.issues.length)

const byIssue = {}
for (const f of findings) {
  for (const i of f.issues) byIssue[i] = (byIssue[i] || 0) + 1
}

const answerOnlyByStage = {}
for (const f of findings.filter((x) => x.issues.includes('answer_only'))) {
  answerOnlyByStage[f.stage] = (answerOnlyByStage[f.stage] || 0) + 1
}

const goodThaiByStage = {}
for (const r of rows) {
  if (hasThai(r.thaiMeaning) && !ANSWER_ONLY.test(r.thaiMeaning.trim())) {
    goodThaiByStage[r.stage] = (goodThaiByStage[r.stage] || 0) + 1
  }
}

console.log('=== Intensive journey Thai explanation audit ===\n')
console.log(`Total questions: ${rows.length}`)
console.log(`Questions with issues: ${findings.length} (${((findings.length / rows.length) * 100).toFixed(1)}%)\n`)

console.log('Issue type counts:')
for (const [k, v] of Object.entries(byIssue).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${v}`)
}

console.log('\nด่าน with real Thai explanations (not answer-only):')
for (let s = 1; s <= 17; s++) {
  const total = rows.filter((r) => r.stage === s).length
  const good = goodThaiByStage[s] || 0
  if (!total) continue
  console.log(`  ด่าน ${s}: ${good}/${total} (${((good / total) * 100).toFixed(0)}%)`)
}

console.log('\nAnswer-only thaiMeaning count by stage:')
for (let s = 1; s <= 17; s++) {
  if (answerOnlyByStage[s]) console.log(`  ด่าน ${s}: ${answerOnlyByStage[s]}`)
}

console.log('\n--- Example problems (ด่าน 12 P2) ---')
findings
  .filter((f) => f.stage === 12 && f.passage === 2)
  .slice(0, 5)
  .forEach((f) => {
    console.log(`Q${f.qNum} [${f.issues.join(', ')}]`)
    console.log(`  thai: ${f.thaiMeaning}`)
    console.log(`  passage field: ${f.passageKeyword.slice(0, 70)}...`)
  })
