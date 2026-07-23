// "งงกับย่อหน้านี้ อยากให้พี่ดอยช่วยอธิบาย" — Thai paragraph explanations for
// the "June 2026" and "Custom" reading banks. Same shape/quality bar as the
// hand-written seed example in readingParagraphExplanations.ts: walk through
// every clause in plain Thai, quote English exactly, end with a short
// "สรุปใจความ" line, and gloss the hardest words/phrases contextually.
import type { ReadingParagraphExplanation } from './readingParagraphExplanations'

export const READING_PARAGRAPH_EXPLANATIONS_JUNE2026_CUSTOM: Record<
  string,
  Record<number, ReadingParagraphExplanation>
> = {
  "how running shoes have changed": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้เล่าถึงตัวอย่างสมมติ (fictional — ผู้เขียนสร้างตัวละครขึ้นมาเพื่ออธิบายประเด็น ไม่ใช่คนจริง) นักวิ่งระยะไกลชาวอังกฤษชื่อ Clara Benson ในปี 2019 เธอชนะมาราธอนระดับนานาชาติรายการใหญ่เป็นครั้งแรกในชีวิต (her first major international marathon) หลังจากก่อนหน้านั้นหลายฤดูกาลเธอมีผลงานแบบ “promising but uneven” (ตีความได้ว่า => มีแวว มีศักยภาพ แต่ผลงานยังไม่สม่ำเสมอ บางทีก็ดี บางทีก็ไม่ดี) ประโยคที่สองบอกว่าชัยชนะครั้งนี้ทำให้นักวิจารณ์กีฬาหลายคนประหลาดใจ (surprised many commentators) เพราะไม่มีใครคาดคิดมาก่อน ประโยคสุดท้ายย้อนกลับไป 4 ปีก่อนหน้านั้น ตอนนั้น Benson ถูกมองว่าเป็นนักกีฬาที่มีความสามารถ (a talented athlete) พอจะแข่งกับนักวิ่งระดับหัวแถว (elite runners) ได้ แต่แทบไม่เคยมีท่าทีว่าจะเอาชนะพวกเขาได้ในรายการใหญ่ๆ (rarely threatened to beat them in the biggest races) พูดง่ายๆ คือเก่งแต่ยังไปไม่ถึงระดับแชมป์\n\nสรุปใจความ: ย่อหน้านี้เปิดเรื่องด้วยตัวอย่างสมมติของนักวิ่งที่จากเดิมเก่งแต่ไม่เคยชนะรายการใหญ่ กลายมาเป็นแชมป์มาราธอนได้ในปี 2019 ซึ่งปูทางให้ย่อหน้าถัดไปอธิบายว่า “อะไร” ที่ทำให้เธอพัฒนาขึ้นมาได้ขนาดนี้",
      vocab: [
        { term: "fictional", th: "สมมติขึ้นมา ไม่ใช่คนจริง ใช้เป็นตัวอย่างประกอบการอธิบาย" },
        { term: "promising but uneven performances", th: "มีแวว มีศักยภาพ แต่ผลงานยังไม่สม่ำเสมอ" },
        { term: "surprised many commentators", th: "ทำให้นักวิจารณ์กีฬาหลายคนตกใจ/ประหลาดใจ" },
        { term: "had been regarded as", th: "เคยถูกมองว่าเป็น" },
        { term: "rarely threatened to beat them", th: "แทบไม่เคยมีท่าทีว่าจะเอาชนะพวกเขาได้เลย" },
        { term: "the biggest races", th: "การแข่งขันรายการใหญ่ที่สุด" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าอะไรทำให้ Benson พัฒนาขึ้น (Several changes helped explain Benson’s improvement) การเปลี่ยนแปลงอย่างแรกเห็นได้ชัด (One was obvious): ในปี 2017 เธอเริ่มทำงานกับอดีตโค้ชโอลิมปิก (a former Olympic coach) ที่เปลี่ยนทั้งตารางฝึกซ้อม (training schedule) และกลยุทธ์การแข่งขัน (racing strategy) ของเธอ ส่วนการเปลี่ยนแปลงอย่างที่สองสังเกตเห็นได้ยากกว่ามาก (far less noticeable) หลายปีก่อนหน้านั้น Benson ใช้รองเท้าแบบดั้งเดิม (a traditional racing shoe) ที่พื้นบางและรองรับแรงกระแทกได้จำกัด (a thin sole and limited cushioning) แต่ในปี 2018 เธอเปลี่ยนมาใส่รองเท้าที่มีชั้นโฟมน้ำหนักเบาหนาขึ้น (a thicker layer of lightweight foam) และมีแผ่นโค้ง (a curved plate) ฝังอยู่ในพื้นกลางรองเท้า (embedded in the midsole) ประโยคสุดท้ายบอกว่าการเปลี่ยนแปลงนี้ (this alteration) แม้จะดูเล็กน้อยภายนอก (small in appearance) แต่ผลต่อ “running economy” ของเธอ (ตีความได้ว่า => ประสิทธิภาพการใช้พลังงานขณะวิ่ง) กลับมีนัยสำคัญมาก (significant)\n\nสรุปใจความ: การพัฒนาของ Benson มาจากสองสิ่งคือ โค้ชคนใหม่ที่ปรับการฝึกซ้อม กับรองเท้าที่เปลี่ยนไปแบบเงียบๆ (โฟมหนาขึ้น + แผ่นโค้งในพื้นรองเท้า) ซึ่งแม้ดูเล็กแต่ส่งผลใหญ่ต่อการวิ่งของเธอ",
      vocab: [
        { term: "former Olympic coach", th: "อดีตโค้ชที่เคยคุมนักกีฬาโอลิมปิก" },
        { term: "far less noticeable", th: "สังเกตเห็นได้ยากกว่ามาก" },
        { term: "a thin sole and limited cushioning", th: "พื้นรองเท้าบางและรองรับแรงกระแทกได้น้อย" },
        { term: "a curved plate embedded in the midsole", th: "แผ่นโค้งที่ฝังอยู่ในชั้นกลางของพื้นรองเท้า" },
        { term: "small in appearance", th: "ดูเล็กน้อยเมื่อมองจากภายนอก" },
        { term: "running economy", th: "ประสิทธิภาพการใช้พลังงานขณะวิ่ง — ยิ่งดี ยิ่งวิ่งเร็วโดยใช้แรงน้อยลง" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้บอกว่าสิ่งที่ Benson ทำเป็นเพียงตัวอย่างหนึ่ง (one example) ของทางเลือกมากมายที่นักวิ่งใช้ปรับรองเท้าของตัวเอง จากนั้นมีคำพูดอ้างอิงจาก Martin Vale ผู้เชี่ยวชาญด้านรองเท้าในเมือง Manchester ว่า “Elite athletes rarely race in shoes taken directly from a shop shelf” (ตีความได้ว่า => นักกีฬาระดับหัวแถวแทบไม่เคยใส่รองเท้าที่หยิบตรงจากชั้นวางในร้านไปแข่งเลย) เขาอธิบายต่อว่ารองเท้าของนักกีฬาเหล่านี้มักถูกดัดแปลง (adapted) ให้เข้ากับรูปเท้า (foot shape) สไตล์การวิ่ง (running style) และระยะทางการแข่งขัน (event distance) ของแต่ละคน และย้ำว่าในระดับสูงสุด แม้ความแตกต่างเล็กน้อยก็ยังสำคัญ (even a tiny difference can matter) ประโยคสุดท้ายสรุปว่า ด้วยเหตุนี้รองเท้าที่นักวิ่งชั้นนำสวมใส่จึงมักไม่เหมือนกับรุ่นที่ขายทั่วไป (the commercial versions) ให้ลูกค้าทั่วไป\n\nสรุปใจความ: ย่อหน้านี้ยืนยันว่ากรณีของ Benson ไม่ใช่เรื่องพิเศษ แต่เป็นเรื่องปกติของวงการวิ่งระดับสูง — รองเท้าแข่งของนักกีฬาชั้นนำมักถูกปรับแต่งเฉพาะบุคคล ไม่ใช่ของสำเร็จรูปที่ซื้อได้ทั่วไป",
      vocab: [
        { term: "specialist shoe technician", th: "ผู้เชี่ยวชาญด้านเทคนิครองเท้าโดยเฉพาะ" },
        { term: "taken directly from a shop shelf", th: "หยิบตรงจากชั้นวางในร้าน (ไม่ได้ปรับแต่งอะไรเลย)" },
        { term: "adapted to their foot shape, running style and event distance", th: "ถูกปรับให้เข้ากับรูปเท้า สไตล์การวิ่ง และระยะทางแข่งของแต่ละคน" },
        { term: "even a tiny difference can matter", th: "แม้แต่ความแตกต่างเล็กน้อยก็ยังส่งผลได้" },
        { term: "the commercial versions", th: "รุ่นที่วางขายทั่วไปสำหรับลูกค้าทั่วไป" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างพี่น้องนักวิ่งระยะกลางชาวอเมริกัน Daniel และ Marcus Rahman ที่มีชื่อเสียงเรื่องความละเอียดเรื่องรองเท้า (exact footwear requirements) มีคำพูดของพวกเขาว่า “We are extremely specific about our racing shoes” (ตีความได้ว่า => เราจู้จี้จุกจิกกับรองเท้าแข่งของเรามาก) พวกเขาอธิบายว่ารองเท้าถูกผลิตโดยสปอนเซอร์ก่อน (first produced by our sponsor) แล้วจึงถูกส่งไปยังเวิร์กช็อป (sent to a workshop) เพื่อตรวจสอบขนาด (fit) ความแข็งของพื้นรองเท้า (sole stiffness) และวัสดุส่วนบน (upper material) อีกครั้ง นอกจากนี้พวกเขายังทดลองรูปทรงพื้นรองเท้าที่ต่างกัน (different sole shapes) และสีย้อม (dye) ที่ใช้บนส่วนบนของรองเท้าด้วย ประโยคสุดท้ายบอกว่ารองเท้าแข่งปัจจุบันของพวกเขาหนักกว่ารุ่นทั่วไปของนักกีฬาหัวแถวเล็กน้อย (slightly heavier than the average elite model) และมีแผ่นที่แข็งกว่าบริเวณปลายเท้า (a firmer plate beneath the forefoot)\n\nสรุปใจความ: ตัวอย่างพี่น้อง Rahman แสดงให้เห็นว่าการปรับแต่งรองเท้าระดับสูงไม่ได้หยุดแค่รูปทรงพื้นรองเท้า แต่ลงลึกไปถึงวัสดุ สี น้ำหนัก และความแข็งของแต่ละจุดบนรองเท้า",
      vocab: [
        { term: "exact footwear requirements", th: "ความต้องการเรื่องรองเท้าที่ละเอียดมาก เจาะจงมาก" },
        { term: "extremely specific about our racing shoes", th: "จู้จี้จุกจิกกับรองเท้าแข่งของเรามาก" },
        { term: "sole stiffness and upper material", th: "ความแข็งของพื้นรองเท้าและวัสดุส่วนบนของรองเท้า" },
        { term: "slightly heavier than the average elite model", th: "หนักกว่ารองเท้ารุ่นทั่วไปของนักกีฬาหัวแถวเล็กน้อย" },
        { term: "a firmer plate beneath the forefoot", th: "แผ่นที่แข็งกว่าอยู่ใต้บริเวณปลายเท้า" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้อธิบายเหตุผลหลักที่นักวิ่งยอมปรับแต่งรองเท้าแบบละเอียดขนาดนี้: ความแตกต่างระหว่างชนะกับแพ้ในวงการวิ่งระดับสูงวัดกันเป็นวินาที หรือแม้แต่เศษเสี้ยววินาที (seconds, or even fractions of a second) ประโยคสุดท้ายสรุปว่า เพราะเหตุนี้นักวิ่งและทีมสนับสนุน (support teams) จึงยินดีมากขึ้นเรื่อยๆ ที่จะทดลองปรับแต่งแบบแปลกๆ (unusual adjustments) หากมันอาจให้ความได้เปรียบในการแข่งขัน (a competitive advantage)\n\nสรุปใจความ: ย่อหน้าสั้นๆ นี้สรุปเหตุผลของทั้งเรื่อง — เมื่อชัยชนะห่างจากความพ่ายแพ้แค่เสี้ยววินาที การปรับแต่งรองเท้าเล็กๆ น้อยๆ จึงกลายเป็นเรื่องคุ้มค่าที่จะลอง",
      vocab: [
        { term: "the main reason", th: "เหตุผลหลัก" },
        { term: "seconds, or even fractions of a second", th: "วินาที หรือแม้แต่เศษเสี้ยวของวินาที" },
        { term: "support teams", th: "ทีมงานที่คอยสนับสนุนนักกีฬา (โค้ช ช่างรองเท้า ฯลฯ)" },
        { term: "increasingly willing to test unusual adjustments", th: "ยินดีมากขึ้นเรื่อยๆ ที่จะทดลองปรับแต่งแบบแปลกๆ" },
        { term: "a competitive advantage", th: "ความได้เปรียบในการแข่งขัน" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้เล่าประวัติศาสตร์ของการปรับแต่งรองเท้า (footwear modification) ว่ามีมานานกว่าที่หลายคนคิด (a longer history than many people realise) ในทศวรรษ 1960s นักกรีฑาบางคนเริ่มเปลี่ยนการจัดเรียงหมุดโลหะ (metal pins) ในรองเท้าสตั๊ด (spikes) เพื่อเพิ่มการยึดเกาะพื้น (grip) บนพื้นผิวต่างๆ ต่อมาในทศวรรษ 1980s มีรองเท้าทดลองบางรุ่นที่มีโครงสร้างคล้ายสปริง (spring-like structures) อยู่ใต้ส้นเท้า มีรุ่นหนึ่งที่แรงสะท้อนกลับ (recoil) มากเกินไปจนกรรมการสั่งห้ามใช้แข่งขัน (officials banned it) โดยให้เหตุผลว่ามันให้ความได้เปรียบที่ไม่เป็นธรรม (an artificial advantage) ประโยคสุดท้ายบอกว่านับตั้งแต่นั้นมา ผู้ออกกฎ (rule makers) ก็จับตาดูพัฒนาการของเทคโนโลยีรองเท้าอย่างใกล้ชิด\n\nสรุปใจความ: การปรับแต่งรองเท้าไม่ใช่เรื่องใหม่ — มีมาตั้งแต่ยุค 1960s-1980s แล้ว และเคยมีบางกรณีที่ถูกแบนเพราะให้ความได้เปรียบมากเกินไป ซึ่งเป็นจุดเริ่มต้นที่ทำให้หน่วยงานกำกับกติกาต้องคอยจับตาดูเทคโนโลยีใหม่ๆ ตลอดมา",
      vocab: [
        { term: "a longer history than many people realise", th: "มีประวัติศาสตร์ยาวนานกว่าที่คนส่วนใหญ่คิด" },
        { term: "altering the arrangement of metal pins", th: "เปลี่ยนการจัดเรียงหมุดโลหะ" },
        { term: "spring-like structures under the heel", th: "โครงสร้างคล้ายสปริงอยู่ใต้ส้นเท้า" },
        { term: "so much recoil", th: "แรงสะท้อนกลับมากเกินไป" },
        { term: "officials banned it from competition", th: "กรรมการสั่งห้ามใช้ในการแข่งขัน" },
        { term: "an artificial advantage", th: "ความได้เปรียบที่ไม่เป็นธรรมชาติ/ไม่เป็นธรรม" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้านี้บอกว่าปัจจุบันโค้ชหลายคนมองว่าการปรับแต่งรองเท้า (shoe adjustment) สำคัญพอๆ กับโภชนาการหรือการฝึกซ้อม (as important as nutrition or training) จากนั้นแบ่งการปรับแต่งออกเป็นสองประเภทหลัก (two main categories): การเปลี่ยนส่วนบนของรองเท้า (changes to the upper part) กับการเปลี่ยนพื้นรองเท้า (changes to the sole) โดยพื้นรองเท้ามักสำคัญกว่า (the more important area) เพราะมีผลต่อการรองรับแรงกระแทก (cushioning) ความมั่นคง (stability) และการคืนพลังงาน (energy return) นักกีฬาอาจเปลี่ยนรองเท้าตามระยะทางการแข่ง พื้นผิวสนาม และสภาพอากาศ ประโยคสุดท้ายยกตัวอย่าง: อากาศร้อนอาจทำให้โฟมบางชนิดนิ่มขึ้น (make certain foams softer) ในขณะที่สภาพเปียกอาจต้องการลวดลายพื้นรองเท้าด้านนอก (outsole pattern) ที่ต่างออกไป\n\nสรุปใจความ: ย่อหน้านี้จัดระบบความคิดให้ผู้อ่านเข้าใจว่าการปรับแต่งรองเท้าแบ่งเป็นสองส่วนหลัก และพื้นรองเท้าคือส่วนที่สำคัญที่สุด เพราะต้องปรับให้เข้ากับทั้งระยะทาง สนาม และสภาพอากาศ",
      vocab: [
        { term: "as important as nutrition or training", th: "สำคัญพอๆ กับเรื่องโภชนาการหรือการฝึกซ้อม" },
        { term: "cushioning, stability and energy return", th: "การรองรับแรงกระแทก ความมั่นคง และการคืนพลังงานให้ผู้วิ่ง" },
        { term: "make certain foams softer", th: "ทำให้โฟมบางชนิดนิ่มลง" },
        { term: "a different outsole pattern", th: "ลวดลายพื้นรองเท้าด้านนอกที่แตกต่างออกไป" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้เล่าประวัติวัสดุที่ใช้ทำรองเท้าวิ่ง ในยุคแรกของการวิ่งสมัยใหม่ รองเท้าส่วนใหญ่ทำจากหนัง (leather) ซึ่งแข็งแรงแต่ดูดซับน้ำและหนักขึ้นเมื่อฝนตก (absorbed water and became heavy in rain) ต่อมาวัสดุสังเคราะห์ (synthetic materials) เป็นที่นิยมมากขึ้นเพราะเบากว่า ถูกกว่า และขึ้นรูปได้ง่ายกว่า ตาข่ายไนลอน (nylon mesh) ช่วยให้ระบายอากาศได้ดีขึ้น ส่วนแผ่นเทอร์โมพลาสติก (thermoplastic overlays) ช่วยพยุงเท้าโดยไม่เพิ่มน้ำหนักมากนัก ประโยคสุดท้ายบอกว่าเมื่อไม่นานมานี้ โฟมขั้นสูง (advanced foams) กลายเป็นหัวใจของการออกแบบรองเท้าแข่ง โดยถูกออกแบบให้บีบตัวเมื่อเท้าลงพื้น (compress when the runner lands) แล้วขยายตัวอย่างรวดเร็วเมื่อเท้ายกออกจากพื้น (expand quickly as the foot leaves the ground)\n\nสรุปใจความ: วัสดุรองเท้าวิ่งพัฒนาเป็นลำดับ จากหนัง สู่วัสดุสังเคราะห์ (ไนลอน เทอร์โมพลาสติก) จนถึงโฟมขั้นสูงในปัจจุบันที่ออกแบบมาให้ทำงานร่วมกับจังหวะการก้าวเท้าโดยเฉพาะ",
      vocab: [
        { term: "absorbed water and became heavy in rain", th: "ดูดซับน้ำและหนักขึ้นเมื่อโดนฝน" },
        { term: "synthetic materials", th: "วัสดุสังเคราะห์" },
        { term: "nylon mesh allowed better ventilation", th: "ตาข่ายไนลอนช่วยให้ระบายอากาศได้ดีขึ้น" },
        { term: "thermoplastic overlays", th: "แผ่นเทอร์โมพลาสติกที่เสริมช่วยพยุงรูปทรงเท้า" },
        { term: "compress when the runner lands", th: "บีบตัว/ยุบตัวเมื่อผู้วิ่งเหยียบลงพื้น" },
        { term: "expand quickly as the foot leaves the ground", th: "ขยายตัวคืนรูปอย่างรวดเร็วเมื่อเท้ายกออกจากพื้น" }
      ]
    },
    8: {
      explanationTh:
        "ย่อหน้านี้เจาะลึกเรื่องแผ่นคาร์บอน (carbon plates) ซึ่งเป็นพัฒนาการล่าสุดที่ถูกพูดถึงมากที่สุด (attracted the most discussion) แผ่นเหล่านี้มักถูกวางไว้ในพื้นชั้นกลางของรองเท้า (placed inside the midsole) และถูกออกแบบมาเพื่อนำเท้าให้เคลื่อนไปข้างหน้าตอนเท้าดันพื้น (guide the foot forward during toe-off) มีการทดสอบ (Tests) ชี้ว่า เมื่อใช้ร่วมกับโฟมที่เหมาะสม (combined with suitable foam) แผ่นโค้งสามารถลดพลังงานที่นักวิ่งใช้ในความเร็วหนึ่งๆ ได้ (reduce the amount of energy a runner uses at a given speed) ประโยคสุดท้ายสรุปว่ารองเท้าแข่งสมัยใหม่จึงไม่ได้เปลี่ยนแค่ตัวอุปกรณ์ แต่เปลี่ยนสไตล์การแข่งขันด้วย (the style of racing itself)\n\nสรุปใจความ: แผ่นคาร์บอนคือนวัตกรรมที่มีอิทธิพลมากที่สุดในยุคนี้ เพราะช่วยลดพลังงานที่ใช้ในการวิ่งและเปลี่ยนวิธีที่นักวิ่งแข่งขันกันไปเลย",
      vocab: [
        { term: "attracted the most discussion", th: "ถูกพูดถึง/ถกเถียงกันมากที่สุด" },
        { term: "guide the foot forward during toe-off", th: "นำเท้าให้เคลื่อนไปข้างหน้าตอนปลายเท้าดันพื้นออก" },
        { term: "combined with suitable foam", th: "เมื่อใช้ร่วมกับโฟมที่เหมาะสม" },
        { term: "reduce the amount of energy a runner uses at a given speed", th: "ลดปริมาณพลังงานที่นักวิ่งต้องใช้ในความเร็วหนึ่งๆ" },
        { term: "the style of racing itself", th: "รูปแบบ/สไตล์การแข่งขันเอง ไม่ใช่แค่อุปกรณ์" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างนักวิ่งที่ปรับแต่งรองเท้าไปไกลกว่ามาตรฐานทั่วไป (go beyond standard adjustments) นักวิ่งระยะสั้นชาวสเปน Mateo Ruiz เคยให้ใส่หมุดเหล็กเพิ่ม (three additional steel pins) บริเวณหน้ารองเท้าแต่ละข้าง เพราะเชื่อว่ามันช่วยให้เขาออกตัวจากบล็อกสตาร์ท (his drive from the starting blocks) ได้ดีขึ้น โค้ชของเขาเชื่อว่าการเปลี่ยนแปลงนี้มีส่วนทำให้เขาเร่งความเร็วได้ทรงพลังผิดปกติ (his unusually powerful acceleration) ส่วนนักวิ่งบางคนก็ให้ความสำคัญกับความสบาย (comfort) มากกว่าความเร็ว เช่น นักวิ่งมาราธอนหญิงชาวโปรตุเกส Sofia Almeida เปลี่ยนเชือกรองเท้าเดิมเป็นเชือกยางยืดที่บางกว่า (thinner elastic ones) เพราะเชือกแบบมาตรฐานสร้างแรงกดทับบนหลังเท้าของเธอ (created pressure across the top of her foot)\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าการปรับแต่งไม่ได้มีเป้าหมายเดียวเสมอไป — บางคนปรับเพื่อความเร็ว (เพิ่มหมุด) บางคนปรับเพื่อความสบาย (เปลี่ยนเชือกผูกรองเท้า)",
      vocab: [
        { term: "go beyond standard adjustments", th: "ปรับแต่งไปไกลกว่ามาตรฐานทั่วไป" },
        { term: "his drive from the starting blocks", th: "การออกตัวพุ่งจากบล็อกสตาร์ท" },
        { term: "his unusually powerful acceleration", th: "การเร่งความเร็วของเขาที่ทรงพลังผิดปกติ" },
        { term: "focus on comfort rather than speed", th: "ให้ความสำคัญกับความสบายมากกว่าความเร็ว" },
        { term: "created pressure across the top of her foot", th: "สร้างแรงกดทับบนหลังเท้าของเธอ" }
      ]
    },
    10: {
      explanationTh:
        "ย่อหน้าปิดท้ายสรุปว่า การปรับแต่งรองเท้าวิ่ง (running-shoe customisation) ได้ยกระดับมาตรฐานผลงาน (raised performance standards) ในแบบที่ยากจะจินตนาการได้ (would have been difficult to imagine) เมื่อเทียบกับยุคที่นักกีฬาแข่งด้วยรองเท้าหนังหนักๆ และพื้นยางธรรมดา (heavy leather shoes with simple rubber soles) ประโยคสุดท้ายมองไปข้างหน้าว่า เมื่อวัสดุยังคงพัฒนาต่อไป (as materials continue to develop) การเปลี่ยนแปลงเพิ่มเติมก็แทบจะแน่นอนว่าจะเกิดขึ้น (further changes are almost certain) แม้ว่าหน่วยงานกำกับกีฬา (sports authorities) จะยังคงถกเถียงกันต่อไปว่าเส้นแบ่งอยู่ตรงไหน ระหว่างนวัตกรรมที่มีประโยชน์ (useful innovation) กับความช่วยเหลือที่ไม่เป็นธรรม (unfair assistance)\n\nสรุปใจความ: บทความปิดท้ายด้วยการมองไปข้างหน้า — เทคโนโลยีรองเท้าจะพัฒนาต่อไปเรื่อยๆ แต่คำถามที่ยังไม่มีคำตอบชัดเจนคือ นวัตกรรมแบบไหนถือว่า “ยุติธรรม” และแบบไหนถือว่า “เอาเปรียบเกินไป”",
      vocab: [
        { term: "raised performance standards", th: "ยกระดับมาตรฐานผลงานการแข่งขันให้สูงขึ้น" },
        { term: "would have been difficult to imagine", th: "เป็นสิ่งที่ยากจะจินตนาการได้ (ในสมัยก่อน)" },
        { term: "heavy leather shoes with simple rubber soles", th: "รองเท้าหนังหนักๆ ที่มีพื้นยางธรรมดา" },
        { term: "further changes are almost certain", th: "การเปลี่ยนแปลงเพิ่มเติมแทบจะแน่นอนว่าจะเกิดขึ้น" },
        { term: "where useful innovation ends and unfair assistance begins", th: "เส้นแบ่งระหว่างนวัตกรรมที่มีประโยชน์กับความได้เปรียบที่ไม่เป็นธรรม" }
      ]
    }
  },
  "the raiders of the ancient trade routes": {
    0: {
      explanationTh:
        "ประโยคเดียวนี้เป็นประโยคเกริ่นนำของบทความ (คั่นก่อนเข้าสู่ย่อหน้า A-G ที่มีตัวอักษรกำกับ) บอกกรอบเวลาและสถานที่ของเรื่องทั้งหมด: ในช่วงศตวรรษแรกๆ ก่อนคริสตกาลและหลังคริสตกาล (the first centuries BCE and CE — ตีความได้ว่า => ช่วงเวลาประมาณร้อยกว่าปีก่อน ค.ศ. จนถึงร้อยกว่าปีหลัง ค.ศ.) มีกลุ่มโจร (raiders) คอยคุกคาม (threatened) กองคาราวาน (caravans) ที่เดินทางข้ามทะเลทรายและภูเขาในเอเชียกลาง (the deserts and mountains of Central Asia)\n\nสรุปใจความ: ประโยคนี้ตั้งฉากเรื่องทั้งหมดไว้ล่วงหน้า — เอเชียกลางในยุคโบราณ ที่กองคาราวานการค้าต้องเผชิญกับการปล้นจากกลุ่มโจรตลอดเส้นทาง ซึ่งย่อหน้า A-G ที่ตามมาจะขยายความเรื่องนี้ทีละประเด็น",
      vocab: [
        { term: "raiders", th: "กลุ่มโจร/ผู้บุกปล้น" },
        { term: "threatened caravans", th: "คุกคามกองคาราวาน (ขบวนพ่อค้าที่เดินทางไปด้วยกัน)" },
        { term: "the first centuries BCE and CE", th: "ช่วงศตวรรษแรกๆ ก่อนและหลังคริสตกาล" },
        { term: "Central Asia", th: "ภูมิภาคเอเชียกลาง" }
      ]
    },
    1: {
      explanationTh:
        "ตัวอักษร “A” ตรงนี้ไม่ใช่เนื้อหาให้อ่านนะครับ แต่เป็นป้ายชื่อย่อหน้า (a paragraph label) ที่บอกตำแหน่งของย่อหน้า A ไว้สำหรับโจทย์แบบจับคู่ข้อมูล/หัวข้อ (เช่น Matching Headings หรือ Which paragraph contains…) เนื้อหาจริงของย่อหน้า A อยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “A. When people imagine…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: นี่เป็นเพียงตัวบอกตำแหน่งย่อหน้า ไม่มีเนื้อหาให้อธิบายเพิ่มเติม"
    },
    2: {
      explanationTh:
        "ย่อหน้า A เริ่มด้วยภาพที่คนทั่วไปมักจินตนาการถึงเส้นทางการค้าโบราณระหว่างตะวันออกกับตะวันตก (the ancient trade routes between East and West) คือขบวนอูฐที่สงบสุข (peaceful caravans of camels) บรรทุกผ้าไหม เครื่องเทศ และอัญมณีล้ำค่า (silk, spices and precious stones) ข้ามทะเลทรายอันเงียบสงบ (a silent desert)\n\nแต่ (Yet) ผู้เขียนบอกว่าตลอดยุคโบราณ (for much of antiquity) เส้นทางเหล่านี้ไม่ได้ปลอดภัยเลย (far from safe) กลุ่มโจร (Raiders) โจมตีพ่อค้า ขโมยสัตว์และสินค้า (stole animals and goods) แล้วหายลับไปในพื้นที่ที่กองทัพเข้าถึงยาก (regions that armies found difficult to enter)\n\nแม้ว่ารัฐโบราณหลายแห่งจะมีอำนาจมาก (Despite the power of several ancient states) การปล้น (raiding) ก็ยังคงเป็นปัญหาเรื้อรัง (a persistent problem) มานานหลายศตวรรษ ประโยคสุดท้ายบอกว่า จนกระทั่งการโจมตีเริ่มคุกคามรายได้และอำนาจทางการเมือง (threaten the income and political authority) ของจักรวรรดิใหญ่แห่งหนึ่ง ผู้ปกครองจึงยอมจัดตั้งกองทัพขนาดใหญ่ (organise a large campaign) เพื่อปราบโจร (suppress the raiders) และรักษาความปลอดภัยของเส้นทาง (secure the roads)\n\nสรุปใจความ: ย่อหน้า A เปิดเรื่องด้วยการหักล้างภาพจำที่สวยงามของเส้นทางสายไหม แล้วชี้ว่าความจริงมันอันตรายและวุ่นวายมานานหลายร้อยปี จนจักรวรรดิใหญ่รู้สึกเสียผลประโยชน์จริงๆ จึงลงมือปราบปราม",
      vocab: [
        { term: "peaceful caravans of camels", th: "ขบวนอูฐที่ดูสงบสุข (ภาพจำที่คนทั่วไปมีต่อเส้นทางการค้าโบราณ)" },
        { term: "far from safe", th: "ไม่ปลอดภัยเลย ตรงข้ามกับภาพที่คนจินตนาการ" },
        { term: "regions that armies found difficult to enter", th: "พื้นที่ที่กองทัพเข้าไปปราบปรามได้ยาก" },
        { term: "a persistent problem", th: "ปัญหาที่เกิดขึ้นซ้ำๆ ต่อเนื่องมานาน แก้ไม่หาย" },
        { term: "threaten the income and political authority", th: "คุกคามทั้งรายได้และอำนาจทางการเมือง" },
        { term: "organise a large campaign", th: "จัดตั้ง/ระดมกองทัพขนาดใหญ่เพื่อทำภารกิจหนึ่ง" }
      ]
    },
    3: {
      explanationTh:
        "เช่นเดียวกับ “A” ตัวอักษร “B” นี้เป็นแค่ป้ายบอกตำแหน่งย่อหน้า B ไม่ใช่เนื้อหา เนื้อหาจริงของย่อหน้า B อยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “B. The geography of Central Asia…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    4: {
      explanationTh:
        "ย่อหน้า B อธิบายว่าภูมิศาสตร์ของเอเชียกลาง (The geography of Central Asia) ให้ข้อได้เปรียบมากมายแก่กลุ่มโจร พื้นที่ส่วนใหญ่เป็นทะเลทราย ภูเขา และหุบเขาแคบๆ (deserts, mountains and narrow valleys) การทำเกษตรทำได้แค่ในบางโอเอซิส (oases) แต่หลายชุมชนพึ่งพาการเลี้ยงสัตว์ การล่าสัตว์ และการค้า (herding, hunting and trade) มากกว่าการเกษตร คนกลุ่มนี้มีความรู้เรื่องบ่อน้ำ เส้นทางตามฤดูกาล และช่องเขาลับ (wells, seasonal tracks and hidden passes) เป็นอย่างดี\n\nในทางตรงกันข้าม (by contrast) กองคาราวานต้องเดินตามเส้นทางที่หาน้ำได้เท่านั้น ก่อนที่จะมีการทำแผนที่และการเดินทางระยะไกลที่ดีขึ้น (improved mapping and long-distance navigation) พ่อค้าส่วนใหญ่ไม่สามารถข้ามทะเลทรายที่ไม่รู้จักได้ตามใจชอบ พวกเขาจึงถูกบังคับให้อยู่ใกล้บ่อน้ำและโอเอซิสที่รู้จักกันดี (established wells and oases) ซึ่งทำให้การเคลื่อนไหวของพวกเขาคาดเดาได้ง่าย (predictable) ประโยคสุดท้ายบอกว่า หากทหารถูกส่งไปตามล่าโจร ความรู้เกี่ยวกับพื้นที่ท้องถิ่น (local knowledge) ก็ช่วยให้โจรหนีรอดจากการถูกจับได้ (escape capture)\n\nสรุปใจความ: ภูมิประเทศที่ซับซ้อนของเอเชียกลางเป็นทั้งอาวุธของโจร (รู้เส้นทางลับ) และกับดักของพ่อค้า (ต้องเดินตามเส้นทางที่คาดเดาได้) ทำให้โจรได้เปรียบทั้งในการโจมตีและการหลบหนี",
      vocab: [
        { term: "deserts, mountains and narrow valleys", th: "ทะเลทราย ภูเขา และหุบเขาแคบๆ" },
        { term: "herding, hunting and trade", th: "การเลี้ยงสัตว์ การล่าสัตว์ และการค้าขาย" },
        { term: "wells, seasonal tracks and hidden passes", th: "บ่อน้ำ เส้นทางตามฤดูกาล และช่องเขาลับ" },
        { term: "improved mapping and long-distance navigation", th: "การทำแผนที่และการเดินทางระยะไกลที่พัฒนาขึ้น" },
        { term: "which made their movements predictable", th: "ซึ่งทำให้การเคลื่อนไหวของพวกเขาคาดเดาได้ง่าย" },
        { term: "local knowledge helped them escape capture", th: "ความรู้พื้นที่ท้องถิ่นช่วยให้พวกเขาหนีรอดจากการถูกจับได้" }
      ]
    },
    5: {
      explanationTh:
        "ตัวอักษร “C” นี้เป็นป้ายบอกตำแหน่งย่อหน้า C ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “C. It should also be remembered…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้า C ชวนให้ผู้อ่านจำไว้ (It should also be remembered) ว่ารัฐบาลโบราณไม่ได้มองโจรเป็นศัตรูเสมอไป (did not always regard raiders as enemies) ในช่วงสงคราม ผู้ปกครองบางครั้งจ้างพวกเขาเป็นหน่วยสอดแนม มัคคุเทศก์ หรือทหารม้า (scouts, guides or mounted fighters) เพราะความสามารถในการเคลื่อนที่อย่างรวดเร็วผ่านภูมิประเทศที่ยากลำบาก (move quickly through difficult country) ทำให้พวกเขามีประโยชน์ในช่วงแรกของการทำศึก (the first stage of a campaign)\n\nประโยคถัดมาบอกว่า เมืองโอเอซิสบางแห่งถึงกับยอมให้กลุ่มโจรพักอาศัยอยู่ใกล้ๆ (allowed raiding groups to stay nearby) เพื่อแลกกับ (In return) การที่โจรนำสัตว์และสินค้าที่ปล้นมา (stolen animals and goods) มาขายในตลาดท้องถิ่น ซึ่งช่วยเพิ่มการค้าและสร้างรายได้พิเศษให้กับเมือง (increased trade and provided extra income)\n\nสรุปใจความ: ย่อหน้านี้พลิกมุมมอง — โจรไม่ได้เป็นแค่ผู้ร้ายเสมอไป บางครั้งรัฐและเมืองต่างๆ ก็ได้ประโยชน์จากพวกเขาทั้งในสงครามและการค้า",
      vocab: [
        { term: "did not always regard raiders as enemies", th: "ไม่ได้มองว่าโจรเป็นศัตรูเสมอไป" },
        { term: "scouts, guides or mounted fighters", th: "หน่วยสอดแนม มัคคุเทศก์ หรือทหารม้า" },
        { term: "move quickly through difficult country", th: "เคลื่อนที่ได้รวดเร็วผ่านภูมิประเทศที่ยากลำบาก" },
        { term: "allowed raiding groups to stay nearby", th: "อนุญาตให้กลุ่มโจรพักอาศัยอยู่ใกล้เมือง" },
        { term: "increased trade and provided extra income", th: "เพิ่มการค้าขายและสร้างรายได้พิเศษให้กับเมือง" }
      ]
    },
    7: {
      explanationTh:
        "ตัวอักษร “D” นี้เป็นป้ายบอกตำแหน่งย่อหน้า D ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “D. One of the earliest written records…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    8: {
      explanationTh:
        "ย่อหน้า D เล่าถึงหลักฐานลายลักษณ์อักษรที่เก่าแก่ที่สุดชิ้นหนึ่ง (One of the earliest written records) ที่กล่าวถึงกลุ่มโจรที่มีชื่อเรียกเฉพาะ (a named raiding group) หลักฐานนี้ปรากฏอยู่ในจดหมายโต้ตอบ (letters exchanged) ระหว่างจักรพรรดิตะวันออกกับผู้ปกครองรัฐโอเอซิส Yutian\n\nจักรพรรดิร้องเรียนว่ากลุ่มที่รู้จักกันในชื่อ “the Black Ridge Riders” โจมตีกองคาราวานที่ขนสินค้าภาษี (caravans carrying tax goods) และยังกล่าวหาว่า Yutian แอบให้การสนับสนุนกลุ่มโจรนี้ด้วย (secretly supported them)\n\nส่วนผู้ปกครอง Yutian ปฏิเสธว่าไม่มีส่วนเกี่ยวข้องใดๆ (denied any involvement) และยืนยันว่าไม่มีข้าราชการคนใดของเขาช่วยเหลือโจรเลย เขาสัญญาว่าจะลงโทษราษฎรคนใดก็ตามที่พิสูจน์ได้ว่ามีความผิดฐานช่วยเหลือพวกโจร (could be proved guilty of assisting them)\n\nสรุปใจความ: ย่อหน้านี้เป็นตัวอย่างหลักฐานทางประวัติศาสตร์จริงชิ้นแรกๆ ที่แสดงความตึงเครียดระหว่างจักรวรรดิใหญ่กับรัฐเล็กที่ถูกกล่าวหาว่าแอบสนับสนุนโจร",
      vocab: [
        { term: "One of the earliest written records", th: "หลักฐานลายลักษณ์อักษรที่เก่าแก่ที่สุดชิ้นหนึ่ง" },
        { term: "letters exchanged between", th: "จดหมายที่โต้ตอบกันไปมาระหว่าง" },
        { term: "caravans carrying tax goods", th: "กองคาราวานที่ขนสินค้า/ทรัพย์สินภาษี" },
        { term: "secretly supported them", th: "แอบให้การสนับสนุนพวกเขา" },
        { term: "denied any involvement", th: "ปฏิเสธว่าไม่มีส่วนเกี่ยวข้องใดๆ" },
        { term: "could be proved guilty of assisting them", th: "ที่สามารถพิสูจน์ได้ว่ามีความผิดฐานช่วยเหลือพวกเขา" }
      ]
    },
    9: {
      explanationTh:
        "ตัวอักษร “E” นี้เป็นป้ายบอกตำแหน่งย่อหน้า E ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “E. Attitudes towards raiding…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    10: {
      explanationTh:
        "ย่อหน้า E ชี้ว่าทัศนคติต่อการปล้น (Attitudes towards raiding) ไม่เหมือนกันในทุกที่ ในรัฐที่ตั้งถิ่นฐานมั่นคง (settled states) โจรถูกประณามว่าเป็นอาชญากรที่ทำลายการค้า (condemned as criminals who damaged trade) แต่ (however) ในชุมชนทะเลทรายบางแห่ง การปล้นที่สำเร็จ (successful raids) กลับได้รับการยกย่องว่าเป็นเครื่องพิสูจน์ความกล้าหาญและฝีมือ (proof of courage and skill)\n\nมีบทกวีโบราณจากภูมิภาคนี้หลายบทที่สรรเสริญนักขี่ม้าที่ข้ามดินแดนอันตราย ยึดกองคาราวานที่ร่ำรวย และกลับมาอย่างมีเกียรติ (returned with honour)\n\nประโยคสุดท้ายเพิ่มมุมที่น่าประหลาดใจ: แม้แต่ข้าราชการเองก็ไม่ได้บริสุทธิ์เสมอไป (were not always innocent) ตามบันทึกประวัติศาสตร์ฉบับหลัง (one later chronicle) มีผู้ว่าราชการคนหนึ่งที่มีหน้าที่ปกป้องเส้นทางการค้า กลับออกนอกเส้นทางที่ตนรับผิดชอบ (left his official route) เพื่อไปปล้นกองคาราวานพ่อค้าเพื่อผลประโยชน์ส่วนตัว (for his own profit)\n\nสรุปใจความ: การปล้นในยุคนั้นไม่ได้ถูกมองว่าผิดเสมอไป — บางวัฒนธรรมยกย่องมันเป็นความกล้าหาญ และแม้แต่เจ้าหน้าที่รัฐเองก็ยังมีคนที่ปล้นเสียเอง",
      vocab: [
        { term: "condemned as criminals who damaged trade", th: "ถูกประณามว่าเป็นอาชญากรที่ทำลายการค้า" },
        { term: "proof of courage and skill", th: "เครื่องพิสูจน์ความกล้าหาญและฝีมือ" },
        { term: "returned with honour", th: "กลับมาอย่างมีเกียรติ" },
        { term: "were not always innocent", th: "ก็ไม่ได้บริสุทธิ์เสมอไป" },
        { term: "left his official route", th: "ออกนอกเส้นทางที่ตนมีหน้าที่รับผิดชอบ" },
        { term: "for his own profit", th: "เพื่อผลประโยชน์ส่วนตัวของเขาเอง" }
      ]
    },
    11: {
      explanationTh:
        "ตัวอักษร “F” นี้เป็นป้ายบอกตำแหน่งย่อหน้า F ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “F. The growing power of the eastern empire…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    12: {
      explanationTh:
        "ย่อหน้า F อธิบายว่าอำนาจที่เพิ่มขึ้นของจักรวรรดิตะวันออก (The growing power of the eastern empire) ในที่สุดก็ทำให้ปัญหานี้เพิกเฉยต่อไปไม่ได้อีกแล้ว (impossible to ignore)\n\nในตอนแรก รัฐได้ประโยชน์ทางอ้อมจากการปล้น (had benefited indirectly from raiding) สัตว์ที่ถูกปล้นมาถูกขายในตลาดชายแดน (border markets) และเชลยบางส่วนถูกบังคับใช้แรงงานในไร่นาและโครงการก่อสร้าง (forced to work on farms and building projects) แต่ข้อตกลงแบบนี้จะดำเนินต่อไปได้ก็ต่อเมื่อโจรไม่ไปยุ่งกับผลประโยชน์ของจักรวรรดิ (avoided imperial interests) เท่านั้น\n\nเมื่อโจรเริ่มโจมตีกองคาราวานที่ขนธัญพืชไปยังกองทหารชายแดน (grain to frontier garrisons) เจ้าหน้าที่ในราชสำนักจึงเรียกร้องให้ลงโทษ แต่ถึงอย่างนั้น (Even then) รัฐบาลก็ยังคงล่าช้าในการลงมือ (delayed action) โจรจึงยิ่งกล้ามากขึ้น (became bolder) และภายในศตวรรษที่ 1 หลัง ค.ศ. พวกเขาก็เริ่มลักพาตัวทูตสำคัญ (kidnapping important envoys) และเรียกค่าไถ่ (demanding a ransom) ก่อนจะปล่อยตัว\n\nสรุปใจความ: จักรวรรดิเคยได้ประโยชน์จากการปล้นทางอ้อม จึงเพิกเฉยมานาน จนโจรกล้าขึ้นเรื่อยๆ จนถึงขั้นลักพาตัวทูตเรียกค่าไถ่ ซึ่งเป็นจุดที่สถานการณ์เลวร้ายเกินจะเมิน",
      vocab: [
        { term: "impossible to ignore", th: "ไม่สามารถเพิกเฉยต่อไปได้อีก" },
        { term: "had benefited indirectly from raiding", th: "เคยได้ประโยชน์ทางอ้อมจากการปล้น" },
        { term: "avoided imperial interests", th: "ไม่ไปยุ่งกับผลประโยชน์ของจักรวรรดิ" },
        { term: "delayed action", th: "ล่าช้าในการลงมือทำอะไรสักอย่าง" },
        { term: "became bolder", th: "กล้ามากขึ้นเรื่อยๆ" },
        { term: "kidnapping important envoys", th: "ลักพาตัวทูต/ผู้แทนสำคัญ" }
      ]
    },
    13: {
      explanationTh:
        "ตัวอักษร “G” นี้เป็นป้ายบอกตำแหน่งย่อหน้า G ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “G. A new law finally gave General Han Rui…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    14: {
      explanationTh:
        "ย่อหน้า G เล่าถึงจุดเปลี่ยนสำคัญ: กฎหมายใหม่ (A new law) ในที่สุดก็มอบเงินทุนและอำนาจ (the money and authority) ให้แม่ทัพ Han Rui ใช้จัดการกับภัยคุกคามนี้\n\nแทนที่จะส่งกองทัพขนาดใหญ่เพียงกองเดียวเข้าไปในทะเลทราย (Rather than sending one large army) Han Rui เลือกแบ่งเส้นทางการค้าออกเป็น 12 เขต (twelve sectors) แต่ละเขตมีผู้บัญชาการ (a commander) กองทหารม้าขนาดเล็ก (a small cavalry force) และหน้าที่เฝ้าดูแลบ่อน้ำใกล้เคียง (guarding nearby wells) เมื่อเขตหนึ่งถูกกวาดล้างเรียบร้อย (had been cleared) ทหารในเขตนั้นก็เคลื่อนไปช่วยเขตถัดไป (moved on to assist the next)\n\nโจรบางคนถูกฆ่าตายในสนามรบ (killed in battle) แต่บางคนได้รับข้อเสนอที่ดิน (offered land) ในเขตชลประทาน (irrigated districts) ที่ห่างไกลจากเส้นทางคาราวาน ประโยคสุดท้ายสรุปว่านโยบายนี้ช่วยเปลี่ยนอดีตโจรให้กลายเป็นชาวนา (turn former raiders into farmers) และลดโอกาสที่พวกเขาจะกลับไปใช้ชีวิตแบบเดิม (return to their old way of life)\n\nสรุปใจความ: ทางแก้ปัญหาสุดท้ายไม่ใช่แค่การใช้กำลังปราบปราม แต่คือกลยุทธ์แบ่งเขตดูแลอย่างเป็นระบบ ผสมกับการให้โอกาสโจรกลับตัวเป็นชาวนา ซึ่งได้ผลในการยุติปัญหาการปล้นในระยะยาว",
      vocab: [
        { term: "gave General Han Rui the money and authority", th: "มอบเงินทุนและอำนาจให้แม่ทัพ Han Rui" },
        { term: "divided the trade route into twelve sectors", th: "แบ่งเส้นทางการค้าออกเป็น 12 เขต" },
        { term: "a small cavalry force", th: "กองทหารม้าขนาดเล็ก" },
        { term: "once one sector had been cleared", th: "เมื่อเขตหนึ่งถูกกวาดล้าง/ปราบปรามเรียบร้อยแล้ว" },
        { term: "offered land in irrigated districts", th: "ได้รับข้อเสนอที่ดินในเขตชลประทาน" },
        { term: "turn former raiders into farmers", th: "เปลี่ยนอดีตโจรให้กลายเป็นชาวนา" }
      ]
    }
  },
  "how racing bicycles have changed": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้เล่าถึงตัวอย่างสมมติ (fictional) นักปั่นจักรยานหญิงชาวฝรั่งเศสชื่อ Maya Laurent ในปี 2020 เธอชนะการแข่งขันจักรยานถนน (road race) ที่สำคัญที่สุดในอาชีพของเธอ (the most important road race of her career) ผู้เขียนบอกว่านี่คือความสำเร็จที่น่าทึ่ง (a remarkable achievement) ไม่ใช่แค่เพราะคุณภาพของคู่แข่งที่เธอเอาชนะได้ (the quality of the riders she defeated) แต่ยังเพราะว่าไม่กี่ปีก่อนหน้านั้นเธอถูกมองว่าเป็นแค่นักแข่งที่มีแวว (a promising competitor) ที่มักเข้าถึงรอบสุดท้ายของรายการใหญ่ๆ (reached the final stages of major races) แต่แทบไม่เคยดูมีท่าทีว่าจะชนะได้เลย (rarely looked likely to win them)\n\nสรุปใจความ: ย่อหน้านี้เปิดเรื่องด้วยตัวอย่างสมมติของนักปั่นที่จากเดิมเก่งแต่ไปไม่ถึงชัยชนะ กลายมาเป็นแชมป์รายการใหญ่ในปี 2020 ซึ่งปูทางให้ย่อหน้าถัดไปอธิบายว่าอะไรทำให้เธอพัฒนาขึ้นมาได้ขนาดนี้",
      vocab: [
        { term: "the most important road race of her career", th: "การแข่งขันจักรยานถนนที่สำคัญที่สุดในอาชีพของเธอ" },
        { term: "a remarkable achievement", th: "ความสำเร็จที่น่าทึ่ง/น่าประทับใจ" },
        { term: "a promising competitor", th: "นักแข่งที่มีแวว มีศักยภาพ" },
        { term: "reached the final stages of major races", th: "เข้าถึงรอบสุดท้ายของรายการแข่งใหญ่ๆ" },
        { term: "rarely looked likely to win them", th: "แทบไม่เคยดูมีท่าทีว่าจะชนะได้เลย" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าอะไรทำให้ Laurent พัฒนาขึ้น (Several changes helped explain Laurent’s improvement) การเปลี่ยนแปลงอย่างแรกเห็นได้ชัด (One was obvious): ในปี 2017 เธอเริ่มทำงานกับอดีตแชมป์โลก (a former world champion) ที่ออกแบบโปรแกรมฝึกซ้อมของเธอใหม่ (redesigned her training programme) และสอนให้เธอสงวนพลังงาน (conserve energy) ได้อย่างมีประสิทธิภาพมากขึ้นระหว่างการไต่เขาระยะยาว (during long climbs)\n\nการเปลี่ยนแปลงอย่างที่สองสังเกตเห็นได้ยากกว่ามาก (much less visible) ตลอดอาชีพการงานส่วนใหญ่ของเธอ Laurent ใช้ยางแบบดั้งเดิม (traditional clincher tyres) ที่ต้องมียางในรองรับด้วย (require an inner tube) แต่ในปี 2018 เธอเปลี่ยนมาใช้ระบบยางไร้ยางใน (a tubeless tyre system) ที่ติดตั้งกับล้อคาร์บอนที่ลึกกว่า (a deeper carbon wheel) ประโยคสุดท้ายบอกว่า การเปลี่ยนเล็กๆ นี้แทบไม่มีใครสังเกตเห็น (attracted little public attention) แต่ทีมช่างของเธอเชื่อว่ามันช่วยลดแรงต้านการหมุน (reduced rolling resistance) และเพิ่มการควบคุมรถบนพื้นถนนที่ขรุขระ (improved control on rougher road surfaces)\n\nสรุปใจความ: การพัฒนาของ Laurent มาจากสองสิ่ง คือโค้ชคนใหม่ที่ปรับวิธีฝึกซ้อม กับระบบยางที่เปลี่ยนไปแบบเงียบๆ ซึ่งแม้ดูเล็กแต่ส่งผลใหญ่ต่อการปั่นของเธอ",
      vocab: [
        { term: "a former world champion", th: "อดีตแชมป์โลก" },
        { term: "conserve energy more effectively during long climbs", th: "สงวนพลังงานได้มีประสิทธิภาพมากขึ้นระหว่างการไต่เขาระยะยาว" },
        { term: "traditional clincher tyres, which require an inner tube", th: "ยางแบบดั้งเดิมที่ต้องมียางในรองรับ" },
        { term: "a tubeless tyre system fitted to a deeper carbon wheel", th: "ระบบยางไร้ยางในที่ติดตั้งกับล้อคาร์บอนที่ลึกกว่า" },
        { term: "attracted little public attention", th: "แทบไม่มีใครในสาธารณะสังเกตเห็น" },
        { term: "reduced rolling resistance", th: "ลดแรงต้านการหมุนของล้อ" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้บอกว่าสิ่งที่ Laurent ทำเป็นเพียงตัวอย่างหนึ่ง (just one example) ของวิธีมากมายที่นักปั่นมืออาชีพใช้ปรับแต่งอุปกรณ์ (adapt their equipment) ของตัวเอง มีคำพูดอ้างอิงจาก Adrian Cole ช่างเครื่องแข่งชาวอังกฤษ (a British race mechanic) ว่า “The bicycle a professional rider uses is not simply taken from a shop and ridden in a race” (ตีความได้ว่า => จักรยานที่นักปั่นมืออาชีพใช้ไม่ได้หยิบตรงจากร้านมาแข่งเลย) และ “At elite level, every detail is adjusted to the rider’s body, strength and style” (ทุกรายละเอียดถูกปรับให้เข้ากับร่างกาย ความแข็งแรง และสไตล์ของนักปั่นแต่ละคน) ประโยคสุดท้ายสรุปว่า ด้วยเหตุนี้จักรยานของนักปั่นชั้นนำจึงมักต่างจากรุ่นที่ขายให้ลูกค้าทั่วไป (the models sold to ordinary customers) แม้ว่าหน้าตาภายนอกจะดูเกือบเหมือนกันทุกประการ (even when they appear almost identical)\n\nสรุปใจความ: กรณีของ Laurent ไม่ใช่เรื่องพิเศษ แต่เป็นเรื่องปกติของวงการปั่นจักรยานระดับสูง — จักรยานแข่งของนักกีฬาชั้นนำมักถูกปรับแต่งเฉพาะบุคคล แม้ภายนอกจะดูเหมือนรุ่นทั่วไปก็ตาม",
      vocab: [
        { term: "adapt their equipment", th: "ปรับแต่งอุปกรณ์ของตัวเอง" },
        { term: "not simply taken from a shop and ridden in a race", th: "ไม่ได้หยิบตรงจากร้านมาขี่แข่งเลย ต้องมีการปรับแต่งก่อน" },
        { term: "every detail is adjusted to the rider’s body, strength and style", th: "ทุกรายละเอียดถูกปรับให้เข้ากับร่างกาย ความแข็งแรง และสไตล์ของนักปั่น" },
        { term: "the models sold to ordinary customers", th: "รุ่นที่วางขายให้ลูกค้าทั่วไป" },
        { term: "even when they appear almost identical", th: "แม้ว่าหน้าตาภายนอกจะดูเกือบเหมือนกันทุกประการ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างพี่น้องนักปั่นชาวดัตช์ Erik และ Jonas Vermeer ที่มีชื่อเสียงเรื่องความละเอียดในเรื่องสเปกจักรยาน (extremely exact about their bicycle specifications) มีคำพูดของพวกเขาว่า “We are very particular about the way our bikes are prepared” (ตีความได้ว่า => เราจู้จี้จุกจิกมากกับวิธีเตรียมจักรยานของเรา) พวกเขาอธิบายว่าเฟรมจักรยาน (The frames) ถูกผลิตโดยสปอนเซอร์ก่อน (made by our sponsor) แล้วจึงถูกส่งไปยังเวิร์กช็อปเฉพาะทาง (a specialist workshop) เพื่อตรวจสอบความแข็งของล้อ (wheel stiffness) ตำแหน่งอาน (saddle position) และความกว้างแฮนด์ (handlebar width) อีกครั้ง\n\nนอกจากนี้พวกเขายังปรับความยาวของขาจาน (the length of the crank arms) และทดลองสีทาที่ต่างกันบนขอบล้อ (different kinds of paint on the wheel rims) ด้วย ประโยคสุดท้ายบอกว่าจักรยานปัจจุบันของพวกเขาหนักกว่ารุ่นทั่วไปของนักกีฬามืออาชีพเล็กน้อย (slightly heavier than the average professional model) และมีการจัดเรียงซี่ล้อที่แน่นกว่า (a denser spoke pattern) ที่ล้อหลัง (in the rear wheel)\n\nสรุปใจความ: ตัวอย่างพี่น้อง Vermeer แสดงให้เห็นว่าการปรับแต่งจักรยานระดับสูงไม่ได้หยุดแค่เฟรม แต่ลงลึกไปถึงความแข็งของล้อ ตำแหน่งอาน สี น้ำหนัก และการจัดเรียงซี่ล้อ",
      vocab: [
        { term: "extremely exact about their bicycle specifications", th: "ละเอียดมากเรื่องสเปกจักรยานของตัวเอง" },
        { term: "very particular about the way our bikes are prepared", th: "จู้จี้จุกจิกมากกับวิธีเตรียมจักรยานของเรา" },
        { term: "wheel stiffness, saddle position and handlebar width", th: "ความแข็งของล้อ ตำแหน่งอาน และความกว้างของแฮนด์" },
        { term: "the length of the crank arms", th: "ความยาวของขาจาน (ส่วนที่ติดกับบันไดปั่น)" },
        { term: "a denser spoke pattern in the rear wheel", th: "การจัดเรียงซี่ล้อที่แน่น/ถี่กว่าปกติในล้อหลัง" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้อธิบายเหตุผลที่นักปั่นยอมปรับแต่งจักรยานแบบละเอียดขนาดนี้: ความแตกต่างระหว่างความสำเร็จกับความล้มเหลวในการปั่นจักรยานระดับมืออาชีพ (professional cycling) นั้นเล็กมากได้ (extremely small) นักปั่นอาจชนะหรือแพ้เพราะเสี้ยววินาทีบนทางขึ้นเขา (a few seconds on a climb) โค้งที่เร็วกว่าเล็กน้อย (a slightly faster corner) หรือท่านั่งบนจักรยานที่มีประสิทธิภาพกว่า (a more efficient position on the bicycle) ประโยคสุดท้ายสรุปว่า เพราะเหตุนี้นักปั่นและทีมของพวกเขาจึงยินดีมากขึ้นเรื่อยๆ ที่จะทำการเปลี่ยนแปลงเล็กๆ น้อยๆ (make minor changes) หากมันช่วยให้ได้เปรียบแม้เพียงเล็กน้อย (even a small competitive advantage)\n\nสรุปใจความ: ย่อหน้าสั้นๆ นี้สรุปเหตุผลของทั้งเรื่อง — เมื่อชัยชนะห่างจากความพ่ายแพ้แค่เสี้ยววินาทีหรือมุมโค้งเดียว การปรับแต่งจักรยานเล็กๆ น้อยๆ จึงกลายเป็นเรื่องคุ้มค่าที่จะลอง",
      vocab: [
        { term: "extremely small", th: "เล็กน้อยมาก" },
        { term: "a few seconds on a climb", th: "เสี้ยววินาทีบนทางขึ้นเขา" },
        { term: "a more efficient position on the bicycle", th: "ท่านั่งบนจักรยานที่มีประสิทธิภาพมากกว่า" },
        { term: "make minor changes", th: "ทำการเปลี่ยนแปลงเล็กๆ น้อยๆ" },
        { term: "even a small competitive advantage", th: "แม้จะได้เปรียบในการแข่งขันเพียงเล็กน้อยก็ตาม" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้เล่าประวัติศาสตร์ของการปรับแต่งจักรยาน (Bicycle modification) ว่ามีมายาวนาน (a long history) ในช่วงต้นศตวรรษที่ 20 (the early twentieth century) นักปั่นบางคนเริ่มเปลี่ยนรูปทรงแฮนด์ (changing the shape of their handlebars) เพื่อเพิ่มความสบายระหว่างการแข่งขันระยะไกล ต่อมาในทศวรรษ 1930s นักปั่นสมัครเล่นชาวอิตาลีชื่อ Carlo Berti แข่งด้วยจักรยานที่มียางแบบพิเศษที่ยัดไส้ด้วยไม้ก๊อก (an unusual cork-filled tyre) ยางเส้นนี้เด้ง (bounce) มากเกินไปจนกรรมการแข่งขันสั่งห้ามใช้ในไม่ช้า (soon banned it) โดยให้เหตุผลว่ามันให้ความได้เปรียบที่ไม่เป็นธรรม (an unfair advantage) บนถนนที่ขรุขระ (on poor roads) ประโยคสุดท้ายบอกว่า อย่างไรก็ตาม (However) ภายในไม่กี่ทศวรรษ การปรับแต่งจักรยาน (bicycle customisation) ก็กลายเป็นเรื่องปกติในวงการกีฬานี้ (an ordinary part of the sport)\n\nสรุปใจความ: การปรับแต่งจักรยานไม่ใช่เรื่องใหม่ — มีมาตั้งแต่ต้นศตวรรษที่ 20 แล้ว และเคยมีบางกรณีที่ถูกแบนเพราะให้ความได้เปรียบมากเกินไป ก่อนที่การปรับแต่งจะค่อยๆ กลายเป็นเรื่องธรรมดาในวงการ",
      vocab: [
        { term: "a long history", th: "มีประวัติศาสตร์ยาวนาน" },
        { term: "changing the shape of their handlebars", th: "เปลี่ยนรูปทรงของแฮนด์จักรยาน" },
        { term: "an unusual cork-filled tyre", th: "ยางที่ยัดไส้ด้วยไม้ก๊อกแบบผิดปกติ" },
        { term: "soon banned it", th: "สั่งห้ามใช้ในไม่ช้า" },
        { term: "an unfair advantage on poor roads", th: "ความได้เปรียบที่ไม่เป็นธรรมบนถนนที่ขรุขระ/สภาพไม่ดี" },
        { term: "an ordinary part of the sport", th: "กลายเป็นเรื่องปกติธรรมดาในวงการกีฬานี้" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้านี้บอกว่าปัจจุบันโค้ชหลายคนมองว่าการปรับแต่งอุปกรณ์ (equipment adjustment) สำคัญพอๆ กับโภชนาการหรือการฝึกซ้อม (as important as nutrition or training) จากนั้นแบ่งการปรับแต่งจักรยานออกเป็นสองประเภทกว้างๆ (two broad categories): การเปลี่ยนระบบล้อ/ยาง (changes to the rolling system) กับการเปลี่ยนเฟรม (changes to the frame) โดยระบบล้อ/ยาง (the rolling system) ครอบคลุมยาง ล้อ และแรงดันลมยาง (tyres, wheels and tyre pressure) ซึ่งเป็นส่วนที่ทีมมืออาชีพส่วนใหญ่ปรับแต่งบ่อยที่สุด (adjust most often) นักปั่นอาจเปลี่ยนแรงดันลมยางตามพื้นถนน สภาพอากาศ และประเภทของการแข่งขัน ประโยคสุดท้ายยกตัวอย่าง: ถนนเปียกอาจต้องการการยึดเกาะที่มากขึ้น (more grip) ในขณะที่ถนนแห้งเรียบอาจใช้แรงดันลมยางที่แข็งกว่าได้ (a harder tyre pressure)\n\nสรุปใจความ: ย่อหน้านี้จัดระบบความคิดให้เข้าใจว่าการปรับแต่งจักรยานแบ่งเป็นสองส่วนหลัก และระบบล้อ/ยางคือส่วนที่ถูกปรับบ่อยที่สุด เพราะต้องปรับให้เข้ากับทั้งพื้นถนน สภาพอากาศ และประเภทการแข่งขัน",
      vocab: [
        { term: "as important as nutrition or training", th: "สำคัญพอๆ กับเรื่องโภชนาการหรือการฝึกซ้อม" },
        { term: "the rolling system", th: "ระบบล้อ/ยางของจักรยาน (ยาง ล้อ แรงดันลม)" },
        { term: "adjust most often", th: "ปรับแต่งบ่อยที่สุด" },
        { term: "a wet road may require more grip", th: "ถนนเปียกอาจต้องการการยึดเกาะพื้นที่มากขึ้น" },
        { term: "allow a harder tyre pressure", th: "ทำให้สามารถใช้แรงดันลมยางที่แข็งกว่าได้" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้เล่าประวัติวัสดุที่ใช้ทำล้อจักรยานแข่ง ในสมัยก่อน (At one time) จักรยานแข่งส่วนใหญ่มีขอบล้อ (rims) ทำจากไม้ (made from wood) ซึ่งค่อนข้างเบา (relatively light) แต่สามารถเสียหายได้จากน้ำ (could be damaged by water) และไม่ค่อยน่าเชื่อถือเมื่อเบรกแรงๆ (not always reliable under heavy braking) ต่อมาอะลูมิเนียม (Aluminium) กลายเป็นวัสดุที่นิยมใช้กันมากขึ้นเพราะแข็งแรงกว่าและคาดเดาได้มากกว่า (stronger and more predictable) ประโยคสุดท้ายบอกว่าเมื่อไม่นานมานี้ ใยคาร์บอน (carbon fibre) กลายเป็นวัสดุที่นักปั่นหลายคนนิยมใช้มากที่สุดสำหรับล้อแข่ง เพราะช่วยให้นักออกแบบสร้างทรงล้อที่ลึกขึ้น (create deeper wheel shapes) ซึ่งช่วยลดแรงต้านอากาศ (reduce air resistance) โดยเฉพาะที่ความเร็วสูง (at high speeds)\n\nสรุปใจความ: วัสดุขอบล้อจักรยานพัฒนาเป็นลำดับ จากไม้ สู่อะลูมิเนียม จนถึงใยคาร์บอนในปัจจุบันที่ช่วยลดแรงต้านลมและเพิ่มความเร็วได้ดีที่สุด",
      vocab: [
        { term: "wheels with rims made from wood", th: "ล้อที่มีขอบล้อทำจากไม้" },
        { term: "not always reliable under heavy braking", th: "ไม่ค่อยน่าเชื่อถือเมื่อต้องเบรกแรงๆ" },
        { term: "stronger and more predictable", th: "แข็งแรงกว่าและคาดเดาพฤติกรรมได้มากกว่า" },
        { term: "carbon fibre has become the preferred material", th: "ใยคาร์บอนกลายเป็นวัสดุที่นิยมใช้มากที่สุด" },
        { term: "create deeper wheel shapes", th: "สร้างทรงล้อที่ลึกขึ้น (ขอบล้อสูงขึ้น)" },
        { term: "reduce air resistance", th: "ลดแรงต้านอากาศขณะปั่น" }
      ]
    },
    8: {
      explanationTh:
        "ย่อหน้านี้เจาะลึกเรื่องยางไร้ยางใน (tubeless tyres) ซึ่งเป็นพัฒนาการล่าสุดที่ถูกพูดถึงมากที่สุด (attracted particular interest) เพราะไม่มียางในอยู่ข้างใน (do not contain an inner tube) ยางแบบนี้จึงบางครั้งใช้แรงดันลมที่ต่ำกว่าได้โดยไม่เพิ่มความเสี่ยงยางแตกกะทันหัน (without the same risk of sudden punctures) ซึ่งช่วยเพิ่มความสบายและการยึดเกาะ (improve comfort and grip) โดยเฉพาะบนถนนที่ขรุขระ (on uneven roads)\n\nการศึกษาที่ทำโดยทีมแข่งหลายทีม (Studies carried out by several racing teams) ชี้ว่า เมื่อใช้ร่วมกับล้อที่เหมาะสม (combined with a suitable wheel) ยางไร้ยางในสามารถลดแรงที่ต้องใช้เพื่อรักษาความเร็ว (reduce the effort required to maintain speed) ได้ ประโยคสุดท้ายสรุปว่าระบบยางสมัยใหม่จึงไม่ได้เปลี่ยนแค่ตัวอุปกรณ์ แต่เปลี่ยนกลยุทธ์การแข่งขันด้วย (racing tactics)\n\nสรุปใจความ: ยางไร้ยางในคือนวัตกรรมที่มีอิทธิพลมากที่สุดในยุคนี้ เพราะช่วยลดความเสี่ยงยางแตก เพิ่มความสบาย และลดแรงที่ต้องใช้ในการรักษาความเร็ว จนเปลี่ยนวิธีที่นักปั่นวางกลยุทธ์การแข่งขัน",
      vocab: [
        { term: "attracted particular interest", th: "ได้รับความสนใจเป็นพิเศษ" },
        { term: "do not contain an inner tube", th: "ไม่มียางในอยู่ข้างในยาง" },
        { term: "without the same risk of sudden punctures", th: "โดยไม่มีความเสี่ยงยางแตกกะทันหันเหมือนเดิม" },
        { term: "combined with a suitable wheel", th: "เมื่อใช้ร่วมกับล้อที่เหมาะสม" },
        { term: "reduce the effort required to maintain speed", th: "ลดแรงที่ต้องออกเพื่อรักษาความเร็วไว้" },
        { term: "racing tactics", th: "กลยุทธ์ในการแข่งขัน" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างนักปั่นที่ปรับแต่งจักรยานไปในทางที่เป็นส่วนตัวมากยิ่งขึ้น (even more personal adjustments) นักปั่นชาวอเมริกัน Eli Grant มีชื่อเสียงเรื่องการลงเขาด้วยความเร็วที่ยอดเยี่ยม (descending mountains at exceptional speed) ความมั่นคง (stability) ของเขาส่วนหนึ่งมาจากการเติมตุ้มน้ำหนักตะกั่วเล็กๆ (small lead weights) เข้าไปในส่วนล่างของเฟรมจักรยาน (the lower section of his bicycle frame) ปัจจุบัน การปรับแต่งลักษณะนี้มักถูกทำตั้งแต่ขั้นตอนการผลิต (during the manufacturing process) แทนที่จะมาเติมทีหลัง (rather than added later)\n\nส่วนนักปั่นบางคนก็ให้ความสำคัญกับความสบาย (focus on comfort) มากกว่า เช่น นักปั่นหญิงชาวโปรตุเกส Lucia Ramos เปลี่ยนเทปพันแฮนด์เดิม (the original handlebar tape) เป็นเทปที่บางกว่า (a thinner version) เพราะเทปแบบมาตรฐานทำให้มือของเธอปวดเมื่อยระหว่างการแข่งขันระยะไกล (made her hands ache during long races)\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าการปรับแต่งไม่ได้มีเป้าหมายเดียวเสมอไป — บางคนปรับเพื่อความมั่นคงในการลงเขา (เติมตุ้มน้ำหนัก) บางคนปรับเพื่อความสบาย (เปลี่ยนเทปพันแฮนด์)",
      vocab: [
        { term: "even more personal adjustments", th: "การปรับแต่งที่เป็นส่วนตัว/เฉพาะบุคคลมากยิ่งขึ้น" },
        { term: "descending mountains at exceptional speed", th: "การลงเขาด้วยความเร็วที่ยอดเยี่ยมมาก" },
        { term: "small lead weights inside the lower section of his bicycle frame", th: "ตุ้มน้ำหนักตะกั่วเล็กๆ ที่เติมเข้าไปในส่วนล่างของเฟรมจักรยาน" },
        { term: "during the manufacturing process", th: "ตั้งแต่ขั้นตอนการผลิต" },
        { term: "made her hands ache during long races", th: "ทำให้มือของเธอปวดเมื่อยระหว่างการแข่งขันระยะไกล" }
      ]
    },
    10: {
      explanationTh:
        "ย่อหน้าปิดท้ายสรุปว่า การปรับแต่งจักรยาน (Bicycle customisation) ได้ผลักดันวงการปั่นจักรยานมืออาชีพ (pushed professional cycling) ให้ไปถึงระดับที่ยากจะจินตนาการได้ (would have been difficult to imagine) เมื่อเทียบกับยุคที่นักกีฬาแข่งด้วยเฟรมเหล็กหนักๆ และล้อไม้ (heavy steel frames and wooden wheels) ประโยคสุดท้ายมองไปข้างหน้าว่า เมื่อวัสดุยังคงพัฒนาต่อไป (as materials continue to develop) นวัตกรรมเพิ่มเติมก็มีแนวโน้มจะเกิดขึ้น (further innovations are likely) แม้ว่าเจ้าหน้าที่การแข่งขัน (race officials) จะยังคงต้องตัดสินใจต่อไปว่าการเปลี่ยนแปลงแบบไหนที่ยอมรับได้ (acceptable) และแบบไหนที่ให้ความช่วยเหลือนักกีฬามากเกินไป (give athletes too much assistance)\n\nสรุปใจความ: บทความปิดท้ายด้วยการมองไปข้างหน้า — เทคโนโลยีจักรยานจะพัฒนาต่อไปเรื่อยๆ แต่คำถามที่ยังไม่มีคำตอบชัดเจนคือการเปลี่ยนแปลงแบบไหนถือว่ายุติธรรม และแบบไหนถือว่าเอาเปรียบเกินไป",
      vocab: [
        { term: "pushed professional cycling to a level", th: "ผลักดันวงการปั่นจักรยานมืออาชีพให้ไปถึงระดับหนึ่ง" },
        { term: "heavy steel frames and wooden wheels", th: "เฟรมเหล็กหนักๆ และล้อไม้" },
        { term: "further innovations are likely", th: "นวัตกรรมเพิ่มเติมมีแนวโน้มว่าจะเกิดขึ้น" },
        { term: "which changes are acceptable", th: "การเปลี่ยนแปลงแบบไหนที่ยอมรับได้" },
        { term: "give athletes too much assistance", th: "ให้ความช่วยเหลือนักกีฬามากเกินไปจนไม่เป็นธรรม" }
      ]
    }
  },
  "the bandits of the ancient mountain roads": {
    0: {
      explanationTh:
        "ประโยคเดียวนี้เป็นประโยคเกริ่นนำของบทความ (คั่นก่อนเข้าสู่ย่อหน้า A-G ที่มีตัวอักษรกำกับ) บอกกรอบเวลาและสถานที่ของเรื่องทั้งหมด: ในช่วงศตวรรษแรกๆ ก่อนคริสตกาลและหลังคริสตกาล (the first centuries BCE and CE) มีกลุ่มโจรภูเขา (bandits) คอยคุกคาม (threatened) นักเดินทางและพ่อค้า (travellers and merchants) บนเส้นทางภูเขา (mountain routes) ที่เชื่อมเมืองในแผ่นดินกับท่าเรือชายฝั่ง (linking inland cities with coastal ports)\n\nสรุปใจความ: ประโยคนี้ตั้งฉากเรื่องทั้งหมดไว้ล่วงหน้า — เส้นทางภูเขาโบราณที่เชื่อมเมืองในแผ่นดินกับท่าเรือ ที่นักเดินทางและพ่อค้าต้องเผชิญกับการปล้นจากกลุ่มโจรภูเขาตลอดเส้นทาง ซึ่งย่อหน้า A-G ที่ตามมาจะขยายความเรื่องนี้ทีละประเด็น",
      vocab: [
        { term: "bandits", th: "กลุ่มโจรภูเขา" },
        { term: "threatened travellers and merchants", th: "คุกคามนักเดินทางและพ่อค้า" },
        { term: "mountain routes", th: "เส้นทางที่พาดผ่านภูเขา" },
        { term: "linking inland cities with coastal ports", th: "เชื่อมเมืองที่อยู่ในแผ่นดินกับท่าเรือชายฝั่ง" }
      ]
    },
    1: {
      explanationTh:
        "ตัวอักษร “A” ตรงนี้ไม่ใช่เนื้อหาให้อ่าน แต่เป็นป้ายชื่อย่อหน้า (a paragraph label) ที่บอกตำแหน่งของย่อหน้า A สำหรับโจทย์แบบจับคู่ข้อมูล/หัวข้อ เนื้อหาจริงของย่อหน้า A อยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “A. When people think of ancient trade…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: นี่เป็นเพียงตัวบอกตำแหน่งย่อหน้า ไม่มีเนื้อหาให้อธิบายเพิ่มเติม"
    },
    2: {
      explanationTh:
        "ย่อหน้า A เริ่มด้วยภาพที่คนทั่วไปมักจินตนาการถึงการค้าโบราณ (ancient trade) คือขบวนสัตว์บรรทุกของที่สงบสุข (peaceful lines of pack animals) บรรทุกผ้า เครื่องโลหะ และเครื่องเทศ (cloth, metalwork and spices) ผ่านภูมิทัศน์ภูเขาอันตระการตา (dramatic mountain scenery)\n\nแต่ (Yet) ผู้เขียนบอกว่าสำหรับนักเดินทางหลายคน (for many travellers) การเดินทางเหล่านี้อันตราย (dangerous) โจรภูเขา (Bandits) เฝ้าดูเส้นทางจากที่สูง (watched the roads from high ground) โจมตีกองคาราวานที่เคลื่อนที่ช้า (slow-moving caravans) แล้วหายลับเข้าไปในหุบเขาที่กองทัพปกติตามไม่ทัน (regular armies struggled to follow them)\n\nแม้ว่ารัฐโบราณจะพยายามควบคุมปัญหานี้ซ้ำแล้วซ้ำเล่า (Despite repeated attempts by ancient states) การปล้นภูเขา (banditry) ก็ยังคงดำเนินต่อไปนานหลายศตวรรษ ประโยคสุดท้ายบอกว่า จนกระทั่งการโจมตีเริ่มสร้างความเสียหายต่อรายได้ภาษี (damage tax income) และคุกคามการสื่อสารทางราชการ (threaten official communications) จักรวรรดิใหญ่แห่งหนึ่งจึงจัดตั้งกองทัพขนาดใหญ่ (organise a large campaign) เพื่อรักษาความปลอดภัยของเส้นทางภูเขา (secure the mountain roads)\n\nสรุปใจความ: ย่อหน้า A เปิดเรื่องด้วยการหักล้างภาพจำที่สวยงามของเส้นทางภูเขาโบราณ แล้วชี้ว่าความจริงมันอันตรายและวุ่นวายมานานหลายร้อยปี จนจักรวรรดิใหญ่รู้สึกเสียผลประโยชน์จริงๆ จึงลงมือปราบปราม",
      vocab: [
        { term: "peaceful lines of pack animals", th: "ขบวนสัตว์บรรทุกของที่ดูสงบสุข" },
        { term: "watched the roads from high ground", th: "เฝ้าดูเส้นทางอยู่บนที่สูง" },
        { term: "regular armies struggled to follow them", th: "กองทัพปกติตามพวกเขาไปได้ยากลำบาก" },
        { term: "banditry continued for centuries", th: "การปล้นภูเขายังคงดำเนินต่อไปนานหลายร้อยปี" },
        { term: "damage tax income and threaten official communications", th: "สร้างความเสียหายต่อรายได้ภาษีและคุกคามการสื่อสารของทางราชการ" },
        { term: "secure the mountain roads", th: "รักษาความปลอดภัยของเส้นทางภูเขา" }
      ]
    },
    3: {
      explanationTh:
        "ตัวอักษร “B” นี้เป็นป้ายบอกตำแหน่งย่อหน้า B ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “B. The geography of the region…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    4: {
      explanationTh:
        "ย่อหน้า B อธิบายว่าภูมิศาสตร์ของภูมิภาคนี้ (The geography of the region) ทำให้การปล้นภูเขาป้องกันได้ยาก (difficult to prevent) เส้นทางต่างๆ พาดผ่านหุบเขาแคบ ป่าชัน และช่องเขาหิน (narrow valleys, steep forests and rocky passes) หมู่บ้านบางแห่งมีพื้นที่เพาะปลูกเล็กๆ แต่หลายชุมชนพึ่งพาการเลี้ยงสัตว์ การตัดไม้ และการค้า (herding, woodcutting and trade) มากกว่าการเกษตร ความรู้เรื่องน้ำพุ เส้นทางลับ และเส้นทางตามฤดูกาล (springs, hidden tracks and seasonal paths) ของพวกเขามีมากกว่าคนนอกพื้นที่มาก\n\nในทางตรงกันข้าม (by contrast) กองคาราวานพ่อค้ามีทางเลือกจำกัด (limited choices) สัตว์บรรทุกของ (Pack animals) ไม่สามารถข้ามทุกสันเขาได้ พ่อค้าจึงถูกบังคับให้ใช้ช่องเขาที่รู้จักกันดีจำนวนไม่กี่แห่ง (a small number of known passes) ซึ่งทำให้การเคลื่อนไหวของพวกเขาคาดเดาได้ง่าย (predictable) ประโยคสุดท้ายบอกว่า เมื่อทหารมาถึง (When soldiers arrived) โจรภูเขามักหลบหนีได้เพราะพวกเขาเข้าใจภูมิประเทศท้องถิ่นเป็นอย่างดี (understood the local landscape so well)\n\nสรุปใจความ: ภูมิประเทศที่ซับซ้อนของภูมิภาคนี้เป็นทั้งอาวุธของโจร (รู้เส้นทางลับ) และกับดักของพ่อค้า (ต้องเดินตามช่องเขาที่คาดเดาได้) ทำให้โจรได้เปรียบทั้งในการโจมตีและการหลบหนี",
      vocab: [
        { term: "narrow valleys, steep forests and rocky passes", th: "หุบเขาแคบ ป่าชัน และช่องเขาหิน" },
        { term: "herding, woodcutting and trade", th: "การเลี้ยงสัตว์ การตัดไม้ และการค้าขาย" },
        { term: "springs, hidden tracks and seasonal paths", th: "น้ำพุ เส้นทางลับ และเส้นทางตามฤดูกาล" },
        { term: "pack animals could not cross every ridge", th: "สัตว์บรรทุกของไม่สามารถข้ามทุกสันเขาได้" },
        { term: "a small number of known passes", th: "ช่องเขาที่รู้จักกันดีจำนวนไม่กี่แห่ง" },
        { term: "understood the local landscape so well", th: "เข้าใจภูมิประเทศท้องถิ่นเป็นอย่างดี" }
      ]
    },
    5: {
      explanationTh:
        "ตัวอักษร “C” นี้เป็นป้ายบอกตำแหน่งย่อหน้า C ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “C. It should also be remembered…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้า C ชวนให้ผู้อ่านจำไว้ (It should also be remembered) ว่ารัฐบาลโบราณไม่ได้มองโจรภูเขาเป็นศัตรูเสมอไป (did not always treat bandits as enemies) ในช่วงสงคราม ผู้ปกครองบางครั้งใช้พวกเขาเป็นหน่วยสอดแนม มัคคุเทศก์ หรือทหารนอกแบบ (scouts, guides or irregular fighters) เพราะความสามารถในการเคลื่อนที่อย่างรวดเร็วผ่านภูมิประเทศที่ยากลำบาก (move quickly through difficult terrain) ทำให้พวกเขามีประโยชน์ในช่วงแรกของการทำศึก (the early stages of a campaign)\n\nประโยคถัดมาบอกว่า เมืองชายแดนบางแห่ง (Some frontier towns) ถึงกับยอมให้กลุ่มโจรพักอาศัยอยู่ใกล้ๆ (allowed bandit groups to remain nearby) เพื่อแลกกับ (In return) การที่โจรนำสัตว์และสินค้าที่ปล้นมา (stolen animals and goods) มาขายในตลาดท้องถิ่น ซึ่งช่วยเพิ่มการค้าและสร้างรายได้พิเศษให้กับชาวเมือง (increased trade and brought extra income to the townspeople)\n\nสรุปใจความ: ย่อหน้านี้พลิกมุมมอง — โจรภูเขาไม่ได้เป็นแค่ผู้ร้ายเสมอไป บางครั้งรัฐและเมืองต่างๆ ก็ได้ประโยชน์จากพวกเขาทั้งในสงครามและการค้า",
      vocab: [
        { term: "did not always treat bandits as enemies", th: "ไม่ได้มองว่าโจรภูเขาเป็นศัตรูเสมอไป" },
        { term: "scouts, guides or irregular fighters", th: "หน่วยสอดแนม มัคคุเทศก์ หรือทหารนอกแบบ" },
        { term: "the early stages of a campaign", th: "ช่วงแรกๆ ของการทำศึก" },
        { term: "allowed bandit groups to remain nearby", th: "อนุญาตให้กลุ่มโจรพักอาศัยอยู่ใกล้เมือง" },
        { term: "brought extra income to the townspeople", th: "สร้างรายได้พิเศษให้แก่ชาวเมือง" }
      ]
    },
    7: {
      explanationTh:
        "ตัวอักษร “D” นี้เป็นป้ายบอกตำแหน่งย่อหน้า D ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “D. One of the earliest written references…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    8: {
      explanationTh:
        "ย่อหน้า D เล่าถึงหลักฐานลายลักษณ์อักษรที่เก่าแก่ที่สุดชิ้นหนึ่ง (One of the earliest written references) ที่กล่าวถึงกลุ่มโจรภูเขาที่มีชื่อเรียกเฉพาะ (a named group of mountain bandits) หลักฐานนี้ปรากฏอยู่ในจดหมายโต้ตอบ (letters exchanged) ระหว่างผู้ว่าราชการของจักรวรรดิ (an imperial governor) กับผู้ปกครองอาณาจักรเล็กๆ ชื่อ Aramon\n\nผู้ว่าราชการร้องเรียนว่ากลุ่มที่รู้จักกันในชื่อ “the Red Pass Riders” โจมตีกองคาราวานที่ขนเงินภาษีของทางการ (caravans carrying official tax money) และยังกล่าวหาว่า Aramon แอบให้ที่พักพิงแก่พวกเขา (secretly giving them shelter)\n\nส่วนผู้ปกครอง Aramon ปฏิเสธว่าไม่มีส่วนเกี่ยวข้องใดๆ (denied any involvement) และยืนยันว่าไม่มีข้าราชการคนใดของเขาช่วยเหลือโจรเลย เขาสัญญาว่าจะลงโทษราษฎรคนใดก็ตามที่แสดงให้เห็นได้ว่าได้ช่วยเหลือพวกโจร (could be shown to have assisted them)\n\nสรุปใจความ: ย่อหน้านี้เป็นตัวอย่างหลักฐานทางประวัติศาสตร์จริงชิ้นแรกๆ ที่แสดงความตึงเครียดระหว่างจักรวรรดิใหญ่กับอาณาจักรเล็กที่ถูกกล่าวหาว่าแอบให้ที่พักพิงแก่โจร",
      vocab: [
        { term: "an imperial governor", th: "ผู้ว่าราชการของจักรวรรดิ" },
        { term: "caravans carrying official tax money", th: "กองคาราวานที่ขนเงินภาษีของทางการ" },
        { term: "secretly giving them shelter", th: "แอบให้ที่พักพิง/ที่หลบซ่อนแก่พวกเขา" },
        { term: "denied any involvement", th: "ปฏิเสธว่าไม่มีส่วนเกี่ยวข้องใดๆ" },
        { term: "could be shown to have assisted them", th: "ที่สามารถแสดงให้เห็นได้ว่าช่วยเหลือพวกเขา" }
      ]
    },
    9: {
      explanationTh:
        "ตัวอักษร “E” นี้เป็นป้ายบอกตำแหน่งย่อหน้า E ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “E. Attitudes towards banditry…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    10: {
      explanationTh:
        "ย่อหน้า E ชี้ว่าทัศนคติต่อการปล้นภูเขา (Attitudes towards banditry) ไม่เหมือนกันในทุกที่ ในเมืองใหญ่ (large cities) โจรภูเขามักถูกประณามว่าเป็นอาชญากรที่ทำให้การค้าปั่นป่วนและการเดินทางไม่ปลอดภัย (disrupted trade and made travel unsafe) แต่ (However) ในชุมชนภูเขาบางแห่ง การปล้นที่สำเร็จ (successful raids) กลับได้รับการยกย่องว่าเป็นสัญลักษณ์ของความกล้าหาญและความเป็นอิสระ (signs of bravery and independence)\n\nมีเพลงโบราณจากภูมิภาคนี้หลายเพลงที่สรรเสริญนักขี่ม้าที่ข้ามช่องเขาอันตราย ยึดกองคาราวานที่ร่ำรวย และกลับมาอย่างมีเกียรติ (returned with honour)\n\nประโยคสุดท้ายเพิ่มมุมที่น่าประหลาดใจ: แม้แต่ข้าราชการเองก็ไม่ได้บริสุทธิ์เสมอไป (were not always innocent) ตามบันทึกของนักประวัติศาสตร์ฉบับหลัง (one later historian) มีเจ้าหน้าที่ตรวจภาษี (a tax inspector) คนหนึ่งที่มีหน้าที่ปกป้องเส้นทาง กลับออกนอกเส้นทางที่ตนรับผิดชอบ (left his official route) เพื่อไปปล้นกองคาราวานพ่อค้าเพื่อผลประโยชน์ส่วนตัว (for his own profit)\n\nสรุปใจความ: การปล้นภูเขาในยุคนั้นไม่ได้ถูกมองว่าผิดเสมอไป — บางวัฒนธรรมยกย่องมันเป็นความกล้าหาญ และแม้แต่เจ้าหน้าที่รัฐเองก็ยังมีคนที่ปล้นเสียเอง",
      vocab: [
        { term: "disrupted trade and made travel unsafe", th: "ทำให้การค้าปั่นป่วนและการเดินทางไม่ปลอดภัย" },
        { term: "signs of bravery and independence", th: "สัญลักษณ์ของความกล้าหาญและความเป็นอิสระ" },
        { term: "returned with honour", th: "กลับมาอย่างมีเกียรติ" },
        { term: "were not always innocent", th: "ก็ไม่ได้บริสุทธิ์เสมอไป" },
        { term: "left his official route", th: "ออกนอกเส้นทางที่ตนมีหน้าที่รับผิดชอบ" },
        { term: "for his own profit", th: "เพื่อผลประโยชน์ส่วนตัวของเขาเอง" }
      ]
    },
    11: {
      explanationTh:
        "ตัวอักษร “F” นี้เป็นป้ายบอกตำแหน่งย่อหน้า F ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “F. The growing power of the eastern empire…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    12: {
      explanationTh:
        "ย่อหน้า F อธิบายว่าอำนาจที่เพิ่มขึ้นของจักรวรรดิตะวันออก (The growing power of the eastern empire) ในที่สุดก็ทำให้ปัญหานี้เพิกเฉยต่อไปไม่ได้อีกแล้ว (impossible to ignore)\n\nในตอนแรก รัฐได้ประโยชน์ทางอ้อมจากการปล้นภูเขา (had benefited indirectly from banditry) สัตว์ที่ถูกปล้นมาถูกขายในตลาดชายแดน (border markets) และเชลยบางส่วนถูกบังคับใช้แรงงานในไร่นาและโครงการสร้างถนน (forced to work on farms and road-building projects) แต่ข้อตกลงแบบนี้จะดำเนินต่อไปได้ก็ต่อเมื่อโจรไม่ไปยุ่งกับผลประโยชน์ของจักรวรรดิ (avoided imperial interests) เท่านั้น\n\nเมื่อโจรเริ่มโจมตีขบวนขนเงิน (convoys carrying silver) ไปยังเมืองหลวง (the capital) เจ้าหน้าที่จึงเรียกร้องให้ลงโทษผู้รับผิดชอบ (demanded punishment for those responsible) แต่ถึงอย่างนั้น (Even then) รัฐบาลก็ยังคงเชื่องช้าในการลงมือ (slow to act) ภายในศตวรรษที่ 1 หลัง ค.ศ. โจรภูเขาก็กล้ามากขึ้น (had become bolder) และเริ่มลักพาตัวทูตสำคัญ (kidnapping important envoys) เรียกค่าไถ่ (demanding a ransom) ก่อนจะปล่อยตัว\n\nสรุปใจความ: จักรวรรดิเคยได้ประโยชน์จากการปล้นภูเขาทางอ้อม จึงเพิกเฉยมานาน จนโจรกล้าขึ้นเรื่อยๆ จนถึงขั้นลักพาตัวทูตเรียกค่าไถ่ ซึ่งเป็นจุดที่สถานการณ์เลวร้ายเกินจะเมิน",
      vocab: [
        { term: "had benefited indirectly from banditry", th: "เคยได้ประโยชน์ทางอ้อมจากการปล้นภูเขา" },
        { term: "forced to work on farms and road-building projects", th: "ถูกบังคับใช้แรงงานในไร่นาและโครงการสร้างถนน" },
        { term: "avoided imperial interests", th: "ไม่ไปยุ่งกับผลประโยชน์ของจักรวรรดิ" },
        { term: "convoys carrying silver to the capital", th: "ขบวนขนเงินไปยังเมืองหลวง" },
        { term: "slow to act", th: "เชื่องช้าในการลงมือทำอะไรสักอย่าง" },
        { term: "kidnapping important envoys", th: "ลักพาตัวทูต/ผู้แทนสำคัญ" }
      ]
    },
    13: {
      explanationTh:
        "ตัวอักษร “G” นี้เป็นป้ายบอกตำแหน่งย่อหน้า G ไม่ใช่เนื้อหา เนื้อหาจริงอยู่ในย่อหน้าถัดไปทันที (ย่อหน้าที่ขึ้นต้นด้วย “G. A new law finally gave General Marcellus Varro…”) ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทนนะครับ\n\nสรุปใจความ: ตัวบอกตำแหน่งย่อหน้าเท่านั้น ไม่มีเนื้อหาให้อธิบาย"
    },
    14: {
      explanationTh:
        "ย่อหน้า G เล่าถึงจุดเปลี่ยนสำคัญ: กฎหมายใหม่ (A new law) ในที่สุดก็มอบอำนาจและเงินทุน (the authority and money) ให้แม่ทัพ Marcellus Varro ใช้จัดการกับภัยคุกคามนี้\n\nแทนที่จะส่งกองทัพขนาดใหญ่เพียงกองเดียวเข้าไปในภูเขา (Instead of sending one large army into the mountains) Varro เลือกแบ่งระบบถนนสายหลัก (the main road system) ออกเป็น 11 เขต (eleven districts) แต่ละเขตได้รับผู้บัญชาการ (a commander) กองกำลังทหารขนาดเล็ก (a small force of soldiers) และหน้าที่เฝ้าดูแลช่องเขาและแหล่งน้ำใกล้เคียง (guarding nearby passes and water sources) เมื่อเขตหนึ่งถูกกวาดล้างเรียบร้อย (had been cleared) ทหารในเขตนั้นก็เคลื่อนไปช่วยเขตถัดไป (moved on to help in the next)\n\nแม้ว่าโจรบางคนถูกฆ่าตายในการสู้รบ (killed in fighting) แต่หลายคนได้รับข้อเสนอที่ดิน (offered land) ในพื้นที่เกษตรกรรมที่ราบลุ่ม (lowland farming areas) ที่ห่างไกลจากเส้นทางภูเขา ประโยคสุดท้ายสรุปว่านโยบายนี้ส่งเสริมให้พวกเขาละทิ้งการปล้น (abandon raiding) และลดโอกาสที่พวกเขาจะกลับไปเป็นโจรภูเขาอีก (return to banditry)\n\nสรุปใจความ: ทางแก้ปัญหาสุดท้ายไม่ใช่แค่การใช้กำลังปราบปราม แต่คือกลยุทธ์แบ่งเขตดูแลอย่างเป็นระบบ ผสมกับการให้โอกาสโจรกลับตัวเป็นชาวนาที่ราบลุ่ม ซึ่งได้ผลในการยุติปัญหาการปล้นในระยะยาว",
      vocab: [
        { term: "gave General Marcellus Varro the authority and money", th: "มอบอำนาจและเงินทุนให้แม่ทัพ Marcellus Varro" },
        { term: "divided the main road system into eleven districts", th: "แบ่งระบบถนนสายหลักออกเป็น 11 เขต" },
        { term: "guarding nearby passes and water sources", th: "เฝ้าดูแลช่องเขาและแหล่งน้ำใกล้เคียง" },
        { term: "offered land in lowland farming areas", th: "ได้รับข้อเสนอที่ดินในพื้นที่เกษตรกรรมที่ราบลุ่ม" },
        { term: "abandon raiding", th: "ละทิ้งการปล้น เลิกอาชีพโจร" },
        { term: "reduced the chance that they would return to banditry", th: "ลดโอกาสที่พวกเขาจะกลับไปเป็นโจรภูเขาอีกครั้ง" }
      ]
    }
  },
  "urban soundscapes the hidden impact of noise": {
    0: {
      explanationTh:
        "ประโยคนี้เป็นหัวเรื่องรองใต้ชื่อบทความ (subtitle) บอกว่าใครเป็นผู้อธิบายและบทความนี้จะพูดถึงอะไร: นักจิตวิทยาสิ่งแวดล้อมคนหนึ่ง (An environmental psychologist) จะอธิบายว่าทำไมเรามักเพิกเฉยต่อเสียงรบกวนในเมือง (why we ignore urban noise) และเสียงเหล่านั้นส่งผลต่อชีววิทยา/ร่างกายของเราอย่างไร (how it affects our biology)\n\nสรุปใจความ: นี่คือการบอกล่วงหน้าว่าบทความทั้งหมดจะพูดถึงสองประเด็นหลัก คือ (1) ทำไมคนเราถึงมองข้ามเสียงรบกวนในเมือง และ (2) เสียงเหล่านั้นส่งผลกระทบต่อร่างกายเราอย่างไรบ้าง",
      vocab: [
        { term: "environmental psychologist", th: "นักจิตวิทยาสิ่งแวดล้อม — ผู้ศึกษาว่าสภาพแวดล้อมส่งผลต่อจิตใจ/พฤติกรรมคนอย่างไร" },
        { term: "urban noise", th: "เสียงรบกวนในเมือง" },
        { term: "how it affects our biology", th: "มันส่งผลต่อร่างกาย/ระบบชีวภาพของเราอย่างไร" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้า A เริ่มด้วยการบอกว่ามลพิษทางเสียง (Noise pollution) มักถูกมองว่าเป็นผลพลอยได้ที่หลีกเลี่ยงไม่ได้ (an inevitable byproduct) ของชีวิตในเมืองยุคใหม่ และมักถูกบดบังความสำคัญ (usually overshadowed) โดยปัญหาสิ่งแวดล้อมที่มองเห็นได้ชัดกว่า เช่น คุณภาพอากาศหรือน้ำ (air or water quality)\n\nผู้เขียนบอกว่าเราทุกคนเจอเสียงรบกวนนี้ทุกวัน (We all experience it daily) เช่น เสียงหวอรถพยาบาลที่ดังมาแต่ไกล (the distant wail of an ambulance) หรือพยายามคุยกันท่ามกลางเสียงคำรามของงานก่อสร้าง (the roar of construction work) เราพยายามปิดกั้นสิ่งรบกวนนี้ให้ได้มากที่สุด (tune out the disturbance) แต่ (but) โดยไม่รู้ตัว (subconsciously) ร่างกายของเรากำลังตอบสนองต่อมันอยู่\n\nน่าเสียดายที่ (Unfortunately) การเพิกเฉยต่อเสียงอึกทึก (the clamour) จะไม่ทำให้มันหยุดส่งผลกระทบต่อเรา (won't stop it from affecting us) — จริงๆ แล้ว มันเป็นหนึ่งในกลไกการรับมือ (coping mechanisms) ที่แย่ที่สุดที่เราจะเลือกใช้ได้ ประโยคสุดท้ายอธิบายว่าเรื่องนี้สำคัญเพราะนักจิตวิทยาสิ่งแวดล้อมชี้ว่า เสียงในเมืองไม่ได้แค่สร้างความรำคาญ (cause annoyance) เท่านั้น แต่ยังเชื่อมโยงกับปัญหาทางสรีรวิทยาที่กระทบทั้งระบบร่างกาย (systemic physiological issues) ด้วย\n\nสรุปใจความ: ย่อหน้านี้ตั้งประเด็นหลักของบทความ — คนเรามักคิดว่าการเมินเฉยเสียงรบกวนในเมืองคือทางออก แต่จริงๆ แล้วมันกลับเป็นวิธีรับมือที่แย่ที่สุด เพราะร่างกายยังคงตอบสนองต่อเสียงอยู่ดีโดยไม่รู้ตัว",
      vocab: [
        { term: "an inevitable byproduct of modern city life", th: "ผลพลอยได้ที่หลีกเลี่ยงไม่ได้ของชีวิตในเมืองยุคใหม่" },
        { term: "tune out the disturbance", th: "พยายามปิดกั้น/ไม่สนใจสิ่งรบกวนนั้น" },
        { term: "won't stop it from affecting us", th: "จะไม่ทำให้มันหยุดส่งผลกระทบต่อเรา" },
        { term: "one of the worst coping mechanisms", th: "หนึ่งในกลไกการรับมือที่แย่ที่สุด" },
        { term: "systemic physiological issues", th: "ปัญหาทางสรีรวิทยาที่กระทบทั้งระบบร่างกาย ไม่ใช่แค่จุดเดียว" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้า B เริ่มด้วยการหักล้างความเชื่อทั่วไป (Contrary to popular belief) ว่ามนุษย์ไม่ได้ปรับตัวเข้ากับการได้ยินเสียงรบกวนเรื้อรัง (do not simply adapt to chronic noise exposure) ไปตามกาลเวลาได้ง่ายๆ อย่างที่คนส่วนใหญ่คิด งานวิจัยทางวิทยาศาสตร์ชี้ว่า ความเครียดจากเสียง (acoustic stress) ถูกประมวลผลอย่างต่อเนื่อง (processed continuously) โดยศูนย์ตรวจจับภัยคุกคามของร่างกาย (the body's threat-detection centre)\n\nเรื่องนี้สมเหตุสมผล (This makes sense) ถ้าเราคิดว่ามนุษย์ยุคแรกเริ่มพึ่งพาเสียงในการตรวจจับผู้ล่าที่กำลังเข้ามา (early humans relied on sound to detect approaching predators) หากมีเสียงดังกะทันหันที่คุกคามความรู้สึกปลอดภัยของเราหรือทำให้เราตกใจ (threatens our sense of safety or startles us) เราจะมีฮอร์โมนความเครียดพุ่งขึ้นอย่างรวดเร็ว (a rapid spike in stress hormones)\n\nประโยคสุดท้ายอ้างอิงงานวิจัยที่ใช้การสร้างภาพสมอง (brain imaging) พบว่าบริเวณสมองที่เกี่ยวข้องกับการผลิตอะดรีนาลีนและการควบคุมอารมณ์ (adrenaline production and emotion regulation) ยังคงทำงานมากเกินปกติอยู่ตลอด (remain hyperactive) ในคนที่อาศัยอยู่ใกล้ถนนที่พลุกพล่าน เมื่อเทียบกับคนที่อาศัยอยู่ในย่านที่เงียบสงบกว่า (quieter neighbourhoods)\n\nสรุปใจความ: ย่อหน้านี้อธิบายว่าทำไมเราถึง “เพิกเฉย” เสียงไม่ได้จริงๆ — เพราะสมองส่วนตรวจจับภัยของเรายังคงทำงานตอบสนองต่อเสียงตลอดเวลา แม้เราจะรู้สึกเหมือนชินไปแล้วก็ตาม",
      vocab: [
        { term: "contrary to popular belief", th: "ตรงข้ามกับความเชื่อทั่วไปที่คนส่วนใหญ่คิด" },
        { term: "the body's threat-detection centre", th: "ศูนย์ตรวจจับภัยคุกคามของร่างกาย (ส่วนหนึ่งของสมอง)" },
        { term: "early humans relied on sound to detect approaching predators", th: "มนุษย์ยุคแรกพึ่งพาเสียงในการตรวจจับผู้ล่าที่กำลังเข้ามา" },
        { term: "a rapid spike in stress hormones", th: "ฮอร์โมนความเครียดพุ่งขึ้นอย่างรวดเร็ว" },
        { term: "remain hyperactive", th: "ยังคงทำงานมากเกินปกติอย่างต่อเนื่อง" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้า C เริ่มด้วยการยกตัวอย่างสภาพแวดล้อมที่มีเสียงรบกวนหนักเกินไป (acoustically overloaded) เช่น โรงเรียนที่อยู่ใกล้เส้นทางการบิน (schools near flight paths) ว่าเป็นตัวเต็งอันดับต้นๆ (prime candidates) ที่จะเกิดความเครียดทางจิตใจ (psychological strain) เด็กๆ ที่ทักษะการประมวลผลเสียง (auditory processing skills) ยังพัฒนาไม่เต็มที่ มีแนวโน้มจะได้รับผลกระทบด้านการรับรู้/สติปัญญามากกว่า (more likely to suffer cognitively)\n\nอีกกลุ่มหนึ่งที่มักได้รับผลกระทบอย่างรุนแรง (severely affected) คือผู้ป่วยในโรงพยาบาล (hospital patients) ที่พบว่าการฟื้นตัวของพวกเขาถูกขัดขวาง (hindered) โดยเสียงในหอผู้ป่วย (ward noise) ผู้เขียนอธิบายว่า ถ้าเราไม่ได้นอนหลับลึก (deep sleep) หรือมีสมาธิจดจ่อแบบไม่ถูกขัดจังหวะ (complete uninterrupted focus) การฟื้นฟูร่างกายตามธรรมชาติ (biological restoration) ก็ไม่สามารถเกิดขึ้นได้อย่างมีประสิทธิภาพ\n\nเมื่อเราต้องเผชิญกับเสียงหึ่งๆ ที่ดังต่อเนื่อง (constant drone) เราจะประสบกับการเปลี่ยนแปลงทางสรีรวิทยาในแง่ลบที่เกี่ยวข้องกับมัน (negative physiological changes) สิ่งนี้ทำให้เราเหนื่อยล้า (exhausting) และฝึกให้เราใช้การ “กรองทางจิตใจ” (mental filtering) เพื่อปิดกั้นสภาพแวดล้อมรอบตัว\n\nหากเราใส่หูฟังตัดเสียงรบกวนแทน (noise-cancelling headphones) เราจะได้รับการบรรเทาแบบชั่วคราว (temporary relief) แต่ในระยะยาว (In the long run) การหลีกเลี่ยง (avoidance) ไม่ใช่วิธีจัดการกับสภาพแวดล้อมในเมืองที่มีประสิทธิภาพ ผู้เขียนเรียกการบรรเทาแบบนี้ว่า “acoustic repair” ที่เป็นแบบเทียม (artificial — ตีความได้ว่า => การซ่อมแซมทางเสียงที่ไม่ใช่ของจริง เป็นแค่การกลบปัญหาไว้ชั่วคราวเท่านั้น)\n\nประโยคสุดท้ายบอกว่า หลังจากนั้น (Afterwards) คนเรามักจะเหลือความไวต่อสิ่งเร้าที่เพิ่มขึ้น (a heightened sensitivity) ซึ่งไม่เพียงเพิ่มความหงุดหงิดง่าย (increases their irritability) แต่ยังตอกย้ำการพึ่งพาความเงียบแบบเทียม (reinforces their reliance on artificial silence) มากขึ้นไปอีก\n\nสรุปใจความ: ย่อหน้านี้ชี้ว่าเสียงรบกวนกระทบทั้งเด็กและผู้ป่วยหนักเป็นพิเศษ และแม้เราจะหนีเสียงด้วยหูฟังตัดเสียง มันก็เป็นแค่ทางแก้ปัญหาชั่วคราว ที่ในระยะยาวกลับทำให้เราไวต่อเสียงมากขึ้นและยิ่งต้องพึ่งพาความเงียบเทียมมากขึ้นเรื่อยๆ",
      vocab: [
        { term: "acoustically overloaded", th: "มีเสียงรบกวนหนักเกินไปในสภาพแวดล้อมนั้น" },
        { term: "prime candidates for psychological strain", th: "ตัวเต็งอันดับต้นๆ ที่จะเกิดความเครียดทางจิตใจ" },
        { term: "hindered by ward noise", th: "ถูกขัดขวางโดยเสียงรบกวนในหอผู้ป่วย" },
        { term: "constant drone", th: "เสียงหึ่งๆ ที่ดังต่อเนื่องไม่หยุด" },
        { term: "mental filtering", th: "การกรอง/ปิดกั้นทางจิตใจเพื่อไม่รับรู้สิ่งรบกวน" },
        { term: "a heightened sensitivity", th: "ความไวต่อสิ่งเร้าที่เพิ่มขึ้นกว่าเดิม" },
        { term: "reliance on artificial silence", th: "การพึ่งพาความเงียบที่สร้างขึ้นเทียม (เช่น หูฟังตัดเสียง)" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้า D เปิดด้วยคำถามเชิงวาทศิลป์ (So why is this such a problem?) — ทำไมเรื่องนี้ถึงเป็นปัญหาขนาดนี้ ผู้เขียนบอกว่าเมื่อคนส่วนใหญ่นึกถึงผลเสียของมลพิษทางเสียง มักนึกถึงผลกระทบต่อการได้ยิน (the toll on hearing) เช่น มีงานวิจัยแสดงว่าเสียงจากโรงงานอุตสาหกรรม (industrial noise) ส่งผลเสียต่อสุขภาพการได้ยิน (auditory health)\n\nแต่ (But) การต้องทนอยู่กับ (putting up with) เสียงจราจรและเสียงเครื่องจักรที่ดังหึ่งๆ (traffic sounds and mechanical hums) อาจส่งผลต่อด้านอื่นๆ ในชีวิตของประชาชนด้วย\n\nในงานวิจัยหนึ่งที่ศึกษาชาวเยอรมันกว่า 3,000 คนเป็นเวลา 6 เดือน (over 3,000 German residents over a six-month period) พบว่าคนที่รายงานว่าอาศัยอยู่กับเสียงจราจรดังมาก มีแนวโน้มจะมีพฤติกรรมที่นำไปสู่ความขัดแย้ง (conflict-related behaviours) มากขึ้น เช่น ทะเลาะกับเพื่อนบ้าน แต่พฤติกรรมที่เชื่อมโยงกับการได้ยินเสียงรบกวนมากที่สุด (most closely linked with) คือการลาป่วย (taking sick leave)\n\nงานวิจัยอื่นๆ แสดงว่าพนักงานออฟฟิศโดยเฉลี่ยสูญเสียสมาธิในการทำงานเกือบหนึ่งในสี่ (almost a quarter of their productive focus) เพราะถูกรบกวนจากเสียงพูดคุยพื้นหลัง (distracted by background chatter) ในแบบสำรวจของสหราชอาณาจักรที่ทำกับพนักงานกว่า 22,000 คน (over 22,000 employees) ผู้ที่บอกว่าตนทำงานในออฟฟิศที่มีเสียงดังเป็นประจำ มีความพึงพอใจในงาน (job satisfaction) และความมั่นคงในการจ้างงาน (employment stability) น้อยกว่า ประโยคสุดท้ายสรุปตัวเลข: ทุกๆ 10 เดซิเบล (ten-decibel) ที่เพิ่มขึ้นบนมาตรวัดเสียงรบกวนเรื้อรัง (a measure of chronic noise) ผลิตภาพในการทำงาน (productivity) จะลดลงอย่างมีนัยสำคัญ (decreased significantly)\n\nสรุปใจความ: ย่อหน้านี้ขยายความว่าเสียงรบกวนไม่ได้กระทบแค่หูของเรา แต่ยังกระทบพฤติกรรม (ทะเลาะกัน ลาป่วย) และการทำงาน (สมาธิ ความพึงพอใจ ผลิตภาพ) ด้วย โดยมีตัวเลขงานวิจัยรองรับชัดเจน",
      vocab: [
        { term: "the toll on hearing", th: "ผลกระทบ/ความเสียหายต่อการได้ยิน" },
        { term: "putting up with traffic sounds and mechanical hums", th: "ต้องทนอยู่กับเสียงจราจรและเสียงเครื่องจักรที่ดังหึ่งๆ" },
        { term: "conflict-related behaviours", th: "พฤติกรรมที่นำไปสู่ความขัดแย้ง เช่น ทะเลาะกัน" },
        { term: "most closely linked with taking sick leave", th: "เชื่อมโยงใกล้ชิดที่สุดกับการลาป่วย" },
        { term: "distracted by background chatter", th: "ถูกรบกวนสมาธิจากเสียงพูดคุยพื้นหลัง" },
        { term: "for every ten-decibel increase", th: "ทุกๆ 10 เดซิเบลที่เพิ่มขึ้น" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้า E เปลี่ยนไปพูดถึงผลกระทบด้านสุขภาพที่ร้ายแรงกว่านั้น: การได้ยินเสียงรบกวน (Noise exposure) มีความสัมพันธ์ (correlates) กับปัญหาสุขภาพและความเป็นอยู่ที่ดี (health and well-being problems) ที่ร้ายแรง แนวโน้มที่จะต้องทนอยู่กับสภาพแวดล้อมที่มีเสียงดัง (endure loud environments) เชื่อมโยงกับสุขภาพหัวใจและหลอดเลือดที่แย่ลง (poor cardiovascular health) รวมถึงความดันโลหิตสูง (hypertension) และโรคหัวใจ (heart disease) ที่มีระดับสูงขึ้น\n\nจากงานวิจัยจำนวนมาก (Across numerous studies) นักวิจัยพบว่าคนที่ได้ยินเสียงรบกวนตอนกลางคืนเป็นประจำ (regularly experience nighttime noise) รายงานปัญหาสุขภาพจำนวนมากกว่า เช่น ไมเกรน (migraines) และปัญหาระบบย่อยอาหาร (digestive issues) พวกเขายังมีระดับความเครียด (stress) ที่สูงขึ้นและคุณภาพการนอนหลับที่แย่ลง (poor sleep quality) มีแนวโน้มน้อยกว่าที่จะเข้าสู่วงจรการนอนหลับที่ช่วยฟื้นฟูร่างกายได้จริง (restorative sleep cycles) และมักใช้กลยุทธ์การรับมือที่เป็นอันตราย (destructive coping strategies) เพื่อจัดการกับความเหนื่อยล้าของตน\n\nประโยคสุดท้ายอ้างอิงตัวเลขจากการศึกษาคนกว่า 700 คน (over 700 people) นักวิทยาศาสตร์พบว่าคนที่มักเจอเสียงรบกวนจากที่อยู่อาศัย (prone to residential noise) มีความเสี่ยงสุขภาพหัวใจแย่ลงสูงกว่าถึง 63% (a 63% greater risk of poor heart health) แม้จะคำนวณหักปัจจัยด้านไลฟ์สไตล์และประชากรศาสตร์อื่นๆ ออกไปแล้วก็ตาม (after accounting for other lifestyle traits and demographics)\n\nสรุปใจความ: ย่อหน้านี้ยกระดับความร้ายแรงของปัญหาขึ้นไปอีกขั้น — เสียงรบกวนไม่ได้แค่กวนใจ แต่เชื่อมโยงกับโรคหัวใจ ความดันสูง ไมเกรน และปัญหาการนอน โดยมีตัวเลขวิจัยยืนยันชัดเจนถึง 63%",
      vocab: [
        { term: "correlates with serious health and well-being problems", th: "มีความสัมพันธ์กับปัญหาสุขภาพและความเป็นอยู่ที่ดีอย่างร้ายแรง" },
        { term: "poor cardiovascular health", th: "สุขภาพหัวใจและหลอดเลือดที่แย่ลง" },
        { term: "regularly experience nighttime noise", th: "ได้ยินเสียงรบกวนตอนกลางคืนเป็นประจำ" },
        { term: "restorative sleep cycles", th: "วงจรการนอนหลับที่ช่วยฟื้นฟูร่างกายได้จริง" },
        { term: "destructive coping strategies", th: "กลยุทธ์การรับมือที่เป็นอันตราย/ไม่ดีต่อตัวเอง" },
        { term: "a 63% greater risk of poor heart health", th: "มีความเสี่ยงสุขภาพหัวใจแย่ลงสูงกว่าถึง 63%" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าสุดท้าย (F) ปิดท้ายด้วยทางออก: การหาวิธีจัดการสภาพแวดล้อมทางเสียงของเราให้ดีขึ้น (managing our acoustic environment) คือหนึ่งในทางออกจากวัฏจักรอุบาทว์ของมลพิษทางเสียง (the vicious cycle of noise pollution) ก้าวแรกที่สำคัญคือการจัดการผังเมือง (urban planning) และมุมมองที่เรามีต่อภูมิทัศน์เสียง (soundscapes)\n\nมีกลยุทธ์ที่อิงหลักฐานเชิงประจักษ์ (evidence-based strategies) หลายอย่างที่ช่วยให้เราแทรกเสียงธรรมชาติ (introduce natural sounds) เข้าไปเพื่อครองความสนใจของจิตใจ (occupy our minds) เวลาที่เราต้องการกลบเสียงอุตสาหกรรมที่เราหนีไม่พ้น (mask the industrial noises we cannot escape) ตัวอย่างเช่น การเพิ่มลานน้ำพุ (water features) ในจัตุรัสสาธารณะ (public squares) สามารถเพิ่มความรู้สึกทางบวกต่อพื้นที่นั้นได้ การออกแบบอาคารด้วยวัสดุดูดซับเสียง (acoustic dampening materials) ก็ช่วยตัดวงจรการก้องสะท้อนของเสียง (the noise reverberation cycle) ได้เช่นกัน\n\nผู้เขียนแนะนำว่าเราควรยอมรับว่าเมืองเสียงดัง (cities are loud) แต่ไม่ควรยอมรับการออกแบบเสียงที่แย่มากเกินไป (not be overly accepting of poor acoustic design) และควรเตือนตัวเองว่าเราไม่ใช่คนรุ่นแรกที่ต้องเจอกับเสียงรบกวนในเมือง (not the first generation to face urban noise) การทำเช่นนี้จะช่วยลดความรุนแรง (take the edge off) ของผลกระทบทางจิตใจในแง่ลบที่เราเจอเมื่ออาศัยอยู่ในสภาพแวดล้อมที่วุ่นวาย (chaotic environments) ประโยคสุดท้ายสรุปว่าทั้งหมดนี้จะช่วยให้เราทวงคืนความสงบในเมือง (reclaim our urban tranquility) ได้ง่ายขึ้น\n\nสรุปใจความ: ย่อหน้าปิดท้ายเสนอทางออกเชิงบวก — ไม่ใช่การหนีเสียงแบบเทียม (หูฟังตัดเสียง) แต่คือการวางผังเมืองและออกแบบพื้นที่ให้มีเสียงธรรมชาติกลบเสียงรบกวน พร้อมปรับมุมมองของเราเองต่อเสียงในเมือง",
      vocab: [
        { term: "the vicious cycle of noise pollution", th: "วัฏจักรอุบาทว์ของมลพิษทางเสียง ที่วนซ้ำแก้ไม่หาย" },
        { term: "evidence-based strategies", th: "กลยุทธ์ที่อิงหลักฐานเชิงประจักษ์ ไม่ใช่การเดา" },
        { term: "mask the industrial noises we cannot escape", th: "กลบเสียงอุตสาหกรรมที่เราหนีไม่พ้น" },
        { term: "acoustic dampening materials", th: "วัสดุดูดซับ/ลดทอนเสียง" },
        { term: "not be overly accepting of poor acoustic design", th: "ไม่ควรยอมรับการออกแบบเสียงที่แย่มากจนเกินไป" },
        { term: "reclaim our urban tranquility", th: "ทวงคืนความสงบในเมืองกลับคืนมา" }
      ]
    }
  },
  "beyond petroleum the search for sustainable plastics": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้บอกว่าพลาสติก (Plastic) คือหนึ่งในวัสดุที่นิยามยุคสมัยใหม่ (one of the defining materials of the modern age) เพราะมันราคาถูก น้ำหนักเบา และใช้งานได้หลากหลายอย่างยิ่ง (Cheap, lightweight and extraordinarily versatile) จนเปลี่ยนแปลงอุตสาหกรรมต่างๆ ตั้งแต่บรรจุภัณฑ์อาหารไปจนถึงการแพทย์ (from food packaging to healthcare)\n\nแต่ (Yet) ต้นทุนด้านสิ่งแวดล้อมของมัน (its environmental cost) กำลังเพิ่มขึ้นจนเพิกเฉยไม่ได้อีกแล้ว (becoming impossible to ignore) ผู้เขียนยกตัวเลข: มีพลาสติกประมาณ 8 ล้านตัน (An estimated eight million tonnes) ไหลลงสู่มหาสมุทรทั่วโลกทุกปี และพลาสติกทั่วไปส่วนใหญ่ทำมาจากเชื้อเพลิงฟอสซิล (derived from fossil fuels) ทำให้มันเป็นตัวการสำคัญที่ปล่อยก๊าซเรือนกระจก (a significant contributor to greenhouse gas emissions)\n\nประโยคสุดท้ายบอกว่า ด้วยแรงกดดันที่เพิ่มขึ้นจากรัฐบาล ผู้บริโภค และกลุ่มสิ่งแวดล้อม (governments, consumers and environmental groups) นักวิทยาศาสตร์และผู้ผลิตจึงกำลังแข่งกันพัฒนาทางเลือก (racing to develop alternatives) ที่ให้ประสิทธิภาพเทียบเท่าพลาสติกแต่ไม่ทิ้งมรดกด้านสิ่งแวดล้อมแบบเดิม (without its environmental legacy)\n\nสรุปใจความ: ย่อหน้านี้เปิดเรื่องด้วยการยกย่องข้อดีของพลาสติก ก่อนจะพลิกมาชี้ปัญหาสิ่งแวดล้อมที่ร้ายแรง ซึ่งเป็นแรงผลักดันให้เกิดการค้นหาพลาสติกทางเลือกที่จะพูดถึงตลอดทั้งบทความ",
      vocab: [
        { term: "one of the defining materials of the modern age", th: "หนึ่งในวัสดุที่เป็นเอกลักษณ์ของยุคสมัยใหม่" },
        { term: "extraordinarily versatile", th: "ใช้งานได้หลากหลายอย่างยิ่ง" },
        { term: "an estimated eight million tonnes", th: "ปริมาณโดยประมาณ 8 ล้านตัน" },
        { term: "derived from fossil fuels", th: "ทำมาจาก/สกัดมาจากเชื้อเพลิงฟอสซิล" },
        { term: "a significant contributor to greenhouse gas emissions", th: "ตัวการสำคัญที่ทำให้เกิดการปล่อยก๊าซเรือนกระจก" },
        { term: "without its environmental legacy", th: "โดยไม่ทิ้งผลกระทบสิ่งแวดล้อมแบบที่พลาสติกเดิมทิ้งไว้" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าปัญหาหลักของการหาวัสดุมาแทนพลาสติก (The challenge of replacing plastic) อยู่ที่ว่าพลาสติกมีประสิทธิภาพดีมากแค่ไหน (just how well it performs) มีคำอธิบายจาก Dr Sarah Greenfield นักวิทยาศาสตร์ด้านวัสดุ (a materials scientist) จากมหาวิทยาลัย Bristol ว่าพลาสติกครองความนิยม (owe their dominance) เพราะคุณสมบัติผสมผสานที่มีเอกลักษณ์ (a unique combination of properties): กันน้ำ (water-resistant) ขึ้นรูปได้แทบทุกทรง (moulded into almost any shape) และสามารถออกแบบให้แข็งหรือยืดหยุ่นได้ตามการใช้งาน (either rigid or flexible depending on the application)\n\nจากนั้นมีคำพูดอ้างอิงของเธอโดยตรง: “Conventional plastics are the product of decades of refinement.” (ตีความได้ว่า => พลาสติกทั่วไปคือผลลัพธ์จากการปรับปรุงพัฒนามาหลายสิบปี) เธอบอกว่าการทำให้วัสดุจากพืชให้ประสิทธิภาพเทียบเท่า (Matching that performance with a bio-based alternative) เป็นความท้าทายที่ยิ่งใหญ่ (a formidable challenge) และย้ำว่าเราไม่สามารถแค่สลับวัสดุหนึ่งไปเป็นอีกวัสดุหนึ่งได้ง่ายๆ โดยไม่ต้องใช้งานวิศวกรรมอย่างมาก (without a great deal of engineering work)\n\nสรุปใจความ: ย่อหน้านี้อธิบายว่าทำไมการหาพลาสติกทางเลือกถึงยากมาก — เพราะพลาสติกแบบเดิมถูกพัฒนามานานหลายสิบปีจนสมบูรณ์แบบในเชิงคุณสมบัติ การจะหาอะไรมาแทนที่จึงต้องใช้ความพยายามทางวิศวกรรมมหาศาล",
      vocab: [
        { term: "owe their dominance to a unique combination of properties", th: "ครองความนิยมได้เพราะคุณสมบัติผสมผสานที่มีเอกลักษณ์เฉพาะตัว" },
        { term: "rigid or flexible depending on the application", th: "แข็งหรือยืดหยุ่นได้ตามลักษณะการใช้งาน" },
        { term: "the product of decades of refinement", th: "ผลลัพธ์จากการปรับปรุงพัฒนามาหลายสิบปี" },
        { term: "a formidable challenge", th: "ความท้าทายที่ยิ่งใหญ่/หนักหน่วงมาก" },
        { term: "without a great deal of engineering work", th: "โดยไม่ต้องใช้งานด้านวิศวกรรมอย่างมาก" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้แนะนำทางเลือกที่ถูกพัฒนาในเชิงพาณิชย์มากที่สุด (The most commercially developed alternative): กรดพอลิแลกติก หรือ PLA (polylactic acid) ซึ่งเป็นพลาสติกชีวภาพ (a bioplastic) ที่ผลิตจากแป้งพืชที่ผ่านการหมัก (derived from fermented plant starch) ส่วนใหญ่มาจากข้าวโพดหรืออ้อย (most commonly from maize or sugarcane)\n\nPLA ถูกนำไปใช้แล้วในผลิตภัณฑ์หลากหลายชนิด ตั้งแต่บรรจุภัณฑ์อาหารไปจนถึงอุปกรณ์ฝังในร่างกาย (medical implants) และมันย่อยสลายได้จริง (genuinely biodegradable) ภายใต้เงื่อนไขการหมักปุ๋ยระดับอุตสาหกรรม (industrial composting conditions) ประโยคสุดท้ายยกตัวอย่างบริษัท NatureWorks จากรัฐ Minnesota สหรัฐฯ ที่ลงทุนอย่างหนัก (invested heavily) เพื่อขยายกำลังการผลิต PLA (scaling up PLA production) จนตอนนี้มีวัสดุนี้วางขายในปริมาณเชิงพาณิชย์ที่มีนัยสำคัญแล้ว (significant commercial quantities)\n\nสรุปใจความ: PLA คือความหวังแรกที่จับต้องได้จริงในตลาด — เป็นพลาสติกชีวภาพที่ผลิตจากพืช ย่อยสลายได้จริงในโรงงานปุ๋ยหมัก และถูกผลิตในระดับอุตสาหกรรมแล้วโดยบริษัทอย่าง NatureWorks",
      vocab: [
        { term: "the most commercially developed alternative", th: "ทางเลือกที่ถูกพัฒนาไปใช้ในเชิงพาณิชย์มากที่สุด" },
        { term: "derived from fermented plant starch", th: "ผลิตมาจากแป้งพืชที่ผ่านกระบวนการหมัก" },
        { term: "genuinely biodegradable", th: "ย่อยสลายได้ตามธรรมชาติจริง (ไม่ใช่แค่คำโฆษณา)" },
        { term: "industrial composting conditions", th: "เงื่อนไขการหมักปุ๋ยระดับโรงงานอุตสาหกรรม (อุณหภูมิ/ความชื้นที่ควบคุมได้)" },
        { term: "invested heavily in scaling up production", th: "ลงทุนอย่างหนักเพื่อขยายกำลังการผลิต" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้แนะนำวัสดุกลุ่มใหม่ที่มีแนวโน้มดีกว่าเดิม (A newer and potentially more promising category): วัสดุที่ทำจากสาหร่ายทะเล (materials derived from seaweed) ต่างจากข้าวโพดหรืออ้อย สาหร่ายทะเลไม่ต้องใช้น้ำจืด ที่ดินเพื่อการเกษตร หรือปุ๋ยเลย (no freshwater, no agricultural land and no fertilisers to grow) มันดูดซับคาร์บอนไดออกไซด์ขณะเติบโต (absorbs carbon dioxide as it grows) และสามารถเก็บเกี่ยวได้ภายในไม่กี่สัปดาห์ (harvested in a matter of weeks)\n\nกลุ่มวิจัยในเนเธอร์แลนด์ ออสเตรเลีย และเกาหลีใต้ ได้แสดงให้เห็นแล้วว่าวัสดุจากสาหร่ายสามารถแปรรูปเป็นแผ่นฟิล์ม ภาชนะ และแม้แต่สิ่งทอ (films, containers and even textiles) ที่มีคุณสมบัติเทียบเท่าพลาสติกทั่วไปได้ ประโยคสุดท้ายยกตัวอย่างบริษัท Evoware จากอินโดนีเซียที่พัฒนาบรรจุภัณฑ์อาหารจากสาหร่ายซึ่งไม่เพียงย่อยสลายได้ (biodegradable) แต่ยังกินได้ (edible) ด้วย\n\nสรุปใจความ: สาหร่ายทะเลคือทางเลือกใหม่ที่มีข้อได้เปรียบเหนือ PLA อย่างชัดเจน คือไม่แย่งที่ดิน น้ำ หรือปุ๋ยจากการเกษตร และยังช่วยดูดซับคาร์บอนไปในตัว",
      vocab: [
        { term: "a newer and potentially more promising category", th: "กลุ่มวัสดุใหม่ที่มีแนวโน้มดีกว่าเดิม" },
        { term: "no freshwater, no agricultural land and no fertilisers", th: "ไม่ต้องใช้น้ำจืด ที่ดินเพื่อการเกษตร หรือปุ๋ยเลย" },
        { term: "absorbs carbon dioxide as it grows", th: "ดูดซับคาร์บอนไดออกไซด์ขณะที่มันเติบโต" },
        { term: "harvested in a matter of weeks", th: "เก็บเกี่ยวได้ภายในเวลาไม่กี่สัปดาห์" },
        { term: "properties comparable to conventional plastics", th: "คุณสมบัติที่เทียบเท่ากับพลาสติกทั่วไป" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้เริ่มเปิดเผยข้อจำกัด (Despite these advances) แม้จะมีความก้าวหน้า พลาสติกชีวภาพ (bioplastics) ก็ยังเจออุปสรรคเชิงปฏิบัติที่สำคัญ (significant practical obstacles) ปัญหาที่ถูกพูดถึงบ่อยที่สุด (One of the most frequently cited concerns) เกี่ยวข้องกับการใช้ที่ดิน (land use): การขยายการผลิตพลาสติกชีวภาพจากพืชผลให้มากพอจะทดแทนพลาสติกทั่วโลกได้แม้เพียงเสี้ยวหนึ่ง (even a fraction) จะต้องใช้ที่ดินเกษตรกรรมมหาศาล (vast areas of agricultural land) ซึ่งอาจแย่งพื้นที่กับการผลิตอาหาร (potentially competing with food production)\n\nDr Greenfield ยอมรับความตึงเครียดนี้ (acknowledges this tension) ด้วยคำพูดว่า: “There is a real risk that solving one environmental problem creates another.” (ตีความได้ว่า => มีความเสี่ยงจริงที่การแก้ปัญหาสิ่งแวดล้อมข้อหนึ่งจะไปสร้างปัญหาใหม่ขึ้นมาแทน) เธอบอกว่าถ้าเราเปลี่ยนพื้นที่เกษตรกรรมขนาดใหญ่ไปปลูกวัตถุดิบสำหรับพลาสติกชีวภาพ (feedstocks) เราอาจดันราคาอาหารให้สูงขึ้นและเร่งการตัดไม้ทำลายป่า (accelerate deforestation)\n\nสรุปใจความ: ย่อหน้านี้เตือนว่าพลาสติกชีวภาพจากพืชผลไม่ใช่คำตอบที่สมบูรณ์แบบ เพราะการปลูกพืชวัตถุดิบในปริมาณมากอาจไปแย่งที่ดินทำการเกษตรอาหาร และสร้างปัญหาใหม่ เช่น ราคาอาหารแพงขึ้นและป่าไม้ถูกทำลาย",
      vocab: [
        { term: "significant practical obstacles", th: "อุปสรรคเชิงปฏิบัติที่สำคัญ ใช้งานจริงยาก" },
        { term: "vast areas of agricultural land", th: "พื้นที่ที่ดินเกษตรกรรมขนาดมหาศาล" },
        { term: "competing with food production", th: "แย่งพื้นที่/ทรัพยากรกับการผลิตอาหาร" },
        { term: "acknowledges this tension", th: "ยอมรับว่ามีความตึงเครียด/ความขัดแย้งนี้อยู่จริง" },
        { term: "accelerate deforestation", th: "เร่งให้การตัดไม้ทำลายป่าเกิดเร็วขึ้น" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้ยกปัญหาเพิ่มเติม (A further complication): พลาสติกชีวภาพหลายชนิดไม่ได้ย่อยสลายในสภาพแวดล้อมทั่วไป (do not biodegrade in ordinary conditions) ยกตัวอย่างเช่น PLA ที่ต้องใช้โรงงานหมักปุ๋ยระดับอุตสาหกรรมที่มีอุณหภูมิสูง (industrial composting facilities operating at high temperatures) จึงจะย่อยสลายได้ภายในเวลาที่เหมาะสม ถ้าถูกทิ้งในหลุมฝังกลบ (Left in a landfill) มันสามารถคงอยู่ได้นานเกือบเท่าพลาสติกทั่วไป (can persist almost as long as conventional plastic)\n\nThomas Lindqvist นักวิจัยจากมหาวิทยาลัย Lund ในสวีเดน ผู้เชี่ยวชาญด้านนโยบายการจัดการขยะ (waste management policy) ได้โต้แย้งว่า การติดฉลากวัสดุเหล่านี้ว่า “biodegradable” โดยไม่มีเงื่อนไขกำกับ (without qualification) นั้นทำให้ผู้บริโภคเข้าใจผิด (misleading to consumers) และอาจบั่นทอนความพยายามในการปรับปรุงพฤติกรรมการรีไซเคิล (undermine efforts to improve recycling behaviour)\n\nสรุปใจความ: ย่อหน้านี้เตือนว่าคำว่า “ย่อยสลายได้” อาจเป็นคำโฆษณาที่ทำให้เข้าใจผิด เพราะ PLA ต้องการเงื่อนไขพิเศษ (โรงงานปุ๋ยหมักอุณหภูมิสูง) ถึงจะย่อยสลายได้จริง ไม่ใช่แค่ทิ้งไว้เฉยๆ ก็จะย่อยสลายเอง",
      vocab: [
        { term: "do not biodegrade in ordinary conditions", th: "ไม่ย่อยสลายในสภาพแวดล้อมทั่วไป" },
        { term: "industrial composting facilities operating at high temperatures", th: "โรงงานหมักปุ๋ยระดับอุตสาหกรรมที่ทำงานที่อุณหภูมิสูง" },
        { term: "can persist almost as long as conventional plastic", th: "คงอยู่ได้นานเกือบเท่าพลาสติกทั่วไป ไม่ย่อยสลายง่าย" },
        { term: "misleading to consumers", th: "ทำให้ผู้บริโภคเข้าใจผิด" },
        { term: "undermine efforts to improve recycling behaviour", th: "บั่นทอนความพยายามในการปรับปรุงพฤติกรรมการรีไซเคิล" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้านี้ท้าทายสมมติฐานที่ว่าพลาสติกชีวภาพดีต่อสภาพภูมิอากาศเสมอ (challenged the assumption that bioplastics are automatically better for the climate) มีการวิเคราะห์วัฏจักรชีวิตของผลิตภัณฑ์ (A lifecycle analysis) ที่เผยแพร่โดยองค์การสิ่งแวดล้อมยุโรป (the European Environment Agency) พบว่าการผลิตพลาสติกชีวภาพจากพืชผลบางชนิดปล่อยก๊าซเรือนกระจกมากกว่าพลาสติกทั่วไปที่มันตั้งใจจะไปแทนที่เสียอีก (generates more greenhouse gas emissions than the conventional plastics they are intended to replace) เมื่อคำนวณรวมการเปลี่ยนแปลงการใช้ที่ดินและปัจจัยการผลิตทางการเกษตร (once land-use change and agricultural inputs are factored in) เข้าไปด้วย\n\nประโยคสุดท้ายบอกว่าผลการค้นพบเหล่านี้ทำให้เกิดเสียงเรียกร้อง (prompted calls) ให้มีการรับรอง/ตรวจสอบอย่างอิสระที่เข้มงวดขึ้น (more rigorous independent certification) ก่อนที่ผลิตภัณฑ์จะสามารถถูกทำการตลาดว่า “ยั่งยืน” (marketed as sustainable) ได้\n\nสรุปใจความ: ย่อหน้านี้เป็นจุดพลิกสำคัญของบทความ — พลาสติกชีวภาพบางชนิดอาจแย่กว่าพลาสติกธรรมดาในแง่ก๊าซเรือนกระจกเสียด้วยซ้ำ เมื่อคิดรวมผลกระทบจากการใช้ที่ดิน จึงต้องมีการตรวจสอบรับรองที่เข้มงวดกว่าเดิม",
      vocab: [
        { term: "challenged the assumption that bioplastics are automatically better", th: "ท้าทาย/โต้แย้งข้อสมมติที่ว่าพลาสติกชีวภาพย่อมดีกว่าเสมอ" },
        { term: "a lifecycle analysis", th: "การวิเคราะห์วัฏจักรชีวิตของผลิตภัณฑ์ (ตั้งแต่ผลิตจนถึงกำจัดทิ้ง)" },
        { term: "once land-use change and agricultural inputs are factored in", th: "เมื่อคำนวณรวมการเปลี่ยนแปลงการใช้ที่ดินและปัจจัยการเกษตรเข้าไปด้วย" },
        { term: "prompted calls for more rigorous independent certification", th: "ก่อให้เกิดเสียงเรียกร้องให้มีการรับรองอย่างอิสระที่เข้มงวดขึ้น" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้าปิดท้ายกลับมาให้มุมมองเชิงบวกอีกครั้ง: แม้จะมีความซับซ้อนเหล่านี้ (Despite these complications) อุตสาหกรรมพลาสติกชีวภาพยังคงดึงดูดการลงทุนและผลผลิตอย่างมาก (continues to attract significant investment and output) โดยคาดว่าผลผลิตจะเพิ่มขึ้นมากกว่าสามเท่า (more than triple) ภายในปี 2030\n\nการพัฒนาวัสดุยุคใหม่ (next-generation materials) โดยเฉพาะที่มาจากสาหร่ายทะเล สาหร่ายเซลล์เดียว และเศษวัสดุเหลือใช้ทางการเกษตร (seaweed, algae and agricultural waste) เปิดความเป็นไปได้ที่จะมีทางเลือกที่ยั่งยืนอย่างแท้จริง (genuinely sustainable alternatives) ที่หลีกเลี่ยงปัญหาการใช้ที่ดินของพลาสติกชีวภาพรุ่นแรก (first-generation bioplastics) ได้\n\nประโยคสุดท้ายอ้างคำพูดของ Professor Liu Wei แห่งมหาวิทยาลัย Tsinghua ในปักกิ่ง ผู้นำโครงการวิจัยวัสดุชีวภาพขนาดใหญ่ที่สุดแห่งหนึ่งของจีน ว่ามองในแง่ดีอย่างระมัดระวัง (cautiously optimistic): “We are still in the early stages. But the science is advancing rapidly, and many of the barriers that seemed insurmountable a decade ago are beginning to fall.” (ตีความได้ว่า => เรายังอยู่ในช่วงเริ่มต้น แต่วิทยาศาสตร์กำลังก้าวหน้าอย่างรวดเร็ว และอุปสรรคที่เมื่อสิบปีก่อนดูเหมือนจะข้ามไม่ได้ กำลังเริ่มถูกทลายลง)\n\nสรุปใจความ: บทความปิดท้ายด้วยความหวังที่ระมัดระวัง — แม้พลาสติกชีวภาพรุ่นแรกจะมีปัญหา แต่วัสดุรุ่นใหม่จากสาหร่ายและเศษวัสดุเหลือใช้กำลังพัฒนาอย่างรวดเร็ว และการลงทุนก็ยังคงเพิ่มขึ้นต่อเนื่อง",
      vocab: [
        { term: "continues to attract significant investment and output", th: "ยังคงดึงดูดการลงทุนและผลผลิตอย่างมีนัยสำคัญ" },
        { term: "projected to more than triple by 2030", th: "คาดการณ์ว่าจะเพิ่มขึ้นมากกว่าสามเท่าภายในปี 2030" },
        { term: "next-generation materials", th: "วัสดุยุคถัดไป/รุ่นใหม่" },
        { term: "genuinely sustainable alternatives", th: "ทางเลือกที่ยั่งยืนอย่างแท้จริง" },
        { term: "cautiously optimistic", th: "มองในแง่ดีแต่ยังระมัดระวัง ไม่มั่นใจเต็มที่" },
        { term: "barriers that seemed insurmountable a decade ago", th: "อุปสรรคที่เมื่อสิบปีก่อนดูเหมือนจะข้ามผ่านไม่ได้" }
      ]
    }
  },
  "growing upwards the vertical farming revolution": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้บอกว่าเมื่อประชากรโลก (the world's population) เพิ่มขึ้นต่อเนื่องและพื้นที่เมืองขยายตัว (urban areas expand) การหาอาหารเลี้ยงเมือง (feeding cities) กำลังกลายเป็นความท้าทายที่ซับซ้อนขึ้นเรื่อยๆ (an increasingly complex challenge) เกษตรกรรมแบบดั้งเดิม (Traditional agriculture) ต้องพึ่งพาที่ดินผืนใหญ่ สภาพอากาศที่แน่นอน และแหล่งน้ำที่เชื่อถือได้ (vast tracts of land, stable weather and reliable water supplies) ซึ่งทั้งหมดนี้กำลังถูกกดดันจากการเปลี่ยนแปลงสภาพภูมิอากาศและการเติบโตของประชากร (climate change and population growth)\n\nทางออกหนึ่งที่ได้รับความสนใจมากขึ้น (One solution that has attracted growing interest) คือการทำฟาร์มแนวตั้ง (vertical farming): การปลูกพืชเป็นชั้นๆ ซ้อนกัน (in stacked layers) ภายในสภาพแวดล้อมปิดที่ควบคุมได้ (controlled indoor environments) ผู้สนับสนุนแนวคิดนี้ (Proponents) โต้แย้งว่าฟาร์มแนวตั้งอาจช่วยรักษาความมั่นคงทางอาหารในเมือง (secure urban food supplies) ได้ ในขณะเดียวกันก็ลดผลกระทบด้านสิ่งแวดล้อมของการเกษตร (the environmental footprint of agriculture) ลงอย่างมาก\n\nสรุปใจความ: ย่อหน้านี้ตั้งปัญหาให้ผู้อ่านเข้าใจก่อนว่า เกษตรกรรมแบบเดิมกำลังเจอแรงกดดันจากการเปลี่ยนแปลงสภาพภูมิอากาศและประชากรที่เพิ่มขึ้น จึงนำไปสู่แนวคิดฟาร์มแนวตั้งที่จะพูดถึงตลอดทั้งบทความ",
      vocab: [
        { term: "an increasingly complex challenge", th: "ความท้าทายที่ซับซ้อนขึ้นเรื่อยๆ" },
        { term: "vast tracts of land, stable weather and reliable water supplies", th: "ที่ดินผืนใหญ่ สภาพอากาศที่แน่นอน และแหล่งน้ำที่เชื่อถือได้" },
        { term: "growing in stacked layers inside controlled indoor environments", th: "การปลูกพืชเป็นชั้นๆ ซ้อนกันในสภาพแวดล้อมปิดที่ควบคุมได้" },
        { term: "secure urban food supplies", th: "รักษาความมั่นคงของแหล่งอาหารในเมือง" },
        { term: "the environmental footprint of agriculture", th: "ผลกระทบต่อสิ่งแวดล้อมที่เกิดจากการทำเกษตรกรรม" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าเสน่ห์ของฟาร์มแนวตั้ง (The appeal of vertical farming) อยู่ที่ความมีประสิทธิภาพ (its efficiency) เพราะสภาพแวดล้อมการปลูก (the growing environment) ถูกควบคุมทั้งหมด (entirely controlled) พืชจึงสามารถผลิตได้ตลอดทั้งปี (year-round) ไม่ว่าจะฤดูกาลหรือสภาพอากาศแบบใดก็ตาม น้ำถูกส่งตรงไปยังรากพืชผ่านระบบไฮโดรโปนิกส์ (hydroponic systems) โดยใช้น้ำเพียงเสี้ยวหนึ่งของปริมาณที่ต้องใช้ในการทำฟาร์มแบบเปิดทั่วไป (a fraction of the volume required in conventional field farming) ส่วนแสงเทียม (Artificial lighting) ที่ปรับให้เหมาะกับความต้องการเฉพาะของพืชแต่ละชนิด (calibrated to match the specific needs of each crop) ก็เข้ามาแทนที่แสงแดด (replaces sunlight)\n\nประโยคสุดท้ายอ้างคำพูดของ Dickson Despommier ศาสตราจารย์จากมหาวิทยาลัย Columbia ในนิวยอร์ก ผู้ที่ถูกยกให้เป็นผู้ริเริ่มแนวคิดฟาร์มแนวตั้ง (widely regarded as the founding theorist of vertical farming) ว่าฟาร์มแนวตั้งสูง 30 ชั้นเพียงแห่งเดียวสามารถเลี้ยงคน 50,000 คนได้นานหนึ่งปี (could feed 50,000 people for a year)\n\nสรุปใจความ: ย่อหน้านี้อธิบายว่าฟาร์มแนวตั้งมีประสิทธิภาพสูงเพราะควบคุมทุกอย่างได้ ทั้งแสง น้ำ และฤดูกาล จึงปลูกได้ตลอดปีและใช้น้ำน้อยกว่ามาก",
      vocab: [
        { term: "the growing environment is entirely controlled", th: "สภาพแวดล้อมในการปลูกถูกควบคุมได้ทั้งหมด" },
        { term: "hydroponic systems", th: "ระบบไฮโดรโปนิกส์ (ปลูกพืชโดยส่งน้ำ/สารอาหารตรงไปที่ราก ไม่ใช้ดิน)" },
        { term: "a fraction of the volume required in conventional field farming", th: "ปริมาณเพียงเสี้ยวเดียวของที่ต้องใช้ในฟาร์มแบบเปิดทั่วไป" },
        { term: "calibrated to match the specific needs of each crop", th: "ปรับให้ตรงกับความต้องการเฉพาะของพืชแต่ละชนิด" },
        { term: "widely regarded as the founding theorist", th: "ได้รับการยอมรับอย่างกว้างขวางว่าเป็นผู้ริเริ่มแนวคิดนี้" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้บอกว่าเทคโนโลยีนี้ไม่ได้อยู่แค่ในทฤษฎีอีกต่อไป (has already moved beyond theory) ในเมือง Newark รัฐ New Jersey บริษัท AeroFarms ดำเนินการฟาร์มแนวตั้งในร่มที่ใหญ่ที่สุดแห่งหนึ่งของโลก (one of the world's largest indoor vertical farms) โดยสามารถผลิตผักใบเขียวได้ถึง 2 ล้านกิโลกรัมต่อปี (two million kilograms of leafy greens annually)\n\nสิงคโปร์ ซึ่งนำเข้าอาหารมากกว่า 90% ของที่ใช้ (imports over 90% of its food) ได้ทำให้ฟาร์มแนวตั้งเป็นส่วนสำคัญของยุทธศาสตร์ความมั่นคงทางอาหาร (a central part of its food security strategy) โดยตั้งเป้าผลิตอาหารในประเทศให้ได้ 30% ของความต้องการทางโภชนาการภายในปี 2030 (a target of producing 30% of its nutritional needs domestically by 2030) ประโยคสุดท้ายยกตัวอย่างเมือง Dubai ที่ใช้ฟาร์มแนวตั้งปลูกพืชในสภาพอากาศที่ทำให้การเพาะปลูกกลางแจ้งเป็นไปไม่ได้ในช่วงส่วนใหญ่ของปี (would make outdoor cultivation impossible for much of the year)\n\nสรุปใจความ: ย่อหน้านี้ยกตัวอย่างจริงสามแห่งทั่วโลก (Newark, Singapore, Dubai) ที่แสดงว่าฟาร์มแนวตั้งไม่ใช่แค่แนวคิด แต่ถูกนำมาใช้จริงในระดับอุตสาหกรรมและระดับนโยบายประเทศแล้ว",
      vocab: [
        { term: "has already moved beyond theory", th: "ก้าวข้ามจากทฤษฎีไปสู่การใช้งานจริงแล้ว" },
        { term: "one of the world's largest indoor vertical farms", th: "หนึ่งในฟาร์มแนวตั้งในร่มที่ใหญ่ที่สุดของโลก" },
        { term: "imports over 90% of its food", th: "นำเข้าอาหารมากกว่า 90% ของที่ใช้ทั้งหมด" },
        { term: "a central part of its food security strategy", th: "ส่วนสำคัญหลักของยุทธศาสตร์ความมั่นคงทางอาหาร" },
        { term: "would make outdoor cultivation impossible", th: "จะทำให้การเพาะปลูกกลางแจ้งเป็นไปไม่ได้เลย" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้พลิกกลับมาชี้ปัญหาใหญ่ (Yet vertical farming faces a major obstacle): การใช้พลังงาน (energy consumption) เพราะแสงธรรมชาติถูกแทนที่ด้วยแสงเทียม (natural light is replaced by artificial lighting) สถานที่เหล่านี้จึงต้องการไฟฟ้าปริมาณมหาศาล (enormous quantities of electricity)\n\nงานวิจัยจากมหาวิทยาลัย Lancaster ในสหราชอาณาจักรคำนวณว่า การปลูกผักกาดหอม 1 กิโลกรัมในฟาร์มแนวตั้งใช้พลังงานประมาณ 247 กิโลวัตต์-ชั่วโมง (approximately 247 kilowatt-hours) เทียบกับเพียง 1 กิโลวัตต์-ชั่วโมงในเรือนกระจกทั่วไป (a conventional greenhouse) — ตัวเลขต่างกันมหาศาลถึง 247 เท่า ประโยคสุดท้ายเตือนว่า ถ้าไฟฟ้านั้นมาจากเชื้อเพลิงฟอสซิล (comes from fossil fuels) รอยเท้าคาร์บอน (carbon footprint) ของผักที่ปลูกในฟาร์มแนวตั้งอาจจะสูงกว่าผักที่ปลูกกลางแจ้งแล้วขนส่งมาจากต่างประเทศเสียอีก (may actually be higher than that of field-grown crops transported from overseas)\n\nสรุปใจความ: ย่อหน้านี้เผยจุดอ่อนสำคัญที่สุดของฟาร์มแนวตั้ง — แม้จะประหยัดน้ำและที่ดิน แต่ใช้ไฟฟ้ามหาศาลกว่าฟาร์มทั่วไปมาก จนอาจทำให้เป็นมิตรต่อสิ่งแวดล้อมน้อยกว่าที่คิดหากไฟฟ้านั้นมาจากถ่านหินหรือก๊าซ",
      vocab: [
        { term: "vertical farming faces a major obstacle", th: "ฟาร์มแนวตั้งเผชิญกับอุปสรรคใหญ่" },
        { term: "enormous quantities of electricity", th: "ปริมาณไฟฟ้ามหาศาล" },
        { term: "approximately 247 kilowatt-hours of energy", th: "พลังงานประมาณ 247 กิโลวัตต์-ชั่วโมง" },
        { term: "if that electricity comes from fossil fuels", th: "หากไฟฟ้านั้นมาจากเชื้อเพลิงฟอสซิล" },
        { term: "may actually be higher than that of field-grown crops", th: "อาจสูงกว่าของพืชที่ปลูกกลางแจ้งเสียอีก" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้เพิ่มปัญหาอีกข้อ: นักวิจารณ์ (Critics) ชี้ว่าชนิดพืชที่สามารถปลูกในฟาร์มแนวตั้งแล้วทำกำไรได้มีจำกัดมาก (the limited range of crops that can be profitably grown) ปัจจุบันการดำเนินงานเชิงพาณิชย์ (commercial operations) เกือบทั้งหมดโฟกัสอยู่ที่ผักสลัด สมุนไพร และพืชมูลค่าสูงจำนวนน้อย (salad leaves, herbs and a small number of other high-value crops) ส่วนธัญพืช พืชหัว และผลไม้ส่วนใหญ่ (Cereals, root vegetables and most fruits) ไม่คุ้มค่าทางเศรษฐกิจในบริบทนี้ (not economically viable in this setting) หมายความว่าเทคโนโลยีนี้ยังไม่สามารถแก้ปัญหาส่วนที่เป็นพื้นฐานที่สุดของอุปทานอาหารโลก (the most fundamental components of the global food supply) ได้\n\nประโยคสุดท้ายอ้างคำพูดของ Dr Tamar Makov จากมหาวิทยาลัย Ben-Gurion ในอิสราเอล ผู้วิเคราะห์คำกล่าวอ้างด้านสิ่งแวดล้อมของฟาร์มแนวตั้งอย่างละเอียด สรุปว่า “for most staple crops, vertical farming remains economically and ecologically impractical.” (ตีความได้ว่า => สำหรับพืชอาหารหลักส่วนใหญ่ ฟาร์มแนวตั้งยังคงไม่คุ้มค่าทั้งในแง่เศรษฐกิจและระบบนิเวศ)\n\nสรุปใจความ: ย่อหน้านี้ชี้ข้อจำกัดสำคัญอีกข้อ — ฟาร์มแนวตั้งเก่งแค่กับผักใบและสมุนไพร แต่ไม่สามารถผลิตอาหารหลักอย่างข้าวหรือมันฝรั่งได้อย่างคุ้มทุนเลย",
      vocab: [
        { term: "the limited range of crops that can be profitably grown", th: "ชนิดพืชที่จำกัดมากที่สามารถปลูกแล้วทำกำไรได้" },
        { term: "not economically viable in this setting", th: "ไม่คุ้มค่าทางเศรษฐกิจในบริบทนี้" },
        { term: "the most fundamental components of the global food supply", th: "ส่วนพื้นฐานที่สุดของอุปทานอาหารโลก" },
        { term: "economically and ecologically impractical", th: "ไม่สามารถทำได้จริงทั้งในแง่เศรษฐกิจและระบบนิเวศ" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้กลับมามองในแง่บวก: แม้จะมีข้อจำกัดเหล่านี้ (Despite these limitations) นักวิจัยกำลังมีความคืบหน้ากับปัญหาด้านพลังงาน (making progress on the energy problem) การพัฒนาหลอดไฟ LED ที่มีประสิทธิภาพมากขึ้นเรื่อยๆ (increasingly efficient LED lighting) ได้ลดความต้องการพลังงานของฟาร์มในร่ม (the power demands of indoor farming) ลงอย่างมากในช่วงสิบปีที่ผ่านมา\n\nฟาร์มแนวตั้งบางแห่งเริ่มถูกสร้างขึ้นใกล้กับแหล่งพลังงานหมุนเวียน (co-located with renewable energy sources) หรือสร้างในที่ที่มีพลังงานน้ำหรือพลังงานความร้อนใต้พิภพราคาถูก (cheap hydroelectric or geothermal power) ประโยคสุดท้ายยกตัวอย่างประเทศไอซ์แลนด์ (Iceland) ที่มีพลังงานความร้อนใต้พิภพ (geothermal energy) อุดมสมบูรณ์ ฟาร์มแนวตั้งที่นั่นจึงมีรอยเท้าคาร์บอน (carbon footprint) ที่เทียบเท่ากับการทำฟาร์มอินทรีย์กลางแจ้ง (comparable to organic field farming) แล้ว\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าปัญหาด้านพลังงานไม่ใช่ทางตัน — เทคโนโลยี LED ที่ดีขึ้นและการใช้พลังงานหมุนเวียน (โดยเฉพาะในไอซ์แลนด์) ช่วยให้ฟาร์มแนวตั้งเป็นมิตรต่อสิ่งแวดล้อมมากขึ้นได้จริง",
      vocab: [
        { term: "making progress on the energy problem", th: "มีความคืบหน้าในการแก้ปัญหาด้านพลังงาน" },
        { term: "increasingly efficient LED lighting", th: "หลอดไฟ LED ที่มีประสิทธิภาพมากขึ้นเรื่อยๆ" },
        { term: "co-located with renewable energy sources", th: "ถูกสร้างอยู่ใกล้กับแหล่งพลังงานหมุนเวียน" },
        { term: "cheap hydroelectric or geothermal power", th: "พลังงานน้ำหรือพลังงานความร้อนใต้พิภพราคาถูก" },
        { term: "comparable to organic field farming", th: "เทียบเท่ากับการทำฟาร์มอินทรีย์กลางแจ้ง" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าปิดท้ายสรุปว่า การลงทุนในฟาร์มแนวตั้ง (Investment in vertical farming) ยังคงเติบโตต่อเนื่อง (continues to grow) และบริษัทอาหารรายใหญ่หลายแห่งเริ่มสร้างความร่วมมือกับผู้ประกอบการฟาร์มแนวตั้ง (establishing partnerships with vertical farm operators)\n\nคำถามที่ยังไม่มีคำตอบชัดเจน (remains uncertain) คือ อุตสาหกรรมนี้จะสามารถเอาชนะความท้าทายด้านพลังงาน (overcome its energy challenges) และขยายชนิดพืชที่ปลูกได้ (expand its crop range) จนกลายเป็นผู้มีส่วนร่วมหลักในความมั่นคงทางอาหารของเมือง (a mainstream contributor to urban food security) ได้หรือไม่\n\nประโยคสุดท้ายบอกว่า นักวิเคราะห์ส่วนใหญ่เห็นด้วยกับการประเมินขององค์กร World Resources Institute ที่สรุปว่าฟาร์มแนวตั้ง “holds genuine promise as a complement to, but not a replacement for, conventional agriculture.” (ตีความได้ว่า => มีศักยภาพจริงในฐานะตัวเสริม ไม่ใช่ตัวแทนที่จะมาแทนที่เกษตรกรรมแบบดั้งเดิม)\n\nสรุปใจความ: บทความปิดท้ายด้วยมุมมองที่สมดุล — ฟาร์มแนวตั้งมีอนาคตจริง แต่ยังไม่ใช่คำตอบที่จะมาแทนที่การเกษตรแบบเดิมทั้งหมด อย่างดีที่สุดมันคือ “ตัวเสริม” ไม่ใช่ “ตัวแทน”",
      vocab: [
        { term: "establishing partnerships with vertical farm operators", th: "สร้างความร่วมมือกับผู้ประกอบการฟาร์มแนวตั้ง" },
        { term: "overcome its energy challenges", th: "เอาชนะความท้าทายด้านพลังงานของมันได้" },
        { term: "a mainstream contributor to urban food security", th: "ผู้มีส่วนร่วมหลักต่อความมั่นคงทางอาหารในเมือง" },
        { term: "holds genuine promise as a complement to", th: "มีศักยภาพจริงในฐานะตัวเสริม/ตัวช่วยเพิ่มเติมให้กับ..." },
        { term: "not a replacement for conventional agriculture", th: "ไม่ใช่สิ่งที่จะมาแทนที่เกษตรกรรมแบบดั้งเดิมได้ทั้งหมด" }
      ]
    }
  },
  "harnessing the tides the case for ocean energy": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้เริ่มด้วยจุดอ่อนที่ถูกวิจารณ์มากที่สุดของพลังงานหมุนเวียน (Among the most persistent criticisms of renewable energy): ความไม่แน่นอน (its unpredictability) แผงโซลาร์เซลล์ไม่ผลิตไฟฟ้าเลยหลังพระอาทิตย์ตก (generate no power after dark) กังหันลมก็หยุดนิ่งในวันที่ไม่มีลม (stand idle on calm days)\n\nเมื่อรัฐบาลทั่วโลกแข่งกันลดการปล่อยคาร์บอนจากระบบไฟฟ้า (race to decarbonise their electricity supplies) ปัญหาความไม่ต่อเนื่องนี้ (this intermittency problem) จึงเป็นอุปสรรคสำคัญต่อการแทนที่เชื้อเพลิงฟอสซิล พลังงานจากกระแสน้ำขึ้นน้ำลง (Tidal energy) ซึ่งดึงพลังงานจากการเคลื่อนที่ของน้ำทะเลที่ขับเคลื่อนโดยแรงโน้มถ่วงของดวงจันทร์และดวงอาทิตย์ (the gravitational pull of the moon and sun) มอบสิ่งที่ลมและแดดให้ไม่ได้: ความสามารถในการคาดการณ์ได้อย่างสมบูรณ์ (complete predictability) ประโยคสุดท้ายบอกว่ากระแสน้ำขึ้นน้ำลงเป็นวัฏจักรที่คำนวณล่วงหน้าได้เป็นศตวรรษ (calculated centuries in advance) ทำให้พลังงานน้ำขึ้นน้ำลงเป็นหนึ่งในแหล่งพลังงานหมุนเวียนที่เชื่อถือได้มากที่สุด (one of the most reliable forms of renewable energy)\n\nสรุปใจความ: ย่อหน้านี้ตั้งจุดขายหลักของพลังงานน้ำขึ้นน้ำลงไว้ตั้งแต่ต้น — ต่างจากลมและแดดที่คาดเดาไม่ได้ กระแสน้ำขึ้นน้ำลงคำนวณล่วงหน้าได้แม่นยำ นี่คือข้อได้เปรียบสำคัญที่บทความจะขยายความต่อไป",
      vocab: [
        { term: "the most persistent criticisms of renewable energy", th: "คำวิจารณ์ที่ถูกพูดถึงซ้ำๆ บ่อยที่สุดต่อพลังงานหมุนเวียน" },
        { term: "generate no power after dark", th: "ไม่ผลิตไฟฟ้าเลยหลังพระอาทิตย์ตก" },
        { term: "race to decarbonise their electricity supplies", th: "แข่งกันลดการปล่อยคาร์บอนจากระบบไฟฟ้าของตน" },
        { term: "the gravitational pull of the moon and sun", th: "แรงโน้มถ่วงของดวงจันทร์และดวงอาทิตย์ที่ทำให้เกิดน้ำขึ้นน้ำลง" },
        { term: "complete predictability", th: "ความสามารถในการคาดการณ์ล่วงหน้าได้อย่างสมบูรณ์" },
        { term: "calculated centuries in advance", th: "คำนวณล่วงหน้าได้เป็นเวลาหลายร้อยปี" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าพลังงานน้ำขึ้นน้ำลงถูกดักจับได้สองวิธีหลัก (Tidal energy can be captured in two main ways) วิธีแรกคือเทคโนโลยีน้ำขึ้นน้ำลงแบบกักน้ำ (Tidal range technology) ที่ใช้เขื่อนกั้นน้ำหรือทะเลสาบกักน้ำ (barrages or lagoons) เพื่อกักน้ำไว้ตอนน้ำขึ้น (trap water at high tide) แล้วปล่อยผ่านกังหัน (release it through turbines) ตอนน้ำลง สร้างไฟฟ้าในลักษณะคล้ายเขื่อนพลังน้ำทั่วไป (a conventional hydroelectric dam)\n\nอีกวิธีหนึ่งคือเทคโนโลยีกระแสน้ำขึ้นน้ำลง (Tidal stream technology) ที่วางกังหันตรงไปในกระแสน้ำขึ้นน้ำลงที่ไหลเร็ว (fast-moving tidal currents) คล้ายกับกังหันลมใต้น้ำ (underwater wind turbines) Dr Lucy Croft จากมหาวิทยาลัย Exeter ผู้ที่ศึกษาทั้งสองวิธี ระบุว่าวิธี tidal stream ถูกมองว่าเป็นมิตรต่อสิ่งแวดล้อมมากกว่า (more environmentally sensitive) เพราะไม่ต้องสร้างโครงสร้างขนาดใหญ่ที่ปิดกั้นปากแม่น้ำและรบกวนระบบนิเวศ (block estuaries and disrupt ecosystems)\n\nสรุปใจความ: มีเทคโนโลยีสองแบบหลัก — แบบกักน้ำที่คล้ายเขื่อน กับแบบกังหันในกระแสน้ำที่คล้ายกังหันลมใต้น้ำ โดยแบบหลังเป็นมิตรต่อสิ่งแวดล้อมมากกว่าเพราะไม่ต้องสร้างโครงสร้างขนาดใหญ่",
      vocab: [
        { term: "barrages or lagoons to trap water at high tide", th: "เขื่อนกั้นน้ำหรือทะเลสาบกักน้ำเพื่อกักน้ำไว้ตอนน้ำขึ้น" },
        { term: "in a manner similar to a conventional hydroelectric dam", th: "ในลักษณะคล้ายกับเขื่อนพลังน้ำทั่วไป" },
        { term: "fast-moving tidal currents", th: "กระแสน้ำขึ้นน้ำลงที่ไหลเร็ว" },
        { term: "more environmentally sensitive", th: "ระมัดระวัง/เป็นมิตรต่อสิ่งแวดล้อมมากกว่า" },
        { term: "block estuaries and disrupt ecosystems", th: "ปิดกั้นปากแม่น้ำและรบกวนระบบนิเวศ" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างโครงการพลังงานน้ำขึ้นน้ำลงที่ดำเนินการอยู่จริง (Several significant tidal projects are already operational) โครงการ MeyGen ที่ Pentland Firth ทางตอนเหนือของสกอตแลนด์ เป็นชุดกังหันกระแสน้ำ (tidal stream array) ที่ใหญ่ที่สุดในโลกในปัจจุบัน โดยสามารถผลิตไฟฟ้าได้เพียงพอสำหรับบ้านหลายพันหลัง (enough electricity to power thousands of homes)\n\nฝรั่งเศสดำเนินการเขื่อนพลังน้ำขึ้นน้ำลง La Rance ในแคว้น Brittany มาตั้งแต่ปี 1966 ทำให้เป็นหนึ่งในโรงไฟฟ้าพลังงานหมุนเวียนที่เปิดใช้งานต่อเนื่องยาวนานที่สุดในโลก (one of the longest-running renewable energy installations) ประโยคสุดท้ายกล่าวถึงโรงไฟฟ้าพลังน้ำขึ้นน้ำลง Sihwa Lake ของเกาหลีใต้ที่เปิดในปี 2011 ซึ่งมีกำลังการผลิต (generating capacity) สูงกว่าแม้แต่ La Rance เสียอีก (surpasses even La Rance)\n\nสรุปใจความ: ย่อหน้านี้ยืนยันว่าพลังงานน้ำขึ้นน้ำลงไม่ใช่แค่แนวคิด แต่มีโครงการจริงที่ดำเนินการอยู่แล้วในสกอตแลนด์ ฝรั่งเศส และเกาหลีใต้ บางแห่งดำเนินมานานเกือบ 60 ปี",
      vocab: [
        { term: "several significant tidal projects are already operational", th: "มีโครงการพลังงานน้ำขึ้นน้ำลงสำคัญหลายแห่งที่ดำเนินการอยู่แล้ว" },
        { term: "the world's largest tidal stream array", th: "ชุดกังหันกระแสน้ำที่ใหญ่ที่สุดในโลก" },
        { term: "one of the longest-running renewable energy installations", th: "หนึ่งในโรงไฟฟ้าพลังงานหมุนเวียนที่เปิดใช้งานต่อเนื่องยาวนานที่สุด" },
        { term: "a generating capacity that surpasses even La Rance", th: "กำลังการผลิตที่สูงกว่าแม้แต่ La Rance เสียอีก" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้พลิกกลับมาชี้ปัญหา: แม้จะมีตัวอย่างเหล่านี้ (Despite these examples) พลังงานน้ำขึ้นน้ำลงยังคงเป็นเพียงผู้มีส่วนร่วมเล็กน้อยในการผลิตไฟฟ้าโลก (a marginal contributor to global electricity generation) ปัญหาพื้นฐานคือเรื่องต้นทุน (The fundamental problem is cost) การติดตั้งและบำรุงรักษากังหันใต้น้ำในกระแสน้ำแรง (strong tidal currents) นั้นยากทางเทคนิคและมีราคาแพง (technically demanding and expensive) และสภาพแวดล้อมทะเลที่กัดกร่อน (the corrosive marine environment) ยังเร่งให้ชิ้นส่วนกลไก (mechanical components) สึกหรอเร็วขึ้นอีกด้วย\n\nJames Walker วิศวกรอาวุโสของ European Marine Energy Centre ในหมู่เกาะ Orkney สกอตแลนด์ ประเมินว่าต้นทุนไฟฟ้าจากพลังงานน้ำขึ้นน้ำลงยังคงสูงกว่าพลังงานลมบนบก (onshore wind power) ถึง 3-4 เท่า (three to four times higher) เขาให้สัมภาษณ์ว่า “The technology is proven. The challenge now is reducing the cost to the point where it becomes commercially competitive without subsidy.” (ตีความได้ว่า => เทคโนโลยีนี้พิสูจน์แล้วว่าใช้ได้จริง ความท้าทายตอนนี้คือการลดต้นทุนให้ถึงจุดที่แข่งขันในเชิงพาณิชย์ได้โดยไม่ต้องพึ่งเงินอุดหนุน)\n\nสรุปใจความ: ย่อหน้านี้เผยจุดอ่อนสำคัญที่สุด — แม้เทคโนโลยีจะพิสูจน์แล้วว่าใช้งานได้ แต่ต้นทุนยังสูงกว่าพลังงานลมมาก เพราะการติดตั้งใต้น้ำยากและมีค่าใช้จ่ายในการบำรุงรักษาสูง",
      vocab: [
        { term: "a marginal contributor to global electricity generation", th: "ผู้มีส่วนร่วมเพียงเล็กน้อยในการผลิตไฟฟ้าของโลก" },
        { term: "technically demanding and expensive", th: "ยากทางเทคนิคและมีราคาแพง" },
        { term: "the corrosive marine environment accelerates wear", th: "สภาพแวดล้อมทะเลที่กัดกร่อนเร่งให้ชิ้นส่วนสึกหรอเร็วขึ้น" },
        { term: "three to four times higher than onshore wind power", th: "สูงกว่าพลังงานลมบนบกถึง 3-4 เท่า" },
        { term: "commercially competitive without subsidy", th: "แข่งขันในเชิงพาณิชย์ได้โดยไม่ต้องพึ่งเงินอุดหนุนจากรัฐ" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้เพิ่มความกังวลด้านสิ่งแวดล้อม (Environmental concerns have also complicated the picture) แม้กังหันกระแสน้ำ (tidal stream turbines) จะรบกวนสิ่งแวดล้อมน้อยกว่าเขื่อนกั้นน้ำโดยทั่วไป (generally less disruptive than barrages) แต่ก็ไม่ใช่ว่าจะไม่มีผลกระทบเลย (not without impact)\n\nการศึกษาที่โครงการ MeyGen พบหลักฐานบางส่วนของการรบกวนทางเสียง (noise disturbance) ต่อสัตว์เลี้ยงลูกด้วยนมทางทะเล (marine mammals) ระหว่างการติดตั้ง และนักนิเวศวิทยา (ecologists) ก็แสดงความกังวลเกี่ยวกับผลกระทบของใบพัดกังหัน (turbine blades) ต่อประชากรปลา (fish populations) ในเส้นทางน้ำขึ้นน้ำลงที่มีการสัญจรหนาแน่น (high-traffic tidal corridors)\n\nProfessor Elena Vasquez จากมหาวิทยาลัย Galway ผู้นำงานวิจัยด้านผลกระทบทางนิเวศของการติดตั้งพลังงานน้ำขึ้นน้ำลง เตือนว่าต้องระมัดระวัง (urges caution): “We do not yet have enough long-term data to be confident that tidal arrays at commercial scale will be benign for marine ecosystems.” (ตีความได้ว่า => เรายังไม่มีข้อมูลระยะยาวมากพอที่จะมั่นใจได้ว่าชุดกังหันในระดับเชิงพาณิชย์จะไม่เป็นอันตรายต่อระบบนิเวศทางทะเล)\n\nสรุปใจความ: แม้ tidal stream จะดีต่อสิ่งแวดล้อมกว่าเขื่อนกั้นน้ำ แต่ก็ยังไม่ปลอดภัย 100% — มีความกังวลเรื่องเสียงรบกวนสัตว์เลี้ยงลูกด้วยนมทะเลและผลกระทบต่อปลา ซึ่งยังต้องการข้อมูลระยะยาวเพิ่มเติม",
      vocab: [
        { term: "generally less disruptive than barrages", th: "โดยทั่วไปรบกวนสิ่งแวดล้อมน้อยกว่าเขื่อนกั้นน้ำ" },
        { term: "noise disturbance to marine mammals", th: "การรบกวนทางเสียงต่อสัตว์เลี้ยงลูกด้วยนมในทะเล" },
        { term: "high-traffic tidal corridors", th: "เส้นทางน้ำขึ้นน้ำลงที่มีการสัญจร/กระแสน้ำหนาแน่น" },
        { term: "urges caution", th: "เตือนให้ระมัดระวัง" },
        { term: "not yet have enough long-term data", th: "ยังไม่มีข้อมูลในระยะยาวมากพอ" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้ให้ความหวังโดยเปรียบเทียบกับอุตสาหกรรมอื่น: ผู้สนับสนุนพลังงานน้ำขึ้นน้ำลง (Supporters of tidal energy) ชี้ไปที่ประสบการณ์ของอุตสาหกรรมพลังงานลม (the experience of the wind industry) ว่าเป็นแหล่งของความหวัง (a source of optimism) พลังงานลมนอกชายฝั่ง (Offshore wind power) เคยถูกมองว่าแพงเกินไป (prohibitively expensive) มาก่อน แต่การลงทุนและการปรับปรุงทีละเล็กละน้อย (decades of investment and incremental improvement) เป็นเวลาหลายสิบปี ได้ทำให้ต้นทุนลดลงจนกลายเป็นหนึ่งในแหล่งผลิตไฟฟ้าใหม่ที่ถูกที่สุด (one of the cheapest sources of new electricity generation) ในหลายประเทศแล้วในปัจจุบัน\n\nประโยคสุดท้ายบอกว่านักเศรษฐศาสตร์ด้านพลังงานหลายคน (Several energy economists) เชื่อว่าพลังงานน้ำขึ้นน้ำลงอยู่ในช่วงเริ่มต้นที่คล้ายกัน (a similar early stage) และการลงทุนของภาครัฐที่มีเป้าหมายชัดเจน (targeted public investment) อาจสร้างการลดต้นทุนที่เทียบเคียงกันได้ (comparable cost reductions) ในอีก 20 ปีข้างหน้า\n\nสรุปใจความ: ย่อหน้านี้ให้กำลังใจ — ถ้าพลังงานลมนอกชายฝั่งเคยแพงมากแล้วถูกลงได้ พลังงานน้ำขึ้นน้ำลงก็มีโอกาสเดินตามเส้นทางเดียวกัน หากได้รับการลงทุนอย่างต่อเนื่อง",
      vocab: [
        { term: "a source of optimism", th: "แหล่งของความหวัง/มุมมองที่เป็นบวก" },
        { term: "once regarded as prohibitively expensive", th: "เคยถูกมองว่าแพงเกินไปจนไม่คุ้มค่า" },
        { term: "decades of investment and incremental improvement", th: "การลงทุนและการปรับปรุงทีละเล็กละน้อยเป็นเวลาหลายสิบปี" },
        { term: "one of the cheapest sources of new electricity generation", th: "หนึ่งในแหล่งผลิตไฟฟ้าใหม่ที่ถูกที่สุด" },
        { term: "targeted public investment", th: "การลงทุนของภาครัฐที่มีเป้าหมายชัดเจน" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าปิดท้ายสรุปสถานะปัจจุบัน: พลังงานน้ำขึ้นน้ำลงอยู่ในตำแหน่งที่คุ้นเคยสำหรับเทคโนโลยีใหม่ๆ หลายอย่าง (a position familiar to many emerging technologies) คือมีความสามารถทางเทคนิค (technically capable) มีอนาคตที่ดีในเชิงสิ่งแวดล้อม (environmentally promising) แต่ยังไม่พิสูจน์ตัวเองในเชิงพาณิชย์ในระดับใหญ่ (commercially unproven at scale)\n\nรัฐบาลสหราชอาณาจักรได้ระบุให้พลังงานกระแสน้ำขึ้นน้ำลง (tidal stream energy) เป็นสิ่งสำคัญลำดับต้นๆ (a priority) ของยุทธศาสตร์พลังงานสะอาด และให้คำมั่นที่จะให้ทุนโครงการสาธิต (funding demonstration projects) ไปจนถึงสิ้นทศวรรษ ประโยคสุดท้ายทิ้งคำถามไว้ปลายเปิด: ยังไม่แน่ชัดว่าความมุ่งมั่นนั้นจะเพียงพอที่จะลดต้นทุนและดึงดูดการลงทุนภาคเอกชนในระดับที่ต้องการได้หรือไม่ (remains to be seen)\n\nสรุปใจความ: บทความปิดท้ายด้วยมุมมองที่สมดุล — พลังงานน้ำขึ้นน้ำลงมีศักยภาพจริง แต่ยังต้องพิสูจน์ตัวเองในเชิงพาณิชย์ และผลจะเป็นอย่างไรขึ้นอยู่กับว่ารัฐบาลจะลงทุนต่อเนื่องมากพอหรือไม่",
      vocab: [
        { term: "a position familiar to many emerging technologies", th: "ตำแหน่งที่คุ้นเคยสำหรับเทคโนโลยีเกิดใหม่หลายชนิด" },
        { term: "commercially unproven at scale", th: "ยังไม่พิสูจน์ตัวเองในเชิงพาณิชย์เมื่อขยายในระดับใหญ่" },
        { term: "a priority for its clean energy strategy", th: "สิ่งสำคัญลำดับต้นๆ ของยุทธศาสตร์พลังงานสะอาด" },
        { term: "funding demonstration projects", th: "ให้เงินทุนสนับสนุนโครงการสาธิต/นำร่อง" },
        { term: "remains to be seen", th: "ยังไม่แน่ชัด ต้องรอดูผลต่อไป" }
      ]
    }
  },
  "bringing nature back the science and controversy of rewilding": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้เล่าประวัติของงานอนุรักษ์ธรรมชาติ: ในช่วงทศวรรษท้ายๆ ของศตวรรษที่ 20 (In the latter decades of the twentieth century) งานอนุรักษ์มักโฟกัสที่การปกป้องสิ่งที่เหลืออยู่ (protecting what remained) เช่น ดูแลรักษาเขตอนุรักษ์ (maintaining reserves) ควบคุมสายพันธุ์ต่างถิ่นรุกราน (controlling invasive species) และป้องกันการสูญเสียถิ่นที่อยู่เพิ่มเติม (preventing further habitat loss)\n\nแต่เมื่อไม่นานมานี้ (More recently) แนวทางที่ทะเยอทะยานกว่าเดิม (a more ambitious approach) ได้เริ่มเป็นที่ยอมรับ (begun to take hold) นั่นคือการฟื้นฟูธรรมชาติ (Rewilding) ซึ่งนิยามกว้างๆ ว่าเป็นการฟื้นฟูระบบนิเวศขนาดใหญ่ (the large-scale restoration of ecosystems) โดยการนำสายพันธุ์กลับคืนสู่ธรรมชาติ (reintroducing species) และลดการจัดการโดยมนุษย์ (reducing human management) แนวคิดนี้ได้รับความสนใจเพิ่มขึ้นจากนักวิทยาศาสตร์ ผู้กำหนดนโยบาย และประชาชนทั่วไป\n\nประโยคสุดท้ายบอกว่าผู้สนับสนุนแนวคิดนี้ (Its advocates) โต้แย้งว่าการอนุรักษ์แบบเชิงรับ (passive conservation) ไม่เพียงพออีกต่อไป — การฟื้นฟูธรรมชาติอย่างแท้จริงต้องอาศัยการนำสิ่งที่สูญหายไปกลับคืนมาอย่างตั้งใจ (actively putting back what has been lost)\n\nสรุปใจความ: ย่อหน้านี้เปิดเรื่องด้วยการเปรียบเทียบการอนุรักษ์แบบเก่า (ปกป้องสิ่งที่เหลือ) กับแนวคิดใหม่ที่กำลังมาแรง (rewilding — นำสิ่งที่สูญหายไปกลับคืนมาอย่างตั้งใจ)",
      vocab: [
        { term: "protecting what remained", th: "ปกป้องสิ่งที่ยังหลงเหลืออยู่" },
        { term: "preventing further habitat loss", th: "ป้องกันไม่ให้ถิ่นที่อยู่ของสัตว์สูญเสียเพิ่มเติม" },
        { term: "a more ambitious approach", th: "แนวทางที่ทะเยอทะยาน/มุ่งมั่นกว่าเดิม" },
        { term: "the large-scale restoration of ecosystems", th: "การฟื้นฟูระบบนิเวศในระดับขนาดใหญ่" },
        { term: "passive conservation is no longer enough", th: "การอนุรักษ์แบบเชิงรับไม่เพียงพออีกต่อไป" },
        { term: "actively putting back what has been lost", th: "นำสิ่งที่สูญหายไปกลับคืนมาอย่างตั้งใจ" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายรากฐานทางวิทยาศาสตร์ของ rewilding (The scientific foundation of rewilding) ว่าตั้งอยู่บนแนวคิดของ “trophic cascades” (ตีความได้ว่า => ปฏิกิริยาลูกโซ่ในห่วงโซ่อาหาร) นั่นคือแนวคิดที่ว่า สัตว์นักล่าระดับบนสุดของห่วงโซ่อาหาร (apex predators) ด้วยการควบคุมประชากรของสัตว์ที่พวกมันล่า (by controlling the populations of the animals they hunt) สามารถเปลี่ยนรูปร่างของระบบนิเวศทั้งหมด (reshape entire ecosystems) ในทางที่เป็นประโยชน์ต่อความหลากหลายทางชีวภาพ (biodiversity) และอาจส่งผลถึงภูมิทัศน์และภูมิอากาศด้วยซ้ำ\n\nตัวอย่างที่ถูกอ้างถึงมากที่สุด (The most widely cited example) คือการนำหมาป่ากลับคืนสู่อุทยานแห่งชาติ Yellowstone ในสหรัฐฯ ในปี 1995 งานวิจัยหลังจากนั้นพบว่าการล่าของหมาป่า (wolf predation) ทำให้กวางเอลก์หลีกเลี่ยงการกินหญ้าในบางพื้นที่ (avoid grazing in certain areas) ทำให้พืชพรรณฟื้นตัวได้ (allowing vegetation to recover) ริมฝั่งแม่น้ำมั่นคงขึ้น (riverbanks to stabilise) และสายพันธุ์อื่นๆ อีกหลายชนิดกลับคืนมา แม้จะมีนักนิเวศวิทยาบางคนโต้แย้งขนาดของผลกระทบนี้ (disputed the scale of these effects) แต่กรณี Yellowstone ก็ยังคงเป็นจุดอ้างอิงหลัก (a central reference point) ของผู้สนับสนุนแนวคิด rewilding\n\nสรุปใจความ: ย่อหน้านี้อธิบายทฤษฎีหลักที่รองรับ rewilding — นักล่าระดับบนสุดสามารถ “จุดชนวน” ปฏิกิริยาลูกโซ่ที่ฟื้นฟูระบบนิเวศทั้งหมดได้ โดยมีกรณี Yellowstone เป็นตัวอย่างที่ถูกอ้างถึงมากที่สุด",
      vocab: [
        { term: "trophic cascades", th: "ปฏิกิริยาลูกโซ่ในห่วงโซ่อาหาร ที่นักล่าระดับบนส่งผลกระทบไปทั้งระบบ" },
        { term: "apex predators", th: "สัตว์นักล่าระดับบนสุดของห่วงโซ่อาหาร" },
        { term: "reshape entire ecosystems", th: "เปลี่ยนรูปร่าง/โครงสร้างของระบบนิเวศทั้งหมด" },
        { term: "wolf predation caused elk to avoid grazing in certain areas", th: "การล่าของหมาป่าทำให้กวางเอลก์หลีกเลี่ยงการกินหญ้าในบางพื้นที่" },
        { term: "disputed the scale of these effects", th: "โต้แย้งเรื่องขนาด/ความมากน้อยของผลกระทบเหล่านี้" },
        { term: "a central reference point", th: "จุดอ้างอิงหลักที่มักถูกยกมาพูดถึงเสมอ" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างโครงการ rewilding จริงในยุโรป: องค์กร Rewilding Europe ได้อำนวยความสะดวก (has facilitated) ให้มีการนำวัวป่า ม้าป่า และสัตว์กินพืชขนาดใหญ่อื่นๆ (bison, wild horses and other large herbivores) กลับคืนสู่พื้นที่ในโปรตุเกส โรมาเนีย สเปน และสวีเดน\n\nในเทือกเขา Cairngorms ของสกอตแลนด์ องค์กรการกุศลด้านการอนุรักษ์ Trees for Life กำลังทำงานเพื่อฟื้นฟูป่าโบราณ Caledonian (the ancient Caledonian forest) ผ่านการผสมผสานระหว่างการจัดการประชากรกวาง (deer management) กับการปลูกต้นไม้พื้นถิ่น (native tree planting) ประโยคสุดท้ายสรุปว่าโครงการเหล่านี้แสดงถึงการเปลี่ยนแปลงครั้งสำคัญ (a significant shift) ในวิธีที่สังคมยุโรปมองที่ดินและการใช้ประโยชน์ที่เหมาะสมของมัน (how European societies think about land and its proper use)\n\nสรุปใจความ: ย่อหน้านี้แสดงให้เห็นว่า rewilding ไม่ใช่แค่ทฤษฎี แต่กำลังเกิดขึ้นจริงในหลายประเทศยุโรป ทั้งการนำสัตว์กลับคืนถิ่นและการฟื้นฟูป่าโบราณ",
      vocab: [
        { term: "has facilitated the return of bison, wild horses and other large herbivores", th: "ได้อำนวยความสะดวกให้วัวป่า ม้าป่า และสัตว์กินพืชขนาดใหญ่อื่นๆ กลับคืนสู่ถิ่น" },
        { term: "the ancient Caledonian forest", th: "ป่าโบราณ Caledonian ในสกอตแลนด์" },
        { term: "deer management and native tree planting", th: "การจัดการประชากรกวางและการปลูกต้นไม้พื้นถิ่น" },
        { term: "a significant shift in how European societies think about land", th: "การเปลี่ยนแปลงครั้งสำคัญในวิธีที่สังคมยุโรปมองเรื่องที่ดิน" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้เข้าสู่ประเด็นที่ขัดแย้งที่สุด (the most contentious aspect) ของ rewilding: การนำสัตว์นักล่าระดับบนสุดกลับคืนมา (The reintroduction of apex predators) ในสหราชอาณาจักร ข้อเสนอให้นำแมวป่าลิงซ์ (lynx) กลับมาในบางพื้นที่ของอังกฤษตอนเหนือและสกอตแลนด์ เผชิญกับการต่อต้านอย่างหนัก (strong opposition) จากชุมชนเกษตรกร (farming communities) ที่กังวลเรื่องความปลอดภัยของปศุสัตว์ (fear for the safety of livestock)\n\nในเยอรมนี หมาป่าที่กลับมาสู่ประเทศตามธรรมชาติ (that have returned to the country naturally) ก็สร้างความขัดแย้งอย่างมาก (significant conflict) กับเกษตรกรผู้เลี้ยงแกะ (sheep farmers)\n\nDr Mark Fisher จากมหาวิทยาลัย Leeds ผู้เขียนงานเกี่ยวกับ rewilding ในพื้นที่ยุโรปที่มีประชากรหนาแน่นอย่างกว้างขวาง ยอมรับความยากลำบากนี้ (acknowledges the difficulty) ด้วยคำพูดที่ว่า: “Rewilding works well in sparsely inhabited areas where there is space for large predators to operate. In a country like the UK, the socio-political obstacles are enormous.” (ตีความได้ว่า => Rewilding ได้ผลดีในพื้นที่ที่มีคนอาศัยอยู่เบาบางที่มีพื้นที่ให้นักล่าขนาดใหญ่ทำงาน แต่ในประเทศอย่างสหราชอาณาจักร อุปสรรคทางสังคม-การเมืองมีมหาศาล)\n\nสรุปใจความ: ย่อหน้านี้ชี้ว่าการนำนักล่าขนาดใหญ่กลับคืนถิ่นเป็นประเด็นที่ขัดแย้งที่สุดของ rewilding เพราะกระทบต่อความปลอดภัยของปศุสัตว์ในพื้นที่ที่มีคนอยู่หนาแน่นอย่างยุโรป",
      vocab: [
        { term: "the most contentious aspect of rewilding", th: "ประเด็นที่มีข้อขัดแย้งมากที่สุดของ rewilding" },
        { term: "strong opposition from farming communities", th: "การต่อต้านอย่างหนักจากชุมชนเกษตรกร" },
        { term: "fear for the safety of livestock", th: "กังวลเรื่องความปลอดภัยของปศุสัตว์" },
        { term: "acknowledges the difficulty", th: "ยอมรับว่ามันเป็นเรื่องยากลำบากจริง" },
        { term: "sparsely inhabited areas", th: "พื้นที่ที่มีคนอาศัยอยู่เบาบาง" },
        { term: "the socio-political obstacles are enormous", th: "อุปสรรคทางสังคมและการเมืองมีมหาศาล" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้กลับมาสนับสนุนแนวคิด rewilding อีกครั้ง: ผู้สนับสนุน rewilding ชี้ไปที่หลักฐานที่เพิ่มขึ้นเรื่อยๆ (a growing body of evidence) ที่แสดงคุณค่าทางนิเวศวิทยา (its ecological value) การศึกษาพื้นที่ที่ได้รับการฟื้นฟูในเนเธอร์แลนด์และเดนมาร์ก (rewilded sites in the Netherlands and Denmark) พบว่าความหลากหลายของแมลง (insect diversity) เพิ่มขึ้นอย่างมาก (substantial increases) ภายในเวลาเพียงไม่กี่ปีหลังจากลดการจัดการที่ดินอย่างเข้มข้น (reducing intensive land management)\n\nงานวิจัยที่เผยแพร่ในวารสาร Nature เสนอว่า การปล่อยให้ป่าฟื้นตัวได้เองบนพื้นที่เพียง 15% ของที่ดินที่เสื่อมโทรมที่สุดในโลก (as little as 15% of the world's most degraded land) อาจป้องกันการสูญพันธุ์ของสายพันธุ์ที่คาดการณ์ไว้ได้ถึง 60% (prevent up to 60% of projected species extinctions) และดูดซับคาร์บอนส่วนหนึ่งที่มีนัยสำคัญที่ถูกปล่อยออกมาตั้งแต่ยุคอุตสาหกรรมเริ่มต้น (absorb a significant fraction of the carbon released since industrialisation began)\n\nสรุปใจความ: ย่อหน้านี้ให้หลักฐานเชิงตัวเลขที่หนักแน่นสนับสนุน rewilding — เพียงฟื้นฟูที่ดินเสื่อมโทรม 15% ก็อาจช่วยลดการสูญพันธุ์ได้ถึง 60% พร้อมดูดซับคาร์บอนไปในตัว",
      vocab: [
        { term: "a growing body of evidence", th: "หลักฐานที่เพิ่มขึ้นเรื่อยๆ และหนักแน่นขึ้น" },
        { term: "substantial increases in insect diversity", th: "ความหลากหลายของแมลงที่เพิ่มขึ้นอย่างมาก" },
        { term: "reducing intensive land management", th: "การลดการจัดการที่ดินอย่างเข้มข้น" },
        { term: "prevent up to 60% of projected species extinctions", th: "ป้องกันการสูญพันธุ์ของสายพันธุ์ที่คาดการณ์ไว้ได้ถึง 60%" },
        { term: "absorb a significant fraction of the carbon", th: "ดูดซับคาร์บอนส่วนที่มีนัยสำคัญ" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้ชี้ปัญหาใหญ่ที่ยังค้างคาอยู่: คำถามเรื่องที่ดิน (The land question) เป็นอุปสรรคสำคัญ (a significant barrier) พื้นที่ที่ดินที่มีการผลิตส่วนใหญ่ของโลก (Most of the world's productive land) ถูกใช้เพื่อการเกษตร และแนวโน้มที่จะนำพื้นที่ขนาดใหญ่ออกจากการผลิต (taking large areas out of production) เพื่อให้ระบบนิเวศฟื้นตัว ก่อให้เกิดความกังวลอย่างจริงจังเกี่ยวกับความมั่นคงทางอาหาร (serious concerns about food security)\n\nAnna Fitzpatrick นักวิจัยด้านนโยบายชนบทจาก University College Dublin โต้แย้งว่าการแลกเปลี่ยน (the trade-off) ระหว่างเป้าหมายของ rewilding กับการผลิตอาหารต้องได้รับการจัดการอย่างระมัดระวัง เธอกล่าวว่า: “We cannot simply export our food needs to other parts of the world and call it an environmental victory. The land-use implications of large-scale rewilding have to be addressed honestly.” (ตีความได้ว่า => เราไม่สามารถแค่ส่งออกความต้องการอาหารของเราไปที่อื่นในโลก แล้วเรียกมันว่าชัยชนะด้านสิ่งแวดล้อมได้ ผลกระทบจากการใช้ที่ดินของ rewilding ขนาดใหญ่ต้องได้รับการจัดการอย่างตรงไปตรงมา)\n\nสรุปใจความ: ย่อหน้านี้เตือนว่า rewilding ในระดับใหญ่มีต้นทุนที่ซ่อนอยู่ — ถ้าเราเอาที่ดินเกษตรไปทำ rewilding แล้วต้องนำเข้าอาหารจากที่อื่นแทน นั่นไม่ใช่ชัยชนะด้านสิ่งแวดล้อมที่แท้จริง",
      vocab: [
        { term: "a significant barrier", th: "อุปสรรคที่สำคัญ" },
        { term: "taking large areas out of production", th: "นำพื้นที่ขนาดใหญ่ออกจากการผลิต (เพื่อการเกษตร)" },
        { term: "serious concerns about food security", th: "ความกังวลอย่างจริงจังเกี่ยวกับความมั่นคงทางอาหาร" },
        { term: "the trade-off between rewilding ambitions and food production", th: "การแลกเปลี่ยนระหว่างเป้าหมายของ rewilding กับการผลิตอาหาร" },
        { term: "has to be addressed honestly", th: "ต้องได้รับการจัดการ/พูดถึงอย่างตรงไปตรงมา" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าปิดท้ายมองไปข้างหน้า: แม้จะมีความตึงเครียดเหล่านี้ (Despite these tensions) ความสนใจใน rewilding กำลังแพร่ขยายออกไปเกินกว่าแวดวงอนุรักษ์แบบดั้งเดิม (spreading beyond traditional conservation circles) เจ้าของที่ดินขนาดใหญ่หลายรายในสหราชอาณาจักรและยุโรปแผ่นดินใหญ่ (Several large landowners) เริ่มเปลี่ยนที่ดินของตนจากการทำเกษตรแบบเข้มข้นไปสู่โครงการ rewilding (transitioning their estates away from intensive farming towards rewilding projects)\n\nบางรายพบว่าการท่องเที่ยวเชิงนิเวศ เครดิตคาร์บอน และเงินอุดหนุนการอนุรักษ์จากรัฐบาล (ecotourism, carbon credits and government conservation payments) สามารถสร้างรายได้ที่เทียบเคียงได้กับรายได้จากการเกษตร (revenue comparable to agricultural income) เมื่อเวลาผ่านไป\n\nประโยคสุดท้ายทิ้งคำถามไว้ปลายเปิด: ยังไม่ชัดเจนว่าโมเดลทางเศรษฐกิจเหล่านี้จะสามารถขยายตัวให้เกิดการเปลี่ยนแปลงระดับภูมิทัศน์ (landscape-level change) ที่ rewilding ต้องการได้หรือไม่ (still far from clear)\n\nสรุปใจความ: บทความปิดท้ายด้วยความหวังที่ระมัดระวัง — เจ้าของที่ดินเริ่มเห็นว่า rewilding ทำเงินได้จริงผ่านการท่องเที่ยวและเครดิตคาร์บอน แต่ยังไม่แน่ใจว่าจะขยายไปสู่การเปลี่ยนแปลงระดับใหญ่ได้จริงหรือไม่",
      vocab: [
        { term: "spreading beyond traditional conservation circles", th: "แพร่ขยายออกไปเกินกว่าแวดวงอนุรักษ์แบบดั้งเดิม" },
        { term: "transitioning their estates away from intensive farming", th: "เปลี่ยนที่ดินของตนออกจากการทำเกษตรแบบเข้มข้น" },
        { term: "revenue comparable to agricultural income", th: "รายได้ที่เทียบเคียงได้กับรายได้จากการเกษตร" },
        { term: "landscape-level change", th: "การเปลี่ยนแปลงในระดับภูมิทัศน์/พื้นที่ขนาดใหญ่" },
        { term: "still far from clear", th: "ยังไม่ชัดเจนเลย ยังต้องรอดูต่อไป" }
      ]
    }
  },
  "the fungal frontier mycelium as a sustainable material": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้บอกว่าอุตสาหกรรมบรรจุภัณฑ์ทั่วโลก (The global packaging industry) สร้างขยะโฟมโพลิสไตรีนและพลาสติกใช้ครั้งเดียวทิ้ง (polystyrene and single-use plastic foam) หลายร้อยล้านตันในทุกๆ ปี วัสดุเหล่านี้เป็นฉนวนกันความร้อนและตัวดูดซับแรงกระแทกที่มีประสิทธิภาพ (effective insulators and shock absorbers) แต่มันทำมาจากปิโตรเลียม (derived from petroleum) แทบเป็นไปไม่ได้เลยที่จะรีไซเคิลในทางปฏิบัติ (almost impossible to recycle in practice) และคงอยู่ในสิ่งแวดล้อมนานหลายศตวรรษ (persist in the environment for centuries)\n\nเมื่อผู้ผลิตถูกกดดันมากขึ้นให้ลดการพึ่งพาวัสดุจากเชื้อเพลิงฟอสซิล (reduce their reliance on fossil-fuel-based materials) นักวิจัยและผู้ประกอบการจึงหันไปหาแหล่งวัสดุที่ไม่คาดคิด (an unexpected source): เชื้อรา (fungi) เครือข่ายเส้นใยคล้ายรากที่ประกอบเป็นตัวของเชื้อรา (The root-like network of fibres) ที่เรียกว่าไมซีเลียม (mycelium) สามารถถูกเพาะให้เติบโตในแม่พิมพ์ (grown into moulds) เพื่อผลิตวัสดุที่มีน้ำหนักเบา แข็งแรง และย่อยสลายได้อย่างสมบูรณ์ (fully biodegradable) ด้วยคุณสมบัติที่คล้ายคลึงกับโฟมโพลิสไตรีนอย่างน่าทึ่ง (strikingly similar to polystyrene foam)\n\nสรุปใจความ: ย่อหน้านี้เปิดเรื่องด้วยปัญหาของโฟมพลาสติกที่รีไซเคิลไม่ได้ ก่อนแนะนำวัสดุทางเลือกที่ไม่คาดคิด — เชื้อราหรือไมซีเลียม ที่มีคุณสมบัติคล้ายโฟมแต่ย่อยสลายได้เต็มที่",
      vocab: [
        { term: "effective insulators and shock absorbers", th: "ฉนวนกันความร้อนและตัวดูดซับแรงกระแทกที่มีประสิทธิภาพ" },
        { term: "derived from petroleum", th: "ทำ/สกัดมาจากปิโตรเลียม" },
        { term: "almost impossible to recycle in practice", th: "แทบเป็นไปไม่ได้เลยที่จะรีไซเคิลในทางปฏิบัติจริง" },
        { term: "an unexpected source", th: "แหล่งวัสดุที่ไม่มีใครคาดคิดมาก่อน" },
        { term: "mycelium", th: "ไมซีเลียม — เครือข่ายเส้นใยคล้ายรากของเชื้อรา" },
        { term: "strikingly similar to polystyrene foam", th: "มีคุณสมบัติคล้ายคลึงกับโฟมโพลิสไตรีนอย่างน่าทึ่ง" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่าไมซีเลียมเติบโตอย่างไร: มันเติบโตตามธรรมชาติโดยการสอดเส้นใยของมัน (threading its fibres) ผ่านสารอินทรีย์ (organic matter) เช่นเศษวัสดุเหลือใช้จากการเกษตร (agricultural waste) โดยยึดอนุภาคต่างๆ เข้าด้วยกัน (binding the particles together) ขณะที่มันขยายตัว\n\nด้วยการควบคุมสภาพการเจริญเติบโต (By controlling the growing conditions) เช่น อุณหภูมิ ความชื้น และองค์ประกอบของวัสดุตั้งต้น (temperature, humidity and the composition of the substrate) ผู้ผลิตสามารถกำหนดความหนาแน่น ความแข็ง และเนื้อสัมผัส (density, rigidity and texture) ของวัสดุสุดท้ายได้ เมื่อได้รูปทรงที่ต้องการแล้ว (Once the desired shape has been achieved) กระบวนการเจริญเติบโตจะถูกหยุดด้วยการให้ความร้อน (applying heat) ซึ่งฆ่าไมซีเลียมและหยุดการเติบโตต่อไป (kills the mycelium and prevents further growth)\n\nประโยคสุดท้ายบอกว่าผลลัพธ์คือวัสดุที่แข็งและแห้ง (a rigid, dry material) ที่สามารถนำไปหมักเป็นปุ๋ยได้เมื่อหมดอายุการใช้งาน (composted at the end of its useful life) และคืนกลับสู่ดินได้อย่างสมบูรณ์ภายในไม่กี่สัปดาห์ (returns completely to the soil within weeks)\n\nสรุปใจความ: ย่อหน้านี้อธิบายกระบวนการผลิตวัสดุจากไมซีเลียมทีละขั้น — ปลูกให้เกาะกับเศษวัสดุเหลือใช้ ควบคุมสภาพแวดล้อมเพื่อกำหนดคุณสมบัติ แล้วหยุดการเติบโตด้วยความร้อน ได้วัสดุที่ย่อยสลายกลับสู่ดินได้เต็มที่",
      vocab: [
        { term: "threading its fibres through organic matter", th: "สอดเส้นใยของมันผ่านสารอินทรีย์" },
        { term: "binding the particles together as it expands", th: "ยึดอนุภาคต่างๆ เข้าด้วยกันขณะที่มันขยายตัว" },
        { term: "temperature, humidity and the composition of the substrate", th: "อุณหภูมิ ความชื้น และองค์ประกอบของวัสดุตั้งต้น" },
        { term: "kills the mycelium and prevents further growth", th: "ฆ่าไมซีเลียมและหยุดไม่ให้เติบโตต่อไปอีก" },
        { term: "returns completely to the soil within weeks", th: "คืนกลับสู่ดินได้อย่างสมบูรณ์ภายในไม่กี่สัปดาห์" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้เล่าจุดเริ่มต้นเชิงพาณิชย์ (The commercial potential) ของวัสดุไมซีเลียม ซึ่งถูกสาธิตครั้งแรกโดยบริษัทอเมริกัน Ecovative Design ที่ก่อตั้งในรัฐนิวยอร์กเมื่อปี 2007 Ecovative พัฒนากระบวนการเพาะไมซีเลียมให้เติบโตรอบเศษวัสดุเหลือใช้ทางการเกษตร (agricultural residues) เช่น เปลือกข้าวโพดและเปลือกกัญชง (corn husks and hemp hurds) เพื่อผลิตวัสดุบรรจุภัณฑ์ที่ทำหน้าที่เป็นตัวแทนโดยตรง (drop-in replacements) แทนโฟมโพลิสไตรีนได้เลย\n\nประโยคสุดท้ายยกตัวอย่างบริษัทเฟอร์นิเจอร์สัญชาติสวีเดน IKEA ที่ประกาศในปี 2021 ว่ากำลังสำรวจการใช้บรรจุภัณฑ์จากไมซีเลียม (exploring the use of mycelium packaging) สำหรับผลิตภัณฑ์บางส่วนของตน สะท้อนถึงความสนใจที่เพิ่มขึ้นของผู้ผลิตรายใหญ่ในทางเลือกที่มาจากชีวภาพ (bio-based alternatives)\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าวัสดุไมซีเลียมไม่ใช่แค่ไอเดียในห้องแล็บ แต่มีบริษัทจริงอย่าง Ecovative ผลิตขายจริงมาตั้งแต่ปี 2007 และแบรนด์ใหญ่อย่าง IKEA ก็เริ่มสนใจนำไปใช้แล้ว",
      vocab: [
        { term: "the commercial potential was first demonstrated by", th: "ศักยภาพเชิงพาณิชย์ถูกสาธิตให้เห็นเป็นครั้งแรกโดย..." },
        { term: "agricultural residues such as corn husks and hemp hurds", th: "เศษวัสดุเหลือใช้ทางการเกษตร เช่น เปลือกข้าวโพดและเปลือกกัญชง" },
        { term: "drop-in replacements for polystyrene", th: "วัสดุที่ใช้แทนโฟมโพลิสไตรีนได้ทันทีโดยไม่ต้องปรับกระบวนการผลิต" },
        { term: "exploring the use of mycelium packaging", th: "กำลังสำรวจ/พิจารณาความเป็นไปได้ในการใช้บรรจุภัณฑ์จากไมซีเลียม" },
        { term: "the growing interest of major manufacturers", th: "ความสนใจที่เพิ่มขึ้นของผู้ผลิตรายใหญ่" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้ขยายขอบเขตไปไกลกว่าบรรจุภัณฑ์ (Beyond packaging): นักวิจัยกำลังศึกษาคุณสมบัติเชิงโครงสร้าง (the structural properties) ของไมซีเลียมสำหรับใช้ในงานก่อสร้าง (for use in construction) ทีมวิจัยจากมหาวิทยาลัย Delft ในเนเธอร์แลนด์และห้องปฏิบัติการ BioMASON ใน North Carolina ได้ผลิตอิฐและแผงจากไมซีเลียม (mycelium-based bricks and panels) ที่ทนไฟ (fire-resistant) กันน้ำ (water-repellent) และมีความแข็งแรงต้านแรงอัด (compressive strength) เทียบเท่ากับวัสดุฉนวนทั่วไป\n\nประโยคสุดท้ายยกตัวอย่างศาลาชั่วคราว (A temporary pavilion) ที่สร้างจากอิฐไมซีเลียม ซึ่งถูกจัดแสดง (exhibited) ที่พิพิธภัณฑ์ Museum of Modern Art ในนิวยอร์ก แสดงให้เห็นศักยภาพด้านสถาปัตยกรรมของวัสดุนี้ (the material's architectural potential)\n\nสรุปใจความ: ย่อหน้านี้ยกระดับความเป็นไปได้ของไมซีเลียมจากแค่บรรจุภัณฑ์ ไปสู่วัสดุก่อสร้างจริง — อิฐและแผงไมซีเลียมทนไฟ กันน้ำ แข็งแรง และแม้แต่ถูกนำไปจัดแสดงในพิพิธภัณฑ์ศิลปะระดับโลกแล้ว",
      vocab: [
        { term: "the structural properties of mycelium", th: "คุณสมบัติเชิงโครงสร้างของไมซีเลียม (ความแข็งแรง รับน้ำหนักได้)" },
        { term: "fire-resistant, water-repellent", th: "ทนไฟ กันน้ำ" },
        { term: "comparable in compressive strength to conventional insulation materials", th: "มีความแข็งแรงต้านแรงอัดเทียบเท่ากับวัสดุฉนวนทั่วไป" },
        { term: "demonstrating the material's architectural potential", th: "แสดงให้เห็นถึงศักยภาพด้านสถาปัตยกรรมของวัสดุนี้" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้ชี้ปัญหาในการขยายการผลิต: การขยายการผลิตไมซีเลียมไปสู่ระดับอุตสาหกรรม (Scaling mycelium production to industrial levels) กลับสร้างความท้าทายทางวิศวกรรมที่สำคัญ (significant engineering challenges) เพราะการเพาะเลี้ยงวัสดุชีวภาพ (Growing biological material) ต้องการการควบคุมสภาพแวดล้อมอย่างระมัดระวัง (careful environmental control) และการรักษาคุณภาพผลิตภัณฑ์ให้สม่ำเสมอในหลายๆ ล็อตการผลิต (maintaining consistent product quality across large batches) นั้นพิสูจน์แล้วว่าทำได้ยาก (has proved difficult)\n\nDr Franziska Noll จากสถาบัน Fraunhofer สาขาวิศวกรรมส่วนต่อประสาน (Interfacial Engineering) ในเมือง Stuttgart ผู้ศึกษาการนำวัสดุชีวภาพไปใช้เชิงพาณิชย์ (the commercialisation of bio-based materials) อธิบายว่า “the biological variability of living organisms is the central challenge. Unlike a chemical reaction that produces the same output every time, a living system responds to tiny fluctuations in its environment, and that variability is very hard to eliminate at scale.” (ตีความได้ว่า => ความผันแปรทางชีวภาพของสิ่งมีชีวิตคือความท้าทายหลัก ต่างจากปฏิกิริยาเคมีที่ให้ผลลัพธ์เดิมทุกครั้ง ระบบสิ่งมีชีวิตตอบสนองต่อความผันผวนเล็กๆ ในสภาพแวดล้อม และความผันแปรนั้นกำจัดให้หมดไปในระดับใหญ่ได้ยากมาก)\n\nสรุปใจความ: ปัญหาหลักของการขยายการผลิตไมซีเลียมคือ มันเป็น “สิ่งมีชีวิต” ไม่ใช่สารเคมี จึงตอบสนองต่อสภาพแวดล้อมที่เปลี่ยนแปลงเล็กน้อยได้ ทำให้ควบคุมคุณภาพให้สม่ำเสมอในระดับอุตสาหกรรมได้ยาก",
      vocab: [
        { term: "significant engineering challenges", th: "ความท้าทายทางวิศวกรรมที่สำคัญ" },
        { term: "careful environmental control", th: "การควบคุมสภาพแวดล้อมอย่างระมัดระวัง" },
        { term: "maintaining consistent product quality across large batches", th: "รักษาคุณภาพผลิตภัณฑ์ให้สม่ำเสมอในหลายๆ ล็อตการผลิต" },
        { term: "the biological variability of living organisms", th: "ความผันแปรทางชีวภาพของสิ่งมีชีวิต ที่แต่ละตัวไม่เหมือนกันเป๊ะ" },
        { term: "very hard to eliminate at scale", th: "กำจัดให้หมดไปได้ยากมากเมื่อขยายเป็นการผลิตขนาดใหญ่" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้เพิ่มความกังวลอีกด้าน: มีคำถามเกิดขึ้น (Questions have also been raised) ว่าวัสดุไมซีเลียมเหมาะสมสำหรับการใช้งานเชิงโครงสร้างในสิ่งปลูกสร้าง (structural applications in the built environment) หรือไม่ กฎระเบียบการก่อสร้างในประเทศส่วนใหญ่ (Current building regulations in most countries) กำหนดให้วัสดุต้องผ่านมาตรฐานประสิทธิภาพที่เข้มงวดและเป็นที่ยอมรับกันดี (strict and well-established performance standards) ซึ่งยังไม่เคยถูกทดสอบอย่างครอบคลุม (not yet been comprehensively tested) สำหรับผลิตภัณฑ์ที่ทำจากไมซีเลียม\n\nProfessor Hassan Bilal จากมหาวิทยาลัย Sheffield Hallam ผู้ให้คำปรึกษาแก่อุตสาหกรรมก่อสร้างของสหราชอาณาจักรเกี่ยวกับวัสดุเกิดใหม่ (emerging materials) เตือนว่า “enthusiasm for novel bio-based materials should not run ahead of the evidence. We need long-term data on how these materials perform under real-world conditions before they can be approved for general construction use.” (ตีความได้ว่า => ความกระตือรือร้นต่อวัสดุชีวภาพใหม่ๆ ไม่ควรวิ่งนำหน้าหลักฐานที่มี เราต้องการข้อมูลระยะยาวว่าวัสดุเหล่านี้ทำงานอย่างไรในสภาพจริง ก่อนที่จะได้รับการอนุมัติให้ใช้ในการก่อสร้างทั่วไป)\n\nสรุปใจความ: ย่อหน้านี้เตือนว่าแม้ไมซีเลียมจะดูมีอนาคตด้านการก่อสร้าง แต่กฎหมายอาคารยังไม่รองรับ เพราะยังขาดข้อมูลระยะยาวว่ามันจะทนทานในสภาพใช้งานจริงได้แค่ไหน",
      vocab: [
        { term: "questions have also been raised", th: "มีคำถาม/ข้อสงสัยเกิดขึ้นเช่นกัน" },
        { term: "strict and well-established performance standards", th: "มาตรฐานประสิทธิภาพที่เข้มงวดและเป็นที่ยอมรับกันมานาน" },
        { term: "not yet been comprehensively tested", th: "ยังไม่เคยถูกทดสอบอย่างครอบคลุมมาก่อน" },
        { term: "enthusiasm should not run ahead of the evidence", th: "ความกระตือรือร้นไม่ควรวิ่งนำหน้าหลักฐานที่มีอยู่จริง" },
        { term: "approved for general construction use", th: "ได้รับการอนุมัติให้ใช้ในการก่อสร้างทั่วไป" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าปิดท้ายกลับมามองในแง่บวก: แม้จะมีอุปสรรคเหล่านี้ (nevertheless) ภาคอุตสาหกรรมวัสดุไมซีเลียม (The mycelium materials sector) ยังคงเติบโตต่อไป Ecovative ได้ขยายธุรกิจไปสู่การผลิตวัสดุทดแทนหนัง (leather alternatives) และผลิตภัณฑ์ทดแทนเนื้อสัตว์ (meat substitutes) ที่ทำจากไมซีเลียม แสดงให้เห็นความหลากหลาย (the versatility) ของแพลตฟอร์มนี้ที่ไปไกลกว่าแค่บรรจุภัณฑ์\n\nการลงทุนในภาคนี้เพิ่มขึ้นอย่างมาก (increased substantially) ซึ่งส่วนหนึ่งขับเคลื่อนโดยกฎระเบียบที่เข้มงวดขึ้นเรื่อยๆ เกี่ยวกับพลาสติกใช้ครั้งเดียวทิ้ง (tightening regulations on single-use plastics) ในสหภาพยุโรปและสหราชอาณาจักร\n\nประโยคสุดท้ายสรุปว่า หากปัญหาการผลิต (production challenges) สามารถแก้ไขได้ และกรอบกฎระเบียบ (regulatory frameworks) ได้รับการพัฒนา วัสดุไมซีเลียมอาจเข้ามาแทนที่โพลิสไตรีน (displace polystyrene) ในการใช้งานที่หลากหลาย — เสนอทางเลือกที่ย่อยสลายได้เต็มที่ ซึ่งเติบโตขึ้นมาไม่ใช่จากน้ำมัน แต่จากเศษวัสดุเหลือใช้ทางการเกษตร (grown not from oil, but from agricultural waste)\n\nสรุปใจความ: บทความปิดท้ายด้วยมุมมองที่มีความหวัง — ไมซีเลียมกำลังขยายไปสู่ผลิตภัณฑ์ใหม่ๆ (หนังเทียม เนื้อเทียม) และมีแรงหนุนจากกฎระเบียบด้านสิ่งแวดล้อมที่เข้มงวดขึ้น หากแก้ปัญหาการผลิตได้ มันอาจแทนที่โฟมพลาสติกได้จริงในอนาคต",
      vocab: [
        { term: "the mycelium materials sector nevertheless continues to grow", th: "ภาคอุตสาหกรรมวัสดุไมซีเลียมยังคงเติบโตต่อไปแม้จะมีอุปสรรค" },
        { term: "leather alternatives and meat substitutes", th: "วัสดุทดแทนหนังและผลิตภัณฑ์ทดแทนเนื้อสัตว์" },
        { term: "demonstrating the versatility of the platform", th: "แสดงให้เห็นความหลากหลาย/ยืดหยุ่นของเทคโนโลยีฐานนี้" },
        { term: "tightening regulations on single-use plastics", th: "กฎระเบียบที่เข้มงวดขึ้นเรื่อยๆ เกี่ยวกับพลาสติกใช้ครั้งเดียวทิ้ง" },
        { term: "could displace polystyrene", th: "อาจเข้ามาแทนที่โฟมโพลิสไตรีนได้" },
        { term: "grown not from oil, but from agricultural waste", th: "เติบโตขึ้นมาไม่ใช่จากน้ำมัน แต่จากเศษวัสดุเหลือใช้ทางการเกษตร" }
      ]
    }
  },
  "fresh water from the sea the promise and limits of desalination": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องนี้บอกว่าการขาดแคลนน้ำ (Water scarcity) เป็นหนึ่งในความท้าทายที่นิยามยุคศตวรรษที่ 21 (one of the defining challenges of the twenty-first century) ปัจจุบันมีคนมากกว่า 2 พันล้านคน (Over two billion people) อาศัยอยู่ในประเทศที่ประสบภาวะขาดแคลนน้ำอย่างรุนแรง (high water stress) และองค์การสหประชาชาติ (the United Nations) คาดการณ์ว่าภายในปี 2050 ประชากรมากกว่าครึ่งโลก (more than half the world's population) อาจได้รับผลกระทบจากภาวะขาดแคลนน้ำเป็นระยะๆ (periodic water shortages)\n\nแม่น้ำและแหล่งน้ำใต้ดิน (Rivers and underground aquifers) ที่เคยดูเหมือนไม่มีวันหมด (once seemed inexhaustible) กำลังถูกใช้จนหมดเร็วกว่าที่จะเติมกลับคืนได้ (depleted faster than they can be replenished) ในบริบทนี้ (Against this backdrop) มหาสมุทร (the ocean) ซึ่งครอบคลุม 71% ของพื้นผิวโลกและมีน้ำถึง 96.5% ของน้ำทั้งหมดในโลก (contains 96.5% of the planet's water) จึงเริ่มดูเหมือนไม่ใช่ทรัพยากรที่ยังไม่ได้ใช้ประโยชน์อีกต่อไป แต่กลับดูเหมือนทางออกที่ชัดเจน (an obvious solution) มากขึ้น\n\nประโยคสุดท้ายแนะนำหัวข้อหลักของบทความ: การกำจัดเกลือออกจากน้ำทะเล (Desalination) กระบวนการกำจัดเกลือออกจากน้ำทะเลเพื่อผลิตน้ำจืด (removing salt from seawater to produce fresh water) กำลังถูกขยายขนาดขึ้นทั่วโลกด้วยความเร่งด่วนที่เพิ่มขึ้น (with increasing urgency)\n\nสรุปใจความ: ย่อหน้านี้ตั้งปัญหาระดับโลกไว้ก่อน — น้ำจืดกำลังขาดแคลนอย่างรุนแรง จึงนำไปสู่แนวคิดการดึงน้ำจากมหาสมุทรมาใช้ผ่านเทคโนโลยีกำจัดเกลือ",
      vocab: [
        { term: "one of the defining challenges of the twenty-first century", th: "หนึ่งในความท้าทายที่เป็นเอกลักษณ์ของศตวรรษที่ 21" },
        { term: "high water stress", th: "ภาวะขาดแคลนน้ำอย่างรุนแรง" },
        { term: "once seemed inexhaustible", th: "ครั้งหนึ่งเคยดูเหมือนว่าจะไม่มีวันหมด" },
        { term: "depleted faster than they can be replenished", th: "ถูกใช้จนหมดเร็วกว่าที่จะเติมกลับคืนได้" },
        { term: "an obvious solution", th: "ทางออกที่เห็นได้ชัดเจน" },
        { term: "removing salt from seawater to produce fresh water", th: "การกำจัดเกลือออกจากน้ำทะเลเพื่อผลิตน้ำจืด" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายเทคโนโลยีหลักที่ใช้ในปัจจุบัน (The dominant technology in modern desalination): ระบบออสโมซิสผันกลับ (reverse osmosis) น้ำทะเลถูกอัดผ่านเมมเบรนกึ่งซึมผ่านได้ (semi-permeable membranes) ด้วยแรงดันสูง (at high pressure) ซึ่งยอมให้โมเลกุลน้ำผ่านไปได้ แต่กั้นเกลือที่ละลายอยู่และสิ่งปนเปื้อนอื่นๆ (dissolved salts and other contaminants) ไว้ น้ำจืดที่ได้ (The resulting fresh water) จะถูกเก็บรวบรวมที่อีกฝั่งของเมมเบรน ในขณะที่สารละลายเกลือเข้มข้นสูงที่เหลือ (the remaining highly concentrated salt solution) ซึ่งเรียกว่าน้ำเกลือเข้มข้น (brine) จะถูกปล่อยทิ้ง (discharged)\n\nกระบวนการนี้ใช้พลังงานมาก (energy-intensive) แต่ความก้าวหน้าของเทคโนโลยีเมมเบรนและระบบกู้คืนพลังงาน (membrane technology and energy recovery systems) ได้ลดการใช้พลังงานลงอย่างมาก (reduced power consumption dramatically) ในช่วงสองทศวรรษที่ผ่านมา Dr Rami Messalem จากสถาบัน Weizmann Institute of Science ในอิสราเอล ผู้เชี่ยวชาญชั้นนำด้านการวิจัยการกำจัดเกลือ (a leading figure in desalination research) อธิบายว่าออสโมซิสผันกลับคือ “by far the most efficient and cost-effective option currently available for producing fresh water from the sea.” (ตีความได้ว่า => เป็นตัวเลือกที่มีประสิทธิภาพและคุ้มค่าที่สุดในปัจจุบันสำหรับการผลิตน้ำจืดจากทะเล เมื่อเทียบกับตัวเลือกอื่นๆ ทั้งหมด)\n\nสรุปใจความ: ย่อหน้านี้อธิบายกลไกทางเทคนิคของออสโมซิสผันกลับ ซึ่งเป็นเทคโนโลยีหลักในปัจจุบัน — ใช้แรงดันดันน้ำผ่านเมมเบรนเพื่อแยกน้ำจืดออกจากเกลือ แม้จะใช้พลังงานมากแต่ก็มีประสิทธิภาพดีที่สุดที่มีอยู่ในตอนนี้",
      vocab: [
        { term: "semi-permeable membranes", th: "เมมเบรน/แผ่นกรองที่ยอมให้บางสิ่งผ่านได้เท่านั้น (กึ่งซึมผ่านได้)" },
        { term: "dissolved salts and other contaminants", th: "เกลือที่ละลายอยู่และสิ่งปนเปื้อนอื่นๆ" },
        { term: "the remaining highly concentrated salt solution", th: "สารละลายเกลือที่มีความเข้มข้นสูงที่เหลืออยู่หลังกระบวนการ" },
        { term: "energy-intensive", th: "ใช้พลังงานมากในกระบวนการ" },
        { term: "reduced power consumption dramatically", th: "ลดการใช้พลังงานลงอย่างมาก" },
        { term: "by far the most efficient and cost-effective option", th: "เป็นตัวเลือกที่มีประสิทธิภาพและคุ้มค่าที่สุดอย่างชัดเจนเมื่อเทียบกับตัวอื่น" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างการใช้งานจริงในระดับใหญ่ (already deployed at very large scale) ในภูมิภาคที่ขาดแคลนน้ำหลายแห่ง (a number of water-stressed regions) อิสราเอลผลิตน้ำจืดสำหรับใช้ในเขตเทศบาล (municipal fresh water) มากกว่า 85% ผ่านการกำจัดเกลือ โดยมีโรงงานขนาดใหญ่ริมชายฝั่ง 5 แห่ง (five large coastal plants) ที่จ่ายน้ำส่วนใหญ่ให้แก่ประเทศ\n\nซาอุดีอาระเบียมีกำลังการผลิตน้ำจืดจากการกำจัดเกลือที่ใหญ่ที่สุดในโลก (the world's largest desalination capacity) โดยมีโรงงานที่ Jubail และ Ras Al-Khair ที่ผลิตน้ำจืดได้หลายร้อยล้านลูกบาศก์เมตรต่อปี (hundreds of millions of cubic metres of fresh water annually) ประโยคสุดท้ายยกตัวอย่างเมือง Perth ในออสเตรเลีย ที่พึ่งพาการกำจัดเกลือ (has relied on desalination) เพื่อเสริมแหล่งน้ำของตนตั้งแต่ปี 2006 หลังจากที่ปริมาณฝนตกลดลงต่อเนื่องหลายปี (years of declining rainfall) ที่เชื่อว่าเป็นผลจากการเปลี่ยนแปลงสภาพภูมิอากาศ (attributed to climate change)\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าการกำจัดเกลือไม่ใช่แค่เทคโนโลยีทดลอง แต่ถูกใช้จริงในระดับประเทศแล้ว — อิสราเอลพึ่งพามันเป็นหลัก ซาอุดีอาระเบียมีกำลังผลิตใหญ่ที่สุด และเมือง Perth ในออสเตรเลียก็ใช้มันรับมือกับภัยแล้งจากสภาพภูมิอากาศ",
      vocab: [
        { term: "already deployed at very large scale", th: "ถูกนำมาใช้งานจริงแล้วในระดับที่ใหญ่มาก" },
        { term: "municipal fresh water", th: "น้ำจืดสำหรับใช้ในเขตเทศบาล/ครัวเรือนในเมือง" },
        { term: "the world's largest desalination capacity", th: "กำลังการผลิตน้ำจืดจากการกำจัดเกลือที่ใหญ่ที่สุดในโลก" },
        { term: "hundreds of millions of cubic metres annually", th: "หลายร้อยล้านลูกบาศก์เมตรต่อปี" },
        { term: "years of declining rainfall attributed to climate change", th: "หลายปีของปริมาณฝนที่ลดลงต่อเนื่อง ซึ่งเชื่อว่าเป็นผลจากการเปลี่ยนแปลงสภาพภูมิอากาศ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้เริ่มเปิดเผยด้านลบ (Despite its growing deployment): การกำจัดเกลือเผชิญกับคำวิจารณ์ที่สำคัญ (significant criticism) พลังงานที่ต้องใช้เพื่ออัดน้ำผ่านเมมเบรนด้วยแรงดันสูง (The energy required to force water through membranes under high pressure) ยังคงสูงมาก (substantial) และในประเทศส่วนใหญ่พลังงานนั้นยังคงมาจากเชื้อเพลิงฟอสซิลเป็นหลัก (still comes primarily from fossil fuels)\n\nงานวิจัยจากมหาวิทยาลัย California, Santa Barbara ประเมินว่าโรงงานกำจัดเกลือทั่วโลกใช้ไฟฟ้ารวมกันประมาณ 75 เทระวัตต์-ชั่วโมงต่อปี (approximately 75 terawatt-hours of electricity annually) — ซึ่งเทียบเท่ากับการใช้ไฟฟ้าทั้งหมดของประเทศขนาดกลางประเทศหนึ่ง (roughly equivalent to the entire electricity consumption of a medium-sized country) ประโยคสุดท้ายเตือนว่า หากโรงงานกำจัดเกลือไม่ได้ใช้พลังงานหมุนเวียน (Unless desalination plants are powered by renewable energy) ต้นทุนด้านสิ่งแวดล้อมของน้ำจืดที่ผลิตได้ก็ยังคงมหาศาล (the environmental cost … is considerable)\n\nสรุปใจความ: ย่อหน้านี้เผยปัญหาแรกของการกำจัดเกลือ — ใช้พลังงานมหาศาลเทียบเท่าไฟฟ้าทั้งประเทศ และตราบใดที่พลังงานนั้นยังมาจากฟอสซิล ต้นทุนด้านสิ่งแวดล้อมก็ยังคงสูงอยู่ดี",
      vocab: [
        { term: "faces significant criticism", th: "เผชิญกับคำวิจารณ์ที่สำคัญ" },
        { term: "still comes primarily from fossil fuels", th: "ยังคงมาจากเชื้อเพลิงฟอสซิลเป็นหลัก" },
        { term: "approximately 75 terawatt-hours of electricity annually", th: "ไฟฟ้าประมาณ 75 เทระวัตต์-ชั่วโมงต่อปี" },
        { term: "roughly equivalent to the entire electricity consumption of a medium-sized country", th: "เทียบเท่ากับการใช้ไฟฟ้าทั้งหมดของประเทศขนาดกลางประเทศหนึ่ง" },
        { term: "the environmental cost … is considerable", th: "ต้นทุนด้านสิ่งแวดล้อมยังคงมหาศาล" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้เพิ่มปัญหาที่ร้ายแรงพอๆ กัน (an equally serious environmental challenge): การกำจัดน้ำเกลือเข้มข้น (The disposal of concentrated brine) ทุกๆ 1 ลิตรของน้ำจืดที่ผลิตได้ (For every litre of fresh water produced) การกำจัดเกลือจะสร้างน้ำเกลือเข้มข้นออกมา 1-2 ลิตร (between one and two litres of brine) ซึ่งถูกปล่อยกลับสู่ทะเลในความเข้มข้นที่สูงกว่าน้ำทะเลตามธรรมชาติมาก (concentrations far higher than natural seawater)\n\nงานวิจัยที่เผยแพร่ในวารสาร Science of the Total Environment พบว่าโรงงานกำจัดเกลือทั่วโลกปล่อยน้ำเกลือเข้มข้นออกมาประมาณ 142 ล้านลูกบาศก์เมตรต่อวัน (approximately 142 million cubic metres of brine daily) และในแหล่งน้ำแบบปิดหรือกึ่งปิด (enclosed or semi-enclosed bodies of water) เช่น อ่าวอาหรับและทะเลแดง (the Arabian Gulf and the Red Sea) การปล่อยน้ำเกลือนี้กำลังสร้างความเสียหายที่วัดได้ต่อระบบนิเวศทางทะเล (measurable damage to marine ecosystems) รวมถึงการทำลายแหล่งหญ้าทะเล (the destruction of seagrass beds) และอันตรายต่อประชากรปลาและสัตว์ไม่มีกระดูกสันหลัง (harm to fish and invertebrate populations)\n\nสรุปใจความ: ปัญหาที่สองคือน้ำเกลือเข้มข้นที่เหลือจากกระบวนการ ซึ่งถูกปล่อยกลับสู่ทะเลในปริมาณมหาศาลทุกวัน และกำลังทำลายระบบนิเวศทางทะเลในพื้นที่ปิด เช่น อ่าวอาหรับและทะเลแดง",
      vocab: [
        { term: "an equally serious environmental challenge", th: "ความท้าทายด้านสิ่งแวดล้อมที่ร้ายแรงพอๆ กัน" },
        { term: "concentrations far higher than natural seawater", th: "ความเข้มข้นที่สูงกว่าน้ำทะเลตามธรรมชาติมาก" },
        { term: "enclosed or semi-enclosed bodies of water", th: "แหล่งน้ำแบบปิดหรือกึ่งปิด (น้ำไหลเวียนออกได้ยาก)" },
        { term: "measurable damage to marine ecosystems", th: "ความเสียหายที่วัด/ตรวจสอบได้ต่อระบบนิเวศทางทะเล" },
        { term: "the destruction of seagrass beds", th: "การทำลายแหล่งหญ้าทะเล" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้กลับมาให้ความหวัง: นักวิจัยกำลังพยายามแก้ทั้งปัญหาพลังงานและปัญหาน้ำเกลือ (Researchers are working to address both the energy and brine problems) ระบบกำจัดเกลือด้วยพลังงานแสงอาทิตย์ (Solar-powered desalination systems) ที่ใช้แผงโซลาร์เซลล์หรือความร้อนจากแสงอาทิตย์แบบรวมแสง (photovoltaic panels or concentrated solar heat) เพื่อขับเคลื่อนกระบวนการ กำลังถูกพัฒนาและทดสอบในระดับนำร่อง (developed and tested at pilot scale) ในหลายประเทศ เช่น โมร็อกโก ชิลี และโอมาน\n\nทีมวิจัยจากสถาบัน Massachusetts Institute of Technology (MIT) ได้พัฒนาอุปกรณ์กำจัดเกลือด้วยพลังงานแสงอาทิตย์ขนาดเล็ก (a small-scale solar desalination device) ที่ไม่ต้องใช้ไฟฟ้าเลย (requires no electricity at all) โดยใช้เพียงแสงแดดในการระเหยน้ำแล้วควบแน่นกลับคืน (evaporate and re-condense water) ประโยคสุดท้ายบอกว่าเทคโนโลยีเหล่านี้ยังไม่สามารถผลิตน้ำในระดับที่เทียบเท่ากับโรงงานกำจัดเกลืออุตสาหกรรมได้ (not yet capable of supplying water at the scale of industrial desalination plants) แต่นักวิจัยก็มองในแง่ดีเกี่ยวกับศักยภาพในระยะยาว (optimistic about their long-term potential)\n\nสรุปใจความ: ย่อหน้านี้แสดงว่าทางแก้กำลังถูกพัฒนาอยู่ — พลังงานแสงอาทิตย์อาจช่วยแก้ปัญหาพลังงานได้ในอนาคต แม้ตอนนี้ยังผลิตน้ำได้ในระดับเล็กเท่านั้น",
      vocab: [
        { term: "solar-powered desalination systems", th: "ระบบกำจัดเกลือที่ขับเคลื่อนด้วยพลังงานแสงอาทิตย์" },
        { term: "developed and tested at pilot scale", th: "ถูกพัฒนาและทดสอบในระดับนำร่อง/ทดลอง" },
        { term: "requires no electricity at all", th: "ไม่ต้องใช้ไฟฟ้าเลยแม้แต่น้อย" },
        { term: "evaporate and re-condense water", th: "ทำให้น้ำระเหยแล้วควบแน่นกลับคืนเป็นน้ำจืด" },
        { term: "optimistic about their long-term potential", th: "มองในแง่ดีเกี่ยวกับศักยภาพในระยะยาวของมัน" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้านี้ตั้งคำถามที่ลึกกว่านั้น: ผู้เชี่ยวชาญด้านนโยบายน้ำบางคน (Some water policy experts) ตั้งคำถามว่าการขยายตัวอย่างรวดเร็วของการกำจัดเกลือ (the rapid expansion of desalination) กำลังแก้ปัญหาวิกฤตน้ำโลกอย่างแท้จริง (genuinely solving the global water crisis) หรือแค่ทำให้สังคมหลีกเลี่ยงงานที่ยากกว่า (allowing societies to avoid the harder work) นั่นคือการลดการใช้น้ำ (reducing consumption)\n\nDr Giulio Boccaletti อดีตผู้อำนวยการของ The Nature Conservancy ที่ปัจจุบันทำงานด้านความมั่นคงทางน้ำระดับโลก (global water security) โต้แย้งว่า “desalination is an expensive solution to a problem that is largely created by how we use water. For agriculture, which accounts for 70% of global freshwater use, desalination is not affordable at the scale required. Investing in efficiency and conservation will almost always deliver more water for less money than building more plants.” (ตีความได้ว่า => การกำจัดเกลือคือทางแก้ที่แพงสำหรับปัญหาที่ส่วนใหญ่เกิดจากวิธีที่เราใช้น้ำ สำหรับภาคเกษตรที่ใช้น้ำจืดทั่วโลกถึง 70% การกำจัดเกลือไม่คุ้มค่าในระดับที่จำเป็น การลงทุนในประสิทธิภาพและการอนุรักษ์น้ำมักจะให้น้ำมากกว่าโดยใช้เงินน้อยกว่าการสร้างโรงงานเพิ่ม)\n\nสรุปใจความ: ย่อหน้านี้เสนอมุมมองวิจารณ์ — การกำจัดเกลืออาจเป็นแค่การแก้ปัญหาที่ปลายเหตุ ในขณะที่การลดการใช้น้ำ โดยเฉพาะในภาคเกษตร อาจเป็นทางแก้ที่คุ้มค่ากว่ามาก",
      vocab: [
        { term: "the rapid expansion of desalination", th: "การขยายตัวอย่างรวดเร็วของการกำจัดเกลือ" },
        { term: "avoid the harder work of reducing consumption", th: "หลีกเลี่ยงงานที่ยากกว่า คือการลดการใช้น้ำ" },
        { term: "accounts for 70% of global freshwater use", th: "คิดเป็น 70% ของการใช้น้ำจืดทั่วโลก" },
        { term: "not affordable at the scale required", th: "ไม่คุ้มค่าทางเศรษฐกิจในระดับที่จำเป็นต้องใช้" },
        { term: "deliver more water for less money", th: "ให้น้ำได้มากกว่าโดยใช้เงินน้อยกว่า" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้าปิดท้ายสรุปมุมมองที่สมดุล: การกำจัดเกลือจะมีบทบาทเพิ่มขึ้นอย่างแน่นอน (will undoubtedly play a growing role) ในการรักษาความมั่นคงของแหล่งน้ำสำหรับเมืองชายฝั่งและประเทศที่ขาดแคลนน้ำที่มีทางเลือกน้อย (coastal cities and water-scarce nations where alternatives are few) แต่เทคโนโลยีนี้ไม่ใช่ทางออกเดียวที่จะแก้ปัญหาการขาดแคลนน้ำระดับโลกได้ด้วยตัวมันเอง (not, on its own, a solution to global water scarcity)\n\nการรวมกันของความต้องการพลังงานสูง ปัญหาการกำจัดน้ำเกลือ และต้นทุนที่สูงเกินไปสำหรับภาคเกษตร (the combination of high energy demand, brine disposal problems and the prohibitive cost of desalinated water for agriculture) หมายความว่ามันต้องถูกใช้ควบคู่กับความพยายามอย่างจริงจังในการใช้น้ำที่มีอยู่ให้มีประสิทธิภาพมากขึ้น (paired with serious efforts to use existing water supplies more efficiently) ประโยคสุดท้ายสรุปแนวคิดหลักของทั้งบทความ: เหมือนกับปัญหาสิ่งแวดล้อมอื่นๆ มากมาย เทคโนโลยีนี้ให้คำตอบเพียงส่วนหนึ่งเท่านั้น — แต่เป็นเพียงส่วนหนึ่ง (only part)\n\nสรุปใจความ: บทความปิดท้ายด้วยการสรุปสมดุล — การกำจัดเกลือมีประโยชน์จริงและจะขยายตัวต่อไป แต่ไม่ใช่ทางออกเดียวของวิกฤตน้ำโลก ต้องควบคู่ไปกับการประหยัดน้ำและใช้น้ำอย่างมีประสิทธิภาพด้วย",
      vocab: [
        { term: "will undoubtedly play a growing role", th: "จะมีบทบาทเพิ่มขึ้นอย่างแน่นอนในอนาคต" },
        { term: "coastal cities and water-scarce nations where alternatives are few", th: "เมืองชายฝั่งและประเทศที่ขาดแคลนน้ำที่มีทางเลือกอื่นน้อย" },
        { term: "not, on its own, a solution to global water scarcity", th: "ไม่ใช่ทางออกเดียวที่จะแก้ปัญหาการขาดแคลนน้ำโลกได้ด้วยตัวมันเอง" },
        { term: "the prohibitive cost of desalinated water for agriculture", th: "ต้นทุนที่สูงเกินไปของน้ำที่ผ่านการกำจัดเกลือสำหรับใช้ในภาคเกษตร" },
        { term: "paired with serious efforts to use existing water supplies more efficiently", th: "ต้องใช้ควบคู่กับความพยายามจริงจังในการใช้น้ำที่มีอยู่ให้มีประสิทธิภาพมากขึ้น" }
      ]
    }
  }
}
