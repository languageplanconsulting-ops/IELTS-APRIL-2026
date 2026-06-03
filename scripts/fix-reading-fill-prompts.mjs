#!/usr/bin/env node
/**
 * Surgical fixes for broken Normal-Reading fill-in-blank prompts.
 *
 * Each entry maps (examId, questionNumber) to a clean replacement prompt.
 * Replacements come from:
 *   - Adding missing terminal punctuation when the prompt is otherwise
 *     a complete IELTS-style sentence
 *   - Reconstructing wording for prompts that were OCR-truncated, based
 *     on the surrounding question group + the correct answer
 *   - Removing OCR garbage ("..u....00 …008000")
 *
 * Source files get a .bak-fillprompt-<timestamp> backup before edits.
 *
 * Run: node scripts/fix-reading-fill-prompts.mjs
 *      node scripts/fix-reading-fill-prompts.mjs --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')

const FIXES = [
  // ─── Cambridge 11 ───────────────────────────────────────────────────────
  {
    examId: 'cambridge-11-test1-passage1', qn: 5,
    from: 'The fact that vertical farms would need … … light is',
    to: 'The fact that vertical farms would need … … light is a disadvantage.'
  },
  // Cambridge 11 Test 3 Passage 1 — silk note-completion (just add periods)
  { examId: 'cambridge-11-test3-passage1', qn: 2, from: 'emperor’s wife invented a … … to pull out silk fibres', to: 'emperor’s wife invented a … … to pull out silk fibres.' },
  { examId: 'cambridge-11-test3-passage1', qn: 3, from: 'Only … … were allowed to produce silk', to: 'Only … … were allowed to produce silk.' },
  { examId: 'cambridge-11-test3-passage1', qn: 4, from: 'Only … … were allowed to wear silk', to: 'Only … … were allowed to wear silk.' },
  { examId: 'cambridge-11-test3-passage1', qn: 6, from: 'e.g. evidence found of … … made from silk around 168 AD', to: 'e.g. evidence found of … … made from silk around 168 AD.' },
  { examId: 'cambridge-11-test3-passage1', qn: 7, from: 'Merchants use Silk Road to take silk westward and bring back … … and precious metals', to: 'Merchants use Silk Road to take silk westward and bring back … … and precious metals.' },
  { examId: 'cambridge-11-test3-passage1', qn: 8, from: '550 AD: … … hide silkworm eggs in canes and take them to Constantinople', to: '550 AD: … … hide silkworm eggs in canes and take them to Constantinople.' },
  { examId: 'cambridge-11-test3-passage1', qn: 9, from: '20th century: … … and other manmade fibres cause decline in silk production', to: '20th century: … … and other manmade fibres cause decline in silk production.' },
  // C11T3P3 — sentence completion fragments
  {
    examId: 'cambridge-11-test3-passage3', qn: 37,
    from: 'The writer intends to show that mathematics requires ...................... thinking, as well as',
    to: 'The writer intends to show that mathematics requires …………………… thinking, as well as routine calculations.'
  },
  {
    examId: 'cambridge-11-test3-passage3', qn: 39,
    from: 'The writer advises non-mathematical readers to perform ...................... while reading',
    to: 'The writer advises non-mathematical readers to perform …………………… while reading.'
  },

  // ─── Cambridge 14 ───────────────────────────────────────────────────────
  { examId: 'cambridge-14-test1-passage1', qn: 2, from: 'board games involve … … and turn-taking', to: 'board games involve … … and turn-taking.' },
  { examId: 'cambridge-14-test1-passage1', qn: 3, from: 'population of … … have grown', to: 'population of … … have grown.' },
  { examId: 'cambridge-14-test1-passage1', qn: 6, from: 'increased … … in schools', to: 'increased … … in schools.' },
  { examId: 'cambridge-14-test1-passage1', qn: 7, from: 'it is difficult to find … … to support new policies', to: 'it is difficult to find … … to support new policies.' },
  { examId: 'cambridge-14-test2-passage1', qn: 10, from: 'people bought Henderson’s photos because photography took up considerable time and the … … was heavy', to: 'people bought Henderson’s photos because photography took up considerable time and the … … was heavy.' },
  { examId: 'cambridge-14-test2-passage1', qn: 11, from: 'the photographs Henderson sold were … … or souvenirs', to: 'the photographs Henderson sold were … … or souvenirs.' },
  { examId: 'cambridge-14-test2-passage1', qn: 13, from: 'worked for CPR in 1885 and photographed the … … and the railway at Rogers Pass', to: 'worked for CPR in 1885 and photographed the … … and the railway at Rogers Pass.' },
  {
    examId: 'cambridge-14-test2-passage3', qn: 37,
    from: 'Many people feel ..u....00 …008000 … With aspects. of their work.',
    to: 'Many people feel … … with aspects of their work.'
  },
  { examId: 'cambridge-14-test4-passage1', qn: 3, from: 'their ability to locate … … using', to: 'their ability to locate … … using a particular sense.' },
  { examId: 'cambridge-14-test4-passage1', qn: 4, from: 'the effect that … … had on them', to: 'the effect that … … had on them.' },
  {
    examId: 'cambridge-14-test4-passage1', qn: 5,
    from: 'how … … . They attacked prey',
    to: 'how … … they attacked prey.'
  },
  { examId: 'cambridge-14-test4-passage1', qn: 6, from: 'comparison between age and the … … of dying cells in the brains of ants', to: 'comparison between age and the … … of dying cells in the brains of ants.' },
  { examId: 'cambridge-14-test4-passage1', qn: 8, from: 'level of two … … in the brain associated with ageing', to: 'level of two … … in the brain associated with ageing.' },

  // ─── Cambridge 15 ───────────────────────────────────────────────────────
  { examId: 'cambridge-15-test1-passage1', qn: 1, from: 'the leaves of the tree are … … in shape', to: 'the leaves of the tree are … … in shape.' },
  { examId: 'cambridge-15-test1-passage1', qn: 2, from: 'the … … surrounds the fruit and breaks open when the fruit is ripe', to: 'the … … surrounds the fruit and breaks open when the fruit is ripe.' },
  { examId: 'cambridge-15-test1-passage1', qn: 3, from: 'the … … is used to produce the spice nutmeg', to: 'the … … is used to produce the spice nutmeg.' },
  { examId: 'cambridge-15-test3-passage1', qn: 9, from: 'Moore turns to drawing because … … for sculpting are not readily available', to: 'Moore turns to drawing because … … for sculpting are not readily available.' },
  { examId: 'cambridge-15-test3-passage1', qn: 12, from: '… … start to buy Moore’s work', to: '… … start to buy Moore’s work.' },
  { examId: 'cambridge-15-test3-passage1', qn: 13, from: 'Moore’s increased … … makes it possible for him to do more ambitious sculptures', to: 'Moore’s increased … … makes it possible for him to do more ambitious sculptures.' },
  { examId: 'cambridge-15-test4-passage1', qn: 1, from: 'can access … … deep below the surface', to: 'can access … … deep below the surface.' },
  { examId: 'cambridge-15-test4-passage1', qn: 4, from: 'prevents … … of the soil', to: 'prevents … … of the soil.' },
  {
    examId: 'cambridge-15-test4-passage2', qn: 22,
    from: '… … is changed with',
    to: '… … is changed with the seasons.'
  },

  // ─── Cambridge 16 ───────────────────────────────────────────────────────
  // C16T1P2 — summary completion (compound prompts caused by paragraph merge)
  {
    examId: 'cambridge-16-test1-passage2', qn: 21,
    from: 'as big as an Egyptian 21 ………………… of the past. The area outside the pyramid',
    to: 'as big as an Egyptian 21 ………………… of the past.'
  },
  {
    examId: 'cambridge-16-test1-passage2', qn: 22,
    from: 'included accommodation that was occupied by 22 …………………, along with',
    to: 'included accommodation that was occupied by 22 …………………, along with other structures.'
  },
  {
    examId: 'cambridge-16-test1-passage2', qn: 23,
    from: 'built into this. In addition, a long 23 ………………… encircled the wall. As a result,',
    to: 'In addition, a long 23 ………………… encircled the wall.'
  },
  { examId: 'cambridge-16-test2-passage1', qn: 10, from: 'first reference to White Horse Hill appears in … … from the 1070s', to: 'first reference to White Horse Hill appears in … … from the 1070s.' },
  { examId: 'cambridge-16-test2-passage1', qn: 11, from: 'according to analysis of the surrounding … … , the Horse is Late Bronze Age / Early Iron Age', to: 'according to analysis of the surrounding … …, the Horse is Late Bronze Age / Early Iron Age.' },
  {
    examId: 'cambridge-16-test3-passage3', qn: 38,
    from: 'Daffodils are likely to flower early in reSPONSE tO .....rnmnsninmnnnnnnnnnnnnnnnne Weather,',
    to: 'Daffodils are likely to flower early in response to …………………… weather.'
  },
  {
    examId: 'cambridge-16-test3-passage3', qn: 39,
    from: 'If ash trees come into leaf before oak trees, the Weather IN .....ecssssusnnennneananatananane',
    to: 'If ash trees come into leaf before oak trees, the weather in …………………… will be wet.'
  },
  {
    examId: 'cambridge-16-test3-passage3', qn: 40,
    from: 'The research was carried out using a particular SPECIES OF ....ecmmennenneneanennannnnnnnne +',
    to: 'The research was carried out using a particular species of ……………………'
  },

  // ─── Cambridge 17 ───────────────────────────────────────────────────────
  { examId: 'cambridge-17-test1-passage1', qn: 1, from: 'The 1 …………………… of London increased rapidly between 1800 and 1850', to: 'The 1 …………………… of London increased rapidly between 1800 and 1850.' },
  { examId: 'cambridge-17-test1-passage1', qn: 3, from: 'A number of 3 …………………… agreed with Pearson\'s idea', to: 'A number of 3 …………………… agreed with Pearson\'s idea.' },
  { examId: 'cambridge-17-test1-passage1', qn: 4, from: 'The company initially had problems getting the 4 …………………… needed for the project', to: 'The company initially had problems getting the 4 …………………… needed for the project.' },
  {
    examId: 'cambridge-17-test1-passage2', qn: 19,
    from: 'Complete the summary — 19 …………………… Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where 20 …………………… is',
    to: 'The arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where 19 …………………… is performed.'
  },
  {
    examId: 'cambridge-17-test1-passage2', qn: 21,
    from: 'Complete the summary — 21 …………………… It is now a market square with 22 …………………… and homes incorporated into the remains of the Roman amphitheatre',
    to: 'It is now a market square with 21 …………………… and homes incorporated into the remains of the Roman amphitheatre.'
  },
  {
    examId: 'cambridge-17-test1-passage3', qn: 28,
    from: 'Scots, he abandoned an important 28 . ........................ that was held by his father',
    to: 'he abandoned an important 28 …………………… that was held by his father.'
  },
  {
    examId: 'cambridge-17-test2-passage1', qn: 3,
    from: 'Complete the summary — 3 …………………… The scrolls • date from between 150 BCE and 70 CE • thought to have been written by group of people known as the 4 …………',
    to: 'The scrolls were stored in 3 …………………… jars. They date from between 150 BCE and 70 CE and are thought to have been written by a group of people.'
  },
  { examId: 'cambridge-17-test3-passage1', qn: 5, from: 'reduction in … … and available sources of food were partly responsible for decline in Tasmania', to: 'reduction in … … and available sources of food were partly responsible for decline in Tasmania.' },
  {
    examId: 'cambridge-17-test4-passage1', qn: 9,
    from: 'the bats – were most active in rice fields located on hills – ate pests of rice, … … , sugarcane, nuts and fruit – prevent the spread of disease by eating … … and blackflies local attitudes to bats are mixed:',
    to: 'the bats ate pests of rice, … …, sugarcane, nuts and fruit.'
  },
  { examId: 'cambridge-17-test4-passage1', qn: 13, from: 'farmers should provide special … … to support the bat population', to: 'farmers should provide special … … to support the bat population.' },
  { examId: 'cambridge-17-test4-passage2', qn: 22, from: 'Cases like this illustrate how the guilds could prevent ___ and stop skilled people from working', to: 'Cases like this illustrate how the guilds could prevent ___ and stop skilled people from working.' }
]

// ───────────────────────────────────────────────────────────────────────────

const examIdToFile = {
  'cambridge-11': 'server/userProvidedReadingPracticeCambridge11.mjs',
  'cambridge-12': 'server/userProvidedReadingPracticeCambridge12.mjs',
  'cambridge-13': 'server/userProvidedReadingPracticeCambridge13.mjs',
  'cambridge-14': 'server/userProvidedReadingPracticeCambridge14.mjs',
  'cambridge-15': 'server/userProvidedReadingPracticeCambridge15.mjs',
  'cambridge-16': 'server/userProvidedReadingPracticeCambridge16.mjs',
  'cambridge-17': 'server/userProvidedReadingPracticeCambridge17.mjs',
  'cambridge-19': 'server/userProvidedReadingPracticeCambridge19.mjs',
  'june-2026': 'server/userProvidedReadingPracticeJune2026.mjs'
}

const findFile = (examId) => {
  const prefix = Object.keys(examIdToFile).find((k) => examId.startsWith(k))
  return prefix ? examIdToFile[prefix] : null
}

// Group by file
const byFile = new Map()
for (const fix of FIXES) {
  const file = findFile(fix.examId)
  if (!file) {
    console.warn(`No source file for ${fix.examId}`)
    continue
  }
  const list = byFile.get(file) || []
  list.push(fix)
  byFile.set(file, list)
}

let applied = 0
let skipped = 0
const skipReasons = []

for (const [file, list] of byFile) {
  const abs = path.join(process.cwd(), file)
  if (!fs.existsSync(abs)) {
    console.warn(`Missing: ${file}`)
    skipped += list.length
    continue
  }
  let content = fs.readFileSync(abs, 'utf8')
  const original = content

  for (const fix of list) {
    // Encode the prompt strings the way they appear in JSON inside the .mjs
    const fromJson = JSON.stringify(fix.from).slice(1, -1)
    const toJson = JSON.stringify(fix.to).slice(1, -1)
    const occurrences = content.split(fromJson).length - 1
    if (occurrences === 0) {
      // Maybe the prompt already got fixed by a previous run, or whitespace
      // differs. Skip with a clear log.
      skipped += 1
      skipReasons.push(`${fix.examId} Q${fix.qn} — prompt not found (already fixed?)`)
      continue
    }
    if (occurrences > 8) {
      // Up to 4 copies are normal (rawAnswerKey, rawPassageText, parsedPayload
      // prompt, questionSectionText). >8 means the substring is too generic.
      skipped += 1
      skipReasons.push(`${fix.examId} Q${fix.qn} — prompt matches ${occurrences}× (likely too generic)`)
      continue
    }
    content = content.split(fromJson).join(toJson)
    applied += 1
  }

  if (content !== original && !DRY_RUN) {
    const backupPath = `${abs}.bak-fillprompt-${Date.now()}`
    fs.writeFileSync(backupPath, original, 'utf8')
    fs.writeFileSync(abs, content, 'utf8')
    console.log(`✓ ${file} — backup ${path.basename(backupPath)}`)
  } else if (content !== original) {
    console.log(`✓ ${file} — would update (DRY RUN)`)
  } else {
    console.log(`- ${file} — no changes`)
  }
}

console.log('')
console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Applied ===')
console.log(`Total fixes considered: ${FIXES.length}`)
console.log(`Applied: ${applied}`)
console.log(`Skipped: ${skipped}`)
if (skipReasons.length) {
  console.log('')
  console.log('Skip reasons:')
  for (const r of skipReasons.slice(0, 30)) console.log(`  - ${r}`)
}
