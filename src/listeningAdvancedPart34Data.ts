import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'

const URBAN_FARMING_PART3_SCRIPT = `MARK: Hi Lily, how are you getting on with the research for our urban farming presentation?
LILY: Good, Mark. I've looked at the seed varieties, which was surprisingly easy to organize.
MARK: I know. I thought getting the building owners to let us onto the roofs would be the nightmare, but they were actually quite accommodating. For me, the real struggle has been tracking down accurate statistics on how much food these rooftop gardens actually produce year over year.
LILY: Absolutely, I've had the exact same issue. The numbers are all over the place.
MARK: Did you read that journal article on hydroponics I sent over?
LILY: I did. I knew it was going to be expensive to set up, so the financial breakdown didn't shock me. What caught me off guard was that the author argued hydroponics actually uses more water than traditional soil in summer months. It completely goes against what we assumed at the start.
MARK: We also need to decide which sources to include in the literature review. I collected some newspaper pieces about rooftop farms, but most of them were just personal success stories.
LILY: Yes, they were interesting, but too anecdotal for an academic presentation. We need peer-reviewed figures, not just enthusiastic interviews.
MARK: Our supervisor also said our first draft was too descriptive. She wanted us to show comparisons more clearly.
LILY: Right, so instead of adding more background, let's put in a comparison chart for the main systems. That will make the argument easier to follow.
MARK: And for the conclusion, should we recommend one best method?
LILY: I don't think so. The evidence doesn't point to a single perfect solution. We should say every method has trade-offs depending on budget, space, and maintenance.
MARK: So, we need to evaluate the different growing methods for the final slide. Let's start with vertical soil walls.
LILY: They look amazing, don't they? Very striking visually.
MARK: True, they definitely make a building look better, but they are incredibly costly to maintain.
LILY: Let's focus on how they look. That's their main selling point for architects.
MARK: Fair enough. What about aeroponics, spraying the roots with mist?
LILY: The crop turnover is incredibly fast. You get maximum output for minimal space.
MARK: I agree. It's definitely the most productive system.
LILY: Aquaponics next, using fish waste to fertilize the plants.
MARK: I think it's fascinating, but honestly, do we know enough about the long-term bacterial risks in a city environment?
LILY: Probably not. We need more studies before recommending it.
MARK: Traditional container gardening is less exciting, but it's simple enough for people who are just starting out.
LILY: Exactly. Beginners can understand it without specialist equipment.
MARK: Finally, smart greenhouses. The sensors and automated lighting are impressive.
LILY: They are, but the price is far beyond what most community projects could afford.
MARK: So we should mark them as too expensive, even if the technology is clever.`

const GINKGO_PART4_SCRIPT = `Today, I want to examine the evolution and biology of the ginkgo tree, a plant often described as a living fossil. Fossil records show that trees almost identical to the modern ginkgo were growing more than two hundred million years ago. One reason the species survived several major extinction events is its remarkable resistance to disease. While many ancient plant groups disappeared, the ginkgo remained unusually robust.

For a long time, botanists believed the tree had vanished from the wild and survived only through cultivation. That view changed when small wild populations were identified in a monastery in China, where the trees had been protected for centuries.

The ginkgo has several distinctive biological adaptations. Its leaves have a unique fan shape, and in autumn they turn a bright yellow colour before falling. The tree is also able to survive in environments with poor soil, which helps explain why it can grow in difficult urban sites. Another defence is chemical. Ginkgo leaves contain a compound that discourages insects from eating them, so the tree suffers relatively little leaf damage.

In modern cities, the ginkgo is frequently planted along streets because it tolerates high levels of pollution. However, there is one major disadvantage. Female trees produce fruit, and when this fruit falls to the ground it releases a foul smell. For that reason, urban planners now plant male trees almost exclusively, especially in areas where cleanliness is important.

Finally, the ginkgo has medical and economic uses. Extracts from its leaves are widely sold in traditional medicine and are commonly claimed to improve memory. The nuts are also edible when prepared correctly, and in East Asian cooking they are often added to a traditional soup served on special occasions.`

const REPAIR_CAFES_PART3_SCRIPT = `MAYA: Hi Leo. Did you manage to read the article on repair cafés that I sent you?
LEO: Yes, I did. I thought it would be quite a narrow topic at first, just people fixing old toasters and lamps, but there's actually a lot more to it.
MAYA: Exactly. I think it could work well for our sustainability presentation.
LEO: One thing that really stood out to me was the amount of electrical equipment that gets thrown away even when only one small part is broken.
MAYA: Yes, and that's probably the strongest argument for repair cafés. They stop so many items ending up as waste.
LEO: I agree. The article also suggested that repair cafés could create employment, but I'm not convinced. Most of the people involved are volunteers.
MAYA: Right. I wouldn't make jobs our main point. What I found more convincing was the way visitors learn what's actually wrong with their things. They don't just hand something over and wait.
LEO: True. People pick up basic repair skills, and that might make them more confident about fixing things next time.
MAYA: Some campaigners say repair cafés could replace recycling centres, but I think that's unrealistic.
LEO: Definitely. Recycling still has a role, especially when something really can't be repaired.
MAYA: And I don't think repair cafés make new products cheaper either. They might reduce demand a little, but that's different.
LEO: Agreed.
MAYA: What about the difficulties these cafés face?
LEO: Well, the article mentioned insurance, but the organiser they interviewed said the community centre's policy already covered most events.
MAYA: So that's not the biggest barrier.
LEO: No. The real issue seems to be finding enough people with the right skills. The same volunteers keep being asked to help, and some of them are getting tired.
MAYA: Yes, and the other problem is spare parts. Sometimes the repair is simple, but the exact part is impossible to get, or it costs more than the item is worth.
LEO: I thought safety would be the main issue, especially with electrical goods.
MAYA: I wondered that too, but the cafés usually check items first and refuse anything dangerous, so it's manageable.
LEO: The article also said older people are actually some of the most regular visitors, so attracting them isn't a problem.
MAYA: That surprised me. I'd assumed younger people would be more interested.
LEO: We need to discuss possible ways to develop repair cafés. What did you think about tool-lending libraries?
MAYA: They're a good idea, but they don't feel new. Lots of towns already have them, where people can borrow drills or sewing machines instead of buying them.
LEO: True. What about mobile repair vans?
MAYA: I like those more. They could visit villages or housing estates where people don't have transport.
LEO: So they'd reach people who are excluded from the normal repair café model.
MAYA: Exactly.
LEO: The article was very enthusiastic about online booking systems, but I'm not sure.
MAYA: Me neither. People may book a slot and then not come, or they might describe the problem badly online.
LEO: So the results could be disappointing.
MAYA: Yes.
LEO: I liked the idea of repair lessons in schools.
MAYA: Me too. If children learnt how to mend simple things, it could change their attitude to waste early on.
LEO: So that belongs in formal education, not just weekend clubs.
MAYA: Definitely.
LEO: What about collecting broken laptops and refurbishing them?
MAYA: That's more complicated. You'd have to deal with personal data left on the machines, and there might be rules about selling or donating them afterwards.
LEO: Yes, that could create legal complications.
MAYA: Finally, the article mentioned holding sessions in neighbourhood cafés instead of community halls.
LEO: I really like that. People might stay afterwards, talk to others, and feel more connected locally.
MAYA: Exactly. It's not just about fixing objects; it could strengthen community relationships.
LEO: That gives us a good final angle for the presentation.`

const BIOCHAR_PART4_SCRIPT = `For my presentation today, I'm going to talk about biochar and its possible role in restoring damaged soils. Biochar has received a lot of attention recently, particularly in areas where farming has reduced the quality of the soil over many years.

Biochar looks rather like ordinary charcoal, and in fact the two materials are closely related. The important difference is that charcoal is usually made as a fuel, while biochar is made specifically to be added to soil.

The idea is not completely new. Researchers became interested in biochar after studying very dark and fertile soils in parts of the Amazon. These soils appear to have been created by ancient farming communities, who added burnt plant material, food waste and other organic matter to the ground.

One reason scientists are interested in biochar is that it may help to store carbon. When plants decay naturally, much of their carbon returns quickly to the atmosphere. But when plant material is converted into biochar, some of that carbon can remain stable in the soil for hundreds, or even thousands, of years.

So how is biochar produced? The process involves heating plant material, such as wood, straw or crop waste, but with very little oxygen. This is important because the material changes chemically instead of simply burning away as ash.

The structure of biochar is also important. If you looked at a piece of biochar under a microscope, you would see that it contains a huge number of tiny pores. These spaces allow the material to hold water and air, and they also create surfaces where chemical reactions can take place.

When biochar is added to soil, one possible benefit is that it helps prevent nutrients from being washed away by heavy rain. In sandy soils especially, valuable minerals can pass through very quickly, but biochar may hold them for longer.

Another benefit is water retention. During dry periods, soils containing biochar may keep more moisture near the roots of plants, which can make crops more resilient.

Biochar can also affect life in the soil. The small spaces inside the material provide shelter for microbes, including bacteria and fungi that help break down organic matter and support plant growth.

However, biochar is not a simple solution for every soil problem. The way it is produced makes a big difference. If the production temperatures are too high, some of the useful chemical properties may be lost.

There is also the question of what material is used to make it. Clean crop waste or untreated wood may be suitable, but some waste materials contain chemicals or heavy metals. If these are not tested carefully, the final product could cause contamination instead of improving the soil.

So, although biochar has real potential, it needs to be matched carefully to the soil type, the crop, and the environmental problem being addressed.`

const mcQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question,
  passage: URBAN_FARMING_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: [question, ...options.map((option) => `${option.key} ${option.text}`)].join('\n'),
  layout: 'choice'
})

const matchingQuestionText = `Questions 26-30
What is the students' opinion on the following growing methods?
Choose FIVE answers from the box and write the correct letter, A-G.
A Too expensive
B Highly efficient
C Requires more research
D Unsuitable for urban areas
E Environmentally damaging
F Best for beginners
G Aesthetically pleasing`

const methodOptions = [
  { key: 'A', text: 'Too expensive' },
  { key: 'B', text: 'Highly efficient' },
  { key: 'C', text: 'Requires more research' },
  { key: 'D', text: 'Unsuitable for urban areas' },
  { key: 'E', text: 'Environmentally damaging' },
  { key: 'F', text: 'Best for beginners' },
  { key: 'G', text: 'Aesthetically pleasing' }
]

const matchQuestion = (
  id: string,
  number: number,
  rowLabel: string,
  evidence: string,
  correctAnswer: string,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: rowLabel,
  passage: URBAN_FARMING_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options: methodOptions,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: matchingQuestionText,
  layout: 'matching-row',
  rowLabel
})

const gapOptions = (correct: string, distractors: string[]) =>
  [correct, ...distractors].map((text, index) => ({
    key: String.fromCharCode(65 + index),
    text
  }))

const gapQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  answer: string,
  distractors: string[],
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 4,
  question,
  passage: GINKGO_PART4_SCRIPT,
  evidence,
  correctAnswer: 'A',
  options: gapOptions(answer, distractors),
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: question,
  layout: 'gap-fill'
})

const repairBenefitsQuestionText = `Questions 21 and 22
Choose TWO letters, A-E.
Which TWO benefits of repair cafés do the students agree are most important?
A creating more paid jobs in the local area
B reducing the amount of electrical waste
C teaching people practical repair skills
D replacing ordinary recycling services
E making new products less expensive`

const repairProblemsQuestionText = `Questions 23 and 24
Choose TWO letters, A-E.
Which TWO problems do the students agree repair cafés often face?
A not having enough volunteers
B high insurance costs
C people bringing unsafe electrical items
D difficulty finding spare parts
E difficulty attracting older people`

const repairMcOptions = [
  { key: 'A', text: 'creating more paid jobs in the local area' },
  { key: 'B', text: 'reducing the amount of electrical waste' },
  { key: 'C', text: 'teaching people practical repair skills' },
  { key: 'D', text: 'replacing ordinary recycling services' },
  { key: 'E', text: 'making new products less expensive' }
]

const repairProblemOptions = [
  { key: 'A', text: 'not having enough volunteers' },
  { key: 'B', text: 'high insurance costs' },
  { key: 'C', text: 'people bringing unsafe electrical items' },
  { key: 'D', text: 'difficulty finding spare parts' },
  { key: 'E', text: 'difficulty attracting older people' }
]

const repairMcQuestion = (
  id: string,
  number: number,
  questionText: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: questionKeyword,
  passage: REPAIR_CAFES_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText,
  layout: 'choice'
})

const repairIdeaQuestionText = `Questions 25-30
What is the students' opinion about each of the following ideas for developing repair cafés?
Choose SIX answers from the box and write the correct letter, A-H.
A This should be included in formal education.
B This may have disappointing results.
C This could create legal complications.
D This already seems to be common.
E Better evidence is needed before this is expanded.
F This could reach people who are currently excluded.
G This might be too expensive to operate.
H This would strengthen community relationships.`

const repairIdeaOptions = [
  { key: 'A', text: 'This should be included in formal education.' },
  { key: 'B', text: 'This may have disappointing results.' },
  { key: 'C', text: 'This could create legal complications.' },
  { key: 'D', text: 'This already seems to be common.' },
  { key: 'E', text: 'Better evidence is needed before this is expanded.' },
  { key: 'F', text: 'This could reach people who are currently excluded.' },
  { key: 'G', text: 'This might be too expensive to operate.' },
  { key: 'H', text: 'This would strengthen community relationships.' }
]

const repairMatchQuestion = (
  id: string,
  number: number,
  rowLabel: string,
  evidence: string,
  correctAnswer: string,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: rowLabel,
  passage: REPAIR_CAFES_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options: repairIdeaOptions,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: repairIdeaQuestionText,
  layout: 'matching-row',
  rowLabel
})

const biocharGapQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  answer: string,
  distractors: string[],
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 4,
  question,
  passage: BIOCHAR_PART4_SCRIPT,
  evidence,
  correctAnswer: 'A',
  options: gapOptions(answer, distractors),
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: question,
  layout: 'gap-fill'
})

export const ADVANCED_PART34_LISTENING_SETS: ListeningFoundationSet[] = [
  {
    id: 'advanced-listening-urban-farming-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Urban Farming Project',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-urban-farming-part-3',
    audioscript: URBAN_FARMING_PART3_SCRIPT,
    questions: [
      mcQuestion(
        'advanced-urban-farming-p3-q21',
        21,
        'What do Mark and Lily agree is the hardest part of their urban farming project?',
        'the real struggle has been tracking down accurate statistics on how much food these rooftop gardens actually produce year over year. Absolutely, I\'ve had the exact same issue.',
        'B',
        [
          { key: 'A', text: 'Sourcing the correct seeds.' },
          { key: 'B', text: 'Finding reliable data on crop yields.' },
          { key: 'C', text: 'Securing permission for rooftop access.' }
        ],
        'tracking down accurate statistics on how much food these rooftop gardens actually produce',
        'Finding reliable data on crop yields',
        'ข้อมูลผลผลิตพืชที่เชื่อถือได้',
        'คำถามถาม hardest part ส่วนคำหลอกคือ seed varieties และ rooftop access เพราะทั้งคู่บอกว่าง่าย/เจ้าของตึกยอมให้เข้าถึง แต่คำเชื่อม For me เปลี่ยนเข้าคำตอบจริงคือ tracking down accurate statistics = finding reliable data on crop yields.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q22',
        22,
        'Lily was surprised by the article on hydroponics because it...',
        'What caught me off guard was that the author argued hydroponics actually uses more water than traditional soil in summer months. It completely goes against what we assumed at the start.',
        'A',
        [
          { key: 'A', text: 'contradicted their initial hypothesis.' },
          { key: 'B', text: 'was written by a controversial author.' },
          { key: 'C', text: 'ignored the financial costs.' }
        ],
        'goes against what we assumed at the start',
        'contradicted their initial hypothesis',
        'ขัดแย้งกับสมมติฐานแรก',
        'คำถามใช้ surprised และ initial hypothesis ในสคริปต์คือ caught me off guard และ what we assumed at the start. คำหลอกคือ financial costs เพราะ Lily บอกว่าไม่ได้ช็อกเรื่องค่าใช้จ่าย.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q23',
        23,
        'Why do the students decide not to rely on newspaper articles?',
        'they were interesting, but too anecdotal for an academic presentation. We need peer-reviewed figures',
        'A',
        [
          { key: 'A', text: 'They are not academically reliable enough.' },
          { key: 'B', text: 'They are mainly about rural farms.' },
          { key: 'C', text: 'They are too old to be useful.' }
        ],
        'too anecdotal for an academic presentation',
        'not academically reliable enough',
        'ไม่น่าเชื่อถือพอในเชิงวิชาการ',
        'คำเชื่อม but สำคัญมาก เพราะหลัง but คือเหตุผลจริง: too anecdotal. คำหลอกคือ interesting เพราะเป็นข้อดีเล็ก ๆ แต่ไม่ใช่เหตุผลที่ตัดออก.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q24',
        24,
        'What do Mark and Lily decide to add after receiving feedback?',
        'instead of adding more background, let\'s put in a comparison chart for the main systems',
        'B',
        [
          { key: 'A', text: 'More background information.' },
          { key: 'B', text: 'A comparison chart.' },
          { key: 'C', text: 'Interviews with local residents.' }
        ],
        'put in a comparison chart',
        'decide to add',
        'เพิ่มตารางเปรียบเทียบ',
        'คำหลอกคือ more background เพราะสคริปต์ใช้ instead of เพื่อปฏิเสธสิ่งนี้ แล้วคำตอบจริงมาหลังคำว่า let\'s: comparison chart.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q25',
        25,
        'What should the conclusion of the presentation emphasise?',
        'The evidence doesn\'t point to a single perfect solution. We should say every method has trade-offs depending on budget, space, and maintenance.',
        'A',
        [
          { key: 'A', text: 'Each method has both advantages and limitations.' },
          { key: 'B', text: 'Rooftop farms can replace conventional farming.' },
          { key: 'C', text: 'Technology solves most urban farming problems.' }
        ],
        'every method has trade-offs',
        'advantages and limitations',
        'มีทั้งข้อดีและข้อจำกัด',
        'คำถามใช้ emphasise ส่วนสคริปต์ใช้ We should say. คำว่า trade-offs แปลว่ามีทั้งข้อดีและข้อจำกัด จึงตอบ A.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q26',
        26,
        'Vertical Soil Walls',
        'They look amazing, don\'t they? Very striking visually.',
        'G',
        'Very striking visually',
        'Aesthetically pleasing',
        'ดูสวยงาม / ดึงดูดทางสายตา',
        'keyword ในโจทย์คือ Vertical Soil Walls ส่วน evidence คือ striking visually = aesthetically pleasing. คำหลอกคือ costly แต่ Lily บอกให้ focus on how they look.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q27',
        27,
        'Aeroponics',
        'The crop turnover is incredibly fast. You get maximum output for minimal space.',
        'B',
        'maximum output for minimal space',
        'Highly efficient',
        'มีประสิทธิภาพสูง',
        'maximum output for minimal space = highly efficient. คำว่า agree ในบรรทัดถัดไปช่วยยืนยันว่าทั้งคู่เห็นด้วยกับคำตอบนี้.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q28',
        28,
        'Aquaponics',
        'We need more studies before recommending it.',
        'C',
        'need more studies',
        'Requires more research',
        'ต้องการงานวิจัยเพิ่ม',
        'studies = research และ need = requires. คำหลอกคือ fascinating เพราะเป็นความคิดเห็นเชิงบวก แต่คำตอบจริงมาหลัง but/honestly เรื่องความเสี่ยงที่ยังไม่รู้พอ.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q29',
        29,
        'Traditional Container Gardening',
        'it\'s simple enough for people who are just starting out. Exactly. Beginners can understand it without specialist equipment.',
        'F',
        'Beginners can understand it',
        'Best for beginners',
        'เหมาะกับผู้เริ่มต้น',
        'people who are just starting out และ Beginners ตรงกับ best for beginners. คำว่า Exactly เป็น consensus marker ว่าอีกคนเห็นด้วย.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q30',
        30,
        'Smart Greenhouses',
        'the price is far beyond what most community projects could afford. So we should mark them as too expensive',
        'A',
        'too expensive',
        'Too expensive',
        'แพงเกินไป',
        'คำหลอกคือ sensors and automated lighting are impressive แต่คำเชื่อม but พาไปคำตอบจริง: price far beyond what projects could afford = too expensive.'
      )
    ]
  },
  {
    id: 'advanced-listening-ginkgo-tree-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - The Ginkgo Tree',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-ginkgo-tree-part-4',
    audioscript: GINKGO_PART4_SCRIPT,
    questions: [
      gapQuestion('advanced-ginkgo-p4-q31', 31, 'Survived major extinction events due to its resistance to 31. ____', 'survived several major extinction events is its remarkable resistance to disease', 'disease', ['pollution', 'insects', 'soil'], 'resistance to disease', 'resistance to', 'ความต้านทานต่อโรค', 'keyword ในโจทย์คือ resistance to และในสคริปต์พูดตรงว่า resistance to disease จึงตอบ disease.'),
      gapQuestion('advanced-ginkgo-p4-q32', 32, 'Originally thought to be extinct in the wild until discovered in a 32. ____ in China.', 'small wild populations were identified in a monastery in China', 'monastery', ['forest', 'garden', 'museum'], 'identified in a monastery in China', 'discovered in', 'วัด / อาราม', 'discovered = identified และ in China อยู่เหมือนกัน คำตอบคือ monastery.'),
      gapQuestion('advanced-ginkgo-p4-q33', 33, 'Leaves have a unique fan shape and develop a bright 33. ____ colour in autumn.', 'in autumn they turn a bright yellow colour', 'yellow', ['green', 'golden', 'orange'], 'bright yellow colour', 'bright colour in autumn', 'สีเหลืองสด', 'fan shape ช่วย locate ประโยค และคำตอบหลัง turn a bright คือ yellow.'),
      gapQuestion('advanced-ginkgo-p4-q34', 34, 'Possesses an extraordinary ability to survive in environments with poor 34. ____', 'survive in environments with poor soil', 'soil', ['light', 'water', 'drainage'], 'poor soil', 'poor environments', 'ดินไม่ดี', 'โจทย์ใช้ environments with poor ส่วนสคริปต์เติมตรงว่า poor soil จึงตอบ soil.'),
      gapQuestion('advanced-ginkgo-p4-q35', 35, 'The tree produces a specific chemical that deters 35. ____ from eating its leaves.', 'a compound that discourages insects from eating them', 'insects', ['birds', 'fungi', 'humans'], 'discourages insects from eating them', 'deters from eating', 'แมลง', 'deters = discourages และ eating its leaves = eating them คำตอบคือ insects.'),
      gapQuestion('advanced-ginkgo-p4-q36', 36, 'Frequently planted in cities because it tolerates high levels of 36. ____', 'tolerates high levels of pollution', 'pollution', ['noise', 'heat', 'traffic'], 'high levels of pollution', 'tolerates high levels of', 'มลพิษ', 'keyword ตรงกันมาก: tolerates high levels of pollution จึงตอบ pollution.'),
      gapQuestion('advanced-ginkgo-p4-q37', 37, 'The female trees drop fruit that produces a foul 37. ____', 'it releases a foul smell', 'smell', ['taste', 'liquid', 'colour'], 'foul smell', 'produces a foul', 'กลิ่นเหม็น', 'produces = releases และ foul smell คือกลิ่นเหม็น คำตอบคือ smell.'),
      gapQuestion('advanced-ginkgo-p4-q38', 38, 'Consequently, urban planners almost exclusively plant male trees to maintain 38. ____', 'plant male trees almost exclusively, especially in areas where cleanliness is important', 'cleanliness', ['shade', 'growth', 'diversity'], 'cleanliness is important', 'maintain', 'ความสะอาด', 'คำเชื่อม For that reason/Consequently บอกผลจากเรื่อง fruit มีกลิ่น จึงปลูก male trees เพื่อรักษา cleanliness.'),
      gapQuestion('advanced-ginkgo-p4-q39', 39, 'Extracts are widely used in traditional medicine to improve 39. ____', 'traditional medicine and are commonly claimed to improve memory', 'memory', ['vision', 'sleep', 'energy'], 'improve memory', 'improve', 'ความจำ', 'traditional medicine ช่วย locate และสคริปต์พูดตรงว่า improve memory.'),
      gapQuestion('advanced-ginkgo-p4-q40', 40, 'The nuts are considered a delicacy and are frequently used in cooking, particularly in a traditional 40. ____', 'often added to a traditional soup served on special occasions', 'soup', ['tea', 'cake', 'sauce'], 'traditional soup', 'traditional', 'ซุป', 'particularly in a traditional ในโจทย์ตรงกับ traditional soup ในสคริปต์ จึงตอบ soup.')
    ]
  },
  {
    id: 'advanced-listening-repair-cafes-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Repair Cafés',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-repair-cafes-part-3',
    audioscript: REPAIR_CAFES_PART3_SCRIPT,
    questions: [
      repairMcQuestion(
        'advanced-repair-cafes-p3-q21',
        21,
        repairBenefitsQuestionText,
        'They stop so many items ending up as waste. I agree.',
        'B',
        repairMcOptions,
        'stop so many items ending up as waste',
        'reducing the amount of electrical waste',
        'ลดขยะไฟฟ้า',
        'keyword ในโจทย์คือ electrical waste ส่วนสคริปต์พูดว่า electrical equipment gets thrown away และ stop items ending up as waste. คำหลอกคือ paid jobs เพราะ Leo บอกว่า not convinced และส่วนใหญ่เป็น volunteers.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q22',
        22,
        repairBenefitsQuestionText,
        'People pick up basic repair skills, and that might make them more confident about fixing things next time.',
        'C',
        repairMcOptions,
        'pick up basic repair skills',
        'teaching people practical repair skills',
        'สอนทักษะซ่อมของจริง',
        'pick up basic repair skills = teaching practical repair skills. คำหลอกคือ replace recycling เพราะทั้งคู่บอกว่า unrealistic และ recycling still has a role.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q23',
        23,
        repairProblemsQuestionText,
        'finding enough people with the right skills. The same volunteers keep being asked to help, and some of them are getting tired.',
        'A',
        repairProblemOptions,
        'finding enough people with the right skills',
        'not having enough volunteers',
        'มีอาสาสมัครไม่พอ',
        'finding enough people with the right skills ตรงกับ not having enough volunteers. คำหลอกคือ insurance เพราะ policy already covered most events.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q24',
        24,
        repairProblemsQuestionText,
        'the other problem is spare parts. Sometimes the repair is simple, but the exact part is impossible to get',
        'D',
        repairProblemOptions,
        'the exact part is impossible to get',
        'difficulty finding spare parts',
        'หาอะไหล่ยาก',
        'spare parts ในโจทย์ตรงกับ the exact part ในสคริปต์ และ impossible to get = difficulty finding. คำหลอกคือ unsafe electrical items เพราะ cafés check first and refuse dangerous items.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q25',
        25,
        'Tool-lending libraries',
        'They\'re a good idea, but they don\'t feel new. Lots of towns already have them',
        'D',
        'Lots of towns already have them',
        'already seems to be common',
        'พบได้ทั่วไปแล้ว',
        'คำเชื่อม but สำคัญ เพราะเปลี่ยนจาก good idea ไปคำตอบจริง: don\'t feel new / already have them = already common.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q26',
        26,
        'Mobile repair vans',
        'They could visit villages or housing estates where people don\'t have transport. So they\'d reach people who are excluded',
        'F',
        'reach people who are excluded',
        'reach people currently excluded',
        'เข้าถึงคนที่ถูกกันออกจากระบบเดิม',
        'where people don\'t have transport อธิบายกลุ่มที่เข้าไม่ถึง service เดิม และ Leo สรุปตรงว่า reach people who are excluded.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q27',
        27,
        'Online booking systems',
        'People may book a slot and then not come, or they might describe the problem badly online. So the results could be disappointing.',
        'B',
        'results could be disappointing',
        'disappointing results',
        'ผลลัพธ์อาจน่าผิดหวัง',
        'คำหลอกคือ article was very enthusiastic แต่คำเชื่อม but/I\'m not sure พาไปข้อเสีย: no-show หรือบรรยายปัญหาผิด จึงตอบ disappointing results.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q28',
        28,
        'Repair lessons in schools',
        'that belongs in formal education, not just weekend clubs',
        'A',
        'belongs in formal education',
        'included in formal education',
        'ควรถูกบรรจุในระบบการศึกษา',
        'belongs in formal education = should be included in formal education. คำว่า not just weekend clubs ช่วยตัดกิจกรรมนอกระบบออก.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q29',
        29,
        'Refurbishing donated laptops',
        'deal with personal data left on the machines, and there might be rules about selling or donating them afterwards',
        'C',
        'personal data ... rules about selling or donating',
        'legal complications',
        'ความซับซ้อนทางกฎหมาย',
        'personal data และ rules about selling/donating เป็น clue ด้านกฎหมาย จึงตอบ legal complications.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q30',
        30,
        'Holding sessions in neighbourhood cafés',
        'People might stay afterwards, talk to others, and feel more connected locally. Exactly. It\'s not just about fixing objects; it could strengthen community relationships.',
        'H',
        'strengthen community relationships',
        'strengthen community relationships',
        'ทำให้ความสัมพันธ์ในชุมชนแน่นแฟ้นขึ้น',
        'keyword ตรงมาก: strengthen community relationships. คำว่า not just about fixing objects เป็น transition บอกว่าคำตอบอยู่ที่ผลทางสังคม ไม่ใช่การซ่อมของ.'
      )
    ]
  },
  {
    id: 'advanced-listening-biochar-soil-restoration-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Biochar and Soil Restoration',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-biochar-soil-restoration-part-4',
    audioscript: BIOCHAR_PART4_SCRIPT,
    questions: [
      biocharGapQuestion('advanced-biochar-p4-q31', 31, 'Biochar is similar to 31 ____, but is made specifically for use in soil.', 'Biochar looks rather like ordinary charcoal', 'charcoal', ['soil', 'fuel', 'ash'], 'looks rather like ordinary charcoal', 'similar to', 'ถ่านไม้', 'similar to = looks rather like และคำหลอกคือ fuel เพราะ charcoal is usually made as a fuel แต่ biochar ใช้กับ soil.'),
      biocharGapQuestion('advanced-biochar-p4-q32', 32, 'Ancient farmers in the 32 ____ created unusually fertile dark earth.', 'very dark and fertile soils in parts of the Amazon. These soils appear to have been created by ancient farming communities', 'Amazon', ['desert', 'Andes', 'forest'], 'parts of the Amazon', 'ancient farmers', 'แอมะซอน', 'ancient farmers ในโจทย์ถูกพูดเป็น ancient farming communities และ location คือ parts of the Amazon.'),
      biocharGapQuestion('advanced-biochar-p4-q33', 33, 'Biochar can store 33 ____ for long periods.', 'it may help to store carbon', 'carbon', ['water', 'nutrients', 'oxygen'], 'store carbon', 'store for long periods', 'คาร์บอน', 'store carbon ตรงกับโจทย์ และ long periods ถูกขยายเป็น hundreds or thousands of years.'),
      biocharGapQuestion('advanced-biochar-p4-q34', 34, 'Plant material is heated with very little 34 ____.', 'heating plant material, such as wood, straw or crop waste, but with very little oxygen', 'oxygen', ['water', 'carbon', 'ash'], 'very little oxygen', 'heated with very little', 'ออกซิเจน', 'โจทย์ใช้ heated with very little และสคริปต์พูดตรงว่า with very little oxygen.'),
      biocharGapQuestion('advanced-biochar-p4-q35', 35, 'The material contains many tiny 35 ____, which help it hold air and water.', 'it contains a huge number of tiny pores. These spaces allow the material to hold water and air', 'pores', ['minerals', 'roots', 'microbes'], 'tiny pores', 'tiny spaces', 'รูพรุน', 'tiny pores = tiny spaces และประโยคถัดไปยืนยันว่า hold water and air.'),
      biocharGapQuestion('advanced-biochar-p4-q36', 36, 'It can stop 36 ____ from being washed away.', 'helps prevent nutrients from being washed away by heavy rain', 'nutrients', ['sand', 'carbon', 'roots'], 'prevent nutrients from being washed away', 'stop from being washed away', 'สารอาหาร', 'stop = prevent และคำตอบที่ถูกคือ nutrients. คำหลอกคือ minerals เพราะเป็นตัวอย่างในประโยคถัดไป ไม่ใช่ช่องว่างนี้.'),
      biocharGapQuestion('advanced-biochar-p4-q37', 37, 'It helps soil retain 37 ____ during dry periods.', 'During dry periods, soils containing biochar may keep more moisture near the roots of plants', 'moisture', ['oxygen', 'heat', 'carbon'], 'keep more moisture', 'retain during dry periods', 'ความชื้น', 'retain = keep และ during dry periods อยู่ตรงกัน คำตอบคือ moisture.'),
      biocharGapQuestion('advanced-biochar-p4-q38', 38, 'It provides shelter for beneficial 38 ____.', 'provide shelter for microbes, including bacteria and fungi', 'microbes', ['plants', 'insects', 'chemicals'], 'shelter for microbes', 'beneficial microbes', 'จุลินทรีย์', 'provide shelter for ตรงกับโจทย์ และ bacteria/fungi เป็นตัวอย่างของ microbes.'),
      biocharGapQuestion('advanced-biochar-p4-q39', 39, 'Very high production 39 ____ may reduce its benefits.', 'If the production temperatures are too high, some of the useful chemical properties may be lost', 'temperatures', ['costs', 'methods', 'volumes'], 'production temperatures are too high', 'very high production', 'อุณหภูมิ', 'very high production ในโจทย์ต้องฟังต่อว่า temperatures. คำหลอกคือ costs เพราะ high + production อาจหลอกให้คิดเรื่องราคา แต่สคริปต์พูด temperatures.'),
      biocharGapQuestion('advanced-biochar-p4-q40', 40, 'Some waste materials can cause 40 ____ if not checked carefully.', 'If these are not tested carefully, the final product could cause contamination', 'contamination', ['erosion', 'pollution', 'decay'], 'cause contamination', 'cause if not checked carefully', 'การปนเปื้อน', 'if not checked carefully = if not tested carefully และคำตอบตรงคือ contamination.')
    ]
  }
]
