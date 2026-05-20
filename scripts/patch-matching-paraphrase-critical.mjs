/**
 * Manual patches for remaining critical matching paraphrase issues.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')

const PATCHES = [
  {
    file: 'ielts-academic-reading-april-2024-passage-2-trauma-language-popular-culture.json',
    replacements: [
      [
        'Dr Morris argues that web-based networks can validate sufferers yet circulate oversimplified accounts',
        'Dr Morris argues that web-based networks can validate sufferers yet circulate reductive explanations'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-2-delayed-adulthood.json',
    replacements: [
      [
        'rules on child-care availability and time off shaping choices about having children',
        'how access to affordable nursery care and statutory leave shapes timing of parenthood'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-2-psychology-cancel-culture.json',
    replacements: [
      [
        'suggestion that lengthier processes may produce fairer and more proportionate outcomes',
        'suggestion that lengthier processes may yield fairer and more balanced results'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-2-social-media-algorithms-polarization.json',
    replacements: [
      [
        'an example of two groups receiving different interpretations of the same event',
        'an example of two audiences being shown contrasting readings of one incident'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-3-what-is-restoration.json',
    replacements: [
      [
        'The writer describes painted letters in a railway station in order to show that',
        'The writer describes lettering uncovered at a railway station in order to show that'
      ],
      [
        'Question 34: Specialist defines restoration mainly through natural processes rather appearance.',
        'Question 34: One specialist defines restoration chiefly through ecological recovery rather than surface looks'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-feb-2026-passage-2-adhd-innate-or-upbringing.json',
    replacements: [
      [
        'A move away from explanations based only on parenting is a good idea.',
        'Shifting focus beyond upbringing alone as the cause is presented as worthwhile'
      ],
      [
        'Research on boys in school is fuller than research on women diagnosed later in life',
        'Clinical knowledge of the condition in male pupils exceeds that for females identified in adulthood'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-feb-2026-passage-2-saving-the-vaquita.json',
    replacements: [
      [
        'a reference to which human activity now poses the most immediate danger',
        'a reference to which type of fishing now poses the most immediate danger'
      ]
    ]
  },
  {
    file: 'ielts-academic-reading-jan-2026-passage-3-productive-power-of-boredom.json',
    replacements: [
      [
        'a reference to experiment demonstrating activities enhance thinking',
        'a reference to a study in which a dull copying task later improved idea generation'
      ]
    ]
  }
]

for (const { file, replacements } of PATCHES) {
  const filePath = path.join(importsDir, file)
  let text = fs.readFileSync(filePath, 'utf8')
  for (const [from, to] of replacements) {
    text = text.split(from).join(to)
  }
  fs.writeFileSync(filePath, text, 'utf8')
  console.log('Patched', file)
}

// June 2026 server — denial cases (replace_all)
const junePath = path.join(root, 'server/userProvidedReadingPracticeJune2026.mjs')
let june = fs.readFileSync(junePath, 'utf8')

june = june.replaceAll(
  'a reference to a denial of involvement in raiding',
  'a reference to a ruler rejecting accusations of supporting the raiders'
)
june = june.replaceAll(
  'a reference to a denial of involvement in banditry',
  'a reference to a ruler rejecting accusations of supporting the bandits'
)
june = june.replaceAll(
  'Question 14: a reference to a denial of involvement in raiding',
  'Question 14: a reference to a ruler rejecting accusations of supporting the raiders'
)
june = june.replaceAll(
  'Question 14: a reference to a denial of involvement in banditry',
  'Question 14: a reference to a ruler rejecting accusations of supporting the bandits'
)
june = june.replaceAll(
  'Paraphrased Vocabulary: denial of involvement = denied any involvement',
  'Paraphrased Vocabulary: rejecting accusations = denied any involvement; supporting raiders = helped the raiders; answer signal = D'
)

june = june.replaceAll(
  'a reference to how people today commonly imagine ancient trade routes',
  'a reference to modern stereotypes of how East–West commerce is pictured'
)
june = june.replaceAll(
  'Question 17: a reference to how people today commonly imagine ancient trade routes',
  'Question 17: a reference to modern stereotypes of how East–West commerce is pictured'
)

june = june.replaceAll(
  'an explanation of how some raiders were encouraged not to return to raiding',
  'an explanation of how former attackers were persuaded to settle as farmers instead'
)
june = june.replaceAll(
  'an explanation of how some bandits were encouraged not to return to banditry',
  'an explanation of how former attackers were persuaded to settle as farmers instead'
)
june = june.replaceAll(
  'Question 18: an explanation of how some raiders were encouraged not to return to raiding',
  'Question 18: an explanation of how former attackers were persuaded to settle as farmers instead'
)
june = june.replaceAll(
  'Question 18: an explanation of how some bandits were encouraged not to return to banditry',
  'Question 18: an explanation of how former attackers were persuaded to settle as farmers instead'
)

june = june.replaceAll(
  'a mention of the need for many caravans to use a limited number of mountain routes',
  'a mention of why traders had to follow only a few paths through the mountains'
)

fs.writeFileSync(junePath, june, 'utf8')
console.log('Patched June 2026 server file')
