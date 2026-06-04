/**
 * Normal Reading Journey ด่าน 15 — Cambridge-style mixed format.
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

const stage15Passage1: IntensivePassageLayout = {
  title: 'The Science of Sleep',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Sleep occupies roughly one third of a human lifetime, yet for most of history its purpose remained almost entirely mysterious. Ancient thinkers regarded it variously as a temporary death, a withdrawal of the soul, or a period of divine communication. Modern neuroscience has replaced these interpretations with a detailed understanding of sleep as an active, highly organised biological process that is essential to physical health, cognitive function, immune defence, and emotional regulation. Far from being a passive state of reduced activity, sleep involves a precisely choreographed sequence of neural events that performs functions no waking state can replicate.'],
    ['B', 'Sleep is organised into cycles of approximately 90 minutes, each containing several distinct stages. The first stages are collectively called non-rapid eye movement sleep, or NREM, and progress from light sleep through increasingly deep slow-wave sleep, characterised by large, synchronised electrical oscillations in the brain. This deep stage is believed to be critical for physical restoration — growth hormone is released predominantly during slow-wave sleep, and the immune system carries out key repair functions. The final stage of each cycle is rapid eye movement sleep, or REM, during which the brain becomes highly active while the body remains largely paralysed. REM sleep is strongly associated with vivid dreaming and with the consolidation of emotional memories.'],
    ['C', 'The importance of sleep for memory consolidation has been established through decades of research. During sleep, the hippocampus — the brain structure primarily responsible for forming new memories — replays the neural activity patterns from experiences earlier in the day, effectively rehearsing and transferring information to long-term cortical storage. Studies have shown that a full night of sleep after learning a new skill or acquiring new information produces significantly better recall the following day compared with an equivalent period of wakefulness. Targeted memory reactivation — in which sounds or odours associated with specific learned material are presented during sleep — has been shown to selectively enhance recall of the cued material.'],
    ['D', 'Chronic sleep deprivation carries severe health consequences that extend well beyond tiredness. Sleeping fewer than six hours per night on a regular basis is associated with increased risk of cardiovascular disease, type 2 diabetes, obesity, and several forms of cancer. Immune function is substantially impaired: a landmark study found that people who slept fewer than five hours were four times more likely to develop a cold when exposed to the rhinovirus than those who slept more than seven hours. Cognitive impairment from sleep deprivation accumulates in a manner that the individual often fails to recognise: people who are chronically sleep-deprived tend to underestimate how significantly their performance has declined.'],
    ['E', 'The glymphatic system — a network of channels surrounding the brain\'s blood vessels — appears to play a critical role in clearing metabolic waste products from neural tissue during sleep. During waking hours, the brain\'s metabolic activity generates toxic by-products, including beta-amyloid proteins associated with Alzheimer\'s disease. Studies in mice have shown that the flow of cerebrospinal fluid through the glymphatic channels increases dramatically during sleep, flushing these waste products out of the brain. The system appears to be largely inactive during wakefulness, leading researchers to propose that chronic sleep deprivation may allow the accumulation of neurotoxic proteins that contribute to neurodegeneration over time.'],
    ['F', 'Circadian rhythms — the internal biological clocks that regulate the timing of sleep and wakefulness — are controlled by a cluster of neurons in the hypothalamus called the suprachiasmatic nucleus. These neurons respond to light signals transmitted from the retina, synchronising the body\'s internal clock to the external day-night cycle. Exposure to artificial light — particularly the blue-wavelength light emitted by screens — suppresses the production of melatonin, the hormone that signals the onset of sleep, and can delay sleep timing by one to three hours. This misalignment between the biological clock and the social schedule is especially pronounced in adolescents, whose circadian phase naturally shifts later during puberty, creating a mismatch with early school start times that researchers have linked to impaired academic performance.'],
    ['G', 'Improving sleep health at a population level requires both individual behaviour change and structural interventions. Sleep hygiene recommendations — maintaining consistent sleep and wake times, limiting caffeine and alcohol, reducing screen exposure in the evening, and keeping the sleeping environment cool and dark — have a reasonable evidence base but modest effect sizes when studied in isolation. Cognitive behavioural therapy for insomnia, which addresses the thoughts and behaviours that perpetuate sleeplessness, has a substantially stronger evidence base than any pharmacological treatment and is recommended as the first-line intervention for chronic insomnia by major clinical guidelines. Nevertheless, access to trained therapists remains limited, and sleep-disrupting work schedules and social obligations continue to undermine efforts to improve sleep in many populations.']
  ],
  tfng: tfng([
    q('Modern neuroscience now understands sleep as an active process rather than a passive resting state.', 'TRUE', 'Far from being a passive state of reduced activity, sleep involves a precisely choreographed sequence of neural events that performs functions no waking state can replicate'),
    q('Growth hormone is released primarily during the REM stage of the sleep cycle.', 'FALSE', 'growth hormone is released predominantly during slow-wave sleep'),
    q('Research has confirmed that learning a new skill after a full night\'s sleep produces better results than learning it after a night of no sleep.', 'NOT GIVEN', 'a full night of sleep after learning a new skill or acquiring new information produces significantly better recall the following day compared with an equivalent period of wakefulness'),
    q('People who consistently sleep fewer than six hours per night are at greater risk of developing type 2 diabetes.', 'TRUE', 'Sleeping fewer than six hours per night on a regular basis is associated with increased risk of cardiovascular disease, type 2 diabetes, obesity, and several forms of cancer'),
    q('The glymphatic system in the brain operates at the same rate during both sleep and wakefulness.', 'FALSE', 'The system appears to be largely inactive during wakefulness'),
    q('Researchers have found that delayed school start times for adolescents lead to measurable improvements in academic results.', 'NOT GIVEN', 'a mismatch with early school start times that researchers have linked to impaired academic performance'),
    q('Cognitive behavioural therapy for insomnia is recommended ahead of medication as the primary treatment for long-term sleeplessness.', 'TRUE', 'Cognitive behavioural therapy for insomnia… is recommended as the first-line intervention for chronic insomnia by major clinical guidelines')
  ]),
  fill: fillBlock('How sleep supports health and memory', [
    q('Sleep is divided into repeated ……… of about 90 minutes, each containing several stages.', 'cycles', 'Sleep is organised into cycles of approximately 90 minutes'),
    q('The deepest stage is particularly important for physical ……… , including immune function and the release of growth hormone.', 'repair', 'the immune system carries out key repair functions'),
    q('During sleep, a key structure in the ……… replays earlier experiences to move information into long-term storage.', 'brain', 'the hippocampus — the brain structure primarily responsible for forming new memories'),
    q('Research has shown that even a single week of restricted sleep can impair the body\'s ……… system, making individuals more vulnerable to illness.', 'immune', 'Immune function is substantially impaired'),
    q('A key recent discovery is that a network of channels in the brain removes toxic ……… products during sleep.', 'waste', 'clearing metabolic waste products from neural tissue during sleep'),
    q('The timing of sleep is governed by the body\'s internal ……… , which is disrupted by exposure to artificial light in the evening.', 'clock', 'the internal biological clocks that regulate the timing of sleep and wakefulness'),
    q('Exposure to artificial ……… in the evening disrupts the timing of sleep.', 'light', 'Exposure to artificial light — particularly the blue-wavelength light emitted by screens')
  ])
}

const vaccinationHeadings = [
  'Public rejection and ridicule before widespread acceptance',
  'A laboratory error with devastating human consequences',
  'A systematic scientific framework transforms vaccine development',
  'An ancient protective practice reaches a new audience',
  'A century of breakthroughs culminating in a historic first',
  'A disputed link that reduced uptake of a crucial treatment',
  'Speed and inequality define a global health emergency response',
  'A country doctor\'s observation confirmed by a controlled experiment',
  'Fraud, fear, and their public health consequences',
  'Manufacturing failures and false claims damage public confidence'
]

const stage15Passage2: IntensivePassageLayout = {
  title: 'The History of Vaccination',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'The idea that deliberate exposure to a mild form of a disease could protect against its more deadly version predates modern medicine by centuries. In China and the Ottoman Empire, the practice of variolation — in which material from a smallpox pustule was introduced into a small cut or inhaled — was used to induce mild infection and subsequent immunity long before any understanding of the germ theory of disease existed. The practice was introduced to Britain in the early eighteenth century by Lady Mary Wortley Montagu, who had observed it in Constantinople during her husband\'s diplomatic posting, and later championed by Caroline of Ansbach, the Princess of Wales, who oversaw its trial on condemned prisoners and orphaned children before allowing her own children to be variolated.'],
    ['B', 'The foundational figure of modern vaccination was a country doctor in Gloucestershire, England. He had observed the popular belief among milkmaids that contracting cowpox — a mild infection acquired from cattle — provided protection against smallpox. In 1796, he conducted his landmark experiment: he inoculated a healthy eight-year-old boy with material from a cowpox pustule on the hand of a milkmaid. Weeks later, he exposed the boy to smallpox material. The boy did not develop smallpox. The doctor repeated the experiment and published his results in 1798. He named the procedure vaccination, from the Latin vacca, meaning cow.'],
    ['C', 'This early vaccination work met with fierce opposition. Religious groups argued that introducing animal material into the human body was an affront to divine creation. Fellow physicians challenged the scientific basis of the claims, demanding controlled trials that the medical conventions of that time did not yet require. Satirical cartoons depicted people who had received the vaccine sprouting cows from their bodies. Despite this resistance, the evidence accumulated by its supporters was compelling, and vaccination spread rapidly across Europe and North America in the early nineteenth century. Napoleon ordered the vaccination of his entire army, reportedly stating that the inventor of the procedure was one of the greatest men in history.'],
    ['D', 'The mechanism by which vaccination worked remained mysterious until Louis Pasteur\'s germ theory of disease transformed the understanding of infection in the second half of the nineteenth century. Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response without causing the disease itself. He extended the vaccine principle from smallpox to other conditions, developing vaccines for chicken cholera, anthrax, and — in his most dramatic demonstration — rabies. In 1885, he successfully treated a nine-year-old boy who had been severely bitten by a rabid dog and would otherwise have certainly died.'],
    ['E', 'The twentieth century brought a succession of vaccine triumphs. An inactivated poliovirus vaccine, announced in 1955 following a nationwide field trial involving 1.8 million American children, effectively ended the epidemic threat of polio in the United States within years. A subsequent oral polio vaccine was cheaper, easier to administer, and highly effective in mass immunisation campaigns. Vaccines against measles, mumps, rubella, and a growing list of other diseases were developed through the 1960s and 1970s, transforming the epidemiology of childhood illness in countries with high vaccination coverage. The eradication of smallpox, certified by the World Health Organization in 1980, represented the first — and so far only — complete elimination of a human infectious disease through vaccination.'],
    ['F', 'The history of vaccination has not been free of controversy or failure. The 1955 Cutter incident, in which batches of improperly inactivated poliovirus vaccine caused 40,000 cases of polio, 200 cases of permanent paralysis, and ten deaths, demonstrated the catastrophic consequences of manufacturing failures in vaccine production. More recently, unfounded claims linking the measles-mumps-rubella vaccine to autism — originating in a fraudulent 1998 paper that was subsequently retracted — contributed to declining vaccination rates in several countries and resurgences of measles outbreaks that had previously been eliminated.'],
    ['G', 'The COVID-19 pandemic accelerated vaccine development to a degree without historical precedent. The first vaccines used messenger RNA technology that had been in development for decades but had never previously been approved for human use. Authorised for emergency use less than a year after the virus was identified, these vaccines demonstrated efficacy rates above 90% in clinical trials and were deployed at a pace and scale unprecedented in the history of medicine. The pandemic also brought renewed attention to global inequalities in vaccine access, with low-income countries receiving significantly fewer doses per capita than wealthier nations, despite international initiatives designed to address the disparity.']
  ],
  headings: headingBlock(vaccinationHeadings, [
    q('Paragraph A', 'iv', 'The idea… predates modern medicine by centuries… introduced to Britain… by Lady Mary Wortley Montagu, who had observed it in Constantinople'),
    q('Paragraph B', 'viii', 'He had observed the popular belief among milkmaids… In 1796, he conducted his landmark experiment… The boy did not develop smallpox. The doctor repeated the experiment'),
    q('Paragraph C', 'i', 'Satirical cartoons depicted people who had received the vaccine sprouting cows from their bodies. Despite this resistance… vaccination spread rapidly'),
    q('Paragraph D', 'iii', 'Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response'),
    q('Paragraph E', 'v', 'The twentieth century brought a succession of vaccine triumphs… The eradication of smallpox… represented the first — and so far only — complete elimination of a human infectious disease'),
    q('Paragraph F', 'x', 'The 1955 Cutter incident… caused 40,000 cases of polio… unfounded claims linking the measles-mumps-rubella vaccine to autism… a fraudulent 1998 paper that was subsequently retracted'),
    q('Paragraph G', 'vii', 'COVID-19 pandemic accelerated vaccine development to a degree without historical precedent… low-income countries receiving significantly fewer doses per capita than wealthier nations')
  ]),
  tfng: tfngP2([
    q('The practice of variolation was brought to Britain by a woman who had witnessed it while living in another country.', 'TRUE', 'introduced to Britain… by Lady Mary Wortley Montagu, who had observed it in Constantinople during her husband\'s diplomatic posting'),
    q('The boy inoculated in the early vaccination experiment later became a physician and continued research into the procedure.', 'NOT GIVEN', 'he inoculated a healthy eight-year-old boy with material from a cowpox pustule'),
    q('A fraudulent research paper claiming a link between the MMR vaccine and autism was later withdrawn from publication.', 'TRUE', 'originating in a fraudulent 1998 paper that was subsequently retracted')
  ]),
  fill: fillBlock('From variolation to modern vaccines', [
    q('The principle behind vaccination — using a weakened form of a disease to stimulate ……… against a more dangerous version — was applied long before modern science could explain it.', 'protection', 'contracting cowpox — a mild infection acquired from cattle — provided protection against smallpox'),
    q('The procedure was named after the Latin word for the animal from which the first protective ……… was obtained.', 'material', 'he inoculated a healthy eight-year-old boy with material from a cowpox pustule on the hand of a milkmaid'),
    q('The development of mRNA vaccines during the COVID-19 pandemic demonstrated remarkable speed, though access was severely unequal, with low-income countries receiving a disproportionately small share of available ……… .', 'doses', 'low-income countries receiving significantly fewer doses per capita than wealthier nations')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_15: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  15: [stage15Passage1, stage15Passage2]
}
