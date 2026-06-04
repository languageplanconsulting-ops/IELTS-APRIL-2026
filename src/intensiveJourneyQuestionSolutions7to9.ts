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
      1: s('furniture construction industry|timber for building houses', 'making of furniture', 'ไม้ทำเฟอร์นิเจอร์'),
      2: s('reduced by boiling to produce a type of sugar', 'source of sugar', 'น้ำตาล'),
      3: s('particularly important in manufacturing ropes', 'used for ropes', 'เชือก'),
      4: s('charcoal, which is widely used in various industries', 'source of charcoal', 'ถ่าน'),
      5: s('used as bowls in many parts of Asia', 'when halved for bowls', 'ชาม'),
      6: s('provides the hormones which encourage other plants', 'source of hormones', 'ฮอร์โมน'),
      7: s('as well as in cosmetics', 'oil and milk for cosmetics', 'เครื่องสำอาง'),
      8: s('nitroglycerine-based invention: dynamite', 'ingredient in dynamite', 'ไดนาไมต์'),
      9: s('exposed to the full glare of the tropical sun, coconut seeds are able to germinate', 'need shade to germinate', 'ไม่ต้องการร่มเงา'),
      10: s('moved coconuts from South and Southeast Asia to Africa', 'transported to Asia from America', 'นำจากเอเชียไปอเมริกา ไม่ใช่กลับกัน'),
      11: s('origin of coconuts discovered along the west coast', 'different type west vs east coast', 'ไม่ได้เปรียบเทียบชนิด'),
      12: s('no relatives growing in the wild', 'all coconuts in Asia cultivated', 'ไม่มีพันธุ์ป่าในเอเชีย'),
      13: s('originated on coral islands in the Pacific', 'cultivated differently in America and Pacific', 'ไม่ได้กล่าววิธีปลูก')
    },
    2: {
      1: s('baby talk in a one-on-one context', 'individual attention when talking', 'พูดตัวต่อตัว'),
      2: s('baby brain is engaged in trying to talk back', 'hear and create speech', 'ฟังแล้วฝึกพูด'),
      3: s('wider repertoire of kinds of speech to practice', 'two parents speaking differently', 'พ่อแม่พูดคนละแบบ'),
      4: s('more baby talk parents used, the more their youngsters began to babble', 'baby talk amount and vocalising', 'ยิ่งได้ยิน baby talk ยิ่ง babble'),
      5: s('recording devices and speech-recognition software', 'recording devices', 'อุปกรณ์บันทึก'),
      6: s('dads didn\'t raise their pitch', 'fathers (dads)', 'พ่อ'),
      7: s('bridge hypothesis', 'bridge hypothesis', 'สมมติฐานสะพาน'),
      8: s('wider repertoire of kinds of speech to practice', 'repertoire of speech types', 'คลังภาษา'),
      9: s('audio-recording vests', 'vests', 'เสื้อบันทึกเสียง'),
      10: s('dramatically boosted vocabulary', 'larger vocabulary at age two', 'คำศัพท์'),
      11: s('eleven and a half months… worked harder at motor activations', 'brain activity change before first year', 'สมองเปลี่ยนก่อนครบปี'),
      12: s('play classical music to their pregnant bellies', 'parents act before birth', 'ก่อนคลอด'),
      13: s('infant sounds held babies\' attention nearly 40 percent longer', 'preference for other babies\' sounds', 'ชอบเสียงทารก')
    }
  },
  8: {
    1: {
      1: s('built to transport goods around the world, although some also took passengers', 'originally intended as passenger ships', 'สร้างเพื่อขนสินค้า ไม่ใช่โดยสาร'),
      2: s('cutty sark – an old Scottish name for a short nightdress', 'name of character in poem', 'ชื่อจากชุดนอน ไม่ใช่ตัวละคร'),
      3: s('contract with them put him in a very strong position', 'contract favoured Willis', 'สัญญาเข้าข้าง Willis'),
      4: s('designed to make the journey more quickly than any other ship', 'fastest tea clipper UK–China', 'ออกแบบให้เร็วที่สุด'),
      5: s('Cutty Sark reached London a week after Thermopylae', 'beat Thermopylae despite storm', 'ถึง London ช้ากว่าหนึ่งสัปดาห์'),
      6: s('Steam ships reduced the journey time between Britain and China by approximately two months', 'Suez Canal made steam faster', 'เรือไอน้ำเร็วกว่าหลังคลอง Suez'),
      7: s('canal was of no use to sailing ships', 'steam ships sometimes used ocean route', 'ไม่ได้กล่าวเส้นทางมหาสมุทรของเรือไอน้ำ'),
      8: s('dangerously close to icebergs off the southern tip of South America', 'Woodget risk of iceberg', 'Woodget ใกล้ iceberg'),
      9: s('transporting wool from Australia to Britain', 'main cargo wool', 'ขนแกะ'),
      10: s('excellent navigator', 'captain and navigator', 'นักเดินเรือ'),
      11: s('Badly damaged in a gale in 1922', 'gale damage', 'พายุ'),
      12: s('used Cutty Sark as a training ship', 'used for training 1923–1954', 'ฝึกอบรม'),
      13: s('fire in 2007, and again, less seriously, in 2014', 'damaged by fire 21st century', 'ไฟไหม้')
    },
    2: {
      1: s('decomposing plants and various minerals', 'plant remains and minerals', 'แร่ธาตุ'),
      2: s('lock in their carbon content', 'storing carbon', 'คาร์บอน'),
      3: s('Soils also store water, preventing flood damage', 'holds water', 'น้ำ'),
      4: s('Agriculture is by far the biggest problem', 'main factor agriculture', 'เกษตรกรรม'),
      5: s('not return unused parts of harvested crops directly to the soil', 'nutrients may not be put back', 'ไม่คืนดิน'),
      6: s('release polluting nitrous oxide into the atmosphere', 'synthetic fertilisers damage environment', 'ทำลายสิ่งแวดล้อม'),
      7: s('good crop of plants emerged… roots strong enough to pierce dirt as hard as rock', 'Floris mixture improves plants', 'ปรับปรุงพืช'),
      8: s('easily understood target that can help shape expectations', 'zero net soil degradation awareness', 'รัฐเข้าใจปัญหา'),
      9: s('started out running a tree-care business', 'motivation for soil project', 'แรงจูงใจจากธุรกิจดูแลต้นไม้'),
      10: s('plants die and decay these nutrients are returned directly to the soil', 'soil healthy before farming', 'ธรรมชาติคืนสารอาหาร'),
      11: s('field surveys, drone surveys, satellite imagery, lab analyses', 'ways of collecting information', 'วิธีเก็บข้อมูลหลากหลาย'),
      12: s('protected zones for endangered soils', 'keeping soil safe near future', 'เขตอนุรักษ์ดิน'),
      13: s('no agreed international system for classifying soil', 'difficult to provide overview', 'ไม่มีระบบจำแนกสากล')
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
