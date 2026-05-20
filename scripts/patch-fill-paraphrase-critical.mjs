/**
 * Manual patches for corrupted / remaining critical fill questions.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')

const PATCHES = [
  {
    file: 'ielts-academic-reading-april-2026-passage-3-what-is-restoration.json',
    number: 39,
    prompt:
      'Responsible restoration should let viewers witness both .................... and careful treatment.',
    summaryFragment:
      'Responsible restoration should let viewers witness both 39.................... and careful treatment',
    paraphrase:
      'witness harm and care = see both injury and care; careful treatment = care; answer signal = injury'
  },
  {
    file: 'ielts-academic-reading-feb-2026-passage-3-myth-of-digital-native.json',
    number: 32,
    prompt: 'Modern devices function as a fully sealed .................... .',
    summaryFragment: 'Modern devices function as a fully sealed 32....................',
    paraphrase:
      'fully sealed = closed ecosystem; function as = operate as; answer signal = ecosystem'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-2-psychology-cancel-culture.json',
    number: 24,
    prompt:
      'Some observers conceal personal reservations yet openly back the view that appears .................... .',
    summaryFragment:
      'Some observers conceal personal reservations yet openly back the view that appears 24....................',
    paraphrase:
      'observers = people; conceal reservations = hide private doubts; openly back = publicly support; answer signal = safest'
  },
  {
    file: 'ielts-academic-reading-april-2024-passage-2-trauma-language-popular-culture.json',
    number: 21,
    prompt:
      'Such wording can lower feelings of .................... because distress is framed as something with causes and remedies.',
    paraphrase:
      'lower feelings = may reduce; framed as measurable = presents distress as something with causes; answer signal = shame'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-1-bald-eagle.json',
    number: 9,
    prompt: 'Later, legal curbs and .................... on the pesticide eased the threat.',
    paraphrase:
      'legal curbs = restrictions; pesticide = the chemical; eased the threat = reduced this pressure; answer signal = bans'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-1-habsburg-jaw.json',
    number: 10,
    prompt:
      'When closely related royals reproduced, recessive traits were more likely to come from both .................... .',
    paraphrase:
      'closely related royals = close relatives; reproduced = had children; both parents = both parents; answer signal = relatives'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-1-polar-bears.json',
    number: 11,
    prompt: 'Some settlements rely on patrols and controlled food .................... to limit bear clashes.',
    paraphrase:
      'settlements = towns; controlled food = secure food; limit bear clashes = reduce danger; answer signal = storage'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-1-polar-bears.json',
    number: 13,
    prompt:
      'Lasting safeguards depend on lowering greenhouse gases and preserving movement .................... across habitats that shift with the seasons.',
    paraphrase:
      'lasting safeguards = more durable protection; preserving movement = maintaining corridors; shifting habitats = seasonal habitats; answer = corridors'
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-1-primary-education-ai.json',
    number: 12,
    prompt: 'Schools need policies on privacy and .................... prior to classroom rollout of AI tools.',
    paraphrase:
      'policies = clear rules; privacy = data; classroom rollout = use such systems widely; answer = bias'
  },
  {
    file: 'ielts-academic-reading-feb-2026-passage-2-saving-the-vaquita.json',
    number: 24,
    prompt:
      'They also say that vaquita-safe equipment can catch fish and shrimp without producing much .................... .',
    paraphrase:
      'equipment = gear; without producing much = with far less; unwanted catch = bycatch; answer signal = bycatch'
  },
  {
    file: 'ielts-academic-reading-jan-2026-passage-2-medieval-castles.json',
    number: 22,
    prompt:
      'Weakened bases may cause ground ...................., a hazard that can eventually undermine walls and towers.',
    paraphrase:
      'weakened bases = undermined foundations; undermine walls = tilting walls and collapse; answer = subsidence'
  },
  {
    file: 'ielts-academic-reading-feb-2026-passage-3-wood-wide-web.json',
    number: 34,
    prompt: 'governed by fungal self-interest rather than plant .................... .',
    paraphrase:
      'plant trait = biological altruism; fungal self-interest = fungal self-interest; answer signal = altruism'
  },
  {
    file: 'ielts-academic-reading-jan-2026-passage-3-architecture-of-forgetting.json',
    number: 40,
    prompt: 'A sound mind separates irrelevant noise from the meaningful .................... .',
    paraphrase:
      'sound mind = healthy brain; separates noise from = filters the noise from the; meaningful cue = signal'
  }
]

const replaceQuestionPrompt = (rawAnswerKey, number, prompt, paraphrase) => {
  const re = new RegExp(
    `(Question ${number}:\\s*)([\\s\\S]*?)(?=\\n\\nQuestion \\d+:|$)`,
    'i'
  )
  return rawAnswerKey.replace(re, (block, head) => {
    const updated = block.replace(
      /^Question \d+:\s*[\s\S]*?(?=\n\s*Correct Answer:)/im,
      `Question ${number}: ${prompt}`
    )
    if (paraphrase) {
      return updated.replace(
        /Paraphrased Vocabulary:\s*[\s\S]*$/i,
        `Paraphrased Vocabulary: ${paraphrase}`
      )
    }
    return updated
  })
}

const updateSummaryGap = (rawPassageText, number, fragment) => {
  const re = new RegExp(`[^\\n]*${number}[.．…⋯·•_\\-–—]{2,}[^\\n]*`, 'g')
  if (re.test(rawPassageText)) {
    return rawPassageText.replace(re, fragment)
  }
  return rawPassageText
}

for (const patch of PATCHES) {
  const filePath = path.join(importsDir, patch.file)
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const exam = items[0]
  exam.rawAnswerKey = replaceQuestionPrompt(exam.rawAnswerKey, patch.number, patch.prompt, patch.paraphrase)
  if (patch.summaryFragment) {
    exam.rawPassageText = updateSummaryGap(exam.rawPassageText, patch.number, patch.summaryFragment)
  }
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8')
  console.log(`Patched ${patch.file} Q${patch.number}`)
}

console.log('Done.')
