import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'

const isBadPrompt = (question) => {
  const prompt = String(question.prompt || '').trim()
  if (!prompt) return 'empty prompt'
  if (/^Question\s+\d+$/i.test(prompt)) return 'generic Question X prompt'
  if (/Cambridge 17 Test \d+ Passage \d+ — Question/i.test(prompt)) return 'fallback prompt'
  if (/^Complete the summary — \d+\s*…\s*$/i.test(prompt)) return 'bare summary gap'
  return ''
}

const OCR_RE = /1718867188|HHSRERARRER|ttt(he|his)|moou»|coU»|oou»|PIA\s*\d+/i

let failures = 0
for (const exam of USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS) {
  const payload = buildReadingExamPayload(exam)
  const expectedCat = exam.id.endsWith('passage3') ? 'advanced' : 'normal'
  if (payload.category !== expectedCat) {
    console.error(`${exam.id}: category ${payload.category} (expected ${expectedCat})`)
    failures += 1
  }
  const body = payload.passages?.[0]?.bodyParagraphs?.join(' ') || ''
  if (OCR_RE.test(body)) {
    console.error(`${exam.id}: OCR noise in passage`)
    failures += 1
  }
  if (/Questions \d+-\d+/.test(body)) {
    console.error(`${exam.id}: questions in passage body`)
    failures += 1
  }
  for (const q of payload.passages?.[0]?.questions || []) {
    const reason = isBadPrompt(q)
    if (reason) {
      console.error(`${exam.id} Q${q.number}: ${reason} — ${JSON.stringify(q.prompt.slice(0, 80))}`)
      failures += 1
    }
  }
}

if (failures > 0) {
  console.error(`\nCambridge 17 verification failed: ${failures} issue(s)`)
  process.exit(1)
}

const qCount = USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS.reduce(
  (s, e) => s + (e.parsedPayload?.passages?.[0]?.questions?.length || 0),
  0
)
console.log(`Cambridge 17 verification passed: 12 exams, ${qCount} questions.`)
