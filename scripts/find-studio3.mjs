// Check ALL non-cambridge exam files for the Human-Led Studio passage
import fs from 'node:fs'
import path from 'node:path'
const serverDir = './server'
const files = fs.readdirSync(serverDir).filter(f => f.startsWith('userProvided') && f.endsWith('.mjs') && !f.includes('Cambridge') && !f.includes('GeneralTraining'))
console.log('Checking:', files)
for (const file of files) {
  try {
    const m = await import(`../server/${file}`)
    const key = Object.keys(m).find(k => typeof m[k] === 'object' && Array.isArray(m[k]))
    if (!key) { console.log(file, '- no array export'); continue }
    const exams = m[key]
    for (const exam of exams) {
      for (const p of exam.parsedPayload?.passages || []) {
        const qs = (p.questions || []).filter(q => q.number >= 20 && q.number <= 26 && q.answerType === 'text')
        if (qs.length >= 3) {
          console.log(`CANDIDATE: ${exam.id} | ${p.title?.slice(0,80)} | Q${qs[0].number}-${qs[qs.length-1].number}`)
          console.log('  First prompt:', qs[0].prompt?.slice(0,100))
        }
      }
    }
  } catch(e) { console.log(file, 'error:', e.message?.slice(0,60)) }
}
