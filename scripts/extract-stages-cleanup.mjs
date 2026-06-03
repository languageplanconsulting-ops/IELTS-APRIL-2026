#!/usr/bin/env node
const needs = [
  { book: 13, examId: 'cambridge-13-test2-passage2', s: 21, e: 26 },
  { book: 12, examId: 'cambridge-12-test3-passage1', s: 8, e: 13 },
  { book: 13, examId: 'cambridge-13-test4-passage1', s: 9, e: 13 },
  { book: 12, examId: 'cambridge-12-test1-passage1', s: 6, e: 13 },
  { book: 15, examId: 'cambridge-15-test3-passage1', s: 8, e: 13 },
  { book: 13, examId: 'cambridge-13-test1-passage1', s: 1, e: 7 }
]
const cache = {}
for (const n of needs) {
  if (!cache[n.book]) {
    const mod = await import(`../server/userProvidedReadingPracticeCambridge${n.book}.mjs`)
    const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
    cache[n.book] = mod[key]
  }
  const exam = cache[n.book].find((e) => e.id === n.examId)
  const passage = exam.parsedPayload.passages[0]
  console.log('\n\n=== ' + n.examId + ' Q' + n.s + '-' + n.e + ' ===')
  passage.bodyParagraphs.forEach((p, i) =>
    console.log(`\n[${String.fromCharCode(65 + i)}] ${p}`)
  )
  console.log('\n--- target questions ---')
  for (const q of passage.questions) {
    if (q.number >= n.s && q.number <= n.e) {
      console.log(`\nQ${q.number} answer="${q.correctAnswer}" type=${q.answerType}`)
      console.log(`prompt: ${(q.prompt || '').slice(0, 250)}`)
      console.log(`exactPortion: ${(q.exactPortion || '').slice(0, 250)}`)
    }
  }
}
