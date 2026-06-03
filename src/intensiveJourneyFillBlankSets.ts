import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_10 } from './intensiveJourneyFillBlankStages6to10.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_11_15 } from './intensiveJourneyFillBlankStages11to15.ts'

/** Hand-crafted fill-blank UI for Quest Log ด่าน 1–10 (20 intensive passages). */
export const INTENSIVE_JOURNEY_FILL_BLANK_SETS: NewFillBlankSet[] = [
  // ── Stage 1 · Passage 1: Coffee ──────────────────────────────────────────
  {
    examId: 'journey-normal-stage-1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['A', 'D'],
    instructions: [
      'Questions 1–5',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'The Origins and Expansion of Coffee',
    summaryLines: [
      {
        type: 'para',
        text:
          'According to ancient oral traditions, a solitary Ethiopian herdsman named Kaldi first observed the energizing effects of a specific wild {1} when his flock began acting erratically after consuming its red berries. By the 15th century, Sufi monks in Yemeni monasteries had perfected the technique of roasting and boiling the seeds to create a potent dark monast {2}. However, following a papal endorsement in 1600, the drink rapidly permeated European culture, fundamentally altering the fabric of urban {3}.'
      },
      {
        type: 'bullet',
        text:
          'Because they charged a minimal entrance fee, they actively fostered open intellectual the {4} among patrons from diverse economic backgrounds.'
      },
      {
        type: 'bullet',
        text:
          'The widespread cultivation and export of the beans currently supports the fragile bea {5} of numerous developing nations across the equatorial belt.'
      },
      {
        type: 'bullet',
        text: 'Today, exporting the crop supports the fragile {5} of numerous equatorial nations.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'shrub',
        passageKeyword: 'specific wild shrub',
        questionKeyword: 'particular wild plant',
        thaiMeaning: 'พุ่มไม้ / ไม้พุ่ม',
        exactPortion:
          'According to ancient oral traditions, a solitary Ethiopian herdsman named Kaldi first observed the energizing effects of a specific wild shrub when his flock began acting erratically after consuming its red berries'
      },
      {
        number: 2,
        answer: 'liquid',
        passageKeyword: 'potent dark liquid',
        questionKeyword: 'strong dark drink',
        thaiMeaning: 'ของเหลว / เครื่องดื่ม',
        exactPortion:
          'By the 15th century, Sufi monks in Yemeni monasteries had perfected the technique of roasting and boiling the seeds to create a potent dark liquid'
      },
      {
        number: 3,
        answer: 'society',
        passageKeyword: 'fabric of urban society',
        questionKeyword: 'character of European urban life',
        thaiMeaning: 'สังคม',
        exactPortion:
          'However, following a papal endorsement in 1600, the drink rapidly permeated European culture, fundamentally altering the fabric of urban society'
      },
      {
        number: 4,
        answer: 'debate',
        passageKeyword: 'open intellectual debate',
        questionKeyword: 'open intellectual discussion',
        thaiMeaning: 'การถกเถียง / วาทกรรม',
        exactPortion:
          'Because they charged a minimal entrance fee, they actively fostered open intellectual debate among patrons from diverse economic backgrounds'
      },
      {
        number: 5,
        answer: 'economy',
        passageKeyword: 'fragile economy',
        questionKeyword: 'fragile financial system',
        thaiMeaning: 'เศรษฐกิจ',
        exactPortion:
          'The widespread cultivation and export of the beans currently supports the fragile economy of numerous developing nations across the equatorial belt'
      }
    ]
  },
  // ── Stage 1 · Passage 2: Colosseum ─────────────────────────────────────────
  {
    examId: 'journey-normal-stage-1',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 18,
    sourceParagraphs: ['A', 'D'],
    instructions: [
      'Questions 14–18',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–18 on your answer sheet.'
    ],
    summaryTitle: 'The Engineering of the Colosseum',
    summaryLines: [
      {
        type: 'para',
        text:
          'Constructed entirely from travertine stone and concrete, the massive amphitheater was commissioned by a prominent {14} to appease the restless citizens of the capital. To facilitate the rapid movement of enormous crowds, architects designed a sophisticated network of vaulted corridors and precisely angled cro {15}. This elaborate basement housed wild exotic animals and heavily armed anima {16} prior to their deadly public appearances.'
      },
      {
        type: 'bullet',
        text:
          'Operated by specialized sailors recruited from the imperial fleet, this gigantic suspended canopy provided cooling shade to the thousands of sweltering {17}.'
      },
      {
        type: 'bullet',
        text:
          'Ongoing pollution from city traffic poses a severe threat to the structural integrity of the ancient seve {18}.'
      },
      {
        type: 'bullet',
        text: 'Modern traffic pollution now threatens the stability of the ancient {18}.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'emperor',
        passageKeyword: 'prominent emperor',
        questionKeyword: 'leading ruler',
        thaiMeaning: 'จักรพรรดิ',
        exactPortion:
          'Constructed entirely from travertine stone and concrete, the massive amphitheater was commissioned by a prominent emperor to appease the restless citizens of the capital'
      },
      {
        number: 15,
        answer: 'staircases',
        passageKeyword: 'precisely angled staircases',
        questionKeyword: 'steeply angled steps',
        thaiMeaning: 'บันได',
        exactPortion:
          'To facilitate the rapid movement of enormous crowds, architects designed a sophisticated network of vaulted corridors and precisely angled staircases'
      },
      {
        number: 16,
        answer: 'gladiators',
        passageKeyword: 'heavily armed gladiators',
        questionKeyword: 'armed fighters',
        thaiMeaning: 'นักสู้กลาดิเอเตอร์',
        exactPortion:
          'This elaborate basement housed wild exotic animals and heavily armed gladiators prior to their deadly public appearances'
      },
      {
        number: 17,
        answer: 'spectators',
        passageKeyword: 'sweltering spectators',
        questionKeyword: 'overheated audience members',
        thaiMeaning: 'ผู้ชม',
        exactPortion:
          'Operated by specialized sailors recruited from the imperial fleet, this gigantic suspended canopy provided cooling shade to the thousands of sweltering spectators'
      },
      {
        number: 18,
        answer: 'ruins',
        passageKeyword: 'ancient ruins',
        questionKeyword: 'ancient remains',
        thaiMeaning: 'ซากปรักหักพัง / โบราณสถาน',
        exactPortion:
          'Ongoing pollution from city traffic poses a severe threat to the structural integrity of the ancient ruins'
      }
    ]
  },
  // ── Stage 2 · Passage 1: Sleep ───────────────────────────────────────────
  {
    examId: 'journey-normal-stage-2',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 1–5',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'The Science of Sleep Cycles',
    summaryLines: [
      {
        type: 'para',
        text:
          'However, the invention of the electroencephalogram (EEG) revealed that the sleeping human electroencephalogr {1} is actually a hub of intense neurological activity. Throughout a typical eight-hour period, an individual cycles through four distinct biological indiv {2} approximately every ninety minutes. This specific phase is critically responsible for the consolidation of short-term information into long-term {3}.'
      },
      {
        type: 'bullet',
        text:
          'As daylight fades, the optic nerves signal the pineal gland to release specific {4}, primarily melatonin, which chemically induce drowsiness.'
      },
      {
        type: 'bullet',
        text:
          'Prolonged disruption of the natural circadian rhythm is highly correlated with the development of severe metabolic {5}.'
      },
      {
        type: 'bullet',
        text: 'Long-term disruption of circadian rhythms is linked to serious metabolic {5}.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'brain',
        passageKeyword: 'sleeping human brain',
        questionKeyword: 'sleeping human mind',
        thaiMeaning: 'สมอง',
        exactPortion:
          'However, the invention of the electroencephalogram (EEG) revealed that the sleeping human brain is actually a hub of intense neurological activity'
      },
      {
        number: 2,
        answer: 'stages',
        passageKeyword: 'four distinct biological stages',
        questionKeyword: 'four distinct biological phases',
        thaiMeaning: 'ระยะ / ขั้นตอน',
        exactPortion:
          'Throughout a typical eight-hour period, an individual cycles through four distinct biological stages approximately every ninety minutes'
      },
      {
        number: 3,
        answer: 'memory',
        passageKeyword: 'long-term memory',
        questionKeyword: 'lasting recall',
        thaiMeaning: 'ความจำ',
        exactPortion:
          'This specific phase is critically responsible for the consolidation of short-term information into long-term memory'
      },
      {
        number: 4,
        answer: 'hormones',
        passageKeyword: 'specific hormones',
        questionKeyword: 'sleep-inducing chemicals',
        thaiMeaning: 'ฮอร์โมน',
        exactPortion:
          'As daylight fades, the optic nerves signal the pineal gland to release specific hormones, primarily melatonin, which chemically induce drowsiness'
      },
      {
        number: 5,
        answer: 'disorders',
        passageKeyword: 'severe metabolic disorders',
        questionKeyword: 'serious metabolic illnesses',
        thaiMeaning: 'โรค / ความผิดปกติทางเมตาบอลิซึม',
        exactPortion:
          'Prolonged disruption of the natural circadian rhythm is highly correlated with the development of severe metabolic disorders'
      }
    ]
  },
  // ── Stage 2 · Passage 2: Rosetta Stone ───────────────────────────────────
  {
    examId: 'journey-normal-stage-2',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 18,
    sourceParagraphs: ['A', 'E'],
    instructions: [
      'Questions 14–18',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–18 on your answer sheet.'
    ],
    summaryTitle: 'The Rosetta Stone Decipherment',
    summaryLines: [
      {
        type: 'para',
        text:
          'In 1799, during Napoleon\'s military campaign in Egypt, a group of French {14} accidentally unearthed a large block of granodiorite while reinforcing a ruined fort. The top section featured classical Egyptian hieroglyphs, the middle utilized a cursive everyday script called Demotic, and the bottom was a royal hier {15} written in ancient Greek. He deduced that the phonetic oval enclosures, known as cartouches, consistently spelled out the names of foreign {16}.'
      },
      {
        type: 'bullet',
        text:
          'By rigorously comparing the sounds to the carved symbols, this dedicated {17} published the first comprehensive translation in 1822.'
      },
      {
        type: 'bullet',
        text:
          'The ability to read original texts allowed modern researchers to understand the religion, poetry, and daily life of the ancient moder {18} directly from their own primary sources.'
      },
      {
        type: 'bullet',
        text: 'Reading original texts let researchers study daily life in the ancient {18} directly.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'soldiers',
        passageKeyword: 'French soldiers',
        questionKeyword: 'French troops',
        thaiMeaning: 'ทหาร',
        exactPortion:
          'In 1799, during Napoleon\'s military campaign in Egypt, a group of French soldiers accidentally unearthed a large block of granodiorite while reinforcing a ruined fort'
      },
      {
        number: 15,
        answer: 'decree',
        passageKeyword: 'royal decree',
        questionKeyword: 'official royal order',
        thaiMeaning: 'พระราชกฤษฎีกา / ประกาศ',
        exactPortion:
          'The top section featured classical Egyptian hieroglyphs, the middle utilized a cursive everyday script called Demotic, and the bottom was a royal decree written in ancient Greek'
      },
      {
        number: 16,
        answer: 'leaders',
        passageKeyword: 'names of foreign leaders',
        questionKeyword: 'names of foreign rulers',
        thaiMeaning: 'ผู้นำ / ผู้ปกครอง',
        exactPortion:
          'He deduced that the phonetic oval enclosures, known as cartouches, consistently spelled out the names of foreign leaders'
      },
      {
        number: 17,
        answer: 'scholar',
        passageKeyword: 'dedicated scholar',
        questionKeyword: 'learned researcher',
        thaiMeaning: 'นักวิชาการ',
        exactPortion:
          'By rigorously comparing the sounds to the carved symbols, this dedicated scholar published the first comprehensive translation in 1822'
      },
      {
        number: 18,
        answer: 'civilization',
        passageKeyword: 'ancient civilization',
        questionKeyword: 'ancient society',
        thaiMeaning: 'อารยธรรม',
        exactPortion:
          'The ability to read original texts allowed modern researchers to understand the religion, poetry, and daily life of the ancient civilization directly from their own primary sources'
      }
    ]
  },
  // ── Stage 3 · Passage 1: Deep Sea ─────────────────────────────────────────
  {
    examId: 'journey-normal-stage-3',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 1–5',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'Deep Sea Exploration Technologies',
    summaryLines: [
      {
        type: 'para',
        text:
          'Crushing water force {1} once made standard diving gear useless in the deepest ocean trenches. Spherical titanium hulls allowed manned {2} to reach the floor of the Mariana Trench.'
      },
      {
        type: 'bullet',
        text: 'Scientists found active biological {3} clusters around vents that did not depend on sunlight.'
      },
      {
        type: 'bullet',
        text: 'Tethered ROVs can collect delicate seabed {4} without risking human lives.'
      },
      {
        type: 'bullet',
        text: 'Slow-growing deep species highlight the need for strict international {5} protection agreements.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'pressure',
        passageKeyword: 'crushing hydrostatic pressure',
        questionKeyword: 'crushing water force',
        thaiMeaning: 'ความดัน',
        exactPortion:
          'For decades, scientists were physically barred from entering the abyssal zones because the crushing hydrostatic pressure would instantly implode any standard diving equipment'
      },
      {
        number: 2,
        answer: 'submarines',
        passageKeyword: 'deep-sea submarines',
        questionKeyword: 'manned undersea craft',
        thaiMeaning: 'เรือดำน้ำ',
        exactPortion:
          'By encasing pilots inside a thick titanium ball, specially designed deep-sea submarines could successfully dive to the bottom of the Mariana Trench'
      },
      {
        number: 3,
        answer: 'ecosystems',
        passageKeyword: 'thriving ecosystems',
        questionKeyword: 'living communities',
        thaiMeaning: 'ระบบนิเวศ',
        exactPortion:
          'However, researchers discovered thriving ecosystems clustered around scalding hydrothermal vents, completely detached from the sun\'s influence'
      },
      {
        number: 4,
        answer: 'samples',
        passageKeyword: 'fragile physical samples',
        questionKeyword: 'delicate seabed specimens',
        thaiMeaning: 'ตัวอย่าง / สิ่งตัวอย่าง',
        exactPortion:
          'These nimble robotic drones can remain submerged indefinitely, capturing high-definition video and collecting fragile physical samples without putting human lives at risk'
      },
      {
        number: 5,
        answer: 'conservation',
        passageKeyword: 'international conservation treaties',
        questionKeyword: 'international protection agreements',
        thaiMeaning: 'การอนุรักษ์',
        exactPortion:
          'Because deep ocean organisms grow and reproduce incredibly slowly, industrial disturbances could permanently destroy habitats, highlighting the urgent need for strict international conservation treaties'
      }
    ]
  },
  // ── Stage 3 · Passage 2: Monarch Butterfly ────────────────────────────────
  {
    examId: 'journey-normal-stage-3',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 18,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 14–18',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–18 on your answer sheet.'
    ],
    summaryTitle: 'The Migration of the Monarch Butterfly',
    summaryLines: [
      {
        type: 'para',
        text:
          'Every autumn, millions of these fragile, orange-and-black insects embark on an epic, three-thousand-mile {14} from the cooling forests of Canada to the remote volcanic mountains of central Mexico. Because a typical adult butterfly only lives for a few weeks, it actually takes four successive {15} of monarchs to complete a single, full round-trip circuit. Female butterflies will exclusively lay their eggs on the leaves of the toxic {16} plant.'
      },
      {
        type: 'bullet',
        text:
          'Avian {17} quickly learn that eating the bright insects causes severe nausea, leading them to actively avoid hunting the butterflies in the future.'
      },
      {
        type: 'bullet',
        text:
          'Citizens across North America are actively planting native vegetation in urban gardens to combat the loss of agricultural habitat and shifting plant {18} conditions.'
      },
      {
        type: 'bullet',
        text: 'Urban gardens are being planted to offset habitat loss linked to shifting {18} conditions.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'journey',
        passageKeyword: 'three-thousand-mile journey',
        questionKeyword: 'vast migration',
        thaiMeaning: 'การเดินทาง / การอพยพ',
        exactPortion:
          'Every autumn, millions of these fragile, orange-and-black insects embark on an epic, three-thousand-mile journey from the cooling forests of Canada to the remote volcanic mountains of central Mexico'
      },
      {
        number: 15,
        answer: 'generations',
        passageKeyword: 'four successive generations',
        questionKeyword: 'four separate generations',
        thaiMeaning: 'รุ่น / ชั่วคน',
        exactPortion:
          'Because a typical adult butterfly only lives for a few weeks, it actually takes four successive generations of monarchs to complete a single, full round-trip circuit'
      },
      {
        number: 16,
        answer: 'milkweed',
        passageKeyword: 'toxic milkweed plant',
        questionKeyword: 'toxic milkweed',
        thaiMeaning: 'ต้นมิลค์วีด',
        exactPortion:
          'Female butterflies will exclusively lay their eggs on the leaves of the toxic milkweed plant, as the caterpillars have evolved to safely ingest and store the plant\'s harmful chemical compounds'
      },
      {
        number: 17,
        answer: 'predators',
        passageKeyword: 'Avian predators',
        questionKeyword: 'bird hunters',
        thaiMeaning: 'ผู้ล่า / นกนักล่า',
        exactPortion:
          'Avian predators quickly learn that eating the bright insects causes severe nausea, leading them to actively avoid hunting the butterflies in the future'
      },
      {
        number: 18,
        answer: 'climate',
        passageKeyword: 'shifting climate conditions',
        questionKeyword: 'changing weather patterns',
        thaiMeaning: 'ภูมิอากาศ',
        exactPortion:
          'Citizens across North America are actively planting native vegetation in urban gardens to combat the loss of agricultural habitat and shifting climate conditions'
      }
    ]
  },
  // ── Stage 4 · Passage 1: Photography ─────────────────────────────────────
  {
    examId: 'journey-normal-stage-4',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 1–5',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'The Invention of Photography',
    summaryLines: [
      {
        type: 'para',
        text:
          'The desire to automate this process culminated in the early 19th century with the invention of the {1} obscura, a simple dark box that projected an inverted image through a pinhole. By coating a pewter plate with bitumen—a light-sensitive asphalt—and exposing it to the sun for eight hours, he recorded a blurry view from his laboratory window, utilizing raw light-s {2} to fix the transient light. This new method, known as the daguerreotype, slashed exposure times from hours to mere minutes, suddenly making incredibly detailed, lifelike sla {3} practically available to the burgeoning middle class.'
      },
      {
        type: 'bullet',
        text:
          'Talbot created a translucent paper negative from which an infinite number of positive prints could be made, heavily influencing the future trajectory of mass media and early photo {4}.'
      },
      {
        type: 'bullet',
        text:
          'By simplifying the complex darkroom chemistry into a portable cartridge, the Kodak company initiated a new visual {5} where everyday citizens could instantly document their own lives.'
      },
      {
        type: 'bullet',
        text: 'Eastman\'s roll-film cartridge opened a new {5} of casual home photography.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'camera',
        passageKeyword: 'camera obscura',
        questionKeyword: 'camera device',
        thaiMeaning: 'กล้อง',
        exactPortion:
          'The desire to automate this process culminated in the early 19th century with the invention of the camera obscura, a simple dark box that projected an inverted image through a pinhole'
      },
      {
        number: 2,
        answer: 'chemicals',
        passageKeyword: 'raw chemicals',
        questionKeyword: 'light-sensitive substances',
        thaiMeaning: 'สารเคมี',
        exactPortion:
          'By coating a pewter plate with bitumen—a light-sensitive asphalt—and exposing it to the sun for eight hours, he recorded a blurry view from his laboratory window, utilizing raw chemicals to fix the transient light'
      },
      {
        number: 3,
        answer: 'portraits',
        passageKeyword: 'lifelike portraits',
        questionKeyword: 'personal portraits',
        thaiMeaning: 'ภาพเหมือน',
        exactPortion:
          'This new method, known as the daguerreotype, slashed exposure times from hours to mere minutes, suddenly making incredibly detailed, lifelike portraits practically available to the burgeoning middle class'
      },
      {
        number: 4,
        answer: 'journalism',
        passageKeyword: 'early photo journalism',
        questionKeyword: 'news photography',
        thaiMeaning: 'วารสารข่าว / สื่อข่าว',
        exactPortion:
          'Talbot created a translucent paper negative from which an infinite number of positive prints could be made, heavily influencing the future trajectory of mass media and early photo journalism'
      },
      {
        number: 5,
        answer: 'era',
        passageKeyword: 'new visual era',
        questionKeyword: 'new period',
        thaiMeaning: 'ยุค / สมัย',
        exactPortion:
          'By simplifying the complex darkroom chemistry into a portable cartridge, the Kodak company initiated a new visual era where everyday citizens could instantly document their own lives'
      }
    ]
  },
  // ── Stage 4 · Passage 2: Earthquakes ──────────────────────────────────────
  {
    examId: 'journey-normal-stage-4',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 18,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 14–18',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–18 on your answer sheet.'
    ],
    summaryTitle: 'The Science of Earthquakes',
    summaryLines: [
      {
        type: 'para',
        text:
          'Modern seismology, however, explains these terrifying events through plate tectonics, revealing that the Earth\'s solid outer terri {14} is actually fractured into massive, continuously shifting puzzle pieces. Despite being locked together, the subterranean forces keep pushing, causing massive {15} to build over centuries until the rock violently snaps, releasing stored energy outward. Secondary (S) violen {16} arrive shortly after, violently shifting the ground up and down, causing the majority of the severe structural damage observed during major quakes.'
      },
      {
        type: 'bullet',
        text:
          'This sudden aquatic displacement generates devastating tsunamis capable of obliterating coastal devas {17} hundreds of miles away from the initial epicenter.'
      },
      {
        type: 'bullet',
        text:
          'Currently, scientists have absolutely no reliable method for short-term reliabl {18} to warn citizens of an impending tremor.'
      },
      {
        type: 'bullet',
        text: 'Scientists still cannot make reliable short-term {18} of when a fault will break.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'crust',
        passageKeyword: 'solid outer crust',
        questionKeyword: 'rigid outer shell',
        thaiMeaning: 'เปลือกโลก',
        exactPortion:
          'Modern seismology, however, explains these terrifying events through plate tectonics, revealing that the Earth\'s solid outer crust is actually fractured into massive, continuously shifting puzzle pieces'
      },
      {
        number: 15,
        answer: 'friction',
        passageKeyword: 'massive friction',
        questionKeyword: 'built-up rubbing force',
        thaiMeaning: 'แรงเสียดทาน',
        exactPortion:
          'Despite being locked together, the subterranean forces keep pushing, causing massive friction to build over centuries until the rock violently snaps, releasing stored energy outward'
      },
      {
        number: 16,
        answer: 'waves',
        passageKeyword: 'Secondary (S) waves',
        questionKeyword: 'secondary seismic waves',
        thaiMeaning: 'คลื่น',
        exactPortion:
          'Secondary (S) waves arrive shortly after, violently shifting the ground up and down, causing the majority of the severe structural damage observed during major quakes'
      },
      {
        number: 17,
        answer: 'infrastructure',
        passageKeyword: 'coastal infrastructure',
        questionKeyword: 'coastal buildings and services',
        thaiMeaning: 'โครงสร้างพื้นฐาน',
        exactPortion:
          'This sudden aquatic displacement generates devastating tsunamis capable of obliterating coastal infrastructure hundreds of miles away from the initial epicenter'
      },
      {
        number: 18,
        answer: 'prediction',
        passageKeyword: 'short-term prediction',
        questionKeyword: 'short-term forecasting',
        thaiMeaning: 'การพยากรณ์',
        exactPortion:
          'Currently, scientists have absolutely no reliable method for short-term prediction to warn citizens of an impending tremor'
      }
    ]
  },
  // ── Stage 5 · Passage 1: AI ──────────────────────────────────────────────
  {
    examId: 'journey-normal-stage-5',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['A', 'E'],
    instructions: [
      'Questions 1–5',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'The Rise of Artificial Intelligence',
    summaryLines: [
      {
        type: 'para',
        text:
          'However, the true birth of modern artificial intelligence occurred in the mid-20th century, driven by the rapid development of complex mathematical int {1} capable of processing massive datasets. By feeding a computer thousands of specific "if-then" statements, programmers successfully taught machines to play chess and solve basic algebra using sheer computational {2}. Instead of writing explicit rules, engineers began designing artificial beg {3} networks inspired by the human brain.'
      },
      {
        type: 'bullet',
        text:
          'However, this aggressive push for corporate auto {4} has sparked severe anxieties regarding widespread workforce displacement.'
      },
      {
        type: 'bullet',
        text:
          'This capacity for digital deception necessitates the immediate development of robust technological {5} to prevent the mass spread of political misinformation and protect personal privacy.'
      },
      {
        type: 'bullet',
        text: 'Hyper-realistic fakes demand robust technological {5} to limit misinformation.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'algorithms',
        passageKeyword: 'complex mathematical algorithms',
        questionKeyword: 'complex mathematical procedures',
        thaiMeaning: 'อัลกอริทึม',
        exactPortion:
          'However, the true birth of modern artificial intelligence occurred in the mid-20th century, driven by the rapid development of complex mathematical algorithms capable of processing massive datasets'
      },
      {
        number: 2,
        answer: 'logic',
        passageKeyword: 'computational logic',
        questionKeyword: 'strict computational reasoning',
        thaiMeaning: 'ตรรกะ',
        exactPortion:
          'By feeding a computer thousands of specific "if-then" statements, programmers successfully taught machines to play chess and solve basic algebra using sheer computational logic'
      },
      {
        number: 3,
        answer: 'neural',
        passageKeyword: 'artificial neural networks',
        questionKeyword: 'brain-like digital networks',
        thaiMeaning: 'ประสาท / โครงข่ายประสาท',
        exactPortion:
          'Instead of writing explicit rules, engineers began designing artificial neural networks inspired by the human brain'
      },
      {
        number: 4,
        answer: 'automation',
        passageKeyword: 'corporate automation',
        questionKeyword: 'workplace automation',
        thaiMeaning: 'ระบบอัตโนมัติ',
        exactPortion:
          'However, this aggressive push for corporate automation has sparked severe anxieties regarding widespread workforce displacement'
      },
      {
        number: 5,
        answer: 'ethics',
        passageKeyword: 'technological ethics',
        questionKeyword: 'moral safeguards for technology',
        thaiMeaning: 'จริยธรรม',
        exactPortion:
          'This capacity for digital deception necessitates the immediate development of robust technological ethics to prevent the mass spread of political misinformation and protect personal privacy'
      }
    ]
  },
  // ── Stage 5 · Passage 2: Chocolate ─────────────────────────────────────────
  {
    examId: 'journey-normal-stage-5',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 18,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 14–18',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–18 on your answer sheet.'
    ],
    summaryTitle: 'The Global History of Chocolate',
    summaryLines: [
      {
        type: 'para',
        text:
          'Deep within the Mesoamerican rainforests, the ancient Maya and Aztec civilizations revered the cacao tree, utilizing its fermented seeds as a literal form of {14} to pay regional taxes. Appalled by its intense bitterness, the Spanish heavily modified the drink by removing the chili and adding expensive cane sugar and vanilla, transforming it into an indulgent luxury reserved exclusively for the European {15}. This crucial mechanical invention allowed large {16} to affordably mass-produce solid, smooth chocolate bars for the very first time.'
      },
      {
        type: 'bullet',
        text:
          'By associating their products with romance and holiday celebrations, brilliant corporate {17} campaigns successfully permanently embedded chocolate into global cultural traditions like Valentine\'s Day.'
      },
      {
        type: 'bullet',
        text:
          'Organizations are actively promoting fair trade certifications to ensure strict ecological {18} and guarantee a living wage for rural farming communities.'
      },
      {
        type: 'bullet',
        text: 'Fair-trade groups promote ecological {18} and better pay for farmers.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'currency',
        passageKeyword: 'literal form of currency',
        questionKeyword: 'form of money',
        thaiMeaning: 'สกุลเงิน / เงินตรา',
        exactPortion:
          'Deep within the Mesoamerican rainforests, the ancient Maya and Aztec civilizations revered the cacao tree, utilizing its fermented seeds as a literal form of currency to pay regional taxes'
      },
      {
        number: 15,
        answer: 'nobility',
        passageKeyword: 'European nobility',
        questionKeyword: 'European upper class',
        thaiMeaning: 'ชนชั้นสูง / ขุนนาง',
        exactPortion:
          'Appalled by its intense bitterness, the Spanish heavily modified the drink by removing the chili and adding expensive cane sugar and vanilla, transforming it into an indulgent luxury reserved exclusively for the European nobility'
      },
      {
        number: 16,
        answer: 'factories',
        passageKeyword: 'large factories',
        questionKeyword: 'industrial plants',
        thaiMeaning: 'โรงงาน',
        exactPortion:
          'This crucial mechanical invention allowed large factories to affordably mass-produce solid, smooth chocolate bars for the very first time'
      },
      {
        number: 17,
        answer: 'marketing',
        passageKeyword: 'corporate marketing campaigns',
        questionKeyword: 'advertising campaigns',
        thaiMeaning: 'การตลาด',
        exactPortion:
          'By associating their products with romance and holiday celebrations, brilliant corporate marketing campaigns successfully permanently embedded chocolate into global cultural traditions like Valentine\'s Day'
      },
      {
        number: 18,
        answer: 'sustainability',
        passageKeyword: 'ecological sustainability',
        questionKeyword: 'environmental sustainability',
        thaiMeaning: 'ความยั่งยืน',
        exactPortion:
          'Organizations are actively promoting fair trade certifications to ensure strict ecological sustainability and guarantee a living wage for rural farming communities'
      }
    ]
  },
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_10,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_11_15
]
