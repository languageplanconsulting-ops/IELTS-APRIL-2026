import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 1–5 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5: NewFillBlankSet[] = [
  {
    examId: "journey-normal-stage-1",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Colony Collapse Disorder and its causes",
    summaryLines: [
      { type: 'para', text: "Honeybee colonies have been declining severely since the mid-2000s. The problem was given the name Colony Collapse {8} after beekeepers in the United States reported that worker bees had vanished from otherwise healthy hives." },
      { type: 'bullet', text: "A class of pesticides known as {9} has been shown to damage bees' ability to navigate." },
      { type: 'bullet', text: "The {10} mite is a widespread parasite that feeds on bee fat tissue and spreads dangerous viruses." },
      { type: 'bullet', text: "One of these, Deformed Wing {11}, leaves newly hatched bees physically unable to fly." },
      { type: 'bullet', text: "Poor diet caused by the spread of large-scale {12} farming has also left bee immune systems weakened." },
      { type: 'bullet', text: "Changes in climate have disrupted the timing of plant {13} production." },
      { type: 'bullet', text: "Scientists predict that harvests of {14}-dependent crops could drop dramatically within a single generation." }
    ],
    questions: [
      { number: 8, answer: "Disorder", passageKeyword: "Colony Collapse Disorder", questionKeyword: "Colony Collapse Disorder", thaiMeaning: "โรค/ความผิดปกติของอาณานิคม (CCD)", exactPortion: "a phenomenon researchers named Colony Collapse Disorder, or CCD" },
      { number: 9, answer: "neonicotinoids", passageKeyword: "neonicotinoids", questionKeyword: "neonicotinoids", thaiMeaning: "นิโอนิโคตินอยด์ (สารกำจัดแมลง)", exactPortion: "Pesticides — particularly a class called neonicotinoids — have been shown to impair bee navigation" },
      { number: 10, answer: "Varroa", passageKeyword: "Varroa mite", questionKeyword: "Varroa mite", thaiMeaning: "ไรวาโรอา", exactPortion: "The Varroa mite, first detected in Europe in the 1970s" },
      { number: 11, answer: "Virus", passageKeyword: "Deformed Wing Virus", questionKeyword: "Deformed Wing Virus", thaiMeaning: "ไวรัส Deformed Wing", exactPortion: "Deformed Wing Virus, which causes bees to be born with shrivelled, non-functional wings" },
      { number: 12, answer: "monoculture", passageKeyword: "monoculture fields", questionKeyword: "monoculture farming", thaiMeaning: "การปลูกพืชชนิดเดียว", exactPortion: "Intensive agriculture has replaced wildflower meadows with monoculture fields" },
      { number: 13, answer: "nectar", passageKeyword: "flowers provide nectar", questionKeyword: "nectar production", thaiMeaning: "น้ำหวาน", exactPortion: "causing mismatches between when bees are active and when flowers provide nectar" },
      { number: 14, answer: "pollinator", passageKeyword: "pollinator-dependent crops", questionKeyword: "pollinator-dependent crops", thaiMeaning: "พืชที่พึ่งผู้ช่วยผสมเกสร", exactPortion: "yields of pollinator-dependent crops could fall by as much as 90% within a generation" }
    ]
  },
  {
    examId: "journey-normal-stage-1",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["C", "E"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Tesla's commercial and wireless achievements",
    summaryLines: [
      { type: 'para', text: "Tesla's most commercially significant achievement was helping to establish alternating current as the dominant form of electrical {25}." },
      { type: 'bullet', text: "His partnership with George Westinghouse proved decisive after their system was selected to generate electricity from Niagara {26}." },
      { type: 'bullet', text: "Tesla also pursued the idea of global wireless {27}, for which he sought legal protection through a series of patents." }
    ],
    questions: [
      { number: 25, answer: "power", passageKeyword: "harness the power of Niagara Falls", questionKeyword: "dominant form of electrical power", thaiMeaning: "พลังงานไฟฟ้า", exactPortion: "their AC system was chosen over Edison's DC system to harness the power of Niagara Falls" },
      { number: 26, answer: "Falls", passageKeyword: "Niagara Falls", questionKeyword: "Niagara Falls", thaiMeaning: "น้ำตกไนแองการา", exactPortion: "harness the power of Niagara Falls" },
      { number: 27, answer: "communication", passageKeyword: "world wireless communication", questionKeyword: "global wireless communication", thaiMeaning: "การสื่อสารไร้สาย", exactPortion: "a system of world wireless communication" }
    ]
  },
  {
    examId: "journey-normal-stage-2",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Minerals on the ocean floor",
    summaryLines: [
      { type: 'para', text: "The ocean floor contains enormous quantities of minerals stored in small, rounded {8} that build up gradually over geological timescales." },
      { type: 'bullet', text: "Interest in recovering these materials has grown because of demand from the {9} transition." },
      { type: 'bullet', text: "Scientists discovered more than 5,000 {10} living in and around these mineral deposits." },
      { type: 'bullet', text: "Disturbed areas show no signs of {11} even after many decades." },
      { type: 'bullet', text: "Legally, minerals in international waters are considered the {12} of all humanity." },
      { type: 'bullet', text: "Nations with superior {13} are better positioned to capture these profits." },
      { type: 'bullet', text: "As demand for battery {14} continues to rise, pressure on policymakers is expected to grow." }
    ],
    questions: [
      { number: 8, answer: "nodules", passageKeyword: "potato-sized nodules", questionKeyword: "rounded nodules", thaiMeaning: "ก้อนแร่กลม", exactPortion: "billions of potato-sized nodules" },
      { number: 9, answer: "energy", passageKeyword: "global energy transition", questionKeyword: "energy transition", thaiMeaning: "การเปลี่ยนผ่านด้านพลังงาน", exactPortion: "closely connected to the global energy transition" },
      { number: 10, answer: "species", passageKeyword: "5,000 species", questionKeyword: "species living around mineral deposits", thaiMeaning: "สปีชีส์", exactPortion: "identified over 5,000 species" },
      { number: 11, answer: "recovery", passageKeyword: "Recovery timescales", questionKeyword: "recovery after disturbance", thaiMeaning: "การฟื้นตัว", exactPortion: "Recovery timescales add to these concerns" },
      { number: 12, answer: "heritage", passageKeyword: "common heritage of mankind", questionKeyword: "heritage of all humanity", thaiMeaning: "มรดกร่วมของมนุษยชาติ", exactPortion: "defined as the \"common heritage of mankind\"" },
      { number: 13, answer: "technology", passageKeyword: "most advanced deep-sea technology", questionKeyword: "superior technology", thaiMeaning: "เทคโนโลยี", exactPortion: "countries and corporations with the most advanced deep-sea technology" },
      { number: 14, answer: "metals", passageKeyword: "battery metals", questionKeyword: "battery metals", thaiMeaning: "โลหะสำหรับแบตเตอรี่", exactPortion: "As the global demand for battery metals accelerates" }
    ]
  },
  {
    examId: "journey-normal-stage-2",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["A", "F"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "The history of deaf education",
    summaryLines: [
      { type: 'para', text: "For most of European history, deaf people were denied fundamental {25} on the grounds that they could not use spoken language." },
      { type: 'bullet', text: "Sign language developed as a legitimate means of instruction until the Milan {26} of 1880 banned its use in schools." },
      { type: 'bullet', text: "William Stokoe proved that American Sign Language possessed the full characteristics of a genuine {27}." }
    ],
    questions: [
      { number: 25, answer: "rights", passageKeyword: "denied legal rights", questionKeyword: "fundamental rights", thaiMeaning: "สิทธิ", exactPortion: "Deaf individuals in medieval Europe were frequently denied legal rights" },
      { number: 26, answer: "resolution", passageKeyword: "Milan resolution", questionKeyword: "Milan resolution of 1880", thaiMeaning: "มติมิลาน", exactPortion: "the Milan resolution is now widely regarded by deaf historians" },
      { number: 27, answer: "language", passageKeyword: "complete, independent language", questionKeyword: "genuine language", thaiMeaning: "ภาษา", exactPortion: "a complete, independent language with its own phonology, morphology, and syntax" }
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Understanding procrastination",
    summaryLines: [
      { type: 'para', text: "Procrastination is best understood not as a problem of scheduling but of {8} management, since people tend to avoid tasks that generate negative feelings." },
      { type: 'bullet', text: "When avoidance provides relief, the temporary good {9} produced by avoidance reinforces the behaviour." },
      { type: 'bullet', text: "Applying {10} to oneself after procrastinating can reduce future avoidance." },
      { type: 'bullet', text: "Planning strategies known as implementation {11} have shown measurable results in reducing task delay." },
      { type: 'bullet', text: "Those with maladaptive {12} are particularly prone to procrastination." },
      { type: 'bullet', text: "Starting a task may expose a personal {13}." },
      { type: 'bullet', text: "Any intervention must address the emotional roots of delay, not only the {14} in which it occurs." }
    ],
    questions: [
      { number: 8, answer: "emotion", passageKeyword: "tasks that generate negative emotion", questionKeyword: "emotion management", thaiMeaning: "อารมณ์", exactPortion: "tasks that generate negative emotion" },
      { number: 9, answer: "feeling", passageKeyword: "temporary good feeling", questionKeyword: "good feeling from avoidance", thaiMeaning: "ความรู้สึกดีชั่วคราว", exactPortion: "The temporary good feeling that results from avoidance reinforces the behaviour" },
      { number: 10, answer: "self-compassion", passageKeyword: "self-compassion", questionKeyword: "self-compassion", thaiMeaning: "ความเมตตาต่อตนเอง", exactPortion: "The role of self-compassion in breaking this cycle has attracted considerable research attention" },
      { number: 11, answer: "intentions", passageKeyword: "Implementation intentions", questionKeyword: "implementation intentions", thaiMeaning: "แผนปฏิบัติที่ผูกสถานการณ์กับการกระทำ", exactPortion: "Implementation intentions — specific plans that link a future situation to a particular behaviour" },
      { number: 12, answer: "perfectionism", passageKeyword: "maladaptive perfectionism", questionKeyword: "maladaptive perfectionism", thaiMeaning: "ความพยายามให้สมบูรณ์แบบแบบไม่เหมาะสม", exactPortion: "Individuals with maladaptive perfectionism delay tasks because starting implies the possibility of failure" },
      { number: 13, answer: "inadequacy", passageKeyword: "fundamental inadequacy", questionKeyword: "personal inadequacy", thaiMeaning: "ความรู้สึกว่าตัวเองไม่ดีพอ", exactPortion: "failure is experienced not as a setback but as evidence of fundamental inadequacy" },
      { number: 14, answer: "context", passageKeyword: "in some contexts but not others", questionKeyword: "context in which it occurs", thaiMeaning: "บริบท", exactPortion: "in some contexts but not others" }
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["A", "F"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "From laboratory discovery to mass production",
    summaryLines: [
      { type: 'para', text: "The development of penicillin followed a long path from an unexpected finding in a {25} in London to industrial manufacture in the United States." },
      { type: 'bullet', text: "Scientists discovered that fermenting the mould in corn steep {26} produced far larger quantities than earlier methods." },
      { type: 'bullet', text: "Medical {27} estimate that more than one in ten Allied soldiers survived infected wounds because of penicillin." }
    ],
    questions: [
      { number: 25, answer: "laboratory", passageKeyword: "his laboratory at St Mary's Hospital", questionKeyword: "laboratory in London", thaiMeaning: "ห้องปฏิบัติการ", exactPortion: "his laboratory at St Mary's Hospital in London" },
      { number: 26, answer: "liquor", passageKeyword: "corn steep liquor", questionKeyword: "corn steep liquor", thaiMeaning: "ของเหลวจากข้าวโพด", exactPortion: "fermenting penicillin in corn steep liquor" },
      { number: 27, answer: "historians", passageKeyword: "Military medical historians", questionKeyword: "medical historians", thaiMeaning: "นักประวัติศาสตร์การแพทย์ทหาร", exactPortion: "Military medical historians credit penicillin with saving the lives" }
    ]
  },
  {
    examId: "journey-normal-stage-4",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Urban housing affordability",
    summaryLines: [
      { type: 'para', text: "Beyond financial strain on individuals, economists have identified connections to reduced {8} mobility and declining mental health." },
      { type: 'bullet', text: "A central cause is insufficient {9} — too few homes are being built relative to demand." },
      { type: 'bullet', text: "Professor Glaeser argues that {10} laws protect the interests of those who already own homes." },
      { type: 'bullet', text: "Rodríguez-Pose focuses on the role of {11} in converting housing into an investment vehicle." },
      { type: 'bullet', text: "The Right to Buy {12} reduced available council homes by more than two million." },
      { type: 'bullet', text: "Modular construction offers savings, but uptake has been limited by the cost of establishing modular {13}." },
      { type: 'bullet', text: "Resolving the crisis will require changes to {14} regulation." }
    ],
    questions: [
      { number: 8, answer: "labour", passageKeyword: "reduced labour mobility", questionKeyword: "labour mobility", thaiMeaning: "การเคลื่อนย้ายแรงงาน", exactPortion: "economists have linked severe housing unaffordability to reduced labour mobility" },
      { number: 9, answer: "supply", passageKeyword: "housing supply has failed to keep pace", questionKeyword: "insufficient supply", thaiMeaning: "อุปทานที่อยู่อาศัย", exactPortion: "housing supply has failed to keep pace with population growth and increasing demand" },
      { number: 10, answer: "zoning", passageKeyword: "Restrictive zoning laws", questionKeyword: "zoning laws", thaiMeaning: "กฎจัดโซนที่อยู่อาศัย", exactPortion: "Restrictive zoning laws — which limit the density, height, and type of buildings permitted" },
      { number: 11, answer: "financialisation", passageKeyword: "financialisation of housing", questionKeyword: "financialisation", thaiMeaning: "การทำให้ที่อยู่อาศัยเป็นสินทรัพย์การเงิน", exactPortion: "the financialisation of housing, whereby residential property has been transformed from a consumption good into an investment asset" },
      { number: 12, answer: "scheme", passageKeyword: "Right to Buy scheme", questionKeyword: "Right to Buy scheme", thaiMeaning: "โครงการ Right to Buy", exactPortion: "the Right to Buy scheme introduced by the Thatcher government in 1980" },
      { number: 13, answer: "factories", passageKeyword: "modular factories", questionKeyword: "modular factories", thaiMeaning: "โรงงานประกอบบ้านสำเร็จรูป", exactPortion: "the high initial capital costs of establishing modular factories" },
      { number: 14, answer: "investment", passageKeyword: "regulation of speculative investment", questionKeyword: "investment regulation", thaiMeaning: "การกำกับการลงทุนเชิงเก็งกำไร", exactPortion: "regulation of speculative investment" }
    ]
  },
  {
    examId: "journey-normal-stage-4",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["A", "F"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "The Human Genome Project",
    summaryLines: [
      { type: 'para', text: "The Human Genome Project produced a publicly accessible {25} of human DNA, governed by a principle that required all sequence data to be deposited in a shared database within a day of being generated." },
      { type: 'bullet', text: "All sequence data would be deposited in a public {26} within twenty-four hours of generation." },
      { type: 'bullet', text: "Most common diseases are influenced by thousands of individual genetic {27}, each contributing only a small effect." }
    ],
    questions: [
      { number: 25, answer: "sequence", passageKeyword: "complete sequence of the human genome", questionKeyword: "DNA sequence", thaiMeaning: "ลำดับ DNA", exactPortion: "scientists had produced a working draft of the complete sequence of the human genome" },
      { number: 26, answer: "database", passageKeyword: "public database", questionKeyword: "public database", thaiMeaning: "ฐานข้อมูลสาธารณะ", exactPortion: "deposited in a public database within twenty-four hours of generation" },
      { number: 27, answer: "variants", passageKeyword: "thousands of genetic variants", questionKeyword: "genetic variants", thaiMeaning: "ลักษณะย่อยทางพันธุกรรม", exactPortion: "spread across thousands of variants, each with a very small individual effect" }
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "How memory works",
    summaryLines: [
      { type: 'para', text: "Memory is best understood through the concept of {8}, which describes why each recall involves potential alteration." },
      { type: 'bullet', text: "The stage at which new information is made permanent is known as {9}." },
      { type: 'bullet', text: "This process depends heavily on a brain structure called the {10}." },
      { type: 'bullet', text: "The process is strengthened during a specific phase of sleep called slow-wave {11}." },
      { type: 'bullet', text: "Strong emotional experiences produce vivid memories, but emotional {12} does not protect against factual error." },
      { type: 'bullet', text: "A single word can lead a witness to report seeing {13} that was not present at the scene." },
      { type: 'bullet', text: "Researchers have explored whether false {14} can be planted through suggestion." }
    ],
    questions: [
      { number: 8, answer: "reconsolidation", passageKeyword: "Reconsolidation", questionKeyword: "reconsolidation", thaiMeaning: "การสร้างความจำใหม่หลังถูกเรียก", exactPortion: "Reconsolidation — the process by which retrieved memories are temporarily labile" },
      { number: 9, answer: "consolidation", passageKeyword: "process called consolidation", questionKeyword: "consolidation", thaiMeaning: "การรวมความจำระยะยาว", exactPortion: "through a process called consolidation. During consolidation, the hippocampus" },
      { number: 10, answer: "hippocampus", passageKeyword: "the hippocampus", questionKeyword: "hippocampus", thaiMeaning: "ฮิปโปแคมปัส", exactPortion: "the hippocampus — a seahorse-shaped structure in the medial temporal lobe — plays a central role" },
      { number: 11, answer: "sleep", passageKeyword: "slow-wave sleep", questionKeyword: "slow-wave sleep", thaiMeaning: "การนอนหลับลึก (slow-wave)", exactPortion: "During slow-wave sleep — the deepest stages of the sleep cycle" },
      { number: 12, answer: "intensity", passageKeyword: "emotional intensity does not guarantee accuracy", questionKeyword: "emotional intensity", thaiMeaning: "ความเข้มข้นทางอารมณ์", exactPortion: "emotional intensity does not guarantee accuracy" },
      { number: 13, answer: "glass", passageKeyword: "broken glass at the scene", questionKeyword: "broken glass", thaiMeaning: "กระจก", exactPortion: "to falsely remember broken glass at the scene" },
      { number: 14, answer: "memories", passageKeyword: "false memories can be deliberately implanted", questionKeyword: "false memories", thaiMeaning: "ความจำเท็จ", exactPortion: "false memories can be deliberately implanted" }
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["A", "D"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Esperanto through history",
    summaryLines: [
      { type: 'para', text: "Zamenhof designed Esperanto to belong to no single {25}, free from the cultural dominance that accompanies natural languages." },
      { type: 'bullet', text: "In the Soviet Union and Nazi Germany, thousands of Esperanto speakers suffered severe {26}." },
      { type: 'bullet', text: "Linguists point to children who grew up with it as their first {27} as evidence of genuine community roots." }
    ],
    questions: [
      { number: 25, answer: "nation", passageKeyword: "belonging to no single nation", questionKeyword: "single nation", thaiMeaning: "ชาติ", exactPortion: "belonging to no single nation and therefore free from the cultural dominance that accompanies natural languages" },
      { number: 26, answer: "persecution", passageKeyword: "systematic campaign of persecution", questionKeyword: "severe persecution", thaiMeaning: "การล่าอาวรณ์", exactPortion: "ordered a systematic campaign of persecution" },
      { number: 27, answer: "language", passageKeyword: "first language", questionKeyword: "first language", thaiMeaning: "ภาษา", exactPortion: "children who grew up speaking it as a first language in households where parents met through Esperanto" }
    ]
  }
]
