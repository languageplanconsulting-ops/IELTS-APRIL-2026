#!/usr/bin/env node
const m = await import('../server/userProvidedReadingPracticeCambridge12.mjs')
const k = Object.keys(m).find(x => x.includes('EXAMS'))
const exam = m[k].find(e => e.id === 'cambridge-12-test4-passage2')
const p = exam.parsedPayload.passages[0]
console.log('Title:', p.title)
console.log('\nParagraphs:')
p.bodyParagraphs.forEach((para, i) => console.log(`[${String.fromCharCode(65+i)}] ${para.slice(0,200)}`))
console.log('\nQ32-35:')
p.questions.filter(q => q.number >= 32 && q.number <= 35).forEach(q =>
  console.log(`Q${q.number} [${q.answerType}] answer="${q.correctAnswer}"\n  prompt: ${q.prompt?.slice(0,120)}\n  exact: ${q.exactPortion?.slice(0,120)}`)
)
