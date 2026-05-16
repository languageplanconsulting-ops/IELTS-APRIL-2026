/**
 * Clean PDF-extracted Cambridge 17 passage and question text files.
 * Run: node scripts/postprocess-cambridge-17.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const passDir = path.join(__dirname, 'cambridge-17-passages')
const quesDir = path.join(__dirname, 'cambridge-17-questions')

const cleanNoise = (text) =>
  String(text || '')
    .replace(/\r/g, '')
    .replace(/BS, HHSRERARRER[^\n]*\n?/gi, '')
    .replace(/BE, HHSRERDAADR[^\n]*\n?/gi, '')
    .replace(/BS, HSUBRORABSR[^\n]*\n?/gi, '')
    .replace(/\d+\s*\|\s*O p\.[^\n]*\n?/gi, '')
    .replace(/-\s*\d+\s*\|\s*p\.[^\n]*\n?/gi, '')
    .replace(/»\s*\|\s*p\.[^\n]*\n?/gi, '')
    .replace(/moou»[^\n]*\n?/gi, '')
    .replace(/\bttt(he|his|the)\b/gi, '$1')
    .replace(/ttt(he|his|the)/gi, '$1')
    .replace(/W\s*['']?ila\s*\d+[^\n]*Test\s+\d+\s*$/gim, '')
    .replace(/PIA\s*\d+\s*\d*/gi, '')
    .replace(/['']?tla\s*\d+[^\n]*/gi, '')
    .replace(/['']?ila\s*\d+[^\n]*/gi, '')
    .replace(/\bcoU»|oou»|moou»/gi, '')
    .replace(/Charles Spencer 5\b/g, "Charles Spencer's")
    .replace(/Spencer 5\b/g, "Spencer's")
    .replace(/\bCharles H\b/g, 'Charles II')
    .replace(/\s+o adopt\b/g, ' to adopt')
    .replace(/\bIttook\b/g, 'It took')
    .replace(/\bItdemands\b/g, 'It demands')
    .replace(/\bIttook\b/g, 'It took')
    .replace(/\bWhatare\b/g, 'What are')
    .replace(/\bInthe\b/g, 'In the')
    .replace(/\bTheyare\b/g, 'They are')
    .replace(/\bItoverlooks\b/g, 'It overlooks')
    .replace(/\bItlacks\b/g, 'It lacks')
    .replace(/\bItomits\b/g, 'It omits')
    .replace(/\bareference\b/g, 'a reference')
    .replace(/\baclaim\b/g, 'a claim')
    .replace(/\bIn\s+the\b/g, 'In the')
    .replace(/\|\s*O p\.[^\n]*/g, '')
    .replace(/>\/@ p\.\d+[^\n]*/g, '')
    .replace(/^\s*\d{1,2}\s*1718867188\s*$/gm, '')
    .replace(/^\s*\d{1,2}\s*$/gm, '')
    .replace(/^[©•e]\s*$/gm, '')
    .replace(/O p\. \d+\s*$/gm, '')
    .replace(/(?<![a-z])he growing/gi, 'the growing')
    .replace(/(?<![a-z])he Central/gi, 'the Central')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const normalizeDashes = (text) =>
  String(text || '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[—–]/g, '-')

const fixQuestionOcr = (text) =>
  normalizeDashes(text)
    .replace(/\b(\d+)\s*\|\.\.\./g, '$1 …')
    .replace(/\.\s*cee\./gi, ' …')
    .replace(/\b1 popular solution\b/g, 'I popular solution')
    .replace(/\bItdemands\b/g, 'It demands')
    .replace(/\bIttook\b/g, 'It took')
    .replace(/\bA\s+todescribe\b/g, 'A to describe')
    .replace(/\bD\s+toargue\b/g, 'D to argue')
    .replace(/\bD\s+tocompare\b/g, 'D to compare')
    .replace(/\s+\. -s\.is\s+/g, ' … ')
    .replace(/TINGS:\s*o\s*-/gi, ' … ')

const trimQuestions = (text) => {
  const cut = text.search(/\n(?:WRITING|LISTENING|AUDIOSCRIPTS)\b/i)
  const trimmed = cut >= 0 ? text.slice(0, cut) : text
  const cutPassage = trimmed.search(/\n\s*READING PASSAGE\s+\d+\s*$/im)
  const trimmed2 = cutPassage >= 0 ? trimmed.slice(0, cutPassage) : trimmed
  const cut2 = trimmed2.search(/\nTest \d+\s*\n\s*READING PASSAGE/i)
  return normalizeDashes(cut2 >= 0 ? trimmed2.slice(0, cut2) : trimmed2).trim()
}

const stripInlineQuestions = (text) =>
  String(text || '')
    .replace(/\s+Questions\s+\d+[\s\S]*$/i, '')
    .trim()

const formatPassageBody = (raw) => {
  const lines = stripInlineQuestions(cleanNoise(raw)).split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return ''
  const title = lines[0]
  const rest = lines.slice(1)
  const paragraphs = []
  let buffer = []
  let letterMode = false

  const flush = () => {
    if (!buffer.length) return
    const joined = buffer.join(' ').replace(/\s+/g, ' ').trim()
    if (joined) paragraphs.push(joined)
    buffer = []
  }

  for (const line of rest) {
    if (/^[A-H]$/.test(line)) {
      flush()
      letterMode = true
      buffer.push(line)
      continue
    }
    if (letterMode && buffer.length && /^[A-H]$/.test(buffer[buffer.length - 1])) {
      buffer.push(line)
      continue
    }
    if (/^Questions?\s+\d+/i.test(line)) break
    buffer.push(line)
  }
  flush()

  let body =
    paragraphs.length === 0
      ? rest.join('\n\n')
      : paragraphs.join('\n\n')

  body = cleanNoise(
    body
      .replace(/\n([A-H])\s+([A-Z"'(])/g, '\n\n$1\n\n$2')
      .replace(/\*([A-Za-z]+):/g, '\n\n*$1:')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )

  return [title, body].filter(Boolean).join('\n\n')
}

const fixT1p1Questions = () => {
  const q = `Questions 1–6

Complete the notes below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 1–6 on your answer sheet.

The London underground railway

The problem
• The 1 …………………… of London increased rapidly between 1800 and 1850
• The streets were full of horse-drawn vehicles

The proposed solution
• Charles Pearson, a solicitor, suggested building an underground railway
• Building the railway would make it possible to move people to better housing in the 2 ……………………
• A number of 3 …………………… agreed with Pearson's idea
• The company initially had problems getting the 4 …………………… needed for the project
• Negative articles about the project appeared in the 5 ……………………

The construction
• The chosen route did not require many buildings to be pulled down
• The 'cut and cover' method was used to construct the tunnels
• With the completion of the brick arch, the tunnel was covered with 6 ……………………

Questions 7–13

Do the following statements agree with the information given in Reading Passage 1?

In boxes 7–13 on your answer sheet, write

TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

7 Other countries had built underground railways before the Metropolitan line opened.
8 More people than predicted travelled on the Metropolitan line on the first day.
9 The use of ventilation shafts failed to prevent pollution in the tunnels.
10 A different approach from the 'cut and cover' technique was required in London's central area.
11 The windows on City & South London trains were at eye level.
12 The City & South London Railway was a financial success.
13 Trains on the 'Tuppenny Tube' nearly always ran on time.`
  fs.writeFileSync(path.join(quesDir, 't1p1.txt'), q, 'utf8')
}

const fixT4p1Questions = () => {
  const q = `Questions 1–6

Do the following statements agree with the information given in Reading Passage 1?

In boxes 1–6 on your answer sheet, write

TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

1 Many Madagascan forests are being destroyed by attacks from insects.
2 Loss of habitat has badly affected insectivorous bats in Madagascar.
3 Ricardo Rocha has carried out studies of bats in different parts of the world.
4 Habitat modification has resulted in indigenous bats in Madagascar becoming useful to farmers.
5 The Malagasy mouse-eared bat is more common than other indigenous bat species in Madagascar.
6 Bats may feed on paddy swarming caterpillars and grass webworms.

Questions 7–13

Complete the table below.

Choose ONE WORD ONLY from the passage for each answer.

Write your answers in boxes 7–13 on your answer sheet.

The study carried out by Rocha's team
• DNA analysis of bat 7 ……………………
• ate pests of rice, 8 ……………………, sugarcane, nuts and fruit
• prevent the spread of disease by eating 9 …………………… and blackflies
• they provide food rich in 10 ……………………
• the buildings where they roost become 11 ……………………
• associated with sacred caves and the 12 ……………………
• farmers should provide special 13 …………………… to support the bat population`
  fs.writeFileSync(path.join(quesDir, 't4p1.txt'), q, 'utf8')
}

for (const file of fs.readdirSync(passDir).filter((f) => f.endsWith('.txt'))) {
  const raw = fs.readFileSync(path.join(passDir, file), 'utf8')
  fs.writeFileSync(path.join(passDir, file), formatPassageBody(raw), 'utf8')
}

for (const file of fs.readdirSync(quesDir).filter((f) => f.endsWith('.txt'))) {
  const raw = fs.readFileSync(path.join(quesDir, file), 'utf8')
  const cleaned = fixQuestionOcr(trimQuestions(cleanNoise(raw)))
  fs.writeFileSync(path.join(quesDir, file), cleaned.replace(/\nTest \d+\s*$/i, '').trim(), 'utf8')
}

const fixT1p2Questions = () => {
  const q = `Questions 14-17
Reading Passage 2 has seven sections, A-G.
Which section contains the following information?
Write the correct letter, A-G, in boxes 14-17 on your answer sheet.
NB You may use any letter more than once.

14 a mention of negative attitudes towards stadium building projects
15 figures demonstrating the environmental benefits of a certain stadium
16 examples of the wide range of facilities available at some new stadiums
17 reference to the disadvantages of the stadiums built during a certain era

Questions 18-22
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 18-22 on your answer sheet.

Roman amphitheatres
The Roman stadiums of Europe have proved very versatile. The amphitheatre of Arles, for example, was converted first into a 18 ……………………, then into a residential area and finally into an arena where spectators could watch 19 …………………… Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where 20 …………………… is performed. The site of Lucca's amphitheatre has also been used for many purposes over the centuries, including the storage of 21 …………………… It is now a market square with 22 …………………… and homes incorporated into the remains of the Roman amphitheatre.

Questions 23 and 24
Choose TWO letters, A-E.
Write the correct letters in boxes 23 and 24 on your answer sheet.

When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?
A They are less imaginatively designed.
B They are less spacious.
C They are in less convenient locations.
D They are less versatile.
E They are made of less durable materials.

Questions 25 and 26
Choose TWO letters, A-E.
Write the correct letters in boxes 25 and 26 on your answer sheet.

Which TWO advantages of modern stadium design does the writer mention?
A offering improved amenities for the enjoyment of sports events
B bringing community life back into the city environment
C facilitating research into solar and wind energy solutions
D enabling local residents to reduce their consumption of electricity
E providing a suitable site for the installation of renewable power generators`
  fs.writeFileSync(path.join(quesDir, 't1p2.txt'), q, 'utf8')
}

const fixT2p1Questions = () => {
  const q = `Questions 1-5
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-5 on your answer sheet.

The Dead Sea Scrolls
Discovery
• Qumran, 1946/7
• three Bedouin shepherds in their teens were near an opening on side of cliff
• heard a noise of breaking when one teenager threw a 1 ……………………
• teenagers went into the 2 …………………… and found a number of containers made of 3 ……………………

The scrolls
• date from between 150 BCE and 70 CE
• thought to have been written by group of people known as the 4 ……………………
• written mainly in the 5 …………………… language
• most are on religious topics, written using ink on parchment or papyrus

Questions 6-13
Do the following statements agree with the information given in Reading Passage 1?
In boxes 6-13 on your answer sheet, write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

6 The Bedouin teenagers who found the scrolls were disappointed by how little money they received for them.
7 There is agreement among academics about the origin of the Dead Sea Scrolls.
8 Most of the books of the Bible written on the scrolls are incomplete.
9 The information on the Copper Scroll is written in an unusual way.
10 Mar Samuel was given some of the scrolls as a gift.
11 In the early 1950s, a number of educational establishments in the US were keen to buy scrolls from Mar Samuel.
12 The scroll that was pieced together in 2017 contains information about annual occasions in the Qumran area 2,000 years ago.
13 Academics at the University of Haifa are currently researching how to decipher the final scroll.`
  fs.writeFileSync(path.join(quesDir, 't2p1.txt'), q, 'utf8')
}

const fixT4p3Questions = () => {
  const q = `Questions 27-32
Reading Passage 3 has eight paragraphs, A-H.
Which paragraph contains the following information?
Write the correct letter, A-H, in boxes 27-32 on your answer sheet.
NB You may use any letter more than once.

27 a reference to earlier examples of blindfold chess
28 an outline of what blindfold chess involves
29 a claim that Gareyev's skill is limited to chess
30 why Gareyev's skill is of interest to scientists
31 an outline of Gareyev's priorities
32 a reason why the last part of a game may be difficult

Questions 33-36
Do the following statements agree with the information given in Reading Passage 3?
In boxes 33-36 on your answer sheet, write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information about this

33 In the forthcoming games, all the participants will be blindfolded.
34 Gareyev has won competitions in BASE jumping.
35 UCLA is the first university to carry out research into blindfold chess players.
36 Good chess players are likely to be able to play blindfold chess.

Questions 37-40
Complete the summary below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 37-40 on your answer sheet.

How the research was carried out
The researchers started by testing Gareyev's 37 ……………………; for example, he was required to recall a string of 38 …………………… in order and also in reverse order. Although his performance was normal, scans showed an unusual amount of 39 …………………… within the areas of Gareyev's brain that are concerned with directing attention. In addition, the scans raised the possibility of unusual strength in the parts of his brain that deal with 40 …………………… input.`
  fs.writeFileSync(path.join(quesDir, 't4p3.txt'), q, 'utf8')
}

const fixT3p1Questions = () => {
  const q = `Questions 1-5
Complete the notes below.
Choose ONE WORD ONLY from the passage for each answer.
Write your answers in boxes 1-5 on your answer sheet.

The thylacine
Appearance and behaviour
• looked rather like a dog
• had a series of stripes along its body and tail
• ate an entirely 1 …………………… diet
• probably depended mainly on 2 …………………… when hunting
• young spent first months of life inside its mother's 3 ……………………

Decline and extinction
• last evidence in mainland Australia is a 3,100-year-old 4 ……………………
• probably went extinct in mainland Australia due to animals known as dingoes
• reduction in 5 …………………… and available sources of food were partly responsible for decline in Tasmania

Questions 6-13
Do the following statements agree with the information given in Reading Passage 1?
In boxes 6-13 on your answer sheet, write
TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

6 Significant numbers of thylacines were killed by humans from the 1830s onwards.
7 Several thylacines were born in zoos during the late 1800s.
8 John Gould's prediction about the thylacine surprised some biologists.
9 In the early 1900s, many scientists became worried about the possible extinction of the thylacine.
10 T.T. Flynn's proposal to rehome captive thylacines on an island proved to be impractical.
11 There were still reasonable numbers of thylacines in existence when a piece of legislation protecting the species during their breeding season was passed.
12 From 1930 to 1936, the only known living thylacines were all in captivity.
13 Attempts to find living thylacines are now rarely made.`
  fs.writeFileSync(path.join(quesDir, 't3p1.txt'), q, 'utf8')
}

const fixT3p3Questions = () => {
  const q = `Questions 27-31
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-31 on your answer sheet.

27 What point does Shester make about Barr's book in the first paragraph?
A It gives a highly original explanation for urban development.
B Elements of Barr's research papers are incorporated throughout the book.
C Other books that are available on the subject have taken a different approach.
D It covers a range of factors that affected the development of New York.

28 How does Shester respond to the information in the book about tenements?
A She describes the reasons for Barr's interest.
B She indicates a potential problem with Barr's analysis.
C She compares Barr's conclusion with that of other writers.
D She provides details about the sources Barr used for his research.

29 What does Shester say about chapter six of the book?
A It contains conflicting data.
B It focuses too much on possible trends.
C It is too specialised for most readers.
D It draws on research that is out of date.

30 What does Shester suggest about the chapters focusing on the 1920s building boom?
A The information should have been organised differently.
B More facts are needed about the way construction was financed.
C The explanation that is given for the building boom is unlikely.
D Some parts will have limited appeal to certain people.

31 What impresses Shester the most about the chapter on land values?
A the broad time period that is covered
B the interesting questions that Barr asks
C the nature of the research into the topic
D the recommendations Barr makes for the future

Questions 32-35
Do the following statements agree with the claims of the writer in Reading Passage 3?
In boxes 32-35 on your answer sheet, write
YES if the statement agrees with the claims of the writer
NO if the statement contradicts the claims of the writer
NOT GIVEN if it is impossible to say what the writer thinks about this

32 The description in the first chapter of how New York probably looked from the air in the early 1600s lacks interest.
33 Chapters two and three prepare the reader well for material yet to come.
34 The biggest problem for many nineteenth-century New York immigrant neighbourhoods was a lack of amenities.
35 In the nineteenth century, New York's immigrant neighbourhoods tended to concentrate around the harbour.

Questions 36-40
Complete the summary using the list of phrases, A-J, below.
Write the correct letter, A-J, in boxes 36-40 on your answer sheet.

The bedrock myth
In chapter seven, Barr indicates how the lack of bedrock close to the surface does not explain why skyscrapers are absent from 36 …………………… He points out that although the cost of foundations increases when bedrock is deep below the surface, this cannot be regarded as 37 ……………………, especially when compared to the cost of foundations in Chicago. A particularly enjoyable part of the chapter was Barr's account of how foundations are built. He describes not only how 38 …………………… are made possible by the use of caissons, but he also discusses their 39 …………………… The chapter is well researched but relatively easy to understand.

A development plans
B deep excavations
C great distance
D excessive expense
E impossible tasks
F associated risks
G water level
H specific areas
I total expenditure
J construction guidelines`
  fs.writeFileSync(path.join(quesDir, 't3p3.txt'), q, 'utf8')
}

const fixT1p3Questions = () => {
  const q = fs.readFileSync(path.join(quesDir, 't1p3.txt'), 'utf8')
  const mc = `Questions 36-40
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 36-40 on your answer sheet.

36 What is the reviewer's main purpose in the first paragraph?
A to describe what happened during the Battle of Worcester
B to give an account of the circumstances leading to Charles II's escape
C to provide details of the Parliamentarians' political views
D to compare Charles II's beliefs with those of his father

37 Why does the reviewer include examples of the fugitives' behaviour in the third paragraph?
A to explain how close Charles II came to losing his life
B to suggest that Charles II's supporters were badly prepared
C to illustrate how the events of the six weeks are brought to life
D to argue that certain aspects are not as well known as they should be

38 What point does the reviewer make about Charles II in the fourth paragraph?
A He chose to celebrate what was essentially a defeat.
B He misunderstood the motives of his opponents.
C He aimed to restore people's faith in the monarchy.
D He was driven by a desire to be popular.

39 What does the reviewer say about Charles Spencer in the fifth paragraph?
A His decision to write the book comes as a surprise.
B He takes an unbiased approach to the subject matter.
C His descriptions of events would be better if they included more detail.
D He chooses language that is suitable for a twenty-first-century audience.

40 When the reviewer says the book 'doesn't quite hit the mark', she is making the point that
A it overlooks the impact of events on ordinary people.
B it lacks an analysis of prevalent views on monarchy.
C it omits any references to the deceit practised by Charles II during his time in hiding.
D it fails to address whether Charles II's experiences had a lasting influence on him.`
  const head = q.split(/Questions 36-40/i)[0].trim()
  fs.writeFileSync(path.join(quesDir, 't1p3.txt'), `${head}\n\n${mc}\n`, 'utf8')
}

fixT1p1Questions()
fixT1p2Questions()
fixT2p1Questions()
fixT4p1Questions()
fixT4p3Questions()
fixT3p1Questions()
fixT3p3Questions()
fixT1p3Questions()

console.log('Post-processed Cambridge 17 passage and question files.')
