export const meta = {
  name: 'passage3-vocab-bridge',
  description: 'Generate bilingual (EN to TH) vocab-bridge explanations for all Passage-3 Band-7 reading questions',
  phases: [{ title: 'Generate', detail: 'one agent per passage writes its bridges JSON' }]
}

const items = [
  {
    "slug": "cambridge-10-test-1-passage-3",
    "answerGroup": "Cambridge 10 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-10-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-10-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-10-test-2-passage-3",
    "answerGroup": "Cambridge 10 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-10-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-10-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-10-test-3-passage-3",
    "answerGroup": "Cambridge 10 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-10-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-10-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-10-test-4-passage-3",
    "answerGroup": "Cambridge 10 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-10-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-10-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-11-test-1-passage-3",
    "answerGroup": "Cambridge 11 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-11-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-11-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-11-test-2-passage-3",
    "answerGroup": "Cambridge 11 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-11-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-11-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-11-test-3-passage-3",
    "answerGroup": "Cambridge 11 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-11-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-11-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-11-test-4-passage-3",
    "answerGroup": "Cambridge 11 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-11-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-11-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-12-test-1-passage-3",
    "answerGroup": "Cambridge 12 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-12-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-12-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-12-test-2-passage-3",
    "answerGroup": "Cambridge 12 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-12-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-12-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-12-test-3-passage-3",
    "answerGroup": "Cambridge 12 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-12-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-12-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-12-test-4-passage-3",
    "answerGroup": "Cambridge 12 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-12-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-12-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-13-test-1-passage-3",
    "answerGroup": "Cambridge 13 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-13-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-13-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-13-test-2-passage-3",
    "answerGroup": "Cambridge 13 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-13-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-13-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-13-test-3-passage-3",
    "answerGroup": "Cambridge 13 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-13-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-13-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-13-test-4-passage-3",
    "answerGroup": "Cambridge 13 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-13-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-13-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-14-test-1-passage-3",
    "answerGroup": "Cambridge 14 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-14-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-14-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-14-test-2-passage-3",
    "answerGroup": "Cambridge 14 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-14-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-14-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-14-test-3-passage-3",
    "answerGroup": "Cambridge 14 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-14-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-14-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-14-test-4-passage-3",
    "answerGroup": "Cambridge 14 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-14-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-14-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-15-test-2-passage-3",
    "answerGroup": "Cambridge 15 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-15-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-15-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-15-test-3-passage-3",
    "answerGroup": "Cambridge 15 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-15-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-15-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-15-test-4-passage-3",
    "answerGroup": "Cambridge 15 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-15-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-15-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-16-test-1-passage-3",
    "answerGroup": "Cambridge 16 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-16-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-16-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-16-test-2-passage-3",
    "answerGroup": "Cambridge 16 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-16-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-16-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-16-test-3-passage-3",
    "answerGroup": "Cambridge 16 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-16-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-16-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-16-test-4-passage-3",
    "answerGroup": "Cambridge 16 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-16-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-16-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-17-test-1-passage-3",
    "answerGroup": "Cambridge 17 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-17-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-17-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-17-test-2-passage-3",
    "answerGroup": "Cambridge 17 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-17-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-17-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-17-test-3-passage-3",
    "answerGroup": "Cambridge 17 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-17-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-17-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-17-test-4-passage-3",
    "answerGroup": "Cambridge 17 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-17-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-17-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-18-test-1-passage-3",
    "answerGroup": "Cambridge 18 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-18-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-18-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-18-test-2-passage-3",
    "answerGroup": "Cambridge 18 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-18-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-18-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-18-test-3-passage-3",
    "answerGroup": "Cambridge 18 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-18-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-18-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-18-test-4-passage-3",
    "answerGroup": "Cambridge 18 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-18-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-18-test-4-passage-3.json"
  },
  {
    "slug": "cambridge-19-test-1-passage-3",
    "answerGroup": "Cambridge 19 Test 1 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-19-test-1-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-19-test-1-passage-3.json"
  },
  {
    "slug": "cambridge-19-test-2-passage-3",
    "answerGroup": "Cambridge 19 Test 2 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-19-test-2-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-19-test-2-passage-3.json"
  },
  {
    "slug": "cambridge-19-test-3-passage-3",
    "answerGroup": "Cambridge 19 Test 3 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-19-test-3-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-19-test-3-passage-3.json"
  },
  {
    "slug": "cambridge-19-test-4-passage-3",
    "answerGroup": "Cambridge 19 Test 4 Passage 3",
    "count": 14,
    "inPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-extract/cambridge-19-test-4-passage-3.json",
    "outPath": "/Users/natchanon/IELTS SPEAKING/scripts/.passage3-bridges/cambridge-19-test-4-passage-3.json"
  }
]

const SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'answerGroup', 'questionNumbers', 'written'],
  properties: {
    slug: { type: 'string' },
    answerGroup: { type: 'string' },
    questionNumbers: { type: 'array', items: { type: 'number' } },
    written: { type: 'boolean' },
    notes: { type: 'string' }
  }
}

const prompt = (it) => `You are an expert IELTS Reading coach who writes bilingual (English + Thai) study notes for THAI learners.

TASK: Read the JSON file at:
${it.inPath}

It contains one IELTS Reading Passage-3 ("${it.answerGroup}") with its passage paragraphs and a list of questions. Each question has: number, prompt, correctAnswer, exactPortion (the proof sentence from the passage), answerType.

For EVERY question, produce a "vocab bridge" that teaches the VOCABULARY / SYNONYM / PARAPHRASE link the question tests. This is the whole point of Passage-3 Band-7 questions: the question wording is a paraphrase of the passage wording, and the learner must recognise the synonym.

For each question create an object with this exact shape:
{
  "questionPhrase": { "en": "<short key phrase from the QUESTION/stem or correct option, paraphrased target, <= 9 words>", "th": "<natural Thai meaning>" },
  "passagePhrase":  { "en": "<short key phrase from the exactPortion that PROVES the answer, <= 12 words>", "th": "<natural Thai meaning>" },
  "keyVocab": {
    "word": "<the single most important English word/short phrase the question hinges on>",
    "th": "<Thai meaning of that word>",
    "contrastA": "<optional 'englishWord . thaiGloss' ONLY when answer turns on an opposition>",
    "contrastB": "<optional other side of the pair>",
    "note": "<one short Thai sentence: why this vocab link leads to the correct answer, mention the answer>"
  }
}

RULES (quality matters, shown to paying learners):
- Thai must be natural and correct, not literal word-by-word. Write the MEANING.
- English phrases must be clean real phrases from the text. NO "blank", NO ellipsis, NO OCR garbage, no disconnected single keywords.
- questionPhrase = what the QUESTION says; passagePhrase = what the PASSAGE says; they must be genuine paraphrases of each other.
- Include contrastA/contrastB ONLY when there is a real opposition (like 'engineer . wisawakon' VS 'artist . sinlapin'). For most questions OMIT both.
- keyVocab.note must reference why the correct answer follows.
- Matching/who-said-what: questionPhrase = the statement matched; passagePhrase = the quote that matches; keyVocab = the linking word.
- Fill-blank/summary: questionPhrase = summary wording around blank; passagePhrase = source sentence; keyVocab.word = the answer word + Thai meaning.

OUTPUT:
1) Write a JSON file to EXACTLY this path using the Write tool:
${it.outPath}
   shape: { "answerGroup": "${it.answerGroup}", "bridges": { "<questionNumber>": { ...bridge... } } }
   Include an entry for EVERY question number. Valid JSON only (double quotes, no trailing commas, no comments).
2) Return the summary object (slug=${it.slug}, answerGroup, questionNumbers = every number written, written=true).`

phase('Generate')

const results = await parallel(
  items.map((it) => () =>
    agent(prompt(it), { label: it.slug, phase: 'Generate', agentType: 'claude', schema: SUMMARY_SCHEMA })
  )
)

const ok = results.filter(Boolean)
const failed = items.filter((it) => !ok.find((r) => r && r.slug === it.slug)).map((it) => it.slug)
const totalQ = ok.reduce((s, r) => s + (r.questionNumbers ? r.questionNumbers.length : 0), 0)
log(`Generated ${ok.length}/${items.length} passages, ${totalQ} questions. Failed: ${failed.length ? failed.join(', ') : 'none'}`)
return { passages: ok.length, totalQuestions: totalQ, failed, summaries: ok }
