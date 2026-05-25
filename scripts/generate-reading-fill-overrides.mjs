/**
 * Generate fill-only section overrides for advanced reading exams.
 * Run: npx tsx scripts/generate-reading-fill-overrides.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  stripGarbledOcrFromReadingText,
  isGarbledOcrReadingLine
} from '../src/readingOcrCleanup.ts'
import { isReadingFillSectionBlock } from '../src/readingFillDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** Hand-curated fill blocks where OCR txt is too corrupted to auto-extract. */
const MANUAL_FILL_BLOCKS = {
  'cambridge-11-test1-passage3': `Questions 30-36
Complete the table below.
Choose ONE WORD from the passage for each answer.
Write your answers in boxes 30-36 on your answer sheet.
GEO-ENGINEERING PROJECTS
Procedure | Aim
put a large number of tiny spacecraft into orbit far above Earth | to create a 30 … that would reduce the amount of light reaching Earth
place 31 … in the sea | to encourage 32 … to form
release aerosol sprays into the stratosphere | to create a 33 … that would reduce the amount of light reaching Earth
fix strong 34 … to Greenland ice sheets | to prevent icebergs moving into the sea
plant trees in Russian Arctic that would lose their leaves in winter | to allow the 35 … to reflect radiation
change the direction of 36 … | to bring more cold water into ice-forming areas`,

  'cambridge-12-test3-passage3': `Questions 27-31
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 27-31 on your answer sheet.
The Montreal study
When people listen to music, their bodies show physiological signs of emotional arousal. Research showed that music triggered neurons to release a substance called 27 … . Parts of the brain associated with feeling 28 … were activated. Dopamine neurons in the area called the 29 … were most active before the participants' favourite moments. This period is known as the 30 … . These neurons anticipate 'reward' stimuli such as 31 … .`,

  'cambridge-12-test4-passage3': `Questions 38-40
Complete the sentences below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.
38 non-executive directors were at a disadvantage because of lack of 38 …
39 too much emphasis on 39 … considerations of short-term relevance
40 the board may have to accept the views of 40 …`,

  'cambridge-14-test1-passage3': `Questions 36-40
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 36-40 on your answer sheet.
Fun at work
Tews, Michel and Stafford carried out research on staff in an American chain of 36 … . They discovered that activities designed for staff to have fun improved their 37 … , and that management involvement led to lower staff 38 … . They also found that the activities needed to fit with both the company's 39 … and the 40 … of the staff. A balance was required between a degree of freedom and maintaining work standards.`,

  'cambridge-14-test2-passage3': `Questions 35-37
Complete the sentences below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 35-37 on your answer sheet.
35 Numerous training sessions are aimed at people who feel they are not 35 … enough.
36 Being organised appeals to people who regard themselves as 36 … .
37 Many people feel 37 … with aspects of their work.`,

  'cambridge-14-test3-passage3': `Questions 37-40
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 37-40 on your answer sheet.
Guided play
In the simplest form of guided play, an adult contributes to the environment in which the child is playing. Alternatively, an adult can play with a child and develop the play, for instance by 37 … the child to investigate different aspects of their game. Adults can help children to learn through play, and may make the activity rather structured, but it should still be based on the child's 38 … to play.
Play without the intervention of adults gives children real 39 … . With adults, play can be 40 … at particular goals. However, all forms of play should be an opportunity for children to have fun.`,

  'cambridge-14-test4-passage3': `Questions 34-39
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 34-39 on your answer sheet.
Findings related to marine debris
Studies of marine debris found the biggest threats were
• plastic (not metal or wood)
• bits of debris that were 34 … (harmful to animals)
There was little research into 35 … from synthetic fibres.
Drawbacks of the studies examined
• most of them focused on individual animals, not entire 36 …
• the 37 … of plastic used in the lab did not always reflect those in the ocean
• there was insufficient information on
  - numbers of animals which could be affected
  - the impact of a reduction in numbers on the 38 … of that species
  - the impact on the ecosystem
Rochman says more information is needed on the possible impact of future 39 … (e.g. involving oil).`,

  'cambridge-15-test1-passage3': `Questions 38-40
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.
The writer's own bias
The writer has experience of a large number of 38 … and was the first stranger that certain previously 39 … people had encountered. He believes there is no need for further exploration of Earth's 40 … , except to answer specific questions such as how buffalo eat.`
}

const normalizeDotBlanks = (text) =>
  String(text || '')
    .replace(/\.{4,}/g, ' … ')
    .replace(/\s+…\s+/g, ' … ')
    .replace(/(\d+)\s+…/g, '$1 …')

const normalizeTableLines = (text) =>
  stripGarbledOcrFromReadingText(text)
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed.includes('…') && !/complete the table/i.test(trimmed)) return trimmed
      if (/^put a large number of tiny spacecraft/i.test(trimmed) && !trimmed.includes('|')) {
        return trimmed.replace(
          /^(put a large number of tiny spacecraft into)\s+(to create)/i,
          '$1 orbit far above Earth | $2'
        )
      }
      if (/^place 31/i.test(trimmed) && !trimmed.includes('|')) {
        return 'place 31 … in the sea | to encourage 32 … to form'
      }
      if (/^release aerosol sprays/i.test(trimmed) && !trimmed.includes('|')) {
        return trimmed.replace(
          /^(release aerosol sprays into)\s+(the to create|to create)/i,
          'release aerosol sprays into the stratosphere | to create'
        )
      }
      if (/^fix strong 34/i.test(trimmed) && !trimmed.includes('|')) {
        return 'fix strong 34 … to Greenland ice sheets | to prevent icebergs moving into the sea'
      }
      if (/^plant trees in Russian Arctic/i.test(trimmed) && !trimmed.includes('|')) {
        return 'plant trees in Russian Arctic that would lose their leaves in winter | to allow the 35 … to reflect radiation'
      }
      if (/^change the direction of 36/i.test(trimmed) && !trimmed.includes('|')) {
        return 'change the direction of 36 … | to bring more cold water into ice-forming areas'
      }
      return trimmed
    })
    .join('\n')

const extractFillBlocksFromText = (text) => {
  const cleaned = normalizeDotBlanks(normalizeTableLines(text))
  const parts = cleaned.split(/\n(?=Questions \d+)/i).map((part) => part.trim()).filter(Boolean)
  return parts.filter((part) => isReadingFillSectionBlock(part)).join('\n\n')
}

const examIdToQuestionFile = (examId) => {
  const match = examId.match(/^cambridge-(\d+)-test(\d+)-passage3$/)
  if (!match) return null
  return path.join(root, 'scripts', `cambridge-${match[1]}-questions`, `t${match[2]}p3.txt`)
}

const loadAdvancedExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs
    .readdirSync(serverDir)
    .filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
  const exams = []
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        exams.push(...value.filter((exam) => exam?.category === 'advanced' && exam?.parsedPayload?.passages))
      }
    }
  }
  return exams
}

const needsFillOverride = (passage) => {
  const text = String(passage.questionSectionText || '')
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.some((line) => isGarbledOcrReadingLine(line))) return true
  const fillLineCount = lines.filter((line) => /…/.test(line) || /_{3,}/.test(line)).length
  if (fillLineCount >= 2) return false
  return (passage.questionRanges || []).some((range) => {
    const block = text
    return isReadingFillSectionBlock(block) && fillLineCount < 2
  })
}

const exams = await loadAdvancedExams()
const overrides = { ...MANUAL_FILL_BLOCKS }

for (const exam of exams) {
  if (overrides[exam.id]) continue

  const passage = exam.parsedPayload.passages[0]
  if (!needsFillOverride(passage)) continue

  const questionFile = examIdToQuestionFile(exam.id)
  let source = ''
  if (questionFile && fs.existsSync(questionFile)) {
    source = extractFillBlocksFromText(fs.readFileSync(questionFile, 'utf8'))
  } else {
    source = extractFillBlocksFromText(passage.questionSectionText || '')
  }

  if (source.trim()) overrides[exam.id] = source.trim()
}

const sortedKeys = Object.keys(overrides).sort()
const body = sortedKeys
  .map((key) => `  '${key}': \`${overrides[key].replace(/`/g, '\\`')}\`,`)
  .join('\n\n')

const output = `/**
 * Corrected fill-in-the-blank question blocks for advanced reading exams
 * where OCR corrupted or omitted the summary / sentence lines.
 * Values contain fill blocks only — not full question sections.
 * Updated by scripts/generate-reading-fill-overrides.mjs
 */
export const READING_FILL_SECTION_OVERRIDES: Record<string, string> = {
${body}
}
`

fs.writeFileSync(path.join(root, 'src/readingFillSectionFixes.ts'), output)
console.log(`Wrote ${sortedKeys.length} fill-only overrides`)
