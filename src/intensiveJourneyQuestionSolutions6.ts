import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

/** Local question numbers before journey remap (P1: 1–14, P2: 1–13). */
type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_6: Record<number, StageSolutions> = {
  6: {
    1: {
      1: s('shifted from agricultural dominance to urban manufacturing', 'increase in the number of farmers', 'เปลี่ยนจากเกษตรสู่เมือง ไม่ได้บอกว่าเกษตรกรเพิ่ม'),
      2: s('unprecedented output', 'significant increase in volume of goods', 'ผลผลิตเพิ่มขึ้นอย่างมาก'),
      3: s('drain excess water from flooded mines', 'agricultural irrigation', 'ใช้ระบายน้ำในเหมือง ไม่ใช่ชลประทาน'),
      4: s('widespread adoption of steam power across various British manufacturing hubs', 'application in diverse industrial settings', 'ใช้ไอน้ำในโรงงานหลากหลาย'),
      5: s('demand for coal increased rapidly', 'coal initially considered expensive', 'ไม่ได้กล่าวว่าถ่านหินแพงตอนต้น'),
      6: s('By 1830, transportation routes connected major northern cities', 'completed by the year 1820', 'ไม่ได้ระบุว่าเสร็จปี 1820'),
      7: s('cottage industry, with production handled by individual artisans', 'solitary craftsmen at home', 'ช่างทำผ้าที่บ้าน'),
      8: s('coke, a derivative of coal', 'coal-based substance coke', 'โค้ก (จากถ่านหิน)'),
      9: s('prevented potential accidents on the tracks', 'accidents on railway lines', 'อุบัติเหตุ'),
      10: s('severe overcrowding', 'overcrowding in urban centres', 'ความแออัด'),
      11: s('textile and metal-working sectors', 'textile industry', 'สิ่งทอ'),
      12: s('rotary movement', 'rotary motion', 'การหมุน'),
      13: s('need for steel and iron', 'iron and steel (railway material)', 'เหล็กกล้า'),
      14: s('sanitation failures', 'sanitation systems', 'ระบบสุขาภิบาล')
    },
    2: {
      1: s('most challenging environments on Earth', 'Paragraph A', 'แนะนำสภาพแวดล้อมสุดขั้ว'),
      2: s('expansive taproots that burrow deep underground', 'Paragraph B', 'รากลึกดึงน้ำใต้ดิน'),
      3: s('hold massive quantities of liquid within their thick, fleshy stems', 'Paragraph C', 'เก็บน้ำในส่วนหนาของต้น'),
      4: s('protective, waxy exterior', 'Paragraph D', 'ผิวนอกมีขี้ผึ้งลดการระเหย'),
      5: s('delaying this activity until the cooler nighttime hours', 'Paragraph E', 'เลื่อนกิจกรรมไปกลางคืน'),
      6: s('strategy of dormancy to survive the dry season', 'Paragraph F', 'จำศีลรอฝน'),
      7: s('Human expansion and off-road activities', 'Paragraph G', 'ภัยจากการขยายตัวของมนุษย์'),
      8: s('Succulents are specifically adapted to hold massive quantities of liquid', 'only type of succulent that stores water', 'ไม่ได้บอกว่าเฉพาะกระบองเพชรเท่านั้น'),
      9: s('extremely slow growth rates', 'recover from physical damage very quickly', 'เติบโตช้า ฟื้นตัวไม่เร็ว'),
      10: s('cooler nighttime hours', 'nighttime temperatures always below freezing', 'ไม่ได้บอกว่าอุณหภูมิกลางคืนต่ำกว่า 0°C เสมอ'),
      11: s('sharp spines', 'pointed spines', 'หนาม'),
      12: s('chemical inhibitors', 'germination-blocking compound (inhibitor)', 'สารยับยั้ง'),
      13: s('protective surface crust', 'thin surface covering (crust)', 'ชั้นผิวดิน')
    }
  }
}
