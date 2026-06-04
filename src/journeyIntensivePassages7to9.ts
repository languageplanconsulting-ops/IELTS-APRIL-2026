/**
 * Normal Reading Journey ด่าน 7–9 — Cambridge-style mixed format.
 * Passage 1: 8 fill + 5 TFNG (Q1–13) | Passage 2: 4 matching + 6 fill + 3 matching info (Q15–27 after remap)
 */
import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const tfng = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE or NOT GIVEN.',
  items
})

const tfngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE or NOT GIVEN.',
  items
})

const fillBlock = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
  summaryTitle,
  items
})

const headingBlock = (options: string[], items: IntensiveQuestionSpec[]) => ({
  instruction: 'Choose the correct heading for each paragraph from the list below.',
  options,
  items
})

const q = (
  prompt: string,
  answer: string,
  evidence: string,
  meta?: Partial<IntensiveQuestionSpec>
): IntensiveQuestionSpec => ({ prompt, answer, evidence, ...meta })

const P1_ORDER = ['tfng', 'fill'] as const
const P2_ORDER = ['headings', 'tfng', 'fill'] as const

const fillBlockTwoWords = (summaryTitle: string, items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
  summaryTitle,
  items
})

const matchingResearchers = (people: string[], items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Look at the following ideas and the list of researchers below. Match each idea with the correct researcher, A, B or C.',
  people,
  items
})

const matchingInfoAF = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Reading Passage 2 has six paragraphs, A–F. Which paragraph contains the following information? Write the correct letter, A–F.',
  items
})

const P1_CAM13_T3_ORDER = ['fill', 'tfng'] as const
const P2_CAM13_T3_ORDER = ['matchingPeople', 'fill', 'matchingInfo'] as const

// ─── Stage 7: Cambridge 13 Test 3 — Coconut Palm + Baby Talk ─────────────────

const stage7Passage1: IntensivePassageLayout = {
  title: 'The Coconut Palm',
  sectionOrder: [...P1_CAM13_T3_ORDER],
  paragraphs: [
    ['A', 'For millennia, the coconut has been central to the lives of Polynesian and Asian peoples. In the western world, on the other hand, coconuts have always been exotic and unusual, sometimes rare. The Italian merchant traveller Marco Polo apparently saw coconuts in South Asia in the late 13th century, and among the mid-14th-century travel writings of Sir John Mandeville there is mention of \'great Notes of Ynde\' (great Nuts of India). Today, images of palm-fringed tropical beaches are clichés in the west to sell holidays, chocolate bars, fizzy drinks and even romance. Typically, we envisage coconuts as brown cannonballs that, when opened, provide sweet white flesh. But we see only part of the fruit and none of the plant from which they come.'],
    ['B', 'The coconut palm has a smooth, slender, grey trunk, up to 30 metres tall. This is an important source of timber for building houses, and is increasingly being used as a replacement for endangered hardwoods in the furniture construction industry. The trunk is surmounted by a rosette of leaves, each of which may be up to six metres long. The leaves have hard veins in their centres which, in many parts of the world, are used as brushes after the green part of the leaf has been stripped away. Immature coconut flowers are tightly clustered together among the leaves at the top of the trunk. The flower stems may be tapped for their sap to produce a drink, and the sap can also be reduced by boiling to produce a type of sugar used for cooking. Coconut palms produce as many as seventy fruits per year, weighing more than a kilogram each. The wall of the fruit has three layers: a waterproof outer layer, a fibrous middle layer and a hard, inner layer. The thick fibrous middle layer produces coconut fibre, \'coir\', which has numerous uses and is particularly important in manufacturing ropes. The woody innermost layer, the shell, with its three prominent \'eyes\', surrounds the seed.'],
    ['C', 'An important product obtained from the shell is charcoal, which is widely used in various industries as well as in the home as a cooking fuel. When broken in half, the shells are also used as bowls in many parts of Asia. Inside the shell are the nutrients (endosperm) needed by the developing seed. Initially, the endosperm is a sweetish liquid, coconut water, which is enjoyed as a drink, but also provides the hormones which encourage other plants to grow more rapidly and produce higher yields. As the fruit matures, the coconut water gradually solidifies to form the brilliant white, fat-rich, edible flesh or meat. Dried coconut flesh, \'copra\', is made into coconut oil and coconut milk, which are widely used in cooking in different parts of the world, as well as in cosmetics.'],
    ['D', 'A derivative of coconut fat, glycerine, acquired strategic importance in a quite different sphere, as Alfred Nobel introduced the world to his nitroglycerine-based invention: dynamite. Their biology would appear to make coconuts the great maritime voyagers and coastal colonizers of the plant world. The large, energy-rich fruits are able to float in water and tolerate salt, but cannot remain viable indefinitely; studies suggest after about 110 days at sea they are no longer able to germinate. Literally cast onto desert island shores, with little more than sand to grow in and exposed to the full glare of the tropical sun, coconut seeds are able to germinate and root. The air pocket in the seed, created as the endosperm solidifies, protects the embryo. In addition, the fibrous fruit wall that helped it to float during the voyage stores moisture that can be taken up by the roots of the coconut seedling as it starts to grow.'],
    ['E', 'There have been centuries of academic debate over the origins of the coconut. There were no coconut palms in West Africa, the Caribbean or the east coast of the Americas before the voyages of the European explorers Vasco da Gama and Columbus in the late 15th and early 16th centuries. Sixteenth-century trade and human migration patterns reveal that Arab traders and European sailors are likely to have moved coconuts from South and Southeast Asia to Africa and then across the Atlantic to the east coast of America. But the origin of coconuts discovered along the west coast of America by 16th-century sailors has been the subject of centuries of discussion. Two diametrically opposed origins have been proposed: that they came from Asia, or that they were native to America. In Asia, there is a large degree of coconut diversity and evidence of millennia of human use – but there are no relatives growing in the wild. In America, there are close coconut relatives, but no evidence that coconuts are indigenous. These problems have led to the intriguing suggestion that coconuts originated on coral islands in the Pacific and were dispersed from there.']
  ],
  fill: {
    instruction: 'Complete the table below. Choose ONE WORD ONLY from the passage for each answer.',
    summaryTitle: 'The uses of the coconut palm',
    items: [
      q('Coconut palm trunk — timber for houses and the making of …', 'furniture', 'This is an important source of timber for building houses, and is increasingly being used as a replacement for endangered hardwoods in the furniture construction industry'),
      q('Coconut palm flowers — sap used as a drink or source of …', 'sugar', 'The flower stems may be tapped for their sap to produce a drink, and the sap can also be reduced by boiling to produce a type of sugar used for cooking'),
      q('Fruit middle layer (coir fibres) — used for …', 'ropes', 'The thick fibrous middle layer produces coconut fibre, \'coir\', which has numerous uses and is particularly important in manufacturing ropes'),
      q('Fruit inner layer (shell) — a source of …', 'charcoal', 'An important product obtained from the shell is charcoal, which is widely used in various industries as well as in the home as a cooking fuel'),
      q('Fruit inner layer (shell) — when halved, used for …', 'bowls', 'When broken in half, the shells are also used as bowls in many parts of Asia'),
      q('Coconut water — a source of … for other plants', 'hormones', 'Initially, the endosperm is a sweetish liquid, coconut water, which is enjoyed as a drink, but also provides the hormones which encourage other plants to grow more rapidly and produce higher yields'),
      q('Coconut flesh — oil and milk for cooking and …', 'cosmetics', 'Dried coconut flesh, \'copra\', is made into coconut oil and coconut milk, which are widely used in cooking in different parts of the world, as well as in cosmetics'),
      q('Coconut flesh — glycerine (an ingredient in …)', 'dynamite', 'A derivative of coconut fat, glycerine, acquired strategic importance in a quite different sphere, as Alfred Nobel introduced the world to his nitroglycerine-based invention: dynamite')
    ]
  },
  tfng: tfng([
    q('Coconut seeds need shade in order to germinate.', 'FALSE', 'Literally cast onto desert island shores, with little more than sand to grow in and exposed to the full glare of the tropical sun, coconut seeds are able to germinate and root'),
    q('Coconuts were probably transported to Asia from America in the 16th century.', 'FALSE', 'Sixteenth-century trade and human migration patterns reveal that Arab traders and European sailors are likely to have moved coconuts from South and Southeast Asia to Africa and then across the Atlantic to the east coast of America'),
    q('Coconuts found on the west coast of America were a different type from those found on the east coast.', 'NOT GIVEN', 'But the origin of coconuts discovered along the west coast of America by 16th-century sailors has been the subject of centuries of discussion'),
    q('All the coconuts found in Asia are cultivated varieties.', 'TRUE', 'In Asia, there is a large degree of coconut diversity and evidence of millennia of human use – but there are no relatives growing in the wild'),
    q('Coconuts are cultivated in different ways in America and the Pacific.', 'NOT GIVEN', 'These problems have led to the intriguing suggestion that coconuts originated on coral islands in the Pacific and were dispersed from there')
  ])
}

const stage7Passage2: IntensivePassageLayout = {
  title: 'How Baby Talk Gives Infant Brains a Boost',
  sectionOrder: [...P2_CAM13_T3_ORDER],
  paragraphs: [
    ['A', 'The typical way of talking to a baby – high-pitched, exaggerated and repetitious – is a source of fascination for linguists who hope to understand how \'baby talk\' impacts on learning. Most babies start developing their hearing while still in the womb, prompting some hopeful parents to play classical music to their pregnant bellies. Some research even suggests that infants are listening to adult speech as early as 10 weeks before being born, gathering the basic building blocks of their family\'s native tongue.'],
    ['B', 'Early language exposure seems to have benefits to the brain – for instance, studies suggest that babies raised in bilingual homes are better at learning how to mentally prioritize information. So how does the sweet if sometimes absurd sound of infant-directed speech influence a baby\'s development? Here are some recent studies that explore the science behind baby talk.'],
    ['C', 'Fathers don\'t use baby talk as often or in the same ways as mothers – and that\'s perfectly OK, according to a new study. Mark VanDam of Washington State University at Spokane and colleagues equipped parents with recording devices and speech-recognition software to study the way they interacted with their youngsters during a normal day. \'We found that moms do exactly what you\'d expect and what\'s been described many times over,\' VanDam explains. \'But we found that dads aren\'t doing the same thing. Dads didn\'t raise their pitch or fundamental frequency when they talked to kids.\' Their role may be rooted in what is called the bridge hypothesis, which dates back to 1975. It suggests that fathers use less familial language to provide their children with a bridge to the kind of speech they\'ll hear in public. \'The idea is that a kid gets to practice a certain kind of speech with mom and another kind of speech with dad, so the kid then has a wider repertoire of kinds of speech to practice,\' says VanDam.'],
    ['D', 'Scientists from the University of Washington and the University of Connecticut collected thousands of 30-second conversations between parents and their babies, fitting 26 children with audio-recording vests that captured language and sound during a typical eight-hour day. The study found that the more baby talk parents used, the more their youngsters began to babble. And when researchers saw the same babies at age two, they found that frequent baby talk had dramatically boosted vocabulary, regardless of socioeconomic status. \'Those children who listened to a lot of baby talk were talking more than the babies that listened to more adult talk or standard speech,\' says Nairán Ramirez-Esparza of the University of Connecticut. \'We also found that it really matters whether you use baby talk in a one-on-one context,\' she adds. \'The more parents use baby talk one-on-one, the more babies babble, and the more they babble, the more words they produce later in life.\''],
    ['E', 'Another study suggests that parents might want to pair their youngsters up so they can babble more with their own kind. Researchers from McGill University and Université du Québec à Montréal found that babies seem to like listening to each other rather than to adults – which may be why baby talk is such a universal tool among parents. They played repeating vowel sounds made by a special synthesizing device that mimicked sounds made by either an adult woman or another baby. This way, only the impact of the auditory cues was observed. The team then measured how long each type of sound held the infants\' attention. They found that the \'infant\' sounds held babies\' attention nearly 40 percent longer. The baby noises also induced more reactions in the listening infants, like smiling or lip moving, which approximates sound making. The team theorizes that this attraction to other infant sounds could help launch the learning process that leads to speech. \'It may be some property of the sound that is just drawing their attention,\' says study co-author Linda Polka. \'Or maybe they are really interested in that particular type of sound because they are starting to focus on their own ability to make sounds. We are speculating here but it might catch their attention because they recognize it as a sound they could possibly make.\''],
    ['F', 'In a study published in Proceedings of the National Academy of Sciences, a total of 57 babies from two slightly different age groups – seven months and eleven and a half months – were played a number of syllables from both their native language (English) and a non-native tongue (Spanish). The infants were placed in a brain-activation scanner that recorded activity in a brain region known to guide the motor movements that produce speech. The results suggest that listening to baby talk prompts infant brains to start practicing their language skills. \'Finding activation in the motor areas of the brain when infants are simply listening is significant, because it means the baby brain is engaged in trying to talk back right from the start, and suggests that seven-month-olds\' brains are already trying to figure out how to make the right movements that will produce words,\' says co-author Patricia Kuhl. Another interesting finding was that while the seven-month-olds responded to all speech sounds regardless of language, the brains of the older infants worked harder at the motor activations of non-native sounds compared to native sounds. The study may have also uncovered a process by which babies recognize differences between their native language and other tongues.']
  ],
  matchingPeople: matchingResearchers(
    ['A Mark VanDam', 'B Nairán Ramirez-Esparza', 'C Patricia Kuhl'],
    [
      q('The importance of adults giving babies individual attention when talking to them', 'B', 'We also found that it really matters whether you use baby talk in a one-on-one context'),
      q('The connection between what babies hear and their own efforts to create speech', 'C', 'Finding activation in the motor areas of the brain when infants are simply listening is significant, because it means the baby brain is engaged in trying to talk back right from the start'),
      q('The advantage for the baby of having two parents each speaking in a different way', 'A', 'The idea is that a kid gets to practice a certain kind of speech with mom and another kind of speech with dad, so the kid then has a wider repertoire of kinds of speech to practice'),
      q('The connection between the amount of baby talk babies hear and how much vocalising they do themselves', 'B', 'The study found that the more baby talk parents used, the more their youngsters began to babble')
    ]
  ),
  fill: fillBlockTwoWords('Research into how parents talk to babies', [
    q('Researchers at Washington State University used …, together with specialised computer programs, to analyse how parents interacted with their babies during a normal day.', 'recording devices', 'Mark VanDam of Washington State University at Spokane and colleagues equipped parents with recording devices and speech-recognition software to study the way they interacted with their youngsters during a normal day'),
    q('The study revealed that … tended not to modify their ordinary speech patterns when interacting with their babies.', 'fathers', 'But we found that dads aren\'t doing the same thing. Dads didn\'t raise their pitch or fundamental frequency when they talked to kids', { acceptedAnswers: ['dads'] }),
    q('According to an idea known as the …, they may use a more adult type of speech to prepare infants for the language they will hear outside the family home.', 'bridge hypothesis', 'Their role may be rooted in what is called the bridge hypothesis, which dates back to 1975'),
    q('Hearing baby talk from one parent and \'normal\' language from the other expands the baby\'s … of types of speech which they can practise.', 'repertoire', 'The idea is that a kid gets to practice a certain kind of speech with mom and another kind of speech with dad, so the kid then has a wider repertoire of kinds of speech to practice'),
    q('Another study recorded speech and sound using special … that the babies were equipped with.', 'vests', 'fitting 26 children with audio-recording vests that captured language and sound during a typical eight-hour day'),
    q('When the researchers studied the babies again at age two, they found that those who had heard a lot of baby talk in infancy had a much larger … than those who had not.', 'vocabulary', 'And when researchers saw the same babies at age two, they found that frequent baby talk had dramatically boosted vocabulary, regardless of socioeconomic status')
  ]),
  matchingInfo: matchingInfoAF([
    q('A reference to a change which occurs in babies\' brain activity before the end of their first year.', 'F', 'Another interesting finding was that while the seven-month-olds responded to all speech sounds regardless of language, the brains of the older infants worked harder at the motor activations of non-native sounds compared to native sounds'),
    q('An example of what some parents do for their baby\'s benefit before birth', 'A', 'Most babies start developing their hearing while still in the womb, prompting some hopeful parents to play classical music to their pregnant bellies'),
    q('A mention of babies\' preference for the sounds that other babies make', 'E', 'They found that the \'infant\' sounds held babies\' attention nearly 40 percent longer')
  ])
}

const matchingInfoAG = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G.',
  items
})

const P1_CAM13_T4_ORDER = ['tfng', 'fill'] as const
const P2_CAM13_T4_ORDER = ['fill', 'mcq', 'matchingInfo'] as const

const soilEndings = [
  'A may improve the number and quality of plants growing there.',
  'B may contain data from up to nine countries.',
  'C may not be put back into the soil.',
  'D may help governments to be more aware of soil-related issues.',
  'E may cause damage to different aspects of the environment.',
  'F may be better for use at a global level.'
]

// ─── Stage 8: Cambridge 13 Test 4 — Cutty Sark + Saving the Soil ─────────────

const stage8Passage1: IntensivePassageLayout = {
  title: 'Cutty Sark: The Fastest Sailing Ship of All Time',
  sectionOrder: [...P1_CAM13_T4_ORDER],
  paragraphs: [
    ['A', 'The nineteenth century was a period of great technological development in Britain, and for shipping the major changes were from wind to steam power, and from wood to iron and steel. The fastest commercial sailing vessels of all time were clippers, three-masted ships built to transport goods around the world, although some also took passengers. From the 1840s until 1869, when the Suez Canal opened and steam propulsion was replacing sail, clippers dominated world trade. Although many were built, only one has survived more or less intact: Cutty Sark, now on display in Greenwich, southeast London.'],
    ['B', 'Cutty Sark\'s unusual name comes from the poem Tam O\'Shanter by the Scottish poet Robert Burns. Tam, a farmer, is chased by a witch called Nannie, who is wearing a \'cutty sark\' – an old Scottish name for a short nightdress. The witch is depicted in Cutty Sark\'s figurehead – the carving of a woman typically at the front of old sailing ships. In legend, and in Burns\'s poem, witches cannot cross water, so this was a rather strange choice of name for a ship.'],
    ['C', 'Cutty Sark was built in Dumbarton, Scotland, in 1869, for a shipping company owned by John Willis. To carry out construction, Willis chose a new shipbuilding firm, Scott & Linton, and ensured that the contract with them put him in a very strong position. In the end, the firm was forced out of business, and the ship was finished by a competitor. Willis\'s company was active in the tea trade between China and Britain, where speed could bring shipowners both profits and prestige, so Cutty Sark was designed to make the journey more quickly than any other ship.'],
    ['D', 'On her maiden voyage, in 1870, she set sail from London, carrying large amounts of goods to China. She returned laden with tea, making the journey back to London in four months. However, Cutty Sark never lived up to the high expectations of her owner, as a result of bad winds and various misfortunes. On one occasion, in 1872, the ship and a rival clipper, Thermopylae, left port in China on the same day. Crossing the Indian Ocean, Cutty Sark gained a lead of over 400 miles, but then her rudder was severely damaged in stormy seas, making her impossible to steer. The ship\'s crew had the daunting task of repairing the rudder at sea, and only succeeded at the second attempt. Cutty Sark reached London a week after Thermopylae.'],
    ['E', 'Steam ships posed a growing threat to clippers, as their speed and cargo capacity increased. In addition, the opening of the Suez Canal in 1869, the same year that Cutty Sark was launched, had a serious impact. While steam ships could make use of the quick, direct route between the Mediterranean and the Red Sea, the canal was of no use to sailing ships, which needed the much stronger winds of the oceans, and so had to sail a far greater distance. Steam ships reduced the journey time between Britain and China by approximately two months.'],
    ['F', 'By 1878, tea traders weren\'t interested in Cutty Sark, and instead, she took on the much less prestigious work of carrying any cargo between any two ports in the world. In 1880, violence aboard the ship led ultimately to the replacement of the captain with an incompetent drunkard who stole the crew\'s wages. He was suspended from service, and a new captain appointed. This marked a turnaround and the beginning of the most successful period in Cutty Sark\'s working life, transporting wool from Australia to Britain. One such journey took just under 12 weeks, beating every other ship sailing that year by around a month.'],
    ['G', 'The ship\'s next captain, Richard Woodget, was an excellent navigator, who got the best out of both his ship and his crew. As a sailing ship, Cutty Sark depended on the strong trade winds of the southern hemisphere, and Woodget took her further south than any previous captain, bringing her dangerously close to icebergs off the southern tip of South America. His gamble paid off, though, and the ship was the fastest vessel in the wool trade for ten years. As competition from steam ships increased in the 1890s, and Cutty Sark approached the end of her life expectancy, she became less profitable. She was sold to a Portuguese firm, which renamed her Ferreira. For the next 25 years, she again carried miscellaneous cargoes around the world. Badly damaged in a gale in 1922, she was put into Falmouth harbour in southwest England, for repairs. Wilfred Dowman, a retired sea captain who owned a training vessel, recognised her and tried to buy her, but without success. She returned to Portugal and was sold to another Portuguese company. Dowman was determined, however, and offered a high price: this was accepted, and the ship returned to Falmouth the following year and had her original name restored. Dowman used Cutty Sark as a training ship, and she continued in this role after his death. When she was no longer required, in 1954, she was transferred to dry dock at Greenwich to go on public display. The ship suffered from fire in 2007, and again, less seriously, in 2014, but now Cutty Sark attracts a quarter of a million visitors a year.']
  ],
  tfng: tfng([
    q('Clippers were originally intended to be used as passenger ships.', 'FALSE', 'three-masted ships built to transport goods around the world, although some also took passengers'),
    q('Cutty Sark was given the name of a character in a poem.', 'FALSE', 'who is wearing a \'cutty sark\' – an old Scottish name for a short nightdress'),
    q('The contract between John Willis and Scott & Linton favoured Willis.', 'TRUE', 'ensured that the contract with them put him in a very strong position'),
    q('John Willis wanted Cutty Sark to be the fastest tea clipper travelling between the UK and China.', 'TRUE', 'Cutty Sark was designed to make the journey more quickly than any other ship'),
    q('Despite storm damage, Cutty Sark beat Thermopylae back to London.', 'FALSE', 'Cutty Sark reached London a week after Thermopylae'),
    q('The opening of the Suez Canal meant that steam ships could travel between Britain and China faster than clippers.', 'TRUE', 'Steam ships reduced the journey time between Britain and China by approximately two months'),
    q('Steam ships sometimes used the ocean route to travel between London and China.', 'NOT GIVEN', 'the canal was of no use to sailing ships, which needed the much stronger winds of the oceans, and so had to sail a far greater distance'),
    q('Captain Woodget put Cutty Sark at risk of hitting an iceberg.', 'TRUE', 'Woodget took her further south than any previous captain, bringing her dangerously close to icebergs off the southern tip of South America')
  ]),
  fill: {
    instruction: 'Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.',
    summaryTitle: 'Cutty Sark later career',
    items: [
      q('After 1880, Cutty Sark carried … as its main cargo during its most successful time.', 'wool', 'the beginning of the most successful period in Cutty Sark\'s working life, transporting wool from Australia to Britain'),
      q('As a captain and …, Woodget was very skilled.', 'navigator', 'Richard Woodget, was an excellent navigator, who got the best out of both his ship and his crew'),
      q('Ferreira went to Falmouth to repair damage that a … had caused.', 'gale', 'Badly damaged in a gale in 1922, she was put into Falmouth harbour in southwest England, for repairs'),
      q('Between 1923 and 1954, Cutty Sark was used for …', 'training', 'Dowman used Cutty Sark as a training ship, and she continued in this role after his death'),
      q('Cutty Sark has twice been damaged by … in the 21st century.', 'fire', 'The ship suffered from fire in 2007, and again, less seriously, in 2014')
    ]
  }
}

const stage8Passage2: IntensivePassageLayout = {
  title: 'Saving the Soil',
  sectionOrder: [...P2_CAM13_T4_ORDER],
  paragraphs: [
    ['A', 'More than a third of the world\'s soil is endangered, according to a recent UN report. If we don\'t slow the decline, all farmable soil could be gone in 60 years. Since soil grows 95% of our food, and sustains human life in other more surprising ways, that is a huge problem.'],
    ['B', 'Peter Groffman, from the Cary Institute of Ecosystem Studies in New York, points out that soil scientists have been warning about the degradation of the world\'s soil for decades. At the same time, our understanding of its importance to humans has grown. A single gram of healthy soil might contain 100 million bacteria, as well as other microorganisms such as viruses and fungi, living amid decomposing plants and various minerals. That means soils do not just grow our food, but are the source of nearly all our existing antibiotics, and could be our best hope in the fight against antibiotic-resistant bacteria. Soil is also an ally against climate change: as microorganisms within soil digest dead animals and plants, they lock in their carbon content, holding three times the amount of carbon as does the entire atmosphere. Soils also store water, preventing flood damage: in the UK, damage to buildings, roads and bridges from floods caused by soil degradation costs £233 million every year.'],
    ['C', 'If the soil loses its ability to perform these functions, the human race could be in big trouble. The danger is not that the soil will disappear completely, but that the microorganisms that give it its special properties will be lost. And once this has happened, it may take the soil thousands of years to recover. Agriculture is by far the biggest problem. In the wild, when plants grow they remove nutrients from the soil, but then when the plants die and decay these nutrients are returned directly to the soil. Humans tend not to return unused parts of harvested crops directly to the soil to enrich it, meaning that the soil gradually becomes less fertile. In the past we developed strategies to get around the problem, such as regularly varying the types of crops grown, or leaving fields uncultivated for a season.'],
    ['D', 'But these practices became inconvenient as populations grew and agriculture had to be run on more commercial lines. A solution came in the early 20th century with the Haber-Bosch process for manufacturing ammonium nitrate. Farmers have been putting this synthetic fertiliser on their fields ever since. But over the past few decades, it has become clear this wasn\'t such a bright idea. Chemical fertilisers can release polluting nitrous oxide into the atmosphere and excess is often washed away with the rain, releasing nitrogen into rivers. More recently, we have found that indiscriminate use of fertilisers hurts the soil itself, turning it acidic and salty, and degrading the soil they are supposed to nourish.'],
    ['E', 'One of the people looking for a solution to this problem is Pius Floris, who started out running a tree-care business in the Netherlands, and now advises some of the world\'s top soil scientists. He came to realise that the best way to ensure his trees flourished was to take care of the soil, and has developed a cocktail of beneficial bacteria, fungi and humus to do this. Researchers at the University of Valladolid in Spain recently used this cocktail on soils destroyed by years of fertiliser overuse. When they applied Floris\'s mix to the desert-like test plots, a good crop of plants emerged that were not just healthy at the surface, but had roots strong enough to pierce dirt as hard as rock. The few plants that grew in the control plots, fed with traditional fertilisers, were small and weak.'],
    ['F', 'However, measures like this are not enough to solve the global soil degradation problem. To assess our options on a global scale we first need an accurate picture of what types of soil are out there, and the problems they face. That\'s not easy. For one thing, there is no agreed international system for classifying soil. In an attempt to unify the different approaches, the UN has created the Global Soil Map project. Researchers from nine countries are working together to create a map linked to a database that can be fed measurements from field surveys, drone surveys, satellite imagery, lab analyses and so on to provide real-time data on the state of the soil. Within the next four years, they aim to have mapped soils worldwide to a depth of 100 metres, with the results freely accessible to all.'],
    ['G', 'But this is only a first step. We need ways of presenting the problem that bring it home to governments and the wider public, says Pamela Chasek at the International Institute for Sustainable Development, in Winnipeg, Canada. \'Most scientists don\'t speak language that policy-makers can understand, and vice versa.\' Chasek and her colleagues have proposed a goal of \'zero net land degradation\'. Like the idea of carbon neutrality, it is an easily understood target that can help shape expectations and encourage action. For soils on the brink, that may be too late. Several researchers are agitating for the immediate creation of protected zones for endangered soils. One difficulty here is defining what these areas should conserve: areas where the greatest soil diversity is present? Or areas of unspoilt soils that could act as a future benchmark of quality? Whatever we do, if we want our soils to survive, we need to take action now.']
  ],
  fill: fillBlock('Why soil degradation could be a disaster for humans', [
    q('Healthy soil contains a large variety of bacteria and other microorganisms, as well as plant remains and …', 'minerals', 'living amid decomposing plants and various minerals'),
    q('Its function in storing … has a significant effect on the climate.', 'carbon', 'they lock in their carbon content, holding three times the amount of carbon as does the entire atmosphere'),
    q('In addition, it prevents damage to property and infrastructure because it holds …', 'water', 'Soils also store water, preventing flood damage'),
    q('The main factor contributing to soil degradation is the … carried out by humans.', 'agriculture', 'Agriculture is by far the biggest problem')
  ]),
  mcq: {
    instruction: 'Complete each sentence with the correct ending, A–F, below. Write the correct letter, A–F.',
    options: soilEndings,
    items: [
      q('Nutrients contained in the unused parts of harvested crops', 'C', 'Humans tend not to return unused parts of harvested crops directly to the soil to enrich it'),
      q('Synthetic fertilisers produced with the Haber-Bosch process', 'E', 'Chemical fertilisers can release polluting nitrous oxide into the atmosphere and excess is often washed away with the rain, releasing nitrogen into rivers'),
      q('Addition of a mixture developed by Pius Floris to the soil', 'A', 'When they applied Floris\'s mix to the desert-like test plots, a good crop of plants emerged that were not just healthy at the surface, but had roots strong enough to pierce dirt as hard as rock'),
      q('The idea of zero net soil degradation', 'D', 'Chasek and her colleagues have proposed a goal of \'zero net land degradation\'. Like the idea of carbon neutrality, it is an easily understood target that can help shape expectations and encourage action')
    ]
  },
  matchingInfo: matchingInfoAG([
    q('A reference to one person\'s motivation for a soil-improvement project', 'E', 'He came to realise that the best way to ensure his trees flourished was to take care of the soil'),
    q('An explanation of how soil stayed healthy before the development of farming', 'C', 'In the wild, when plants grow they remove nutrients from the soil, but then when the plants die and decay these nutrients are returned directly to the soil'),
    q('Examples of different ways of collecting information on soil degradation', 'F', 'can be fed measurements from field surveys, drone surveys, satellite imagery, lab analyses and so on'),
    q('A suggestion for a way of keeping some types of soil safe in the near future', 'G', 'Several researchers are agitating for the immediate creation of protected zones for endangered soils'),
    q('A reason why it is difficult to provide an overview of soil degradation', 'F', 'For one thing, there is no agreed international system for classifying soil')
  ])
}

// ─── Stage 9: Decision-Making + International Space Station ───────────────────

const stage9Passage1: IntensivePassageLayout = {
  title: 'The Psychology of Decision-Making Under Uncertainty',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Every day, individuals make thousands of decisions under conditions of incomplete information, time pressure, and competing priorities. Classical economic theory long assumed that human decision-makers were essentially rational agents who gathered available information, calculated the expected utility of each possible outcome, and selected the option most likely to maximise their welfare. Decades of psychological research have comprehensively dismantled this model, revealing instead a rich landscape of predictable, systematic biases that cause human judgement to deviate from rational calculation in consistent and often consequential ways.'],
    ['B', 'The foundational research in this field was conducted by Israeli psychologists Daniel Kahneman and Amos Tversky, who collaborated intensively from the late 1960s onwards. Their prospect theory, published in 1979, demonstrated that people do not evaluate outcomes in terms of absolute wealth or wellbeing but in terms of gains and losses relative to a reference point, and that losses are weighted approximately twice as heavily as equivalent gains. This loss aversion — the tendency to feel the pain of a loss more acutely than the pleasure of an equivalent gain — explains a wide range of otherwise puzzling behaviours, from investors holding failing stocks too long in the hope of recovery to patients refusing beneficial but risky medical procedures.'],
    ['C', 'One of the most robust findings in the field concerns the availability heuristic — the tendency to judge the frequency or probability of an event based on how easily examples of it come to mind. Events that are dramatic, recent, or emotionally salient are retrieved from memory with unusual ease, leading people to overestimate their likelihood. After a widely publicised plane crash, people consistently overestimate the danger of air travel relative to car travel, even though the statistical risk profile strongly favours flying. This effect has significant consequences for public policy, insurance markets, and individual risk assessment, because media coverage and personal experience shape perceived probability independently of statistical base rates.'],
    ['D', 'The framing effect describes the phenomenon whereby the same information presented in different ways produces different decisions. People respond differently to a medical treatment described as having a 90% survival rate versus one described as having a 10% mortality rate, despite the fact that these descriptions are mathematically identical. In a classic experiment by Tversky and Kahneman, participants were asked to choose between a public health programme that would "save 200 lives" and one that offered a one-in-three chance of saving 600 lives. A majority chose the certain option. When the same programmes were described in terms of deaths rather than lives saved — 400 people would die versus a one-in-three chance that no one would die — the majority reversed their preference, choosing the gamble. The only thing that changed was the frame.'],
    ['E', 'Anchoring describes the disproportionate influence of the first piece of numerical information encountered on subsequent estimates and judgements. When asked to estimate the percentage of African countries in the United Nations, participants in Tversky and Kahneman\'s experiments gave significantly higher estimates when a randomly generated high number had first been spun on a wheel — even though the wheel\'s outcome was clearly irrelevant to the question. This effect operates in negotiation, salary discussions, legal sentencing, and medical diagnosis: the first number mentioned becomes a cognitive anchor around which subsequent judgements cluster, often failing to adjust sufficiently even when the anchor is known to be arbitrary.'],
    ['F', 'Overconfidence is among the most consistently documented biases in the literature. Studies across multiple countries and domains have found that between 80 and 90 percent of drivers rate themselves as above average in driving ability — a statistical impossibility. Finance professionals, physicians, lawyers, and engineers all show systematic overconfidence in their domain predictions, with confidence levels reliably exceeding accuracy rates. Research by Philip Tetlock across thousands of expert forecasters found that political and economic predictions by domain specialists were, on average, barely more accurate than chance, and that experts who expressed the highest confidence in their forecasts were frequently the least accurate.'],
    ['G', 'Interventions designed to improve human decision-making include training in statistical reasoning, the use of structured decision protocols, and the nudge architecture advocated by Thaler and Sunstein, in which default options are designed to guide people toward choices that align with their long-term interests without restricting their freedom to choose otherwise. Paternalism concerns aside, behavioural interventions have demonstrated measurable benefits in contexts ranging from retirement savings enrolment to organ donation consent rates. Critics argue, however, that the laboratory conditions in which many biases were identified may not translate directly to real-world decision-making, where motivation, experience, and feedback loops can partially correct for systematic errors over time.']
  ],
  tfng: tfng([
    q('Classical economic theory assumed that people make decisions by calculating which option would give them the greatest benefit.', 'TRUE', 'Classical economic theory long assumed that human decision-makers were essentially rational agents who… calculated the expected utility of each possible outcome, and selected the option most likely to maximise their welfare'),
    q('Kahneman and Tversky found that people typically feel a loss of a given amount more intensely than they feel a gain of the same amount.', 'TRUE', 'losses are weighted approximately twice as heavily as equivalent gains'),
    q('Studies have shown that people\'s fear of flying increases in the weeks immediately following a widely reported air accident.', 'NOT GIVEN', 'After a widely publicised plane crash, people consistently overestimate the danger of air travel relative to car travel'),
    q('In Tversky and Kahneman\'s public health experiment, participants changed their preferred option when outcomes were described in terms of fatalities rather than survivors.', 'TRUE', 'When the same programmes were described in terms of deaths rather than lives saved… the majority reversed their preference'),
    q('The anchoring effect only influences numerical judgements when the anchor provided is related to the question being asked.', 'FALSE', 'participants gave significantly higher estimates when a randomly generated high number had first been spun on a wheel — even though the wheel\'s outcome was clearly irrelevant to the question'),
    q('Philip Tetlock\'s research found that expert forecasters who expressed the greatest certainty about their predictions were often among the least reliable.', 'TRUE', 'experts who expressed the highest confidence in their forecasts were frequently the least accurate'),
    q('Nudge architecture has been used in more than fifty countries to improve rates of organ donation.', 'NOT GIVEN', 'behavioural interventions have demonstrated measurable benefits in contexts ranging from retirement savings enrolment to organ donation consent rates')
  ]),
  fill: fillBlock('Biases in human judgement', [
    q('Human decision-making consistently falls short of the rational ideal described in classical economic ……… .', 'model', 'Decades of psychological research have comprehensively dismantled this model'),
    q('A key finding by Kahneman and Tversky, known as prospect ……… , showed that people evaluate outcomes relative to a reference point rather than in absolute terms.', 'theory', 'Their prospect theory, published in 1979'),
    q('The tendency to overestimate how likely dramatic events are because they are easily remembered is called the availability ……… .', 'heuristic', 'the availability heuristic — the tendency to judge the frequency or probability of an event based on how easily examples of it come to mind'),
    q('A related phenomenon, the ……… effect, shows that identical information presented differently can lead to opposite decisions.', 'framing', 'The framing effect describes the phenomenon whereby the same information presented in different ways produces different decisions'),
    q('When a specific number encountered early in a process exerts undue influence on later estimates, this is called ……… .', 'anchoring', 'Anchoring describes the disproportionate influence of the first piece of numerical information encountered on subsequent estimates and judgements'),
    q('Research by Philip ……… found that expert forecasters performed only marginally better than chance when predicting political and economic outcomes.', 'Tetlock', 'Research by Philip Tetlock across thousands of expert forecasters'),
    q('Approaches such as changing default ……… have been used to guide people towards better decisions while preserving their freedom of choice.', 'options', 'default options are designed to guide people toward choices that align with their long-term interests')
  ])
}

const issHeadings = [
  'A partnership maintained despite mounting political tension',
  'The political circumstances that brought rivals into cooperation',
  'An end date announced and commercial alternatives proposed',
  'Competing national ambitions during a period of global rivalry',
  'A record-breaking structure that circles the Earth continuously',
  'Building in orbit one piece at a time',
  'Health data gathered in an environment unlike any on Earth',
  'Research findings with implications for journeys beyond our solar system',
  'A decade of assembly flights carried out by a multinational crew',
  'Advances in science and preparation for longer missions'
]

const stage9Passage2: IntensivePassageLayout = {
  title: 'The Story of the International Space Station',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'The International Space Station is the largest structure ever assembled in orbit. Stretching over 100 metres in length, it orbits the Earth at an altitude of approximately 400 kilometres, completing a full circuit every 90 minutes at a speed of roughly 28,000 kilometres per hour. Its construction required more than 40 assembly flights, the contributions of fifteen nations, and over a decade of work by hundreds of engineers, astronauts, and mission controllers. It has been continuously occupied since November 2000, making it the longest continuously inhabited human outpost beyond the Earth\'s surface.'],
    ['B', 'The origins of the station can be traced to competing ambitions during the Cold War. Both the United States and the Soviet Union recognised that a permanent human presence in orbit would carry significant prestige and potential military advantages. The Soviet Union launched the world\'s first space station, Salyut 1, in 1971, and its subsequent Mir station, launched in 1986, demonstrated that humans could survive in space for months at a time. The United States developed plans for its own station — designated Freedom — in the 1980s, but the project faced repeated budget cuts and design revisions that prevented it from progressing beyond the planning stage.'],
    ['C', 'The collapse of the Soviet Union transformed the geopolitics of space exploration. A newly democratic Russia possessed extraordinary technical expertise in long-duration spaceflight but lacked the financial resources to maintain its programme independently. In 1993, President Clinton\'s administration proposed merging the American Freedom station with the Russian Mir-2 programme into a single collaborative project. The resulting agreement — negotiated in part to provide employment for Russian rocket scientists who might otherwise have sought work in hostile states — became the foundation for the International Space Station. NASA and the Russian space agency Roscosmos became the primary partners, joined subsequently by the European Space Agency, the Japan Aerospace Exploration Agency, and the Canadian Space Agency.'],
    ['D', 'Construction in orbit began in November 1998 with the launch of the Russian-built Zarya module. The American Unity module followed weeks later, docked to Zarya by Space Shuttle astronauts in a series of spacewalks. Over the following years, pressurised laboratories, solar power arrays, truss structures, and habitat modules were added piece by piece. The most technically demanding aspect of construction was the repeated need for astronauts to perform spacewalks lasting six to eight hours in the vacuum of space, handling components the size of buses with robotic arms and their own gloved hands. In total, construction required over 1,000 hours of spacewalks performed by astronauts from multiple nations.'],
    ['E', 'The scientific output of the station has been substantial and varied. Experiments conducted in the microgravity environment of the station have advanced understanding of fluid dynamics, combustion, crystal growth, and the behaviour of biological systems in the absence of gravity. Medical research on long-duration crew members has revealed the physiological effects of extended spaceflight — including bone density loss of up to 1% per month, muscle atrophy, vision impairment, and immune system changes — providing data essential for planning future missions to Mars. The station has also served as a test bed for life support systems, space suits, and other technologies that would be required for deep space exploration.'],
    ['F', 'The political dimensions of the station\'s operation have never been far from the surface. Following Russia\'s annexation of Crimea in 2014, diplomatic relations between the United States and Russia deteriorated sharply, and there were serious discussions about whether the partnership could continue. NASA and Roscosmos ultimately chose to maintain operational cooperation, partly because the two agencies\' systems were so deeply integrated that separation would have been technically catastrophic and partly because the station had become a rare remaining channel of diplomatic contact. The Russian invasion of Ukraine in 2022 intensified these pressures considerably, with several partner nations suspending other forms of space cooperation while continuing to honour their commitments to station operations.'],
    ['G', 'The future of the International Space Station is uncertain. NASA has announced plans to deorbit the station in 2030, guiding it into a controlled re-entry over the Pacific Ocean. Several commercial companies, including Axiom Space, have been contracted to develop successor stations, and NASA intends to transition from operating its own station to purchasing services from these private operators. Whether commercial successors will replicate the international, scientific, and diplomatic functions of the station — or whether they will serve primarily the interests of paying customers — remains an open question that scientists, policymakers, and space enthusiasts continue to debate.']
  ],
  headings: headingBlock(issHeadings, [
    q('Paragraph A', 'v', 'The International Space Station is the largest structure ever assembled in orbit… It has been continuously occupied since November 2000'),
    q('Paragraph B', 'iv', 'Both the United States and the Soviet Union recognised that a permanent human presence in orbit would carry significant prestige and potential military advantages'),
    q('Paragraph C', 'ii', 'The collapse of the Soviet Union transformed the geopolitics of space exploration… became the foundation for the International Space Station'),
    q('Paragraph D', 'vi', 'pressurised laboratories, solar power arrays, truss structures, and habitat modules were added piece by piece'),
    q('Paragraph E', 'x', 'The scientific output of the station has been substantial and varied… providing data essential for planning future missions to Mars'),
    q('Paragraph F', 'i', 'NASA and Roscosmos ultimately chose to maintain operational cooperation… The Russian invasion of Ukraine in 2022 intensified these pressures considerably'),
    q('Paragraph G', 'iii', 'NASA has announced plans to deorbit the station in 2030… Several commercial companies… have been contracted to develop successor stations')
  ]),
  tfng: tfngP2([
    q('The Soviet Union was the first nation to successfully launch a space station into orbit.', 'TRUE', 'The Soviet Union launched the world\'s first space station, Salyut 1, in 1971'),
    q('The agreement to create the International Space Station was partly motivated by concerns about where Russian weapons scientists might find employment.', 'TRUE', 'negotiated in part to provide employment for Russian rocket scientists who might otherwise have sought work in hostile states'),
    q('NASA intends to operate the International Space Station jointly with Axiom Space after 2030.', 'NOT GIVEN', 'NASA intends to transition from operating its own station to purchasing services from these private operators')
  ]),
  fill: fillBlock('Research and cooperation aboard the station', [
    q('Research on astronauts has shown that extended time in space causes significant ……… loss in bones, as well as changes to muscles and vision.', 'density', 'bone density loss of up to 1% per month'),
    q('The station has also functioned as a testing ground for the ……… support systems that any future long-duration mission would require.', 'life', 'The station has also served as a test bed for life support systems'),
    q('Despite tensions following Russia\'s military actions in Ukraine, the operational ……… between NASA and Roscosmos was maintained.', 'cooperation', 'NASA and Roscosmos ultimately chose to maintain operational cooperation')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_7_9: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  7: [stage7Passage1, stage7Passage2],
  8: [stage8Passage1, stage8Passage2],
  9: [stage9Passage1, stage9Passage2]
}
