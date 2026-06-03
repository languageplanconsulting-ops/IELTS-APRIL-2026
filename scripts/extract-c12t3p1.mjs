#!/usr/bin/env node
const mod = await import('../server/userProvidedReadingPracticeCambridge12.mjs')
const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
const exam = mod[key].find((e) => e.id === 'cambridge-12-test3-passage1')
const passage = exam.parsedPayload.passages[0]
console.log('TITLE:', passage.title)
passage.bodyParagraphs.forEach((p, i) => {
  console.log(`\n[${String.fromCharCode(65 + i)}] ${p}`)
})
console.log('\n--- Q1-9 ---')
for (const q of passage.questions) {
  if (q.number <= 9) {
    console.log(`\nQ${q.number} [${q.answerType}] answer="${q.correctAnswer}"`)
    console.log(`prompt: ${q.prompt.slice(0, 250)}`)
    console.log(`exactPortion: ${q.exactPortion?.slice(0, 250) || ''}`)
  }
}
