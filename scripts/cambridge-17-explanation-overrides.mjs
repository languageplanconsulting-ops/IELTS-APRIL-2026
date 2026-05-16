/** Hand-refined explanations where auto-quote ranking is unreliable. */
export const CAMBRIDGE_17_EXPLANATION_OVERRIDES = {
  '1-1-7': {
    thai:
      'ในบทความระบุชัดว่า Metropolitan line ที่เปิดในปี 1863 เป็น "the world\'s first underground railway" แปลว่ายังไม่มีประเทศอื่นสร้างรถไฟใต้ดินมาก่อนหน้านี้ ข้อที่ว่าประเทศอื่นสร้างมาก่อนจึงขัดกับบทความ จึงตอบ FALSE',
    para: "other countries built before = world's first underground railway = เป็นระบบรถไฟใต้ดินแห่งแรกของโลก",
    exactHints: "world's first underground railway|Metropolitan line|1863",
    exact:
      "The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway."
  },
  '1-1-8': {
    thai:
      'บทความบอกจำนวนผู้โดยสารวันแรก (เกือบ 40,000 คน) แต่ไม่ได้เปรียบเทียบกับจำนวนที่คาดการณ์ไว้ว่ามากกว่าหรือน้อยกว่า จึงไม่มีข้อมูลยืนยันข้อนี้ จึงตอบ NOT GIVEN',
    para: 'more people than predicted = NOT GIVEN = ไม่มีการเปรียบเทียบกับคาดการณ์',
    exactHints: 'first day|40,000 passengers|NOT GIVEN',
    exact:
      'On its first day, almost 40,000 passengers were carried between Paddington and Farringdon, the journey taking about 18 minutes.'
  },
  '1-1-11': {
    thai:
      'บทความระบุว่าตู้รถ City & South London มีหน้าต่างเล็กๆ อยู่ใต้หลังคา (just below the roof) เพราะคิดว่าผู้โดยสารไม่อยากมองผนังอุโมงค์ ไม่ใช่ระดับสายตา (eye level) จึงตอบ FALSE',
    para: 'windows at eye level = tiny windows just below the roof = หน้าต่างอยู่ใต้หลังคา',
    exactHints: 'tiny windows|below the roof|tunnel walls',
    exact:
      'The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls.'
  },
  '1-1-12': {
    thai:
      'บทความระบุตรงๆ ว่า City & South London Railway เป็นความสำเร็จทางเทคนิค แต่ "did not make a profit" แปลว่าไม่ประสบความสำเร็จทางการเงิน ข้อที่ว่าเป็น financial success จึงตอบ FALSE',
    para: 'financial success = did not make a profit = ไม่ทำกำไร',
    exactHints: 'did not make a profit|City & South London',
    exact:
      'Although the City & South London Railway was a great technical achievement, it did not make a profit.'
  },
  '1-1-13': {
    thai:
      'บทความไม่ได้กล่าวว่ารถบน Tuppenny Tube ตรงเวลาแค่ไหน หรือรอบเวลาเป็นอย่างไร จึงไม่มีข้อมูลยืนยันหรือปฏิเสธข้อนี้ จึงตอบ NOT GIVEN',
    para: 'nearly always on time = NOT GIVEN = ไม่มีข้อมูลเรื่องตรงเวลา',
    exactHints: 'Tuppenny Tube|NOT GIVEN|on time',
    exact: "Then, in 1900, the Central London Railway, known as the 'Tuppenny Tube', began operation using new electric locomotives."
  }
}
