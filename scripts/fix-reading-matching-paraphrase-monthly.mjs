/**
 * Fix matching questions flagged by audit-reading-matching-paraphrase-monthly.mjs
 * Run: node scripts/fix-reading-matching-paraphrase-monthly.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')
const auditPath = path.join(root, 'scripts/reading-matching-paraphrase-audit-monthly.json')

const STOP = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'with', 'and', 'or', 'as', 'at', 'by', 'from', 'that',
  'this', 'which', 'what', 'how', 'when', 'where', 'why', 'who', 'are', 'was', 'were', 'been', 'being',
  'have', 'has', 'had', 'not', 'but', 'into', 'about', 'than', 'then', 'them', 'they', 'their', 'there',
  'reference', 'mention', 'details', 'description', 'explanation', 'suggestion', 'account', 'examples',
  'example', 'following', 'information', 'section', 'paragraph', 'heading', 'statements', 'writer', 'make',
  'made', 'does', 'did', 'can', 'could', 'would', 'should', 'will', 'also', 'only', 'more', 'most', 'some'
])

const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (v) => normalize(v).split(' ').filter((w) => w.length > 2 && !STOP.has(w))

const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w)

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const SYNONYM = {
  involvement: 'connection',
  denied: 'rejected',
  denial: 'rejection',
  raiding: 'attacks',
  raiders: 'attackers',
  banditry: 'bandit attacks',
  piracy: 'pirate activity',
  different: 'distinct',
  alternatives: 'other options',
  method: 'approach',
  materials: 'inputs',
  media: 'formats',
  childcare: 'child-care support',
  policies: 'rules',
  delayed: 'postponed',
  adulthood: 'adult milestones',
  graduates: 'university leavers',
  entertainment: 'popular media',
  communities: 'online groups',
  distress: 'suffering',
  trauma: 'psychological harm',
  public: 'general',
  support: 'backing',
  campaign: 'operation',
  organised: 'structured',
  organized: 'structured',
  eradication: 'elimination',
  pirates: 'sea raiders',
  headings: 'titles',
  features: 'traits',
  reliable: 'dependable',
  parental: 'family',
  leave: 'time off',
  affect: 'shape',
  decisions: 'choices',
  parenthood: 'having children',
  resources: 'support',
  easier: 'less difficult',
  household: 'family home',
  formation: 'setup',
  labour: 'workforce',
  market: 'economy',
  rewards: 'favours',
  extended: 'longer',
  preparation: 'training',
  rents: 'housing costs',
  saving: 'putting money aside',
  deposit: 'down payment',
  marriage: 'wedding',
  commitment: 'dedication',
  employed: 'in work',
  settled: 'secure',
  fragmented: 'piecemeal',
  temporary: 'short-term',
  postponed: 'put off',
  ownership: 'buying property',
  graduates: 'leavers',
  buying: 'purchasing',
  home: 'property'
}

const EVIDENCE_CLAUSE_MAP = [
  [/denied any involvement/gi, 'a local ruler rejecting accusations of supporting the attackers'],
  [/rejected .* claims/gi, 'a monarch dismissing allegations of links to raiders'],
  [/different from many alternatives/gi, 'how an approach contrasts with other options'],
  [/range of materials and media/gi, 'the variety of physical and digital inputs required'],
  [/reliable childcare and parental leave/gi, 'dependable child-care support and parental leave'],
  [/delayed adulthood/gi, 'postponed adult milestones'],
  [/childcare and leave policies affect/gi, 'rules on child-care support and leave shaping'],
  [/publicly support the opinion that seems safest/gi, 'openly backing the least risky view'],
  [/hide their private doubts/gi, 'concealing personal reservations'],
  [/everyday trauma terms/gi, 'common psychological labels'],
  [/clinical labels in entertainment/gi, 'medical terms used in popular media'],
  [/digital communities/gi, 'online groups'],
  [/home ownership once gave/gi, 'buying a home once offered'],
  [/undermined foundations can lead to subsidence/gi, 'weakened bases may cause ground movement']
]

const extractPromptLead = (prompt) => {
  const m = String(prompt || '').match(
    /^(a reference to|an explanation of|an account of|a mention of|details of|examples of|reference to|mention of|description of|suggestion that)\s+/i
  )
  return m ? m[1] : 'a reference to'
}

const sharedTokenScore = (a, b) => {
  const ta = tokenize(a)
  const tb = new Set(tokenize(b))
  if (!ta.length) return 0
  let hit = 0
  for (const w of ta) {
    if (tb.has(w) || tb.has(stem(w))) hit += 1
  }
  return hit / ta.length
}

const swapForbiddenWords = (text, forbidden) => {
  let out = text
  for (const w of [...forbidden].sort((a, b) => b.length - a.length)) {
    if (w.length < 4) continue
    const syn = SYNONYM[w]
    if (syn) out = out.replace(new RegExp(`\\b${escapeRe(w)}\\b`, 'gi'), syn)
  }
  return out.replace(/\s+/g, ' ').trim()
}

const paraphraseFromEvidence = (evidence, oldPrompt) => {
  const lead = extractPromptLead(oldPrompt)
  let clause = String(evidence || '').split(/\s*\/\s*/)[0].replace(/^["']+|["']+$/g, '').trim()
  const firstClause = clause.split(/[,;]|(?=\bbut\b|\bhowever\b)/i)[0].trim()

  for (const [re, rep] of EVIDENCE_CLAUSE_MAP) {
    if (re.test(firstClause) || re.test(clause)) {
      const body = rep.replace(/^(a|an)\s+/i, '')
      return `${lead} ${body}`
    }
  }

  const forbidden = new Set(tokenize(clause))
  let swapped = swapForbiddenWords(firstClause, forbidden)
  let words = tokenize(swapped).filter((w) => !forbidden.has(w) && !forbidden.has(stem(w)))
  let out = words.join(' ')
  if (out.length < 10) {
    out = tokenize(swapForbiddenWords(clause, forbidden))
      .filter((w) => !forbidden.has(w))
      .join(' ')
  }
  if (out.length < 8) return null
  return `${lead} ${out}`
}

const rewriteInformationPrompt = (prompt, evidence) => {
  const lead = extractPromptLead(prompt)
  let candidate = paraphraseFromEvidence(evidence, prompt)
  if (candidate && sharedTokenScore(candidate, evidence) < 0.38) return candidate

  const forbidden = new Set(tokenize(evidence))
  let body = swapForbiddenWords(
    tokenize(prompt.replace(new RegExp(`^${escapeRe(lead)}\\s*`, 'i'), '')).join(' ') || evidence,
    forbidden
  )
  body = tokenize(body)
    .filter((w) => !forbidden.has(w) && !forbidden.has(stem(w)))
    .map((w) => SYNONYM[w] || w)
    .join(' ')

  candidate = `${lead} ${body}`
  if (sharedTokenScore(candidate, evidence) >= 0.38) {
    candidate = paraphraseFromEvidence(evidence, prompt)
  }
  return candidate && candidate.length > lead.length + 8 ? candidate : null
}

const paraphraseFeatureStatement = (prompt, evidence) => {
  let s = String(prompt || '').trim()
  const forbidden = new Set(tokenize(evidence))
  for (const [re, rep] of EVIDENCE_CLAUSE_MAP) {
    if (re.test(evidence)) {
      const cap = rep.charAt(0).toUpperCase() + rep.slice(1)
      if (/^a |^an /.test(cap)) return cap.replace(/^(A|An) /, (m) => m.trim() + ' ')
      return cap
    }
  }
  let words = tokenize(s)
  words = words.map((w) => (forbidden.has(w) ? SYNONYM[w] || null : SYNONYM[w] || w)).filter(Boolean)
  s = words.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + (s.endsWith('.') ? '' : '.')
}

const paraphraseHeading = (heading, paragraph) => {
  const forbidden = new Set(tokenize(paragraph.slice(0, 400)))
  let words = tokenize(heading)
  words = words.map((w) => {
    if (forbidden.has(w) || forbidden.has(stem(w))) return SYNONYM[w] || null
    return SYNONYM[w] || w
  }).filter(Boolean)
  let out = words.join(' ')
  if (out.split(' ').length < 3) return null
  return out.charAt(0).toUpperCase() + out.slice(1)
}

const buildVocabulary = (prompt, evidence, answer) => {
  const before = tokenize(prompt).slice(-4).join(' ')
  const ev = tokenize(evidence).slice(0, 8).join(' ')
  return `${before} = ${ev}; answer signal = ${answer}`
}

const parseQuestions = (rawAnswerKey) => {
  const source = String(rawAnswerKey || '')
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map((m) =>
    String(m[1] || '').trim()
  )
  return segments.map((segment) => {
    const number = Number(segment.match(/^Question\s+(\d+):/i)?.[1] || 0)
    const prompt = String(
      segment.match(/^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im)?.[1] || ''
    ).trim()
    const correctAnswer = String(segment.match(/Correct Answer:\s*(.+)/i)?.[1] || '').trim()
    const exactPortion = String(
      segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)?.[1] || ''
    ).trim()
    return { number, prompt, correctAnswer, exactPortion, segment: segment.trim() }
  })
}

const rebuildSegment = (q, newPrompt, newVocab) => {
  let seg = q.segment.replace(
    /^Question \d+:\s*[\s\S]*?(?=\n\s*Correct Answer:)/im,
    `Question ${q.number}: ${newPrompt}`
  )
  if (newVocab) {
    seg = seg.replace(/Paraphrased Vocabulary:\s*[\s\S]*$/i, `Paraphrased Vocabulary: ${newVocab}`)
  }
  return seg
}

const updatePassagePromptLine = (text, qNum, newPrompt) => {
  const lineRe = new RegExp(`(^|\\n)\\s*${qNum}\\s+([^\\n]+)`, 'g')
  return text.replace(lineRe, (_, pre) => `${pre}\n${qNum} ${newPrompt}`)
}

const updateHeadingInPassage = (text, roman, newHeading) => {
  const re = new RegExp(`(^|\\n)(${roman})\\s+([^\\n]+)`, 'i')
  return text.replace(re, `$1$2 ${newHeading}`)
}

const parseHeadings = (sectionText) => {
  const block = sectionText.match(/List of Headings\s*([\s\S]*?)(?=\n\s*\d+\s+Section|\n\s*\d+\s+Paragraph|\nQuestions)/i)?.[1] || ''
  const headings = new Map()
  for (const line of block.split('\n')) {
    const m = line.trim().match(/^((?:i{1,3}|iv|v|vi{0,3}|ix|x))\s+(.+)$/i)
    if (m) headings.set(m[1].toLowerCase(), m[2].trim())
  }
  return headings
}

const parseParagraphs = (rawPassageText) => {
  const body = String(rawPassageText || '').split(/Questions\s+\d+/i)[0] || ''
  const paragraphs = new Map()
  for (const m of body.matchAll(/\n([A-Z])\n\n([\s\S]*?)(?=\n[A-Z]\n\n|\nQuestions|\s*$)/g)) {
    paragraphs.set(m[1], m[2].trim())
  }
  return paragraphs
}

const ROMAN = /^(?:i{1,3}|iv|v|vi{0,3}|ix|x)$/i
const DOTS = /[.．…⋯·•_\-–—]{2,}|…/

const detectSectionTypes = (sectionText) => ({
  information: /which (?:paragraph|section) contains/i.test(sectionText),
  headings: /choose the correct heading|list of headings/i.test(sectionText),
  features: /match each statement|match each person|list of (?:people|experts|features)/i.test(sectionText)
})

const classifyQuestion = (q, types) => {
  const answer = q.correctAnswer.trim()
  const prompt = q.prompt.trim()
  if (DOTS.test(prompt)) return null
  if (types.headings && /^(?:section|paragraph)\s+[A-Z]$/i.test(prompt) && ROMAN.test(answer)) {
    return 'matching-headings'
  }
  if (types.information && /^[A-G]$/i.test(answer) && !/^(?:section|paragraph)\s+[A-Z]$/i.test(prompt)) {
    return 'matching-information'
  }
  if (types.features && /^[A-G]$/i.test(answer) && !/^(?:section|paragraph)\s+[A-Z]$/i.test(prompt)) {
    return 'matching-features'
  }
  return null
}

const needsFix = (prompt, evidence, type, headingCtx) => {
  if (type === 'matching-headings' && headingCtx) {
    const { headingText, paraText } = headingCtx
    return sharedTokenScore(headingText, paraText.slice(0, 500)) >= 0.48
  }
  const pairs = String(prompt).includes('=') ? [] : []
  if (sharedTokenScore(prompt, evidence) >= 0.32) return true
  for (const w of tokenize(prompt)) {
    if (w.length >= 6 && normalize(evidence).includes(w)) return true
  }
  return false
}

let fixed = 0

const fixImportFile = (exam) => {
  let rawAnswerKey = exam.rawAnswerKey
  let rawPassageText = exam.rawPassageText
  const questions = parseQuestions(rawAnswerKey)
  const sectionText = rawPassageText.match(/Questions[\s\S]*$/i)?.[0] || ''
  const types = detectSectionTypes(sectionText)
  const headings = parseHeadings(sectionText)
  const paragraphs = parseParagraphs(rawPassageText)

  for (const q of questions) {
    const kind = classifyQuestion(q, types)
    if (!kind) continue

    const evidence = q.exactPortion.split(/\s*\/\s*/)[0].replace(/^["']+|["']+$/g, '').trim()
    let newPrompt = null

    if (kind === 'matching-headings') {
      const letter = q.prompt.match(/(?:section|paragraph)\s+([A-Z])/i)?.[1]
      const roman = q.correctAnswer.toLowerCase()
      const oldHeading = headings.get(roman) || ''
      const para = letter ? paragraphs.get(letter) || '' : ''
      if (!needsFix(q.prompt, evidence, kind, { headingText: oldHeading, paraText: para })) continue
      const newHeading = paraphraseHeading(oldHeading, para)
      if (newHeading && normalize(newHeading) !== normalize(oldHeading)) {
        rawPassageText = updateHeadingInPassage(rawPassageText, roman, newHeading)
        headings.set(roman, newHeading)
        fixed += 1
      }
      continue
    }

    if (!needsFix(q.prompt, evidence, kind)) continue

    if (kind === 'matching-information') {
      newPrompt = rewriteInformationPrompt(q.prompt, evidence)
    } else if (kind === 'matching-features') {
      newPrompt = paraphraseFeatureStatement(q.prompt, evidence)
    }

    if (!newPrompt || normalize(newPrompt) === normalize(q.prompt)) continue
    if (sharedTokenScore(newPrompt, evidence) >= 0.34) continue

    const vocab = buildVocabulary(newPrompt, evidence, q.correctAnswer)
    const newSegment = rebuildSegment(q, newPrompt, vocab)
    rawAnswerKey = rawAnswerKey.replace(
      new RegExp(`Question ${q.number}:[\\s\\S]*?(?=\\n\\nQuestion \\d+:|$)`),
      newSegment + '\n\n'
    )
    rawPassageText = updatePassagePromptLine(rawPassageText, q.number, newPrompt)
    fixed += 1
  }

  exam.rawAnswerKey = rawAnswerKey
  exam.rawPassageText = rawPassageText
}

for (let pass = 1; pass <= 4; pass += 1) {
  const before = fixed
  for (const file of fs.readdirSync(importsDir).filter((n) => n.startsWith('ielts-academic') && n.endsWith('.json'))) {
    const filePath = path.join(importsDir, file)
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    for (const exam of items) fixImportFile(exam)
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8')
  }
  console.log(`Pass ${pass}: ${fixed - before} updates`)
  if (fixed === before) break
}

// Fix June 2026 server file (manual high-quality patches for denial cases)
const junePath = path.join(root, 'server/userProvidedReadingPracticeJune2026.mjs')
let juneSrc = fs.readFileSync(junePath, 'utf8')

const junePatches = [
  [
    'Question 14: a reference to a denial of involvement in raiding',
    'Question 14: a reference to a ruler rejecting accusations of supporting the raiders',
    'Paraphrased Vocabulary: denial of involvement = denied any involvement',
    'Paraphrased Vocabulary: rejecting accusations = denied any involvement; supporting raiders = helped the raiders; answer signal = D'
  ],
  [
    '14 a reference to a denial of involvement in raiding',
    '14 a reference to a ruler rejecting accusations of supporting the raiders'
  ],
  [
    'Question 14: a reference to a denial of involvement in banditry',
    'Question 14: a reference to a ruler rejecting accusations of supporting the bandits',
    'Paraphrased Vocabulary: denial of involvement = denied any involvement',
    'Paraphrased Vocabulary: rejecting accusations = denied any involvement; supporting bandits = helped the bandits; answer signal = D'
  ],
  [
    '14 a reference to a denial of involvement in banditry',
    '14 a reference to a ruler rejecting accusations of supporting the bandits'
  ]
]

for (let i = 0; i < junePatches.length; i += 2) {
  if (juneSrc.includes(junePatches[i])) {
    juneSrc = juneSrc.replace(junePatches[i], junePatches[i + 1])
    fixed += 1
  }
}

fs.writeFileSync(junePath, juneSrc, 'utf8')

console.log(`Fixed ${fixed} matching prompts/headings.`)
console.log('Re-run: node scripts/audit-reading-matching-paraphrase-monthly.mjs')
