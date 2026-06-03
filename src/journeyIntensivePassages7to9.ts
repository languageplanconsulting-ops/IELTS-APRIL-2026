/**
 * Normal Reading Journey ด่าน 7–9 — Cambridge-style mixed format.
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

// ─── Stage 7: Microbiome + Marie Curie ───────────────────────────────────────

const stage7Passage1: IntensivePassageLayout = {
  title: 'The Microbiome and Human Health',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'The human body contains approximately 38 trillion microbial cells — bacteria, viruses, fungi, and archaea — most of which reside in the large intestine. Collectively known as the microbiome, these organisms were long regarded as passive passengers in the body, tolerated rather than welcomed. Research over the past two decades has fundamentally overturned this view. Scientists now understand that the microbiome plays active roles in digestion, immune regulation, hormone production, and even the modulation of mood and behaviour. The scale and intimacy of this relationship have led some researchers to describe the microbiome as a previously unrecognised organ.'],
    ['B', 'The composition of an individual\'s microbiome is shaped by a combination of genetics, birth method, infant feeding, antibiotic exposure, diet, and environment. Infants born vaginally acquire their initial microbial communities from the mother\'s birth canal, while those born by caesarean section are colonised primarily by skin and hospital environmental bacteria. Several studies have associated caesarean birth with higher rates of asthma, allergies, and certain autoimmune conditions in later life, though researchers caution that causation is difficult to establish because many other variables differ between the two groups. Breastfeeding further shapes microbial diversity, providing both beneficial bacteria and human milk oligosaccharides — complex sugars that the infant cannot digest but that selectively feed specific bacterial species.'],
    ['C', 'Diet is the most powerful ongoing influence on microbiome composition in adulthood. Diets high in fibre — particularly the fermentable fibres found in legumes, whole grains, and vegetables — promote the growth of bacteria that produce short-chain fatty acids, including butyrate, which provides energy for the cells lining the colon and has anti-inflammatory properties. Ultra-processed foods, by contrast, are associated with reduced microbial diversity and the proliferation of species linked to metabolic disease. A landmark study published in the journal Cell in 2021 found that a diet high in fermented foods produced a more diverse microbiome and measurably reduced markers of inflammation compared with a diet high in fibre alone.'],
    ['D', 'The relationship between the microbiome and the immune system is bidirectional. The gut contains approximately 70% of the body\'s immune cells, and the constant interaction between these cells and the microbial community calibrates immune tolerance — the ability to distinguish between harmful pathogens and harmless substances. Disruption of this calibration is now believed to underlie many allergic and autoimmune conditions. Research by Graham Rook of University College London has proposed the Old Friends Hypothesis, which holds that the immune system requires exposure to a range of microorganisms that co-evolved with humans in order to develop correctly, and that the reduction in such exposures in modern hygienic environments explains the dramatic rise in immune-related disorders over the past century.'],
    ['E', 'The gut-brain axis — the bidirectional communication network linking the intestine and the central nervous system — has emerged as one of the most surprising frontiers in microbiome research. The gut produces approximately 90% of the body\'s serotonin, and microbial activity influences both its production and the composition of other neuroactive compounds. Studies in germ-free mice — animals raised without any microorganisms — show profound differences in stress responses and anxiety-related behaviour compared with normal mice, and transplanting gut bacteria from anxious humans into germ-free mice has been shown to produce anxious behaviour in the recipient animals. Human trials of psychobiotic interventions — the use of specific bacteria to influence mental health — are at an early stage, but results have been promising enough to attract significant pharmaceutical investment.'],
    ['F', 'Antibiotic use represents the most significant threat to microbiome health at both individual and population level. A single course of broad-spectrum antibiotics can eliminate hundreds of bacterial species, and recovery of pre-treatment diversity may take months or years. In some individuals, particularly the elderly or those with already depleted microbiomes, recovery may be incomplete. The proliferation of antibiotic-resistant bacteria — a consequence of both overuse in human medicine and widespread use in livestock farming — has made this problem increasingly severe. Faecal microbiota transplantation, in which stool from a healthy donor is introduced into the gut of a patient, has shown remarkable effectiveness in treating recurrent Clostridioides difficile infection, which is typically triggered by antibiotic disruption of the microbiome.'],
    ['G', 'Despite the rapid accumulation of evidence, researchers warn against premature clinical application. Much microbiome science is correlational: it shows that certain microbial profiles are associated with certain health states without establishing that the microbiome is causing those states rather than simply reflecting them. The probiotic supplement industry has capitalised on public enthusiasm ahead of the science, marketing products with health claims that frequently outpace the available evidence. Rigorous clinical trials of microbiome-based interventions remain relatively few, and the field faces the additional challenge that the microbiome is highly individual, making generalised recommendations of limited value for any specific person.']
  ],
  tfng: tfng([
    q('Scientists have only recently come to understand that the microbiome plays an active role in bodily functions beyond digestion.', 'TRUE', 'Research over the past two decades has fundamentally overturned this view. Scientists now understand that the microbiome plays active roles in digestion, immune regulation, hormone production, and even the modulation of mood and behaviour'),
    q('Children born by caesarean section have been conclusively proven to develop asthma because of differences in their early microbial exposure.', 'FALSE', 'researchers caution that causation is difficult to establish because many other variables differ between the two groups'),
    q('Human milk oligosaccharides are digested directly by the infant to provide energy for early development.', 'FALSE', 'human milk oligosaccharides — complex sugars that the infant cannot digest but that selectively feed specific bacterial species'),
    q('The 2021 Cell study found that consuming fermented foods produced greater reductions in inflammation than consuming fibre-rich foods alone.', 'TRUE', 'a diet high in fermented foods produced a more diverse microbiome and measurably reduced markers of inflammation compared with a diet high in fibre alone'),
    q('Graham Rook\'s Old Friends Hypothesis has been formally adopted as the basis of treatment guidelines for allergic conditions in the United Kingdom.', 'NOT GIVEN', 'Research by Graham Rook of University College London has proposed the Old Friends Hypothesis'),
    q('Faecal microbiota transplantation has demonstrated notable success in patients suffering from infections related to antibiotic disruption of their gut bacteria.', 'TRUE', 'Faecal microbiota transplantation… has shown remarkable effectiveness in treating recurrent Clostridioides difficile infection, which is typically triggered by antibiotic disruption of the microbiome'),
    q('The probiotic supplement industry has been criticised for making health claims that are not adequately supported by current research.', 'TRUE', 'marketing products with health claims that frequently outpace the available evidence')
  ]),
  fill: fillBlock('The microbiome and its effects on health', [
    q('The community of microorganisms living in the human body is collectively referred to as the ……… .', 'microbiome', 'Collectively known as the microbiome'),
    q('One of the most important short-chain fatty acids produced when gut bacteria break down dietary fibre is ……… , which both energises cells lining the digestive tract and reduces inflammation.', 'butyrate', 'short-chain fatty acids, including butyrate, which provides energy for the cells lining the colon and has anti-inflammatory properties'),
    q('The hypothesis that modern immune disorders stem from insufficient contact with ancient microorganisms is known as the Old Friends ……… .', 'Hypothesis', 'the Old Friends Hypothesis', { acceptedAnswers: ['hypothesis'] }),
    q('Communication between the intestine and the brain occurs through what researchers call the gut-brain ……… .', 'axis', 'The gut-brain axis — the bidirectional communication network linking the intestine and the central nervous system'),
    q('Studies conducted on germ-free ……… have shown that the absence of gut bacteria produces measurable changes in anxiety and stress responses.', 'mice', 'Studies in germ-free mice — animals raised without any microorganisms — show profound differences in stress responses and anxiety-related behaviour'),
    q('The procedure involving the transfer of stool from a healthy person into a sick patient is known as faecal microbiota ……… .', 'transplantation', 'Faecal microbiota transplantation, in which stool from a healthy donor is introduced into the gut of a patient'),
    q('Despite growing interest, scientists caution that most microbiome findings remain ……… in nature, showing association rather than proven cause.', 'correlational', 'Much microbiome science is correlational: it shows that certain microbial profiles are associated with certain health states without establishing that the microbiome is causing those states')
  ])
}

const curieHeadings = [
  'A crucial experiment identifies where atomic emissions originate',
  'Triumph abroad while facing exclusion and attack at home',
  'Barriers to formal learning overcome through determination',
  'A wartime contribution that changed surgical outcomes',
  'Isolating new substances from a vast quantity of raw material',
  'Recognition shared across two fields of science',
  'A fatal consequence of working without knowledge of the danger',
  'The beginning of a systematic investigation into a puzzling phenomenon',
  'Personal sacrifice in service of an expanding scientific field',
  'An early discovery that challenged accepted thinking about matter'
]

const stage7Passage2: IntensivePassageLayout = {
  title: 'Marie Curie and the Science of Radioactivity',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'Maria Sklodowska was born in Warsaw in 1867, the youngest of five children of two schoolteachers in a Poland then under Russian imperial rule. Education for women was officially restricted, and she participated in the underground Floating University — a clandestine network of classes held in private homes — before travelling to Paris in 1891 to study physics and mathematics at the Sorbonne. She graduated first in her physics degree in 1893 and second in mathematics the following year, supporting herself throughout on a scholarship and her own earnings. She adopted the French form of her first name and became known as Marie.'],
    ['B', 'In 1896, the French physicist Henri Becquerel discovered that uranium emitted rays capable of fogging photographic plates without any external energy source, a phenomenon he could not explain. Marie Curie, then searching for a doctoral research topic, chose to investigate the source of these mysterious emissions. Using an electrometer — an instrument co-developed by her husband Pierre — she measured the electrical conductivity of air exposed to uranium rays and discovered that the intensity of emission was directly proportional to the quantity of uranium present, regardless of its chemical state or physical form. This observation led her to propose that the emission originated within the uranium atom itself — a radical claim at a time when the atom was still considered indivisible.'],
    ['C', 'Curie coined the term "radioactivity" to describe this atomic property and soon discovered that the element thorium was also radioactive. When she began testing samples of pitchblende — a uranium-bearing mineral ore — she found that their radioactivity was far greater than could be accounted for by their uranium content alone, suggesting the presence of one or more undiscovered elements. Working in a leaking shed that served as their makeshift laboratory, she and Pierre processed tonnes of pitchblende over four years, isolating trace quantities of two new elements, which she named polonium — after her homeland — and radium. The discovery required processing several tonnes of ore to obtain a fraction of a gram of pure material.'],
    ['D', 'In 1903, Marie Curie became the first woman to be awarded a doctorate in physics in France. In the same year, she and Pierre, together with Henri Becquerel, were awarded the Nobel Prize in Physics for their joint research on radioactivity. The prize nomination had originally included only Pierre and Becquerel; it was Pierre who insisted that Marie be included. Following Pierre\'s death in a road accident in 1906, Marie was appointed to his professorship at the Sorbonne, becoming the institution\'s first female professor. In 1911, she was awarded a second Nobel Prize — this time in Chemistry, for the discovery and isolation of radium and polonium — making her the first person in history to win Nobel Prizes in two different scientific disciplines.'],
    ['E', 'Despite her extraordinary achievements, Curie faced persistent hostility from the French scientific establishment. In 1911, the same year she received her second Nobel Prize, she was narrowly rejected for membership of the French Academy of Sciences by two votes — the Academy would not admit a woman member until 1962. Her personal life became the subject of a damaging public scandal when French newspapers reported her romantic relationship with physicist Paul Langevin, a widower. The coverage was intensely xenophobic, portraying her as a foreign woman disrupting a French family, and death threats were sent to her home. The Nobel Committee wrote to her suggesting she not attend the ceremony in Stockholm, advice she disregarded.'],
    ['F', 'The practical applications of radioactivity research during the First World War gave Curie\'s work a dimension beyond the laboratory. Recognising that X-ray imaging could locate shrapnel and broken bones in wounded soldiers, she developed mobile radiography units — vehicles equipped with X-ray machines and powered by dynamos — which she drove herself to field hospitals near the front lines. These units, which became known colloquially as petites Curies, performed over a million X-ray examinations during the war. Curie trained 150 women to operate them, establishing France\'s first radiology training programme. The units dramatically reduced the rate of unnecessary amputation in French military hospitals.'],
    ['G', 'Marie Curie died in 1934 from aplastic anaemia, a condition caused by prolonged exposure to ionising radiation. She had worked for decades without the protective equipment that later became standard in radiological practice, carrying test tubes of radioactive isotopes in her coat pocket and storing them in her desk drawer. Her laboratory notebooks remain so radioactive that they are kept in lead-lined boxes in the Bibliothèque nationale de France and researchers wishing to consult them are required to sign a waiver acknowledging the health risk. The story of her death transformed her into a symbol of scientific self-sacrifice, though historians of science note that she was not unusual among early radiation researchers in her ignorance of the risks.']
  ],
  headings: headingBlock(curieHeadings, [
    q('Paragraph A', 'iii', 'Education for women was officially restricted, and she participated in the underground Floating University'),
    q('Paragraph B', 'i', 'she measured the electrical conductivity of air exposed to uranium rays and discovered that the intensity of emission was directly proportional to the quantity of uranium present'),
    q('Paragraph C', 'v', 'she and Pierre processed tonnes of pitchblende over four years, isolating trace quantities of two new elements'),
    q('Paragraph D', 'vi', 'she was awarded a second Nobel Prize — this time in Chemistry… making her the first person in history to win Nobel Prizes in two different scientific disciplines'),
    q('Paragraph E', 'ii', 'she was narrowly rejected for membership of the French Academy of Sciences… death threats were sent to her home'),
    q('Paragraph F', 'iv', 'The units dramatically reduced the rate of unnecessary amputation in French military hospitals'),
    q('Paragraph G', 'vii', 'Marie Curie died in 1934 from aplastic anaemia, a condition caused by prolonged exposure to ionising radiation… her ignorance of the risks')
  ]),
  tfng: tfngP2([
    q('Pierre Curie played a role in ensuring that Marie received credit for their shared work on radioactivity.', 'TRUE', 'The prize nomination had originally included only Pierre and Becquerel; it was Pierre who insisted that Marie be included'),
    q('The French Academy of Sciences changed its policy on female membership within ten years of rejecting Marie Curie\'s application.', 'FALSE', 'the Academy would not admit a woman member until 1962'),
    q('Marie Curie was the only member of her mobile radiography programme to personally operate the X-ray equipment at the front.', 'NOT GIVEN', 'she drove herself to field hospitals near the front lines… Curie trained 150 women to operate them')
  ]),
  fill: fillBlock('Marie Curie\'s scientific legacy', [
    q('Marie Curie\'s most enduring scientific contribution was coining the word ……… to describe the property by which certain elements emit energy from within their atoms.', 'radioactivity', 'Curie coined the term "radioactivity" to describe this atomic property'),
    q('Her discovery of two previously unknown elements required the laborious processing of large quantities of the ore known as ……… .', 'pitchblende', 'When she began testing samples of pitchblende — a uranium-bearing mineral ore'),
    q('Her death was caused by aplastic ……… , a condition that resulted from years of unprotected exposure to the materials she studied.', 'anaemia', 'Marie Curie died in 1934 from aplastic anaemia, a condition caused by prolonged exposure to ionising radiation')
  ])
}

// ─── Stage 8: Ocean Acidification + Transcontinental Railroad ─────────────────

const stage8Passage1: IntensivePassageLayout = {
  title: 'Ocean Acidification',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'The world\'s oceans absorb approximately 25 to 30 percent of the carbon dioxide released into the atmosphere each year through human activity. This absorption moderates the pace of climate change by removing greenhouse gas from the air, but it does so at a significant cost to marine chemistry. When carbon dioxide dissolves in seawater, it reacts to form carbonic acid, which then partially dissociates into bicarbonate and hydrogen ions. The increase in hydrogen ion concentration lowers the pH of seawater — a process called ocean acidification — and reduces the availability of carbonate ions, which are essential for the construction of shells, skeletons, and other calcium carbonate structures by marine organisms.'],
    ['B', 'Ocean pH has fallen by approximately 0.1 units since the beginning of the industrial era, a change that represents a 26% increase in acidity. This may appear modest, but the pH scale is logarithmic, meaning that each unit change represents a tenfold change in hydrogen ion concentration. Current emissions trajectories suggest a further decline of 0.3 to 0.4 units by the end of the century under high-emissions scenarios — a rate of acidification with no known precedent in the past 300 million years of ocean history. Some geological records suggest that past rapid acidification events coincided with mass extinction episodes, though the mechanisms linking acidification to extinction remain debated.'],
    ['C', 'Coral reefs are among the most visible casualties of acidification. Corals build their skeletons from aragonite, a form of calcium carbonate that is particularly sensitive to changes in carbonate ion availability. As carbonate ion concentrations decline, corals must expend more energy to maintain calcification, leaving less energy available for growth, reproduction, and immune function. At aragonite saturation levels projected for the end of the century, many existing reef systems would be unable to maintain their structural integrity. Research stations in naturally acidified areas of the ocean — such as volcanic CO₂ seeps near Papua New Guinea — provide a preview of future conditions and show dramatic reductions in coral diversity and complexity.'],
    ['D', 'Pteropods — small free-swimming molluscs known informally as sea butterflies — provide some of the clearest evidence of acidification damage currently occurring. These organisms play a critical role in marine food webs, forming a primary food source for fish, whales, and seabirds across polar and subpolar regions. Studies conducted in the Southern Ocean have documented that the shells of pteropods collected from areas of naturally upwelling deep water — which is colder and more acidic than surface water — show severe dissolution, with shells riddled with pits and cavities. Because pteropods make up a substantial portion of the diet of Pacific salmon, their decline would carry consequences far up the food chain.'],
    ['E', 'Not all marine organisms respond to acidification in the same way. Some species of algae and certain invertebrates with low-magnesium calcite skeletons appear to be relatively tolerant of lower pH, and a small number of species show enhanced growth under elevated CO₂ conditions. These differential responses raise the possibility of significant ecological restructuring in a more acidic ocean, with tolerant species displacing sensitive ones in altered community compositions. However, researchers caution that laboratory experiments testing individual species responses may not capture the full complexity of real ecosystems, where multiple stressors — temperature, deoxygenation, and pollution — interact simultaneously with acidification.'],
    ['F', 'The economic implications of ocean acidification extend to fisheries and aquaculture worldwide. Oysters, mussels, clams, and other bivalves are commercially important species whose early life stages are highly sensitive to decreases in carbonate ion availability. Hatcheries producing oyster seed on the west coast of the United States have already reported significant production failures attributable to acidified upwelling water entering their facilities, and several operations have been forced to install seawater treatment systems that buffer pH before water reaches larvae. The global shellfish industry is valued at over 19 billion US dollars annually, and researchers project that continued acidification without mitigation could reduce production by 10 to 25 percent by mid-century.'],
    ['G', 'Addressing ocean acidification ultimately requires reducing atmospheric CO₂ — there is no alternative intervention capable of reversing the underlying chemical change at ocean scale. Localised interventions such as adding alkaline materials to coastal waters have shown promise in small-scale experiments, but their scalability, cost, and potential ecological side effects remain poorly understood. Marine protected areas can reduce additional stressors such as pollution and overfishing, thereby improving the resilience of reef and shellfish communities to acidification, but they cannot address the chemical cause directly. Scientists and policymakers broadly agree that ocean acidification represents one of the strongest arguments for urgent global emissions reduction.']
  ],
  tfng: tfng([
    q('The oceans absorb less than half of all carbon dioxide produced by human activities each year.', 'TRUE', 'The world\'s oceans absorb approximately 25 to 30 percent of the carbon dioxide released into the atmosphere each year'),
    q('Scientists have confirmed that past episodes of rapid ocean acidification were the direct cause of mass extinctions.', 'FALSE', 'the mechanisms linking acidification to extinction remain debated'),
    q('Coral reefs near volcanic CO₂ seeps in Papua New Guinea currently experience conditions similar to those expected globally by the end of the century.', 'TRUE', 'volcanic CO₂ seeps near Papua New Guinea — provide a preview of future conditions'),
    q('A decline in pteropod populations would have no significant effect on commercially harvested fish species.', 'FALSE', 'Because pteropods make up a substantial portion of the diet of Pacific salmon, their decline would carry consequences far up the food chain'),
    q('Researchers have identified certain marine species that appear to grow better when CO₂ levels in the water are higher.', 'TRUE', 'a small number of species show enhanced growth under elevated CO₂ conditions'),
    q('Oyster hatcheries on the west coast of the United States have installed equipment to alter the chemical properties of incoming water.', 'TRUE', 'several operations have been forced to install seawater treatment systems that buffer pH before water reaches larvae'),
    q('International agreements on ocean acidification have already produced measurable reductions in seawater acidity in some regions.', 'NOT GIVEN', 'Addressing ocean acidification ultimately requires reducing atmospheric CO₂')
  ]),
  fill: fillBlock('Ocean chemistry and its consequences', [
    q('When carbon dioxide from the atmosphere enters the ocean, it produces carbonic ……… , which reduces the availability of carbonate ions needed by marine creatures to build their shells and skeletons.', 'acid', 'When carbon dioxide dissolves in seawater, it reacts to form carbonic acid'),
    q('This process is known as ocean ……… .', 'acidification', 'a process called ocean acidification'),
    q('Among the most vulnerable organisms are ……… , free-swimming molluscs whose shells have been observed dissolving in naturally acidic upwelling zones.', 'Pteropods', 'Pteropods — small free-swimming molluscs known informally as sea butterflies', { acceptedAnswers: ['pteropods'] }),
    q('These creatures are a vital food source for species including Pacific ……… , meaning their decline would affect commercially important fish catches.', 'salmon', 'pteropods make up a substantial portion of the diet of Pacific salmon'),
    q('Meanwhile, oyster ……… on the United States west coast have already suffered production losses due to acidified water.', 'hatcheries', 'Hatcheries producing oyster seed on the west coast of the United States'),
    q('One localised response under investigation involves altering coastal ……… chemistry.', 'water', 'adding alkaline materials to coastal waters'),
    q('Scientists agree that the only true solution lies in reducing global ……… , which is the root source of the chemical change.', 'emissions', 'urgent global emissions reduction')
  ])
}

const railroadHeadings = [
  'A technical breakthrough achieved by a misunderstood workforce',
  'Legislative support and financial incentives for a national project',
  'Exploitation of labour hidden from the historical record',
  'A moment of celebration that united a divided nation',
  'Corruption among those entrusted with public resources',
  'Forced labour used to meet a critical shortage of workers',
  'A lasting mark on the land and its original inhabitants',
  'The different labour forces on either side of the project',
  'An achievement that reshaped the geography of everyday travel',
  'Profits concealed within the structure of the project itself'
]

const stage8Passage2: IntensivePassageLayout = {
  title: 'The Building of the Transcontinental Railroad',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'On 10 May 1869, a golden spike was driven into the ground at Promontory Summit in the Utah Territory, completing the first transcontinental railroad across the United States. The moment was celebrated with telegraphed messages that sent crowds into the streets of cities from New York to San Francisco. The railroad — constructed simultaneously from east and west by two competing companies — had taken six years to build and had crossed nearly 2,000 miles of prairies, deserts, and mountains. It would shrink the journey between the Atlantic and Pacific coasts from several months by wagon or ship to less than a week by rail.'],
    ['B', 'The project had its origins in the territorial ambitions of the United States government and the commercial interests of a small group of investors. Congress authorised the railroad in the Pacific Railroad Act of 1862, providing land grants and government bonds to two companies: the Union Pacific, building westward from Omaha, Nebraska, and the Central Pacific, building eastward from Sacramento, California. The government subsidised each mile of track with bonds worth between 16,000 and 48,000 dollars depending on terrain, and granted both companies large parcels of public land on either side of the completed route that they could sell to settlers and developers.'],
    ['C', 'The Union Pacific relied primarily on the labour of Irish immigrants and Civil War veterans, many of whom moved westward across the Great Plains in temporary mobile camps that followed the track as it advanced. The work was physically brutal: temperatures on the open plains ranged from extreme cold in winter to over 100 degrees Fahrenheit in summer, and the flat terrain was punctuated by river crossings and occasional Indigenous resistance. The Central Pacific faced a more immediate obstacle: a severe shortage of workers in California. To address this, the company recruited thousands of workers from China, initially over the objections of some managers who doubted their physical capability. Chinese workers ultimately made up approximately 80 to 90 percent of the Central Pacific\'s labour force.'],
    ['D', 'The Chinese workers proved indispensable when the Central Pacific reached the Sierra Nevada mountain range in California — the most technically demanding section of the entire project. The mountains required the drilling and blasting of tunnels through solid granite at high altitude, work that demanded precision and patience rather than brute force. Chinese workers pioneered the use of controlled nitroglycerin blasting in the Summit Tunnel, replacing slower black powder methods and dramatically increasing the rate of progress through the rock. In one of the most remarkable feats of the project, workers were lowered in hand-woven reed baskets to drill and place charges on sheer cliff faces, completing sections that conventional scaffolding could not reach.'],
    ['E', 'The construction of the railroad was accompanied by widespread corruption. The most notorious case involved the Crédit Mobilier of America, a construction company secretly controlled by the principal shareholders of the Union Pacific. These shareholders awarded Crédit Mobilier contracts at inflated prices, generating profits of an estimated 23 million dollars above the actual construction costs, which were ultimately borne by the US government. To prevent congressional investigation, shares in the company were distributed to influential members of Congress. The scandal eventually became public in 1872, implicating the sitting Vice President and several prominent legislators, though most escaped serious legal consequence.'],
    ['F', 'The human cost of the project was disproportionately borne by the workers least protected by law or public sympathy. Chinese workers received lower wages than their Irish counterparts for the same work, were housed separately, and were excluded from the celebrations at Promontory Summit — their faces absent from the famous photograph of the golden spike ceremony. When Chinese workers on the Central Pacific organised a strike in 1867 demanding equal pay, an eight-hour day, and the right not to be subjected to physical punishment, the company responded by cutting off their food supply until the strike collapsed after a week. Their contributions went largely unacknowledged for over a century.'],
    ['G', 'The long-term consequences of the transcontinental railroad transformed the United States. It accelerated the displacement and destruction of Indigenous communities by opening vast new territories to settler expansion, enabled the near-total extermination of the bison herds on which Plains Indigenous peoples depended, and drove the development of towns, cities, and industries across the interior of the continent. It also tied the economies of the Pacific coast more closely to those of the east, reducing regional divergence and laying economic foundations for American industrial growth in the late nineteenth and early twentieth centuries. The railroad remains one of the most consequential — and most contested — engineering projects in American history.']
  ],
  headings: headingBlock(railroadHeadings, [
    q('Paragraph A', 'ix', 'completing the first transcontinental railroad across the United States… shrink the journey between the Atlantic and Pacific coasts from several months… to less than a week by rail'),
    q('Paragraph B', 'ii', 'Congress authorised the railroad in the Pacific Railroad Act of 1862, providing land grants and government bonds'),
    q('Paragraph C', 'viii', 'The Union Pacific relied primarily on the labour of Irish immigrants… The Central Pacific… recruited thousands of workers from China'),
    q('Paragraph D', 'i', 'Chinese workers pioneered the use of controlled nitroglycerin blasting in the Summit Tunnel, dramatically increasing the rate of progress through the rock'),
    q('Paragraph E', 'x', 'a construction company secretly controlled by the principal shareholders of the Union Pacific… awarded Crédit Mobilier contracts at inflated prices'),
    q('Paragraph F', 'iii', 'Chinese workers received lower wages… were excluded from the celebrations at Promontory Summit… Their contributions went largely unacknowledged for over a century'),
    q('Paragraph G', 'vii', 'It accelerated the displacement and destruction of Indigenous communities… enabled the near-total extermination of the bison herds')
  ]),
  tfng: tfngP2([
    q('Some managers at the Central Pacific initially expressed doubt about whether Chinese workers were suitable for the demanding physical labour required.', 'TRUE', 'initially over the objections of some managers who doubted their physical capability'),
    q('The workers who organised the 1867 strike on the Central Pacific were dismissed from the project following its failure.', 'NOT GIVEN', 'the company responded by cutting off their food supply until the strike collapsed after a week'),
    q('The Crédit Mobilier scandal resulted in the imprisonment of at least one sitting member of Congress.', 'FALSE', 'most escaped serious legal consequence')
  ]),
  fill: fillBlock('Financing and construction of the railroad', [
    q('The transcontinental railroad was financed partly through government ……… awarded to the construction companies based on the difficulty of the terrain they crossed.', 'bonds', 'providing land grants and government bonds to two companies'),
    q('The most technically demanding section was the Summit ……… , which Chinese workers completed using a new explosive method involving nitroglycerin.', 'Tunnel', 'Chinese workers pioneered the use of controlled nitroglycerin blasting in the Summit Tunnel', { acceptedAnswers: ['tunnel'] }),
    q('The Crédit Mobilier ……… later revealed that the financial arrangements underpinning the project had been used to generate enormous private profits at public expense.', 'scandal', 'The scandal eventually became public in 1872')
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
