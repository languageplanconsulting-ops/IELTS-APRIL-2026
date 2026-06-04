/**
 * Normal Reading Journey ด่าน 14 — Cambridge-style mixed format.
 * Passage 1: 7 TFNG + 7 fill (Q1–14) | Passage 2: 7 headings + 3 TFNG + 3 fill (Q15–27 after remap)
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

const stage14Passage1: IntensivePassageLayout = {
  title: 'The Economics of Happiness',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'For most of recorded history, the primary measure of a nation\'s prosperity has been the size of its economy — the total output of goods and services it produces each year, expressed as gross domestic product. GDP remains the dominant metric in government reports, international comparisons, and financial news, yet its limitations as a measure of human wellbeing have been recognised since its invention. Simon Kuznets, the economist who developed the national accounts system on which GDP is based, warned the US Congress as early as 1934 that \'the welfare of a nation can scarcely be inferred from a measurement of national income.\' Despite this caveat, GDP became the global standard, and for decades the policy question \'how do we improve the economy?\' was treated as synonymous with \'how do we improve people\'s lives?\'' ],
    ['B', 'The divergence between income and wellbeing became increasingly apparent from the 1970s onwards. American economist Richard Easterlin documented what became known as the Easterlin paradox: within a country at any given time, richer people report higher levels of happiness than poorer people, but over time, as countries grow wealthier, average self-reported happiness does not increase. The United States, for example, saw per-capita income roughly triple between 1946 and 1996, but the proportion of Americans describing themselves as \'very happy\' remained stable at approximately 30 percent throughout. Easterlin proposed that happiness is determined not by absolute income but by income relative to the people around you — what economists call reference income — meaning that as everyone gets richer together, the happiness gains cancel out.'],
    ['C', 'The Easterlin paradox has generated significant controversy and a body of contradictory evidence. Economists Betsey Stevenson and Justin Wolfers analysed a much larger dataset of international life satisfaction surveys and concluded that the paradox was a statistical artefact — that there was in fact a consistent positive relationship between income and wellbeing at all levels, with no satiation point at which additional income ceased to improve wellbeing. More recent research using a smartphone application to collect real-time emotional data from over 33,000 adults found that experienced wellbeing continued to rise with income even at very high earnings levels, contradicting earlier studies that had found wellbeing plateauing above approximately 75,000 US dollars per year.'],
    ['D', 'Regardless of the debate about income, researchers broadly agree that several other factors are more strongly associated with self-reported wellbeing than money above a basic threshold. Social connection — the quality and frequency of meaningful relationships — is consistently the strongest predictor of happiness across cultures and age groups. Physical and mental health, autonomy in how one spends one\'s time, a sense of purpose or meaning, and trust in the institutions of one\'s society are also robustly associated with higher wellbeing. The New Economics Foundation has developed a measure of national wellbeing, the Happy Planet Index, that combines self-reported life satisfaction with life expectancy and ecological footprint, producing rankings that diverge sharply from GDP-based comparisons.'],
    ['E', 'Several governments have attempted to move beyond GDP as a policy target. Bhutan famously introduced the concept of Gross National Happiness in the 1970s, incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability alongside conventional economic indicators. New Zealand\'s 2019 Wellbeing Budget allocated funding explicitly to improve outcomes across five priority areas including mental health, child poverty, and ecological sustainability — a departure from the conventional budget framing around economic output. In 2010, the United Kingdom\'s Office for National Statistics began publishing a regular national wellbeing measurement programme that surveys subjective life satisfaction, anxiety, and sense of purpose across the population.'],
    ['F', 'The measurement of national wellbeing faces significant methodological challenges. Self-reported happiness is influenced by cultural norms about what constitutes an appropriate or socially acceptable response to survey questions, making cross-cultural comparisons unreliable. People in countries with high levels of social inequality tend to underreport wellbeing relative to their objective circumstances, while people in highly cohesive societies may overreport it. Adaptation effects — the tendency of individuals to return to a baseline level of happiness after both positive and negative life events — complicate the interpretation of changes over time. And the relationship between measured wellbeing and the policy interventions intended to improve it is indirect and difficult to establish causally.'],
    ['G', 'Despite these measurement difficulties, economists and policymakers increasingly argue that no single indicator should determine national priorities, and that a dashboard approach — tracking GDP alongside measures of health, environment, inequality, and subjective wellbeing — provides a more complete picture of societal progress. Countries with similar levels of GDP per capita can differ substantially in their wellbeing outcomes, suggesting that how income is distributed and what it is spent on matters at least as much as how much is produced. The challenge for governments is to develop measurement frameworks that are rigorous enough to guide policy without becoming so complex that they obscure rather than illuminate the choices that matter most.']
  ],
  tfng: tfng([
    q('The economist who created the system on which GDP is based expressed doubts about its ability to measure national welfare as early as the 1930s.', 'TRUE', 'Simon Kuznets… warned the US Congress as early as 1934 that \'the welfare of a nation can scarcely be inferred from a measurement of national income.\''),
    q('According to the Easterlin paradox, a person living in a wealthier country will always report higher levels of happiness than a person in a poorer country.', 'FALSE', 'within a country at any given time, richer people report higher levels of happiness than poorer people, but over time, as countries grow wealthier, average self-reported happiness does not increase'),
    q('Research collecting real-time emotional data from smartphone users found that wellbeing stopped improving once annual income exceeded 75,000 US dollars.', 'FALSE', 'experienced wellbeing continued to rise with income even at very high earnings levels, contradicting earlier studies that had found wellbeing plateauing above approximately 75,000 US dollars per year'),
    q('Social connection is identified as the single strongest predictor of self-reported happiness across different cultures and age groups.', 'TRUE', 'Social connection — the quality and frequency of meaningful relationships — is consistently the strongest predictor of happiness across cultures and age groups'),
    q('Bhutan\'s Gross National Happiness measure has been formally adopted by the United Nations as an international standard.', 'NOT GIVEN', 'Bhutan famously introduced the concept of Gross National Happiness in the 1970s'),
    q('Cross-cultural comparisons of self-reported happiness are made less reliable because people in different societies respond to wellbeing surveys in culturally influenced ways.', 'TRUE', 'Self-reported happiness is influenced by cultural norms about what constitutes an appropriate or socially acceptable response to survey questions, making cross-cultural comparisons unreliable'),
    q('Countries with the same GDP per capita consistently produce identical wellbeing outcomes for their populations.', 'FALSE', 'Countries with similar levels of GDP per capita can differ substantially in their wellbeing outcomes')
  ]),
  fill: fillBlock('Measuring national wellbeing beyond GDP', [
    q('GDP has long been the primary measure of national ……… , despite early warnings from its creator that it could not adequately capture the welfare of a nation.', 'prosperity', 'the primary measure of a nation\'s prosperity has been the size of its economy'),
    q('Research into the link between rising incomes and happiness identified a surprising ……… — the observation that national happiness does not increase over time even as a country grows wealthier.', 'paradox', 'Richard Easterlin documented what became known as the Easterlin paradox'),
    q('A key concept proposed to explain this is that of ……… income — the idea that happiness depends on one\'s earnings compared to those of others.', 'reference', 'what economists call reference income'),
    q('Researchers broadly agree that social ……… — the quality of personal relationships — is the most reliable predictor of happiness.', 'connection', 'Social connection — the quality and frequency of meaningful relationships — is consistently the strongest predictor of happiness'),
    q('Some countries have moved beyond GDP, developing alternative ……… that include factors such as life satisfaction and ecological sustainability.', 'measures', 'incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability'),
    q('A complicating factor in measuring wellbeing is the tendency of individuals to return to a personal ……… of happiness after major life events.', 'level', 'the tendency of individuals to return to a baseline level of happiness after both positive and negative life events'),
    q('Economists now argue that tracking GDP alongside other ……… provides a more complete picture of how well a society is truly doing.', 'indicators', 'alongside conventional economic indicators')
  ])
}

const signLanguageHeadings = [
  'A vote that silenced generations of signers',
  'Two educators join forces to build a new national tradition',
  'Legal exclusion rooted in a misunderstanding of human ability',
  'A lone researcher overturns decades of professional consensus',
  'An informal system becomes the basis for formal instruction',
  'A groundbreaking manual makes knowledge accessible',
  'Official acceptance reaches across national boundaries',
  'The first known efforts to provide formal learning for deaf individuals',
  'A debate between spoken and signed methods that lasted centuries',
  'Combining two communities\' ways of communicating'
]

const stage14Passage2: IntensivePassageLayout = {
  title: 'The History of Sign Language',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'For most of recorded history, deaf people were considered incapable of being educated. In ancient Greece, the philosopher Aristotle declared that those who could not hear could not be taught, and this view shaped attitudes toward deafness across European cultures for nearly two thousand years. Deaf individuals in medieval Europe were frequently denied legal rights on the grounds that they could not participate in verbal contracts or take spoken oaths. Some were placed under legal guardianship for life, regardless of their intellectual capacity.'],
    ['B', 'The first systematic attempt to educate deaf children occurred in sixteenth-century Spain. Pedro Ponce de León, a Benedictine monk, developed a method for teaching the deaf sons of Spanish nobility to speak, read, and write. His techniques were not published or widely shared during his lifetime, but they established a precedent that education for deaf people was possible. A later Spanish teacher, Juan Pablo Bonet, published a detailed instructional manual in 1620 that included a hand alphabet — one of the earliest documented systems for representing spoken language through finger positions.'],
    ['C', 'The most influential figure in the history of deaf education was Charles-Michel de l\'Épée, a French priest who, in the 1760s, encountered two deaf sisters in Paris who were already communicating through a system of home signs. Rather than attempting to replace their existing system with spoken French, de l\'Épée learned from them and built upon their natural gestures, adding signed representations of French grammatical structures. In 1771, he opened the world\'s first free public school for the deaf. His methodology — combining natural sign with imposed grammatical markers — spread across Europe and eventually to North America.'],
    ['D', 'De l\'Épée\'s approach crossed the Atlantic when an American educator travelled to Europe in 1817 to learn methods for teaching the deaf. He initially approached British oral educators, who refused to share their techniques. He then studied under Laurent Clerc, one of de l\'Épée\'s most accomplished graduates, who agreed to travel to America with him. Together they founded the American School for the Deaf in Hartford, Connecticut. The sign language used at that school, a fusion of French Sign Language and the home signs already used by the deaf community on Martha\'s Vineyard, became the foundation for what is now known as American Sign Language.'],
    ['E', 'Despite this progress, the late nineteenth century brought a significant setback. The Second International Congress on Education of the Deaf, held in Milan in 1880, passed a resolution declaring that spoken language was superior to sign and that oral methods should replace signing in all deaf education. The vote was almost entirely cast by hearing educators; deaf teachers were not permitted to vote. The resolution had an immediate effect: sign language was banned in most schools across Europe and North America. Many deaf teachers lost their positions. The consequences persisted for decades, and the Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions in the history of deaf education.'],
    ['F', 'The academic rehabilitation of sign language began in the 1960s, when an American linguist published research demonstrating that American Sign Language was not a simplified gestural code but a complete, independent language with its own phonology, morphology, and syntax. His work was initially met with hostility by much of the deaf education establishment, which had long promoted oralism. Over the following decades, however, his findings were replicated and expanded by other researchers, and sign languages around the world — including British Sign Language, Auslan, and Langue des Signes Française — were recognised as fully developed linguistic systems.'],
    ['G', 'The legal and cultural status of sign language has continued to evolve. New Zealand became the first country in the world to grant official recognition to its national sign language in 2006, acknowledging it as one of three official languages of the country. Several European nations, including Germany and Sweden, have since followed. In the United Kingdom, British Sign Language was granted official recognition by the government in 2022 after years of campaigning by the deaf community. International research now suggests that bilingual education — combining sign language with the written form of the national spoken language — produces better literacy and academic outcomes for deaf children than oral-only approaches.']
  ],
  headings: headingBlock(signLanguageHeadings, [
    q('Paragraph A', 'iii', 'deaf people were considered incapable of being educated… placed under legal guardianship for life, regardless of their intellectual capacity'),
    q('Paragraph B', 'viii', 'The first systematic attempt to educate deaf children occurred in sixteenth-century Spain'),
    q('Paragraph C', 'v', 'encountered two deaf sisters… already communicating through a system of home signs… built upon their natural gestures… opened the world\'s first free public school for the deaf'),
    q('Paragraph D', 'x', 'a fusion of French Sign Language and the home signs already used by the deaf community on Martha\'s Vineyard'),
    q('Paragraph E', 'i', 'sign language was banned in most schools… Many deaf teachers lost their positions… one of the most damaging decisions in the history of deaf education'),
    q('Paragraph F', 'iv', 'an American linguist published research… His work was initially met with hostility… his findings were replicated and expanded by other researchers'),
    q('Paragraph G', 'vii', 'New Zealand became the first country… Several European nations… British Sign Language was granted official recognition by the government in 2022')
  ]),
  tfng: tfngP2([
    q('De l\'Épée replaced the signing system used by the two sisters he met with a completely new French-based method.', 'FALSE', 'Rather than attempting to replace their existing system… de l\'Épée learned from them and built upon their natural gestures'),
    q('The American educator who brought sign language to the United States was refused assistance by British educators before seeking help from a French-trained teacher.', 'TRUE', 'He initially approached British oral educators, who refused to share their techniques. He then studied under Laurent Clerc'),
    q('The resolution passed at the Milan Congress in 1880 was later formally reversed by a subsequent international conference.', 'NOT GIVEN', 'the Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions in the history of deaf education')
  ]),
  fill: fillBlock('The rise, suppression and recognition of sign language', [
    q('For most of European history, deaf people were denied fundamental ……… on the grounds that they could not use spoken language.', 'rights', 'Deaf individuals in medieval Europe were frequently denied legal rights'),
    q('Education became possible following efforts by individual teachers, and sign language developed as a legitimate means of instruction until the Milan ……… of 1880 banned its use in schools.', 'resolution', 'the Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions'),
    q('The academic standing of sign language was restored through research that proved it possessed the full characteristics of a genuine ……… .', 'language', 'American Sign Language was not a simplified gestural code but a complete, independent language with its own phonology, morphology, and syntax')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_14: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  14: [stage14Passage1, stage14Passage2]
}
