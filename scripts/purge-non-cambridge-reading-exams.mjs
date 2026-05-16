import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim().replace(/\/$/, '')
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const isCambridgeBookReadingExam = (exam) => {
  // Keep in sync with src/App.tsx isCambridgeBookReadingExam and server/index.mjs
  const id = String(exam?.id || '').toLowerCase()
  const title = String(exam?.title || '').toLowerCase()
  return (
    /^cambridge-(1[2-3]|17|19)-/.test(id) ||
    /\bcambridge\s*(1[2-3]|17|19)\b/.test(title) ||
    /^c(12|13|17|19)\s/.test(title)
  )
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json'
}

const listResponse = await fetch(
  `${SUPABASE_URL}/rest/v1/reading_exams?select=id,title&order=created_at.desc`,
  { headers }
)

if (!listResponse.ok) {
  console.error('Failed to list reading exams:', listResponse.status, await listResponse.text())
  process.exit(1)
}

const exams = await listResponse.json()
const toDelete = (Array.isArray(exams) ? exams : []).filter((exam) => !isCambridgeBookReadingExam(exam))
const toKeep = (Array.isArray(exams) ? exams : []).filter((exam) => isCambridgeBookReadingExam(exam))

console.log(`Found ${exams.length} uploaded reading exam(s).`)
console.log(`Keeping ${toKeep.length} Cambridge 12/13/18/19 exam(s).`)
console.log(`Deleting ${toDelete.length} non-Cambridge book exam(s).`)

for (const exam of toDelete) {
  const deleteResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/reading_exams?id=eq.${encodeURIComponent(exam.id)}`,
    { method: 'DELETE', headers: { ...headers, Prefer: 'return=minimal' } }
  )
  if (!deleteResponse.ok) {
    console.error(`Failed to delete ${exam.id} (${exam.title}):`, deleteResponse.status, await deleteResponse.text())
    process.exit(1)
  }
  console.log(`Deleted: ${exam.title}`)
}

console.log('Done.')
