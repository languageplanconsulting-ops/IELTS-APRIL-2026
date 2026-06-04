/**
 * Normal Reading Journey ด่าน 12 — Cambridge-style mixed format.
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

const stage12Passage1: IntensivePassageLayout = {
  title: 'The Rise of Antibiotic Resistance',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'When Alexander Fleming accepted the Nobel Prize in 1945, he issued a warning that his audience largely disregarded. Penicillin, he said, could be misused — taken in insufficient doses or for the wrong conditions — causing bacteria to develop resistance, rendering the drug ineffective. The world did not listen carefully enough. Nearly eight decades later, antimicrobial resistance has become one of the most serious threats to global public health, responsible for an estimated 1.27 million deaths directly attributable to resistant infections in 2019 alone and linked to nearly five million deaths in which resistant organisms were a contributing factor.'],
    ['B', 'The mechanism by which bacteria develop resistance is a product of natural selection operating at extraordinary speed. When a population of bacteria is exposed to an antibiotic, most individuals die. A small number, however, carry random genetic mutations that allow them to survive — by producing enzymes that break down the drug, by pumping the antibiotic out of their cells, or by altering the cellular target the drug was designed to attack. These survivors reproduce rapidly, and within hours a population of resistant bacteria can emerge from the survivors of a single course of treatment. The problem is compounded by horizontal gene transfer, through which bacteria share resistance genes not only with their own offspring but with unrelated bacterial species, spreading resistance across entire ecosystems.'],
    ['C', 'Antibiotic overuse in human medicine has been identified as a primary driver of resistance. In many countries, antibiotics are prescribed for viral infections — colds, influenza, and most sore throats — against which they are entirely ineffective, exposing bacterial populations to antibiotic pressure without any therapeutic justification. Self-medication with antibiotics purchased without prescription is widespread in low- and middle-income countries, where regulatory enforcement is limited. In both cases, incomplete courses of treatment — in which patients stop taking medication once they feel better rather than completing the full prescription — allow partially resistant bacteria to survive and multiply. The World Health Organization has identified the inappropriate use of antibiotics as the leading cause of resistance development in human medicine.'],
    ['D', 'The use of antibiotics in food-producing animals has contributed substantially to the resistance crisis. Livestock in many countries are given antibiotics not only to treat infection but as growth promoters — a practice that exposes vast bacterial populations in agricultural settings to continuous, low-level antibiotic pressure. Resistant bacteria from livestock can transfer to humans through direct contact, through the food supply, or through environmental contamination of water and soil. The European Union banned the use of antibiotics as growth promoters in 2006, and early evidence suggests that resistance rates for some organisms have declined as a result. The United States phased out their use in food-producing animals under veterinary oversight by 2017, though critics argue that enforcement has been inconsistent.'],
    ['E', 'The pharmaceutical pipeline for new antibiotics has largely dried up. Developing a new antibiotic is scientifically challenging, commercially unattractive, and subject to the same resistance pressures as existing drugs. Because antibiotics are taken for short courses and then discontinued, they generate far less revenue than drugs for chronic conditions such as diabetes or heart disease, which patients take daily for years. The last major new class of antibiotics — lipopeptides — was approved in 2003. Several large pharmaceutical companies have exited antibiotic research entirely, and the burden has fallen increasingly on small biotechnology firms and publicly funded programmes. Without new antibiotics entering the pipeline, the effectiveness of medicine as a whole is threatened: routine surgeries, cancer chemotherapy, and organ transplantation all depend on functioning antibiotics to prevent and treat infection.'],
    ['F', 'Several strategies are being pursued simultaneously to address the crisis. Antibiotic stewardship programmes — structured approaches to optimising the selection, dosage, and duration of antibiotic prescribing — have demonstrated measurable reductions in resistance rates in hospitals and community settings. Rapid diagnostic testing, which allows clinicians to identify the specific causative organism of an infection within hours rather than waiting days for culture results, reduces the unnecessary prescription of broad-spectrum antibiotics. Vaccines against bacterial infections such as pneumococcal disease and meningitis reduce the incidence of infections requiring antibiotic treatment. Alternative approaches, including phage therapy — in which viruses that target specific bacteria are used to treat infections — are progressing through clinical trials, though none has yet achieved regulatory approval for routine use.'],
    ['G', 'The governance of antibiotic resistance requires international coordination that has so far been difficult to achieve. Resistance genes do not respect national borders: a resistant organism emerging in one country can spread globally within weeks through travel and trade. The development of a global treaty on antibiotic use — analogous to climate agreements — has been discussed in international forums but faces the same collective action problems that have impeded other global health governance efforts. High-income countries have the resources to implement stewardship programmes and fund research; low- and middle-income countries, which carry the greatest burden of resistant infections, have fewer resources to do so and face the additional tension between restricting access to medicines and ensuring that those who need them can obtain them.']
  ],
  tfng: tfng([
    q('Fleming predicted at the time of his Nobel Prize that bacteria might become resistant to penicillin if the drug was misused.', 'TRUE', 'Penicillin, he said, could be misused — taken in insufficient doses or for the wrong conditions — causing bacteria to develop resistance'),
    q('Bacteria can transfer resistance genes to other bacterial species that are entirely unrelated to them.', 'TRUE', 'bacteria share resistance genes not only with their own offspring but with unrelated bacterial species'),
    q('The World Health Organization has classified antibiotic resistance as a greater public health threat than climate change.', 'NOT GIVEN', 'The World Health Organization has identified the inappropriate use of antibiotics as the leading cause of resistance development in human medicine'),
    q('The European Union\'s decision to prohibit antibiotic growth promoters in livestock has been followed by some improvement in resistance rates for certain organisms.', 'TRUE', 'The European Union banned the use of antibiotics as growth promoters in 2006, and early evidence suggests that resistance rates for some organisms have declined as a result'),
    q('No new class of antibiotics has received regulatory approval since the early 2000s.', 'TRUE', 'The last major new class of antibiotics — lipopeptides — was approved in 2003'),
    q('Phage therapy has already been approved by regulatory authorities for routine clinical use in at least one country.', 'FALSE', 'phage therapy… is progressing through clinical trials, though none has yet achieved regulatory approval for routine use'),
    q('Resistance genes identified in bacteria from livestock in South America have been found in human patients in Europe.', 'NOT GIVEN', 'Resistant bacteria from livestock can transfer to humans through direct contact, through the food supply, or through environmental contamination of water and soil')
  ]),
  fill: fillBlock('Causes and responses to antibiotic resistance', [
    q('The spread of antibiotic resistance is driven by the process of natural ……… , which allows bacteria carrying useful mutations to survive and reproduce.', 'selection', 'The mechanism by which bacteria develop resistance is a product of natural selection operating at extraordinary speed'),
    q('One way bacteria resist drugs is by releasing ……… that break down antibiotic molecules before they can act.', 'enzymes', 'by producing enzymes that break down the drug'),
    q('A further route for spreading resistance is when bacteria pass ……… to other species that are completely unrelated to them.', 'genes', 'bacteria share resistance genes not only with their own offspring but with unrelated bacterial species'),
    q('In human medicine, antibiotics are frequently prescribed for viral ……… such as colds and flu, despite having no effect on viruses.', 'infections', 'antibiotics are prescribed for viral infections — colds, influenza, and most sore throats'),
    q('In agriculture, the practice of using antibiotics to speed up animal ……… was banned in the European Union in 2006.', 'growth', 'antibiotics as growth promoters'),
    q('Hospitals have introduced structured ……… to ensure antibiotics are only prescribed when genuinely needed.', 'programmes', 'Antibiotic stewardship programmes — structured approaches to optimising the selection, dosage, and duration of antibiotic prescribing'),
    q('An experimental treatment that uses ……… to destroy specific bacteria is currently being tested in clinical trials.', 'viruses', 'phage therapy — in which viruses that target specific bacteria are used to treat infections')
  ])
}

const olympicHeadings = [
  'A programme of events that grew more diverse over many centuries',
  'A founding vision rooted in educational and nationalist concerns',
  'A centuries-old tradition finally extended to all competitors',
  'Revenue, sponsorship, and the question of who truly benefits',
  'A ceremonial gathering with rules designed to protect participants',
  'Political tensions that overshadowed athletic competition',
  'The first modern event: national triumph and a contested future',
  'A gradual and contested path toward equal participation',
  'An ancient institution governed by religious and civic tradition',
  'Protest, boycott, and violence on the global stage'
]

const stage12Passage2: IntensivePassageLayout = {
  title: 'The History of the Olympic Games',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'The ancient Olympic Games were held at Olympia in the Peloponnese region of Greece from at least 776 BCE — the date of the earliest surviving victor list — until their abolition by the Roman Emperor Theodosius I in 393 CE, a span of over a thousand years. They were held every four years in honour of Zeus and formed part of a broader cycle of Panhellenic games that also included the Pythian, Isthmian, and Nemean Games. The athletes who competed were free Greek men — slaves and women were excluded from participation — and the prizes were symbolic: wreaths of olive branches at Olympia, laurel at the Pythian Games. The period of the games was accompanied by a sacred truce, known as the ekecheiria, that suspended armed conflict across the Greek world.'],
    ['B', 'The ancient games included a range of athletic competitions that evolved over the centuries. The earliest events were foot races of various distances, including the stadion — a sprint of approximately 192 metres, the length of the ancient stadium at Olympia — which remained the most prestigious event throughout the games\' history. Combat sports were added over time, including wrestling, boxing, and the pankration — a violent combination of wrestling and striking with few rules, in which competitors were sometimes killed. The pentathlon, introduced in 708 BCE, combined the discus, javelin, long jump, running, and wrestling in a single competition. Equestrian events were among the most costly and prestigious, since the prize went to the owner of the winning horse or chariot rather than to the rider or driver.'],
    ['C', 'The modern Olympic Games were the creation of Pierre de Coubertin, a French educator and sports historian who believed that physical education had been neglected in French schools following France\'s defeat in the Franco-Prussian War of 1870. Inspired by a visit to the ancient site of Olympia and by the revival of athletic festivals at Much Wenlock in Shropshire, England, de Coubertin proposed at an international conference in Paris in 1894 that a new international games be organised on a four-year cycle. The International Olympic Committee was established at that conference with de Coubertin as its secretary-general, and Athens was chosen as the site for the first modern Games.'],
    ['D', 'The first modern Olympic Games were held in Athens in April 1896. Fourteen nations sent athletes — 241 in total, all male — to compete in 43 events across nine sports. Greece sent the largest contingent and won the most medals overall. The marathon — a race of approximately 40 kilometres from the town of Marathon to the stadium in Athens, commemorating the legendary run of the Athenian messenger Pheidippides — was won by a Greek shepherd named Spyridon Louis, whose victory in front of a crowd of over 100,000 spectators generated enormous national celebration. The 1896 Games were widely considered a success, and Athens petitioned to host all future Games permanently — a proposal that de Coubertin resisted.'],
    ['E', 'Women\'s participation in the modern Olympics developed slowly and against persistent resistance. Women were excluded from the first Games in 1896, and Pierre de Coubertin opposed their inclusion throughout his tenure as IOC president, arguing that the presence of women competing would be \'impractical, uninteresting, unaesthetic, and incorrect.\' Women first competed at the 1900 Paris Games in golf and tennis, and their participation gradually expanded over subsequent Games, though it was not until 1928 that women were permitted to compete in athletics events — and even then, following a race in which several competitors collapsed from exhaustion, the IOC banned women from races longer than 200 metres for the next three decades. Women were not permitted to run the Olympic marathon until 1984.'],
    ['F', 'The Games of the twentieth century were shaped as much by politics as by sport. The 1936 Berlin Olympics were used by the Nazi government as a platform for racial ideology, though the performances of Jesse Owens — the African-American sprinter who won four gold medals in front of Adolf Hitler — became the defining narrative of those Games in historical memory. The 1980 Moscow Olympics were boycotted by sixty-five nations led by the United States in protest at the Soviet invasion of Afghanistan, and the Soviet Union and its allies retaliated with a boycott of the 1984 Los Angeles Games. The 1972 Munich Olympics were overshadowed by the massacre of eleven Israeli athletes and coaches by the Palestinian militant group Black September.'],
    ['G', 'The commercialisation of the modern Olympics has transformed both the scale and the nature of the event. The Los Angeles Games of 1984 — which faced a boycott but also became the first Games to generate a substantial surplus — established a template for corporate sponsorship and television rights deals that subsequent host cities have followed. The IOC\'s revenue from broadcasting rights grew from 1.2 million US dollars for the 1960 Rome Games to over 4 billion US dollars for the Tokyo 2020 Games. Critics argue that the financial and logistical demands of hosting the Games have become so extreme that they primarily benefit corporate sponsors and the construction industry while burdening host city taxpayers with infrastructure costs that frequently exceed initial estimates.']
  ],
  headings: headingBlock(olympicHeadings, [
    q('Paragraph A', 'ix', 'They were held every four years in honour of Zeus… a sacred truce… that suspended armed conflict across the Greek world'),
    q('Paragraph B', 'i', 'The ancient games included a range of athletic competitions that evolved over the centuries'),
    q('Paragraph C', 'ii', 'Pierre de Coubertin… believed that physical education had been neglected in French schools following France\'s defeat in the Franco-Prussian War'),
    q('Paragraph D', 'vii', 'whose victory… generated enormous national celebration / Athens petitioned to host all future Games permanently — a proposal that de Coubertin resisted'),
    q('Paragraph E', 'viii', 'Women\'s participation in the modern Olympics developed slowly and against persistent resistance… Women were not permitted to run the Olympic marathon until 1984'),
    q('Paragraph F', 'x', 'boycotted by sixty-five nations… massacre of eleven Israeli athletes and coaches'),
    q('Paragraph G', 'iv', 'revenue from broadcasting rights grew from 1.2 million US dollars… to over 4 billion US dollars… primarily benefit corporate sponsors… burdening host city taxpayers with infrastructure costs')
  ]),
  tfng: tfngP2([
    q('In the ancient Olympics, the athlete who owned the fastest horse received the prize in equestrian events rather than the person who rode it.', 'TRUE', 'The prize went to the owner of the winning horse or chariot rather than to the rider or driver'),
    q('Pierre de Coubertin was still serving as IOC president when women first competed in athletics events at the 1928 Games.', 'NOT GIVEN', 'Pierre de Coubertin opposed their inclusion throughout his tenure as IOC president / it was not until 1928 that women were permitted to compete in athletics events'),
    q('The 1984 Los Angeles Games produced a financial surplus despite being boycotted by several nations.', 'TRUE', 'The Los Angeles Games of 1984 — which faced a boycott but also became the first Games to generate a substantial surplus')
  ]),
  fill: fillBlock('Ancient and modern Olympic history', [
    q('The ancient Olympics were held every four years as part of a broader series of Panhellenic ……… , with athletes competing for symbolic prizes rather than financial reward.', 'games', 'a broader cycle of Panhellenic games that also included the Pythian, Isthmian, and Nemean Games'),
    q('The modern Games were revived through the efforts of a French educator who established the International Olympic ……… in 1894 to oversee their organisation.', 'Committee', 'The International Olympic Committee was established at that conference', { acceptedAnswers: ['committee'] }),
    q('Concerns about the financial burden on host cities centre on infrastructure ……… , which critics argue regularly exceed the amounts originally predicted.', 'costs', 'infrastructure costs that frequently exceed initial estimates')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_12: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  12: [stage12Passage1, stage12Passage2]
}
