#!/usr/bin/env node
// Print the full passage paragraphs + question section for each source exam
// where we need to author a new manual fill-blank set for stages 5-10.

const needs = [
  { book: 16, examId: 'cambridge-16-test2-passage1', sourceStart: 8, sourceEnd: 13 },
  { book: 14, examId: 'cambridge-14-test1-passage2', sourceStart: 14, sourceEnd: 20 },
  { book: 19, examId: 'cambridge-19-test2-passage1', sourceStart: 8, sourceEnd: 13 },
  { book: 14, examId: 'cambridge-14-test3-passage2', sourceStart: 22, sourceEnd: 26 },
  { book: 11, examId: 'cambridge-11-test2-passage1', sourceStart: 8, sourceEnd: 13 },
  { book: 15, examId: 'cambridge-15-test1-passage2', sourceStart: 19, sourceEnd: 26 }
]

const cache = {}
for (const n of needs) {
  if (!cache[n.book]) {
    const mod = await import(`../server/userProvidedReadingPracticeCambridge${n.book}.mjs`)
    const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
    cache[n.book] = mod[key]
  }
  const exam = cache[n.book].find((e) => e.id === n.examId)
  if (!exam) {
    console.log(`!!! NOT FOUND: ${n.examId}`)
    continue
  }
  const passage = exam.parsedPayload.passages[0]
  console.log('\n\n=====================================================')
  console.log(`EXAM: ${n.examId}`)
  console.log(`TITLE: ${passage.title}`)
  console.log(`TARGET QUESTIONS: ${n.sourceStart}-${n.sourceEnd}`)
  console.log('=====================================================')
  console.log('--- PARAGRAPHS ---')
  passage.bodyParagraphs.forEach((p, i) => {
    const letter = String.fromCharCode(65 + i)
    console.log(`\n[${letter}] ${p}`)
  })
  console.log('\n--- QUESTIONS (only target range) ---')
  for (const q of passage.questions) {
    if (q.number >= n.sourceStart && q.number <= n.sourceEnd) {
      console.log(`\nQ${q.number} [${q.answerType}] answer="${q.correctAnswer}"`)
      console.log(`prompt: ${q.prompt.slice(0, 300)}`)
      console.log(`exactPortion: ${q.exactPortion?.slice(0, 300) || ''}`)
    }
  }
}
