// One-off (Nov 2026): TRUE/FALSE/NOT GIVEN statements in the Cambridge banks were imported
// with only the first PDF line ("Stepwells had", "California has replaced" …), so students saw
// half a sentence in the exam. Restore the full statement everywhere it is quoted.
// Full wording comes from the same test's question block / answer key / the ด่าน layouts.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const server = join(dirname(fileURLToPath(import.meta.url)), '..', 'server')
const FIXES = [
  ['Cambridge10', 'Stepwells had', 'Stepwells had a range of functions, in addition to those related to water collection.'],
  ['Cambridge10', 'The number of steps above the water level in', 'The number of steps above the water level in a stepwell depends on the depth of the water.'],
  ['Cambridge10', 'California has replaced', 'California has replaced older fire-fighting tools with helicopter-style machines for putting out fires.'],
  ['Cambridge11', 'The construction of the Falkirk Wheel site took into account the presence of', 'The construction of the Falkirk Wheel site took into account the presence of a nearby ancient monument.'],
  ['Cambridge11', 'Audiences are likely to be surprised if', 'Audiences are likely to be surprised if a film lacks background music.'],
  ['Cambridge11', 'Background music may anticipate', 'Background music may anticipate a development in a film.'],
  ['Cambridge12', 'Label the diagram (Questions 20-26): write ONE WORD ONLY from the passage for question 11', 'Nowadays, most glass is produced by large international manufacturers.'],
  ['Cambridge13', 'According to research, 26% of visitor satisfaction is related to their', 'According to research, 26% of visitor satisfaction is related to their accommodation.'],
  ['Cambridge13', 'Coconuts found on the west coast of', 'Coconuts found on the west coast of America were a different type from those found on the east coast.'],
  ['Cambridge13', 'John Willis wanted Cutty Sark to be the fastest tea clipper travelling between the UK', 'John Willis wanted Cutty Sark to be the fastest tea clipper travelling between the UK and China.'],
  ['Cambridge13', 'Steam ships sometimes used the ocean route to travel between London', 'Steam ships sometimes used the ocean route to travel between London and China.'],
  ['Cambridge15', 'Moore became aware of ancient sculpture as', 'Moore became aware of ancient sculpture as a result of visiting London museums.'],
  ['Cambridge15', "The Trocadero Museum's Mayan sculpture attracted", "The Trocadero Museum's Mayan sculpture attracted a lot of public interest."],
  ['Cambridge15', 'Farmer Alberto Benevides is now making', 'Farmer Alberto Benevides is now making a good profit from growing huarangos.'],
  ['Cambridge15', "For Whaley's project to succeed, it needs to be extended over", "For Whaley's project to succeed, it needs to be extended over a very large area."],
  ['Cambridge15', 'Whaley has plans to go to Africa to set up', 'Whaley has plans to go to Africa to set up a similar project.'],
  ['Cambridge16', 'Most geoglyphs in England are located in', 'Most geoglyphs in England are located in a particular area of the country.'],
  ['Cambridge16', 'There are more geoglyphs in the shape of', 'There are more geoglyphs in the shape of a horse than any other creature.'],
  ['Cambridge16', 'Efforts to control dengue fever have been surprisingly successful', 'Efforts to control dengue fever have been surprisingly successful.'],
  ['Cambridge16', 'Students participating in the job prospects experiment could', 'Students participating in the job prospects experiment could choose one of two perspectives to take.'],
  ['Cambridge16', 'Participants in the couples experiment were aware that they were taking part in a', 'Participants in the couples experiment were aware that they were taking part in a study about wise reasoning.'],
  ['Cambridge16', 'In both experiments, the participants who looked at the situation from a more', 'In both experiments, the participants who looked at the situation from a more detached viewpoint tended to make wiser decisions.'],
  ['Cambridge16', "Grossmann believes that a person's wisdom is determined by their intelligence to", "Grossmann believes that a person's wisdom is determined by their intelligence to only a very limited extent."],
  ['Cambridge16', 'Only experienced builders were employed to construct', 'Only experienced builders were employed to construct a tunnel using the counter-excavation method.'],
  ['Cambridge16', 'The information about', 'The information about a problem that occurred during the construction of the Saldae aqueduct system was found in an ancient book.'],
  ['Cambridge16', 'Rejection of the possibilities of AI may have a negative effect on many people’s', 'Rejection of the possibilities of AI may have a negative effect on many people’s lives.'],
  ['Cambridge18', 'Objects discovered at Stonehenge seem to indicate that it was constructed by', 'Objects discovered at Stonehenge seem to indicate that it was constructed by a number of different groups of people.'],
  ['Cambridge18', 'The Vygotsky model of education supports the concept of', 'The Vygotsky model of education supports the concept of a mixed-ability class.'],
  ['Cambridge19', "'Phenology' is a term used to describe a creature's", "'Phenology' is a term used to describe a creature's ability to alter the location of a lifecycle event."],
  ['Cambridge19', 'There is a clear reason for the', 'There is a clear reason for the adaptations that butterflies are making to climate change.']
]
// OCR junk glued onto otherwise complete statements.
const JUNK = [
  ['Cambridge14', 'Google was inspired to adopt flexibility by the success of General Electric.\\n\\nss ie', 'Google was inspired to adopt flexibility by the success of General Electric.'],
  ['Cambridge14', 'Scholars may discuss theories without fully understanding each other. MEL BO)DU; BoA AIKYINANGICHINMXAG Nas ore of ot = 664 Ed', 'Scholars may discuss theories without fully understanding each other.']
]

// JSON-escape the way the .mjs data files store strings (double quotes; ’ stays literal).
const esc = (value) => JSON.stringify(value).slice(1, -1)
let total = 0
for (const [book, cut, full] of FIXES) {
  const file = join(server, `userProvidedReadingPractice${book}.mjs`)
  let src = readFileSync(file, 'utf8')
  const needle = esc(cut)
  const before = src
  // Only where the cut-off text ENDS a string, a quoted fragment, or a line — never inside the full sentence.
  for (const ending of ['"', '\\"', '\\n']) {
    src = src.split(needle + ending).join(esc(full) + ending)
  }
  // Answer-key paraphrase lines: "<cut> = <passage> = ANSWER"
  src = src.split(`${needle} = `).join(`${esc(full)} = `)
  const changed = before.length !== src.length || before !== src
  if (!changed) console.error(`NOT FOUND: ${book} | ${cut}`)
  else total += 1
  writeFileSync(file, src)
}
for (const [book, junk, clean] of JUNK) {
  const file = join(server, `userProvidedReadingPractice${book}.mjs`)
  const src = readFileSync(file, 'utf8')
  const needle = esc(junk).replace(/\\\\n/g, '\\n')
  if (!src.includes(needle)) { console.error(`JUNK NOT FOUND: ${book} | ${junk.slice(0, 40)}`); continue }
  writeFileSync(file, src.split(needle).join(esc(clean)))
  total += 1
}
console.error(`fixed ${total} statements`)
