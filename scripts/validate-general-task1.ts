import assert from 'node:assert/strict'
import {
  GENERAL_TASK1_INFORMAL_PROMPTS,
  assembleGeneralTask1ModelLetter,
  type GeneralTask1SentencePattern
} from '../src/writingGeneralTask1Data'

const countIeltsWords = (text: string): number =>
  text
    .trim()
    .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0

const FORMAL_CONNECTORS = /\b(?:therefore|furthermore|moreover|consequently|nevertheless|hence)\b/i
const EXPANDED_AUXILIARIES =
  /\b(?:I am|I would|I will|I cannot|I could not|I do not|I did not|I was not|you are|you would|you will|you cannot|you could not|you do not|you did not|you were not|we are|we would|we will|we cannot|we could not|we do not|we did not|we were not|it is|it would|it will|it cannot|it could not|it does not|it did not|it was not)\b/i

const stripTransition = (text: string, transition: string): string => {
  assert.ok(text.startsWith(transition), `Sentence must start with its transition “${transition}”.`)
  return text.slice(transition.length).trim()
}

const detectPatterns = (core: string): GeneralTask1SentencePattern[] => {
  const matches: GeneralTask1SentencePattern[] = []

  if (/^[^.!?]+,\s+[a-z]+ing\b[^.!?]*[.!?]$/i.test(core)) {
    matches.push('sv-gerund')
  }
  if (
    /^[^.!?]+,\s+which\s+(?![a-z]+ing\b)[a-z]+(?:n['’]t|['’]s)?\b[^.!?]*[.!?]$/i.test(
      core
    )
  ) {
    matches.push('sv-which')
  }
  if (
    /^[^.!?]+,\s+(?:and|but|so|so that)\s+(?:I|you|we|he|she|it|they|[A-Z][a-z]+)\b[^.!?]+[.!?]$/.test(
      core
    )
  ) {
    matches.push('coordinating')
  }
  if (
    /^(?!Because\b|When\b|While\b|Although\b)[^.!?]+\b(?:because|when|while|although)\b[^.!?]+[.!?]$/i.test(
      core
    )
  ) {
    matches.push('subordinator-middle')
  }
  if (/^(?:Because|When|While|Although)\b[^.!?]+,\s+[^.!?]+[.!?]$/.test(core)) {
    matches.push('subordinator-front')
  }

  return matches
}

assert.equal(GENERAL_TASK1_INFORMAL_PROMPTS.length, 4, 'There must be exactly four informal prompts.')

const results: Array<{ title: string; words: number }> = []

for (const [promptIndex, prompt] of GENERAL_TASK1_INFORMAL_PROMPTS.entries()) {
  const context = prompt.id

  assert.equal(prompt.number, promptIndex + 1, `${context} must have a sequential number.`)
  assert.equal(prompt.register, 'informal', `${context} must use the informal register.`)
  assert.equal(prompt.taskInstruction, 'You should spend about 20 minutes on this task.')
  assert.equal(prompt.recipient, 'friend')
  assert.equal(prompt.letterInstruction, 'Write a letter to your friend. In your letter:')
  assert.equal(prompt.minimumWordsInstruction, 'Write at least 150 words.')
  assert.equal(prompt.addressInstruction, 'You do NOT need to write any addresses.')
  assert.equal(prompt.beginInstruction, `Begin your letter as follows: ${prompt.greeting}`)
  assert.equal(prompt.bullets.length, 3, `${context} must have exactly three bullets.`)
  assert.equal(prompt.paragraphs.length, 3, `${context} must have exactly three body paragraphs.`)
  assert.deepEqual(
    prompt.paragraphs.map((paragraph) => paragraph.bulletIndex),
    [0, 1, 2],
    `${context} paragraphs must map exactly to bullets 0, 1 and 2.`
  )

  const letter = assembleGeneralTask1ModelLetter(prompt)
  const bodyParagraphs = letter.split(/\n\n/).slice(1, -1)
  assert.equal(bodyParagraphs.length, 3, `${context} assembled letter must have exactly three body paragraphs.`)

  const words = countIeltsWords(letter)
  assert.ok(words >= 160 && words <= 180, `${context} has ${words} words; expected 160–180.`)

  const contractions = letter.match(/\b[\p{L}]+['’][\p{L}]+\b/gu) ?? []
  assert.ok(contractions.length >= 6, `${context} has ${contractions.length} contractions; expected at least 6.`)
  assert.doesNotMatch(letter, FORMAL_CONNECTORS, `${context} contains a blacklisted formal connector.`)
  assert.doesNotMatch(letter, EXPANDED_AUXILIARIES, `${context} contains an auxiliary that should be contracted.`)

  for (const paragraph of prompt.paragraphs) {
    const transitions = new Set<string>()
    assert.ok(paragraph.label.trim(), `${context} bullet ${paragraph.bulletIndex} needs a label.`)
    assert.ok(paragraph.sentences.length > 0, `${context} bullet ${paragraph.bulletIndex} needs sentences.`)

    for (const sentence of paragraph.sentences) {
      assert.ok(
        !transitions.has(sentence.transition),
        `${context} bullet ${paragraph.bulletIndex} repeats “${sentence.transition}”.`
      )
      transitions.add(sentence.transition)

      const core = stripTransition(sentence.text, sentence.transition)
      const detected = detectPatterns(core)
      assert.deepEqual(
        detected,
        [sentence.pattern],
        `${context} sentence has declared pattern “${sentence.pattern}” but detected ${detected.join(', ') || 'none'}: ${sentence.text}`
      )
    }
  }

  results.push({ title: prompt.title, words })
}

console.log('General Training Task 1 validation passed (manual bullet-content review noted).')
for (const result of results) {
  console.log(`- ${result.title}: ${result.words} words`)
}
