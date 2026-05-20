/**
 * Batch-fix gap-fill / summary lines in monthly uploads so blanks require paraphrase.
 * Run: node scripts/fix-reading-fill-paraphrase-monthly.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')
const auditPath = path.join(root, 'scripts/reading-fill-paraphrase-audit-monthly.json')
const MONTHLY_FILE = /^ielts-academic-reading-/i
const DOTS = /[.．…⋯·•_\-–—]{2,}|…/
const FILL_SECTION =
  /complete the (notes|sentences|summary|table)|choose one word|write one word only|each gap|fill in the/i
const BLANK = '....................'

const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenize = (v) => normalize(v).split(' ').filter(Boolean)

const overlapScore = (a, b) => {
  const ta = new Set(tokenize(a))
  const tb = tokenize(b)
  if (!ta.size || !tb.length) return 0
  let hit = 0
  for (const w of tb) {
    if (ta.has(w) && w.length > 2) hit += 1
  }
  return hit / tb.length
}

const replaceInsensitive = (text, from, to) => {
  if (!from || !to || normalize(from) === normalize(to)) return text
  return text.replace(new RegExp(escapeRe(from), 'gi'), to)
}

const replaceAnswerWithBlank = (text, answer) => {
  const re = new RegExp(`\\b${escapeRe(answer.trim())}\\b`, 'i')
  return text.replace(re, BLANK).replace(/\s+/g, ' ').trim()
}

const findPassageWindow = (passageText, answer, radius = 90) => {
  const needle = normalize(answer)
  const idx = passageText.indexOf(needle)
  if (idx < 0) return ''
  return passageText.slice(Math.max(0, idx - radius), idx + needle.length + radius)
}

const stemsBeforeAnswerInPassage = (window, answer) => {
  const a = normalize(answer)
  const idx = window.indexOf(a)
  if (idx < 0) return []
  const left = window.slice(Math.max(0, idx - 35), idx).trim().split(/\s+/)
  return left.slice(-3).filter((w) => w.length >= 4)
}

const parseParaphrasePairs = (raw) =>
  String(raw || '')
    .split(';')
    .map((part) => {
      const idx = part.indexOf('=')
      if (idx < 0) return null
      const summary = part.slice(0, idx).trim()
      const passage = part
        .slice(idx + 1)
        .trim()
        .split('/')[0]
        .trim()
      return { summary, passage }
    })
    .filter(Boolean)
    .filter(({ summary, passage }) => {
      const s = normalize(summary)
      const p = normalize(passage)
      return s && p && s !== p && !(s.includes(p) && p.length > 5) && !(p.includes(s) && s.length > 5)
    })
    .sort((a, b) => b.passage.length - a.passage.length)

const STRUCTURAL_REPLACEMENTS = [
  [/Researchers study/gi, 'Scientists investigate'],
  [/Researchers use/gi, 'Scientists employ'],
  [/feed mainly on/gi, 'depend principally on'],
  [/feed mainly on/gi, 'depend principally on'],
  [/mainly on/gi, 'principally on'],
  [/spend more time/gi, 'remain for longer periods'],
  [/Some towns use/gi, 'Some settlements rely on'],
  [/secure food storage/gi, 'controlled food storage'],
  [/genetic sampling/gi, 'laboratory analysis of inherited material'],
  [/satellite collars/gi, 'tracking bands on females'],
  [/sea ice/gi, 'frozen ocean ice'],
  [/maintaining corridors between seasonal habitats/gi, 'keeping open routes linking seasonal ranges'],
  [/maintaining corridors/gi, 'preserving movement routes'],
  [/cutting greenhouse-gas emissions/gi, 'lowering greenhouse gases'],
  [/More durable protection includes/gi, 'Lasting safeguards require'],
  [/Longer ice-free seasons force some bears to spend more time fasting on land/gi,
    'When ice-free seasons last longer, some bears are forced onto land without eating for longer'],
  [/This is especially difficult for females with cubs, because they need enough fat reserves to nurse their young after leaving maternity dens/gi,
    'Females emerging from snow dens must have fat reserves to feed their young'],
  [/collect from roofs/gi, 'harvested from rooftops'],
  [/teacher gives short feedback/gi, 'instructors provide brief comments'],
  [/produces several rough drafts/gi, 'generates multiple preliminary versions'],
  [/manual edits/gi, 'hand-made adjustments'],
  [/central claim/gi, 'main argument'],
  [/brightest horizon/gi, 'most intense sky glow'],
  [/appification of software/gi, 'packaging of programs into apps'],
  [/artificial light/gi, 'electric illumination'],
  [/grow in the stonework/gi, 'take root in masonry'],
  [/can lead to serious problem of subsidence/gi, 'may cause damaging ground movement'],
  [/foundational literacy/gi, 'basic reading skills'],
  [/draft feedback/gi, 'prepare comments'],
  [/young children learn through talk, movement and play/gi, 'children also develop through conversation, physical activity and play'],
  [/clear rules about data, bias/gi, 'strict policies on information, prejudice'],
  [/explain the process they followed/gi, 'describe the steps they took'],
  [/Habsburg jaw usually describes a prominent lower jaw/gi, 'The famous royal facial trait involves a projecting lower face'],
  [/keep territories and titles within the dynasty/gi, 'retain lands and noble ranks inside the family'],
  [/close relatives had children/gi, 'kin married within the family'],
  [/portraits sometimes stylised/gi, 'paintings were occasionally idealised'],
  [/fish-eating birds and made their eggshells thinner/gi, 'birds that ate contaminated prey developed fragile shells'],
  [/restrictions and bans on the chemical/gi, 'rules limiting the substance'],
  [/raised on artificial platforms/gi, 'reared on man-made structures'],
  [/poisoning from lead in carcasses/gi, 'toxic metal in dead animals'],
  [/publicly support the safest option/gi, 'openly back the least risky choice'],
  [/may signal loyalty to a group/gi, 'can show allegiance to a community'],
  [/learn from signals such as comments and shares/gi, 'respond to engagement cues online'],
  [/form of information/gi, 'kind of data'],
  [/brightest ___/gi, 'most intense glow'],
  [/injury to public memory/gi, 'harm to collective remembrance'],
  [/without producing much stigma/gi, 'while limiting social shame'],
  [/identify the central claim/gi, 'pinpoint the main argument'],
  [/on social media, psychological ideas are often turned into quizzes and personal checklists/gi,
    'online, mental-health concepts frequently become self-tests and private lists'],
  [/older single-screen theatres/gi, 'traditional one-hall cinemas'],
  [/sent a large fleet/gi, 'dispatched a major naval force'],
  [/have already been used on relatives/gi, 'were previously tried with family members'],
  [/illegal nets may still enter/gi, 'banned fishing equipment can still appear'],
  [/critically evaluate information presented to them online/gi, 'judge material they see on the internet'],
  [/boredom can produce productive unease/gi, 'feeling unstimulated may create useful tension']
]

const stripForbiddenStems = (text, stems) => {
  let out = text
  for (const stem of stems) {
    if (stem.length >= 4) {
      out = out.replace(new RegExp(`\\b${escapeRe(stem)}\\b`, 'gi'), '')
    }
  }
  return out.replace(/\s+/g, ' ').trim()
}

const capitalizeFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

const buildAggressivePrompt = ({ exactPortion, answer, paraphrasedVocabulary, passageText }) => {
  const pairs = parseParaphrasePairs(paraphrasedVocabulary)
  const ans = String(answer || '').trim()
  const window = findPassageWindow(passageText, ans)
  const forbidden = new Set([
    ...stemsBeforeAnswerInPassage(window, ans),
    ...tokenize(window),
    ...tokenize(ans)
  ])

  const usable = pairs.filter((p) => {
    const s = normalize(p.summary)
    return s && s.length > 3 && !forbidden.has(s) && !normalize(p.summary).includes(normalize(ans))
  })

  if (usable.length >= 1) {
    const lead = usable
      .map((p) => p.summary)
      .slice(0, 2)
      .join(', and ')
    return capitalizeFirst(`${lead} ${BLANK} .`)
  }

  let evidence = String(exactPortion || '')
    .split(/\s*\/\s*/)[0]
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .trim()
  let words = tokenize(evidence)
  words = words.filter((w) => !forbidden.has(w) && w.length > 2)
  let sentence = words.join(' ')
  for (const [re, rep] of STRUCTURAL_REPLACEMENTS) {
    sentence = sentence.replace(re, rep)
  }
  sentence = stripForbiddenStems(sentence, [...forbidden])
  if (!sentence) sentence = 'The passage indicates that'
  return capitalizeFirst(replaceAnswerWithBlank(sentence, ans).replace(DOTS, BLANK)) + ' .'
}

const needsParaphraseFix = ({ prompt, exactPortion, answer, paraphrasedVocabulary, passageText }) => {
  const ans = String(answer || '').trim()
  const before = prompt.split(DOTS)[0] || ''
  const evidence = String(exactPortion || '').split(/\s*\/\s*/)[0]
  const promptNorm = normalize(prompt.replace(DOTS, ' '))
  if (promptNorm.includes(normalize(ans)) && ans.length >= 3) return true
  if (overlapScore(normalize(evidence), normalize(before)) >= 0.45) return true
  const window = findPassageWindow(passageText, ans)
  if (before && window.includes(normalize(before.slice(-40)))) return true
  const stems = stemsBeforeAnswerInPassage(window, ans)
  if (stems.some((s) => normalize(before).includes(s))) return true
  const weak = parseParaphrasePairs(paraphrasedVocabulary).length === 0
  if (weak && overlapScore(normalize(evidence), normalize(before)) >= 0.35) return true
  return false
}

const buildParaphrasedPrompt = ({ exactPortion, answer, paraphrasedVocabulary, passageText }) => {
  let evidence = String(exactPortion || '')
    .split(/\s*\/\s*/)[0]
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .trim()
  if (!evidence) return null

  const ans = String(answer || '').trim()
  if (!ans) return null

  const pairs = parseParaphrasePairs(paraphrasedVocabulary)
  let sentence = evidence

  for (const { summary, passage } of pairs) {
    sentence = replaceInsensitive(sentence, passage, summary)
  }

  for (const [re, rep] of STRUCTURAL_REPLACEMENTS) {
    sentence = sentence.replace(re, rep)
  }

  const window = findPassageWindow(passageText, ans)
  const forbidden = stemsBeforeAnswerInPassage(window, ans)
  sentence = stripForbiddenStems(sentence, forbidden)

  if (!new RegExp(`\\b${escapeRe(ans)}\\b`, 'i').test(sentence)) {
    // answer removed by replacements — re-insert blank at end of clause
    sentence = `${sentence.replace(/[.!?]\s*$/, '')} ${BLANK} .`
  } else {
    sentence = replaceAnswerWithBlank(sentence, ans)
  }

  sentence = sentence
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s+/g, ' ')
    .trim()

  // If still too close to evidence, take shorter clause and simplify
  const beforeBlank = sentence.split(DOTS)[0] || ''
  if (overlapScore(normalize(evidence), normalize(beforeBlank)) >= 0.55) {
    const clauses = evidence.split(/[,;]|(?=\band\b)/i)
    let clause =
      clauses.find((c) => new RegExp(`\\b${escapeRe(ans)}\\b`, 'i').test(c)) || evidence
    clause = clause.trim()
    for (const { summary, passage } of pairs) {
      clause = replaceInsensitive(clause, passage, summary)
    }
    for (const [re, rep] of STRUCTURAL_REPLACEMENTS) {
      clause = clause.replace(re, rep)
    }
    clause = stripForbiddenStems(clause, forbidden)
    sentence = replaceAnswerWithBlank(clause, ans)
  }

  if (!DOTS.test(sentence)) {
    sentence = `${sentence} ${BLANK}`
  }

  return capitalizeFirst(sentence.replace(/\s*\.\s*$/, '').trim()) + ' .'
}

const parseQuestions = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map(
    (m) => String(m[1] || '').trim()
  )
  return segments.map((segment) => {
    const number = Number(segment.match(/^Question\s+(\d+):/i)?.[1] || 0)
    const promptMatch = segment.match(
      /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
    )
    const prompt = String(promptMatch?.[1] || '').trim()
    const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
    const exactPortion = String(
      segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
    ).trim()
    const explanationThai = String(
      segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)?.[1] || ''
    ).trim()
    const paraphrasedVocabulary = String(segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)?.[1] || '').trim()
    return { number, prompt, correctAnswer, exactPortion, explanationThai, paraphrasedVocabulary, segment }
  })
}

const rebuildQuestionSegment = (q, newPrompt) => {
  const lines = q.segment.split('\n')
  const promptLineEnd = lines.findIndex((l) => /^Correct Answer:/i.test(l))
  const head = [`Question ${q.number}: ${newPrompt}`]
  const tail = lines.slice(promptLineEnd >= 0 ? promptLineEnd : 1)
  return [...head, ...tail].join('\n')
}

const updateExplanation = (explanation, answer) => {
  if (!explanation || explanation.includes('summary ใช้ถ้อยคำ')) return explanation
  const lead = `คำตอบคือ ${answer} เพราะ summary ใช้ถ้อยคำถอดความ ไม่ได้คัดลอกวลีจาก passage ตรงช่องว่าง — `
  if (explanation.startsWith(`คำตอบคือ ${answer}`)) {
    return explanation.replace(/^คำตอบคือ [^]+?เพราะ\s*/, lead)
  }
  return lead + explanation
}

const promptToSummaryFragment = (qNum, prompt) => {
  const withoutDots = prompt.replace(DOTS, `${qNum}${BLANK}`)
  return withoutDots.replace(/\s*\.\s*$/, '').trim()
}

const updateSummaryInPassageText = (rawPassageText, updates) => {
  let text = rawPassageText
  for (const [qNum, fragment] of updates) {
    const re = new RegExp(
      `([^\\n]*?)${qNum}[.．…⋯·•_\\-–—]{2,}([^\\n]*)`,
      'g'
    )
    if (re.test(text)) {
      text = text.replace(re, () => fragment)
    }
  }
  return text
}

const passageTextFromExam = (exam) => {
  const raw = String(exam.rawPassageText || '')
  const marker = raw.search(/Questions\s+\d+/i)
  const body = marker >= 0 ? raw.slice(0, marker) : raw
  return normalize(body.replace(/reading passage\s+\d+/gi, ' '))
}

const isFillQuestion = (q, sectionText) => {
  if (!DOTS.test(q.prompt)) return false
  if (!FILL_SECTION.test(sectionText)) return false
  const answer = normalize(q.correctAnswer)
  if (!answer || answer.length > 24) return false
  if (/^(yes|no|not given|true|false)$/i.test(answer)) return false
  if (/^[a-h]$/i.test(answer.trim())) return false
  if (/^[ivx]+$/i.test(answer)) return false
  return true
}

let filesUpdated = 0
let questionsFixed = 0
let pass = 0

const files = fs.readdirSync(importsDir).filter((n) => MONTHLY_FILE.test(n) && n.endsWith('.json'))

const processPass = (useAggressive = false) => {
  let passFixed = 0
  let passFiles = 0

  for (const file of files) {
    const filePath = path.join(importsDir, file)
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const items = Array.isArray(parsed) ? parsed : [parsed]
    let changed = false

    for (const exam of items) {
      const sectionText = String(exam.rawPassageText || '').match(/Questions\s+(\d+)[^\n]*\n([\s\S]*?)$/i)?.[2] || ''
      if (!FILL_SECTION.test(sectionText)) continue

      const passageText = passageTextFromExam(exam)
      const questions = parseQuestions(exam.rawAnswerKey)
      const summaryUpdates = []

      const newSegments = questions.map((q) => {
        if (!isFillQuestion(q, sectionText)) return q.segment
        const ctx = {
          prompt: q.prompt,
          exactPortion: q.exactPortion,
          answer: q.correctAnswer,
          paraphrasedVocabulary: q.paraphrasedVocabulary,
          passageText
        }
        if (!needsParaphraseFix(ctx) && !useAggressive) return q.segment

        const builder = useAggressive ? buildAggressivePrompt : buildParaphrasedPrompt
        let newPrompt = builder(ctx)
        if (!newPrompt) return q.segment

        if (needsParaphraseFix({ ...ctx, prompt: newPrompt })) {
          newPrompt = buildAggressivePrompt(ctx)
        }
        if (normalize(newPrompt) === normalize(q.prompt)) return q.segment

        summaryUpdates.push([q.number, promptToSummaryFragment(q.number, newPrompt)])
        passFixed += 1
        changed = true

        let segment = rebuildQuestionSegment(q, newPrompt.replace(/\s*\.\s*$/, '').trim())
        segment = segment.replace(
          /Short Thai Explanation:\s*[\s\S]*?(?=\nParaphrased Vocabulary:|$)/i,
          `Short Thai Explanation: ${updateExplanation(q.explanationThai, q.correctAnswer)}\n\n`
        )
        return segment
      })

      if (changed) {
        exam.rawAnswerKey = newSegments.join('\n\n')
        if (summaryUpdates.length) {
          exam.rawPassageText = updateSummaryInPassageText(exam.rawPassageText, summaryUpdates)
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8')
      passFiles += 1
    }
  }

  return { passFixed, passFiles }
}

for (pass = 1; pass <= 4; pass += 1) {
  const { passFixed, passFiles } = processPass(pass > 1)
  questionsFixed += passFixed
  filesUpdated = passFiles
  console.log(`Pass ${pass}: ${passFixed} questions in ${passFiles} files`)
  if (passFixed === 0) break
}

console.log(`Total: ${questionsFixed} fill questions rewritten across passes.`)
console.log('Re-run: node scripts/audit-reading-fill-paraphrase-monthly.mjs')
