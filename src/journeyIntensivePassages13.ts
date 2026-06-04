/**
 * Normal Reading Journey ด่าน 13 — Cambridge-style mixed format.
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

const stage13Passage1: IntensivePassageLayout = {
  title: 'The Psychology of Crowds and Mass Behaviour',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'When individuals join a crowd, their behaviour changes in ways that psychologists and sociologists have studied for over a century. Early theories, developed in the late nineteenth century by the French social psychologist Gustave Le Bon, portrayed crowds as fundamentally irrational. Le Bon argued that membership in a crowd caused individuals to lose their personal identity and rational faculties, becoming susceptible to contagion and suggestion, and regressing to a primitive, instinctual state. His work, published in 1895, was enormously influential — read by Sigmund Freud, Benito Mussolini, and Adolf Hitler among others — and shaped public policy on crowd control for decades, treating crowds primarily as dangers to be managed rather than communities to be understood.'],
    ['B', 'The Le Bon model has been largely discredited by modern research. Studies conducted in the second half of the twentieth century, particularly by British social psychologist John Turner and his colleagues, demonstrated that crowd behaviour is governed not by the loss of individual identity but by its transformation. When people join a crowd, they do not abandon their sense of self; rather, they shift from a personal identity to a social identity defined by membership in the group. This shift causes them to act in accordance with the norms, values, and goals of the group rather than their individual preferences. Crowd behaviour is therefore not irrational but guided by a different set of norms from those that govern individual behaviour in ordinary social settings.'],
    ['C', 'Research on crowd psychology during emergencies has challenged the widespread belief that panic is the natural response of crowds to disaster. Studies of real emergency events — including fires, floods, and building evacuations — consistently find that mass panic, defined as selfish, irrational flight that causes people to trample others, is extremely rare. Instead, people in crowd emergencies typically show prosocial behaviour: helping strangers, sharing information, and coordinating movement with those around them. Psychologist John Drury of the University of Sussex has proposed that shared identity in a crowd emergency produces a sense of solidarity that facilitates cooperative rather than competitive responses. Emergency management professionals have begun to incorporate these findings into evacuation planning, moving away from designs that assumed panic and toward designs that leverage social solidarity.'],
    ['D', 'The manipulation of crowds by political actors has been a subject of sustained scholarly interest. Research has established that crowd behaviour can be shaped by the framing of events and the activation of specific social identities. When political leaders emphasise the distinctiveness and superiority of an in-group — an identity defined by shared ethnicity, religion, or ideology — they increase the likelihood that crowd members will perceive out-group members as threats and act aggressively toward them. The 1994 genocide in Rwanda, in which Hutu extremist radio broadcasts explicitly identified Tutsi people as enemies to be eliminated, provides a historical example of how mass media can be used to activate crowd psychology at scale, with catastrophic consequences. Scholars have documented similar mechanisms in the radicalisation of online communities in the twenty-first century.'],
    ['E', 'The physical dynamics of large crowds present safety challenges that are distinct from the psychological ones. At very high densities — above approximately six people per square metre — crowd movement becomes compressive rather than collective: individuals can no longer move independently and are instead carried or crushed by the motion of the crowd as a whole. Crowd safety expert G. Keith Still has documented that most crowd disasters, including those at the Hillsborough stadium in Sheffield in 1989 and the Love Parade festival in Duisburg in 2010, were not caused by panic but by crowd density exceeding safe thresholds in constrained spaces. In both cases, the fatal compression was invisible from outside the crowd and from the perspective of event managers who were monitoring the event from a distance.'],
    ['F', 'Digital platforms have transformed the dynamics of collective behaviour in ways that researchers are still working to understand. Social media enables rapid coordination of crowds — as seen in flash mob events, political protests organised through messaging applications, and the rapid spread of civil unrest across geographic distances. It also enables what researchers call digital crowd behaviour, in which individuals who are physically separated can nonetheless act as a coordinated collective, targeting individuals with harassment campaigns or amplifying misinformation at a scale and speed impossible in physical crowds. The anonymity and reduced social accountability of online environments appear to lower the threshold for behaviours — particularly aggressive and antisocial ones — that would be inhibited by face-to-face social norms.'],
    ['G', 'Predicting crowd behaviour remains one of the hardest problems in social science. The interaction between individual psychology, group dynamics, physical environment, and external stimuli creates a system of sufficient complexity that even sophisticated computational models fail to predict specific events reliably. Event organisers, urban planners, and public safety agencies have increasingly turned to crowd simulation software to model pedestrian flows and identify potential bottlenecks, but these models depend on assumptions about individual behaviour that are frequently violated in the real world. Researchers broadly agree that safer crowds require both better physical design — wider exits, better signage, more gradual density transitions — and better understanding of the social dynamics that govern collective behaviour under stress.']
  ],
  tfng: tfng([
    q('Gustave Le Bon believed that people in crowds became more intelligent and more capable of rational thought than they were as individuals.', 'FALSE', 'membership in a crowd caused individuals to lose their personal identity and rational faculties, becoming susceptible to contagion and suggestion, and regressing to a primitive, instinctual state'),
    q('Research by Turner\'s team suggested that joining a crowd causes people to replace their personal identity with a group-based one rather than abandoning identity altogether.', 'TRUE', 'they do not abandon their sense of self; rather, they shift from a personal identity to a social identity defined by membership in the group'),
    q('Research on crowd emergencies has been adopted as the official basis for evacuation guidelines in the United Kingdom.', 'NOT GIVEN', 'Emergency management professionals have begun to incorporate these findings into evacuation planning'),
    q('Studies of real emergency situations have found that people typically behave cooperatively rather than selfishly when faced with a shared threat.', 'TRUE', 'people in crowd emergencies typically show prosocial behaviour: helping strangers, sharing information, and coordinating movement with those around them'),
    q('The Hillsborough disaster was caused by spectators deliberately pushing forward to see the pitch more clearly.', 'NOT GIVEN', 'most crowd disasters, including those at the Hillsborough stadium… were not caused by panic but by crowd density exceeding safe thresholds in constrained spaces'),
    q('Online environments reduce the social pressure that normally prevents people from behaving aggressively toward others.', 'TRUE', 'The anonymity and reduced social accountability of online environments appear to lower the threshold for behaviours — particularly aggressive and antisocial ones — that would be inhibited by face-to-face social norms'),
    q('Crowd simulation software currently used by event organisers can reliably predict when and where crowd disasters will occur.', 'FALSE', 'these models depend on assumptions about individual behaviour that are frequently violated in the real world')
  ]),
  fill: fillBlock('Understanding crowd behaviour in emergencies and online', [
    q('Later research reframed early crowd theory, arguing that crowd members adopt a shared ……… rather than losing all sense of self.', 'identity', 'they shift from a personal identity to a social identity defined by membership in the group'),
    q('Studies of crowd emergencies have challenged the idea that mass ……… is the typical response to disaster, finding instead that cooperative behaviour is far more common.', 'panic', 'mass panic, defined as selfish, irrational flight that causes people to trample others, is extremely rare'),
    q('Research into the political use of crowd psychology suggests that emphasising in-group ……… can encourage members to see outsiders as threats and act against them.', 'superiority', 'When political leaders emphasise the distinctiveness and superiority of an in-group'),
    q('At high ……… levels — over six people per square metre — individuals lose the ability to move independently and risk being crushed.', 'density', 'crowd density exceeding safe thresholds in constrained spaces'),
    q('Digital platforms have enabled new forms of collective behaviour, including online ……… campaigns targeting individuals.', 'harassment', 'targeting individuals with harassment campaigns or amplifying misinformation'),
    q('Researchers agree that reducing crowd danger requires improvements to physical ……… , including wider exits and clearer signage.', 'design', 'safer crowds require both better physical design — wider exits, better signage, more gradual density transitions'),
    q('Computational ……… used to predict crowd movement depend on assumptions that are frequently wrong in practice.', 'models', 'even sophisticated computational models fail to predict specific events reliably')
  ])
}

const darwinHeadings = [
  'An influential economic text provides the missing piece of a theory',
  'A journey shaped by an unlikely companion and a formative relationship',
  'Public confrontation marks a shift in how the theory is received',
  'An observation that raised a question without immediately answering it',
  'Years of private anxiety finally overcome by a rival\'s independent work',
  'Posthumous recognition from the very institution his ideas had challenged',
  'Unremarkable beginnings and an accidental path toward science',
  'A long period of quiet development followed by a forced publication',
  'A productive final chapter and an honour reflecting scientific greatness',
  'A delayed realisation that a collection of specimens contained a hidden truth'
]

const stage13Passage2: IntensivePassageLayout = {
  title: 'The Life of Charles Darwin',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'Charles Robert Darwin was born in Shrewsbury, England, in February 1809, the fifth of six children of a wealthy physician and financier. His early education was unremarkable: he was considered an indifferent student at school and showed little promise in the subjects his family expected him to master. He began studying medicine at Edinburgh University in 1825 but found the lectures dull and was disturbed by witnessing surgery performed without anaesthetic. He transferred to Christ\'s College, Cambridge, with the intention of becoming a Church of England clergyman — a respectable career for a gentleman of his background — and graduated with a degree in theology in 1831. His real passion during his Cambridge years was natural history, beetles in particular, and his enthusiasm for collecting specimens brought him to the attention of the botany professor John Stevens Henslow.'],
    ['B', 'It was Henslow who recommended Darwin for the position of naturalist aboard HMS Beagle, a Royal Navy survey ship preparing to chart the coastlines of South America. Darwin was twenty-two years old when the Beagle departed from Plymouth in December 1831 on what would become a nearly five-year voyage. His father initially opposed the journey, considering it a waste of time and incompatible with a clerical career; it was his uncle Josiah Wedgwood who persuaded the elder Darwin to relent. The Beagle\'s captain, Robert FitzRoy, was a gifted but volatile man of deeply religious convictions who would later become a fierce opponent of Darwin\'s theory. The two men shared the captain\'s cabin for five years, forming a relationship characterised by mutual respect and profound intellectual disagreement.'],
    ['C', 'The Galapagos Islands, visited in September and October of 1835, were the most conceptually significant stop on the voyage. Darwin collected specimens of birds, tortoises, and plants from multiple islands and noted that the species of mockingbird varied from island to island. At the time he did not fully grasp the implication of this variation — it was only after his return to England, when ornithologist John Gould examined his specimens and identified the famous finches as belonging to thirteen distinct species, that Darwin began to think seriously about the mechanism by which related species diverge. The Galapagos experience did not produce an immediate theoretical breakthrough; rather, it planted a question that took years of reflection to answer.'],
    ['D', 'Back in England, Darwin began constructing his theory methodically. He read the economist Thomas Malthus\'s essay on population in 1838, which argued that populations always tend to grow faster than their food supply, leading to competition for scarce resources. The idea struck Darwin with sudden force: if more individuals were born than could survive, and if individuals within a species varied in heritable ways, then those variations that gave an advantage in the struggle for survival would be preferentially passed on to the next generation. This was the mechanism he had been seeking — natural selection — and by 1842 he had written a brief sketch of the theory. He continued to develop and test it for the next sixteen years before publishing.'],
    ['E', 'Darwin delayed publication of his theory for over two decades, weighed down by anxiety about the theological and social implications of what he was proposing. He was aware that descent with modification challenged the literal interpretation of scripture and the established view of humanity\'s special status in creation. He was also deeply attached to his wife Emma, who was a sincere Christian, and he was troubled by the thought of causing her distress. The factor that finally forced his hand was a letter received in June 1858 from Alfred Russel Wallace, a young naturalist working in the Malay Archipelago, who had independently arrived at essentially the same theory. Darwin\'s friends Charles Lyell and Joseph Hooker arranged for a joint presentation of Wallace and Darwin\'s ideas to the Linnean Society in July 1858, and Darwin subsequently wrote On the Origin of Species in thirteen months, publishing it in November 1859.'],
    ['F', 'The reaction to On the Origin of Species was immediate and polarised. The first edition of 1,250 copies sold out on the day of publication. Thomas Huxley, who had not been among Darwin\'s inner circle during the years of preparation, became his most public defender, earning himself the sobriquet \'Darwin\'s bulldog.\' The most famous confrontation occurred at the 1860 meeting of the British Association for the Advancement of Science in Oxford, where Samuel Wilberforce, the Bishop of Oxford, debated with Huxley. The precise words exchanged are disputed, but accounts agree that Wilberforce made a sarcastic remark about Huxley\'s simian ancestry and that Huxley\'s response was devastatingly effective. The debate did not settle the scientific or theological questions but marked a turning point in public perception.'],
    ['G', 'Darwin spent the remaining years of his life at his home, Down House in Kent, continuing to publish prolifically on subjects ranging from earthworms to the expression of emotions in animals and humans. He died in April 1882 and was buried in Westminster Abbey — an honour that had initially been resisted by some Church of England clergy but was ultimately secured through the lobbying of Huxley and other scientific colleagues. The burial site placed Darwin beside his friend and geologist John Playfair and near Isaac Newton, symbolising the scientific community\'s judgement that his contribution ranked among the greatest in the history of human knowledge.']
  ],
  headings: headingBlock(darwinHeadings, [
    q('Paragraph A', 'vii', 'was considered an indifferent student at school… his enthusiasm for collecting specimens brought him to the attention of… John Stevens Henslow'),
    q('Paragraph B', 'ii', 'The Beagle\'s captain, Robert FitzRoy… forming a relationship characterised by mutual respect and profound intellectual disagreement'),
    q('Paragraph C', 'iv', 'The Galapagos experience did not produce an immediate theoretical breakthrough; rather, it planted a question that took years of reflection to answer'),
    q('Paragraph D', 'i', 'He read the economist Thomas Malthus\'s essay on population in 1838… This was the mechanism he had been seeking — natural selection'),
    q('Paragraph E', 'v', 'Darwin delayed publication of his theory for over two decades, weighed down by anxiety… The factor that finally forced his hand was a letter… from Alfred Russel Wallace'),
    q('Paragraph F', 'iii', 'The debate… marked a turning point in public perception'),
    q('Paragraph G', 'ix', 'continuing to publish prolifically… buried in Westminster Abbey… symbolising the scientific community\'s judgement that his contribution ranked among the greatest')
  ]),
  tfng: tfngP2([
    q('Darwin\'s father was persuaded to allow his son to join the Beagle voyage by a member of the family.', 'TRUE', 'it was his uncle Josiah Wedgwood who persuaded the elder Darwin to relent'),
    q('The ornithologist who examined Darwin\'s Galapagos specimens had previously worked with Darwin during the Beagle voyage.', 'NOT GIVEN', 'it was only after his return to England, when ornithologist John Gould examined his specimens'),
    q('On the Origin of Species sold its entire initial print run on the day it was published.', 'TRUE', 'The first edition of 1,250 copies sold out on the day of publication')
  ]),
  fill: fillBlock('Darwin\'s theory and legacy', [
    q('Darwin arrived at the mechanism of natural selection partly through reading an economist\'s essay on ……… , which described competition for limited resources.', 'population', 'He read the economist Thomas Malthus\'s essay on population in 1838'),
    q('His delay in publishing was ended when a rival naturalist sent him a letter describing an independent version of the same ……… .', 'theory', 'who had independently arrived at essentially the same theory'),
    q('After his death, Darwin was interred at Westminster ……… , an honour that placed him among the most celebrated figures in British history.', 'Abbey', 'He died in April 1882 and was buried in Westminster Abbey', { acceptedAnswers: ['abbey'] })
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_13: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  13: [stage13Passage1, stage13Passage2]
}
