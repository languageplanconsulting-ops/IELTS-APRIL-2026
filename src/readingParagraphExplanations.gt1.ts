// Thai per-paragraph explanations ("งงกับย่อหน้านี้ อยากให้พี่ดอยช่วยอธิบาย")
// for General Training Full Reading Test exams: gt-reading-full-test017,
// gt-reading-full-test01, gt-reading-full-test02.
//
// GT passage titles are not unique ("Passage 1" / "Passage 2" repeats across
// exams), so this bank is keyed by `${examId}#p${passageNumber}` instead of
// by normalized title — see server/userProvidedReadingPracticeGeneralTraining.mjs
// and the GT reading view for how passageNumber (1-5) is assigned.
import type { ReadingParagraphExplanation } from './readingParagraphExplanations'

export const READING_PARAGRAPH_EXPLANATIONS_GT_1: Record<string, Record<number, ReadingParagraphExplanation>> = {
  "gt-reading-full-test017#p1": {
    0: {
      explanationTh:
        `ย่อหน้านี้รวมหัวเรื่องกับคำนำและคำแนะนำ 2 ข้อแรกของประกาศเรื่องการมาโรงเรียน

หัวเรื่อง "Is Your Child at School Today?" แปลว่า "วันนี้ลูกคุณไปโรงเรียนหรือเปล่า" เป็นการเปิดเรื่องแบบถามเพื่อดึงความสนใจผู้ปกครอง ตามด้วยหัวข้อ "School Attendance Information for Parents/Carers" (ข้อมูลการมาเรียนสำหรับพ่อแม่/ผู้ปกครอง)

ช่วง Introduction บอกว่าการได้เรียนแบบเต็มเวลาที่ดี (a good full-time education) จะให้ "จุดเริ่มต้นที่ดีที่สุดในชีวิต" (the best possible start in life) แก่ลูก และการไปโรงเรียนอย่างสม่ำเสมอและตรงเวลา (regularly and punctually) เป็นเรื่อง "จำเป็นมาก" (essential) ถ้าอยากให้เด็กใช้โอกาสต่างๆ ที่มีได้เต็มที่ (make the most of the opportunities available to them) แล้วย้ำว่ากฎหมาย (The law) กำหนดให้พ่อแม่ "ต้องดูแล" (must ensure) ให้ลูกไปโรงเรียนที่ลงทะเบียนไว้อย่างสม่ำเสมอ — พูดง่ายๆ คือการขาดเรียนบ่อยไม่ใช่แค่เรื่องของเด็ก แต่พ่อแม่มีหน้าที่ตามกฎหมายด้วย

หัวข้อ "What you can do to help" (สิ่งที่คุณช่วยได้) เริ่มด้วย 2 ข้อ:
1) ให้แน่ใจว่าลูกไปถึงโรงเรียน "ตรงเวลา" (on time) เพราะจะช่วยฝึกนิสัยตรงต่อเวลา (good timekeeping) และลดการรบกวนในห้องเรียน (lessens any possible classroom disruption) — แต่ถ้าลูกไปถึงหลังจากปิดเช็คชื่อแล้ว (after the register has closed) โดยไม่มีเหตุผลดีพอ จะถูกบันทึกเป็นขาดเรียนแบบ "ไม่ได้รับอนุญาต" (an 'unauthorised' absence) สำหรับคาบนั้น
2) ถ้าลูกจำเป็นต้องขาดเรียน สิ่งสำคัญมาก (it is vital) คือต้องแจ้งโรงเรียนว่าทำไม โดยควรแจ้งตั้งแต่เช้าวันแรกที่ขาด (preferably on the first morning of absence)

สรุปใจความ: ย่อหน้านี้เป็นคำนำที่อธิบายว่าทำไมการไปโรงเรียนสม่ำเสมอถึงสำคัญ (รวมถึงมีผลทางกฎหมาย) แล้วให้คำแนะนำ 2 ข้อแรก คือ พาลูกไปให้ตรงเวลา และแจ้งเหตุผลทันทีถ้าต้องขาดเรียน`,
      vocab: [
        { term: 'punctually', th: 'ตรงเวลา — เน้นว่าต้องไปโรงเรียนให้ทันเวลาทุกครั้ง' },
        { term: 'essential', th: 'จำเป็นอย่างยิ่ง — ในที่นี้คือเรื่องที่ขาดไม่ได้' },
        { term: 'make the most of the opportunities', th: 'ใช้โอกาสที่มีให้คุ้มค่าที่สุด' },
        { term: 'must ensure', th: 'ต้องดูแล/รับรองให้เกิดขึ้นจริง (เป็นหน้าที่ตามกฎหมายของพ่อแม่)' },
        { term: 'classroom disruption', th: 'การรบกวน/สร้างความวุ่นวายในห้องเรียน' },
        { term: 'unauthorised absence', th: "การขาดเรียนที่ไม่ได้รับอนุญาต (ถือเป็นความผิด)" },
        { term: 'vital', th: 'สำคัญมาก ขาดไม่ได้' },
        { term: 'preferably', th: 'ควรจะ (ทำแบบนี้ดีที่สุด)' }
      ]
    },
    1: {
      explanationTh:
        `ย่อหน้านี้เป็นคำแนะนำข้อที่ 3 ต่อจากย่อหน้าก่อน (สังเกตว่าขึ้นต้นด้วยเครื่องหมาย ")" เพราะเป็นข้อความที่ต่อเนื่องมาจากรายการก่อนหน้า)

ใจความคือ: ถ้าคุณรู้หรือคิดว่า (know or think) ลูกกำลังมีปัญหาในการไปโรงเรียน (having difficulties attending the school) คุณควรติดต่อโรงเรียน (should contact the school) และย้ำว่าการทำแต่เนิ่นๆ ดีกว่าทำทีหลัง (It is better to do this sooner rather than later) เพราะปัญหาส่วนใหญ่ (most problems) สามารถแก้ไขได้อย่างรวดเร็วมาก (can be dealt with very quickly) ถ้าจัดการตั้งแต่เนิ่นๆ

สรุปใจความ: ถ้าลูกเริ่มมีปัญหาเรื่องการมาเรียน อย่ารอช้า รีบติดต่อโรงเรียนทันที เพราะยิ่งแก้เร็วยิ่งง่าย`,
      vocab: [
        { term: 'having difficulties', th: 'กำลังมีปัญหา/ลำบากใจ' },
        { term: 'sooner rather than later', th: 'ทำแต่เนิ่นๆ ดีกว่าทำทีหลัง' },
        { term: 'dealt with very quickly', th: 'แก้ไขได้อย่างรวดเร็ว' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้เป็นหัวข้อใหม่ชื่อ "Authorised and Unauthorised Absence" (การขาดเรียนที่ได้รับอนุญาต กับ ที่ไม่ได้รับอนุญาต) พร้อมคำนิยาม

ใจความ: ถ้าลูกขาดเรียน (is absent) แล้วโรงเรียน "ไม่ได้รับคำอธิบาย" จากคุณ (does not receive an explanation from you) หรือเห็นว่าคำอธิบายนั้น "ไม่น่าพอใจ" (considers the explanation unsatisfactory) โรงเรียนจะบันทึกว่าการขาดเรียนของลูกเป็นแบบ "ไม่ได้รับอนุญาต" (unauthorised) ซึ่งก็คือ (that is) การหนีเรียน (truancy) นั่นเอง — พูดง่ายๆ คือถ้าไม่แจ้งเหตุผล หรือเหตุผลฟังไม่ขึ้น จะถูกมองว่าเด็กหนีเรียน

สรุปใจความ: การขาดเรียนจะถูกตัดสินว่า "ไม่ได้รับอนุญาต" (เท่ากับหนีเรียน) ถ้าพ่อแม่ไม่แจ้งเหตุผล หรือแจ้งแล้วแต่เหตุผลฟังไม่ขึ้น`,
      vocab: [
        { term: 'absent', th: 'ขาดเรียน' },
        { term: 'explanation', th: 'คำอธิบาย/เหตุผล' },
        { term: 'unsatisfactory', th: 'ไม่น่าพอใจ ฟังไม่ขึ้น' },
        { term: 'unauthorised', th: 'ไม่ได้รับอนุญาต' },
        { term: 'truancy', th: 'การหนีเรียน' }
      ]
    },
    3: {
      explanationTh:
        `ย่อหน้านี้คือหัวข้อ "เหตุผลที่ยอมรับได้" (acceptable reasons) ซึ่งโรงเรียนจะอนุญาตให้ขาดเรียนได้ (Most absences for acceptable reasons will be authorised) มีทั้งหมด 5 ข้อในรายการ:
• ป่วย (Sickness)
• นัดหมอหรือหมอฟันที่เลี่ยงไม่ได้ (Unavoidable medical or dental appointments) — และแนะนำว่าถ้าเป็นไปได้ควรนัดหลังเลิกเรียนหรือช่วงปิดเทอม (if possible, arrange these for after school or during school holidays)
• การสัมภาษณ์งานกับนายจ้างที่มีแนวโน้มจะจ้าง หรือสัมภาษณ์เข้าเรียนต่อ (An interview with a prospective employer or college)
• สถานการณ์ในครอบครัวที่ไม่ปกติ (Exceptional family circumstances) เช่น การมีคนในครอบครัวเสียชีวิต (bereavement)
• วันสำคัญทางศาสนา (Days of religious observance)

สรุปใจความ: นี่คือรายการเหตุผลที่โรงเรียนยอมรับได้ว่าเป็นการขาดเรียนที่ถูกต้อง ไม่ถือว่าหนีเรียน`,
      vocab: [
        { term: 'acceptable reasons', th: 'เหตุผลที่ยอมรับได้' },
        { term: 'unavoidable', th: 'เลี่ยงไม่ได้' },
        { term: 'prospective employer', th: 'นายจ้างที่มีแนวโน้มจะจ้างงาน' },
        { term: 'exceptional family circumstances', th: 'สถานการณ์ครอบครัวที่ไม่ปกติ/พิเศษ' },
        { term: 'bereavement', th: 'การสูญเสียคนในครอบครัว (เสียชีวิต)' },
        { term: 'religious observance', th: 'การปฏิบัติ/พิธีทางศาสนา' }
      ]
    },
    4: {
      explanationTh:
        `ย่อหน้านี้คือหัวข้อตรงข้ามกับข้อก่อนหน้า คือ "เหตุผลที่โรงเรียนจะไม่อนุญาต" (Your child's school will not authorise absence for the following reasons) มี 5 ข้อ:
• ไปช้อปปิ้งในเวลาเรียน (Shopping during school hours)
• ไปเที่ยวแบบไปเช้าเย็นกลับ (Day trips)
• วันหยุด/พักร้อนที่ไม่ได้ตกลงล่วงหน้ากับโรงเรียน (Holidays which have not been agreed)
• วันเกิด (Birthdays)
• การดูแลพี่น้องหรือญาติที่ป่วย (Looking after brothers or sisters or ill relatives)

สรุปใจความ: เหตุผลเหล่านี้ ถึงแม้จะฟังดูมีเหตุผลในชีวิตจริง แต่โรงเรียนจะไม่ยอมรับว่าเป็นการขาดเรียนที่ถูกต้อง — จะถูกนับเป็นขาดเรียนแบบไม่ได้รับอนุญาต`,
      vocab: [
        { term: 'day trips', th: 'ไปเที่ยวแบบไปเช้าเย็นกลับ ไม่ค้างคืน' },
        { term: 'holidays which have not been agreed', th: 'วันหยุด/พักร้อนที่ไม่ได้ตกลงล่วงหน้ากับโรงเรียน' },
        { term: 'ill relatives', th: 'ญาติที่ป่วย' }
      ]
    }
  },
  "gt-reading-full-test017#p2": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่องของประกาศ แปลว่า "อพาร์ตเมนต์วันหยุดให้เช่า" เป็นการบอกภาพรวมว่าเนื้อหาข้างล่างทั้งหมดคือประกาศให้เช่าที่พักตากอากาศหลายแห่ง (A-G) ให้ผู้อ่านเลือกเปรียบเทียบ`,
      vocab: [{ term: 'to let', th: 'ให้เช่า (คำที่ใช้ในประกาศอสังหาริมทรัพย์แบบอังกฤษ)' }]
    },
    1: {
      explanationTh:
        `นี่คือตัวอักษร "A" ซึ่งเป็นป้ายกำกับของประกาศห้องแรก ใช้จับคู่กับคำถามแบบจับคู่ข้อมูล (Matching Information) กับเนื้อหาคำอธิบายห้อง A ในย่อหน้าถัดไป — ไม่มีเนื้อหาอื่นให้ต้องอธิบาย`
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายรายละเอียดห้องพัก A:

รองรับได้ 2-3 คน (Sleeps 2-3) เป็นอพาร์ตเมนต์ 1 ห้องนอนอยู่ชั้นล่าง (first-floor — ในภาษาอังกฤษแบบอังกฤษ "first floor" คือชั้นถัดจากชั้นล่างสุด) มองเห็นวิวทะเลแบบไม่มีอะไรบัง (uninterrupted sea views) ตั้งอยู่ในอาคารชุดที่มีสิ่งอำนวยความสะดวกครบ (a well-established apartment complex containing a range of leisure facilities) และมีซูเปอร์มาร์เก็ตสำหรับผู้พักอาศัย (a supermarket for residents)

อยู่ "ชายขอบของเมือง" (On the edge of the town) แต่ก็อยู่ใกล้ร้านกาแฟและร้านอาหาร (close to cafes and restaurants) ส่วนที่จอดรถ บอกว่า "โดยทั่วไปมีที่จอดริมถนน" (On-street parking is generally available) — คือไม่ได้การันตี 100% แต่ปกติหาที่จอดได้

สรุปใจความ: ห้อง A เหมาะกับกลุ่มเล็ก วิวทะเลดี สิ่งอำนวยความสะดวกครบ แต่อยู่ขอบเมืองและที่จอดรถไม่ใช่แบบส่วนตัว`,
      vocab: [
        { term: 'uninterrupted sea views', th: 'วิวทะเลที่ไม่มีอะไรบัง มองเห็นชัด' },
        { term: 'well-established', th: 'ก่อตั้งมานาน มั่นคง' },
        { term: 'leisure facilities', th: 'สิ่งอำนวยความสะดวกด้านสันทนาการ' },
        { term: 'on the edge of the town', th: 'อยู่บริเวณขอบเมือง ไม่ใช่ใจกลาง' },
        { term: 'on-street parking', th: 'ที่จอดรถริมถนน (ไม่ใช่ที่จอดส่วนตัว)' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับประกาศห้องที่สอง ใช้จับคู่กับคำอธิบายห้อง B ในย่อหน้าถัดไป — ไม่มีเนื้อหาอื่นให้อธิบาย` },
    4: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง B: รองรับได้ 2-4 คน (Sleeps 2-4) เป็นอพาร์ตเมนต์ 1 ห้องนอนที่ "กว้างขวาง" (Spacious) อยู่ในอาคารที่เพิ่งเปิดใหม่ (a complex that has only just opened) เดินไปทะเลแค่ 5 นาที (five minutes' walk from the sea)

มีที่จอดรถส่วนตัวหน้าตึก (Private parking in front of the building) ตั้งอยู่ใน "หมู่บ้านเงียบสงบ ไม่พลุกพล่าน" (a quiet, unspoilt village) ที่มีตลาดท้องถิ่น ธนาคาร ร้านกาแฟและร้านอาหาร (a local market, banks, cafés and restaurants) และยังมีสนามกอล์ฟระดับแชมเปียนชิพ (fabulous championship golf courses) อยู่ในระยะที่เดินถึงได้สบายๆ (within easy walking distance)

สรุปใจความ: ห้อง B เด่นเรื่องที่จอดรถส่วนตัว ใกล้ทะเล และใกล้สนามกอล์ฟระดับสูง อยู่ในหมู่บ้านที่ยังไม่พลุกพล่าน`,
      vocab: [
        { term: 'spacious', th: 'กว้างขวาง' },
        { term: 'only just opened', th: 'เพิ่งเปิดใหม่' },
        { term: 'private parking', th: 'ที่จอดรถส่วนตัว' },
        { term: 'unspoilt village', th: 'หมู่บ้านที่ยังไม่ถูกทำลาย/ยังคงความเป็นธรรมชาติ ไม่พลุกพล่าน' },
        { term: 'championship golf courses', th: 'สนามกอล์ฟระดับแข่งขันชิงแชมป์' },
        { term: 'within easy walking distance', th: 'อยู่ในระยะที่เดินถึงได้ง่าย' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "C" ป้ายกำกับประกาศห้องที่สาม ใช้จับคู่กับคำอธิบายห้อง C ในย่อหน้าถัดไป` },
    6: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง C: รองรับได้ 2 คน+เด็ก 1 คน (Sleeps 2+child) เป็นกระท่อม 1 ห้องนอน (One-bedroom cottage) ที่มีเตียงเด็กให้ด้วยถ้าต้องการ (child's bed can also be provided) มีระเบียงกว้าง (large terrace) มองเห็นวิวแม่น้ำและภูเขาแบบไม่มีอะไรบัง (uninterrupted views of the river and mountains)

เป็นทำเลที่ "สงบจริงๆ" (A truly peaceful location) อยู่ในหมู่บ้านสวยงามราวภาพวาด (picturesque village) แต่ขับรถไม่ถึง 10 นาทีก็ถึงชายฝั่งและสิ่งอำนวยความสะดวกในเมือง (less than ten minutes' drive from the coast and all the amenities of a town) และเจ้าของบ้านอยู่ใกล้ๆ พร้อมช่วยเหลือทุกเรื่อง (Owners live nearby and are happy to help in any way they can)

สรุปใจความ: ห้อง C เหมาะกับครอบครัวที่มีเด็กเล็ก เงียบสงบ วิวธรรมชาติสวย แต่ยังขับรถไปเมืองได้เร็ว และเจ้าของพร้อมช่วยเหลือ`,
      vocab: [
        { term: 'cottage', th: 'กระท่อม บ้านหลังเล็ก' },
        { term: 'terrace', th: 'ระเบียงกว้าง' },
        { term: 'picturesque village', th: 'หมู่บ้านสวยงามราวภาพวาด' },
        { term: 'amenities', th: 'สิ่งอำนวยความสะดวก' },
        { term: 'happy to help in any way they can', th: 'ยินดีช่วยเหลือทุกวิถีทางที่ทำได้' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับประกาศห้องที่สี่ ใช้จับคู่กับคำอธิบายห้อง D ในย่อหน้าถัดไป` },
    8: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง D: รองรับได้ 2-5 คน (Sleeps 2-5) เป็นอพาร์ตเมนต์ 2 ห้องนอน อยู่ในอาคารที่มีสระว่ายน้ำของตัวเอง (its own pool) และวิวสวยของอุทยานแห่งชาติ (beautiful views of the national park)

เป็นทำเลสงบ ห่างจากใจกลางเมืองแค่ 3 กิโลเมตร (A peaceful location just 3 km from the town centre) ซึ่งมีร้านค้าและสิ่งอำนวยความสะดวกด้านกีฬาที่ดีเยี่ยม (plenty of shops and excellent sports facilities) และมีสนามกอล์ฟท้องถิ่นชั้นเยี่ยมที่ไปถึงได้ง่าย (Superb local golf courses within easy reach)

สรุปใจความ: ห้อง D เหมาะกับกลุ่มใหญ่ (2-5 คน) มีสระว่ายน้ำส่วนตัว วิวอุทยาน และใกล้เมืองพอสมควร`,
      vocab: [
        { term: "its own pool", th: 'สระว่ายน้ำของตัวเอง' },
        { term: 'national park', th: 'อุทยานแห่งชาติ' },
        { term: 'town centre', th: 'ใจกลางเมือง' },
        { term: 'within easy reach', th: 'ไปถึงได้ง่าย' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับประกาศห้องที่ห้า ใช้จับคู่กับคำอธิบายห้อง E ในย่อหน้าถัดไป` },
    10: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง E: รองรับได้ 2-4 คน (Sleeps 2-4) เป็นอพาร์ตเมนต์ 1 ห้องนอนสมัยใหม่อยู่ชั้นล่าง (Modern one-bedroom first-floor apartment) ในบ้านที่เจ้าของพักอยู่ชั้นล่างสุดของบ้านเอง (owners resident on the ground floor)

ทำเลนี้ "เข้าถึงง่าย" (easy access) ไปยังทุกสิ่งที่เมืองสวยๆ นี้มีให้ (all that this fantastic town has to offer) ขับรถไม่กี่นาทีถึงซูเปอร์มาร์เก็ต ธนาคาร ร้านกาแฟ ร้านอาหาร (a few minutes' drive from its supermarket, bank, cafes, restaurants) มีเรือข้ามฟากไปหาดบนเกาะ ออกจากจุดที่ห่างไป 100 เมตร (The ferry to the island beach leaves from 100 m away) และเดินสิบนาทีถึงห้างใหม่ (Ten minutes walk from the new shopping centre) ซึ่งมีร้านค้าเยอะ ศูนย์อาหาร โรงหนัง และที่จอดรถหลายชั้น (many shops, food hall, cinema and multi-storey car park)

สรุปใจความ: ห้อง E อยู่ในเมือง ใกล้ทุกอย่าง ทั้งร้านค้า ท่าเรือ และห้างสรรพสินค้า เหมาะกับคนที่อยากสะดวกสบายเรื่องการเดินทางและช้อปปิ้ง`,
      vocab: [
        { term: 'ground floor', th: 'ชั้นล่างสุดของบ้าน' },
        { term: 'easy access', th: 'เข้าถึงง่าย' },
        { term: 'ferry', th: 'เรือข้ามฟาก' },
        { term: 'multi-storey car park', th: 'ที่จอดรถหลายชั้น' }
      ]
    },
    11: { explanationTh: `นี่คือตัวอักษร "F" ป้ายกำกับประกาศห้องที่หก ใช้จับคู่กับคำอธิบายห้อง F ในย่อหน้าถัดไป` },
    12: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง F: รองรับได้ 2 คน (Sleeps 2) เป็นอพาร์ตเมนต์ 1 ห้องนอนอยู่ชั้นล่าง ตกแต่งสวยงาม (Beautifully furnished) ให้ความสะดวกสบายระดับสูง (offering a high standard of comfort)

ตั้งอยู่ในทำเลสงบที่ขอบหมู่บ้านในแผ่นดิน (a peaceful location on the edge of an inland village) มองเห็นวิวสนามกอล์ฟสวยๆ (attractive views of the golf course) มีร้านอาหาร บาร์ ร้านค้า ฯลฯ อยู่ในระยะเดินถึงสบายๆ (within easy walking distance) และมีโรงรถให้ถ้าตกลงกับเจ้าของล่วงหน้า (Garage available by arrangement with the owners)

สรุปใจความ: ห้อง F เล็กกะทัดรัดสำหรับ 2 คน ตกแต่งดี วิวสนามกอล์ฟ อยู่ในหมู่บ้านเงียบสงบ`,
      vocab: [
        { term: 'beautifully furnished', th: 'ตกแต่งสวยงาม' },
        { term: 'high standard of comfort', th: 'ความสะดวกสบายระดับสูง' },
        { term: 'inland village', th: 'หมู่บ้านในแผ่นดิน (ไม่ติดชายฝั่ง)' },
        { term: 'by arrangement with the owners', th: 'ตกลงล่วงหน้ากับเจ้าของบ้าน' }
      ]
    },
    13: { explanationTh: `นี่คือตัวอักษร "G" ป้ายกำกับประกาศห้องสุดท้าย ใช้จับคู่กับคำอธิบายห้อง G ในย่อหน้าถัดไป` },
    14: {
      explanationTh:
        `ย่อหน้านี้อธิบายห้อง G: รองรับได้ 2-4 คน (Sleeps 2-4) เป็นอพาร์ตเมนต์ 2 ห้องนอนอยู่ "ใจกลางเมือง" (central location) บนถนนที่คึกคักไปด้วยร้านค้าและร้านอาหาร (in the busy street with shops, restaurants etc.) และอยู่ไม่ไกลจากชายหาด (not far from the beach)

ย่อหน้าปิดท้ายด้วยการบอกว่าตัวเมืองมีสิ่งอำนวยความสะดวกที่เหมาะกับการพักผ่อนตลอดทั้งปี (ideal facilities for holidays all year round) รวมถึงสระว่ายน้ำ สนามเทนนิส และสนามกอล์ฟ (swimming pool, tennis courts and golf course)

สรุปใจความ: ห้อง G อยู่ใจกลางเมือง คึกคัก ใกล้หาด และเมืองมีสิ่งอำนวยความสะดวกครบสำหรับเที่ยวได้ทุกฤดู`,
      vocab: [
        { term: 'central location', th: 'ทำเลใจกลางเมือง' },
        { term: 'busy street', th: 'ถนนที่คึกคักพลุกพล่าน' },
        { term: 'not far from', th: 'ไม่ไกลจาก' },
        { term: 'all year round', th: 'ตลอดทั้งปี' }
      ]
    }
  },
  "gt-reading-full-test017#p3": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่องประกาศรับสมัครงานจากบริษัททัวร์ชื่อ "GZJ Travel" คำว่า Recruitment Info แปลว่า "ข้อมูลการรับสมัครงาน"`,
      vocab: [{ term: 'recruitment', th: 'การรับสมัครงาน' }]
    },
    1: {
      explanationTh:
        `ย่อหน้านี้เป็นคำเกริ่นนำ บอกว่าบริษัทกำลังมองหาคนที่ "กระตือรือร้นและทำงานได้ผลจริง" (keen and effective people) ที่ "หลงใหลในการท่องเที่ยว" (passionate about travel) เพื่อมาทำงานเป็น Travel Sales Consultants (ที่ปรึกษาด้านการขายทัวร์) ในทีมที่กำลังเติบโตอย่างรวดเร็ว (rapidly-growing team)

จากนั้นบอกว่ากระบวนการรับสมัคร (recruitment process) มีทั้งหมด "5 ขั้นตอน" (five stages) แล้วปิดท้ายว่า "นี่คือวิธีการทำงานของมัน" (Here's how it works) เป็นการเกริ่นว่าย่อหน้าต่อไปจะอธิบายแต่ละขั้นตอนทีละขั้น

สรุปใจความ: นี่คือคำเกริ่นบอกว่าบริษัทกำลังรับสมัครพนักงานขายทัวร์ และขั้นตอนสมัครงานมี 5 ขั้นตอน ซึ่งจะอธิบายต่อไป`,
      vocab: [
        { term: 'keen and effective', th: 'กระตือรือร้นและทำงานได้ผลจริง' },
        { term: 'passionate about', th: 'หลงใหล/มีใจรักในเรื่องนั้น' },
        { term: 'rapidly-growing team', th: 'ทีมที่กำลังเติบโตอย่างรวดเร็ว' },
        { term: 'recruitment process', th: 'กระบวนการรับสมัครงาน' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนที่ 1 (The first stage): ใช้แบบฟอร์มสมัครออนไลน์ (our online application form) เพื่อสมัครตำแหน่งงานที่เปิดรับอยู่ (a current vacancy) โดยบอกว่านี่คือ "โอกาสของคุณ" (your chance) ที่จะเล่าเกี่ยวกับตัวเอง และคุณสมบัติ/ประสบการณ์ที่ทำให้คุณเหมาะกับงานนี้ที่สุด (make you the ideal person for the job)

สำหรับตำแหน่ง Travel Sales Consultant ต้องมีหลักฐานว่ามีประสบการณ์ด้านการตลาดมาเยอะ (extensive experience in a marketing environment) รวมถึงพื้นฐานการศึกษาที่ดี (a solid academic background) ส่วนถ้าสนใจตำแหน่ง Corporate Travel Consultant ต้องมีประสบการณ์เป็น Travel Consultant มาแล้วอย่างน้อย 1 ปี (at least one year's experience)

สรุปใจความ: ขั้นตอนแรกคือกรอกใบสมัครออนไลน์ โดยต้องมีคุณสมบัติตามตำแหน่งที่สมัคร`,
      vocab: [
        { term: 'application form', th: 'ใบสมัคร/แบบฟอร์มสมัคร' },
        { term: 'vacancy', th: 'ตำแหน่งงานว่าง' },
        { term: 'extensive experience', th: 'ประสบการณ์ที่กว้างขวางมาก' },
        { term: 'solid academic background', th: 'พื้นฐานการศึกษาที่ดี มั่นคง' }
      ]
    },
    3: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนที่ 2: ถ้าผ่านมาถึง Stage Two บริษัทจะจัดให้มีการพูดคุยทางโทรศัพท์ (a telephone discussion) ซึ่งเป็นโอกาสให้คุณรู้จักบริษัทมากขึ้น รวมถึงผลตอบแทน/สิทธิประโยชน์ที่มีให้ (the rewards on offer)

ตัวอย่างที่ยกมา (For instance) คือ ทุกปีบริษัทจะยกย่องความพยายามที่โดดเด่นและฉลองความสำเร็จร่วมกับเพื่อนร่วมงาน (acknowledge outstanding efforts and celebrate successes with our co-workers) โดยมีงานพิธีมอบรางวัล (prize-giving ceremonies) ที่ออกแบบมาเพื่อสิ่งนี้โดยเฉพาะ

สรุปใจความ: ขั้นตอนที่ 2 คือคุยโทรศัพท์ เพื่อให้ผู้สมัครรู้จักบริษัทและสิทธิประโยชน์ต่างๆ เช่น งานมอบรางวัลประจำปี`,
      vocab: [
        { term: 'telephone discussion', th: 'การพูดคุยทางโทรศัพท์' },
        { term: 'rewards on offer', th: 'ผลตอบแทน/สิทธิประโยชน์ที่มีให้' },
        { term: 'acknowledge outstanding efforts', th: 'ยกย่อง/ให้เกียรติความพยายามที่โดดเด่น' },
        { term: 'prize-giving ceremonies', th: 'พิธีมอบรางวัล' }
      ]
    },
    4: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนที่ 3: เป็นการสัมภาษณ์ (an interview) ที่ผู้สมัครจะไปพร้อมกับกลุ่มผู้สมัครคนอื่นๆ กลุ่มเล็กๆ (with a small group of other applicants) โดยบริษัทจะถามเรื่องความทะเยอทะยาน (your ambitions) และที่สำคัญที่สุดคือความสามารถด้านการขาย (your sales ability) ซึ่งบอกไว้ชัดว่าเป็น "คุณสมบัติที่สำคัญที่สุด" (the most vital quality) สำหรับธุรกิจนี้

นอกจากนี้ผู้สมัครต้องทำแบบทดสอบทางจิตวิทยา (a psychometric test) เพื่อให้บริษัทเข้าใจสไตล์การทำงานและลักษณะนิสัยมากขึ้น (working style and characteristics) และบริษัทจะเล่าถึงสวัสดิการบางอย่างด้วย (some of the perks) เช่น พนักงานของ Flight Center จะได้ใช้บริการปรึกษาสุขภาพและความเป็นอยู่ฟรีจากทีม Healthwise (free consultations conducted by our in-house health and wellbeing team)

สรุปใจความ: ขั้นตอนที่ 3 คือการสัมภาษณ์แบบกลุ่ม พร้อมทำแบบทดสอบจิตวิทยา และได้รู้จักสวัสดิการของบริษัท`,
      vocab: [
        { term: 'ambitions', th: 'ความทะเยอทะยาน เป้าหมายในอนาคต' },
        { term: 'sales ability', th: 'ความสามารถด้านการขาย' },
        { term: 'psychometric test', th: 'แบบทดสอบทางจิตวิทยา' },
        { term: 'perks', th: 'สวัสดิการพิเศษ' },
        { term: 'in-house health and wellbeing team', th: 'ทีมดูแลสุขภาพและความเป็นอยู่ภายในบริษัท' }
      ]
    },
    5: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนที่ 4 และขั้นตอนสุดท้ายรวมกัน:

ใน Stage Four คุณจะได้พบกับ Area Leader (หัวหน้าประจำพื้นที่) และไปเยี่ยมชมสาขาจริงสาขาหนึ่ง (visit one of our shops) เพื่อพบทีมงานและเรียนรู้เพิ่มเติมว่างานเป็นอย่างไร (find out more about the sort of work that's involved)

ถ้าผ่าน Stage Four ก็ถือว่ามาถึง "ขั้นตอนสุดท้าย" (the final stage) ของกระบวนการแล้ว และบริษัทจะติดต่อกลับมาพร้อมข้อเสนองาน (a job offer) — ถ้าตอบรับ (if you accept) บริษัทจะจองคิวให้เข้า Learning Center เพื่อเริ่มการฝึกอบรมโดยเร็วที่สุด (get your training underway as soon as possible) จากนั้นแผนก Careerwise ซึ่งรับผิดชอบเรื่องการฝึกอบรม จะจัดโค้ชส่วนตัว (organise individual coaching) เพื่อช่วยวางเป้าหมายเส้นทางอาชีพ (assist in setting goals for your career path)

สรุปใจความ: ขั้นตอนสุดท้ายคือพบหัวหน้าพื้นที่และเยี่ยมสาขาจริง แล้วถ้าผ่านจะได้รับข้อเสนองานพร้อมการฝึกอบรมและโค้ชด้านอาชีพ`,
      vocab: [
        { term: 'area leader', th: 'หัวหน้าประจำพื้นที่' },
        { term: 'job offer', th: 'ข้อเสนองาน' },
        { term: 'get your training underway', th: 'เริ่มการฝึกอบรม' },
        { term: 'individual coaching', th: 'การโค้ชส่วนตัว' },
        { term: 'career path', th: 'เส้นทางสายอาชีพ' }
      ]
    }
  },
  "gt-reading-full-test017#p4": {
    0: {
      explanationTh:
        `ย่อหน้านี้รวมสองหัวข้อของกฎความปลอดภัยในห้องปฏิบัติการ (Health and safety in the workplace)

หัวข้อแรก "Personal safety" (ความปลอดภัยส่วนบุคคล) บอกว่าคุณต้อง "คุ้นเคย" (be familiar with) กับขั้นตอนฉุกเฉิน (emergency procedures) ของอาคาร เพื่อให้รู้ว่าต้องทำอะไรถ้าเกิดไฟไหม้ สารเคมีหก หรืออุบัติเหตุอื่นๆ (fire, spillages or other accidents) ห้ามเข้าพื้นที่หวงห้าม (restricted areas) โดยไม่ได้รับอนุญาต และต้องปฏิบัติตามคำเตือนตลอดเวลา (at all times observe the warnings given)

ห้ามเอาอะไรมาสอดค้ำประตูหนีไฟ (do not wedge open fire doors) หรือไปยุ่งกับตัวปิดประตู (tamper with door closures) และห้ามกีดขวางทางเข้าประตู ทางเดิน หรือบันได (block doorways, corridors or stairs) เพราะสิ่งกีดขวาง (obstructions) อาจกระทบการเข้าออกเวลาเกิดไฟไหม้ นอกจากนี้อย่าเปิดลิ้นชักหรือประตูทิ้งไว้โดยไม่จำเป็น และห้ามลากสายไฟ/สายเคเบิลผ่านพื้น (do not trail cables or flexes across the floor)

หัวข้อที่สอง "How to dispose of rubbish safely" (วิธีทิ้งขยะอย่างปลอดภัย) บอกว่าห้องแล็บตั้งใจปกป้องสิ่งแวดล้อม (aim to protect the environment) ด้วยการเก็บและรีไซเคิลแก้ว กระดาษ และวัสดุอื่นๆ ที่เพิ่มขึ้นเรื่อยๆ (saving and recycling glass, waste paper, and an increasing range of other materials) และย้ำว่าสำคัญมากที่ต้อง "ตรวจสอบวัสดุอย่างละเอียด" ว่ามีการปนเปื้อนหรือไม่ (check materials carefully for contamination) ก่อนใส่ลงถังรีไซเคิล

สรุปใจความ: ย่อหน้านี้สอนกฎความปลอดภัยพื้นฐาน (รู้ทางหนีไฟ ไม่กีดขวางทางเดิน ไม่ทิ้งสายไฟเกะกะ) และวิธีแยกขยะรีไซเคิลอย่างปลอดภัย`,
      vocab: [
        { term: 'emergency procedures', th: 'ขั้นตอนปฏิบัติเมื่อเกิดเหตุฉุกเฉิน' },
        { term: 'spillages', th: 'สารเคมี/ของเหลวหกเลอะเทอะ' },
        { term: 'restricted areas', th: 'พื้นที่หวงห้าม' },
        { term: 'wedge open', th: 'สอดค้ำให้เปิดไว้' },
        { term: 'tamper with', th: 'ไปยุ่ง/แก้ไขโดยไม่ได้รับอนุญาต' },
        { term: 'obstructions', th: 'สิ่งกีดขวาง' },
        { term: 'trail cables', th: 'ลากสายไฟ/สายเคเบิลเกะกะพื้น' },
        { term: 'contamination', th: 'การปนเปื้อน' }
      ]
    },
    1: {
      explanationTh:
        `ย่อหน้านี้พูดต่อเรื่องการทิ้งขยะ แล้วต่อด้วยหัวข้อการยกของหนัก

ห้าม (Never) ทิ้งของมีคม เช่น ใบมีดโกน หรือเศษแก้วแตก (sharp objects such as razor blades or broken glass) ลงถังขยะ โดยไม่ห่อให้เรียบร้อยก่อน (without having wrapped the items carefully) เพื่อปกป้องคนที่มาเทถังขยะ (to protect those emptying the bins) ส่วนขั้นตอนขยะแบบอื่นอาจแตกต่างกันไป — ให้ติดต่อ Building Manager หรือ Divisional Safety Officer เพื่อขอคำแนะนำเฉพาะแผนกของคุณ

หัวข้อ "How to handle heavy objects" (วิธีจัดการของหนัก): ต้องแน่ใจว่าชั้นวางไม่รับน้ำหนักเกิน (shelves are not overloaded) และของหนัก/แก้วควรเก็บไว้ที่ระดับความสูงที่หยิบง่าย (stored at working height where they will be easier to reach) ให้ใช้บันไดหรือขั้นบันไดเพื่อหยิบของที่อยู่สูง (Use steps or ladders) ห้ามปีนขึ้นโต๊ะหรือเก้าอี้เด็ดขาด (never climb on benches, tables or chairs) และห้ามเคลื่อนย้ายอะไรที่เกินความสามารถของตัวเอง (Never move anything that is beyond your capability) ควรใช้รถเข็นที่มีให้ในที่ทำงานแทน (use the trolleys provided) และถ้างานของคุณต้องทำงานซ้ำๆ ด้วยมือเป็นประจำ (repetitive manual operations are routine) แผนกจะฝึกอบรมเรื่องท่าทางและวิธีทำงานที่ปลอดภัยให้

สรุปใจความ: ห่อของมีคมก่อนทิ้งเสมอ อย่าให้ชั้นรับน้ำหนักเกิน ใช้บันไดแทนการปีน และใช้รถเข็นแทนการยกของหนักเอง`,
      vocab: [
        { term: 'razor blades', th: 'ใบมีดโกน' },
        { term: 'wrapped carefully', th: 'ห่อให้เรียบร้อยอย่างระมัดระวัง' },
        { term: 'overloaded', th: 'รับน้ำหนักเกิน' },
        { term: 'working height', th: 'ระดับความสูงที่หยิบใช้งานได้สะดวก' },
        { term: 'beyond your capability', th: 'เกินความสามารถของตัวเอง' },
        { term: 'trolleys', th: 'รถเข็น' },
        { term: 'repetitive manual operations', th: 'งานที่ต้องทำซ้ำๆ ด้วยมือ' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้เป็นหัวข้อสุดท้าย "Staying alert" (การมีสติตื่นตัวตลอดเวลา)

ใจความ: ถ้าคุณรู้สึกเหนื่อยล้าทางจิตใจหรือร่างกาย (become mentally or physically tired) ระหว่างวันทำงาน แล้วพบว่าตัวเองง่วง (feeling drowsy) หรือมีสมาธิไม่ดี (not concentrating properly) คุณอาจ "เสี่ยง" ที่จะทำให้เกิดอุบัติเหตุ หรือทำผิดพลาดที่อาจเป็นอันตรายต่อตัวคุณหรือเพื่อนร่วมงาน (at risk of causing an accident or making a mistake that could harm you or your colleagues) เพื่อป้องกันสิ่งนี้ (To prevent this) ให้แน่ใจว่าคุณพักเป็นระยะเมื่อจำเป็น (take regular breaks when necessary)

สรุปใจความ: ถ้ารู้สึกง่วงหรือสมาธิหลุดระหว่างทำงาน ให้หยุดพักทันที เพราะความเหนื่อยล้าเพิ่มความเสี่ยงอุบัติเหตุ`,
      vocab: [
        { term: 'mentally or physically tired', th: 'เหนื่อยล้าทางจิตใจหรือร่างกาย' },
        { term: 'drowsy', th: 'ง่วงเหงาหาวนอน' },
        { term: 'at risk of', th: 'มีความเสี่ยงที่จะ...' },
        { term: 'regular breaks', th: 'การพักเป็นระยะๆ' }
      ]
    }
  },
  "gt-reading-full-test017#p5": {
    0: {
      explanationTh:
        `ย่อหน้านี้เป็นหัวเรื่องและคำนำสั้นๆ ของบทความ

หัวเรื่อง "The Zebras' long walk across Africa" แปลว่า "การเดินทางไกลข้ามแอฟริกาของม้าลาย" ตามด้วยชื่อผู้เขียนบทความ James Gifford ซึ่งบอกว่าเขา "ลงพื้นที่ศึกษา" (investigates) งานวิจัยใหม่ที่น่าสนใจ (some interesting new research) เกี่ยวกับรูปแบบการอพยพ (migration patterns) ของฝูงม้าลายที่อาศัยอยู่ในบอตสวานา ทางตอนใต้ของแอฟริกา (Botswana in southern Africa)

สรุปใจความ: นี่คือบทนำสั้นๆ บอกว่าบทความนี้จะพาไปดูงานวิจัยเรื่องการอพยพของม้าลายในบอตสวานา`,
      vocab: [
        { term: 'investigates', th: 'ลงพื้นที่ศึกษา สืบสวน' },
        { term: 'migration patterns', th: 'รูปแบบการอพยพ' }
      ]
    },
    1: { explanationTh: `นี่คือตัวอักษร "A" ซึ่งเป็นป้ายกำกับย่อหน้าแรกของบทความ (ใช้สำหรับคำถามแบบจับคู่ย่อหน้ากับหัวข้อ/ข้อมูล) ไม่มีเนื้อหาอื่นให้อธิบาย` },
    2: {
      explanationTh:
        `ย่อหน้า A เปิดเรื่องด้วยการชี้ให้เห็นว่าการเดินทางของม้าลายฝูงนี้น่าทึ่งแค่ไหน

การที่สัตว์ตัวหนึ่งเดินทางกว่า 270 กม. (over 270 km) ในบอตสวานา ซึ่งบางส่วนต้องข้ามภูมิประเทศทรายและพุ่มไม้เตี้ยของทะเลทรายคาลาฮารี (the sand and low bush terrain of the Kalahari Desert) ถือเป็นความสำเร็จที่น่าทึ่งอยู่แล้ว (a remarkable achievement) แต่การทำแบบนั้นภายใน 11 วัน (in 11 days) โดยไม่มีเหตุผลชัดเจน (without any obvious motivation) ยิ่งน่าทึ่งมาก (quite extraordinary)

โดยเฉลี่ยการเดินทางไป-กลับของม้าลายฝูงนี้ยาวถึง 588 กม. (an exhausting round-trip of 588 km) — ระหว่างพื้นที่ทะเลสาบเกลือ Makgadikgadi กับแม่น้ำ Okavango — ทำให้เป็นการอพยพที่ยาวเป็นอันดับสอง (second only to) รองจากการอพยพครั้งใหญ่ของฝูงม้าลายใน Serengeti National Park เท่านั้น

แต่สิ่งที่ผู้เขียนมองว่าน่าทึ่งยิ่งกว่า (what is even more incredible still) คือ จนกระทั่งเมื่อไม่นานมานี้ (until recently) เรื่องนี้ยังไม่มีใครรู้จักเลย (it was completely unheard of)

สรุปใจความ: การอพยพของม้าลายฝูงนี้ไกลและใช้เวลาสั้นอย่างน่าทึ่ง และที่น่าแปลกใจที่สุดคือเพิ่งถูกค้นพบเมื่อไม่นานนี้เอง`,
      vocab: [
        { term: 'remarkable achievement', th: 'ความสำเร็จที่น่าทึ่ง' },
        { term: 'without any obvious motivation', th: 'โดยไม่มีเหตุผล/แรงจูงใจที่ชัดเจน' },
        { term: 'round-trip', th: 'การเดินทางไปและกลับ' },
        { term: 'second only to', th: 'เป็นรองแค่...เท่านั้น (อันดับสอง)' },
        { term: 'unheard of', th: 'ไม่เคยมีใครรู้จักมาก่อน' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    4: {
      explanationTh:
        `ย่อหน้า B แนะนำผู้ค้นพบการอพยพครั้งนี้

Hattie Bartlam นักวิจัยคนหนึ่ง ค้นพบการอพยพนี้ระหว่างที่เธอกำลังติดตามกลุ่มม้าลาย (tracking zebra groups) ที่เรียกอย่างเป็นทางการว่า "ฮาเร็ม" (officially known as harems) อยู่ริมแม่น้ำ Okavango เพื่อทำวิจัยปริญญาเอก (for her PhD)

แต่ละฮาเร็มประกอบด้วยม้าตัวผู้ 1 ตัว (a stallion) กับม้าตัวเมีย 7-8 ตัว (his seven or eight mares) พร้อมลูกม้าวัยเยาว์ (juvenile foals) และบอกว่านอกจากกลุ่มสังคมนี้แล้ว ม้าลายไม่มีความผูกพัน/ความภักดีต่อกันเลย (There is no loyalty between zebras beyond this social group) แม้ว่าฮาเร็มหลายกลุ่มมักจะมารวมกันเป็น "ฝูงใหญ่" (herds) ก็ตาม

สำหรับงานวิจัยนี้ Hattie วางแผนจะเปรียบเทียบรูปแบบการเคลื่อนที่ในระยะสั้น (the small-scale movement patterns) ของฝูงม้าลาย 11 ฝูงในพื้นที่นั้น

สรุปใจความ: นักวิจัย Hattie ติดตามฝูงม้าลาย (ฮาเร็ม) 11 กลุ่มเพื่อทำวิจัยปริญญาเอก โดยศึกษารูปแบบการเคลื่อนที่ระยะสั้นของพวกมัน`,
      vocab: [
        { term: 'tracking', th: 'การติดตามร่องรอย/สัญญาณ' },
        { term: 'harems', th: 'ฮาเร็ม (กลุ่มม้าลายที่มีตัวผู้ 1 กับตัวเมียหลายตัว)' },
        { term: 'stallion', th: 'ม้าตัวผู้' },
        { term: 'mares', th: 'ม้าตัวเมีย' },
        { term: 'juvenile foals', th: 'ลูกม้าวัยเยาว์' },
        { term: 'no loyalty beyond this social group', th: 'ไม่มีความผูกพันนอกกลุ่มสังคมนี้' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "C" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    6: {
      explanationTh:
        `ย่อหน้า C เล่าถึงการค้นพบที่น่าประหลาดใจ

ในเดือนธันวาคม (In December) ตอนที่ฝนประจำปี (the annual rains) ทำให้ถนนกลายเป็นแม่น้ำ (transformed the roads into rivers) Hattie ต้อง "ประหลาดใจไม่น้อย" (more than a little surprised) เมื่อตรวจดูข้อมูลจากปลอกคอวิทยุ (radio collars) ที่ติดกับม้าลาย แล้วพบว่าฮาเร็ม 6 กลุ่มอยู่ห่างออกไปถึง 270 กม. ที่ขอบของ Makgadikgadi ซึ่งเป็นพื้นที่อุดมแร่ธาตุขนาดใหญ่ที่มีเกลือสะสมมานานจากการระเหยของน้ำ (a huge mineral-rich area where salt has collected over the years as water evaporates in the heat)

จากนั้นในเดือนพฤษภาคมปีถัดมา (the following year) เมื่อความชื้นจากฝนหมดไป ฮาเร็ม 5 ใน 6 กลุ่มนั้นก็เดินทางกลับมาที่ Okavango อย่างเหนื่อยล้า (came wearily back)

สิ่งนี้ทำให้เกิดคำถามว่า: ทำไมทั้งที่มีอาหารและน้ำอุดมสมบูรณ์ (a plentiful supply of food and water) ม้าลายถึงถูก "ดึงดูด" ไปทางตะวันออก สู่ทะเลสาบเกลือ (being drawn eastwards to the salt pans) และที่เข้าใจยากยิ่งกว่าคือ อะไรทำให้ 6 กลุ่มเดินทางไกลขนาดนั้น ในขณะที่อีก 5 กลุ่มยังอยู่ริม Okavango เหมือนเดิม

สรุปใจความ: ข้อมูลปลอกคอวิทยุแสดงว่าฮาเร็มบางกลุ่มเดินทางไกลไปยังทะเลสาบเกลือทั้งที่ไม่จำเป็นต้องไปเพราะมีน้ำ/อาหารพออยู่แล้ว นี่คือปริศนาที่นักวิจัยอยากไข`,
      vocab: [
        { term: 'radio collars', th: 'ปลอกคอส่งสัญญาณวิทยุที่ติดตามสัตว์' },
        { term: 'mineral-rich area', th: 'พื้นที่อุดมแร่ธาตุ' },
        { term: 'came wearily back', th: 'เดินทางกลับมาอย่างเหนื่อยล้า' },
        { term: 'plentiful supply', th: 'มีปริมาณอุดมสมบูรณ์' },
        { term: 'drawn eastwards', th: 'ถูกดึงดูดไปทางตะวันออก' },
        { term: 'salt pans', th: 'ทะเลสาบเกลือ' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    8: {
      explanationTh:
        `ย่อหน้า D อธิบายที่มาทางประวัติศาสตร์ของเส้นทางอพยพนี้

การค้นพบนี้สร้าง "กระแสฮือฮา" ในวงการวิจัย (created quite a buzz in the research community) ผู้เขียนจึงไปเยี่ยม Hattie ซึ่งอธิบายว่าเมื่อร้อยปีก่อน (a century ago) ฝูงม้าลายและวิลเดอบีสต์จำนวนมากในบอตสวานา ทำให้เกิดการแข่งขันแย่งหญ้า (competition for grass) จนการอพยพเป็นสิ่งจำเป็น (essential) — เส้นทางอพยพเส้นหนึ่งวิ่งจาก Okavango ไปยัง Makgadikgadi

แต่ในช่วงปลายทศวรรษ 1960 (the late 1960s) มีการสร้างรั้วขนาดใหญ่ (giant fences) เพื่อหยุดการแพร่ระบาดของโรคปากและเท้าเปื่อยและโรคอื่นๆ ระหว่างสัตว์ป่ากับปศุสัตว์ (to stop foot and mouth and other diseases spreading between wildlife and domestic cattle) โดยรั้วเส้นหนึ่งขวางเส้นทางอพยพนี้พอดี แม้สัตว์จะยังอ้อมรั้วไปได้ แต่แต่ละช่วงของการเดินทางจะยาวขึ้นอีก 200 กม. — ระยะทางที่เป็นไปไม่ได้ (an impossible distance) เพราะไม่มีแหล่งน้ำถาวรตลอดเส้นทางที่ยืดออกไปนี้

แม้ทุกวันนี้ที่รั้วถูกรื้อไปแล้ว (with the fence gone) — มันถูกรื้อในปี 2004 (it was taken down in 2004) — ก็ยังมีน้ำดื่มน้อยมากอย่างอันตราย (dangerously little drinking water) ที่จะรองรับม้าลายในการเดินทางกลับสู่ Okavango

สรุปใจความ: เดิมมีเส้นทางอพยพนี้อยู่แล้วในอดีต แต่รั้วกันโรคที่สร้างในยุค 1960s ตัดเส้นทางจนอพยพไม่ได้เกือบ 40 ปี แม้รั้วจะถูกรื้อไปแล้วในปี 2004 เส้นทางก็ยังขาดแคลนน้ำอยู่ดี`,
      vocab: [
        { term: 'created quite a buzz', th: 'สร้างกระแสฮือฮา' },
        { term: 'competition for grass', th: 'การแข่งขันแย่งหญ้ากิน' },
        { term: 'foot and mouth', th: 'โรคปากและเท้าเปื่อย' },
        { term: 'impossible distance', th: 'ระยะทางที่เป็นไปไม่ได้' },
        { term: 'dangerously little', th: 'น้อยจนอันตราย' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    10: {
      explanationTh:
        `ย่อหน้า E ตั้งคำถามที่น่าฉงนอีกข้อหนึ่ง

เนื่องจากม้าลายมีอายุได้ถึง 20 ปี (can live up to 20 years) การอพยพครั้งนี้จึงต้อง "ข้ามหายไป" อย่างน้อยหนึ่งรุ่น (must have skipped at least one generation) ในช่วง 40 ปีที่รั้วกั้นอยู่

สิ่งนี้นำไปสู่คำถามใหม่: เดิมทีเชื่อกันเสมอว่าสัตว์กินพืชที่อยู่รวมกันเป็นสังคม (social herbivores) อย่างม้าลาย จะเรียนรู้พฤติกรรมการอพยพจากพ่อแม่ (learn migratory behaviour from their parents) แล้วรุ่นล่าสุดเรียนรู้ได้อย่างไรว่าต้องไปเมื่อไหร่และไปที่ไหน ในเมื่อไม่ได้เรียนจากพ่อแม่ (Not from their parents) ที่ไม่เคยได้อพยพเลย เป็นไปได้ไหมว่าพวกมันเดินตามสัตว์ชนิดอื่น เช่น ช้าง (Did they follow another species, such as elephants?) ซึ่งคำตอบคือ "เราอาจไม่มีวันรู้" (We may never know)

สรุปใจความ: คำถามใหญ่ที่ยังไขไม่ได้คือ ม้าลายรุ่นปัจจุบันเรียนรู้เส้นทางอพยพนี้มาจากไหน ในเมื่อพ่อแม่ของมันไม่เคยอพยพเลยตลอด 40 ปีที่มีรั้วกั้น`,
      vocab: [
        { term: 'skipped a generation', th: 'ข้ามหายไปหนึ่งรุ่น' },
        { term: 'social herbivores', th: 'สัตว์กินพืชที่อยู่รวมกันเป็นสังคม' },
        { term: 'migratory behaviour', th: 'พฤติกรรมการอพยพ' },
        { term: 'we may never know', th: 'เราอาจไม่มีวันรู้คำตอบ' }
      ]
    },
    11: { explanationTh: `นี่คือตัวอักษร "F" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    12: {
      explanationTh:
        `ย่อหน้า F สรุปว่าม้าลายในพื้นที่นี้แบ่งออกเป็นกี่กลุ่มพฤติกรรม

ข้อมูลของ Hattie ชี้ให้เห็นว่า (Hattie's data points to the conclusion) มีม้าลายหลายกลุ่มประชากรที่มีพฤติกรรมต่างกัน:

กลุ่มแรก เหมือนม้าลาย Okavango ส่วนใหญ่ (the vast majority) จะ "อยู่แบบสบายๆ" (take it easy) คือใช้เวลาทั้งปีอยู่ริมแม่น้ำที่เดียว

กลุ่มที่สอง มีจำนวน 15,000-20,000 ตัว "ทำงานหนักขึ้นนิดหน่อย" (work a bit harder) คือแบ่งเวลาอยู่ระหว่างทะเลสาบเกลือ Makgadikgadi กับแม่น้ำ Boteti ที่อยู่ไม่ไกลกันนัก (reasonably nearby) บางครั้งก็ลำบากหาน้ำในย่าน Boteti ช่วงหน้าแล้ง (during the dry season) ต้องเดินไกลถึง 30 กม. เพื่อหาหญ้าสด (fresh grazing) แต่รางวัลของพวกมันคือหญ้าอวบๆ รอบ Makgadikgadi หลังฝนตก (the juicy grass around the Makgadikgadi after the rains)

กลุ่มสุดท้าย มีจำนวนน้อยกว่า (more modest) แม้จะยังไม่ทราบตัวเลขแน่ชัด (though as yet unknown) กลุ่มนี้ต้องถือเป็น "นักกีฬาที่น่าทึ่งที่สุดกลุ่มหนึ่งในอาณาจักรสัตว์" (among the animal kingdom's most remarkable athletes) เพราะพวกมันเดินทางไปมาระหว่าง Okavango กับทะเลสาบเกลือ ได้รับ "สิ่งดีที่สุดของทั้งสองโลก" (the best of both worlds) แต่ต้องแลกด้วยการเดินทางที่แสนพิเศษข้ามบอตสวานา (an extraordinary journey across Botswana)

สรุปใจความ: ม้าลายในพื้นที่นี้แบ่งเป็น 3 กลุ่มพฤติกรรม ตั้งแต่กลุ่มที่อยู่นิ่งริมแม่น้ำตลอดปี ไปจนถึงกลุ่มที่อพยพไกลสุดขั้วระหว่างสองแหล่งน้ำ`,
      vocab: [
        { term: 'take it easy', th: 'อยู่แบบสบายๆ ไม่ต้องดิ้นรน' },
        { term: 'reasonably nearby', th: 'อยู่ไม่ไกลกันนัก' },
        { term: 'fresh grazing', th: 'หญ้าสดสำหรับกิน' },
        { term: 'best of both worlds', th: 'ได้สิ่งดีที่สุดจากทั้งสองทาง' },
        { term: 'extraordinary journey', th: 'การเดินทางที่แสนพิเศษ' }
      ]
    },
    13: { explanationTh: `นี่คือตัวอักษร "G" ป้ายกำกับย่อหน้าสุดท้ายของบทความ` },
    14: {
      explanationTh:
        `ย่อหน้า G ปิดท้ายบทความด้วยความสำคัญของงานวิจัยนี้

โดยทั่วไปสัตว์ใกล้สูญพันธุ์ (Endangered species) มักจะได้รับความสนใจ/พาดหัวข่าวเสมอ (naturally tend to grab the headlines) ดังนั้นจึงเป็นเรื่องน่ายินดี (refreshing) ที่สัตว์ซึ่งมีจำนวนค่อนข้างมาก (relatively abundant) อย่างม้าลาย ได้กลายเป็นจุดสนใจบ้างสักครั้ง

ม้าลายเป็นส่วนสำคัญของห่วงโซ่อาหาร (a vital part of the food chain) การเข้าใจการอพยพของพวกมันจึงช่วยให้เราตีความการเคลื่อนไหวของผู้ล่า (predators) ได้ด้วย และงานวิจัยของ Hattie ก็ได้ "ฉายแสง" (shed light on) ให้เห็นผลกระทบของรั้วต่อสัตว์อพยพ

ผู้เขียนถามว่าอะไรจุดประกายความสนใจของเธอในเรื่องม้าลาย เธอตอบว่าการขอทุนวิจัยสัตว์ที่ "น่าตื่นเต้น" อย่างสิงโตนั้นง่ายกว่า (it is easier to get funding to study exciting animals like lions) แต่ถึงแม้เรื่องนั้นจะสำคัญอย่างไม่ต้องสงสัย (Crucial as that undoubtedly is) เธอเชื่อว่าสัตว์กินพืชอย่างม้าลายเป็นกุญแจสำคัญในการเข้าใจระบบนิเวศใดๆ (key to understanding any ecosystem) บทความปิดท้ายว่าวงการวิทยาศาสตร์โชคดีที่มีคนอย่าง Hattie ที่ยินดีเลือกเส้นทางที่ยากกว่า (willing to take the hard option)

สรุปใจความ: ม้าลายอาจไม่ใช่สัตว์ที่คนสนใจเท่าสัตว์ใกล้สูญพันธุ์ แต่จริงๆ แล้วสำคัญมากต่อระบบนิเวศ และงานวิจัยแบบ Hattie ก็คุ้มค่าแม้จะหาทุนยากกว่า`,
      vocab: [
        { term: 'grab the headlines', th: 'ได้รับความสนใจ/พาดหัวข่าว' },
        { term: 'refreshing', th: 'น่ายินดี สดชื่นใจ' },
        { term: 'abundant', th: 'มีจำนวนมาก อุดมสมบูรณ์' },
        { term: 'shed light on', th: 'ฉายแสงให้เห็นชัด/ช่วยอธิบาย' },
        { term: 'get funding', th: 'ขอทุนวิจัย' },
        { term: 'take the hard option', th: 'เลือกเส้นทางที่ยากกว่า' }
      ]
    }
  },
  "gt-reading-full-test01#p1": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่องใหญ่ของบทความ แปลว่า "คำแนะนำสำหรับผู้บริโภค" เป็นการบอกภาพรวมว่าเนื้อหาข้างล่างคือคำแนะนำด้านสิทธิผู้บริโภค`,
      vocab: [{ term: 'consumer', th: 'ผู้บริโภค' }]
    },
    1: {
      explanationTh:
        `นี่คือหัวข้อย่อยของบทความ แปลว่า "จะทำอย่างไรถ้าสิ่งที่คุณสั่งซื้อยังไม่มาถึง" เป็นการบอกหัวข้อเฉพาะที่บทความนี้จะพูดถึง`
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนแรกเมื่อของที่สั่งไม่มาถึง

ถ้าสิ่งที่คุณสั่งซื้อ (something you've ordered) ยังไม่มาถึง คุณควรติดต่อผู้ขาย (contact the seller) เพื่อสอบถามว่ามันอยู่ที่ไหน เพราะเป็น "ความรับผิดชอบตามกฎหมาย" ของผู้ขาย (It's legal responsibility) ที่ต้องดูแลให้สินค้าถูกส่งถึงคุณ ผู้ขายควรตามเรื่องกับบริษัทขนส่ง (chase the delivery company) และแจ้งให้คุณทราบว่าเกิดอะไรขึ้นกับสินค้าของคุณ

ถ้าสินค้าไม่ได้ถูกส่งไปยังสถานที่ที่คุณตกลงไว้ (the location you agreed) เช่น ถ้าถูกฝากไว้กับเพื่อนบ้านโดยที่คุณไม่ได้ยินยอม (left with your neighbour without your consent) ก็ถือเป็นความรับผิดชอบตามกฎหมายของผู้ขาย (it's the seller's legal responsibility) ที่ต้องแก้ปัญหานี้

สรุปใจความ: ถ้าของไม่มา ให้ติดต่อผู้ขายก่อนเสมอ เพราะตามกฎหมายผู้ขายมีหน้าที่ต้องดูแลให้สินค้าส่งถึงมือคุณอย่างถูกต้อง`,
      vocab: [
        { term: 'legal responsibility', th: 'ความรับผิดชอบตามกฎหมาย' },
        { term: 'chase the delivery company', th: 'ตามเรื่องกับบริษัทขนส่ง' },
        { term: 'without your consent', th: 'โดยที่คุณไม่ได้ยินยอม' }
      ]
    },
    3: {
      explanationTh:
        `ย่อหน้านี้อธิบายสิทธิ์ของผู้บริโภคถ้าสินค้ายังไม่มา

ถ้าสินค้ายังไม่มา (doesn't turn up) คุณมีสิทธิ์ตามกฎหมาย (you're legally entitled to) ที่จะได้สินค้าใหม่ หรือขอเงินคืน (a replacement or refund) คุณสามารถขอเงินคืนได้ถ้าไม่ได้รับสินค้าภายใน 30 วันหลังจากซื้อ (within 30 days of buying it)

ถ้าผู้ขายปฏิเสธ (refuses) คุณควรร้องเรียนเป็นลายลักษณ์อักษร (put your complaint in writing) ถ้ายังไม่ได้ผลอีก (doesn't work) คุณสามารถติดต่อสมาคมการค้าของผู้ขาย (their trade association) — ให้ดูข้อมูลนี้ในเว็บไซต์ของผู้ขาย หรือติดต่อสอบถามได้

สรุปใจความ: ถ้าของไม่มาภายใน 30 วัน คุณมีสิทธิ์ขอเงินคืนหรือของใหม่ ถ้าผู้ขายไม่ยอม ให้ร้องเรียนเป็นลายลักษณ์อักษร แล้วยกระดับไปที่สมาคมการค้าได้`,
      vocab: [
        { term: 'legally entitled to', th: 'มีสิทธิ์ตามกฎหมายที่จะได้รับ' },
        { term: 'replacement or refund', th: 'สินค้าทดแทนหรือเงินคืน' },
        { term: 'refuses', th: 'ปฏิเสธ' },
        { term: 'in writing', th: 'เป็นลายลักษณ์อักษร' },
        { term: 'trade association', th: 'สมาคมการค้า' }
      ]
    },
    4: {
      explanationTh:
        `ย่อหน้านี้เป็นการเกริ่นเข้าสู่อีกช่องทางหนึ่งในการขอเงินคืน

นอกจากนี้ (also) คุณอาจสามารถขอเงินคืนผ่านธนาคารหรือผู้ให้บริการชำระเงินของคุณได้ (through your bank or payment provider) — ซึ่งขึ้นอยู่กับว่าคุณจ่ายเงินด้วยวิธีไหน (this depends on how you paid)

สรุปใจความ: มีอีกทางเลือกหนึ่งคือขอเงินคืนผ่านธนาคาร/ผู้ให้บริการชำระเงิน โดยวิธีจะต่างกันไปตามช่องทางที่คุณจ่ายเงิน (รายละเอียดอยู่ในย่อหน้าถัดไป)`,
      vocab: [
        { term: 'payment provider', th: 'ผู้ให้บริการชำระเงิน' },
        { term: 'depends on how you paid', th: 'ขึ้นอยู่กับวิธีที่คุณจ่ายเงิน' }
      ]
    },
    5: {
      explanationTh:
        `ย่อหน้านี้อธิบายวิธีขอเงินคืนถ้าจ่ายด้วยบัตรเดบิต (debit card)

ให้ติดต่อธนาคารของคุณ และบอกว่าต้องการใช้ระบบ "chargeback" (การเรียกเงินคืนผ่านธนาคาร) ถ้าธนาคารยินยอม (If the bank agrees) พวกเขาจะขอให้ธนาคารของผู้ขายคืนเงินเข้าบัญชีคุณ

บทความเตือนว่าพนักงานธนาคารหลายคน "ไม่รู้จัก" ระบบนี้ (don't know about the scheme) ดังนั้นคุณอาจต้องขอคุยกับหัวหน้างานหรือผู้จัดการ (a supervisor or manager) และย้ำว่าต้องทำเรื่องนี้ภายใน 120 วันนับจากวันที่คุณจ่ายเงิน (within 120 days of when you paid)

สรุปใจความ: ถ้าจ่ายด้วยบัตรเดบิต ให้ขอใช้ chargeback กับธนาคารภายใน 120 วัน อาจต้องขอคุยกับผู้จัดการเพราะพนักงานทั่วไปอาจไม่รู้จักระบบนี้`,
      vocab: [
        { term: 'chargeback scheme', th: 'ระบบเรียกเงินคืนผ่านธนาคาร' },
        { term: "don't know about the scheme", th: 'ไม่รู้จักระบบนี้' },
        { term: 'supervisor or manager', th: 'หัวหน้างานหรือผู้จัดการ' }
      ]
    },
    6: {
      explanationTh:
        `ย่อหน้านี้อธิบายวิธีขอเงินคืนถ้าจ่ายด้วยบัตรเครดิต (credit card) ซึ่งแบ่งเป็น 2 กรณีตามราคาสินค้า

ถ้าสินค้าราคาต่ำกว่า 100 ปอนด์ (less than £100) ให้ติดต่อบริษัทบัตรเครดิตและขอใช้ระบบ "chargeback" เหมือนกัน และย้ำว่า "ไม่มีกำหนดเวลา" ว่าต้องทำเมื่อไหร่ (There's no time limit)

แต่ถ้าสินค้าราคามากกว่า 100 ปอนด์แต่ไม่เกิน 30,000 ปอนด์ (more than £100 but less than £30,000) ให้ติดต่อบริษัทบัตรเครดิตและขอทำเรื่อง "section 75 claim" (การเรียกร้องตามมาตรา 75 ซึ่งเป็นกฎหมายคุ้มครองผู้บริโภคของอังกฤษ)

สรุปใจความ: บัตรเครดิตมี 2 ทางเลือกตามราคาสินค้า — ต่ำกว่า 100 ปอนด์ใช้ chargeback (ไม่มีกำหนดเวลา) ส่วน 100-30,000 ปอนด์ใช้ section 75 claim`,
      vocab: [
        { term: 'no time limit', th: 'ไม่มีกำหนดเวลาจำกัด' },
        { term: 'section 75 claim', th: 'การเรียกร้องตามมาตรา 75 (กฎหมายคุ้มครองผู้บริโภคของอังกฤษ)' }
      ]
    },
    7: {
      explanationTh:
        `ย่อหน้านี้อธิบายวิธีขอเงินคืนถ้าจ่ายผ่าน PayPal

ให้ใช้ "ศูนย์แก้ไขข้อพิพาทออนไลน์" ของ PayPal (PayPal's online resolution centre) เพื่อรายงานข้อพิพาทของคุณ (report your dispute) และย้ำว่าต้องทำภายใน 180 วันหลังจากจ่ายเงิน (within 180 days of paying)

สรุปใจความ: ถ้าจ่ายผ่าน PayPal ให้แจ้งปัญหาผ่านศูนย์แก้ไขข้อพิพาทของ PayPal ภายใน 180 วัน`,
      vocab: [
        { term: 'online resolution centre', th: 'ศูนย์แก้ไขข้อพิพาทออนไลน์' },
        { term: 'report your dispute', th: 'รายงานข้อพิพาทของคุณ' }
      ]
    }
  },
  "gt-reading-full-test01#p2": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่องของบทความรีวิวหม้อหุงข้าว ถามว่า "หม้อหุงข้าวแบบไหนเหมาะกับคุณที่สุด" (What's the best rice cooker for you?) เป็นการเกริ่นว่าข้างล่างจะมีรีวิวหม้อหุงข้าวหลายรุ่นให้เปรียบเทียบ`
    },
    1: { explanationTh: `นี่คือตัวอักษร "A" ป้ายกำกับประกาศรุ่นแรก ใช้จับคู่กับคำอธิบายรุ่น A ในย่อหน้าถัดไป` },
    2: {
      explanationTh:
        `ย่อหน้านี้รีวิวหม้อหุงข้าวรุ่น A: Ezy Rice Cooker

มีหม้อขนาด 1.8 ลิตร (a 1.8 litre pot) และตัวเครื่องเป็นสแตนเลส (stainless steel exterior) มีฝาแก้วแยกต่างหาก (a separate glass lid) และหูจับบนฝายังคง "เย็น" ไม่ร้อน (the handle on the lid stays cool)

ข้อดีคือหุงข้าวขาวได้สมบูรณ์แบบ (produces perfectly cooked white rice) แต่มีแนวโน้ม "กระเด็น/พ่นน้ำ" เวลาหุงข้าวกล้อง (tends to spit when cooking brown rice) และมีคราบสกปรกเล็กน้อยติดอยู่รอบขอบฝา (slight dirt traps around the rim of the lid) และทั้งหม้อและฝา "ล้างในเครื่องล้างจานไม่ได้" (neither the pot nor the lid is dishwasher safe)

สรุปใจความ: รุ่น A หุงข้าวขาวดีมาก แต่มีปัญหาเรื่องข้าวกล้องกระเด็น และล้างในเครื่องล้างจานไม่ได้`,
      vocab: [
        { term: 'stainless steel exterior', th: 'ตัวเครื่องภายนอกเป็นสแตนเลส' },
        { term: 'stays cool', th: 'ยังคงเย็น ไม่ร้อน' },
        { term: 'tends to spit', th: 'มีแนวโน้มกระเด็น/พ่นน้ำ' },
        { term: 'dirt traps', th: 'จุดที่คราบสกปรกติดง่าย' },
        { term: 'dishwasher safe', th: 'ล้างในเครื่องล้างจานได้' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับประกาศรุ่นที่สอง ใช้จับคู่กับคำอธิบายรุ่น B ในย่อหน้าถัดไป` },
    4: {
      explanationTh:
        `ย่อหน้านี้รีวิวรุ่น B: Family Rice Cooker

ตัวเครื่องเป็นพลาสติก (a plastic exterior) มีฝาแบบพลิกเปิด (a flip-top lid) ที่ล็อกได้เมื่อปิด (The lid locks when closed) และกลายเป็นหูจับที่แข็งแรงสำหรับหิ้วหม้อ (becomes a secure handle to carry the cooker)

หม้อชั้นในทำจากอะลูมิเนียม (The aluminium interior pot) ซึ่ง "ล้างยากพอสมควร" (quite difficult to clean) และใส่เครื่องล้างจานไม่ได้ (it can't be put in a dishwasher) แต่มีข้อดีคือถูกโปรแกรมให้ปรับอุณหภูมิเองเมื่อข้าวสุกแล้ว (programmed to adjust the temperature once the rice is done) เพื่อให้หยุดหุงแต่ไม่เย็นชืด (stops cooking but doesn't get cold)

สรุปใจความ: รุ่น B มีระบบอุ่นข้าวอัตโนมัติที่ดี แต่หม้อชั้นในล้างยากและใส่เครื่องล้างจานไม่ได้`,
      vocab: [
        { term: 'flip-top lid', th: 'ฝาแบบพลิกเปิด' },
        { term: 'secure handle', th: 'หูจับที่แข็งแรงมั่นคง' },
        { term: 'difficult to clean', th: 'ล้างทำความสะอาดยาก' },
        { term: 'adjust the temperature', th: 'ปรับอุณหภูมิ' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "C" ป้ายกำกับประกาศรุ่นที่สาม ใช้จับคู่กับคำอธิบายรุ่น C ในย่อหน้าถัดไป` },
    6: {
      explanationTh:
        `ย่อหน้านี้รีวิวรุ่น C: Mini Rice Cooker

มีฝาแบบพลิกเปิด (a flip-top lid) และความจุเล็กแค่ 0.3 ลิตร (a 0.3 litre capacity) หม้อชั้นในทำจากอะลูมิเนียมเคลือบกันติด (non-stick aluminium) และล้างในเครื่องล้างจานได้ (is dishwasher safe)

หม้อรุ่นนี้ "เหมาะมาก" (ideal) เวลาหุงสำหรับกินคนเดียว (when cooking for one) แต่ปัญหาคือ "ไม่มีหูจับด้านข้างเลย" (does not have any handles at the side) และน้ำบางครั้งล้นออกมา (water sometimes overflows) เวลาหุงข้าวกล้อง

สรุปใจความ: รุ่น C เล็กกะทัดรัด เหมาะกินคนเดียว ล้างง่าย แต่ไม่มีหูจับ และข้าวกล้องอาจทำน้ำล้น`,
      vocab: [
        { term: 'non-stick', th: 'เคลือบกันติด' },
        { term: 'dishwasher safe', th: 'ล้างในเครื่องล้างจานได้' },
        { term: 'ideal for cooking for one', th: 'เหมาะมากสำหรับหุงกินคนเดียว' },
        { term: 'overflows', th: 'ล้นออกมา' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับประกาศรุ่นที่สี่ ใช้จับคู่กับคำอธิบายรุ่น D ในย่อหน้าถัดไป` },
    8: {
      explanationTh:
        `ย่อหน้านี้รีวิวรุ่น D: VPN Rice Cooker

ตัวเครื่องเป็นเหล็กพ่นสี (a painted steel exterior) มีหูจับสองข้าง (a handle on each side) และหม้อชั้นในเป็นเหล็ก (a steel inner pot) มีฝาแบบยกออก (a lift-off lid) และมาพร้อมคู่มือที่รวมไอเดียเมนูข้าวหลากหลาย (a booklet including a range of ideas for rice dishes)

แต่ข้อเสียคือโหมดอุ่นข้าวต้องกดเลือกเองด้วยมือ (the keep-warm setting must be manually selected) และหูจับ "จับยาก" (tricky to grip)

สรุปใจความ: รุ่น D มาพร้อมคู่มือทำเมนูข้าว แต่ต้องกดอุ่นข้าวเองและหูจับใช้งานไม่ถนัด`,
      vocab: [
        { term: 'lift-off lid', th: 'ฝาแบบยกออกได้' },
        { term: 'keep-warm setting', th: 'โหมดอุ่นข้าว' },
        { term: 'manually selected', th: 'ต้องเลือกเองด้วยมือ' },
        { term: 'tricky to grip', th: 'จับยาก ใช้งานไม่ถนัด' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับประกาศรุ่นสุดท้าย ใช้จับคู่กับคำอธิบายรุ่น E ในย่อหน้าถัดไป` },
    10: {
      explanationTh:
        `ย่อหน้านี้รีวิวรุ่น E: S16 Rice cooker

ใช้งานง่าย (simple to use) ไม่กระเด็นหรือน้ำล้น (not spitting or boiling over) แม้แต่เวลาหุงข้าวกล้อง ตัวเครื่องด้านนอกยังคงเย็นตลอดการใช้งาน (The exterior stays cool when in use) ทำให้ไม่มีความเสี่ยงที่มือจะโดนลวก (no danger of burning your hand)

แต่ปัญหาคือการไม่มีหูจับเป็นเรื่องน่ารำคาญ (the lack of handles is a nuisance) และควรจะมีคู่มือสูตรอาหารมาด้วย (a recipe book would have been useful)

สรุปใจความ: รุ่น E ใช้งานปลอดภัย ไม่กระเด็นไม่ล้น แต่ไม่มีหูจับและไม่มีคู่มือสูตรอาหารมาให้`,
      vocab: [
        { term: 'boiling over', th: 'น้ำเดือดล้นออกมา' },
        { term: 'exterior stays cool', th: 'ตัวเครื่องด้านนอกยังคงเย็น' },
        { term: 'danger of burning', th: 'อันตรายจากการโดนลวก' },
        { term: 'a nuisance', th: 'เรื่องน่ารำคาญใจ' }
      ]
    }
  },
  "gt-reading-full-test01#p3": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่อง "ความปลอดภัยเมื่อทำงานบนหลังคา" (Safety when working on roofs) เป็นการเกริ่นหัวข้อของบทความ`
    },
    1: {
      explanationTh:
        `ย่อหน้านี้ชี้ให้เห็นความอันตรายและสถิติของการตกจากที่สูง

การตกจากที่สูง (A fall from height) คืออันตรายที่ร้ายแรงที่สุด (the most serious hazard) ที่เกี่ยวข้องกับงานบนหลังคา การป้องกันการตก (Preventing falls from roofs) เป็นเรื่อง "สำคัญอันดับต้นๆ" (a priority) ของหน่วยงาน WorkSafe New Zealand

จากการสอบสวนของ WorkSafe (Investigation by WorkSafe) เกี่ยวกับการตกขณะทำงานบนที่สูง พบว่ามากกว่า 50% ของการตกเกิดขึ้นจากความสูงต่ำกว่า 3 เมตร (more than 50 percent of falls are from under three metres) และส่วนใหญ่เกิดจากบันไดและหลังคา (from ladders and roofs)

ค่าใช้จ่ายที่เกิดจากการตกเหล่านี้ (The cost of these falls) ประเมินไว้ที่ 24 ล้านดอลลาร์ต่อปี (estimated to be $24 million a year) — และนี่ยังไม่รวม (to say nothing of) ต้นทุนด้านมนุษย์ (the human costs) ที่เกิดจากการตกเหล่านี้ นอกจากนี้อุบัติเหตุส่วนใหญ่เกิดที่ไซต์ก่อสร้างบ้านพักอาศัย (residential building sites) มากกว่าสถานที่ทำงานอื่นใดในภาคก่อสร้าง (than any other workplace in the construction sector)

สรุปใจความ: การตกจากที่สูง (แม้จะไม่สูงมาก) เป็นอันตรายอันดับหนึ่งของงานหลังคา สร้างความเสียหายทั้งด้านเงินและชีวิตคน โดยเฉพาะที่ไซต์บ้านพักอาศัย`,
      vocab: [
        { term: 'hazard', th: 'อันตราย ความเสี่ยง' },
        { term: 'a priority', th: 'เรื่องสำคัญอันดับต้นๆ' },
        { term: 'under three metres', th: 'ต่ำกว่าสามเมตร' },
        { term: 'estimated to be', th: 'ประเมินไว้ว่า' },
        { term: 'to say nothing of', th: 'ยังไม่นับรวม/ไม่ต้องพูดถึง' },
        { term: 'residential building sites', th: 'ไซต์ก่อสร้างบ้านพักอาศัย' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายขั้นตอนแรกในการป้องกันอุบัติเหตุ

เพื่อป้องกันการบาดเจ็บแบบนี้ (In order to prevent such injuries) ควรมีการประเมินความเสี่ยง (a hazard assessment) สำหรับงานบนหลังคาทุกงาน เพื่อประเมินอันตรายที่อาจเกิดขึ้น (assess potential dangers) และย้ำว่าสำคัญมาก (essential) ที่ต้องระบุอันตรายให้ได้ก่อนเริ่มงาน (identified before the work starts) พร้อมจัดเตรียมอุปกรณ์ที่จำเป็น มาตรการป้องกันที่เหมาะสม และระบบการทำงาน (the necessary equipment, appropriate precautions and systems of work)

การระบุอันตราย (Hazard identification) ควรทำซ้ำเป็นระยะ (repeated periodically) หรือเมื่อสภาพแวดล้อมเปลี่ยนไป เช่น สภาพอากาศ หรือจำนวนคนงานในไซต์ (a change in conditions, for example, the weather or numbers of staff onsite)

สรุปใจความ: ต้องประเมินความเสี่ยงก่อนเริ่มงานหลังคาทุกครั้ง และประเมินซ้ำเมื่อสภาพแวดล้อมเปลี่ยน`,
      vocab: [
        { term: 'hazard assessment', th: 'การประเมินความเสี่ยง' },
        { term: 'potential dangers', th: 'อันตรายที่อาจเกิดขึ้น' },
        { term: 'precautions', th: 'มาตรการป้องกัน' },
        { term: 'periodically', th: 'เป็นระยะๆ' }
      ]
    },
    3: {
      explanationTh:
        `ย่อหน้านี้อธิบายลำดับขั้นการป้องกันความเสี่ยงจากการตก (มีทั้งหมด 3 ระดับ เรียงจากดีที่สุดไปหาทางเลือกสุดท้าย)

ขั้นแรก (The first thing) คือพิจารณาว่าเป็นไปได้ไหมที่จะ "กำจัดอันตรายนี้ให้หมดไปเลย" (eliminate this hazard completely) เพื่อไม่ให้คนงานเสี่ยงต่อการตกเลย ซึ่งบางครั้งทำได้ตั้งแต่ขั้นตอนออกแบบ วางแผนก่อสร้าง หรือขั้นประมูลงาน (design, construction planning, and tendering stage)

ถ้ากำจัดความเสี่ยงไม่ได้ (If the possibility of a fall cannot be eliminated) ควรใช้ "ตัวป้องกันขอบ" (edge protection) เพื่อกันไม่ให้คนงานตกลงไป อาจใช้นั่งร้านที่มีอยู่แล้ว (existing scaffolding) เป็นตัวป้องกันขอบได้ ถ้าทำไม่ได้ (not practicable) ก็ควรใช้แท่นทำงานชั่วคราว (temporary work platforms) แทน

ในกรณีที่ป้องกันแบบนั้นไม่ได้เลย (In cases where such protection is not possible) ก็ต้องหาทางลดโอกาสที่จะเกิดอันตราย (minimise the likelihood of any harm resulting) เช่น ใช้ตาข่ายนิรภัยหรือระบบคล้ายกัน (safety nets and other similar systems) เพื่อลดโอกาสบาดเจ็บถ้าเกิดการตกขึ้นจริง

สรุปใจความ: ป้องกันการตกมี 3 ระดับ เรียงลำดับความสำคัญ: (1) กำจัดความเสี่ยงให้หมดไปตั้งแต่ต้น (2) ถ้าทำไม่ได้ ใช้ตัวป้องกันขอบ/นั่งร้าน/แท่นทำงาน (3) ถ้ายังทำไม่ได้อีก ก็ใช้ตาข่ายนิรภัยเพื่อลดความรุนแรงถ้าตกจริง`,
      vocab: [
        { term: 'eliminate this hazard completely', th: 'กำจัดอันตรายนี้ให้หมดไปโดยสิ้นเชิง' },
        { term: 'tendering stage', th: 'ขั้นตอนประมูลงาน' },
        { term: 'edge protection', th: 'ตัวป้องกันขอบ' },
        { term: 'scaffolding', th: 'นั่งร้าน' },
        { term: 'temporary work platforms', th: 'แท่นทำงานชั่วคราว' },
        { term: 'minimise the likelihood', th: 'ลดโอกาสที่จะเกิดขึ้น' }
      ]
    },
    4: {
      explanationTh:
        `ย่อหน้านี้พูดถึงกฎการใช้บันได

บันได (Ladders) ควรใช้เฉพาะงานบำรุงรักษาระยะสั้นเท่านั้น (only be employed for short-duration maintenance work) เช่น การแต้มสีซ่อม (touching up paint) คนที่ใช้บันไดต้องได้รับการฝึกอบรมและคำแนะนำ (should be trained and instructed) ในการเลือกและใช้บันไดอย่างปลอดภัย (the selection and safe use of ladders) และต้องมีการตรวจสอบบันไดทุกอันเป็นประจำ (inspection of all ladders on a regular basis) เพื่อให้แน่ใจว่ายังปลอดภัยต่อการใช้งาน

สรุปใจความ: บันไดใช้ได้แค่งานเล็กๆ ระยะสั้น ผู้ใช้ต้องผ่านการฝึกอบรม และบันไดต้องถูกตรวจสอบสม่ำเสมอ`,
      vocab: [
        { term: 'short-duration maintenance work', th: 'งานบำรุงรักษาระยะสั้น' },
        { term: 'touching up paint', th: 'การแต้มสีซ่อมเล็กน้อย' },
        { term: 'trained and instructed', th: 'ผ่านการฝึกอบรมและได้รับคำแนะนำ' },
        { term: 'inspection on a regular basis', th: 'การตรวจสอบเป็นประจำสม่ำเสมอ' }
      ]
    }
  },
  "gt-reading-full-test01#p4": {
    0: {
      explanationTh:
        `ย่อหน้านี้เป็นคำนำของหัวข้อ "Maternity Allowance for working women" (เงินช่วยเหลือค่าคลอดบุตรสำหรับผู้หญิงทำงาน)

คุณสามารถยื่นขอ Maternity Allowance ได้เมื่อตั้งครรภ์ครบ 26 สัปดาห์ (once you've been pregnant for 26 weeks) การจ่ายเงินจะเริ่มก่อนวันครบกำหนดคลอด 11 สัปดาห์ (Payments start 11 weeks before the date on which your baby is due) และจำนวนเงินที่ได้ขึ้นอยู่กับคุณสมบัติของคุณ (depends on your eligibility)

สรุปใจความ: นี่คือคำนำสั้นๆ บอกว่าเงินช่วยเหลือนี้ขอได้เมื่อไหร่ เริ่มจ่ายเมื่อไหร่ และจำนวนขึ้นอยู่กับคุณสมบัติ (รายละเอียดอยู่ในย่อหน้าถัดไป)`,
      vocab: [
        { term: 'eligibility', th: 'คุณสมบัติที่เข้าเงื่อนไข' },
        { term: 'due date', th: 'วันครบกำหนดคลอด' }
      ]
    },
    1: {
      explanationTh:
        `ย่อหน้านี้อธิบายจำนวนเงินที่ได้รับ และเงื่อนไขของสิทธิ์แบบ "39 สัปดาห์"

คุณอาจได้รับเงินอย่างใดอย่างหนึ่งจาก 2 แบบ (You could get either):
1) £140.98 ต่อสัปดาห์ หรือ 90% ของรายได้เฉลี่ยต่อสัปดาห์ (90% of your average weekly earnings) — "แล้วแต่ว่าอันไหนน้อยกว่า" (whichever is less) เป็นเวลา 39 สัปดาห์
2) £27 ต่อสัปดาห์ เป็นเวลา 14 สัปดาห์

สำหรับสิทธิ์แบบ 39 สัปดาห์ คุณอาจได้รับถ้าเข้าเงื่อนไขข้อใดข้อหนึ่งต่อไปนี้: เป็นลูกจ้าง (you're employed) หรือประกอบอาชีพอิสระและจ่ายประกันสังคมประเภท Class 2 (self-employed and pay Class 2 National Insurance รวมถึงแบบสมัครใจ) หรือเพิ่งหยุดทำงานมา (recently stopped working)

ย่อหน้าย้ำว่าคุณอาจยังมีสิทธิ์แม้เพิ่งหยุดงานมา (You may still qualify even if you've recently stopped working) และไม่สำคัญว่าคุณเคยทำงานหลายที่ หรือมีช่วงว่างงาน (It doesn't matter if you had different jobs, or periods when you were unemployed)

สรุปใจความ: สิทธิ์แบบ 39 สัปดาห์ให้เงินมากกว่า (£140.98/สัปดาห์ หรือ 90% ของรายได้ แล้วแต่อันไหนน้อยกว่า) และครอบคลุมทั้งลูกจ้าง คนทำงานอิสระ หรือคนที่เพิ่งหยุดงาน`,
      vocab: [
        { term: 'whichever is less', th: 'แล้วแต่ว่าอันไหนน้อยกว่า' },
        { term: 'self-employed', th: 'ประกอบอาชีพอิสระ' },
        { term: 'National Insurance', th: 'ประกันสังคมของอังกฤษ' },
        { term: 'recently stopped working', th: 'เพิ่งหยุดทำงานมาไม่นาน' },
        { term: 'qualify', th: 'มีคุณสมบัติเข้าเงื่อนไข' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายเงื่อนไขสิทธิ์แบบ "14 สัปดาห์" และวิธียื่นขอ

สิทธิ์แบบ 14 สัปดาห์ อาจได้รับถ้า "อย่างน้อย 26 สัปดาห์" ใน 66 สัปดาห์ก่อนวันครบกำหนดคลอด (for at least 26 weeks in the 66 weeks before your baby is due) คุณเข้าเงื่อนไขต่อไปนี้: แต่งงานหรือจดทะเบียนคู่ชีวิต (married or in a civil partnership) และไม่ได้เป็นลูกจ้างหรือทำงานอิสระ (not employed or self-employed) แต่มีส่วนร่วมในธุรกิจของคู่สมรส/คู่ชีวิตที่ทำงานอิสระ (took part in the business of your self-employed spouse or civil partner)

ส่วน "How to claim" (วิธียื่นขอ): ต้องใช้แบบฟอร์ม MA1 (an MA1 claim form) ซึ่งหาได้ทางออนไลน์ พิมพ์มากรอกเอง หรือกรอกออนไลน์ก็ได้ ต้องแนบสลิปเงินเดือน หรือใบรับรองยกเว้นรายได้น้อย (a Certificate of Small Earnings Exemption) เป็นหลักฐานรายได้ และหลักฐานวันครบกำหนดคลอด เช่น จดหมายจากแพทย์ (a doctor's letter)

จะได้รับคำตัดสิน (a decision) ภายใน 24 วันทำการ (within 24 working days) และควรแจ้งการเปลี่ยนแปลงสถานการณ์ของคุณ เช่น ถ้ากลับไปทำงาน (if you go back to work) ให้ Jobcentre Plus ในพื้นที่ทราบ เพราะอาจกระทบจำนวนเงินที่ได้รับ

สรุปใจความ: สิทธิ์แบบ 14 สัปดาห์เหมาะกับคู่สมรสที่ช่วยงานธุรกิจของอีกฝ่าย ส่วนการยื่นขอต้องใช้แบบฟอร์ม MA1 พร้อมหลักฐานรายได้และวันคลอด และต้องแจ้งความเปลี่ยนแปลงให้หน่วยงานทราบเสมอ`,
      vocab: [
        { term: 'civil partnership', th: 'การจดทะเบียนคู่ชีวิต' },
        { term: 'self-employed spouse', th: 'คู่สมรสที่ประกอบอาชีพอิสระ' },
        { term: 'MA1 claim form', th: 'แบบฟอร์มยื่นขอ MA1' },
        { term: 'Certificate of Small Earnings Exemption', th: 'ใบรับรองการยกเว้นสำหรับรายได้น้อย' },
        { term: 'decision within 24 working days', th: 'ผลการพิจารณาภายใน 24 วันทำการ' }
      ]
    }
  },
  "gt-reading-full-test01#p5": {
    0: {
      explanationTh:
        `ย่อหน้านี้เป็นหัวเรื่องและคำนำของบทความ

หัวเรื่อง "The California Gold Rush of 1849" (ยุคตื่นทองแคลิฟอร์เนีย ปี 1849) ตามด้วยประโยคเกริ่นว่า การค้นพบทองคำใน Sacramento Valley จุดชนวนให้เกิดยุคตื่นทอง (sparked the Gold Rush) ซึ่งอาจเป็น (arguably) หนึ่งในเหตุการณ์ที่สำคัญที่สุดที่หล่อหลอมประวัติศาสตร์อเมริกาในศตวรรษที่ 19 (one of the most significant events to shape American history in the 19th century)

สรุปใจความ: นี่คือคำนำสั้นๆ บอกว่าการพบทองคำในแคลิฟอร์เนียนำไปสู่เหตุการณ์สำคัญที่สุดเหตุการณ์หนึ่งในประวัติศาสตร์อเมริกา`,
      vocab: [
        { term: 'sparked', th: 'จุดชนวน ก่อให้เกิด' },
        { term: 'arguably', th: 'อาจกล่าวได้ว่า' },
        { term: 'significant events', th: 'เหตุการณ์สำคัญ' },
        { term: 'to shape', th: 'หล่อหลอม กำหนดทิศทาง' }
      ]
    },
    1: { explanationTh: `นี่คือตัวอักษร "A" ป้ายกำกับย่อหน้าแรกของบทความ` },
    2: {
      explanationTh:
        `ย่อหน้า A เล่าถึงจุดเริ่มต้นของการค้นพบทองคำ

วันที่ 24 มกราคม 1848 James Wilson Marshall ช่างไม้ (a carpenter) พบเศษทองคำชิ้นเล็กๆ (small flakes of gold) ในแม่น้ำ American River ใกล้ Coloma รัฐแคลิฟอร์เนีย ตอนนั้น Marshall กำลังสร้างโรงเลื่อยพลังน้ำ (a water-powered sawmill) ให้กับนักธุรกิจ John Sutter

บังเอิญว่า (As it happens) หลังจาก Marshall ค้นพบทองคำไม่กี่วัน สนธิสัญญา Guadalupe Hidalgo ก็ถูกลงนาม (was signed) ยุติสงครามเม็กซิกัน-อเมริกัน (ending the Mexican-American War) และโอนแคลิฟอร์เนียพร้อมแหล่งแร่ธาตุของมัน ให้เป็นของสหรัฐอเมริกา (transferring California, with its mineral deposits, into the ownership of the United States)

ตอนนั้นประชากรในดินแดนนี้ (the population of the territory) ประกอบด้วย: ชาว Californios (คนเชื้อสายสเปนหรือเม็กซิกัน) 6,500 คน ชาวต่างชาติ (foreigners) ส่วนใหญ่เป็นชาวอเมริกัน 700 คน และชนพื้นเมืองอเมริกัน (Native Americans) 150,000 คน

สรุปใจความ: การพบทองคำเกิดขึ้นเกือบพร้อมกับการที่แคลิฟอร์เนียกลายเป็นดินแดนของสหรัฐฯ โดยตอนนั้นประชากรส่วนใหญ่ยังเป็นชนพื้นเมืองอเมริกัน`,
      vocab: [
        { term: 'sawmill', th: 'โรงเลื่อยไม้' },
        { term: 'as it happens', th: 'บังเอิญว่า/เหตุการณ์ที่เกิดขึ้นพอดี' },
        { term: 'Mexican-American War', th: 'สงครามเม็กซิกัน-อเมริกัน' },
        { term: 'mineral deposits', th: 'แหล่งแร่ธาตุ' },
        { term: 'territory', th: 'ดินแดน อาณาเขต' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    4: {
      explanationTh:
        `ย่อหน้า B เล่าว่าข่าวการพบทองคำแพร่กระจายอย่างไร

แม้ Marshall และ Sutter จะพยายามปิดข่าวการค้นพบไว้ (tried to keep news of the discovery quiet) แต่ข่าวก็หลุดออกไป (word got out) และภายในกลางเดือนมีนาคม 1848 มีหนังสือพิมพ์อย่างน้อยหนึ่งฉบับรายงานว่าพบทองคำจำนวนมาก

แม้ปฏิกิริยาแรกในซานฟรานซิสโกจะเป็นความไม่เชื่อ (disbelief) แต่พ่อค้าร้านขายของชื่อ Sam Brannan ก็ "จุดกระแสคลั่งไคล้" (set off a frenzy) เมื่อเขาเดินโชว์ขวดเล็กๆ ที่มีทองคำจาก Sutter's Creek ไปทั่วเมือง (paraded through town displaying a small bottle containing gold)

ภายในกลางเดือนมิถุนายน ประชากรชายราวสามในสี่ (some three-quarters) ของซานฟรานซิสโก ได้ออกจากเมืองไปยังเหมืองทองคำ และจำนวนคนงานเหมืองในพื้นที่นั้นเพิ่มถึง 4,000 คนภายในเดือนสิงหาคม

สรุปใจความ: ข่าวทองคำแพร่กระจายอย่างรวดเร็วจนทำให้คนซานฟรานซิสโกจำนวนมากทิ้งเมืองไปขุดทอง ภายในไม่กี่เดือน`,
      vocab: [
        { term: 'keep quiet', th: 'ปิดข่าวไว้ไม่ให้แพร่' },
        { term: 'word got out', th: 'ข่าวหลุดออกไป' },
        { term: 'disbelief', th: 'ความไม่เชื่อ' },
        { term: 'set off a frenzy', th: 'จุดกระแสความคลั่งไคล้' },
        { term: 'paraded through town', th: 'เดินโชว์ไปทั่วเมือง' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "C" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    6: {
      explanationTh:
        `ย่อหน้า C เล่าถึงการอพยพของผู้คนจากทั่วโลกมายังแคลิฟอร์เนีย

กลุ่มแรกที่มาถึง (the first migrants to arrive) คือคนจากดินแดนที่เข้าถึงได้ทางเรือ (accessible by boat) เช่น Oregon, หมู่เกาะแซนด์วิช (ปัจจุบันคือฮาวาย), เม็กซิโก, ชิลี, เปรู และแม้แต่จีน ข่าวไปถึงชายฝั่งตะวันออกทีหลัง (Only later would the news reach the East Coast) ซึ่งตอนแรกสื่อยังไม่เชื่อ (press reports were initially skeptical)

ตลอดปี 1849 ผู้คนหลายพันคนทั่วสหรัฐฯ (ส่วนใหญ่เป็นผู้ชาย) ยืมเงิน จำนองทรัพย์สิน หรือทุ่มเงินเก็บทั้งชีวิต (borrowed money, mortgaged their property or spent their life savings) เพื่อเดินทางอันแสนยากลำบาก (the arduous journey) ไปแคลิฟอร์เนีย พวกเขาทิ้งครอบครัวและถิ่นฐาน (left their families and local areas) เพื่อไล่ตามความมั่งคั่งที่ไม่เคยฝันถึง — ส่วนภรรยาที่อยู่ข้างหลังก็ไม่มีทางเลือกอื่นนอกจากต้องรับผิดชอบหน้าที่ต่างๆ แทน (had no option but to shoulder different responsibilities) เช่น บริหารฟาร์มหรือธุรกิจ และหลายคนก็ทำได้สำเร็จอย่างแท้จริง (many made a real success of them)

ภายในสิ้นปีนั้น ประชากรที่ไม่ใช่ชนพื้นเมือง (the non-native population) ของแคลิฟอร์เนียมีประมาณ 100,000 คน (เทียบกับ 20,000 คนปลายปี 1848 และประมาณ 800 คนในเดือนมีนาคม 1848) เพื่อรองรับความต้องการของนักขุดทอง หรือที่เรียกว่า '49ers เมืองต่างๆ ผุดขึ้นทั่วภูมิภาค พร้อมร้านค้าและธุรกิจที่พยายามทำกำไรจากยุคตื่นทองด้วยตัวเอง สภาพที่แออัดวุ่นวายของแคมป์เหมืองและเมือง (The overcrowded chaos) ก็ยิ่งไร้ระเบียบมากขึ้น (grew ever more lawless) ส่วนซานฟรานซิสโกก็พัฒนาเศรษฐกิจที่คึกคัก (a bustling economy) และกลายเป็นมหานครศูนย์กลางของพรมแดนใหม่นี้ (the central metropolis of the new frontier)

สรุปใจความ: ข่าวทองคำดึงดูดผู้คนจากทั่วโลก โดยเฉพาะปี 1849 มีคนอเมริกันจำนวนมากทิ้งทุกอย่างมาขุดทอง ทำให้เมืองต่างๆ ผุดขึ้นอย่างรวดเร็วแต่ก็วุ่นวายและไร้ระเบียบไปด้วย`,
      vocab: [
        { term: 'arduous journey', th: 'การเดินทางที่แสนยากลำบาก' },
        { term: 'mortgaged their property', th: 'จำนองทรัพย์สินของตัวเอง' },
        { term: 'shoulder different responsibilities', th: 'แบกรับหน้าที่ความรับผิดชอบต่างๆ แทน' },
        { term: 'overcrowded chaos', th: 'สภาพวุ่นวายแออัด' },
        { term: 'lawless', th: 'ไร้ระเบียบ ไร้กฎหมาย' },
        { term: 'bustling economy', th: 'เศรษฐกิจที่คึกคัก' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    8: {
      explanationTh:
        `ย่อหน้า D อธิบายวิธีหาทองแบบแรก คือ "การร่อนทอง" (Panning)

คำถามเปิดคือ "คนที่อยากเป็นนักขุดทองเหล่านี้ค้นหาทองคำกันยังไง" (How did all these would-be miners search for gold?) แล้วตอบว่าการร่อนทอง (Panning) เป็นวิธีเก่าแก่ที่สุด (the oldest way)

ขั้นตอนพื้นฐาน (The basic procedure) คือใส่วัสดุที่มีทองคำปน เช่น กรวดจากแม่น้ำ (river gravel) ลงในกระทะตื้นๆ (a shallow pan) เติมน้ำ แล้วค่อยๆ หมุนส่ายผสม (carefully swirl the mixture) ให้น้ำและวัสดุเบาหกออกไปด้านข้าง (spilled over the side) ถ้าทำถูกต้อง (If all went well) เศษทองคำหรือฝุ่นทองที่หนักกว่าจะตกลงไปที่ก้นกระทะ (settle to the bottom of the pan)

การร่อนทองเป็นวิธีที่ช้ามาก (was slow) แม้แต่นักขุดที่เชี่ยวชาญที่สุด (the most skillful miner) ในวันที่ดี (On a good day) นักขุดคนหนึ่งสามารถล้างกระทะได้ประมาณ 50 ใบในหนึ่งวันทำงาน 12 ชั่วโมง (the usual 12-hour workday)

สรุปใจความ: การร่อนทองคือวิธีหาทองแบบพื้นฐานที่สุด ใช้แค่กระทะกับน้ำ แต่ช้ามาก แม้แต่คนเก่งก็ทำได้แค่วันละ 50 กระทะ`,
      vocab: [
        { term: 'would-be miners', th: 'คนที่อยากเป็นนักขุดทอง' },
        { term: 'basic procedure', th: 'ขั้นตอนพื้นฐาน' },
        { term: 'shallow pan', th: 'กระทะตื้นๆ' },
        { term: 'swirl the mixture', th: 'หมุนส่ายส่วนผสม' },
        { term: 'settle to the bottom', th: 'ตกตะกอนลงก้นภาชนะ' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    10: {
      explanationTh:
        `ย่อหน้า E อธิบายวิธีหาทองแบบที่สอง เรียกว่า "rocker" (เครื่องโยกร่อนทอง)

Isaac Humphrey ได้รับการกล่าวขานว่าเป็นผู้แนะนำเครื่องนี้ (is said to have introduced it) เข้าสู่เหมืองทองในแคลิฟอร์เนีย มันเป็นกล่องไม้สี่เหลี่ยมผืนผ้าธรรมดา (a rectangular wooden box) ตั้งเอียงลง (set at a downward angle) และติดตั้งบนกลไกโยก (mounted on a rocking mechanism)

ดิน/หินจะถูกเทลงไปด้านบน (dumped into the top) ตามด้วยน้ำหนึ่งถัง กล่องจะถูกโยกด้วยมือ (rocked by hand) เพื่อเขย่าส่วนผสม (agitate the mixture) หินก้อนใหญ่จะถูกดักไว้ที่ตะแกรงด้านบน (caught in a sieve) ส่วนที่เหลือ (waste) จะไหลออกทางด้านล่างพร้อมน้ำ และทองคำที่หนักกว่าจะตกลงไปก้นกล่อง

ข้อดีของ rocker (The advantages) คือขนย้ายง่าย (easily transportable) ไม่ต้องมีแหล่งน้ำต่อเนื่อง (did not require a constant source of water) และที่สำคัญที่สุด (most importantly) นักขุดสามารถประมวลดิน/หินได้มากกว่าการใช้กระทะ ส่วนข้อเสียหลัก (The primary disadvantage) คือ rocker ดักจับอนุภาคทองคำที่เล็กมาก หรือที่เรียกว่า "flour" (ผงทองคำ) ได้ยาก

นักขุดบางคนใส่ปรอทเล็กน้อย (small amounts of mercury) ลงที่ก้น rocker เพราะองค์ประกอบทางเคมีของปรอท (Due to its chemical composition) ทำให้มันสามารถดักจับทองคำที่ละเอียดมากได้ (trap fine gold) เป็นระยะ นักขุดจะนำมันออกมาแล้วให้ความร้อน (remove and heat it) พอปรอทระเหย (As it vaporized) ก็จะเหลือทองคำไว้

สรุปใจความ: Rocker คือเครื่องโยกที่ประมวลดินได้มากกว่ากระทะและขนย้ายสะดวก แต่ดักฝุ่นทองละเอียดไม่ได้ดี บางคนจึงใช้ปรอทช่วยดักทองที่ละเอียดมาก`,
      vocab: [
        { term: 'rocking mechanism', th: 'กลไกโยก' },
        { term: 'agitate the mixture', th: 'เขย่าส่วนผสม' },
        { term: 'sieve', th: 'ตะแกรงกรอง' },
        { term: 'easily transportable', th: 'ขนย้ายได้ง่าย' },
        { term: 'primary disadvantage', th: 'ข้อเสียหลัก' },
        { term: 'mercury', th: 'ปรอท' },
        { term: 'vaporized', th: 'ระเหยกลายเป็นไอ' }
      ]
    },
    11: { explanationTh: `นี่คือตัวอักษร "F" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    12: {
      explanationTh:
        `ย่อหน้า F เล่าถึงช่วงที่การขุดทองเริ่มเปลี่ยนไป

หลังปี 1850 ทองคำบนพื้นผิว (the surface gold) ในแคลิฟอร์เนียเริ่มหายไปเกือบหมด (had largely disappeared) แม้จะยังมีนักขุดเดินทางมาเรื่อยๆ (even as miners continued to reach the gold fields) การขุดทองเป็นแรงงานที่ยากลำบากและอันตรายมาโดยตลอด (had always been difficult and dangerous labor) และการจะรวยได้ (striking it rich) ต้องอาศัยโชคดีพอๆ กับทักษะและความขยัน (required good luck as much as skill and hard work)

ยิ่งไปกว่านั้น (Moreover) ค่าแรงเฉลี่ยต่อวัน (the average daily pay) ของนักขุดอิสระตอนนั้นลดลงอย่างมาก (dropped sharply) จากช่วงปี 1848 เมื่อทองคำหายากขึ้นเรื่อยๆ อุตสาหกรรมการขุดที่เติบโตขึ้น (the growing industrialization of mining) ก็ผลักดันให้นักขุดจำนวนมากขึ้นเปลี่ยนจากการทำงานอิสระไปเป็นแรงงานรับจ้าง (from independence into wage labor) เทคนิคใหม่ที่เรียกว่า "hydraulic mining" (การขุดด้วยแรงดันน้ำ) ที่พัฒนาขึ้นในปี 1853 สร้างกำไรมหาศาล (brought enormous profits) แต่ก็ทำลายภูมิทัศน์ของพื้นที่ไปมาก (destroyed much of the region's landscape)

สรุปใจความ: หลังปี 1850 ทองคำหาง่ายเริ่มหมด นักขุดอิสระมีรายได้ลดลง จนต้องกลายเป็นแรงงานรับจ้าง ขณะที่เทคนิคใหม่อย่าง hydraulic mining ทำกำไรได้มากแต่ทำลายสิ่งแวดล้อม`,
      vocab: [
        { term: 'surface gold', th: 'ทองคำที่อยู่บนพื้นผิว หาง่าย' },
        { term: 'striking it rich', th: 'การขุดพบทองจนร่ำรวย' },
        { term: 'dropped sharply', th: 'ลดลงอย่างรวดเร็ว' },
        { term: 'industrialization', th: 'การพัฒนาสู่อุตสาหกรรม' },
        { term: 'wage labor', th: 'แรงงานรับจ้าง' },
        { term: 'hydraulic mining', th: 'การขุดด้วยแรงดันน้ำ' }
      ]
    },
    13: { explanationTh: `นี่คือตัวอักษร "G" ป้ายกำกับย่อหน้าสุดท้ายของบทความ` },
    14: {
      explanationTh:
        `ย่อหน้า G ปิดท้ายบทความด้วยตัวเลขสรุปช่วงท้ายของยุคตื่นทอง

แม้การขุดทองจะดำเนินต่อไปตลอดทศวรรษ 1850s (throughout the 1850s) แต่จุดสูงสุด (its peak) เกิดขึ้นในปี 1852 ซึ่งมีการขุดทองคำมูลค่าประมาณ 81 ล้านดอลลาร์ (gold worth some $81 million) ออกจากพื้นดิน

หลังจากปีนั้น ยอดรวมการขุดทอง (the total take) ก็ค่อยๆ ลดลง (declined gradually) จนคงที่ (leveling off) อยู่ที่ประมาณ 45 ล้านดอลลาร์ต่อปีในปี 1857 อย่างไรก็ตาม การตั้งถิ่นฐานในแคลิฟอร์เนีย (Settlement in California) ยังคงดำเนินต่อไป และภายในสิ้นทศวรรษนั้น ประชากรของรัฐมีถึง 380,000 คน

สรุปใจความ: การขุดทองพุ่งสูงสุดในปี 1852 แล้วค่อยๆ ลดลง แต่คนก็ยังคงย้ายเข้ามาตั้งถิ่นฐานในแคลิฟอร์เนียต่อไปเรื่อยๆ จนประชากรเพิ่มขึ้นมาก`,
      vocab: [
        { term: 'peak', th: 'จุดสูงสุด' },
        { term: 'declined gradually', th: 'ค่อยๆ ลดลง' },
        { term: 'leveling off', th: 'คงที่ ไม่ขึ้นไม่ลงมาก' },
        { term: 'settlement', th: 'การตั้งถิ่นฐาน' }
      ]
    }
  },
  "gt-reading-full-test02#p1": {
    0: {
      explanationTh:
        `ย่อหน้านี้เป็นคำโฆษณาแนะนำบริษัท Harvey's Storage

Harvey's Storage เป็นบริษัทอิสระที่มีชื่อเสียงมั่นคง (a well-established independent company) ตั้งอยู่ใจกลางเมือง (centrally located) และมีสิ่งอำนวยความสะดวกที่ดีเยี่ยม (excellent facilities) สำหรับความต้องการเก็บของทุกแบบ

บริษัทมีตู้เก็บของที่ปลอดภัยทั้งแบบระยะยาวและระยะสั้น (safe and secure units for both long- and short-term storage) ขึ้นอยู่กับความต้องการของลูกค้า ค่าบริการแข่งขันได้ (competitive) และปรับให้เหมาะกับความต้องการเฉพาะและขนาดตู้ที่คุณเลือก

กุญแจและล็อกคุณภาพสูง (Heavy-duty locks and keys) มอบให้ลูกค้าทุกคนฟรีโดยรวมอยู่ในราคาแล้ว (included in the prices listed) คุณสามารถเช่าตู้ตามขนาดความจุที่ต้องการ ตามระยะเวลาที่ต้องการ ในสภาพแวดล้อมที่ปลอดภัยมั่นคง มีกล้องวงจรปิดตรวจตราตลอด (monitored by CCTV)

ด้วยการเข้าถึงได้ตลอด 24 ชั่วโมง (With 24-hour access) ลูกค้าสามารถนำของมาส่งหรือมารับได้ตามสะดวก โดยไม่ถูกจำกัดด้วยเวลาทำการ (unrestricted by business or office hours) ถนนลาดยาง (Tarmac roadways) ทำให้ลูกค้าจอดรถยนต์หรือรถบรรทุกได้ทันทีนอกตู้ของตัวเอง ช่วยลดความยุ่งยากในการขนของขึ้นลง (minimising the effort required to collect or drop items off)

สรุปใจความ: Harvey's Storage เสนอตู้เก็บของที่ปลอดภัย ราคายืดหยุ่น เข้าถึงได้ 24 ชั่วโมง พร้อมที่จอดรถสะดวกติดตู้`,
      vocab: [
        { term: 'well-established', th: 'ก่อตั้งมานาน มั่นคง เชื่อถือได้' },
        { term: 'competitive rates', th: 'ราคาที่แข่งขันได้' },
        { term: 'heavy-duty locks', th: 'กุญแจ/ล็อกที่แข็งแรงทนทานสูง' },
        { term: 'monitored by CCTV', th: 'มีกล้องวงจรปิดคอยตรวจตรา' },
        { term: '24-hour access', th: 'เข้าถึงได้ตลอด 24 ชั่วโมง' },
        { term: 'tarmac roadways', th: 'ถนนลาดยาง' }
      ]
    },
    1: {
      explanationTh:
        `ย่อหน้านี้พูดถึงบริการเก็บของสำหรับ "ครัวเรือน" และ "นักศึกษา" (สังเกตว่ามีข้อความแปลกๆ อย่าง "LIVE An error occurred..." แทรกอยู่กลางย่อหน้า — นั่นเป็นเศษข้อความของวิดีโอโฆษณาที่โหลดไม่ขึ้นบนหน้าเว็บต้นฉบับ ไม่ใช่เนื้อหาที่ต้องอ่านหรือทำความเข้าใจ ให้ข้ามผ่านไปได้เลย)

หัวข้อ "Household storage" (เก็บของใช้ในบ้าน): การเก็บของแบบ self-storage เหมาะมาก (ideal) สำหรับครอบครัวหรือบุคคลที่มีความต้องการเก็บของ ทั้งระยะสั้นและระยะยาว ลูกค้าบางคนกำลัง "เคลียร์ของ" (de-cluttering) บางคนกำลังทำการรีโนเวทบ้าน (getting their property decorated) หรือวางแผนจะไปต่างประเทศชั่วคราว (planning to go abroad for a time)

หัวข้อ "Student storage" (เก็บของสำหรับนักศึกษา): คุณอาจกำลังเดินทาง หรือกลับบ้านไปหาครอบครัวและเพื่อนช่วงปิดเทอม (in the vacation) หรือต้องการเวลาหาที่พักใหม่ คุณอาจอยากเก็บหนังสือและของใช้ส่วนตัวทั้งหมด หรือแค่กล่องไม่กี่กล่องหรือเครื่องดนตรีชิ้นหนึ่งก็ได้ บริษัทเสนอราคาที่ตรงไปตรงมาและแข่งขันได้ (no-nonsense competitive pricing) พร้อมระยะเวลาเช่าที่ยืดหยุ่น (flexible hire periods) และไม่มีค่าใช้จ่ายแอบแฝง (no hidden extras) — ลูกค้าต้องจัดการเรื่องการขนส่งเอง (You are responsible for organising transport) แต่บริษัทสามารถแนะนำบริษัทรถตู้และคนขับท้องถิ่นให้ได้

สรุปใจความ: บริการนี้เหมาะสำหรับครัวเรือนที่กำลังเคลียร์บ้าน/รีโนเวท/ไปต่างประเทศ และนักศึกษาที่ต้องการเก็บของช่วงปิดเทอม ราคาชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง แต่ต้องจัดการขนส่งเอง`,
      vocab: [
        { term: 'de-cluttering', th: 'การเคลียร์/จัดของทิ้งให้บ้านโล่ง' },
        { term: 'getting their property decorated', th: 'กำลังตกแต่ง/รีโนเวทบ้าน' },
        { term: 'no-nonsense competitive pricing', th: 'ราคาที่ตรงไปตรงมาและแข่งขันได้' },
        { term: 'hidden extras', th: 'ค่าใช้จ่ายแอบแฝง' },
        { term: 'responsible for organising transport', th: 'ต้องจัดการเรื่องการขนส่งเอง' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้พูดถึงบริการเก็บของสำหรับ "ธุรกิจ" (Business storage)

ใจความ: ปลดปล่อยพื้นที่ขายปลีกราคาแพง (Free up your expensive retail space) ด้วยบริการ self-storage ที่ราคาย่อมเยา (affordable) บริษัทมีศูนย์เก็บของสำหรับธุรกิจ 3 แห่งให้เลือก (three different business storage centres) เพื่อให้คุณเลือกทำเลที่สะดวกที่สุดสำหรับคุณ

สรุปใจความ: ธุรกิจสามารถประหยัดพื้นที่หน้าร้านที่มีราคาแพงได้ ด้วยการย้ายของไปเก็บที่ศูนย์เก็บของราคาย่อมเยาแทน มีให้เลือก 3 สาขา`,
      vocab: [
        { term: 'free up', th: 'ปลดปล่อยให้ว่าง' },
        { term: 'expensive retail space', th: 'พื้นที่ขายปลีกที่มีราคาแพง' },
        { term: 'affordable', th: 'ราคาย่อมเยา จับต้องได้' }
      ]
    }
  },
  "gt-reading-full-test02#p2": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่อง "Local museums" (พิพิธภัณฑ์ท้องถิ่น) เป็นการเกริ่นว่าข้างล่างจะมีคำอธิบายพิพิธภัณฑ์หลายแห่งให้เปรียบเทียบ`
    },
    1: { explanationTh: `นี่คือตัวอักษร "A" ป้ายกำกับพิพิธภัณฑ์แห่งแรก ใช้จับคู่กับคำอธิบายในย่อหน้าถัดไป` },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายพิพิธภัณฑ์ A: Whittlesey Museum

พิพิธภัณฑ์ตั้งอยู่ใน Old Town Hall (ศาลากลางเก่า) ซึ่งเดิมสร้างขึ้นเพื่อเก็บรถดับเพลิงที่ลากด้วยม้า (originally built to house horse-drawn fire engines) มีทั้งหมด 8 ห้อง (eight rooms) และสิ่งจัดแสดง (exhibits) ครอบคลุมหัวข้อต่างๆ เช่น ภาพถ่ายเก่า (archive photographs) เครื่องแต่งกาย (costume) ชีวิตความเป็นอยู่ในบ้าน (domestic life) และคนดังท้องถิ่น (local celebrities)

สรุปใจความ: พิพิธภัณฑ์ A เดิมเป็นโรงเก็บรถดับเพลิง ปัจจุบันจัดแสดงประวัติศาสตร์ท้องถิ่นหลากหลายด้าน เช่น ภาพถ่าย เสื้อผ้า และชีวิตประจำวันในอดีต`,
      vocab: [
        { term: 'house horse-drawn fire engines', th: 'เก็บรถดับเพลิงที่ลากด้วยม้า' },
        { term: 'exhibits', th: 'สิ่งจัดแสดง' },
        { term: 'archive photographs', th: 'ภาพถ่ายเก่าที่เก็บสะสมไว้' },
        { term: 'domestic life', th: 'ชีวิตความเป็นอยู่ในบ้าน' },
        { term: 'local celebrities', th: 'คนดังท้องถิ่น' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับพิพิธภัณฑ์แห่งที่สอง ใช้จับคู่กับคำอธิบายในย่อหน้าถัดไป` },
    4: {
      explanationTh:
        `ย่อหน้านี้อธิบายพิพิธภัณฑ์ B: Octavia Hill's Birthplace House (บ้านเกิดของ Octavia Hill)

สร้างขึ้นในปี 1740 (Built in 1740) เป็นบ้านเกิดของ Octavia Hill นักปฏิรูปสังคมผู้บุกเบิก (pioneer social reformer) ที่มีบทบาทในช่วงปลายศตวรรษที่ 19 ถึงต้นศตวรรษที่ 20 ในด้านที่อยู่อาศัยเพื่อสังคม (social housing) ศิลปะ (the arts) รวมถึงประเด็นการอนุรักษ์ (conservation issues)

ผู้เข้าชม (Visitors) จะได้เดินชมแบบมีไกด์นำทาง (a guided tour) จากนั้นเป็นอิสระที่จะสำรวจสวนต่อเอง (are then free to explore the gardens)

สรุปใจความ: พิพิธภัณฑ์ B คือบ้านเกิดของนักปฏิรูปสังคมชื่อดัง มีทัวร์นำชมแล้วปล่อยให้เดินชมสวนเองได้`,
      vocab: [
        { term: 'pioneer social reformer', th: 'นักปฏิรูปสังคมผู้บุกเบิก' },
        { term: 'social housing', th: 'ที่อยู่อาศัยเพื่อสังคม' },
        { term: 'conservation issues', th: 'ประเด็นด้านการอนุรักษ์' },
        { term: 'guided tour', th: 'ทัวร์นำชมโดยมีไกด์' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "C" ป้ายกำกับพิพิธภัณฑ์แห่งที่สาม ใช้จับคู่กับคำอธิบายในย่อหน้าถัดไป` },
    6: {
      explanationTh:
        `ย่อหน้านี้อธิบายพิพิธภัณฑ์ C: Chatteris Museum

เมืองตลาดเก่า Chatteris (The old market town) ถูกสร้างขึ้นใหม่เป็นส่วนใหญ่ (was largely rebuilt) หลังจากเกิดไฟไหม้ครั้งใหญ่สองครั้งในปี 1706 และ 1864 ที่ทำลายอาคารเก่าแก่ของเมืองไปมาก (destroyed many of the town's ancient buildings)

สิ่งจัดแสดงของพิพิธภัณฑ์ (The museum's exhibits) แสดงให้เห็นแง่มุมดั้งเดิมของชีวิตเกษตรกรท้องถิ่น (traditional aspects of the life of local farmers) รวมถึงยุคเฟื่องฟูของทางรถไฟในศตวรรษที่ 19 (the railway boom of the 19th century) พิพิธภัณฑ์มีตู้จอสัมผัส (a touch-screen kiosk) ที่บรรจุภาพถ่ายและข้อความประวัติศาสตร์กว่า 9,000 ชิ้น ซึ่งสามารถขอสำเนา (reproductions) ได้ตามคำขอ

สรุปใจความ: พิพิธภัณฑ์ C เล่าประวัติเมืองที่เคยถูกไฟไหม้ใหญ่สองครั้ง เน้นชีวิตเกษตรกรและยุครถไฟ พร้อมระบบค้นภาพถ่ายเก่าผ่านตู้จอสัมผัส`,
      vocab: [
        { term: 'largely rebuilt', th: 'ถูกสร้างขึ้นใหม่เป็นส่วนใหญ่' },
        { term: 'ancient buildings', th: 'อาคารเก่าแก่' },
        { term: 'railway boom', th: 'ยุคเฟื่องฟูของทางรถไฟ' },
        { term: 'touch-screen kiosk', th: 'ตู้จอสัมผัส' },
        { term: 'reproductions on request', th: 'ขอสำเนาได้ตามคำขอ' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับพิพิธภัณฑ์แห่งที่สี่ ใช้จับคู่กับคำอธิบายในย่อหน้าถัดไป` },
    8: {
      explanationTh:
        `ย่อหน้านี้อธิบายพิพิธภัณฑ์ D: March and District Museum

ตั้งอยู่กลางเมืองตลาด March พิพิธภัณฑ์นี้ตั้งอยู่ในอาคารโรงเรียนเก่า (a former school) ที่สร้างขึ้นในปี 1851 คอลเลกชันที่หลากหลาย (Its wide-ranging collections) รวมถึงการจำลองห้องครัว ห้องนั่งเล่น และห้องเด็กอ่อนสมัยต้นศตวรรษที่ 20 (reconstructions of an early 20th-century kitchen, sitting room and nursery)

นอกจากนี้ยังมีการจัดแสดงกล้องถ่ายรูปและวิทยุเก่าที่น่าสนใจ (an interesting display of historic cameras and radios) และเหรียญที่มอบให้พนักงานขับรถไฟชื่อ Ben Gimbert สำหรับความกล้าหาญ (for his bravery) ในการป้องกันการสูญเสียชีวิต (preventing loss of life) เมื่อรถไฟที่บรรทุกวัตถุระเบิดเกิดไฟไหม้ในปี 1944

สรุปใจความ: พิพิธภัณฑ์ D อยู่ในอาคารโรงเรียนเก่า จัดแสดงห้องจำลองสมัยก่อน กล้อง/วิทยุเก่า และเหรียญเกียรติยศของวีรบุรุษรถไฟ`,
      vocab: [
        { term: 'former school', th: 'อาคารที่เคยเป็นโรงเรียน' },
        { term: 'wide-ranging collections', th: 'คอลเลกชันที่หลากหลาย' },
        { term: 'reconstructions', th: 'ห้องจำลองแบบเดิม' },
        { term: 'historic cameras and radios', th: 'กล้องและวิทยุเก่าในอดีต' },
        { term: 'bravery', th: 'ความกล้าหาญ' },
        { term: 'preventing loss of life', th: 'ป้องกันการสูญเสียชีวิต' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับพิพิธภัณฑ์แห่งสุดท้าย ใช้จับคู่กับคำอธิบายในย่อหน้าถัดไป` },
    10: {
      explanationTh:
        `ย่อหน้านี้อธิบายพิพิธภัณฑ์ E: Wisbech and Fenland Museum

พิพิธภัณฑ์นี้เป็น "อัญมณีจากศตวรรษที่ 19" (This 19th-century gem) ที่เก็บรวบรวมของสะสมจากทั่วโลก (collections from around the world) รวมถึงของจากอียิปต์โบราณ (Ancient Egypt)

ห้องสมุด (Its library) ซึ่งเปิดให้ประชาชนเข้าชมทุกวันเสาร์แรกของเดือน (open to the public on the first Saturday of each month) มีต้นฉบับลายมือ (the manuscript) ของนวนิยายเรื่อง Great Expectations โดยนักเขียนศตวรรษที่ 19 ชื่อ Charles Dickens และห้องค้นคว้า (the Research Room) สามารถจองเพื่อค้นข้อมูลประวัติศาสตร์ท้องถิ่นได้ (can be booked for researching local records)

สรุปใจความ: พิพิธภัณฑ์ E มีของสะสมจากทั่วโลกรวมถึงอียิปต์โบราณ และมีต้นฉบับลายมือของนิยายชื่อดังของ Charles Dickens เก็บไว้ในห้องสมุด`,
      vocab: [
        { term: 'gem', th: 'อัญมณี (ในที่นี้เปรียบพิพิธภัณฑ์ว่าเป็นของล้ำค่า)' },
        { term: 'manuscript', th: 'ต้นฉบับลายมือ' },
        { term: 'Research Room', th: 'ห้องค้นคว้าข้อมูล' },
        { term: 'booked for researching', th: 'จองไว้เพื่อค้นคว้าข้อมูล' }
      ]
    }
  },
  "gt-reading-full-test02#p3": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่อง "Workplace health and safety considerations for plumbers" (ข้อพิจารณาด้านสุขภาพและความปลอดภัยในที่ทำงานสำหรับช่างประปา)`
    },
    1: {
      explanationTh:
        `ย่อหน้านี้เป็นคำเกริ่นนำ

เหมือนอาชีพช่างอื่นๆ หลายอาชีพ (Like many trades) งานประปาอาจเป็นงานที่อันตราย (can be a dangerous job) จึงสำคัญมากที่ต้องใช้มาตรการที่เป็นไปได้อย่างสมเหตุสมผลทั้งหมด (take all reasonably practicable measure) เพื่อให้ทั้งลูกค้าและตัวเองปลอดภัยจากอุบัติเหตุและการบาดเจ็บ (keep customers and yourself incident and injury free)

สรุปใจความ: งานประปามีความเสี่ยง จึงต้องระวังป้องกันอย่างเต็มที่ทั้งเพื่อตัวเองและลูกค้า`,
      vocab: [
        { term: 'dangerous job', th: 'งานที่อันตราย' },
        { term: 'reasonably practicable measure', th: 'มาตรการที่เป็นไปได้อย่างสมเหตุสมผล' },
        { term: 'incident and injury free', th: 'ปลอดจากอุบัติเหตุและการบาดเจ็บ' }
      ]
    },
    2: {
      explanationTh:
        `นี่คือหัวข้อย่อย แปลว่า "ขยะอันตรายทางชีวภาพ" เป็นการเกริ่นหัวข้อที่จะพูดถึงในย่อหน้าถัดไป`
    },
    3: {
      explanationTh:
        `ย่อหน้านี้อธิบายความเสี่ยงจากขยะอันตรายทางชีวภาพ

ช่างประปาต้องสัมผัสกับขยะชีวภาพเป็นประจำ (regularly come into contact with biohazard waste) ซึ่งเป็น "ธรรมชาติของงาน" (the nature of the job) แต่นั่นไม่ได้แปลว่าควรชะล่าใจ (that doesn't mean you should be complacent)

จากข้อมูลของ Safe Work Australia โรคติดต่อ (communicable diseases) ที่เกิดจากการสัมผัสกับอันตรายทางชีวภาพในที่ทำงาน เช่น น้ำเสีย (sewage) มีการประเมินว่าคร่าชีวิตคนถึง 320,000 คนทั่วโลกทุกปี นอกจากนี้ (In addition to this) ช่างประปายังสัมผัสกับอันตรายชีวภาพอื่นๆ เป็นประจำ เช่น เชื้อรา แบคทีเรีย และสาหร่าย (mould, bacteria and algae)

ข้อความปิดท้ายเตือนว่า "อย่าเสี่ยง" (Don't risk it) ต้องแน่ใจว่าใช้เสื้อผ้าและอุปกรณ์ที่เหมาะสม (appropriate clothing and equipment)

สรุปใจความ: ขยะชีวภาพจากงานประปาเป็นอันตรายถึงชีวิตได้ในระดับโลก ช่างประปาจึงต้องใส่ชุดและอุปกรณ์ป้องกันที่เหมาะสมเสมอ ไม่ควรชะล่าใจ`,
      vocab: [
        { term: 'complacent', th: 'ชะล่าใจ นิ่งนอนใจ' },
        { term: 'communicable diseases', th: 'โรคติดต่อ' },
        { term: 'sewage', th: 'น้ำเสีย' },
        { term: 'mould/bacteria/algae', th: 'เชื้อรา/แบคทีเรีย/สาหร่าย' },
        { term: "don't risk it", th: 'อย่าเสี่ยงเรื่องนี้' }
      ]
    },
    4: {
      explanationTh:
        `นี่คือหัวข้อย่อย แปลว่า "พื้นที่อับอากาศ/พื้นที่จำกัด" เป็นการเกริ่นหัวข้อถัดไป`
    },
    5: {
      explanationTh:
        `ย่อหน้านี้อธิบายอันตรายจากการทำงานในพื้นที่อับอากาศ

ช่างประปาอาจใช้เวลาส่วนใหญ่ทำงานในพื้นที่จำกัด (confined spaces) ซึ่งเสี่ยงต่อสารปนเปื้อน (contaminants) รวมถึงแก๊ส ไอระเหย และฝุ่นในอากาศ (airborne gases, vapours and dusts) ที่อาจก่อให้เกิดอันตรายจากไฟไหม้หรือระเบิด (injury from fire or explosion) นอกจากนี้ยังอาจสัมผัสกับสารปนเปื้อนในอากาศที่มีความเข้มข้นสูง (high concentration of airborne contaminants) ที่เป็นอันตรายต่อสุขภาพ

ตัวอย่างที่ยกมา (For example) ช่างประปาคนหนึ่งถูกปรับเงิน 220,000 ดอลลาร์ หลังจากลูกจ้างของเขาได้รับพิษจากแก๊สคาร์บอนมอนอกไซด์ (suffered from carbon-monoxide poisoning) อันตรายอีกอย่างในพื้นที่อับอากาศคือการจมน้ำ (drowning) ถ้าแหล่งน้ำไม่ถูกตัดอย่างเพียงพอ (if water sources are not adequately cut off)

สรุปใจความ: การทำงานในพื้นที่อับอากาศเสี่ยงทั้งแก๊สพิษ ไฟไหม้/ระเบิด และจมน้ำ มีตัวอย่างจริงที่ช่างถูกปรับเงินหนักเพราะลูกจ้างได้รับพิษแก๊ส`,
      vocab: [
        { term: 'confined spaces', th: 'พื้นที่อับอากาศ/พื้นที่จำกัด' },
        { term: 'contaminants', th: 'สารปนเปื้อน' },
        { term: 'carbon-monoxide poisoning', th: 'การได้รับพิษจากแก๊สคาร์บอนมอนอกไซด์' },
        { term: 'drowning', th: 'การจมน้ำ' },
        { term: 'cut off', th: 'ตัดออก (ในที่นี้คือตัดแหล่งน้ำ)' }
      ]
    },
    6: {
      explanationTh:
        `ย่อหน้านี้แนะนำแหล่งข้อมูลเพิ่มเติม

จรรยาบรรณ/แนวปฏิบัติเรื่องพื้นที่อับอากาศของ Safe Work Australia (The Safe Work Australia confined spaces code of practice) ระบุขั้นตอนและข้อควรระวังที่จำเป็น (outlines the necessary steps and precautions) สำหรับป้องกันการเจ็บป่วยและบาดเจ็บ

สรุปใจความ: มีคู่มือแนวปฏิบัติอย่างเป็นทางการที่บอกขั้นตอนป้องกันอันตรายในพื้นที่อับอากาศโดยเฉพาะ`,
      vocab: [
        { term: 'code of practice', th: 'จรรยาบรรณ/แนวปฏิบัติที่เป็นทางการ' },
        { term: 'outlines', th: 'ระบุ/สรุปให้เห็นภาพรวม' }
      ]
    },
    7: {
      explanationTh:
        `นี่คือหัวข้อย่อย แปลว่า "ไฟฟ้า" เป็นการเกริ่นหัวข้อถัดไป`
    },
    8: {
      explanationTh:
        `ย่อหน้านี้อธิบายอันตรายจากไฟฟ้าในงานประปา

สมาคม Master Plumbers' Association เรียกไฟฟ้าว่าเป็น "นักฆ่าที่ซ่อนอยู่ของงานประปา" ('plumbing's hidden killer') เพราะท่อโลหะมักนำไฟฟ้าได้ (conductive) ดังนั้นถุงมือที่เป็นฉนวนกันไฟ (gloves which provide insulation) ควรเป็นส่วนหนึ่งของกล่องเครื่องมือช่างประปา (a plumber's tool kit) เช่นเดียวกับเครื่องวัดแรงดันไฟสำหรับงานประปา (a plumbing voltage monitor) และเครื่องวัดโวลต์ (a volt tester)

ถุงมือควรถูกตรวจสอบก่อนใช้งานทุกครั้ง (checked prior to every use) และเปลี่ยนใหม่ทุก 12-14 เดือน อุปกรณ์ไฟฟ้าอย่างตัวเชื่อมสะพานไฟ (bridging conductors) ควรถูกตรวจสอบเป็นประจำ พร้อมติดป้ายยืนยันความปลอดภัย (appropriate tags on the equipment to verify its safety) และถ้ามีสัญญาณของไฟฟ้าใดๆ (any sign of electricity) ต้องหยุดงานทันที (stopped immediately) เพื่อให้ช่างไฟฟ้าที่มีคุณสมบัติ (a qualified electrician) ตัดไฟก่อนจะทำงานต่อ

สรุปใจความ: ไฟฟ้าเป็นอันตรายที่ซ่อนอยู่ในงานประปาเพราะท่อโลหะนำไฟฟ้าได้ ต้องมีอุปกรณ์ป้องกันครบ ตรวจเช็คสม่ำเสมอ และหยุดงานทันทีถ้าพบสัญญาณไฟฟ้ารั่ว`,
      vocab: [
        { term: 'hidden killer', th: 'นักฆ่าที่ซ่อนอยู่ อันตรายที่มองไม่เห็น' },
        { term: 'conductive', th: 'นำไฟฟ้าได้' },
        { term: 'insulation', th: 'ฉนวนกันไฟ' },
        { term: 'voltage monitor', th: 'เครื่องวัดแรงดันไฟฟ้า' },
        { term: 'bridging conductors', th: 'ตัวเชื่อมสะพานไฟ' },
        { term: 'qualified electrician', th: 'ช่างไฟฟ้าที่มีคุณสมบัติ/ใบรับรอง' }
      ]
    }
  },
  "gt-reading-full-test02#p4": {
    0: {
      explanationTh:
        `นี่คือหัวเรื่อง "How to manage flexible working with your employees" (วิธีบริหารจัดการการทำงานแบบยืดหยุ่นกับพนักงานของคุณ)`
    },
    1: {
      explanationTh:
        `ย่อหน้านี้เป็นคำเกริ่นนำ

ปฏิเสธไม่ได้เลยว่า (There is no denying that) การทำงานแบบยืดหยุ่น (flexible working) เติบโตขึ้นอย่างมากในช่วงไม่กี่ปีที่ผ่านมา แต่ (however) มันก็ต้องการการบริหารจัดการอย่างระมัดระวัง (require careful management)

สรุปใจความ: การทำงานแบบยืดหยุ่นกำลังเป็นที่นิยม แต่การทำให้มันได้ผลจริงต้องอาศัยการบริหารที่ดี — บทความนี้จะแนะนำวิธีนั้น`,
      vocab: [
        { term: 'no denying', th: 'ปฏิเสธไม่ได้' },
        { term: 'flexible working', th: 'การทำงานแบบยืดหยุ่น' },
        { term: 'careful management', th: 'การบริหารจัดการอย่างระมัดระวัง' }
      ]
    },
    2: {
      explanationTh:
        `ย่อหน้านี้อธิบายหลักการแรกในการบริหารพนักงานทำงานยืดหยุ่น: "ความไว้วางใจ" (trust)

เมื่อจะเริ่มใช้ระบบทำงานยืดหยุ่น คำสำคัญคำเดียวคือ "trust" (ความไว้วางใจ) พนักงานทุกคนที่ทำงานแบบยืดหยุ่นควรได้รับความไว้วางใจ พร้อมเป้าหมายที่ชัดเจนตั้งแต่แรก (well-defined objectives from the start) และการประเมินผลงานควรดูจาก "ผลลัพธ์" (their output) ไม่ใช่ "เวลาที่ใช้ทำงาน" (as opposed to the time they spend on the job)

ผู้เขียนแนะนำว่าการเปลี่ยนแปลงแบบนี้อาจเป็น "ก้าวใหญ่" สำหรับธุรกิจ (a big step) ถ้ายังไม่ค่อยมั่นใจ (slightly cautious) แนะนำให้ตั้งการรีวิวช่วงท้ายวัน (an end-of-the-day review) เพื่อดูความคืบหน้า และเมื่อทุกฝ่ายเริ่มคุ้นเคยกับระบบใหม่ (As all parties find their feet with the new set-up) การติดต่อแบบนี้ก็ค่อยๆ ลดลงได้ (can slowly be reduced)

สรุปใจความ: หัวใจของการบริหารทีมทำงานยืดหยุ่นคือความไว้ใจ ประเมินจากผลงานไม่ใช่เวลาทำงาน และถ้ายังไม่มั่นใจก็เริ่มจากรีวิวประจำวันก่อนแล้วค่อยๆ ผ่อนลง`,
      vocab: [
        { term: 'trust', th: 'ความไว้วางใจ' },
        { term: 'well-defined objectives', th: 'เป้าหมายที่ชัดเจนตั้งแต่แรก' },
        { term: 'output', th: 'ผลลัพธ์ของงาน' },
        { term: 'a big step', th: 'ก้าวที่ใหญ่/สำคัญ' },
        { term: 'find their feet', th: 'เริ่มคุ้นเคย/ปรับตัวได้' }
      ]
    },
    3: {
      explanationTh:
        `ย่อหน้านี้อธิบายหลักการที่สอง: การแชร์ปฏิทินและเทคโนโลยีเชื่อมต่อกัน

ผู้เขียนบอกว่า (In my eyes) สิ่งสำคัญอีกอย่างคือทุกคนควรเข้าถึงปฏิทินที่แชร์กัน (shared calendar access) เพื่อให้เห็นว่าเพื่อนร่วมงานอยู่ที่ไหนในแต่ละวัน ถ้าต้องการติดต่อใครก็วางแผนได้ (they can plan when to do so)

เทคโนโลยีปัจจุบันช่วยให้พนักงานติดต่อกับเพื่อนร่วมงานและพาร์ทเนอร์ภายนอกได้ ยกตัวอย่างเช่น iMeet ซึ่งเป็นเครื่องมือที่รองรับการทำงานร่วมกันทุกรูปแบบสำหรับการทำงานทางไกล (all forms of collaboration for remote working) ตั้งแต่การประชุมทางวิดีโอ แชทสด และแชร์ไฟล์ ไปจนถึงแชร์หน้าจอ (video conferencing, live chat and file sharing to screen sharing) พนักงานยุคใหม่ (The new breed of worker) จึงพร้อมทำงานได้อย่างมีประสิทธิภาพนอกออฟฟิศ และยังรู้สึกเหมือนอยู่ห้องเดียวกับคนอื่นได้เมื่อจำเป็น

สรุปใจความ: การแชร์ปฏิทินและใช้เครื่องมือสื่อสารอย่าง iMeet ช่วยให้พนักงานทำงานนอกออฟฟิศได้อย่างมีประสิทธิภาพ เหมือนยังอยู่ด้วยกัน`,
      vocab: [
        { term: 'shared calendar access', th: 'การเข้าถึงปฏิทินที่แชร์ร่วมกัน' },
        { term: 'collaboration', th: 'การทำงานร่วมกัน' },
        { term: 'remote working', th: 'การทำงานทางไกล' },
        { term: 'video conferencing', th: 'การประชุมทางวิดีโอ' },
        { term: 'the new breed of worker', th: 'พนักงานยุคใหม่' }
      ]
    },
    4: {
      explanationTh:
        `ย่อหน้านี้สรุปประโยชน์ของการทำงานแบบยืดหยุ่นจากประสบการณ์ผู้เขียน

จากประสบการณ์ของผู้เขียน (In my experience) พนักงานมักมีประสิทธิภาพมากขึ้นเมื่อทำงานที่บ้าน เพราะสามารถทำงานตามชั่วโมงที่ต้องการจริงๆ (the exact hours they want) และไม่ต้องรับมือกับสิ่งรบกวนจากพนักงานคนอื่น (distraction caused by other employees) การอยู่นอกกำแพงออฟฟิศ (Being outside the confines of the office walls) ยังดูเหมือนจะช่วยส่งเสริมความคิดสร้างสรรค์ (foster creativity) ด้วย

นอกจากนี้ (In addition) ทีมงานยังมีแรงจูงใจมากขึ้นเพราะมี work-life balance ที่ดีกว่า ในแง่ธุรกิจ สิ่งนี้ช่วยเรื่องการดึงดูดคนเก่ง (top talent recruitment) และการรักษาพนักงานไว้ (staff retention) และทีมงานที่มีความสุขก็เป็นทีมที่ประสบความสำเร็จมากกว่า (a happy workforce is a more successful one)

สรุปใจความ: การทำงานที่บ้านช่วยเพิ่มประสิทธิภาพ ความคิดสร้างสรรค์ และแรงจูงใจของพนักงาน ซึ่งส่งผลดีต่อธุรกิจทั้งเรื่องดึงดูดและรักษาคนเก่งไว้`,
      vocab: [
        { term: 'distraction', th: 'สิ่งรบกวนสมาธิ' },
        { term: 'confines of the office walls', th: 'ขอบเขต/กำแพงของออฟฟิศ' },
        { term: 'foster creativity', th: 'ส่งเสริมความคิดสร้างสรรค์' },
        { term: 'top talent recruitment', th: 'การดึงดูดคนเก่งเข้าทำงาน' },
        { term: 'staff retention', th: 'การรักษาพนักงานไว้กับองค์กร' }
      ]
    }
  },
  "gt-reading-full-test02#p5": {
    0: {
      explanationTh:
        `ย่อหน้านี้เป็นหัวเรื่องและคำนำของบทความ

หัวเรื่อง "Preventing the theft of turtle eggs" (การป้องกันการขโมยไข่เต่าทะเล) ตามด้วยประโยคเกริ่นว่านักอนุรักษ์และเจ้าหน้าที่บังคับใช้กฎหมาย (Conservationists and law enforcement) พยายามอย่างหนัก (have struggled) เพื่อป้องกันการค้าสัตว์ป่าผิดกฎหมาย (wildlife trafficking) แล้วตั้งคำถามชวนคิดว่า ไข่พลาสติกปลอมกับเครื่องติดตาม GPS จะเปลี่ยนเกมได้ไหม (could some plastic eggs and GPS trackers change the game?)

สรุปใจความ: นี่คือคำนำที่ตั้งคำถามว่าเทคโนโลยีอย่างไข่ปลอม+GPS จะช่วยแก้ปัญหาการลักลอบขโมยไข่เต่าได้หรือไม่ ซึ่งบทความจะอธิบายต่อไป`,
      vocab: [
        { term: 'wildlife trafficking', th: 'การค้าสัตว์ป่าผิดกฎหมาย' },
        { term: 'struggled', th: 'พยายามอย่างหนัก ต่อสู้กับปัญหา' },
        { term: 'change the game', th: 'เปลี่ยนสถานการณ์/พลิกเกม' }
      ]
    },
    1: { explanationTh: `นี่คือตัวอักษร "A" ป้ายกำกับย่อหน้าแรกของบทความ` },
    2: {
      explanationTh:
        `ย่อหน้า A อธิบายภาพรวมสถานการณ์เต่าทะเลทั่วโลก

มนุษย์กินไข่เต่าทะเล (และฆ่าเต่าโตเต็มวัยเพื่อเอาเนื้อ) มานานหลายพันปี (for millennia) แต่ (However) เมื่อประชากรมนุษย์เพิ่มขึ้นอย่างมาก (exploded) และเต่าทะเลเริ่มเผชิญภัยคุกคามเพิ่มเติม เช่น การประมงเข้มข้น การพัฒนาชายหาด และการเปลี่ยนแปลงสภาพภูมิอากาศ (intensive fishing, beach development and climate change) ประชากรเต่าทะเลก็ลดลงอย่างรวดเร็ว (declined precipitously)

ปัจจุบัน เต่าทะเลทั้ง 7 สายพันธุ์ในโลก มีเพียงหนึ่งเดียวที่ไม่ถูกจัดว่า "ถูกคุกคาม" (threatened) ตามบัญชีแดงของ IUCN ส่วนสายพันธุ์ที่เหลืออยู่นั้น — เต่าหลังแบน (the flatback turtle) — ถูกจัดอยู่ในสถานะ "ข้อมูลไม่เพียงพอ" (data deficient) ซึ่งหมายความว่านักวิทยาศาสตร์ยังไม่รู้แน่ชัดว่ามันเป็นอย่างไรบ้าง

สรุปใจความ: เต่าทะเลเกือบทุกสายพันธุ์ในโลกกำลังถูกคุกคามจากหลายปัจจัย มีเพียงสายพันธุ์เดียวที่ยังไม่มีข้อมูลเพียงพอจะบอกสถานะได้ชัด`,
      vocab: [
        { term: 'exploded', th: 'เพิ่มขึ้นอย่างรวดเร็วมาก' },
        { term: 'intensive fishing', th: 'การประมงเข้มข้น' },
        { term: 'declined precipitously', th: 'ลดลงอย่างรวดเร็วฉับพลัน' },
        { term: 'threatened', th: 'ถูกคุกคาม เสี่ยงสูญพันธุ์' },
        { term: 'data deficient', th: 'ข้อมูลไม่เพียงพอที่จะประเมิน' }
      ]
    },
    3: { explanationTh: `นี่คือตัวอักษร "B" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    4: {
      explanationTh:
        `ย่อหน้า B (ซึ่งในเนื้อหาต้นฉบับมีตัวอักษร "C" แทรกอยู่กลางย่อหน้าด้วย เพราะเนื้อหาของสองหัวข้อ B และ C ถูกรวมมาด้วยกันในย่อหน้าเดียวจากข้อมูลต้นทาง) อธิบายปัญหาการลักลอบขโมยไข่เต่าในนิการากัว

ปัญหาใหญ่ประการหนึ่ง (One major problem) คือทุกปีไข่เต่าทะเลหลายล้านฟองถูกโจรขโมยไปขายในตลาดมืดอย่างผิดกฎหมาย (illegally taken by poachers for sale on the black market) สถานการณ์รุนแรงเป็นพิเศษในนิการากัว ประเทศในอเมริกากลาง ซึ่งเป็นบ้านของเต่าทะเล 4 สายพันธุ์

Kim Williams-Guillen จากองค์กรอนุรักษ์ Paso Pacifico บรรยายการลักลอบขโมยรังเต่าบนชายหาดนิการากัวว่า "ควบคุมไม่ได้ ไร้การกำกับดูแล กว้างขวาง และเป็นที่โต้แย้ง" ('uncontrolled, unregulated, extensive and contested') แม้แต่ชายหาดที่ได้รับการปกป้องดีที่สุด (the best-protected beaches) ก็ยังถูกปล้นในระดับหนึ่ง (plundered to some extent) และไม่ใช่เรื่องแปลก (not uncommon) ที่จะเห็นโจรขุดรังไข่ห่างจากนักท่องเที่ยวที่กำลังดูเต่าวางไข่ตอนกลางคืนเพียงไม่กี่เมตร การขโมยนี้ยิ่งรุนแรงมากช่วง "arribadas" — เหตุการณ์ที่เต่านับพันตัววางไข่บนชายหาดเดียวกันในคืนเดียว เป็นกลยุทธ์ทางชีววิทยาเพื่อเอาชนะผู้ล่าตามธรรมชาติด้วยจำนวน (a biological strategy to overwhelm natural predators)

Williams-Guillen เล่าต่อว่า "แม้จะมีเจ้าหน้าที่ติดอาวุธ จำนวนโจรก็ยังมากกว่าเจ้าหน้าที่ทหารถึง 10-20 เท่า" และอธิบายว่าแม้โจรส่วนใหญ่จะเป็นคนท้องถิ่นที่มีทรัพยากรจำกัด (locals with limited resources) แต่ในช่วง arribadas จะมีกลุ่มโจรจากเมืองใหญ่ๆ นอกชุมชนหลั่งไหลเข้ามา (influxes of gangs of poachers from larger cities) ซึ่งไม่ใช่แค่ "คนจนท้องถิ่นที่ไม่มีทางเลือกอื่น" เท่านั้น

แต่เพื่อปกป้องเต่าทะเลของประเทศ Williams-Guillen บอกว่านักอนุรักษ์ไม่ควรพึ่งพาแค่การจับโจรระดับล่าง (low-level operators) เพียงอย่างเดียว เพราะ "ถ้าโจรคนหนึ่งเลิก ก็จะมีอีกคนมาแทนที่" — เราต้องรู้จักคนกลาง (middlemen) และคนที่อยู่สูงกว่าในสายการกระจายสินค้า (people higher up in the distribution chain) ให้มากขึ้น

สรุปใจความ: การลักลอบขโมยไข่เต่าในนิการากัวรุนแรงมากจนควบคุมไม่ได้ โดยเฉพาะช่วง arribadas ที่มีทั้งโจรท้องถิ่นและแก๊งจากเมืองใหญ่ นักอนุรักษ์เห็นว่าการแก้ปัญหาที่แท้จริงต้องไปถึงคนกลางและผู้อยู่เบื้องหลัง ไม่ใช่แค่จับโจรรายย่อย`,
      vocab: [
        { term: 'black market', th: 'ตลาดมืด' },
        { term: 'uncontrolled/unregulated/extensive/contested', th: 'ควบคุมไม่ได้/ไร้การกำกับดูแล/กว้างขวาง/เป็นที่โต้แย้ง' },
        { term: 'plundered', th: 'ถูกปล้น/ขโมยไป' },
        { term: 'arribadas', th: 'เหตุการณ์เต่านับพันวางไข่พร้อมกันในคืนเดียว' },
        { term: 'overwhelm natural predators', th: 'เอาชนะผู้ล่าตามธรรมชาติด้วยจำนวนที่มากกว่า' },
        { term: 'low-level operators', th: 'โจรระดับล่าง รายย่อย' },
        { term: 'middlemen', th: 'คนกลางในขบวนการ' },
        { term: 'distribution chain', th: 'สายการกระจายสินค้า' }
      ]
    },
    5: { explanationTh: `นี่คือตัวอักษร "D" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    6: {
      explanationTh:
        `ย่อหน้า D อธิบายทางแก้ปัญหาของ Paso Pacifico: ไข่เต่าปลอมไฮเทค

ทางแก้ของ Paso Pacifico คือการสร้าง "ไข่เต่าไฮเทค" (high-tech sea turtle eggs) — ไข่ปลอมที่ทำขึ้นอย่างแนบเนียนให้ดูเหมือนของจริง (convincingly crafted to look like the real thing) แต่ข้างในมีอุปกรณ์ติดตาม GPS ซ่อนอยู่ ซึ่งมีศักยภาพที่จะเปิดเผยตลาดปลายทาง (reveal the destination markets) ของไข่เต่าที่ถูกลักลอบขาย

การทำไข่เต่าปลอมให้ดูสมจริงไม่ใช่เรื่องง่าย (not easy) และ Paso Pacifico ยังอยู่ระหว่างพัฒนาต้นแบบให้สมบูรณ์แบบ (still working on perfecting a prototype) โดยเฉพาะการสร้างพื้นผิว/เนื้อสัมผัสที่ถูกต้อง (the right texture) เป็นเรื่องยากมาก (quite problematic) เพราะไข่เต่าทะเลไม่มีเปลือกแข็งเหมือนไข่นก แต่ค่อนข้างยืดหยุ่น (quite flexible)

Paso Pacifico จึงได้ดึงตัว Lauren Wilde ช่างเทคนิคพิเศษ (a special effects artist) จากสหรัฐฯ มาสร้างเปลือกไข่จำลองที่สมจริง ก่อนอื่น Wilde ต้องได้จับไข่จริง (get her hands on the real thing) แต่เนื่องจากการส่งไข่เต่าทะเลข้ามพรมแดนเป็นเรื่องผิดกฎหมาย (it's illegal to send sea turtle eggs over the border) Wilde จึงใช้ไข่เต่าบกจากแคลิฟอร์เนียแทน (land turtle eggs from California) เธอบอกว่า "การได้สัมผัสไข่พวกนี้และรู้ว่าเปลือกมันโค้งงอได้แค่ไหน สำคัญและเปิดหูเปิดตามาก" (really eye opening and important)

สำหรับการใส่อุปกรณ์ GPS เข้าไปในเปลือก Paso Pacifico ใช้เครื่องพิมพ์ 3 มิติ (3D printers) สร้างลูกบอลพลาสติกที่จะติดตั้งเครื่องส่งสัญญาณ GPS ไว้ข้างใน ซึ่งจะทำหน้าที่แทนตัวอ่อน (embryo) ในไข่จริง สุดท้ายเปลือกปลอมจะถูกปิดผนึกด้วยซิลิโคน (sealed with silicone) เพื่อกันน้ำ (waterproofing)

สรุปใจความ: Paso Pacifico กำลังพัฒนาไข่เต่าปลอมที่มี GPS ซ่อนอยู่ข้างในเพื่อตามรอยเส้นทางค้าไข่เต่าผิดกฎหมาย โดยใช้ผู้เชี่ยวชาญด้านเทคนิคพิเศษและเครื่องพิมพ์ 3 มิติเพื่อทำให้ไข่ปลอมดูและสัมผัสเหมือนของจริงที่สุด`,
      vocab: [
        { term: 'crafted to look like the real thing', th: 'สร้างให้ดูเหมือนของจริง' },
        { term: 'prototype', th: 'ต้นแบบ' },
        { term: 'special effects artist', th: 'ช่างเทคนิคพิเศษ (งานสร้างเอฟเฟกต์ในภาพยนตร์)' },
        { term: 'land turtle eggs', th: 'ไข่เต่าบก' },
        { term: 'embryo', th: 'ตัวอ่อนในไข่' },
        { term: 'sealed with silicone', th: 'ปิดผนึกด้วยซิลิโคน' }
      ]
    },
    7: { explanationTh: `นี่คือตัวอักษร "E" ป้ายกำกับย่อหน้าถัดไปของบทความ` },
    8: {
      explanationTh:
        `ย่อหน้า E อธิบายวิธีนำไข่ปลอมไปวางในรังจริง

โดยเฉลี่ยเต่าทะเลวางไข่ประมาณ 100 ฟองต่อรัง (Sea turtles on average lay around 100 eggs in a nest) เมื่อไข่ปลอมทำเสร็จแล้ว มันจะถูกสอดแทรกเข้าไปกับไข่จริง (slipped in with the real ones)

Williams-Guillen บอกว่าอาจเป็นไปได้ด้วยซ้ำที่จะแอบวางไข่ปลอมลงในรังขณะที่โจรกำลังขุดอยู่ (while poachers are at work) เพราะโจรมักระแวงนักท่องเที่ยว (Wary of tourists) จะถอยห่างเมื่อมีคนแปลกหน้าเข้ามาใกล้ แล้วค่อยกลับมาทำต่อเมื่อคนเหล่านั้นไปแล้ว เธอบอกว่า "คงจะง่ายมากที่จะทิ้งไข่ลงไปในความมืดในรังที่พวกเขากำลังขุดอยู่"

เมื่อโจรหยิบไข่ปลอมไปพร้อมกับไข่จริง นักอนุรักษ์และเจ้าหน้าที่บังคับใช้กฎหมายก็จะสามารถติดตามพวกเขาได้ ผู้เชี่ยวชาญเชื่อว่าไข่ที่ถูกขโมยส่วนใหญ่สุดท้ายจะถูกลักลอบออกนอกนิการากัว (make their way out of Nicaragua) อาจไปยังเอลซัลวาดอร์หรือกัวเตมาลา แต่ก็มีความกังวลที่เพิ่มขึ้นว่าไข่เต่าจากอเมริกากลางอาจกำลังมุ่งหน้าไปยังสหรัฐอเมริกา ก่อนถูกขายต่อไปยังประเทศอื่นๆ ทั่วโลก

สรุปใจความ: แผนคือแอบสอดไข่ปลอมไปกับไข่จริงในรัง แล้วใช้ GPS ตามรอยเมื่อโจรขโมยไปขาย เพื่อให้รู้ว่าไข่เต่าที่ถูกขโมยสุดท้ายไปสิ้นสุดที่ประเทศไหน`,
      vocab: [
        { term: 'slipped in with the real ones', th: 'ถูกสอดแทรกเข้าไปกับไข่จริง' },
        { term: 'wary of', th: 'ระแวดระวังต่อ' },
        { term: 'make their way out of', th: 'ถูกลักลอบส่งออกจาก...' },
        { term: 'growing concern', th: 'ความกังวลที่เพิ่มมากขึ้น' }
      ]
    },
    9: { explanationTh: `นี่คือตัวอักษร "F" ป้ายกำกับย่อหน้าสุดท้ายของบทความ` },
    10: {
      explanationTh:
        `ย่อหน้า F ปิดท้ายบทความด้วยแผนการในอนาคตของโครงการ

จนถึงตอนนี้ (To date) Paso Pacifico ยังไม่เคยนำไข่ปลอมแม้แต่ฟองเดียวไปวางในรังจริง (has yet to put a single fake egg in a nest) แต่ Williams-Guillen บอกว่าเธอไม่กังวลมากนักว่าการประชาสัมพันธ์โครงการนี้จะทำให้โจรเริ่มมองหาไข่ปลอม เพราะ "การลักลอบขโมยส่วนใหญ่เกิดขึ้นตอนกลางคืนอยู่แล้ว ทำให้แยกไข่ปลอมออกจากไข่จริงยากอยู่แล้ว และตอนนี้โจรกับคนกลางก็ยังไม่ได้ตรวจไข่อย่างละเอียด แต่รีบยัดใส่กระสอบให้เร็วที่สุด" ('shoving them into a sack as quickly as possible')

แน่นอนว่าในที่สุดโจรจะรู้ตัวว่ามีไข่ปลอมปนอยู่ (will eventually become aware) — โดยเฉพาะเมื่อลูกค้าลองกัดไข่แล้วฟันหักเพราะไปเจอเครื่องส่งสัญญาณ GPS แทน (break their teeth on the GPS transmitter) ดังนั้น Paso Pacifico จึงวางแผนจะปล่อยไข่ปลอมจำนวนมาก (a massive deployment) ให้ได้มากที่สุดเท่าที่จะทำได้ เพื่อเก็บข้อมูลให้ได้มากก่อนที่โจรจะรู้ทัน (before poachers get wise)

การรู้ว่าไข่ไปที่ไหนจะช่วยให้นักอนุรักษ์และเจ้าหน้าที่บังคับใช้กฎหมายมุ่งทรัพยากรไปยังจุดที่ถูกต้อง (focus their resources on the right places) ไม่ว่าจะผ่านแคมเปญสร้างความตระหนักรู้ (awareness-building campaigns) หรือการปราบปรามผู้ขายผิดกฎหมาย (crackdowns on illegal sellers) และในที่สุด Paso Pacifico หวังจะแบ่งปันเทคโนโลยีนี้ให้กับผู้สนใจทั่วโลก

สรุปใจความ: โครงการนี้ยังไม่เคยใช้งานจริงเลยสักครั้ง แต่ทีมงานมั่นใจว่ายังมีเวลาเก็บข้อมูลก่อนโจรจะรู้ทัน แผนสุดท้ายคือใช้ข้อมูลนี้ปราบปรามการค้าไข่เต่าอย่างตรงจุด และแบ่งปันเทคโนโลยีนี้ให้ทั่วโลกในอนาคต`,
      vocab: [
        { term: 'to date', th: 'จนถึงตอนนี้' },
        { term: 'shoving into a sack', th: 'ยัดใส่กระสอบอย่างรีบเร่ง' },
        { term: 'break their teeth on', th: 'ฟันหักเพราะกัดโดนสิ่งนั้น' },
        { term: 'massive deployment', th: 'การปล่อยใช้งานจำนวนมาก' },
        { term: 'get wise', th: 'รู้ทัน เท่าทัน' },
        { term: 'awareness-building campaigns', th: 'แคมเปญสร้างความตระหนักรู้' }
      ]
    }
  }
}
