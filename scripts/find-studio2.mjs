// Search cambridge imports for Human-Led Studio / palette passage
const books = [11,12,13,14,15,16,17,19]
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  for (const exam of m[k]) {
    for (const p of exam.parsedPayload?.passages || []) {
      const text = (p.bodyParagraphs || []).join(' ')
      const qs = (p.questions || []).filter(q => q.number >= 19 && q.number <= 26 && q.answerType === 'text')
      if (qs.length && /palette|studio|photograph.*version|rough.*version/i.test(text)) {
        console.log('FOUND C'+b+':', exam.id, '| Q range:', qs[0].number,'-',qs[qs.length-1].number)
        console.log(' Title:', p.title?.slice(0,60))
        console.log(' First 120:', text.slice(0,120))
      }
    }
  }
}
