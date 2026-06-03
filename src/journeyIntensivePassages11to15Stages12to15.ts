import type { IntensivePassageLayout, IntensiveQuestionSpec } from './intensivePassageBuilder.ts'

const info = (instruction: string, items: IntensiveQuestionSpec[]) => ({ instruction, items })
const fillBlock = (instruction: string, summaryTitle: string, items: NonNullable<IntensivePassageLayout['fill']>['items']) => ({
  instruction,
  summaryTitle,
  items
})
const people = (instruction: string, peopleList: string[], items: NonNullable<IntensivePassageLayout['matchingPeople']>['items']) => ({
  instruction,
  people: peopleList,
  items
})
const headings = (instruction: string, options: string[], items: NonNullable<IntensivePassageLayout['headings']>['items']) => ({
  instruction,
  options,
  items
})
const mcqBlock = (instruction: string, items: NonNullable<IntensivePassageLayout['mcq']>['items']) => ({ instruction, items })
const ynng = (instruction: string, items: NonNullable<IntensivePassageLayout['ynng']>['items']) => ({ instruction, items })

const mcq = (stem: string, opts: [string, string, string, string], answer: 'A' | 'B' | 'C' | 'D', evidence: string) => ({
  prompt: `${stem}\n\nA. ${opts[0]}\nB. ${opts[1]}\nC. ${opts[2]}\nD. ${opts[3]}`,
  answer,
  evidence
})

// ─── Stage 12 ───────────────────────────────────────────────────────────────

const stage12P1: IntensivePassageLayout = {
  title: 'Giant forests of the sea: the case for kelp',
  paragraphs: [
    ['A', 'When most people think of forests, they picture trees. Yet some of the largest and most ecologically productive forests on Earth grow not on land but beneath the sea. Giant kelp — a brown macroalgae — can grow at rates of up to 60 centimetres per day and reach heights of 45 metres, forming towering underwater structures that rival the complexity of any terrestrial forest. Kelp forests line the rocky coastlines of temperate and polar seas on every continent, from the cold Pacific coast of California and Chile to the waters off southern Australia, Japan and the British Isles. As the ecological and climatic value of these marine forests becomes better understood, scientists and conservationists are making a compelling case for their protection and restoration.'],
    ['B', 'Kelp forests are among the most biologically diverse marine ecosystems on Earth. The towering fronds of giant kelp create a multi-layered canopy beneath which hundreds of species of fish, invertebrates and marine mammals find shelter, food and breeding habitat. They provide nursery grounds for commercially important fish species, and their dense structure absorbs wave energy before it reaches the coastline, reducing erosion and protecting coastal communities from storm damage. The physical architecture of the kelp forest — with its distinct canopy, midwater and seafloor zones — supports a food web of remarkable complexity, providing habitat for everything from microscopic algae to sea otters and great white sharks.'],
    ['C', 'Scientists have also identified kelp as a potentially significant carbon sink. As kelp fronds grow and eventually detach, a proportion of the organic carbon they contain sinks to the deep ocean, where it may be sequestered for centuries or longer. A study by researchers at the Alfred Wegener Institute in Germany estimated that globally, kelp and other large seaweeds may export between 600 million and 1.8 billion tonnes of carbon to the deep ocean annually — a figure comparable to the carbon sequestration provided by the world\'s mangrove forests. However, the proportion of this carbon that is genuinely sequestered rather than decomposed in shallower water remains a subject of active scientific investigation.'],
    ['D', 'Kelp forests are, however, under severe threat. Sea surface temperatures in many kelp-growing regions have risen significantly over recent decades, and kelp is highly sensitive to warm water, which reduces its growth rate and increases its susceptibility to disease. In Tasmania, warm ocean currents have driven a dramatic retreat of kelp forests: Professor Cayne Layton of the University of Tasmania estimates that over 95% of the state\'s giant kelp forest has been lost since the 1940s. In California, marine heatwaves in 2014 and 2015 devastated bull kelp forests along the northern coast, contributing to a population explosion of purple sea urchins — which, in the absence of their natural predators, graze kelp to bare rock.'],
    ['E', 'Restoration efforts are now under way in several countries. In Tasmania, Professor Layton\'s team has been selectively breeding strains of giant kelp with greater tolerance for warmer water and transplanting juvenile kelp to degraded areas of the seafloor. In California, the nonprofit organisation Bay Foundation has used mechanical removal of excess sea urchins to create space for kelp recovery, with measurable results in several pilot sites. In Norway, large-scale aquaculture of sugar kelp is being developed both as a food and feed ingredient and as a way of restoring kelp forest cover in areas where it has declined.'],
    ['F', 'Despite these efforts, significant scientific debate persists about the scale of kelp\'s contribution to carbon sequestration. Dr Kyle Cavanaugh of the University of California, Los Angeles, who has used satellite imagery to track long-term changes in kelp forest coverage globally, cautions that \'we should not assume that kelp forests are a reliable global carbon sink until we have much better data on what happens to kelp carbon after it leaves the forest. A large proportion may be decomposed relatively quickly and the carbon returned to the water rather than buried.\' This uncertainty has led some scientists to argue that kelp restoration should be promoted primarily for its well-established biodiversity and fishery benefits, rather than for speculative climate benefits.'],
    ['G', 'Dr Tom Bell of Plymouth Marine Laboratory, who leads the UK\'s National Kelp Network, argues that protecting and restoring kelp forests is justified on multiple grounds regardless of the carbon sequestration debate: \'Kelp forests are foundational to the ecology of temperate rocky coastlines. Their loss cascades through the entire marine food web. We do not need to wait for certainty on carbon to know that these ecosystems are worth saving.\' Most researchers agree that kelp\'s biodiversity value is beyond doubt, and that restoration, where feasible, represents a high-priority conservation investment alongside — and independently of — its potential climate benefits.']
  ],
  matchingInfo: info('Which section contains the following information?', [
    { prompt: 'a reference to research estimating the total quantity of carbon that kelp may export to the deep ocean annually', answer: 'C', evidence: 'may export between 600 million and 1.8 billion tonnes of carbon to the deep ocean annually' },
    { prompt: 'a description of techniques being used to restore kelp forests in a specific country', answer: 'E', evidence: 'In Tasmania, Professor Layton\'s team has been selectively breeding strains of giant kelp with greater tolerance for warmer water and transplanting juvenile kelp' },
    { prompt: 'a warning against assuming that kelp forests reliably sequester carbon without further evidence', answer: 'F', evidence: 'we should not assume that kelp forests are a reliable global carbon sink until we have much better data' },
    { prompt: 'an argument that restoring kelp is worthwhile regardless of uncertainty about its carbon value', answer: 'G', evidence: 'protecting and restoring kelp forests is justified on multiple grounds regardless of the carbon sequestration debate' }
  ]),
  fill: fillBlock('Complete the summary. Choose ONE WORD ONLY from the passage.', 'The ecological role of kelp forests', [
    { prompt: 'The towering fronds create a multi-layered 5………………… that shelters hundreds of species of fish, invertebrates and marine 6………………… .', answer: 'canopy', evidence: 'create a multi-layered canopy beneath which hundreds of species of fish, invertebrates and marine mammals' },
    { prompt: 'The towering fronds create a multi-layered canopy that shelters hundreds of species of fish, invertebrates and marine 6………………… .', answer: 'mammals', evidence: 'hundreds of species of fish, invertebrates and marine mammals find shelter' },
    { prompt: 'They also provide 7………………… grounds that many commercially important fish depend on for breeding.', answer: 'nursery', evidence: 'They provide nursery grounds for commercially important fish species' },
    { prompt: 'In addition, the physical structure of a kelp forest absorbs 8………………… energy before it reaches the shore, helping to protect coastlines from damage.', answer: 'wave', evidence: 'their dense structure absorbs wave energy before it reaches the coastline' }
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Professor Cayne Layton',
    'B — Dr Kyle Cavanaugh',
    'C — Dr Tom Bell',
    'D — Alfred Wegener Institute researchers'
  ], [
    { prompt: 'More than nineteen-twentieths of one Australian state\'s giant kelp forest has been lost over eight decades.', answer: 'A', evidence: 'over 95% of the state\'s giant kelp forest has been lost since the 1940s' },
    { prompt: 'A large proportion of kelp carbon may decompose in shallow water rather than being permanently stored.', answer: 'B', evidence: 'A large proportion may be decomposed relatively quickly and the carbon returned to the water rather than buried' },
    { prompt: 'Kelp restoration is justified by its biodiversity and fishery value alone, regardless of climate arguments.', answer: 'C', evidence: 'We do not need to wait for certainty on carbon to know that these ecosystems are worth saving' },
    { prompt: 'Kelp and other large seaweeds may transport between 600 million and 1.8 billion tonnes of carbon annually to the deep ocean.', answer: 'D', evidence: 'kelp and other large seaweeds may export between 600 million and 1.8 billion tonnes of carbon to the deep ocean annually' },
    { prompt: 'Better data on the fate of kelp carbon after it leaves the forest is needed before reliable conclusions can be drawn.', answer: 'B', evidence: 'until we have much better data on what happens to kelp carbon after it leaves the forest' }
  ])
}

const stage12P2: IntensivePassageLayout = {
  title: 'Running out of sand: the world\'s hidden resource crisis',
  paragraphs: [
    ['A', 'Sand is so abundant that it is easy to assume it will always be available. It blankets deserts, lines beaches and carpets the floors of rivers and seas. Yet sand is the world\'s most consumed natural resource after water, and in the specific forms required by the modern construction industry, it is increasingly scarce. Concrete — the material that holds together the infrastructure of civilisation — is made primarily from sand and gravel. Glass, semiconductors, shale gas extraction and land reclamation all consume sand in vast quantities. The United Nations Environment Programme estimates that humanity extracts approximately 50 billion tonnes of sand and gravel every year, a rate that now exceeds the natural pace of replenishment in many of the world\'s most heavily exploited regions.'],
    ['B', 'The uses of sand are more varied than most people realise. In construction, sand is the key aggregate in concrete and mortar, and is also used in the manufacture of bricks and roofing tiles. Glass — including the glass in smartphone screens, solar panels and windows — is produced by melting sand at high temperatures. The hydraulic fracturing industry uses specially processed frac sand to prop open rock fissures and allow oil and gas to flow. Singapore, one of the world\'s most ambitious land reclamation projects, has added over 130 square kilometres to its territory over the past five decades using sand dredged from the seabeds of neighbouring countries.'],
    ['C', 'Not all sand is suitable for construction. Desert sand, which makes up the majority of the world\'s sand by volume, has grains that have been smoothed and rounded by wind to the point where they cannot bind effectively in concrete. Construction-grade sand must be angular — the product of water erosion acting on rocks. Rivers are therefore the primary source of construction sand globally, as flowing water produces the irregular grain shapes that concrete requires to set properly. As demand has outstripped the natural rate at which rivers replenish their sandy beds, dredging operations have intensified across Asia, Africa and South America, removing sand faster than it is replaced by the weathering of upstream rocks.'],
    ['D', 'The environmental consequences of large-scale river sand mining are severe. Removing sand from riverbeds lowers the riverbed level, which can cause riverbanks to collapse, undermine bridges and alter the flow patterns that entire ecosystems depend upon. The disruption to sediment transport also reduces the supply of sand to river deltas and coastlines downstream: researchers studying the Mekong, Yangtze and Mississippi rivers have all documented delta erosion linked to upstream sand extraction. Dr Trond Sakshaug of the Norwegian Institute for Water Research, who has studied sediment disruption in Asian river systems, has documented delta erosion linked to upstream sand extraction. In extreme cases, sand mining has caused the complete disappearance of small islands: in Indonesia, dozens of small islands have vanished in recent decades due to the intensive dredging of surrounding seabeds.'],
    ['E', 'The scale of illegal sand mining has attracted the attention of organised crime in several countries. Professor Pascal Peduzzi of the United Nations Environment Programme, who authored the first comprehensive global assessment of the sand crisis, has noted that in India, criminal networks known as \'sand mafias\' control much of the illegal extraction market, and that journalists and officials who have attempted to expose them have faced violence and intimidation. In Morocco and Vietnam, illegal dredging operations have damaged protected coastal habitats, and local communities have been forcibly displaced from fishing grounds that were destroyed by sand removal.'],
    ['F', 'Alternatives to river sand are being developed and deployed with increasing urgency. Manufactured sand — produced by crushing quarried rock — can replicate many of the properties of river sand in concrete and is already widely used in countries such as India and China. Recycled aggregates, made by crushing demolition waste, are gaining traction in several European countries as part of circular economy strategies. Dr Aurora Torres of the German Centre for Integrative Biodiversity Research has argued that recycling demolition waste could reduce demand for primary sand extraction by a significant margin if done systematically, though she acknowledges that quality consistency remains a challenge. Dr Nora Kaminsky of the Technical University of Berlin, who specialises in circular construction materials, has argued that systematic recycling of demolition waste could meaningfully reduce demand for new sand extraction, though quality consistency remains a challenge.'],
    ['G', 'International efforts to regulate sand extraction are in their early stages. The United Nations Environment Programme has called for a global monitoring framework for sand extraction, and several countries — including Vietnam and Kenya — have imposed bans on river sand mining, with mixed results. Professor Peduzzi argues that the fundamental problem is that sand is treated as a free resource with no economic price attached to its extraction: \'Until the true cost of sand — including the environmental damage caused by its removal — is reflected in the price of construction materials, market forces will continue to drive unsustainable extraction.\' Most researchers agree that addressing the sand crisis will require a combination of regulation, recycling, substitution and, above all, a significant reduction in the construction industry\'s overall material consumption.']
  ],
  matchingInfo: info('Which section contains the following information?', [
    { prompt: 'an explanation of why desert sand cannot be used in the construction industry', answer: 'C', evidence: 'Desert sand, which makes up the majority of the world\'s sand by volume, has grains that have been smoothed and rounded by wind to the point where they cannot bind effectively in concrete' },
    { prompt: 'a reference to the criminal activity associated with illegal sand extraction in certain countries', answer: 'E', evidence: 'criminal networks known as \'sand mafias\' control much of the illegal extraction market' },
    { prompt: 'a description of how large-scale sand removal from rivers damages coastlines and deltas', answer: 'D', evidence: 'reduces the supply of sand to river deltas and coastlines downstream' },
    { prompt: 'a claim that sand needs to be given an economic value that reflects the cost of extracting it', answer: 'G', evidence: 'Until the true cost of sand — including the environmental damage caused by its removal — is reflected in the price of construction materials' }
  ]),
  fill: fillBlock('Complete the summary. Choose ONE WORD ONLY from the passage.', 'Why river sand is essential for construction', [
    { prompt: 'Desert sand has 5………………… that have been rounded too smoothly by 6………………… to bond effectively in concrete.', answer: 'grains', evidence: 'has grains that have been smoothed and rounded by wind' },
    { prompt: 'Desert sand has grains that have been rounded too smoothly by 6………………… to bond effectively in concrete.', answer: 'wind', evidence: 'smoothed and rounded by wind' },
    { prompt: 'Suitable construction sand must come from 7………………… , where the action of water creates the angular grain shapes that concrete needs.', answer: 'rivers', evidence: 'Rivers are therefore the primary source of construction sand globally' },
    { prompt: 'However, as demand has exceeded the speed at which rivers naturally refill their sandy 8………………… , dredging has accelerated to unsustainable levels.', answer: 'beds', evidence: 'rivers replenish their sandy beds' }
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Professor Pascal Peduzzi',
    'B — Dr Aurora Torres',
    'C — Dr Trond Sakshaug',
    'D — Dr Nora Kaminsky'
  ], [
    { prompt: 'Until the environmental cost of sand extraction is included in its price, unsustainable removal will continue.', answer: 'A', evidence: 'Until the true cost of sand — including the environmental damage caused by its removal — is reflected in the price of construction materials, market forces will continue to drive unsustainable extraction' },
    { prompt: 'Systematic recycling of demolition waste could meaningfully reduce demand for new sand extraction.', answer: 'B', evidence: 'recycling demolition waste could reduce demand for primary sand extraction by a significant margin if done systematically' },
    { prompt: 'Sand removal from river systems has been linked to measurable erosion of downstream deltas and coastlines.', answer: 'C', evidence: 'has documented delta erosion linked to upstream sand extraction' },
    { prompt: 'Addressing the sand crisis will require regulation, recycling and reduced overall material consumption.', answer: 'A', evidence: 'addressing the sand crisis will require a combination of regulation, recycling, substitution and, above all, a significant reduction in the construction industry\'s overall material consumption' },
    { prompt: 'Quality consistency is a remaining challenge for recycled aggregates as a substitute for river sand.', answer: 'B', evidence: 'quality consistency remains a challenge' }
  ])
}

// ─── Stage 13 ───────────────────────────────────────────────────────────────

const stage13P1: IntensivePassageLayout = {
  title: 'Losing the night: the science of light pollution',
  paragraphs: [
    ['A', 'For most of human history, night was dark. The stars that filled the sky were navigation aids, seasonal calendars and objects of wonder. Today, for more than a third of the world\'s population — including 60% of Europeans and 80% of North Americans — the Milky Way is no longer visible from where they live. Artificial light has transformed the night sky into an orange glow that extends hundreds of kilometres from city centres. This transformation, known as light pollution, is not merely an aesthetic loss. Scientists have documented its consequences for the behaviour, physiology and survival of a wide range of species, including humans, making it one of the most pervasive but least regulated forms of environmental contamination.'],
    ['B', 'Insects are among the organisms most severely affected by artificial light at night. Many species evolved to navigate by the light of the moon and stars, and moths in particular are fatally attracted to artificial light sources, with individuals killed by contact with lit surfaces or exhausted by circling fixtures until they die. The resulting decline in insect populations has cascading effects on the broader food web, reducing the availability of prey for bats, birds and many other predators. The seasonal migration of birds — which depend on star patterns for navigation across continents — is also disrupted when artificial light creates false environmental cues, causing individuals to lose their sense of direction or to be grounded in urban areas far from their intended route. In mammals, artificial light at night suppresses the production of melatonin, a hormone that regulates sleep, immune function and a range of other physiological processes.'],
    ['C', 'The human health implications of light pollution have attracted growing scientific attention. Dr Mario Motta of the Italian Society for General Medicine has noted that chronic exposure to artificial light at night — particularly blue-spectrum light from LED screens and street lighting — significantly disrupts the human circadian rhythm, impairing sleep quality and suppressing melatonin production. Epidemiological studies have found associations between elevated light exposure at night and higher rates of obesity, diabetes, depression and certain cancers, though researchers caution that these are associations rather than proven causal relationships. Shift workers and urban residents whose bedrooms face brightly lit streets are among the most exposed groups.'],
    ['D', 'Astronomers were among the first professional communities to recognise and campaign against light pollution, as the glare from cities steadily limited the capability of ground-based observatories. Several major research telescopes — including those at La Palma in the Canary Islands and Mauna Kea in Hawaii — have been established in locations chosen partly for their remoteness from urban light sources. Dr Franz Hölker of the Leibniz Institute of Freshwater Ecology and Inland Fisheries in Berlin, who led one of the first comprehensive global studies of light pollution\'s ecological impacts, describes it as \'a creeping catastrophe — one that advances so gradually that each generation accepts the diminished sky it inherits as normal.\''],
    ['E', 'The International Dark-Sky Association, founded in the United States in 1988, has designated over 200 official dark sky parks, reserves and sanctuaries worldwide — areas where local authorities and landowners have committed to reducing artificial light and enforcing lighting ordinances. These designated areas, which include Exmoor National Park in England, the Kerry International Dark-Sky Reserve in Ireland and the NamibRand Nature Reserve in Namibia, serve both as refuges for light-sensitive species and as visitor destinations for astrotourism. The economic value of astrotourism has been cited by local authorities in several regions as a compelling argument for lighting restrictions that might otherwise face resistance.'],
    ['F', 'Technological advances offer some grounds for optimism. Modern LED street lighting, when designed with downward-facing shields that prevent light from scattering upward or sideways, can deliver the same illumination as conventional lights while dramatically reducing light pollution. The use of warm-spectrum LEDs — which emit less of the blue light most disruptive to biological systems — is also gaining traction in some municipalities. Professor Travis Longcore of the University of California, Los Angeles, who researches the ecological effects of urban lighting, argues that \'the technology to light our cities effectively while dramatically reducing ecological damage already exists. The barrier is not technical — it is a matter of awareness and political will.\''],
    ['G', 'Most researchers agree that addressing light pollution requires both technological and behavioural change. Reducing unnecessary outdoor lighting, shielding fixtures to direct light downward, switching off decorative lighting during ecologically sensitive periods such as bird migration season, and adopting warm-spectrum LEDs in new installations are all practical measures that can be implemented without significant cost or inconvenience. Whether cities and governments will act on this consensus in the absence of stronger regulation remains uncertain, but the growing body of evidence linking light pollution to ecological and human health harms is making it increasingly difficult to dismiss as a minor concern.']
  ],
  matchingInfo: info('Which section contains the following information?', [
    { prompt: 'an explanation of how light pollution affects the nightly behaviour and mortality of insects', answer: 'B', evidence: 'moths in particular are fatally attracted to artificial light sources' },
    { prompt: 'a reference to designated areas established specifically to protect the natural darkness of the night sky', answer: 'E', evidence: 'has designated over 200 official dark sky parks, reserves and sanctuaries worldwide' },
    { prompt: 'evidence of an association between artificial light and negative outcomes for human health', answer: 'C', evidence: 'associations between elevated light exposure at night and higher rates of obesity, diabetes, depression and certain cancers' },
    { prompt: 'an argument that the technology needed to reduce light pollution already exists and the barrier is political', answer: 'F', evidence: 'the technology to light our cities effectively while dramatically reducing ecological damage already exists. The barrier is not technical — it is a matter of awareness and political will' }
  ]),
  fill: fillBlock('Complete the summary. Choose ONE WORD ONLY from the passage.', 'The impact of light pollution on wildlife', [
    { prompt: 'Many 5………………… evolved to navigate using moonlight and stars, and 6………………… in particular are frequently killed by artificial light sources.', answer: 'insects', evidence: 'Insects are among the organisms most severely affected' },
    { prompt: 'Many insects evolved to navigate using moonlight and stars, and 6………………… in particular are frequently killed by artificial light sources.', answer: 'moths', evidence: 'moths in particular are fatally attracted to artificial light sources' },
    { prompt: 'The decline in insect 7………………… that results from this reduces the food available to bats, birds and other predators.', answer: 'populations', evidence: 'The resulting decline in insect populations has cascading effects' },
    { prompt: 'The seasonal 8………………… of birds, which relies on star patterns, is also disrupted when artificial light produces misleading environmental signals.', answer: 'migration', evidence: 'The seasonal migration of birds — which depend on star patterns for navigation across continents — is also disrupted' }
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Dr Mario Motta',
    'B — Dr Franz Hölker',
    'C — International Dark-Sky Association',
    'D — Professor Travis Longcore'
  ], [
    { prompt: 'Chronic night-time light exposure seriously disrupts human sleeping patterns and hormone production.', answer: 'A', evidence: 'chronic exposure to artificial light at night — particularly blue-spectrum light from LED screens and street lighting — significantly disrupts the human circadian rhythm, impairing sleep quality and suppressing melatonin production' },
    { prompt: 'Each generation has come to accept a darker sky than the previous one as normal — a form of gradual loss.', answer: 'B', evidence: 'each generation accepts the diminished sky it inherits as normal' },
    { prompt: 'Officially protected areas free from artificial light serve both ecological and economic purposes.', answer: 'C', evidence: 'serve both as refuges for light-sensitive species and as visitor destinations for astrotourism' },
    { prompt: 'Reducing ecological damage from city lighting is technically achievable and requires only awareness and political commitment.', answer: 'D', evidence: 'The barrier is not technical — it is a matter of awareness and political will' },
    { prompt: 'Light pollution is a pervasive environmental problem that advances too gradually for most people to notice.', answer: 'B', evidence: 'a creeping catastrophe — one that advances so gradually' }
  ])
}

const bicycleHeadings = [
  'The arrival of pedal power, at a cost',
  'The velocipede becomes popular among fashionable riders',
  'A safer design opens cycling to a far wider audience',
  'Replaced by a more powerful rival',
  'The penny-farthing\'s large front wheel creates dangerous conditions',
  'Broader social change follows mass adoption',
  'An innovation whose moment had not yet arrived',
  'Speed achieved at the expense of accessibility',
  'A chain-driven rear wheel replaces dangerous large front wheel'
]

const stage13P2: IntensivePassageLayout = {
  title: 'Two wheels: the remarkable evolution of the bicycle',
  paragraphs: [
    ['A', 'Few inventions have transformed human mobility as profoundly as the bicycle, yet its origins were modest and its early development halting. The first recognisable ancestor of the modern bicycle was the draisine, invented in 1817 by Karl von Drais, a German civil servant and amateur inventor. The draisine was a simple wooden frame mounted on two wheels, propelled by the rider pushing alternately with each foot against the ground. It had no pedals and no steering mechanism in the modern sense. Despite its crudeness, it attracted enormous public curiosity and brief fashionable popularity, particularly among wealthy young men in Germany, France and Britain. Then, as quickly as it appeared, it faded from view — a curiosity rather than a revolution.'],
    ['B', 'The decisive addition of pedals came in the 1860s, when French mechanics attached cranks and pedals directly to the front wheel of a two-wheeled vehicle, creating what became known as the velocipede — or, less charitably, the boneshaker, a name that reflected its uncomfortable performance on cobbled streets. The velocipede was heavier than the draisine and required genuine effort to ride, but it offered something entirely new: the ability to propel a wheeled vehicle using continuous rotary motion from the legs, without the need to touch the ground. Velocipede clubs proliferated across France and Britain, and indoor riding schools taught the fashionable how to mount, balance and steer.'],
    ['C', 'In the 1870s and 1880s, the quest for speed produced a design that sacrificed safety for performance. The high-wheeled penny-farthing, whose front wheel could reach diameters of over 1.5 metres, translated each pedal stroke directly into forward movement without any gearing mechanism, achieving speeds that the velocipede could not match. The penny-farthing attracted an enthusiastic following among young, physically able men who were willing to accept its hazards. Mounting and dismounting required considerable skill, and a front-wheel collision or rut in the road could send the rider tumbling over the handlebars from a considerable height. Women and older riders were effectively excluded from cycling by a machine whose operation demanded both athleticism and a tolerance for injury.'],
    ['D', 'The transformation that made cycling truly accessible came in 1885, when John Kemp Starley introduced the Rover Safety Bicycle in Coventry. Starley\'s design replaced the penny-farthing\'s unequal wheels with two wheels of equal size, and introduced a chain drive connecting the pedals to the rear wheel through a system of sprockets. This arrangement allowed the gear ratio — and therefore the relationship between pedalling effort and speed — to be adjusted independently of wheel size, eliminating the need for a dangerous large front wheel. The Rover was lower, more stable, far easier to mount and dismount, and equally capable of speed. Within a decade, the high-wheeler had been consigned to history.'],
    ['E', 'The impact of the safety bicycle extended far beyond transport. For women, the bicycle represented a transformative form of personal freedom at a time when respectable female movement was constrained by both social convention and the physical limitations of fashionable dress. Cycling campaigners helped drive reforms in women\'s clothing, and prominent figures in the women\'s suffrage movement described the bicycle as a tool of liberation. The cycling boom of the 1890s saw bicycle ownership spread rapidly across class boundaries in Britain, the United States and much of Europe, creating a mass-participation leisure activity and a demand for improved road surfaces that would later benefit the automobile.'],
    ['F', 'The rise of the motor car in the early twentieth century gradually transformed the bicycle from a primary means of transport into a recreational and sporting object in most wealthy nations. Roads were redesigned around the needs of motorised vehicles, and cycling came to be seen as the province of children, athletes and those who could not afford a car. By mid-century, cycling infrastructure in many countries had been allowed to deteriorate, and the modal share of the bicycle in urban transport — which had been substantial in many cities in the 1890s — had fallen to negligible levels across most of the English-speaking world.'],
    ['G', 'In the early twenty-first century, the picture has changed again. Concerns about urban congestion, air pollution and climate change have driven significant public and private investment in cycling infrastructure in cities across Europe, Asia and North America. The development of the electric bicycle — which provides motorised assistance to the rider\'s pedalling effort — has extended the practical range of cycling and made it accessible to older riders and those with physical limitations. Cycling\'s role in reducing urban emissions, improving public health and easing traffic congestion has given it a political salience it has not enjoyed since the 1890s.']
  ],
  headings: headings('Choose the correct heading for each paragraph, A–F, from the list below. Paragraph G does not require a heading.', bicycleHeadings, [
    { prompt: 'Paragraph A', answer: 'vii', evidence: 'Then, as quickly as it appeared, it faded from view — a curiosity rather than a revolution' },
    { prompt: 'Paragraph B', answer: 'i', evidence: 'the boneshaker, a name that reflected its uncomfortable performance on cobbled streets' },
    { prompt: 'Paragraph C', answer: 'viii', evidence: 'the quest for speed produced a design that sacrificed safety for performance' },
    { prompt: 'Paragraph D', answer: 'iii', evidence: 'The transformation that made cycling truly accessible came in 1885' },
    { prompt: 'Paragraph E', answer: 'vi', evidence: 'The impact of the safety bicycle extended far beyond transport' },
    { prompt: 'Paragraph F', answer: 'iv', evidence: 'The rise of the motor car in the early twentieth century gradually transformed the bicycle' }
  ]),
  mcq: mcqBlock('Choose the correct letter, A, B, C or D.', [
    mcq('What does the writer say about the draisine in paragraph A?', [
      'It was immediately recognised as a revolutionary mode of transport.',
      'It enjoyed brief popularity before fading from public interest.',
      'It was widely adopted by working people as a practical means of travel.',
      'It was invented by a professional engineer with a background in mechanics.'
    ], 'B', 'Then, as quickly as it appeared, it faded from view — a curiosity rather than a revolution'),
    mcq('According to paragraph C, why were women effectively excluded from riding the penny-farthing?', [
      'Social convention prevented women from appearing in public on vehicles.',
      'The machine\'s design required physical capabilities and a willingness to accept injury.',
      'Women lacked the financial means to purchase such an expensive vehicle.',
      'Legal restrictions in several countries banned women from riding high-wheeled bicycles.'
    ], 'B', 'Women and older riders were effectively excluded from cycling by a machine whose operation demanded both athleticism and a tolerance for injury'),
    mcq('What does the writer suggest about the impact of the bicycle in paragraph E?', [
      'It was primarily significant as a contribution to sporting achievement.',
      'Its popularity depended on improvements to the road network.',
      'It contributed to social and political change as well as personal mobility.',
      'Its adoption was limited to the wealthier sections of society.'
    ], 'C', 'prominent figures in the women\'s suffrage movement described the bicycle as a tool of liberation')
  ]),
  ynng: ynng('Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.', [
    { prompt: 'The safety bicycle replaced the penny-farthing within a decade of its introduction.', answer: 'YES', evidence: 'Within a decade, the high-wheeler had been consigned to history' },
    { prompt: 'Women were among the first enthusiastic riders of the penny-farthing.', answer: 'NO', evidence: 'Women and older riders were effectively excluded from cycling' },
    { prompt: 'Cycling remains as popular for urban commuting in English-speaking countries as it was in the 1890s.', answer: 'NO', evidence: 'the modal share of the bicycle in urban transport — which had been substantial in many cities in the 1890s — had fallen to negligible levels across most of the English-speaking world' },
    { prompt: 'Electric bicycles have extended cycling to older riders and those with physical limitations.', answer: 'YES', evidence: 'has extended the practical range of cycling and made it accessible to older riders and those with physical limitations' }
  ])
}

// ─── Stage 14 ───────────────────────────────────────────────────────────────

const segwayHeadings = [
  'Extraordinary expectations surround an imminent announcement',
  'Useful roles emerge within specific sectors',
  'Jeff Bezos and cities place early orders for the new device',
  'The self-balancing gyroscope system explained',
  'Reality fails to match the pre-launch promise',
  'The science behind seemingly effortless motion',
  'Ownership changes and a tragic event mark a difficult period',
  'Cautious early trials by a small number of users',
  'Prohibitive cost and legal ambiguity limit mass adoption'
]

const stage14P1: IntensivePassageLayout = {
  title: 'The Segway: the machine that was going to change everything',
  paragraphs: [
    ['A', 'In December 2001, the technology world was gripped by a level of anticipation that had rarely been seen before in the consumer electronics industry. For months, rumours had been circulating about a mysterious invention codenamed \'Ginger\', developed by the American engineer Dean Kamen. Early leaks suggested the device was of such world-altering significance that Steve Jobs had reportedly described it as \'bigger than the personal computer\' and John Doerr, a prominent Silicon Valley venture capitalist, had compared it to the internet. When the device was finally unveiled on a US television programme, the public response was a mixture of fascination and bafflement. It was a two-wheeled electric scooter.'],
    ['B', 'The Segway Human Transporter worked on a principle that felt almost magical to first-time riders. A system of gyroscopes and tilt sensors monitored the rider\'s centre of gravity several hundred times per second, making continuous micro-adjustments to the electric motors driving each wheel to maintain balance. To move forward, the rider simply leaned slightly forward; to stop, they leaned back. There was no throttle, no brake lever and no gear mechanism. The result was a machine that appeared to read the rider\'s intentions directly, responding to shifts in body weight with an immediacy that felt instinctive. Kamen believed the Segway would make personal urban transport as natural and effortless as walking.'],
    ['C', 'Initial responses from cities, corporations and media were enthusiastic. Amazon, General Electric and the US Postal Service all ordered test fleets. Several American cities announced trials of the Segway for police patrols and municipal workers. Jeff Bezos described it as a \'breakthrough\'. Newspapers ran photographs of politicians and executives gliding along pavements with the expression of people who believed they were looking at the future. The company projected first-year sales of 50,000 to 100,000 units and anticipated rapid global expansion.'],
    ['D', 'The enthusiasm did not survive contact with reality. At a retail price of approximately 5,000 US dollars, the Segway was beyond the means of the overwhelming majority of potential users. Its weight and size made it impractical for public transport and most public spaces, and its legal status — too fast for pavements in many jurisdictions, too slow and unsafe for roads — created regulatory uncertainty that varied from city to city. Most critically, it solved a problem that most urban dwellers did not feel they had. Pedestrians walked; cyclists cycled; drivers drove. The Segway occupied an awkward middle ground that appealed to almost no one. Within its first two years, the company had sold fewer than 10,000 units — a fraction of its projections.'],
    ['E', 'The Segway found a genuine, if narrow, niche in specific professional and commercial contexts. Police forces in tourist-heavy city centres adopted it as a patrol vehicle. Airport authorities used it for covering large terminal distances. Tour operators in cities including Barcelona, Amsterdam and Washington DC discovered that guided Segway tours attracted paying visitors who found the novelty appealing. Warehouses and large manufacturing facilities used it for moving workers and supervisors quickly across large floor areas. In these focused applications, the Segway\'s speed, quiet operation and zero emissions made practical sense in a way that it never did for general urban transport.'],
    ['F', 'The corporate history of the Segway grew increasingly troubled. In 2009, Kamen sold the company to the British entrepreneur Jimi Heselden, who died the following year in a tragic accident when his Segway toppled over a cliff on his Yorkshire estate. The company passed through further ownership changes and reinventions, eventually being acquired by a Chinese robotics company, Ninebot, in 2015. Despite an attempt to relaunch the brand as part of a wider personal mobility portfolio, the Segway PT — the original stand-on scooter — was discontinued in July 2020. The company cited low sales volumes and the shift in manufacturing capacity towards other personal electric vehicles as the reasons for ending production.'],
    ['G', 'The story of the Segway has become a cautionary tale taught in business schools about the gap between technological capability and genuine market need. Kamen\'s invention was genuinely innovative: the self-balancing technology it pioneered has since found applications in robotics, prosthetics and the far more commercially successful category of electric balance boards and scooters. But the Segway itself illustrates the difficulty of predicting how technology will actually be used, and the particular danger of allowing extraordinary expectations to shape both investment decisions and public perception before a product has been tested in the real world.']
  ],
  headings: headings('Choose the correct heading for each paragraph, A–F, from the list below. Paragraph G does not require a heading.', segwayHeadings, [
    { prompt: 'Paragraph A', answer: 'i', evidence: 'Early leaks suggested the device was of such world-altering significance' },
    { prompt: 'Paragraph B', answer: 'vi', evidence: 'A system of gyroscopes and tilt sensors monitored the rider\'s centre of gravity' },
    { prompt: 'Paragraph C', answer: 'viii', evidence: 'Initial responses from cities, corporations and media were enthusiastic' },
    { prompt: 'Paragraph D', answer: 'v', evidence: 'The enthusiasm did not survive contact with reality' },
    { prompt: 'Paragraph E', answer: 'ii', evidence: 'The Segway found a genuine, if narrow, niche in specific professional and commercial contexts' },
    { prompt: 'Paragraph F', answer: 'vii', evidence: 'Kamen sold the company to the British entrepreneur Jimi Heselden, who died the following year in a tragic accident' }
  ]),
  mcq: mcqBlock('Choose the correct letter, A, B, C or D.', [
    mcq('What does the writer suggest about the public reaction when the Segway was finally revealed?', [
      'People were immediately convinced it would transform urban transport.',
      'The response combined interest with a sense of disappointment.',
      'Audiences were deeply impressed by the sophistication of its technology.',
      'Reaction was overwhelmingly negative, particularly from the media.'
    ], 'B', 'the public response was a mixture of fascination and bafflement'),
    mcq('According to paragraph D, what was the most fundamental reason for the Segway\'s commercial failure?', [
      'Its price was too high for any significant group of consumers.',
      'Its legal status made it impossible to use in most cities.',
      'It addressed a transport need that most people did not actually have.',
      'Negative media coverage damaged consumer confidence in the product.'
    ], 'C', 'it solved a problem that most urban dwellers did not feel they had'),
    mcq('What does the writer say about Segway technology in the final paragraph?', [
      'It proved that self-balancing technology has no commercial future.',
      'Its innovations were later applied successfully in other products and fields.',
      'It demonstrated that consumer electronics companies should avoid transport markets.',
      'Its failure discouraged further investment in personal electric vehicles.'
    ], 'B', 'the self-balancing technology it pioneered has since found applications in robotics, prosthetics and the far more commercially successful category of electric balance boards and scooters')
  ]),
  ynng: ynng('Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.', [
    { prompt: 'Early publicity linked the Segway to comparisons with major technological revolutions such as the personal computer.', answer: 'YES', evidence: 'Steve Jobs had reportedly described it as \'bigger than the personal computer\'' },
    { prompt: 'The original Segway PT was still in production after 2020.', answer: 'NO', evidence: 'the Segway PT — the original stand-on scooter — was discontinued in July 2020' },
    { prompt: 'Most urban commuters chose the Segway over walking or cycling within two years of launch.', answer: 'NOT GIVEN', evidence: 'Within its first two years, the company had sold fewer than 10,000 units' },
    { prompt: 'Self-balancing technology developed for the Segway was later used in other commercial products.', answer: 'YES', evidence: 'has since found applications in robotics, prosthetics and the far more commercially successful category of electric balance boards and scooters' }
  ])
}

const stage14P2: IntensivePassageLayout = {
  title: 'Later school start times: sleep science meets educational policy',
  paragraphs: [
    ['A', 'The average teenager is not lazy. According to decades of research in chronobiology — the science of biological time — adolescents are physiologically incapable of falling asleep early in the evening, regardless of how tired they are. From the onset of puberty, the human circadian rhythm undergoes a biological shift that delays the timing of sleep by approximately two hours relative to the childhood pattern. This shift is not a cultural habit or a failure of self-discipline: it is driven by hormonal changes associated with physical maturation, and it is observed in adolescents across different cultures, geographic locations and levels of technology exposure. The practical consequence of this shift is that most teenagers cannot fall asleep before 11pm, yet school start times in many countries require them to be alert and ready to learn by 7.30 or 8.00 in the morning.'],
    ['B', 'The mismatch between adolescent biology and school schedules was first comprehensively documented by Dr Mary Carskadon of Brown University in Rhode Island, whose research from the 1990s onwards established that sleep deprivation in teenagers is not incidental but structurally embedded in how education systems are organised. Carskadon\'s work showed that the combination of a biological late-sleep tendency and an early school start time produces a form of chronic sleep restriction in most adolescents, with measurable consequences for cognitive performance, emotional regulation, physical health and accident risk. She has described early school start times as \'a public health issue hiding in plain sight.\''],
    ['C', 'Studies conducted in school settings across the United States, the United Kingdom and Australia have found that early school start times are consistently associated with higher rates of depression, anxiety and academic underperformance among students. A landmark natural experiment occurred when Seattle public schools moved their high school start time back by nearly an hour in 2016. A study led by Dr Horacio De La Iglesia of the University of Washington found that students gained an average of 34 minutes of additional sleep per night following the change. Academic performance improved measurably, and the research team reported a significant increase in school attendance rates.'],
    ['D', 'The obstacles to changing school start times are, however, real and substantial. In many school districts, start times are determined not by pedagogical considerations but by transport logistics: a single fleet of buses must serve schools at different levels, and staggering start times to allow buses to make multiple runs is the cheapest way to cover large geographic areas. Moving high school start times later often means pushing primary school times earlier, which creates problems for working parents of younger children. Teachers\' contracts frequently specify working hours that cannot easily be adjusted without renegotiation. Dr Kyla Wahlstrom of the University of Minnesota, who has studied the policy implementation of later start times across multiple districts, notes that \'the resistance is rarely about the science. The science is clear. The resistance is about logistics, habit and the reluctance of institutions to change.\''],
    ['E', 'Proponents of later start times have argued that the practical difficulties, while genuine, are routinely overstated. They point to the experience of districts that have successfully made the change — including Seattle, Minneapolis and several districts in the UK — and found that the predicted logistical problems were more manageable than anticipated once administrators committed to working through them. The American Academy of Pediatrics, the American Medical Association and the American Academy of Sleep Medicine have all issued policy statements recommending that middle and high schools should not start before 8.30am, citing the volume and consistency of evidence linking later start times to improved student outcomes.'],
    ['F', 'The debate about school start times also raises broader questions about whose interests education systems are designed to serve. Critics of the status quo argue that the discomfort and inconvenience imposed on adolescents by early start times is treated as an inevitable given, while the discomfort that would be caused by changing start times for parents, transport providers and administrators is treated as an insuperable barrier. Defenders of the current system argue that schools must balance the needs of many stakeholders, and that sleep is only one of many factors influencing student wellbeing and performance.'],
    ['G', 'Whether later school start times become standard practice will depend less on the scientific evidence — which most experts agree points clearly in one direction — than on whether education systems can find practical models for implementation that address the legitimate concerns of parents, transport providers and teachers. The experience of districts that have made the change suggests that those concerns, while real, are not insurmountable. The harder challenge may be persuading institutions designed around the needs of adults to reorganise themselves around the biology of the young people they exist to serve.']
  ],
  mcq: mcqBlock('Choose the correct letter, A, B, C or D.', [
    mcq('What does the writer establish in the first paragraph about teenage sleep patterns?', [
      'They are primarily the result of teenagers\' use of technology before bedtime.',
      'They are a biological phenomenon driven by physical changes at puberty.',
      'They vary considerably between cultures and geographic regions.',
      'They can be corrected through consistent sleep hygiene routines.'
    ], 'B', 'it is driven by hormonal changes associated with physical maturation'),
    mcq('According to the third paragraph, what was significant about the Seattle school experiment?', [
      'It was the first study to link school start times to rates of student depression.',
      'It produced improvements in both attendance and academic outcomes after a modest time shift.',
      'It showed that students needed at least one hour of additional sleep to improve performance.',
      'It demonstrated that students\' sleep patterns normalised within weeks of the change.'
    ], 'B', 'Academic performance improved measurably, and the research team reported a significant increase in school attendance rates'),
    mcq('What does Dr Wahlstrom suggest about the reasons why changing school start times is difficult?', [
      'Most administrators are genuinely unconvinced by the research evidence.',
      'The opposition comes from practical constraints rather than disagreement with the science.',
      'Parents are the principal obstacle to reform in most school districts.',
      'The financial cost of changing transport arrangements is prohibitive for most districts.'
    ], 'B', 'the resistance is rarely about the science. The science is clear. The resistance is about logistics, habit and the reluctance of institutions to change')
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Dr Mary Carskadon',
    'B — Dr Horacio De La Iglesia',
    'C — Dr Kyla Wahlstrom',
    'D — American Academy of Pediatrics'
  ], [
    { prompt: 'Chronic sleep loss in teenagers is structurally produced by the organisation of school timetables.', answer: 'A', evidence: 'sleep deprivation in teenagers is not incidental but structurally embedded in how education systems are organised' },
    { prompt: 'Following a one-hour shift in start time, students gained measurably more sleep each night.', answer: 'B', evidence: 'students gained an average of 34 minutes of additional sleep per night following the change' },
    { prompt: 'The difficulty of changing school start times lies with institutions, not with the evidence.', answer: 'C', evidence: 'the resistance is rarely about the science' },
    { prompt: 'Sleep deprivation among adolescents represents a public health problem that is widely overlooked.', answer: 'A', evidence: 'a public health issue hiding in plain sight' },
    { prompt: 'Schools should not begin before 8.30am, based on consistent evidence of better student outcomes.', answer: 'D', evidence: 'middle and high schools should not start before 8.30am' },
    { prompt: 'The improvement in school attendance following a later start time was a measurable and significant finding.', answer: 'B', evidence: 'a significant increase in school attendance rates' }
  ]),
  ynng: ynng('Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.', [
    { prompt: 'The biological change in adolescent sleep timing is a consistent feature across societies worldwide, not a product of modern lifestyle.', answer: 'YES', evidence: 'it is observed in adolescents across different cultures, geographic locations and levels of technology exposure' },
    { prompt: 'Several of the 34 minutes of additional sleep gained by Seattle students after the policy change were attributed to students going to bed earlier.', answer: 'NOT GIVEN', evidence: 'students gained an average of 34 minutes of additional sleep per night following the change' },
    { prompt: 'The American Academy of Pediatrics recommends that schools should begin no later than 7.30am.', answer: 'NO', evidence: 'middle and high schools should not start before 8.30am' },
    { prompt: 'The writer believes that the primary barrier to changing school start times is the reluctance of education systems to reorganise around students\' needs rather than adults\' convenience.', answer: 'YES', evidence: 'The harder challenge may be persuading institutions designed around the needs of adults to reorganise themselves around the biology of the young people they exist to serve' }
  ])
}

// ─── Stage 15 ───────────────────────────────────────────────────────────────

const stage15P1: IntensivePassageLayout = {
  title: 'Learning as a game: the promise and limits of gamification in education',
  paragraphs: [
    ['A', 'The idea that learning should be engaging rather than merely instructive has shaped educational thinking for over a century. What has changed in the past two decades is the emergence of a technology-driven movement that makes this idea operational: gamification — the application of game design elements such as points, levels, badges, leaderboards and real-time feedback to non-game contexts. In education, gamification has been embraced by platforms ranging from Duolingo, which teaches languages through short game-like exercises rewarded with streaks and virtual currency, to Kahoot, which turns classroom quizzes into competitive real-time events. These platforms have attracted hundreds of millions of users, and their commercial success has encouraged schools and universities to explore gamification as a strategy for improving student motivation and outcomes.'],
    ['B', 'The theoretical justification for gamification in education draws heavily on self-determination theory, developed by psychologists Edward Deci and Richard Ryan, which identifies autonomy, competence and relatedness as the three core drivers of intrinsic motivation. Well-designed games, proponents argue, satisfy all three: they give players meaningful choices, provide constant feedback that creates a sense of growing competence, and connect players to communities of shared activity. Professor Jane McGonigal of the Institute for the Future, who has written extensively on the educational and social potential of games, argues that \'games are the only environments in which the vast majority of people voluntarily choose to work as hard as they possibly can at tasks they find challenging.\' If that engagement can be directed at academic content, the implications for learning are significant.'],
    ['C', 'Research findings on the effectiveness of gamification in education are mixed but generally positive in the short term. Studies of gamified classroom tools have consistently found that students report higher levels of motivation and engagement during gamified lessons than during conventional instruction. A review of the literature conducted by researchers at Florida State University found that gamification produced measurable improvements in student engagement in the majority of studies examined, particularly in the early weeks of implementation. However, the same review noted a marked tendency for the engagement effect to diminish over time as the novelty of the game elements wore off — a finding that has since been replicated in several independent studies.'],
    ['D', 'The most persistent criticism of gamification concerns the nature of the motivation it creates. Professor Mark Griffiths of Nottingham Trent University, one of the most prolific researchers in the psychology of gaming, has argued that gamification tends to generate extrinsic motivation — the desire to earn points, badges and leaderboard positions — rather than intrinsic motivation, which is genuine curiosity about and interest in the subject matter. Decades of research on motivation suggest that extrinsic rewards can actually suppress intrinsic motivation when the reward is removed, a phenomenon known as the overjustification effect. Students who learn to read in order to earn badges may stop reading the moment the badges disappear, while those who read out of genuine interest continue regardless.'],
    ['E', 'Implementation presents a further set of challenges. Designing gamification that genuinely supports learning rather than merely rewarding superficial performance requires a level of pedagogical sophistication and game design expertise that most classroom teachers do not possess. Professor Mina Johnson-Glenberg of Arizona State University, who researches immersive learning environments, has noted that the most educationally effective forms of gamification are those in which the game mechanics are deeply integrated with the learning content — not simply layered on top of it as a reward structure. Such integration requires substantial design investment that goes far beyond adding points to a conventional lesson plan.'],
    ['F', 'Proponents of gamification in education concede some of these criticisms but argue that they reflect poor implementation rather than a fundamental flaw in the concept. McGonigal and others contend that when gamification is designed thoughtfully, with the game mechanics aligned to learning objectives rather than treated as separate incentives, it can function as a gateway to deeper engagement with content rather than a substitute for it. They also argue that the engagement advantages of gamification, even if short-lived, can be pedagogically valuable if used strategically to introduce students to topics or skills they would otherwise resist.'],
    ['G', 'The gamification debate reflects a deeper tension in educational psychology between the desire to make learning enjoyable and the recognition that effective learning often requires sustained effort in the face of difficulty — a quality that may be undermined rather than supported by the frictionless reward structures of many commercial gamification platforms. Most researchers agree that the motivational benefits of well-designed gamification are real, but that the challenge of designing it well, and sustaining its effects over time, is considerably harder than its commercial popularity might suggest.']
  ],
  mcq: mcqBlock('Choose the correct letter, A, B, C or D.', [
    mcq('What does the writer say about Duolingo and Kahoot in the first paragraph?', [
      'They were among the first platforms to demonstrate that gamification could improve exam scores.',
      'Their commercial success has encouraged educational institutions to explore the approach further.',
      'They were designed specifically to address the problem of student disengagement in classrooms.',
      'Their user numbers suggest that gamification is now the dominant model in global education.'
    ], 'B', 'their commercial success has encouraged schools and universities to explore gamification'),
    mcq('What does Professor Griffiths argue about the type of motivation created by gamification?', [
      'It produces lasting benefits for students who use gamified platforms over a long period.',
      'It can create a dependence on rewards that reduces engagement when those rewards are removed.',
      'It is essentially the same as the motivation created by well-designed conventional teaching.',
      'It is most effective when used with students who already have strong intrinsic motivation.'
    ], 'B', 'extrinsic rewards can actually suppress intrinsic motivation when the reward is removed'),
    mcq('What does the writer suggest in the final paragraph about gamification\'s commercial popularity?', [
      'It has been driven by exaggerated claims made by platform developers.',
      'It has outpaced the educational community\'s ability to evaluate its effects.',
      'It may have created a misleading impression of how easily its benefits can be achieved.',
      'It reflects genuine evidence of improved academic outcomes across a wide range of subjects.'
    ], 'C', 'considerably harder than its commercial popularity might suggest')
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Professor Jane McGonigal',
    'B — Professor Mark Griffiths',
    'C — Professor Mina Johnson-Glenberg',
    'D — Florida State University researchers'
  ], [
    { prompt: 'Games are unique in motivating people to work hard voluntarily at demanding tasks.', answer: 'A', evidence: 'games are the only environments in which the vast majority of people voluntarily choose to work as hard as they possibly can' },
    { prompt: 'Gamification most effectively supports learning when game elements are embedded in content rather than added as a reward layer.', answer: 'C', evidence: 'the game mechanics are deeply integrated with the learning content — not simply layered on top of it as a reward structure' },
    { prompt: 'The engagement benefits of gamification tend to weaken as the initial novelty diminishes.', answer: 'D', evidence: 'the engagement effect to diminish over time as the novelty of the game elements wore off' },
    { prompt: 'Gamification risks reducing students\' genuine curiosity by replacing it with the desire to earn rewards.', answer: 'B', evidence: 'gamification tends to generate extrinsic motivation — the desire to earn points, badges and leaderboard positions — rather than intrinsic motivation, which is genuine curiosity about and interest in the subject matter' },
    { prompt: 'When designed carefully, gamification can draw students towards deeper content engagement rather than away from it.', answer: 'A', evidence: 'it can function as a gateway to deeper engagement with content rather than a substitute for it' },
    { prompt: 'Most studies of gamified classroom tools found short-term improvements in student engagement.', answer: 'D', evidence: 'gamification produced measurable improvements in student engagement in the majority of studies examined' }
  ]),
  ynng: ynng('Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.', [
    { prompt: 'Both Duolingo and Kahoot have attracted more users than any other educational technology platform in history.', answer: 'NOT GIVEN', evidence: 'These platforms have attracted hundreds of millions of users' },
    { prompt: 'Research consistently found that students showed higher levels of motivation during gamified lessons than during conventional teaching.', answer: 'YES', evidence: 'students report higher levels of motivation and engagement during gamified lessons than during conventional instruction' },
    { prompt: 'Professor Griffiths argues that gamification successfully develops students\' genuine interest in the subjects they study.', answer: 'NO', evidence: 'gamification tends to generate extrinsic motivation — the desire to earn points, badges and leaderboard positions — rather than intrinsic motivation, which is genuine curiosity about and interest in the subject matter' },
    { prompt: 'The writer concludes that gamification can produce real motivational benefits when it is designed with sufficient care.', answer: 'YES', evidence: 'the motivational benefits of well-designed gamification are real' }
  ])
}

const stage15P2: IntensivePassageLayout = {
  title: 'The gig economy: freedom or exploitation?',
  paragraphs: [
    ['A', 'The term \'gig economy\' entered mainstream vocabulary in the years following the 2008 financial crisis, as smartphone technology and platform-based business models made it possible to connect workers with customers on demand and at scale. Companies such as Uber, Deliveroo, TaskRabbit and Upwork positioned themselves not as employers but as technology platforms matching independent service providers with those who needed their skills. The companies operating in this space prefer to classify their workers as independent contractors rather than employees, a categorisation that exempts them from the legal obligation to provide benefits such as sick pay, paid holiday entitlement and pension contributions. Proponents of this model describe it as a democratisation of work that gives individuals the power to set their own hours and pursue multiple income streams simultaneously.'],
    ['B', 'The case made by gig economy companies for the flexibility of their model is not entirely without foundation. Research has consistently found that a significant proportion of gig workers — particularly those using platforms as a secondary income source alongside other employment — value the ability to choose when and how much they work. For some groups, including parents of young children, students, retired workers seeking supplementary income and people managing chronic health conditions, the absence of fixed working hours represents a genuine advantage that conventional employment cannot easily replicate. Professor Diane Mulcahy of Babson College, whose research has examined the motivations of gig workers across multiple platforms, has argued that the flexibility narrative is real for a meaningful minority of platform workers, and that policy responses should be careful not to eliminate arrangements that genuinely serve their interests.'],
    ['C', 'The picture looks considerably less comfortable, however, when the full working lives of gig workers are examined rather than their stated preferences. Workers interviewed in depth by Dr Alex Rosenblat of the Data & Society Research Institute, who has spent years studying the experience of platform workers — particularly Uber drivers — report that despite the promise of flexibility, many feel compelled to work long hours to cover unpredictable income fluctuations, leaving them with less genuine control over their time than a conventional employee. Rosenblat\'s research has also documented the ways in which algorithmic management — the use of automated systems to assign work, set prices and monitor performance — creates a form of control that is in some respects more pervasive than that exercised by a conventional manager, precisely because it is constant, invisible and not subject to appeal.'],
    ['D', 'The economic realities of gig work have been examined in detail by several independent research bodies. A study by the New Economics Foundation found that when the costs of self-employment — vehicle maintenance, fuel, insurance, platform fees and unpaid waiting time — are deducted from gross earnings, a large proportion of gig workers earn below the national minimum wage. Professor Vili Lehdonvirta of the Oxford Internet Institute, who has studied the global platform economy over more than a decade, has noted that income inequality among gig workers is extreme: a small number of highly skilled workers on high-value platforms command excellent rates, while the majority of workers on lower-skilled platforms earn substantially less than equivalent workers in conventional employment.'],
    ['E', 'The legal status of gig workers has been contested in courts and legislatures in several countries. In 2021, the UK Supreme Court ruled that Uber drivers were workers rather than independent contractors under UK employment law, entitling them to minimum wage protections and holiday pay. Spain passed legislation in 2021 requiring companies to employ delivery riders directly rather than through contractor arrangements. In California, voters backed Proposition 22 in 2020, which exempted app-based companies from a state law requiring them to classify drivers as employees — a result widely interpreted as a significant victory for the platform companies and a defeat for labour advocates.'],
    ['F', 'Gig economy companies have responded to regulatory pressure by arguing that reclassification as employers would increase costs that would ultimately be passed on to consumers through higher prices, reduce the flexibility that workers value and threaten the viability of the platform model itself. They have also invested heavily in lobbying and public communications campaigns aimed at persuading legislators that the gig economy is a net benefit to workers and the broader economy. Professor Lehdonvirta has argued that these claims deserve scrutiny: \'The platforms benefit enormously from the current legal ambiguity. They have every financial incentive to resist reclassification, and their arguments about worker preferences should be assessed in that context.\''],
    ['G', 'The gig economy debate ultimately concerns a question that labour markets have always struggled with: how to balance the flexibility that some workers and employers genuinely value against the security and dignity that most workers need. The evidence suggests that the current model, as operated by the largest platform companies, has concentrated its benefits among a minority of workers and its costs among a majority, while generating substantial profits for the platforms themselves. Whether regulation can rebalance that distribution without destroying the genuine innovations that platform technology has brought to labour markets remains the central unanswered question.']
  ],
  mcq: mcqBlock('Choose the correct letter, A, B, C or D.', [
    mcq('What does the writer say about the way gig economy companies classify their workers in the first paragraph?', [
      'It is a classification required by tax law in most countries where they operate.',
      'It allows them to avoid legal obligations to provide standard employment benefits.',
      'It was introduced in response to pressure from workers who preferred independence.',
      'It varies between countries depending on local labour market regulations.'
    ], 'B', 'a categorisation that exempts them from the legal obligation to provide benefits such as sick pay, paid holiday entitlement and pension contributions'),
    mcq('According to paragraph three, what did Dr Rosenblat\'s research find about algorithmic management?', [
      'It gives workers more control over their schedules than conventional employment allows.',
      'It exercises a form of control that is in some ways more pervasive than that of a human manager.',
      'It is resented by gig workers primarily because it reduces their earning potential.',
      'It has been shown to improve efficiency and customer satisfaction on delivery platforms.'
    ], 'B', 'creates a form of control that is in some respects more pervasive than that exercised by a conventional manager'),
    mcq('What does Professor Lehdonvirta suggest about the arguments made by platform companies against reclassification?', [
      'They are largely accurate and supported by independent economic evidence.',
      'They reflect a genuine concern about the impact on workers who value flexibility.',
      'They should be evaluated critically in light of the financial interests the companies have in the outcome.',
      'They have been largely accepted by regulators in the countries where platforms operate.'
    ], 'C', 'their arguments about worker preferences should be assessed in that context')
  ]),
  matchingPeople: people('Match each statement with the correct person, A–D.', [
    'A — Professor Diane Mulcahy',
    'B — Dr Alex Rosenblat',
    'C — New Economics Foundation',
    'D — Professor Vili Lehdonvirta'
  ], [
    { prompt: 'For a significant minority of platform workers, flexibility is a genuine and valued benefit.', answer: 'A', evidence: 'the flexibility narrative is real for a meaningful minority of platform workers' },
    { prompt: 'Algorithmic systems create a form of worker monitoring that is constant and cannot be challenged.', answer: 'B', evidence: 'constant, invisible and not subject to appeal' },
    { prompt: 'When expenses are deducted, many gig workers earn less than the legal minimum wage.', answer: 'C', evidence: 'a large proportion of gig workers earn below the national minimum wage' },
    { prompt: 'Income differences among gig workers are extreme, with a small number earning well and the majority earning poorly.', answer: 'D', evidence: 'income inequality among gig workers is extreme' },
    { prompt: 'The financial interests of platform companies mean their claims about worker preferences require careful scrutiny.', answer: 'D', evidence: 'They have every financial incentive to resist reclassification' },
    { prompt: 'Some groups — including students and parents — genuinely benefit from the absence of fixed working hours.', answer: 'A', evidence: 'For some groups, including parents of young children, students, retired workers seeking supplementary income and people managing chronic health conditions, the absence of fixed working hours represents a genuine advantage' }
  ]),
  ynng: ynng('Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.', [
    { prompt: 'Gig economy companies classify their workers as independent contractors rather than employees in order to avoid providing standard employment benefits.', answer: 'YES', evidence: 'a categorisation that exempts them from the legal obligation to provide benefits' },
    { prompt: 'The majority of gig workers surveyed by Dr Rosenblat stated that they would prefer conventional employment if they could find it.', answer: 'NOT GIVEN', evidence: 'many feel compelled to work long hours to cover unpredictable income fluctuations' },
    { prompt: 'The UK Supreme Court ruling of 2021 determined that Uber drivers were entitled to be paid at the minimum wage rate and receive paid holiday.', answer: 'YES', evidence: 'entitling them to minimum wage protections and holiday pay' },
    { prompt: 'The writer concludes that platform technology has produced no genuine benefits for labour markets.', answer: 'NO', evidence: 'without destroying the genuine innovations that platform technology has brought to labour markets' }
  ])
}

export const STAGES_12_TO_15: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  12: [stage12P1, stage12P2],
  13: [stage13P1, stage13P2],
  14: [stage14P1, stage14P2],
  15: [stage15P1, stage15P2]
}
