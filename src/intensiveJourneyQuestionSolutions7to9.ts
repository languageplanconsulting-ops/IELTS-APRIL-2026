import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_7_9: Record<number, StageSolutions> = {
  7: {
    1: {
      1: s('Research over the past two decades has fundamentally overturned this view', 'only recently understand active role beyond digestion', 'เข้าใจบทบาทที่แท้จริงเพิ่งชัดใน 20 ปีที่ผ่านมา'),
      2: s('causation is difficult to establish', 'conclusively proven caesarean causes asthma', 'ไม่ได้พิสูจน์ว่าเกิดจากไมโครไบโอมโดยตรง'),
      3: s('the infant cannot digest', 'oligosaccharides digested directly by infant', 'ทารกย่อยไม่ได้'),
      4: s('reduced markers of inflammation compared with a diet high in fibre alone', 'fermented foods reduced inflammation more than fibre alone', 'อาหารหมักลดการอักเสบมากกว่าไฟเบอร์อย่างเดียว'),
      5: s('has proposed the Old Friends Hypothesis', 'formally adopted in UK treatment guidelines', 'ไม่ได้กล่าวว่านำไปใช้ในแนวทางรักษา'),
      6: s('remarkable effectiveness in treating recurrent Clostridioides difficile infection', 'FMT success for antibiotic-related infections', 'ปลูกถ่ายอุจจาระได้ผลกับ C. difficile'),
      7: s('health claims that frequently outpace the available evidence', 'probiotic claims not supported by research', 'อ้างสรรพคุณเกินกว่าหลักฐาน'),
      8: s('Collectively known as the microbiome', 'microbiome (collective name)', 'ไมโครไบโอม'),
      9: s('butyrate', 'butyrate compound', 'บิวทิเรต'),
      10: s('Old Friends Hypothesis', 'Old Friends Hypothesis', 'สมมติฐาน Old Friends'),
      11: s('gut-brain axis', 'gut-brain axis', 'แกนลำไส้–สมอง'),
      12: s('germ-free mice', 'laboratory mice without gut microbes', 'หนูไร้เชื้อ'),
      13: s('Faecal microbiota transplantation', 'gut-bacteria transfer (transplantation)', 'การปลูกถ่ายจุลินทรีย์ในอุจจาระ'),
      14: s('Much microbiome science is correlational', 'correlational', 'เชิงความสัมพันธ์')
    },
    2: {
      1: s('Education for women was officially restricted', 'Paragraph A', 'อุปสรรคการศึกษาและความมุ่งมั่น'),
      2: s('emission originated within the uranium atom itself', 'Paragraph B', 'การทดลองระบุแหล่งกำเนิดรังสี'),
      3: s('processed tonnes of pitchblende over four years', 'Paragraph C', 'แยกสารใหม่จากแร่จำนวนมหาศาล'),
      4: s('win Nobel Prizes in two different scientific disciplines', 'Paragraph D', 'ได้รับรางวัลโนเบลสองสาขา'),
      5: s('rejected for membership of the French Academy… death threats', 'Paragraph E', 'ชัยชนะต่างประเทศแต่ถูกโจมตีในฝรั่งเศส'),
      6: s('reduced the rate of unnecessary amputation', 'Paragraph F', 'ผลงานสงครามลดการตัดแขนขา'),
      7: s('died from aplastic anaemia… ignorance of the risks', 'Paragraph G', 'เสียชีวิตเพราะไม่รู้ความเสี่ยงรังสี'),
      8: s('Pierre who insisted that Marie be included', 'Pierre ensured Marie received credit', 'Pierre ยืนยันให้ Marie ได้รับเครดิต'),
      9: s('would not admit a woman member until 1962', 'Academy changed policy within ten years', '1962 คือ 51 ปีหลัง 1911 ไม่ใช่ภายในสิบปี'),
      10: s('she drove herself… trained 150 women to operate them', 'only Curie operated X-ray equipment at front', 'ไม่ได้บอกว่าเธอเป็นคนเดียวที่ปฏิบัติหน้างาน'),
      11: s('coined the term "radioactivity"', 'radioactivity (named by Curie)', 'รังสีกัมมันตภาพ'),
      12: s('samples of pitchblende', 'pitchblende uranium mineral', 'พิตช์เบลนด์'),
      13: s('aplastic anaemia', 'blood disorder (aplastic anaemia)', 'โลหิตจาง')
    }
  },
  8: {
    1: {
      1: s('absorb approximately 25 to 30 percent', 'absorb less than half of CO₂', 'ดูดซับ 25–30% น้อยกว่าครึ่ง'),
      2: s('mechanisms linking acidification to extinction remain debated', 'confirmed acidification caused mass extinctions', 'ยังถกเถียง ไม่ได้ยืนยันเป็นสาเหตุโดยตรง'),
      3: s('provide a preview of future conditions', 'Papua New Guinea seeps preview end-of-century conditions', 'แหล่ง CO₂ ใต้น้ำสะท้อนอนาคต'),
      4: s('diet of Pacific salmon', 'no effect on commercial fish', 'แซลมอนพึ่งพาเทอโรพอด'),
      5: s('enhanced growth under elevated CO₂ conditions', 'some species grow better with higher CO₂', 'บางชนิดเติบโตดีขึ้นเมื่อ CO₂ สูง'),
      6: s('seawater treatment systems that buffer pH', 'hatcheries installed equipment to alter water chemistry', 'ติดตั้งระบบปรับ pH'),
      7: s('requires reducing atmospheric CO₂', 'agreements already reduced seawater acidity', 'ไม่ได้กล่าวว่ามีข้อตกลงที่ลดความเป็นกรดแล้ว'),
      8: s('carbonic acid', 'seawater acid (carbonic acid)', 'กรดคาร์บอนิก'),
      9: s('ocean acidification', 'seawater acidification', 'การเป็นกรดของมหาสมุทร'),
      10: s('Pteropods', 'pteropods (sea butterflies)', 'เทอโรพอด'),
      11: s('Pacific salmon', 'commercially significant Pacific fish (salmon)', 'แซลมอน'),
      12: s('Hatcheries producing oyster seed', 'shellfish breeding hatcheries', 'ฟาร์มพันธุ์หอย'),
      13: s('coastal waters', 'nearshore marine waters', 'น้ำชายฝั่ง'),
      14: s('global emissions reduction', 'worldwide emissions', 'การปล่อยก๊าซ')
    },
    2: {
      1: s('completing the first transcontinental railroad… less than a week by rail', 'Paragraph A', 'เปลี่ยนเวลาเดินทางข้ามทวีป'),
      2: s('Pacific Railroad Act of 1862, providing land grants and government bonds', 'Paragraph B', 'สนับสนุนทางกฎหมายและการเงิน'),
      3: s('Irish immigrants… workers from China', 'Paragraph C', 'แรงงานคนละกลุ่มสองฝั่ง'),
      4: s('nitroglycerin blasting in the Summit Tunnel', 'Paragraph D', 'ความก้าวหน้าทางเทคนิคของแรงงานจีน'),
      5: s('secretly controlled by the principal shareholders… inflated prices', 'Paragraph E', 'กำไรซ่อนในโครงสร้างโครงการ'),
      6: s('excluded from the celebrations… unacknowledged for over a century', 'Paragraph F', 'การแสวงหาประโยชน์และการลบเลือนในประวัติศาสตร์'),
      7: s('displacement and destruction of Indigenous communities', 'Paragraph G', 'ผลกระทบถาวรต่อชนพื้นเมืองและที่ดิน'),
      8: s('doubted their physical capability', 'managers doubted Chinese workers\' suitability', 'ผู้จัดการสงสัยความสามารถทางกาย'),
      9: s('strike collapsed after a week', 'strikers dismissed after failure', 'ไม่ได้กล่าวว่าถูกไล่ออก'),
      10: s('most escaped serious legal consequence', 'imprisonment of a Congress member', 'ส่วนใหญ่ไม่ถูกลงโทษหนัก'),
      11: s('government bonds', 'public financial bonds', 'พันธบัตรรัฐบาล'),
      12: s('Summit Tunnel', 'Summit Tunnel', 'อุโมงค์ Summit'),
      13: s('The scandal eventually became public', 'Crédit Mobilier scandal', 'เรื่องอื้อฉาว')
    }
  },
  9: {
    1: {
      1: s('calculated the expected utility… maximise their welfare', 'calculate greatest benefit', 'คำนวณประโยชน์สูงสุด'),
      2: s('losses are weighted approximately twice as heavily as equivalent gains', 'loss felt more intensely than equal gain', 'ขาดทุนมีน้ำหนักมากกว่ากำไรเท่ากัน'),
      3: s('After a widely publicised plane crash, people consistently overestimate', 'fear of flying increases in weeks after crash', 'ไม่ได้ระบุช่วงเวลาเป็นสัปดาห์'),
      4: s('the majority reversed their preference', 'changed preference when framed as fatalities', 'เปลี่ยนใจเมื่อพูดเป็นการเสียชีวิต'),
      5: s('wheel\'s outcome was clearly irrelevant to the question', 'anchoring only when anchor is related', 'ล้อหมุนไม่เกี่ยวข้องก็ยังมีผล'),
      6: s('highest confidence in their forecasts were frequently the least accurate', 'most confident experts least reliable', 'มั่นใจมากมักแม่นยำน้อย'),
      7: s('organ donation consent rates', 'nudge used in more than fifty countries', 'ไม่ได้ระบุจำนวนประเทศ'),
      8: s('dismantled this model', 'classical economic model', 'แบบจำลองเศรษฐศาสตร์คลาสสิก'),
      9: s('prospect theory', 'prospect theory', 'ทฤษฎี prospect'),
      10: s('availability heuristic', 'availability heuristic', 'heuristic ความพร้อมใช้'),
      11: s('The framing effect', 'framing effect', 'เอฟเฟกต์การจัดกรอบ'),
      12: s('Anchoring describes', 'anchoring', 'การยึดจุดอ้างอิง'),
      13: s('Philip Tetlock', 'political scientist Tetlock', 'ฟิลิป เท็ตล็อก'),
      14: s('default options', 'pre-selected options', 'ตัวเลือกเริ่มต้น')
    },
    2: {
      1: s('largest structure ever assembled in orbit… continuously occupied since November 2000', 'Paragraph A', 'สถานีใหญ่ที่สุดโคจรรอบโลก'),
      2: s('competing ambitions during the Cold War', 'Paragraph B', 'ความทะเยอทะยานในยุคสงครามเย็น'),
      3: s('collapse of the Soviet Union… foundation for the International Space Station', 'Paragraph C', 'การเมืองที่นำไปสู่ความร่วมมือ'),
      4: s('modules were added piece by piece', 'Paragraph D', 'ประกอบในวงโคจรทีละชิ้น'),
      5: s('scientific output… planning future missions to Mars', 'Paragraph E', 'วิทยาศาสตร์และเตรียมภารกิจระยะยาว'),
      6: s('chose to maintain operational cooperation', 'Paragraph F', 'รักษาความร่วมมือท่ามกลางความตึงเครียด'),
      7: s('deorbit the station in 2030… successor stations', 'Paragraph G', 'ประกาศสิ้นสุดและทางเลือกเชิงพาณิชย์'),
      8: s('world\'s first space station, Salyut 1', 'Soviet Union first to launch space station', 'โซเวียตเป็นประเทศแรก'),
      9: s('Russian rocket scientists who might otherwise have sought work in hostile states', 'concern about employment of Russian scientists', 'กังวลเรื่องการจ้างงานนักวิทยาศาสตร์รัสเซีย'),
      10: s('purchasing services from these private operators', 'NASA to operate jointly with Axiom after 2030', 'ไม่ได้กล่าวถึงการดำเนินงานร่วม'),
      11: s('bone density loss', 'bone density reduction', 'ความหนาแน่นของกระดูก'),
      12: s('life support systems', 'life-sustaining systems', 'ระบบสนับสนุนชีวิต'),
      13: s('maintain operational cooperation', 'working cooperation', 'ความร่วมมือในการปฏิบัติการ')
    }
  }
}
