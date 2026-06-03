/**
 * Normal Reading Journey ด่าน 1–5 — Cambridge-style mixed format.
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

// ─── Stage 1 ─────────────────────────────────────────────────────────────────

const stage1Passage1: IntensivePassageLayout = {
  title: 'The Disappearing Bees',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'For decades, honeybees have been dying in alarming numbers. In 2006, American beekeepers began reporting the sudden disappearance of worker bees from their hives — a phenomenon researchers named Colony Collapse Disorder, or CCD. Hives that had appeared healthy would be found almost entirely empty, with only the queen and a small cluster of young bees remaining. No dead bodies were found near the hives, which made diagnosis unusually difficult.'],
    ['B', 'Scientists now believe CCD results from a combination of factors rather than a single cause. Pesticides — particularly a class called neonicotinoids — have been shown to impair bee navigation, making foragers unable to return to their hives. Exposure to multiple pesticides simultaneously appears to worsen this effect significantly. A 2013 European Union study found that bees exposed to neonicotinoids showed a 55% reduction in the number of new queens produced, threatening the reproductive future of entire colonies.'],
    ['C', 'Alongside pesticides, parasites play a destructive role. The Varroa mite, first detected in Europe in the 1970s, feeds on the body fat of bees and transmits at least five viruses, including Deformed Wing Virus, which causes bees to be born with shrivelled, non-functional wings. A colony heavily infested with Varroa typically collapses within two years if left untreated. Beekeepers use chemical treatments to control mite populations, but resistance to these treatments is increasing in many regions.'],
    ['D', 'Habitat loss compounds these problems. Intensive agriculture has replaced wildflower meadows with monoculture fields that offer a single type of pollen for a limited period of the year, leaving bees nutritionally deficient during other months. Urban expansion has further reduced the availability of diverse, pesticide-free foraging grounds. Some researchers argue that nutritional stress weakens the immune systems of bees, making them more vulnerable to both pesticides and disease.'],
    ['E', 'Climate change adds another layer of complexity. Warmer winters have disrupted the hibernation patterns of bumblebees and altered the flowering times of plants, causing mismatches between when bees are active and when flowers provide nectar. In some regions, spring has been arriving several weeks earlier than historical averages, but bee populations have not adapted at the same rate as the plants they depend on.'],
    ['F', 'Efforts to address the crisis have been uneven. Several European countries have banned neonicotinoid use on flowering crops, and early data suggest some recovery in bee populations in those areas. In the United States, federal regulations on pesticide use near pollinator habitats were strengthened in 2022, though conservation groups argue that enforcement remains insufficient. Breeding programmes aimed at developing Varroa-resistant bee strains have shown promise in controlled settings, but scaling these efforts to commercial apiaries presents significant logistical challenges.'],
    ['G', 'The economic stakes are substantial. Bees pollinate approximately one-third of the global food supply, including fruits, vegetables, nuts, and seeds. The annual value of pollination services provided by bees has been estimated at over 150 billion US dollars worldwide. Some crops — almonds, for example — are almost entirely dependent on commercial beekeeping operations for pollination. Without intervention, agricultural scientists warn that yields of pollinator-dependent crops could fall by as much as 90% within a generation.']
  ],
  tfng: tfng([
    q('Before CCD was identified, researchers had never recorded any mass disappearance of bees from managed hives.', 'NOT GIVEN', 'In 2006, American beekeepers began reporting the sudden disappearance of worker bees from their hives — a phenomenon researchers named Colony Collapse Disorder.'),
    q('The absence of dead bees near empty hives made it harder for scientists to identify the cause of CCD.', 'TRUE', 'No dead bodies were found near the hives, which made diagnosis unusually difficult.'),
    q('Simultaneous exposure to more than one pesticide increases the damaging effect on bee navigation.', 'TRUE', 'Exposure to multiple pesticides simultaneously appears to worsen this effect significantly.'),
    q('The Varroa mite was originally discovered in Asia before spreading to Europe.', 'NOT GIVEN', 'The Varroa mite, first detected in Europe in the 1970s'),
    q('Chemical treatments used by beekeepers to combat Varroa are becoming less effective over time.', 'TRUE', 'Resistance to these treatments is increasing in many regions.'),
    q('Bees in monoculture farming areas receive a less varied diet than bees in areas with mixed vegetation.', 'TRUE', 'Intensive agriculture has replaced wildflower meadows with monoculture fields that offer a single type of pollen for a limited period of the year, leaving bees nutritionally deficient.'),
    q('Almond farmers have begun developing alternative pollination methods to reduce their dependence on bees.', 'NOT GIVEN', 'Some crops — almonds, for example — are almost entirely dependent on commercial beekeeping operations for pollination.')
  ]),
  fill: fillBlock('Colony Collapse Disorder and its causes', [
    q('Honeybee colonies have been declining severely since the mid-2000s. The problem was given the name Colony Collapse ……… after beekeepers in the United States reported that worker bees had vanished from otherwise healthy hives.', 'Disorder', 'a phenomenon researchers named Colony Collapse Disorder, or CCD'),
    q('Scientists have identified several contributing factors. A class of pesticides known as ……… has been shown to damage bees\' ability to navigate, preventing them from returning home.', 'neonicotinoids', 'Pesticides — particularly a class called neonicotinoids — have been shown to impair bee navigation'),
    q('The ……… mite is a widespread parasite that feeds on bee fat tissue and spreads dangerous viruses.', 'Varroa', 'The Varroa mite, first detected in Europe in the 1970s'),
    q('One of these, Deformed Wing ………, leaves newly hatched bees physically unable to fly.', 'Virus', 'Deformed Wing Virus, which causes bees to be born with shrivelled, non-functional wings'),
    q('Poor diet caused by the spread of large-scale ……… farming has also left bee immune systems weakened.', 'monoculture', 'Intensive agriculture has replaced wildflower meadows with monoculture fields'),
    q('Changes in climate have disrupted the timing of plant ……… production, reducing the food available to bees at critical times.', 'nectar', 'causing mismatches between when bees are active and when flowers provide nectar'),
    q('If the decline is not reversed, scientists predict that harvests of ………-dependent crops could drop dramatically within a single generation.', 'pollinator', 'yields of pollinator-dependent crops could fall by as much as 90% within a generation')
  ])
}

const teslaHeadings = [
  'A moment of inspiration that changed electrical history',
  'Recognition arrives long after a lifetime of struggle',
  'Childhood brilliance followed by an incomplete education',
  'A disputed promise leads to a defining professional split',
  'Ambitions that reached beyond the boundaries of existing science',
  'Decline, poverty, and a solitary end',
  'A public triumph that settled a long-running technical debate',
  'The difficulty of separating fact from mythology',
  'Early experiments with wireless power transmission in Europe',
  'A commercial partnership that reshaped an entire industry'
]

const stage1Passage2: IntensivePassageLayout = {
  title: 'The Life and Work of Nikola Tesla',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'Nikola Tesla was born in 1856 in Smiljan, a village in what is now Croatia, the fourth of five children of a Serbian Orthodox priest. He displayed extraordinary mental ability from childhood, reportedly able to perform integral calculus in his head by the age of twelve — a feat his teachers initially suspected was a form of cheating. He enrolled at the Austrian Polytechnic in Graz in 1875 but left without graduating after falling deeply into debt through gambling. He later attended the Charles-Ferdinand University in Prague but again left before completing his degree.'],
    ['B', 'In 1882, while walking through a Budapest park, Tesla experienced what he later described as a sudden vision of a rotating magnetic field — the core principle behind alternating current motors. He sketched the concept in the dirt with a stick, explaining it to a companion. The idea would take several years to develop into a working machine, but Tesla later claimed that the entire design appeared to him fully formed in a moment of insight. Whether or not this account is literally accurate, the concept he envisioned that afternoon became one of the foundational technologies of modern electrical engineering.'],
    ['C', 'Tesla emigrated to the United States in 1884 and was briefly employed by Thomas Edison, who at the time was committed to developing direct current electrical systems. Edison reportedly promised Tesla fifty thousand dollars if he could improve the efficiency of his DC generators. Tesla worked intensively on the problem and succeeded, but Edison refused to pay, claiming the offer had been a joke. Tesla resigned shortly afterwards. The episode became one of the most famous disputes in the history of technology, and the commercial rivalry that followed between DC and AC power systems — popularly called the War of Currents — shaped the electrical infrastructure of the twentieth century.'],
    ['D', 'After leaving Edison, Tesla partnered with investor George Westinghouse, who saw the commercial potential of alternating current. Together they demonstrated AC power at the 1893 World\'s Columbian Exposition in Chicago, successfully illuminating the entire fairground — the largest electrical installation in the world at that time. The following year, their AC system was chosen over Edison\'s DC system to harness the power of Niagara Falls, producing electricity that was transmitted over twenty miles to the city of Buffalo. The success of Niagara was widely seen as the moment AC power won the War of Currents.'],
    ['E', 'Tesla\'s ambitions extended well beyond electrical power. In the late 1890s, he became convinced that it was possible to transmit both power and information wirelessly across the globe using the Earth itself as a conductor. He built a large experimental facility in Colorado Springs, where he generated artificial lightning bolts over thirty metres long and claimed to have received signals that he believed originated from an extraterrestrial source — though this claim was later attributed by most scientists to atmospheric interference. He also filed patents for what he described as a system of world wireless communication, predating modern radio broadcasting by several decades.'],
    ['F', 'Tesla\'s later years were marked by financial failure and professional isolation. His most ambitious project, the Wardenclyffe Tower on Long Island — intended to be a global wireless transmission station — was abandoned in 1917 when his primary backer, financier J. P. Morgan, withdrew funding after concluding that the project could not generate profit. Tesla lived in increasing poverty in New York City hotel rooms, supported intermittently by small payments from companies using his patents. He developed a range of obsessive behaviours, including an extreme aversion to round objects, pearl jewellery, and human hair. He died alone in his room at the Hotel New Yorker in 1943, largely forgotten by the public.'],
    ['G', 'Tesla\'s reputation underwent a dramatic reversal in the decades following his death. Historians of science re-evaluated his contributions to radio technology, and a US Supreme Court ruling in 1943 — issued the same year he died — acknowledged that several of his patents predated and superseded those of Guglielmo Marconi, the man previously credited as radio\'s inventor. From the 1970s onwards, Tesla became a cult figure in engineering and popular culture, celebrated for his visionary thinking and perceived ill-treatment by commercial interests. His name was adopted by the electric vehicle company Tesla, Inc., and his image appeared on the Serbian dinar banknote.'],
    ['H', 'Scientists today continue to debate the extent of Tesla\'s actual achievements versus the myths that have accumulated around his name. Some inventions he claimed credit for — including early versions of radar and X-ray photography — were developed simultaneously and independently by other researchers. His insistence on working alone and his reluctance to publish detailed technical papers meant that many of his ideas, even the genuinely original ones, were poorly documented and difficult to verify. Scholars argue that separating the historical Tesla from the cultural icon he has become requires careful attention to primary sources rather than the popular accounts that have shaped his legacy.']
  ],
  headings: headingBlock(teslaHeadings, [
    q('Paragraph A', 'iii', 'He displayed extraordinary mental ability from childhood'),
    q('Paragraph B', 'i', 'Tesla experienced what he later described as a sudden vision of a rotating magnetic field'),
    q('Paragraph C', 'iv', 'Edison reportedly promised Tesla fifty thousand dollars'),
    q('Paragraph D', 'vii', 'The success of Niagara was widely seen as the moment AC power won the War of Currents'),
    q('Paragraph E', 'v', 'Tesla\'s ambitions extended well beyond electrical power'),
    q('Paragraph F', 'vi', 'Tesla\'s later years were marked by financial failure and professional isolation'),
    q('Paragraph G', 'ii', 'Tesla\'s reputation underwent a dramatic reversal in the decades following his death')
  ]),
  tfng: tfngP2([
    q('Tesla\'s teachers at school were suspicious that his mathematical ability came from dishonest behaviour.', 'TRUE', 'a feat his teachers initially suspected was a form of cheating'),
    q('Edison\'s decision to reject Tesla\'s payment was influenced by the advice of his business partners.', 'NOT GIVEN', 'Edison refused to pay, claiming the offer had been a joke'),
    q('The US Supreme Court concluded that Tesla\'s patents in radio technology were registered before those of Marconi.', 'TRUE', 'acknowledged that several of his patents predated and superseded those of Guglielmo Marconi')
  ]),
  fill: fillBlock('Tesla\'s commercial and wireless achievements', [
    q('Tesla\'s most commercially significant achievement was helping to establish alternating current as the dominant form of electrical ………', 'power', 'their AC system was chosen over Edison\'s DC system to harness the power of Niagara Falls'),
    q('His partnership with George Westinghouse proved decisive, particularly after their system was selected to generate electricity from Niagara ………', 'Falls', 'harness the power of Niagara Falls'),
    q('Tesla also pursued the idea of global wireless ………, for which he sought legal protection through a series of patents, though his most ambitious construction project in this field was never completed.', 'communication', 'a system of world wireless communication')
  ])
}

// ─── Stage 2 ─────────────────────────────────────────────────────────────────

const stage2Passage1: IntensivePassageLayout = {
  title: 'Deep-Sea Mining',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'The ocean floor holds one of the last great untapped reserves of mineral wealth on Earth. Scattered across vast stretches of the abyssal plain — the deepest, flattest regions of the ocean — are billions of potato-sized nodules containing high concentrations of manganese, nickel, cobalt, and copper. These polymetallic nodules form over millions of years as minerals precipitate around a tiny nucleus such as a shark tooth or fragment of volcanic rock. At depths of four to six kilometres, they lie beyond the reach of conventional recovery methods, but advances in robotics and deep-water engineering have placed their extraction within commercial grasp for the first time.'],
    ['B', 'The demand driving interest in these resources is closely connected to the global energy transition. Electric vehicle batteries, wind turbines, and solar panels require substantial quantities of cobalt, nickel, and manganese — minerals for which land-based supply chains are already strained. The Democratic Republic of Congo controls over 70% of global cobalt production, raising concerns about supply security and the human rights conditions under which mining occurs. Proponents of deep-sea mining argue that the ocean floor could provide a geopolitically neutral, labour-free alternative source of these critical materials.'],
    ['C', 'Despite these arguments, deep-sea mining faces fierce opposition from marine scientists. The abyssal plain is not the barren wasteland it might appear. Researchers have discovered extraordinarily diverse communities of organisms living on and around polymetallic nodules, including species found nowhere else on Earth. A 2019 survey in the Clarion-Clipperton Zone — the Pacific region most targeted for mining — identified over 5,000 species, approximately 90% of which were previously unknown to science. Mining operations would destroy this habitat directly, and the sediment plumes generated by extraction equipment could spread for hundreds of kilometres, smothering filter-feeding organisms across a vast area.'],
    ['D', 'Recovery timescales add to these concerns. While nodules themselves form over millions of years, the communities of organisms that colonise them develop over decades to centuries. Studies of seabed areas disturbed by experimental dredging in the 1970s found that, fifty years later, biodiversity had not meaningfully recovered. Some researchers argue that because so little is known about deep-sea ecosystems, any large-scale disturbance risks causing irreversible damage before science has even catalogued what exists. The International Seabed Authority, which regulates mining activities in international waters, has issued exploration licences to over thirty contractors but has so far declined to approve commercial extraction.'],
    ['E', 'On the other side of the debate, mining companies argue that the environmental impact of deep-sea extraction compares favourably with that of land-based mining, which involves deforestation, toxic tailings ponds, and the displacement of communities. A lifecycle assessment commissioned by one major mining operator concluded that extracting one tonne of cobalt from the seabed produces significantly less carbon dioxide and requires less land disruption than extracting the same quantity from terrestrial sources. Critics, however, question whether such assessments adequately capture the full ecological cost of deep-ocean disturbance, arguing that the unique and irreplaceable nature of deep-sea biodiversity requires a different ethical framework than is applied to land-based extraction.'],
    ['F', 'The legal framework governing the seabed presents further complications. Under the United Nations Convention on the Law of the Sea, mineral resources in international waters are defined as the "common heritage of mankind," meaning that revenues from their extraction should in principle benefit all nations, not just those with the technology to access them. In practice, the countries and corporations with the most advanced deep-sea technology are those most likely to capture the financial returns. Several small island nations, whose exclusive economic zones border the most mineral-rich areas of the Pacific, have called for a moratorium on commercial extraction until a fairer benefit-sharing framework is established.'],
    ['G', 'Commercial deep-sea mining remains, for now, a prospect rather than a reality. The technological challenges of operating reliably at extreme depth and pressure, combined with unresolved legal and environmental questions, have delayed the timeline predicted by industry observers a decade ago. Yet the economic incentives are not diminishing. As the global demand for battery metals accelerates and land-based reserves become more costly to exploit, the pressure on regulators and scientists to resolve the outstanding questions — and to do so quickly — is likely to intensify.']
  ],
  tfng: tfng([
    q('Polymetallic nodules always form around fragments of volcanic rock.', 'FALSE', 'minerals precipitate around a tiny nucleus such as a shark tooth or fragment of volcanic rock'),
    q('The conditions under which cobalt is extracted in the Democratic Republic of Congo have raised ethical concerns.', 'TRUE', 'raising concerns about supply security and the human rights conditions under which mining occurs'),
    q('Prior to the 2019 survey, researchers believed the Clarion-Clipperton Zone contained very few living organisms.', 'NOT GIVEN', 'A 2019 survey in the Clarion-Clipperton Zone — the Pacific region most targeted for mining — identified over 5,000 species'),
    q('Areas of the seabed disturbed in the 1970s had shown no significant return of biodiversity five decades later.', 'TRUE', 'fifty years later, biodiversity had not meaningfully recovered'),
    q('The International Seabed Authority has granted permission for commercial deep-sea mining to begin in the Clarion-Clipperton Zone.', 'FALSE', 'has so far declined to approve commercial extraction'),
    q('The lifecycle assessment commissioned by the mining company was reviewed and verified by an independent scientific body.', 'NOT GIVEN', 'A lifecycle assessment commissioned by one major mining operator concluded'),
    q('Small island nations have proposed delaying commercial extraction until revenue-sharing arrangements are considered more equitable.', 'TRUE', 'have called for a moratorium on commercial extraction until a fairer benefit-sharing framework is established')
  ]),
  fill: fillBlock('Minerals on the ocean floor', [
    q('The ocean floor contains enormous quantities of minerals stored in small, rounded ……… that build up gradually over geological timescales.', 'nodules', 'billions of potato-sized nodules'),
    q('Interest in recovering these materials has grown because of demand from the ……… transition, which relies on large quantities of cobalt and related metals.', 'energy', 'closely connected to the global energy transition'),
    q('Scientists studying the Pacific region most likely to be targeted for extraction discovered more than 5,000 ……… living in and around these mineral deposits.', 'species', 'identified over 5,000 species'),
    q('Concern about ecosystem damage is heightened by the fact that disturbed areas show no signs of ……… even after many decades.', 'recovery', 'Recovery timescales add to these concerns'),
    q('Legally, minerals in international waters are considered the ……… of all humanity, meaning profits should be shared broadly.', 'heritage', 'defined as the "common heritage of mankind"'),
    q('Nevertheless, critics argue that nations with superior ……… are better positioned to capture these profits.', 'technology', 'countries and corporations with the most advanced deep-sea technology'),
    q('As demand for battery ……… continues to rise, pressure on policymakers to resolve these disputes is expected to grow.', 'metals', 'As the global demand for battery metals accelerates')
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

const stage2Passage2: IntensivePassageLayout = {
  title: 'The Story of Sign Language',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'For most of recorded history, deaf people were considered incapable of being educated. In ancient Greece, the philosopher Aristotle declared that those who could not hear could not be taught, and this view shaped attitudes toward deafness across European cultures for nearly two thousand years. Deaf individuals in medieval Europe were frequently denied legal rights on the grounds that they could not participate in verbal contracts or take spoken oaths. Some were placed under legal guardianship for life, regardless of their intellectual capacity.'],
    ['B', 'The first systematic attempt to educate deaf children occurred in sixteenth-century Spain. Pedro Ponce de León, a Benedictine monk, developed a method for teaching the deaf sons of Spanish nobility to speak, read, and write. His techniques were not published or widely shared during his lifetime, but they established a precedent that education for deaf people was possible. A later Spanish teacher, Juan Pablo Bonet, published a detailed instructional manual in 1620 that included a hand alphabet — one of the earliest documented systems for representing spoken language through finger positions.'],
    ['C', 'The most influential figure in the history of deaf education was Charles-Michel de l\'Épée, a French priest who, in the 1760s, encountered two deaf sisters in Paris who were already communicating through a system of home signs. Rather than attempting to replace their existing system with spoken French, de l\'Épée learned from them and built upon their natural gestures, adding signed representations of French grammatical structures. In 1771, he opened the world\'s first free public school for the deaf. His methodology — combining natural sign with imposed grammatical markers — spread across Europe and eventually to North America.'],
    ['D', 'De l\'Épée\'s approach crossed the Atlantic when Thomas Hopkins Gallaudet, an American educator, travelled to Europe in 1817 to learn methods for teaching the deaf. He initially approached British oral educators, who refused to share their techniques. He then studied under Laurent Clerc, one of de l\'Épée\'s most accomplished graduates, who agreed to travel to America with him. Together they founded the American School for the Deaf in Hartford, Connecticut. The sign language used at that school, a fusion of French Sign Language and the home signs already used by the deaf community on Martha\'s Vineyard, became the foundation for what is now known as American Sign Language.'],
    ['E', 'Despite this progress, the late nineteenth century brought a significant setback. The Second International Congress on Education of the Deaf, held in Milan in 1880, passed a resolution declaring that spoken language was superior to sign and that oral methods should replace signing in all deaf education. The vote was almost entirely cast by hearing educators; deaf teachers were not permitted to vote. The resolution had an immediate effect: sign language was banned in most schools across Europe and North America. Many deaf teachers lost their positions. The consequences persisted for decades, and the Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions in the history of deaf education.'],
    ['F', 'The academic rehabilitation of sign language began in the 1960s, when the American linguist William Stokoe published research demonstrating that American Sign Language was not a simplified gestural code but a complete, independent language with its own phonology, morphology, and syntax. Stokoe\'s work was initially met with hostility by much of the deaf education establishment, which had long promoted oralism. Over the following decades, however, his findings were replicated and expanded by other researchers, and sign languages around the world — including British Sign Language, Auslan, and Langue des Signes Française — were recognised as fully developed linguistic systems.'],
    ['G', 'The legal and cultural status of sign language has continued to evolve. New Zealand became the first country in the world to grant official recognition to its national sign language in 2006, acknowledging it as one of three official languages of the country. Several European nations, including Germany and Sweden, have since followed. In the United Kingdom, British Sign Language was granted official recognition by the government in 2022 after years of campaigning by the deaf community. International research now suggests that bilingual education — combining sign language with the written form of the national spoken language — produces better literacy and academic outcomes for deaf children than oral-only approaches.']
  ],
  headings: headingBlock(signLanguageHeadings, [
    q('Paragraph A', 'iii', 'deaf people were considered incapable of being educated'),
    q('Paragraph B', 'viii', 'The first systematic attempt to educate deaf children occurred in sixteenth-century Spain'),
    q('Paragraph C', 'v', 'encountered two deaf sisters in Paris who were already communicating through a system of home signs'),
    q('Paragraph D', 'x', 'a fusion of French Sign Language and the home signs already used by the deaf community on Martha\'s Vineyard'),
    q('Paragraph E', 'i', 'sign language was banned in most schools across Europe and North America'),
    q('Paragraph F', 'iv', 'William Stokoe published research demonstrating that American Sign Language was not a simplified gestural code'),
    q('Paragraph G', 'vii', 'New Zealand became the first country in the world to grant official recognition to its national sign language in 2006')
  ]),
  tfng: tfngP2([
    q('De l\'Épée replaced the signing system used by the two sisters he met with a completely new French-based method.', 'FALSE', 'Rather than attempting to replace their existing system with spoken French, de l\'Épée learned from them and built upon their natural gestures'),
    q('Gallaudet was refused assistance by British educators before seeking help from a French-trained teacher.', 'TRUE', 'He initially approached British oral educators, who refused to share their techniques. He then studied under Laurent Clerc'),
    q('The resolution passed at the Milan Congress in 1880 was later formally reversed by a subsequent international conference.', 'NOT GIVEN', 'The Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions in the history of deaf education')
  ]),
  fill: fillBlock('The history of deaf education', [
    q('For most of European history, deaf people were denied fundamental ……… on the grounds that they could not use spoken language.', 'rights', 'Deaf individuals in medieval Europe were frequently denied legal rights'),
    q('Education became possible following efforts by individual teachers, and sign language developed as a legitimate means of instruction until the Milan ……… of 1880 banned its use in schools.', 'resolution', 'the Milan resolution is now widely regarded by deaf historians'),
    q('The academic standing of sign language was restored largely through the research of William Stokoe, who proved that American Sign Language possessed the full characteristics of a genuine ………', 'language', 'a complete, independent language with its own phonology, morphology, and syntax')
  ])
}

// ─── Stage 3 ─────────────────────────────────────────────────────────────────

const stage3Passage1: IntensivePassageLayout = {
  title: 'The Psychology of Procrastination',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Procrastination — the act of delaying tasks in favour of more immediately gratifying activities — is one of the most widely studied topics in behavioural psychology. Surveys consistently find that between 15% and 20% of adults identify as chronic procrastinators, meaning that the habit causes them regular and significant distress. The popular understanding of procrastination as a form of laziness or poor time management has been largely rejected by researchers, who now view it as primarily an emotional regulation problem rather than a deficit of willpower or organisational skill.'],
    ['B', 'The emotional root of procrastination lies in the relationship between a task and the feelings it provokes. Psychologist Fuschia Sirois of Durham University has shown that people procrastinate most on tasks associated with anxiety, self-doubt, boredom, or resentment — in other words, tasks that generate negative emotion. When faced with such a task, the brain\'s short-term mood management system takes precedence over its long-term goal-pursuit system, and the individual seeks relief through distraction. The temporary good feeling that results from avoidance reinforces the behaviour, making future procrastination on similar tasks more likely.'],
    ['C', 'The role of self-compassion in breaking this cycle has attracted considerable research attention. A 2010 study by Michael Tice and colleagues at Florida State University found that students who forgave themselves for procrastinating on the first exam of the academic year were less likely to procrastinate before the second exam. The researchers concluded that self-criticism after procrastination increases negative emotion, which in turn heightens the likelihood of future avoidance. By contrast, treating oneself with the same understanding one might offer a friend appeared to interrupt the cycle. This finding has been replicated in several subsequent studies.'],
    ['D', 'Structural interventions can also be effective. Implementation intentions — specific plans that link a future situation to a particular behaviour, typically in the form "when X happens, I will do Y" — have been shown to reduce procrastination significantly in controlled experiments. A meta-analysis of studies examining this technique, covering over eight thousand participants, found that individuals who formed implementation intentions completed between 20% and 30% more of their intended tasks than those who relied on general intentions alone. The mechanism appears to involve a reduction in the decision-making load at the moment of action: because the response to a given situation has been pre-programmed, the brain does not need to negotiate afresh each time.'],
    ['E', 'Perfectionism presents a complex relationship with procrastination. Contrary to popular belief, not all perfectionists procrastinate. Research distinguishes between adaptive perfectionism — characterised by high standards combined with satisfaction in working toward those standards — and maladaptive perfectionism, which involves excessive concern about making mistakes and a tendency to evaluate self-worth on the basis of performance outcomes. Only the maladaptive form is reliably associated with procrastination. Individuals with maladaptive perfectionism delay tasks because starting implies the possibility of failure, and failure is experienced not as a setback but as evidence of fundamental inadequacy.'],
    ['F', 'The rise of digital technology has been widely blamed for increasing procrastination rates, but the research picture is complicated. Heavy social media use is positively correlated with self-reported procrastination, particularly among young adults. However, correlation does not establish causation: people who are already prone to procrastination may be more attracted to digital environments, rather than digital environments causing procrastination. Experimental studies that have temporarily removed participants\' access to smartphones have produced modest reductions in procrastination in some contexts but not others, suggesting that the relationship is highly individual and context-dependent.'],
    ['G', 'Effective treatment for chronic procrastination typically combines cognitive behavioural techniques with practical scheduling strategies. Therapists working with severe procrastinators often identify and challenge the underlying beliefs — such as "I can only do this when I feel ready" or "if I cannot do it perfectly, there is no point starting" — that maintain avoidance behaviour. Breaking tasks into very small components, using time-limited work periods, and removing environmental triggers associated with distraction have all demonstrated benefit in clinical and non-clinical populations. Researchers emphasise, however, that because procrastination is driven by emotion rather than time, interventions focused purely on scheduling are unlikely to succeed without also addressing the emotional avoidance at its root.']
  ],
  tfng: tfng([
    q('Most researchers now agree that procrastination is caused by a lack of ability to organise one\'s time effectively.', 'FALSE', 'The popular understanding of procrastination as a form of laziness or poor time management has been largely rejected by researchers, who now view it as primarily an emotional regulation problem'),
    q('According to Sirois, people are most likely to delay tasks that cause them to feel uncomfortable emotions.', 'TRUE', 'people procrastinate most on tasks associated with anxiety, self-doubt, boredom, or resentment'),
    q('The 2010 study by Tice and colleagues took place across multiple universities in North America.', 'NOT GIVEN', 'A 2010 study by Michael Tice and colleagues at Florida State University'),
    q('Students who were lenient with themselves after failing to study for one exam later showed reduced avoidance behaviour before the next exam.', 'TRUE', 'students who forgave themselves for procrastinating on the first exam of the academic year were less likely to procrastinate before the second exam'),
    q('All types of perfectionism are associated with higher rates of task avoidance.', 'FALSE', 'not all perfectionists procrastinate… Only the maladaptive form is reliably associated with procrastination'),
    q('Studies that limited participants\' use of mobile phones consistently produced a decrease in procrastination across all settings.', 'FALSE', 'produced modest reductions in procrastination in some contexts but not others'),
    q('Researchers who treat chronic procrastination sometimes focus on the beliefs that support avoidance behaviour.', 'TRUE', 'Therapists working with severe procrastinators often identify and challenge the underlying beliefs… that maintain avoidance behaviour')
  ]),
  fill: fillBlock('Understanding procrastination', [
    q('Procrastination is best understood not as a problem of scheduling but of ……… management, since people tend to avoid tasks that generate negative feelings.', 'emotion', 'tasks that generate negative emotion'),
    q('When avoidance provides relief, the temporary good ……… produced by avoidance reinforces the behaviour.', 'feeling', 'The temporary good feeling that results from avoidance reinforces the behaviour'),
    q('Research suggests that applying ……… to oneself after procrastinating can reduce future avoidance by interrupting the cycle of guilt and distraction.', 'self-compassion', 'The role of self-compassion in breaking this cycle has attracted considerable research attention'),
    q('Planning strategies known as implementation ……… — in which a specific action is attached to a future situation — have shown measurable results in reducing task delay.', 'intentions', 'Implementation intentions — specific plans that link a future situation to a particular behaviour'),
    q('Among personality types, those with maladaptive ……… are particularly prone to procrastination because they fear exposing personal weakness.', 'perfectionism', 'Individuals with maladaptive perfectionism delay tasks because starting implies the possibility of failure'),
    q('They associate starting a task with the risk of exposing a personal ………', 'inadequacy', 'failure is experienced not as a setback but as evidence of fundamental inadequacy'),
    q('Researchers stress that any intervention must address the emotional roots of delay, not only the ……… in which it occurs.', 'context', 'in some contexts but not others')
  ])
}

const penicillinHeadings = [
  'A chance observation sparks a line of inquiry',
  'Scaling up production through agricultural innovation',
  'Praise distributed unevenly despite shared achievement',
  'An incomplete cure that nonetheless proved a crucial point',
  'Early results that failed to excite the scientific community',
  'Transforming survival rates on the battlefield',
  'A rigorous experiment produces an unambiguous outcome',
  'A lethal diagnosis treated by an unproven compound',
  'The slow journey from curiosity to usable medicine',
  'Disputes over intellectual ownership of a major discovery'
]

const stage3Passage2: IntensivePassageLayout = {
  title: 'The Discovery of Penicillin',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'In September 1928, Alexander Fleming returned from a summer holiday to his laboratory at St Mary\'s Hospital in London to find that one of his petri dishes containing Staphylococcus bacteria had been contaminated by a mould. What made the dish unusual was not the contamination itself — a common enough occurrence in any busy laboratory — but the clear zone that had formed around the mould, where the bacteria had been visibly destroyed. Fleming identified the mould as belonging to the genus Penicillium and named the antibacterial substance it appeared to produce penicillin.'],
    ['B', 'Fleming\'s initial findings, published in the British Journal of Experimental Pathology in 1929, attracted little interest. He had been unable to isolate or stabilise the active compound, and without a purified form, penicillin could not be tested on human subjects. Fleming himself doubted whether the substance would survive long enough in the human body to be therapeutically useful, and he turned his attention back to his other research. The paper went largely unread for nearly a decade, and Fleming made no further significant effort to develop penicillin into a medical treatment.'],
    ['C', 'The transformation of penicillin from laboratory curiosity to life-saving drug was the work of a team at Oxford University, led by Howard Florey, an Australian pathologist, and Ernst Chain, a German-Jewish biochemist who had fled Nazi Germany in 1933. Between 1938 and 1940, Florey and Chain obtained purified penicillin in sufficient quantities to test its effects in mice. In one pivotal experiment, eight mice were infected with lethal doses of Streptococcus bacteria; four were treated with penicillin and four were left untreated. All four untreated mice died within sixteen hours. All four treated mice survived.'],
    ['D', 'Human trials followed in early 1941. The first patient was a policeman named Albert Alexander, who was dying from a severe infection caused by a scratch from a rose thorn. After receiving injections of purified penicillin, his condition began to improve dramatically within twenty-four hours. However, the Oxford team had not yet produced enough penicillin to complete a full course of treatment, and when their supply ran out, the infection returned. Albert Alexander died several weeks later — not because penicillin had failed, but because there was not enough of it. The episode nevertheless demonstrated, conclusively, that the drug could fight infection in humans.'],
    ['E', 'The challenge of producing penicillin in large quantities was solved not in Britain but in the United States. Florey travelled to America in 1941 to enlist the help of the US government and its network of agricultural research facilities. Scientists at the Northern Regional Research Laboratory in Illinois discovered that fermenting penicillin in corn steep liquor — a by-product of corn milling — produced yields dramatically higher than any previously achieved. They also identified a strain of the Penicillium mould found on a mouldy cantaloupe melon in a local market that proved far more productive than Fleming\'s original strain. By 1945, American factories were producing over 650 billion units of penicillin per month.'],
    ['F', 'The impact of penicillin on the Second World War was profound. Prior to its availability, infected wounds were a leading cause of military death and amputation — historically, more soldiers died from infection than from direct combat injury. The widespread introduction of penicillin to Allied forces from 1943 onwards dramatically reduced wound infection fatalities and allowed surgeons to perform operations that would previously have been too dangerous. Military medical historians credit penicillin with saving the lives of an estimated 12 to 15 percent of Allied soldiers who would otherwise have died from infection.'],
    ['G', 'Fleming, Florey, and Chain were jointly awarded the Nobel Prize in Physiology or Medicine in 1945. The award generated significant controversy regarding the relative credit owed to each recipient. Fleming received the most public attention and was celebrated in popular media as the sole discoverer of penicillin, a portrayal that many scientists considered deeply unfair to Florey and Chain, whose laboratory work had been essential to making the drug functional. The episode raised broader questions about how scientific discovery is perceived and communicated — specifically, whether a dramatic moment of observation is accorded more cultural weight than the painstaking laboratory development that follows.']
  ],
  headings: headingBlock(penicillinHeadings, [
    q('Paragraph A', 'i', 'Fleming returned from a summer holiday to his laboratory at St Mary\'s Hospital in London to find that one of his petri dishes'),
    q('Paragraph B', 'v', 'Fleming\'s initial findings, published in the British Journal of Experimental Pathology in 1929, attracted little interest'),
    q('Paragraph C', 'vii', 'All four untreated mice died within sixteen hours. All four treated mice survived'),
    q('Paragraph D', 'iv', 'when their supply ran out, the infection returned… demonstrated, conclusively, that the drug could fight infection in humans'),
    q('Paragraph E', 'ii', 'fermenting penicillin in corn steep liquor — a by-product of corn milling — produced yields dramatically higher than any previously achieved'),
    q('Paragraph F', 'vi', 'dramatically reduced wound infection fatalities'),
    q('Paragraph G', 'iii', 'Fleming received the most public attention and was celebrated in popular media as the sole discoverer of penicillin')
  ]),
  tfng: tfngP2([
    q('Fleming\'s 1929 paper received little attention partly because he had not been able to produce a form of penicillin that could be used on people.', 'TRUE', 'without a purified form, penicillin could not be tested on human subjects'),
    q('Ernst Chain had left Germany and moved to Britain before Fleming published his initial findings on penicillin.', 'FALSE', 'Ernst Chain, a German-Jewish biochemist who had fled Nazi Germany in 1933'),
    q('The Oxford team had sufficient penicillin reserves to treat several patients simultaneously before running out of supply.', 'NOT GIVEN', 'the Oxford team had not yet produced enough penicillin to complete a full course of treatment')
  ]),
  fill: fillBlock('From laboratory discovery to mass production', [
    q('The development of penicillin followed a long path from an unexpected finding in a ……… in London to industrial manufacture in the United States.', 'laboratory', 'his laboratory at St Mary\'s Hospital in London'),
    q('The crucial breakthrough in production came when scientists discovered that fermenting the mould in corn steep ……… produced far larger quantities than earlier methods.', 'liquor', 'fermenting penicillin in corn steep liquor'),
    q('The drug\'s wartime use provided convincing evidence of its power: medical ……… estimate that more than one in ten Allied soldiers who would otherwise have died from infected wounds survived because of it.', 'historians', 'Military medical historians credit penicillin with saving the lives')
  ])
}

// ─── Stage 4 ─────────────────────────────────────────────────────────────────

const stage4Passage1: IntensivePassageLayout = {
  title: 'The Crisis in Urban Housing',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Housing affordability has deteriorated sharply across major cities worldwide over the past three decades. In cities such as London, Sydney, Toronto, and San Francisco, the ratio of average house prices to average annual incomes has grown from roughly four to one in the 1980s to over twelve to one today. Young adults in these cities are spending an increasing proportion of their income on rent, with many unable to save enough for a deposit even after years of full-time employment. The consequences extend beyond individual financial stress: economists have linked severe housing unaffordability to reduced labour mobility, lower birth rates, declining local business activity, and increased rates of depression and anxiety among renters.'],
    ['B', 'The dominant explanation among economists is that housing supply has failed to keep pace with population growth and increasing demand. In most high-cost cities, the rate of new housing construction has lagged behind population growth for decades. Restrictive zoning laws — which limit the density, height, and type of buildings permitted in large areas of cities — are widely identified as a primary cause. Professor Edward Glaeser of Harvard University argues that in many American cities, local zoning regulations effectively function as a cartel operated by existing homeowners, preventing new construction in order to protect and inflate the value of their existing assets.'],
    ['C', 'A competing explanation focuses on demand-side factors rather than supply constraints. Historically low interest rates during the 2010s made mortgages significantly cheaper, enabling buyers to borrow more and bid up prices. Foreign investment in residential property — particularly notable in cities such as Vancouver, Sydney, and London — has been blamed for inflating prices beyond the reach of local buyers. Short-term rental platforms have also been criticised for removing properties from the long-term rental market. However, researchers at the London School of Economics found that foreign ownership accounts for less than 3% of total housing stock in most affected cities, suggesting that its contribution to the affordability crisis, while real, is modest compared with supply constraints.'],
    ['D', 'Not all researchers accept the supply-focused diagnosis. Some urban economists, including Andrés Rodríguez-Pose of the London School of Economics, argue that the primary driver of housing unaffordability is not physical scarcity but wealth concentration — specifically, the financialisation of housing, whereby residential property has been transformed from a consumption good into an investment asset attracting speculative capital. Under this view, building more homes will not reduce prices in desirable areas, because additional supply will simply attract more investors rather than making housing accessible to ordinary residents.'],
    ['E', 'The social housing sector has contracted significantly in most English-speaking countries since the 1980s. In the United Kingdom, the Right to Buy scheme introduced by the Thatcher government in 1980 allowed council tenants to purchase their homes at a substantial discount, reducing the social housing stock by over two million dwellings over the following decades. Although the policy was popular with those who benefited from it, replacement construction never matched the rate of sales, and today councils are legally obliged to assist homeless households with insufficient funds to build or acquire the properties required to discharge that duty. Community land trusts — non-profit organisations that acquire land and hold it in perpetual community ownership — have been proposed as one means of preserving permanently affordable housing, but they remain a very small part of the overall housing landscape.'],
    ['F', 'Modular and prefabricated construction methods have attracted attention as a potential means of reducing the cost and increasing the speed of housing delivery. Unlike traditional on-site construction, modular housing is built in factory conditions where labour costs are lower, waste is reduced, and quality control is more consistent. Several large housing associations in the Netherlands and Sweden have adopted these methods extensively, reducing construction costs by an estimated 15 to 20 percent. However, adoption in the United Kingdom and the United States has been slower than advocates had hoped, partly because of cultural resistance among buyers accustomed to traditionally built homes and partly because of the high initial capital costs of establishing modular factories.'],
    ['G', 'There is broad agreement among housing researchers that no single intervention will resolve the affordability crisis. Meaningful progress is likely to require simultaneous action on zoning reform, investment in social and affordable housing, regulation of speculative investment, and innovation in construction methods. Political obstacles are considerable: homeowners, who form the majority of voters in most high-cost cities and who benefit financially from continuing price increases, have historically opposed policies that would reduce housing costs. The challenge is therefore as much political as it is economic or technical.']
  ],
  tfng: tfng([
    q('In the 1980s, the ratio of house prices to average income in major cities was approximately four times the annual salary.', 'TRUE', 'the ratio of average house prices to average annual incomes has grown from roughly four to one in the 1980s'),
    q('Edward Glaeser has argued that zoning laws are designed to benefit new residents rather than those who already own homes in a city.', 'FALSE', 'local zoning regulations effectively function as a cartel operated by existing homeowners'),
    q('The London School of Economics study examined housing ownership data from over twenty cities.', 'NOT GIVEN', 'researchers at the London School of Economics found that foreign ownership accounts for less than 3% of total housing stock in most affected cities'),
    q('According to Rodríguez-Pose, increasing the number of homes available will not make housing affordable in popular areas.', 'TRUE', 'building more homes will not reduce prices in desirable areas, because additional supply will simply attract more investors'),
    q('The Right to Buy scheme required councils to invest the proceeds of home sales into building replacement housing.', 'NOT GIVEN', 'replacement construction never matched the rate of sales'),
    q('Modular construction methods have been shown to lower building costs by between 15 and 20 percent in some European countries.', 'TRUE', 'reducing construction costs by an estimated 15 to 20 percent… in the Netherlands and Sweden'),
    q('Researchers studying housing affordability agree that reducing house prices would be politically straightforward in most high-cost cities.', 'FALSE', 'Political obstacles are considerable: homeowners… have historically opposed policies that would reduce housing costs')
  ]),
  fill: fillBlock('Urban housing affordability', [
    q('Beyond financial strain on individuals, economists have identified connections to reduced ……… mobility and declining mental health.', 'labour', 'economists have linked severe housing unaffordability to reduced labour mobility'),
    q('A central cause identified by researchers is insufficient ……… — that is, too few homes are being built relative to the growing number of people who need them.', 'supply', 'housing supply has failed to keep pace with population growth and increasing demand'),
    q('Professor Glaeser argues that ……… laws act as a mechanism protecting the interests of those who already own homes.', 'zoning', 'Restrictive zoning laws — which limit the density, height, and type of buildings permitted'),
    q('An alternative perspective, advanced by Rodríguez-Pose, focuses on the role of ……… in converting housing from a basic need into an investment vehicle.', 'financialisation', 'the financialisation of housing, whereby residential property has been transformed from a consumption good into an investment asset'),
    q('In the United Kingdom, the contraction of the social housing sector following the Right to Buy ……… reduced available council homes by more than two million.', 'scheme', 'the Right to Buy scheme introduced by the Thatcher government in 1980'),
    q('New building methods, such as modular construction, offer potential cost savings, but uptake has been limited by the high initial capital costs of establishing modular ………', 'factories', 'the high initial capital costs of establishing modular factories'),
    q('Researchers agree that resolving the crisis will require action across multiple areas simultaneously, including changes to ……… regulation.', 'investment', 'regulation of speculative investment')
  ])
}

const genomeHeadings = [
  'Commercial interests arrive and change the pace of a public project',
  'A founding principle designed to keep knowledge in public hands',
  'Mixed results as science confronts the complexity of disease',
  'The political resolution of a damaging scientific rivalry',
  'The roots of an idea dismissed as beyond the limits of possibility',
  'A public announcement that concealed an unfinished task',
  'Unresolved questions about who should see genetic data',
  'A celebrated moment overshadowed by a dispute over ownership',
  'A director is replaced following disagreement over a fundamental policy',
  'Decades of work culminate in a global celebration'
]

const stage4Passage2: IntensivePassageLayout = {
  title: 'The Mapping of the Human Genome',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'In June 2000, US President Bill Clinton and UK Prime Minister Tony Blair jointly announced that scientists had produced a working draft of the complete sequence of the human genome — the full set of DNA instructions contained in every human cell. Clinton called it "the most wondrous map ever produced by humankind." The announcement marked the apparent completion of the Human Genome Project, a publicly funded international collaboration launched in 1990 with the goal of identifying and sequencing all three billion base pairs of human DNA. In the same week, a privately funded competitor — the biotechnology company Celera Genomics, led by Craig Venter — announced that it had independently completed its own draft sequence, sparking controversy about credit, data access, and the commercialisation of genetic information.'],
    ['B', 'The origins of the project can be traced to the 1970s and 1980s, when advances in molecular biology made it possible to sequence short stretches of DNA for the first time. Scientists began to recognise that a complete map of the human genome could serve as a reference tool of incalculable value for medicine, accelerating the identification of the genetic basis of diseases from cancer to inherited disorders. The idea of sequencing the entire genome was initially viewed by many researchers as hubristic and technically impossible, but by the mid-1980s it was being discussed seriously in scientific circles, and the US Department of Energy and the National Institutes of Health began formal planning in 1988.'],
    ['C', 'The project was led scientifically by Francis Collins, an American physician-geneticist, who took over as director in 1993 after the departure of James Watson — the co-discoverer of DNA\'s double helix structure — following a dispute over patent policy. Under Collins, the project adopted an open-data principle: all sequence data would be deposited in a public database within twenty-four hours of generation and made freely available to researchers worldwide. This decision — later formalised as the Bermuda Principles — was intended to prevent any single institution from claiming ownership of the human genome and to ensure that the benefits of the research accrued to humanity as a whole rather than to private investors.'],
    ['D', 'The arrival of Craig Venter\'s Celera Genomics in 1998 dramatically accelerated the public project\'s timeline. Celera used a different and faster method — whole-genome shotgun sequencing — that broke the entire genome into millions of small fragments, sequenced them simultaneously, and used powerful computers to assemble the overlapping pieces. Venter announced that Celera would complete the sequence ahead of the public consortium, forcing Collins and his team to increase their pace significantly. The competition between the two projects was bitter and personal, and it generated enormous media coverage, transforming what had been a largely technical undertaking into a public race with profound implications for science, medicine, and commerce.'],
    ['E', 'The announcement in 2000 of a joint draft sequence was in part a political settlement brokered by President Clinton and Prime Minister Blair to prevent the controversy from escalating further. Scientists on both sides acknowledged that neither draft was truly complete — both contained gaps and errors — and that years of additional work would be required to produce a finished, high-quality sequence. That final sequence was not declared complete until April 2003, coinciding with the fiftieth anniversary of Watson and Crick\'s landmark paper on the structure of DNA. Even then, certain highly repetitive regions of the genome remained unresolved, and a truly gapped-free reference sequence was not achieved until 2022.'],
    ['F', 'The medical promise of the genome project has been partially fulfilled. Hundreds of genes associated with single-gene disorders — conditions caused by mutations in a single identifiable gene, such as cystic fibrosis and Huntington\'s disease — have been mapped with precision, enabling improved diagnostic tests and carrier screening programmes. Genome-wide association studies have identified thousands of genetic variants linked to common diseases such as type 2 diabetes, heart disease, and several cancers. However, for most common diseases, the genetic contribution turns out to be spread across thousands of variants, each with a very small individual effect, making prediction and intervention far more complex than early proponents had suggested.'],
    ['G', 'The social and ethical dimensions of genomic science have provoked ongoing debate. The availability of genetic information raises questions about privacy — specifically, whether employers, insurers, or governments should have access to individuals\' genomic data. Several countries have enacted legislation prohibiting genetic discrimination in employment and insurance, but gaps remain and enforcement is inconsistent. The commercial market for direct-to-consumer genetic testing has expanded rapidly, with companies such as 23andMe and AncestryDNA offering ancestry analysis and health risk assessments based on partial genome sequencing. Critics argue that many consumers lack the scientific literacy to interpret their results accurately, and that the data collected by these companies poses significant privacy risks if misused or sold.']
  ],
  headings: headingBlock(genomeHeadings, [
    q('Paragraph A', 'viii', 'Clinton called it "the most wondrous map ever produced by humankind."… sparking controversy about credit, data access, and the commercialisation of genetic information'),
    q('Paragraph B', 'v', 'The idea of sequencing the entire genome was initially viewed by many researchers as hubristic and technically impossible'),
    q('Paragraph C', 'ii', 'all sequence data would be deposited in a public database within twenty-four hours of generation and made freely available to researchers worldwide'),
    q('Paragraph D', 'i', 'The arrival of Craig Venter\'s Celera Genomics in 1998 dramatically accelerated the public project\'s timeline'),
    q('Paragraph E', 'vi', 'Scientists on both sides acknowledged that neither draft was truly complete — both contained gaps and errors'),
    q('Paragraph F', 'iii', 'The medical promise of the genome project has been partially fulfilled'),
    q('Paragraph G', 'vii', 'raises questions about privacy — specifically, whether employers, insurers, or governments should have access to individuals\' genomic data')
  ]),
  tfng: tfngP2([
    q('Francis Collins replaced James Watson as director of the Human Genome Project after Watson disagreed with the project\'s approach to intellectual property.', 'TRUE', 'Collins… took over as director in 1993 after the departure of James Watson… following a dispute over patent policy'),
    q('Celera Genomics made its genome sequence data available to other researchers at no charge.', 'NOT GIVEN', 'The passage discusses Celera\'s method and speed but never states whether it charged for access to its data'),
    q('For conditions involving a single faulty gene, the genome project has allowed more accurate identification than was previously possible.', 'TRUE', 'Hundreds of genes associated with single-gene disorders… have been mapped with precision, enabling improved diagnostic tests')
  ]),
  fill: fillBlock('The Human Genome Project', [
    q('The Human Genome Project produced a publicly accessible ……… of human DNA, governed by a principle that required all sequence data to be deposited in a shared database within a day of being generated.', 'sequence', 'scientists had produced a working draft of the complete sequence of the human genome'),
    q('All sequence data would be deposited in a public ……… within twenty-four hours of generation.', 'database', 'deposited in a public database within twenty-four hours of generation'),
    q('Despite early optimism, the project\'s impact on treating common diseases has been limited by the fact that most conditions are influenced by thousands of individual genetic ………, each contributing only a small effect.', 'variants', 'spread across thousands of variants, each with a very small individual effect')
  ])
}

// ─── Stage 5 ─────────────────────────────────────────────────────────────────

const stage5Passage1: IntensivePassageLayout = {
  title: 'The Science of Memory',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Human memory is not a fixed recording of the past. Unlike a video file that stores data in a stable form, memories are reconstructive: each time a memory is retrieved, it is temporarily destabilised and then reconsolidated, a process during which it is susceptible to modification. This insight — developed through decades of neuroscientific research — has profound implications for our understanding of personal identity, eyewitness testimony, and therapeutic approaches to traumatic memory.'],
    ['B', 'The biology of memory formation involves several distinct stages. Encoding occurs when sensory information is converted into a neural representation. Short-term memory holds this representation for a matter of seconds to minutes, and only a fraction of encoded information passes into long-term memory through a process called consolidation. During consolidation, the hippocampus — a seahorse-shaped structure in the medial temporal lobe — plays a central role in organising and stabilising new memories, gradually transferring them to the cortex for long-term storage. Damage to the hippocampus, as seen in the famous patient known as H.M., can prevent the formation of new long-term memories entirely while leaving older memories largely intact.'],
    ['C', 'The role of sleep in memory consolidation has attracted considerable research attention. During slow-wave sleep — the deepest stages of the sleep cycle — the hippocampus repeatedly replays the neural activity patterns associated with experiences from the preceding day, effectively rehearsing memories and strengthening their cortical representation. Studies using targeted memory reactivation, in which sounds associated with learned material are played quietly during sleep, have shown that this process can be selectively enhanced, improving recall of the cued material without disrupting overall sleep quality.'],
    ['D', 'Emotional intensity affects how strongly memories are formed and retained. The amygdala — a small, almond-shaped structure adjacent to the hippocampus — is activated by emotionally charged experiences and modulates memory consolidation by releasing stress hormones including noradrenaline. This mechanism explains why vivid, detailed memories of highly emotional events — sometimes called flashbulb memories — are encoded with unusual strength. However, research by Elizabeth Loftus and colleagues has demonstrated that emotional intensity does not guarantee accuracy: flashbulb memories, despite feeling subjectively certain, are frequently found to contain significant errors when checked against contemporaneous records.'],
    ['E', 'The reconstructive nature of memory has significant implications for the legal system. Eyewitness accounts are routinely accorded high weight by juries and judges, yet decades of psychological research have shown that they are highly unreliable. Leading questions, post-event information, and the stress of a crime scene can all distort memory encoding and later recall. In a landmark series of studies, Loftus showed that simply asking witnesses about a car accident using the verb "smashed" instead of "contacted" led them to report higher speeds and, in subsequent questioning, to falsely remember broken glass at the scene — even when no broken glass had been present.'],
    ['F', 'Reconsolidation — the process by which retrieved memories are temporarily labile and open to modification before being re-stored — has opened a new avenue in the treatment of post-traumatic stress disorder. If traumatic memories can be reactivated and then modified during the reconsolidation window, it may be possible to reduce their emotional charge without erasing the factual content of the memory. Animal studies using drugs that block noradrenaline receptors during memory retrieval have shown that this approach can weaken fear responses associated with specific memories. Human trials are at an early stage, and the technique remains controversial, with critics warning of the ethical risks of altering memory content in therapeutic contexts.'],
    ['G', 'Current research is exploring the extent to which false memories can be deliberately implanted. Loftus has conducted experiments in which participants were led to believe, through repeated suggestion and discussion with family members, that they had experienced childhood events — such as being lost in a shopping mall — that had never occurred. Approximately 25% of participants eventually came to report detailed, confident memories of these entirely invented experiences. These findings have led to significant revisions in how therapists approach recovered memory, particularly in clinical contexts involving childhood trauma, where the risk of inadvertently generating false recollections has significant consequences for both patient welfare and legal proceedings.']
  ],
  tfng: tfng([
    q('When a memory is recalled, it briefly enters a state in which it can be changed before being stored again.', 'TRUE', 'each time a memory is retrieved, it is temporarily destabilised and then reconsolidated, a process during which it is susceptible to modification'),
    q('The hippocampus is located in the same region of the brain as the cerebellum.', 'NOT GIVEN', 'the hippocampus — a seahorse-shaped structure in the medial temporal lobe'),
    q('Patient H.M. was unable to form new long-lasting memories following damage to his hippocampus.', 'TRUE', 'Damage to the hippocampus, as seen in the famous patient known as H.M., can prevent the formation of new long-term memories entirely'),
    q('The targeted memory reactivation technique involves exposing sleeping participants to visual stimuli associated with previously learned content.', 'FALSE', 'sounds associated with learned material are played quietly during sleep'),
    q('Noradrenaline release during emotionally intense experiences helps make the resulting memory stronger.', 'TRUE', 'modulates memory consolidation by releasing stress hormones including noradrenaline'),
    q('Loftus\'s car accident studies were the first to demonstrate that eyewitness memory could be influenced by the questions asked after an event.', 'NOT GIVEN', 'In a landmark series of studies, Loftus showed that simply asking witnesses about a car accident using the verb "smashed" instead of "contacted"'),
    q('Approximately one quarter of participants in Loftus\'s false memory experiments came to believe that fabricated childhood events had actually happened to them.', 'TRUE', 'Approximately 25% of participants eventually came to report detailed, confident memories of these entirely invented experiences')
  ]),
  fill: fillBlock('How memory works', [
    q('Memory is best understood through the concept of ………, which describes why each recall involves potential alteration.', 'reconsolidation', 'Reconsolidation — the process by which retrieved memories are temporarily labile and open to modification before being re-stored'),
    q('The stage at which new information is made permanent is known as ………, and it depends heavily on a brain structure called the hippocampus.', 'consolidation', 'only a fraction of encoded information passes into long-term memory through a process called consolidation'),
    q('During a specific phase of sleep called slow-wave ………, the brain appears to rehearse earlier experiences.', 'sleep', 'During slow-wave sleep — the deepest stages of the sleep cycle'),
    q('Although strong emotional experiences produce vivid memories, work by Elizabeth Loftus has shown that emotional ……… does not protect against factual error.', 'intensity', 'emotional intensity does not guarantee accuracy'),
    q('In the legal arena, studies have demonstrated that even a single word can lead a witness to report seeing ……… that was not present at the scene.', 'glass', 'to falsely remember broken glass at the scene — even when no broken glass had been present'),
    q('More recently, researchers have explored whether false ……… can be planted through suggestion, with significant implications for therapy and courtroom evidence.', 'memories', 'false memories can be deliberately implanted')
  ])
}

// Stage 5 P1 fill should have 7 items - missing hippocampus as Q10? 
// User answers: reconsolidation, consolidation, hippocampus, sleep, intensity, glass, memories
// Need 7 fill items - I only have 6. Add hippocampus.

const stage5Passage1Fixed: IntensivePassageLayout = {
  ...stage5Passage1,
  fill: fillBlock('How memory works', [
    q('Memory is best understood through the concept of ………, which describes why each recall involves potential alteration.', 'reconsolidation', 'Reconsolidation — the process by which retrieved memories are temporarily labile'),
    q('The stage at which new information is made permanent is known as ………, and it depends heavily on a brain structure called the ………', 'consolidation', 'through a process called consolidation. During consolidation, the hippocampus'),
    q('It depends heavily on a brain structure called the ………', 'hippocampus', 'the hippocampus — a seahorse-shaped structure in the medial temporal lobe — plays a central role'),
    q('Research has confirmed that this process is strengthened during a specific phase of sleep called slow-wave ………', 'sleep', 'During slow-wave sleep — the deepest stages of the sleep cycle'),
    q('Although strong emotional experiences produce vivid memories, work by Elizabeth Loftus has shown that emotional ……… does not protect against factual error.', 'intensity', 'emotional intensity does not guarantee accuracy'),
    q('In the legal arena, studies have demonstrated that even a single word can lead a witness to report seeing ……… that was not present at the scene.', 'glass', 'to falsely remember broken glass at the scene'),
    q('More recently, researchers have explored whether false ……… can be planted through suggestion.', 'memories', 'false memories can be deliberately implanted')
  ])
}

const esperantoHeadings = [
  'A vote that silenced generations of signers',
  'An internet era boost that fell short of transforming the language\'s status',
  'The founding vision of a language for all peoples',
  'Examining whether the project\'s limits were inevitable or circumstantial',
  'Early enthusiasm reaches a global scale',
  'The rejection of an international role by a powerful rival',
  'A community decimated by state ideology',
  'A proposal supported by millions but blocked by governments',
  'The challenge of competing with an already dominant world language',
  'The role of politics in limiting the language\'s reach'
]

const stage5Passage2: IntensivePassageLayout = {
  title: 'The Rise and Fall of Esperanto',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'In 1887, a Polish ophthalmologist named Ludwig Lazarus Zamenhof published a small booklet introducing a constructed language he called Lingvo Internacia — International Language. Writing under the pseudonym "Doktoro Esperanto," meaning "one who hopes," Zamenhof proposed a language designed to be both easy to learn and politically neutral, belonging to no single nation and therefore free from the cultural dominance that accompanies natural languages. The booklet attracted little attention at first, but it circulated among European intellectuals and within a decade had inspired a small but dedicated international following. The language itself became known simply by its creator\'s pseudonym: Esperanto.'],
    ['B', 'The grammatical structure of Esperanto was deliberately simple. All nouns ended in -o, all adjectives in -a, and verbs followed a consistent system of endings that indicated tense without exception or irregularity. Zamenhof drew the vocabulary primarily from Latin, Romance languages, and Germanic languages, making it relatively accessible to speakers of European languages while remaining unfamiliar enough to feel genuinely new. The entire grammar could be summarised in sixteen rules, and proponents claimed that a motivated learner could achieve basic competence within hours and conversational fluency within weeks — a claim that, while exaggerated, contained a kernel of truth compared with the years required to master languages such as Mandarin or Arabic.'],
    ['C', 'Esperanto attracted a passionate global community in the early twentieth century. The first World Esperanto Congress was held in Boulogne-sur-Mer in France in 1905, drawing delegates from twenty countries. Annual congresses followed, and by the 1920s the movement had established clubs, publishing houses, and correspondence networks spanning every inhabited continent. Prominent supporters included the Nobel Prize-winning chemist Wilhelm Ostwald, the writer Leo Tolstoy — who reportedly learned to read the language within hours — and various political figures who saw in Esperanto a vehicle for international peace. At the height of its pre-war popularity, the language had an estimated one million speakers worldwide.'],
    ['D', 'The dream of Esperanto becoming a globally adopted auxiliary language suffered its most severe blow from political violence rather than linguistic competition. Joseph Stalin, who viewed the Esperanto movement\'s internationalism with deep suspicion, ordered a systematic campaign of persecution beginning in the late 1930s. Thousands of Esperanto speakers in the Soviet Union were arrested, sent to labour camps, or executed — a purge so devastating that Esperanto groups effectively ceased to exist in the USSR for decades. In Nazi Germany, Esperanto speakers were similarly targeted, in part because Zamenhof was Jewish and because the movement\'s cosmopolitan values were antithetical to National Socialist ideology. Zamenhof\'s children were murdered in the Holocaust.'],
    ['E', 'The post-war period brought neither the collapse nor the triumph that observers on both sides had predicted. Esperanto was proposed as an official language of the newly formed United Nations but the proposal was rejected, largely at the insistence of France, which feared competition with French as the dominant language of international diplomacy. Despite this setback, the movement recovered and stabilised. The number of speakers grew steadily through the 1950s and 1960s, aided by the publication of textbooks in dozens of languages, the establishment of youth exchange programmes, and the gradual growth of an international Esperanto culture that included original literature, music, and theatrical performance.'],
    ['F', 'The emergence of the internet might have been expected to revitalise Esperanto. Online communication removed the practical barriers to finding other speakers, and Esperanto communities flourished on early internet forums and later on social media platforms. The language learning platform Duolingo launched an Esperanto course in 2015 and reported over two million registered learners within its first year — more than for some natural languages. Yet the overall number of fluent speakers has not grown proportionately, and researchers studying language spread suggest that the ease of learning Esperanto matters less in a world where English has already achieved the status of global auxiliary language that Zamenhof originally hoped his invention would occupy.'],
    ['G', 'Zamenhof\'s legacy is complex and contested. Linguists regard Esperanto as a successful demonstration that a constructed language can develop a living community — including native speakers, children who grew up speaking it as a first language in households where parents met through Esperanto — and that such a language can evolve naturally over generations. Historians of language planning debate whether the relative failure of Esperanto to achieve mainstream adoption reflects inherent flaws in the project or simply the contingency of historical events, including the persecution of its community at the precise moment when it might otherwise have consolidated its gains. The language survives, spoken by an estimated two million people today, as both a minority cultural practice and an enduring symbol of a particular kind of idealism.']
  ],
  headings: headingBlock(esperantoHeadings, [
    q('Paragraph A', 'iii', 'Zamenhof proposed a language designed to be both easy to learn and politically neutral, belonging to no single nation'),
    q('Paragraph B', 'i', 'The entire grammar could be summarised in sixteen rules, and proponents claimed that a motivated learner could achieve basic competence within hours'),
    q('Paragraph C', 'v', 'Esperanto attracted a passionate global community in the early twentieth century'),
    q('Paragraph D', 'vii', 'Thousands of Esperanto speakers in the Soviet Union were arrested, sent to labour camps, or executed'),
    q('Paragraph E', 'vi', 'Esperanto was proposed as an official language of the newly formed United Nations but the proposal was rejected, largely at the insistence of France'),
    q('Paragraph F', 'ii', 'The emergence of the internet might have been expected to revitalise Esperanto… Yet the overall number of fluent speakers has not grown proportionately'),
    q('Paragraph G', 'iv', 'Historians of language planning debate whether the relative failure of Esperanto to achieve mainstream adoption reflects inherent flaws in the project or simply the contingency of historical events')
  ]),
  tfng: tfngP2([
    q('Zamenhof chose a pseudonym for the publication of his language to protect himself from professional criticism within the medical community.', 'NOT GIVEN', 'Writing under the pseudonym "Doktoro Esperanto," meaning "one who hopes"'),
    q('The persecution of Esperanto speakers in the Soviet Union was connected to the movement\'s ideological opposition to nationalism.', 'TRUE', 'Stalin, who viewed the Esperanto movement\'s internationalism with deep suspicion, ordered a systematic campaign of persecution'),
    q('The Duolingo Esperanto course attracted more registered learners in its first year than any other language offered on that platform.', 'NOT GIVEN', 'reported over two million registered learners within its first year — more than for some natural languages')
  ]),
  fill: fillBlock('Esperanto through history', [
    q('Zamenhof designed Esperanto to belong to no single ………', 'nation', 'belonging to no single nation and therefore free from the cultural dominance that accompanies natural languages'),
    q('In the Soviet Union and Nazi Germany, thousands of Esperanto speakers suffered severe ………', 'persecution', 'ordered a systematic campaign of persecution'),
    q('Linguists point to the existence of children who grew up with it as their first ……… as evidence that a constructed language can develop genuine community roots.', 'language', 'children who grew up speaking it as a first language in households where parents met through Esperanto')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_1_5: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  1: [stage1Passage1, stage1Passage2],
  2: [stage2Passage1, stage2Passage2],
  3: [stage3Passage1, stage3Passage2],
  4: [stage4Passage1, stage4Passage2],
  5: [stage5Passage1Fixed, stage5Passage2]
}
