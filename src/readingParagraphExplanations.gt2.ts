// General Training bank #2 — Thai paragraph explanations for the
// "งงกับย่อหน้านี้ อยากให้พี่ดอยช่วยอธิบาย" button. Covers exams
// gt-reading-full-test05 and gt-reading-full-test07 (5 passages each).
//
// GT passage titles are NOT unique (every exam just has "Passage 1" ...
// "Passage 5"), so GT entries are keyed by `${examId}#p${passageNumber}`
// instead of by normalized title — see readingParagraphExplanations.ts for
// the title-keyed Cambridge scheme this deliberately differs from.
import type { ReadingParagraphExplanation } from './readingParagraphExplanations'

export const READING_PARAGRAPH_EXPLANATIONS_GT_2: Record<string, Record<number, ReadingParagraphExplanation>> = {
  // ===================================================================
  // gt-reading-full-test05 — Passage 1: Transition care for the elderly
  // ===================================================================
  "gt-reading-full-test05#p1": {
    0: {
      explanationTh:
        "ย่อหน้านี้เป็นหัวเรื่องและคำอธิบายว่า 'transition care' คืออะไร\n\nชื่อเรื่อง 'TRANSITION CARE FOR THE ELDERLY' แปลว่า 'การดูแลช่วงเปลี่ยนผ่านสำหรับผู้สูงอายุ' จากนั้นตั้งคำถามเอง 'What is transition care?' แล้วตอบทันที\n\nTransition care คือบริการสำหรับผู้สูงอายุที่เคยได้รับการรักษาทางการแพทย์มาก่อน (have been receiving medical treatment) แต่ยังต้องการความช่วยเหลือเพิ่มเติมเพื่อฟื้นตัว (need more help to recover) และต้องการเวลาตัดสินใจว่าจะไปอยู่ที่ไหนในระยะยาว (time to make a decision about the best place for them to live in the longer term) — พูดง่ายๆ คือบริการนี้เป็น 'จุดพัก' ระหว่างออกจากโรงพยาบาลกับการหาที่อยู่ถาวร\n\nประโยคถัดมาบอกเงื่อนไขสำคัญ: คุณเข้าถึงบริการนี้ได้จากโรงพยาบาลโดยตรงเท่านั้น (You can only access transition care directly from the hospital) — คือถ้าไม่ได้มาจากโรงพยาบาล จะสมัครบริการนี้เองไม่ได้\n\nสุดท้ายบอกลักษณะบริการ: เน้นเป้าหมายเฉพาะบุคคลและการบำบัด (focused on individual goals and therapies) และให้บริการในระยะเวลาจำกัดเท่านั้น (given for a limited time only) ไม่ใช่บริการถาวร\n\nสรุปใจความ: ย่อหน้านี้นิยาม transition care ว่าเป็นบริการชั่วคราวหลังออกจากโรงพยาบาล เพื่อช่วยฟื้นตัวและตัดสินใจเรื่องที่อยู่ระยะยาว โดยต้องมาจากโรงพยาบาลเท่านั้นและมีเวลาจำกัด",
      vocab: [
        { term: "receiving medical treatment", th: "กำลังได้รับการรักษาทางการแพทย์อยู่" },
        { term: "recover", th: "ฟื้นตัว/ฟื้นฟูร่างกาย" },
        { term: "in the longer term", th: "ในระยะยาว" },
        { term: "access transition care directly from the hospital", th: "เข้าถึงบริการนี้ได้จากโรงพยาบาลโดยตรงเท่านั้น (ช่องทางเดียว)" },
        { term: "focused on individual goals and therapies", th: "เน้นเป้าหมายและการบำบัดที่ออกแบบเฉพาะคน ไม่ใช่สูตรเดียวกันหมด" },
        { term: "given for a limited time only", th: "ให้บริการได้เพียงช่วงเวลาจำกัด ไม่ใช่ตลอดไป" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้บอกว่ามีบริการอะไรบ้าง ใครเป็นผู้ให้บริการ และเรื่องค่าใช้จ่าย\n\nแรกสุดคือรายการบริการที่อาจได้รับ (a package of services that may include): การบำบัดแบบเข้มข้นต่ำ เช่น physiotherapy (กายภาพบำบัด — ออกกำลังกาย การเคลื่อนไหว ความแข็งแรงและการทรงตัว) และ podiatry (การดูแลเท้า) นอกจากนี้ยังมีนักสังคมสงเคราะห์ (a social worker) การพยาบาลดูแลอาการทางคลินิก เช่น การดูแลแผล (wound care) และการดูแลส่วนตัว (personal care)\n\nจากนั้นตอบคำถาม 'ใครเป็นผู้ให้บริการ': ส่วนใหญ่ให้บริการโดยองค์กรที่ไม่ใช่ของรัฐ (non-government organisations) และรัฐบาลช่วยอุดหนุนค่าใช้จ่าย (subsidised by the government) แต่ถ้าฐานะการเงินของคุณเอื้ออำนวย (if your circumstances allow) ก็คาดว่าคุณจะต้องร่วมจ่ายค่าดูแลด้วย (you'll contribute to the cost of your care)\n\nเรื่องค่าธรรมเนียมรายวัน: หน่วยงานที่ให้บริการ (your service provider) เป็นผู้กำหนดค่าธรรมเนียม พวกเขาต้องอธิบายค่าใช้จ่ายนี้ให้คุณทราบ และจำนวนเงินที่เรียกเก็บต้องเป็นส่วนหนึ่งของข้อตกลงระหว่างคุณกับผู้ให้บริการ (form part of the agreement) โดยค่าธรรมเนียมคิดเป็นรายวัน (calculated on a daily basis)\n\nสุดท้ายตอบคำถาม 'จะได้รับบริการที่ไหน': ให้บริการที่บ้านของคุณเอง หรือในสถานที่แบบ 'live-in' (พักอาศัยอยู่ที่นั่นเลย)\n\nสรุปใจความ: ย่อหน้านี้ให้รายละเอียดว่า transition care มีบริการอะไรบ้าง ใครจ่ายเงิน (รัฐอุดหนุน + ผู้รับบริการอาจร่วมจ่าย) และให้บริการที่บ้านหรือสถานที่พักอาศัยก็ได้",
      vocab: [
        { term: "physiotherapy", th: "กายภาพบำบัด (ออกกำลังกาย เคลื่อนไหว ความแข็งแรง การทรงตัว)" },
        { term: "podiatry", th: "การดูแลรักษาเท้าโดยเฉพาะ" },
        { term: "non-government organisations", th: "องค์กรเอกชนที่ไม่ใช่หน่วยงานรัฐ (NGO)" },
        { term: "subsidised by the government", th: "รัฐบาลช่วยออกค่าใช้จ่ายบางส่วนให้" },
        { term: "contribute to the cost of your care", th: "ร่วมจ่ายค่าดูแลของตัวเองบางส่วน" },
        { term: "calculated on a daily basis", th: "คิดค่าใช้จ่ายเป็นรายวัน" },
        { term: "'live-in' setting", th: "รูปแบบที่ต้องเข้าไปพักอาศัยอยู่ในสถานที่นั้นเลย (ไม่ใช่อยู่บ้านตัวเอง)" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้าสุดท้ายอธิบายรายละเอียดของ 'live-in' setting และกรณีที่คุณกำลังรับบริการอื่นอยู่แล้ว\n\nประโยคแรก: สถานที่แบบ live-in นี้อาจเป็นส่วนหนึ่งของบ้านพักคนชราที่มีอยู่แล้ว (an existing aged-care home) หรือสถานพยาบาล เช่น ปีกอาคารแยกต่างหากของโรงพยาบาล (a separate wing of a hospital) — คือไม่จำเป็นต้องเป็นสถานที่ใหม่โดยเฉพาะ\n\nจากนั้นตั้งคำถาม: 'ถ้าฉันกำลังรับบริการผ่านโปรแกรมอื่นอยู่แล้วล่ะ?' (What if I'm already receiving services through a different programme?) แล้วตอบว่า: ถ้าคุณกำลังรับการดูแลแบบพักอาศัยที่ได้รับการอุดหนุน (subsidised residential care) อยู่ในบ้านพักคนชราอยู่แล้ว แต่ต้องย้ายไปที่อื่นชั่วคราวเพื่อรับ transition care ที่นั่งของคุณในบ้านพักคนชราเดิมจะถูก 'กันไว้' ให้ (your place in the aged-care home will be held) จนกว่าคุณจะกลับมา (until you return)\n\nสรุปใจความ: ย่อหน้านี้รับประกันว่าการไปรับ transition care ชั่วคราวจะไม่ทำให้คุณเสียที่ในบ้านพักคนชราเดิม เพราะเขาจะกันที่ไว้ให้จนกว่าจะกลับมา",
      vocab: [
        { term: "an existing aged-care home or health facility", th: "บ้านพักคนชราหรือสถานพยาบาลที่มีอยู่แล้ว" },
        { term: "a separate wing of a hospital", th: "ปีก/ส่วนอาคารแยกต่างหากของโรงพยาบาล" },
        { term: "subsidised residential care", th: "การดูแลแบบพักอาศัยที่รัฐช่วยออกค่าใช้จ่าย" },
        { term: "your place ... will be held until you return", th: "ที่ของคุณจะถูกกันไว้ให้จนกว่าคุณจะกลับมา (ไม่เสียสิทธิ์)" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test05 — Passage 2: Cabin bags for air travel
  // ===================================================================
  "gt-reading-full-test05#p2": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดบอกภาพรวม: ถ้าอยากได้กระเป๋าใบเล็กมีล้อ (a small bag with wheels) ที่พกขึ้นเครื่องได้เลย (take onto the plane with you) มีให้เลือกหลากหลายมาก (there's a wide choice) แล้วบอกว่าต่อไปนี้คือกระเป๋ารุ่นที่ดีที่สุดบางส่วน (Here are some of the best) — เป็นการเกริ่นว่าย่อหน้าถัดๆ ไปจะรีวิวกระเป๋า 5 รุ่น (A–E)\n\nสรุปใจความ: ประโยคนำเรื่องสำหรับบทความรีวิวกระเป๋าเดินทางขึ้นเครื่อง 5 รุ่น",
      vocab: [
        { term: "a small bag with wheels", th: "กระเป๋าใบเล็กที่มีล้อลาก" },
        { term: "take onto the plane with you", th: "นำขึ้นเครื่องบินไปด้วยได้ (ไม่ต้องโหลดใต้ท้องเครื่อง)" },
        { term: "a wide choice", th: "มีตัวเลือกให้เลือกเยอะมาก" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'A' — เป็นป้ายหัวข้อบอกว่าเนื้อหารีวิวกระเป๋ารุ่นแรก (Flyer B3) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    2: {
      explanationTh:
        "ย่อหน้านี้รีวิวกระเป๋ารุ่น 'The Flyer B3'\n\nจุดเด่น: เป็นกระเป๋าเดินทางน้ำหนักเบามาก (ultra-lightweight) ที่ทนต่อการใช้งานหนักได้ดี (can withstand some pretty harsh treatment) ผ้าไนลอนและโพลีเอสเตอร์ด้านข้างจะไม่ฉีกขาดหรือแตกออก (won't rip or burst open) แม้ถูกทำตกหรือโยนระหว่างขนส่ง (if it's dropped or thrown whilst in transit)\n\nแต่ (However) มีจุดอ่อน: ด้ามจับแบบลาก (the trolley handle) รู้สึกบางและไม่แข็งแรง (thin and flimsy) ด้ามจับด้านบนสำหรับหิ้ว (the top carrying handle) แข็งและแบน (hard and flat) ส่วนด้ามจับด้านข้าง (the side handle) ก็จับได้ไม่ถนัด (isn't easy to grip)\n\nสรุปใจความ: Flyer B3 แข็งแรง ทนกระแทกได้ดี แต่ด้ามจับทุกจุดใช้งานไม่สบายมือ",
      vocab: [
        { term: "ultra-lightweight", th: "น้ำหนักเบามากเป็นพิเศษ" },
        { term: "withstand some pretty harsh treatment", th: "ทนต่อการใช้งานที่ค่อนข้างรุนแรง/หยาบได้" },
        { term: "won't rip or burst open", th: "จะไม่ฉีกขาดหรือแตกออก" },
        { term: "thin and flimsy", th: "บางและไม่แข็งแรง/ดูเปราะบาง" },
        { term: "isn't easy to grip", th: "จับได้ไม่ถนัด/ไม่กระชับมือ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'B' — เป็นป้ายหัวข้อบอกว่ารีวิวกระเป๋ารุ่นถัดไป (Lightglide) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    4: {
      explanationTh:
        "ย่อหน้านี้รีวิวกระเป๋ารุ่น 'The Lightglide'\n\nมีกระเป๋าภายนอก 2 ช่อง (two external pockets) ทั้งคู่มีซิปและล็อกได้ (zipped and lockable) แต่กระเป๋าด้านในไม่มีซิป (the inside pocket does not zip)\n\nจากการทดสอบ (In tests) พบว่าของข้างในยังแห้งอยู่แม้โดนราดน้ำหนักๆ (the contents remain dry when given a good soaking) แม้แต่บริเวณรอบซิปก็ยังกันน้ำได้ (even around the zips) — คือกันน้ำดีมาก\n\nด้ามจับแบบลาก (the trolley handle) ปรับความสูงได้ 2 ระดับ (a choice of two heights) และด้ามจับพลาสติก (the plastic hand grip) ไม่มีขอบคมที่จะทำให้มือเจ็บ (doesn't have any sharp ridges that'll make your hands sore) ส่วนการหิ้วมีด้ามจับผ้าทั้งด้านบนและด้านข้าง (fabric handles at the top and side)\n\nสรุปใจความ: Lightglide เด่นเรื่องกันน้ำดีและด้ามจับหลากหลาย/ปรับได้ ใช้งานสบายมือ",
      vocab: [
        { term: "zipped and lockable", th: "มีซิปและสามารถล็อกกุญแจได้" },
        { term: "given a good soaking", th: "ถูกราดน้ำจนเปียกโชก (ทดสอบความกันน้ำ)" },
        { term: "sharp ridges", th: "ขอบ/สันที่คม (จะบาดหรือกดเจ็บมือ)" },
        { term: "make your hands sore", th: "ทำให้มือเจ็บ/ปวด" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'C' — เป็นป้ายหัวข้อบอกว่ารีวิวกระเป๋ารุ่นถัดไป (Foxton) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้านี้รีวิวกระเป๋ารุ่น 'The Foxton'\n\nจุดเด่น: ควบคุมทิศทางได้ง่ายบนพื้นผิวส่วนใหญ่ (easy to control across most surfaces)\n\nแต่ (However) มีปัญหา: ซิปไม่ลื่นสม่ำเสมอ โดยเฉพาะตรงมุม (the zips don't always run smoothly especially around the corners) จนบางทีต้องกระตุกแรงๆ (you may have to give them a good tug) โดยเฉพาะถ้ากระเป๋าแน่นมาก (especially if the case is very full)\n\nข้อควรระวังสำคัญ: ควรหลีกเลี่ยงถ้าจะไปที่ที่ฝนตก (definitely one to avoid if you're going somewhere rainy) เพราะมันปล่อยให้น้ำเข้าได้เยอะมาก (lets loads of water in) และเอกสารในกระเป๋าก็จะเปียกด้วย เว้นแต่ใส่ไว้ในแฟ้มพลาสติก (unless they're in plastic folders)\n\nสรุปใจความ: Foxton ลากง่าย แต่ซิปฝืดตรงมุม และกันน้ำไม่ดีเลย ไม่เหมาะกับเดินทางไปที่ฝนตก",
      vocab: [
        { term: "easy to control across most surfaces", th: "ลากควบคุมทิศทางง่ายบนพื้นผิวเกือบทุกแบบ" },
        { term: "give them a good tug", th: "ต้องกระตุก/ดึงแรงๆ" },
        { term: "lets loads of water in", th: "ปล่อยให้น้ำเข้าไปเยอะมาก (กันน้ำไม่ดี)" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'D' — เป็นป้ายหัวข้อบอกว่ารีวิวกระเป๋ารุ่นถัดไป (Skybag) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    8: {
      explanationTh:
        "ย่อหน้านี้รีวิวกระเป๋ารุ่น 'The Skybag'\n\nมีกระเป๋าภายนอกแบบมีซิปช่องเดียว (a single external zipped pocket) และอีกช่องอยู่ด้านในฝากระเป๋า (located inside the lid) เสื้อผ้าถูกยึดให้อยู่กับที่ด้วยสายรัดปรับได้ 2 เส้น (two adjustable straps)\n\nซิปจับง่ายและรูดลื่นรอบกระเป๋า (The zips are easy to grip and they run smoothly around the case) — ตรงข้ามกับ Foxton ที่ซิปฝืด\n\nแต่ (However) กระเป๋านี้รู้สึกค่อนข้างหนักเวลาลากบนพื้นที่ไม่เรียบ (felt a little heavy to pull on all but smooth floors — ตีความได้ว่า => ลากง่ายเฉพาะพื้นเรียบเท่านั้น พื้นอื่นลากยาก) และควบคุมทิศทางได้ยากกว่ากระเป๋ารุ่นอื่นๆ (hard to steer compared with some of the other suitcases)\n\nสรุปใจความ: Skybag มีซิปดีและช่องเก็บของเป็นระเบียบ แต่ลากหนักและควบคุมทิศทางยากถ้าพื้นไม่เรียบ",
      vocab: [
        { term: "adjustable straps", th: "สายรัดที่ปรับความยาวได้" },
        { term: "run smoothly around the case", th: "รูด/เลื่อนลื่นไปรอบตัวกระเป๋า" },
        { term: "felt a little heavy to pull on all but smooth floors", th: "ลากรู้สึกหนักบนพื้นทุกแบบยกเว้นพื้นเรียบ" },
        { term: "hard to steer", th: "บังคับทิศทางยาก" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'E' — เป็นป้ายหัวข้อบอกว่ารีวิวกระเป๋ารุ่นสุดท้าย (Travelsure 35) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    10: {
      explanationTh:
        "ย่อหน้านี้รีวิวกระเป๋ารุ่น 'The Travelsure 35' รุ่นสุดท้าย\n\nจุดเด่นด้านดีไซน์: มีลายผ้าให้เลือกหลากหลายมาก (a huge range of fabric designs) เช่น ลายเสือดาว (leopard print) หรือลายรอยจูบลิปสติก (lipstick kisses) ด้ามจับแบบลากที่ดึงเก็บได้ (The retractable trolley handle) ใช้สบาย แต่ปรับความสูงให้เหมาะกับผู้ใช้ที่สูงต่างกันไม่ได้ (can't be adjusted to suit users of different heights)\n\nด้านการเก็บของ: ไม่มีตัวแบ่งภายใน (no internal divider) แต่มีช่องซิป 2 ช่องที่สะดวกอยู่ในฝากระเป๋า (two handy zipped pockets in the lid)\n\nส่วนการทดสอบความทนทาน: ทดสอบด้วยการทำกระเป๋าตกกระแทกพื้นแข็ง (letting it fall onto a hard floor) และผลคือ ต้องใช้งานกระเป๋านี้ด้วยความระมัดระวังมาก (treat this bag with great care) ถ้าอยากให้มันอยู่ทน (if you want it to last) — ผ้าฉีกขาดหนักตรงมุมหนึ่งจนใช้งานต่อไม่ได้เลย (The fabric tore so badly at one of the corners that it was unusable)\n\nสรุปใจความ: Travelsure 35 สวยและมีลายให้เลือกเยอะ แต่ทนแรงกระแทกได้แย่ที่สุดในบรรดา 5 รุ่นที่รีวิว",
      vocab: [
        { term: "a huge range of fabric designs", th: "มีลายผ้าให้เลือกหลากหลายมาก" },
        { term: "retractable trolley handle", th: "ด้ามจับแบบลากที่ดึงเข้า-ออกเก็บได้" },
        { term: "can't be adjusted to suit users of different heights", th: "ปรับความสูงให้พอดีกับผู้ใช้แต่ละคนไม่ได้" },
        { term: "no internal divider", th: "ไม่มีแผ่นกั้นแบ่งช่องด้านใน" },
        { term: "treat this bag with great care", th: "ต้องใช้งานอย่างระมัดระวังเป็นพิเศษ" },
        { term: "tore so badly ... that it was unusable", th: "ฉีกขาดหนักมากจนใช้งานต่อไม่ได้เลย" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test05 — Passage 3: College car parking policy — staff
  // ===================================================================
  "gt-reading-full-test05#p3": {
    0: {
      explanationTh:
        "ย่อหน้านี้อธิบายกฎเรื่องใบอนุญาตและตั๋วจอดรถของพนักงาน\n\nประโยคแรก: พนักงานต้องมีใบอนุญาต (Staff permits are required) เพื่อจอดรถยนต์ (ยกเว้นรถมอเตอร์ไซค์ที่จอดในช่องจอดจักรยาน — other than a motorcycle parked in the cycle bays) ในมหาวิทยาลัย ระหว่างเวลา 8.30 ถึง 16.30 น. วันจันทร์ถึงศุกร์ ในช่วงเปิดเทอม (during term time)\n\nวิธีได้ใบอนุญาต: ใบอนุญาตรายปี (Annual permits) ซื้อได้จากแผนก Hospitality Department ส่วนแบบฟอร์มสมัคร (Application forms) ดาวน์โหลดได้จากเว็บไซต์ของวิทยาลัย\n\nกฎการแสดงใบอนุญาต: ใบอนุญาต/ตั๋วทุกใบต้องแสดงให้เห็นชัดเจนที่กระจกหน้ารถ (must be clearly displayed in the windscreen) ตลอดช่วงเปิดเทอมตามปฏิทินการศึกษา และถ้าข้อมูลทะเบียนเปลี่ยน ต้องแจ้ง Services Administrator ทางโทรศัพท์ ext. 406\n\nสุดท้ายเรื่องช่วงเวลาซื้อ: ใบอนุญาตรายปีเริ่มซื้อได้ตั้งแต่วันที่ 20 กันยายน มีอายุ 1 ปีการศึกษา ตั้งแต่ 1 ตุลาคม ถึง 30 มิถุนายน ส่วนค่าธรรมเนียมรายปีดูได้จากแบบฟอร์มสมัคร\n\nสรุปใจความ: ย่อหน้านี้บอกกฎพื้นฐานของการจอดรถพนักงาน — ต้องมีใบอนุญาต ซื้อจากไหน แสดงตรงไหน และมีอายุใช้งานเท่าไหร่",
      vocab: [
        { term: "Staff permits are required", th: "พนักงานจำเป็นต้องมีใบอนุญาต" },
        { term: "during term time", th: "ในช่วงที่มหาวิทยาลัย/วิทยาลัยเปิดเทอม" },
        { term: "must be clearly displayed in the windscreen", th: "ต้องวางให้เห็นชัดเจนที่กระจกหน้ารถ" },
        { term: "as published in the academic calendar", th: "ตามที่ประกาศไว้ในปฏิทินการศึกษา" },
        { term: "valid for one academic year", th: "มีอายุใช้งาน 1 ปีการศึกษา" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้อธิบายเรื่องบทลงโทษ (Enforcement) และค่าปรับ\n\nประโยคแรก: บริษัทผู้รับเหมาที่ได้รับการแต่งตั้ง (The nominated contractor) จะออกใบสั่งค่าปรับตายตัว (fixed Penalty Charge Notices) กับรถที่ไม่แสดงใบอนุญาต/ตั๋วที่ถูกต้อง หรือรถที่จอดบนเส้นเหลือง (yellow lines) หรือในช่องจอดคนพิการโดยไม่มีใบอนุญาตจอดรถคนพิการสีฟ้า (blue disabled-parking permit)\n\nข้อควรรู้: พื้นที่จอดรถอาจลดลงชั่วคราวเพื่อรองรับกิจกรรมรับสมัครนักศึกษาของวิทยาลัยหรือโครงการพัฒนา/ซ่อมบำรุงอาคารสถานที่ (College recruitment activities and/or estate development/maintenance projects) — รถที่ผิดกฎจะได้รับ Penalty Charge Notice (PCN)\n\nรายละเอียดค่าปรับ PCN: เริ่มต้นที่ 30 ปอนด์ (£30) และเพิ่มเป็น 60 ปอนด์ (£60) หลังจากออกใบสั่งไปแล้ว 7 วัน บริษัทผู้รับเหมาเป็นผู้รับผิดชอบเก็บเงินค่าปรับที่ค้างชำระ และอาจใช้มาตรการทางกฎหมาย (legal action) เพื่อเรียกเก็บเงิน\n\nเรื่องการอุทธรณ์: ถ้าได้รับ PCN แล้วต้องการอุทธรณ์ ต้องติดต่อบริษัทบังคับใช้กฎการจอดรถโดยตรง (details อยู่ในใบสั่ง) ไม่ใช่ติดต่อวิทยาลัย\n\nสรุปใจความ: ย่อหน้านี้บอกว่าใครเป็นผู้ออกใบปรับ ปรับเท่าไหร่ เพิ่มเมื่อไหร่ และถ้าไม่เห็นด้วยต้องอุทธรณ์กับใคร (ไม่ใช่วิทยาลัย)",
      vocab: [
        { term: "fixed Penalty Charge Notices", th: "ใบสั่งค่าปรับแบบตายตัว (จำนวนเงินคงที่)" },
        { term: "yellow lines", th: "เส้นเหลืองบนถนน (บอกว่าห้ามจอด)" },
        { term: "blue disabled-parking permit", th: "ใบอนุญาตจอดรถคนพิการสีฟ้า" },
        { term: "increasing to £60 seven days after issue", th: "ค่าปรับเพิ่มเป็น 60 ปอนด์ ถ้าไม่จ่ายภายใน 7 วันหลังออกใบสั่ง" },
        { term: "appeals must be taken up directly with the parking enforcement company", th: "การอุทธรณ์ต้องติดต่อบริษัทบังคับใช้กฎจอดรถโดยตรง ไม่ใช่วิทยาลัย" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้าสั้นนี้พูดเรื่องที่จอดรถคนพิการ (Disabled parking)\n\nวิทยาลัยมีช่องจอดรถที่กำหนดไว้เฉพาะสำหรับผู้ขับขี่ที่พิการ (designated car parking spaces for disabled car drivers) และจะพยายามอย่างสมเหตุสมผลที่สุด (make all reasonable efforts) เพื่อให้แน่ใจว่าช่องจอดเหล่านี้ถูกใช้เฉพาะโดยผู้ที่มีใบอนุญาตจอดรถคนพิการสีฟ้า พร้อมกับใบอนุญาตจ่ายเงินตามเวลา (pay-and-display) หรือใบอนุญาตรายปีที่ถูกต้องด้วย\n\nสรุปใจความ: วิทยาลัยพยายามคุ้มครองช่องจอดคนพิการให้ใช้เฉพาะผู้ที่มีสิทธิ์จริงๆ",
      vocab: [
        { term: "designated car parking spaces", th: "ช่องจอดรถที่กำหนดไว้เฉพาะ" },
        { term: "make all reasonable efforts", th: "พยายามอย่างเต็มที่เท่าที่ทำได้ตามสมควร" },
        { term: "pay-and-display", th: "ระบบจ่ายเงินแล้วนำใบเสร็จ/ตั๋วไปวางโชว์ในรถ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้าสุดท้ายพูดถึงกรณีปัญหาที่จอดรถคนพิการ ผู้มาเยือน และจุดจอดรับ-ส่งระยะสั้น\n\nถ้ามีปัญหาเรื่องช่องจอดคนพิการไม่พอ (If issues arise concerning the availability of the parking spaces) ให้ผู้เกี่ยวข้องแจ้งเรื่องกับแผนก Domestic Services Department เพื่อหาทางแก้ชั่วคราว (to effect a temporary solution)\n\nเรื่องผู้มาเยือน (Visitors): วิทยาลัยยินดีต้อนรับผู้มาเยือนและจัดที่จอดรถผ่านใบอนุญาตที่นัดหมายไว้ล่วงหน้า (pre-arranged permits) ซึ่งต้องแสดงในรถด้วย ให้ติดต่อแผนก Hospitality Department สำหรับข้อมูลเพิ่มเติม และในวัน Open Days บางส่วนของที่จอดรถอาจถูกกันไว้สำหรับผู้มาเยือนโดยเฉพาะ\n\nเรื่องจุดจอดรับ-ส่งระยะสั้น: มีช่องจอดรับ-ส่ง 2 ช่องสำหรับผู้ใช้ศูนย์เลี้ยงเด็ก (users of the nursery) จอดรอได้ไม่เกิน 10 นาที (a maximum of ten minutes' waiting time) อยู่บริเวณนอกอาคาร Concorde Building และห้ามใช้ช่องจอดของพนักงานศูนย์เลี้ยงเด็ก (the nursery staff bays) ไม่ว่ากรณีใดก็ตาม (under any circumstances)\n\nสรุปใจความ: ย่อหน้านี้ปิดท้ายด้วยกฎย่อยๆ 3 เรื่อง — วิธีแก้ปัญหาที่จอดคนพิการไม่พอ กฎสำหรับผู้มาเยือน และเงื่อนไขจุดจอดรับ-ส่งเด็กที่ศูนย์เลี้ยงเด็ก",
      vocab: [
        { term: "effect a temporary solution", th: "จัดการหาทางแก้ปัญหาแบบชั่วคราว" },
        { term: "pre-arranged permits", th: "ใบอนุญาตที่นัดหมาย/ขอไว้ล่วงหน้า" },
        { term: "a maximum of ten minutes' waiting time", th: "จอดรอได้นานสุดไม่เกิน 10 นาที" },
        { term: "under any circumstances", th: "ไม่ว่ากรณีใดๆ ทั้งสิ้น (ห้ามเด็ดขาด)" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test05 — Passage 4: Maternity benefits
  // ===================================================================
  "gt-reading-full-test05#p4": {
    0: {
      explanationTh:
        "ย่อหน้าเปิดเรื่องสวัสดิการคุณแม่ตั้งครรภ์ แล้วเจาะรายละเอียด Statutory Maternity Pay (SMP)\n\nประโยคแรก: ถ้ากำลังตั้งครรภ์ (If you are expecting a baby) มีโครงการสวัสดิการหลายแบบที่อาจช่วยด้านการเงินได้ แต่คุณสมบัติผู้มีสิทธิ์ (eligibility) จะต่างกันไปในแต่ละโครงการ\n\nSMP คืออะไร: คุณอาจมีสิทธิ์ได้รับ Statutory Maternity Pay จากนายจ้าง (from your employer) เป็นเงินจ่ายรายสัปดาห์ (a weekly payment) เพื่อช่วยให้คุณลาหยุดงานได้ง่ายขึ้น ทั้งก่อนและหลังคลอด (both before and after the birth of your baby) จ่ายได้นานสูงสุด 39 สัปดาห์\n\nเงื่อนไขมีสิทธิ์: ต้องทำงานกับบริษัทเดิมอย่างน้อย 26 สัปดาห์ นับถึงสิ้นสุดสัปดาห์ที่ 15 ก่อนวันครบกำหนดคลอด (by the end of the 15th week before your baby is due) และต้องมีรายได้เฉลี่ยอย่างน้อย 87 ปอนด์ต่อสัปดาห์ (ก่อนหักภาษี)\n\nจำนวนเงินที่ได้: ขึ้นอยู่กับรายได้ของคุณ — 6 สัปดาห์แรกได้ 90% ของรายได้เฉลี่ยรายสัปดาห์ จากนั้นอีก 33 สัปดาห์ที่เหลือได้คงที่ 112.75 ปอนด์ต่อสัปดาห์\n\nสรุปใจความ: ย่อหน้านี้อธิบาย SMP ว่าเป็นเงินช่วยเหลือจากนายจ้าง มีเงื่อนไขเรื่องระยะเวลาทำงานและรายได้ขั้นต่ำ และจำนวนเงินลดหลั่นเป็น 2 ช่วง",
      vocab: [
        { term: "Statutory Maternity Pay (SMP)", th: "เงินสงเคราะห์การคลอดบุตรตามกฎหมายที่นายจ้างต้องจ่าย" },
        { term: "eligibility", th: "คุณสมบัติที่ทำให้มีสิทธิ์ได้รับ" },
        { term: "by the end of the 15th week before your baby is due", th: "ภายในสิ้นสุดสัปดาห์ที่ 15 ก่อนวันครบกำหนดคลอด" },
        { term: "earning an average of at least £87 per week", th: "มีรายได้เฉลี่ยอย่างน้อยสัปดาห์ละ 87 ปอนด์" },
        { term: "90% of your average weekly earnings", th: "90% ของรายได้เฉลี่ยต่อสัปดาห์ของคุณ" }
      ]
    },
    1: {
      explanationTh:
        "ย่อหน้านี้พูดถึง Maternity Allowance (MA) แล้วเริ่มพูดถึง Child Tax Credit\n\nMA คือใคร: สำหรับคนที่เป็นลูกจ้างหรือทำงานอิสระ (employed or self-employed) แต่ไม่มีสิทธิ์ได้ SMP\n\nเงื่อนไข: ต้องทำงาน (เป็นลูกจ้างหรืออิสระ) อย่างน้อย 26 สัปดาห์ ในช่วง 66 สัปดาห์ก่อนวันครบกำหนดคลอด โดยไม่จำเป็นต้องทำงานกับนายจ้างเดิมตลอด (You don't have to work for the same employer) และไม่จำเป็นต้องทำงานเต็มสัปดาห์ทุกสัปดาห์ (ทำงานแค่บางส่วนของสัปดาห์ก็นับเป็นสัปดาห์เต็มได้ — a part week counts as a full week)\n\nจำนวนเงิน: จ่ายได้นานสูงสุด 39 สัปดาห์ โดยจ่ายในอัตราเดียวกับ SMP หรือ 90% ของรายได้เฉลี่ยรายสัปดาห์ แล้วแต่ว่าจำนวนไหนต่ำกว่า (whichever amount is the lower) แบบฟอร์มขอ MA หาได้ที่คลินิกฝากครรภ์ (antenatal clinics) ทั่วประเทศ\n\nสุดท้ายเริ่มเกริ่น Child Tax Credit: ถ้ารายได้น้อย (on a low income) อายุเกิน 16 ปี และรับผิดชอบเลี้ยงดูลูกอย่างน้อย 1 คน อาจมีสิทธิ์ได้รับ Child Tax Credit ด้วย\n\nสรุปใจความ: MA คือทางเลือกสำหรับคนที่ไม่ได้ SMP มีเงื่อนไขยืดหยุ่นกว่า (ไม่ต้องอยู่นายจ้างเดิม) แต่ได้เงินเท่ากับจำนวนที่ต่ำกว่าเสมอ",
      vocab: [
        { term: "Maternity Allowance (MA)", th: "เงินช่วยเหลือคลอดบุตรอีกประเภทหนึ่ง สำหรับคนที่ไม่มีสิทธิ์ SMP" },
        { term: "a part week counts as a full week", th: "ทำงานแค่บางวันในสัปดาห์นั้น ก็นับเป็นสัปดาห์เต็ม 1 สัปดาห์ได้" },
        { term: "whichever amount is the lower", th: "จำนวนไหนน้อยกว่าให้ยึดจำนวนนั้น" },
        { term: "antenatal clinics", th: "คลินิกฝากครรภ์" },
        { term: "on a low income", th: "มีรายได้น้อย" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้าสุดท้ายอธิบายรายละเอียด Child Tax Credit ต่อ แล้วปิดท้ายด้วย Sure Start Maternity Payments\n\nจำนวนเงิน Child Tax Credit: ขึ้นอยู่กับสถานการณ์ส่วนตัวและรายได้ของคุณ (your personal circumstances and income) เมื่อประเมินรายได้ (When your income is being assessed) เงินช่วยเหลือบุตร (child benefit) เงินค่าเลี้ยงดู (maintenance payments) หรือเงิน Maternity Allowance จะไม่ถูกนับเป็นรายได้ (will not be classed as income) — พูดอีกแบบคือ เงินเหล่านี้จะไม่ถูกเอามาคำนวณรวมตอนคิด Child Tax Credit ของคุณ\n\nSure Start Maternity Payments: ถ้าคุณได้รับสวัสดิการ (benefits) หรือ Child Tax Credit เพราะรายได้น้อย คุณอาจมีสิทธิ์ได้รับ Sure Start Maternity Payments ด้วย ซึ่งเป็นเงินช่วยเหลือแบบให้เปล่ารายบุคคล (individual grants) เพื่อช่วยค่าใช้จ่ายในการมีลูกใหม่ (to help towards the cost of a new baby)\n\nสรุปใจความ: เงินบางประเภท (child benefit, maintenance, MA) จะไม่ถูกนับเป็นรายได้ตอนคิด Child Tax Credit และถ้ารายได้น้อยพออาจได้เงินให้เปล่าอีกก้อนคือ Sure Start Maternity Payments",
      vocab: [
        { term: "will not be classed as income", th: "จะไม่ถูกนับว่าเป็นรายได้" },
        { term: "taken into account", th: "ถูกนำมาคิดคำนวณรวมด้วย" },
        { term: "individual grants", th: "เงินช่วยเหลือให้เปล่าเป็นรายบุคคล (ไม่ต้องคืน)" },
        { term: "help towards the cost of a new baby", th: "ช่วยแบ่งเบาค่าใช้จ่ายที่เกิดขึ้นจากการมีลูกใหม่" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test05 — Passage 5: PAPYRUS
  // ===================================================================
  "gt-reading-full-test05#p5": {
    0: {
      explanationTh:
        "นี่คือชื่อเรื่องของบทความ: 'PAPYRUS' (กระดาษปาปิรุส) ยังไม่มีเนื้อหาให้อธิบาย เนื้อหาจริงจะเริ่มในย่อหน้าถัดไป"
    },
    1: {
      explanationTh:
        "ประโยคบรรยายใต้ชื่อเรื่อง (subtitle) สรุปใจความหลักของทั้งบทความ: ต้นปาปิรุส (the papyrus plant) ซึ่งชาวอียิปต์โบราณ (the ancient Egyptians) เคยใช้ทำกระดาษ (Used ... to make paper) มีส่วนช่วยหล่อหลอมโลกที่เราอาศัยอยู่ทุกวันนี้ (has helped to shape the world we live in) — เป็นการบอกล่วงหน้าว่าบทความจะพูดถึงความสำคัญทางประวัติศาสตร์ของปาปิรุส",
      vocab: [
        { term: "has helped to shape the world we live in", th: "มีส่วนช่วยหล่อหลอม/กำหนดรูปร่างโลกปัจจุบันของเรา" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'A' — เป็นป้ายหัวข้อบอกว่าเนื้อหาส่วน A ของบทความกำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    3: {
      explanationTh:
        "ย่อหน้า A (ส่วนแรก) พูดถึงความสำคัญของเอกสารในชีวิตมนุษย์\n\nประโยคแรก: ห้องสมุดและหอจดหมายเหตุ (Libraries and archives) เป็น 'สี่แยกทางวัฒนธรรม' ของการแลกเปลี่ยนความรู้ (cultural crossroads of knowledge exchange — ตีความได้ว่า => เป็นจุดที่ความรู้จากอดีตส่งต่อมาถึงปัจจุบัน) ที่ซึ่งอดีตส่งข้อมูลมาสู่ปัจจุบัน (the past transmits information to the present) และที่ซึ่งปัจจุบันมีโอกาสส่งต่อไปให้อนาคต (the present has the opportunity to inform the future)\n\nจากนั้นอธิบายว่า ระบบราชการ (Bureaucracies) กลายเป็นกระดูกสันหลัง (the backbone) ของอารยธรรม เพราะรัฐบาลพยายามติดตามข้อมูลประชากร ธุรกรรมทางธุรกิจ และภาษี\n\nในระดับส่วนบุคคล ชีวิตของเราถูกควบคุมด้วยเอกสารที่เรามี (our lives are governed by the documents we possess) — เราถูกรับรองด้วยเอกสารตั้งแต่เกิดจนตาย (certified on paper literally from birth to death)\n\nสุดท้ายยกตัวอย่างว่าเอกสารที่เป็นลายลักษณ์อักษรมีความสำคัญทางวัฒนธรรมมหาศาล (written documentation carries enormous cultural importance) เช่น การลงนามในเอกสารก่อตั้งสหประชาชาติ (the Foundation Document of the United Nations) หรืออนุสัญญาว่าด้วยความหลากหลายทางชีวภาพ (the Convention on Biological Diversity)\n\nสรุปใจความ: ย่อหน้านี้เกริ่นว่าเอกสาร/การบันทึกข้อมูลสำคัญมากต่อทั้งสังคมและชีวิตส่วนตัวของมนุษย์ ก่อนจะพาไปสู่เรื่องปาปิรุสในย่อหน้าถัดไป",
      vocab: [
        { term: "cultural crossroads of knowledge exchange", th: "จุดตัด/ศูนย์กลางทางวัฒนธรรมที่ความรู้ถูกส่งต่อกัน" },
        { term: "the backbone of civilizations", th: "กระดูกสันหลัง/รากฐานสำคัญของอารยธรรม" },
        { term: "our lives are governed by the documents we possess", th: "ชีวิตเราถูกกำหนด/ควบคุมโดยเอกสารที่เรามีอยู่" },
        { term: "carries enormous cultural importance", th: "มีความสำคัญทางวัฒนธรรมอย่างมหาศาล" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้า A ส่วนที่สอง พูดถึงวิวัฒนาการของ 'พื้นผิวสำหรับเขียน' ก่อนจะมาถึงปาปิรุส\n\nประโยคแรก: การบันทึกเอกสารต้องมีเครื่องมือเขียนและพื้นผิวเพื่อจดบันทึกข้อมูลอย่างถาวร (a surface upon which to record the information permanently)\n\nประวัติศาสตร์: เมื่อราว 5,000 ปีก่อน ชาวสุเมเรียน (the Sumerians) เริ่มใช้ไม้อ้อหรือกิ่งไม้ขีดเขียนลงบนแผ่นดินโคลนแล้วนำไปเผา (mud blocks which were then baked) แม้จะกันไฟได้ (despite being fireproof) แต่ก็เก็บรักษายาก (difficult to store) วัฒนธรรมอื่นๆ ใช้พื้นผิวที่ยืดหยุ่นกว่าแต่คงทนน้อยกว่า (more flexible but less permanent) เช่น หนังสัตว์และแผ่นไม้\n\nจุดเปลี่ยนสำคัญ: ในวัฒนธรรมตะวันตก การนำปาปิรุสมาใช้ (the adoption of papyrus) ส่งผลกระทบใหญ่หลวง (was to have a great impact) เพราะแผ่นปาปิรุสไม่เพียงให้บันทึกชีวิตประจำวันของผู้คนที่มีค่ามาก แต่ยังสามารถใช้เทคนิคการหาอายุด้วยคาร์บอน (carbon-dating techniques) เพื่อระบุอายุที่แน่นอนของข้อความที่เขียนบนนั้นได้ด้วย\n\nสรุปใจความ: ก่อนปาปิรุสมนุษย์ลองใช้วัสดุหลายแบบ (ดินโคลน หนังสัตว์ ไม้) แต่ล้วนมีข้อเสีย ปาปิรุสจึงกลายเป็นจุดเปลี่ยนสำคัญเพราะทั้งบันทึกข้อมูลได้ดีและหาอายุได้แม่นยำ",
      vocab: [
        { term: "record the information permanently", th: "บันทึกข้อมูลไว้อย่างถาวร" },
        { term: "mud blocks which were then baked", th: "แผ่นดินโคลนที่ถูกนำไปเผา (เพื่อให้แข็งคงทน)" },
        { term: "more flexible but less permanent", th: "ยืดหยุ่นกว่าแต่คงทนถาวรน้อยกว่า" },
        { term: "the adoption of papyrus was to have a great impact", th: "การเริ่มนำปาปิรุสมาใช้ส่งผลกระทบใหญ่มากในเวลาต่อมา" },
        { term: "carbon-dating techniques", th: "เทคนิคหาอายุวัตถุโดยใช้คาร์บอนกัมมันตรังสี" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'B' — เป็นป้ายหัวข้อบอกว่าเนื้อหาส่วน B กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้า B อธิบายว่าปาปิรุสคืออะไร และผลิตขึ้นมาอย่างไร\n\nประโยคแรก: ปาปิรุสเชื่อมโยงอย่างมากกับวัฒนธรรมอียิปต์ (strongly associated with Egyptian culture) แม้ว่าอารยธรรมโบราณรอบทะเลเมดิเตอร์เรเนียนทั้งหมดจะใช้มันเหมือนกัน (all the ancient civilizations around the Mediterranean used it)\n\nปาปิรุสคืออะไร: 'papyrus sedge' คือพืชคล้ายหญ้าต้นสูง (a tall grass-like plant) ถูกเก็บเกี่ยวจากน้ำตื้นและพื้นที่ชุ่มน้ำ (shallow water and swamplands) ริมฝั่งแม่น้ำไนล์\n\nขั้นตอนการผลิต (ซับซ้อนและยุ่งเหยิง — a complex, messy process): 1) ตัดไส้ในของลำต้น (Pith from inside the plant's stem) เป็นแถบยาวๆ วางเรียงกัน 2) คลุมด้วยแถบชั้นที่สองที่วางตั้งฉากกับชั้นแรก (laid at right angles to the first) 3) แช่น้ำแล้วทุบให้เข้ากัน (soaked in water and hammered together) 4) บีบอัดเพื่อไล่น้ำออก ทำให้แห้ง แล้วขัดเงา (crushed to extract the water, dried and then polished) จนได้พื้นผิวสำหรับเขียนคุณภาพสูง แผ่นแต่ละแผ่นสามารถนำมาติดกาวต่อกันแล้วม้วนเป็นม้วนหนังสือ (scrolls) หรือพับและเข้าเล่มเป็นหนังสือ (books) ได้\n\nสรุปใจความ: ย่อหน้านี้อธิบายที่มา (พืชริมแม่น้ำไนล์) และขั้นตอนการผลิตปาปิรุสอย่างละเอียด ตั้งแต่ตัดไส้ลำต้นจนถึงกลายเป็นแผ่นเขียนหนังสือหรือม้วนสำเร็จ",
      vocab: [
        { term: "papyrus sedge", th: "ต้นปาปิรุส (พืชคล้ายหญ้าที่นำมาทำเป็นวัสดุเขียน)" },
        { term: "harvested from shallow water and swamplands", th: "ถูกเก็บเกี่ยวมาจากน้ำตื้นและพื้นที่ชุ่มน้ำ" },
        { term: "a complex, messy process", th: "กระบวนการที่ซับซ้อนและยุ่งเหยิง/เลอะเทอะ" },
        { term: "laid at right angles to the first", th: "วางในแนวตั้งฉากกับชั้นแรก (ไขว้กัน)" },
        { term: "crushed to extract the water", th: "ถูกบีบอัดเพื่อไล่น้ำออก" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'C' — เป็นป้ายหัวข้อบอกว่าเนื้อหาส่วน C กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    8: {
      explanationTh:
        "ย่อหน้า C ส่วนแรก พูดถึงว่าปาปิรุสอยู่รอดได้ในสภาพอากาศแบบไหน และแหล่งค้นพบสำคัญ\n\nประโยคแรก: ในภูมิอากาศชื้น (In moist climates) แผ่นปาปิรุสที่มีเซลลูโลสสูง (the cellulose-rich sheets of papyrus) จะเน่าเปื่อยง่าย (would readily decay) ขึ้นราหรือเป็นรูพรุนจากแมลงกัดกิน (becoming covered by mould or full of holes from attacks by insects)\n\nแต่ (But) ในภูมิอากาศแห้ง เช่น ตะวันออกกลาง ปาปิรุสจะเป็นพื้นผิวเขียนที่มั่นคง ทนต่อการเน่าเปื่อย (a stable, rot-resistant writing surface)\n\nแหล่งค้นพบสำคัญ: ม้วนปาปิรุสที่เก่าแก่ที่สุดที่รู้จัก (The earliest known roll of papyrus scroll) พบในสุสานของเจ้าหน้าที่ชื่อ Hemeka ใกล้เมือง Memphis (เมืองหลวงอียิปต์ในเวลานั้น) มีอายุประมาณ 5,000 ปี ในปี ค.ศ. 79 ม้วนปาปิรุสเกือบ 2,000 ม้วนในห้องสมุดของพ่อตาของ Julius Caesar ได้รับการปกป้องที่ Herculaneum โดยเถ้าถ่านจากการปะทุครั้งใหญ่ของภูเขาไฟ Vesuvius\n\nแหล่งค้นพบที่มีชื่อเสียงที่สุด: มาจากกองขยะของเมืองโบราณ Oxyrhynchus ห่างจากไคโรไปทางตะวันตกเฉียงใต้ราว 160 กิโลเมตร ในทะเลทรายทางตะวันตกของแม่น้ำไนล์ Oxyrhynchus เคยเป็นเมืองหลวงการปกครองระดับภูมิภาค สร้างเอกสารราชการจำนวนมหาศาลเป็นเวลาถึง 1,000 ปี (บัญชี ใบคืนภาษี จดหมาย) ซึ่งถูกทิ้งเป็นระยะๆ เพื่อเปิดที่ว่างสำหรับเอกสารใหม่ เมื่อเวลาผ่านไป ทรายหนาปกคลุมกองขยะเหล่านี้จนถูกลืม แต่เอกสารกลับถูกทรายปกป้องไว้ กลายเป็น 'แคปซูลเวลา' (a time capsule) ที่ทำให้เราได้เห็นชีวิตของชาวเมืองในอดีตหลายร้อยปี\n\nสรุปใจความ: ปาปิรุสอยู่รอดได้ดีเฉพาะในที่แห้ง และแหล่งค้นพบสำคัญที่สุดมาจากกองขยะโบราณที่ถูกทรายฝังกลบจนกลายเป็นบันทึกประวัติศาสตร์โดยบังเอิญ",
      vocab: [
        { term: "a stable, rot-resistant writing surface", th: "พื้นผิวเขียนที่มั่นคง ทนต่อการเน่าเปื่อย" },
        { term: "The earliest known roll of papyrus scroll", th: "ม้วนปาปิรุสที่เก่าแก่ที่สุดเท่าที่เคยพบ" },
        { term: "protected ... by ash from the catastrophic eruption", th: "ได้รับการปกป้องไว้ด้วยเถ้าถ่านจากการปะทุครั้งร้ายแรง" },
        { term: "generated vast amounts of administrative documentation", th: "สร้างเอกสารราชการปริมาณมหาศาล" },
        { term: "a time capsule", th: "สิ่งที่เก็บรักษาร่องรอยอดีตไว้ให้คนรุ่นหลังได้เห็น (แคปซูลเวลา)" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้า C ส่วนที่สอง พูดถึงการทำลายเอกสาร/ห้องสมุดในประวัติศาสตร์\n\nประโยคแรก: กลุ่มเอกสารที่บันทึกข้อมูลและความคิด (Collections of documents that record information and ideas) มักถูกมองว่าอาจเป็นอันตราย (frequently been viewed as potentially dangerous)\n\nเป็นเวลานับพันปี รัฐบาล ทรราช และผู้พิชิต (governments, despots and conquerors) ใช้วิธีเผาห้องสมุดและหนังสือ (resorted to burning libraries and books) เพื่อกำจัดหลักฐานที่ไม่สะดวกใจ (to rid themselves of inconvenient evidence) หรือทำลายวัฒนธรรมและความคิดที่พวกเขาเห็นว่ายอมรับไม่ได้ในทางการเมือง ศีลธรรม หรือศาสนา\n\nตัวอย่างโศกนาฏกรรมหนึ่ง: การเผาหอสมุดใหญ่แห่งอเล็กซานเดรีย (the burning of the Great Library of Alexandria) พร้อมม้วนปาปิรุสและหนังสือที่อยู่ในนั้น ได้กลายเป็นตำนาน (has been mythologized) และกลายเป็นสัญลักษณ์ของการสูญเสียความรู้ทางวัฒนธรรมระดับโลก (has come to symbolize the global loss of cultural knowledge)\n\nสรุปใจความ: ย่อหน้านี้ชี้ว่าเอกสาร/ความรู้ที่บันทึกไว้เคยถูกมองว่าอันตรายจนถูกทำลายซ้ำแล้วซ้ำเล่าตลอดประวัติศาสตร์ โดยยกตัวอย่างการเผาหอสมุดอเล็กซานเดรียเป็นสัญลักษณ์",
      vocab: [
        { term: "resorted to burning libraries and books", th: "หันไปใช้วิธีเผาห้องสมุดและหนังสือ" },
        { term: "to rid themselves of inconvenient evidence", th: "เพื่อกำจัดหลักฐานที่ทำให้ตัวเองลำบากใจทิ้งไป" },
        { term: "has been mythologized", th: "ถูกเล่าขานจนกลายเป็นตำนาน" },
        { term: "symbolize the global loss of cultural knowledge", th: "เป็นสัญลักษณ์ของการสูญเสียความรู้ทางวัฒนธรรมระดับโลก" }
      ]
    },
    10: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'D' — เป็นป้ายหัวข้อบอกว่าเนื้อหาส่วน D กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    11: {
      explanationTh:
        "ย่อหน้า D พูดถึงการใช้ปาปิรุสนอกเหนือจากการเขียน\n\nประโยคแรก: นอกจากใช้บันทึกข้อมูล (Besides their use in record-keeping) ลำต้นปาปิรุสยังถูกใช้ในด้านอื่นๆ ของชีวิตชาวเมดิเตอร์เรเนียน เช่น สร้างเรือ (boat construction) ทำเชือก ใบเรือ และตะกร้า รวมถึงเป็นแหล่งอาหารด้วย\n\nตัวอย่างสำคัญ: ในปี 1969 นักผจญภัย Thor Heyerdahl พยายามข้ามมหาสมุทรแอตแลนติกจากโมร็อกโกด้วยเรือชื่อ 'Ra' เพื่อพิสูจน์ว่านักเดินเรือในสมัยโบราณสามารถข้ามมหาสมุทรแอตแลนติกได้จริง เรือ Ra สร้างจากมัดลำต้นปาปิรุส (bundles of papyrus stems) และจำลองแบบมาจากเรือโบราณของอียิปต์\n\nประโยชน์ด้านสิ่งแวดล้อม: ในฐานะพืชพื้นที่ชุ่มน้ำ (a marshland plant) ปาปิรุสช่วยรักษาเสถียรภาพของดิน (stabilizes soils) และลดการกัดเซาะ (reduces erosion) นอกจากนี้งานวิจัยบางชิ้นยังพบว่ามันมีศักยภาพใช้ในการบำบัดน้ำ (water purification) และบำบัดน้ำเสีย (sewage treatment) ด้วย\n\nสรุปใจความ: ปาปิรุสไม่ได้มีประโยชน์แค่เป็นวัสดุเขียน แต่ยังใช้สร้างเรือ ของใช้ต่างๆ และช่วยรักษาสิ่งแวดล้อมได้ด้วย",
      vocab: [
        { term: "Besides their use in record-keeping", th: "นอกเหนือจากที่ใช้บันทึกข้อมูล" },
        { term: "bundles of papyrus stems", th: "มัดของลำต้นปาปิรุสหลายๆ ลำมัดรวมกัน" },
        { term: "stabilizes soils and reduces erosion", th: "ช่วยให้ดินมั่นคง และลดการพังทลาย/กัดเซาะของดิน" },
        { term: "water purification and sewage treatment", th: "การทำน้ำให้บริสุทธิ์ และการบำบัดน้ำเสีย" }
      ]
    },
    12: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'E' — เป็นป้ายหัวข้อบอกว่าเนื้อหาส่วนสุดท้าย E กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    13: {
      explanationTh:
        "ย่อหน้า E ส่วนแรก พูดถึงการกำเนิดของ 'กระดาษจริง' (true paper) ในจีน ซึ่งเข้ามาแทนที่ปาปิรุสในที่สุด\n\nประโยคแรก: กระดาษจริง (True paper) น่าจะถูกประดิษฐ์ขึ้นครั้งแรกในจีนช่วงศตวรรษที่ 1 (the first century CE)\n\nจุดเหมือนกับปาปิรุส: เหมือนปาปิรุส กระดาษจีนสร้างจากใยพืชที่ทอเป็นตาข่าย (a meshwork of plant fibres) แต่ต่างกันตรงที่ชาวจีนใช้เส้นใยจากต้นหม่อนขาว (the white mulberry tree) ซึ่งให้วัสดุที่เหนียวและยืดหยุ่น (a tough, flexible material) สามารถพับ ยืด และบีบอัดได้ (could be folded, stretched, and compressed)\n\nผลลัพธ์: การที่วัฒนธรรมตะวันตกหันมารับกระดาษชนิดนี้ (The adoption of this paper by western cultures) ทำให้ปาปิรุสกลายเป็นของล้าสมัยในไม่ช้า (soon rendered papyrus obsolete)\n\nสรุปใจความ: กระดาษจากเส้นใยต้นหม่อนของจีน ทนทานและยืดหยุ่นกว่าปาปิรุส เมื่อตะวันตกเริ่มใช้กระดาษแบบนี้ ปาปิรุสก็หมดความนิยมไป",
      vocab: [
        { term: "a meshwork of plant fibres", th: "โครงตาข่ายที่ทอจากเส้นใยพืช" },
        { term: "a tough, flexible material", th: "วัสดุที่เหนียวทนทานและยืดหยุ่น" },
        { term: "could be folded, stretched, and compressed", th: "สามารถพับ ยืด และบีบอัดได้" },
        { term: "rendered papyrus obsolete", th: "ทำให้ปาปิรุสกลายเป็นของล้าสมัย/เลิกใช้ไปในที่สุด" }
      ]
    },
    14: {
      explanationTh:
        "ย่อหน้า E ส่วนสุดท้าย (และย่อหน้าปิดบทความ) พูดถึงสถานะของปาปิรุสในปัจจุบัน\n\nประโยคแรก: แม้จะมีความฝันเรื่องสังคมไร้กระดาษ (dreams of paper-free societies) แต่วัฒนธรรมตะวันตกก็ยังคงใช้กระดาษปริมาณมหาศาล (still use enormous quantities of paper) มักใช้ในแบบที่เป็นไปไม่ได้เลยที่จะใช้ปาปิรุสแทน (it would be inconceivable to use papyrus for)\n\nสถานะของปาปิรุสตอนนี้: ในฐานะวัสดุทดแทนกระดาษ บทบาทของต้นปาปิรุสในวัฒนธรรมตะวันตกถูกแทนที่ไปแล้ว (has been superseded) ปาปิรุสตอนนี้เป็นเพียงสินค้าเฉพาะกลุ่มสำหรับตลาดนักท่องเที่ยว (little more than a niche product for the tourist market) เท่านั้น\n\nสิ่งที่ทำให้ปาปิรุสยังน่าสนใจ: สิ่งที่ทำให้ปาปิรุสยังมีความสำคัญสำหรับสังคมตะวันตกทุกวันนี้ คือการที่มันเป็นพื้นผิวที่บรรพบุรุษของเราใช้บันทึกชีวิต ศิลปะ และวิทยาศาสตร์ของพวกเขาไว้\n\nปิดท้ายด้วยคำพูดของนักปรัชญาโรมันโบราณ Pliny the Elder: 'the material on which the immortality of human beings depends' (วัสดุที่ความเป็นอมตะของมนุษย์ขึ้นอยู่กับมัน) — ตีความได้ว่า => เพราะปาปิรุสคือสิ่งที่บันทึกเรื่องราวของมนุษย์ไว้ให้คนรุ่นหลังได้รู้จัก มนุษย์จึง 'ไม่ตายจริงๆ' ตราบใดที่เรื่องราวของพวกเขายังถูกบันทึกอยู่\n\nสรุปใจความ: ทุกวันนี้ปาปิรุสไม่มีประโยชน์เชิงปฏิบัติแล้ว เหลือแค่ของที่ระลึกสำหรับนักท่องเที่ยว แต่คุณค่าที่แท้จริงของมันคือการเป็นหลักฐานที่บันทึกอารยธรรมมนุษย์โบราณไว้ให้คนรุ่นหลัง",
      vocab: [
        { term: "dreams of paper-free societies", th: "ความฝัน/แนวคิดเรื่องสังคมที่ไม่ใช้กระดาษเลย" },
        { term: "inconceivable to use papyrus for", th: "เป็นไปไม่ได้เลยที่จะใช้ปาปิรุสแทนในกรณีนั้น" },
        { term: "has been superseded", th: "ถูกแทนที่ไปแล้ว (โดยสิ่งอื่นที่ดีกว่า)" },
        { term: "a niche product for the tourist market", th: "สินค้าเฉพาะกลุ่มเล็กๆ สำหรับตลาดนักท่องเที่ยว" },
        { term: "the material on which the immortality of human beings depends", th: "วัสดุที่ความเป็นอมตะของมนุษย์ขึ้นอยู่กับมัน (คำพูดยกย่องความสำคัญของปาปิรุสในการบันทึกประวัติศาสตร์มนุษย์)" }
      ]
    },
    15: {
      explanationTh:
        "ย่อหน้านี้เป็นเพียงเส้นคั่น (— — — — —) ใช้แบ่งเนื้อหาบทความออกจากส่วนอ้างอิงแหล่งที่มาด้านล่าง ไม่มีเนื้อหาให้อธิบาย"
    },
    16: {
      explanationTh:
        "ย่อหน้าสุดท้ายเป็นการอ้างอิงแหล่งที่มาของบทความ (citation) ระบุว่าเนื้อหานี้นำมาจากหนังสือ 'What have Plants Ever Done for Us?' เขียนโดย Stephen Harris จัดพิมพ์โดย Bodleian Library Publishing ปี 2015 และพิมพ์ซ้ำโดยได้รับอนุญาตจากสำนักพิมพ์ (Reprinted by kind permission of Bodleian Library Publishing) — เป็นเพียงข้อมูลลิขสิทธิ์ ไม่ใช่เนื้อหาบทความ"
    }
  },

  // ===================================================================
  // gt-reading-full-test07 — Passage 1: Your guide to entertainment in Westhaven
  // ===================================================================
  "gt-reading-full-test07#p1": {
    0: {
      explanationTh:
        "นี่คือชื่อเรื่องของบทความโฆษณา/ไกด์: 'Your guide to entertainment in Westhaven' (คู่มือแหล่งบันเทิงในเมือง Westhaven ของคุณ) — เป็นการเกริ่นว่าย่อหน้าถัดไปจะเป็นรายการสถานที่บันเทิง 5 แห่ง (A–E) พร้อมรายละเอียด"
    },
    1: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'A' — เป็นป้ายหัวข้อบอกว่ารายละเอียดสถานที่แรก (Trax Indoor Karting Centre) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    2: {
      explanationTh:
        "ย่อหน้านี้แนะนำ 'TRAX INDOOR KARTING CENTRE' สนามแข่งโกคาร์ทในร่ม\n\nจุดเด่น: สัมผัสความสนุกและตื่นเต้นของการแข่งขับรถในร่ม (Experience the fun and thrills of indoor racing driving) ด้วยรถโกคาร์ทแบบเปิดหลังคาขนาดเล็ก (mini open-topped karts) ไม่จำเป็นต้องมีประสบการณ์มาก่อน (No experience necessary) ต้อนรับทั้งบุคคลและกลุ่ม (Individuals and groups welcome) มีเครื่องดื่ม/ของว่างที่ร้านเบอร์เกอร์ใหม่ (Refreshments available in new burger bar) และผู้ชมก็เข้ามาชมได้ (Spectators welcome)\n\nเงื่อนไขสำคัญ: ผู้ขับทุกคนต้องมีส่วนสูงขั้นต่ำ 5 ฟุต (1.52 เมตร) และเข้าร่วมโดยยอมรับความเสี่ยงด้วยตัวเอง (participate at their own risk)\n\nเวลาเปิด/ราคา: เปิดทุกวันตลอดทั้งปี 10 โมงเช้า ถึง 6 โมงเย็น (สามารถนัดเวลาเพิ่มได้ — later times by appointment) ยกเว้นวันคริสต์มาสอีฟ วันคริสต์มาส วันบ็อกซิ่งเดย์ และวันปีใหม่ ราคาเริ่มต้นที่ 11 ปอนด์ต่อคน\n\nสรุปใจความ: สนามโกคาร์ทในร่มที่ไม่ต้องมีประสบการณ์ เปิดเกือบทุกวัน แต่มีข้อกำหนดเรื่องความสูงขั้นต่ำและผู้เล่นต้องยอมรับความเสี่ยงเอง",
      vocab: [
        { term: "open-topped karts", th: "รถโกคาร์ทที่ไม่มีหลังคาปิด" },
        { term: "No experience necessary", th: "ไม่จำเป็นต้องมีประสบการณ์มาก่อน" },
        { term: "participate at their own risk", th: "เข้าร่วมกิจกรรมโดยยอมรับความเสี่ยงด้วยตนเอง (ถ้าเกิดอุบัติเหตุ ทางร้านไม่รับผิดชอบ)" },
        { term: "by appointment", th: "โดยการนัดหมายล่วงหน้า" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'B' — เป็นป้ายหัวข้อบอกว่ารายละเอียดสถานที่ถัดไป (Westhaven Lifeboat Museum) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    4: {
      explanationTh:
        "ย่อหน้านี้แนะนำ 'WESTHAVEN LIFEBOAT MUSEUM' พิพิธภัณฑ์เรือชูชีพ\n\nจุดเด่น: จัดแสดงที่น่าตื่นเต้น (an exciting display) บอกเล่าเรื่องราวความกล้าหาญกว่า 150 ปี (over 150 years of courage) ผ่านภาพถ่ายพร้อมข้อความเล่าเหตุการณ์กู้ภัยครั้งยิ่งใหญ่ (photos with texts of epic rescues) โมเดลเรือชูชีพ และการแสดงวิดีโอ ยังมีเครื่องจำลองสถานการณ์ให้ลองเล่น (our hands-on simulator) — สวมบทบาทเป็นผู้บัญชาการกู้ภัยกลางทะเลที่มีพายุ (take charge of a daring rescue on a stormy sea)\n\nเหมาะกับใคร: เหมาะสำหรับกลุ่มโรงเรียนอย่างยิ่ง (Ideal for school groups) และเหมาะกับทุกวัย (A must for all ages) มีร้านขายของที่ระลึกด้วย (Souvenir shop)\n\nค่าเข้าชม: ไม่มีค่าเข้าชม (No charge for admission) แต่ยินดีรับเงินบริจาค (donations welcome)\n\nเวลาเปิด: 25 มีนาคม ถึง 26 ตุลาคม เปิด 10 โมงเช้า ถึง 5 โมงเย็น ส่วน 27 ตุลาคม ถึง 2 มกราคม เปิด 10 โมงเช้า ถึง 4 โมงเย็น (เวลาปิดสั้นลงในช่วงฤดูหนาว)\n\nสรุปใจความ: พิพิธภัณฑ์เข้าชมฟรีที่เหมาะกับทุกวัยโดยเฉพาะเด็กนักเรียน มีกิจกรรมโต้ตอบให้ลองเล่น และเวลาเปิดเปลี่ยนไปตามฤดูกาล",
      vocab: [
        { term: "epic rescues", th: "ปฏิบัติการกู้ภัยครั้งยิ่งใหญ่ที่น่าจดจำ" },
        { term: "our hands-on simulator", th: "เครื่องจำลองสถานการณ์ให้ผู้ชมได้ลองเล่น/ลองทำเอง" },
        { term: "take charge of a daring rescue", th: "รับบทบาทเป็นผู้บังคับบัญชาในภารกิจกู้ภัยที่ต้องใช้ความกล้าหาญ" },
        { term: "No charge for admission but donations welcome", th: "เข้าชมฟรี แต่ยินดีรับเงินบริจาค" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'C' — เป็นป้ายหัวข้อบอกว่ารายละเอียดสถานที่ถัดไป (Star Leisure Centre) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้านี้แนะนำ 'STAR LEISURE CENTRE' ศูนย์นันทนาการ\n\nจุดเด่น: ศูนย์รวมกิจกรรมพักผ่อนที่น่าตื่นเต้น (Exciting leisure complex) มีสระว่ายน้ำ 4 สระ (four pools) เครื่องสร้างคลื่น (wave machine) สไลด์น้ำตื่นเต้น 2 อัน (two thrilling flumes) สระบับเบิ้ล (bubble pool) ห้องฟิตเนส (fitness suite) โปรแกรมพิเศษสำหรับเด็กอายุต่ำกว่า 5 ขวบ (special programme for under-fives) กิจกรรมช่วงวันหยุดที่จัดขึ้น (organised holiday activities) และอื่นๆ อีกมากมาย (much, much more)\n\nเวลาเปิด: เปิดทุกวันตลอดทั้งปี\n\nค่าใช้จ่าย: ให้ตรวจสอบราคาปัจจุบันได้ที่เว็บไซต์ (Check our website ... for current rates) — คือราคาไม่ได้ระบุตายตัวในโฆษณา ต้องเข้าเว็บไปเช็คเอง\n\nสรุปใจความ: ศูนย์นันทนาการขนาดใหญ่ครบวงจร เหมาะกับทุกวัยรวมถึงเด็กเล็ก เปิดทุกวัน แต่ราคาต้องเช็คจากเว็บไซต์",
      vocab: [
        { term: "Exciting leisure complex", th: "ศูนย์รวมกิจกรรมพักผ่อนหย่อนใจที่น่าตื่นเต้น" },
        { term: "wave machine", th: "เครื่องสร้างคลื่นน้ำในสระว่ายน้ำ" },
        { term: "thrilling flumes", th: "สไลเดอร์น้ำที่ให้ความตื่นเต้น" },
        { term: "for current rates", th: "สำหรับอัตราค่าบริการปัจจุบัน (ราคาที่ใช้อยู่ตอนนี้)" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'D' — เป็นป้ายหัวข้อบอกว่ารายละเอียดสถานที่ถัดไป (Lloyd's Lanes) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    8: {
      explanationTh:
        "ย่อหน้านี้แนะนำ 'LLOYD'S LANES' สนามโบว์ลิ่ง\n\nจุดเด่น: มีเลนโบว์ลิ่งสิบพินระบบคอมพิวเตอร์เต็มรูปแบบ 20 เลน (20 fully computerised ten-pin bowling lanes) พื้นที่เกมตู้ (amusement area) พื้นที่ฟาสต์ฟู้ด (fast food area) และทีวีจอใหญ่ Sky TV — เหมาะกับการไปเที่ยวเล่นสนุกทั้งวัน (ideal for a whole fun day out)\n\nเวลาเปิด: โบว์ลิ่งเปิดทุกวัน 10 โมงเช้าถึงดึก (10 am till late) ทั้ง 7 วันต่อสัปดาห์\n\nราคา: วันจันทร์-ศุกร์ 10 โมงเช้า ถึง 6 โมงเย็น ผู้ที่ไม่ใช่สมาชิก (non-members) จ่าย 3.50 ปอนด์ สมาชิก (members) จ่าย 2.50 ปอนด์ ส่วนเวลาอื่นๆ (other times) ผู้ไม่ใช่สมาชิกจ่าย 4.50 ปอนด์ สมาชิกจ่าย 3.75 ปอนด์\n\nข้อกำหนดรองเท้า: ต้องสวมรองเท้าที่เหมาะสม (appropriate footgear essential) เพื่อปกป้องพื้นผิวเลนโบว์ลิ่ง สามารถเช่ารองเท้าได้ในราคา 1 ปอนด์ตลอดเวลาที่เปิดให้บริการ\n\nสรุปใจความ: สนามโบว์ลิ่งขนาดใหญ่เปิดทุกวันจนดึก มีราคา 2 ระดับตามช่วงเวลาและสถานะสมาชิก และต้องสวมรองเท้าเฉพาะ (เช่าได้)",
      vocab: [
        { term: "fully computerised ten-pin bowling lanes", th: "เลนโบว์ลิ่งสิบพินที่ใช้ระบบคอมพิวเตอร์เต็มรูปแบบ" },
        { term: "ideal for a whole fun day out", th: "เหมาะสำหรับการไปเที่ยวเล่นสนุกกันทั้งวัน" },
        { term: "appropriate footgear essential", th: "จำเป็นต้องสวมรองเท้าที่เหมาะสม (เพื่อปกป้องพื้นเลน)" },
        { term: "shoe hire £1.00 at all times", th: "ค่าเช่ารองเท้า 1 ปอนด์ ตลอดเวลาทำการ" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้านี้มีแค่ตัวอักษร 'E' — เป็นป้ายหัวข้อบอกว่ารายละเอียดสถานที่สุดท้าย (Westhaven Golf Club) กำลังจะเริ่มในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    10: {
      explanationTh:
        "ย่อหน้านี้แนะนำ 'WESTHAVEN GOLF CLUB' สนามกอล์ฟสุดท้ายในรายการ\n\nจุดเด่น: สนามกอล์ฟริมทะเลสาบที่สวยงาม (Beautiful lakeside course) เป็นเส้นทางเดินที่พอเหมาะพอดี ไม่เหนื่อยเกินไป (a pleasant, manageable walk) ผ่านหลุมกอล์ฟที่ท้าทาย 9 หลุม (nine challenging holes)\n\nสิ่งอำนวยความสะดวกอื่น: มีสนามซ้อมตี (24-bay driving range) ที่ใช้ได้ทั้งวันฝน ลม หรือแดด (suitable in rain, wind or sun) มีโปรกอล์ฟ 3 คนที่ให้การสอนในราคาที่จ่ายได้ (affordable coaching) มีร้านอาหารเปิดบริการทั้งวัน (Restaurant: good food served all day) และต้อนรับผู้มาเยือน (Visitors welcome)\n\nเวลาเปิด/ราคา: เปิดทุกวันตลอดปี ตั้งแต่ 7.30 น. ถึง 22.00 น. ราคา 9 หลุม 10 ปอนด์ ส่วน 18 หลุม 15 ปอนด์\n\nสรุปใจความ: สนามกอล์ฟริมทะเลสาบที่มีสิ่งอำนวยความสะดวกครบ (สนามซ้อม โปร ร้านอาหาร) ต้อนรับผู้มาเยือนทั่วไป ไม่ใช่แค่สมาชิก",
      vocab: [
        { term: "a pleasant, manageable walk", th: "เส้นทางเดินที่สบายและไม่หนักเกินไป" },
        { term: "24-bay driving range", th: "สนามซ้อมตีกอล์ฟที่มี 24 ช่องซ้อม" },
        { term: "affordable coaching", th: "การสอนกอล์ฟในราคาที่จ่ายไหว" },
        { term: "Visitors welcome", th: "ยินดีต้อนรับผู้มาเยือนทั่วไป (ไม่จำเป็นต้องเป็นสมาชิก)" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test07 — Passage 2: Dosoco Foundation music grants
  // ===================================================================
  "gt-reading-full-test07#p2": {
    0: {
      explanationTh:
        "นี่คือหัวข้อคำถามชวนคิดที่ขึ้นต้นบทความ: 'DO YOU HAVE A MUSIC PROJECT IN MIND THAT MIGHT BENEFIT FROM FUNDING?' (คุณมีโปรเจกต์ดนตรีในใจที่อาจได้ประโยชน์จากเงินทุนไหม?) เป็นการเปิดเรื่องแบบตั้งคำถามเพื่อดึงความสนใจผู้อ่านที่อยากขอทุน"
    },
    1: {
      explanationTh:
        "ย่อหน้านี้เกริ่นว่าใครเป็นผู้ให้ทุน\n\nประโยคแรก: ดนตรีมีประโยชน์ในการบำบัดอย่างน่าอัศจรรย์ (Music is wonderfully therapeutic) — คำนี้เป็นหัวใจของทั้งบทความ\n\nประโยคที่สอง: ความจริงข้อนี้ได้รับการยอมรับ (This is recognised by) จากมูลนิธิ The Dosoco Foundation ซึ่งสนับสนุนโครงการท้องถิ่น (supports local projects) ที่ใช้ดนตรีเพื่อประโยชน์ทางสังคม (that use music for social good)\n\nสรุปใจความ: มูลนิธิ Dosoco เชื่อว่าดนตรีบำบัดจิตใจได้ จึงให้ทุนโครงการดนตรีเพื่อสังคมในท้องถิ่น",
      vocab: [
        { term: "wonderfully therapeutic", th: "มีประโยชน์ในการบำบัด/เยียวยาจิตใจอย่างน่าทึ่ง" },
        { term: "supports local projects", th: "ให้การสนับสนุนโครงการในระดับท้องถิ่น" },
        { term: "music for social good", th: "ดนตรีที่ใช้เพื่อสร้างประโยชน์ต่อสังคม" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้ให้รายละเอียดเรื่องทุนและประเภทโครงการที่รับสมัคร\n\nประโยคแรก: รอบถัดไปของการให้ทุน Dosoco (The next round of Dosoco grant funding) จะเปิดรับสมัครในเร็วๆ นี้\n\nจำนวนเงินทุน: สำหรับองค์กร (organisations) อยู่ที่ 700-1,000 ปอนด์ ส่วนบุคคล (individuals) สูงสุด 300 ปอนด์\n\n4 ด้านที่ให้ทุน (พร้อมตัวอย่าง):\n1) music education — เช่น ทำงานร่วมกับนักเรียนดนตรีที่มีพรสวรรค์แต่มีความพิการทางร่างกาย สังคม หรือการเรียนรู้\n2) music access — เช่น ชมรมดนตรีสำหรับกลุ่มที่ลำบากในการเริ่มต้นด้วยตัวเอง\n3) music innovation — เช่น ใช้อุปกรณ์อิเล็กทรอนิกส์อย่าง Raspberry Pi ช่วยให้ผู้พิการทำดนตรีได้\n4) music therapy — เช่น ไอเดียใช้ดนตรีสนับสนุนสุขภาพจิตเชิงบวก\n\nสรุปใจความ: ย่อหน้านี้บอกจำนวนเงินทุนตามประเภทผู้สมัคร (องค์กร/บุคคล) และตัวอย่าง 4 หมวดโครงการที่จะได้รับพิจารณา",
      vocab: [
        { term: "grant funding", th: "เงินทุนสนับสนุนแบบให้เปล่า" },
        { term: "music education", th: "การศึกษาด้านดนตรี (หมวดทุนหนึ่ง)" },
        { term: "music access", th: "การเข้าถึงดนตรี สำหรับกลุ่มที่เข้าถึงยาก (หมวดทุนหนึ่ง)" },
        { term: "music innovation", th: "นวัตกรรมด้านดนตรี (หมวดทุนหนึ่ง)" },
        { term: "music therapy", th: "ดนตรีบำบัด (หมวดทุนหนึ่ง)" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้มีแค่หัวข้อ 'Case study' (กรณีศึกษา) — เป็นป้ายบอกว่าเนื้อหาถัดไปจะเป็นตัวอย่างจริงของคนที่เคยได้รับทุน ยังไม่มีเนื้อหาให้อธิบาย"
    },
    4: {
      explanationTh:
        "ย่อหน้านี้เล่ากรณีศึกษาจริงของผู้ได้รับทุน Dosoco\n\nประโยคแรก: Dosoco เคยมอบทุน (recently awarded a grant) ให้กับ Alexia Sloane นักแต่งเพลงรุ่นเยาว์ที่สูญเสียการมองเห็น (a young composer with sight loss) เพื่อให้เธอได้เข้าร่วมคอร์สแต่งเพลงภาคฤดูร้อนของโรงเรียน Purcell School (the sound-and-music summer-school composition course at the Purcell School)\n\nความสำเร็จหลังจากนั้น: Alexia ได้รับตำแหน่งนักแต่งเพลงกับ National Youth Orchestra of Great Britain — เป็นนักแต่งเพลงตาบอดคนแรกที่ได้รับแต่งตั้งในตำแหน่งนี้ (the first blind composer to be appointed) และยังได้รับรางวัล 'Young Composer of the Year' อีกด้วย โดยเธอเป็นนักแต่งเพลงหญิงคนแรกในประวัติศาสตร์ 10 ปีของรางวัลนี้ที่ได้รับเกียรตินี้ (the first female composer ever to receive this honour in its ten-year history)\n\nสรุปใจความ: กรณีศึกษานี้แสดงให้เห็นผลลัพธ์จริงของทุน Dosoco — ช่วยให้ Alexia Sloane ผู้พิการทางสายตาก้าวไปสู่ความสำเร็จระดับประเทศในวงการดนตรี",
      vocab: [
        { term: "a young composer with sight loss", th: "นักแต่งเพลงรุ่นเยาว์ที่สูญเสียการมองเห็น (ตาบอด/สายตาผิดปกติ)" },
        { term: "the first blind composer to be appointed", th: "นักแต่งเพลงตาบอดคนแรกที่ได้รับแต่งตั้งในตำแหน่งนี้" },
        { term: "Young Composer of the Year", th: "ชื่อรางวัล 'นักแต่งเพลงยอดเยี่ยมแห่งปี'" },
        { term: "the first female composer ever to receive this honour", th: "นักแต่งเพลงหญิงคนแรกในประวัติศาสตร์ที่ได้รับเกียรตินี้" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้อธิบายวิธีสมัครและเงื่อนไขของทุน\n\nวิธีสมัคร: องค์กร ครอบครัว และบุคคลทั่วไป สามารถสมัครได้โดยกรอกแบบฟอร์มง่ายๆ (a simple form)\n\nจำนวนเงินสนับสนุน: Dosoco สามารถช่วยออกค่าใช้จ่ายโครงการได้สูงสุดถึง 50% (contribute up to 50% towards project costs) — คือไม่ได้ออกให้ทั้งหมด ผู้สมัครต้องหาส่วนที่เหลือเอง\n\nเงื่อนไขโครงการ: ต้องเป็นโครงการที่อยู่ในพื้นที่ท้องถิ่น (locally based) และต้องเป็นไอเดียใหม่ (must be new ideas) สำหรับการใช้ดนตรีเพื่อสร้างผลกระทบเชิงบวกต่อชีวิตผู้คนในที่ที่ต้องการความช่วยเหลือจริงๆ (where help is really needed)\n\nสรุปใจความ: การสมัครง่าย แต่ Dosoco ออกทุนได้แค่ครึ่งเดียว และต้องเป็นโครงการท้องถิ่นที่มีไอเดียใหม่จริงๆ ไม่ใช่โครงการซ้ำเดิม",
      vocab: [
        { term: "completing a simple form", th: "กรอกแบบฟอร์มสมัครง่ายๆ" },
        { term: "contribute up to 50% towards project costs", th: "ช่วยออกค่าใช้จ่ายโครงการได้สูงสุด 50%" },
        { term: "must be new ideas", th: "ต้องเป็นไอเดียใหม่ ไม่ใช่ของเดิม" },
        { term: "where help is really needed", th: "ในพื้นที่/กลุ่มคนที่ต้องการความช่วยเหลือจริงๆ" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าสุดท้ายให้ข้อมูลติดต่อ: ต้องการข้อมูลเพิ่มเติมให้เข้าไปที่เว็บไซต์ www.thedosocofoundation.org — เป็นเพียงช่องทางติดต่อ ไม่มีเนื้อหาอื่นให้อธิบายเพิ่ม",
      vocab: [
        { term: "For more information please visit", th: "หากต้องการข้อมูลเพิ่มเติม กรุณาเข้าไปที่ (เว็บไซต์)" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test07 — Passage 3: Guide to employees on workplace monitoring
  // ===================================================================
  "gt-reading-full-test07#p3": {
    0: {
      explanationTh:
        "นี่คือชื่อเรื่องของเอกสาร: 'Guide to employees on workplace monitoring' (คู่มือสำหรับพนักงานเรื่องการตรวจสอบ/สอดส่องในที่ทำงาน) — เป็นการเกริ่นว่าเนื้อหาต่อไปนี้จะอธิบายสิทธิและกฎเกณฑ์เรื่องนายจ้างสอดส่องพนักงาน"
    },
    1: {
      explanationTh:
        "หัวข้อย่อย: 'What is workplace monitoring?' (การตรวจสอบในที่ทำงานคืออะไร?) เป็นหัวข้อนำเข้าสู่คำอธิบายในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    2: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างรูปแบบต่างๆ ของการตรวจสอบพนักงานในที่ทำงาน\n\nประโยคแรก: นายจ้างมีสิทธิ์ตรวจสอบกิจกรรมของคุณ (have the right to monitor your activities) ในหลายสถานการณ์ในที่ทำงาน\n\nตัวอย่าง (For example): กิจกรรมของคุณอาจถูกบันทึกด้วยกล้องวงจรปิด (CCTV cameras) จดหมายของคุณอาจถูกเปิดอ่าน (your letters may be opened and read) นอกจากนี้ (In addition) นายจ้างอาจใช้โปรแกรมอัตโนมัติ (an automated software programme) ตรวจอีเมลที่คุณได้รับในที่ทำงาน สายโทรศัพท์อาจถูกดักฟังและบันทึก (listened to and recorded) และประวัติเว็บไซต์ที่คุณเข้า (the log of websites you use) ก็อาจถูกตรวจสอบเช่นกัน\n\nสรุปใจความ: ย่อหน้านี้ไล่ตัวอย่างช่องทางที่นายจ้างสามารถสอดส่องพนักงานได้ ตั้งแต่กล้องวงจรปิด จดหมาย อีเมล โทรศัพท์ ไปจนถึงประวัติการใช้เว็บไซต์",
      vocab: [
        { term: "have the right to monitor your activities", th: "มีสิทธิ์ตรวจสอบ/สอดส่องกิจกรรมของคุณ" },
        { term: "an automated software programme", th: "โปรแกรมซอฟต์แวร์ที่ทำงานอัตโนมัติ" },
        { term: "listened to and recorded", th: "ถูกดักฟังและบันทึกเสียงไว้" },
        { term: "the log of websites you use", th: "ประวัติการเข้าเว็บไซต์ต่างๆ ของคุณ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่ากฎหมายคุ้มครองข้อมูลเกี่ยวข้องกับการตรวจสอบอย่างไร\n\nประโยคแรก: การตรวจสอบทุกรูปแบบที่กล่าวมา (All of these forms of monitoring) อยู่ภายใต้กฎหมายคุ้มครองข้อมูล (data protection law)\n\nข้อสำคัญ: กฎหมายคุ้มครองข้อมูล 'ไม่ได้ห้าม' การตรวจสอบในที่ทำงาน (doesn't prevent monitoring in the workplace) — คือนายจ้างยังตรวจสอบได้ แต่ (However) กฎหมายกำหนดกฎเกณฑ์ (sets down rules) เกี่ยวกับสถานการณ์และวิธีการที่ควรใช้ในการตรวจสอบ (the circumstances and the way in which monitoring should be carried out)\n\nสรุปใจความ: กฎหมายไม่ได้ห้ามนายจ้างสอดส่อง แต่กำหนดว่าต้องทำอย่างไรถึงจะถูกต้องตามกฎ",
      vocab: [
        { term: "data protection law", th: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล" },
        { term: "doesn't prevent monitoring", th: "ไม่ได้ห้ามการตรวจสอบ (แต่ควบคุมวิธีทำ)" },
        { term: "sets down rules", th: "กำหนดกฎเกณฑ์ไว้" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้าสั้นนี้พูดถึงขั้นตอนก่อนเริ่มตรวจสอบพนักงาน\n\nก่อนตัดสินใจว่าจะเริ่มการตรวจสอบหรือไม่ (Before deciding whether to introduce monitoring) นายจ้างควรระบุผลกระทบทางลบ (identify any negative effects) ที่การตรวจสอบอาจมีต่อพนักงานก่อน ขั้นตอนนี้เรียกว่า 'impact assessment' (การประเมินผลกระทบ)\n\nสรุปใจความ: ก่อนสอดส่องพนักงาน นายจ้างควรประเมินผลกระทบทางลบก่อน ไม่ใช่ทำเลยโดยไม่คิด",
      vocab: [
        { term: "identify any negative effects", th: "ระบุ/หาผลกระทบทางลบที่อาจเกิดขึ้น" },
        { term: "impact assessment", th: "การประเมินผลกระทบ (ขั้นตอนก่อนเริ่มดำเนินการ)" }
      ]
    },
    5: {
      explanationTh:
        "หัวข้อย่อย: 'Monitoring electronic communications at work' (การตรวจสอบการสื่อสารทางอิเล็กทรอนิกส์ในที่ทำงาน) เป็นหัวข้อนำเข้าสู่รายละเอียดในย่อหน้าถัดไป ยังไม่มีเนื้อหาให้อธิบาย"
    },
    6: {
      explanationTh:
        "ย่อหน้านี้บอกเงื่อนไขที่ทำให้นายจ้างตรวจสอบการสื่อสารอิเล็กทรอนิกส์ได้อย่างถูกกฎหมาย\n\nนายจ้างสามารถตรวจสอบการใช้การสื่อสารอิเล็กทรอนิกส์ของคุณในที่ทำงานได้อย่างถูกกฎหมาย (can legally monitor your use of electronic communications) ถ้าเข้าเงื่อนไข 2 ข้อพร้อมกัน: 1) การตรวจสอบนั้นเกี่ยวข้องกับธุรกิจ (relates to the business) และ 2) อุปกรณ์ที่ถูกตรวจสอบนั้นถูกจัดให้บางส่วนหรือทั้งหมดเพื่อใช้ในการทำงาน (provided partly or wholly for work)\n\nสรุปใจความ: นายจ้างตรวจสอบได้ก็ต่อเมื่อเกี่ยวกับธุรกิจ และอุปกรณ์นั้นเป็นของบริษัท (อย่างน้อยบางส่วน)",
      vocab: [
        { term: "relates to the business", th: "เกี่ยวข้องกับกิจการ/ธุรกิจของบริษัท" },
        { term: "provided partly or wholly for work", th: "จัดให้ใช้เพื่อการทำงานบางส่วนหรือทั้งหมด" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้าสั้นนี้พูดถึงหน้าที่ของนายจ้างในการแจ้งพนักงานเรื่องการตรวจสอบ\n\nยกเว้นในสถานการณ์ที่จำกัดมากๆ (Except in extremely limited circumstances) นายจ้างต้องดำเนินการตามสมควร (must take reasonable steps) เพื่อแจ้งให้พนักงานทราบว่ามีการตรวจสอบเกิดขึ้น (let staff know that monitoring is happening) กำลังตรวจสอบอะไร (what is being monitored) และทำไมจึงจำเป็นต้องทำ (why it is necessary)\n\nสรุปใจความ: โดยปกตินายจ้างต้องแจ้งให้พนักงานรู้ล่วงหน้าว่ากำลังถูกตรวจสอบอะไรและทำไม เว้นแต่กรณีพิเศษจริงๆ",
      vocab: [
        { term: "must take reasonable steps", th: "ต้องดำเนินการตามที่สมเหตุสมผล" },
        { term: "extremely limited circumstances", th: "สถานการณ์ที่จำกัดมากๆ เท่านั้น (ข้อยกเว้นแคบมาก)" }
      ]
    },
    8: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่านายจ้างต้องขอความยินยอมจากพนักงานหรือไม่ และเหตุผลที่อนุญาตให้ตรวจสอบได้\n\nประโยคแรก: ถ้านายจ้างทำตามกฎเหล่านี้ (As long as your employer sticks to these rules) พวกเขาไม่จำเป็นต้องขอความยินยอมจากคุณก่อนตรวจสอบการสื่อสารอิเล็กทรอนิกส์ของคุณ (don't need to get your consent) แต่ต้องเป็นการตรวจสอบด้วยเหตุผลเฉพาะเจาะจงเท่านั้น (only if the monitoring is for specific reasons)\n\nเหตุผลที่อนุญาต (ยกตัวอย่างหลายข้อ):\n1) เพื่อพิสูจน์ข้อเท็จจริงที่เกี่ยวข้องกับธุรกิจ หรือตรวจสอบมาตรฐาน (to check standards) เช่น การดักฟังสายโทรศัพท์เพื่อประเมินคุณภาพงานของคุณ (assess the quality of your work)\n2) เพื่อป้องกันหรือตรวจจับอาชญากรรม (to prevent or detect crime)\n3) เพื่อให้แน่ใจว่าระบบอิเล็กทรอนิกส์ทำงานได้อย่างมีประสิทธิภาพ เช่น ป้องกันไวรัสคอมพิวเตอร์เข้าสู่ระบบ (to prevent computer viruses entering the system)\n\nข้อยกเว้นพิเศษ: นายจ้างสามารถดักฟังสายที่คุณโทรไปยังสายด่วนที่เป็นความลับ (confidential helplines) ได้ แต่ในกรณีนี้ห้ามบันทึกเสียงสายเหล่านั้น (not allowed to record these calls)\n\nสรุปใจความ: นายจ้างตรวจสอบได้โดยไม่ต้องขอความยินยอม ถ้าเป็นไปตามกฎและมีเหตุผลเฉพาะ (พิสูจน์ข้อเท็จจริง ตรวจสอบคุณภาพ ป้องกันอาชญากรรม รักษาระบบ) แต่สายที่โทรไปสายด่วนลับต้องฟังได้อย่างเดียว ห้ามอัดเสียงไว้",
      vocab: [
        { term: "sticks to these rules", th: "ทำตามกฎเหล่านี้อย่างเคร่งครัด" },
        { term: "don't need to get your consent", th: "ไม่จำเป็นต้องขอความยินยอมจากคุณก่อน" },
        { term: "to establish facts", th: "เพื่อพิสูจน์/ยืนยันข้อเท็จจริง" },
        { term: "to prevent or detect crime", th: "เพื่อป้องกันหรือตรวจจับการกระทำผิดกฎหมาย" },
        { term: "confidential helplines", th: "สายด่วนที่ให้ความช่วยเหลือแบบเก็บเป็นความลับ" },
        { term: "not allowed to record these calls", th: "ห้ามบันทึก/อัดเสียงสายเหล่านี้ไว้" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test07 — Passage 4: International Experience Canada
  // ===================================================================
  "gt-reading-full-test07#p4": {
    0: {
      explanationTh:
        "นี่คือชื่อเรื่อง: 'International Experience Canada: application process' (โครงการ International Experience Canada: ขั้นตอนการสมัคร) — เกริ่นว่าเนื้อหาถัดไปจะอธิบายขั้นตอนสมัครโครงการทำงาน/ท่องเที่ยวในแคนาดาอย่างละเอียด"
    },
    1: {
      explanationTh:
        "ย่อหน้านี้แนะนำภาพรวมโครงการและขั้นตอนแรกสุด\n\nประโยคแรก: ถ้าอยากไปเที่ยวและทำงานชั่วคราวในแคนาดา (travel and work temporarily in Canada) ผ่านโครงการ International Experience Canada (IEC) ขั้นตอนแรกคือการสมัครเป็นผู้มีสิทธิ์ (become a candidate) ในกลุ่มผู้สมัคร (pool) หนึ่งหรือมากกว่าหนึ่งกลุ่ม\n\nประเภทของกลุ่มผู้สมัคร: มี 3 ประเภท คือ International Co-op (Internship) — ฝึกงาน, Working Holiday — ทำงานพร้อมท่องเที่ยว, และ Young Professionals — มืออาชีพรุ่นใหม่\n\nสรุปใจความ: โครงการ IEC มี 3 ประเภทให้เลือกสมัคร ขั้นตอนแรกคือเข้าไปอยู่ในกลุ่มผู้สมัครที่ต้องการ",
      vocab: [
        { term: "become a candidate in one or more IEC pools", th: "เป็นผู้มีสิทธิ์ในกลุ่มผู้สมัคร IEC หนึ่งกลุ่มหรือมากกว่า" },
        { term: "International Co-op (Internship)", th: "โครงการความร่วมมือระหว่างประเทศแบบฝึกงาน" },
        { term: "Working Holiday", th: "โครงการทำงานพร้อมพักผ่อนท่องเที่ยว" },
        { term: "Young Professionals", th: "โครงการสำหรับมืออาชีพรุ่นใหม่" }
      ]
    },
    2: {
      explanationTh:
        "ย่อหน้านี้อธิบายขั้นตอนการสมัครเบื้องต้น\n\nขั้นแรก: ทำแบบสอบถาม (use our questionnaire) เพื่อดูว่าคุณมีคุณสมบัติเข้ากลุ่ม IEC ได้หรือไม่ (to see if you meet the criteria) ใช้เวลาประมาณ 10 นาที หาแบบสอบถามได้ที่เว็บไซต์ที่ระบุไว้\n\nหลังจากนั้น: ถ้าคุณมีคุณสมบัติ (if you are eligible) คุณจะได้รับรหัสอ้างอิงส่วนตัว (a personal reference code) ซึ่งใช้สร้างบัญชีออนไลน์ (create your online account) และในเวลาเดียวกัน คุณต้องกรอกข้อมูลในช่องที่เหลือของโปรไฟล์ให้ครบ (fill in any remaining fields in your profile) รวมถึงเลือกว่าอยากอยู่ในกลุ่ม IEC ไหนบ้าง (บางส่วนของข้อมูลอาจถูกกรอกไว้ให้แล้วล่วงหน้า)\n\nสรุปใจความ: ทำแบบสอบถามก่อน ถ้าผ่านจะได้รหัสไปสร้างบัญชีและกรอกโปรไฟล์ต่อให้ครบ",
      vocab: [
        { term: "meet the criteria", th: "มีคุณสมบัติตรงตามเกณฑ์ที่กำหนด" },
        { term: "a personal reference code", th: "รหัสอ้างอิงเฉพาะบุคคล ใช้สำหรับสมัครต่อ" },
        { term: "fill in any remaining fields", th: "กรอกข้อมูลในช่องที่ยังเหลือให้ครบ" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้อธิบายขั้นตอนหลังได้รับคำเชิญให้สมัคร\n\nประโยคแรก: ถ้าคุณได้รับคำเชิญให้ดำเนินการสมัครต่อ (an invitation to proceed with your application) คุณมีเวลา 10 วันในการตัดสินใจว่าจะยอมรับหรือไม่ (10 days to decide whether to accept this or not)\n\nถ้ายอมรับ (If you accept): ให้กดปุ่ม 'Start Application' จากนั้นคุณจะมีเวลาอีก 20 วันในการกรอกใบสมัครให้เสร็จสมบูรณ์ (20 days to complete your application)\n\nสรุปใจความ: หลังได้รับคำเชิญมีเวลา 10 วันตัดสินใจ พอกดยอมรับแล้วมีเวลาอีก 20 วันกรอกใบสมัครให้เสร็จ",
      vocab: [
        { term: "an invitation to proceed with your application", th: "คำเชิญให้ดำเนินการสมัครขั้นต่อไป" },
        { term: "10 days to decide", th: "มีเวลา 10 วันในการตัดสินใจ" },
        { term: "20 days to complete your application", th: "มีเวลา 20 วันในการกรอกใบสมัครให้เสร็จ" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้าสั้นนี้อธิบายหน้าที่ของนายจ้างในแคนาดาสำหรับบางประเภทกลุ่มผู้สมัคร\n\nสำหรับหมวด International Co-op และ Young Professionals: นายจ้างของคุณในแคนาดาต้องเป็นผู้จ่ายค่าธรรมเนียมการปฏิบัติตามข้อกำหนด (must pay the compliance fee) และแจ้งหมายเลขข้อเสนองาน (offer of employment number) ให้คุณทราบ\n\nข้อยกเว้น: กฎข้อนี้ไม่บังคับใช้กับกลุ่ม Working Holiday (This does not apply to the Working Holiday pool)\n\nสรุปใจความ: เฉพาะผู้สมัคร 2 ประเภท (Co-op, Young Professionals) เท่านั้นที่นายจ้างต้องจ่ายค่าธรรมเนียมและให้เลขที่ข้อเสนองาน กลุ่ม Working Holiday ไม่ต้องมีขั้นตอนนี้",
      vocab: [
        { term: "must pay the compliance fee", th: "ต้องเป็นผู้จ่ายค่าธรรมเนียมการปฏิบัติตามข้อกำหนด" },
        { term: "offer of employment number", th: "หมายเลขอ้างอิงของข้อเสนองาน" },
        { term: "This does not apply to", th: "ข้อนี้ไม่มีผลบังคับใช้กับ..." }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้อธิบายขั้นตอนอัปโหลดเอกสารและจ่ายค่าธรรมเนียม\n\nหลังจากได้รับหมายเลขข้อเสนองานแล้ว (Once you have received this) คุณต้องอัปโหลดสำเนาใบรับรองประวัติอาชญากรรมและใบรับรองแพทย์ (police and medical certificates) ถ้าจำเป็นต้องใช้ ถ้ายังไม่มีเอกสารเหล่านี้ ให้อัปโหลดหลักฐานว่าคุณได้ยื่นขอไปแล้ว (proof that you have applied for them)\n\nการจ่ายเงิน: จากนั้นต้องจ่ายค่าธรรมเนียมการเข้าร่วม (your participation fee) จำนวน 126 ดอลลาร์แคนาดา ทางบัตรเครดิตออนไลน์ และถ้าสมัครหมวด Working Holiday จะต้องจ่ายเพิ่มอีก 100 ดอลลาร์แคนาดา (an additional payment of C$100)\n\nสรุปใจความ: ต้องอัปโหลดเอกสารรับรอง (หรือหลักฐานว่ายื่นขอแล้ว) แล้วจ่ายค่าธรรมเนียมพื้นฐาน 126 ดอลลาร์ บวกเพิ่ม 100 ดอลลาร์ถ้าเป็นกลุ่ม Working Holiday",
      vocab: [
        { term: "police and medical certificates", th: "ใบรับรองประวัติอาชญากรรมและใบรับรองแพทย์" },
        { term: "proof that you have applied for them", th: "หลักฐานว่าได้ยื่นขอเอกสารเหล่านั้นไปแล้ว" },
        { term: "your participation fee", th: "ค่าธรรมเนียมการเข้าร่วมโครงการ" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้าสุดท้ายอธิบายขั้นตอนหลังจากส่งใบสมัครแล้ว\n\nประโยคแรก: หลังจากนั้นใบสมัครของคุณจะถูกประเมิน (Your application will then be assessed) ในช่วงนี้คุณสามารถขอถอนใบสมัครได้ (apply to withdraw) และจะได้รับเงินคืน (a refund) ถ้าทำเช่นนั้นภายใน 56 วัน\n\nถ้าสมัครสำเร็จ: คุณจะได้รับจดหมายแนะนำตัว (a letter of introduction) ซึ่งสามารถนำไปแสดงให้เจ้าหน้าที่ตรวจคนเข้าเมือง (Immigration) ดูตอนที่คุณเดินทางเข้าแคนาดา\n\nสรุปใจความ: หลังส่งใบสมัคร มีสิทธิ์ถอนและได้เงินคืนภายใน 56 วัน และถ้าผ่านจะได้จดหมายแนะนำตัวไว้ใช้ตอนเข้าเมืองแคนาดา",
      vocab: [
        { term: "apply to withdraw", th: "ยื่นขอถอนใบสมัคร" },
        { term: "a refund", th: "เงินคืน" },
        { term: "a letter of introduction", th: "จดหมายแนะนำตัว ใช้แสดงต่อเจ้าหน้าที่ตรวจคนเข้าเมือง" }
      ]
    }
  },

  // ===================================================================
  // gt-reading-full-test07 — Passage 5: Research on improving agricultural
  // yields in Africa
  // ===================================================================
  "gt-reading-full-test07#p5": {
    0: {
      explanationTh:
        "นี่คือชื่อเรื่อง: 'RESEARCH ON IMPROVING AGRICULTURAL YIELDS IN AFRICA' (งานวิจัยเพื่อเพิ่มผลผลิตทางการเกษตรในแอฟริกา) — เกริ่นหัวข้อหลักของบทความ ยังไม่มีเนื้อหาให้อธิบาย"
    },
    1: {
      explanationTh:
        "ประโยคเกริ่นเรื่องสั้นๆ ใต้ชื่อเรื่อง: มีโครงการวิจัย 3 โครงการ (Three programmes) กำลังศึกษาวิธีเพิ่มผลผลิตทางการเกษตรในแอฟริกา — บอกล่วงหน้าว่าบทความจะพูดถึงงานวิจัย 3 เรื่องที่แตกต่างกัน"
    },
    2: {
      explanationTh:
        "ย่อหน้านี้อธิบายเหตุผลว่าทำไมเรื่องนี้ถึงสำคัญ\n\nมากกว่าครึ่งหนึ่งของการเติบโตของประชากรโลก (More than half of the global population growth) ระหว่างตอนนี้จนถึงปี 2050 คาดว่าจะเกิดขึ้นในแอฟริกา (is expected to occur in Africa) และคนที่มากขึ้นก็หมายถึงความต้องการอาหารที่มากขึ้นตามไปด้วย (more people means a requirement for more food)\n\nสรุปใจความ: ประชากรแอฟริกาจะโตเร็วมาก จึงต้องการงานวิจัยเพื่อเพิ่มผลผลิตอาหารให้ทัน",
      vocab: [
        { term: "global population growth", th: "การเติบโตของจำนวนประชากรทั่วโลก" },
        { term: "a requirement for more food", th: "ความจำเป็นที่ต้องมีอาหารมากขึ้น" }
      ]
    },
    3: {
      explanationTh:
        "ย่อหน้านี้ยกตัวอย่างประเทศเอธิโอเปียและปัญหาวัวที่เกิดจากการพัฒนาปศุสัตว์\n\nตัวอย่าง: เอธิโอเปียมีประชากรปศุสัตว์มากที่สุดในแอฟริกา (the largest livestock population in Africa) แต่ด้วยประชากรมนุษย์ที่เพิ่มขึ้น แม้แต่วัว 53 ล้านตัวก็ยังไม่พอ (even its 53 million cattle are not enough)\n\nปัญหาสุขภาพใหม่: ความพยายามพัฒนาการทำฟาร์ม (efforts to develop farming) กำลังนำมาซึ่งปัญหาสุขภาพที่สำคัญ (a significant health concern) ศาสตราจารย์ James Wood จากมหาวิทยาลัย Cambridge อธิบายว่าวัวพันธุ์ใหม่ที่กำลังถูกนำเข้ามา (new breeds that are being introduced) เสี่ยงต่อวัณโรคในวัว (bovine TB) มากกว่าวัวพันธุ์ zebu ที่เคยเลี้ยงมาก่อนหน้านี้\n\nคำเตือนของเขา (คำพูดยกมาตรงๆ): 'This may have health implications for those who work with and live alongside infected cattle, and also raises concerns about transmission to areas which previously had low levels of TB' — แปลว่า: อาจส่งผลต่อสุขภาพของคนที่ทำงานและอาศัยอยู่ใกล้วัวที่ติดเชื้อ และยังเป็นห่วงว่าโรคจะแพร่ไปยังพื้นที่ที่แต่ก่อนมีวัณโรคต่ำ\n\nสรุปใจความ: การนำเข้าวัวพันธุ์ใหม่เพื่อเพิ่มผลผลิตกลับทำให้เสี่ยงวัณโรคมากขึ้น ทั้งในตัววัวเองและคนที่อยู่ใกล้ชิด",
      vocab: [
        { term: "the largest livestock population in Africa", th: "จำนวนปศุสัตว์ที่มากที่สุดในทวีปแอฟริกา" },
        { term: "new breeds that are being introduced", th: "สายพันธุ์ใหม่ที่กำลังถูกนำเข้ามาเลี้ยง" },
        { term: "bovine TB (tuberculosis)", th: "วัณโรคในวัว" },
        { term: "health implications", th: "ผลกระทบ/นัยยะต่อสุขภาพ" },
        { term: "transmission to areas which previously had low levels of TB", th: "การแพร่กระจายไปยังพื้นที่ที่แต่ก่อนมีวัณโรคในระดับต่ำ" }
      ]
    },
    4: {
      explanationTh:
        "ย่อหน้านี้อธิบายรายละเอียดโครงการวิจัยของศาสตราจารย์ Wood\n\nWood เป็นหัวหน้าโครงการวิจัย (leads a research programme) ที่กำลังศึกษาความเป็นไปได้ของกลยุทธ์ควบคุมโรค (the feasibility of control strategies) รวมถึงการฉีดวัคซีนให้วัว (cattle vaccination)\n\nทีมวิจัย: โครงการนี้รวบรวมนักวิทยาศาสตร์สัตวแพทย์ นักระบาดวิทยา นักพันธุศาสตร์ นักภูมิคุ้มกันวิทยา และนักสังคมศาสตร์ (veterinary scientists, epidemiologists, geneticists, immunologists and social scientists) จาก 8 สถาบันในเอธิโอเปียและสหราชอาณาจักร\n\nเหตุผลที่ต้องมีทีมสหสาขา (คำพูดของ Wood): 'We need this mix because we are not only asking how effective strategies will be, but also whether farmers will accept them, and what the consequences are for prosperity and wellbeing' — แปลว่า: ต้องมีทีมผสมแบบนี้เพราะไม่ใช่แค่ถามว่ากลยุทธ์จะได้ผลแค่ไหน แต่ต้องถามด้วยว่าเกษตรกรจะยอมรับหรือไม่ และจะส่งผลอย่างไรต่อความเป็นอยู่และความมั่งคั่งของพวกเขา\n\nสรุปใจความ: โครงการของ Wood ไม่ได้ดูแค่ด้านวิทยาศาสตร์การแพทย์ แต่รวมผู้เชี่ยวชาญหลายสาขาเพื่อดูผลกระทบรอบด้าน ทั้งด้านวิทยาศาสตร์และสังคม",
      vocab: [
        { term: "the feasibility of control strategies", th: "ความเป็นไปได้ของแนวทาง/กลยุทธ์ในการควบคุมโรค" },
        { term: "cattle vaccination", th: "การฉีดวัคซีนให้วัว" },
        { term: "veterinary scientists, epidemiologists, geneticists, immunologists and social scientists", th: "นักวิทยาศาสตร์สัตวแพทย์ นักระบาดวิทยา นักพันธุศาสตร์ นักภูมิคุ้มกันวิทยา และนักสังคมศาสตร์" },
        { term: "consequences ... for prosperity and wellbeing", th: "ผลกระทบต่อความมั่งคั่งและความเป็นอยู่ที่ดีของผู้คน" }
      ]
    },
    5: {
      explanationTh:
        "ย่อหน้านี้เปลี่ยนไปพูดถึงโครงการวิจัยที่สองในกานา เรื่องกะหล่ำปลี\n\nประโยคแรก: ผลกระทบที่การเพิ่มผลผลิตมีต่อความเป็นอยู่ของเกษตรกร (farmers' livelihoods) ไม่ใช่เรื่องที่ Dr Ken Fening ผู้เชี่ยวชาญด้านแมลงจากมหาวิทยาลัยกานามองข้าม (is not lost on — ตีความได้ว่า => เขาตระหนักถึงเรื่องนี้ดี) ซึ่งเขากำลังทำโครงการวิจัยเกี่ยวกับอาหารอีกโครงการหนึ่ง\n\nความสำคัญของกะหล่ำปลี: กะหล่ำปลีไม่ใช่พืชท้องถิ่นของแอฟริกา (not indigenous to Africa) แต่กลายเป็นพืชเศรษฐกิจสำคัญของเกษตรกรกานา (a major cash crop) และเป็นแหล่งรายได้สำคัญของพ่อค้าจากตลาดและโรงแรม\n\nคำพูดของ Fening: 'A good crop can bring in money to buy fertilisers and farm equipment, and also help to pay for healthcare and education for the family' — แปลว่า: ผลผลิตที่ดีสามารถนำเงินมาซื้อปุ๋ยและอุปกรณ์ทำฟาร์ม รวมถึงช่วยจ่ายค่ารักษาพยาบาลและการศึกษาของครอบครัวได้ด้วย\n\nปัญหาที่เกิดขึ้น: แต่ (however) เมื่อไม่นานมานี้ ทุ่งกะหล่ำปลีที่แคระแกร็นและใบเหลือง (stunted, yellowing cabbages) ใบหงิกงอและมีจุดราขึ้น (their leaves curled and dotted with mould) กลายเป็นภาพที่คุ้นตาและน่าสลดใจสำหรับเกษตรกรในกานา\n\nสรุปใจความ: กะหล่ำปลีสร้างรายได้สำคัญให้เกษตรกรกานา แต่ตอนนี้กำลังเจอโรคระบาดที่ทำให้ผลผลิตเสียหายหนัก",
      vocab: [
        { term: "is not lost on", th: "ไม่ใช่สิ่งที่เขามองข้าม/ไม่รู้ตัว (เขาตระหนักดี)" },
        { term: "a major cash crop", th: "พืชเศรษฐกิจหลักที่สร้างรายได้" },
        { term: "stunted, yellowing cabbages", th: "กะหล่ำปลีที่แคระแกร็นและใบเปลี่ยนเป็นสีเหลือง" },
        { term: "dotted with mould", th: "มีจุดราขึ้นกระจายอยู่ทั่ว" }
      ]
    },
    6: {
      explanationTh:
        "ย่อหน้านี้เล่าว่า Fening ค้นพบปัญหานี้ได้อย่างไร\n\nFening ทำงานจากสถานีภาคสนามที่ Kpong ประเทศกานา (his field station base in Kpong, Ghana) ทำงานใกล้ชิดกับเกษตรกรรายย่อย (smallholder farmers) เรื่องกลยุทธ์ควบคุมศัตรูพืช\n\nจุดเริ่มต้นปัญหา: 2 ปีก่อน เกษตรกรเริ่มรายงานว่ามีโรคใหม่กำลังทำลายพืชผล\n\nคำพูดของ Fening: 'It seemed to be associated with massive infestations of pink and green aphids' และ 'from my studies of the way insects interact with many different vegetables, I'm familial* with the types of damage they can cause' — แปลว่า: ดูเหมือนจะเกี่ยวข้องกับการระบาดหนักของเพลี้ยอ่อนสีชมพูและสีเขียว และจากการศึกษาว่าแมลงมีปฏิสัมพันธ์กับผักหลายชนิดอย่างไร เขาคุ้นเคยกับรูปแบบความเสียหายที่แมลงเหล่านี้ก่อได้ (หมายเหตุ: คำว่า 'familial' ในต้นฉบับน่าจะเป็นการพิมพ์ผิดจากคำว่า 'familiar' ที่แปลว่า 'คุ้นเคย')\n\nสรุปใจความ: Fening สังเกตเห็นว่าเกษตรกรเริ่มเจอปัญหาใหม่ที่ดูเหมือนเกี่ยวกับเพลี้ยอ่อนระบาดหนัก จึงเริ่มลงมือตรวจสอบต่อ",
      vocab: [
        { term: "smallholder farmers", th: "เกษตรกรรายย่อย (มีที่ดินทำกินขนาดเล็ก)" },
        { term: "massive infestations of pink and green aphids", th: "การระบาดอย่างหนักของเพลี้ยอ่อนสีชมพูและสีเขียว" },
        { term: "familial* (แปลว่า familiar)", th: "คุ้นเคย/รู้จักดี (คำนี้ในต้นฉบับสะกดผิดจาก 'familiar')" }
      ]
    },
    7: {
      explanationTh:
        "ย่อหน้านี้บอกว่าทำไม Fening ถึงคิดว่าปัญหาไม่ใช่แค่เพลี้ยอ่อนธรรมดา\n\nแต่ (But) เกษตรกรกำลังเห็นการสูญเสียพืชผลทั้งหมด (the total loss of their crops) ซึ่งเป็นเรื่องปกติที่เกิดขึ้นบ่อย และเขาก็ตระหนักว่าความเสียหายขนาดนี้ไม่น่าจะเกิดจากแมลงดูดน้ำเลี้ยง (sap-sucking insects) เพียงอย่างเดียว\n\nแม้จะไม่เคยมีรายงานโรคไวรัสที่ส่งผลต่อกะหล่ำปลีในกานามาก่อน (Despite no previous reports of viral diseases affecting cabbage crops in Ghana) แต่อาการที่เห็นบ่งชี้ว่าน่าจะเป็นเชื้อไวรัส (the symptoms suggested a viral pathogen)\n\nสรุปใจความ: ความเสียหายรุนแรงเกินกว่าจะเป็นแค่เพลี้ยอ่อน ทำให้ Fening สงสัยว่าอาจมีไวรัสชนิดใหม่เข้ามาเกี่ยวข้อง",
      vocab: [
        { term: "sap-sucking insects", th: "แมลงที่ดูดกินน้ำเลี้ยงจากพืช" },
        { term: "a viral pathogen", th: "เชื้อโรคที่เป็นไวรัส" }
      ]
    },
    8: {
      explanationTh:
        "ย่อหน้านี้อธิบายว่า Fening ทำงานร่วมกับใครเพื่อสืบหาสาเหตุ\n\nFening ร่วมมือกับ Dr John Carr นักชีววิทยาพืชจากมหาวิทยาลัย Cambridge (Together with Cambridge plant biologist Dr John Carr) เก็บตัวอย่างต้นกะหล่ำปลีในกานาที่แสดงอาการของโรค (samples of cabbage plants in Ghana showing signs of disease) รวมถึงเก็บตัวอย่างเพลี้ยอ่อนที่อยู่บนต้นที่เป็นโรคด้วย\n\nกลับที่เคมบริดจ์: Fening ใช้เทคนิคการคัดกรอง (screening techniques) รวมถึงเทคนิค 'ลายนิ้วมือดีเอ็นเอ' (a type of DNA 'fingerprinting') เพื่อระบุชนิดของเพลี้ยอ่อน และใช้วิธีทางชีววิทยาระดับโมเลกุลที่ซับซ้อน (sophisticated molecular biology methods) เพื่อพยายามหาว่าไวรัสตัวไหนเป็นตัวการ (the offending virus)\n\nสรุปใจความ: Fening กับ Carr ร่วมมือกันเก็บตัวอย่างในกานา แล้วใช้เทคนิคทางวิทยาศาสตร์ขั้นสูงในเคมบริดจ์เพื่อหาสาเหตุที่แท้จริง",
      vocab: [
        { term: "showing signs of disease", th: "แสดงอาการของโรค" },
        { term: "a type of DNA 'fingerprinting'", th: "เทคนิคคล้ายการตรวจลายนิ้วมือแต่ใช้ดีเอ็นเอ เพื่อระบุชนิดสิ่งมีชีวิต" },
        { term: "sophisticated molecular biology methods", th: "วิธีการทางชีววิทยาระดับโมเลกุลที่ซับซ้อนล้ำสมัย" },
        { term: "the offending virus", th: "ไวรัสตัวการที่ก่อปัญหา" }
      ]
    },
    9: {
      explanationTh:
        "ย่อหน้าสั้นนี้เป็นคำพูดของ Dr John Carr อธิบายว่าเพลี้ยอ่อนเกี่ยวข้องกับไวรัสอย่างไร\n\nคำพูดของ Carr: 'Aphids are a common carrier of plant-infecting viruses' — เพลี้ยอ่อนเป็นพาหะทั่วไปของไวรัสที่ติดเชื้อในพืช\n\nจากนั้นเขาบอกว่า 'The usual suspects' (ผู้ต้องสงสัยที่มักพบบ่อย) คือไวรัส turnip mosaic virus และ cauliflower mosaic virus ซึ่งเป็นไวรัสที่ส่งผลต่อกะหล่ำปลีในยุโรปและสหรัฐฯ\n\nสรุปใจความ: Carr ให้ข้อมูลพื้นฐานว่าเพลี้ยอ่อนมักเป็นพาหะไวรัส และไวรัสที่พบบ่อยในยุโรป/สหรัฐฯ คือ 2 ชนิดที่เขายกตัวอย่างมา",
      vocab: [
        { term: "a common carrier of plant-infecting viruses", th: "พาหะทั่วไปที่นำพาไวรัสที่ติดเชื้อในพืช" },
        { term: "The 'usual suspects'", th: "ตัวที่มักถูกสงสัยเป็นสาเหตุอยู่บ่อยๆ (ในที่นี้คือไวรัส 2 ชนิดที่พบบ่อย)" }
      ]
    },
    10: {
      explanationTh:
        "ย่อหน้านี้เป็นผลการค้นพบของ Fening เรื่องชนิดของเพลี้ยอ่อน\n\nคำพูดของ Fening: 'We found that two different species of aphids, pink and green, were generally found on the diseased cabbages' — พบว่าเพลี้ยอ่อน 2 ชนิดที่ต่างกัน คือสีชมพูและสีเขียว มักพบอยู่บนต้นกะหล่ำปลีที่เป็นโรค\n\nการค้นพบสำคัญ: 'It turned out this was the first record of the green aphid species ever being seen in Ghana' — ปรากฏว่านี่เป็นครั้งแรกที่มีการพบเพลี้ยอ่อนสีเขียวชนิดนี้ในกานาเลย (ไม่เคยมีบันทึกมาก่อน) ส่วนเพลี้ยอ่อนสีชมพูถูกระบุว่าเป็นชนิด Myzus persicae (Sulzer)\n\nสรุปใจความ: การค้นพบเพลี้ยอ่อนสีเขียวในกานาเป็นครั้งแรกถือเป็นข้อมูลใหม่ที่สำคัญ นอกเหนือจากเพลี้ยอ่อนสีชมพูที่ระบุชนิดได้ชัดเจนแล้ว",
      vocab: [
        { term: "the first record of the green aphid species ever being seen in Ghana", th: "บันทึกครั้งแรกที่พบเพลี้ยอ่อนสีเขียวชนิดนี้ในกานา (ไม่เคยมีมาก่อนเลย)" },
        { term: "identified as Myzus persicae (Sulzer)", th: "ถูกระบุ/จำแนกชนิดว่าเป็น Myzus persicae (ชื่อวิทยาศาสตร์ของเพลี้ยอ่อนสีชมพูชนิดนี้)" }
      ]
    },
    11: {
      explanationTh:
        "ย่อหน้านี้บอกว่าไวรัสที่พบยังระบุไม่ได้ชัดเจน แล้วเปลี่ยนไปแนะนำนักวิจัยคนที่สาม\n\nยิ่งไปกว่านั้น (What's more) ไวรัสที่พบไม่ใช่สิ่งที่พวกเขาคาดไว้ (the virus was not what they expected) และงานยังคงดำเนินต่อไปเพื่อระบุตัวการที่แท้จริง (the culprit)\n\nความสำคัญของเรื่องนี้: ยิ่งระบุตัวได้เร็วเท่าไหร่ (The sooner it can be characterised) ก็ยิ่งพัฒนากลยุทธ์ปกป้องพืชผลอย่างยั่งยืนได้เร็วเท่านั้น เพื่อป้องกันไม่ให้โรคแพร่กระจายต่อ ทั้งในกานาและประเทศอื่นๆ ในภูมิภาค\n\nแนะนำนักวิจัยคนใหม่: Dr Theresa Manful อีกหนึ่งนักวิจัยที่หวังว่ากลยุทธ์กำจัดโรคจะเป็นผลลัพธ์จากงานวิจัยของเธอ เธอเป็นนักวิจัยจากมหาวิทยาลัยกานาเช่นเดียวกับ Fening และทำงานร่วมกับนักชีวเคมี Professor Mark Carrington จากเคมบริดจ์ เกี่ยวกับโรคที่เรียกว่า trypanosomiasis (โรคจากพยาธิใบไม้)\n\nสรุปใจความ: ไวรัสที่ทำร้ายกะหล่ำปลียังไม่ถูกระบุชัดเจน แต่บทความเริ่มเปลี่ยนไปพูดถึงงานวิจัยที่สามเรื่องโรค trypanosomiasis ในวัว",
      vocab: [
        { term: "the virus was not what they expected", th: "ไวรัสที่พบไม่ใช่ตัวที่พวกเขาคาดไว้ (เจอสิ่งใหม่ที่ไม่รู้จัก)" },
        { term: "the culprit", th: "ตัวการที่แท้จริง (ผู้ก่อเหตุ)" },
        { term: "sustainable crop protection strategies", th: "กลยุทธ์ปกป้องพืชผลที่ยั่งยืน" },
        { term: "trypanosomiasis", th: "โรคติดเชื้อพยาธิที่เกิดจากปรสิตในเลือด (แพร่โดยแมลงวันเซ็ตซี)" }
      ]
    },
    12: {
      explanationTh:
        "ย่อหน้าสั้นนี้เป็นคำพูดของ Dr Theresa Manful อธิบายผลกระทบของโรค trypanosomiasis\n\nคำพูดของเธอ: 'This is a major constraint to cattle fearing in Africa' — โรคนี้เป็นอุปสรรคสำคัญต่อการเลี้ยงวัวในแอฟริกา (หมายเหตุ: คำว่า 'fearing' ในต้นฉบับน่าจะพิมพ์ผิดจากคำว่า 'farming' ที่แปลว่า 'การทำฟาร์ม/เลี้ยงสัตว์')\n\n'Although trypanosomiasis is also a disease of humans, the number of cases is low, and the more serious concerns about the disease relate to the economic impact on agricultural production' — แม้ trypanosomiasis จะเป็นโรคของมนุษย์ได้ด้วย แต่จำนวนผู้ป่วยมีน้อย ความกังวลที่ร้ายแรงกว่าคือผลกระทบทางเศรษฐกิจต่อการผลิตทางการเกษตร\n\nสรุปใจความ: โรคนี้อันตรายต่อมนุษย์น้อย แต่สร้างความเสียหายทางเศรษฐกิจต่อการเลี้ยงสัตว์อย่างมาก",
      vocab: [
        { term: "a major constraint to cattle fearing* (แปลว่า farming) in Africa", th: "อุปสรรคสำคัญต่อการเลี้ยงวัวในแอฟริกา (คำนี้ในต้นฉบับสะกดผิดจาก 'farming')" },
        { term: "the economic impact on agricultural production", th: "ผลกระทบทางเศรษฐกิจต่อการผลิตทางการเกษตร" }
      ]
    },
    13: {
      explanationTh:
        "ย่อหน้านี้อธิบายกลไกของปรสิตและงานวิจัยของ Manful กับ Carrington\n\nพาหะของโรค: ปรสิตที่ก่อโรคนี้ถูกพาหะโดยแมลงวันเซ็ตซี (the tsetse fly) ซึ่งอาศัยอยู่ทั่วบริเวณกว้างของแอฟริกาใต้ทะเลทรายซาฮารา (colonises vast swathes of sub-Saharan Africa)\n\nสิ่งที่รู้แล้ว: Carrington บอกว่ามีข้อมูลมากมายเกี่ยวกับกลไกระดับโมเลกุลของปรสิตชนิดนี้ (the parasite's molecular mechanisms) โดยเฉพาะวิธีที่มันหลบเลี่ยงระบบภูมิคุ้มกันของสัตว์ที่เป็นโฮสต์ (evades the immune system of the animal acting as its host) ด้วยการเปลี่ยนโปรตีนบนเปลือกผิวของมันเพื่อ 'ล่องหน' (altering the proteins in its coat so as to remain 'invisible')\n\nสิ่งที่ยังไม่รู้: แต่คำพูดของ Carrington บอกว่า 'when you look at the effect on large animals, you realise that there is almost nothing known about the dynamics of an infection, and even whether an infection acquired at an early age persists for its lifetime' — แปลว่า: เมื่อดูผลกระทบต่อสัตว์ใหญ่ กลับพบว่าแทบไม่มีใครรู้เกี่ยวกับพลวัตของการติดเชื้อเลย แม้แต่ว่าการติดเชื้อตั้งแต่อายุน้อยจะคงอยู่ตลอดชีวิตของสัตว์หรือไม่\n\nการทดลอง: Manful และ Carrington จึงเริ่มทดสอบวัวในกานา และพบว่าเกือบทั้งหมดติดเชื้ออยู่ตลอดเวลาแทบทุกตัว (nearly all were infected most of the time)\n\nสรุปใจความ: แม้จะรู้กลไกระดับโมเลกุลของปรสิตดี แต่กลับไม่รู้เลยว่ามันส่งผลต่อสัตว์ใหญ่ในระยะยาวอย่างไร การทดสอบวัวจริงในกานาพบว่าเกือบทุกตัวติดเชื้อตลอดเวลา",
      vocab: [
        { term: "the tsetse fly", th: "แมลงวันเซ็ตซี พาหะนำโรค trypanosomiasis" },
        { term: "colonises vast swathes of sub-Saharan Africa", th: "อาศัยอยู่แพร่กระจายทั่วพื้นที่กว้างใหญ่ของแอฟริกาใต้ทะเลทรายซาฮารา" },
        { term: "evades the immune system", th: "หลบเลี่ยงระบบภูมิคุ้มกันของร่างกาย" },
        { term: "remain 'invisible'", th: "ทำตัวเองให้ 'มองไม่เห็น' ต่อระบบภูมิคุ้มกัน (เปรียบเทียบ)" },
        { term: "the dynamics of an infection", th: "รูปแบบ/พลวัตของการติดเชื้อว่าเปลี่ยนแปลงไปอย่างไรตามเวลา" }
      ]
    },
    14: {
      explanationTh:
        "ย่อหน้านี้เป็นคำพูดของ Manful เล่าถึงประโยชน์ที่เธอได้รับจากความร่วมมือนี้\n\nคำพูดของเธอ: 'I now have a fully functional lab and can do DNA extraction and analysis in Ghana - I don't have to bring samples to Cambridge' — ตอนนี้เธอมีห้องแล็บที่ใช้งานได้เต็มรูปแบบแล้ว และสามารถสกัดและวิเคราะห์ดีเอ็นเอได้เองในกานา ไม่ต้องส่งตัวอย่างไปเคมบริดจ์อีกต่อไป\n\n'We are teaching students from five Ghanaian institutions the diagnostic methods' — พวกเขากำลังสอนวิธีการวินิจฉัยโรคให้นักศึกษาจาก 5 สถาบันในกานา\n\nสรุปใจความ: ความร่วมมือกับเคมบริดจ์ไม่ได้ให้แค่ความรู้ แต่ยังสร้างขีดความสามารถของกานาเองในระยะยาว ทั้งห้องแล็บและการถ่ายทอดความรู้ให้นักศึกษารุ่นต่อไป",
      vocab: [
        { term: "a fully functional lab", th: "ห้องปฏิบัติการที่ใช้งานได้ครบสมบูรณ์" },
        { term: "DNA extraction and analysis", th: "การสกัดและวิเคราะห์ดีเอ็นเอ" },
        { term: "the diagnostic methods", th: "วิธีการวินิจฉัยโรค" }
      ]
    },
    15: {
      explanationTh:
        "ย่อหน้าสุดท้ายเป็นคำพูดปิดท้ายของ Dr John Carr สรุปภาพรวมของงานวิจัยทั้งหมด\n\n'Agriculture faces increasing challenges' — การเกษตรกำลังเผชิญความท้าทายที่เพิ่มขึ้นเรื่อยๆ\n\n'Bioscience is playing a crucial part in developing ways to mitigate pest impact and reduce the spread of parasites' — วิทยาศาสตร์ชีวภาพมีบทบาทสำคัญในการพัฒนาวิธีบรรเทาผลกระทบจากศัตรูพืชและลดการแพร่กระจายของปรสิต\n\n'We want to ensure not only that every harvest is successful, but also that it's maximally successful' — พวกเขาต้องการให้แน่ใจไม่ใช่แค่ว่าทุกฤดูเก็บเกี่ยวจะประสบความสำเร็จ แต่ต้องประสบความสำเร็จให้ได้มากที่สุดเท่าที่จะเป็นไปได้ด้วย\n\nสรุปใจความ: บทความปิดท้ายด้วยการย้ำว่าวิทยาศาสตร์ (bioscience) คือกุญแจสำคัญในการรับมือกับความท้าทายทางการเกษตรของแอฟริกาในอนาคต ไม่ใช่แค่ให้พอเก็บเกี่ยวได้ แต่ให้ได้ผลผลิตสูงสุดเท่าที่เป็นไปได้",
      vocab: [
        { term: "faces increasing challenges", th: "กำลังเผชิญความท้าทายที่เพิ่มมากขึ้นเรื่อยๆ" },
        { term: "mitigate pest impact", th: "บรรเทา/ลดผลกระทบจากศัตรูพืช" },
        { term: "maximally successful", th: "ประสบความสำเร็จสูงสุดเท่าที่จะเป็นไปได้" }
      ]
    },
    16: {
      explanationTh:
        "ย่อหน้านี้เป็นเพียงเส้นคั่น (เครื่องหมายขีดกลางหลายตัวเรียงกัน) ใช้แบ่งเนื้อหาบทความออกจากเชิงอรรถด้านล่าง ไม่มีเนื้อหาให้อธิบาย"
    },
    17: {
      explanationTh:
        "ย่อหน้าสุดท้ายเป็นเชิงอรรถ (footnote) อธิบายความหมายของคำว่า 'aphids' ที่ใช้ในบทความ: 'small insects which feed by sucking liquid from plants' แปลว่า แมลงตัวเล็กๆ ที่กินอาหารด้วยการดูดของเหลวจากพืช (คือ 'เพลี้ยอ่อน' ที่ปรากฏหลายครั้งในบทความ) — เป็นคำอธิบายศัพท์เฉพาะ ไม่ใช่เนื้อหาหลักของบทความ",
      vocab: [
        { term: "aphids", th: "เพลี้ยอ่อน แมลงตัวเล็กที่ดูดกินน้ำเลี้ยงจากพืชเป็นอาหาร" }
      ]
    }
  }
}
