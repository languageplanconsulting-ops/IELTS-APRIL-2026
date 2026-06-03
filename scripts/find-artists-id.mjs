const m = await import('../server/readingImportUtils.mjs')
const json = JSON.parse((await import('node:fs')).readFileSync('./cambridge-reading-imports/ielts-academic-reading-march-2026-passage-2-artists-ai.json','utf8'))
const exam = json[0]
// Check what ID gets assigned
console.log('title:', exam.title)
console.log('rawPassageText starts:', exam.rawPassageText?.slice(0,100))
// Try to find it by checking parsed payload directly
if (exam.parsedPayload) {
  for (const p of exam.parsedPayload.passages || []) {
    const qs = (p.questions||[]).filter(q=>q.number>=21&&q.number<=26)
    console.log('passage', p.number, 'fill Q21-26:', qs.map(q=>q.number+':'+q.correctAnswer).join(', '))
  }
}
