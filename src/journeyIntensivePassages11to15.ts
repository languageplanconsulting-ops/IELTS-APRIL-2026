/**
 * Normal Reading Journey ด่าน 11–15 — mixed-format intensive passages.
 */
import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const info = (instruction: string, items: IntensiveQuestionSpec[]) => ({
  instruction,
  items
})

const fillBlock = (
  instruction: string,
  summaryTitle: string,
  items: NonNullable<IntensivePassageLayout['fill']>['items']
) => ({ instruction, summaryTitle, items })

const people = (
  instruction: string,
  peopleList: string[],
  items: NonNullable<IntensivePassageLayout['matchingPeople']>['items']
) => ({ instruction, people: peopleList, items })

// ─── Stage 11 ───────────────────────────────────────────────────────────────

const stage11Passage1: IntensivePassageLayout = {
  title: 'The thawing north: permafrost and the methane threat',
  paragraphs: [
    ['A', 'Beneath the soil of the Arctic and subarctic lies one of the Earth\'s most consequential but least visible climate systems. Permafrost — ground that has remained frozen continuously for at least two years and in many areas for thousands of years — underlies approximately a quarter of the Northern Hemisphere\'s land surface. It extends across Siberia, Alaska, northern Canada and the high-altitude regions of Central Asia and the Tibetan Plateau. For decades, scientists have understood that permafrost contains vast stores of ancient carbon, locked away since long before industrialisation began. As global temperatures rise and the Arctic warms at more than twice the rate of the global average, that carbon is increasingly at risk of being released.'],
    ['B', 'The carbon locked in permafrost comes from the organic remains of plants, animals and microorganisms that died over thousands of years and were frozen before they could fully decompose. These remains have accumulated in permafrost soils over millennia, and scientists estimate that they contain approximately 1,500 billion tonnes of carbon — roughly twice the amount currently present in the atmosphere. As long as the ground stays frozen, this material remains inert. When permafrost thaws, however, warming activates microbes in the soil, which begin to break down the organic material and release carbon dioxide and methane as byproducts of decomposition.'],
    ['C', 'Monitoring data collected over the past two decades have confirmed that permafrost thaw is already under way across significant portions of the Arctic. Satellite measurements show that the active layer — the portion of ground above permafrost that naturally freezes and thaws with the seasons — is deepening across much of Siberia and northern Canada. In some locations, dramatic surface deformations known as thermokarst — caused when ice within the permafrost melts and the ground collapses — are visible from the air. Dr Katey Walter Anthony of the University of Alaska Fairbanks, who has spent decades studying Arctic methane seeps, has documented methane bubbling from beneath thawing lakes at rates that have increased measurably over the past twenty years.'],
    ['D', 'Of particular concern to climate scientists is the prospect of large-scale methane release. While carbon dioxide is the primary greenhouse gas associated with human activity, methane is approximately 87 times more potent as a warming agent over a twenty-year period. Permafrost contains not only carbon dioxide but also methane trapped in frozen ground and lake sediments for millennia. Dr Merritt Turetsky of the University of Colorado, who leads research into abrupt permafrost thaw, describes this as \'one of the most significant potential sources of amplified warming on the planet. If thaw releases even a fraction of the methane currently stored in Arctic permafrost, the effect on global temperatures could be substantial and self-reinforcing.\''],
    ['E', 'Not all permafrost is equally at risk. The most vulnerable areas are those where permafrost is shallow and warming is most intense. Low-lying areas of western Siberia, where vast expanses of frozen peat bogs lie just below the surface, are considered among the most at-risk regions globally. In Alaska, coastal permafrost is being eroded simultaneously by warming from above and by wave action from the sea, as melting sea ice exposes the shore to increasingly powerful storms. Professor Vladimir Romanovsky of the University of Alaska Fairbanks, who coordinates an international network of permafrost monitoring stations, notes that \'the rate of warming we are recording in the top ten metres of permafrost in many locations is unprecedented in the observational record.\''],
    ['F', 'Attempts to slow permafrost thaw through direct intervention have been made on an experimental scale. In the Siberian region of Yakutia, Professor Sergey Zimov has developed the Pleistocene Park project, which aims to restore grassland ecosystems by reintroducing large grazing animals such as bison, horses and reindeer. His hypothesis is that grazing animals compact snow in winter, reducing its insulating effect and thereby slowing thaw. Small-scale trials have shown measurable reductions in ground temperature in grazed areas compared to ungrazed controls. Other proposed interventions include applying reflective materials to soil surfaces to reduce heat absorption, though none has yet been shown to work at the scale required to make a meaningful difference.'],
    ['G', 'The greatest uncertainty in permafrost science concerns whether the release of carbon from thawing ground could trigger a runaway feedback: warming causes thaw, thaw releases greenhouse gases, and those gases cause further warming. Dr Ted Schuur of Northern Arizona University, who coordinates the Permafrost Carbon Network — an international collaboration of over 300 scientists — has argued that preventing catastrophic permafrost feedbacks is not possible without rapid and deep cuts to human greenhouse gas emissions. \'Nature has stored this carbon for thousands of years,\' he notes. \'We cannot engineer our way out of a problem of this magnitude. The only reliable intervention is to stop adding to the warming that is driving the thaw.\'']
  ],
  matchingInfo: info('Which section contains the following information?', [
    { prompt: 'a description of an experimental land management project designed to slow permafrost thaw', answer: 'F', evidence: 'Professor Sergey Zimov has developed the Pleistocene Park project, which aims to restore grassland ecosystems by reintroducing large grazing animals' },
    { prompt: 'an explanation of why methane release from permafrost is a greater climate concern than carbon dioxide release', answer: 'D', evidence: 'methane is approximately 87 times more potent as a warming agent over a twenty-year period' },
    { prompt: 'a reference to specific regions where permafrost is most at risk of thawing', answer: 'E', evidence: 'Low-lying areas of western Siberia, where vast expanses of frozen peat bogs lie just below the surface, are considered among the most at-risk regions globally' },
    { prompt: 'a claim that the only effective way to address permafrost thaw is to reduce human emissions', answer: 'G', evidence: 'The only reliable intervention is to stop adding to the warming that is driving the thaw' }
  ]),
  fill: fillBlock(
    'Complete the summary. Choose ONE WORD ONLY from the passage.',
    'Carbon storage in permafrost',
    [
      { prompt: 'The carbon locked in permafrost originates from the organic 5………………… of plants, animals and microorganisms that perished long ago and were frozen before decomposition could occur.', answer: 'remains', evidence: 'The carbon locked in permafrost comes from the organic remains of plants, animals and microorganisms' },
      { prompt: 'These materials have accumulated in permafrost 6………………… over many thousands of years.', answer: 'soils', evidence: 'These remains have accumulated in permafrost soils over millennia' },
      { prompt: 'Scientists estimate that they hold approximately 1,500 billion 7………………… of carbon in total — roughly double the quantity found in the 8………………… today.', answer: 'tonnes', evidence: 'approximately 1,500 billion tonnes of carbon' },
      { prompt: 'Scientists estimate that they hold approximately 1,500 billion tonnes of carbon in total — roughly double the quantity found in the 8………………… today.', answer: 'atmosphere', evidence: 'roughly twice the amount currently present in the atmosphere' }
    ]
  ),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Dr Katey Walter Anthony',
    'B — Dr Merritt Turetsky',
    'C — Professor Vladimir Romanovsky',
    'D — Dr Ted Schuur'
  ], [
    { prompt: 'Even a small release of Arctic methane could cause substantial and self-reinforcing increases in global temperatures.', answer: 'B', evidence: 'If thaw releases even a fraction of the methane currently stored in Arctic permafrost, the effect on global temperatures could be substantial and self-reinforcing' },
    { prompt: 'Methane emissions from thawing Arctic lakes have increased measurably over recent decades.', answer: 'A', evidence: 'has documented methane bubbling from beneath thawing lakes at rates that have increased measurably over the past twenty years' },
    { prompt: 'The speed of temperature change currently being recorded in permafrost has no historical precedent.', answer: 'C', evidence: 'the rate of warming we are recording in the top ten metres of permafrost in many locations is unprecedented in the observational record' },
    { prompt: 'Preventing the worst permafrost feedback scenarios requires deep and rapid reductions in human emissions.', answer: 'D', evidence: 'preventing catastrophic permafrost feedbacks is not possible without rapid and deep cuts to human greenhouse gas emissions' },
    { prompt: 'Permafrost thaw represents one of the most significant potential sources of amplified global warming.', answer: 'B', evidence: 'one of the most significant potential sources of amplified warming on the planet' }
  ])
}

const stage11Passage2: IntensivePassageLayout = {
  title: 'Cities on fire: the urban heat island and its remedies',
  paragraphs: [
    ['A', 'As the world\'s urban population continues to grow, cities face a thermal challenge that is becoming impossible to ignore. The urban heat island effect — the phenomenon by which built-up areas are measurably warmer than the surrounding countryside — has been documented in cities on every inhabited continent. In some metropolitan areas, the temperature difference between the urban core and surrounding rural land can reach 10 degrees Celsius on still, clear nights. This warmth, which persists through the night rather than dissipating as it does over open land, is more than a matter of discomfort. It is a public health problem with measurable consequences for mortality, productivity and quality of life.'],
    ['B', 'The causes of the urban heat island effect are well understood. Cities are dominated by dark, impermeable surfaces — roads, car parks and rooftops — that absorb solar radiation during the day and release it slowly as heat after dark. The near-total absence of vegetation removes the cooling effect of evapotranspiration: the process by which plants draw moisture from the soil and release it through their leaves, lowering the surrounding temperature. Buildings also emit substantial quantities of waste heat through the operation of air conditioning units, heating systems and industrial processes. Together, these factors create a thermal environment fundamentally different from the natural landscape that cities have replaced.'],
    ['C', 'The health consequences of urban overheating are severe and unevenly distributed. Research led by Dr Brian Stone of the Georgia Institute of Technology has found that heat-related mortality in major American cities is rising faster than mortality from any other weather-related cause, and that projections for mid-century suggest heat will become the leading weather-related cause of death in the United States. Elderly people, outdoor workers and residents of lower-income neighbourhoods — where tree cover and green space are typically least abundant — bear a disproportionate burden. Dr Vivek Shandas of Portland State University, who has mapped surface temperature variation within cities at high resolution, has found that the hottest urban neighbourhoods are routinely between 5 and 12 degrees Celsius warmer than the coolest parts of the same city.'],
    ['D', 'One of the most widely promoted and studied interventions is the cool roof: rooftop surfaces coated with highly reflective white or light-coloured materials that bounce solar radiation back into the atmosphere rather than absorbing it. Dr Ladd Keith of the University of Arizona, who has researched cool roof adoption across the American Southwest, estimates that retrofitting the rooftops of a major city could reduce peak urban temperatures by 1 to 2 degrees Celsius and cut building energy consumption by up to 20%. The technology is simple and relatively inexpensive, yet widespread adoption has been slow, partly because building owners who invest in cool roofs do not directly capture all the benefits, which are distributed across the neighbourhood.'],
    ['E', 'Trees and urban forests offer a complementary strategy. Mature trees provide direct shading of pavements and buildings, reducing surface temperatures by preventing solar radiation from reaching heat-absorbing surfaces. They also contribute to cooling through evapotranspiration. Professor Matthias Demuzere of KU Leuven in Belgium, who has modelled the cooling potential of urban greening across European cities, has found that strategically planted urban trees can reduce local air temperatures by between 1 and 4 degrees Celsius in surrounding streets. However, trees take decades to reach the size at which their cooling effect is most significant, meaning that tree planting today is primarily an investment in the climate resilience of the city of the future.'],
    ['F', 'Water features offer a faster-acting alternative. Fountains, canals, misting stations and permeable surfaces that allow rainwater to infiltrate rather than run off can all contribute to urban cooling through evaporation. Several European and Asian cities have invested in \'blue infrastructure\' — networks of water features integrated into public spaces — as part of their heat adaptation strategies. Rotterdam\'s water squares, which function as recreational areas in dry weather and as temporary water storage during heavy rainfall, exemplify this dual-purpose approach. The cooling effect of water features is highly localised, however, and their impact diminishes rapidly with distance from the source.'],
    ['G', 'The challenge for city authorities is to combine these strategies in ways that are affordable, equitable and scaled to the severity of the problem. Research consistently shows that the benefits of urban cooling interventions — whether trees, cool roofs or water features — are most needed in the lowest-income neighbourhoods, yet these are precisely the areas where private investment is least likely to occur without deliberate policy intervention. Dr Shandas argues that \'urban heat is not just an environmental problem — it is a justice problem. The cities that address it most effectively will be those that treat it as both.\'']
  ],
  matchingInfo: info('Which section contains the following information?', [
    { prompt: 'an explanation of the physical processes that make cities hotter than the surrounding countryside', answer: 'B', evidence: 'Cities are dominated by dark, impermeable surfaces — roads, car parks and rooftops — that absorb solar radiation during the day' },
    { prompt: 'a claim that the health burden of urban heat is not shared equally across city populations', answer: 'C', evidence: 'Elderly people, outdoor workers and residents of lower-income neighbourhoods — where tree cover and green space are typically least abundant — bear a disproportionate burden' },
    { prompt: 'a description of a dual-purpose water infrastructure approach used in a European city', answer: 'F', evidence: 'Rotterdam\'s water squares, which function as recreational areas in dry weather and as temporary water storage during heavy rainfall' },
    { prompt: 'a reference to research quantifying the cooling effect of strategically planted trees in cities', answer: 'E', evidence: 'strategically planted urban trees can reduce local air temperatures by between 1 and 4 degrees Celsius in surrounding streets' }
  ]),
  fill: fillBlock(
    'Complete the summary. Choose ONE WORD ONLY from the passage.',
    'The causes of the urban heat island',
    [
      { prompt: 'Cities are warmer than surrounding areas primarily because they contain many dark, impermeable 5………………… that absorb heat during the day.', answer: 'surfaces', evidence: 'Cities are dominated by dark, impermeable surfaces — roads, car parks and rooftops' },
      { prompt: 'A further cause is the absence of 6………………… , which normally cools the air by drawing 7………………… from the soil and releasing it through leaves.', answer: 'vegetation', evidence: 'The near-total absence of vegetation removes the cooling effect of evapotranspiration' },
      { prompt: 'A further cause is the absence of vegetation, which normally cools the air by drawing 7………………… from the soil and releasing it through leaves.', answer: 'moisture', evidence: 'plants draw moisture from the soil and release it through their leaves' },
      { prompt: 'Buildings contribute additional warmth by releasing waste 8………………… through air conditioning and heating systems.', answer: 'heat', evidence: 'Buildings also emit substantial quantities of waste heat through the operation of air conditioning units' }
    ]
  ),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Dr Brian Stone',
    'B — Dr Vivek Shandas',
    'C — Professor Matthias Demuzere',
    'D — Dr Ladd Keith'
  ], [
    { prompt: 'Heat-related deaths in American cities are increasing faster than those caused by any other weather event.', answer: 'A', evidence: 'heat-related mortality in major American cities is rising faster than mortality from any other weather-related cause' },
    { prompt: 'The hottest and coolest parts of the same city can differ in surface temperature by more than ten degrees.', answer: 'B', evidence: 'the hottest urban neighbourhoods are routinely between 5 and 12 degrees Celsius warmer than the coolest parts of the same city' },
    { prompt: 'Strategically placed trees can lower local air temperatures by up to four degrees Celsius.', answer: 'C', evidence: 'strategically planted urban trees can reduce local air temperatures by between 1 and 4 degrees Celsius' },
    { prompt: 'Replacing urban rooftops with reflective surfaces could reduce energy use in buildings by up to a fifth.', answer: 'D', evidence: 'cut building energy consumption by up to 20%' },
    { prompt: 'Addressing urban heat requires treating it as an issue of social equity, not just environmental management.', answer: 'B', evidence: 'urban heat is not just an environmental problem — it is a justice problem' }
  ])
}

import { STAGES_12_TO_15 } from './journeyIntensivePassages11to15Stages12to15.ts'

export const INTENSIVE_LAYOUTS_STAGE_11_15: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  11: [stage11Passage1, stage11Passage2],
  ...STAGES_12_TO_15
}
