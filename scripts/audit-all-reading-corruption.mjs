#!/usr/bin/env node
/**
 * One audit across every LIVE reading bank (Full Reading Test Cambridge
 * 11-17/19, General Training, June 2026, Custom): real OCR/HTML corruption
 * (not the intentional "……" fill-blank markers) plus weak Thai explanations.
 *
 * Run: node scripts/audit-all-reading-corruption.mjs
 */
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { isWeakReadingExplanation } from './reading-explanation-criteria.mjs'

const BANKS = [
  ...[11, 12, 13, 14, 15, 16, 17, 19].map((n) => ({
    label: `Cambridge ${n}`,
    modulePath: `../server/userProvidedReadingPracticeCambridge${n}.mjs`,
    exportName: `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${n}_EXAMS`
  })),
  {
    label: 'General Training',
    modulePath: '../server/userProvidedReadingPracticeGeneralTraining.mjs',
    exportName: 'USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS'
  },
  {
    label: 'June 2026',
    modulePath: '../server/userProvidedReadingPracticeJune2026.mjs',
    exportName: 'USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS'
  },
  {
    label: 'Custom',
    modulePath: '../server/userProvidedReadingPracticeCustom.mjs',
    exportName: 'USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS'
  }
]

// --- corruption patterns -----------------------------------------------
const HTML_LEAKAGE = /<[a-z][a-z0-9]*[^>]{0,60}>|ielts-reading-question-number|question-number-\d+|Drop (heading|answer) here/i
const MOJIBAKE = /Â|â€™|â€œ|â€\x9d|â€“|â€”|ï¿½|Ã©|Ã¨|Ã¯|Ã´|Ã¹|Ã±/
const PLACEHOLDER_PROMPT = /^Question\s+\d+\s*$/i
const REPEATED_LEAD_SENTENCE = /^([A-Z][^.!?]{20,140}[.!?])\s+\1/
// A real "trailing decorative dots" issue: a NON fill-blank prompt (a complete
// clue phrase / statement) with 2+ ellipsis tokens glued onto the very end.
const TRAILING_DOTS = /[^…\s][.!?]?\s*(?:…\s*){2,}$/
// A List-of-Headings entry whose descriptive text was replaced by redaction
// dots — e.g. "iv … … … … … … of language" (real bug we already found once).
const HEADING_LIST_BLOCK = /List of Headings([\s\S]{0,900})/i
const HEADING_LINE = /^\s*(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b[\s.):-]*(.+)$/gim

function scanShared(text, label, hits) {
  if (!text) return
  if (HTML_LEAKAGE.test(text)) hits.push({ label, severity: 'HIGH', reason: 'raw HTML / drag-drop UI leakage', sample: text.slice(0, 160) })
  if (MOJIBAKE.test(text)) hits.push({ label, severity: 'HIGH', reason: 'mojibake (mis-decoded characters)', sample: text.slice(0, 160) })
  const dup = REPEATED_LEAD_SENTENCE.exec(text)
  if (dup) hits.push({ label, severity: 'MED', reason: 'first sentence duplicated', sample: dup[0].slice(0, 180) })
}

function scanHeadingList(text, hits) {
  const block = HEADING_LIST_BLOCK.exec(text)
  if (!block) return
  const lines = block[1].split('\n')
  for (const line of lines) {
    const m = /^\s*(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b[\s.):-]+(.+)$/i.exec(line)
    if (!m) continue
    const body = m[2].trim()
    const dotsOnly = body.replace(/…/g, '').replace(/\s+/g, ' ').trim()
    // Genuine words remaining after stripping ellipsis should be a real
    // phrase (3+ words); a corrupted heading collapses to almost nothing.
    if (/…/.test(body) && dotsOnly.split(' ').filter(Boolean).length < 3) {
      hits.push({ label: 'List of Headings', severity: 'HIGH', reason: `heading "${m[1]}" text replaced by redaction dots`, sample: line.trim() })
    }
  }
}

let grandTotalQuestions = 0
const allCorruption = []
const allWeakExplanations = []

for (const bank of BANKS) {
  const mod = await import(bank.modulePath)
  const exams = mod[bank.exportName]
  if (!Array.isArray(exams)) {
    console.log(`${bank.label}: MISSING EXPORT ${bank.exportName}`)
    continue
  }

  let bankQuestions = 0
  let bankCorruption = 0
  let bankWeak = 0

  for (const exam of exams) {
    let parsed
    try {
      parsed = buildReadingExamPayload(exam)
    } catch (err) {
      allCorruption.push({ bank: bank.label, exam: exam.id, severity: 'HIGH', reason: `PARSE ERROR: ${err.message}`, sample: '' })
      bankCorruption += 1
      continue
    }

    for (const passage of parsed.passages || []) {
      const passageHits = []
      const body = (passage.bodyParagraphs || []).join('\n\n')
      const qst = passage.questionSectionText || ''
      scanShared(body, 'passage body', passageHits)
      scanShared(qst, 'question section', passageHits)
      scanHeadingList(qst, passageHits)
      for (const h of passageHits) {
        allCorruption.push({ bank: bank.label, exam: exam.id, ...h })
        bankCorruption += 1
      }

      for (const q of passage.questions || []) {
        bankQuestions += 1
        grandTotalQuestions += 1

        const qHits = []
        const isFillBlank = q.answerType === 'text'
        scanShared(q.exactPortion || '', 'exact portion', qHits)
        if (!isFillBlank) {
          scanShared(q.prompt || '', 'prompt', qHits)
          if (q.prompt && TRAILING_DOTS.test(q.prompt.trim())) {
            qHits.push({ label: 'prompt', severity: 'LOW', reason: 'decorative trailing dots after a complete prompt', sample: q.prompt })
          }
        }
        if (q.prompt && PLACEHOLDER_PROMPT.test(q.prompt.trim())) {
          qHits.push({ label: 'prompt', severity: 'HIGH', reason: 'placeholder "Question N" prompt (never filled in)', sample: q.prompt })
        }
        if (!String(q.correctAnswer || '').trim()) {
          qHits.push({ label: 'correctAnswer', severity: 'HIGH', reason: 'empty correct answer', sample: '' })
        }
        for (const h of qHits) {
          allCorruption.push({ bank: bank.label, exam: exam.id, q: q.number, ...h })
          bankCorruption += 1
        }

        const weakReason = isWeakReadingExplanation(q)
        if (weakReason) {
          allWeakExplanations.push({ bank: bank.label, exam: exam.id, q: q.number, reason: weakReason, explanation: (q.explanationThai || '').slice(0, 90) })
          bankWeak += 1
        }
      }
    }
  }

  console.log(`${bank.label}: ${bankQuestions} questions | ${bankCorruption} corruption hits | ${bankWeak} weak explanations`)
}

console.log(`\nGrand total questions checked: ${grandTotalQuestions}`)
console.log(`Grand total corruption hits: ${allCorruption.length}`)
console.log(`Grand total weak explanations: ${allWeakExplanations.length}`)

const bySeverity = { HIGH: [], MED: [], LOW: [] }
for (const c of allCorruption) bySeverity[c.severity || 'MED'].push(c)

for (const sev of ['HIGH', 'MED', 'LOW']) {
  if (!bySeverity[sev].length) continue
  console.log(`\n=== ${sev} severity corruption (${bySeverity[sev].length}) ===`)
  for (const c of bySeverity[sev]) {
    console.log(`  [${c.bank}] ${c.exam}${c.q ? ` Q${c.q}` : ''} — ${c.label}: ${c.reason}\n      "${c.sample.replace(/\n/g, ' ')}"`)
  }
}

if (allWeakExplanations.length) {
  console.log(`\n=== Weak explanation detail (${allWeakExplanations.length}) ===`)
  for (const w of allWeakExplanations) {
    console.log(`  [${w.bank}] ${w.exam} Q${w.q} — ${w.reason}`)
  }
}
