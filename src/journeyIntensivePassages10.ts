/**
 * Normal Reading Journey ด่าน 10 — Cambridge-style mixed format.
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

const stage10Passage1: IntensivePassageLayout = {
  title: 'Rewilding: Restoring Lost Ecosystems',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'Rewilding — the large-scale restoration of ecosystems to a state closer to their natural condition — has emerged as one of the most ambitious and controversial approaches in conservation biology. Unlike conventional conservation, which typically focuses on protecting and managing existing habitats, rewilding seeks to restore ecological processes by reintroducing missing species, reducing human management, and allowing natural dynamics of predation, disturbance, and succession to reassert themselves. Proponents argue that rewilding addresses the root causes of biodiversity loss rather than merely treating its symptoms; critics worry that it prioritises an idealised vision of the past over the practical needs of landscapes shaped by centuries of human use.'],
    ['B', 'The concept of trophic cascades underpins much rewilding theory. When apex predators are removed from an ecosystem, the prey species they formerly controlled can multiply, overgraze, or overbrowse vegetation, fundamentally altering habitat structure and reducing biodiversity across multiple species and plant communities. The reintroduction of wolves to Yellowstone National Park in 1995 has become the most cited example of trophic cascades in action. With wolves present, elk reduced their grazing pressure in areas where predation risk was high — particularly river valleys and steep slopes — allowing willows, aspens, and cottonwoods to regenerate. The recovery of riparian vegetation in turn provided habitat for beavers, whose dams altered stream flow and created wetland environments benefiting hundreds of other species.'],
    ['C', 'Not all researchers accept the Yellowstone story as straightforwardly as it is often presented. Some ecologists have argued that the recovery of vegetation was also influenced by drought conditions, elk hunting, and other factors concurrent with wolf reintroduction, making it difficult to attribute the ecological changes to wolves alone. A 2014 review by Arthur Middleton found limited evidence for the specific riparian vegetation changes that the most enthusiastic accounts of the Yellowstone story describe. Middleton cautioned that the wolf reintroduction narrative had become simplified and amplified in its retelling, serving advocacy goals rather than scientific accuracy, and urged greater rigour in claims made for rewilding interventions.'],
    ['D', 'The European rewilding movement has pursued a somewhat different model, focusing on the gradual withdrawal of human management and the reintroduction of large herbivores rather than predators. The Knepp Estate in West Sussex, England — a former intensive farm converted to rewilding over two decades by landowners Charlie Burrell and Isabella Tree — has become one of the most studied examples. Without active management of vegetation, and with free-roaming populations of Longhorn cattle, Tamworth pigs, Exmoor ponies, and fallow deer, the estate has seen a dramatic increase in species diversity, including populations of rare butterflies, turtle doves, nightingales, and purple emperor butterflies that had disappeared from large parts of Britain. Knepp\'s success has been influential in shaping UK government policy on agri-environment payments.'],
    ['E', 'The reintroduction of beavers to the United Kingdom provides another instructive case. Hunted to extinction in Britain approximately 400 years ago, beavers were reintroduced experimentally to the River Tay in Scotland in 2009 and the River Exe in Devon in 2015. Research in Devon showed that beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent — a significant finding in the context of increasing flood risk from climate change. Beavers also improved water quality by creating conditions that trap sediment and absorb nutrients. However, farmers in both locations raised concerns about flooding of agricultural land and damage to riverside vegetation, and managing human-beaver conflict has required ongoing investment in compensation schemes and protective measures.'],
    ['F', 'Rewilding faces particular challenges where human populations are dense and land is extensively cultivated. The European Union\'s Biodiversity Strategy for 2030 sets a target of restoring at least 30% of Europe\'s land and sea areas, but translating this ambition into practice requires negotiating the interests of farmers, foresters, landowners, and rural communities who depend on the landscape for their livelihoods. Compensation mechanisms, voluntary participation schemes, and the integration of rewilding with sustainable land management practices have all been proposed as ways of reconciling conservation goals with economic realities. Critics from the farming sector argue that rewilding risks undermining food security by removing productive agricultural land from use.'],
    ['G', 'The scientific framework for assessing rewilding outcomes remains underdeveloped relative to the pace of practical implementation. Defining what counts as a successful rewilding outcome — and over what timescale — is contested. Some researchers advocate for baselines drawn from pre-human or pre-agricultural states, which are often poorly understood and in any case represent ecosystems adapted to climate conditions that no longer exist. Others argue for more pragmatic targets focused on measurable increases in biodiversity and ecosystem function rather than historical fidelity. What is broadly agreed is that rewilding must be accompanied by rigorous long-term monitoring, adaptive management, and honest assessment of both successes and failures if it is to become a reliable tool in the conservation repertoire.']
  ],
  tfng: tfng([
    q('Conventional conservation methods typically aim to restore ecosystems to their original condition by reintroducing missing species.', 'FALSE', 'Unlike conventional conservation, which typically focuses on protecting and managing existing habitats, rewilding seeks to restore ecological processes by reintroducing missing species'),
    q('Following the return of wolves to Yellowstone, elk changed their feeding behaviour in locations where the risk of being attacked was greater.', 'TRUE', 'elk reduced their grazing pressure in areas where predation risk was high — particularly river valleys and steep slopes'),
    q('Arthur Middleton\'s 2014 review concluded that the reintroduction of wolves to Yellowstone had caused no measurable change in the park\'s ecosystem.', 'FALSE', 'Middleton found limited evidence for the specific riparian vegetation changes that the most enthusiastic accounts of the Yellowstone story describe'),
    q('The Knepp Estate was previously used for intensive agricultural production before its conversion to a rewilding project.', 'TRUE', 'a former intensive farm converted to rewilding over two decades'),
    q('Beavers were reintroduced to England and Scotland simultaneously as part of a coordinated national programme.', 'FALSE', 'beavers were reintroduced experimentally to the River Tay in Scotland in 2009 and the River Exe in Devon in 2015'),
    q('Research in Devon found that beaver activity reduced the severity of peak flooding during storms by nearly a third.', 'TRUE', 'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent'),
    q('The EU Biodiversity Strategy for 2030 includes financial penalties for member states that fail to meet rewilding targets.', 'NOT GIVEN', 'The European Union\'s Biodiversity Strategy for 2030 sets a target of restoring at least 30% of Europe\'s land and sea areas')
  ]),
  fill: fillBlock('Rewilding principles and case studies', [
    q('Rewilding is based on the principle that removing human ……… from a landscape allows natural ecological processes to recover.', 'management', 'reducing human management'),
    q('The theoretical foundation for many rewilding projects is the concept of trophic ……… , which describes how the removal of top predators causes knock-on changes throughout an entire food web.', 'cascades', 'The concept of trophic cascades underpins much rewilding theory'),
    q('The Yellowstone example demonstrated how the presence of wolves altered the behaviour of ……… , allowing riverside vegetation to regenerate.', 'elk', 'elk reduced their grazing pressure in areas where predation risk was high'),
    q('At the Knepp Estate in England, free-roaming ……… — including cattle, pigs, and ponies — have replaced managed livestock, leading to significant gains in species diversity.', 'herbivores', 'the reintroduction of large herbivores rather than predators'),
    q('In Devon, researchers found that ……… created by beavers helped reduce the impact of floods.', 'wetlands', 'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent'),
    q('Achieving rewilding at a larger scale requires addressing the interests of ……… , foresters, landowners, and rural communities whose land and livelihoods may be affected.', 'farmers', 'negotiating the interests of farmers, foresters, landowners, and rural communities who depend on the landscape for their livelihoods'),
    q('Scientists stress that all rewilding projects must be accompanied by long-term ……… to evaluate whether interventions are producing the intended results.', 'monitoring', 'rigorous long-term monitoring, adaptive management, and honest assessment of both successes and failures')
  ])
}

const vaccinationHeadings = [
  'Public rejection and ridicule before widespread acceptance',
  'A laboratory error with devastating human consequences',
  'A systematic demonstration using a scientific framework',
  'An ancient protective practice reaches a new audience',
  'A century of breakthroughs culminating in a historic first',
  'A disputed link that reduced uptake of a crucial treatment',
  'Speed and inequality define a global health emergency response',
  'A surgeon\'s chance observation tested on a willing child',
  'A scientist\'s observation confirmed by a controlled experiment',
  'Fraud, fear, and their public health consequences'
]

const stage10Passage2: IntensivePassageLayout = {
  title: 'The History of Vaccination',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'The idea that deliberate exposure to a mild form of a disease could protect against its more deadly version predates modern medicine by centuries. In China and the Ottoman Empire, the practice of variolation — in which material from a smallpox pustule was introduced into a small cut or inhaled — was used to induce mild infection and subsequent immunity long before any understanding of the germ theory of disease existed. The practice was introduced to Britain in the early eighteenth century by Lady Mary Wortley Montagu, who had observed it in Constantinople during her husband\'s diplomatic posting, and later championed by Caroline of Ansbach, the Princess of Wales, who oversaw its trial on condemned prisoners and orphaned children before allowing her own children to be variolated.'],
    ['B', 'The foundational figure of modern vaccination was Edward Jenner, a country doctor in Gloucestershire, England. Jenner had observed the popular belief among milkmaids that contracting cowpox — a mild infection acquired from cattle — provided protection against smallpox. In 1796, he conducted his landmark experiment: he inoculated a healthy eight-year-old boy, James Phipps, with material from a cowpox pustule on the hand of a milkmaid, Sarah Nelmes. Weeks later, he exposed the boy to smallpox material. Phipps did not develop smallpox. Jenner repeated the experiment and published his results in 1798. He named the procedure vaccination, from the Latin vacca, meaning cow.'],
    ['C', 'Jenner\'s work met with fierce opposition. Religious groups argued that introducing animal material into the human body was an affront to divine creation. Fellow physicians challenged the scientific basis of his claims, demanding controlled trials that the medical conventions of his time did not yet require. Satirical cartoons depicted people who had received the vaccine sprouting cows from their bodies. Despite this resistance, the evidence accumulated by Jenner and his supporters was compelling, and vaccination spread rapidly across Europe and North America in the early nineteenth century. Napoleon ordered the vaccination of his entire army, reportedly stating that Jenner was one of the greatest men in history.'],
    ['D', 'The mechanism by which vaccination worked remained mysterious until Louis Pasteur\'s germ theory of disease transformed the understanding of infection in the second half of the nineteenth century. Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response without causing the disease itself. He extended Jenner\'s principle from smallpox to other conditions, developing vaccines for chicken cholera, anthrax, and — in his most dramatic demonstration — rabies. In 1885, he successfully treated a nine-year-old boy named Joseph Meister, who had been severely bitten by a rabid dog and would otherwise have certainly died.'],
    ['E', 'The twentieth century brought a succession of vaccine triumphs. Jonas Salk\'s inactivated poliovirus vaccine, announced in 1955 following a nationwide field trial involving 1.8 million American children, effectively ended the epidemic threat of polio in the United States within years. Albert Sabin subsequently developed an oral polio vaccine that was cheaper, easier to administer, and highly effective in mass immunisation campaigns. Vaccines against measles, mumps, rubella, and a growing list of other diseases were developed through the 1960s and 1970s, transforming the epidemiology of childhood illness in countries with high vaccination coverage. The eradication of smallpox, certified by the World Health Organization in 1980, represented the first — and so far only — complete elimination of a human infectious disease through vaccination.'],
    ['F', 'The history of vaccination has not been free of controversy or failure. The 1955 Cutter incident, in which batches of improperly inactivated poliovirus vaccine produced by Cutter Laboratories caused 40,000 cases of polio, 200 cases of permanent paralysis, and ten deaths, demonstrated the catastrophic consequences of manufacturing failures in vaccine production. More recently, unfounded claims linking the measles-mumps-rubella vaccine to autism — originating in a fraudulent 1998 paper by Andrew Wakefield, which was subsequently retracted — contributed to declining vaccination rates in several countries and resurgences of measles outbreaks that had previously been eliminated.'],
    ['G', 'The COVID-19 pandemic accelerated vaccine development to a degree without historical precedent. The first vaccines — developed by BioNTech and Pfizer, and by Moderna — used messenger RNA technology that had been in development for decades but had never previously been approved for human use. Authorised for emergency use less than a year after the virus was identified, these vaccines demonstrated efficacy rates above 90% in clinical trials and were deployed at a pace and scale unprecedented in the history of medicine. The pandemic also brought renewed attention to global inequalities in vaccine access, with low-income countries receiving significantly fewer doses per capita than wealthier nations, despite international initiatives designed to address the disparity.']
  ],
  headings: headingBlock(vaccinationHeadings, [
    q('Paragraph A', 'iv', 'The idea that deliberate exposure to a mild form of a disease could protect against its more deadly version predates modern medicine by centuries'),
    q('Paragraph B', 'ix', 'Jenner had observed the popular belief among milkmaids… In 1796, he conducted his landmark experiment… Jenner repeated the experiment and published his results'),
    q('Paragraph C', 'i', 'Jenner\'s work met with fierce opposition… Satirical cartoons… vaccination spread rapidly across Europe and North America'),
    q('Paragraph D', 'iii', 'Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response'),
    q('Paragraph E', 'v', 'The twentieth century brought a succession of vaccine triumphs… The eradication of smallpox… represented the first — and so far only — complete elimination of a human infectious disease through vaccination'),
    q('Paragraph F', 'ii', 'The 1955 Cutter incident, in which batches of improperly inactivated poliovirus vaccine… caused 40,000 cases of polio, 200 cases of permanent paralysis, and ten deaths'),
    q('Paragraph G', 'vii', 'The COVID-19 pandemic accelerated vaccine development to a degree without historical precedent… low-income countries receiving significantly fewer doses per capita than wealthier nations')
  ]),
  tfng: tfngP2([
    q('Lady Mary Wortley Montagu introduced variolation to Britain after observing it while living abroad.', 'TRUE', 'introduced to Britain in the early eighteenth century by Lady Mary Wortley Montagu, who had observed it in Constantinople during her husband\'s diplomatic posting'),
    q('James Phipps, the boy used in Jenner\'s experiment, later became a doctor and continued research into vaccination.', 'NOT GIVEN', 'he inoculated a healthy eight-year-old boy, James Phipps'),
    q('Andrew Wakefield\'s 1998 paper claiming a link between the MMR vaccine and autism was later found to be fraudulent and removed from publication.', 'TRUE', 'unfounded claims linking the measles-mumps-rubella vaccine to autism — originating in a fraudulent 1998 paper by Andrew Wakefield, which was subsequently retracted')
  ]),
  fill: fillBlock('Vaccination from early practice to modern deployment', [
    q('The principle behind vaccination — using a weakened or related form of a disease agent to stimulate ……… — was applied long before the science of microbiology existed.', 'immunity', 'induce mild infection and subsequent immunity long before any understanding of the germ theory of disease existed'),
    q('Edward Jenner named his procedure after the Latin word for ……… , the animal from which the protective material was obtained.', 'cow', 'He named the procedure vaccination, from the Latin vacca, meaning cow'),
    q('The development of mRNA vaccines during the COVID-19 pandemic demonstrated that technology long under development could be deployed with remarkable speed, though access to these new tools was severely unequal, with low-income countries receiving significantly fewer ……… per capita than wealthier nations.', 'doses', 'low-income countries receiving significantly fewer doses per capita than wealthier nations')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_10: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  10: [stage10Passage1, stage10Passage2]
}
