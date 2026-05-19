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

const TEXTILE_RECYCLING_PART3_SCRIPT = `LEAH: Hi Arun. Did you finish reading the article on textile recycling?
ARUN: Yes, I did. I was surprised, actually. Before I read it, I thought textile recycling might be too broad for our presentation: clothes, curtains, carpets, shoes, all sorts of things.
LEAH: I know what you mean, but the article gives us a clear angle: what happens to clothing after people put it in donation banks.
ARUN: Exactly. It's much more complicated than just old clothes go to charity shops.
LEAH: The section on fast fashion was interesting too. I thought the main problem was that cheap clothes are badly made.
ARUN: Some are, but the article said low prices are the bigger issue because people don't feel guilty about throwing things away.
LEAH: I agree with that. But you said earlier that young people are mostly responsible, and I'm not sure that's fair.
ARUN: Really? Students buy loads of cheap clothes.
LEAH: Maybe, but adults order just as much online. The problem is wider than one age group.
ARUN: Fair point.
LEAH: I have to admit, I sometimes donate clothes that are perfectly wearable.
ARUN: Because they're out of fashion?
LEAH: Not usually. It's more because I buy things online and the size isn't quite right. I mean to return them, but then I miss the deadline.
ARUN: That's common. What confused me was one of the statistics. The number of clothing banks has increased, but the percentage of clothing that actually gets reused has fallen.
LEAH: Yes, because a lot of donated clothing is rejected before it reaches a shop.
ARUN: Let's use those examples from the sorting centre.
LEAH: Good idea. The winter coat first?
ARUN: The manager said it was good quality, and the fabric was clean, but the main zip wouldn't close. That made it impossible to sell.
LEAH: So, broken zip. What about the cotton curtains?
ARUN: Those had paint marks across one side. The fabric itself was strong, but the stains were too obvious.
LEAH: Right. And the wool jumper?
ARUN: That one had been washed badly. It had shrunk so much that the sleeves were far too short.
LEAH: The sports bag was different, wasn't it?
ARUN: Yes. It had probably been stored outside. The manager said it was still wet when it arrived, so they rejected it straight away.
LEAH: There was also a shirt with torn seams, but that wasn't one of the examples we need.
ARUN: What did you think about the project where they tried to make new clothes from old fabric?
LEAH: It sounded clever, but I wasn't surprised it failed.
ARUN: Was it because people didn't like the idea of recycled clothing?
LEAH: No, the article said customers were actually open to that. The problem was that the pieces of fabric they received were too inconsistent: different weights, different colours, different levels of wear.
ARUN: So manufacturers couldn't rely on a steady supply.
LEAH: Exactly.
ARUN: I think that gives us our presentation angle. We shouldn't just talk about people shopping too much.
LEAH: Or just criticise fashion brands.
ARUN: Right. The interesting part is what happens after people donate clothes: sorting, rejection, reuse, export, landfill.
LEAH: Yes, that's the hidden process most people know nothing about.`

const VERTICAL_FARMING_PART4_SCRIPT = `Today I'm going to talk about vertical farming, a method of food production that has attracted increasing interest in urban areas.

In traditional farming, crops are grown across large areas of land. In vertical farming, however, crops are grown indoors in stacked layers. This means that a relatively small building can produce a large amount of food.

Many vertical farms are established in unused warehouses, especially in cities where land is expensive but empty industrial buildings are available.

The production method is very different from ordinary field farming. Since the crops are indoors, they do not receive natural sunlight. Instead, they are given artificial light, usually from LED systems that can be adjusted for different crops.

In many vertical farms, plants are not grown in soil. Their roots grow in nutrient-rich water, which provides the minerals they need.

The growing environment is carefully controlled. Computer systems monitor humidity and temperature, and they can adjust the conditions automatically if the plants need more or less moisture in the air.

One advantage of vertical farming is that pests are easier to control indoors. As a result, farmers often need far fewer pesticides than they would in outdoor agriculture.

Another possible benefit is location. If food is grown close to the people who buy it, there is less need for long-distance transport from rural farms to city supermarkets.

However, vertical farming also has limitations. The first is the amount of electricity needed for lighting, heating, cooling and computer control systems. This can make production expensive.

Another limitation is the type of crop that can be grown. Leafy vegetables such as lettuce work well, but crops such as wheat are much harder to produce profitably because they require more space and have a lower market value.

Finally, vertical farms need reliable contracts with supermarkets, restaurants or other buyers. Without these, it is difficult to cover the high cost of equipment and energy.

So vertical farming is not a replacement for all traditional agriculture, but it may become an important part of food production in large cities.`

const SLEEP_UNIVERSITY_PART3_SCRIPT = `DANA: Shall we go through our notes on sleep and university students?
SAM: Yes. I thought this would be a simple topic, but there's more research than I expected.
DANA: Same here. The first question is why so many students sleep badly.
SAM: I assumed noisy accommodation would be the main cause.
DANA: It can be a problem, but the studies didn't treat it as one of the major causes. It depends too much on where students live.
SAM: True. Screen use seems much more significant. Students work on laptops, message friends, and watch videos late at night.
DANA: Yes, and the light from screens can delay sleep. That's definitely one cause we should include.
SAM: What about caffeine? Energy drinks were mentioned.
DANA: They were, but the evidence was mixed. Some students drink them early in the day, so it doesn't always affect sleep.
SAM: Fair enough. I think part-time employment is important. Students who work evening shifts often get home late and then still have assignments to finish.
DANA: I agree. That creates a routine where sleep gets pushed later and later.
SAM: Early morning lectures are annoying, but not every course has them.
DANA: Exactly. They make bad sleep worse, but they aren't the main cause.
SAM: What effects of poor sleep should we mention?
DANA: Concentration is the obvious one. Several studies showed that students who slept badly found it harder to focus in seminars and lectures.
SAM: Yes. I also saw a claim that poor sleep increases creativity, but that sounded doubtful.
DANA: I wouldn't include that. The stronger evidence is about memory. Sleep seems to help students process and store what they've learned.
SAM: Right. There were also claims about back pain and skin problems.
DANA: But those seemed much weaker. They may be connected indirectly, but the evidence wasn't strong enough for our presentation.
SAM: What did you think about sleep-tracking apps?
DANA: They're interesting, but I'm worried they might make some people anxious. If students keep checking their sleep score every morning, they may become stressed about it.
SAM: I thought the same. Some people might sleep worse because they're trying too hard to get a perfect result.
DANA: Exactly.
SAM: Are they too expensive, though?
DANA: Some are, but lots of students already have basic versions on their phones, so cost isn't the main issue.
SAM: The article said the apps can be useful, but I don't think they can replace proper advice from a doctor or counsellor.
DANA: No, definitely not.
SAM: And we should say more independent research is needed. A lot of the evidence comes from the companies that make the apps.
DANA: Yes, that's a really important point.
SAM: I don't like the idea of universities making students use them.
DANA: Me neither. That would be too intrusive.
DANA: Now, what about the phrase sleep hygiene?
SAM: It sounds strange. Some students may think it means keeping your bed clean.
DANA: True, but it's a common term in the research. We could define it first, then give examples like having a regular bedtime and avoiding screens late at night.
SAM: That makes sense.
DANA: I think we should start the presentation with a personal example. Maybe my first exam period, when I stayed up too late every night and felt awful.
SAM: Good idea. Most students will recognise that situation, even if they don't talk about it.
DANA: What about naps? Should we recommend them?
SAM: Carefully. The studies suggest short naps can help, but long ones can make it harder to sleep at night.
DANA: So the key point is that naps are useful only if they aren't too long.
SAM: Exactly.
DANA: One thing that surprised me was the advice from universities. The health centre says one thing, academic departments say another, and accommodation teams send different information again.
SAM: Yes, it's not coordinated. Students may get advice, but it comes from too many separate places.
DANA: That can be our final recommendation: universities need a clearer approach.`

const SEED_BANKS_PART4_SCRIPT = `For my presentation today, I'm going to discuss seed banks and their role in protecting crop diversity.

A seed bank is a place where seeds are collected, catalogued and stored for future use. One of its main purposes is to protect agricultural diversity. This is important because modern farming often depends on a limited number of commercial crops.

In the past, farmers grew many local varieties that were adapted to particular soils, climates and diseases. But when farmers change to commercial crops, these older varieties may disappear.

The storage process has to be carefully controlled. First, seeds are cleaned and dried to remove moisture. If too much moisture remains inside the seed, it may decay during storage.

After drying, most seeds are kept at a low temperature. This slows down the natural ageing process and allows the seeds to remain usable for many years.

Each seed sample is placed in sealed containers. These protect the seeds from air, water and insects, and they also make it easier to label and organise the collection.

Seed banks are useful in several ways. If a crop is damaged by disease, researchers can search stored collections for older varieties that may have natural protection against it.

Plant breeders also use seed banks to develop crops with greater resistance to drought. This is becoming more important in regions where rainfall is less reliable than it used to be.

Seed banks can also support farmers after extreme events such as floods, when stored seed for the next planting season may have been destroyed.

However, seed banks have limitations. Some seeds are difficult to store because they cannot survive drying. These include the seeds of certain tropical plants, which lose their ability to grow if too much water is removed.

Another problem is that stored seeds do not remain alive forever. Banks must carry out regular testing to check whether samples can still germinate. If too few seeds grow during testing, new samples have to be collected or produced.

So, seed banks are not simply museums for plants. They are active scientific resources that may help agriculture respond to disease, climate change and food insecurity.`

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

const choiceQuestionFor = (
  script: string,
  id: string,
  number: number,
  question: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string,
  questionText?: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question,
  passage: script,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: questionText ?? [question, ...options.map((option) => `${option.key} ${option.text}`)].join('\n'),
  layout: 'choice'
})

const matchQuestionFor = (
  script: string,
  options: Array<{ key: string; text: string }>,
  questionText: string,
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
  passage: script,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText,
  layout: 'matching-row',
  rowLabel
})

const gapQuestionFor = (
  script: string,
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
  passage: script,
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

const textileSortingQuestionText = `Questions 25-28
What reason did the sorting centre give for rejecting each item?
Choose FOUR answers from the box and write the correct letter, A-F.
A the fabric was too badly stained
B the fibre label was missing
C the material had shrunk
D the zip was broken
E the item was damp
F the seams had torn`

const textileSortingOptions = [
  { key: 'A', text: 'the fabric was too badly stained' },
  { key: 'B', text: 'the fibre label was missing' },
  { key: 'C', text: 'the material had shrunk' },
  { key: 'D', text: 'the zip was broken' },
  { key: 'E', text: 'the item was damp' },
  { key: 'F', text: 'the seams had torn' }
]

const sleepCauseQuestionText = `Questions 21 and 22
Choose TWO letters, A-E.
Which TWO factors do the students both believe are major causes of poor sleep among university students?
A late-night screen use
B noisy accommodation
C part-time employment
D caffeine in energy drinks
E early morning lectures`

const sleepEffectQuestionText = `Questions 23 and 24
Choose TWO letters, A-E.
Which TWO effects of poor sleep do the students agree are supported by strong evidence?
A reduced concentration
B increased creativity
C poorer memory
D back pain
E skin problems`

const sleepAppQuestionText = `Questions 25 and 26
Choose TWO letters, A-E.
Which TWO opinions do the students both express about sleep-tracking apps?
A They may make users anxious.
B They are too expensive for most students.
C They can replace professional advice.
D They should be required by universities.
E They need more independent research.`

const sleepCauseOptions = [
  { key: 'A', text: 'late-night screen use' },
  { key: 'B', text: 'noisy accommodation' },
  { key: 'C', text: 'part-time employment' },
  { key: 'D', text: 'caffeine in energy drinks' },
  { key: 'E', text: 'early morning lectures' }
]

const sleepEffectOptions = [
  { key: 'A', text: 'reduced concentration' },
  { key: 'B', text: 'increased creativity' },
  { key: 'C', text: 'poorer memory' },
  { key: 'D', text: 'back pain' },
  { key: 'E', text: 'skin problems' }
]

const sleepAppOptions = [
  { key: 'A', text: 'They may make users anxious.' },
  { key: 'B', text: 'They are too expensive for most students.' },
  { key: 'C', text: 'They can replace professional advice.' },
  { key: 'D', text: 'They should be required by universities.' },
  { key: 'E', text: 'They need more independent research.' }
]

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
  },
  {
    id: 'advanced-listening-textile-recycling-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Textile Recycling',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-textile-recycling-part-3',
    audioscript: TEXTILE_RECYCLING_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q21',
        21,
        'At first, Arun thought the topic of textile recycling might be too',
        'I thought textile recycling might be too broad for our presentation: clothes, curtains, carpets, shoes, all sorts of things.',
        'B',
        [
          { key: 'A', text: 'technical.' },
          { key: 'B', text: 'broad.' },
          { key: 'C', text: 'familiar.' }
        ],
        'too broad for our presentation',
        'too broad',
        'กว้างเกินไป',
        'keyword ในโจทย์คือ At first และ too. Arun พูดตรงว่า might be too broad. คำหลอกคือรายการ clothes, curtains, carpets, shoes ที่อธิบายว่าทำไมกว้าง ไม่ใช่คำตอบอื่น.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q22',
        22,
        'When discussing fast fashion, Leah and Arun disagree about',
        'you said earlier that young people are mostly responsible, and I\'m not sure that\'s fair. Maybe, but adults order just as much online. The problem is wider than one age group.',
        'C',
        [
          { key: 'A', text: 'whether cheap clothes are usually badly made.' },
          { key: 'B', text: 'whether low prices encourage waste.' },
          { key: 'C', text: 'whether young people are mainly responsible.' }
        ],
        'young people are mostly responsible',
        'young people are mainly responsible',
        'คนหนุ่มสาวเป็นสาเหตุหลัก',
        'disagree about ต้องฟังจุดที่ Leah ขัด Arun: young people are mostly responsible. คำหลอกคือ cheap clothes และ low prices เพราะสองคนนั้นเห็นด้วยว่าราคาถูกทำให้ทิ้งง่าย.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q23',
        23,
        'Leah says she sometimes donates clothes because',
        'It\'s more because I buy things online and the size isn\'t quite right. I mean to return them, but then I miss the deadline.',
        'A',
        [
          { key: 'A', text: 'she ordered the wrong size online.' },
          { key: 'B', text: 'she no longer needs them for sport.' },
          { key: 'C', text: 'her friends have similar clothes.' }
        ],
        'buy things online and the size isn\'t quite right',
        'ordered the wrong size online',
        'สั่งออนไลน์แล้วไซซ์ไม่พอดี',
        'because ในโจทย์ตรงกับ because ในสคริปต์ และ size isn\'t quite right = wrong size. คำหลอกคือ out of fashion เพราะ Arun ถาม แต่ Leah ปฏิเสธว่า Not usually.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q24',
        24,
        'What statistic in the article confused Arun?',
        'The number of clothing banks has increased, but the percentage of clothing that actually gets reused has fallen.',
        'B',
        [
          { key: 'A', text: 'More clothes are now bought online than in shops.' },
          { key: 'B', text: 'Less clothing is reused although more donation points exist.' },
          { key: 'C', text: 'Manufacturing costs have fallen in recent years.' }
        ],
        'clothing banks has increased, but the percentage ... reused has fallen',
        'Less clothing is reused although more donation points exist',
        'มีจุดรับบริจาคมากขึ้นแต่เสื้อผ้าถูกใช้ซ้ำน้อยลง',
        'statistic confused Arun ตามด้วยตัวเลขสองฝั่ง: banks increased แต่ reused has fallen. คำว่า but เป็น transition สำคัญที่ทำให้เห็นความขัดแย้งในสถิติ.'
      ),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q25', 25, 'winter coat', 'the main zip wouldn\'t close. That made it impossible to sell.', 'D', 'zip wouldn\'t close', 'zip was broken', 'ซิปเสีย', 'wouldn\'t close = broken. คำหลอกคือ fabric was clean แปลว่าไม่ใช่ stained.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q26', 26, 'cotton curtains', 'Those had paint marks across one side. The fabric itself was strong, but the stains were too obvious.', 'A', 'stains were too obvious', 'fabric was too badly stained', 'ผ้าเปื้อนมากเกินไป', 'paint marks และ stains were too obvious = badly stained. คำหลอกคือ fabric itself was strong เพราะไม่ได้ถูกปฏิเสธเพราะวัสดุเสีย.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q27', 27, 'wool jumper', 'It had shrunk so much that the sleeves were far too short.', 'C', 'shrunk so much', 'material had shrunk', 'วัสดุหด', 'shrunk ในสคริปต์ตรงกับ material had shrunk ในตัวเลือก จึงตอบ C.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q28', 28, 'sports bag', 'it was still wet when it arrived, so they rejected it straight away.', 'E', 'still wet when it arrived', 'item was damp', 'ของชื้น/เปียก', 'still wet = damp. คำว่า rejected it straight away ยืนยันว่าเป็นเหตุผลที่ถูกปฏิเสธ.'),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q29',
        29,
        'Why did the project to make new clothes from old fabric fail?',
        'The problem was that the pieces of fabric they received were too inconsistent: different weights, different colours, different levels of wear.',
        'A',
        [
          { key: 'A', text: 'The supply of material was too inconsistent.' },
          { key: 'B', text: 'Customers disliked the recycled label.' },
          { key: 'C', text: 'Designers found the process too slow.' }
        ],
        'fabric ... too inconsistent',
        'supply of material was too inconsistent',
        'วัสดุที่ได้มาไม่สม่ำเสมอ',
        'problem was เป็น signal ไปคำตอบจริง: fabric too inconsistent. คำหลอกคือ customers disliked เพราะสคริปต์บอก customers were actually open to that.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q30',
        30,
        'Leah and Arun agree that their presentation should focus on',
        'The interesting part is what happens after people donate clothes: sorting, rejection, reuse, export, landfill. Yes, that\'s the hidden process most people know nothing about.',
        'A',
        [
          { key: 'A', text: 'what happens after people donate clothes.' },
          { key: 'B', text: 'the behaviour of individual shoppers.' },
          { key: 'C', text: 'the environmental policies of fashion brands.' }
        ],
        'what happens after people donate clothes',
        'focus on what happens after people donate clothes',
        'สิ่งที่เกิดขึ้นหลังบริจาคเสื้อผ้า',
        'agree เห็นจาก Leah ตอบ Yes หลัง Arun สรุป focus. คำหลอกคือ shoppers และ fashion brands เพราะทั้งคู่บอกว่า shouldn\'t just talk about those.'
      )
    ]
  },
  {
    id: 'advanced-listening-vertical-farming-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Vertical Farming',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-vertical-farming-part-4',
    audioscript: VERTICAL_FARMING_PART4_SCRIPT,
    questions: [
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q31', 31, 'Crops are grown in stacked 31 ____ inside buildings.', 'crops are grown indoors in stacked layers', 'layers', ['buildings', 'fields', 'trays'], 'stacked layers', 'stacked', 'ชั้น', 'stacked ในโจทย์ช่วย locate และสคริปต์เติมว่า stacked layers จึงตอบ layers.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q32', 32, 'Many vertical farms are set up in unused 32 ____.', 'Many vertical farms are established in unused warehouses', 'warehouses', ['cities', 'factories', 'markets'], 'unused warehouses', 'unused', 'โกดัง', 'set up = established และ unused warehouses คือสถานที่ตั้ง จึงตอบ warehouses.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q33', 33, 'Plants receive artificial 33 ____ from LEDs.', 'they are given artificial light, usually from LED systems', 'light', ['heat', 'water', 'energy'], 'artificial light', 'artificial from LEDs', 'แสง', 'receive = are given และ from LEDs ชี้ไปที่ artificial light.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q34', 34, 'Roots grow in nutrient-rich 34 ____.', 'Their roots grow in nutrient-rich water', 'water', ['soil', 'air', 'liquid'], 'nutrient-rich water', 'roots grow in nutrient-rich', 'น้ำ', 'โจทย์กับสคริปต์แทบตรงกัน: roots grow in nutrient-rich water. คำหลอกคือ soil เพราะสคริปต์บอก plants are not grown in soil.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q35', 35, 'Computer systems monitor 35 ____ and temperature.', 'Computer systems monitor humidity and temperature', 'humidity', ['light', 'growth', 'water'], 'monitor humidity and temperature', 'monitor and temperature', 'ความชื้นในอากาศ', 'monitor ... and temperature ตรงกับสคริปต์ คำตอบที่อยู่ก่อน and คือ humidity.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q36', 36, 'There is less need for 36 ____.', 'farmers often need far fewer pesticides than they would in outdoor agriculture', 'pesticides', ['soil', 'workers', 'machines'], 'far fewer pesticides', 'less need for', 'ยาฆ่าแมลง', 'less need for = need far fewer. คำหลอกคือ pests เพราะเป็นสาเหตุ แต่ช่องว่างต้องเป็นสิ่งที่ใช้น้อยลงคือ pesticides.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q37', 37, 'Farms near city consumers can reduce 37 ____.', 'there is less need for long-distance transport from rural farms to city supermarkets', 'transport', ['distance', 'costs', 'waste'], 'less need for long-distance transport', 'reduce', 'การขนส่ง', 'reduce ในโจทย์ถูก paraphrase เป็น less need for และคำตอบคือ transport.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q38', 38, 'The system uses a lot of 38 ____.', 'the amount of electricity needed for lighting, heating, cooling and computer control systems', 'electricity', ['lighting', 'energy', 'equipment'], 'electricity needed', 'uses a lot of', 'ไฟฟ้า', 'uses a lot of ถูกพูดเป็น amount of electricity needed. lighting/heating/cooling เป็นตัวอย่างการใช้ไฟ ไม่ใช่คำตอบรวม.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q39', 39, 'Crops such as 39 ____ are difficult to produce profitably.', 'crops such as wheat are much harder to produce profitably', 'wheat', ['lettuce', 'vegetables', 'rice'], 'crops such as wheat', 'crops such as', 'ข้าวสาลี', 'คำหลอกคือ lettuce เพราะ works well แต่หลัง but พาไปคำตอบจริงคือ wheat ซึ่ง produce profitably ยากกว่า.'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q40', 40, 'Farms need reliable 40 ____ with buyers.', 'vertical farms need reliable contracts with supermarkets, restaurants or other buyers', 'contracts', ['markets', 'customers', 'prices'], 'reliable contracts with buyers', 'reliable with buyers', 'สัญญา', 'need reliable ... with buyers ตรงกับ reliable contracts with supermarkets/restaurants/buyers จึงตอบ contracts.')
    ]
  },
  {
    id: 'advanced-listening-sleep-university-life-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Sleep and University Life',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-sleep-university-life-part-3',
    audioscript: SLEEP_UNIVERSITY_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q21', 21, 'Which TWO factors do the students both believe are major causes of poor sleep among university students?', 'Screen use seems much more significant. Students work on laptops, message friends, and watch videos late at night. Yes, and the light from screens can delay sleep.', 'A', sleepCauseOptions, 'Screen use seems much more significant', 'late-night screen use', 'ใช้หน้าจอตอนดึก', 'both believe เห็นจาก Dana ตอบ Yes หลัง Sam พูด screen use. คำหลอกคือ noisy accommodation เพราะ studies did not treat it as major.', sleepCauseQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q22', 22, 'Which TWO factors do the students both believe are major causes of poor sleep among university students?', 'Students who work evening shifts often get home late and then still have assignments to finish. I agree.', 'C', sleepCauseOptions, 'work evening shifts', 'part-time employment', 'งานพาร์ตไทม์', 'part-time employment ถูก paraphrase เป็น work evening shifts. I agree เป็น consensus marker ว่าทั้งคู่เห็นด้วย.', sleepCauseQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q23', 23, 'Which TWO effects of poor sleep do the students agree are supported by strong evidence?', 'students who slept badly found it harder to focus in seminars and lectures', 'A', sleepEffectOptions, 'harder to focus', 'reduced concentration', 'สมาธิลดลง', 'harder to focus = reduced concentration. คำหลอกคือ creativity เพราะ Sam บอก claim นั้น doubtful.', sleepEffectQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q24', 24, 'Which TWO effects of poor sleep do the students agree are supported by strong evidence?', 'The stronger evidence is about memory. Sleep seems to help students process and store what they\'ve learned.', 'C', sleepEffectOptions, 'stronger evidence is about memory', 'poorer memory', 'ความจำแย่ลง', 'stronger evidence เป็น key phrase ตรงกับ supported by strong evidence และ memory ตรงกับ poorer memory.', sleepEffectQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q25', 25, 'Which TWO opinions do the students both express about sleep-tracking apps?', 'they might make some people anxious. If students keep checking their sleep score every morning, they may become stressed about it. I thought the same.', 'A', sleepAppOptions, 'make some people anxious', 'may make users anxious', 'ทำให้ผู้ใช้กังวล', 'I thought the same แสดงว่าทั้งคู่เห็นด้วย. anxious/stressed ตรงกับ users anxious.', sleepAppQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q26', 26, 'Which TWO opinions do the students both express about sleep-tracking apps?', 'more independent research is needed. A lot of the evidence comes from the companies that make the apps. Yes, that\'s a really important point.', 'E', sleepAppOptions, 'more independent research is needed', 'need more independent research', 'ต้องมีงานวิจัยอิสระเพิ่ม', 'ข้อความตรงมาก: more independent research is needed. คำหลอกคือ cost เพราะ Dana บอก cost is not the main issue.', sleepAppQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q27', 27, 'When discussing the term "sleep hygiene", the students decide to', 'We could define it first, then give examples like having a regular bedtime and avoiding screens late at night. That makes sense.', 'B', [
        { key: 'A', text: 'avoid it because it sounds too technical.' },
        { key: 'B', text: 'define it before giving examples.' },
        { key: 'C', text: 'use it only at the end of the presentation.' }
      ], 'define it first, then give examples', 'define it before giving examples', 'นิยามก่อนแล้วยกตัวอย่าง', 'คำหลอกคือ it sounds strange แต่หลัง True, but พาไปคำตอบจริง: define it first, then give examples.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q28', 28, 'Why do the students decide to start with a personal example?', 'Most students will recognise that situation, even if they don\'t talk about it.', 'A', [
        { key: 'A', text: 'to make the topic relatable for students' },
        { key: 'B', text: 'to show that sleep problems affect grades' },
        { key: 'C', text: 'to criticise university accommodation' }
      ], 'Most students will recognise that situation', 'make the topic relatable', 'ทำให้หัวข้อใกล้ตัวนักศึกษา', 'recognise that situation = relatable. คำหลอกคือ grades/accommodation เพราะไม่ได้เป็นเหตุผลในการเริ่มด้วย personal example.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q29', 29, 'The students agree that daytime naps are useful only if', 'short naps can help, but long ones can make it harder to sleep at night. So the key point is that naps are useful only if they aren\'t too long.', 'A', [
        { key: 'A', text: 'they are not too long.' },
        { key: 'B', text: 'they happen in the evening.' },
        { key: 'C', text: 'they replace a full night\'s sleep.' }
      ], 'aren\'t too long', 'not too long', 'ไม่ยาวเกินไป', 'คำว่า but หลัง short naps can help ตัด long naps ออก และสรุปตรงว่า only if they aren\'t too long.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q30', 30, 'What surprises the students about university advice on sleep?', 'The health centre says one thing, academic departments say another, and accommodation teams send different information again. Yes, it\'s not coordinated.', 'A', [
        { key: 'A', text: 'It is not coordinated across departments.' },
        { key: 'B', text: 'It focuses too much on diet.' },
        { key: 'C', text: 'It is based on old research.' }
      ], 'not coordinated', 'not coordinated across departments', 'ไม่ประสานกันระหว่างหน่วยงาน', 'ตัวอย่าง health centre / academic departments / accommodation teams ชี้ว่า advice มาจากหลายฝ่าย และ Sam สรุปว่า not coordinated.')
    ]
  },
  {
    id: 'advanced-listening-seed-banks-crop-diversity-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Seed Banks and Crop Diversity',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-seed-banks-crop-diversity-part-4',
    audioscript: SEED_BANKS_PART4_SCRIPT,
    questions: [
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q31', 31, 'Seed banks help protect agricultural 31 ____.', 'One of its main purposes is to protect agricultural diversity', 'diversity', ['seeds', 'crops', 'farming'], 'protect agricultural diversity', 'protect agricultural', 'ความหลากหลาย', 'โจทย์และสคริปต์ตรงกัน: protect agricultural diversity.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q32', 32, 'Older local 32 ____ may disappear when farmers use commercial crops.', 'farmers grew many local varieties ... when farmers change to commercial crops, these older varieties may disappear', 'varieties', ['seeds', 'plants', 'species'], 'older varieties may disappear', 'older local may disappear', 'สายพันธุ์ท้องถิ่น', 'older local ในโจทย์ถูกพูดเป็น local varieties และ these older varieties may disappear.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q33', 33, 'Seeds are dried to remove 33 ____.', 'seeds are cleaned and dried to remove moisture', 'moisture', ['water', 'dust', 'insects'], 'dried to remove moisture', 'dried to remove', 'ความชื้น', 'dried to remove ในโจทย์ตรงกับสคริปต์ และคำตอบคือ moisture.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q34', 34, 'Most seeds are kept at a low 34 ____.', 'most seeds are kept at a low temperature', 'temperature', ['level', 'humidity', 'pressure'], 'low temperature', 'kept at a low', 'อุณหภูมิ', 'kept at a low ตรงกับ low temperature จึงตอบ temperature.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q35', 35, 'Each sample is sealed in special 35 ____.', 'Each seed sample is placed in sealed containers', 'containers', ['bags', 'rooms', 'boxes'], 'sealed containers', 'sealed in special', 'ภาชนะบรรจุ', 'sealed ในโจทย์ตรงกับ sealed containers. special เป็น paraphrase ของภาชนะที่ protect seeds.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q36', 36, 'Collections can help when crops are damaged by 36 ____.', 'If a crop is damaged by disease, researchers can search stored collections', 'disease', ['drought', 'floods', 'insects'], 'crop is damaged by disease', 'crops are damaged by', 'โรค', 'collections ในโจทย์ตรงกับ stored collections และ damaged by disease คือคำตอบ.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q37', 37, 'Scientists use samples to develop drought 37 ____.', 'Plant breeders also use seed banks to develop crops with greater resistance to drought', 'resistance', ['protection', 'tolerance', 'diversity'], 'greater resistance to drought', 'develop drought', 'ความต้านทาน', 'develop drought resistance เป็น noun phrase จากสคริปต์ greater resistance to drought.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q38', 38, 'Farmers may need replacement seeds after 38 ____.', 'support farmers after extreme events such as floods, when stored seed for the next planting season may have been destroyed', 'floods', ['storms', 'disease', 'fires'], 'after extreme events such as floods', 'after', 'น้ำท่วม', 'after ในโจทย์ตรงกับ after extreme events such as floods. replacement seeds ถูก paraphrase จาก stored seed destroyed.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q39', 39, 'Some seeds cannot survive 39 ____.', 'Some seeds are difficult to store because they cannot survive drying', 'drying', ['storage', 'testing', 'freezing'], 'cannot survive drying', 'cannot survive', 'การทำให้แห้ง', 'cannot survive ในโจทย์ตามด้วย drying ในสคริปต์. คำหลอกคือ storage เพราะเป็นหัวข้อใหญ่ ไม่ใช่สิ่งที่เมล็ดบางชนิดทนไม่ได้.'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q40', 40, 'Seeds need regular 40 ____ to check whether they can still grow.', 'Banks must carry out regular testing to check whether samples can still germinate', 'testing', ['collection', 'drying', 'cataloguing'], 'regular testing', 'regular to check', 'การทดสอบ', 'regular testing ตรงกับโจทย์ และ can still grow ถูก paraphrase เป็น can still germinate.')
    ]
  }
]
