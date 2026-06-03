const files = [
  'userProvidedReadingPractice',
  'userProvidedReadingPractice2',
  'userProvidedReadingPractice3',
  'userProvidedReadingPractice4',
  'userProvidedReadingPractice5',
  'userProvidedReadingPracticeJune2026'
]
for (const f of files) {
  try {
    const m = await import(`../server/${f}.mjs`)
    const key = Object.keys(m).find(k => k.includes('EXAM') || k.includes('exam'))
    if (!key) continue
    for (const exam of m[key]) {
      for (const p of exam.parsedPayload?.passages || []) {
        const text = (p.bodyParagraphs || []).join(' ')
        if (/palette|Human.Led Studio|studio method/i.test(text)) {
          console.log('FOUND:', exam.id, '|', p.title?.slice(0,60))
        }
      }
    }
  } catch(e) { /* skip */ }
}
