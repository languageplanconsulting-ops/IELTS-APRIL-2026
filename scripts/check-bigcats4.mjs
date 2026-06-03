import { buildJourneyStageDefinitions, orderJourneySourceExams, getJourneyPassageQuestionOffset } from '../src/readingJourney.ts'
const books = [11,12,13,14,15,16,17,19], pool=[]
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}
const sourceExam = pool.find(e => e.id === 'cambridge-12-test4-passage2')
const p = sourceExam.parsedPayload.passages[0]
console.log('Title:', p.title)
p.bodyParagraphs.forEach((para,i) => console.log(`[${String.fromCharCode(65+i)}] ${para.slice(0,200)}`))
console.log('\nQ19-22:')
p.questions.filter(q=>q.number>=19&&q.number<=22).forEach(q =>
  console.log(`Q${q.number} [${q.answerType}] "${q.correctAnswer}"\n  prompt: ${q.prompt?.slice(0,120)}\n  exact: ${q.exactPortion?.slice(0,120)}\n`)
)
