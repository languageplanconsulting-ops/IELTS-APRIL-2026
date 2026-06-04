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

const q = (
  prompt: string,
  answer: string,
  evidence: string,
  meta?: Partial<IntensiveQuestionSpec>
): IntensiveQuestionSpec => ({ prompt, answer, evidence, ...meta })

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

// Stages 8–12: see journeyIntensivePassages8to12.ts (Cambridge 14–15 from ieltstrainingonline.com)

export const INTENSIVE_LAYOUTS_STAGE_7_9: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  7: [stage7Passage1, stage7Passage2]
}
