/**
 * Normal Reading Journey ด่าน 6 — Cambridge-style mixed format.
 * Passage 1: 7 TFNG + 7 fill (Q1–14) | Passage 2: 7 headings + 3 YNNG + 3 fill (Q15–27 after remap)
 */
import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const tfng = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE or NOT GIVEN.',
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

const ynngP2 = (items: IntensiveQuestionSpec[]) => ({
  instruction:
    'Do the following statements agree with the claims of the writer in Reading Passage 2? Write YES, NO or NOT GIVEN.',
  items
})

const q = (
  prompt: string,
  answer: string,
  evidence: string,
  meta?: Partial<IntensiveQuestionSpec>
): IntensiveQuestionSpec => ({ prompt, answer, evidence, ...meta })

const P1_ORDER = ['tfng', 'fill'] as const
const P2_ORDER = ['headings', 'ynng', 'fill'] as const

const stage6Passage1: IntensivePassageLayout = {
  title: 'The Industrial Revolution',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'The mid-1700s witnessed a transformation in British society as the nation shifted from agricultural dominance to urban manufacturing. This period, known as the Industrial Revolution, redefined how goods were created. Before this era, independent craftspeople manufactured items within their own residences. Mass production subsequently moved operations into centralized facilities fueled by steam energy. This transition allowed for unprecedented output in textile and metal-working sectors, fundamentally altering the national economy.'],
    ['B', 'Technological innovation was the primary driver of this economic surge. The atmospheric steam engine, conceptualized by Thomas Newcomen, was initially employed to drain excess water from flooded mines. Following this, James Watt significantly improved the efficiency of these mechanical devices. His collaboration with Matthew Boulton resulted in a steam engine that transformed linear energy into rotary movement. This key advancement permitted the widespread adoption of steam power across various British manufacturing hubs.'],
    ['C', 'The demand for coal increased rapidly, as it was essential for fueling both factories and transportation systems. By the early 1800s, Richard Trevithick engineered a locomotive capable of moving passengers and cargo. By 1830, transportation routes connected major northern cities, revolutionizing the speed of commerce. Simultaneously, maritime vessels adopted these power systems, allowing goods to traverse the Atlantic with greater reliability than ever before.'],
    ['D', 'The British textile business had flourished for centuries as a cottage industry, with production handled by individual artisans. New inventions, such as the spinning jenny, automated these processes. These mechanisms reduced the human labor required to manufacture fabric. Consequently, new factories opened across the country to fulfill the high demand for cloth in domestic and international markets.'],
    ['E', 'Iron production also experienced significant modernization. Smelting iron ore using coke, a derivative of coal, replaced the conventional charcoal method. This innovative technique resulted in metal of superior structural integrity, suitable for heavy industrial use. The expansion of railway networks later created an insatiable need for steel and iron, driving the economy forward.'],
    ['F', 'Efficient communication became necessary due to the rapid movement of locomotives. In 1837, the telegraph system was patented. This technology successfully prevented potential accidents on the tracks by allowing instant signalling between distant stations.'],
    ['G', 'The impact on daily life was stark as rural populations migrated to cities in search of factory work. While this led to economic growth, it also caused severe overcrowding and sanitation failures in major urban centers. Opposition arose from groups like the Luddites, who feared that machinery would destroy their livelihoods. Despite their efforts to smash machines, the government eventually suppressed these movements, ensuring the industrial age continued.']
  ],
  tfng: tfng([
    q('The period described saw an increase in the number of farmers in Britain.', 'FALSE', 'the nation shifted from agricultural dominance to urban manufacturing'),
    q('Factory-based production allowed for a significant increase in the volume of goods manufactured.', 'TRUE', 'Mass production subsequently moved operations into centralized facilities fueled by steam energy. This transition allowed for unprecedented output'),
    q('Newcomen\'s device was primarily used for agricultural irrigation.', 'FALSE', 'The atmospheric steam engine, conceptualized by Thomas Newcomen, was initially employed to drain excess water from flooded mines'),
    q('Improvements in steam engine technology enabled its application in diverse industrial settings.', 'TRUE', 'This key advancement permitted the widespread adoption of steam power across various British manufacturing hubs'),
    q('Coal was initially considered an expensive energy source during the mid-1700s.', 'NOT GIVEN', 'The demand for coal increased rapidly, as it was essential for fueling both factories and transportation systems'),
    q('The expansion of rail links between northern cities was completed by the year 1820.', 'NOT GIVEN', 'By 1830, transportation routes connected major northern cities, revolutionizing the speed of commerce'),
    q('Prior to the revolution, fabric manufacturing was conducted by solitary craftsmen at home.', 'TRUE', 'The British textile business had flourished for centuries as a cottage industry, with production handled by individual artisans')
  ]),
  fill: fillBlock('Industrial production and urban change', [
    q('Smelting iron ore using ………, a coal-based substance, replaced the older charcoal method.', 'coke', 'Smelting iron ore using coke, a derivative of coal, replaced the conventional charcoal method'),
    q('The telegraph allowed instant signalling between stations, helping to prevent ……… on railway lines.', 'accidents', 'This technology successfully prevented potential accidents on the tracks by allowing instant signalling between distant stations'),
    q('Migration from the countryside led to severe ……… in rapidly growing cities.', 'overcrowding', 'it also caused severe overcrowding and sanitation failures in major urban centers'),
    q('Mass production boosted output in the ……… sector as well as metal-working.', 'textile', 'This transition allowed for unprecedented output in textile and metal-working sectors'),
    q('Watt\'s improved engine converted linear energy into ……… movement.', 'rotary', 'resulted in a steam engine that transformed linear energy into rotary movement'),
    q('Railway expansion created an insatiable demand for ……… and iron.', 'steel', 'The expansion of railway networks later created an insatiable need for steel and iron'),
    q('Poor living conditions in cities were linked in part to failures in ……… systems.', 'sanitation', 'it also caused severe overcrowding and sanitation failures in major urban centers')
  ])
}

const desertHeadings = [
  'Innovative methods for gathering subterranean moisture',
  'The introduction to extreme habitats',
  'Altering biological timing to preserve liquids',
  'How an athlete may feel stressed about an event',
  'Avoiding environmental stress through dormancy',
  'Minimizing evaporation through outer surface modifications',
  'Retaining liquid internally for long intervals',
  'The severe consequences of human expansion',
  'Replicating temperate climate conditions in laboratory greenhouses',
  'Commercial harvesting of desert plants for pharmaceutical use'
]

const stage6Passage2: IntensivePassageLayout = {
  title: 'Desert Plant Adaptations',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'Deserts are recognized as some of the most challenging environments on Earth. These regions receive negligible rainfall, often remaining dry for extended periods. Furthermore, the intense sunlight throughout the day creates high evaporation rates, leaving very little moisture for vegetation. To survive, desert flora have evolved distinct physical traits that allow them to extract, store, and shield precious water reserves.'],
    ['B', 'The primary strategy for survival involves specialized root architecture. Some desert species, like the mesquite, utilize expansive taproots that burrow deep underground, accessing hidden aquifers. In contrast, cacti utilize shallow, widespread root systems located just beneath the soil, enabling them to capture the limited rainfall quickly before the ground dries out.'],
    ['C', 'Retaining water is equally important. Succulents are specifically adapted to hold massive quantities of liquid within their thick, fleshy stems. When rainfall does occur, these plants absorb the moisture and expand, creating a reservoir that sustains them during prolonged droughts. This internal capacity allows them to survive for years without supplemental moisture.'],
    ['D', 'To minimize water loss, many desert plants have evolved a protective, waxy exterior. This waterproof coating prevents evaporation. Furthermore, many species have shed their leaves entirely, replacing them with sharp spines. These spines serve a dual purpose: they discourage thirsty animals from consuming the plant\'s moisture and provide shade that cools the surface of the stem.'],
    ['E', 'A unique biological process occurs at night when these plants open their pores. In standard climates, plants photosynthesize during the day, but doing so in the desert would cause lethal water loss. By delaying this activity until the cooler nighttime hours, desert species successfully conserve their internal fluids.'],
    ['F', 'Some wildflowers utilize a strategy of dormancy to survive the dry season. Their seeds remain inactive in the dirt for years, prevented from sprouting by chemical inhibitors. Once significant rain falls and washes away these inhibitors, the seeds germinate, flower, and produce new seeds within a few short weeks, completing their life cycle before the moisture disappears.'],
    ['G', 'Human expansion and off-road activities now pose significant threats to these fragile ecosystems. Heavy vehicles crush shallow root systems and break the protective surface crust of the ground. Because these species exhibit extremely slow growth rates, they are particularly vulnerable to permanent extinction.']
  ],
  headings: headingBlock(desertHeadings, [
    q('Paragraph A', 'ii', 'Deserts are recognized as some of the most challenging environments on Earth'),
    q('Paragraph B', 'i', 'Some desert species, like the mesquite, utilize expansive taproots that burrow deep underground, accessing hidden aquifers'),
    q('Paragraph C', 'vii', 'Succulents are specifically adapted to hold massive quantities of liquid within their thick, fleshy stems'),
    q('Paragraph D', 'vi', 'To minimize water loss, many desert plants have evolved a protective, waxy exterior'),
    q('Paragraph E', 'iii', 'By delaying this activity until the cooler nighttime hours, desert species successfully conserve their internal fluids'),
    q('Paragraph F', 'v', 'Some wildflowers utilize a strategy of dormancy to survive the dry season'),
    q('Paragraph G', 'viii', 'Human expansion and off-road activities now pose significant threats to these fragile ecosystems')
  ]),
  ynng: ynngP2([
    q('Cacti are the only type of succulent that stores water.', 'NOT GIVEN', 'Succulents are specifically adapted to hold massive quantities of liquid within their thick, fleshy stems'),
    q('Desert plants recover from physical damage very quickly.', 'NO', 'Because these species exhibit extremely slow growth rates, they are particularly vulnerable to permanent extinction'),
    q('Nighttime temperatures in the desert are always below freezing.', 'NOT GIVEN', 'By delaying this activity until the cooler nighttime hours, desert species successfully conserve their internal fluids')
  ]),
  fill: fillBlock('Desert survival mechanisms', [
    q('Many species replace leaves with sharp ……… that deter animals and provide shade.', 'spines', 'many species have shed their leaves entirely, replacing them with sharp spines'),
    q('Desert seeds may contain a chemical ……… that stops them from germinating too soon.', 'inhibitor', 'prevented from sprouting by chemical inhibitors'),
    q('Off-road vehicles can break the fragile surface ……… of desert soil.', 'crust', 'Heavy vehicles crush shallow root systems and break the protective surface crust of the ground')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_6: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  6: [stage6Passage1, stage6Passage2]
}
