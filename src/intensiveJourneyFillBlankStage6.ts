import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 6 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_6: NewFillBlankSet[] = [
  {
    examId: "journey-normal-stage-6",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["E", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Industrial production and urban change",
    summaryLines: [
      { type: 'para', text: "Smelting iron ore using {8}, a coal-based substance, replaced the older charcoal method." },
      { type: 'bullet', text: "The telegraph allowed instant signalling between stations, helping to prevent {9} on railway lines." },
      { type: 'bullet', text: "Migration from the countryside caused {10} and other public health problems in fast-growing urban centres." },
      { type: 'bullet', text: "Factory-based mass production expanded capacity across industries such as {11} and metal-working." },
      { type: 'bullet', text: "Watt's improved steam engine could convert the back-and-forth motion of a piston into continuous {12} motion." },
      { type: 'bullet', text: "The expansion of railway networks created an enormous appetite for both iron and {13}." },
      { type: 'bullet', text: "Poor living conditions in cities were linked in part to failures in {14} systems." }
    ],
    questions: [
      { number: 8, answer: "coke", passageKeyword: "coke, a derivative of coal", questionKeyword: "coal-based substance coke", thaiMeaning: "โค้ก (จากถ่านหิน)", exactPortion: "Smelting iron ore using coke, a derivative of coal, replaced the conventional charcoal method" },
      { number: 9, answer: "accidents", passageKeyword: "prevented potential accidents on the tracks", questionKeyword: "accidents on railway lines", thaiMeaning: "อุบัติเหตุ", exactPortion: "This technology successfully prevented potential accidents on the tracks by allowing instant signalling between distant stations" },
      { number: 10, answer: "overcrowding", passageKeyword: "severe overcrowding", questionKeyword: "overcrowding in urban centres", thaiMeaning: "ความแออัด", exactPortion: "it also caused severe overcrowding and sanitation failures in major urban centers" },
      { number: 11, answer: "textile", passageKeyword: "textile and metal-working sectors", questionKeyword: "textile industry", thaiMeaning: "สิ่งทอ", exactPortion: "This transition allowed for unprecedented output in textile and metal-working sectors" },
      { number: 12, answer: "rotary", passageKeyword: "rotary movement", questionKeyword: "rotary motion", thaiMeaning: "การหมุน", exactPortion: "resulted in a steam engine that transformed linear energy into rotary movement" },
      { number: 13, answer: "steel", passageKeyword: "need for steel and iron", questionKeyword: "iron and steel (railway material)", thaiMeaning: "เหล็กกล้า", exactPortion: "The expansion of railway networks later created an insatiable need for steel and iron" },
      { number: 14, answer: "sanitation", passageKeyword: "sanitation failures", questionKeyword: "sanitation systems", thaiMeaning: "ระบบสุขาภิบาล", exactPortion: "it also caused severe overcrowding and sanitation failures in major urban centers" }
    ]
  },
  {
    examId: "journey-normal-stage-6",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["D", "G"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Desert survival mechanisms",
    summaryLines: [
      { type: 'bullet', text: "Leaves have been shed by many plants, replaced by pointed {25} that discourage animals and provide shade." },
      { type: 'bullet', text: "Some desert seeds carry a built-in {26} compound that prevents premature germination." },
      { type: 'bullet', text: "Off-road vehicles can damage the thin {27} covering the surface of desert soil." }
    ],
    questions: [
      { number: 25, answer: "spines", passageKeyword: "sharp spines", questionKeyword: "pointed spines", thaiMeaning: "หนาม", exactPortion: "many species have shed their leaves entirely, replacing them with sharp spines" },
      { number: 26, answer: "inhibitor", passageKeyword: "chemical inhibitors", questionKeyword: "germination-blocking compound (inhibitor)", thaiMeaning: "สารยับยั้ง", exactPortion: "prevented from sprouting by chemical inhibitors" },
      { number: 27, answer: "crust", passageKeyword: "protective surface crust", questionKeyword: "thin surface covering (crust)", thaiMeaning: "ชั้นผิวดิน", exactPortion: "Heavy vehicles crush shallow root systems and break the protective surface crust of the ground" }
    ]
  }
]
