/**
 * Normal Reading Journey ด่าน 11 — Cambridge-style mixed format.
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

const stage11Passage1: IntensivePassageLayout = {
  title: 'Dark Matter and the Invisible Universe',
  sectionOrder: [...P1_ORDER],
  paragraphs: [
    ['A', 'The universe visible to human instruments — every star, galaxy, planet, and cloud of gas — accounts for only about 5% of the total mass and energy that physicists calculate must exist. The remaining 95% consists of two poorly understood quantities: dark energy, which appears to drive the accelerating expansion of the universe, and dark matter, which exerts gravitational effects on visible matter without emitting, absorbing, or reflecting any form of light or radiation. Dark matter cannot be seen, detected by any current instrument, or produced in any laboratory, yet its existence is inferred from its gravitational influence on the structures and motions of galaxies across the observable universe.'],
    ['B', 'The first serious scientific evidence for dark matter was assembled in the 1930s by Swiss astronomer Fritz Zwicky, who measured the velocities of galaxies within the Coma cluster and found that the visible mass of the cluster was far too small to prevent the galaxies from flying apart under their own speeds. He concluded that a large quantity of unseen mass must be providing the additional gravitational binding required. His calculations were largely ignored for several decades, partly because Zwicky was known within the astronomical community as a difficult and combative personality, and his proposal seemed too radical to take seriously without further evidence.'],
    ['C', 'That evidence arrived in the 1970s through the work of American astronomer Vera Rubin, who measured the rotation curves of spiral galaxies — graphs showing how the orbital speed of stars changes with increasing distance from the galactic centre. In a normal gravitational system, like planets orbiting the Sun, objects at greater distances should orbit more slowly, as the gravitational pull weakens with distance. Instead, Rubin found that the rotation speeds of stars in the outer regions of galaxies remained roughly constant regardless of distance from the centre, implying the presence of a large, diffuse halo of invisible mass extending far beyond the visible disc of each galaxy. Her findings were initially resisted by many astronomers but eventually became one of the strongest pieces of evidence for dark matter.'],
    ['D', 'Cosmological observations have since reinforced the dark matter hypothesis from multiple independent directions. The pattern of temperature fluctuations in the cosmic microwave background — the faint radiation left over from the Big Bang — matches theoretical models only if dark matter is included. The way in which light from distant galaxies is bent by the gravity of intervening matter, a phenomenon called gravitational lensing, reveals mass concentrations that far exceed what is visible. The large-scale structure of the universe — the web of filaments, voids, and galaxy clusters that defines its overall architecture — would not have formed in its observed form without the gravitational scaffolding provided by dark matter during the early universe.'],
    ['E', 'Despite overwhelming evidence for dark matter\'s existence, its identity remains completely unknown. The leading theoretical candidate is a class of hypothetical particles called Weakly Interacting Massive Particles, or WIMPs, which would interact with ordinary matter only through gravity and the weak nuclear force, making them extraordinarily difficult to detect. Experiments deep underground — shielded from cosmic ray interference — have searched for the rare collisions that WIMPs should occasionally make with atomic nuclei, so far without confirmed detection. The Large Hadron Collider at CERN has also searched for WIMP production without success, and several scientists have begun arguing that the WIMP hypothesis may need to be abandoned in favour of alternative candidates such as axions or primordial black holes.'],
    ['F', 'A minority of physicists argues that dark matter does not exist and that the anomalous gravitational observations can be explained by modifying the laws of gravity themselves. Modified Newtonian Dynamics, or MOND, proposed by Israeli physicist Mordehai Milgrom in 1983, postulates that gravity behaves differently at very low accelerations than standard Newtonian physics predicts. MOND successfully reproduces the flat rotation curves that Rubin observed without invoking any invisible mass. However, MOND struggles to explain the cosmic microwave background data, the large-scale structure of the universe, and — most critically — the Bullet Cluster, a collision of two galaxy clusters in which the visible matter and the gravitational mass are spatially separated, exactly as dark matter theory would predict but which MOND cannot easily account for.'],
    ['G', 'The search for dark matter has become one of the defining scientific projects of the early twenty-first century. Billions of dollars have been invested in underground detectors, space telescopes, and particle colliders pursuing its identification. Some researchers have warned that the field risks becoming trapped in a cycle of increasingly sensitive experiments that find nothing, while theoretical alternatives languish for lack of funding. Whether dark matter will eventually be directly detected, or whether its gravitational signature will ultimately require a revision of fundamental physics, remains the most consequential open question in modern cosmology.']
  ],
  tfng: tfng([
    q('Visible matter — stars, galaxies, and gas clouds — makes up less than a tenth of all mass and energy in the universe.', 'TRUE', 'every star, galaxy, planet, and cloud of gas — accounts for only about 5% of the total mass and energy that physicists calculate must exist'),
    q('Fritz Zwicky\'s conclusions about invisible mass in the Coma cluster were widely accepted by the astronomical community when they were first published.', 'FALSE', 'His calculations were largely ignored for several decades'),
    q('Vera Rubin conducted her rotation curve research at the same institution where Fritz Zwicky had worked.', 'NOT GIVEN', 'Swiss astronomer Fritz Zwicky / American astronomer Vera Rubin'),
    q('According to dark matter theory, the universe\'s large-scale web of filaments and clusters would not have developed as observed without invisible mass providing gravitational structure in its early stages.', 'TRUE', 'would not have formed in its observed form without the gravitational scaffolding provided by dark matter during the early universe'),
    q('Experiments searching for WIMP collisions with atomic nuclei have so far produced confirmed evidence of dark matter particles.', 'FALSE', 'have searched for the rare collisions that WIMPs should occasionally make with atomic nuclei, so far without confirmed detection'),
    q('Mordehai Milgrom\'s modified gravity theory successfully accounts for the observed behaviour of light bending around galaxy clusters.', 'NOT GIVEN', 'MOND struggles to explain the cosmic microwave background data, the large-scale structure of the universe, and — most critically — the Bullet Cluster'),
    q('Some scientists have expressed concern that the field of dark matter research may be pursuing increasingly sophisticated experiments without producing results.', 'TRUE', 'Some researchers have warned that the field risks becoming trapped in a cycle of increasingly sensitive experiments that find nothing')
  ]),
  fill: fillBlock('Evidence and theories of dark matter', [
    q('The universe contains far more mass than telescopes can detect, with the unseen portion called dark ……… inferred only through its effects on nearby objects.', 'matter', 'dark matter, which exerts gravitational effects on visible matter'),
    q('The first evidence came from Zwicky\'s study of a galaxy ……… , in which he found that visible mass alone could not hold the group together.', 'cluster', 'galaxies within the Coma cluster'),
    q('Later research measured the rotation ……… of spiral galaxies and found that outer stars moved unexpectedly fast.', 'curves', 'the rotation curves of spiral galaxies'),
    q('An additional line of evidence comes from the way ……… bends light around massive objects, revealing hidden mass concentrations.', 'gravity', 'light from distant galaxies is bent by the gravity of intervening matter'),
    q('The leading candidate for dark matter consists of a type of invisible ……… that almost never interact with ordinary matter.', 'particles', 'a class of hypothetical particles called Weakly Interacting Massive Particles'),
    q('An alternative theory proposes that standard ……… behaves differently at very low accelerations, removing the need for invisible mass.', 'physics', 'than standard Newtonian physics predicts'),
    q('A key obstacle for this alternative is its inability to explain the Bullet ……… , where visible and gravitational mass appear in different locations.', 'Cluster', 'the Bullet Cluster, a collision of two galaxy clusters', { acceptedAnswers: ['cluster'] })
  ])
}

const wrightHeadings = [
  'A famous rival\'s failure that cleared the field',
  'A long life shadowed by the mixed legacy of an invention',
  'Practical skills from a trade that shaped a scientific breakthrough',
  'A landmark moment witnessed by almost nobody',
  'A dispute over ownership that damaged an entire industry',
  'A self-taught insight about how living creatures manage movement',
  'Secrecy and scepticism delay recognition of a genuine achievement',
  'A race between a government-backed project and two amateurs',
  'The commercial and mechanical foundations of a famous discovery',
  'Public failure discredits a better-funded competitor'
]

const stage11Passage2: IntensivePassageLayout = {
  title: 'The Wright Brothers and the Invention of Flight',
  sectionOrder: [...P2_ORDER],
  paragraphs: [
    ['A', 'Orville and Wilbur Wright grew up in Dayton, Ohio, the sons of a bishop in the Church of the United Brethren in Christ. Neither attended university: Wilbur, the elder by four years, had been expected to go to Yale, but a hockey injury left him physically and psychologically incapacitated for several years, during which time he read voraciously in his father\'s library. Orville dropped out of high school to start a printing business, and the two brothers later opened a bicycle sales and repair shop, which provided both the mechanical skills and the modest capital that would eventually fund their aeronautical experiments. The shop also gave them a practical insight that would prove decisive: the importance of three-axis control in managing a moving vehicle.'],
    ['B', 'By the late 1890s, the question of powered human flight had attracted the attention of several serious scientists and engineers, including Samuel Langley, secretary of the Smithsonian Institution and a man with substantially more resources and prestige than the Wright brothers. Langley had developed large steam-powered flying machines, called Aerodromes, and received significant funding from the US War Department for his efforts. The contrast between Langley\'s well-funded establishment approach and the self-financing, workshop-based method of the Wrights was striking. When Langley\'s full-scale Aerodrome failed twice in public and expensive fashion in late 1903, the press largely declared the dream of heavier-than-air flight dead.'],
    ['C', 'The Wright brothers had reached a different conclusion about why previous flying machines had failed. While others focused primarily on achieving adequate power, the Wrights believed that the central unsolved problem was control. They studied the soaring of birds — particularly buzzards — and observed that birds controlled their roll by twisting the tips of their wings. The brothers replicated this mechanism in their gliders through a system they called wing warping, in which cables could twist the trailing edges of the biplane wings to bank and turn the aircraft. After three summers of gliding experiments at Kitty Hawk, North Carolina, chosen for its consistent winds and soft sandy landing surfaces, they were confident they had solved the control problem.'],
    ['D', 'On 17 December 1903, at Kill Devil Hills near Kitty Hawk, Orville piloted the Wright Flyer on its first successful powered flight. The aircraft flew 120 feet in 12 seconds. Three further flights were made that day, the longest covering 852 feet in 59 seconds — piloted by Wilbur. The four witnesses beyond the brothers themselves were members of a local lifesaving station. No journalists were present. A telegram sent to their father that evening contained factual errors — the flight duration for the longest flight was incorrectly given as 57 seconds — but the essential message was clear: they had achieved controlled, sustained, powered flight in a heavier-than-air machine.'],
    ['E', 'Recognition was slow to arrive. The brothers were secretive about their technology, refusing to demonstrate their aircraft publicly or share detailed specifications until they had secured patent protection and a commercial contract. This reticence led many observers — including the editors of Scientific American — to dismiss their claims as exaggerated or fraudulent, labelling them \'Flyers or Liars\' in a 1906 editorial. Meanwhile, the Wrights continued to refine their design in a field near Dayton, achieving flights of over thirty minutes by 1905, unobserved by any credible witness willing to publicise them. It was not until a public demonstration in France in 1908 that the European scientific community accepted the reality of their achievement.'],
    ['F', 'The patent disputes that followed were bitter and prolonged. The Wrights held a broad patent on the fundamental principle of three-axis flight control and pursued infringement claims against virtually every aircraft manufacturer in the United States. Glenn Curtiss, their primary rival, was targeted with particular intensity. The litigation consumed enormous resources on both sides, retarded the development of the American aviation industry, and contributed to the United States falling behind European nations in aircraft development during the critical period preceding the First World War. The US government eventually forced a patent cross-licensing agreement during the war, but the conflict between the Wrights and their competitors had already caused significant damage.'],
    ['G', 'Wilbur Wright died of typhoid fever in 1912, aged forty-five, before the full implications of his achievement had been realised. Orville lived until 1948, long enough to see the jet age begin, to witness aviation used as a weapon of mass destruction in the Second World War, and to reflect publicly on the ambivalence he felt about the invention he and his brother had given the world. In one of his final interviews, he remarked that he had never expected powered flight to arrive within his lifetime, let alone to transform it so completely and with such mixed consequences. He donated the original Wright Flyer to the Smithsonian Institution — the same institution whose secretary had been his most prominent early rival.']
  ],
  headings: headingBlock(wrightHeadings, [
    q('Paragraph A', 'iii', 'The shop also gave them a practical insight that would prove decisive: the importance of three-axis control in managing a moving vehicle'),
    q('Paragraph B', 'x', 'When Langley\'s full-scale Aerodrome failed twice in public and expensive fashion in late 1903'),
    q('Paragraph C', 'vi', 'They studied the soaring of birds — particularly buzzards — and observed that birds controlled their roll by twisting the tips of their wings'),
    q('Paragraph D', 'iv', 'The four witnesses beyond the brothers themselves were members of a local lifesaving station. No journalists were present'),
    q('Paragraph E', 'vii', 'This reticence led many observers — including the editors of Scientific American — to dismiss their claims as exaggerated or fraudulent'),
    q('Paragraph F', 'v', 'The litigation consumed enormous resources on both sides, retarded the development of the American aviation industry'),
    q('Paragraph G', 'ii', 'Orville lived until 1948… to reflect publicly on the ambivalence he felt about the invention he and his brother had given the world')
  ]),
  tfng: tfngP2([
    q('Wilbur Wright\'s plan to attend university was prevented by a physical injury he sustained playing sport.', 'TRUE', 'Wilbur… had been expected to go to Yale, but a hockey injury left him physically and psychologically incapacitated'),
    q('The telegram sent to the Wright brothers\' father on the day of the first flight contained an error regarding the duration of one of the flights.', 'TRUE', 'A telegram sent to their father that evening contained factual errors — the flight duration for the longest flight was incorrectly given as 57 seconds'),
    q('Orville Wright expressed regret in later life about having invented powered flight.', 'NOT GIVEN', 'to reflect publicly on the ambivalence he felt about the invention he and his brother had given the world')
  ]),
  fill: fillBlock('The Wright brothers\' path to flight and its aftermath', [
    q('The Wright brothers\' success owed much to their insight that ……… of an aircraft in all directions was the central unsolved problem of flight.', 'control', 'the importance of three-axis control in managing a moving vehicle'),
    q('Despite achieving powered flight in 1903, many observers dismissed their ……… as exaggerated or dishonest, and recognition was delayed for several years.', 'claims', 'dismiss their claims as exaggerated or fraudulent'),
    q('Their later decision to pursue aggressive ……… protection for their flight system ultimately hindered the growth of the entire American aviation sector.', 'patent', 'until they had secured patent protection and a commercial contract')
  ])
}

export const INTENSIVE_LAYOUTS_STAGE_11: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  11: [stage11Passage1, stage11Passage2]
}
